---
title: "Claude Code の設定をプラグインで共有する"
source: "https://azukiazusa.dev/blog/claude-code-plugins/"
author:
  - "azukiazusa"
published: 2025-10-10
created: 2025-10-11
description: "Claude Code は強力なコーディング支援ツールですが、効果的に活用するためには適切な設定が必要です。プラグインを使用することで、スラッシュコマンド、サブエージェント、MCP サーバー、フックなどの設定をパッケージ化し、他のユーザーと簡単に共有できます。この記事では、Claude Code のプラグインの作成方法と利用方法について解説します。"
tags:
  - "claude-code"
  - "プラグイン"
  - "マーケットプレイス"
  - "AIコーディング支援"
  - "開発ツール"
---

## 概要

Claude Code のプラグイン機能を使うことで、スラッシュコマンド、サブエージェント、MCP サーバー、フックなどの設定をパッケージ化し、組織やコミュニティ内で簡単に共有できます。マーケットプレイスという仕組みを通じてプラグインの配布・管理が行われ、GitHub 上でホストされることが想定されています。

## プラグインで共有できる設定

Claude Code では以下の4つの設定をプラグインとして共有できます:

- **スラッシュコマンド**: よく使う操作を登録し、素早くアクセス可能にする
- **サブエージェント**: 特定のタスクに特化したエージェントを作成し、複雑なタスクを分割処理
- **MCP サーバー**: 外部ツールと連携して Claude Code の機能を拡張
- **フック**: 特定のイベントに応じて自動実行される処理を設定

### 実際の活用例

筆者が使用している設定例:

- `/article-review`: 誤字脱字や文法誤りをチェックする記事レビューコマンド
- serena MCP サーバー: LSP を利用したシンボルベースのコード検索・編集ツール
- コード編集時のフック: 編集のたびに `prettier` を自動実行してフォーマット

## プラグインの作成手順

### 1. ディレクトリ構造の作成

```
└── my-marketplace
    ├── .claude-plugin
    │   ├── marketplace.json
    │   └── plugin.json
    └── my-plugin
        └── commands
            └── hello.md
```

### 2. プラグインマニフェストの作成

`.claude-plugin/plugin.json` にプラグインのメタデータを定義:

```json
{
  "name": "my-plugin",
  "description": "A simple plugin that adds a hello command",
  "version": "0.0.1",
  "author": {
    "name": "Your Name",
    "email": "[email protected]"
  }
}
```

### 3. スラッシュコマンドの追加

`/commands` ディレクトリ配下に `<コマンド名>.md` としてマークダウンファイルを作成:

```markdown
---
description: "ユーザーに愉快な挨拶を返す"
---

# hello コマンド

ユーザーに関西弁で愉快な挨拶をしてください。
```

### 4. マーケットプレイスマニフェストの作成

`.claude-plugin/marketplace.json` にマーケットプレイス情報を定義:

```json
{
  "name": "my-marketplace",
  "metadata": {
    "description": "test marketplace",
    "version": "0.0.1"
  },
  "owner": {
    "name": "Your Name",
    "email": "[email protected]"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "A simple plugin that adds a hello command"
    }
  ]
}
```

### 5. バリデーション

`claude plugin validate` コマンドで形式を検証:

```bash
claude plugin validate ./my-marketplace
```

## プラグインのインストール方法

### ローカルマーケットプレイスの追加

```bash
/plugin marketplace add ./my-marketplace
```

### プラグインのインストール

```bash
/plugin install my-plugin@my-marketplace
```

コマンド実行後、プラグインの説明が表示され、「Install now」をクリックしてインストールを完了します。

### GitHub からのインストール

GitHub でホストされているマーケットプレイスからもインストール可能:

```bash
/plugin marketplace add https://github.com/davila7/claude-code-templates
```

## プラグインの管理

インストール済みプラグインは `/plugin` コマンドから管理できます:

1. 「Manage & uninstall plugins」を選択
2. マーケットプレイスとプラグインを選択
3. 有効/無効の切り替え、アンインストール、更新が可能

## コミュニティリソース

### 公開されているマーケットプレイス

- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates): CLI ツールとテンプレート集
- [wshobson/agents](https://github.com/wshobson/agents): 本番環境対応のサブエージェント集

### プラグインの検索

[https://www.aitmpl.com/plugin](https://www.aitmpl.com/plugin) でインタラクティブな Web UI を通じてプラグインを検索・探索できます。

## 主要なポイント

1. **パッケージ化**: スラッシュコマンド、サブエージェント、MCP サーバー、フックなどの設定を1つのプラグインにまとめられる
2. **マーケットプレイス**: JSON ファイルベースの配布・管理システムで、GitHub でのホストを想定
3. **簡単な共有**: 組織やコミュニティで最適化された設定を簡単に共有・利用可能
4. **柔軟な管理**: インストール後も有効/無効の切り替えやアンインストールが容易
5. **バリデーション**: `claude plugin validate` コマンドで形式の正確性を事前確認

## 参考リンク

- [Customize Claude Code with plugins - Anthropic](https://www.anthropic.com/news/claude-code-plugins)
- [Plugins reference - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin-reference)
- [Plugins - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin)
- [Plugin marketplaces - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
