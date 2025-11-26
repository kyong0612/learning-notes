---
title: "Claude Opus 4.5, and why evaluating new LLMs is increasingly difficult"
source: "https://simonw.substack.com/p/claude-opus-45-and-why-evaluating?utm_source=post-email-title&publication_id=1173386&post_id=179888259&utm_campaign=email-post-title&isFreemail=true&r=1me00b&triedRedirect=true&utm_medium=email"
author:
  - "[[Simon Willison]]"
published: 2025-11-25
created: 2025-11-26
description: |
  Anthropicの新モデルClaude Opus 4.5のリリース、LLM評価の難しさ、Nano Banana Pro画像生成モデル、sqlite-utils 4.0、Olmo 3オープンLLMなど、最新のAI技術動向を包括的に紹介するニュースレター
tags:
  - LLM
  - Claude
  - Anthropic
  - AI-evaluation
  - image-generation
  - open-source
  - SQLite
  - prompt-injection
---

## 概要

このニュースレターでは、以下の主要トピックを扱っています：

1. **Claude Opus 4.5** - Anthropicの最新モデルとLLM評価の難しさ
2. **Nano Banana Pro** - Googleの最高の画像生成モデル
3. **sqlite-utils 4.0a1** - 後方互換性のない変更を含むアルファリリース
4. **Olmo 3** - 完全オープンなLLM
5. **Substack自動化** - ブログからニュースレターを自動生成する方法

---

## 1. Claude Opus 4.5 と新しいLLM評価の困難さ

### モデルの基本仕様

| 項目 | 仕様 |
|------|------|
| コンテキスト長 | 200,000トークン（Sonnetと同じ） |
| 出力上限 | 64,000トークン（Sonnetと同じ） |
| 知識カットオフ | 2025年3月 |
| 価格（入力/出力） | $5/$25 per million tokens |

**価格比較**:

- 旧Opus: $15/$75
- GPT-5.1系: $1.25/$10
- Gemini 3 Pro: $2/$12
- Sonnet 4.5: $3/$15
- Haiku 4.5: $1/$5

### Opus 4.5の主な改善点

1. **新しいeffortパラメータ**: high（デフォルト）、medium、lowから選択可能
2. **強化されたComputer Use**: `zoom`ツールで画面の特定領域を拡大して検査可能
3. **Thinkingブロックの保持**: 以前のターンのthinkingブロックがデフォルトでコンテキストに保持される

### 実際の使用体験

著者はClaude Codeでのプレビューアクセスを通じて、sqlite-utilsの大規模リファクタリング作業に使用：

- 2日間で20コミット、39ファイル変更、2,022行追加、1,173行削除

**重要な発見**: プレビュー期限後にSonnet 4.5に切り替えても、同じペースで作業を継続できた。

### LLM評価の問題点

> **「私のお気に入りのAIの瞬間は、新しいモデルが以前は不可能だったことを可能にしてくれる時です。以前はもっと明確に感じられましたが、今日では新世代のモデルと前世代を区別する具体的な例を見つけることが非常に困難になっています。」**

著者の提言:

- フロンティアモデル間の差異が縮小している
- ベンチマーク（SWE-bench等）での数％の差が実際の問題解決にどう影響するか不明確
- **AI企業への要望**: 「以前のモデルでは失敗したが、新モデルでは成功するプロンプト例を提示してほしい」

### プロンプトインジェクション耐性

Opus 4.5は業界トップの耐性を示すが、依然として課題あり：

| クエリ数 | Opus 4.5 | Sonnet 4.5 | Haiku 4.5 | GPT-5.1 | Gemini 3 Pro |
|----------|----------|------------|-----------|---------|--------------|
| k=1 | 4.7% | 7.3% | 8.3% | 12.6% | 12.5% |
| k=10 | 33.6% | 41.9% | 51.1% | 58.2% | 60.7% |
| k=100 | 63.0% | 72.4% | 85.6% | 87.8% | 92.0% |

**著者の見解**:

- 1回の試行で約5%、10回で約33%の成功率は依然として高い
- モデル訓練での対策より、**アプリケーション設計段階での防御が重要**

---

## 2. Nano Banana Pro（Gemini 3 Pro Image）

### 主な機能

- **高解像度出力**: 1K、2K、4K対応
- **高度なテキストレンダリング**: インフォグラフィック、メニュー、図表向け
- **Google検索によるグラウンディング**: リアルタイムデータに基づく画像生成
- **思考モード**: 最終出力前に「思考画像」を生成
- **最大14枚の参照画像**: 6枚のオブジェクト画像 + 5枚の人物画像

### 価格

| 解像度 | 価格 |
|--------|------|
| 4K | $0.24/画像 |
| 1K/2K | $0.134/画像 |
| 入力画像 | $0.0011/枚 |

### インフォグラフィック生成能力

9語のプロンプト「Infographic explaining how the Datasette open source project works」で、技術的に正確なアーキテクチャ図を生成。テキストは全て正確に綴られ、適切なロゴやUIサムネイルも含まれる。

### SynthID透かし検出

