---
title: "Model Context Protocol (MCP) マーケットプレイス"
source: "https://docs.devin.ai/work-with-devin/mcp"
author:
  - "[[Devin Docs]]"
published:
created: 2025-07-24
description: |
  MCPは、Devinが数百もの外部ツールやデータソースを利用できるようにするオープンプロトコルです。MCPにより、Devinはログの調査、データベースへのクエリ、ドキュメント作成、そしてFigmaやStripeなどの様々なプラットフォームとの連携が可能になります。
tags:
  - "MCP"
  - "Devin"
  - "Integration"
  - "API"
  - "Tool"
---
# Model Context Protocol (MCP) マーケットプレイス

MCPは、Devinが数百もの外部ツールやデータソースを利用できるようにするオープンプロトコルです。Devinは、stdio、SSE、HTTPの3つの転送方式をサポートしています。

## なぜMCPを使用するのか？

MCPを使用すると、Devinは以下のことを支援できます：

* DatadogやSentryのログを調査する
* データベースにクエリを投げて質問に答えたり、チャートやその他の分析を作成する
* Notionドキュメント、Googleドキュメント（Zapier経由）、Linearチケットを作成する
* Figma、Airtable、Stripe、Hubspotからコンテキストを取得し、連携する
* その他多数！

## MCPをはじめよう

