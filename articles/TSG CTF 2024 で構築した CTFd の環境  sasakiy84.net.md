---
title: "TSG CTF 2024 で構築した CTFd の環境 | sasakiy84.net"
source: "https://blog.sasakiy84.net/articles/tsgctf-2024-ctfd/"
author:
  - "[[sasakiy84]]"
published: 2024-12-19
created: 2025-09-13
description: |
  TSG CTF 2024開催にあたり、Google Cloud Platform (GCP) 上でCTFd環境を構築した際の技術的なメモとパフォーマンスメトリクスの記録。CTFのインフラ担当者向けに、構成図、各コンポーネントの設定、注意点、費用などをまとめた参考情報。
tags:
  - "CTF"
  - "CTFd"
  - "GCP"
  - "Google Cloud"
  - "インフラ"
---

この記事は、Google Cloud Platform (GCP) を利用してTSG CTF 2024のCTFd環境を構築した際の技術的な記録とメトリクスをまとめたものです。将来的にCTFのインフラを担当する人への参考情報として提供されています。

## 大まかな構成

最終的な構成図は以下の通りです。

![サーバーの構成図](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-architecture.ewCxvtbv_Z1BIXK2.webp)

**注意点:**

* **CTFdインスタンス**: 当初2台構成を予定していましたが、ログインエラーの問題が発生したため、最終的には1台の高性能インスタンスに全ての通信を流しました。これはCTFdの`secret`を明示的に指定しなかったことが原因と考えられ、次回は環境変数で設定することで解決できる見込みです。
* **ネットワーク**: 問題サーバーやヘルスチェックサーバーは別のネットワークで稼働しており、本構成図からは省略されています。
* **認証**: リハーサル環境では、各インスタンスのサイドカーとして`oauth2proxy`を立てて認証を行いました。
* **終了後**: プラグインを利用してスコアボードを静的ファイルとしてエクスポートし、CTFdインスタンスは停止しました。

**事前準備:**

* `gcloud`コマンドのインストールとログイン
* Mailgunの認証情報
* Cloud DNSでのドメイン設定
* 予算アラートの設定 (今回はGCPからクレジット提供あり)
* 関連リポジトリの確認

CTFの規模は899ユーザー、496チームで、サーバーは開始時に一時的に重くなったものの、ほぼ安定して稼働しました。

## 各コンポーネントの説明

### ネットワークを作る

VPCネットワークを作成し、以降のリソースがこのネットワークに所属するように設定します。

### Cloud SQL をたてる

* **スペック**: MySQL 8.0.31, 2vCPU, 8GBメモリ, 100GBストレージ (Enterpriseエディション)
* **接続**: パブリックIPは無効化。`root`ユーザーのパスワードを控えておく。
* **データベース**: `ctfd`という名前でデータベースを作成 (文字セット: `utf8mb4`)。

**リソース使用率:**
ストレージは1GB強、メモリは最大12%、CPUは最大17%の使用率で、十分な余裕がありました。

