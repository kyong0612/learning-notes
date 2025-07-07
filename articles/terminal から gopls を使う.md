---
title: "terminal から gopls を使う"
source: "https://zenn.dev/knsh14/articles/gopls-cli-2025-06-30"
author:
  - "kenshi kamata"
published: 2025-07-01
created: 2025-07-07
description: |
  goplsは、一般的にエディタのLSPサーバーとして認識されていますが、その豊富な機能はコマンドラインからも直接アクセス可能です。本記事では、普段エディタを介して利用しているgoplsの機能を、CLIを通じて効果的に活用する方法を解説します。
tags:
  - "Go"
  - "CLI"
  - "lsp"
  - "gopls"
---

goplsは、VSCodeやNeovimなどのエディタでコード補完や定義ジャンプを実現するGo言語のLSP（Language Server Protocol）サーバーとして広く知られています。しかし、その機能の多くはコマンドラインから直接呼び出すことが可能です。この記事では、普段エディタ経由で利用しているgoplsの機能をCLIから活用する方法を紹介します。

## よく使うgopls CLIコマンド

### 基本

LSPでは、リクエストの多くが `filename.go:line:column` という形式でファイル内の位置を指定します。`gopls`コマンドでもこの形式が採用されています。

### `gopls definition`

関数や型、変数の定義を調査します。`-json`や`-markdown`オプションで出力形式を変更できます。

```sh
# 定義を表示
gopls definition main.go:10:15
# JSON形式で出力
gopls definition -json main.go:10:15
# Markdown形式で出力
gopls definition -markdown main.go:10:15
```

### `gopls references`

指定した識別子がどこで使用されているかの一覧を取得します。

```sh
gopls references main.go:12:20
```

### `gopls prepare_rename` と `gopls rename`

リファクタリング時に、変数名や関数名などを一括で変更します。安全のため、`prepare_rename`で影響範囲を確認してから`rename`を実行することが推奨されます。

```sh
# 変更可能かチェック
gopls prepare_rename main.go:12:34
# 実行
gopls rename -w main.go:12:34 NewFunctionName
```

### `gopls symbols`

ファイル内のシンボル（関数、型、フィールド）の一覧を取得します。エディタのアウトライン表示機能に似ています。

```sh
gopls symbols main.go
```

### `gopls check`

コードのコンパイルエラーや警告（diagnostic）を検出します。`-severity`オプションで報告レベルを調整できます。

```sh
gopls check main.go
```

### `gopls workspace_symbol`

プロジェクト全体からシンボルを検索します。`-matcher`オプションで検索方法（`fuzzy`, `casesensitive`など）を変更できます。

```sh
gopls workspace_symbol -matcher fuzzy "Handler"
```

## 既存ツールと同様の機能を持つコマンド

### `gopls format`

`gofmt`と同様にコードをフォーマットします。

```sh
gopls format -w main.go
```

### `gopls imports`

`goimports`と同様に`import`文を整理します。

```sh
gopls imports -w main.go
```

## その他のコマンド

`gopls -h`で利用可能な全コマンドが確認できます。`serve`（LSPサーバー起動）や`api-json`（API仕様出力）などの**main**コマンドと、`signature`（関数シグネチャ表示）や`links`（ドキュメントリンク表示）などの**feature**コマンドがあります。

## 課題

`gopls`のfeatureコマンドは便利ですが、大規模なリポジトリでは実行のたびにワークスペース全体を読み込むため、処理に時間がかかるという課題があります。

## 生成AIツールでの活用

`gopls`コマンドは、Claude CodeのようなAIエージェントのツールとして利用できます。`CLAUDE.md`に使用許可を記述することで、コード解析やリファクタリングを自動化させることが可能です。また、`gopls`にはMCP（Machine-readable Command Protocol）サーバーを起動する`-mcp-listen`オプションも存在し、プログラムからの利用も考慮されています。

## まとめ

goplsは単なるLSPサーバーではなく、強力なCLIツールでもあります。エディタを開かずにコード解析やリファクタリングを行えるため、日々の開発効率をさらに向上させることが期待できます。

### 参考

- [gopls command-line interface](https://github.com/golang/tools/blob/master/gopls/doc/command-line.md)
- [gopls features](https://github.com/golang/tools/blob/master/gopls/doc/features.md)
