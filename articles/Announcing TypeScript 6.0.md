---
title: "Announcing TypeScript 6.0"
source: "https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/"
author:
  - "[[Daniel Rosenwasser]]"
published: 2026-03-06
created: 2026-03-24
description: |
  TypeScript 6.0がリリースされた。現行のJavaScriptコードベースに基づく最後のリリースであり、Goで書き直されたネイティブポートであるTypeScript 7.0への移行を準備するブリッジリリースとして位置づけられる。新機能（this不使用関数のコンテキスト感度低減、Temporal型、es2025サポートなど）に加え、多数のデフォルト値変更と非推奨化（strict: trueデフォルト化、target: es5廃止、moduleResolution node廃止など）が含まれる。
tags:
  - TypeScript
  - TypeScript 6.0
  - TypeScript 7.0
  - コンパイラ
  - 破壊的変更
---

# Announcing TypeScript 6.0

ref: <https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/>

---

## 概要

TypeScript 6.0 は、現在のJavaScriptコードベースに基づく**最後のリリース**として位置づけられる。TypeScript 7.0はGoで書き直されたネイティブコンパイラとなり、ネイティブコードの速度と共有メモリマルチスレッドを活用する。TypeScript 6.0は **5.9と7.0の橋渡し**として機能し、大部分の変更はTypeScript 7.0への移行を支援するためのものである。

