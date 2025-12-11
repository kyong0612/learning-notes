---
title: "Google Cloud のネットワーク技術を基礎知識から振り返ってみる"
source: "https://zenn.dev/cloud_ace/articles/gde-advent-calendar-2026-1209"
author:
  - "阿部 (クラウドエース株式会社)"
published: 2025-12-09
created: 2025-12-11
description: |
  Google Cloud のネットワーク技術の基礎について、VPC ネットワークの構成要素から、サーバレスサービスの VPC 接続方法、VPC ネットワーク間の接続オプションまでを包括的に解説。AI エージェント時代においてもネットワーク層の設計が重要であることを踏まえ、実践的な設計ポイントを紹介。
tags:
  - "Google Cloud"
  - "VPC"
  - "Network"
  - "Cloud NAT"
  - "Serverless"
---

## 概要

生成 AI 技術が注目を集める中、本番環境でのシステム連携においてはネットワーク層の設計が依然として重要。本記事では Google Cloud の VPC ネットワーク技術の基礎を振り返り、効果的な活用方法を解説。

---

## 1. Google Cloud のネットワークの基礎知識

- Google Cloud のネットワークは **Andromeda** と呼ばれるグローバル分散型の高性能 SDN (ソフトウェア定義ネットワーク) を基盤としている
- VPC (Virtual Private Cloud) は仮想ネットワークを作成するためのリソース

---

## 2. VPC ネットワークと構成リソース

### VPC ネットワークの特徴

| 特徴 | Google Cloud | AWS/Azure |
|------|--------------|-----------|
| スコープ | グローバルリソース（全リージョン） | リージョン単位 |
| IP アドレス範囲 | VPC に定義不可（サブネットが持つ） | VPC に定義 |

### VPC ネットワークの主要設定

#### サブネット作成モード

- **自動モード**: 各リージョンに自動的にサブネット作成（default ネットワーク）
- **カスタムモード**: 利用者が必要なリージョンにサブネット作成 → **推奨**

#### 動的ルーティングモード

- **グローバルモード** / **リージョンモード**（デフォルト）
- Cloud Router 利用時のルーティング情報伝播方法を設定

#### 最大転送単位 (MTU)

- デフォルト: 1460 バイト
- 変更可能値: 1500, 8500, 8896 バイト
- ハイブリッド接続時のオンプレミス MTU 調整や高性能アプリケーション向けに変更

### VPC サブネット

#### IP アドレス範囲 (CIDR ブロック)

**予約されるアドレス:**

- 最初のホストアドレス（ネットワークアドレス）
- 最初のホストアドレス +1（デフォルトゲートウェイ）
- 最後から 2 番目のアドレス（予約済み）
- ブロードキャストアドレス

#### サブネットの目的 (Purpose)

- 一般的なコンピューティングリソース用
- ロードバランサのプロキシ用
- Private Service Connect 用
- プライベート NAT 用
- ピア移行用

#### IP スタックタイプ

- IPv4（通常）
- IPv6
- デュアルスタック（IPv4 + IPv6）→ IPv6 対応が必要な場合推奨

#### プライベート Google アクセス

- パブリック IP なしで `*.googleapis.com` のマネージドサービス（Cloud Storage、BigQuery 等）にアクセス可能
- 特に理由がなければ **有効化推奨**

#### フローログ

- サブネット内のトラフィックログを Cloud Logging に記録
- **現在は Network Management API での一括管理を推奨**（サブネット毎の設定は非推奨）

#### ハイブリッドサブネット

- Proxy ARP を利用してオンプレミスと IP アドレス範囲を共有
- サーバ移行時の一時利用など

### ファイアウォールポリシー (Cloud NGFW)

従来の VPC ファイアウォールルールより **ファイアウォールポリシーが推奨**

| 利点 | 説明 |
|------|------|
| 一元的な管理 | 複数 VPC/組織全体にポリシー適用可能 |
| 柔軟なルール | IP アドレス + 位置情報/FQDN ベース（Standard tier 以上） |
| 高度なセキュリティ | IPS、TLS インスペクション（Premium tier） |

※ Standard/Premium tier は追加料金発生

### ルート

**自動作成されるルート:**

- VPC サブネットルート（削除不可）
- デフォルトインターネットゲートウェイルート（削除可能）

**その他のルート:**

- 静的ルート（手動作成）
- 動的ルート（Cloud Router 経由で自動学習）
- ピアリングサブネットルート
- NCC ルート

> Google Cloud の VPC ルートはシステムが自動管理する部分が多い。問題発生時のトラブルシューティングには挙動の理解が重要。

### Cloud NAT

プライベート IP リソースがインターネットアクセスするためのマネージド NAT サービス

**特徴:**

- フルマネージド（ルート設定・スケーリング自動）
- 高可用性（Andromeda により提供）
- リージョン単位の設定
- 静的/エフェメラル IP アドレスの柔軟な割り当て

**主要設定:**

| 設定項目 | 説明 |
|----------|------|
| ソースエンドポイントタイプ | VM/GKE/サーバレス or マネージドプロキシロードバランサ |
| ソース IP バージョン | IPv4/IPv6 どちらも → パブリック IPv4 に変換 |
| ソースのサブネット | 全サブネット or 特定サブネット選択可能 |

### VPC ネットワーク構成要素まとめ図

