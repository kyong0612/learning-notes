# Function calling using LLMs

ref: <https://martinfowler.com/articles/function-call-LLM.html>

この記事は、LLM（大規模言語モデル）が外部システムと連携するための「Function calling」機能について解説しています。LLMは直接関数を実行するのではなく、関数呼び出しを記述したデータ構造を生成し、それを別のプログラムが実行します。

## イントロダクション

* **Function calling**: LLMがテキスト生成を超えて、外部ツールや実世界のアプリケーションと対話できるようにする機能です。
* LLMはユーザーの自然言語入力を分析し、意図を抽出して、関数名と必要な引数を含む構造化された出力（通常JSON）を生成します。
* LLM自体は関数を実行せず、適切な関数を特定し、パラメータを収集し、構造化された形式で情報を提供します。この出力はプログラムのランタイム環境で実行されます。
* 例として、ユーザーが「シャツを探しています」と言うと、ショッピングエージェントが製品検索や製品詳細取得といった適切なAPIを呼び出します。

    ![](function-call-LLM/image2.png)
    図1: 自然言語リクエストから構造化出力へ

## 一般的なエージェントのひな形 (Scaffold of a typical agent)

* Pythonで記述された`ShoppingAgent`の例が示されています。
* エージェントはユーザーの入力と会話履歴に基づいて、定義済みのアクションセットから次のアクションを選択し実行します。

    ```python
    class ShoppingAgent:
        def run(self, user_message: str, conversation_history: List[dict]) -> str:
            if self.is_intent_malicious(user_message):
                return "Sorry! I cannot process this request."
            action = self.decide_next_action(user_message, conversation_history)
            return action.execute()
        # ... (decide_next_action, is_intent_malicious)
    ```

* 可能なアクションクラス（`Search`, `GetProductDetails`, `Clarify`）も定義されます。

## ユニットテスト (Unit tests)

* エージェントの振る舞いを検証するためのユニットテストの例が提示されています。
  * `test_next_action_is_search`
  * `test_next_action_is_product_details`
  * `test_next_action_is_clarify`

## システムプロンプト (System prompt)

* LLM（例: `gpt-4-turbo-preview`）にタスクのコンテキストを提供します。
  * 役割（例: ショッピングアシスタント）
  * 期待される出力形式（関数）
  * 制約や特別な指示（例: 不明瞭なリクエストの場合は明確化を求める）

    ```
    SYSTEM_PROMPT = """You are a shopping assistant. Use these functions:
    1. search_products: When user wants to find products (e.g., "show me shirts")
    2. get_product_details: When user asks about a specific product ID (e.g., "tell me about product p1")
    3. clarify_request: When user's request is unclear"""
    ```

* より高度なプロンプティング技術（One-shot prompting, Few-shot prompting）も言及されています。
* OpenAI API仕様に従って、LLMが呼び出せる関数（`SEARCH_SCHEMA`, `PRODUCT_DETAILS_SCHEMA`, `CLARIFY_SCHEMA`）とそのパラメータ、説明を定義します。

## エージェントのアクションスペースの制限 (Restricting the agent's action space)

* `eval`のような動的な関数呼び出しはセキュリティリスク（プロンプトインジェクションなど）があるため、明示的な条件ロジックでエージェントが呼び出せる関数を厳密に制御することが不可欠です。

## プロンプトインジェクションに対するガードレール (Guardrails against prompt injections)

* 悪意のあるユーザーがシステムプロンプトを明らかにさせたり、意図しないアクション（不正な返金、機密データの漏洩など）を実行させようとする可能性があります。
* 対策:
  * ユーザー入力のサニタイズ（正規表現、入力拒否リストなど従来技術）
  * LLMベースの検証（別のモデルが入力の操作、インジェクション試行、プロンプト悪用をスクリーニング）
