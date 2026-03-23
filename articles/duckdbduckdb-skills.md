---
title: "duckdb/duckdb-skills"
source: "https://github.com/duckdb/duckdb-skills"
author:
  - "[[DuckDB]]"
published: 2026-03-10
created: 2026-03-23
description: "Claude Code向けのDuckDBプラグイン。データ探索（CSV/Parquet/JSON等の読み込み、SQLクエリ実行）とセッションメモリ（過去のClaude Codeセッションログ検索）をスキルとして提供する。"
tags:
  - "clippings"
  - "DuckDB"
  - "Claude Code"
  - "plugin"
  - "data-exploration"
  - "AI-tools"
---

## 概要

**duckdb-skills** は、[Claude Code](https://claude.ai/code) 向けのプラグインで、DuckDBを活用した**データ探索**と**セッションメモリ**機能を提供する。Claude Codeのスラッシュコマンドとして利用でき、自然言語やSQLでデータを操作できる。

- **リポジトリ**: [duckdb/duckdb-skills](https://github.com/duckdb/duckdb-skills)
- **ライセンス**: MIT
- **言語**: Shell
- **スター数**: 286 (2026-03-23時点)
- **対応OS**: macOS, Linux（Windowsは未完全対応）

---

## インストール

### GitHub経由（現在利用可能）

```
/plugin marketplace add duckdb/duckdb-skills
/plugin install duckdb-skills@duckdb-skills
```

リポジトリをマーケットプレースソースとして登録し、プラグインをインストールする。以降のすべてのセッションで `/duckdb-skills:<skill-name>` として利用可能になる。

### Discoverタブ経由（近日公開予定）

Anthropic公式マーケットプレースへの掲載を準備中。掲載後は `/plugin` コマンドの **Discover** タブから直接インストール可能になる。

### アップデート方法

```
/plugin marketplace update duckdb-skills
/plugin update duckdb-skills@duckdb-skills
```

---

## 提供スキル一覧

### 1. `attach-db` — データベースの接続

DuckDBデータベースファイルをアタッチし、対話的なクエリを可能にする。スキーマ（テーブル、カラム、行数）を自動探索し、他のスキルがセッションを復元できるようSQLステートファイルを書き出す。

```
/duckdb-skills:attach-db my_analytics.duckdb
```

- **ステートファイルの保存先を選択可能**:
  - プロジェクトディレクトリ: `.duckdb-skills/state.sql`
  - ホームディレクトリ: `~/.duckdb-skills/<project>/state.sql`
- 複数データベースの接続に対応（再実行で追記）

### 2. `query` — SQLクエリの実行

アタッチ済みデータベースやファイルに対してSQLクエリを実行する。**生SQL**と**自然言語の質問**の両方に対応し、DuckDBの Friendly SQL 方言を使用する。

```
/duckdb-skills:query FROM sales LIMIT 10
/duckdb-skills:query "what are the top 5 customers by revenue?"
/duckdb-skills:query FROM 'exports.csv' WHERE amount > 100
```

- `attach-db` で設定したセッション状態を自動的に引き継ぐ

### 3. `read-file` — データファイルの読み込み

多様なデータファイルを読み込み・探索する。ファイル拡張子から自動でフォーマットを検出する（組み込みの `read_any` テーブルマクロを使用）。

**対応フォーマット**: CSV, JSON, Parquet, Avro, Excel, 空間データ, SQLite, Jupyter notebooks 等

**対応リモートストレージ**: S3, GCS, Azure, HTTPS

```
/duckdb-skills:read-file variants.parquet what columns does it have?
/duckdb-skills:read-file s3://my-bucket/data.parquet describe the schema
/duckdb-skills:read-file https://example.com/data.csv how many rows?
```

### 4. `duckdb-docs` — ドキュメント検索

DuckDB・DuckLakeのドキュメントとブログ記事を全文検索する。ホストされた検索インデックスに対してHTTPS経由で実行されるため、ローカルセットアップは不要。オフライン検索用にインデックスをローカルキャッシュするオプションもある。

```
/duckdb-skills:duckdb-docs window functions
/duckdb-skills:duckdb-docs "how do I read a CSV with custom delimiters?"
```

### 5. `read-memories` — セッションメモリの検索

過去のClaude Codeセッションログを検索し、以前の会話からコンテキストを復元する。意思決定、確立されたパターン、未完了のTODOなどを取得できる。大量の結果セットは一時的なDuckDBファイルにオフロードし、対話的なドリルダウンが可能。

```
/duckdb-skills:read-memories duckdb --here
```

### 6. `install-duckdb` — 拡張機能のインストール

DuckDB拡張機能のインストール・更新を行う。`name@repo` 構文でコミュニティ拡張機能に対応。`--update` フラグでDuckDB CLI自体の最新安定版チェックも実行する。

```
/duckdb-skills:install-duckdb spatial httpfs
/duckdb-skills:install-duckdb gcs@community
/duckdb-skills:install-duckdb --update
```

---

## セッション状態管理

すべてのスキルはプロジェクトごとに単一の `state.sql` ファイルを共有する。このファイルはATTACH/USE/LOADステートメント、シークレット、マクロを含むプレーンなSQLファイルである。

| 保存場所 | パス | 特徴 |
|---|---|---|
| プロジェクトディレクトリ | `.duckdb-skills/state.sql` | プロジェクトと共存、gitignore可能 |
| ホームディレクトリ | `~/.duckdb-skills/<project>/state.sql` | リポジトリをクリーンに保つ |

- **追記専用（append-only）かつ冪等**
- 任意のスキルが `duckdb -init state.sql` でセッションを復元可能

---

## スキル間の連携

スキルは意味のある形で相互に参照し合う:

- `read-file` → 後続の探索には `query` を、大きなファイルの永続化には `attach-db` を提案
- `query`, `read-file`, `read-memories` → DuckDBエラー発生時に `duckdb-docs` で自動的にトラブルシューティング
- 全スキルが同一の `state.sql` を共有 → `read-file` で設定したシークレット・マクロは `query` で再利用、`attach-db` でアタッチしたデータベースはどこからでもアクセス可能

---

## ローカル開発

```bash
git clone https://github.com/duckdb/duckdb-skills.git
cd duckdb-skills
claude --plugin-dir .
```

ディスクからプラグインを読み込むため、`skills/*/SKILL.md` への編集が即座に反映される（新しい会話を開始するかスラッシュコマンドを再実行）。

**前提条件**: DuckDB CLIがインストールされていること。未インストールの場合、スキルが `/duckdb-skills:install-duckdb` 経由のインストールを提案する。

---

## 制限事項

- **Windows未完全対応**: 一部のシェルコマンドやパス処理が正常に動作しない可能性がある。将来のリリースで互換性向上を予定。
- **Anthropicマーケットプレース未掲載**: Discoverタブからの直接インストールは現時点では不可（GitHub経由のみ）。