![VPC ネットワークの構成要素](https://res.cloudinary.com/zenn/image/fetch/s--jh3un57E--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/e6b5bb35a087d88504e692e6.png%3Fsha%3D0fef0e27bd91fae510ba26e2c64e26cdb39654f6)

---

## 3. サーバレスサービスから VPC ネットワークへの接続

### 対象サーバレスサービス

- App Engine
- Cloud Run
- Cloud Run functions（旧 Cloud Functions）

デフォルトでは VPC と分離された環境で動作

### 接続方法の比較

#### Serverless VPC Access

- VPC サブネットにコネクタリソースを作成
- 内部的に NAT 用インスタンスを使用 → **通信有無に関わらずコスト発生**
- スケールアップ後の自動スケールダウン機能なし（削除・再作成が必要）

#### Direct VPC egress

- NAT インスタンス不使用
- サブネット IP をサーバレスインスタンスと 1:1 対応
- **コスト効率が高く、レイテンシも低い**
- サブネット IP 範囲サイズによるスケーラビリティ制限あり

### 比較表

![Serverless VPC Access と Direct VPC egress の比較](https://res.cloudinary.com/zenn/image/fetch/s--_Ygg99N8--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a5ea3ec9abfd4341216324bf.png%3Fsha%3Dffee7a9afec408b43baf0a479e406fb9a6eea678)

**推奨:** ほとんどのユースケースで **Direct VPC egress**

**Serverless VPC Access を検討するケース:**

- IP アドレス消費を最小限にしたい場合
- スケーリング効率を優先する場合

### Vertex AI Agent Engine の制限事項

- 現状 VPC ネットワークとの直接連携オプションなし
- オンプレミスリソースと通信させたい場合は **Cloud Run の利用を検討**

---

## 4. VPC ネットワークの接続オプション

### VPC ピアリング

![VPC ピアリングの概要](https://res.cloudinary.com/zenn/image/fetch/s--nhhy_6gO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/84f488293f935f720c8e867d.png%3Fsha%3D2c9e4c5bb4dc99e6fea7a20d306c3e6b12169af1)

- 異なる VPC ネットワーク同士を直接接続
- シンプルで設定容易 → 小規模システム向け

**制約:**

- 推移的ルーティング不可（直接ピアリングのみ通信可能）
- 重複 IP アドレス範囲使用不可

### 共有 VPC

![共有 VPC の概要](https://res.cloudinary.com/zenn/image/fetch/s--HNMVDRrj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/d8e7fc2533b169b2534e8269.png%3Fsha%3De08e08803f32ffdf0429b8d57d69b5a18330006d)

- 複数プロジェクト間で単一 VPC を共有
- ホストプロジェクトに VPC 作成 → サービスプロジェクトから利用
- ネットワーク管理の一元化

### Network Connectivity Center (NCC)

![NCC の概要](https://res.cloudinary.com/zenn/image/fetch/s--VYk64oB_--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a8319f199ef84fefc89016c6.png%3Fsha%3D9378336cd1d76fabd381085d6819882884b5ef4c)

- ハブアンドスポークモデル
- 推移的ルーティングを考慮せず複数 VPC 接続可能
- ルートエクスポートフィルターで柔軟な制御
- **追加コスト発生**

---

## 5. Google Cloud 外のネットワークとの接続

### Cloud VPN

- IPsec VPN でインターネット経由接続
- **HA VPN を推奨**（Classic VPN は段階的廃止）
- 低コスト、比較的容易に接続可能
- 帯域幅・レイテンシはインターネットの影響を受ける

### Cloud Interconnect

| 種類 | 説明 |
|------|------|
| Dedicated Interconnect | コロケーション施設と直接接続、高帯域幅 |
| Partner Interconnect | パートナー事業者経由、柔軟な帯域幅選択、安価 |
| Cross-Cloud Interconnect | 他クラウド (AWS, Azure) と専用線接続 |

- インターネット非経由 → 高帯域幅・低レイテンシ・安定接続
- コスト高、導入に時間がかかる場合あり

---

## 6. 複雑なネットワーク構成の管理戦略

### マルチリージョンシステム

| クラウド | VPC スコープ | マルチリージョン構築 |
|----------|-------------|---------------------|
| AWS/Azure | リージョン単位 | リージョン毎に VPC 作成 + ピアリング |
| Google Cloud | グローバル | 単一 VPC 内に複数リージョンサブネット作成可能 |

→ Google Cloud ではマルチリージョンでも単一 VPC で管理可能なケースが多い

### 複数プロジェクト間のネットワーク管理

**設計ポイント:**

1. システム間を疎結合に保ち VPC 接続を最小限に（サーバレス活用）
2. 共有 VPC でネットワーク管理を一元化
3. NCC で複数 VPC を効率的に接続・管理（大規模システム向け）

> **重要:** 後からネットワーク構成を変更するのは大変。特に Cloud Interconnect を複数 VPC で共有利用する予定がある場合は、将来の拡張性を考慮して **NCC を活用した設計を推奨**。

---

## 7. 重要な結論・発見

1. **AI エージェント時代でもネットワーク設計は重要** - PoC では気にしなくても本番環境では必須
2. **VPC ネットワークはグローバルリソース** - 他クラウドと異なる設計思想
3. **サブネット作成モードはカスタムモードを推奨**
4. **サーバレス VPC 接続は Direct VPC egress を推奨**
5. **ファイアウォールポリシー (Cloud NGFW) を使用** - VPC ファイアウォールルールより推奨
6. **フローログは Network Management API で一括管理**
7. **将来の拡張性を考慮して NCC 採用を検討** - 特に Cloud Interconnect 利用時
