---
title: "Node.js — Differences between Node.js and the Browser"
source: "https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser"
author:
  - "[[@nodejs]]"
  - Node.js contributors
published:
created: 2025-06-23
description: |
  ブラウザとNode.jsは共にJavaScriptを使用しますが、その開発体験は大きく異なります。利用できるAPIや実行環境の制御、モジュールシステムに重要な違いがあります。
tags:
  - "clippings"
  - "Node.js"
  - "JavaScript"
  - "Browser"
  - "Environment"
---

## Node.jsとブラウザの主な違い

Node.jsとブラウザはどちらもJavaScriptをプログラミング言語として使用しますが、アプリケーションの構築方法は根本的に異なります。同じJavaScriptでありながら、いくつかの重要な違いにより、開発体験は大きく変わります。

### エコシステムの相違点

最大の違いはエコシステムにあります。

#### 1. APIの違い

* **ブラウザ**: 主にDOM（Document Object Model）やCookieなどのWeb Platform APIと対話します。`document`や`window`といったオブジェクトはブラウザ環境に固有のものであり、Node.jsには存在しません。
* **Node.js**: ファイルシステムへのアクセス機能など、Node.jsモジュールによって提供される豊富なAPI群を利用できます。これらのAPIはブラウザ環境では利用できません。

#### 2. 実行環境の制御

* **Node.js**: 開発者はアプリケーションを実行するNode.jsのバージョンを管理できます（オープンソースアプリケーションを除く）。これにより、特定のバージョンがサポートする最新のECMAScript（ES2015+）の機能を、トランスパイラ（Babelなど）なしで直接記述できます。
* **ブラウザ**: アプリケーションを閲覧するユーザーがどのブラウザを使用するかを選択できないため、古いバージョンのJavaScriptに対応する必要が生じることがあります。

#### 3. モジュールシステム

* **Node.js**: CommonJS (`require()`)とES Modules (`import`) の両方のモジュールシステムをサポートしています（v12以降）。
* **ブラウザ**: ES Modules (`import`) の標準実装が進んでおり、主にこちらが使用されます。

### フロントエンド開発者にとっての利点

フロントエンドでJavaScriptを多用する開発者にとって、Node.jsはフロントエンドとバックエンドの両方を単一言語でプログラミングできるという大きな利点をもたらします。これにより、一つの言語を深く学ぶだけで、クライアントサイドとサーバーサイドの両方の開発に対応できるというユニークなアドバンテージを得ることができます。
