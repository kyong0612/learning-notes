---
title: "React Compilerを有効にして9ヶ月が経ちました"
source: "https://zenn.dev/dev_commune/articles/e42847c9ce3c97"
author:
  - "astatsuya"
  - "コミューン株式会社"
published: 2025-05-11
created: 2025-05-13
description: |
  React Compiler を2024年7月末に導入し、2024年10月中旬からプロダクション利用を開始して現在(2025年5月中旬)に至るまでの経験と感想を共有する記事。
tags:
  - "Next.js"
  - "React"
  - "React Hook Form"
  - "reactcompiler"
  - "TypeScript"
---

## はじめに

本記事は、React Compiler を2024年7月末に導入し、2024年10月中旬からプロダクション環境で利用開始してから2025年5月中旬までの経験と所感をまとめたものです。

## 前提

### 技術スタック

* **フレームワーク**: Next.js (Pages Router、サーバーサイド処理ほぼなし)
* **フォーム管理**: react-hook-form
* **React設定**: `reactStrictMode` は `true`
* **Linter**: `eslint-plugin-react-compiler` による検査で違反なし (導入時)
* **ライブラリバージョン (主要なもの)**:
  * **導入時 (2024年7月末)**:
    * `next: 15.0.0-rc.0`
    * `react: 19.0.0-rc-01172397-20240716`
    * `babel-plugin-react-compiler: 0.0.0-experimental-938cd9a-20240601`
    * `react-hook-form: 7.52.1`
  * **プロダクション利用開始時 (2024年10月中旬)**:
    * `next: 15.0.0-rc.1`
    * `react: 19.0.0-rc-cd22717c-20241013`
    * `babel-plugin-react-compiler: 0.0.0-experimental-fa06e2c-20241016`
    * `react-hook-form: 7.53.0`
  * **執筆時 (2025年5月中旬)**:
    * `next: 15.3.2`
    * `react: 19.1.0`
    * `babel-plugin-react-compiler: 19.1.0-rc.1`
    * `react-hook-form: 7.55.0`

### 開発スタイル

* **チーム**: フロントエンドの主要コミッターは1〜2名
* **テスト**: 開発者がテストも担当 (QAやテスターは不在)

## 対象読者

* React Compiler の導入を検討している開発者

## 結論 (React Compiler導入9ヶ月時点)

* **安定性**: プロダクション環境で React Compiler 起因の不具合は未発生。
* **アップデートの影響**:
  * RC版および Next.js の experimental 機能であるため、アップデートで挙動が変わる可能性あり。
  * これまでのアップデートでアプリ動作が期待通りでなくなったことはない。
  * Next.js 15.3.0 までは有効だったが、15.3.1, 15.3.2 では効いていない可能性が高い。
* **問題発生箇所**: `ref` と `react-hook-form` を使用する箇所でのみ意図しない動作が発生。
* **ビルド差分**: `next dev` と `next build` で挙動が変わるケースが散見された。
* **デバッグ容易性**: 原因不明で意図通りに動かなくても、一貫して同じ箇所で問題が発生するため気づきやすい。
* **開発効率**: `useMemo`, `useCallback`, `React.memo` を原則書かない方針にできたのは大きなメリット。
* **導入非推奨ケース**: React や `react-hook-form` の詳細な挙動に向き合う時間がないチーム。

## 本文詳細

### React Compilerとは？

