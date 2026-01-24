---
title: "きめ細かいアクセス制御を構成する  |  Spanner"
source: "https://docs.cloud.google.com/spanner/docs/configure-fgac?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published: 2026-01-23
created: 2026-01-24
description: "SpannerのFine-Grained Access Control（きめ細かいアクセス制御）を構成する方法を解説。データベースロールの作成・権限付与、ロール階層の構築、IAMを通じたプリンシパルへのロール付与手順を詳述。"
tags:
  - "clippings"
  - "Spanner"
  - "Google Cloud"
  - "FGAC"
  - "アクセス制御"
  - "IAM"
  - "データベースセキュリティ"
---

## 概要

Spannerのきめ細かいアクセス制御（Fine-Grained Access Control: FGAC）は、データベースレベルよりも詳細なアクセス権限を管理するための機能である。GoogleSQL言語データベースとPostgreSQL言語データベースの両方で利用可能。

## 構成手順

きめ細かいアクセス制御は以下の手順で構成する：

1. **データベースロールを作成し、権限を付与する**
2. **（省略可）継承されたロールの階層を作成する**
3. **プリンシパルにデータベースロールを付与する**
4. **データベースロールを使用するようにユーザーとデベロッパーに通知する**

## 前提条件

- きめ細かいアクセス制御ユーザーになる各プリンシパルに `Cloud Spanner Viewer` IAMロール（`roles/spanner.viewer`）が付与されていること
- このロールはプロジェクトレベルで付与することが推奨される

## データベースロールの作成と権限付与

### 基本概念

- **データベースロール**: 詳細なアクセス権限のコレクション
- **制限**: 各データベースに最大100個のデータベースロールを作成可能
- **推奨**: スキーマ変更は個別ではなくバッチで発行する

### コンソールでの操作

1. Google Cloud コンソールの「インスタンス」ページに移動
2. ロールを追加するデータベースを含むインスタンス → データベースを選択
3. 「概要」ページで「Spanner Studio」をクリック
4. `CREATE ROLE` ステートメントでロールを作成
5. `GRANT` ステートメントで権限を付与

### DDL構文例

**GoogleSQL:**

```sql
CREATE ROLE hr_manager;
GRANT SELECT, INSERT, UPDATE ON TABLE employees, contractors TO ROLE hr_manager;
```

**PostgreSQL:**

```sql
CREATE ROLE hr_manager;
GRANT SELECT, INSERT, UPDATE ON TABLE employees, contractors TO hr_manager;
```

### gcloud CLIでの操作

```bash
gcloud spanner databases ddl update DATABASE_NAME \
  --instance=INSTANCE_NAME \
  --ddl='CREATE ROLE ROLE_NAME; GRANT PRIVILEGES ON TABLE TABLES TO ROLE ROLE_NAME;'
```

## ロール階層の作成

データベースロールの階層を作成することで、子ロールが親ロールから権限を継承できる。

**GoogleSQL:**

```sql
GRANT ROLE role1 TO ROLE role2;
```

**PostgreSQL:**

```sql
GRANT role1 TO role2;
```

## プリンシパルへのデータベースロール付与

### 必要なIAMロール

1. **`roles/spanner.fineGrainedAccessUser`**: きめ細かいアクセス制御ユーザーロール（プリンシパルごとに1回付与）
2. **`roles/spanner.databaseRoleUser`**: データベースロールユーザーロール（IAM条件で特定のロールを指定）

### IAM条件の設定

特定のデータベースロールへのアクセスを制限するためにIAM条件を使用：

```
resource.type == "spanner.googleapis.com/DatabaseRole" && 
resource.name.endsWith("/ROLE_NAME")
```

複数のロールを付与する場合：

```
resource.type == "spanner.googleapis.com/DatabaseRole" && 
(resource.name.endsWith("/ROLE1") || resource.name.endsWith("/ROLE2"))
```

> **重要**: 条件を指定しない場合、プリンシパルはすべてのデータベースロールにアクセスできてしまう。

### gcloud CLIでの付与例

