---
title: "GitHub Agentic Workflows"
source: "https://github.github.io/gh-aw/"
author:
  - "GitHub Next"
  - "Microsoft Research"
published: 2026-01-13
created: 2026-02-13
description: "GitHub Agentic Workflowsは、GitHub ActionsでAIコーディングエージェント（Copilot、Claude、Codex）を実行し、マークダウンによる自然言語の指示でリポジトリの自動化を実現するフレームワーク。セキュリティファーストの設計で、サンドボックス実行・最小権限・出力サニタイズなどの多層防御アーキテクチャを備える。"
tags:
  - "clippings"
  - "github"
  - "ai-agents"
  - "github-actions"
  - "automation"
  - "continuous-ai"
---

## 概要

**GitHub Agentic Workflows** は、GitHub Next と Microsoft Research が開発した、AIコーディングエージェントを GitHub Actions 上で実行するリポジトリ自動化フレームワーク。マークダウンファイルに自然言語で指示を記述するだけで、イベントトリガー・定期実行・スケジュールジョブを通じてリポジトリの改善、ドキュメント管理、テストカバレッジ向上、コンプライアンス監視などを自動化できる。

> **注意**: GitHub Agentic Workflows は早期開発段階であり、大幅に変更される可能性がある。利用にはセキュリティへの注意と人間による監督が必要。

---

## 主要な特徴

| 機能 | 説明 |
|------|------|
| **マークダウンワークフロー** | 複雑なYAMLではなく、マークダウンで自動化を記述 |
| **AI駆動の意思決定** | コンテキストを理解し、状況に適応するワークフロー |
| **GitHub統合** | Actions、Issues、PR、Discussions、リポジトリ管理と深い統合 |
| **セキュリティファースト** | サンドボックス実行、最小権限、安全な出力処理 |
| **複数AIエンジン** | Copilot、Claude、Codex、カスタムAIプロセッサに対応 |
| **Continuous AI** | AIをソフトウェアコラボレーションに体系的・自動的に適用 |

---

## ワークフローの仕組み

### ワークフロー構造

各ワークフローは **フロントマター**（YAML設定部分）と **マークダウン本文**（自然言語の指示）で構成される。

```yaml
---
on:                    # トリガー: いつ実行するか
  issues:
    types: [opened]
permissions: read-all  # セキュリティ: デフォルトは読み取り専用
safe-outputs:          # 許可する書き込み操作
  add-comment:
---

# Issue Clarifier
現在のissueを分析し、不明確な場合は追加の詳細を求めてください。
```

- **フロントマター**: トリガー、パーミッション、ツールを定義
- **マークダウン本文**: 自然言語でタスクを記述
- `gh aw compile` コマンドでマークダウンをセキュアな `.lock.yml`（GitHub Actionsワークフロー）に変換

### Agentic vs Traditional ワークフロー

- **従来のワークフロー**: 固定の if/then ロジックで事前プログラムされたステップを実行
- **Agenticワークフロー**: AIがコンテキストを理解し、意思決定し、自然言語の指示を柔軟に解釈して動作を適応

---

## 対応AIエンジン

### GitHub Copilot（デフォルト）

```yaml
engine: copilot
```

- `COPILOT_GITHUB_TOKEN` リポジトリシークレットが必要（`copilot-requests`スコープのPAT）
- カスタムエージェント（`.github/agents/`ディレクトリ）による特化プロンプトに対応

### Claude by Anthropic

```yaml
engine: claude
```

- `ANTHROPIC_API_KEY` が必要
- フルMCPツールサポートとアローリスト機能

### OpenAI Codex

```yaml
engine: codex
```

- `OPENAI_API_KEY` が必要

### 拡張設定

```yaml
engine:
  id: copilot
  version: latest
  model: gpt-5           # デフォルトはclaude-sonnet-4
  args: ["--add-dir", "/workspace"]
  agent: agent-id
  env:
    DEBUG_MODE: "true"
```

---

## セキュリティアーキテクチャ（多層防御）

GitHub Agentic Workflows は、プロンプトインジェクション、不正なMCPサーバー、悪意あるエージェントに対する多層防御セキュリティアーキテクチャを実装している。

### 3層の信頼モデル

| レイヤー | 内容 | 保護対象 |
|----------|------|----------|
| **Layer 1: 基盤レベル** | CPU、MMU、カーネル、コンテナランタイムによるハードウェアレベルの分離 | メモリ分離、CPU分離、通信境界の強制 |
| **Layer 2: 設定レベル** | 宣言的な設定によるコンポーネントの構造と接続性の制御 | コンポーネントのロード・接続・権限の割り当て |
| **Layer 3: プランレベル** | コンパイラによるワークフローのステージ分割と時間的な動作制約 | 外部副作用の明示化と検証 |

### Safe Outputs（権限分離）

- エージェントジョブは **読み取り専用権限** で実行
- 書き込み操作（Issue作成、コメント追加、PR作成）は **別ジョブ** として実行
- エージェント完了後にバッファされた成果物を検証してから外部化

```
Agent Job (Read-Only) → Threat Detection Job → Safe Output Jobs (Scoped Write)
```

### Agent Workflow Firewall (AWF)

- エージェントをコンテナ化し、Docker ネットワークにバインド
- Squid プロキシを通じてHTTP/HTTPSトラフィックをリダイレクト
- 設定可能なドメインアローリストでエグレストラフィックを制御

```yaml
network:
  firewall: true
  allowed:
    - defaults    # 基本インフラ
    - python      # PyPIエコシステム
    - node        # npmエコシステム
    - "api.example.com"  # カスタムドメイン
```

