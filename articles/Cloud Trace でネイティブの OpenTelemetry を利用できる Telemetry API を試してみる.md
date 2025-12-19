---
title: "Cloud Trace でネイティブの OpenTelemetry を利用できる Telemetry API を試してみる"
source: "https://zenn.dev/tetsuya28/articles/cloud-trace-telemetry-api"
author:
  - "tetsuya28"
published: 2025-04-12
created: 2025-12-19
description: |
  Google Cloud の Telemetry API を使用して、Cloud Trace 専用の exporter に依存せず、OpenTelemetry 準拠の実装でトレースを送信する方法を解説。Go言語での Exporter と Tracer の実装例を紹介。
tags:
  - "Go"
  - "OpenTelemetry"
  - "CloudTrace"
  - "GCP"
  - "TelemetryAPI"
  - "Observability"
---

## 概要

Google Cloud でトレースを可視化するには Cloud Trace を使用する必要があるが、従来は Cloud Trace 用の専用 exporter が必要だった。新しい **Telemetry API** の登場により、**OpenTelemetry 準拠の標準的な実装**で Cloud Trace にトレースを送信できるようになった。

### メリット

- Cloud Trace 固有の実装への依存を排除
- OpenTelemetry の標準的な実装をそのまま利用可能
- ベンダーロックインの軽減

## 前提条件

Telemetry API を有効化する必要がある：

- [Telemetry API 有効化ページ](https://console.cloud.google.com/apis/library/telemetry.googleapis.com)

## 実装（Go言語）

### 1. Exporter の作成

OTLP で利用する exporter を作成する。

**ポイント：**

1. Telemetry API のエンドポイント（`telemetry.googleapis.com:443`）を指定
2. `grpc.WithPerRPCCredentials` で認証情報を指定
3. Cloud Run 上で実行する場合は `oauth.NewApplicationDefault` で認証情報を取得

```go
// 必要なインポート
// "context"
// "google.golang.org/grpc/credentials/oauth"
// "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
// "google.golang.org/grpc"
// "go.uber.org/zap"
// "go.uber.org/zap/zapcore"

ctx := context.Background()

core := zapcore.NewCore(...)
l := zap.New(core)

cred, err := oauth.NewApplicationDefault(ctx)
if err != nil {
    l.Panic(err.Error())
}

exporter, err := otlptracegrpc.New(
    ctx,
    otlptracegrpc.WithDialOption(grpc.WithPerRPCCredentials(cred)),
    otlptracegrpc.WithEndpoint("telemetry.googleapis.com:443"),
)
```

### 2. Tracer の作成

作成した exporter を利用して Tracer を設定する。

**重要：** Resource attribute に `gcp.project_id` の指定が必須。

```go
// 必要なインポート
// semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
// "go.opentelemetry.io/otel/sdk/resource"
// "go.opentelemetry.io/otel/attribute"
// "go.opentelemetry.io/otel"

rs, err := resource.New(
    ctx,
    resource.WithAttributes(
        semconv.ServiceNameKey.String("SERVICE_NAME"),
        attribute.String("gcp.project_id", "PROJECT_ID"),
    ),
)
if err != nil {
    l.Panic(err.Error())
}

tp := sdktrace.NewTracerProvider(
    sdktrace.WithBatcher(exporter),
    sdktrace.WithResource(rs),
)
defer func() {
    if err := tp.Shutdown(context.Background()); err != nil {
        l.Panic(err.Error())
    }
}()

otel.SetTracerProvider(tp)
```

### 3. 利用方法

通常の OpenTelemetry と同様に利用可能：

```go
ctx, span := otel.Tracer("main").Start(ctx, "span")
```

これで Cloud Trace でトレースを可視化できる。

## FAQ / トラブルシューティング

### `Resource is missing gcp.project_id resource attribute` エラー

Resource attribute に `gcp.project_id` を指定する必要がある。

```
2025/04/12 07:32:17 traces export: rpc error: code = InvalidArgument desc = Resource is missing gcp.project_id resource attribute
```

### Header の `x-goog-user-project`

Telemetry API を利用するためのプロジェクトを指定できる。指定しない場合でも動作自体は問題ない。

参考：[移行ドキュメント - OTel Attributes](https://cloud.google.com/stackdriver/docs/instrumentation/migrate-to-otlp-endpoints?hl=ja#otel-attrs)

## まとめ

- **Telemetry API** により、Cloud Trace 専用実装から **OpenTelemetry 標準準拠の実装**への移行が可能に
- エンドポイントを `telemetry.googleapis.com:443` に設定し、適切な認証情報を付与するだけで利用可能
- `gcp.project_id` の Resource attribute 設定が必須

## 参考リンク

- [Telemetry API 概要](https://cloud.google.com/stackdriver/docs/reference/telemetry/overview?hl=ja)
- [OTLP エンドポイントへの移行ガイド](https://cloud.google.com/stackdriver/docs/instrumentation/migrate-to-otlp-endpoints?hl=ja#telemetry_add_dependencies-go)
