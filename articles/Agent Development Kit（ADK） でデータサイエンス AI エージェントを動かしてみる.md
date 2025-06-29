---
title: "Agent Development Kit（ADK） でデータサイエンス AI エージェントを動かしてみる"
source: "https://zenn.dev/cloud_ace/articles/adk-sample-data-science"
author:
  - "クラウドエース株式会社"
published: 2025-06-27
created: 2025-06-29
description: |
  GoogleのAgent Development Kit (ADK) を使用し、データ分析に特化した`data-science`エージェントの環境構築から動作までを解説する記事。ADKのマルチエージェント設計、柔軟なオーケストレーション、豊富なツールエコシステムといった特徴を紹介し、実際のサンプルコードを通じて、複数の専門エージェントが協調してデータ分析、可視化、機械学習の提案までを行う様子を示します。
tags:
  - "AI"
  - "Google Cloud"
  - "Agent"
  - "AIエージェント"
  - "ADK"
---

## はじめに

近年、AI エージェント技術は目覚ましい進化を遂げています。単一の指示に応答する従来のチャットボットとは異なり、自律的に思考し、計画を立て、複雑なタスクを実行する能力を持つようになりました。

この先進的なエージェント開発を支援するため、Google は、Google Cloud NEXT'25 にて Agent Development Kit (ADK) を発表しました。

