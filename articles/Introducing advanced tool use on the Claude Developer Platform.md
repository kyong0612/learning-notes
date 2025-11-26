---
title: "Introducing advanced tool use on the Claude Developer Platform"
source: "https://www.anthropic.com/engineering/advanced-tool-use"
author:
  - "Bin Wu"
  - "Adam Jones"
  - "Artur Renault"
  - "Henry Tay"
  - "Jake Noble"
  - "Nathan McCandlish"
  - "Noah Picard"
  - "Sam Jiang"
published: 2025-11-24
created: 2025-11-26
description: |
  Claude Developer Platformに追加された3つの新しいベータ機能（Tool Search Tool、Programmatic Tool Calling、Tool Use Examples）を紹介。これらの機能により、Claudeはツールを動的に発見し、コード実行環境で効率的にオーケストレーションし、例から正しい使用法を学習できるようになる。数百から数千のツールを扱うAIエージェント構築を可能にする。
tags:
  - "Claude"
  - "tool-use"
  - "API"
  - "MCP"
  - "AI-agents"
  - "Anthropic"
  - "developer-tools"
  - "LLM"
---

## 概要

AIエージェントの未来は、モデルが数百から数千のツールをシームレスに扱えることにある。IDE アシスタントがgit操作、ファイル操作、パッケージマネージャー、テストフレームワーク、デプロイパイプラインを統合し、運用コーディネーターがSlack、GitHub、Google Drive、Jira、社内データベース、複数のMCPサーバーを同時に接続するような世界だ。

効果的なエージェントを構築するには、すべてのツール定義を事前にコンテキストに詰め込むことなく、無制限のツールライブラリで作業する必要がある。

本記事で発表された3つの新機能：

1. **Tool Search Tool** - Claudeが検索ツールを使用して、コンテキストウィンドウを消費せずに数千のツールにアクセス
2. **Programmatic Tool Calling** - Claudeがコード実行環境でツールを呼び出し、モデルのコンテキストウィンドウへの影響を軽減
3. **Tool Use Examples** - ツールの効果的な使用方法を示すための普遍的な標準

---

## 1. Tool Search Tool

### 課題

MCP ツール定義は重要なコンテキストを提供するが、接続サーバーが増えるとトークン消費が膨大になる。

**5サーバー構成の例：**

| サーバー | ツール数 | トークン消費 |
|----------|---------|-------------|
| GitHub | 35 | ~26K |
| Slack | 11 | ~21K |
| Sentry | 5 | ~3K |
| Grafana | 5 | ~3K |
| Splunk | 2 | ~2K |
| **合計** | **58** | **~55K** |

Jira（~17Kトークン）などを追加すると、100K以上のオーバーヘッドに到達する。Anthropicでは、最適化前にツール定義で134Kトークンを消費した例もある。

**トークンコストだけでなく、精度の問題も存在：**

- 誤ったツール選択
- 不正確なパラメータ
- 類似名ツール（`notification-send-user` vs `notification-send-channel`）での混乱

### 解決策

**Tool Search Tool**は、すべてのツール定義を事前に読み込む代わりに、オンデマンドでツールを発見する。

**従来のアプローチ vs Tool Search Tool:**

| 項目 | 従来 | Tool Search Tool |
|------|------|------------------|
| 初期読み込み | 全ツール定義（~72K tokens） | 検索ツールのみ（~500 tokens） |
| タスク実行時 | - | 関連ツールのみ（3-5ツール、~3K tokens） |
| 合計消費 | ~77K tokens | ~8.7K tokens |
| **削減率** | - | **85%** |

**内部テストでの精度向上：**

- Opus 4: 49% → 74%
- Opus 4.5: 79.5% → 88.1%

### 実装方法

```json
{
  "tools": [
    // 検索ツールを含める（regex、BM25、またはカスタム）
    {"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"},

    // オンデマンド発見用にツールをマーク
    {
      "name": "github.createPullRequest",
      "description": "Create a pull request",
      "input_schema": {...},
      "defer_loading": true
    }
    // ... defer_loading: true の他のツール
  ]
}
```

