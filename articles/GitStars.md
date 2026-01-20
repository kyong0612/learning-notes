---
title: "GitStars"
source: "https://puzer.github.io/github_recommender/"
author: "Dmitry Nikitko"
published: 2026-01-02
created: 2026-01-20
description: "GitHubのスター履歴を活用して、リポジトリの埋め込みベクトルを学習し、類似リポジトリの推薦やユーザープロファイル分析を行うクライアントサイド完結型のWebアプリケーション"
tags:
  - "clippings"
  - "machine-learning"
  - "embeddings"
  - "recommender-system"
  - "webassembly"
  - "github"
---

## 概要

GitStarsは、GitHubのスター（ブックマーク）データを活用してリポジトリの埋め込みベクトル（Embeddings）を学習し、類似リポジトリの推薦やユーザープロファイルの分析を行うツール。バックエンドなしで100%クライアントサイドで動作し、WASMを使ったベクトル検索を実現している。

## 主要コンセプト

### クラスター仮説

類似したものは類似したコンテキストに現れるという原則に基づく。GitHubのスターは単なるブックマークではなく、開発者の専門的な関心とスキルのスナップショットであり、これを活用してリポジトリ間の意味的類似性を学習する。

### リポジトリ表現

意味的に類似したリポジトリが近い位置に配置される空間を構築。例えば：
- **X軸**: データ（準備・分析）vs モデル（学習・推論）
- **Y軸**: ローカル/シングルノード vs ビッグデータ/クラスター

## 技術的実装

### データソース

| 種類 | 説明 | 用途 |
|------|------|------|
| **テキスト（README）** | Qwen3-Embedding-0.6Bモデルで128次元に圧縮 | 初期化（コールドスタート対策） |
| **スター行列** | 400万人の開発者、250万リポジトリ | メイン学習 |

### データ準備

- **データソース**: GitHub Archive（BigQuery）から約1TBの生データを処理
- **フィルタリング**: 10〜800個のスターを持つユーザー（ボットや非アクティブユーザーを除外）
- **出力**: 約400万ユーザー、約250万ユニークリポジトリのParquetファイル

### モデル構成

```
Model: torch.nn.EmbeddingBag
- 軽量な lookup table: repo_id -> vector[128]
- ベクトルの効率的な集約（平均）が可能
```

### 学習方法（Metric Learning）

1. 各ユーザーのスターリストを2つのランダムなバケットに分割
2. `EmbeddingBag`で各バケットの集約埋め込みを計算
3. **学習目標**:
   - 同一ユーザーのバケット同士を近づける（A1 ↔ A2）
   - 異なるユーザーのバケットを遠ざける（B1 ⇄ A2）
4. **損失関数**: MultiSimilarityLoss（pytorch-metric-learning）

### 品質評価

**Awesome Lists**（人間がキュレーションしたリポジトリクラスター）をGround Truthとして使用し、NDCG指標でランキング品質を評価。

## 主要機能

### 1. リポジトリ推薦

- **コサイン類似度**でベクトル間の角度を測定
- ユーザーのスターしたリポジトリの平均ベクトルから興味を推定
- LLMのような人気バイアスがなく、ニッチなツールや新しいソリューションを発見可能

### 2. スキルレーダー

ユーザーの技術スキルをRPGスタイルで可視化：
1. LLMで10カテゴリ（GenAI、Web3、System Programmingなど）の参照リポジトリを生成
2. 線形プローブ（Logistic Regression）を学習
3. ユーザーベクトルをこれらのモデルに通して確率スコアを生成

### 3. プロファイル比較

- 有名な開発者（Linus Torvalds、Andrej Karpathyなど）との比較
- **分位変換**を適用：「95% Match」= ランダムペアの95%よりも類似

### 4. サーバーレス共有

- ユーザーベクトルを圧縮・Base64エンコードしてURLフラグメントに埋め込み
- データベースやバックエンド不要

## フロントエンド技術

| コンポーネント | 技術 |
|----------------|------|
| **データ** | 圧縮埋め込み（FP16、約80MB）をIndexedDBにキャッシュ |
| **検索** | USearchライブラリのWASMコンパイル版 |
| **FP16処理** | オンザフライでFP16→FP32変換 |

### 低レベル最適化

- HNSWインデックスは生埋め込みよりメモリ消費が大きいため、Exact Searchを採用
- `_usearch_exact_search`メソッドでメモリを手動管理
- 30万ベクトルでも高速に動作

## 結果と限界

### うまくいったこと

- メイン目標達成：未知だが意味的に関連するリポジトリを発見
- ニッチなツール、新しいソリューションの発掘
- ローカルファーストの動作

### うまくいかなかったこと

- ベクトル演算（例：`Pandas - Python + TypeScript = Danfo.js`）は機能しない
- 埋め込みの明確なクラスター構造は視覚的に顕著ではない

## 将来の展望

1. **セマンティックテキスト検索**: テキストエンコーダーからリポジトリ埋め込み空間への射影層を学習
2. **GitHub Tinder（ネットワーキング）**: メンター・共同創業者マッチング、HR Tech活用
3. **トレンド分析**: 時間次元を追加してHacker Newsに載る前のトレンドを発見

## リソース

- **デモ**: https://puzer.github.io/github_recommender/
- **ソースコード + データセット**: https://github.com/Puzer/github-repo-embeddings
- **ブログ記事**: https://dev.to/dmitry_nikitko_ea8cddb8ce/training-github-repository-embeddings-using-stars-177l

## 技術スタック

- PyTorch（EmbeddingBag）
- pytorch-metric-learning（MultiSimilarityLoss）
- Qwen3-Embedding-0.6B（テキスト埋め込み）
- USearch（WASM版ベクトル検索）
- IndexedDB（クライアントサイドキャッシュ）
