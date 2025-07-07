---
title: "Node.js — Running TypeScript Natively"
source: "https://nodejs.org/en/learn/typescript/run-natively"
author:
  - "AugustinMauroy"
  - "khaosdoctor"
  - "jakebailey"
  - "robpalme"
published:
created: 2025-07-07
description: |
  Node.js v22.6.0以降で実験的にサポートされた、TypeScriptをネイティブに実行する方法について解説します。--experimental-strip-typesフラグや--experimental-transform-typesフラグを使用することで、トランスパイルなしにTypeScriptコードを実行できます。
tags:
  - "clippings"
  - "Node.js"
  - "TypeScript"
---

> Node.js v23.6.0以降では、デフォルトで「型情報の除去（type stripping）」が有効になります。v23.6.0以降を使用していて、ソースコードに[消去可能なTypeScript構文](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option)のみが含まれている場合、この記事は不要です。

## Node.jsでTypeScriptコードを実行する

Node.js v22.6.0以降では、「型情報の除去」を通じて一部のTypeScript構文が実験的にサポートされています。これにより、TypeScriptコードを事前にトランスパイルすることなく、Node.jsで直接記述・実行できます。

`--experimental-strip-types`フラグは、実行前にTypeScriptコードから型注釈を除去するようNode.jsに指示します。

```shell
node --experimental-strip-types example.ts
```

v22.7.0では、`--experimental-transform-types`フラグが追加され、`enum`や`namespace`のようなTypeScript固有の構文を変換する実験的サポートが拡張されました。このフラグを有効にすると、`--experimental-strip-types`も自動的に有効になります。

```shell
node --experimental-transform-types another-example.ts
```

v23.6.0からは、型情報の除去がデフォルトで有効になり（`--no-experimental-strip-types`で無効化可能）、サポートされている構文はフラグなしで実行できます。

```typescript
function foo(bar: number): string {
  return 'hello';
}
```

ただし、以下のコードのように変換が必要な構文の実行には、引き続き`--experimental-transform-types`が必要です。

```typescript
enum MyEnum {
  A,
  B,
}

console.log(MyEnum.A);
```

将来のNode.jsバージョンでは、コマンドラインフラグなしでのTypeScriptサポートが含まれる予定です。

## 制限事項

現時点では、Node.jsのTypeScriptに対する実験的サポートにはいくつかの制限があります。詳細は[APIドキュメント](https://nodejs.org/docs/latest-v23.x/api/typescript.html#typescript-features)で確認できます。

### 設定

Node.jsのTypeScriptローダー（Amaro）は、TypeScriptコードの実行に`tsconfig.json`を必要とせず、また使用もしません。

エディタと`tsc`がNode.jsの挙動を反映するように、TypeScript v5.7以上を使用し、[こちら](https://nodejs.org/api/typescript.html#type-stripping)にリストされている`compilerOptions`を使用して`tsconfig.json`を作成することを推奨します。

## 重要な注意点

この機能は実験的なものであり、いくつかの制限があります。ユースケースに合わない場合は、別の方法を使用するか、修正に貢献してください。バグ報告も歓迎されますが、プロジェクトはボランティアによって運営されているため、修正を自分で提供できない場合は忍耐強くお待ちください。
