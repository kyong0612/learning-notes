---
title: "「継続」は力なり - 継続を知り、Promiseの限界を超え、Effect Systemへ"
source: "https://www.m3tech.blog/entry/2025/12/14/100000"
author:
  - "松本 (bussorenre)"
published: 2025-12-14
created: 2025-12-16
description: |
  継続（Continuation）の概念を解説し、Promise/async/awaitでは解決できない課題（エラー型の不明確さ、処理漏れの検知不可、手動リソース管理）を明らかにした上で、Effect Systemによる解決策を提示する技術記事。M3 Advent Calendar 2025の14日目。
tags:
  - TypeScript
  - Effect System
  - Continuation
  - 継続
  - Promise
  - async/await
  - 関数型プログラミング
  - エラーハンドリング
  - Effect-TS
---

## 概要

本記事は、M3 Advent Calendar 2025 14日目の記事。プログラミングにおける「継続（Continuation）」の概念を理解し、Promise/async/awaitの限界を明らかにした上で、Effect Systemによる解決策を解説している。

---

## 「継続 - Continuation」とは？

**継続**とは、プログラムの「残りの計算」を表現する概念。

```typescript
function calculate() {
    const a = 3 + 4;
    console.log(a);   // これ以後の計算が継続
    const b = a * 2;
    return b;
}
```

- プログラムのあらゆる箇所に「残りの計算」としての継続が存在
- 特に、処理が中断される箇所では、その後の処理が明示的に「継続」として表れる

### コールバック関数は継続そのもの

```typescript
// コールバック版
readFile('data.txt', function(result) {
  console.log(result);      // ← この関数全体が「継続」
  processData(result);      // ← ファイルを読んだ後の「残りの計算」
});
```

**コールバック関数とは、継続を明示的に関数にしたもの**と捉えることができる。

> 厳密には「限定継続（delimited continuation）」。継続には、プログラム全体の残りを表す「継続」と、特定の範囲までの残りを表す「限定継続」がある。

---

## 継続と非同期処理、副作用

「処理が中断される箇所」は、主に**副作用を伴う処理**：

- ネットワーク通信等の非同期処理
- ファイル I/O
- デバイスとのやり取り
- ユーザーのキー入力やマウス入力

これらの処理では、完了するまで待つ必要があり、その後の計算（継続）が明示的に意識される。

---

## 継続の課題：コールバック地獄

副作用を伴う処理は、プログラムの制御フローを複雑にする。

```typescript
function processData(
  onSuccess: () => void,
  onError: (error: Error) => void
) {
  fetchData('https://api.example.com/data',
    (response) => {
      if (!response.ok) {
        onError(new Error('Network response was not ok'));
        return;
      }
      parseJSON(response,
        (data) => {
          const processed = processDataInternal(data);
          // ...さらにネストが続く
        },
        onError
      );
    },
    onError
  );
}
```

**問題点**：

- コードが右にネストしていき、可読性が著しく低下
- エラーハンドリングが各レベルで必要
- 制御フローの追跡が困難

---

## 継続渡しスタイル（CPS: Continuation-Passing Style）

関数が結果を直接返すのではなく、結果を受け取るための継続関数を引数として受け取るスタイル。

```typescript
// 通常のスタイル
function add(a: number, b: number): number {
  return a + b;
}

// 継続渡しスタイル (CPS)
function addCPS(a: number, b: number, continuation: (result: number) => void): void {
  continuation(a + b);  // 結果を継続に渡す
}

addCPS(3, 4, (sum) => {
  multiplyCPS(sum, 2, (result) => {
    console.log(result);
  });
});
```

### CPSの問題点：継続のネスト

継続をネストして書かなければならないため、コードが横に広がり、可読性が著しく低下する。

---

## 継続の合成：Promise と async/await

### Promise（継続を合成する）

Promiseを使うと、継続を横に並べて合成できる。

```typescript
fetchData('https://api.example.com/data')
  .then(data => processDataInternal(data))        // 継続1: 処理
  .then(processed => saveToDatabase(processed))   // 継続2: DB保存
  .then(result => notifyUser(result.id))          // 継続3: 通知
  .then(notification => {
    console.log('Data saved and user notified');
  });
```