[設定 > MCPマーケットプレイス](https://app.devin.ai/settings/mcp-marketplace)に移動してMCPを有効にします。
もし探しているMCPがマーケットプレイスにない場合でも、「独自追加」オプションを選択して設定できます！

MCPを有効にしたら、次のようなプロンプトで連携をテストしてください：

`[MCP_NAME] MCP連携のテストを手伝ってください。いくつかの機能（例：データの取得と取得したデータのサンプルスニペットの共有）の使い方を実演してください。提供されるすべての機能を要約してください。`

CognitionチームがMCPと共にDevinをどのように使用しているかをご覧ください：
[データアナリストとして、またDatadog、Sentry、Linear、Figma、Google Sheetsといったツールと共にDevinをどのように使用しているかをご覧ください。](/use-cases/tutorials/mcp-use-cases)

## 設定のヒント

OAuthで認証するMCPの場合、Devinはアカウントを接続するためのURLにアクセスするよう促します。**アクセス権は組織内で共有されるため、個人アカウントではなく、サービスアカウントを使用することを強くお勧めします。**

お探しのMCPが見つからない場合は、「独自追加」オプションを使用して設定してください！
問題が発生した場合は、[サポートページ](https://app.devin.ai/settings/support)または <support@cognition.ai> までお問い合わせください。

### Datadog

2つの環境変数を提供する必要があります：

* DATADOG\_API\_KEY - Datadog APIキー。Datadogの/organization-settings/api-keysページで確認できます
* DATADOG\_APP\_KEY - Datadogアプリケーションキー。Datadogの/organization-settings/application-keysページで確認できます

DATADOG\_SITE（例：datadoghq.eu）はオプションの環境変数です。
[ドキュメント](https://github.com/winor30/mcp-server-datadog)

### Slack

必要な認証情報を取得するには：
*Slackボットトークン*：
まず、[api.slack.com/apps](http://api.slack.com/apps)にアクセスしてアプリを選択します。次に：

* サイドバーで、Oauth & Permissionsに移動します
* Bot User OAuth Token（「xoxb-」で始まるはずです）を探します
* Bot User Oauth Tokenが見つからない場合は、アプリレベルのトークンを設定していること（設定 > 基本情報）、少なくとも1つのスコープを追加していること（設定 > Oauth & Permissions）、そしてワークスペースにアプリをインストールしていることを確認してください。

*SlackチームID*：

* curlコマンドを使用します：`curl -H "Authorization: Bearer xoxb-your-token" https://slack.com/api/auth.test` ここで `xoxb-your-token` はあなたのOAuthトークンに置き換えてください

*SlackチャンネルID*：

* curlコマンドを使用します：`curl -H "Authorization: Bearer xoxb-your-token" https://slack.com/api/conversations.list` ここで `xoxb-your-token` はあなたのOAuthトークンに置き換えてください
* このコマンドが機能するためには、少なくとも次のスコープを追加する必要があります：channels:read,groups:read,mpim:read,im:read

[ドキュメント](https://www.npmjs.com/package/@modelcontextprotocol/server-slack)

### Supabase

パーソナルアクセストークンを提供する必要があります。これは <https://supabase.com/dashboard/account/tokens> で見つけて作成できます。
[ドキュメント](https://mcpservers.org/servers/supabase-community/supabase-mcp)

### Figma

このMCPを有効にするには、Figma APIキーを提供する必要があります：

1. Figmaのホームページから、左上隅のプロフィールアイコンをクリックし、ドロップダウンから設定を選択します。
2. 設定メニューで、セキュリティタブを選択します。
3. 個人アクセストークンセクションまでスクロールダウンし、新しいトークンを生成をクリックします。
4. トークンの名前を入力し、適切な権限を付与していることを確認してください。少なくともファイルコンテンツと開発リソースに対する読み取り権限をお勧めします。
5. トークンを生成をクリックします。

このMCPを使用する際は、FigmaファイルへのリンクをDevinに送信してください。
**注：これはFigmaによって構築または維持されていないサードパーティのMCP連携です。**
[ドキュメント](https://github.com/thirdstrandstudio/mcp-figma)

### Stripe

`Bearer <TOKEN>`という形式の認証ヘッダーを提供する必要があります。`<TOKEN>`はあなたのStripe APIキーです。詳細はこちら：<https://docs.stripe.com/mcp#bearer-token>
[ドキュメント](https://docs.stripe.com/mcp)

### Zapier

`Bearer <TOKEN>`という形式の認証ヘッダーを提供する必要があります。
<https://mcp.zapier.com/mcp/servers> > 接続で提供されるサーバーURLからBearerトークンを抽出する必要があります。
サーバーURLは次のようになります：`https://mcp.zapier.com/api/mcp/s/*****/mcp`
アスタリスクのセクション（\*\*\*\*\*)を抽出し、提供する認証ヘッダーで使用します：`Bearer *****`

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/Zapier_MCP.png)

[ドキュメント](https://zapier.com/mcp)

### Airtable

Airtable APIキーを提供する必要があります。APIキーは <https://airtable.com/create/tokens> で見つけることができます。
[ドキュメント](https://www.npmjs.com/package/airtable-mcp-server)

### Docker Hub

必要な認証情報：

* Docker Hubユーザー名：My Hubから取得できます
* パーソナルアクセストークン：アカウント設定 > パーソナルアクセストークンに移動してトークンを作成します

    ![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/dockermcp.png)

[ドキュメント](https://hub.docker.com/r/mcp/dockerhub)

### SonarQube

必要な認証情報を取得するには：

* Sonarqubeトークン：マイアカウント > セキュリティに移動してAPIトークンを生成します
* Sonarqube組織：これはあなたのユーザー名です。以下の画像例を参照してください

    ![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/sonarqubemcp.png)
* Sonarqube URL：
  * セルフホストの場合：フォーマットは `http://localhost:9000` または `https://sonarqube.mycompany.com`
  * SonarCloudの場合：`https://sonarcloud.io` を使用します

[ドキュメント](https://github.com/SonarSource/sonarqube-mcp-server)

### Netlify

パーソナルアクセストークンを提供する必要があります。これは <https://app.netlify.com/user/applications#personal-access-tokens> で表示および作成できます。作成後すぐにPATをコピーしてください。再度表示することはできません！

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/netlify.png)

[ドキュメント](https://docs.netlify.com/welcome/build-with-ai/netlify-mcp-server/)

### Heroku

APIキーを提供する必要があります。これは <https://dashboard.heroku.com/account> で見つけることができます。

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/Heroku.png)

[ドキュメント](https://www.heroku.com/blog/introducing-official-heroku-mcp-server/)

### CircleCI

2つの環境変数を提供する必要があります：

* `CIRCLECI_TOKEN` - CircleCI APIトークン。<https://app.circleci.com/settings/user/tokens> で作成できます。作成後すぐにAPIトークンをコピーしてください。再度表示することはできません！

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/CircleCI.png)

* `CIRCLECI_BASE_URL` \[任意] - これはオプションで、オンプレミスのお客様にのみ必要です。デフォルト値は `"https://circleci.com"` です。

[ドキュメント](https://hub.docker.com/r/mcp/circleci)

### Square

`Bearer <TOKEN>`という形式の認証ヘッダーを提供する必要があります。`<TOKEN>`はあなたのSquareアクセストークンです。詳細はこちら：<https://developer.squareup.com/docs/build-basics/access-tokens>
[ドキュメント](https://developer.squareup.com/docs/mcp)

### Hubspot

環境変数としてアクセストークンを提供する必要があります。アクセストークンを取得するには：

1. HubSpotでプライベートアプリを作成します：
2. 設定 > 連携 > プライベートアプリに移動します
3. 「プライベートアプリを作成」をクリックします
4. アプリに名前を付け、必要なスコープを設定します
5. 「アプリを作成」をクリックします
6. 「Auth」タブから生成されたアクセストークンをコピーします

[ドキュメント](https://www.npmjs.com/package/@hubspot/mcp-server)

### Redis

必要な認証情報：

* Redisホスト
* Redisポート
* Redisユーザー名
* Redisパスワード

[ドキュメント](https://redis.io/docs/latest/integrate/redis-mcp/client-conf/)

### Google Maps

（1）APIキーを提供し、（2）Devinにアクセスさせたい個々のAPIを有効にする必要があります。
APIキーを取得するには、<https://console.cloud.google.com/apis/credentials>に移動し、サイドバー > APIとサービス > 認証情報を開きます。
個々のAPIを有効にするには、APIを検索して「有効にする」をクリックします。

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/MapsMCP1.png)

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/MapsMCP2.png)

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/MapsMCP4.png)

[ドキュメント](https://www.npmjs.com/package/@modelcontextprotocol/server-google-maps)

### Playwright

これには環境変数は必要ありません！連携を有効にするだけです。
[ドキュメント](https://hub.docker.com/r/mcp/playwright)

### Firecrawl

APIキー（`FIRECRAWL_API_KEY`）を提供する必要があります。これは <https://www.firecrawl.dev/app/api-keys> で表示および作成できます。
[ドキュメント](https://hub.docker.com/r/mcp/firecrawl#use-this-mcp-server)

### ElasticSearch

2つの環境変数を提供する必要があります：

* `ES_URL` - ElasticSearchのURLまたはエンドポイント。Elasticsearchの/overviewページで確認できます。
* `ES_API_KEY` - ElasticSearch APIキー。Elasticsearchの`/indices/index_details/<name>/data`ページで作成できます。

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/elasticsearch.png)

`ES_SSL_SKIP_VERIFY`はオプションの環境変数です。`true`に設定すると、Elasticsearchへの接続時にSSL/TLS証明書の検証をスキップします。
[ドキュメント](https://hub.docker.com/r/mcp/elasticsearch)

### Postgres

必要な認証情報はPostgresの接続文字列のみです。
[ドキュメント] ([https://www.npmjs.com/package/@modelcontextprotocol/server-postgres?activeTab=readme](https://www.npmjs.com/package/@modelcontextprotocol/server-postgres?activeTab=readme))

### Plaid

必要な認証情報は、次のコードを実行して取得できるOauth bearerアクセストークンのみです：

```
curl -X POST https://production.plaid.com/oauth/token \
-H 'Content-Type: application/json' \
-d '{
"client_id": "YOUR_PLAID_CLIENT_ID",
"client_secret": "YOUR_PRODUCTION_SECRET",
"grant_type": "client_credentials",
"scope": "mcp:dashboard"
}'
```

クライアントIDとクライアントプロダクションシークレットを取得するには、<https://dashboard.plaid.com/developers/keys>にアクセスしてください。
[ドキュメント](https://plaid.com/docs/resources/mcp/)

### Replicate

必要な認証情報は、<https://replicate.com/account/api-tokens>で見つけることができるAPIトークンのみです。
[ドキュメント](https://replicate.com/docs/reference/mcp)

### Grafana

2つの環境変数を提供する必要があります：

* Grafana URL
* Grafanaサービスアカウントトークン：トークンを取得するには、サイドバーで管理 > ユーザーとアクセス > サービスアカウント > サービスアカウントを追加（まだ追加していない場合） > サービスアカウントトークンを追加に移動します。

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/grafana.png)

### Pinecone

注：Pinecone MCPは、統合埋め込みを持つインデックスのみをサポートします。外部埋め込みモデルで作成したベクトルのインデックスは、25年7月16日現在まだサポートされていません。
必要な認証情報は、PineconeダッシュボードのAPIキーページで取得できるPinecone APIキーのみです。以下を参照してください：

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/pinecone.png)
