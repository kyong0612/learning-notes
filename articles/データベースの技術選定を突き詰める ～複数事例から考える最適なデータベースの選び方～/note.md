---
title: "データベースの技術選定を突き詰める ～複数事例から考える最適なデータベースの選び方～"
source: "https://speakerdeck.com/nnaka2992/detabesunoji-shu-xuan-ding-wotu-kijie-meru-fu-shu-shi-li-karakao-eruzui-shi-nadetabesunoxuan-bifang"
author:
  - "nnaka2992"
published: 2025-05-13
created: 2025-05-14
description: |
  2025年5月14日に開催された【技術選定を突き詰める】Online Conferenc​​e 2025の公募LT登壇資料です。サービスのメインのデータベースがあるときに、パーパスビルドでデータベースを採用すべきか？メインのデータベースにまとめるべきか？という疑問に対して事例ベースで最適なデータベースの選び方を紹介します。
tags:
  - "clippings"
  - "データベース"
  - "技術選定"
  - "PostgreSQL"
  - "BigQuery"
  - "Redis"
  - "Oracle"
  - "アーキテクチャ"
---

## 本資料の要約

本資料は、株式会社スリーシェイクの中楯直希氏による、データベース技術選定に関する発表です。既存のメインデータベースがある場合に、特定の目的に特化した「パーパスビルド」のデータベースを追加で採用すべきか、あるいはメインデータベースに機能をまとめるべきかについて、複数の事例を基に考察しています。

### 発表者について

* **氏名:** 中楯 直希 (なかだて なおき)
* **所属:** 株式会社スリーシェイク Sreake事業部
* **エイリアス:** nnaka2992, nkDATE
* **業務内容:** DBRE兼SRE見習い、自称データ雑用係
* **興味:** DBのKubernetesへの移行、SRE関連技術、データベース全般
* **実績:** Google Cloud Partner Top Engineer 2025 Data Management

### はじめに: 本資料の目的 (スライド3)

* サービスの主要データベースが存在する状況で、以下の問いに事例ベースで答える。
  * パーパスビルドで別のデータベースを採用すべきか？
  * メインのデータベースに機能を統合すべきか？

### はじめに: 注意点 (スライド4)

* 守秘義務のある事例を含むため、内容は一部ぼかしたり改変されている。
* 紹介事例は主にリレーショナルデータベース(RDB)を利用したもの。

### アジェンダ (スライド5)

1. Oracle DatabaseとRedisを組み合わせた超低レイテンシ事例
2. PostgreSQLとBigQueryを組み合わせたアクセス数集計事例
3. PostgreSQLとpg_bigmを利用した全文検索事例
4. まとめ

---

### 1. Oracle DatabaseとRedisを組み合わせた超低レイテンシ (スライド6-8)

* **概要:** オンラインゲームにおける、レイテンシが非常に重要なランキング機能の事例。
* **環境:** オンプレミス。
* **要件:**
  * 低レイテンシ (1桁ms未満)
  * リアルタイム性 (バッチ処理不可)
* **課題:**
  * オンプレミス環境のため、Oracle DB自体のスケールアウトによる強化は困難。
* **ポイント:**
  * 組織内にRedisの利用実績があり、採用のハードルが低い。
* **最終アーキテクチャ:**
  * ランキングデータ: Redisに保存し、アクセスもRedis経由。
  * ランキング対象のイベントデータ: Oracle Databaseに永続化。
  * クライアントはサーバー経由で各種データアクセス、ランキングデータの集計と取得を行う。

    ```mermaid
    graph LR
        Clients --> Server
        Server --> Oracle_DB[Oracle DB]
        Server --> Redis
        Oracle_DB -- ランキング対象データの永続化 --> Server
        Redis -- ランキングデータの集計と取得 --> Server
    ```

### 2. PostgreSQLとBigQueryを組み合わせたアクセス数集計 (スライド9-11)

* **概要:** PostgreSQLをバックエンドとするSaaSにおける、ページ毎のアクセス数集計事例。
* **環境:** Cloud Run x Google Cloud for PostgreSQL。
* **要件:**
  * コストを抑え、シンプルな構成を維持したい。
  * アクセス数のリアルタイム性は必須ではない (1時間ごとの更新で十分)。
* **ポイント:**
  * 新規コンポーネント追加 (メッセージキューや新規DB) は避けたい。
  * Google Analytics 4 (GA4) のデータがBigQueryに既にシンクされており、集計に適したデータが利用可能。
