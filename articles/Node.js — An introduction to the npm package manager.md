---
title: "Node.js — An introduction to the npm package manager"
source: "https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager#an-introduction-to-the-npm-package-manager"
author:
  - "Node.js contributors"
published:
created: 2025-06-25
description: |
  `npm`はNode.jsの標準的なパッケージマネージャであり、プロジェクトの依存関係のダウンロード、インストール、管理に使用されます。2022年9月時点で210万以上のパッケージが登録されており、世界最大の単一言語コードリポジトリとなっています。
tags:
  - "npm"
  - "Node.js"
  - "package-manager"
  - "dependencies"
  - "versioning"
  - "scripts"
---

## npmの概要

`npm` (Node Package Manager) は、Node.jsの標準的なパッケージマネージャです。2022年9月時点で210万以上のパッケージが登録されており、世界最大の単一言語コードリポジトリとなっています。

`npm`はもともとNode.jsパッケージの依存関係をダウンロード・管理する方法として始まりましたが、現在ではフロントエンドのJavaScript開発でも広く利用されています。`Yarn`や`pnpm`といった代替のCLIツールも存在します。

## パッケージの管理

`npm`はプロジェクトの依存関係（ライブラリやパッケージなど）のダウンロード、インストール、更新を管理します。

### すべての依存関係をインストールする

プロジェクトに`package.json`ファイルが存在する場合、以下のコマンドを実行すると、プロジェクトに必要なすべての依存関係が`node_modules`フォルダにインストールされます。

```sh
npm install
```

### 個別のパッケージをインストールする

特定のパッケージをインストールするには、以下のコマンドを使用します。

```sh
npm install <package-name>
```

npmバージョン5以降では、このコマンドは自動的にパッケージを`package.json`の`dependencies`に追加します。

インストール時には、以下のフラグを追加できます。

- `--save-dev` (`-D`): パッケージを`devDependencies`（開発用のツール、テストライブラリなど）に追加します。
- `--no-save`: パッケージをインストールしますが、`package.json`には追加しません。
- `--save-optional` (`-O`): パッケージを`optionalDependencies`に追加します。この依存関係のインストールに失敗しても、プロジェクト全体のインストールは失敗しません。
- `--no-optional`: `optionalDependencies`のインストールを防ぎます。

### パッケージの更新

プロジェクトの依存関係を更新するには、以下のコマンドを使用します。`npm`は`package.json`で定義されたバージョン制約を満たす新しいバージョンをチェックします。

```sh
npm update
```

特定のパッケージのみを更新することも可能です。

```sh
npm update <package-name>
```

## バージョン管理

`npm`はセマンティックバージョニング（semver）標準に従って、パッケージのバージョンを管理します。これにより、特定のバージョンを指定したり、必要なバージョン範囲を指定したりできます。

特定のバージョンのパッケージをインストールするには、以下のコマンドを実行します。

```sh
npm install <package-name>@<version>
```

バージョンを明示的に指定することで、チーム全員が同じバージョンのパッケージで開発を進めることができ、一貫性を保てます。

## タスクの実行

`package.json`ファイルには`scripts`フィールドがあり、コマンドラインタスクを定義できます。これにより、長く複雑なコマンドを簡単なエイリアスで実行できます。

**package.jsonの例:**

```json
{
  "scripts": {
    "start-dev": "node lib/server-development",
    "start": "node lib/server-production",
    "watch": "webpack --watch"
  }
}
```

これらのタスクは、以下のコマンドで実行できます。

```sh
npm run start-dev
npm run watch
```