* 基本的な拒否リストベースのガードの実装例が示されています。

    ```python
    def is_intent_malicious(self, message: str) -> bool:
        suspicious_patterns = [
            "ignore previous instructions",
            # ... 他のパターン
        ]
        message_lower = message.lower()
        return any(pattern in message_lower for pattern in suspicious_patterns)
    ```

## アクションクラス (Action classes)

* LLMの意思決定と実際のシステム操作の間のゲートウェイとして機能します。
* LLMの解釈を具体的なアクションに変換し、マイクロサービスや他の内部システムのAPIを呼び出します。
* `Search`, `GetProductDetails`, `Clarify` の具体的な`execute`メソッドの実装例が示されています。
* 会話履歴はUIのセッション状態で保存され、コンテキストを維持した対話を実現します。

    ![](function-call-LLM/image1.png)
    図2: ショッピングエージェントとの会話

## ボイラープレートを削減するためのリファクタリング (Refactoring to reduce boiler plate)

* LLMの関数仕様を詳細に定義する冗長なコードを削減するために、[instructor](https://pypi.org/project/instructor/)のようなライブラリが役立ちます。
* `instructor`はPydanticオブジェクトをOpenAIスキーマに準拠したJSONに自動的にシリアライズできます。
* アクションクラスをPydanticオブジェクトとして定義し、`NextActionResponse`クラスでラップすることで、コードが簡潔になります。

## このパターンは従来のルールエンジンを置き換えることができるか？ (Can this pattern replace traditional rules engines?)

* 従来のルールエンジンは、ルール数が増えると相互作用の複雑さが増し、テスト、予測、保守が困難になるという問題があります。
* LLMベースのシステムは、ユーザーの意図とコンテキストを理解し、静的なルールセットでは不可能な方法で推論できます。
* ビジネスユーザーやドメインエキスパートにとって、自然言語プロンプトでルールを表現する方が直感的である可能性があります。
* 実用的なアプローチとして、LLMによる推論と重要な決定を実行するための明示的な手動ゲートを組み合わせることが考えられます。

## Function calling vs Tool calling

* 「Tool calling」はより一般的で現代的な用語であり、LLMが外部世界と対話するために使用できる広範な機能セットを指します。
* カスタム関数の呼び出しに加えて、コードインタープリターや検索メカニズムなどの組み込みツールも含まれます。

## Function callingとMCP (Model Context Protocol) の関係

* [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)は、LLMベースのアプリケーションが外部世界と対話する方法を構造化するためのオープンプロトコルです。
* MCPはクライアントサーバーアーキテクチャを定義します。
  * **MCP Server**: データソースとHTTP経由で呼び出し可能なツール（関数）を公開するサーバー。
  * **MCP Client**: アプリケーションとMCP Server間の通信を管理するクライアント。
  * **MCP Host**: MCP Serverが提供するデータとツールを使用してタスクを達成するLLMベースのアプリケーション（例: `ShoppingAgent`）。

    ![](function-call-LLM/mcp.svg)
    図3: MCPを使用したショッピングエージェントの高レベルアーキテクチャ
* MCPの主な利点は、柔軟性と動的なツール発見です。エージェントは実行時にMCPServerに問い合わせて利用可能なツールを発見し、ユーザーのクエリに基づいて適切なツールを動的に選択・実行できます。
* これにより、LLMアプリケーションが固定ツールセットから分離され、モジュール性、拡張性、動的な機能拡張が可能になります。
* MCPサーバーとクライアント、およびそれらを使用するようにリファクタリングされた`ShoppingAgent`の例が示されています。

## 結論 (Conclusion)

* Function callingはLLMの強力な機能であり、新しいユーザーエクスペリエンスや高度なエージェントシステムの開発を可能にします。
* しかし、特にユーザー入力が機密性の高い関数やAPIをトリガーできる場合に、新たなリスクも生じます。
* 慎重なガードレール設計と適切な安全策により、これらのリスクの多くは効果的に軽減できます。
* 低リスクの操作からFunction callingを有効にし、安全メカニズムが成熟するにつれて徐々に重要な操作に拡張していくのが賢明です。