### async/await

Promiseチェーンの糖衣構文。

```typescript
async function processDataFlow() {
  const data = await fetchData('https://api.example.com/data');
  const processed = processDataInternal(data);      // 継続1: 処理
  const result = await saveToDatabase(processed);   // 継続2: DB保存
  const notification = await notifyUser(result.id); // 継続3: 通知
  console.log('Data saved and user notified');
}
```

**重要な洞察**：
> async/await は非同期通信を書くための構文ではなく、**継続を普通のコードのように書けるようにした糖衣構文**。
> `try/catch`、Promise、async/await は、すべて「成功継続」と「失敗継続」という2つの継続を管理する仕組みと捉えることができる。

---

## 継続だけでは解決できない課題

### 課題1: どんなエラーが発生しうるか、型から分からない

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');  // ← どんなエラー？
  }
  return response.json();
}
```

**問題**：TypeScriptの型システムでは、関数がどんなエラーを投げるか型シグネチャに現れない。

```typescript
// 型シグネチャ
async function fetchUser(id: string): Promise<User>
//                                     ^^^^^^^^^^^^
//                                     エラーの情報がない！
```

### 課題2: エラー処理の漏れをコンパイル時に検知できない

```typescript
try {
  await saveUser(user);
} catch (error) {
  // error は any 型
  // ValidationError? DbError? NetworkError?
  // コンパイラは3種類のエラーがあることを知らない

  if (error instanceof DbError) {
    // DB エラー処理
  }
  // ← NetworkError と ValidationError の処理漏れ！
  // でもコンパイラは何も警告してくれない
}
```

### 課題3: リソース管理が手動

```typescript
async function processFile(path: string): Promise<void> {
  const file = await openFile(path);

  try {
    const data = await file.read();
    await processData(data);
  } finally {
    await file.close();  // ← 手動でクローズが必要
  }
}
```

- `finally`を書き忘れるとリソースリーク
- 複数リソースを扱うとネストが深くなる

---

## Effect System

### Effect System とは

副作用（Effect）をうまく扱うための仕組み。TypeScriptでは **Effect-TS** が代表例。

```typescript
Effect<Success, Error, Requirements>
//     ^^^^^^^  ^^^^^  ^^^^^^^^^^^^
//     成功時の型 失敗時の型 必要な依存
```

- **Success**: 成功した場合の返り値の型
- **Error**: 発生しうるエラーの型（複数のエラーをUnion型で表現）
- **Requirements**: 実行に必要な依存（Database、Logger など）

**最大の特徴**：関数がどんなエラーを投げうるか、何に依存しているかが、型として明示される。

### Promise との比較

```typescript
// Promise: エラー型が不明
async function fetchUser(id: string): Promise<User>

// Effect: エラー型と依存が明示的
function fetchUser(id: string): Effect<User, NetworkError | ParseError, never>
```

### Effect System が解決するPromiseの課題

#### 課題1解決: エラー型が型シグネチャに現れる

```typescript
function fetchUser(id: string): Effect<User, NetworkError | ParseError, never>
//                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                            どんなエラーが起きるか一目瞭然
```

#### 課題2解決: エラー処理の漏れがコンパイルエラーになる

```typescript
const program = fetchUser("123").pipe(
  Effect.catchTag("NetworkError", (e) => /* 処理 */),
  // ParseError の処理を忘れると、コンパイルエラー！
)
// エラー: Property 'ParseError' is missing
```

すべてのエラーを処理すると、エラー型は `never` になる。処理漏れがあると、型エラーとして検出。

#### 課題3解決: リソース管理が自動化される

```typescript
const program = Effect.acquireRelease(
  openFile(path),        // 確保
  (file) => file.close() // 解放（自動で実行される）
).pipe(
  Effect.flatMap(file => processFile(file))
)
// エラーが起きても、必ずクローズされる
```

### Effect-TS を用いた実践例

```typescript
import { Effect, Data } from "effect"

