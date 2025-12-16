---
title: "[Kiro powers]HashiCorp Terraform Powerがリリースされました | DevelopersIO"
source: "https://dev.classmethod.jp/articles/hashicorp-terraform-power/"
author:
  - "[[佐藤雅樹]]"
published: 2025-12-06
created: 2025-12-16
description: |
  HashiCorpがKiro powersのローンチパートナーとして、HashiCorp Terraform Powerをリリース。Terraform Powerをインストールすることで、Terraform関連タスク実行時に関連コンテキストやMCPサーバー設定が自動的に読み込まれ、トークン使用量の削減とレスポンス速度の向上が期待できる。
tags:
  - Terraform
  - Kiro
  - MCP
  - HashiCorp
  - IaC
  - AI
---

## 概要

HashiCorpがKiro powersのローンチパートナーとして、**HashiCorp Terraform Power** をリリースした。これにより、Terraform関連のタスクを実行する際に、関連するコンテキストやMCPサーバーの設定が自動的に読み込まれるようになる。

## Kiro Powersとは

Kiro powersは、以下を単一のインストールにまとめたもの：

- MCPツール
- ステアリングファイル
- フック

これにより、対象ツールやサービスのコンテキストを簡単にエージェントに渡すことができる。

> 参考: [Introducing Powers - AWS Japan Blog](https://aws.amazon.com/jp/blogs/news/introducing-powers/)

## HashiCorp Terraform Powerの特徴

### 自動コンテキスト読み込み

- Terraform関連のタスク（Terraformやデプロイなど）を実行する際に、関連コンテキストとMCPサーバー設定が自動的に読み込まれる
- **必要なときのみ**読み込まれるため、無関係なタスクでは読み込まれない
- これにより、**トークン使用量の削減**と**レスポンス速度の向上**が期待できる

![HashiCorp Terraform Powerの概念図](https://devio2024-2-media.developers.io/upload/32ZdLLZdCprKQbtJ3LM5po/2025-12-06/ZoXkWDrAgVHM.png)

### Powersの構成要素

設定ファイルは[GitHubリポジトリ](https://github.com/kirodotdev/powers/tree/main/terraform)で公開されている。

| ファイル | 説明 |
|---------|------|
| **POWER.md** | エントリポイントのステアリングファイル。利用可能なMCPサーバーやステアリングファイルについて記述 |
| **mcp.json** | MCPサーバーの設定ファイル。Terraform MCPサーバーの設定が含まれる |
| **Steering Files** | 追加のステアリングファイル。Terraformのスタイルガイドやベストプラクティスについて記述 |

## 実際の使用例

### インストール方法

1. Kiro IDEでPowerパネルを開く
2. `Deploy infrastructure with Terraform` → `Install` を選択

![Terraform Powerのインストール](https://devio2024-2-media.developers.io/upload/32ZdLLZdCprKQbtJ3LM5po/2025-12-05/0xsKyhAyAKS7.png)

### 動作確認

TerraformでVPCを作成するよう指示すると、以下のファイルが自動生成された：

- `version.tf`
- `provider.tf`
- `variables.tf`
- `main.tf`
- `outputs.tf`

![動作確認の様子](https://devio2024-2-media.developers.io/upload/32ZdLLZdCprKQbtJ3LM5po/2025-12-06/1865gCM2cQdj.png)

`Used Kiro power terraform` と表示され、Terraform Powerが使用されていることが確認できる。

### 自動生成されたコードの特徴

#### ベストプラクティスに準拠したファイル分割

- プロンプトで指示したり、独自のステアリングファイルを用意する必要なく、一般的なTerraformのベストプラクティスに則ったファイル分割が行われる

#### 最新バージョンの自動取得

- AWS Providerのバージョンについて、MCPサーバーを使って最新バージョンを取得する設定が定義されている

```hcl
# versions.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.25"
    }
  }
}
```

## 主要なメリット

1. **設定不要**: 利用者が独自にMCPサーバー設定やステアリングファイルを用意する必要がない
2. **トークン効率**: 必要なときのみコンテキストが読み込まれるため、トークン使用量を削減
3. **ベストプラクティス**: インストールするだけでベストプラクティスに沿ったTerraformコードを生成可能
4. **初心者向け**: Terraformをこれから始める方にもおすすめ

## 参考リンク

- [HashiCorp is a Kiro powers launch partner](https://www.hashicorp.com/en/blog/hashicorp-is-a-kiro-powers-launch-partner)
- [Terraform Power設定ファイル (GitHub)](https://github.com/kirodotdev/powers/tree/main/terraform)
- [Introducing Powers - AWS Japan Blog](https://aws.amazon.com/jp/blogs/news/introducing-powers/)
