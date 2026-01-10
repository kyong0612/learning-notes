---
title: "Claude Code code-simplifier Subagentsの公開"
source: "https://x.com/oikon48/status/2009452552958742751?s=12"
author:
  - "Oikon (@oikon48)"
published: 2026-01-09
created: 2026-01-10
description: |
  Claude Codeチームが内部で使用しているcode-simplifier Subagentsがオープンソースとして公開された。Plugin marketplace経由でインストール可能となり、コードの簡素化・リファクタリングをAIエージェントに依頼できるようになった。
tags:
  - "Claude Code"
  - "AI"
  - "plugin"
  - "code-simplifier"
  - "subagent"
  - "Anthropic"
  - "開発ツール"
---

## 概要

Claude Codeチームが内部で使用していた **code-simplifier Subagent** がオープンソースとして公開された。このサブエージェントはClaude Codeのプラグインマーケットプレイス経由でインストールでき、コードの簡素化やリファクタリングをAIに依頼する際に活用できる。

## インストール方法

### ターミナルから直接インストール

```bash
claude plugin install code-simplifier
```

### Claude Codeセッション内からインストール

```
/plugin marketplace update claude-plugins-official
/plugin install code-simplifier
```

## 使用方法

インストール後、Claude Codeに対して「code simplifierを使って」と依頼することで、このサブエージェントを活用できる。

## 公式アナウンス

> **2026-01-09**
> 
> We just open sourced the code-simplifier agent we use on the Claude Code team.
> 
> Try it: claude plugin install code-simplifier
> 
> Or from within a session:
> 
> /plugin marketplace update claude-plugins-official
> 
> /plugin install code-simplifier
> 
> Ask Claude to use the code simplifier

### 添付画像

![code-simplifierの使用例1](https://pbs.twimg.com/media/G-MB_RyaQAA49Hj?format=jpg&name=large)

![code-simplifierの使用例2](https://pbs.twimg.com/media/G-MAcDwa0AEk3gx?format=png&name=large)

## コミュニティの反応

### @oikon48 の実践レポート

> 早速 code-simplifier Subagentsを試してみてる👀

![code-simplifier実践中のスクリーンショット](https://pbs.twimg.com/media/G-MJeGcbkAAIWeE?format=jpg&name=large)

コミュニティからは「Public service」「nice👍」といった好意的な反応が寄せられている。

## ポイント

- **公式ツールのオープンソース化**: Claude Codeチームが実際に使用しているツールが一般公開された
- **簡単なインストール**: コマンド1つでインストール可能
- **Subagentアーキテクチャ**: Claude Codeのプラグインシステムを活用したサブエージェント機能

## 関連リンク

- [元ツイート](https://x.com/oikon48/status/2009452552958742751)
- [フォローアップツイート](https://x.com/oikon48/status/2009460871274352678)