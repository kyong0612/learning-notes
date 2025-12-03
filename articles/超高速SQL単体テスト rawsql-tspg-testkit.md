---
title: "超高速SQL単体テスト rawsql-ts/pg-testkit"
source: "https://zenn.dev/mkmonaka/articles/c2413d99ae67bb"
author:
  - "M Sugiura (mkmonaka)"
published: 2025-11-30
created: 2025-12-03
description: |
  Node.jsでSQLを高速に単体テストするライブラリ @rawsql-ts/pg-testkit の紹介。
  ZTD（ZeroTableDependency）という革新的な手法により、マイグレーション・シーディング・クリーンアップ工程を廃止し、
  実DBエンジンを使用しながらも高速で副作用のないSQL単体テストを実現する。
tags:
  - SQL
  - TypeScript
  - テスト
  - PostgreSQL
  - ORM
  - unittest
  - AI
---

## 概要

`@rawsql-ts/pg-testkit` は、Node.jsでSQLを高速に単体テストするためのライブラリ。生SQLはもちろん、PrismaやDrizzleなど既存ORMとも併用可能で、既存アーキテクチャを壊さずに導入できる。

---

## 従来の問題点

SQLの単体テストでは、一般的に以下の工程が必要：

1. **マイグレーション**（テーブル環境構築）
2. **シーディング**（テストデータ投入）
3. **テスト**
4. **クリーンアップ**（ロールバック、テーブル環境破棄）

### 課題

- DBという共有ストレージを使用するため、**テスト間の競合**に注意が必要
- 高速化が困難で、現状は以下の力業に頼ることが多い：
  - DBインスタンスを複数立てる
  - DBにスキーマを複数作成
  - テストデータが競合しないよう注意
- SQLite等のインメモリDBで対応する手法もあるが、実機との差異により「テストでは動くが実機で動かない」問題が発生

---

## 解決案：ZTD（ZeroTableDependency）

### ZTDとは

**「テーブル依存をゼロにすること」**

具体的には「本物のデータベースを使用するが、実テーブルの読み込みと書き込みをせず、全て影（CTE）に置き換えて実行する」こと。

### ZTDで実現できること

| メリット | 説明 |
|---------|------|
| **工程の廃止** | マイグレーション、シーディング、クリーンアップが不要 |
| **副作用なし** | 書込みしないため副作用がない |
| **並列実行対応** | データ競合問題を解消 |
| **高速試行** | テーブル定義の見直しを高速に試行可能 |
| **SQLロジック保証** | 単体テストでロジックの正しさを保証 |
| **低導入コスト** | 既存SQLリソースを動的に加工 |
| **製品コード非侵入** | テストキットとして完結 |

### AI時代との親和性

ZTDは以下の特徴を持ち、AI時代にふさわしいテストキットと言える：

- **resettable** - やり直しが何度でもできる
- **efficient** - 大量に試行できる
- **rewardable** - 各試行に対して自動的に評価が与えられる

> **注意**: ZTDはゼロDB依存ではない。実際のDBエンジンでSQLを実行する必要があるため、DBインスタンスは1つ必要（中身は空でOK）。

---

## ZTDの技術的実装

### 1. CTE Shadowing（読み込みの置換）

CTEに物理テーブル名と同じ名称を指定すると、CTE参照が優先される特性を利用。

**変換前：**

```sql
select * from users where id = 1
```

**ZTD変換後：**

```sql
with
    users as (
        select
            cast(1 as integer) as id
            , cast('Alice' as text) as name
            , cast('alice@example.com' as text) as email
            , cast('2023-01-01 10:00:00' as timestamp) as created_at
    )
select * from users where id = 1
```

### 2. Result Select Query（書き込みの置換）

CUD（Create/Update/Delete）を、実行結果をシミュレートする選択クエリに変換。

**UPDATE文の変換例：**

```sql
-- 変換前
update users set name = 'Bob' where id = 1 returning *

-- ZTD変換後
with
    users as (
        select
            cast(1 as integer) as id
            , cast('Alice' as text) as name
            , cast('alice@example.com' as text) as email
            , cast('2023-01-01 10:00:00' as timestamp) as created_at
    )
select
    users.id
    , 'Bob' as name  -- Alice を Bob に書き換えて返却
    , users.email
    , users.created_at
from users where id = 1
```

`returning`がない場合は、カウントクエリで表現：

```sql
select count(*) as count from users where id = 1
```

### 3. Connection Adaptor

`pg.Client.query`をフックし、SQLを実行する直前にZTD変換を適用。既存コードを変更せず、接続オブジェクトだけ差し替える仕組み。

> **要件**: DBコネクションをDIできる構造である必要がある

---

## オンラインデモ

