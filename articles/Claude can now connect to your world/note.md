# Claudeがあなたの世界と接続可能に

* **発表日:** 2025年5月1日
* **参照元:** [Anthropic News](https://www.anthropic.com/news/integrations)

![二つの手がオレンジ色の背景に対して幾何学的な形状を持っているイラスト](/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2Fec8976a7674079bc47d3eb5a2f08d23d58993a5b-2881x1621.png&w=3840&q=75)

## 概要

Anthropicは、Claudeをユーザーのアプリやツールに接続するための新しい方法「**Integrations**」を発表しました。同時に、Claudeの**Research**機能を拡張し、Web検索、Google Workspaceに加えて、新たにIntegrationsも検索対象とする**Advanced Research**モードを導入しました。これにより、Claudeは最大45分間の調査を行い、引用付きの包括的なレポートを提供できます。また、Web検索機能は有料プランの全ユーザーにグローバルで提供されます。

## Integrations

* **背景:** 2024年11月に発表されたオープンスタンダード「[Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol)」は、AIアプリをツールやデータに接続するものです。これまでMCPのサポートはローカルサーバー経由のClaude Desktopに限定されていました。
* **新機能:** Integrationsにより、ClaudeはWeb上およびデスクトップアプリのリモートMCPサーバーとシームレスに連携できるようになります。開発者はClaudeの機能を拡張するサーバーを構築・ホストでき、ユーザーは任意の数のサーバーをClaudeに接続できます。
* **メリット:** ツールをClaudeに接続することで、Claudeはプロジェクト履歴、タスク状況、組織知識などの深いコンテキストを理解し、あらゆる場面でアクションを実行できるようになります。これにより、Claudeはより情報に基づいた協力者となり、複雑なプロジェクトを一つの場所で、各ステップで専門的な支援を受けながら実行する手助けをします。
* **初期対応サービス:** 以下の10の人気サービスに対応するIntegrationsが利用可能です（今後、StripeやGitLabなども追加予定）：
  * [Atlassian Jira & Confluence](https://www.atlassian.com/platform/remote-mcp-server)
  * [Zapier](https://zapier.com/mcp)
  * [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare/tree/main)
  * [Intercom](https://www.intercom.com/blog/introducing-model-context-protocol-fin)
  * [Asana](https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server)
  * [Square](https://developer.squareup.com/docs/mcp)
  * [Sentry](https://docs.sentry.io/product/sentry-mcp/)
  * [PayPal](https://www.paypal.ai/)
  * [Linear](https://linear.app/changelog/2025-05-01-mcp)
  * [Plaid](https://api.dashboard.plaid.com/mcp/sse)
* **開発者向け:** 開発者はドキュメントやCloudflareのようなソリューション（組み込みOAuth認証、トランスポート処理、統合デプロイメントを提供）を利用して、最短30分で独自のIntegrationsを作成できます。
* **活用例:**
  * **Zapier:** 数千のアプリを接続し、ソフトウェアスタック全体でプロセスを自動化。Claudeは会話を通じてこれらのアプリやカスタムワークフローにアクセスし、HubSpotから売上データを自動的に取得してカレンダーに基づいて会議の概要を作成できます。
        *(Zapier提供の画像が表示されていました)*
  * **Atlassian (Jira & Confluence):** 新製品の構築、タスク管理の効率化、複数のConfluenceページやJira作業項目を一度に要約・作成することによる作業のスケールアップで協力できます。
        *(Atlassian提供の画像が表示されていました)*
  * **Intercom:** ユーザーフィードバックへの迅速な対応。IntercomのAIエージェントFin（MCPクライアント）は、ユーザーが問題を報告した際にLinearでバグを登録するなどのアクションを実行できます。Claudeとのチャットで、Intercomの会話履歴とユーザー属性を使用してパターンを特定しデバッグを行い、ユーザーフィードバックからバグ解決までのワークフロー全体を一つの会話で管理できます。
        *(Intercom提供の画像が表示されていました)*

## Advanced Research

* **機能拡張:** 最近リリースされた[Research](https://www.anthropic.com/news/research)機能を基盤とし、さらに強化されました。Claudeは数百の内部および外部ソースにわたってより深い調査を実施し、5分から45分の範囲でより包括的なレポートを提供できるようになりました。
* **プロセス:** Researchボタンをオンにすると利用可能なこの高度な機能では、Claudeはリクエストを小さな部分に分解し、それぞれを深く調査してから包括的なレポートを編集します。ほとんどのレポートは5分から15分で完了しますが、より複雑な調査では最大45分かかる場合があります（これは通常、数時間の手動調査が必要な作業に相当します）。
* **データアクセス拡張:** これまでのWeb検索とGoogle Workspaceに加え、Integrationsにより、接続した任意のアプリケーションも検索対象となりました。
* **透明性:** Claudeが情報源から情報を取り込む際、元の資料に直接リンクする明確な引用を提供します。これにより、各インサイトの出典を正確に把握し、Claudeの調査結果を自信を持って利用できます。

## 利用開始方法

* **提供状況:**
  * IntegrationsとAdvanced Researchは現在、Max、Team、Enterpriseプランで**ベータ版**として利用可能です（Proプランでも近日提供予定）。
  * Web検索は、すべての[Claude.ai](http://claude.ai)有料プランでグローバルに利用可能です。
* **詳細情報:** Integrations、MCPサーバーの開始方法、データソースをClaudeに接続する際のセキュリティとプライバシー慣行については、[ヘルプセンター](https://support.anthropic.com/en/articles/11175166-about-integrations-using-remote-mcp)を参照してください。

## 重要な結論・発見

* Claudeは「Integrations」を通じて外部アプリやツールと連携できるようになり、より強力な協力者となります。
* 「Advanced Research」機能により、Web、Google Workspace、接続されたIntegrationsを含む広範なソースから、より深く、時間をかけた（最大45分）調査とレポート作成が可能になりました。
* Web検索機能がすべての有料プランユーザーにグローバル展開されました。
* これらの機能は、ユーザーがClaudeをより実用的なタスク（プロジェクト管理、データ分析、顧客対応など）に活用する道を開きます。

## 制限事項

* IntegrationsとAdvanced Researchは現在**ベータ版**であり、Max、Team、Enterpriseプランでのみ利用可能です（Proプランは近日対応）。
