---
title: "同期 API とブロッキング｜イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理"
source: "https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/f-epasync-synchronus-apis"
author:
  - "PADAone🐕"
published: 2025-02-23
created: 2025-06-29
description: |
  JavaScriptにおける同期APIの概念と、それが引き起こす「ブロッキング」について解説します。シングルスレッドモデルで動作するJavaScriptにおいて、処理の完了を待つ同期APIがどのように全体の実行を停止させるのかを、具体的なコード例を交えて説明します。
tags:
  - "JavaScript"
  - "非同期処理"
  - "同期API"
  - "ブロッキング"
  - "イベントループ"
---

# 同期 API とブロッキング

## はじめに

JavaScriptの実行環境や非同期処理のメカニズムを理解する上で、「同期API」とそれが引き起こす「ブロッキング」の概念は非常に重要です。

## 同期APIとは

同期API（Synchronous API）は、**処理が完了するまで待機し、その後に次の処理へ進む**という性質を持つAPIです。APIからの戻り値をすぐに利用したい場合に便利ですが、処理に時間がかかると、後続の処理がすべて停止してしまう「ブロッキング」を引き起こします。

### ブロッキングの問題点

JavaScriptは**シングルスレッド**で動作するため、一つの処理が完了するまで他の処理は実行できません。同期APIによってブロッキングが発生すると、Webページの場合はUIの操作（クリックやスクロールなど）が一切効かなくなり、ユーザー体験を著しく損ないます。

```js
// 同期的な処理の例
const result = someSynchronousAPICall();
// ↑この行の処理が終わるまで、次の行は実行されない
console.log(result);
```

## 同期APIの具体例

### レガシーなAPI

`alert()`、`confirm()`、`prompt()` といったブラウザのAPIは、ユーザーの応答があるまで処理をブロックする典型的な同期APIです。これらは現在では使用が推奨されていません。

```js
console.log("処理開始");
alert("このアラートを閉じるまで次のログは表示されません");
console.log("処理再開");
```

### 意図的なブロッキング（ビジーループ）

ループ処理を使って意図的にCPUに負荷をかけ、ブロッキングを再現することもできます。以下のコードは、ボタンをクリックしてから5秒間、画面がフリーズする例です。

```html
<button id="block-button">5秒間ブロックする</button>
<p id="text">ボタンを押してください</p>
```

```javascript
const blockButton = document.getElementById('block-button');
const text = document.getElementById('text');

// ミリ秒単位でブロックする関数
function block(milliseconds) {
  const startTime = Date.now();
  while (Date.now() - startTime < milliseconds) {
    // この間、他の処理は一切実行されない
  }
}

blockButton.addEventListener('click', () => {
  text.textContent = '5秒間フリーズします...';
  block(5000); // 5秒間ブロッキング
  text.textContent = 'フリーズが解除されました！';
});
```

この例では、`block(5000)`が実行されている5秒間、ブラウザは完全に無反応になります。

## まとめ

- **同期API**は、処理の完了を待つAPIです。
- JavaScriptは**シングルスレッド**であるため、同期APIの処理中は他のすべての処理が**ブロッキング**されます。
- ブロッキングはユーザー体験を大きく損なうため、特にWeb開発においては、時間のかかる処理に同期APIを使うべきではありません。

このブロッキング問題を解決するために、JavaScriptでは**非同期処理**が重要な役割を果たします。
