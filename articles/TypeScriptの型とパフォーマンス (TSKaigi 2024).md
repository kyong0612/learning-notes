---
title: "TypeScriptの型とパフォーマンス (TSKaigi 2024)"
source: "https://speakerdeck.com/ypresto/typescript-type-checking-and-its-performance"
author:
  - "ypresto (LayerX バクラク事業部)"
published: 2024-05-11
created: 2025-11-29
description: "TypeScriptのチューリング完全な型計算能力の裏側にあるパフォーマンス問題を解説。Type Instantiationの回数が型の重さに直結すること、Distributive Conditional Types、Template Literal Types、Generic Constraintsがループを引き起こすメカニズムを、MUIやreact-hook-formの実例から説明する。"
tags:
  - TypeScript
  - パフォーマンス
  - 型システム
  - tsserver
  - React
  - MUI
  - react-hook-form
  - TSKaigi
---

## 概要

TypeScriptの型システムはチューリング完全であり、ライブラリ利用者に高度な開発者体験を提供できる。しかし、使い方によってはエディタがフリーズするほどの負荷がかかる「諸刃の剣」でもある。本発表では、型が重くなる原因とその改善方法を解説する。

## エディタと型の関係

### tsserverの役割

エディタ（VS Code等）は以下の機能を`tsserver`に依存している：

- 補完
- 定義へのジャンプ
- エラー表示

**重要**: 編集体験は重い型の影響を受けやすい

| シナリオ | tscの場合 | tsserverの場合 |
|---------|----------|---------------|
| 若干重い型 | 影響は少ない | 大きな割合を占める |

tscは全ファイルを一括処理するため若干の重さは目立たないが、tsserverは開いているファイルごとにリアルタイムで型検査を行うため、重い型の影響を受けやすい。

> **Tip**: タブを閉じると型検査対象が減り、動作が軽くなる

## 型が重い #とは

### ずばり「型生成量オーダー」

**Type Instantiation**（型のインスタンス化）の回数が型の重さに直結する。

#### Type Instantiationとは

型パラメータを埋めた型を作る処理のこと：

```typescript
type ABC = { a: number, b: number; c: number }
type ABOnly = Omit<ABC, 'c'>; // ==> { a: number, b: number }
// 型チェックや補完などで必要なときに行われる
```

#### Omitの例（参考値：約6回のInstantiation）

```typescript
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
// T = { a: number, b: number; c: number } / K = 'c'

// 処理の流れ：
// 1. Exclude<'a' | 'b' | 'c', K> を評価（1回）
// 2. 分配処理で3回ループ
// 3. Pick<T, 'a' | 'b'> を評価（1回〜）
// 結果: { a: number, b: number }
```

### Type Instantiationの対象

| 型の種類 | 例 |
|---------|---|
| TypeParameter | `T` |
| IndexedAccessType | `T[xxx]`, `xxx[T]`, `xxx[keyof T]` |
| IndexType | `keyof T` |
| Conditional Type | `T extends U ? X : Y` |
| TemplateLiteralType | `` `...${T}...` `` |
| StringMappingType | `Uppercase<T>` |
| SubstitutionType | `T extends string ? Foo<T>` → `Foo<T & string>` |

## 型計算のホットスポット

### 1. Distributive Conditional Types

条件部分にUnionが渡ってきた場合に**分配**される仕組み。

```typescript
// 定義
type Exclude<T, U> = T extends U ? never : T;

// 分配なしの場合（機能しない）
('a' | 'b' | 'c') extends 'c' ? never : ('a' | 'b' | 'c')
// => 'a' | 'b' | 'c' になってしまう

// 分配による実際の動作（3回ループ）
| ('a' extends 'c' ? never : 'a')  // => 'a'
| ('b' extends 'c' ? never : 'b')  // => 'b'
| ('c' extends 'c' ? never : 'c')  // => never
// => 'a' | 'b'
```

#### JSX.IntrinsicElements の危険性

- キー数**178個**のドデカ構造
- `keyof`で便利だが**悪用厳禁**

```typescript
// 最も単純な違法TypeScriptコード
// 3重ループ 178x178x178 > 500万
// "Type Instantiation is excessively deep and possibly infinite."
```

### 2. Generic Constraints（Base Constraint）

`<T extends U>`の`U`の部分。オーバーロード解決時に問題を引き起こす。

#### オーバーロード解決の流れ

```typescript
function foo(): undefined          // 1
function foo(a: { foo: string }): number  // 2
function foo<T extends { b: number }>(a: T): T  // 3
function foo(a: number): number

foo({ b: 1, c: 2 })
// 上から順に評価
// 3番目でTを推論：T = { b: number }
// シグネチャをinstantiate: function foo(a: { b: number }): { b: number, c: number }
```

**問題**: 型パラメータが定まる前に、大きなConstraint型でInstantiateが走る

