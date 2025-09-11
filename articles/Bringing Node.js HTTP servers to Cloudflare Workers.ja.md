---
title: "Cloudflare WorkersへのNode.js HTTPサーバーの導入（和訳）"
source: "https://blog.cloudflare.com/bringing-node-js-http-servers-to-cloudflare-workers/"
author:
  - "[[Yagiz Nizipli]]"
  - "[[James M Snell]]"
  - "[[Deanna Lam]]"
  - "[[Diretnan Domnan]]"
  - "[[Michelle Chen]]"
  - "[[Nikhil Kothari]]"
  - "[[Kate Reznykova]]"
  - "[[Sunil Pai]]"
published: 2025-09-08
created: 2025-09-11
description: "Cloudflare Workersにnode:httpクライアントおよびサーバーAPIを実装し、開発者が既存のNode.jsアプリケーションを最小限のコード変更で移行できるようにしました。この記事では、Workersのサーバーレス環境とNode.jsの従来のHTTPモデルとの間にどのようにして橋渡しを構築したかを、Express.jsのようなフレームワークをエッジで実行する例とともに説明します。"
tags:
  - "clippings"
  - "translation"
---

## Cloudflare WorkersへのNode.js HTTPサーバーの導入

### 概要

- Cloudflare Workersで`node:http`クライアントおよびサーバーAPIのサポートが追加されました。
- これにより、既存のExpress.jsやKoaなどのNode.jsアプリケーションをCloudflareのグローバルネットワーク上で実行可能になります。
- 主な利点：
  - ゼロコールドスタート
  - 自動スケーリング
  - ユーザーへの大幅な遅延削減
- コードベースを書き換えることなく、既存の開発パターンやフレームワークを維持しながらWorkersのグローバルネットワークを活用できます。

### 課題：サーバーレス環境におけるNode.jsスタイルのHTTP

- Cloudflare Workersは、直接的なTCP接続が利用できない独自のサーバーレス環境で動作します。
- ネットワーキング操作は、Workersランタイム外部の専門サービス（例：Open Egress Router (OER)、Pingora）によって完全に管理されます。
- この管理されたアプローチにより、開発者はTLSネゴシエーション、接続管理、ネットワーク最適化などを気にする必要がありません。
- この基本的な違いから、既存のNode.jsコードパターンとの互換性を維持しつつ、エッジでのHTTP APIの動作方法を再考する必要がありました。
- **解決策**: Workersが得意とするウェブ標準技術の上に、コアとなる`node:http` APIを実装しました。

### HTTPクライアントAPI

- `node:http`クライアント実装には、使い慣れた以下のAPIが含まれます。
  - `http.get()`: シンプルなGETリクエスト用
  - `http.request()`: HTTPリクエストを完全に制御するため
- これらのAPIは、Workersがネイティブで使用する標準の`fetch()` API上に構築されており、Node.jsとの互換性を維持しつつ優れたパフォーマンスを提供します。

#### サポートされている機能

- 標準的なHTTPメソッド（GET, POST, PUT, DELETEなど）
- リクエストおよびレスポンスヘッダー
- リクエストおよびレスポンスボディ
- ストリーミングレスポンス
- 基本認証

#### 現在の制限事項

- `Agent` APIは提供されていますが、何もしない（no-op）として動作します。
- トレーラー、アーリーヒント、1xxレスポンスはサポートされていません。
- TLS固有のオプションはサポートされていません（WorkersがTLSを自動的に処理するため）。

### HTTPサーバーAPI

- サーバーサイドの実装では、Node.jsスタイルのサーバーをWorkersのリクエスト処理モデルに接続するブリッジシステムを構築しました。
- `listen(port)`を呼び出すと、TCPソケットを開く代わりに、サーバーがWorker内の内部テーブルに登録されます。

#### 1. `handleAsNodeRequest`による手動統合

- このアプローチにより、Node.js HTTPサーバーを他のWorkers機能（KV, Durable Objects, R2など）と柔軟に統合できます。
- `fetch`, `scheduled`, `queue`など、デフォルトのエントリーポイントに複数のハンドラを持つことができます。
- **最適なケース**:
  - 他のWorkers機能と統合する必要がある場合
  - 一部のルートを異なる方法で処理し、他をNode.jsサーバーに委任する場合
  - カスタムミドルウェアやリクエスト処理を適用する場合

#### 2. `httpServerHandler`による自動統合

- 追加機能や複雑さなしにNode.js HTTPサーバーを統合したい場合に適しています。
- この関数が自動的に統合を処理します。
- Workers固有の機能を必要としないアプリケーションに最適です。

### Express.js, Koa.jsとフレームワークの互換性

- これらのHTTP APIにより、Express.jsのような人気のNode.jsフレームワークをWorkersで実行できます。
- フレームワークのミドルウェアが期待通りに動作しない場合は、Cloudflare Workersリポジトリに[issueを開く](https://github.com/cloudflare/workerd/issues)ことが推奨されています。
- Express.jsに加えて、Koa.jsもサポートされています。

### サーバーレスNode.jsアプリケーションの始め方

- `node:http`および`node:https` APIは、`nodejs_compat`互換性フラグを有効にし、互換性の日付を`2025-08-15`以降に設定することで利用可能です。
- この追加により、Cloudflare WorkersをエッジでJavaScriptを実行するための最適なプラットフォームにするという目標に一歩近づきました。
