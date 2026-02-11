---
title: "「アンチパターン」と呼ばれるEAVを、あえて採用した話 ── 数十万件の属性、数十億件の値と向き合って"
source: "https://zenn.dev/yesodco/articles/f047e05bf9b656"
author:
  - "[[竹内 (chimerast)]]"
published: 2026-02-09
created: 2026-02-11
description: "株式会社イエソドのCEO兼CTOが、SQLアンチパターンとされるEAV（Entity-Attribute-Value）を2つのBtoB SaaSプロジェクト（Speeda・YESOD）であえて採用した理由と実践的な設計ノウハウを解説。数十万件の属性・数十億件のデータを扱う中で、EAVの弱点を克服するための工夫（インデックス設計、ReferenceId、Kotlinによる型安全なシリアライズ等）を紹介する。"
tags:
  - "clippings"
  - "EAV"
  - "Database"
  - "アンチパターン"
  - "Kotlin"
  - "PostgreSQL"
  - "MySQL"
  - "データモデリング"
  - "BtoB SaaS"
---

## 概要

本記事は、株式会社イエソドのCEO兼CTOである竹内氏が、一般的に「SQLアンチパターン」とされるEAV（Entity-Attribute-Value）モデルを、2つの大規模BtoB SaaSプロジェクトであえて採用した経験をまとめたものである。1つ目は前職ユーザベースの経済情報サービス「Speeda」の財務諸表機能（数十万件の勘定科目・数十億件のデータ）、2つ目は現職イエソドの企業内ID管理サービス「YESOD」（多様なEntityの関係性管理）。EAVの弱点を正しく理解した上で、それを補う具体的な設計上の工夫を紹介し、「EAV＝悪」という先入観を外して適材適所で使うための考え方を提示している。

## 主要なトピック

### EAVとは何か

- **通常のテーブル設計**: 属性をカラムとして定義し、レコード数が増えても構造は変わらない
- **EAVによる設計**: 属性を「行」として表現し、`entities`・`attributes`・`entity_attribute_values` の3テーブルで構成
- 属性の追加は `attributes` テーブルへのINSERTのみで完結し、ALTER TABLE不要

### なぜEAVはアンチパターンとされるのか

EAVが批判される正当な理由は以下の4点：

1. **SQLが複雑になる**: 属性ごとにJOINが必要となり、クエリが肥大化する
2. **データ型の制約が効かない**: value列がTEXT/VARCHARになりがちで、RDBMSの型安全性が失われる
3. **外部キー制約が使えない**: 汎用的なvalue列では参照整合性を持たせにくい
4. **パフォーマンスが劣化しやすい**: エンティティ1件あたり属性数だけ行が生まれ、行数が桁違いに増加

> **批判の本質**: 「属性が固定で事前に分かっているなら、普通にカラムを定義しなさい」

### EAV採用の判断基準

#### 検討すべき条件
- 属性の数が非常に多い、または事前に確定できない（数千〜数十万規模）
- 属性の追加・変更が頻繁に発生する
- データがスパースである（全エンティティが全属性を持つわけではない）

#### 避けるべきケース
- 属性が数十個以下で固定
- 複雑な集計やレポーティングが主要なユースケース
- チームにEAVの運用経験がない

#### 判断フローチャート

```
属性の数は数百以上か？
 └── No → 通常のカラム設計を使う
 └── Yes → 属性は頻繁に追加・変更されるか？
     └── No → JSONBカラムやカラムストア型DBを検討
     └── Yes → データはスパースか？
         └── No → ワイドテーブル＋パーティショニングを検討
         └── Yes → EAVが有力な選択肢
```

> EAVが最適になるのは、RDBMSの他の機能（トランザクション、JOINによるリレーション、既存システムとの統合）も同時に必要な場合。

---

### 事例1: 財務諸表プロジェクト（Speeda）── 数十万件の属性と数十億件のデータ

#### 背景
- 複数の企業グループ・複数の会計基準・複数の国をまたいだ勘定科目（Chart of Accounts）が数十万件
- 各企業が独自の勘定科目体系を持ち、それらの連結・マッピングが必要

#### カラム設計では対応不可だった理由
- PostgreSQLのカラム上限は1,600、MySQLは数千程度 → 数十万カラムは物理的に不可能
- 勘定科目は頻繁に追加・変更される → ALTER TABLEによる運用は非現実的
- 科目の属性自体（科目コード、名称、区分、通貨、税区分等）も企業ごとに異なる

#### EAVの適用方法
- **勘定科目をAttribute（属性）** として扱い、Entity（企業）に対して科目ごとの金額をValueとして格納
- 科目の追加がデータ操作のみで完結
- スパースなデータの効率的な格納が可能

#### period_id による時間軸の組み込み

主キーを `(entity_id, attribute_id, period_id)` の3カラムに拡張し、同じEntity・同じAttributeに対して期間ごとに異なるValueを持たせた。

```sql
CREATE TABLE entity_attribute_values (
  entity_id BIGINT REFERENCES entities(id),
  attribute_id BIGINT REFERENCES attributes(id),
  period_id BIGINT REFERENCES periods(id),
  value DECIMAL,
  PRIMARY KEY (entity_id, attribute_id, period_id)
);
```

- 実質的に「誰の・何が・いつの・いくら」という **4次元データキューブ** となった
- 期間をAttributeではなくカラムとして追加した理由: 期間はすべてのデータに共通する軸であり、動的に増える属性ではないため

#### インデックス設計 ── 数十億件でも実用的なパフォーマンス

