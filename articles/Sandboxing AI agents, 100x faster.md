---
title: "Sandboxing AI agents, 100x faster"
source: "https://blog.cloudflare.com/dynamic-workers/"
author:
  - "[[Kenton Varda]]"
  - "[[Sunil Pai]]"
  - "[[Ketan Gupta]]"
published: 2026-03-24
created: 2026-03-26
description: "Cloudflare が Dynamic Workers を発表。V8 isolate ベースの軽量サンドボックスにより、AIエージェントが生成したコードをコンテナ比100倍高速（ミリ秒単位）で安全に実行可能。オープンベータとして全有料Workersユーザーに提供開始。"
tags:
  - "clippings"
  - "Cloudflare"
  - "AI"
  - "Agents"
  - "Sandboxing"
  - "Cloudflare Workers"
  - "V8 Isolate"
  - "MCP"
  - "TypeScript"
  - "Developer Platform"
---

## 概要

Cloudflare は **Dynamic Workers**（Dynamic Worker Loader API）のオープンベータを発表した。これは、AIエージェントが実行時に生成したコードを、V8 isolate ベースの軽量サンドボックス内で安全に実行するための仕組みである。従来のコンテナベースのサンドボックスに対し、**起動速度100倍（数ミリ秒）**、**メモリ効率10〜100倍（数MB）** という大幅な改善を実現している。

背景として、2025年9月に発表された「Code Mode」— エージェントがツールコールではなくコードを書いてAPIを呼び出すアプローチ — があり、MCP サーバーを TypeScript API に変換することでトークン使用量を81%削減できることが示されていた。Dynamic Workers は、この Code Mode で生成されたコードを安全に実行するための実行基盤として位置づけられる。

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/bHNbiOYjl5jRXSCglsAG8/5bc5cc820b5249142294429edb106296/BLOG-3243_1.png)

## 主要なトピック

### Dynamic Worker Loader：軽量サンドボックス

Dynamic Worker Loader API は、Cloudflare Worker が実行時に新しい Worker をそのサンドボックス内でインスタンス化できる機能である。**全有料 Workers ユーザーに対しオープンベータとして提供中。**

基本的な使い方：

```javascript
let worker = env.LOADER.load({
  compatibilityDate: "2026-03-01",
  mainModule: "agent.js",
  modules: { "agent.js": agentCode },
  env: { CHAT_ROOM: chatRoomRpcStub },
  globalOutbound: null, // インターネットアクセスをブロック
});
await worker.getEntrypoint().myAgent(param);
```

### コンテナとの比較：100倍高速

Dynamic Workers は、Cloudflare Workers プラットフォームが8年前の開始以来使用してきた **V8 isolate**（Google Chrome と同じ JavaScript エンジン）を基盤としている。

| 指標 | コンテナ | Dynamic Workers (Isolate) |
|------|---------|--------------------------|
| 起動時間 | 数百ミリ秒 | **数ミリ秒**（約100倍高速） |
| メモリ使用量 | 数百MB | **数MB**（10〜100倍効率的） |
| スケーラビリティ | グローバル同時実行数に制限あり | **制限なし**（毎秒100万リクエストにも対応） |
| レイテンシ | ウォームサンドボックスの検索が必要 | **ゼロレイテンシ**（同一マシン・同一スレッドで実行） |

**重要な特性：**
- リクエストごとに新しい isolate を起動し、使い捨てにできるほど軽量
- Cloudflare の世界数百拠点すべてで対応
- コンテナベースのプロバイダーのようなグローバル同時実行数制限なし

### JavaScript / TypeScript に最適化

Dynamic Workers の唯一の制約は、エージェントが **JavaScript** を書く必要があること（Python・WebAssembly も技術的には対応するが、小さなコードスニペットでは JavaScript が最速）。

