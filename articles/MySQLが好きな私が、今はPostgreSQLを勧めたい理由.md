---
title: "MySQLが好きな私が、今はPostgreSQLを勧めたい理由"
source: "https://zenn.dev/catatsuy/articles/f3721135c6f8f6"
author:
  - "[[catatsuy]]"
published: 2026-03-11
created: 2026-03-14
description: "長年MySQLを使ってきた筆者が、クラウド・マネージドサービス前提の現代において、新規開発ではPostgreSQLを勧めたい理由をアプリケーション実装の観点から整理した記事。ON CONFLICT DO NOTHING、RETURNING、部分インデックス、外部キーの遅延制約、pgvectorなど、PostgreSQLが持つ実務上の優位性を具体的なSQL例とともに解説する。"
tags:
  - "clippings"
  - "MySQL"
  - "PostgreSQL"
  - "Database"
  - "MySQL8"
  - "SQL"
  - "アプリケーション設計"
---

## 概要

長年MySQLを使ってきた筆者（catatsuy）が、現在は新規開発であればPostgreSQLを勧めたいと考える理由を、アプリケーション実装の観点から整理した記事。結論は以下の2点に集約される。

1. **PostgreSQLのデメリットとされてきたことは、機能差がかなり埋まり、マネージドサービス前提では気にしなくてよいものも増えた**
2. **アプリケーション実装の観点では、今でもPostgreSQLのほうが明確に有利な点が残っている**

「MySQLはダメ」という話ではなく、昔の弱点が埋まった今でもPostgreSQLの優位が実務上残っていることを、具体的なSQL例とともに示している。

---

## PostgreSQLのデメリットとされてきたことは、かなり薄まった

昔の比較でPostgreSQLの弱点として挙げられていた点は、現在ではほぼ論点にならない。

| 旧来のデメリット | 現状 |
|---|---|
| **DDL（カラム追加等）の扱いづらさ** | MySQLのオンラインDDLも充実したが、日常的なカラム追加でMySQLとPostgreSQLに明確な差はない |
| **パーティショニング** | 昔の印象ほど大きな論点ではなくなった |
| **VACUUMなど運用の重さ** | マネージドサービス前提なら利用者が直接面倒を見る場面はかなり減少 |
| **レプリケーション** | マネージドサービス主流化により、ユーザーが直接触れない部分が増加 |

> オンプレで全部自分で抱える前提の比較を、そのまま今のクラウド時代に持ち込むのはあまりフェアではない。

---

## MySQL 8で入って差が縮んだもの

以下は「昔はPostgreSQLの優位として語れたが、MySQL 8で入ったので今は決定打ではないもの」：

- **`SKIP LOCKED`**
- **Window関数**（ただし更新処理への接続は別問題 → 後述）
- **`CHECK` 制約**

---

## PostgreSQLを勧める明確な理由

### 1. ON CONFLICT DO NOTHING（INSERT IGNOREの代わりではない）

PostgreSQLの`ON CONFLICT DO NOTHING`は「一意制約の競合が起きたときだけ挿入しない」を**明示的に**書く機能。やりたいことがそのままSQLになる。

MySQLの`INSERT IGNORE`はエラーをwarning化して処理を継続する機能であり、「重複だけ無視したい」という用途には**広すぎる**。意図しない入力不正まで飲み込むリスクがある。

> この差は小さく見えて、実務ではかなり大きい。レビュー時にも挙動が読みやすく、意図しない入力不正まで飲み込みにくい。

### 2. RETURNING

`INSERT/UPDATE/DELETE ... RETURNING`で、変更した結果をその場で返せる。

```sql
INSERT INTO users(name, email)
VALUES('catatsuy', 'catatsuy@example.com')
RETURNING id, name, email, created_at;
```

**できること：**
- upsertした結果をそのまま受け取る
- update後の行をそのまま返してAPIのレスポンスに使う
- デフォルト値やgenerated columnを含んだ完成形の行をそのまま受け取る
- UUIDを主キーにしている場合もそのまま返せる
- 複数行INSERTの結果をそのまま返せる

MySQLの`LAST_INSERT_ID()`は`AUTO_INCREMENT`な数値IDの取得に限定され、任意の列や複数行の結果を返せない。

> 「変更した結果をそのまま返せる」のは単なる便利機能ではなく、アプリケーションの実装の組み立て方そのものに効く。

### 3. VALUES（定数表のインラインJOIN）

PostgreSQLでは小さな定数表をその場で作ってJOIN・更新処理につなげやすい。

```sql
UPDATE users u
SET plan = v.plan
FROM (
  VALUES
    (1, 'pro'),
    (2, 'free'),
    (3, 'team')
) AS v(id, plan)
WHERE u.id = v.id;
```

