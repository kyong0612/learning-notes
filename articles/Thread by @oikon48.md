---
title: "【Day20】Auto-compact Bufferサイズ"
source: "https://x.com/oikon48/status/2002334161814573399"
author:
  - "Oikon (@oikon48)"
published: 2025-12-20
created: 2025-12-21
description: |
  Claude CodeのAuto-compact機能において、会話を自動圧縮するためのバッファ(Auto-compact Buffer)のサイズが環境変数CLAUDE_CODE_MAX_OUTPUT_TOKENSによってどのように変動するかを解説した投稿。デフォルト32kの設定でコンテキストウィンドウの22.5%を占有することを示している。
tags:
  - "Claude Code"
  - "Auto-compact"
  - "コンテキストウィンドウ"
  - "CLAUDE_CODE_MAX_OUTPUT_TOKENS"
  - "claude_code_advent_calendar"
---

## 概要

この投稿はClaude Codeアドベントカレンダーの20日目として、Auto-compact Bufferのサイズについて解説している。

## Auto-compact Bufferとは

Claude CodeでAuto-compactを有効にした時、会話を自動圧縮するためのバッファ（**Auto-compact Buffer**）が存在する。

このAuto-compact Bufferは、環境変数 `CLAUDE_CODE_MAX_OUTPUT_TOKENS` で変動する。

## 重要なポイント

| 設定値 | Autocompact Buffer | コンテキスト占有率 | 計算式 |
|--------|-------------------|-------------------|--------|
| 16000（16k） | 29.0k tokens | 14.5% | 13k(fixed) + 16k = 29k |
| 32000（32k）**デフォルト** | 45.0k tokens | 22.5% | 13k(fixed) + 32k = 45k |
| 64000（64k）**最大値** | 77.0k tokens | 38.5% | 13k(fixed) + 64k = 77k |

- **デフォルト値**: 32k（200kのコンテキストウィンドウの22.5%を占有）
- **最大値**: 64k（モデル概要に記載、コンテキストウィンドウの約40%がバッファで占有される）

### バッファサイズの計算式

```text
Auto-compact Buffer = 13k（固定値） + CLAUDE_CODE_MAX_OUTPUT_TOKENS
```

## Context Usageの内訳（参考）

画像で示された `/context` コマンドの出力例：

- **System prompt**: 2.8k tokens (1.4%)
- **MCP tools**: 17.8k tokens (8.9%)
- **Custom agents**: 1.6k tokens (0.8%)
- **Memory files**: 225 tokens (0.1%)
- **Messages**: 8 tokens (0.0%)

## モデル間の差異

Haiku、Sonnet、Opusのモデルによるバッファの差は**見られなかった**。

## 考察

64kが最大値だが、その場合コンテキストウィンドウの40%近くがバッファで占有されることを理解するべきである。

バッファサイズの選択は、以下のトレードオフを考慮する必要がある：

- **小さいバッファ**: より多くの会話履歴やコンテキストを保持できる
- **大きいバッファ**: Auto-compact処理の余裕が増えるが、実際に使えるコンテキストが減少

---

**投稿日時**: 2025年12月20日 20:04  
**閲覧数**: 13.9K  
**エンゲージメント**: 3 replies, 16 reposts, 145 likes, 103 bookmarks
