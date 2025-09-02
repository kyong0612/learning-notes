---
title: "idosal/mcp-ui: SDK for UI over MCP. Create next-gen UI experiences!"
source: "https://github.com/idosal/mcp-ui"
author:
  - "[[Ido Salomon]]"
  - "[[Liad Yosef]]"
published: 2025-08-22
created: 2025-09-02
description: |
  `mcp-ui` は、Model Context Protocol (MCP) にインタラクティブなWebコンポーネントをもたらすSDKです。リッチで動的なUIリソースをMCPサーバーから直接クライアントに配信し、レンダリングすることができます。これにより、AIとの対話を次のレベルに引き上げます。
tags:
  - "mcp"
  - "ui"
  - "sdk"
  - "ai"
  - "frontend"
  - "llm"
---

[![image](https://private-user-images.githubusercontent.com/18148989/462652555-65b9698f-990f-4846-9b2d-88de91d53d4d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY4MjE3MTUsIm5iZiI6MTc1NjgyMTQxNSwicGF0aCI6Ii8xODE0ODk4OS80NjI2NTI1NTUtNjViOTY5OGYtOTkwZi00ODQ2LTliMmQtODhkZTkxZDUzZDRkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTAyVDEzNTY1NVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQ1NmFmZDJmYjIyZDg5ZDhhNDIzODc1YjYwOTI4ODY1NTg2Y2U0ZGY1NmVlZjc4ZTQ0ODMzYzc4NGNlNTBmNGQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.bXtVnu9kLDGNJ1Zf39c-auqPCBkVx_8hV65ZEZKvg6o)](https://private-user-images.githubusercontent.com/18148989/462652555-65b9698f-990f-4846-9b2d-88de91d53d4d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY4MjE3MTUsIm5iZiI6MTc1NjgyMTQxNSwicGF0aCI6Ii8xODE0ODk4OS80NjI2NTI1NTUtNjViOTY5OGYtOTkwZi00ODQ2LTliMmQtODhkZTkxZDUzZDRkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA5MDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwOTAyVDEzNTY1NVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQ1NmFmZDJmYjIyZDg5ZDhhNDIzODc1YjYwOTI4ODY1NTg2Y2U0ZGY1NmVlZjc4ZTQ0ODMzYzc4NGNlNTBmNGQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.bXtVnu9kLDGNJ1Zf39c-auqPCBkVx_8hV65ZEZKvg6o)

[![Server Version](https://camo.githubusercontent.com/bec0e35c4af6cd044ec2bc29be26177aba43f59c96826c45677c6c2bf3a9c1d5/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f406d63702d75692f7365727665723f6c6162656c3d73657276657226636f6c6f723d677265656e)](https://www.npmjs.com/package/%40mcp-ui/server)
[![Client Version](https://camo.githubusercontent.com/2db53c5ba4c3a4aa2f4bc29fda8b3078791a86936c35dbdada1f744970483e0b/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f406d63702d75692f636c69656e743f6c6162656c3d636c69656e7426636f6c6f723d626c7565)](https://www.npmjs.com/package/%40mcp-ui/client)
[![Ruby Server SDK Version](https://camo.githubusercontent.com/10f516513bf3194dc306b8ff2d0938b66cb0b1fa574d7841f857f9f8ff796222/68747470733a2f2f696d672e736869656c64732e696f2f67656d2f762f6d63705f75695f736572766572)](https://rubygems.org/gems/mcp_ui_server)
[![Discord](https://camo.githubusercontent.com/6750722289f4250454dedbee31d484f618e2775caedb19767e94f2b64fc8937b/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3134303131393531343030NDM2OTgzODc5P2xvZ289ZGlzY29yZCZsYWJlbD1kaXNjb3Jk)](https://discord.gg/CEAG4KW7ZH)
[![MCP Documentation](https://camo.githubusercontent.com/224766b33dfb24424336563c5607125a7f6a56e2f9c7b26e408baa594e85bc1f/68747470733a2f2f696d672e736869656c64732e696f2f656e64706f696e743f75726c3d68747470733a2f2f6769746d63702e696f2f62616467652f69646f73616c2f6d63702d7569)](https://gitmcp.io/idosal/mcp-ui)

---

> このプロジェクトは、MCP UIのアイデアを実現するための実験的なコミュニティの遊び場です。迅速なイテレーションと機能強化が期待されます！

<video src="https://github.com/user-attachments/assets/7180c822-2dd9-4f38-9d3e-b67679509483" controls></video>

## `mcp-ui` とは？

`mcp-ui` は、以下のSDKから構成されるコレクションです。

* `@mcp-ui/server` (TypeScript): MCPサーバー上でUIリソース (`UIResource`) を生成するためのユーティリティ。
* `@mcp-ui/client` (TypeScript): UIリソースをレンダリングし、そのイベントを処理するためのUIコンポーネント (例: `<UIResourceRenderer />`)。
* `mcp_ui_server` (Ruby): Ruby環境でMCPサーバー上でUIリソースを生成するためのユーティリティ。

これらを組み合わせることで、サーバーサイドで再利用可能なUIスニペットを定義し、クライアントでシームレスかつ安全にレンダリングし、MCPホスト環境でそのアクションに反応することができます。

## コアコンセプト

`mcp-ui` SDKを使用することで、サーバーとホストは、インタラクティブなUIスニペットを作成・レンダリングするための規約に合意できます。

### UIリソース

サーバーからクライアントに返される主要なペイロードは `UIResource` です。

```typescript
interface UIResource {
  type: 'resource';
  resource: {
    uri: string;       // 例: ui://component/id
    mimeType: 'text/html' | 'text/uri-list' | 'application/vnd.mcp-ui.remote-dom'; // HTMLコンテンツ、URLコンテンツ、remote-domコンテンツ用
    text?: string;      // インラインHTML、外部リンク、またはremote-domスクリプト
    blob?: string;      // Base64エンコードされたHTML、URL、またはremote-domスクリプト
  };
}
```

* **`uri`**: キャッシュとルーティングのための一意の識別子。
* **`mimeType`**: コンテンツの種類を定義します (`text/html`, `text/uri-list`, `application/vnd.mcp-ui.remote-dom`)。
* **`text` vs `blob`**: シンプルな文字列には`text`、大きなコンテンツやエンコードされたコンテンツには`blob`を使用します。

### リソースレンダラー

UIリソースは `<UIResourceRenderer />` コンポーネントでレンダリングされます。ReactコンポーネントとWebコンポーネントとして利用可能です。`onUIAction` コールバックを介してUIからのアクションを処理できます。

### サポートされるリソースタイプ

#### HTML (`text/html` と `text/uri-list`)

`<iframe>`内でコンテンツを表示します。自己完結型のHTMLや外部リンクの埋め込みに適しています。

#### Remote DOM (`application/vnd.mcp-ui.remote-dom`)

Shopifyの `remote-dom` を利用します。サーバーはUIとイベントを記述したスクリプトを返し、ホストはそれをサンドボックス化されたiframe内で安全にレンダリングします。これにより、ホストのルックアンドフィールに合った柔軟なUIが可能になります。

### UIアクション

UIスニペットは、イベントをホストに送信することでエージェントと対話できます。例えば、ボタンクリックでツールコールをトリガーするなどです。

## インストール

### TypeScript

```bash
# npm
npm install @mcp-ui/server @mcp-ui/client
# pnpm
pnpm add @mcp-ui/server @mcp-ui/client
# yarn
yarn add @mcp-ui/server @mcp-ui/client
```

### Ruby

```bash
gem install mcp_ui_server
```

## はじめに

[GitMCP](https://gitmcp.io/idosal/mcp-ui) を使用して、IDEから `mcp-ui` の最新ドキュメントにアクセスできます。

### TypeScript

1. **サーバーサイド**: UIリソースを構築します。

    ```typescript
    import { createUIResource } from '@mcp-ui/server';
    // インラインHTML
    const htmlResource = createUIResource({ /* ... */ });
    // 外部リンク
    const externalUrlResource = createUIResource({ /* ... */ });
    // remote-dom
    const remoteDomResource = createUIResource({ /* ... */ });
    ```

2. **クライアントサイド**: MCPホストでレンダリングします。

    ```tsx
    import React from 'react';
    import { UIResourceRenderer } from '@mcp-ui/client';

    function App({ mcpResource }) {
      return (
        <UIResourceRenderer
          resource={mcpResource.resource}
          onUIAction={(result) => console.log('Action:', result)}
        />
      );
    }
    ```

### Ruby

**サーバーサイド**: UIリソースを構築します。

```ruby
require 'mcp_ui_server'
# インラインHTML
html_resource = McpUiServer.create_ui_resource(...)
# 外部リンク
external_url_resource = McpUiServer.create_ui_resource(...)
# remote-dom
remote_dom_resource = McpUiServer.create_ui_resource(...)
```

## ウォークスルー

詳細なステップバイステップガイドは、[mcp-ui ドキュメントサイト](https://mcpui.dev)で利用可能です。

* [TypeScript Server Walkthrough](https://mcpui.dev/guide/server/typescript/walkthrough)
* [Ruby Server Walkthrough](https://mcpui.dev/guide/server/ruby/walkthrough)

## サンプル

* **クライアント**: [ui-inspector](https://github.com/idosal/ui-inspector), [MCP-UI Chat](https://github.com/idosal/scira-mcp-ui-chat)など。
* **サーバー**: TypeScriptとRubyの[デモサーバー](https://github.com/idosal/mcp-ui/tree/main/examples)があります。

## サポートされるホスト

| ホスト | レンダリング | UIアクション |
| --- | --- | --- |
| [Postman](https://www.postman.com/) | ✅ | ⚠️ |
| [Goose](https://block.github.io/goose/) | ✅ | ⚠️ |
| [Smithery](https://smithery.ai/playground) | ✅ | ❌ |
| [MCPJam](https://www.mcpjam.com/) | ✅ | ❌ |
| [VSCode](https://github.com/microsoft/vscode/issues/260218) (TBA) | ? | ? |

**凡例:** ✅: サポート, ⚠️: 部分サポート, ❌: 未サポート

## セキュリティ

ホストとユーザーのセキュリティは最優先事項です。すべてのコンテンツタイプで、リモートコードはサンドボックス化されたiframe内で実行されます。

## ロードマップ

* オンラインプレイグラウンドの追加
* UI Action APIの拡張
* 追加のプログラミング言語用SDKの追加
* 宣言的なUIコンテンツタイプの追加
* 生成的UIのサポート

## コントリビュート

貢献、アイデア、バグレポートを歓迎します。[貢献ガイドライン](https://github.com/idosal/mcp-ui/blob/main/.github/CONTRIBUTING.md)を参照してください。

## ライセンス

Apache License 2.0
