---
title: "Explain EXPLAIN"
source: "https://speakerdeck.com/keiko713/explain-explain"
author:
  - "[[Keiko Oda]]"
published: 2024-12-06
created: 2025-09-17
description: "EXPLAINを使ったPostgreSQLのクエリ最適化の基本と実践"
tags:
  - "clippings"
  - "PostgreSQL"
  - "database"
  - "performance"
  - "query-optimization"
---

## スライド概要

### 1. Explain EXPLAIN EXPLAINを使ったPostgreSQLのクエリ最適化の基本と実践

![slide_0](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_0.jpg)
Keiko Oda - pganalyze

### 2. Speaker Introduction

![slide_1](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_1.jpg)

- 織田 敬子 (Keiko Oda)
- Product Engineer at pganalyze
- 金沢市在住

### 3. Today’s Goal

![slide_2](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_2.jpg)

- EXPLAINとPlannerの基本を抑える
- EXPLAINのプランノードについて理解する
- クエリ最適化のサイクルを押さえる
- 遅いクエリのパターンと対処法を学ぶ
- Plannerの気持ちを理解する

### 4. EXPLAINとPlannerの基本

![slide_3](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_3.jpg)

### 5. クエリ実行のOverview

![slide_4](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_4.jpg)
Postgres内部では、Parser, Rewriter, Planner, Executorの4ステップでクエリが実行される。

### 6. EXPLAINとは

![slide_5](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_5.jpg)
Plannerが作成したクエリの実行計画を表示するコマンド。

### 7. Plannerのおしごと

![slide_6](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_6.jpg)
最適な実行計画を作成することがPlannerの仕事。

### 8. Plannerのおしごと詳細

![slide_7](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_7.jpg)

1. 取りうるプランを全てリストアップ
2. 各プランのコストを計算
3. 最小コストのプランを選択

EXPLAINで、どのプランが選ばれ、どの部分にコストがかかっているかがわかる。

### 9. EXPLAINの使い方

![slide_8](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_8.jpg)
クエリの前に`EXPLAIN`をつけることでプランツリーが出力される。

### 10. EXPLAINのオプション

![slide_9](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_9.jpg)
`ANALYZE`, `VERBOSE`, `BUFFERS`, `FORMAT`, `COSTS`, `TIMING`などがある。

### 11. EXPLAINの使い方（例）

![slide_10](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_10.jpg)
オプションは括弧でくくる。`EXPLAIN (ANALYZE, BUFFERS, VERBOSE)`のように使用する。

### 12. EXPLAINの読み方

![slide_11](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_11.jpg)

### 13. EXPLAINの読み方 - COSTS

![slide_12](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_12.jpg)
実行計画の各ステップのコスト情報が表示される。

### 14. EXPLAINの読み方 - COSTS詳細

![slide_13](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_13.jpg)

- コストは時間やバイト数ではなく、実行の大変さを示す尺度。
- Plannerはコストが最小のプランを選ぶ。
- 統計情報が古いと、コスト見積もりが不正確になる可能性がある。

### 15. EXPLAINの読み方 - COSTSの内訳

![slide_14](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_14.jpg)

- **Start-up Cost**: 最初の行を取得するまでのコスト
- **Total Cost**: 全ての行を取得するまでのコスト
- **Rows**: 推定行数
- **Width**: 各行の平均バイト数

### 16. EXPLAINの読み方 - ANALYZE, TIMING

![slide_15](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_15.jpg)
`ANALYZE`オプションで実際の実行時間などが表示される。

### 17. EXPLAINの読み方 - ANALYZE, TIMING詳細

![slide_16](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_16.jpg)

- **Planning Time**: 実行計画の作成にかかった時間
- **Execution Time**: クエリの実行にかかった時間

### 18. EXPLAINの読み方 - ANALYZE, TIMINGの内訳

![slide_17](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_17.jpg)

- **Actual time**: 各ノードの実際の実行時間
- **Rows**: 実際に取得された行数
- **Loops**: ノードが実行された回数

### 19. EXPLAIN ANALYZEの注意点

![slide_18](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_18.jpg)
`loops`が複数回の場合、`actual time`や`rows`は1回あたりの値なので、合計値は掛け算で求める必要がある。

### 20. EXPLAINの読み方 - BUFFERS, I/O Timing

![slide_19](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_19.jpg)
`BUFFERS`オプションでバッファの使用状況が表示される。

### 21. BUFFERS, I/O Timing 詳細

![slide_20](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_20.jpg)

