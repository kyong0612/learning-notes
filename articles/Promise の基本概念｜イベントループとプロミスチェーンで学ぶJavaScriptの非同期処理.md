---
title: "Promise の基本概念｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/a-epasync-promise-basic-concept"
author:
  - "PADAone🐕"
published: 2024-08-16
created: 2025-07-29
description: |
  JavaScriptのPromiseに関する基本的な概念、特に`State`（状態）と`Fate`（運命）について解説します。Promiseインスタンスが取りうる3つの状態（Pending, Fulfilled, Rejected）と、一度確定すると変化しない`Settled`という概念、さらに他のPromiseの状態に依存する`Resolved`という運命について図解を交えて説明し、`resolve`と`reject`の挙動の違いや用語の正確な使い分けの重要性を強調しています。
tags:
  - "JavaScript"
  - "Promise"
  - "非同期処理"
  - "ECMAScript"
  - "イベントループ"
---
## このチャプターについて

このチャプターでは Promise の基本的な概念と用語を紹介しておきます。Promise の知識自体は他の解説やドキュメントなどで目にしていると思うので、簡単な説明自体は省いて本質的な部分のみにフォーカスして解説します。なお、Promise を使った具体的なコードについての解説は『 [Promise コンストラクタと Executor 関数](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/3-epasync-promise-constructor-executor-func) 』のチャプターで行います。

## State と Fate

紹介する用語はこちらのドキュメントを参考にしています。以下で解説する用語は筆者の解釈が混じっていますが、このドキュメント自体は MDN のお墨付きなので信用してください (というか ES6 仕様のドラフトなので、正統な Promise についての根本的なコンセプトが記述されています)。

このドキュメントは以下のリポジトリの一部ですが、このリポジトリ自体は Promise についての ECMAScript 仕様の礎となったものなので、含まれる他のドキュメントなども後々見ていくと理解の助けとなる部分が多いです。

プロポーザルのドラフトという形式であり、ECMAScript 全体から切り離されて Promise のみにフォーカスされているため、Promise 仕様にまつわる操作がどのようなものであるのかが簡単に俯瞰できます。ただし、ES6 時代の古いものではあるという認識は必要なので注意してください。

### State

Promise インスタンスには次の３つの状態 (**State**) があり、それぞれに排他的となっています (同時に１つの状態しか取りえないようになっています)。

- Pending(待機状態)
- Fulfilled(履行状態)
- Rejected(拒否状態)

**Settled** (決定状態、不変状態) は実際の状態ではなく、Pending(待機状態) であるかないかを言い表すための言葉です。 **Pending でなければ Settled だと言えます** 。

複数の Promise の完了を待つことができる Promise の静的メソッド `Promise.allSettled()` などの意味もこれです。Fulfilled か Rejected かは気にせず、とりあえず Settled になっているかだけに注意を払います。

重要なこととして、Settled になった Promise インスタンスの **状態は二度と変わりません** 。

<details>
<summary>仕様上の補足</summary>

