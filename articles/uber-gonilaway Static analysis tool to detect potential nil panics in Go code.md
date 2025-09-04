---
title: "uber-go/nilaway: Static analysis tool to detect potential nil panics in Go code"
source: "https://github.com/uber-go/nilaway"
author:
  - "Uber Go Team"
published: 
created: 2025-09-05
description: "NilAway is a static analysis tool that seeks to help developers avoid nil panics in production by catching them at compile time rather than runtime. It employs sophisticated static analysis techniques to track nil flows within and across packages."
tags:
  - "go"
  - "static-analysis"
  - "nilability"
  - "nil-pointer"
  - "security"
  - "tools"
---

# NilAway - Goコードのnil パニック検出ツール

[![GoDoc](https://pkg.go.dev/badge/go.uber.org/nilaway.svg)](https://pkg.go.dev/go.uber.org/nilaway) [![Build Status](https://github.com/uber-go/nilaway/actions/workflows/ci.yml/badge.svg)](https://github.com/uber-go/nilaway/actions/workflows/ci.yml) [![Coverage Status](https://codecov.io/gh/uber-go/nilaway/branch/main/graph/badge.svg)](https://codecov.io/gh/uber-go/nilaway)

## 概要

NilAwayは、Goコードの本番環境でのnilパニックを回避するために、ランタイムではなくコンパイル時に問題を検出する静的解析ツールです。標準的な[nilness analyzer](https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/nilness)と似ていますが、より洗練された強力な静的解析技術を使用して、パッケージ内およびパッケージ間でのnilフローを追跡し、デバッグを容易にするためのnilnessフローを提供してエラーを報告します。

⚠️ **注意**: NilAwayは現在積極的に開発中で、偽陽性や破壊的変更が発生する可能性があります。フィードバックや貢献を歓迎しています。

## 主要特徴

NilAwayは3つの重要な特性を持っています：

### 1. 完全自動化
- 推論エンジンを搭載しており、標準的なGoコード以外に開発者からの追加情報（アノテーションなど）は一切必要ありません

### 2. 高速性
- 高速でスケーラブルになるよう設計されており、大規模なコードベースに適しています
- 測定では、NilAwayを有効にした際のビルド時間のオーバーヘッドは5%未満です
- さらなるフットプリント削減のための最適化を継続的に適用しています

### 3. 実用性
- コード内の**すべて**のnilパニックを防ぐわけではありませんが、本番環境で観察された潜在的なnilパニックの大部分をキャッチします
- 有用性とビルド時間のオーバーヘッドのバランスを適切に保ちます

## 実行方法

NilAwayは標準的な[go/analysis](https://pkg.go.dev/golang.org/x/tools/go/analysis)を使用して実装されており、既存のアナライザードライバー（[golangci-lint](https://github.com/golangci/golangci-lint)、[nogo](https://github.com/bazelbuild/rules_go/blob/master/go/nogo.rst)、[スタンドアロンチェッカー](https://pkg.go.dev/golang.org/x/tools/go/analysis/singlechecker)）との統合が容易です。

> **重要**: デフォルトでは、NilAwayは標準ライブラリや依存関係を含む**すべて**のGoコードを解析します。これにより、依存関係のコードをより良く理解し、偽陰性を減らすことができますが、大きなパフォーマンスコストを伴い、依存関係での対処不可能なエラーの数を増加させます。

プロジェクトコード専用に解析を絞り込むために、[include-pkgs](https://github.com/uber-go/nilaway/tree/main/docs/Configuration.md#include-pkgs)フラグの使用を強く推奨します。

### スタンドアロンチェッカー

```bash
# ソースからバイナリをインストール
go install go.uber.org/nilaway/cmd/nilaway@latest

# リンターを実行
nilaway -include-pkgs="<YOUR_PKG_PREFIX>,<YOUR_PKG_PREFIX_2>" ./...

# JSON出力の場合（pretty-printを無効化）
nilaway -json -pretty-print=false -include-pkgs="<YOUR_PKG_PREFIX>,<YOUR_PKG_PREFIX_2>" ./...
```

### golangci-lint (>= v1.57.0)

NilAwayの現在の形式では偽陽性を報告する可能性があるため、golangci-lintでプライベートリンターとして実行するには、NilAwayをプラグインとしてビルドする必要があります。

#### 設定手順

1. **`.custom-gcl.yml`ファイルの作成**:
```yaml
version: v1.57.0
plugins:
  - module: "go.uber.org/nilaway"
    import: "go.uber.org/nilaway/cmd/gclplugin"
    version: latest
```

2. **`.golangci.yaml`の設定**:

golangci-lint v2の場合:
```yaml
version: "2"
linters:
  enable:
    - nilaway
  settings:
    custom:
      nilaway:
        type: module
        description: Static analysis tool to detect potential nil panics in Go code.
        settings:
          include-pkgs: "<YOUR_PACKAGE_PREFIXES>"
```

3. **カスタムバイナリのビルド**:
```bash
golangci-lint custom
```

4. **実行**:
```bash
./custom-gcl run ./...
```

### Bazel/nogo

Bazel/nogoでの実行には少し多くの作業が必要です。詳細な手順については、[ドキュメント](https://github.com/uber-go/nilaway/blob/main/docs/Configurations.md#bazelnogo)を参照してください。

## コード例

NilAwayがnilパニックの防止にどのように役立つかを示すいくつかの例を見てみましょう。

### 例1: 条件付き初期化
```go
var p *P
if someCondition {
    p = &P{}
}
print(p.f) // nilnessはここでエラーを報告しませんが、NilAwayは報告します
```

この例では、ローカル変数`p`は`someCondition`がtrueの場合のみ初期化されます。フィールドアクセス`p.f`では、`someCondition`がfalseの場合にパニックが発生する可能性があります。

**NilAwayのエラー出力**:
```
go.uber.org/example.go:12:9: error: Potential nil panic detected. Observed nil flow from source to dereference point:
    - go.uber.org/example.go:12:9: unassigned variable `p` accessed field `f`
```

### 例2: 関数間のnilフロー
```go
func foo() *int {
    return nil
}

func bar() {
    print(*foo()) // nilnessはここでエラーを報告しませんが、NilAwayは報告します
}
```

この例では、関数`foo`がnilポインタを返し、それが`bar`で直接デリファレンスされ、`bar`が呼ばれるたびにパニックが発生します。

**NilAwayのエラー出力**:
```
go.uber.org/example.go:23:13: error: Potential nil panic detected. Observed nil flow from source to dereference point:
    - go.uber.org/example.go:20:14: literal `nil` returned from `foo()` in position 0
    - go.uber.org/example.go:23:13: result 0 of `foo()` dereferenced
```

> **注意**: 上記の例では、`foo`は必ずしも`bar`と同じパッケージに存在する必要はありません。NilAwayはパッケージ間でもnilフローを追跡できます。

## 設定

[go/analysis](https://pkg.go.dev/golang.org/x/tools/go/analysis)の標準的なフラグ受け渡しメカニズムを通じて一連のフラグを公開しています。利用可能なフラグと、異なるリンタードライバーを使用してそれらを渡す方法については、[docs/Configurations](https://github.com/uber-go/nilaway/blob/main/docs/Configurations.md)を確認してください。

## サポート

[Go](https://golang.org/)プロジェクトと同じ[バージョンサポートポリシー](https://go.dev/doc/devel/release#policy)に従っており、Goの最新2つのメジャーバージョンをサポート・テストしています。

質問、バグレポート、機能リクエストがある場合は、お気軽に[GitHubイシューを開いて](https://github.com/uber-go/nilaway/issues)ください。

## 技術的詳細

より詳細な技術的議論については、以下を参照してください：
- [ドキュメント](https://github.com/uber-go/nilaway/blob/main/docs/index.md)
- [Uberエンジニアリングブログ](https://www.uber.com/blog/nilaway-practical-nil-panic-detection-for-go/)
- 論文（作成中）

## 貢献

NilAwayへの貢献を歓迎します！プルリクエストを作成すると、[Uber Contributor License Agreement](https://cla-assistant.io/uber-go/nilaway)への署名をお願いすることになります。

## ライセンス

このプロジェクトは2023年Uber Technologies, Inc.の著作権であり、Apache 2.0の下でライセンスされています。
