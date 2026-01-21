---
title: "OpenCode | The open source AI coding agent"
source: "https://opencode.ai/"
author: "Anomaly"
published:
created: 2026-01-21
description: "OpenCodeは、ターミナル、デスクトップアプリ、IDE拡張機能として利用できるオープンソースのAIコーディングエージェント。Claude、GPT、Geminiなど75以上のLLMプロバイダーに対応し、LSP自動統合やマルチセッション機能を備える。月間65万人以上の開発者に利用されている。"
tags:
  - "clippings"
  - "AI"
  - "coding-agent"
  - "open-source"
  - "LLM"
  - "developer-tools"
  - "terminal"
  - "Go"
  - "TUI"
---

## 概要

OpenCodeは、Anomaly社が開発するオープンソースのAIコーディングエージェント。ターミナル、デスクトップアプリ、IDE拡張機能の3つのインターフェースで利用可能。Go言語で構築されており、Bubble Teaライブラリを使用したTUI（ターミナルユーザーインターフェース）を提供する。MITライセンスで公開されている。

## 利用統計

- **GitHubスター**: 81,197
- **コントリビューター**: 456名
- **月間開発者数**: 650,000人以上
- **最新リリース**: v1.1.28

## サポートプラットフォーム

| プラットフォーム | 対応状況 |
|------------------|----------|
| ターミナル（CLI/TUI） | 正式版 |
| デスクトップアプリ | ベータ版（macOS、Windows、Linux） |
| IDE拡張機能 | 利用可能 |

## 対応LLMプロバイダー

Models.devを通じて**75以上のLLMプロバイダー**に対応：

- **Anthropic**: Claude Pro/Max
- **OpenAI**: ChatGPT Plus/Pro、GPT-4
- **Google**: Gemini
- **AWS**: Bedrock
- **Azure**: Azure OpenAI
- **その他**: Groq、OpenRouter、GitHub Copilot、Google Cloud VertexAI
- **ローカルモデル**: 対応

## 主要機能

### コア機能

- **インタラクティブTUI**: Bubble Teaライブラリによる高機能ターミナルUI
- **LSP自動統合**: プロジェクトに応じた言語サーバープロトコルを自動ロード
- **マルチセッション**: 同一プロジェクトで複数のエージェントを並列実行可能
- **セッション共有**: リンクを通じたセッション共有機能

### 開発支援機能

- **ツール統合**: コマンド実行、ファイル検索、コード編集
- **Vimライクエディタ**: 効率的なテキスト編集
- **ファイル変更追跡**: リアルタイムでの変更監視
- **外部エディタサポート**: 好みのエディタとの連携
- **MCP（Model Context Protocol）サーバー統合**: 拡張機能の追加

### 高度な機能

- **自動コンパクト機能**: 会話の自動要約によるコンテキスト管理
- **非対話型プロンプトモード**: スクリプトやCI/CDでの利用
- **複数出力形式**: テキストおよびJSON形式での出力

## プライバシーとセキュリティ

- **データ非保存ポリシー**: コードやコンテキストデータはサーバーに保存されない
- **プライバシー重視設計**: ユーザーのコードは安全に保護

## インストール方法

### クイックインストール（推奨）

```bash
curl -fsSL https://opencode.ai/install | bash
```

### その他のインストール方法

- **Homebrew**（macOS/Linux）: `brew install opencode`
- **AUR**（Arch Linux）: AURパッケージから
- **Go**: `go install github.com/opencode-ai/opencode@latest`

## 技術スタック

- **言語**: Go
- **TUIフレームワーク**: Bubble Tea
- **データベース**: SQLite（セッション管理・永続化）
- **ライセンス**: MIT

## 価格

- **無料版**: 基本機能が利用可能
- **Zen（有料版）**: 追加機能あり（詳細は公式サイト参照）

## 関連リンク

- [公式サイト](https://opencode.ai/)
- [GitHub](https://github.com/opencode-ai/opencode)
- [デスクトップアプリダウンロード](https://opencode.ai/download)
- [Zen（有料版）](https://opencode.ai/zen)
