---
title: "Node.js のコンパイルキャッシュで Cloud Run のコールドスタートを速くする"
source: "https://zenn.dev/bitkey_dev/articles/nodejs-compile-cache"
author:
  - "[[Siketyan]]"
  - "[[Bitkey Developers]]"
published: 2025-12-09
created: 2025-12-10
description: "Node.js v22.1.0で追加されたコンパイルキャッシュ機能を活用し、Cloud Runのコールドスタート時間を約40秒から15秒まで短縮する方法を、Dockerfileの具体的な実装例と共に解説"
tags:
  - "clippings"
  - "nodejs"
  - "cloudrun"
  - "gcp"
  - "v8"
  - "typescript"
  - "serverless"
  - "performance"
---

## 概要

この記事は、ビットキーのTypeScriptバックエンドにおいて、**Node.js のコンパイルキャッシュ機能**を利用してCloud Runのコールドスタート時間を大幅に短縮した事例を紹介しています。

## Cloud Run の特性とコールドスタートの問題

Cloud Runは、HTTP(S)リクエストを受け付けるアプリケーションをデプロイするためのフルマネージドプラットフォームです。

**主な特徴:**

- トラヒックの需要に応じて自動スケーリング（スケールアウト/スケールイン）
- 最大同時リクエスト数やCPU使用率に基づいてインスタンス数を調整

**コールドスタートの問題:**

- スパイクトラヒック発生時、新規インスタンスの起動が必要
- サーバがリクエストを受け付けられるまでユーザーは待機が必要
- **起動時間が長いとユーザー体験に直接影響**

> AWS Lambdaなど他のFaaSでも同様の問題が発生する

## Node.js のモジュールライフサイクル

Node.jsはファイルをモジュールとして読み込んで実行します（ESM前提）。

**モジュールのライフサイクル:**

1. **parse**: テキストファイルを読み取り、モジュールとして解釈
2. **link**: インポート・エクスポートによる依存関係を解決
3. **evaluate**: モジュール内のコードを実行

**問題点:**

- これらの処理はすべて**実行時（ランタイム）に処理**される
- 特にparseとlinkは起動時のオーバヘッドとなる

## Node.js コンパイルキャッシュの仕組み

**Node.js v22.1.0**で追加された機能で、以下の特徴があります：

- モジュールを**実行可能な状態までコンパイルした状態をキャッシュ**
- ディスク上に永続化
- 2回目以降は**AOT（Ahead-of-Time）コンパイル**した状態のコードを実行可能

**参考リンク:**

- [Node.js Module Compile Cache Documentation](https://nodejs.org/docs/latest-v24.x/api/module.html#module-compile-cache)
- [V8 Code Caching for Devs](https://v8.dev/blog/code-caching-for-devs)

## コンパイルキャッシュの使い方

### 方法1: 環境変数で有効化

```bash
NODE_COMPILE_CACHE=/path/to/cache
```

### 方法2: コードで有効化

```javascript
import { enableCompileCache, flushCompileCache, getCompileCacheDir } from "node:module";

// コンパイルキャッシュを有効化
enableCompileCache(/* オプション: 永続先のパスを指定 */);

// キャッシュをディスクに書き込む (デフォルトでは Node.js の終了時に書き込む)
flushCompileCache();

// 環境変数または enableCompileCache() で指定された永続先のパスを取得
getCompileCacheDir();
```

## OCI イメージへの適用（実装例）

ビルド時にキャッシュを生成し、ランタイムで利用する方法。

### Dockerfile

```dockerfile
# syntax=docker/dockerfile:1
FROM --platform="${BUILDPLATFORM}" node:24.11.1-bookworm-slim AS builder

ENV PNPM_HOME="/root/.pnpm"

WORKDIR /src

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm/store \
    pnpm fetch

COPY . .

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm/store \
    pnpm install --frozen-lockfile --offline

RUN pnpm run build

RUN pnpm prune --prod --ignore-scripts

# -----------------------------
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS run-admin-api

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app .

# コンパイルキャッシュを有効化
ENV NODE_COMPILE_CACHE=".nodejs_compile_cache" \
    NODE_OPTIONS="--enable-source-maps"

# コンパイルキャッシュを生成する
RUN ["/nodejs/bin/node", "./warmup.js"]

ENTRYPOINT ["/nodejs/bin/node", "./main.js"]
```

### warmup.js

```javascript
import { enableCompileCache, flushCompileCache } from "node:module";

// コンパイルキャッシュを有効化
enableCompileCache();

// エントリポイントを読み込む
await import("./main.js");

// キャッシュを永続化
flushCompileCache();
```

## 注意点

1. **Node.js の起動オプションがキャッシュキーに含まれる**
   - `NODE_OPTIONS`はCloud Runサービスの設定ではなく、ビルドタイムで指定

2. **マルチステージビルドの場合**
   - キャッシュの生成は**最終ステージ**で行う
   - コードの配置パスに依存するため
   - Node.jsのバージョンが異なるとキャッシュが効かない

## 結果

![起動レイテンシの改善グラフ](https://res.cloudinary.com/zenn/image/fetch/s--Bt9Kx-3N--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/90ded958a9b3924e486b45aa.png%3Fsha%3D11191173c5b79a64e89027347f3305a7220ca151)

| 項目 | 改善前 | 改善後 |
|------|--------|--------|
| 起動レイテンシ | 約30〜40秒 | **約15秒** |

**起動時間が約50〜60%短縮**されました。

## まとめ

- Cloud RunやAWS Lambdaのようなサーバレスサービスでは、コールドスタートへの対処が重要
- Node.js v22.1.0以降のコンパイルキャッシュ機能を活用することで、スクリプト言語でも起動時間を最適化可能
- ビルド時にwarmupスクリプトを実行してキャッシュを事前生成する方法が効果的

## 関連リンク

- [Node.js ESM Documentation](https://nodejs.org/docs/latest-v24.x/api/esm.html)
- [Cloud Run（Google Cloud）](https://cloud.google.com/run?hl=ja)
