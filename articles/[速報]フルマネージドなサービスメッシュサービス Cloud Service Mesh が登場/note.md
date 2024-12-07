# [速報]フルマネージドなサービスメッシュサービス Cloud Service Mesh が登場

ref: <https://zenn.dev/cloud_ace/articles/881608bb25ea14>

Cloud Service MeshはGoogleが提供する、完全管理型のサービスメッシュソリューションで、アプリケーションの管理とスケーリングを簡素化します[1]。これは、以前のAnthos Service MeshとTraffic Directorを統合した新しいサービスです[1]。

## 主な特徴

**グローバルコントロールプレーン**

- GoogleCloud内外の環境で、シームレスなサービスメッシュ運用を実現[1]
- 完全管理型で、コントロールプレーンとデータプレーンのライフサイクル管理を提供[1]

**セキュリティ機能**

- 相互TLS（mTLS）認証による不正アクセスの防止[3]
- すべてのTCP通信の暗号化[3]
- FIPS 140-2検証済みの暗号化モジュールを使用[3]

**可観測性**

- HTTPトラフィックのサービスメトリクスとログの自動取得[3]
- 事前設定されたサービスダッシュボード[3]
- Cloud Monitoring、Cloud Logging、Cloud Traceによる詳細な分析機能[3]

## 主なメリット

**トラフィック管理**

- サービス間通信の詳細な制御が可能[2]
- 高度なルーティング機能とフェイルオーバー機能[2]

**運用の簡素化**

- アプリケーションコードを変更せずにサービスの管理、監視、セキュリティ確保が可能[3]
- 運用チームと開発チームの負担を軽減[3]

**スケーラビリティ**

- Google Cloud環境と外部環境の両方で、グローバルに拡張可能[1]
- 複数のクラスタ環境での運用をサポート[1]

このソリューションは、企業向けの機能性と最小限の管理労力を組み合わせた、統合的なネットワーキングソリューションとして設計されています[1]。

Sources
[1] Cloud Service Mesh: The new Managed Service Mesh by Google <https://gcloud.devoteam.com/blog/cloud-service-mesh-the-new-managed-service-mesh-by-google/>
[2] What is service mesh and why do we need it? - Dynatrace <https://www.dynatrace.com/news/blog/what-is-a-service-mesh/>
[3] Cloud Service Mesh overview | Google Cloud <https://cloud.google.com/service-mesh/docs/overview>
[4] What is a Service Mesh? Key Features, Benefits & Demo - Spacelift <https://spacelift.io/blog/what-is-a-service-mesh>
