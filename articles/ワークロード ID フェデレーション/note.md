# ワークロード ID フェデレーション

ref: <https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation>

## 概要

ワークロード ID フェデレーションは、ソフトウェアワークロード（アプリケーション、サービス、スクリプト、コンテナベースのアプリケーションなど）がシークレットを管理することなく、Microsoft Entraで保護されたリソースにアクセスすることを可能にする機能です。GitHub Actions、Kubernetesで実行されるワークロード、Azureの外部のコンピューティングプラットフォームで実行されるワークロードなどのシナリオで使用できます。

## ワークロード ID フェデレーションを使用する理由

通常、ソフトウェアワークロードは認証やリソースアクセス、他のサービスとの通信のためにIDが必要です。Azureで実行される場合はマネージドIDを使用でき、Azureプラットフォームが認証情報を管理します。しかし、Azure外部で実行されるワークロードやAzure内でもアプリ登録をIDとして使用するワークロードの場合、Microsoft Entraリソース（Azure、Microsoft Graph、Microsoft 365など）へのアクセスにはアプリケーション認証情報（シークレットまたは証明書）が必要です。

これらの認証情報に関する課題：

- セキュリティリスクが生じる
- 安全に保存する必要がある
- 定期的にローテーションする必要がある
- 認証情報が期限切れになるとサービスの停止リスクがある

ワークロード ID フェデレーションを使用すると、GitHubやGoogleなどの外部IDプロバイダー（IdP）からのトークンを信頼するようにMicrosoft Entra IDでユーザー割り当てマネージドIDまたはアプリ登録を構成できます。信頼関係が作成されると、外部ソフトウェアワークロードは外部IdPからの信頼されたトークンをMicrosoft IDプラットフォームからのアクセストークンと交換します。

主なメリット：

- 認証情報を手動で管理する負担を排除
- シークレットの漏洩リスクを軽減
- 証明書の期限切れによるリスクを排除

## サポートされるシナリオ

Microsoft Entraでは、以下のシナリオでワークロード ID フェデレーションを使用して保護されたリソースにアクセスすることができます：

1. **Kubernetesクラスター上のワークロード**
   - Azure Kubernetes Service (AKS)
   - Amazon Web Services EKS
   - Google Kubernetes Engine (GKE)
   - オンプレミス環境

2. **GitHub Actions**
   - Microsoft Entra管理センターまたはMicrosoft Graphを使用して信頼関係を構成
   - GitHub Actionsワークフローを構成してMicrosoft IDプロバイダーからアクセストークンを取得

3. **Azureコンピューティングプラットフォーム上のアプリID**
   - Azure VMまたはApp Serviceにユーザー割り当てマネージドIDを割り当て
   - アプリとユーザー割り当てIDの間に信頼関係を構成

4. **Google Cloud**
   - Microsoft Entra IDとGoogle Cloudのアイデンティティ間で信頼関係を構成
   - Google Cloudで実行されるソフトウェアワークロードの構成

5. **Amazon Web Services (AWS)**
   - Microsoft Entra IDとAmazon Cognitoのアイデンティティ間で信頼関係を構成
   - AWSで実行されるソフトウェアワークロードの構成

6. **Azure以外のコンピューティングプラットフォーム上のワークロード**
   - 外部IdPとの信頼関係を構成
   - プラットフォームが発行するトークンを使用してMicrosoft IDプラットフォームで認証

7. **SPIFFEとSPIRE**
   - プラットフォームに依存しないオープンソース標準
   - Microsoft Entra IDと外部ワークロードのSPIFFE ID間の信頼関係を構成

8. **Azure Pipelines（プレビュー）**
   - ワークロード ID フェデレーションを使用したAzure Resource Managerサービス接続の作成

**注意事項：** Microsoft Entra IDが発行したトークンはフェデレーション ID フローには使用できません。フェデレーション ID 認証情報フローは、Microsoft Entra IDが発行したトークンをサポートしていません。

## 動作の仕組み

