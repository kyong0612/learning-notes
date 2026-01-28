---
title: "modelcontextprotocol/ext-apps: Official repo for spec & SDK of MCP Apps protocol - standard for UIs embedded AI chatbots, served by MCP servers"
source: "https://github.com/modelcontextprotocol/ext-apps"
author:
  - "Ido Salomon"
  - "Liad Yosef"
  - "Olivier Chafik"
  - "Jerome Swannack"
  - "Jonathan Hefner"
  - "Anton Pidkuiko"
  - "Nick Cooper"
  - "Bryan Ashley"
  - "Alexi Christakis"
published: 2026-01-26
created: 2026-01-28
description: "MCP AppsはModel Context Protocol (MCP)の拡張機能で、MCPサーバーからAIチャットボットにインタラクティブなUIを配信するための標準規格。ui://スキームによるUIリソース宣言、ツールとUIの連携、双方向通信、サンドボックスによるセキュリティモデルを提供する。"
tags:
  - "clippings"
  - "MCP"
  - "AI"
  - "UI"
  - "chatbot"
  - "protocol"
  - "SDK"
---

## 概要

**MCP Apps** は、Model Context Protocol (MCP) を拡張し、MCPサーバーからホスト（AIチャットクライアント）にインタラクティブなユーザーインターフェースを配信するための標準規格およびSDKである。

### なぜMCP Appsが必要か

MCPツールはテキストと構造化データを返すが、チャート、フォーム、動画プレイヤーなどのインタラクティブなUIが必要な場合には対応できない。MCP Appsは、MCPサーバーからインタラクティブなUIを配信する標準化された方法を提供し、会話内でインラインにUIをレンダリングできるようにする。

### 仕組み

1. **ツール定義** — ツールが `ui://` リソースを宣言してHTMLインターフェースを含む
2. **ツール呼び出し** — LLMがサーバー上のツールを呼び出す
3. **ホストがレンダリング** — ホストがリソースを取得し、サンドボックス化されたiframe内に表示
4. **双方向通信** — ホストが通知経由でUIにツールデータを渡し、UIは他のツールをホスト経由で呼び出せる

---

## 仕様の詳細

### 拡張機能識別子

```
io.modelcontextprotocol/ui
```

### 主要コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| **UIリソース** | `ui://` URIスキームを使用した事前宣言されたリソース |
| **ツール-UI連携** | ツールがメタデータ経由でUIリソースを参照 |
| **双方向通信** | iframeとホスト間でMCP JSON-RPCプロトコルによる通信 |
| **セキュリティモデル** | 必須のiframeサンドボックス化と監査可能な通信 |

### UIリソースフォーマット

```typescript
interface UIResource {
  uri: string;        // 例: "ui://weather-dashboard"
  name: string;       // 人間が読める表示名
  description?: string;
  mimeType: string;   // "text/html;profile=mcp-app"
  _meta?: {
    ui?: UIResourceMeta;
  }
}
```

### Content Security Policy (CSP) 設定

```typescript
interface McpUiResourceCsp {
  connectDomains?: string[];   // ネットワークリクエスト用オリジン
  resourceDomains?: string[];  // 静的リソース用オリジン
  frameDomains?: string[];     // ネストされたiframe用オリジン
  baseUriDomains?: string[];   // 許可されるベースURI
}
```

### ツールの可視性制御

```typescript
interface McpUiToolMeta {
  resourceUri?: string;
  visibility?: Array<"model" | "app">;  // デフォルト: ["model", "app"]
}
```

- `"model"`: エージェント（AI）から見える/呼び出し可能
- `"app"`: アプリ（UI）から呼び出し可能

---

## 通信プロトコル

### 標準MCPメッセージ

| カテゴリ | メソッド | 説明 |
|---------|---------|------|
| ツール | `tools/call` | MCPサーバー上のツール実行 |
| リソース | `resources/read` | リソースコンテンツ読み取り |
| 通知 | `notifications/message` | ホストへのログメッセージ |
| ライフサイクル | `ui/initialize` → `ui/notifications/initialized` | ハンドシェイク |

### MCP Apps固有メッセージ

#### View → Host リクエスト

