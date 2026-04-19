---
title: "Why Open Dataspaces: 設計思想とアーキテクチャパラダイム"
source: "https://www.ipa.go.jp/digital/architecture/documents/rcu1hd000000chgw-att/WhyOpenDataspaces_jp.pdf"
author:
  - "津田 通隆 (Michitaka TSUDA)"
  - "独立行政法人情報処理推進機構 (IPA) デジタルアーキテクチャ・デザインセンター"
published: 2026-04
created: 2026-04-19
description: |
  IPAが提唱する分散データマネジメントの技術コンセプト「Open Data Spaces (ODS)」の設計思想とアーキテクチャパラダイムを示すホワイトペーパー。
  Agentic AI時代のデータ枯渇とダークデータ活用の課題に対し、データメッシュとClassical Dataspacesを源流とする組織・国境横断の分散データマネジメントアーキテクチャを、
  Double-Product Quanta Model (DPQM) と3つの柱 (OSI / DAD / IUC) で提示する。
tags:
  - "clippings"
  - "open-dataspaces"
  - "data-mesh"
  - "distributed-data-management"
  - "data-architecture"
  - "agentic-ai"
  - "ontology"
  - "domain-driven-design"
  - "usage-control"
  - "ipa"
---

# Why Open Dataspaces: 設計思想とアーキテクチャパラダイム

> **出典**: 独立行政法人情報処理推進機構 (IPA) デジタルアーキテクチャ・デザインセンター, 津田 通隆 (Chief Architect), 2026年4月
> **ライセンス**: CC BY 4.0
> **キーワード**: distributed data management, data mesh, dataspaces, semantic layer, ontology, usage control, Artificial Intelligence, Agentic AI, context engineering, Domain-Driven Design

## 概要

本書は、国や組織ごとの多様性を尊重する、オープンでスケーラブルな分散データマネジメントの技術コンセプト **「Open Data Spaces (ODS)」** の設計思想とアーキテクチャパラダイムを提示するホワイトペーパー。

- Agentic AI時代のデータ枯渇と、企業内に留まる**ダークデータ**活用の課題を出発点とする。
- 米国の原著論文 Classical Dataspaces (Franklin et al., 2005; Halevy et al., 2006) と **データメッシュ** (Dehghani, 2019) を源流とし、それを**組織・国境を横断**する分散データマネジメントへ拡張する。
- アーキテクチャの中核は、新たに導入された最小単位 **Double-Product Quanta Model (DPQM)** と、**3つの柱 (OSI / DAD / IUC)** である。
- 欧州の International Data Spaces / Eclipse Data Spaces とは出自が異なり、異なる指針で設計されている点が明示されている。

---

## はじめに: Agentic AI時代とダークデータの可能性

### インターネットデータの有限性と「データ枯渇問題」

- 現代のLLMはインターネット上のパブリックテキストデータを基礎とする学習データセットを利用。スケーリング則 (モデル規模・データ量・計算能力) の実務上の両輪が**データと計算資源**。
- Epoch AI (2024) の推計では、**高品質データは2026〜2032年の間に枯渇する可能性**がある (図1)。
- 枯渇とはデータ消失ではなく、**学習に耐えうる新規データ供給速度が追いつかない状況**を指す。
- 2026年は「データ枯渇元年」と呼べる転換点。

### リアルデータと合成データ

| 分類 | 特徴 |
|------|------|
| リアルデータ | 実世界の観測・取引から得られる (業務・設計・IoT等)。プライバシー・営業秘密の障壁が高い |
| 合成データ | モデル・統計的手法で人工生成。再帰利用による**モデル崩壊問題**リスク |

両者は**トレードオフではなく相互補完**であり、再帰汚染を最小化するデータ戦略のデザインが不可欠。

### リアルデータにおけるダークデータの比率 (NEDO, 2025)

- 2025年時点で年間リアルデータ量は**約 175 ZB** (うち消費者由来 ~71 ZB、エンタープライズ由来 ~104 ZB)。
- 複製除去後の有効量は**約 17.5 ZB**。このうち**約 16 ZB がインターネット非公開の「ダークデータ」として企業内に滞留**。
- 潜在的な学習・推論資源として価値を持つが、偏り・品質汚染・目的不整合により、そのままでは利用に供せない。

### GIGOとドメインコンテクスト

