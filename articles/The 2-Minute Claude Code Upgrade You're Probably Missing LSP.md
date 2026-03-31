---
title: "The 2-Minute Claude Code Upgrade You're Probably Missing: LSP"
source: "https://karanbansal.in/blog/claude-code-lsp/"
author:
  - "[[Karan Bansal]]"
published: 2026-02-28
created: 2026-03-31
description: "Every Claude Code user is running without LSP. That means 30-60s grep searches instead of 50ms precise answers. Here's how to enable it — setup, real debug data, and undocumented discoveries."
tags:
  - "clippings"
  - "Claude Code"
  - "LSP"
  - "AI"
  - "Developer Tools"
  - "Programming"
  - "Productivity"
---

## 概要

Claude Codeはデフォルトではテキスト検索（Grep/Glob/Read）でコードベースをナビゲートしており、定義の検索に30〜60秒かかる。LSP（Language Server Protocol）を有効化すると、同じクエリが**50ミリ秒**で100%正確に返ってくる。約900倍の高速化であり、コードナビゲーションの質が根本的に変わる。セットアップは約2分で完了するが、`ENABLE_LSP_TOOL`フラグは公式ドキュメントに記載されておらず、GitHubのIssueから発見されたものである。

## 主要なトピック

### 現状の問題点：テキスト検索の限界

- Claude Codeはデフォルトで`Grep`、`Glob`、`Read`ツールを使用してコードベースをナビゲート
- **grepはコードをテキストとして扱う**が、コードは構造・意味・関係性を持つ
- 例：`User`を検索すると847件のマッチが203ファイルに散在（クラス定義、変数名、コメント、import、CSSクラス、SQLカラムなど）
- 本当に欲しい結果は大量のノイズの中に埋もれ、Claude Codeは各マッチを読み通す必要がある

### LSPとは何か

- **2016年にMicrosoftが考案**したプロトコル
- エディタの言語サポートを言語サーバーから分離する標準化されたプロトコル
- JSON-RPCベースの通信で、任意のエディタが任意の言語サーバーと対話可能
- M×N問題（M個のエディタ × N個の言語 = M×N個のプラグイン）を**M+N問題**に変換
- VS CodeでもNeovimでもPyrightを通じて同じPython体験が得られる理由

### パフォーマンスの差

| 方式 | クエリ時間 | 正確性 |
|------|----------|--------|
| Grep（テキスト検索） | 30〜60秒 | 不確実 |
| LSP | **〜50ms** | **100%** |

- 約**900倍**の高速化
- 漸進的改善ではなく、カテゴリーレベルの変化

### LSPがClaude Codeに与える能力

#### パッシブ（自動修正）

最も価値のある機能。ファイル編集後にLSPが自動的にdiagnosticsを返す：

1. ユーザーが「`createUser()`にemailパラメータを追加して」と依頼
2. Claude Codeが関数シグネチャを編集
3. LSPが3つのコールサイトのエラーを即座に検出
4. Claude Codeが同一ターン内で3箇所すべてを修正
5. **エラー0件**で結果が返る

→ LSPなしでは、編集→コンパイルエラー→ペースト→再修正の手動イテレーションが必要

#### アクティブ（オンデマンドコード知能）

| 操作 | 用途 |
|------|------|
| `goToDefinition` | シンボルの定義箇所へジャンプ |
| `findReferences` | すべての使用箇所を検索 |
| `hover` | 型情報とドキュメントを表示 |
| `documentSymbol` | ファイル内のすべてのシンボル一覧 |
| `workspaceSymbol` | プロジェクト全体でシンボル検索 |
| `goToImplementation` | インターフェースの具体的な実装を検索 |
| `incomingCalls` / `outgoingCalls` | コール階層の追跡 |

自然言語で質問するだけで、Claude Codeが適切なLSP操作に自動ルーティングする。

### セットアップ手順（約2分）

#### 前提条件

- Claude Code バージョン 2.0.74 以降
- 対象言語の言語サーバーバイナリが`$PATH`に存在すること

#### Step 1: LSPツールの有効化

`~/.claude/settings.json` に以下を追加：

```json
{
  "env": {
    "ENABLE_LSP_TOOL": "1"
  }
}
```

