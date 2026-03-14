---
title: "スキーマの指定  |  BigQuery"
source: "https://docs.cloud.google.com/bigquery/docs/schemas?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published:
created: 2026-03-14
description: "BigQueryでテーブルスキーマを指定する方法を包括的に解説するドキュメント。コンソール、SQL、bqコマンドライン、クライアントライブラリ（C#, Go, Java, Python）を使用したスキーマ定義の手順、データ型、モード、柔軟な列名、JSONスキーマファイルの作成・使用方法、APIでのスキーマ指定までを網羅する。"
tags:
  - "clippings"
  - "BigQuery"
  - "GCP"
  - "Schema"
  - "SQL"
  - "Data Engineering"
---

## 概要

BigQueryでは、テーブルにデータを読み込む際や空のテーブルを作成する際に、テーブルのスキーマを指定できる。スキーマの[自動検出](https://docs.cloud.google.com/bigquery/docs/schema-detect?hl=ja#auto-detect)も利用可能。Avro、Parquet、ORC、Firestore/Datastoreエクスポートファイルは自己記述型のためスキーマが自動取得される。CSV・JSON（改行区切り）は手動指定または自動検出を選択できる。

スキーマの指定方法は以下の6つ:
- REST API（`tables.insert`、`jobs.insert`）
- JSONスキーマファイル
- bqコマンドラインツール（インライン）
- `CREATE TABLE` SQLステートメント
- Google Cloudコンソール

データ読み込み後や空テーブル作成後にも[テーブルのスキーマ定義を変更](https://docs.cloud.google.com/bigquery/docs/managing-table-schemas?hl=ja)できる。

## 主要なトピック

### スキーマのコンポーネント

#### 列名
- 使用可能文字: 英字（a-z, A-Z）、数字（0-9）、アンダースコア（_）
- 先頭文字: 英字またはアンダースコア（柔軟な列名では数字も可能）
- **最大文字数: 300文字**
- 大文字/小文字の区別なし（`Column1` = `column1`）
- 使用禁止の接頭辞: `_CHANGE_TIMESTAMP`、`_CHANGE_TYPE`、`_CHANGE_SEQUENCE_NUMBER`、`_COLIDENTIFIER`、`__ROOT__`、`_ROW_TIMESTAMP`、`_PARTITION`、`_FILE_`、`_TABLE_`
- `_field_` を列名の接頭辞として使用しないこと（システム予約済みのため、クエリ中に自動リネームされる）
- テーブル名と列名が同一の場合、`SELECT`式で競合が発生するため、テーブルにエイリアスを割り当てるか列参照時にテーブル名を含めて回避する

#### 柔軟な列名
- 英語以外の言語文字、特殊記号に対応
- サポートされる特殊文字: 空白、`|`、`#`、`>`、`<`、`'`、`:`、`+`、`=`、`%`、`&`
- サポートされない特殊文字: `~`、`}`、`{`、`` ` ``、`^`、`]`、`\`、`[`、`@`、`?`、`;`、`/`、`.`、`,`、`*`、`)`、`(`、`$`、`"`、`!`
- 引用符付き識別子ではバッククォートで囲む
- **制限事項: 外部テーブルではサポートされない**
- BigQuery Storage Read APIで拡張文字を使用するには`enable_display_name_attribute`フラグを`True`に設定する必要がある
- BigQuery Storage Write APIでは`column_name`表記でスキーマを指定する（`JsonStreamWriter`使用時を除く）

#### 列の説明
- 各列にオプションで説明を付加可能
- **最大1,024文字**

#### デフォルト値
- リテラル値、または以下の関数を指定可能:
  - `ST_GEOGPOINT`、`SESSION_USER`、`RAND`、`GENERATE_UUID`
  - `CURRENT_TIMESTAMP`、`CURRENT_TIME`、`CURRENT_DATETIME`、`CURRENT_DATE`

#### GoogleSQL のデータ型

| 名前 | データ型 | 説明 |
|------|----------|------|
| 整数 | `INT64` | 小数部分のない数値 |
| 浮動小数点 | `FLOAT64` | 小数部分のある近似数値 |
| 数値 | `NUMERIC` | 小数部分のある正確な数値 |
| BigNumeric | `BIGNUMERIC` | 小数部分のある正確な数値 |
| ブール値 | `BOOL` | true/false |
| 文字列 | `STRING` | 可変長Unicode文字データ |
| バイト | `BYTES` | 可変長バイナリデータ |
| 日付 | `DATE` | 論理カレンダー日 |
| 日時 | `DATETIME` | 年月日時分秒サブ秒 |
| 時間 | `TIME` | 日付に依存しない時刻 |
| タイムスタンプ | `TIMESTAMP` | マイクロ秒精度の絶対的な時点 |
| 構造体 | `STRUCT` | データ型（必須）とフィールド名（オプション）が記載された順序付きフィールドのコンテナ |
| 地域 | `GEOGRAPHY` | 地表上のポイントセット（WGS84基準） |
| JSON | `JSON` | JSONデータ型 |
| RANGE | `RANGE` | `DATE`/`DATETIME`/`TIMESTAMP`の値の範囲 |

#### モード

| モード | 説明 |
|--------|------|
| `NULLABLE` | NULL値を許可（デフォルト） |
| `REQUIRED` | NULL値を不許可 |
| `REPEATED` | 配列として値を格納 |

#### 丸めモード（NUMERIC/BIGNUMERIC列向け）
- `ROUND_HALF_EVEN`: 中間値を最も近い偶数に丸める（銀行丸め）
- `ROUND_HALF_AWAY_FROM_ZERO`: 中間値をゼロから遠ざける方向に丸める（**デフォルト**）
- トップレベル列またはSTRUCTフィールドで設定可能

丸めモードの動作例:

| 入力値 | ROUND_HALF_EVEN | ROUND_HALF_AWAY_FROM_ZERO |
|--------|-----------------|---------------------------|
| 1.025 | 1.02 | 1.03 |
| 1.0251 | 1.03 | 1.03 |
| 1.035 | 1.04 | 1.04 |
| -1.025 | -1.02 | -1.03 |

### スキーマの指定方法

#### Google Cloud コンソール
- [フィールドを追加] または [テキストとして編集]（JSON配列形式）の2つのオプション
- テーブル作成ページから各フィールドの名前・型・モードを指定

#### SQL

```sql
CREATE TABLE IF NOT EXISTS mydataset.newtable (x INT64, y STRING, z BOOL)
  OPTIONS(description = 'My example table');
```

#### bq コマンドライン
- インラインスキーマ: `field:data_type,field:data_type` 形式
- データ読み込み:

```bash
bq load --source_format=CSV mydataset.mytable ./myfile.csv qtr:STRING,sales:FLOAT,year:STRING
```

- テーブル作成:

```bash
bq mk --table mydataset.mytable qtr:STRING,sales:FLOAT,year:STRING
```

- **制限**: インラインでは`RECORD`（STRUCT）型、`RANGE`型、列の説明、モード指定は不可 → JSONスキーマファイルを使用

#### クライアントライブラリ

| 言語 | データ読み込み時 | テーブル作成時 |
|------|------------------|----------------|
| Python | `LoadJobConfig.schema` | `Table.schema` |
| Go | `bigquery.Schema` + `GCSReference.Schema` | `bigquery.Schema` + `TableMetadata` |
| Java | `Schema.of(Field.of(...))` + `LoadJobConfiguration` | `Schema.of(Field.of(...))` + `StandardTableDefinition` |
| C# | `TableSchemaBuilder` + `CreateLoadJobOptions` | `TableSchemaBuilder` + `dataset.CreateTable()` |

### JSON スキーマファイル

#### 構造

```json
[
  {
    "name": "列名",
    "type": "データ型",
    "mode": "モード（省略可）",
    "fields": [],
    "description": "説明（省略可）",
    "policyTags": {"names": []},
    "maxLength": "最大長",
    "precision": "精度",
    "scale": "スケール",
    "collation": "照合順序（STRING型向け）",
    "defaultValueExpression": "デフォルト値",
    "roundingMode": "丸めモード"
  }
]
```

#### RANGE型の場合

```json
{
  "name": "duration",
  "type": "RANGE",
  "mode": "NULLABLE",
  "rangeElementType": {"type": "DATE"}
}
```

#### 使用方法
- `bq load` または `bq mk` コマンドで指定
- **ローカルファイルのみ対応**（Cloud Storage/Googleドライブは不可）
- **Google CloudコンソールやAPIではスキーマファイル直接使用不可**（bqコマンドラインのみ）
- 既存テーブルスキーマの出力:

```bash
bq show --schema --format=prettyjson project_id:dataset.table > path_to_file
```

- **Python**: `client.schema_from_json(schema_path)` でJSONファイルからスキーマを読み込み、`LoadJobConfig`や`Table`作成に使用可能。`client.schema_to_json(table.schema, path)` で既存テーブルからスキーマをJSONファイルに出力可能

### API でのスキーマ指定
- データ読み込み時: `jobs.insert` → `JobConfigurationLoad.schema` プロパティ
- テーブル作成時: `tables.insert` → `Table.schema` プロパティ

### テーブルのセキュリティ
- BigQueryでテーブルへのアクセスを制御するには、[IAMを使用してリソースへのアクセスを制御](https://docs.cloud.google.com/bigquery/docs/control-access-to-resources-iam?hl=ja)する

## 重要な事実・データ

- **列名の最大文字数**: 300文字
- **列の説明の最大文字数**: 1,024文字
- **自動取得対応フォーマット**: Avro, Parquet, ORC, Firestore/Datastoreエクスポート（自己記述型）
- **自動検出対応フォーマット**: CSV, JSON（改行区切り）
- **手動指定が必要なケース**: 自動検出を使用しない場合のCSV, JSON
- **柔軟な列名は外部テーブルでは非サポート**
- **bqインラインスキーマではRECORD型、RANGE型、説明、モード指定不可**
- **JSONスキーマファイルはローカルファイルのみ対応、bqコマンドラインのみで使用可能**

## 結論・示唆

### 実践的な示唆
- CSVやJSONファイルの読み込みにはスキーマの明示的指定が推奨される
- 複雑なスキーマ（ネスト構造、モード指定、説明付き）にはJSONスキーマファイルを使用する
- 既存テーブルのスキーマを `bq show --schema` で出力し、テンプレートとして再利用できる
- Pythonでは `schema_to_json` / `schema_from_json` でスキーマの入出力が可能
- NUMERIC/BIGNUMERIC列では丸めモードの選択が計算結果に影響するため注意が必要
- スキーマ作成後も[変更可能](https://docs.cloud.google.com/bigquery/docs/managing-table-schemas?hl=ja)だが、互換性に注意する

## 制限事項・注意点

- 柔軟な列名は外部テーブルでは利用不可
- bqコマンドラインのインラインスキーマでは `RECORD`（STRUCT）型と `RANGE` 型を含められない
- JSONスキーマファイルはGoogle CloudコンソールやAPIから直接使用できない（bqコマンドラインのみ）
- JSONスキーマファイルはCloud StorageやGoogleドライブに保存されたものは指定不可
- テーブル名と列名が同一の場合、SELECTクエリで競合が発生する可能性がある
- `_field_` を列名の接頭辞にするとシステム予約済みのため自動リネームされる

## 関連リソース

- [テーブルの作成と使用](https://docs.cloud.google.com/bigquery/docs/tables?hl=ja)
- [データの読み込み](https://docs.cloud.google.com/bigquery/docs/loading-data?hl=ja)
- [スキーマの自動検出](https://docs.cloud.google.com/bigquery/docs/schema-detect?hl=ja)
- [ネストされた列と繰り返し列](https://docs.cloud.google.com/bigquery/docs/nested-repeated?hl=ja)
- [テーブルのスキーマ定義の変更](https://docs.cloud.google.com/bigquery/docs/managing-table-schemas?hl=ja)

---

*Source: [スキーマの指定 | BigQuery](https://docs.cloud.google.com/bigquery/docs/schemas?hl=ja)*
