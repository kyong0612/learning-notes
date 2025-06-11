---
title: container-use
source: https://github.com/dagger/container-use
author:
  - dagger
published: 2024-06-10
created: 2025-06-11 12:26:29
description: |
  Development environments for coding agents. Enable multiple agents to work safely and independently with your preferred stack.
tags:
  - docker
  - containers
  - ai-agents
  - mcp
  - dagger
  - development-environment
---

# Container Use - AIエージェント向け開発環境

**Container Use**は、コーディングエージェント向けのコンテナ化された開発環境を提供するオープンソースのModel Context Protocol (MCP)サーバーです。複数のAIエージェントが安全かつ独立して作業できる環境を実現します。

## 主要な機能

### 🔐 隔離された環境

- 各エージェントが独自のGitブランチ内で新しいコンテナを取得
- 複数のエージェントが競合することなく動作
- 安全な実験環境の提供
- 失敗時の即座な破棄が可能

### 👀 リアルタイム可視性

- エージェントが実際に実行したコマンド履歴とログの完全な表示
- エージェントの主張ではなく、実際の行動を監視

### 🚁 直接介入

- エージェントが行き詰まった際の任意のターミナルへの直接アクセス
- 状態確認と制御の取得が可能

### 🎮 環境制御

- 標準的なGitワークフロー
- `git checkout <branch_name>`でエージェントの作業をレビュー

### 🌎 汎用互換性

- 任意のエージェント、モデル、インフラストラクチャとの連携
- ベンダーロックインなし

## インストール

### クイックインストール

```bash
curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh | bash
```

このスクリプトは以下を実行します：

- Docker & Git の存在確認（必須）
- プラットフォーム検出
- 最新の `cu` バイナリを `$PATH` にインストール

### ビルド方法

#### Goを使用

```bash
go build -o cu ./cmd/cu
```

#### Daggerを使用

```bash
dagger call build --platform=current export --path ./cu
```

## エージェント統合

container-useを有効にするには2つのステップが必要です：

1. リポジトリに対応するcontainer-useのMCP設定を追加
2. （オプション）エージェントがコンテナ化環境を使用するためのルール追加

### 対応エージェント

#### Claude Code

```bash
cd /path/to/repository
npx @anthropic-ai/claude-code mcp add container-use -- <cu コマンドのフルパス> stdio
```

ルールファイルの追加：

```bash
curl https://raw.githubusercontent.com/dagger/container-use/main/rules/agent.md >> CLAUDE.md
```

#### goose

`~/.config/goose/config.yaml`に追加：

```yaml
extensions:
  container-use:
    name: container-use
    type: stdio
    enabled: true
    cmd: cu
    args:
    - stdio
    envs: {}
```

#### Cursor

```bash
curl --create-dirs -o .cursor/rules/container-use.mdc https://raw.githubusercontent.com/dagger/container-use/main/rules/cursor.mdc
```

#### VSCode / GitHub Copilot

設定ファイルに以下を追加：

```json
"mcp": {
    "servers": {
        "container-use": {
            "type": "stdio",
            "command": "cu",
            "args": ["stdio"]
        }
    }
}
```

#### Kilo Code

グローバルまたはプロジェクトレベルでMCPサーバーを設定：

```json
{
  "mcpServers": {
    "container-use": {
      "command": "cu のパス名に置換",
      "args": ["stdio"],
      "env": {},
      "alwaysAllow": [],
      "disabled": false
    }
  }
}
```

## 使用例

プロジェクトには以下のサンプルが含まれています：

| 例 | 説明 |
|---|---|
| hello_world.md | シンプルなアプリの作成と実行、localhost HTTP URLでアクセス可能 |
| parallel.md | 2つのhello worldアプリ（FlaskとFastAPI）を異なるURLで作成・配信 |
| security.md | リポジトリの更新/脆弱性チェック、更新適用、ビルド検証、パッチファイル生成 |

### 実行例

#### Claude Codeでの実行

```bash
cat ./examples/hello_world.md | claude --dangerously-skip-permissions
```

#### gooseでの実行

```bash
goose run -i ./examples/hello_world.md -s
```

## エージェントの監視

エージェントの進捗をリアルタイムで監視：

```bash
cu watch
```

エージェントは自動的にローカルファイルシステム上のcontainer-useリモートにコミットを行います。

## 動作原理

container-useは、エージェントに環境を提供するModel Context Protocolサーバーです。環境は、DaggerとGit worktreesによって強化されたコンテナとGitブランチの抽象化です。

詳細については`environment/README.md`を参照してください。

## プロジェクト情報

- **ライセンス**: Apache-2.0
- **言語**: Go (87.9%), Shell (12.1%)
- **Stars**: 1.1k
- **Forks**: 56
- **状態**: 実験的（早期開発段階）

## 注意事項

このプロジェクトは早期開発段階で積極的に進化中です。粗い部分、破壊的変更、不完全なドキュメントが予想されますが、迅速な反復とフィードバックへの応答性も期待できます。
