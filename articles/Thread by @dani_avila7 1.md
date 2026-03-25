---
title: "Thread by @dani_avila7"
source: "https://x.com/dani_avila7/status/2036103229327790560?s=12"
author:
  - "[[Daniel San (@dani_avila7)]]"
published: 2026-03-23
created: 2026-03-25
description: "Claude Codeチームがコミュニティフィードバックを基に開発中の新しい/initコマンドの紹介スレッド。settings.jsonに環境変数を設定することで試用可能で、プロジェクトをインタビュー・スキャンし、CLAUDE.md・スキル・フックを自動セットアップする機能の詳細と実際のテスト結果を報告。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "Developer Tools"
  - "Automation"
  - "LLM"
---
**Daniel San** @dani\_avila7 [2026-03-23](https://x.com/dani_avila7/status/2036103229327790560)

The Claude Code team is testing a new /init built from community feedback

If you wanna try it just add this to your settings.json

"CLAUDE\_CODE\_NEW\_INIT": "1"

It interviews you, scans your codebase, and sets up CLAUDE.md, skills, and hooks automatically.

I tested it on a my repo, here's what happened 👇

![Image](https://pbs.twimg.com/media/HEGxGNSa0AA6gxk?format=jpg&name=large)

---

**Daniel San** @dani\_avila7 [2026-03-23](https://x.com/dani_avila7/status/2036103245362593917)

First it asks what you need

Project CLAUDE.md (team-shared, committed to git) or personal CLAUDE.local.md (gitignored, your private preferences).

Or both

![Image](https://pbs.twimg.com/media/HEGxHI7a4AA8JL5?format=jpg&name=large)

---

**Daniel San** @dani\_avila7 [2026-03-23](https://x.com/dani_avila7/status/2036103260743020801)

Then it asks if you want skills and hooks too

![Image](https://pbs.twimg.com/media/HEGxIEAakAAMQmK?format=jpg&name=large)

---

**Daniel San** @dani\_avila7 [2026-03-23](https://x.com/dani_avila7/status/2036103276194853363)

Here's where it gets interesting.

/init spawns an Explore agent that scans your entire codebase in parallel:

\- package.json, CI configs, manifests

\- Existing AI tool configs (.cursorrules, AGENTS.md)

\- Git worktrees, remotes

\- Formatter and linter setup

It reads your project

![Image](https://pbs.twimg.com/media/HEGxI8saEAAhCf_?format=jpg&name=large)

---

**Daniel San** @dani\_avila7 [2026-03-23](https://x.com/dani_avila7/status/2036103291579609424)

After scanning, it only asks what it couldn't figure out from code.

Commit conventions? Branch naming? Gotchas only you know?

It fills the gaps, nothing more.

![Image](https://pbs.twimg.com/media/HEGxJ3MbIAAo76t?format=jpg&name=large)

---

## 概要

Daniel San（@dani_avila7）が、Claude Codeチームがコミュニティからのフィードバックを基に開発中の**新しい `/init` コマンド**を紹介するスレッド。従来の `/init` と異なり、この新バージョンはユーザーにインタビューを行い、コードベースを並列スキャンした上で、`CLAUDE.md`・スキル・フックを自動的にセットアップする。`settings.json` に `"CLAUDE_CODE_NEW_INIT": "1"` を追加するだけで試用可能。

## 主要なトピック

### 新しい /init の有効化方法

- `settings.json` に以下を追加するだけで利用可能：
  ```json
  "CLAUDE_CODE_NEW_INIT": "1"
  ```
- Claude Codeチームがコミュニティフィードバックを反映してテスト中の機能

### ステップ1: ユーザーへのヒアリング

- まず**何が必要か**を質問する：
  - **Project CLAUDE.md** — チーム共有用（gitにコミット）
  - **Personal CLAUDE.local.md** — 個人用（gitignored、プライベート設定）
  - または**両方**
- ユーザーの意図に合わせて生成対象を決定

![ヒアリング画面](https://pbs.twimg.com/media/HEGxHI7a4AA8JL5?format=jpg&name=large)

### ステップ2: スキルとフックの確認

- **スキル**（Claude Codeの機能を拡張するSKILL.mdファイル）と**フック**（自動化ルール）も一緒にセットアップするか確認

![スキル・フック確認画面](https://pbs.twimg.com/media/HEGxIEAakAAMQmK?format=jpg&name=large)

### ステップ3: Exploreエージェントによる並列コードベーススキャン

- `/init` が **Exploreエージェント**を起動し、コードベース全体を**並列**でスキャン：
  - `package.json`、CI設定、マニフェスト
  - 既存のAIツール設定（`.cursorrules`、`AGENTS.md`）
  - Gitワークツリー、リモート
  - フォーマッター・リンターのセットアップ
- プロジェクトの構造・技術スタック・規約を自動的に読み取る

![コードベーススキャン](https://pbs.twimg.com/media/HEGxI8saEAAhCf_?format=jpg&name=large)

### ステップ4: コードから判別できない情報のみを質問

- スキャン後、**コードから自動判別できなかった項目だけ**をユーザーに質問：
  - コミットの慣習（Conventional Commits等）
  - ブランチ命名規則
  - 開発者だけが知っている注意点（Gotchas）
- 不足情報を補完するだけで、冗長な質問はしない

![追加質問画面](https://pbs.twimg.com/media/HEGxJ3MbIAAo76t?format=jpg&name=large)

## 重要な事実・データ

- **環境変数**: `CLAUDE_CODE_NEW_INIT` を `"1"` に設定することで新機能を有効化
- **生成対象**: `CLAUDE.md`（チーム共有）、`CLAUDE.local.md`（個人用）、スキル、フック
- **スキャン対象**: パッケージ管理ファイル、CI/CD設定、既存AI設定、Git情報、コードスタイル設定
- **著者**: Daniel San（@dani_avila7）— hedgineer.ioのHead of AI、Claude Codeテンプレートプロジェクト（500K+ダウンロード）の作者

## 結論・示唆

### 著者の評価

Daniel Sanは自身のリポジトリでこの新 `/init` を実際にテストし、その動作をステップバイステップでスクリーンショット付きで紹介している。従来の `/init` と比較して、よりインテリジェントで対話的なセットアップが可能になっている。

### 実践的な示唆

- Claude Codeを使っている開発者は `settings.json` に `"CLAUDE_CODE_NEW_INIT": "1"` を追加して試す価値がある
- 新しい `/init` はプロジェクト固有の設定を自動検出するため、手動で `CLAUDE.md` を書く手間が大幅に削減される
- チーム開発では `CLAUDE.md`（共有）と `CLAUDE.local.md`（個人）を分離できるため、チーム規約と個人設定を両立できる
- 既存の `.cursorrules` や `AGENTS.md` も読み取るため、他のAIツールからの移行もスムーズ

## 制限事項・注意点

- この機能はテスト段階であり、正式リリースではない（環境変数によるオプトイン方式）
- スレッドは5ツイートまでの内容が確認でき、追加のツイートがある可能性がある
- ソースがX（旧Twitter）のスレッドであるため、アクセス制限により全内容の確認が困難な場合がある

---

*Source: [Thread by @dani_avila7](https://x.com/dani_avila7/status/2036103229327790560)*