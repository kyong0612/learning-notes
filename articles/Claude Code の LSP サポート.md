---
title: "Claude Code の LSP サポート"
source: "https://azukiazusa.dev/blog/claude-code-lsp-support/"
author:
  - "azukiazusa1"
published: 2025-12-20
created: 2025-12-22
description: "Claude Code v2.0.74 から追加された LSP（Language Server Protocol）サポートにより、シンボルの定義検索、参照検索、ホバー情報の取得などが可能に。プラグイン機能の一部として提供され、公式マーケットプレイスからインストールするか、自作プラグインで対応言語を追加できる。"
tags:
  - "AI"
  - "claude-code"
  - "LSP"
  - "coding-agent"
  - "developer-tools"
---

## 概要

Claude Code のバージョン 2.0.74 から LSP（Language Server Protocol）サポートが追加された。LSP を活用することで、コーディングエージェントは文字列によるコードベース全体の検索ではなく、コードの構造やシンボル情報に直接アクセスできるため、**トークンと時間を大きく節約**できる。

## LSP サポートで利用可能な操作

| コマンド | 機能 |
|---------|------|
| `goToDefinition` | シンボルが定義されている場所を検索 |
| `findReferences` | シンボルへのすべての参照を検索 |
| `hover` | シンボルのホバー情報（ドキュメント、型情報）を取得 |
| `documentSymbol` | ドキュメント内のすべてのシンボル（関数、クラス、変数）を取得 |
| `workspaceSymbol` | ワークスペース全体でシンボルを検索 |
| `goToImplementation` | インターフェースや抽象メソッドの実装を検索 |
| `prepareCallHierarchy` | 指定位置の呼び出し階層アイテム（関数/メソッド）を取得 |
| `incomingCalls` | 指定位置の関数を呼び出しているすべての関数/メソッドを検索 |
| `outgoingCalls` | 指定位置の関数が呼び出しているすべての関数/メソッドを検索 |

## LSP 機能の有効化手順

### 1. プラグインのインストール

1. Claude Code を起動し `/plugin` コマンドを実行
2. 「Marketplaces」タブで公式マーケットプレイス（claude-plugins-official）が有効化されていることを確認
3. 「Discover」タブで「LSP」を検索
4. 利用したい言語の LSP プラグインを `Space` キーで選択し、`i` キーでインストール

### 2. サポートされている言語

- C/C++
- C#
- Go
- Java
- Lua
- PHP
- Python
- Rust
- Swift

### 3. LSP サーバーのインストール

対応する言語の LSP サーバーを別途インストールする必要がある。例えば TypeScript の場合：

```bash
npm install -g typescript-language-server typescript
```

## 自作 LSP プラグインの作成

公式マーケットプレイスでサポートされていない言語を使用する場合、自作プラグインを作成できる。

### ディレクトリ構成

```text
my-lsp-plugin/
├── .claude-plugin/
│   └── plugin.json
└── .lsp.json
```

### plugin.json の例

```json
{
  "name": "my-typescript-lsp-plugin",
  "description": "TypeScript/JavaScript language server for Claude Code",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

### .lsp.json の例（TypeScript）

```json
{
  "typescript": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript",
      ".tsx": "typescript"
    }
  }
}
```

### テスト方法

```bash
claude --plugin-dir ./my-lsp-plugin
```

## ⚠️ 現在の制限事項

1. **TypeScript LSP プラグインの問題**: 現時点では正しく動作しない。LSP サーバーのプラグインには `.lsp.json` 設定ファイルが必要だが、README.md しか提供されていない。

2. **v2.0.74 での競合問題**: プラグインと LSP サーバーの競合が発生する（[Issue #13952](https://github.com/anthropics/claude-code/issues/13952)）

### 回避策

v2.0.67 に戻し、環境変数 `ENABLE_LSP_TOOL` を設定して起動：

```bash
ENABLE_LSP_TOOL=true npx @anthropic-ai/[email protected] --plugin-dir ./my-lsp-plugin
```

## まとめ

- Claude Code v2.0.74 から LSP サポートが追加
- 公式マーケットプレイスから対応言語の LSP プラグインをインストールして有効化
- 自作プラグインで未対応言語にも対応可能
- 現在 v2.0.74 では競合問題があり、v2.0.67 + 環境変数設定で回避可能

## 参考リンク

- [Plugins reference - LSP servers](https://code.claude.com/docs/en/plugins-reference#lsp-servers)
- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [claude-code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Issue #13952 - LSP servers not loading due to race condition](https://github.com/anthropics/claude-code/issues/13952)
- [Serena - セマンティックコード検索・編集ツール](https://github.com/oraios/serena)