**MCPサーバー用の設定例：**

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-drive",
  "default_config": {"defer_loading": true},
  "configs": {
    "search_files": {"defer_loading": false}  // 最もよく使うツールは読み込んでおく
  }
}
```

**プロンプトキャッシングへの影響：** Tool Search Toolはプロンプトキャッシングを壊さない。遅延ツールは初期プロンプトから完全に除外され、検索後にのみコンテキストに追加されるため。

### 使用すべき場面

**推奨：**

- ツール定義が10K以上のトークンを消費
- ツール選択の精度に問題がある
- 複数サーバーのMCP搭載システム
- 10以上のツール

**効果が薄い場合：**

- 小規模ツールライブラリ（10ツール未満）
- 全ツールが毎セッションで頻繁に使用される
- ツール定義がコンパクト

---

## 2. Programmatic Tool Calling（プログラマティックツール呼び出し）

### 課題

従来のツール呼び出しには2つの根本的な問題がある：

1. **中間結果によるコンテキスト汚染**
   - 10MBのログファイル分析時、エラー頻度の要約のみ必要でも全ファイルがコンテキストに入る
   - 複数テーブルからの顧客データ取得で、関連性に関わらず全レコードが蓄積

2. **推論オーバーヘッドと手動合成**
   - 各ツール呼び出しで完全なモデル推論パスが必要
   - 5ツールのワークフロー = 5回の推論パス + 各結果の解析

### 解決策

**Programmatic Tool Calling**により、Claudeは個別のAPIラウンドトリップではなく、コードを通じてツールをオーケストレーションできる。

#### 例：予算コンプライアンスチェック

**タスク：「Q3の出張予算を超過したチームメンバーは？」**

利用可能なツール：

- `get_team_members(department)` - チームメンバーリスト
- `get_expenses(user_id, quarter)` - ユーザーの経費項目
- `get_budget_by_level(level)` - 従業員レベルの予算上限

**従来のアプローチ：**

- チームメンバー取得 → 20人
- 各人のQ3経費取得 → 20回のツール呼び出し（各50-100項目）
- 予算上限取得
- **全データがClaudeのコンテキストに**: 2,000以上の経費項目（50KB以上）

**Programmatic Tool Calling：**

Claudeがワークフロー全体をオーケストレーションするPythonスクリプトを作成。スクリプトはサンドボックス環境で実行され、ツール結果はスクリプトで処理される（モデルが消費しない）。

```python
team = await get_team_members("engineering")

# 各ユニークレベルの予算を取得
levels = list(set(m["level"] for m in team))
budget_results = await asyncio.gather(*[
    get_budget_by_level(level) for level in levels
])

# ルックアップ辞書を作成
budgets = {level: budget for level, budget in zip(levels, budget_results)}

# 全経費を並列取得
expenses = await asyncio.gather(*[
    get_expenses(m["id"], "Q3") for m in team
])

# 出張予算超過者を特定
exceeded = []
for member, exp in zip(team, expenses):
    budget = budgets[member["level"]]
    total = sum(e["amount"] for e in exp)
    if total > budget["travel_limit"]:
        exceeded.append({
            "name": member["name"],
            "spent": total,
            "limit": budget["travel_limit"]
        })

print(json.dumps(exceeded))
```

**結果：** Claudeのコンテキストには最終結果のみ（予算超過した2-3人）。200KBの生データが1KBの結果に削減。

### 効率性の向上

| 指標 | 従来 | PTC | 改善 |
|------|------|-----|------|
| トークン使用量 | 43,588 | 27,297 | **37%削減** |
| 知識検索精度 | 25.6% | 28.5% | +2.9pp |
| GIAベンチマーク | 46.5% | 51.2% | +4.7pp |

### 実装方法

#### 1. コードから呼び出し可能なツールをマーク

```json
{
  "tools": [
    {
      "type": "code_execution_20250825",
      "name": "code_execution"
    },
    {
      "name": "get_team_members",
      "description": "Get all members of a department...",
      "input_schema": {...},
      "allowed_callers": ["code_execution_20250825"]
    }
  ]
}
```

#### 2. Claudeがオーケストレーションコードを作成

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_abc",
  "name": "code_execution",
  "input": {
    "code": "team = get_team_members('engineering')\n..."
  }
}
```

