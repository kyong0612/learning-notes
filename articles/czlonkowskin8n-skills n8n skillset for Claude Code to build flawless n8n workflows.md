---
title: "czlonkowski/n8n-skills: n8n skillset for Claude Code to build flawless n8n workflows"
source: "https://github.com/czlonkowski/n8n-skills/"
author:
  - "Romuald Członkowski"
published:
created: 2025-12-09
description: |
  n8n-mcp MCPサーバーを使用して本番環境向けのn8nワークフローを構築するためのClaude Code専門スキルセット。
  7つの相互補完的なスキルにより、正しい式構文、MCPツールの効果的な使用、実証済みのワークフローパターン、
  バリデーションエラーの解釈と修正、操作に応じたノード設定をAIに教示する。
tags:
  - "workflow-automation"
  - "ai-agents"
  - "n8n"
  - "claude-code"
  - "mcp"
  - "automation"
---

## 概要

**n8n-skills**は、[n8n-mcp](https://github.com/czlonkowski/n8n-mcp) MCPサーバーを使用して、本番環境向けのn8nワークフローを構築するためのClaude Code専門スキルセットです。

### なぜこのスキルセットが必要か

n8nワークフローをプログラム的に構築する際の一般的な課題：

- MCPツールの誤った使用や非効率な使用
- バリデーションエラーループに陥る
- どのワークフローパターンを使うべきか不明
- ノードとその依存関係の誤設定

このスキルセットがClaudeに教えること：

- ✅ 正しいn8n式構文（{{}}パターン）
- ✅ n8n-mcpツールの効果的な使用方法
- ✅ 実際の使用から得られた実証済みワークフローパターン
- ✅ バリデーションエラーの解釈と修正
- ✅ 操作に応じたノード設定

---

## 7つのスキル

### 1. n8n Expression Syntax（式構文）

正しいn8n式構文と一般的なパターンを教示。

**アクティベーション条件**: 式を書くとき、{{}}構文を使用するとき、$json/$node変数にアクセスするとき、式エラーのトラブルシューティング時。

**主要機能**:

- コア変数（$json, $node, $now, $env）
- **重要な注意点**: Webhookデータは `$json.body` 配下にある
- 一般的な間違いカタログと修正方法
- 式を使わない場面（Codeノード！）

---

### 2. n8n MCP Tools Expert（最重要スキル）

n8n-mcp MCPツールの効果的な使用ガイド。

**アクティベーション条件**: ノード検索、設定検証、テンプレートアクセス、ワークフロー管理時。

**主要機能**:

- ツール選択ガイド（どのタスクにどのツールを使うか）
- nodeType形式の違い（`nodes-base.*` vs `n8n-nodes-base.*`）
- バリデーションプロファイル（minimal/runtime/ai-friendly/strict）
- スマートパラメータ（IFノードのbranch="true"など）
- 自動サニタイズシステムの説明

---

### 3. n8n Workflow Patterns（ワークフローパターン）

5つの実証済みアーキテクチャパターンを使用してワークフローを構築。

**アクティベーション条件**: ワークフロー作成、ノード接続、自動化設計時。

**主要機能**:

- 5つの実証済みパターン（webhook処理、HTTP API、データベース、AI、スケジュール）
- ワークフロー作成チェックリスト
- 2,653以上のn8nテンプレートからの実例
- 接続のベストプラクティス
- パターン選択ガイド

---

### 4. n8n Validation Expert（バリデーション専門）

バリデーションエラーの解釈と修正ガイド。

**アクティベーション条件**: バリデーション失敗時、ワークフローエラーのデバッグ時、誤検知の処理時。

**主要機能**:

- バリデーションループワークフロー
- 実際のエラーカタログ
- 自動サニタイズ動作の説明
- 誤検知ガイド
- 段階別プロファイル選択

---

### 5. n8n Node Configuration（ノード設定）

操作に応じたノード設定ガイダンス。

**アクティベーション条件**: ノード設定時、プロパティ依存関係の理解時、AIワークフロー設定時。

**主要機能**:

- プロパティ依存関係ルール（例: sendBody → contentType）
- 操作固有の要件
- AI接続タイプ（AI Agentワークフロー用8タイプ）
- 一般的な設定パターン

---

### 6. n8n Code JavaScript

n8n CodeノードでのJavaScriptコード記述。

**アクティベーション条件**: Codeノードでのjavascript記述時、Codeノードエラーのトラブルシューティング時、$helpersでのHTTPリクエスト作成時、日付処理時。

**主要機能**:

- データアクセスパターン（$input.all(), $input.first(), $input.item）
- **重要な注意点**: Webhookデータは `$json.body` 配下
- 正しい戻り値形式: `[{json: {...}}]`
- 組み込み関数（$helpers.httpRequest(), DateTime, $jmespath()）
- トップ5エラーパターンとソリューション（62%以上の失敗をカバー）
- 10の本番テスト済みパターン

---

### 7. n8n Code Python

制限事項を理解したn8n CodeノードでのPythonコード記述。

**アクティベーション条件**: CodeノードでのPython記述時、Python制限の確認時、標準ライブラリ使用時。

**主要機能**:

- **重要**: 95%のユースケースではJavaScriptを使用
- Pythonデータアクセス（`_input`, `_json`, `_node`）
- **重大な制限**: 外部ライブラリ不可（requests, pandas, numpy）
- 標準ライブラリリファレンス（json, datetime, re等）
- 不足ライブラリの回避策
- n8n用一般的なPythonパターン

---

## インストール方法

### 前提条件

1. **n8n-mcp MCPサーバー**のインストールと設定（[インストールガイド](https://github.com/czlonkowski/n8n-mcp)）
2. **Claude Code**、Claude.ai、またはClaude APIアクセス
3. `.mcp.json`にn8n-mcpサーバーを設定

### Claude Code

#### 方法1: プラグインインストール（推奨）

```bash
/plugin install czlonkowski/n8n-skills
```

#### 方法2: マーケットプレイス経由

```bash
/plugin marketplace add czlonkowski/n8n-skills
/plugin install
# リストから "n8n-mcp-skills" を選択
```

#### 方法3: 手動インストール

```bash
git clone https://github.com/czlonkowski/n8n-skills.git
cp -r n8n-skills/skills/* ~/.claude/skills/
# Claude Codeをリロード
```

### Claude.ai

1. `skills/` から個別のスキルフォルダをダウンロード
2. 各スキルフォルダをZip圧縮
3. Settings → Capabilities → Skills からアップロード

---

## 使用方法

スキルは関連するクエリが検出されると**自動的にアクティベート**されます：

| クエリ例 | アクティベートされるスキル |
|---------|------------------------|
| "n8n式はどう書けばいい？" | n8n Expression Syntax |
| "Slackノードを見つけて" | n8n MCP Tools Expert |
| "webhookワークフローを作って" | n8n Workflow Patterns |
| "バリデーションが失敗するのはなぜ？" | n8n Validation Expert |
| "HTTP Requestノードの設定方法は？" | n8n Node Configuration |
| "Codeノードでwebhookデータにアクセスするには？" | n8n Code JavaScript |
| "Python CodeノードでPandasは使える？" | n8n Code Python |

### スキルの連携

例：**"webhookからSlackへのワークフローを作成・検証して"** と依頼した場合：

1. **n8n Workflow Patterns** → webhook処理パターンを特定
2. **n8n MCP Tools Expert** → webhookとSlackノードを検索
3. **n8n Node Configuration** → ノード設定をガイド
4. **n8n Code JavaScript** → 正しい.bodyアクセスでwebhookデータを処理
5. **n8n Expression Syntax** → 他ノードでのデータマッピングを支援
6. **n8n Validation Expert** → 最終ワークフローを検証

すべてのスキルがシームレスに連携します！

---

## 含まれるもの

| 項目 | 数量 |
|------|------|
| 相互補完的スキル | 7 |
| サポートn8nノード | 525+ |
| 参照ワークフローテンプレート | 2,653+ |
| 本番テスト済みCodeノードパターン | 10 |
| エラーカタログ・トラブルシューティングガイド | 包括的 |

---

## ライセンス

MIT License

---

## クレジット

**開発者**: Romuald Członkowski

- Website: [www.aiadvisors.pl/en](https://www.aiadvisors.pl/en)
- 関連プロジェクト: [n8n-mcp](https://github.com/czlonkowski/n8n-mcp)

---

## 関連リンク

- [n8n-mcp](https://github.com/czlonkowski/n8n-mcp) - n8n用MCPサーバー
- [n8n](https://n8n.io/) - ワークフロー自動化プラットフォーム
- [プロジェクトサイト](https://www.n8n-skills.com)
