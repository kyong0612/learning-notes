---
title: "mattpocock/skills: My personal directory of skills, straight from my .claude directory."
source: "https://github.com/mattpocock/skills"
author:
  - "[[Matt Pocock]]"
published: 2026-02-03
created: 2026-03-26
description: "Matt PocockがClaude Code用に構築したAgent Skillsのコレクション。PRD作成・TDD・コードベースアーキテクチャ改善・リファクタ計画など、計画・開発・ツーリング・ライティングの4カテゴリ16スキルを提供し、npxコマンドで即座にインストール可能。"
tags:
  - "clippings"
  - "claude-code"
  - "agent-skills"
  - "AI-assisted-development"
  - "TDD"
  - "software-architecture"
---

## 概要

[mattpocock/skills](https://github.com/mattpocock/skills) は、TypeScript教育者として知られる **Matt Pocock** が自身の `.claude` ディレクトリから公開したAgent Skillsのコレクションである。Claude CodeなどのAIコーディングエージェントの能力を拡張し、**計画・開発・ツーリング・ライティング**の4カテゴリにわたる16個のスキルを提供する。

- **Stars**: 10,242 / **Forks**: 836 / **License**: MIT
- **インストール**: `npx skills@latest add mattpocock/skills/<skill-name>`

すべてのスキルは独立したディレクトリに `SKILL.md` を中心に構成されており、必要に応じて `REFERENCE.md`、`EXAMPLES.md`、`scripts/` を含む。

---

## Planning & Design（計画・設計）

コードを書く前に問題を深く考え抜くためのスキル群。

### write-a-prd

PRD（Product Requirements Document）をインタラクティブなインタビュー形式で作成する。

- ユーザーから問題の詳細な説明と解決策のアイデアをヒアリング
- コードベースを探索して現状を把握
- 設計ツリーの各分岐を徹底的にインタビューで解決
- **Deep module**（小さなインターフェースで多くの機能をカプセル化するモジュール）の抽出機会を探索
- 最終的に GitHub Issue としてPRDを投稿
- テンプレート: Problem Statement / Solution / User Stories / Implementation Decisions / Testing Decisions / Out of Scope

```
npx skills@latest add mattpocock/skills/write-a-prd
```

### prd-to-plan

PRDを **tracer-bullet vertical slices**（薄い垂直スライス）を用いた多段階の実装計画に変換する。

- 水平スライス（レイヤー単位）ではなく、**すべてのインテグレーション層を端から端まで貫く垂直スライス**を作成
- 各フェーズは単独でデモ可能・検証可能
- **耐久的なアーキテクチャ決定**（ルート構造、DBスキーマ、データモデル、認証方式）を事前に特定
- `./plans/` ディレクトリにMarkdownファイルとして出力

```
npx skills@latest add mattpocock/skills/prd-to-plan
```

### prd-to-issues

PRDを独立して着手可能な GitHub Issues に分解する。

- **HITL**（Human-In-The-Loop: 人の介入が必要）と **AFK**（Away From Keyboard: 自動実行可能）のタイプを区別
- 各Issueは垂直スライスで、依存関係の順序で作成
- ブロッカーの関係を明示し、受け入れ基準を含む

```
npx skills@latest add mattpocock/skills/prd-to-issues
```

### grill-me

計画やデザインについて**容赦なくインタビュー**し、設計ツリーの全分岐を解決するまで深掘りする。

- 各質問に対して推奨回答を提示
- コードベースの調査で回答できる質問はコードベースを探索して回答

```
npx skills@latest add mattpocock/skills/grill-me
```

### design-an-interface

John Ousterhoutの「Design It Twice」原則に基づき、**並列サブエージェント**を使って複数の根本的に異なるインターフェース設計を生成する。

- 要件収集後、3つ以上のサブエージェントを並列起動
  - Agent 1: メソッド数最小化（1-3メソッド）
  - Agent 2: 柔軟性最大化
  - Agent 3: 最も一般的なケースの最適化
  - Agent 4: 特定パラダイム/ライブラリからのインスピレーション
- 各デザインの**インターフェースシグネチャ、使用例、隠蔽する複雑性、トレードオフ**を比較
- 最終的にユーザーと合成して最適な設計を選択

```
npx skills@latest add mattpocock/skills/design-an-interface
```

### request-refactor-plan

Martin Fowlerの「各リファクタリングステップをできるだけ小さくする」というアドバイスに基づき、**極小コミット単位**のリファクタ計画を作成する。

- ユーザーインタビューで問題の詳細を把握
- 代替案の検討を促す
- テストカバレッジの確認
- コードベースを常に動作状態に保つ小さなコミットに分解
- GitHub Issue としてRFCを投稿

```
npx skills@latest add mattpocock/skills/request-refactor-plan
```

---

## Development（開発）

コードの作成・リファクタリング・修正を支援するスキル群。

### tdd

**Red-Green-Refactor** ループによるテスト駆動開発。

**核心原則**:
- テストは実装の詳細ではなく、**パブリックインターフェースを通じた振る舞い**を検証する
- 良いテストはインテグレーションスタイルで、リファクタリングに耐える
- 悪いテスト = 実装に結合している（内部協調者のモック、プライベートメソッドのテスト等）

**アンチパターン: 水平スライス**:
```
❌ 水平（全テスト→全実装）:
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

✅ 垂直（1テスト→1実装の繰り返し）:
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  ...
```

**ワークフロー**: 計画 → Tracer Bullet（最初の1テスト） → 増分ループ → リファクタ

```
npx skills@latest add mattpocock/skills/tdd
```

### triage-issue

バグを調査し、根本原因を特定し、TDDベースの修正計画を GitHub Issue として作成する。

- 最小限の質問でユーザーから問題を把握（1問のみ）
- Exploreサブエージェントでコードベースを深く調査
- **RED-GREEN サイクル**で構成された修正計画を作成
- 修正提案は「耐久的」であること — 特定のファイルパスや行番号ではなく、振る舞いと契約で記述

```
npx skills@latest add mattpocock/skills/triage-issue
```

### improve-codebase-architecture

コードベースを探索し、**shallow module を deep module に深化**させるリファクタリング機会を発見する。

- **Deep module**: 小さなインターフェースが大きな実装を隠す（テスト容易、AI操作容易）
- **Shallow module**: インターフェースが実装とほぼ同じ複雑さ（避けるべき）
- 有機的にコードベースを探索し、「摩擦」をシグナルとして活用
- 3つ以上の並列サブエージェントで根本的に異なるインターフェース設計を生成
- 自身の推奨を明確に述べる（メニュー提示ではなく意見を持つ）

```
npx skills@latest add mattpocock/skills/improve-codebase-architecture
```

### migrate-to-shoehorn

テストファイルの `as` 型アサーションを `@total-typescript/shoehorn` に移行する。

```
npx skills@latest add mattpocock/skills/migrate-to-shoehorn
```

### scaffold-exercises

セクション、問題、解答、解説を含む演習ディレクトリ構造を作成する。

```
npx skills@latest add mattpocock/skills/scaffold-exercises
```

---

## Tooling & Setup（ツーリング・セットアップ）

### setup-pre-commit

Huskyプリコミットフックを設定（lint-staged、Prettier、型チェック、テスト）。

```
npx skills@latest add mattpocock/skills/setup-pre-commit
```

### git-guardrails-claude-code

Claude Codeのフックで**危険なgitコマンドをブロック**する。

**ブロック対象**:
- `git push`（`--force` を含むすべてのバリアント）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

プロジェクトスコープ（`.claude/settings.json`）またはグローバルスコープ（`~/.claude/settings.json`）で設定可能。

```
npx skills@latest add mattpocock/skills/git-guardrails-claude-code
```

---

## Writing & Knowledge（ライティング・知識）

### write-a-skill

適切な構造、プログレッシブ・ディスクロージャー、バンドルリソースを持つ新しいスキルを作成する。

**スキル構造**:
```
skill-name/
├── SKILL.md           # メインの指示（必須）
├── REFERENCE.md       # 詳細ドキュメント（必要に応じて）
├── EXAMPLES.md        # 使用例（必要に応じて）
└── scripts/           # ユーティリティスクリプト（必要に応じて）
```

**重要ポイント**:
- `description` はエージェントがスキルを選択する唯一の判断材料
- SKILL.md は100行以下に抑える
- 決定論的操作にはスクリプトを追加（トークン節約と信頼性向上）

```
npx skills@latest add mattpocock/skills/write-a-skill
```

### edit-article

記事のセクション再構成、明確性の向上、文章の引き締めを行う。

- 情報を有向非巡回グラフ（DAG）として捉え、依存関係を尊重した順序に整理
- 段落あたり最大240文字
- ユーザーとセクション構成を確認後、各セクションを書き直し

```
npx skills@latest add mattpocock/skills/edit-article
```

### ubiquitous-language

DDDスタイルのユビキタス言語用語集を会話から抽出する。

- 同じ単語が異なる概念に使われている曖昧性を検出
- 異なる単語が同じ概念に使われている同義語を統合
- 正規の用語を意見を持って選択し、避けるべきエイリアスを明示
- 用語間の関係性とカーディナリティを記述
- ドメインエキスパートと開発者の対話例を生成
- `UBIQUITOUS_LANGUAGE.md` に保存

```
npx skills@latest add mattpocock/skills/ubiquitous-language
```

### obsidian-vault

Obsidianのvault内でノートの検索・作成・管理を行う（wikilinksとインデックスノート対応）。

```
npx skills@latest add mattpocock/skills/obsidian-vault
```

---

## 設計思想と特筆事項

### 一貫した設計原則

1. **Deep Module パターン**: John Ousterhout の "A Philosophy of Software Design" から着想を得た、小さなインターフェースで大きな実装を隠すモジュール設計を全スキルで推奨
2. **Tracer Bullet / Vertical Slice**: 水平方向のレイヤー分割ではなく、すべての層を貫通する薄い垂直スライスを採用
3. **TDD (Red-Green-Refactor)**: 振る舞いベースのテストを1つずつ書き、実装する垂直アプローチ
4. **耐久性**: ファイルパスや行番号ではなく、振る舞いと契約で記述することで、コードベースの変化に耐える

### GitHub統合

多くのスキルがGitHub Issueの作成を最終出力とし、`gh` CLIを活用する。PRD、実装計画、バグトリアージ、リファクタRFCなど、すべてがIssue駆動のワークフローとなっている。

### 並列サブエージェント活用

`design-an-interface` と `improve-codebase-architecture` では、3つ以上のサブエージェントを並列に起動して根本的に異なる設計案を生成する「Design It Twice」パターンを採用している。

### インストール方法

すべてのスキルは以下のコマンドで即座にインストール可能:

```bash
npx skills@latest add mattpocock/skills/<skill-name>
```
