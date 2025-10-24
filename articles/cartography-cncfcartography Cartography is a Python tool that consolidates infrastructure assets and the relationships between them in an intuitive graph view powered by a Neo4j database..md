---
title: "cartography-cncf/cartography: Cartography is a Python tool that consolidates infrastructure assets and the relationships between them in an intuitive graph view powered by a Neo4j database."
source: "https://github.com/cartography-cncf/cartography"
author:
  - "cartography-cncf"
published: 2025-10-18
created: 2025-10-24
description: "CartographyはNeo4jデータベースを活用し、インフラストラクチャ資産とそれらの関係性を直感的なグラフビューで統合するPythonツール。AWS、Azure、GCP、Kubernetes等、30以上のプラットフォームをサポートし、セキュリティリスクの可視化と分析を実現。CNCF Sandboxプロジェクト。"
tags:
  - "infrastructure"
  - "security"
  - "neo4j"
  - "python"
  - "cloud"
  - "aws"
  - "azure"
  - "gcp"
  - "kubernetes"
  - "graph-database"
  - "security-analysis"
  - "cncf"
---

## 概要

Cartographyは、インフラストラクチャ資産とそれらの間の関係性をNeo4jグラフデータベース上に統合・可視化するPythonツールです。Cloud Native Computing Foundation (CNCF) のSandboxプロジェクトとして管理されています。

**主要な特徴:**

- 複数のクラウドプロバイダーとサービスから資産情報を収集
- Neo4jグラフデータベースを活用した関係性の可視化
- セキュリティリスクの分析と依存関係の発見
- 柔軟な拡張性とカスタムプラグインのサポート

**プロジェクト統計:**

- ⭐ Stars: 3.6k
- 🍴 Forks: 439
- 👥 Contributors: 118
- 📦 Latest Release: v0.118.0 (2025年10月18日)
- 📄 License: Apache 2.0

## なぜCartographyか？

Cartographyは幅広い探索と自動化シナリオを実現することを目指しています。特に、サービス資産間の隠れた依存関係を明らかにし、セキュリティリスクに関する仮定を検証するのに優れています。

### ユースケース

**サービスオーナー向け:**

- 資産レポートの生成
- 現在の環境スナップショットの把握

**レッドチーム向け:**

- 攻撃パスの発見
- クロステナント権限関係の分析

**ブルーチーム向け:**

- セキュリティ改善領域の特定
- リスクエクスポージャーの理解

### 差別化要因

他のセキュリティグラフツールと比較して、Cartographyは以下の点で差別化されています：

- 包括的な機能を持ちながらも汎用的で拡張可能
- 特定のシナリオや攻撃ベクターに限定されない柔軟性
- プラットフォームに依存しない探索的な分析が可能

## サポートされているプラットフォーム

Cartographyは30以上のプラットフォームとサービスをサポートしています：

### クラウドプロバイダー

**Amazon Web Services (AWS):**

- 主要サービス: EC2, RDS, S3, Lambda, EKS, ECR
- セキュリティ: IAM, Security Hub, GuardDuty, Inspector, Secrets Manager
- ネットワーク: VPC, Route53, API Gateway
- その他: DynamoDB, Glue, SNS, SQS, CloudWatch, Config, CodeBuild

**Google Cloud Platform (GCP):**

- Cloud Resource Manager
- Compute Engine
- Google Kubernetes Engine (GKE)
- Cloud DNS, Cloud Storage

**Microsoft Azure:**

- App Service, Functions, Logic Apps
- Virtual Machines, Container Instances
- CosmosDB, SQL, Storage
- Resource Groups

### IDaaS & 認証

**Microsoft Entra ID (旧Azure AD):**

- ユーザー、グループ、アプリケーション
- 組織単位、アプリロール
- AWS Identity Centerへのフェデレーション

**Okta:**

- ユーザー、グループ、組織、ロール
- アプリケーション、認証要素、信頼されたオリジン
- AWSロールおよびIdentity Centerへのフェデレーション

**Keycloak:**

- レルム、ユーザー、グループ、ロール
- クライアント、アイデンティティプロバイダー
- 認証フロー、組織管理

**その他:**

- Duo (ユーザー、グループ、エンドポイント)
- Google GSuite (ユーザー、グループ)

### コンテナ & オーケストレーション

