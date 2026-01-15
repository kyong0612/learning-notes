---
title: "gruntwork-io/terragrunt: Terragrunt is a flexible orchestration tool that allows Infrastructure as Code written in OpenTofu/Terraform to scale."
source: "https://github.com/gruntwork-io/terragrunt"
author:
  - "[[Gruntwork]]"
  - "[[denis256]]"
published: 2016-05-10
created: 2026-01-15
description: "TerragruntはGruntworkが開発したTerraform/OpenTofu用のオーケストレーションツール。DRYな設定、リモートステート管理、依存関係の自動解決、マルチモジュール実行などを提供し、大規模なInfrastructure as Code（IaC）プロジェクトのスケーリングを可能にする。"
tags:
  - "clippings"
  - "Terraform"
  - "OpenTofu"
  - "IaC"
  - "Infrastructure as Code"
  - "DevOps"
  - "Gruntwork"
  - "AWS"
  - "Cloud"
---

## 概要

**Terragrunt**は、Gruntwork社が開発したTerraform/OpenTofu用の薄いラッパーツールです。大規模なInfrastructure as Code（IaC）プロジェクトにおいて、設定の重複を排除し（DRY原則）、リモートステートの管理を簡素化し、複数のモジュール間の依存関係を自動的に解決することで、インフラストラクチャコードのスケーラビリティを実現します。

Terragruntは2016年から開発が続けられており、2025年には大幅なCLIリデザイン、Stacks機能のGA化、パフォーマンス改善など、重要なアップデートが行われています。

## 主要な機能

### 1. DRY（Don't Repeat Yourself）設定

Terraformのbackendブロックは変数やinterpolationをサポートしないため、従来は各モジュールに同様の設定をコピー&ペーストする必要がありました。Terragruntはこの問題を解決します。

**主要なブロック・関数:**

| ブロック/関数 | 説明 |
|--------------|------|
| `remote_state` | バックエンドタイプと設定を定義。S3バケットやDynamoDBテーブルの自動作成も可能 |
| `include` | 親ディレクトリの共通設定を継承 |
| `path_relative_to_include()` | モジュールごとにユニークなstate keyを生成 |
| `find_in_parent_folders()` | 親設定ファイルを検索 |
| `dependency` | モジュール間の依存関係を宣言し、outputを参照 |

**典型的なフォルダ構成:**

```
root/
├── root.hcl           # 共通設定（remote_state等）
└── modules/
    ├── moduleA/
    │   ├── terragrunt.hcl  # include root.hcl
    │   └── main.tf
    ├── moduleB/
    │   ├── terragrunt.hcl
    │   └── main.tf
    └── moduleC/
        ├── terragrunt.hcl
        └── main.tf
```

### 2. リモートステート管理

- **自動生成**: `generate`ブロックにより`backend.tf`を自動生成
- **自動作成**: S3バケット、DynamoDBロックテーブル、GCSバケットなどのストレージリソースを自動作成
- **暗号化**: OpenTofuのネイティブstate暗号化をサポート
- **ネイティブロック**: OpenTofu 1.10以降、S3の`use_lockfile`によりDynamoDB不要でロック可能

### 3. Stacks（2025年GA化）

複数のユニット（モジュール）を論理的にグループ化する機能：

- `terragrunt.stack.hcl`で定義
- 再帰的なネストが可能
- `stack generate`、`stack run`、`stack output`、`stack clean`コマンド
- ユニット間での値の受け渡し

### 4. CLI機能

**2025年のCLIリデザイン:**

| 新コマンド | 説明 |
|-----------|------|
| `terragrunt run --all` | 全ユニットを依存関係順に実行（旧`run-all`を置換） |
| `terragrunt run --graph` | 依存関係グラフを可視化（旧`graph`を置換） |
| `terragrunt run --filter` | 実行対象をフィルタリング |
| `terragrunt exec` | 任意のコマンドを実行 |
| `terragrunt find` | ユニットを検索 |

**エラーハンドリング:**
- 新しい`errors`設定ブロック
- `exclude`ブロックで従来のskipロジックを置換
- 改善されたログ出力とサマリー

### 5. パフォーマンス最適化

| 機能 | 説明 |
|------|------|
| `runner_pool` | 並行実行と依存関係グラフ解決の高速化 |
| Provider Cache | グローバルプロバイダーキャッシュロック |
| CAS（Content Addressable Store） | モジュール/ソースフェッチの重複排除 |
| 依存関係最適化 | 最下層のoutputのみフェッチしてワーク削減 |

## Gruntwork Pipelines（CI/CD統合）

Terragruntと統合されたCI/CDソリューション：

- **変更検出**: モジュール/ファイル依存関係を理解
- **無視リスト**: 特定パスをスキップ
- **認証**: Azure OIDC、カスタム認証
- **環境**: セルフホスト/エアギャップ対応のGitHub/GitLab
- **レポート**: 実行サマリー、ログ、レポート

## OpenTofuとの統合

OpenTofu 1.10以降の主要機能との連携：

| OpenTofu機能 | Terragrunt連携 |
|--------------|----------------|
| ネイティブS3ロック | `use_lockfile`サポート |
| グローバルプロバイダーキャッシュロック | 安全な並行実行 |
| OpenTelemetryトレーシング | オーケストレーションフロー統合 |
| モジュール非推奨サポート | 移行支援 |
| OCIレジストリ | プロバイダー/モジュール配布 |

## 重要な事実・データ

- **ライセンス**: MIT License
- **言語**: Go
- **対応**: Terraform、OpenTofu両対応
- **バージョン**: v1.0に向けて安定化中（pre-1.0 deprecations完了）
- **OpenTofu**: Mozilla Public License v2.0（Terraformのライセンス制限を回避）

## 結論・示唆

### 採用のメリット

1. **スケーラビリティ**: 数百のモジュールを持つ大規模インフラでも管理可能
2. **DRY原則**: 設定の重複を排除しメンテナンス性向上
3. **自動化**: リモートステート作成、依存関係解決の自動化
4. **ライセンス**: OpenTofuとの組み合わせでBSLライセンス問題を回避

### 実践的な示唆

- **新規プロジェクト**: OpenTofu + Terragruntは最新機能（Stacks、ロック、キャッシュ）へのアクセスが可能
- **既存移行**: Terraform → OpenTofuへのアップグレード、remote_state設定の調整が必要
- **大規模運用**: Gruntwork Pipelines + Terragruntで依存関係解決、変更検出、blast radius制限
- **コスト削減**: DynamoDB不要のS3ロック、プロバイダーキャッシュによるインフラ・時間コスト削減

## 制限事項・注意点

- **学習曲線**: Stacks、フィルター、エラーブロックなど新機能の習得が必要
- **バージョン互換性**: 一部機能はOpenTofu ≥ 1.10が必要
- **実験的機能**: 一部機能はまだexperimentフラグ下にある
- **Gruntworkビジネスモデル**: Pipelines等の商用機能は別途契約が必要

## 関連リソース

- [Terragrunt公式ドキュメント](https://terragrunt.gruntwork.io/)
- [GitHubリポジトリ](https://github.com/gruntwork-io/terragrunt)
- [OpenTofu](https://opentofu.org/)
- [Gruntwork](https://www.gruntwork.io/)

---

*Source: [gruntwork-io/terragrunt](https://github.com/gruntwork-io/terragrunt)*
