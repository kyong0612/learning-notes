---
title: "VoltAgent/awesome-claude-code-subagents: Production-ready Claude subagents collection with 100+ specialized AI agents for full-stack development, DevOps, data science, and business operations."
source: "https://github.com/VoltAgent/awesome-claude-code-subagents"
author:
  - "VoltAgent"
  - "[[necatiozmen]]"
published:
created: 2025-09-11
description: |
  The most comprehensive reference repository for production-ready Claude Code subagents. This collection features subagent definitions following best practices and industry standards.
tags:
  - "ai-agents"
  - "claude"
  - "claude-ai"
  - "subagents"
  - "claude-subagents"
---
[![Group 32](https://private-user-images.githubusercontent.com/18739364/473450671-286b21c6-7dd5-453a-9360-677151939f4a.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc1Njg0NjUsIm5iZiI6MTc1NzU2ODE2NSwicGF0aCI6Ii8xODczOTM2NC80NzM0NTA2NzEtMjg2YjIxYzYtN2RkNS00NTNhLTkzNjAtNjc3MTUxOTM5ZjRhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTExVDA1MjI0NVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThiYTYwZjRmMmVhZjRmYWQ2ZmIzNTBmYmM3NDlmMDVkY2E3NTNlOWM3YzRjOWJhNmQyYjExZWViMjgxZDAyNDImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.8TdgCXr_C67pH0hurDpWDKgo47Os6k5I2SDaU79Aodo)](https://github.com/VoltAgent/voltagent)

**[Awesome Claude Code Subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)** は、本番環境で利用可能なClaude Code Subagentのための最も包括的なリファレンスリポジトリです。このコレクションには、ベストプラクティスと業界標準に従ったSubagentの定義が含まれています。

[![Discord](https://camo.githubusercontent.com/13b29e64a2f0e71d59d9e2cceebfdaada42d0d5d5b70850d7bdf6604dadc9150/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3133313535393135333738303135343Nzgu7376673f6c6162656c3d266c6f676f3d646973636f7264266c6f676f436f6c6f723d6666666666626636f6c6f723d373338394438266c6162656c436f6c6f723d364137454332)](https://s.voltagent.dev/discord)
[![Twitter Follow](https://camo.githubusercontent.com/56ec53b6237b77903fe88978f8a195d9c3b9a44e4c2e7e0aa820b14e239dcdee/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f766f6c746167656e745f6465763f7374796c653d736f6369616c)](https://twitter.com/voltagent_dev)

## このリポジトリについて

このリポジトリは、特定の開発タスク用に設計された特化型AIエージェントであるClaude Code Subagentの決定版コレクションとして機能します。各Subagentは以下の特徴を持っています。

- **本番環境対応**: 実世界のシナリオでテスト済み
- **ベストプラクティス準拠**: 業界標準とパターンに準拠
- **MCPツール統合**: Model Context Protocolツールを活用
- **継続的なメンテナンス**: 新機能による定期的な更新
- **コミュニティ主導**: コントリビューションと改善を歓迎

## クイックスタート

1. カテゴリを閲覧して必要なSubagentを見つけます。
2. Subagentの定義をコピーします。
3. Claude Codeで使用するか、ワークフローに統合します。
4. プロジェクトの要件に基づいてカスタマイズします。

[![435380213-b6253409-8741-462b-a346-834cd18565a9](https://private-user-images.githubusercontent.com/18739364/435493405-452a03e7-eeda-4394-9ee7-0ffbcf37245c.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc1Njg0NjUsIm5iZiI6MTc1NzU2ODE2NSwicGF0aCI6Ii8xODczOTM2NC80MzU0OTM0MDUtNDUyYTAzZTctZWVkYS00Mzk0LTllZTctMGZmYmNmMzcyNDVjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTExVDA1MjI0NVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWYyZmNkY2VhNzNhNTI3OWZiM2ExYzFkZTBjNmE2NzViMjkzZmQwMzAwY2Q5MTg5NGViMTBjMDVlZjQ1MDYwMTEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.YeVHDmGe-sJC09oCSROXhgDnTDKJ3wpqTabVm0P822s)](https://github.com/VoltAgent/voltagent)

## 📚 カテゴリ

Subagentは以下のカテゴリに分類されています。

- **01. Core Development**: 日常的なコーディングタスクのための基本的な開発Subagent。
- **02. Language Specialists**: フレームワークの深い知識を持つ言語特化型のエキスパート。
- **03. Infrastructure**: DevOps、クラウド、デプロイメントのスペシャリスト。
- **04. Quality & Security**: テスト、セキュリティ、コード品質のエキスパート。
- **05. Data & AI**: データエンジニアリング、機械学習、AIのスペシャリスト。
- **06. Developer Experience**: ツールと開発者の生産性向上エキスパート。
- **07. Specialized Domains**: ドメイン特化型の技術エキスパート。
- **08. Business & Product**: プロダクトマネジメントとビジネス分析。
- **09. Meta & Orchestration**: エージェントの連携とメタプログラミング。
- **10. Research & Analysis**: リサーチ、検索、分析のスペシャリスト。

## 🤖 Subagentを理解する

Subagentは、タスク特化の専門知識を提供することでClaude Codeの能力を強化する、特化型AIアシスタントです。特定の種類の作業に遭遇した際にClaude Codeが呼び出すことができる専門ヘルパーとして機能します。

### Subagentの特徴

- **独立したコンテキストウィンドウ**: 各Subagentは独自の隔離されたコンテキスト空間で動作し、異なるタスク間の混同を防ぎます。
- **ドメイン特化の知能**: Subagentは専門分野に合わせた指示が組み込まれており、特化タスクで優れたパフォーマンスを発揮します。
- **プロジェクト間での共有**: 作成したSubagentは、様々なプロジェクトで再利用したり、チームメンバーと共有したりできます。
- **詳細なツール権限**: 各Subagentに特定のツールアクセス権を設定し、タスクの種類に応じて利用可能な機能を細かく制御できます。

### 主な利点

- **メモリ効率**: 隔離されたコンテキストにより、メインの会話がタスク固有の詳細で乱雑になるのを防ぎます。
- **精度の向上**: 特化されたプロンプトと設定により、特定のドメインでより良い結果が得られます。
- **ワークフローの一貫性**: チーム全体でSubagentを共有することで、共通タスクへのアプローチが統一されます。
- **セキュリティ管理**: 目的や種類に応じてツールへのアクセスを制限できます。

## 🛠️ Subagentの使用方法

### Claude Codeでのセットアップ

1. プロジェクト内の `.claude/agents/` にSubagentファイルを配置します。
2. Claude Codeが自動的にSubagentを検出してロードします。
3. 会話の中で自然に呼び出すか、Claudeに判断を任せます。

### Subagentの保管場所

| タイプ | パス | 利用範囲 | 優先度 |
| :--- | :--- | :--- | :--- |
| プロジェクトSubagent | `.claude/agents/` | 現在のプロジェクトのみ | 高 |
| グローバルSubagent | `~/.claude/agents/` | すべてのプロジェクト | 低 |

*注意: 名前の競合が発生した場合、プロジェクト固有のSubagentがグローバルなものより優先されます。*

### 新しいSubagentの作成手順

1. **エージェントインターフェースを起動**:

    ```
    /agents
    ```

2. **"Create New Agent" を選択**:
    - プロジェクトレベル（現在のプロジェクト）またはユーザーレベル（すべてのプロジェクト）のスコープを決定します。
3. **エージェントの設定**:
    - （推奨）Claudeに初期バージョンをドラフトさせ、その後カスタマイズします。
    - エージェントの役割とアクティベーションシナリオについて包括的な説明を記述します。
    - 特定のツール権限を付与します（空のままにするとフルアクセス）。
    - `e`キーを押してシステムプロンプトを直接編集し、高度なカスタマイズを行います。
4. **保存して使用開始**:
    - エージェントはすぐに使用可能になります。
    - Claudeが自動的に適切なタスクを委任するか、手動で呼び出すことができます:

    ```
    > Ask the code-reviewer agent to examine my pull request
    ```

## 📖 Subagentの構造

各Subagentは標準化されたテンプレートに従います:

```yaml
---
name: subagent-name
description: Brief description of capabilities
tools: List of MCP tools used
---

Role definition and expertise...

## MCP Tool Integration
Tool descriptions and usage patterns...

## Communication Protocol
Inter-agent communication specifications...

## Implementation Workflow
Structured development phases...
```

## 🤝 コントリビューション

コントリビューションを歓迎します。詳細は [CONTRIBUTING.md](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/CONTRIBUTING.md) を参照してください。

## 👥 メンテナー

このリポジトリは [VoltAgent](https://github.com/voltagent/voltagent) チームによってメンテナンスされています。

## 📄 ライセンス

[MIT License](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/LICENSE)

## 🔗 関連リソース

- [VoltAgent Framework](https://github.com/voltagent/voltagent)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Community Discord](https://s.voltagent.dev/discord)
