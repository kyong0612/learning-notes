---
title: "Claude CodeにLSPツールが追加"
source: "https://blog.lai.so/claude-code-lsp/"
author:
  - "[[laiso]]"
published: 2025-12-20
created: 2025-12-22
description: "Claude Codeのバージョン2.0.74でLSP（Language Server Protocol）ツールが追加された。プラグインとしてLSPサーバーを設定することで、シンボル定義検索・参照検索・ホバー情報取得などが可能になり、巨大リポジトリの探索において精度向上とトークン削減効果が期待できる。"
tags:
  - "Claude Code"
  - "LSP"
  - "Language Server Protocol"
  - "AI Coding"
  - "TypeScript"
---

## 概要

Claude Code 2.0.74でLSP（Language Server Protocol）ツールが有効になった。これにより、コードベースに対してシンボルの定義検索、参照検索、ホバー情報の取得などのIDE的な操作が可能になる。

## 導入方法

### インストール方法

2つの方法がある：

1. **公式プラグイン経由**: `/plugin` コマンドから [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/) 経由でインストール
2. **カスタムプラグイン**: `.claude-plugin/plugin.json` にLSPサーバのコマンドを記述して自作プラグインとして起動

### 注意点

最新版2.0.74ではコネクション確立に失敗する場合があるため、安定版2.0.67をフィーチャーフラグ付きで起動する：

```bash
ENABLE_LSP_TOOL=1 npx @anthropic-ai/claude-code@stable
```

### 設定例（TypeScript）

```bash
# 事前インストール
npm install -g typescript-language-server typescript
```

`.claude-plugin/plugin.json` の設定例：

```json
{
  "name": "my-plugin",
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "extensionToLanguage": {
        ".ts": "typescript",
        ".tsx": "typescriptreact",
        ".js": "javascript",
        ".jsx": "javascriptreact",
        ".mts": "typescript",
        ".cts": "typescript",
        ".mjs": "javascript",
        ".cjs": "javascript"
      }
    }
  }
}
```

起動コマンド：

```bash
ENABLE_LSP_TOOL=1 npx @anthropic-ai/claude-code@stable --plugin-dir .
```

### 対応言語

[公式プラグインリポジトリ](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json) からメジャーな言語の設定を借用可能。動作確認済み：

- PHP（intelephense, phpactor）
- Go（gopls）
- Rust（rust-analyzer）
- Python（pyright）

## LSPツールの基本動作

### 特徴

- Claude Codeコアの「Readツール」「Searchツール」などと同列のMCPツールの１つ
- **現在は読み込み操作のみ**（Serenaのような書き込み系機能は未提供）
- Planモードの透過的な使用はないため、**明示的に「LSPで検索してください」とプロンプトで指示が必要**

### 制限事項

- `workspaceSymbol` では限定的な結果しか得られない場合がある
- 全シンボルのリストアップなどのタスクでは、自動的にGrepにフォールバックする

### 動作例

**シンボル検索の例**:

```
> BankAccountを参照しているコンポーネントを全て教えてください

⏺ LSP(operation: "findReferences", symbol: "BankAccount", in: "src/libs/models/BankAccount.ts")
  ⎿  Found 33 references across 10 files
```

**クラス内関数のリストアップ例**:

```
> BaseArrowKeyFocusManagerの関数をリストアップしてください。

⏺ LSP(operation: "documentSymbol", file: "src/components/ArrowKeyFocusManager.js")
  ⎿  Found 31 symbols
```

## 実践検証：巨大リポジトリでの効果

### 検証環境

- 題材: [Expensify/App](https://github.com/Expensify/App)（数十万行規模のReact Nativeアプリ）
- タスク: SWE-Lancerベンチマークの Manager タスク（コードを探索して最適な提案を選ぶ）

### 比較結果

| ケース | 消費トークン | レポート品質 | 実行時間 |
|--------|-------------|-------------|---------|
| **Grepケース** | 45,991 tokens | 標準 | 数十秒 |
| **LSPケース** | 39,150 tokens | より詳細 | 数十秒 |

### 主な発見

1. **トークン削減**: LSPケースで約15%のトークン削減
2. **レポート品質向上**: LSPケースではより詳細な分析レポートが生成された
3. **実行時間**: 両ケースで大差なし
4. **協調動作**: LSPで対応できない場合は自動的にGrepにフォールバック

## まとめ

### メリット

- 巨大なコードベース探索において**精度向上とトークン削減効果**がある
- 従来のGrep検索と比較して、結果の詳細さやレポート品質が向上
- 消費リソースも抑えられる

### 現状の制限

- **読み込み系機能のみ**（書き込み系は未実装）
- LSPツールが実行される条件がまだ明確でなく、控えめに設定されている
- workspaceSymbolなど制約がある場面では依然Grepにフォールバック

### 今後の期待

- アップデートによる機能拡充
- 書き込み系機能の追加

## 関連リンク

- [Claude Code CHANGELOG 2.0.74](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#2074)
- [Claude Code の LSP サポート（azukiazusaのブログ）](https://azukiazusa.dev/blog/claude-code-lsp-support/)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/)
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins)
- [Serena MCPはClaude Codeを救うのか？（関連記事）](https://blog.lai.so/serena/)