**TypeScript による API 定義の優位性：**
- MCP はフラットなツールコールのスキーマを定義するが、プログラミング API は定義しない
- OpenAPI は冗長すぎる（記事内で ChatRoom API の TypeScript 定義 vs OpenAPI 定義を比較し、TypeScript の方が大幅に少ないトークン数で済むことを実証）
- TypeScript のインターフェースは LLM にとっても人間にとっても理解しやすい

```typescript
interface ChatRoom {
  getHistory(limit: number): Promise<Message[]>;
  subscribe(callback: (msg: Message) => void): Promise<Disposable>;
  post(text: string): Promise<void>;
}
```

Workers Runtime は [Cap'n Web RPC](https://blog.cloudflare.com/capnweb-javascript-rpc-library/) ブリッジを自動的に設定し、エージェントがセキュリティ境界を越えて API を呼び出せるようにする。

### HTTP フィルタリングとクレデンシャル注入

`globalOutbound` オプションにより、すべての HTTP リクエストに対するコールバックを登録し、以下の操作が可能：
- リクエストの検査・書き換え
- 認証キーの注入（**クレデンシャル注入**）— エージェント自身は秘密鍵を知ることがない
- リクエストのブロック

**TypeScript RPC インターフェースが HTTP より優れる理由：**
1. TypeScript インターフェースの方がトークン数が少ない
2. エージェントが書くコードもより少ないトークンで済む
3. HTTP フィルタリングは複雑（ヘッダー・パラメータのすべてを解釈する必要がある）で、TypeScript ラッパーの方が安全で簡単

### 堅牢なセキュリティ

isolate ベースのサンドボックスはハードウェア仮想マシンより攻撃面が複雑だが、Cloudflare は約10年の経験に基づく多層防御を実装：

- **V8 パッチの迅速な適用**：本番環境への反映が Chrome 自体よりも速い（数時間以内）
- **カスタム第2層サンドボックス**：リスク評価に基づくテナントの動的コードニング
- **V8 サンドボックスの拡張**：MPK（Memory Protection Keys）などのハードウェア機能を活用
- **Spectre 対策**：TU Graz との共同研究による新たな防御手法
- **悪意あるコードパターンの自動スキャン・ブロック**

## ヘルパーライブラリ

### `@cloudflare/codemode`

LLM が生成したコードを Dynamic Workers で実行するための SDK。

- `DynamicWorkerExecutor()`: サンドボックス構築、コード正規化、`globalOutbound` 制御
- `codeMcpServer()`: 既存 MCP Server をラップし、単一の `code()` ツールに置き換え
- `openApiMcpServer()`: OpenAPI スペックから `search()` と `execute()` ツールを持つ MCP Server を自動構築

### `@cloudflare/worker-bundler`

Dynamic Workers が必要とするプリバンドルモジュールを生成。ソースファイルと `package.json` を受け取り、npm 依存関係を解決し、esbuild でバンドル。`createApp` によるフルスタックアプリ（サーバーWorker + クライアントJS + 静的アセット）のバンドルもサポート。

### `@cloudflare/shell`

Dynamic Worker 内の仮想ファイルシステムを提供。`state` オブジェクト経由で read/write/search/replace/diff/glob/JSON操作が可能。

- ストレージは **Workspace**（SQLite + R2）に永続化
- `searchFiles`, `replaceInFiles`, `planEdits` などの粗粒度操作で RPC ラウンドトリップを最小化
- バッチ書き込みはデフォルトで**トランザクショナル**（失敗時は自動ロールバック）

## 重要な事実・データ

- **起動速度**: isolate は数ミリ秒で起動（コンテナの約100倍高速）
- **メモリ効率**: 数MB（コンテナの10〜100倍効率的）
- **スケーラビリティ**: 毎秒100万リクエスト対応、同時実行数制限なし
- **トークン削減**: MCP → TypeScript API 変換で81%削減
- **Cloudflare MCP サーバー**: 全 Cloudflare API をわずか2ツール・1,000トークン未満で公開
- **価格**: $0.002/ユニーク Worker/日（ベータ期間中は無料）+ 通常の CPU 時間・呼び出し料金
- **プラットフォーム歴**: Cloudflare Workers は8年間 isolate ベースで運用

## ユースケース

### Code Mode

エージェントが単一の TypeScript 関数で複数の API コールをチェーンし、Dynamic Worker で実行。コンテキストウィンドウには最終結果のみが入り、レイテンシとトークン使用量を削減。

### カスタムオートメーション構築

[Zite](https://www.zite.com/) はチャットインターフェースで LLM が TypeScript を書き、CRUD アプリ構築や Stripe/Airtable/Google Calendar 連携を実現。毎日数百万の実行リクエストを Dynamic Workers で処理。

> *"Cloudflare の Dynamic Workers はスピード、分離性、セキュリティの3つすべてを満たし、ベンチマークした他のすべてのプラットフォームを上回りました。"*
> — **Antony Toron**, CTO & Co-Founder, Zite

### AI生成アプリケーションの実行

AI がフルアプリケーションを生成するプラットフォームで、各アプリをオンデマンドで起動し、不要時はコールドストレージに戻す用途。ネットワークリクエストのブロック・インターセプトにより安全性を確保。

## 結論・示唆

### 著者の結論

コンテナベースのサンドボックスは、消費者規模のAIエージェント（すべてのユーザーがエージェントを持ち、すべてのエージェントがコードを書く世界）には重すぎる。V8 isolate ベースの Dynamic Workers は、100倍高速で、無制限にスケーラブルで、ゼロレイテンシのサンドボックスソリューションを提供する。JavaScript はウェブの特性上サンドボックス化に適しており、AI にとって最適な言語である。

### 実践的な示唆

- AIエージェントにコードを書かせる「Code Mode」アプローチにより、ツールコールベースよりも効率的な実行が可能
- TypeScript による API 定義は、OpenAPI や MCP スキーマよりも LLM に適したインターフェース記述方法
- クレデンシャル注入パターンにより、エージェントに秘密鍵を渡さずに認証付き API アクセスが可能
- ベータ期間中は $0.002/Worker/日の課金が免除されるため、試用に最適

## 制限事項・注意点

- **JavaScript のみ**: エージェントは JavaScript（TypeScript）でコードを書く必要がある（Python/WebAssembly は技術的に対応するが、小さなスニペットでは JS が推奨）
- **有料プランのみ**: Workers Paid プランが必要
- **価格は変動する可能性**: ベータ期間後の正式価格は公式ドキュメントを確認する必要がある
- **isolate のセキュリティ**: V8 のセキュリティバグはハイパーバイザーより頻度が高いため、多層防御が不可欠（Cloudflare 側で対応済み）

## 関連リソース

- [Dynamic Workers ドキュメント](https://developers.cloudflare.com/dynamic-workers/)
- [Dynamic Workers Starter](https://github.com/cloudflare/agents/tree/main/examples/dynamic-workers) — Hello World テンプレート
- [Dynamic Workers Playground](https://github.com/cloudflare/agents/tree/main/examples/dynamic-workers-playground) — ランタイムバンドル・実行・ログ確認
- [@cloudflare/codemode](https://www.npmjs.com/package/@cloudflare/codemode) — Code Mode SDK
- [@cloudflare/worker-bundler](https://www.npmjs.com/package/@cloudflare/worker-bundler) — バンドリングライブラリ
- [@cloudflare/shell](https://www.npmjs.com/package/@cloudflare/shell) — 仮想ファイルシステム
- [Discord サポート](https://discord.com/channels/595317990191398933/1460655307255578695)

![BLOG-3243 2](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/32d0ficYALnSneKc4jZPja/0d4d07d747fc14936f16071714b7a8e5/BLOG-3243_2.png)

![BLOG-3243 3](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/mQOJLnMtXULmj6l3DgKZg/ef2ee4cef616bc2d9a7caf35df5834f5/BLOG-3243_3.png)

---

*Source: [Sandboxing AI agents, 100x faster](https://blog.cloudflare.com/dynamic-workers/)*
