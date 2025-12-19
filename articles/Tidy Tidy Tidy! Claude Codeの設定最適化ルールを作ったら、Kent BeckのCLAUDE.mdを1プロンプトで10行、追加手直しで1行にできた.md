---
title: "Tidy Tidy Tidy! Claude Codeの設定最適化ルールを作ったら、Kent BeckのCLAUDE.mdを1プロンプトで10行、追加手直しで1行にできた"
source: "https://blog.atusy.net/2025/12/17/minimizing-claude-md/"
author:
  - atusy
published: 2025-12-17
created: 2025-12-19
description: |
  Claude Codeの設定最適化ルールを作成し、Kent BeckのCLAUDE.md（77行）を1プロンプトで10行、手直しで1行にまで削減する方法を解説。skills、commands、path-specific rulesへの分割によりコンテキスト消費を91%削減し、重要な指示の優先度向上と長時間作業での指示忘れ防止を実現。
tags:
  - Claude Code
  - CLAUDE.md
  - コンテキスト最適化
  - TDD
  - AI開発
---

## 概要

この記事では、Claude Codeの設定ファイル（CLAUDE.md）を最適化するルールを作成し、Kent BeckのCLAUDE.md（77行）をわずか1プロンプトで10行に削減、さらに手直しで1行にまで圧縮する方法を解説している。

## 背景と目的

著者は長らくKent BeckのCLAUDE.mdをコピペ+αで使用していたが、TDDの方法論などをskillsなどに分離することで、起動時のコンテキスト消費を大幅に削減することに成功した。

## 最適化後のCLAUDE.md（完成形）

最終的に3行（実質1つの核心原則）に集約:

```markdown
# CORE PRINCIPLES

* Follow Kent Beck's Test-Driven Development (TDD) methodology as the preferred approach for all development work.
* Document at the right layer: Code → How, Tests → What, Commits → Why, Comments → Why not
* Keep documentation up to date with code changes
```

## 最適化手順

### 1. 設定最適化ルールの用意

`~/.claude/rules/claude/config-maintenance.md`にルールを保存する。

- **ルールのURL**: <https://github.com/atusy/dotfiles/blob/fa7923c0dba20281441ca951cdec3cea2ff4e62a/dot_claude/rules/claude/config-maintenance.md>
- **パス指定**: `paths: "**/{.,dot_}claude/**"` でClaude Code設定変更時のみ読み込み（コンテキスト汚染防止）

ルールの内容には以下の修正を加えた:

- Claude Code自身が熟知している内容（ディレクトリ構造など）を削除
- CLAUDE.mdが含むべき内容を強調: **役割（role）**、**経験（expertise）**、**核たる指針（core principles）**
- 関連するskillsの積極利用を指示

### 2. 最適化の実行

以下のプロンプトを使用:

```
Minimize startup context by refactoring @.claude/CLAUDE.md with excellent extractions of path-specific rules, commands, skills, and/or subagents.
```

**ポイント**: 単に「リファクタしてくれ」ではなく、**目的**（起動時のコンテキスト最適化）と**手段**（skillsなどの抽出）を明確に伝える。

### 3. 最適化過程

Claude Codeは以下の戦略を自動的に策定:

| コンポーネント | 読み込みタイミング | 内容 |
|--------------|------------------|------|
| CLAUDE.md | 常時 | 役割アイデンティティ + skill/command発見（10行） |
| rules/code-quality.md | コードファイル操作時 | 品質基準（15行、パス限定） |
| skills/tdd/ | 自動（テスト記述時） | 完全なTDD方法論 |
| skills/commit/ | 自動（コミット時） | コミット規律 |
| commands/go.md | ユーザー呼び出し時 | plan.mdワークフロー |

**削減効果**: 77行（3,450 bytes）→ 10行（約300 bytes）= **91%削減**

### 4. 手直し

1プロンプトで10行に最適化後、さらに手直しで1行に:

- `/go`コマンド: ユーザーが使うものでClaude Codeが知る必要なし → **省略可能**
- commitスキル: 必要時に自動で見つかる → **省略可能**  
- TDDスキル: 「実装して」だけだと別手法を使う可能性あり → **残す**

最終的な核心:

```
Follow Kent Beck's Test-Driven Development methodology (`tdd` skill) as the preferred approach for all development work.
```

## 最適化の効果

1. **コンテキスト消費の最適化**: 起動時の読み込み量を91%削減
2. **重要事項の明確化**: Claude Codeが本当に大事にすべきことを端的に伝達
3. **指示忘れリスクの軽減**: skillsやcommandsは必要になるごとに読み込まれるため、長時間作業での指示忘れを防止

## ドキュメント階層の原則（t-wadaさんの一文より）

- **Code** → How（どうやって）
- **Tests** → What（何を）
- **Commits** → Why（なぜ）
- **Comments** → Why not（なぜそうしないか）

## 参考リソース

- **完成した設定**: <https://github.com/atusy/dotfiles/blob/6c080e07db493f6ddccd6072c4bdfbbe6ef3801b/dot_claude>
- **設定最適化ルール**: <https://github.com/atusy/dotfiles/blob/fa7923c0dba20281441ca951cdec3cea2ff4e62a/dot_claude/rules/claude/config-maintenance.md>
- **Kent BeckのCLAUDE.md**: <https://github.com/KentBeck/BPlusTree3/blob/main/rust/docs/CLAUDE.md>
- **関連記事**: [Claude Codeのユーザー設定プロンプトを使い分けてコンテキスト管理を最適化する](https://blog.atusy.net/2025/12/15/claude-code-user-config/)

## 重要な発見

- **skillsやPath-specific Rulesの読み込み**は初回必要時だけでなく毎回行われるため、指示忘れ対策としても有効
- プロンプト自体をslash commandにすることも可能
- PythonでFizzBuzzを実装させたテストでは、適切にTDDスキルが自動適用された
