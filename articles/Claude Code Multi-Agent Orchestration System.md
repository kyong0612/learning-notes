---
title: "Claude Code Multi-Agent Orchestration System"
source: "https://gist.github.com/kieranklaassen/d2b35569be2c7f1412c64861a219d51f"
author:
  - "[[kieranklaassen]]"
  - "[[ruvnet]]"
  - "[[delorenj]]"
  - "[[dgtise25]]"
published: 2026-01-23
created: 2026-01-25
description: "Claude Code v2.1.19のバイナリから発見されたTeammateToolという隠れたマルチエージェントオーケストレーション機能の技術分析。13種類のエージェント間操作、ファイルベース調整、3つのスポーンバックエンドを含む実装済み機能をドキュメント化。"
tags:
  - "clippings"
  - "claude-code"
  - "multi-agent"
  - "AI"
  - "orchestration"
  - "teammate-tool"
---

## 概要

> **これは提案ではなく、Claude Code v2.1.19バイナリで発見された既存の隠れた機能のドキュメント**

**TeammateToolはすでにClaude Codeに存在している。** `~/.local/share/claude/versions/2.1.19` のコンパイル済みバイナリから `strings` 分析で抽出された。この機能は完全に実装されているが、フィーチャーフラグ（`I9() && qFB()`）でゲートされている。

---

## Part 1: バイナリから発見された内容

### 発見方法

```bash
# Location
~/.local/share/claude/versions/2.1.19
# Mach-O 64-bit executable

# Extract strings mentioning TeammateTool
strings ~/.local/share/claude/versions/2.1.19 | grep -i "TeammateTool"

# Extract team_name references
strings ~/.local/share/claude/versions/2.1.19 | grep -i "team_name"
```

### TeammateTool操作一覧（確認済み）

| 操作 | 目的 |
|------|------|
| `spawnTeam` | 新しいチームを作成し、リーダーになる |
| `discoverTeams` | 参加可能なチームを一覧表示 |
| `requestJoin` | 既存チームへの参加を要求 |
| `approveJoin` | リーダーが参加リクエストを承認 |
| `rejectJoin` | リーダーが参加リクエストを拒否 |
| `write` | 特定のチームメイトにメッセージを送信 |
| `broadcast` | 全チームメイトにメッセージを送信 |
| `requestShutdown` | チームメイトにシャットダウンを要求 |
| `approveShutdown` | シャットダウンを承認して終了 |
| `rejectShutdown` | シャットダウンを拒否し、作業を継続 |
| `approvePlan` | リーダーがチームメイトの計画を承認 |
| `rejectPlan` | リーダーがフィードバック付きで計画を拒否 |
| `cleanup` | チームディレクトリを削除 |

### エラーメッセージ（バイナリから抽出）

```
"team_name is required for spawn operation. Either provide team_name in input
or call spawnTeam first to establish team context."

"team_name is required for broadcast operation. Either provide team_name in input,
set CLAUDE_CODE_TEAM_NAME, or create a team with spawnTeam first."

"proposed_name is required for requestJoin operation."

"does not exist. Call spawnTeam first to create the team."
```

### 環境変数（確認済み）

| 変数 | 目的 |
|------|------|
| `CLAUDE_CODE_TEAM_NAME` | 現在のチームコンテキスト |
| `CLAUDE_CODE_AGENT_ID` | エージェント識別子 |
| `CLAUDE_CODE_AGENT_NAME` | エージェント表示名 |
| `CLAUDE_CODE_AGENT_TYPE` | エージェントの役割/タイプ |
| `CLAUDE_CODE_PLAN_MODE_REQUIRED` | 計画承認が必要かどうか |

### フィーチャーゲーティング

```javascript
isEnabled() {
  return I9() && qFB() // 2つのフィーチャーフラグがtrueである必要あり
}
```

### スポーンバックエンド

| バックエンド | ターミナル | ユースケース |
|--------------|------------|--------------|
| iTerm2 split panes | Native macOS | 視覚的な並列エージェント |
| tmux windows | クロスプラットフォーム | サーバー/ヘッドレス |
| In-process | なし | 同一プロセス、最速 |

### ファイル構造

