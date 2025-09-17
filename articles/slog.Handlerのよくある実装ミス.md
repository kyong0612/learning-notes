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

## 概要

Go 1.21で導入された標準の構造化ロギングパッケージ `slog` のカスタム `Handler` を実装する際に陥りがちな問題点と、その解決策、再発防止策について解説したスライド。

`With` メソッドなどを利用した際に、カスタムハンドラが意図せず `slog` のデフォルトハンドラ（`JSONHandler` など）に置き換わってしまう「デグレ（先祖返り）」現象の原因と、それを防ぐための `WithAttrs` および `WithGroup` メソッドの実装の重要性、さらに静的解析による再発防止アプローチを紹介している。

---

## スライド

### イントロダクション

![slide_0](./assets/slide_0.jpg)

![slide_1](./assets/slide_1.jpg)

![slide_2](./assets/slide_2.jpg)

### 問題提起：カスタムハンドラのデグレ

`context` に含まれる `trace_id` を自動でログに付与するカスタムハンドラを作成。

![slide_3](./assets/slide_3.jpg)

期待通り、カスタムハンドラによって `trace_id` がログに出力される。

![slide_4](./assets/slide_4.jpg)

しかし、ロガーに `With` メソッドで属性を追加すると...

![slide_5](./assets/slide_5.jpg)

`trace_id` が出力されなくなってしまう。これは、カスタムハンドラが機能しなくなったことを意味する。

![slide_6](./assets/slide_6.jpg)

![slide_7](./assets/slide_7.jpg)

### slog.Handlerの基本と問題の解説

* `slog` は、`Handler` インターフェースを実装することで、ログの出力形式などをカスタマイズできる。
* `With` や `WithGroup` メソッドでロガーに共通の属性を追加できる。
* **問題**: `With` メソッドを呼び出すと、自作したカスタムハンドラが意図せず `slog` のデフォルトハンドラに置き換わってしまった。

![slide_8](./assets/slide_8.jpg)

### 原因の深掘り

`With` メソッドを呼び出した後、ハンドラが自作の `TraceHandler` からデフォルトの `JSONHandler` に変わってしまっている。

![slide_9](./assets/slide_9.jpg)

この原因は、カスタムハンドラ `TraceHandler` に `WithAttrs` と `WithGroup` メソッドを実装していないことにある。

![slide_10](./assets/slide_10.jpg)

### Goの埋め込みフィールド（Embedded Field）の挙動

Goでは、構造体に別の型を埋め込むと、埋め込まれた型のメソッドを自身のメソッドとして呼び出せる。

* `TraceHandler` で `WithAttrs` を呼び出す。
* `TraceHandler` には `WithAttrs` が実装されていない。
* そのため、埋め込まれている `slog.JSONHandler` の `WithAttrs` が呼び出される。

![slide_11](./assets/slide_11.jpg)

`slog.JSONHandler` の `WithAttrs` メソッドは、新しい `*slog.JSONHandler` を返す。

![slide_12](./assets/slide_12.jpg)

結果として、`With` を呼び出した後のロガーが持つハンドラは、元の `TraceHandler` ではなく、新しい `JSONHandler` になってしまう。これが「デグレ」の正体である。

![slide_13](./assets/slide_13.jpg)

### 解決策

カスタムハンドラに `WithAttrs` と `WithGroup` を正しく実装する。新しいカスタムハンドラのインスタンスを返し、状態（この場合は埋め込んだハンドラ）を適切に引き継ぐようにする。

![slide_14](./assets/slide_14.jpg)

![slide_15](./assets/slide_15.jpg)

### 再発防止策

この問題は、埋め込みフィールドの仕様上、コンパイルエラーにならず発見が難しい。

![slide_16](./assets/slide_16.jpg)

Goの言語機能だけでは、`WithAttrs` のようなメソッドの実装を強制することはできない。

![slide_17](./assets/slide_17.jpg)

そこで、静的解析が有効な再発防止策となる。「言語仕様上は問題ないが、実行するとバグの原因となるコード」を検出する。

![slide_18](./assets/slide_18.jpg)

この問題専用の静的解析ツールを自作し、`go vet` で検出できるようにした。

![slide_19](./assets/slide_19.jpg)

### まとめと宣伝

![slide_20](./assets/slide_20.jpg)

![slide_21](./assets/slide_21.jpg)