本記事では、ADK をこれから利用する開発者の方を対象に、[公式サンプル](https://github.com/google/adk-samples)の中からデータ分析に特化した `data-science` エージェントを取り上げ、その環境構築から実際の動作までを解説します。

## 対象読者

* Google の Agent Development Kit (ADK) の利用を検討している開発者の方
* AI エージェント、特に、マルチエージェントシステムの構築に関心がある方
* Python および Google Cloud の基本的な操作に慣れている方

## ADK（Agent Development Kit）とは

ADK（Agent Development Kit）は、高度な AI エージェントの開発とデプロイを目的とした、オープンソースのフレームワークです。その最大の特徴は、プロトタイプにとどまらず、実際のサービス運用までを見据えた「本番志向」の設計思想にあります。

<https://google.github.io/adk-docs/>

ADK の主要な特徴は以下の通りです。

* **マルチエージェント設計 (Multi-Agent by Design)**
    専門分野の異なる複数のエージェントを協調させ、一つのシステムとして機能させることを基本思想としています。これにより、モジュール性が高く、保守性に優れたアプリケーションの構築が可能になります。
* **柔軟なオーケストレーション (Flexible Orchestration)**
    LLM が自律的に次のアクションを決定するフローと、開発者が定義した順序でタスクを実行するワークフローの両方をサポートします。
* **豊富なツールエコシステム (Rich Tool Ecosystem)**
    Python 関数や Google 検索といった基本的なツールに加え、他のエージェント自体をツールとして再帰的に利用できる、強力な拡張性を備えています。
* **統合された開発体験 (Integrated Development Experience)**
    視覚的な Web UI と強力な CLI を提供し、エージェントの動作をリアルタイムで確認しながら、効率的に開発とデバッグを進めることができます。

## サンプルコードの概要

### `adk-samples`リポジトリ

公式の GitHub リポジトリ [google/adk-samples](https://github.com/google/adk-samples) には、ADK の機能を活用したさまざまなユースケースのサンプルエージェントがすぐに実行可能な形で提供されています。

リポジトリは Python と Java のサンプルで構成されており、そのディレクトリ構造は以下のようになっています。

```
├── java
│   └── agents
│       ├── software-bug-assistant
│       └── time-series-forecasting
├── python
│   └── agents
│       ├── academic-research
│       ├── brand-search-optimization
│       ├── customer-service
│       ├── data-science
│       ├── financial-advisor
│       ├── fomc-research
│       ├── gemini-fullstack
│       ├── llm-auditor
│       ├── marketing-agency
│       ├── personalized-shopping
│       ├── RAG
│       ├── software-bug-assistant
│       └── travel-concierge
└── README.md
```

### データサイエンスエージェント `data-science`

本記事では、このサンプルの中から高度なデータ分析のために設計されたマルチエージェントシステム `data-science` を紹介します。

このシステムは、BigQuery との連携、複雑なデータ操作、データ可視化の生成、そして BigQuery ML（BQML）を用いた機械学習タスクの実行を目的として構築されています。エージェントは、データ分析や探索のためのプロットやグラフなどの視覚的情報だけでなく、テキストによるレスポンスも生成できます。

エージェントは単一の機能で完結するのではなく、以下のように明確な役割を持つサブエージェントとツールで構成されています。

![data-science-architecture](https://res.cloudinary.com/zenn/image/fetch/s--hQPuX9dx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/f06eda6dcb4246a3eb2a9123.png%3Fsha%3Df7b2d58532bcf7a567b463bb4c329d56070b97ad)
*エージェントアーキテクチャ*

* **ルートエージェント `db_ds_multiagent` (マネージャー)**: ユーザーからのリクエストを解釈し、タスクに応じて利用可能なツールを選択・実行したり、サブエージェントに処理を委任したりするオーケストレーターです。
* **データベースエージェント `db_agent` (データ分析)**: 自然言語を SQL に変換し、BigQuery との対話を実行します。
* **データサイエンスエージェント `ds_agent` (可視化担当)**: Python コードを生成・実行し、データの分析やグラフの描画を担当します。
* **BQML エージェント `bq_ml_agent` (機械学習エンジニア)**: BigQuery ML を用いたモデルトレーニングに関する対話を専門とします。

ここで、`bq_ml_agent` は「サブエージェント」として、`db_agent` と `ds_agent` は「エージェント・アズ・ア・ツール」として使用されます。

#### 「サブエージェント」と「エージェント・アズ・ア・ツール」とは

* **サブエージェント (Subagent)**
    ルートエージェントから特定のタスクの実行を **委任（transfer）** されるエージェントです。**独自の判断や複数のステップを要する処理を実行する能力** を持ちます。このアーキテクチャでは、`bq_ml_agent` が機械学習モデルのトレーニングという専門的な役割を担うサブエージェントに該当します。
* **エージェント・アズ・ア・ツール (Agent-as-a-Tool)**
    特定の一機能に特化したエージェントを、**あたかも一つの「ツール」のように呼び出して使用する考え方** です。ルートエージェントは、特定の処理（例：SQL の実行、グラフの描画）が必要になった際に、その機能を持つエージェントをツールとして利用します。このアーキテクチャでは、`db_agent` と `ds_agent` がこれに該当し、それぞれデータベース操作とデータ可視化の「ツール」として機能します。

## データサイエンスエージェントの実行手順

ここからは、実際に `data-science` エージェントをローカル環境で実行するための手順を解説します。

> **Note**
> 本セクションの手順は、2025/06/25 時点の[公式リポジトリ](https://github.com/google/adk-samples/tree/main/python/agents/data-science) `README.md`を抜粋・要約したものです。最新の手順については、公式の`README.md`を参照ください。

> **Note**
> 本記事では、エージェントを Vertex AI Agent Engine にデプロイする手順は紹介しません。デプロイ手順は[公式リポジトリ](https://github.com/google/adk-samples/tree/main/python/agents/data-science)を参照ください。

### 1. 環境構築

まず、エージェントを実行するための開発環境をセットアップします。

**前提となるツールとバージョン:**

| ツール | 必要なバージョン/詳細 | インストール方法 |
| :--- | :--- | :--- |
| Google Cloud Account | 課金が有効なアカウント | [コンソール](https://console.cloud.google.com/) |
| gcloud CLI | 最新版を推奨 | [インストールガイド](https://cloud.google.com/sdk/docs/install) |
| Python | 3.12+ | [公式サイト](https://www.python.org/) |
| Poetry | - | [公式サイト](https://python-poetry.org/docs/#installation) |
| Git | - | [公式サイト](https://git-scm.com/) |

#### ステップ1: Google Cloud プロジェクトのセットアップと認証

Google Cloud（以下、GCP） コンソールで新規プロジェクトを作成し、`Vertex AI API` を有効化します。その後、ターミナルで以下のコマンドを実行し、ローカル環境から GCP への認証を行います。

```
gcloud auth application-default login
```

#### ステップ2: サンプルコードリポジトリのクローン

`adk-samples` リポジトリをローカルにクローンし、`data-science` エージェントのディレクトリへ移動します。

```
git clone https://github.com/google/adk-samples.git
cd adk-samples/python/agents/data-science
```

次に、Poetry を使用して、プロジェクトに必要な Python ライブラリをインストールします。

```
poetry install
```

#### ステップ3: 仮想環境のアクティベート

Poetry が管理する仮想環境を有効化します。

```
poetry env activate
```

#### ステップ4: 環境変数ファイルの設定

提供されている`.env.example`ファイルをコピーし、自分用の環境変数ファイル`.env`を作成します。

```
cp .env.example .env
```

作成した`.env`ファイルを開き、`GOOGLE_CLOUD_PROJECT`と`GOOGLE_CLOUD_LOCATION`をご自身の環境に合わせて設定してください。

```
# .env ファイルの例
# Vertex AIをバックエンドとして使用する: 1
GOOGLE_GENAI_USE_VERTEXAI=1

# Vertex AIの設定
GOOGLE_CLOUD_PROJECT='YOUR_GCP_PROJECT_ID'
GOOGLE_CLOUD_LOCATION='us-central1'

# BigQueryの設定
BQ_PROJECT_ID='YOUR_GCP_PROJECT_ID'  # GOOGLE_CLOUD_PROJECT と同じでもOK
BQ_DATASET_ID='forecasting_sticker_sales'
```

##### ステップ5: BigQuery へのサンプルデータ投入

このエージェントは、[Kaggle の「ステッカー売上予測」データセット](https://www.kaggle.com/competitions/playground-series-s5e1)を使用します。以下のコマンドを実行することで、サンプルデータが自動的に GCP プロジェクトの BigQuery にアップロードされます。

```
python3 data_science/utils/create_bq_table.py
```

`BigQuery` のコンソール画面を確認すると、`forecasting_sticker_sales` データセットと `train` `test` テーブルが作成されていることがわかります。

![bq_forecasting_sticker_sales](https://res.cloudinary.com/zenn/image/fetch/s--04VC9j2V--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/409af5c06da3169f31cea67a.png%3Fsha%3Db5dea2f4e2644599de6fc914e98a4c49486fe04f)
*forecasting\_sticker\_sales train テーブル*

##### ステップ6: BQML エージェント用 RAG のセットアップ

BQML エージェントは、Vertex AI の `RAG Engine` を利用して BigQuery ML の公式リファレンスを検索します。以下のコマンドで、そのための RAG コーパスをプロジェクトに作成します。

```
python3 data_science/utils/reference_guide_RAG.py
```

コーパスが作成されると、`.env` ファイル内の `BQML_RAG_CORPUS_NAME` にコーパス名が自動的に追加されます。

`RAG Engine` のコンソール画面を確認すると、`bqml_referenceguide_corpus` コーパスが作成されていることがわかります。

![rag_engine](https://res.cloudinary.com/zenn/image/fetch/s--OwpcRsNq--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/b0a719cdf660dc8f4a16ecac.png%3Fsha%3D9cd62253c345e00307ed14ca747d2341de051876)
*RAG Engine コーパス一覧*

また、コーパスの中身を確認すると BQML に関する複数のpdfファイルがインポートされています。

![rag_engine_corpus](https://res.cloudinary.com/zenn/image/fetch/s--oHLES2RV--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/c442eecdd4f27891cb35f634.png%3Fsha%3Deb4a8eefca50e4510fb581ae919c62d917f1116f)
*RAG Engine コーパス中身*

以上で環境構築は完了です。

### 2. エージェントの実行と対話

環境の準備が整ったら、エージェントを起動し、開発用の Web UI を立ち上げます。
ターミナルで以下のコマンドを実行してください。

```
poetry run adk web
```

ターミナルに表示されたローカルサーバーのURL（例: `http://localhost:8000` ）をブラウザで開くと、ADK の Web UI が表示されます。
UI 左上のドロップダウンメニューから `data-science` を選択することで、エージェントとの会話（セッション）を開始できます。

![adk_web_ui_welcome](https://res.cloudinary.com/zenn/image/fetch/s--uv0XRBl0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/c545f686e6ca01e84ac6864e.png%3Fsha%3D0faf9a6d4a66412e356e442f101eb0e12ecf3c0d)
*Web UI Welcome画面*

以下の図は、実際の会話画面です。

![adk_web_ui_session1](https://res.cloudinary.com/zenn/image/fetch/s--73hvlaWC--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a249d1163e844576608a64f2.png%3Fsha%3D1760580498307331e9283218662cbea25e40a08d)
*Web UI 会話画面1*

エージェントが生成した画像は、「アーティファクト」として保存され、Web UI 上で可視化されます。

> **Note**
> [公式ドキュメント](https://google.github.io/adk-docs/artifacts/)における「アーティファクト」の定義は以下の通りです。
>
> > ADK において、アーティファクトは、特定のユーザーインタラクションセッション、または複数のセッションにまたがって永続的にユーザーに関連付けられた、名前付きでバージョン管理されたバイナリデータを管理するための重要なメカニズムです。
>
> このアーティファクト機能により、エージェントやツールは単純なテキスト文字列以外のデータも処理できるようになり、ファイル、画像、音声などを含む、よりリッチなインタラクションが可能になります。

![adk_web_ui_session2](https://res.cloudinary.com/zenn/image/fetch/s--xUWer5-k--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/9ad2ee426e110bd31715a021.png%3Fsha%3Df934ed3d507605e14bfd4481d229ff010472e4f9)
*Web UI 会話画面2*

**エージェントとのやり取りの例**

> **ユーザー**: こんにちは。どのようなデータにアクセスできますか?
>
> **エージェント**:
> **Result:**
> forecasting\_sticker\_sales.test と forecasting\_sticker\_sales.train の2つのテーブルにアクセスできます。
>
> **Explanation:**
> これらのテーブルには以下の情報が含まれています。
>
> * id: データの識別子
> * date: 日付
> * country: 国
> * store: 店舗名
> * product: 製品名
> * num\_sold: 販売数

> **ユーザー**: trainテーブルについて知りたいです。どの国が対象ですか？店舗数はいくつですか？
>
> **エージェント**:
> **Result:**
> train テーブルの対象国はカナダ、フィンランド、イタリア、ケニア、ノルウェー、シンガポールです。店舗数は3つです。
>
> **Explanation:**
> train テーブルから、対象となる国と店舗数を問い合わせました。その結果、上記の国々と3つの店舗があることがわかりました。

> **ユーザー**: 国別の総売上高を示すグラフを生成してください。
>
> **エージェント**:
> ![code_execution_image_1](https://res.cloudinary.com/zenn/image/fetch/s--1x4qJmIn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/ae9e21b1a697a38d12620b48.png%3Fsha%3D72cdc309f70385191d353edaa42f544497ba1ad6)
>
> **Result:**
> 国別の総売上高を示す棒グラフが正常に生成されました。
>
> **Explanation:**
> まず、train テーブルから国別の総売上高を計算しました。次に、そのデータを使用して棒グラフを生成し、国ごとの売上高を視覚的に比較できるようにしました。グラフは、ノルウェーが最も売上高が高く、ケニアが最も低いことを示しています。
> GRAPH: code\_execution\_image\_1.png

> **ユーザー**: BQML ではどのような予測モデルが利用できますか？
>
> **エージェント**:
> BigQuery ML で利用できる予測モデルには、以下のものがあります。
>
> * 線形回帰モデル
> * ロジスティック回帰モデル
> * ブーストツリーモデル (XGBoost を使用)
> * ランダムフォレストモデル
> * ディープニューラルネットワーク (DNN) モデル
> * ワイド＆ディープモデル
> * K-means モデル
> * 主成分分析 (PCA) モデル
> * オートエンコーダーモデル
>     また、以下の形式のインポートされたモデルも利用できます。
> * ONNX モデル
> * TensorFlow モデル
> * TensorFlow Lite モデル
> * XGBoost モデル
> * Vertex AI ホストモデル
>     PCA およびオートエンコーダーモデルでは、ML.PREDICT 関数の代わりに ML.GENERATE\_EMBEDDING 関数も使用できます。

> **ユーザー**: 線形回帰モデルで予測モデルを学習したいです。
>
> **エージェント**:
> 線形回帰モデルの学習ですね。
> 線形回帰モデルは、数値の予測に使われるモデルです。num\_sold を予測すると仮定します。
> 以下の BQML コードで線形回帰モデルを作成・学習できます。{project\_id}.{dataset\_id}.linear\_reg\_model はモデル名、{project\_id}.{dataset\_id}.train は学習に使用するテーブルです。
>
> ```sql
> CREATE MODEL `{project_id}.{dataset_id}.linear_reg_model`
> OPTIONS(model_type='LINEAR_REG', input_label_cols=['num_sold']) AS
> SELECT
>   *
> FROM
>   `{project_id}.{dataset_id}.train`
> ```
>
> このモデルは、train テーブルのすべての列を入力特徴量として使用し、num\_sold を予測ターゲットとして学習します。
>
> **注意点:**
>
> * モデルの学習には時間がかかる場合があります。
> * このモデルは、train テーブルのすべての列を特徴量として使用します。必要に応じて、SELECT 文を修正して、使用する特徴量を指定できます。
> * このコードでモデルを学習してもよろしいですか？

### 3. 動作分析：Trace と Events 機能による思考プロセスの可視化

エージェントがどのようにしてこれらの応答を生成しているのか、その内部的な思考プロセスは Web UI の `Trace` と `Events` 機能で可視化することができます。

`「国別の総売上をグラフで表示してください。」`というリクエストに対する `Trace` を確認すると、以下のような一連の処理が記録されています。

![adk_web_trace_1](https://res.cloudinary.com/zenn/image/fetch/s--TuSTNBsA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a0bb3f2e3b75ab5f63343630.png%3Fsha%3De085e6a5585149ae1b276a938c13b1c5b30bf792)

1. **タスクの分解**: ルートエージェントがユーザーのリクエストを解釈し、「① SQL でデータを取得する」「② 取得したデータをグラフ化する」という2つのサブタスクに分解します。
2. **ツール呼び出し (SQL 実行)**: 最初に `db_agent`（データベースエージェント）をツールとして呼び出し、適切な SQL クエリを生成・実行させます。
3. **ツール呼び出し (グラフ描画)**: SQL の実行結果を次のツールである `ds_agent`（データサイエンスエージェント）に渡し、グラフ描画用の Python コードを生成・実行させます。
4. **アーティファクト生成**: 生成されたグラフ画像は「アーティファクト」として保存され、UI に表示されます。
5. **最終応答の生成**: ルートエージェントがすべての実行結果を統合し、最終的なテキスト応答と共にグラフを提示します。

また、`「BQML ではどのような予測モデルが利用できますか？」`というリクエストに対する `Events` を確認すると、ルートエージェント `db_ds_multiagent` がサブエージェント `bq_ml_agent` に処理を完全に 委任（transfer）する様子が確認できます。
これにより、特定の専門領域に関する対話は、その分野のスペシャリストであるサブエージェントが引き継ぎ、より深く掘り下げていくことが可能です。

![adk_web_event_1](https://res.cloudinary.com/zenn/image/fetch/s--S66AWmqY--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/716b3feab68ea73353aeb3d0.png%3Fsha%3D90bfcf38579e611c7c885e2df5692dc156e39d73)

## まとめ

本記事では、Google Agent Development Kit (ADK) のサンプルから `data-science` エージェントの環境構築、実行、そして内部動作の分析を行いました。

このハンズオンを通じて、ADK で構築されたエージェントが、単にユーザーの指示に応答するだけでなく、複数の専門エージェントを協調させ、データ分析から可視化、さらには機械学習の提案といった一連のワークフローを自律的に管理する能力を持つことが確認できました。

次のステップとして、`adk-samples` リポジトリ内の他のエージェントを試してみたり、本記事で扱ったエージェントのプロンプトやツールをカスタマイズしてみてはいかがでしょうか。

## 参考

* [Official ADK Documentation](https://google.github.io/adk-docs/)
* [ADK Samples GitHub Repository](https://github.com/google/adk-samples)
* [Google Developers Blog: Introducing ADK](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/)
* [YouTube: How to build a Data Science agent with ADK](https://www.youtube.com/watch?v=R94a5i_2T8A)
* [Kaggle: Forecasting Sticker Sales Dataset](https://www.kaggle.com/competitions/playground-series-s5e1)