ZTDの挙動を確認できるオンラインデモサイト：

🔗 <https://mk3008.github.io/rawsql-ts/cud-demo/index.html>

![オンラインデモのスクリーンショット](https://storage.googleapis.com/zenn-user-upload/075254aa2e5e-20251130.png)

---

## @rawsql-ts/pg-testkit の使い方

### インストール

```bash
npm install -D @rawsql-ts/pg-testkit
```

> **注意**: バージョン0.1.0には不具合があるため、0.1.1以降を使用すること

### 基本的な使用例

```typescript
import { Client } from 'pg';
import { createPgTestkitClient } from '@rawsql-ts/pg-testkit';

describe('UserRepository', () => {
  it('creates a user with defaults', async () => {
    const client = createPgTestkitClient({
      connectionFactory: () => new Client({ connectionString: process.env.TEST_DB! }),
      fixtures: [
        {
          tableName: 'users',
          columns: [
            { name: 'id', typeName: 'int', required: true, defaultValue: "nextval('users_id_seq'::regclass)" },
            { name: 'email', typeName: 'text', required: true },
            { name: 'active', typeName: 'bool', defaultValue: true },
            { name: 'created_at', typeName: 'timestamp', required: true, defaultValue: 'now()' }
          ],
          rows: [
            {
              id: 1,
              email: 'alice@example.com',
              active: true,
              created_at: '2023-01-01 10:00:00'
            }
          ]
        }
      ]
    });

    const result = await client.query(
      'insert into users (email, active) values ($1, $2) returning id, email, active, created_at',
      ['bob@example.com', false]
    );

    expect(result.rows[0]).toEqual({
      email: 'bob@example.com',
      active: false,
      created_at: expect.any(String)
    });
  });
});
```

### API詳細

#### `createPgTestkitClient`

ZTDを実装したテスト専用の疑似DBクライアントを初期化。

#### `connectionFactory`

本物のDBエンジンを使用するための接続設定。テーブル準備は不要。

#### `fixtures`

物理テーブルの代わりに使われる影テーブル（CTE）を定義：

- **tableName**: Shadowingするテーブル名（CTEの名前）
- **columns**: カラム定義（name, typeName, required, defaultValue）
- **rows**: テストデータ

---

## より高度な使い方

### デフォルト値・シーケンス・タイムスタンプ

| 項目 | 挙動 |
|------|------|
| デフォルト値（定数） | 再現される |
| シーケンス | 毎回1から連番 |
| タイムスタンプ | 固定値が返される |

### テーブル定義の管理

DDLファイルをインポートして共通管理：

```typescript
const ddlPath = path.resolve(__dirname, '../ddl/schemas');

const client = createPgTestkitClient({
  connectionFactory: () => new Client({ connectionString: process.env.TEST_DB! }),
  ddl: {
    directories: [ddlPath],
    extensions: ['.sql'],
  },
  tableRows: [
    {
      tableName: 'users',
      rows: [{ id: 1, email: 'alice@example.com', active: true }],
    },
  ],
});
```

---

## ZTDの制限事項

ZTDに**向いていないこと・スコープ外**のもの：

- ❌ ストアドプロシージャ
- ❌ トリガー
- ❌ View
- ❌ パフォーマンス・チューニング検証

---

## 今後の展望

マイグレーションスクリプト自動生成ツールを開発予定。DDLを比較してマイグレーションスクリプトを出力する機能。

🔗 <https://mk3008.github.io/rawsql-ts/migration-demo/index.html>

![マイグレーションデモのスクリーンショット](https://storage.googleapis.com/zenn-user-upload/9bbcbb8fd161-20251130.png)

---

## コラム：ZTDとORMとAI

ZTDが一般化した場合、**ORMはAIにとってオーバーヘッド**になる可能性がある：

- AIにとってSQLをDSLに変換する必要はない
- DSLで管理するメリットは減少
- SQLで最終的なデータ形状を直接作れば、DTO変換やマッピング処理は不要
- ORMのテーブルを模写したデータモデルを使用する場面がない

> **SQLはまるでAPIのように、ドメインの要求に直接応答する。**
> **必要なコードはすべてSQLにあり、ライブラリの深部を探る必要はない。**
> **AIはORMを「余計な抽象化」と認識する日が来るかもしれない。**

---

## 重要なポイントまとめ

1. **ZTD（ZeroTableDependency）** は革新的なSQL単体テスト手法
2. **CTEを活用**して物理テーブルへのアクセスを完全に排除
3. **実DBエンジンを使用**するため「テストでは動くが実機で動かない」問題を回避
4. **既存コードを変更せず**接続オブジェクトの差し替えだけで導入可能
5. **AI時代に適した**resettable, efficient, rewardableな特性を持つ
