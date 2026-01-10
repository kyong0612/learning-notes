---
title: "Claude Code on the Web で GitHub CLI (gh) を利用する方法"
source: "https://x.com/oikon48/status/2009097744594686421?s=12"
author:
  - "Oikon (@oikon48)"
published: 2026-01-08
created: 2026-01-10
description: |
  Claude Code on the Web のリモート環境で GitHub CLI (gh) を利用するための設定方法。CLAUDE_CODE_REMOTE 環境変数と sessionStartHooks を活用して、リモートセッション開始時に gh を自動インストールする回避策を解説。
tags:
  - "Claude Code"
  - "GitHub CLI"
  - "CLAUDE_CODE_REMOTE"
  - "sessionStartHooks"
  - "リモート環境"
---

## 概要

Claude Code on the Web（リモート環境）では、GitHub CLI (`gh`) がデフォルトでインストールされていない。このツイートでは、リモート環境で `gh` コマンドを利用するための回避策が紹介されている。

---

## 問題点

- Claude Code on the Web（リモートSandbox環境）には、`gh`（GitHub CLI）がプリインストールされていない
- そのままでは GitHub リポジトリの操作（Issue作成、PR作成、認証など）を `gh` コマンド経由で行えない

---

## 解決策

### 1. CLAUDE_CODE_REMOTE 環境変数を使用

`CLAUDE_CODE_REMOTE` はClaude Code on the Webに用意された環境変数で、リモート環境かローカル環境かを判定できる。

### 2. sessionStartHooks でインストール処理を実行

Session Start Hooksを利用することで、Claude Codeのセッション開始時に任意のスクリプトを自動実行できる。これを利用して `gh` のインストール処理を呼び出す。

### 3. カスタムSandboxの設定

`GITHUB_API_KEY`（GitHub認証用トークン）を設定したカスタムSandboxが必要。これにより、インストールされた `gh` コマンドで GitHub API に認証付きアクセスが可能になる。

---

## 実装イメージ

ツイートに添付された画像から、設定の概要を確認できる：

![Image](https://pbs.twimg.com/media/G-G_X6pbsAEUeD1?format=png&name=large)

---

## 関連情報

Claude Code on the Webのリモート環境限定Setupについては、以下の設定方法も参考になる：

- `session-start-hook` がリモート環境にはグローバル設定で用意されている
- これを利用することで、リモート環境限定で起動するHooksの作成が容易になる

---

## 注意点

- この方法はあくまで回避策であり、公式にサポートされた方法ではない可能性がある
- `GITHUB_API_KEY` を含むカスタムSandboxの設定が必須
- セキュリティ上、API Keyの管理には十分な注意が必要

---

## 元ツイート

**Oikon** @oikon48 [2026-01-08](https://x.com/oikon48/status/2009097744594686421)

> ghはデフォルトではInstallされていないので、CLAUDE\_CODE\_REMOTE という変数でremote環境かチェックして、sessionStartHooksで呼び出してインストールさせれば可能です。
>
> GITHUB\_API\_KEYを設定したカスタムsandboxが必要ですが。