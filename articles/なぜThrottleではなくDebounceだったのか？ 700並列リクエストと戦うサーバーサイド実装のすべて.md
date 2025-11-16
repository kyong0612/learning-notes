---
title: "なぜThrottleではなくDebounceだったのか？ 700並列リクエストと戦うサーバーサイド実装のすべて"
source: "https://speakerdeck.com/yoshiori/nazethrottledehanakudebouncedatutanoka-700bing-lie-rikuesutotozhan-usabasaidoshi-zhuang-nosubete"
author:
  - "[[Yoshiori SHOJI]]"
published: 2025-11-14
created: 2025-11-16
description: "YAPC::Fukuoka 2025での発表。700並列の分散テスト実行結果を受け取る際に発生した負荷問題を、サーバーサイドDebounce実装で解決した実践的な事例。ThrottleではなくDebounceを選んだ理由、Redisを使ったマルチサーバー対応、Race Conditionの解決、v1からv3までの進化を解説。"
tags:
  - "clippings"
  - "サーバーサイド"
  - "Debounce"
  - "Throttle"
  - "Redis"
  - "並列処理"
  - "負荷対策"
  - "YAPC"
---

# なぜThrottleではなくDebounceだったのか？ 700並列リクエストと戦うサーバーサイド実装のすべて

## 概要

YAPC::Fukuoka 2025での発表。700並列の分散テスト実行結果を受け取る際に発生した負荷問題を、サーバーサイドDebounce実装で解決した実践的な事例。ThrottleではなくDebounceを選んだ理由、Redisを使ったマルチサーバー対応、Race Conditionの解決、v1からv3までの進化を解説。

## 課題背景

### テスト結果収集システム

- テスト結果を収集し、AIを使って様々な処理を実行
  - 失敗したテストの原因が同じかどうかを判断
  - 同じ原因で失敗したテストが過去にあったか判断
  - リトライして成功しているかどうか
  - SlackやGithubなど各種通知

### 分散テスト実行

- CIでのテスト実行に時間がかかるため、複数台で実行
- テストをある程度のまとまりごとに分けて実行
- ほぼ同時に終わる = ほぼ同時に結果が送られる
- **つまり、同時に大量のテスト結果が送られてくる**

### 700並列リクエストの発生

- 700並列でテストを実行しているお客さんが顧客になる
- 700個のテストではなく、一回テスト実行すると700台で分散実行される
- 非同期にしたりジョブキューに入れてもあまり効果ない（700個のキューが貯まるだけ）
- Close処理はまとめられる
  - 700並列のテスト結果データは保存必須
  - その後のClose処理はある程度まとめて実行して良い
  - 良い感じにデータ溜まったあとにClose処理したい
  - つまりClose処理部分を間引く必要がある

## ThrottleとDebounceの違い

### Throttle（スロットル）

- 待ち時間内に何回イベントが発生しても待ち時間後に1回だけ処理を実行する
- 例：5秒に1回とか...わかりやすい

### Debounce（デバウンス）

- 待ち時間内に次のイベントが発生すると、タイマーがリセットされ、処理の実行が遅延する
- 特定のイベントが短期間に連続して発生した際に、タイマーによる入力遅延を利用して都度実行されないようにする仕組み

#### 例：GUIのWindowリサイズ

- サイズ変更時に逐次再描画してしまうと負荷が高いので、マウスドラッグが止まったときに描画
- Throttleと組み合わせて0.1秒単位で低解像度で描画して、ドラッグが止まったら本格的に描画

#### 例：入力サジェスト

- 1文字づつデータ送って処理をしていると負荷も高くなるので、500ms以上入力がなかったら送信

### なぜDebounceだったのか？

- ほぼ同時とはいえ送られてくるタイミングにはある程度の振り幅がある
- ThrottleよりDebounceのほうがより処理をまとめられる
- リクエストが来るタイミングの振り幅を考慮すると、Debounceの方が効率的

## サーバーサイドDebounceの課題

### クライアントサイドとの違い

- クライアントサイドのDebounceはサーバへの負荷軽減が主な目的
- サーバへのリクエストを減らすため、クライアントサイドでDebounceする
- JavaScriptなどでは良くライブラリになっている

### サーバーサイドでの課題

- クライアント多数（今回は700個）
- サーバも複数
- リクエストはそれぞれ別のサーバに来る
- **これを1つのDebounce処理にする必要がある**

## Server-Side Debounce v1

### 基本アプローチ

RedisをロックオブジェクトにしたDebounce処理

```java
@Async
public waitAndClose(int testSessionID){
    UUID myId = UUID.create();
    cache.set(testSessionID, myId);
    Thread.sleep(5 * 100);
    UUID latest = cache.get(testSessionID);
    if(myId == latest){
        testSessionsService.close(testSessionID);
        cache.del(testSessionID);
    }
}
```

### 動作の説明

1. 呼び出されたらUUIDを生成してRedisに保存し500ms待つ
   - 呼び出しは@Asyncを使い非同期に呼び出す
   - KeyはTestSessionのID
   - UUIDは他のリクエストとの区別のために使う

2. 500ms後にRedisから値を取得し照合する
   - 値が同じなら処理実行
   - 値が書き換わっていない=他の呼び出しはない

3. 500ms内にもう一度呼ばれていたら
   - 後から呼ばれたほうが実行

### 特徴

