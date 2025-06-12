---
title: "Convex Overview | Convex Developer Hub"
source: "https://docs.convex.dev/understanding/"
author:
  - "Convex Development Team"
published: 2025
created: 2025-06-12
description: "Convex is the open source, reactive database where queries are TypeScript code running right in the database. A comprehensive overview of Convex's three-tier architecture including database, server functions, and client libraries for building dynamic live-updating applications."
tags:
  - "convex"
  - "database"
  - "typescript"
  - "reactive"
  - "fullstack"
  - "serverless"
  - "realtime"
---

# Convex Overview

Convexは、データベース内でTypeScriptコードとして実行されるクエリを持つ、オープンソースのリアクティブデータベースです。Reactコンポーネントが状態変更に反応するように、Convexクエリはデータベースの変更に反応します。

## 概要

Convexは以下の3つの主要コンポーネントを提供します：

- データベース
- サーバー関数を記述する場所
- クライアントライブラリ

これらにより、動的でライブ更新されるアプリの構築とスケールが容易になります。

![Convex in your app](https://docs.convex.dev/assets/images/basic-diagram-8ad312f058c3cf7e15c3396e46eedb48.png)

## データベース

Convexのデータベースはプロジェクト作成時に自動的にプロビジョニングされ、接続設定やクラスター管理は不要です。

### 主要な特徴

1. **リアクティブデータベース**: クエリが依存するデータが変更されると、クエリが再実行され、クライアントサブスクリプションが更新されます

2. **ドキュメント-リレーショナル構造**:
   - "ドキュメント": JSON風のネストされたオブジェクトをデータベースに格納
   - "リレーショナル": IDを使用して他のテーブルのドキュメントを参照するテーブル間の関係

3. **技術基盤**:
   - Convex Cloud: Amazon RDS上でMySQLを永続化層として使用
   - オープンソース版: SQLite、PostgreSQL、MySQLをサポート
   - ACID準拠、シリアライザブル分離と楽観的同時実行制御を使用

### TypeScriptクエリ

ConvexではデータベースクエリはTypeScriptコードとして記述され、SQLの記述やORMは不要です。

```typescript
// Convexクエリ関数の例
export const getAllOpenTasks = query({
  args: {},
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_completed", (q) => q.eq("completed", false))
      .collect();
    return tasks;
  },
});
```

## サーバー関数

新しいConvexプロジェクトを作成すると、自動的に`convex/`フォルダが生成され、そこにサーバー関数を記述します。

### 関数の種類

1. **クエリ関数**: データベースから読み取り専用の純粋関数
2. **ミューテーション関数**: データベースの読み取り/書き込みが可能なトランザクション
3. **アクション関数**: ネットワークリクエストが可能な汎用サーバレス関数

### ミューテーション関数の例

```typescript
export const setTaskCompleted = mutation({
  args: { taskId: v.id("tasks"), completed: v.boolean() },
  handler: async (ctx, { taskId, completed }) => {
    await ctx.db.patch(taskId, { completed });
  },
});
```

### スケジューリング機能

- スケジューラーによる関数の永続的スケジューリング
- cronジョブのサポート
- ワークフロー構築（例：新規ユーザーへの翌日フォローアップメール）

## クライアントライブラリ

Convexクライアントライブラリは、フロントエンドをサーバー関数の結果と同期させます。

### Reactでの使用例

```tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function TaskList() {
  const data = useQuery(api.tasks.getAllOpenTasks);
  return data ?? "Loading...";
}
```

### 自動更新機能

- `useQuery`フック：クエリ結果が変更されると自動的にコンポーネントを更新
- 手動のサブスクリプション管理や状態同期は不要
- WebSocket接続を通じてリアルタイム更新

### サポートフレームワーク

- React、React Native
- Vue、Svelte
- TanStack Query
- JavaScript、Python、Swift、Android Kotlin、Rust
- HTTP APIによる直接利用も可能

## データフローの仕組み

![Convex data flow](https://docs.convex.dev/assets/images/convex-query-subscription-945e7990515e438ab4385f9b4803bbd4.png)

クエリサブスクリプションの流れ：

1. **初期値の取得**:
   - Convexクライアントがサーバーにクエリサブスクリプションメッセージを送信
   - Convexサーバーが関数を実行し、データベースからデータを読み取り
   - サーバーがクライアントに関数の結果を送信

2. **データ更新時**:
   - ミューテーションによりデータが変更される
   - Convexがクエリを再実行
   - WebSocket接続経由で更新結果をウェブアプリにプッシュ

## 一貫性の保証

Convexはアプリケーションスタックのあらゆる層で一貫性のない状態を防ぎます。

### eコマース例

![Convex in your app](https://docs.convex.dev/assets/images/convex-swaghaus-dcc9919685db6a7f34378afc500f68cd.png)

ショッピングカートのシナリオ：

- 在庫数とカート内アイテム数は異なるクエリ関数の結果
- "カートに追加"ボタンにより、在庫から1つ減らしてカートに追加するミューテーションが実行
- 両方のクエリが同じタイミングで更新され、数値の整合性が常に保たれる

実例：[Swaghaus sample app](https://swaghaus.biz/)

## AI生成コードとの親和性

Convexは人間とAIの両方が書くコードに最適化された設計になっています：

1. **TypeScriptクエリ**: SQLへの切り替えなしに、TypeScriptの豊富な学習データセットを活用可能

2. **少ないコード量**: インフラストラクチャとボイラープレートが自動管理されるため、記述・エラーのリスクが軽減

3. **自動リアクティビティ**: 手動でのサブスクリプション管理、WebSocket接続、複雑な状態同期が不要

4. **トランザクション保証**: 読み取り専用クエリとトランザクション内ミューテーションの制約により、データ破損や不整合状態のリスクを最小化

これらの機能により、AIはビジネスロジックに集中でき、Convexの保証により一般的な障害モードを防止できます。

## 参考情報

Convexの詳細な仕組みについては、共同創設者SujayのブログPost [How Convex Works](https://stack.convex.dev/how-convex-works) をご覧ください。

## まとめ

Convexは、TypeScriptベースのリアクティブデータベースとして、従来のバックエンド開発の複雑さを大幅に軽減します。自動的なリアクティビティ、強力な一貫性保証、シンプルなAPI設計により、現代的なリアルタイムアプリケーションの開発を効率化します。
