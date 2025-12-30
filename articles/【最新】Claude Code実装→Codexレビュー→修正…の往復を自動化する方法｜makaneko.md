---
title: "【最新】Claude Code実装→Codexレビュー→修正…の往復を自動化する方法｜makaneko"
source: "https://note.com/makaneko_ai/n/n3cefcec49e2d"
author: "makaneko"
published: 2025-12-28
created: 2025-12-30
description: "Claude CodeとCodexを組み合わせた開発ワークフローの自動化手法。SKILL機能を活用してCodexレビューを必須工程化し、実装→レビュー→修正のサイクルを自動化する具体的な設定方法を解説。"
tags:
  - "Claude Code"
  - "Codex"
  - "SKILL"
  - "自動化"
  - "コードレビュー"
---

## 概要

AIコーディングにおいて、実装はClaude Code、レビューはCodexという役割分担を行う場合、「実装→レビュー→コピペ→修正→再レビュー」の往復作業が面倒になる。本記事では**SKILL機能を使ってCodexレビューを「必須工程」として自動化**し、レビュー→修正のサイクルが自動的に回る仕組みを構築する方法を解説している。

## 著者について

- アカウント名: makaneko
- 仮想通貨のエアドロップ情報を中心に発信
- 約2年前まで非エンジニアだったが、現在はAIコーディングでトレードの自動化やAI駆動メディアの開発を行っている

## SKILLとは

SKILLs（Agent Skills）は、必要なときだけ詳細を読み込むノウハウのパッケージ（.mdファイルと関連アセット）。

**特徴:**
- 通常はノウハウの概要のみが参照され、本文や同梱リソースはSKILL実行時のみ読み込まれる
- コンテキストを節約しつつ、特定の用途に特化したノウハウを適宜AIに注入可能
- **ユーザーの指示だけでなくAI自身が使うかどうかを判断できる**

## codex-review SKILLの設計ポイント

1. **規模に応じた対応パターン**: レビュー対象が大きすぎるとCodexがタイムアウトするため、タスクの大小に応じた対応を用意
2. **並列レビュー**: 大規模な場合は適切に分割し、Claude Code側でサブエージェントに分割して並列レビュー
3. **自動修正サイクル**: レビュー内容を受け取ったらClaude Codeが修正し、再度レビュー依頼。上限回数（デフォルト5回）または指摘がなくなるまで繰り返す
4. **安全性**: Codexは `--sandbox` かつ `read-only` で呼び出し、不要な操作リスクを排除

## SKILL.mdの全文

`.claude/skills/codex-review` フォルダ内に `SKILL.md` として格納する。

### メタデータ

```yaml
---
name: codex-review
description: Codex CLI（read-only）を用いて、レビュー→Claude Code修正→再レビュー（ok: true まで）を反復し収束させるレビューゲート。仕様書/SPEC/PRD/要件定義/設計、実装計画（PLANS.md等）の作成・更新直後、major step（>=5 files / 新規モジュール / 公開API / infra・config変更）完了後、および git commit / PR / merge / release 前に使用する。
---
```

### フロー

```
[規模判定] → small:  diff ──────────────────→ [修正ループ]
          → medium: arch → diff ───────────→ [修正ループ]
          → large:  arch → diff並列 → cross-check → [修正ループ]
```

- **Codex**: read-onlyでレビュー（監査役）
- **Claude Code**: 修正担当

### 規模判定基準

| 規模 | 基準 | 戦略 |
|-----|------|-----|
| small | ≤3ファイル、≤100行 | diff |
| medium | 4-10ファイル、100-500行 | arch → diff |
| large | >10ファイル、>500行 | arch → diff並列 → cross-check |

### 修正ループ

`ok: false`の場合、`max_iters`回まで反復:
1. `issues`解析 → 修正計画
2. Claude Codeが修正（最小差分のみ、仕様変更は未解決issueに）
3. テスト/リンタ実行（可能なら）
4. Codexに再レビュー依頼

