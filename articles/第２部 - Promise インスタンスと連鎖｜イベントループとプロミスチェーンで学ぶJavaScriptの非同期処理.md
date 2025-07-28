---
title: "第２部 - Promise インスタンスと連鎖｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/part-02-epasync"
author:
  - "PADAone🐕"
published: 2024-08-16
created: 2025-07-28
description: |
  本記事では、JavaScriptの非同期処理における中核的な概念であるPromiseインスタンスとPromise chainについて詳述します。非同期処理の実行順序を予測するためのメンタルモデル構築の基礎を固め、後のasync/awaitの理解へと繋げることを目的としています。
tags:
  - "JavaScript"
  - "Promise"
  - "非同期処理"
  - "Promiseチェーン"
  - "イベントループ"
---
# 第２部 - Promise インスタンスと連鎖

[![PADAone🐕](https://res.cloudinary.com/zenn/image/fetch/s--XVoj6cOU--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_70/https://storage.googleapis.com/zenn-user-upload/avatar/7f05673c72.jpeg) PADAone🐕](https://zenn.dev/estra)

更新日: 2024.08.16

## 概要

この第２部では、非同期処理の処理予測を行うためのメンタルモデルを構築する上で基礎となる、非常に重要な概念である **Promise インスタンス** と **Promise chain** について詳しく見ていきます。

Promise chain の具体的なコード実行を通じて非同期処理の実行順序を予測できるように訓練します。この部の内容をしっかりと学ぶことで、[第３部](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/part-03-epasync)の `async/await` をスムーズに理解できるようになります。

## 間違いに関する補足

以前の解説に含まれていた誤りについては、新しいチャプター『[Promise.prototype.then の仕様挙動](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/m-epasync-promise-prototype-then)』で別途詳細に解説しています。このチャプターはECMAScriptの仕様解説を含むため、番外編として位置づけられています。

## 本章のチャプター構成

本章で取り扱うトピックは以下の通りです。Promiseの基本から応用までを網羅しています。

- [Promise の基本概念](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/a-epasync-promise-basic-concept)
- [Promise コンストラクタと Executor 関数](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/3-epasync-promise-constructor-executor-func)
- [コールバック関数の同期実行と非同期実行](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/4-epasync-callback-is-sync-or-async)
- [resolve 関数と reject 関数の使い方](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/g-epasync-resolve-reject)
- [複数の Promise を走らせる](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/5-epasync-multiple-promises)
- [then メソッドは常に新しい Promise を返す](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/6-epasync-then-always-return-new-promise)
- [Promise chain で値を繋ぐ](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/7-epasync-pass-value-to-the-next-chain)
- [then メソッドのコールバックで Promise インスタンスを返す](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/8-epasync-return-promise-in-then-callback)
- [Promise chain はネストさせない](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/9-epasync-dont-nest-promise-chain)
- [コールバックで副作用となる非同期処理](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/10-epasync-dont-use-side-effect)
- [アロー関数で return を省略する](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/11-epasync-omit-return-by-arrow-shortcut)
- [catch メソッドと finally メソッド](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/h-epasync-catch-finally)
- [古い非同期 API を Promise でラップする](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/12-epasync-wrapping-macrotask)
- [イベントループは内部にネストしたループがある](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/13-epasync-loop-is-nested)

これらの内容を通じて、Promiseの挙動を深く理解し、非同期処理を自在に扱えるようになることを目指します。
