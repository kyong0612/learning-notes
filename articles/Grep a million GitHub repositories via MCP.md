---
title: "MCP経由で100万のGitHubリポジトリをGrep"
source: "https://vercel.com/blog/grep-a-million-github-repositories-via-mcp"
author:
  - "[[Dan Fox]]"
  - "[[Andrew Qu]]"
published: 2025-07-18
created: 2025-07-22
description: "GrepのMCPサーバーを利用して、AIエージェントから100万以上のGitHubリポジトリを検索できます。エージェントはオープンソースプロジェクトで使われているコーディングパターンや解決策を参照して問題を解決できるようになります。"
tags:
  - "clippings"
  - "translation"
---
[ブログ](https://vercel.com/blog)

Dan Fox ソフトウェアエンジニア

[

Andrew Qu Vercel CTO室

](<https://twitter.com/andrewqu>_)

2分で読めます

[Grep](https://vercel.com/blog/vercel-acquires-grep)は、[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)をサポートし、AIアプリが標準的なインターフェースを使って100万の公開GitHubリポジトリをクエリできるようになりました。Cursorでのビルド、Claudeの使用、独自エージェントの統合など、どのような場合でも、GrepはHTTP経由で検索可能なコードインデックスとして機能します。

MCPは、大規模言語モデル（LLM）にツールを公開するためのプロトコルです。Grepの新しいMCPサーバーは、公開GitHubリポジトリを検索するエンドポイントを提供します。Grep MCPサーバーを通じて、AIエージェントは検索クエリを発行し、言語、リポジトリ、ファイルパスでフィルタリングされた特定のパターンや正規表現に一致するコードスニペットを取得できます。

これはgrep.appと同じインフラストラクチャに支えられています。結果は通常、ほんの数分の1秒で返され、スニペットは関連性でランク付けされます。

MCPサーバーのセットアップは一般的に簡単です。クライアントがMCPエンドポイントを認識すると、利用可能なツールをイントロスペクトし、直接呼び出すことができます。各ツールは機械可読なスキーマで定義されており、これによりエージェントやアプリの統合が予測可能になります。

AIクライアントをGrepのMCPサーバーに接続するには、以下の設定を使用します。

```json
{
  "mcpServers": {
    "grep": {
      "url": "https://mcp.grep.app"
    }
  }
}
```

```bash
claude mcp add --transport http grep https://mcp.grep.app
```

あなたが独自のMCPサーバーを作成しているとしましょう。実装中に、エラーが発生し、それをクライアントに伝えたいケースを処理する必要があります。その正しい方法がわからない場合、AIエージェントに尋ねることができます。

`このMCPツールがクライアントにエラーメッセージを返す正しい方法は何ですか？`

Grep MCPサーバーを設定している場合、エージェントは質問に答えるためにコード検索を実行することを決定するかもしれません。いくつかの異なるクエリを試し、最終的に`catch`ブロックを含む`server.tool`関数呼び出しを探すこのクエリにたどり着くかもしれません。

```json
{
 "query": "(?s)server\\.tool.*catch",
 "language": [
  "TypeScript",
  "JavaScript"
 ],
 "useRegexp": true
}
```

Grep MCPサーバーは結果のリストを返します。このようになります：

この特定の結果は答えを示唆しています：MCPツール呼び出しからエラーレスポンスを返すときは、`isError: true`を設定する必要があります。

答えを確認するために、LLMは別のクエリを実行します。

```json
{
 "query": "isError: true",
 "language": [
  "TypeScript",
  "JavaScript"
 ]
}
```

そのクエリは、MCPサーバーがエラーレスポンスを返す方法の他の例を提供します。

これらの検索結果に基づいて、AIエージェントは答えを返し、プロジェクトを更新してエラーを適切に処理することを提案できます。

私たちはGrepのMCPサーバーを半日で構築しました。[`mcp-handler`](https://vercel.com/changelog/mcp-server-support-on-vercel)パッケージを使用して、Grepの既存のAPIを完全に準拠したMCPサーバーに変えました。アダプターはスキーマ、リクエストルーティング、レスポンスフォーマットを処理するため、必要な作業は検索エンドポイントをMCPコントラクトにマッピングすることだけでした。

既存のツールやAPIをAIクライアントに公開する場合、VercelのMCPアダプターは定型的なコードを抽象化し、Vercelでの開発とデプロイを簡素化します。

今すぐ[Grep](https://grep.app/)またはGrepのMCPサーバーをお試しください。
