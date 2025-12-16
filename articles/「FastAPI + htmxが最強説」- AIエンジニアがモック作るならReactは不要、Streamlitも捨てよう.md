---
title: "「FastAPI + htmxが最強説」- AIエンジニアがモック作るならReactは不要、Streamlitも捨てよう"
source: "https://zenn.dev/livetoon/articles/04dccf642d324c"
author:
  - "[[Zenn]]"
published: 2025-12-12
created: 2025-12-16
description:
tags:
  - "clippings"
---
[Livetoon Inc.](https://zenn.dev/p/livetoon)[Publicationへの投稿](https://zenn.dev/faq#what-is-publication)

507

250[tech](https://zenn.dev/tech-or-idea)

## FastAPI + htmxが最強説 - Pythonエンジニアがモック作るならReactは不要、Streamlitも捨てよう

この記事は `Livetoon Tech Advent Calendar 2025` の12日目の記事です。

## 宣伝

今回のアドベントカレンダーでは、LivetoonのAIキャラクターアプリのkaiwaに関わるエンジニアが、アプリの話からLLM・合成音声・インフラ監視・GPU・OSSまで、幅広くアドベントカレンダーとして書いて行く予定です。  
是非、publicationをフォローして、記事を追ってみてください。

## 本題

どうも、LivetoonCTOのだいちです。  
今回はスタートアップでプロトタイプ開発する時の技術選定について書きます。結論から言うと、 `FastAPI + htmx` という組み合わせがモック開発において最も効率的で効果があると思います。

モックごときでReactをいちいち書くの大変じゃないですか？あと管理もフロント/バックエンドと２つを考慮する必要があって複雑になりやすいです。

![](https://storage.googleapis.com/zenn-user-upload/698182bc236a-20251210.jpg)

ということで最近の自分は、htmxを勧めています。  
FastAPIで書いたバックエンドに、htmxの属性を数行追加するだけ。それだけで非同期通信もリアクティブUIも実現できる。Python書ける人なら、今日から使えます。

## プロトタイプ開発の選択肢

Pythonエンジニアがプロトタイプを作る時、大体以下の3つから選ぶことになります。

1. **Streamlit / Gradio** - データサイエンティスト向けダッシュボード
2. **React / Next.js + FastAPI** - フロントエンド分離アーキテクチャ
3. **FastAPI + htmx** - サーバーサイドレンダリング + 部分更新

で、この中で一番使えるのが3番目です。理由を説明します。

## そもそもPythonを使うなという議論

まず前提として、「Pythonなんか使わずに、最初からTypeScript（Node.js）で全部書けばいいじゃん」という意見があります。

これは正直、一番考える必要があると思います。

シンプルなSaaSを作るだけなら、確かにPythonを使う必要はないかもしれません。Next.js + TypeScriptで全部書いた方が統一感があって、開発効率も良いでしょう。

ただ、AI系のスタートアップの場合、話が変わります。

### LLM関連のライブラリはPythonが充実している

LangChain、Transformers、OpenAI SDK、Anthropic SDK。これら全部、Pythonの方が充実しています。TypeScriptにも移植されてきていますが、機能の網羅性や更新速度はPythonの方が圧倒的に上です。

**新しいLLMの手法が出た時、大抵最初に実装されるのはPython** です。論文のリファレンス実装もPythonが多い。最新の手法を試そうと思ったら、Pythonを使わざるを得ません。

### AIモデルを動かすならほぼPython一択

PyTorch、TensorFlow、JAX。深層学習のフレームワークは基本的にPythonです。

自社でモデルをファインチューニングしたり、トレーニングしたりするなら、Pythonは避けられません。推論だけならTypeScriptでもできますが、モデル開発まで視野に入れるなら、Pythonが必須です。

AIスタートアップでPythonを使うのは、むしろ標準的な選択です。「Pythonを使うな」というのは、現実的ではありません。

### だからPythonを前提にする

というわけで、この記事ではPythonを使うことを前提にします。

で、Pythonを使うなら、バックエンドはFastAPIになります。(強引)  
そして、フロントエンドをどうするかという話になります。

## Streamlitが使えない理由

### 見た目が全部一緒問題

Streamlitのダッシュボード、見飽きてません？サイドバーの配置も、ボタンのデザインも、フォントも全部おんなじ。

AIプロダクトのデモ見に行くと、8割がStreamlitなんですよ。で、全部見た目が一緒。正直、「またStreamlitか...」ってなります。

実際にカスタマーと話ししていても、AIのスタートアップはこういった共通のダサいキットでもあるの？と暗にStreamlitをディスられたことがあります。

```python
# Streamlitの例
import streamlit as st

st.title("対話システムダッシュボード")
text = st.text_input("メッセージ入力")
if st.button("送信"):
    response = chat_api(text)
    st.write(response)
```

確かに簡単です。でもこれ、どう見てもStreamlitですよね。  
![](https://storage.googleapis.com/zenn-user-upload/4689c531cdc9-20251128.png)

### カスタマイズができない

Streamlitの最大の問題は、デザインのカスタマイズがほぼできないことです。CSSをいじれば多少は変えられますが、根本的な構造は変えられません。

- サイドバーの位置を変えられない
- ボタンのデザインを自由に変えられない
- レイアウトの自由度が低い
- カスタムコンポーネントを作るのが面倒

「Streamlitっぽさ」を消すことができないんですよ。

### 本番環境に出せない

Streamlitで作ったアプリを「本番環境に出す」のは基本的に無理です。

認証機能が貧弱で、API化も難しい。データベース操作も制限がある。WebSocketやSSEのサポートも弱い。

「じゃあデモ用に使えばいいじゃん」って思うかもしれませんが、問題はそこから先です。

デモが好評で「これ本番化できる？」って聞かれた時、「いや、Streamlitなんで全部作り直しです」って言わなきゃいけない。せっかく作ったプロトタイプが全部無駄になるんですよ。これ、時間の無駄じゃないですか？

### Streamlitが使えるケース

じゃあStreamlitが完全に使えないかというと、そうでもありません。

- データサイエンティストが1人で作る社内ダッシュボード
- 誰にも見せない、自分用の分析ツール
- デザインにこだわらない、機能だけ動けばいいツール

こういう用途なら最高です。でも、「顧客に見せる」「本番化する可能性がある」なら、最初から別の選択肢を選んだ方がいいと思います。

## React/Next.jsという選択肢の問題

### 一人でモックもAIも作ってるスタートアップの現実

「じゃあReactで作ればいいじゃん」って言う人いますが、ちょっと待ってください。

AIスタートアップの初期って、大抵エンジニア1人でモックもAIも全部作ってるんですよ。もしくはエンジニア2人いても、両方ともバックエンド/AI寄りで、フロントエンド専門の人はいない。

そういう状況で、Reactを選ぶのは正直しんどいです。

Python書いて、AIモデルいじって、プロンプトチューニングして、その上でReactも書いて、状態管理も考えて...一人でこれ全部やるの、無理じゃないですか？

### セットアップが面倒

React/Next.jsのセットアップ：

```bash
npx create-next-app@latest
# テンプレート選択、TypeScript、ESLint、App Routerなど各種設定

npm install axios react-query tailwindcss
# node_modules肥大化、数分待機

# tsconfig.json、next.config.js、.eslintrc.json...
# 設定ファイル地獄
```

これ、モック作るのに必要？

### 2つのサーバー管理

React/Next.jsを選ぶと、フロントエンドとバックエンドで2つのサーバーを管理することになります。

```
フロントエンド (Next.js) ← HTTP通信 → バックエンド (FastAPI)
  ↓ ビルド必要              ↓ 別サーバー
  Vercel等にデプロイ        AWS/GCP等にデプロイ
```

- CORS設定が必要
- 認証トークンの管理が必要
- 環境変数を2箇所で管理
- デプロイも2回必要
- ビルド時間も考慮

一人でモック作ってる段階で、この複雑さ、本当に必要ですかって話になります。

### 「将来的にスケールするかも」という幻想

「将来的にスケールするかもしれないから、最初からReactで...」

その「将来」、本当に来ますか？

大抵、来ません。小〜中規模で落ち着きます。で、過剰なアーキテクチャに苦しめられることになります。

必要になったら移行すればいいんですよ。最初から完璧を目指す必要はない。

## FastAPI + htmxという選択

ここで、FastAPI + htmxという組み合わせが登場します。

### htmxとは何か

htmxは、HTML属性だけで非同期通信を実現できるライブラリです。

```html
<button hx-get="/api/messages" hx-target="#result">
  メッセージ取得
</button>
<div id="result"></div>
```

これだけで、ボタンをクリックすると非同期でデータを取得し、結果を表示できます。

JavaScript、0行です。

### FastAPI側の実装

```python
@app.get("/api/messages")
async def get_messages():
    messages = db.get_messages()
    return templates.TemplateResponse("messages.html", {
        "request": request,
        "messages": messages
    })
```

サーバーがHTMLフラグメントを返して、htmxがそれをDOMに挿入する。シンプルですが、これで十分に動的なUIが作れます。

### セットアップの簡潔さ

FastAPI + htmxのセットアップ：

```bash
pip install fastapi uvicorn jinja2
```

以上です。

FastAPIを軸に、かなりシンプルに完結します。

### 1つのサーバーで完結

```
FastAPI (HTML返す) ← ブラウザ
  ↓
  1つのサーバーで完結
  デプロイも1回
```

CORS設定不要、環境変数も1箇所、デプロイも1回。

モックなら、これで十分です。

### Pythonだけで完結

これが一番大きい。

AIモデルいじるのもPython、バックエンドAPIもPython、フロントエンドのロジックもPython（Jinja）。

言語を切り替える必要がなく、認知負荷も低い。

一人で全部やってる時、これは本当に大きいです。

## 実装パターン

### パターン1：自動更新

対話システムのダッシュボードで、会話履歴を定期的に更新したいとします。

```html
<div hx-get="/api/conversations" hx-trigger="every 5s">
  会話履歴を読み込み中...
</div>
```

```python
@app.get("/api/conversations")
async def get_conversations():
    conversations = db.get_recent_conversations()
    return templates.TemplateResponse("conversations.html", {
        "conversations": conversations
    })
```

5秒ごとに会話履歴が自動更新されます。WebSocket使わなくても、ポーリングで十分実用的です。

### パターン2：フィルター検索

会話履歴をフィルタリングしたいとします。

```html
<form hx-get="/api/search" hx-target="#results">
  <input name="query" placeholder="検索..." />
  <select name="status">
    <option value="active">進行中</option>
    <option value="completed">完了</option>
  </select>
  <button type="submit">検索</button>
</form>

<div id="results"></div>
```

```python
@app.get("/api/search")
async def search(query: str, status: str):
    results = db.search_conversations(query, status)
    return templates.TemplateResponse("results.html", {
        "results": results
    })
```

フォーム送信時に自動的に検索結果が表示されます。 `fetch()` 書く必要ありません。

### パターン3：削除機能

会話履歴を削除したいとします。

```html
<div id="conv-{{ conv.id }}">
  <h3>{{ conv.title }}</h3>
  <button hx-delete="/api/conversations/{{ conv.id }}"
          hx-target="#conv-{{ conv.id }}"
          hx-swap="outerHTML"
          hx-confirm="本当に削除しますか？">
    削除
  </button>
</div>
```

```python
@app.delete("/api/conversations/{conv_id}")
async def delete_conversation(conv_id: int):
    db.delete(conv_id)
    return HTMLResponse("")
```

削除ボタンをクリックすると、該当要素だけが消えます。状態管理、不要です。

### パターン4：SSE（Server-Sent Events）

LLMのストリーミング応答を表示したいとします。

```python
@app.get("/stream")
async def stream_response():
    async def event_generator():
        async for chunk in llm_stream("こんにちは"):
            yield f"data: {chunk}\n\n"
            await asyncio.sleep(0.1)
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

```html
<div hx-ext="sse" sse-connect="/stream" sse-swap="message" hx-swap="beforeend">
  ストリーミング受信中...
</div>
```

Streamlitでこれを実装しようとすると、かなり面倒です。htmxなら簡単。

### パターン5：無限スクロール

会話履歴を無限スクロールで読み込みたいとします。

```html
<div id="conversations">
  <!-- 既存の会話履歴 -->
</div>

<div hx-get="/api/conversations?offset=20"
     hx-trigger="revealed"
     hx-swap="afterend">
  <span class="loading">読み込み中...</span>
</div>
```

```python
@app.get("/api/conversations")
async def get_conversations(offset: int = 0, limit: int = 20):
    conversations = db.get_conversations(offset, limit)
    return templates.TemplateResponse("conversations_partial.html", {
        "conversations": conversations,
        "next_offset": offset + limit
    })
```

スクロールして要素が見えたら、自動的に次のページを読み込みます。

## 実際のプロジェクトでの使用例

弊社で対話システムのダッシュボードを開発した時、FastAPI + htmxを使いました。  
簡単に言うと、会話のチャット画面のUIとその会話履歴を管理するダッシュボードの作成ですね。

もちろんリッチなアプリケーションにするならフロントエンド開発も必要ですが、PoCだったのでhtmxを採用しました。

![](https://storage.googleapis.com/zenn-user-upload/64c937a2651b-20251210.jpg)

技術スタック：

- FastAPI - バックエンドAPI + HTMLレンダリング
- htmx - 非同期通信 + 部分更新
- Tailwind CSS + DaisyUI - デザイン
- Jinja2 - テンプレートエンジン
- SQLModel - データベースORM

## AI時代の開発フロー

従来の開発フロー：

1. 要件定義
2. バックエンドAPI実装
3. フロントエンド実装
4. 状態管理、非同期処理の実装
5. デザイン調整
6. 完成

時間かかりすぎです。

AI時代の開発フロー：

1. ChatGPT/Claudeにデザイン案を投げる  
	「対話システムのダッシュボードのHTML作って。Tailwind使って」
2. 完成度高いモックHTMLが出てくる
3. そのHTMLにhtmx属性を追加  
	`hx-get="/api/data" hx-trigger="load"`
4. FastAPIでエンドポイント書く
5. 完成

デザインはAI、機能実装はhtmx。これが最速です。

ChatGPTにFigma投げてHTML生成して、htmx属性追加して、FastAPIでエンドポイント書く。これだけで動くものができます。

## プロトタイプから本番への移行

### Streamlitの場合

```
Streamlit実装
  ↓
「これ本番化できる？」
  ↓
「無理です。全部作り直しです」
  ↓
FastAPI + React/htmxで全面リファクタリング
  ↓
本番リリース
```

せっかく作ったプロトタイプが無駄になります。

### FastAPI + htmxの場合

```
FastAPI + htmx実装
  ↓
「これ本番化できる？」
  ↓
「API設計できてるので、移行しやすいです」
  ↓
認証・課金機能追加
  ↓
本番リリース（htmxのまま or Reactに移行）
```

API設計が残ります。そのままhtmxで本番化してもいいし、必要ならReactに移行することもできます。リファクタリングのコストが最小限で済みます。

**捨てないプロトタイプ** を作ることができる。これがFastAPI + htmxの最大の利点です。

## どういう時にhtmxを選ぶべきか

htmxが適しているケース：

- AIスタートアップの初期フェーズ
- エンジニアが1〜2人で全部やってる
- Pythonがメイン言語
- フロントエンドエンジニアがいない
- 短期間でプロトタイプを作る必要がある
- 本番化も視野に入れている
- デザインのカスタマイズが必要
- LLMストリーミング、リアルタイム更新が必要

Streamlit/Gradioを選ぶべきケース：

- データサイエンティストが1人で作る社内ダッシュボード
- 誰にも見せない、自分用の分析ツール
- デザインにこだわらない
- 本番環境に出す予定が一切ない

TypeScript（Node.js）で全部書くべきケース：

- シンプルなSaaS（AIモデルを使わない）
- フロントエンドエンジニアが中心のチーム
- 言語を統一したい

## まとめ

プロトタイプ開発において、FastAPI + htmxは非常に効率的な選択肢です。

- セットアップがシンプル
- Pythonの知識だけで完結（JavaScript学習不要）
- API設計が残る（本番化への移行がスムーズ）
- デプロイが1回で完結（フロント・バック分離なし）
- LLMライブラリとの親和性が高い（全部Pythonで書ける）

AIスタートアップの初期フェーズで、「とりあえずReact」「とりあえずStreamlit」という選択をする前に、FastAPI + htmxという選択肢も検討してみてください。

モック/プロトタイプ開発で過剰なアーキテクチャを選ぶ必要はありません。シンプルに、最速で、動くものを作る。それがスタートアップの開発です。

参考リンク：

- [htmx公式ドキュメント](https://htmx.org/)
- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [Jinja2テンプレートエンジン](https://jinja.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

ばいちゃ！

507

250