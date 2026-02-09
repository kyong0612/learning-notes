---
title: "shanraisshan/claude-code-best-practice: practice made claude perfect"
source: "https://github.com/shanraisshan/claude-code-best-practice"
author:
  - "[[shanraisshan]]"
published: 2025-10-31
created: 2026-02-09
description: "Claude Codeを効果的に活用するためのベストプラクティス集。ワークフロー、コンテキストエンジニアリング、Skills/Subagents/Hooks等の機能活用法、デバッグ手法、CLI設定などを実践経験に基づいて体系的にまとめたリポジトリ。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "Best Practices"
  - "Context Engineering"
  - "Agentic Engineering"
  - "Workflow"
  - "MCP"
---

## 概要

Claude Codeを最大限に活用するためのベストプラクティスをまとめたGitHubリポジトリ（⭐ 2,012 / 🍴 133）。著者 shanraisshan の実践経験に基づき、ワークフロー設計、コンテキストエンジニアリング、デバッグ手法、アーキテクチャパターンなどを体系的に整理している。Claude Codeの各種機能（Skills, Subagents, Memory, Rules, Hooks, MCP Servers, Plugins等）の使い分けガイドとしても有用。

## 主要なトピック

### CONCEPTS — Claude Codeの主要機能

Claude Codeのエクステンション機能を概念別に整理している。

| 機能 | 説明 |
|------|------|
| **Skills** | 再利用可能な知識・ワークフロー。`.claude/skills/` に配置。旧カスタムスラッシュコマンド（`.claude/commands/`）を統合 |
| **Subagents** | 独立した実行コンテキストで動作し、要約結果を返す |
| **Memory** | `CLAUDE.md` や `@path` インポートによる永続的コンテキスト |
| **Rules** | `.claude/rules/*.md` にモジュール式の指示を配置。frontmatterでパス制限可能 |
| **Hooks** | エージェントループの外で特定イベント時に実行される確定的スクリプト |
| **MCP Servers** | 外部ツール・DB・APIへの接続（Model Context Protocol） |
| **Plugins** | Skills, Subagents, Hooks, MCP Serversをバンドルした配布可能パッケージ |
| **Marketplaces** | プラグインコレクションのホスト・発見機能 |
| **Settings** | Claude Codeの動作に対する階層的設定システム |
| **Permissions** | ツール・操作に対するきめ細かいアクセス制御 |

> **Note**: カスタムスラッシュコマンドはSkillsに統合済み。`.claude/commands/` は動作するが、Skills（`.claude/skills/`）が推奨。

### MY EXPERIENCE — 著者の実践知見

#### ■ Workflows（ワークフロー）

- **CLAUDE.md は150行以下**に抑えるべき（それでも100%保証はない）
- ワークフローにはエージェントではなく **コマンドを使用**する
- 汎用的なQA・バックエンドエンジニアではなく、**機能特化型のSubagents**（追加コンテキスト付き）＋ **Skills**（段階的開示）を使う
- `/memory`, `/rules`, `constitution.md` は **何も保証しない**
- **手動 `/compact` は最大50%で実行**する
- **常にPlanモードから開始**する
- サブタスクは **50%未満のコンテキストで完了できるほど小さく**分割する
- 小さなタスクなら **素のClaude Code（バニラCC）がどのワークフローより優れている**
- **タスク完了後は即座にコミット**する

#### ■ Utilities（ユーティリティ）

- **iTerm** を使用（IDE端末はクラッシュ問題あり）
- **Wispr Flow** による音声プロンプティング（生産性10倍）
- **claude-code-voice-hooks** でClaudeからのフィードバック取得
- **ステータスライン** でコンテキスト認識と高速コンパクト化
- **git worktrees** で並列開発

#### ■ Debugging（デバッグ）

- **`/doctor`** コマンドの活用
- ログ確認用ターミナルは **バックグラウンドタスクとして実行**させる
- **MCP**（claude in chrome, playwright, chrome dev tool）でブラウザコンソールログを自動確認
- 問題の **スクリーンショットを提供** する

### CONTEXT ENGINEERING — コンテキストエンジニアリング

効果的なコンテキスト設計に関する参考資料。

- **[Humanlayer - Writing a good Claude.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)** — CLAUDE.mdの書き方ガイド
- **Claude.md for larger monorepos** — 大規模モノレポでのCLAUDE.md設計（Boris Cherny）

### WORKFLOWS — ワークフロー集

著者が収集・推奨する各種ワークフロー。

| ワークフロー | 概要 |
|-------------|------|
| **RPI** | Research-Plan-Implement の3段階ワークフロー |
| **Boris Feb26 workflow** | Boris Cherny のワークフロー |
| **Ralph plugin with sandbox** | サンドボックス付きプラグインワークフロー |
| **Human Layer RPI** | Research-Plan-Implementの高度な実装 |
| **AgentOs** | Brian Casel 提唱（2026年はオーバーキルとの評） |
| **Github Speckit** | GitHub公式のSpec Kit |
| **GSD (Get Shit Done)** | glittercowboy による実行重視ワークフロー |
| **OpenSpec OPSX** | Fission AI のオープン仕様 |
| **Superpower** | obra のスーパーパワーツール |
| **Andrej Karpathy Workflow** | Karpathy 流のワークフロー |

