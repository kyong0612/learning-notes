---
title: "Effective harnesses for long-running agents"
source: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
author:
  - "Justin Young"
  - "[[@AnthropicAI]]"
published: 2025-11-26
created: 2025-11-28
description: |
  複数のコンテキストウィンドウにまたがって長時間実行されるAIエージェントの課題と解決策について解説。初期化エージェントとコーディングエージェントによる2段階アプローチを提案し、エージェントが一貫した進捗を達成するためのハーネス設計のベストプラクティスを紹介。
tags:
  - AI-agents
  - long-running-agents
  - context-windows
  - Claude-Agent-SDK
  - software-engineering
  - prompt-engineering
  - multi-context-window
---

## 概要

AIエージェントがより高度になるにつれ、開発者は数時間から数日かかる複雑なタスクを依頼するようになっている。しかし、**複数のコンテキストウィンドウにまたがって一貫した進捗を達成すること**は依然として未解決の問題である。

### 核心的な課題

長時間実行エージェントの根本的な問題：

- **離散的なセッション**で作業する必要がある
- 各新セッションは**前のセッションの記憶なし**で開始される
- コンテキストウィンドウは限られており、複雑なプロジェクトは単一ウィンドウ内で完了できない

> 交代制で働くエンジニアがいるソフトウェアプロジェクトを想像してみてください。各エンジニアは前のシフトで何が起こったかの記憶なしに到着します。

## 解決策：2段階アプローチ

[Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)で複数のコンテキストウィンドウにまたがって効果的に作業するための2つのコンポーネント：

| コンポーネント | 役割 |
|---|---|
| **初期化エージェント (Initializer Agent)** | 最初の実行時に環境をセットアップ |
| **コーディングエージェント (Coding Agent)** | 各セッションでインクリメンタルな進捗を達成し、次のセッション用に明確なアーティファクトを残す |

コード例: [autonomous-coding quickstart](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)

---

## 長時間実行エージェントの問題

### Claude Agent SDKの限界

Claude Agent SDKはcompaction（コンパクション）などのコンテキスト管理機能を持ち、理論上は任意の長時間作業が可能。しかし、**compactionだけでは不十分**。

Opus 4.5のようなフロンティアコーディングモデルでも、高レベルなプロンプト（例：「claude.aiのクローンを構築して」）だけでは本番品質のウェブアプリを構築できない。

### 2つの主要な失敗パターン

#### 1. 一度にやりすぎる（One-shotting）

- エージェントがアプリ全体を一度に実装しようとする
- コンテキストが途中で尽き、機能が半分実装され、ドキュメント化されない状態になる
- 次のセッションは何が起こったかを推測し、基本的なアプリを動かすのに時間を費やす

#### 2. 早期の完了宣言

- プロジェクト後半で発生
- 一部の機能が構築された後、エージェントが進捗を見て「完了」と宣言してしまう

---

## 環境管理

### 機能リスト（Feature List）

**問題への対処**: エージェントのone-shotting、または早期完了宣言

**解決策**: 初期化エージェントにユーザーの初期プロンプトを拡張した包括的な機能要件ファイルを作成させる。

claude.aiクローンの例では、200以上の機能を定義：

```json
{
    "category": "functional",
    "description": "New chat button creates a fresh conversation",
    "steps": [
      "Navigate to main interface",
      "Click the 'New Chat' button",
      "Verify a new conversation is created",
      "Check that chat area shows welcome state",
      "Verify conversation appears in sidebar"
    ],
    "passes": false
}
```

**重要なポイント**:

- すべての機能は初期状態で「failing」としてマーク
- コーディングエージェントは`passes`フィールドのステータス変更のみ許可
- **JSONを使用**（Markdownファイルよりも不適切な変更・上書きが起きにくい）
- 強い指示：「テストを削除・編集することは、機能の欠落やバグにつながるため許容されない」

### インクリメンタルな進捗（Incremental Progress）

初期環境のスキャフォールディング後、コーディングエージェントは**一度に1つの機能のみ**作業するよう指示される。

**クリーンな状態を維持するための方法**:

1. **gitコミット**: 説明的なコミットメッセージで進捗をコミット
2. **プログレスファイル**: 進捗の要約を記録

これにより：

- 悪いコード変更を元に戻せる
- 動作状態のコードベースを回復できる
- 次のエージェントが何が起こったか推測する必要がなくなる

### テスト

**問題**: Claudeは適切なテストなしで機能を完了とマークする傾向がある

- コード変更、ユニットテスト、`curl`コマンドでのテストは行う
- しかし**エンドツーエンドで機能が動作しないことを認識できない**

