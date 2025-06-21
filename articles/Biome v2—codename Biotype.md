---
title: "Biome v2—codename: Biotype"
source: "https://biomejs.dev/blog/biome-v2/"
author:
  - "Emanuele Stoppa"
  - "Biome Core Team"
  - "Biome Maintainers"
published: 2025-06-17
created: 2025-06-21
description: |
  Biome v2 "Biotype" is the first JavaScript and TypeScript linter with type-aware rules that don't depend on the TypeScript compiler. This allows linting without installing TypeScript.
tags:
  - "Biome"
  - "TypeScript"
  - "linter"
  - "formatter"
  - "web-toolchain"
---

## 概要

Biome v2、コードネーム「Biotype」が公式にリリースされました。このバージョンは、TypeScriptコンパイラに依存せずに型認識リンティングルールを提供する、初のJavaScriptおよびTypeScriptリンターです。これにより、`typescript`パッケージをインストールすることなくプロジェクトのリンティングが可能になります。Vercelのスポンサーシップのもと、このマイルストーンは2年間という短期間で達成されました。

予備テストでは、新しい型推論に基づく`noFloatingPromises`ルールが、`typescript-eslint`が検出するケースの約75%を、はるかに低いパフォーマンスインパクトで検出できることが示されています。

![Biome Banner](https://biomejs.dev/_astro/banner-dark.Dl3moAyv_2qbteA.webp)

## インストールと移行

`@biomejs/biome`パッケージをインストールまたは更新し、`migrate`コマンドを実行することで、設定ファイルの破壊的変更が自動的に処理されます。

```sh
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome migrate --write
```

自動化できない変更については、[移行ガイド](https://biomejs.dev/guides/upgrade-to-biome-v2)に詳細が記載されています。

## 主な新機能

### 複数ファイル分析と型推論

- プロジェクト内の全ファイルをスキャンし、モジュール間でインポートされた型を解決する型推論エンジンを導入。
- パフォーマンスへの影響を考慮し、この機能は**オプトイン**です。
- プロジェクト全体のルール（`project`ドメイン）が有効な場合にのみフルスキャンが実行されます。

### モノレポサポート

- ネストされた設定ファイル（`biome.json`）をサポートし、モノレポでの利便性が大幅に向上しました。
- ネストされた設定は、`"root": false`または`"extends": "//"`（ルート設定を継承）とマークすることで定義できます。

### プラグイン

- Linterプラグインの初期バージョンが導入され、コードスニペットに一致するカスタム診断を報告できるようになりました。
- 例：`Object.assign()`の使用を検出するプラグイン

    ```
    `$fn($args)` where {
      $fn <: `Object.assign`,
      register_diagnostic(
        span = $fn,
        message = "Prefer object spread instead of `Object.assign()`"
      )
    }
    ```

### インポートオーガナイザーの刷新

- 空行で区切られたインポートグループをまたいでソートできるようになりました。
- 同一モジュールからのインポートが自動的にマージされます。
- カスタムのインポート順序を設定できます。
- `export`文の整理や、コメントによるチャンクの明示的な分離もサポートします。

### Assists

- リンターの診断なしでコード修正を提案する「Assist」機能を一般化しました。
- インポートオーガナイザーもAssistの一種となり、オブジェクトリテラルのキーをソートする`useSortedKeys`などの新しいAssistも追加されました。

### 抑制コメントの改善

- `// biome-ignore-all`: ファイル全体でルールを無効化します。
- `// biome-ignore-start`と`// biome-ignore-end`: 特定の範囲でルールを無効化します。

### HTMLフォーマッター（実験的）

- HTMLファイルのフォーマットに対応した、実験的なHTMLフォーマッターが追加されました。
- 現時点では`.html`ファイルのみが対象で、デフォルトでは無効になっています。

## 今後の展望

- HTMLサポートの安定化と、Vue、Svelte、Astroなどのフレームワークへの拡張。
- Markdownサポートの作業開始。
- 型推論インフラの継続的な改善と新しいルールの追加。

## コントリビューション

Biomeはボランティアによって主導されるオープンソースプロジェクトであり、翻訳、コミュニティでの議論、コード貢献、資金援助など、あらゆる形での貢献を歓迎しています。
