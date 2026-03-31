---
title: "Terraform + Aurora Data APIでDBユーザー作成をIaC化した話"
source: "https://tech.timee.co.jp/entry/2026/03/30/155108"
author:
  - "[[徳富(@yannKazu1)]]"
published: 2026-03-30
created: 2026-03-31
description: "Aurora MySQLのData APIとTerraformのterraform_data + local-execを組み合わせてDBユーザー作成・権限付与をIaC化。Terraform 1.10のephemeralリソースと1.11のvalue_woを活用し、パスワードをstateに一切残さないセキュアな構成を実現した実践記事。"
tags:
  - "clippings"
  - "Terraform"
  - "AWS"
  - "Aurora"
  - "IaC"
  - "Database"
  - "Security"
  - "Platform Engineering"
---

## 概要

タイミー社プラットフォームエンジニアリングチームの徳富氏が、新規プロダクト立ち上げ時のDBユーザー作成・権限付与をTerraformでIaC化した事例を紹介する記事。Aurora MySQL 3.07以降で利用可能なRDS Data APIと、Terraformの`terraform_data`+`local-exec`プロビジョナーを組み合わせることで、VPC内の踏み台経由の手動SQL実行を排除した。さらに、Terraform 1.10の`ephemeral`リソースとTerraform 1.11の`value_wo`（write-only引数）を活用し、パスワードがstateファイルに一切残らないセキュアな構成を実現している。

## 主要なトピック

### 背景：ボイラープレートによるインフラ構築の自動化

- タイミー社ではTerraformのボイラープレートとDevin向け指示プロンプトをセットで管理するリポジトリを運用
- Devinに依頼するだけで数時間で以下が立ち上がる：
  - AWSアカウント作成
  - VPC・ECS・Aurora等の基盤構築
  - IAMロール・バックエンド・CI/CDワークフロー設定
  - Datadog設定、監査設定、ログ基盤
- **唯一の手動作業として残っていたのがDBユーザーの作成と権限付与**
  - 踏み台経由でDBに接続し、`CREATE USER`と`GRANT`を手動実行していた
  - ヒューマンエラーのリスク（権限付け忘れ、スペルミス等）

### なぜTerraformか

- Ansibleも検討したが、既存インフラがTerraformで一元管理されているため統一したい
- ツール増加による学習コスト・運用コストの増大を避ける
- ボイラープレートへの組み込みはTerraformモジュールの方がシンプル

### Aurora Data APIの活用

- **Aurora MySQL 3.07以降**でRDS Data APIに対応
- HTTPSエンドポイント経由でSQLを実行可能
- VPC内から直接DB接続する必要がなく、AWS CLIやSDKから操作可能
- `terraform_data`リソースの`local-exec`プロビジョナーと組み合わせてTerraformからDBユーザーを作成

### モジュール実装

#### DBユーザーの作成・削除

```hcl
resource "terraform_data" "db_user" {
  input = {
    rds_cluster_arn    = var.rds_cluster_arn
    rds_secret_arn     = var.rds_secret_arn
    database_name      = var.database_name
    username           = var.username
    ssm_parameter_name = var.ssm_parameter_name
  }

  provisioner "local-exec" {
    command = <<-EOT
      PASSWORD=$(aws ssm get-parameter --name "${self.input.ssm_parameter_name}" --with-decryption --query 'Parameter.Value' --output text)
      aws rds-data execute-statement \
        --resource-arn "${self.input.rds_cluster_arn}" \
        --secret-arn "${self.input.rds_secret_arn}" \
        --database "${self.input.database_name}" \
        --sql "CREATE USER IF NOT EXISTS '${self.input.username}'@'%' IDENTIFIED BY '$PASSWORD'"
    EOT
  }

  provisioner "local-exec" {
    when = destroy
    command = <<-EOT
      aws rds-data execute-statement \
        --resource-arn "${self.input.rds_cluster_arn}" \
        --secret-arn "${self.input.rds_secret_arn}" \
        --database "${self.input.database_name}" \
        --sql "DROP USER IF EXISTS '${self.input.username}'@'%'"
    EOT
  }
}
```

**設計ポイント：**

- `terraform_data`リソース + `local-exec`プロビジョナーでData API経由のSQL実行
- `CREATE USER IF NOT EXISTS`で**冪等性を担保**
- `when = destroy`で`terraform destroy`時にユーザーを自動削除
- パスワードはSSM Parameter Storeから取得

#### 権限の付与・取り消し

```hcl
resource "terraform_data" "db_grant" {
  for_each = { for idx, grant in var.grants : idx => grant }

  depends_on = [terraform_data.db_user]

  input = {
    rds_cluster_arn = var.rds_cluster_arn
    rds_secret_arn  = var.rds_secret_arn
    database_name   = var.database_name
    username        = var.username
    privileges      = each.value.privileges
    grant_database  = coalesce(each.value.database, var.database_name)
    grant_table     = coalesce(each.value.table, "*")
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws rds-data execute-statement \
        --resource-arn "${self.input.rds_cluster_arn}" \
        --secret-arn "${self.input.rds_secret_arn}" \
        --database "${self.input.database_name}" \
        --sql "GRANT ${self.input.privileges} ON ${self.input.grant_database}.${self.input.grant_table} TO '${self.input.username}'@'%'"
    EOT
  }

  provisioner "local-exec" {
    when = destroy
    command = <<-EOT
      aws rds-data execute-statement \
        --resource-arn "${self.input.rds_cluster_arn}" \
        --secret-arn "${self.input.rds_secret_arn}" \
        --database "${self.input.database_name}" \
        --sql "REVOKE ${self.input.privileges} ON ${self.input.grant_database}.${self.input.grant_table} FROM '${self.input.username}'@'%'" || true
    EOT
  }
}
```

