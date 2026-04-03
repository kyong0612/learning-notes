---
title: "Why Open Dataspaces: 設計思想とアーキテクチャパラダイム（2026年4月1日） | 社会・産業のデジタル変革 | IPA 独立行政法人 情報処理推進機構"
source: "https://www.ipa.go.jp/digital/architecture/reports/open-dataspaces-design-philosophy.html"
author: "津田 通隆 / Michitaka TSUDA（Open Data Spaces Chief Architect）"
published: 2026-04-01
created: 2026-04-03
description: "IPAデジタルアーキテクチャ・デザインセンターが公開した、国や組織ごとの多様性を尊重するオープンでスケーラブルな分散データマネジメント技術コンセプト「Open Data Spaces（ODS）」の設計思想とアーキテクチャパラダイムの解説文書。データメッシュを組織・国境横断へ発展させ、Agentic AI時代のダークデータ活用を見据えたアーキテクチャを提示する。"
tags:
  - "clippings"
  - "Open Data Spaces"
  - "データメッシュ"
  - "分散データマネジメント"
  - "IPA"
  - "Agentic AI"
  - "オントロジー"
  - "データスペース"
  - "アーキテクチャ"
---

## 概要

独立行政法人情報処理推進機構（IPA）デジタルアーキテクチャ・デザインセンターが2026年4月1日に公開した文書。**Open Data Spaces（ODS）** とは、国や組織ごとの多様性を尊重する、オープンでスケーラブルな分散データマネジメントの技術コンセプトである。米国のデータスペースに関する原著論文（Franklin et al., 2005; Halevy et al., 2006）およびデータメッシュ（Dehghani, 2019; 2022）を中核に、民間企業・団体との研究開発・商用水準での検証を経て設計された新世代の分散データマネジメント技術。

---

## 1. 背景: Agentic AI時代の到来とダークデータの可能性

### データ枯渇の懸念

2026年は「**データ枯渇元年**」と呼べる転換点。Epoch AI（2024）の推計によれば、主要LLMの学習速度が維持された場合、**高品質データは2026年〜2032年の間に枯渇**する可能性がある。

![図1 LLMモデル学習におけるパブリックテキストデータ利用の予測](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000cfo3.jpg)

### ダークデータの規模

NEDO（2025）によれば、世界で創出されるリアルデータの有効量 約17.5ZBのうち、**約16ZBがインターネット非公開の「ダークデータ」**として企業内に留まっている。

![図2 リアルデータ総量の内訳](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000cfoy.jpg)

ダークデータは潜在的な学習・推論資源としての価値を持つが、そのままでは利用できないケースが多い。ドメインオーナーがデータにコンテクストを与え、「**プロダクト（商品）**」として提供・制御することが企業価値の向上につながる。

---

## 2. データマネジメントのパラダイム変遷 — 集約から分散へ

21世紀のデータマネジメントは、3Vs（Volume・Variety・Velocity）の課題を経て、現在は「**複雑性（Complexity）**」に直面。この複雑性は以下の多面的な側面を含む：

- 技術的側面
- 産業・ビジネス的側面
- 社会的・組織的側面
- 法制度・契約的側面

![図3 データマネジメントの問題関心の変遷](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000ch1s.jpg)

伝統的な「**Push and Ingest**」パラダイム（データを一箇所に集約する「集約（Aggregation）」中心の発想）は、ドメインやデータソースが多様化する組織では技術的複雑性・利用コストが増大する。この課題を解決するために「**Serving and Pull**」型の分散アプローチとして**データメッシュ**が登場し、さらにそれを組織・国境横断へと発展させたのが**Open Dataspaces**である。

---

## 3. データメッシュからOpen Dataspacesへ

### データメッシュの功績

Zhamak Dehghani氏が考案したデータメッシュは、「**データの責任を中央のデータ基盤から業務ドメインへと戻した**」点で重要な転換点。ドメインオーナー自身（広報部門、HR部門、商品開発部門等）がデータを「プロダクト」として扱うことで、中央集権的な調整や事前統合に依存せずデータ活用を組織内でスケール可能にした。

