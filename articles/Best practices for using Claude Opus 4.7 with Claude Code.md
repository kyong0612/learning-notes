---
title: "Best practices for using Claude Opus 4.7 with Claude Code"
source: "https://claude.com/blog/best-practices-for-using-claude-opus-4-7-with-claude-code"
author:
  - "Anthropic"
published: 2026-04-16
created: 2026-04-18
description: "Opus 4.7 を Claude Code で最大限に活用するためのベストプラクティス。再調整された effort レベル、adaptive thinking、新しいデフォルト設定、そして Opus 4.6 からの挙動変化への対応方法を解説。"
tags:
  - "clippings"
  - "claude-code"
  - "claude-opus-4-7"
  - "anthropic"
  - "prompt-engineering"
  - "agentic-coding"
  - "llm-best-practices"
---

## 概要

Anthropic の新モデル **Claude Opus 4.7** は、コーディング・エンタープライズワークフロー・長時間の agentic タスクにおいて、同社が現在 GA（一般提供）している中で最も強力なモデル。Opus 4.6 と比較して、以下の改善が見られる。

- 曖昧さへの対処がより上手い
- バグ発見・コードレビュー能力が大幅に向上
- セッションをまたいだコンテキスト保持が安定
- 曖昧なタスクを少ない指示で推論可能

一方で、**トークナイザーの更新** と **高 effort 時・長セッション後半での思考量増加** という2つの変更により、トークン使用量に影響が出ている。Opus 4.6 からそのまま置き換えるとチューニングが必要となる。本記事は Claude Code での Opus 4.7 の使い方を解説する。

---

## 1. インタラクティブなコーディングセッションの組み立て方

Opus 4.7 は、**autonomous（1ターンで完結）** な使い方と **interactive（複数ターン）** な使い方でトークン使用量・挙動が変わる。特にインタラクティブ環境では user turn の後により多く推論するため、一貫性・指示追従・品質は向上するがトークン消費も増える。

Claude を「行ごとに指示するペアプログラマー」ではなく、**「委譲できる有能なエンジニア」** として扱うのが効果的。

| 推奨プラクティス | 内容 |
|---|---|
| **初手で完全に仕様を伝える** | 意図、制約、受け入れ基準、関連ファイル位置を第1ターンで明示。曖昧な指示を段階的に追加するのは、トークン効率・品質の両面で不利。 |
| **user interaction を減らす** | ターン毎に推論オーバーヘッドが増える。質問はバッチ化し、モデルが走り続けられる文脈を一度に渡す。 |
| **auto mode を活用** | 安全に実行できると信頼できるタスクでは `auto mode` を使うことでサイクルタイムを短縮。長時間タスクで初手から十分な文脈がある場合に特に有効。Claude Code Max ユーザー向けに research preview で提供され、**`Shift+Tab`** でトグル可能。 |
| **完了通知を設定** | 「完了時に音を鳴らして」と依頼すれば、Claude が hook ベースの通知を自作できる。 |

---

## 2. 推奨 effort 設定

Claude Code における Opus 4.7 のデフォルト effort は **`xhigh`**（`high` と `max` の間に新設されたレベル）。難しい問題における推論深度とレイテンシのトレードオフをより細かく制御できる。

### Effort レベルごとのガイダンス

| Effort | 推奨用途 |
|---|---|
| `low` / `medium` | コスト・レイテンシ重視、スコープが狭いタスク。難タスクでは高レベルに劣るが、**同じ effort で比較すれば Opus 4.6 より高性能で、場合によっては少ないトークン**で済む。 |
| `high` | 知性とコストのバランス型。**並列セッションを動かす**場合や、大きな品質低下なしに節約したい場合に適する。 |
| `xhigh`（デフォルト・推奨） | ほとんどの coding / agentic 用途に最適。`max` のような長時間 agentic 実行での「暴走的トークン消費」を起こさずに、自律性と知性を発揮。 |
| `max` | 真に難しい問題で追加の性能を絞り出す用途。ただし収穫逓減が顕著で、**overthinking に陥りやすい**。eval でモデルの上限を測る時、極めて知性要求が高くコスト非感受性のタスクに限って意図的に使う。 |

