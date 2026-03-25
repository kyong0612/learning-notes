---
title: "Thread by @trq212"
source: "https://x.com/trq212/status/2035799806640115806?s=12"
author:
  - "[[@trq212]]"
published: 2026-03-05
created: 2026-03-25
description: "Claude Codeの /init コマンドの新バージョンについてのスレッド。ユーザーフィードバックに基づき、リポジトリをスキャンしてインタビュー形式でCLAUDE.MD・hooks・skillsなどの設定をサポートする機能が追加された。環境変数フラグで有効化可能。"
tags:
  - "Claude Code"
  - "init"
  - "開発ツール"
  - "AIエージェント"
  - "設定自動化"
---

# Claude Code `/init` コマンドの新バージョン

## 概要

Anthropic の Claude Code チームの Thariq（@trq212）が、ユーザーフィードバックに基づいて開発された `/init` コマンドの新バージョンについて紹介したスレッド。新バージョンでは、対話的なインタビュー形式でリポジトリの Claude Code 設定（CLAUDE.MD、hooks、skills など）をセットアップできるようになった。

## 新 `/init` の主な特徴

### 有効化方法

環境変数フラグを設定して Claude Code を起動する：

```bash
CLAUDE_CODE_NEW_INIT=1 claude
```

起動後、任意のリポジトリで `/init` を実行するだけで利用可能。

### 動作の仕組み

- **リポジトリスキャン**: リポジトリの構造を自動的にスキャンする
- **インタビュー形式**: 数ラウンドの質問を通じて設定内容を決定する
- **設定対象**: CLAUDE.MD、hooks、skills などの Claude Code 設定ファイルを生成・更新

### 対応範囲

- **新規プロジェクト**: 新しいリポジトリでの初期セットアップ
- **既存プロジェクト**: クローンした既存リポジトリへの設定追加にも対応

## コミュニティからのQ&A

| 質問 | 回答 |
|------|------|
| 他のプロジェクトからスキルやエージェントをインポートできるか？ | 現時点ではそのような仕組みではない |
| リポジトリ構造をスキャンするのか、質問だけか？ | リポジトリをスキャンし、数ラウンドの質問がある |
| 新規プロジェクトだけか、既存のクローンにも使えるか？ | 両方に対応 |
| `/init` はカスタマイズ可能か？ | チームメンバー向けのカスタマイズについて確認中 |

## その他のトピック

### コンテキストウィンドウに関する質問

コミュニティメンバー @Gerry から、Claude Code の 100 万トークンコンテキストウィンドウが 200K に戻っているという報告がスクリーンショット付きで投稿された。

![Image](https://pbs.twimg.com/media/HECegrSacAEBuZn?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HECegoCWkAETe_H?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HECegoYXIAAAdZa?format=jpg&name=large)

## クレジット

@IsabellaKHe と @karan_sampath が開発を主導。大量のカスタマーフィードバックに基づいて設計されている。

---

## 原文スレッド

**Thariq** @trq212 2026-03-05

we're testing a new version of /init based on your feedback- it should interview you and help setup skills, hooks, etc.

you can enable it with this env\_var flag:

CLAUDE\_CODE\_NEW\_INIT=1 claude

would love your feedback!

> 2026-03-05
> 
> I want to make /init more useful- what do you think it should do to help setup Claude Code in a repo?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035801140940410886)

to give a bit more info:

/init helps setup your Claude Code config in a new or existing repo (Claude.MD, hooks, skills, etc)

once you start Claude with the flag above, you just need to run /init in the repo of your choice

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035811026101322226)

thanks to @IsabellaKHe and @karan\_sampath for driving this! it's been informed by a ton of customer feedback that they're very close to

---

**Artem Rybachuk** @razRBCHK [2026-03-22](https://x.com/razRBCHK/status/2035801437586731211)

Guys, stop working on weekends. You're not resting yourselves, and you're dragging the rest of us into it too 😂

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035801719095844924)

hahaha I'm just doing this post

---

**iamrobotbear (bk)** @iamrobotbear [2026-03-22](https://x.com/iamrobotbear/status/2035800204080021644)

Ooh, this is exciting. I have some thoughts I'll share later today.

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035800356303552920)

please!

---

**Zouhair** @Zouhair\_\_m [2026-03-22](https://x.com/Zouhair__m/status/2035800182642634961)

Will we be able to import skills/agents from other projects during the init?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035800776858104262)

not currently how it works!

---

**Savaer** @savaerx [2026-03-22](https://x.com/savaerx/status/2035801146132980170)

tested /init last week, setup always felt like guessing without a config. interview approach makes way more sense. does it scan the repo structure or just ask raw questions?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035801258066317591)

scans the repo, there are a few round of questions

---

**Rene Faurskov** @renefaurskov [2026-03-22](https://x.com/renefaurskov/status/2035800392156483871)

Is it only for initiating a new project, or also when fx cloning an existing?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035800455775699267)

both!

---

**Dustin Goerndt** @thorstone137 [2026-03-22](https://x.com/thorstone137/status/2035811279869259928)

Can /init be customized?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035811603652788405)

like for your team members?

---

**Louis LAURENT** @louislaurent [2026-03-22](https://x.com/louislaurent/status/2035800095749238854)

When do you guys sleep Thariq?

---

**Thariq** @trq212 [2026-03-22](https://x.com/trq212/status/2035800306043220010)

tbh this has been out for a few days, I just didn't get time to post this last week

---

**gerry** @Gerry [2026-03-22](https://x.com/Gerry/status/2035801318665683391)

Why isn't the 1 million context window active anymore? Claude Code has reverted back to 200K context?

![Image](https://pbs.twimg.com/media/HECegrSacAEBuZn?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HECegoCWkAETe_H?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HECegoYXIAAAdZa?format=jpg&name=large)
