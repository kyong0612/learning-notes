# AWS再入門2023 Organizations SCP編

ref: <https://dev.classmethod.jp/articles/re-introduction-2023-aws-organizations-scp/>

- SCP
  - サービスコントロールポリシー
  - AWS Organizationsの1機能
  - 実体はIAMポリシー
  
![alt text](<assets/CleanShot 2024-12-07 at 15.00.09@2x.png>)
。

## SCPの基本概念

SCPはAWS Organizationsの機能で、組織内のIAMユーザーやロールのアクションを制限する予防的なガードレールとして機能します[1]。SCPの実体はIAMポリシーであり、組織のルート、OU、またはAWSアカウントにアタッチして使用します[1]。

## 重要な特徴

**効果範囲と制限**

- メンバーアカウントのIAMユーザー、IAMロール、ルートユーザーに影響[1]
- 管理アカウントはSCPの影響を受けない[1]
- 各要素へのアタッチ上限は5個[1]
- ポリシーサイズの上限は5120文字[1]

**アクセス制御の仕組み**

- SCPは新たな許可を与えない（フィルターとして機能）[1]
- アクションの許可には、アカウント自身、上位OU、組織ルートそれぞれに明示的なAllowが必要[1]

## 設計のベストプラクティス

**拒否リスト形式の採用**

- Denyステートメントを使用してアクションを制限[1]
- FullAWSAccessをベースに必要な制限を追加[1]

**リージョン制限の実装**

- 使用しないリージョンでのアクセスを禁止[1]
- 東京・大阪リージョン以外を制限する例が一般的[1]

**セキュリティ設定の保護**

- 管理者が設定した重要なサービスやリソースを保護[1]
- AWS Configの設定やIAMロールの変更を制限[1]

## 運用のポイント

**コード管理の重要性**

- CloudFormationやTerraformでSCPを管理[1]
- Gitなどでバージョン管理を実施[1]

**検証プロセスの確立**

- テスト用OUを用意して影響を確認[1]
- 段階的な展開で安全性を確保[1]

## 実装時の注意点

- 過度な制限は開発生産性を低下させる可能性がある[1]
- セキュリティ要件と利用者のスキルレベルに応じて適切な制限を設定[1]
- 定期的な見直しと改善が必要[1]

Sources
[1]  <https://dev.classmethod.jp/articles/re-introduction-2023-aws-organizations-scp/>
[2] AWS再入門2023 Organizations SCP編 | DevelopersIO <https://dev.classmethod.jp/articles/re-introduction-2023-aws-organizations-scp/>
