---
title: "Thread by @jasonzhou1993"
source: "https://x.com/jasonzhou1993/status/1975135928516833647?s=12"
author:
  - "Jason Zhou (@jasonzhou1993)"
published: 2024-10-06
created: 2025-10-07
description: |
  Claude Codeにおける.agent docsを活用したコンテキストエンジニアリングの実践ガイド。複雑なコードベースでも効果的に機能する、システムプロンプト、MCP tools、サブエージェント、ドキュメントシステムの活用方法を解説。
tags:
  - "Claude"
  - "AI"
  - "context-engineering"
  - "documentation"
  - "coding-assistant"
  - "agent-docs"
  - "developer-tools"
## 概要

Jason Zhou氏による、Claude Codeの性能を10倍向上させる`.agent docs`とコンテキストエンジニアリングの実践的な活用方法についてのスレッド。複雑なコードベースでも効果的に機能する手法を紹介。

## 主要なポイント

### 1. コンテキストエンジニアリングの重要性

**Claude Codeがデフォルトで取り込むコンテキスト：**

- **System prompt** - システムレベルの指示
- **System tools** - 組み込みツール
- **MCP tools** - Model Context Protocol ツール
- **CLAUDE.md** - プロジェクト固有の設定ファイル
- **Messages** - 会話履歴

💡 **実用的なヒント：** `/context` コマンドを実行することで、現在のコンテキストの内訳を確認できます。

### 2. サブエージェント（Sub Agent）の活用

**特徴：**
- **用途：** READ-ONLYタスク専用（リサーチなど）
- **機能：** 大量のトークンを小さな要約に凝縮
- **利点：** コンテキスト管理の効率化

サブエージェントは、大規模な情報を処理して重要な情報のみを抽出することで、メインエージェントのコンテキストウィンドウを効率的に使用できます。

### 3. ドキュメントシステムの構造

優れたドキュメントシステムは、Claude Codeの性能に大きな違いをもたらします。Manusの論文で提案された、コンテキストをローカルキャッシュファイルにオフロードする概念に基づいています。

**推奨される `.agent` ディレクトリ構造：**

```
.agent/
├── System/      # プロジェクト全体の設定と情報
├── SOP/         # 標準操作手順（Standard Operating Procedures）
├── Tasks/       # タスク定義とワークフロー
└── README.md    # プロジェクト概要とドキュメントガイド
```

#### 各ディレクトリの役割

- **System:** プロジェクトの基本情報、アーキテクチャ、技術スタック、環境設定などを含む
- **SOP:** チーム内で統一された開発手順、コーディング規約、ベストプラクティスを文書化
- **Tasks:** 現在のタスク、TODO、開発ロードマップを管理
- **README.md:** プロジェクトの全体像と、各ドキュメントへのナビゲーションを提供

## 実践的な利点

✅ **複雑なコードベースでの効果**
- 大規模プロジェクトでもClaude Codeが適切なコンテキストを維持
- 一貫性のある開発体験の提供

✅ **生産性の向上**
- 適切なドキュメント構造により、AIの理解度が向上
- より正確で関連性の高い提案を受けられる

✅ **チーム協業の改善**
- 標準化されたドキュメント構造により、チーム全体で統一された開発体験

## 結論

`.agent docs`とコンテキストエンジニアリングの適切な活用により、Claude Codeの性能を大幅に向上させることができます。特に、構造化されたドキュメントシステムは、AIがプロジェクトの全体像を理解し、より的確な支援を提供するための基盤となります。

---

## 原文（スレッド）

**Jason Zhou** @jasonzhou1993 [2024-10-06](https://x.com/jasonzhou1993/status/1975135928516833647)

.agent docs made my Claude Code 10x better…

Here is how to context engineer into Claude code

It even works w/ complex codebase

👇 Thread below

![.agent directory structure showing SOP, System, Tasks, and README.md](https://pbs.twimg.com/media/G2kU9ThasAAbq2X?format=jpg&name=large)

---

**Jason Zhou** @jasonzhou1993 [2024-10-06](https://x.com/jasonzhou1993/status/1975135931524161863)

1/ Context engineering is the key

Claude code default takes in

- System prompt
- System tools
- MCP tools
- CLAUDE.md
- Messages

Run /context will give you an idea of the breakdown

---

**Jason Zhou** @jasonzhou1993 [2024-10-06](https://x.com/jasonzhou1993/status/1975135934644736201)

2/ Sub agent is another tool for managing context

It is designed for READ-ONLY tasks like research

Subagent can condense large amount of tokens into small summary of key info

---

**Jason Zhou** @jasonzhou1993 [2024-10-06](https://x.com/jasonzhou1993/status/1975135937790378444)

3/ Doc system

A good doc system makes huge difference

Manus had this paper where they offload context to local cache files, and this is similar concept

One structure I personally use a lot:

.agent

- System
- SOP
- Tasks
- README.md

System includes project architecture, tech stack, and key configurations
