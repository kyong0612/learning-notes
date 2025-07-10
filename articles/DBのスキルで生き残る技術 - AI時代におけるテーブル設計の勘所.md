---
title: "DBのスキルで生き残る技術 - AI時代におけるテーブル設計の勘所"
source: "https://speakerdeck.com/soudai/survival-db-skill"
author:
  - "[[soudai sone]]"
published: 2025-07-08
created: 2025-07-10
description: |
  AI時代において、なぜDBスキル、特にテーブル設計が重要であり続けるのかを解説。AIはドメイン知識を理解した未来予測ができず、安易な設計は技術的負債を加速させる。本資料では、変化に強い設計の核となる「正規化」と「Simple is beautiful」の哲学を、具体的なユーザーテーブルの例を交えて詳説し、イミュータブルなデータモデリングの重要性を説く。
tags:
  - "clippings"
  - "DB設計"
  - "テーブル設計"
  - "AI"
  - "正規化"
  - "ソフトウェアエンジニアリング"
---

本資料は、AI時代においてもデータベース、特にテーブル設計のスキルがなぜ重要であり続けるのかを解説したものです。AIは人間の作業を補助する強力なツールですが、ドメイン知識を深く理解し、未来の変更を予測した設計はできません。安易なAIの利用は、かえって技術的負債を増大させる危険性を孕んでいます。

このスライドでは、変化に強く、長期的に価値を提供し続けるデータベース設計の核心として「正規化」と「Simple is beautiful」の哲学を掲げ、その具体的な実践方法を解説します。

## 1. AIは未来を想像してくれない

AI、特にLLMは、既存のデータから「ありそうな」回答を生成することには長けていますが、ドメインの背景やビジネスの未来を理解しているわけではありません。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_2.jpg)

### シングルループ学習 vs ダブルループ学習

AIの学習は、与えられた前提の中で最適化を図る「シングルループ学習」です。しかし、優れた設計には、状況に応じて前提そのものを見直す「ダブルループ学習」が不可欠であり、これは依然として人間の重要な役割です。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_15.jpg)

### AIによる技術的負債の加速

AIは、世の中の多くの「EasyだがDirty」な設計を学習してしまいがちです。これにより、初期開発は速く進むかもしれませんが、変更容易性の低い設計が生まれ、結果として技術的負債の蓄積ペースを早めてしまいます。これはMartin Fowlerの言う「生産性の交差点」がより手前に来てしまうことを意味します。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_20.jpg)

データベースの寿命はアプリケーションよりも遥かに長いため、初期の安易な設計は将来に渡って大きな負債となります。将来を見据えたテーブルの修正（リファクタリング）を怠ると、新たな仕様追加に対応できなくなります。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_23.jpg)

## 2. 正規化と Simple is beautiful

変化に強いデータベース設計の道は、すべて「正規化」に通じます。正規化は、データを本質的な形で捉え、シンプルに保つための強力な指針です。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_32.jpg)

### 正規化のコツ

正規化の目標は、シンプルで堅牢なデータ構造を作ることです。以下の点を意識することで、良い設計に近づきます。

* **事実だけを保存する**: 導出可能な情報（例: 年齢）ではなく、元となる事実（例: 生年月日）を保存します。
* **重複をなくす**: 同じ情報が複数の場所に存在しないようにします。
* **不整合をなくす**: データが矛盾した状態にならないようにします。
* **NULLをなくす**: `NULL`は多くの問題の根源です。`NULL`が必要になる設計は、テーブル分割のサインかもしれません。
* **ライフサイクルが違うデータを混ぜない**: 状態や種別が異なるデータは、別のテーブルに分離します。
* **INDEXの数に注目する**: 検索目的のINDEXが多い（目安として4つ以上）テーブルは、責務が大きすぎる可能性があります。

### Unix哲学と1テーブル1責務

正規化の考え方は「小さく、うまくやる」というUnixの哲学と共通しています。

* **Small is beautiful**: 1つのテーブルは1つの責務だけを持つべきです。
* **Make each program do one thing well**: 責務を集中させることで、シンプルで変更に強いテーブルになります。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_43.jpg)

### SimpleとEasyは違う

「手軽（Easy）」な設計と「本質的で単純（Simple）」な設計は異なります。安易な対応は複雑さを生み、将来の変更を妨げます。Simpleな設計を目指すことが、結果的に開発スピードと品質を両立させます。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_46.jpg)

### 具体例: ユーザー認証テーブルの設計

よくある`users`テーブルにメールアドレス、パスワード、LINEのIDなどをすべて詰め込む設計を考えてみましょう。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_50.jpg)

ここに新たな認証方法（例: LINE認証）を追加するために安易にカラムを追加すると、以下のような問題が発生します。

* メール/パスワードが必須ではなくなり、`NULL`を許可する必要が出てくる。
* `UNIQUE`制約の維持が困難になる。
* 機能開発のための変更が、ビジネス側に「パスワード未設定ユーザーにはメールを送れない」といった不要な制約を生み出してしまう。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_56.jpg)

**解決策は「大きく捉えて小さく作る」こと**、つまり正規化です。ユーザー情報（`members`）と認証情報（`authentications`）をテーブルに分割します。これにより、認証方法がいくつ増えても、`members`テーブルには影響がなく、システム全体が変化に強くなります。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_60.jpg)

### イミュータブルデータモデリング

更新（UPDATE）を避け、事実の発生（INSERT）のみでデータを追記していく「イミュータブルデータモデリング」も、変化に強く、追跡しやすい設計として非常に重要です。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_62.jpg)

## 3. おわりに

データモデリングは、一度身につければ長く活用でき、複利で効果を発揮する重要なスキルです。AIに代替されるのではなく、AIを賢く利用して、より本質的な設計に時間を使いましょう。

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_67.jpg)

データモデリングの歴史は長く、学ぶべき優れた書籍や資料は豊富にあります。正しい知識を学び、「できる」という経験を積むことが大切です。

**今、こだわり抜いた設計が、未来のあなた自身を救います。**

![](https://files.speakerdeck.com/presentations/7950fd3ddb194f7da1f789bc94d9c48b/slide_76.jpg)

ご清聴ありがとうございました。
