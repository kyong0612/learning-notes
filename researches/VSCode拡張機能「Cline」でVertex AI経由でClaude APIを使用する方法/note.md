# VSCode拡張機能「Cline」でVertex AI経由でClaude APIを使用する方法

## 概要

VSCode拡張機能「Cline」を使用すると、Google CloudのVertex AI経由でAnthropicのClaudeモデルに接続し、強力なAIコーディングアシスタントとして活用できます。本レポートでは、正確な設定手順、必要な権限、およびサポートされているモデルについて解説します。

## 1. Google Cloud環境の準備

### 1.1 GCPプロジェクトの作成または選択

1. [Google Cloudコンソール](https://console.cloud.google.com/)にサインインします
2. 既存のプロジェクトを選択するか、新しいプロジェクトを作成します
3. 請求（Billing）が有効になっていることを確認します

### 1.2 Vertex AI APIの有効化

Google Cloudコンソールで以下の手順を実行します：

```bash
# または、Google Cloud CLIを使用して有効化します
gcloud services enable aiplatform.googleapis.com
```

### 1.3 IAM権限の設定

次の権限を付与する必要があります：

- **Vertex AI User**ロール (`roles/aiplatform.user`)
- サービスアカウントを使用する場合は、**Vertex AI Service Agent**ロール (`roles/aiplatform.serviceAgent`)も付与

必要に応じて追加のロールも検討します：

- Vertex AI Platform Express Admin
- Vertex AI Platform Express User

## 2. リージョンとモデルアクセスの確認

### 2.1 サポートされているリージョン

Claudeモデルは以下のリージョンで利用可能です（モデルによって異なります）：

- **us-east5**（オハイオ）- 最大キャパシティ、すべてのモデルが利用可能
- **europe-west1**（ベルギー）- 高キャパシティ
- **asia-southeast1**（シンガポール）- 一部のモデルが利用可能

### 2.2 Claudeモデルの有効化

1. Google Cloudコンソールで「Vertex AI」→「Model Garden」に移動します
2. 検索バーで「Claude」を検索します
3. 使用したいClaudeモデル（例：Claude 3.7 Sonnet）のカードを見つけ、「有効化」をクリックします
4. 必要な情報を入力して「同意する」をクリックします

## 3. Cline VSCode拡張機能の設定

### 3.1 Clineのインストール

1. [Visual Studio Code](https://code.visualstudio.com/)をダウンロードしてインストールします
2. VSCodeを起動し、拡張機能マーケットプレイス（Ctrl+Shift+X または Cmd+Shift+X）を開きます
3. 検索バーに「Cline」と入力します
4. 「Cline」拡張機能を見つけてインストールします

### 3.2 Cline設定の構成

1. Cline拡張機能のアイコンをクリックします（サイドバーに表示されます）
2. 設定アイコン（⚙️）をクリックして設定画面を開きます
3. 以下の設定を行います：
   - **API Provider**：ドロップダウンから「GCP Vertex AI」を選択
   - **Project ID**：先ほど設定したGoogle CloudプロジェクトIDを入力
   - **Region**：サポートされているリージョンの一つを選択（例：us-east5）
   - **Model**：リストから使用したいClaudeモデルを選択

## 4. 認証と資格情報の設定

### オプションA：Googleアカウントでの認証（推奨）

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)をインストールします
2. ターミナルで以下のコマンドを実行して初期化と認証を行います：

```bash
gcloud init
gcloud auth application-default login
```

3. 認証が完了したら、VSCodeを再起動します

### オプションB：サービスアカウントでの認証

1. Google Cloudコンソールで、「IAM」→「サービスアカウント」に移動します
2. 新しいサービスアカウントを作成します（例：「vertex-ai-client」）
3. 必要なロールを割り当てます：
   - Vertex AI User（roles/aiplatform.user）
   - Vertex AI Service Agent（roles/aiplatform.serviceAgent）
4. サービスアカウントのJSONキーを生成してダウンロードします
5. 環境変数を設定します：

```bash
# Linuxまたは macOS
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"

# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\service-account-key.json"
```

6. この環境変数が設定されたターミナルからVSCodeを起動します

## 5. サポートされているClaudeモデルとモデル識別子

Vertex AIで利用可能な最新のClaudeモデルとモデル識別子は以下の通りです：

| モデル | Vertex AI モデル識別子 |
|--------|--------------------------|
| Claude 3.7 Sonnet | `claude-3-7-sonnet@20250219` |
| Claude 3.5 Sonnet v2 | `claude-3-5-sonnet-v2@20241022` |
| Claude 3.5 Haiku | `claude-3-5-haiku@20241022` |
| Claude 3.5 Sonnet | `claude-3-5-sonnet@20240620` |
| Claude 3 Opus | `claude-3-opus@20240229` |
| Claude 3 Haiku | `claude-3-haiku@20240307` |

**注意**: モデル識別子は常に`@`記号と日付を含むバージョン番号（例：`@20250219`）を含める必要があります。これにより一貫した動作が保証されます。

## 6. Clineを使用してClaudeと対話する

1. VSCodeでCline拡張機能のアイコンをクリックします
2. チャットウィンドウが開きます
3. テキストプロンプトを入力してClaudeモデルと対話します
4. テストとして簡単なプログラミングタスクをリクエストします（例：「Pythonで素数を判定する関数を書いてください」）

## 7. セキュリティと監視

### 7.1 最小権限の原則

必要最小限の権限のみを付与し、カスタムロールを使用してより細かい制御を行うことを検討してください。

### 7.2 使用状況とクォータの監視

- Vertex AIコンソールの「Model Observability」ダッシュボードを使用して、リクエストスループット、レイテンシー、エラー率などを監視します
- クォータエラー（429）が発生した場合は、「IAM & Admin」→「Quotas」ページでクォータ増加をリクエストしてください

## 8. トラブルシューティング

### 8.1 認証エラー

- `gcloud auth application-default login`を再実行してください
- 環境変数`GOOGLE_APPLICATION_CREDENTIALS`が正しく設定されていることを確認してください

### 8.2 モデルが表示されない

- 選択したリージョンで指定のモデルが利用可能かを確認してください
- Model GardenでClaudeモデルが有効化されていることを確認してください

### 8.3 クォータエラー

- Quotasページでリージョンとモデルに対するクォータを確認してください
- 必要に応じてクォータ増加をリクエストしてください

## 9. まとめ

VSCode拡張機能「Cline」を使用すると、Google CloudのVertex AI経由でClaudeモデルに簡単にアクセスできます。この設定には、Google Cloudプロジェクトの準備、適切な権限の付与、モデルの有効化、Cline拡張機能の設定、そして認証の設定が必要です。

Claude 3.7 SonnetやClaude 3.5 Sonnet v2のような最新モデルは、強力なコード生成機能とツール使用能力を提供し、開発ワークフローを大幅に改善することができます。

常に公式ドキュメントを参照して、最新の情報とベストプラクティスを確認することをお勧めします。

## 参考資料

1. Cline公式ドキュメント - GCP Vertex AI設定ガイド:  
   <https://docs.cline.bot/custom-model-configs/gcp-vertex-ai>

2. Anthropic公式ドキュメント - Claudeモデル一覧:  
   <https://docs.anthropic.com/en/docs/about-claude/models/all-models>

3. Google Cloud公式ドキュメント - Vertex AIでのClaudeモデルの使用:  
   <https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude>

4. Cline VSCode拡張機能 - Visual Studio Marketplace:  
   <https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev>

5. Google Cloud Vertex AI - APIリファレンス:  
   <https://cloud.google.com/vertex-ai/docs/reference>

6. Cline GitHub リポジトリ:  
   <https://github.com/cline/cline>
