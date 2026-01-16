---
title: "BigQuery のフルマネージド リモート MCP サーバーでデータ分析エージェントを迅速に構築 | Google Cloud 公式ブログ"
source: "https://cloud.google.com/blog/ja/products/data-analytics/using-the-fully-managed-remote-bigquery-mcp-server-to-build-data-ai-agents"
author:
  - "[[Vikram Manghnani]]"
  - "[[Prem Ramanathan]]"
published: 2026-01-13
created: 2026-01-16
description: |
  Google CloudがフルマネージドのリモートBigQuery MCPサーバーをプレビュー版としてリリース。Model Context Protocol（MCP）を使用して、AI エージェントがBigQueryのデータに直接かつ安全にアクセスできるようになり、複雑なカスタム統合なしでインテリジェントなデータ分析エージェントの構築が可能に。ADK（Agent Development Kit）やGemini CLIとの統合方法を詳細に解説。
tags:
  - "BigQuery"
  - "MCP"
  - "AI Agent"
  - "Google Cloud"
  - "データ分析"
  - "ADK"
  - "Gemini"
---

## 概要

Google Cloudは、フルマネージドのリモート**BigQuery MCP（Model Context Protocol）サーバー**をプレビュー版としてリリースした。これにより、複雑なカスタム統合や長期間の開発作業なしに、AIエージェントがエンタープライズデータに直接・安全にアクセスできるようになる。

## MCP（Model Context Protocol）とは

MCPは、定義されたツールセットを通じてLLM搭載アプリケーションが分析データに直接アクセスできるようにする標準プロトコル。リモートMCPサーバーはサービスのインフラストラクチャで実行され、AIアプリケーションにHTTPエンドポイントを提供する。

