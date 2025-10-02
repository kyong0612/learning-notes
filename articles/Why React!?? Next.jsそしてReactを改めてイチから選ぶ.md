---
title: "Why React!?? Next.jsそしてReactを改めてイチから選ぶ"
source: "https://speakerdeck.com/ypresto/why-react-choose-nextjs-and-react-scratch"
author:
  - "ypresto"
published: 2025-09-30
created: 2025-10-02
description: "LayerXのフロントエンド刷新に際し、Nuxt/VueからReact+Next.jsへ移行する判断軸を整理したFrontend Night講演デッキの概要。"
tags:
  - "react"
  - "nextjs"
  - "frontend-architecture"
  - "migration"
  - "layerx"
---

## サマリー構造

### 導入と講演趣旨

![スライド0](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_0.jpg)

- **要旨** LayerXのFrontend Nightで、Nuxt/VueからReact+Next.jsへ改めて選定した背景と判断基準を共有。
- ReactとNext.jsの採用理由を整理し、移行時の意思決定支援につなげることが目的。
- カジュアル面談告知・LayerX採用ページへの導線あり。

### 登壇者紹介と組織コンテキスト

![スライド1](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_1.jpg)

- ypresto (LayerX バクラク事業部 プロダクト開発部 債権債務チーム)。next-navigation-guard作者。
- LayerXでフロントエンドを良くする取り組みをリードしている。

### 現行スタックの整理

![スライド2](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_2.jpg)

- バクラクのフロントエンドスタックを俯瞰。React/Next.jsを中心に、TypeScript・各種ビルド/テストツールを利用。
- 複数フロントエンド技術の共存状況を示唆。

### Nuxt/Vueアプリの課題整理

![スライド3](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_3.jpg)

- **課題 (信頼度9/10)**
  - bootstrap-vueのメンテ停止とバグ多発。
  - Vue 2→3移行後も`defineComponent`など旧来の書き方が残存し、コードベースの一貫性低下。
  - アプリ設計自体の改善余地が大きく、リライトの機運が高まった。

### Reactを選ぶ理由

![スライド4](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_4.jpg)

- 課題在外性 (Root Cause外の周辺課題) に伴う認知負荷を軽減できるとの仮説。
- React Hooksによるシンプルな設計と純粋関数＋イミュータブル状態管理が好適。
- エコシステムが充実：`react-hook-form`、`apollo`、`react-query`、`radix-ui`、`MUI`、`zustand`など定番ライブラリが活発。
- TypeScript・ESLint・Prettier・Biomeなどツールチェーンからのファーストクラスサポート。

### React Hooksのメリット整理

![スライド5](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_5.jpg)

- Virtual DOMが`f(props, hooks)`として扱えるため、状態同期の複雑さを低減。
- 状態・ボタンが増えてもハンドラが複素化しにくい設計が可能。

![スライド6](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_6.jpg)

- コンポーネント全体を純粋関数的に扱うアプローチで挙動が単純化。
- 「詳解Reactive」記事など参考資料も提示。

### Next.jsの役割と最適化効果

![スライド7](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_7.jpg)

- ページ遷移高速化: `<Link>`によるクライアントサイド遷移、戻る/進む操作の体験向上、プリフェッチ。
- ページ配信高速化: SSG・ISR・SSRを組み合わせHTMLを事前描画・キャッシュし、Core Web Vitals/SEO改善。

![スライド8](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_8.jpg)

- 従来SPAが動的描画に至るまでのプロセスを可視化。初回ロードの重さやデータ取得待ちを課題として明示。

![スライド9](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_9.jpg)

- Next.js SSRでの描画プロセスを図示。サーバで先にレンダリングし、ブラウザ負荷を軽減するフローを説明。

![スライド10](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_10.jpg)

- App Routerが提供する透過的最適化を解説。
  - Server Componentsで静的部分はHTMLのみ返却。
  - JavaScriptバンドルから静的コンポーネント除外。
  - Partial Prerendering (β) やStreamingでデータ取得を待たず段階的描画。

### Next.jsによる統合メリット

![スライド11](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_11.jpg)

- Zero Configでルーティング、サーバ機能、API Routes、アセット最適化、HMRを包括。
- Pages Router (`getServerSideProps`, `getStaticProps`) と App Router (`"use server"` Server Functions) の両構成を活用可能。
- webpack/Turbopack、SWCによるCSS対応・minify・Tree Shaking等が標準提供。`next/image`や`next/font`も利用しやすい。

![スライド12](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_12.jpg)

- Reactアプリに必要なパターンと設定、透過的パフォーマンス最適化をゼロコンフィグで享受できる点を強調。

### Next.js採用時の注意点・制約

![スライド13](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_13.jpg)

- **制約 (信頼度8/10)**
  - 内部でHistory APIを書き換えるため、イベント介入が困難 → next-navigation-guard開発の背景。
  - サーバ側の`fetch()`をNext.jsがラップしてキャッシュ制御するなど、挙動理解が必須。
  - webpack設定がブラックボックス化しやすく、独自カスタマイズには注意。

### 結論とコールトゥアクション

![スライド14](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_14.jpg)

- React採用理由: リアクティビティのシンプルさ・定番ライブラリの豊富さ・ツールチェーンの一体サポート。
- Next.js採用理由: 必要パターンと設定を提供し、透過的パフォーマンス最適化、Zero Config、利用者が多く情報も豊富。

![スライド15](https://files.speakerdeck.com/presentations/1b5910f6e7c84a839f16712687f9781c/slide_15.jpg)

- **最終メッセージ** 「React + Next.js Rocks.」と強調し講演を締めくくる。
- LayerXの採用・プロダクト開発への参加を呼びかけ。

## 重要ポイントの強調

- React Hooksにより複雑さを抑えた状態管理が可能で、課題在外性由来の認知負荷を軽減できる (信頼度9/10)。
- Next.jsはSSR/SSG/ISRやApp Router最適化でCore Web VitalsとSEOの改善が期待できる (信頼度8/10)。
- Zero Configで統合されたツールチェーンが、独自整備よりも効率的にエコシステムの恩恵を受けられる (信頼度8/10)。
- 一方でNext.js固有の挙動 (History書き換え・`fetch`上書き・webpackブラックボックス化) には導入前から注意が必要 (信頼度7/10)。

## 推奨アクション

- 次のステップとして、React+Next.jsへのリライト計画を立案する際に、既存Vueアプリの課題棚卸と、Next.js特殊挙動を踏まえた運用設計確認を推奨。
