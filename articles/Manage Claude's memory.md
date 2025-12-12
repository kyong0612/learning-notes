---
title: "Manage Claude's memory"
source: "https://code.claude.com/docs/en/memory"
author:
  - "[[Anthropic]]"
  - "[[Claude Code Docs]]"
published:
created: 2025-12-12
description: "Claude Codeのメモリ管理に関する包括的なガイド。セッション間でスタイルガイドラインやワークフローコマンドなどの設定を記憶させる方法、4種類のメモリロケーション（Enterprise policy、Project memory、User memory、Project rules）の使い分け、CLAUDE.mdファイルの設定方法、モジュール式ルールの構成などを解説。"
tags:
  - "Claude Code"
  - "AI"
  - "memory management"
  - "configuration"
  - "development tools"
  - "Anthropic"
---

## 概要

Claude Codeは、セッション間でユーザーの設定（スタイルガイドライン、一般的なワークフローコマンドなど）を記憶することができる。このドキュメントでは、Claude Codeのメモリ管理システムの全体像と具体的な設定方法を解説する。

---

## メモリタイプの決定

Claude Codeは階層構造を持つ4つのメモリロケーションを提供しており、それぞれ異なる目的を持つ。

| メモリタイプ | 場所 | 目的 | 使用例 | 共有範囲 |
|---|---|---|---|---|
| **Enterprise policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br>Linux: `/etc/claude-code/CLAUDE.md`<br>Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | IT/DevOpsが管理する組織全体の指示 | 会社のコーディング標準、セキュリティポリシー、コンプライアンス要件 | 組織内全ユーザー |
| **Project memory** | `./CLAUDE.md` または `./.claude/CLAUDE.md` | プロジェクト用のチーム共有指示 | プロジェクトアーキテクチャ、コーディング標準、共通ワークフロー | ソース管理経由でチームメンバー |
| **Project rules** | `./.claude/rules/*.md` | モジュール式のトピック別プロジェクト指示 | 言語固有のガイドライン、テスト規約、API標準 | ソース管理経由でチームメンバー |
| **User memory** | `~/.claude/CLAUDE.md` | 全プロジェクト向けの個人設定 | コードスタイル設定、個人ツールショートカット | 自分のみ（全プロジェクト） |
| **Project memory (local)** | `./CLAUDE.local.md` | プロジェクト固有の個人設定 | サンドボックスURL、テストデータ | 自分のみ（現在のプロジェクト） |

### 重要ポイント

- すべてのメモリファイルは、Claude Code起動時に自動的にコンテキストに読み込まれる
- 階層の上位にあるファイルが優先され、最初に読み込まれる
- `CLAUDE.local.md`ファイルは自動的に`.gitignore`に追加されるため、バージョン管理にチェックインすべきでない個人設定に最適

---

## CLAUDE.md インポート

CLAUDE.mdファイルは`@path/to/import`構文を使用して追加ファイルをインポートできる。

### 基本的なインポート例

```markdown
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

### 個人設定のインポート

```markdown
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

相対パスと絶対パスの両方が使用可能。ホームディレクトリ内のファイルをインポートすることで、チームメンバーがリポジトリにチェックインしない個人指示を提供できる。

### 注意事項

- コードスパンとコードブロック内ではインポートは評価されない
- インポートは最大5ホップまで再帰的に処理可能
- `/memory`コマンドで読み込まれたメモリファイルを確認できる

---

## Claude のメモリ検索方法

Claude Codeはメモリを再帰的に読み取る：

1. **上方向への検索**: 現在の作業ディレクトリから開始し、ルートディレクトリ（`/`は含まない）まで遡り、見つかった`CLAUDE.md`または`CLAUDE.local.md`を読み取る
2. **下方向への検索**: 現在の作業ディレクトリ配下のサブツリーにネストされた`CLAUDE.md`も検出（起動時ではなく、そのサブツリー内のファイルを読み取るときに含まれる）

### 例

`foo/bar/`でClaude Codeを実行した場合、`foo/CLAUDE.md`と`foo/bar/CLAUDE.md`の両方のメモリが読み込まれる。

---

## メモリの追加方法

### `#`ショートカットで素早くメモリを追加

入力を`#`文字で開始するのが最も速い方法：

```
# Always use descriptive variable names
```

メモリの保存先ファイルを選択するプロンプトが表示される。

### `/memory`コマンドで直接編集

セッション中に`/memory`スラッシュコマンドを使用すると、システムエディタでメモリファイルを開いて編集できる。

---

## プロジェクトメモリの設定

### 初期化

```bash
> /init
```

このコマンドでコードベース用の`CLAUDE.md`をブートストラップできる。