React アプリケーションを自動的にメモ化するビルドツールです。`useMemo`、`useCallback`、`React.memo` といったフックを手動で記述しなくても、コンパイラが最適化を行ってくれます。
詳細は [公式ドキュメント (英語)](https://react.dev/learn/react-compiler) または [日本語版](https://ja.react.dev/learn/react-compiler) を参照 (英語版が最新の場合あり)。

### プロダクションへの導入きっかけ

1. **開発者のみが利用する移行期間**: 大規模なデータ構造変更のため、既存アプリとは別に新規アプリを開発。リリースまでの約3ヶ月間、破壊的変更も許容され、全機能テストも予定されていたため、experimental な React Compiler を導入しやすい状況でした。
2. **容易な切り替えコスト**: Next.js の設定ファイル (`next.config.js`) を1行変更するだけで導入・削除が可能なため、試行コストが低いと判断されました。

    ```ts
    // next.config.js
    import type { NextConfig } from 'next'

    const nextConfig: NextConfig = {
      experimental: {
        reactCompiler: true,
      },
    }

    export default nextConfig
    ```

### リリースまでに修正した React Compiler の問題

主に `react-hook-form` または `ref` を使用している箇所で問題が発生しました。

#### 1. `ref` の問題

特定行数を超えると「続きを読む」を表示するコンポーネントで `ref` を使用した高さ計算が機能しなくなりました。
**元のコードイメージ:**

```tsx
export const useTruncateTextBlock = () => {
  const [isTruncated, setIsTruncated] = useState(false);
  const measuredRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    setIsTruncated(node.scrollHeight > node.offsetHeight);
  };
  return { isTruncated, measuredRef };
};
```

親コンポーネントでの `display: none` によるタブ切り替えが影響している可能性が示唆されました。
**解決策:** `ResizeObserver` を使用して高さ計算を行うように変更。

```tsx
export const useTruncateTextBlock = () => {
  const [isTruncated, setIsTruncated] = useState(false);
  const measuredRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const target = entry.target as HTMLDivElement;
      setIsTruncated(target.scrollHeight > target.offsetHeight);
    });
    observer.observe(node);
    return () => observer.disconnect();
  };
  return { isTruncated, measuredRef };
};
```

#### 2. `react-hook-form` で一貫して動かなかった書き方

* **`watch` が機能しない**: `useWatch` を使用することで解消。(`react-hook-form@7.55.0` では `watch` でも動作する可能性あり)
* **`formState` から正しい状態が取得できない**: `useFormStatus` を使用することで解消。(特に `useFormContext` の `formState` で問題発生)

#### 3. `react-hook-form` で動いたり動かなかったりした書き方

* **`useForm` の `values` が更新されない**: `defaultValues` を使用し、親コンポーネントの `props` の `key` に `values` を渡すことで解消。(`react-hook-form@7.55.0` では `values` も動作する可能性あり)
* **`register` を使用すると動かなくなる**: `control` を使用することで解消。(依然 `register` で動作する箇所も多数あり、`display:none` での描画切り替えが関連している可能性)

#### 4. `next dev` vs `next build` の挙動差異

React Compiler 有効化後、`next build` 時のみ動作しないケースが何度か発生。そのため、`react-hook-form` 関連の変更時はローカルでも `next build` での動作確認が推奨されました。
`next build` の待ち時間対策として、`next dev` と `next build` のアウトプットディレクトリを分ける設定を導入:

```ts
// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir:
    process.env.NODE_ENV === 'production'
      ? '.next'
      : '.next-dev', // dev時は .next-dev に出力
  experimental: {
    reactCompiler: true
  }
}

export default nextConfig
```

### Next.js 15.3.1, 15.3.2 では React Compiler が効いていなさそう

Next.js `15.3.0` までは React Compiler が有効に機能していたが、`15.3.1` および `15.3.2` (記事執筆時点のバージョン) では、React Developer Tools で確認したところ、自動メモ化がされなくなっていたとのことです。これは Next.js 側の問題であり、修正と切り戻しが繰り返されている状況が示唆されています ([GitHub PR #78879](https://github.com/vercel/next.js/pull/78879))。

### React Compiler 導入後の変化

1. **不要な再レンダリングの削減**: React Compiler が有効な場合は再レンダリングが減少。ただし、ユーザー体験としての明確な変化はほぼ感じられなかった (Compiler が効いていないことに気づかなかった程)。
2. **`useMemo`, `useCallback`, `React.memo` の原則不使用**: メモ化の判断基準の複雑さを排除するため、新規コードではこれらのフックを原則として使用しない方針を決定。これにより、コードの可読性向上や開発方針の明確化に繋がりました。ただし、`useEffect` の無限ループを防ぐために既存コードで部分的に残っている箇所はある。
3. **安定性**: 一度正常に動作した箇所が、その後のパッケージアップデートや軽微な機能追加・修正で再度壊れることは今のところない。

### React Compiler の有効化をおすすめ出来ないチームやアプリケーション

* React の方針から外れたコードが多い、またはその修正に時間を割けないチーム。
* `react-hook-form` の詳細な挙動 (例: `defaultValues` での `undefined` の扱いや `formState` 購読時の注意点) に向き合う時間がないチーム。これらのライブラリ固有の注意点に React Compiler の挙動が加わると、問題解決が困難になるため。
* 既存の大規模アプリケーションへのいきなりの全適用はリスクが高い。導入する場合は、全機能テストを行うか、Next.js の `annotation` モード (`"use client"; // @react-compiler`) を利用した段階的導入が推奨されます。

## まとめ

著者は、たまたま実験的な機能を導入しやすいタイミングであったこと、また `"use no memo"` ディレクティブで部分的に Compiler の動作を無効化できる手軽さから、React Compiler を試すことができたのは幸運だったと述べています。

問題が発生する場合でも、その挙動が一貫しており、予期せず壊れることが少ない点は評価ポイントです。
アプリケーションのユーザー体験向上効果は限定的であったものの、開発者体験としてはメモ化に関するコード記述から解放された点が最大の収穫でした。

React Compiler は各種ライブラリのアップデートにより改善が進んでおり（一時的に Next.js で効いていない問題はあるものの）、新規アプリケーション開発では導入を検討する価値があるとの見解です。

---
この記事に贈られたバッジ:
![Thank you](https://static.zenn.studio/images/badges/paid/badge-frame-5.svg)
