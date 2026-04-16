---
title: "sverweij/dependency-cruiser: Validate and visualize dependencies. Your rules. JavaScript, TypeScript, CoffeeScript. ES6, CommonJS, AMD."
source: "https://github.com/sverweij/dependency-cruiser"
author:
  - "[[Sander Verweij]]"
published: 2016-11-20
created: 2026-04-16
description: "JavaScript/TypeScript/CoffeeScriptプロジェクトの依存関係をカスタムルールで検証・可視化する静的解析ツール。循環依存の検出、依存グラフの生成、アーキテクチャ制約の適用をサポートし、ES6・CommonJS・AMDモジュールシステムに対応。npm週間130万ダウンロード。"
tags:
  - "clippings"
  - "static-analysis"
  - "JavaScript"
  - "TypeScript"
  - "dependencies"
  - "visualization"
  - "architecture"
  - "linting"
---

## 概要

dependency-cruiserは、JavaScript、TypeScript、CoffeeScript、LiveScriptプロジェクトの依存関係を**検証（validate）**し**可視化（visualize）**するための静的解析ツールである。開発者が独自のルールを定義して依存関係の制約を適用でき、違反をテキストまたはグラフィカルなレポートとして出力する。npmで週間130万ダウンロードを超える広く使われているツールで、MITライセンスで公開されている。

ES6（import/export）、CommonJS（require）、AMDの各モジュールシステムに対応し、`.jsx`、`.tsx`、`.vue`、`.svelte`ファイルもサポートする。

## 主要なトピック

### インストールと初期設定

パッケージマネージャーでインストールし、`--init`コマンドで設定ファイルを自動生成する：

```shell
npm install --save-dev dependency-cruiser
npx depcruise --init
```

`--init`はプロジェクト環境を自動検出し、対話的に質問した上で`.dependency-cruiser.js`設定ファイルを生成する。初期設定には**循環依存**、**package.jsonに未登録の依存**、**孤立モジュール（orphans）**、**本番コードからdev/optionalDependenciesへの依存**の検出ルールが含まれる。

### 依存グラフの可視化

dependency-cruiserは複数の出力フォーマットで依存グラフを生成できる：

| フォーマット | 説明 |
|---|---|
| **dot** | GraphViz形式のモジュールレベル依存グラフ |
| **ddot** | フォルダレベルに集約した依存グラフ |
| **archi / cdot** | 高レベルのアーキテクチャ概要グラフ（カスタムパターンで集約可能） |
| **flat / fdot** | フォルダグルーピングなしのフラットな依存グラフ |
| **mermaid** | Mermaid記法での出力 |
| **err / err-long** | ビルドスクリプト向けテキスト出力（ESLint風） |
| **json** | 機械処理向けJSON出力 |
| **csv** | CSV形式の出力 |
| **html** | セルフコンテインドなHTMLレポート |

SVGグラフの生成例：

```shell
npx depcruise src --include-only "^src" --output-type dot | dot -T svg > dependency-graph.svg
```

テーマ設定で色やスタイルをカスタマイズでき、`depcruise-wrap-stream-in-html`でインタラクティブなHTMLグラフに変換することも可能。

### ルールシステム

dependency-cruiserの核となるのがカスタムルールによる依存関係の検証機能である。ルールは3つのカテゴリに分かれる：

#### forbidden（禁止ルール）

特定の依存パターンを禁止する。例えば、テストフォルダ外からテストコードへの依存を禁止するルール：

```json
{
  "forbidden": [
    {
      "name": "not-to-test",
      "comment": "don't allow dependencies from outside the test folder to test",
      "severity": "error",
      "from": { "pathNot": "^test" },
      "to": { "path": "^test" }
    }
  ]
}
```

#### required（必須ルール）

特定のモジュールが必ず別のモジュールに依存していることを強制する。例えば、すべてのコントローラーがベースコントローラーを継承することを要求するルール：

```javascript
required: [
  {
    name: "must-inherit-from-base-controller",
    severity: "error",
    module: {
      path: "-controller\\.ts$",
      pathNot: "base-controller\\.ts$",
    },
    to: {
      path: "base-controller\\.ts$",
    },
  },
]
```

#### allowed（許可ルール）

明示的に許可された依存パターンのみを認めるホワイトリスト方式のルール。

#### ルールの主要な機能

- **`from`/`to`パターン**: 正規表現で依存元・依存先を指定
- **`dependencyTypes`**: `core`、`npm`、`local`などの依存タイプでフィルタリング
- **`severity`**: `error`（ビルド失敗）、`warn`（警告）、`info`（情報）の3段階
- **グループマッチング**: `$1`、`$2`変数でフォルダ構造に基づく動的ルール定義
- **`numberOfDependentsLessThan`/`MoreThan`**: 依存元の数に基づく制約

### 実用的なルールレシピ

#### ピアフォルダの分離

feature間の依存を禁止し、モジュラーなアーキテクチャを維持：

```javascript
{
  name: "features-not-to-features",
  from: { path: "(^features/)([^/]+)/" },
  to: { path: "^$1", pathNot: "$1$2" },
}
```

#### 共有モジュールの使用状況チェック

`common/`フォルダ内のモジュールが実際に複数箇所から使われているか検証：

