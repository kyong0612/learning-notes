---
title: "Clerk × Hono で実現するシンプルで安全なバックエンド認証"
source: "https://zenn.dev/scc_tec_pub/articles/auth-clerk-hono"
author:
  - "SCC-TEC"
  - "株式会社SCC - テクノロジーセンター"
published: 2025-09-08
created: 2025-12-13
description: |
  ClerkとHonoを使用してNext.jsアプリケーションにバックエンドAPI認証を実装する方法を解説。従来の複雑なセキュリティ対策を、わずか数十行のコードで安全かつ機能的に構築する手法と、Hono RPCによる型安全なAPI通信について紹介。
tags:
  - "Clerk"
  - "Hono"
  - "認証"
  - "Next.js"
  - "TypeScript"
  - "バックエンドAPI"
  - "Hono RPC"
---

## 概要

本記事は、ClerkとHonoを使用してバックエンドAPI認証を実装する方法を解説するチュートリアル記事である。フロントエンド認証に比べてより強固なセキュリティが求められるバックエンドにおいて、Clerkを活用することで素早く安全な認証システムを構築できることを示している。

**シリーズ構成:**

1. [Clerk で爆速認証実装 - Next.js アプリに 10 分で認証機能を追加する](https://zenn.dev/scc_tec/articles/auth-clerk-next)
2. **Clerk × Hono で実現するシンプルで安全なバックエンド認証**（本記事）
3. [Clerk の Webhook でアプリケーションと同期を取る](https://zenn.dev/scc_tec/articles/auth-clerk-webhook)

---

## 実行環境

| 項目 | バージョン |
|------|-----------|
| OS | Ubuntu 22.04.5 LTS (WSL2) |
| Node.js | v22.16.0 |
| pnpm | 10.12.2 |
| Next.js | 15.3.5 |
| React | ^19.0.0 |
| @clerk/nextjs | ^6.27.1 |
| @clerk/backend | ^2.10.1 |
| @hono/clerk-auth | ^3.0.3 |

---

## なぜ Hono なのか

バックエンドAPIフレームワークには Express.js、Fastify、Next.js API Routes など多くの選択肢がある中で、Honoを選定した理由：

### 1. Next.jsとの親和性

- Honoのvercelアダプタを使用することで、Next.js API Routesとしても動作
- 既存のNext.jsプロジェクトに簡単に組み込み可能

### 2. Hono RPCによる型安全なAPI通信

- フロントエンドからバックエンドへの通信を型安全に実行可能
- APIの型定義をフロントエンドに共有し、コンパイル時にパス、リクエストボディ、パラメータの型をチェック

> **ポイント**: Clerk自体もAPIサーバーでHonoを採用しており、実績のあるフレームワーク

---

## バックエンド API の実装

### 必要なライブラリのインストール

```bash
pnpm add hono @clerk/backend @hono/clerk-auth
```

### 環境変数の設定

Honoではローカル環境での環境変数は `.dev.vars` から取得する：

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx...
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx...
```

型安全に使用するため、以下のコマンドを実行：

```bash
pnpm cf-typegen
```

これにより `cloudflare-env.d.ts` が生成され、型補完が有効になる。

### APIルートの作成

`src/app/api/[[...routes]]/route.ts` を作成：

```typescript
import { Hono } from "hono"

const app = new Hono()
  .basePath("/api")
```

**`[[...routes]]` について**: Next.jsの **Optional Catch-all Segments** と呼ばれる記法で、`/api` 以下のすべてのパスへのリクエストをキャッチする。単一のエントリーポイントを作成することで、フロントエンドから型情報を使いやすくなる。

### 認証ミドルウェアの適用

```typescript
import { clerkMiddleware } from "@hono/clerk-auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

const app = new Hono()
    .basePath("/api")
    // Clerkミドルウェアを適用
    .use(clerkMiddleware({
        secretKey: (await getCloudflareContext({async: true})).env.CLERK_SECRET_KEY,
        publishableKey: (await getCloudflareContext({async: true})).env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    }))
    // ユーザーIDを取得、存在しなければ401エラー
    .use((c, next) => {
        const clerkAuth = c.get("clerkAuth")
        const auth = clerkAuth()
        if(!auth || !auth.userId) throw new HTTPException(401, {
            message: "You are not logged in."
        })
        return next()
    })
```

> **重要**: OpenNext環境では `process.env` や `c.env` では環境変数を取得できないため、`getCloudflareContext` を使用して明示的に取得する必要がある。

### エンドポイントの実装（完全版）

```typescript
import { clerkMiddleware } from "@hono/clerk-auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { handle } from "hono/vercel"

const app = new Hono()
    .basePath("/api")
    .use(clerkMiddleware({
        secretKey: (await getCloudflareContext({async: true})).env.CLERK_SECRET_KEY,
        publishableKey: (await getCloudflareContext({async: true})).env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    }))
    .use((c, next) => {
        const clerkAuth = c.get("clerkAuth")
        const auth = clerkAuth()
        if(!auth || !auth.userId) throw new HTTPException(401, {
            message: "You are not logged in."
        })
        return next()
    })
    .get("/hello", async c => {
      const clerkClient = c.get("clerk")
      const clerkAuth = c.get("clerkAuth")
      const auth = clerkAuth()

      const user = await clerkClient.users.getUser(auth!.userId!)

      return c.text(`Hello ${user.username}!`, { status: 200 })
    })

export const GET = handle(app)
```

**ミドルウェアとエンドポイントの配置順序:**

1. **認証ミドルウェア**: `clerkMiddleware()` で Clerk 認証を有効化
2. **認証チェック**: ユーザーがログインしているかを確認
3. **保護されたエンドポイント**: 認証が必要な API エンドポイント

### 動作確認

![ログイン時の表示](https://res.cloudinary.com/zenn/image/fetch/s--MkH7r1NW--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/3cb7488818f2605eebd18767.png%3Fsha%3D21a3084340db852f0846e7659e4f7e5172f0cc24)
*ログイン時: `Hello {username}!` と表示される*

![ログアウト時の表示](https://res.cloudinary.com/zenn/image/fetch/s--RbnIv_-U--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/9975539837bb6661998e4266.png%3Fsha%3Dfa51acc7ab366c45f53f760411c1b5704b6e61a4)
*ログアウト時: `You are not logged in.` と表示される*

---

## フロントエンドからの型安全な API 呼び出し

Hono RPCを使用することで、Reactコンポーネントから型安全にAPIを呼び出すことが可能。

### Honoクライアントの設定

**APIルートで型をエクスポート:**

```typescript
const app = new Hono()
// 中略

export type AppType = typeof app
```

**フロントエンドでの使用（`src/app/public/page.tsx`）:**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { hc } from 'hono/client'
import type { AppType } from '../api/[[...routes]]/route'

export default function Home() {
  const [message, setMessage] = useState<string>("")
  const client = hc<AppType>("/")

  useEffect(() => {
    client.api.hello.$get()
      .then(async response => {
        const text = await response.text()
        setMessage(text)
      })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clerk + Hono 認証テスト</h1>
      <div className="p-4 border rounded">
        <p>APIからのレスポンス: <strong>{message}</strong></p>
      </div>
    </div>
  )
}
```

### 型安全の利点

![パスの補完](https://res.cloudinary.com/zenn/image/fetch/s--1iwab246--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/20c7d97ca5a7ffad7cdf4e55.png%3Fsha%3Dcef1c495641fd9e91d742f8e1cc986950ba036c6)
*`api/hello` が補完機能で候補に挙げられる*

![レスポンスの型付け](https://res.cloudinary.com/zenn/image/fetch/s--2lpa8EPv--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/774bef3f4d03448ab37f950f.png%3Fsha%3D24017ec25f9c17cd4bdd671b37c6121fec3d55ad)
*レスポンスの型、ステータス、レスポンスのフォーマットが型付けされる*

**メリット:**

- パスのタイプミスを防止
- リクエストボディの付与忘れを検出
- レスポンスに存在しない値の取得を防止

---

## まとめ

### 主なポイント

| 項目 | 内容 |
|------|------|
| **Clerk + Hono** | 数十行のコードで安全なAPI認証システムを構築可能 |
| **Hono RPC** | 型安全なAPI通信を実現 |
| **Next.js親和性** | 既存プロジェクトへの容易な組み込み |
| **開発効率** | コンパイル時の型チェックで開発効率を大幅向上 |

### 次のステップ

次回の記事では、WebhookによるClerkとアプリケーションデータの同期について解説予定。

---

## 関連リンク

- [Hono RPC公式ドキュメント](https://hono.dev/docs/guides/rpc)
- [株式会社SCC](https://www.scc-kk.co.jp/)
