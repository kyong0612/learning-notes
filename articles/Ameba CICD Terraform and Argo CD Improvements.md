---
title: "Ameba CI/CD: Terraform and Argo CD Improvements"
source: "https://speakerdeck.com/kumorn5s/cd-terraform-and-argo-cd-improvements"
author:
  - "[[Kumo Ishikawa]]"
published: 2025-07-11
created: 2025-07-15
description: |
  AmebaのCI/CDプラットフォームにおける、数万リソースを管理するためのTerraformおよびArgo CDのパフォーマンス改善に関する包括的な記録。本資料では、CI/CDの構成と課題、Terraformの処理最適化、Argo CDとFluxCDの運用改善、Argo CD上での生成リソースの追跡、そしてPost-Releaseワークフローの導入について詳述しています。
tags:
  - "clippings"
  - "CI/CD"
  - "Terraform"
  - "ArgoCD"
  - "FluxCD"
  - "Kubernetes"
  - "PlatformEngineering"
---

本資料は、AmebaのCI/CDプラットフォームが抱える数万規模のリソース管理における課題と、その解決策として実施されたTerraformおよびArgo CDの改善策を詳述したものです。

## セッション概要

Ameba PlatformにおけるCI/CDの進化と運用改善、特に以下の点について解説します。

- CI/CDの構成と2022年以降に顕在化した課題の解決
- Terraform / ArgoCD / FluxCDのパフォーマンス最適化事例
- ArgoCD上のリソース追跡と生成リソースの取り扱い
- CI/CD後のワークフロー自動化に向けた検討

![slide_0](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_0.jpg)
![slide_2](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_2.jpg)

---

## 1. CI/CDの概要

### 背景と歴史

- **Amebaシステム刷新**: 2019年よりオンプレミスからAWSへ移行し、共通開発者基盤「Ameba Platform」を立ち上げ。
- **CI/CD基盤の要件 (2019)**:
  - 認知負荷の軽減
  - GitOps原則（リポジトリ = 状態）
  - シンプルなトリガーとイベント設計
  - パイプラインのコード化
  - 専属担当者を不要とする設計

### CI/CD構成

- **CI (Product)**: ECRへのImage Push、テスト、コード管理。
- **CD (Product)**: 手動実行によるCDN/Schema操作。
- **CI (Shared)**: TerraformによるCDN/DNS/AWSリソース管理。
- **CD (Platform)**: FluxCD (Image Tag)、ArgoCD (KubeVela CR -> Raw Manifest)。
- **KubeVela**: OAMモデルを利用し、Kubernetesマニフェスト生成を簡素化。

![slide_5](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_5.jpg)
![slide_8](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_8.jpg)
![slide_11](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_11.jpg)

---

## 2. CIの課題と解決: Terraformの処理最適化

### 課題

- **実行速度の低下**: `terraform plan/apply`が非常に遅い（平均Plan 12.4分, Apply 6.5分）。
- **影響範囲の広さ**: 一度の`apply`で他のアプリケーションのDriftまで適用してしまうリスク。
- **原因**:
  - 特定のAWS API（RDS, EC2）の応答遅延。
  - リソース増加に伴うtfstateの肥大化（Platformモジュールは3倍、マイクロサービスモジュールは4-5倍に）。
  - 不適切なCI構成（単一Runnerでの過剰な並列実行によるCPUボトルネック）。

![slide_21](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_21.jpg)
![slide_23](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_23.jpg)

### 対策と改善

- **方針**: CI全体の実行速度にフォーカス。
    1. **差分実行**: 変更があったモジュールのみTerraform操作を実行。
    2. **Runner並列化**: モジュール単位でRunnerを分割し、同時実行。
    3. **単体モジュール高速化**:
        - 遅いリソースの分離（EKS EC2 ASGをKarpenterへ移行検討）。
        - Planファイルを利用した`apply`。
        - Runnerの並列処理数の最適化（Stateサイズに応じて調整）。
        - Providerのキャッシング。
- **Drift対策**: 定期的なHealthcheckでEC2 AMI IDの変更などを検知し、自動的に`apply`。

![slide_28](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_28.jpg)
![slide_33](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_33.jpg)

