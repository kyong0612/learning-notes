---
title: "BigQuery DataFrames を試す"
source: "https://docs.cloud.google.com/bigquery/docs/dataframes-quickstart?hl=ja"
author: "Google Cloud"
published:
created: 2026-03-02
description: "BigQuery DataFrames API を使用して、BigQuery ノートブック上でデータ分析と機械学習（線形回帰）を行うクイックスタートガイド。ペンギンの公開データセットを用いた実践的なチュートリアル。"
tags:
  - "clippings"
  - "BigQuery"
  - "DataFrames"
  - "Google Cloud"
  - "Machine Learning"
  - "Python"
---

## 概要

BigQuery DataFrames API を使い、BigQuery ノートブック上で以下のデータ分析・機械学習（ML）タスクを実行するクイックスタートガイド。

- 公開データセットから DataFrame を作成する
- ペンギンの平均体重を計算する
- 線形回帰モデルを作成・学習・評価する

## 前提条件

### Google Cloud プロジェクトの準備

- Google Cloud プロジェクトを選択または作成する
- プロジェクト作成には `roles/resourcemanager.projectCreator` ロールが必要
- **課金が有効**であることを確認する
- **BigQuery API** が有効であることを確認する（新規プロジェクトでは自動的に有効化）

### 必要な IAM ロール

| ロール | 説明 |
|---|---|
| `roles/dataform.codeCreator` | Code Creator - ノートブックの作成 |
| `roles/aiplatform.notebookRuntimeUser` | Notebook Runtime User - ノートブックの実行 |
| `roles/bigquery.user` | BigQuery User - BigQuery の利用 |

## チュートリアル手順

### Step 1: DataFrame の作成とデータプレビュー

BigQuery の公開データセット `bigquery-public-data.ml_datasets.penguins` から DataFrame を作成する。

```python
import bigframes.pandas as bpd

bpd.options.bigquery.project = your_gcp_project_id

# "partial" モードはより効率的なクエリを生成するが、行の順序は保証されない
# pandas との互換性を重視する場合は "strict"（デフォルト）を使用
bpd.options.bigquery.ordering_mode = "partial"

query_or_table = "bigquery-public-data.ml_datasets.penguins"
df = bpd.read_gbq(query_or_table)

df.peek()
```

**ポイント**: `ordering_mode = "partial"` を設定すると効率的なクエリが生成されるが、`head()` など順序依存の操作は明示的なソート後にのみ機能する。

### Step 2: 平均体重の計算

pandas と同じ記法で集計が可能。計算はローカルではなく **BigQuery クエリエンジン上で実行**される。

```python
average_body_mass = df["body_mass_g"].mean()
print(f"average_body_mass: {average_body_mass}")
```

### Step 3: 線形回帰モデルの作成・学習・評価

Adelie ペンギンのデータを使い、体重 (`body_mass_g`) を予測する線形回帰モデルを構築する。

```python
from bigframes.ml.linear_model import LinearRegression

# Adelie ペンギンのデータのみに絞り込む
adelie_data = df[df.species == "Adelie Penguin (Pygoscelis adeliae)"]
adelie_data = adelie_data.drop(columns=["species"])
training_data = adelie_data.dropna()

# 特徴量とラベルの指定
X = training_data[
    ["island", "culmen_length_mm", "culmen_depth_mm", "flipper_length_mm", "sex"]
]
y = training_data[["body_mass_g"]]

model = LinearRegression(fit_intercept=False)
model.fit(X, y)
model.score(X, y)
```

**特徴量**: 島、嘴の長さ、嘴の深さ、ヒレの長さ、性別
**ラベル（目的変数）**: 体重 (body_mass_g)

## 重要なポイント

- **BigQuery DataFrames は pandas 互換の API** を提供し、計算は BigQuery エンジン上で実行されるため、大規模データにもスケーラブルに対応できる
- `bigframes.ml` モジュールにより、scikit-learn ライクなインターフェースで BigQuery ML のモデルを構築可能
- `bpd.read_gbq()` で BigQuery テーブルやクエリ結果を直接 DataFrame として読み込める

## クリーンアップ

チュートリアル用に作成したプロジェクトを削除することで、課金を停止できる。

## 次のステップ

- [BigQuery DataFrames ノートブックの使い方](https://github.com/googleapis/python-bigquery-dataframes/tree/main/notebooks/getting_started/getting_started_bq_dataframes.ipynb)
- [BigQuery DataFrames でのグラフ可視化](https://docs.cloud.google.com/bigquery/docs/dataframes-visualizations)
- [BigQuery DataFrames の詳細](https://docs.cloud.google.com/bigquery/docs/bigquery-dataframes-introduction)
