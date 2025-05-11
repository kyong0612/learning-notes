---
title: drawdb
source: https://github.com/drawdb-io/drawdb
author:
  - drawdb-io
published: 
created: 2025-04-27
description: |
  drawDBは、ブラウザ上で動作する、無料かつシンプルで直感的なデータベーススキーマエディタおよびSQLジェネレーターです。数クリックでダイアグラムを構築し、SQLスクリプトをエクスポートしたり、エディタをカスタマイズしたりできます。アカウント作成は不要です。
tags:
  - Database Schema
  - ERD
  - SQL Generator
  - JavaScript
  - React
  - Open Source
---

# drawdb

ref: <https://github.com/drawdb-io/drawdb>

---

## drawDB リポジトリ概要

**説明:**
drawDBは、ブラウザ上で動作する、無料かつシンプルで直感的なデータベーススキーマエディタおよびSQLジェネレーターです。数クリックでダイアグラムを構築し、SQLスクリプトをエクスポートしたり、エディタをカスタマイズしたりできます。アカウント作成は不要です。

**主要機能:**

* **データベーススキーマ編集:** 直感的なインターフェースでエンティティ関係図 (ERD) を作成・編集できます。
* **SQL生成:** 作成したスキーマから各種データベース（SQL Server, SQLite, PostgreSQL, MariaDB, Oracle）向けのSQLスクリプトを生成します。
* **カスタマイズ:** エディタの外観や動作をカスタマイズ可能です。
* **アカウント不要:** 基本的な機能はアカウント登録なしで利用できます。
* **共有機能 (オプション):** [drawdb-server](https://github.com/drawdb-io/drawdb-server) を別途セットアップすることで、作成したダイアグラムを共有できます（必須ではありません）。

**リポジトリ情報:**

* **URL:** [https://drawdb.app](https://drawdb.app)
* **ライセンス:** AGPL-3.0
* **スター数:** 28.6k
* **フォーク数:** 2k
* **コントリビューター:** 72名以上 ([Contributors](/drawdb-io/drawdb/graphs/contributors))
* **主要言語:** JavaScript (98.8%)
* **関連トピック:** react, javascript, svg, editor, sql, sql-server, sqlite, postgresql, mariadb, indexeddb, erd, database-schema, hacktoberfest, oracle-database, diagram-editor, tailwindcss, erdiagram

**はじめ方 (ローカル開発):**

1. リポジトリをクローン: `git clone https://github.com/drawdb-io/drawdb`
2. ディレクトリ移動: `cd drawdb`
3. 依存関係インストール: `npm install`
4. 開発サーバー起動: `npm run dev`

**ビルド:**

1. 上記1-3を実行
2. ビルドコマンド実行: `npm run build`

**Dockerビルド:**

1. Dockerイメージビルド: `docker build -t drawdb .`
2. コンテナ実行: `docker run -p 3000:80 drawdb`

**視覚的要素について:**
リポジトリのREADMEには、drawDBのロゴ画像 ([icon-dark.png](/drawdb-io/drawdb/raw/main/src/assets/icon-dark.png)) とデモ画像 ([drawdb.png](/drawdb-io/drawdb/raw/main/drawdb.png)) が含まれていますが、現在の環境ではこれらの画像を直接表示することはできません。必要であれば、提供されたリンクから画像を確認してください。

**重要な点:**

* drawDBは、**無料**で**直感的**な操作が可能なオンラインデータベース設計ツールです。
* 主要なデータベースに対応した**SQL生成機能**を備えています。
* **ローカル環境**や**Docker**での実行も可能です。
* ファイル共有機能はオプションであり、別途サーバー設定が必要です。

---