![図4 分散データマネジメントアーキテクチャ「データメッシュ」の概要](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000ch51.jpg)

### データメッシュの限界とOpen Dataspacesの位置づけ

データメッシュは「**組織内**」での部門間連携を暗黙の前提としており、**組織境界を越えた場合のGovernance Complexity**には十分に対応できていない。Open Dataspacesは以下の3つのGovernance Complexityを解決する：

| Governance Complexity | 問題 |
|---|---|
| **(1) データの所在** | Where to get |
| **(2) データの意味** | What to mean |
| **(3) データの制御** | Who and How to use |

![図5 データメッシュからOpen Dataspacesへの変遷](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000ch5o.jpg)

---

## 4. Double-Product Quanta Model（DPQM） — アーキテクチャの最小単位

**Architectural Quanta（AQ）** とは分散データマネジメントにおけるアーキテクチャの最小構成単位。Open Dataspacesでは、データメッシュのData Productに加え、その相互運用性の問題を解決するために「**Ontology Product**」を新たに導入。Data ProductとOntology Productを一体としたAQのパラダイムを **Double-Product Quanta Model（DPQM）** と呼ぶ。

![図6 Double-Product Quanta Model（DPQM）](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000ch7n.jpg)

### 二層構造の設計思想

| 層 | 仮説 | 説明 |
|---|---|---|
| **Ontology Product** | 開世界仮説（OWA） | 「判断できないことは偽ではないとみなす」 |
| **Data Product** | 閉世界仮説（CWA） | 選択的に導入し、提供者と利用者の期待値のトレードオフを埋める |

**スキーマフレキシブル（Schema Flexible）** という技術指針を採用。先にインスタンス（データ）があり、意味を後から付与する設計。これはEdgar Coddの関係モデルが前提とする集合論の束縛からの解放を意味する。

---

## 5. Open Dataspacesの構成

DPQMの構成単位（AQ）が複数包含されることで「**An Open Dataspace**」（AQM: Architectural Quantum Model）が構成される。

### 構成例

- 卸売業企業の物品ドメインAQ ＋ 物流企業の倉庫ドメインAQ → **Wholesale Distribution Dataspace（AQM）**
- 製造企業の生産ドメインAQ ＋ 上記 → **Manufacturing Logistics Dataspace（AQM）**

Open Dataspaceは**動的・多元的**に構成され、多元的・重層的な集合関係を含む総体を「**Open Dataspaces**」または「**The Open Dataspace**」と呼称する。

![図7 Open Dataspacesの構成単位（AQM）](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000ch99.jpg)

---

## 6. アーキテクチャの3本の柱

データの組織・国境横断とAgentic AIの存在を前提とし、透過的な**Single Source of Truth（SSOT）** とドメインオーナーへの**価値還元メカニズム**を実現する3つの柱。

![図8 Open Dataspacesの分散型アーキテクチャ3つの柱](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000chap.jpg)

### 柱1: Ontology and Semantic Interoperability（OSI）

- 「**データモデル（Data Model）**」と「**情報モデル（Information Model）**」を明確に分離するDPQMを採用
- 意味の進化をデータ構造の破壊ではなく「**再解釈**」として扱うことが可能
- LLMによるOntological Gapの改善を取り込んだ「**Dynamic Ontology**」
- Agentic AIネイティブ時代に「**推測（Guess）から知識（Knowledge）**」へのパラダイムシフトを促進

### 柱2: Data Addressability & Discoverability（DAD）

- ドメイン外部に「**Ontology Endpoint**」と「**Data Endpoint**」の2つの独立インターフェースを公開
- **IRI（International Resource Identifier）** により、ドメインごとの内部識別子を温存しつつグローバルに一意な存在証明を提供
- 2段階のクエリプロセス:
  1. **Ontology Query（第一段階）**: 任意キーワードに対してBest Effort Resultを返す
  2. **Data Query（第二段階）**: データソースへの実アクセス
