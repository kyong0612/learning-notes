---
title: "How we rebuilt Next.js with AI in one week"
source: "https://blog.cloudflare.com/vinext/"
author:
  - "[[Steve Faulkner]]"
published: 2026-02-24
created: 2026-02-26
description: "Cloudflareのエンジニア1人がAIを活用し、1週間でNext.jsをVite上に再実装。vinextはビルド最大4.4倍高速化、バンドルサイズ57%削減を実現し、Cloudflare Workersへのワンコマンドデプロイを可能にする。"
tags:
  - "clippings"
  - "AI"
  - "Next.js"
  - "Vite"
  - "Cloudflare Workers"
  - "JavaScript"
  - "Open Source"
  - "Performance"
---

## 概要

Cloudflareのエンジニアリングマネージャー1人がAIモデル（Claude）を指揮し、**1週間未満**で最も人気のあるフロントエンドフレームワークNext.jsを[Vite](https://vite.dev/)上にゼロから再実装した。成果物である**[vinext](https://github.com/cloudflare/vinext)**（「ヴィーネクスト」と発音）はNext.jsのドロップイン代替であり、Cloudflare Workersへのワンコマンドデプロイを実現する。プロジェクト全体のコストは**約$1,100のAPIトークン**。

---

## Next.jsのデプロイメント問題

- Next.jsは最も人気のあるReactフレームワークだが、サーバーレスエコシステムでの**デプロイに課題**がある
- Next.jsはTurbopackに大きく投資しているが、Cloudflare・Netlify・AWS Lambdaなどにデプロイする際、ビルド出力をターゲットプラットフォームが実行可能な形に変換する必要がある
- **[OpenNext](https://opennext.js.org/)** がこの問題を解決するために構築されたが、Next.jsのビルド出力をリバースエンジニアリングする必要があり、バージョン間の予測不能な変更に対応する「もぐら叩き」状態に陥っている
- Next.jsのアダプターAPIはまだ初期段階であり、アダプターがあってもTurbopackツールチェーンに依存する。開発時の`next dev`はNode.jsでのみ動作し、Durable Objects・KV・AIバインディングなどのプラットフォーム固有APIのテストにはワークアラウンドが必要

## vinextの紹介

vinextはNext.jsの出力をラップするのではなく、**Next.jsのAPIサーフェスをVite上にクリーンに再実装**したもの。

```bash
npm install vinext
```

`next`を`vinext`に置き換えるだけで、既存の`app/`、`pages/`、`next.config.js`はそのまま動作する。

```bash
vinext dev    # HMR付き開発サーバー
vinext build  # プロダクションビルド
vinext deploy # ビルド＆Cloudflare Workersへデプロイ
```

ルーティング、サーバーレンダリング、React Server Components、Server Actions、キャッシュ、ミドルウェアのすべてがViteプラグインとして構築されている。[Vite Environment API](https://vite.dev/guide/api-environment)により、あらゆるプラットフォームで動作可能。

---

## ベンチマーク結果

33ルートのApp Routerアプリケーションで比較。TypeScriptの型チェックとESLintは無効化し、`force-dynamic`を使用してバンドラーとコンパイル速度のみを計測。

### プロダクションビルド時間

| Framework | 平均 | vs Next.js |
| --- | --- | --- |
| Next.js 16.1.6 (Turbopack) | 7.38s | baseline |
| vinext (Vite 7 / Rollup) | 4.64s | **1.6x 高速** |
| vinext (Vite 8 / Rolldown) | 1.67s | **4.4x 高速** |

### クライアントバンドルサイズ（gzip圧縮後）

| Framework | Gzipped | vs Next.js |
| --- | --- | --- |
| Next.js 16.1.6 | 168.9 KB | baseline |
| vinext (Rollup) | 74.0 KB | **56% 小さい** |
| vinext (Rolldown) | 72.9 KB | **57% 小さい** |

> **注意**: これらはコンパイルとバンドル速度の計測であり、本番サービング性能ではない。テストフィクスチャは33ルートの単一アプリであり、すべての本番アプリを代表するものではない。[完全な方法論と過去の結果](https://benchmarks.vinext.workers.dev/)は公開されている。

特に[Rolldown](https://rolldown.rs/)（Vite 8で搭載予定のRustベースバンドラー）のアーキテクチャ上の優位性が顕著に表れている。

---

## Cloudflare Workersへのデプロイ

vinextはCloudflare Workersを第一のデプロイターゲットとして設計されている。

```bash
vinext deploy
```

このコマンド1つでアプリのビルド、Worker設定の自動生成、デプロイまで完了。App RouterとPages Routerの両方がWorkersで動作し、クライアントサイドのハイドレーション・インタラクティブコンポーネント・クライアントサイドナビゲーション・React stateを完全サポート。

### キャッシュ

Cloudflare KVキャッシュハンドラーによるISR（Incremental Static Regeneration）を標準搭載:

```javascript
import { KVCacheHandler } from "vinext/cloudflare";
import { setCacheHandler } from "next/cache";
setCacheHandler(new KVCacheHandler(env.MY_KV_NAMESPACE));
```

キャッシュレイヤーはプラガブルで、[R2](https://developers.cloudflare.com/r2/)やCache APIへの差し替えも可能。

### ライブデモ

- [Pages Router minimal](https://pages-router-cloudflare.vinext.workers.dev/)
- [App Router minimal](https://app-router-cloudflare.vinext.workers.dev/)
- [Hacker News clone](https://hackernews.vinext.workers.dev/)
- [App Router Playground](https://app-router-playground.vinext.workers.dev/)
- [Cloudflare Agents + Next.js](https://next-agents.threepointone.workers.dev/) — `getPlatformProxy`等のワークアラウンド不要でDurable Objects・AIバインディング等を直接利用可能

---

## フレームワークはチームスポーツ

- vinextの約95%はピュアなViteであり、Cloudflare固有ではない
- Cloudflareは他のホスティングプロバイダーとの協力を求めている
- [Vercel上での概念実証](https://vinext-on-vercel.vercel.app/)は30分未満で動作した
- オープンソースプロジェクトとして、他プラットフォームからのPRを歓迎

---

## ステータス: Experimental

- vinextは**実験的**であり、まだ1週間も経っていない
- **テストスイートは充実**: 1,700以上のVitestテスト、380のPlaywright E2Eテスト（Next.jsテストスイートおよびOpenNextのCloudflare適合スイートから移植含む）
- **Next.js 16 APIサーフェスの94%をカバー**
- [National Design Studio](https://ndstudio.gov/)が[CIO.gov](https://www.cio.gov/)で**すでに本番運用中**
- [未サポート事項](https://github.com/cloudflare/vinext#whats-not-supported-and-wont-be)と[既知の制限事項](https://github.com/cloudflare/vinext#known-limitations)はREADMEに明記

---

## プリレンダリングについて

- **ISR（Incremental Static Regeneration）** は既にサポート済み
- ビルド時の**静的プリレンダリング**（`generateStaticParams()`によるもの）は未対応（[ロードマップ上](https://github.com/cloudflare/vinext/issues/9)）
- 100%静的コンテンツのサイトには現時点でのメリットは限定的（[Astro](https://astro.build/)のような静的コンテンツ向けフレームワークを推奨）

---

## Traffic-aware Pre-Rendering（TPR）

ビルド時のプリレンダリングに代わる新しいアプローチ。**実験的機能**。

### 従来の課題
Next.jsは`generateStaticParams()`に列挙された全ページをビルド時にプリレンダリングする。10,000の商品ページがあれば10,000回のレンダリングが発生するが、99%のページはリクエストを受けない可能性がある。

### TPRの仕組み
Cloudflareはリバースプロキシとしてトラフィックデータを保有。デプロイ時にゾーン分析を照会し、**実際にアクセスされるページのみをプリレンダリング**する。

```bash
vinext deploy --experimental-tpr

Building...
Build complete (4.2s)

TPR (experimental): Analyzing traffic for my-store.com (last 24h)
TPR: 12,847 unique paths — 184 pages cover 90% of traffic
TPR: Pre-rendering 184 pages...
TPR: Pre-rendered 184 pages in 8.3s → KV cache

Deploying to Cloudflare Workers...
```

- 100,000ページのサイトでも、べき乗則により90%のトラフィックは通常50〜200ページに集中
- これらのみプリレンダリングし、残りはオンデマンドSSR + ISRで対応
- デプロイごとに最新のトラフィックパターンに基づきセットを更新
- `generateStaticParams()`不要、本番データベースへの依存も不要

---

## AIによる構築プロセス

### プロジェクトタイムライン
- **2月13日（初日夕方）**: Pages RouterとApp Routerの基本SSR、ミドルウェア、Server Actions、ストリーミングが動作
- **翌日午後**: App Router Playgroundで11ルート中10ルートがレンダリング
- **3日目**: `vinext deploy`でCloudflare Workersへ完全なクライアントハイドレーション付きデプロイ
- **残りの週**: エッジケースの修正、テストスイートの拡大、API カバレッジ94%達成

### 成功の要因
1. **Next.jsは十分に仕様化されている** — 広範なドキュメント、大規模なユーザーベース、長年のStack Overflowの回答。APIサーフェスはトレーニングデータに豊富
2. **精巧なテストスイートの存在** — Next.jsリポジトリの数千のE2Eテストから直接移植し、機械的に検証可能な仕様として活用
3. **Viteが優れた基盤** — 高速HMR、ネイティブESM、クリーンなプラグインAPI、[@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-rsc)によるRSCサポート
4. **モデルの能力が追いついた** — 数ヶ月前では不可能だった。最新モデルはコードベース全体のアーキテクチャを保持し、モジュール間の相互作用を推論できる

### 開発ワークフロー
1. タスクを定義（例: 「`next/navigation`シムをusePathname、useSearchParams、useRouterで実装」）
2. AIに実装とテストを書かせる
3. テストスイートを実行
4. テストが通ればマージ、通らなければエラー出力をAIに渡して反復

- AIエージェントをコードレビューにも活用。PRが開かれるとエージェントがレビューし、レビューコメントには別のエージェントが対応
- [agent-browser](https://github.com/vercel-labs/agent-browser)を使ったブラウザレベルのテストも実施
- [OpenCode](https://opencode.ai/)で**800以上のセッション**を実行

### 人間の役割
- AIは完璧ではなく、自信を持って誤った実装をするPRもあった
- **アーキテクチャ決定、優先順位付け、AIが行き止まりに向かっているときの軌道修正**はすべて人間が担当

---

## ソフトウェアの未来への示唆

> ソフトウェアの抽象化層の多くは、人間が複雑さを管理するために存在する。AIは同じ制約を持たない。仕様と基盤さえあれば、中間のフレームワークなしに直接コードを書ける。

- vinextはこのパターンのデータポイント：APIコントラクト + ビルドツール + AIモデルで、AIがその間のすべてを書いた
- どの抽象化が本質的で、どれが人間の認知的制約のための「松葉杖」だったのかは、今後数年で大きく変わる可能性がある

---

## 利用方法

### Agent Skillによる自動マイグレーション

```bash
npx skills add cloudflare/vinext
```

Claude Code、OpenCode、Cursor、Codexなど多数のAIコーディングツールに対応。プロジェクトを開いて「migrate this project to vinext」と指示するだけ。

### 手動マイグレーション

```bash
npx vinext init    # 既存のNext.jsプロジェクトをマイグレーション
npx vinext dev     # 開発サーバー起動
npx vinext deploy  # Cloudflare Workersへデプロイ
```

ソースコード: [github.com/cloudflare/vinext](https://github.com/cloudflare/vinext)