- **Buffer types**: `Shared block`, `Local block`, `Temp block`
- **Buffer events**: `Hit`, `Read`, `Dirtied`, `Written`

### 22. BUFFERS, I/O Timingのキャッシュヒット

![slide_21](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_21.jpg)
キャッシュから読まれた（Hit）か、ディスクから読まれた（Read）かがわかる。

### 23. BUFFERS, I/O Timingの例

![slide_22](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_22.jpg)
`shared hit=110 read=26202`は、110ブロックがキャッシュから、26202ブロックがディスクから読まれたことを示す。

### 24. pg_buffercacheエクステンション

![slide_23](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_23.jpg)
`pg_buffercache`エクステンションでバッファキャッシュの状態を詳細に確認できる。

### 25. BUFFERS, I/O Timingとtrack_io_timing

![slide_24](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_24.jpg)
`track_io_timing`を有効にすると、I/Oにかかった時間が表示され、パフォーマンス分析に役立つ。

### 26. EXPLAINのプランノード

![slide_25](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_25.jpg)

### 27. プランノード - Scan Nodes

![slide_26](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_26.jpg)

- **Sequential Scan**: 全行スキャン
- **Index Scan**: インデックスを使ってテーブルから行を取得
- **Index-Only Scan**: インデックスから直接データを取得
- **Bitmap Index Scan/Bitmap Heap Scan**: 複数のインデックス条件を組み合わせる場合に効率的

### 28. プランノード - Join Nodes

![slide_27](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_27.jpg)

- **Nested Loop**: 小さいテーブルの結合に適している
- **Merge Join**: ソート済みの大きなテーブル同士の結合に適している
- **Hash Join**: 等価結合で、片方のテーブルがメモリに収まる場合に効率的

### 29. プランノード - Other Nodes

![slide_28](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_28.jpg)
`Aggregate`, `Append`, `Limit`, `Sort`, `Unique`などがある。

### 30. プランごとのコスト比較

![slide_29](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_29.jpg)

### 31. 使用するクエリ

![slide_30](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_30.jpg)
`tenk1`と`tenk2`テーブルをJOINするクエリを例に比較。

### 32. ① デフォルトプラン

![slide_31](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_31.jpg)
`Bitmap Heap Scan`と`Nested Loop`が選択された。

### 33. ① デフォルトプラン詳細1

![slide_32](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_32.jpg)
`tenk1`から`Bitmap Index Scan`でデータを絞り込む。

### 34. ① デフォルトプラン詳細2

![slide_33](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_33.jpg)
`Nested Loop`で`tenk1`と`tenk2`を結合。

### 35. ② SET enable_bitmapscan = off

![slide_34](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_34.jpg)
`Bitmap Scan`を無効にすると`Index Scan`が使われる。

### 36. ② SET enable_bitmapscan = off 詳細1

![slide_35](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_35.jpg)
`tenk1`から`Index Scan`でデータを絞り込む。

### 37. ② SET enable_bitmapscan = off 詳細2

![slide_36](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_36.jpg)
`Nested Loop`で結合。

### 38. ③ SET enable_bitmapscan, enable_indexscan = off

![slide_37](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_37.jpg)
`Index Scan`も無効にすると`Hash Join`と`Seq Scan`が使われる。

### 39. ③ 詳細1

![slide_38](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_38.jpg)
`tenk1`から`Seq Scan`でデータを絞り込む。

### 40. ③ 詳細2

![slide_39](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_39.jpg)
ハッシュテーブルを作成。

### 41. ③ 詳細3

![slide_40](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_40.jpg)
`Hash Join`で結合。

### 42. コストの比較

![slide_41](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_41.jpg)
Plannerは最もコストの低い`Nested Loop` + `Bitmap Scan`を正しく選択している。

### 43. コストの比較詳細

![slide_42](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_42.jpg)
各プランのコストが高くなる理由の考察。

### 44. クエリの最適化

![slide_43](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_43.jpg)

### 45. クエリ最適化のサイクル

![slide_44](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_44.jpg)

1. ベンチマーク測定
2. 改善箇所の仮説設定
3. 改善の適用
4. 変更の確定

### 46. auto_explain

![slide_45](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_45.jpg)
Slow Queryの実行計画を自動的にログに出力するエクステンション。

### 47. ① ベンチマーク測定

![slide_46](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_46.jpg)

- `EXPLAIN ANALYZE`を複数回実行し、キャッシュの影響を排除する。
- 複数のパラメータで測定する。

### 48. ② 改善箇所の仮説設定

![slide_47](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_47.jpg)
プラン可視化ツール（Dalibo, Depeszなど）を使い、問題のあるノードを特定する。

