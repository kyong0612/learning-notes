---
title: "From discovery to defense: Securing APIs with Datadog App and API Protection"
source: "https://www.datadoghq.com/blog/secure-api-with-datadog/"
author:
  - "[[Margherita Donnici]]"
  - "[[Prachi Chouksey]]"
published: 2025-12-18
created: 2026-01-13
description: "Datadog App and API Protection（AAP）を使用してAPIを自動的に発見、監視、保護する方法を解説。API Inventory、API Findings、ポスチャーオーバービューにより、リアルタイムの可視性を継続的な自動防御に変換する。"
tags:
  - security
  - API-security
  - app-and-api-protection
  - threat-detection
  - Datadog
  - observability
---

## 概要

APIは現代のデジタルプロダクトの中心に位置するが、その数が増えるにつれて攻撃対象領域も拡大している。監視されていないAPIや設定ミスのあるAPIは、データ漏洩、認証の破綻、大規模なアカウント乗っ取りなどの重大なインシデントを引き起こす可能性がある。

**Datadog App and API Protection（AAP）** は、API可視性から具体的なセキュリティ成果への移行を支援し、以下の機能を提供する：

- **API Inventory**: エンドポイントの発見
- **API Findings**: 脆弱性・設定ミスの検出
- **ポスチャーオーバービュー**: 全体的なセキュリティ状態の把握

---

## 1. API Inventoryによる完全な可視性

### 複数ソースからのエンドポイント発見

AAPは以下の複数のソースからAPIエンドポイントを自動的に発見する：

| ソース | 説明 |
|--------|------|
| **ライブトラフィック** | リアルタイムで実際に使用されているルートを表示 |
| **APIドキュメント** | OpenAPI仕様などのアップロードされた定義 |
| **推論ルート** | 非インストルメント化トラフィックから検出 |
| **AWS API Gateway連携** | クラウド環境全体の管理APIを表示 |
| **ソースコード分析** | リポジトリから直接エンドポイントを検出 |
| **エッジ統合** | NGINX、Envoy、HAProxy、Google Cloud Load Balancingとの連携 |

### アーキテクチャ図