```javascript
{
  name: "no-unshared-utl",
  from: { path: "^features/" },
  module: { path: "^common/", numberOfDependentsLessThan: 2 },
}
```

#### 非推奨モジュールへの新規依存の防止

既存の依存は許容しつつ、新規依存を禁止する2つの方法：
1. 既知の例外リストを管理する方式
2. `numberOfDependentsMoreThan`で依存元の上限を設定する方式

### CLI主要オプション

| オプション | 説明 |
|---|---|
| `--output-type` | 出力フォーマットの指定（dot, err, json, mermaid等） |
| `--config` / `--validate` | 設定ファイルの指定 |
| `--include-only` | 指定パターンに一致するモジュールのみを対象にする |
| `--focus` | 特定モジュールとその近隣を表示 |
| `--focus-depth` | focusの表示階層数を制御 |
| `--reaches` | 推移的な依存先を表示 |
| `--affected` | git revisionからの変更に影響されるモジュールを表示 |
| `--highlight` | 特定モジュールをハイライト |
| `--collapse` | フォルダ深度またはパターンで集約 |
| `--exclude` | 特定の依存を除外 |
| `--metrics` | 安定性メトリクスを計算 |
| `--cache` | キャッシュによる高速化 |
| `--ignore-known` | 既知の違反を無視（ベースライン機能） |

### ベースライン機能

`depcruise-baseline`コマンドで現時点の既知の違反をベースラインとして記録し、`--ignore-known`オプションで既知の違反を無視できる。新規の違反のみを検出したい場合に有効。

### 安定性メトリクス

`--metrics`オプションにより、各モジュールの**不安定性（instability）**メトリクスを計算し、**安定依存原則（Stable Dependency Principle）**が守られているか検証できる。計算結果はdot/flat出力でモジュールに表示される。

### 付属ツール

| ツール | 説明 |
|---|---|
| `depcruise` | メインのCLIツール |
| `depcruise-fmt` | 依存データの再フォーマット |
| `depcruise-baseline` | ベースライン依存の記録 |
| `depcruise-wrap-stream-in-html` | SVGをインタラクティブHTMLに変換 |

### 実プロジェクトでの使用例

READMEには以下の著名プロジェクトでの依存グラフが掲載されている：

- **Commander.js** - CLIパーサー
- **Chalk** - ターミナル文字列装飾（マイクロモジュール構成）
- **Yarn 2 (berry)** - パッケージマネージャー（高レベル集約グラフ）
- **React** - UIライブラリ（高レベル集約グラフ）
- **tslint** - TypeScriptリンター（循環依存の検出例）
- **CoffeeScript** - CoffeeScriptトランスパイラ
- **dependency-cruiser自身** - 3段階の抽象度（archi/ddot/dot）での自己分析

## 重要な事実・データ

- **npm週間ダウンロード数**: 約130万
- **GitHubスター数**: 約6,559
- **最新バージョン**: 17.3.10（2026年3月26日公開）
- **初回公開**: 2016年11月20日
- **総バージョン数**: 574
- **ライセンス**: MIT
- **パッケージサイズ**: 936.2KB（展開時）
- **依存パッケージ数**: 18（本番） 
- **対応言語**: JavaScript、TypeScript、CoffeeScript、LiveScript
- **対応ファイル**: `.js`、`.mjs`、`.cjs`、`.jsx`、`.ts`、`.tsx`、`.d.ts`、`.vue`、`.svelte`、`.coffee`、`.csx`、`.cjsx`
- **対応モジュールシステム**: ES6 (import/export)、CommonJS (require)、AMD
- **主要な依存**: acorn（JavaScriptパーサー）、enhanced-resolve（モジュール解決）、commander（CLI）
- **Webpackエイリアス/モジュール解決**: サポートあり
- **TypeScript tsconfig paths**: サポートあり

## 結論・示唆

### ツールの価値

dependency-cruiserは単なる依存グラフ生成ツールではなく、**アーキテクチャの制約をコードとして定義・検証する**ツールである。CIパイプラインに組み込むことで、アーキテクチャの劣化を自動的に検出できる。

### 実践的な示唆

- CI/CDパイプラインに`depcruise`を組み込み、ルール違反をビルドエラーとして扱うことで、アーキテクチャの一貫性を強制できる
- `--init`で生成されるデフォルトルール（循環依存、orphans等）だけでも大きな価値がある
- 大規模プロジェクトでは`archi`/`ddot`レポーターで高レベルの依存概要を把握し、問題箇所を特定してから`dot`で詳細を確認する段階的アプローチが効果的
- `--affected`オプションをPR時のCI検証に使い、変更の影響範囲を可視化できる
- ベースライン機能により、既存の技術的負債を無視しつつ新規の違反のみを検出する段階的な改善が可能

## 制限事項・注意点

- グラフ描画（dot, ddot, archi等）にはGraphVizの別途インストールが必要
- v12以前では`--config`オプションの明示的な指定が必要（v13以降は自動検出）
- `pnpx`は`npx`とセマンティクスが大きく異なるため注意が必要
- iframeやWebWorker内の動的インポートなど、実行時にのみ決定される依存は静的解析では検出できない

---

*Source: [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser)*