**Kubernetes:**

- クラスター、ネームスペース、サービス
- Pod、コンテナ、ServiceAccount
- RBAC: Role, RoleBinding, ClusterRole, ClusterRoleBinding
- OIDCプロバイダー

### セキュリティ & コンプライアンス

**エンドポイントセキュリティ:**

- CrowdStrike Falcon (ホスト、脆弱性、CVE)
- SentinelOne (アカウント、エージェント)
- BigFix (コンピュータ)

**脆弱性管理:**

- NIST CVE (共通脆弱性識別子データベース)
- Trivy Scanner (AWS ECRイメージ)

**デバイス管理:**

- Kandji (デバイス)
- SnipeIT (ユーザー、資産)

### 開発 & コラボレーション

**GitHub:**

- リポジトリ、ブランチ
- ユーザー、チーム
- 依存関係グラフ、マニフェスト

**その他:**

- PagerDuty (ユーザー、チーム、サービス、スケジュール、エスカレーションポリシー)
- Lastpass (ユーザー)
- Airbyte (組織、ワークスペース、ユーザー、接続)

### AI & ML プラットフォーム

**OpenAI:**

- 組織、ユーザー、プロジェクト
- API キー、サービスアカウント

**Anthropic:**

- 組織、ワークスペース、ユーザー
- API キー

### その他のプラットフォーム

- **DigitalOcean**: クラウドインフラ
- **Oracle Cloud Infrastructure (OCI)**: IAM
- **Cloudflare**: アカウント、ゾーン、DNSレコード
- **Scaleway**: プロジェクト、IAM、インスタンス、ストレージ
- **Tailscale**: Tailnet、ユーザー、デバイス、グループ

## 哲学

### Cartographyができること

1. **シンプルなPythonスクリプト**
   - 複数のプロバイダーからデータを取得
   - Neo4jグラフデータベースにバッチで書き込み

2. **強力な分析ツール**
   - 環境の現在のスナップショットをキャプチャ
   - 複雑な質問への回答が可能：
     - どのアイデンティティがどのデータストアにアクセスできるか？
     - 環境内のクロステナント権限関係は？
     - 環境への出入りのネットワークパスは？
     - データストアのバックアップポリシーは？

3. **本番環境での実績**
   - 多数の企業で実証済み
   - Lyft、Thought Machine、MessageBirdなどが利用

4. **拡張性**
   - カスタムプラグインで簡単に拡張可能
   - CSPM (Cloud Security Posture Management) アプリケーションのデータプレーンとして活用可能

### Cartographyができないこと

1. **ほぼリアルタイムの機能ではない**
   - 非常に高速な更新には設計されていない
   - データベースへの書き込みはバッチ処理（ストリーミングではない）
   - 上流ソースのほとんどがバッチAPIのみを提供

2. **単体では経時的なデータ変更をキャプチャしない**
   - ドリフト検出機能は含まれている
   - 追加のプロセスを実装することで対応可能

## インストールと設定

### テスト環境での試用

1. **基本的なセットアップ:**
   - Neo4jデータベースのインストール
   - Cartographyのインストール
   - 初期設定とデータ収集の実行

2. **Docker Composeを使った起動:**
   - リポジトリには`docker-compose.yml`が含まれている
   - 開発用の`dev.Dockerfile`も用意

### 本番環境へのデプロイ

本番環境で使用する準備ができたら、以下を考慮してください：

1. **運用上の推奨事項:**
   - 定期的なスケジュール実行の設定
   - 適切な認証情報管理
   - モニタリングとロギングの設定

2. **スケーリング:**
   - バッチサイズの調整
   - Neo4jデータベースのパフォーマンスチューニング

## 使用方法

### ルールの実行

セキュリティフレームワークに対して環境をチェック：

```bash
cartography-rules run all
```

ルール機能により、一般的なセキュリティフレームワークに対する準拠状況を確認できます。

### データベースの直接クエリ

Neo4jに保存されたデータに対して、Cypherクエリを使用した分析が可能です。

**クエリチュートリアル:**

- 基本的なクエリパターン
- 関係性の探索
- セキュリティ分析のベストプラクティス

**データスキーマ:**

- ノードタイプとプロパティの詳細
- リレーションシップの定義
- インデックスと制約

