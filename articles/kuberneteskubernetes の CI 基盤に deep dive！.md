---
title: "kubernetes/kubernetes の CI 基盤に deep dive！"
source: "https://developers.cyberagent.co.jp/blog/archives/61143/"
author:
  - "石上敬祐（kei01234kei）"
published: 2025-12-21
created: 2026-01-11
description: "Kubernetes 1.35 の release team（release signal グループ）に所属し、CI 周りの監視を行った著者が、kubernetes/kubernetes の CI 基盤である test infra の構成（Prow、TestGrid、Triage）、job のトリガー方式（Presubmit、Postsubmit、Periodic）、および大規模テストについて詳しく解説。"
tags:
  - CI
  - Kubernetes
  - Prow
  - TestGrid
  - Triage
  - インフラ
  - テスト
---

## 概要

著者は株式会社AJAのSSP Divisionでソフトウェアエンジニアとして働いており、Kubernetes 1.35 の release cycle において release team の release signal グループに所属し、Kubernetes の CI 周りの監視を担当。この経験を通じて Kubernetes の CI 環境の設計に感銘を受け、その詳細を解説している。

---

## Kubernetes の test infra の概要

**test infra** とは Kubernetes の CI 基盤のことで、以下の主要コンポーネントから構成されている：

- **Prow**
- **TestGrid**
- **Triage**

アーキテクチャとしては、GKE や EKS、GCS、BigQuery などのクラウドサービスを活用して構成されている。

