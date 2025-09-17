---
title: "slog.Handlerのよくある実装ミス"
source: "https://speakerdeck.com/sakiengineer/slog-dot-handlernoyokuarushi-zhuang-misu?slide=2"
author:
  - "[[H.Saki]]"
published: 2025-09-16
created: 2025-09-17
description: "25/9/18 layerx.go #2にて発表https://layerx.connpass.com/event/365170/"
tags:
  - "clippings"
  - "Go"
  - "slog"
  - "logging"
  - "static-analysis"
---

## TL;DR

`slog.Handler` を実装したカスタムハンドラを `struct` に埋め込む場合、`WithAttrs` と `WithGroup` メソッドを明示的に実装する必要があります。これを怠ると、`slog.Logger` の `With` メソッドを呼び出した際に、カスタムハンドラが意図せず埋め込み先のデフォルトハンドラ（例: `slog.JSONHandler`）に置き換わってしまい、カスタムしたログ出力処理が機能しなくなるという問題が発生します。

この問題はGoの言語仕様（埋め込みフィールドによるメソッド継承）に起因するため、コンパイルエラーにはなりません。再発防止策として、このような実装ミスを検知するための静的解析ツールを導入することが推奨されます。

## 概要

この資料は、Go 1.21で導入された構造化ロギングパッケージ `slog` の `slog.Handler` インターフェースを実装する際によくある間違いについて解説しています。特に、`slog.JSONHandler` などを構造体に埋め込んでカスタムハンドラを作成した場合に発生する問題とその原因、そして解決策について詳述されています。

### はじめに：発生した問題

コンテキスト (`context.Context`) に含まれる `trace_id` を自動でログに付与するカスタムハンドラを実装しました。

![Slide 4](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_3.jpg)

このハンドラを `slog.New` でロガーに設定すると、期待通り `trace_id` がログに出力されます。

![Slide 5](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_4.jpg)

しかし、`logger.With()` を使ってロガーに属性（キーバリューペア）を追加した後、カスタムハンドラの機能が失われ、`trace_id` がログに出力されなくなってしまいました。

![Slide 7](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_6.jpg)

### `slog` の解説と問題の原因

`slog` パッケージは、構造化されたログ出力を標準でサポートします。`slog.Handler` インターフェースを実装することで、ログの出力形式などを自由にカスタマイズできます。

今回の問題は、`slog.Logger` の `With` メソッドを呼び出した際に、自作のカスタムハンドラが、埋め込んでいた `slog.JSONHandler` に置き換わってしまった（デグレした）ことが原因でした。

![Slide 10](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_9.jpg)

### デグレの根本原因

`slog.Handler` インターフェースは、`Handle` メソッドに加えて `WithAttrs` と `WithGroup` メソッドを定義しています。

カスタムハンドラ `TraceHandler` に `slog.JSONHandler` を埋め込んだ際、`WithAttrs` と `WithGroup` を明示的に実装していませんでした。

![Slide 11](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_10.jpg)

Goの仕様では、構造体に型を埋め込むと、埋め込まれた型のメソッドを自身のメソッドとして呼び出せます。そのため、`TraceHandler` のインスタンスに対して `WithAttrs` を呼び出すと、埋め込まれている `slog.JSONHandler` の `WithAttrs` が実行されます。

そして、`slog.JSONHandler` の `WithAttrs` メソッドは、新しい `slog.JSONHandler` のインスタンスを返します。

![Slide 13](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_12.jpg)

結果として、`logger.With()` を呼び出した後のロガーは、`TraceHandler` ではなく `slog.JSONHandler` を持つことになり、カスタムした機能が失われてしまったのです。

### 解決策と再発防止

この問題を解決するには、カスタムハンドラ `TraceHandler` に `WithAttrs` と `WithGroup` メソッドを正しく実装する必要があります。これらのメソッド内で、`slog.JSONHandler` の同名メソッドを呼び出し、その戻り値のハンドラを新しい `TraceHandler` でラップして返すようにします。

![Slide 15](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_14.jpg)

このようなミスはコンパイル時に検知できないため、再発防止策として静的解析が有効です。発表者はこの問題を検知するための静的解析ツール `sloganalyzer` を作成し、`go vet` で検出できるようにしました。

![Slide 20](https://files.speakerdeck.com/presentations/746a7388dc284410946fd7137b85be13/slide_19.jpg)

### 参考資料

* **サンプルコード:**
  * [https://go.dev/play/p/0osz4K1_4LK](https://go.dev/play/p/0osz4K1_4LK)
  * [https://go.dev/play/p/nEpXQ2R qF4A](https://go.dev/play/p/nEpXQ2RqF4A)
* **静的解析ツール:**
  * [https://github.com/saki-engineering/slognalytics](https://github.com/saki-engineering/slognalytics)
* **解説記事 (Zenn Book):**
  * [https://zenn.dev/hsaki/books/golang-static-analysis](https://zenn.dev/hsaki/books/golang-static-analysis)
