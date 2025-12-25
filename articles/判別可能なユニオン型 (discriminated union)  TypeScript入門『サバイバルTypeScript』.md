---
title: "判別可能なユニオン型 (discriminated union) | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/discriminated-union"
author:
published:
created: 2025-12-25
description: "TypeScriptの判別可能なユニオン型は、ユニオンに属する各オブジェクトの型を区別するための「しるし」がついた特別なユニオン型です。オブジェクトの型からなるユニオン型を絞り込む際に、分岐ロジックが複雑になる場合は、判別可能なユニオン型を使うとコードの可読性と保守性がよくなります。"
tags:
  - "clippings"
  - "TypeScript"
  - "ユニオン型"
  - "型システム"
  - "discriminated-union"
  - "型の絞り込み"
---

## 概要

TypeScriptの判別可能なユニオン型（discriminated union）は、ユニオンに属する各オブジェクトの型を区別するための「しるし」がついた特別なユニオン型です。タグ付きユニオン（tagged union）や直和型とも呼ばれます。オブジェクトの型からなるユニオン型を絞り込む際に、分岐ロジックが複雑になる場合は、判別可能なユニオン型を使うとコードの可読性と保守性がよくなります。

## 通常のユニオン型は絞り込みが複雑になる

通常のユニオン型では、型の絞り込みが複雑になることがあります。例えば、ファイルアップロードの状況を表現した次のようなユニオン型を考えます：

```typescript
type UploadStatus = InProgress | Success | Failure;

type InProgress = { done: boolean; progress: number };
type Success = { done: boolean };
type Failure = { done: boolean; error: Error };
```

この場合、`done`プロパティだけでは型を区別できず、`progress`や`error`の存在をチェックする必要があります。そのため、分岐処理が複雑になり、読みにくいコードになってしまいます：

```typescript
function printStatus(status: UploadStatus) {
  if (status.done) {
    if ("error" in status) {
      console.log(`アップロード失敗:${status.error.message}`);
    } else {
      console.log("アップロード成功");
    }
  } else if ("progress" in status) {
    console.log(`アップロード中:${status.progress}%`);
  }
}
```

## 判別可能なユニオン型とは？

判別可能なユニオン型は次の特徴を持ったユニオン型です：

1. **オブジェクトの型で構成されたユニオン型**
2. **各オブジェクトの型を判別するためのプロパティ（しるし）を持つ**
   - このプロパティのことをディスクリミネータ（discriminator）と呼ぶ
3. **ディスクリミネータの型はリテラル型などであること**
4. **ディスクリミネータさえあれば、各オブジェクトの型は固有のプロパティを持ってもよい**

先ほどの`UploadStatus`を判別可能なユニオン型に書き直すと、次のようになります：

```typescript
type UploadStatus = InProgress | Success | Failure;

type InProgress = { type: "InProgress"; progress: number };
type Success = { type: "Success" };
type Failure = { type: "Failure"; error: Error };
```

`done: boolean`がなくなり、`type`というディスクリミネータが追加されました。`type`の型が`string`ではなく、`"InProgress"`などのリテラル型になったことが重要な変更点です。

## 判別可能なユニオン型の絞り込み

判別可能なユニオン型は、ディスクリミネータを分岐すると型が絞り込まれます。if文でもswitch文でも、コンパイラーが型の絞り込みを理解できます：

```typescript
function printStatus(status: UploadStatus) {
  if (status.type === "InProgress") {
    console.log(`アップロード中:${status.progress}%`);
    // status は InProgress 型として推論される
  } else if (status.type === "Success") {
    console.log("アップロード成功", status);
    // status は Success 型として推論される
  } else if (status.type === "Failure") {
    console.log(`アップロード失敗:${status.error.message}`);
    // status は Failure 型として推論される
  }
}
```

switch文で書いても同じく絞り込みをコンパイラーが理解します：

```typescript
function printStatus(status: UploadStatus) {
  switch (status.type) {
    case "InProgress":
      console.log(`アップロード中:${status.progress}%`);
      break;
    case "Success":
      console.log("アップロード成功", status);
      break;
    case "Failure":
      console.log(`アップロード失敗:${status.error.message}`);
      break;
  }
}
```

判別可能なユニオン型を使うことで、コンパイラーが型の絞り込みを理解でき、分岐処理が読みやすく、保守性も高くなります。

## ディスクリミネータに使える型

ディスクリミネータに使える型は、リテラル型と`null`、`undefined`です：

- **リテラル型**
  - 文字列リテラル型: `"success"`、`"OK"`など
  - 数値リテラル型: `1`、`200`など
  - 論理値リテラル型: `true`または`false`
- `null`
- `undefined`

### 数値リテラル型のディスクリミネータ

```typescript
type OkOrBadRequest =
  | { statusCode: 200; value: string }
  | { statusCode: 400; message: string };

function handleResponse(x: OkOrBadRequest) {
  if (x.statusCode === 200) {
    console.log(x.value);
  } else {
    console.log(x.message);
  }
}
```

### 論理値リテラル型のディスクリミネータ

```typescript
type OkOrNotOk =
  | { isOK: true; value: string }
  | { isOK: false; error: string };

function handleStatus(x: OkOrNotOk) {
  if (x.isOK) {
    console.log(x.value);
  } else {
    console.log(x.error);
  }
}
```

### null/undefinedをディスクリミネータとして使う

`null`と非nullの関係にある型もディスクリミネータになれます：

```typescript
type Result =
  | { error: null; value: string }
  | { error: Error };

function handleResult(result: Result) {
  if (result.error === null) {
    console.log(result.value);
  } else {
    console.log(result.error);
  }
}
```

同様に`undefined`もundefined・非undefinedの関係が成り立つプロパティは、ディスクリミネータになります。

## ディスクリミネータを変数に代入する場合

ディスクリミネータを変数に代入し、その変数を条件分岐に使った場合も、型の絞り込みができます：

```typescript
type Shape =
  | { type: "circle"; color: string; radius: number }
  | { type: "square"; color: string; size: number };

function toCSS(shape: Shape) {
  const { type, color } = shape; // type がディスクリミネータ
  switch (type) {
    case "circle":
      return {
        background: color,
        borderRadius: shape.radius, // shape は circle 型として推論される
      };
    case "square":
      return {
        background: color,
        width: shape.size, // shape は square 型として推論される
        height: shape.size,
      };
  }
}
```

## まとめ

- 判別可能なユニオン型は、ディスクリミネータを持つオブジェクトの型からなるユニオン型
- if/switch分岐で型が絞り込みやすい
- ディスクリミネータは各オブジェクト共通のプロパティキー（しるし的なもの）
- 使える型は、リテラル型、`null`、`undefined`
- 通常のユニオン型よりもコードの可読性と保守性が向上する
