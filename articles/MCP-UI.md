---
title: "MCP-UI"
source: "https://mcpui.dev/"
author:
  - "Ido Salomon"
published:
created: 2025-08-14
description: |
  MCP-UIは、MCPアプリケーション向けのインタラクティブなUIコンポーネントを提供します。AIとのインタラクションにUIをもたらすSDKを使用して、MCPアプリケーション用のリッチで動的なユーザーインターフェースを構築します。
tags:
  - "clippings"
  - "MCP"
  - "UI-Framework"
  - "SDK"
  - "React"
  - "Web-Components"
  - "TypeScript"
  - "Ruby"
---


# MCP-UI: MCPのためのインタラクティブなUIコンポーネント

AIとの対話にUIをもたらすSDKを使って、MCPアプリケーションのためのリッチで動的なユーザーインターフェースを構築します。

[![MCP-UIロゴ](/logo-lg.png)](https://mcpui.dev/)

## 主な特徴

- **⚛️ クライアントSDK**: 簡単なフロントエンド統合のためのReactコンポーネントとWebコンポーネントを提供します。インタラクティブなUIリソースをレンダリングし、UIアクションを簡単に処理します。
- **🛠️ サーバーSDK**: MCPサーバー用のインタラクティブなUIを構築するための強力なユーティリティ。TypeScriptとRubyのための人間工学に基づいたAPIで、HTML、React、Webコンポーネント、および外部アプリUIを作成します。
- **🔒 安全**: すべてのリモートコードはサンドボックス化されたiframeで実行され、ホストとユーザーのセキュリティを確保しつつ、リッチな双方向性を維持します。
- **🎨 柔軟**: ホストのルック＆フィールに一致するiframeやリモートDOMコンポーネントなど、複数のコンテンツタイプをサポートします。

## 動作の様子

<video src="https://github.com/user-attachments/assets/7180c822-2dd9-4f38-9d3e-b67679509483" controls></video>

## 簡単な例

### サーバーサイド

MCPツールリザルトで返すインタラクティブなリソースを作成します:

**TypeScript**

```typescript
import { createUIResource } from '@mcp-ui/server';

const interactiveForm = createUIResource({
  uri: 'ui://user-form/1',
  content: {
    type: 'externalUrl',
    iframeUrl: 'https://yourapp.com'
  },
  encoding: 'text',
});
```

**Ruby**

```ruby
require 'mcp_ui_server'

interactive_form = McpUiServer.create_ui_resource(
  uri: 'ui://user-form/1',
  content: {
    type: :external_url,
    iframeUrl: 'https://yourapp.com'
  },
  encoding: :text
)
```

### クライアントサイド

単一のコンポーネントでホストにレンダリングします:

**React**

```tsx
import { UIResourceRenderer } from '@mcp-ui/client';

// `mcpResource` はMCPレスポンスから取得します
function MyApp({ mcpResource }) {
  return (
    <UIResourceRenderer
      resource={mcpResource.resource}
      onUIAction={(action) => {
        console.log('ユーザーアクション:', action);
      }}
    />
  );
}
```

**Web Component / HTML**

```html
<!-- index.html -->
<ui-resource-renderer id="resource-renderer"></ui-resource-renderer>

<!-- main.js -->
<script type="module">
  // 1. コンポーネントを登録するためにスクリプトをインポートします
  import '@mcp-ui/client/ui-resource-renderer.wc.js';

  // 2. このオブジェクトはMCPレスポンスから取得します
  const mcpResource = {
    resource: {
      uri: 'ui://user-form/1',
      mimeType: 'text/uri-list',
      text: 'https://example.com'
    }
  };

  // 3. 要素を取得してデータを渡します
  const renderer = document.getElementById('resource-renderer');
  renderer.setAttribute('resource', JSON.stringify(mcpResource.resource));

  // 4. イベントをリッスンします
  renderer.addEventListener('onUIAction', (event) => {
    console.log('ユーザーアクション:', event.detail);
  });
</script>
```

---

[Apache 2.0ライセンス](https://github.com/idosal/mcp-ui/blob/main/LICENSE)のもとでリリースされています。

Copyright © 2025-present [Ido Salomon](https://github.com/idosal)
