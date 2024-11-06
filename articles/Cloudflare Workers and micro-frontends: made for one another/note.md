# Cloudflare Workers and micro-frontends: made for one another

ref: <https://blog.cloudflare.com/better-micro-frontends/>

## 背景と課題

現代のフロントエンド開発では、アプリケーションが大規模化・複雑化する中で以下の課題が発生しています[1]:

- モノリシックなJavaScriptアプリケーションは低パフォーマンスで脆弱
- 複数チームの協業が困難
- 一つのチームの技術的負債が全体に影響

## Cloudflare Workersを活用したソリューション

Cloudflareは「フラグメントアーキテクチャ」という新しいアプローチを提案しています[1]:

**主な特徴:**

- 各機能を独立した「フラグメント」として開発・デプロイ
- サーバーサイドレンダリングを活用
- Cloudflare Workersの分散実行環境を活用

## アーキテクチャの利点

1. **優れたカプセル化**

- フラグメントは完全に独立して開発・デプロイ可能
- セキュリティ上重要なコードをブラウザに送信しない[1]

2. **高いパフォーマンス**

- サーバーサイドレンダリングによる高速な表示
- フラグメント間の低レイテンシー通信
- 優れたLighthouseスコア[1]

3. **優れた拡張性**

- フラグメントは完全に組み合わせ可能
- 大規模プロジェクトでも開発・デプロイが容易[1]

## 従来のソリューションとの違い

1. クライアントサイドのマイクロフロントエンドと比較して:

- レンダリング速度が向上
- インタラクションのレイテンシーが低下[1]

2. 従来のサーバーサイドレンダリングと比較して:

- グローバルに分散された実行環境
- フラグメント間の通信オーバーヘッドがほぼゼロ[1]

このアーキテクチャは、特に大規模なエンタープライズWebアプリケーションの開発において、パフォーマンスとチーム開発の効率を両立する有効なソリューションとなっています。

## アーキテクチャの基本構造

**フラグメントの構成:**

- 各フラグメントは独立したCloudflare Workerとして実装[1]
- ルートフラグメントが子フラグメントを呼び出す木構造[1]
- 各フラグメントは独自のアセット(JavaScript、CSS、画像など)を保持[1]

## フラグメントの実装方法

**基本実装:**

```javascript
export default {
  fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
    return renderResponse(request, env, <Header />, manifest, "header");
  },
};
```

このコードは以下を実現します:

- Workerのfetchハンドラーでフラグメントをレンダリング[1]
- レスポンスをストリーミング形式で返却[1]

## フラグメント間の連携

**子フラグメントの組み込み:**

```javascript
<div class="content">
  <FragmentPlaceholder name="filter" />
  <FragmentPlaceholder name="gallery" />
</div>
```

**重要な特徴:**

- FragmentPlaceholderコンポーネントが子フラグメントのリクエストと注入を担当[1]
- Service bindingsを使用して低レイテンシーな通信を実現[1]
- 親フラグメントは子フラグメントのアセットリクエストをプロキシ[1]

## アセット管理の仕組み

**アセットパスの規約:**

- `/_fragment/<fragment-name>`というプレフィックスを使用[1]
- 各フラグメントは独自のアセットを提供[1]

**アセットリクエストの処理:**

```javascript
export default {
  async fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
    const asset = await tryGetFragmentAsset(env, request);
    if (asset !== null) {
      return asset;
    }
    return renderResponse(request, env, <Root />, manifest, "div");
  },
};
```

## パフォーマンスの最適化

**主な最適化ポイント:**

- パラレルレンダリングによる高速化[1]
- ストリーミングレスポンスによる初期表示の高速化[1]
- フラグメント単位でのキャッシュ戦略[1]
- Service bindingsによるフラグメント間通信の最適化[1]

## 従来のアプローチとの違い

1. **クライアントサイドマイクロフロントエンドとの比較:**

- レンダリング速度が向上
- インタラクションレイテンシーが低下[4]

2. **従来のサーバーサイドレンダリングとの比較:**

- グローバルに分散された実行環境
- フラグメント間の通信オーバーヘッドがほぼゼロ[4]

このアーキテクチャは、特に大規模なエンタープライズWebアプリケーションにおいて、パフォーマンスとチーム開発の効率を両立する効果的なソリューションとなっています。

Sources
[1]  <https://blog.cloudflare.com/better-micro-frontends/>
[2] Workersを使って誰もがCloudflare上でJavaScriptを実行できるよう ... <https://blog.cloudflare.com/ja-jp/cloudflare-workers-unleashed/>
[3] Built with Cloudflare <https://workers.cloudflare.com/built-with>
[4] Cloudflare Workers and micro-frontends: made for one another <https://blog.cloudflare.com/better-micro-frontends/>
[5] Micro frontend architecture: what, why and how to use it - Euristiq <https://euristiq.com/micro-frontend-architecture/>
[6] Incremental adoption of micro-frontends with Cloudflare Workers <https://blog.cloudflare.com/fragment-piercing/>
