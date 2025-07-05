---
title: "Documentation - TypeScript 2.0"
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator"
author:
  - "Mohamed Hegazy"
published:
created: 2025-07-05
description: |
  Release notes for TypeScript 2.0, introducing key features like null- and undefined-aware types (`--strictNullChecks`), control flow based type analysis, tagged union types, the `never` type, and read-only properties.
tags:
  - "TypeScript"
  - "release-notes"
  - "strictNullChecks"
  - "tagged-unions"
  - "control-flow-analysis"
---

# TypeScript 2.0 リリースノート概要

TypeScript 2.0では、言語とコンパイラに多数の重要な機能が導入されました。以下にその主要な変更点を要約します。

## NullおよびUndefinedを意識した型 (`--strictNullChecks`)

TypeScript 2.0の最も重要な機能の一つは、`null`と`undefined`をより安全に扱うための新しい厳格なnullチェックモードです。

- **`--strictNullChecks`フラグ**: このフラグを有効にすると、`null`と`undefined`はデフォルトですべての型の有効な値ではなくなります。値が `null` または `undefined` になる可能性がある場合は、`string | null` のようにユニオン型で明示的に宣言する必要があります。
- **代入前使用のチェック**: 厳格なnullチェックモードでは、`undefined`を許容しない型のローカル変数は、使用される前に必ず値が代入されている必要があります。
- **オプショナルなパラメータとプロパティ**: オプショナルなパラメータやプロパティ（例: `x?: number`）は、自動的に `number | undefined` 型として扱われます。
- **非null/undefined型ガード**: `if (x != null)` のようなチェックを行うと、そのブロック内では `x` の型から `null` と `undefined` が除外（ナローイング）されます。
- **非nullアサーション演算子 (`!`)**: `e!.name` のように、式が `null` でも `undefined` でもないことをコンパイラに伝えるための新しい後置演算子 `!` が導入されました。

## コントロールフローに基づく型分析

コンパイラは、コードのコントロールフローを分析して、特定の場所での変数の型をより正確に推論できるようになりました。これにより、`if`文、`switch`文、`return`文などの制御構造を考慮して、型ガードがより賢く機能します。

```ts
function foo(x: string | number) {
    if (typeof x === "number") {
        return;
    }
    x; // ここでは x の型は 'string' になります
}
```

## タグ付きユニオン型 (Discriminated Unions)

共通のプロパティ（通常は `kind` や `type` という名前）を持つ複数の型を組み合わせたユニオン型を、より安全に扱えるようになりました。`switch`文や `if`文でそのプロパティの値をチェックすることで、型が自動的に絞り込まれます。

```ts
type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size; // s は Square 型
        case "rectangle": return s.width * s.height; // s は Rectangle 型
        case "circle": return Math.PI * s.radius * s.radius; // s は Circle 型
    }
}
```

## `never` 型

決して発生することのない値の型を表す新しいプリミティブ型 `never` が導入されました。

- 常に例外を投げる関数や、無限ループする関数の戻り値の型として使用されます。
- `never` はすべての型のサブタイプであり、どの型にも代入可能です。しかし、`never` 自身を除いて、どの型も `never` には代入できません。

```ts
function error(message: string): never {
    throw new Error(message);
}
```

## 読み取り専用プロパティとインデックスシグネチャ

プロパティやインデックスシグネチャに `readonly` 修飾子を付けることができるようになりました。読み取り専用プロパティは、宣言時またはコンストラクタ内でのみ初期化できます。

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

## その他の主な機能

- **関数の `this` の型指定**: `function f(this: void)` のように、関数の `this` の型を明示的に宣言できるようになりました。
- **`tsconfig.json`でのGlobサポート**: `include` と `exclude` プロパティで `*`, `?`, `**/` といったGlobパターンが使えるようになりました。
- **モジュール解決の強化**: `baseUrl`, `paths`, `rootDirs` などのオプションにより、モジュール解決の柔軟性が向上しました。
- **未使用宣言のチェック**: `--noUnusedParameters` と `--noUnusedLocals` フラグにより、使われていないパラメータやローカル変数を検出できます。
- **`--skipLibCheck`**: 宣言ファイル（`.d.ts`）の型チェックをスキップし、コンパイル時間を短縮するオプションが追加されました。
- **`--declarationDir`**: 宣言ファイルをJavaScriptファイルとは別のディレクトリに出力できるようになりました。
- **抽象プロパティとアクセサ**: 抽象クラス内で抽象プロパティや抽象アクセサを宣言できるようになりました。

これらの機能により、TypeScript 2.0はより堅牢でスケーラブルなアプリケーション開発を可能にする、メジャーなアップデートとなりました。