### COMMAND + SKILL + SUBAGENT ARCHITECTURE

Claude Codeの推奨アーキテクチャパターン。

| コンポーネント | 役割 | 例 |
|--------------|------|-----|
| **Command** | エントリーポイント、ユーザーインタラクション | `/weather-orchestrator` |
| **Agent** | スキルをプリロードしてワークフローをオーケストレーション | `weather` エージェント |
| **Skills** | 起動時に注入されるドメイン知識 | `weather-fetcher`, `weather-transformer` |

**使用場面**: マルチステップワークフロー、ドメイン固有の知識注入、順次タスク、再利用可能コンポーネント

**有効な理由**: 段階的開示、単一実行コンテキスト、責務の明確な分離、再利用性

### CLI STARTUP FLAGS

主要なCLIフラグ一覧。

| フラグ | 用途 |
|--------|------|
| `--dangerously-skip-permissions` | 権限チェックスキップ |
| `--model` | モデル指定 |
| `--print` | 出力のみ |
| `--resume` | セッション再開 |
| `--continue` | 続行 |
| `--system-prompt` | システムプロンプト指定 |
| `--verbose` | 詳細出力 |
| `--debug` | デバッグモード |
| `--init` | 初期化 |
| `--max-turns` | 最大ターン数 |

### CLAUDE COMMANDS

主要なスラッシュコマンド一覧。

| コマンド | 用途 |
|---------|------|
| `/compact` | コンテキスト圧縮 |
| `/context` | コンテキスト表示 |
| `/model` | モデル切替 |
| `/plan` | 計画モード |
| `/config` | 設定 |
| `/clear` | クリア |
| `/cost` | コスト表示 |
| `/memory` | メモリ管理 |
| `/doctor` | 診断 |
| `/rewind` | 巻き戻し |

### AI TERMS — AI用語集

リポジトリで言及されているAI関連用語。

| 用語 | 関連概念 |
|------|---------|
| Agentic Engineering | エージェント型開発 |
| AI Slop | AI生成の低品質コンテンツ |
| Context Bloat | コンテキストの肥大化 |
| Context Engineering | コンテキスト設計 |
| Context Rot | コンテキストの劣化 |
| Dumb Zone | AIが機能しにくい領域 |
| Hallucination | AIの幻覚（事実と異なる出力） |
| Scaffolding | 足場（補助的なコード/構造） |
| Orchestration | オーケストレーション |
| Vibe Coding | 直感的なAI駆動コーディング |

### REPORTS — 詳細レポート集

| レポート | 内容 |
|---------|------|
| Agent SDK vs CLI System Prompts | CLI と Agent SDK の出力差異の原因分析 |
| Browser Automation MCP Comparison | Playwright, Chrome DevTools, Claude in Chrome の比較 |
| Claude Code CLI Startup Flags | 全CLIフラグ・サブコマンド・環境変数リファレンス |
| Claude Code Commands Reference | 全スラッシュコマンド・ショートカット・入力モードリファレンス |
| Claude Code Settings Reference | `settings.json` の全設定オプションガイド |
| CLAUDE.md Loading in Monorepos | モノレポでのCLAUDE.mdの ancestor/descendant ロード動作 |
| Global vs Project Settings | グローバル専用 vs デュアルスコープの機能分類 |
| Skills Discovery in Monorepos | モノレポプロジェクトでのスキル検出・ロード方法 |

## 重要な事実・データ

- **⭐ 2,012 stars / 🍴 133 forks**（2026年2月9日時点）
- リポジトリ作成日: **2025年10月31日**
- 最終プッシュ: **2026年2月9日**（活発にメンテナンス中）
- GitHubトピック: `claude-ai`, `claude-code`
- カスタムスラッシュコマンドは**Skillsに統合済み**（`.claude/commands/` → `.claude/skills/`）

## 結論・示唆

### 著者の結論

- **小さなタスク × 素のClaude Code** が最も効果的。複雑なワークフロー構築よりも、タスクの粒度を小さくすることが重要。
- **コンテキスト管理が成否を分ける**。CLAUDE.mdは150行以下、手動compactは50%で実行、サブタスクは50%未満のコンテキストで完了可能な粒度に分割する。
- **Planモードからの開始が鉄則**。実装前に計画を立てることで品質が向上する。
- **即座のコミットが安全網**。タスク完了後は即座にコミットして進捗を保全する。

### 実践的な示唆

- CLAUDE.mdを簡潔に保ち、詳細な指示はRulesやSkillsに分散させる
- 汎用エージェントではなく、機能特化型のSubagents + Skillsアーキテクチャを採用する
- iTerm + Wispr Flow + git worktrees の組み合わせで開発環境を最適化する
- MCPを活用してブラウザデバッグを自動化する
- Command → Agent → Skills のアーキテクチャパターンでワークフローを設計する

## 制限事項・注意点

- CLAUDE.mdの150行制限は「100%保証されない」と著者自身が認めている
- `/memory`, `/rules`, `constitution.md` は動作を保証するものではない
- AgentOsは2026年時点では「オーバーキル」との評価
- `--dangerously-skip-permissions` の使用は推奨されず、代わりに `/config` での "don't ask permission" モードが推奨される
- 本リポジトリの内容はClaude Code固有のものであり、他のAIコーディングツールには直接適用できない場合がある

---

*Source: [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)*