### アプリケーション構築

Cartography周辺でアプリケーションやデータパイプラインを構築可能：

1. **直接クエリ:**
   - Neo4jへの直接クエリは「スイスアーミーナイフ」として非常に有用

2. **アプリケーション統合:**
   - カスタムダッシュボード
   - 自動化されたセキュリティチェック
   - コンプライアンスレポート生成

## ドキュメント

公式ドキュメント: [https://cartography-cncf.github.io/cartography/](https://cartography-cncf.github.io/cartography/)

**主要なドキュメント:**

- インストールガイド
- 使用方法チュートリアル
- データスキーマリファレンス
- 開発者ガイド
- 各プラットフォームのモジュールドキュメント

## コミュニティ

### コミュニケーション

**Slack:**

- CNCFのSlackワークスペースに参加
- `#cartography`チャンネルで交流

**月次コミュニティミーティング:**

- Zoomで開催される月次ミーティング
- [議事録](https://docs.google.com/document/d/1VyRKmB0dpX185I15BmNJZpfAJ_Ooobwz0U1WIhjDxvw)が公開されている
- 2025年以前のミーティング録画は[YouTubeプレイリスト](https://www.youtube.com/playlist?list=PLMga2YJvAGzidUWJB_fnG7EHI4wsDDsE1)で視聴可能

### 貢献方法

**行動規範:**

- すべての貢献者と参加者は[CNCFの行動規範](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)に従う必要がある

**バグレポートと機能リクエスト:**

- GitHubイシューで報告
- 大規模な議論が必要な場合はGitHub Discussionsに変換

**開発:**

- 開発者ドキュメントが充実
- PRによるドキュメント改善も歓迎

## セキュリティとベストプラクティス

**セキュリティバッジ:**

- OpenSSF Scorecard評価あり
- OpenSSF Best Practicesバッジを取得

**セキュリティポリシー:**

- 脆弱性報告のプロセスが確立されている
- SECURITY.mdファイルで詳細を確認可能

## 利用企業

以下の企業がCartographyを利用しています：

1. **Lyft** - ライドシェア大手
2. **Thought Machine** - 金融テクノロジー企業
3. **MessageBird** - コミュニケーションプラットフォーム
4. **Cloudanix** - クラウドセキュリティ
5. **Corelight** - ネットワークセキュリティ
6. **SubImage** - デジタルセキュリティ

*あなたの組織でCartographyを使用している場合は、PRを提出してリストに追加できます。*

## ライセンスとガバナンス

**ライセンス:**

- Apache 2.0 License

**ガバナンス:**

- GOVERNANCE.mdでプロジェクトのガバナンス構造が定義されている
- MAINTAINERS.mdでメンテナー情報が公開されている

**CNCF Sandboxプロジェクト:**

- Cloud Native Computing Foundationの一部として管理
- CNCFのサポートとリソースを活用

## 技術仕様

**言語構成:**

- Python: 99.5%
- その他: 0.5%

**依存関係管理:**

- `pyproject.toml`: プロジェクト設定
- `uv.lock`: 依存関係ロックファイル
- `setup.py`, `setup.cfg`: セットアップスクリプト

**開発環境:**

- Dockerfile、dev.Dockerfileが提供
- docker-compose.ymlで簡単に起動
- .devcontainer設定あり
- Makefileで開発タスクを自動化

**CI/CD:**

- GitHub Actionsによる自動ビルド
- PyPIへの自動公開
- GHCRへのコンテナイメージ公開

## まとめ

Cartographyは、クラウドインフラストラクチャのセキュリティ分析と可視化のための強力なツールです。30以上のプラットフォームをサポートし、Neo4jグラフデータベースを活用することで、複雑な依存関係とセキュリティリスクを直感的に理解できます。

**主な強み:**

- 包括的なプラットフォームサポート
- グラフベースの直感的な可視化
- 拡張性とカスタマイズの容易さ
- 活発なコミュニティとCNCFのサポート
- 本番環境での実績

**適用領域:**

- クラウドセキュリティ監査
- コンプライアンスチェック
- 資産インベントリ管理
- 脆弱性管理
- 攻撃面分析

オープンソースプロジェクトとして、継続的な開発と改善が行われており、クラウドネイティブなセキュリティツールの標準として成長を続けています。
