# Using "tools" support (or function calling) with LangchainJS and Ollama

ref: <https://k33g.hashnode.dev/using-tools-support-or-function-calling-with-langchainjs-and-ollama>

## 目次

- [Using "tools" support (or function calling) with LangchainJS and Ollama](#using-tools-support-or-function-calling-with-langchainjs-and-ollama)
  - [目次](#目次)
  - [ツール？関数呼び出し？](#ツール関数呼び出し)
  - [LangchainJSとツールサポート（Ollamaを使用）](#langchainjsとツールサポートollamaを使用)
    - [温度](#温度)
    - [ツール](#ツール)
      - [引数スキーマ](#引数スキーマ)
      - [DynamicStructuredTool \& bindTools](#dynamicstructuredtool--bindtools)
    - [プロンプトと関数呼び出し](#プロンプトと関数呼び出し)

## ツール？関数呼び出し？

一部のLLMは**ツール**サポートを提供しており、**関数呼び出し**を可能にします。しかし、明確にしておきましょう：LLMは関数を実行することはできません。**ツール**サポートとは、フォーマットされたツールのリスト（以下のようなもの）をLLMに提供すると、`5と40を足す`のような質問をした際に、LLMが適切なツールとツールに提供する引数を特定できることを意味します。

このようなリストから：

```json
[
    {
        "type": "function",
        "function": {
            "name": "hello",
            "description": "特定の人物に名前で挨拶する",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "人物の名前"
                    }
                },
                "required": ["name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "addNumbers",
            "description": "2つの与えられた数値を足し算する",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "最初のオペランド"
                    },
                    "b": {
                        "type": "number",
                        "description": "2番目のオペランド"
                    }
                },
                "required": ["a", "b"]
            }
        }
    }
]
```

そして「2と40を足す」という質問で、このような応答（**「ツール呼び出し」**）が得られます：

```json
[{"name":"addNumbers","arguments":{"a":2,"b":40}}]
```

同じ質問に複数のツール参照がある場合、LLMは複数の**「ツール呼び出し」**を返します。例えば、「ボブに挨拶して、2と4を足す」という質問では：

```json
[
    {"name":"hello","arguments":{"name":"Bob"}},
    {"name":"addNumbers","arguments":{"a":2,"b":40}}
]
```

**そしてそれ以上は進みません！** `hello`と`addNumbers`関数を実装するのはあなた次第です。

**この主題に関するいくつかの参考資料**：

- ブログ記事：[ollama.com/blog/tool-support](https://ollama.com/blog/tool-support)
- 素晴らしい[Matt William](https://bsky.app/profile/technovangelist.bsky.social)による動画：[Function Calling in Ollama vs OpenAI](https://www.youtube.com/watch?v=RXDWkiuXtG0)

もちろん、LangchainJSはツールサポートの使用を容易にするヘルパーを提供しています。それらの使い方を見てみましょう。

## LangchainJSとツールサポート（Ollamaを使用）

**目的**：加算と乗算を実行する。

まず、次の`package.json`ファイルを含むディレクトリに新しいプロジェクトを作成します：

```json
{
  "name": "function-calling",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "@langchain/ollama": "^0.2.0",
    "dotenv": "^16.4.7",
    "langchain": "^0.3.15",
    "zod": "^3.24.1"
  }
}
```

そして`npm install`コマンドで依存関係をインストールします。

次に、以下のインポートを含む`index.js`ファイルを作成します：

```javascript
import { ChatOllama } from "@langchain/ollama"
import { z } from "zod"
import { tool } from "@langchain/core/tools"
```

> **Zod？**：Zodはランタイム型チェックに焦点を当てたJavaScript/TypeScriptスキーマ検証ライブラリです。データのスキーマを定義し、データがこれらのスキーマに一致することを検証できます。

今度は、チャットモデルをインスタンス化しましょう：

```javascript
const llm = new ChatOllama({
    model: 'qwen2.5:0.5b',
    baseUrl: "http://localhost:11434",
    temperature: 0.0,
})
```

> **注意**：ツールサポートを提供するLLMを選択する必要があります。Ollamaウェブサイトのこのリンクで検索できます：[ollama.com/search?c=tools](https://ollama.com/search?c=tools)

### 温度

モデルが正しく機能するために温度を`0.0`に設定することが、いくつかの重要な理由で不可欠です：

1. **決定性**：温度が`0.0`の場合、モデルは特定の入力に対して常に同じ出力を生成します。これにより、関数呼び出しの動作が予測可能で信頼性が高くなります。

2. **構造**：LLMは構文的に正しいJSON構造を生成する必要があります。したがって、変動性を避ける必要があります。

3. **パラメータの正確さ**：LLMはユーザーのリクエストからパラメータを正確に抽出する必要があります。つまり、呼び出す関数の引数です。

### ツール

次に、**ツール**を定義し、呼び出す関数に直接関連付けます。

#### 引数スキーマ

私たちの加算と乗算はどちらも2つの引数（2つのオペランド）を期待しています。LangchainJSの**ツール**には、これら2つの引数を記述するスキーマが必要です。両方の操作に同じものを使用します：

```javascript
const calculationSchema = z.object({
    a: z.number().describe("最初の数値"),
    b: z.number().describe("2番目の数値"),
})
```

#### DynamicStructuredTool & bindTools

LangchainJSは**ツール**を定義するための構造を提供しています：`[DynamicStructuredTool](https://v03.api.js.langchain.com/classes/langchain.tools.DynamicStructuredTool.html)`とそのような構造を作成するためのヘルパー`tool()`です。

それでは、それを使用して加算と乗算を作成しましょう：

```javascript
const additionTool = tool(
    async ({ a, b }) => {
      return a + b
    },
    {
      name: "addition",
      description: "Add numbers.",
      schema: calculationSchema,
    }
)

const multiplicationTool = tool(
  async ({ a, b }) => {
    return a * b
  },
  {
    name: "multiplication",
    description: "Multiply numbers.",
    schema: calculationSchema,
  }
)
```

ご覧のように、比較的シンプルです。次に、`bindTools`メソッドを使用して**ツール**をチャットモデル（`llm`）に「バインド」する必要があります：

```javascript
const llmWithTools = llm.bindTools([
  additionTool,
  multiplicationTool
])
```

つまり、`llm`を新しいチャットモデル（`llmWithTools`）に「変換」し、ツールのリスト（LLMが**ツール**と**引数**を認識して抽出するために参照できるようにするもの）を「接ぎ木」しました。次に、関数を呼び出すのに役立つ「マッピング」を作成する必要があります：

```javascript
let toolMapping = {
    "addition": additionTool,
    "multiplication": multiplicationTool
}
```

これで完了です。私たちは**「関数呼び出し」**を行う準備ができました。これは、LLMに**ツール**を認識するよう依頼し、生成AI​​アプリケーションがそれらを実行できるようにすることを含みます。

### プロンプトと関数呼び出し

したがって、以下のコードを使用してLLMにリクエストを「送信」できます：

```javascript
let llmOutput = await llmWithTools.invoke("30と12を足してください。そして21に2を掛けてください。")
```

そして、検出された**ツール**をリストするためにレスポンスを使用します：

```javascript
// 検出されたツール
for (let toolCall of llmOutput.tool_calls) {
    console.log("🛠️ ツール:", toolCall.name, "引数:", toolCall.args)
}
```

以下のような結果が得られます：

```bash
🛠️ ツール: addition 引数: { a: 30, b: 12 }
🛠️ ツール: multiplication 引数: { a: 21, b: 2 }
```

そして操作を実行するには、次のコードを使用します：

```javascript
// ツールを呼び出す
for (let toolCall of llmOutput.tool_calls) {
    let functionToCall = toolMapping[toolCall.name]
    let result = await functionToCall.invoke(toolCall.args)
    console.log("🤖 結果:", toolCall.name, "引数:", toolCall.args, "=", result)
}
```

以下のような結果が得られます：

```bash
🤖 結果: addition 引数: { a: 30, b: 12 } = 42
🤖 結果: multiplication 引数: { a: 21, b: 2 } = 42
```

これで完了です！再び、LangchainJSは私たちの生活を簡素化するために必要な要素を提供しています。今後の記事では、**「Model Context Protocol」**で**ツール**の概念をどのように使用するかを見ていきます。

> **MCP**についてもっと知りたい場合は、以下をお読みください：
>
> - [Model Context Protocolを理解する](https://k33g.hashnode.dev/understanding-the-model-context-protocol-mcp)
>
> - [WASImancer、WebAssemblyを活用したSSEトランスポート付きMCPサーバー](https://k33g.hashnode.dev/wasimancer-an-mcp-server-with-sse-transport-powered-by-webassembly)

この記事のコードはこちらで見つけることができます：[https://github.com/ollama-tlms-langchainjs/03-tools](https://github.com/ollama-tlms-langchainjs/03-tools)

それではまた。
