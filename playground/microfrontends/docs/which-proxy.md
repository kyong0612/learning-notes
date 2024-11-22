# proxy選定

## Traefik

**主な特徴**

- コンテナ環境に特化したモダンなリバースプロキシ
- 自動的なサービスディスカバリーと設定が可能
- Let's Encryptとの統合によるHTTPS対応が容易[1][3]

**メリット**

- パフォーマンスを重視した設計で高速なトラフィックルーティング
- マイクロサービスとコンテナ環境との相性が良好
- 動的な設定変更に対応[3]

**デメリット**

- 設定の構文が複雑で直感的でない
- Nginxと比べて機能が限定的[4]

## Nginx

**主な特徴**

- 伝統的で実績のあるWebサーバー/リバースプロキシ
- 静的ファイル配信も可能
- 豊富な機能と拡張性[3]

**メリット**

- 安定性と実績が豊富
- 詳細な設定が可能
- 軽量で高速[1]

**デメリット**

- 設定が複雑で手動での更新が必要
- 動的な環境での管理が煩雑[3]

## Caddy

**主な特徴**

- モダンで使いやすい設計
- 自動HTTPS対応
- シンプルな設定方式[5]

**メリット**

- 設定が簡単で理解しやすい
- HTTP/2とHTTP/3のすぐれたサポート
- 依存関係が少なく導入が容易[5]

**デメリット**

- カスタマイズ性がやや限定的
- メモリ使用量がNginxより若干多い
- 特殊なケースへの対応が難しい場合がある[5]

## 使い分けの指針

| ユースケース | 推奨されるプロキシ |
|------------|-----------------|
| コンテナ環境/マイクロサービス | Traefik |
| 従来型のWebサーバー環境 | Nginx |
| シンプルな構成の現代的なアプリケーション | Caddy |

Sources
[1] リバースプロキシとしてnginx-proxyの代わりにtraefikを導入 | ikapblog <https://blog.ikappio.com/use-traefik-instead-of-nginx-proxy-as-reverse-proxy/>
[2] Traefik さえ使えば、nginx がリバースプロキシとして動くのは不要！ <https://qiita.com/adwin/items/ccc34ef5f4c88d8fa02c>
[3] Traefik vs Nginx - What's the Difference ? (Pros and Cons) <https://cloudinfrastructureservices.co.uk/traefik-vs-nginx-whats-the-difference-pros-and-cons/>
[4] Reverse Proxy Comparison: Traefik vs. Caddy vs. Nginx (Docker) <https://www.programonaut.com/reverse-proxies-compared-traefik-vs-caddy-vs-nginx-docker/>
[5] Introducing the Caddy webserver VS Nginx and Apache | Net7 Blog <https://www.net7.be/blog/article/caddy_vs_nginx_vs_apache.html>
