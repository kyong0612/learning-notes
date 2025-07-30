---
title: "Promise コンストラクタと Executor 関数｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/3-epasync-promise-constructor-executor-func"
author:
  - "PADAone🐕"
published: "2025-05-31"
created: 2025-07-30
description: |
  Promiseの基本概念に続き、PromiseコンストラクタとExecutor関数を通じてコード上でのPromiseインスタンスの作成方法を具体的に解説します。非同期処理の結果を表現するビルトインオブジェクトとしてのPromiseの役割と、`new Promise(executor)`の基本構文、そして`resolve`と`reject`関数の使い方を学びます。
tags:
  - "JavaScript"
  - "Promise"
  - "非同期処理"
  - "Executor"
---

この記事では、JavaScriptの非同期処理の核心である`Promise`オブジェクトの具体的な作成方法、特に`Promise`コンストラクタと`Executor`関数に焦点を当てて解説します。

## Promiseオブジェクトの基本

`Promise`は、**非同期処理の最終的な結果（成功または失敗）を表現するビルトインオブジェクト**です。`fetch()`のような非同期APIは`Promise`インスタンスを返しますが、`Promise`自体はECMAScriptのコア機能の一部です。

## PromiseコンストラクタとExecutor関数

`Promise`インスタンスは`new Promise()`コンストラクタを用いて生成します。このコンストラクタは、**Executor関数**と呼ばれるコールバック関数を引数に取ります。

```javascript
const promise = new Promise(function executor(resolve, reject) {
  // 非同期処理など
  if (/* 成功 */) {
    resolve("成功時の値");
  } else {
    reject("失敗時の理由");
  }
});
```

`Executor`関数は、`Promise`が作成されると**即座に同期的**に実行されます。この関数は2つの引数を取ります。

1. **`resolve`**: `Promise`を**履行 (Fulfilled)** 状態にするための関数。成功時の値を引数に渡します。
2. **`reject`**: `Promise`を**拒否 (Rejected)** 状態にするための関数。失敗時の理由（通常は`Error`オブジェクト）を引数に渡します。

`Executor`関数内でエラーがスローされた場合、その`Promise`は自動的に`reject`されます。

### アロー関数による省略記法

`Executor`関数は、アロー関数を使うことでより簡潔に記述できます。

```javascript
// 基本形
const promise = new Promise((resolve, reject) => {
  if (Math.random() < 0.5) {
    resolve("Promise履行時の値");
  } else {
    reject("Promise拒否時の理由");
  }
});

// rejectを省略
const fulfilledPromise = new Promise(resolve => {
  resolve("常に履行されるPromise");
});
```

引数が1つの場合は括弧を省略したり、関数本体が単一の式の場合は`return`と波括弧を省略できます。

```javascript
const promise = new Promise(res => res("履行値"));
```

## 静的メソッド: `Promise.resolve()` と `Promise.reject()`

`new Promise(...)`の構文を使わずに、特定の状態で解決済みの`Promise`インスタンスを生成するための便利なショートカットが存在します。

* **`Promise.resolve(value)`**: `value`で履行された`Promise`インスタンスを返します。
* **`Promise.reject(reason)`**: `reason`で拒否された`Promise`インスタンスを返します。

```javascript
// new Promise(res => res("履行値")) とほぼ同等
const promise1 = Promise.resolve("履行値");

// new Promise((_, rej) => rej("拒否理由")) とほぼ同等
const promise2 = Promise.reject("拒否理由");
```

これらの静的メソッドは、テストコードや、すでに値が確定している場合に`Promise`を生成する際に非常に役立ちます。

## （補足）関数式とアロー関数

記事では、`Promise`のコールバックで多用されるアロー関数についても補足説明しています。

* **関数式**: `const myFunc = function() { ... };` のように、関数を値として変数に代入する形式。`const`で宣言することで関数の再代入を防ぎます。
* **アロー関数**: `const myFunc = () => { ... };` というより簡潔な構文。`function`キーワードが不要で、`this`の束縛の挙動が異なります（この記事では詳述されていません）。

アロー関数は、コールバック関数を渡す際にコードを短く、読みやすくするために広く利用されています。

## まとめ

* `Promise`は非同期処理の結果を扱うオブジェクトであり、`new Promise(executor)`でインスタンス化します。
* `Executor`関数は`resolve`と`reject`関数を受け取り、`Promise`の状態を決定します。
* `Promise.resolve()`と`Promise.reject()`は、特定の状態で解決済みの`Promise`を簡単に作成できる静的メソッドです。
* アロー関数は、`Promise`チェーンなどでコールバックを記述する際にコードを簡潔にします。
