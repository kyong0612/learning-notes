---
title: "affaan-m/everything-claude-code: Complete Claude Code configuration collection - agents, skills, hooks, commands, rules, MCPs. Battle-tested configs from an Anthropic hackathon winner."
source: "https://github.com/affaan-m/everything-claude-code"
author:
  - "[[affaan-m]]"
  - "Affaan Mustafa"
published: 2025-09
created: 2026-01-20
description: "Anthropicハッカソン優勝者による、Claude Code用の本番環境対応設定コレクション。エージェント、スキル、フック、コマンド、ルール、MCPの包括的な設定が含まれ、10ヶ月以上の実践使用で磨かれた設定集。"
tags:
  - "clippings"
  - "claude-code"
  - "ai-agents"
  - "mcp"
  - "ai-tools"
  - "developer-tools"
  - "anthropic"
  - "productivity"
---

## 概要

このリポジトリは、Anthropicハッカソン優勝者であるAffaan Mustafaが10ヶ月以上のClaude Code使用経験を通じて構築した、本番環境対応の設定コレクション。エージェント、スキル、フック、コマンド、ルール、MCP設定が含まれている。

## リポジトリ構造

```
everything-claude-code/
├── agents/           # 委任用の特化サブエージェント
│   ├── planner.md           # 機能実装計画
│   ├── architect.md         # システム設計判断
│   ├── tdd-guide.md         # テスト駆動開発
│   ├── code-reviewer.md     # 品質・セキュリティレビュー
│   ├── security-reviewer.md # 脆弱性分析
│   ├── build-error-resolver.md
│   ├── e2e-runner.md        # Playwright E2Eテスト
│   ├── refactor-cleaner.md  # デッドコード削除
│   └── doc-updater.md       # ドキュメント同期
│
├── skills/           # ワークフロー定義とドメイン知識
│   ├── coding-standards.md         # 言語ベストプラクティス
│   ├── backend-patterns.md         # API、DB、キャッシュパターン
│   ├── frontend-patterns.md        # React、Next.jsパターン
│   ├── project-guidelines-example.md
│   ├── tdd-workflow/               # TDD手法
│   ├── security-review/            # セキュリティチェックリスト
│   └── clickhouse-io.md            # ClickHouse分析
│
├── commands/         # 素早い実行用のスラッシュコマンド
│   ├── tdd.md              # /tdd - テスト駆動開発
│   ├── plan.md             # /plan - 実装計画
│   ├── e2e.md              # /e2e - E2Eテスト生成
│   ├── code-review.md      # /code-review - 品質レビュー
│   ├── build-fix.md        # /build-fix - ビルドエラー修正
│   ├── refactor-clean.md   # /refactor-clean - デッドコード削除
│   ├── test-coverage.md    # /test-coverage - カバレッジ分析
│   ├── update-codemaps.md  # /update-codemaps - ドキュメント更新
│   └── update-docs.md      # /update-docs - ドキュメント同期
│
├── rules/            # 常時遵守ガイドライン
│   ├── security.md         # 必須セキュリティチェック
│   ├── coding-style.md     # 不変性、ファイル構成
│   ├── testing.md          # TDD、80%カバレッジ要件
│   ├── git-workflow.md     # コミット形式、PRプロセス
│   ├── agents.md           # サブエージェント委任タイミング
│   ├── performance.md      # モデル選択、コンテキスト管理
│   ├── patterns.md         # APIレスポンス形式、フック
│   └── hooks.md            # フックドキュメント
│
├── hooks/            # トリガーベースの自動化
│   └── hooks.json          # PreToolUse、PostToolUse、Stopフック
│
├── mcp-configs/      # MCPサーバー設定
│   └── mcp-servers.json    # GitHub、Supabase、Vercel、Railway等
│
├── plugins/          # プラグインエコシステムドキュメント
│   └── README.md
│
└── examples/         # 設定例
    ├── CLAUDE.md           # プロジェクトレベル設定例
    ├── user-CLAUDE.md      # ユーザーレベル設定例
    └── statusline.json     # カスタムステータスライン設定
```

