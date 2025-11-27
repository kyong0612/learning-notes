---
title: "Google Security Operations"
source: "https://cloud.google.com/security/products/security-operations?hl=ja"
author:
  - "[[Google Cloud]]"
published:
created: 2025-11-27
description: "Google Security Operations（旧称 Chronicle）は、AI搭載のインテリジェンス主導のセキュリティ運用プラットフォームです。SIEM、SOAR、脅威インテリジェンスを統合し、セキュリティチームがサイバーセキュリティの脅威を検出、調査、対応できるようにします。2025年Gartner Magic QuadrantのSIEM部門でリーダーに選出されています。"
tags:
  - "clippings"
  - "Google Cloud"
  - "セキュリティ"
  - "SIEM"
  - "SOAR"
  - "脅威インテリジェンス"
  - "SecOps"
  - "Gemini"
  - "AI"
---

## 概要

Google Security Operations（SecOps）は、**AI搭載のインテリジェンス主導のセキュリティ運用プラットフォーム**です。クラウドネイティブな設計により、セキュリティチームがサイバーセキュリティの脅威を**検出**、**調査**、**対応**できるようにします。

> **受賞歴**: Google は 2025 年 Gartner® Magic Quadrant™ の SIEM 部門でリーダーに選出されました。

### 主な特徴

- **Google ならではの速度と規模**でデータを取り込み、分析
- **Google の脅威インテリジェンス**を活用して最新の脅威を発見・防御
- **生成AI（Gemini）**でチームの生産性を向上

---

## 主要機能

### 1. 脅威検出（Detection）

Google SecOpsは、豊富でキュレーションされた検出機能を提供します。

| 機能 | 説明 |
|------|------|
| **キュレーションされた検出** | Google の脅威リサーチチームが開発・継続的にメンテナンス |
| **Gemini活用** | 自然言語でデータ検索、反復処理、ドリルダウン、検出機能の作成が可能 |
| **Yara-L言語** | 直感的な言語でカスタム検出をわずかな時間とコードで作成 |
| **データパイプライン管理** | セキュリティテレメトリーをルーティング、フィルタリング、編集、変換 |

### 2. 調査（Investigation）

シンプルかつ直感的なアナリストエクスペリエンスを提供します。

- **脅威中心のケース管理**
- **インタラクティブでコンテキスト豊富なアラートのグラフ化**
- **エンティティの自動ステッチ**
- **Gemini調査チャットアシスタント**
  - ケースで発生している事象のコンテキストと詳細情報を取得
  - AIが生成したケースサマリーと対応方法の推奨事項
- **高速かつ文脈に即した検索機能**

### 3. 対応（Response）

本格的なセキュリティオーケストレーション、自動化、対応（SOAR）機能を含みます。

| 機能 | 説明 |
|------|------|
| **ハンドブック作成** | 一般的な対応アクションを自動化 |
| **ツール連携** | 300以上のツール（EDR、ID管理、ネットワークセキュリティなど）をオーケストレート |
| **自動文書化ケースウォール** | チームメンバーとの共同作業 |
| **AI搭載チャット** | コンテキストアウェアなチャットでハンドブックを簡単に作成 |
| **効果測定** | アナリストの生産性やMTTRなどを追跡・測定 |

---

## 仕組み

Google Security Operationsは、**SIEM、SOAR、脅威インテリジェンス**にわたる統合されたエクスペリエンスを提供します。

```text
セキュリティテレメトリーデータ収集
        ↓
脅威インテリジェンスの適用
        ↓
優先度の高い脅威を特定
        ↓
ハンドブック自動化・ケース管理・コラボレーション対応
```

---

## 一般的なユースケース

### SIEM の移行

現在のSIEMの課題を特定し、Google SecOpsへの移行を成功させる。

### SOC のモダナイゼーション

セキュリティ運用を変革して、最新の脅威から組織を保護する。

### Google Cloud Cybershield™

国家規模の脅威防御。政府によるセキュリティ運用を変革し、カスタマイズされた脅威インテリジェンス、合理化されたセキュリティ運用を実現。

### Google Unified Security Recommended

市場をリードするセキュリティソリューションとの戦略的パートナーシップにより、統合セキュリティポートフォリオ全体で最高水準の体験を提供。

---

## 料金パッケージ

Google Security Operationsは**取り込みに基づくパッケージ**で提供されます。追加費用なしで**1年間のセキュリティテレメトリーを保持**できます。

### パッケージ比較

| パッケージ | 主な機能 |
|-----------|---------|
| **Standard** | SIEM/SOAR基本機能、700以上のパーサー、300以上のSOAR統合、1環境、最大1,000単一イベントルール/75マルチイベントルール |
| **Enterprise** | Standard全機能＋無制限環境、UEBA、オープンソースインテリジェンス、Google厳選検出機能、**Gemini in Security Operations** |
| **Enterprise Plus** | Enterprise全機能＋最大3,500単一イベントルール/200マルチイベントルール、**Google Threat Intelligence完全アクセス**（Mandiant、VirusTotal含む）、BigQuery UDMストレージ |

