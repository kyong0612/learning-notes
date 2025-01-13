# go-proxy-connect-method

- goを使ってCONNECT methodを使ったプロキシサーバを作成するサンプル

## 使い方

```bash
go run main.go

```

```bash
curl -v --http1.1 --proxy http://127.0.0.1:10800/ https://google.com

*   Trying 127.0.0.1:10800...
* Connected to 127.0.0.1 (127.0.0.1) port 10800
* CONNECT tunnel: HTTP/1.1 negotiated
* allocate connect buffer
* Establish HTTP proxy tunnel to google.com:443
> CONNECT google.com:443 HTTP/1.1
> Host: google.com:443
> User-Agent: curl/8.7.1
> Proxy-Connection: Keep-Alive
> 
< HTTP/1.1 200 OK
< Content-Length: 0
* Ignoring Content-Length in CONNECT 200 response
< 
* CONNECT phase completed
* CONNECT tunnel established, response 200
* ALPN: curl offers http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: CN=*.google.com
*  start date: Dec  9 08:36:18 2024 GMT
*  expire date: Mar  3 08:36:17 2025 GMT
*  subjectAltName: host "google.com" matched cert's "google.com"
*  issuer: C=US; O=Google Trust Services; CN=WR2
*  SSL certificate verify ok.
* using HTTP/1.x
> GET / HTTP/1.1
> Host: google.com
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 301 Moved Permanently
< Location: https://www.google.com/
< Content-Type: text/html; charset=UTF-8
< Content-Security-Policy-Report-Only: object-src 'none';base-uri 'self';script-src 'nonce-8nHKmySc_wt1QOsiD5cq3g' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
< Date: Mon, 13 Jan 2025 05:04:28 GMT
< Expires: Wed, 12 Feb 2025 05:04:28 GMT
< Cache-Control: public, max-age=2592000
< Server: gws
< Content-Length: 220
< X-XSS-Protection: 0
< X-Frame-Options: SAMEORIGIN
< Alt-Svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
< 
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://www.google.com/">here</A>.
</BODY></HTML>
* Connection #0 to host 127.0.0.1 left intact
```

#＃ CONNECT メソッドとは

- 目的
  - **「暗号化通信（主にHTTPS）をプロキシサーバー経由で中継できるようにし、セキュリティを維持する」**
---

- **HTTPSなど暗号化通信のプロキシ利用が困難だった**  
  - HTTPではプロキシサーバーがリクエストを読み書きできるが、HTTPSのように暗号化されている通信ではプロキシがリクエスト内容を解釈できない。  
  - **課題**: プロキシを経由しても、クライアントとサーバーの暗号化（TLS/SSL）を維持したまま通信できる仕組みが必要。

- **CONNECTメソッドの役割：トンネルの確立**  
  - クライアント（ブラウザなど）がプロキシサーバーに「特定ホストへのトンネルを張ってくれ」と要求し、成功すると `200 Connection Established` が返される。  
  - **課題解決**: プロキシサーバーは暗号化されたパケットをそのまま転送する「中継役」になり、クライアントとサーバーのエンドツーエンドのセキュア通信が実現される。

- **プロキシ環境でもHTTPSセキュリティを維持**  
  - CONNECTメソッドを用いることで、クライアントとサーバー間のTLSハンドシェイクをプロキシが介しても妨げない。  
  - **課題解決**: オフィスなどのネットワーク環境下でも、HTTPSを含む暗号化通信が安全かつ透過的に利用可能。

- **様々なプロトコルのトンネリングにも応用可能**  
  - CONNECTメソッドは、HTTPS以外のTLS通信（例：WebSocket over TLS）やVPNのトンネルなどにも利用できる。  
  - **課題解決**: 「特定ポートに対してプロキシを通して直接通信したい」という要望に応える仕組みとして機能。

- **プロキシによる通信制御の可能性と課題**  
  - プロキシはCONNECT要求に対し、どのホスト・ポートへのトンネル接続を許可するかを制御できる。  
  - **追加課題**: CONNECTメソッドを利用して不正なトラフィックを隠す可能性があるため、プロキシ側でのセキュリティ設定・ログ監視が重要。

