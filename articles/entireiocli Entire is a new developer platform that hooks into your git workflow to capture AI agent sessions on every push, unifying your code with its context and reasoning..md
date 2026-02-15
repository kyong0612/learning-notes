---
title: "entireio/cli: Entire is a new developer platform that hooks into your git workflow to capture AI agent sessions on every push, unifying your code with its context and reasoning."
source: "https://github.com/entireio/cli"
author: "[[entireio]]"
published: ""
created: 2026-02-15
description: "Entire CLIはGitワークフローに組み込み、プッシュごとにAIエージェントセッションを記録する開発者向けCLIツール。プロンプト/応答のトランクリプトと変更ファイルを別ブランチに保存し、チェックポイントからの巻き戻しやトレーサビリティを実現する。"
tags:
  - "clippings"
  - "entire"
  - "cli"
  - "ai-agent"
  - "git"
  - "claude-code"
  - "gemini"
  - "checkpoint"
  - "session-tracking"
  - "dev-tools"
---

## 概要

Entire CLIは、Gitのワークフローにフックして、プッシュのたびにAIエージェント（Claude Code、Gemini CLI）のセッションをキャプチャする開発者向けプラットフォームです。コードの変更履歴と、その変更がどのようなプロンプトと応答から生まれたかを紐づけることで、検索可能な記録を残します。

コードのコミットは通常ブランチに、セッションメタデータ（トランクリプト、プロンプト、変更ファイル）は専用の `entire/checkpoints/v1` ブランチに分離して保存します。これにより、Git履歴を汚さずに、エージェントが暴走した際の巻き戻しや、オンボーディング時の経路の可視化が可能になります。

## 主要なトピック

### Requirements（要件）
- Git、macOSまたはLinux（WindowsはWSL対応）
- Claude CodeまたはGemini CLIのインストールと認証

### Quick Start（クイックスタート）
- Homebrew: `brew tap entireio/tap` → `brew install entireio/tap/entire`
- Go: `go install github.com/entireio/cli/cmd/entire@latest`
- プロジェクトで `entire enable` を実行して有効化

### Typical Workflow（典型的なワークフロー）
1. **有効化**: `entire enable` でエージェント用およびGitフックをインストール
2. **通常運用**: Claude Code / Gemini CLIを通常通り使用（Entireはバックグラウンドで動作）
3. **巻き戻し**: `entire rewind` でチェックポイント一覧を表示し、復元
4. **セッション再開**: `entire resume` で最新のチェックポイント済みセッションを復元
5. **無効化**: `entire disable` でフックを削除

### Key Concepts（主要概念）

**Sessions（セッション）**
- 1回のAIエージェントとの一連のやり取り全体
- プロンプト、応答、変更ファイル、タイムスタンプを記録
- セッションID形式: `YYYY-MM-DD-<uuid>`
- `entire/checkpoints/v1` ブランチに保存

**Checkpoints（チェックポイント）**
- セッション内のスナップショット（セーブポイント）
- チェックポイントID: 12文字の16進文字列
- 作成タイミングは戦略に依存（後述）

**Strategies（戦略）**
- **Manual-Commit**（デフォルト）: 自分またはエージェントがgit commitしたときにチェックポイント作成。mainブランチで安全
- **Auto-Commit**: エージェントの各応答後にコミット。mainでは「logs-only」（ログのみ記録）、featureブランチではフル巻き戻し可能。mainでは注意が必要

### Commands Reference（コマンド一覧）
- `entire clean` / `disable` / `doctor` / `enable` / `explain` / `reset` / `resume` / `rewind` / `status` / `version`
- `entire enable` のフラグ: `--agent`, `--strategy`, `--force`, `--local`, `--project`, `--skip-push-sessions`, `--telemetry=false`

### Configuration（設定）
- `.entire/` ディレクトリ配下
- `settings.json`（プロジェクト共有）、`settings.local.json`（個人、gitignore対象）
- **Settings Priority**: ローカル設定がプロジェクト設定をフィールド単位で上書き
- オプション: enabled, log_level, strategy, strategy_options.push_sessions, strategy_options.summarize.enabled, telemetry

### Auto-Summarization
- コミット時にチェックポイントのAI要約を自動生成（Claude CLI必須、ノンブロッキング）
- 要約内容: 意図、結果、学び、躓きポイント、未解決項目

### Gemini CLI（プレビュー）
- Gemini CLIサポートは現在プレビュー段階
- Claude Codeと並行して両方のエージェントのフックを有効化可能
- `entire enable --agent gemini` で有効化

## 重要な事実・データ

- **リポジトリ**: GitHub stars 2,352 / Forks 162（2026年2月時点）
- **ライセンス**: MIT
- **対応エージェント**: Claude Code（デフォルト）、Gemini CLI（プレビュー、併用可能）
- **テレメトリ**: Posthogへ匿名送信（`--telemetry=false` で無効化可）
- **Git worktrees**: 各ワークツリーで独立したセッション追跡
- **同時セッション**: 同一コミットで複数AIセッションを並行実行可能。両方のチェックポイントが独立して保存・巻き戻し可能

## トラブルシューティング

- **shadow branch conflict**: `entire reset --force` で解消
- **デバッグモード**: `ENTIRE_LOG_LEVEL=debug` または `settings.local.json` で `log_level: "debug"`
- **SSH認証エラー**: `ssh-keyscan` でGitHubホストキーを `known_hosts` に追加
- **アクセシビリティ**: スクリーンリーダー利用時は `export ACCESSIBLE=1` でシンプルなプロンプト表示に切替

## 結論・示唆

- **mainブランチ**: Manual-Commit戦略を推奨。余計なコミットを避けつつ、いつでも巻き戻し可能
- **featureブランチ**: Auto-Commitで各応答ごとのフル巻き戻しが可能
- **オンボーディング・監査**: プロンプト→変更→コミットの経路を可視化することで、コードの背景理解やコンプライアンス要件に対応できる
- **開発**: miseを使用したタスク自動化。`mise run build/test/lint/fmt` でビルド・テスト・リント・フォーマット

## 制限事項・注意点

- Auto-Commit戦略はmainブランチではフル巻き戻し不可（logs-onlyモード）
- Auto-SummarizationにはClaude CLIのインストールと認証が必要（他のAIバックエンドは将来対応予定）
- Gemini CLIサポートはプレビュー段階であり、問題が発生する可能性がある
- WindowsはWSL経由のみサポート

---

*Source: [entireio/cli](https://github.com/entireio/cli)*
