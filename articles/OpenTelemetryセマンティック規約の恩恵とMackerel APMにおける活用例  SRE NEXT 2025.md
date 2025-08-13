---
title: "OpenTelemetryセマンティック規約の恩恵とMackerel APMにおける活用例 / SRE NEXT 2025"
source: "https://speakerdeck.com/mackerelio/sre-next-2025"
author:
  - "朝倉 一希 (id:arthur-1)"
published: 2025-07-11
created: 2025-08-13
description: |
  テレメトリーの生成・収集を標準化するフレームワークであるOpenTelemetryから、セマンティック規約という概念を取り上げて、その概観と効能について解説します。セマンティック規約は、メトリクス名や属性名といったデータに対して共通の名前を定義するものです。命名が標準化されることで、オブザーバビリティツールはプラットフォームや言語などの違いを超えてシグナル間を相関付けやすくなります。

  また、オブザーバビリティプラットフォームMackerelに新しく登場したAPM機能においても、セマンティック規約に準じた形式でトレースを投稿すると、アプリケーションの内部の様子を分かりやすく可視化することができます。Mackerel APMにおけるセマンティック規約の活用例をデモとしてご紹介します。
tags:
  - "OpenTelemetry"
  - "Mackerel"
  - "APM"
  - "SRE"
  - "Observability"
---

# OpenTelemetryセマンティック規約の恩恵とMackerel APMにおける活用例 / SRE NEXT 2025

この資料は、SRE NEXT 2025で株式会社はてなの朝倉一希氏によって発表された内容を、スライドの構成と内容に沿って包括的にまとめたものです。OpenTelemetryのセマンティック規約がもたらす恩恵と、オブザーバビリティプラットフォームMackerel APMでの具体的な活用事例について詳細に解説しています。

## 発表者情報

* **氏名**: 朝倉 一希 (ASAKURA Kazuki) / id:arthur-1
* **所属**: 株式会社はてな Mackerel開発チーム
* **役職**: サブディレクター・テックリード
* **担当**: オブザーバビリティ関連機能の開発

![発表者紹介スライド](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_1.jpg)

---

## 1. OpenTelemetry (OTel) とは？

OpenTelemetryは、メトリック、ログ、トレースといった**テレメトリーデータ**の生成・収集・送信を、特定のベンダーに依存しない形で**標準化**するための、CNCFのインキュベーションプロジェクトです。

### なぜ標準化が重要なのか？

* **標準化以前の世界**: 各ベンダーが独自のエージェント、プロトコル、データ形式を用いていたため、ユーザーは特定の製品にロックインされ、ツール間の連携も困難でした。
    ![標準化されていない世界の図](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_3.jpg)

* **OTelによる標準化**: OTelは、共通のデータモデル、API、SDK、通信プロトコル（OTLP）などを提供。これにより、プラットフォームの違いを越えてテレメトリーデータを一貫して扱えるようになります。
    ![OTelで標準化された世界の図](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_4.jpg)

本発表では、OTelが標準化する要素の中でも特に重要な「**セマンティック規約**」に焦点を当てます。

![OTelの標準化対象](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_5.jpg)

---

## 2. OpenTelemetry セマンティック規約 (Semantic Conventions)

セマンティック規約（semconv）とは、メトリクス名や属性名などの命名規則や意味を、コードベース、ライブラリ、プラットフォームの違いを超えて標準化する**「共通の語彙」**を定義するものです。

### トレースの基本用語解説

* **トレース (Trace)**: あるリクエストから始まる一連の処理の流れ全体。
* **スパン (Span)**: トレースを構成する個々の処理や操作の単位（例: API呼び出し、DBクエリ）。
* **属性 (Attribute)**: スパンに付与されるキーと値のペア形式のメタデータ（例: `http.request.method="POST"`）。

![トレース用語の説明図](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_8.jpg)

### 規約のカバー範囲と具体例

セマンティック規約は、一般的なものから特定領域に特化したものまで、幅広くカバーしています。

