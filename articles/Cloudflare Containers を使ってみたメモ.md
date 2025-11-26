---
title: "Cloudflare Containers を使ってみたメモ"
source: "https://zenn.dev/774u64/articles/1e351b11f21928"
author:
  - "774u64"
published: 2025-06-25
created: 2025-11-26
description: |
  Cloudflare Containers は Cloudflare が新しく提供しているエッジネットワーク上のコンテナ実行基盤。オープンベータ段階で、Workers Paid プランに加入していれば追加料金なしで試すことができる。Durable Objects にアタッチする形で管理され、コンテナのライフサイクル管理やスケーリングについて詳細に解説。
tags:
  - "Cloudflare"
  - "Cloudflare Workers"
  - "Docker"
  - "containers"
  - "Durable Objects"
  - "エッジコンピューティング"
---

## 概要

Cloudflare Containers は、Cloudflare が新しく提供しているエッジネットワーク上のコンテナ実行基盤。現在はオープンベータ段階で、**Workers Paid プラン加入者は追加料金なしで試用可能**。

---

## Containers の仕組み

### 基本概念

- `linux/amd64` 向けのステートレスなコンテナを実行可能
- コンテナは **Durable Objects** にアタッチする形で管理
- SQL ストレージなど他機能との連携でステートフルな実行も可能

### 動作フロー

1. Docker イメージを Cloudflare 管理のレジストリ (`registry.cloudflare.com`) に push
2. CDN 経由で Cloudflare のエッジネットワーク全体にイメージが配布
3. リクエストを受けた Worker が、最も近い場所でコンテナを起動・実行

> **Durable Objects**: 固定のデータロケーションでステートフルに実行できる Workers の永続化オブジェクト

---

## 使い方

### プロジェクト作成

```bash
pnpm create cloudflare --template cloudflare/templates/containers
```

プロンプトに従って `Would you like to deploy now?` → `Yes` を選択するとすぐにデプロイ可能。

### 動作確認

- デプロイ後、`<プロジェクト名>.<アカウント名>.workers.dev` の URL にアクセス
- テンプレートでは `/` ではコンテナへのアクセスは発生しないため、`/singleton` にアクセス
- 初回デプロイ時はプロビジョニング完了まで待機が必要（著者の環境では1分未満）

### コード例

```typescript
// ルートでの Durable Objects 呼び出し
const container = getContainer(c.env.MY_CONTAINER);
return await container.fetch(c.req.raw);

// Durable Object クラスの定義
export default class extends Container<Env> {
    defaultPort = 80
}
```

---

## コンテナイメージの設定

### wrangler.jsonc の構成

```json
{
    "containers": [
        {
            "class_name": "MyContainer",          // DO のエントリーポイント
            "image": "registry.cloudflare.com/<scope>/<image-name>",  // 使用イメージ
            "name": "name-of-the-container",      // コンテナ名（任意）
            "max_instances": 2                    // 最大インスタンス数
        }
    ],
    "durable_objects": {
        "bindings": [
            {
                "class_name": "MyContainer",
                "name": "MY_CONTAINER"
            }
        ]
    }
}
```

### レジストリについて

- 現在は `registry.cloudflare.com` にプッシュしたイメージのみ指定可能
- R2 (Cloudflare のオブジェクトストレージ) 上に構築
- 外部レジストリ (Docker Hub など) のイメージは `docker pull` → `wrangler containers images push` で利用可能
- **将来的に**: 外部イメージレジストリの直接指定とキャッシュ機能を実装予定

---

## Container クラスと `this.ctx.container`

### コンテナ制御 API

Durable Object の `this.ctx.container` で以下の制御が可能：

```typescript
// コンテナを起動
void this.ctx.container.start();

// POSIX シグナルを送信
void this.ctx.container.signal();

// コンテナを削除
void this.ctx.container.destroy();

// コンテナ停止まで待機
this.ctx.container.monitor()
    .then((exitCode) => console.log(`Container exited with code: ${exitCode}`))
    .catch((reason) => console.log(`Container errored: ${reason}`));

// ポートを取得してリクエスト送信
const port = this.ctx.container.getTcpPort(80);
const response = await port.fetch('http://container.internal', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'greeting': 'Hello, world' })
});
```

### Container クラスのプロパティ

| プロパティ | 説明 |
|-----------|------|
| `defaultPort` | `fetch()` のデフォルトポート |
| `requiredPorts` | 起動時に利用可能確認するポート |
| `sleepAfter` | 未使用時の生存期間（例: `'10m'`） |
| `manualStart` | 手動起動モード（デフォルト: false） |
| `envVars` | 環境変数 |
| `entrypoint` | 起動コマンド |
| `enableInternet` | インターネット接続の有効化 |

### ライフサイクルメソッド

```typescript
export default class extends Container<Env> {
    defaultPort = 80
    sleepAfter = '10m'

    override async onStart(): Promise<void> {
        console.log('Container started');
    }

    override async onStop(): Promise<void> {
        console.log('Container shut down');
    }

    override async onError(error: unknown): Promise<void> {
        console.error('Container error: ' + error);
    }
}
```

### ユーティリティ関数

```typescript
import { Container, getRandom, getContainer } from '@cloudflare/containers';

// ランダムなコンテナを取得（負荷分散用）
const stub = await getRandom(env.MY_CONTAINER_NAMESPACE, 2);

// 固有のコンテナを取得
const stub = getContainer(env.MY_CONTAINER_NAMESPACE);
```

---

## 料金について

### オープンベータ中

- **Workers Paid プラン加入で追加料金なし**
- Workers と Durable Objects は通常通り課金

### 正式リリース後の予定価格

| プラン | Memory | CPU | Disk |
|--------|--------|-----|------|
| **Workers Paid** | 25 GiB-hours/月 含む<br>+$0.0000025/GiB-秒 | 375 vCPU-minutes/月<br>+$0.000020/vCPU-秒 | 200 GB-hours/月<br>+$0.00000007/GB-秒 |

**リージョン別ネットワーク料金**:

| リージョン | 価格/GB | 月間無料枠 |
|------------|---------|-----------|
| 北米・欧州 | $0.025 | 1 TB |
| オセアニア・韓国・台湾 | $0.05 | 500 GB |
| その他 | $0.04 | 500 GB |

---

## 著者の感想と注意点

### 良い点

- エッジネットワーク上でコンテナを動かせる仕組みは興味深い
- 今後のユースケース拡大に期待

### 注意点

- コンテナの初回起動に時間がかかることがある
- データセンターの位置によってレイテンシーが変わる
- `@cloudflare/containers` のエラーハンドリングに改善の余地あり

### 推奨ユースケース

- **Cron Trigger + Workflow** での利用が現時点では適している

### 今後の予定機能

- **オートスケーリング**: `Container` クラスで `autoscale = true` を設定して有効化予定

```typescript
export class MyContainer extends Container<Env> {
    autoscale = true  // 将来の機能
}
```

---

## 参考リンク

- [Cloudflare Containers 公式ドキュメント](https://developers.cloudflare.com/containers/)
- [Cloudflare Containers 料金ページ](https://developers.cloudflare.com/containers/pricing/)
- [serverless-registry (GitHub)](https://github.com/cloudflare/serverless-registry)
- [containers SDK (GitHub)](https://github.com/cloudflare/containers)