### 3. Template Literal Types

文字列パスを型として扱う場合に使用される。

```typescript
type PathSplit<T extends string> = 
  T extends `${infer A}.${infer B}` 
    ? (B extends '' ? [A] : [A, ...PathSplit<B>]) 
    : [T]

type A = PathSplit<'a.b.c'> // ==> ['a', 'b', 'c']
```

活用例：

- **react-hook-form**: `form.setValue('a.b.c', 123)` でパスの位置の型を取得
- **hono**: `/api/posts` → `client.api.posts.$get()` でオブジェクトを組み立て

## ライブラリでの実例

### MUIの例

2021〜2年当時、コードを開いて編集するだけで**数秒**待たされる状態に。

```typescript
export type OverrideProps<TypeMap, RootComponent extends React.ElementType> = (
  & BaseProps<TypeMap>
  & DistributiveOmit<
      React.ComponentPropsWithRef<RootComponent>,
      keyof BaseProps<TypeMap>
    >
);
```

**問題の根源**: `React.ElementType`（178個のタグ）をConstraintに持つ型パラメータ

計算量: **O(mn)** where m = タグ数(178), n = props数(aタグは281)
→ 約5万、実際は`ComponentPropsWithRef`全体で**15万回**程度のInstantiation

> **朗報**: TypeScript 5系へのバージョンアップで数秒 → 数100msに高速化

### react-hook-formの例

```typescript
// Valuesが大きい構造の場合
const form = useForm<Values>()
form.setValue('foo.bar.baz', 123) // とにかく重い！
```

#### 重い原因

```typescript
export type PathValue<T, P extends Path<T> | ArrayPath<T>> =
  T extends any 
    ? P extends `${infer K}.${infer R}` // Split（6程度）
      ? K extends keyof T 
        ? R extends Path<T[K]>  // 全件取得（215程度）
          ? PathValue<T[K], R>
          : never
        : // ...
```

計算量: **O(mn²)** where m = ドット分割の再帰数, n = 取りうるパスの合計数
→ 6×215×215 = 約28万、実際は**45万回**程度

## 改善方法

### 1. 型パラメータを自分で固定（やりたくない方法）

```typescript
<Button<button> />
setValue<'path', number>(...)
```

### 2. オーバーロードやインターフェースを工夫

#### 頻度の高くて軽いシグネチャを上に

```typescript
// Before（重い）
function foo<T extends ドデカい型>(a: { rarelyUsed: Complex<T> }): void
function foo(a: number): void

// After（軽い）
function foo(a: number): void  // こちらだけ使う人はドデカい型でinstantiateされずに済む
function foo<T extends ドデカい型>(a: { rarelyUsed: Complex<T> }): void
function foo(a: number): void  // エラー表示のため最後にも残す
```

> **honoの事例**: シグネチャ移動で**7倍**高速化（[PR #2412](https://github.com/honojs/hono/pull/2412)）

#### 関数の型パラメータの指定と使用を分ける

```typescript
// Before（1秒〜）
form.setValue(path, value)

// After（20ms〜）
form.field(path).setValue(value)
// pathの型パラメータがfield()で固定されてからPathValueに渡る
```

### 3. TypeScriptの計算に適したインターフェース設計

必要に応じて、TypeScriptの型計算の特性を考慮したAPI設計が必要。

## デバッグ方法

| 方法 | コマンド/ツール |
|------|----------------|
| tscでトレース | `tsc --noEmit --skipLibCheck --generateTrace [dirName] --extendedDiagnostics [fileName]` |
| Debugger接続 | TS Server Debug 拡張機能 |
| tsserverでtrace | vscodeの設定で起動時から有効化 |
| 動作中のtsserverでtrace | vscode拡張（New!） |

## まとめ

1. **若干重いだけでも編集体験に影響**する
2. **重いとは = Type Instantiation回数**
3. 以下が計算量増加の原因となる：
   - Distributive Conditional Types
   - Template Literal Types  
   - Generic Constraints
4. **型定義を工夫し、Instantiationを回避する**

> **「大いなる型パワーには、大いなるループが伴う」**
>
> **「コンパイラの気持ちになれば、回避できる！！」**

## 補足情報

### おもしろ例

```typescript
function Component({ sx }: { sx: SxProps }) {
  // 型パラメータが違ってstructualTypeRelatedToが重い
  // SxProps<Theme>が正解
  return <Button sx={sx} />
}
```

### TypeScriptへのPR

- `keyPropertyName`によるinstantiationの最適化
- Unionが10個以上のときだけ最適化が走る（が、重い）
- primitiveは数に含めない修正をPRしてmergeされた

## 参考リンク

- [TSKaigi 2024 発表ページ](https://tskaigi.org/talks/ypresto)
- [TypeScript Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
- [hono PR #2412](https://github.com/honojs/hono/pull/2412)
