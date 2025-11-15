---
title: "Dart and Flutter MCP server"
source: "https://docs.flutter.dev/ai/mcp-server"
author: []
published:
created: 2025-11-15
description: "Dart and Flutter MCP serverは、DartとFlutterの開発ツールアクションをAIアシスタントクライアントに公開する実験的なサーバーです。MCP（Model Context Protocol）プロトコルを使用して、開発ツールとAIアシスタント間の通信を可能にし、エラー分析、シンボル解決、パッケージ検索、テスト実行、コードフォーマットなどの機能を提供します。"
tags:
  - "clippings"
  - "MCP"
  - "Dart"
  - "Flutter"
  - "AI assistant"
  - "development tools"
---

# Dart and Flutter MCP server

## 概要

Dart and Flutter MCP serverは、DartとFlutterの開発ツールアクションを互換性のあるAIアシスタントクライアントに公開する実験的なサーバーです。MCP（Model Context Protocol）は、開発ツールとAIアシスタント間の通信を可能にするプロトコルで、アシスタントがコードのコンテキストを理解し、開発者の代わりにアクションを実行できるようにします。

### 要件と制限事項

- **実験的機能**: このサーバーは実験的であり、急速に進化する可能性があります
- **Dart 3.9以降が必要**: 以下の手順にはDart 3.9以降が必要です
- **標準I/O（stdio）サポート**: 標準I/Oをトランスポート媒体としてサポートするMCPクライアントで動作します
- **推奨機能**: すべての機能にアクセスするには、MCPクライアントが[Tools](https://modelcontextprotocol.io/docs/concepts/tools)と[Resources](https://modelcontextprotocol.io/docs/concepts/resources)をサポートしている必要があります。最適な開発体験のためには、[Roots](https://modelcontextprotocol.io/docs/concepts/roots)のサポートも推奨されます
- **Rootsフォールバック**: クライアントがRootsをサポートすると主張しているが実際に設定していない場合、`--force-roots-fallback`を渡すことでルート管理ツールを有効にできます

### 主な機能

Dart and Flutter MCP serverは、プロジェクトに対する深い洞察をAIアシスタントに提供するツールのリストを提供します：

- **エラー分析と修正**: プロジェクトのコード内のエラーを分析し修正します
- **シンボル解決**: シンボルを要素に解決し、その存在を確認し、ドキュメントとシグネチャ情報を取得します
- **アプリケーションのイントロスペクション**: 実行中のアプリケーションをイントロスペクトし、操作します
- **パッケージ検索**: [pub.devサイト](https://pub.dev)でユースケースに最適なパッケージを検索します
- **依存関係管理**: `pubspec.yaml`ファイル内のパッケージ依存関係を管理します
- **テスト実行**: テストを実行し、結果を分析します
- **コードフォーマット**: [`dart format`](https://dart.dev/tools/dart-format)やDart分析サーバーと同じフォーマッターと設定でコードをフォーマットします

## MCPクライアントのセットアップ

サーバーは`dart mcp-server`コマンドで実行され、好みのクライアントで設定する必要があります。

### Gemini CLI

[Gemini CLI](https://geminicli.com/docs/)でDart and Flutter MCP serverを使用するには、Gemini設定の`mcpServers`セクションにDartエントリを追加します。

- **全プロジェクトで有効化**: ホームディレクトリの`~/.gemini/settings.json`ファイルを編集
- **特定プロジェクトで有効化**: プロジェクトのルートディレクトリの`.gemini/settings.json`ファイルを編集

設定例：

```json
{
  "mcpServers": {
    "dart": {
      "command": "dart",
      "args": [
        "mcp-server"
      ]
    }
  }
}
```

詳細は、[Gemini CLIのMCPサーバー設定ドキュメント](https://geminicli.com/docs/tools/mcp-server/#how-to-set-up-your-mcp-server)を参照してください。

### Firebase Studio

[Firebase Studio](https://firebase.studio/)は、本番品質のフルスタックAIアプリを構築・出荷するのに役立つエージェント型クラウドベースの開発環境です。

セットアップ手順：

1. Firebase Studioアプリプロジェクトで、`.idx/mcp.json`ファイルが存在しない場合は作成し、以下のDart and Flutter MCP Server設定を追加：

   ```json
   {
     "mcpServers": {
       "dart": {
         "command": "dart",
         "args": [
           "mcp-server"
         ]
       }
     }
   }
   ```

2. 環境がDart SDK 3.9/Flutter 3.35以降で実行されていることを確認
3. ワークスペースをリビルドしてセットアップを完了
   - コマンドパレット（**Shift+Ctrl+P**）を開く
   - **Firebase Studio: Rebuild Environment**を入力

詳細は、[Firebase Studioワークスペースのカスタマイズ](https://firebase.google.com/docs/studio/customize-workspace)を参照してください。

### Gemini Code Assist in VS Code

[Gemini Code Assist](https://codeassist.google/)の[Agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer)は、Gemini CLIを統合してIDE内に強力なAIエージェントを提供します。

セットアップには、[Gemini Code AssistのAgent modeのBefore you begin手順](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#before-you-begin)に従い、その後[Gemini CLIの設定手順](#gemini-cli)に従ってDart and Flutter MCP serverを設定します。

MCPサーバーが正しく設定されているかは、Agent modeのチャットウィンドウで`/mcp`と入力して確認できます。

詳細は、[Gemini Code AssistのAgent mode使用ドキュメント](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#before-you-begin)を参照してください。

### GitHub Copilot in VS Code

**注意**: VS CodeでのDart and Flutter MCP serverのサポートには、[Dart Code拡張機能](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)のv3.116以降が必要です。

デフォルトでは、Dart拡張機能は[VS Code MCP API](https://code.visualstudio.com/api/extension-guides/mcp)を使用してDart and Flutter MCP serverを登録し、アクティブなDart Tooling DaemonのURIを提供するツールも登録します。

VS Code設定の`dart.mcpServer`設定で、Dart and Flutter MCP serverを明示的に有効化または無効化できます。

**グローバル設定**:

1. VS Codeで**View > Command Palette**をクリックし、**Preferences: Open User Settings (JSON)**を検索
2. 以下の設定を追加：

```json
"dart.mcpServer": true
```

**ワークスペース設定**:

1. VS Codeで**View > Command Palette**をクリックし、**Preferences: Open Workspace Settings (JSON)**を検索
2. 以下の設定を追加：

```json
"dart.mcpServer": true
```

詳細は、[VS CodeでのMCPサポート有効化ドキュメント](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_enable-mcp-support-in-vs-code)を参照してください。

### Cursor

CursorでDart and Flutter MCP serverを設定する最も簡単な方法は、**Add to Cursor**ボタンをクリックすることです。

または、手動で設定することもできます：

1. **Cursor > Settings > Cursor Settings > Tools & Integrations**に移動
2. 既に他のMCPサーバーが設定されているかどうかに応じて、**Add Custom MCP**または**New MCP Server**をクリック
3. ローカルプロジェクトの`.cursor/mcp.json`ファイル（このプロジェクトにのみ適用）またはホームディレクトリのグローバル`~/.cursor/mcp.json`ファイル（すべてのプロジェクトに適用）を編集して、Dart and Flutter MCP serverを設定：

```json
{
  "mcpServers": {
    "dart": {
      "command": "dart",
      "args": [
        "mcp-server"
      ]
    }
  }
}
```

詳細は、[CursorのMCPサーバーインストールドキュメント](https://docs.cursor.com/context/model-context-protocol#installing-mcp-servers)を参照してください。

## MCPクライアントの使用

Dart and Flutter MCP serverをクライアントで設定すると、サーバーはクライアントがプロジェクトのコンテキストについて推論するだけでなく、ツールを使用してアクションを実行できるようにします。

[大規模言語モデル（LLM）](https://developers.google.com/machine-learning/resources/intro-llms)がどのツールをいつ使用するかを決定するため、開発者は自然言語で目標を説明するだけで済みます。

### 例1: Flutterアプリのランタイムレイアウトエラーの修正

RenderFlex overflowエラーなどのレイアウトエラーが発生した場合、AIアシスタントに以下のようなプロンプトで助けを求めることができます：

> Check for and fix static and runtime analysis issues. Check for and fix any layout issues.

AIエージェントは、Dart and Flutter MCP serverのツールを使用して：

- **エラーの確認**: 実行中のアプリケーションから現在のランタイムエラーを取得するツールを使用
- **UIの検査**: オーバーフローを引き起こしているレイアウトを理解するためにFlutterウィジェットツリーにアクセス
- **修正の適用**: このコンテキストを基に修正を適用し、残りのエラーがないか再度確認

その後、コード変更を保持または元に戻すことができます。

### 例2: パッケージ検索による新機能の追加

アプリにチャートを追加する必要がある場合、どのパッケージを使用すべきか、どのように追加し、ボイラープレートを書くべきかを判断する必要があります。Dart and Flutter MCP serverは、以下のようなプロンプトでこのプロセス全体を効率化できます：

> Find a suitable package to add a line chart that maps the number of button presses over time.

AIエージェントは真のアシスタントとして機能します：

- **適切なツールの検索**: `pub_dev_search`ツールを使用して、人気で高評価のチャートライブラリを検索
- **依存関係の管理**: 選択（例：[`package:fl_chart`](https://pub.dev/packages/fl_chart)）を確認後、パッケージを依存関係として追加するツールを使用
- **コードの生成**: UIに配置するラインチャートのボイラープレートを含む新しいウィジェットコードを生成。プロセス中に導入された構文エラーも自己修正します

以前は、調査、ドキュメントの読み取り、`pubspec.yaml`の編集、アプリ内の適切なコードの記述という複数ステップのプロセスでしたが、今は単一のリクエストで完了します。

## まとめ

Dart and Flutter MCP serverは、DartとFlutter開発におけるAIアシスタントの能力を大幅に拡張する実験的なツールです。エラー分析、パッケージ検索、コード生成など、開発ワークフローを効率化する多くの機能を提供し、開発者が自然言語で目標を説明するだけで、AIアシスタントが適切なツールを使用してタスクを実行できるようにします。