- 学習・推論の最大の障壁は「量ではなく品質」。利用目的と整合しないデータは **Garbage-In, Garbage-Out (GIGO)** を招く。
- 品質は組織内の自律的な責任単位である **「ドメイン (Domain)」** に依存。
- **コンテクスト** (目的・運用・慣行などの明示的/暗黙的文脈) はドメイン単位で分散して存在し、横断的な均質化は困難。
- Agentic AI時代のデータマネジメントで考えるべき論点:
  1. ダークデータに**どうドメインコンテクストを付与するか**
  2. コンテクスト付きデータを**将来キャッシュフローを生む経営資本**にできるか
  3. **企業・国境を横断して分散する**データとコンテクストをどう管理するか

> **結論**: コンテクストはAgentic AI時代のデータの本質であり、ドメイン固有の財産。「ソフトウェアが企業価値を定義し、データがソフトウェアの競争優位を規定する」 **"Data is Eating the World"** において、本質的な生存戦略となる。

### 用語: ODS と Open Dataspaces の区別

| 表記 | 意味 |
|------|------|
| **Open Data Spaces (ODS)** | 固有名称。IPAが設計統括する技術コンセプト |
| **Open Dataspaces** | 一般技術名称。Classical Dataspaces + データメッシュ を源流とする新世代分散データマネジメント技術群 |

欧州の Fraunhofer 系 International Data Spaces / Eclipse Data Spaces とは**出自の異なる別系統**。

---

## 1. 集約から分散へ: パラダイム変遷

### ビッグデータの3Vs から Complexity へ (図5)

- 2001年 Doug Laney の「3Vs」: Volume → Variety → Velocity の順に技術課題が変遷。
  - Volume: Hadoop/HDFS, Amazon S3 (~2004-06)
  - Variety: NoSQL (MongoDB, Redis, Cassandra), JSON, データカタログ/ETL (~2009)
  - Velocity: Kafka, Flink, Spark (~2012)
- 現在の主要課題は **Complexity**。技術だけでなく産業・組織・法制度・契約を含む多面的な問題。

### データマネジメントシステムの世代 (図6)

DBMS → **Data Warehouse (DWH)** (第1世代) → **Data Lake (DL)** (第2世代) → **Data Lakehouse (DLH)** (第3世代)。世代を経るごとにAI親和性が向上。Time to Value (TtV) 改善に寄与。

### Push and Ingest の限界とデータメッシュ (図7・8)

- 伝統的アプローチは**「集約 (Aggregation) / Push and Ingest」**から脱却できず、多ドメイン環境で**スケーラビリティの限界**。
- これに対し Zhamak Dehghani が2019年に提唱した **データメッシュ** は **「Serving and Pull」** 型の分散型社会技術的アプローチ。
- **データメッシュの4原則**:
  1. **Domain Ownership**
  2. **Data as a Product**
  3. **Self-Serve Data Platform**
  4. **Federated Computational Governance**

> 最大の功績は「データの責任を中央基盤からドメインへ戻した」こと。これにより **Biz/Dev/Ops の融合**が組織設計の最適解となる (図9)。

### ただし…データメッシュの限界

- 組織**内**の部門間連携を暗黙の前提としており、**組織境界を越えた Governance Complexity** には十分答えられない。
- Governance Complexity は (1) 技術 (2) 組織 (3) 権利 の3側面が絡み合う。
- これが Classical Dataspaces 概念への回帰につながる。

---

## 2. 部門間から組織間へ: Classical Dataspaces 誕生の背景

### Classical Dataspaces (Franklin et al., 2005; Halevy et al., 2006)

UC Berkeley / Google / Portland State University によって提唱された、**DBMSを補完**する新たな抽象化。

- 解くべき課題:
  1. **アーキテクチャとしての問題**: すべてのデータをDBMSや単一データモデルに適合させることが困難に。
  2. **開発者が直面する問題**: 検索・クエリ・整合性・来歴・アクセス制御などの低水準データマネジメントを、異質なデータコレクション (HCoD) に都度対処する必要。
- 定義上のポイント:
  - データスペースは**参加者 (data sources)** と**関係 (relationships)** で定義される
  - 構造化・半構造・非構造いずれも許容
  - ネスト・重複を許し、空間として多層的に存在
  - 境界は流動的でもよい

### Open Dataspaces が Classical Dataspaces / データメッシュから継承したもの (図11・12)

