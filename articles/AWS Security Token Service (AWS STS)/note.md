# IAM の一時的な認証情報

ref: <https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp.html>

## 一時的な認証情報とは

一時的な認証情報は、AWS Security Token Service (AWS STS) を使用して生成される短期間有効なセキュリティ認証情報です。これらは長期的なアクセスキーと似ていますが、以下の点で異なります:

1. 短期間の有効期限（数分から数時間）を持ちます。
2. ユーザーに保存されず、必要に応じて動的に生成されます。

## 一時的な認証情報の利点

1. アプリケーションに長期的な認証情報を埋め込む必要がありません。
2. AWS IDを定義せずにリソースへのアクセスを許可できます。
3. 有効期限が限られているため、明示的な取り消しが不要です。

## AWS STSとAWSリージョン

AWS STSはグローバルサービスですが、地理的に近いリージョンのエンドポイントを使用してレイテンシーを低減できます。

## 一時的な認証情報の一般的なシナリオ

1. IDフェデレーション
   - SAMLフェデレーション
   - カスタムフェデレーションブローカー
   - OpenID Connect (OIDC) フェデレーション

2. クロスアカウントアクセス
3. Amazon EC2のロール
4. その他のAWSサービス

## 用語解説

- **AWS STS (Security Token Service)**: 一時的なセキュリティ認証情報を生成するAWSサービス。

- **IDフェデレーション**: 外部のIDシステムとAWSの間で認証情報を共有する仕組み。

- **SAML (Security Assertion Markup Language)**: 認証と認可のためのオープンスタンダード。

- **OIDC (OpenID Connect)**: OAuth 2.0プロトコルの上に構築された認証レイヤー。

- **クロスアカウントアクセス**: 複数のAWSアカウント間でリソースにアクセスする機能。

- **IAMロール**: 特定のアクセス許可を持つIAMアイデンティティ。

この文書は、AWSのセキュリティとアクセス管理において一時的な認証情報がどのように使用され、どのような利点があるかを詳細に説明しています。特に、IDフェデレーションやクロスアカウントアクセスなど、複雑なシナリオでの使用方法に焦点を当てています[1].

Citations:
[1] <https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp.html>
[2] <https://auth0.com/jp/intro-to-iam/what-is-openid-connect-oidc>
[3] <https://note.com/19940208/n/n02483e4b18d2>
[4] <https://dev.classmethod.jp/articles/signin-with-cross-account-access/>
[5] <https://qiita.com/fjisdahgaiuerua/items/c8183dc19e95d9e13d4b>
[6] <https://aws.amazon.com/jp/iam/features/manage-roles/>
[7] <https://cloud5.jp/saitou-iamrole/>
[8] <https://www.gluegent.com/service/gate/column/federation/>
[9] <https://www.hitachi-solutions.co.jp/iam/saml.html>
[10] <https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp.html>