### MCP サーバーサンドボックス

- カスタムMCPサーバーは Docker コンテナ内で分離実行
- コンテナごとのドメインアローリスト
- 明示的な `allowed:` リストによるツール制限
- シークレットは環境変数経由で渡し、設定ファイルには含めない

### 脅威検知パイプライン

- エージェント完了後、別ジョブでAIによるセキュリティ分析を実行
- シークレット漏洩、悪意あるコードパターン、ポリシー違反を検出
- 脅威が検出された場合、書き込みが外部化される前にワークフローを終了
- TruffleHog、Semgrep、LlamaGuard 等の外部セキュリティスキャナーとの統合が可能

### コンテンツサニタイズ

ユーザー生成コンテンツをエージェントに渡す前にサニタイズ:

| 機構 | 保護 |
|------|------|
| @mention無効化 | 意図しないユーザー通知を防止 |
| ボットトリガー保護 | 自動Issue紐付けを防止 |
| XML/HTMLタグ変換 | インジェクション防止 |
| URIフィルタリング | 信頼ドメインからのHTTPSのみ許可 |
| コンテンツ制限 | 0.5MB上限、65k行上限 |
| 制御文字除去 | ANSIエスケープのストリップ |

### シークレット墨消し

- `/tmp/gh-aw` ディレクトリ内の全ファイルからシークレット値をスキャン・墨消し
- `if: always()` で無条件実行（ワークフロー失敗時も保護）
- 最初の3文字のみ表示 + アスタリスクでマスク

---

## ワークフローギャラリー（活用例）

| カテゴリ | 内容 |
|----------|------|
| **Issue & PR管理** | 自動トリアージ、ラベリング、プロジェクト調整 |
| **継続的ドキュメント** | ドキュメントの継続的なメンテナンスと一貫性維持 |
| **継続的改善** | 日次のコード簡素化、リファクタリング、スタイル改善 |
| **メトリクス & 分析** | 日次レポート、トレンド分析、ワークフロー健全性監視 |
| **品質 & テスト** | CI障害診断、テスト改善、品質チェック |
| **マルチリポジトリ** | 機能同期とクロスリポジトリトラッキング |

### 日次レポートの例

```yaml
---
on:
  schedule: daily
permissions:
  contents: read
  issues: read
  pull-requests: read
safe-outputs:
  create-issue:
    title-prefix: "[team-status]"
    labels: [report, daily-status]
    close-older-issues: true
---

## Daily Issues Report
チームのための明るい日次ステータスレポートをGitHub issueとして作成。

## What to include
- 最近のリポジトリ活動（issues、PR、discussions、releases、コード変更）
- 進捗追跡、目標リマインダー、ハイライト
- プロジェクトステータスと推奨事項
- メンテナー向けの次のアクションステップ
```

---

## クイックスタート

### 前提条件

- AIアカウント（GitHub Copilot / Anthropic Claude / OpenAI Codex のいずれか）
- 書き込みアクセス権のあるGitHubリポジトリ
- GitHub Actions が有効
- GitHub CLI (`gh`) v2.0.0+
- OS: Linux, macOS, Windows (WSL)

### セットアップ手順

```bash
# Step 1: 拡張機能のインストール
gh extension install github/gh-aw

# Step 2: サンプルワークフローの追加と実行
gh aw add-wizard githubnext/agentics/daily-repo-status

# Step 3: 完了を待つ（2〜3分）
# → リポジトリに「Daily Repo Report」Issueが自動作成される

# Step 4: カスタマイズ（任意）
# .github/workflows/daily-repo-status.md を編集後:
gh aw compile
gh aw run daily-repo-status
```

---

## ツールと MCP（Model Context Protocol）

ワークフローは **Model Context Protocol (MCP)** を通じてツールを使用する。MCP はAIエージェントを外部ツールやサービスに接続するための標準化プロトコル。

- **GitHub Tools**: Issue読み取り、コミット一覧、コード検索など
- **カスタムMCPサーバー**: Docker コンテナで分離実行
- **HTTP MCP**: HTTPS エンドポイント経由
- **ツールアローリスト**: 明示的な `allowed:` リストで利用可能な操作を制限

---

## コンパイル時セキュリティ

```bash
# 標準コンパイル
gh aw compile

# 厳格モード（書き込み権限不可、明示的ネットワーク設定必須）
gh aw compile --strict

# セキュリティスキャナー併用
gh aw compile --strict --actionlint --zizmor --poutine
```

- **スキーマ検証**: フロントマターの型・形式の検証
- **式の安全性チェック**: アローリストされた式のみ許可
- **アクションSHAピニング**: `actions/checkout@sha` 形式で固定
- **セキュリティスキャナー**: actionlint、zizmor、poutine による追加検証

---

## ベストプラクティス

1. シンプルに始めて反復する（明確で具体的な指示を記述）
2. `gh aw compile --watch` と `gh aw run` でテスト
3. `gh aw logs` でコストを監視
4. AIが生成したコンテンツはマージ前にレビュー
5. `safe-outputs` で Issue、コメント、PR の作成を制御

---

## 制限事項

- **早期開発段階**: 大幅に変更される可能性がある
- **人間の監督が必要**: 注意深いセキュリティ配慮と人間による監督が不可欠
- **リスクは利用者負担**: 自己責任での利用が前提
- **コンテナ化の制約**: 一部のコーディングエージェントはコンテナ化環境で正常に動作しない場合がある（AWFのchrootモードで緩和可能）
- **iframeコンテンツ**: アクセス不可