![BigQuery MCP サーバーアーキテクチャ](https://storage.googleapis.com/gweb-cloudblog-publish/images/1-bq_mcp_blog.max-1300x1300.png)

## 主な特徴

- **フルマネージド**: 管理上のオーバーヘッドが削減され、インテリジェントエージェントの開発に集中可能
- **標準プロトコル**: すべての主要なエージェント開発IDEおよびフレームワークと互換性がある
- **柔軟な統合**: ADK、Gemini CLI、LangGraph、Claude コード、Cursor IDEなど様々なプラットフォームに対応
- **オープンソース版も利用可能**: サーバーの柔軟性と制御性を高めたいユーザー向けに[データベース向け MCP ツールボックス](https://googleapis.github.io/genai-toolbox/getting-started/introduction/)も提供

## ADKでBigQuery MCPサーバーを使用する手順

### 前提条件

1. **Cloud プロジェクトの設定**: 課金が有効なGoogle Cloudプロジェクト
2. **必要なユーザーロール**:
   - `roles/bigquery.user`（クエリの実行用）
   - `roles/bigquery.dataViewer`（データへのアクセス用）
   - `roles/mcp.toolUser`（MCPツールへのアクセス用）
   - `roles/serviceusage.serviceUsageAdmin`（APIの有効化用）
   - `roles/iam.oauthClientViewer`（OAuth）
   - `roles/iam.serviceAccountViewer`（OAuth）
   - `roles/oauthconfig.editor`（OAuth）

3. **環境設定**: gcloud CLIがインストールされたMacOSまたはLinuxターミナル

```bash
# Cloud プロジェクトIDを環境変数に設定
BIGQUERY_PROJECT=PROJECT_ID
gcloud config set project ${BIGQUERY_PROJECT}
gcloud auth application-default login
```

### 手順2: APIの有効化

```bash
gcloud services enable bigquery.googleapis.com --project=${BIGQUERY_PROJECT}
gcloud beta services mcp enable bigquery.googleapis.com --project=${BIGQUERY_PROJECT}
```

### 手順3: サンプルデータセットの読み込み（cymbal_pets）

```bash
# データセットを作成
bq --project_id=${BIGQUERY_PROJECT} mk -f --dataset --location=US cymbal_pets

# データを読み込み
for table in products customers orders order_items; do
  bq --project_id=${BIGQUERY_PROJECT} query --nouse_legacy_sql \
    "LOAD DATA OVERWRITE cymbal_pets.${table} FROM FILES(
      format = 'avro',
      uris = ['gs://sample-data-and-media/cymbal-pets/tables/${table}/*.avro']);"
done
```

### 手順4: OAuth クライアントIDの作成

1. Google Cloud コンソールで [クライアントの作成](https://console.cloud.google.com/auth/clients/create) に移動
2. アプリケーションの種類: **デスクトップアプリ**を選択
3. クライアントIDとシークレットを保存

### 手順5: Gemini API キーの作成

[API キーのページ](https://aistudio.google.com/api-keys) で Gemini API キーを作成

### 手順6: ADK エージェントの作成

```bash
adk create cymbal_pets_analyst
# プロンプトで「2. Other models (fill later)」を選択
```

#### 環境変数の設定（.envファイル）

```bash
cat >> cymbal_pets_analyst/.env <<EOF
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_CLOUD_PROJECT=BIGQUERY_PROJECT
GOOGLE_CLOUD_LOCATION=REGION
GOOGLE_API_KEY=AI_STUDIO_API_KEY
OAUTH_CLIENT_ID=YOUR_CLIENT_ID
OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
EOF
```

#### エージェントコード（agent.py）

```python
import os
from google.adk.agents.llm_agent import Agent
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams
from google.adk.auth.auth_credential import AuthCredential, AuthCredentialTypes
from google.adk.auth import OAuth2Auth
from fastapi.openapi.models import OAuth2
from fastapi.openapi.models import OAuthFlowAuthorizationCode
from fastapi.openapi.models import OAuthFlows

def get_oauth2_mcp_tool():
    auth_scheme = OAuth2(
        flows=OAuthFlows(
            authorizationCode=OAuthFlowAuthorizationCode(
                authorizationUrl="https://accounts.google.com/o/oauth2/auth",
                tokenUrl="https://oauth2.googleapis.com/token",
                scopes={
                    "https://www.googleapis.com/auth/bigquery": "bigquery"
                },
            )
        )
    )
    auth_credential = AuthCredential(
        auth_type=AuthCredentialTypes.OAUTH2,
        oauth2=OAuth2Auth(
            client_id=os.environ.get('OAUTH_CLIENT_ID', ''),
            client_secret=os.environ.get('OAUTH_CLIENT_SECRET', '')
        ),
    )
    bigquery_mcp_tool_oauth = McpToolset(
        connection_params=StreamableHTTPConnectionParams(
            url='https://bigquery.googleapis.com/mcp'),
        auth_credential=auth_credential,
        auth_scheme=auth_scheme,
    )
    return bigquery_mcp_tool_oauth

root_agent = Agent(
    model='gemini-3-pro-preview',
    name='root_agent',
    description='Analyst to answer all questions related to cymbal pets store.',
    instruction='Answer user questions, use the bigquery_mcp tool to query the cymbal pets database and run queries.',
    tools=[get_oauth2_mcp_tool()],
)
```

#### アプリケーションの実行

```bash
adk web --port 8000 .
```

ブラウザで http://127.0.0.1:8000/ にアクセスし、エージェントを選択。

![ADK Web UI](https://storage.googleapis.com/gweb-cloudblog-publish/images/2-bq_mcp_blog.max-900x900.png)

### 質問の例

- 「my_project にはどのようなデータセットがある？」
- 「cymbal_pets データセットにはどのようなテーブルがある？」
- 「cymbal_pets データセットのテーブル customers のスキーマを取得して」
- 「米国西部地域の Cymbal のペットショップで、過去3ヶ月間の注文数上位3件を特定して」
- 「過去6ヶ月間で最も売れた商品は？」

## Gemini CLI での BigQuery MCP サーバー使用

### 設定ファイル（~/.gemini/settings.json）

```json
{
  "mcpServers": {
    "bigquery": {
      "httpUrl": "https://bigquery.googleapis.com/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/bigquery"
        ]
      }
    }
  }
}
```

### 認証と実行

```bash
gcloud auth application-default login --client-id-file YOUR_CLIENT_ID_FILE
gemini
```

![Gemini CLI での使用例](https://storage.googleapis.com/gweb-cloudblog-publish/images/3-bq_mcp_blog.max-1600x1600.png)

## 重要な注意事項

- **本番環境へのデプロイ前**: [AIのセキュリティと安全性](https://docs.cloud.google.com/mcp/ai-security-safety)に関するガイドラインを遵守すること
- **安定性**: [MCP安定性コミットメント](https://docs.cloud.google.com/mcp/mcp-gcp-stability-commitment)を確認すること
- **Cloud Shell使用時**: 「ウェブアプリケーション」のOAuthクライアントIDを作成し、適切なリダイレクトURIを設定する必要がある

## 対応プラットフォーム

- Agent Development Kit（ADK）
- Gemini CLI
- LangGraph
- Claude コード
- Cursor IDE
- その他のMCPクライアント

## まとめ

BigQuery MCPサーバーにより、LLMとBigQueryを使用したインテリジェントなデータエージェントの構築が容易になった。すべての主要なエージェント開発IDEおよびフレームワークと互換性のある単一の標準プロトコルに基づいており、開発ワークフローへの統合がスムーズに行える。

## 関連リンク

- [BigQuery MCP サーバー公式ドキュメント](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp)
- [Agent Development Kit（ADK）](https://google.github.io/adk-docs)
- [Gemini CLI](https://geminicli.com/)
- [データベース向け MCP ツールボックス（オープンソース）](https://googleapis.github.io/genai-toolbox/getting-started/introduction/)
- [AIのセキュリティと安全性ガイドライン](https://docs.cloud.google.com/mcp/ai-security-safety)
