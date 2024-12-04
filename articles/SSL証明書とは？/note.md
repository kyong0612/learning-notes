# SSL証明書とは？

ref: <https://www.cloudflare.com/ja-jp/learning/ssl/what-is-an-ssl-certificate/>

## 基本概念

SSL証明書は、ウェブサイトの配信元サーバーにホストされるデータファイルで、HTTPSを使用可能にする仕組みです[1]。このファイルには、ウェブサイトの公開鍵、ウェブサイトのID、その他の重要な情報が含まれています[1]。

## 主要な機能

**暗号化**
公開鍵と秘密鍵のペアを使用して、データの暗号化と復号化を行います。公開鍵で暗号化されたデータは、対応する秘密鍵でのみ解読が可能です[1]。

**認証**
クライアントが正しいサーバーと通信していることを証明し、なりすまし攻撃を防止します[1]。

**HTTPS対応**
SSL証明書により、ウェブサイトはHTTPSプロトコルを使用でき、より安全な通信が可能になります[1]。

## 証明書の取得方法

**認証局（CA）経由**

- 信頼できる第三者機関（CA）から取得
- CAが証明書にデジタル署名を付与
- 多くの場合、有料で発行[1]

**自己署名証明書**
独自に証明書を作成することも技術的には可能ですが、ブラウザから信頼されず、「セキュアでない」と表示される可能性があります[1]。

## Cloudflareの無料SSL

Cloudflareは2014年9月からUniversal SSLを提供しており、以下の特徴があります：

- 複数の顧客ドメイン間でSSL証明書を共有
- 世界中に分散したCDNを活用
- 企業向けにカスタマイズされた証明書も提供[1]

Sources
[1]  <https://www.cloudflare.com/ja-jp/learning/ssl/what-is-an-ssl-certificate/>
[2] SSL証明書とは？無料で取得できる方法は？ <https://www.cloudflare.com/ja-jp/learning/ssl/what-is-an-ssl-certificate/>
