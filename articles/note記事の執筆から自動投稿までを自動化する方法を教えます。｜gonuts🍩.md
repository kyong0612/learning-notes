---
title: "note記事の執筆から自動投稿までを自動化する方法を教えます。｜gonuts🍩"
source: "https://note.com/joyous_hawk969/n/n7e325e86a3db"
author:
  - "[[gonuts🍩]]"
published: 2025-10-06
created: 2025-10-08
description: |
  GitHub Actionsを使用して、noteの記事執筆から投稿までを完全自動化するシステムの実装方法を解説。Claude Code SDKによるリサーチ、Claude Sonnet 4.5による執筆、Tavily APIによるファクトチェック、Playwrightによる自動投稿の4ステップで構成され、スマホからでも実行可能。API料金以外は完全無料で、自由にカスタマイズ可能なワークフローを提供。
tags:
  - "GitHub-Actions"
  - "AI"
  - "automation"
  - "note"
  - "Claude"
  - "Playwright"
  - "Tavily"
  - "CI/CD"
  - "content-creation"
  - "web-automation"
  - "clippings"
---

こんにちは。🍩です。

noteっていろいろな書き方があると思います。

各個人が熱量を込めておもいおもいの文章を書き連ねたり、伝えるためにわかりやすく情報を画像や動画付きで整理したり、速報のようにニュースを届けたり。

でも、「毎日発信したいけど時間がない」「リサーチに時間がかかって執筆まで手が回らない」そんな悩みもあるのではないでしょうか。

だからこそ、AIで自動化できる部分は自動化して、自分が本当に書きたい記事に時間を使える。そんな選択肢を持っておくことが大切だと感じています。

この記事では、Github Actionsというものを使って「リサーチ→執筆→ファクトチェック→自動投稿」までを自動化する仕組みを無料で公開します。

有料記事にしようか悩みましたが、AIを使えば非エンジニアでもこんなことができてしまうんだという嬉しさをより多くの人に届けたいと思い、無料で公開することに決めました。

---

## 1️⃣ note自動投稿までの流れ

まず、「何ができるのか」を見てみましょう🍩

### GitHub Actionsでワークフローを起動

スマホからでもPCからでも、GitHub上で手動実行できます。  
テーマ、想定読者、伝えたいメッセージなどを入力するだけです。

### 4つの処理を自動実行

- リサーチ：Claude Code SDKを使用してWebから情報を集める
- 執筆：Claude Sonnet 4.5を使用して記事を書く
- ファクトチェック：Tavilyを使用して事実確認をする
- 投稿：Playwrightを使用してnoteに自動で投稿する

### noteに記事が投稿される

指定した内容で、自動的にnoteに下書き投稿が完了します。 **Human-in-the-Loop** （ワークフローの間に人間の判断を挟む）という考え方も取り入れています。

