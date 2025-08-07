---
title: "AI コーディングの新たなパートナー：Gemini CLI GitHub Actions を発表 | Google Cloud 公式ブログ"
source: "https://cloud.google.com/blog/ja/topics/developers-practitioners/introducing-gemini-cli-github-actions?utm_source=twitter&utm_medium=unpaidsoc&utm_campaign=fy25q3-googlecloud_jp-blog-next_event-in_feed-no-brand-regional-apac&utm_content=introducing-gemini-cli-github-actions&utm_term=-"
author:
  - "Jerop Kipruto"
  - "Ryan J. Salva"
published: 2025-08-06
created: 2025-08-07
description: |
  Gemini CLI GitHub Actions は、リポジトリで無料利用できる強力なAIコーディングパートナーです。定型作業を自動化する自律型エージェントとして、またはオンデマンドの協力者として開発チームを支援します。
tags:
  - "Gemini"
  - "GitHub Actions"
  - "AI"
  - "DevOps"
  - "Google Cloud"
---

## 概要

Googleは、開発者のワークフローを強化するため、**Gemini CLI GitHub Actions**を発表しました。これは、GitHubリポジトリ上で動作する強力なAIコーディングパートナーであり、無料で利用可能です。自律型エージェントとして定型作業を自動化したり、必要なときに協力者として開発チームを支援したりします。

![https://storage.googleapis.com/gweb-cloudblog-publish/images/Gemini_CLI_GitHub_Actions_.max-1900x1900.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/Gemini_CLI_GitHub_Actions_.max-1900x1900.png)

## 主な機能とワークフロー

Gemini CLI GitHub Actionsは、個人のターミナルで利用するGemini CLIとは異なり、チームでのコラボレーションを目的として設計されています。新たなイシューやプルリクエストをトリガーに、プロジェクト全体のコンテキストを理解し、バックグラウンドでタスクを自動処理します。

提供される主要な3つのオープンソースワークフローは以下の通りです。

1. **インテリジェントなイシューの振り分け**:
    * 新しいイシューの内容をGemini CLIが分析し、自動でラベリングや優先順位付けを行います。
    * これにより、開発チームは管理負担を軽減し、重要な業務に集中できます。
    * ![イシューの自動ラベリング](https://storage.googleapis.com/gweb-cloudblog-publish/images/CLI_Label.max-2000x2000.png)

2. **プルリクエストレビューの迅速化**:
    * コード変更に対して、即座に洞察に富んだフィードバックを提供します。
    * 品質、スタイル、正確性などをレビューするため、レビュー担当者はより複雑な意思決定に注力できます。
    * ![プルリクエストのレビュー](https://storage.googleapis.com/gweb-cloudblog-publish/images/CLI_Pull_Request.max-1200x1200.png)

3. **オンデマンドでの共同作業**:
    * イシューやプルリクエスト内で `@gemini-cli` にメンションするだけで、テスト作成、変更実装、代替案検討などの作業を依頼できます。
    * ![オンデマンド作業](https://storage.googleapis.com/gweb-cloudblog-publish/images/CLI_Comment.max-2000x2000.png)

これらのワークフローはカスタマイズ可能で、独自のワークフローを作成することもできます。

## セキュリティと制御

エンタープライズレベルの利用を想定し、セキュリティと柔軟性が最優先で設計されています。

* **セキュアな認証**:
  * Google CloudのWorkload Identity Federation (WIF) を活用し、APIキーを長期的に保持する必要がなく、認証情報漏洩のリスクを低減します。
* **きめ細かな制御**:
  * コマンド許可リストにより、エージェントが実行できるシェルコマンドを明示的に承認できます。
  * エージェント専用のカスタムIDを作成し、最小権限の原則を徹底できます。
* **完全な可視化**:
  * 業界標準の[OpenTelemetry](https://opentelemetry.io/)と統合されており、ログやメトリクスをGoogle Cloud Monitoringなどのプラットフォームで監視できます。

## 利用開始方法

Gemini CLI GitHub Actionsは現在ベータ版として[提供開始](https://github.com/google-github-actions/run-gemini-cli)されており、Google AI Studioの無料利用枠で利用できます。Vertex AIおよびGemini Code AssistのStandard / Enterpriseプランもサポートしています。

利用を開始するには、`Gemini CLI 0.1.18`以降を[ダウンロード](https://github.com/google-gemini/gemini-cli)し、`/setup-github`を実行します。

---

*This article is a summary of the post by Jerop Kipruto (Senior Software Engineer) and Ryan J. Salva (Senior Director, Product Management) on the Google Cloud Blog.*
