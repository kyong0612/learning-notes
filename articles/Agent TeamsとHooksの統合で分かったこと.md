---
title: "Agent TeamsとHooksの統合で分かったこと"
source: "https://zenn.dev/tarouimo/articles/9aace19fa1c271"
author:
  - "[[tarouimo]]"
  - "[[Zenn]]"
published: 2026-02-09
created: 2026-02-10
description: "Claude Code v2.1.32のAgent TeamsとHooks APIを5フェーズに分けて統合検証した記録。Hookタイプごとのブロッキング方法の違い、設計案5案中4案の失敗、そしてHooksによる確定的制御でAgent Teamsのギャップを埋めるハイブリッド構成の有効性を実証している。"
tags:
  - "clippings"
  - "Claude Code"
  - "Agent Teams"
  - "Hooks"
  - "multi-agent"
  - "AI"
---

## 要約

### はじめに：Agent Teamsの課題とHooksによる解決

Claude Code v2.1.32（2026年2月5日）で、Agent Teamsがresearch previewとして利用可能になった。環境変数 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` で有効化し、`TeamCreate` / `TaskCreate` で複数サブエージェントに並列でコードを書かせることができる。

しかし実際の運用では以下の課題がある：

- **コスト制御の手段がない**
- **セッション切断でチームメイトの状態が全消失**
- **Compaction（コンテキスト圧縮）でチームメイトが文脈を忘れる**
- **タスク完了判定がLLM任せで、依存関係を無視して「完了」にされる**

本記事は、**Hooks APIでこのギャップを埋められるか**を5フェーズに分けて検証した記録。結論として、**公式機能の便利さとHooksの強制力を組み合わせるハイブリッド構成が有効**だった。ただし、当初の設計案は5案中4案でHookタイプの選択を間違えており、試行錯誤の連続だった。

---

### アーキテクチャ：チームメイトは擬似並列で動く

#### チームメイトは独立プロセスではない

Phase 0の検証で、全チームメイトのツール実行がClaude Code本体プロセスを経由していることが判明した。PPIDが全行同一であり、**Hookは追加設定なしで全チームメイトのツール呼び出しを捕捉できる**。

```
Claude Code 本体プロセス (PID: 54324)
├── リードのツール実行 → Hook発火 (ppid=54324)
├── チームメイトAの実行 → Hook発火 (ppid=54324)
└── チームメイトBの実行 → Hook発火 (ppid=54324)
```

#### シリアライズ実行の実態

2名のチームメイトに同時タスクを割り当てた結果、alpha → beta → alpha → beta と約1〜2秒間隔で交互に処理されていた。**Agent Teamsの「並列実行」は、本体のツール実行キューによるシリアライズ実行**。2名なら実用上問題ないが、人数が増えると遅延が効いてくる。

---

### Agent Teams専用Hookと落とし穴

#### 専用Hookは4種類

| Hookタイプ | 発火タイミング | 用途 |
|---|---|---|
| **SubagentStart** | サブエージェント起動時 | コンテキスト注入 |
| **SubagentStop** | サブエージェント終了時 | 状態スナップショット |
| **TaskCompleted** | タスクがcompletedにされる直前 | フロー保証 |
| **TeammateIdle** | チームメイトがidle化する直前 | 品質ゲート |

特に **TaskCompleted** は exit 2 でタスク完了自体をブロックでき、フロー保証の中核になる。

#### UserPromptSubmitはチームメイトで発火しない

当初、チームメイトの記憶保護に UserPromptSubmit を使う設計だったが、**このHookは人間ユーザーのプロンプト送信時にのみ発火**し、チームメイトがリードからメッセージを受信しても対象外。→ **SubagentStart Hookでの起動時注入に切り替え**。

#### additionalContext注入にはラッパーが必要

SubagentStartの `additionalContext` は、トップレベルに書いても無視される。正しくは `hookSpecificOutput` でラップし、`hookEventName` も指定する必要がある：

```python
# 失敗するコード
output = {"additionalContext": "チーム状態の情報..."}

# 成功するコード
output = {
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": "チーム状態の情報..."
  }
}
```

#### agent_typeの値は起動方法で変わる

| 起動方法 | agent_typeの値 |
|---|---|
| Agent Teamsチームメイト | チームメイト名（"verifier", "flow-dev"） |
| 単独サブエージェント（Task tool） | subagent_type（"general-purpose", "Explore"） |

チームメイトだけを対象にしたい場合、`agent_type` が "general-purpose" や "Explore" のリクエストを除外する必要がある。

---

### Hookタイプごとのブロッキング方法の違い（最大の発見）

**Hookタイプによってブロッキング方法が異なり、統一されていない**。これが5フェーズを通じて一番大きな発見だった。

#### PostToolUseではブロックできない

事後Hookのため、警告を出すことしかできず、LLMが従うかは不確実。

#### TaskCompleted / TeammateIdle：exit 2でブロック

依存タスク未完了 → exit 2（ブロック）、解決後 → exit 0（許可）。**LLMの判断に依存しない確定的なフロー保証**。

#### PreToolUse：exit 1では止まらない、JSON decision方式が必要

```python
# 失敗（exit 1方式）→ ツールは素通りで実行される
sys.exit(1)