### プロジェクトメモリに含めるべき内容

- **頻繁に使用するコマンド**（ビルド、テスト、lint）- 繰り返しの検索を避けるため
- **コードスタイルの設定と命名規則**
- **プロジェクト固有の重要なアーキテクチャパターン**
- チームと共有する指示と個人設定の両方に使用可能

---

## モジュール式ルール（`.claude/rules/`）

大規模プロジェクト向けに、複数ファイルで指示を整理できる。

### 基本構造

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # メインプロジェクト指示
│   └── rules/
│       ├── code-style.md   # コードスタイルガイドライン
│       ├── testing.md      # テスト規約
│       └── security.md     # セキュリティ要件
```

`.claude/rules/`内のすべての`.md`ファイルは、`.claude/CLAUDE.md`と同じ優先度でプロジェクトメモリとして自動的に読み込まれる。

### パス固有のルール

YAMLフロントマターの`paths`フィールドを使用して、特定のファイルにルールをスコープできる。

```yaml
---
paths: src/api/**/*.ts
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

`paths`フィールドがないルールは無条件に読み込まれ、すべてのファイルに適用される。

### Globパターン

| パターン | マッチ対象 |
|---|---|
| `**/*.ts` | 任意のディレクトリ内のすべてのTypeScriptファイル |
| `src/**/*` | `src/`ディレクトリ配下のすべてのファイル |
| `*.md` | プロジェクトルートのMarkdownファイル |
| `src/components/*.tsx` | 特定ディレクトリ内のReactコンポーネント |

#### 複数パターンのマッチング

```yaml
---
paths: src/**/*.{ts,tsx}
---

# TypeScript/React Rules
```

```yaml
---
paths: {src,lib}/**/*.ts, tests/**/*.test.ts
---
```

### サブディレクトリによる整理

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

すべての`.md`ファイルは再帰的に検出される。

### シンボリックリンクのサポート

```bash
# 共有ルールディレクトリのシンボリックリンク
ln -s ~/shared-claude-rules .claude/rules/shared

# 個別ルールファイルのシンボリックリンク
ln -s ~/company-standards/security.md .claude/rules/security.md
```

シンボリックリンクは解決され、その内容は通常通り読み込まれる。循環シンボリックリンクは検出され、適切に処理される。

### ユーザーレベルルール

`~/.claude/rules/`に個人ルールを作成すると、すべてのプロジェクトに適用される：

```
~/.claude/rules/
├── preferences.md    # 個人のコーディング設定
└── workflows.md      # 好みのワークフロー
```

ユーザーレベルルールはプロジェクトルールより先に読み込まれるため、プロジェクトルールの方が優先度が高くなる。

---

## 組織レベルのメモリ管理

エンタープライズ組織は、すべてのユーザーに適用される中央管理された`CLAUDE.md`ファイルを展開できる。

### セットアップ手順

1. **Enterprise policy**ロケーションにエンタープライズメモリファイルを作成
2. 構成管理システム（MDM、Group Policy、Ansibleなど）を通じて展開し、すべての開発者マシンに一貫して配布

---

## メモリのベストプラクティス

| ベストプラクティス | 説明 |
|---|---|
| **具体的に記述する** | 「コードを適切にフォーマットする」よりも「2スペースインデントを使用する」の方が良い |
| **構造を使って整理する** | 個々のメモリを箇条書きでフォーマットし、関連するメモリを説明的なMarkdown見出しの下にグループ化する |
| **定期的に見直す** | プロジェクトの進化に合わせてメモリを更新し、Claudeが常に最新の情報とコンテキストを使用できるようにする |

### `.claude/rules/`のベストプラクティス

- **ルールを焦点を絞って保つ**: 各ファイルは1つのトピックをカバー（例: `testing.md`, `api-design.md`）
- **説明的なファイル名を使用**: ファイル名でルールの内容がわかるようにする
- **条件付きルールは控えめに使用**: ルールが本当に特定のファイルタイプに適用される場合のみ`paths`フロントマターを追加
- **サブディレクトリで整理**: 関連するルールをグループ化（例: `frontend/`, `backend/`）

---

## まとめ

Claude Codeのメモリシステムは、階層的で柔軟な構成を提供する：

1. **4つのメモリレベル**: Enterprise → Project → User → Project local の順で優先度が設定される
2. **インポート機能**: `@`構文で外部ファイルを参照可能
3. **モジュール式ルール**: `.claude/rules/`でトピック別に整理可能
4. **パス固有のルール**: 特定のファイルタイプにのみ適用されるルールを設定可能
5. **簡単な追加方法**: `#`ショートカットや`/memory`コマンドで素早く追加・編集可能
