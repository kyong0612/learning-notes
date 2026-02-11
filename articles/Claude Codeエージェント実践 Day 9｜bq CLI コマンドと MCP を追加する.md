---
title: "Claude Codeエージェント実践 Day 9｜bq CLI コマンドと MCP を追加する"
source: "https://zenn.dev/akira_cloudjob/articles/20260209-agent-practice-day09"
author:
  - "[[akira_cloudjob]]"
  - "[[Zenn]]"
published: 2026-02-09
created: 2026-02-11
description: "Claude Codeエージェントにbq CLIコマンドとMCP Google Sheetsを追加し、/queryコマンドをText-to-SQLパイプラインとして実装。SQL可視化・3点セット出力・安全装置により、再現性と安全性を両立したデータ分析環境を構築する実践記録。"
tags:
  - "clippings"
  - "Claude Code"
  - "BigQuery"
  - "MCP"
  - "Text-to-SQL"
  - "Agent"
  - "Google Sheets"
  - "GCP"
  - "自動化"
---

## 概要

Claude Codeエージェント実践シリーズ Day 9 の記事。Day 8 で設計した「3つの追加」（`/query`コマンド、BigQueryナレッジ、CLAUDE.mdドメイン情報）を実装し、さらにMCPでGoogle Sheetsとの連携も追加した。核心は **Text-to-SQLをブラックボックスにしない** ことであり、エージェントが生成したSQLを実行前に確認・修正できる仕組みを構築している。

## 主要なトピック

### 1. `/query` コマンドの実装（Text-to-SQLパイプライン）

`commands/query.md` として、自然言語またはSQLを受け取り、bq CLIで実行してレポートする `/query` コマンドを実装。

- **自然言語入力**: `knowledge/technical/bigquery.md` を参照してスキーマを確認し、自然言語をSQLに変換。**生成したSQLを提示し、実行前に確認を取る**
- **SQL直接入力**: 翻訳不要でそのまま実行
- **柔軟な使い分け**: 最初は自然言語で依頼し、翻訳がズレたらSQLで直接指定するスタイルに収束

#### アウトプットの3点セット

| 出力 | 内容 | 用途 |
|------|------|------|
| 分析レポート | サマリー + 考察 | 結論をすぐ把握 |
| 使った SQL | 実行したクエリ全文 | 再現・修正に使う |
| ローデータ | タブ区切りテキスト（必要時） | スプレッドシートに貼る、別ツールで加工 |

SQLを残すのは「再現性」のため。同じクエリを叩き直したい、条件を変えたい場面に対応。

#### 安全装置

| ルール | 理由 |
|--------|------|
| `SELECT *` 禁止 | フルスキャンのコスト防止 |
| `LIMIT` なしは確認 | 大量データの取得防止 |
| パーティションフィルタ必須 | フルスキャン防止 |
| 1GB 超は事前報告 | 想定外の課金防止 |

> 「直前チェックはコマンドに、背景知識は knowledge/ に」が方針。

### 2. `knowledge/technical/bigquery.md` の作成（スキーマリンキング用知識）

エージェントにBigQueryの知識を持たせるファイルを作成。以下を記載：

- **基本情報**: プロジェクトID、デフォルトデータセット、課金モデル（オンデマンド $6.25/TB）、リージョン
- **テーブル一覧**: `analytics.sales`（売上）、`analytics.customers`（顧客マスタ）、`analytics.products`（商品マスタ）
- **ディメンションとメジャー**: 切り口（region, segment, category）と集計対象（amount, customer_id）
- **SQL方言・注意点**: Standard SQL、日付型の扱い、日付関数
- **よくある間違い**: `SELECT *`、LIMITなし、パーティションフィルタなし、JOIN順序
- **よく使うクエリパターン**: 月別売上、地域別売上のテンプレート

テーブル一覧やカラムの意味を書いておくことで、エージェントが初回から適切なSQLを生成可能になる。書かない場合は「どのテーブルですか？」「カラム名は？」と毎回質問されてしまう。

### 3. CLAUDE.md へのドメイン情報追記