### 49. ③ 改善の適用

![slide_48](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_48.jpg)

- インデックスの追加・見直し
- 統計情報の更新
- クエリの書き直し
- プランの強制（`pg_hint_plan`など）

### 50. クエリ改善の例

![slide_49](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_49.jpg)

### 51. クエリ改善の例

![slide_50](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_50.jpg)

- Slow Scan
- ORDER BY + LIMITの罠

### 52. 統計情報

![slide_51](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_51.jpg)
Postgresはテーブルの統計情報（`pg_stats`）を元にプランを決定する。`ANALYZE`で更新される。

### 53. SelectivityとIndex

![slide_52](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_52.jpg)

- **Selectivity（選択度）**: 条件に一致する行の割合。
- 選択度が高い（絞り込める）場合はIndex Scan、低い場合はSequential Scanが効率的。

### 54. テストデータ（products）

![slide_53](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_53.jpg)
カフェの商品テーブル。

### 55. テストデータ（orders）

![slide_54](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_54.jpg)
カフェのオーダーテーブル（500万件）。

### 56. ① Slow Scan

![slide_55](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_55.jpg)
インデックスがないため、`Parallel Seq Scan`が使われている。

### 57. ① Slow Scan（プラン）

![slide_56](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_56.jpg)
`Parallel Seq Scan`のプラン詳細。

### 58. ① Slow Scan（図解）

![slide_57](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_57.jpg)
Parallel Scanのイメージ。

### 59. ① Slow Scan（改善後）

![slide_58](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_58.jpg)
`product_id`にインデックスを作成すると`Parallel Index Only Scan`が使われ、コストと実行時間が大幅に改善。

### 60. ① Slow Scan（図解）

![slide_59](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_59.jpg)
Bad index scanのイメージ。

### 61. ① Slow Scan（Selectivityが良い例）

![slide_60](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_60.jpg)
`user_id`のように選択度が高いカラムにインデックスを貼ると、効果が最大化される。

### 62. ① Slow Scan（インデックスと統計情報）

![slide_61](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_61.jpg)
`pg_stats`で各カラムのユニークな値の数（`n_distinct`）を確認できる。

### 63. ② ORDER BY + LIMITの罠

![slide_62](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_62.jpg)
`user_id`で絞り込んだ後、`created_at`でソートするクエリ。

### 64. ② ORDER BY + LIMITの罠（プラン）

![slide_63](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_63.jpg)
`Bitmap Heap Scan`の後に`Sort`が実行されている。

### 65. ② ORDER BY + LIMITの罠（プラン詳細）

![slide_64](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_64.jpg)
`user_id`のインデックスが使われているが、ソート処理が発生している。

### 66. ② ORDER BY + LIMITの罠（データ変更）

![slide_65](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_65.jpg)
データの分布を変えて`user_id`の選択度を意図的に悪くする。

### 67. ② ORDER BY + LIMITの罠（プラン変更）

![slide_66](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_66.jpg)
Plannerが`created_at`のインデックス（`Index Scan Backward`）を使うプランを選択するようになった。

### 68. ② ORDER BY + LIMITの罠（プラン詳細）

![slide_67](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_67.jpg)
しかし、このプランは`LIMIT`の数によっては非効率になることがある。

### 69. ② ORDER BY + LIMITの罠（非効率なケース）

![slide_68](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_68.jpg)
`LIMIT`を増やすと、`created_at`のインデックススキャンが広範囲になり、非常に遅くなる。

### 70. ② ORDER BY + LIMITの罠（回避策）

![slide_69](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_69.jpg)
`ORDER BY created_at+0`のように式を使うことで、`created_at`のインデックスを使わせないようにし、元の効率的なプランに戻すことができる。複合インデックス`(user_id, created_at)`を作成するのがより良い解決策。

### 71. クエリプランのトラッキング

![slide_70](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_70.jpg)
`auto_explain`, `aurora_stat_plans`, `pg_store_plans`などでプランの実行状況を追跡できる。

### 72. まとめ

![slide_71](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_71.jpg)

- EXPLAINはSlow Queryデバッグの強力なツール。
- Plannerが最適なプランを選べるように、適切なインデックスと最新の統計情報を提供することが重要。

### 73. Thank You

![slide_72](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_72.jpg)

### 74-84. 参考資料

![slide_73](https://files.speakerdeck.com/presentations/51f6b58a1b8a42448177f5e884a945aa/slide_73.jpg)
... (以降、参考資料と補足スライド)
