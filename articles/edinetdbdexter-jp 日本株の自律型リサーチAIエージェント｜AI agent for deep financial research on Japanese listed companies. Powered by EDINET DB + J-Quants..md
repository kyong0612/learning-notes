---
title: "edinetdb/dexter-jp: 日本株の自律型リサーチAIエージェント｜AI agent for deep financial research on Japanese listed companies. Powered by EDINET DB + J-Quants."
source: "https://github.com/edinetdb/dexter-jp"
author:
  - "[[edinetdb]]"
published: 2026-03-26
created: 2026-03-28
description: "EDINET DBとJ-Quantsを活用し、日本の上場企業（約3,800社）に対して自律的に財務分析・比較・レポート生成を行うAIエージェント。virattt/dexter（米国株版）を日本市場向けに全面改修したTypeScriptプロジェクト。"
tags:
  - "clippings"
  - "AI"
  - "AI Agent"
  - "LangChain"
  - "TypeScript"
  - "Japanese Stocks"
  - "Financial Analysis"
  - "EDINET"
  - "J-Quants"
---

## 概要

Dexter JPは、日本株に特化した自律型リサーチAIエージェントである。[virattt/dexter](https://github.com/virattt/dexter)（米国株版）をフォークし、日本市場向けに全面改修されたプロジェクトで、[EDINET DB](https://edinetdb.jp)と[J-Quants](https://jpx-jquants.com/)をデータソースとして使用する。

一般的な金融ツールが「データの取得・表示」に留まるのに対し、Dexter JPは**自然言語の質問から自律的に分析計画を立て、複数のデータソースを横断し、検証しながらレポートを仕上げる**という点が最大の特徴。1回の質問で、人間が介在せずに包括的な分析が完了する。

## 主要なトピック

### 自律的分析のワークフロー

Dexter JPのエージェントは以下の4ステップで自律的に分析を行う：

1. **計画立案** — 比較に必要な指標（収益性、成長性、財務健全性、リスク）を自分で決定
2. **データ取得** — 複数のツールを自律的に呼び出し、両社の財務データ・有報のリスク要因・決算短信を並列取得
3. **途中検証** — 数字とナラティブに矛盾がないか、データが足りているか自分で判断
4. **レポート出力** — 比較表と結論付きの構造化された分析結果を出力

### アーキテクチャ

```
ユーザーの質問
    ↓
エージェントループ（LangChain）
    ↓ 計画 → ツール選択 → 実行 → 検証 → 繰り返し
    ↓
┌─────────────────────────────────────────┐
│  get_financials（メタツール）             │
│    → get_financial_statements           │
│    → get_company_info                   │
│    → get_key_ratios                     │
│    → get_analysis                       │
│    → get_earnings                       │
├─────────────────────────────────────────┤
│  read_filings                           │
│    → text-blocks（有報テキスト）          │
│    → shareholders（大量保有報告書）       │
├─────────────────────────────────────────┤
│  company_screener（100+ 指標）           │
├─────────────────────────────────────────┤
│  get_stock_price（J-Quants V2）          │
├─────────────────────────────────────────┤
│  web_search / browser / skills          │
└─────────────────────────────────────────┘
    ↓
構造化されたレポート出力
```

### メタツール `get_financials`

単なるAPIラッパーではなく、内部にLLMを持つ**ルーティングエージェント**として設計されている：

1. ユーザーの自然言語クエリを受け取る
2. 内部LLMがどのサブツールを呼ぶべきか判断
3. 複数サブツールを並列実行
4. 結果を統合して返す

例：「ソニーとトヨタの利益率を比較して」→ 内部で4つのAPI呼び出しが自動で走る。

### スキルシステム

複雑な多段階ワークフローは `SKILL.md` で定義。DCFバリュエーションスキルを内蔵：

- 日本国債利回りベースのWACC計算
- 東証PBR1倍割れ問題の文脈
- 円建て分析

### メモリ機能

セッション間で記憶を保持し、投資方針、ポートフォリオ情報、過去の分析結果を覚える。

### 対応LLM

`/model` コマンドでCLI上から切替可能：

- OpenAI（GPT-4o, GPT-4o-mini 等）
- Anthropic（Claude）
- Google（Gemini）
- xAI（Grok）
- OpenRouter
- Ollama（ローカルLLM）

### メッセージング連携

CLIだけでなく、Slack・Discord・LINE・WhatsApp経由でも使用可能。`bun run gateway` で起動。

| チャネル | 方式 | 公開URL | 環境変数 |
|---------|------|---------|---------|
| **Slack** | Socket Mode (WebSocket) | 不要 | `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN` |
| **Discord** | Gateway (WebSocket) | 不要 | `DISCORD_BOT_TOKEN` |
| **LINE** | Webhook (HTTP) | 必要 | `LINE_CHANNEL_SECRET` + `LINE_CHANNEL_ACCESS_TOKEN` |
| **WhatsApp** | Baileys (WebSocket) | 不要 | QRコードでログイン |

設定された環境変数に応じて、対応するチャネルだけが起動し、複数チャネルの同時稼働も可能。

## 重要な事実・データ

- **対応企業数**: 約3,800社（日本上場企業）
- **スクリーニング指標**: 100+
- **データソース**: EDINET DB（必須）、J-Quants（オプション）、Web検索（オプション）
- **ランタイム**: [Bun](https://bun.sh/)
- **言語**: TypeScript
- **ライセンス**: MIT
- **GitHub Stars**: 139（2026-03-28時点）

### データソース一覧

| ソース | 内容 | 必須？ |
|--------|------|--------|
| [EDINET DB](https://edinetdb.jp) | 財務データ、有報テキスト、スクリーニング、AI分析（~3,800社） | 必須 |
| [J-Quants](https://jpx-jquants.com/) | 株価OHLC（東証公式） | オプション |
| Web検索 | Exa / Perplexity / Tavily | オプション |

### オリジナル版（米国株）との主な違い

| | Original (US) | JP Version |
|---|---|---|
| データソース | Financial Datasets API | EDINET DB API |
| 市場 | 米国株 | 日本株（~3,800社） |
| 開示書類 | SEC 10-K/10-Q/8-K | 有価証券報告書 (EDINET) |
| 決算 | 8-K earnings | TDNet 決算短信 |
| 株主情報 | SEC Form 4（インサイダー） | 大量保有報告書（5%超） |
| 株価 | Financial Datasets | J-Quants V2（TSE公式） |
| スクリーニング | GICS分類 | 33業種、100+指標 |
| DCF | 米国金利（~4%） | 日本国債（~1%） |
| 言語 | 英語 | 日本語 + 英語 |

### セットアップ手順

```bash
git clone https://github.com/edinetdb/dexter-jp.git
cd dexter-jp
bun install
cp env.example .env  # 編集してAPIキーを設定
bun run start
```

必須の環境変数は、**LLM APIキー**（OpenAI / Anthropic / Google / xAI / OpenRouter のいずれか1つ）と **EDINET DB APIキー**。J-Quants、Web検索（Exa / Perplexity / Tavily）、X/Twitter検索はオプション。

### 使い方の例

**自律的な分析（エージェントの真価）：**
- 「トヨタの競争力を総合分析して。財務データ、有報のリスク要因、最新決算を踏まえてレポートにまとめて」
- 「ソニーと任天堂、投資先としてどちらが優れているか。財務健全性・収益性・成長性・リスクを比較して結論を出して」
- 「高ROE・高配当の割安銘柄を探して、トップ3の財務健全性と事業リスクを深掘り分析して」
- 「キーエンスのDCFバリュエーションをして。現在の株価水準が割高か割安か判断して」

**シンプルな質問：**
- 「トヨタの直近5年の財務推移を見せて」
- 「ROE15%以上、自己資本比率50%以上の企業をスクリーニングして」

**英語でも動作可能。**

## 結論・示唆

### プロジェクトの位置づけ

Dexter JPは、米国市場で実績のあるDexter（virattt版）を日本市場に完全移植したもので、EDINET DB + J-Quantsという日本独自のデータインフラを活用している。LangChainベースのエージェントループにより、単なるデータ取得ではなく「計画→取得→検証→出力」の自律的な分析サイクルを実現している点が差別化要素。

### 実践的な示唆

- 日本株の財務分析を自動化したい個人投資家やアナリストにとって有用なツール
- EDINET DBのAPIキー（無料枠あり）があれば最低限の環境で稼働可能
- Slack/Discord/LINE連携により、日常的なコミュニケーションツールから直接分析を依頼できる
- オープンソース（MIT）のため、独自の分析ロジックやデータソースの追加が可能

## 制限事項・注意点

- EDINET DB APIキーが必須（無料枠はあるが制限あり）
- 株価データ（J-Quants）はオプションだが、設定しないと株価関連の分析は不可
- LINE連携はWebhook方式のため、外部からアクセス可能なURLが必要（Vercel/Netlifyのようなサーバーレス環境は不可）
- 投資判断は自己責任であり、AIエージェントの分析結果を鵜呑みにすべきではない

---

*Source: [edinetdb/dexter-jp](https://github.com/edinetdb/dexter-jp)*
