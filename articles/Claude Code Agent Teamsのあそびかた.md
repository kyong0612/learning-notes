---
title: "Claude Code Agent Teamsのあそびかた"
source: "https://blog.lai.so/agent-teams/?ref=laiso-newsletter"
author:
  - "[[laiso]]"
published: 2026-02-09
created: 2026-02-10
description: "Claude Code Agent Teamsの実験的機能の概要・セットアップ方法・実践例を紹介。Subagentsを独立プロセス化し、ファイルシステムベースのIPCで双方向メッセージングを実現する仕組みと、Subagentsとの使い分けを解説。"
tags:
  - "clippings"
  - "Claude Code"
  - "Agent Teams"
  - "マルチエージェント"
  - "Subagents"
  - "AI開発ツール"
---

## 概要

Agent Teamsは2026年2月5日にOpus 4.6と同時リリースされた**実験的機能**。Claude CodeのSubagentsを独立プロセス化し、双方向にメッセージングできるようにする仕組み。

**核心的なアーキテクチャ**: 各エージェントが自分のインボックス（`~/.claude/teams/`配下のJSONファイル）をポーリングし、メールボックスのアナロジーで相互通信を実現。ファイルロックで排他制御しており、**推論＋ファイルシステムだけでメッセージングシステムが成立**している点が特徴的。

---

## セットアップ

環境変数を有効にして起動するだけで利用可能。

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude --teammate-mode tmux
```

### 表示モード（`--teammate-mode`）

| モード | 説明 | 備考 |
|--------|------|------|
| `in-process` | 単一ターミナルで動作。プロセスをspawnせずシングルスレッドのまま別エントリポイントからループ実行 | tmuxモードとは等価ではない（真の並列処理ではない） |
| `tmux`（推奨） | tmux内で起動。各エージェントが独立ペインで動作 | iTerm2のPython API + [it2 CLI](https://github.com/mkusaka/it2)でも代替可能 |

複数の`claude`コマンドを起動し、tmuxやiTerm2経由でウィンドウを管理する構成。

---

## 利用制限の対策：Opusを避ける

各エージェントが独立したコンテキストウィンドウを持つため、全員Opusで動かすとトークン消費が激しく、サブスクの利用制限枠をすぐ使い切る。

### 対策

- **プロンプトベースでのモデル誘導が最も確実**：プロンプトに「Use Sonnet/Haiku for the teammate.」と記述
- `CLAUDE_CODE_SUBAGENT_MODEL`等の環境変数は、spawnされるClaude Codeのmodel引数が推論で決まるため安定しない
- **OpenRouter/Ollama利用時**：`ANTHROPIC_DEFAULT_SONNET_MODEL`や`ANTHROPIC_DEFAULT_OPUS_MODEL`を設定ファイルのEnvに記述

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-your-openrouter-api-key",
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_MODEL": "openrouter/pony-alpha",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "openrouter/pony-alpha",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "openrouter/pony-alpha",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "openrouter/pony-alpha",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

---

## 実践例：難しいIssueをチームで解く

[V2 Speed Optimization #56](https://github.com/laiso/ts-bench/issues/56)（Docker内の`npm install/build`ボトルネック問題）をAgent Teamsで解決する実践デモ。

### チーム構成

Team「SOTA」を作成し、以下のビルトイン・サブエージェント（`@agent[TAB]`で補完可能）を配置：

| メンバー | 役割 | 実施内容 | 成果 |
|----------|------|----------|------|
| **explorer** | コード調査 | docker-strategy.ts、V2フロー分析 | npmキャッシュが既に実装済みであることを発見 |
| **architect** (Plan) | 計画設計 | 実装戦略・優先順位整理 | 詳細実装計画書を作成 |
| **executor** (Bash) | 実装実行 | コンテナクリーンアップ、ログレベル制御実装 | 3つのcommit、全機能完成 |
| **researcher** | 補助 | 待機中 | バックアップ体制整備（実質未稼働） |
| **setup** | 設定 | 待機中 | 環境設定体制整備（実質未稼働） |

### Teammate起動時の内部コマンド

```bash
CLAUDECODE=1 CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude \
  --agent-id architect@SOTA \
  --agent-name architect \
  --team-name SOTA \
  --agent-color green \
  --parent-session-id 0da50c86-290e-4498-b029-5ff315c71f62 \
  --agent-type Plan \
  --model haiku
```

`--agent-type`がサブエージェントのタイプとなるため、**カスタムエージェントも渡すことが可能**。

### 注目すべき挙動

- **architectがメモリディレクトリを活用**: `.claude/projects/`以下の`memory/`ディレクトリに計画書・進捗メモを保存し、チーム内で共有
- **タスク管理**: `~/.claude/tasks/sota/`配下のJSONファイルでタスクの依存関係（`blocks`/`blockedBy`）やステータスが管理される
- **不要なエージェントの参加問題**: researcherとsetupは実質何もしなかった。team-leadがタスクアサインを決定するため、下流工程に不要なエージェントを配置してしまうとリソースの無駄になる

---

## 知っておくと助かること

### チーム状態の保存場所

`~/.claude/teams/`にJSONで保存。動作理解やデバッグに有用。

```
team-name/
├── config.json
└── inboxes/
    ├── bash-runner.json
    ├── config-manager.json
    ├── explorer.json
    ├── general-assistant.json
    └── planner.json
```

### 外部からの操作

インボックスのJSONファイルに反応する仕組みのため、**別のプログラムからメッセージを書き込むことで会話に参加させることが可能**。著者はCodexなど他のエージェントにSkillとしてこの知識を与え、インボックスを書き換えて会話に参加させることに成功。

### 既知の問題

**プロセス起動のレースコンディション問題**（[issue #23513](https://github.com/anthropics/claude-code/issues/23513)）：シェルの起動完了よりClaude Codeのコマンド送信が早く、`send-keys`が無視される。環境依存で、回避策は現状in-processで使うこと。

---

## Subagentsとの使い分け

| 概念 | 特徴 | OSプロセスモデルでの喩え |
|------|------|--------------------------|
| **Agent Teams** | 独立した判断で協調。ファイルシステムベースのステートフルなIPC。セッションをまたいで文脈保持可能 | forkした独立プロセス同士がファイルシステム経由のIPCで協調 |
| **Subagents** | 単発タスクを投げて結果回収。親セッションのコンテキストから派生。軽量。デフォルトで動作 | スレッド（親のメモリ空間を共有し、結果を返して終了） |
| **Agents** | Messages APIを叩いてツール呼び出しを行うループ単位 | 単一プロセス |

### 重要な注意点

- [Towards a Science of Scaling Agent Systems](https://arxiv.org/html/2512.08296v2)によれば、順次実行ワークフローをマルチエージェント化しても**性能が上がるとは限らない**
- 汎用的にAgent Teamsが機能するかは未知数
- 現時点の価値：エージェントたちがパネル上でわちゃわちゃ動くのが楽しい（ただしコストがかかる）