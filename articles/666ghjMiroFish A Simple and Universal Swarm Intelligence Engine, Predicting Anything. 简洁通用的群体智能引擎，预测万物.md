---
title: "666ghj/MiroFish: A Simple and Universal Swarm Intelligence Engine, Predicting Anything. 简洁通用的群体智能引擎，预测万物"
source: "https://github.com/666ghj/MiroFish"
author:
  - "[[666ghj]]"
published: 2025-11-26
created: 2026-03-12
description: "MiroFishは、マルチエージェント技術を活用した次世代AI予測エンジン。現実世界のシード情報（ニュース・政策・金融シグナル等）から高忠実度の並行デジタルワールドを自動構築し、独立した人格・長期記憶・行動ロジックを持つ数千のエージェントによる社会シミュレーションを通じて未来を推演する。盛大集団の戦略的支援を受け、OASISエンジンを基盤とする。"
tags:
  - "clippings"
  - "multi-agent-simulation"
  - "swarm-intelligence"
  - "llm"
  - "future-prediction"
  - "knowledge-graph"
---

## 概要

**MiroFish** は、マルチエージェント技術を基盤とした次世代AI予測エンジンである。現実世界からシード情報（突発ニュース、政策草案、金融シグナルなど）を抽出し、高忠実度の**並行デジタルワールド**を自動構築する。この仮想空間内で、独立した人格・長期記憶・行動ロジックを持つ数千のインテリジェントエージェントが自由に相互作用し、社会的進化を遂げる。ユーザーは「神の視点」から動的に変数を注入し、未来の軌道を精密に推演できる。

> **入力**: シード素材（データ分析レポートや小説ストーリー等）をアップロードし、自然言語で予測要件を記述
> **出力**: 詳細な予測レポート + 深くインタラクション可能な高忠実度デジタルワールド

- **GitHub**: [666ghj/MiroFish](https://github.com/666ghj/MiroFish)
- **公式サイト**: [mirofish.ai](https://mirofish.ai)
- **ライセンス**: AGPL-3.0
- **言語**: Python
- **Stars**: 約16,900 / **Forks**: 約1,800

## ビジョン

MiroFishは現実を映す**群体智能ミラー**の構築を目指している。個体間のインタラクションが引き起こす集団的創発（Emergence）を捉え、従来の予測手法の限界を突破する。

| レベル | 役割 |
|--------|------|
| **マクロ** | 意思決定者のリハーサル実験室。政策やPR戦略をゼロリスクで試行錯誤可能 |
| **ミクロ** | 個人ユーザーのクリエイティブサンドボックス。小説の結末推演や思考実験など、楽しく手軽に利用可能 |

## ワークフロー

MiroFishの処理は以下の5段階で構成される。

1. **グラフ構築**: 現実世界のシード抽出 → 個体・集団の記憶注入 → GraphRAG構築
2. **環境セットアップ**: エンティティ関係抽出 → ペルソナ生成 → 環境設定Agentによるシミュレーションパラメータ注入
3. **シミュレーション実行**: デュアルプラットフォーム並列シミュレーション → 予測要件の自動解析 → 時系列記憶の動的更新
4. **レポート生成**: ReportAgentが豊富なツールセットでシミュレーション後の環境と深く対話
5. **深層インタラクション**: シミュレーション世界内の任意のエージェントやReportAgentとの対話

## デモ事例

### 1. 武漢大学世論シミュレーション予測

微舆BettaFishで生成した「武漢大学世論レポート」を入力とした推演予測のデモ。MiroFishプロジェクトの解説も含む。

### 2. 『紅楼夢』失われた結末の推演予測

『紅楼夢』前80回の数十万字をもとに、MiroFishが失われた結末を深層予測した事例。

> **金融方向の推演予測**、**時事ニュースの推演予測**なども今後順次追加予定。

## クイックスタート

### ソースコードデプロイ（推奨）

**前提条件**:

| ツール | バージョン | 説明 |
|--------|-----------|------|
| Node.js | 18+ | フロントエンドランタイム（npm含む） |
| Python | ≥3.11, ≤3.12 | バックエンドランタイム |
| uv | 最新版 | Pythonパッケージマネージャー |

**手順**:

```bash
# 環境変数の設定
cp .env.example .env
# .envファイルにAPIキーを記入
```

必須の環境変数:

- `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL_NAME` — OpenAI SDK形式のLLM API（推奨: Alibaba Bailian の qwen-plus）
- `ZEP_API_KEY` — Zep Cloudの設定（無料枠で基本利用可能）

```bash
# 依存関係の一括インストール
npm run setup:all

# サービス起動（フロントエンド + バックエンド）
npm run dev
```

- フロントエンド: `http://localhost:3000`
- バックエンドAPI: `http://localhost:5001`

### Docker デプロイ

```bash
cp .env.example .env
docker compose up -d
```

ポートマッピング: `3000`（フロントエンド）/ `5001`（バックエンド）

## 技術的特徴

- **GraphRAG**: ナレッジグラフベースのRAG（Retrieval-Augmented Generation）でシード情報を構造化
- **デュアルプラットフォーム並列シミュレーション**: 複数のシミュレーションプラットフォームを並行稼働
- **時系列記憶の動的更新**: エージェントの記憶が時間経過とともに進化
- **ReportAgent**: シミュレーション結果と深く対話するための専用エージェント
- **OASISエンジン**: [CAMEL-AI/OASIS](https://github.com/camel-ai/oasis)（Open Agent Social Interaction Simulations）を基盤とするシミュレーションエンジン

## 謝辞・サポート

- **盛大集団（Shanda Group）** の戦略的支援とインキュベーションを受けている
- シミュレーションエンジンは **[OASIS](https://github.com/camel-ai/oasis)**（CAMEL-AIチーム）によって駆動
- MiroFishチームはマルチエージェントシミュレーション・LLMアプリケーションに関心のあるフルタイム/インターン人材を募集中（連絡先: mirofish@shanda.com）

## リンク

- [GitHub リポジトリ](https://github.com/666ghj/MiroFish)
- [ライブデモ](https://666ghj.github.io/mirofish-demo/)
- [Discord](https://discord.com/channels/1469200078932545606/1469201282077163739)
- [X (Twitter)](https://x.com/mirofish_ai)
- [Instagram](https://www.instagram.com/mirofish_ai/)
- [DeepWiki](https://deepwiki.com/666ghj/MiroFish)
