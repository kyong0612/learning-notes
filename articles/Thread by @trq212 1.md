---
title: "Tool Search now in Claude Code"
source: "https://x.com/trq212/status/2011523109871108570?s=12"
author:
  - "Thariq (@trq212)"
published: 2026-01-15
created: 2026-01-16
description: |
  AnthropicがClaude CodeにMCP Tool Search機能をリリース。MCPサーバーが50以上のツールを持つ場合でも、動的にツールをロードすることでコンテキスト消費を削減する新機能。
tags:
  - "Claude Code"
  - "MCP"
  - "Anthropic"
  - "AI Agent"
  - "Tool Search"
---

## 概要

AnthropicのClaude Codeチームが、**MCP Tool Search**機能をリリースしたことを発表。MCPプロトコルの普及とエージェントの高性能化に伴い、MCPサーバーが50以上のツールを持ち、大量のコンテキストを消費するケースが増加していた課題に対応したもの。

## 主要ポイント

### Tool Searchの役割

Tool Searchにより、Claude Codeは**MCPツールがコンテキストを大量に消費する場合に、動的にツールをコンテキストにロード**できるようになった。

### 仕組み

- **検知**: MCPツールの説明がコンテキストの10%以上を使用する場合、Claude Codeが自動検知
- **トリガー**: 条件を満たすと、ツールは事前ロードではなく**検索経由でロード**される
- **互換性**: それ以外の場合は、MCPツールは従来通り動作

### 背景と問題意識

- GitHubで**最もリクエストされた機能の1つ**：MCPサーバーの遅延ロード（Lazy Loading）
- ユーザーから、7以上のサーバーを使用して**67k以上のトークン**を消費しているという報告があった

## 開発者向けガイダンス

### MCPサーバー開発者向け

- 基本的に既存の実装からの変更は不要
- ただし、**「server instructions」フィールド**がより重要になる
  - Tool Searchが有効な場合、Claudeがいつツールを検索すべきかを判断するのに役立つ（skillsと同様）

### MCPクライアント開発者向け

- **ToolSearchTool**の実装を強く推奨
- AnthropicはClaude Code向けにカスタム検索機能で実装

## 将来の展望

### プログラマティックなツール呼び出しについて

- MCPツールをコードで構成できる**プログラマティックなツール呼び出し**を実験中
- 今後も探求を継続する予定
- ただし、まずは**Tool Searchでコンテキスト使用量の削減**を優先してリリース

## 添付画像：コンテキスト使用状況

記事には、Claude Codeの `/context` コマンドによるコンテキスト使用状況のスクリーンショットが含まれていた：

| 項目 | トークン数 | 割合 |
|------|-----------|------|
| **モデル** | claude-opus-4-5-20251101 | 21k/200k (11%) |
| System prompt | 2.8k | 1.4% |
| System tools | 16.6k | 8.3% |
| Custom agents | 22 | 0.0% |
| Memory files | 15 | 0.0% |
| Skills | 1.6k | 0.8% |
| Messages | 8 | 0.0% |
| Free space | 134k | 67.0% |
| Autocompact buffer | 45.0k | 22.5% |

## エンゲージメント

- 💬 195 コメント
- 🔁 648 リポスト
- ❤️ 4.4K いいね
- 📊 1.9M 閲覧

## 著者について

**Thariq (@trq212)**
- Anthropic所属、Claude Codeチーム
- 以前: YC W20、MIT Media Lab
- "towards machines of loving grace"

## 重要な結論

1. **MCPツールのスケーラビリティ問題への解決策**: 多数のMCPツールを使用する際のコンテキスト消費問題が解決
2. **後方互換性**: 既存のMCPサーバーは変更なしで動作
3. **server instructionsフィールドの重要性**: Tool Search機能を最大限活用するために、このフィールドの適切な設定が推奨される
4. **コミュニティのリクエストに対応**: GitHubで最もリクエストされた機能の1つを実装

## 関連リンク

- [GitHub Issue: Lazy loading for MCP servers](https://github.com/anthropics/claude-code/issues) （記事内でリンクされていた）
- [ToolSearchTool ドキュメント](https://modelcontextprotocol.io/) （MCPクライアント開発者向け）
