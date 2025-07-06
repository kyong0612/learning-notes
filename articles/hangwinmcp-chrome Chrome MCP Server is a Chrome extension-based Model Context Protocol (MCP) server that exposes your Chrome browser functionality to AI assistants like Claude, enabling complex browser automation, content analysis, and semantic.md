---
title: "hangwin/mcp-chrome: AIアシスタントがブラウザを操作可能にするChrome拡張機能ベースのMCPサーバー"
source: "https://github.com/hangwin/mcp-chrome"
author:
  - "[[hangwin]]"
published:
created: 2025-07-06
description: |
  `mcp-chrome` は、使い慣れたChromeブラウザを、ClaudeのようなAIアシスタントが操作できる強力な自動化ツールに変えるChrome拡張機能ベースのMCPサーバーです。これにより、複雑なブラウザ操作、コンテンツ分析、セマンティック検索が可能になります。
tags:
  - "clippings"
  - "Chrome Extension"
  - "MCP"
  - "Browser Automation"
  - "AI Agent"
  - "Claude"
---

`mcp-chrome` は、Chromeブラウザの機能を[Model Context Protocol (MCP)](https://mcp.dev)サーバーとして公開するChrome拡張機能です。これにより、ClaudeのようなAIアシスタントがユーザーのブラウザを直接操作し、複雑なブラウザ自動化、コンテンツ分析、セマンティック検索などを実行できるようになります。

Playwrightのような従来の自動化ツールとは異なり、`mcp-chrome`はユーザーが日常的に使用しているChromeブラウザをそのまま利用するため、既存の設定やログイン状態を引き継げる点が大きな利点です。

## 主な特徴

* **🤖 モデル非依存**: Claudeに限らず、好みのLLMやチャットボット、エージェントからブラウザを自動化できます。
* **⭐️ 既存ブラウザ環境の活用**: 普段使いのブラウザの設定、ログイン状態、拡張機能などをそのまま利用できます。
* **💻 完全ローカル動作**: プライバシーを確保する純粋なローカルMCPサーバーです。
* **🚄 ストリーミングHTTP対応**: ストリーミング可能なHTTP接続方式をサポートします。
* **🧠 セマンティック検索**: 内蔵のベクトルデータベースにより、開いているタブのコンテンツをインテリジェントに検索できます。
* **🌐 20以上の豊富なツール**: スクリーンショット、ネットワーク監視、対話的操作、ブックマーク管理、閲覧履歴など、20以上のツールを提供します。
* **🚀 SIMDによるAI高速化**: カスタムWebAssembly SIMD最適化により、ベクトル演算を4〜8倍高速化します。

## 類似プロジェクトとの比較

| 比較項目 | PlaywrightベースのMCPサーバー | Chrome拡張機能ベースのMCPサーバー (`mcp-chrome`) |
| :--- | :--- | :--- |
| **リソース使用量** | ❌ 独立したブラウザプロセスが必要 | ✅ 既存のChromeプロセスを直接利用 |
| **ユーザーセッション** | ❌ 再ログインが必要 | ✅ 既存のログイン状態を自動利用 |
| **ブラウザ環境** | ❌ クリーンな環境でユーザー設定が欠如 | ✅ ユーザー環境を完全に維持 |
| **APIアクセス** | ⚠️ Playwright APIに限定 | ✅ ChromeネイティブAPIへフルアクセス |
| **起動速度** | ❌ ブラウザプロセスの起動が必要 | ✅ 拡張機能のアクティブ化のみ |

## クイックスタート

### 1. 拡張機能のダウンロード

[GitHubリリースページ](https://github.com/hangwin/mcp-chrome/releases)から最新版をダウンロードします。

### 2. ブリッジのインストール

`mcp-chrome-bridge`をグローバルにインストールします。

```bash
npm install -g mcp-chrome-bridge
```

### 3. Chrome拡張機能の読み込み

1. Chromeで `chrome://extensions/` を開きます。
2. 「デベロッパーモード」を有効にします。
3. 「パッケージ化されていない拡張機能を読み込む」をクリックし、ダウンロードした拡張機能のフォルダを選択します。

## MCPクライアントでの設定

### ストリーミングHTTP接続（推奨）

MCPクライアントの設定に以下を追加します。

```json
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

### STDIO接続（代替）

クライアントがSTDIO接続のみをサポートする場合、`mcp-chrome-bridge`のインストールパスを指定して設定します。

```json
{
  "mcpServers": {
    "chrome-mcp-stdio": {
      "command": "npx",
      "args": [
        "node",
        "/path/to/mcp-chrome-bridge/dist/mcp/mcp-server-stdio.js"
      ]
    }
  }
}
```

## 提供ツール一覧

[完全なツールリストはこちら](https://github.com/hangwin/mcp-chrome/blob/master/docs/TOOLS.md)

* **📊 ブラウザ管理 (6ツール)**: ウィンドウとタブのリスト化、ページ遷移、タブを閉じる、履歴移動など。
* **📸 スクリーンショット (1ツール)**: 要素指定やフルページ対応の高度なスクリーンショット。
* **🌐 ネットワーク監視 (4ツール)**: ネットワークキャプチャ、デバッガAPI、カスタムHTTPリクエスト。
* **🔍 コンテンツ分析 (4ツール)**: タブコンテンツのAIセマンティック検索、Webコンテンツ抽出、対話要素の取得。
* **🎯 対話操作 (3ツール)**: 要素のクリック、フォーム入力、キーボード操作のシミュレート。
* **📚 データ管理 (5ツール)**: 閲覧履歴検索、ブックマークの検索・追加・削除。

## 使用例

AIがWebページの内容を要約し、Excalidrawで図を自動描画する例：
[
  ![Excalidraw-Example](https://private-user-images.githubusercontent.com/12791725/455681735-fd17209b-303d-48db-9e5e-3717141df183.mp4)
]

## 今後の展望

* 認証機能
* 操作の記録と再生
* ワークフローの自動化
* Firefox拡張機能のサポート

プロジェクトへの貢献は歓迎されています。詳細は[CONTRIBUTING.md](https://github.com/hangwin/mcp-chrome/blob/master/docs/CONTRIBUTING.md)を参照してください。

## ライセンス

このプロジェクトはMITライセンスです。
