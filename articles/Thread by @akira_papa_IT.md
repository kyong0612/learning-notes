---
title: "n8n-skills: Claude Code用n8nワークフロー構築スキルセット"
source: "https://x.com/akira_papa_IT/status/1997828314543841309"
author:
  - "[[@akira_papa_IT]]"
  - "[[Romuald Członkowski]]"
published: 2025-12-07
created: 2025-12-09
description: |
  n8n-skillsは、Claude CodeがMCPサーバーを使用して完璧なn8nワークフローを構築するための7つの補完スキルセット。式構文、ツール活用、ワークフローパターン、バリデーション、ノード設定、JavaScript/Pythonコードノードをカバーし、525+ノードと2,653+テンプレートに対応。
tags:
  - "n8n"
  - "claude-code"
  - "workflow-automation"
  - "mcp"
  - "ai-agents"
  - "automation"
---

## 概要

**n8n-skills** は、AIアシスタント（Claude Code）が [n8n-mcp](https://github.com/czlonkowski/n8n-mcp) MCPサーバーを使用して、本番環境に対応したn8nワークフローを構築するための**7つの補完スキルセット**。

- **リポジトリ**: <https://github.com/czlonkowski/n8n-skills>
- **公式サイト**: <https://www.n8n-skills.com>
- **ライセンス**: MIT
- **⭐ 668 stars** / **🍴 103 forks**

---

## なぜこれが必要か 🤔

n8nワークフローをプログラムで構築する際の課題：

| 課題 | 説明 |
|------|------|
| MCPツールの誤用 | ツールを間違って使用したり非効率に使用 |
| バリデーションエラーのループ | エラー修正が終わらない |
| ワークフローパターン | どのパターンを使うべきか分からない |
| ノード設定の複雑さ | 依存関係のある設定が多い |
| 式構文 `{{}}` | ハマりポイントが多数 |

---

## 7つのスキル構成 🛠️

### 基礎スキル（3つ）

#### 1. n8n Expression Syntax（式構文）

正しいn8n式構文と一般的なパターンを教える

**発動条件**: 式を書く時、`{{}}`構文を使う時、`$json/$node`変数にアクセスする時

**主な機能**:

- コア変数（`$json`, `$node`, `$now`, `$env`）
- ⚠️ **重要**: Webhookデータは `$json.body` 配下にある
- よくあるミスと修正方法のカタログ
- 式を使わないべき場面（Codeノード！）

#### 2. n8n MCP Tools Expert（最優先スキル）

n8n-mcp MCPツールを効果的に使うエキスパートガイド

**発動条件**: ノード検索、設定バリデーション、テンプレートアクセス、ワークフロー管理

**主な機能**:

- ツール選択ガイド（どのタスクにどのツール）
- nodeType形式の違い（`nodes-base.*` vs `n8n-nodes-base.*`）
- バリデーションプロファイル（minimal/runtime/ai-friendly/strict）
- スマートパラメータ（IFノードの `branch="true"` など）
- 自動サニタイズシステムの説明

#### 3. n8n Workflow Patterns（ワークフローパターン）

実証済み5パターンでワークフローを構築

**発動条件**: ワークフロー作成、ノード接続、自動化設計

**5つのパターン**:

1. **Webhook処理** - 外部からのリクエスト処理
2. **HTTP API** - 外部APIとの連携
3. **Database** - データベース操作
4. **AI** - AIワークフロー
5. **定期実行** - スケジュールベースの自動化

### 品質担保スキル（2つ）

#### 4. n8n Validation Expert（バリデーション）

バリデーションエラーの解釈と修正ガイド

**発動条件**: バリデーション失敗時、ワークフローエラーのデバッグ

**主な機能**:

- バリデーションループワークフロー
- 実際のエラーカタログ
- 自動サニタイズの動作説明
- 偽陽性ガイド
- 段階別プロファイル選択

#### 5. n8n Node Configuration（ノード設定）

操作に応じたノード設定ガイダンス

**発動条件**: ノード設定時、プロパティ依存関係の理解、AIワークフロー設定

**主な機能**:

- プロパティ依存ルール（例: `sendBody` → `contentType`）
- 操作固有の要件
- AI接続タイプ（AI Agentワークフロー用の8タイプ）

### コードスキル（2つ）

#### 6. n8n Code JavaScript

n8n CodeノードでのJavaScript記述

**発動条件**: CodeノードでJavaScriptを書く時、HTTPリクエスト、日付操作

**主な機能**:

- データアクセスパターン（`$input.all()`, `$input.first()`, `$input.item`）
- ⚠️ **重要**: Webhookデータは `$json.body` 配下
- 正しい戻り値形式: `[{json: {...}}]`
- 組み込み関数（`$helpers.httpRequest()`, `DateTime`, `$jmespath()`）
- 上位5エラーパターンと解決策（62%+の失敗をカバー）
- 10の本番テスト済みパターン

#### 7. n8n Code Python

n8n CodeノードでのPython記述

**発動条件**: CodeノードでPythonを書く時、Python制限を知りたい時

**主な機能**:

- ⚠️ **重要**: 95%のケースではJavaScriptを使うべき
- Pythonデータアクセス（`_input`, `_json`, `_node`）
- 🚫 **致命的な制限**: 外部ライブラリ不可（requests, pandas, numpy）
- 標準ライブラリリファレンス（json, datetime, re等）
- ライブラリ不足時の回避策

---

## スキルの連携動作 🔄

例：**「Webhook→Slack連携を作って」** と依頼した場合

```
1. Workflow Patterns → Webhook処理パターンを特定
2. MCP Tools Expert → WebhookとSlackノードを検索
3. Node Configuration → ノード設定をガイド
4. Code JavaScript → Webhookデータの処理（.bodyアクセス）
5. Expression Syntax → 他ノードでのデータマッピング
6. Validation Expert → 最終ワークフローのバリデーション
```

すべてのスキルがシームレスに連携！

---

## インストール方法 🚀

### 前提条件

1. **n8n-mcp** MCPサーバーがインストール・設定済み
2. **Claude Code**、Claude.ai、またはClaude APIアクセス
3. `.mcp.json` にn8n-mcpサーバーを設定済み

### Claude Code

**方法1: プラグインインストール（推奨）**

```bash
/plugin install czlonkowski/n8n-skills
```

**方法2: マーケットプレイス経由**

```bash
/plugin marketplace add czlonkowski/n8n-skills
/plugin install
# リストから "n8n-mcp-skills" を選択
```

**方法3: 手動インストール**

```bash
git clone https://github.com/czlonkowski/n8n-skills.git
cp -r n8n-skills/skills/* ~/.claude/skills/
```

---

## 対応規模 📊

| 項目 | 数値 |
|------|------|
| 補完スキル | 7 |
| 対応n8nノード | 525+ |
| ワークフローテンプレート | 2,653+ |
| 本番テスト済みCodeノードパターン | 10 |

---

## 関連プロジェクト 🔗

- [n8n-mcp](https://github.com/czlonkowski/n8n-mcp) - n8n用MCPサーバー
- [n8n](https://n8n.io/) - ワークフロー自動化プラットフォーム

---

## クレジット

**作成者**: Romuald Członkowski

- Website: <https://www.aiadvisors.pl/en>

---

## 元のツイート

**あきらパパ【生成AI活用エンジニア&３児のパパ】** @akira\_papa\_IT 2025-12-07

> Claude Codeのn8nスキルいいですね☺️
>
> 【Claude Code × n8n自動化が爆速になる神スキルセット見つけたのでメモシェア〜🎵MCPでワークフロー構築がノーミスに👀】

![Image](https://pbs.twimg.com/media/G7j9C1xXsAA8yBW?format=png&name=large)