#### 3. ツールはClaudeのコンテキストに触れずに実行

```json
{
  "type": "tool_use",
  "id": "toolu_xyz",
  "name": "get_expenses",
  "input": {"user_id": "emp_123", "quarter": "Q3"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc"
  }
}
```

#### 4. 最終出力のみがコンテキストに入る

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc",
  "content": {
    "stdout": "[{\"name\": \"Alice\", \"spent\": 12500, \"limit\": 10000}...]"
  }
}
```

### 使用すべき場面

**推奨：**

- 集計や要約のみ必要な大規模データセット処理
- 3つ以上の依存ツール呼び出しを持つマルチステップワークフロー
- ツール結果のフィルタリング、ソート、変換
- 中間データがClaudeの推論に影響すべきでないタスク
- 多数のアイテムに対する並列操作

**効果が薄い場合：**

- 単純な単一ツール呼び出し
- Claudeがすべての中間結果を見て推論すべきタスク
- 小さなレスポンスのクイックルックアップ

### 実績

**Claude for Excel**はProgrammatic Tool Callingを使用して、モデルのコンテキストウィンドウをオーバーロードせずに数千行のスプレッドシートを読み書きしている。

---

## 3. Tool Use Examples（ツール使用例）

### 課題

JSON Schemaは構造（型、必須フィールド、許可されるenum）の定義に優れているが、使用パターンは表現できない：

- オプションパラメータをいつ含めるか
- どの組み合わせが意味を持つか
- APIが期待する規約は何か

**例：サポートチケットAPI**

```json
{
  "name": "create_ticket",
  "input_schema": {
    "properties": {
      "title": {"type": "string"},
      "priority": {"enum": ["low", "medium", "high", "critical"]},
      "labels": {"type": "array", "items": {"type": "string"}},
      "reporter": {...},
      "due_date": {"type": "string"},
      "escalation": {...}
    },
    "required": ["title"]
  }
}
```

**スキーマでは答えられない質問：**

- `due_date`は「2024-11-06」「Nov 6, 2024」「2024-11-06T00:00:00Z」のどれ？
- `reporter.id`はUUID、"USR-12345"、"12345"のどれ？
- いつ`reporter.contact`を入力すべき？
- `escalation.level`と`escalation.sla_hours`は`priority`とどう関連する？

### 解決策

**Tool Use Examples**により、ツール定義に直接サンプルツール呼び出しを提供できる。

```json
{
  "name": "create_ticket",
  "input_schema": {...},
  "input_examples": [
    {
      "title": "Login page returns 500 error",
      "priority": "critical",
      "labels": ["bug", "authentication", "production"],
      "reporter": {
        "id": "USR-12345",
        "name": "Jane Smith",
        "contact": {
          "email": "jane@acme.com",
          "phone": "+1-555-0123"
        }
      },
      "due_date": "2024-11-06",
      "escalation": {
        "level": 2,
        "notify_manager": true,
        "sla_hours": 4
      }
    },
    {
      "title": "Add dark mode support",
      "labels": ["feature-request", "ui"],
      "reporter": {
        "id": "USR-67890",
        "name": "Alex Chen"
      }
    },
    {
      "title": "Update API documentation"
    }
  ]
}
```

**Claudeが3つの例から学習すること：**

- **フォーマット規約**: 日付はYYYY-MM-DD、ユーザーIDはUSR-XXXXX、ラベルはkebab-case
- **ネスト構造パターン**: reporterオブジェクトとネストされたcontactオブジェクトの構築方法
- **オプションパラメータの相関**:
  - クリティカルバグ → 完全な連絡先情報 + 厳しいSLAのエスカレーション
  - 機能リクエスト → reporter のみ（連絡先/エスカレーションなし）
  - 内部タスク → title のみ

### 効果

内部テストでは、ツール使用例により複雑なパラメータ処理の精度が**72%から90%に向上**。

### 使用すべき場面

**推奨：**

- 正しい使用法がスキーマからは自明でない複雑なネスト構造
- 多数のオプションパラメータがあり、含める/含めないパターンが重要
- スキーマで捕捉されないドメイン固有の規約を持つAPI
- 類似ツール間の使い分け明確化（`create_ticket` vs `create_incident`）

**効果が薄い場合：**

- 使用法が明らかな単純な単一パラメータツール
- Claudeが既に理解している標準フォーマット（URL、メールなど）
- JSON Schema制約で処理可能な検証の懸念

---

## ベストプラクティス

### 機能を戦略的にレイヤー化

すべてのタスクですべての機能を使う必要はない。最大のボトルネックから始める：

| ボトルネック | 解決策 |
|-------------|--------|
| ツール定義によるコンテキスト肥大化 | Tool Search Tool |
| 中間結果によるコンテキスト汚染 | Programmatic Tool Calling |
| パラメータエラーと不正な呼び出し | Tool Use Examples |

### Tool Search Toolの設定

**ツール発見の改善：**

```json
// 良い例
{
  "name": "search_customer_orders",
  "description": "Search for customer orders by date range, status, or total amount. Returns order details including items, shipping, and payment info."
}

