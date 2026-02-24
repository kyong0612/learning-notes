---
title: "How I Use Claude Code"
source: "https://boristane.com/blog/how-i-use-claude-code/"
author:
  - "[[Boris Tane]]"
published: 2026-02-10
created: 2026-02-25
description: "Claude Codeを9ヶ月間使用してきた著者が、Research→Plan→Annotate→Implement という段階的ワークフローを解説。計画を承認するまでコードを書かせないという原則が、AI支援開発の品質を劇的に向上させるという主張。"
tags:
  - "clippings"
  - "claude-code"
  - "ai-coding"
  - "sdlc"
  - "agents"
  - "workflow"
---

## 概要

Boris Taneが約9ヶ月間Claude Codeをメイン開発ツールとして使用してきた経験に基づく、独自のワークフローを解説した記事。核心的な原則は **「レビュー・承認済みの計画書ができるまで、Claudeにコードを書かせない」** こと。計画と実行の分離が、無駄な作業を防ぎ、アーキテクチャの意思決定を自分の手に保ち、最小限のトークン使用量でより良い結果を生む。

## ワークフロー全体像

```
Research → Plan → Annotate（1〜6回繰り返し）→ Todo List → Implement → Feedback & Iterate
```

---

## Phase 1: Research（調査）

すべての重要なタスクは **deep-read（深い読み込み）** から始まる。

### 重要なポイント

- Claudeにコードベースの関連部分を **徹底的に理解させる**
- 調査結果は必ず **永続的なMarkdownファイル（`research.md`）** に書き出させる（チャット内の口頭要約ではなく）
- 「deeply」「in great details」「intricacies」といった言葉を使わないと、Claudeは表面的な読み取りで終わる

### プロンプト例

> read this folder in depth, understand how it works deeply, what it does and all its specificities. when that's done, write a detailed report of your learnings and findings in research.md

> go through the task scheduling flow, understand it deeply and look for potential bugs. there definitely are bugs in the system as it sometimes runs tasks that should have been cancelled. keep researching the flow until you find all the bugs, don't stop until all the bugs are found. when you're done, write a detailed report of your findings in research.md

### なぜ調査が重要か

AI支援コーディングにおける **最もコストの高い失敗モード** は、構文エラーやロジックの不備ではなく、**単独では動くが周囲のシステムを壊す実装** である：

- 既存のキャッシュ層を無視する関数
- ORMの規約を考慮しないマイグレーション
- すでに存在するロジックを重複するAPIエンドポイント

調査フェーズはこれらすべてを防ぐ。

---

## Phase 2: Planning（計画）

調査をレビューした後、別のMarkdownファイルに **詳細な実装計画** を依頼する。

### 生成される計画の内容

- アプローチの詳細な説明
- 実際の変更を示すコードスニペット
- 変更対象のファイルパス
- 考慮事項とトレードオフ

### Claude Code組み込みのplan modeを使わない理由

- 組み込みのplan modeは不十分
- 自分の `.md` ファイルならエディタで編集可能、インラインメモを追加可能、プロジェクト内の実際のアーティファクトとして永続化

### テクニック：リファレンス実装の共有

よくできたOSSの実装を参照として共有すると、Claudeの出力が **劇的に良くなる**。ゼロから設計させるより、具体的な参照実装がある方が良い。

---

## The Annotation Cycle（注釈サイクル）— ワークフローの核心

著者が **最も価値を発揮する** 部分。

### フロー

```
Claude writes plan.md → 著者がエディタでレビュー → インラインノートを追加 → Claudeにドキュメントに戻らせる → Claudeが計画を更新 → 満足するまで繰り返し（1〜6回）
```

### 注釈の実例

| 注釈の種類 | 例 |
|---|---|
| 設計の方向修正 | 「visibilityフィールドはリスト自体に必要。個々のアイテムではない。スキーマセクションを再構成せよ」 |
| 不要な処理の削除 | 「キューコンシューマーが既にリトライ処理をしている。このリトライロジックは冗長。削除せよ」 |
| セクション全体の削除 | 「このセクションを完全に削除。ここにキャッシュは不要」 |
| HTTP動詞の修正 | 「PUTではなくPATCHにすべき」 |
| ドメイン知識の注入 | 「マイグレーションにはraw SQLではなくdrizzle:generateを使え」 |

### 重要な指示

```
I added a few notes to the document, address all the notes and update the document accordingly. don't implement yet
```

**「don't implement yet」ガード** が不可欠。これがないとClaudeは計画が十分だと判断した時点でコードを書き始める。

