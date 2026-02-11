---
title: "excalidraw/excalidraw-mcp: Fast and streamable Excalidraw MCP App"
source: "https://github.com/excalidraw/excalidraw-mcp"
author:
  - "Anton Pidkuiko (antonpk1)"
published: 2026-02-04
created: 2026-02-11
description: "Excalidrawの手書き風ダイアグラムをMCPサーバー経由でストリーミング描画するアプリ。アニメーション付きSVGレンダリング、フルスクリーン編集、チェックポイント/リストア、excalidraw.comへのワンクリックエクスポートに対応。Claude、ChatGPT、VS Code、Gooseなど主要なMCPクライアントで動作する。"
tags:
  - "clippings"
  - "excalidraw"
  - "mcp"
  - "diagrams"
  - "mcp-apps"
  - "visualization"
---

## 概要

**Excalidraw MCP App Server** は、[MCP Apps](https://modelcontextprotocol.io/docs/extensions/apps) 拡張に対応したMCPサーバーで、AIチャット内で直接 Excalidraw の手書き風ダイアグラムをストリーミング描画できる。LLMに「ダイアグラムを描いて」と依頼するだけで、アニメーション付きのSVGが生成され、チャットUI内にインタラクティブに表示される。

- **リポジトリ**: [excalidraw/excalidraw-mcp](https://github.com/excalidraw/excalidraw-mcp)
- **著者**: Anton Pidkuiko ([@antonpk1](https://github.com/antonpk1))
- **ライセンス**: MIT
- **最新バージョン**: v0.3.2（2026-02-09）
- **スター数**: 1,258+ / フォーク数: 89+

---

## MCP Apps とは

テキスト応答だけでは限界がある場面に対応するため、[MCP Apps](https://github.com/modelcontextprotocol/ext-apps/) はModel Context Protocolの公式拡張として、MCPサーバーがインタラクティブなHTMLインターフェース（データ可視化、フォーム、ダッシュボードなど）を返せるようにし、チャット内で直接レンダリングする仕組みを提供する。

---

## 主要機能

### ストリーミングSVGレンダリング
- 手書き風スタイルのダイアグラムをアニメーション付きでストリーミング描画
- スムーズなビューポートカメラパンニング制御

### フルスクリーン編集
- チャット内のインラインウィジェットからフルスクリーンエディタへシームレスに移行
- SVGファーストのマウント/リビールトランジションパターン
- フルスクリーン中に新しいツールコールが到着してもエディタがアンマウント/リマウントしない安定性

### チェックポイント/リストア
- ツールコールごとにダイアグラム状態をチェックポイントIDで保存
- `restoreCheckpoint` エレメントでチェックポイントからの復元
- `deleteElement` でリストア状態からの要素削除
- 保存されたビューポートはcameraUpdateが提供されない場合のフォールバックとして復元

### excalidraw.com へのエクスポート
- Excalidraw v2バイナリ形式（concatBuffers + AES-GCM + zlib）対応
- サーバーサイドプロキシ（`visibility: ["app"]`）でCORS回避
- 暗号化 + excalidraw.com へアップロードし、共有可能なリンクを生成
- アップロード前に確認モーダル表示
- フルスクリーンエディタ右上に「Export」ボタン

### カメラ制御
- `cameraUpdate` による新しいカメラ制御エレメント（旧 `viewportUpdate` からの移行、後方互換あり）
- 5つの標準4:3ビューポートサイズ（S 400x300 ～ XXL 1600x1200）
- フォントサイズ警告付き

---

## 提供ツール

| ツール名 | 説明 |
|---|---|
| `read_me` | Excalidrawエレメント形式のリファレンス（カラーパレット、例、ヒント）を返す。`create_view` の前に呼び出す。 |
| `create_view` | Excalidrawエレメントを使用してストリーミングdraw-onアニメーション付きの手書き風ダイアグラムをレンダリングする。 |

---

## インストール方法

### リモート（推奨）

MCPサーバーURLを任意のMCPクライアントに追加するだけ:

```
https://excalidraw-mcp-app.vercel.app/mcp
```

例: [claude.ai](https://claude.ai) → Settings → Connectors → Add custom connector → 上記URLを貼り付け

### ローカル

**Option A: 拡張機能ダウンロード**
- [Releases](https://github.com/antonpk1/excalidraw-mcp-app/releases) から `excalidraw-mcp-app.mcpb` をダウンロード
- ダブルクリックでClaude Desktopにインストール

**Option B: ソースからビルド**

```shell
git clone https://github.com/antonpk1/excalidraw-mcp-app.git
cd excalidraw-mcp-app
npm install && npm run build
```

Claude Desktop設定ファイル（`~/Library/Application Support/Claude/claude_desktop_config.json`）に追加:

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/path/to/excalidraw-mcp-app/dist/index.js", "--stdio"]
    }
  }
}
```

---

## 使用例

- `"Draw a cute cat using excalidraw"`
- `"Draw an architecture diagram showing a user connecting to an API server which talks to a database"`

---

## 対応クライアント

Claude、ChatGPT、VS Code、Goose など、[MCP Apps](https://modelcontextprotocol.io/docs/extensions/apps) をサポートする任意のクライアントで動作する。

---

## リリース履歴

| バージョン | 日付 | 主な変更点 |
|---|---|---|
| **v0.3.2** | 2026-02-09 | デモGIF更新、cameraUpdate/delete疑似要素をリファレンスに追加 |
| **v0.3.1** | 2026-02-09 | claude.ai webでのフルスクリーン高さ崩れ修正（100vh → 100%）、React直接bodyレンダリング |
| **v0.3.0** | 2026-02-07 | excalidraw.comエクスポート、チェックポイント/リストア、フォント読み込み修正、フルスクリーン安定化 |
| **v0.2.0** | 2026-02-06 | カメラ制御改善、4:3ビューポート、デュアルエンドポイント、リッチな例追加 |
| **v0.1.0** | 2026-02-04 | 初回リリース |

---

## 技術仕様

- **ランタイム**: Node.js >= 18.0.0
- **プラットフォーム**: macOS / Windows / Linux
- **デプロイ**: Vercel対応（フォーク → Vercelインポート → 環境変数不要）
- **エンドポイント**: `/mcp` および `/api/mcp` のデュアルエンドポイント対応

---

## コントリビューション

PR歓迎。独自インスタンスのデプロイも可能:
1. リポジトリをフォーク
2. [vercel.com/new](https://vercel.com/new) でフォークをインポート
3. 環境変数不要でデプロイ
4. サーバーは `https://your-project.vercel.app/mcp` で利用可能
