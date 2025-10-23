---
title: "Next.js 16"
source: "https://nextjs.org/blog/next-16#nextjs-devtools-mcp"
author:
  - "[[Jimmy Lai]]"
  - "[[Josh Story]]"
  - "[[Sebastian Markbåge]]"
  - "[[Tim Neutkens]]"
published: 2025-10-22
created: 2025-10-23
description: "Next.js 16 includes Cache Components, stable Turbopack, file system caching, React Compiler support, smarter routing, new caching APIs, and React 19.2 features."
tags:
  - "Next.js"
  - "Turbopack"
  - "React"
  - "Performance"
  - "Cache Components"
  - "Developer Experience"
  - "Web Development"
---

## 概要

Next.js 16は、Next.js Conf 2025の前にリリースされた大型アップデートです。Turbopack、キャッシング、Next.jsアーキテクチャに関する最新の改善が含まれています。

### アップグレード方法

```bash
# 自動アップグレードCLIを使用
npx @next/codemod@canary upgrade latest

# または手動でアップグレード
npm install next@latest react@latest react-dom@latest

# または新しいプロジェクトを開始
npx create-next-app@latest
```

## 主要な新機能

### 1. Cache Components（キャッシュコンポーネント）

Cache Componentsは、Next.jsのキャッシングをより明示的で柔軟にする新機能です。

**特徴:**

- 新しい`"use cache"`ディレクティブでページ、コンポーネント、関数をキャッシュ可能
- コンパイラが自動的にキャッシュキーを生成
- **完全にオプトイン方式**：すべての動的コードはデフォルトでリクエスト時に実行
- Partial Pre-Rendering (PPR)のストーリーを完成させる機能

**設定方法:**

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

**重要な変更:**

- 以前の`experimental.ppr`フラグとオプションは削除され、Cache Components設定に置き換えられました

### 2. Next.js Devtools MCP

Model Context Protocolと統合された新しいデバッグツールです。

**提供される機能:**

- **Next.jsの知識**: ルーティング、キャッシング、レンダリング動作の理解
- **統合ログ**: ブラウザとサーバーのログを切り替えなしで閲覧
- **自動エラーアクセス**: 詳細なスタックトレースを手動コピーなしで取得
- **ページ認識**: アクティブなルートのコンテキスト理解

AIエージェントが問題を診断し、動作を説明し、開発ワークフロー内で直接修正を提案できるようになります。

### 3. `proxy.ts`（旧`middleware.ts`）

`proxy.ts`が`middleware.ts`を置き換え、アプリのネットワーク境界を明示的にします。

**変更点:**

- `middleware.ts` → `proxy.ts`にリネーム
- エクスポート関数も`proxy`にリネーム
- Node.jsランタイムで実行
- ロジックは同じまま

```typescript
// proxy.ts
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}
```

**注意:** `middleware.ts`はEdgeランタイムのユースケースで引き続き使用可能ですが、非推奨となり、将来のバージョンで削除されます。

### 4. ログの改善

**開発リクエストログの拡張:**

- Compile: ルーティングとコンパイル
- Render: コードの実行とReactレンダリング

**ビルドログの改善:**
ビルドプロセスの各ステップが完了時間とともに表示されます。

```
   ▲ Next.js 16 (Turbopack)

 ✓ Compiled successfully in 615ms
 ✓ Finished TypeScript in 1114ms
 ✓ Collecting page data in 208ms
 ✓ Generating static pages in 239ms
 ✓ Finalizing page optimization in 5ms
```

## 以前のベータリリースからの機能

### 5. Turbopack（安定版）

Turbopackは開発と本番ビルドの両方で安定版に達し、すべての新しいNext.jsプロジェクトのデフォルトバンドラーになりました。

**採用状況:**

- Next.js 15.3以降で、開発セッションの50%以上、本番ビルドの20%がTurbopackで実行中

**パフォーマンス:**

- 本番ビルドが2-5倍高速化
- Fast Refreshが最大10倍高速化

**カスタムwebpack設定を使用する場合:**

```bash
next dev --webpack
next build --webpack
```

### 6. Turbopackファイルシステムキャッシング（ベータ版）

開発環境でのファイルシステムキャッシングをサポートし、実行間でコンパイラアーティファクトをディスクに保存します。