> TypeScript 7.0は完成に**極めて近い**状態にあり、[VS Code拡張](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)や[npm](https://npmx.dev/package/@typescript/native-preview)で試用可能。

```sh
npm install -D typescript
```

---

## Beta/RC以降の変更点

- **ジェネリック呼び出しにおける関数式の型チェック強化**: 特にジェネリックJSX式内での関数式チェックが改善。既存コードのバグをより多く検出するが、一部のジェネリック呼び出しで明示的な型引数が必要になる場合がある ([PR #63163](https://github.com/microsoft/TypeScript/pull/63163))
- **import assertion構文の非推奨を `import()` 呼び出しに拡大**: `import(..., { assert: {...}})` も非推奨に ([PR #63172](https://github.com/microsoft/TypeScript/pull/63172))
- **DOM型の更新**: 最新のWeb標準に対応。Temporal APIの調整を含む

---

## 新機能

### `this` を使用しない関数のコンテキスト感度低減

TypeScriptはジェネリック関数の型推論時、明示的な型がないパラメータを持つ関数（**コンテキスト感度のある関数**）をスキップして他の引数から先に推論を行う。

**問題**: メソッド構文で書かれた関数は暗黙の `this` パラメータを持つため、アロー関数とは異なりコンテキスト感度ありと判定され、プロパティの記述順序によっては型推論が失敗していた。

```typescript
callIt({
    consume(y) { return y.toFixed(); },
    //                  ~
    // error: 'y' is of type 'unknown'.  ← メソッド構文だとエラー
    produce(x: number) { return x * 2; },
});
```

**解決**: TypeScript 6.0では、`this` が関数内で**実際に使用されていない**場合、その関数はコンテキスト感度なしと見なされる。これにより上記の例が正常に動作する。

> コントリビュータ: [Mateusz Burzyński](https://github.com/Andarist) ([PR #62243](https://github.com/microsoft/TypeScript/pull/62243))

### `#/` で始まるSubpath Imports

Node.jsの[subpath imports](https://nodejs.org/api/packages.html#subpath-imports)で、`#/` プレフィックスがサポートされた。従来は `#root/*` のように `#` の後に何かを書く必要があったが、`#/*` と簡潔に書けるようになった。

```json
{
    "imports": {
        "#/*": "./dist/*"
    }
}
```

- `--moduleResolution nodenext` および `bundler` で利用可能
- 新しいNode.js 20リリースでサポート

> コントリビュータ: [magic-akari](https://github.com/magic-akari) ([PR #62844](https://github.com/microsoft/TypeScript/pull/62844))

### `--moduleResolution bundler` と `--module commonjs` の組み合わせ

従来は `--module esnext` または `--module preserve` との組み合わせのみ許可されていたが、`--moduleResolution node` (node10) の非推奨化に伴い、`--module commonjs` との組み合わせが最適なアップグレードパスとなるケースが多い ([PR #62320](https://github.com/microsoft/TypeScript/pull/62320))。

### `--stableTypeOrdering` フラグ

TypeScript 7.0への移行を支援する新フラグ。

**背景**: TypeScriptは型IDを処理順に割り当て、union型のソートに使用する。TypeScript 7.0では並列型チェックのため、内容ベースの決定論的アルゴリズムでソートする。

**効果**: 6.0の型順序を7.0に合わせ、出力の差分を減らす。

**注意点**:
- 型チェックに**最大25%のスローダウン**が発生し得る
- 6.0→7.0の移行診断用であり、**長期的な使用は意図されていない**
- 推論の差異でエラーが出た場合は明示的な型引数や型注釈を追加する

> [PR #63084](https://github.com/microsoft/TypeScript/pull/63084)

### `es2025` の `target` / `lib` オプション

- 新しいJavaScript言語機能はないが、組み込みAPIの型（`RegExp.escape` など）が追加
- `esnext` から `es2025` に移動された宣言: `Promise.try`、`Iterator` メソッド、`Set` メソッド

> コントリビュータ: [Kenta Moriuchi](https://github.com/petamoriken) ([PR #63046](https://github.com/microsoft/TypeScript/pull/63046))

### Temporal APIの型

[Temporalプロポーザル](https://github.com/tc39/proposal-temporal)がStage 4に到達。TypeScript 6.0にビルトイン型が含まれるようになった。

```typescript
let yesterday = Temporal.Now.instant().subtract({ hours: 24 });
let tomorrow = Temporal.Now.instant().add({ hours: 24 });
```

- `--target esnext` または `"lib": ["esnext"]`（または `esnext.temporal`）で利用可能
- [MDNドキュメント](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

> コントリビュータ: [Renegade334](https://github.com/Renegade334) ([PR #62628](https://github.com/microsoft/TypeScript/pull/62628))

### "upsert" メソッド（`getOrInsert` / `getOrInsertComputed`）の型

[ECMAScript upsertプロポーザル](https://github.com/tc39/proposal-upsert)（Stage 4）の `Map` / `WeakMap` 新メソッドの型が追加。

```typescript
// Before
if (compilerOptions.has("strict")) {
    strictValue = compilerOptions.get("strict");
} else {
    strictValue = true;
    compilerOptions.set("strict", strictValue);
}

// After
let strictValue = compilerOptions.getOrInsert("strict", true);
```

- `getOrInsertComputed`: デフォルト値の計算が高コストな場合にコールバックで遅延評価

> コントリビュータ: [Renegade334](https://github.com/Renegade334) ([PR #62612](https://github.com/microsoft/TypeScript/pull/62612))

### `RegExp.escape`

[RegExp Escapingプロポーザル](https://github.com/tc39/proposal-regex-escaping)（Stage 4）。正規表現の特殊文字を自動エスケープする。

```typescript
const escapedWord = RegExp.escape(word);
const regex = new RegExp(`\\b${escapedWord}\\b`, "g");
```

- `es2025` libで利用可能

> コントリビュータ: [Kenta Moriuchi](https://github.com/petamoriken) ([PR #63046](https://github.com/microsoft/TypeScript/pull/63046))

### `dom` libに `dom.iterable` / `dom.asynciterable` を統合

`lib.dom.d.ts` に `dom.iterable` と `dom.asynciterable` の内容が完全に統合された。

```typescript
// 以前: "lib": ["dom", "dom.iterable"] が必要だった
// 現在: "lib": ["dom"] だけでOK
for (const element of document.querySelectorAll("div")) {
    console.log(element.textContent);
}
```

> [Issue #60959](https://github.com/microsoft/TypeScript/issues/60959) / [PR #62111](https://github.com/microsoft/TypeScript/pull/62111)

---

## 破壊的変更と非推奨化

TypeScript 6.0はTypeScript 7.0（ネイティブポート）への準備として、多数の破壊的変更と非推奨化を導入する。非推奨オプションは `"ignoreDeprecations": "6.0"` で一時的に無視可能だが、**TypeScript 7.0ではサポートされない**。

> 自動調整ツール: [ts5to6](https://github.com/andrewbranch/ts5to6)（`baseUrl` や `rootDir` の自動調整）

### 多くのプロジェクトに必要な事前調整

| 調整事項 | 症状 |
|---|---|
| `"types": ["node"]` をtsconfigに設定 | 大量の型エラー（missing identifiers, unresolved modules） |
| `"rootDir": "./src"` を明示的に設定 | ファイルが `./dist/src/index.js` に出力される |

### デフォルト値の変更

| オプション | 旧デフォルト | 新デフォルト |
|---|---|---|
| `strict` | `false` | **`true`** |
| `module` | `commonjs` | **`esnext`** |
| `target` | `es3`/`es5` | **当年のES版（現在 `es2025`）** |
| `noUncheckedSideEffectImports` | `false` | **`true`** |
| `libReplacement` | `true` | **`false`** |
| `rootDir` | 推論 | **`.`（tsconfig.jsonのディレクトリ）** |
| `types` | `@types/*` 全列挙 | **`[]`（空配列）** |

**`types` のデフォルト変更は特に影響が大きい**: `types` を適切に設定するだけで、**ビルド時間が20〜50%改善**されたプロジェクトもある。

### 非推奨化されたオプション一覧

| 非推奨オプション | 推奨移行先 |
|---|---|
| `target: es5` | `es2015` 以上。ES5出力が必要なら外部コンパイラを使用 |
| `--downlevelIteration` | ES5非推奨に伴い不要 |
| `--moduleResolution node` (node10) | `nodenext`（Node.js直接）または `bundler`（バンドラー/Bun） |
| `--module amd / umd / systemjs / none` | ESM対応のモジュールターゲットに移行 |
| `--baseUrl` | 削除し、`paths` エントリにプレフィックスを追加 |
| `--moduleResolution classic` | `nodenext` または `bundler` |
| `--esModuleInterop false` | 常にtrue（安全なインターオペレーション挙動を強制） |
| `--allowSyntheticDefaultImports false` | 常にtrue |
| `--alwaysStrict false` | 常にstrict mode（予約語を識別子として使用不可） |
| `--outFile` | Webpack / Rollup / esbuild 等の外部バンドラーに移行 |
| `module` キーワードによる名前空間宣言 | `namespace` キーワードを使用 |
| import `asserts` 構文 | `with` 構文に移行 |
| `/// <reference no-default-lib="true"/>` | `--noLib` または `--libReplacement` |

### tscコマンドライン引数とtsconfig.jsonの共存エラー

`tsconfig.json` が存在するディレクトリで `tsc foo.ts` を実行するとエラーになる。意図的に無視する場合は `--ignoreConfig` フラグを使用する。

```sh
tsc --ignoreConfig foo.ts
```

---

## TypeScript 7.0への準備

- TypeScript 6.0で非推奨となったオプションは `"ignoreDeprecations": "6.0"` でエラーを抑制可能
- ただし、TypeScript 7.0では**これらのオプションは完全に削除**される
- 7.0のネイティブプレビュー（[npm](https://www.npmjs.com/package/@typescript/native-preview) / [VS Code拡張](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)）での早期検証を推奨

## 今後の展望

- チームはTypeScript 7.0の安定化に注力
- **数ヶ月以内のリリース**が見込まれている
- Microsoft内外の大規模コードベースですでに広く採用が進んでいる
- フィードバックは [typescript-go Issue Tracker](https://github.com/microsoft/typescript-go/issues) へ

---

**重要なポイント:**

- TypeScript 6.0はJavaScript実装の**最後のバージョン**であり、7.0はGoによるネイティブ実装
- `strict: true`、`module: esnext`、`target: es2025` がデフォルトに変更
- `types` のデフォルトが `[]` に変更され、多くのプロジェクトで対応が必要
- ES5ターゲット、AMD/UMD/SystemJSモジュール、`baseUrl`、`moduleResolution node` など多数のレガシーオプションが非推奨
- Temporal API、Map upsertメソッド、`RegExp.escape` などES2025+の新機能型が追加
- `--stableTypeOrdering` フラグで7.0との出力差分を診断可能（ただしパフォーマンスコストあり）
