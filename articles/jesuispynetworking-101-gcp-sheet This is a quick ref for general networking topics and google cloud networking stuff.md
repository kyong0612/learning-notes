---
title: "jesuispy/networking-101-gcp-sheet: This is a quick ref for general networking topics and google cloud networking stuff"
source: "https://github.com/jesuispy/networking-101-gcp-sheet"
author:
  - "Ammett Williams"
published:
created: 2025-07-10
description: |
  This is a quick 101 level reference guide of general networking terms with and added Google Cloud networking twist. Updated in 2025, it includes a section on networking for AI (RDMA, InfiniBand, RoCE, etc.).
tags:
  - "networking"
  - "gcp"
  - "cloud-computing"
  - "tcp-ip"
  - "osi-model"
---

# The Networking 101 Google Cloud sheet

AIの時代になっても、ネットワーキングに関する会話で迷子になるのは簡単です。このリファレンスシート（v3、2025年更新）がその助けになります。

**💡このバージョンには、AI向けネットワーキングのセクション（RDMA, InfiniBand, RoCE, NVLink, GPU, TPUなど）が追加されています💡**

これは、一般的なネットワーキング用語とGoogle Cloudネットワーキングの要素を加えた、迅速な101レベルのリファレンスガイドです。

*作成者: Google Developer Relations Team, Developer Relations Engineer Ammett Williams*

