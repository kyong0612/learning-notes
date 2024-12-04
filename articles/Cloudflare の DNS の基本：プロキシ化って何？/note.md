# Cloudflare の DNS の基本：プロキシ化って何？

ref: <https://dev.classmethod.jp/articles/cloudflare-dns-basics-what-is-proxy/>

## DNS設定の基本

Cloudflareを利用する際、最初にネームサーバーを登録してDNSの管理を行います。この際、A レコード、AAAA レコード、CNAMEの設定時に「プロキシ化」というオプションが表示されます[1]。

## プロキシ化の仕組み

**通常のDNS設定**

- オリジンのIPアドレスまたはFQDNが直接返される
- クライアントは直接オリジンサーバーにアクセスする[1]

**プロキシ化された場合**

- DNS問い合わせに対してCloudflare Anycast IPが返される
- クライアントはCloudflareのネットワークを経由してオリジンサーバーにアクセスする
- Cloudflareがリバースプロキシとして機能する[1]

## プロキシ化のメリット

- アクセス経路の最適化によるパフォーマンス向上
- グローバルで同一IPアドレスの使用が可能
- オリジンサーバーの隠蔽による セキュリティ強化
- Waiting Roomや認証などの追加機能の容易な統合[1]

## 注意点

- プロキシ化すると、DNS登録したIPアドレスは問い合わせ結果に返ってこない
- フォワードプロキシやファイアウォールの設定に注意が必要
- サブドメインのサポートはEnterpriseプランのみ[1]

Sources
[1]  <https://dev.classmethod.jp/articles/cloudflare-dns-basics-what-is-proxy/>
[2] Cloudflare の DNS の基本：プロキシ化って何？ | DevelopersIO <https://dev.classmethod.jp/articles/cloudflare-dns-basics-what-is-proxy/>
