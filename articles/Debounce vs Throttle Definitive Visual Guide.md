---
title: "Debounce vs Throttle: Definitive Visual Guide"
source: "https://kettanaito.com/blog/debounce-vs-throttle"
author:
  - "Artem Zakharchenko"
published: 2019-12-23
created: 2025-06-16
description: |
  DebounceとThrottleの違いを視覚的に理解するための完全ガイド。イベントハンドリングの最適化技術について、実装例とベストプラクティスを含めて詳しく解説。
tags:
  - debounce
  - throttle
  - javascript
  - event-handling
  - performance-optimization
  - web-development
---

## 概要

**DebounceとThrottleの違いを視覚的に学ぶ完全ガイド**

この記事は、開発者が混同しがちなdebounceとthrottleの違いを、視覚的なボールマシンの例を使って分かりやすく解説したガイドです。イベントハンドリングの最適化において正しい技術を選択することの重要性を強調しています。

## イベント処理の基礎

### イベントとは

- **イベント**: システム内で発生するアクション（ブラウザでのリサイズ、クリックなど）
- **イベントリスナー**: 指定されたイベントを監視し、発生時にハンドラ関数を実行する関数
- **ハンドラ関数**: イベントに対応して実行される処理ロジック

### 基本的なイベントリスナーの実装

```javascript
element.addEventListener(eventName, listener, options)
```

デフォルトでは、イベントリスナーは1:1の比率でイベントに応答します。しかし、パフォーマンスや制御の観点から、この直接的な比例関係が望ましくない場合があります。

## Throttle（スロットリング）

### 定義と特徴

- **機能**: 指定された時間間隔内で関数の実行回数を正確に1回に制限
- **動作**: 一定時間内の追加の関数呼び出しは無視される
- **例**: 500msでスロットルすると、500ms間隔で最大1回のみ実行

### 実装例

```javascript
function throttle(func, duration) {
  let shouldWait = false
  
  return function (...args) {
    if (!shouldWait) {
      func.apply(this, args)
      shouldWait = true
      
      setTimeout(function () {
        shouldWait = false
      }, duration)
    }
  }
}

// 使用例
button.addEventListener(
  'click',
  throttle(function () {
    throwBall()
  }, 500)
)
```

### 使用ケース

- **一貫した反応が必要**: 頻繁なイベントに対して一貫して反応したい場合
- **具体例**:
  - ウィンドウリサイズ後のUI更新
  - サーバーやクライアントでの重い処理

### 比喩的説明

「スプリングのようなもの：ボールを投げた後、縮むのに時間が必要で、準備ができるまで次のボールは投げられない」

## Debounce（デバウンス）

### 定義と特徴

- **機能**: 最後の呼び出しから指定時間経過後に関数を実行
- **動作**: 解決された状態に反応し、イベントとハンドラ呼び出しの間に遅延を含む
- **例**: 500msでデバウンス設定すると、最後のクリックから500ms後に実行

### 実装例

```javascript
function debounce(func, duration) {
  let timeout
  
  return function (...args) {
    const effect = () => {
      timeout = null
      return func.apply(this, args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(effect, duration)
  }
}

// 使用例
button.addEventListener(
  'click',
  debounce(function () {
    throwBall()
  }, 500)
)
```

### 使用ケース

- **最終状態への反応**: 中間状態は不要で、最終状態に対応したい場合
- **具体例**:
  - 非同期検索サジェスト
  - サーバーでの更新バッチ処理

### 比喩的説明

「忙しいウェイター：連続で注文されると無視し、静かになってから最後のリクエストについて考える」

## よくある問題と解決策

### 1. 関数の再宣言エラー

**間違った例**:

```javascript
button.addEventListener('click', function handleButtonClick() {
  return debounce(throwBall, 500) // 間違い！
})
```

**正しい例**:

```javascript
button.addEventListener(
  'click',
  debounce(function handleButtonClick() {
    return throwBall()
  }, 500)
)
```

### 2. React での実装注意点

**間違った例** (render時に毎回新しいインスタンスが作成される):

```jsx
render() {
  return (
    <button onClick={debounce(this.handleButtonClick, 500)}>
      Click the button
    </button>
  )
}
```

**正しい例** (宣言時にdebounce):

```jsx
handleButtonClick = debounce(() => {
  console.log('The button was clicked')
}, 500)

render() {
  return <button onClick={this.handleButtonClick}>Click the button</button>
}
```

### 3. 最適な間隔時間の選択

- **注意点**: 速すぎる間隔はパフォーマンス効果なし、長すぎる間隔はUIが重く感じる
- **推奨**: 盲目的にコピーせず、アプリケーション/ユーザー/サーバーに最適な値をテスト
- **方法**: A/Bテストの実施を検討

## 重要な推奨事項

### ライブラリの使用

- 複雑なシナリオでは、[`lodash.throttle`](https://www.npmjs.com/package/lodash.throttle)や[`lodash.debounce`](https://www.npmjs.com/package/lodash.debounce)の使用を推奨
- `leading`や`trailing`パラメータなど、高度な制御オプションが利用可能

### 選択指針

- **Throttle**: 頻繁なイベントに**一貫して**反応したい場合
- **Debounce**: 頻繁なイベントに**最終的に**反応したい場合

## まとめ

debounceとthrottleは、どちらもイベントハンドリングの最適化技術ですが、用途と効果が大きく異なります：

- **Throttle**: 一定間隔での一貫した実行制御
- **Debounce**: 最後のイベントから指定時間後の実行

適切な技術選択により、パフォーマンスとユーザーエクスペリエンスの両方を向上させることができます。実装時は関数の再宣言エラーに注意し、最適な間隔時間の選択には十分なテストを行うことが重要です。
