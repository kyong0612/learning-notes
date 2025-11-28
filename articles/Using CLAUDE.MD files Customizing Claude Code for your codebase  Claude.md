---
title: "Using CLAUDE.MD files: Customizing Claude Code for your codebase | Claude"
source: "https://www.claude.com/blog/using-claude-md-files"
author:
  - "Anthropic"
published: 2025-11-25
created: 2025-11-28
description: "CLAUDE.mdファイルを使用してClaude Codeにプロジェクト構造、コーディング基準、ワークフローに関する永続的なコンテキストを与える方法を解説する実践的なガイド。"
tags:
  - "Claude Code"
  - "CLAUDE.md"
  - "AI coding"
  - "prompt engineering"
  - "context engineering"
  - "MCP"
  - "developer tools"
---

## 概要

AIコーディングエージェントを使用する際の共通課題は、アーキテクチャ、規約、ワークフローを理解させるのに十分なコンテキストを、繰り返し説明せずにどう与えるかという点である。CLAUDE.mdファイルはこの問題を解決し、Claudeにプロジェクトに関する永続的なコンテキストを提供する。

---

## CLAUDE.mdファイルとは

CLAUDE.mdは、リポジトリに配置してClaudeにプロジェクト固有のコンテキストを提供する特別な設定ファイル。

### 配置場所

- **リポジトリルート**: チームで共有
- **親ディレクトリ**: モノレポ設定用
- **ホームフォルダ**: すべてのプロジェクトに適用

### CLAUDE.mdの例

```markdown
# Project Context

When working with this codebase, prioritize readability over cleverness. Ask clarifying questions before making architectural changes.

## About This Project

FastAPI REST API for user authentication and profiles. Uses SQLAlchemy for database operations and Pydantic for validation.

## Key Directories

- `app/models/` - database models
- `app/api/` - route handlers
- `app/core/` - configuration and utilities

## Standards

- Type hints required on all functions
- pytest for testing (fixtures in `tests/conftest.py`)
- PEP 8 with 100 character lines

## Common Commands
```bash
uvicorn app.main:app --reload  # dev server
pytest tests/ -v               # run tests
```

## Notes

All routes use `/api/v1` prefix. JWT tokens expire after 24 hours.

```

### 含めるべき内容
- 一般的なbashコマンド
- コアユーティリティ
- コードスタイルガイドライン
- テスト手順
- リポジトリの規約
- 開発環境セットアップ
- プロジェクト固有の警告

**重要**: CLAUDE.mdファイルはClaudeのシステムプロンプトの一部になる。すべての会話はこのコンテキストがすでにロードされた状態で始まる。

---

## /initコマンドで始める

`/init` コマンドはプロジェクトを分析し、スターター設定を自動生成する。

```bash
cd your-project
claude
/init
```

### /initの動作

Claudeはコードベースを調査する:

- パッケージファイル
- 既存のドキュメント
- 設定ファイル
- コード構造

### /init実行後のステップ

1. 生成された内容の正確性を確認
2. Claudeが推測できなかったワークフロー指示を追加（ブランチ命名規則、デプロイプロセス、コードレビュー要件）
3. プロジェクトに当てはまらない一般的なガイダンスを削除
4. バージョン管理にコミットしてチームで共有

### 既存プロジェクトでの/init

既にCLAUDE.mdがあるプロジェクトでも `/init` を使用可能。Claudeは現在のファイルを確認し、コードベース調査に基づいて改善を提案する。

### `#` キーでの追加

繰り返し入力する指示は `#` キーを使って追加できる。これらの追加は、チームの実際の作業方法を反映したCLAUDE.mdに蓄積される。

---

## CLAUDE.mdの構造化方法

### 1. Claudeにマップを与える

プロジェクトの要約と高レベルのディレクトリ構造を追加することで、Claudeがコードベースをナビゲートする際に即座にオリエンテーションを得られる。

```
main.py
├── logs
│   ├── application.log
├── modules
│   ├── cli.py
│   ├── logging_utils.py
│   ├── media_handler.py
│   ├── player.py
```

**含めるべき情報:**

