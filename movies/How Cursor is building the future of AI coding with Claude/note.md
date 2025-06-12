---
title: How Cursor is building the future of AI coding with Claude
source: https://www.youtube.com/watch?v=BGgsoIgbT_Y
author:
  - Anthropic
  - Cursor
published: 2024-2025
created: 2025-06-12 18:09:22
description: |
  CursorとClaudeの統合によるAIコーディングの未来について解説した動画。AIネイティブIDEとしてのCursorの特徴と、Claude Opus 4やSonnet 4といった最新AIモデルの活用方法を紹介。
tags:
  - Cursor
  - Claude
  - AI coding
  - IDE
  - programming
  - software development
  - Anthropic
  - AI tools
  - developer productivity
---
# 「How Cursor is building the future of AI coding with Claude」詳細解説

この動画は、AIコーディングツール「Cursor」とAnthropicのClaudeモデルの進化、現場での活用、今後の課題や未来像を深く掘り下げて議論しています。

---

## 1. 登場人物と背景

- **司会**：AnthropicのAlex（Claude Relations担当）
- **ゲスト**：Cursorの創業メンバーやエンジニア（Aman、Lukas、Jacob）

AnthropicはAIモデル「Claude」を開発、CursorはAIを活用したコーディングツールを提供しています。

---

## 2. Cursorの急成長とAIの進化

- Cursorは1年で3億ドル以上の収益、数百万人の開発者が利用するまでに成長。[${DIA-SOURCE}](dia://timestamp?start=0:36)
- Claude 3.5 Sonnetなどの新しいAIモデルの登場で、コード補完やマルチファイル編集など、従来できなかった高度な機能が実現。[${DIA-SOURCE}](dia://timestamp?start=1:06)
- モデルの進化とともに、Cursor自体も「Tab補完」→「ファイル編集」→「マルチファイル編集」→「エージェント機能」と段階的に進化。[${DIA-SOURCE}](dia://timestamp?start=1:46)

---

## 3. Cursorを使ってCursorを開発する「自己改善ループ」

- Cursorの開発チームは、自社ツールを使って日々の開発を行い、実際の課題や不便さを自分たちで発見し、素早く改善。[${DIA-SOURCE}](dia://timestamp?start=3:12)
- 社内でのフィードバックを重視し、役立たない機能はすぐに廃止、役立つものは素早く展開。これにより開発サイクルが高速化。[${DIA-SOURCE}](dia://timestamp?start=4:54)

---

## 4. AI機能の使い分けと開発フロー

- **Tab補完**：自分の頭の中にコードベースが入っているとき、素早く意図を伝えるのに便利。[${DIA-SOURCE}](dia://timestamp?start=5:38)
- **Command K**：特定の領域やファイル全体の編集に使う。[${DIA-SOURCE}](dia://timestamp?start=6:25)
- **Agent**：複数ファイルの編集や、より大きな変更に適している。[${DIA-SOURCE}](dia://timestamp?start=6:30)
- **バックグラウンドエージェント**：複数のタスクを並行して進め、必要に応じて人間が介入できる新機能。仮想環境（VM）上で独立して作業し、VS Code拡張なども利用可能。[${DIA-SOURCE}](dia://timestamp?start=8:02)

---

## 5. 今後の課題と技術的ボトルネック

- **コード生成の次の壁**：AIがコードを書くのは得意になってきたが、「レビュー」や「検証」の自動化が次の課題。[${DIA-SOURCE}](dia://timestamp?start=8:43)
- **大規模コードベースの難しさ**：依存関係や独自DSL、組織知識など、巨大なコードベースではAIが全体を把握するのが難しい。[${DIA-SOURCE}](dia://timestamp?start=12:21)
- **組織知識の壁**：Slackでのやりとりや暗黙知など、コード外の知識も重要な要素となる。[${DIA-SOURCE}](dia://timestamp?start=14:26)

---

## 6. コードの書き方や設計の変化

- LLM（大規模言語モデル）が読みやすいようにAPI設計やコード構造が変化しつつある。[${DIA-SOURCE}](dia://timestamp?start=15:56)
- ただし「クリーンコード」の原則（重複を避ける、シンプルに保つ）は人間にもAIにも有効であり、今後ますます重要になる。[${DIA-SOURCE}](dia://timestamp?start=16:44)

---

## 7. エンジニア教育とAI時代のスキル

- AIによる自動化が進んでも、設計力や「テイスト」、問題解決力は不可欠。[${DIA-SOURCE}](dia://timestamp?start=17:45)
- AIは学習や試行錯誤のスピードを上げるツールとしても有効で、若手エンジニアの成長を加速させる可能性がある。[${DIA-SOURCE}](dia://timestamp?start=18:40)
- 将来的には、詳細な実装を知らなくても高いレベルで開発できるエンジニアが増える可能性も指摘。[${DIA-SOURCE}](dia://timestamp?start=19:15)

---

## 8. Claude 4シリーズの評価と今後

- Claude Opus 4やSonnet 4は、従来のモデルの弱点（テストの書き換えや過剰な編集など）を克服し、より賢くなっていると評価。[${DIA-SOURCE}](dia://timestamp?start=20:06)
- コーディング以外の分野でも、推論やエージェント的な動作が強化されている。[${DIA-SOURCE}](dia://timestamp?start=22:41)

---

## 9. 未来のソフトウェア開発像

- 2027年にはほぼすべてのコードがAIを介して生成されるようになり、非エンジニアも自分専用のソフトウェアを作る時代になると予想。[${DIA-SOURCE}](dia://timestamp?start=25:44)
- ただし「何を作るか」「どう設計するか」という人間の判断やテイストは今後も重要。[${DIA-SOURCE}](dia://timestamp?start=26:34)
- ソフトウェアがユーザーの使い方に合わせて自動で変化する未来像も語られる。[${DIA-SOURCE}](dia://timestamp?start=29:05)

---

## 10. エンジニアへのアドバイス

- スタートアップは優秀な人材が集まりやすく、少人数で大きなインパクトを出せる環境が魅力と語られる。[${DIA-SOURCE}](dia://timestamp?start=30:02)

---
