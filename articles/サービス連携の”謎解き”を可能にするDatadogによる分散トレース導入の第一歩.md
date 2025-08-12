---
title: "サービス連携の謎解きを可能にするDatadogによる分散トレース導入の第一歩"
source: "https://speakerdeck.com/hirosi1900day/sabisulian-xi-no-mi-jie-ki-woke-neng-nisurudatadogniyorufen-san-toresudao-ru-nodi-bu"
author:
  - "徳富博(@yannKazu1)"
published: 2025-07-26
created: 2025-08-12
description: "SRE NEXT 2025での発表。Datadogによる分散トレース導入の基礎から実装方法、Inject/Extractメソッドを使ったサービス間トレーシングの実装方法について解説した技術講演。"
tags:
  - "分散トレーシング"
  - "Datadog"
  - "マイクロサービス"
  - "オブザーバビリティ"
  - "SRE"
---

# サービス連携の"謎解き"を可能にするDatadogによる分散トレース導入の第一歩

## 概要

SRE NEXT 2025で発表された、Datadogによる分散トレース導入に関する技術講演のスライド資料。タイミーのプラットフォームエンジニアリングチーム1Gの徳富博氏による発表。

## 自己紹介

**徳富博(@yannKazu1)**

- 所属: タイミー プラットフォームエンジニアリングチーム 1G  
- 好きな技術: Go, Ruby, TypeScript, AWS
- 趣味: 野菜を育てている

## 分散トレーシングについて

### 分散トレーシングとは

分散トレーシングは、**システムをまたいだリクエストの流れをエンドツーエンドで可視化・追跡する技術**です。

マイクロサービスアーキテクチャにおいて、複数のサービス間でのリクエストの流れを追跡し、パフォーマンスボトルネックやエラーの原因を特定するために使用されます。

### 課題：複雑な概念と実装

分散トレーシングの実装時には以下のような複雑な概念が登場し、理解が困難になりがちです：

- Propagator
- SpanContext  
- Carrier

## サービス間の分散トレース情報連携方式

### HTTPヘッダーによる主な伝搬方式

#### 🐶 Datadog独自形式（datadog）

```
x-datadog-trace-id: <trace-id>
x-datadog-parent-id: <span-id>
x-datadog-sampling-priority: <sampling>
```

- Datadog APM向けのデフォルト形式

#### 🌐 W3C Trace Context（標準規格、tracecontext）

```
traceparent: <version>-<trace-id>-<span-id>-<trace-flags>
```

- OpenTelemetryなど多くのベンダーが対応

#### ⚠️ B3（非推奨）

**🔹 B3 Multi（b3multi）**

```
X-B3-TraceId: <trace-id>
X-B3-SpanId: <span-id>
X-B3-ParentSpanId: <parent-span-id>（任意）
X-B3-Sampled: 0 または 1
```

- Zipkin互換、レガシー用途、複数ヘッダ形式

**🔸 B3 Single（b3 single header, b3single）**

```
b3: <trace-id>-<span-id>-<sampling>
```

- 軽量・1ヘッダで伝播、モダンなgRPCやHTTP/2と相性が良い

### 手動実装の問題点

直接HTTPヘッダーを操作する手動実装には以下の問題があります：

- ヘッダー仕様が変わったとき毎回修正が必要
- それぞれのサービスがDatadog形式なのか、tracecontext形式なのかを意識して実装する必要がある
- メンテナンス性が悪い

## Inject/Extractメソッドの活用

### DDTraceのInject/Extract機能

ddtrace（およびOTel SDK）には、トレース情報をヘッダーに埋め込んだり取り出したりする仕組み（**Inject/Extract**）メソッドが用意されています。

### 送信側の実装例

```go
// 送信側
headers := make(http.Header)
carrier := tracer.HTTPHeadersCarrier(headers)
err := tracer.Inject(span.Context(), carrier)
```

### 受信側の実装例

```go
// 受信側
carrier := tracer.HTTPHeadersCarrier(req.Header)
spanCtx, err := tracer.Extract(carrier)
```

### 環境変数による柔軟な形式切り替え

Inject/Extractを使えば、環境変数を変えるだけで柔軟に伝搬形式を切り替えられます：

#### ヘッダー伝搬形式の切り替え（ddtrace）

- **DD_TRACE_PROPAGATION_STYLE**
  - Inject/Extract両方に適用
  - デフォルトは `datadog,tracecontext`（両対応）

- **DD_TRACE_PROPAGATION_STYLE_INJECT / ...\_EXTRACT**
  - 各々個別に指定も可能

**結論：Inject/Extractを使えば、簡単に複数の形式（ddtrace形式・tracecontext形式など）に対応させることができ、形式を意識しなくてよくなります。**

## 内部仕組みの詳細

### HTTPHeadersCarrier

- **HTTPHeadersCarrier**は`http.Header`のラッパー
- `TextMapWriter`、`TextMapReader`インターフェースを満たしている

```go
// TextMapWriter Interface
type TextMapWriter interface {
    Set(key, val string)
}

// TextMapReader Interface  
type TextMapReader interface {
    ForeachKey(handler func(key, val string) error) error
}
```

### Propagatorの役割

#### tracer.Inject/Extractの内部動作

- `tracer.Inject`は`Propagator.Inject`を呼び出す
- `tracer.Extract`は`Propagator.Extract`を呼び出す

#### Propagator.Injectの実装

- `TextMapWriter`の`Set`メソッドを使って、トレースコンテキストをHTTPヘッダーに書き込む

#### Propagator.Extractの実装

- `TextMapReader`の`ForeachKey`メソッドを使って、HTTPヘッダーからトレースコンテキストを読み取る

### カスタムPropagator/Carrierの作成

#### Propagator Interfaceの定義

```go
type Propagator interface {
    Inject(spanCtx SpanContext, carrier interface{}) error
    Extract(carrier interface{}) (SpanContext, error)
}
```

#### カスタマイズの可能性

- **Carrier**: `TextMapWriter`/`TextMapReader`インターフェースを満たしていれば、自作の構造体を使ってカスタマイズしたCarrierを作ることも可能
- **Propagator**: `Propagator`インターフェースを満たしていれば、独自のPropagatorを実装可能
- `tracer.Start`時に`WithPropagator`オプションを指定することで、独自のPropagatorを適用可能

### カスタムPropagator/Carrierが必要な場面

- Datadogが対応していないプロトコルや形式を使う場合
- トレース情報の伝搬を制御したい場合  
- カスタムフォーマットが必要な場合

## まとめ

### サービス間連携のベストプラクティス

- トレース情報をHTTPヘッダーに手動で仕込むのではなく、**各SDKが提供するInject/Extractメソッドを使用する**
- これにより、環境変数（`DD_TRACE_PROPAGATION_STYLE`）を切り替えるだけで、Datadog形式、tracecontext形式など柔軟にヘッダー伝搬形式に対応できる

### 詳細な仕組み：PropagatorとCarrier

- **Inject/Extractメソッド**は内部でPropagatorを呼び出す
- **Propagator**はSpanContextの情報をCarrier通じてHTTP Headerに詰めたり、読み取ってSpanContextを生成する役割を担う
- **Carrier**は、HTTPヘッダーなどの情報伝達媒体を抽象化したラッパーであり、TextMapWriter（書き込み用）とTextMapReader（読み取り用）インターフェースを実装する
- インターフェースを満たしていれば、カスタムのPropagatorやCarrierを実装することも可能

### 推奨事項

**トレース情報をヘッダーに埋め込んだり取り出したりする時は、自前実装ではなくSDKのInject/Extractを使おう！**

**Give distributed tracing a try!**
