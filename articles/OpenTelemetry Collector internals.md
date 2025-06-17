---
title: "OpenTelemetry Collector internals"
source: "https://speakerdeck.com/ymotongpoo/opentelemetry-collector-internals"
author:
  - "Yoshi Yamaguchi (@ymotongpoo)"
published: 2025-06-15
created: 2025-06-17
description: "Japan Community Day at KubeCon + CloudNativeCon Japan 2025での登壇資料。OpenTelemetry Collectorの内部データモデルとデータ変換プロセスについて詳しく解説し、全員をOpenTelemetryのコントリビューターにすることを目標とした技術セッション。"
tags:
  - "OpenTelemetry"
  - "observability"
  - "SRE"
  - "collector"
  - "telemetry"
  - "KubeCon"
---

## 登壇者情報

**山口 能迪（やまぐち よしふみ）**  
アマゾンウェブサービスジャパン合同会社  
シニアデベロッパーアドボケイト  
専門領域：オブザーバビリティ、SRE全般

## セッション概要

本セッションは「ここにいる全員をOpenTelemetryのコントリビューターにする」ことを目標として、OpenTelemetry Collectorの内部実装について詳しく解説した技術講演です。

### 前提条件

- レポジトリ: open-telemetry/opentelemetry-collector
- バージョン: v1.34.0 (rev: ab80fb4)
- 実装言語: Go

## 1. OpenTelemetryについて

### オブザーバビリティにおける位置づけ

OpenTelemetryはオブザーバビリティの中でも**計装（インスツルメンテーション）、生成、送信**に注力したプロジェクトです。

```
システム → 入力 → 出力
         ↓     ↓
        計装   送信 → 保存 → 収集 → 可視化
```

### OpenTelemetryのスコープ

- **API & SDK**: テレメトリーデータの生成
- **プロトコル**: OTLP（OpenTelemetry Protocol）、OTel Arrow
- **Collector**: テレメトリーデータの収集・処理・転送

## 2. OpenTelemetry Collectorの設計

### 3つの主要コンポーネント

各コンポーネントは独立して動作します：

1. **Receiver**: 外部からのテレメトリーデータを受信
2. **Processor**: 受信したデータを処理・変換
3. **Exporter**: 処理済みデータを外部システムに送信
4. **Connector**: パイプライン同士の接続（今回は詳細説明なし）

```
Receiver → Processor → Exporter
```

## 3. 内部データモデル（pdata）

### pdataの構造

OpenTelemetry Collector内部では、すべてのテレメトリーデータが**pdata**という統一されたデータ型で扱われます。

```
pdata
├── ptrace (トレース)
├── pmetric (メトリクス)
├── plog (ログ)
├── pcommon (共通データ型)
└── pprofile (プロファイル・ベータ版)
```

### pdataの生成プロセス

```
OTLP Protobuf → protoc-gen-gogo → 生成されたGoコード
                     ↓
                  pdatagen
                     ↓
                   pdata
```

### 重要な特徴

- protobufから生成された型は`pdata/internal`にあり、pdata内部からのみアクセス可能
- OTLPをラップした上で追加のデータ型を保持

## 4. 各データ型の詳細

### pcommon: 共通データ型

テンプレートから自動生成された共通データ型：

- 各種プリミティブ型の値（Value）
- プリミティブ型のスライス（FooSlice）
- マップ
- Timestamp
- SpanID、TraceID、TraceState
- リソース

### ptrace: トレースデータ型

階層構造：

```
Traces
└── ResourceSpans (1:n)
    └── ScopeSpans (1:n)
        └── Span (1:n)
            ├── Status (1:1)
            ├── SpanEvent (1:n)
            └── SpanLink (1:n)
```

#### コード例

```go
traces := ptrace.NewTraces()
rs := traces.ResourceSpans().AppendEmpty()
rs.Resource().Attributes().PutStr("service.name", "service-a")

span := scope.Spans().AppendEmpty()
span.SetName("HTTP GET /api/users")
span.SetKind(ptrace.SpanKindClient)
span.Attributes().PutStr("http.method", "GET")
span.Status().SetCode(ptrace.StatusCodeOk)
```

### pmetric: メトリクスデータ型

階層構造：

