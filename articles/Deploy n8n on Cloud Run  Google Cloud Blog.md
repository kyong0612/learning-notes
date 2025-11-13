---
title: "Deploy n8n on Cloud Run | Google Cloud Blog"
source: "https://cloud.google.com/blog/topics/developers-practitioners/deploy-n8n-on-cloud-run/?hl=en"
author:
  - "[[Ryan Pei]]"
published: 2025-11-08
created: 2025-11-13
description: "With just a few commands, you can deploy n8n to Cloud Run and have it up and running, ready to supercharge your business with AI workflows that can manage spreadsheets, read and draft emails, and more."
tags:
  - "clippings"
  - "n8n"
  - "Cloud Run"
  - "Google Cloud"
  - "AI workflows"
  - "automation"
  - "Gemini"
  - "Google Workspace"
---

# Easy AI workflow automation: Deploy n8n on Cloud Run

## 概要

n8nは、マルチステップAIエージェント向けの強力で使いやすいワークフロー・自動化ツールです。多くのチームが、シンプルでスケーラブル、かつコスト効率の良いセルフホスティング方法を求めています。わずか数コマンドで、n8nをCloud Runにデプロイし、スプレッドシートの管理、メールの読み取りや作成など、AIワークフローでビジネスを強化できます。

[n8nのドキュメント](https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run)では、公式n8n Dockerイメージをサーバーレスプラットフォームにデプロイし、Cloud SQLに接続して永続的なデータストレージを実現し、エージェントのLLMとしてGeminiを呼び出し、オプションでワークフローをGoogle Workspaceに直接接続する方法が説明されています。

## Cloud Runへのn8nデプロイ（数分で完了）

公式n8nイメージをCloud Runに直接デプロイできます。これにより、管理されたサーバーレス環境が提供され、ゼロから自動スケールしてあらゆるワークロードを処理するため、使用した分だけの支払いとなります。つまり、n8nを積極的に使用していないときは、コンピューティングのコストはかからず、n8nのデータはCloud SQLに永続化されます。

### クイックスタート

Cloud Runでn8nを素早く試すには、次の1コマンドでデプロイできます：

```bash
gcloud run deploy --image=n8nio/n8n \
--allow-unauthenticated \
--port=5678 \
--no-cpu-throttling \
--memory=2Gi
```

これにより、n8nの実行インスタンスが起動し、AIを活用したワークフロー自動化のすべての機能を試すことができます。最初のn8nエージェントをGeminiに接続（「Google Gemini Chat Model」認証情報にGemini APIキーを提供）して、実際に動作を確認できます。

### 本番環境向けの堅牢なセットアップ

実際のワークフローでn8nを使用する準備ができたら、[n8nのドキュメント](https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/#durable-mode)の手順に従って、より堅牢で安全なセットアップ（Cloud SQL、Secrets Managerなどを使用）を実装できます。Terraformスクリプトを使用するか、各gcloudコマンドをステップバイステップで実行できます。

## Google Workspaceツールとの接続

Google Cloudでホスティングする主な利点の1つは、n8nをGoogle Workspaceツールに簡単に接続できることです。[n8nのドキュメント](https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/#optional-enabling-google-workspace-services-as-n8n-tools)では、Google CloudのOAuthを設定する手順が説明されており、n8nワークフローがGmail、Google Calendar、Google DriveなどのGoogleツールを使用して安全にアクセスし、タスクを自動化できます。

### デモ例：メールベースの予約スケジューリング

Cloud Run上のn8nインスタンスが、GmailとGoogle Calendarを使用して、受信トレイに会議リクエストのメールが届いたときに自動的に予約をスケジュールするデモが紹介されています。

このn8nワークフロー内の2つのAIエージェントは、Geminiを呼び出して以下を実行します：

- **Text Classifier**: 受信メールを読み取り、会議の時間を求めているメールを識別
- **Agent**: カレンダーで空き状況を確認し、提案された時間を含む返信を送信

## Cloud RunはすべてのAIアプリに最適

Cloud Runは、すべてのAIアプリケーションのニーズに対応する汎用的で使いやすいランタイムです。エージェントアプリがn8n、[LangChain](https://cloud.google.com/blog/products/ai-machine-learning/deploy-langchain-on-cloud-run-with-langserve)、[ADK](https://google.github.io/adk-docs/deploy/cloud-run/)、またはフレームワークなしで作成されているかに関わらず、Cloud Runにデプロイできます。Cloud Runとn8nのこのコラボレーションは、開発者がインテリジェントアプリケーションを構築・デプロイするプロセスを簡素化するという目標のもう1つの例です。

## 次のステップ

- [Cloud Run](https://cloud.run/)について詳しく読む（または[Webコンソールで試す](https://console.cloud.google.com/run)）
- [n8n](https://n8n.io/)を探索する

## 関連記事

- Achieve better AI-powered code reviews using new memory capabilities on Gemini Code Assist
- ADK architecture: When to use sub-agents versus agents as tools
- Boosting LLM Performance with Tiered KV Cache on Google Kubernetes Engine
- Agent Factory Recap: Build AI Apps in Minutes with Google's Logan Kilpatrick