- 主要な依存関係
- アーキテクチャパターン
- 非標準的な組織の選択
- ドメイン駆動設計、マイクロサービス、特定のフレームワーク

### 2. Claudeをツールに接続する

Claudeは完全な環境を継承するが、どのカスタムツールやスクリプトを使用するかのガイダンスが必要。

**ドキュメントに含める内容:**

- ツール名
- 基本的な使用パターン
- いつ呼び出すか
- `--help` フラグの存在
- 複雑なツールの場合は一般的な呼び出し例

#### MCPとの連携

ClaudeはMCP（Model Context Protocol）クライアントとして機能し、機能を拡張するMCPサーバーに接続する。

**設定方法:**

- プロジェクト設定
- グローバル設定
- チェックインされた `.mcp.json` ファイル

**トラブルシューティング:** `--mcp-debug` フラグで接続問題をデバッグ

#### Slack MCP設定例

```markdown
### Slack MCP
- Posts to #dev-notifications channel only
- Use for deployment notifications and build failures
- Do not use for individual PR updates (those go through GitHub webhooks)
- Rate limited to 10 messages per hour
```

### 3. 標準ワークフローを定義する

Claudeに計画なしでコード変更を行わせると、手戻りが発生する。CLAUDE.mdで標準ワークフローを定義する。

#### 変更前に対処すべき4つの質問

1. これは現在の状態についての質問で、まず調査が必要か？
2. 実装前に詳細な計画が必要か？
3. 追加情報で不足しているものは何か？
4. 効果はどのようにテストされるか？

#### 具体的なワークフロー例

- **機能開発**: explore-plan-code-commit
- **アルゴリズム作業**: テスト駆動開発
- **UI変更**: ビジュアルイテレーション

#### ワークフロー指示の例

```markdown
1) Before modifying code in the following locations: X, Y, Z
 - Consider how it might affect A, B, C
 - Construct an implementation plan
 - Develop a test plan that will validate the following functions...
```

---

## Claude Codeでの追加Tips

### 1. コンテキストを新鮮に保つ - `/clear`

長時間の作業で無関係なコンテキストが蓄積される。タスク間で `/clear` を使用してコンテキストウィンドウをリセット。

**効果:**

- 蓄積された履歴を削除
- CLAUDE.md設定は保持
- 新しい問題に新鮮なコンテキストで対応

**使用例:** 認証のデバッグが終わり、新しいAPIエンドポイントの実装に移る時

### 2. 異なるフェーズにサブエージェントを使用

長い会話ではコンテキストが新しいタスクに干渉する。サブエージェントは分離されたコンテキストを維持し、以前のタスクからの情報が新しい分析に干渉するのを防ぐ。

**使用例:**
ペイメントプロセッサを実装した後、同じ会話で続けるのではなく「そのコードのセキュリティレビューにサブエージェントを使用して」と指示する。

**最適な使用ケース:**
各フェーズで異なる視点が必要なマルチステップワークフロー

- 実装: アーキテクチャコンテキストと機能要件が必要
- セキュリティレビュー: 脆弱性のみに焦点を当てた新鮮な目が必要

### 3. カスタムコマンドを作成

繰り返しのプロンプトは時間の無駄。カスタムスラッシュコマンドは `.claude/commands/` ディレクトリにmarkdownファイルとして保存。

**例:** `performance-optimization.md` を作成すると、どの会話でも `/performance-optimization` として利用可能。

**引数のサポート:**

- `$ARGUMENTS`
- 番号付きプレースホルダー `$1`, `$2`

#### performance-optimization.mdの例

