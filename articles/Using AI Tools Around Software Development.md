---
title: "Using AI Tools Around Software Development"
source: "https://speakerdeck.com/inouehi/using-ai-tools-around-software-development"
author:
  - "Hiroki Inoue"
published: 2025-06-11
created: 2025-06-18
description: "AI Engineering Summitプレイベントでの『開発周辺におけるAIツール活用 ー雑感やメンタルモデルを添えてー』と題したプレゼンテーション。SmartRound Inc.のソフトウェアエンジニア・エンジニアリングマネージャーによる、開発現場でのAIツール活用の実例と所感を紹介。"
tags:
  - "AI"
  - "開発ツール"
  - "ソフトウェア開発"
  - "AI活用"
  - "エンジニアリング"
  - "Devin"
  - "Cursor"
  - "コーディングエージェント"
---

## 概要

本プレゼンテーションは、AI Engineering Summitプレイベント（2025年6月11日）で発表された、開発周辺におけるAIツール活用についての発表資料です。SmartRound Inc.のHiroki Inoue氏が、実際の開発現場で活用しているAIツールの紹介とその雑感、AIツールと対峙する際のメンタルモデルについて語ったものです。

## 発表者プロフィール

- **発表者**: Hiroki Inoue（井上寛樹）
- **所属**: SmartRound Inc.（株式会社スマートラウンド）
- **職種**: ソフトウェアエンジニア・エンジニアリングマネージャー
- **技術スタック**: KotlinやTypeScript、IntelliJやCursorを使用
- **現状**: 入社半年程度で、ドメインも技術スタックも非連続的な環境

## 発表の背景・動機

発表者は新しい職場環境で以下の課題に直面していました：

- **早く役に立ちたい**
- **早くキャッチアップしたい**
- **会社やチームや同僚のことを理解したい**
- **学ぶこと、知りたいことが多い**

これらの課題解決にAIツールを積極的に活用している状況について発表されました。

## 現在のAI状況に対する見解

### AIツールの課題

- **AIツールが多すぎる**
- **変化が早すぎる**
- **どれを使うべきかわからない**
- **どう使うべきかわからない**（ベストプラクティスの提案が多すぎて陳腐化が早い）

### 解決のアプローチ

- **併用主義**: 「どれを」ではなく「どれも」の姿勢で併用
- **拙速な選択と集中は控える**
- **拙速な最適化は控える**

## AIの得意分野と限界（2025年6月時点）

### 得意なこと

- **変換**
- **要約**
- **探しもの**
- **模倣**
- **繰り返し**

### 現在の限界

- ✅ プロトタイプ開発ならば一定任せられるかもしれない
- △ 出荷には耐えられない品質
- 包括的な設計判断はまだ難しい
- 人間をサポートする存在として機能

### AIと人間の関係性

- **人間がWhatを示し、AIがHowを提案する関係性**
- **AIがHowを提案し、人間が判断を下す関係性**

### アウトカムとアウトプットへの影響

**アウトカム面での恩恵**：

- プロトタイプが作りやすく、ニーズ確認コストが下がりスピードが上がる
- 作るべきもの・作らないべきものの見極めがやりやすい
- "運用でカバー"的な人手作業を代替し、不急機能の開発を回避できる

**アウトプット面の現状**：

- 期待される品質に達しないことが多く人の関与が必要
- 引き続き人がボトルネック
- 一方で、調べ事や学習が容易になり開発スピードが上がることでアウトプットに貢献

## 活用しているAIツール一覧

### コーディングエージェント

- **Devin**
- **Codex**
- **Cursor**
- **AI Assistant/Junie**
- **Claude Code**

### その他のツール

- **ChatGPT**
- **Gemini**
- **Google Meetの自動メモ生成**
- **NotebookLM**
- **Notion AI**
- **Slack AI**

## コーディングエージェントの詳細活用法

### Devin

**主な用途**：

- **開発・コーディング**: 類似機能・類似開発の横展開、単純な繰り返し、定型的な開発、下書き作成
- **コードレビュー**: KnowledgeやドキュメントによるエージェントのTraining
- **ドキュメント生成**: DeepWiki/Devin Wiki、依頼に基づくドキュメント生成
- **リポジトリ調査**: Devin Search機能

**働き方の変化**：