**有効化方法:**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
```

特に大規模プロジェクトで、再起動間のコンパイル時間が大幅に高速化されます。

### 7. Reactコンパイラサポート（安定版）

Reactコンパイラの組み込みサポートが安定版になりました（React Compiler 1.0リリースに続いて）。

**特徴:**

- コンポーネントを自動メモ化し、不要な再レンダリングを削減
- 手動でのコード変更は不要
- `experimental`から`stable`設定に昇格

**注意:**

- デフォルトでは有効になっていません
- 有効にすると、React CompilerがBabelに依存するため、開発とビルド時のコンパイル時間が長くなります

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

**インストール:**

```bash
npm install babel-plugin-react-compiler@latest
```

### 8. Build Adapters API（アルファ版）

カスタムアダプターを作成してビルドプロセスに介入できる新しいAPIです。

**用途:**

- デプロイメントプラットフォームとの統合
- カスタムビルド統合
- Next.js設定の変更
- ビルド出力の処理

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
};

module.exports = nextConfig;
```

### 9. ルーティングとナビゲーションの強化

ルーティングとナビゲーションシステムの完全なオーバーホールにより、ページ遷移がより軽量で高速になりました。

**レイアウトの重複排除:**

- 共有レイアウトを持つ複数のURLをプリフェッチする場合、レイアウトは各リンクごとに個別ではなく一度だけダウンロード
- 例：50個の製品リンクを持つページで、共有レイアウトが50回ではなく1回だけダウンロードされ、ネットワーク転送サイズが劇的に削減

**インクリメンタルプリフェッチ:**

- Next.jsはページ全体ではなく、まだキャッシュにない部分のみをプリフェッチ
- リンクがビューポートを離れるとリクエストをキャンセル
- ホバー時またはビューポートへの再侵入時にリンクプリフェッチを優先
- データが無効化されたときにリンクを再プリフェッチ

**トレードオフ:** より多くの個別のプリフェッチリクエストが発生する可能性がありますが、合計転送サイズははるかに小さくなります。

### 10. キャッシングAPIの改善

#### `revalidateTag()`（更新）

`revalidateTag()`は、stale-while-revalidate (SWR)動作を有効にするために、第2引数として**`cacheLife`プロファイル**が必要になりました。

```typescript
import { revalidateTag } from 'next/cache';

// ✅ 組み込みのcacheLifeプロファイルを使用（ほとんどの場合'max'を推奨）
revalidateTag('blog-posts', 'max');

// または他の組み込みプロファイルを使用
revalidateTag('news-feed', 'hours');
revalidateTag('analytics', 'days');

// またはカスタムリバリデーション時間でインラインオブジェクトを使用
revalidateTag('products', { revalidate: 3600 });

// ⚠️ 非推奨 - 単一引数形式
revalidateTag('blog-posts');
```

**使用推奨シーン:**

- 適切にタグ付けされたキャッシュエントリのみを無効化したい場合
- stale-while-revalidate動作が必要な場合
- 最終的な整合性を許容できる静的コンテンツ

#### `updateTag()`（新規）

Server Actions専用の新しいAPIで、**read-your-writes**セマンティクスを提供します。

```typescript
'use server';

import { updateTag } from 'next/cache';

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);

  // キャッシュを期限切れにして即座にリフレッシュ - ユーザーは変更を即座に確認
  updateTag(`user-${userId}`);
}
```

**使用推奨シーン:**

- フォーム、ユーザー設定など、インタラクティブな機能
- ユーザーが変更を即座に確認することを期待するワークフロー

#### `refresh()`（新規）

Server Actions専用の新しいAPIで、**キャッシュされていないデータのみ**をリフレッシュします。

```typescript
'use server';

import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId);

  // ヘッダーに表示される通知カウントをリフレッシュ
  // （別途取得され、キャッシュされていないもの）
  refresh();
}
```

クライアント側の`router.refresh()`と補完的なAPIです。通知カウント、ライブメトリクス、ステータスインジケーターなどの動的データをリフレッシュしながら、キャッシュされたページシェルと静的コンテンツは高速に保ちます。

### 11. React 19.2とCanary機能

Next.js 16のApp Routerは、最新のReact Canaryリリースを使用しており、新しくリリースされたReact 19.2機能を含みます。