**停止条件:**
- `ok: true`
- `max_iters`到達
- テスト2回連続失敗

### Codex実行コマンド

```bash
codex exec --sandbox read-only "<PROMPT>"
```

### Codex出力スキーマ

```json
{
  "ok": true,
  "phase": "arch|diff|cross-check",
  "summary": "レビューの要約",
  "issues": [
    {
      "severity": "blocking",
      "category": "security",
      "file": "src/auth.py",
      "lines": "42-45",
      "problem": "問題の説明",
      "recommendation": "修正案"
    }
  ],
  "notes_for_next_review": "メモ"
}
```

**フィールド説明:**
- `ok`: blockingなissueが0件ならtrue、1件以上ならfalse
- `severity`: 2段階
  - **blocking**: 修正必須。1件でもあれば`ok: false`
  - **advisory**: 推奨・警告。`ok: true`でも出力可、レポートに記載のみ
- `category`: correctness / security / perf / maintainability / testing / style
- `notes_for_next_review`: Codexが残すメモ。再レビュー時にClaude Codeがプロンプトに含める

### パラメータ

| 引数 | 既定 | 説明 |
|-----|-----|-----|
| max_iters | 5 | 最大反復（上限5） |
| review_focus | - | 重点観点 |
| diff_range | HEAD | 比較範囲 |
| parallelism | 3 | large時並列度（上限5） |

### エラー時の共通ルール

Codex exec失敗時（タイムアウト・API障害・その他）:
1. 1回リトライ（タイムアウトはファイル数を半分に分割して）
2. 再失敗 → 該当フェーズをスキップし、理由をレポートに記録
3. archスキップ時はdiffのみで続行、diffスキップ時はそのファイル群を「未レビュー」としてレポート

## おすすめの使い方

SKILLを設定するだけでも必要なタイミングで作動するが、AIの判断に任せるため動作が不安定になることがある。

### 安定して活用させる方法

**実装計画の中にcodex-reviewを必須のステップとして組み込む**のがおすすめ。

著者はOpenAIが提案している「自律的に実装を進めるための計画立案フォーマット」（[PLANS.md](https://cookbook.openai.com/articles/codex_exec_plans)）をベースに使用し、以下の指示を追加している:

> Mandatory review gate (codex-review SKILL): End each milestone by running the codex-review SKILL to iterate review→fix→re-review until clean, then proceed.

### CLAUDE.mdへの追加

同様の指示をCLAUDE.mdに追加することも有効:

> \# Review gate (codex-review)
> At key milestones—after updating specs/plans, after major implementation steps (≥5 files / public API / infra-config), and before commit/PR/release—run the codex-review SKILL and iterate review→fix→re-review until clean.

## 終了レポート例

```
## Codexレビュー結果
- 規模: large（12ファイル、620行）
- 並列: 3サブエージェント、4グループ
- 反復: 2/5 / ステータス: ✅ ok

### 修正履歴
- auth.py: 認可チェック追加

### Advisory（参考）
- main.py: 関数名がやや冗長、リファクタ推奨

### 未レビュー（エラー時のみ）
- utils/legacy.py: Codexタイムアウト、手動確認推奨

### 未解決（あれば）
- main.py: 内容、リスク、推奨アクション
```

## 重要なポイント

1. **役割分担の明確化**: Claude Code = 実装担当、Codex = レビュー担当（read-only監査役）
2. **自動化のカギ**: SKILLを「必須工程」として実装計画に組み込むことで、手動介入なしにレビューサイクルが回る
3. **安全性の確保**: Codexは`--sandbox read-only`で実行し、意図しない操作を防止
4. **スケーラビリティ**: 規模に応じて並列処理を行い、大規模な変更にも対応

## 参考リンク

- [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Using PLANS.md for multi-hour problem solving | OpenAI Cookbook](https://cookbook.openai.com/articles/codex_exec_plans)