### 各パッケージの詳細

#### Standard

- **SIEM/SOAR基本機能**: データ取り込み、脅威検出、調査と対応（12か月間のホットデータ保持）
- **パーサー/統合**: 700以上のパーサー、300以上のSOAR統合、リモートエージェント付き1環境
- **検出エンジン**: 最大1,000単一イベントルール、75マルチイベントルール
- **脅威インテリジェンス**: お客様独自のフィードを使用
- **データパイプライン管理**: 限定的なフィルタリングと変換

#### Enterprise

- Standard全機能に加えて:
- **環境**: 無制限環境（最大2,000単一イベントルール、125マルチイベントルール）
- **UEBA**: YARA-Lでユーザー/エンティティ行動分析ルール作成、リスクダッシュボード
- **脅威インテリジェンス**: オープンソースインテリジェンスのキュレーション（Google セーフブラウジング、OSINT Threat Associations等）
- **Google厳選検出機能**: オンプレミス/クラウド脅威対応
- **Gemini in Security Operations**: 自然言語、調査アシスタント、要約、推奨アクション、検出/ハンドブック作成

#### Enterprise Plus

- Enterprise全機能に加えて:
- **検出エンジン拡張**: 最大3,500単一イベントルール、200マルチイベントルール
- **高度な脅威インテリジェンス**: Google Threat Intelligence完全アクセス（Mandiant、VirusTotal、Googleの脅威インテリジェンス）
- **Applied Threat Intelligence**: IoC優先順位付け、ML ベース優先順位付け、TTP分析
- **最前線脅威検出**: Mandiant一次調査・インシデント対応からの新たな脅威検出
- **データパイプライン管理**: 高度なフィルタ、削除、変換、Googleへのルーティング、SIEM移行用12か月間ルーティング
- **BigQuery UDMストレージ**: 保持期間（デフォルト12か月）まで無料

---

## ビジネスインパクト

### Forrester Consulting 調査結果

> **投資収益率（ROI）: 240%向上**
>
> 「簡単に言えば、Google SecOps はリスクを大幅に軽減するものです。以前はビジネスに影響を与えていた脅威も、今では影響を与えなくなりました。オブザーバビリティが向上し、平均検出時間と平均対応時間が短縮されたからです。」
> — CISO、保険会社

### 顧客事例

| 企業 | 効果 |
|------|------|
| **Vertiv** | 従来のSIEMで5-7人必要だったところ、ロギングするデータ量は約22倍、イベント件数は3倍に増加、調査所要時間は半減 |
| **Pfizer** | プロダクトにコンテキスト情報と脅威インテリジェンスが組み込まれ、直感的でスピーディな運用を実現 |
| **Apex FinTech Solutions** | 検出と調査の時間を2時間から約15-30分に短縮 |

---

## よくある質問（FAQ）

### Q: Google Security Operations は Google Cloud にのみ関係しますか？

**A:** いいえ。オンプレミスやすべての主要クラウドプロバイダを含む環境全体からセキュリティテレメトリーを取り込み、分析できます。

### Q: 独自の脅威インテリジェンスフィードを取り込めますか？

**A:** はい。ただし、脅威検出のための脅威インテリジェンスの自動適用は、Googleの脅威インテリジェンスフィードでのみサポートされています。

### Q: 特定のリージョンのデータ所在地をサポートしていますか？

**A:** はい。利用可能なリージョンの一覧が公開されています。

### Q: Google SecOps には AI が含まれていますか？

**A:** はい。Gemini を活用して以下が可能です:

- 自然言語でのデータ検索、反復処理、ドリルダウン
- AIによるケース要約と対応推奨
- 検出とハンドブックの作成

### Q: Google SecOps には SIEM 機能が含まれていますか？

**A:** はい。SIEM、SOAR、高度な脅威インテリジェンス機能が含まれます。

### Q: サイバー防御プログラムの変革を支援する専門家はいますか？

**A:** はい。Mandiant のエキスパートがカスタマイズされたガイダンスとプログラム管理を提供します。

---

## 関連リソース

- [2025年 Gartner Magic Quadrant SIEM部門リーダー](https://cloud.google.com/blog/products/identity-security/google-is-named-a-leader-in-the-2025-gartner-magic-quadrant-for-siem)
- [2024年 IDC MarketScape SIEM部門リーダー](https://cloud.google.com/security/resources/idc-siem-marketscape-report)
- [SOC成熟度評価](https://securityassessments.withgoogle.com/secops/)
- [Google Security Operations ドキュメント](https://cloud.google.com/docs)
- [Google Cloud セキュリティコミュニティ](https://cloud.google.com/security)

---

## 導入企業

BBVA、Morgan Sindall、Groupon、Telefonica、Vertiv、Jack Henry、Kroger、Telepass、Charles Schwab、Herjavec など、世界中のセキュリティチームから信頼されています。