![net101v3.gif](https://github.com/jesuispy/networking-101-gcp-sheet/raw/main/img/net101v3.gif)

## PDF版のダウンロード

すべての有効なリンクはPDFドキュメント内にあります。

[![Download PDF](https://camo.githubusercontent.com/637838ba0a95ec3d20fabd0cb6335b85c9ede22ef82373adc57d4f1e24a682a5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4765745f5044462d446f776e6c6f61642d626c75653f7374796c653d666f722d7468652d6261646765266c6f676f3d61646f62656163726f626174726561646572)](https://github.com/jesuispy/networking-101-gcp-sheet/blob/main/pdf/network101gcp.pdf)

## フィードバック

[![LinkedIn](https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg)](https://www.linkedin.com/in/ammettwilliams/) でご連絡ください。

---

## 目次

🔗 - リンクアイコン

### 🌐 グローバルネットワーク

- **ネットワーク**: 通信を目的として接続されたデバイスの集まり。物理的または論理的な接続が可能。
- **光ファイバーケーブル**: 光を使用してデータを送信する光ファイバーのペアで構成されるケーブル。
- **インターネット**: BGPを通じてルートを交換する、パブリックなネットワークの集合体。
- **リージョン**: Google Cloudの地理的なコンピューティング拠点（最低3つのゾーンで構成）。
- **ゾーン**: リージョン内にあるGoogle Cloudのコンピューティング施設。
- **Point of Presence (PoP)**: インターネットからGoogleのネットワークへの接続点。
- **オンプレミス**: 企業が所有するデータセンター。
- **ローカルエリアネットワーク (LAN)**: 特定の地理的エリア内で同じ通信回線を共有するネットワーク。
- **ワイドエリアネットワーク (WAN)**: 広大な地理的エリアにわたる接続されたLANの集合体。
- **Cross-Cloud Network**: オンプレミス、クラウド、分散アプリ、グローバルフロントエンド間のセキュアなany-to-any通信を可能にするGoogleの設計コンセプト。
- **Cloud WAN**: Googleのグローバルバックボーン上でセキュアなWANネットワークを構築できるGoogleのサービス。

### 💻 VPCとIPアドレッシング

- **Virtual Private Cloud (VPC)**: オンプレミスネットワークの論理的な表現。GCPではグローバルな構成要素。
- **VPCサブネット**: リージョンごとに割り当てられ、IPアドレス範囲が指定される。
- **IPアドレス**: ネットワーク上のホストを識別するための一意のアドレス。ネットワーク部とホスト部で構成。
- **プライベートIP (RFC1918)**: 内部で誰でも使用できる特別な範囲。インターネットではルーティングされない。
- **パブリックIP**: インターネット上でルーティング可能なIPアドレス。
- **DHCP**: クライアントにIPアドレスを自動的に割り当てるためのプロトコル。
- **Alias IP**: VMに割り当てることができる追加のアドレス。

### 📊 OSIモデルとインターネットモデル

- **OSIモデル**: TCPスタックの相互運用性を提供する7層の概念モデル（アプリケーション、プレゼンテーション、セッション、トランスポート、ネットワーク、データリンク、物理）。
- **インターネットモデル**: TCP/IPスタックの4層の概念モデル（アプリケーション、トランスポート、インターネット、リンク）。

### 🤝 TCP, TCP three-way handshake, UDP, QUIC

- **Transmission Control Protocol (TCP)**: 信頼性、フロー制御、輻輳制御を扱うコネクション指向のプロトコル。
- **Three-way handshake**: TCP接続を確立するためのシーケンス（SYN, SYN/ACK, ACK）。
- **User Datagram Protocol (UDP)**: ベストエフォート型の配信プロトコル。
- **Quick UDP Internet Connections (QUIC)**: Googleが作成したUDP上に構築されたトランスポート層プロトコル。

### 📦 パケット、フレーム、MTU

- **Maximum Transfer Unit (MTU)**: ネットワーク上で送信できる最大のデータ単位のサイズ。
- **Time to Live (TTL)**: パケットの寿命を示す。通常最大255ホップ。

### 🗺️ ARP, RARP, DNS & NAT

- **Domain Name Service (DNS)**: 名前をIPアドレスに解決する。
- **Address Resolution Protocol (ARP)**: IPアドレスをMACアドレスに解決するプロトコル。
- **Network Address Translation (NAT)**: プライベートIP範囲がインターネットと通信できるようにする。

### 🌎 ルーティング、Cloud Router、BGP

- **ルーティング**: ネットワーク内または異なるネットワーク間でトラフィックが流れるパスを選択すること。
- **Cloud Router**: BGPを使用してVPCとオンプレミス間でルートを動的に交換できるGoogle Cloudのルーター。
- **Border Gateway Protocol (BGP)**: インターネットのパスベクタプロトコル。自律システム（AS）で構成される。

### ⚡ AI向けネットワーキング

- **Remote Direct Memory Access (RDMA)**: ホストCPUをバイパスして、デバイス間で直接リモートメモリアクセスを可能にする。
- **InfiniBand**: RDMAおよびクラスタ通信用の高速・低遅延ファブリック。
- **RDMA over Converged Ethernet (RoCE)**: Ethernetネットワーク上でRDMAデータ転送を可能にするプロトコル。
- **NVLink**: 従来のPCIeよりも大幅に高速なマルチGPUデータ転送を実現するNVIDIAの高速GPUインターコネクト。
- **Tensor Processing Unit (TPU)**: AI/MLワークロードに高速ネットワークを使用するGoogleのカスタムチップ。
- **Ultra Ethernet**: AIおよびHPCネットワーキングの厳しい要求に応えるために開発中の新しい標準。

### 🏢 データセンターネットワーキング

- **Closトポロジ**: データセンターのスイッチングファブリックで使用される、ノンブロッキングの多段スイッチングネットワーク。
- **Leaf and Spine**: リーフスイッチとスパインスイッチからなる2層のフルメッシュトポロジ。
- **East-Westトラフィック**: データセンター内のデバイス間の通信トラフィック。
- **North-Southトラフィック**: データセンターと外部ネットワーク間の通信トラフィック。

### 🔌 接続性とハイブリッド接続

- **Dedicated Interconnect**: Googleとプライベートネットワーク間の専用接続。
- **Partner Interconnect**: サービスプロバイダを介してプロビジョニングされるGoogleとネットワーク間の高可用性接続。
- **Cloud VPN**: 安全なIPsecトンネルを介して2つの場所間で安全な接続を提供する。
- **VPC Network Peering**: 同じまたは別のプロジェクトや組織内の異なるVPC間を接続できるGCPサービス。

### 🛡️ ネットワークセキュリティ

- **ファイアウォール**: ルールに基づいてトラフィックを許可、拒否、フィルタリングする。
- **Cloud Armor**: OSIレイヤー7から4でフィルタリングを提供するGoogle Cloudのサービス。
- **VPC Service Controls**: リソースとデータを保護する境界を作成する機能を提供するGoogle Cloudのサービス。
- **Cloud Identity-Aware Proxy (IAP)**: アプリケーションへのアクセスを制御し、認可されたユーザーのみに制限するGoogle Cloudのサービス。

### 🚦 トラフィックハンドリング、ロードバランシング、コンテンツデリバリー

- **ロードバランサ**: 受信ネットワークトラフィックを複数のサーバーに分散する。
- **Application Load Balancer (ALB)**: レイヤー7のHTTP/HTTPSトラフィックをサポート。
- **Network Load Balancer (NLB)**: レイヤー4のトラフィックをサポート。
- **Content Delivery Network (CDN)**: 顧客に最も近い配布エンドポイントにコンテンツをキャッシュする。

### 🛠️ トラブルシューティングとモニタリング

- **ping**: Internet Control Message Protocolを使用してホストの可用性を確認する。
- **traceroute**: 送信元と宛先間のホップを表示する。
- **nslookup/dig**: DNSルックアップを実行する。
- **Flow logs**: VPC内のトラフィックフローに関する情報を提供するGCPサービス。
- **Network Intelligence Center**: ネットワークの可視性を得るためのツールを提供するGCPサービス。

### 🤔 ブラウザで <www.google.com> と入力すると何が起こるか

1. ブラウザにURLを入力。
2. ブラウザキャッシュでIP情報を確認。
3. ホストファイルを確認。
4. ローカルDNSに問い合わせ。
5. サービスプロバイダのDNSに問い合わせ。
6. ルートDNS、トップレベルDNS、権威DNSへと問い合わせ、IPアドレスを取得。
7. システムがIPアドレスを取得し、サーバーへのTCP接続を開始。
8. TCPの3ウェイハンドシェイクとTLSによるセキュアな接続が確立。
9. HTTP(S)/HTMLプロセスが開始され、情報が返される。
