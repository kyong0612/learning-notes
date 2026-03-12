---
title: "Codex doesn't seem to work? · Issue #57 · karpathy/autoresearch"
source: "https://github.com/karpathy/autoresearch/issues/57"
author:
  - "[[karpathy]]"
published: 2026-03-09
created: 2026-03-12
description: "karpathyがautoresearchプロジェクトでCodexが「停止しない」という指示を無視して早期終了する問題を報告。Claudeの/loopとは異なり、Codexはインタラクティブセッションで長時間のループ実行を維持できない。コミュニティからwhileループ、tmux watchdog、forkなど複数のワークアラウンドが提案され、OpenAIチームもlifecycle hooksの実装を進めている。"
tags:
  - "clippings"
  - "AI"
  - "Codex"
  - "OpenAI"
  - "autoresearch"
  - "AI Agent"
  - "Claude"
  - "LLM"
  - "GPT"
---

## 概要

karpathyが自身のプロジェクト [autoresearch](https://github.com/karpathy/autoresearch)（単一GPUでのnanochatトレーニングを自動で研究するAIエージェント）において、OpenAI Codexが長時間のループ実行を維持できない問題を報告したGitHub Issue。Claudeが `/loop` コマンドなしでも継続実行できるのに対し、Codexは「停止しない」という指示を無視して早期終了してしまう。コミュニティからは多数のワークアラウンドが提案され、OpenAI公式チームも対応を表明した。

## 主要なトピック

### 問題の本質

- **Codexの早期終了**: autoresearchで実験ループを繰り返す際、Codexは「停止するな」という指示を無視して途中で止まってしまう
- **Claudeとの比較**: Claudeは `/loop` コマンド（新機能）がなくても継続実行が可能
- **インタラクティブ性の重視**: karpathyはエージェントの作業を監視し、任意のタイミングで介入できるインタラクティブセッションを強く好んでいる
- **ralph loopの制限**: バッチ的なralph loopは可能だが、インタラクティブ性が失われる

### コミュニティによるワークアラウンド

#### 1. whileループ（@rankun203）

```bash
while true; do
  codex exec --dangerously-bypass-approvals-and-sandbox \
    "have a look at program.md and kick off a new experiment loop" \
    2>&1 | tee -a agent.log
  sleep 1
done
```

- **問題点**: Codexのインタラクティブ性が失われる
- **改善案**（@kolt-mcb）: `codex exec resume` サブコマンドを使えば、前回の実験を引き継げる可能性がある

#### 2. Pi + Interactive Shell Extension（@Whamp）

- [Pi](https://github.com/badlogic/pi-mono/)（pi.dev）と [Interactive Shell Extension](https://github.com/nicobailon/pi-interactive-shell) の組み合わせ
- モデル非依存で長時間ループとインタラクション（人間・エージェント双方）が可能
- Codex/Claudeのサブスクリプションも Pi のOAuthで利用可能

#### 3. 多段ループ構成（@jonathanpwang）

- `agent_loop.sh`: メインのwhileループ
- `monitor_loop.sh`: エージェントの監視
- `watchdog_loop.sh`: エージェントループの再起動

#### 4. システムプロンプト改善 + tmux watchdog（@marcinbogdanski）

- Codexのデフォルトシステムプロンプトにはターンベースの会話を暗示する内容があり、これを「Infinite AI Researcher」プロンプトに置換
- **効果**: 5-8実験で停止 → 20-30実験まで延長（ただし完全ではない）
- tmuxセッションでCodexを起動し、10分間非アクティブなら自動で「Please continue」+ Enterを入力するwatchdog
- リポジトリ: [codex-keep-going-really](https://github.com/marcinbogdanski/codex-keep-going-really)

#### 5. codex-infinity（@lee101）

- Codexのフォークで問題を修正
- リポジトリ: [codex-infinity](https://github.com/lee101/codex-infinity)

#### 6. Codex App Server（@carloslfu）

- OpenAI公式の [Codex App Server](https://openai.com/index/unlocking-the-codex-harness) がこの問題の解決策になるとの提案

### 長時間実行の成功事例（@victorstewart）

- GPT 5.2以降で10〜16時間の連続稼働に成功
- **成功の鍵**: 明確な数値目標（最適化すべき単一の数値と閾値）をエージェントに与えること
- セマンティックテストのバッテリーを通じて定量的な閾値を設定し、パイプラインの各段階で測定可能なメトリクスを定義
- 途中で停止しても「continue」と伝えれば中断箇所から再開可能
- `AGENTS.md` ファイルの設定が影響している可能性も示唆

### OpenAI公式の対応

- **@etraut-openai**: lifecycle hooksの実装を進行中（[PR #13276](https://github.com/openai/codex/pull/13276)）。これによりインタラクティブモードでのralph loopが容易になる
  - 代替案として、バックグラウンドターミナルで非同期ツールとしてスリープスクリプトを実行する [PR Babysitting](https://github.com/openai/codex/pull/12513) スキルも紹介
- **@evan-oai**: Codexチームとして問題を認識しており、良いソリューションを検討中

## 重要な事実・データ

- **リアクション**: 👍 10、👎 1、😕 1（コミュニティの関心の高さを示す）
- **影響モデル**: GPT 5.4（5.2でも報告あり）
- **システムプロンプト改善の効果**: 実験回数が5-8回 → 20-30回に向上（@marcinbogdanski報告）
- **最長連続稼働**: 10-16時間（@victorstewart報告、ただし条件付き）
- **GPT 5.4をClaude Codeに統合しても同じ問題が発生**（@sen-ye報告） → モデル自体の挙動が原因の可能性

## 結論・示唆

### 問題の根本原因

GPT 5.xモデル自体が長時間の連続タスク実行を想定した設計になっていない可能性が高い。Claude Codeに統合しても同じ問題が発生することから、エージェントハーネスではなくモデルレベルの問題である可能性が示唆されている。

### 実践的な示唆

- **短期的対策**: tmux watchdogやwhileループによる自動再開が最も実用的
- **明確な目標設定**: 数値的な閾値を設定することでモデルの継続実行を促進できる可能性がある
- **公式対応待ち**: OpenAIがlifecycle hooksを実装予定で、近日中にサポートされる見込み
- **代替手段**: Pi + Interactive Shell ExtensionやCodex App Serverなど、モデル非依存のソリューションも検討に値する

## 制限事項・注意点

- このIssueは2026年3月時点のもので、OpenAIが対応中（lifecycle hooks PR）のため状況は変化する可能性がある
- @victorstewartの成功事例は特定条件（明確な数値目標、AGENTS.md設定）下でのもので、汎用的に再現可能かは不明
- 各ワークアラウンドはインタラクティブ性やセキュリティ（`--dangerously-bypass-approvals-and-sandbox`）のトレードオフがある

---

*Source: [Codex doesn't seem to work? · Issue #57 · karpathy/autoresearch](https://github.com/karpathy/autoresearch/issues/57)*
