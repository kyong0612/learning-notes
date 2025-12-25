---
title: "型のメンタルモデル | TypeScript入門『サバイバルTypeScript』"
source: "https://typescriptbook.jp/reference/values-types-variables/mental-model-of-types"
author:
published:
created: 2025-12-25
description: "TypeScriptの型システムを集合論的な観点から理解するためのメンタルモデルを構築する。型理論の背景、集合論的なデザイン、ユニット型・ボトム型・トップ型・ダイナミック型などの重要な型の概念、部分型関係の解釈について解説する。"
tags:
  - "clippings"
  - "TypeScript"
  - "型システム"
  - "型理論"
  - "集合論"
  - "メンタルモデル"
---

# 型のメンタルモデル

## 型システムの背景理論

プログラミング言語の型システムにはそれぞれ固有の世界観があり、言語ごとに型の機能が異なります。一方で複数の言語で共通している機能もあり、それらの型の機能は**型理論**(type theory)と呼ばれる数学的な研究分野に基づいて実装されています。

TypeScriptの`unknown`型や`never`型のような一見何のためにあるか分からないような型であっても、型理論においてはその役割や機能を一般的に説明することができます。これらの型はトップ型やボトム型と呼ばれる型の種類に分類され、部分型関係が作る階層構造の両端点に位置する型として振る舞います。

型理論的な観点からの知識を持つことで、似たような型システムを持つ他の言語においても型の機能について自然に推論することが可能になります。たとえばScalaというプログラミング言語では`Nothing`と呼ばれる型が型階層のボトムに位置することから`never`型と同じ働きをすることが推論できます。

型理論は非常に奥深く難解な分野でもありますが、その一方で比較的簡単に理解できて実用的にも役立つ概念も非常に多くあります。

### より深く学ぶには

