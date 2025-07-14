---
title: "sonnylazuardi/cursor-talk-to-figma-mcp: Cursor と Figma を連携させるMCP"
source: "https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp?tab=readme-ov-file"
author:
  - "[[sonnylazuardi]]"
published:
created: 2025-07-14
description: |
  このプロジェクトは、Cursor AIとFigmaの間のModel Context Protocol (MCP) 統合を実装し、CursorがFigmaと通信してデザインを読み取り、プログラムで変更できるようにします。
tags:
  - "Figma"
  - "Cursor"
  - "MCP"
  - "AI"
  - "Agent"
  - "Automation"
  - "LLM"
---
# [sonnylazuardi/cursor-talk-to-figma-mcp](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp)

このプロジェクトは、Cursor AIとFigmaの間のModel Context Protocol (MCP) 統合を実装し、CursorがFigmaと通信してデザインを読み取り、プログラムで変更できるようにします。

<video src="https://private-user-images.githubusercontent.com/856609/423873278-129a14d2-ed73-470f-9a4c-2240b2a4885c.mp4" controls="controls"></video>

## プロジェクト構造

- `src/talk_to_figma_mcp/` - Figma統合のためのTypeScript MCPサーバー
- `src/cursor_mcp_plugin/` - Cursorと通信するためのFigmaプラグイン
- `src/socket.ts` - MCPサーバーとFigmaプラグイン間の通信を容易にするWebSocketサーバー

## クイックスタート

1. Bunをインストールします:

    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

2. セットアップを実行します。これにより、CursorのアクティブなプロジェクトにMCPがインストールされます:

    ```bash
    bun setup
    ```

3. WebSocketサーバーを起動します:

    ```bash
    bun socket
    ```

