---
title: "君だけのオリジナル async / await を作ろう - susisu / TSKaigi2025"
source: "https://www.youtube.com/watch?v=IElOsSr7bOI"
author:
  - "susisu"
  - "[[TSKaigi]]"
published: 2025-07-02
created: 2025-07-03
description: |
  本発表では、TypeScriptのGeneratorを用いてasync/awaitの機能を自作する方法を解説します。基本的な実装から、TypeScriptによる型付け、さらにはPromise以外のResult型やEffect Systemといった応用的なトピックまで掘り下げ、TypeScriptの持つ表現力と面白さを探求します。
tags:
  - "TypeScript"
  - "JavaScript"
  - "async/await"
  - "Generator"
  - "Effect System"
  - "Algebraic Effects"
---
![](https://i.ytimg.com/vi/IElOsSr7bOI/maxresdefault.jpg)

本発表では、TypeScriptのコアな機能であるGeneratorを駆使して、現代の非同期処理に不可欠な`async/await`構文を自ら実装する方法について、その理論から実践、応用までを包括的に解説します。

## 発表の概要

発表は以下の4つの主要なテーマで構成されています。

1. **Generatorによる`async/await`の自作**: JavaScriptのGeneratorが持つ計算の中断・再開機能（コルーチン）を利用して、`async/await`の挙動を再現する古典的なテクニックを紹介します。
2. **TypeScriptによる型付け**: 自作した`async/await`に対して、`yield*`構文を活用して式ごとに異なる型を安全に適用する方法を解説します。
3. **Promise以外への応用**: `Result`型を例に、このテクニックがPromiseだけでなく、モナド的な構造を持つ他のデータ型にも応用可能であることを示します。
4. **Effect Systemの実装**: 副作用を型レベルで安全に管理する「Effect System」という先進的なパラダイムを、TypeScriptの型機能とGeneratorを用いて実験的に実装する試みを紹介します。

## 1. Generatorによる`async/await`の自作

`async/await`がJavaScriptに導入される以前、開発者たちはGeneratorを使って同様の非同期フロー制御を実現していました。

* **Generatorの基本**: `function*`で定義され、`yield`で処理を一時中断できる関数です。`next()`メソッドで処理を再開し、その際に値を渡すことも可能です。
* **実装のアイデア**:
  * `async function`を`function*`に置き換える。
  * `await`を`yield`に置き換える。
  * `yield`されたPromiseが解決されるのを待ち、その結果をもってGeneratorの実行を再開する「ランナー関数」を実装する。

これにより、手続き的なスタイルで非同期処理を記述できます。

## 2. TypeScriptによる型付け

JavaScriptで実装した仕組みに、TypeScriptで安全な型を付けるには2つの壁が存在します。

1. **実行方法の保証がない**: Generatorが常に自作のランナーで実行される保証はなく、規約（リンターなど）でカバーする必要がある。
2. **`yield`式ごとの型付けが困難**: Generatorの型引数`Generator<T, TReturn, TNext>`では、すべての`yield`式の型が単一の`TNext`になってしまう。

この問題は**`yield*`（yield star）**で解決できます。`yield*`は処理を別のイテラブルに委譲する構文で、その式全体の型は委譲先のイテラブルの型によって決まります。

**解決策**:
Promiseを返すだけの単純なGenerator（イテラブル）に変換するヘルパー関数を介して`yield*`することで、`await`するPromiseごとに異なる結果の型を安全に付けられるようになります。

## 3. Promise以外への応用 (`Result`型)

このテクニックは、非同期処理に限らず、**値と残りの計算を結合できる構造（モナドなど）**であれば応用可能です。

本発表では、成功（`Ok`）と失敗（`Error`）を表現する**`Result`型**を例に挙げています。`Result`型に対するエラーハンドリングの連鎖（`then`のような処理）を、`yield*`を使って`async/await`のように簡潔に記述できることを示しました。

## 4. 発展：Effect Systemの実装

本発表の最も先進的な部分として、副作用（ネットワークリクエスト、ファイルシステムアクセスなど）を型レベルで安全に扱う**Effect System**の実装が紹介されました。

* **概念**: 関数のシグネチャに、その関数が発生させうる副作用の種類（`Net | FS`など）を明記する。
* **利点**:
  * シグネチャにない副作用の実行をコンパイルエラーにできる。
  * プログラムのどの部分がどんな副作用を持つか、型を見るだけでわかる。
  * 副作用の具体的な実装（本番用、テスト用モックなど）を実行時に注入できる（Dependency Injection）。

発表者は、この概念をTypeScriptの型システムとGeneratorを用いて実現する実験的なライブラリを開発し、その可能性を示しました。これは**代数的エフェクト（Algebraic Effects & Handlers）**と呼ばれるパラダイムの実装です。

## まとめ

本発表は、GeneratorというJavaScriptの基本的な機能を深掘りすることで、`async/await`の仕組みを理解し、さらには`Result`型やEffect Systemといった高度なプログラミングパラダイムをTypeScriptでいかに表現できるかを示しました。TypeScriptの型システムが持つ奥深さと面白さを体感できる内容となっています。
