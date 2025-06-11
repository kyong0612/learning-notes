---
title: "Reverse engineering Claude Code • Kir Shatrov"
source: "https://kirshatrov.com/posts/claude-code-internals"
author:
  - "Kir Shatrov"
published: "2025-04"
created: 2025-06-11
description: |
  Claude Codeの内部動作をリバースエンジニアリングし、mitmproxyを使ってAnthropicに送信されるプロンプトを解析。Claude CodeがCursorより遅く高コストな理由と、そのセキュリティ重視のアプローチについて詳細に解説。
tags:
  - "claude-code"
  - "reverse-engineering"
  - "ai-tools"
  - "anthropic"
  - "mitmproxy"
  - "security"
  - "cursor"
  - "agentic-coding"
---

# Claude Codeのリバースエンジニアリング

## 概要

Kir Shatrovによる、[Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)の内部動作をリバースエンジニアリングした技術記事。mitmproxyを使用してAnthropicに送信されるプロンプトを詳細に分析し、Claude CodeがCursorなどの他のツールと比較して遅く高コストな理由を解明。

## プロンプト取得方法

### 使用ツール

- **mitmproxy**: HTTPプロキシツールを使用してAPI通信を傍受

```bash
brew install mitmproxy
mitmweb --mode reverse:https://api.anthropic.com --listen-port 8000
ANTHROPIC_BASE_URL=http://localhost:8000/ claude
```

## Claude Codeの動作分析

### 1. 会話トピック判定システム

Claude Codeはユーザーの入力ごとに、新しい会話トピックかどうかを判定するシステムプロンプトを使用：

```
Analyze if this message indicates a new conversation topic.
If it does, extract a 2-3 word title that captures the new topic.
Format your response as a JSON object with two fields: 'isNewTopic' (boolean) and 'title' (string, or null if isNewTopic is false).
```

### 2. システムプロンプト構造

**主要な指示事項:**

- CLI環境での簡潔な回答を重視
- 絶対パスの使用を強制
- 環境情報（作業ディレクトリ、Gitリポジトリ状態、プラットフォーム、日付、モデル）を含む

**コンテキスト情報:**

- プロジェクトファイル構造の完全なスナップショット
- Gitステータス（ブランチ、変更ファイル、最近のコミット）

### 3. 利用可能ツール（11種類）

1. **dispatch_agent**: 新しいエージェントを起動
2. **Bash**: 永続的なシェルセッションでのコマンド実行
3. **BatchTool**: 複数ツールの並列実行
4. **GlobTool**: ファイルパターンマッチング
5. **GrepTool**: 正規表現による高速コンテンツ検索
6. **LS**: ディレクトリ一覧表示
7. **View**: ファイル読み取り（最大2000行）
8. **Edit**: ファイル編集
9. **Replace**: ファイル上書き
10. **ReadNotebook**: Jupyterノートブック読み取り
11. **WebFetchTool**: URL取得と処理

## 実例分析

### ケース1: プロジェクト説明要求

**入力**: "describe what's in this project"

**処理フロー:**

1. トピック判定
2. `dispatch_agent`による構造解析指示
3. 複数の`view`ツール呼び出し（README.md、package.json、主要ファイル）
4. LLMによる総合分析と要約生成

**結果**: 40秒の処理時間、$0.11のコスト

### ケース2: Bashスクリプト作成要求

**入力**: "Please write a bash script which displays the top story on Hacker News"

**セキュリティ制限の発動:**

```
Error: Cannot fetch URL "https://github.com/HackerNews/API". 
For security, you can only fetch URLs from hosts that the user has mentioned 
in their messages or that are found in CLAUDE.md files or project files.
```

**セキュリティ評価システム:**

- すべてのBashコマンドに対してコマンドプレフィックス検出
- コマンドインジェクション攻撃の検出
- ユーザー承認フローの実装

## セキュリティ機能の詳細

### Bashコマンド実行前の安全性チェック

**政策仕様:**

- コマンドプレフィックスの抽出と分類
- コマンドインジェクション検出
- リスクレベルの評価

**例:**

- `git status` → `git status`
- `git diff $(pwd)` → `command_injection_detected`
- `npm run lint` → `none`

### ファイルパス抽出

実行コマンドが読み取り・変更するファイルパスを特定し、ユーザーに許可を求めるシステム。

## /initコマンドの動作

**機能**: プロジェクト用の`CLAUDE.md`ファイル自動生成

**解析対象:**

- ビルド/リント/テストコマンド
- コードスタイルガイドライン
- 既存のCursor規則やCopilot指示

**実装**: `BatchTool`を使用した並列ファイル収集

## パフォーマンス比較とコスト分析

### モデル使用戦略

- **claude-3-7-sonnet**: 推論が必要なタスク
- **claude-3-5-haiku**: シンプルなパースタスク（Bashコマンド解析など）

### コスト効率性の課題

- Bashツール使用ごとに最大2回のLLM呼び出し
- `claude-3.5`でも単純タスクには過剰（$15 vs $1.5 per 1M tokens for gpt-3.5-turbo）

## 他ツールとの比較

### Claude Code vs Cursor

- **Claude Code**: より汎用的でセキュアだが、時間とコストが高い
- **Cursor**: Bashツール解析なしで高速

### Claude Code vs 他のエージェントツール

**Aider**:

- 信頼性とUXでClaude Codeに劣る
- インストール時に`uv`を自動インストール

**OpenHands**:

- ~10GBのDockerイメージダウンロードが必要

**Claude Codeの優位性**:

- 単一NPMパッケージ（Node.js要求のみ）
- コンソールベースエージェントツールとしてUXが優秀

## 主な洞察

1. **セキュリティ優先アプローチ**: Claude Codeは安全性を重視し、すべてのコマンド実行前に詳細な検証を実施
2. **コスト vs セキュリティのトレードオフ**: 高いセキュリティ基準により処理時間とコストが増加
3. **包括的コンテキスト**: プロジェクト構造とGit状態の完全な情報を維持
4. **段階的処理**: ユーザー入力の各段階で適切な検証と変換を実施

## 技術的な制限事項

- 外部URL取得の厳格な制限
- セキュリティチェックによる処理遅延
- 単純タスクに対する過剰なLLMリソース使用

**記事執筆日**: 2025年4月

**著者について**: Kir Shatrovは、インフラスケーリングによってビジネス成長を支援する専門家。ソフトウェア、スケーラビリティ、エコシステムについて執筆している。
