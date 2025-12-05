---
title: "シンプルを極める。アンチパターンなDB設計の本質"
source: "https://speakerdeck.com/facilo_inc/sinpuruwoji-meru-antipatannadbshe-ji-noben-zhi"
author:
  - "[[梅林 泰孝]]"
  - "[[Facilo Inc.]]"
published: 2025-12-01
created: 2025-12-05
description: |
  運用コストを最小化し、シンプルさを追求したDB設計の実践的アプローチ。外部キー制約やトランザクションの過剰使用を避け、FileCacheやSQS、OpenSearchを活用した疎結合アーキテクチャを解説。
tags:
  - "clippings"
  - "database"
  - "architecture"
  - "rails"
  - "performance"
  - "best-practices"
---

## 概要

Facilo Inc.のCTO/Co-Founder 梅林泰孝氏による、DB設計における「アンチパターン」を逆手に取ったシンプル志向のアーキテクチャ設計についての発表資料。運用コストを極限まで下げながら、10万DAUでも2vCPU 1台で捌けるシステムを実現した実践的な知見が共有されている。

---

## 発表者プロフィール

**梅林 泰孝** (@ystk_u) - Facilo Inc. CTO/Co-Founder

| 年 | 経歴 |
|---|---|
| 2013年 | Google新卒入社、検索の品質チームに参画 |
| 2014年 | サイバーエージェント転職、AirTrack開発責任者として国内最大規模の位置情報プラットフォームに成長 |
| 2018年 | SmartNews TechLeadとしてシリコンバレーに移住、MAU 2000万超のPush通知基盤をマネジメント |
| 2021年10月 | Facilo共同創業 |
| 2024年2月 | シリーズA 12億資金調達 |
| 2025年2月 | 帰国 |
| 2025年11月 | 従業員64人（内エンジニア19人） |

---

## 1. AssociationとCache

### 課題

親会社 → 子会社 → 従業員という階層構造で、機能のon/offやdefaultの振る舞いを設定。親の設定を子供が上書きできる形で利用されている。

### 解決策：FileCache + Sticky Session

```text
ALB (Sticky Session)
    ↓
   App (FileCache)
```

**ポイント:**

- **脱Redis**: FileCacheを使用
- Userがround robinで違うサーバーにrequestするとcache hitしなくなる可能性
- → **ALBのSticky Session**で同じサーバーに基本的に向くよう設定

**反論への回答:**

- 「偏りが出るのでは？」「cache hit率が低すぎ...」
- → **10万DAUでも2vCPU 1台で余裕で捌けている**
- 縦になるべく大きくしてRedis依存を減らすメリットが大きい
- Redisはマネージドというほどマネージドではない（リシャーディング等）
- **local fileは早い**

---

## 2. ModelとDB設計

### 2.1 外部キー制約は入れない

- `dependent: :destroy`でだいたい十分
- 外部キーがあると実行順序を気にする必要があり**認知コストが増える**
- **書き込み速度が落ちる**
- ぼっちrecordができても参照を失っていることが多く、**実害が出にくい**

### 2.2 トランザクションはあまり貼らない

- トランザクションが必要なほど大切な依存ですか？
- 認知コストが高くなる
- **お金を扱うcriticalな依存**や、ぶっ壊れる可能性がありユーザーインパクトが大きいときのみ利用

### 2.3 Unique制約の考え方

| レイヤー | Unique制約 |
|---|---|
| DB | ✅ 入れる |
| Model | ❌ 入れない |

- 複数サーバー、マルチプロセス、マルチスレッド環境では、modelの制約は厳密ではない
- DBで守っていれば**無駄なSELECTの発行も抑えられる**
- formのエラーメッセージが大切なら工夫を入れる
- UUIDなどはまず被らないので**indexだけ**にして書き込み速度を優先

### 2.4 スキーマレスなJSON Field（store）の活用

検索対象にならない項目はJSON fieldに格納する。

```ruby
store :settings, accessors: [:option1, :option2], coder: JSON
```

**メリット:**

- JSONのようなスキーマレスでも**型として何が入っているか明示**できる
- queryableでないデータは全部JSONに突っ込んでも良い
- **不可逆な変更ではない** - queryしたくなったらadd columnしてパッチ当てれば良い

**注意:**

- だからといってDynamoDBという選択は違う
- latencyの問題
- パッチ当てづらい
- schemaのversioning管理しにくい
- **iterationが回しにくい**

---

## 3. パッチ用のAd-hoc Runner

schemalessなJSON fieldとパッチの**持続可能な運用はセット**で考える。

### 実装方針

```bash
rails g ad_hoc_runner patch_name
```

- 生成物のheaderにgenerateコマンドを書くことで**文化として根付かせる**
- 同じtemplateで作ることで実行の管理をしやすくする
- **migrationに混ぜない** - rollback耐性がなかったりするため
- 日付versioningでgitignoreしたhistory fileで各々管理する

---

## 4. マルチテナント・マルチプロダクトのDBインフラ戦略

### アーキテクチャ

```text
Product A  ─┐
Product B  ─┼─→ Single DB Cluster
Product C  ─┘   (Primary + Replica × N)
                 ↓
              database名で分割
```

### 設計思想：運用コストを極限まで下げる

- 複数クラスターをサービスごとに最適化するのは**コスト**
- 共有でCPUパワーつけたほうが**インフラのエコシステムも享受しやすい**
- 10年前よりハイパフォーマンスで縦にもかなり大きくなる
- **Single Primaryの書き込みがボトルネックには意外とならない**

### 現実的な見積もり

> 更新系は参照系の**5%程度**
>
> プロダクトの性質によるが、**あと10プロダクト**は同じPrimaryに載せられる

ボトルネックになるときは分割すれば良い。そのときは組織サイズも大きくなっており、売上も実際出ているはず。それくらいの作業は重くない。

---

## 5. 疎結合な非同期処理（SQS）

```text
App → SQS → Worker
```

### SQSを選ぶ理由

| SQS | SolidQueue |
|---|---|
| ✅ フルマネージド（安定） | DBの書き込みリソースを消費 |
| 再実行性が高い | Railsに密結合 |
| 他micro serviceから呼びやすい | - |

### 設計ポイント

- RailsのActiveJobやShoryukenのフォーマットに乗らない
- **再実行性**をあげ、他micro serviceから呼びやすくする
- CLIでちょろっとJSON message送るだけでも実行可能
- **脱密結合**

---

## 6. 検索はRailsでやらない（OpenSearch）

```text
App → SQS → Worker (indexing) → OpenSearch
```

### 設計思想

- **Railsで頑張りすぎない**
- OpenSearchへのindexing, querying, analyzingの**interfaceを汎化**
- multi productで活躍する**大きなエコシステム**になる

---

## まとめ：シンプルを極めるDB設計の本質

| 従来の「正しい」設計 | Faciloのアプローチ |
|---|---|
| 外部キー制約を入れる | 入れない（認知コスト・速度低下） |
| トランザクションを適切に使う | 最小限（criticalなケースのみ） |
| Redis等でキャッシュ | FileCache + Sticky Session |
| 正規化されたカラム設計 | JSON field（store）の積極活用 |
| サービスごとにDB分離 | Single DB Cluster |
| SolidQueue等でジョブキュー | SQS（疎結合） |
| Railsで全文検索 | OpenSearch |

**根底にある考え方:**

- 運用コストを極限まで下げる
- 現実的な見積もりを常にする
- 認知コストを減らしシンプルさを追求する
- 問題が起きてから対処しても遅くない（YAGNI）
