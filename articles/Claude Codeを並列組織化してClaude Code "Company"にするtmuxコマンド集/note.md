---
title: "Claude Codeを並列組織化してClaude Code \"Company\"にするtmuxコマンド集"
source: "https://zenn.dev/kazuph/articles/beb87d102bd4f5"
author:
  - "kazuph"
published: 2025-06-09
created: 2025-06-11
description: |
  tmuxの複数paneでClaude Codeインスタンスを並列実行し、効率的にタスクを分散処理する方法について解説。複数のClaudeインスタンスを「部下」として管理し、報連相システムを構築することで大規模なタスクを並列処理できる手法を紹介。
tags:
  - tmux
  - claude
  - claudecode
  - 並列処理
  - AI
  - 生産性
  - ターミナル
---

## 概要

この記事では、tmuxの複数paneで複数のClaude Codeインスタンスを並列実行し、効率的にタスクを分散処理する革新的な手法について解説している。著者は複数のClaudeインスタンスを「部下」として扱い、主要なClaudeインスタンス（部長）がタスクを割り振り、部下たちが報連相を行うシステムを構築した。

## 基本セットアップ

### 1. tmux環境の構築

- tmuxセッションを開始
- `claude --dangerously-skip-permissions`で権限スキップオプション付きでClaude Codeを起動（自己責任）
- 複数のpaneに分割して組織構造を構築

**pane分割コマンド（5つのpaneに分割）:**

```bash
tmux split-window -h && tmux split-window -v && tmux select-pane -t 0 && tmux split-window -v && tmux select-pane -t 2 && tmux split-window -v && tmux select-pane -t 4 && tmux split-window -v
```

### 2. pane構成の確認

```bash
tmux list-panes -F "#{pane_index}: #{pane_id} #{pane_current_command} #{pane_active}"
```

各paneには役割が割り当てられる：

- pane 0: メインpane（部長）
- pane 1-5: 部下のClaude Codeインスタンス

### 3. Claude Codeセッションの並列起動

全paneで同時にClaude Codeを起動：

```bash
tmux send-keys -t %27 "cc" && sleep 0.1 && tmux send-keys -t %27 Enter & \
tmux send-keys -t %28 "cc" && sleep 0.1 && tmux send-keys -t %28 Enter & \
tmux send-keys -t %25 "cc" && sleep 0.1 && tmux send-keys -t %25 Enter & \
tmux send-keys -t %29 "cc" && sleep 0.1 && tmux send-keys -t %29 Enter & \
tmux send-keys -t %26 "cc" && sleep 0.1 && tmux send-keys -t %26 Enter & \
wait
```

## タスク管理システム

### タスク割り当て方法

**基本テンプレート:**

```bash
tmux send-keys -t %27 "cd 'ワーキングディレクトリ' && あなたはpane1です。タスク内容。エラー時は[pane1]でtmux send-keys -t %22でメイン報告。" && sleep 0.1 && tmux send-keys -t %27 Enter
```

**並列タスク割り当て例:**

```bash
tmux send-keys -t %27 "タスク1の内容" && sleep 0.1 && tmux send-keys -t %27 Enter & \
tmux send-keys -t %28 "タスク2の内容" && sleep 0.1 && tmux send-keys -t %28 Enter & \
tmux send-keys -t %25 "タスク3の内容" && sleep 0.1 && tmux send-keys -t %25 Enter & \
wait
```

## 報連相システム

### 部下からメインへの報告形式

部下は以下のワンライナーコマンドでメインpaneに報告：

```bash
tmux send-keys -t %22 '[pane番号] 報告内容' && sleep 0.1 && tmux send-keys -t %22 Enter
```

**報告例:**

```bash
tmux send-keys -t %22 '[pane1] タスク完了しました' && sleep 0.1 && tmux send-keys -t %22 Enter
tmux send-keys -t %22 '[pane3] エラーが発生しました：詳細内容' && sleep 0.1 && tmux send-keys -t %22 Enter
```

## トークン管理

### /clearコマンドの実行タイミング

部下は自分で`/clear`できないため、メインが判断して実行する：

**実行タイミングの判断基準:**

- タスク完了時（新しいタスクに集中させるため）
- トークン使用量が高くなった時（`ccusage`で確認）
- エラーが頻発している時（コンテキストをリセット）
- 複雑な作業から単純な作業に切り替える時

**個別クリア:**

```bash
tmux send-keys -t %27 "/clear" && sleep 0.1 && tmux send-keys -t %27 Enter
```

**並列クリア:**

```bash
tmux send-keys -t %27 "/clear" && sleep 0.1 && tmux send-keys -t %27 Enter & \
tmux send-keys -t %28 "/clear" && sleep 0.1 && tmux send-keys -t %28 Enter & \
tmux send-keys -t %25 "/clear" && sleep 0.1 && tmux send-keys -t %25 Enter & \
wait
```

## 状況確認コマンド

### pane状況確認が必要な場面

- 部下が応答しない時（フリーズ、エラー状態の確認）
- 報告内容の詳細確認（エラーメッセージの全文確認）
- 作業状況の客観的把握（進捗の可視化）
- トラブルシューティング時（ログの確認）

**個別pane確認:**

```bash
tmux capture-pane -t %27 -p | tail -10
tmux capture-pane -t %28 -p | tail -10
```

**全pane一括確認:**

```bash
for pane in %27 %28 %25 %29 %26; do
    echo "=== $pane ==="
    tmux capture-pane -t $pane -p | tail -5
done
```

## ベストプラクティス

### 1. 明確な役割分担

- pane番号を必ず伝える
- 担当タスクを具体的に指示
- エラー時の報告方法を明記

### 2. 効率的なコミュニケーション

- ワンライナー形式での報告徹底
- `[pane番号]`プレフィックス必須
- 具体的なエラー内容の報告

### 3. トークン使用量管理

- 定期的な`/clear`実行
- 大量トークン消費の監視
- `ccusage`での使用量確認

### 4. エラー対処

- Web検索による解決策調査を指示
- 具体的エラー内容の共有
- 成功事例の横展開

## 重要な注意事項

- 部下は直接`/clear`できない（tmux経由でのみ可能）
- 報告は必ずワンライナー形式で
- pane番号の確認を怠らない
- トークン使用量の定期確認
- 複雑な指示は段階的に分割
- `--dangerously-skip-permissions`オプションは自己責任で使用
- MAX($100)プランでの使用を推奨（従量課金ユーザーは注意）

## 活用例

### 大規模タスクの分散処理

1. **資料作成**: 各paneで異なる章を担当
2. **エラー解決**: 各paneで異なる角度から調査
3. **知見共有**: 成功事例の文書化と横展開
4. **品質管理**: 並列でのファイル修正と確認

## 技術的特徴

### UI配置

- `Ctrl-b + Space`で色々な整頓された配置に変更可能
- 複数のpaneが整然と配置されたtmux window構成

### 自動化レベル

- 部長が部下にタスクを分解して割り振り
- 部下が自動的に報連相を実行
- エラー時の自動報告システム

## 結論

このシステムにより、複数のClaude Codeインスタンスを効率的に管理し、大規模タスクの並列処理が可能になる。従来の単一Claudeインスタンスでの作業と比較して、複数タスクの同時実行により生産性が大幅に向上する。ただし、トークン使用量の管理と適切な報連相システムの構築が成功の鍵となる。
