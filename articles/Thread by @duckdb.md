---
title: "Thread by @duckdb"
source: "https://x.com/duckdb/status/2035021386654056702?s=12"
author:
  - "[[@duckdb]]"
published: 2026-03-20
created: 2026-03-22
description: "DuckDB公式がClaude Code向けプラグイン「duckdb-skills」を発表。ローカルデータの読み取り・クエリ、セッションメモリの永続化、ドキュメント検索など6つのスキルを提供し、AIコーディングエージェントのワークフローを強化する。"
tags:
  - "clippings"
  - "DuckDB"
  - "Claude Code"
  - "AI Agent"
  - "plugin"
  - "data engineering"
---

## 概要

DuckDB公式チームが **duckdb-skills** を発表した。これはClaude Code向けのプラグインで、DuckDBの組み込みデータベースとしての特性を活かし、ローカルワークフローにおけるAIエージェントのデータ処理能力を大幅に強化する。

- **リポジトリ**: [duckdb/duckdb-skills](https://github.com/duckdb/duckdb-skills) (⭐ 241 stars)
- **プラットフォーム対応**: macOS, Linux（Windowsは将来対応予定）

---

## 提供されるスキル一覧

### メインスキル

| スキル | 説明 |
|--------|------|
| **read-file** | CSV, JSON, Parquet, Avro, Excel, 空間データ, SQLite, Jupyter notebook など多様なフォーマットのファイルをローカルまたはリモート（S3, GCS, Azure, HTTPS）から読み取り・探索する。ファイル拡張子から自動でフォーマットを検出する。 |
| **query** | アタッチされたデータベースやファイルに対してSQLクエリを実行。生のSQLまたは自然言語での質問に対応。DuckDBのFriendly SQL方言を使用する。 |
| **read-memories** | 過去のClaude Codeセッションログを検索し、以前の会話で行われた決定、確立されたパターン、未解決のTODOなどのコンテキストを復元する。大量の結果は一時的なDuckDBファイルにオフロードしてインタラクティブに掘り下げ可能。 |

### 基盤スキル

| スキル | 説明 |
|--------|------|
| **attach-db** | DuckDBデータベースファイルをアタッチしてインタラクティブにクエリ可能にする。スキーマ（テーブル、カラム、行数）を探索し、セッション状態を自動復元するためのSQL状態ファイルを書き出す。 |
| **duckdb-docs** | ホストされた検索インデックスに対する全文検索でDuckDB/DuckLakeのドキュメントとブログ記事を検索する。ローカルセットアップ不要で、オフライン検索用のキャッシュオプションも提供。 |
| **install-duckdb** | DuckDB拡張機能のインストール・更新を行う。`name@repo` 構文でコミュニティ拡張機能に対応し、`--update` フラグでDuckDB CLI自体の最新バージョンチェックも可能。 |

---

## セッション状態管理

すべてのスキルは、プロジェクトごとに1つの `state.sql` ファイルを共有する。このファイルにはATTACH/USE/LOADステートメント、シークレット、マクロが含まれる。

保存場所は2つから選択可能:
1. **プロジェクトディレクトリ** (`.duckdb-skills/state.sql`) — プロジェクトと同居
2. **ホームディレクトリ** (`~/.duckdb-skills/<project>/state.sql`) — リポジトリをクリーンに保つ

ファイルは追記専用かつ冪等で、`duckdb -init state.sql` でセッションを復元する。

---

## スキル間の連携

各スキルは必要に応じて互いを参照する:

- `read-file` はフォローアップ探索のために `query` を提案し、大きなファイルの永続化のために `attach-db` を提案する
- `query`, `read-file`, `read-memories` はDuckDBエラーのトラブルシューティングに `duckdb-docs` を自動的に使用する
- すべてのスキルは同一の `state.sql` を共有し、設定されたシークレットやマクロはスキル間で再利用される

---

## インストール方法

```bash
# GitHubからインストール（現在利用可能）
/plugin marketplace add duckdb/duckdb-skills
/plugin install duckdb-skills@duckdb-skills

# 更新
/plugin marketplace update duckdb-skills
/plugin update duckdb-skills@duckdb-skills
```

公式Anthropicマーケットプレイスへの掲載も予定されている。

---

## コミュニティの反応

### 注目点: `read-memories` がキラーフィーチャー

複数のユーザーが `read-memories` スキルを最も重要な機能として挙げている:

> **Chen Avnery** (@MindTheGapMTG): 「ほとんどのAIコーディングツールはコンテキストを使い捨てとして扱う。クエリ可能な組み込みDBにエージェントメモリを永続化することで、Claudeのセッションが実際に時間とともに蓄積される。これはコーディングヘルパーではなく、エージェントのためのインフラだ。」

> **Hari Prasad** (@booleanbeyondIN): 「ほとんどの人がClaude Codeのメモリをフラットテキストとして扱っている。SQLでクエリすることで、プロジェクトコンテキストの上に検索ロジックを構築できる。コンポーザブルなスキル > モノリシックIDE。」

### ローカルデータクエリの摩擦解消

> **Mia** (@Mia_ai_fandom): 「サービスを立ち上げずにローカルデータをクエリできることが、エージェントワークフローに欠けていたピースだった。DuckDB + Claude Codeは主要な摩擦ポイントを取り除く。」

### 拡張のアイデア

- **Syed** (@smhumair): 大規模なCSV/Excelファイルの分析にOpenClawとDuckDBを組み合わせたスキルを既に使用中。メモリ機能との統合やコントリビューションに意欲を示す。
- **matthias** (@mmatthias): ツールフックですべてのログをDuckDBに記録し、そのデータに対してクエリを実行するスキルの提案。
- **Ozmen** (@nozmen): 公式スキルコレクションへの追加を提案。

---

## 重要なポイント

1. **DuckDBの組み込み性がAIエージェントに最適**: サーバー不要でローカルに動作するため、エージェントワークフローの摩擦を大幅に削減する
2. **メモリの永続化と検索**: `read-memories` により、AIセッション間でコンテキストが蓄積・検索可能になり、単なるツールからインフラへと進化する
3. **多フォーマット対応**: CSV, JSON, Parquet, Excel, 空間データなど20以上のフォーマットに対応し、リモートストレージ（S3, GCS, Azure）も直接アクセス可能
4. **コンポーザブル設計**: 各スキルが独立しつつ連携し、状態ファイルを共有するアーキテクチャにより、柔軟なワークフロー構築が可能

---

## 元スレッド

**DuckDB** @duckdb [2026-03-20](https://x.com/duckdb/status/2035021386654056702)

We're excited to announce duckdb-skills, a DuckDB plugin for Claude Code!

We think the embedded nature of DuckDB makes it a perfect companion for Claude in your local workflows.

The skills supported include:

\+ read-file and query – uses DuckDB's CLI to query data locally, unlocking easy access to any file that DuckDB can read.

\+ read-memories – a clever idea to store your Claude memories in DuckDB and query them at blazing speed.

These are powered by two additional skills:

\+ attach-db – gives Claude a mechanism to manage DuckDB state through a .sql file linked to your project.

\+ duckdb-docs – uses a remote DuckDB full-text search database to query the DuckDB docs and answer all of your (and Claude's own) questions.

https://github.com/duckdb/duckdb-skills

---

**Ozmen** @nozmen [2026-03-20](https://x.com/nozmen/status/2035097368903766117)

Lets add it to official skills collection?

---

**Chen Avnery** @MindTheGapMTG [2026-03-21](https://x.com/MindTheGapMTG/status/2035374434853200215)

read-memories is the sleeper feature here. Most AI coding tools treat context as disposable. Persisting agent memory in a queryable embedded DB means your Claude sessions actually compound over time. This is infrastructure for agents, not just a coding helper.

---

**Hari Prasad** @booleanbeyondIN [2026-03-20](https://x.com/booleanbeyondIN/status/2035030990259880422)

he read-memories skill in DuckDB is the sleeper feature. Most people treat Claude Code memories as flat text. Querying them with SQL means you can build retrieval logic on top of project context. Composable skills > monolithic IDEs. DuckDB as the local data layer for Claude is a

---

**Syed** @smhumair [2026-03-20](https://x.com/smhumair/status/2035104503289323752)

Aye aye. Brain is firing up with ideas 💡

I am already using my own skill with OpenClaw for Duckdb but for analyzing large CSV or Excel files.

Using it for memory is cool.

Will see how I can improve my version with this and possibly contribute back to this skill.

---

**Mia** @Mia\_ai\_fandom [2026-03-20](https://x.com/Mia_ai_fandom/status/2035056728954298455)

This is neat. Having embedded query logic in code context is the play. Local data querying without spinning up services was the missing bit for agent workflows. DuckDB + Claude Code feels like it just removes a major friction point.

---

**Sesha S** @seshaSendhil [2026-03-21](https://x.com/seshaSendhil/status/2035187072223588518)

@tobi qmd might benefit from this @duckdb skill

---

**matthias** @mmatthias [2026-03-20](https://x.com/mmatthias/status/2035070112210817515)

what about a pre/post tool hook that logs it all to duckdb, then a skill to run querys on that resulting data?