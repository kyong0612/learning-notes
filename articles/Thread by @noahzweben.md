---
title: "Claude Code Remote Control - Session Spawning アップデート"
source: "https://x.com/noahzweben/status/2032533699116355819?s=12"
author:
  - "[[@noahzweben]]"
published: 2026-03-13
created: 2026-03-15
description: |
  Claude Code Product ManagerのNoah Zwebenが、Remote Controlの新機能「Session Spawning」を発表。モバイルアプリから新しいローカルセッションを直接生成できるようになった。Max/Team/Enterpriseプラン（v2.1.74以降）で利用可能。
tags:
  - Claude Code
  - Remote Control
  - Session Spawning
  - Anthropic
  - モバイル開発
---

# Claude Code Remote Control - Session Spawning アップデート

ref: <https://x.com/noahzweben/status/2032533699116355819>

---

## 概要

Claude Code Product ManagerのNoah Zwebenが、2026年3月13日にRemote Controlの重要なアップデート「**Session Spawning**」を発表した。これにより、モバイルアプリから**新しいローカルセッション**を直接生成できるようになった。従来のRemote Controlは既存のターミナルセッションへの接続のみだったが、この機能追加でPCから離れた場所でも新規セッションを開始できる。

## 新機能: Session Spawning

### 使い方

1. ローカルマシンで `claude remote-control` を実行（サーバーモード）
2. モバイルアプリ（Claude for iOS/Android）から**新しいセッション**を生成

### 利用条件

| 項目 | 詳細 |
|------|------|
| **対象プラン** | Max, Team, Enterprise |
| **必要バージョン** | Claude Code v2.1.74 以降 |
| **前提条件** | モバイルでGitHubのセットアップが必要（今後緩和予定） |

### 新UIの体験

アップデート後（v2.1.74以降）の新しいUIでは、モバイルアプリからセッションを一覧・生成できる。ローカルに戻った際は、同じディレクトリから `/resume` コマンドで作業を再開可能。

![Session Spawning のモバイルUI](https://pbs.twimg.com/media/HDUBIZYXsAEUDCD?format=jpg&name=large)

### Session Spawningの技術的詳細

`claude remote-control` コマンドの `--spawn` フラグで2つのモードを選択できる：

- **`same-dir`**（デフォルト）: すべてのセッションが同じワーキングディレクトリを共有
- **`worktree`**: 各セッションが独自のgit worktreeを取得し、並列作業が可能

`--capacity <n>` フラグで最大同時セッション数を制限可能（デフォルト: 32）。

## Remote Control の仕組み（背景）

Remote Controlは、ローカルターミナル環境とClaudeモバイルアプリ/Webインターフェースを橋渡しする同期レイヤー。主な特徴：

- **ローカル実行**: コードはローカルマシン上で実行され続け、モバイルはリモートコントロール窓口
- **フル環境アクセス**: ファイルシステム、環境変数、MCPサーバーがすべて利用可能
- **マルチデバイス同期**: ターミナル・ブラウザ・モバイル間で会話が同期
- **自動再接続**: ラップトップのスリープやネットワーク切断時も自動で再接続

## コミュニティからのフィードバックとレスポンス

### プロジェクト選択の簡素化（@ShinghiD）

> Claude Codeが作業していたプロジェクトを記憶し、フォルダやロケーションを保存して、クリックで選択できるようにできないか？

**Noah Zwebenの回答**: 素晴らしいフィードバックであり、引き続き簡素化を進めていく。

### モバイルからのスラッシュコマンド（@lazy_proc）

> モバイルからスラッシュコマンドは使えるようになったか？

**Noah Zwebenの回答**: 現在開発中。

## 今後の開発予定

- **セッション開始時間の高速化**: 現在取り組み中
- **GitHubセットアップ要件の緩和**: 近日中に予定
- **モバイルからのスラッシュコマンド対応**: 開発中
- **プロジェクト選択UIの簡素化**: フィードバックに基づき改善予定
- **安定性向上**: 継続的に改善中

## 制限事項

- Remote Controlはローカルプロセスとして動作するため、ターミナルを閉じるとセッションが終了する
- ネットワーク切断が約10分以上続くとセッションがタイムアウトする
- 現時点でモバイルでのGitHubセットアップが必要（緩和予定）
- モバイルアプリも最新版へのアップデートが必要

## 関連リンク

- [Claude Code Remote Control 公式ドキュメント](https://code.claude.com/docs/en/remote-control)
- [GitHub Issue #28420: Allow remote control from your phone of new sessions](https://github.com/anthropics/claude-code/issues/28420)
- [VentureBeat: Anthropic just released a mobile version of Claude Code called Remote Control](https://venturebeat.com/orchestration/anthropic-just-released-a-mobile-version-of-claude-code-called-remote)

---

## 元スレッドの全文

**Noah Zweben** @noahzweben [2026-03-13](https://x.com/noahzweben/status/2032533699116355819)

Remote Control - Session Spawning:

Run claude remote-control and then spawn a NEW local session in the mobile app.

\* Out to Max, Team, and Enterprise (>=2.1.74)

\*Have GH set up on mobile (relaxing soon)

\* Working on speeding up session start-time

---

**Noah Zweben** @noahzweben [2026-03-13](https://x.com/noahzweben/status/2032533700739514589)

This is what the new experience (if you're gated in, update >= 2.1.74) will look like:

To pick up the work locally, you can /resume from them same directory. We're working on making this process even better.

We've also continued to make stability improvements!

![Image](https://pbs.twimg.com/media/HDUBIZYXsAEUDCD?format=jpg&name=large)

---

**Noah Zweben** @noahzweben [2026-03-13](https://x.com/noahzweben/status/2032534312310952249)

Oh -- update your mobile app too :)

---

**Shinghi** @ShinghiD [2026-03-13](https://x.com/ShinghiD/status/2032583664983556113)

Can you make this even simpler? Where Claude Code knows all the different projects you've been working on. It knows the folders and locations, so it just stores those, and you can click into which project you want to work in, either the whole computer or a specific folder, and it

---

**Noah Zweben** @noahzweben [2026-03-13](https://x.com/noahzweben/status/2032583799238963500)

great feedback and we will absolutely keep streamlining this

---

**lazy\_procrastinator** @lazy\_proc [2026-03-13](https://x.com/lazy_proc/status/2032556807793815898)

slash commands from mobile - do they work now?

---

**Noah Zweben** @noahzweben [2026-03-13](https://x.com/noahzweben/status/2032559051570020642)

working on that :)

---

**Ovi Bodea** @ovidbme [2026-03-13](https://x.com/ovidbme/status/2032565739404619906)

nothing like a 2am demo recording