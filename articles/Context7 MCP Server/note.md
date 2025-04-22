# Context7 MCP Server

ref: <https://github.com/upstash/context7>

## 利用可能なツール

Context7 MCP Server は、LLMが最新のライブラリドキュメントを取得するために、以下の2つの主要なツールを提供します。

1. **`resolve-library-id`**
    * **説明:** 一般的なライブラリ名 (例: `react`) を、Context7が認識できる一意のID (例: `facebook/react`) に解決します。`get-library-docs` を使用する前に、このツールで正確なIDを取得する必要があります。
    * **入力パラメータ:**
        * `libraryName` (文字列, 任意): 検索したいライブラリ名。
    * **出力:** 検索結果に一致したライブラリ名と、それに対応するContext7互換IDのリスト。

2. **`get-library-docs`**
    * **説明:** `resolve-library-id` で取得したContext7互換IDを使用して、特定のライブラリの最新ドキュメントを取得します。
    * **入力パラメータ:**
        * `context7CompatibleLibraryID` (文字列, **必須**): `resolve-library-id` で取得した正確なライブラリID。
        * `topic` (文字列, 任意): ドキュメント内で焦点を当てる特定のトピック (例: `hooks`, `routing`)。
        * `tokens` (数値, 任意, デフォルト: 5000): 取得するドキュメントの最大トークン数。多いほど多くの情報が得られますが、コストも増加します。
    * **出力:** 指定されたライブラリのドキュメントテキスト。

**利用フロー:**

LLM (またはそれを使用するクライアント) は、通常以下の手順でドキュメントを取得します。

1. ユーザーが特定のライブラリに関する情報を要求する (例: 「Next.jsのルーティングについて教えて」)。
2. `resolve-library-id` ツールを `libraryName="nextjs"` のようなパラメータで呼び出す。
3. ツールから返されたリストの中から、適切な Context7互換ID (例: `vercel/nextjs`) を特定する。
4. `get-library-docs` ツールを `context7CompatibleLibraryID="vercel/nextjs"` および必要に応じて `topic="routing"` のようなパラメータで呼び出す。
5. ツールから返されたドキュメントテキストをコンテキスト情報として利用し、ユーザーの質問に回答する。

```markdown
# Context7 MCP - Up-to-date Docs For Any Prompt
[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithy badge](https://smithy.ai/badge/@upstash/context7-mcp)](https://smithy.ai/server/@upstash/context7-mcp)

### 👎 Without Context7

LLMs rely on outdated or generic information about the libraries you use. You get:
- 👎 Code examples are outdated and based on year-old training data
- 👎 Hallucinated APIs don't even exist
- 👎 Generic answers for old package versions

### 👍 With Context7

Context7 MCP pulls up-to-date, version-specific documentation and code examples straight from the source — and places them directly into your prompt.

Add `use context7` to your prompt in Cursor:

```txt
Create a basic Next.js project with app router. use context7
```

```txt
Create a script to delete the rows where the city is "" given PostgreSQL credentials. use context7
```

Context7 fetches up-to-date code examples and documentation right into your LLM's context.

* 1️⃣ Write your prompt naturally
* 2️⃣ Tell the LLM to `use context7`
* 3️⃣ Get working code answers

No tab-switching, no hallucinated APIs that don't exist, no outdated code generations.