> **移行アドバイス**: Opus 4.7 にアップグレードする際は、以前の設定をそのまま流用せず、effort をいろいろ試すことが推奨される。タスク中に effort を切り替えて、トークン使用量と推論量を能動的に管理できる。既存の Claude Code ユーザーで effort を手動設定していない場合は、自動的に `xhigh` にアップグレードされる。

### 特に `xhigh` が適するタスク（intelligence-sensitive）

- API やスキーマ設計
- レガシーコードのマイグレーション
- 大規模コードベースのレビュー

---

## 3. Adaptive Thinking（適応的思考）との付き合い方

Opus 4.7 では、**固定 thinking budget を使う Extended Thinking はサポートされない**。代わりに **adaptive thinking** が導入された。

- 各ステップで thinking を使うか否かをモデル自身が判断
- シンプルなクエリには即応
- 役に立たないステップでは thinking をスキップ
- 有用なところにトークンを集中投下

結果として、agentic 実行全体で応答が速くなり UX が向上する。Opus 4.7 では **overthinking が起こりにくくなった** のが大きな改善点。

### Thinking 量を制御したい場合のプロンプト例

| 目的 | プロンプト例 |
|---|---|
| もっと考えさせたい | "Think carefully and step-by-step before responding; this problem is harder than it looks." |
| もっと速く答えさせたい | "Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly."（トークンは節約できるが、難ステップで精度が落ちる可能性あり） |

---

## 4. 知っておくべき挙動の変更点（4.6 → 4.7）

過去のモデル向けにプロンプトやハーネスを調整済みのユーザーは、以下のデフォルト挙動変化に注意する。

### 4.1 応答長がタスクの複雑さに応じて調整される

- Opus 4.7 は **Opus 4.6 ほどデフォルトで冗長ではない**
- 単純な lookup には短く、open-ended な分析には長く
- 特定の長さ・スタイルが必要な場合は明示的に指示する
- **"こうして" というポジティブな例示が、"こうするな" というネガティブ指示よりも効果的**

### 4.2 ツール呼び出しが減り、推論が増える

多くのケースで結果は良くなる。ただし、より積極的な検索やファイル読み込みが欲しい場合は、**いつ・なぜツールを使うべきかを明示**する。

### 4.3 Subagent の spawn が控えめになった

Opus 4.7 は subagent への委譲に慎重。並列 subagent がワークロードに有効な場合（ファイル横断の fan-out や独立アイテム処理など）は、明示的に指示する。

**指示例:**

> Do not spawn a subagent for work you can complete directly in a single response (e.g., refactoring a function you can already see). Spawn multiple subagents in the same turn when fanning out across items or reading multiple files.

---

## 5. 次に試すべきこと

Opus 4.7 は **長時間実行タスク** で従来モデルより優れる。これにより、これまで「人間の監督がボトルネック」だったタスクが現実的になる。

### 適用が期待されるユースケース

- 複雑な複数ファイル変更
- 曖昧なデバッグ
- サービス横断のコードレビュー
- マルチステップ agentic ワーク

### 推奨される第一歩

> **effort は `xhigh` のままにして、第1ターンでどこまで到達できるかを試す。**

---

## 参考リンク

- [Opus 4.7 prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Using Claude Code: session management and 1M context](https://claude.com/blog/using-claude-code-session-management-and-1m-context)
- [Opus 4.7 launch announcement](https://www.anthropic.com/news/claude-opus-4-7)
- [Auto mode](https://claude.com/blog/auto-mode)

---

## 重要な結論

1. **Opus 4.7 では "委譲スタイル" のプロンプトが効く**: 初手で仕様を完結させ、ターン数を減らすことでトークン効率も品質も向上する。
2. **デフォルト effort は `xhigh`**: `max` を選びたくなるような知性要求タスクの多くは `xhigh` で十分、かつ暴走的トークン消費を避けられる。
3. **Extended Thinking の固定 budget は廃止**: 代わりに adaptive thinking が入り、必要に応じて自動で思考量が変わる。overthinking は大幅改善。
4. **4.6 向けチューニングは見直し必須**: 応答長・ツール使用頻度・subagent 生成頻度がすべて控えめ方向にシフトしているので、必要ならプロンプトで明示的に指示する。