4. Figmaプラグインを[Figmaコミュニティページ](https://www.figma.com/community/plugin/1485687494525374295/cursor-talk-to-figma-mcp-plugin)からインストールするか、[ローカルでインストール](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp#figma-plugin)します。

## クイックビデオチュートリアル

[LinkedInのデモビデオ](https://www.linkedin.com/posts/sonnylazuardi_just-wanted-to-share-my-latest-experiment-activity-7307821553654657024-yrh8)

## デザイン自動化の例

### テキストコンテンツの一括置換

[@dusskapark](https://github.com/dusskapark)による機能貢献。
[デモビデオはこちら](https://www.youtube.com/watch?v=j05gGT3xfCs)。

### インスタンスオーバーライドの伝播

同じく[@dusskapark](https://github.com/dusskapark)による貢献。単一のコマンドで、ソースインスタンスから複数のターゲットインスタンスへコンポーネントインスタンスのオーバーライドを伝播させます。
[デモビデオはこちら](https://youtu.be/uvuT8LByroI)。

## 手動セットアップとインストール

### MCPサーバー: Cursorとの統合

`~/.cursor/mcp.json` にサーバーを追加します:

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": ["cursor-talk-to-figma-mcp@latest"]
    }
  }
}
```

### WebSocketサーバー

WebSocketサーバーを起動します:

```bash
bun socket
```

### Figmaプラグイン

1. Figmaで `Plugins > Development > New Plugin` に移動します。
2. "Link existing plugin" を選択します。
3. `src/cursor_mcp_plugin/manifest.json` ファイルを選択します。
4. プラグインがFigmaの開発プラグインで利用可能になります。

## 使い方

1. WebSocketサーバーを起動します。
2. CursorにMCPサーバーをインストールします。
3. Figmaを開き、Cursor MCPプラグインを実行します。
4. `join_channel` を使用して、プラグインをWebSocketサーバーに接続します。
5. Cursorを使用してMCPツールでFigmaと通信します。

## MCPツール

MCPサーバーはFigmaと対話するために以下のツールを提供します:

### ドキュメントと選択

- `get_document_info`: 現在のFigmaドキュメントの情報を取得します。
- `get_selection`: 現在の選択範囲の情報を取得します。
- `read_my_design`: パラメータなしで現在の選択範囲の詳細なノード情報を取得します。
- `get_node_info`: 特定のノードの詳細情報を取得します。
- `get_nodes_info`: 複数のノードの詳細情報を取得します。

### 注釈

- `get_annotations`: ドキュメントまたは特定ノードのすべての注釈を取得します。
- `set_annotation`: Markdownをサポートする注釈を作成・更新します。
- `set_multiple_annotations`: 複数の注釈を効率的に一括作成・更新します。
- `scan_nodes_by_types`: 特定のタイプのノードをスキャンします（注釈ターゲットの検索に便利）。

### プロトタイピングと接続

- `get_reactions`: ノードからすべてのプロトタイプリフクションを取得します。
- `set_default_connector`: コピーしたFigJamコネクタをデフォルトのコネクタスタイルとして設定します。
- `create_connections`: ノード間にFigJamコネクタラインを作成します。

### 要素の作成

- `create_rectangle`: 新しい長方形を作成します。
- `create_frame`: 新しいフレームを作成します。
- `create_text`: カスタマイズ可能なフォントプロパティを持つ新しいテキストノードを作成します。

### テキストコンテンツの変更

- `scan_text_nodes`: 大規模なデザインのためにインテリジェントなチャンクでテキストノードをスキャンします。
- `set_text_content`: 単一のテキストノードのテキストコンテンツを設定します。
- `set_multiple_text_contents`: 複数のテキストノードを効率的に一括更新します。

### オートレイアウトとスペーシング

- `set_layout_mode`: フレームのレイアウトモードとラップ動作を設定します。
- `set_padding`: オートレイアウトフレームのパディング値を設定します。
- `set_axis_align`: オートレイアウトフレームの主軸と交差軸の配置を設定します。
- `set_layout_sizing`: オートレイアウトフレームの水平・垂直サイジングモードを設定します。
- `set_item_spacing`: オートレイアウトフレーム内の要素間の距離を設定します。

### スタイリング

- `set_fill_color`: ノードの塗りつぶし色を設定します（RGBA）。
- `set_stroke_color`: ノードのストローク色と太さを設定します。
- `set_corner_radius`: ノードの角丸半径を設定します。

### レイアウトと整理

- `move_node`: ノードを新しい位置に移動します。
- `resize_node`: ノードのサイズを変更します。
- `delete_node`: ノードを削除します。
- `delete_multiple_nodes`: 複数のノードを一度に効率的に削除します。
- `clone_node`: 既存のノードのコピーを作成します。

### コンポーネントとスタイル

- `get_styles`: ローカルスタイルの情報を取得します。
- `get_local_components`: ローカルコンポーネントの情報を取得します。
- `create_component_instance`: コンポーネントのインスタンスを作成します。
- `get_instance_overrides`: 選択したコンポーネントインスタンスからオーバーライドプロパティを抽出します。
- `set_instance_overrides`: 抽出したオーバーライドをターゲットインスタンスに適用します。

### エクスポートと高度な機能

- `export_node_as_image`: ノードを画像としてエクスポートします（PNG, JPG, SVG, PDF）。

### 接続管理

- `join_channel`: Figmaと通信するための特定のチャンネルに参加します。

### MCPプロンプト

MCPサーバーには、複雑なデザインタスクをガイドするためのヘルパープロンプトが含まれています:

- `design_strategy`: Figmaデザインを扱う際のベストプラクティス。
- `read_design_strategy`: Figmaデザインを読み取る際のベストプラクティス。
- `text_replacement_strategy`: Figmaデザインのテキストを置換するための体系的なアプローチ。
- `annotation_conversion_strategy`: 手動注釈をFigmaネイティブ注釈に変換する戦略。
- `swap_overrides_instances`: コンポーネントインスタンス間でオーバーライドを転送する戦略。
- `reaction_to_connector_strategy`: プロトタイプのリアクションをコネクタラインに変換する戦略。

## 開発

### Figmaプラグインのビルド

1. Figmaプラグインディレクトリに移動します:

    ```bash
    cd src/cursor_mcp_plugin
    ```

2. `code.js` と `ui.html` を編集します。

## ベストプラクティス

- コマンドを送信する前に必ずチャンネルに参加する。
- `get_document_info`でドキュメントの概要を最初に取得する。
- `get_selection`で変更前に現在の選択を確認する。
- `get_node_info`で変更を確認する。
- 大規模なデザインの場合は、チャンクパラメータを使用し、進捗を監視し、エラー処理を適切に実装する。

## ライセンス

[MIT](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp/blob/main/LICENSE)
