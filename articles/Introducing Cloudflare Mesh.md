---
title: "Introducing Cloudflare Mesh"
source: "https://developers.cloudflare.com/changelog/post/2026-04-14-cloudflare-mesh/"
author:
  - "[[Nikita Cano]]"
  - "[[Thomas Gauvin]]"
published: 2026-04-14
created: 2026-04-16
description: "Cloudflare Meshは、ポスト量子暗号化メッシュネットワーキングでサービスとデバイスを接続する。VPNやbastion hostなしに、サーバー・ラップトップ・スマートフォン間でTCP/UDP/ICMPトラフィックをプライベートにルーティング可能。AIエージェントのプライベートネットワークアクセスにも対応し、Workers VPCとの統合によりCloudflare Workers上のエージェントからもプライベートインフラに接続できる。"
tags:
  - "clippings"
  - "Cloudflare"
  - "Mesh Networking"
  - "Zero Trust"
  - "SASE"
  - "Private Networking"
  - "AI Agents"
  - "Workers VPC"
  - "Cloudflare One"
---

## 概要

Cloudflare Meshは、WARP Connectorの後継として発表されたプライベートメッシュネットワーキングソリューションである。ポスト量子暗号化を用いて、サーバー・ラップトップ・スマートフォンなどあらゆるデバイスをプライベートIPで相互接続する。VPNやbastion hostを必要とせず、Cloudflareのグローバルネットワーク（330以上の都市）を経由してトラフィックをルーティングする。特にAIエージェント時代のプライベートネットワークアクセスの課題を解決することを主眼としており、Workers VPCとの統合によりCloudflare Workers上のエージェントからもプライベートインフラストラクチャへのアクセスが可能になった。

## 主要なトピック

### 背景：AIエージェントが生むプライベートネットワークの課題

AIエージェントの普及により、プライベートネットワークへのアクセスパターンが根本的に変化している。

- **コーディングエージェント**がステージングDBやプライベートAPIにアクセスする必要がある
- **パーソナルAIアシスタント**が自宅ネットワーク上のサービスに到達する必要がある
- **本番エージェント**が内部APIを呼び出す必要がある

従来のVPNはインタラクティブなログインが必要で、SSHトンネルは手動セットアップが必要、サービスの公開はセキュリティリスクを伴う。これらのツールは人間向けに設計されており、自律的に動作するエージェントには適さない。

### Cloudflare Meshの仕組み

