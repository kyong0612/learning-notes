---
title: "AI時代のUIはどこへ行く？"
source: "https://speakerdeck.com/yusukebe/aishi-dai-nouihadokohexing-ku"
author:
  - "[[Yusuke Wada]]"
published: 2025-09-06
created: 2025-09-08
description: |
  AI時代におけるUIの未来についての考察。テキストベースの対話が増える中でUIは不要になるのか、それとも形を変えて重要であり続けるのかを探る。本資料では、UI内でAIを活用する、AIがUIを生成する、AIがUIを受け取るといった3つのパターンを提示し、それぞれの具体例を交えながら解説する。
tags:
  - "clippings"
  - "AI"
  - "UI"
  - "UX"
  - "LLM"
  - "MCP"
---

## 概要

本資料は、Yusuke Wada氏による「AI時代のUIはどこへ行く？」と題した発表をまとめたものです。AIとテキストベースの対話が主流になる中で、従来のUIが不要になるのではないかという問いに対し、UIは形を変えつつも依然として重要であり続けると論じています。その関係性を以下の3つのパターンに分類し、具体的な事例とともに解説しています。

1. **UIの中でAIを使う**: 既存のUIにAI機能を組み込む。
2. **AIがUIを作る**: AIが対話的にUIを生成する。
3. **AIがUIを受け取る**: AI（モデル）がUIコンポーネントを解釈し、対話する。

## 発表内容

### AIとの対話とUIの必要性

現在のAIとの主な対話方法はテキストベース（チャット）です。例えば、おすすめのラーメン屋を尋ねる場合、まずChatGPTに聞き、次にGoogleで検索し、最終的にWebページにたどり着くという流れが一般的です。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_3.jpg)

この流れから、「AI時代にはテキスト入力があればWebページ（UI）は不要になるのではないか？」という疑問が生まれます。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_14.jpg)

しかし、Claude DesktopやGoogleマップの例を見ると、ユーザーが本当に求めているのは単なるテキスト情報だけでなく、視覚的でインタラクティブなUIであることがわかります。

Kent C. Dodds氏の記事「The future of AI interaction」を引用し、以下のような点でUIの優位性を主張しています。

* **直感的な操作**: ストップウォッチの開始・停止は、コマンドを打つよりボタンをクリックする方が遥かに直感的です。
* **データの可視化**: グラフやチャートによるデータの視覚的表現は、テキスト説明よりも理解しやすいです。
* **マルチモーダルな対話**: 音声コマンドとボタン操作を組み合わせるなど、状況に応じた柔軟な対話が可能です。

結論として、AI時代においてもUIは必要不可欠であり、その「やり方」が変わっていくと述べています。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_24.jpg)

### AIとUIの3つの関係性

本資料では、AIとUIの関係性を以下の3つのパターンに整理しています。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_25.jpg)

#### 1. UIの中でAIを使う

これは最も一般的なパターンで、既存のアプリケーションのUI内にAI（LLM）の機能を組み込むアプローチです。

* **具体例**:
  * チャットボット
  * Notion AI
  * スプレッドシートのGemini
  * Claude for Chrome

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_28.jpg)

#### 2. AIがUIを作る

AI（LLM）がユーザーの指示に基づいてUIを動的に生成し、ユーザーはそのUIと対話するパターンです。

* **具体例**:
  * ChatGPTのグラフ・表生成機能
  * コーディングエージェント
  * Claudeの「Artifacts」機能

特にClaudeの「Artifacts」機能は画期的で、ユーザーはコーディング不要でアイデアを伝えるだけで、インタラクティブなアプリケーションやツール、フォームを即座に生成できます。生成されたUIはReactとTailwind CSSで構成されており、内部でClaude APIを呼び出すことも可能です。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_31.jpg)

#### 3. AIがUIを受け取る

これは比較的新しい概念で、LLMがテキストだけでなくUIコンポーネントそのものを受け取り、解釈するパターンです。

Model Context Protocol (MCP) という仕組みの中で、UIを扱うための新しい仕様がKent C. Dodds氏によって提案されています。その実装の一つが`mcp-ui`です。

* `mcp-ui`は、サーバーサイドSDK（MCP経由でUIを送信）とクライアントサイドSDK（受信したUIを描画）を提供します。
* **デモの例**:
    1. ユーザーがチャットUIで「ラーメン屋を探して」と入力します。
    2. MCPサーバーは`mcp-ui`を使い、ラーメン屋のリストを含むUIを返します。
    3. ユーザーがUI内のボタンをクリックすると、その操作が`postMessage`でチャットUIに通知され、詳細表示のための別のMCPコールが実行されます。
    4. 最終的に、Google MapのMCPと連携し、目的地までのルート案内が表示されます。

これにより、チャットインターフェース内で豊かでインタラクティブな体験を実現できます。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_56.jpg)

### まとめ

* **AI時代のUIはどうなるか？**: UIは不要になるのではなく、その作り方や役割が変化していきます。
* **3つのパターン**: 「UIの中でAIを使う」「AIがUIを作る」「AIがUIを受け取る」という3つの関係性が今後の主流になると考えられます。

本発表が、AI時代のUIについて考えるきっかけになれば幸いである、と締めくくられています。

![](https://files.speakerdeck.com/presentations/ef6c6884f07d42219038397393cea061/slide_59.jpg)
