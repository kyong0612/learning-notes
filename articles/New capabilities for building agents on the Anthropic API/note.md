---
title: "New capabilities for building agents on the Anthropic API"
source: "https://www.anthropic.com/news/agent-capabilities-api"
author:
  - "Anthropic"
published: 2025-05-22
created: 2025-05-24
description: "Anthropicが開発者向けに発表した4つの新機能：コード実行ツール、MCPコネクター、Files API、1時間のプロンプトキャッシュ機能。これらによりより強力なAIエージェントの構築が可能になる。"
tags:
  - "anthropic"
  - "claude"
  - "api"
  - "ai-agents"
  - "code-execution"
  - "mcp"
  - "files-api"
  - "prompt-caching"
  - "beta-features"
  - "developer-tools"
---

![An illustration of a triangle connected to a circle.](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F564bcc527c894ee27dcd558986485c4af33138bf-2881x1621.png&w=3840&q=75)

## 概要

2025年5月22日、AnthropicはAPI上で動作する4つの新機能を発表しました。これらの機能により、開発者はより強力なAIエージェントの構築が可能になります：

1. **コード実行ツール** - サンドボックス環境でのPythonコード実行
2. **MCPコネクター** - Model Context Protocol（MCP）サーバーとの接続
3. **Files API** - ファイルの効率的な保存とアクセス
4. **拡張プロンプトキャッシュ** - 最大1時間のキャッシュ機能

これらの機能は[Claude Opus 4とSonnet 4](https://www.anthropic.com/news/claude-4)と組み合わせることで、カスタムインフラストラクチャを構築することなく、高度なデータ分析、外部システム連携、ファイル管理、長時間のコンテキスト維持を可能にします。

## より優れたAIエージェントの構築

### 実用例：プロジェクト管理AIエージェント

- **MCPコネクター**でAsanaと連携してタスクの参照・割り当て
- **Files API**で関連レポートのアップロード
- **コード実行ツール**で進捗とリスクの分析
- **拡張プロンプトキャッシュ**でコスト効率的にコンテキストを維持

これらの機能は既存の[ウェブ検索](https://www.anthropic.com/news/web-search-api)や[引用機能](https://www.anthropic.com/news/introducing-citations-api)と組み合わせて、AIエージェント構築のための包括的なツールキットを形成します。

## 主要機能の詳細

### 1. コード実行ツール

**概要**：ClaudeがサンドボックスPython環境でコードを実行し、計算結果やデータ視覚化を生成できるツール。

**主な機能**：

- データセットの読み込み
- 探索的チャートの生成
- パターンの識別
- 実行結果に基づく反復的な出力改善

**主要な使用例**：

- **財務モデリング**：財務予測生成、投資ポートフォリオ分析、複雑な財務指標計算
- **科学計算**：シミュレーション実行、実験データ処理、研究データセット分析
- **ビジネスインテリジェンス**：自動レポート作成、売上データ分析、パフォーマンスダッシュボード生成
- **文書処理**：フォーマット間でのデータ抽出・変換、書式設定されたレポート生成、文書ワークフローの自動化
- **統計分析**：回帰分析、仮説検定、データセットの予測モデリング

**価格設定**：

- 1日50時間の無料利用時間
- 追加利用時：1時間あたり$0.05/コンテナ

### 2. MCPコネクター

**概要**：クライアントコードを書くことなく、ClaudeをリモートModel Context Protocol（MCP）サーバーに接続する機能。

**従来の課題**：MCPサーバーへの接続には、独自のクライアントハーネス構築が必要でした。

**新機能の利点**：

- API側でのすべての接続管理
- 自動ツール発見とエラーハンドリング
- サードパーティツールへの即座のアクセス

**自動処理機能**：

- 指定されたMCPサーバーへの接続
- 利用可能なツールの取得
- 適切なツール呼び出しと引数の決定
- 十分な結果が得られるまでのエージェント的なツール実行
- 認証とエラーハンドリングの管理
- 統合データを含む拡張レスポンスの返却

**対応サービス**：

- [Zapier](https://zapier.com/mcp)
- [Asana](https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server)
- その他の[リモートMCPサーバー](https://docs.anthropic.com/en/docs/agents-and-tools/remote-mcp-servers)

### 3. Files API

**概要**：Claudeでの構築時に文書の保存とアクセスを簡素化するAPI。

**主な改善点**：

- 一度のアップロードで複数回の参照が可能
- 各リクエストでのファイルアップロード管理が不要
- 大規模な文書セットでの開発ワークフローの効率化

**特に有効なアプリケーション**：

- ナレッジベース
- 技術文書
- データセット

**コード実行ツールとの統合**：

- アップロードされたファイルの直接アクセスと処理
- チャートやグラフなどのファイル生成機能
- 複数セッションでの再アップロード不要のデータ分析

### 4. 拡張プロンプトキャッシュ

**概要**：従来の5分TTLに加え、追加料金で1時間TTLのオプションを提供（12倍の改善）。

**効果的なコスト削減**：

- 長いプロンプトでのコスト最大90%削減
- レイテンシ最大85%削減
- 長時間実行エージェントワークフローでの大幅な経費削減

**実用的なメリット**：

- 長期間のコンテキスト維持
- 複数ステップワークフローの処理
- 複雑な文書分析
- 他システムとの協調作業
- 従来コスト面で困難だったエージェントアプリケーションの効率的な大規模運用

## 技術的な意義と影響

これらの新機能は、AIエージェント開発における以下の課題を解決します：

**開発の複雑性軽減**：

- カスタムインフラストラクチャの構築不要
- 既存ツールとの即座の統合
- 自動化されたエラーハンドリング

**コスト効率の向上**：

- 拡張キャッシュによる大幅なコスト削減
- 無料利用枠の提供
- スケーラブルな価格設定

**機能の統合性**：

- 既存の検索・引用機能との相乗効果
- 包括的なツールキットの提供
- エンドツーエンドのエージェント構築支援

## 利用開始

すべての機能はAnthropic APIでパブリックベータ版として利用可能です。

**リソース**：

- [公式ドキュメント](https://docs.anthropic.com/en/docs/overview)
- [開発者カンファレンス基調講演](https://www.youtube.com/live/EvtPBaaykdo)

**関連発表**：

- [Claude Opus 4とSonnet 4](https://www.anthropic.com/news/claude-4)（2025年5月22日）
- [AI Safety Level 3 Protections](https://www.anthropic.com/news/activating-asl3-protections)（2025年5月22日）

この発表は、Anthropicが目指すAIエージェント開発の民主化と、開発者がより強力で実用的なAIアプリケーションを構築できる環境の提供という戦略的方向性を示しています。
