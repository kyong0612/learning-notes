# AWS Organizations の各ポリシーと継承について整理する (2024年10月版)

ref:<https://blog.serverworks.co.jp/aws-organizations-policies-and-inheritance>

## 組織ポリシーの種類

AWS Organizationsには現在5つの組織ポリシーがあります[1]：

1. サービスコントロールポリシー (SCP)
2. バックアップポリシー
3. タグポリシー
4. チャットボットポリシー
5. AI サービスのオプトアウトポリシー

これらは2つのカテゴリに分類されます：

- 承認ポリシー：SCP
- 管理ポリシー：その他4つのポリシー

## SCPと継承の概念の変更

重要な点として、SCPに関して「継承」という用語が使用されなくなりました[1]。これは、SCPの動作が一般的な継承の概念と異なるためです。

## 管理ポリシーの継承

管理ポリシー（SCP以外）では、以下のように継承が機能します[1]：

1. 組織のルートにポリシーをアタッチすると、全てのOU、アカウントに継承されます。
2. 特定のOUにポリシーをアタッチすると、そのOU配下の全ての子OUとアカウントに継承されます。
3. 特定のアカウントにポリシーをアタッチすると、そのアカウントのみに影響します。

## SCPの特徴

SCPには以下の特徴があります[1]：

1. 管理アカウント（マネジメントアカウント）には効力を発揮しません。
2. 各エンティティ（OU、アカウント）に明示的な許可が必要です。
3. 継承演算子が存在しません。

## まとめ

この記事は、AWS Organizationsのポリシー管理における最新の変更、特にSCPの「継承」概念の廃止について詳細に解説しています。これにより、ポリシーの動作と用語の使用がより整合性を持つようになりました[1]。

Citations:
[1] <https://blog.serverworks.co.jp/aws-organizations-policies-and-inheritance>
[2] <https://aws.amazon.com/jp/blogs/security/security-by-design-aws-to-enhance-mfa-requirements-in-2024/>
[3] <https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_inheritance_mgmt.html>
[4] <https://blog.serverworks.co.jp/aws-organizations-policies-and-inheritance>
