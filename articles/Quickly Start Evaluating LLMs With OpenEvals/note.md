# Quickly Start Evaluating LLMs With OpenEvals

ref: <https://blog.langchain.dev/evaluating-llms-with-openevals/>

評価（evals）は、信頼性の高いLLM搭載のアプリケーションやエージェントをプロダクション環境に展開するために重要ですが、ゼロから評価を作成する際、どこから始めればよいか分からないことも多いです。そこで、私たちは新たに [openevals](https://github.com/langchain-ai/openevals?ref=blog.langchain.dev) と [agentevals](https://github.com/langchain-ai/agentevals?ref=blog.langchain.dev) というパッケージを提供し、すぐに使い始められる評価ツールと共通のフレームワークを用意しました。

## evalsとは何か？

evalsは、あなたのアプリケーションにとって重要な基準に基づいてLLMの出力品質を評価するための体系的な方法を提供します。evalsは、評価対象となる**データ**と、評価するための**指標**という2つの要素から構成されています。

評価対象のデータの質と多様性は、評価が実際の利用状況をどれだけ正確に反映するかに直接影響します。評価を作成する前に、あなたの特定のユースケースに合わせたデータセットを厳選する時間を十分に取りましょう―始めるためには高品質なデータポイントがほんの数件あれば十分です。データセットの厳選方法については[こちら](https://docs.smith.langchain.com/evaluation/concepts?ref=blog.langchain.dev#dataset-curation)をご覧ください。

また、評価する指標はアプリケーションの目的に応じてカスタムになることが多いですが、実際に使われる評価手法には共通した傾向が見られます。これが、私たちが[openevals](https://github.com/langchain-ai/openevals?ref=blog.langchain.dev)と[agentevals](https://github.com/langchain-ai/agentevals?ref=blog.langchain.dev)を構築した理由です。これらのパッケージは、一般的な評価手法やベストプラクティスを示すあらかじめ構築されたソリューションを共有し、すぐに始められるようにするためのものです。

## 一般的な評価タイプとベストプラクティス

評価には多くの種類がありますが、まずは最も一般的で実用的な評価手法の提供に焦点を当てました。私たちは以下の2つのアプローチで進めています：

1. **幅広い用途に対応した評価ツールのカスタマイズを容易にする：**  
   LLMをジャッジとして活用する評価手法（LLM-as-a-judge evals）は、最も汎用性の高い評価ツールです。`openevals`を使えば、あらかじめ構築された例を簡単に取り込み、自分のユースケースに合わせてカスタマイズできます。

2. **特定のユースケース向けの評価ツールの構築：**  
   ユースケースは無限に存在しますが、まずは最も一般的なケース向けにすぐに利用できる評価ツールを構築します。初期段階では、`openevals`と`agentevals`が、ドキュメントからの構造化コンテンツの抽出、ツール呼び出しの管理、エージェントの軌跡管理などのケースに対応します。今後、アプリケーションの種類に応じた、より具体的な手法（例えば、RAGアプリケーションやマルチエージェントアーキテクチャ向けの評価など）も追加していく予定です。

### LLMをジャッジとする評価手法（LLM-as-a-judge evals）

LLMをジャッジとして活用する評価手法では、LLMがアプリケーションの出力に対してスコアを付けます。これらは主に自然言語の出力を評価する際に用いられるため、最も一般的な評価手法となっています。

**【評価の対象として使用する場合：】**

- チャットボットの応答における会話の質
- 要約や質疑応答システムにおける事実と異なる生成（幻覚）の検出
- 文章の質や一貫性の評価

重要なのは、LLMをジャッジとする評価手法は、正解データがなくても客観的に応答を評価できる点です。

**【`openevals`が提供する機能：】**

- あらかじめ構築されたスタータープロンプトを、簡単にカスタマイズ可能
- 数ショットの例を取り入れて、人間の好みに沿った評価を実現
- 一貫性のある評価のためのスコアリングスキーマの設定を簡素化
- なぜそのスコアが付与されたのか、理由付けのコメントを生成し、評価プロセスの透明性を向上

LLMをジャッジとする評価手法の例を確認し、すぐに始めるには[こちら](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.dev#llm-as-judge)をご覧ください。

### 構造化データ評価（Structured Data Evals）

多くのLLMアプリケーションでは、ドキュメントから構造化された出力を抽出したり、ツール呼び出しのために構造化された出力を生成したりします。こうした場合、モデルの出力があらかじめ定められたフォーマットに従っていることが重要です。

**【評価の対象として使用する場合：】**

- PDF、画像、その他のドキュメントから抽出された構造化情報
- 一貫したフォーマットのJSONやその他の構造化出力
- ツール呼び出し（例：API呼び出し）のパラメータ検証
- 出力が特定のフォーマットに一致する、またはあるカテゴリーに収まっているかの確認

**【`openevals`が提供する機能：】**

- `openevals`は、構造化出力の厳密な一致を設定するか、LLMをジャッジとして利用して出力を検証する機能を提供
- 必要に応じて、フィードバックキーごとにスコアを集約し、評価者のパフォーマンスを俯瞰できるようにする

構造化データ評価手法の例を確認し、すぐに始めるには[こちら](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.dev#extraction-and-tool-calls)をご覧ください。

### エージェント評価：軌跡評価

エージェントを構築する際には、最終出力だけでなく、エージェントがどのような経緯でその結果に到達したかというプロセスにも注目します。軌跡評価は、エージェントがタスクを完了するために実行する一連のアクションを評価する手法です。

**【評価の対象として使用する場合：】**

- ツールやツール群の選択
- [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.dev)アプリケーションの軌跡

**【`agentevals`が提供する機能：】**

- [Agent Trajectory](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.dev#agent-trajectory)を利用すれば、エージェントが正しいツールを（必要に応じて厳密な順序で）呼び出しているかを確認するか、またはLLMをジャッジとして利用して軌跡を評価することができます。
- [LangGraph](https://langchain-ai.github.io/langgraph/?ref=blog.langchain.dev)を使用している場合は、[Graph Trajectory](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.dev#graph-trajectory)を使って、エージェントが正しいノードを呼び出しているかを確認できます。

エージェント評価手法の例を確認し、すぐに始めるには[こちら](https://github.com/langchain-ai/agentevals?ref=blog.langchain.dev)をご覧ください。

### LangSmithで結果を時系列で追跡する

評価結果を時系列で追跡し、チームと共有するためには、[LangSmith](https://smith.langchain.com/?ref=blog.langchain.dev)へのログ記録を推奨します。[Elastic](https://www.elastic.co/blog/elastic-security-generative-ai-features?ref=blog.langchain.dev)、[Klarna](https://blog.langchain.dev/customers-klarna/)、[Podium](https://blog.langchain.dev/customers-podium/)といった企業が、GenAIアプリケーションの評価にLangSmithを活用しています。

LangSmithには、プロダクションレベルのLLMアプリケーション構築を支援するためのトレース、評価、実験ツールが含まれています。LangSmithとの統合方法については、[openevals](https://github.com/langchain-ai/openevals?tab=readme-ov-file&ref=blog.langchain.dev#langsmith-integration)または[agentevals](https://github.com/langchain-ai/agentevals?tab=readme-ov-file&ref=blog.langchain.dev#langsmith-integration)のガイドをご覧ください。