### なぜ効果的か

- Markdownファイルが **著者とClaude間の共有ミュータブル状態** として機能
- 自分のペースで考え、問題の正確な箇所に注釈を付けられる
- チャットメッセージでの指示とは根本的に異なる：計画は構造化された完全な仕様であり、ホリスティックにレビューできる
- 3回の注釈サイクルで、汎用的な実装計画を **既存システムに完璧にフィットするもの** に変換できる

### Todo List

実装前に必ず **詳細なタスク分解** を依頼：

> add a detailed todo list to the plan, with all the phases and individual tasks necessary to complete the plan - don't implement yet

進捗トラッカーとして機能し、長時間のセッションで特に有用。

---

## Phase 3: Implementation（実装）

計画が完成したら、標準化された実装コマンドを発行する。

### 標準プロンプト

> implement it all. when you're done with a task or phase, mark it as completed in the plan document. do not stop until all tasks and phases are completed. do not add unnecessary comments or jsdocs, do not use any or unknown types. continuously run typecheck to make sure you're not introducing new issues.

### 各指示の意図

| 指示 | 目的 |
|---|---|
| `continuously run typecheck` | 問題を最後ではなく早期に検出 |
| `do not use any or unknown types` | 厳密な型付けを維持 |
| `do not add unnecessary comments or jsdocs` | コードをクリーンに保つ |
| `do not stop until all tasks and phases are completed` | 途中で確認を求めて中断しない |
| `mark it as completed in the plan document` | 計画が進捗の真実の源 |
| `implement it all` | 計画のすべてを実行、チェリーピックしない |

### 設計思想

「implement it all」を発する時点で、**すべての意思決定は完了し検証済み**。実装はクリエイティブではなく **機械的（boring）** であるべき。創造的な作業は注釈サイクルで終わっている。

---

## 実装中のフィードバック

実装が始まると、著者の役割は **アーキテクトからスーパーバイザー** に変わる。プロンプトは劇的に短くなる。

### フィードバック例

- 「設定ページをメインアプリではなく管理アプリに移動せよ」
- 「`deduplicateByTitle`関数が実装されていない」
- フロントエンド作業では「2pxの隙間がある」「まだクロップされている」「もっと広く」

### テクニック

- **スクリーンショットの添付**：テーブルの位置ずれなど視覚的な問題は説明より画像が速い
- **既存コード参照**：「このテーブルはusersテーブルとまったく同じに見えるべき」— ゼロからデザインを説明するより遥かに正確
- **リバートとスコープ縮小**：悪い方向に進んだ場合、パッチを当てようとせずgit変更を破棄して再スコープ

---

## Staying in the Driver's Seat（主導権の維持）

実行をClaudeに委任しても、**何を構築するかの完全な自律性は絶対に渡さない**。

### 制御の方法

| 手法 | 説明 |
|---|---|
| **提案のチェリーピック** | 複数の問題を項目レベルで評価し、個別に判断 |
| **スコープのトリミング** | nice-to-haveを積極的にカット。「ダウンロード機能を計画から削除」 |
| **既存インターフェースの保護** | 「これら3つの関数のシグネチャは変更不可。呼び出し側が適応すべき」 |
| **技術選択のオーバーライド** | 「このモデルではなくあのモデルを使え」「カスタム実装ではなくライブラリの組み込みメソッドを使え」 |

---

## 単一の長いセッション

著者は調査・計画・実装を **1つの長いセッション** で行い、別々のセッションに分割しない。

### 重要な知見

- **50%コンテキストウィンドウ以降のパフォーマンス低下** は感じていない
- 「implement it all」の時点で、Claudeはセッション全体を通じて理解を構築している
- コンテキストウィンドウが埋まっても、**自動圧縮** が十分なコンテキストを維持
- 永続的なアーティファクトである **計画ドキュメント** は圧縮後も完全に生き残る

---

## 結論：ワークフローを一文で

> **深く読み、計画を書き、計画が正しくなるまで注釈を付け、Claudeに中断なしで全体を実行させる。途中で型チェックを行いながら。**

魔法のプロンプトも、凝ったシステム指示も、巧妙なハックもない。**思考とタイピングを分離する規律あるパイプライン** だけ。

- **調査** → Claudeが無知な変更をすることを防ぐ
- **計画** → 間違った変更をすることを防ぐ
- **注釈サイクル** → 著者の判断を注入する
- **実装コマンド** → すべての意思決定が完了した後、中断なしで実行