- `for_each`で権限セットを柔軟に定義可能
- DMLとDDLを分けて付与するケースにも対応

#### モジュールの使用例

```hcl
module "db_user_app" {
  source = "../../modules/db_user"

  rds_cluster_arn    = module.aurora_main.cluster_arn
  rds_secret_arn     = module.aurora_main.cluster_master_user_secret[0].secret_arn
  database_name      = "hoge_db"
  username           = "hoge_app_user"
  ssm_parameter_name = aws_ssm_parameter.app_db_password.name

  depends_on = [
    aws_ssm_parameter.app_db_password,
    module.aurora_main,
  ]

  grants = [
    {
      privileges = "SELECT, INSERT, UPDATE, DELETE"          # DML権限
    },
    {
      privileges = "CREATE, ALTER, DROP, INDEX, REFERENCES"  # DDL権限
    }
  ]
}
```

### パスワードをstateに残さない工夫（最重要ポイント）

Terraformでパスワードを扱う際の課題：

- `sensitive = true`を付けてもplan出力でマスクされるだけで**stateには平文で残る**

**解決策：Terraform 1.10 `ephemeral`リソース + Terraform 1.11 `value_wo`の組み合わせ**

```hcl
ephemeral "random_password" "app_db" {
  length  = 32
  special = false
}

resource "aws_ssm_parameter" "app_db_password" {
  name             = "/${var.app_name}/${var.env}/db/app_user_password"
  type             = "SecureString"
  value_wo         = ephemeral.random_password.app_db.result
  value_wo_version = 1
}
```

#### `ephemeral`リソース（Terraform 1.10）

- planやstateに**一切値が保存されない**新しいリソースタイプ
- 毎回のplan/apply時に一時的に生成され、使い終わったら破棄
- 従来の`resource "random_password"`だとstateに記録されてしまう問題を解消

#### `value_wo`（write-only引数）（Terraform 1.11）

- SSM Parameter Storeへの書き込みは行われるが、**stateやplanファイルには保存されない**
- `value_wo_version`は変更検知用のバージョン番号
  - インクリメントすれば次のapply時に新しいパスワードが生成・設定される
  - 変更しなければSSM Parameter Storeの値は更新されない

この2つの組み合わせで、**パスワードの生成から保存まで一度もstateにパスワードが記録されないフロー**を実現。

## 重要な事実・データ

- **Aurora MySQL 3.07以降**でRDS Data APIが利用可能
- **Terraform 1.10**で`ephemeral`リソースが導入
- **Terraform 1.11**で`value_wo`（write-only引数）が導入
- Devinを活用したインフラ構築は**数時間で完了**する体制
- パスワード長は**32文字**（`special = false`）

## 結論・示唆

### 著者の結論

- Aurora Data APIとTerraformの`terraform_data`+`local-exec`の組み合わせで、DBユーザー管理のIaC化に成功
- `ephemeral`と`value_wo`はまだ比較的新しい機能だが、パスワード管理で困っている場合は有効な選択肢
- ボイラープレートにモジュールとして組み込むことで、Devinによる完全自動化のインフラ構築が実現

### 実践的な示唆

- Data APIを使えばVPC内の踏み台を経由せずにDB操作が可能になり、IaCとの相性が良い
- `ephemeral` + `value_wo`の組み合わせは、Terraform全般のシークレット管理パターンとして応用可能
- `for_each`を使った権限定義は可読性が高く、読み取り専用ユーザー追加等の拡張も容易

## 制限事項・注意点

- **パスワードの更新（`ALTER USER`）には未対応**
  - Terraformプロビジョナーには`when = create`と`when = destroy`のみで、`when = update`が存在しない
  - `terraform_data`の`input`変更時は`DROP USER` → `CREATE USER`（replace）となるため、パスワード変更だけしたいケースには大げさ
  - `when = update`の追加はHashiCorp GitHubリポジトリにIssueあり（[hashicorp/terraform#35825](https://github.com/hashicorp/terraform/issues/35825)）
  - パスワード更新が必要な場合は手動対応か別の仕組みが必要
- 新規プロダクト立ち上げ時の初期ユーザー作成用途では、create/destroyだけで十分に機能

## 参考リンク

- [Amazon Aurora MySQL で RDS Data API のサポートを開始](https://aws.amazon.com/jp/about-aws/whats-new/2024/09/amazon-aurora-mysql-rds-data-api/)
- [RDS Data API でサポートされているリージョンと Aurora DB エンジン](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Concepts.Aurora_Fea_Regions_DB-eng.Feature.Data_API.html)
- [Terraform 1.11 brings ephemeral values to managed resources with write-only arguments](https://www.hashicorp.com/en/blog/terraform-1-11-ephemeral-values-managed-resources-write-only-arguments)
- [Ephemeral values in Terraform](https://www.hashicorp.com/en/blog/ephemeral-values-in-terraform)
- [Ephemeral values in resources | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/language/resources/ephemeral)
- [Use temporary write-only arguments | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/language/manage-sensitive-data/write-only)
- [I would like provisioner/s to support when=update - hashicorp/terraform#35825](https://github.com/hashicorp/terraform/issues/35825)

---

*Source: [Terraform + Aurora Data APIでDBユーザー作成をIaC化した話](https://tech.timee.co.jp/entry/2026/03/30/155108)*