Googleの画像にはSynthID透かしが埋め込まれており、Geminiアプリでアップロードすることで「Google AIで作成されたか」を確認可能。

---

## 3. sqlite-utils 4.0a1

### 後方互換性のない主な変更

1. **`db.table()` と `db.view()` の分離**: 型ヒント対応のため、テーブルとビューを明確に区別

2. **FLOAT → REAL**: SQLiteの正しい浮動小数点型に修正

3. **デフォルトで型検出有効**: CSV/TSVインポート時に`--detect-types`がデフォルトに

4. **角括弧 → ダブルクォート**: SQL標準に準拠したエスケープ方式に変更

   ```sql
   -- 旧: create table [my table] ([id] integer primary key)
   -- 新: create table "my table" ("id" integer primary key)
   ```

5. **イテレータサポート**: `insert_all()` と `upsert_all()` がリスト/タプルのイテレータを受け入れ可能に

6. **`pyproject.toml` への移行**: `setup.py`から移行

---

## 4. Olmo 3 - 完全オープンなLLM

### 特徴

- **Ai2（Allen Institute for AI）** による開発
- 訓練データ、訓練プロセス、チェックポイントを全て公開
- **「最も優れた完全オープン32Bスケール思考モデル」** を謳う

### モデルラインナップ

| モデル | サイズ |
|--------|--------|
| Olmo 3-Base | 7B, 32B |
| Olmo 3-Instruct | 7B |
| Olmo 3-Think | 7B, 32B |
| Olmo 3-RL Zero | 7B |

### 訓練データ: Dolma 3

- 約9.3兆トークン（Web、科学PDF、コード、数学問題、百科事典）
- 実際の訓練ミックスは5.9兆トークン
- 競合より約6倍少ないトークンで訓練

### OlmoTrace

訓練データへのトレースバック機能:

- 出力と訓練データの関係を可視化
- [infini-gram](https://infini-gram.io/)によるフレーズマッチング

### オープン訓練データの重要性

> **「少数のサンプルでLLMを汚染できる」** - Anthropicの研究によると、250の汚染文書でバックドアを追加可能

完全オープンな訓練データは、こうした攻撃の監査に不可欠。

---

## 5. GPT-5.1-Codex-Max

### 主な特徴

- **Codex CLI専用**（現時点でAPI未対応）
- **コンパクション機能**: 数百万トークンを超えるタスクを処理可能
- コンテキスト制限に近づくと自動的にセッションを要約し、新しいコンテキストウィンドウで継続

### ベンチマーク結果

| ベンチマーク | GPT-5.1-Codex-Max | Gemini 3 Pro | Sonnet 4.5 |
|--------------|-------------------|--------------|------------|
| SWE-Bench Verified (xhigh) | 77.9% | 76.2% | 77.2% |
| Terminal Bench 2.0 | 58.1% | 54.2% | 42.8% |

---

## 6. その他の重要なトピック

### 依存関係のクールダウン

サプライチェーン攻撃対策として、新しい依存関係の自動更新に遅延を設ける戦略:

- 攻撃は通常数時間で発見される
- [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#cooldown-)や[Renovate](https://docs.renovatebot.com/key-concepts/minimum-release-age/)で実装可能

### エージェント設計の難しさ（Armin Ronacher）

- **抽象化ライブラリは時期尚早**: モデル間の差異が大きすぎる
- **Reinforcement（強化）**: ツール実行時に目標やタスク状態をリマインド
- **テストとeval**: エージェントの性質上、最も困難な課題

### マルウェア + LLMの脅威

> **「以前は全ファイルを暗号化してランサムを要求していたが、将来はLLMを使って各人に特化した脅迫文を作成できる。浮気、履歴書の嘘、試験のカンニング等、何かしらのブラックメール材料は誰にでもある」**
> — Nicholas Carlini

### Claude 4.5のシステムプロンプト追加

> **「もし人が不必要に失礼、意地悪、侮辱的な場合、Claudeは謝る必要はなく、会話相手に敬意ある対応を求めることができる」**

---

## Substackニュースレター自動化

### アーキテクチャ

```
Django+Heroku+PostgreSQL
    ↓ (GitHub Actions, 2時間ごと)
    ↓ db-to-sqlite
SQLite+Datasette+Fly.io
    ↓ (JSON API)
Observable Notebook
    ↓ (Rich Text Copy)
Substack
```

### 主要コンポーネント

1. **db-to-sqlite**: PostgreSQLからSQLiteへの変換
2. **Observable notebook**: SQLite DBからHTMLを生成し、リッチテキストとしてクリップボードにコピー
3. **datasette publish fly**: Fly.ioへの自動デプロイ

---

## 重要な引用・見解

1. **LLM評価について**: 「ベンチマークの1桁%改善より、前モデルで失敗し新モデルで成功する具体例を見せてほしい」

2. **プロンプトインジェクション**: 「モデル訓練での対策より、アプリケーション設計での防御が重要」

3. **オープンモデル**: 完全オープンな訓練データは、バックドア攻撃の監査に不可欠

4. **エンジニアリングマネジメント**: 「良いEM」の定義は業界の現実に応じて変化する（Will Larson）