- **データメッシュの4原則とパラダイム (Serving and Pull / DDD)** を承継。
- **Classical Dataspaces の "空間" としての抽象化**を承継。
- 拡張ポイントは **部門間 (Inter-Department)** から **組織横断 (Inter-Organization)** への対象拡大。
- G20大阪サミット (2019) の **DFFT (Data Free Flow with Trust)** を技術的に具体化するもの。

### 組織横断で顕在化する3つの問題

| 分類 | 内容 | 例 |
|------|------|-----|
| **Where to get** | データがどこにあるか / 同一のものを指すか | Manufacturerの "6AX-10K" と Wholesale の "Robot 10kg Standard Model" |
| **What to mean** | データの意味・他データとの整合性 | 「高度」が標高(MSL)か対地(AGL)か |
| **Who and How to use** | 誰がどう使うか (Agentic AI含む) | このAgentはどの会社運用か、NDA有効か、二次利用可か |

> Open Dataspaces は、**DBMS/DWH/DL/DLH とは対立せず相補的**な位置づけ。

---

## 3. Open Dataspaces の設計指針

### 3つの柱 (図13)

1. **Where to get** → **Data Addressability and Discoverability (DAD)**
2. **What to mean** → **Ontology and Semantic Interoperability (OSI)**
3. **Who and How to use** → **Identity and Usage Control (IUC)**

### 「秩序と緩やかな規律 (Order and Benign Discipline)」

- プロトコルは**疎結合・後方互換性込み**で提供。
- 市場の特性・成熟度に合わせた**段階的導入 / オプトイン** ("Minimal Yet Viable")。
- Classical Dataspaces の **"incremental payoff for incremental investment"** に依拠。

### 設計指針

1. **ベンダーロックイン回避**: マルチクラウド/クラウドレスを前提にしたベンダーフリー設計。
2. **制度的ロックイン回避**: 特定法域の規制要件を技術仕様から明示的に分離。
3. **プロダクトライクでサービス志向**: PMFを志向。硬直的仕様は市場に拒絶される。"Make Money, Save Money" を重視。

> **注意**: 「Open」はデータをインターネット公開する意味ではなく、**ベンダー/制度ロックインからの開放**とグローバル相互運用性を指す。

---

## 4. アーキテクチャパラダイムの最小単位: Double-Product Quanta Model (DPQM)

### DPQM の定義 (図14)

- Architectural Quanta (AQ) = 分散データマネジメントアーキテクチャの最小構成単位。
- データメッシュの AQ は Data Product のみ。
- Open Dataspaces は **Ontology Product** を新たに導入し、Data Product と併せてAQ構成単位とする = **DPQM**。
- これがデータメッシュとの最大差分であり、**パラダイムシフト**を名乗る所以。

### Open Dataspaces が置く3つの前提 (Assumptions)

1. データ提供者は**自己宣言的**にデータを提供する
2. 提供者は**不完全/発展途上**の記述を提供するが、不完全性で排除しない
3. データ利用者は**信頼性・完全性・一貫性の明示的保証**を求める

### OWA と CWA の二層構造 — DPQM最大の強み

| 層 | 仮説 | 対応概念 |
|----|-----|---------|
| Ontology Product | **OWA (Open World Assumption)**: 判断できないことは偽とみなさない | 多様性包摂、結果整合性 (Eventual Consistency) |
| Data Product | **CWA (Closed World Assumption)**: 判断できないことは偽 | 厳格性、強い一貫性 (Strong Consistency) |

- 航路情報検索 → OWA的 (結果整合性)
- 運航管理 (衝突防止のための飛行計画同期) → CWA的 (強い一貫性)
- **Schema Flexible**: インスタンス先行で意味を後付けする方針。RDBMS (Edgar Codd) のCWA前提から脱却。

### 基本用語と関係性 (図15・16)

- **An Open Dataspace** = 2以上のAQで構成される **Architectural Quantum (AQM)**。
  - 例: 卸売物品AQ + 物流倉庫AQ = Wholesale Distribution Dataspace
- 多元的・重層的集合の総体 = **Open Dataspaces (The Open Dataspace)**。
- AQは論理的に4つの Functional Layer に分解され、OSI/DAD/IUC が対応付けられる (ODS-RAM を参照)。

---

## 5. 柱1: Ontology and Semantic Interoperability (OSI)

### Data Model と Information Model の分離 (図17)

