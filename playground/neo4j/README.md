# Neo4j Docker Sandbox

Neo4jのDockerサンドボックス環境です。

## セットアップ

### 前提条件
- Docker と Docker Compose がインストールされていること

### 起動方法
```bash
./scripts/start.sh
```

### 停止方法
```bash
./scripts/stop.sh
```

### アクセス情報
- **Neo4j Browser**: http://localhost:7474
- **Bolt URL**: bolt://localhost:7687
- **認証情報**:
  - Username: `neo4j`
  - Password: `password123`

## スクリプト一覧

| スクリプト | 説明 |
|-----------|------|
| `scripts/start.sh` | Neo4jコンテナを起動 |
| `scripts/stop.sh` | Neo4jコンテナを停止 |
| `scripts/logs.sh` | Neo4jのログを表示 |
| `scripts/clean.sh` | すべてのデータを削除（注意） |
| `scripts/migrate.sh` | マイグレーションを実行 |
| `scripts/migrate-info.sh` | マイグレーション状態を確認 |
| `scripts/migrate-rollback.sh` | 最後のマイグレーションをロールバック |
| `scripts/migrate-create.sh` | 新しいマイグレーションファイルを作成 |

## ディレクトリ構成

```
./
├── compose.yml        # Docker Compose設定
├── Makefile           # Make コマンド定義
├── .env               # 環境変数（gitignore対象）
├── data/              # Neo4jのデータ（永続化）
├── logs/              # Neo4jのログ
├── import/            # インポート用ファイル置き場
├── plugins/           # プラグインディレクトリ
├── migrations/        # データベースマイグレーション
│   ├── 20240101000000__create_initial_constraints.cypher
│   ├── 20240101000001__create_indexes.cypher
│   └── 20240101000002__create_relationships.cypher
└── scripts/           # 管理スクリプト
```

## 基本的な使い方

### Makefileを使用（推奨）

```bash
make start         # Neo4jコンテナを起動
make migrate       # マイグレーションを実行
make migrate-info  # マイグレーション状態を確認
make stop          # コンテナを停止
```

### 手動実行

1. コンテナを起動
   ```bash
   ./scripts/start.sh
   ```

2. ブラウザでアクセス
   - http://localhost:7474 を開く
   - Username/Password でログイン

3. Cypherクエリの例
   ```cypher
   // ノードの作成
   CREATE (n:Person {name: 'Alice', age: 30})

   // ノードの検索
   MATCH (n:Person) RETURN n

   // リレーションシップの作成
   MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
   CREATE (a)-[:KNOWS]->(b)
   ```

## データベースマイグレーション

### マイグレーションの仕組み

このプロジェクトでは、Cypherスクリプトベースのシンプルなマイグレーションシステムを実装しています。

- **マイグレーションファイル**: `migrations/` ディレクトリに配置
- **命名規則**: `{タイムスタンプ}__{説明}.cypher` （例: `20240101120000__create_initial_constraints.cypher`）
- **タイムスタンプ形式**: `YYYYMMDDHHmmss`
- **実行順序**: タイムスタンプ順に自動実行
- **チーム開発の利点**: バージョン番号と違い、タイムスタンプベースのため競合が発生しません
- **実行履歴**: Neo4j内の `_Migration` ノードで管理

### マイグレーションコマンド

```bash
# 未実行のマイグレーションを適用
make migrate

# マイグレーション状態を確認
make migrate-info

# 最後のマイグレーションをロールバック（手動介入が必要な場合あり）
make migrate-rollback

# 新しいマイグレーションファイルを作成
make migrate-create DESC=add_user_constraint
```

### 新しいマイグレーションの追加

#### 方法1: Makeコマンドを使用（推奨）

```bash
# マイグレーションファイルを自動生成
make migrate-create DESC=add_customer_email_constraint
```

#### 方法2: 手動作成

1. `migrations/` ディレクトリに新しいファイルを作成
   ```bash
   touch migrations/$(date +%Y%m%d%H%M%S)__add_new_constraint.cypher
   ```

2. Cypherコマンドを記述
   ```cypher
   // 2024-01-01 12:00:00 - 顧客メールアドレスのユニーク制約追加
   CREATE CONSTRAINT customer_email_unique IF NOT EXISTS
   FOR (c:Customer) REQUIRE c.email IS UNIQUE;
   ```

3. マイグレーションを実行
   ```bash
   make migrate
   ```

## 参考資料
- [Neo4j Cypher Basics](https://neo4j.com/docs/getting-started/appendix/tutorials/guide-cypher-basics/)
- [Neo4j Docker Documentation](https://neo4j.com/docs/operations-manual/current/docker/)