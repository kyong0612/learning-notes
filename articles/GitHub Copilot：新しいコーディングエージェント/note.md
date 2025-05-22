---
title: "GitHub Copilot：新しいコーディングエージェント"
source: "https://github.blog/jp/2025-05-20-github-copilot-meet-the-new-coding-agent/"
author:
  - "Thomas Dohmke"
  - "GitHub JP Blog Author"
published: 2025-05-20
created: 2025-05-22
description: "GitHub Copilot に新機能が追加されました。タスクやIssueの内容をもとに実装できるコーディングエージェントで、GitHub Actionsを使ってバックグラウンドで実行し、その作業をプルリクエストとして提出します。"
tags:
  - "agent mode"
  - "agentic AI"
  - "GitHub Copilot"
---
対象プラン: すべてのGitHub Copilot Enterprise / GitHub Copilot Pro+契約者に提供されます。

## GitHub Copilot：新しいコーディングエージェント

GitHub Copilot に新機能としてコーディングエージェントが追加されました。このエージェントはGitHub Issueを割り当てることで起動し、タスクやIssueの内容に基づいて実装を行います。GitHub Actionsを利用してバックグラウンドで実行され、作業内容はプルリクエストとして提出されます。

### 主な機能と特徴

* **タスクの自動化**: 機能追加、バグ修正、テスト拡充、リファクタリング、ドキュメント改善など、低〜中程度の複雑さのタスクを自動で処理します。
* **GitHub Actionsとの連携**: 安全でカスタマイズ可能な開発環境をGitHub Actions上に自動構築し、作業を行います。
* **進捗の可視化**: エージェントの作業進捗は、エージェントセッションログで随時確認でき、ドラフトプルリクエストへのコミットとしてプッシュされます。
* **セキュリティ**: 既存のセキュリティポリシー（ブランチ保護など）はそのまま適用され、CI/CD実行前に人間によるプルリクエストの承認が必要です。
* **Model Context Protocol (MCP)**: MCPサーバーを設定することで、GitHub外部のデータや機能にもアクセス可能です。
* **視覚モデルの統合**: Issueに添付されたスクリーンショットやモックアップ画像も解析できます。
* **対話的な修正**: レビュアーからの修正依頼コメントを自動的に拾い、コード変更を再提案します。
* **コンテキスト理解**: 関連Issue、プルリクエストの議論、リポジトリのカスタム命令を読み込み、タスクの意図とプロジェクトのコーディング規約を理解します。

![](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/Copilot-Coding-Agent-005.png?fit=1600%2C840)

### 詳細な使い方

1. GitHub IssueにCopilotを割り当てます (github.com, GitHub Mobile, GitHub CLIから可能)。
2. または、GitHub Copilot Chatからプルリクエストを開くよう依頼します (例: `@github Open a pull request to refactor this query generator into its own class`)。
3. Issue割り当て後、エージェントは 👀 リアクションを追加し、バックグラウンドで作業を開始します。
4. GitHub Actionsで仮想マシンを起動、リポジトリをクローン、環境設定、コードベース分析 (GitHubコード検索によるRAG) を行います。
5. 作業中、gitコミットとしてドラフトプルリクエストに変更を定期的にプッシュし、プルリクエストの説明文を更新します。
6. セッションログでエージェントの推論と検証ステップを確認できます。
7. Copilotが作業を終えると、レビュアーとして登録します。

### 統合され、調整可能で安全なエージェント

* **計算環境**: GitHub Actionsをクラウド計算基盤として利用。
* **セキュリティポリシー**:
  * エージェントは自身が作成したブランチにのみプッシュ可能。
  * プルリクエストを開いた開発者はそのPRを承認不可 (必須レビューの遵守)。
  * インターネットアクセスはカスタマイズ可能なリストに制限。
  * GitHub Actionsのワークフローは承認なしに実行されない。
* 既存のリポジトリルールセットや組織ポリシーも適用されます。

![](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/copilot1.png?resize=1241%2C782)
> Copilot コーディングエージェントにより、開発者は自分専用のエージェントチームを並列稼働させ、作業を増幅できます。これまで深く複雑な開発を阻んでいた付帯タスクをエージェントに任せることで、開発者は価値の高いコーディング作業に集中できるようになりました。
>
> *EY社 DevExリード James Zabinski氏*

![](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/copilot2.png?resize=1535%2C1209)
> GitHub Copilot のコーディングエージェントは、私たちのワークフローに無理なく溶け込み、仕様書を数分で本番コードへ変換してくれます。開発速度が上がり、チームはより創造的な作業に集中できるようになりました。
>
> *Carvana社 Engineering and Analytics, Senior Vice President, Alex Devkar氏*

### 今すぐ始めよう

* **対象プラン**: すべてのGitHub Copilot Enterprise / GitHub Copilot Pro+契約者。
* **利用開始**: [リポジトリでエージェントを有効化](https://gh.io/copilot-coding-agent-repository-opt-in)します。Enterpriseの場合は管理者によるポリシー有効化も必要です。
* **IDEサポート**: Xcode、Eclipse、JetBrains IDE、Visual Studioなど、より多くのIDEでエージェントモードが有効化可能。
* **プレミアムリクエスト**: 2025年6月4日以降、エージェントが行うモデルリクエストごとに1つの[プレミアムリクエスト](https://docs.github.com/ja/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests)を使用します。

GitHub Copilotの目的は、開発者を"魔法にかかったようなフロー状態"に保ち、面倒な作業を肩代わりし、創造的な仕事に集中できるようにすることです。

詳細は[こちらのドキュメント（英語）](https://docs.github.com/en/enterprise-cloud%40latest/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/about-assigning-tasks-to-copilot)を参照してください。

---
*1: 2月に発表した際の本機能のコードネーム。詳細は[ブログ参照](https://github.blog/jp/2025-02-07-github-copilot-the-agent-awakens/)
