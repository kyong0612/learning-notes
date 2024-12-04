# Automatic SSL/TLS

ref: <https://blog.cloudflare.com/introducing-automatic-ssl-tls-securing-and-simplifying-origin-connectivity/>

## 主な変更点

**導入スケジュール**:

- 2024年8月8日: SSL/TLSレコメンダーを有効にしているユーザーに対して提供開始[1]
- 2024年9月16日: 無料プランとProプランのユーザーに提供開始[1]
- その後、BusinessプランとEnterpriseプランのユーザーにも展開予定[1]

**新しい設定オプション**:

- Automatic SSL/TLS: システムが自動的に最適な暗号化モードを選択
- Custom SSL/TLS: 従来通り手動で設定を選択可能[1]

## 技術的な詳細

**SSL/TLSモードの種類**:

- Off: 暗号化なし
- Flexible: ブラウザ-Cloudflare間のみ暗号化
- Full: 証明書の検証なしのHTTPS
- Full (Strict): 証明書検証付きのHTTPS
- Strict (SSL-only origin pull): 常にHTTPS with 証明書検証[1]

**動作の仕組み**:

- SSL/TLSレコメンダーがウェブサイトをクロールし、HTTPとHTTPSの両方でコンテンツをダウンロード[1]
- コンテンツの類似性を分析し、安全に暗号化レベルを上げられるか判断[1]
- サイトの機能を損なわないよう、慎重に設定を変更[1]

## 重要なポイント

- オプトアウトは可能で、移行期間中にCustom SSL/TLSを選択することで従来の設定を維持できます[1]
- 複数のオリジンサーバーを使用する複雑な設定でも、すべてのオリジンで動作する最適な設定を自動的に選択します[1]
- Configuration RulesやPage Rulesで特定のSSL/TLS設定を使用している場合、それらの設定が優先されます[1]

この機能により、Cloudflareは2014年に導入したUniversal SSLの次のステップとして、オリジンサーバーとの接続セキュリティを自動化し、より安全なインターネットの実現を目指しています[1]。

Sources
[1]  <https://blog.cloudflare.com/introducing-automatic-ssl-tls-securing-and-simplifying-origin-connectivity/>
[2] Introducing Automatic SSL/TLS: securing and simplifying origin connectivity <https://blog.cloudflare.com/introducing-automatic-ssl-tls-securing-and-simplifying-origin-connectivity/>
