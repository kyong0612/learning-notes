---
title: "TypeScript 7で消えるtsconfigのレガシー設定。target: es5やbaseUrlにサヨウナラ"
source: "https://zenn.dev/ubie_dev/articles/typescript7-goodbye-legacy"
author:
  - "鹿野 壮"
published: 2025-12-04
created: 2025-12-08
description: |
  TypeScript 7では`target: es5`や`baseUrl`といった長年のレガシーな設定が削除され、`strict: true`が標準になるなどデフォルトの挙動が変更されます。本記事では、消えるレガシーな設定や挙動が変わる主要な設定について、設定の基本知識から代替案までを解説します。
tags:
  - TypeScript
  - JavaScript
  - tsgo
  - tsconfig
  - migration
---

## 概要

TypeScript 7はコンパイラがGO言語によるネイティブコンパイラー「tsgo」に置き換わり、コンパイル速度が10倍向上する大規模アップデートです。同時に、長年残っていたレガシーな設定が削除され、デフォルトの挙動も変更されます。

---

## TypeScript 7で削除・変更される設定

### 1. `--strict`がデフォルトで有効に

- **変更内容**: `"strict": true`と書かなくても厳格なチェックが有効になる
- **従来**: 明示的に`"strict": true`と書く必要があった
- **対応**: `"strict": false`を設定すれば無効にできる（ただし現代において設定することはほぼない）

> 参照: <https://github.com/microsoft/TypeScript/issues/62333>

---

### 2. `--target`が最新のECMAScriptになる

- **変更内容**: デフォルトで最新の安定版ECMAScript（例: ES2025）向けに出力
- **メリット**:
  - モダンブラウザやNode.js最新版が対象なら余計なダウンレベル変換が入らない
  - 出力が軽くなり可読性も向上

> 参照: <https://github.com/microsoft/TypeScript/issues/62198>

---

### 3. `--target: es5`の削除

- **変更内容**: IE11などの古いブラウザ向けのES5出力サポートが削除
- **理由**:
  - `async/await`などの複雑な変換処理が不要になり、TypeScript本体がスリム化
  - コンパイル速度の向上、メンテナンス性の改善
- **代替案**: レガシー環境向けにはBabelやSWCなどの外部ツールでトランスパイル

> 参照: <https://github.com/microsoft/TypeScript/issues/62196>

---

### 4. `--baseUrl`の削除

- **変更内容**: `import`文の基準ディレクトリを指定する`baseUrl`が削除
- **背景**: AMD (RequireJS) 時代の遺産であり、現代の標準的なモジュール解決とは異なる挙動だった
- **代替案**:
  - **`paths`オプション**: 引き続き利用可能。明示的なパスマッピングを設定
  - **Node.js Subpath imports**: `#`から始まるエイリアス機能

```json
// Before
{
  "baseUrl": "./src",
  "paths": {
    "~/*": ["*"]
  }
}

// After
{
  "paths": {
    "~/*": ["./src/*"],
    "*": ["./src/*"]
  }
}
```

> 参照: <https://github.com/microsoft/TypeScript/issues/62207>

---

### 5. `--moduleResolution: node10`の削除

- **変更内容**: CommonJS時代の古いNode.js挙動を模倣する`node10`（`node`）が削除
- **問題点**:
  - package.jsonの`exports`フィールドに対応していない
  - ライブラリ内部のプライベートなファイルを勝手に`import`できてしまう
  - 実行時エラーや予期せぬ破損の原因
- **代替案**:
  - `bundler`: Vite、Next.js、webpack用
  - `nodenext`: Node.js用

> 参照: <https://github.com/microsoft/TypeScript/issues/62200>

⚠️ **注意**: 現場のプロジェクトで`moduleResolution: node`が多く残っている印象とのこと

---

### 6. `rootDir`の挙動変更

- **変更内容**:
  - 従来: ソースファイルの配置を見て「一番共通する親ディレクトリ」を推論
  - TypeScript 7: 推論が廃止され、デフォルト値は常に「tsconfig.jsonのあるディレクトリ（`.`）」に固定
- **理由**: 全ファイルを走査してルートを自動計算する処理の廃止による高速化・単純化

#### 影響の例

```
# 従来（自動計算）
ソース: src/index.ts
出力:   dist/index.js（srcがルートだと推論された）

# TS 7以降（デフォルト .）
ソース: src/index.ts
出力:   dist/src/index.js（srcディレクトリがそのまま出力に含まれる）
```

- **対応**: 従来の挙動を維持したい場合は`"rootDir": "./src"`を明示的に指定

> 参照: <https://github.com/microsoft/TypeScript/issues/62194>

---

### 7. その他の変更点

- `"use strict"`のデフォルト化
- `types`がデフォルトで`[]`になる
- 古いimport構文（`asserts { type: "json" }`）のサポート終了

> 全変更点: <https://github.com/microsoft/TypeScript/issues?q=milestone%3A%22TypeScript%206.0.0%22%20label%3A%22Breaking%20Change%22>

---

## 移行を助けるツール「ts5to6」

TypeScriptチームが開発した移行自動化ツール。主に`baseUrl`と`rootDir`の修正に対応。

```bash
# baseUrlの設定を自動修正
npx @andrewbranch/ts5to6 --fixBaseUrl tsconfig.json

# rootDirの設定を自動修正
npx @andrewbranch/ts5to6 --fixRootDir tsconfig.json
```

> npm: <https://www.npmjs.com/package/@andrewbranch/ts5to6>

---

## リリーススケジュール

| バージョン | 説明 |
|-----------|------|
| TypeScript 6.0 | TypeScript製コンパイラーの**最後のバージョン** |
| TypeScript 7.0 | ネイティブコンパイラー（tsgo）製 |

---

## 移行の推奨ステップ

1. `ts5to6`ツールを使用して自動修正
2. TypeScript 6に更新し、警告をすべて解消
3. TypeScript 7リリース後に移行

---

## 参考リンク

- [Progress on TypeScript 7 (December 2025)](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/)
- [TypeScript 7 / tsgoの概要](https://zenn.dev/ubie_dev/articles/typescript7-tsgo-whatsnew)
- [Ubie Tech Advent Calendar 2025](https://adventar.org/calendars/12070)
