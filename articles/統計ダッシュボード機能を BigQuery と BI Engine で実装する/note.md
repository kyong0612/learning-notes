# 統計ダッシュボード機能を BigQuery と BI Engine で実装する

ref: <https://zenn.dev/team_zenn/articles/zenn-stats-with-google-cloud-bigquery>

## TL;DR

- 投稿ページの表示イベントは Google Analytics から BigQuery へ連携しており、イベントデータ（BigQuery）と記事データ（Cloud SQL）をどうJOINさせるかが課題
- 外部接続で BigQuery から Cloud SQL つなぐことにした
- 統計データ読み出し時、BigQuery を直接使うとクエリ毎に課金されてしまうため、BigQuery BI Engine を使うことにした
- スケジュールクエリを使い、BI Engine の容量に収まるように集計データを最小限にまとめる
- チャートは Chart.js で泥臭く見た目を整えて表示する
- 残課題: スロットは共有リソースであるため、負荷状況によっては統計ページの表示に時間がかかる可能性がある

## 目次

1. 前提
2. 検討した実現方法
3. BigQueryでユーザー毎統計データを集計するときの課題
   - 課題1. 認可
   - 課題2. 記事データとのJOIN
   - 課題3. クエリ課金
4. BigQuery BI Engine を使う
5. スケジュールクエリで必要最小限のデータを用意する
6. 本当に課金されないの？
7. 残課題: スロットの枯渇によりクエリ速度が落ちる可能性
8. グラフの描画は？
9. まとめ

## 前提

Zenn のアーキテクチャ概観は以下のようになっています。

統計ダッシュボードは自分が記事を書いていても欲しいと思いますし、Zennでもなんとか実現できないか模索していました。議論のすえ、チームとして用意しようと決めた統計は次の3つです。

- 期間ごとの表示回数が見られること
- 記事ごとの表示回数が見られること
- 執筆頻度がわかること

本稿では、期間ごとの表示回数に関する統計に限定して述べます。

## 検討した実現方法

Google Analytics に記録されたイベントから、それが誰の記事なのかたどる必要があるため、メインDBである PostgreSQL on CloudSQL を何らかの形で使うことは確定です。

候補として考えた方法:

1. Cloud SQL に集計用データも持ち、Cloud SQL で完結させる
2. Cube Cloud から BigQuery、CloudSQL を使う
3. BigQuery から Cloud SQL のデータをどうにかして JOIN して使う（採用）

## BigQueryでユーザー毎統計データを集計するときの課題

### 課題1. 認可

統計情報はログインユーザーのみが閲覧できるようにする必要があります。そのため、

- リクエストは Rails で処理
- Rails の仕組みで認可を通す
- Rails から SDK で BigQuery の集計データを取得する

という流れで解決しました。

### 課題2. 記事データとのJOIN

page_view をはじめとしたイベントデータは BigQuery に蓄積されていて集計可能ですが、そのイベントが発生したページが誰の記事なのか特定できる必要があります。

- Datastream で PostgreSQL から BigQuery への CDC（変更データキャプチャ）を検討したが、制約が多く見送り。
- 代わりに、BigQuery の外部接続機能を利用し、Cloud SQL のデータを直接 BigQuery でクエリ可能にすることで解決。

### 課題3. クエリ課金

BigQuery はクエリ課金のため、頻繁なクエリ実行がコスト問題を引き起こします。1回10MB × 10万人 × 1回 = 1000TB → $6000/回。

**解決策:** BigQuery BI Engine を利用。

## BigQuery BI Engine を使う

- BI Engine にキャッシュされたデータは課金されない
- 必要なデータをメモリに保持し、高速化とコスト削減を実現
- BI Engine のキャッシュ内にデータを収めるため、スケジュールクエリでデータを集計・最適化

## スケジュールクエリで必要最小限のデータを用意する

- 日ごとの PV データに集約し、不要な情報を削減
- BI Engine のキャッシュ容量に収めるため、スケジュールクエリでデータを整理

```sql
INSERT INTO `${project_id}.zenn_stats`
SELECT
  event_date_jst,
  id,
  user_id,
  content_type,
  content_slug,
  pv
FROM
  tmp_article_pv_count_year
```

## 本当に課金されないの？

Google Cloud のコンソールでクエリ実行結果を確認。

```sql
SELECT
  event_date_jst,
  SUM(pv) AS sum_pv
FROM
  `content_pv_stats`
WHERE
  user_id = 1
  AND event_date_jst BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY
  user_id,
  event_date_jst
```

→ **BI Engine モード: FULL、課金されるバイト数: 0 B**

## 残課題: スロットの枯渇によりクエリ速度が落ちる可能性

スロットが枯渇すると統計ページの表示に待ち時間が発生。

- モニタリングを継続し、パフォーマンスを確認
- 必要に応じてスロットの追加を検討

## グラフの描画は？

Chart.js を使用して表示。

- 日ごとのデータでX軸を調整
- ラベルが重ならないよう最適化

## まとめ

- BigQuery と BI Engine を活用し、統計ダッシュボードを実装
- 認可、データJOIN、コスト削減などの課題を解決
- BI Engine で課金を抑えつつ、高速なデータ読み出しを実現
- まだ最適化の余地はあるため、引き続きモニタリングと改善を継続