# 成功（JSON decision方式）→ ブロックされる
print(json.dumps({"decision": "block", "reason": "..."}))
sys.exit(0)  # exit 0で返す点がポイント
```

#### ブロッキング方法一覧

| Hookタイプ | ブロッキング方法 | 効かない方法 |
|---|---|---|
| **PreToolUse** | JSON `{"decision":"block","reason":"..."}` + exit 0 | exit 1は無効 |
| **TaskCompleted** | exit 2 + stderr | JSON decisionは使えない |
| **TeammateIdle** | exit 2 + stderr | JSON decisionは使えない |
| **SubagentStop** | ドキュメント記載あり（未検証） | — |
| **PostToolUse** | ブロック不可（事後Hook） | — |
| **SubagentStart** | ブロック不可（注入専用） | — |
| **UserPromptSubmit** | exit 2で可能（リード専用） | チームメイトでは発火しない |

**exit codeを使うHookとJSON decisionを使うHookが混在**しているため、新しいHookタイプを使う際は公式ドキュメントのサンプルコードで確認が必要。

#### PreToolUseのtool_inputにはcontentまで含まれる

`file_path` だけでなく `content`（書き込み内容）まで含まれるため、以下が事前検査可能：
- **何回書いたか** — 予算管理
- **何を書くか** — 内容検査・セキュリティチェック
- **どのファイルに書くか** — 競合検知・ロック確認

---

### 永続化とリカバリ

チームメイトはセッション終了で全消失する問題への対処。

#### SubagentStop Hookの固有フィールド

`agent_transcript_path` でチームメイトの全会話履歴（JSONL）へのパスが取得でき、このフィールドは SubagentStop だけが持つ。

#### 停止シーケンスの発火順序

1. **SubagentStop**（stop_hook_active=false）
2. **TeammateIdle** → ブロックされた場合、チームメイトが追加作業
3. **SubagentStop**（stop_hook_active=true）再発火
4. **TeammateIdle** → 許可

`stop_hook_active` フラグで初回停止時だけスナップショットを取る等の条件分岐が可能。

#### スナップショットと復旧

- **SubagentStop Hook**（snapshot_on_stop.py）：チーム状態をJSONで保存（transcript_pathも含む）
- **SessionStart Hook**（team_recovery.py）：次セッション開始時にスナップショットを読み、未完了タスクがあればリードに復旧手順を注入

完全自動ではないが、**何を復旧すべきかの情報が失われない**点が重要。

---

### 設計の5案中4案を間違えた

| 機能 | 設計段階のHook | 実験後の正解 | 理由 |
|---|---|---|---|
| 記憶保護 | UserPromptSubmit | **SubagentStart** | チームメイトでは発火しない |
| フロー保証 | PostToolUse | **TaskCompleted** | 事後Hookではブロック不可 |
| コスト制御 | PostToolUse | **PreToolUse** | 事後Hookではブロック不可 |
| 競合防止 | PostToolUse(Edit\|Write) | **PreToolUse(Edit\|Write)** | 編集後では遅い |
| 状態スナップショット | PostToolUse + SessionStart | **SubagentStop + SessionStart** | 専用Hookで簡素化 |

最大の変化は**ソフトガード（警告をLLMに従ってもらう）からハードブロック（確定的な制御）への転換**。

---

### 結論：推奨Hookマッピング

| 課題 | 推奨Hook | 確実性 |
|---|---|---|
| フロー保証（タスク完了ゲート） | TaskCompleted (exit 2) | **確定的** |
| コスト制御 | PreToolUse (JSON decision) | **確定的** |
| 競合防止 | PreToolUse(Edit\|Write) (JSON decision) | **確定的** |
| idle前品質チェック | TeammateIdle (exit 2) | **確定的** |
| 記憶保護（チームメイト） | SubagentStart (additionalContext) | 起動時のみ |
| 記憶保護（リード） | UserPromptSubmit | 毎ターン |
| 状態スナップショット | SubagentStop | 停止時 |
| セッション復旧 | SessionStart | 起動時 |

Agent Teamsの並列作業能力はそのまま活かし、**Hooksでフロー保証・コスト制御・品質ゲート・状態永続化を確定的に補う構成**。

### 残課題

- **大規模チームの性能**：5名以上のチームでのHookオーバーヘッドは未測定
- **Compaction Shieldの完全性**：SubagentStartは起動時のみ注入。長時間作業中のCompactionには非対応
- **SubagentStopのブロッキング検証**：exit 2/JSON decisionでのブロック可否は未検証
- **PreToolUseのチームメイト識別**：入力に `teammate_name` がないため、チームメイト別の予算管理は現状不可

### 実験環境

| 項目 | 値 |
|---|---|
| モデル | Claude Opus 4.6 |
| OS | macOS (Darwin 25.1.0) |
| Agent Teams | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
| 既存Hook数 | 5（SessionStart ×1, UserPromptSubmit ×1, PostToolUse ×3） |
| 実験日 | 2026-02-08 |

### 参考

- [storehero氏 Agent Teams実践レビュー](https://zenn.dev/storehero/articles/f21d49387577bb)
- [nrs氏 Agent Teams実践レビュー](https://zenn.dev/nrs/articles/68840349bbdd8c)
- [Claude CodeのHooksをハックして自律駆動するマルチエージェントを作った](https://zenn.dev/zaico/articles/d6b882c78fe4b3)
- [Claude Code Hooks Reference（公式）](https://docs.anthropic.com/en/docs/claude-code/hooks)