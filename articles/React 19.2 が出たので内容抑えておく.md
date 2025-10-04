---
title: "React 19.2 が出たので内容抑えておく"
source: "https://zenn.dev/noda_k/articles/d9d63a18cdbe84"
author:
  - noda
published: 2025-10-03
created: 2025-10-04
description: |
  React 19.2 の主要アップデートを整理し、新登場の Activity コンポーネントや useEffectEvent、Partial Pre-rendering などの変更点を俯瞰したまとめ。
tags:
  - "clippings"
  - "react"
  - "nextjs"
  - "typescript"
  - "release-notes"
---

## TL;DR

- Activity コンポーネントと useEffectEvent を中心とした React 19.2 の新 API と周辺機能を整理。
- React DOM の Partial Pre-rendering など SSR/SSG まわりの改善点を概観。
- cacheSignal や DevTools 連携、eslint-plugin-react-hooks v6 など周辺エコシステムの更新点を確認。
- 画像や図表の掲載は特になし。

## Reactの新機能の紹介

### Activityコンポーネント

- `Activity` が UI の可視状態と内部状態・DOM の保持を両立させ、条件レンダリングでの再マウント問題を解消。
- hidden モード時はアンマウント相当の扱いで Effect を停止し、フォーム入力やサブスクリプションの維持・再開を柔軟化。
- バックグラウンドでのプリレンダリングや優先度制御により、非表示領域のパフォーマンス負担を抑制。
- Effect のクリーンアップを促すことで外部リソース管理が明示的になる副次効果。

```tsx
// 従来の条件付きレンダリング
{isShowingSidebar && <Sidebar />}

// Activity を使う場合
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

### useEffectEvent

- Effect 内専用のイベントコールバックを生成し、最新の props/state を読みつつ依存配列を最小化できるフック。
- stale closure 問題を解決し、`useEffect` の依存に含めたくない値を安全に扱える。
- Lint の警告を抑制するための依存配列省略が不要になり、バグリスクを低減。

```tsx
function ChatRoom({ roomId, theme }: { roomId: string; theme: "light" | "dark" }) {
  const onConnected = useEffectEvent(() => {
    showNotification("Connected!", theme);
  });

  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on("connected", () => onConnected());
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]);
}
```

### その他

- **cacheSignal**: `cache()` のライフサイクル完了を検知してクリーンアップや中断処理を走らせる仕組みを追加。
- **Performance Tracks**: Chrome DevTools のパフォーマンスプロファイラに React 用カスタムトラックを提供し、指標の可視化を強化。

## 新しいReact DOM機能

### Partial Pre-rendering

- 静的領域を即時配信しつつ動的領域を後続レンダリングで埋め込むハイブリッド戦略を導入。
- CDN からの即応性とユーザー依存データのパーソナライズを両立し、SSR と SSG のメリットを組み合わせ。
- EC サイトのような静的・動的コンテンツ混在ページで初期体験を向上させるユースケースを紹介。

### その他

- **SSR における Suspense 境界のバッチ処理**: ストリーミング時の Suspense 表示タイミングを揃えて体験を安定化。
- **Node における Web Streams 対応**: Node.js での SSR が Web Streams を利用可能に。ただしパフォーマンス面から従来の Node Streams 優先を推奨。
- **eslint-plugin-react-hooks v6**: Flat Config をデフォルト採用し、新しい React コンパイラ対応ルールをオプトインで有効化。
- **useId のプレフィックス更新**: `:r:` → `«r»` → `*r*` と変遷し、`view-transition-name` や XML との互換性を確保。

## 終わりに

- React 19.2 の主な変更点を一通り押さえ、さらに詳細を知りたい場合は公式ブログ（<https://react.dev/blog/2025/10/01/react-19-2#use-effect-event>）を参照するよう推奨している。
- フロントエンドの進化スピードに追従する難しさと、継続的なキャッチアップの重要性を強調。
