---
title: "PaperBanana - Automating Academic Illustration"
source: "https://paperbanana.org/"
author: "Dawei Zhu, Rui Meng, Yale Song, Xiyu Wei, Sujian Li, Tomas Pfister, Jinsung Yoon"
published: 2026-01
created: 2026-02-23
description: "PaperBananaは、AI研究者向けの学術イラスト自動生成エージェントフレームワーク。VLMと画像生成モデルを活用し、テキストやラフスケッチから出版品質の方法論図や統計プロットを自動生成する。NeurIPS 2025の292テストケースからなるベンチマーク（PaperBananaBench）で既存手法を上回る性能を実証。"
tags:
  - "AI"
  - "agentic-framework"
  - "academic-illustration"
  - "VLM"
  - "image-generation"
  - "NeurIPS"
  - "clippings"
---

## 概要

**PaperBanana** は、北京大学とGoogle Cloud AI Researchが共同開発した、学術イラストの自動生成を目的としたエージェントフレームワークである。テキスト記述やラフスケッチから、出版品質（publication-ready）の方法論図や統計プロットを生成する。

- **論文**: [arXiv:2601.23265](https://arxiv.org/abs/2601.23265)
- **コード**: [GitHub - dwzhu-pku/PaperBanana](https://github.com/dwzhu-pku/PaperBanana)（⭐ 3,800+）
- **プロジェクトページ**: [dwzhu-pku.github.io/PaperBanana](https://dwzhu-pku.github.io/PaperBanana/)

---

## 背景と課題

自律的なAI科学者の進歩にもかかわらず、**出版品質のイラスト作成は依然として研究ワークフローの労働集約的なボトルネック**となっている。研究者は論文執筆時に方法論図や統計プロットの作成に多大な時間を費やしており、PaperBananaはこの負担を軽減することを目的としている。

---

## アーキテクチャ：5つの特化エージェント

PaperBananaは、最先端のVLM（Vision-Language Model）と画像生成モデルを活用し、**5つの特化エージェントを協調動作**させる：

| エージェント | 役割 |
|---|---|
| **Retriever** | 関連する参考イラストを検索し、下流エージェントのガイドとなるコンテキストを提供 |
| **Planner** | 認知的中核として、コンテキストを詳細なテキスト記述に変換 |
| **Stylist** | 参考文献からガイドラインを合成し、学術的な美的基準への準拠を保証 |
| **Visualizer** | テキスト記述をビジュアル出力または実行可能コードに変換 |
| **Critic** | 生成画像をソースと照合し、改善のためのフィードバックを提供 |

全体のワークフロー：**Retrieve → Plan → Style → Render → Refine（自己批評による反復改善）**

---

## 主要機能

### 1. テキストからの図生成（Diagram Generation from Scratch）
テキスト記述を入力として受け取り、エージェントがレイアウト設計とコンポーネントレンダリングを協調して実行。
- システム概要図
- 複雑なフローチャート
- モデルアーキテクチャ図

### 2. 手書きスケッチの洗練（Polishing Hand-Drawn Sketches）
ラフスケッチをアップロードすると、マルチモーダル機能が視覚的意図を解釈し、プロフェッショナルな図に変換。
- レイアウト保持
- スタイル一貫性
- スケッチからデジタルへの変換

### 3. 統計プロットの可視化（Statistical Plots Visualization）
高品質な統計プロットを生成し、データの明確性と学術的厳密さを確保。
- ベクター品質の出力
- 正確なデータ表現
- 出版スタイルのチャート

---

## ベンチマーク：PaperBananaBench

既存のベンチマークの欠如に対処するため、**PaperBananaBench** を新たに構築。

- **ソース**: NeurIPS 2025の方法論図から収集
- **構成**: 584の有効サンプル（292テスト + 292リファレンス）
- **構築パイプライン**: (1) 収集・解析 → (2) フィルタリング → (3) カテゴリ分類 → (4) 人手によるキュレーション
- **テストセット統計**: ソースコンテキストの平均長 3,020.1語、図キャプションの平均長 70.4語

---

## 実験結果

PaperBananaBenchでの評価において、PaperBananaは**4つの評価次元すべてで既存のベースラインを一貫して上回る**：

1. **Faithfulness（忠実性）** — ソースコンテキストへの正確な反映
2. **Conciseness（簡潔性）** — 冗長さのない表現
3. **Readability（可読性）** — 明瞭で理解しやすい構成
4. **Aesthetics（美的品質）** — 視覚的な洗練度

### 比較対象
バニラのNano-Banana-Proと比較した場合、PaperBananaは古いカラートーンや冗長な内容を避け、より簡潔で美的にも優れた結果を生成。

---

## 応用事例

### 人間が描いた図の美的品質向上
自動要約された美的ガイドラインを使用し、既存の手描き図の配色、タイポグラフィ、グラフィック要素を大幅に改善。

### コード vs 画像生成モデルによる統計プロット
- **画像生成モデル**: プレゼンテーション面で優秀だが、コンテンツの忠実性（数値のハルシネーション、要素の繰り返し）に劣る
- **コードベースアプローチ**: コンテンツの正確性が高い

---

## 制限事項

- **接続エラー**: 主な失敗モードは冗長な接続やソース・ターゲットノードの不一致
- **Criticモデルの限界**: 接続性の問題を検出できないことが多く、基盤モデル固有の知覚限界に起因する可能性がある
- **コードとデータ**: GitHubリポジトリではREADMEのみ公開されており、コードとデータセットは「約2週間後にリリース」とされている（2026年2月時点）

---

## 所属機関

- **北京大学**（Peking University）
- **Google Cloud AI Research**

## 対応著者

- dwzhu@pku.edu.cn
- lisujian@pku.edu.cn
- jinsungyoon@google.com
