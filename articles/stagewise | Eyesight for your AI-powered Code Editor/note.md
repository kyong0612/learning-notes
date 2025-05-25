---
title: "stagewise | Eyesight for your AI-powered Code Editor"
source: "https://stagewise.io/"
author:
  - "Goetze, Scharpff & Toews GbR"
published: 2024
created: 2025-05-25
description: "AI対応コードエディタ用のブラウザツールバーで、フロントエンドUIとコードAIエージェントを接続します。DOM要素を選択、コメントを残し、AIエージェントに作業を任せることができます。React、Next.js、Vue、Nuxtをサポートし、Cursor、Windsurf等のAIコーディングアシスタントと連携します。"
tags:
  - "AI"
  - "コードエディタ"
  - "VS Code"
  - "Cursor"
  - "Windsurf"
  - "フロントエンド開発"
  - "ブラウザ拡張"
  - "開発ツール"
  - "React"
  - "Vue"
  - "Next.js"
  - "オープンソース"
---

# stagewise - AI対応コードエディタの視覚的支援ツール

## 概要

stagewiseは、フロントエンドUIとコードAIエージェントを接続するブラウザツールバーです。Webアプリ上の任意のDOM要素を選択し、コメントを残すことで、AIエージェントが実際のコンテキストを理解してコードを編集できます。

## 主な機能

### コア機能

- **要素選択**: ブラウザ上のあらゆるDOM要素を直接選択
- **リアルタイムコメント**: 選択した要素に直接コメントを追加
- **AIエージェント連携**: 実際のブラウザコンテキストをAIエージェントに送信
- **スクリーンショット付きメタデータ**: DOM要素、スクリーンショット、メタデータを含む豊富なコンテキスト情報

### 技術的特徴

- **簡単セットアップ**: 最小限の設定で使用開始
- **カスタマイズ可能**: 独自の設定ファイルで体験をカスタマイズ
- **ゼロインパクト**: 本番アプリのバンドルサイズに影響なし
- **MCP接続**: 独自のMCPサーバーに接続可能

## サポート対象フレームワーク

stagewiseは主要なフロントエンドフレームワークと統合可能：

- **React** - `@stagewise/toolbar-react`パッケージでサポート
- **Next.js** - `@stagewise/toolbar-next`パッケージでサポート
- **Vue.js** - `@stagewise/toolbar-vue`パッケージでサポート
- **Nuxt.js** - Vue.jsパッケージを使用してサポート
- **SvelteKit** - `@stagewise/toolbar`を使用してサポート

## AIエージェントサポート

| エージェント | 対応状況 |
|-------------|---------|
| Cursor | ✅ サポート済み |
| Windsurf | ✅ サポート済み |
| GitHub Copilot | 🚧 開発中 |
| Cline | ❌ 未対応 |
| BLACKBOXAI | ❌ 未対応 |
| その他（Continue.dev、Amazon Q、Cody等） | ❌ 未対応 |

## クイックスタート

### 1. VS Code拡張機能のインストール

[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stagewise.stagewise-vscode-extension)から拡張機能をインストール

### 2. ツールバーのセットアップ

#### AI支援自動インストール

1. Cursorで `CMD + Shift + P` を押下
2. `setupToolbar` と入力
3. コマンドを実行すると自動的に初期化

#### 手動インストール

```bash
pnpm i -D @stagewise/toolbar
```

基本的な統合コード例：

```javascript
import { initToolbar } from '@stagewise/toolbar';

const stagewiseConfig = {
  plugins: [
    {
      name: 'example-plugin',
      description: 'コンポーネントに追加のコンテキストを提供',
      shortInfoForPrompt: () => {
        return "選択された要素に関するコンテキスト情報";
      },
      mcp: null,
      actions: [
        {
          name: 'カスタムアクション例',
          description: 'カスタムアクションのデモンストレーション',
          execute: () => {
            window.alert('これはカスタムアクションです！');
          },
        },
      ],
    },
  ],
};

// 開発モードでのみ初期化
if (process.env.NODE_ENV === 'development') {
  initToolbar(stagewiseConfig);
}
```

## フレームワーク別統合例

### React.js

```javascript
// src/main.tsx
import { StagewiseToolbar } from '@stagewise/toolbar-react';

// メインアプリとは別のReactルートでツールバーを初期化
document.addEventListener('DOMContentLoaded', () => {
  const toolbarRoot = document.createElement('div');
  toolbarRoot.id = 'stagewise-toolbar-root';
  document.body.appendChild(toolbarRoot);

  createRoot(toolbarRoot).render(
    <StrictMode>
      <StagewiseToolbar config={toolbarConfig} />
    </StrictMode>
  );
});
```

### Next.js

```javascript
// src/app/layout.tsx
import { StagewiseToolbar } from '@stagewise/toolbar-next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StagewiseToolbar config={{ plugins: [] }} />
        {children}
      </body>
    </html>
  );
}
```

### Vue.js/Nuxt.js

```vue
<!-- App.vue または app.vue -->
<script setup lang="ts">
import { StagewiseToolbar } from '@stagewise/toolbar-vue';

const config = {
  plugins: [], // カスタムプラグインを追加
};
</script>

<template>
  <div>
    <ClientOnly>
      <StagewiseToolbar :config="config" />
    </ClientOnly>
    <!-- アプリコンテンツ -->
  </div>
</template>
```

## ライセンス

stagewiseはAGPL v3ライセンスの下で公開されており、オープンで透明な貢献を保証しています。

### 商用ライセンス不要な場合

- 公式の未改変版を使用
- 開発、テスト、評価環境での使用に限定
- ネットワーク上でユーザーに公開されない

### 商用ライセンス必要な場合

- 本番環境での使用（内部利用含む）
- stagewiseのフォークや改変
- プロプライエタリまたはクローズドソース製品への統合
- SOC 2、ISO 27001等の規格準拠が必要な場合

## プロジェクト情報

- **GitHub Stars**: 2.1k+
- **開発会社**: Goetze, Scharpff & Toews GbR
- **公式サイト**: <https://stagewise.io/>
- **GitHub**: <https://github.com/stagewise-io/stagewise>
- **Discord**: コミュニティサポート利用可能
- **商用問い合わせ**: <sales@stagewise.io>

## 開発統計

- **主要言語**: TypeScript (94.9%)
- **フォーク数**: 89
- **ウォッチャー数**: 12
- **リリース数**: 23
- **貢献者数**: 4名

stagewiseは「AIが実際にブラウザと対話できれば？」という問いから生まれた革新的なツールで、手動でのファイル選択の手間を省き、AIエージェントにリアルタイムのブラウザ駆動コンテキストを提供します。
