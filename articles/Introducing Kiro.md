---
title: "Introducing Kiro"
source: "https://kiro.dev/blog/introducing-kiro/index"
author: "Nikhil Swaminathan, Deepak Singh"
published: 2025-07-14
created: 2025-07-16
description: "A new agentic IDE that works alongside you from prototype to production"
tags:
  - "clippings"
  - "IDE"
  - "AI"
  - "spec-driven development"
  - "development tools"
  - "agentic"
---
# Kiro: AI駆動型のスペックドリブン開発IDE

## 概要

Kiroは、AIによるプロトタイピングの流れ（"vibe coding"）と、プロダクション対応システムに必要な明確な仕様の橋渡しをする新しいIDEです。プロンプトを重ねて動作するアプリケーションを作ることは楽しく魔法のようですが、本番環境に移行するにはそれ以上のものが必要です。Kiroは「スペックドリブン開発」によってこの課題を解決します。

![Venn diagram with a ghost logo in the overlap between "the flow of vibe coding" and "the clarity of specs"](https://kiro.dev/images/blogs/introducing-kiro/0-kiro-circle.png)

## 主要機能

### 1. Kiro Specs（仕様）

- 詳細な機能計画のためのアーティファクト
- AIエージェントをより良い実装へと導く
- 不確実な要件に対する明確性を提供
- ユーザーストーリーと受け入れ基準を自動生成
- EARS（Easy Approach to Requirements Syntax）を使用

### 2. Kiro Hooks（フック）

- イベント駆動型の自動化
- 経験豊富な開発者のように動作
- ファイルの保存、作成、削除時にバックグラウンドタスクをトリガー
- 品質チェックの自動化

## スペックとフックによる開発フロー

### 実例：ECサイトのレビューシステム構築

![ArtisanMarket with a grid of products for sale and an individual product page](https://kiro.dev/images/blogs/introducing-kiro/1-app.gif)

#### 1. 単一プロンプトから要件へ

![IDE showing a prompt "Add a review system for products" followed by AI-generated Markdown](https://kiro.dev/images/blogs/introducing-kiro/2-reqs.gif)

「製品にレビューシステムを追加」という単純なプロンプトから、Kiroは詳細な要件仕様を生成します。

#### 2. 要件に基づく技術設計

![IDE with Component Hierarchy Diagram](https://kiro.dev/images/blogs/introducing-kiro/3-specs-design.gif)

- データフローダイアグラムの作成
- TypeScriptインターフェースの生成
- データベーススキーマとAPIエンドポイントの開発
- コンポーネント階層図の生成

#### 3. タスクの実装

![Markdown task list for product-review-system](https://kiro.dev/images/blogs/introducing-kiro/4-tasks.gif)

Kiroは以下を自動化します：

- タスクとサブタスクの自動生成
- 適切な順序でのタスクシーケンシング
- 各タスクと要件のリンク
- ユニットテストの作成
- ローディング状態の追加
- 製品とレビュー間の相互作用のための統合テスト
- レスポンシブデザインとアクセシビリティの考慮

![ArtisanGoods product page with sortable (by dates or ratings) and filterable (by stars) reviews](https://kiro.dev/images/blogs/introducing-kiro/5-task-complete.gif)

#### 4. フックによる問題の事前検出

![Form with prompt "Anytime a component is added make sure it follow the single responsibility principle"](https://kiro.dev/images/blogs/introducing-kiro/6-hooks.gif)

フックの活用例：

- Reactコンポーネント保存時にテストファイルを更新
- APIエンドポイント変更時にREADMEをリフレッシュ
- コミット前の認証情報漏洩スキャン
- 単一責任原則の遵守チェック

## その他の機能

- **Model Context Protocol（MCP）サポート**: 外部ツールとの統合
- **ステアリングルール**: AI動作のカスタマイズ
- **エージェントチャット**: コンテキストプロバイダー付き
- **Code OSSベース**: オープンソースソフトウェア基盤
- **マルチプラットフォーム対応**: Mac、Windows、Linux
- **多言語サポート**: 主要なプログラミング言語に対応

## 今後のビジョン

Kiroの目標は、ソフトウェア製品開発における根本的な課題を解決することです：

- チーム間の設計の整合性確保
- 競合する要件の解決
- 技術的負債の排除
- コードレビューへの厳格性の導入
- シニアエンジニアが退職した際の組織的知識の保持
- 人間と機械の協調によるソフトウェア構築の改善

## 利用可能性

- **料金**: プレビュー期間中は無料（一部制限あり）
- **コミュニティ**: [Discord server](https://discord.com/invite/kirodotdev)でフィードバック受付中
- **対象**: 実際のアプリケーション構築を目指す開発者

Kiroは、AIによるコーディングの流動性と、プロダクション対応システムに必要な仕様の明確性を両立させる、新しいタイプの開発環境です。
