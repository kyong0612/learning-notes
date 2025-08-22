---
title: "TypeScriptのas型アサーションをZodで型安全に置き換える"
source: "https://zenn.dev/pepabo/articles/b61931ca6820ef"
author:
  - "tetsuwo"
published: 2025-08-18
created: 2025-08-22
description: |
  TypeScriptで外部APIのレスポンスや設定ファイルなど、実行時まで型が不確定なデータを扱う際に`as`型アサーションに頼ると、ランタイムエラーのリスクが高まります。本記事では、Zodの`z.infer`（型推論）、`parse`（ランタイム検証）、`refine`（カスタムバリデーション）、`transform`（データ変換）を活用し、`as`型アサーションを回避して型安全性を高める方法を解説します。
tags:
  - "TypeScript"
  - "Zod"
  - "型安全"
  - "バリデーション"
  - "clippings"
---

## 概要

TypeScript開発において、`as`による型アサーションは、APIレスポンスや設定ファイルのような外部データが期待する型と異なる場合にランタイムエラーを引き起こす危険性をはらんでいます。この記事では、スキーマ定義とバリデーションライブラリであるZodを用いて、この問題を解決し、型安全なコードを実装する方法を解説します。

## 1. 型アサーションの問題点

従来の`as`を用いた型アサーションには、以下の問題があります。

* **ランタイム検証の欠如**: APIの仕様変更などでデータの構造が変わっても、コンパイル時にはエラーを検知できません。
* **型の不整合**: TypeScriptコンパイラは`as`で指定された型を信頼するため、実際のデータ構造との乖離が生まれる可能性があります。
* **デバッグの困難さ**: 型に関する問題が実行時まで表面化せず、原因特定が難しくなります。

### 危険なコード例

```typescript
// 危険な例：型アサーション
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // ここが危険：実際のデータ構造を検証していない
  return data as User;
}
```

## 2. Zodによる型安全なアプローチ

Zodは「スキーマファースト」のアプローチを採用しており、まずデータの構造をスキーマとして定義し、そのスキーマからTypeScriptの型を推論します。これにより、バリデーションロジックと型定義を一元管理できます。

### Zodの主要機能

* **`z.infer`**: Zodスキーマから対応するTypeScriptの型を自動生成します。
* **`parse`**: 実行時にデータをスキーマに照らして検証し、検証に失敗した場合は例外をスローします。
* **`safeParse`**: 例外をスローせず、成功または失敗を示す`Result`型を返します。
* **`refine` / `superRefine`**: より複雑なカスタムバリデーションルールを定義できます。
* **`transform`**: バリデーションが成功した後にデータを変換する処理を追加できます。

### Zodを用いた改善策

```typescript
import { z } from "zod";

// Zodスキーマの定義
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
});

// z.inferで型を自動生成
type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();

  // ランタイムでデータを検証し、型安全なデータを返す
  return UserSchema.parse(data);
}
```

## 3. 実践的なユースケース

### 設定ファイルの読み込み

`strict()`を使用することで、スキーマに定義されていないキーが含まれている場合にエラーとなり、設定ファイルのタイポなどを早期に検知できます。

```typescript
const ConfigSchema = z.object({
  port: z.number().min(1).max(65535),
  // ...
}).strict();

function loadConfig(): Config {
  const rawConfig = JSON.parse(fs.readFileSync("config.json", "utf-8"));
  return ConfigSchema.parse(rawConfig);
}
```

### フォームバリデーション

Zodスキーマは、フォーム入力値のバリデーションロジックとしてそのまま利用でき、エラーメッセージもカスタマイズ可能です。

```typescript
const FormSchema = z.object({
  username: z.string().min(3, "ユーザー名は3文字以上である必要があります"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  age: z.number().min(0, "年齢は0以上である必要があります"),
});
```

## 4. 高度な機能

### `refine` と `superRefine` によるカスタムバリデーション

特定のドメインルール（例: 特定のドメインのメールアドレスのみを許可する）や、複数フィールド間の相関チェック（例: パスワードと確認用パスワードの一致）を実装できます。

```typescript
const PasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "パスワードが一致しません",
      path: ["confirmPassword"],
    });
  }
});
```

### `transform` によるデータ変換

バリデーション後に、データの整形（例: メールアドレスを小文字に統一する）や、形式の変換を行うことができます。

```typescript
const ProcessedDataSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase()),
  name: z.string().transform(name => name.trim().toLowerCase()),
  age: z.number().min(0),
}).transform(data => ({
  email: data.email,
  normalizedName: data.name,
  ageGroup: data.age >= 18 ? "adult" as const : "minor" as const,
}));
```

### `safeParse` による柔軟なエラーハンドリング

`parse`が例外を投げるのに対し、`safeParse`は`{ success: boolean, data?: T, error?: ZodError }`というオブジェクトを返します。これにより、`try-catch`を使わずにバリデーション結果を安全に処理できます。

```typescript
function processApiResponse(data: unknown): User | null {
  const result = UserSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    console.error("バリデーションエラー:", result.error.errors);
    return null;
  }
}
```

## まとめ

Zodを導入することで、TypeScriptにおける`as`型アサーションへの依存をなくし、外部データとの境界における型安全性を大幅に向上させることができます。これにより、ランタイムエラーを未然に防ぎ、堅牢でメンテナンス性の高いアプリケーションを構築することが可能になります。
