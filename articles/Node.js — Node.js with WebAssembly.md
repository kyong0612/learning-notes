---
title: "Node.js — Node.js with WebAssembly"
source: "https://nodejs.org/en/learn/getting-started/nodejs-with-webassembly"
author:
  - "lancemccluskey"
  - "ovflowd"
published:
created: 2025-06-29
description: |
  WebAssemblyは、C/C++、Rust、AssemblyScriptなど、さまざまな言語からコンパイルできる高性能なアセンブリ風言語です。現在、Chrome、Firefox、Safari、Edge、そしてNode.jsでサポートされています。
tags:
  - "clippings"
  - "Node.js"
  - "WebAssembly"
  - "WASM"
  - "Performance"
---

# Node.js と WebAssembly

**[WebAssembly](https://webassembly.org)** は、C/C++、Rust、AssemblyScript など、さまざまな言語からコンパイルできる高性能なアセンブリ風の言語です。現在、Chrome、Firefox、Safari、Edge、そして Node.js でサポートされています。

WebAssembly の仕様では、`.wasm` 拡張子を持つバイナリ形式の WebAssembly モジュールと、`.wat` 拡張子を持つ対応するテキスト表現の WebAssembly テキスト形式という2つのファイル形式が詳述されています。

## キーコンセプト

- **モジュール (Module)**: コンパイルされた WebAssembly バイナリ、つまり `.wasm` ファイル。
- **メモリ (Memory)**: サイズ変更可能な `ArrayBuffer`。
- **テーブル (Table)**: メモリ内には格納されない、参照のサイズ変更可能な型付き配列。
- **インスタンス (Instance)**: モジュールをそのメモリ、テーブル、変数とともにインスタンス化したもの。

WebAssembly を使用するには、`.wasm` バイナリファイルと、WebAssembly と通信するための一連の API が必要です。Node.js は、グローバルな `WebAssembly` オブジェクトを介して必要な API を提供します。

```javascript
console.log(WebAssembly);
/*
Object [WebAssembly] {
  compile: [Function: compile],
  validate: [Function: validate],
  instantiate: [Function: instantiate]
}
*/
```

## WebAssembly モジュールの生成

WebAssembly バイナリファイルを生成するには、複数の方法があります。

- WebAssembly (`.wat`) を手で書き、[wabt](https://github.com/webassembly/wabt) のようなツールを使ってバイナリ形式に変換する。
- C/C++ アプリケーションで [emscripten](https://emscripten.org/) を使用する。
- Rust アプリケーションで [wasm-pack](https://rustwasm.github.io/wasm-pack/book/) を使用する。
- TypeScript のような経験を好む場合は [AssemblyScript](https://www.assemblyscript.org/) を使用する。

> これらのツールの中には、バイナリファイルだけでなく、ブラウザで実行するための JavaScript「グルー」コードと対応する HTML ファイルを生成するものもあります。

## 使い方

WebAssembly モジュールを入手したら、Node.js の `WebAssembly` オブジェクトを使ってインスタンス化できます。

```javascript
// add.wasm ファイルが存在し、2つの引数を加算する単一の関数が含まれていると仮定
const fs = require('node:fs');

// readFileSync 関数を使用して "add.wasm" ファイルの内容を読み込む
const wasmBuffer = fs.readFileSync('/path/to/add.wasm');

// WebAssembly.instantiate メソッドを使用して WebAssembly モジュールをインスタンス化する
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // エクスポートされた関数は instance.exports オブジェクトの下にある
  const { add } = wasmModule.instance.exports;
  const sum = add(5, 6);
  console.log(sum); // 出力: 11
});
```

## OS との対話

WebAssembly モジュールは、単独で OS の機能に直接アクセスすることはできません。サードパーティのツール [Wasmtime](https://docs.wasmtime.dev/) を使用して、この機能にアクセスできます。`Wasmtime` は [WASI](https://wasi.dev/) API を利用して OS 機能にアクセスします。

## リソース

- **一般的な WebAssembly 情報**: [webassembly.org](https://webassembly.org/)
- **MDN ドキュメント**: [developer.mozilla.org/en-US/docs/WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- **WebAssembly を手で書く**: [webassembly.github.io/spec/core/text/index.html](https://webassembly.github.io/spec/core/text/index.html)