**ハイライト:**

- **View Transitions**: Transition内またはナビゲーション中に更新される要素をアニメーション化
- **`useEffectEvent`**: EffectからリアクティブでないロジックをEffect Event関数に抽出
- **Activity**: `display: none`でUIを非表示にしながら状態を維持し、Effectをクリーンアップすることで「バックグラウンドアクティビティ」をレンダリング

## 破壊的変更とその他の更新

### バージョン要件

| 変更 | 詳細 |
|------|------|
| **Node.js 20.9+** | 最小バージョンは20.9.0（LTS）、Node.js 18はサポート終了 |
| **TypeScript 5+** | 最小バージョンは5.1.0 |
| **ブラウザ** | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |

### 削除された機能

| 削除されたもの | 代替 |
|--------------|------|
| **AMPサポート** | すべてのAMP APIと設定が削除 |
| **`next lint`コマンド** | BiomeまたはESLintを直接使用。コードモッドが利用可能 |
| **`serverRuntimeConfig`, `publicRuntimeConfig`** | 環境変数（`.env`ファイル）を使用 |
| **`experimental.turbopack`の場所** | トップレベルの`turbopack`に移動 |
| **`experimental.dynamicIO`フラグ** | `cacheComponents`に改名 |
| **`experimental.ppr`フラグ** | Cache Componentsプログラミングモデルに進化 |
| **同期的な`params`, `searchParams`アクセス** | 非同期使用が必須：`await params`, `await searchParams` |
| **同期的な`cookies()`, `headers()`, `draftMode()`アクセス** | 非同期使用が必須 |

### 動作の変更

| 変更された動作 | 詳細 |
|--------------|------|
| **デフォルトバンドラー** | Turbopackがすべてのアプリのデフォルト。`next build --webpack`でオプトアウト可能 |
| **`images.minimumCacheTTL`デフォルト** | 60秒から4時間（14400秒）に変更 |
| **`images.imageSizes`デフォルト** | デフォルトサイズから`16`を削除 |
| **`images.qualities`デフォルト** | `[1..100]`から`[75]`に変更 |
| **`images.dangerouslyAllowLocalIP`** | デフォルトでローカルIP最適化をブロック |
| **`images.maximumRedirects`デフォルト** | 無制限から最大3リダイレクトに変更 |
| **プリフェッチキャッシュの動作** | レイアウト重複排除とインクリメンタルプリフェッチで完全に書き直し |
| **`revalidateTag()`シグネチャ** | stale-while-revalidate動作のために第2引数として`cacheLife`プロファイルが必要 |
| **Parallel routes `default.js`** | すべてのparallel routeスロットに明示的な`default.js`ファイルが必要 |

### 非推奨

| 非推奨 | 詳細 |
|--------|------|
| `middleware.ts`ファイル名 | `proxy.ts`に改名 |
| `next/legacy/image`コンポーネント | `next/image`を使用 |
| `images.domains`設定 | `images.remotePatterns`を使用 |
| `revalidateTag()`単一引数 | `revalidateTag(tag, profile)`またはActionsで`updateTag(tag)`を使用 |

### 追加の改善

- **パフォーマンス改善**: `next dev`と`next start`コマンドの大幅なパフォーマンス最適化
- **`next.config.ts`のNode.jsネイティブTypeScript**: `--experimental-next-config-strip-types`フラグでネイティブTypeScriptを有効化

## フィードバックとコミュニティ

- [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [GitHub Issues](https://github.com/vercel/next.js/issues)
- [Discord Community](https://nextjs.org/discord)

## まとめ

Next.js 16は、パフォーマンス、開発者体験、アーキテクチャの改善に焦点を当てた大型アップデートです。特に注目すべきは：

1. **Cache Components**: より明示的で柔軟なキャッシング戦略
2. **Turbopack安定版**: すべてのアプリでデフォルトになり、大幅な速度向上
3. **改善されたキャッシングAPI**: `updateTag()`と`refresh()`の追加、`revalidateTag()`の改善
4. **Next.js Devtools MCP**: AIを活用したデバッグとワークフローの改善
5. **React 19.2サポート**: 最新のReact機能との統合

Next.js 16は、より高速で、より予測可能で、より柔軟な開発体験を提供することを目指しています。
