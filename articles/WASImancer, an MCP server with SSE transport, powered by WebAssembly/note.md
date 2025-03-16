# WASImancer, an MCP server with SSE transport, powered by WebAssembly

ref: <https://k33g.hashnode.dev/wasimancer-an-mcp-server-with-sse-transport-powered-by-webassembly>

## はじめに

最近、将来のデモンストレーション用に、ChatBotが使用できるMCPサーバーが必要になりました（ChatBotがGitHubからソースコードをダウンロードして分析できるよう、MCPサーバーに「依頼」できる必要がありました）。そして、他のマシン上の複数のChatBotも同じことができる必要がありました。

提供されているMCPサーバーの例のほとんどは**STDIO**トランスポートを使用していますが、これはMCPサーバーがChatBotと同じマシンにローカルにインストールされている必要があることを意味します。私の場合、これはマシンごとに1つのMCPサーバーインスタンスが必要になることを意味します。

ワークステーションD

- ChatBot 3
- MCP STDIO Server 3

ワークステーションC

- ChatBot 2
- MCP STDIO Server 2

ワークステーションB

- ChatBot 1
- MCP STDIO Server 1

これは本当にスケーラブルではなく、各更新に必要なデプロイメントについても言及する必要がありません。

そのため、「リモート」MCPサーバーが必要でした。「リモート」とは、マシンAにインストールして、マシンBにインストールされたChatBotだけでなく、マシンCにインストールされたChatBotなども使用できることを意味します。幸いなことに、MCPプロトコルは2番目のタイプのトランスポート、SSEトランスポートを提供しており、これによって問題を解決し、次のようなアーキテクチャを持つことができます：

ワークステーションD、C、B → APIリクエスト → ワークステーションA上のMCP SSEサーバー → レスポンス → ChatBot 1、2、3

そこで、現在および将来のニーズを満たすSSEトランスポートを備えたMCPサーバーを作成することにしました。できる限りスケーラブルである必要があり、そうして**WASImancer**プロジェクトが誕生しました。「WASI」というプレフィックスから、私が何を考えていたかが分かるかもしれません。

