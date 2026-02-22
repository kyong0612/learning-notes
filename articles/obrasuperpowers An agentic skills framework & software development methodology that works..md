---
title: "obra/superpowers: An agentic skills framework & software development methodology that works."
source: "https://github.com/obra/superpowers"
author:
  - "[[Jesse Vincent (obra)]]"
published: 2025-10-09
created: 2026-02-22
description: "AIコーディングエージェントに構造化されたソフトウェア開発ワークフロー（ブレインストーミング→設計→計画→TDD実装→コードレビュー）を自動適用する、コンポーザブルなスキルフレームワーク。Claude Code、Cursor、Codex、OpenCodeに対応。"
tags:
  - "clippings"
  - "AI"
  - "coding-agents"
  - "skills-framework"
  - "TDD"
  - "Claude"
  - "software-development"
  - "subagent"
---

## 概要

**Superpowers** は、AIコーディングエージェント（Claude Code、Cursor、Codex、OpenCode）に対して、構造化されたソフトウェア開発ワークフローを自動的に適用するオープンソースのスキルフレームワークである。作者は Jesse Vincent（GitHub: obra）。コンポーザブルな「スキル」と初期指示の組み合わせにより、エージェントが自動的にベストプラクティスに従って開発を進める仕組みを提供する。

- リポジトリ: https://github.com/obra/superpowers
- ブログ記事: https://blog.fsck.com/2025/10/09/superpowers/
- ライセンス: MIT

## コアワークフロー

Superpowersの基本的な開発フローは以下の7ステップで構成される。**これらはスキルとして自動的にトリガーされ、任意のサジェスチョンではなく強制的なワークフローとして機能する。**

1. **brainstorming** — コード記述前に起動。ソクラテス式の対話でアイデアを洗練し、代替案を探索。設計を検証可能なセクションごとに提示し、設計ドキュメントを保存する。
2. **using-git-worktrees** — 設計承認後に起動。新しいブランチで分離されたワークスペースを作成し、プロジェクトセットアップを実行、クリーンなテストベースラインを確認する。
3. **writing-plans** — 承認された設計をもとに起動。作業を2〜5分単位のタスクに分割。各タスクにはファイルパス、完全なコード、検証ステップを含む。
4. **subagent-driven-development / executing-plans** — 計画をもとに起動。タスクごとに新しいサブエージェントを派遣し、2段階レビュー（仕様準拠→コード品質）を行う。または、人間のチェックポイント付きでバッチ実行する。
5. **test-driven-development** — 実装中に起動。RED-GREEN-REFACTORサイクルを厳格に適用：失敗するテストを書く→失敗を確認→最小限のコードで通す→通過を確認→コミット。テスト前に書かれたコードは削除する。
6. **requesting-code-review** — タスク間で起動。計画に対してレビューし、深刻度別に問題を報告。Critical な問題は進行をブロックする。
7. **finishing-a-development-branch** — タスク完了時に起動。テストを検証し、マージ/PR/保持/破棄のオプションを提示、ワークツリーをクリーンアップする。

## スキルライブラリ

### テスト
- **test-driven-development** — RED-GREEN-REFACTORサイクル（テスティングアンチパターンリファレンスを含む）

### デバッグ
- **systematic-debugging** — 4フェーズのルートコーズ分析プロセス（root-cause-tracing、defense-in-depth、condition-based-waiting技法を含む）
- **verification-before-completion** — 実際に修正されたことを確認する

### コラボレーション
- **brainstorming** — ソクラテス式の設計洗練
- **writing-plans** — 詳細な実装計画の作成
- **executing-plans** — チェックポイント付きバッチ実行
- **dispatching-parallel-agents** — 並行サブエージェントワークフロー
- **requesting-code-review** — レビュー前チェックリスト
- **receiving-code-review** — フィードバックへの対応
- **using-git-worktrees** — 並行開発ブランチ
- **finishing-a-development-branch** — マージ/PR判断ワークフロー
- **subagent-driven-development** — 2段階レビュー付き高速イテレーション

### メタ
- **writing-skills** — ベストプラクティスに従ったスキル作成（テスト方法論を含む）
- **using-superpowers** — スキルシステムの導入ガイド

## 仕組みの詳細（ブログ記事より）

### ブートストラップの仕組み

プラグインインストール後、セッション開始時に以下のようなプロンプトが注入される：

```
<session-start-hook><EXTREMELY_IMPORTANT>
You have Superpowers.
RIGHT NOW, go read: @/.claude/plugins/cache/Superpowers/skills/getting-started/SKILL.md
</EXTREMELY_IMPORTANT></session-start-hook>
```

このブートストラップにより、Claude は以下を学習する：
1. あるアクティビティに対応するスキルがあれば、必ずそれを使用すること
2. スクリプトを実行してスキルを検索し、スキルファイルを読んで指示に従うこと
3. スキルがスーパーパワーを与えること

### スキルの自動テスト（説得心理学の応用）

スキル作成時、サブエージェントに対して「圧力テスト」シナリオを実行し、スキルが確実に遵守されるかを検証する。これは Robert Cialdini の著書 *Influence* に基づく説得原理をLLMに適用したものである。

**シナリオ例：時間的プレッシャー + 自信**
> 本番環境がダウン中。1分あたり$5kの損失。認証サービスのデバッグが必要。すぐにデバッグを始めるか、まずスキルを確認するか？

**シナリオ例：サンクコスト + 既に動作する解決策**
> 45分かけて非同期テストインフラを構築済み。動作する。コミットするか、先にスキルを確認するか？

Dan Shapiro との共同研究により、Cialdini の説得原理がLLMにも科学的に有効であることが証明された。

### メモリシステム（開発中）

`remembering-conversations` スキルにより、過去の全会話の記憶をClaudeに提供する機能が計画されている：
- 会話ログの外部保存（Anthropicによる自動削除を回避）
- SQLiteデータベースのベクトルインデックス
- Claude Haiku による要約生成
- サブエージェントを通じた検索（コンテキストウィンドウの汚染防止）

## フィロソフィー

| 原則 | 内容 |
|------|------|
| **Test-Driven Development** | テストを常に先に書く |
| **Systematic over ad-hoc** | 推測よりプロセスを重視 |
| **Complexity reduction** | シンプルさを最優先目標とする |
| **Evidence over claims** | 成功を宣言する前に検証する |

## インストール方法

### Claude Code
```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### Cursor
```
/plugin-add superpowers
```

### Codex
```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md
```

### OpenCode
```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

## 今後の展望

- **スキル共有機能**: ユーザーが独自に作成したスキルをGitHub PRを通じてコミュニティと共有する仕組み（ユーザーの同意なしに共有されないよう設計）
- **メモリシステムの完成**: 過去の会話記憶の検索・活用機能の統合

## 関連リソース

- [Microsoft Amplifier](https://github.com/microsoft/amplifier) — 同様のパターンを持つ統合開発フレームワーク。エージェントがmarkdownドキュメントやツールを自己作成することで自己改善する
- [Superpowers for Claude Code（ブログ記事）](https://blog.fsck.com/2025/10/09/superpowers/)
- [How I'm using coding agents in September 2025](https://blog.fsck.com/2025/10/05/how-im-using-coding-agents-in-september-2025/)
- [Claude Memory Extractor](https://github.com/obra/claude-memory-extractor)