> **注意**: `ENABLE_LSP_TOOL`は2026年2月時点で公式ドキュメントに未記載。[GitHub Issue #15619](https://github.com/anthropics/claude-code/issues/15619)で発見されたコミュニティ回避策。シェルプロファイル（`~/.zshrc`）にも`export ENABLE_LSP_TOOL=1`を追加しておくことが推奨される。

#### Step 2: 言語サーバーのインストール

| 言語 | プラグイン | インストールコマンド |
|------|----------|-------------------|
| Python | `pyright-lsp` | `npm i -g pyright` |
| TypeScript/JS | `typescript-lsp` | `npm i -g typescript-language-server typescript` |
| Go | `gopls-lsp` | `go install golang.org/x/tools/gopls@latest` |
| Rust | `rust-analyzer-lsp` | `rustup component add rust-analyzer` |
| Java | `jdtls-lsp` | `brew install jdtls` |
| C/C++ | `clangd-lsp` | `brew install llvm` |
| C# | `csharp-lsp` | `dotnet tool install -g csharp-ls` |
| PHP | `php-lsp` | `npm i -g intelephense` |
| Kotlin | `kotlin-lsp` | GitHub releases |
| Swift | `swift-lsp` | Xcode同梱 |
| Lua | `lua-lsp` | GitHub releases |

#### Step 3: プラグインのインストールと有効化

```bash
# マーケットプレイスカタログの更新
claude plugin marketplace update claude-plugins-official

# プラグインのインストール（例: Python）
claude plugin install pyright-lsp

# インストール確認
claude plugin list
```

**最も多い落とし穴**: プラグインが`installed`だが`disabled`の状態。`~/.claude/settings.json`で明示的に有効化する：

```json
{
  "env": {
    "ENABLE_LSP_TOOL": "1"
  },
  "enabledPlugins": {
    "pyright-lsp@claude-plugins-official": true,
    "typescript-lsp@claude-plugins-official": true,
    "gopls-lsp@claude-plugins-official": true
  }
}
```

#### Step 4: Claude Codeの再起動

LSPサーバーは起動時に初期化されるため、再起動が必要。

### 起動時の挙動

著者のデバッグログから（4つの言語サーバー有効時）：

```
05:53:56.216  [LSP MANAGER] Starting async initialization
05:53:56.573  Total LSP servers loaded: 4
05:53:56.757  gopls initialized          (+0.5s)
05:53:56.762  typescript initialized     (+0.5s)
05:53:56.819  pyright initialized        (+0.6s)
05:54:04.791  jdtls initialized          (+8.6s)
```

- 全LSPサーバーが**同時に起動**し、ファイルを開く前にインデックス構築を開始
- Javaサーバー（jdtls）はJVMウォームアップで約8.6秒かかるが正常
- 起動完了後はプロジェクト全体のシンボルが即座に利用可能

### Claude CodeにLSPを優先させる方法

LSPをセットアップしても、Claude Codeが従来のGrep/Read/Globにフォールバックすることがある。以下のスニペットを`~/.claude/CLAUDE.md`に追加することで優先利用を指示できる：

```markdown
### Code Intelligence

Prefer LSP over Grep/Glob/Read for code navigation:
- `goToDefinition` / `goToImplementation` to jump to source
- `findReferences` to see all usages across the codebase
- `workspaceSymbol` to find where something is defined
- `documentSymbol` to list all symbols in a file
- `hover` for type info without reading the file
- `incomingCalls` / `outgoingCalls` for call hierarchy

Before renaming or changing a function signature, use
`findReferences` to find all call sites first.

Use Grep/Glob only for text/pattern searches (comments,
strings, config values) where LSP doesn't help.

After writing or editing code, check LSP diagnostics before
moving on. Fix any type errors or missing imports immediately.
```

## 重要な事実・データ

- **パフォーマンス**: Grepの30〜60秒 → LSPの50ms（約900倍の高速化）
- **正確性**: 100%（Grepはノイズが多く不正確）
- **バージョン要件**: Claude Code 2.0.74以降
- **フラグ発見経緯**: 公式ドキュメントではなく[GitHub Issue #15619](https://github.com/anthropics/claude-code/issues/15619)から
- **サポート言語**: Python, TypeScript/JS, Go, Rust, Java, C/C++, C#, PHP, Kotlin, Swift, Lua（11言語）
- **LSP起動時間**: Go/TS/Pyright: 約0.5〜0.6秒、Java: 約8.6秒（JVMウォームアップ）
- **診断確認**: `Ctrl+O`でLSPサーバーからのdiagnosticsをリアルタイム表示可能

## 結論・示唆

### 著者の結論

LSPなしのClaude Codeセッションは、すべての「定義を見つけて」が30〜60秒かかり、リファクタリングではコールサイトを見落とし、LSPが即座に検出・修正できるエラーが見逃される。セットアップは2分、設定フラグは1行。テキスト検索とセマンティックコード知能の差は、NotepadとIDEの差と同じであり、AIアシスタントのコード理解能力を根本的に向上させる。

### 実践的な示唆

- LSPを有効にすることで、Claude Codeがコードの**構造的理解**に基づいてナビゲートできるようになる
- リファクタリング時に`findReferences`を使えば、Grepで見落とす可能性のあるコールサイトを100%発見できる
- パッシブdiagnosticsにより、編集後のエラーが手動イテレーション不要で自動修正される
- `CLAUDE.md`へのLSP優先指示の追加が、実際の利用率向上に重要

## 制限事項・注意点

- `ENABLE_LSP_TOOL`は**2026年2月時点で公式ドキュメントに未記載**のフラグであり、将来変更・不要になる可能性がある
- プラグインが`installed`でも`disabled`状態だとLSPサーバーが起動しない（最も多いトラブル原因）
- Javaの言語サーバー（jdtls）はJVMウォームアップにより起動に約8.6秒かかる
- セットアップ後もClaude CodeがGrep/Read/Globにフォールバックすることがあり、`CLAUDE.md`での明示的指示が推奨される
- LSPサーバーは起動時にプロジェクト全体をインデックスするため、非常に大規模なプロジェクトではメモリ使用量に注意が必要

---

*Source: [The 2-Minute Claude Code Upgrade You're Probably Missing: LSP](https://karanbansal.in/blog/claude-code-lsp/)*