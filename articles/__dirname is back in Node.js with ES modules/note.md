---
title: __dirname is back in Node.js with ES modules
source: https://www.sonarsource.com/blog/dirname-node-js-es-modules/
author:
  - Phil Nash
published: 2024-03-21
created: 
description: |
  ECMAScriptモジュール（またはESモジュール）は、再利用のためにJavaScriptコードをパッケージ化する新たな標準フォーマットです。Node.jsの世界ではCommonJSからESモジュールへの大規模かつ継続的な移行が進行中ですが、その過程でいくつかの摩擦が生じていました。
tags:
  - Node.js
  - ESM
  - CommonJS
  - __dirname
  - import.meta
---

# __dirname is back in Node.js with ES modules

ref: <https://www.sonarsource.com/blog/dirname-node-js-es-modules/>

ECMAScriptモジュール（またはESモジュール）は、再利用のためにJavaScriptコードをパッケージ化する新たな標準フォーマットです。Node.jsの世界ではCommonJSからESモジュールへの大規模かつ継続的な移行が進行中ですが、その過程でいくつかの摩擦が生じていました。

その摩擦の一つが最近解消されました：現在のモジュールのディレクトリにアクセスするのが再び容易になったのです！

## TL;DR TL;DR

ESモジュールでは、従来の__dirnameや__filenameの代わりに、以下を使用できます：

```js
import.meta.dirname  // 現在のモジュールのディレクトリ名 (__dirname)
import.meta.filename // 現在のモジュールのファイル名 (__filename)
```

興味があるなら、この話の詳細がありますので、ぜひ読み進めてください。

## 現在のディレクトリを取得する Getting the current directory

現在のモジュールのディレクトリパスにアクセスできることで、コードが配置されている場所から相対的にファイルシステムをたどり、プロジェクト内のファイルを読み書きしたり、動的にコードをインポートしたりすることが可能になります。この情報にアクセスする方法は、CommonJSの実装からESモジュールの最新アップデートに至るまで、年々変化してきました。では、その進化の過程を見ていきましょう。

## 従来のCommonJSの方法 The old CommonJS way

Node.jsは最初、CommonJSモジュールシステムを使用していました。CommonJSは、現在のモジュールのディレクトリ名とファイル名を返す二つの変数、__dirname と__filename を提供していました。

```js
__dirname  // 現在のモジュールのディレクトリ名
__filename // 現在のモジュールのファイル名
```

## 旧来のESモジュールの方法 The old ES module way

ESモジュールでは __dirname と__filename は使用できません。その代わりに、それらを再現するために以下のコードが必要でした：

```js
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const__filename = url.fileURLToPath(import.meta.url);
```

私はこの定型コードを覚えておくことができず、いつもSam Thorogoodによる __dirname を復活させる方法の説明を参照していました。もっと簡単な方法があるはずだと考えていました。

## 新しいESモジュールの方法 The new ES module way

ついに、多くの議論を経て、より良い方法が登場しました。Node.js バージョン20.11.0、Deno バージョン1.40.0、そしてBun バージョン1.0.23以降、import.meta オブジェクトのdirname と filename プロパティを利用することができるようになりました。

```js
import.meta.dirname  // 現在のモジュールのディレクトリ名 (__dirname)
import.meta.filename // 現在のモジュールのファイル名 (__filename)
```

## どのようにしてこの状況に至ったのか？ How did we get here?

記事の冒頭でも述べたように、ESモジュールはJavaScriptの標準規格です。しかし、JavaScriptはもともとウェブブラウザ上で動作する言語として誕生しました。Node.jsはサーバー上でJavaScriptを実行することを普及させましたが、その過程で多くの規約を使用または独自に発明する必要がありました。Node.jsプロジェクトが初期に選択した一つの決断は、CommonJSモジュールシステムとそれに伴う全ての仕組みを採用することでした。

ESモジュールは、ブラウザとサーバーの両方の環境を念頭に置いて設計されています。通常、ブラウザはファイルシステムへのアクセスがないため、現在のディレクトリやファイル名へのアクセスは意味を成しません。しかし、ブラウザはURLを扱い、file:// スキームを使ってファイルパスをURL形式で提供することができます。したがって、ESモジュールはモジュールのURLへの参照を持っています。これは既に上記のimport.meta.urlでご覧いただいた通りです。では、Node.jsでURLを使って何ができるか見ていきましょう。

## あらゆる場所でのURL URLs everywhere

以下のコードを含む module.js というESモジュールを考えてみましょう：

