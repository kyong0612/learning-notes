# useEffectからfetchするときのベストプラクティス

この記事は、Reactの `useEffect` フック内でデータ取得（fetch）を行う際のベストプラクティスについて解説しています。

元記事: <https://qiita.com/uhyo/items/dec319ced85fc1b83f86>

## 基本的な考え方

* **原則:** `useEffect` の中で直接 fetch しないことが推奨されています。React 18以降では Suspense を利用するのが一般的です。

## React 16 における次善策（おまけ）

React 16など、Suspenseが利用できない環境で `useEffect` 内で fetch せざるを得ない場合のベストプラクティスが紹介されています。

### ベストプラクティス

1. **状態管理:** fetchの状態（`loading`, `fulfilled`, `rejected`）を管理するステートを用意します。
2. **`useEffect` の条件:** `useEffect` 内で、 **ステートが `loading` である場合にのみ** fetch処理を実行します。`loading` でない場合は早期リターンします。
3. **クリーンアップ:** `useEffect` のクリーンアップ関数内で `AbortController` を使用して、コンポーネントのアンマウント時や再レンダリング時に進行中の fetch をキャンセルします。
4. **依存配列:** `useEffect` の依存配列には、fetchの状態を管理するステート（`fetchState`）を含めます。

```typescript
import React, { useEffect, useState } from "react";

type FetchState<T> = {
  state: "loading";
} | {
  state: "fulfilled";
  data: T;
} | {
  state: "rejected";
  error: unknown;
}

const App: React.FC = () => {
  const [fetchState, setFetchState] = useState<FetchState<number>>({ state: "loading" });

  useEffect(() => {
    // ローディング中でなければ何もしない
    if (fetchState.state !== "loading") return;

    const controller = new AbortController();
    fetch("https://example.com/get-number", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("エラー"); // エラー処理は簡略化
        return res.json();
      })
      .then((data) => {
        setFetchState({
          state: "fulfilled",
          data: data.number,
        });
      })
      .catch((error) => {
        // AbortError は無視するなど、実際にはエラーハンドリングが必要
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return;
        }
        setFetchState({
          state: "rejected",
          error,
        })
      });

    // クリーンアップ関数
    return () => {
      controller.abort();
    };
  }, [fetchState]); // 依存配列に fetchState を含める

  // ... UIのレンダリングなど
};
```

### ポイント：考え方の逆転

* **「良くない」やり方:**
  * `useEffect` の依存配列を `[]` にして、マウント時に1回だけ実行しようとする。
  * fetch開始時にステートを `loading` にする（fetchの進行状況をステートが反映する）。
  * これは `useEffect` の本来の目的（コンポーネントが表示されていることの追加作用）から外れている。
* **ベストプラクティス:**
  * **ステートが `loading` であることに起因して** fetch が発生するという考え方（主従関係の逆転）。
  * コンポーネントの初期状態を `loading` にすることで、マウント時の fetch を React のロジック内で表現できる。
  * 依存配列を適切に設定できる（`[]` の濫用を避けられる）。
  * 再読み込みは、ステートを `loading` に戻すだけで実現できる。

### 注意点

* この方法はあくまで **React 18以降の Suspense が使えない場合の次善策** です。Suspense を使える環境ではそちらが推奨されます。
* 「ステートを loading にしたら結果的にデータがロードされる」という間接的なロジックは、Suspenseに比べるとやや分かりにくい側面もあります。

## まとめ

* `useEffect` 内での fetch は基本的に避けるべき。
* やむを得ず行う場合は、「ステートが `loading` の時に fetch する」という考え方で実装することで、`useEffect` の誤用を避け、よりReactらしいコードを書くことができます。
* この考え方は、React 18以降の環境でも `useEffect` を正しく理解する上で参考になります。

---

**注記:**

* 元の記事には画像、チャート、図表は含まれていませんでした。
* 技術的な正確性を維持し、元の記事の論点を整理して要約しました。
* 「React 16を前提とした次善策である」という制限事項も明記しました。
