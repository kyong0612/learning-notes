---
title: "Interactive tools in Claude | Claude"
source: "https://claude.com/blog/interactive-tools-in-claude"
author:
  - "[[@Anthropic]]"
published: 2026-01-26
created: 2026-01-28
description: "Claudeの会話内で外部ツール（Asana、Slack、Figma等）をインタラクティブに操作可能に。MCP Apps拡張により、タブを切り替えることなくプロジェクト管理、メッセージ作成、図表作成などが可能。"
tags:
  - "clippings"
  - "Claude"
  - "MCP"
  - "AI-tools"
  - "integrations"
  - "productivity"
---

## 概要

2026年1月26日より、Claudeの会話内で外部ツールを直接開いてインタラクティブに操作できる新機能がリリースされた。Asanaでプロジェクトタイムラインを構築・更新したり、Slackメッセージを書式付きプレビューで作成・編集・送信したり、FigJamでアイデアを図表として視覚化したりと、タブを切り替えることなく作業を完結できる。

## 対応ツール一覧

### 現在利用可能なツール

| ツール | 機能 |
|--------|------|
| **Amplitude** | 分析チャートを構築し、トレンドを探索、パラメータをインタラクティブに調整して隠れたインサイトを発見 |
| **Asana** | 会話をプロジェクト、タスク、タイムラインに変換し、チームがAsanaで確認・実行可能 |
| **Box** | ファイル検索、ドキュメントのインラインプレビュー、コンテンツからのインサイト抽出と質問対応 |
| **Canva** | プレゼンテーションのアウトライン作成、ブランディングとデザインのリアルタイムカスタマイズ |
| **Clay** | 企業調査、連絡先（メール・電話）の検索、企業規模・資金調達などのデータ取得、パーソナライズされたアウトリーチの作成 |
| **Figma** | テキストや画像からフローチャート、ガントチャート、その他の図表をFigJamで作成 |
| **Hex** | データに関する質問に対し、インタラクティブなチャート、表、引用付きで回答 |
| **monday.com** | 作業管理、プロジェクト運営、ボード更新、タスクのスマート割り当て、進捗の可視化 |
| **Slack** (Salesforce) | Slack会話の検索・取得、メッセージドラフトの生成、フォーマット調整、投稿前のレビュー |

### 近日公開予定

- **Salesforce** - Agentforce 360によりエンタープライズコンテキストをClaudeに統合。チームが単一の接続されたインターフェースから推論、コラボレーション、アクションを実行可能に

## 技術基盤：MCP Apps

### オープンスタンダードに基づく構築

この機能の基盤技術は[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro)上に構築されている。MCPはAIアプリケーションにツールを接続するためのオープンスタンダードである。

### MCP Apps - 新しい拡張機能

**MCP Apps**はMCPの新しい拡張機能で、任意のMCPサーバーがClaudeだけでなく、MCPをサポートするあらゆるAI製品内でインタラクティブなインターフェースを提供できるようになる。

AnthropicはMCPをオープンソース化し、エコシステムにツールとAIを接続する普遍的な方法を提供した。今回、開発者がユーザーのいる場所でインタラクティブなUIを構築できるよう、MCPをさらに拡張した。

詳細：[MCP Apps - The First Official MCP Extension](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps)

## 利用方法

### 開始手順

1. [claude.ai/directory](http://claude.ai/directory) にアクセス
2. 「interactive」とマークされたアプリに接続

### 対応プラン

- **Pro**プラン
- **Max**プラン
- **Team**プラン
- **Enterprise**プラン

### 対応プラットフォーム

- Web
- デスクトップアプリ
- **Claude Cowork**（近日対応予定）

## 重要ポイント

1. **リアルタイムコラボレーション**: ツールが会話内に表示され、何が起きているかを確認しながらリアルタイムで協働可能
2. **タブ切り替え不要**: すべての作業をClaude内で完結
3. **オープンスタンダード**: MCP Appsにより、他のAI製品でも同様の機能を実装可能
4. **開発者向け拡張性**: 開発者は独自のインタラクティブUIをMCP上に構築可能

## 関連リンク

- [Model Context Protocol ドキュメント](https://modelcontextprotocol.io/docs/getting-started/intro)
- [MCP Apps発表記事](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps)
- [Claude Connectors一覧](https://claude.com/connectors)
