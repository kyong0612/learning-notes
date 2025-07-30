---
title: "Organizing a Go module - The Go Programming Language"
source: "https://go.dev/doc/modules/layout"
author:
published:
created: 2025-07-30
description: |
  Goを始めたばかりの開発者が共通して抱く「Goプロジェクトをどのように構成すればよいか？」という疑問に答えるためのガイドライン。このドキュメントでは、パッケージ、コマンドラインプログラム、またはその両方を含むプロジェクトの種類ごとに、ファイルとフォルダのレイアウトに関する指針を提供します。
tags:
  - "Go"
  - "Module"
  - "Project Structure"
  - "Package Management"
---

## Goモジュールの構成ガイド

Goを使い始めた開発者がよく抱く疑問は、「Goプロジェクトをどのように構成すればよいか？」というものです。このドキュメントは、ファイルとフォルダのレイアウトに関するガイドラインを提供し、その疑問に答えることを目的としています。

このガイドは、プロジェクトの種類（パッケージ、コマンドラインプログラム、またはその両方）に応じて構成されています。

### 基本的なパッケージ

最も基本的なGoパッケージは、すべてのコードをプロジェクトのルートディレクトリに配置します。

- **構造**:

    ```
    project-root-directory/
      go.mod
      modname.go
      modname_test.go
    ```

- **`go.mod`**: `module github.com/someuser/modname` のようにモジュールパスを定義します。
- **パッケージ宣言**: すべての `.go` ファイルは `package modname` のように、モジュール名の最後の要素と一致するパッケージ名を宣言します。
- **利用方法**: `import "github.com/someuser/modname"` でインポートします。

### 基本的なコマンド

実行可能プログラムは、その複雑さに応じて構成されます。最も単純なものは、`func main` を含む単一のファイルです。

- **構造**:

    ```
    project-root-directory/
      go.mod
      main.go
      auth.go
      ...
    ```

- **パッケージ宣言**: すべてのファイルは `package main` を宣言します。
- **インストール**: `go install github.com/someuser/modname@latest` でインストールできます。

### サポートパッケージを持つプロジェクト

大規模なパッケージやコマンドでは、一部の機能をサポートパッケージに分割することが有効です。

- **`internal` ディレクトリ**:
  - 外部モジュールからインポートされたくないパッケージは `internal` ディレクトリに配置することが推奨されます。
  - これにより、外部の利用者に影響を与えることなく、APIのリファクタリングが自由に行えます。
- **構造**:

    ```
    project-root-directory/
      internal/
        auth/
          auth.go
      go.mod
      modname.go
    ```

- **インポート**: `import "github.com/someuser/modname/internal/auth"` のように利用します。

### 複数パッケージを持つモジュール

1つのモジュールに複数のインポート可能なパッケージを含めることができます。

- **構造**:

    ```
    project-root-directory/
      go.mod
      modname.go  // package modname
      auth/
        auth.go   // package auth
        token/
          token.go // package token
    ```

- **インポート**:
  - `import "github.com/someuser/modname/auth"`
  - `import "github.com/someuser/modname/auth/token"`

### 複数コマンドを持つリポジトリ

1つのリポジトリに複数のプログラムを含める場合、通常は別のディレクトリに配置します。

- **`cmd` ディレクトリ**:
  - すべてのコマンドを `cmd` ディレクトリにまとめるのが一般的な慣習です。これは、インポート可能なパッケージとコマンドが混在するリポジトリで特に役立ちます。
- **構造**:

    ```
    project-root-directory/
      go.mod
      internal/
        ... // 共有内部パッケージ
      cmd/
        prog1/
          main.go
        prog2/
          main.go
    ```

- **インストール**: `go install github.com/someuser/modname/cmd/prog1@latest` のようにパスを指定します。

### パッケージとコマンドを同じリポジトリで提供する

インポート可能なパッケージとインストール可能なコマンドの両方を提供するリポジトリの構成です。

- **構造**:

    ```
    project-root-directory/
      go.mod
      auth/           // インポート可能なパッケージ
        auth.go
      cmd/            // インストール可能なコマンド
        my-cli/
          main.go
    ```

### サーバープロジェクト

サーバープロジェクトは通常、自己完結型のバイナリであり、外部にパッケージをエクスポートしません。

- **推奨構成**:
  - サーバーロジックを実装するGoパッケージは `internal` ディレクトリに配置します。
  - Go以外のファイル（デプロイメントスクリプト、フロントエンドファイルなど）が多く含まれる可能性があるため、すべてのGoコマンドを `cmd` ディレクトリにまとめると良いでしょう。
- **構造**:

    ```
    project-root-directory/
      go.mod
      internal/
        auth/
        metrics/
        model/
      cmd/
        api-server/
          main.go
      ... // その他の非Goコードのディレクトリ
    ```

- **パッケージの共有**: もし共有可能で有用なパッケージができた場合は、それらを別のモジュールに切り出すことが最善です。
