---
title: "package.json | pnpm"
source: "https://pnpm.io/package_json"
author:
  - "pnpm contributors"
published:
created: 2025-12-12
description: "pnpmにおけるpackage.jsonの拡張機能と設定オプションを解説する公式ドキュメント。engines、dependenciesMeta、peerDependenciesMeta、publishConfigなど、pnpm固有の設定フィールドについて詳述している。"
tags:
  - "pnpm"
  - "package.json"
  - "node.js"
  - "package-manager"
  - "monorepo"
  - "workspace"
---

## 概要

`package.json`はパッケージのマニフェストファイルであり、依存関係、タイトル、著者などすべてのパッケージメタデータを含む。pnpmは従来の`package.json`形式に加え、`package.json5`（json5経由）と`package.yaml`（js-yaml経由）もサポートしている。

---

## engines

Node.jsとpnpmのバージョンを指定できる。

```json
{
  "engines": {
    "node": ">=10",
    "pnpm": ">=3"
  }
}
```

**動作:**

- ローカル開発時、pnpmのバージョンが指定と一致しない場合は**エラー**で失敗する
- パッケージが依存関係としてインストールされる場合は、`engineStrict`設定フラグが有効でない限り**警告のみ**

---

## engines.runtime

> **v10.21.0で追加**

依存関係が必要とするNode.jsランタイムを指定。宣言すると、pnpmが自動的に指定されたNode.jsバージョンをインストールする。

```json
{
  "engines": {
    "runtime": {
      "name": "node",
      "version": "^24.11.0",
      "onFail": "download"
    }
  }
}
```

**用途:**

1. **CLIアプリ**: CLIを指定されたNode.jsバージョンにバインドし、グローバルインストールされたNode.jsに関係なく正しいランタイムを使用
2. **postinstallスクリプトを持つパッケージ**: 指定されたNode.jsバージョンでスクリプトを実行

---

## devEngines.runtime

> **v10.14で追加**

プロジェクトで使用するJavaScriptランタイムエンジンを指定。**Node.js、Deno、Bun**をサポート。

