---
title: "Node.js — Node.js Fetch"
source: "https://nodejs.org/en/learn/getting-started/fetch"
author:
  - "[[@nodejs]]"
published:
created: 2025-07-02
description: "Node.js® は、開発者がサーバー、Web アプリ、コマンドラインツール、スクリプトを作成できる、無料でオープンソースのクロスプラットフォーム JavaScript ランタイム環境です。"
tags:
  - "clippings"
---
## Node.js で Undici を使用して Fetch API を利用する

## はじめに

[Undici](https://undici.nodejs.org/) は、Node.js の fetch API を強化する HTTP クライアントライブラリです。これはゼロから書かれており、Node.js の組み込み HTTP クライアントには依存していません。高性能アプリケーションに適した多くの機能が含まれています。

Undici の仕様準拠に関する情報については、[Undici のドキュメント](https://undici.nodejs.org/#/?id=specification-compliance-1) を参照してください。

## 基本的な GET の使用法

```js
async function main() {

  // ブラウザの fetch API と同様に、デフォルトのメソッドは GET です

  const response = await fetch('https://jsonplaceholder.typicode.com/posts');

  const data = await response.json();

  console.log(data);

  // 以下のようなものが返されます:

  //   {

  //   userId: 1,

  //   id: 1,

  //   title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',

  //   body: 'quia et suscipit\n' +

  //     'suscipit recusandae consequuntur expedita et cum\n' +

  //     'reprehenderit molestiae ut ut quas totam\n' +

  //     'nostrum rerum est autem sunt rem eveniet architecto'

  // }

}

main().catch(console.error);
```

## 基本的な POST の使用法

## Undici を使用した Fetch API のカスタマイズ

Undici を使用すると、`fetch` 関数にオプションを提供することで Fetch API をカスタマイズできます。たとえば、カスタムヘッダーの設定、リクエストメソッドの設定、リクエストボディの設定が可能です。以下は、Undici を使用して Fetch API をカスタマイズする方法の例です。

[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 関数は、フェッチする URL とオプションオブジェクトの 2 つの引数を取ります。オプションオブジェクトは、リクエストをカスタマイズするために使用できる [Request](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-requestoptions) オブジェクトです。この関数は、[Response](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-responsedata) オブジェクトに解決される [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) を返します。

次の例では、JSON ペイロードを使用して Ollama API に POST リクエストを送信しています。Ollama は、ローカルマシンで LLM（大規模言語モデル）を実行できる CLI ツールです。[こちら](https://ollama.com/download) からダウンロードできます。

```bash
ollama run mistral
```

これにより、`mistral` モデルがダウンロードされ、ローカルマシンで実行されます。

プールを使用すると、同じサーバーへの接続を再利用できるため、パフォーマンスが向上します。以下は、Undici でプールを使用する方法の例です。

```js
import { Pool } from 'undici';

const ollamaPool = new Pool('http://localhost:11434', {

  connections: 10,

});

/**

 * Ollama API を使用してプロンプトの補完をストリーミングします。

 * @param {string} prompt - 補完するプロンプト。

 * @link https://github.com/ollama/ollama/blob/main/docs/api.md

 **/

async function streamOllamaCompletion(prompt) {

  const { statusCode, body } = await ollamaPool.request({

    path: '/api/generate',

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify({ prompt, model: 'mistral' }),

  });

  // HTTP ステータスコードについてはこちらを参照してください: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

  // 200 はリクエストが成功したことを意味します。

  if (statusCode !== 200) {

    throw new Error(`Ollama request failed with status ${statusCode}`);

  }

  let partial = '';

  const decoder = new TextDecoder();

  for await (const chunk of body) {

    partial += decoder.decode(chunk, { stream: true });

    console.log(partial);

  }

  console.log('Streaming complete.');

}

try {

  await streamOllamaCompletion('What is recursion?');

} catch (error) {

  console.error('Error calling Ollama:', error);

} finally {

  console.log('Closing Ollama pool.');

  ollamaPool.close();

}
```

## Undici を使用したレスポンスのストリーミング

[Streams](https://nodejs.org/docs/v22.14.0/api/stream.html#stream) は、データのチャンクを読み書きできる Node.js の機能です。

```js
import { Writable } from 'stream';

import { stream } from 'undici';

async function fetchGitHubRepos() {

  const url = 'https://api.github.com/users/nodejs/repos';

  const { statusCode } = await stream(

    url,

    {

      method: 'GET',

      headers: {

        'User-Agent': 'undici-stream-example',

        Accept: 'application/json',

      },

    },

    () => {

      let buffer = '';

      return new Writable({

        write(chunk, encoding, callback) {

          buffer += chunk.toString();

          try {

            const json = JSON.parse(buffer);

            console.log(

              'Repository Names:',

              json.map(repo => repo.name)

            );

            buffer = '';

          } catch (error) {

            console.error('Error parsing JSON:', error);

          }

          callback();

        },

        final(callback) {

          console.log('Stream processing completed.');

          callback();

        },

      });

    }

  );

  console.log(`Response status: ${statusCode}`);

}

fetchGitHubRepos().catch(console.error);
```

[Prev Profiling Node.js Applications](https://nodejs.org/en/learn/getting-started/profiling) [Next WebSocket client with Node.js](https://nodejs.org/en/learn/getting-started/websocket)