![Datadog AAPがトラフィック、ゲートウェイ、ソースコードなど複数の発見ソースからエンドポイントを集約し、一元化されたAPI Inventoryに統合する図](https://imgix.datadoghq.com/img/blog/secure-api-with-datadog/secure-api-diagram.png?auto=compress%2Cformat&cs=origin&lossless=true&fit=max&q=75&w=&h=&dpr=1)

### 各エンドポイントに付与されるセキュリティコンテキスト

- 認証方法とエンドポイントのパブリック公開状態
- セキュリティ所見（設定ミス、弱い認証、機密データ漏洩など）
- 使用状況データ（最後にトラフィックで確認された日時など）

### API Inventoryで回答できる質問

- 未ドキュメント化またはインターネットに公開されているエンドポイントは？
- 機密データを扱うAPIは？
- 機密性、露出度、トラフィックの最もリスクの高い組み合わせを持つエンドポイントは？

![API Inventoryビュー：ソース、サービス、機密データタグ、関連するセキュリティ所見を含むエンドポイントのリスト](https://imgix.datadoghq.com/img/blog/secure-api-with-datadog/api-inventory.png?auto=compress%2Cformat&cs=origin&lossless=true&fit=max&q=75&w=&h=&dpr=1)

---

## 2. APIランドスケープの隠れたリスク検出

API Inventoryには柔軟な検索・フィルタリング機能が含まれており、以下のようなパターンを素早く特定できる：

### 検索・フィルタリングの例

| 目的 | クエリ例 | 説明 |
|------|---------|------|
| **未ドキュメント化API（シャドーAPI）** | `api:n/a` | トラフィックで確認されているが定義に存在しないエンドポイント |
| **未使用のドキュメント化API** | `api:* last_seen_traffic<=(timestamp)` | 仕様に定義されているが最近のアクティビティがないエンドポイント |
| **機密データ処理エンドポイント** | `pii:*` + 認証/所有者フィルター | PIIタグでフィルタリングし、高機密APIの保護状態を確認 |
| **攻撃を受けているエンドポイント** | `security_activity:*` または `security_activity:attack_attempt.sql_injection` | セキュリティアクティビティでクエリ |

### カスタム検出ルールの作成

検索やフィルターの組み合わせは**カスタム検出クエリ**として保存可能。AAPはそのクエリに対してエンドポイントを継続的に評価し、条件が満たされたときに所見を作成する。

---

## 3. API Findingsによるリスク検出と対応

API Findingsは、すべてのエンドポイントにわたる潜在的な脆弱性と設定ミスを集約する。

### 検出される問題の種類

- **安全でない認証と認可**: 認証がないエンドポイント、予想より弱い方法を使用しているエンドポイント
- **機密データ漏洩**: パラメータやレスポンスに含まれるPII
- **API設定ミス**: レート制限の欠如、過度に寛容なアクセス
- **非推奨または高リスクなエンドポイント**: まだトラフィックを受け取っているレガシーAPI

### 各所見に含まれるコンテキスト

- 重大度
- 影響を受けるエンドポイントとサービス
- 関連する検出ルール
- 関連アクティビティ

![API Findingsビュー：重大度、エンドポイント、トリアージステータスを含む優先順位付けされたAPIセキュリティ所見のリスト](https://imgix.datadoghq.com/img/blog/secure-api-with-datadog/api-findings.png?auto=compress%2Cformat&cs=origin&lossless=true&fit=max&q=75&w=&h=&dpr=1)

### Datadogプラットフォームとの統合

- 新しい所見の通知設定
- 高重大度の問題が出現したときに適切なオンコールチームにアラート
- ダッシュボードでアプリケーション・インフラメトリクスと並べて表示
- **Datadog Workflow Automation** でチケット作成や所有者への通知をトリガー

---

## 4. セキュリティポスチャーの一目での把握

APIポスチャーオーバービューは、組織全体のAPIセキュリティ健全性のビューを提供する。

### ポスチャービューで確認できる情報

- ドキュメント化されたエンドポイント vs 未ドキュメント化エンドポイントの数
- 重大度別のセキュリティ所見を持つエンドポイント
- 最も頻繁に攻撃されている、またはアカウント乗っ取りリスクが高いAPI

![APIポスチャーダッシュボード：ドキュメント化済み vs 未ドキュメント化エンドポイント、重大度別の所見数、最も攻撃されているAPIのサマリー](https://imgix.datadoghq.com/img/blog/secure-api-with-datadog/posture-overview.png?auto=compress%2Cformat&cs=origin&lossless=true&fit=max&q=75&w=&h=&dpr=1)

### 優先順位付けの例

1. **最優先**: 高重大度の所見を持つ未ドキュメント化エンドポイント
2. **次の優先**: まだ攻撃トラフィックを受け取っている未使用のレガシーAPI
3. **その後**: 頻繁に使用されるエンドポイントの中重大度の設定ミス

---

## 5. API可視性から継続的な保護へ

Datadog AAPは、一回限りの発見から継続的な保護へと移行するよう設計されている。

### AAPで実現できること

| 機能 | 説明 |
|------|------|
| **発見** | ドキュメント化の有無に関わらず、すべての環境のすべてのAPIを発見 |
| **検出** | 変更がまだ新しいうちに設定ミスや脆弱性を早期に検出 |
| **監視** | 使用傾向を監視し、廃止可能な休眠またはレガシーAPIを特定 |
| **自動化** | Datadogモニターとワークフローを使用して通知、エスカレーション、修復追跡を自動化 |

### 今後の機能拡張

- 新しいデータソースによる発見カバレッジのさらなる拡大
- **設定可能なスキャナー**: 機密データの検出・分類方法、認証・レート制限設定の評価方法を定義可能

---

## 重要なポイント

1. **「見えないものは守れない」** - API可視性がセキュリティの出発点
2. **シャドーAPIのリスク** - 未ドキュメント化APIは治理やレビューなしに本番トラフィックを処理している可能性
3. **統合プラットフォームの利点** - 監視、可視性、セキュリティが単一のプラットフォームで完結
4. **継続的なフィードバックループ** - APIの文書化、修正のデプロイ、検出ルールの調整がAPIセキュリティの測定可能な改善につながる

---

## 参考リンク

- [Datadog App and API Protection 製品ページ](https://www.datadoghq.com/product/app-and-api-protection/)
- [App and API Protection ドキュメント](https://docs.datadoghq.com/security/application_security/)
- [Datadog 14日間無料トライアル](https://www.datadoghq.com/)