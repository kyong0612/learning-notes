---
title: "Long-running Claude for scientific computing"
source: "https://www.anthropic.com/research/long-running-Claude"
author: "Siddharth Mishra-Sharma"
published: 2026-03-23
created: 2026-03-25
description: "Anthropicの研究者が、数日間にわたる自律的なエージェントコーディングワークフロー（テストオラクル、永続メモリ、オーケストレーションパターン）を科学計算タスクに適用する方法を、微分可能な宇宙論ボルツマンソルバーの実装を通じて解説する。"
tags:
  - "clippings"
  - "Claude Code"
  - "scientific-computing"
  - "agentic-workflow"
  - "cosmology"
  - "JAX"
  - "HPC"
  - "autonomous-agents"
---

## 概要

Anthropic Discovery チームの研究者 Siddharth Mishra-Sharma が、**数日間にわたる長時間自律エージェントワークフロー**を科学計算に適用する方法を解説した記事。具体例として、Claude Opus 4.6 を使い、宇宙論で用いられる**微分可能なボルツマンソルバー（[clax](https://github.com/smsharma/clax)）**を JAX でゼロから実装した。

---

## 前提：会話型から自律型へのパラダイムシフト

- 従来の科学者の AI 活用は「会話ループ」で各ステップを逐一管理するスタイルだった
- モデルの[長期タスク処理能力が大幅に向上](https://metr.org/time-horizons/)し、**高レベルの目標を指定してエージェント群に自律的に作業させる**新しい手法が出現
- 適したタスク例：
  - 数値ソルバーの再実装
  - 古い Fortran コードのモダン言語への移植
  - 参照実装に対する大規模コードベースのデバッグ
- 共通条件：**スコープが明確、成功基準が定量的、人間の監視が断続的で済む**

### 具体例：微分可能ボルツマンソルバー

- **ボルツマンソルバー**（[CLASS](http://class-code.net/)、[CAMB](https://camb.info/)）は宇宙論の基盤的ソフトウェアで、宇宙マイクロ波背景放射（CMB）の統計的性質を予測する
- 微分可能版を作ることで**勾配ベースの推論手法**が使え、パラメータ推定が劇的に高速化
- JAX は自動微分と GPU アクセラレータ対応を「無料で」提供するため最適
- 著者の専門外のタスクであり、専門家チームなら**数ヶ月〜数年**かかる開発を、エージェントで数日に圧縮できるかの検証

### Anthropic C コンパイラプロジェクトとの構造的違い

| 項目 | C コンパイラ | ボルツマンソルバー |
|---|---|---|
| 並列化 | 約 2,000 セッションに分散可能 | 深く結合したパイプライン、直列的 |
| エラー伝播 | モジュール単位で独立 | 初期宇宙の再結合の小さな数値誤差が下流全体に影響 |
| デバッグ手法 | 並列エージェント群 | 単一エージェントが因果的にチェーンを追跡し、必要に応じてサブエージェントを生成 |

---

## ワークフローの構成要素

### 1. 計画の起草とローカル反復（CLAUDE.md）

- **CLAUDE.md** にプロジェクトの成果物・関連コンテキストを明文化
- Claude はこのファイルを特別扱いし、コンテキストに保持し続ける
- **Claude 自身が作業を進めながら CLAUDE.md を編集・更新**できる
- [初期の CLAUDE.md 例](https://github.com/smsharma/clax/blob/6a6b2330cf25edded1bb31ec57a0091aa794a5d3/CLAUDE.md)：全体計画と設計決定を記載
- 目標設定例：参照 CLASS 実装に対し主要科学成果物で **0.1% の精度**（CLASS と CAMB 間の典型的な一致レベル）

### 2. セッション間のメモリ（CHANGELOG.md）

CHANGELOG.md はエージェントの**ポータブルな長期記憶**（ラボノート）として機能する。記録すべき内容：

- 現在のステータス
- 完了タスク
- **失敗したアプローチとその理由**（重要：なければ後続セッションが同じ袋小路を繰り返す）
- 主要チェックポイントでの精度テーブル
- 既知の制限事項

> 失敗例の記録："Tried using Tsit5 for the perturbation ODE, system is too stiff. Switched to Kvaerno5."

### 3. テストオラクル

- 長時間自律的な科学作業には**進捗を定量的に判定する手段**が不可欠
- 選択肢：参照実装、定量化可能な目標、既存テストスイート
- 本例では **CLASS C ソースコード**を参照実装としたユニットテストを構築・継続実行
- リグレッション防止のためテストスイートを拡充するようエージェントに指示

### 4. Git による協調

- エージェントは**意味のある作業単位ごとにコミット＆プッシュ**
- 効果：回復可能な履歴、進捗の可視化、計算リソース喪失時の作業損失防止
- CLAUDE.md に指示例：`"Commit and push after every meaningful unit of work. Run pytest tests/ -x -q before every commit. Never commit code that breaks existing passing tests."`
- 遠隔操作：ローカルの Claude Code にSSH接続でクラスタ上のコマンドを実行させる方法が便利

---

## 実行ループ

### HPC クラスタでの実行

SLURM ジョブスケジューラを使い、tmux セッション内で Claude Code を起動する：

```bash
#!/bin/bash
#SBATCH --job-name=claude-agent
#SBATCH --partition=GPU-shared
#SBATCH --gres=gpu:h100-32:1
#SBATCH --time=48:00:00
#SBATCH --output=agent_%j.log
cd $PROJECT/my-solver
source .venv/bin/activate
export TERM=xterm-256color
tmux new-session -d -s claude "claude; exec bash"
tmux wait-for claude
```

- ジョブ開始後、tmux セッションにアタッチして指示（例：「CHANGELOG.md を読んで次のタスクを開始」）
- デタッチ後はスマホで GitHub のコミット履歴を確認するなど、断続的に監視

```bash
srun --jobid=JOBID --overlap --pty tmux attach -t claude
```

### Ralph ループ（オーケストレーションパターン）

現行モデルの課題として**エージェントの怠慢**がある（複雑なタスクの途中で完了を宣言してしまう）。

- **[Ralph ループ](https://ghuntley.com/loop/)**：エージェントが完了を主張するたびにコンテキストに押し戻し、本当に終わったか確認する for ループ
- `/plugin` でインストール可能
- 類似パターン：[GSD](https://github.com/gsd-build/get-shit-done)、[ドメイン特化版](https://arxiv.org/abs/2603.20179)、Claude Code ネイティブの `/loop` コマンド

```
/ralph-loop:ralph-loop "Please keep working on the task until the success criterion of 0.1% accuracy across the entire parameter range is achieved." --max-iterations 20 --completion-promise "DONE"
```

---

## 結果

- Claude は数日間でゼロからプロジェクトを構築し、**参照 CLASS 実装に対しサブパーセントの精度**を達成
- CMB 角度パワースペクトルの精度推移グラフが開発軌跡を示す

### 観察された課題

- テストカバレッジのギャップ：一時期、単一のフィデューシャルパラメータ点でのみテストしており、バグ検出範囲が狭かった
- ゲージ規約の取り違えなど初歩的ミス
- 宇宙論者なら即座に気づくバグの修正に数時間費やすことも
- それでも**精度目標に向けて持続的に進捗**

### 副次的効果

- 著者は Git コミット履歴を追うことで**ボルツマンソルバーと背景物理を学習**
- コミットログは「高速で超字義通りなポスドクのラボノート」のように読める

---

## 重要な結論と示唆

1. **研究者の数ヶ月〜数年の作業を数日に圧縮可能**（ただし完全にプロダクション品質ではない）
2. エージェント駆動開発は**明確な成功基準を持つ科学計算タスク**に特に有効
3. **コアパターン**はコンピュート環境に依存しない：
   - 進捗ファイル（CHANGELOG.md）
   - テストオラクル（参照実装）
   - エージェントプロンプトと明確なルール（CLAUDE.md）
4. 「**エージェントを動かさない夜はすべて、テーブルに残された潜在的な進捗**」— 実験を一晩走らせるのと同じ感覚でエージェントを稼働させる時代

### 制限事項

- 結果のソルバーは**プロダクショングレードではない**（すべての領域で参照 CLASS 実装と許容可能な精度で一致するわけではない）
- 深く結合したパイプラインでは小さな数値誤差が下流全体に波及するリスクがある
- エージェントの「怠慢」問題に対処するためのオーケストレーションが依然として必要