// 1. エラー型を定義
class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

class ParseError extends Data.TaggedError("ParseError")<{
  readonly message: string
}> {}

// 2. ユーザー取得関数（エラー型が型シグネチャに現れる）
const fetchUser = (id: string): Effect.Effect<User, NetworkError | ParseError> =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        try: () => fetch(`/api/users/${id}`),
        catch: (error) => new NetworkError({ message: String(error) })
      })
    )

    if (!response.ok) {
      return yield* _(Effect.fail(new NetworkError({ message: 'Failed to fetch' })))
    }

    const data = yield* _(
      Effect.tryPromise({
        try: () => response.json(),
        catch: (error) => new ParseError({ message: String(error) })
      })
    )

    return data as User
  })

// 3. エラー処理（処理漏れがあるとコンパイルエラー）
const program = fetchUser("123").pipe(
  Effect.catchTags({
    NetworkError: (error) => {
      console.error(`Network failed: ${error.message}`)
      return Effect.succeed(defaultUser)
    },
    ParseError: (error) => {
      console.error(`Parse failed: ${error.message}`)
      return Effect.succeed(defaultUser)
    }
    // どちらか一方でもコメントアウトすると、コンパイルエラー！
  })
)
```

### 依存性注入（Requirements）

```typescript
import { Effect, Context } from "effect"

// サービスの定義
class Database extends Context.Tag("Database")<
  Database,
  { readonly query: (sql: string) => Effect.Effect<any[], never> }
>() {}

// Databaseに依存する関数
const getUsers = Effect.gen(function* (_) {
  const db = yield* _(Database)
  const users = yield* _(db.query("SELECT * FROM users"))
  return users
})
// 型: Effect<any[], never, Database>
//                        ^^^^^^^^ 依存が型に現れる
```

---

## Effect-TS の限界とその先

### Effect-TS が解決できない課題

ライブラリレベルでの実装であり、**言語レベルのサポートではない**ため：

1. **ランタイムオーバーヘッド**: Effect の構築と実行にランタイムコストが発生
2. **型推論の限界**: TypeScript の型システムの制約により、完全な型推論ができない場合がある
3. **エコシステムとの統合**: 既存の Promise ベースのライブラリとの統合に追加のコードが必要
4. **デバッグの複雑さ**: スタックトレースが複雑になり、デバッグが難しくなる場合がある

### 言語レベルでの Effect System

根本的に解決するには、**言語レベルで Effect System をサポートする**必要がある：

| 言語 | 特徴 |
|------|------|
| **Haskell** | モナドを用いた Effect System により、副作用を型で管理 |
| **Koka** | Microsoft Research が開発。Algebraic Effects を言語レベルでサポート |
| **Eff** | Algebraic Effects と Handlers を言語の中核に据えた関数型言語 |
| **OCaml 5.0+** | Effect Handlers を言語機能として導入（注目株） |

---

## まとめ

### 本記事で解説したこと

1. **継続とは**: プログラムの「残りの計算」を表現する概念
2. **継続を扱う様々なアプローチ**: コールバック、CPS、Promise、async/await
3. **Effect System**: エラーと依存を管理し、コンパイル時に安全性を保証する仕組み

### プロダクション採用について

Effect-TSでのサンプルコードを紹介したが、**まだプロダクションレベルでの実践には至っていない**。

しかし、今後生成AIにプログラムを書かせる頻度が増加する中で、プログラムの品質をより効率的に担保する手段として、「Effect System」は非常に有力な選択肢。

**コンパイル時にエラーを検出できる**ことは、テストコード（ランタイム時検知）とは異なる強力な品質保証手段となる。

---

## 重要な洞察

1. **async/await の本質**: 非同期処理のための構文ではなく、「継続を普通のコードのように書けるようにした糖衣構文」
2. **Promiseの限界**: エラー型の不明確さ、処理漏れの検知不可、手動リソース管理
3. **Effect System の価値**: 型システムを活用してコンパイル時に安全性を保証
4. **AI時代の品質保証**: 生成AIがコードを書く時代に、コンパイル時検出は重要性が増す
