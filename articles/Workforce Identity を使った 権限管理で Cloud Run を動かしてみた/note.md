# Workforce Identity を使った 権限管理で Cloud Run を動かしてみた

ref: <https://speakerdeck.com/satohjohn/workforce-identity-woshi-tuta-quan-xian-guan-li-de-cloud-run-wodong-kasitemita>

## Workload Identity ≠ Workforce Identity

### Workload Identity

- **アプリケーションやサービスなどの人間以外のエンティティが、Google CloudのリソースにアクセスするためのID**
- サービスアカウントキーの代わりにフェデレーションIDを使用す
  - これにより、セキュリティリスクを軽減し、ID管理を簡素化する
- k8sやCompute EngineなどのGoogle Cloudサービスで実行されているアプリケーションに適用できる
- オンプレやマルチクラウド環境のワークロードにも使用できる
- 外部IDプロバイダー(IdP)を使用して認証うぃ行う
  - GoogleCloudは、OpenID Connect(OIDC)をサポートしている多くのIdPと連携できる

### Workforce Identity

- **従業員、請負業者、ベンダーなど、組織内の人間がGoogleCloudのリソースにアクセスするためのID**
- Cloud IdentityのGoogle Cloud Directory Sync(GCDS)とはことなり、既存のIdPからGoogle Cloud IDにユーザIDを同期する必要がない
- 属性マッピングと属性条件によるきめ細かなアクセス制御が可能
- シングルサインオン(SSO)を実現し、ユーザエクスペリエンスを向上させることができる

![alt text](<assets/CleanShot 2024-11-27 at 16.58.10@2x.png>)
