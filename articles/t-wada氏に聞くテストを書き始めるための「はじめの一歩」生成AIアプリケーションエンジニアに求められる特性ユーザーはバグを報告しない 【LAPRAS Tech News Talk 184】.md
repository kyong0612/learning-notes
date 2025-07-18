---
title: "t-wada氏に聞くテストを書き始めるための「はじめの一歩」/生成AIアプリケーションエンジニアに求められる特性/ユーザーはバグを報告しない 【LAPRAS Tech News Talk #184】"
source: "https://www.youtube.com/live/swftTvcHTak"
author:
  - "LAPRAS公式"
published: 2024-06-09
created: 2025-01-16
description: |
  t-wada氏によるテスト駆動開発の実践論、生成AIアプリケーションエンジニアに求められるスキル、ユーザーのバグ報告行動、TODOリスト活用法について解説した技術トークの要約
tags:
  - testing
  - tdd
  - legacy-code
  - generative-ai
  - bug-report
  - productivity
  - engineering
---

# テストを書き始めるための「はじめの一歩」

## テスト駆動開発（TDD）とは

- **TDD（Test Driven Development）**は、ソフトウェア開発において「テストを書く→コードを書く→リファクタリングする」というサイクルを繰り返す開発手法です。
- 目的は、バグの早期発見や保守性の高いコードを実現することです。

## レガシーコードへのテスト導入

- レガシーコードとは、テストが書かれていない、もしくは保守が難しい古いコードのこと。
- テストがない状態から始める場合、まずは「自動化できる作業（ビルドや書類作成など）」から自動化し、学習やテスト導入の余裕を作る。
- 経営層や意思決定者には、自動テストの重要性を説明し、リソース確保を促す。

## テストの書き方・考え方

- 「こうなったらうれしい」を細かく分解し、1つのテストで動作確認できる単位に落とし込む。
- 例：レシート画像から家計簿を自動作成するアプリなら、「画像から項目抽出」「アップロード機能」などをさらに細かく分解。
- テスト容易性（テストのしやすさ）は「観測容易性」「制御容易性」「対象の小ささ」で決まる。
- テストしやすい部分から始め、徐々に範囲を広げる。

## TDDの実践

- TDDは「ゴールから逆算」ではなく、「不確実な領域を少しずつ切り崩す」作業。
- テストを書きながら、分かったこと・気づいたことを「テストリスト」に記録し、設計力も養う。
- レガシーコードには、まずE2Eテスト（エンドツーエンドテスト）やインテグレーションテストで全体を粗くカバーし、徐々にユニットテストを増やしていく。

# 生成AIアプリケーションエンジニアに求められる特性

## 生成AIとは

- **生成AI（Generative AI）**は、学習したデータをもとに新しいテキスト・画像・音声などを自動生成するAI技術です。
- 代表例：ChatGPT、画像生成AIなど。

## エンジニアに求められるスキル・特性

- **学び続ける姿勢**：技術進化が速いため、常に新しい知識を吸収し続けることが重要。
- **デジタルリテラシー**：AIや機械学習の仕組み、リスク（情報漏洩・著作権・ハルシネーション）への理解。
- **プロンプト設計スキル**：AIに最適な指示（プロンプト）を出す力。
- **クリエイティブな発想力**：AIが自動化できない部分（ユーザー体験設計や課題発見など）で人間ならではの価値を発揮する。
- **アジャイルな開発スタイル**：生成AIは不確実性が高いため、アジャイル開発やプロトタイプ駆動開発が有効。
- **チーム連携・コミュニケーション力**：分業や専門分化が進む中で、他職種と連携しながら開発を進める力も重要。

# ユーザーはバグを報告しない

## バグ報告の現実

- 多くのユーザーは、バグを見つけても報告しない傾向がある。
- 理由：
  - バグ報告は手間がかかる（発生手順や現象を言語化するのが面倒）。
  - 報告しても歓迎されない、無視されると感じる。
  - 曖昧な報告や再現手順が不明確なものは開発側で活用しづらい。

## バグ報告の質を高めるポイント

- どのような状態で、どのような操作をして、何が起こったかを具体的に伝える。
- エラーメッセージやエラーコードを正確に記載する。
- 再現手順や発生頻度を明確にする。
- 環境情報（OS、バージョンなど）も添える。

## 現場での対策

- バグ報告をしやすい仕組みや文化づくりが重要。
- 報告の手間を減らすツールの導入や、報告しやすい雰囲気づくりが求められる。

# ゲームから学ぶTODOリスト活用法

- タスク管理やTODOリストをゲーム感覚で楽しく続ける方法も紹介。
- 例：Habitica（タスク達成でアバターが成長）、タスクビンゴ（タスクをビンゴ形式で管理）など。
- ゲーム的要素（報酬やレベルアップ）でモチベーションを維持しやすい。

---

この動画は、現場で役立つテスト導入の実践論、生成AI時代のエンジニア像、ユーザーとバグ報告の現実、そしてタスク管理の工夫まで、教科書的に体系立てて解説しています。
