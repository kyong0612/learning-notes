---
title: "anthropics/claude-code-security-review: An AI-powered security review GitHub Action using Claude to analyze code changes for security vulnerabilities."
source: "https://github.com/anthropics/claude-code-security-review"
author:
  - "[[ddworken]]"
published:
created: 2025-08-08
description: "GitHub Actions 向けのAI駆動セキュリティレビュー。Claude CodeでPR差分に文脈理解を効かせた脆弱性検出、PRコメント、自動の誤検知抑制などを提供。"
tags:
  - "clippings"
  - "GitHub Actions"
  - "Application Security"
  - "Code Review"
  - "SAST"
  - "Anthropic Claude"
---
## 要約

### 概要

- Anthropic のリポジトリ。Claude Code を用いて、PRの差分や文脈を理解した上で脆弱性を検出・要約し、PRに自動コメントする GitHub Action を提供。
- 低インパクト/誤検知が出やすいカテゴリを自動で除外するフィルタを備え、実用的な発見に集中。

### 主要機能

- AIによるコンテキスト理解・意味解析に基づく検出
- PR差分に限定したスキャン（変更箇所を重点的に解析）
- 検出結果のPR自動コメントと成果物アップロード
- 誤検知フィルタの同梱およびカスタマイズ
- 言語非依存（任意の言語で利用可）

### 導入（Quick Start）

- `.github/workflows/security.yml` に Action を追加。
- 必須入力は `claude-api-key`（AnthropicのAPIキー）。`comment-pr`/`upload-results` などの挙動をオプションで制御可能。

### 設定（Inputs/Outputs）

- Inputs: `claude-api-key`(必須), `comment-pr`, `upload-results`, `exclude-directories`, `claudecode-timeout`, `run-every-commit`, `false-positive-filtering-instructions`, `custom-security-scan-instructions`。
- Outputs: `findings-count`, `new-findings-count`, `results-file`。

### 仕組み（Architecture/Workflow）

- 構成: `github_action_audit.py`(実行本体), `prompts.py`(監査プロンプト), `findings_filter.py`(誤検知フィルタ), `claude_api_client.py`, `json_parser.py`, テスト群と `evals/`。
- フロー: PR作成→差分解析→文脈レビュー→検出生成（説明/深刻度/修正指針）→誤検知フィルタ→PRコメント投稿。

### 検出対象の代表例

- インジェクション（SQL/コマンド/LDAP/XPath/NoSQL/XXE）
- 認証/認可（権限昇格、IDOR、バイパス、セッション）
- 露出（ハードコード秘密、ログ漏えい、情報漏えい、PII不備）
- 暗号（弱アルゴリズム、鍵管理不備、乱数不備）
- 入力検証（未検証/不備、バッファオーバーフロー）
- ビジネスロジック（レース、TOCTOU）
- 構成（セキュリティヘッダ欠如、過剰CORS）
- サプライチェーン（脆弱依存/タイポスクワッティング）
- 任意コード実行（逆直列化/pickle/eval）
- XSS（反射型/蓄積型/DOM）

### 誤検知抑制（除外の例）

- DoS/レート制限/メモリ・CPU枯渇/影響未立証の一般的入力検証/オープンリダイレクト。
- プロジェクト目的に合わせてフィルタ規則は調整可能。

### 従来SASTとの差分

- パターン照合だけでなく、コードの意図・文脈を考慮。
- 説明付きの指摘と修正ガイダンス、低ノイズ化による実運用適合性。

### 運用/カスタマイズ

- GitHub Actions: Quick Start通りに導入すれば依存関係は自動処理。
- ローカル: `claudecode/evals/README.md` を参照しPRに対して実行可。
- Slashコマンド: Claude Code 環境で `/security-review` を実行可能。`.claude/commands/security-review.md` をプロジェクトにコピーし編集することで、組織固有のルールを拡張。
- 追加のスキャン/フィルタ指示は `docs/` を参照しプロンプトに追記可。

### テスト/サポート/ライセンス

- テスト: `pytest claudecode -v`
- サポート: GitHub Issues / Actionsログでトラブルシュート
- ライセンス: MIT

### 制限事項

- リポジトリページ上に画像/図表の掲載は確認できず（組み込み対象なし）。
- 公開ページからは公式の著者・公開日の明示は不明。運用上は組織リポジトリ（anthropics）として扱う。

### 重要なポイント

- PR差分の文脈理解と誤検知抑制により、実務で扱いやすいセキュリティレビューを自動化。
- 組織要件に合わせたプロンプト/フィルタのカスタマイズ性が高い。