| モデル | 役割 | 特性 |
|--------|------|------|
| **Data Model** | 業務データ/センサー値/ログ等、観測事実の構造表現。DBMSのスキーマ・テーブル相当 | 過去に遡って変更しない |
| **Information Model (広義: Ontology)** | 事実の解釈・関連付け・制約・操作の意味表現 | 運用変化に応じ更新可能 |

- 両者を混在させる従来設計では、**意味の変更=スキーマ変更**となり、過去データ・アプリ・分析ロジックに連鎖的影響。
- Ontologyを分離すると、**既存データを破壊せずに意味を拡張・再解釈**できる。

### 技術スタック (Semantic Web)

| AQ | Data Product | Ontology Product |
|----|-------------|-------------------|
| Level | Data Model | Information Model / Semantics / Ontology |
| 表現 | 任意のMultiModal Raw Data | RDF / RDF* | RDF Schema | OWL |
| 目的 | Reflecting Reality | Knowledge Unit | Vocabulary and Structure | Validation and Reasoning |

### Semantic Gap → Ontological Gap と "Dynamic Ontology" (図18・19)

- **Semantic Gap**: 「高度=MSLかAGLか」のような意味不整合。情報モデル分離+Ontology宣言で**論理的不整合として検出**できる。
- **Ontological Gap**: Ontology同士のギャップ。組織・国境横断時に増大。
- 解決策: **LLMによるクロスウォーク (マッピング仮説提示) × Ontology構造による検証・制約**。
- これを **Dynamic Ontology** と命名。Hypothetical queries等にも有用。

> **"Graph is Context"** — AIに与えるべきコンテクストはグラフ。Open Dataspaces は**「推測(Guess)から知識(Knowledge)」**へのパラダイムシフト。

### 留意点

- **"A Little Semantics Goes a Long Way"** — Ontology運用を膨大な作業と捉える必要はない。
- OWL は意味的矛盾を検出できるが、**未宣言情報を不整合として扱うことはできない**。
- 不足検出には**SHACL**などCWA的検証が必要だが、強制はOWAの発想と相容れない。
- この解決策が**2段階クエリ**(次章)。

---

## 6. 柱2: Data Addressability & Discoverability (DAD)

### Data Addressability = 「存在」と「同一性」の保証 (図20・21・22)

- **Addressabilityを欠いたデータは存在しないのと同義**。
- 2つの独立したエンドポイント:
  - **Ontology Endpoint** (玄関口) — **IRI (International Resource Identifier)** で**グローバルユニーク**に識別
  - **Data Endpoint** (データ取得用)
- IRI はドメイン固有の内部識別子を**否定せず温存しつつ**、相互参照可能な土台を提供。
- 例 (産業用ロボット):
  - Manufacturer "6AX-10K Industrial Robot" / Wholesale "Robot 10kg Standard Model" / Logistics "Pallet#12345 /SKU-ROB-10KG-JP" を IRI で紐付け、返品・リコール・保守契約・多言語対応を横断可能に。

### Discoverability = 2段階クエリによる動的データカタログ (図23・24・25・26)

| クエリ | 役割 |
|--------|------|
| **Ontology Query (第1段階)** | キーワードに対し Best Effort Result を返す "Everything query" |
| **Data Query (第2段階)** | Best Effort グラフを足がかりにData Endpointへアクセス |

- **データカタログは静的リポジトリではなく、クエリ依存で都度生成される動的ビューワー**。
- **分散カタログ (Distributed Catalog)**: Web検索エンジンをモデルにしたOntologyのクローリング+インデキシング。
- **ディスカバリーサービス (Discovery Service)**: 分散カタログ+最初のOntology Endpoint発見機能。
- Ontology自体が企業秘密であるケースが多いため、**Ontology Product にもIUCが適用される**。

### 補論: Data Trust と Data Trustworthiness (オプショナルプロトコル)

- **Data Trust Assessment Protocol**: データの完全性・リネージュを第三者が検証できるインターフェース。
- **Data Trustworthiness and Quality Assessment Protocol**: SLOベースの品質指標を第三者検証できるインターフェース。Great Expectations的な動的品質管理も想定。
- **統一基準は非現実的**であるため、プロトコルは「余白」のみ残し、第三者監査の余地を確保。

---

## 7. 柱3: Identity and Usage Control (IUC)

### Trust by Design (図27)

単一組織では暗黙だった「信頼」が、分散環境では前提として成立しない:

