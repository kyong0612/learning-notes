---
title: "Claude Codeのユーザー設定プロンプトを使い分けてコンテキスト管理を最適化する (CLAUDE.md, rules, slash commands, skills, subagents)"
source: "https://blog.atusy.net/2025/12/15/claude-code-user-config/"
author:
  - atusy
published: 2025-12-15
created: 2025-12-16
description: "Claude Codeで設定できる5種類のプロンプト（CLAUDE.md, rules, slash commands, skills, subagents）の用途とコンテキスト管理における使い分け方を解説した記事。それぞれの特性を理解することで、コンテキストウィンドウの枯渇や情報の埋没を防ぎ、効率的なAIコーディング環境を構築できる。"
tags:
  - Claude-Code
  - AI
  - プロンプトエンジニアリング
  - コンテキスト管理
  - 開発ツール
---

## 概要

Claude Codeで設定できるプロンプトが複雑化しているため、著者が自身の理解を整理した記事。CLAUDE.md、rules、slash commands、skills、subagentsの5種類の設定プロンプトについて、それぞれの用途とコンテキストの扱いを理解することで、使い分けの意義が見えてくる。

---

## 設定できるプロンプトと用途

プロンプトの肥大化と複雑化は**コンテキストウィンドウの枯渇**や**重要情報の埋没**などの問題を生む。これを回避するため、用途に応じた5種類のプロンプト設定が用意されている。

| 設定タイプ | 格納場所 | 用途 |
|-----------|----------|------|
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | 全プロジェクトに共通する設定 |
| **rules** | `~/.claude/rules/` | CLAUDE.mdの分割先。ディレクトリ構造で階層化可能、ファイルパスに応じたルール適用を制御可能（例: `paths: src/api/**/*.ts`） |
| **slash commands** | `~/.claude/commands/` | markdownファイルで定義する定型プロンプト。`/command`のようにユーザーが明示的に実行 |
| **skills** | `~/.claude/skills/` | `SKILL.md`ファイルとサポートファイルで構成される再利用可能な専門知識パッケージ。**Claudeが自動判断して発動** |
| **subagents** | `~/.claude/agents/` | 専門領域に特化したシステムプロンプト・ツール設定を持つ独立したAI。特定タスクに自動委譲または明示的に呼び出し可能 |

---

## 使い分けの指針

### 1. 起動時に読み込むべき設定：CLAUDE.md と rules

Claude Codeは起動時に**CLAUDE.mdとrulesを全文読み込む**ため、プロジェクトに依存せず使う情報はここに置く。

#### rulesに分割するメリット

- パス限定ルールを記述できる
- ディレクトリ構造を利用してマークダウンよりも明示的に情報を階層化できる

```text
~/.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

#### 注意点

- CLAUDE.mdやrulesは全文を読む特性上、**コンテキストを圧迫しやすい**
- 詳細を必要になるまで伏せられるskills、slash commands、subagentsの活用を検討すべき
- パス限定ルールは条件に一致するパスを操作するまでコンテキストを消費しないが、「ユーザー設定」レベルで効果的に扱うのは難易度が高い
  - 例: `ts`ファイル限定でフロントエンド用ルールを読み込ませると、CLIプロジェクトにフロントエンドのコンテキストが混入する

---

### 2. ユーザー判断で読み込ませる内容：slash commands

**slash commandsは呼び出すまでコンテキストを消費しない**（著者の実験による確認済み）。

#### 適している用途

- ユーザーが判断したタイミングで読み込ませたい内容
- 例: git commitする手順やルール（`/git:commit`）
  - 「変更をすべてコミットせずに、意味のある範囲でできるだけ小さくコミットしてね」
  - 「commit logにはwhyを残してね」

#### 適さない用途

- 全体に影響するルール（例：「日本語で返事すること」）→ CLAUDE.mdに書くべき

---

### 3. Claude Codeが自動判断して読み込む内容：skills と subagents

#### 共通の特徴

- Claude Codeはskillsやsubagentsの**全体ではなくdescription（概要）だけをあらかじめ読む**
- 概要から必要性を判断して全体を読む流れにより、**コンテキスト消費を最小化**しつつ複雑な機能を発揮

#### subagentsを選ぶ場合：コンテキストを独立させたいとき

サブエージェントは**独立したコンテキスト**を持つため、以下のケースに向いている：

- タスクが巨大な場合
- 親側が結果を概要レベルで知っていればよい場合
- 試行錯誤を伴うエラーの原因調査（情報整理の観点で有効）

> 見方を変えれば、特定条件で反映したいCLAUDE.mdとも言える

#### skillsを選ぶ場合：コンテキストを共有したいとき

例：Claude Codeにテスト駆動開発させる場合

- 高度な知識をCLAUDE.mdやrulesに書くのはコンテキストの無駄遣い
- サブエージェントに独立させると、RED-GREEN-REFACTORのサイクルごとにコンテキストが分断され、開発の経緯を共有しきれずに状況を見失うおそれがある
- **Skillsならコンテキストを完全に引き継いで複雑なタスクを実行できる**

---

### 4. 明示的呼び出しについて

| 方法 | skills | subagents |
|------|--------|-----------|
| 自然言語 | 「commitスキルを使って」 | 「test-runnerサブエージェントを起動して」 |
| `@`記法 | なし | `@test-runner` |

**明示的に呼び出したいならslash commandsを使うべき**（それは技能ではなく指示だから）。

#### 自動でも手動でも使いたい場合の解決策

slash commandsに具体的な指示を書き、slash commandを呼び出すskillを書く：

```yaml
---
name: git-commit
description: Stage meaningful diffs and create Conventional Commits with WHY-focused messages. Use when agent needs to commit code changes.
---

Execute `/git:commit` slash command
```

---

## 設定の肥大化と戦う

### 重複の排除

| 重複パターン | 解決策 |
|-------------|--------|
| slash commandとskillで重複 | skillからslash commandを呼び出す形に統一 |
| 複数のsubagentsで共通のルール | 常に必要ならCLAUDE.mdへ、特定条件で必要ならskillsとして切り出す |

### 読み込みタイミングの最適化

CLAUDE.mdやrulesに書いてあるが常に必要ではない内容は移動を検討：

| 内容の特徴 | 移動先 |
|-----------|--------|
| 特定タスクでしか使わない詳細な手順 | slash commands |
| 自動判断で発動させたい専門知識 | skills |
| 独立したコンテキストで処理させたいタスク | subagents |

---

## まとめ

5つの設定プロンプト（CLAUDE.md、rules、skills、slash commands、subagents）は、一見同じに見えるが、**コンテキストの扱い方**に着目すると使い分けの意義が明確になる：

1. **CLAUDE.md / rules**：起動時に全文読み込み。常に必要な情報向け
2. **slash commands**：呼び出すまでコンテキスト消費なし。ユーザー主導の実行向け
3. **skills**：概要のみ先読み、コンテキスト共有。自動発動する専門知識向け
4. **subagents**：概要のみ先読み、コンテキスト独立。大規模・独立タスク向け

うまく使うことで、**コンテキスト管理の上手なClaude Code**を構築できる。
