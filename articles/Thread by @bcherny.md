---
title: "Thread by @bcherny"
source: "https://x.com/bcherny/status/2010923222813065308"
author:
  - "Boris Cherny (@bcherny)"
published: 2026-01-13
created: 2026-01-15
description: "Claude Codeの生みの親であるBoris Chernyが、2024年末の社内ドッグフーディング開始からClaude Coworkローンチに至るまでの開発秘話を語るスレッド。エンジニアだけでなく、デザイナー、財務、セールスなど様々な職種がClaude Codeを活用し始めた経緯と、それがClaude Cowork誕生のきっかけになった経緯を紹介。"
tags:
  - "Claude Code"
  - "Claude Cowork"
  - "Anthropic"
  - "AI Agent"
  - "CLI"
  - "開発秘話"
  - "AIツール"
---

## 概要

このスレッドは、Anthropicのエンジニアである**Boris Cherny**（Claude Codeの開発者）が、Claude Code（当初はClaude CLI）の開発初期から**Claude Cowork**のローンチに至るまでの経緯を振り返った内容である。

## 主要ポイント

### 1. Claude Codeの誕生（2024年末）

- Boris Chernyは2024年末、Claude Code（当時はClaude CLI）の最初のバージョンを社内ドッグフーディング向けにローンチ
- 当時はSonnet 3.5の時代で、モデルはまだエージェンティックなコーディングに優れていなかった
- FileEditツールを追加したばかりで、まだ実用的ではないプロトタイプと考えていた
- しかし、同僚のRobertは既にCLIを使ってコードを書いたりgitを操作したりし始めていた
- Boris自身はメモ取りツールとして使っていたが、Robertの使い方を見てgitツールとしても使い始めた

### 2. 社内での急速な普及

数ヶ月後、Anthropicの多くのエンジニアとリサーチャーがClaudeを日常的に使用するようになった：

| 職種 | 使用用途 |
|------|----------|
| データサイエンティスト | 日常業務 |
| デザイナー | プロトタイプ作成、コンテンツ修正 |
| 財務担当 | モデル構築、財務予測 |
| セールス | Salesforce・BigQueryからのデータ分析 |

### 3. Claude Coworkの誕生

- コーディング以外の用途でClaude Agentを使いたい人が増えたことが明らかに
- これがClaude Coworkローンチの動機となった
- **注目**: Claude Coworkのコードは約1.5週間でClaude Codeによって「ほぼ完全に」書かれた（[参考](https://www.hindustantimes.com/trending/us/anthropics-new-ai-tool-cowork-was-written-fully-by-claude-code-says-creator-101768305849815-amp.html)）

### 4. Claude Coworkの特徴

| 項目 | 詳細 |
|------|------|
| 対象ユーザー | 非技術者、一般的な知識作業者 |
| 操作方法 | 自然言語での指示、フォルダへのアクセス権限付与 |
| 機能 | ファイルの読み取り・編集・作成・整理を自律的に実行 |
| 利用可能環境 | Claude Max購読者向け、macOSデスクトップアプリ（リサーチプレビュー） |

### 5. 便利なTips

パーミッションをすべてバイパスするコマンド：

```bash
claude --dangerously-skip-permissions
```

## コミュニティの反応

- **@oikon48**: Claude Codeをコーディング以外の用途でも使用しており、「同僚のような存在」と評価
- **@carmelo1up**: CLI版が最も気に入っているが、ProプランでOpusが利用できないことへの要望を表明

## 重要な示唆

1. **AIツールの用途は開発者の想定を超えて拡大する** - 当初コーディング用に作られたツールが、様々な職種で活用されるようになった
2. **「AIがAIを作る」時代の到来** - Claude CoworkがClaude Codeによって書かれたことは、人間の役割が高レベルな設計・監督・安全性確保にシフトしていることを示唆
3. **エージェンティックAIの民主化** - Coworkにより、CLIやプログラミングに馴染みのない人でも自律型AIエージェントの恩恵を受けられるようになった

---

## 元のスレッド

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010923222813065308)

It's late 2024, a few days after I launched the first version of Claude Code (then called Claude CLI) to team dogfooding. I walked into the office and saw my coworker Robert with a terminal up on his computer, Claude CLI running and a red/green diff view on screen.

I was surprised. This was back in the Sonnet 3.5 days, before the model was good at agentic coding. I had just given it a FileEdit tool the day before. Claude CLI was a prototype that I thought it wasn't useful for anything yet. But Robert was already starting to use it to write code & use git for him. I was still using the CLI as a note taker mostly, but I also started making it my go-to tool for using git as a result.

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010923224457203946)

A couple months later, many engineers & researchers at Anthropic were using Claude daily. There was one day I remember walking into the office and saw a Claude Code terminal up on our data scientist's computer monitor! I asked if he was trying out Claude Code, and was shocked to learn he was already using it for work.

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010923226093011272)

Over the next few months, this happened over and over. First our designer started using Claude Code for prototypes and content fixes, then our finance person used it to build models and do financial forecasting, Sales used it to analyze data from Salesforce and BigQuery.

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010923227854618754)

At some point all of this stopped being surprising. It became obvious that we should make it easier for people that want to use the Claude agent for things that are not coding. That's why we launched Claude Cowork today.

---

**Oikon** @oikon48 [2026-01-13](https://x.com/oikon48/status/2010924982906601766)

Recently I'm using Claude Code not only for coding but in more general ways. I really think Claude CLI as my coworker. I can't imagine life before I started using Claude Code. Best thanks to you and the team.

![Image](https://pbs.twimg.com/media/G-g9nP5bYAI7AHY?format=jpg&name=large)

---

**Ravikant Dewangan** @ronitkd [2026-01-13](https://x.com/ronitkd/status/2010960565553009100)

How do I bypass all the permissions on CLI? I have enough confidence and can allow CC to have all permissions on a folder?

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010961577738932366)

claude --dangerously-skip-permissions

---

**Rai** @RaiNausherwan [2026-01-13](https://x.com/RaiNausherwan/status/2010930490237194705)

What prompted Robert to use it though?

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010941058751066201)

I forced him to let me install it on his computer because he sat across from me

---

**melo** @carmelo1up [2026-01-13](https://x.com/carmelo1up/status/2010951388193599643)

I'm fan of Claude Code cli

But I discovered that Opus is not available with the Pro plan

Would be nice to have a limited allocation so that a user can plan a project with Opus, then execute it with Sonnet

I tried Code web, Claude os and iOS apps but the cli is still my fav

---

**Boris Cherny** @bcherny [2026-01-13](https://x.com/bcherny/status/2010954424357961754)

Landing now
