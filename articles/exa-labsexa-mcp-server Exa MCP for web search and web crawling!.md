---
title: "exa-labs/exa-mcp-server: Exa MCP for web search and web crawling!"
source: "https://github.com/exa-labs/exa-mcp-server"
author:
  - "Exa Labs"
published: 2024-11-27
created: 2025-09-27
description: |
  Exa Labsが公開するModel Context ProtocolサーバーのGitHubリポジトリ概要。`exa-code`を含む検索・コード検索ツール群の特徴、リモート接続・ローカル実行手順、Claude DesktopやCursor向けの設定方法、トラブルシューティングまでを網羅している。
tags:
  - "exa"
  - "model-context-protocol"
  - "code-search"
  - "web-search"
  - "claude"
---

## README概要

- **視覚要素**: NPMバージョンバッジとSmitheryバッジが冒頭に掲載され、パッケージ公開状況とSmithery統合可否を示している。
- **全体像**: リポジトリはExa Search APIをMCP経由でAIアシスタントへ提供するサーバーであり、最新の`exa-code`機能と従来のウェブ検索機能を一体化している。

## 🆕 `exa-code`: コーディング向け高速コンテキスト

- **目的**: AIコーディングエージェントの幻覚防止と正確なコード生成のために、GitHub・ドキュメント・Stack Overflowなどから最適なコンテキストを抽出する。
- **利用例**: Pythonからのライブクロール指定検索、Vercel AI SDKの正しい呼び出し方法、NixによるRust開発環境構築など具体的な質問例が提示されている。
- **対応クライアント**: CursorとClaude CodeでHTTPベース設定を用いて即座に利用でき、Smithery経由でAPIキー不要の運用も可能。
- **設定ヒント**: `exa-code`だけを有効化するとトークン効率が最大になる旨を明示。

## Remote Exa MCP

- **接続URL**: `https://mcp.exa.ai/mcp` を使い、ローカル実行なしでExaホスト版に接続可能。
- **Claude Desktop設定**: `mcp-remote`経由でリモートMCPを登録するJSONスニペットが提供され、Developer Modeでの設定手順が詳述されている。
- **Cursor/Claude Code設定**: HTTP型サーバー指定のJSON例を提示し、ヘッダーやAPIキーの指定方法も解説。
- **npmインストール**: `npm install -g exa-mcp-server` でグローバルに導入し、`claude mcp add` コマンドを用いたCLI操作例もある。
- **Smithery連携**: Smithery上でのサーバー公開ページが案内され、キーなし利用を後押ししている。

## Configuration ⚙️

- **Claude Desktop認識手順**: Mac/Windowsそれぞれで`claude_desktop_config.json`を開く方法、Developer Modeの有効化手順を段階的に説明。
- **サーバー設定例**: `command`に`npx`、`args`に`exa-mcp-server`、`env`に`EXA_API_KEY`を渡す構成例を複数パターンで掲載。
- **ツール選択**: `--tools`オプションにより`get_code_context_exa`や`web_search_exa`、`company_research`などを組み合わせる方法を列挙し、目的別の推奨構成を示す。
- **リスタート手順**: 設定反映にはClaude Desktopの完全終了・再起動が必要であると注意喚起。

## 利用可能なツールと活用例

- **コード検索特化**: `get_code_context_exa`が新機能として強調され、最新のコードスニペット・実装例・ベストプラクティス取得に適していると説明。
- **ウェブ検索系**: `web_search_exa`によるリアルタイム検索、`crawling`によるURL指定読み込み、`company_research`や`linkedin_search`など業務支援系ツールを網羅。
- **ディープリサーチ**: `deep_researcher_start`と`deep_researcher_check`で長期タスク型リサーチを実行・確認する手順が提示されている。
- **活用シナリオ**: React HooksのTypeScript使用例、Next.js認証実装、pandasドキュメント参照などコード検索事例と、企業調査やAI医療影響調査など一般検索事例が並記される。

## ローカル実行とNPX利用

- **前提条件**: Node.js v18以降、Claude DesktopなどMCP対応クライアント、Exa APIキーが必要。
- **Claude Code経由**: `claude mcp add exa -e EXA_API_KEY=... -- npx -y exa-mcp-server` で高速設定可能。
- **npx直接実行**: 既定ツール、特定ツール、複数ツール、有効ツール一覧表示などのコマンド例が提示され、開発者の運用に柔軟性を持たせている。

## Claude Desktop詳細設定

- **Developer Mode有効化**→**設定ファイル編集**→**JSON追加**→**再起動**の段階を詳細に説明。
- **ツール別プリセット**: コード検索限定、コード+ウェブ検索、ウェブ検索のみ、ディープリサーチのみといったJSON例を提示し、環境変数にAPIキーを入力する重要性を強調。
- **接続確認**: 再起動後に表示されるアイコンなどで接続状態を検証する旨の指示がある。

## トラブルシューティングと既知の制限

- **Server Not Found**: npmパッケージのインストール確認を促す。
- **API Key Issues**: `EXA_API_KEY`の有効性と余分な空白・引用符の除去を推奨。
- **Connection Problems**: Claude Desktopの完全再起動が必要なケースを明示。
- **追加リソース**: 問題解決のためにGitHubリポジトリやExa公式リソースへのリンクが提示されるが、特定の制限事項や既知バグの列挙はない。

## 補足情報

- **ライセンス**: MIT License。
- **メタ情報**: GitHub上ではスター数・フォーク数、主要言語(85% TypeScript)なども公開されており、オープンソース活動の活発さを示している。
