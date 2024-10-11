# IAM OIDC IDプロバイダーの仕組みを見てみる】GitHub ActionsからAWSに一時認証情報を使用してアクセスする

ref: <https://zenn.dev/fusic/articles/48620c1c798ece>

## AWS IAM OIDC IDプロバイダーとGitHub Actions統合：エンタープライズグレードの実装ガイド

### 概要

本記事は、AWS IAM OIDC IDプロバイダーを活用したGitHub ActionsからAWSリソースへのセキュアかつ効率的なアクセス方法を、エンタープライズレベルの詳細さで解説しています。この手法は、長期的な認証情報の使用を完全に排除し、一時的な認証情報を用いることで、セキュリティを最大限に向上させると同時に、運用効率を最適化し、大規模組織のニーズに応えます.

### OIDC（OpenID Connect）の技術的深堀り

OIDCは、OAuth 2.0を基盤とした認証レイヤーで、以下の高度な特徴を持ちます：

- **JWTの構造と検証**:
  - ヘッダー、ペイロード、署名の3部構成
  - RS256などの非対称暗号化アルゴリズムによる署名検証
- **クレームの拡張性**:
  - 標準クレームに加え、カスタムクレームの定義が可能
  - `azp`（Authorized party）クレームによるクライアント識別
- **動的クライアント登録**:
  - クライアントの自動登録とメタデータ交換をサポート

### IAM OIDC IDプロバイダーの高度な利点と考慮点

1. **ゼロトラストアーキテクチャの実現**:
   - 全てのアクセスを動的に検証し、信頼を常に再評価
   - コンテキストベースのアクセス制御の実装

2. **マルチクラウド環境での統一認証**:
   - 異なるクラウドプロバイダー間での一貫した認証メカニズムの確立
   - クラウド間の移行やハイブリッドクラウド戦略の容易化

3. **コンプライアンスフレームワークへの適合**:
   - GDPR、HIPAA、PCI DSSなどの規制要件への適合性向上
   - 監査証跡の自動生成と保持

4. **DevSecOpsの促進**:
   - セキュリティをCI/CDパイプラインに完全に統合
   - 自動化されたセキュリティテストとポリシー適用の実現

5. **障害復旧とビジネス継続性の強化**:
   - 認証システムの冗長性と高可用性の確保
   - クロスリージョンでの認証バックアップメカニズムの実装

### 実装手順の詳細と高度な設定

1. **IAM OIDC IDプロバイダーの作成と高度な設定**
   - AWSコンソールでの詳細手順：
     1. IAMコンソールを開く
     2. 「IDプロバイダー」を選択
     3. 「プロバイダーの追加」をクリック
     4. プロバイダータイプとして「OpenID Connect」を選択
     5. 必要情報を入力：
        - Provider URL: `https://token.actions.githubusercontent.com`
        - Audience: `sts.amazonaws.com`
     6. サムプリントを検証し、プロバイダーを作成
   - AWS CLIを使用する場合の高度なコマンド:

     ```bash
     aws iam create-open-id-connect-provider \
         --url https://token.actions.githubusercontent.com \
         --client-id-list sts.amazonaws.com \
         --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
         --tags Key=Environment,Value=Production Key=Project,Value=GitHubIntegration
     ```

   - プロバイダーのメタデータ検証:

     ```bash
     aws iam get-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com
     ```

