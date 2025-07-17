---
title: "モノレポ環境でBiome v2にアップデートして動作を検証してみる"
source: "https://tech.furyu.jp/entry/2025/06/20/100053"
author:
  - "[[furyu-kitajima]]"
published: 2025-06-20
created: 2025-07-17
description: |
  本記事では、先日リリースされたBiome v2への移行手順と、設定ファイル(biome.jsonまたはbiome.jsonc)のモノレポでの振る舞いを試してみた結果を共有します。
tags:
  - "Biome"
  - "JavaScript"
  - "TypeScript"
  - "clippings"
---

本記事では、先日リリースされたBiome v2への移行手順と、設定ファイル(`biome.json` または `biome.jsonc`)のモノレポでの振る舞いを試してみた結果を共有します。

## はじめに

フリューのソフトウェアエンジニアkitajima氏による記事。

2025年6月17日にBiome v2(codename: Biotype)がリリースされました。v2ではtscを必要としないlinterが注目されていますが、モノレポのサポート改善も重要なトピックです。本記事では、実際にBiome v1を利用していたモノレポ環境をv2へアップデートし、その運用を試した結果をまとめています。

- **参考リンク**: [Biome v2—codename: Biotype](https://biomejs.dev/ja/blog/biome-v2/)

## 従来のBiome v1でのモノレポ運用

Biome v1ではモノレポのサポートが十分ではなく、公式ドキュメントにもその旨が記載されていました。
従来の運用方法は以下の通りです。

1. プロジェクトルートに `biome.json` を配置する。
2. 各サブモジュールにも `biome.json` を配置し、ルートの設定を `extends` で参照しつつ、`overrides` で固有設定を記述する。

- **参考リンク**: [Use Biome in big projects (v1)](https://v1.biomejs.dev/guides/big-projects/)

この方法でも運用は可能でしたが、v2ではサポートが大幅に改善されました。

## Biome v2で改善されたモノレポサポート

Biome v2では、以下の機能が追加され、モノレポでの運用がよりスムーズになりました。

- **参考リンク**: [Monorepo support in Biome v2](https://biomejs.dev/ja/blog/biome-v2/#monorepo-support)

### ネストした設定ファイルの配置

サブディレクトリに任意の数の設定ファイルをネストして配置できるようになりました。

### ネストした設定ファイルでルートの設定を参照する

ネストした設定ファイルであることを示す方法は2つあります。

#### 1. `root` プロパティ

`"root": false` を設定ファイルに記述することで、そのファイルがネストされたものであることを示せます。ただし、この設定だけではルートの設定は継承されません。

```json
{
  "root": false
}
```

#### 2. `extends` プロパティ

`"extends": "//"` と記述することで、ルートの設定を継承できます。この場合、`"root": false` は冗長なため省略可能です。

```json
{
  "extends": "//"
}
```

> **Note**: ネストした `biome.json` では、`root: false` または `extends` のどちらかの指定が必須です。

## 実際にBiome v2に移行してみた

公式のマイグレーションガイドに沿って移行作業を行いました。

- **参考リンク**: [Upgrade to Biome v2](https://biomejs.dev/guides/upgrade-to-biome-v2/)

### 1. Biome v2のインストール

まず、Biome v2をインストールします。

```bash
npm install --save-dev --save-exact @biomejs/biome@2.0.0
```

### 2. マイグレーションコマンドの実行

`migrate` コマンドを実行すると、設定ファイルがv2の仕様に合わせて自動的に修正されます。

```bash
npx @biomejs/biome migrate --write
```

### 3. 設定ファイルの変更確認

コマンド実行により、`biome.json` がv1.9.4からv2.0.0のスキーマに更新されました。

- **変更前 (v1.9.4)**

  ```json
  {
    "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
    "organizeImports": {
      "enabled": true
    },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true
      }
    },
    // ...その他の設定
  }
  ```

- **変更後 (v2.0.0)**

  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
    "assist": { 
      "actions": { 
        "source": { 
          "organizeImports": "on" 
        } 
      } 
    },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true,
        "style": {
          "noParameterAssign": "error"
          // ...その他のルール
        }
      }
    },
    // ...その他の設定
  }
  ```

### 差分を確認してみる

#### `organizeImports` の設定変更

v1ではトップレベルにあった `organizeImports` が、v2では `assist.actions.source.organizeImports` に移動しました。`assist` はv2から導入された新機能で、エディタ連携による開発体験向上を目的としています。

- **参考リンク**: [Assist | Biome](https://biomejs.dev/assist/)

#### `recommended` ルールの変更

`recommended` に含まれるルールが変更されたため、v1の `recommended` には含まれていたがv2では含まれなくなったルール（例: `noParameterAssign`）が、マイグレーション時に明示的に追加されました。今回は新規プロジェクトに近い状態だったため、これらの追加ルールは手動で削除し、v2のデフォルトに従うことにしました。

## モノレポでの設定ファイルの振る舞いを検証

実際にモノレポ環境で設定を配置し、`biome check` の動作を検証しました。

### プロジェクト構成

```plaintext
.
├── package.json
├── biome.json
├── packages
│   ├── module-a
│   │   ├── package.json
│   │   └── biome.json
│   └── module-b
│       ├── package.json
│       └── biome.json
```

### 各設定ファイルの内容

- **プロジェクトルート (`biome.json`)**: インデントを4スペースに指定。

  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
    "formatter": {
      "enabled": true,
      "indentStyle": "space",
      "indentWidth": 4
    }
  }
  ```

- **`module-a/biome.json`**: ルート設定を継承。

  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
    "root": false,
    "extends": "//"
  }
  ```

- **`module-b/biome.json`**: 独自設定（`quoteStyle`）を使用し、ルート設定は継承しない。

  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
    "root": false,
    "javascript": {
      "formatter": {
        "quoteStyle": "single"
      }
    }
  }
  ```

### 検証結果

プロジェクトルートで `npx @biomejs/biome check --write .` を実行した結果、以下のようになりました。

- **ルートのファイル**:
  - インデント幅: 4スペース
  - クォート: ダブルクォート (デフォルト)
- **`module-a` のファイル**:
  - インデント幅: 4スペース (ルート設定を継承)
  - クォート: ダブルクォート (ルート設定を継承)
- **`module-b` のファイル**:
  - インデント幅: タブ (デフォルト。ルート設定を継承しないため)
  - クォート: シングルクォート (独自設定)

この結果から、各設定ファイルが意図通りに解釈され、lintとformatが適用されていることが確認できました。

## さいごに

Biome v2へのアップデートにより、特にモノレポ環境での設定管理が大幅に簡素化され、今後の運用が楽になることが期待されます。筆者はツールのデフォルト設定に従い、カスタムは最小限に留める方針ですが、デフォルトのタブインデントだけはスペースに変更したい、とのことです。
