---
title: "Node.js — The V8 JavaScript Engine"
source: "https://nodejs.org/en/learn/getting-started/the-v8-javascript-engine#the-v8-javascript-engine"
author:
  - "[[@nodejs]]"
published:
created: 2025-06-24
description: |
  V8はGoogle Chromeを支えるJavaScriptエンジンであり、JavaScriptコードを解析・実行します。Node.jsの基盤技術でもあり、その普及とともにサーバーサイドJavaScriptの実行環境として広く利用されています。V8はC++で記述され、JIT（Just-In-Time）コンパイルによって高いパフォーマンスを実現しています。
tags:
  - "Node.js"
  - "V8"
  - "JavaScript"
  - "Engine"
  - "JIT"
---

# The V8 JavaScript Engine

V8は、Google Chromeを支えるJavaScriptエンジンの名称です。私たちが書いたJavaScriptを受け取り、Chromeでブラウジングする際にそれを実行する役割を担っています。

V8はJavaScriptエンジン、つまりJavaScriptコードを解析し実行するものです。DOMやその他のウェブプラットフォームAPI（これらすべてがランタイム環境を構成します）は、ブラウザによって提供されます。

重要な点は、JavaScriptエンジンがホストされているブラウザから独立していることです。この主要な特徴がNode.jsの台頭を可能にしました。2009年にV8がNode.jsを動かすエンジンとして選ばれ、Node.jsの人気が爆発的に高まるにつれて、V8は現在、膨大な量のサーバーサイドコードを動かすエンジンとなりました。

Node.jsのエコシステムは巨大であり、Electronのようなプロジェクトによってデスクトップアプリも動かしているV8のおかげです。

## Other JS engines

他のブラウザも独自のJavaScriptエンジンを持っています：

* Firefoxは **SpiderMonkey** を搭載しています。
* Safariは **JavaScriptCore**（Nitroとも呼ばれる）を搭載しています。
* Edgeは当初 **Chakra** をベースにしていましたが、最近ではChromiumとV8エンジンを使用して再構築されました。

その他にも多くのエンジンが存在します。

これらのエンジンはすべて、JavaScriptが使用する標準であるECMA ES-262標準（ECMAScriptとも呼ばれる）を実装しています。

## The quest for performance

V8はC++で書かれており、継続的に改善されています。移植性が高く、Mac、Windows、Linux、その他いくつかのシステムで動作します。

このV8の紹介では、V8の実装の詳細については触れません。それらはより権威のあるサイト（例：V8公式サイト）で見つけることができ、時間とともに、しばしば根本的に変化します。

V8は、ウェブとNode.jsエコシステムを高速化するために、他のJavaScriptエンジンと同様に常に進化しています。

ウェブの世界では、長年にわたってパフォーマンス競争が続いており、私たち（ユーザーおよび開発者）は、年々より速く、より最適化されたマシンを手に入れることができるため、この競争から多くの恩恵を受けています。

## Compilation

JavaScriptは一般的にインタプリタ言語と見なされていますが、現代のJavaScriptエンジンはもはやJavaScriptを解釈するだけでなく、コンパイルします。

これは、2009年にSpiderMonkey JavaScriptコンパイラがFirefox 3.5に追加されて以来のことであり、誰もがこの考えに追随しました。

JavaScriptは、実行を高速化するために、V8によって **ジャストインタイム（JIT）コンパイル** で内部的にコンパイルされます。

これは直感に反するように思えるかもしれませんが、2004年のGoogleマップの導入以来、JavaScriptは数十行のコードを実行する言語から、ブラウザで実行される数千から数十万行のコードを持つ完全なアプリケーションへと進化しました。

私たちのアプリケーションは、単なるフォームの検証ルールや簡単なスクリプトではなく、ブラウザ内で何時間も実行されるようになりました。

この*新しい世界*では、JavaScriptをコンパイルすることは完全に理にかなっています。なぜなら、JavaScriptを*準備*するのに少し時間がかかるかもしれませんが、一度完了すれば、純粋なインタプリタコードよりもはるかにパフォーマンスが高くなるからです。