### 単一ランタイムの指定

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download"
    }
  }
}
```

### 複数ランタイムの指定

```json
{
  "devEngines": {
    "runtime": [
      {
        "name": "node",
        "version": "^24.4.0",
        "onFail": "download"
      },
      {
        "name": "deno",
        "version": "^2.4.3",
        "onFail": "download"
      }
    ]
  }
}
```

**動作の流れ:**

1. `pnpm install`が指定範囲に一致する最新ランタイムバージョンを解決
2. 正確なバージョン（とチェックサム）がlockfileに保存
3. スクリプトはローカルランタイムを使用し、環境間の一貫性を確保

---

## dependenciesMeta

`dependencies`、`optionalDependencies`、`devDependencies`内で宣言された依存関係の追加メタ情報。

### dependenciesMeta.\*.injected

ローカルワークスペースパッケージの依存関係に対して`true`に設定すると、そのパッケージはvirtual store（`node_modules/.pnpm`）にハードリンクコピーとしてインストールされる。

**デフォルト動作（false または未設定）:**

- ワークスペース内のパッケージソースディレクトリへの`node_modules`シンボリンクを作成
- より高速で、依存関係への変更が即座に反映される

**injectedが必要なケース:**

モノレポで異なるReactバージョンを使用するプロジェクトがある場合：

**card/package.json（react@16を使用）:**

```json
{
  "name": "card",
  "dependencies": {
    "button": "workspace:1.0.0",
    "react": "16"
  },
  "dependenciesMeta": {
    "button": {
      "injected": true
    }
  }
}
```

**form/package.json（react@17を使用）:**

```json
{
  "name": "form",
  "dependencies": {
    "button": "workspace:1.0.0",
    "react": "17"
  },
  "dependenciesMeta": {
    "button": {
      "injected": true
    }
  }
}
```

**結果:** `button`が`react`をインポートする際、`card`のコンテキストでは`react@16`に、`form`のコンテキストでは`react@17`に解決される。

**注意点:**

- injected依存関係はワークスペースソースディレクトリのコピーを生成
- コードが変更された場合、コピーを更新する必要がある
- 更新方法:
  - `pnpm install`を再実行
  - `"prepare": "pnpm run build"`のようなライフサイクルスクリプト使用
  - サードパーティツール: [pnpm-sync](https://www.npmjs.com/package/pnpm-sync-lib)、[pnpm-sync-dependencies-meta-injected](https://www.npmjs.com/package/pnpm-sync-dependencies-meta-injected)

---

## peerDependenciesMeta

`peerDependencies`フィールドに記載された依存関係の追加情報。

### peerDependenciesMeta.\*.optional

`true`に設定すると、選択されたピア依存関係がオプショナルとしてマークされる。消費者がそれを省略してもエラーとして報告されなくなる。

```json
{
  "peerDependencies": {
    "foo": "1"
  },
  "peerDependenciesMeta": {
    "foo": {
      "optional": true
    },
    "bar": {
      "optional": true
    }
  }
}
```

**動作:**

- `bar`は`peerDependencies`に指定されていなくてもオプショナルとしてマーク可能
- pnpmは`bar`の任意のバージョンを許容すると解釈
- `foo`はオプショナルだが、指定されたバージョン仕様にのみ適用

---

## publishConfig

パッケージをパックする前にマニフェストの一部フィールドをオーバーライドできる。

### オーバーライド可能なフィールド

| フィールド | 説明 |
|-----------|------|
| `bin` | 実行可能ファイル |
| `main` | メインエントリポイント |
| `exports` | ESMエクスポート |
| `types` / `typings` | TypeScript型定義 |
| `module` | ESモジュールエントリ |
| `browser` | ブラウザ用エントリ |
| `esnext` | ESNext形式 |
| `es2015` | ES2015形式 |
| `unpkg` | unpkg CDN用 |
| `umd:main` | UMD形式 |
| `typesVersions` | TypeScriptバージョン選択 |
| `cpu` | CPUアーキテクチャ |
| `os` | オペレーティングシステム |
| `engines` | エンジン要件（v10.22.0で追加） |

### 使用例

**ソースのpackage.json:**

```json
{
  "name": "foo",
  "version": "1.0.0",
  "main": "src/index.ts",
  "publishConfig": {
    "main": "lib/index.js",
    "typings": "lib/index.d.ts"
  }
}
```

**公開されるpackage.json:**

```json
{
  "name": "foo",
  "version": "1.0.0",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts"
}
```

---

### publishConfig.executableFiles

`bin`フィールドに直接リストされていないが、実行可能フラグ（+x）を設定する必要がある追加ファイルを宣言。

```json
{
  "publishConfig": {
    "executableFiles": [
      "./dist/shim.js"
    ]
  }
}
```

**背景:** デフォルトでは、移植性のため、`bin`フィールドにリストされたファイル以外は実行可能としてマークされない。

---

### publishConfig.directory

現在の`package.json`からの相対パスで公開するサブディレクトリをカスタマイズ。

```json
{
  "name": "foo",
  "version": "1.0.0",
  "publishConfig": {
    "directory": "dist"
  }
}
```

**注意:** 指定されたディレクトリ（通常は「dist」）には独自の`package.json`が必要。

---

### publishConfig.linkDirectory

- **デフォルト:** `true`
- **型:** Boolean

`true`に設定すると、ローカル開発中に`publishConfig.directory`の場所からプロジェクトがシンボリックリンクされる。

```json
{
  "name": "foo",
  "version": "1.0.0",
  "publishConfig": {
    "directory": "dist",
    "linkDirectory": true
  }
}
```

---

## 重要なポイントまとめ

| 機能 | 用途 | 追加バージョン |
|-----|------|--------------|
| `engines` | Node.js/pnpmバージョン制約 | - |
| `engines.runtime` | 依存関係のランタイム自動インストール | v10.21.0 |
| `devEngines.runtime` | 開発用複数ランタイム管理 | v10.14 |
| `dependenciesMeta.*.injected` | ピア依存解決のためのハードリンクコピー | - |
| `peerDependenciesMeta.*.optional` | オプショナルなピア依存関係 | - |
| `publishConfig` | 公開時のフィールドオーバーライド | - |
