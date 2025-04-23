# MCP - Connect your AI tool to Figma

ref: <https://html.to.design/docs/mcp-tab/>

このドキュメントは、[html.to.design](/) プラグインと Model Control Protocol (MCP) を使用して、AI ツール（Claude Desktop、Cursor）を Figma に接続する方法について説明しています。

## MCP (Model Control Protocol) とは

* MCP ([Model Control Protocol](https://modelcontextprotocol.io/)) は、アプリケーションが LLM (大規模言語モデル) にコンテキストを提供する方法を標準化するオープンプロトコルです。AI アプリケーションにおける USB-C ポートのようなものと説明されています。
* [html.to.design](/) を使用することで、MCP を介して AI が生成したデザインを Figma に送信できます。

![Claude Desktop と Cursor が html.to.design を介して Figma に接続されている図](/_image/pages/docs/mcp-tab/mcp_1358x456.webp)
*(画像: 上記の画像への参照パスが示されています。これは、Claude Desktop と Cursor が html.to.design を介して Figma に接続されている様子を示すイラストです。)*

## Claude Desktop のセットアップ方法

1. **Claude Desktop アプリのダウンロードとインストール:**
    * [Claude Desktop](https://www.anthropic.com/download) をダウンロードしてインストールします。
2. **`uv` のインストール:**
    * macOS: `brew install uv`
    * Windows: `powershell -c "irm https://astral.sh/uv/install.ps1 | more"`
    * その他のインストール方法は [uv installation page](https://docs.astral.sh/uv/getting-started/installation/#standalone-installer) を参照してください。
3. **MCP サーバーを Claude Desktop に追加:**
    * コンピューターの Claude メニューから「Settings...」を選択します。(アプリウィンドウ内のアカウント設定ではありません。)
    * ![Claude Desktop Settings menu](/_image/pages/docs/mcp-tab/claude-settings_644x568.webp)
        *(画像: Mac での Claude Desktop の設定メニューへの参照)*
    * 設定ペインの左側にある「Developer」をクリックし、「Edit Config」をクリックします。
    * ![Claude Desktop Developer panel](/_image/pages/docs/mcp-tab/claude-developer_1688x534.webp)
        *(画像: Claude Desktop の Developer パネルへの参照)*
    * これにより、以下の場所に設定ファイル (`claude_desktop_config.json`) が作成または表示されます。
        * macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
        * Windows: `%APPDATA%\Claude\claude_desktop_config.json`
4. **`claude_desktop_config.json` ファイルの編集:**
    * テキストエディタで `claude_desktop_config.json` を開きます。
    * [html.to.design](/) プラグインの「Configure MCP」ボタンから提供される設定情報を追加します。
    * ![html.to.design MCP tab showing the 'Configure MCP' button](/_image/pages/docs/mcp-tab/config-mcp_874x748.webp)
        *(画像: html.to.design プラグインの MCP タブと「Configure MCP」ボタンへの参照)*
    * ![Example of a MCP configuration file for Claude Desktop](/_image/pages/docs/mcp-tab/claude-json_1338x686.webp)
        *(画像: Claude Desktop 用の MCP 設定ファイルの例への参照)*

## Cursor のセットアップ方法

1. **Cursor アプリのダウンロードとインストール:**
    * [Cursor](https://www.cursor.com/downloads) をダウンロードしてインストールします。
2. **MCP サーバーを Cursor に追加:**
    * Cursor の設定 (Settings) に移動します。
    * ![Cursor Settings panel with the 'MCP' tab selected](/_image/pages/docs/mcp-tab/cursor-settings_1840x858.webp)
        *(画像: Cursor の設定パネル（MCP タブ選択状態）への参照)*
    * 「Add new global MCP server」ボタンをクリックします。
    * `mcp.json` ファイルを編集します。
    * ![Example of a mcp.json file for Cursor](/_image/pages/docs/mcp-tab/cursor-json_1832x682.webp)
        *(画像: Cursor 用の `mcp.json` ファイルの例への参照)*
    * [html.to.design](/) プラグインの「Configure MCP」ボタンの指示に従って編集します。
    * ![html.to.design MCP tab showing the 'Configure MCP' button](/_image/pages/docs/mcp-tab/config-mcp_874x748.webp)
        *(画像: html.to.design プラグインの MCP タブと「Configure MCP」ボタンへの参照)*

## 重要なポイント

* MCP は AI ツールとアプリケーション間の接続を標準化するプロトコルです。
* [html.to.design](/) プラグインは MCP を利用して、Claude Desktop や Cursor から Figma へデザインを送信する機能を提供します。
* セットアップには、各 AI ツールに応じた設定ファイル (`claude_desktop_config.json` または `mcp.json`) の編集が必要です。
* 設定情報は [html.to.design](/) プラグイン内の「Configure MCP」ボタンから取得できます。

## 制限事項

* ドキュメント内のデモ動画の内容は取得できませんでした。
* 画像の表示は参照パスのみであり、実際の画像は表示されていません。
* セットアップには、指定されたツール (`uv`, Claude Desktop, Cursor) のインストールが必要です。

---

この要約は、元のページの構造に沿って整理し、セットアップ手順、重要な概念、関連する画像（参照パスとして）を含めています。特に、MCP の役割と各 AI ツールでの設定手順が強調されています。