![画像](https://assets.st-note.com/img/1759726375-EgcCMvDiVjsKozmNJTG06ekx.jpg?width=1200)

ワークフローの実行が完了

![画像](https://assets.st-note.com/img/1759726398-IhAgqN8UXfitdbOvaF4E5QYD.jpg?width=1200)

下書きに保存されている

![画像](https://assets.st-note.com/img/1759726418-L4SqTDHFYcko3NbJrAg1BfG6.jpg?width=1200)

note記事も生成されている🔥

---

ここから先は有料部分です

## 2️⃣ はじめに

### なぜこのワークフローを作ったのか?

noteの記事を自動生成するのは、そこまで難しくありません。GPTs、Difyなどのツールを使用して、しっかりとワークフローを考えれば、記事を生成することは可能です。

しかし、それらには課題や難しいことがあります。

- 記事生成まではできても、noteへの自動投稿は難しい
- 出先や思いついたそのときには、noteを自動投稿できない
- 自分好みにカスタマイズできない
- 月額課金が必要となる（Dify、n8nなど）

そこで、 **GitHub Actions** という無料のツールを使えば、これらの問題をすべて解決できると考えました。

### このシステムの4つの特徴

**1\. noteへの自動投稿まで完結**

記事を生成するだけでなく、 **note.comへの投稿まで自動化** できます。他のツールだと「記事をコピー→noteを開く→貼り付け→公開」という手間がかかりますが、このワークフローならすでに完了しています。

**2\. スマホからでも実行可能**

Github Actionsで設定されているので、GitHub.comにアクセスもしくはGithub Mobileからでも実行できます。外出先でスマホから「今日の記事を投稿」なんてことも可能です。

**3\. 自由にカスタマイズ可能**

ワークフローはYAMLで公開されているため、自分の好みに合わせて自由に改造できます。

- プロンプトを変えてみよう。
- 投稿タイミングを自動化してみよう。
- リサーチは、Perplexity Search APIを使うように変更しよう

などなど、使い方は無限大です。

**4\. API料金以外は完全無料**

GitHub Actionsは月2,000分（約33時間）まで無料で使えます。この仕組みなら月に数十記事投稿しても無料枠内に収まります。必要なのはAnthropic APIとTavily API（とPerplexity Search API）の利用料金のみです。無料枠があるものもあるので、まずは無料で試すことができます。

---

## 3️⃣ GitHub Actionsとは?

GitHub Actionsは、 **GitHubが提供する無料の自動化ツール** です。

本来はプログラマーが「コードをチェック→テスト→デプロイ」といった作業を自動化するためのツールです(CI/CDツールと呼ばれます)。

でも、 **実は「ワークフローの自動化」なら何でもできる** んです。

[**Actions** *GitHub Actionsを使用することで、高機能のCI / CDですべてのソフトウェアワークフローを簡単に自動化できま* *github.co.jp*](https://github.co.jp/features/actions)

### 発想の転換：開発ツールを自動化ツールとして使う

Difyやn8nのような自動化ツールを使ったことがある方なら、イメージしやすいかもしれません。

「〇〇が起きたら→△△を実行する」という流れを設定できるツール、ありますよね。

GitHub Actionsも同じように使えます。

**従来の使い方（プログラマー向け）：**

- コードをプッシュしたら→自動でテスト実行
- 定期的に→バックアップを実行

**今回の使い方（note自動投稿）：**

- ボタンを押したら→AIで記事を生成してnoteに投稿
- 毎朝9時に→自動で記事を投稿

つまり、 **開発ツールだけど、ワークフロー自動化ツールとして使える** ということです。

---

## 4️⃣ どのように自動投稿までやっているの？

### 全体のアーキテクチャ

このシステムは4つのJob（処理単位）で構成されています。 各Jobは独立して実行され、前のJobの結果を受け取って処理を進めます。

```
1. Research Job (リサーチ)
   ↓ リサーチレポート
2. Write Job (執筆)
   ↓ 記事下書き(タイトル・本文・タグ)
3. Fact-check Job (ファクトチェック)
   ↓ 修正済み最終原稿
4. Post Job (投稿)
   → note.comに投稿完了
```

### Step1. リサーチJob

noteを執筆するにあたって、Web検索を用いて **リサーチレポート** を生成します。今回は、Claude Code SDKの機能を使用したもので解説します。

> 💡 SDKとは？  
> SDK（Software Development Kit）は、「ソフトウェア開発キット」の略です。 簡単に言うと、 **他の人が作った便利な機能を、自分のプログラムで使えるようにするための道具セット** です。  
>
> 例えば、  
> Anthropic社が提供するコーディング支援ツール「Claude Code」の機能を、自分のプログラムから使えるようにしたい → Claude Code SDKを使う  
>
> 自分でゼロから作ると大変な機能を、すでに用意されたSDKを使うことで簡単に実装できます。

Claude Sonnet 4.5

**Claude Code SDKで使える主な機能**

こちらから確認できます👇️

[**Claude Code設定 - Claude Docs** *グローバルおよびプロジェクトレベルの設定、環境変数でClaude Codeを設定します。* *docs.claude.com*](https://docs.claude.com/ja/docs/claude-code/settings#claude%E3%81%8C%E5%88%A9%E7%94%A8%E3%81%A7%E3%81%8D%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB)

今回は、この中から **WebSearch** と **WebFetch** だけを道具として持った、Claude CodeをリサーチJobに組み込んで使用しています。

**WebSearchとWebFetchの違い**

🔍️ WebSearch（検索機能）

- 検索エンジンを使って関連するWebページを探す
- Claude Codeが使用することで、検索クエリを自動生成
- Claude Codeが使用することで、複数回の検索を組み合わせる「エージェント的な検索」が可能

🤌🏻 WebFetch（取得機能）

- 指定されたURLから直接コンテンツを取得
- Claude Codeが使用することで、ユーザーが明示的に指定したURLか、検索結果に含まれるURLのみを取得することが可能

このように、Claude Code SDKの持つWeb検索・取得機能を、リサーチ目的に転用しているのがこのJobの特徴です。

### Step2. 執筆Job

AI SDKとClaude Sonnet 4.5を使用して、リサーチ結果をもとに、 **記事の下書き** を生成します。

### Step3. ファクトチェックJob

AI SDKとTavily APIを使用して、生成された記事の事実確認を行い、 **修正済みの最終原稿** を生成します。

> 💡 Tavily APIとは？  
> Tavily APIは、 **AI向けに最適化された検索API** です。 通常の検索エンジンと異なり、AIがファクトチェックしやすい形式で検索結果を返してくれます。

Claude Sonnet 4.5

### Step4. 投稿Job

Playwrightを使用して、最終的な記事をnote.comに自動投稿します。

> **💡 Playwrightとは？**  
> Playwrightは、 **Webブラウザを自動操作できるツール** です。 人間がマウスやキーボードで操作するのと同じように、プログラムでWebサイトを操作できます。

Claude Sonnet 4.5

具体的には、

1. 保存済みのnoteログイン情報（storageState）を使って、note.comに自動アクセス
2. タイトルを自動入力
3. 記事本文を自動入力
4. 下書き保存 or 公開ボタンを自動クリック

> 🤔 noteへのログイン実装にあたって感じたこと  
>
> **MCPに頼らないという選択肢を持つこと** です。  
> 当初はPlaywright MCPを使用してnoteへの自動投稿を行おうとしていましたが、やはり自然言語でWebブラウザの自動操作を制御するのは難しいなと感じました。（結局、その方法では自動投稿を行うことができなかった。）  
>
> 自然言語からWebブラウザの自動操作はできるという感覚はもったうえで、動作を制御したいときは、やはり **コード、コード、コード** なんだということです。  
>
> この結果として、安定してnoteへの自動投稿が可能になりました。  
>
> storageStateについては、後ほど解説します。

🍩

## 5️⃣ 実行しよう

お待たせしました。  
では、実際にあなたの環境にセットアップをしていきましょう。

### Step1：GitHubをフォーク

まず、以下のリポジトリにアクセスしてフォークします。  
フォークすることで、あなたのGitHubアカウントにコピーが作成されます。

### Step2：事前準備

以下の3つのAPIキーを取得します。

**1\. Anthropic API Key**

- [https://console.anthropic.com/](https://console.anthropic.com/) にアクセス
- API Keyを取得

**2\. Tavily API Key**

- [https://tavily.com/](https://tavily.com/) にアクセス
- Sign upして無料アカウント作成
- API Keyを取得

**3\. note.comのログイン情報（storageState）**

これが少し複雑なので、詳しく解説します。

> 💡 **storageStateとは？  
>**  
> storageStateは、ブラウザの「ログイン状態を保存したファイル」です。普段、noteにログインすると次回から自動でログインできますよね。それと同じ仕組みを、プログラムでも使えるようにしたものです。これにより、自動投稿の際に毎回ログインする必要がなくなります。

Claude Sonnet 4.5

まず、ローカル環境でディレクトリを作成し、下記コマンドを実行してPlaywrightをインストールします。

```swift
npm init -y
npm install playwright
npx playwright install chromium
```

次に、以下の内容でlogin-note.mjsというファイルを作成します。

最後に、このスクリプトを実行します。

すると、

- ブラウザが自動で起動します。
- note.comに **メールアドレスとパスワード** でログインしてください。
- ログイン完了後、note-state.json（Step3で使用します）が生成されます。

### Step3：環境変数の設定

GitHubリポジトリの設定で、以下の環境変数を登録します。  
リポジトリの **Settings** > **Secrets and variables** > **Actions** に移動します。

![画像](https://assets.st-note.com/img/1759739682-xfZ92H0SljQEJdYvwAeboKFD.png?width=1200)

New repository secret をクリックして、環境変数を追加してください。

![画像](https://assets.st-note.com/img/1759739746-ma10ltpZoDYe6U7CfWbud5sT.png?width=1200)

**① ANTHROPIC\_API\_KEY**

- Name：ANTHROPIC\_API\_KEY
- Secret：取得したAnthropicのAPIキー

**② TAVILY\_API\_KEY**

- Name：TAVILY\_API\_KEY
- Secret：取得したTavilyのAPIキー

**③ NOTE\_STORAGE\_STATE\_JSON**

- Name：NOTE\_STORAGE\_STATE\_JSON
- Secret：note-state.jsonの内容全体をコピー&ペースト

### Step4：実行

準備が整いました、早速実行してみましょう🔥

![画像](https://assets.st-note.com/img/1759740014-HfnNaDzlKogOW29A5TYEIvbF.png?width=1200)

リポジトリの **Actions** タブに移動 >  **Note Workflow** を選択 >  **Run workflow** をクリック

以下の項目を入力 > 緑色のボタンの **Run workflow** をクリック

- **theme** ：記事のテーマ（"GitHub Actionsの活用方法"）
- **target** ：想定読者（"エンジニア初心者"）
- **message** ：伝えたい核メッセージ（"自動化で生産性向上"）
- **cta** ：読後のアクション（"実際に試してみる"）
- **tags** ：カンマ区切りのタグ（"GitHub,自動化,AI"）
- **is\_public** ：false（下書き保存） or true（公開）
- **dry\_run** ：false（投稿する） or true（投稿スキップ）→ 実際には投稿せずに、記事生成だけをテストします。

数分待つと、noteに記事が投稿されます！！

### トラブルシューティング

**storageStateが期限切れになった場合**

- 同じ手順でnote-state.jsonを再取得
- GitHubシークレットを更新

**note.comのUI変更に対応する場合**

- post.mjsのセレクタを調整
- フォークしたリポジトリで自由に修正可能

**AI生成コンテンツの品質**

- まずはis\_public：falseで下書き保存
- 内容を確認してから公開するのがおすすめ

## まとめ

この仕組みを使えば、

✅ **完全無料** でnote記事を自動生成・投稿できる  
✅ **スマホからでも** ワークフローを実行可能  
✅ **YAML設定** で自分好みにカスタマイズできる  
✅ **下書き保存** でHuman in the Loopを実現

AIで自動化することも、しないことも、選択肢として持っておける。 そんな状態を作ることが、これからの時代には大切だと思っています。
