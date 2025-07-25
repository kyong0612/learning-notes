---
title: "Thread by @kenn"
source: "https://x.com/kenn/status/1948381902232268956?s=12"
author:
  - "[[@kenn]]"
published: 2025-07-24
created: 2025-07-25
description: |
  Xのスレッドで共有された、自作認証システムに関する議論。提示されたJavaScriptのコードは、常に`false`を返すため、実際には誰もログインできないという皮肉な状況を浮き彫りにしている。このコードが1500人規模の社内システムで使われていたという事実も相まって、プログラミングにおけるセキュリティやコード品質の重要性についての議論が交わされている。
tags:
  - "clippings"
  - "authentication"
  - "security"
  - "javascript"
  - "devhumor"
---

## 概要

XユーザーのKenn Ejima氏が投稿した、自作の認証システムに関するスレッドのまとめ。投稿されたJavaScriptのコードスニペットが、一見して脆弱に見えることから、プログラミングコミュニティで話題となった。

### 発端の投稿

**Kenn Ejima**氏が「本物のプログラマーは認証システムなんて自前で作るもんだからね」というコメントと共に、以下の画像（認証コードの一部）を投稿。

![Image](https://pbs.twimg.com/media/GwoKru5akAAKVEe?format=jpg&name=large)

このコードは、`if ("true" === "true")`という常に真となる条件分岐を持っており、その結果、必ず`return false;`が実行されるため、いかなる入力があっても認証が成功しないという構造になっている。

### 実稼働していたという事実

さらにEjima氏は、このコードが1500人のユーザーを抱える社内イントラネットアプリケーションで実際に使用されていたことを示す投稿を引用した。

> This JavaScript code powers a 1,500 user intranet application <http://devhumor.com/media/this-javascript-code-powers-a-1-500-user-intranet-application…> #devhumor #code #javascript
>
> ![Image](https://pbs.twimg.com/media/EJ6kozBXsAMPuvx?format=png&name=large)

### コミュニティの反応

この投稿に対し、他のユーザーからは以下のような反応が寄せられた。

* **Quoraでの類似例**: 別のユーザーが、Quoraで全く同じコードを見たことがあると指摘。
* **AIへの質問**: AI（Grok）に対して、このコードを評価させようとする試みや、コードの動作（常に`false`を返すこと）についての確認質問が投稿された。

このスレッドは、開発現場におけるコードの品質、レビューの重要性、そして時にはユーモアを交えて語られる「ひどいコード」の実例として、多くの開発者の関心を集めた。
