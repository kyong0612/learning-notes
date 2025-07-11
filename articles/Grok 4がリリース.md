---
title: "Grok 4がリリース"
source: "https://blog.lai.so/grok-4-intro/"
author:
  - "laiso"
published: 2025-07-10
created: 2025-07-11
description: |
  xAIのGrok 4が公開されました。コンテキストウィンドウは256,000トークンで、Claude 4 Sonnetを上回ります。コーディング性能も高く、複数の方法で試すことができます。
tags:
  - "Grok"
  - "xAI"
  - "AIモデル"
  - "LLM"
  - "Cursor"
---

xAIのGrok 4が公開されました。

> Introducing Grok 4, the world's most powerful AI model. Watch the livestream now: <https://t.co/59iDX5s2ck>
>
> — xAI (@xai) July 10, 2025

## モデルカード

コンテキストウィンドウは256,000トークンで、Claude 4 Sonnetの200,000トークンを上回ります。

![](https://blog.lai.so/content/images/2025/07/image-5.png)

詳細は公式ドキュメントで確認できます。
[Models / Grok 4](https://docs.x.ai/docs/models/grok-4-0709)

## 「Grok 4 Code」とは

「Grok 4 Code」は、Grok 4ファミリーに含まれるコーディングに特化したモデルの名前です。これはClaude CodeのようなCLIツールではなく、OpenAIのCodexに相当するものです。Redditの情報によると、将来的にはCursorで利用可能になる可能性が示唆されています。

> [Grok 4 - Reddit](https://www.reddit.com/r/grok/comments/1lphwbb/grok_4/)

## 評価

### 知識のカットオフ

モデルの知識がいつまでかを調べるため、「React Routerの最新バージョンは？」という質問をAPI経由で送信しました。ツール使用は無効にしています。

> 私の知識は2023年9月までの情報に基づいています。その時点でのReact Router（および関連パッケージであるreact-router-dom）の最新安定バージョンは**6.15.0**でした。

### コーディング能力

Cursorを使い、ExercismのTypeScript問題（難易度高め）を3つ解かせました。

* **React**: 1ターンで合格
* **Bowling**: 1ターンで合格
* **Wordy**: 3回のテスト実行とデバッグを経て合格

この結果は、Claude Codeと同等かそれに近い性能を持つことを示唆しています。実際のプルリクエストは以下で確認できます。

[Grok 4: grok-eval-mini-3 by laiso · Pull Request #14 · laiso/exercism-typescript](https://github.com/laiso/exercism-typescript/pull/14)

![](https://blog.lai.so/content/images/thumbnail/14)

## Grok 4を試す方法

有料プラン「SuperGrok」($30.00/月)以外にも、以下の方法で試すことができます。

### 1. Open Router

WebチャットとAPIで利用できます。5ドルのデポジットが必要です。
[https://openrouter.ai/chat?models=x-ai/grok-4](https://openrouter.ai/chat?models=x-ai/grok-4)

### 2. Cursor

IDEのモデル選択にGrok 4が追加されています。Cursor Pro（月20ドル）のサブスクリプションが必要です。

### 3. xAI Cloud Console

API経由での利用が可能です。5ドルのデポジットが必要です。Copilotや他のツールと連携したい開発者向けです。
[https://console.x.ai/](https://console.x.ai/)
