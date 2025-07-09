---
title: "gitのベアリポジトリとノンベアリポジトリ"
source: "https://qiita.com/devzooiiooz/items/56a02342d9d65d79f6c3"
author:
  - "[[devzooiiooz]]"
published: 2018-05-20
created: 2025-07-09
description: "はじめに リーナス・トーヴァルズはgitを10日間で作ったとか、神はいるんだねえ。 開発用Macでコーディング、その後サーバにpushして…という僕のような開発スタイルの場合、githubにpushするという仕組みに必要性を感じなくて、開発用クライアント(Mac)対..."
tags:
  - "Git"
  - "repository"
  - "bare"
  - "non-bare"
---

この記事は、GitHubのような中央集権的なリポジトリサービスを使わず、開発用クライアントと本番サーバー間で直接Gitを利用する際の、ベアリポジトリとノンベアリポジトリの概念と使い方を解説します。

## リポジトリの概念

Gitのリポジトリには、主に2つの種類があります。

* **ノンベアリポジトリ (Non-bare Repository)**
  * 普段私たちが `git init` で作成する、作業ディレクトリ（ワーキングツリー）を持つリポジトリです。
  * `.git` ディレクトリの中に更新履歴が格納され、それ以外の場所に実際のファイルが展開されます。
  * 開発や編集作業はここで行います。

* **ベアリポジトリ (Bare Repository)**
  * 作業ディレクトリを持たない、「裸の」リポジトリです。
  * 更新履歴やブランチ情報などの管理情報のみを保持します。
  * ファイルが展開されないため、直接編集することはできません。
  * 主に、複数人での開発や、異なる環境間でコードを共有するための中央リポジトリ（リモートリポジトリ）として使われます。
  * 慣習的に、ディレクトリ名には `.git` という接尾辞を付けます (例: `my-project.git`)。

## クライアント・サーバー間での利用モデル

開発用PC（クライアント）と本番サーバー間でGitを運用する際の、典型的で実践的な構成例です。

### 構成

* **クライアントPC（開発環境）**:
  * ノンベアリポジトリ (例: `/home/clientusername/www_dev`)
  * ここでコードの編集、コミットを行います。

* **サーバー（本番・中継環境）**:
  * **ベアリポジトリ（リモートリポジトリ）**:
    * (例: `/home/serverusername/www.git`)
    * クライアントからの `push` を受け取るための中継地点です。
  * **ノンベアリポジトリ（本番用ディレクトリ）**:
    * (例: `/home/serverusername/www_product`)
    * ベアリポジトリから `clone` または `pull` して、実際にWebサーバーなどが参照するファイルを展開します。

### 設定と更新のフロー

#### 1. クライアントPCでの初期設定

```bash
# 開発ディレクトリを作成
$ mkdir www_dev
$ cd www_dev
$ echo 'hello local!!' > index.html

# non-bareリポジトリとして初期化し、最初のコミット
$ git init
$ git add .
$ git commit -m 'first commit'
```

#### 2. サーバーでのリモートリポジトリ準備

サーバーにログインし、ベアリポジトリを作成します。

```bash
# bareリポジトリ用のディレクトリを作成
$ mkdir www.git
$ cd www.git

# bareリポジトリとして初期化
# --shared オプションは複数ユーザーで共有する場合にパーミッションを適切に設定する
$ git init --bare --shared
```

#### 3. クライアントからリモートリポジトリへPush

クライアントPCに戻り、サーバー上に作成したベアリポジトリを `remote` として登録し、`push` します。

```bash
# クライアント側でリモートリポジトリを登録（`hokkahokka` は任意エイリアス）
$ git remote add hokkahokka ssh://serverusername@192.168.0.1/home/serverusername/www.git

# masterブランチをpush
$ git push hokkahokka master
```

この時点で、サーバーの `www.git` ディレクトリにはコミット履歴が格納されますが、`index.html` のような作業ファイルは存在しません。

#### 4. サーバーでの本番用ディレクトリの作成

再度サーバーにログインし、ベアリポジトリから本番用の作業ディレクトリを `clone` します。

```bash
# リポジトリをクローンして本番用ディレクトリを作成
$ git clone www.git www_product

# 確認
$ ls www_product
index.html
```

`www_product` ディレクトリには `index.html` が展開されます。

#### 5. 開発とデプロイのサイクル

以降の開発サイクルは以下のようになります。

1. **クライアントPCで開発**:
    * コードを編集し、コミットし、`push` します。

    ```bash
    echo 'hello world!!!!!!' > index.html
    git add .
    git commit -m 'second commit'
    git push hokkahokka master
    ```

2. **サーバーで変更を反映（デプロイ）**:
    * サーバーの本番用ディレクトリに移動し、`pull` することで最新の変更を取得・反映します。

    ```bash
    cd www_product
    git pull origin master
    ```

この仕組みにより、GitHubなどを介さずに、ローカル環境から直接サーバーへ安全にコードをデプロイするワークフローが完成します。
