---
title: "Guides: Package Bundling | Next.js"
source: "https://nextjs.org/docs/app/guides/package-bundling"
author:
  - "[[Vercel]]"
published: 2026-03-16
created: 2026-03-17
description: "Next.jsアプリケーションのサーバー・クライアントバンドルを分析・最適化するためのガイド。Turbopack統合のNext.js Bundle Analyzer（実験的機能）と、Webpack向け@next/bundle-analyzerプラグインの使い方、および大規模バンドルの最適化手法を解説する。"
tags:
  - "clippings"
  - "Next.js"
  - "Turbopack"
  - "Bundle Analyzer"
  - "Webpack"
  - "Performance Optimization"
---

## 概要

バンドリングとは、アプリケーションコードとその依存関係を、クライアント・サーバー向けに最適化された出力ファイルに結合するプロセスである。バンドルサイズが小さいほど、読み込みが速くなり、JavaScript実行時間が短縮され、[Core Web Vitals](https://web.dev/articles/vitals) が改善し、サーバーのコールドスタート時間が低減する。

Next.jsはコード分割やツリーシェイキングなどの手法で自動的にバンドルを最適化するが、手動での最適化が必要な場合もある。本ガイドでは以下の2つのツールとバンドル最適化手法を解説する。

- **Next.js Bundle Analyzer（Turbopack統合 / 実験的機能）**
- **`@next/bundle-analyzer` プラグイン（Webpack向け）**

---

## Next.js Bundle Analyzer（実験的機能）

> **v16.1以降** で利用可能。[GitHubディスカッション](https://github.com/vercel/next.js/discussions/86731)でフィードバック可能。[デモ](https://turbopack-bundle-analyzer-demo.vercel.sh/)も公開されている。

Turbopackのモジュールグラフと統合されたBundle Analyzerで、サーバー・クライアントモジュールを正確なインポートトレースで検査できる。

### Step 1: Turbopack Bundle Analyzerの実行

以下のコマンドでインタラクティブビューをブラウザで開く。

```bash
npx next experimental-analyze
# yarn next experimental-analyze
# pnpm next experimental-analyze
# bunx next experimental-analyze
```

### Step 2: モジュールのフィルタリングと検査

UIでルート、環境（クライアント/サーバー）、タイプ（JavaScript, CSS, JSON）によるフィルタリングや、ファイル名による検索が可能。

### Step 3: インポートチェーンによるモジュールのトレース

ツリーマップでは各モジュールが矩形で表示され、面積がモジュールサイズに対応する。モジュールをクリックすると、サイズ、完全なインポートチェーン、アプリケーション内での使用箇所を確認できる。

### Step 4: 共有・差分比較のためにディスクに出力

`--output` フラグを使うと、インタラクティブビューをスキップして静的ファイルとして保存できる。

```bash
npx next experimental-analyze --output
```

出力先は `.next/diagnostics/analyze` で、最適化前後の比較に利用可能。

```bash
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

---

## `@next/bundle-analyzer`（Webpack向け）

[`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer) はバンドルサイズのビジュアルレポートを生成するプラグイン。各パッケージとその依存関係のサイズを視覚的に確認できる。

### Step 1: インストール

```bash
npm install @next/bundle-analyzer
# pnpm add @next/bundle-analyzer
# yarn add @next/bundle-analyzer
```

`next.config.js` に設定を追加する。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

### Step 2: レポートの生成

```bash
ANALYZE=true npm run build
```

ビルド完了時に3つのブラウザタブが自動で開き、バンドル内容を検査できる。

---

## 大規模バンドルの最適化

### 1. 多数のエクスポートを持つパッケージ

アイコンライブラリやユーティリティライブラリなど、数百のモジュールをエクスポートするパッケージでは、[`optimizePackageImports`](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) オプションを使用する。実際に使用するモジュールのみが読み込まれ、名前付きインポートの利便性は維持される。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['icon-library'],
  },
}

module.exports = nextConfig
```

> **補足**: Next.jsは一部のライブラリを自動的に最適化するため、`optimizePackageImports` リストに含める必要がない。[サポート対象パッケージの一覧](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)を参照。

### 2. 重いクライアントワークロード

クライアントバンドルが大きくなる一般的な原因は、Client Componentで高コストなレンダリング処理を行うことである。構文ハイライト、チャートレンダリング、Markdownパースなど、データをUIに変換するだけのライブラリがこれに該当する。

**ブラウザAPIやユーザーインタラクションが不要な処理は Server Component に移動すべき。**

#### 悪い例：Client Componentでのシンタックスハイライト

```tsx
'use client'

import Highlight from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'

export default function Page() {
  const code = `export function hello() {
    console.log("hi")
  }`

  return (
    <article>
      <h1>Blog Post Title</h1>
      <Highlight code={code} language="tsx" theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </article>
  )
}
```

この場合、結果は静的HTMLなのに、クライアントがハイライトライブラリ全体をダウンロード・実行する。

#### 良い例：Server Componentでのシンタックスハイライト

```tsx
import { codeToHtml } from 'shiki'

export default async function Page() {
  const code = `export function hello() {
    console.log("hi")
  }`

  const highlightedHtml = await codeToHtml(code, {
    lang: 'tsx',
    theme: 'github-dark',
  })

  return (
    <article>
      <h1>Blog Post Title</h1>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </article>
  )
}
```

Shikiパッケージはサーバー上で実行され、クライアントにはレンダリング済みのマークアップのみが送信される。

### 3. 特定パッケージのバンドルからの除外（`serverExternalPackages`）

Server ComponentsやRoute HandlersでインポートされたパッケージはNext.jsにより自動的にバンドルされる。特定のパッケージをバンドルから除外するには [`serverExternalPackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) を使用する。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```

### 4. プリバンドルされていない外部パッケージ（`transpilePackages`）

デフォルトでは、アプリケーションにインポートされたパッケージはバンドルされない。モノレポや`node_modules`からインポートされたプリバンドルされていないパッケージのパフォーマンスに影響する場合がある。

特定パッケージをバンドルするには [`transpilePackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages) を使用する。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['package-name'],
}

module.exports = nextConfig
```

すべてのパッケージを自動的にバンドルするには [`bundlePagesRouterDependencies`](https://nextjs.org/docs/pages/api-reference/config/next-config-js/bundlePagesRouterDependencies) を使用する。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['package-name'], // 除外したいパッケージを指定
}

module.exports = nextConfig
```

---

## 重要なポイントまとめ

| 課題 | 解決策 | 設定オプション |
|------|--------|----------------|
| バンドルサイズの分析 | Turbopack Bundle Analyzer（v16.1+）または `@next/bundle-analyzer` | `npx next experimental-analyze` / `ANALYZE=true` |
| 多数エクスポートのパッケージ | 使用モジュールのみ読み込み | `optimizePackageImports` |
| クライアント側の重い処理 | Server Componentへの移行 | コンポーネント設計の変更 |
| サーバー側でバンドル不要なパッケージ | バンドルからの除外 | `serverExternalPackages` |
| プリバンドルされていない外部パッケージ | トランスパイル対象に追加 | `transpilePackages` |
| Pages Routerの全依存バンドル | 自動バンドル有効化 | `bundlePagesRouterDependencies` |
