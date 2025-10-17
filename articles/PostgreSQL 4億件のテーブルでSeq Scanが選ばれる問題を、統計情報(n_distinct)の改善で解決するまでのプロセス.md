---
title: "PostgreSQL: 4億件のテーブルでSeq Scanが選ばれる問題を、統計情報(n_distinct)の改善で解決するまでのプロセス"
source: "https://future-architect.github.io/articles/20251010a/"
author:
  - "市川裕也"
published: 2025-10-10
created: 2025-10-17
description: "4億件のレコードを持つPostgreSQLテーブルでSeq Scanが不適切に選ばれる問題を、統計情報(n_distinct)の改善により解決したパフォーマンスチューニングの実践記録。原因調査から複数の解決策の比較検討、最終的な実施内容までを詳細に解説。"
tags:
  - "PostgreSQL"
  - "パフォーマンスチューニング"
  - "データベース"
  - "実行計画"
  - "n_distinct"
  - "統計情報"
---

## 概要

本記事は、4億件のレコードを持つPostgreSQLテーブルで発生したパフォーマンス問題について、原因調査から解決までのプロセスを共有する技術記事です。インデックスが存在するにも関わらずSeq Scanが選ばれてしまう問題に対し、統計情報の改善により根本的に解決した事例を紹介します。

**環境**

- PostgreSQL 15.5
- Amazon Aurora
- データ規模: 4億件のレコード

## 問題の概要

### 発生していた問題

複数の`parent_id`に紐づく`child`を一括で取得する以下のようなクエリで、タイムアウトが発生していました。

```sql
SELECT * FROM childs WHERE parent_id = ANY (ARRAY[...]);
```

- `parent_id`カラムにはインデックスが設定されているにも関わらず、**Seq Scanが実行**
- クエリの実行に**約68秒**かかっていた
- Seq Scanを無効化すると**約1秒**で完了

### 実行計画の詳細

**Seq Scanの場合（問題のある実行計画）:**

```
Seq Scan on childs  (cost=17.28..4083986.65 rows=2402424 width=228) 
  (actual time=18.351..68034.715 rows=487741 loops=1)
  Filter: (parent_id = ANY ('{1,2,3,4,..}'::bigint[]))
  Rows Removed by Filter: 26638329
  Execution Time: 68066.801 ms
```

**Bitmap Heap Scan（期待される実行計画）:**

```
Bitmap Heap Scan on childs  (cost=1270253.43..17566326.72 rows=55852774 width=132) 
  (actual time=1094.272..1168.348 rows=76774 loops=1)
  Recheck Cond: (parent_id = ANY ('{1,2,3,...)'))
  Execution Time: 1177.448 ms
```

## 原因分析

### 統計情報の乖離

問題の根本原因は、**`n_distinct`（カラム内のユニークな値の数を表す統計情報）が実態と大きく乖離していたこと**でした。

**`n_distinct`とは:**

- テーブル内でのユニークな値の個数を表す統計情報
- 正の値: そのままユニークな値の推定数
- 負の値(-1.0 ~ 0): (実際のユニーク数 / 全行数) × -1の値（割合として扱われる）

**統計情報と実態の比較:**

| 項目 | 統計情報の値 | 実際の値 |
|------|------------|---------|
| `n_distinct` | 67,122 | 15,480,429 |
| 1 parentあたりのchild数 | 約6,000個 | 約25個 |

```sql
-- 統計情報の確認
SELECT n_distinct FROM pg_stats 
WHERE tablename = 'childs' AND attname = 'parent_id';
-- 結果: 67122

-- 実際のユニーク数
SELECT COUNT(DISTINCT parent_id) FROM childs;
-- 結果: 15480429
```

この不正確な統計情報により、オプティマイザは「1つのparentに6,000個のchildが紐づいている」と誤認し、Index Scanよりも**Seq Scanの方がコストが低い**と誤って判断していました。

## 解決策の検討

### A案: `random_page_cost`の調整

**概要:**

- Index Scanが選ばれやすくなるように、`random_page_cost`を下げる
- デフォルトでは`random_page_cost=4.0`、`seq_page_cost=1.0`（HDD想定）
- SSD環境では実際のランダムアクセスコストはそこまで高くない

**メリット:**

- SSD環境では実態に即した設定になる
- デメリットが少ない

**デメリット:**

- 統計情報自体は改善されない
- parent数が多いと結局Seq Scanが選ばれる可能性がある

### B案: `stats target`の引き上げ

**概要:**

- `ANALYZE`時のサンプル数を増やして`n_distinct`の精度を上げる
- `stats target`のデフォルトは100（サンプル数 = stats target × 300）

**検証結果:**

| stats target | n_distinct | ANALYZE時間 |
|--------------|------------|-------------|
| 100（デフォルト） | 6.7万 | 25秒 |
| 200 | 9万 | 45秒 |
| 500 | 15万 | 62秒 |
| 1000 | 22万 | 114秒 |
| 2000 | 24万 | 362秒 |
| **実際の値** | **1400万** | - |