![architecture](https://github.com/kubernetes/test-infra/blob/5689258878c3cf974c1f324fba30a85358321555/docs/architecture.svg)

---

### Prow

**Prow** は Kubernetes ベースの CI/CD システムで、Kubernetes プロジェクトの CI 基盤の中核を担う。

#### 特徴

1. **ChatOps 機能**
   - GitHub の PR コメント欄でスラッシュコマンドを使用可能
   - `/lgtm`、`/approve`、`/retest` などでレビューやテストの再実行が可能

2. **シンプルで使いやすい UI**
   - テスト失敗時のログ確認がしやすい

---

### TestGrid

**TestGrid** は Kubernetes の CI テスト結果を可視化するダッシュボード。

#### 機能

- Prow が Google Cloud Storage にアップロードしたテスト実行結果を読み取り、時系列で表示
- 各ダッシュボードタブにステータスを割り当て：
  - **PASSING**: 最近のテスト実行で失敗が見つからない
  - **FAILING**: 最近のテスト実行で一貫した失敗がある
  - **FLAKY**: 合格でも不合格でもなく、少なくとも 1 つの最近の失敗結果がある

#### 通知機能

- 主要な job が flaky または failing ステータスになると release team にメール通知される

---

### Triage

**Triage** は、類似したテスト失敗をクラスタリングして表示するツール。

#### 処理フロー

1. **データ取得**: BigQuery から過去 14 日間のテスト失敗データを取得

2. **ローカルクラスタリング**
   - 各テストの失敗メッセージを類似度に基づいてグループ化
   - 処理後のデータ構造: `テスト名 ⇒ ローカルクラスタテキスト ⇒ テスト失敗のグループ`

3. **グローバルクラスタリング**
   - 異なるテスト間で類似したローカルクラスタを見つけ統合
   - 最終的なデータ構造: `グローバルクラスタテキスト ⇒ テスト名 ⇒ テスト失敗のグループ`

#### 類似度計算

- **Ukkonen のアルゴリズム**（編集距離アルゴリズム）を使用
- 従来のレーベンシュタイン距離の動的計画法が O(distance²) の空間計算量を必要とするのに対し、O(distance) に削減した効率的な実装

#### 利点

- job をまたいで散発的に発生する flaky なテストの調査に便利
- TestGrid では個別の job ごとにしか確認できない失敗パターンを横断的に把握可能

---

## job のトリガーについて

Prow では、job は大きく **3 つのタイプ** に分類される：

### 1. Presubmit job

- **トリガー**: PR が作成されたとき
- **目的**: マージ前のコードに対してテストを実行し、変更が環境を壊さないことを検証
- **例**: `pull-kubernetes-verify` - コードのフォーマットチェックや lint、単体テストなどの軽量な検証

### 2. Postsubmit job

- **トリガー**: PR がマージされ、新しいコミットが作成されたとき
- **目的**: マージ後のコードに対してテストを実行し、main ブランチの品質を確認
- **例**: `etcd-manager-postsubmit-push-to-staging` - コンテナイメージをビルドして staging registry に push

### 3. Periodic job

- **トリガー**: 時間ベース（cron 形式で指定）
- **特徴**: git の変更とは無関係に定期的に実行
- **例**: `ci-kubernetes-e2e-gce-scale-performance` - 5000 ノードのクラスタを構築して大規模なパフォーマンステストを実行

---

## 個人的に特に面白いテスト

### 1. ci-kubernetes-e2e-gce-scale-performance

Kubernetes の大規模環境でのパフォーマンスとスケーラビリティを検証するテスト。

#### 特徴

- **5000 ノード** という非常に大規模なクラスタを GCE 上に構築
- Load test では約 **30 × ノード数** の Pod を作成（5000 ノードの場合は約 **150,000 個の Pod**）

#### 重要性

- Kubernetes が公式にサポートする上限（**5000 ノード、150,000 Pod**）は、このテストで検証されていることに基づく
- このテストが継続的に成功することで、Kubernetes コミュニティは「5000 ノード、150,000 Pod までは問題なく動作する」と保証できる

---

### 2. ci-kubernetes-kubemark-gce-scale

**Kubemark** を使用したパフォーマンステスト。

#### Kubemark とは

- シミュレートされたクラスタで実験を行うことができるパフォーマンステストツール
- **hollow ノード** と呼ばれる軽量な疑似ノードを使用

#### Hollow ノードの特徴

- 実際にはコンテナを実行せず、ストレージもアタッチしない
- etcd への更新などを含め、あたかも実行しているかのように振る舞う
- **84 台の実ノード**（各 e2-standard-8）で **5000 個の hollow ノード** をシミュレート可能

#### テストの目的

- 大規模クラスタでのみ現れるマスターコンポーネント（API Server、controller manager、scheduler）の問題（例: 小さなメモリリーク）を発見
- 実際の 5000 ノードクラスタを構築するより費用対効果が高い

---

## まとめ

### CI 基盤の構成

| コンポーネント | 役割 |
|---------------|------|
| **Prow** | ChatOps 機能とシンプルな UI で job の実行を管理 |
| **TestGrid** | GCS からテスト結果を読み取って時系列で可視化 |
| **Triage** | BigQuery からデータを取得して類似したテスト失敗をクラスタリング |

### job トリガーの使い分け

| タイプ | 用途 |
|--------|------|
| **Presubmit** | PR 作成時の軽量な検証 |
| **Postsubmit** | マージ後の品質確認 |
| **Periodic** | 大規模テストなど時間ベースの実行 |

### 著者の所感

Kubernetes の CI 基盤は、単にテストを実行するだけでなく、以下の点で非常によく設計されている：

- コストとパフォーマンスのバランスを考慮した設計
- 効率的な問題発見のための可視化
- 大規模環境での品質保証

---

## 参考リンク

- [test-infra アーキテクチャ図](https://github.com/kubernetes/test-infra/blob/5689258878c3cf974c1f324fba30a85358321555/docs/architecture.svg)
- [Prow](https://github.com/kubernetes/test-infra/tree/master/prow)
- [TestGrid](https://testgrid.k8s.io/)
- [Triage](https://go.k8s.io/triage)
- [Prow Jobs ドキュメント](https://docs.prow.k8s.io/docs/jobs/)
- [Kubemark Guide](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-scalability/kubemark-guide.md)
