---
title: "Thread by @trq212"
source: "https://x.com/trq212/status/2005315275026260309?s=12"
author:
  - "[[@trq212]]"
published: 2025-12-28
created: 2025-12-31
description: "Claude Codeで大規模な機能を構築する際の仕様ベースのアプローチ。最小限の仕様から始めてAskUserQuestionToolを使ってClaudeにインタビューしてもらい、詳細な仕様を作成した後、新しいセッションで実装する方法について。"
tags:
  - "clippings"
  - "claude-code"
  - "開発手法"
  - "仕様駆動開発"
  - "ai-assisted-development"
---

## 要約

このスレッドでは、Thariq(@trq212)がClaude Codeを使った大規模機能開発のベストプラクティスを共有している。

### 主要な手法

**仕様ベースのアプローチ**:
1. 最小限の仕様やプロンプトから開始
2. ClaudeにAskUserQuestionToolを使ってインタビューしてもらう
3. 詳細な仕様が完成したら、新しいセッションで実装を実行

**推奨プロンプト**:
```
read this @SPEC.md and interview me in detail using the AskUserQuestionTool about literally anything: technical implementation, UI & UX, concerns, tradeoffs, etc. but make sure the questions are not obvious

be very in-depth and continue
```

### 重要な発見

- **質問の規模**: 大規模な機能や新規プロジェクトでは、Claudeが40問以上の質問をすることがあり、結果としてより詳細でコントロール可能な仕様が得られる
- **反響**: このツイートは7,500以上のブックマークを獲得し、開発者コミュニティから大きな関心を集めた
- **製品への統合**: Anthropicチームメンバー(Sid)から、この手法をplan modeに統合する可能性について言及があった

### コミュニティからのフィードバック

- **非技術者向けオンボーディング**: @seconds_0が非技術者向けのオンボーディングプロンプトを共有
- **UXの改善点**:
  - 質問のUXに改善の余地があることが指摘された
  - `/question`コマンドのような組み込みスラッシュコマンドの追加が提案された
  - CLAUDE.mdに`AskUserQuestionTool`を使うタイミングを追加することで、自動的に質問するよう設定できる

### 技術的なポイント

- このアプローチにより、開発者は実装の詳細を決定する前に、より包括的な仕様を作成できる
- 質問形式のインタラクションにより、見落としがちな技術的な考慮事項やトレードオフを明確化できる
- 仕様作成と実装を分離することで、各フェーズに集中できる

---

## 元のスレッド内容
**Thariq** @trq212 [2025-12-28](https://x.com/trq212/status/2005315275026260309)

my favorite way to use Claude Code to build large features is spec based

start with a minimal spec or prompt and ask Claude to interview you using the AskUserQuestionTool

then make a new session to execute the spec

![Image](https://pbs.twimg.com/media/G9ROmpcWgAIcamR?format=jpg&name=large)

---

**Thariq** @trq212 [2025-12-28](https://x.com/trq212/status/2005315277828096030)

for big features or new projects Claude might ask me 40+ questions and I end up with a much more detailed spec that I feel I had a lot of control over

---

**Thariq** @trq212 [2025-12-28](https://x.com/trq212/status/2005315279455142243)

the prompt I've been using is:

read this @SPEC.md and interview me in detail using the AskUserQuestionTool about literally anything: technical implementation, UI & UX, concerns, tradeoffs, etc. but make sure the questions are not obvious

be very in-depth and continue

---

**Thariq** @trq212 [2025-12-30](https://x.com/trq212/status/2006102901358256613)

7.5k bookmarks is crazy

---

**0.005 Seconds (3/694)** @seconds\_0 [2025-12-28](https://x.com/seconds_0/status/2005326295442596261)

Did you see my on-board non-technical interview prompt?

> 2025-12-26
> 
> Heres my "ask claude code to onboard a nontechnical user" prompt
> 
> \---------------------------
> 
> You are my dedicated software engineer. I am not technical, and that's perfectly fine - your job is to handle all technical decisions so I can focus on what I want, not how it works. x.com/the\_sigh\_op2/s…

---

**Thariq** @trq212 [2025-12-28](https://x.com/trq212/status/2005327684864540994)

ohhh this is great, yeah maybe this should be more part of how we do onboarding

---

**Sid** @sidbidasaria [2025-12-29](https://x.com/sidbidasaria/status/2005478857097572508)

should we add this to plan mode? 🤔

---

**Thariq** @trq212 [2025-12-29](https://x.com/trq212/status/2005479835460898825)

lmao I may have a PR for you to look at soon

---

**SIGKITTEN** @SIGKITTEN [2025-12-28](https://x.com/SIGKITTEN/status/2005368981667164275)

have u experimented with having it revise the questions after any of them are answered manually? i feel like often it becomes a bit of a conversation

---

**Thariq** @trq212 [2025-12-28](https://x.com/trq212/status/2005369303034700030)

yeah but I think this is a place where the question UX is a bit lacking, it's been on my radar to try and figure out

---

**Ryan Mather** @Flomerboy [2025-12-30](https://x.com/Flomerboy/status/2005865560882438294)

Is there a way to set up CC so that it knows to ask these questions on its own?

---

**Thariq** @trq212 [2025-12-30](https://x.com/trq212/status/2005866055197991340)

you can just add to your http://Claude.MD times to use the AskUserQuestion Tool

figuring out how to integrate this flow more into the product as well

---

**Will** @WillChilcutt [2025-12-29](https://x.com/WillChilcutt/status/2005456602468655180)

Why not add /question as a built-in CC slash command to make it more obvious users can ask Claude to use that tool? Of course now that I know I can add it on my side, but with it being so powerful, seems like a no-brainer to make it easier to call

---

**Thariq** @trq212 [2025-12-29](https://x.com/trq212/status/2005457595088441622)

yeah need to figure out the best way to put it into the product