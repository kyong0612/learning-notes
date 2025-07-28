---
title: "TypeScript 上達の道"
source: "https://speakerdeck.com/ysknsid25/typescript-shang-da-nodao"
author:
  - "Kanon"
published: 2025-07-25
created: 2025-07-28
description: "QiitaTechFesta 2025 (#QiitaTechFesta) で発表された、TypeScriptのスキルを向上させるための具体的な学習ステップに関する登壇資料の要約です。"
tags:
  - "TypeScript"
  - "Type-Challenges"
  - "プログラミング学習"
  - "型システム"
  - "技術記事"
---

本資料は、Kanon氏によるQiitaTechFesta 2025での登壇内容をまとめたものです。TypeScriptのスキルを「わかる」から「できる」へと引き上げるための、具体的な学習ロードマップを提示しています。

## 1. このセッションのゴール

![slide_1](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_1.jpg)

本セッションは、紹介される学習方法を参考に、視聴者が「TypeScriptを練習してみよう」と思ってもらうことを目標としています。

---

## 2. 自己紹介と前提

![slide_2](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_2.jpg)

発表者のKanon氏は、TypeScriptの型パズル集である[Type Challenges](https://github.com/type-challenges/type-challenges)のメンテナーであり、全問を解いた経験を持ちます。

### 補足: Type Challengesとは

![slide_3](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_3.jpg)
![slide_4](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_4.jpg)

`any`で定義された型を、適切な型定義に修正していく形式の型パズル集です。

### 注意事項

![slide_7](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_7.jpg)

本資料で紹介する方法は発表者の個人的な経験に基づくものであり、効果を保証するものではありません。また、内容はTypeScriptの「型」に特化しています。

---

## 3. TypeScript上達の定義とレベル分け

### 「わかる」から「できる」へ

![slide_10](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_10.jpg)

上達とは、単に書かれた型を**読める（わかる）**だけでなく、TypeScriptの機能を使いこなして自ら**型を作れる（できる）**状態になることと定義します。

### 型を使いこなすための5つのレベル

![slide_12](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_12.jpg)

自身のスキルレベルを把握するため、以下の5段階のレベルが定義されています。

* **Lv. 1: 基本的な型注釈**
  * `number`, `string` などの基本型や、関数の引数・戻り値に型を付けられる。
    ![slide_13](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_13.jpg)
* **Lv. 2: 型エイリアスとインターフェースの活用**
  * `type` や `interface` を使い、再利用性の高い構造化されたデータ型を定義できる。
    ![slide_14](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_14.jpg)
* **Lv. 3: ユニオン型・リテラル型・列挙型の活用**
  * 型の制約を利用して、不正な値を防ぎ、コードの堅牢性を高めることができる。
    ![slide_15](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_15.jpg)
* **Lv. 4: ジェネリクスの活用**
  * 型の再利用性と汎用性を高めつつ、安全性を確保できる。OSSのコードを理解する上でも重要なスキル。
    ![slide_16](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_16.jpg)
* **Lv. 5: 条件型・マッピング型・インデックス型の応用**
  * `Conditional Types`, `Mapped Types`, `Index Access Types` (`infer`, `as`, `keyof`, `typeof` 等) を組み合わせて、複雑で抽象的な型を構築できる。
    ![slide_17](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_17.jpg)

---

## 4. レベル別学習ロードマップ

![slide_18](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_18.jpg)

### ステップ1: 「わかる」を目指す (Lv. 1 ~ 5)

* **Lv. 1 ~ 3: ドキュメントや書籍で基礎固め**
  * [公式ドキュメント](https://www.typescriptlang.org/docs/)
  * [サバイバルTypeScript](https://typescript-jp.gitbook.io/deep-dive/)
  * [プロを目指す人のためのTypeScript入門（通称：うひょ本）](https://gihyo.jp/book/2022/978-4-297-12747-3)
    ![slide_20](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_20.jpg)

* **Lv. 4 ~ 5: 実用的なコードから学ぶ**
  * [type-fest](https://github.com/sindresorhus/type-fest) のようなUtility Typeライブラリのソースコードを読む。
  * ジェネリクスやConditional Typesの具体的な使われ方を理解する。
  * 不明な点は公式ドキュメントで確認し、知識を往復させながら定着させる。
    ![slide_21](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_21.jpg)
    ![slide_22](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_22.jpg)

### ステップ2: 「できる」を目指す (Lv. 1 ~ 5)

* **Type Challenges に取り組む**
  * **注意点:** いきなり挑戦すると挫折しやすいため、ステップ1で基礎知識を「わかる」状態にしてから取り組むことを推奨。
  * `hard`レベルは実用性が低い問題も多いため、まずは`medium`レベルまでを繰り返し解く（3周程度が目安）。
  * これをこなすことで、実践的な場面でも自然と型が書けるようになり、OSSライブラリの型定義もスムーズに読めるようになる。
    ![slide_23](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_23.jpg)

---

## 5. まとめ

![slide_30](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_30.jpg)

Kanon氏が提案するTypeScript上達への道は以下の通りです。

1. **自分のレベルを把握する**: まずは5段階のどのレベルにいるかを認識する。
2. **レベルに応じたトレーニング**:
    * **読む**: 公式ドキュメントや書籍で基礎を固める。
    * **読む**: `type-fest`などのライブラリコードから実践的な使い方を学ぶ。
    * **解く**: Type Challengesで知識をアウトプットし、「できる」レベルに引き上げる。
3. **知識の往復**: 知らない概念が出てきたら、その都度ドキュメントに戻って学習する。
4. **継続は力なり**: とにかく手を動かし続ける。

---

![slide_31](https://files.speakerdeck.com/presentations/28f39e2c899c4fb4971780159f21f69c/slide_31.jpg)
