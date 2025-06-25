---
title: "はじめに｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/1-epasync-begin"
author:
  - "estra"
published: 2024-08-16
created: 2025-06-25
description: |
  この本は、Promiseチェーンとイベントループを軸にJavaScriptの非同期処理の全体的なメカニズムを解説するものです。非同期処理の学習で陥りがちなトラップや誤解を解き明かし、読者が非同期処理の制御の流れを理解し、予測できるようになることを目指します。
tags:
  - "JavaScript"
  - "TypeScript"
  - "Promise"
  - "async/await"
  - "非同期処理"
---

## 概要

本書は、Promiseチェーンとイベントループを軸に、JavaScriptの非同期処理の全体的なメカニズムを解説するものです。非同期処理の学習で陥りがちな罠や誤解を解き明かし、読者が非同期処理の制御フローを理解し、予測できるようになることを目標としています。

非同期処理を理解するためには、一見関係ないように見える知識が必要になることがあります。本書では、そうした知識から解説を始めることで、学習者がつまずくことなく理解を深められるように構成されています。

![必要な知識のライン](https://res.cloudinary.com/zenn/image/fetch/s--27V3GnWj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/1335191279114149ebbb010a.png%3Fsha%3Da9988320fa8f24d617f12dd1b5e77c31395beddb)

## 対象読者

本書は、「非同期処理の理解に苦戦している人」を対象としています。一度非同期処理を学んだが挫折した人や、実行順序がなぜそうなるのか分からない、といった悩みを持つ読者に最適です。

## 本書の構成

本書は以下の5部構成です。

1. **第１部 - API を提供する環境と実行メカニズム**: Promiseやasync/awaitの知識も一部利用しつつ、メタ的な視点から解説します。
2. **第２部 - Promise インスタンスと連鎖**: Promiseの基礎からPromise chainへと解説を進めます。
3. **第３部 - async 関数と await 式の挙動**: V8エンジンのアプローチも交えてasync/awaitを理解します。
4. **第４部 - 制御と型注釈**: 応用として複数処理の制御方法やTypeScriptでの型注釈を学びます。
5. **第５部 - 仕様およびその他の番外編**: メインの解説で扱いきれなかったPromiseの仕様などを解説します。

## 使用する環境

本書では、主に[Deno](https://deno.land/)環境でコードを実行します。Denoは設定なしでTypeScriptを実行できる利点があり、JavaScriptからTypeScriptへのスムーズな移行を助けます。Node.js環境についても適宜触れていきます。

* **Deno**: `1.20.4`
* **Node.js**: `v18.2.0`
* **V8 Engine**: `10.3.154`

## JS Visualizer 使用上の注意点

本書では "JavaScript Visualizer 9000" (JS Visualizer) というツールを多用しますが、以下の点に注意が必要です。

* 日本語は使用できません。
* Web APIの並列的動作の表現が不正確な場合があります。
* タスクキューが一つしかないように見えるため、誤解を生む可能性があります。
* グローバルコンテキストが視覚化されないため、実行順序について誤解する可能性があります。
* `then()`から発生するすべてのマイクロタスクが視覚化されるわけではありません。

これらの点を踏まえ、ツールはあくまでイベントループのイメージを掴むための補助として利用してください。

## フィードバック

本書に関する感想、質問、間違いの指摘などは、ZennのスクラップやGitHubリポジトリで受け付けています。

![GitHubで編集を提案](https://res.cloudinary.com/zenn/image/fetch/s--aaL2yDit--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/46f69ae625e94ec3da3d6824.jpg%3Fsha%3D49c3fb4ef14aef23f342fbf727cda54861764168)
