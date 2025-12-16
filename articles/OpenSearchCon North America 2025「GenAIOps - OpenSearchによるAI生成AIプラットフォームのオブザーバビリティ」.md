---
title: "OpenSearchCon North America 2025「GenAIOps - OpenSearchによるAI/生成AIプラットフォームのオブザーバビリティ」"
source: "https://bering.hatenadiary.com/entry/2025/11/01/235944"
author:
  - "[[bering]]"
published: 2025-11-01
created: 2025-12-16
description: "OpenSearchCon North America 2025のセッション「GenAIOps - OpenSearch for AI & GenAI Platform Observability」をまとめます。TransUnionのRama Pabolu氏とRamesh Kumar Manickam氏が、GenAIシステムにおけるオブザーバビリティの実装方法を解説。ベクトルDB、エージェント、RAG、LLMといったGenAIコンポーネントのモニタリング手法と、OpenTelemetry、OpenSearchを活用したMELTスタックの構築について説明します。MLOpsからGenAIOpsへの進化、各レイヤーでのモニタリング技術、そして実装のベストプラクティスを紹介します。"
tags:
  - "clippings"
  - "OpenSearch"
  - "GenAIOps"
  - "Observability"
  - "OpenTelemetry"
  - "LLMOps"
  - "MLOps"
  - "Kubernetes"
---

## 概要

OpenSearchCon North America 2025のセッション「GenAIOps - OpenSearch for AI & GenAI Platform Observability」の要約。TransUnionのRama Pabolu氏とRamesh Kumar Manickam氏が、GenAIシステムにおけるオブザーバビリティの実装方法を解説している。

