# AWS WAFを完全に理解する ~WAFの基礎からv2の変更点まで~

ref: <https://dev.classmethod.jp/articles/fully-understood-aws-waf-v2/>

- 利用形態
  - CloudFront
  - ALB
  - API Gateway
- AWS WAFの用語
  - WebACL
    - 1つのWAFの設定の塊
    - CloudFront, ALB, API Gatewayに割り当てる単位
    - 1つのリソースに対して1つのWebACLのみ割り当て可能
    - 複数のリソースに対して同じWebACLを割り当て可能
    - 複数のルール/ルールグループを包含する
  - ルール
    - リクエストに対する条件のまとまり
      - 例えば指定したIPにマッチするか、特定のクエリストリングがあるか等
  - ルールグループ
    - ルールをまとめたもの
    - 事前に定義可能
  - アクション
    - リクエストをルールに照らし合わせた結果をどう扱うかの設定
    - ALLOW/BLOCK/COUNTがある
    - ルール毎にアクションがあり、全てのルールに当たらなければWebACLに設定されたDefault Actionに沿って処理される

- AWS WAF v2の変更点
  - v1 = `AWS WAF Classic`
  - キャパシティユニット導入
    - v1では、ルールが10個までしか登録できなかった
    - v2では10個という制約の代わりに、ルールの数ではなく重みを評価するようになった
      - それがキャパシティユニット
  - AWS マネージドルール
  - ルールの記述方法の変更
  -
