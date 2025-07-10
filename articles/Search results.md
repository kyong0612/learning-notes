---
title: "検索結果"
source: "https://docs.anthropic.com/en/docs/build-with-claude/search-results"
author:
  - "[[Anthropic]]"
published:
created: 2025-07-10
description: "RAGアプリケーションにおいて、出典元情報を付与した検索結果を提供することで、自然な引用を可能にします。"
tags:
  - "clippings"
---

# 検索結果

RAGアプリケーションにおいて、出典元情報を付与した検索結果を提供することで、自然な引用を可能にします。

検索結果のコンテンツブロックは現在ベータ版です。この機能を有効にするには、`search-results-2025-06-09` [ベータヘッダー](/en/api/beta-headers) を使用してください。

検索結果コンテンツブロックは、適切な出典元情報を含む自然な引用を可能にし、ウェブ検索品質の引用をカスタムアプリケーションにもたらします。この機能は、Claudeに正確な出典を引用させる必要があるRAG（Retrieval-Augmented Generation）アプリケーションにおいて特に強力です。

検索結果機能は、以下のモデルで利用可能です。

* Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)
* Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
* Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)
* Claude Opus 4 (`claude-opus-4-20250514`)
* Claude Sonnet 4 (`claude-sonnet-4-20250514`)

## 主な利点

* **自然な引用** - あらゆるコンテンツに対して、ウェブ検索と同等の品質の引用を実現します。
* **柔軟な統合** - 動的なRAGのためのツールからの返り値として、または事前に取得したデータのためのトップレベルコンテンツとして使用できます。
* **適切な出典元表示** - 各結果には出典元とタイトルの情報が含まれ、明確な帰属表示が可能です。
* **ドキュメントベースの回避策は不要** - ドキュメントベースの回避策の必要性を排除します。
* **一貫した引用形式** - Claudeのウェブ検索機能の引用品質と形式に一致します。

## 仕組み

検索結果は2つの方法で提供できます。

1. **ツール呼び出しから** - カスタムツールが検索結果を返し、動的なRAGアプリケーションを可能にします。
2. **トップレベルコンテンツとして** - 事前に取得またはキャッシュされたコンテンツのために、ユーザーメッセージ内で直接検索結果を提供します。

どちらの場合でも、Claudeは検索結果からの情報を自動的に適切な出典元表示で引用できます。

### 検索結果スキーマ

検索結果は以下の構造を使用します。

```
{
  "type": "search_result",
  "source": "https://example.com/article",  // 必須: 出典URLまたは識別子
  "title": "記事のタイトル",                  // 必須: 結果のタイトル
  "content": [                               // 必須: テキストブロックの配列
    {
      "type": "text",
      "text": "検索結果の実際のコンテンツ..."
    }
  ],
  "citations": {                             // オプション: 引用設定
    "enabled": true                          // この結果の引用を有効/無効にする
  }
}

```

### 必須フィールド

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `type` | string | `"search_result"` である必要があります |
| `source` | string | コンテンツの出典URLまたは識別子 |
| `title` | string | 検索結果の説明的なタイトル |
| `content` | array | 実際のコンテンツを含むテキストブロックの配列 |

### オプションフィールド

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `citations` | object | `enabled` ブーリアンフィールドを持つ引用設定 |
| `cache_control` | object | キャッシュ制御設定 (例: `{"type": "ephemeral"}`) |

`content` 配列の各項目は、以下のテキストブロックである必要があります。

* `type`: `"text"` である必要があります
* `text`: 実際のテキストコンテンツ（空でない文字列）

## 方法1: ツール呼び出しからの検索結果

最も強力なユースケースは、カスタムツールから検索結果を返すことです。これにより、ツールが関連コンテンツを取得して自動引用付きで返す動的なRAGアプリケーションが可能になります。

### 例: ナレッジベースツール

Python

TypeScript

