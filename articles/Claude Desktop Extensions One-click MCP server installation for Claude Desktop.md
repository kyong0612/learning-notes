---
title: "Claude Desktop Extensions: One-click MCP server installation for Claude Desktop"
source: "https://www.anthropic.com/engineering/desktop-extensions"
author:
  - "[[@AnthropicAI]]"
published: 2025-06-26
created: 2025-06-28
description: |
  Desktop Extensionsは、MCPサーバーのインストールをワンクリックで可能にする新しいパッケージ形式です。この記事では、その技術的アーキテクチャと、優れた拡張機能を作成するためのヒントを共有します。
tags:
  - "clippings"
  - "Claude"
  - "MCP"
  - "Desktop Extensions"
  - "AI Agent"
---

## 概要

Claude Desktop Extensionsは、これまで開発者ツールや手動設定が必要だったModel Context Protocol (MCP) サーバーのインストールを、`.dxt`という新しいパッケージ形式によりワンクリックで可能にするものです。これにより、ファイルシステムやデータベースへのアクセスなど、強力なローカル機能を非技術者でも簡単に利用できるようになります。

## アーキテクチャ

Desktop Extension (`.dxt`ファイル) は、以下の要素を含むZIPアーカイブです。

* `manifest.json`: 拡張機能のメタデータ、設定、機能（ツールやプロンプト）、ユーザー設定、ランタイム要件を記述します。
* `server/`: MCPサーバーの実装本体。
* `dependencies/`: 必要なすべてのパッケージやライブラリ。
* `icon.png` (オプション): 拡張機能のアイコン。

Claude DesktopはNode.jsランタイムを内蔵しており、自動更新やOSキーチェーンを利用した安全なシークレット管理機能も提供します。

### `manifest.json` の設定例

`manifest.json`では、ユーザー設定（APIキーなど）を定義でき、Claude DesktopがUIを表示して安全に値を管理し、サーバー起動時に環境変数として渡すことができます。`${__dirname}`（拡張機能のディレクトリパス）や`${user_config.api_key}`（ユーザー設定値）のようなテンプレートリテラルも利用可能です。

```json
{
  "dxt_version": "0.1",
  "name": "my-extension",
  "version": "1.0.0",
  "description": "A simple MCP extension",
  "author": { "name": "Extension Author" },
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"],
      "env": {
        "API_KEY": "${user_config.api_key}"
      }
    }
  },
  "user_config": {
    "api_key": {
      "type": "string",
      "title": "API Key",
      "description": "Your API key for authentication",
      "sensitive": true,
      "required": true
    }
  }
}
```

完全な仕様は[dxtリポジトリ](https://github.com/anthropics/dxt/blob/main/MANIFEST.md)で公開されています。

## 拡張機能の構築手順

1. **`manifest.json`の初期化**:

    ```bash
    npx @anthropic-ai/dxt init
    ```

2. **ユーザー設定の定義**: `manifest.json`の`user_config`セクションで、APIキーやアクセス許可ディレクトリなどを定義します。
3. **パッケージ化**:

    ```bash
    npx @anthropic-ai/dxt pack
    ```

4. **ローカルテスト**: 生成された`.dxt`ファイルをClaude Desktopにドラッグ＆ドロップしてインストールをテストします。

## 高度な機能

* **クロスプラットフォーム対応**: `manifest.json`内でOSごとに異なる設定を定義できます。
* **動的設定**: `${__dirname}`や`${user_config.key}`などのテンプレートリテラルを利用できます。
* **機能宣言**: `tools`や`prompts`フィールドで、拡張機能が提供する機能を明示的に示すことができます。

## エコシステムとセキュリティ

* **拡張機能ディレクトリ**: Claude Desktop内にキュレーションされたディレクトリが用意され、ユーザーは安全に拡張機能を見つけてインストールできます。
* **オープンな仕様**: DXTの仕様、ツールチェーン、スキーマはオープンソース化されており、他のAIデスクトップアプリケーションでも採用可能です。
* **セキュリティとエンタープライズ対応**:
  * 機密データはOSキーチェーンに保存されます。
  * 企業向けに、Group Policy (Windows) や MDM (macOS) を通じた拡張機能の管理（許可リスト/ブロックリスト、プライベートディレクトリの展開など）がサポートされます。

## Claude Codeでの構築

Claude Codeを使用して拡張機能を開発する際は、特定のプロンプトコンテキストを提供することで、仕様に準拠した高品質なコードを効率的に生成できます。

## 結論

Desktop Extensionsは、ローカルAIツールのアクセシビリティを向上させ、MCPサーバーの持つ強力な機能をすべてのユーザーに解放するものです。Anthropicは、この技術がモデルの能力をユーザーのローカル環境にあるツール、データ、アプリケーションと結びつける無数の機会を創出すると信じています。

![PyBoy MCP with Super Mario Land](https://www-cdn.anthropic.com/images/4zrzovbb/website/d48f3ea1218a4b90450b9ab8134fa0e24db5a167-720x542.png)