- サーバ跨いで処理するのでsynchronizedは使えない
- Redisをロック機構に使う（Redisは基本処理がAtomicなので便利）
- サーバ再起動の時に処理が失われる可能性がある（99%はこれで上手く行くのでもっと余裕が出来たら考える）

### Race Conditionの問題

処理の最後にRedisから値を消しているところで問題が発生

- このタイミングで別のリクエストがあるとUUID消されているので何もアクションしなくなる

**対応案：**

- 削除時、Keyだけではなく値も一致してる時だけ消す
- RedisのLuaスクリプト実行でatomicに実行

```lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
else
    return 0
end
```

## Server-Side Debounce v2

### 新たな課題

- もう少し間隔が長くてたくさん送ってくるテナントも発生
- 運用してたらリクエストが10秒のdelayの直後に再発生することが多く観測された
- 1分のdelayの方が多くのケースで最適であり、不必要な処理を大幅に削減できることがわかった

### 相反する2つの課題

1. **重い処理なのでなるべくまとめて実行したい**
   - OpenAIのAPI呼び出しなどもあるので逐次実行するとお金もかかりすぎる
   - 出来ればdelay5分とかにしたい
   - 負荷対策など主に運営側の問題

2. **ユーザーにはなるべく早く届けたい**
   - 通知やテスト結果の色々な情報など
   - これはサービスの価値やクオリティの話

### v2の解決策：即時実行と遅延実行の合わせ技

- 最初の呼び出しは即実行
- 2回目以降の呼び出しはdelayが長めのDebounce
- 最後の実行は最後の呼び出しから5分後になる

**実装：**

- RedisのSETコマンドのGETパラメータを使用
- 値をsetした時にもともと入っていた値を返してくれる
- 前の値がなかったら即時実行

```java
if (cache.setGet(key, uuid) == null) {
    runnable.run();
    return;
}
```

### v2の問題点

- テストの量が大量なので2つに分割して送ってるテナントもいた
- 2分割を送信時、v2だと：
  - 1個目のリクエストは即時実行
  - 2個目のリクエストは遅延実行（5分後）
- 最終結果がなかなか届かない

## Server-Side Debounce v3

### 解決アプローチ：Delayをフレキシブルにする

JavaなどのListの内部実装のように、初期割り当てよりも多くのデータを受信したときに配列を拡張するようなもの。同じようにDelayを時間に基づいて拡張していく。

### v3の動作

- delayをリクエスト間隔に基づいて拡張していく
- 最初は短いdelayでDebounce（初期値は5秒とか短めに）
- 次のリクエストが来たら拡張
  - 一個前のリクエストの時間との差分を取る
  - 差分が前回のdelayより多かったら差分の方を次のdelayにする
  - 極端にならないように最小値、最大値は決めておく

### 実装

UUIDの変わりに、リクエスト時間とdelayを保持するValueObjectを作成

```java
public record CallTrack(Instant time, Duration delay) implements Serializable {
    Instant scheduledAt() {
        return time.plus(delay);
    }
}
```

delay決定ロジック：

```java
@VisibleForTesting
static CallTrack calculateNextCallTrack(@Nullable CallTrack prev, Instant now) {
    if (prev == null) {
        return new CallTrack(now, DEFAULT_MINIMUM_DELAY);
    }
    Duration observedInterval = Duration.between(prev.time(), now);
    Duration delay = min(max(prev.delay(), observedInterval), MAX_DELAY);
    return new CallTrack(now, delay);
}
```

### v3の特徴

- 間隔が短いときはv1に似た動きになる
- 間隔が長いときはv2に似た動きになる（即時実行と遅延実行に似ている）
- 2分割送信時のときも問題なし（v1のときと同じただのdebounce処理になるだけ）

#### 全体のコード量

30行以下

## まとめ

### Server-Side Debounceの実装について3回やってきた感想

- サーバを跨いだマルチスレッドプログラミング
  - atomicな処理が必要だったり楽しい
- 現実は複雑だ...
  - 3回書き直すとは...でも解決できてよかった！！
- コード自体は至極シンプルに
  - 30行以下で実装出来てるの自分でもビビる
  - やっぱりシンプルなコードで複雑な問題に対応できるの楽しい
- やっぱりボスがロックスターだと便利w

### v4 作るなら

- workspace毎にdelayのデータを貯めたい
  - データを元に外れ値弾いたり平均だしたりして初回debounceから適切な時間を使えるように
- JobQueueにする
  - 間引く仕組みは出来たのでAWS SQSとか使ってJobQueueにして完全に処理を移譲したい
  - ただし今のようにlambdaでさくっと書けたりしなくなるので悩ましい

## 重要なポイント

1. **ThrottleではなくDebounceを選んだ理由**
   - リクエストが来るタイミングの振り幅を考慮すると、Debounceの方が処理をまとめやすい

2. **サーバーサイドでの実装の難しさ**
   - マルチサーバー環境でのatomic処理が必要
   - RedisのLuaスクリプトを活用したatomic操作

3. **段階的な改善**
   - v1: シンプルなDebounce（Race Condition対応）
   - v2: 即時実行と遅延実行の組み合わせ（相反する課題への対応）
   - v3: フレキシブルなdelay調整（様々なケースへの対応）

4. **シンプルなコードで複雑な問題を解決**
   - 全体で30行以下のコードで実装
   - 理解は難しいが、実装はシンプル
