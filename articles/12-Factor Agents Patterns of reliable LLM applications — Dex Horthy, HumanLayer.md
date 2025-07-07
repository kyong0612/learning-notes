---
title: "12-Factor Agents: Patterns of reliable LLM applications"
source: "https://github.com/humanlayer/12-factor-agents"
author:
  - "Dex Horthy"
  - "HumanLayer"
published: 2025-04-17
created: 2025-07-07
description: |
  A set of principles for building LLM-powered software that is reliable, scalable, and maintainable enough for production customers, inspired by Heroku's "The Twelve-Factor App".
tags:
  - "AI-agent"
  - "LLM"
  - "software-engineering"
  - "12-factor-app"
  - "reliability"
  - "production-grade"
  - "agentic-architecture"
---

## 概要

本稿は、Dex Horthy氏とHumanLayerによって提唱された、信頼性の高いLLM（大規模言語モデル）アプリケーションを構築するための設計原則「**12-Factor Agents**」を解説するものです。Herokuの有名な「[The Twelve-Factor App](https://12factor.net/)」にインスパイアされたこれらの原則は、多くのAIエージェント開発がプロトタイプ段階（品質70-80%）で停滞し、本番環境で求められる信頼性、スケーラビリティ、保守性を確保できないという課題意識から生まれました。

成功しているプロダクションレベルのAIシステムは、完全に自律的なループで動作する「エージェント」というより、大部分が決定論的なソフトウェアであり、その要所にLLMが戦略的に組み込まれている場合がほとんどです。この知見に基づき、12-Factor Agentsは、LLMをソフトウェアエンジニアリングの堅牢なプラクティスと融合させるための具体的な指針を提供します。

### キーメッセージ

- **エージェントは魔法ではなく、ソフトウェアエンジニアリングである。**
- LLMをブラックボックスとして扱わず、その入出力（トークン、プロンプト、コンテキスト）を精密に制御することが信頼性向上の鍵となる。
- フレームワークにすべてを委ねるのではなく、アプリケーションのコアロジック（コントロールフロー、状態管理）は開発者が所有し、管理下に置くべきである。

---

## The 12 Factors

以下に、12の各原則とその要点をまとめます。

### 1. Natural Language to Tool Calls (自然言語からツールコールへ)

LLMの最も強力な能力は、曖昧な自然言語の指示を、機械が実行可能な構造化されたアクション（JSON形式のツールコールなど）に変換することです。自由形式のテキストを生成させるのではなく、この「意図の翻訳」にLLMを集中させます。

### 2. Own Your Prompts (プロンプトを所有する)

プロンプトはAIの振る舞いを決定する「コード」です。外部ライブラリのブラックボックスに隠蔽せず、自ら作成・管理し、バージョン管理下に置くべきです。これにより、きめ細かなチューニングと継続的な改善が可能になります。

### 3. Own Your Context Window (コンテキストウィンドウを所有する)

LLMに渡すコンテキスト（過去の対話履歴、データなど）を明示的に構築・管理します。自動的に履歴を垂れ流すのではなく、情報の要約、関連データの挿入などを行い、情報の密度と明瞭性を最適化することが、性能向上に直結します。

### 4. Tools Are Just Structured Outputs (ツールは構造化された出力に過ぎない)

エージェントの「ツール利用」を特別なものと捉えるべきではありません。これは単に、LLMが次に行うべきアクションを構造化データ（JSON）として出力し、それを決定論的なコードが受け取って実行するプロセスです。

### 5. Unify Execution State and Business State (実行状態とビジネス状態を統一する)

エージェNTの内部的な実行状態（「現在ステップ3」など）と、アプリケーションのビジネス状態（DB内のユーザー情報など）を分離せず、単一のイベントログや履歴として一元管理します。これにより、システムの可観測性が高まり、デバッグや状態の再現が容易になります。

### 6. Launch/Pause/Resume with Simple APIs (シンプルなAPIで起動/一時停止/再開)

長時間かかる処理や人間の承認が必要なステップに対応するため、エージェントの実行プロセスを、外部からAPI経由で「起動」「一時停止」「再開」できるように設計します。これにより、ワークフローが柔軟かつ堅牢になります。

### 7. Contact Humans with Tool Calls (ツールコールで人間と対話する)

人間の介入（承認、質問への回答など）が必要になった場合、それを例外処理とせず、他のAPIコールと同様の「人間呼び出しツール」としてモデル化します。LLMは必要に応じてこのツールを呼び出し、人間からの応答を待って処理を続行します。

### 8. Own Your Control Flow (コントロールフローを所有する)

エージェントの実行ループ（次のアクションを決定し、実行し、結果をコンテキストに追加する流れ）を、フレームワーク任せにせず、自らのコードで明示的に制御します。これにより、無限ループを防ぎ、エラーハンドリングや終了条件を正確に管理できます。

### 9. Compact Errors into Context Window (エラーを圧縮してコンテキストウィンドウに)

ツール実行時にエラーが発生した場合、スタックトレース全体のような冗長な情報ではなく、エラーの本質を簡潔に要約した情報をコンテキストに追加します。これにより、LLMはエラー内容を理解し、自己修正を試みることが可能になります。

### 10. Small, Focused Agents (小さく、焦点の絞られたエージェント)

一つの巨大な万能エージェントを構築するのではなく、マイクロサービスのように、特定のタスクに特化した複数の小さなエージェントを構築し、それらを協調させて動作させます。これにより、各エージェントのプロンプトとロジックが単純になり、信頼性と保守性が向上します。

### 11. Trigger from Anywhere, Meet Users Where They Are (どこからでもトリガーし、ユーザーのいる場所で対応)

エージェントの機能を特定のUIに限定せず、API、Webhook、メール、Slackコマンドなど、様々なインターフェースから呼び出せるように設計します。これにより、エージェントはより広範なワークフローに組み込むことができるようになります。

### 12. Make Your Agent a Stateless Reducer (エージェントをステートレスなReducerにする)

エージェント自体は内部状態を持たないように設計します。エージェントは、現在の状態（イベント履歴）と新しいイベントを入力として受け取り、次のアクションを出力するだけの「純粋関数（Reducer）」として振る舞うべきです。状態はすべて外部（DBやログ）で管理することで、スケーラビリティとテストの容易性が飛躍的に向上します。

---

### 関連リソース

- **公式リポジトリ**: [humanlayer/12-factor-agents on GitHub](https://github.com/humanlayer/12-factor-agents)
- **講演動画**: [12-Factor Agents: Patterns of reliable LLM applications by Dex Horthy (YouTube)](https://www.youtube.com/watch?v=8kMaTybvDUw)
- **Hacker News ディスカッション**: [Hacker News Thread](https://news.ycombinator.com/item?id=43699271)
