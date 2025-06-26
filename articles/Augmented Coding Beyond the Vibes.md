---
title: "Augmented Coding: Beyond the Vibes"
source: "https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes"
author:
  - "Kent Beck"
published: 2025-06-25
created: 2025-06-25
description: |
  I recently came to a good stopping spot on an ambitious project to build a B+ Tree library using augmented coding. The result is BPlusTree3 - a performance-competitive, maybe-production-ready implementation in Rust & Python. I sat down with a friend to tell my story and reflect on what it reveals about the future of programming in the GenAI era.
tags:
  - "Augmented-Coding"
  - "TDD"
  - "Rust"
  - "Python"
  - "GenAI"
  - "Software-Development"
---

## 要約

ケント・ベック氏が、AI支援によるプログラミング（Augmented Coding）を用いてB+ TreeライブラリをRustとPythonで実装したプロジェクト「[BPlusTree3](https://github.com/KentBeck/BPlusTree3)」についての考察。

### プロジェクトの動機

* 過去に技術的に困難で断念した特別目的のデータベース開発を、Augmented Codingの力で再挑戦しようとした。
* その過程でB+ Treeデータ構造の理解が不十分だと気づき、ターゲットをB+ Treeの実装に絞った。
* 同時に、Augmented Codingが本番環境で通用するパフォーマンスのライブラリコードを作成できるか、またRustを学習する機会とした。

### "Augmented Coding" と "Vibe Coding" の違い

* **Vibe Coding**: コードの品質は気にせず、システムの振る舞いだけを重視する。エラーが出たらAIに修正を投げるだけ。
* **Augmented Coding**: 手書きのコーディングと同様に、コードの品質、複雑さ、テストカバレッジを重視する。ただし、コードの多くはAIが記述する。

### 開発プロセスとAIとの協調

* 当初、AIにTDD（テスト駆動開発）をさせようとしたが、複雑性が増しすぎてAIが失速したため、2度失敗した。
* 3回目の試み（BPlusTree3）では、設計により深く関与し、AIが先走りしてコーディングするのを抑制した。
* AIが非生産的な開発に陥る兆候（ループ、要求していない機能の実装、テストの無効化など）を注意深く監視し、介入した。

### 驚きと発見

* Rustでの開発が行き詰まった際、実験的にPythonでアルゴリズムを固め、そのPythonコードをAIにRustへ翻訳させたところ、停滞を打破できた。
* AIの提案でPythonライブラリのパフォーマンス向上のためにC拡張機能を実装させ、Pythonの組み込みデータ構造に匹敵する速度を達成した。

### Augmented Codingがもたらす変化

* プログラミングは依然としてプログラミングであり、喜びが失われるわけではない。
* 退屈な決断が減り、1時間あたりにより重要なプログラミングの意思決定を下せるようになる。
* カバレッジテスターの導入など、これまで環境構築の手間で諦めていたような「ヤクの毛刈り（Yak shaving）」がなくなる。

### 結論

* Augmented Codingはプログラミングの未来であり、開発者の経験をより良いものにする。
* コードの品質へのこだわりは依然として重要だが、その達成方法は変化する。
* AIを単なる「コード生成機」ではなく、設計やリファクタリングのパートナーとして活用することで、より複雑な課題に取り組むことが可能になる。

### 付録

* **System Prompt**: 開発に使用したAIへの指示プロンプトが公開されている。TDDとTidy Firstの原則に従うことを厳密に指示している。
* **費やした時間**: プロジェクトには約4週間を費やした。コミットのペースも記録されている。

    [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F588ca4a9-1872-4202-aea1-d7005ada1bf5_535x428.png)](https://substackcdn.com/image/fetch/%24s_%219AVy%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/588ca4a9-1872-4202-aea1-d7005ada1bf5_535x428.png)

    [![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcf871925-f944-4199-ae72-b42e3dd0afdb_406x467.png)](https://substackcdn.com/image/fetch/%24s_%21Lwjp%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A//substack-post-media.s3.amazonaws.com/public/images/cf871925-f944-4199-ae72-b42e3dd0afdb_406x467.png)
