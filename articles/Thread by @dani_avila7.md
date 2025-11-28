---
title: "Claude Codeの/compactコマンドにカスタム指示を追加する方法"
source: "https://x.com/dani_avila7/status/1993797396241723505"
author:
  - "Daniel San (@dani_avila7)"
published: 2025-11-26
created: 2025-11-28
description: |
  Claude Codeの/compactコマンドにカスタム指示を追加できる機能についての発見を共有するスレッド。コンテキストリセット時に重要な情報を保持するためのワークフロー改善方法と、claude-code-templatesツールを使用したセッション分析について解説。
tags:
  - "claude-code"
  - "ai-coding"
  - "productivity"
  - "context-management"
  - "developer-tools"
---

## 要約

このスレッドは、Claude Codeの`/compact`コマンドにカスタム指示を追加できる機能についてのDaniel San氏の発見と、コミュニティからの反応をまとめたものです。

### 主な発見

**`/compact`コマンドのカスタム指示機能**

- **以前の問題**: Claude Codeがチャットを要約する際、重要な詳細を見落とすことがあった
- **解決策**: `/compact`実行時に直接保持したい情報を指定できるようになった
- **実装時期**: コミュニティの反応によると、この機能は**Claude Codeのリリース当初から存在**していた（Day 0から）

### 関連ツール

**claude-code-templates**

Daniel San氏は以下のコマンドを使用して、要約に実際に何が含まれているかを確認しています：

```bash
npx claude-code-templates@latest --chats
```

このツールの機能：

- Claude Codeセッションを整理されたビューで表示
- 各会話の分析データを提供
- トークン数、ツールコール、キャッシュ効率、コストなどを可視化

### コミュニティからのベストプラクティス

| ユーザー | アプローチ |
|---------|-----------|
| **@Siddharth87** | 新しいコーディングセッション開始時に `plan.md` ファイルを作成し、コンテキストが埋まるにつれて更新 |
| **@selectstarkyle** | pre-compact hookを使用してtmpに書き込み、compact後のユーザーメッセージ送信時にアクティベート |
| **@saen_dev** | 以前は手動で「keep technical implementation details about X」と毎回書いていた |

### 重要な示唆

1. **機能の発見遅延**: 多くの開発者がClaude Codeの既存機能を見落としている可能性がある
2. **ツーリングの複雑さ**: @fred_pope氏のコメント「ツーリングだけで毎日数時間費やしている」が示すように、AIコーディングツールの習熟には相当な時間投資が必要
3. **コンテキスト管理の重要性**: デバッグセッション中に特定のコンテキストパターンを保持することの価値

### 画像

![Claude Code /compact with custom instructions](https://pbs.twimg.com/media/G6tjwKAWgAEhKI_?format=jpg&name=large)

---

## 元のスレッド

**Daniel San** @dani\_avila7 [2025-11-26](https://x.com/dani_avila7/status/1993797396241723505)

Claude Code team ships fast! 👏

Just discovered you can add custom instructions to /compact

No idea how long this has been there but it's exactly what I needed.

\- Before: Claude would summarize the chat and sometimes miss critical details I wanted to keep.

\- Now: Just add what's important directly when you /compact

I still use:

npx claude-code-templates@latest --chats

To peek at what's actually in the summary, but this makes the whole context reset way more reliable.

Probably been there for weeks and I just noticed 🤷🏽‍♂️

![Image](https://pbs.twimg.com/media/G6tjwKAWgAEhKI_?format=jpg&name=large)

---

**MordReal** @m2oba [2025-11-26](https://x.com/m2oba/status/1993814640938373408)

It’s been there since day 0

---

**Daniel San** @dani\_avila7 [2025-11-26](https://x.com/dani_avila7/status/1993817020593496369)

Are you sure? I’ve never seen that in the Claude Code UI…

if it’s really there, I seriously need to reassess how closely I’ve been paying attention lol 🤣

---

**John** @johnblythe [2025-11-27](https://x.com/johnblythe/status/1994112828605596041)

What’s the latest chats thing do? Kinda like a git log —pretty or something but for the recent prompts?

---

**Daniel San** @dani\_avila7 [2025-11-27](https://x.com/dani_avila7/status/1994124744246088098)

The chat command shows all your Claude Code sessions in an organized, easy-to-navigate view.

Plus, you get analytics for each conversation.​​​​​​​​​​​​​​​​

> 2025-11-01
>
> Claude Code session analytics (Beta)
>
> Just shipped a new feature to claude-code-templates
>
> Try it running:
>
> npx claude-code-templates@latest --chats
>
> Now you can see exactly what's happening under the hood in your Claude Code sessions - tokens, tool calls, cache efficiency, costs,

---

**Iggy** @ignacioaal [2025-11-26](https://x.com/ignacioaal/status/1993816630468694123)

it's been possible since launch

---

**Lyceum** @LyceumCloud [2025-11-27](https://x.com/LyceumCloud/status/1993911502345208003)

Yeah that switch to custom instructions is Cool!

---

**Sid Bharath** @Siddharth87 [2025-11-27](https://x.com/Siddharth87/status/1993883371190342139)

It’s always been there

Even so, I’ve always found compacting a bit wonky, even with custom instructions. When I start a new coding session, I have it create a <http://plan.md> file (which it does now automatically) and then as context fills up, it updates the plan and I

---

**Kyle | @SelectStarKyle** @selectstarkyle [2025-11-27](https://x.com/selectstarkyle/status/1993845818689028551)

I JUST made a pre compact hook write to tmp and activate at user message send post compact…this should solve it!

🫡

---

**Melvyn • Builder** @melvynxdev [2025-11-27](https://x.com/melvynxdev/status/1993837785892196666)

since the begginigng !

---

**Fred Pope** @fred\_pope [2025-11-27](https://x.com/fred_pope/status/1994126138264965503)

It's a full-time job to keep up rn. If I was to build my resume right now, one of the skills I would list would be CC, and it in and of itself is a monster.

I spend a few hours a day just on my tooling

---

**SIGKITTEN** @SIGKITTEN [2025-11-27](https://x.com/SIGKITTEN/status/1993858883312287849)

thats always been there bruh

---

**Saeed Anwar** @saen\_dev [2025-11-27](https://x.com/saen_dev/status/1994144147004133572)

wait custom instructions for /compact is huge. I've been manually writing "keep technical implementation details about X" after every compact. this saves so much friction when you're deep in a debugging session and need to preserve specific context patterns
