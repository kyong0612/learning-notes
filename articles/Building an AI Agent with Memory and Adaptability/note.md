# Building an AI Agent with Memory and Adaptability

ref: <https://diamantai.substack.com/p/building-an-ai-agent-with-memory>

## 概要

「Building an AI Agent with Memory and Adaptability」というブログ記事では、LangGraphとLangMemを使用して、記憶機能を持つ高度なAIエージェントの実装方法について詳しく解説しています。このチュートリアルでは、DeepLearning.AIの「Long-Term Agentic Memory With LangGraph」コースを元に、電子メールアシスタントをシンプルに作成する方法を紹介しています。

## 記憶の重要性

通常のAIシステムは各セッション間で「記憶」を持たず、常に最初から始める必要があります。これは毎朝何も覚えていない新しいアシスタントを雇うようなものです。このブログでは、人間の脳のように機能する3つのタイプの記憶を持つエージェントを構築することの重要性を説明しています：

![人間の脳のように機能する記憶システム](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff17dfe3b-319f-418c-a6c3-60fdcf64a062_1265x727.png)

## 3つの記憶タイプ

### 1. セマンティック・メモリ（事実）

- エージェントの「百科事典」のような役割
- 「Aliceは API ドキュメントの担当者」や「Johnは朝のミーティングを好む」などの事実を記憶
- 特定の経験と関係なく存在する知識

### 2. エピソード・メモリ（例）

- エージェントの「フォトアルバム」のような役割
- 過去の特定のイベントや対話を記憶
- 「前回このクライアントが締め切り延長についてメールしたとき、私の応答が硬すぎて摩擦を生んだ」などの特定の記憶

### 3. 手続き的メモリ（指示）

- エージェントの「筋肉の記憶」のような役割
- 学習された行動が自動的になる
- 「APIドキュメントに関するメールは常に優先する」などのプロセス

## 実装手順

### 1. セットアップと初期化

```python
import os
from dotenv import load_dotenv
from typing import TypedDict, Literal, Annotated, List
from langgraph.graph import StateGraph, START, END, add_messages
# その他の必要なインポート

# 環境の初期化
load_dotenv()
llm = init_chat_model("openai:gpt-4o-mini")
store = InMemoryStore(index={"embed": "openai:text-embedding-3-small"})
```

### 2. エージェントの「脳」：状態の定義

```python
class State(TypedDict):
    email_input: dict  # 受信メール
    messages: Annotated[list, add_messages]  # 会話履歴
    triage_result: str # トリアージの結果（無視、通知、応答）
```

### 3. トリアージセンター：何をするか決める（エピソード・メモリを使用）

```python
class Router(BaseModel):
    reasoning: str = Field(description="分類の背後にある段階的な推論")
    classification: Literal["ignore", "respond", "notify"] = Field(
        description="メールの分類：'ignore'、'notify'、または'respond'"
    )
```

このコンポーネントでは、エピソード・メモリを利用して、過去に処理したメールの例からメールの分類方法を学習します。

### 4. セマンティック・メモリを使用したツールの定義

```python
@tool
def write_email(to: str, subject: str, content: str) -> str:
    """メールを作成して送信します"""
    return f"メールが{to}に件名'{subject}'で送信されました"

# その他のツール
manage_memory_tool = create_manage_memory_tool(namespace=("email_assistant", "{langgraph_user_id}", "collection"))
search_memory_tool = create_search_memory_tool(namespace=("email_assistant", "{langgraph_user_id}", "collection"))
```

### 5. 応答エージェント：コアアシスタントの作成（セマンティック・メモリ使用）

```python
def create_agent_prompt(state, config, store):
    messages = state['messages']
    user_id = config["configurable"]["langgraph_user_id"]
    
    # 手続き的メモリから現在の応答プロンプトを取得
    system_prompt = store.get(("email_assistant", user_id, "prompts"), "response_prompt").value
    
    return [{"role": "system", "content": system_prompt}] + messages
```

### 6. グラフ構築：各部分の接続

![エージェントのワークフロー図](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6a05a6f3-98cb-4f1d-96cb-ceb1e2363f61_303x249.png)

### 7. 手続き的メモリの追加（指示の更新）

フィードバックを基に自身の指示を改善する機能を追加：

```python
def optimize_prompts(feedback: str, config: dict, store: InMemoryStore):
    """フィードバックに基づいてプロンプトを改善します"""
    # 現在のプロンプトを取得
    # 改善されたプロンプトを作成
    # 改善されたプロンプトを保存
```

### 8. 完全な記憶強化エージェントの実行

フィードバック前と後での同じメールへの応答の違い：

**最適化前**:
> "APIドキュメントについて問い合わせているようですね。特定の質問があるか特定の情報が必要な場合は、お知らせください！"

**最適化後**:
> "APIドキュメントについて問い合わせていて、特定の問題として欠落しているエンドポイントについて言及されていることに気づきました。どのエンドポイントを探しているのか、または参照している特定のAPIについての詳細を教えていただけますか？これにより、問題の解決にもっと効果的に案内できます。"

## 完全なエージェント構造図

![完全なエージェント構造](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0013e3be-12c1-4a60-88f2-acd75408e520_1081x721.png)

## 結論と主要なメリット

1. **継続的な学習**: セッション間で「忘れない」エージェントが各対話から知識を蓄積し改善します

2. **適応性**: エージェントは明示的な再プログラミングなしで好み、コミュニケーションスタイル、優先順位に適応できます

3. **文脈認識**: 事実、例、手順を記憶することで、ユーザーの世界に対する深い理解を反映した応答が可能になります

4. **自己改善**: 手続き的記憶システムを通じて、エージェントはフィードバックに基づいて自身の行動を進化させることができます

5. **実用的応用**: この実装は、これらの概念が日常的なコミュニケーションを処理することで大幅な時間節約ができる現実世界のメールアシスタントにどのように適用されるかを示しています

このアプローチは、インタラクションから学習しない静的なAIシステムからの大きな進歩を表し、ユーザーのニーズを真に理解し、時間の経過とともに適応するアシスタントに近づいています。

完全なコードチュートリアルはGitHubで利用できます: [https://github.com/NirDiamant/GenAI_Agents/blob/main/all_agents_tutorials/memory-agent-tutorial.ipynb](https://github.com/NirDiamant/GenAI_Agents/blob/main/all_agents_tutorials/memory-agent-tutorial.ipynb)