- 組織境界の流動性 (保守委託先の変更、合弁会社 等)
- 主体の同一性の非自明性 (Aliceが複数法人の立場を持つ)
- 認証済=信頼可ではない (NDA失効、契約終了など)

そこで、**信頼を前提ではなく設計対象とする (Trust by Design)**。Identity Layer (L3) から**Trust Perspective を横断的パースペクティブとして明示的に分離**。

### Identity の3要素

| 要素 | 責務 |
|------|------|
| **実在性の検証 (Identity Proofing)** | 現実世界のどの個人・組織に対応するか |
| **認証 (Authentication)** | 主張するアイデンティティの所有者であるか |
| **認可 (Authorization)** | この主体は、この資源に、今、この操作をしてよいか |

- **単一の信頼性根拠を強制しない** — 法域・業界ごとの慣行差を許容する (制度的ロックイン回避)。
- **Non-Human Identity** (Agentic AI の主体) にも適用される設計。

### アクセス制御: Graph-to-Graph Control (図28・29)

- ゼロトラスト前提で **PEP/PDP モデル** (Policy Enforcement/Decision Endpoint) を採用。
  - PEP: Data/Ontology Product の API ゲートウェイやクエリサーバーに配置
  - PDP: ドメインごとにポリシーエンジンとして配置
  - 監査・運用俊敏性・多層強制を実現
  - 標準化活動として **AuthZEN** が進行中
- 認可モデルは **ReBAC (Relationship-Based Access Control)** を採用 (RBAC/ABACも排除しない)。
- **Graph-to-Graph Control** の真価:
  - AliceのIRIから、所属・NDA・権限をPDPが**推測ではなく推論 (infer)**
  - 資源AのIRIからOntologyを推論し、適切範囲のグラフにアクセス付与
  - Alice が人間/クローラー/Agentic AI いずれでも代替可能
- Ontology の役割は**意味的境界の定義**であり、認可判断そのものは行わない — 意味拡張が意図せずアクセス範囲を拡大することを防ぐ。

### 利用制御 (Usage Control)

> **定義** (Steinbuss et al., 2021): *"the specification and enforcement of restrictions regulating what must(not) happen to data"* — Provisions と Obligations を司る。

- Classical Dataspaces には存在せず、Open Dataspaces で**後付け導入**された概念。
- 理由は2つの非対称性の補正:
  1. **権利義務関係の非対称性**: 一度アクセスを許すと用途・条件を制御できない
  2. **価格決定権の非対称性**: 自己宣言+市場原理のままだと、利用者有利の価格・条件が常態化し、**高品質データ提供者の参入を阻害し市場失敗**を招く

### 利用制御の多様な技術手段 (図31) — **単一プロトコル固定はしない**

- BI/DI領域: ブロックチェーン型秘密計算 (サプライチェーン横断カーボンフットプリント等)
- AI領域: Data Clean Room + 差分プライバシー学習
- 先端: Machine Unlearning
- Contract Negotiation はあくまで選択肢のひとつ。制度要件由来の強制は適合コスト過大を招く。

### 補論: 電子契約 / 精算・課金

| オプショナルプロトコル | 内容 |
|----------------------|------|
| **Heuristic Contracting Protocol** (図32・33) | サードパーティ電子契約サービスとの接続IF。契約締結結果をPDPに反映。**機械完結に固執せず Human-in-the-loop も許容** (法務部などの最終判断)。UN/CEFACTの e-Negotiation 知見を踏まえる。 |
| **Clearing and Payment Protocol** (図34) | データ利用に対する精算・課金/決済のエンドポイント。データマーケットプレイスを実現可能に。 |

共通機能として、**トランザクションの横断ログ・モニタリング** (Common Functionality) を位置付け、高度なイベント検知・アラートの余地を残す。

---

## 8. サービスモデル

### 2つの実装パターン (図35)

| モデル | 主体 | 対象 |
|-------|------|------|
| **分散型サービスモデル** | ドメインオーナー自身が Self-Serve Data Platform を構築 | 大企業 (デジタル財源あり) |
| **連邦型サービスモデル** | **Dataspace Service Provider (DSSP)** がマネージドで基本ソフトウェアスタックを提供。ドメインオーナーはProduct提供に責任 | 中小企業含む幅広い主体 |

両方の混成 = **Hybrid Service Model (HSM)**。

### DSSP の特徴 (Franklin et al. 2005 の定義を踏襲)

