---
title: "Durable Execution Solutions"
source: "https://temporal.io/"
author: "Temporal Technologies"
published:
created: 2026-01-24
description: "Temporalは、障害が発生してもアプリケーションの状態を自動的に保持・復旧するオープンソースのDurable Executionプラットフォーム。ワークフローの耐障害性を実現し、複雑な分散システムの開発を簡素化する。"
tags:
  - "Durable Execution"
  - "Workflow Orchestration"
  - "Distributed Systems"
  - "Fault Tolerance"
  - "Microservices"
---

## 概要

Temporalは、**Durable Execution（耐久性のある実行）** を実現するオープンソースプラットフォーム。「もしコードが決して失敗しなかったら？」というビジョンのもと、障害が発生しても中断したところから自動的に再開できるアプリケーションを構築できる。

## コアコンセプト

### Durable Executionとは

- 分散システムでは、APIの失敗、ネットワークの断続、サービスのクラッシュが日常的に発生
- Temporalはワークフローの各ステップで状態を自動的にキャプチャ
- 障害発生時には、進捗を失うことなく中断箇所から正確に再開
- 手動リカバリやオーファンプロセスが不要

### 主要コンポーネント

#### 1. Workflows（ワークフロー）

ビジネスロジックをコードとして記述。用途例：

- 銀行口座間の資金移動
- 注文処理
- クラウドインフラのデプロイ
- AIモデルのトレーニング

**特徴**:
- フルの実行状態がデフォルトで耐障害性を持つ
- 任意のポイントでリカバリ、リプレイ、一時停止が可能

#### 2. Activities（アクティビティ）

失敗しやすいロジック（API呼び出し、ネットワーク通信など）を処理する関数。

- 自動リトライ機能を内蔵
- タイムアウト設定をサポート
- シームレスなリカバリ

```python
@workflow.defn
class SleepForDaysWorkflow:
    @workflow.run
    async def run(self) -> None:
        for i in range(12):
            # アクティビティにはタイムアウトとリトライのサポートが組み込み
            await workflow.execute_activity(
                send_email,
                start_to_close_timeout=timedelta(seconds=10),
            )
            # 30日間スリープ（本当に！）
            await workflow.sleep(timedelta(days=30))
```

#### 3. Temporal Service

- アプリケーションの状態を永続化
- リトライ、タスクキュー、シグナル、タイマーを内蔵
- セルフホストまたはTemporal Cloudで利用可能

## 対応言語

ネイティブSDKを提供：

- **Python**
- **Go**
- **TypeScript**
- **Ruby**
- **C#**
- **Java**
- **PHP**

## 主なユースケース

| ユースケース | 説明 |
|------------|------|
| **AI Agents / MCP / AIパイプライン** | 実世界のカオスを生き延びるエージェント開発、MLパイプラインのオーケストレーション |
| **Human-in-the-Loop** | 人間の入力を含むワークフローのクリーンな耐久性オーケストレーション |
| **Saga パターン** | 補償トランザクションをシンプルなtry...catchで実装 |
| **長時間実行ワークフロー** | 数日、数週間、数ヶ月のワークフローを進捗を失わずに実行 |
| **注文処理** | 1つのサービス障害でカート全体が壊れない |
| **Durable Ledgers** | トランザクションを1セントまで正確に追跡 |
| **CI/CD** | クリーンなリトライ、ロールバック、可視性でデプロイ |
| **顧客獲得** | リード管理、ユーザーオンボーディング、顧客エンゲージメント |
| **DAG** | bashとホープでDAGを繋ぎ合わせる必要なし |

## 導入企業

グローバル企業からトップスタートアップまで幅広く採用：

- **テック**: NVIDIA, Salesforce, Twilio, Cloudflare, GitLab, Snap
- **金融**: ANZ, Macquarie, Kotak, Mollie
- **小売・サービス**: DoorDash, Qualtrics, Alaska Airlines, Yum! Brands
- **その他**: Vodafone, GoDaddy, Deloitte, Checkr, Turo, Remitly

### 導入事例

- **NVIDIA**: クラウド全体でGPUフリートを管理
- **Salesforce**: モノリスからTemporalへの移行
- **Twilio**: 自社開発システムからTemporal Cloudへ移行
- **Descript**: AIのアップタイムを改善

## 業界からの評価

> "Temporal does to backend and infra, what React did to frontend… the surface exposed to the developer is a beautiful "render()" function to organize your backend workflows."
> 
> — **Guillermo Rauch**, Founder & CEO, Vercel

> "Temporal's technology satisfied all of these requirements out of the box and allowed our developers to focus on business logic. Without Temporal's technology, we would've spent a significant amount of time rebuilding Temporal and would've very likely done a worse job."
> 
> — **Mitchell Hashimoto**, Co-founder, Hashicorp

## デプロイオプション

### 1. セルフホスト

- MITライセンスのオープンソース
- 自社環境で完全にコントロール
- [GitHub](https://github.com/temporalio/temporal) で17,874スター以上

### 2. Temporal Cloud

- Temporalがホストするマネージドサービス
- コードはTemporalに見られない
- $1,000の無料クレジット付きでサインアップ可能

## 技術的な背景

- AWS SQS、AWS SWF、Azure Durable Functionsの開発者による20年以上の開発経験
- UberのCadenceプロジェクトから派生
- 9年以上の本番環境での実績

## リソース

- [ドキュメント](https://docs.temporal.io/)
- [GitHub](https://github.com/temporalio)
- [サンプルコード](https://learn.temporal.io/examples/)
- [デモ動画](https://youtu.be/dNVmRfWsNkM)