- **非稼働時間の活用**: 休憩前・帰宅前・移動中に開発を依頼
- **非エンジニアの自立**: 非エンジニアが自ら仕様を確認
- **プロトタイピング**: 気軽に捨てられる下書きの作成
- **「初版は捨てるために書く」の実践**

**Devinの使い方（2025年5月時点）**：

1. 下書き（ドラフト）を書いてもらう
2. レビューする
3. 指示を見直す
4. 改めて作ってもらう
5. 下書き（完成版）ができあがる
6. 適宜自分で書き直す

**重要な気づき**：

- レビューすることが自身の指示へのフィードバックになる
- コードレビューのフィードバック先がコードとは限らない

### Codex

- Devinと大体同じ用途で使用可能
- 環境構築にDockerが必要な場合は制限あり（2025年5月時点）
- PRなしで修正内容を確認できる利点
- Devinが作る不要ブランチ問題を回避

### Cursor

**用途**：

- 開発（特にフロントエンドやTypeScript）
- コーディング、コードレビュー、ドキュメント生成、リポジトリ調査
- **開発以外**: 発表スライドや学習ログの作成・管理
- **API連携ツール**: Linear APIやGoogleカレンダー操作ツールの作成

**特徴**：

- 開発に限らず様々なタスクに活用

### AI Assistant/Junie

- Cursorと大体同じ用途（特にKotlin）
- Cursor等と併用
- MCPサポートはCursorの方が早く安定している印象

### Claude Code

- Cursorと大体同じ用途
- 他ツールとの併用・使い分けを検討中

## Cursor系ツールに関する所感

### メリット

- **ブラウザとの行き来を減らし、様々なタスクを手元で完結**
- **相談相手が常に一緒にいる感覚**
- **フィードバックサイクルを気軽に手軽に回せることによるスピード・品質向上**

### 注意すべき負の側面

- **依頼・質問のためのタイピングや待ち時間が意外に無視できない**

### 対策

- **無駄にやらせない**
- **無駄に聞かない**
- **待たない（仕事を止めない）**

## その他のAIツールの活用

### ChatGPT

- **調べ事**
- **壁打ち**（アイデア出し・整理）
- **調査**
- **DeepResearch機能**

### Gemini

- ChatGPTと同じ用途
- Google系アプリケーションとの連携
- ただし、Google系ドキュメントの利用機会が少ない

### Google Meetの自動メモ生成

- 精度に不満あり（2025年6月時点）
- 録画してNotebookLMに処理させる方が良い可能性

### NotebookLM

**用途**：

- **ローカルルール・ナレッジの検索**（Notion AIで代替可能かも）
- **難解なドキュメントの理解確認**
- **動画の要約と見どころ識別**（見落としリスクあり）
- **ドキュメントの音声変換**：「ながら」の情報摂取が可能（移動中・家事中など）

**将来への期待**：

- ソース更新の自動取り込み機能→ローカルルール公開先として便利
- Webページの再帰的読み込み機能→技術ドキュメントの1次情報摂取が向上

### Notion AI

**用途**：

- **ドキュメントの検索・要約**
- **社内ルール・過去議論の発見**
- **複数サービス連携**：Slack、GitHub、Google Driveからの情報取得
- **フロー情報のストック化**：Slackで流れた情報の再発見

**制限事項**：

- Slackのプライベートチャンネルにはアクセス不可
- アクセス可能な情報のみがソース（公開時の注意が必要）
- 精度には満足していない

### Slack AI

**用途**：

- **Slackチャンネルの検索・要約**
- **社内状況の把握向上**

**制限事項**：

- 結果のエクスポートができず用途が限定される
- 検索機能は役に立っていない

## まとめ・おわりに

### 現状認識

- **メンタルモデルや働き方の変革が求められている**
- **既に様々なツールが日常業務に浸透している**
- **AIツールの使い分けと併用により生産性向上に取り組んでいる**
- **働き方が変わりつつある**

### 重要な姿勢

- 拙速な判断を避け、複数ツールの併用を前提とした柔軟なアプローチ
- AIの得意分野を理解し、人間との適切な役割分担を構築
- 継続的な学習と適応により、変化の激しい分野に対応

本発表は、実際の開発現場でAIツールを日常的に活用している実践者の生の声として、非常に参考になる内容となっています。特に「初版は捨てるために書く」という考え方や、レビューを通じた指示スキルの向上など、具体的な活用方法論が示されている点が印象的です。