- 多様なフォーマット・システム・インターフェースの全データをサポート
- ホストシステム側のネイティブインターフェースも併用でき、データへのフルコントロールは持たない
- Best Effort / Approximate answer を返す柔軟性
- より緊密な統合のためのツールを提供

### 実例

**車載蓄電池のトレーサビリティ管理** — OEM/Tier1に供給するTier2以降の中小企業比率が高いため、自動車・蓄電池業界が共同設立した中立サービス運営事業体が DSSP として **蓄電池CFPデータ** のマネージドサービス提供を開始。

---

## おわりに

- Open Dataspacesの中核コンポーネントは市場実証・商用検証を終え、**メジャーリリースに近い状態**。
- 今後は**スケーラブルかつ持続的な発展**が社会実装の鍵。
- **"伽藍とバザール"** の理念に基づき、全世界のOSSコミュニティの力で前進させる方針。
- 現時点で技術仕様・コンポーネントは **Living Document / Living Source** であり、改善余地を含む。
- 特定ベンダーや規制当局のロジックから切り離し、**グローバルで民主的なプロセス**での管理を志向。
- 参加・協力の呼びかけ: IPA デジタルアーキテクチャ・デザインセンター (`dadc-ods-ml@ipa.go.jp`)。

### 関連成果物

- **ODS-RAM** (Reference Architecture Model)
- **ODS Protocols** (技術仕様)
- **ODS Middleware** (参照実装OSS)
- Ouranos Ecosystem Dataspaces Reference Architecture Model (METI/IPA, 2025)

---

## 重要な結論と発見 (ハイライト)

1. **2026年は「データ枯渇元年」**: 高品質データが2026-2032年に枯渇見通し。企業内16 ZBのダークデータ活用が次のフロンティア。
2. **コンテクストはデータの本質であり、ドメイン固有の財産**: Agentic AI時代の競争優位を規定する経営資本。
3. **DPQM (Data Product + Ontology Product) はパラダイムシフトの核**: OWA + 選択的CWA の二層構造が、データ提供者と利用者の期待値の非対称性を埋める。
4. **"Guess → Knowledge" への移行**: LLM + Ontology による Dynamic Ontology で、推測に依存しない関係推論を実現。
5. **Graph-to-Graph Control** が Agentic AI時代のアクセス制御の鍵。Non-Human Identity にも適用可能。
6. **利用制御は必須だが手段は多様** — 単一技術への固定化は市場失敗リスクを高める。
7. **「緩やかな規律」**: プロトコルは疎結合・オプトイン・後方互換性込み。Minimal Yet Viable。
8. **"Open" = 公開ではなく、ベンダー/制度ロックイン回避とグローバル相互運用性**。

## 制限事項・留意点 (本文で明示されているもの)

- 本書は設計思想レベルの提示であり、**具体設計は ODS-RAM / ODS Protocols / ODS Middleware に委譲**。
- 技術仕様・コンポーネントは**Living Document** であり改善余地あり。
- **欧州の Dataspaces 系技術仕様 (IDS/EDC 等) とは異なる指針**で設計されている。
- **OWL は OWA 前提のため、未宣言情報の不足検出は不可**。SHACL等のCWA的検証は別途必要だが、強制はOpen Dataspaces の発想と相容れない。
- **機械完結型の契約交渉は現時点で非現実的** — Human-in-the-loop の許容が必要。
- **Ontologyの品質は市場原理で淘汰される**前提であり、ドメインオーナーの Human-in-the-loop での暗黙知形式知化がスケーラビリティ実現に重要。

## 主要参考文献

- Franklin M, Halevy A, Maier D. (2005). *From databases to dataspaces: a new abstraction for information management.*
- Halevy A, Franklin M, Maier D. (2006). *Principles of Dataspace Systems.*
- Dehghani Z. (2019/2022). *Data Mesh: Delivering Data-Driven Value at Scale.* O'Reilly.
- Epoch AI. (2024). *Will We Run Out of Data? Forecasting Dataset Size for Language Models.*
- NEDO. (2025). *Market Size Study of Data Spaces and Impact Modeling & Scenario Analysis Report.*
- Otto B. et al. (2016). *WHITEPAPER: Industrial Data Space.* Fraunhofer.
- Steinbuss S. et al. (2021). *Usage Control in the International Data Spaces.* IDSA.
- Y. Tina Lee. (1999). *Information modeling from design to implementation.* NIST.
- Digital Agency. (n.d.). *Overview of DFFT.*
