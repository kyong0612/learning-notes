# Announcing Genkit for Python and Go

ref: <https://firebase.blog/posts/2025/04/genkit-python-go/>

![Genkit ロゴ](https://firebasestorage.googleapis.com/v0/b/first-class-blog.appspot.com/o/svg%2FGenkit_blur.svg?alt=media&token=0e4c75b7-b661-4b77-8414-abd6e001ca52)

## 概要

Firebaseが、AIアプリケーション構築のためのオープンソースフレームワーク「Genkit」のPython版（アルファ）とGo版（ベータ）を発表しました。これにより、以前発表されたNode.js版に加えて、より多くの開発者エコシステムでGenkitの機能が利用可能になります。

## Genkitとは

Genkitは、AIアプリケーション開発における複雑さに対処するために設計されたオープンソースフレームワークです。主な特徴：

- 内蔵ツールと監視機能を備えたフレームワーク
- Google、OpenAI、Anthropic、Ollamaなど様々なAIモデルへの統一API
- アプリケーションの迅速な反復開発とデバッグをサポート
- Google CloudやFirebaseへのデプロイ後の監視機能

## Python版とGo版の発表

- **Genkit for Python（アルファ）**：実験や初期開発に最適。APIは今後ユーザーフィードバックに基づいて急速に進化する可能性がありますが、すべての主要機能は利用可能です。
- **Genkit for Go（ベータ）**：豊富な機能セットを持ち、本番環境への準備が進んでいる段階です。

## パートナー企業とプラグインエコシステム

以下の企業がGenkitプラグインを開発しており、エコシステムを拡大しています：

- [Pinecone](https://docs.pinecone.io/integrations/firebase-genkit)
- [Astra DB](https://github.com/datastax/genkitx-astra-db)
- [Neo4j](https://github.com/neo4j-partners/genkitx-neo4j)
- [AuthO](https://github.com/auth0-lab/auth0-ai-js/tree/main/packages/ai-genkit)
など

これらのプラグインにより、AIアプリケーションに専門ツールやサービスをシームレスに統合できます。

## Genkit for Python（アルファ）

Python版は直感的で簡潔な構文を持ち、Pydanticを活用した強力な型サポートを提供する非同期APIを特徴としています。

### 構造化出力の例

```python
from pydantic import BaseModel, Field
from genkit.ai import Genkit
from genkit.plugins.google_genai import GoogleAI

ai = Genkit(
    plugins=[GoogleAI()],
    model='googleai/gemini-2.0-flash',
)

class RpgCharacter(BaseModel):
    name: str = Field(description='name of the character')
    backstory: str = Field(description='backstory')
    abilities: list[str] = Field(description='list of abilities (3-4)')

@ai.flow()
async def structured_character_flow(name: str) -> RpgCharacter:
    """Generates a character profile conforming to the schema."""
    result = await ai.generate(
        prompt=f'Generate an RPG character named {name}',
        output_schema=RpgCharacter,
    )
    return result.output
```

### エージェンティブツール使用の例

```python
# 簡潔さのため一部省略

class ConversionInput(BaseModel):
    amount: float

@ai.tool()
async def convert_currency(input: ConversionInput) -> float:
    """Use this tool to convert USD to EUR"""
    print(f"Converting {input.amount} USD...")
    return input.amount * 0.92

@ai.flow()
async def currency_conversion_flow(amount: float) -> str:
    """Asks the model to convert currency, potentially using the tool."""
    response = await ai.generate(
        prompt=f'How much is {amount} USD in EUR?',
        tools=[convert_currency],
    )
    return response.text()
```

### 利用可能なPythonプラグイン

- [Google GenAI](https://python.api.genkit.dev/reference/plugins/google-genai/)：GoogleのGemini、Imagen、埋め込みモデルへのアクセス
- [Ollama](https://python.api.genkit.dev/reference/plugins/ollama/)：Gemma、Llama、Mistralなどのオープンモデルをローカルで実行
- [Flask統合](https://python.api.genkit.dev/flask/)：Flask webサーバーを通じたGenkitフローの提供
- [Firestore](https://python.api.genkit.dev/reference/plugins/firestore/)：Firestoreベクター検索を使用したデータ検索

## Genkit for Go（ベータ）

Go版は堅牢で明示的なAPIと強力な型安全性を提供し、スケーラブルなアプリケーション構築に適しています。

### 構造化出力の例

```go
// 簡潔さのため一部省略

type RpgCharacter struct {
    Name      string   `json:"name"`
    Backstory string   `json:"backstory"`
    Abilities []string `json:"abilities"`
}

func main() {
    ctx := context.Background()
    g, err := genkit.Init(ctx,
        genkit.WithPlugins(&googlegenai.GoogleAI{}),
        genkit.WithDefaultModel("googleai/gemini-2.0-flash"),
    )
    
    characterPrompt, _ := genkit.DefinePrompt(g, "characterPrompt",
        ai.WithPrompt("Generate RPG character named {{name}}..."),
        ai.WithInputType(RpgCharacter{Name: "Legolas"}) // デフォルトは "Legolas"
        ai.WithOutputType(RpgCharacter{}),
    )

    genkit.DefineFlow(g, "structuredCharacterFlow",
        func(ctx context.Context, name string) (*RpgCharacter, error) {
            resp, err := characterPrompt.Execute(ctx, ai.WithInput(RpgCharacter{Name: name}))
            if err != nil {
                return nil, err
            }

            var character RpgCharacter
            if err := resp.Output(&character); err != nil {
                return nil, err
            }
            return &character, nil
        },
    )
    
    // HTTPサーバーの設定部分省略
}
```

実行例：

```
curl -X POST localhost:8080/structuredCharacterFlow \
-H "Content-Type: application/json" \
-d '{"data": "Elara"}'
```

### エージェンティブツール使用の例

```go
// 簡潔さのため一部省略

func main() {
    ctx := context.Background()
    g, err := genkit.Init(ctx, genkit.WithPlugins(&googlegenai.GoogleAI{}))
    
    convertCurrencyTool := genkit.DefineTool(g, "convertCurrencyTool",
        "Use this tool to convert USD to EUR",
        func(ctx *ai.ToolContext, amount float64) (float64, error) {
            log.Printf("Converting %f USD", amount)
            return amount * 0.92, nil
        },
    )

    flow := genkit.DefineFlow(g, "convertCurrencyFlow",
        func(ctx context.Context, amount float64) (string, error) {
            return genkit.GenerateText(ctx, g,
                ai.WithModelName("googleai/gemini-2.0-flash"),
                ai.WithPrompt("How much is %f USD in EUR?", amount),
                ai.WithTools(convertCurrencyTool),
            )
        },
    )
    
    // HTTPサーバーの設定部分省略
}
```

実行例：

```
curl -X POST localhost:8080/convertCurrencyFlow \
-H "Content-Type: application/json" \
-d '{"data": 190.00}'
```

### 利用可能なGoプラグイン

- [Google GenAI](https://firebase.google.com/docs/genkit-go/plugins/google-genai)：Geminiモデルと埋め込みへのアクセス
- [Google Cloud Vertex AI](https://firebase.google.com/docs/genkit-go/plugins/vertex-ai)：Google CloudのAIプラットフォームとの統合
- [Ollama](https://firebase.google.com/docs/genkit-go/plugins/ollama)：オープンモデルをローカルで実行
- [Pinecone](https://docs.pinecone.io/integrations/firebase-genkit)：Pineconeベクターデータベースへの接続
- [pgvector](https://firebase.google.com/docs/genkit-go/pgvector)：PostgreSQLベクターストレージとの統合
- [Google Cloud Telemetry](https://firebase.google.com/docs/genkit-go/plugins/google-cloud)：監視データのエクスポート

## 迅速な反復開発のための開発者ツール

Genkitは、Python、Go、Node.jsのすべてで一貫した専用ツールを提供し、AIアプリケーション開発特有の課題に対処します。

CLIと直感的なブラウザベースの**開発者UI**の主な機能：

- **より速い実験**：UIでフロー、プロンプト、ツールをインタラクティブに実行・反復
- **効率的なデバッグ**：実行トレースの視覚化、入出力の検査、ログの表示
- **信頼性の高い評価**：事前定義されたデータセットに対してAIワークフローをテスト

開発者UIの起動方法：

- Go：`genkit start -- go run main.go`
- Python：`genkit start -- python main.py`

![開発者UI画面](https://firebasestorage.googleapis.com/v0/b/first-class-blog.appspot.com/o/posts%2Fgenkit-flow_1600x800.webp?alt=media&token=284b5cf8-6ee1-4711-a251-635931742fa9)

## 始め方と今後の計画

AIアプリケーション開発を始めるための包括的なドキュメント：

- Python：[Genkit for Python入門](https://python.api.genkit.dev/)（アルファ - 実験に最適）
- Go：[Genkit for Go入門](http://firebase.google.com/docs/genkit-go/get-started-go)（ベータ - 本番環境への準備段階）

今後の計画として、Python版とGo版をNode.js版と同等の機能に発展させることと、各言語固有の利点を活かした統合を進めることが挙げられています。

質問やフィードバックは[Discordサーバー](https://discord.gg/qXt5zzQKpc)、[Stack Overflow](https://stackoverflow.com/questions/tagged/genkit)、または[GitHubイシュートラッカー](https://github.com/firebase/genkit/issues)で受け付けています。

## 結論

Genkitは、AI開発における複雑さを軽減し、迅速な開発と安定した運用を支援するフレームワークです。今回のPythonとGo言語対応の追加により、より多くの開発者がこのツールを活用できるようになりました。統一されたAPI、強力な開発ツール、そして拡張可能なプラグインシステムにより、AIアプリケーション開発のプロトタイピングから本番環境へのデプロイまでをシンプル化します。
