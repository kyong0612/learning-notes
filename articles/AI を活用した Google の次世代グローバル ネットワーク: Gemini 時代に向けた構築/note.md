# AI を活用した Google の次世代グローバル ネットワーク: Gemini 時代に向けた構築

ref: <https://cloud.google.com/blog/ja/products/networking/google-global-network-principles-and-innovations>

![Google AI powered network](https://storage.googleapis.com/gweb-cloudblog-publish/images/Google_AI_powered.max-2500x2500.jpg)

この記事は、Google が AI の時代に対応するために、どのようにグローバルネットワークを進化させてきたか、そしてこれからどのように進化させていくかについて解説しています。

## Google のネットワークの進化

Google のネットワークは、過去25年間で3つの主要な時代を経て進化してきました。

1. **インターネット時代:**
    * 検索、マップ、Gmail などの信頼性と低レイテンシを重視。
    * 主なイノベーション: B2 ネットワーク, Bandwidth Enforcer (BwE), B4 (ソフトウェア定義バックボーン), Orion (SDNコントローラ), Jupiter (ペタビット規模のSDNデータセンターファブリック)。
2. **ストリーミング時代:**
    * YouTube などの動画ストリーミングに対応するため、低ジッターで高品質な配信を重視。
    * 主なイノベーション: Google Global Cache, Espresso, QUIC, TCP BBR。
3. **クラウド時代:**
    * クラウドコンピューティングの登場により、復元力、マルチテナンシー、セキュリティ強化が求められる。
    * 主なイノベーション: Andromeda, gRPC, PSP, Swift。

現在、Google のネットワークは200万マイル超の光ファイバー、33本の海底ケーブルへの投資、202か所のネットワークエッジロケーション、3,000か所を超えるCDNロケーションを有し、Google Cloud の42のリージョンと127のゾーンを接続しています。

![Google Network Eras](https://storage.googleapis.com/gweb-cloudblog-publish/images/1_-_GGN_Eras.max-2200x2200.jpg)

## AI によるかつてないネットワーク需要の高まり

AI 時代は、ネットワークアーキテクチャに以下の4つの観点から根本的な見直しを迫っています。

* **広域ネットワーク (WAN) が新たなローカルエリアネットワーク (LAN) に:** 大規模な基盤モデルのトレーニングは複数のキャンパスや都市にまたがり、スケーラビリティのニーズが非常に高まっています。バースト性の高いエレファントフローの管理が重要です。
* **AI ではサービス停止の影響をゼロにする必要がある:** AIモデルのトレーニングや推論はリソースを大量に消費するため、ネットワーク障害は許容されません。
* **セキュリティと管理のニーズの高まり:** AIモデルと学習データの完全性を保護し、コンプライアンス要件に対応する必要があります。
* **効果的な運用:** SRE原則の策定、運用へのAI/ML活用、障害の根本原因特定など、効率的で持続可能なソリューションが求められます。

## ネットワーク設計の新たな原則とイノベーション

これらの課題に対応するため、Google は4つの新たな設計原則を策定し、次世代ネットワークを構築しています。

![Google Network Design Principles](https://storage.googleapis.com/gweb-cloudblog-publish/images/2_-_GGN_Design_Principles.max-2200x2200.jpg)

1. **飛躍的なスケーラビリティ:** AIトラフィックを処理するため、膨大なデータとトラフィックを処理できる能力とアジリティが求められます。「WANが新たなLANとなり、大陸がデータセンターとなる」という考え方です。
2. **9s を超える信頼性:** 従来の「x-9s」の可用性指標では不十分であり、確定的パフォーマンス、限定的な影響範囲、迅速な障害軽減を目指します。
3. **インテント主導のプログラマビリティ:** セキュリティ、コンプライアンス、復元力、パフォーマンス、効率性など、ユーザー毎の異なる要件に対応するため、完全にインテント主導の高度にプログラム可能なネットワークが必要です。
4. **自律型ネットワーク:** 人手を介さずに24時間365日大規模に稼働できる自律型ネットワークを目指します。

これらの原則に基づき、以下の進化を遂げています。

* **マルチシャードネットワーク:** 水平方向のスケーラビリティを実現。各シャードは独立し、WAN帯域幅は2020年から2025年にかけて7倍に増加。
* **マルチシャードの分離、リージョンの分離、プロテクティブ再ルーティング:** 高レベルの復元力を実現し、障害の影響を最小限に抑えます。プロテクティブ再ルーティングにより、停止の累計時間が最大93%削減。
* **完全にインテント主導型の細部にわたるプログラマビリティ:** SDNコントローラ、標準API、MALT (Multi-Abstraction Layer Topology representation) などのユニバーサルネットワークモデルを使用。
* **自律型ネットワーク:** MLを活用し、GNN (グラフニューラルネットワーク) を用いてネットワークのデジタルツインを作成。これにより、停止の予測・防止、障害原因の迅速な特定、容量計画の最適化が可能になり、障害軽減までの時間が数時間から数分に短縮。

## AI の可能性を最大限に引き出すネットワーク

Google Cloud の顧客にとって、この次世代ネットワークは以下のメリットを提供します。

* AI を効果的にデプロイ・活用できる容量、弾力性、スケール、信頼性。
* 24時間365日のアプリの復元力。
* ゼロトラストの原則に基づくセキュリティ。
* AI/ML のニーズを満たすパフォーマンス。
* AI を活用した効率化によるメンテナンス作業の削減、迅速な復旧、ROI向上。

Cloud WAN を使用することで、Google のグローバルネットワークを活用して企業間を接続できます。

## 結論と今後の展望

Google はネットワークテクノロジーの限界を押し広げ、AI 時代のお客様に向けて変革の力を提供しています。詳細は Google Cloud Next 2025 のセッションや今後のブログ投稿で紹介される予定です。

**重要なポイント・結論:**

* Google のネットワークは、インターネット、ストリーミング、クラウドの各時代を経て進化し、現在は AI 時代への対応を進めている。
* AI の要求 (大規模スケーラビリティ、ゼロダウンタイム、高度なセキュリティ、効率的な運用) に応えるため、ネットワーク設計の根本的な見直しが行われた。
* 「飛躍的なスケーラビリティ」「9sを超える信頼性」「インテント主導のプログラマビリティ」「自律型ネットワーク」を新たな設計原則としている。
* マルチシャードアーキテクチャ、プロテクティブ再ルーティング、MLを活用した自律運用などの技術革新により、これらの原則を実現している。
* これにより、顧客は AI の可能性を最大限に引き出すための強力なネットワーク基盤を利用できる。

**制限事項:**

* この記事内では、具体的な数値データ (例: 「9sを超える信頼性」の具体的なSLA目標値など) の詳細な記述は限定的です。
* 技術的な詳細よりも、概念や方向性、主要なイノベーションに焦点が当てられています。より深い技術的詳細については、関連ドキュメントやセッションを参照する必要があるかもしれません。