* **最終アーキテクチャ:**
  * GA4のデータをBigQueryで集計。
  * 集計結果をCloud Storage経由でPostgreSQLにアップロード。
  * クライアントはCloud Run (Frontend) を通じ、Cloud Run (Backend) 経由でCloud SQL (PostgreSQL) のアクセスデータにアクセス。BigQueryとGA4がデータソースとして連携し、Workflowsがデータコピーを制御。

    ```mermaid
    graph TD
        Clients --> Cloud_Run_Frontend[Cloud Run (Frontend)]
        Cloud_Run_Frontend --> Cloud_Run_Backend[Cloud Run (Backend)]
        Cloud_Run_Backend --> Cloud_SQL[Cloud SQL for PostgreSQL]
        
        subgraph "データ集計フロー"
            Google_Analytics_4[Google Analytics 4] --> BigQuery
            BigQuery -- 集計 --> Workflows_App[Workflows]
            Workflows_App -- アクセスデータをコピー --> Cloud_Storage[Cloud Storage]
            Cloud_Storage --> Cloud_SQL
        end
    ```

    *(スライド11の図を参考に修正・補足)*

### 3. PostgreSQLとpg_bigmを利用した全文検索 (スライド12-14)

* **概要:** PostgreSQLをバックエンドとするSaaSにおける、文書検索機能のパフォーマンス改善事例。
* **環境:** Cloud Run x Google Cloud for PostgreSQL。
* **課題:** 既存の文書検索機能の検索速度。
* **ポイント:**
  * 文書データはPostgreSQLに保存されており、データ二重管理は避けたい。
  * 既存のコードベースが小さくない。
  * 検索要件は完全一致検索のみで、高度な機能は不要。
  * 組織内に検索特化型DBの運用ノウハウがなく、運用コストを考慮すると採用に消極的。
* **最終アーキテクチャ:**
  * 新規コンポーネントは追加しない。
  * PostgreSQLの拡張機能である `pg_bigm` を利用し、完全一致検索用のインデックスを作成して対応。

    ```mermaid
    graph LR
        Clients --> Cloud_Run_Frontend[Cloud Run (Frontend)]
        Cloud_Run_Frontend --> Cloud_Run_Backend[Cloud Run (Backend)]
        Cloud_Run_Backend --> Cloud_SQL_pg_bigm[Cloud SQL for PostgreSQL (pg_bigm)]
    ```

### まとめ (スライド15)

* **ソリューションありきの選定ではなく、真の要件に基づいた選定が重要。**
* **組織のケイパビリティ (技術力、運用体制など) によって最適な選択肢は常に変化する。**
* **要件に応じてデータベースを選定することが最も大事。**
  * 必須ではない要件を削ることで、新たな最適な選択肢が見つかることもある。

---

## More Decks by nnaka2992

[

Google Cloud Next 2025 DM Recap ～DM領域PTEが贈る注目リリース～

](<https://speakerdeck.com/nnaka2992/google-cloud-next-2025-dm-recap-dmling-yu-ptegazeng-ruzhu-mu-ririsu> "Google Cloud Next 2025 DM Recap ～DM領域PTEが贈る注目リリース～")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

74

[

データベースエンジニアの仕事を楽にする。PgAssistantの紹介

](<https://speakerdeck.com/nnaka2992/tetahesuensinianoshi-shi-wole-nisuru-pgassistantnoshao-jie> "データベースエンジニアの仕事を楽にする。PgAssistantの紹介")

[nnaka2992](https://speakerdeck.com/nnaka2992)

9

4.7k

[

Google Cloudとo11yで実現するアプリケーション開発者主体のDB改善

](<https://speakerdeck.com/nnaka2992/google-cloudtoo11ydeshi-xian-suruapurikesiyonkai-fa-zhe-zhu-ti-nodbgai-shan> "Google Cloudとo11yで実現するアプリケーション開発者主体のDB改善")

[nnaka2992](https://speakerdeck.com/nnaka2992)

1

260

[

データベースのオペレーターであるCloudNativePGがStatefulSetを使わない理由に迫る

](<https://speakerdeck.com/nnaka2992/detabesunooperetadearucloudnativepggastatefulsetwoshi-wanaili-you-nipo-ru> "データベースのオペレーターであるCloudNativePGがStatefulSetを使わない理由に迫る")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

340

[

CloudNativePGを布教したい

](<https://speakerdeck.com/nnaka2992/cloudnativepgwobu-jiao-sitai> "CloudNativePGを布教したい")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

270

[

CloudNativePGがCNCF Sandboxプロジェクトになったぞ！ 〜CloudNativePGの仕組みの紹介〜

](<https://speakerdeck.com/nnaka2992/cloudnativepggacncf-sandboxpuroziekutoninatutazo-cloudnativepgnoshi-zu-minoshao-jie> "CloudNativePGがCNCF Sandboxプロジェクトになったぞ！ 〜CloudNativePGの仕組みの紹介〜")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

330

[

KubeCon NA 2024の全DB関連セッションを紹介

](<https://speakerdeck.com/nnaka2992/kubecon-na-2024noquan-dbguan-lian-setusiyonwoshao-jie> "KubeCon NA 2024の全DB関連セッションを紹介")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

170

[

GoogleとOracle：この二人は友達になれました～GKEでOraOperatorを動かそう～

](<https://speakerdeck.com/nnaka2992/googletooracle-konoer-ren-hayou-da-ninaremasita-gkedeoraoperatorwodong-kasou> "GoogleとOracle：この二人は友達になれました～GKEでOraOperatorを動かそう～")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

73

[

Kubernetes上でOracle\_Databaseの運用を楽にするOraOperatorの紹介

](<https://speakerdeck.com/nnaka2992/kubernetesshang-deoracle-databasenoyun-yong-wole-nisuruoraoperatornoshao-jie> "Kubernetes上でOracle_Databaseの運用を楽にするOraOperatorの紹介")

[nnaka2992](https://speakerdeck.com/nnaka2992)

0

280

## Other Decks in Programming

[

はじめてのPDFKit.pdf

](<https://speakerdeck.com/shomakato/hasimetenopdfkit-e4f08412-c6d2-4d89-ba82-958036d59f63> "はじめてのPDFKit.pdf")

[shomakato](https://speakerdeck.com/shomakato)

0

100

[

Rubyの!メソッドをちゃんと理解する

](<https://speakerdeck.com/alstrocrack/rubyno-mesotudowotiyantoli-jie-suru> "Rubyの!メソッドをちゃんと理解する")

[alstrocrack](https://speakerdeck.com/alstrocrack)

1

260

[

エンジニアが挑む、限界までの越境

](<https://speakerdeck.com/nealle/enziniagatiao-mu-xian-jie-madenoyue-jing> "エンジニアが挑む、限界までの越境")

[nealle](https://speakerdeck.com/nealle)

1

330

[

VibeCoding時代のエンジニアリング

](<https://speakerdeck.com/daisuketakeda/vibecodingshi-dai-noenziniaringu> "VibeCoding時代のエンジニアリング")

[daisuketakeda](https://speakerdeck.com/daisuketakeda)

0

150

[

Cursor/Devin全社導入の理想と現実

](<https://speakerdeck.com/saitoryc/devinquan-she-dao-ru-noli-xiang-toxian-shi> "Cursor/Devin全社導入の理想と現実")

[saitoryc](https://speakerdeck.com/saitoryc)

29

22k

[

監視 やばい

](<https://speakerdeck.com/syossan27/jian-shi-yabai> "監視 やばい")

[syossan27](https://speakerdeck.com/syossan27)

12

10k

[

RuboCop: Modularity and AST Insights

](<https://speakerdeck.com/koic/rubocop-modularity-and-ast-insights> "RuboCop: Modularity and AST Insights")

[koic](https://speakerdeck.com/koic)

3

2.7k

[

Jakarta EE Meets AI

](<https://speakerdeck.com/ivargrimstad/jakarta-ee-meets-ai-642ac9a3-091c-4452-b439-e7a0ea555569> "Jakarta EE Meets AI")

[ivargrimstad](https://speakerdeck.com/ivargrimstad)

0

870

[

Embracing Ruby magic

](<https://speakerdeck.com/vinistock/embracing-ruby-magic> "Embracing Ruby magic")

[vinistock](https://speakerdeck.com/vinistock)

2

220

[

開発者フレンドリーで顧客も満足？Platformの秘密

](<https://speakerdeck.com/algoartis/aatechtalk-1-1> "開発者フレンドリーで顧客も満足？Platformの秘密")

[algoartis](https://speakerdeck.com/algoartis)

0

210

[

Boost Your Performance and Developer Productivity with Jakarta EE 11

](<https://speakerdeck.com/ivargrimstad/boost-your-performance-and-developer-productivity-with-jakarta-ee-11-dd52f216-e81a-4ca8-9359-d4577a669047> "Boost Your Performance and Developer Productivity with Jakarta EE 11")

[ivargrimstad](https://speakerdeck.com/ivargrimstad)

0

840

[

Lambda(Python)の リファクタリングが好きなんです

](<https://speakerdeck.com/komakichi/toranomon-tech-hub-di-san-hui> "Lambda(Python)の リファクタリングが好きなんです")

[komakichi](https://speakerdeck.com/komakichi)

5

270

## Featured

[

Reflections from 52 weeks, 52 projects

](<https://speakerdeck.com/jeffersonlam/reflections-from-52-weeks-52-projects> "Reflections from 52 weeks, 52 projects")

[jeffersonlam](https://speakerdeck.com/jeffersonlam)

349

20k

[

Automating Front-end Workflow

](<https://speakerdeck.com/addyosmani/automating-front-end-workflow> "Automating Front-end Workflow")

[addyosmani](https://speakerdeck.com/addyosmani)

1370

200k

[

"I'm Feeling Lucky" - Building Great Search Experiences for Today's Users (#IAC19)

](<https://speakerdeck.com/danielanewman/im-feeling-lucky-building-great-search-experiences-for-todays-users-number-iac19> "\"I'm Feeling Lucky\" -  Building Great Search Experiences for Today's Users (#IAC19)")

[danielanewman](https://speakerdeck.com/danielanewman)

227

22k

[

Distributed Sagas: A Protocol for Coordinating Microservices

](<https://speakerdeck.com/caitiem20/distributed-sagas-a-protocol-for-coordinating-microservices> "Distributed Sagas: A Protocol for Coordinating Microservices")

[caitiem20](https://speakerdeck.com/caitiem20)

331

21k

[

\[RailsConf 2023 Opening Keynote\] The Magic of Rails

](<https://speakerdeck.com/eileencodes/the-magic-of-rails> "[RailsConf 2023 Opening Keynote] The Magic of Rails")

[eileencodes](https://speakerdeck.com/eileencodes)

29

9.5k

[

Intergalactic Javascript Robots from Outer Space

](<https://speakerdeck.com/tanoku/intergalactic-javascript-robots-from-outer-space> "Intergalactic Javascript Robots from Outer Space")

[tanoku](https://speakerdeck.com/tanoku)

271

27k

[

Done Done

](<https://speakerdeck.com/chrislema/done-done> "Done Done")

[chrislema](https://speakerdeck.com/chrislema)

184

16k

[

Templates, Plugins, & Blocks: Oh My! Creating the theme that thinks of everything

](<https://speakerdeck.com/marktimemedia/templates-plugins-and-blocks-oh-my-creating-the-theme-that-thinks-of-everything> "Templates, Plugins, & Blocks: Oh My! Creating the theme that thinks of everything")

[marktimemedia](https://speakerdeck.com/marktimemedia)

30

2.3k

[

Refactoring Trust on Your Teams (GOTO; Chicago 2020)

](<https://speakerdeck.com/rmw/refactoring-trust-on-your-teams-goto-chicago-2020> "Refactoring Trust on Your Teams (GOTO; Chicago 2020)")

[rmw](https://speakerdeck.com/rmw)

34

2.9k

[

Practical Tips for Bootstrapping Information Extraction Pipelines

](<https://speakerdeck.com/honnibal/practical-tips-for-bootstrapping-information-extraction-pipelines> "Practical Tips for Bootstrapping Information Extraction Pipelines")

[honnibal](https://speakerdeck.com/honnibal)

[PRO](https://speakerdeck.com/pro)

19

1.2k

[

Let's Do A Bunch of Simple Stuff to Make Websites Faster

](<https://speakerdeck.com/chriscoyier/lets-do-a-bunch-of-simple-stuff-to-make-websites-faster> "Let's Do A Bunch of Simple Stuff to Make Websites Faster")

[chriscoyier](https://speakerdeck.com/chriscoyier)

507

140k

[

Building Flexible Design Systems

](<https://speakerdeck.com/yeseniaperezcruz/building-flexible-design-systems> "Building Flexible Design Systems")

[yeseniaperezcruz](https://speakerdeck.com/yeseniaperezcruz)

329

39k