- **動画**: [YouTube](https://www.youtube.com/watch?v=qMheQkzBp08)
- **サンプルコード**: [GitHub - aws-samples/four-level-observability-example-for-GenAI](https://github.com/aws-samples/four-level-observability-example-for-GenAI)

---

## スピーカー

### Rama Pabolu氏

- **役職**: TransUnion Director of Software Engineering
- **経歴**: 24年以上のソフトウェアシステム設計経験
- **専門領域**: クラウドネイティブプラットフォーム、マイクロサービス、Kubernetes、インメモリデータベース、通信プロトコル開発
- **現在の取り組み**: サブミリ秒のレイテンシーでリアルタイムシステムを構築し、詐欺電話・スパムコール防止に注力

### Ramesh Kumar Manickam氏

- **役職**: TransUnion Sr Director（バンガロールGlobal Capability Center）
- **経歴**: TravelTech、FinTech、CommTech分野で24年以上
- **講演実績**: Mobile Developer Summit、Aerospike Summit、OpenSearchCon等

---

## なぜGenAIにオブザーバビリティが必要なのか

![技術の進化とオブザーバビリティ](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101234226.png)

### 技術の進化

| 時代 | 特徴 |
|------|------|
| **クラウドネイティブ** | 回復力のあるスケーラブルなインフラストラクチャ |
| **AIネイティブ** | インテリジェントな自動化と予測可能な機能 |
| **GenAI** | 推論、自動生成、自律的な行動 |

### 運用の進化

- **DevOps → MLOps → GenAIOps**
- GenAIOpsの核心原則: **オブザーバビリティ**、**信頼性**、**セキュリティ**

### モニタリングの変化

| 従来（定量的） | GenAI時代（定性的） |
|----------------|---------------------|
| レイテンシー | モデルのパフォーマンス |
| スループット | プロンプトエンジニアリングの品質 |
| - | エンドツーエンドのプロンプトトレーシング |

### GenAIオブザーバビリティの対象コンポーネント

- ベクトルDB
- エージェント
- RAG
- LLMシステム

これらはバッチモード、ストリーミングモード、リアルタイム推論など様々な動作モードで動作する。

### 対象者

- AI Opsエンジニア
- アーキテクト
- データプロダクトマネージャー
- プラットフォーム開発チーム
- テストチーム
- SREチーム

---

## AI/MLスタックの進化とアーキテクチャ

![AI/MLアプリケーションスタックの進化](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101234451.png)

### スタックの進化

| ユースケース | 主要コンポーネント |
|--------------|-------------------|
| **バッチML** | MLモデル、フレームワーク、ツール、ランタイム |
| **ストリーミング** | Feature Store、Streaming Pipelines（リアルタイムデータ処理） |
| **GenAI/LLM** | LLMモデル、エージェント（自律的コンポーネント） |

### アプリケーション領域

- 機械学習
- コンピュータビジョン
- 自然言語処理
- 音声認識
- カスタムモデルのデプロイメント
- チャットボット・バーチャルアシスタント

### 基盤インフラストラクチャ

- **プラットフォーム**: Kubernetes
- **インフラ層**: コンピューティング、ストレージ、メモリ、ネットワーキング
- **運用層**: MLOps + LLMOps

---

## GenAIオブザーバビリティのスペクトラム

![GenAIオブザーバビリティの4つの柱](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101234752.png)

### 4つの重要な柱

#### 1. LLMs

- 大規模/中規模/小規模の基盤モデル
- 特性: quantisation、fine-tuning、memory tuning、inference prompting、LLM repos

#### 2. AI Agents

- ネットワーク、セキュリティ、カスタマーサービス、SQL等の専門エージェント
- Pandas agents等のエージェンティックワークフロー

#### 3. Tools

- チャットボット
- ベクトルストア
- データベース
- APIコード
- 音声認識・画像処理

#### 4. Frameworks

**デプロイメントフレームワーク:**

- LangChain
- LangGraph
- LlamaIndex
- AvaTaR
- CrewAI

**セキュリティ・マネジメントフレームワーク:**

- OWASP AI Security
- NIST AR ISO/IEC 42001

### データフロー

1. ユーザーからのクエリ
2. エージェントがクエリを受け取り
3. LLM（ローカルOllama/外部LLMサービス）で処理
4. ベクトルDBからコンテキスト情報取得
5. Kubernetes上のサービス/Podとして動作
6. OpenTelemetry（OTLP）でモニタリング

---

## GenAIのアーキテクチャとKubernetes環境での実装

![GenAIシステムアーキテクチャ](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101234945.png)

### 主要ステージ

| ステージ | 説明 | Kubernetesリソース |
|----------|------|-------------------|
| **Generative AI API** | ユーザーリクエストの処理 | Service + Pod |
| **Generative AIモデル** | 外部ツール/LLMと連携 | Service + Pod |
| **Vector Embeddings** | 意味的検索、ベクトル埋め込み生成 | Service + Pod |
| **Domain-specific Data** | 組織/用途に特化したデータ格納 | スケーラブル構成 |

### OpenTelemetryの役割

- すべてのステージからMELTスタック情報をキャプチャ
  - **M**etrics
  - **E**vents
  - **L**ogs
  - **T**races
- データをOpenSearchにプッシュ
- Jaegerとの連携で分散トレーシングを実現

---

## モデルライフサイクルとモニタリングポイント

![モデルライフサイクル](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101235135.png)

### ステージ1: Training（モデルの準備）

| フェーズ | 内容 |
|----------|------|
| **基本モデル** | 大規模コーパスで学習（Mistral、Llama 3、Phi 3等） |
| **ファインチューニング** | 小さなドメイン知識のトレーニングセット使用 |
| **保存** | コードリポジトリ + モデルレジストリ |

### ステージ2: Inference（運用投入）

**関連コンポーネント:**

- ファインチューニング済みモデル
- Feature Store
- Streaming Pipelines
- VectorDB・その他DB
- APIコード
- RBAC・ルーティングコード
- フロントエンド/バックエンドコード

**提供方法:**

- リバースプロキシ経由でユーザー/管理者に提供
- API経由で内外プラットフォーム連携
- アイデンティティ・アクセス管理実装

**継続的改善:**

- 本番データを取り込んでさらに学習
- 継続的なファインチューニング

---

## AIデータパイプラインと各レイヤーでのモニタリング技術

![データパイプラインとモニタリング](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101235417.png)

### データパイプラインの5ステージ

| ステージ | 内容 | 使用技術 |
|----------|------|----------|
| **Data Ingest** | 生データ収集 | NFS、S3、Kafka |
| **Data Preparation** | データ精製 | SparkSQL、DataFrames |
| **Training** | モデル作成 | GPUDirectストレージ保存 |
| **Inference** | 推論・Fine-Tuning・Re-Training | Quantized Model |
| **Inference Logging** | ログ記録 | Prompt/Response Logs、Multi-Modal Response Logging |

### 各レイヤーでのモニタリング技術

#### レイヤー2-3（インフラ）

**対象ノード:** ハードウェアノード、AIノード、ベクトルDBノード、エッジデバイス

**使用技術:**

- Cilium
- NetFlow
- eBPF（Berkeley Packet Filter）
- OpenTelemetry

#### レイヤー4-7（アプリケーション）

**対象:** APIゲートウェイ、エージェント、ベクトルDB、Fine-Tuning Pipelines、LLMs

**使用技術:**

- OpenTelemetry
- サービスメッシュ
- OpenSearch
- Jaeger（分散トレーシング）
- Prometheus、Grafana
- LangGraph、Langfuse

---

## メトリクスデータのOpenSearchへのフロー

![OpenSearchへのデータフロー](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101235606.png)

### データ収集フロー

```
マイクロサービス/共有インフラ
    ↓
OTel Auto Instrumentation / OTel API / OTel SDK
    ↓
OTel Collector（プロセッサ、バッファ、コネクター）
    ↓
OpenSearch Ingestion OTLPエンドポイント（Data Prepper）
    ↓
OpenSearch → OpenSearch Dashboards
```

### シグナルタイプ（MELTスタック拡張）

| シグナル | 説明 |
|----------|------|
| **Metrics** | パフォーマンス指標 |
| **Logs** | イベントログ |
| **Traces** | 分散トレース |
| **Baggage** | キーバリューペア、メタデータ情報を全スパンに伝搬 |
| **Profiling** | 個々のスパン/コンポーネントのパフォーマンスモニタリング |

### アプリケーション層の接続

| アプリタイプ | 接続経路 |
|--------------|----------|
| Instrumented App | OpenTelemetry SDK |
| Jaeger App | Jaeger Agent経由 |
| Zipkin App | Zipkin Collector経由 |

---

## GenAIにおける重要なメトリクス

![GenAI重要メトリクス](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251101/20251101235754.png)

### LLMs / Fine-Tuned Models

| メトリクス | 説明 |
|------------|------|
| **Cost analysis** | LLMパワードアプリケーションからのコール毎のコスト計算 |
| **Response time tracking** | LLMコールの平均応答時間 |
| **Token usage per call** | コール毎のトークン数、プロンプト詳細 |
| **A/B testing** | モデルバージョン比較、Drift、Cosine similarity distribution、Batch variability |
| **LLMパラメータ** | Temperature、Dimensionality |
| **Policy guideline compliance** | 組織ポリシーガイドライン準拠確認 |

### Vector DBs / Data Pipelines

| メトリクス | 説明 |
|------------|------|
| **Similarity Search Behavior** | フィルタリング、コンディションパフォーマンス、リコール、精度、正確性 |
| **Data Ingestion** | 埋め込みの書き込みレイテンシー、バッチインジェスション、損失 |
| **Drift** | Embedding Drift、Transformation、Cleaning、Labeling |
| **Performance** | Metadata Performance、Query Performance、Scalability、Availability |
| **Index Management** | Optimization、Rebuild time、size |
| **Resource Utilization** | Compute、Memory、Disk、Network I/O |

### API Gateways / Other infra

| メトリクス | 説明 |
|------------|------|
| **Request Volumes** | レート制限、リクエストスロットリング、レイテンシー |
| **Errors** | Failures、Timeouts、Status Codes、Payload Errors |
| **Availability** | Circuit Breaking activity、Anomalies、Healthcheck |

---

## MLOpsとLLMOpsの違い

![MLOpsとLLMOpsの比較](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251102/20251102000059.png)

### GenAIオブザーバビリティツール

- LangSmith
- PromptLayer
- Weights & Biases
- Helicone
- **Langfuse**（人気）
- **LangGraph**（人気）

### 根本的な違い

| 項目 | MLOps | LLMOps |
|------|-------|--------|
| **予測可能性** | 決定論的・予測可能 | 非決定論的（同じクエリでも結果が異なる可能性） |
| **評価手法** | 定量的評価 | セマンティック評価（LLM-as-a-judge、Human-in-the-Loop） |
| **ドリフトモニタリング** | 統計的指標 | 埋め込み距離等のセマンティックパラメータ |
| **重点** | 学習とデプロイメント | **推論とプロンプトの最適化** |

---

## サンプルアプリケーション

![サンプルアプリケーション構成](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251102/20251102000935.png)

### 処理フロー

1. ドキュメントに対するデータ処理
2. ユーザーがドキュメントに関するクエリをリクエスト
3. BedrockまたはSageMakerでポストプロセス
4. LLMを使用してレスポンス生成

### OpenSearchの役割

- **レベル1**: 基本的なノードレベル情報
- **レベル2**: 参照情報
- **レベル3**: アクションのオペレーション

**参考リポジトリ**: [aws-samples/four-level-observability-example-for-GenAI](https://github.com/aws-samples/four-level-observability-example-for-GenAI)

---

## ベストプラクティス：AI + OTel + OpenSearch

![ベストプラクティス](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251102/20251102001116.png)

### 1. AIコンポーネントのインストゥルメンテーション

- 自動/手動でAIコンポーネントをトレーシングでラップ
- LLM呼び出し（`create`、`invoke_chain`等）をトレース
- 埋め込みサービス、ベクトルルックアップも含める
- 外部ツール呼び出し時はカスタムスパン作成
  - モデル名
  - トークンカウント
  - コスト
  - 等のメタデータを含める

### 2. コンテキスト伝搬

- トレースIDとバゲージヘッダーを使用
- 複数エージェント/ツールをまたぐワークフロー全体でコンテキスト維持

### 3. テレメトリーのエクスポート

- OTelコレクターからOpenSearch/Prometheusにプッシュ
- AWS CloudWatch（OpenTelemetry対応）も使用可能

### 4. ダッシュボード作成とイベント注釈

追跡対象:

- コスト分析
- レイテンシー
- エージェントワークフローの進行状況
- パイプラインの構成

### 5. 参考ツール

| レイヤー | ツール |
|----------|--------|
| **上位レイヤー** | OpenLLMetry（OpenTelemetry上に構築） |
| **下位レイヤー** | eBPF、Cilium、Tetragon、Hubble |

---

## まとめ

![まとめ](https://cdn-ak.f.st-hatena.com/images/fotolife/b/bering/20251102/20251102001417.png)

### キーポイント

1. **GenAIコンポーネント**（ベクトルDB、エージェント、RAGシステム、LLM、推論パイプライン）は、MELTアーキテクチャを通じて完全にオブザーバブル

2. **レイヤー4-7のオブザーバビリティ**
   - クラウドネイティブ: サービスメッシュ
   - AIネイティブ: OTel統合されたLangGraph、Langfuse、OpenLLMetry

3. **GenOps機能**: GenAIシステムのトランザクションインテリジェンスと運用インテリジェンスを強化

4. **技術の進化**: MLOps → AIOps → GenAIOps → **AgentOps**（将来）

### OpenSearchの役割

- ユーザークエリから最終レスポンスまでの全情報を格納
- コンテキスト切り替え時の履歴検索
- 関連ドキュメントチャンク取得後のLLMによる情報充実

---

## 参考リンク

- [YouTube: セッション動画](https://www.youtube.com/watch?v=qMheQkzBp08)
- [GitHub: 4レベルオブザーバビリティサンプル](https://github.com/aws-samples/four-level-observability-example-for-GenAI)
- [OpenSearchCon スケジュール](https://opensearchconna2025.sched.com/)
