---
title: tlsx
source: https://github.com/projectdiscovery/tlsx
author:
  - projectdiscovery
published:
created: 2025-05-20 18:24:31
description: |
  Fast and configurable TLS grabber focused on TLS based data collection.
tags:
  - tls
  - security
  - golang
  - network
  - projectdiscovery
---

[![](https://user-images.githubusercontent.com/8293321/174841003-01a62bad-2ecf-4874-89c4-efa53dd56884.png)](https://user-images.githubusercontent.com/8293321/174841003-01a62bad-2ecf-4874-89c4-efa53dd56884.png)

[![](https://camo.githubusercontent.com/89d810499c75c65e83a36262cbffdebda6a1e3cee4fd8e97bcd9a04d9d742262/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d5f7265642e737667)](https://opensource.org/licenses/MIT)
[![](https://camo.githubusercontent.com/a9ca205728d5bc7f1bd24decec4b15dbce0be1cc674326bcd193e52f15655f16/68747470733a2f2f676f7265706f7274636172642e636f6d2f62616467652f6769746875622e636f6d2f70726f6a656374646973636f766572792f746c7378)](https://goreportcard.com/badge/github.com/projectdiscovery/tlsx)
[![](https://camo.githubusercontent.com/26bba51d8d897382b5f689ad3ba8d305dae27f5ee1a810c4f5a15cf7b16a9417/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f676f2d7265666572656e63652d626c7565)](https://pkg.go.dev/github.com/projectdiscovery/tlsx/pkg/tlsx)
[![](https://camo.githubusercontent.com/0ed692535eba429cdee914ea6d872eb6a62530771d39e87ed5ccc329e87425c2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f70726f6a656374646973636f766572792f746c7378)](https://github.com/projectdiscovery/tlsx/releases)
[![](https://camo.githubusercontent.com/a4a2a2d47c4cef73237f6f3770448bf2ea51b8571a772b1a9c8ec4c5ab73d50a/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f70646973636f76657279696f2e7376673f6c6f676f3d74776974746572)](https://twitter.com/pdiscoveryio)
[![](https://camo.githubusercontent.com/af2c05f56a8d3837fdf1f7000afe043ecb1d984191261d1c1e2bd2a519698be1/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3639353634353233373431383133313530372e7376673f6c6f676f3d646973636f7264)](https://discord.gg/projectdiscovery)

[Features](#features) •
[Installation](#installation) •
[Usage](#usage) •
[Running tlsx](#running-tlsx) •
[Join Discord](https://discord.gg/projectdiscovery)

tlsxは、TLSベースのデータ収集と分析に焦点を当てた、高速で設定可能なTLSグラバーです。

## 主な機能 (Features)

[![image](https://user-images.githubusercontent.com/8293321/174847743-0e229545-2431-4b4c-9029-878f218ad0bc.png)](https://user-images.githubusercontent.com/8293321/174847743-0e229545-2431-4b4c-9029-878f218ad0bc.png)

* 高速かつ完全に設定可能なTLS接続
* TLS接続のための複数のモード
* 複数のTLSプローブ
* 古いTLSバージョンのための自動TLSフォールバック
* Pre Handshake TLS接続（早期終了）
* カスタマイズ可能な暗号 / SNI / TLS選択
* JARM/JA3 TLSフィンガープリント
* TLS設定不備の検出
* ASN、CIDR、IP、ホスト、URL入力のサポート
* 標準入出力およびTXT/JSON出力

## インストール方法 (Installation)

tlsxを正常にインストールするには、**Go 1.21**が必要です。インストールするには、以下のコマンドを実行するか、[リリースパージ](https://github.com/projectdiscovery/tlsx/releases)からコンパイル済みのバイナリをダウンロードしてください。

```
go install github.com/projectdiscovery/tlsx/cmd/tlsx@latest
```

## 基本的な使い方 (Usage)

```
tlsx -h
```

これにより、ツールのヘルプが表示されます。サポートされているすべてのスイッチは以下の通りです。

```
TLSX is a tls data gathering and analysis toolkit.

Usage:
  tlsx [flags]

Flags:
INPUT:
   -u, -host string[]  target host to scan (-u INPUT1,INPUT2)
   -l, -list string    target list to scan (-l INPUT_FILE)
   -p, -port string[]  target port to connect (default 443)

SCAN-MODE:
   -sm, -scan-mode string     tls connection mode to use (ctls, ztls, openssl, auto) (default "auto")
   -ps, -pre-handshake        enable pre-handshake tls connection (early termination) using ztls
   -sa, -scan-all-ips         scan all ips for a host (default false)
   -iv, -ip-version string[]  ip version to use (4, 6) (default 4)

PROBES:
   -san                     display subject alternative names
   -cn                      display subject common names
   -so                      display subject organization name
   -tv, -tls-version        display used tls version
   -cipher                  display used cipher
   -hash string             display certificate fingerprint hashes (md5,sha1,sha256)
   -jarm                    display jarm fingerprint hash
   -ja3                     display ja3 fingerprint hash (using ztls)
   -wc, -wildcard-cert      display host with wildcard ssl certificate
   -tps, -probe-status      display tls probe status
   -ve, -version-enum       enumerate and display supported tls versions
   -ce, -cipher-enum        enumerate and display supported cipher
   -ct, -cipher-type value  ciphers types to enumerate. possible values: all/secure/insecure/weak (comma-separated) (default all)
   -ch, -client-hello       include client hello in json output (ztls mode only)
   -sh, -server-hello       include server hello in json output (ztls mode only)
   -se, -serial             display certificate serial number

MISCONFIGURATIONS:
   -ex, -expired      display host with host expired certificate
   -ss, -self-signed  display host with self-signed certificate
   -mm, -mismatched   display host with mismatched certificate
   -re, -revoked      display host with revoked certificate
   -un, -untrusted    display host with untrusted certificate

CONFIGURATIONS:
   -config string               path to the tlsx configuration file
   -r, -resolvers string[]      list of resolvers to use
   -cc, -cacert string          client certificate authority file
   -ci, -cipher-input string[]  ciphers to use with tls connection
   -sni string[]                tls sni hostname to use
   -rs, -random-sni             use random sni when empty
   -rps, -rev-ptr-sni           perform reverse PTR to retrieve SNI from IP
   -min-version string          minimum tls version to accept (ssl30,tls10,tls11,tls12,tls13)
   -max-version string          maximum tls version to accept (ssl30,tls10,tls11,tls12,tls13)
   -cert, -certificate          include certificates in json output (PEM format)
   -tc, -tls-chain              include certificates chain in json output
   -vc, -verify-cert            enable verification of server certificate
   -ob, -openssl-binary string  OpenSSL Binary Path
   -hf, -hardfail               strategy to use if encountered errors while checking revocation status

OPTIMIZATIONS:
   -c, -concurrency int  number of concurrent threads to process (default 300)
   -cec, -cipher-concurrency int  cipher enum concurrency for each target (default 10)
   -timeout int          tls connection timeout in seconds (default 5)
   -retry int            number of retries to perform for failures (default 3)
   -delay string         duration to wait between each connection per thread (eg: 200ms, 1s)

UPDATE:
   -up, -update                 update tlsx to latest version
   -duc, -disable-update-check  disable automatic tlsx update check

OUTPUT:
   -o, -output string  file to write output to
   -j, -json           display output in jsonline format
   -dns                display unique hostname from SSL certificate response
   -ro, -resp-only     display tls response only
   -silent             display silent output
   -nc, -no-color      disable colors in cli output
   -v, -verbose        display verbose output
   -version            display project version

DEBUG:
   -health-check, -hc  run diagnostic check up
```

## tlsxをライブラリとして使用する

tlsxをライブラリとして使用する例は、[examples](/projectdiscovery/tlsx/blob/main/examples)フォルダにあります。

## tlsxの実行 (Running tlsx)

### tlsxの入力 (Input for tlsx)

**tlsx**はTLS接続を行うために**IP**を必要とし、以下に示す複数の形式を受け付けます。

```
AS1449 # ASN input
173.0.84.0/24 # CIDR input
93.184.216.34 # IP input
example.com # DNS input
example.com:443 # DNS input with port
https://example.com:443 # URL input port
```

入力ホストは`-host / -u`フラグを使用して指定でき、カンマ区切りの入力で複数の値を指定できます。同様に、ファイル入力は`-list / -l`フラグを使用してサポートされます。

カンマ区切りホスト入力の例：

```
tlsx -u 93.184.216.34,example.com,example.com:443,https://example.com:443 -silent
```

ファイルベースのホスト入力の例：

```
tlsx -list host_list.txt
```

**ポート入力:**

**tlsx**はデフォルトでポート**443**に接続しますが、これは`-port / -p`フラグを使用してカスタマイズできます。単一または複数のポートをカンマ区切り入力または接続するポートのリストを含む改行区切りファイルで指定できます。

カンマ区切りポート入力の例：

```
tlsx -u hackerone.com -p 443,8443
```

ファイルベースのポート入力の例：

```
tlsx -u hackerone.com -p port_list.txt
```

**注意:**

> 入力ホストにポートが含まれている場合（例: `8.8.8.8:443` または `hackerone.com:8443`）、ホストで指定されたポートが、デフォルトまたは `-port / -p` フラグで指定されたポートの代わりに使用されます。

### TLSプローブ (デフォルト実行)

これにより、指定されたCIDR範囲に対してツールが実行され、ポート443でtls接続を受け入れるホストが返されます。

```
$ echo 173.0.84.0/24 | tlsx

  _____ _    _____  __
 |_   _| |  / __\ \/ /
   | | | |__\__ \>  <
   |_| |____|___/_/\_\  v0.0.1

    projectdiscovery.io

[WRN] Use with caution. You are responsible for your actions.
[WRN] Developers assume no liability and are not responsible for any misuse or damage.

173.0.84.69:443
173.0.84.67:443
173.0.84.68:443
173.0.84.66:443
173.0.84.76:443
173.0.84.70:443
173.0.84.72:443
```

### SAN/CNプローブ

TLS証明書には、`-san`、`-cn`フラグを使用して抽出できる**subject alternative name**および**common name**フィールドの下にDNS名が含まれています。

```
$ echo 173.0.84.0/24 | tlsx -san -cn -silent

173.0.84.104:443 [uptycspay.paypal.com]
173.0.84.104:443 [api-3t.paypal.com]
# ... (以下同様の出力が続くため省略)
```

自動化を容易にするために、オプションで`-resp-only`フラグを使用して、CLI出力にDNS名のみをリストできます。

```
$ echo 173.0.84.0/24 | tlsx -san -cn -silent -resp-only

api-aa-3t.paypal.com
pilot-payflowpro.paypal.com
# ... (以下同様の出力が続くため省略)
```

TLS証明書から取得した**サブドメイン**は、さらに検査するために他のPDツールにパイプできます。これは、tlsサブドメインを**[dnsx](https://github.com/projectdiscovery/dnsx)**にパイプしてパッシブサブドメインをフィルタリングし、**[httpx](https://github.com/projectdiscovery/httpx)**に渡してアクティブなWebサービスを実行しているホストをリストする例です。

```
$ echo 173.0.84.0/24 | tlsx -san -cn -silent -resp-only | dnsx -silent | httpx

    __    __  __       _  __
   / /_  / /_/ /_____ | |/ /
# ... (httpxの出力が続くため省略)
```

### TLS / 暗号プローブ

```
$ subfinder -d hackerone.com | tlsx -tls-version -cipher

mta-sts.hackerone.com:443 [TLS1.3] [TLS_AES_128_GCM_SHA256]
hackerone.com:443 [TLS1.3] [TLS_AES_128_GCM_SHA256]
# ... (以下同様の出力が続くため省略)
```

## TLS設定不備 (TLS Misconfiguration)

### 期限切れ / 自己署名 / 不一致 / 失効 / 信頼できない証明書

ホストのリストをtlsxに提供して、**期限切れ / 自己署名 / 不一致 / 失効 / 信頼できない**証明書を検出できます。

```
$ tlsx -l hosts.txt -expired -self-signed -mismatched -revoked -untrusted

  _____ _    _____  __
 |_   _| |  / __\ \/ /
   | | | |__\__ \>  <
   |_| |____|___/_/\_\  v0.0.1

    projectdiscovery.io

[WRN] Use with caution. You are responsible for your actions.
[WRN] Developers assume no liability and are not responsible for any misuse or damage.

wrong.host.badssl.com:443 [mismatched]
self-signed.badssl.com:443 [self-signed]
expired.badssl.com:443 [expired]
revoked.badssl.com:443 [revoked]
untrusted-root.badssl.com:443 [untrusted]
```

### [JARM](https://engineering.salesforce.com/easily-identify-malicious-servers-on-the-internet-with-jarm-e095edac525a/) TLSフィンガープリント

```
$ echo hackerone.com | tlsx -jarm -silent

hackerone.com:443 [29d3dd00029d29d00042d43d00041d5de67cc9954cc85372523050f20b5007]
```

### [JA3](https://github.com/salesforce/ja3) TLSフィンガープリント

```
$ echo hackerone.com | tlsx -ja3 -silent

hackerone.com:443 [20c9baf81bfe96ff89722899e75d0190]
```

### JSON出力 (JSON Output)

**tlsx**は、特定のデータをクエリするために複数のプローブフラグをサポートしていますが、すべての情報は常にJSON形式で利用可能です。自動化と後処理のためには、`-json`出力を使用するのが最も便利なオプションです。

```
echo example.com | tlsx -json -silent | jq .
```

```json
{
  "timestamp": "2022-08-22T21:22:59.799053+05:30",
  "host": "example.com",
  "ip": "93.184.216.34",
  "port": "443",
  "probe_status": true,
  "tls_version": "tls13",
  "cipher": "TLS_AES_256_GCM_SHA384",
  "not_before": "2022-03-14T00:00:00Z",
  "not_after": "2023-03-14T23:59:59Z",
  "subject_dn": "CN=www.example.org, O=Internet Corporation for Assigned Names and Numbers, L=Los Angeles, ST=California, C=US",
  "subject_cn": "www.example.org",
  "subject_org": [
    "Internet Corporation for Assigned Names and Numbers"
  ],
  "subject_an": [
    "www.example.org",
    "example.net",
    "example.edu",
    "example.com",
    "example.org",
    "www.example.com",
    "www.example.edu",
    "www.example.net"
  ],
  "issuer_dn": "CN=DigiCert TLS RSA SHA256 2020 CA1, O=DigiCert Inc, C=US",
  "issuer_cn": "DigiCert TLS RSA SHA256 2020 CA1",
  "issuer_org": [
    "DigiCert Inc"
  ],
  "fingerprint_hash": {
    "md5": "c5208a47259d540a6e3404dddb85af91",
    "sha1": "df81dfa6b61eafdffffe1a250240db5d2e6cee25",
    "sha256": "7f2fe8d6b18e9a47839256cd97938daa70e8515750298ddba2f3f4b8440113fc"
  },
  "tls_connection": "ctls",
  "sni": "example.com"
}
```

## 設定 (Configuration)

### スキャンモード (Scan Mode)

tlsxはTLS接続を行うための複数のモードを提供します -

* `auto` (失敗時に他のモードへの自動フォールバック) - **デフォルト**
* `ctls` (**[crypto/tls](https://github.com/golang/go/blob/master/src/crypto/tls/tls.go)**)
* `ztls` (**[zcrypto/tls](https://github.com/zmap/zcrypto)**)
* `openssl` (**[openssl](https://github.com/openssl/openssl)**)

特定のモード/ライブラリに関するいくつかのポインタは、[リンクされたディスカッション](https://github.com/projectdiscovery/tlsx/discussions/2)で強調表示されています。`auto`モードは、最大のカバレッジを確保し、接続エラー時に`ztls`および`openssl`モードを使用して接続を再試行することにより、古いバージョンのTLSを実行しているホストをスキャンするためにサポートされています。

古い/時代遅れのTLSバージョンを使用しているWebサイトをスキャンするための`ztls`モードの使用例。

```
$ echo tls-v1-0.badssl.com | tlsx -port 1010 -sm ztls
# ... (出力省略)
```

### OpenSSL

openssl接続モードを使用するには、システムにopensslがインストールされている必要があります。ほとんどの最新システムにはopensslがプリインストールされていますが、システムに存在しない場合は手動でインストールできます。`openssl version`コマンドを実行することで、opensslがインストールされているかどうかを確認できます。opensslがインストールされている場合、このコマンドはバージョン番号を表示します。

|  |
| --- |
| Pre-Handshake (早期終了) **tlsx**はSSL接続を早期に終了することをサポートしており、これによりスキャンが高速化され、接続要求が少なくなります（TLS `serverhello`と証明書データが収集された後に切断されます）。詳細については、[@erbbysam](https://twitter.com/erbbysam)による[Hunting-Certificates-And-Servers](https://github.com/erbbysam/Hunting-Certificates-And-Servers/blob/master/Hunting%20Certificates%20%26%20Servers.pdf)を参照してください。`-pre-handshake`モードの使用例：  ``` $ tlsx -u example.com -pre-handshake # ... (出力省略) ```  **注意**: **pre-handshake**モードは`ztls` (**zcrypto/tls**)を利用します。これは、`ztls`ライブラリが`TLS v1.3`をサポートしていないため、サポートが`TLS v1.2`までに制限されることを意味します。 |

### TLSバージョン (TLS Version)

**最小**および**最大**TLSバージョンは、`-min-version`および`-max-version`フラグを使用して指定できます。デフォルトでは、これらの値は使用される基盤ライブラリによって設定されます。

TLSバージョンに許容される値は以下の通りです。

* `ssl30`
* `tls10`
* `tls11`
* `tls12`
* `tls13`

これは、古いバージョンのTLS、つまり**TLS v1.0**をサポートするホストをスキャンするために`max-version`を使用する例です。

```
$ tlsx -u example.com -max-version tls10
# ... (出力省略)
```

### カスタム暗号 (Custom Cipher)

サポートされているカスタム暗号は、`-cipher-input / -ci`フラグを使用して提供できます。各モードでサポートされている暗号リストは、[wikiページ](https://github.com/projectdiscovery/tlsx/wiki/Ciphers)で入手できます。

```
tlsx -u example.com -ci TLS_AES_256_GCM_SHA384 -cipher
```

```
tlsx -u example.com -ci cipher_list.txt -cipher
```

## 謝辞 (Acknowledgements)

このプログラムはオプションで以下を使用します：

* zmapチームの[zcrypto](https://github.com/zmap/zcrypto)ライブラリ。
* cloudflareチームの[cfssl](https://github.com/cloudflare/cfssl)ライブラリ。
* 暗号スイート分類のための[ciphersuite.info](https://ciphersuite.info)の暗号データ。

---

tlsxは、[projectdiscovery](https://projectdiscovery.io)チームによって❤️を込めて作成され、[MITライセンス](/projectdiscovery/tlsx/blob/main/LICENSE)の下で配布されています。

[![Join Discord](https://raw.githubusercontent.com/projectdiscovery/nuclei-burp-plugin/main/static/join-discord.png)](https://discord.gg/projectdiscovery)
