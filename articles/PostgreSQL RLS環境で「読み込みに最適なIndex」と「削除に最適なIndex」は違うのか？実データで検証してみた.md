---
title: "PostgreSQL RLS環境で「読み込みに最適なIndex」と「削除に最適なIndex」は違うのか？実データで検証してみた"
source: "https://zenn.dev/toyb0x/articles/9eaac27525db2b"
author:
  - "[[Zenn]]"
published: 2025-06-25
created: 2025-06-25
description:
tags:
  - "clippings"
---
5

1[tech](https://zenn.dev/tech-or-idea)

## PostgreSQL RLS環境におけるIndex戦略の最適化：READ性能とCascade Delete性能のトレードオフ分析

## 概要

大規模なSaaSアプリケーションでPostgreSQLのRLSを活用している際、パフォーマンスチューニング過程で興味深い現象を発見しました。RLS用の複合Indexを導入したところ、READ性能は向上したものの、Delete性能(より正確にはCascade Delete性能)はあまり向上しませんでした。

この現象の背景には、PostgreSQLのRLSオプティマイザーが実行する以下の処理特性があります

1. **READ処理でのRLSポリシー適用**:  
 クエリに暗黙的に企業IDフィルターが追加されるため、複合Indexが効果的
2. **Cascade Delete処理の特殊性**:  
 外部キー制約がトリガーレベルで実行され、RLSポリシーを迂回する
3. **LEAKPROOFとオプティマイザー**:  
 関数のLEAKPROOF属性がIndex選択に影響

この現象を体系的に分析するため、実際のプロダクション環境を模した条件下で性能検証を実施し、RLS環境におけるIndex戦略の最適化について知見を得ることができました。

## 検証環境

### システム構成

- **PostgreSQL**: 16.8
- **データ規模**: 企業100社、製品100,000件、製品ログ12,000,000件
- **RLS構成**: 企業IDベースの行レベルセキュリティ

実際のSaaSアプリケーションを想定し、性能差が顕著に現れる1,200万件のデータセットで検証を実施しました。

**検証対象:**

1. **パターンA（基本Index）**: 外部キー単体Index
2. **パターンB（RLS複合Index）**: `(company_id, product_id)` 複合Index

## スキーマ設計とRLS実装

### データモデル定義

```sql
-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 企業テーブル
CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 製品テーブル
CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 製品ログテーブル
CREATE TABLE product_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    log_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Row Level Security実装

```sql
-- RLSの有効化
ALTER TABLE company ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_log ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY company_policy ON company
    FOR ALL
    TO PUBLIC
    USING (id = current_setting('app.current_company_id')::uuid);

CREATE POLICY product_policy ON product
    FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_company_id')::uuid);

CREATE POLICY product_log_policy ON product_log
    FOR ALL
    TO PUBLIC
    USING (company_id = current_setting('app.current_company_id')::uuid);
```

### 検証用ユーザー構成

RLSポリシーの適用を確実にするため、専用のデータベースユーザーを構成します：

```sql
-- RLS検証用ユーザーの作成
CREATE USER rls_user WITH PASSWORD 'testpass';

-- 必要な権限を付与
GRANT CONNECT ON DATABASE test TO rls_user;
GRANT USAGE ON SCHEMA public TO rls_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rls_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rls_user;

-- RLSポリシーを有効化（superuserは通常RLSの影響を受けないため）
ALTER TABLE company FORCE ROW LEVEL SECURITY;
ALTER TABLE product FORCE ROW LEVEL SECURITY;
ALTER TABLE product_log FORCE ROW LEVEL SECURITY;
```

## データセット構築

検証に必要な大容量データセットを構築します。

```sql
-- 企業データ: 100社
INSERT INTO company (name)
SELECT 'Company ' || i FROM generate_series(1, 100) i;

-- 製品データ: 100,000件（各企業ごとに1,000件）
INSERT INTO product (company_id, name)
SELECT
    c.id,
    'Product ' || generate_series
FROM company c
CROSS JOIN generate_series(1, 1000);

-- 製品ログデータ: 1,200万件（各製品ごとに約120件）
-- 大量データをバッチ処理で効率的に投入
INSERT INTO product_log (product_id, company_id, log_data)
SELECT
    p.id,
    p.company_id,
    'Log data for product ' || p.name || ' entry ' || generate_series
FROM product p
CROSS JOIN generate_series(1, 120);
```

投入結果の確認：

```sql
SELECT 'company' as table_name, count(*) as count FROM company
UNION ALL
SELECT 'product' as table_name, count(*) as count FROM product
UNION ALL
SELECT 'product_log' as table_name, count(*) as count FROM product_log;
```

```
table_name  |   count
-------------+-----------
 company     |       100
 product     |   100,000
 product_log | 12,000,000
```

データセットの構築が完了しました。

## RLSポリシー動作検証

性能測定に先立ち、RLS専用ユーザーでのアクセステストにより、企業ID設定時は該当企業のデータのみアクセス可能で、他企業データは完全に隠蔽されることを確認しました。

### RLS専用ユーザーでの接続とセッション設定

```bash
# RLS専用ユーザーでPostgreSQLに接続
psql -h localhost -U rls_user -d test
```

### 企業A（company\_id設定）でのデータアクセス確認

```sql
-- 企業Aのセッション設定
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

-- アクセス可能データの確認
SELECT COUNT(*) FROM company;        -- 結果: 1件（企業A分のみ）
SELECT COUNT(*) FROM product;       -- 結果: 1,000件（企業A分のみ）
SELECT COUNT(*) FROM product_log;   -- 結果: 120,000件（企業A分のみ）
```

### 他企業データへのアクセス禁止確認

```sql
-- 企業Bのセッション設定
SET app.current_company_id = 'aaaaaaaa-1111-2222-3333-bbbbbbbbbbbb';

-- アクセス可能データの確認（該当企業のデータが存在しない場合）
SELECT COUNT(*) FROM company;        -- 結果: 0件
SELECT COUNT(*) FROM product;       -- 結果: 0件
SELECT COUNT(*) FROM product_log;   -- 結果: 0件
```

### superuserでの全データアクセス確認

```sql
-- superuserで接続（比較用）
-- psql -h localhost -U test -d test

SELECT COUNT(*) FROM company;        -- 結果: 100件（全企業）
SELECT COUNT(*) FROM product;       -- 結果: 100,000件（全製品）
SELECT COUNT(*) FROM product_log;   -- 結果: 12,000,000件（全ログ）
```

## Index戦略の性能比較

2つの異なるIndex戦略による性能差を定量的に分析します。

### パターンA: 基本Index戦略（外部キー単体）

```sql
-- 外部キー単体のIndexのみ作成
CREATE INDEX idx_product_company_id_basic ON product(company_id);
CREATE INDEX idx_product_log_product_id_basic ON product_log(product_id);
```

### パターンB: RLS複合Index戦略

```sql
-- RLS用複合Indexを作成
CREATE INDEX idx_product_rls_compound ON product(company_id, id);
CREATE INDEX idx_product_log_rls_compound ON product_log(company_id, product_id);
```

両戦略のREAD性能とCascade Delete性能を定量的に測定します。

## READ性能検証

RLS適用環境下での実際の業務クエリ性能を測定します。

### 検証用データの特定

まず、RLS適用下で検証に使用する企業とその製品を特定します：

```sql
-- RLS適用ユーザー（rls_user）で接続してセッション設定
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

-- 検証用製品IDを取得
SELECT id, name FROM product LIMIT 1;
-- 結果例: id = '90eef3a2-778d-4778-aaf9-ac261dfa7a6a', name = 'Product 1'
```

### パターンA（基本Index戦略）でのREAD性能

RLS適用下で特定の製品のログを検索します：

```sql
-- RLS適用セッションでの実行（rls_user）
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM product_log
WHERE product_id = '90eef3a2-778d-4778-aaf9-ac261dfa7a6a'::uuid;
```

**実行結果：**

```
Bitmap Heap Scan on product_log  (cost=7.23..1458.87 rows=4 width=0) (actual time=0.083..0.159 rows=120 loops=1)
Execution Time: 0.214 ms  ⚡ (120件のログを処理)
```

詳細なEXPLAIN結果（パターンA - product\_idでの検索）

### パターンB（RLS複合Index戦略）でのREAD性能

同じくRLS適用下で同じ製品のログを検索します：

```sql
-- RLS適用セッションでの実行（rls_user）
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM product_log
WHERE product_id = '90eef3a2-778d-4778-aaf9-ac261dfa7a6a'::uuid;
```

**実行結果：**

```
Index Only Scan using idx_product_log_rls_compound on product_log
Execution Time: 0.124 ms  ⚡ (120件のログを処理)
```

詳細なEXPLAIN結果（パターンB - product\_idでの検索）

**READ性能分析**: RLS適用環境下では、product\_id検索においてRLS複合Indexが約1.7倍の性能向上を実現。

## Cascade Delete性能検証

RLS適用環境下でのCascade Delete処理における性能特性を分析します。

### 削除前の件数確認

```sql
-- RLS適用セッションでの実行（rls_user）
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

-- 削除前の件数確認
SELECT COUNT(*) FROM product;       -- 結果: 1,000件
SELECT COUNT(*) FROM product_log;   -- 結果: 120,000件
```

### パターンA（基本Index戦略）でのCascade Delete

RLS適用下で製品10件を削除し、Cascade Deleteでproduct\_logも連動削除されます（ **約1,200件のログが削除される** ）。

```sql
-- RLS適用セッションでの実行（rls_user）
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

EXPLAIN (ANALYZE, BUFFERS)
DELETE FROM product
WHERE id IN (
    SELECT id
    FROM product
    WHERE company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392'::uuid
    LIMIT 10
);
```

**実行結果：**

```
Trigger for constraint product_log_product_id_fkey: time=1.726 calls=10
Execution Time: 2.241 ms  ⚡
```

詳細なEXPLAIN結果（パターンA）

```
Delete on product  (cost=22.63..106.92 rows=0 width=0) (actual time=0.373..0.375 rows=0 loops=1)
  ->  Nested Loop  (cost=22.63..106.92 rows=1 width=46) (actual time=0.145..0.275 rows=10 loops=1)
        ->  HashAggregate  (cost=22.22..22.32 rows=10 width=56) (actual time=0.119..0.124 rows=10 loops=1)
              ->  Subquery Scan on "ANY_subquery"  (cost=0.01..22.19 rows=10 width=56) (actual time=0.035..0.112 rows=10 loops=1)
                    ->  Limit  (cost=0.01..22.09 rows=10 width=16) (actual time=0.025..0.100 rows=10 loops=1)
                          ->  Result  (cost=0.01..2281.01 rows=1033 width=16) (actual time=0.024..0.098 rows=10 loops=1)
Trigger for constraint product_log_product_id_fkey: time=1.726 calls=10
Execution Time: 2.241 ms
```

### パターンB（RLS複合Index戦略）でのCascade Delete

同じくRLS適用下で製品10件を削除します（ **約1,200件のログが削除される** ）。

```sql
-- RLS適用セッションでの実行（rls_user）
SET app.current_company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392';

EXPLAIN (ANALYZE, BUFFERS)
DELETE FROM product
WHERE id IN (
    SELECT id
    FROM product
    WHERE company_id = 'ccc80d25-986b-4861-8e0a-c8fe54b95392'::uuid
    LIMIT 10
);
```

**実行結果：**

```
Trigger for constraint product_log_product_id_fkey: time=126.666 calls=10
Execution Time: 127.117 ms  🐌
```

詳細なEXPLAIN結果（パターンB）

```
Delete on product  (cost=1.72..86.00 rows=0 width=0) (actual time=0.353..0.355 rows=0 loops=1)
  ->  Nested Loop  (cost=1.72..86.00 rows=1 width=46) (actual time=0.114..0.243 rows=10 loops=1)
        ->  HashAggregate  (cost=1.30..1.40 rows=10 width=56) (actual time=0.084..0.088 rows=10 loops=1)
              ->  Subquery Scan on "ANY_subquery"  (cost=0.42..1.27 rows=10 width=56) (actual time=0.072..0.078 rows=10 loops=1)
                    ->  Limit  (cost=0.42..1.17 rows=10 width=16) (actual time=0.063..0.066 rows=10 loops=1)
                          ->  Result  (cost=0.42..78.49 rows=1033 width=16) (actual time=0.061..0.064 rows=10 loops=1)
                                ->  Index Only Scan using idx_product_rls_compound on product product_1  (cost=0.42..78.49 rows=1033 width=16) (actual time=0.058..0.059 rows=10 loops=1)
Trigger for constraint product_log_product_id_fkey: time=126.666 calls=10
Execution Time: 127.117 ms
```

### 性能測定結果

| Index戦略 | READ性能 | Cascade Delete性能 |
| --- | --- | --- |
| **パターンA（基本Index）** | 0.214ms | 2.241ms |
| **パターンB（RLS複合Index）** | 0.124ms | 127.117ms |

### 分析結果

RLS環境下において、Index戦略による性能特性に顕著な差異が確認されました：

- **READ性能**: RLS複合Indexが1.7倍の性能向上（0.124ms vs 0.214ms）
- **Cascade Delete性能**: 基本Indexが57倍の性能向上（2.241ms vs 127.117ms）
- **トレードオフ**: RLS複合IndexはREAD性能を最適化する一方、CASCADE DELETE性能が大幅に悪化

すべての測定は、RLSポリシーが適用された実運用環境と同等の条件下で実施されています。

## 技術的分析

### RLSオプティマイザーとLEAKPROOFの影響

本検証結果の理解には、PostgreSQLのRLSメカニズムの詳細な理解が不可欠です：

#### READ処理におけるRLSポリシー適用

RLS環境下でのREAD処理では、以下のメカニズムが動作します：

1. **暗黙的フィルター追加**: PostgreSQLは自動的に `company_id = current_setting('app.current_company_id')` 条件を付与
2. **複合Index最適化**: RLS複合Index `(company_id, product_id)` により、両条件が単一Index内で効率処理
3. **Index Only Scanの実現**: 必要データがIndex内に含まれるため、Heap Fetchesが0となり高速化
4. **LEAKPROOFオペレーター**: `=` 演算子はLEAKPROOFであるため、セキュリティフィルターとの順序最適化が可能

#### Cascade Delete処理の特殊性

Cascade Delete処理では、RLSポリシーとは異なる処理経路を辿ります：

1. **RLSポリシー迂回**: Foreign Key制約トリガーは、RLSポリシーを迂回してシステムレベルで実行
2. **外部キー制約チェック**: 大量の `product_id` 単体検索が発生（company\_id条件なし）
3. **Index効率性の逆転**:
 - RLS複合Index: 先頭カラム（company\_id）なしの検索で非効率
 - 基本Index: product\_id直接検索で最適
4. **トリガー処理オーバーヘッド**: 基本Index 1.726ms vs RLS複合Index 126.666ms

### PostgreSQLオプティマイザーの動作特性

この性能差は、PostgreSQLの以下の設計思想に起因します：

- **セキュリティ優先**: RLSポリシーは常にユーザークエリレベルで適用
- **制約処理の分離**: Foreign Key制約はデータベースシステムレベルで処理
- **最適化の競合**: セキュリティポリシーと制約処理で異なる最適化戦略が必要

### 設計への示唆

RLS環境では、READ性能とCASCADE DELETE性能で最適なIndex戦略が対立する構造的な問題が存在します。これはPostgreSQLのアーキテクチャに起因する本質的な課題であり、従来のIndex設計手法では解決できません。

## 実装指針

### アプリケーション特性別戦略

#### READ性能重視型アプリケーション

```sql
-- RLS複合Indexを優先
CREATE INDEX idx_product_rls_compound ON product(company_id, id);
CREATE INDEX idx_product_log_rls_compound ON product_log(company_id, product_id);

-- 必要に応じて基本Indexを併用
CREATE INDEX idx_product_log_product_id ON product_log(product_id);
```

#### データライフサイクル管理重視型アプリケーション

```sql
-- Cascade Delete性能を最優先
CREATE INDEX idx_product_log_product_id ON product_log(product_id);
CREATE INDEX idx_product_company_id ON product(company_id);
```

#### ハイブリッド型アプリケーション

```sql
-- 両戦略のIndexを併用（ストレージコストとのトレードオフ）
CREATE INDEX idx_product_company_id ON product(company_id);
CREATE INDEX idx_product_log_company_id ON product_log(company_id);
CREATE INDEX idx_product_log_product_id ON product_log(product_id);
CREATE INDEX idx_product_log_rls_compound ON product_log(company_id, product_id);
```

## まとめ

### 主要な知見

本検証により、RLS環境における以下の重要な知見が得られました：

- **READ性能**: RLS複合Indexが1.7倍の性能向上を実現
 	- RLSポリシーによる暗黙的フィルターとLEAKPROOFオペレーターの最適化効果
- **Cascade Delete性能**: 基本Indexが57倍の性能向上を実現
 	- Foreign Key制約処理がRLSポリシーを迂回する設計に起因
- **設計原則**: PostgreSQLのアーキテクチャレベルでの処理分離により、用途別Index戦略が必要

### 実装における考慮点

1. **データライフサイクル**: 大量削除処理が頻繁な場合、外部キー単体Indexは必須
2. **クエリパターン**: READ性能重視の場合、RLS複合Indexが効果的
3. **リソース配分**: 両方の性能が求められる場合、複数Index併用も選択肢

### 結論

本検証により、PostgreSQLのRLS環境では、セキュリティポリシー適用層と制約処理層の分離により、従来のIndex設計理論が通用しない構造的な課題が存在することが明らかになりました。

LEAKPROOFオペレーターの最適化効果とCascade Delete処理のRLSポリシー迂回という、PostgreSQLアーキテクチャの根本的な特性を理解した上で、アプリケーションの性能要件に応じた適切なIndex戦略を選択すること重要です。

## 免責事項

- 本検証は特定環境での結果であり、実際の適用時は各環境での統計的な検証を推奨します
- 本記事はLLMと手書きを併用して作成しました  
 (今回のように大局的な情報共有が目的であれば、記事を書くのが楽になりましたね)

## 参考資料

- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) - 公式ドキュメント: RLSの概要
- [PostgreSQL Index Performance](https://www.postgresql.org/docs/current/sql-createindex.html) - 公式ドキュメント: Indexの作成と性能
- [PostgreSQLの行レベルセキュリティ(RLS)が実行計画に与える影響に関する記事](https://dev.classmethod.jp/articles/postgresql-optimizer-affected-by-rls/)

5

1