// 悪い例
{
  "name": "query_db_orders",
  "description": "Execute order query"
}
```

**システムプロンプトガイダンス：**

```
You have access to tools for Slack messaging, Google Drive file management,
Jira ticket tracking, and GitHub repository operations. Use the tool search
to find specific capabilities.
```

**推奨構成：** 最もよく使う3-5ツールを常に読み込み、残りは遅延読み込み。

### Programmatic Tool Callingの設定

**戻り値フォーマットを明確に文書化：**

```json
{
  "name": "get_orders",
  "description": "Retrieve orders for a customer.
Returns:
    List of order objects, each containing:
    - id (str): Order identifier
    - total (float): Order total in USD
    - status (str): One of 'pending', 'shipped', 'delivered'
    - items (list): Array of {sku, quantity, price}
    - created_at (str): ISO 8601 timestamp"
}
```

**プログラマティック実行に適したツール：**

- 並列実行可能なツール（独立した操作）
- リトライ可能な操作（冪等性のあるもの）

### Tool Use Examplesの設定

**例の作成ガイドライン：**

- リアルなデータを使用（実際の都市名、妥当な価格、"string"や"value"ではなく）
- 最小、部分的、完全な指定パターンのバリエーションを示す
- 簡潔に保つ：ツールあたり1-5例
- 曖昧さに焦点を当てる（スキーマから正しい使用法が明らかでない場合のみ）

---

## 始め方

これらの機能はベータ版として利用可能。有効にするには、ベータヘッダーを追加：

```python
client.beta.messages.create(
    betas=["advanced-tool-use-2025-11-20"],
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    tools=[
        {"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"},
        {"type": "code_execution_20250825", "name": "code_execution"},
        # defer_loading, allowed_callers, input_examples を持つツール
    ]
)
```

### ドキュメントとリソース

- **Tool Search Tool**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/tool_search_with_embeddings.ipynb)
- **Programmatic Tool Calling**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) | [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/tool_use/programmatic_tool_calling_ptc.ipynb)
- **Tool Use Examples**: [Documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)

---

## まとめ

これらの機能は、ツール使用を単純な関数呼び出しから**インテリジェントなオーケストレーション**へと進化させる。エージェントが数十のツールと大規模なデータセットにまたがるより複雑なワークフローに取り組むにつれて、動的な発見、効率的な実行、信頼性の高い呼び出しが基盤となる。

**重要なポイント：**

1. Tool Search Toolにより、コンテキスト消費を85%削減しながら無制限のツールライブラリにアクセス可能
2. Programmatic Tool Callingにより、中間結果をコンテキストから除外し、トークン使用量を37%削減
3. Tool Use Examplesにより、複雑なパラメータ処理の精度が72%から90%に向上
