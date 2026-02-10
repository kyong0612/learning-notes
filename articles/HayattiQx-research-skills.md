---
title: "HayattiQ/x-research-skills"
source: "https://github.com/HayattiQ/x-research-skills/tree/main"
author:
  - "[[HayattiQ]]"
published: 2026-02-10
created: 2026-02-10
description: "X(Twitter)検索を使った記事執筆の前工程リサーチ自動化ツール。xAI (Grok) の x_search を活用し、一次情報・用語定義・反論・数字を揃えた Context Pack を生成するスキルとCLIスクリプトを提供する。"
tags:
  - "clippings"
  - "AI"
  - "Agents"
  - "xAI"
  - "Grok"
  - "research-automation"
  - "Claude-Code-Skills"
---

## 概要

`x-research-skills` は、記事執筆の**前工程（書く前の地ならし）**として、X(Twitter) 検索を活用した周辺リサーチを自動化するためのリポジトリ。xAI の Grok API（`x_search` ツール）を通じて、一次情報・用語定義・反論・dated な数字を収集し、**Context Pack** と呼ばれる構造化されたマークダウン文書を生成する。

## リポジトリ構成

| パス | 役割 |
|---|---|
| `skills/article-agent-context-research/SKILL.md` | Agent Skill 定義（Claude Code等で利用可能） |
| `scripts/grok_context_research.ts` | CLI実行用 TypeScript スクリプト |
| `data/context-research/` | 成果物（Context Pack）の保存先 |

## Skill: article-agent-context-research

### 目的

- **factcheck（書いた後の裏取り）** ではなく、**書く前の地ならし**
- 任意のトピックについて、Web上の一次情報・定義・反論・関連事例を集め、記事が"薄くならない"状態を作る

### デフォルト設定

| 項目 | 設定 |
|---|---|
| プラットフォーム | X(Twitter) 固定 |
| 目的 | impressions の最大化 |
| 想定読者 | 投資家・エンジニア向け |
| 領域 | AI / Web3 |
| トンマナ | 常体、ストーリー薄め、結論先出し |
| NG | 投資助言/断定は避ける |

### 使用タイミング

- 候補ネタは良いが記事にすると"中身が薄い"懸念がある
- 定義・一次情報・反論が揃っていない
- 公式ドキュメント、GitHub、論文、仕様、比較などの周辺情報を拾って深みを出したい
- `$article-agent-outliner` の前に材料を厚くしたい

### ワークフロー

1. **Select topic** — 入力されたトピックをそのまま検索・整理の主題にする
2. **Web search plan** — 最低8クエリを以下の型で構成:
   - 定義（API仕様、ツール定義など）
   - 一次情報（公式Docs/ブログ/仕様/料金/利用規約）
   - 実装（GitHub/サンプルコード/SDK/MCP server examples）
   - 反論（制限、レート、偏り、信頼性、コンプラ）
   - 比較（代替手段との違い）
3. **Collect sources** — 優先順位: 公式（一次情報）> GitHub（実装）> 信頼できる二次情報
4. **Extract "depth"** — 記事が深くなる要素を最低2つ:
   - 数字（dated）: 料金/レート/制限/仕様
   - 反論と返し: 「できないこと/危険」と「対策」
   - 定義: 用語の誤解を潰す一文
5. **Draft context pack** — Grok（x_search）に委任してContext Packを生成

### 一次情報の優先度ルール

> 公式 > 公式GitHub/実装 > 信頼できる二次情報

- 数字/仕様/制限は「As of（参照日）」を必ず付ける
- 長文の直接引用は避ける（要旨 + URL）
- X投稿URLは Secondary 扱い

## CLIスクリプト: grok_context_research.ts

### 前提条件

- Node.js が動作すること
- `tsx` でTypeScriptを実行できること
- xAI API Key を用意していること

### セットアップ

環境変数 `XAI_API_KEY` を設定する。`.env` ファイルまたは `export` で指定可能。

```bash
export XAI_API_KEY="..."
```

任意で `XAI_BASE_URL`（デフォルト: `https://api.x.ai`）と `XAI_MODEL`（デフォルト: `grok-4-1-fast-reasoning`）も設定可能。

### 使い方

```bash
cd x-research-skills
npx tsx scripts/grok_context_research.ts --topic "ClaudeにX検索を足してリサーチを自動化する"
```

### 主要オプション

| オプション | デフォルト | 説明 |
|---|---|---|
| `--topic` | (必須) | リサーチ対象のトピック |
| `--locale` | `ja` | `ja` または `global` |
| `--audience` | `engineer` | `engineer` / `investor` / `both` |
| `--goal` | 周辺情報リサーチ | リサーチの目的 |
| `--days` | `30` | 検索の遡り日数 |
| `--out-dir` | `data/context-research` | 出力ディレクトリ |
| `--dry-run` | - | リクエストpayloadを表示して終了 |
| `--raw-json` | - | レスポンスJSONもstderrに出力 |

### 出力ファイル

`data/context-research/` に以下の3ファイルが保存される:

| ファイル | 内容 |
|---|---|
| `YYYYMMDD_HHMMSSZ_context.md` | Context Pack 本体 |
| `YYYYMMDD_HHMMSSZ_ja_context.json` | リクエスト・レスポンス・パラメータの完全ログ |
| `YYYYMMDD_HHMMSSZ_ja_context.txt` | 抽出テキスト |

### Context Pack の出力構造

生成されるContext Packは以下のセクションを含む:

- **Meta** — Timestamp, Topic, Audience, Voice
- **Topic** — 1文のトピック定義
- **Why Now** — 3つの理由
- **Key Questions** — 5〜8の重要な問い
- **Terminology / Definitions** — Source付き用語定義
- **Primary Sources** — 公式URL（X投稿以外）
- **Secondary Sources** — X投稿URL等
- **Contrasts / Counterpoints** — Evidence付き反論
- **Data Points (dated)** — As of, Source付き数字
- **What We Can Safely Say / What We Should Not Say** — 安全に言えること/言えないこと
- **Suggested Angles** — 3つの記事切り口
- **Outline Seeds** — 3〜6の見出し案
- **Sources** — URL一覧

## スクリプトの技術的実装

- xAI の **Responses API** (`/v1/responses`) を使用
- `x_search` ツールを有効化してGrokにWeb検索を委任
- タイムアウトは180秒
- レスポンスの `output` フィールドからテキストを抽出し、3形式（md/json/txt）で保存
- 独自の `.env` パーサーを内蔵（外部依存なし）

## エージェントパイプラインでの位置づけ

このスキルは記事作成の一連のエージェントパイプラインの中に位置づけられている:

1. `$article-agent-ideation` — ネタ出し
2. **`$article-agent-context-research`（本ツール）** — 周辺リサーチ
3. `$article-agent-outliner` — 見出し作成（Context Packを入力にする）
4. `$article-agent-writer` — 本文執筆
5. `$article-agent-research-factcheck` — 書き上げ後の裏取り

## 注意点・制限事項

- xAI API Key が必要（有料API）
- `x_search` はX(Twitter)のデータに基づくため、X上に投稿されていない情報は検索対象外
- 投資助言に見える表現（買い/売り推奨、価格目標など）は出力に含めないよう設計されている
- 数字・仕様は変更され得るため、「As of（参照日）」の付与が必須
- ライセンスは未指定
