---
title: "ag-ui-protocol/ag-ui: AG-UI: the Agent-User Interaction Protocol. Bring Agents into Frontend Applications."
source: "https://github.com/ag-ui-protocol/ag-ui"
author:
  - ag-ui-protocol
published:
created: 2025-10-10
description: "AIエージェントとユーザー向けアプリケーションを標準化して接続するオープンで軽量なイベントベースのプロトコル。シンプルさと柔軟性を重視し、様々なフレームワークやトランスポートに対応。"
tags:
  - ai-agents
  - agent-ui
  - agentic-workflow
  - agent-frontend
  - ag-ui-protocol
  - protocol
  - event-driven
---

## 概要

AG-UIは、AIエージェントとユーザー向けアプリケーションを接続する、オープンで軽量なイベントベースのプロトコルです。シンプルさと柔軟性を重視して設計されており、AIエージェント、リアルタイムユーザーコンテキスト、ユーザーインターフェース間のシームレスな統合を可能にします。

## 主な特徴

### プロトコルの仕組み

- **イベントベース設計**: エージェントバックエンドは、AG-UIの約16種類の標準イベントタイプと互換性のあるイベントを発行
- **柔軟な入力**: エージェントバックエンドは、いくつかのシンプルなAG-UI互換入力を引数として受け取り可能
- **柔軟なミドルウェア層**: 多様な環境での互換性を保証
  - 任意のイベントトランスポート（SSE、WebSocket、webhookなど）に対応
  - 緩やかなイベントフォーマットマッチングにより、幅広いエージェントとアプリの相互運用性を実現

### コア機能

- 💬 ストリーミング対応のリアルタイムエージェントチャット
- 🔄 双方向状態同期
- 🧩 生成的UIと構造化メッセージ
- 🧠 リアルタイムコンテキスト強化
- 🛠️ フロントエンドツール統合
- 🧑‍💻 Human-in-the-loopコラボレーション

## エージェントプロトコルスタックにおける位置づけ

AG-UIは、他の主要なエージェントプロトコルと補完的な関係にあります：

- **MCP（Model Context Protocol）**: エージェントにツールを提供
- **A2A（Agent-to-Agent）**: エージェント間のコミュニケーションを可能に
- **AG-UI**: エージェントをユーザー向けアプリケーションに組み込む

## サポートフレームワーク

### 完全サポート済み

| フレームワーク | 統合タイプ | リソース |
|------------|----------|---------|
| LangGraph | パートナーシップ | [ドキュメント](https://docs.copilotkit.ai/langgraph/) / [デモ](https://dojo.ag-ui.com/langgraph-fastapi/feature/shared_state) |
| Mastra | 1st party | [ドキュメント](https://docs.copilotkit.ai/mastra/) / [デモ](https://dojo.ag-ui.com/mastra) |
| Pydantic AI | 1st party | [ドキュメント](https://docs.copilotkit.ai/pydantic-ai/) / [デモ](https://dojo.ag-ui.com/pydantic-ai/feature/shared_state) |
| Google ADK | パートナーシップ | [ドキュメント](https://docs.copilotkit.ai/adk) / [デモ](https://dojo.ag-ui.com/adk-middleware) |
| Agno | 1st party | [ドキュメント](https://docs.copilotkit.ai/agno/) / [デモ](https://dojo.ag-ui.com/agno) |
| LlamaIndex | 1st party | [ドキュメント](https://docs.copilotkit.ai/llamaindex/) / [デモ](https://dojo.ag-ui.com/llamaindex/feature/shared_state) |
| CrewAI | パートナーシップ | [ドキュメント](https://docs.copilotkit.ai/crewai-flows) / [デモ](https://dojo.ag-ui.com/crewai/feature/shared_state) |
| AG2 | 1st party | [ドキュメント](https://docs.copilotkit.ai/ag2/) |

### 開発中

- AWS Bedrock Agents
- AWS Strands Agents
- Vercel AI SDK
- OpenAI Agent SDK
- Cloudflare Agents
- Microsoft Agent Framework

## プロトコルとSDK

### サポートプロトコル

- **A2A**: AG-UIと互換性のあるAgent-to-Agentプロトコル

### SDK

| 言語 | ステータス |
|------|----------|
| TypeScript | ✅ サポート済み |
| Python | ✅ サポート済み |
| Kotlin | ✅ サポート済み（コミュニティ） |
| .NET | 🛠️ 開発中 |
| Nim | 🛠️ 開発中 |
| Golang | 🛠️ 開発中 |
| Rust | 🛠️ 開発中 |
| Java | 🛠️ 開発中 |
| Dart | 🛠️ 開発中 |

## クイックスタート

新しいAG-UIアプリケーションを数秒で作成：

```bash
npx create-ag-ui-app my-agent-app
```

## AG-UI Dojo

AG-UI Dojoは、AG-UIのコアビルディングブロックをシンプルで焦点を絞った例（各50-200行のコード）で実演するプラットフォームです。すべてのフレームワーク統合のソースコードを確認できます。

## なぜAG-UIなのか

AG-UIは、実際のアプリ内エージェントインタラクションを構築する実践的な経験と、現実世界の要件に基づいて開発されました。

## 技術的特徴

### 参照実装

- **HTTP実装**: すぐに使える参照HTTPプロトコル実装
- **デフォルトコネクター**: チームが迅速に開始できるデフォルトコネクター

### イベントシステム

- 約16種類の標準イベントタイプ
- 柔軟なイベントフォーマットマッチング
- 複数のトランスポート層サポート

## ライセンス

AG-UIは[MITライセンス](https://opensource.org/licenses/MIT)のオープンソースソフトウェアです。

## リンク

- [公式ウェブサイト](https://ag-ui.com/)
- [ドキュメント](https://docs.ag-ui.com/)
- [AG-UI Dojo](https://dojo.ag-ui.com/)
- [Discord コミュニティ](https://discord.gg/Jd3FzfdJa8)
- [貢献ガイド](https://github.com/ag-ui-protocol/ag-ui/blob/main/CONTRIBUTING.md)
- [ロードマップ](https://github.com/orgs/ag-ui-protocol/projects/1)

## 統計情報

- ⭐ 8.8k stars
- 🍴 798 forks
- 👥 41+ contributors
- 主要言語: TypeScript (39.7%), Python (27.1%), Kotlin (23.4%)
