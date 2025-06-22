---
title: "パフォーマンス"
source: "https://github.com/microsoft/TypeScript/wiki/Performance#using-project-references"
author:
  - "[[GitHub]]"
published:
created: 2025-06-22
description: "TypeScriptは、クリーンなJavaScriptコードにコンパイルされる、JavaScriptのスーパーセットです。 - Performance · microsoft/TypeScript Wiki"
tags:
  - "clippings"
  - "typescript"
  - "performance"
---
TypeScriptには、コンパイルやエディタでの開発体験を高速化するための簡単な設定方法がいくつかあります。これらの手法は、早いうちから導入するほど効果的です。このドキュメントでは、ベストプラクティスに加え、コンパイルや編集が遅い場合の調査方法、一般的な解決策、そして最終手段としてTypeScriptチームに問題調査を依頼する方法について解説します。

- [コンパイルしやすいコードの書き方](https://github.com/microsoft/TypeScript/wiki/#writing-easy-to-compile-code)
  - [交差型よりインターフェースを優先する](https://github.com/microsoft/TypeScript/wiki/#preferring-interfaces-over-intersections)
  - [型注釈を利用する](https://github.com/microsoft/TypeScript/wiki/#using-type-annotations)
  - [合併型より基底型を優先する](https://github.com/microsoft/TypeScript/wiki/#preferring-base-types-over-unions)
  - [複雑な型に名前を付ける](https://github.com/microsoft/TypeScript/wiki/#naming-complex-types)
- [プロジェクト参照を利用する](https://github.com/microsoft/TypeScript/wiki/#using-project-references)
  - [新しいコード](https://github.com/microsoft/TypeScript/wiki/#new-code)
  - [既存のコード](https://github.com/microsoft/TypeScript/wiki/#existing-code)
  - [パフォーマンスに関する考慮事項](https://github.com/microsoft/TypeScript/wiki/#performance-considerations)
- [`tsconfig.json` または `jsconfig.json` の設定](https://github.com/microsoft/TypeScript/wiki/#configuring-tsconfigjson-or-jsconfigjson)
  - [ファイルの指定](https://github.com/microsoft/TypeScript/wiki/#specifying-files)
  - [`@types` のインクルード制御](https://github.com/microsoft/TypeScript/wiki/#controlling-types-inclusion)
  - [インクリメンタルなプロジェクト出力](https://github.com/microsoft/TypeScript/wiki/#incremental-project-emit)
  - [`.d.ts` ファイルのチェックをスキップする](https://github.com/microsoft/TypeScript/wiki/#skipping-dts-checking)
  - [より高速な変性チェックを利用する](https://github.com/microsoft/TypeScript/wiki/#using-faster-variance-checks)
- [他のビルドツールの設定](https://github.com/microsoft/TypeScript/wiki/#configuring-other-build-tools)
  - [並行型チェック](https://github.com/microsoft/TypeScript/wiki/#concurrent-type-checking)
  - [分離されたファイル出力](https://github.com/microsoft/TypeScript/wiki/#isolated-file-emit)
- [問題の調査](https://github.com/microsoft/TypeScript/wiki/#investigating-issues)
  - [エディタプラグインの無効化](https://github.com/microsoft/TypeScript/wiki/#disabling-editor-plugins)
  - [`extendedDiagnostics`](https://github.com/microsoft/TypeScript/wiki/#extendeddiagnostics)
  - [`showConfig`](https://github.com/microsoft/TypeScript/wiki/#showconfig)
  - [`listFilesOnly`](https://github.com/microsoft/TypeScript/wiki/#listFilesOnly)
  - [`explainFiles`](https://github.com/microsoft/TypeScript/wiki/#explainfiles)
  - [`traceResolution`](https://github.com/microsoft/TypeScript/wiki/#traceresolution)
  - [`tsc` を単独で実行する](https://github.com/microsoft/TypeScript/wiki/#running-tsc-alone)
  - [依存関係のアップグレード](https://github.com/microsoft/TypeScript/wiki/#upgrading-dependencies)
  - [パフォーマンストレーシング](https://github.com/microsoft/TypeScript/wiki/#performance-tracing)
- [よくある問題](https://github.com/microsoft/TypeScript/wiki/#common-issues)
  - [`include` と `exclude` の設定ミス](https://github.com/microsoft/TypeScript/wiki/#misconfigured-include-and-exclude)
- [Issueを報告する](https://github.com/microsoft/TypeScript/wiki/#filing-an-issue)
  - [コンパイラのパフォーマンス問題を報告する](https://github.com/microsoft/TypeScript/wiki/#reporting-compiler-performance-issues)
    - [パフォーマンストレースの提供](https://github.com/microsoft/TypeScript/wiki/#providing-performance-traces)
    - [コンパイラのプロファイリング](https://github.com/microsoft/TypeScript/wiki/#profiling-the-compiler)
    - [pprof を用いたコンパイラのプロファイリング](https://github.com/microsoft/TypeScript/wiki/#profiling-the-compiler-with-pprof)
  - [編集時のパフォーマンス問題を報告する](https://github.com/microsoft/TypeScript/wiki/#reporting-editing-performance-issues)
    - [TSServerログの取得](https://github.com/microsoft/TypeScript/wiki/#taking-a-tsserver-log)
      - [Visual Studio CodeでTSServerログを収集する](https://github.com/microsoft/TypeScript/wiki/#collecting-a-tsserver-log-in-visual-studio-code)

以下のルールは絶対的なものではないことに注意してください。コードベースによっては、各ルールに例外が存在する場合があります。

多くの場合、オブジェクト型への単純な型エイリアスは、インターフェースと非常によく似た動作をします。

```
interface Foo { prop: string }

type Bar = { prop: string };
```

しかし、2つ以上の型を合成する必要が出てくると、インターフェースでそれらの型を拡張するか、型エイリアスで交差させるかという選択肢があり、その時点で違いが重要になってきます。

インターフェースは、単一のフラットなオブジェクト型を生成します。これによりプロパティの衝突を検知できますが、これは通常解決すべき重要な問題です。一方、交差型はプロパティを再帰的にマージするだけで、場合によっては`never`型になることもあります。また、インターフェースは一貫して表示が見やすいのに対し、交差型エイリアスは他の交差型の一部として表示できません。インターフェース間の型関係はキャッシュされますが、交差型はそうではありません。最後に注意すべき違いとして、対象の交差型に対して型チェックを行う際、実際に「フラット化」された型をチェックする前に、まず構成要素である各型が個別にチェックされます。

このため、交差型を作成するよりも、`interface`と`extends`を使って型を拡張することが推奨されます。

```
- type Foo = Bar & Baz & {
-     someProp: string;
- }
+ interface Foo extends Bar, Baz {
+     someProp: string;
+ }
```

型注釈、特に返り値の型を追加することで、コンパイラの作業量を大幅に削減できます。その理由の一つは、名前付きの型は（コンパイラが推論する可能性のある）無名型よりもコンパクトになる傾向があり、それによって宣言ファイル（例：インクリメンタルビルド用）の読み書きに費やす時間が短縮されるためです。型推論は非常に便利なので、これを全面的に行う必要はありません。しかし、コードの中で遅い部分を特定した場合には、試してみる価値のある手法です。

```
- import { otherFunc } from "other";
+ import { otherFunc, OtherType } from "other";

- export function func() {
+ export function func(): OtherType {
      return otherFunc();
  }
```

これを試す価値があるかもしれないヒントとしては、`--declaration`フラグによる出力に`import("./some/path").SomeType`のような型が含まれていたり、ソースコードに書かれていない非常に大きな型が含まれていたりする場合が挙げられます。明示的に何かを記述し、必要であれば名前付きの型を作成してみてください。

非常に大きな計算済み型の場合、[そのような型の出力/読み込みにコストがかかる理由](https://github.com/ant-design/ant-design-icons/pull/479)は明らかかもしれません。しかし、なぜ`import()`のコード生成はコストがかかるのでしょうか？なぜそれが問題なのでしょうか？

場合によっては、`--declaration`による出力で、他のモジュールからの型を参照する必要があります。例えば、以下のファイルの宣言出力は...

は、以下の `.d.ts` ファイルを生成します。

`import("./foo").Result`に注目してください。TypeScriptは、`bar.ts`の宣言出力において、`foo.ts`内の`Result`という名前の型を参照するためのコードを生成する必要がありました。これには以下の処理が含まれます。

1. その型がローカル名でアクセス可能かどうかを判断する。
2. その型が `import(...)` を通じてアクセス可能かどうかを見つける。
3. そのファイルをインポートするための最も合理的なパスを計算する。
4. その型参照を表す新しいノードを生成する。
5. それらの型参照ノードを出力する。

非常に大きなプロジェクトでは、これがモジュールごと、何度も何度も発生する可能性があります。

合併型（Union型）は素晴らしい機能です。型が取りうる値の範囲を表現できます。

```
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

しかし、それにはコストも伴います。`printSchedule`に引数が渡されるたびに、合併型の各要素と比較する必要があります。要素が2つの合併型であれば、これは些細で安価な処理です。しかし、合併型に十数個以上の要素があると、コンパイル速度に深刻な問題を引き起こす可能性があります。例えば、合併型から冗長なメンバーを削除するには、要素をペアで比較する必要があり、これは計算量が二乗オーダーになります。この種のチェックは、大きな合併型を交差させる際に発生する可能性があり、各合併型メンバーにわたって交差させると、縮小する必要のある巨大な型が生成されることがあります。これを避ける一つの方法は、合併型の代わりにサブタイプを使用することです。

```
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

declare function printSchedule(schedule: Schedule);
```

より現実的な例としては、すべての組み込みDOM要素型をモデル化しようとする場合に発生するかもしれません。この場合、`DivElement | /*...*/ | ImgElement | /*...*/`のような網羅的な合併型を作成するのではなく、`DivElement`や`ImgElement`などがすべて拡張する共通メンバーを持つ基底の`HtmlElement`型を作成することが望ましいです。

複雑な型は、型注釈が許可されている場所ならどこにでも書くことができます。

```
interface SomeType<T> {
    foo<U>(x: U):
        U extends TypeA<T> ? ProcessTypeA<U, T> :
        U extends TypeB<T> ? ProcessTypeB<U, T> :
        U extends TypeC<T> ? ProcessTypeC<U, T> :
        U;
}
```

これは便利ですが、現状では`foo`が呼び出されるたびに、TypeScriptは条件型を再実行する必要があります。さらに、`SomeType`の任意の2つのインスタンスを関連付けるには、`foo`の戻り値の型の構造を再関連付けする必要があります。

この例の戻り値の型を型エイリアスに抽出すると、より多くの情報をコンパイラがキャッシュできるようになります。

```
type FooResult<U, T> =
    U extends TypeA<T> ? ProcessTypeA<U, T> :
    U extends TypeB<T> ? ProcessTypeB<U, T> :
    U extends TypeC<T> ? ProcessTypeC<U, T> :
    U;

interface SomeType<T> {
    foo<U>(x: U): FooResult<U, T>;
}
```

## プロジェクト参照を利用する

### 新しいコード

TypeScriptで自明でない規模のコードベースを構築する場合、コードベースをいくつかの独立した*プロジェクト*に整理すると便利です。各プロジェクトは独自の`tsconfig.json`を持ち、他のプロジェクトに依存します。これにより、単一のコンパイルで読み込むファイルが多すぎるのを避けたり、特定のコードベースのレイアウト戦略をまとめやすくしたりできます。

[コードベースをプロジェクトに整理する](https://www.typescriptlang.org/docs/handbook/project-references.html)ための非常に基本的な方法がいくつかあります。例として、クライアント用のプロジェクト、サーバー用のプロジェクト、そして両者で共有されるプロジェクトを持つプログラムが考えられます。

```
------------
              |          |
              |  Shared  |
              ^----------^
             /            \
            /              \
------------                ------------
|          |                |          |
|  Client  |                |  Server  |
-----^------                ------^-----
```

テストも独自のプロジェクトに分割できます。

```
------------
              |          |
              |  Shared  |
              ^-----^----^
             /      |     \
            /       |      \
------------  ------------  ------------
|          |  |  Shared  |  |          |
|  Client  |  |  Tests   |  |  Server  |
-----^------  ------------  ------^-----
     |                            |
     |                            |
------------                ------------
|  Client  |                |  Server  |
|  Tests   |                |  Tests   |
------------                ------------
```

プロジェクト参照については、[こちらで詳しく読むことができます](https://www.typescriptlang.org/docs/handbook/project-references.html)。

### 既存のコード

ワークスペースが非常に大きくなり、エディタでの扱いが困難になった場合（そして、[パフォーマンストレーシング](https://github.com/microsoft/TypeScript/wiki/#providing-performance-traces)を使い、ホットスポットが存在せず、規模そのものが原因である可能性が高いことを確認した場合）、コードベースを相互参照する複数のプロジェクトに分割することが有効です。モノレポで作業している場合、各パッケージに対してプロジェクトを作成し、その依存関係グラフをプロジェクト参照に反映させるだけで済みます。そうでない場合は、より場当たり的な対応が必要になります。ディレクトリ構造を参考にしたり、慎重に選択した`include`と`exclude`のglobパターンを使用したりすることができます。留意すべき点がいくつかあります。

- 均等なサイズのプロジェクトを目指す - 1つの巨大なプロジェクトと多数の小さなサテライトプロジェクトは避ける
- 一緒に編集されるファイルをグループ化するよう試みる - これにより、エディタが読み込む必要のあるプロジェクトの数を制限できる
- テストコードを分離することで、製品コードが誤ってそれに依存するのを防ぐのに役立つ

### パフォーマンスに関する考慮事項

どんなカプセル化メカニズムでもそうですが、プロジェクトにはコストが伴います。例えば、すべてのプロジェクトが同じパッケージ（例：人気のUIフレームワーク）に依存している場合、そのパッケージの型の一部が繰り返しチェックされます。つまり、それを利用するプロジェクトごとに一度ずつです。経験的には、（複数のプロジェクトを持つワークスペースの場合）5〜20プロジェクトが適切な範囲のようです。これより少ないとエディタの速度が低下する可能性があり、多すぎると過剰なオーバーヘッドが発生する可能性があります。プロジェクトを分割する正当な理由には、以下のようなものがあります。

- 出力場所が異なる（例：モノレポ内のパッケージであるため）
- 異なる設定（例：`lib`や`moduleResolution`）が必要
- スコープを限定したいグローバル宣言が含まれている（カプセル化のため、または高コストなグローバルリビルドを制限するため）
- 単一プロジェクトとしてコードを処理しようとすると、エディタの言語サービスがメモリ不足になる
  - この場合、編集中のプロジェクト読み込みを制限するために、`"disableReferencedProjectLoad": true`と`"disableSolutionSearching": true`を設定するとよいでしょう

## tsconfig.json または jsconfig.json の設定

TypeScriptおよびJavaScriptユーザーは、常に`tsconfig.json`ファイルでコンパイルを構成できます。JavaScriptユーザー向けには、[`jsconfig.json`ファイルを使用して編集エクスペリエンスを構成する](https://code.visualstudio.com/docs/languages/jsconfig)こともできます。

### ファイルの指定

設定ファイルが一度に多くのファイルを含んでいないことを常に確認する必要があります。

`tsconfig.json`内では、プロジェクト内のファイルを指定する方法が2つあります。

- `files` リスト
- `include` と `exclude` リスト

両者の主な違いは、`files`がソースファイルへのファイルパスのリストを期待するのに対し、`include` / `exclude`はファイルにマッチさせるためにglobパターンを使用する点です。

`files`を指定するとTypeScriptがファイルを直接素早く読み込めるようになりますが、トップレベルのエントリポイントが数個しかないプロジェクトで多数のファイルがある場合、これは面倒になることがあります。さらに、新しいファイルを`tsconfig.json`に追加し忘れることがよくあり、その結果、新しいファイルが誤って解析されるという奇妙なエディタの挙動につながる可能性があります。これらすべてが面倒な作業になり得ます。

`include` / `exclude`はこれらのファイルを指定する必要をなくすのに役立ちますが、コストもかかります。ファイルは、インクルードされたディレクトリをたどって発見されなければなりません。*多数*のフォルダを処理する場合、コンパイルが遅くなる可能性があります。さらに、コンパイルに不要な`.d.ts`ファイルやテストファイルが多数含まれることがあり、コンパイル時間とメモリのオーバーヘッドが増加する可能性があります。最後に、`exclude`にはいくつかの合理的なデフォルト設定がありますが、モノレポのような特定の設定では、`node_modules`のような「重い」フォルダが依然として含まれてしまうことがあります。

ベストプラクティスとして、以下を推奨します。

- プロジェクトには入力フォルダのみを指定する（つまり、コンパイル/解析に含めたいソースコードがあるフォルダ）。
- 他のプロジェクトのソースファイルを同じフォルダに混ぜない。
- テストを他のソースファイルと同じフォルダに置く場合は、簡単に除外できるように明確な名前を付ける。
- ソースディレクトリに大きなビルド成果物や`node_modules`のような依存関係フォルダを置かない。

注意：`exclude`リストがない場合、`node_modules`はデフォルトで除外されます。リストを追加するとすぐに、`node_modules`を明示的にリストに追加することが重要になります。

Here is a reasonable `tsconfig.json` that demonstrates this in action.

```
{
    "compilerOptions": {
        // ...
    },
    "include": ["src"],
    "exclude": ["**/node_modules", "**/.*/"],
}
```

### @types のインクルード制御

デフォルトでは、TypeScriptは`node_modules`フォルダ内で見つかったすべての`@types`パッケージを、インポートするかどうかに関わらず自動的にインクルードします。これは、Node.js、Jasmine、Mocha、Chaiなどを使用する際に、これらのツール/パッケージがインポートされるのではなく、グローバル環境にロードされるだけで「うまくいく」ようにするためのものです。

このロジックは、コンパイルと編集の両方のシナリオでプログラムの構築時間を遅くすることがあり、また、宣言が競合する複数のグローバルパッケージで問題を引き起こし、次のようなエラーを引き起こすことさえあります。

```
Duplicate identifier 'IteratorResult'.
Duplicate identifier 'it'.
Duplicate identifier 'define'.
Duplicate identifier 'require'.
```

グローバルパッケージが不要な場合、修正は`tsconfig.json` / `jsconfig.json`で [`"types"`オプション](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)に空のフィールドを指定するだけで簡単です。

```
// src/tsconfig.json
{
   "compilerOptions": {
       // ...

       // Don't automatically include anything.
       // Only include \`@types\` packages that we need to import.
       "types" : []
   },
   "files": ["foo.ts"]
}
```

それでもいくつかのグローバルパッケージが必要な場合は、それらを`types`フィールドに追加してください。

```
// tests/tsconfig.json
{
   "compilerOptions": {
       // ...

       // Only include \`@types/node\` and \`@types/mocha\`.
       "types" : ["node", "mocha"]
   },
   "files": ["foo.test.ts"]
}
```

### インクリメンタルなプロジェクト出力

`--incremental`フラグを使用すると、TypeScriptは最後のコンパイルの状態を`.tsbuildinfo`ファイルに保存できます。このファイルは、前回実行時以降に再チェック/再出力が必要な可能性のある最小のファイルセットを特定するために使用されます。これは、TypeScriptの`--watch`モードの動作とよく似ています。

インクリメンタルコンパイルは、プロジェクト参照で`composite`フラグを使用するとデフォルトで有効になりますが、オプトインした任意のプロジェクトにも同様の高速化をもたらすことができます。

### .d.ts ファイルのチェックをスキップする

デフォルトでは、TypeScriptはプロジェクト内のすべての`.d.ts`ファイルを完全に再チェックして問題や不整合を見つけますが、これは通常不要です。ほとんどの場合、`.d.ts`ファイルはすでに機能することがわかっています。型が互いに拡張する方法はすでに一度検証されており、重要な宣言はいずれにせよチェックされます。

TypeScriptには、`skipDefaultLibCheck`フラグを使用して、自身が提供する`.d.ts`ファイル（例：`lib.d.ts`）の型チェックをスキップするオプションがあります。

あるいは、`skipLibCheck`フラグを有効にして、コンパイル内の*すべて*の`.d.ts`ファイルのチェックをスキップすることもできます。

これら2つのオプションは、`.d.ts`ファイルの設定ミスや競合を隠してしまうことがあるため、ビルドの高速化の*ためだけ*に使用することをお勧めします。

### より高速な変性チェックを利用する

犬のリストは動物のリストでしょうか？つまり、`List<Dog>`は`List<Animals>`に代入可能でしょうか？これを確認する簡単な方法は、型をメンバーごとに構造的に比較することです。残念ながら、これは非常にコストがかかる可能性があります。しかし、`List<T>`について十分に理解していれば、この代入可能性チェックを、`Dog`が`Animal`に代- タグに代入可能かどうかを判断することに単純化できます（つまり、`List<T>`の各メンバーを考慮せずに）。（具体的には、型パラメータ`T`の[変性(variance)](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science))を知る必要があります。）コンパイラがこの潜在的なスピードアップを最大限に活用できるのは、`strictFunctionTypes`フラグが有効な場合のみです（そうでない場合は、より遅いですが、より寛容な構造的チェックが使用されます）。このため、`--strictFunctionTypes`（`--strict`下ではデフォルトで有効）でビルドすることをお勧めします。

TypeScriptのコンパイルは、多くの場合、他のビルドツールを念頭に置いて行われます。特に、バンドラを伴うWebアプリケーションを作成する場合にはそうです。いくつかのビルドツールについてしか提案できませんが、理想的にはこれらのテクニックは一般化できるはずです。

このセクションを読むだけでなく、選択したビルドツールのパフォーマンスについても必ず読んでください。例えば、

- [ts-loader's section on *Faster Builds*](https://github.com/TypeStrong/ts-loader#faster-builds)
- [awesome-typescript-loader's section on *Performance Issues*](https://github.com/s-panferov/awesome-typescript-loader/blob/master/README.md#performance-issues)

### 並行型チェック

型チェックは通常、他のファイルからの情報を必要とし、コードの変換/出力のような他のステップと比較して比較的高価になる可能性があります。型チェックには少し時間がかかるため、内部開発ループに影響を与える可能性があります。つまり、編集/コンパイル/実行のサイクルが長くなり、これがフラストレーションの原因になることがあります。

このため、一部のビルドツールでは、出力をブロックすることなく、別のプロセスで型チェックを実行できます。これは、ビルドツールでTypeScriptがエラーを報告する前に無効なコードが実行される可能性があることを意味しますが、多くの場合、エディタで最初にエラーが表示され、動作するコードの実行をそれほど長く妨げられることはありません。

この動作の例としては、Webpack用の[`fork-ts-checker-webpack-plugin`](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)プラグインや、時々これを行う[awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)があります。

### 分離されたファイル出力

デフォルトでは、TypeScriptの出力は、ファイルにローカルでない可能性のあるセマンティック情報を必要とします。これは、`const enum`や`namespace`のような機能を出力する方法を理解するためです。しかし、任意のファイルの出力を生成するために*他の*ファイルをチェックする必要があると、出力が遅くなる可能性があります。

非ローカル情報を必要とする機能の必要性はいくぶん稀です。`const enum`の代わりに通常の`enum`を使用でき、`namespace`の代わりにモジュールを使用できます。そのため、TypeScriptは非ローカル情報によって動作する機能でエラーを出す`isolatedModules`フラグを提供しています。`isolatedModules`を有効にすると、コードベースが`transpileModule`のようなTypeScript APIを使用するツールや、Babelのような代替コンパイラに対して安全であることを意味します。

As an example, the following code won't properly work at runtime with isolated file transforms because `const enum` values are expected to be inlined; but luckily, `isolatedModules` will tell us that early on.

```
// ./src/fileA.ts

export declare const enum E {
    A = 0,
    B = 1,
}

// ./src/fileB.ts

import { E } from "./fileA";

console.log(E.A);
//          ~
// error: Cannot access ambient const enums when the '--isolatedModules' flag is provided.
```

> **注意:** `isolatedModules`は自動的にコード生成を高速化するわけではありません。サポートされていない可能性のある機能を使用しようとしているときに通知するだけです。探すべきなのは、さまざまなビルドツールやAPIにおける分離されたモジュール出力です。

分離されたファイル出力は、以下のツールを使用して活用できます。

- [ts-loader](https://github.com/TypeStrong/ts-loader)は、`transpileModule`を使用して分離ファイル出力を行う[`transpileOnly`フラグ](https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalse)を提供します。
- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)は、`transpileModule`を使用して分離ファイル出力を行う[`transpileOnly`フラグ](https://github.com/s-panferov/awesome-typescript-loader/blob/master/README.md#transpileonly-boolean)を提供します。
- [TypeScriptの`transpileModule` API](https://github.com/microsoft/TypeScript/blob/a685ac426c168a9d8734cac69202afc7cb022408/lib/typescript.d.ts#L5866)を直接使用できます。
- [awesome-typescript-loaderは`useBabel`フラグを提供します](https://github.com/s-panferov/awesome-typescript-loader/blob/master/README.md#usebabel-boolean-defaultfalse)。
- [babel-loader](https://github.com/babel/babel-loader)はファイルを分離してコンパイルします（ただし、単独では型チェックを提供しません）。
- [gulp-typescript](https://www.npmjs.com/package/gulp-typescript)は、`isolatedModules`が有効な場合に分離ファイル出力を有効にします。
- [rollup-plugin-typescript](https://github.com/rollup/rollup-plugin-typescript)は、分離されたファイルコンパイル***のみ***を実行します。
- [ts-jest](https://kulshekhar.github.io/ts-jest/)は、[`isolatedModules`オプションを`true`に設定して](https://kulshekhar.github.io/ts-jest/docs/getting-started/options/isolatedModules)構成できます。
- [ts-node](https://www.npmjs.com/package/ts-node)は、`tsconfig.json`の`"ts-node"`フィールド内の[`"transpileOnly"`オプションを検出](https://www.npmjs.com/package/ts-node#cli-and-programmatic-options)でき、また`--transpile-only`フラグも持っています。

エディタ内の診断は通常、タイピングが停止してから数秒後に取得されます。`ts-server`のパフォーマンス特性は、`tsc`を使用してプロジェクト全体を型チェックするパフォーマンスに常に関連しているため、ここでの他のパフォーマンス最適化ガイダンスは編集体験の向上にも適用されます。入力中、チェッカーは完全に最初からやり直しますが、入力している内容に関する情報のみを要求します。これは、TypeScriptがアクティブに編集しているものの型をチェックするためにどれだけの作業が必要かによって編集体験が異なる可能性があることを意味します。VS Codeのようなほとんどのエディタでは、診断はプロジェクト全体ではなく、開いているすべてのファイルに対して要求されます。したがって、診断は`tsc`でプロジェクト全体をチェックする場合と比較して速く表示されますが、ホバーで型を表示するよりも遅くなります。なぜなら、ホバーで型を表示することは、TypeScriptにその特定の型を計算してチェックするよう*だけ*要求するからです。

## 問題の調査

何が問題なのかを知るためのヒントを得る特定の方法があります。

### エディタプラグインの無効化

エディタの体験はプラグインによって影響を受けることがあります。プラグイン（特にJavaScript/TypeScript関連のプラグイン）を無効にして、パフォーマンスや応答性の問題が解決されるか試してみてください。

特定の編集者には、パフォーマンスに関する独自のトラブルシューティングガイドもありますので、それらを読むことを検討してください。たとえば、Visual Studio Codeには[パフォーマンスの問題](https://github.com/microsoft/vscode/wiki/Performance-Issues)に関する独自のページもあります。

### extendedDiagnostics

TypeScriptを`--extendedDiagnostics`付きで実行すると、コンパイラがどこに時間を費やしているかの詳細なレポートを取得できます。

```
Files:                         6
Lines:                     24906
Nodes:                    112200
Identifiers:               41097
Symbols:                   27972
Types:                      8298
Memory used:              77984K
Assignability cache size:  33123
Identity cache size:           2
Subtype cache size:            0
I/O Read time:             0.01s
Parse time:                0.44s
Program time:              0.45s
Bind time:                 0.21s
Check time:                1.07s
transformTime time:        0.01s
commentTime time:          0.00s
I/O Write time:            0.00s
printTime time:            0.01s
Emit time:                 0.01s
Total time:                1.75s
```

> 注意： `Total time`は、先行するすべての時間の合計にはなりません。一部の処理には重複があり、計測されていない作業もあるためです。

ほとんどのユーザーにとって最も関連性の高い情報は次のとおりです。

| フィールド          | 意味                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Files`             | プログラムがインクルードしているファイルの数（`--listFilesOnly` を使用して内容を確認できます）。                                                                                                                          |
| `I/O Read time`     | ファイルシステムからの読み取りに費やされた時間 - これには、includeされたフォルダの走査も含まれます。                                                                                                                    |
| `Parse time`        | プログラムのスキャンと解析に費やされた時間                                                                                                                                                                            |
| `Program time`      | ファイルシステムからの読み取り、プログラムのスキャンと解析、およびプログラムグラフの他の計算を実行するために費やされた合計時間。これらのステップは、ファイルが`import`や`export`を介してインクルードされると解決およびロードされる必要があるため、ここで混在および結合されています。 |
| `Bind time`         | 単一ファイルにローカルな様々なセマンティック情報を構築するために費やされた時間。                                                                                                                                      |
| `Check time`        | プログラムの型チェックに費やされた時間。                                                                                                                                                                              |
| `transformTime time`| TypeScriptのAST（ソースファイルを表すツリー）を古いランタイムで動作する形式に書き換えるのに費やされた時間。                                                                                                            |
| `commentTime`       | 出力ファイル内のコメントを計算するのに費やされた時間。                                                                                                                                                                  |
| `I/O Write time`    | ディスクへのファイルの書き込み/更新に費やされた時間。                                                                                                                                                                  |
| `printTime`         | 出力ファイルの文字列表現を計算し、ディスクに出力するのに費やされた時間。                                                                                                                                                 |

この情報から検討すべきこと：

- ファイル数/コード行数が、プロジェクトのファイル数とおおよそ一致していますか？そうでなければ `--listFiles` を実行してみてください。
- `Program time` や `I/O Read time` がかなり高いように見えますか？ [`include` / `exclude` の設定が正しく構成されていることを確認してください](https://github.com/microsoft/TypeScript/wiki/#misconfigured-include-and-exclude)。
- 他の時間は問題なさそうですか？ [問題を報告することを検討してみてください！](https://github.com/microsoft/TypeScript/wiki/#filing-an-issue) 診断に役立つことは次のとおりです。
  - `printTime` が高い場合は `emitDeclarationOnly` で実行する。
  - [コンパイラのパフォーマンス問題の報告](https://github.com/microsoft/TypeScript/wiki/#reporting-compiler-performance-issues)に関する指示を読む。

### showConfig

`tsc`を実行する際、特に`tsconfig.json`が他の設定ファイルを拡張している場合、どのような設定でコンパイルが実行されているかが常に明確であるとは限りません。`showConfig`は、`tsc`が呼び出しに対して計算する内容を説明できます。

```
tsc --showConfig

# or to select a specific config file...

tsc --showConfig -p tsconfig.json
```

### listFilesOnly

TypeScriptが本来よりも多くのファイルを読み込んでいることに驚くことがあるかもしれません。しかし、実際にどのファイルを読み込んでいるのでしょうか？ `listFilesOnly`がそれを教えてくれます。

```
tsc --listFilesOnly
```

*注意: `--listFiles`はこのフラグのやや非推奨のバージョンです。`--listFiles`は完全なコンパイルを実行しますが、`--listFilesOnly`はコンパイルに必要なすべてのファイルを見つけ次第終了するため、通常は後者の方が望ましくありません。*

### explainFiles

`explainFiles`を付けて実行すると、ファイルがコンパイルに含まれた*理由*を説明するのに役立ちます。出力はやや冗長なので、出力をファイルにリダイレクトするとよいでしょう。

```
tsc --explainFiles > explanations.txt
```

存在するべきでないファイルを見つけた場合、`tsconfig.json`の[`include` / `exclude`リストを修正する](https://github.com/microsoft/TypeScript/wiki/Performance#misconfigured-include-and-exclude)か、あるいは`types`、`typeRoots`、`paths`のような他の設定を調整する必要があるかもしれません。

### traceResolution

`explainFiles`はファイルがどのようにプログラムに取り込まれたかを指摘できますが、`traceResolution`はインポートパスの解決で行われた正確なステップを診断するのに役立ちます。出力はやや冗長なので、出力をファイルにリダイレクトするとよいでしょう。

```
tsc --traceResolution > resolutions.txt
```

`module` / `moduleResolution`の設定に問題があることや、依存関係の`package.json`ファイルが正しく設定されていないことがわかるかもしれません。

### tscを単独で実行する

多くの場合、ユーザーはGulp、Rollup、Webpackなどのサードパーティ製ビルドツールを使用してパフォーマンスの低下に遭遇します。`tsc --extendedDiagnostics`を実行して、TypeScriptの使用とツールとの間に大きな不一致を見つけることは、外部の設定ミスや非効率性を示している可能性があります。

心に留めておくべきいくつかの質問：

- `tsc`とTypeScript統合を備えたビルドツールとで、ビルド時間に大きな差はありますか？
- ビルドツールが診断を提供する場合、TypeScriptの解決とビルドツールの解決との間に違いはありますか？
- ビルドツールに、原因となりうる*独自の設定*はありますか？
- ビルドツールに、*そのTypeScript統合のための*設定で原因となりうるものはありますか？（例：ts-loaderのオプションなど）

### 依存関係のアップグレード

計算量の多い`.d.ts`ファイルによって、TypeScriptの型チェックが影響を受けることがあります。これは稀ですが、起こり得ます。より新しいバージョンのTypeScript（より効率的である可能性があります）や、`@types`パッケージのより新しいバージョン（リグレッションが元に戻されている可能性があります）にアップグレードすることで、問題が解決することがよくあります。

### パフォーマンストレーシング

場合によっては、上記のアプローチだけではTypeScriptが遅い理由を理解するのに十分な洞察が得られないことがあります。TypeScript 4.1以降では、コンパイラが時間を費やしている作業を把握できる`--generateTrace`オプションが提供されています。`--generateTrace`は、`@typescript/analyze-trace`ユーティリティ、またはEdgeやChrome内で分析できる出力ファイルを作成します。

理想的には、TypeScriptはエラーなしでプロジェクトをコンパイルできるべきですが、これはトレースの厳密な要件ではありません。

トレースを取得する準備ができたら、`--generateTrace`フラグを付けてTypeScriptを実行できます。

```
tsc -p ./some/project/src/tsconfig.json --generateTrace tracing_output_folder
```

場合によっては、エディタからトレースを取得することもできます。Visual Studio Codeでは、UIで`TypeScript > Tsserver: Enable Tracing`を設定するか、次のJSON設定を追加することで切り替えることができます。

```
"typescript.tsserver.enableTracing": true,
```

パフォーマンスのホットスポットをすばやく一覧表示するには、npmから[@typescript/analyze-trace](https://www.npmjs.com/package/@typescript/analyze-trace)をインストールして実行します。

あるいは、詳細を手動で確認することもできます。

1. Edge/Chromeで`about://tracing`にアクセスし、
2. 左上の`Load`ボタンをクリックし、
3. 出力ディレクトリにある生成されたJSONファイル（`trace.*.json`）を開きます。

ビルドが`tsc`を直接呼び出さない場合（例：バンドラを使用しているため）や、エディタで速度低下が見られる場合でも、`tsc`からトレースを収集して解釈する方が、速度低下を直接調査するよりも一般的にはるかに簡単であり、それでも代表的な結果が得られることに注意してください。

パフォーマンストレーシングについての詳細は、[こちらで詳しく読むことができます](https://github.com/microsoft/TypeScript/wiki/Performance-Tracing)。

## よくある問題

Once you've trouble-shooted, you might want to explore some fixes to common issues. If the following solutions don't work, it may be worth [filing an issue](https://github.com/microsoft/TypeScript/wiki/#filing-an-issue).

As mentioned above, the `include` / `exclude` options can be misused in several ways.

| Problem | Cause | Fix |
| --- | --- | --- |
| `node_modules` was accidentally included from deeper folder | *`exclude` was not set* | `"exclude": ["**/node_modules", "**/.*/"]` |
| `node_modules` was accidentally included from deeper folder | `"exclude": ["node_modules"]` | `"exclude": ["**/node_modules", "**/.*/"]` |
| Hidden dot files (e.g. `.git`) were accidentally included | `"exclude": ["**/node_modules"]` | `"exclude": ["**/node_modules", "**/.*/"]` |
| Unexpected files are being included. | *`include` was not set* | `"include": ["src"]` |

If your project is already properly and optimally configured, you may want to [file an issue](https://github.com/microsoft/TypeScript/issues/new/choose).

The best reports of performance issues contain *easily obtainable* and *minimal* reproductions of the problem. In other words, a codebase that can easily be cloned over git that contains only a few files. They require either no external integration with build tools - they can either be invoked via `tsc` or use isolated code which consumes the TypeScript API. Codebases that require complex invocations and setups cannot be prioritized.

We understand that this is not always easy to achieve - specifically, because it is hard to isolate the source of a problem within a codebase, and because sharing intellectual property may be an issue. In some cases, the team will be willing to send a non-disclosure agreement (NDA) if we believe the issue is highly impactful.

Regardless of whether a reproduction is possible, following these directions when filing issues will help us provide you with performance fixes.

Sometimes you'll witness performance issues in both build times as well as editing scenarios. In these cases, it's best to focus on the TypeScript compiler.

First, a nightly version of TypeScript should be used to ensure you're not hitting a resolved issue:

```
npm install --save-dev typescript@next

# or

yarn add typescript@next --dev
```

A compiler perf issue should include

- The version of TypeScript that was installed (i.e. `npx tsc -v` or `yarn tsc -v`)
- The version of Node on which TypeScript ran (i.e. `node -v`)
- The output of running with `extendedDiagnostics` (`tsc --extendedDiagnostics -p tsconfig.json`)
- Ideally, a project that demonstrates the issues being encountered.
- Output logs from profiling the compiler (`isolate-*-*-*.log` and `*.cpuprofile` files)

[Performance traces](https://github.com/microsoft/TypeScript/wiki/#performance-tracing) are meant to help teams figure out build performance issues in their own codebases; however, they can also be useful for the TypeScript team in diagnosing and fixing issues. See the above section on [performance traces](https://github.com/microsoft/TypeScript/wiki/#performance-tracing) and continue reading more on our dedicated [performance tracing page](https://github.com/microsoft/TypeScript/wiki/Performance-Tracing).

You can provide the team with diagnostic traces by running `dexnode` alongside TypeScript with the `--generateCpuProfile` flag:

```
npm exec dexnode -- ./node_modules/typescript/lib/tsc.js --generateCpuProfile profile.cpuprofile -p tsconfig.json
```

Here `./node_modules/typescript/lib/tsc.js` can be replaced with any path to where your version of the TypeScript compiler is installed, and `tsconfig.json` can be any TypeScript configuration file.`profile.cpuprofile` is an output file of your choice.

This will generate two files:

- `dexnode` will emit to a file of the `isolate-*-*-*.log` (e.g. `isolate-00000176DB2DF130-17676-v8.log`).
- `--generateCpuProfile` will emit to a file with the name of your choice. In the above example, it will be a file named `profile.cpuprofile`.

[pprof](https://github.com/google/pprof) is a helpful utility for visualizing CPU and memory profiles. pprof has different visualization modes that may make problem areas more obvious, and its profiles tend to be smaller than those produced from `--generateCpuProfile`.

The easiest way to generate a profile for pprof is to use [pprof-it](https://github.com/jakebailey/pprof-it). There are [different ways to use pprof-it](https://github.com/jakebailey/pprof-it?tab=readme-ov-file#usage), but a quick way is to use npx or a similar tool:

```
npx pprof-it ./node_modules/typescript/lib/tsc.js ...
```

You can also install it locally:

```
npm install --no-save pprof-it
```

and run certain build scripts via npm, npx, and similar tools with the `--node-option` flag:

```
npm --node-option="--require pprof-it" run <your-script-name>
```

To actually view the generated profile with [pprof](https://github.com/google/pprof), the Go toolset is required at minimum, and Graphviz is required for certain visualization capabilities.[See more here](https://github.com/google/pprof?tab=readme-ov-file#building-pprof).

Alternatively, you can use [SpeedScope](https://www.speedscope.app/) directly from your browser.

Perceived editing performance is frequently impacted by a number of things, and the only thing within the TypeScript team's control is the performance of the JavaScript/TypeScript language service, as well as the integration between that language service and certain editors (i.e. Visual Studio, Visual Studio Code, Visual Studio for Mac, and Sublime Text). Ensure that all 3rd-party plugins are turned off in your editor to determine whether there is an issue with TypeScript itself.

Editing performance issues are slightly more involved, but the same ideas apply: clone-able minimal repro codebases are ideal, and though in some cases the team will be able to sign an NDA to investigate and isolate issues.

Including the output from `tsc --extendedDiagnostics` is always good context, but taking a TSServer trace is the most helpful.

1. Open up your command palette and either

- open your global settings by entering `Preferences: Open User Settings`
- open your local project by entering `Preferences: Open Workspace Settings`

2. Set the option `"typescript.tsserver.log": "verbose",`
3. Restart VS Code and reproduce the problem
4. In VS Code, run the `TypeScript: Open TS Server log` command
5. This should open the `tsserver.log` file.

## User documentation

**News**

- [Roadmap](https://github.com/microsoft/TypeScript/wiki/Roadmap)
- [Breaking Changes](https://github.com/microsoft/TypeScript/wiki/Breaking-Changes)
- [API Breaking Changes](https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes)

**Debugging TypeScript**

- [Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
- [Performance-Tracing](https://github.com/microsoft/TypeScript/wiki/Performance-Tracing)
- [Debugging-Language-Service-in-VS-Code](https://github.com/microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code)
- [Getting-logs-from-TS-Server-in-VS-Code](https://github.com/microsoft/TypeScript/wiki/Getting-logs-from-TS-Server-in-VS-Code)
- [JavaScript-Language-Service-in-Visual-Studio](https://github.com/microsoft/TypeScript/wiki/JavaScript-Language-Service-in-Visual-Studio)
- [Providing-Visual-Studio-Repro-Steps](https://github.com/microsoft/TypeScript/wiki/Providing-Visual-Studio-Repro-Steps)

**Contributing to TypeScript**

- [Contributing to TypeScript](https://github.com/microsoft/TypeScript/wiki/Contributing-to-TypeScript)
- [TypeScript Design Goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals)
- [Coding Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
- [Useful Links for TypeScript Issue Management](https://github.com/microsoft/TypeScript/wiki/Useful-Links-for-TypeScript-Issue-Management)
- [Writing Good Design Proposals](https://github.com/microsoft/TypeScript/wiki/Writing-Good-Design-Proposals)
- [Compiler Repo Notes](https://github.com/microsoft/TypeScript-Compiler-Notes/)
- [Deployment](https://github.com/microsoft/TypeScript/wiki/TypeScript-Deployment)

**Building Tools for TypeScript**

- [Architectural Overview](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview)
- [Using the Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Using the Language Service API](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API)
- [Standalone Server (tsserver)](https://github.com/microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29)
- [TypeScript MSBuild In Depth](https://github.com/microsoft/TypeScript/wiki/TypeScript-MSBuild-In-Depth)
- [Debugging Language Service in VS Code](https://github.com/microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code)
- [Writing a Language Service Plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)
- [Docker Quickstart](https://github.com/microsoft/TypeScript/wiki/Docker-Quickstart)

**FAQs**

- [FAQ](https://github.com/microsoft/TypeScript/wiki/FAQ)
- [FAQs for API Consumers](https://github.com/microsoft/TypeScript/wiki/FAQs-for-API-Consumers)

**The Main Repo**

- [Triggering TypeScript Bot](https://github.com/microsoft/TypeScript/wiki/Triggering-TypeScript-Bot)
- [Tooling on the Compiler Repo](https://github.com/microsoft/TypeScript/wiki/Tooling-On-The-Compiler-Repo)