```
~/.claude/
├── teams/
│   └── {team-name}/
│       ├── config.json      # チームメタデータ、メンバー
│       └── messages/        # エージェント間メールボックス
│           └── {session-id}/
├── tasks/
│   └── {team-name}/         # チームスコープのタスク
│       ├── 1.json
│       └── ...
```

---

## Part 2: 推測されるユースケース

> **以下はすべて、有効化された場合にAPIがどのように使用されるかに基づく推測**

### ユースケース1: コードレビュースウォーム

**シナリオ:** PRを開き、複数の視点から徹底的なレビューを受けたい

```
You: "Review PR #1588 with a full team"

Claude (Leader):
└── spawnTeam("pr-review-1588")
    └── spawn("security-sentinel", prompt="Review for vulnerabilities")
    └── spawn("performance-oracle", prompt="Check for N+1 queries, memory leaks")
    └── spawn("rails-expert", prompt="Check Rails conventions")
    └── spawn("test-coverage", prompt="Verify test coverage is adequate")

[All agents work in parallel, each in their own iTerm2 pane]

Leader synthesizes:
└── "Here's the consolidated review with 3 critical, 5 moderate findings..."
```

**結果:** 5つのターミナルペインに、それぞれ異なるエージェントが作業中。リーダーが調整・統合。

### ユースケース2: フィーチャーファクトリー

**シナリオ:** 各レイヤーに特化したエージェントで完全な機能を構築

```
You: "Build user authentication with OAuth"

Claude (Leader):
└── spawnTeam("auth-feature")

Phase 1 - Planning:
└── spawn("architect", prompt="Design the OAuth flow", plan_mode_required=true)
└── approvePlan("architect", request_id="...")

Phase 2 - Implementation (parallel):
└── spawn("backend-dev", prompt="Implement OAuth controller and models")
└── spawn("frontend-dev", prompt="Build login UI components")
└── spawn("test-writer", prompt="Write integration tests", blockedBy=["backend-dev"])

Phase 3 - Integration:
└── write("backend-dev", "Frontend is using /auth/callback endpoint")
└── write("frontend-dev", "Backend expects redirect_uri param")
```

**特徴:** エージェントが通信し、依存関係でブロックし、リーダーがマイクロマネジメントなしにオーケストレーション。

### ユースケース3: バグハントスカッド

**シナリオ:** 本番バグを複数の角度から調査

```
You: "Users report checkout fails intermittently"

Claude (Leader):
└── spawnTeam("bug-hunt-checkout")

Investigation (parallel):
└── spawn("log-analyst", prompt="Search AppSignal for checkout errors")
└── spawn("code-archaeologist", prompt="git log -p on checkout paths")
└── spawn("reproducer", prompt="Try to reproduce in test environment")
└── spawn("db-detective", prompt="Check for data anomalies in orders table")

[各エージェントが独立して作業し、リーダーに報告]
```

### ユースケース4: 自己組織化リファクタリング

**シナリオ:** 大規模リファクタリングの自動作業分配

- スカウトエージェントがリファクタリング対象を発見（47サービス）
- 47タスクを作成
- 複数のワーカーが自律的にタスクキューからタスクを取得
- ワーカーがクラッシュした場合、ハートビートタイムアウトでタスクが解放され、他のワーカーが引き継ぐ

**重要な洞察:** ワーカーは共有タスクキュー周りで自己組織化。中央割り当て不要。

### ユースケース5: リサーチカウンシル

**シナリオ:** コミット前に複数の技術的アプローチを評価

```
You: "Should we use Redis or PostgreSQL for our job queue?"

Claude (Leader):
└── spawnTeam("tech-evaluation")
└── spawn("redis-advocate", prompt="Make the case FOR Redis")
└── spawn("postgres-advocate", prompt="Make the case FOR PostgreSQL")
└── spawn("devil-advocate", prompt="Find problems with BOTH approaches")
└── spawn("cost-analyst", prompt="Compare operational costs")

[各エージェントが独立して調査]
[討論フェーズで互いの主張に対応]

Leader synthesizes:
└── "Recommendation: Use PostgreSQL with SKIP LOCKED pattern..."
```

### ユースケース6: デプロイメントガーディアン

**シナリオ:** 複数チェックポイントによる自動プリデプロイメント検証

