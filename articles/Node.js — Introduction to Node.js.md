---
title: "Node.js — Node.js入門"
source: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs#introduction-to-nodejs"
author:
  - "[[@nodejs]]"
published:
created: 2025-06-22
description: "Node.js®は、無料でオープンソースのクロスプラットフォームなJavaScriptランタイム環境であり、開発者はサーバー、Webアプリ、コマンドラインツール、スクリプトを作成できます。"
tags:
  - "clippings"
  - "nodejs"
---
## Node.js入門

Node.jsは、オープンソースでクロスプラットフォームのJavaScriptランタイム環境です。ほぼあらゆる種類のプロジェクトで人気のツールです。

Node.jsは、Google Chromeの中核であるV8 JavaScriptエンジンをブラウザの外部で実行します。これにより、Node.jsは非常に高いパフォーマンスを発揮できます。

Node.jsアプリは、リクエストごとに新しいスレッドを作成することなく、単一のプロセスで実行されます。Node.jsは、標準ライブラリで非同期I/Oプリミティブのセットを提供しており、これによりJavaScriptコードがブロックされるのを防ぎます。一般的に、Node.jsのライブラリはノンブロッキングパラダイムを使用して記述されているため、ブロッキング動作は標準ではなく例外となります。

Node.jsがネットワークからの読み取り、データベースやファイルシステムへのアクセスなどのI/O操作を実行する場合、スレッドをブロックしてCPUサイクルを無駄に待機する代わりに、レスポンスが返ってきたときに操作を再開します。

これにより、Node.jsは、スレッドの同時実行性を管理する負担を増やすことなく、単一のサーバーで数千の同時接続を処理できます。これは、バグの重大な原因となる可能性があります。

Node.jsには独自の利点があります。なぜなら、ブラウザ向けにJavaScriptを記述する何百万人ものフロントエンド開発者が、まったく異なる言語を学ぶ必要なく、クライアントサイドのコードに加えてサーバーサイドのコードも記述できるようになったからです。

Node.jsでは、すべてのユーザーがブラウザを更新するのを待つ必要がないため、新しいECMAScript標準を問題なく使用できます。Node.jsのバージョンを変更することで、使用するECMAScriptバージョンを決定する責任があり、フラグを付けてNode.jsを実行することで、特定の実験的機能を有効にすることもできます。

## Node.jsアプリケーションの例

Node.jsの最も一般的なHello Worldの例はWebサーバーです。

このスニペットを実行するには、`server.js`ファイルとして保存し、ターミナルで`node server.js`を実行します。mjsバージョンのコードを使用する場合は、`server.mjs`ファイルとして保存し、ターミナルで`node server.mjs`を実行する必要があります。

このコードは、まずNode.jsの[`http`モジュール](https://nodejs.org/api/http.html)をインクルードします。

Node.jsには、ネットワーキングの第一級サポートを含む、素晴らしい[標準ライブラリ](https://nodejs.org/api/)があります。

`http`の`createServer()`メソッドは、新しいHTTPサーバーを作成して返します。

サーバーは、指定されたポートとホスト名でリッスンするように設定されます。サーバーの準備が整うと、コールバック関数が呼び出され、この場合はサーバーが実行中であることが通知されます。

新しいリクエストを受信するたびに、[`request`イベント](https://nodejs.org/api/http.html#http_event_request)が呼び出され、2つのオブジェクトが提供されます。リクエスト（[`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)オブジェクト）とレスポンス（[`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)オブジェクト）です。

これら2つのオブジェクトは、HTTPコールを処理するために不可欠です。

1つ目はリクエストの詳細を提供します。この簡単な例では使用されていませんが、リクエストヘッダーやリクエストデータにアクセスできます。

2つ目は、呼び出し元にデータを返すために使用されます。

この場合：

```js
res.statusCode = 200;
```

`statusCode`プロパティを`200`に設定して、成功したレスポンスを示します。

`Content-Type`ヘッダーを設定します。

そして、レスポンスを閉じ、`end()`の引数としてコンテンツを追加します。

```js
res.end('Hello World\n');
```

まだ行っていない場合は、Node.jsを[ダウンロード](https://nodejs.org/en/download)してください。

[Next: Node.jsを使用するために、どのくらいのJavaScriptを知っておく必要がありますか？](https://nodejs.org/en/learn/getting-started/how-much-javascript-do-you-need-to-know-to-use-nodejs)
