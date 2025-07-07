---
title: "初学者でも今すぐできる、Claude Codeの生産性を10倍上げるTips"
source: "https://speakerdeck.com/s4yuba/chu-xue-zhe-demojin-sugudekiru-claude-codenosheng-chan-xing-wo10bei-shang-gerutips"
author:
  - "Oikon"
published: 2025-07-05
created: 2025-07-07
description: |
  2025年7月5日に開催された「Claude Code 初学者 勉強会 2」の登壇資料です。
  https://currypurin-dojo.connpass.com/event/360112/
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "開発効率化"
  - "CLI"
---

本資料は、Claude Codeの初学者が生産性を10倍に向上させるための具体的なTipsを解説したスライドです。

![スライド1](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_0.jpg)

## 発表者について

* **名前**: Oikon (@gaishi_narou)
* **所属**: 外資IT企業, R&D
* **経歴**: エンジニア歴6年
* **Claude Code歴**: Claude 3.5から約1年使用。ツール作成、趣味開発、OSS分析などに活用。

![スライド2](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_1.jpg)

## 本資料で解説する9つのTips

本資料では、"CLAUDE CODE 10x productivity workflow" を参考に、すぐに試せる9つのTipsを紹介しています。

![スライド4](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_3.jpg)

### 1. IDE（VSCode, Cursor）統合

* **メリット**: 変更履歴の視覚化、慣れたエディタの使用、他のツール（Cursor, GitHub Copilot）との併用。
* **推奨**: CLIが苦手な人は、まずIDEで試すのがおすすめ。

![スライド5](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_4.jpg)

### 2. Plan モード (Shift + Tab 2回)

* **機能**: タスク実行前に実行計画を提示してくれる。
* **メリット**: 意図しない動作を防ぎ、必要に応じて計画を修正できる。
* **設定**: `settings.json`でデフォルトをPlanモードに設定可能。

![スライド6](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_5.jpg)

### 3. CLAUDE.md のメンテナンス

* **機能**: 起動時に読み込まれ、プロジェクトのルールや構造をClaude Codeに指示する。
* **ポイント**: 定期的に更新し、プロジェクトの構造や機能を記述する。公式リポジトリなどを参考にすると良い。

![スライド7](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_6.jpg)

### 4. `/clear`によるコンテキストの浄化

* **重要性**: コンテキストウィンドウ（作業メモリ, 200K）を効率的に使うことが重要。
* **実践**: 関係のないタスクは別セッションで行い、タスク終了後は`/clear`でコンテキストをクリーンにする。

![スライド8](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_7.jpg)

### 5. Thinkの拡張

* **機能**: `think`, `think hard`, `ultrathink`などで思考の深さを調整可能。
* **設定**: 環境変数 `MAX_THINKING_TOKENS` で思考トークン予算を増やすことができる。

![スライド9](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_8.jpg)

### 6. Permissionsの設定

* **機能**: `settings.json`で `allow` と `deny` を設定し、実行可能なコマンドを制御する。
* **推奨**: `rm -fr` など危険なコマンドを `deny` に設定しておく。ただし、過信は禁物。

![スライド10](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_9.jpg)

### 7. 最新知識・ドキュメントのInput

* **背景**: Claude Codeの知識は最新ではないため、追加情報が必要。
* **方法**:
  * ドキュメント（pdf, md）を直接与える。
  * WebSearchで検索させる。
  * MCPサーバー（Context7など）を活用する。

![スライド11](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_10.jpg)

### 8. Task (Subagent) の活用

* **機能**: Subagentが軽量なタスクを並列で実行する。
* **メリット**: 独自のコンテキストウィンドウを持ち、親agentのツールを利用可能。簡単なタスクは積極的に任せると良い。

![スライド12](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_11.jpg)

### 9. +α: Hooks の活用

* **機能**: Claude Codeのアクションを検知し、事前に定義した動作を自動実行する。
* **メリット**: ルールの強制、コンテキストサイズの縮小、拡張性の向上。
* **例**: タスク完了時に通知音を鳴らす、スクリプトを実行するなど。

![スライド13](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_12.jpg)

## さらに使いこなすためのキーワード

* Slash Command
* カスタム Slash Command
* MCPサーバー
* ヘッドレスモード
* Git Worktree
* `--dangerously-skip-permissions`
* CodeRabbit + `/pr-comments`
* Hooks
* JSON Output
* 音声入力（Aqua Voice）
* 著名エンジニアによるコンテキストの明示
* ccusage

![スライド14](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_13.jpg)

## まとめ

Claude Codeは多機能だが、全てを一度に覚える必要はない。まずは試せる機能から活用し、自分に合った使い方を見つけることが重要。

![スライド15](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_14.jpg)

## おすすめ資料

* [Claude Code Best Practices | Anthropic](https://docs.anthropic.com/claude/claude-code-best-practices)
* [How I Use Claude Code | Philipp Spiess](https://spiess.dev/claude-code)
* [Claude Code: Best Practices and Pro Tips - htdocs.dev](https://htdocs.dev/claude-code-best-practices-and-pro-tips)
* [ClaudeLog: Claude Code Docs, Guides & Best Practices](https://claude.log)
* [Claude Code を初めて使う人向けの実践ガイド - Zenn](https://zenn.dev/hathle/articles/claude-code-guide)
* [Claude Code 逆引きコマンド事典 - Zenn](https://zenn.dev/oikon/articles/93ba9f08ac6389)
* [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)

![スライド16](https://files.speakerdeck.com/presentations/88725bf4938d46b9bd51a2f7f6184419/slide_15.jpg)
