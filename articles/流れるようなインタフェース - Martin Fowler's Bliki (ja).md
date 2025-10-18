---
title: "流れるようなインタフェース - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/FluentInterface"
author:
  - Martin Fowler
published: 2005-12-20
created: 2025-10-18
description: |
  流れるようなインタフェース（Fluent Interface）の概念について解説。ドメイン特化言語（DSL）のようなAPIを設計することで、読みやすく流れるようなコードを実現する手法。メソッドチェーンや戻り値の工夫により、コードの可読性と表現力を向上させる設計パターン。
tags:
  - API design
  - domain specific language
  - DSL
  - fluent interface
  - design pattern
  - メソッドチェーン
---

## 概要

流れるようなインタフェース（Fluent Interface）は、Eric EvansとMartin Fowlerが名づけたインターフェース設計のスタイル。内部ドメイン特化言語（DSL）のような読みやすさを実現し、コードを自然言語に近い形で記述できるようにする手法。

## 基本的な考え方

### 従来のスタイル

通常、オブジェクトの組み立てには以下のような冗長なコードが必要：

```java
private void makeNormal(Customer customer) {
    Order o1 = new Order();
    customer.addOrder(o1);
    OrderLine line1 = new OrderLine(6, Product.find("TAL"));
    o1.addLine(line1);
    OrderLine line2 = new OrderLine(5, Product.find("HPK"));
    o1.addLine(line2);
    OrderLine line3 = new OrderLine(3, Product.find("LGV"));
    o1.addLine(line3);
    line2.setSkippable(true);
    o1.setRush(true);
}
```

### 流れるようなスタイル

同じ処理を流れるように記述：

```java
private void makeFluent(Customer customer) {
    customer.newOrder()
            .with(6, "TAL")
            .with(5, "HPK").skippable()
            .with(3, "LGV")
            .priorityRush();
}
```

## 具体例

### TimeAndMoneyライブラリ

**従来の方法：**

```java
TimeInterval meetingTime = new TimeInterval(fiveOClock, sixOClock);
```

**流れるような方法：**

```java
TimeInterval meetingTime = fiveOClock.until(sixOClock);
```

### JMockライブラリ

モックライブラリの期待値設定において、非常に読みやすいAPIを提供：

```java
mock.expects(once()).method("m").with(
    or(stringContains("hello"),
       stringContains("howdy"))
);
```

## 設計上の特徴

### 戻り値の活用

- **従来の慣習**: 変更メソッドは`void`を返す（コマンド・問い合わせの分離原則）
- **流れるようなスタイル**: メソッドチェーンを可能にするため、適切なオブジェクトを返す
- 返り値の型は、次に必要になる操作に応じて選択される

### 型システムとの相互作用

- 静的型言語では、IDEのメソッド補完（インテリセンス）により次に利用可能なメソッドが分かる
- 型が変わることで、文法的に正しい操作のみが提示される
- DSLには動的型言語が向いているが、メソッド補完により静的型言語でも利点がある

## メリット

1. **可読性の向上**: コードが自然言語に近く、意図が明確
2. **表現力**: ドメイン固有の概念を直接的に表現可能
3. **IDE支援**: メソッド補完により次の操作が分かりやすい
4. **簡潔性**: 冗長な一時変数や中間ステップを削減

## デメリットと課題

### ドキュメンテーションの困難さ

- 個別のメソッド（例：`with()`）だけを見ても意図が不明確
- メソッドブラウザでは文脈が失われる
- 流れるようなアクションの文脈でのみ意味が明確になる

### 設計コスト

- シンプルなコンストラクタやセッターは簡単に実装できる
- 流れるようなAPIの設計には時間と長考が必要
- 使いやすく読みやすいAPIにたどり着くまでに試行錯誤が必要

### 対策

- ビルダーオブジェクトを使用し、流れるような文脈でのみ使われるようにする
- これにより、通常のオブジェクトと流れるような構築用オブジェクトを分離できる

## 適用領域

### バリューオブジェクトの組み立て

Eric Evansによると、流れるようなインタフェースは主にバリューオブジェクトの組み立てで使用されてきた：

- バリューオブジェクトはドメイン非依存
- 簡単に作成・破棄が可能
- 古いバリューから新しいバリューを作成する際に流れが生まれる

### 宣言的文脈

- モックライブラリ（JMock）での期待値設定
- 複雑な振る舞いの仕様記述
- DSL的な構文が必要な場面

## 判断基準

流れるようなインタフェースかどうかの試金石：

- **ドメイン特化言語の特性を持つか**
- コードを読んだときに流れを感じるか
- 自然言語に近い表現になっているか

## 参考実装

### JMock

- モックライブラリの代表例
- 複雑な期待値（エクスペクテーション）の設定に流れるようなAPIを使用
- Steve FreemanとNat PriceによるOOPSLA論文で進化の過程が解説されている

### 関連リンク

- [ひがやすを blog: 流れるようなインターフェースと脱CoC](http://d.hatena.ne.jp/higayasuo/20071018#1192681950)
- [ひがやすを blog: 流れるようなインターフェース](http://d.hatena.ne.jp/higayasuo/20071019#1192757543)
- [Piers Cawleyのフォローアップ記事](http://www.bofh.org.uk/articles/2005/12/21/fluent-interfaces)

## 結論

Martin Fowlerは、流れるようなインタフェースについてはまだ経験が浅いため、明確な結論は出していないが、より多くの試行を推奨している。設計に時間がかかる代償はあるものの、コードの可読性と表現力を大幅に向上させる可能性を持つ設計パターンである。