**評価:**

- stats targetを大幅に引き上げても、実際の値との乖離は大きい
- stats target=2500で一応Index Scanが選ばれるようになるが、ANALYZE時間が大幅に増加

### C案: `n_distinct`の手動変更

**概要:**

- `n_distinct`を実際のユニーク値に近い値に直接書き換える

```sql
-- 負の値で割合を指定
ALTER TABLE childs ALTER COLUMN parent_id SET (n_distinct = -0.1);
ANALYZE childs;
```

**メリット:**

- 根本的な解決が可能
- ANALYZE時間は変化しない
- 負の値（割合）で設定すれば、データ増加時も保守性を担保できる

**デメリット:**

- 手動で統計情報を変更するため、データ特性が変わると乖離が生じる可能性
- ただし、「parentsとchildsのレコード数の比率は将来も大きく変動しない」という特性があったため、今回のケースでは問題なし

### D案: `pg_hint_plan`によるヒント句

**概要:**

- SQLコメント内にヒント句を記述してスキャン方法を強制

```sql
/*+ IndexScan(childs) */
SELECT * FROM childs WHERE parent_id = ANY (ARRAY[...]);
```

**不採用理由:**

- ORM に組み込むのが困難（生SQLへの書き換えが必要）
- 統計情報を改善しないと、別の箇所で同様の問題が発生する可能性

## 解決策の比較と選択

### 各案の比較表

| 方針 | 解決可能か | 保守性 | ANALYZE時間 |
|------|-----------|--------|------------|
| B案: stats target を大きくする (< 2000) | △ | △ | 増加 |
| B案: stats target を大きくする (> 2500) | ○ | △ | 大幅増加 |
| C案: `n_distinct` 手動変更（正の数） | ○ | × | 変化なし |
| C案: `n_distinct` 手動変更（負の数） | ○ | △ | 変化なし |
| D案: ヒント句 | ○ | × | 変化なし |

### 最終的な選択

**採用した解決策:**

1. **A案: `random_page_cost`の調整** - SSD環境に最適化
2. **C案: `n_distinct`の手動変更（負の数）** - 根本原因の解消

この組み合わせにより、以下を実現:

- Index Scanが適切に選ばれるようになった
- データ増加時も保守性を担保（割合指定のため）
- ANALYZE時間の増加なし
- 根本的な統計情報の改善

## 実施内容と効果

```sql
-- random_page_costの調整（SSD環境に最適化）
ALTER SYSTEM SET random_page_cost = 1.1;

-- n_distinctを負の値（割合）で設定
ALTER TABLE childs ALTER COLUMN parent_id SET (n_distinct = -0.1);
ANALYZE childs;
```

**効果:**

- parent_idが多い場合でもIndex Scanが選ばれるようになった
- クエリ実行時間が**68秒から1秒程度**に改善

## Appendix: `n_distinct`の計算方法についての考察

### PostgreSQLの`n_distinct`計算式

PostgreSQLでは、`ANALYZE`実行時に以下の式で`n_distinct`を計算します：

```c
// f1: サンプル内で1回だけ出現した値の数
// d: サンプル内の異なる値の総数
// n: サンプル行数（NULL除く）
// N: テーブル全体の行数（NULL除く）

stadistinct = (n * d) / ((n - f1) + f1 * n / N);
```

### 計算式の問題点

1. **Nの影響が小さい:** Nが分母に含まれないため、テーブルサイズの影響が反映されにくい
2. **上限の制約:** f1が相当大きくないと、`n_distinct`の上限が`n`の整数倍で抑えられてしまう
   - 例: `f1 = 0.9n`の場合、`n_distinct ≤ 10d ≤ 10n`

### 代替案の検討

一部の開発者は、よりシンプルな式の方が精度が高いのではないかと提言しています：

```
n_distinct = d * N / n
```

この式は、サンプル内の異なる値の割合をそのままテーブル全体に外挿する「ナイーブ」な方法ですが、特に`d`がある程度大きい場合は、現在の計算式よりも精度が良くなる可能性があります。

## まとめ

### 重要なポイント

1. **統計情報の確認:** パフォーマンス問題が発生したら、まず統計情報と実態の乖離を確認
2. **複数の解決策を検討:** 一つの方法に固執せず、状況に応じた最適な解決策を選択
3. **SSD環境の最適化:** `random_page_cost`の調整は多くのSSD環境で有効
4. **データ特性の理解:** データの特性を理解することで、適切な統計情報の設定方法を選択できる

### 教訓

- オプティマイザが不適切な実行計画を選択する場合、統計情報の乖離が原因であることが多い
- 解決策はケースバイケース: アプリケーションやテーブルの規模によって最適な方法は異なる
- 手動での統計情報変更は有効だが、データ特性を十分に理解した上で実施する必要がある
- `n_distinct`を割合（負の値）で設定することで、スケーラビリティを確保できる場合がある

本記事が、同様のPostgreSQLパフォーマンス問題に直面している方の一助となれば幸いです。
