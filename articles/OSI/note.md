---
title: OSI参照モデルにおけるL3,L4L7の違いについて
source: https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/
author:
  - 
published: 
created: 2024-11-11
description: |
  OSI参照モデルのL3, L4, L7の各層の特徴、セキュリティ対策、そしてロードバランサーにおける実装例について解説
tags:
  - OSI参照モデル
  - L3
  - L4
  - L7
  - ネットワーク
  - セキュリティ
  - ロードバランサー
---

# OSI参照モデルにおけるL3,L4L7の違いについて

## ネットワーク層（L3）

**主な特徴:**

- IPアドレスに基づいてパケットのルーティングを行う[1]
- ネットワーク間の通信経路の選択を担当[4]
- 代表的なプロトコル: IP、ICMP、IGMP[1]

**セキュリティ対策:**

- ファイアウォールによる通信制御
- IPSec等による暗号化
- ルーターのセキュリティ設定[4]

## トランスポート層（L4）

**主な特徴:**

- IPアドレスとポート番号に基づく通信制御[2]
- エラー検出・訂正と再送制御
- フロー制御、輻輳制御を実施[2]
- 代表的なプロトコル: TCP、UDP[1]

**セキュリティ対策:**

- SSL/TLSによる暗号化
- TCPレベルのフィルタリング
- ファイアウォールによるポート制御[4]

## アプリケーション層（L7）

**主な特徴:**

- URLやHTTPヘッダー、Cookieなどの情報を利用[2]
- アプリケーションレベルでの高度な制御が可能
- 代表的なプロトコル: HTTP、HTTPS、FTP、SMTP[1]

**セキュリティ対策:**

- Webアプリケーションファイアウォール（WAF）
- アプリケーションレベルでの認証
- SSL/TLS暗号化[4]

## 実装例（ロードバランサー）

|機能|L4ロードバランサー|L7ロードバランサー|
|--|--|--|
|振り分け基準|IPアドレス、ポート番号|URL、Cookie、HTTPヘッダー|
|処理内容|単純な負荷分散|高度な負荷分散、セキュリティ機能|
|コスト|低い|高い|
|対応プロトコル|TCP/UDP|HTTP、HTTPS[2]|

このように、各層は異なる役割と機能を持ち、それぞれの層に適したセキュリティ対策が必要となります。

Sources
[1] What is the OSI Model? - Cloudflare <https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/>
[2] L4とL7ロードバランサーの違い - Zenn <https://zenn.dev/axpensive/articles/d80e4d102eefb4>
[3] Open Systems Interconnection (OSI) - Solo.io <https://www.solo.io/topics/api-gateway/open-systems-interconnection-osi>
[4] OSI参照モデルって？改めてネットワークの基礎知識をおさらいしよう <https://eset-info.canon-its.jp/malware_info/special/detail/220712.html>
[5] ルータ/L2スイッチ/L3スイッチ/L4スイッチ/L7スイッチの違い - Qiita <https://qiita.com/kato_yosuke/items/f645cfebdc619e663abd>
[6] What Load Balancers Do at Three Different Layers of the OSI Stack <https://deploy.equinix.com/blog/a-deep-dive-into-layer-3-layer-4-and-layer-7-load-balancing/>
