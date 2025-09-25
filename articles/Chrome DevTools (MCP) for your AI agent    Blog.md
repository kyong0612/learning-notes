---
title: "Chrome DevTools (MCP) for your AI agent  |  Blog"
source: "https://developer.chrome.com/blog/chrome-devtools-mcp"
author:
  - "[[Chrome for Developers]]"
published:
created: 2025-09-25
description: "新しいChrome DevTools MCPサーバーのパブリックプレビュー。Chrome DevToolsのパワーをAIコーディングアシスタントにもたらします。"
tags:
  - "clippings"
---

- developer.chrome.comは、サービスの提供と品質向上、およびトラフィックの分析のためにクッキーを使用しています。同意した場合、クッキーは広告の配信や、表示されるコンテンツと広告のパーソナライズにも使用されます。[詳細はこちら](https://policies.google.com/technologies/cookies?hl=en)。

- 本日、新しいChrome DevTools Model Context Protocol (MCP) サーバーのパブリックプレビューを開始します。これにより、Chrome DevToolsのパワーをAIコーディングアシスタントにもたらします。

- コーディングエージェントは基本的な問題を抱えています。それは、生成したコードがブラウザで実行されたときに実際に何をするかを見ることができないという点です。彼らは事実上、目隠しをしてプログラミングをしています。

- Chrome DevTools MCPサーバーはこれを変えます。AIコーディングアシスタントは、Chromeで直接ウェブページをデバッグできるようになり、DevToolsのデバッグ機能とパフォーマンスインサイトの恩恵を受けることができます。これにより、問題の特定と修正の精度が向上します。

- どのように機能するかを自身でご覧ください：<video controls="" width="3840" height="2160"><source src="https://developer.chrome.com/static/blog/chrome-devtools-mcp/video/cdt-mcp-demo.mp4" type="video/mp4"></video>

- **Model Context Protocol (MCP)とは何か？**
  - [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol)は、大規模言語モデル（LLM）を外部ツールやデータソースに接続するためのオープンソース標準です。Chrome DevTools MCPサーバーは、AIエージェントにデバッグ機能を追加します。
  - 例えば、Chrome DevTools MCPサーバーは`performance_start_trace`というツールを提供します。ウェブサイトのパフォーマンス調査を指示されたLLMは、このツールを使ってChromeを起動し、あなたのウェブサイトを開き、Chrome DevToolsを使ってパフォーマンストレースを記録できます。その後、LLMはそのパフォーマンストレースを分析して、改善の可能性を提案できます。MCPプロトコルを使用することで、Chrome DevTools MCPサーバーはコーディングエージェントに新しいデバッグ機能をもたらし、ウェブサイト構築の能力を向上させます。
  - MCPの仕組みについてさらに詳しく知りたい場合は、[MCPドキュメント](https://modelcontextprotocol.io/docs/getting-started/intro)をご覧ください。

- **何に使えるか？**
  - 以下は、Gemini CLIのようにお好みのAIアシスタントで試すことができるプロンプトの例です。
  - **リアルタイムでコードの変更を検証**
    - AIエージェントで修正を生成し、その解決策が意図通りに機能するかをChrome DevTools MCPで自動的に検証します。
    - 試してみるプロンプト：

            ```
            Verify in the browser that your change works as expected.
            ```

  - **ネットワークとコンソールのエラーを診断**
    - エージェントがネットワークリクエストを分析してCORSの問題を発見したり、コンソールログを検査して機能が期待通りに動作しない理由を理解したりできるようにします。
    - 試してみるプロンプト：

            ```
            A few images on localhost:8080 are not loading. What's happening?
            ```

  - **ユーザーの行動をシミュレート**
    - ナビゲート、フォーム入力、ボタンクリックを行い、バグを再現し、複雑なユーザーフローをテストします。これらすべてをランタイム環境を検査しながら行います。
    - 試してみるプロンプト：

            ```
            Why does submitting the form fail after entering an email address?
            ```

  - **ライブのスタイリングとレイアウトの問題をデバッグ**
    - AIエージェントにライブページに接続し、DOMとCSSを検査し、ブラウザからのライブデータに基づいてオーバーフローする要素のような複雑なレイアウト問題を修正するための具体的な提案を得るように依頼します。
    - 試してみるプロンプト：

            ```
            The page on localhost:8080 looks strange and off. Check what's happening there.
            ```

  - **パフォーマンス監査を自動化**
    - AIエージェントにパフォーマンストレースを実行し、結果を分析し、高いLCP数値のような特定のパフォーマンス問題を調査するように指示します。
    - 試してみるプロンプト：

            ```
            Localhost:8080 is loading slowly. Make it load faster.
            ```

  - 利用可能なすべてのツールのリストについては、[ツールリファレンスドキュメント](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)を参照してください。

- **始め方**
  - これを試すには、MCPクライアントに以下の設定エントリを追加してください：

        ```
        {
          "mcpServers": {
            "chrome-devtools": {
              "command": "npx",
              "args": ["chrome-devtools-mcp@latest"]
            }
          }
        }
        ```

  - 動作確認のために、コーディングエージェントで以下のプロンプトを実行してください：

        ```
        Please check the LCP of web.dev.
        ```

  - 詳細については、GitHubの[Chrome DevTools MCPドキュメント](https://github.com/ChromeDevTools/chrome-devtools-mcp/?tab=readme-ov-file#chrome-devtools-mcp)をご覧ください。

- **参加方法**
  - 私たちはChrome DevTools MCPを段階的に構築しており、本日リリースするパブリックプレビュー版から始めています。次にどの機能を追加すべきかについて、あなたやコミュニティからのフィードバックを積極的に求めています。AIコーディングアシスタントを使用する開発者であれ、次世代のAI開発ツールを構築するベンダーであれ、[あなたの洞察は非常に貴重です](https://github.com/ChromeDevTools/chrome-devtools-mcp/discussions)。何かが欠けているか、うまく機能しない場合は、[GitHubでイシューを報告してください](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/new/choose)。

- 別途記載がない限り、このページの内容は[Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/)の下でライセンスされており、コードサンプルは[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)の下でライセンスされています。詳細は[Google Developers Site Policies](https://developers.google.com/site-policies)をご覧ください。JavaはOracleおよび/またはその関連会社の登録商標です。

- 最終更新 2025-09-23 UTC.