## 主要コンセプト

### 1. Agents（エージェント）

サブエージェントは限定されたスコープで委任タスクを処理する。

```yaml
---
name: code-reviewer
description: Reviews code for quality, security, and maintainability
tools: Read, Grep, Glob, Bash
model: opus
---

You are a senior code reviewer...
```

### 2. Skills（スキル）

コマンドやエージェントから呼び出されるワークフロー定義。

```markdown
# TDD Workflow

1. インターフェースを最初に定義
2. 失敗するテストを書く（RED）
3. 最小限のコードを実装（GREEN）
4. リファクタリング（IMPROVE）
5. 80%以上のカバレッジを確認
```

### 3. Hooks（フック）

ツールイベントで発火する自動化。例：console.logの警告

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
  }]
}
```

### 4. Rules（ルール）

常に従うべきガイドライン。モジュール式で管理：

```
~/.claude/rules/
  security.md      # ハードコードされた秘密情報禁止
  coding-style.md  # 不変性、ファイル制限
  testing.md       # TDD、カバレッジ要件
```

## クイックスタート

### 1. 必要なファイルをコピー

```bash
# リポジトリをクローン
git clone https://github.com/affaan-m/everything-claude-code.git

# エージェントをClaude設定にコピー
cp everything-claude-code/agents/*.md ~/.claude/agents/

# ルールをコピー
cp everything-claude-code/rules/*.md ~/.claude/rules/

# コマンドをコピー
cp everything-claude-code/commands/*.md ~/.claude/commands/

# スキルをコピー
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

### 2. hooksをsettings.jsonに追加

`hooks/hooks.json`の内容を`~/.claude/settings.json`にコピー。

### 3. MCPを設定

`mcp-configs/mcp-servers.json`から必要なMCPサーバーを`~/.claude.json`にコピー。

> **重要:** `YOUR_*_HERE`プレースホルダーを実際のAPIキーに置き換える。

## 重要な注意事項

### コンテキストウィンドウ管理

**重要:** すべてのMCPを同時に有効化しないこと。200kのコンテキストウィンドウは、多くのツールを有効にすると70kまで縮小する可能性がある。

**目安:**
- 20-30個のMCPを設定
- プロジェクトごとに10個未満を有効化
- アクティブなツールは80個未満

プロジェクト設定で`disabledMcpServers`を使用して未使用のMCPを無効化。

### カスタマイズの推奨

1. 共感できるものから始める
2. 自分のスタックに合わせて修正
3. 使わないものは削除
4. 独自のパターンを追加

## 背景

作者は実験的ロールアウト時からClaude Codeを使用。2025年9月のAnthropic x Forum Venturesハッカソンで[@DRodriguezFX](https://x.com/DRodriguezFX)と共に[zenith.chat](https://zenith.chat)を構築し優勝。これらの設定は複数の本番アプリケーションで実戦テスト済み。

## 関連リンク

- **完全ガイド:** [The Shorthand Guide to Everything Claude Code](https://x.com/affaanmustafa/status/2012378465664745795)
- **作者Twitter:** [@affaanmustafa](https://x.com/affaanmustafa)
- **zenith.chat:** [zenith.chat](https://zenith.chat)

## コントリビューション

以下の貢献を歓迎：
- 有用なエージェントやスキル
- 巧妙なフック
- より良いMCP設定
- 改良されたルール

### コントリビューションのアイデア

- 言語固有のスキル（Python、Go、Rustパターン）
- フレームワーク固有の設定（Django、Rails、Laravel）
- DevOpsエージェント（Kubernetes、Terraform、AWS）
- テスト戦略（各種フレームワーク）
- ドメイン固有の知識（ML、データエンジニアリング、モバイル）

## ライセンス

MIT - 自由に使用、必要に応じて修正、可能であれば貢献を。
