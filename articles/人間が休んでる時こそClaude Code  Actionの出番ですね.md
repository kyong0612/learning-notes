---
title: "人間が休んでる時こそClaude Code  Actionの出番ですね"
source: "https://zenn.dev/r_kaga/articles/731fe4636289dc"
author:
  - "r.kagaya"
published: 2025-07-09
created: 2025-07-09
description: |
  Claude Code Actions(CCA)がMaxプランで利用可能になったことを受け、日中の利用制限を回避するために、夜間にGitHub Actionsを利用して自動でIssueを処理させる仕組みを構築するアプローチについて解説しています。
tags:
  - "clippings"
  - "actions"
  - "llm"
  - "生成ai"
  - "claudecode"
  - "tech"
---

この記事では、AnthropicのClaude Code Actions（CCA）を効率的に活用するための自動化手法について解説しています。

## 概要

Claude Code ActionsがMaxプランで利用可能になりましたが、日中の利用制限が課題となります。この問題を解決するため、筆者は「人間が寝ている間にCCAを自動で動かす」というコンセプトのもと、夜間にGitHub Actionsを利用して自動でIssueを処理する仕組みを構築しました。

## 主な課題と解決策

* **課題**: Maxプランの利用制限により、日中にCCAを多用するとすぐに上限に達してしまう可能性がある。
* **解決策**: 夜間（23時〜6時）にGitHub Actionsを30分ごとに定期実行し、優先度順に未処理のIssueをCCAに依頼する。これにより、日中の利用枠を温存しつつ、開発を自動で進める「不労コード生活」を目指す。

## 実装の詳細

筆者は、以下の機能を持つGitHub Actionsワークフローを作成しました。

1. **夜間の定期実行**: UTC 14:00-21:00（JST 23:00-06:00）の間に30分ごとにワークフローを起動します。
2. **優先度順にIssueを選択**: `high` → `middle` → `low` の優先度ラベルが付いた未処理のIssueを1つ選択します。
3. **CCAの自動トリガー**: 選択したIssueに対し、`@claude` メンションを含むコメントを自動で投稿し、CCAを起動させます。
4. **重複処理の防止**: 処理を依頼したIssueには `claude-code-requested` というラベルを付与し、重複して依頼が行われるのを防ぎます。

![](https://storage.googleapis.com/zenn-user-upload/d78a7b088c69-20250709.png)

### 将来の展望

さらに、この仕組みを拡張するアイデアとして、以下の点が挙げられています。

* **Slack連携によるIssue自動作成**: 特定のSlackチャンネル（例：エラーログ用チャンネル）のメッセージを監視し、LLMで内容を解析・分解して自動でIssueを作成する。これにより、エラーが自動で修正される世界の実現が期待されます。
* **レビューとデプロイの自動化**: 個人開発リポジトリのPRプレビュー環境と組み合わせ、朝起きたら動作確認とマージを行うだけで済む状態を目指す。

## まとめ

この記事で紹介されているのは、CCAを夜間に自動実行させることで、開発者の時間と労力を節約し、開発プロセスを効率化するための具体的なアプローチです。簡単なGitHub Actionsの設定で「不労コード生活」の第一歩を踏み出せる可能性を示唆しています。

![](https://storage.googleapis.com/zenn-user-upload/577287a62362-20250709.png)
