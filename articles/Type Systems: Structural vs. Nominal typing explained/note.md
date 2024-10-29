# Type Systems: Structural vs. Nominal typing explained

ref: <https://medium.com/@thejameskyle/type-systems-structural-vs-nominal-typing-explained-56511dd969f4>

- すべての型システムの重要な属性は、それらが構造的(structural)なものか名目的(nominal)なものかということです。
- 型とは、文字列、ブーリアン、オブジェクト、クラスのようなものだ。
  - 型には名前があり、構造があります。 文字列やブール値のようなプリミティブ型は非常に単純な構造を持ち、1つの名前しか持ちません。
  - オブジェクトやクラスのような複雑な型は、より複雑な構造を持ちます。
  - 静的型チェッカーは、型を他の型と比較するために、型の名前か構造のどちらかを使用します。
  - 名前に対するチェックは名義型付けであり、構造に対するチェックは構造型付けである。

## Nominal typing

C++、Java、Swiftのような言語は、主に名詞型システムを持っている。

```java
class Foo {
  method(input: string): number { ... }
}
class Bar {
  method(input: string): number { ... }
}
let foo: Foo = new Bar(); // ERROR!!
```

ここでは、名詞型システムの擬似的な例として、Fooが必要な場所にBarを置こうとすると、両者の名前が異なるためにエラーになる様子を見ることができる。

## Structural typing

OCaml、Haskell、Elmのような言語は、主に構造型システムを持っている。

```
class Foo {
  method(input: string): number { ... }
}
class Bar {
  method(input: string): number { ... }
}
let foo: Foo = new Bar(); // Okay.
```

ここでは、構造型システムの擬似的な例として、Fooが必要な場所にBarを置こうとしているところを見ることができる。 しかし、形状を変更するとすぐにエラーが発生し始める。

```
class Foo {
  method(input: string): number { ... }
}
class Bar {
  method(input: string): boolean { ... }
}
let foo: Foo = new Bar(); // ERROR!!
```

- ここまで、クラスの名詞型付けと構造型付けの両方について説明してきたが、オブジェクトや関数のような複雑な型にも、名詞型付けと構造型付けの両方がある。
- 例えば、Flowでは、オブジェクトと関数には構造型付けを使用するが、クラスには名義型付けを使用する。

### Functions

```
type FuncType = (input: string) => number;
function func(input: string): number { ... }
let test: FuncType = func; // Okay.
```

ここでは、同じ入力と出力を持つ関数型のエイリアスと実際の関数を見ることができる。 これらは同じ構造を持ち、Flowでは等価である。

### Objects

```
type ObjType = { property: string };
let obj = { property: "value" };
let test: ObjType = obj;
```

- ここでは、同じプロパティを持つオブジェクト・タイプのエイリアスと実際のオブジェクトを見ることができます。 value "は文字列の型なので、サブタイプ（文字列のより特殊な型）です。 つまり、objオブジェクトはObjTypeのサブタイプということになる。
- これは、名前とは関係なく（objがObjTypeのサブタイプであることを明示的に示すものは何もないことに注意）、両者の構造に関係するものだ。 Flowのオブジェクト型は共変である（サブタイプを受け入れるという意味）ので、これは型チェッカーをパスする。

### Classes

```
class Foo { method(input: string): number {...} }
class Bar { method(input: string): number {...} }
let test: Foo = new Bar(); // ERROR!!
```

ここでは、先ほどと同じ2つのクラスが同じ構造を持っていることがわかる。 Flowでは、クラスに対して公称型(Nominal Typing)を使用するため、これらは等価ではない。 クラスを構造的に使用したい場合は、インターフェイスとしてオブジェクトと混在させることで実現できる：

```
type Interface = {
  method(value: string): number;
};
class Foo { method(input: string): number {...} }
class Bar { method(input: string): number {...} }
let test: Interface = new Foo(); // Okay.
let test: Interface = new Bar(); // Okay.
```

- 公称型と構造型を混在させるというFlowの設計上の決定は、オブジェクト、関数、クラスがJavaScriptですでにどのように使用されているかに基づいて選択された。
- JavaScript言語は、オブジェクト指向のアイデアと関数型のアイデアが混在している。
- 開発者のJavaScriptの使い方も混在している傾向がある。
  - クラス（またはコンストラクタ関数）はオブジェクト指向の側面が強く、関数（ラムダ）とオブジェクトは関数型の側面が強い。
  - オブジェクト指向言語は公称型が多く（C++、Java、Swift）、関数型言語は構造型が多い（OCaml、Haskell、Elm）。
  - 誰かがクラスを書くとき、彼らはあるものを宣言している。
  - このクラスは他の何かと同じ構造を持つかもしれないが、それでも目的は異なる。
  - 両方がrender()メソッドを持つ2つのコンポーネント・クラスを想像してほしい。
  - これらのコンポーネントはまだまったく異なる目的を持っているかもしれないが、構造型システムではまったく同じものとみなされるだろう。
  - FlowはJavaScriptにとって自然なものを選択し、最終的には、期待通りに動作するとても素晴らしいエクスペリエンスになる。