![Cloudflare Mesh network map showing nodes and devices connected through Cloudflare](https://developers.cloudflare.com/_astro/mesh-network-map.CED6jNHK_ZlOsym.webp)

Meshには2種類の参加者がある：

| | Meshノード | クライアントデバイス |
|---|---|---|
| **実行環境** | Linuxサーバー、VM、コンテナ | ラップトップ、スマートフォン、デスクトップ |
| **クライアント** | Cloudflare One Client (`warp-cli`) ヘッドレスモード | Cloudflare One Client (`warp-cli`) UI付き |
| **Mesh IP** | 登録時に割当 | 登録時に割当 |
| **サブネットルーティング** | CIDRルートを広告可能 | 不可（ノード経由でサブネットにアクセス） |
| **高可用性** | アクティブ-パッシブレプリカ対応 | 対象外 |

すべての参加者はMesh IPで相互到達可能。クライアント同士の接続はMeshノードのデプロイなしでも動作する。

#### Mesh IPアドレス

- `100.96.0.0/12` のCGNATアドレス空間（[RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)）を使用
- RFC 1918プライベートレンジ（`10.x`, `172.16.x`, `192.168.x`）との競合を回避
- デフォルトレンジが競合する場合はカスタムサブネットの設定が可能

### Cloudflare Meshの主要機能

- **プライベートMesh IP割当**: 参加デバイス・ノードすべてにプライベートIPを付与
- **任意の参加者間通信**: クライアント-クライアント間を含む、インフラ不要のIP到達性
- **CIDRルート**: Meshノードを通じたサブネットルーティング
- **高可用性**: アクティブ-パッシブレプリカによるフェイルオーバー
- **セキュリティポリシー統合**: Gateway ネットワークポリシー、デバイスポスチャチェック、アクセスルールがすべての接続に適用
- **ポスト量子暗号化**: TCP、UDP、ICMPプロトコル対応

### WARP Connectorからの変更点

- **WARP Connector → Cloudflare Mesh** にリブランド。既存のWARP Connectorは「Meshノード」に名称変更
- **P2P接続 → Mesh接続** に名称変更
- **ノード上限**: アカウントあたり10 → **50に増加**
- **新ダッシュボード**: **Networking > Mesh** に、インタラクティブネットワークマップ、ノード管理、ルート設定、診断、セットアップウィザードを含む新UIを提供
- **既存デプロイは移行不要**: すべての既存デプロイメントはそのまま動作を継続

### Mesh vs Tunnel

| | Cloudflare Mesh | Cloudflare Tunnel |
|---|---|---|
| **トラフィック方向** | 双方向（任意の参加者が開始可能） | インバウンド（クライアントから公開サービスへ） |
| **アドレッシング** | 全参加者にMesh IP | サーバー側のみ、Mesh IPなし |
| **ユースケース** | デバイス・サーバー間のプライベートIP接続 | ホスト名による特定アプリの公開、IP範囲へのトラフィックプロキシ |
| **コネクタ** | `warp-cli` | `cloudflared` |
| **プロトコル** | TCP、UDP、ICMP | HTTP/S、TCP、SSH、RDP、SMB（WebSocket経由プロキシ） |

**Meshを使う場面**: デバイス間でプライベートIPによる相互アクセスが必要な場合
**Tunnelを使う場面**: ホスト名でサービスを公開する、または`cloudflared`を通じて特定IPレンジにトラフィックをプロキシする場合

### 他製品との比較（Tailscale/WireGuard等）

| 他製品の概念 | Cloudflare Mesh |
|---|---|
| Tailnet / mesh network | Cloudflareアカウントのメッシュネットワーク |
| Node / peer | Meshノード（サーバー）/ クライアントデバイス |
| Subnet router | CIDRルート付きMeshノード |
| MagicDNS / custom DNS | Local Domain Fallback + Gatewayリゾルバーポリシー |
| ACLs / access rules | Gateway ネットワークポリシー + デバイスポスチャ |
| Exit node | Meshノードにパブリック CIDRをアタッチ |
| Admin console | Cloudflareダッシュボード Networking > Mesh |

**主な差異**:
- 管理はすべてCloudflareダッシュボードまたはAPI経由（CLI管理不要）
- Gatewayポリシー、デバイスポスチャ、IDチェックがプラットフォームに組み込み
- トラフィックは最寄りのCloudflareデータセンター経由（デバイス間直接通信ではない）

### Cloudflareネットワークの活用：NATトラバーサル問題の解決

一般的なメッシュネットワークの課題であるNATトラバーサルを、すべてのトラフィックをCloudflareのグローバルネットワーク経由でルーティングすることで解決。

- NAT越え失敗時のリレーサーバーへのフォールバックが不要
- 330以上の都市のエッジが「パス」そのものとして機能
- クロスリージョン・マルチクラウドトラフィックで公開インターネットルーティングを一貫して上回るパフォーマンス

### Workers VPCとの統合

[Workers VPC](https://blog.cloudflare.com/workers-vpc-open-beta/)を拡張し、Meshネットワーク全体をWorkersとDurable Objectsからアクセス可能にした。

`wrangler.jsonc` での設定例：

```json
"vpc_networks": [
  {
    "binding": "MESH",
    "network_id": "cf1:network",
    "remote": true
  },
  {
    "binding": "AWS_VPC",
    "tunnel_id": "350fd307-...",
    "remote": true
  }
]
```

Worker/エージェントコードでの使用例：

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const apiResponse = await env.MESH.fetch("http://10.0.1.50/api/data");
    const dbResponse = await env.AWS_VPC.fetch("http://internal-db.corp.local:5432");
    return new Response(await apiResponse.text());
  },
};
```

`cf1:network` 予約キーワードでアカウントのMeshネットワークにバインドし、単一の `fetch()` 呼び出しでプライベートサービスにアクセスできる。

### エージェントワークフローのユースケース

1. **パーソナルAI（モバイルアクセス）**: iOS端末からCloudflare One Client経由で自宅Mac miniのOpenClawに安全にアクセス
2. **コーディングエージェント**: macOS上のClaude Code/Cursor/CodexがプライベートネットワークのステージングDB/APIにアクセス
3. **Workers上のデプロイ済みエージェント**: Agents SDK＋Workers VPCで内部API、DB、MCPにスコープ付きアクセス

## 重要な事実・データ

- **無料枠**: 50ノード + 50ユーザーまで無料（すべてのCloudflareアカウントに含まれる）
- **グローバルエッジ**: 330以上の都市でのルーティング
- **ノード上限**: アカウントあたり10 → 50に拡大
- **IPレンジ**: `100.96.0.0/12` （CGNATアドレス空間）
- **対応プロトコル**: TCP、UDP、ICMP
- **暗号化**: ポスト量子暗号化
- **コネクタ**: `warp-cli`（Cloudflare One Client）
- **既存デプロイ**: 移行不要、自動的にMeshとして動作

## 結論・示唆

### 著者の結論

Cloudflare Mesh、Workers VPC、Agents SDKの組み合わせにより、Cloudflareと外部クラウドにまたがるエージェント向け統一プライベートネットワークを実現。接続とコンピューティングを統合し、エージェントが必要なリソースにグローバルに安全にアクセスできる基盤を提供する。

### 今後のロードマップ

- **ホスト名ルーティング**（2026年夏）: IPリストの管理なしに `wiki.local` や `api.staging.internal` などのプライベートホスト名でトラフィックをルーティング
- **Mesh DNS**（2026年後半）: 参加ノード・デバイスに自動的にルーティング可能な内部ホスト名を付与（例: `postgres-staging.mesh`）。DNS設定や手動レコード不要
- **IDアウェアルーティング**: ノード・デバイス・エージェントごとに個別のアイデンティティをポリシーで評価可能に。Principal（認可した人間）、Agent（実行するAIシステム）、Scope（許可された操作）の3層モデル
- **コンテナ対応**: Mesh Dockerイメージにより、Kubernetes Pod、Docker Compose、CI/CDランナーでMeshノードを実行可能に（2026年後半予定）

### 実践的な示唆

- Cloudflare Oneの既存ユーザーは追加設定なしでMeshを利用可能（既存のGatewayポリシー、デバイスポスチャ、アクセスルールが自動適用）
- 小規模チームは50ノード+50ユーザーの無料枠で十分に開始可能
- Tailscale/WireGuardからの移行は概念マッピングが明確で、管理の一元化メリットがある
- エージェント開発者はAgents SDK + Workers VPCで即座にプライベートバックエンドアクセスを構築可能

## 制限事項・注意点

- すべてのトラフィックがCloudflareのネットワークを経由する（デバイス間の直接通信はなし）
- Meshノードは現時点ではLinuxサーバーのみ対応（コンテナ対応は2026年後半予定）
- ホスト名ルーティング・Mesh DNSは未実装（2026年夏～後半に提供予定）
- IDアウェアルーティングは開発中（エージェントごとのアイデンティティがポリシー層で未だ可視化されていない）
- Meshノード数の上限は50/アカウント

---

*Source: [Introducing Cloudflare Mesh](https://developers.cloudflare.com/changelog/post/2026-04-14-cloudflare-mesh/) / [Blog Post](https://blog.cloudflare.com/mesh/) / [Documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-mesh/)*