- データカタログは硬直的な静的リポジトリではなく、**クエリ依存で都度生成される動的ビューワー**

### 柱3: Identity and Usage Control（IUC）

- 信頼を前提ではなく設計対象として扱う「**Trust by Design**」
- アイデンティティの3要素分解:
  1. **実在性の検証（Identity Proofing）**
  2. **認証（Authentication）**
  3. **認可（Authorization）**
- **利用制御（Usage Control）**: アクセス制御を拡張した権利・義務的概念
  - データ提供者と利用者の間の権利義務・価格決定権の非対称性をアーキテクチャレベルで補正
  - 法域・制度的均質性を前提としない多様な方式を許容

---

## 7. 設計指針とサービスモデル

### 3つの設計指針

1. **ベンダーロックインの回避**: プロトコルは疎結合に構成、後方互換性を設計段階でビルトイン
2. **制度的ロックインの回避**: 特定の法域や制度を前提としない
3. **プロダクトライクでサービス志向の設計**

### Hybrid Service Model（HSM）

2つのサービスモデルの混成：

| モデル | 説明 |
|---|---|
| **分散型サービスモデル** | ドメインオーナー自身がSelf-Serve Data Platformを構築 |
| **連邦型サービスモデル** | DPQMの基本ソフトウェアスタックをマネージドサービス事業者（**Dataspace Service Provider: DSSP**）が代理提供 |

HSMにより、**大企業から中小企業まで幅広い主体**のOpen Dataspacesへの参加が可能になる。

![図9 HSMの概要](https://www.ipa.go.jp/digital/architecture/reports/rcu1hd000000ab42-img/rcu1hd000000che0.jpg)

---

## 重要な結論・発見

1. **データ枯渇時代への対応**: 高品質パブリックデータの枯渇が迫る中、企業内に眠る約16ZBのダークデータを活用可能にする技術基盤としてODSを位置づけ
2. **「集約」から「分散」へのパラダイムシフト**: Push and IngestからServing and Pullへの転換を、組織・国境を越えて実現
3. **DPQMの革新性**: Data ProductとOntology Productの二層構造により、開世界仮説と閉世界仮説を使い分け、相互運用性と実用性を両立
4. **Agentic AIネイティブ設計**: LLMによるDynamic Ontologyの活用で「推測から知識」へのシフトを促進
5. **Trust by Design**: 信頼を前提ではなく設計対象として扱い、利用制御をアーキテクチャレベルで組み込む
6. **HSMによる参加障壁の低減**: 大企業から中小企業まで参加可能なハイブリッドサービスモデルの提供

---

## 関連リンク

- [Why Open Dataspaces: 設計思想とアーキテクチャパラダイム(PDF:5.3 MB)](https://www.ipa.go.jp/digital/architecture/documents/rcu1hd000000chgw-att/WhyOpenDataspaces_jp.pdf)
- [Open Data Spaces Reference Architecture Model (ODS-RAM)](https://open-dataspaces.gitbook.io/ods-docs/jp)
- [Open Data Spaces Protocols (ODP)](https://open-dataspaces.gitbook.io/ods-docs/jp)
- [Open Data Spaces Middleware (GitHub)](https://github.com/open-dataspaces)
- [Data Mesh Principles and Logical Architecture（martinfowler.com）](https://martinfowler.com/articles/data-mesh-principles.html)
- [プレス発表(2026年4月1日)](https://www.ipa.go.jp/pressrelease/2026/press20260401.html)
- [プレス発表(2025年10月15日)](https://www.ipa.go.jp/pressrelease/2025/press20251015.html)
- [プレス発表(2025年8月1日)](https://www.ipa.go.jp/pressrelease/2025/press20250801.html)

> 発行: 独立行政法人情報処理推進機構デジタルアーキテクチャ・デザインセンター / ライセンス: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)