- 『[型システム入門 プログラミング言語と型の理論](https://www.ohmsha.co.jp/book/9784274069116/)』の単純型や部分型付けの章
- 『[論理学](https://www.utp.or.jp/book/b298898.html)』（東京大学出版会）などの書籍を合わせて読むと推論規則などが比較的読みやすくなる

## 集合論的なデザイン

型のメンタルモデル、つまり「型をどのように解釈するか」を考える上で非常に有用でありながら身近な数学的なツールがあります。それが**集合論**(set theory)であり、この章では「**型=集合**」として考えることにします。

一般に型(type)と集合(set)は異なる概念ですが、型理論と集合論の間には密接な関連があります。特にTypeScriptにおいては、型を集合論的に扱えるようなデザインが意図的になされており、型を「**値の集合**」として捉えることで直感的に型を理解することができるようになっています。この見方は決して偏ったものではなく、[公式ドキュメント](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html#types-as-sets)でも推奨されている型の考え方です。

## 和集合と共通部分

型を集合論的に扱えるお陰で、TypeScriptの型は集合が持つような演算の一部を利用することができます。TypeScriptではそのような演算の中で和集合と共通部分を演算に相当する[ユニオン型](/reference/values-types-variables/union)と[インターセクション型](/reference/values-types-variables/intersection)が備わっています。

```typescript
type A = { a: string };
type B = { b: number };

// AとBの和集合を表現する型
type Union = A | B;

// AとBの共通部分を表現する型
type Intersection = A & B;
```

直感的にはユニオン型はふたつの集合の和集合を表現する型であり、インターセクション型はふたつの型の共通部分を表現する型です。ユニオン型は特に型の絞り込み(narrowing)において特に重要な役割を果たし、型の和集合から選択的に型の候補を削っていくことができます。

```typescript
type StrOrNum = string | number;

function narrowUnion(param: StrOrNum) {
  if (typeof param === "string") {
    // stringとnumberの和集合からstringを削る
    console.log(param.toUpperCase());
  } else {
    // 残された集合はnumber
    console.log(param * 3);
  }
}
```

## ユニット型

**ユニット型**(unit type)とは文字通りの単位的な型であり、型の要素として値をひとつしか持たないような型です。集合論においては単一の要素からなる集合は単位集合(unit set)や単集合(singleton set)など呼ばれます。

TypeScriptでは以下の型がユニット型に相当します：

- `null`型：`null`という単一の値を持つ
- `undefined`型：`undefined`という単一の値を持つ
- [リテラル型](/reference/values-types-variables/literal-types)：値リテラルをそのまま型として表現できる型
  - 文字列リテラル型：`"st"`, `"@"`, ...
  - 数値リテラル型：`1`, `3.14`, `-2`, ...
  - 真偽値リテラル型：`true`, `false` のふたつのみ

```typescript
type N = null;
const n: N = null;

type U = undefined;
const u: U = undefined;

type Unit = 1;
const one: Unit = 1;
```

型は値の集合でしたが、具体的な値はそのリテラル型と一対一で対応します。

集合の要素の個数は「濃度(cardinality)」と呼ばれる概念によって一般化され、基数という数によって表記されます。たとえば、要素がひとつしかない単位集合の濃度は１です。つまり、型を集合としてみなしたときのユニット型の濃度は１ということになります。

真偽値を表す `boolean` という型の要素(値)は`true`と`false`のみであり、`boolean`型の変数にはそれら以外の値を割り当てることはできません。したがって`boolean`型は濃度2の集合としてみなせます。

```typescript
const b1: boolean = true;
const b2: boolean = false;
const b3: boolean = 1; // Type 'number' is not assignable to type 'boolean'.
```

ふたつの単集合`true`と`false`を合成してふたつの型(あるいは値)から和集合を作成すると濃度2の型を得ることができます。

```typescript
type Bool = true | false;
```

このようにユニオン型で合成した型`Bool`は`boolean`型と同一の型となります。

## ボトム型

**ボトム型**(bottom type)とは値をまったく持たないような型です。型が集合であるとするとき、ボトム型は空集合(empty set)に相当し、空型(empty type)とも呼ばれることがあります。

ボトム型は値をまったく持たない型として、例外が発生する関数の返り値の型として利用されますが、TypeScriptでのボトム型は部分型階層の一番下、つまりボトムの位置に存在している`never`型となります。

```typescript
function neverReturn(): never {
  throw new Error("決して返ってこない関数");
}
```

`never`型は集合としては空集合であり、値をひとつも持たないため、その型の変数にはどのような要素も割り当てることができません。

```typescript
const n: never = 42; // Type 'number' is not assignable to type 'never'.
```

## トップ型

**トップ型**(top type)とはすべての値を持つような型です。トップ型はすべての値を持っており、その型の変数にはあらゆる値を割り当てることができます。オブジェクト指向言語であれば大抵は型階層のルート位置、つまりトップ位置に存在している型であり、TypeScriptでは`unknown`型がトップ型に相当します。

```typescript
const u1: unknown = 42;
const u2: unknown = "st";
const u3: unknown = { p: 1 };
const u4: unknown = null;
const u5: unknown = () => 2;
```

ボトム型が空集合に相当するなら、トップ型は全体集合に相当すると言えるでしょう。なおTypeScriptでは`{} | null | undefined`という特殊なユニオン型を`unknown`型相当として扱い、相互に割当可能としています。

```typescript
declare const u: unknown;
const t: {} | null | undefined = u;
```

`{}`はプロパティを持たないオブジェクトを表現する空のobject型であり、この型はあらゆるオブジェクトの型と`null`と`undefined`を除くすべてのプリミティブ型を包含しています。したがって、`unknown`という全体集合は上記のような３つの集合に分割できると考えることもできます。

## ダイナミック型

TypeScriptには`unknown`型以外にもうひとつ特殊なトップ型があります。それが`any`型です。`any`型には`unknown`型と同様にあらゆる型の値を割当可能です。

```typescript
const a1: any = 42;
const a2: any = "st";
const a3: any = { p: 1 };
const a4: any = null;
const a5: any = () => 2;
```

`any`型の特殊性はトップ型としてあらゆる型からの割当が可能だけでなく、`never`型を除くあらゆる型へも割当可能な点です。

```typescript
declare const a: any;
const n1: unknown = a;
const n2: {} = a;
const n3: number = a;
const n4: 1 = a;
const n5: never = a; // Type 'any' is not assignable to type 'never'.
```

`any`型は`never`型を除けばあらゆる型へも割当可能なため一見するとボトム型のように振る舞っているように見えますが、実際にはボトム型ではありません。

TypeScriptは元来、JavaScriptに対して**オプショナルに型付けを行う**という言語であり、型注釈を省略して型推論ができない場合には未知の型を暗黙的に`any`型として推論します。このような状況において`any`型はあらゆる型からの割当が可能であるだけでなく、あらゆる型への割当が可能であることが必要であり、それによって型注釈がないJavaScriptに対して漸進的に型を付けていくことが可能になります。

実は`any`型は`unknown`型がTypeScriptに導入されるまで唯一のトップ型として機能していましたが、純粋にあらゆる型の上位型になる部分型関係のトップ位置の型として機能する`unknown`型が導入されたことで部分型関係の概念が明瞭になりました。

そして、`any`型のメンタルモデルには、トップ型やボトム型ではなく**ダイナミック型**(Dynamic type)と呼ばれる型の概念に割り当てるとよいです。

漸進的型付けの型システムでは静的な世界と動的な世界の境界となる型が必要となります。この境界となる型は`dynamic`と呼ばれ、`?` の記号で表されます。この種の型は静的に不明な型(statically-unknown type)を表し、静的型付けと動的型付けを共存させるのに役立ちます。

より厳密に言えば、[公式ドキュメントに記述してある通り](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#gradual-typing)、TypeScriptの`any`はダイナミック型というよりも、より単純な「**型チェックの無効化装置**」でしかないのですが、ダイナミック型という存在を知っていると型システムでの`any`型の立ち位置が理解しやすくなります。

## 部分型関係の解釈

部分型関係とはそもそも「型Bが型Aの部分型であるとき、Aの型の値が求められる際にBの型の値を指定できる」という型同士の互換性に関わる関係です。関数型を除く通常の型については、型を集合として解釈すれば部分型関係は**集合の包含関係**に相当します。

部分型関係の説明において、型と型の関係性は**階層構造**で捉えることができると述べましたが、集合の包含関係は階層構造について少し見方を変えた構造であると言えます。

トップ型である`unknown`型はあらゆる型の基本型、つまり上位型として振る舞い、あらゆる型は`unknown`型の部分型となります。したがって、型を集合として解釈したとき、`unknown`型はTypeScriptにおけるあらゆる値を含む集合となります。つまり全体集合であり、あらゆる型は`unknown`型の部分集合とみなすことができます。

それとは逆に、ボトム型である`never`型はあらゆる型の部分型となります。したがって、型を集合として解釈したとき、`never`型はTypeScriptにおけるどのような値も含まない集合、つまり空集合としてみなすことができます。

このように部分型関係を集合の包含関係として捉えることで、より直感的に型の互換性についての推論が可能となります。

たとえばふたつの集合の和集合はその共通部分を包含します。ユニオン型とインターセクション型は和集合と共通部分に相当していたので、包含関係からインターセクション型がユニオン型の部分型となることが推論されます。実際に検証してみると、ユニオン型の変数にインターセクション型の変数を割りあてることが可能です。

```typescript
type A = { a: string };
type B = { b: number };

type Union = A | B;
type Intersection = A & B;

const a_and_b: Intersection = { a: "st", b: 42 };
const a_or_b: Union = a_and_b;
```

## まとめ

- 型システムは型理論という数学的な研究分野に基づいて実装されている
- TypeScriptでは型を「値の集合」として捉える集合論的なデザインが採用されている
- ユニオン型とインターセクション型は集合の和集合と共通部分に相当する
- ユニット型は値をひとつしか持たない型（`null`、`undefined`、リテラル型など）
- ボトム型は値をまったく持たない型（`never`型）
- トップ型はすべての値を持つ型（`unknown`型）
- `any`型はダイナミック型として、静的型付けと動的型付けの境界を表す
- 部分型関係は集合の包含関係として解釈できる
