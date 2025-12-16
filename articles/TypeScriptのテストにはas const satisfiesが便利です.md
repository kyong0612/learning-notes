---
title: "TypeScriptのテストにはas const satisfiesが便利です"
source: "https://kakehashi-dev.hatenablog.com/entry/2025/12/14/110000"
author:
  - "岩佐 幸翠 (@kosui_me)"
published: 2025-12-14
created: 2025-12-16
description: "TypeScriptでテストを書く際に発生しがちな型検査エラーを、`as const`と`satisfies`演算子を組み合わせて解決する方法を解説。オプショナルなプロパティやDiscriminated Union型のダミーデータを安全に扱うテクニックを紹介。"
tags:
  - TypeScript
  - テスト
  - バックエンド
  - 型安全性
  - Zod
---

## はじめに

- **著者**: 岩佐 幸翠（kosui）、カケハシの認証・権限管理基盤チームのテックリード
- サーバサイドTypeScriptで基盤システムを開発・運用
- TypeScriptの型システムを活用し、堅牢で拡張性の高いシステムを目指している

## 課題：ダミーデータの型検査エラー

TypeScriptでテストを書く際、事前に定義したダミーデータを使おうとすると型検査エラーが発生することがある。

### 具体的な問題

1. **オプショナルなプロパティの参照**
   - `dummyUser.email` を参照しようとすると `email` がオプショナルのため `string | undefined` となりエラー

2. **Discriminated Unionのディスクリミネーター**
   - ディスクリミネーター（`status`など）が単なる `string` 型として扱われてしまう

## 解決策1: `satisfies` 演算子を使う

オプショナルなプロパティを持つエンティティのダミーデータで、非ヌルアサーション演算子 `!` を使わずに解決できる。

### 問題のコード例

```typescript
type User = Readonly<{
  id: UserId;
  name: DisplayName;
  email?: Email;
}>;

const dummyUser: User = {
  id: randomUUID(),
  name: "Alice",
  email: "foo@example.com",
}

// Type 'string | undefined' is not assignable to type 'string'.
expect(someFunction(dummyUser.email)).toBe(someExpectedValue);
```

### `satisfies` を使った解決

```typescript
const dummyUser = {
  id: randomUUID(),
  name: "Alice",
  email: "foo@example.com",
} satisfies User;
// User型に適合していることを保証しつつ、元の型を保持

// これでエラーにならない
expect(someFunction(dummyUser.email)).toBe(someExpectedValue);
```

**ポイント**: `satisfies` を使うと、元々の `dummyUser` の型を保ちつつ、TypeScriptに対してそのプロパティが存在することを保証できる。

## 解決策2: `as const` アサーションを使う

Discriminated Union型を使う場合、ディスクリミネーターへ `as const` を付与し忘れると型推論が正しく行われない。

### 問題のコード例

```typescript
const UserStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

type ActiveUser = Readonly<{
  status: typeof UserStatus.Active;
  // ...
}>;

const dummyActiveUser = {
  status: "active",  // string型として扱われてしまう
  // ...
};

// Type 'string' is not assignable to type '"active"' | "inactive"'.
handleUser(dummyActiveUser);
```

### `as const` を使った解決

```typescript
const dummyActiveUser = {
  status: "active",
  id: randomUUID(),
  name: "Bob",
  role: "admin",
} as const;  // 全てのプロパティがリテラル型として扱われる
```

**注意**: `as User` と型注釈を書いてしまうと、User型に後からプロパティが増えた場合に型検査が通ってしまい、不具合に気付く機会を失う。

## 最適解: `as const satisfies ...` の組み合わせ

`as const` と `satisfies` を組み合わせることで、両方のメリットを得られる。

```typescript
const dummyActiveUser = {
  status: "active",
  id: randomUUID(),
  name: "Bob",
  role: "admin",
} as const satisfies ActiveUser;
```

### 対処の優先順位

1. **`as const satisfies ...`** を使う（最推奨）
2. **`satisfies ...`** のみを使う
3. そもそもの設計を見直す
4. 最後の手段として `!` や `as` を使う

## おまけ: 実際の現場に近いコード例

カケハシではZodを活用したスキーマ駆動開発を採用。

### UserStatus: `z.enum` で定義

```typescript
import { z } from "zod/v4";

const userState = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

export const UserStatusSchema = z.enum(userState);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserStatus = {
  ...userState,
  schema: UserStatusSchema,
} as const;
```

**補足**: Zod v4からは `z.enum` だけで列挙型を定義可能（`z.nativeEnum` との使い分けが不要に）

### User: Discriminated Union型でエンティティの状態ごとにスキーマを分ける

```typescript
import { z } from "zod/v4";

const BaseUserSchema = z.object({
  id: UserId.schema,
  name: DisplayName.schema,
  email: Email.schema.optional(),
});

const ActiveUserSchema = BaseUserSchema.extend({
  status: z.literal(UserStatus.Active),
});

const DeactivatedUserSchema = BaseUserSchema.extend({
  status: z.literal(UserStatus.Inactive),
  deactivatedAt: z.date(),
});

const UserSchema = z.discriminatedUnion("status", [
  ActiveUserSchema,
  DeactivatedUserSchema
]);

export type ActiveUser = z.infer<typeof ActiveUserSchema>;
export type DeactivatedUser = z.infer<typeof DeactivatedUserSchema>;
export type User = z.infer<typeof UserSchema>;
```

**補足**: Zod v4では `z.discriminatedUnion` は残る予定（`z.switch` への完全移行はなし）

### UserId: Branded Typeと生成関数

```typescript
import { z } from "zod/v4";

const UserIdSym = Symbol("UserId");
const UserIdSchema = z.uuid().brand<typeof UserIdSym>();

export type UserId = z.infer<typeof UserIdSchema>;
export const UserId = {
  schema: UserIdSchema,
  generate: () => crypto.randomUUID() as UserId,
} as const;
```

### テストコードでの使用例

```typescript
describe("UpdateEmailUseCase", () => {
  const dummyUser = {
    id: UserId.generate(),
    name: DisplayName.schema.parse("Alice"),
    status: UserStatus.Active,
    email: Email.schema.parse("foo@example.com"),
  } as const satisfies ActiveUser;

  const newEmail = Email.schema.parse("bar@example.com");

  it("正常にメールアドレスを更新できる", async () => {
    const result = await UpdateEmailUseCase.run(dummyUser.id, newEmail);
    expect(result).toEqual(ok({
      ...dummyUser,
      email: newEmail,
    }));
  });

  it("元のメールアドレスと同じ場合、エラーになる", async () => {
    const result = await UpdateEmailUseCase.run(dummyUser.id, dummyUser.email);
    expect(result).toEqual(errAsync({
      type: "EmailUnchangedError",
      detail: { email: dummyUser.email }
    }));
  });
});
```

**ポイント**: `User.schema` でパースするよりも `satisfies` を使う方が、テスト実行前にプロパティの不足に気付ける。

## まとめ

| アプローチ | 利点 | 用途 |
|-----------|------|------|
| `satisfies` | 元の型を保持しつつ型適合を保証 | オプショナルプロパティの参照 |
| `as const` | リテラル型として扱われる | Discriminated Union |
| `as const satisfies` | 両方のメリット | 最も推奨される方法 |

`as const satisfies ...` を活用することで、型検査エラーを防ぎつつ、型の安全性も確保できる。非ヌルアサーション `!` や型アサーション `as` に頼る前に、まずこのパターンを試すことを推奨。
