---
title: "TypeScriptのパフォーマンス改善"
source: "https://yajihum.dev/blog/posts/tech/20240218_tips_for_speeding_up_typescript"
author:
  - "yajihum"
published: 2024-02-22
created: 2025-06-17
description: "TypeScriptの公式ドキュメントに基づいてコンパイル速度と編集体験を向上させるための具体的なテクニックを解説。interfaceの使用、型注釈の活用、ユニオン型の最適化、複雑な型の名前付けなど、実用的なパフォーマンス改善手法をコード例とともに紹介。"
tags:
  - typescript
  - performance
  - compiler
  - interface
  - type-annotation
---

![絵文字アイコン](https://cdn.emoji.yajihum.dev/people/231.png)

# TypeScriptのパフォーマンス改善

TypeScriptのパフォーマンス向上についての公式ドキュメントがあります。この記事では、「TypeScriptにおける速さとは何か」を理解し、その上でコンパイルの観点でパフォーマンスを向上させるための具体的な方法をまとめます。

## 公式のドキュメント

TypeScriptのGithubリポジトリにあるWikiを見に行くと、Debugging TypeScriptのセクションにPerformanceについての[ドキュメント](https://github.com/microsoft/TypeScript/wiki/Performance)があります。

今回はこのドキュメントを参考にして見ていきます。

## TypeScriptにおける速さとは何か

ドキュメントには、TypeScriptにおける速さとは「より高速なコンパイルや編集が可能になる」ことを指していることが書かれています。

> There are easy ways to configure TypeScript to ensure faster compilations and editing experiences.

### 1. コンパイル速度

TypeScriptはJavaScriptに型情報を追加した言語で、コードを実行するためにはJavaScriptへのコンパイルが必要です。このTypeScriptからJavaScriptへの変換速度をコンパイル速度と呼びます。ビルド時間に直接影響を与えるため、コンパイル速度は可能な限り短縮することが望まれます。

### 2. 編集体験

編集体験とは、VSCodeなどのIDEやテキストエディターでコードを書く際の体験を指します。これらのツールを用いてTypeScriptを記述する際の型チェック、自動補完、リファクタリングなどの機能の動作速度は、TypeScriptのパフォーマンスに直結します。

ドキュメントではパフォーマンスを上げる方法がいくつか挙げられていますが、今回はコンパイルしやすいコードにするためのTipsを見ていきます。

## 型宣言にはtypeよりもinterfaceを使う

「typeとinterfaceのどちらを使うか」という議論が度々なされますが、TypeScript公式ではオブジェクト型に対するパフォーマンスの観点ではインターフェースを使うといいということが明言されています。

[GoogleのTypeScriptのスタイルガイド](https://google.github.io/styleguide/tsguide.html#prefer-interfaces)では、オブジェクト型はインターフェースを使用し、それ以外は型エイリアスで宣言することが推奨されています。

### インターフェースと型エイリアスの違い

typeを使った型宣言は**型エイリアス**(`type alias`)と呼ばれます。この型エイリアスとインターフェースは基本的に似た動作をしますが、オブジェクト型を合成するときはこれらの宣言の仕方に違いがあります。

#### インターフェースの場合

`extends`を使って以下のように宣言ができます。

```ts
interface Bar {
    prop: string;
}
interface Baz {
    anotherProp: number;
}

interface Foo extends Bar, Baz {
  someProp: string;
}
```

この`extends`を使った型の宣言は部分型(`subtype`)と呼ばれ、「FooはBarとBazの部分型」ということになります。

#### 型エイリアスの場合

`&`を使って**交差型**(`type aliases to intersections`)を作ることで型の合成が可能です。

```ts
type Bar = { prop: string };
type Baz = { anotherProp: number };

type Foo = Bar & Baz & {
    someProp: string;
}
```

### パフォーマンス上の違い

この2つには以下のようなTypeScriptでの挙動の違いがあります。

**インターフェース**:

1. 同じプロパティがあった場合はそれを検出し、単一のフラットなオブジェクトを生成する（プロパティのオーバーライド）
   - 無効な型があった場合はエラーを発生させる
2. エラーの可能性が排除されたフラットなオブジェクトのプロパティに対してのみ型チェックが行われる
3. 型関係がキャッシュされる

**交差型**:

1. ただ各プロパティを再帰的にマージするだけで、never型が生成されることもある
2. マージ結果がnever型などの無効な型であってもエラーは発生せず、型チェックは続行される
3. 型関係がキャッシュされない

### 具体的な例

```ts
// 交差型の例
type A = {
  prop: string;
  props: {
    someProp: string;
  }
};

type B = {
  prop: number;
  props: {
    anotherProp: number;
  }
};

type C = A & B;

// Cのマージ結果：stringとnumberは互いに排他的なため、この型はnever型となる
type C = {
  prop: never; // エラーは発生しない
  props: {
    someProp: string;
    anotherProp: number;
  }
}

// インターフェースの例
interface IA {
  prop: string;
  props: {
    someProp: string;
  }
};

interface IB {
  prop: number;
};

// プロパティの競合を検出しコンパイルエラーとなる
interface IC extends IA, IB {
  props: { 
    anotherProp: number;
  }
}
```

より早い段階でエラーを発生させ、無駄な処理を行わないという点でインターフェースの方がパフォーマンス上有利です。

## 型注釈を使用する

型注釈を積極的に使用することでコンパイラの作業負担を大幅に減らすことができます。

型注釈とは以下のように変数やオブジェクトに対して型を指定して限定させるものです。

```ts
const numberOfHappy: number = 123;
```

型注釈をつけることで型推論によって行われる匿名型の解釈よりも宣言ファイルの読み書きにかかる時間を減らすことができます。

### 型注釈の有無による違い

#### 型注釈をつけない場合

```ts
// foo.ts
export interface Result {
  headers: any;
  body: string;
}

export async function makeRequest(): Promise<Result> {
  throw new Error("unimplemented");
}

// bar.ts
import { makeRequest } from "./foo";

export function doStuff() {
  return makeRequest();
}
```

コンパイル結果：

```ts
// foo.d.ts
export interface Result {
  headers: unknown;
  body: string;
}
export declare function makeRequest(): Promise<Result>;

// bar.d.ts
export declare function doStuff(): Promise<import("./foo").Result>;
```

このように型注釈をつけないとdoStuffの戻り値の型が`Promise<import("./foo").Result>`となっています。TypeScriptでは別ファイルからResult型を取得するために以下のステップを踏む必要があります：

1. 参照したい型が現在のスコープ内で直接アクセス可能かどうかを確認
2. アクセス可能でない場合、他のモジュールからインポートできるかどうかを確認
3. インポートできる場合、該当のファイルをインポートするための最も適切なパスを計算
4. 型参照を表現するための新しいノード（ASTの一部）を生成
5. 生成された型参照ノードを出力

#### 型注釈をつけた場合

```ts
// bar.ts
import { Result, makeRequest } from "./foo";

export function doStuff(): Promise<Result> {
  return makeRequest();
}

// bar.d.ts
import { Result } from "./foo";
export declare function doStuff(): Promise<Result>;
```

`bar.ts`で元から型のインポートを行っているため、型注釈がない場合のインポート先を探す一連の流れが省かれます。

### 使用の指針

型推論はとても便利な機能なので全てのコードに対して明示的に型を指定する必要はありませんが、コードに遅い部分があった場合は型注釈をつけることを試してみると良いでしょう。

> Type inference is very convenient, so there's no need to do this universally - however, it can be a useful thing to try if you've identified a slow section of your code.

## ユニオン型よりも基本型を使用する

TypeScriptではユニオン型を使用して複数の型を一つの型にまとめることができます。

```ts
let numberOfHappy: number | undefined;
```

### ユニオン型のパフォーマンス問題

ユニオン型を使用すると、それぞれの型が異なる可能性があるためコンパイラは各型をチェックする必要があります。

例えば、以下の`printSchedule`関数では引数が渡されるたびにユニオン型の各要素の比較の処理が走ります。

```ts
interface WeekdaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  wake: Time;
  startWork: Time;
  endWork: Time;
  sleep: Time;
}

interface WeekendSchedule {
  day: "Saturday" | "Sunday";
  wake: Time;
  familyMeal: Time;
  sleep: Time;
}

declare function printSchedule(schedule: WeekdaySchedule | WeekendSchedule);
```

比較する型が2つしかない場合はそこまでコストはかからないですが、**12個以上になるとコンパイル速度に大きな差が生じます**。

大きなユニオン型同士を交差（合成）させるときを考えると、ユニオン型の各要素から重複するプロパティを削除する場合は各要素を2つずつ比較する必要があり、比較する要素が増えれば増えるほどコストはn²ずつ増加していきます。

### 部分型を使った解決方法

この問題を解決するための手段として、ユニオン型ではなく部分型(`subtype`)を使用する方法があります。

```ts
interface Schedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  wake: Time;
  sleep: Time;
}

interface WeekdaySchedule extends Schedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startWork: Time;
  endWork: Time;
}

interface WeekendSchedule extends Schedule {
  day: "Saturday" | "Sunday";
  familyMeal: Time;
}

const printSchedule = (schedule: Schedule) => {
  console.log(schedule);
};

const weekday: WeekdaySchedule = {
  day: "Monday",
  wake: { hour: 7, minute: 0 },
  startWork: { hour: 9, minute: 0 },
  endWork: { hour: 17, minute: 0 },
  sleep: { hour: 23, minute: 0 }
};
// 引数にはScheduleの部分型であるWeekdayScheduleを渡せる
printSchedule(weekday);
```

`Schedule`型を新たに作成し、WeekdayScheduleやWeekendScheduleの型でこれを継承させています。そして`printSchedule`関数の引数で`Schedule`を指定しています。こうすることで、ユニオン型と比べ`Schedule`という一つの型のみのチェックとすることができます。

このようにユニオン型ではなく部分型を使用して一つの型の参照（基本型）にすることでパフォーマンスコストを抑えることができます。

## 複雑な型は名前付けをする

例えば以下のような複数の条件分岐によって戻り値の型が定義されている関数があるとします。

```ts
interface SomeType<T> {
  foo<U>(x: U):
      U extends TypeA<T> ? ProcessTypeA<U, T> :
      U extends TypeB<T> ? ProcessTypeB<U, T> :
      U extends TypeC<T> ? ProcessTypeC<U, T> :
      U;
}
```

### 問題点

この書き方の場合、以下の問題があります：

1. 関数fooが実行されるたびに戻り値の条件型を検証する必要がある
2. SomeType型の複数のインスタンスを比較する際にはfooの戻り値の型構造を再度検証する必要がある
3. 複雑な条件分岐を持つ型は、型の比較が行われるたびに型が検証されるため、パフォーマンスに影響を与える

### 型エイリアスを使った解決方法

このコストを抑える方法として、型エイリアスを使用して戻り値の型に名前付けを行うと良いです。

```ts
type FooResult<U, T> =
    U extends TypeA<T> ? ProcessTypeA<U, T> :
    U extends TypeB<T> ? ProcessTypeB<U, T> :
    U extends TypeC<T> ? ProcessTypeC<U, T> :
    U;

interface SomeType<T> {
    foo<U>(x: U): FooResult<U, T>;
}
```

こうすることで一度型の検証が行われるとコンパイラはキャッシュし、もし同じ型が出現した際にはキャッシュを利用してパフォーマンスを上げることができます。

## まとめ

TypeScriptのWikiを参考にTypeScriptをより速くする方法をいくつか紹介しました。

### 主なポイント

1. **型宣言にはtypeよりもinterfaceを使う**
   - 型関係がキャッシュされる
   - 早期エラー検出により無駄な処理を回避

2. **型注釈を積極的に使用する**
   - コンパイラの型推論の負担を軽減
   - 宣言ファイルの読み書き時間を短縮

3. **ユニオン型よりも基本型（部分型）を使用する**
   - 型チェックのコストをn²からnに削減
   - 特に12個以上の型を扱う場合に効果的

4. **複雑な型は名前付けする**
   - 型検証結果のキャッシュを活用
   - 再利用時のパフォーマンス向上

### 注意点

本ドキュメントにもありますが、紹介した方法のメリットデメリットはもちろんあるため、ケースバイケースでより適切な方法を選択をすると良いでしょう。

また、本記事では紹介していませんが、[TypeScriptのパフォーマンスドキュメント](https://github.com/microsoft/TypeScript/wiki/Performance#using-project-references)の後半には他にもTypeScriptのパフォーマンスに関する内容が書かれているため是非参照してみてください。

## 参考文献

- [Performance · microsoft/TypeScript Wiki](https://github.com/microsoft/TypeScript/wiki/Performance)
- [GoogleのTypeScriptスタイルガイドライン：Prefer interfaces over type literal aliases](https://google.github.io/styleguide/tsguide.html#prefer-interfaces)
- [変数宣言の型注釈 (type annotation) | TypeScript入門『サバイバルTypeScript』](https://typescriptbook.jp/reference/values-types-variables/type-annotation)