```markdown
# Performance Optimization

Analyze the provided code for performance bottlenecks and optimization opportunities. Conduct a thorough review covering:

## Areas to Analyze

### Database & Data Access
- N+1 query problems and missing eager loading
- Lack of database indexes on frequently queried columns
- Inefficient joins or subqueries
- Missing pagination on large result sets
- Absence of query result caching
- Connection pooling issues

### Algorithm Efficiency
- Time complexity issues (O(n²) or worse when better exists)
- Nested loops that could be optimized
- Redundant calculations or repeated work
- Inefficient data structure choices
- Missing memoization or dynamic programming opportunities

### Memory Management
- Memory leaks or retained references
- Loading entire datasets when streaming is possible
- Excessive object instantiation in loops
- Large data structures kept in memory unnecessarily
- Missing garbage collection opportunities

### Async & Concurrency
- Blocking I/O operations that should be async
- Sequential operations that could run in parallel
- Missing Promise.all() or concurrent execution patterns
- Synchronous file operations
- Unoptimized worker thread usage

### Network & I/O
- Excessive API calls (missing request batching)
- No response caching strategy
- Large payloads without compression
- Missing CDN usage for static assets
- Lack of connection reuse

### Frontend Performance
- Render-blocking JavaScript or CSS
- Missing code splitting or lazy loading
- Unoptimized images or assets
- Excessive DOM manipulations or reflows
- Missing virtualization for long lists
- No debouncing/throttling on expensive operations

### Caching
- Missing HTTP caching headers
- No application-level caching layer
- Absence of memoization for pure functions
- Static assets without cache busting

## Output Format

For each issue identified:
1. **Issue**: Describe the performance problem
2. **Location**: Specify file/function/line numbers
3. **Impact**: Rate severity (Critical/High/Medium/Low) and explain expected performance degradation
4. **Current Complexity**: Include time/space complexity where applicable
5. **Recommendation**: Provide specific optimization strategy
6. **Code Example**: Show optimized version when possible
7. **Expected Improvement**: Quantify performance gains if measurable

If code is well-optimized:
- Confirm optimization status
- List performance best practices properly implemented
- Note any minor improvements possible

**Code to review:**
```

$ARGUMENTS

```
```

#### Claudeにカスタムコマンドを作成させる

```
Create a custom slash command called /performance-optimization that analyzes code for database query issues, algorithm efficiency, memory management, and caching opportunities.
```

Claudeは `.claude/commands/performance-optimization.md` にファイルを書き込み、コマンドはすぐに利用可能になる。

---

## ベストプラクティス

### シンプルに始め、意図的に拡張する

- 最初から包括的なCLAUDE.mdを作成しようとしない
- CLAUDE.mdは毎回Claudeのコンテキストに追加されるため、**簡潔に保つ**
- 情報を別々のmarkdownファイルに分割し、CLAUDE.mdファイル内から参照するのも一つの選択肢

### 含めてはいけないもの

特にバージョン管理にコミットする場合：

- 機密情報
- APIキー
- 認証情報
- データベース接続文字列
- 詳細なセキュリティ脆弱性情報

**理由:** CLAUDE.mdはClaudeのシステムプロンプトの一部になるため、公開共有される可能性のあるドキュメントとして扱うこと。

### 継続的な改善

カスタマイズは一度きりのセットアップタスクではなく、継続的な実践として扱う。

- プロジェクトは変化する
- チームはより良いパターンを学ぶ
- 新しいツールがワークフローに加わる

適切に維持されたCLAUDE.mdはコードベースとともに進化し、複雑なソフトウェアでのAI支援作業の摩擦を継続的に減らす。

---

## 重要なポイント

1. **CLAUDE.mdファイル**は、Claude Codeを汎用アシスタントからコードベース専用に設定されたツールに変える
2. 基本的なプロジェクト構造とビルドドキュメントから**シンプルに始める**
3. ワークフローの実際の摩擦点に基づいて**拡張する**
4. 最も効果的なCLAUDE.mdファイルは**実際の問題を解決する**:
   - 繰り返し入力するコマンドを文書化
   - 説明に10分かかるアーキテクチャコンテキストをキャプチャ
   - 手戻りを防ぐワークフローを確立
5. チームの実際のソフトウェア開発方法を反映する（理論的なベストプラクティスではなく）

---

## 関連リンク

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Building Effective MCP Servers](https://www.anthropic.com/engineering/building-effective-mcp-servers)
- [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Prompt Engineering Overview](https://www.anthropic.com/engineering/prompt-engineering-overview)
- [Claude Code Documentation](https://code.claude.com/docs/en/settings)
