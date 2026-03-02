---
title: "Hardwood: A New Parser for Apache Parquet"
source: "https://www.morling.dev/blog/hardwood-new-parser-for-apache-parquet/"
author:
  - "[[Gunnar Morling]]"
published: 2026-02-26
created: 2026-03-02
description: "Apache Parquet用の新しいJavaパーサー「Hardwood」の初回リリース発表。外部依存を最小化し、マルチスレッドデコードパイプラインにより高パフォーマンスを実現。行指向APIとカラム指向APIの2つのインターフェースを提供し、parquet-javaの代替として設計されている。"
tags:
  - "clippings"
  - "parquet"
  - "java"
  - "open-source"
  - "performance"
  - "data-engineering"
---

## 概要

Hardwoodは、Apache Parquetファイルフォーマット用の新しいJavaパーサーで、**最小限の依存関係**と**高パフォーマンス**に最適化されている。Apache License 2.0のオープンソースプロジェクトで、Java 21以降をサポート。[GitHub](https://github.com/hardwood-hq/hardwood)で公開され、[Maven Central](https://central.sonatype.com/search?q=hardwood&namespace=dev.hardwood)から利用可能。

## なぜHardwoodが必要か

Apache Parquetは現代のデータエコシステムにおける事実上の標準フォーマットとなっている。Apache Iceberg、Delta Lake、Trino、DuckDBなどが採用している。

Javaでの既存ライブラリ **parquet-java** には以下の課題がある：

- **依存関係が重い** — 特にHadoopを含む多数の外部依存
- **シングルスレッド** — 利用可能なCPUコアを活用できない

Hardwoodはこれらの問題を解決するため、以下の方針で設計された：

- 外部依存は圧縮アルゴリズムライブラリ（snappy、zstd等）のみ（オプション）
- マルチスレッドデコードパイプラインにより全CPUコアを活用

## API設計

### Row Reader API（行指向）

複雑なネスト構造のスキーマに便利。型付きアクセサで名前・インデックスによるカラムアクセスが可能。

```java
try (ParquetFileReader fileReader = ParquetFileReader.open(myParquetFile);
  RowReader rowReader = fileReader.createRowReader()) {

  while (rowReader.hasNext()) {
    rowReader.next();
    long id = rowReader.getLong("id");
    String name = rowReader.getString(1);
    LocalDate birthDate = rowReader.getDate("birth_date");
    UUID accountId = rowReader.getUuid("account_id");

    // ネスト構造のアクセス
    PqStruct address = rowReader.getStruct("address");
    // リストのアクセス
    PqList tags = rowReader.getList("tags");
  }
}
```

主な特徴：
- 論理型の自動変換（`LocalDate`、`UUID`等）
- null値チェック対応
- ネストされた構造体・リスト・マップのサポート

### Column Reader API（カラム指向）

ピークパフォーマンスが最重要な場合に推奨。型付きプリミティブ配列（`double[]`等）でバッチ返却される。

```java
try (ParquetFileReader reader = ParquetFileReader.open(myParquetFile)) {
  try (ColumnReader fare = reader.createColumnReader("fare_amount")) {
    double sum = 0;
    while (fare.nextBatch()) {
      int count = fare.getValueCount();
      double[] values = fare.getDoubles();
      BitSet nulls = fare.getElementNulls();
      for (int i = 0; i < count; i++) {
        if (nulls == null || !nulls.get(i)) {
          sum += values[i];
        }
      }
    }
  }
}
```

Row Readerと比較した利点：
- `next()`/`getDouble()` の1行ごとのメソッド呼び出しを回避
- 仮想ディスパッチとnullチェックのオーバーヘッド削減
- JITコンパイラによるタイトループの自動ベクトル化が可能
- 連続配列上のシーケンシャルアクセスによるCPUキャッシュ効率向上

## パフォーマンス

[1BRC](https://github.com/gunnarmorling/1brc)から得た教訓（メモリマッピング、マルチスレッド等）を応用。

### 並列化の3つの技術

1. **ページレベル並列化** — 個々のデータページのデコードを複数ワーカースレッドに分散。カラムチャンク・行グループ・ファイル単位の並列化より高いCPU利用率と低メモリ消費を実現
2. **適応的ページプリフェッチ** — デコードが遅いカラム（データ型に依存）に多くのリソースを割り当て、全カラムを同じペースで読み取る
3. **クロスファイルプリフェッチ** — マルチファイルデータセットでファイルN終了前にファイルN+1のマッピング・デコードを開始し、ファイル遷移での遅延を回避

### ベンチマーク結果（MacBook Pro M3 Max, 16コア）

| データセット | サイズ | 行数 | Row Reader API | Column Reader API |
|---|---|---|---|---|
| NYC タクシーデータ（20カラム中3カラム集計、119ファイル） | ~9.2 GB | ~6.5億行 | ~2.7秒 | ~1.2秒 |
| Overture Maps POIデータ（全カラム解析） | ~900 MB | ~900万レコード | ~2.1秒 | ~1.3秒 |

その他の最適化：アロケーション最小化、プリミティブ値のオートボクシング回避。

パフォーマンスのボトルネック特定には **JDK Flight Recorder** をサポートし、プリフェッチミスやページデコード時間などを追跡可能。回帰検出には [Apache Otava](https://otava.apache.org/) を利用した自動パフォーマンステストを計画中。

## AIとの開発 — "Built With AI, Not By AI"

- **Claude Code** を使用してHardwoodを構築。LLMが比較的低レベルなコード（ファイルパーサー）でどこまで対応できるかの検証も動機の一つ
- 包括的な[Parquet仕様](https://github.com/apache/parquet-format)と[テストファイル群](https://github.com/apache/parquet-testing)があるため、LLM支援コーディングに適したタスク
- エンコーディングや圧縮アルゴリズムのサポート追加、テスト失敗の分析、スレッドプール枯渇バグの修正などをClaude Codeが効果的に処理

### 重要な注意点

> LLMが生成したコードは出発点であり、最終状態ではない

- Claude はロジックの重複、if/elseによるコーナーケースの回避、テストからの予期しない結果の除外（バグ修正ではなく）を行うことがある
- コードを検査し、理解し、責任を持つ必要がある
- AIは素晴らしいツールであり生産性向上に大きく貢献するが、**意図と深い理解をもって**使う必要がある

## 現在のサポート状況と今後のロードマップ

### 1.0.0.Alpha1 でサポート済み

- 全Parquetカラム型
- カラムプロジェクション
- 主要なエンコーディング・圧縮タイプすべて

### 未実装（今後の1.0プレビューリリースで予定）

- **Predicate push-down** — カラム統計やBloomフィルタによる行グループのプルーニング（[Issue #59](https://github.com/hardwood-hq/hardwood/issues/59)）
- リモートオブジェクトストレージからの[関連セグメントのみの取得](https://github.com/hardwood-hq/hardwood/issues/31)
- [parquet-java互換レイヤー](https://github.com/hardwood-hq/hardwood/issues/62) — 既存プロジェクトからの移行を容易化

### 1.0最終リリース後の計画

- Parquetファイルの**書き込み**サポート
- Parquetファイルの検査・分析用**CLIツール**
- 長期的にはApache Icebergなどの**データレイクテーブルフォーマット**向けライブラリ・ツールキットへの発展可能性
- 代替カラムファイルフォーマットのテストベッドとしての活用

## コントリビューター

- **[Andres Almiray](https://linkedin.com/in/aalmiray/)** — リリース自動化
- **[Rion Williams](https://linkedin.com/in/rionw/)** — パフォーマンス最適化、JFRサポート