![Cloud SQL の CPU 利用率](https://blog.sasakiy84.net/img/tsgctf-2024-ctfd-sql-cpu.png)

### Redis をたてる

Memorystore for Redisを利用。

* **スペック**: v7.0, レプリカ数0, 最大メモリ2GB
* **メモリ使用量**: 常に0.01GB程度で、十分な余裕がありました。

### Cloud Storage を設定する

問題の配布ファイルをアップロードするために使用します。

* **設定**: 東京と大阪のデュアルリージョン、Standardストレージクラス。
* **権限**: `allUsers`に対して`Storage レガシー オブジェクト読み取り`ロールを付与し、バケットのリスト権限は与えず、オブジェクトURLを知っている場合のみアクセスできるようにします。
* **認証**: CTFdはS3互換APIを使用するため、Cloud StorageでHMACキーを生成して利用します。

### Compute Engine を立てて CTFd を起動する

* **スペック**: `e2-standard-8` (8vCPU, 32GBメモリ)
* **OS**: Container-Optimized OS
* **ファイアウォール**: HTTP、HTTPS、ロードバランサのヘルスチェックを許可。
* **IPアドレス**: 外部IPアドレスを付与（本来は不要なはずが、外部通信のために必要だった）。

`docker compose`を使用してCTFdを起動します。Container-Optimized OSには`docker compose`コマンドがないため、Dockerコンテナ経由で実行します。

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD:$PWD" -w="$PWD" docker:24.0.9 compose up -d
```

**注意点:**
複数のインスタンスで`SECRET_KEY`環境変数を共通の値に設定しないと、ロードバランサ経由でログインエラーが確率的に発生します。

### Compute Engine の CTFd 関連の資料

#### ctfd/docker-compose.yaml

```yaml
services:
    ctfd:
        build: .
        user: root
        restart: always
        ports:
            - "8000:8000"
        environment:
            - SECRET_KEY=tsgctf-foo-2024
            - UPLOAD_FOLDER=/var/uploads
            - DATABASE_URL=mysql+pymysql://root:pass@IPADDRESS/ctfd
            - REDIS_URL=redis://IPADDRESS:6379
            - WORKERS=1
            - LOG_FOLDER=/var/log/CTFd
            - ACCESS_LOG=-
            - ERROR_LOG=-
            - REVERSE_PROXY=true
            - MAILFROM_ADDR=tsgctf@tsg.ne.jp
            - MAIL_SERVER=smtp.mailgun.org
            - MAIL_PORT=465
            - MAIL_USEAUTH=True
            - MAIL_USERNAME=tsgctf@tsg.ne.jp
            - MAIL_PASSWORD=
            - UPLOAD_PROVIDER=s3
            - AWS_ACCESS_KEY_ID=
            - AWS_SECRET_ACCESS_KEY=
            - AWS_S3_BUCKET=bucketname
            - AWS_S3_ENDPOINT_URL=https://bucketname.storage.googleapis.com
        volumes:
            - .data/CTFd/logs:/var/log/CTFd
            - .data/CTFd/uploads:/var/uploads
            - .:/opt/CTFd:ro
        networks:
            default:
            internal:

    nginx:
        image: nginx:stable
        restart: always
        volumes:
            - ./conf/nginx/http.conf:/etc/nginx/nginx.conf
        ports:
            - 80:80
        depends_on:
            - ctfd

networks:
    default:
    internal:
```

#### conf/oauth2-proxy/config.cfg (リハーサル用)

```cfg
http_address = "0.0.0.0:4180"
provider = "github"
client_id = "id"
client_secret = "secret"
redirect_url = "https://to-rehearsal-domain-of.tsg.ne.jp/oauth2/callback"
cookie_secret = "cookiesecret"
github_org = "tsg-ut"
email_domains = ["*"]
pass_access_token = true
pass_authorization_header = true
set_xauthrequest = true
whitelist_domains = ["*.tsg.ne.jp"]
```

#### conf/nginx/http.conf

```nginx
worker_processes 4;
events {
  worker_connections 1024;
}
http {
  upstream app_servers {
    server ctfd:8000;
  }
  server {
    listen 80;
    gzip on;
    client_max_body_size 4G;

    location /oauth2/ {
        proxy_pass       http://auth2proxy:4180/oauth2/;
        proxy_set_header X-Real-IP               $remote_addr;
        proxy_set_header X-Scheme                $scheme;
        proxy_set_header X-Auth-Request-Redirect $request_uri;
        # ... (他ヘッダー)
    }

   location = /oauth2/auth {
        proxy_pass                        http://auth2proxy:4180/oauth2/auth;
        # ... (他ヘッダー)
    }

    location /events {
      proxy_pass http://app_servers;
      # ... (他設定)
    }

    location / {
      proxy_pass http://app_servers;
      # ... (他設定)
      auth_request /oauth2/auth;
      error_page 401 = /oauth2/sign_in;
      # ... (他設定)
    }
  }
}
```

### 当日のサーバー情報 (メトリクス)

![CTFd のインスタンスの CPU メトリクス](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-ce-cpu.BiEAMWde_X6Uzk.webp)
![CTFd のインスタンスのネットワークメトリクス](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-ce-network.DAXPCZSy_ZVpqll.webp)
![CTFd のインスタンスの Disk IO メトリクス](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-ce-diskio.Cttmf7T__4fdhC.webp)
![CTFd のインスタンスのパケット数メトリクス](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-ce-packet.BSrxOnCo_9tfhW.webp)

## LB をたてる

* グローバル外部アプリケーションロードバランサを作成。
* バックエンドサービスにインスタンスグループを指定し、ゾーン分散を行います。
* Managed SSLを利用するためにこのタイプを選択しました。

## ドメインを設定する

* Cloud DNSでAレコードを設定。
* 証明書の取得に時間がかかる場合があるため、早めに設定することが推奨されます。

## LB にインスタンスを追加してみる

* 別のゾーンにもう一つのCTFdインスタンスを構築し、そのインスタンスグループをバックエンドサービスに追加することでスケールアウトします。

## 値段

本番環境のみの1日あたりの料金は約4000円で、Compute EngineとCloud SQLが大部分を占めました（この料金にはCTFd以外のサービスも含まれます）。

![１日の値段のグラフ](https://blog.sasakiy84.net/_astro/tsgctf-2024-ctfd-pricing-per-day.Dw7Pz4Ws_vps0C.webp)

リハーサル環境を含めた総費用は約6万円でした。予算計画では、CTF当日だけでなく、リハーサル、登録期間、終了後の問題公開期間も考慮する必要があります。
