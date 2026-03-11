---
title: "Trendshift - Explore open-source repositories and find some insights"
source: "https://trendshift.io/"
author: "Trendshift"
published:
created: 2026-03-11
description: "GitHubのオープンソースリポジトリのトレンドを、日次エンゲージメントデータに基づく独自スコアリングアルゴリズムで分析・可視化するプラットフォーム。GitHub Trendingの代替として、より一貫性のあるトレンド発見を提供する。"
tags:
  - "open-source"
  - "GitHub"
  - "trending"
  - "developer-tools"
  - "data-analytics"
---

## 概要

**Trendshift** は、キュレーションされたオープンソースリポジトリのアクティビティを分析し、注目に値するプロジェクトを発見するためのプラットフォーム。GitHub Trendingの代替として、日次エンゲージメント指標に基づく一貫したスコアリングアルゴリズムを用いて、注目度が上昇しているリポジトリをサーフェスする。

## 主要機能

### 1. Daily Explore（デイリー探索）

- エンゲージメントが上昇中のリポジトリをランキング形式で表示
- GitHub Trendingとは異なる独自のスコアリングアルゴリズムを採用
- スター数・フォーク数とともにリポジトリの概要を掲載
- 各リポジトリへのGitHubリンクを提供

### 2. GitHub Trending（トレンド履歴）

- GitHub Trendingに継続的に掲載されているリポジトリの履歴を追跡
- 「何日間トレンドに掲載されたか」を集計して表示
- 歴代のトレンドリポジトリをランキング化（例: `codecrafters-io/build-your-own-x` は117日間トレンド入り）

### 3. Stats（統計情報）

- プログラミング言語別の月次スター数・フォーク数をチャートで可視化
- 年間を通じた言語別スター数・フォーク数の比較
- 追跡対象: **Python, TypeScript, Go, Rust** 等の主要言語

### 4. リポジトリ登録 & バッジ埋め込み

- ユーザーが自身のリポジトリをTrendshiftに登録可能（Submit repository）
- Trendshiftバッジを生成し、リポジトリのREADMEに埋め込める

## 現在のトレンド（2026年3月時点）

2026年3月時点のトレンドには以下の傾向が見られる:

| カテゴリ | 代表的なリポジトリ | スター数 |
|---|---|---|
| AIエージェント | `anthropics/claude-code`, `obra/superpowers`, `msitarzewski/agency-agents` | 75.7k, 75k, 18.4k |
| AI研究 | `karpathy/autoresearch`, `karpathy/nanochat` | 23k, 45.4k |
| LLMプラットフォーム | `langgenius/dify`, `bytedance/deer-flow` | 132.1k, 26.9k |
| プロンプト/RAG | `promptfoo/promptfoo`, `langflow-ai/openrag` | 11.9k, 315 |
| 自律型エージェント | `paperclipai/paperclip`, `openclaw/openclaw` | 15.4k, 289.6k |
| ブラウザ自動化 | `alibaba/page-agent` | 2.4k |

**注目ポイント**: AIエージェント・LLM関連プロジェクトがトレンドの大部分を占めており、2026年のオープンソースコミュニティにおけるAI開発の活発さを反映している。

## GitHub Trending歴代ランキング（上位5）

| 順位 | リポジトリ | トレンド日数 | スター数 |
|---|---|---|---|
| 1 | `codecrafters-io/build-your-own-x` | 117日 | 474k |
| 2 | `microsoft/generative-ai-for-beginners` | 78日 | 107.8k |
| 3 | `lobehub/lobe-chat` | 76日 | 71.8k |
| 4 | `public-apis/public-apis` | 72日 | 406.3k |
| 5 | `practical-tutorials/project-based-learning` | 69日 | 260.8k |

## 言語別トレンド統計（2026年）

Trendshiftが追跡する主要言語:

- **Python** — AI/ML関連プロジェクトの圧倒的な採用
- **TypeScript** — Webアプリ・エージェントプラットフォームで多用
- **Go** — クラウドネイティブ・インフラツール
- **Rust** — 高パフォーマンスシステム（例: `juspay/hyperswitch`）

## 活用方法

1. **技術トレンドの把握**: 日次・月次のトレンドデータからオープンソースコミュニティの動向を把握
2. **プロジェクト発見**: GitHub Trendingでは見落としがちなリポジトリを一貫したアルゴリズムで発見
3. **言語別分析**: Stats機能で特定言語の人気推移を確認し、技術選定の参考に
4. **自プロジェクトのプロモーション**: リポジトリ登録とバッジ埋め込みで可視性を向上
