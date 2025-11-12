---
title: "Support for SQL-level `DISTINCT` operation for PostgreSQL · Issue #14765 · prisma/prisma"
source: "https://github.com/prisma/prisma/issues/14765"
author:
  - "kibertoad"
published: 2022-08-11
created: 2025-11-12
description: |
  PrismaでPostgreSQLのSQLレベルのDISTINCT操作をサポートする機能リクエスト。
  Issue #2835で実装されたメモリ内DISTINCTフィルタリングは、大量のデータを扱う場合に非効率であるため、
  データベースレベルでDISTINCT SQLクエリを生成する機能の追加が提案されている。
  現在はPreview featureとして利用可能。
tags:
  - "clippings"
  - "prisma"
  - "postgresql"
  - "distinct"
  - "performance"
  - "sql"
---

## Support for SQL-level `DISTINCT` operation for PostgreSQL

### 概要

このIssueは、PrismaでPostgreSQLのSQLレベルの`DISTINCT`操作をサポートする機能リクエストです。2022年8月11日にkibertoadによって作成され、現在はPreview featureとして利用可能になっています。

### 問題点

Issue #2835で実装された`DISTINCT`機能は、メモリ内でのフィルタリングのみを実装していました。これは大量のデータを扱う場合に以下の問題があります：

- **パフォーマンスの問題**: すべてのデータをメモリに読み込んでからフィルタリングするため、メモリ使用量が増大する
- **非効率性**: データベース側で処理できる操作をアプリケーション側で処理しているため、ネットワーク転送量が増加する
- **スケーラビリティの制限**: 大規模なデータセットでは実用的でない

### 提案された解決策

データベースレベルで`DISTINCT` SQLクエリを生成する機能の追加が提案されています。これにより、重複排除処理をデータベース側で実行できるようになります。

### 提案されたAPI

```typescript
const result = await prisma.user.findMany({
  where: {},
  distinctSql: ['id', 'email']
})
```

このAPIでは、`distinctSql`パラメータに指定されたフィールドに基づいて、SQLレベルの`DISTINCT`クエリが生成されます。

### ステータスと反応

- **ステータス**: Preview featureとして利用可能（`status/is-preview-feature`ラベル）
- **ラベル**:
  - `kind/feature`: 新機能リクエスト
  - `topic: distinct`, `topic: nativeDistinct`: DISTINCT機能関連
  - `topic: performance`, `topic: performance/memory`, `topic: performance/queries`: パフォーマンス関連
- **コミュニティの反応**:
  - 👍 68件のリアクション
  - ❤️ 16件のリアクション
  - 多くの開発者から支持を得ている

### 技術的な背景

#### メモリ内DISTINCT vs SQL DISTINCT

**メモリ内DISTINCT（現在の実装）**:

```typescript
// すべてのデータを取得してからメモリでフィルタリング
const allUsers = await prisma.user.findMany({});
const distinctUsers = [...new Map(allUsers.map(u => [u.email, u])).values()];
```

**SQL DISTINCT（提案された実装）**:

```sql
-- データベース側で処理
SELECT DISTINCT id, email FROM users;
```

### メリット

1. **パフォーマンス向上**: データベース側で処理することで、ネットワーク転送量とメモリ使用量を削減
2. **スケーラビリティ**: 大規模なデータセットでも効率的に動作
3. **データベース最適化の活用**: PostgreSQLの最適化機能を活用できる

### 関連Issue

- Issue #2835: メモリ内DISTINCTフィルタリングの実装（このIssueの前身）

### まとめ

この機能リクエストは、Prismaのパフォーマンスとスケーラビリティを向上させる重要な改善提案です。特に大量のデータを扱うアプリケーションでは、SQLレベルの`DISTINCT`操作が不可欠であり、現在Preview featureとして提供されていることで、実用的な解決策が利用可能になっています。
