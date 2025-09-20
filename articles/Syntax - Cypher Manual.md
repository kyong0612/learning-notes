---
title: "Syntax - Cypher Manual"
source: "https://neo4j.com/docs/cypher-manual/5/constraints/syntax/"
author: "Neo4j Documentation Team"
published: 2023
created: 2025-09-21
description: "Neo4jの制約構文リファレンス。データ整合性を保証するための制約の作成、表示、削除に関する包括的な構文ガイド。"
tags:
  - "neo4j"
  - "cypher"
  - "constraints"
  - "database"
  - "syntax"
  - "data-integrity"
---

## 概要

このページでは、Neo4jで利用可能なすべての制約に関する構文を含んでいます。制約は、データベース内のデータ整合性を保証するために使用される重要な機能です。

詳細な構文情報は、[Operations Manual → Cypher® syntax for administration commands](https://neo4j.com/docs/operations-manual/current/database-administration/syntax/)を参照してください。

## CREATE CONSTRAINT

制約は`CREATE CONSTRAINT`コマンドで作成されます。制約を作成する際は、制約名を提供することが推奨されます。この名前は、インデックスと制約の両方において一意である必要があります。

### 制約作成の権限要件

- 制約の作成には`CREATE CONSTRAINT`権限が必要です

### 制約作成のオプション機能

- `IF NOT EXISTS`フラグにより、同じ制約が存在する場合でもエラーを発生させない冪等な動作が可能
- Neo4j 5.17以降では、何も実行されなかった場合に既存の制約を示す情報通知が返される

### プロパティ一意性制約

#### 単一プロパティのノード一意性制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE n.propertyName IS [NODE] UNIQUE
```

#### 複合ノードプロパティ一意性制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE (n.propertyName_1, ..., n.propertyName_n) IS [NODE] UNIQUE
```

#### リレーションシップ一意性制約（5.7で導入）

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR ()-[r:RELATIONSHIP_TYPE]-()
REQUIRE r.propertyName IS [REL[ATIONSHIP]] UNIQUE
```

### プロパティ存在制約（Enterprise Edition）

#### ノードプロパティ存在制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE n.propertyName IS NOT NULL
```

#### リレーションシッププロパティ存在制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR ()-[r:RELATIONSHIP_TYPE]-()
REQUIRE r.propertyName IS NOT NULL
```

### プロパティ型制約（Enterprise Edition、5.9で導入）

#### 型制約の基本構文

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE n.propertyName {[IS] :: | IS TYPED} <TYPE>
```

#### サポートされるデータ型

- **基本型**: `BOOLEAN`, `STRING`, `INTEGER`, `FLOAT`
- **時間型**: `DATE`, `LOCAL TIME`, `ZONED TIME`, `LOCAL DATETIME`, `ZONED DATETIME`, `DURATION`
- **空間型**: `POINT`
- **リスト型**（5.10で導入）: `LIST<TYPE NOT NULL>`
- **動的ユニオン型**（5.11で導入）: `INTEGER | FLOAT | STRING`

### キー制約（Enterprise Edition）

#### 単一プロパティキー制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE n.propertyName IS [NODE] KEY
```

#### 複合キー制約

```cypher
CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS]
FOR (n:LabelName)
REQUIRE (n.propertyName_1, ..., n.propertyName_n) IS [NODE] KEY
```

## SHOW CONSTRAINTS

制約の表示には`SHOW CONSTRAINTS`コマンドを使用します。

### 制約表示の権限要件

- 制約の表示には`SHOW CONSTRAINTS`権限が必要です

### 制約表示の基本構文

```cypher
SHOW [制約タイプフィルター] CONSTRAINT[S]
  [WHERE expression]
```

### 詳細な結果表示構文

```cypher
SHOW [制約タイプフィルター] CONSTRAINT[S]
YIELD { * | field[, ...] } [ORDER BY field[, ...]] [SKIP n] [LIMIT n]
  [WHERE expression]
  [RETURN field[, ...] [ORDER BY field[, ...]] [SKIP n] [LIMIT n]]
```

### 制約タイプフィルター

| フィルター | 説明 |
|-----------|------|
| `ALL` | すべての制約を返す（デフォルト） |
| `NODE UNIQUE[NESS]` | ノードプロパティ一意性制約 |
| `REL[ATIONSHIP] UNIQUE[NESS]` | リレーションシッププロパティ一意性制約 |
| `UNIQUE[NESS]` | すべてのプロパティ一意性制約 |
| `NODE [PROPERTY] EXIST[ENCE]` | ノードプロパティ存在制約 |
| `REL[ATIONSHIP] [PROPERTY] EXIST[ENCE]` | リレーションシッププロパティ存在制約 |
| `[PROPERTY] EXIST[ENCE]` | すべてのプロパティ存在制約 |
| `NODE PROPERTY TYPE` | ノードプロパティ型制約 |
| `REL[ATIONSHIP] PROPERTY TYPE` | リレーションシッププロパティ型制約 |
| `PROPERTY TYPE` | すべてのプロパティ型制約 |
| `NODE KEY` | ノードキー制約 |
| `REL[ATIONSHIP] KEY` | リレーションシップキー制約 |
| `KEY` | すべてのキー制約 |

## DROP CONSTRAINT

制約の削除は`DROP CONSTRAINT`コマンドで行います。

### 制約削除の権限要件

- 制約の削除には`DROP CONSTRAINT`権限が必要です

### 制約削除の基本構文

```cypher
DROP CONSTRAINT constraint_name [IF EXISTS]
```

### 制約削除の特徴

- `IF EXISTS`フラグにより、存在しない制約を削除しようとしてもエラーが発生しない
- Neo4j 5.17以降では、制約が存在しない場合に情報通知が返される

## 重要な注意事項

1. **制約とインデックスの関係**: 一意性制約とキー制約は、インデックスによってバックアップされます
2. **Enterprise Edition機能**: 存在制約、型制約、キー制約の一部はEnterprise Editionでのみ利用可能
3. **命名規則**: 制約名は、インデックスと制約の両方において一意である必要があります
4. **バージョン固有機能**: 一部の機能は特定のNeo4jバージョンで導入されました

## 関連リンク

- [Create, show, and drop constraints](../managing-constraints/)
- [Execution plans and query tuning](../../planning-and-tuning/)
- [Operations Manual](https://neo4j.com/docs/operations-manual/current/database-administration/syntax/)
