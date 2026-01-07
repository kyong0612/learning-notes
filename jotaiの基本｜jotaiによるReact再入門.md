---
title: "jotaiの基本｜jotaiによるReact再入門"
source: "https://zenn.dev/uhyo/books/learn-react-with-jotai/viewer/jotai-basics"
author:
  - "uhyo"
published: 2026-01-04
created: 2026-01-07
description: |
  jotaiの基本的な使い方を解説する章。atom、useAtom、派生atom、ユーティリティ関数などの概念を学び、Suspenseと組み合わせて使用する準備を整える。カプセル化の考え方を採り入れたステート設計の手法も紹介。
tags:
  - "jotai"
  - "React"
  - "状態管理"
  - "Suspense"
  - "atom"
---

## 概要

この章では、Suspenseの話題に入る前に、**jotai**の基本的な使い方を解説する。jotaiは非常にシンプルな状態管理ライブラリであり、基本的な概念を理解するのに多くの時間はかからない。

## jotaiの公式サイト

- 公式サイト: <https://jotai.org/>
- ライブラリの使い方を学ぶには公式サイト・公式ドキュメントが一番
- ただし、jotaiのドキュメントは少し分かりにくい面がある
  - 明確なAPIリファレンスがなく、APIの説明やユースケースの説明、コンセプトの説明などが入り混じっている

## useAtomをuseStateのように使う

Reactの`useState`はステートに関する最も基本的なAPIであり、それに近いjotaiのAPIが`useAtom`である。

### 基本的な使い方

```typescript
// コンポーネントの外側のどこかで
const countAtom = atom(0);

// コンポーネントの中で
const [count, setCount] = useAtom(countAtom);
```

### useStateとの比較

|                      | React      | jotai     |
| -------------------- | ---------- | --------- |
| ステートの定義       | `useState` | `atom`    |
| ステートの読み書き   | `useState` | `useAtom` |

**重要ポイント**: `useState`が持っていた2つの役割が`atom`と`useAtom`に分割されている

- 「ステートの定義」と「ステートの読み書き」が分離
- この分割により、React本体の機能よりも柔軟なステート管理アーキテクチャが実現

### atomの特徴

- `countAtom`のようなオブジェクトは**atom**と呼ばれる
- atomはステートの定義を表すオブジェクト
- atomは**グローバルな状態**となる
  - 複数個所で同じatomを使うことができる
  - 同じステートを共有する
  - atomの中身の更新は全ての使用箇所に同時に反映される
  - どこからでも同じatomに書き込める