* **一般的な規約**: 例）メトリクスの単位には[UCUM (Unified Code for Units of Measure)](https://ucum.org/ucum.html)形式を使用する。
* **領域ごとの規約**: HTTP、データベース、RPC、メッセージングシステム、クラウドプロバイダー、CI/CD、生成AIなど。

**HTTPサーバーの規約例**:
HTTPサーバーのトレーススパンには、以下のような属性を**必須**で付与することが規約で定められています。

| 属性名 | 意味 | 例 |
| :--- | :--- | :--- |
| `http.request.method` | リクエストのHTTPメソッド | `GET` |
| `url.path` | URIのパス | `/search` |
| `url.scheme` | URIのスキーム | `https` |

![HTTPサーバーの規約例](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_11.jpg)

### 規約のバージョンと計装ライブラリ

* **バージョニング**: 規約は常に改善・拡張されており、バージョニングによって管理されています（発表時点の最新は **v1.36.0**）。
* **計装ライブラリ**: 開発者は通常、この規約を直接意識する必要はありません。各言語・フレームワーク用に提供されている**計装ライブラリ**が、規約に準拠したテレメトリーデータを自動で生成してくれるためです。ただし、ライブラリが古い規約に準拠している場合もあるため、その点は注意が必要です。

![セマンティック規約と計装ライブラリの関係](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_13.jpg)

### セマンティック規約がもたらす絶大な恩恵

1. **運用の一貫性の向上**:
    * システムが異なっても同じ方法・知識で運用できます。
    * ダッシュボードのテンプレートなどをチームや組織で再利用できます。
    * 標準化された命名により、データの意味を容易に推測できます。
2. **シグナルとオブザーバビリティバックエンドの高度な連携**:
    * データに共通の意味が定義されているため、ツール側で特化した表示（例: HTTPエンドポイントの自動認識）や高度な分析が可能になります。
    * 異なるテレメトリー同士（メトリクス、トレース、ログ）を自動で関連付け、システムを横断した分析を実現します。

![セマンティック規約の役割](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_14.jpg)

---

## 3. Mackerel APMにおけるセマンティック規約の活用

Mackerel APMは、セマンティック規約の恩恵を最大限に活用して構築された、アプリケーションのパフォーマンス監視・分析機能です。

![Mackerel APMのタイトルスライド](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_15.jpg)

### Mackerel APMの主要機能とセマンティック規約

Mackerel APMは、OpenTelemetry形式で投稿されたトレースデータを、セマンティック規約に基づいて解釈し、以下のような実用的な分析機能を提供します。

1. **HTTPサーバー**: `http.server.*` 系の属性に基づき、エンドポイントごとの統計情報（レイテンシ、エラーレート、リクエスト数）を自動で集計・表示します。
    ![HTTPサーバー機能の画面](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_19.jpg)

2. **データベース**: `db.statement` などの属性を利用し、クエリごとの統計情報を表示。これにより、パフォーマンスの悪いクエリやN+1問題の特定が容易になります。
    ![データベース機能の画面](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_20.jpg)

3. **課題管理**: `exception.*` 系の属性を持つスパンをエラーとして自動でグルーピングし、エラーの発生傾向や影響範囲を分析できます。
    ![課題管理機能の画面](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_21.jpg)

4. **簡易フィルタ**: `deployment.environment` や `service.version` といったリソース属性を利用して、環境やバージョンごとの絞り込みを可能にしています。

これらの高度な機能はすべて、セマンティック規約という**共通の語彙**があるからこそ、最小限の設定で実現できています。

![機能とセマンティック規約の関係性](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_23.jpg)

### 更新される規約への追従

セマンティック規約は常に進化しています。Mackerel開発チームは、規約のスキーマファイルに含まれる変更情報を解析して継続的に監視し、新しい規約に準拠したデータにも対応できるよう、プロダクトを更新し続けています。

![更新される規約への対応方法](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_24.jpg)

---

## 4. 結論

* **セマンティック規約の価値**: テレメトリーデータの**名前と意味を標準化する**ことで、オブザーバビリティプラットフォームがシグナルの意味を自動で解釈し、ユーザーにとって分かりやすく、実用的な分析機能を提供することを可能にします。
* **Mackerelの活用**: Mackerel APMは、このセマンティック規約を最大限に活用し、ユーザーに強力なオブザーバビリティの洞察を提供しています。

![まとめスライド](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_26.jpg)

ご清聴ありがとうございました。

![謝辞スライド](https://files.speakerdeck.com/presentations/3e21fc3571b24c23bcf29eb284e81670/slide_29.jpg)