- プリフライト（並列、すべてパス必須）: テスト実行、セキュリティスキャン、マイグレーションチェック、パフォーマンスベースライン
- ゲートチェック: いずれかのエージェントが失敗で拒否 → デプロイメント中止
- ポストデプロイ: スモークテスト、パフォーマンス比較、ログ監視
- 失敗時は自動ロールバック

### ユースケース7: ライブドキュメンテーションチーム

**シナリオ:** コード変更に合わせてドキュメントを自動同期

### ユースケース8: 無限コンテキストウィンドウ

**シナリオ:** コンテキスト制限を超える巨大コードベースの理解

```
You: "Understand this entire 500-file codebase and answer questions"

Specialists (各ドメインを担当):
└── spawn("models-expert", prompt="Become expert on app/models/")
└── spawn("controllers-expert", prompt="Become expert on app/controllers/")
└── spawn("services-expert", prompt="Become expert on app/services/")
└── spawn("jobs-expert", prompt="Become expert on app/jobs/")
└── spawn("tests-expert", prompt="Become expert on test/")

[クエリ時、リーダーが関連エージェントにルーティング]
[チームは質問間で永続化 - 再読み込み不要]
```

**ブレークスルー:** 各エージェントがドメインのコンテキストを維持。組み合わせると、コードベース全体を「知っている」。

---

## Part 3: 予測されるインタラクションパターン

### リーダーパターン

```
Leader creates team → Leader spawns workers → Workers report to leader → Leader synthesizes
```

最も一般的。1人のオーケストレーター、複数のスペシャリスト。

### スウォームパターン

```
Leader creates team + tasks → Workers self-assign from task queue → Leader monitors
```

恥ずかしいほど並列な作業向け。ワーカーは交換可能。

### パイプラインパターン

```
Agent A (blockedBy: []) → Agent B (blockedBy: [A]) → Agent C (blockedBy: [B])
```

ハンドオフを伴う逐次処理。各エージェントが前任者を待つ。

### カウンシルパターン

```
Multiple agents with same task → Each proposes solution → Leader picks best
```

多様な視点が欲しい意思決定向け。

### ウォッチドッグパターン

```
Worker agent does task → Watcher agent monitors → Watcher can trigger rollback
```

安全性チェックが必要な重要操作向け。

---

## Part 4: 障害モードとその対処

| 障害モード | システムの対処 |
|------------|----------------|
| エージェントがタスク中にクラッシュ | ハートビートタイムアウト（5分）でタスク解放 |
| リーダーがクラッシュ | ワーカーは現在の作業を完了後、アイドル状態に |
| エージェント内の無限ループ | `requestShutdown` → タイムアウト → 強制終了 |
| デッドロック依存関係 | タスク作成時のサイクル検出 |
| エージェントがシャットダウンを拒否 | タイムアウト → 強制終了 |
| リソース枯渇 | チームあたりの最大エージェント数制限 |

---

## Part 5: 検証コマンド

自分のシステムで存在を確認：

```bash
# Check Claude Code version
claude --version

# Find TeammateTool references
strings ~/.local/share/claude/versions/$(claude --version | cut -d'' -f1) \
  | grep "TeammateTool" | head -5

# Find all operations
strings ~/.local/share/claude/versions/$(claude --version | cut -d'' -f1) \
  | grep -E "spawnTeam|discoverTeams|requestJoin|approveJoin" | head -20

# Find environment variables
strings ~/.local/share/claude/versions/$(claude --version | cut -d'' -f1) \
  | grep "CLAUDE_CODE_TEAM" | head -10
```

---

## 結論

**Claude Codeの未来はマルチエージェント。** インフラストラクチャは存在する：

- **13種類のTeammateTool操作**
- **ファイルベースの調整**
- **3つのスポーンバックエンド**（iTerm2、tmux、インプロセス）
- **エージェント間メッセージング**
- **計画承認ワークフロー**
- **グレースフルシャットダウンプロトコル**

フィーチャーフラグの背後で待機中。有効化されると以下が可能に：

- コードレビュースウォーム
- 機能開発チーム
- 自己組織化リファクタリング
- リサーチカウンシル
- デプロイメントガーディアン
- 分散コードベース理解

**プリミティブは存在する。創造性は私たち次第。**

---

*分析日: 2026-01-23*
*Claude Code: v2.1.19*
*Binary: ~/.local/share/claude/versions/2.1.19*
