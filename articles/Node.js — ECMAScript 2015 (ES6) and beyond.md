---
title: "Node.js — ECMAScript 2015 (ES6) 以降"
source: "https://nodejs.org/en/learn/getting-started/ecmascript-2015-es6-and-beyond"
author:
  - "CW"
published:
created: 2025-06-26
description: |
  Node.jsは最新のV8エンジンを搭載しており、JavaScriptの新機能をタイムリーに開発者に提供します。ECMAScriptの機能は、shipping、staged、in progressの3つのグループに分類されます。
tags:
  - "Node.js"
  - "ECMAScript"
  - "ES6"
  - "V8"
  - "JavaScript"
---
## ECMAScript 2015 (ES6) 以降

Node.js は、最新バージョンの [V8](https://v8.dev/) を基に構築されています。このエンジンの最新リリースに追従することで、[JavaScript ECMA-262 仕様](http://www.ecma-international.org/publications/standards/Ecma-262.htm) の新機能がタイムリーに Node.js 開発者に提供されるだけでなく、継続的なパフォーマンスと安定性の向上が保証されます。

All ECMAScript 2015 (ES6) features are split into three groups for **shipping**, **staged**, and **in progress** features:

- **shipping** の機能はすべて、V8 が安定していると見なしており、**Node.js でデフォルトで有効**になっており、いかなる種類のランタイムフラグも必要ありません。
- **staged** の機能は、ほぼ完成しているものの、V8 チームによって安定しているとは見なされていない機能であり、`--harmony` というランタイムフラグが必要です。
- **in progress** の機能は、それぞれの harmony フラグによって個別に有効にできますが、テスト目的以外では強く非推奨です。注意: これらのフラグは V8 によって公開されており、非推奨の通知なしに変更される可能性があります。

### どの機能がどの Node.js バージョンでデフォルトで提供されますか？

ウェブサイト [node.green](https://node.green/) は、kangax の互換性テーブルに基づいた、さまざまなバージョンの Node.js でサポートされている ECMAScript 機能の優れた概要を提供しています。

### どの機能が進行中ですか？

新しい機能は常に V8 エンジンに追加されています。一般的に言って、将来の Node.js リリースで利用可能になることが期待されますが、時期は不明です。

各 Node.js リリースで利用可能なすべての *in progress* 機能を一覧表示するには、`--v8-options` 引数を grep します。これらは V8 の不完全で壊れている可能性のある機能であるため、自己責任で使用してください。

```bash
node --v8-options | grep "in progress"
```

### --harmony フラグを活用するようにインフラを設定していますが、削除すべきですか？

現在の Node.js での `--harmony` フラグの動作は、**staged** の機能のみを有効にすることです。結局のところ、これは `--es_staging` の同義語です。前述のように、これらは完成しているものの、まだ安定しているとは見なされていない機能です。特に本番環境で安全を期したい場合は、V8 でデフォルトで提供され、結果として Node.js でも提供されるまで、このランタイムフラグを削除することを検討してください。これを有効にしておくと、V8 が標準により厳密に従うようにセマンティクスを変更した場合、今後の Node.js のアップグレードでコードが壊れる準備をしておく必要があります。

### 特定の Node.js バージョンにどのバージョンの V8 が搭載されているかを確認するにはどうすればよいですか？

Node.js は、`process` グローバルオブジェクトを介して、特定のバイナリに同梱されているすべての依存関係とそれぞれのバージョンを一覧表示する簡単な方法を提供します。V8 エンジンの場合、ターミナルで次のように入力してバージョンを取得します。

```bash
node -p process.versions.v8
```

[Prev An introduction to the npm package manager](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) [Next Node.js, the difference between development and production](https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production)