```sql
-- 「あるエンティティの全属性を取得」パターン
CREATE INDEX idx_eav_entity ON entity_attribute_values (entity_id, attribute_id);

-- 「ある属性を持つ全エンティティを検索」パターン
CREATE INDEX idx_eav_attribute ON entity_attribute_values (attribute_id, entity_id);

-- 「特定期間のデータを取得」パターン
CREATE INDEX idx_eav_period ON entity_attribute_values (period_id, attribute_id, entity_id);
```

> **重要な知見**: EAVのパフォーマンス問題の本質は行数そのものではなく、**アクセスパターンを無視したインデックス設計（あるいはインデックスの欠如）** にある。

#### その他の実践知見
- **Attributeテーブルのスキーマ定義としての活用**: `currency`, `group_id` 等のメタ情報を持たせ、単なる名前の一覧ではなくスキーマ定義の役割を担わせる
- **マイグレーション管理**: 属性の追加・変更もマイグレーションの一部として管理し、シードデータとしてバージョン管理に含める
- **ORM対応**: EAVの読み書きを抽象化するリポジトリ層を独自に実装

---

### 事例2: ID管理プロジェクト（YESOD）── 多様なEntityの関係性管理

#### 背景
- 人（Person）、組織（Organization）、会社（Company）、オフィス（Office）、プロジェクト（Project）という複数種類のEntityを管理
- Entity間の関係性（所属、アサイン、勤務地、帰属等）の表現が必要

#### ReferenceId の導入 ── Entity間の関係性を表現

EAVテーブルに `reference_id` カラムを追加し、外部キー制約を活かしたEntity間の参照を実現。

```sql
CREATE TABLE entity_attribute_values (
  entity_id BIGINT REFERENCES entities(id),
  attribute_id BIGINT REFERENCES attributes(id),
  reference_id BIGINT REFERENCES entities(id),  -- 他のEntityへの参照
  value BYTEA,
  PRIMARY KEY (entity_id, attribute_id, reference_id)
);
```

- プリミティブな値は `value` を使い、Entity間の関係性は `reference_id` を使う
- **外部キー制約が機能する**: 参照先のEntityが存在しなければINSERTは失敗 → 孤児データを防止
- **新しい関係性の追加がデータ操作のみで完結**: attributesテーブルに1行INSERTするだけ
- 関係性そのものだけでなく「関係性に基づく値」（アサイン開始日、稼働率等）もEAVの再帰的応用で管理可能

#### Entity種類の拡張性
- `entity_type` カラムの追加だけで、テーブル構造変更なくEntity種類を拡張可能
- 当初「人」と「組織」のみ → 「会社」「オフィス」「プロジェクト」へと拡張してもモデルは不変

#### バイナリ格納 + Kotlinによる型安全なシリアライズ

value列を `BYTEA`（バイナリ）型とし、Kotlinの `sealed interface` でデータ型の安全性を確保。

```kotlin
sealed interface AttributeValue {
  data class NumberValue(val value: BigDecimal) : AttributeValue
  data class StringValue(val value: String) : AttributeValue
  data class JsonValue(val value: JsonNode) : AttributeValue
}
```

- **コンパイル時に型の不整合を検出**: sealed interfaceとwhen式の網羅性チェックにより、新しいデータ型追加時にハンドリング漏れがコンパイルエラーになる
- **格納値のフォーマットが厳密に制御**: シリアライザを一箇所に集約し、不正なデータの混入を防止
- **TEXT型ではなくバイナリを選んだ理由**: 数値精度の劣化防止、構造化データの効率的格納、シリアライザ経由の強制による運用上の怠慢防止

## 重要な事実・データ

- **Speedaプロジェクト**: 数十万件の勘定科目 × 大量の企業 × 複数の会計期間 = **数十億件**のEAVテーブルレコード
- PostgreSQLのカラム上限: **1,600**、MySQLは数千程度
- 適切なインデックス設計により、**数十億件規模でも実用的なレスポンスタイムを維持**
- YESODプロジェクト: 当初2種類のEntity → **5種類**に拡張（テーブル構造変更なし）

## 結論・示唆

### 著者の結論

- EAVは「禁じ手」ではなく「選択肢」である
- 属性が動的で大量・データがスパース・スキーマ変更を最小限にしたい条件が揃ったとき、EAVは合理的な設計選択になる
- 「EAVはスケールしない」という通説に対して、適切なインデックス設計により数十億件でもパフォーマンス維持が可能であることを実証

### 実践的な示唆

- EAVの弱点を正しく理解した上で、それを補う工夫とセットで採用する
- 「アンチパターン」というラベルに思考停止せず、プロジェクトの要件に照らして判断する
- **EAVの柔軟性を活かす部分と、固定的な構造で守る部分を分ける**のが使いやすいモデルにするポイント
- Attributeテーブルをスキーマ定義として充実させることが運用のコツ
- JSONBカラムやドキュメントDBなどの代替案も必ず検討した上でEAVを選択すべき

## 制限事項・注意点

- ORMとの相性が悪く、EAVの読み書きを抽象化するリポジトリ層の独自実装が必要（保守コストがかかる）
- マイグレーションの概念が変わり、「スキーマ変更」と「データ変更」の境界が曖昧になる → チーム内ルールの整備が必須
- チームにEAV運用経験がない場合、保守コストが跳ね上がるリスクがある
- 複雑な集計・レポーティングやBIツールとの連携には不向き

---

*Source: [「アンチパターン」と呼ばれるEAVを、あえて採用した話 ── 数十万件の属性、数十億件の値と向き合って](https://zenn.dev/yesodco/articles/f047e05bf9b656)*
