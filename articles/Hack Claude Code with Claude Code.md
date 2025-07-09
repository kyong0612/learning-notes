---
title: "Hack Claude Code with Claude Code"
source: "https://speakerdeck.com/choplin/hack-claude-code-with-claude-code"
author:
  - "Akihiro Okuno"
published: 2025-07-08
created: 2025-07-09
description: |
  Claude Code Meetup Japan #1での発表資料。「Claude CodeでClaude Codeをハックする 〜自作ツールで開発体験を加速する〜」と題し、Claude Codeの体験を進化させるための3つのアプローチ（CLAUDE.mdのレビュー、スラッシュコマンド、自作ツール）を紹介しています。
tags:
  - "Claude Code"
  - "AI"
  - "AI Agent"
  - "CLI"
  - "Developer Experience"
---

## 概要

本資料は、Akihiro Okuno氏による「Claude CodeでClaude Codeをハックする 〜自作ツールで開発体験を加速する〜」と題したプレゼンテーションです。AI駆動開発におけるClaude Codeの活用法、特にCLIとしての拡張性を活かして開発体験を向上させるための3つの具体的なアプローチ（CLAUDE.md、スラッシュコマンド、自作ツール）について解説しています。

---

## プレゼンテーション内容

### イントロダクション

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_0.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#1)

* **発表者**: 奥野 晃裕 (Akihiro Okuno) 氏、株式会社Scalar所属。
* **Claude Code歴**: 2025年6月にClaude Maxで利用を開始し、「Vibe Coding」に熱中。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_1.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#2)

### Claude Codeのすごさ

Claude Codeが持つ3つの強力な特徴が挙げられています。

1. **Opus 4の自走力**: 高度な推論能力と実装力。
2. **エージェントとしての自律性**: 計画、実行、修正を自動化。
3. **CLIの親和性**: 既存の開発フローに容易に統合でき、月額固定料金でコストを気にせず利用可能。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_2.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#3)

### AI駆動開発のパラダイムシフトと重要なこと

開発の主役が人間からAIへと移り変わるパラダイムシフトが提示されています。

* **従来**: 人間がメイン、AIがサポート
* **現在**: AIがメイン、人間がサポート

この新しい開発スタイルでは、**人間が「何を作るか」を決定**し、**AIが「どう作るか」を実装**する役割分担と、両者の**非同期化**が重要であると述べられています。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_3.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#4)
[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_4.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#5)

### Claude Code体験を進化させる3つのアプローチ

CLIの強みである「拡張性」を活かし、「Claude CodeでClaude Codeをハックする」ための3つの具体的なアプローチが紹介されました。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_5.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#6)
[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_6.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#7)

#### ハック1: CLAUDE.mdのレビュー

* `CLAUDE.md`は、グローバルまたはプロジェクト単位の"メモリ"として機能し、Claude Code起動時に読み込まれます。
* **向いている用途**: コーディング規約、プロジェクト構造、頻繁に使う操作の共有。
* **向いていない用途**: 複雑な条件分岐（例：「〇〇のときは〇〇して」）。これらは**Hooks**の使用が推奨されます。
* **活用法**: `"CLAUDE.mdの〇〇というルールが守られていないので改善して"`のように、Claude Code自身にレビューを依頼できます。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_7.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#8)

#### ハック2: スラッシュコマンド

* その場で使える即席の指示で、`CLAUDE.md`よりも複雑な指示に対応可能です。
* コマンドは `~/.claude/commands/` ディレクトリに配置します。
* **メタコマンドによる改善ループ**:
    1. `/create-command`: スラッシュコマンド自体を作成するコマンド。
    2. `/revise-command`: 直前に実行したコマンドを修正するコマンド。
* **実例**: `improve-command` は、直前のコマンドの実行結果を分析し、改善点を特定して自動で書き換えるという自己改善型のコマンドです。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_8.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#9)

#### ハック3: 自作ツール

* AIエージェント開発はまだ黎明期であり、標準的なワークフローを自身で構築する必要があります。
* **ツール作成のメリット**:
  * 繰り返しの作業を自動化。
  * 自分だけのベストプラクティスを探索。
  * ツール作成を通じて新たな改善点を発見。
* Claude Codeはエディタやターミナルの知識が豊富なため、アイデアから実装までのプロセスが高速化します。

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_9.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#10)

### 作成したツール紹介

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_10.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#11)
[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_11.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#12)

* **cclog**: Claude Codeのセッションログを管理・検索・再開できるCLIツール (Shell + Python + fzf)。
* **code-review.nvim**: Neovimから直接Claude Codeにレビューを依頼できるプラグイン (Neovim Lua API)。
* **amux (WIP)**: `git worktree`と`tmux`を組み合わせた並列作業環境を管理するMCPツール (Go + MCP)。
* **mcp-gemini-cli**: Claude CodeからGeminiを呼び出すためのシンプルなMCP実装 (MCP, 約100行)。

### まとめ

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_12.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#13)

最高の開発体験を自ら作り出すために、Claude Codeをハックする3つのアプローチが改めて強調されました。

1. **CLAUDE.mdのレビュー**で基礎を固める。
2. **スラッシュコマンド**で即座に拡張する。
3. **自作ツール**で本格的な効率化を図る。

### 今後の展望（おまけ）

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_13.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#14)

* `CLAUDE.md`の遵守率の定量化
* ドキュメントと実装の乖離チェック
* Hooksのサンドボックス環境
* Hooksを起点としたワークフロー管理
* Claude Codeネイティブのプロジェクト管理GUI

[![](https://files.speakerdeck.com/presentations/aad979e1fd3b471aac60b39d0cf8a8b5/slide_14.jpg)](https://speakerdeck.com/choplin/hack-claude-code-with-claude-code#15)
