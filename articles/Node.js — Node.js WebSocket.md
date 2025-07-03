---
title: "Node.js — Node.js WebSocket"
source: "https://nodejs.org/en/learn/getting-started/websocket"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-03
description: "Node.js®は、開発者がサーバー、Webアプリ、コマンドラインツール、スクリプトを作成できる、無料のオープンソース、クロスプラットフォームのJavaScriptランタイム環境です。"
tags:
  - "clippings"
---
## Node.jsにおけるネイティブWebSocketクライアント

## はじめに

[Node.js v21](https://github.com/nodejs/node/blob/47a59bde2aadb3ad1b377c0ef12df7abc28840e9/doc/changelogs/CHANGELOG_V21.md#L1329-L1345)以降、[WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)は[Undici](https://undici.nodejs.org/)ライブラリを使用して強化され、組み込みのWebSocketクライアントが導入されました。これにより、Node.jsアプリケーションのリアルタイム通信が簡素化されます。リリースでは、WebSocket APIは安定版としてマークされ、本番環境での使用準備が整ったことを示しています。

## WebSocketとは

[WebSocket](https://en.wikipedia.org/wiki/WebSocket)は、単一のTCP接続を介して同時に双方向通信を可能にする標準化された通信プロトコルです。HTTPとは異なる全二重または双方向の機能を備えています。WebSocketは、HTTPのUpgradeヘッダーを使用してプロトコルを移行することで、HTTPとの互換性を実現します。これにより、サーバーは最初の要求なしにクライアントにコンテンツをプッシュでき、開いた接続を維持して継続的なメッセージ交換を行うため、HTTPポーリングなどの代替手段よりもオーバーヘッドが少なく、リアルタイムのデータ転送に最適です。WebSocket通信は通常、TCPポート443（セキュア）または80（非セキュア）を介して行われ、Web以外の接続に対するファイアウォールの制限を回避するのに役立ちます。このプロトコルは、暗号化されていない接続と暗号化された接続のために独自のURIスキーム（ws://およびwss://）を定義しており、すべての主要なブラウザでサポートされています。

## ネイティブWebSocketクライアント

Node.jsは、クライアント接続のために[ws](https://www.npmjs.com/package/ws)や[socket.io](https://www.npmjs.com/package/socket.io)のような外部ライブラリに依存することなく、WebSocket `クライアント`として機能できるようになりました。これにより、Node.jsアプリケーションは発信WebSocket接続を直接開始および管理でき、リアルタイムデータフィードへの接続や他のWebSocketサーバーとの対話などのタスクを効率化できます。ユーザーは標準の[new WebSocket()](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)コンストラクタを使用してWebSocketクライアント接続を作成できるようになりました。

上記を基に、基本的なユースケースを示す新しいWebSocketクライアント機能を示す、より実践的な例を追加しましょう。

### 基本的な接続とメッセージ処理

```javascript
// 指定されたURLへの新しいWebSocket接続を作成します。
const socket = new WebSocket('ws://localhost:8080');

// 接続が正常に確立されたときに実行されます。
socket.addEventListener('open', event => {
  console.log('WebSocket接続が確立されました！');
  // WebSocketサーバーにメッセージを送信します。
  socket.send('こんにちは、サーバー！');
});

// メッセージをリッスンし、サーバーからメッセージを受信したときに実行されます。
socket.addEventListener('message', event => {
  console.log('サーバーからのメッセージ: ', event.data);
});

// 接続が閉じられたときに実行され、クローズコードと理由を提供します。
socket.addEventListener('close', event => {
  console.log('WebSocket接続が閉じられました:', event.code, event.reason);
});

// WebSocket通信中にエラーが発生した場合に実行されます。
socket.addEventListener('error', error => {
  console.error('WebSocketエラー:', error);
});
```

### JSONデータの送受信

```javascript
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
  const data = { type: 'message', content: 'Node.jsからのこんにちは！' };
  socket.send(JSON.stringify(data));
});

socket.addEventListener('message', event => {
  try {
    const receivedData = JSON.parse(event.data);
    console.log('受信したJSON:', receivedData);
  } catch (error) {
    console.error('JSONの解析エラー:', error);
    console.log('受信データ:', event.data);
  }
});
```

上記の`json`コードは、WebSocketアプリケーションで一般的な[JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON)データの送受信を示しています。送信前にJavaScriptオブジェクトをJSON文字列に変換するために[JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)を使用します。そして、受信した文字列を[JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)でJavaScriptオブジェクトに戻します。最後に、JSON解析のエラー処理が含まれています。

これにより、依存関係の管理が軽減され、互換性が向上します。開発者は、追加のWebSocketクライアントライブラリをインストールして維持する必要がなくなります。組み込みの実装は最新のWeb標準に準拠しており、より優れた相互運用性を保証します。この機能強化は、WebSocket通信のクライアント側に焦点を当てており、Node.jsがWebSocketクライアントとして機能できるようにします。

## 理解すべき重要な点

Node.js v22は、組み込みのネイティブWebSocketサーバー実装を提供**していません**。Webブラウザや他のクライアントからの着信接続を受け入れるWebSocketサーバーを作成するには、依然として[ws](https://www.npmjs.com/package/ws)や[socket.io](https://www.npmjs.com/package/socket.io)などのライブラリを使用する必要があります。これは、Node.jsがWebSocketサーバーに簡単に**接続**できるようになった一方で、WebSocketサーバーに**なる**ためには依然として外部ツールが必要であることを意味します。

## まとめ

Node.js v22は、アプリケーションが`クライアント`としてWebSocketサーバーとシームレスに対話できるようにしますが、Node.js内でのWebSocketサーバーの作成は、確立されたライブラリに依存したままです。この違いは、開発者がNode.jsプロジェクトでリアルタイム通信を実装する際に理解することが重要です。

[前へ Fetching data with Node.js](https://nodejs.org/en/learn/getting-started/fetch) [次へ Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