```
from anthropic import Anthropic
from anthropic.types.beta import (
    BetaMessageParam,
    BetaTextBlockParam,
    BetaSearchResultBlockParam,
    BetaToolResultBlockParam
)

client = Anthropic()

# ナレッジベース検索ツールを定義
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "会社のナレッジベースで情報を検索します",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "検索クエリ"
            }
        },
        "required": ["query"]
    }
}

# ツール呼び出しを処理する関数
def search_knowledge_base(query):
    # ここに検索ロジックを記述
    # 正しい形式で検索結果を返す
    return [
        BetaSearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="製品設定ガイド",
            content=[
                BetaTextBlockParam(
                    type="text",
                    text="製品を設定するには、「設定 > 設定」に移動します。デフォルトのタイムアウトは30秒ですが、必要に応じて10〜120秒の間で調整できます。"
                )
            ],
            citations={"enabled": True}
        ),
        BetaSearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="トラブルシューティングガイド",
            content=[
                BetaTextBlockParam(
                    type="text",
                    text="タイムアウトエラーが発生した場合は、まず設定を確認してください。一般的な原因には、ネットワーク遅延や不正なタイムアウト値が含まれます。"
                )
            ],
            citations={"enabled": True}
        )
    ]

# ツールを使用してメッセージを作成
response = client.beta.messages.create(
    model="claude-sonnet-4-20250514",  # サポートされているすべてのモデルで動作
    max_tokens=1024,
    betas=["search-results-2025-06-09"],
    tools=[knowledge_base_tool],
    messages=[
        BetaMessageParam(
            role="user",
            content="タイムアウト設定を構成するにはどうすればよいですか？"
        )
    ]
)

# Claudeがツールを呼び出すとき、検索結果を提供
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])

    # ツール結果を送信
    final_response = client.beta.messages.create(
        model="claude-sonnet-4-20250514",  # サポートされているすべてのモデルで動作
        max_tokens=1024,
        betas=["search-results-2025-06-09"],
        messages=[
            BetaMessageParam(role="user", content="タイムアウト設定を構成するにはどうすればよいですか？"),
            BetaMessageParam(role="assistant", content=response.content),
            BetaMessageParam(
                role="user",
                content=[
                    BetaToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # 検索結果はここに配置
                    )
                ]
            )
        ]
    )

```

## 方法2: トップレベルコンテンツとしての検索結果

ユーザーメッセージで直接検索結果を提供することもできます。これは以下の場合に便利です。

* 検索インフラストラクチャから事前に取得したコンテンツ
* 以前のクエリからキャッシュされた検索結果
* 外部検索サービスからのコンテンツ
* テストと開発

### 例: 直接的な検索結果

Python

TypeScript

Shell

```
from anthropic import Anthropic
from anthropic.types.beta import (
    BetaMessageParam,
    BetaTextBlockParam,
    BetaSearchResultBlockParam
)

client = Anthropic()

# ユーザーメッセージで直接検索結果を提供
response = client.beta.messages.create(
    model="claude-opus-4-20250514",
    max_tokens=1024,
    betas=["search-results-2025-06-09"],
    messages=[
        BetaMessageParam(
            role="user",
            content=[
                BetaSearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="APIリファレンス - 認証",
                    content=[
                        BetaTextBlockParam(
                            type="text",
                            text="すべてのAPIリクエストには、AuthorizationヘッダーにAPIキーを含める必要があります。キーはダッシュボードから生成できます。レート制限：標準ティアでは1時間あたり1000リクエスト、プレミアムでは10000リクエストです。"
                        )
                    ],
                    citations={"enabled": True}
                ),
                BetaSearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="クイックスタートガイド",
                    content=[
                        BetaTextBlockParam(
                            type="text",
                            text="始めるには：1）アカウントにサインアップし、2）ダッシュボードからAPIキーを生成し、3）pip install company-sdkを使用してSDKをインストールし、4）APIキーでクライアントを初期化します。"
                        )
                    ],

                    citations={"enabled": True}
                ),
                BetaTextBlockParam(
                    type="text",
                    text="これらの検索結果に基づいて、APIリクエストを認証する方法とレート制限について教えてください。"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))

```

## Claudeの引用付き応答

検索結果がどのように提供されても、Claudeはそれらの情報を使用する際に自動的に引用を含みます。

```
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "APIリクエストを認証するには、AuthorizationヘッダーにAPIキーを含める必要があります",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "APIリファレンス - 認証",
          "cited_text": "すべてのAPIリクエストには、AuthorizationヘッダーにAPIキーを含める必要があります",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". ダッシュボードからAPIキーを生成できます",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "APIリファレンス - 認証",
          "cited_text": "キーはダッシュボードから生成できます",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". レート制限は、標準ティアで1時間あたり1,000リクエスト、プレミアムティアで1時間あたり10,000リクエストです。",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "APIリファレンス - 認証",
          "cited_text": "レート制限：標準ティアでは1時間あたり1000リクエスト、プレミアムでは10000リクエストです。",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### 引用フィールド

各引用には以下が含まれます。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `type` | string | 検索結果の引用の場合は常に `"search_result_location"` |
| `source` | string | 元の検索結果の出典 |
| `title` | string or null | 元の検索結果のタイトル |
| `cited_text` | string | 引用されている正確なテキスト |
| `search_result_index` | integer | 検索結果のインデックス（0から始まる） |
| `start_block_index` | integer | コンテンツ配列内の開始位置 |
| `end_block_index` | integer | コンテンツ配列内の終了位置 |

注：`search_result_index`は、検索結果がどのように提供されたか（ツール呼び出しまたはトップレベルコンテンツ）に関わらず、検索結果コンテンツブロックのインデックス（0から始まる）を参照します。

## 複数のコンテンツブロック

検索結果は`content`配列に複数のテキストブロックを含むことができます。

```
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "APIドキュメンテーション",
  "content": [
    {
      "type": "text",
      "text": "認証：すべてのAPIリクエストにはAPIキーが必要です。"
    },
    {
      "type": "text",
      "text": "レート制限：APIはキーごとに1時間あたり1000リクエストを許可します。"
    },
    {
      "type": "text",
      "text": "エラー処理：APIは標準のHTTPステータスコードを返します。"
    }
  ]
}

