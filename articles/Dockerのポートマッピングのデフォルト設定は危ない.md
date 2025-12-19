---
title: "Dockerのポートマッピングのデフォルト設定は危ない"
source: "https://jun-networks.hatenablog.com/entry/2023/07/03/190000"
author:
  - "JUN_NETWORKS"
published: 2023-07-03
created: 2025-12-19
description: |
  Dockerのポートマッピングはデフォルトでファイアウォールの設定を書き換え、外部からのアクセスを許可してしまう危険な仕様がある。公衆WiFiでDockerコンテナを動かすと同一LAN内の他端末からアクセスされる可能性があり、開発者が知らずにセキュリティリスクを抱えている可能性を警告する記事。
tags:
  - Docker
  - セキュリティ
  - ファイアウォール
  - ネットワーク
  - ポートマッピング
---

## 概要

Dockerの `-p 8080:80` のようなポートマッピングは、**デフォルトでファイアウォールの設定を書き換え、外部からのアクセスを許可してしまう**という危険な仕様がある。

## 問題の発生経緯

- 公衆WiFiに接続した状態でDockerコンテナを起動
- `docker container run -p 8080:80 nginx` を実行
- ファイアウォールで外部アクセスを拒否しているはずなのに、外部からリクエストを受信

### 検証環境

- Docker Desktop for Mac with Apple Silicon 4.21.0

## 問題の原因

Dockerはデフォルト設定では `-p 8080:80` のようにポートマッピングすると、**ファイアウォールの設定を書き換え**、外部からそのポートへのアクセスを許可する。

### Docker公式ドキュメントの警告

> Publishing container ports is insecure by default. Meaning, when you publish a container's ports it becomes available not only to the Docker host, but to the outside world as well.

つまり、**コンテナのポートを公開すると、Dockerホストだけでなく外部からもアクセス可能になる**。

## 対策方法

### 方法1: ポートマッピングのIPアドレスを指定する

```bash
# コマンドラインの場合
docker container run -p 127.0.0.1:8080:80 nginx
```

```yaml
# docker-compose.ymlの場合
ports:
  - "127.0.0.1:8080:80"
```

`127.0.0.1` を明示的に指定することで、ローカルホストからのみアクセス可能になる。

### 方法2: Docker Engineの設定を書き換える（推奨）

毎回コマンドやdocker-compose.ymlを書き換えるのは大変なので、**デフォルトの公開範囲をローカルホスト内に制限する設定**がおすすめ。

Docker Engineの設定に以下を追加:

```json
{
  "ip": "127.0.0.1"
}
```

Docker for Macの場合は、Settings → Docker Engine から設定可能。

参考: [Docker公式ドキュメント - Setting the default bind address for containers](https://docs.docker.com/network/packet-filtering-firewalls/#setting-the-default-bind-address-for-containers)

## 検証結果

### 対策前

```bash
$ docker container run -p 8080:80 nginx:latest
$ curl <local_ip>:8080
# → nginxのウェルカムページが表示される（アクセス可能）
```

```bash
$ nmap 172.20.10.8
PORT     STATE SERVICE
5000/tcp open  upnp
7000/tcp open  afs3-fileserver
8080/tcp open  http-proxy    # ← 8080が外部に公開されている
```

### 対策後（Docker Engine設定変更後）

```bash
$ nmap 172.20.10.8
PORT     STATE SERVICE
5000/tcp open  upnp
7000/tcp open  afs3-fileserver
# 8080ポートが表示されない = 外部に公開されていない
```

## 重要なポイント

1. **同一LAN内であれば他のPCやスマホからもアクセス可能**になる
2. Dockerが**ファイアウォールの設定を書き換える**ことを知らない開発者が多い
3. Dockerのインストール方法を解説する記事でもこの危険性が言及されていないことが多い
4. 開発マシンでは**デフォルトでローカルホスト限定にする設定を推奨**

## 参考リンク

- [Docker公式ドキュメント - Networking](https://docs.docker.com/network/)
- [Docker公式ドキュメント - Packet filtering and firewalls](https://docs.docker.com/network/packet-filtering-firewalls/)
- [tecotec.co.jp - 関連記事](https://tec.tecotec.co.jp/entry/2021/12/17/000000)
- [yoshinorin.net - Docker through UFW](https://yoshinorin.net/articles/2022/02/18/docker-through-ufw/)
