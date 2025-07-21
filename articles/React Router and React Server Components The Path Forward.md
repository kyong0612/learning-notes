---
title: "React Router と React Server Components: 今後の展望"
original_title: "React Router and React Server Components: The Path Forward"
source: "https://remix.run/blog/react-router-and-react-server-components"
author:
  - "[[@remix_run]]"
published: 2025-07-16
created: 2025-07-21
translated_date: 2025-07-21
description: "React Router の RSC サポートは単なる新機能以上のものです。これは、ライブラリをより強力にしながら、Framework Mode を特定のバンドラーへの依存度を下げる大きなアーキテクチャ上の変化です。"
tags:
  - "clippings"
  - "React"
  - "React Router"
  - "RSC"
  - "翻訳"
---
![Glowing tree](https://remix.run/blog-images/headers/rr-rsc-path-forward.jpg)

2025年7月16日

Jacob Ebey

シニアデベロッパー

Mark Dalgleish

スタッフデベロッパー

最近のブログ投稿で、[RSC サポートを備えた React Router のプレビュー](https://remix.run/blog/rsc-preview)を共有しました。表面的には、これは単に Server Components が React Router に導入されることを意味しているように見えるかもしれません。

しかし、その影響は予想以上に大きいものです。

RSC により、React Router の Framework Mode を実装するために必要だった多くの機能が、React 自体によって提供されるようになりました。[React Router を Remix 化](https://remix.run/blog/remixing-react-router)したときのアーキテクチャ上の変化と同様に、Framework Mode の機能のほとんどを低レベルのライブラリ API にもたらす、より強力な RSC 駆動の Data Mode を導入しています。

この新しいアーキテクチャにより、Framework Mode はオプトイン/非破壊的な方法で RSC サポートを追加でき、内部的にはシンプルになり、特定のバンドラーへの結合度も低くなります。このブログ投稿では、これがどのように機能し、あなたにとって何を意味するのかについて詳しく説明します。

React Server Components を React Router でセットアップする方法の詳細については、["React Server Components" ドキュメント](https://reactrouter.com/how-to/react-server-components)をご覧ください。

## サーバーサイド React の課題

サーバーレンダリングされた React アプリの構築には、常にいくつかの重要な課題の解決が伴います：

- **データをどのようにインライン化するか？** サーバーのデータをブラウザ内のコンポーネントに効率的に渡す必要があります。
- **ストリーミング UI をどのようにサポートするか？** ユーザーはすべてのデータを待つことなく、何かを見ることができるべきです。
- **ルートをどのようにコード分割するか？** 最初のページロードでアプリ全体をダウンロードしたい人はいません。

異なるツールがこれらの問題を異なる方法で解決してきました。React Router の Framework Mode は一つのアプローチを提供します。React Server Components は別のアプローチを提供します。そして今、React Router はこれらの世界を融合させています。

## 今日のサーバー課題への対処法

React Router Framework Mode と React Server Components がそれぞれこれらの一般的な問題にどのように取り組んでいるかを見てみましょう：

### データのインライン化

**Framework Mode**: loader 関数からデータを返し、React Router がコンポーネントにデータを渡す処理を行います。

```javascript
// Framework Mode

export async function loader() {

  const user = await getUser();

  return { user };

}

export default function Profile() {

  const { user } = useLoaderData();

  return <h1>{user.name}</h1>;

}
```

**React RSC**: サーバーコンポーネントから `"use client"` コンポーネントに props を渡します。

```javascript
// React RSC

async function ProfileServer() {

  const user = await getUser();

  return <ProfileClient user={user} />;

}
```

**React Router RSC**: 両方のオプションが利用可能です！ニーズに合ったパターンを使用してください。

### ストリーミング UI

**Framework Mode**: loader から Promise を返し、`<Await>` コンポーネントを使用します。

```javascript
// Framework Mode

export function loader() {

  let slowDataPromise = getSlowData();

  return {

    criticalData: await getCriticalData(),

    slowData: slowDataPromise,

  };

}

export default function Page() {

  const { criticalData, slowData } = useLoaderData();

  return (

    <>

      <h1>{criticalData.title}</h1>

      <Suspense fallback={<Spinner />}>

        <Await resolve={slowData}>

          {(data) => <SlowContent data={data} />}

        </Await>

      </Suspense>

    </>

  );

}
```

**React RSC**: Promise を props として渡し、サーバーでは `await` を、クライアントでは `use(promise)` を使用します。

```tsx
// React RSC

// page.tsx

export async function Page() {

  const slowDataPromise = getSlowData();

  const criticalData = await getCriticalData();

  return (

    <>

      <h1>{criticalData.title}</h1>

      <Suspense fallback={<Spinner />}>

        <PageClient slowDataPromise={slowDataPromise} />

      </Suspense>

    </>

  );

}

// page.client.tsx

"use client";

export function PageClient({ slowDataPromise }) {

  const slowData = use(slowDataPromise);

  return <PageWidget data={slowData} />;

}
```

**React Router RSC**: ここでも、両方のパターンが利用可能です。

### ルートのコード分割

**Framework Mode**: バンドラープラグインによって処理される `routes.ts` 設定ファイルが、ルートをチャンクにマッピングするマニフェストを生成します。

**React RSC**: サーバー上の動的インポートと `"use client"` ディレクティブの組み合わせにより、ブラウザは必要なものだけをダウンロードします。

## 内部的な仕組み: Framework Mode の動作原理

React Router の Framework Mode は、巧妙なバンドラー統合によって実現されています：

1. `routes.ts` 設定ファイルでルートを定義します
2. バンドラープラグインがこの設定を読み取り、以下を生成します：

- ブラウザ用のルートをチャンクにマッピングするマニフェスト
- マニフェストとサーバーサイドのルートマッピングを含むサーバーエントリー

3. React Router ランタイムは、これらの生成されたファイルを使用してルーティングを処理します

このアプローチは私たちにとって有効でしたが、かなりのバンドラー統合と複雑さが必要でした。

## RSC の方法

React Router RSC は、実際により簡単な異なるアプローチを取ります。バンドラープラグインとカスタムマニフェストシステムに依存する代わりに：

- アプリコード内で他のデータ構造と同様にルートを定義します（特別な `routes.ts` バンドラープラグインやビルド時の生成はもう必要ありません）
- HTML リクエストとデータリクエストのルーティングを処理する関数を定義します
- どこかで HTML にレンダリングされる RSC ペイロードを生成する関数を定義します

これらは単なるプレーンなデータ構造と関数呼び出しであることに注目してください。結果として？複雑なフルスタックアプリケーションのために React Router を再びライブラリとして使用できる、よりシンプルで直接的なアーキテクチャが実現されました。これは RSC のおかげでのみ可能になりました。

この簡素化は、*サーバーコンポーネントを使用していなくても*有用であることは注目に値します。すべてのルートが現在のようにクライアントコンポーネントであっても、この新しいアーキテクチャは、React Router の高度な使用がもはやバンドラー固有の Framework Mode プラグインを必要としないことを意味します。

- **Framework Mode で React Router を使用している場合：** Framework Mode の未来を React Router RSC の上に構築することが私たちの意図です。そのため、既存のコードは引き続き動作します。移行が発生した場合、あなたの視点からはシームレスになります。*移行は必要ありません！*
- **Data/Declarative Mode で React Router を使用している場合：** 既存の非 RSC ライブラリ API を引き続き使用して、より従来型の SPA と SSR アプリを構築できます（現在も、そして将来も）。将来のリリースでは、RSC 駆動バージョンの Data Mode を使用するオプションも利用できるようになります。
- **新しい React Router プロジェクトを開始する場合：** React Router RSC はまだ不安定なので、現在は既存の Framework Mode または data/declarative API の使用を推奨しています。
- **冒険心がある場合：** 初期の不安定な RSC API を試して、フィードバックを提供したり、問題を報告したり、遭遇したバグの修正を手伝ったりすることをお勧めします。ご意見をお聞かせください！

### 今後の展望

Vite 向けの RSC 対応 Framework Mode を計画しています。これはいくつかの低レベルなバンドラー作業に依存しますが、実現すると Framework Mode ははるかにシンプルになります：

1. 既存の `routes.ts` 設定が RSC フレンドリーなルート設定の生成に使用されます
2. 既存のルートモジュールがサーバーと `"use client"` 部分に分割されます
3. バンドラー固有の統合はすべて自動的に処理されます

以上です。もうマニフェスト生成も、複雑なサーバーエントリーも必要ありません。ルートモジュールとロジックはまったく同じままで、`entry.browser.ts`、`entry.ssr.ts`、`entry.rsc.ts` モジュールがそれぞれのモジュールグラフに合わせて配置されます。

## 結論

React Router がよりシンプルになっているのは、React 自体がより多くの重い処理を行い、バンドラーにより多くを期待しているからです。RSC は、React Router がすでにうまく行っていることを補完する、データローディング、ストリーミング、コード分割のための強力なパターンをもたらします。

React Router はより強力になるだけでなく — React の新しい能力を受け継いで、コンポーネントを純粋にサーバー上でレンダリングできるようになります — さらに多くのユースケースで簡単なライブラリとして使用できるようになりました。SPA から複雑なコード分割された SSR アプリまで対応できます。

RSC の上に追加の Framework Mode の便利機能を提供する予定ですが、これらは完全にオプションになります。多くの方が React Router の RSC API を直接使用して、よりミニマルで制御しやすい状態を保ちたいと思うでしょう。これはまた、今日とは異なり、Vite だけでなく、すべての RSC 対応バンドラーでフルスタック SSR アプリをより簡単にサポートできることを意味します。

React Router の未来は明るく、私たちは皆さんと一緒にそれを構築することに興奮しています。

---