```

Claudeは`start_block_index`と`end_block_index`フィールドを使用して特定のブロックを引用できます。

## 高度な使用法

### 両方の方法の組み合わせ

同じ会話で、ツールベースとトップレベルの両方の検索結果を使用できます。

```
# トップレベル検索結果を含む最初のメッセージ
messages = [
    BetaMessageParam(
        role="user",
        content=[
            BetaSearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="製品概要",
                content=[
                    BetaTextBlockParam(type="text", text="当社の製品はチームの共同作業を支援します...")
                ],
                citations={"enabled": True}
            ),
            BetaTextBlockParam(
                type="text",
                text="この製品について教えてください。また、価格情報を検索してください。"
            )
        ]
    )
]

# Claudeは応答し、価格情報を検索するためのツールを呼び出すかもしれません
# その後、さらに多くの検索結果を含むツール結果を提供します

```

### 他のコンテンツタイプとの組み合わせ

どちらの方法も、検索結果を他のコンテンツと混合することをサポートしています。

```
# ツール結果内
tool_result = [
    BetaSearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="ユーザーガイド",
        content=[BetaTextBlockParam(type="text", text="設定の詳細...")],
        citations={"enabled": True}
    ),
    BetaTextBlockParam(
        type="text",
        text="追加のコンテキスト：これはバージョン2.0以降に適用されます。"
    )
]

# トップレベルコンテンツ内
user_content = [
    BetaSearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="研究論文",
        content=[BetaTextBlockParam(type="text", text="主な発見...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    BetaTextBlockParam(
        type="text",
        text="このチャートは研究結果とどのように関連していますか？"
    )
]

```

### キャッシュ制御

パフォーマンスを向上させるためにキャッシュ制御を追加します。

```
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "ユーザーガイド",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### 引用制御

デフォルトでは、検索結果の引用は無効になっています。`citations`設定を明示的に設定することで引用を有効にできます。

```
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "ユーザーガイド",
  "content": [{"type": "text", "text": "重要なドキュメント..."}],
  "citations": {
    "enabled": true  // この結果の引用を有効にする
  }
}
```

`citations.enabled`が`true`に設定されている場合、Claudeはその検索結果の情報を使用する際に引用参照を含みます。これにより、以下が可能になります。

* カスタムRAGアプリケーションのための自然な引用
* 独自のナレッジベースと連携する際の出典元表示
* 検索結果を返すカスタムツールのためのウェブ検索品質の引用

`citations`フィールドが省略された場合、引用はデフォルトで無効になります。

引用はオールオアナッシングです。リクエスト内のすべての検索結果で引用を有効にするか、すべてで無効にする必要があります。異なる引用設定を持つ検索結果を混在させるとエラーになります。一部のソースで引用を無効にする必要がある場合は、そのリクエスト内のすべての検索結果で無効にする必要があります。

## ベストプラクティス

### ツールベースの検索（方法1）

* **動的コンテンツ**: リアルタイム検索や動的RAGアプリケーションに使用します。
* **エラー処理**: 検索が失敗したときに適切なメッセージを返します。
* **結果の制限**: コンテキストのオーバーフローを避けるため、最も関連性の高い結果のみを返します。

### トップレベルの検索（方法2）

* **事前に取得したコンテンツ**: すでに検索結果がある場合に使用します。
* **バッチ処理**: 一度に複数の検索結果を処理するのに理想的です。
* **テスト**: 既知のコンテンツで引用の動作をテストするのに最適です。

### 一般的なベストプラクティス

1. **結果を効果的に構造化する**

    * 明確で永続的なソースURLを使用する
    * 説明的なタイトルを提供する
    * 長いコンテンツを論理的なテキストブロックに分割する
2. **一貫性を維持する**

    * アプリケーション全体で一貫したソース形式を使用する
    * タイトルがコンテンツを正確に反映していることを確認する
    * 書式設定の一貫性を保つ
3. **エラーを適切に処理する**

    ```
    def search_with_fallback(query):
        try:
            results = perform_search(query)
            if not results:
                return {"type": "text", "text": "結果が見つかりませんでした。"}
            return format_as_search_results(results)
        except Exception as e:
            return {"type": "text", "text": f"検索エラー: {str(e)}"}

    ```

## 制限事項

* 検索結果のコンテンツブロックはベータヘッダーでのみ利用可能です。
* 検索結果内ではテキストコンテンツのみがサポートされています（画像やその他のメディアはサポートされていません）。
* `content`配列には少なくとも1つのテキストブロックが含まれている必要があります。
