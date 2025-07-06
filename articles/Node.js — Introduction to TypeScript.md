---
title: "Node.js — Introduction to TypeScript"
source: "https://nodejs.org/en/learn/typescript/introduction"
author:
  - "Szymon Bielenica"
  - "Claudio W"
  - "Vaishnav M K"
  - "Augustin Mauroy"
published:
created: 2025-07-06
description: |
  TypeScript is an open-source language maintained by Microsoft that adds syntax to JavaScript for better editor integration, early error catching, and more maintainable code.
tags:
  - "Node.js"
  - "TypeScript"
  - "JavaScript"
  - "Types"
---
## TypeScriptとは

**[TypeScript](https://www.typescriptlang.org/)** は、Microsoftによって開発・メンテナンスされているオープンソース言語です。JavaScriptに構文を追加し、エディタとの連携を強化することで、開発の早い段階でエラーを検出し、保守性の高いコードを書くことを支援します。

## 最初のTypeScriptコード

以下はTypeScriptのコード例です。

```ts
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine = {
  name: 'Justine',
  age: 23,
} satisfies User;

const isJustineAnAdult = isAdult(justine);
```

このコードでは、まず `User` というカスタムオブジェクト型を定義しています。次に関数 `isAdult` を定義し、`User` 型の引数を受け取り、`boolean` を返します。`justine` というデータを作成し、この関数を呼び出しています。

特筆すべきは、TypeScriptが型定義に準拠しないコードをエラーとして通知する点と、型の明示的な指定がない場合でも型を推論する点です（例：`isJustineAnAdult` は自動的に `boolean` 型になります）。

## TypeScriptの構成要素

TypeScriptは主に「コード」と「型定義」の2つの要素で構成されます。

### TypeScriptコード

型注釈などのTypeScript独自の構文が追加された、通常のJavaScriptコードです。コンパイルされるとTypeScript固有の部分は削除され、どの環境でも実行可能なクリーンなJavaScriptになります。

```ts
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

### 型定義 (Type Definitions)

型定義は、既存のJavaScriptコードの「形状」を記述するもので、通常 `.d.ts` ファイルに保存されます。これらは実際の実装を含まず、型情報のみを記述します。これにより、JavaScriptライブラリとの相互運用性が高まります。

例えば、Node.jsでTypeScriptを使用する場合、`@types/node` をインストールすることでNode.js APIの型定義を利用できます。

```bash
npm add --save-dev @types/node
```

これにより `fs.readFile` のようなNode.jsの関数を使用する際に、型チェックや自動補完が機能します。

```ts
import * as fs from 'fs';

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

多くの一般的なJavaScriptライブラリは、DefinitelyTypedコミュニティによってメンテナンスされている `@types` 名前空間の下で型定義が提供されています。

### 変換機能 (Transform Capabilities)

TypeScriptには、特にJSX（Reactなどで使用）のための強力な変換機能も含まれています。TypeScriptコンパイラは、BabelのようにJSX構文を通常のJavaScriptに変換できます。これは、TypeScriptが単なる型チェックツールではなく、最新のJavaScript構文を異なる環境向けに変換するビルドツールでもあることを示しています。

## TypeScriptコードの実行方法

TypeScriptコードを実行するにはいくつかの方法があり、それらについては後続の記事で解説されます。