```
Metrics
└── ResourceMetrics (1:n)
    └── ScopeMetrics (1:n)
        └── Metric (1:n)
            ├── Histogram (1:1)
            ├── Gauge (1:1)
            └── Sum (1:1)
                ├── HistogramDataPoint (1:n)
                ├── NumberDataPoint (1:n)
                └── Exemplar (1:1)
```

#### コード例

```go
metrics := pmetric.NewMetrics()
metric := sm.Metrics().AppendEmpty()
metric.SetName("http_requests_total")
metric.SetDescription("Total number of HTTP requests")

sum := metric.SetEmptySum()
sum.SetIsMonotonic(true)
dp := sum.DataPoints().AppendEmpty()
dp.SetIntValue(1500)
dp.Attributes().PutStr("method", "GET")
```

### plog: ログデータ型

階層構造：

```
Logs
└── ResourceLogs (1:n)
    └── ScopeLogs (1:n)
        └── LogRecord (1:n)
            ├── SeverityNumber (1:1)
            └── LogRecordFlag (1:1)
```

### pprofile: プロファイルデータ型（ベータ版）

階層構造：

```
Profiles
└── ResourceProfiles (1:n)
    └── ScopeProfiles (1:n)
        └── Profile (1:n)
            ├── Sample (1:n)
            └── Label (1:n)
```

## 5. データ変換プロセス

### 各コンポーネントの役割

- **Receiver**: 外部テレメトリー形式 → pdata
- **Processor**: pdata → 別のpdata（変換・処理）
- **Exporter**: pdata → 外部テレメトリー形式
- **Connector**: パイプライン同士の接続
- **Extension**: Collectorの補助機能

**重要**: すべての道はpdataに通じる

### 設定ファイル例

```yaml
receivers:
  otlp:
    grpc:
processors:
  batch:
  memory_limiter:
exporters:
  otlp:
    endpoint: "your-endpoint:4317"
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp]
```

## 6. パイプライン実装の詳細

### 依存関係の構築

`service/internal/graph/graph.go`で有向非巡回グラフを作成し、コンポーネント間の依存関係を管理します。

### 仮想コンポーネント

最適化のために2つの仮想コンポーネントが存在：

- **CapabilitiesNode**: Receiverが必ず接続するノード
- **FanOutNode**: ProcessorとExporterの間に挟まれるノード

```
otlp → CapabilitiesNode → mem → batch → FanOutNode → otlp
```

### Consumer パターン

各コンポーネント（Receiver以外）は**Consumer**として動作：

- Receiver以外のすべてが`Consumer`インターフェースを実装
- `ConsumeXXX()`メソッドでpdataを受け取り
- 次のコンポーネントの`ConsumeXXX()`を呼び出してデータを渡す

#### Factory実装例

```go
func CreateTraces(
    ctx context.Context,
    set Settings,
    cfg component.Config,
    next consumer.Traces  // 次のConsumer
) (Traces, error)
```

#### Processor実装例

```go
func (p *processor) ConsumeTraces(ctx context.Context, td ptrace.Traces) error {
    newTd := doSomethingWith(td)  // データ処理
    return next.ConsumeTraces(ctx, newTd)  // 次へ渡す
}
```

## 7. まとめ

### 重要なポイント

1. **統一データモデル**: OpenTelemetry Collector内部ではすべてのデータがpdataになる
2. **Consumerパターン**: Receiver以外はすべてConsumerとして振る舞う
3. **チェーン処理**: `ConsumeXXX`のチェーンでpdataを順次処理

### 今回触れなかった内容

- 各コンポーネントの実際の作り方
- コンポーネント作成の規約、Factoryの作り方
- mdatagenツールの使用方法
- ExtensionとConnector
- CapabilitiesNodeとFanOutNodeの最適化内容
- Feature Gate

### 参考リンク

- [OpenTelemetry Collectorリポジトリ](https://github.com/open-telemetry/opentelemetry-collector)
- [メトリクスReceiver作成記事](https://zenn.dev/ymotongpoo/articles/20231225-metrics-receiver)

このセッションを通じて、OpenTelemetry Collectorの内部実装について理解を深め、コントリビューターとしての第一歩を踏み出すための基礎知識を習得できます。