Promise の State 概念は ECMAScript 仕様上では [Promise インスタンスが持つ内部スロット](https://tc39.es/ecma262/#table-internal-slots-of-promise-instances) の一つである `[[PromiseState]]` で管理されています。

</details>

### Fate

Promise インスタンスには２つの運命 (**Fate**) があり、それぞれに排他的になっています (同時に１つの運命しか取りえないようになっています)。

- Resolved(解決済み)
- Unresolved(未解決)

Resolved(解決済み) の Promise インスタンスは他の Promise インスタンスに従ってロックイン (**他の Promise インスタンスの状態に自身の状態が左右される状況**) されているか、Settled になっている場合を指します。

Resolved でなければ Unresolved であり、対象の Promise インスタンスに対して resolve や reject を試みることでその Promise の状態に影響を及ぼすことできる場合には、その Promise インスタンスは Unresolved です。

Fate の概念は非常に分かりづらいので State と共に図にしてみました。

![promiseStateFate](https://res.cloudinary.com/zenn/image/fetch/s--Rg5YD1-c--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/3982bcfe8447ab3156651227.jpg%3Fsha%3D4993a7b0b69785898da6ac21a88684ec05b3b9ef)
*Promise の State と Fate の関係図*

中央の `?` が書かれた Promise インスタンスは他の Promise インスタンスに従っています。つまり、他の Promise インスタンスで resolve されて、 `Promise.resolve(promise)` や `promise.then(callback)` において `.then(callback)` メソッドで返ってくる Promise インスタンスなどが該当します。このインスタンスは Pending 状態であっても、従っている Promise インスタンスが Settled になることで連鎖的に状態 (State) が遷移するため、このインスタンスの運命 (Fate) は Resolved となっています。

左の黄色の Promise インスタンスに対して何かしらの操作 (resolve や reject) を行うとそのインスタンスの状態に影響があるので、この Promise インスタンスは Unresolved といえます。実はこれを知っていたとしても活用するような場面自体がすくないので、とりあえず Fate については「ふーん」ぐらいの気分で理解しておいて必要になったらちゃんと理解するぐらいの気持ちで十分です。

Unresolved な Promise インスタンスは必然的に Pending 状態です。上で述べたように、Pending 状態である Promise インスタンスのすべてが Unresolved ではないことに注意してください。

<details>
<summary>仕様上の補足</summary>

Resolved であるかどうかということを示す Promise の Fate 概念は ECMAScript 仕様上では [CreateResolvingFunctions](https://tc39.es/ecma262/#sec-createresolvingfunctions) 抽象操作によって作成される `resolve` 関数と `reject` 関数が持つ `[[AlreadyResolved]]` という内部スロットに真偽値で追跡されています。この値が `true` なら Fate は Resolved であり、 `false` なら Fate は Unresolved ということになります。

</details>

## 用語の使い分けに注意

用語や概念についての注意点として、翻訳した日本語で考えてしまうと用語がややこしくなるので、なるべくオリジナルの英単語を使って理解した方が良いです。特に日本語の「 **解決する** 」などの単語には注意を払った方が良いでしょう。

とは言っても、基本的に英語の用語でもややこしく、"resolve" と言ったときに、単に fulfill(履行状態にするという意味) にすることと同じ意味で言っている場合があったりします。従って、"resolve" を考えるときは "resolve with ~" というように **何で resolve するのか** を考えると理解しやすくなります。"resolve with a plain value" というように、単なる値で resolve するなら fulfill であり、これは単に履行状態にするという意味で捉えることができます。

動詞の意味がややこしくなる理由は、動詞の元となる実際の `resolve()` 関数の挙動が `reject()` 関数に比べて複雑であり、 **引数の値の種類によって処理的な場合分けがあるから** です。 `resolve(promise)` というように Promise インスタンスで resolve を試みると unwrap という現象が起きて、その従っている Promise インスタンスの状態に同化します。逆に、 `reject(promise)` は unwrap を行わずシンプルに Rejected 状態に遷移するような操作となっています。

<details>
<summary>仕様上の補足</summary>

`resolve` 関数の挙動について仕様的に何が起きるのかについては『 [Promise.prototype.then の仕様挙動](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/m-epasync-promise-prototype-then) 』のチャプターで解説していますが、簡易的に説明すると `resolve` 関数の挙動を定義しているのは ECMAScript 仕様上の [Promise Resolve Functions](https://tc39.es/ecma262/#sec-promise-resolve-functions) であり、 `reject` 関数の挙動は [Promise Reject Functions](https://tc39.es/ecma262/#sec-promise-reject-functions) という項目です。

![resolveとrejectの仕様比較](https://res.cloudinary.com/zenn/image/fetch/s--ylp4KrvF--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/ed9f364805905315bdecea44.jpg%3Fsha%3Def042a290398547c57cf8fb966c9483c6921b97e)

Promise Reject Functions の仕様が短いのに対して Promise Resolve Functions の仕様は長く複雑になっています。そして Promise Resolve Functions つまり `resolve` 関数はその引数の値の種類によって処理が場合分けされるようになっています。

また、 `Promise.fulfill()` という名前のメソッドが存在せずに `Promise.resolve()` という名前のメソッドになっているのは、このように解決という処理が履行 (Fulfill) 自体を含んだ複雑な処理としてなければならないからです。実際には Fulfill を行うメソッドは [FulfillPromise](https://tc39.es/ecma262/#sec-fulfillpromise) という名前でプログラマからはアクセスできない抽象操作として仕様の中に存在しており、この操作は内部的に `Promise.resolve()` から呼び出されるようになっています。

仕様が理解できるようになってくると分かることですが、このように解決 (Resolution) によって起きることは図にある通り履行 (Fulfillment) や引数に取った Promise オブジェクトの状態に応じて拒否 (Rejection) を起こすなど多数の場合があるので注意してください。

</details>

難しいですが、Fate の概念は他の文章を読むときには役立つことがあります。または、 `Promise.fulfill()` というメソッドではなく `Promise.resolve()` というメソッドが存在している理由の理解に役立ちます。あとは、 `resolve()` や `Promise.resolve()` の挙動・意味をしっかり理解しようとすると必要になってきます。

動詞や名詞などの意味合いの違いは次の Stack overflow の解答がわかりやすいです。上の図もこちらに記載されているものを参考に作成しました。

Stack overflow - What's the difference between "resolve" and "fulfill" a promise?
[https://stackoverflow.com/questions/27633211/whats-the-difference-between-resolve-and-fulfill-a-promise](https://stackoverflow.com/questions/27633211/whats-the-difference-between-resolve-and-fulfill-a-promise)
