---
title: "Deprecating Span Events API"
source: "https://opentelemetry.io/blog/2026/deprecating-span-events/"
author:
  - "[[Liudmila Molkova]]"
  - "[[Robert Pająk]]"
  - "[[Trask Stalnaker]]"
published: 2026-03-17
created: 2026-03-19
description: "OpenTelemetryがSpan Event APIを非推奨にする理由、その影響、移行方法について解説。Span EventsとLog-based Eventsの重複を解消し、Logs APIによるイベント発行を推奨モデルとして統一する計画。"
tags:
  - "clippings"
  - "OpenTelemetry"
  - "observability"
  - "tracing"
  - "logging"
  - "API-deprecation"
---

## 要旨

OpenTelemetryは **Span Event API** (`Span.AddEvent`, `Span.RecordException`) を非推奨にする。トレースに紐づくイベントを発行する方法が2つ（Span EventsとLog-based Events）存在することによる混乱・重複を排除し、**Logs APIを唯一の推奨手段**として統一することが目的である。

ただし、既存のSpan Eventsデータやスパンビュー上のイベント表示は**そのまま維持される**。非推奨はAPIの入口であり、可視性の削除ではない。

---

## なぜSpan Event APIを非推奨にするのか

現在OpenTelemetryには、トレースに関連付けてイベントを発行する方法が2つある。

| 方式 | API | 発行方法 |
|---|---|---|
| **Log-based Events** | [Logs API](https://opentelemetry.io/docs/specs/otel/logs/api/) | ロギングライブラリまたは直接呼び出し、アクティブコンテキストに関連付け |
| **Span Events** | [Tracing API](https://opentelemetry.io/docs/specs/otel/trace/api/) | `Span.AddEvent` / `Span.RecordException` |

この2つのAPIが並存することで以下の問題が生じている。

1. **進化の遅延** — スキーマ・属性・後方互換性の改善を2か所で仕様策定・実装する必要がある
2. **ユーザーの混乱** — Span EventsとLog Eventsの違い、エクスポート方法、バックエンドでの扱いをすべて理解しなければならない
3. **インストルメンテーション作者へのガイダンスの分裂** — ライブラリ/フレームワーク作者が2通りの方法から選択する必要があり、エコシステム全体で一貫性が欠ける

OpenTelemetryコミュニティは以下のメンタルモデルに収斂しつつある。

> **イベントとは、Logs APIを通じて発行される名前付きログであり、コンテキストを通じてトレースやメトリクスと相関する。スパン上の特殊なケースではない。**

背景の詳細は [OpenTelemetry Logging and You](https://opentelemetry.io/blog/2025/opentelemetry-logging-and-you/) を参照。

非推奨計画は [OTEP 4430: Span Event API deprecation plan](https://github.com/open-telemetry/opentelemetry-specification/blob/fd43145dde7e5192ebc59a20992d98a3e6af5553/oteps/4430-span-event-api-deprecation-plan.md) に策定されている。

---

## 何が変わるのか

| 対象 | 変更内容 |
|---|---|
| **インストルメンテーション & セマンティック規約** | 次のメジャーバージョンでSpan EventsからLog-based Eventsへ段階的に移行 |
| **言語API & SDK** | Log-based Eventsをファーストクラスにし、互換オプションでSpan Events表示も維持 |
| **トレーシング仕様** | `Span.AddEvent`, `Span.RecordException`を非推奨化 |
| **OTLP** | Log-based Eventsのサポートはすでに安定版。Span Eventsが持っていたすべての情報を、より豊富なメタデータと柔軟なエクスポート/フィルタリングで表現可能 |

---

## 何が変わらないのか

- **既存データは引き続き有効** — Span Eventsを使用した既存データはOTLPトレースモデルの一部として維持される
- **シグナル間の相関は同様に機能** — Log-based EventsもOpenTelemetryコンテキストに参加する

---

## ロール別の影響と推奨アクション

### オペレーター（ダッシュボード/分析ツール利用者）

- アップグレード時にインストルメンテーションが例外やイベントをLog-based Eventsとして発行するようになる可能性がある
- スパンタイムラインやイベントビューでイベントが引き続き表示されるか確認する
- 即座のコード変更は不要

### アプリケーション開発者

- **SDKがLog-based EventsをSpan Eventsに変換するオプションを提供**する予定
- インストルメンテーションライブラリの新バージョンに注意
- カスタムインストルメンテーションを保守している場合：
  - 非推奨マークされたSpan Eventメソッドへの新規依存を避ける
  - 新規イベント・例外にはLogs APIを使用する

### オブザーバビリティベンダー

- Log-based Eventsを既存のスパン指向ビューに表示できるようにする
- Log-based Eventsの取り込みをサポートする

### インストルメンテーション作者

- 次のメジャーバージョンでイベント・例外をLogs APIへ移行する計画を立てる
- 現行メジャーバージョンでは、[`OTEL_SEMCONV_EXCEPTION_SIGNAL_OPT_IN`](https://opentelemetry.io/docs/specs/semconv/exceptions/) のようなオプトインメカニズムでLog-based Eventsを既存のSpan Eventsと併用することを検討
- 既存の安定版メジャーバージョンは行動互換性を維持する

### セマンティック規約作者

- Span Eventsに依存する既存の規約を進化させる際に、Log-basedの同等物の明確なガイダンスを提供する
- イベントをログレコードとして文書化する

### OpenTelemetryメンテナー

- Log-based EventsをSpan Eventsに変換するヘルパー/設定を提供する
- `Span.AddEvent`, `Span.RecordException`の非推奨化を準備しつつ互換性を維持
- Logs APIの安定化・公開を推進する

---

## まとめ

- **非推奨 ≠ 削除** — Span Eventsは即座に削除されない。新規コードでのイベント発行をLogs APIへ一本化する方向転換である
- 目標はOpenTelemetryにおけるイベントを**よりシンプルで一貫性があり、より強力にする**こと
- フィードバックは [community#3312](https://github.com/open-telemetry/community/issues/3312) で受付中。特に互換性面（スパンビューへのイベント表示、OTLPペイロードでの同梱など）についての意見が求められている