```bash
# 1. きめ細かいアクセス制御ユーザーとして有効化
gcloud spanner databases add-iam-policy-binding DATABASE_NAME \
  --instance=INSTANCE_NAME \
  --role=roles/spanner.fineGrainedAccessUser \
  --member=MEMBER_NAME \
  --condition=None

# 2. 特定のデータベースロールへのアクセス権を付与
gcloud spanner databases add-iam-policy-binding DATABASE_NAME \
  --instance=INSTANCE_NAME \
  --role=roles/spanner.databaseRoleUser \
  --member=user:jsmith@example.com \
  --condition='expression=(resource.type=="spanner.googleapis.com/DatabaseRole" && (resource.name.endsWith("/hr_rep") || resource.name.endsWith("/hr_manager"))),title=HRroles,description=Grant permissions on HR roles'
```

## 権限の確認

### ロールに付与された権限を確認

**GoogleSQL:**

```sql
SELECT * FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES WHERE grantee='ROLE_NAME';
SELECT * FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES WHERE grantee='ROLE_NAME';
SELECT * FROM INFORMATION_SCHEMA.CHANGE_STREAM_PRIVILEGES WHERE grantee='ROLE_NAME';
```

**PostgreSQL:**

```sql
SELECT * FROM information_schema.table_privileges WHERE grantee='ROLE_NAME';
SELECT * FROM information_schema.column_privileges WHERE grantee='ROLE_NAME';
SELECT * FROM information_schema.change_stream_privileges WHERE grantee='ROLE_NAME';
```

### データベースロールの一覧表示

**gcloud CLI:**

```bash
gcloud spanner databases roles list --database=DATABASE_NAME --instance=INSTANCE_NAME
```

### きめ細かいアクセス制御ユーザーの確認

```bash
gcloud asset search-all-iam-policies \
  --scope=projects/PROJECT_NAME \
  --query='roles=roles/spanner.fineGrainedAccessUser AND resource=//spanner.googleapis.com/projects/PROJECT_NAME/instances/INSTANCE_NAME/databases/DATABASE_NAME' \
  --flatten=policy.bindings[].members[] \
  --format='table(policy.bindings.members)'
```

## プリンシパルの移行

データベースレベルのアクセス制御からきめ細かいアクセス制御に移行する手順：

1. プリンシパルに対してきめ細かいアクセス制御を有効化し、必要なデータベースロールへのアクセス権を付与
2. アプリケーションを更新して適切なデータベースロールを指定
3. プリンシパルからIAMデータベースレベルのロールをすべて取り消す

> **例外**: Google Cloud コンソールでSpannerリソースを操作するには、すべてのユーザーに `roles/spanner.viewer` IAMロールが必要。

## データベースロールの削除

削除前に必要な操作：

1. ロールからきめ細かいアクセス制御権限をすべて取り消す
2. そのロールを参照するIAMポリシーバインディングをすべて削除

**手順:**

```sql
-- 1. 権限の取り消し
REVOKE SELECT, INSERT, UPDATE ON TABLE employees, contractors FROM ROLE hr_manager;

-- 2. ロールの削除
DROP ROLE hr_manager;
```

```bash
# IAM条件の削除
gcloud spanner databases remove-iam-policy-binding DATABASE_NAME \
  --instance=INSTANCE_NAME \
  --role=ROLE_NAME \
  --member=MEMBER_NAME \
  --condition=CONDITION
```

> **注意**: データベースロールを削除すると、そのロールから他のロールのメンバーシップが自動的に取り消される。

## 利用可能な権限

きめ細かいアクセス制御で使用可能な権限：
- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

## クライアントライブラリのサポート

以下の言語でクライアントライブラリが提供されている：
- C++
- C#
- Go
- Java
- Node.js
- PHP
- Python
- Ruby

## 関連情報

- [きめ細かいアクセス制御について](https://docs.cloud.google.com/spanner/docs/fgac-about?hl=ja)
- [変更ストリームのきめ細かいアクセス制御](https://docs.cloud.google.com/spanner/docs/fgac-change-streams?hl=ja)
- [詳細なアクセス制御を行うための権限](https://docs.cloud.google.com/spanner/docs/fgac-privileges?hl=ja)
- [GoogleSQL DDLリファレンス](https://docs.cloud.google.com/spanner/docs/reference/standard-sql/data-definition-language?hl=ja)