![ワークロード ID フェデレーションのワークフロー図](https://learn.microsoft.com/en-us/entra/workload-id/media/workload-identity-federation/workflow.svg)

外部IDプロバイダーとMicrosoft Entra IDのユーザー割り当てマネージドIDまたはアプリケーションとの間に信頼関係を作成します。フェデレーション ID 認証情報は、外部IdPからのどのトークンがアプリケーションまたはマネージドIDによって信頼されるべきかを示すために使用されます。

### フェデレーション IDの構成方法

- **ユーザー割り当てマネージドID**: Microsoft Entra管理センター、Azure CLI、Azure PowerShell、Azure SDK、Azure Resource Manager (ARM) テンプレートを通じて構成
- **アプリ登録**: Microsoft Entra管理センターまたはMicrosoft Graphを通じて構成

### 重要な注意点

フェデレーション ID 認証情報の`issuer`、`subject`、`audience`の値は、外部IdPからMicrosoft Entra IDに送信されるトークンに含まれる対応する値と大文字小文字を区別して一致する必要があります。

### トークン交換のワークフロー（詳細図解）

以下は、トークン交換のワークフローをより詳細に表した図です。この図は、各エンティティ間でのトークンの流れと処理を視覚的に示しています。

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   外部ワークロード   │     │     外部IdP         │     │   Microsoft ID      │     │  Microsoft Entra    │
│  (GitHub Actions等)  │     │   (GitHub等)        │     │   プラットフォーム   │     │    保護リソース     │
└─────────┬───────────┘     └─────────┬───────────┘     └─────────┬───────────┘     └─────────┬───────────┘
          │                           │                           │                           │
          │                           │                           │                           │
          │                           │                           │                           │
          │ 1.トークン要求            │                           │                           │
          │-------------------------->│                           │                           │
          │                           │                           │                           │
          │                           │                           │                           │
          │ 2.OIDC JWTトークン発行    │                           │                           │
          │<--------------------------|                           │                           │
          │                           │                           │                           │
          │      JWT: 外部IdPによって署名されたトークン           │                           │
          │                           │                           │                           │
          │                           │                           │                           │
          │ 3.JWTトークン送信         │                           │                           │
          │   アクセストークン要求     │                           │                           │
          |---------------------------|-------------------------->│                           │
          │                           │                           │                           │
          │                           │                           │ 4a.信頼関係の確認         │
          │                           │                           │ ┌──────────────────┐     │
          │                           │                           │ │フェデレーションID認証│     │
          │                           │                           │ │情報の検証:        │     │
          │                           │                           │ │・issuer           │     │
          │                           │                           │ │・subject          │     │
          │                           │                           │ │・audience         │     │
          │                           │                           │ └──────────────────┘     │
          │                           │                           │                           │
          │                           │                           │ 4b.外部トークンの検証     │
          │                           │ OpenID Connect           │                           │
          │                           │<--------------------------|                           │
          │                           │ 発行者URLに対して検証     │                           │
          │                           │-------------------------->│                           │
          │                           │ 署名検証結果              │                           │
          │                           │                           │                           │
          │                           │                           │                           │
          │ 5.Microsoftアクセス       │                           │                           │
          │   トークン発行            │                           │                           │
          │<--------------------------|---------------------------|                           │
          │                           │                           │                           │
          │ アクセストークン:         │                           │                           │
          │ Microsoft Entraリソース   │                           │                           │
          │ へのアクセス許可          │                           │                           │
          │                           │                           │                           │
          │ 6.アクセストークンで      │                           │                           │
          │   リソースアクセス        │                           │                           │
          |---------------------------|---------------------------|-------------------------->│
          │                           │                           │                           │
          │ 保護されたリソースへの    │                           │                           │
          │ アクセス提供              │                           │                           │
          │<--------------------------|---------------------------|---------------------------|
          │                           │                           │                           │
          │                           │                           │                           │
```

各ステップの詳細：

1. **トークン要求**：外部ワークロード（例：GitHub Actionsワークフロー）が外部IdP（例：GitHub）からトークンを要求します。

2. **JWTトークン発行**：外部IdPが外部ワークロードにOIDC JWT（JSON Web Token）を発行します。このトークンには、ワークロードの識別情報が含まれ、外部IdPによって署名されています。

3. **トークン交換要求**：外部ワークロードはこのJWTトークンをMicrosoft IDプラットフォームに送信し、Microsoft Entraリソースにアクセスするためのアクセストークンを要求します。

4. **トークン検証プロセス**：Microsoft IDプラットフォームは2つの主要な検証を行います。
   - **4a. 信頼関係の確認**：ユーザー割り当てマネージドIDまたはアプリ登録に構成されているフェデレーションID認証情報と照合し、トークンの`issuer`、`subject`、`audience`値が一致するか確認します。
   - **4b. 外部トークンの検証**：外部IdPのOpenID Connect発行者URLに対してJWTトークンの署名を検証します。これにより、トークンが正規の発行者から発行されたものであり、改ざんされていないことを確認します。

5. **アクセストークン発行**：すべての検証が成功すると、Microsoft IDプラットフォームは外部ワークロードにアクセストークンを発行します。このアクセストークンには、Microsoft Entraで保護されたリソースにアクセスするための権限が含まれています。

6. **リソースアクセス**：外部ワークロードはMicrosoft IDプラットフォームから取得したアクセストークンを使用して、Microsoft Entraで保護されたリソースにアクセスします。例えば、GitHub Actionsワークフローがこのアクセストークンを使用してAzure App Serviceにウェブアプリをデプロイします。

この仕組みにより、シークレットや証明書を管理・保存する必要なく、外部システムからMicrosoft Entraで保護されたリソースに安全にアクセスすることが可能になります。

> **注意**: Mermaidをサポートする環境（GitHub等）では、以下のコードを使用してより洗練された図を表示できます。
>
> ```mermaid
> sequenceDiagram
>     participant EW as 外部ワークロード<br>(GitHub Actions等)
>     participant EIdP as 外部IdP<br>(GitHub等)
>     participant MS as Microsoft ID<br>プラットフォーム
>     participant AZ as Microsoft Entra<br>保護リソース
>
>     Note over EW,AZ: 事前設定: Microsoft Entra IDでフェデレーション認証情報を構成
>
>     EW->>EIdP: 1. トークン要求
>     EIdP-->>EW: 2. OIDC JWTトークン発行
>
>     Note right of EW: JWT: 外部IdPによって<br>署名されたトークン
>     
>     EW->>MS: 3. JWTトークン送信<br>アクセストークン要求
>     
>     Note over MS: 4a. 信頼関係の確認
>     Note over MS: 4b. 外部トークンの検証
>
>     MS-->>EW: 5. Microsoftアクセス<br>トークン発行
>     
>     Note right of EW: アクセストークン: <br>Microsoft Entraリソース<br>へのアクセス許可
>     
>     EW->>AZ: 6. アクセストークンで<br>リソースアクセス
>     AZ-->>EW: 保護されたリソースへのアクセス提供
> ```

### 技術的制限事項

Microsoft IDプラットフォームは外部IdPのOIDCエンドポイントからダウンロードされる最初の100個の署名キーのみを保存します。外部IdPが100個を超える署名キーを公開している場合、ワークロード ID フェデレーションの使用時にエラーが発生する可能性があります。

## 関連情報

- [ユーザー割り当てマネージドIDのフェデレーション ID 認証情報](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity)の作成、削除、取得、更新方法
- [アプリ登録のフェデレーション ID 認証情報](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation-create-trust)の作成、削除、取得、更新方法
- [アプリ登録でのユーザー割り当てマネージドIDのフェデレーション ID 認証情報](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity)としての設定方法
- [ワークロード ID の概要](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)（Kubernetesワークロードの構成方法）
- [GitHub Actionsのドキュメント](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure)（GitHub Actionsワークフローの構成）
- [OAuth 2.0クライアント認証情報フロー](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow#third-case-access-token-request-with-a-federated-credential)（Microsoft Entra IDによるトークン取得方法）
- [アサーション形式](https://learn.microsoft.com/en-us/entra/identity-platform/certificate-credentials#assertion-format)（外部IDプロバイダーによって作成されたJWTの必要な形式）