> 補足: [Provider](https://jotai.org/docs/core/provider)を使えばステートの保管場所（Store）を複数持つこともできる

### 読み取りのみ・書き込みのみの使用

`useAtomValue`と`useSetAtom`は、`useAtom`の機能（読み書き）のうちどちらか一方のみ使いたい場合に有効。

```typescript
// どちらも
const [count, setCount] = useAtom(countAtom);

// 読み取りのみ
const count = useAtomValue(countAtom);

// 書き込みのみ
const setCount = useSetAtom(countAtom);
```

**`useSetAtom`のメリット**: 自身はatomの値を使用しないので、atomの値が更新されても再レンダリングが起こらず、パフォーマンス的に若干有利になる。

## 派生atom

atomには2種類が存在する：

1. **プリミティブatom** - 自身がステートを保持する
2. **派生atom** - 自身はステートを保持しない。読み書きしようとすると関数が実行される

### 共通点

- `useAtom`などのフックを用いて**読み書きができる**
- ただし、派生atomの場合は読み取り専用・書き込み専用の場合もある

### 派生atomの定義

```typescript
// プリミティブatom
const countAtom = atom(0);

// 派生atom
const countDisplayAtom = atom((get) => {
  const count = get(countAtom);
  return count.toLocaleString();
});

// 使用例（コンポーネント内）
const countDisplay = useAtomValue(countDisplayAtom);
const setCount = useSetAtom(countAtom);
```

- 派生atomを定義するときは`atom`に関数を渡す
- 関数は`get`を引数で受け取る
- `get`は他のatomの値を取得できる関数
- jotaiは`get`の呼び出しを通じてatom間の依存関係をトラッキング
  - 依存先のatomが更新されると派生atomの値も再計算される
  - 派生atomを読んでいるコンポーネントも再レンダリングされる

### 派生atomに書き込む

派生atomへの書き込みや、書き込み専用atomも利用可能。

```typescript
const 派生atom = atom(読み取り関数, 書き込み関数);
```

**書き込み専用atomの例:**

```typescript
const countAtom = atom(0);

const incrementAtom = atom(
  null,  // 読み取り関数はnull
  (get, set) => {
    const currentCount = get(countAtom);
    set(countAtom, currentCount + 1);
  },
);

// 使い方
const increment = useSetAtom(incrementAtom);
increment();  // countAtomの値に1を足す
```

> 補足: `null`を渡した場合、読み込むと常に`null`が返るatomとなる。正確には「書き込み専用」というよりは「読み込んでも意味がない」派生atom。

### 派生atomの書き込み時の引数

書き込み時の引数も柔軟に定義できる。

```typescript
const incrementAtom = atom(
  null,
  (get, set, step = 1) => {
    if (step < 0) {
      throw new Error("負の数を足すことはできませんよ！！");
    }
    const currentCount = get(countAtom);
    set(countAtom, currentCount + step);
  },
);

// 使い方
const increment = useSetAtom(incrementAtom);
increment();      // countAtomの値に1を足す
increment(100);   // countAtomの値に100を足す
```

### 派生atomとカプセル化

jotaiは派生atomを多用する文化であり、その理由のひとつに**カプセル化**と相性がいいことが挙げられる。

**カプセル化の例（counter.tsモジュール）:**

```typescript
const countAtom = atom(0);  // exportしない

export const countDisplayAtom = atom((get) => {
  const count = get(countAtom);
  return count.toLocaleString();
});

export const incrementAtom = atom(
  null,
  (get, set, step = 1) => {
    if (step < 0) {
      throw new Error("負の数を足すことはできませんよ！！");
    }
    const currentCount = get(countAtom);
    set(countAtom, currentCount + step);
  },
);
```

**このカプセル化による効果:**

- ユーザーは`countAtom`の値として`"1,234"`のような文字列の形式でしか取得できない（フォーマットし忘れやフォーマットの仕様揺れを防げる）
- ユーザーは`countAtom`の値を増やすことはできても減らすことはできない

データを保管するプリミティブatomを外に見せないことで自由な操作を防ぎ、派生atomのみを提供することでどんな操作が可能なのかを制御できる。

## ユーティリティ関数の文化

jotaiには、「atomを作るユーティリティ関数」の文化もある。派生atomを駆使することで、「特殊な挙動をするatom」を作る関数を定義できる。

### atomWithResetの例

`atomWithReset`は「リセット可能」なatomを定義できるユーティリティ関数。

- 通常のプリミティブatomのように読み書きできる
- 特殊な値`RESET`を書き込むことでatomの初期値に戻る

```typescript
const countAtom = atomWithReset(0);

// 使用例
const setCount = useSetAtom(countAtom);
setCount(1);        // 1になる
setCount(c => c + 1);  // 2になる
setCount(RESET);    // 0になる
```

使う側で`countAtom`の初期値を知らなくても、リセットすることができる。これもある種のカプセル化、責務の分離と言える。

## まとめ

- jotaiの基本的な使い方を学習
  - `atom`でステートを定義
  - `useAtom`/`useAtomValue`/`useSetAtom`で読み書き
  - 派生atomで計算・カスタム操作を定義
- jotaiの文化として、派生atomやユーティリティ関数を多用したカプセル化の文化がある

## 練習問題

ユーティリティ関数の練習として、`atomWithReset`を自分で実装してみる。

```typescript
const RESET = Symbol();

function atomWithReset<T>(initialValue: T) {
  // どう実装する？
}

// 使用例
const countAtom = atomWithReset(0);
const [count, setCount] = useAtom(countAtom);
setCount(5);        // 5になる
setCount(c => c + 1);  // +1
setCount(RESET);    // 0 に戻る
```

## 関連リンク

- [jotai公式サイト](https://jotai.org/)
- [jotai Provider ドキュメント](https://jotai.org/docs/core/provider)
- [atomWithReset ドキュメント](https://jotai.org/docs/utilities/resettable#atomwithreset)