**解決策**: ブラウザ自動化ツールを使用し、人間ユーザーと同様にテストするよう明示的にプロンプト

![Screenshots taken by Claude through the Puppeteer MCP server as it tested the claude.ai clone](https://www-cdn.anthropic.com/images/4zrzovbb/website/f94c2257964fb2d623f1e81f874977ebfc0986bc-1920x1080.gif)

*Puppeteer MCPサーバーを通じてClaudeがclaude.aiクローンをテストした際のスクリーンショット*

**効果**: コードだけでは明らかでないバグを特定・修正できるようになり、パフォーマンスが劇的に向上

**残存する制限**:

- Claudeのビジョンとブラウザ自動化ツールの制限
- ブラウザネイティブのアラートモーダルはPuppeteer MCPで認識できない
- これらのモーダルに依存する機能はよりバグが多くなる傾向

---

## セッション開始時の手順

各コーディングエージェントは以下のステップを実行：

1. `pwd`を実行して作業ディレクトリを確認
2. **gitログとプログレスファイル**を読んで最近の作業を把握
3. **機能リストファイル**を読み、未完了の最優先機能を選択

### 典型的なセッションの開始

```
[Assistant] I'll start by getting my bearings and understanding the current state of the project.
[Tool Use] <bash - pwd>
[Tool Use] <read - claude-progress.txt>
[Tool Use] <read - feature_list.json>
[Assistant] Let me check the git log to see recent work.
[Tool Use] <bash - git log --oneline -20>
[Assistant] Now let me check if there's an init.sh script to restart the servers.
<Starts the development server>
[Assistant] Excellent! Now let me navigate to the application and verify that some fundamental features are still working.
<Tests basic functionality>
[Assistant] Based on my verification testing, I can see that the fundamental functionality is working well...
<Starts work on a new feature>
```

**追加のベストプラクティス**:

- 初期化エージェントに`init.sh`スクリプトを書かせる
- 新機能を実装する前に基本的なエンドツーエンドテストを実行
- アプリが壊れた状態で放置された場合を即座に検出・修正

---

## 失敗モードと解決策のまとめ

| **問題** | **初期化エージェントの動作** | **コーディングエージェントの動作** |
|---|---|---|
| プロジェクト全体を早期に完了と宣言 | 機能リストファイルをセットアップ：入力仕様に基づいてエンドツーエンドの機能説明を持つ構造化JSONファイルを作成 | セッション開始時に機能リストを読み、作業する単一の機能を選択 |
| バグや未文書化の進捗で環境を放置 | 初期gitリポジトリとプログレスノートファイルを作成 | セッション開始時にプログレスノートとgitコミットログを読み、開発サーバーで基本テストを実行。セッション終了時にgitコミットと進捗更新を記録 |
| 機能を早期に完了とマーク | 機能リストファイルをセットアップ | すべての機能を自己検証。慎重なテスト後にのみ「passing」とマーク |
| アプリの実行方法を把握するのに時間を費やす | 開発サーバーを起動できる`init.sh`スクリプトを作成 | セッション開始時に`init.sh`を読む |

---

## 今後の課題

### 未解決の問題

1. **単一エージェント vs マルチエージェントアーキテクチャ**
   - 単一の汎用コーディングエージェントが最高のパフォーマンスを発揮するか
   - 専門化されたエージェント（テストエージェント、QAエージェント、コードクリーンアップエージェント）がサブタスクでより良い仕事をする可能性

2. **他分野への一般化**
   - 現在のデモはフルスタックWebアプリ開発に最適化
   - 科学研究や金融モデリングなど、他の分野の長時間実行エージェントタスクへの応用

---

## 重要な洞察

人間のソフトウェアエンジニアが毎日行っていることからインスピレーションを得た：

- **エージェントが新しいコンテキストウィンドウで作業状態を素早く理解する方法**を見つけることが鍵
- `claude-progress.txt`ファイルとgit履歴の組み合わせでこれを実現

## 謝辞

Justin Youngによる執筆。David Hershey、Prithvi Rajasakeran、Jeremy Hadfield、Naia Bouscal、Michael Tingley、Jesse Mu、Jake Eaton、Marius Buleandara、Maggie Vo、Pedram Navid、Nadine Yasser、Alex Notovに特別な感謝。

この作業は、Claudeが安全に長期的な自律型ソフトウェアエンジニアリングを行えるようにした、Anthropic全体の複数のチーム、特にcode RL & Claude Codeチームの集合的な努力を反映している。

---

## 関連リンク

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Autonomous Coding Quickstart](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)
- [Claude 4 Prompting Guide - Multi-context Window Workflows](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#multi-context-window-workflows)
