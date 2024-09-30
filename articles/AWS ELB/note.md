# AWS ELB

ref:
<https://aws.amazon.com/jp/elasticloadbalancing/faqs/>
<https://docs.aws.amazon.com/elasticloadbalancing/>

## 分類

AWS Elastic Load Balancingの4種類のロードバランサー（CLB、ALB、NLB、GWLB）の主な違いは以下のとおり：

1. Classic Load Balancer (CLB)：

- レイヤー4およびレイヤー7で動作
- HTTP、HTTPS、TCP、SSLプロトコルをサポート
- EC2-Classicネットワーク用
- 基本的な負荷分散機能を提供

2. Application Load Balancer (ALB)：

- レイヤー7で動作
- HTTPおよびHTTPSプロトコルをサポート
- コンテンツベースのルーティング、WebSocket、HTTP/2をサポート
- マイクロサービスやコンテナベースのアプリケーションに最適

3. Network Load Balancer (NLB)：

- レイヤー4で動作
- TCP、UDP、TLSプロトコルをサポート
- 超低レイテンシーと高スループットを提供
- 静的IPアドレスをサポート
- PrivateLinkと統合可能

4. Gateway Load Balancer (GWLB)：

- レイヤー3およびレイヤー4で動作
- すべてのIPトラフィックをサポート
- サードパーティ製の仮想アプライアンス（ファイアウォール、侵入検知・防御システムなど）のデプロイに使用
- トランスペアレントなネットワークゲートウェイとして機能

主な選択基準：

- HTTPトラフィックの高度なルーティングが必要な場合：ALB
- 超低レイテンシーや静的IPが必要な場合：NLB
- サードパーティ製のネットワークアプライアンスを使用する場合：GWLB
- レガシーEC2-Classicネットワークを使用している場合：CLB

## GoogleCloudとの違い

TODO:
