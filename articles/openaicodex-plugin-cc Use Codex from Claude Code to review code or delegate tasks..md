---
title: "openai/codex-plugin-cc: Use Codex from Claude Code to review code or delegate tasks."
source: "https://github.com/openai/codex-plugin-cc"
author: "OpenAI"
published: 2026-03-30
created: 2026-04-14
description: "Claude CodeからOpenAI Codexを直接利用し、コードレビューやタスク委任を行うためのプラグイン。既存のClaude Codeワークフロー内でCodexの能力を活用でき、通常レビュー・敵対的レビュー・バックグラウンドタスク委任などの機能を提供する。"
tags:
  - "openai"
  - "codex"
  - "claude-code"
  - "code-review"
  - "plugin"
  - "ai-tools"
  - "developer-tools"
---

## 概要

**codex-plugin-cc** は、OpenAIが公開したClaude Code用プラグインで、Claude Codeの中からCodex CLIを利用してコードレビューやタスク委任を行える。Claude Codeユーザーが既存のワークフローを離れることなくCodexの機能を活用できるようにすることが目的。

**リポジトリ**: [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)  
**ライセンス**: Apache-2.0  
**スター数**: 14,000+

---

## 提供される機能（スラッシュコマンド）

| コマンド | 用途 |
|---------|------|
| `/codex:review` | 通常のCodexコードレビュー（読み取り専用） |
| `/codex:adversarial-review` | ステアラブルなチャレンジレビュー |
| `/codex:rescue` | Codexにタスクを委任 |
| `/codex:status` | バックグラウンドジョブの状態確認 |
| `/codex:result` | 完了したジョブの結果取得 |
| `/codex:cancel` | アクティブなジョブのキャンセル |
| `/codex:setup` | インストール・認証状態の確認 |

---

## 要件

- **ChatGPTサブスクリプション（Freeプラン含む）** または **OpenAI APIキー**
  - 使用量はCodexの使用量制限にカウントされる
- **Node.js 18.18以降**

---

## インストール方法

```bash
# マーケットプレイスを追加
/plugin marketplace add openai/codex-plugin-cc

# プラグインをインストール
/plugin install codex@openai-codex

# プラグインをリロード
/reload-plugins

# セットアップ確認
/codex:setup
```

Codex CLIがインストールされていない場合は `/codex:setup` が自動インストールを提案する。手動インストールの場合：

```bash
npm install -g @openai/codex
```

未ログインの場合：

```bash
!codex login
```

---

## 各コマンドの詳細

### `/codex:review` — 通常レビュー

未コミットの変更やブランチ間の差分に対して、Codex品質のコードレビューを実行する。

- `--base <branch>`: ブランチレビュー（例: `--base main`）
- `--background`: バックグラウンド実行
- `--wait`: 完了まで待機
- **読み取り専用**（コード変更は行わない）
- ステアリング（フォーカステキスト指定）は不可

```bash
/codex:review
/codex:review --base main
/codex:review --background
```

> **注意**: マルチファイル変更のレビューは時間がかかるため、バックグラウンド実行が推奨される。

### `/codex:adversarial-review` — 敵対的レビュー

実装やデザインの選択に対して**意図的に疑問を投げかける**ステアラブルなレビュー。

**活用シーン**:
- 方向性そのものへのチャレンジが欲しい場合
- 設計の選択・トレードオフ・隠れた仮定の検証
- 認証・データ損失・ロールバック・競合状態・信頼性などの特定リスク領域のプレッシャーテスト

```bash
/codex:adversarial-review
/codex:adversarial-review --base main challenge whether this was the right caching and retry design
/codex:adversarial-review --background look for race conditions and question the chosen approach
```

- `/codex:review` と同じターゲット選択をサポート
- フラグの後にフォーカステキストを追加可能
- **読み取り専用**

### `/codex:rescue` — タスク委任

`codex:codex-rescue` サブエージェントを通じてCodexにタスクを委任する。

**活用シーン**:
- バグの調査
- 修正の試行
- 前回のCodexタスクの継続
- より小さいモデルでの高速・低コストな処理

```bash
/codex:rescue investigate why the tests started failing
/codex:rescue fix the failing test with the smallest safe patch
/codex:rescue --resume apply the top fix from the last run
/codex:rescue --model gpt-5.4-mini --effort medium investigate the flaky integration test
/codex:rescue --model spark fix the issue quickly
/codex:rescue --background investigate the regression
```

