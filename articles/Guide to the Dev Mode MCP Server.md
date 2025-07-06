---
title: "Dev Mode MCPサーバーガイド"
source: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server"
author:
  - "Figma Learn - Help Center"
published:
created: 2025-07-06
description: |
  Dev Mode MCPサーバーは、Figmaのデザインファイルからコードを生成するAIエージェントに重要なデザイン情報とコンテキストを提供することで、Figmaをワークフローに直接取り込みます。
tags:
  - "Figma"
  - "Dev Mode"
  - "MCP Server"
  - "AI"
  - "Code Generation"
---

🚧 Dev Mode MCPサーバーは現在[オープンベータ](https://help.figma.com/hc/en-us/articles/4406787442711)です。一部の機能や設定はまだ利用できない場合があります。この機能は変更される可能性があり、ベータ期間中はバグやパフォーマンスの問題が発生する可能性があります。

Dev Mode MCPサーバーは、Figmaのデザインファイルからコードを生成するAIエージェントに重要なデザイン情報とコンテキストを提供することで、Figmaをワークフローに直接取り込みます。MCPサーバーは、AIエージェントが[Model Context Protocol](https://modelcontextprotocol.io/introduction)を使用してデータソースと対話するための標準化されたインターフェースの一部です。

### はじめに

**この機能を利用できる方:**

* Dev Mode MCPサーバーはオープンベータ版です。
* Professional、Organization、またはEnterpriseプランの[DevまたはFullシート](https://help.figma.com/hc/en-us/articles/27468498501527-Updates-to-Figma-s-pricing-seats-and-billing-experience#h_01JCPBM8X2MBEXTABDM92HWZG4)で利用可能です。
* MCPサーバーをサポートするコードエディタまたはアプリケーション（例：VS Code、Cursor、Windsurf、Claude Code）を使用する必要があります。
* Dev Mode MCPサーバーはFigmaデスクトップアプリからのみ使用できます。[Figmaデスクトップアプリをダウンロード →](https://www.figma.com/downloads/)

サーバーを有効にすると、次のことが可能になります。

* **選択したフレームからコードを生成**: Figmaフレームを選択してコードに変換します。
* **デザインコンテキストの抽出**: 変数、コンポーネント、レイアウトデータをIDEに直接取り込みます。
* **Code Connectでよりスマートにコーディング**: 実際のコンポーネントを再利用して出力品質を向上させます。[Code Connectについて詳しくはこちら →](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)

## ステップ1：MCPサーバーを有効にする

1. [Figmaデスクトップアプリ](https://www.figma.com/downloads/)を開き、最新バージョンに更新されていることを確認します。
2. Figmaデザインファイルを作成または開きます。
3. 左上のFigmaメニューを開きます。
4. **Preferences**で、**Enable Dev Mode MCP Server**を選択します。

    ![mcp_menu.png](https://help.figma.com/hc/article_attachments/32209721873943)

サーバーがローカルの`http://127.0.0.1:3845/sse`で実行されていることを示す確認メッセージが表示されます。

## ステップ2：MCPクライアントを設定する

サーバーが実行されると、MCPクライアントが接続できます。お使いのクライアントの指示に従ってください。

### VS Code

1. **Code → Settings → Settings** (`⌘ ,`)に移動します。
2. 「MCP」を検索します。

    ![vscode.png](https://help.figma.com/hc/article_attachments/32582560277527)
3. **Edit in settings.json**を選択します。
4. Figma Dev Mode MCP設定を追加します。

    ```json
    "chat.mcp.discovery.enabled": true,
    "mcp": {
      "servers": {
        "Figma Dev Mode MCP": {
          "type": "sse",
          "url": "http://127.0.0.1:3845/sse"
        }
      }
    },
    "chat.agent.enabled": true
    ```

5. チャットツールバー（`⌥⌘B`または`⌃⌘I`）を開き、**Agent**モードに切り替えます。
6. **selection tool**メニューを開き、`MCP Server: Figma Dev Mode MCP`を探します。

**注:** [GitHub Copilot](https://github.com/features/copilot)を有効にする必要があります。詳しくは[VS Codeの公式ドキュメント](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)をご覧ください。

### Cursor

1. **Cursor → Settings → Cursor Settings**を開きます。
2. **MCP**タブに移動します。
3. **+ Add new global MCP server**をクリックします。
4. 設定を入力して保存します。

    ```json
    {
      "mcpServers": {
        "Figma": {
          "url": "http://127.0.0.1:3845/sse"
        }
      }
    }
    ```

詳しくは[Cursorの公式ドキュメント](https://docs.cursor.com/context/model-context-protocol)をご覧ください。

### その他のエディタ

SSEをサポートする他のエディタも同じサーバーURLを使用して接続できます。SSE互換のMCPサーバーの設定については、お使いのエディタのドキュメントを確認してください。

## ステップ3：MCPクライアントにプロンプトを出す

AIクライアントにFigmaデザインコンテキストを提供するには、2つの方法があります。

### 選択ベース

1. Figmaデスクトップアプリでフレームまたはレイヤーを選択します。
2. クライアントに選択範囲の実装を指示します。

    ![prompt.png](https://help.figma.com/hc/article_attachments/32209690330263)

### リンクベース

1. Figmaのフレームまたはレイヤーへのリンクをコピーします。

    ![copy_link.png](https://help.figma.com/hc/article_attachments/32209690331799)
2. クライアントにURLのデザインの実装を指示します。クライアントは必要なノードIDを抽出します。

## ツールと使用方法の提案

### `get_code`

選択範囲のコードを生成します（デフォルト：**React + Tailwind**）。プロンプトでカスタマイズします。

* **フレームワークの変更**: 「Figmaの選択範囲をVueで生成して。」
* **コンポーネントの使用**: 「`src/components/ui`のコンポーネントを使用してFigmaの選択範囲を生成して。」

### `get_variable_defs`

選択範囲から変数とスタイル（色、スペース、タイポグラフィ）を返します。

* 「Figmaの選択範囲で使用されている変数を取得して。」
* 「Figmaの選択範囲で使用されている変数名とその値をリストアップして。」

### `get_code_connect_map`

FigmaノードIDと対応するコードコンポーネント間のマッピングを取得し、`codeConnectSrc`（場所）と`codeConnectName`（名前）を持つオブジェクトを返します。

### `get_image`

選択範囲のスクリーンショットを撮ります。**Preferences > Dev Mode MCP Server Settings > Enable tool get_image**で有効にします。

## Dev Mode MCPサーバー設定

**Preferences**で追加設定を切り替えます。

* **Enable tool get_image**: 画像抽出をスキップするためにプレースホルダーを使用できます。
* **Enable code connect**: コンポーネントを再利用するために、レスポンスにCode Connectマッピングを含めます。

## MCPのベストプラクティス

### より良いコードのためにFigmaファイルを構造化する

* 再利用する要素には**コンポーネントを使用**します。
* Code Connectを介して**コンポーネントをコードベースにリンク**します。
* スタイルには**変数を使用**します。
* **レイヤーを意味的に命名**します（例：`CardContainer`、`Group 5`ではない）。
* レスポンシブな意図には**Auto layoutを使用**します。
* 視覚的でないデザインの意図を伝えるために**注釈を使用**します。

### AIを導くための効果的なプロンプトを作成する

良いプロンプトは、結果をフレームワークに合わせ、規則に従い、特定のファイルにコードを追加することができます。

* 「このフレームからiOS SwiftUIコードを生成して」
* 「このレイアウトにはChakra UIを使用して」
* 「これを`src/components/marketing/PricingCard.tsx`に追加して」

### 必要に応じて特定のツールをトリガーする

結果が期待と異なる場合は、プロンプトで明示的に適切なツールをトリガーします。

* `get_code`: 選択範囲の構造化された表現を提供します。
* `get_variable_defs`: 変数とスタイルを抽出します。

### カスタムルールを追加する

一貫性を確保するために、MCPクライアントの指示ファイルでプロジェクトレベルのガイダンス（レイアウトプリミティブ、ファイル構成、命名パターン）を設定します。

### 大きな選択範囲を分割する

より速く、信頼性の高い結果を得るために、コードをより小さなセクションまたは個々のコンポーネントに対して生成します。大きな選択範囲はツールを遅くしたり、エラーを引き起こす可能性があります。