### 結果

- **実行時間を最大9割、平均7割削減**。
  - **Plan**: 平均12.4分 → 3.9分
  - **Apply**: 平均6.5分 → 4.2分

![slide_38](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_38.jpg)
![slide_39](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_39.jpg)

---

## 3. CDの課題と解決

### その1: Argo CD・FluxCDの運用改善

#### 課題

- **Argo CD**:
  - 同期が遅い（Image Pushから完了まで20-30分）。
  - UIがフリーズする。
  - `ApplicationController`が常に高負荷状態（CPU 95%, Memory 90%）。
- **FluxCD**:
  - ImageTagの更新が停止し、`ImageXXXController`がOOM Killedで再起動。
- **根本原因**: 管理リソース総数の増加（2022年の10kから2024年には35kへ）。

![slide_43](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_43.jpg)
![slide_46](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_46.jpg)

#### 対策と改善

- **Argo CD**:
  - **水平スケーリング**:
    - `ApplicationController`をクラスタ単位でシャーディング。
    - `RepoServer`をスケールアウト。
  - **MonoRepo対策**: Git Webhookと`manifest-generate-paths`アノテーションを利用して、不要なキャッシュ再作成を抑制。
  - **パラメータチューニング**:
    - `timeout.reconciliation`を延長し、Jitterを設定してスパイクを回避。
    - `controller.status.processors`と`controller.operation.processors`を増やして処理効率を向上。
    - `reposerver.repo.cache.expiration`を延長。
- **FluxCD**:
  - リソース量の多いアプリケーションを新しいShardに割り当てることで、水平スケーリングを実施。

![slide_48](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_48.jpg)
![slide_52](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_52.jpg)
![slide_57](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_57.jpg)

#### 結果

- **Argo CD**: Work Queueの処理待ち件数がほぼ0になり、処理時間が7割減少。
- **FluxCD**: ダウンタイムが0になった。

![slide_59](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_59.jpg)
![slide_65](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_65.jpg)

### その2: 生成Resourceのステータス問題

#### 課題

KubeVelaによって生成されたリソース（Git管理外）が`OutOfSync`と表示され、誤ってPrune（削除）されるリスクがある。

![slide_68](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_68.jpg)

#### 対策

- **ソリューション2: Tracking IDの活用**
    1. KubeVelaのカスタムリソースに`argocd.argoproj.io/tracking-id`を導入。
    2. 生成されたリソースに、そのAnnotationをコピーさせる。
    3. これにより、生成リソースが本来持つべきTracking IDと不一致となり、Argo CDはこれを`NonSelfReferencing`リソースと判断。
    4. 結果として、Statusが`Unknown`となりUI上は`OutOfSync`と表示されなくなる。これによりPrune対象から外れ、運用者の心理的負担も軽減。

![slide_72](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_72.jpg)
![slide_77](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_77.jpg)
![slide_79](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_79.jpg)

### その3: Post-Release Workﬂowの導入

#### 課題

Argo CDのSync後（デプロイ後）にCDNキャッシュのパージなど、追加の処理を実行したいが、標準のResource Hookではリソース単位での柔軟なトリガーが難しい。

![slide_82](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_82.jpg)

#### 対策

- **KubeVela Application Workflow** を採用。
- これにより、従来手動で行っていたCDN操作などをCDプロセスに統合。
- デメリットとして複合条件の指定が難しい点があり、将来的にはArgo Workflowsの導入も検討。

![slide_84](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_84.jpg)
![slide_88](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_88.jpg)

---

## 4. まとめ

- **全体像**: Ameba PlatformのCI/CDにおける課題と改善策を詳細に紹介。
- **CI改善**: 差分ベースの実行とRunnerの並列化によりTerraform CIを高速化。
- **CD改善**:
  - Argo CD/FluxCDのスケーリングとパラメータチューニングでパフォーマンスを改善。
  - Tracking IDを用いてArgo CD上の生成リソースのステータス問題を解決。
  - KubeVelaを活用してPost-Releaseワークフローを導入。

![slide_91](https://files.speakerdeck.com/presentations/bb01b0a78f8549d69e98ee4938c057a3/slide_91.jpg)
