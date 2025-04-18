# 複数エージェントを管理するMulti-Agent Orchestratorの使い方からクイックスタートまで

ref: <https://weel.co.jp/media/tech/multi-agent-orchestrator/>

## Multi-Agent Orchestratorの概要

- **概要**: AWS Labsが2024年11月21日にリリースした、複数のAIエージェントを管理し、複雑な会話を処理するための柔軟で高性能なフレームワーク。
- **目的**: ユーザー入力に基づいて適切なエージェントにクエリを動的にルーティングする。
- **サポート言語**: PythonとTypeScript。
- **応答形式**: ストリーミング応答と非ストリーミング応答の両方をサポート。
- **デプロイメント**: AWS Lambda、ローカル環境、その他のクラウドプラットフォームなど、任意の環境で実行可能。
- **提供物**: 事前に構築されたエージェント（Amazon Bedrock、Lex Botなど）と分類子を提供し、初期開発時間を短縮。

![複数エージェント Multi-Agent Orchestrator 使い方 クイックスタート](https://weel.co.jp/wp-content/uploads/2024/11/AI%E3%83%A2%E3%83%B3_Multi-Agent-Orchestrator.webp)

![Multi-Agent Orchestrator 概要図](https://weel.co.jp/wp-content/uploads/2024/11/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88-2024-11-25-1.38.49.webp)
*参考: [https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file](https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file)*

## Multi-Agent Orchestratorの特徴

![Multi-Agent Orchestrator フロー図](https://weel.co.jp/wp-content/uploads/2024/11/flow-1024x392.webp)
*参考: [https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file](https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file)*

1. **インテリジェントな意図分類**: ユーザー入力と会話コンテキストを分析し、最適なエージェント（例：天気、旅行予約、健康相談など）に動的にクエリをルーティング。
2. **デュアル言語サポート**: PythonとTypeScriptの両方をサポートし、実装例も提供。
3. **柔軟なエージェント応答**: ストリーミング応答（リアルタイム対話向け）と非ストリーミング応答（バッチ処理向け）の両方をサポート。
4. **コンテキスト管理**: エージェント間で会話コンテキストを共有し、複雑なマルチターン会話を一貫性を持って処理。
5. **拡張可能なアーキテクチャ**: 新しいエージェントの統合や既存エージェントのカスタマイズが容易。
6. **ユニバーサルデプロイメント**: AWS Lambda、ローカル環境、他のクラウドプラットフォームなど、様々な環境で実行可能。
7. **事前に構築されたエージェントと分類子**: Amazon BedrockやLex Botなどと連携したエージェントが利用可能で、開発時間を短縮。

![Multi-Agent Orchestrator デモGIF](https://weel.co.jp/wp-content/uploads/2024/11/demo-app.gif)
*参考: [https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file](https://github.com/awslabs/multi-agent-orchestrator?tab=readme-ov-file)*

## LangGraphとの違い

- **Multi-Agent Orchestrator**:
  - 目的: 複数AIエージェントの動的管理、異なるタスクの効果的な処理（特に会話型AI、マルチドメイン対応）。
  - 強み: エージェント間のコンテキスト共有、リアルタイムルーティング。
- **LangGraph**:
  - 目的: LLMタスクのワークフローをグラフとして構築・管理。
  - 強み: NLPタスクの状態遷移、条件付き分岐、プロセスの可視化、デバッグ。
- **使い分け**:
  - Multi-Agent Orchestrator: 複数エージェント統合、応答最適化が必要な場面。
  - LangGraph: 複雑な状態管理、カスタムワークフロー構築を視覚的・効率的に行いたい場合。

## Multi-Agent Orchestratorのライセンス

- **ライセンス**: Apache License 2.0
- **特徴**: 特許ライセンスを含み、商用利用、改変、配布、特許使用、私的使用が可能。再配布や改変時には元のライセンス条項と表示が必要。
- **参考**: [https://github.com/awslabs/multi-agent-orchestrator/blob/main/LICENSE](https://github.com/awslabs/multi-agent-orchestrator/blob/main/LICENSE)

## Multi-Agent Orchestratorの使い方 (Python)

1. **環境**: Python実行環境、AWSアクセスキー/シークレットキー/リージョン情報が必要。LLMモデルのダウンロードは不要。
2. **ライブラリインストール**: `pip install multi-agent-orchestrator`
3. **エージェント設定**: `BedrockLLMAgent` などを使用し、名前、説明、モデルIDなどを指定してエージェントを作成・追加。カスタムエージェントも作成可能。

    ```python
    # 例: テックエージェントの設定
    tech_agent = BedrockLLMAgent(BedrockLLMAgentOptions(
        name="Tech Agent",
        streaming=True,
        description="Specializes in technology areas...",
        model_id="anthropic.claude-3-sonnet-20240229-v1:0",
        callbacks=BedrockLLMAgentCallbacks()
    ))
    orchestrator.add_agent(tech_agent)
    ```

4. **オーケストレーター設定**: ログ設定、リトライ回数、デフォルトエージェントの使用有無などを設定。

    ```python
    orchestrator = MultiAgentOrchestrator(options=OrchestratorConfig(
        LOG_AGENT_CHAT=True,
        # ...その他の設定...
        MAX_MESSAGE_PAIRS_PER_AGENT=10
    ))
    ```

5. **実行コード例**: 記事内にAWS認証、レート制限対応（指数バックオフ）、非同期処理を含む完全なサンプルコードが提供されている。
6. **注意点**: AWSのレート制限エラー（`ThrottlingException`）が発生する可能性があり、リクエスト間隔やリトライ設定の調整が必要な場合がある。

*実行サンプル動画:*
[AWS Labs_サンプル動画 - YouTube](https://www.youtube.com/watch?v=wA7798mbBoc)

### ストリーミング応答と非ストリーミング応答の処理

- ストリーミング応答: データを逐次受信。
- 非ストリーミング応答: 全結果を一度に受信。
- 用途に応じて適切な処理方法を選択することで、ユーザーエクスペリエンスを最適化できる。

## Multi-Agent OrchestratorのExamples & Quick Start実行

- **リポジトリ**: GitHub ([https://github.com/awslabs/multi-agent-orchestrator](https://github.com/awslabs/multi-agent-orchestrator))
- **デモ**: `examples` ディレクトリ内にあるが、多くはTypeScript。Pythonデモは `python-demo` に存在する（天気予報ツールを使用）。
- **実行手順**:
    1. リポジトリをクローン: `git clone https://github.com/awslabs/multi-agent-orchestrator.git`
    2. ディレクトリ移動: `cd multi-agent-orchestrator`
    3. 依存関係インストール: `pip install -r requirements.txt`
    4. Pythonデモ実行: `python-demo` ディレクトリに移動し、`python main.py` を実行。
- **実行結果例**:

    ```
    Metadata:
    Selected Agent: Weather Agent
    東京の現在の天気は晴れで、気温は8.4°C、風速は5.0km/hです。晴れ渡った空が広がっています。 🌞
    ```

*実行サンプル動画:*
[AWS Labs_main py動画 - YouTube](https://www.youtube.com/watch?v=qz3oPohbuDE)

## まとめ

- Multi-Agent Orchestratorは、複数のAIエージェントを管理するための新しい選択肢。
- LangGraphとは異なり、エージェントの動的管理と応答の最適化に強みを持つ。
- 実現したいことに応じてLangGraphと使い分けることが推奨される。
- ローカル環境でも試せるため、活用が期待される。

## 制限事項・注意点

- **Pythonデモの少なさ**: GitHubリポジトリ内のサンプルはTypeScriptが中心。
- **AWSレート制限**: AWSサービスを利用するため、API呼び出しにはレート制限があり、`ThrottlingException`エラーが発生する可能性がある。適切な待機処理やリトライ設定が必要。
