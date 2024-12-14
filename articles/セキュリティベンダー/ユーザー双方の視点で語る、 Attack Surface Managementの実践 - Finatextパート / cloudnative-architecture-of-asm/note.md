# セキュリティベンダー/ユーザー双方の視点で語る、 Attack Surface Managementの実践 - Finatextパート / cloudnative-architecture-of-asm

ref: <https://speakerdeck.com/stajima/cloudnative-architecture-of-asm>

## 従来のASM

- 組織の外部からアクセス可能なIT資産を発見し、その脆弱性を継続的に検出・評価する取り組み
  - IT資産
    - 対象: ドメインやIPアドレスのリスト
    - 取得方法: 管理台帳や、WHOISの情報などを参考に取得する
  - アクセス可能
    - 主にインターネットからアクセス可能なポートが存在することを意味する
    - HTTPやSMTPやSHH等のプロトコルが代表的
  - 脆弱性
    - 主にCVEが伝搬されているような、ソフトウェアの既知の欠陥
    - 設定の不備や機密情報の公開

## クラウドネイティブなASM

従来のASMの要素に加えて

- IT資産
  - 対象: クラウドリソースも含まれる
  - 取得方法: クラウドサービスのAPI等から動的に収集する
- アクセス可能
  - クラウドサービス特有の仕様に基づくアクセス
  - e.g. AWSのIAM Roleに対するAssumeRole
- 脆弱性
  - クラウド特有の仕様に基づく脆弱性
  - e.g. AWSのIAM Roleにおける、Trust Relationshipの設定ミス

![alt text](<assets/CleanShot 2024-12-14 at 16.20.19@2x.png>)

![alt text](<assets/CleanShot 2024-12-14 at 16.20.49@2x.png>)
