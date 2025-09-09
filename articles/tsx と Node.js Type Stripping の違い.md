---
title: "tsx と Node.js Type Stripping の違い"
source: "https://www.mizdra.net/entry/2025/08/28/122040"
author:
  - "mizdra"
published: 2025-08-28
created: 2025-09-09
description: |
  tsxはTypeScriptコードを事前トランスパイルすることなく、直接 Node.js で実行するためのツールです。近年の Node.js には Type Stripping という機能が組み込まれ、tsxなしでTypeScriptコードを実行できるようになりました。両者は一見似ていますが、import specifierの指定方法、JSXやTypeScript固有機能（Enum, namespaceなど）への対応、tsconfig.jsonのpathsサポートなど、多くの違いがあります。この記事では、それらの違いとユースケースごとの使い分けについて解説します。
tags:
  - "Node.js"
  - "TypeScript"
  - "tsx"
---

## 要約

`tsx`はTypeScriptコードを事前トランスパイルなしで直接Node.jsで実行するツールです。一方、近年のNode.jsには`Type Stripping`という同様の機能が組み込まれました。両者は似ていますが、いくつかの重要な違いがあります。

### 両者の主な違い

#### 1. `import specifier` の指定方法

最も大きな違いは、モジュールをインポートする際のパス指定（`import specifier`）です。

| 指定方法 | tsx | Node.js Type Stripping |
| :--- | :--- | :--- |
| `'./math'` | ✅ OK | ❌ NG |
| `'./math.ts'` | ✅ OK | ✅ OK |
| `'./math.js'` | ✅ OK | ❌ NG |

- **tsx**: `webpack`などのバンドラと同様に、拡張子の省略や`.js`での指定など、柔軟な指定が可能です。
- **Node.js Type Stripping**: 拡張子`.ts`の明記が必須です。これは、Node.jsのESM仕様に沿って実行時のオーバーヘッドを削減するためです。

#### 2. 対応機能

- **JSX**: `tsx`は対応していますが、`Type Stripping`は対応していません。
- **TypeScript固有機能**: `Enum`, `experimentalDecorators`, `namespace` など、JavaScriptにないTypeScript固有の機能は`Type Stripping`ではサポートされません。
  - ただし、`--experimental-transform-types`フラグを使えば一部機能（`enum`, `namespace`）をトランスパイルできますが、現代的な開発では非推奨です。
- **`tsconfig.json`の`paths`**: `tsx`は対応していますが、`Type Stripping`は対応していません。Node.js自体の`Subpath patterns`で代替は可能です。

### どちらを使うべきか？

用途によって推奨される方法が異なります。

#### バックエンドサーバー

- **Node.js Type Stripping** の使用が推奨されます。

#### npm パッケージ

- 原則として、**どちらも使うべきではありません**。
- npmにはトランスパイル済みのJavaScriptコードを公開するのが標準であり、Node.jsも`node_modules`内のTypeScriptファイルをデフォルトでは処理しないためです。
- 開発時のテスト実行などで`Type Stripping`を使いたい場合は、`import`文で`.ts`拡張子を明記し、ビルド時に`tsc`の`--rewriteRelativeImportExtensions`オプションで`.js`に書き換えるといった工夫が必要です。

#### スクリプトファイル

- **Node.js Type Stripping** が利用できます。
- ただし、Next.jsプロジェクトのようにバンドラで実行されるコードとモジュールを共有している場合、`import`文の拡張子や`paths`の扱いで問題が発生しがちです。その場合は、**`tsx`** を使った方が手間が少ないことがあります。

#### CLIツールの設定ファイル

- `eslint.config.ts`や`prettier.config.ts`などは、ツール自体が内部で`tsx`や`jiti`、あるいは`Type Stripping`を使って読み込むため、ツールごとの仕様に依存します。

### おまけ: エディタでの`import`文補完

VS Codeなどのエディタでは、設定で`import`文の補完時に拡張子を自動で付与するかどうかを制御できます。`Type Stripping`を使うプロジェクトでは、これらの設定を見直すと開発体験が向上します。

- `typescript.preferences.importModuleSpecifierEnding`
- `javascript.preferences.importModuleSpecifierEnding`
