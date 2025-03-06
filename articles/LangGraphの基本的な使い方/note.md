# LangGraphの基本的な使い方

ref: <https://zenn.dev/pharmax/articles/8796b892eed183>

こんにちは。 [PharmaX](https://www.pharma-x.co.jp/) でエンジニアをしている諸岡（ [@hakoten](https://twitter.com/hakotensan)）です。

この記事では、大規模言語モデル（LLM）を活用したアプリケーションの開発を支援するフレームワークであるLangChain内にあるツールチェインの一つ、LangGraphについてご紹介します。

LangChainがどのようなものかについて知りたい方は、ぜひ一読していただけると幸いです。

※ LangGraphは、LangChainとシームレスに連携できるライブラリですが、この記事ではLangGraph自体の入門内容に焦点を当てており、LangChainについては詳しく触れませんので、ご了承ください。

# LangGraphとは

[LangGraph](https://langchain-ai.github.io/langgraph/) は、 [LangChain](https://www.langchain.com/) のツール群に含まれる一つで、各LLMエージェントのステップなどをグラフ化して状態管理を行うためのツールです。

LangGraphは、ステートマシンを作成し、複数のエージェントが協調して動作する「マルチエージェント」の構築を容易にすることを目的に開発されています。

LangChainのブログでは、LangGraphの開発のモチベーションや具体的な事例について詳しく紹介されていますので、ぜひそちらもご覧ください。

[**LangGraph** \\
\\
TL;DR: LangGraph is module built on top of LangChain to better enable creation of cyclical graphs, o\\
\\
![blog.langchain.dev favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://blog.langchain.dev)blog.langchain.dev\\
\\
![blog.langchain.dev thumbnail image](https://embed.zenn.studio/api/optimize-og-image/002060d062004659fc9d/https%3A%2F%2Fblog.langchain.dev%2Fcontent%2Fimages%2Fsize%2Fw1200%2F2024%2F01%2FBlog-header--1-.png)](https://blog.langchain.dev/langgraph/)

[https://blog.langchain.dev/langgraph/](https://blog.langchain.dev/langgraph/)

[**LangGraph: Multi-Agent Workflows** \\
\\
Links\\
\\* Python Examples\\
\\* JS Examples\\
\\* YouTube\\
\\
Last week we highlighted LangGraph - a new pack\\
\\
![blog.langchain.dev favicon image](https://www.google.com/s2/favicons?sz=14&domain_url=https://blog.langchain.dev)blog.langchain.dev\\
\\
![blog.langchain.dev thumbnail image](https://embed.zenn.studio/api/optimize-og-image/4be079fa2b7d9abacba4/https%3A%2F%2Fblog.langchain.dev%2Fcontent%2Fimages%2Fsize%2Fw1200%2F2024%2F01%2FScreenshot-2024-01-23-at-9.31.32-AM.png)](https://blog.langchain.dev/langgraph-multi-agent-workflows/)

[https://blog.langchain.dev/langgraph-multi-agent-workflows/](https://blog.langchain.dev/langgraph-multi-agent-workflows/)

LangGraphはLangChainを活用する前提のツールではありますが、LLMモデルやその他のツールとは独立しており、シンプルにステートマシンを構築するためのライブラリとして使えます。

ここから先は、LangGraphというステートマシン構築ライブラリの基本的な使い方をメインに紹介していきます。

# 環境

この記事執筆時点では、以下のバージョンで実施しています。

とくにLangChain周りは非常に開発速度が早いため、現在の最新バージョンを合わせてご確認ください

- langgraph: 0.1.5
- Python: 3.10.12

# LangGraphの基本コンポーネント

LangGraphは、次に紹介するいくつかの主要なコンポーネントを使ってグラフを構成します。

![LangGraphの図](https://storage.googleapis.com/zenn-user-upload/1c2f8534f22d-20240624.png)

| コンポーネント | 説明 |
| --- | --- |
| Graph | LangGraphの中核となる構成要素で、各NodeとEdgeの集合体です。 |
| State | ノード間の遷移の際に保持される情報で、各ノードが参照および更新します。 |
| Node | グラフ内の個々のステップや状態を表す要素で、特定のアクションやチェックポイントとして機能します。 |
| Edge | ノード間の接続を表し、遷移の条件やアクションを定義します。条件付きエッジなど、特定のロジックに基づいて遷移を制御できます。 |

## Graph

[Graph](https://langchain-ai.github.io/langgraph/concepts/low_level/#graphs) は、LangGraphの中核となるグラフ全体を管理するためのコンポーネントです。基本的な使い方としては、 `StateGraph` というクラスを使い、後述するStateとセットで初期化します。

（StateGraphの宣言例）

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph

# Stateを宣言
class State(TypedDict):
    value: str

# Stateを引数としてGraphを初期化
graph = StateGraph(State)

```

## State

[State](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) は、Graph内のNodeやEdgeに渡される状態のオブジェクトです。

Stateには、typingモジュールの「TypeDict」または「 [PydanticのBaseModel](https://docs.pydantic.dev/latest/)」が使用できます。

以下は、TypeDictを継承したStateの例です。

```python
from typing_extensions import TypedDict

# str型のvalueという名前を持つState
class State(TypedDict):
    value: str

```

### Reducers

Stateは、reducerと呼ばれる関数と一緒に使用することもできます。reducerは、状態を更新するための関数で、 `(現在の値、追加される値) -> 状態を更新する値` のシグネチャを持ちます。

```python
from typing import TypedDict, Annotated

def reducer(a: list, b: int | None) -> int:
    # bが渡されたときは、aに追加する
    if b is not None:
        return a + [b]
    return a

class State(TypedDict):
    # Annotatedでstateを更新するreducerを指定する
    bar: Annotated[list[str], reducer]

```

reducerを使用することで、状態の更新時に特定のロジックを介することが可能になります。

## Node

[Node](https://langchain-ai.github.io/langgraph/concepts/low_level/#nodes) は、Graph上で実際のステップを実行するコンポーネントです。例えば実際にLangChainを使用してLLMのモデルを呼び出す処理は、Node上で行います。

Nodeでは、 `(State、Config) -> 変更するState` というシグネチャを持つ関数を使うことができます。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph

# Stateを宣言
class State(TypedDict):
    value: str

# Nodeを宣言
def node(state: State, config: RunnableConfig):
    return {"value": "hoge"}

graph = StateGraph(State)
# GraphにNodeを追加
graph.add_node("node", node)

```

graphに対して `add_node` というメソッドを使用して、nodeを紐づけます。第一引数は、Nodeに対して任意のpath名を文字列で指定できます。

## Edge

[Edge](https://langchain-ai.github.io/langgraph/concepts/low_level/#edges) は、各NodeやGraphがどのように動作するか（ルーティング、開始点の定義など）を定義するコンポーネントです。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph

# Stateを宣言
class State(TypedDict):
    value: str

# Nodeを宣言
def node(state: State, config: RunnableConfig):
    return {"value": "hoge"}

def node2(state: State, config: RunnableConfig):
    return {"value": "fuga"}

graph_builder = StateGraph(State)
graph_builder.add_node("node", node)
graph_builder.add_node("node2", node2)

# Nodeの関連をedgeに追加
graph_builder.add_edge("node", "node2")

# Graphの始点を宣言
graph_builder.set_entry_point("node")

# Graphの終点を宣言
graph_builder.set_finish_point("node2")

```

`add_edge(<from path>, <to path>)` を使って、どのNodeから次のNodeへ処理が移るかを表現することができます。

また、 `set_entry_point`、 `set_finish_point` をつかってグラフの始点と終点を指定することができます。

# Graphの基本的な作り方

ここからはLangGraphのコンポーネントを使って、基本的なグラフを作成していきます。

## 単純なグラフ

まずは、次のような単純な経路のグラフを作成します。

![単純なグラフ](https://storage.googleapis.com/zenn-user-upload/8db7b0738077-20240626.jpeg)

このグラフをコードで示すと、次のようになります。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph

# Stateを宣言
class State(TypedDict):
    value: str

# Nodeを宣言
def node(state: State, config: RunnableConfig):
    # 更新するStateの値を返す
    return {"value": "1"}

def node2(state: State, config: RunnableConfig):
    return {"value": "2"}

# Graphの作成
graph_builder = StateGraph(State)

# Nodeの追加
graph_builder.add_node("node", node)
graph_builder.add_node("node2", node2)

# Nodeをedgeに追加
graph_builder.add_edge("node", "node2")

# Graphの始点を宣言
graph_builder.set_entry_point("node")

# Graphの終点を宣言
graph_builder.set_finish_point("node2")

# Graphをコンパイル
graph = graph_builder.compile()

# Graphの実行(引数にはStateの初期値を渡す)
graph.invoke({"value": ""})

```

### Graphのコンパイル・実行

Graphを実行するには、コンパイルを行い [CompiledGraph](https://langchain-ai.github.io/langgraph/reference/graphs/#compiledgraph) クラスのインスタンスを生成する必要があります。

```python
# Graphをコンパイル
graph = graph_builder.compile()
# Graphの実行(引数にはStateの初期値を渡す)
graph.invoke({"value": ""})

```

（実行結果）

```bash
{'value': '2'}

```

`invoke` はグラフを同期的に実行するためのメソッドで、引数としてStateの初期値を取ります。

その他にも非同期で実行するための [ainvoke](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.graph.CompiledGraph.ainvoke) や、ストリーミングするための [stream](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.graph.CompiledGraph.stream) が使用できます。

### デバッグ

グラフ実行時にdebugオプションを有効にすることで、グラフの実行履歴とStateの変化を実行時に可視化することができます。

```python
graph.invoke({"value": ""}, debug=True)

```

実行結果は次のようになります。

実行結果

```
[0:tasks] Starting step 0 with 1 task:
- __start__ -> {'value': ''}
[0:writes] Finished step 0 with writes to 1 channel:
- value -> ''
[1:tasks] Starting step 1 with 1 task:
- node -> {'value': ''}
[1:writes] Finished step 1 with writes to 1 channel:
- value -> '1'
[2:tasks] Starting step 2 with 1 task:
- node2 -> {'value': '1'}
[2:writes] Finished step 2 with writes to 1 channel:
- value -> '2'
{'value': '2'}

```

## 分岐グラフ

次に分岐が発生するグラフを作成してみます。

startendstart\_nodenode2node3end\_node

LangGraphの分岐は `conditional_edges` というedgeを使うことで表現できます。

```python
# add_conditional_edgesに渡す関数
def routing(state: State, config: RunnableConfig) -> Literal["node2", "node3"]:
  # random_numが0なら次のpathは"node2"になり、1なら"node3"になる。
  random_num = random.randint(0, 1)
  if random_num == 0:
    return "node2"
  else:
    return "node3"

# 第一引数には、一つ前のNodeを指定する
# 第二引数には、分岐を決定する関数を指定する
graph_builder.add_conditional_edges(
    "start_node",
    routing,
)

```

`add_conditional_edges` に渡す関数は、次のノードが何かを決定するパスを返します。

このコード例の場合は、次のノードが"node2"または、"node3"の分岐であることをroutingという関数内で決定しています。

全体のコードは次のとおりです。

全体のコード

```python
from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph
from langchain_core.runnables import RunnableConfig
import random

class State(TypedDict):
    value: str

def start_node(state: State, config: RunnableConfig):
    return {"value": "1"}

def node2(state: State, config: RunnableConfig):
    return {"value": "2"}

def node3(state: State, config: RunnableConfig):
    return {"value": "3"}

graph_builder = StateGraph(State)
graph_builder.add_node("start_node", start_node)
graph_builder.add_node("node2", node2)
graph_builder.add_node("node3", node3)
graph_builder.add_node("end_node", lambda state: {"value": state["value"]})

graph_builder.set_entry_point("start_node")

def routing(state: State, config: RunnableConfig) -> Literal["node2", "node3"]:
  random_num = random.randint(0, 1)
  if random_num == 0:
    return "node2"
  else:
    return "node3"

# 第一引数には、一つ前のNodeを指定する
# 第二引数には、分岐を決定する関数を指定する
graph_builder.add_conditional_edges(
    "start_node",
    routing,
)

graph_builder.add_edge("node2", "end_node")
graph_builder.add_edge("node3", "end_node")

graph_builder.set_finish_point("end_node")

# Graphをコンパイル
graph = graph_builder.compile()

# Graphの実行(引数にはStateの初期値を渡す)
graph.invoke({"value": ""}, debug=True)

```

実行結果

```
[0:tasks] Starting step 0 with 1 task:
- __start__ -> {'value': ''}
[0:writes] Finished step 0 with writes to 1 channel:
- value -> ''
[1:tasks] Starting step 1 with 1 task:
- start_node -> {'value': ''}
[1:writes] Finished step 1 with writes to 1 channel:
- value -> '1'
[2:tasks] Starting step 2 with 1 task:
- node3 -> {'value': '1'}
[2:writes] Finished step 2 with writes to 1 channel:
- value -> '3'
[3:tasks] Starting step 3 with 1 task:
- end_node -> {'value': '3'}
[3:writes] Finished step 3 with writes to 1 channel:
- value -> '3'
{'value': '3'}

```

# グラフを可視化する

作成したグラフがどのような経路を表しているかを確認するために、LangGraphでは可視化の方法がいくつか提供されています。

## mermaid

- `app.get_graph().draw_mermaid()` を使うことで mermaidのグラフを出力できます。

```python
graph = graph_builder.compile()
print(graph.get_graph().draw_mermaid())

```

出力されたmermaid

```bash
%%{init: {'flowchart': {'curve': 'linear'}}}%%
graph TD;
 __start__[__start__]:::startclass;
 __end__[__end__]:::endclass;
 node([node]):::otherclass;
 node2([node2]):::otherclass;
 __start__ --> node;
 node --> node2;
 node2 --> __end__;
 classDef startclass fill:#ffdfba;
 classDef endclass fill:#baffc9;
 classDef otherclass fill:#fad7de;

```

## 画像イメージ

- mermaidで可視化したグラフを `graph.get_graph().draw_mermaid_png()` を使って直接PNG形式で出力することもできます。

```python
from IPython.display import Image, display

graph = graph_builder.compile()
display(Image(graph.get_graph().draw_mermaid_png()))

```

![](https://storage.googleapis.com/zenn-user-upload/8db7b0738077-20240626.jpeg)

## その他

その他、Ascii文字列で表示するなど、いくつかの方法が紹介されていますので、公式ページを参照ください。

[https://langchain-ai.github.io/langgraph/how-tos/visualization/](https://langchain-ai.github.io/langgraph/how-tos/visualization/)
