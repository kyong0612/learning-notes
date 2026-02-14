---
title: "元GitHub CEOのドムケ氏、AI時代の開発プラットフォーム「Entire CLI」をオープンソースで公開。すべてのコンテキストをGitに保存"
source: "https://www.publickey1.jp/blog/26/github_ceoaientire_cligit.html"
author: "Junichi Niino（新野淳一）"
published: 2026-02-12
created: 2026-02-14
description: "元GitHub CEOのトーマス・ドムケ氏が新会社Entireを立ち上げ、AIエージェントと人間の協業における開発コンテキストをすべてGitに自動記録するCLIツール「Entire CLI」をオープンソースで公開。コードレビューの改善やトレーサビリティ向上を目指す。"
tags:
  - "clippings"
  - "AI"
  - "開発ツール"
  - "Git"
  - "オープンソース"
  - "AIエージェント"
  - "Entire CLI"
  - "コンテキスト管理"
  - "CLI"
  - "トレーサビリティ"
  - "Agent Trace"
---

## 概要

2025年8月にGitHub CEOを退任した**トーマス・ドムケ（Thomas Dohmke）氏**が、新会社**Entire**を立ち上げ、AI時代の開発プラットフォーム「**Entire CLI**」をオープンソースで公開した。Entire CLIは、人間とAIエージェントの協業における**すべての開発コンテキスト（対話内容・プロンプト・変更ファイル・使用トークン等）をGitに自動記録**するCLIツールである。

- **リポジトリ**: [github.com/entireio/cli](https://github.com/entireio/cli)（MITライセンス）
- **GitHub Stars**: 約2,200以上

---

## Entire CLIの核心的な特徴

### コンテキストの自動保存

Entire CLIはGitワークフローにフックし、AIエージェントもしくは人間がコードをコミットする場面（またはエージェントのレスポンスごと）を**「Checkpoint」**という単位で区切る。各Checkpointで以下の情報を自動取得する：

- 人間とAIの**対話内容（トランスクリプト）**
- **プロンプト**
- **参照・変更されたファイル**
- **呼び出されたツール**
- **使用されたトークン数**

これらのメタデータはコードブランチとは別の `entire/checkpoints/v1` ブランチにプッシュされるため、**コードの履歴には一切影響を与えない**。

### 実現できること

| 機能 | 説明 |
|------|------|
| **コード変更の理由の理解** | プロンプト→レスポンス→コミットの完全なトランスクリプトを確認可能 |
| **即座のリカバリ** | エージェントが暴走した場合、既知の正常なCheckpointに巻き戻して再開 |
| **Gitヒストリーの保全** | エージェントのコンテキストは別ブランチに保存 |
| **オンボーディング高速化** | プロンプト→変更→コミットの過程を新メンバーに提示可能 |
| **トレーサビリティの維持** | 監査・コンプライアンス要件への対応 |

---

## 仕組み（アーキテクチャ）

```
Your Branch                    entire/checkpoints/v1
│                                  │
▼                                  │
[Base Commit]                      │
│                                  │
│  ┌─── Agent works ───┐          │
│  │  Step 1           │          │
│  │  Step 2           │          │
│  │  Step 3           │          │
│  └───────────────────┘          │
│                                  │
▼                                  ▼
[Your Commit] ────────────────► [Session Metadata]
│                           (transcript, prompts,
│                            files touched)
▼
```

- **Session**: AIエージェントとのやり取りの開始から終了までの一連の操作を表す単位
- **Checkpoint**: セッション内の「セーブポイント」。巻き戻し可能な時点のスナップショット

---

## 2つのキャプチャ戦略（Strategy）

| 項目 | Manual-Commit（デフォルト） | Auto-Commit |
|------|---------------------------|-------------|
| コードコミット | 自分のブランチに影響なし | エージェント応答ごとに自動作成 |
| mainブランチでの安全性 | 安全 | 注意が必要（アクティブブランチにコミット作成） |
| 巻き戻し | 常に可能、非破壊的 | フィーチャーブランチでは完全巻き戻し、mainではログのみ |
| 推奨用途 | ほとんどのワークフロー | 自動コードコミットを望むチーム |

---

## クイックスタート

```shell
# Homebrew経由でインストール
brew tap entireio/tap
brew install entireio/tap/entire

# またはGo経由でインストール
go install github.com/entireio/cli/cmd/entire@latest

# プロジェクトで有効化
cd your-project && entire enable

# ステータス確認
entire status
```

### 主要コマンド

| コマンド | 説明 |
|---------|------|
| `entire enable` | リポジトリでEntireを有効化 |
| `entire disable` | フックの削除 |
| `entire status` | 現在のセッション・戦略情報を表示 |
| `entire rewind` | 前のCheckpointに巻き戻し |
| `entire resume` | ブランチに切り替え、最新のCheckpointからセッションを復元 |
| `entire explain` | セッションやコミットの説明を表示 |
| `entire doctor` | スタックしたセッションの修復・クリーンアップ |
| `entire reset` | シャドウブランチとセッション状態の削除 |

---

## 対応AIエージェント

| エージェント | 対応状況 |
|-------------|---------|
| **Claude Code** | 対応済み |
| **Gemini CLI** | 対応済み（プレビュー） |
| Codex | 対応予定 |
| Cursor CLI | 対応予定 |
| その他AIエージェント | 対応予定 |

※ Claude CodeとGemini CLIの両方のフックを同時に有効化することも可能。

---

## 追加機能

- **Git Worktree対応**: 各worktreeで独立したセッショントラッキングが可能
- **複数セッション同時実行**: 同一コミットで複数AIセッションを並行実行可能（警告表示あり）
- **自動サマリー生成**: コミット時にAIが意図・結果・学び・課題をまとめたサマリーを自動生成（要Claude CLI）
- **アクセシビリティ対応**: `ACCESSIBLE=1` 環境変数でスクリーンリーダー対応モード

---

## 背景と業界動向

生成AIによる開発では、コードの理解と共有のために**コンテキストの保存**が重要な課題となっている。CursorやCognitionらが先日提唱した「**Agent Trace**」と呼ばれる標準実装もこの分野の取り組みの一つであり、Entire CLIも同様の課題を解決するアプローチである。

> 参考: [そのコードのその行をどのようにAIが生成し、なぜ変更されたのか。コードのコンテキスト履歴を記録する標準「Agent Trace」。Cursor、Cognition、Google Julesらが提唱](https://www.publickey1.jp/blog/26/aiagent_tracecursorcognitiongoogle_jules.html)

---

## 所感

- 元GitHub CEOという経歴を活かし、**Gitを中心としたAI開発のトレーサビリティ基盤**という明確なポジショニングを取っている
- コードの履歴に影響を与えず別ブランチにメタデータを保存する設計は、既存ワークフローへの導入障壁が低い
- Agent Traceなどの標準化の動きと合わせて、AI時代のコード管理・レビュー・監査の在り方が急速に進化している分野
- 現時点でClaude CodeとGemini CLIの2つに対応しており、今後Cursor CLIやCodexなどへの対応拡大が注目される
