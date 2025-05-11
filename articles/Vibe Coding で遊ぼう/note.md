---
title: Vibe Coding で遊ぼう
source: 　https://zenn.dev/schroneko/articles/lets-play-with-vibe-coding
author:
  - ぬこぬこ
published: 2025-04-26
created: 2025-05-11 21:03:39
description: この記事では、Andrej Karpathy氏によって提唱された「Vibe Coding」という新しいコーディングスタイルについて解説します。Vibe Codingは、LLM（大規模言語モデル）の能力を最大限に活用し、コードの詳細な理解やレビューを省略して、直感や「バイブ」に基づいて開発を進めるアプローチです。記事では、Vibe Codingの定義、利点、注意点、そして具体的なツールとしてAnthropicのClaude CodeとOpenAIのCodex CLIのセットアップ方法や使い方を紹介しています。
tags:
  - Vibe Coding
  - LLM
  - AI
  - Claude Code
  - Codex CLI
---

## Vibe Coding とはなんでしょうか？

Andrej Karpathy氏が提唱する新しいコーディングスタイル「Vibe Coding」は、完全に「バイブ」に身を任せ、LLM（大規模言語モデル）の力を借りてコーディングを行う手法です。開発者はコードの詳細な理解やレビューを省略し、LLMとの対話を通じて迅速にプロトタイプやアプリケーションを構築します。

Simon Willison氏は、LLMが書いたコードをレビューせずにソフトウェアを構築することをVibe Codingと定義し、初期の学習曲線を大幅に緩和する効果を指摘しています。また、UCSDのPhilip J. Guo准教授は、Vibe Codingがリサーチフェーズをスキップし、創造的なプロジェクトの開始障壁を下げると述べています。

一方で、Addy Osmani氏はVibe Codingの日常化によるコーディングスキルの低下に警鐘を鳴らしています。

## Vibe Coding 向きのツールは何か？

記事では、Vibe Codingに適したツールとして、Anthropicの`Claude Code`とOpenAIの`Codex CLI`を推奨しています。

### Claude Code のセットアップ

1. **インストール**: Node 18以上の環境で `npm install -g @anthropic-ai/claude-code` を実行します。
2. **確認**: `claude --version` でインストールを確認します。
3. **実行とログイン**: 作業ディレクトリで `claude` を実行し、Anthropicのアカウントにログインします。

### Codex CLI のセットアップ

1. **インストール**: `npm i -g @openai/codex` を実行します。
2. **確認**: `codex --version` でインストールを確認します。
3. **APIキー設定**: `export OPENAI_API_KEY="your-api-key-here"` でAPIキーを設定します（注意：履歴に残るため、より安全な方法を推奨）。
4. **実行**: 作業ディレクトリで `codex` を実行します。

## ここからは発展的な内容（と言いつつ大事だったり）

### コンテナ環境での利用

セキュリティと環境分離のため、`Claude Code`と`Codex CLI`をコンテナ内で実行することが推奨されています。

* **Claude Code**:
    1. Dockerを起動します。
    2. `devcontainer cli` (`npm install -g @devcontainers/cli`) をインストールします。
    3. `Claude Code` のリポジトリをクローンし、`devcontainer up --workspace-folder .` でdevcontainerを起動します。
    4. `devcontainer exec --workspace-folder . -- zsh` でコンテナに入り、必要に応じて再度 `npm install -g @anthropic-ai/claude-code` を実行してセットアップします。
* **Codex CLI**:
    1. `Codex CLI` のリポジトリをクローンします。
    2. `pnpm` (`brew install pnpm` など) をインストールします。
    3. `./codex-cli/scripts/build_container.sh` でコンテナをビルドします。
    4. `./codex-cli/scripts/run_in_container.sh --work_dir . ""` でコンテナ内でCodex CLIを起動します。

## Claude Code の使い方

公式ドキュメントを参照しつつ、特にメモリ管理が重要です。

* **メモリの種類とディレクトリ**:
  * **プロジェクトメモリ (`./CLAUDE.md`)**: チームで共有する規約やナレッジ。
  * **プロジェクトメモリ（ローカル） (`./CLAUDE.local.md`)**: 個人のプロジェクト固有設定。
  * **ユーザメモリ (`~/.claude/CLAUDE.md`)**: グローバルな個人設定。
* **基本的な流れ**:
    1. ユーザメモリ (`~/.claude/CLAUDE.md`) を作成し、汎用的な指示（例：「応答は自然な日本語で」）を記述します。
    2. プロジェクトメモリ (`./CLAUDE.md`) を作成し、技術スタックに応じた指示（例：「Pythonのパッケージマネージャはuvを使いなさい」）を記述します。

### Claude Code で MCP を使う

Claude DesktopからMCPをインポートする方法 (`claude mcp add-from-claude-desktop`) や、`claude mcp` コマンドを使ってMCPサーバを管理できます。

## Codex CLI の使い方

OpenAIのCodex CLIプロンプティングガイドを参照することが推奨されています。

## 終わりに

Vibe Codingは、学習用途、個人開発、小規模開発において非常に有用なアプローチであり、迅速なプロトタイピングを可能にします。