MySQLでもMySQL 8.0.19以降で`VALUES`文が使えるが、`ROW(...)`記法が必要で列名が`column_0`, `column_1`となり、PostgreSQLほど自然ではない。

```sql
-- MySQL版（同じ発想でもこうなる）
SELECT u.*
FROM users u
JOIN (
  VALUES ROW(1), ROW(2), ROW(5)
) AS v
ON u.id = v.column_0;
```

### 4. Window関数を更新処理に持ち込める

Window関数自体はMySQL 8で入ったが、PostgreSQLでは`WITH`や`UPDATE ... FROM`と組み合わせて**更新処理に自然に持ち込める**。

```sql
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM sessions
)
UPDATE sessions s
SET is_latest = (r.rn = 1)
FROM ranked r
WHERE s.id = r.id;
```

> 分析用途の便利機能ではなく、アプリケーション実装の武器として効く。

### 5. 部分インデックス（Partial Index）

MySQLには存在しない機能。一部の行だけにインデックスを張れる。

```sql
CREATE INDEX idx_users_active_email
ON users(email)
WHERE deleted_at IS NULL;
```

**メリット：**
- ソフトデリートとの相性が非常に良い
- 不要な行をインデックスに含めないため、サイズ・更新コスト・意図の明確さのすべてで優位

MySQLのgenerated columnや関数インデックスで近いことは可能だが、「一部の行だけを物理的に小さく持つインデックス」をそのまま表現できるわけではない。

### 6. 外部キーの完成度

PostgreSQL界隈で外部キー必要派が多く、MySQL界隈で不要派が多い傾向の背景には、実装・運用のしやすさの差がある。

#### 遅延制約（DEFERRABLE）

PostgreSQLでは外部キーを`DEFERRABLE INITIALLY DEFERRED`にでき、制約チェックをトランザクションの最後まで遅らせられる。

```sql
BEGIN;
INSERT INTO books(id, author_id) VALUES(1, 100);  -- 親がまだない
INSERT INTO authors(id) VALUES(100);               -- ここで親を追加
COMMIT;  -- commit時点で整合していればOK
```

**効くユースケース：**
- バルクインサートや入れ替え処理
- 一時的に順序が前後する移行処理
- 複雑なテストデータの作成
- 相互参照を含むデータ投入

#### MySQLの問題点

- `NO ACTION`も実質`RESTRICT`で、常に親→子の順序制約に縛られる
- `foreign_key_checks=0`で制約を無効化できるが、再有効化しても不整合は検証されず、事故のリスクが高い

> PostgreSQLは「制約は守ったまま、チェックタイミングを遅らせる」。MySQLは「制約そのものを切る」方向に寄りがち。この差はかなり大きい。

### 7. ベクトル演算（pgvector）

PostgreSQLには`pgvector`があり、ベクトル保持・距離演算・類似検索・近傍検索用インデックスまで使える。

MySQLはOSS版ではベクトル演算が実質不可能。Vector型はMySQL 9.0で追加されたが、距離関数はMySQL HeatWave on OCI / MySQL AIでのみ提供され、MySQL Commercial / Communityには含まれていない。

### 8. 文字コードと照合順序

今でもPostgreSQLよりMySQLのほうが事故りやすい。

**代表的な問題：**
- **寿司ビール問題** — 絵文字を含む文字列比較が直感通りにならない
- **ハハパパ問題** — 見た目が別の文字列なのに照合順序の都合で同一視される

`utf8mb4`にしただけでは解決せず、character setとcollationの両方の理解が必要。MySQL 8で新しいcollationが追加されたことで、既存システムとの混在が発生し、**全体としてはさらに複雑化**した面がある。

> MySQL本体が悪いというより、歴史が長く互換性を抱えながら進化してきた代償。ただし、アプリケーション開発者から見ると、その複雑さはそのまま事故の入り口になる。

---

## まとめ

| カテゴリ | 内容 |
|---|---|
| **MySQL 8で差が縮んだもの** | `SKIP LOCKED`、Window関数、`CHECK`制約 |
| **PostgreSQLを勧める明確な理由** | 文字コード・照合順序の安全性、`pgvector`、外部キーの完成度、部分インデックス、Window関数×更新処理、`VALUES`、`RETURNING`、`ON CONFLICT DO NOTHING` |

> 私はMySQLが好きです。長く使ってきましたし、今でも性能を出しやすい、良いデータベースだと思っています。その上でなお、今新規開発でどちらを採用するかという話になれば、私が勧めるのはPostgreSQLです。MySQLがダメだからではありません。昔の弱点がかなり埋まった今でも、アプリケーション実装のしやすさという点では、PostgreSQLの優位がまだ残っていると思うからです。