CLAUDE.md に約20行を追記し、以下を記載：

- **役割**: データ分析エージェント
- **使用ツール一覧**: bq CLI、gcloud、MCP Google Sheets
- **出力形式**: 3点セット（レポート + SQL + ローデータ）
- **データソース**: BigQuery（大量データ）、Google Sheets（手動データ）

設計原則として **CLAUDE.md は概要（20行）、technical/ は詳細（80行）** という分離を実践。

### 4. MCP による Google Sheets 連携

#### CLI vs MCP の使い分け

| データソース | CLI の有無 | 接続方法 |
|-------------|-----------|---------|
| BigQuery | `bq` コマンドあり | bq CLI |
| Google Sheets | CLI なし | MCP |

> **CLI があるものは CLI、ないものは MCP**

#### 設定方法

プロジェクトルートの `.mcp.json` にMCPサーバーを設定：

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "uvx",
      "args": ["mcp-google-sheets"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "path/to/service-account.json"
      }
    }
  }
}
```

サービスアカウントの準備手順：
1. Google Cloud Console でサービスアカウント作成
2. JSON キーをダウンロードしてパスを設定
3. Google Sheets API を有効化
4. 対象スプレッドシートをサービスアカウントに共有

### 5. プロジェクト構成

```
data-analysis-agent/
├── CLAUDE.md              ← ③ ドメイン情報を追記
├── .claude/commands/
│   ├── start-req.md       ← 既存
│   ├── next-phase.md      ← 既存
│   ├── status.md          ← 既存
│   └── query.md           ← ① 新規追加
├── knowledge/
│   ├── business/
│   ├── technical/
│   │   └── bigquery.md    ← ② 新規追加
│   ├── people/
│   └── lessons/
└── .mcp.json              ← MCP設定
```

## 重要な事実・データ

- **検証環境**: Windows 11 / macOS、Claude Code 最新版、bq CLI（Google Cloud SDK）
- **BigQuery課金**: オンデマンド 1TB あたり $6.25
- **CLAUDE.md追記量**: 約20行（概要のみ）
- **bigquery.md**: 約80行（テーブルスキーマ、SQLパターン、注意点）
- **MCP Google Sheets**: `uvx mcp-google-sheets` を使用

## 結論・示唆

### 著者の結論

- `/query` コマンドを Text-to-SQL パイプラインとして実装し、**SQLが見える・再現できる・修正できる**データ分析環境を構築
- CLI があるものは CLI、ないものは MCP という明確な使い分けが有効
- CLAUDE.md（概要）と knowledge/（詳細）の情報分離が実践的

### 実践的な示唆

- **Text-to-SQLの透明性**: エージェントが生成したSQLを実行前に確認する仕組みは必須。「先月」の解釈（30日前 vs 先月1日〜末日）などの曖昧さを目視で検証可能
- **安全装置は運用で調整**: 最初は「すべてのクエリにLIMIT必須」としたが、`COUNT(*)`や`SUM()`などの集計クエリにLIMITは不要。**厳しすぎるルールは使いにくくなる**
- **ナレッジの事前記述**: テーブルスキーマをknowledgeに書いておくと、初回から適切なSQL生成が可能。都度質問される非効率を解消

## 制限事項・注意点

- **Windows環境の文字化け**: bq CLIはPython内部を使用しており、Windows Git Bashで日本語が文字化け。`PYTHONIOENCODING=utf-8` の環境変数設定が必要
- **Google Sheetsのトークン制限**: MCP経由で10,000行程度のデータを読むとトークン制限に達する。大量データはbq CLIやPythonに任せるべき
- **MCPは調査フェーズの道具**: 大量データ処理には向かない

## 関連リソース

- [GitHub: agent-scaffold-factory](https://github.com/Akira-cloudjob-public/agent-scaffold-factory)
- [著者ページ（Zenn）](https://zenn.dev/akira_cloudjob)

---

*Source: [Claude Codeエージェント実践 Day 9｜bq CLI コマンドと MCP を追加する](https://zenn.dev/akira_cloudjob/articles/20260209-agent-practice-day09)*
