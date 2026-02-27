---
title: "No config? No problem. Just `wrangler deploy`"
source: "https://developers.cloudflare.com/changelog/post/2026-02-25-wrangler-autoconfig-ga/"
author:
  - "[[Cloudflare Docs]]"
published: 2026-02-25
created: 2026-02-27
description: "Wrangler 4.68.0以降、設定ファイルなしでも wrangler deploy を実行するだけで、フレームワークの自動検出・アダプター導入・デプロイが完了する自動設定機能がGA（一般提供）になった。Cloudflareダッシュボードからのリポジトリ接続時には自動PRも生成される。"
tags:
  - "clippings"
  - "Cloudflare"
  - "Workers"
  - "Wrangler"
  - "DevOps"
  - "Serverless"
---

## 概要

Wrangler 4.68.0 から、**設定ファイル（`wrangler.jsonc`）がなくても `wrangler deploy` を実行するだけで Cloudflare Workers にデプロイできる**自動設定機能が一般提供（GA）となった。2025年12月に実験的機能として導入されたものが、デフォルト動作に昇格した。

## ローカルでの使い方

```sh
npx wrangler deploy
```

設定ファイルのないプロジェクトで `wrangler deploy` を実行すると、Wrangler は以下を自動的に行う：

1. `package.json` からフレームワークを**自動検出**
2. 検出した設定内容の**確認プロンプト**を表示
3. 必要な**アダプターをインストール**
4. `wrangler.jsonc` **設定ファイルを自動生成**
5. Cloudflare Workers に**デプロイ**

### 補助コマンド

- **`wrangler setup`** — デプロイせずに設定のみ行う
- **`--yes` フラグ** — プロンプトをスキップして自動承認

## Cloudflare ダッシュボードからの利用

Workers ダッシュボードからリポジトリを接続すると：

- 必要なファイルを含む**プルリクエストが自動生成**される
- マージ前に確認できる**プレビューデプロイメント**が作成される

> **注意**: 自動PRが生成されるのはデプロイコマンドが `npx wrangler deploy` の場合のみ。カスタムデプロイコマンドを使用する場合、自動設定は動作するがPRは作成されない。

## 背景と経緯

| 時期 | 内容 |
|---|---|
| 2025年12月 | 自動設定機能を実験的機能として導入 |
| 2026年2月25日 | GA（一般提供）に昇格、デフォルト動作に |

## 重要ポイント

- **対象バージョン**: Wrangler 4.68.0 以降
- **ゼロコンフィグ**: 既存のどのプロジェクトでも設定ファイルなしでデプロイ可能
- **フレームワーク自動検出**: `package.json` を解析して適切なアダプターを自動インストール
- **ダッシュボード連携**: リポジトリ接続時に自動PRとプレビューデプロイを提供
- **フィードバック**: 問題や質問は [GitHub discussion](https://github.com/cloudflare/workers-sdk/discussions/11667) で受付中