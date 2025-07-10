---
title: "日常的にClaude Codeを使うようになって便利だと思ったTips集"
source: "https://zenn.dev/yareyare/articles/99f176a8b1c3a9"
author:
  - "田中太郎"
published: 2025-06-26
created: 2025-07-10
description: |
  Claude Codeを日常的に使う上で便利なTipsをまとめた記事。ショートカットの習得、YOLOモードの活用、設定ファイルの管理、カスタムコマンド、GitHub Issue連携など、作業効率を向上させるための具体的な手法を紹介します。
tags:
  - "Claude Code"
  - "MCP"
  - "Vibe Coding"
  - "Gemini CLI"
  - "Tips"
---

# 日常的にClaude Codeを使うようになって便利だと思ったTips集

この記事は、Claude Codeを日常的に利用する上で役立つTipsをまとめたものです。著者は、Claude Code歴1ヶ月未満ながら、日々の利用で得た知見を共有しています。

## 1. ショートカットとコマンドの習得

作業効率を上げるため、ショートカット (`?`や`/help`で確認可能) を一通り試しておくことが推奨されています。全てを一度に暗記する必要はなく、「こんな機能がある」と知っておくだけで、後々役立ちます。

## 2. YOLOモードのデフォルト利用

毎回パーミッションを尋ねられる手間を省くため、`--dangerously-skip-permissions`フラグを持つYOLOモードをデフォルトで使うことが推奨されています。

```sh
alias yolo="claude --dangerously-skip-permissions"
```

ただし、この設定は個人の開発環境に限定し、業務環境では非推奨です。公式のベストプラクティスでは、セキュリティリスクを最小化するためにDev Containersの利用が推奨されています。

> **公式ドキュメント引用**:
> Letting Claude run arbitrary commands is risky and can result in data loss, system corruption, or even data exfiltration (e.g., via prompt injection attacks). To minimize these risks, use `--dangerously-skip-permissions` in a container without internet access.
> [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

特にインターネット検索やMCP連携はセキュリティリスクが高いため、注意が必要です。

## 3. 定期的な会話のクリア

長い対話が続くとClaudeの出力精度が低下する傾向があるため、作業が一区切りついたタイミングで`/clear`コマンドを実行することが推奨されています。

## 4. 暴走時の対処法

Claude Codeが意図しないコードを生成し続けるなど「暴走」した場合は、`Esc`キーを連打することで現在の処理を中断できます。

## 5. 設定ファイルの見直し

`CLAUDE.md`やカスタムコマンドなどの設定ファイルは、環境や使い方に応じて肥大化しやすいため、定期的に見直し、取捨選択することが重要です。

## 6. 設定ファイルのリポジトリ管理

変更頻度の高い設定ファイルは、Gitリポジトリで管理することが推奨されています。著者はObsidianでMarkdown形式の設定ファイルを管理し、シンボリックリンクで参照する方法を採用しています。

```sh
# CLAUDE.mdのシンボリックリンク
ln <Claude設定保存先のフォルダ>/CLAUDE.md ~/.claude

# カスタムコマンドのシンボリックリンク
md ~/.claude/commands
ln <customコマンド設定保存先のフォルダ>/* ~/.claude/commands/
```

## 7. カスタムコマンドの活用

プロジェクト固有のルールや頻繁に使う処理は、カスタムコマンドとして分離管理することが推奨されています。[awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)などで便利なコマンドが共有されています。

**コマンド例:**

* `pr-review`: 複数のペルソナ（プロマネ、開発者など）でPull Requestをレビューする。
* `visualize`: コードやアーキテクチャを解析し、図を生成する。

## 8. 便利なMCPのユーザースコープ設定

頻繁に利用するMCPは、ユーザースコープ（グローバル設定）に登録すると便利です。

```sh
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp
```

ただし、MCPの多用は意図しない誤動作の原因にもなるため、まずはプロジェクト単位で試し、頻繁に使うものだけを昇格させる運用が安全です。

## 9. コミットメッセージのカスタマイズ

プロジェクトごとにコミットメッセージをカスタマイズすることで、後から履歴を追いやすくなります。著者は「質問」「返信」「コメント」をコミットに含めるプロンプトを利用しています。

```
- commitをする際には以下のtask_reportの内容も最後に付加してください、xmlタグは不要です
<task_report>
Ask: [ユーザーから依頼された内容]
Response: [実際に行った作業の詳細]
Comment:  [作業に対する所感や補足情報]
</task_report>
```

## 10. GitHub Issueベースのタスク管理

Claude Codeの性能を最大限に引き出すには、**"Plan"（Explore + Plan）のフェーズに時間をかけること**が重要です。そのため、タスクをGitHub Issueにまとめてから作業を依頼するスタイルが効果的です。Issueに参考資料や要件、スクリーンショットなどを記載することで、Claudeは正確なコンテキストを把握し、作業の質が向上します。

**Privateリポジトリの注意点:**
ClaudeはPrivateリポジトリ内のアセットに直接アクセスできないため、`curl`コマンドなどを使って一時的にアクセス可能にする指示が必要です。

## 11. 外出先からの利用

`Termius`と`Tailscale`を組み合わせることで、外出先からでもSSH経由でClaude Codeを利用できます。メインマシンはスリープしないように`caffeinate`コマンドなどで設定しておく必要があります。

## 12. `claude.md`ドメイン

`claude.md`というドメインは[公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/overview)にリダイレクトされるため、覚えておくと便利です。

## まとめ

著者が特に効果が高いと感じたTipsは以下の通りです。

* **ショートカットの習得**
* **YOLOモードの活用**
* **CLAUDE.mdの強化**
* **カスタムコマンドの充実**
* **GitHub Issueベースの作業**

これらの改善は個別のTipsではなく、**一連のワークフロー改善プロセス**として機能し、作業の精度と効率を飛躍的に向上させると結論付けられています。

![Gemini CLIのYOLOモード](https://storage.googleapis.com/zenn-user-upload/9659e2df5e92-20250626.png)
