---
title: "AI とインタラクティブな UI のやり取りを実現する MCP Apps"
source: "https://azukiazusa.dev/blog/ai-interactive-ui-with-mcp-apps/"
author:
  - "[[azukiazusaのテックブログ2]]"
published: 2026-01-27
created: 2026-02-03
description: "MCP Apps は MCP にインタラクティブな UI コンポーネントを返す方法を標準化した拡張機能です。この記事では MCP Apps を使用してインタラクティブな UI コンポーネントをエージェントが返す方法について試してみます。"
tags:
  - "clippings"
  - "MCP"
  - "AI"
  - "UI"
  - "TypeScript"
  - "Claude"
---

## 概要

MCP Apps は Model Context Protocol (MCP) にインタラクティブな UI コンポーネントを返す方法を**標準化した拡張機能**。AI エージェントがチャット形式のテキストだけでなく、グラフ、チャート、商品カードなどのインタラクティブな UI を返せるようになる。

## 背景と課題

### 従来のアプローチ

- **[Apps in ChatGPT](https://developers.openai.com/apps-sdk/)**: OpenAI の Apps SDK
- **[MCP-UI](https://mcpui.dev/)**: MCP ベースの UI 拡張

これらは MCP を基盤としているが、**それぞれが独自に MCP を拡張**しているため、異なるプラットフォーム間で互換性がなく、同じ UI コンポーネントを複数のエージェントで共有することが困難だった。

### MCP Apps による解決

MCP Apps は UI コンポーネントを返す方法を**標準化**し、ホストがサンドボックス化された iframe 内で UI をレンダリングできるようにした。

### 対応プラットフォーム（2026年1月時点）

- **Claude**（Pro プラン以上）
- **[Goose](https://block.github.io/goose/docs/tutorials/building-mcp-apps/)**
- **[VSCode Insiders](https://code.visualstudio.com/insiders/)**
- **ChatGPT**（近日対応予定）

## MCP Apps の仕組み

### アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ホスト (Claude等)  │◄──│   MCP サーバー   │◄──│  UI コンポーネント  │
│   ・ツール呼び出し    │    │   ・ツール実装     │    │  ・HTML/CSS/JS    │
│   ・UI レンダリング   │    │   ・リソース登録    │    │  ・postMessage通信 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### サーバー側の実装ポイント

1. **UI コンポーネントをリソースとして登録**
   - URI スキーム: `ui://`
   - HTML, CSS, JavaScript を含む単一 HTML ファイル

2. **ツールのメタ情報で UI を指定**
   - `_meta.ui.resourceUri` に UI コンポーネントのリソース URI を設定

3. **必要なパッケージ**
   - `@modelcontextprotocol/ext-apps`: MCP Apps SDK
   - `@modelcontextprotocol/sdk`: MCP 標準 SDK

### クライアント側の実装ポイント

1. **単一 HTML ファイルへのビルド**
   - `vite-plugin-singlefile` を使用

2. **ホストとの通信**
   - `postMessage` API 経由（SDK の `McpApp` クラスでラップ）
   - `app.callServerTool()`: サーバーのツール呼び出し
   - `tool-result` イベント: ツール結果の受信
   - `context-update` イベント: スタイル変数の取得

## CSS テーマ変数

MCP Apps ではホスト環境と視覚的な一貫性を保つための**標準化された CSS カスタムプロパティ**をサポート。

| カテゴリ | 説明 |
|---------|------|
| カラー | 背景色、テキスト色、アクセントカラーなど |
| タイポグラフィ | フォントファミリー、サイズ |
| スペーシング | 余白、パディング |
| ボーダー | 角丸、ボーダー幅 |

**注意**: スタイルの提供はオプショナルのため、フォールバック値の設定が必要。

```css
/* 例: フォールバック値付きの使用 */
background-color: var(--mcp-background, light-dark(#fff, #333));
```

## 開発・デバッグ

### MCP Inspector で確認

1. [MCP Inspector](http://localhost:6277) にアクセス
2. Transport Type: "Streamable HTTP"
3. URL: `http://localhost:3000/mcp`
4. Resources タブ: UI コンポーネントの登録確認
5. Tools タブ: `_meta.ui.resourceUri` の確認

### Claude での動作確認

1. **ローカルサーバーを公開**: `cloudflared tunnel --url http://localhost:3000`
2. **Claude Connectors 設定**: Custom Connector として MCP Server URL を追加
3. **チャットで確認**: プロンプトを送信し、UI コンポーネントがレンダリングされることを確認

## まとめ

| 項目 | 内容 |
|------|------|
| **MCP Apps とは** | MCP にインタラクティブ UI を返す方法を標準化した拡張機能 |
| **サーバー側** | UI をリソースとして登録、ツールのメタ情報で `_meta.ui.resourceUri` を指定 |
| **クライアント側** | ホストのツール結果を受け取り、UI をレンダリング。MCP プロトコルでサーバーツール呼び出しも可能 |
| **レンダリング** | ホストがサンドボックス化された iframe 内で UI をレンダリング |

## 参考リンク

- [SEP-1865: MCP Apps 仕様](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx#theming)
- [MCP Apps 公式ブログ記事](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [ext-apps GitHub リポジトリ](https://github.com/modelcontextprotocol/ext-apps)
- [MCP Apps Quickstart](https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html)
- [MCP Apps 公式ドキュメント](https://modelcontextprotocol.io/docs/extensions/apps)