```js
console.log(import.meta.url);
```

このファイルをNode.jsを使ってサーバー上で実行すると、次のような結果が得られます：

```sh
$ node module.js
file:///path/to/module.js
```

もしウェブブラウザで_module.js_を読み込むと、以下のように表示されます：

<https://example.com/module.js>

どちらの結果もURLですが、文脈に応じて異なるスキームが使われています。

さらに混乱を招くのは、import.meta.urlは実際のURLオブジェクトではなく、URLを記述した文字列である点です。この文字列をURLコンストラクタに渡すことで、実際のURLオブジェクトに変換することができます：

```js
const fileUrl = new URL(import.meta.url);
console.log(fileUrl.protocol);

// Node.jsの場合: "file:"
// ブラウザの場合: "https:"
```

ここから、Node.jsでの__dirnameと__filenameの元々の代替手段が生まれました。URLオブジェクトを使用することで、Node.jsのURLモジュールを使い、モジュールのURLをファイルパスに変換して__filenameを再現することができます。

```js
import * as url from "url";

const fileUrl = new URL(import.meta.url);
const filePath = url.fileURLToPath(fileUrl);
console.log(filePath);

// 出力例: /path/to/module.js
```

また、URLを操作してディレクトリ名を取得し、__dirnameを再現することも可能です。

```js
import * as url from "url";

const directoryUrl = new URL(".", import.meta.url);
const directoryPath = url.fileURLToPath(directoryUrl);
console.log(directoryPath);

// 出力例: /path/to
```

文字列の代わりにURLを使うことができます

Node.jsで一般的なファイル操作を行うにはパス文字列を使用する必要があると思われがちですが、実際には文字列パスで動作する多くのNode.js APIがURLオブジェクトでも動作します。

__dirnameの最も一般的な使い方は、ディレクトリ内をたどって読み込みたいデータファイルを探すことです。たとえば、_module.js_ファイルが_data.json_というファイルと同じディレクトリにあり、そのデータをスクリプトに読み込みたい場合、以前は以下のように__dirnameを使用していました：

```js
const { join } = require("node:path");
const { readFile } = require("node:fs/promises");

function readData() {
  const filePath = join(__dirname, "data.json");
  return readFile(filePath, { encoding: "utf8" });
}
```

これをESモジュールでは、import.meta.dirnameを使って再現できます：

```js
import { join } from "node:path";
import { readFile } from "node:fs/promises";

function readData() {
  const filePath = join(import.meta.dirname, "data.json");
  return readFile(filePath, { encoding: "utf8" });
}
```

しかし、代わりに以下のようにURLオブジェクトを使うこともできます：

```js
import { readFile } from "node:fs/promises";
    
function readData() {
  const fileUrl = new URL("data.json", import.meta.url);
  return readFile(fileUrl, { encoding: "utf8" });
}
```

ESモジュールはクライアントとサーバーの両方で書かれるJavaScriptに一貫性をもたらすため、パス文字列の代わりにURLオブジェクトを使用することも同様に有効です。パスの代わりにURLを使用する他のユースケースについて読みたい場合は、__dirnameの代替手段に関する記事をご覧ください。

import.meta.dirname はどこで使えますか？ Where can you find import.meta.dirname?

import.meta.dirname と import.meta.filename は、最新のNode.js、Deno、Bunで使用可能です。

Bunでは既に import.meta.dir と import.meta.path が実装されており、これらは同等のものです。現在、dirname と filename は dir と path のエイリアスとなっています。

これらのプロパティは基盤となるファイルシステムにのみ依存するため、import.meta.url のスキームが "file:" の場合にのみ利用可能です。つまり、ブラウザ環境では利用できず、ブラウザで import.meta.dirname を使用しようとすると単に undefined が返されます。

シンプルさと相互運用性の融合 A blend of simplicity and interoperability

Node.jsコミュニティ、Deno、そしてBunがこれらのプロパティを実装することに決めたのは素晴らしいことです。コードベースが移行し、ESモジュールを使用して新しいプロジェクトが始まるにつれて、変化の摩擦を減らすことはエコシステム全体にとって有益です。

また、すべてのJavaScript環境でimport.meta.urlを使用して何が達成できるか、そしてURLオブジェクトを使用することでフロントエンドとバックエンドのコードをより一貫性のあるものにできるかどうかを考慮することも重要です。

少なくとも、これでimport.meta.dirnameを利用することで、定型コードをいくらか省略できるようになりました。