**オプション**:
- `--background` / `--wait`: 実行モード制御
- `--resume`: 最新のレスキュースレッドを継続
- `--fresh`: 新規スレッドで開始
- `--model`: 使用モデル指定（`spark` は `gpt-5.3-codex-spark` にマップ）
- `--effort`: 推論努力レベル

自然言語での委任も可能:

```
Ask Codex to redesign the database connection to be more resilient.
```

### `/codex:status` — ジョブ状態確認

```bash
/codex:status
/codex:status task-abc123
```

### `/codex:result` — 結果取得

完了したジョブの最終出力を表示。Codexセッション IDが含まれるため、`codex resume` で直接再開可能。

```bash
/codex:result
/codex:result task-abc123
```

### `/codex:cancel` — ジョブキャンセル

```bash
/codex:cancel
/codex:cancel task-abc123
```

### `/codex:setup` — セットアップ確認

Codexのインストール・認証状態を確認。**レビューゲート**の管理も可能。

```bash
/codex:setup --enable-review-gate   # レビューゲート有効化
/codex:setup --disable-review-gate  # レビューゲート無効化
```

> **⚠️ レビューゲートの注意**: 有効化するとClaude/Codexの長時間ループが発生し、使用量制限を急速に消費する可能性がある。アクティブに監視するセッションでのみ有効にすること。

---

## 典型的なワークフロー

### 出荷前レビュー

```bash
/codex:review
```

### 問題のCodexへの委任

```bash
/codex:rescue investigate why the build is failing in CI
```

### 長時間実行タスク

```bash
/codex:adversarial-review --background
/codex:rescue --background investigate the flaky test

# 後で確認
/codex:status
/codex:result
```

---

## Codex連携の仕組み

- プラグインはローカルの [Codex CLI](https://developers.openai.com/codex/cli/) と [Codex App Server](https://developers.openai.com/codex/app-server/) を通じて動作
- 同じCodexインストール・認証状態・リポジトリ環境を使用
- 既存のCodex設定（`config.toml`）をそのまま活用

### 設定のカスタマイズ

ユーザーレベルまたはプロジェクトレベルの `config.toml` でデフォルトモデルや推論努力を変更可能。

```toml
# .codex/config.toml
model = "gpt-5.4-mini"
model_reasoning_effort = "high"
```

**設定の優先順位**:
1. ユーザーレベル: `~/.codex/config.toml`
2. プロジェクトレベル: `.codex/config.toml`（[プロジェクトが信頼済み](https://developers.openai.com/codex/config-advanced#project-config-files-codexconfigtoml)の場合のみ）

### Codexへの作業移行

委任されたタスクやレビューゲートの実行結果は `codex resume` で直接Codex内で継続可能。`/codex:result` や `/codex:status` で取得したセッションIDを使用する。

---

## FAQ

| 質問 | 回答 |
|------|------|
| 別のCodexアカウントが必要？ | 不要。ローカルのCodex CLI認証を使用する。ChatGPTアカウントまたはAPIキーでのログインが必要。 |
| 別のCodexランタイムを使用？ | いいえ。同一マシン上のローカルCodex CLI/App Serverを使用する。 |
| 既存のCodex設定は使える？ | はい。同じ `config.toml` が適用される。 |
| 既存のAPIキーやbase URL設定は使える？ | はい。ローカルCLIを使用するため、既存の設定がそのまま適用される。 |

---

## 重要なポイント

1. **Claude CodeとCodexの統合**: 2つのAIコーディングツールを組み合わせ、Claude Codeのワークフロー内からCodexの能力を活用できる
2. **2種類のレビュー**: 通常レビュー（`review`）と敵対的レビュー（`adversarial-review`）で、異なる観点からコード品質を検証可能
3. **タスク委任**: `rescue` コマンドでバグ調査や修正をCodexに委任でき、モデルや努力レベルも指定可能
4. **バックグラウンド実行**: 長時間タスクはバックグラウンドで実行し、`status`/`result` で非同期に確認可能
5. **レビューゲート**: Claudeの応答に対してCodexが自動レビューを行い、問題があれば停止する機能（使用量に注意）
6. **設定の共有**: 既存のCodex CLI設定・認証をそのまま活用でき、追加設定は最小限
