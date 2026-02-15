---
title: "Your exploration session is the worst one to implement the solution. A field guide that fixes this with fresh context execution. Custom commands included."
source: "https://gist.github.com/TheSylvester/29c9f9defad320e6d51f971274f9bf71"
author:
  - "[[TheSylvester]]"
  - "Sylvester Wong"
published: 2026-01
created: 2026-02-15
description: "Claude Codeを使ったAIコーディングにおいて、探索セッションと実行セッションを分離するワークフローを提唱する実践的フィールドガイド。カスタムスラッシュコマンド（/handoff-prompt-to、/pair-prompt-to、/reflect）を活用し、LLMのコンテキスト劣化問題を回避して高品質なコード生成を実現する手法を解説する。"
tags:
  - "clippings"
  - "claude-code"
  - "ai-coding"
  - "prompt-engineering"
  - "context-management"
  - "workflow"
  - "agentic-coding"
---

## 要約

### 核心的な問題提起

LLM（大規模言語モデル）には以下の根本的な問題がある：

- **自身の出力にアンカリングする**（[MIT研究](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177/When-Can-LLMs-Actually-Correct-Their-Own-Mistakes)）
- **エラーを繰り返す**（[arXiv論文](https://arxiv.org/abs/2505.17656)）
- **コンテキストの20%充填で品質が劣化する**（[Reasoning Degradation研究](https://github.com/natanaelwf/Reasoning-Degradation_Paper)）

そのため、**探索に使ったセッションでそのまま実装すると、最も品質の低い結果になる**。解決策は「探索は1つのセッションで、実行はフレッシュなセッションで」行うこと。

---

### ワークフロー全体像

| フェーズ | 目的 | 使用するコマンド |
|---|---|---|
| **Bootstrap** | セッション開始時にプロジェクトコンテキストを自動ロード | `CLAUDE.md`（自動読み込み） |
| **Discover** | 探索・計画・議論。サブエージェントで並列調査 | 自然言語 |
| **Distill** | フレッシュ実行用のクリーンな仕様書を生成 | `/handoff-prompt-to`、`/pair-prompt-to` |
| **Reflect** | プロンプトが議論内容とコードベースに一致するか検証 | `/reflect` |
| **Execute** | 新しいターミナルで蒸留されたプロンプトを実行 | プロンプトをペースト |
| **Learn** | エージェントのミスを`CLAUDE.md`に記録 | 手動 |

**フレッシュウィンドウでの実行方法：** プロンプトファイルの全内容を最初のメッセージとしてペーストする。エージェントはそれを仕様書として扱い、タスクを読み取り、実装し、検証サブエージェント（テスト・動作確認・コード品質）を起動し、問題を修正して完了を報告する。

---

### 1. プロジェクト基盤：`CLAUDE.md`

**フェーズ：Bootstrap** — セッション開始時に自動ロード。

- **主な用途：エージェントのミスを記録し、再発を防ぐ**
- グローバル（`~/.claude/CLAUDE.md`）とプロジェクトルート（`./CLAUDE.md`、優先度高）に配置可能

```markdown
# CLAUDE.md
## Commands
- `pnpm test` — run tests
- `pnpm build` — build project

## Gotchas (learned from agent mistakes)
- Use date-fns, NOT moment.js
- Auth tokens go in headers, not query params
- Run `go generate ./...` after interface changes
```

**ポイント：** 短くまとめ、ミスを発見次第追記する。チームでリポジトリにコミットし、全員の将来のセッションが過去の学びを継承できるようにする（**Compounding Engineering**）。

---

### 2. 3つのコアスラッシュコマンド

ファイル配置先：
- `.claude/commands/` — プロジェクトスコープ（リポジトリにコミット）
- `~/.claude/commands/` — ユーザースコープ（全プロジェクト共通）

#### `/handoff-prompt-to <タスク>` — 自律実行用プロンプト生成（Distillフェーズ）

フレッシュなClaudeセッション用の完全な仕様書を生成する。**大規模タスクは自動分解される。**

- **結合度を分析**して分割の要否を判断
  - **統合維持：** ファイル・型・依存関係を共有するコード → 共有コンテキストが品質向上に寄与
  - **分割：** 独立した関心事 → 各自のプロンプトに明示的なインターフェース定義を含む
- 目安：20+ファイルに跨る、または明確に独立した機能でない限り統合維持
- すべてのプロンプトに**検証サブエージェント**、**インターフェース定義**、**完了チェックリスト**を含む
- 分解されたタスクのインデックスファイルで並列実行可能なプロンプトを示す

```
> /handoff-prompt-to add retry logic to API client
→ 単一ファイル: .ai-reference/prompts/1736345678-add-retry.md

> /handoff-prompt-to implement auth system with JWT, refresh tokens, OAuth
→ 4つのプロンプトファイルに自動分解
→ .ai-reference/prompts/auth-system/00-index.md
→ .ai-reference/prompts/auth-system/01-jwt-service.md
→ .ai-reference/prompts/auth-system/02-refresh-tokens.md
→ .ai-reference/prompts/auth-system/03-oauth.md
```

#### `/pair-prompt-to <タスク>` — 協調実行用プロンプト生成（Distillフェーズ）

ペアプログラミング用のプロンプトを生成。エージェントは各ステップで承認を求める。

- **使用場面：** ハイステークスな変更、ステップバイステップの制御が必要な場合

#### `/reflect` — 実行前検証（Reflectフェーズ）

プロンプトを会話内容とコードベースに対して検証する。**`/handoff-prompt-to`や`/pair-prompt-to`の後、同じウィンドウで実行する。**

- 判定結果を出力するのではなく、**プロンプトファイルを直接更新**する
- チェック項目：決定事項の網羅性、ファイルパスの正確性、分解タスクの整合性、インターフェースの一貫性
- **常に`/reflect`してから新しいウィンドウに移行すること**

#### 使い分けフロー

```
タスクがある
├─ 些細な変更？ → 直接実行 or Plan mode
├─ ハイステークス or ステップバイステップ制御？ → /pair-prompt-to → /reflect → 新ウィンドウ
├─ それ以外 → /handoff-prompt-to → /reflect → 新ウィンドウ
└─ タスク途中でコンテキスト満杯？
    ├─ 決定事項を保持したい → /handoff-prompt-to continue
    └─ 同セッションで続けたい → /compact
```

---

### 3. サブエージェント

**フェーズ：Discover（調査）とExecute（検証）** — コンテキストのファイアウォール。

- 独立したコンテキストウィンドウを持つ隔離されたインスタンス
- **明示的に並列化を要求する必要がある**（Claudeはデフォルトで逐次実行）
- 最大約10個の同時実行、サブエージェントのネスト不可
- 書き込み操作はシリアル化して衝突を回避

```
.claude/agents/ # プロジェクトスコープ
~/.claude/agents/ # ユーザースコープ
```

**ビルトインエージェント：** Explore（高速コードベース検索）、Plan（アーキテクチャ計画）、Task（汎用実行）

**並列探索の例：**

```
このコードベースを4つの並列タスクで探索:
- Task 1: cmd/ のエントリポイントパターンを分析
- Task 2: internal/domain/ のビジネスロジックをレビュー
- Task 3: internal/infra/ の外部統合を調査
- Task 4: テストカバレッジパターンを確認
各タスクはサマリーのみ返すこと。
```

---

### 4. コンテキスト管理

| コマンド | 効果 |
|---|---|
| `/compact` | 会話履歴を要約して圧縮 |
| `/clear` | 完全にクリア |
| `/context` | 現在の使用量を表示 |
| `claude -c` | 最新セッションを継続 |
| `claude -r` | セッションIDで再開 |

**`/compact` vs 蒸留の使い分け：**

| 状況 | アクション |
|---|---|
| タスク途中でコンテキスト満杯 | `/compact`（明示的に保持項目を指定） |
| タスク完了、関連作業を開始 | `/clear` or 新ウィンドウ |
| 長い協調セッション、コンテキスト満杯 | `/handoff-prompt-to` で継続プロンプト生成 |
| 正確な決定事項を保存したい | プロンプトファイルに蒸留 → 新ウィンドウ |

- 自動コンパクトは約95%使用時にトリガーされるが、論理的な区切りでの手動コンパクトの方がニュアンスを保持できる

---

### Pro Tips（重要な実践知見）

- **"Skeptically"パワーワード：** 検証リクエストに「skeptically」を追加すると、Claudeのデフォルトの同意傾向を上書きし、批判的レビューを促す。`/reflect`コマンドにはこれが組み込まれている
- **明示的な並列化：** 「4つの並列サブエージェントを使え」と明示的に指示する必要がある。Claudeはデフォルトで逐次実行する
- **プロンプトはポータブル：** 蒸留されたプロンプトはCursor、Windsurf、Copilotなど任意のコーディングエージェントで動作する
- **`/reflect`の再実行タイミング：** コード変更後にプロンプトを再利用する場合、他のセッションやチームメイトからのプロンプトの場合、分解タスクの並列実行前
- **継続プロンプト：** タスク途中でコンテキストが満杯 → `/handoff-prompt-to continue from Phase 3`で残作業にスコープした決定事項をキャプチャ
- **検証が品質の倍増器：** テスト・ブラウザチェック・スクリプト実行など、Claudeに作業を証明する手段を与えると品質が2〜3倍向上する。ハンドオフプロンプトには3つの検証サブエージェント（テスト・動作・コード品質）が組み込まれている
- **フレッシュな視点を強制：** コードレビューには同じセッションではなくサブエージェントを起動する。レビューエージェントは著者のバイアスを持たない

---

### 学習フェーズ（Learn）

セッション終了前に必ず行うこと：

1. **学んだ教訓を記録：** 新しいゴッチャ、エッジケース、依存関係を発見したか？
2. **`CLAUDE.md`を即座に更新：** 記憶に頼らない。次のセッションがこの知識を自動的に継承する
3. **セッションを破棄：** 教訓が永続化されたら、コンテキストは役目を終えている

**チームナレッジ：** `CLAUDE.md`をリポジトリにコミットする。チーム全員がClaude のミスを発見するたびに追記する。これが**Compounding Engineering**（複利的エンジニアリング）— すべての将来のセッションが過去より賢く始まる。
