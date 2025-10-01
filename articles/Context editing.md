---
title: "Context editing"
source: "https://docs.claude.com/en/docs/build-with-claude/context-editing"
author:
  - "[[Claude Docs]]"
published: "Beta (2025)"
created: 2025-10-01
description: "Context editingは、会話のコンテキストが大きくなるにつれて自動的に管理する機能。古いツール結果を削除し、プレースホルダーに置き換えることで、コンテキストウィンドウの制限を管理する。"
tags:
  - "clippings"
  - "claude-api"
  - "context-management"
  - "prompt-caching"
  - "beta-feature"
---

## 概要

Context editingは、長い会話でコンテキストウィンドウの制限を管理するためのBeta機能です。会話のコンテキストが設定した閾値を超えると、古いツール結果を自動的に削除し、プレースホルダーに置き換えます。

**重要**: この機能はBeta版のため、APIリクエストに以下のヘッダーを含める必要があります:
```
anthropic-beta: context-management-2025-06-27
```

## 仕組み

`clear_tool_uses_20250919`ストラテジーは、設定した閾値を超えた時にツール結果をクリアします:

- **自動クリア**: APIが古いツール結果を時系列順に自動的にクリアし、プレースホルダーテキストに置き換えます
- **デフォルト動作**: デフォルトではツール結果のみがクリアされます
- **オプション設定**: `clear_tool_inputs`をtrueに設定すると、ツール呼び出しパラメータも同時にクリアできます

### Prompt Cachingとの関係

Context editingはキャッシュされたプロンプトプレフィックスを無効化します。これは、コンテンツをクリアするとプロンプト構造が変更され、キャッシュヒットの一致要件が破られるためです。

**推奨事項**:
- `clear_at_least`パラメータを使用して、毎回クリアされる最小トークン数を確保
- キャッシュ無効化に見合うだけのトークンをクリア
- [Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)と併用する場合、コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストでは新しくキャッシュされたプレフィックスを再利用できます

## サポートされているモデル

Context editingは以下のモデルで利用可能です:
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)

## 基本的な使用方法

最もシンプルな方法は、ストラテジータイプのみを指定することです。その他の設定オプションはすべてデフォルト値が使用されます:

```bash
curl https://api.anthropic.com/v1/messages \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919"
                }
            ]
        }
    }'
```

## 高度な設定

追加のパラメータを使用して、context editingの動作をカスタマイズできます:

```bash
curl https://api.anthropic.com/v1/messages \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {"type": "input_tokens", "value": 30000},
                    "keep": {"type": "tool_uses", "value": 5},
                    "clear_at_least": {"type": "tokens", "value": 10000},
                    "exclude_tools": ["important_tool_name"],
                    "clear_tool_inputs": true
                }
            ]
        }
    }'
```

## 設定オプション

| オプション | デフォルト値 | 説明 |
| --- | --- | --- |
| `trigger` | 100,000 input tokens | Context editingストラテジーがアクティブになるタイミングを定義します。プロンプトがこの閾値を超えると、クリアが開始されます。`input_tokens`または`tool_uses`で指定できます。 |
| `keep` | 3 tool uses | クリア後に保持する最新のツール使用/結果ペアの数を定義します。APIは最も古いツールインタラクションから削除し、最新のものを保持します。 |
| `clear_at_least` | None | ストラテジーがアクティブになるたびにクリアされる最小トークン数を確保します。APIが指定された量以上をクリアできない場合、ストラテジーは適用されません。これは、prompt cacheを破るだけの価値があるかを判断するのに役立ちます。 |
| `exclude_tools` | None | ツール使用と結果を決してクリアしないツール名のリスト。重要なコンテキストを保持するのに便利です。 |
| `clear_tool_inputs` | `false` | ツール結果と一緒にツール呼び出しパラメータをクリアするかどうかを制御します。デフォルトでは、ツール結果のみがクリアされ、Claudeの元のツール呼び出しは表示されたままになります。 |

## レスポンス形式

`context_management`レスポンスフィールドを使用して、どのcontext editがリクエストに適用されたかを確認できます。クリアされたコンテンツとinput tokensに関する統計情報も含まれます。

### 通常のレスポンス

```json
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

### ストリーミングレスポンス

ストリーミングレスポンスの場合、context editは最終の`message_delta`イベントに含まれます:

```json
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## トークンカウント

[/v1/messages/count_tokens](https://docs.claude.com/en/docs/build-with-claude/token-counting) エンドポイントはcontext managementをサポートしており、context editing適用後にプロンプトが使用するトークン数をプレビューできます。

### レスポンス例

```json
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

レスポンスには以下の両方が表示されます:
- `input_tokens`: Context management適用後の最終トークン数
- `original_input_tokens`: クリアが発生する前の元のトークン数

## 関連リンク

- [Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- [Extended thinking](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)

## 重要なポイント

1. **Beta版の機能**: 必ず`anthropic-beta: context-management-2025-06-27`ヘッダーを含める
2. **Prompt Cachingとの併用**: キャッシュが無効化されるため、`clear_at_least`で十分なトークンをクリアすることを推奨
3. **柔軟な設定**: `trigger`、`keep`、`exclude_tools`などで動作をカスタマイズ可能
4. **透明性**: レスポンスの`context_management`フィールドで適用された編集を確認できる