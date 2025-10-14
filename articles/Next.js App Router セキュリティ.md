---
title: "Next.js App Router セキュリティ"
source: "https://speakerdeck.com/zaru_sakuraba/nextjssekiyuritei"
author:
  - "[[zaru]]"
published: 2024-11-05
created: 2025-10-14
description: |
  Next.js App Routerのセキュリティ上の注意点について、実際のデモアプリ「Next Clicker」を使って解説。Server ComponentとServer Actionsを使う際に陥りがちな脆弱性と、その対策方法を具体的に紹介します。
tags:
  - Next.js
  - セキュリティ
  - Server Component
  - Server Actions
  - App Router
  - Web開発
  - フロントエンド
---

## 概要

2024年11月6日のOffers_DeepDiveで発表された、Next.js App Routerのセキュリティに関するプレゼンテーション。発表者の@zaru（nanabit所属）が、実際に脆弱性を含むデモアプリケーション「Next Clicker」を作成し、Next.js App Routerで陥りがちなセキュリティ上の問題点と対策を解説しています。

## Next.js App Routerの主要機能

Next.js App Routerは、React 19の新機能を先取りして提供するフレームワークで、以下の機能が特徴です：

- **Server Component**: サーバーサイドでレンダリングされるコンポーネント
- **Streaming with Suspense**: 段階的なコンテンツ配信
- **Server Actions**: サーバー処理を関数として呼び出せる機能

これらの機能により、フロントエンドとバックエンドの境界線が曖昧になり、コンポーネントから直接SQLを実行したり、フロントの状態を極力持たずに開発できるようになりました。

## デモアプリ「Next Clicker」

発表では実際に脆弱性を含むゲームアプリケーションを用意し、参加者に脆弱性を探してもらう形式で進められました。このアプリケーションには、意図的に以下の脆弱性が含まれています。

## 主要な脆弱性と対策

### 1. 無防備なServer Actions

**問題点:**

- Server Actionsは見た目上は関数呼び出しだが、実際はHTTPエンドポイントとして公開される
- クライアントから送信される引数を無条件に信頼してしまう

**具体例:**

```javascript
"use server";
export async function incrementalScore(power: number) {
  const user = await currentUser();
  if (!user) return;
  
  await prisma.user.update({
    where: { id: user.id },
    data: { score: { increment: power } },
  });
  revalidatePath("/");
}
```

この実装では、クライアントから任意の`power`値を送信できてしまい、1クリックで9999ポイント増やすことが可能になってしまいます。

**攻撃方法:**

```bash
curl 'https://nextclicker.nanabit.dev/' \
  -H 'Content-Type: text/plain;charset=UTF-8' \
  -H 'Cookie: ...' \
  -H 'Next-Action: 6eb8416051487420c0347306825a392adf55f29e' \
  --data-raw '[9999]'  # 任意の数値を送信可能
```

**対策:**

- Server Actionsを「外部公開API」として扱う
- 引数は必ずパースし、バリデーションを行う
- 必要に応じて認証・認可チェックを実施

### 2. 露出しているServer Actions

**問題点:**

- `"use server"`ディレクティブの誤解
- サーバー処理を行う関数すべてに付けてしまい、意図せず外部公開されてしまう

**具体例:**

```javascript
"use server";
// 内部でしか使ってないのに、意図せず外部公開されてしまった
export async function fetchRankers() {
  return prisma.user.findMany({
    orderBy: { score: "desc" },
    take: 10,
  });
}
```

**攻撃方法:**

- DevToolsのSearchで`[0-9a-z]{40}`（Server Actions ID）を検索
- 見つかったIDを使ってリクエストを送信すると、ハッシュ化されたパスワードなども含む全情報が返ってくる

**対策:**

- `"use server"` ≠ サーバー処理という認識を持つ
- Server Actionsにすべきものだけに付ける
- Next.js v15ではIDが露出しないように改善された
- Knipツールで未exportの関数を検出可能

### 3. Client Componentへの情報漏洩

**問題点:**

- Server Componentで取得したデータをそのままClient Componentに渡してしまう
- Client Componentの`props`はすべてブラウザに露出する

**具体例:**

```javascript
// Ranking はServer Component
export async function Ranking() {
  const users = await fetchRankers();
  return (
    <>
      {users.map((user) => (
        // RankingItem はClient Component
        <RankingItem key={user.id} user={user} />
      ))}
    </>
  );
}
```

この場合、`user`オブジェクトに含まれるパスワードハッシュなどの機密情報もブラウザ側に露出してしまいます。

**対策:**

1. **必要な情報だけpropsに渡す**
   - どんなコンポーネントでも必要な情報だけを扱う

2. **SELECT句を明示的にする（SQL）**

   ```javascript
   export async function fetchRankers() {
     return prisma.user.findMany({
       select: {
         id: true,
         name: true,
         score: true,
         level: true
       },
     });
   }
   ```

3. **Taint APIを使う**

   ```javascript
   export async function fetchRankers() {
     const users = await prisma.user.findMany();
     for (const user of users) {
       taintObjectReference("Client Componentでは使えません", user);
     }
     return users;
   }
   ```

4. **Zodでパースする**

   ```javascript
   const schema = z.object({
     id: z.number(),
     name: z.string(),
   });
   const parsed = schema.safeParse(user);
   ```

### 4. 認証していても見える情報

**問題点:**

- Layoutで認証チェックを行っても、条件分岐で弾かれているコンポーネントのコードがブラウザに含まれてしまう

**対策:**

- Layoutで認証しない方針を取る
- Next.js v15ではLayoutからレンダリングされるため回避可能だが、順序に依存するのは危険
- 隠したい情報を表示するコンポーネント自体で判定を行う
- 将来的にはRequest Interceptorsで共通処理が可能になる予定（[PR #70961](https://github.com/vercel/next.js/pull/70961)）

## ベストプラクティスとツール

### おすすめのツールとライブラリ

1. **server-only**: Client Componentに含まれないようにする

   ```javascript
   import 'server-only';
   ```

2. **next-safe-action**: Server Actionsを少し安全にするライブラリ
   - <https://next-safe-action.dev/>

3. **Knip**: 未使用のexport関数を検出

## 重要な考え方

1. **フロントとバックの境界線を意識する**
   - Server Actionsは関数に見えるが、実態はHTTPエンドポイント
   - Client Componentのpropsはすべてブラウザに露出される

2. **仕組みを理解して使う**
   - 新しい機能の内部動作を理解する
   - セキュリティリスクを事前に把握する

3. **将来を見据えた設計**
   - 境界線をまたぐ書き方は今後も増えていく
   - 自分の領域を決めすぎず、広く対応できるようにする

## まとめ

Next.js App Routerは強力な機能を提供しますが、フロントエンドとバックエンドの境界が曖昧になることで、従来とは異なるセキュリティリスクが生じます。Server Actionsを外部公開APIとして扱い、Client Componentに渡すデータを最小限にし、認証・認可を適切に実装することが重要です。仕組みを正しく理解し、適切なツールを活用することで、安全なアプリケーション開発が可能になります。
