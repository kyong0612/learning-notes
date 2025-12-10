---
title: "カオナビのコードベースでtypeとinterfaceの型チェックパフォーマンスを比較した"
source: "https://qiita.com/uhyo/items/414683cffa57fdc1112f"
author:
  - "[[uhyo]]"
published: 2025-10-24
created: 2025-12-10
description: "皆さんこんにちは。この記事は株式会社カオナビ Advent Calendar 2025の1日目の記事です。 TypeScriptにおいて、型定義にtypeとinterfaceのどちらを使うのかは定番の議論テーマです。人々は、思い思いの理由でtypeが良いと言ったりinter..."
tags:
  - "clippings"
---
## Qiita Careers powered by IndeedPR

求人サイト「Qiita Careers powered by Indeed」では、エンジニアのあなたにマッチした求人が見つかります。

[求人を探す](https://careers.qiita.com/)

皆さんこんにちは。この記事は [株式会社カオナビ Advent Calendar 2025](https://qiita.com/advent-calendar/2025/kaonavi) の1日目の記事です。

TypeScriptにおいて、 **型定義に `type` と `interface` のどちらを使うのか** は定番の議論テーマです。人々は、思い思いの理由でtypeが良いと言ったりinterfaceが良いと言ったり要はバランスと言ったりします。

```ts
// typeによる定義
type User = {
  id: string;
  name: string;
}

// interfaceによる定義
interface User {
  id: string;
  name: string;
}
```

## typeとinterfaceのパフォーマンスの違い？

たまに、Microsoftの公式ドキュメントにある以下のような記述を根拠に、「interfaceの方がパフォーマンスが良い」とされることがあります。

> Using interfaces with `extends` can often be more performant for the compiler than type aliases with intersections
> 
> [https://www.typescriptlang.org/docs/handbook/2/everyday-types.html](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

ただし、これは半分誤解です。なぜなら、公式はtypeとinterfaceのパフォーマンス比較をしているわけではないからです。

公式で説明されていることは、あくまで「 **インターセクション型** よりも **interface + `extends`** の方がパフォーマンスがいい」ということです。このことを無視して「type VS interface」の話と解釈するのは誤りです。

公式以外での言及として、TypeScript-ESLintのドキュメントを見ましょう。TypeScriptのOSSを扱う人がみんなTypeScript力に優れているわけではありませんが、TypeScript-ESLintの開発陣はASTや型情報を扱うだけあって特に優秀です。ドキュメントには、typeとinterfaceの比較について以下のような記述があります（一部抜粋して引用）。

> There are very few differences between interfaces and object types in TypeScript. Other than type aliases being used to represent union types, it is rare that you will need to choose one over the other.
> 
> **General Performance**: Both are optimized for performance in TypeScript's type checker.
> 
> **Edge case performance**: Large, complex logical types can be optimized better with interfaces by TypeScript's type checker.
> 
> [https://typescript-eslint.io/rules/consistent-type-definitions/](https://typescript-eslint.io/rules/consistent-type-definitions/)

つまり、一般的な場合ではtypeもinterfaceもパフォーマンスが最適化されており、どちらかを選ばなければならない状況は限られています。それでも、大きくて複雑な型を扱うエッジケースの場合はinterfaceを使ったほうがパフォーマンスに優れる場合があるということです。

以上が、typeとinterfaceのパフォーマンスの話の真相です。闇雲にtypeではなくinterfaceを使えばパフォーマンスが上がるという簡単な話はないのです。

もっとも、いつinterfaceを使うべきエッジケースを踏んでしまうか分かりませんから、考える・理解することを減らすための方策としてinterfaceに全て統一してしまうのはありでしょう。

## カオナビのソースコードでパフォーマンスを比較してみた

ということで、ここからは弊社のTypeScriptソースコードを用いて実際にパフォーマンスを比較してみた結果を紹介します。

カオナビのコードは、特にtypeとinterfaceの使い分けや統一に関するルールはなく、両者が混在している状況でした。型チェックのパフォーマンスを調べても特に明確なボトルネックは無く、筆者の手元のMacで型チェックに60秒ほどかかる状態でした（`.tsbuildinfo` 無しの場合）。

使用したTypeScriptバージョンは5.9.2です。何もする前の型チェック時間の一例はこんな感じです。

```text
yarn tsc  62.64s user 7.09s system 115% cpu 1:00.54 total
```

### 単純なtypeをinterfaceに一括置換する

TypeScript-ESLintの [consistent-type-definitionsルール](https://typescript-eslint.io/rules/consistent-type-definitions/) を使うことで、単純なtypeをinterfaceに一括で置換できます。

```ts
type User = {
  id: string;
  name: string;
}
// ↓autofixで自動変換可能
interface User {
  id: string;
  name: string;
}
```

まず、これを使って単純なtypeをinterfaceに一括置換することを試してみました。

ただし、このルールで自動で変換できるのは、 `type T = { オブジェクト型 }` の形の本当に単純な場合のみです。

特に、インターセクション型を交えた以下のようなものはこのルールで変換できません。

```ts
// これは対象外
type Merged = Foo & Bar;
// これも対象外
type Marged2 = Foo & { hello: string };
```

先ほどの前提知識からすると、インターセクション型を含まない単純なtypeをinterfaceに変換してもパフォーマンス向上は望めません。この実験は、別にパフォーマンス向上しないよねということを確かめるために行いました。

このルールにより約1500件のtypeをinterfaceに変換できました。

そして実際に型チェックのパフォーマンスを確かめたところ、特に変わりませんでした。

型チェック時間の一例

```
yarn tsc  64.21s user 7.05s system 127% cpu 55.709 total
```

やはり、インターセクション型が関わらない単純なtypeなら、interfaceに比べてパフォーマンスが遅いということは特にないようです。

### インターセクション型を一括で置換してみる

次の実験として、インターセクション型を含むtypeをinterfaceに変換することを試みました。つまり、このような変換です。

```ts
type Merged = Foo & Bar;
// ↓
interface Merged extends Foo, Bar {}

type Marged2 = Foo & { hello: string };
// ↓
interface Merged2 extends Foo {
  hello: string;
}
```

このような変換を提供してくれるルールはTypeScript-ESLintには存在しなかったので、自作しました。作成したルールは公開していませんが、AIに以下のような要件を伝えると作ってくれますので、試したい方は参考にしてください。

> **目的:** typeによるインターセクション型の定義をinterface + extendsに変換して型チェックのパフォーマンスを向上させたい
> 
> **例:** （上の変換例）
> 
> **方法:** ESLintルールとして実装する。auto fixも提供する。

こうして作られたルールをカオナビのコードベースに対して実行すると、約200件のインターセクション型をinterface + extendsに変換することができました。ただし、型チェックを通すためにはいくつか手動で修正を加える必要がありました（後述）。一応、フェアな比較とするために型チェックが通る状態になるまでコードを手で修正しています。

そして、変換後の型チェックのパフォーマンスを調べると、 **4〜5秒程度の改善** が見られました。割合にすると7〜8%くらいです。

変換後の型チェック時間の一例

```
yarn tsc  56.54s user 5.73s system 122% cpu 50.754 total
```

つまり、 **typeで定義されたインターセクション型を避けてinterface + extendsを使うことはパフォーマンス上の効果がある** ということが分かりました。

### 注意: インターセクション型とinterface + extendsの違い

今回はパフォーマンスの比較という目的なので雑に一括置換しましたが、実はこのような一括置換は正しいとは限らないことに注意してください。

```ts
type Marged = Foo & { hello: string };
// ↓正しい変換ではないかも……
interface Merged extends Foo {
  hello: string;
}
```

インターセクション型と、interfaceのextendsは全く同じ意味ではないのです。

上記の例では、 `Foo` にすでに `hello` プロパティがある場合に違いが生じます。

```ts
type Foo = { hello: number };

type I = Foo & { hello: string };
// ↑ { hello: never } 型になる

interface E extends Foo { hello: string }
// ↑ コンパイルエラーが発生
// Interface 'E' incorrectly extends interface 'Foo'.
//   Types of property 'hello' are incompatible.
//     Type 'string' is not assignable to type 'number'.
```

つまり、インターセクション型の場合はプロパティの型も合成される（ `hello` の型は `number & string` 、つまり `never` になる）のに対して、interface + extendsの場合は、合成ではなく上書きになります。さらに、上書きの結果 `E` が `Foo` の部分型にならない場合は許可されず、型エラーとなります。

この場合、interface + extendsの側を以下のように調整して型エラーを回避できます（前者だとOmitという型計算を使用しており、後者でも結局インターセクション型を使ってしまっているという問題があるので、さらなる改善の余地もあります）。

```ts
interface E extends Omit<Foo, "hello"> { hello: string }
// または
interface E extends Foo {
  hello: Foo["hello"] & string;
}
```

上で紹介したTypeScript-ESLintのルールがこのようなインターセクション型を交えたケースに対応していないのは、正確な判定とautofixが難しいからでしょう。ここで紹介した問題のほかに、そもそもユニオン型に対してextendsできないのでその場合は変換してはいけないという問題もあります。

ESLintのルールを作り込んで型情報まで見るようにすれば、これらの問題を回避しつつインターセクション型に変換できるものだけを変換することも可能そうです。筆者がClaude Codeにお願いしたところ、とりあえずユニオン型を検知してinterface + extendsへの変換をスキップすることはできました。

ただ、今回は雑に一括置換してパフォーマンスの比較をできれば十分なので、ある程度の変換+手動の修正で検証しています。

## まとめ

この記事では、typeとinterfaceの型チェックにおけるパフォーマンスの差異を調べるために、ESLintを用いて一括置換の上、方チェックの時間を比較した実験の結果を紹介しました。

その結果、インターセクション型が関わらない単純なオブジェクト型のケースにおいては、typeをinterfaceに変えてもパフォーマンスの差異は無いことが確かめられました。

一方、インターセクション型については、interface + extendsに書き換えることで確かにパフォーマンスが向上することが認められました。

結局、typeとinterfaceのパフォーマンスの違いについては、公式の情報に書いてあることが全てで、それ以上の隠された真実は無いようです。この結果を元に、使い分けをどうするか考えてみるのもよいでしょう。

気合いのある方は、この記事で紹介した手法をもとに実際に自分のコードベースで試してみましょう。

Register as a new user and use Qiita more conveniently

1. You get articles that match your needs
2. You can efficiently read back useful information
3. You can use dark theme
[What you can do with signing up](https://help.qiita.com/ja/articles/qiita-login-user)

[Sign up](https://qiita.com/signup?callback_action=login_or_signup&redirect_to=%2Fuhyo%2Fitems%2F414683cffa57fdc1112f&realm=qiita) [Login](https://qiita.com/login?callback_action=login_or_signup&redirect_to=%2Fuhyo%2Fitems%2F414683cffa57fdc1112f&realm=qiita)

## Qiita Advent Calendar is held!

![](https://cdn.qiita.com/assets/public/advent_calendar/image-advent_calendar_being_held-bafa166cb2e60037f5e4ba3599642d8f.png)

Qiita Advent Calendar is an article posting event where you post articles by filling a calendar 🎅

Some calendars come with gifts and some gifts are drawn from all calendars 👀

Please tie the article to your calendar and let's enjoy Christmas together!