> プロジェクトのリポジトリ: [https://github.com/sea-monkeys/WASImancer](https://github.com/sea-monkeys/WASImancer)

## WASImancerの提供機能

### 実装

私はNode.jsが大好きなので、次のSDKを使用することにしました：[typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)、これは[https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)が提供する公式SDKの1つです。MCPサーバーをコーディングするために、JavaScriptを使い続けました。

序文で説明したように、スケーラブルなサーバー（サーバーのコアを変更せずに機能を追加できることを目標として）が欲しかったので、プラグインシステムが必要なことは明らかでした。私のもう一つの開発の情熱は[**WebAssembly**](https://webassembly.org/)、特に[**WASI**](https://wasi.dev/)です。そして私のお気に入りのフレームワークは[**Extism**](https://extism.org/)で、Node.jsのサポートを含め、WASMプラグインベースのアプリケーションを実装するために必要なすべてのツールを提供しています。だから私は始めるためのすべてのツールを持っていました。

> **重要**：[**Extism**](https://extism.org/)のおかげで、Rust、Go、C++、Zigなど、さまざまな言語でプラグインを開発できます。

#### 機能

**WASImancer** MCPサーバーが提供する機能は次のとおりです：

- **ツール**のサポート：`plugins.yml`ファイルに**ツール**設定を定義し、各ツールはオンデマンドで実行できる1つ以上の関数を提供する**WebAssembly**プラグインです。

- **リソース**のサポート：`resources.yml`ファイルでリソースとその内容を定義します。

- **プロンプト**のサポート：`prompts.yml`ファイルでプロンプトとその内容を定義します。

MCPサーバーの目的は、**ツール**、**リソース**、**プロンプト**を通じて生成型AIアプリケーションに「超能力」をもたらすことです。

**MCPツール**により、MCPサーバーは「リモートクライアント」（ChatBotなど）に対して、同じクライアントの要求に応じてMCPサーバーが実行できるツールのリストを「提供」できます。たとえば、Webページの内容をダウンロードできる`fetch`ツール（**ツール**にはいくつかの入力パラメータと1つの出力結果があります。クライアントによるリモート関数呼び出しと考えてください）。

**MCPリソース**は、クライアントが要求できる静的または動的な情報要素です。これらは多くの場合、ChatBotのLLM、または他の生成型AIアプリケーションが使用できるコンテキストデータを「保存」するために使用されます（例えば、ChatBotのシステム指示：`あなたはスタートレックの専門家です、バルカン人のように話してください`）。MCPサーバーは持っているリソースのリストを提供し、クライアントはその内容をリクエストできます。

> 現時点では、静的リソースのみを実装しています。

**MCPプロンプト**は、LLMがMCPサーバーとどのように対話するかを定義するテンプレートです。これにより、クライアントは動的かつ誘導的な方法でそれらを使用できます。テンプレートは`この関数は何をしますか${function_code}`のようなものです。したがって、サーバーは利用可能なプロンプトのリストを提供し、クライアントは特定のパラメータを持つ特定のプロンプトをリクエストできます。この例では、クライアントが関数コードを「送信」し、MCPサーバーはテンプレートと関数コードから構築された文字列で応答します。

しかし、実際に練習してみると理解しやすいでしょう。

## 私の最初のMCPサーバー（SSEトランスポート付き）

### 目標

別のプロジェクトのために、LLMがサイコロを振れるようにする必要がありました。LLMはN個のX面サイコロを振り、サイコロの合計を取得できます。

### 準備

**WASImancer**プロジェクトの構造は次のとおりです（もちろん設定可能です）：

```bash
├── roll-dice-project
    ├── compose.yml
    ├── plugins
    │   ├── plugins.yml
    │   └── roll-dice
    │       ├── go.mod
    │       ├── main.go
    │       └── wasimancer-plugin-roll-dice.wasm
    ├── prompts
    │   └── prompts.yml
    └── resources
        └── resources.yml
```

プロジェクト構造を準備します：

```bash
mkdir -p roll-dice-project/plugins/roll-dice
mkdir -p roll-dice-project/resources
mkdir -p roll-dice-project/prompts
touch roll-dice-project/compose.yml
touch roll-dice-project/plugins/plugins.yml
touch roll-dice-project/plugins/roll-dice/go.mod
touch roll-dice-project/plugins/roll-dice/main.go
touch roll-dice-project/prompts/prompts.yml
touch roll-dice-project/resources/resources.yml
```

> Docker Composeの使用は必須ではありませんが、**WASImancer**をインストールして実行する最も簡単な方法です。

### プラグイン開発

#### 定義

WebAssemblyプラグインを開発する前に、`roll-dice-project/plugins/plugins.yml`ファイルで定義します：

```yaml
plugins:

  - name: roll dice
    path: ./roll-dice/wasimancer-plugin-roll-dice.wasm
    version: 1.0.0
    description: roll dice
    functions:
      - displayName: rollDice
        function: rollDice
        arguments:
          - name: numFaces
            type: number
            description: number of faces on the dice
          - name: numDice
            type: number
            description: number of dice to roll
        description: a function to roll dice
```

#### ソースコード

プラグインは**Go**で書き、[**TinyGo**](https://tinygo.org/)でコンパイルしました。生活を楽にするために、GoとRustのプラグインをコンパイルするために必要なすべての依存関係（**Extism CLI**を含む）を含むDockerイメージを提供します。この記事の次のセクションでこれを見ていきます。

`go.mod`ファイルを次の内容で作成します：

```go
module wasimancer-plugin-dice-roll

go 1.23.0

require github.com/extism/go-pdk v1.1.1
```

次に、`main.go`ファイルを次の内容で作成します：

```go
package main

import (
    "encoding/json"
    "math/rand"
    "strconv"

    "github.com/extism/go-pdk"
)

type Arguments struct {
    NumFaces int `json:"numFaces"`
    NumDice  int `json:"numDice"`
}

// RollDice rolls a specified number of dice with a specified number of faces
// and returns the sum of the results

//export rollDice
func rollDice() {

    arguments := pdk.InputString()

    var args Arguments
    json.Unmarshal([]byte(arguments), &args)
    numFaces := args.NumFaces
    numDice := args.NumDice

    // Sum of the dice roll results
    sum := 0

    // Roll each die and add the result to the sum
    for i := 0; i < numDice; i++ {
        // Generate a random number between 1 and numFaces
        dieValue := rand.Intn(numFaces) + 1
        sum += dieValue
    }

    pdk.OutputString(strconv.Itoa(sum))

}

func main() {
}
```

#### WASMプラグインのビルド

一連のツールをインストールする必要性を避けるために、このDockerイメージ`k33g/wasm-builder:0.0.0`を使用できます。そのソースコードはここにあります：[wasm-builder.Dockerfile](https://github.com/sea-monkeys/WASImancer/blob/main/wasm-builder.Dockerfile)。

プラグインをコンパイルするには、`roll-dice-project/plugins/roll-dice`ディレクトリで次のコマンドを使用します：

```bash
docker run --rm -v "$PWD":/roll-dice -w /roll-dice k33g/wasm-builder:0.0.0 \
  bash -c "
    go mod tidy && \
    tinygo build -scheduler=none --no-debug \
      -o wasimancer-plugin-roll-dice.wasm \
      -target wasi main.go
  "
```

これにより、同じディレクトリに`wasimancer-plugin-roll-dice.wasm`ファイルが作成されます。

#### Extism CLIでWASMプラグインをテストする

新しいプラグインをテストする場合は、次のコマンドを使用します：

```bash
docker run --rm -v "$PWD":/roll-dice -w /roll-dice k33g/wasm-builder:0.0.0 \
  extism call wasimancer-plugin-roll-dice.wasm rollDice \
  --input '{"numFaces":6,"numDice":2}' \
  --log-level "info" \
  --wasi
```

これで複雑な部分は終わりました。次に進みましょう。

### リソースの設定

シンプルに保ち、将来の記事でLLMに指示を与えるために使用される単一のリソースを提供します。

`roll-dice-project/resources/resources.yml`ファイルを編集し、次の内容を追加します：

```yaml
resources:
  static:
    - name: llm-instructions
      uri: llm://instructions
      contents:
        - text: You are a useful AI agent. You can help users to roll dice.
```

### プロンプトの設定

次に、`roll-dice-project/prompts/prompts.yml`ファイルを編集し、次の内容を追加します：

```yaml
prompts:
  predefined:
    - name: roll-dice
      arguments:
        - name: numFaces
          type: string
        - name: numDice
          type: string
      messages:
        - text: 🎲 Rolling ${numDice} dice(s) with ${numFaces} faces...
          role: user
```

つまり、MCPサーバーに送信する引数を定義する必要があります。サーバーはテンプレート内の値を置き換えます。たとえば、`numFaces="6"`と`numDice="2"`の場合、MCPサーバーは`🎲 Rolling 2 dice(s) with 6 faces...`を返します。

> **注意**：引数は常に`string`型です

これでMCPサーバーを起動する準備ができました。

## MCPサーバーのテスト

**WASImancer**を配布するためのイメージを作成しました：`k33g/wasimancer:0.0.0`、そのソースコードはここにあります：[Dockerfile](https://github.com/sea-monkeys/WASImancer/blob/main/Dockerfile)。

### MCPサーバーの起動

**WASImancer**をインストールして実行する最も簡単な方法は、Docker Composeを使用することです。`roll-dice-project/compose.yml`ファイルを次の内容で編集します：

```yaml
services:
  wasimancer-server:
    image: k33g/wasimancer:0.0.0
    environment:
      - HTTP_PORT=3001
      - PLUGINS_PATH=./plugins
      - PLUGINS_DEFINITION_FILE=plugins.yml
      - RESOURCES_PATH=./resources
      - RESOURCES_DEFINITION_FILE=resources.yml
      - PROMPTS_PATH=./prompts
      - PROMPTS_DEFINITION_FILE=prompts.yml
    ports:
      - 3001:3001
    volumes:
      - ./resources:/app/resources
      - ./plugins:/app/plugins
      - ./prompts:/app/prompts
```

次のコマンドでサーバーを起動します（`roll-dice-project`ディレクトリで）：

```bash
docker compose up
```

> サーバーは`http://0.0.0.0:3001`でリッスンします

### MCPサーバーのテスト

MCPサーバーをテストするための非常に便利な公式ツールがあります：[**Inspector**](https://github.com/modelcontextprotocol/inspector)。次のコマンドでインストールして実行できます：

```bash
npx @modelcontextprotocol/inspector
```

ブラウザで`http://localhost:5173`を開きます。以下のユーザーインターフェースが表示されるはずです：

- **Transport Type**で`SSE`を選択します
- **URL**フィールドにMCPサーバーのURLを入力し、その後に`/sse`を追加します。つまり`http://0.0.0.0:3001/sse`です
- 最後に、**Connect**ボタンをクリックします

**Resources**タブに移動します：

- **List Resources**をクリックすると、リソースのリストが表示されます（この場合、`llm-instructions`のみ）
- リソースをクリックすると、右側のパネルにリソースの内容が表示されます

次に**Prompt**タブをクリックし、`roll-dice`プロンプトを選択すると、定義したパラメータを持つ入力フォームが右側のパネルに表示されます：

フィールドに入力して**Get Prompt**ボタンをクリックすると、変数を含むプロンプトテンプレートの内容が表示されます：

そして**Tools**も全く同じ原理です。`numFaces`と`numDice`の値を変更して**Run Tool**をクリックするたびに、WASMプラグインが実行されます：

🎉 これで完全に機能するSSEトランスポートを使用したMCPサーバーができました。将来の記事でこれを使用し、[LangChainJS](https://js.langchain.com/)と[Ollama](https://ollama.com/)を使ってこのMCPサーバー用のクライアントアプリケーションを作成する方法を説明します。
