---
title: "shouldRevalidate - Remix ドキュメント 日本語版"
source: "https://remix-docs-ja.techtalk.jp/route/should-revalidate"
author:
  - "Remix Team (原著)"
  - "coji (日本語翻訳)"
published:
created: 2025-11-28
description: |
  Remixフレームワークにおける`shouldRevalidate`関数の解説ドキュメント。この関数を使用することで、アクション後やクライアントサイドナビゲーション後にどのルートのデータをリロードすべきかをアプリケーションが最適化できる。ただし、UIがサーバーと同期しなくなるリスクがあるため、注意して使用する必要がある。
tags:
  - Remix
  - React
  - shouldRevalidate
  - データローディング
  - 再検証
  - パフォーマンス最適化
  - フロントエンド
  - ルーティング
---

## 概要

`shouldRevalidate`関数は、アクション後やクライアントサイドのナビゲーション後に**どのルートのデータをリロードすべきか**をアプリが最適化できる機能。

**⚠️ 重要な注意点**: この機能は*追加の*最適化であり、使用には注意が必要。誤って使用するとUIがサーバーと同期しなくなるリスクがある。

## 基本的な使い方

```typescript
import type { ShouldRevalidateFunction } from "@remix-run/react";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl,
}) => {
  return true;
};
```

## Remixのデフォルト最適化

クライアントサイドのトランジション中、Remixは以下を自動で最適化:

- 変更されていないレイアウトルートのリロードをスキップ
- パラメータが変更されたローダーのみを呼び出す

ただし、以下のケースでは安全のため**すべてをリロード**:

- フォームの送信
- 検索パラメータの変更

## 関数の引数

### `actionResult`

送信によって再検証が発生した場合のアクション結果。アクションデータまたはエラーが含まれる。

```typescript
export async function action() {
  await saveSomeStuff();
  return { ok: true };
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}) {
  if (actionResult?.ok) {
    return false;
  }
  return defaultShouldRevalidate;
}
```

### `defaultShouldRevalidate`

Remixのデフォルト最適化による判断結果。**常にこれをフォールバックとして返すことが推奨される**。

```typescript
export function shouldRevalidate({
  defaultShouldRevalidate,
}) {
  if (whateverConditionsYouCareAbout) {
    return false;
  }
  return defaultShouldRevalidate;
}
```

### `currentParams` / `nextParams`

現在と次のURLパラメータ。リロードが必要かどうかの判断に使用。

### `currentUrl` / `nextUrl`

ナビゲーションの元URL / 次のURL。

### `formMethod`

再検証をトリガーしたフォーム送信のメソッド（`"GET"` または `"POST"`）。

### `formAction`

再検証をトリガーしたフォームアクション。

### `formData`

再検証をトリガーしたフォームで送信されたデータ。

## ユースケース

### 1. ルートのリロードを完全に停止

環境変数など、決して変更されないデータを返すルートローダーの場合:

```typescript
export const loader = async () => {
  return json({
    ENV: {
      CLOUDINARY_ACCT: process.env.CLOUDINARY_ACCT,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

export const shouldRevalidate = () => false;
```

### 2. 検索パラメータの変更を無視

ネストされたルートで、子コンポーネントが検索パラメータを使用するが、親ルートでは無関係な場合:

#### 例: プロジェクト詳細ページ

```text
├── $projectId.tsx        ← 検索パラメータを使わない
└── $projectId.activity.tsx  ← 検索パラメータでフィルタリング
```

#### 親ルート (`$projectId.tsx`) の最適化

```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const data = await fakedb.findProject(params.projectId);
  return json(data);
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}) {
  if (
    formMethod === "GET" &&
    currentParams.projectId === nextParams.projectId
  ) {
    return false;
  }
  return defaultShouldRevalidate;
}
```

#### 判断ロジック

1. パラメータが同じままか？
2. `POST`ではなく`GET`だったか？

両方の条件を満たせば、ローダーは前回と同じデータを返すため再検証をスキップ。

### 3. パラメータの一部のみを考慮

IDと人間が理解しやすいタイトルを持つスラッグの場合:

```typescript
// URL例:
// /events/blink-182-united-center-saint-paul--ae3f9
// /events/blink-182-little-caesars-arena-detroit--e87ad

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.slug.split("--")[1];
  return loadEvent(id);
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}) {
  const currentId = currentParams.slug.split("--")[1];
  const nextId = nextParams.slug.split("--")[1];
  if (currentId === nextId) {
    return false;
  }
  return defaultShouldRevalidate;
}
```

## `fetcher.load`について

- `fetcher.load`の呼び出しも再検証対象
- 特定のURLをロードするため、ルートパラメータやURL検索パラメータの再検証を考慮する必要はない
- デフォルトでは以下の場合のみ再検証:
  - アクションの送信後
  - `useRevalidator`を介した明示的な再検証リクエスト後

## ベストプラクティス

1. **常に`defaultShouldRevalidate`をフォールバックとして返す**
2. **ローダーが実際に使用する値のみを考慮する**（UIの変更ではなく）
3. **慎重に使用する** - UIとサーバーの同期が崩れるリスクがある
4. **特定の条件でのみ`false`を返し、それ以外は`defaultShouldRevalidate`に委ねる**
