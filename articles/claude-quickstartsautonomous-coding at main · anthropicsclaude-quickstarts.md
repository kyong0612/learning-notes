---
title: "claude-quickstarts/autonomous-coding at main · anthropics/claude-quickstarts"
source: "https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding"
author:
  - "[[PedramNavid]]"
  - "[[justinyoung127]]"
published:
created: 2025-11-29
description: "Claude Agent SDKを使用した長時間実行の自律的コーディングを実証する最小限のハーネス。2つのエージェントパターン（初期化エージェント＋コーディングエージェント）を実装し、複数のセッションにわたって完全なアプリケーションを構築できる。"
tags:
  - "Claude"
  - "Agent SDK"
  - "autonomous-coding"
  - "AI-coding"
  - "Python"
  - "two-agent-pattern"
---

## 概要

**Autonomous Coding Agent Demo** は、Claude Agent SDKを使用した長時間実行の自律的コーディングを実証する最小限のハーネスです。2つのエージェントパターン（初期化エージェント＋コーディングエージェント）を実装し、複数のセッションにわたって完全なアプリケーションを構築できます。

---

## 前提条件

### 必要なインストール

最新版のClaude CodeとClaude Agent SDKの両方が必要です：

```bash
# Claude Code CLI のインストール（最新版が必要）
npm install -g @anthropic-ai/claude-code

# Python依存関係のインストール
pip install -r requirements.txt
```

インストールの確認：

```bash
claude --version  # 最新版であることを確認
pip show claude-code-sdk  # SDKがインストールされていることを確認
```

### APIキーの設定

```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

---

## クイックスタート

```bash
python autonomous_agent_demo.py --project-dir ./my_project
```

イテレーションを制限してテストする場合：

```bash
python autonomous_agent_demo.py --project-dir ./my_project --max-iterations 3
```

---

## ⚠️ 重要：実行時間の目安

> **警告：このデモは実行に長時間かかります！**

| フェーズ | 所要時間 |
|---------|---------|
| **初回セッション（初期化）** | 数分（200のテストケースを含む`feature_list.json`を生成） |
| **後続セッション** | 各コーディングイテレーションで5-15分（複雑さによる） |
| **フルアプリ構築** | 200機能すべてを構築するには**数時間**かかる |

**ヒント：** より高速なデモを行いたい場合は、`prompts/initializer_prompt.md`を編集して機能数を減らすことができます（例：20-50機能）。

---

## 仕組み

### 2エージェントパターン

```text
┌─────────────────────────────────────────────────────────────┐
│  Session 1: Initializer Agent                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. app_spec.txt を読み込む                           │   │
│  │ 2. 200のテストケースを含む feature_list.json を作成   │   │
│  │ 3. プロジェクト構造をセットアップ                     │   │
│  │ 4. git を初期化                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Session 2+: Coding Agent                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. 前のセッションの続きから開始                       │   │
│  │ 2. 機能を1つずつ実装                                 │   │
│  │ 3. feature_list.json で完了をマーク                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### セッション管理

- 各セッションは新しいコンテキストウィンドウで実行
- 進捗は `feature_list.json` と git コミットを通じて永続化
- エージェントはセッション間で自動継続（3秒の遅延）
- `Ctrl+C` で一時停止、同じコマンドで再開

---

## セキュリティモデル

このデモは多層防御セキュリティアプローチを使用しています（`security.py` と `client.py` を参照）：

| レイヤー | 説明 |
|---------|------|
| **OSレベルサンドボックス** | Bashコマンドは隔離された環境で実行 |
| **ファイルシステム制限** | ファイル操作はプロジェクトディレクトリのみに制限 |
| **Bash許可リスト** | 特定のコマンドのみ許可 |

### 許可されているコマンド

- **ファイル検査**: `ls`, `cat`, `head`, `tail`, `wc`, `grep`
- **Node.js**: `npm`, `node`
- **バージョン管理**: `git`
- **プロセス管理**: `ps`, `lsof`, `sleep`, `pkill`（開発プロセスのみ）

許可リストにないコマンドはセキュリティフックによってブロックされます。

---

## プロジェクト構造

### ソースコード構造

```text
autonomous-coding/
├── autonomous_agent_demo.py  # メインエントリーポイント
├── agent.py                  # エージェントセッションロジック
├── client.py                 # Claude SDKクライアント設定
├── security.py               # Bashコマンド許可リストと検証
├── progress.py               # 進捗追跡ユーティリティ
├── prompts.py                # プロンプト読み込みユーティリティ
├── prompts/
│   ├── app_spec.txt          # アプリケーション仕様
│   ├── initializer_prompt.md # 初回セッションプロンプト
│   └── coding_prompt.md      # 継続セッションプロンプト
└── requirements.txt          # Python依存関係
```

### 生成されるプロジェクト構造

実行後、プロジェクトディレクトリには以下が含まれます：

```text
my_project/
├── feature_list.json         # テストケース（信頼できる情報源）
├── app_spec.txt              # コピーされた仕様
├── init.sh                   # 環境セットアップスクリプト
├── claude-progress.txt       # セッション進捗メモ
├── .claude_settings.json     # セキュリティ設定
└── [application files]       # 生成されたアプリケーションコード
```

---

## 生成されたアプリケーションの実行

エージェントが完了（または一時停止）した後、生成されたアプリケーションを実行できます：

```bash
cd generations/my_project

# エージェントが作成したセットアップスクリプトを実行
./init.sh

# または手動で（Node.jsアプリの場合）：
npm install
npm run dev
```

アプリケーションは通常 `http://localhost:3000` または類似のURLで利用可能です。

---

## コマンドラインオプション

| オプション | 説明 | デフォルト |
|-----------|------|---------|
| `--project-dir` | プロジェクトのディレクトリ | `./autonomous_demo_project` |
| `--max-iterations` | 最大エージェントイテレーション | 無制限 |
| `--model` | 使用するClaudeモデル | `claude-sonnet-4-5-20250929` |

---

## カスタマイズ

### アプリケーションの変更

`prompts/app_spec.txt` を編集して、構築する別のアプリケーションを指定します。

### 機能数の調整

`prompts/initializer_prompt.md` を編集して、「200機能」の要件をより少ない数に変更します（より高速なデモ用）。

### 許可コマンドの変更

`security.py` の `ALLOWED_COMMANDS` にコマンドを追加または削除します。

---

## トラブルシューティング

| 問題 | 原因と解決策 |
|------|-------------|
| **「初回実行時にハングしているように見える」** | これは正常です。初期化エージェントが200の詳細なテストケースを生成しており、かなりの時間がかかります。`[Tool: ...]` 出力を確認してエージェントが動作していることを確認してください。 |
| **「コマンドがセキュリティフックによってブロックされた」** | エージェントが許可リストにないコマンドを実行しようとしました。これはセキュリティシステムが意図通りに動作しています。必要に応じて、`security.py` の `ALLOWED_COMMANDS` にコマンドを追加してください。 |
| **「APIキーが設定されていない」** | シェル環境で `ANTHROPIC_API_KEY` がエクスポートされていることを確認してください。 |

---

## 重要なポイント

1. **2エージェントアーキテクチャ**: 初期化と継続的なコーディングを別々のエージェントで処理することで、長時間のタスクを管理しやすくしている
2. **進捗の永続化**: `feature_list.json` と git を使用して、セッション間で進捗を保持
3. **セキュリティファースト**: 多層防御アプローチにより、エージェントの操作を安全に制限
4. **カスタマイズ可能**: アプリ仕様、機能数、許可コマンドをすべてカスタマイズ可能

---

## ライセンス

Anthropic社内使用。
