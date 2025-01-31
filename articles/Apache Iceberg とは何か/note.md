# Apache Iceberg とは何か

ref: <https://bering.hatenadiary.com/entry/2023/09/24/175953>

## 1. はじめに

今日のビッグデータを扱うアプローチとして、HDFSやS3などにデータを蓄積し、Hive Metastore等でテーブルとして抽象化し、TrinoやSpark等のエンジンから操作するアーキテクチャが広く実践されている。これは手軽で便利である一方で、データ基盤が大規模化・複雑化するに従って様々な課題が出てくる。

- **同時読み取り/書き込みの独立性を担保できない**
- **テーブル変更後に過去の状態が復元できない**
- **テーブルを構成するファイル/パーティションの増加に従ってテーブル操作が遅くなる**
- **スキーマ変更への追従が大変**
- **レコードレベルの読み取り/書き込みが遅い**
- **パーティションを活かすには、クエリ実行者がテーブルの物理構造を把握している必要がある**

こうした課題へのアプローチとして、Apache Iceberg, Apache Hudi, Delta Lakeなどの**Open Table Format (OTF)**と呼ばれる技術への注目が高まっている。本記事では、「Icebergとは何か」について基本的な考え方から、より深い仕組みまでを紹介する。

## 2. 概要

### Apache Icebergとは

[Apache Iceberg](https://iceberg.apache.org/) は、2017年にNetflixが開発したApache License 2.0のテーブルフォーマットで、巨大かつ複雑なテーブルを**Spark、Trino、Flink、Presto、Hive、Impala**などから効率良く扱える仕組みを提供する。

Netflixは2018年時点でS3上に**60ペタバイト**のデータレイクを保持しており、これらのデータを多様なエンジンから一元的かつ効率良く扱う必要に迫られてIcebergが開発された。

### Icebergの本質はテーブル仕様である

Icebergは**Storage Engine**や**Compute Engine**ではなく、**Table Spec** である。つまり、Iceberg自体は**テーブルフォーマットの仕様**に過ぎず、特定のソフトウェアやプロセスを指すものではない。

実際にIceberg Tableを扱うのは**SparkやTrino, Hiveなどのエンジン**であり、各エンジンがIcebergのTable Specに従ってデータ/メタデータを書き込み/読み取りすることでIcebergを実現する。

## 3. Icebergハンズオン

[Icebergハンズオン](https://github.com/lawofcycles/apache-iceberg-101-ja) では、コンテナが動く端末が1台あればクイックに始められる実践的な内容を提供している。

## 4. Icebergの特徴

### 同時書き込み時の整合性担保

- **楽観的並行性制御 (OCC)** によって、複数のリーダー・ライターが並列して読み取り/書き込みを実施しても、一貫性を担保できる。
- 書き込み完了後にメタデータを更新する際に競合をチェックし、競合が発生していなければコミット、競合が発生していれば再試行を行う。
- **Isolationレベル**として、**SERIALIZABLE**と**SNAPSHOT**がサポートされている。

### 読み取り一貫性・Time Travelクエリ・Rollback

- Iceberg Tableの更新では、古い物理データを削除せず、新しいバージョンのデータとメタデータ (snapshot) を生成する形になる。
- ユーザーが特定の時点のデータを参照できるため、整合性の取れたデータを取得可能。
- 過去の特定のスナップショットへ**Time Travelクエリ**が可能。
- **Rollback**によって、テーブルの状態を過去の特定の時点に戻すことが可能。

### Schema Evolution

Icebergでは**スキーマの変更が容易**で、

- カラムの追加 (Add)
- カラムの削除 (Drop)
- カラム名の変更 (Rename)
- カラム型の変更 (Update)
- フィールドの順序変更 (Reorder)

といった操作が、**物理データに影響を与えずに**可能。

### Hidden Partitioning

Icebergでは、テーブルを構成する**ファイルの物理的な構造に基づくのではなく**、メタデータを元にパーティション構造を管理する。

例: `PARTITIONED BY months(time)` の場合、データは月単位でパーティション管理されるが、ユーザーは `WHERE time BETWEEN '2023-09-01' AND '2023-09-31'` のようにクエリを記述するだけで内部的にパーティショニングの恩恵を受ける。

### Partition Evolution & Sort Order Evolution

- Icebergはパーティションスキームのバージョン情報をメタデータとして管理し、途中で**パーティションの変更が可能**。
- 例: **month単位**から**day単位**への変更。
- 既存のテーブルのSort順も途中で変更できる。

### クエリ性能の最適化

- メタデータを活用し、**レコードレベルの読み取り・書き込み・更新・削除の最適化**が可能。

## 5. ユースケース

- **データウェアハウス**
- **データレイク**
- **データマート**
- **ストリーミングデータ処理**

## 6. Icebergのアーキテクチャ

### Iceberg Catalog

- Iceberg Catalogは現在の最新スナップショットのメタデータファイルを管理。
- Hive Metastore, Nessie, AWS Glue, Tabular, Dremio Arctic などを利用可能。

### metadata layer

Icebergのメタデータは以下の3つで構成される。

- **metadata files**: スキーマ・パーティション・スナップショット情報を保持
- **manifest lists**: スナップショットごとのファイルリスト
- **manifest files**: データファイルと統計情報を追跡

### data layer

- **data files**: Icebergが管理するデータ本体。
- **delete files**: 削除レコードの管理 (v2のみ)。
- **puffin files**: クエリパフォーマンス向上用の統計情報。

## 7. さいごに

Apache Icebergは、**スキーマ変更・パーティショニング・クエリ最適化・トランザクション管理**といった点で、従来のデータレイクの課題を解決する強力なツールである。データ基盤をより柔軟かつ高性能にしたい場合、Icebergの導入を検討してみてはいかがだろうか。
