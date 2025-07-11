---
title: "Anyone else accidentally create an infinite loop that costs $3600/day with Claude hooks?"
source: "https://www.reddit.com/r/ClaudeAI/comments/1ltvi6x/anyone_else_accidentally_create_an_infinite_loop/"
author:
  - "AdGroundbreaking3121"
published: 2025-07-07
created: 2025-07-11
description: |
  A user on Reddit reported accidentally creating an infinite loop using Claude's hooks feature, which could theoretically cost up to $3600 per day. The user set up a `Stop` hook to run a `claude` command, which in turn triggered the `Stop` hook again, leading to a recursive loop that bypassed API rate limits.
tags:
  - "clippings"
  - "claude"
  - "hooks"
  - "bug"
  - "api"
  - "infinite-loop"
---

## 概要

Redditユーザーの `AdGroundbreaking3121` 氏が、Claudeのフック機能を使って意図せず無限ループを発生させてしまい、1日あたり3600ドルもの高額な料金が発生する可能性がある問題について報告しました。

![Cost simulation image](https://preview.redd.it/anyone-else-accidentally-create-an-infinite-loop-that-costs-v0-xbcnd38zrhbf1.png?width=666&format=png&auto=webp&s=6a426081f85284a9465bc48982dec541827c8ab3)

## 問題の経緯

ユーザーは、Claudeのセッションが停止したときに `history.md` ファイルを更新するため、以下のような単純な `Stop` フックを設定しました。

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "claude -c -p \"Update all changes to history.md\""
          }
        ]
      }
    ]
  }
}
```

これが大きな間違いでした。

## 無限ループの原因

ユーザーは、以下のメカニズムで無限ループが発生したと推測しています。

1. Claudeを停止すると `Stop` フックがトリガーされる。
2. フックが `claude` コマンドを実行する。
3. その `claude` コマンドが終了すると、再び `Stop` フックがトリガーされる。
4. 上記が破産するまで繰り返される。

## 問題の深刻さ

この無限ループの最も危険な点は、APIのレート制限を完全にバイパスしてしまうことです。スロットリングや保護機能が一切働かず、純粋なAPIコールが1日あたり3600ドル分も消費される可能性があります。

投稿者は `Claude Max` プランを利用していたため、実際に金銭的な損失は発生しませんでした。しかし、APIプランを利用しているユーザーがこの問題に遭遇した場合、高額な請求が発生する可能性があると警鐘を鳴らしています。彼はこの問題を「非常に簡単に踏み抜いてしまう核兵器レベルの地雷（nuclear footgun）」と表現しています。

## 提起された疑問と解決策の模索

投稿者はコミュニティに対し、以下の点を問いかけています。

* 同様の問題に遭遇した他のユーザーはいるか？
* コマンドがフックによって開始されたものかを検知し、`Stop` フックをスキップするような回避策は存在するか？
* そもそも、フックから `claude` コマンドを呼び出すこと自体を禁止すべきではないか？
