---
title: "anthropics/claude-code-security-review: An AI-powered security review GitHub Action using Claude to analyze code changes for security vulnerabilities."
source: "https://github.com/anthropics/claude-code-security-review"
author:
  - "[[Anthropic]]"
  - "[[ddworken]]"
published: 2025-08-06
created: 2026-02-23
description: "Claude Codeを活用したAI駆動のセキュリティレビューGitHub Action。PRの差分を意味的に解析し、脆弱性を検出・コメントする。従来のSASTより文脈理解に優れ、誤検知が少ない。"
tags:
  - "clippings"
  - "security"
  - "github-actions"
  - "claude-code"
  - "code-review"
  - "AI"
---

## 概要

**Claude Code Security Reviewer** は、Anthropicが公開したAI駆動のセキュリティレビューツール。GitHub Actionとして動作し、PRが作成されるたびにClaude Codeを使ってコード変更をセマンティックに解析し、セキュリティ脆弱性を検出する。従来のSAST（静的解析）ツールがパターンマッチングに依存するのに対し、コードの意味と意図を理解した上で脆弱性を判断するため、誤検知が少なく高精度なレビューが可能。

- **リポジトリ**: [anthropics/claude-code-security-review](https://github.com/anthropics/claude-code-security-review)
- **ブログ記事**: [Automate security reviews with Claude Code](https://www.anthropic.com/news/automate-security-reviews-with-claude-code)（2025年8月6日）
- **ライセンス**: MIT

---

## 主な機能

| 機能 | 説明 |
|------|------|
| **AI駆動の解析** | Claudeの高度な推論でセマンティックにセキュリティ脆弱性を検出 |
| **Diff対応スキャン** | PRでは変更されたファイルのみを解析 |
| **PRコメント** | 脆弱性を発見した行にインラインコメントを自動投稿 |
| **文脈理解** | パターンマッチングを超え、コードのセマンティクスを理解 |
| **言語非依存** | あらゆるプログラミング言語に対応 |
| **誤検知フィルタリング** | ノイズを削減し、実際の脆弱性にフォーカス |

---

## クイックスタート

`.github/workflows/security.yml` に以下を追加するだけで利用開始できる：

```yaml
name: Security Review

permissions:
  pull-requests: write
  contents: read

on:
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha || github.sha }}
          fetch-depth: 2

      - uses: anthropics/claude-code-security-review@main
        with:
          comment-pr: true
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
```

---

## 設定オプション

### Action Inputs

| Input | 説明 | デフォルト | 必須 |
|-------|------|-----------|------|
| `claude-api-key` | Anthropic Claude APIキー（Claude APIとClaude Code両方の利用が有効化されている必要あり） | なし | Yes |
| `comment-pr` | PRに検出結果をコメントするか | `true` | No |
| `upload-results` | 結果をアーティファクトとしてアップロードするか | `true` | No |
| `exclude-directories` | スキャン除外ディレクトリ（カンマ区切り） | なし | No |
| `claude-model` | 使用するClaudeモデル名 | `claude-opus-4-1-20250805` | No |
| `claudecode-timeout` | 解析タイムアウト（分） | `20` | No |
| `run-every-commit` | 全コミットで実行（キャッシュチェックをスキップ）。多コミットPRでは誤検知が増加する可能性あり | `false` | No |
| `false-positive-filtering-instructions` | カスタム誤検知フィルタリング指示ファイルのパス | なし | No |
| `custom-security-scan-instructions` | カスタムセキュリティスキャン指示ファイルのパス | なし | No |

### Action Outputs

| Output | 説明 |
|--------|------|
| `findings-count` | 検出されたセキュリティ問題の総数 |
| `results-file` | 結果JSONファイルへのパス |

---

## ワークフロー（動作の仕組み）

1. **PR解析**: PRが作成されるとClaudeが差分を解析し、変更内容を把握
2. **文脈レビュー**: コード変更を文脈の中で検査し、目的とセキュリティ上の影響を理解
3. **検出結果の生成**: 脆弱性に対して詳細な説明、重大度評価、修正ガイダンスを生成
4. **誤検知フィルタリング**: 低影響・誤検知しやすい検出結果をフィルタリングしてノイズ削減
5. **PRコメント**: 該当コード行にレビューコメントとして投稿

### アーキテクチャ

```
claudecode/
├── github_action_audit.py  # GitHub Actions用メイン監査スクリプト
├── prompts.py              # セキュリティ監査プロンプトテンプレート
├── findings_filter.py      # 誤検知フィルタリングロジック
├── claude_api_client.py    # 誤検知フィルタリング用Claude APIクライアント
├── json_parser.py          # 堅牢なJSON解析ユーティリティ
├── requirements.txt        # Python依存関係
├── test_*.py               # テストスイート
└── evals/                  # 任意のPRでテストするための評価ツール
```

---

## 検出可能な脆弱性

- **インジェクション攻撃**: SQLインジェクション、コマンドインジェクション、LDAPインジェクション、XPathインジェクション、NoSQLインジェクション、XXE
- **認証・認可**: 認証の欠陥、権限昇格、安全でない直接オブジェクト参照、バイパスロジック、セッション脆弱性
- **データ漏洩**: ハードコードされた秘密情報、機密データのログ出力、情報漏洩、PII取り扱い違反
- **暗号の問題**: 脆弱なアルゴリズム、不適切な鍵管理、安全でない乱数生成
- **入力検証**: バリデーション欠如、不適切なサニタイゼーション、バッファオーバーフロー
- **ビジネスロジック欠陥**: 競合状態、TOCTOU（Time-of-Check-Time-of-Use）問題
- **設定セキュリティ**: 安全でないデフォルト値、セキュリティヘッダー欠如、過度に許可的なCORS
- **サプライチェーン**: 脆弱な依存関係、タイポスクワッティングリスク
- **コード実行**: デシリアライゼーション経由のRCE、pickleインジェクション、evalインジェクション
- **XSS**: 反射型、格納型、DOMベースのXSS

---

## 誤検知フィルタリング

以下のカテゴリは高影響な脆弱性にフォーカスするために自動的に除外される：

- DoS脆弱性
- レートリミティングの懸念
- メモリ/CPU枯渇問題
- 実証されたインパクトのない汎用的な入力検証
- オープンリダイレクト脆弱性

プロジェクト固有のセキュリティ目標に合わせてフィルタリングをカスタマイズすることも可能。

---

## 従来のSASTに対する優位性

| 観点 | 従来のSAST | Claude Code Security Reviewer |
|------|-----------|-------------------------------|
| **解析方式** | パターンマッチング | セマンティック理解（コードの意味・意図を理解） |
| **誤検知率** | 高い | 低い（実際に脆弱かどうかをAIが判断） |
| **説明の質** | ルール名のみ | 脆弱性の理由と修正方法を詳細に説明 |
| **カスタマイズ** | ルール追加/除外 | 組織固有のセキュリティ要件に適応可能 |

---

## Claude Code統合: `/security-review` コマンド

Claude Codeにはビルトインの `/security-review` スラッシュコマンドが搭載されており、GitHub Actionと同等のセキュリティ解析をターミナルから直接実行可能。コミット前のアドホックなセキュリティ解析に使用できる。

チェック対象のパターン：
- 依存関係の脆弱性
- 安全でないデータ処理
- 認証・認可の欠陥
- XSS脆弱性
- SQLインジェクションリスク

### コマンドのカスタマイズ

1. リポジトリの [`security-review.md`](https://github.com/anthropics/claude-code-security-review/blob/main/.claude/commands/security-review.md?plain=1) を自プロジェクトの `.claude/commands/` フォルダにコピー
2. `security-review.md` を編集して、組織固有のセキュリティ方針を追加

---

## Anthropic社内での実績

Anthropic自身がこのツールを社内で使用し、Claude Codeを含むプロダクションコードのセキュリティ確保に活用している。

### 検出事例

1. **DNSリバインディングによるRCE脆弱性**: ローカルHTTPサーバーを起動する内部ツールの新機能で、DNSリバインディングを介したリモートコード実行の脆弱性をPRマージ前に検出・修正
2. **SSRFの脆弱性**: 内部認証情報を安全に管理するためのプロキシシステムで、SSRF攻撃に対する脆弱性を自動的にフラグ付けし、修正

---

## セキュリティ上の注意事項

> **重要**: このアクションはプロンプトインジェクション攻撃に対して強化されていないため、**信頼できるPRのレビューにのみ使用すること**。外部コントリビューターからのPRについては「Require approval for all external contributors」オプションの有効化を推奨。

---

## テスト

```bash
cd claude-code-security-review
pytest claudecode -v
```