| メソッド | 説明 |
|---------|------|
| `ui/open-link` | 外部URLを開く |
| `ui/message` | チャットにメッセージ送信 |
| `ui/request-display-mode` | 表示モード変更要求 |
| `ui/update-model-context` | モデルコンテキスト更新 |

#### Host → View 通知

| メソッド | 説明 |
|---------|------|
| `ui/notifications/tool-input` | ツール引数（完全） |
| `ui/notifications/tool-input-partial` | ツール引数（ストリーミング中） |
| `ui/notifications/tool-result` | ツール実行結果 |
| `ui/notifications/tool-cancelled` | ツールキャンセル通知 |
| `ui/notifications/host-context-changed` | ホストコンテキスト変更 |
| `ui/resource-teardown` | リソース破棄前通知 |

---

## ホストコンテキスト

ホストはViewに以下の情報を提供：

```typescript
interface HostContext {
  toolInfo?: { id?: RequestId; tool: Tool };
  theme?: "light" | "dark";
  styles?: {
    variables?: Record<string, string>;  // CSSカスタムプロパティ
    css?: { fonts?: string };
  };
  displayMode?: "inline" | "fullscreen" | "pip";
  containerDimensions?: { width/maxWidth, height/maxHeight };
  locale?: string;          // 例: "en-US"
  timeZone?: string;        // 例: "America/New_York"
  platform?: "web" | "desktop" | "mobile";
}
```

---

## テーマ設定

### 標準化されたCSS変数

| カテゴリ | 例 |
|---------|-----|
| 背景色 | `--color-background-primary`, `--color-background-secondary` |
| テキスト色 | `--color-text-primary`, `--color-text-secondary` |
| ボーダー色 | `--color-border-primary` |
| タイポグラフィ | `--font-sans`, `--font-mono`, `--font-weight-normal` |
| ボーダー半径 | `--border-radius-sm`, `--border-radius-md` |
| シャドウ | `--shadow-sm`, `--shadow-md` |

---

## セキュリティ

### 脅威モデル

- 悪意のあるサーバーからの有害なHTMLコンテンツ
- サンドボックスからの脱出試行
- 不正なツール実行
- 機密データの流出
- フィッシング/ソーシャルエンジニアリング

### 緩和策

1. **iframeサンドボックス** — 必須の制限付きiframeでViewをレンダリング
2. **監査可能な通信** — すべてのView-ホスト通信がMCP JSON-RPCで記録可能
3. **事前宣言リソースレビュー** — ツール実行前にUIテンプレートを確認
4. **CSP強制** — リソースメタデータに基づくContent Security Policy

---

## SDK

### アプリ開発者向け

```shell
npm install -S @modelcontextprotocol/ext-apps
```

- SDK: `@modelcontextprotocol/ext-apps`
- React hooks: `@modelcontextprotocol/ext-apps/react`

### ホスト開発者向け

- SDK: `@modelcontextprotocol/ext-apps/app-bridge`

---

## サンプルアプリ

| カテゴリ | 例 |
|---------|-----|
| ビジュアライゼーション | Map, Three.js, ShaderToy, Cohort Heatmap |
| ビジネス | Budget Allocator, Customer Segmentation, Scenario Modeler |
| メディア | Sheet Music, Transcript, Video Resource, PDF |
| ユーティリティ | Wiki Explorer, System Monitor, QR Code |

### フレームワーク別スターターテンプレート

React · Vue · Svelte · Preact · Solid · Vanilla JS

---

## Agent Skills

Claude Codeプラグインとして利用可能：

```shell
/plugin marketplace add modelcontextprotocol/ext-apps
/plugin install mcp-apps@modelcontextprotocol-ext-apps
```

---

## 背景と経緯

- **MCP-UI**: インタラクティブUI機能の先駆者。Postman、HuggingFace、Shopify、Goose、ElevenLabsなどが採用
- **OpenAI Apps SDK**: 2025年11月に発表。MCPをバックボーンとして使用

本仕様（SEP-1865）は、これらのアプローチを単一のオープンスタンダードに統合することを目的としている。

---

## 参考リンク

- [クイックスタートガイド](https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html)
- [APIドキュメント](https://modelcontextprotocol.github.io/ext-apps/api/)
- [仕様書 (2026-01-26)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [SEP-1865 ディスカッション](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865)