2. **IAMロールの高度な設定と最適化**
   - 信頼ポリシーの高度な例（条件付きアクセス制御を含む）:

     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Principal": {
             "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
           },
           "Action": "sts:AssumeRoleWithWebIdentity",
           "Condition": {
             "StringEquals": {
               "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
               "token.actions.githubusercontent.com:sub": "repo:OWNER/REPO:ref:refs/heads/BRANCH"
             },
             "StringLike": {
               "token.actions.githubusercontent.com:sub": "repo:OWNER/*"
             },
             "ForAnyValue:StringEquals": {
               "token.actions.githubusercontent.com:iss": "https://token.actions.githubusercontent.com"
             },
             "DateGreaterThan": {"aws:CurrentTime": "2023-01-01T00:00:00Z"},
             "DateLessThan": {"aws:CurrentTime": "2025-01-01T00:00:00Z"}
           }
         }
       ]
     }
     ```

   - アクセス権限の最適化：
     - AWS管理ポリシーの使用を最小限に抑え、カスタムポリシーを優先
     - ポリシーシミュレーターを使用して、最小権限の原則を厳密に適用
     - タグベースのアクセス制御（TBAC）の実装

3. **GitHub Actionsワークフローの高度な設定と最適化**
   - `permissions`ブロックの詳細設定:

     ```yaml
     permissions:
       id-token: write
       contents: read
       issues: write
       pull-requests: write
     ```

   - `aws-actions/configure-aws-credentials`アクションの高度な使用:

     ```yaml
     - name: Configure AWS credentials
       uses: aws-actions/configure-aws-credentials@v1
       with:
         role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
         aws-region: ap-northeast-1
         role-duration-seconds: 3600
         role-session-name: GitHubActions-${{ github.run_id }}
     ```

   - セッショントークンの再利用と最適化:

     ```yaml
     - name: Get caller identity
       run: |
         aws sts get-caller-identity
         echo "AWS_ACCESS_KEY_ID=${{ env.AWS_ACCESS_KEY_ID }}" >> $GITHUB_ENV
         echo "AWS_SECRET_ACCESS_KEY=${{ env.AWS_SECRET_ACCESS_KEY }}" >> $GITHUB_ENV
         echo "AWS_SESSION_TOKEN=${{ env.AWS_SESSION_TOKEN }}" >> $GITHUB_ENV
     ```

### エンタープライズグレードのセキュリティ考慮事項

- **アイデンティティフェデレーションの高度な実装**:
  - AWS Single Sign-On (SSO)との統合によるクロスアカウントアクセスの一元管理
  - SAML 2.0ベースの企業IDプロバイダーとの連携

- **セキュリティイベントの高度な監視と対応**:
  - Amazon EventBridgeを使用したリアルタイムセキュリティイベント処理
  - AWS Security HubとAmazon Detectiveによるセキュリティポスチャーの包括的な可視化と調査

- **暗号化と鍵管理の最適化**:
  - AWS Key Management Service (KMS)を使用したカスタマーマネージドキーの実装
  - 自動鍵ローテーションと多層暗号化戦略の採用

- **ネットワークセキュリティの強化**:
  - AWS PrivateLinkを使用したVPC内からのAWS APIへのプライベートアクセス
  - WAFとShieldによるアプリケーションレイヤーの保護

### パフォーマンスと拡張性の最適化戦略

- **コンテナ化とサーバーレスアーキテクチャの活用**:
  - Amazon ECS/EKSを使用したコンテナ化されたGitHub Actionsランナーの実装
  - AWS Lambdaを活用した軽量で高速なセキュリティチェックの実行

- **グローバル展開とエッジコンピューティング**:
  - Amazon CloudFrontとLambda@Edgeを使用したグローバルな認証/認可の最適化
  - AWS Global Acceleratorによるグローバルネットワークパフォーマンスの向上

- **高度なキャッシング戦略**:
  - Amazon ElastiCacheを使用したセッショントークンのキャッシング
  - GitHub Actionsのself-hosted runnerでのローカルキャッシュ最適化

### 高度なトラブルシューティングと監視

- **詳細なログ分析とトレーシング**:
  - AWS X-Rayを使用したエンドツーエンドのリクエストトレーシング
  - Amazon Athenaを活用したCloudTrailログの高度なクエリと分析

- **アノマリー検出と自動修復**:
  - Amazon GuardDutyとAWS Security Hubを連携させた高度な脅威検出
  - AWS Systems Managerの自動化ランブックによるセキュリティインシデントの自動対応

- **パフォーマンスボトルネックの特定と最適化**:
  - Amazon CloudWatchのカスタムメトリクスとアラームを使用した詳細なパフォーマンスモニタリング
  - AWS Compute Optimizerによる最適なリソース設定の推奨

### エンタープライズレベルのベストプラクティスと推奨事項

1. **マルチアカウント戦略の実装**:
   - AWS Organizationsを使用した階層的なアカウント構造の設計
   - クロスアカウントロールの使用による細分化されたアクセス制御

2. **継続的なコンプライアンスモニタリング**:
   - AWS Configと AWS Config Rulesを使用した自動化されたコンプライアンスチェック
   - AWS AuditManagerによる包括的な監査レポートの生成

3. **インフラストラクチャのコード化（IaC）の徹底**:
   - AWS CloudFormationまたはTerraformを使用したIAMロールとポリシーの管理
   - GitOpsアプローチによるインフラストラクチャ変更の追跡と承認プロセスの自動化

4. **セキュリティの自動化とオーケストレーション**:
   - AWS Step Functionsを使用した複雑なセキュリティワークフローの自動化
   - Amazon EventBridgeによるイベントドリブンのセキュリティ対応の実装

5. **継続的なセキュリティ教育とトレーニング**:
   - 定期的なセキュリティワークショップと脅威モデリングセッションの実施
   - 模擬セキュリティインシデント対応訓練の定期的な実施

この高度な実装方法を採用することで、GitHub ActionsとAWSの統合は最高レベルのセキュリティと効率性を達成し、エンタープライズグレードの要件を満たします。この手法はAWSのセキュリティベストプラクティスに完全に準拠し、最新のクラウドネイティブアーキテクチャとDevSecOps原則を反映しています。さらに、この方法は将来的な技術進化やコンプライアンス要件の変化にも柔軟に対応できる拡張性と適応性を備えています.
