---
title: "AI Agent Manager (AAM) として生きていく : 作業環境とワークフローの設計"
source: "https://qiita.com/icoxfog417/items/f15e92f05b14411fd642"
author:
  - "[[icoxfog417]]"
published: 2025-06-22
created: 2025-06-24
description: |
  本記事は、AI Agentが開発の中心となる未来を見据え、「AI Agent Manager（AAM）」という新しい役割の重要性を提唱する。AAMは、AI Agentの能力を最大限に引き出すための環境構築とワークフロー設計を担う。
tags:
  - "clippings"
  - "AI"
  - "AAM"
  - "GenerativeAI"
  - "Claude"
  - "AmazonQ"
  - "ClaudeCode"
  - "機械学習"
---
本記事は、AI Agentが開発の中心となる未来を見据え、「AI Agent Manager（AAM）」という新しい役割の重要性を提唱する。AAMは、人間のエンジニアを管理するEM（Engineering Manager）とは異なり、AI Agentの能力を最大限に引き出すための環境構築とワークフロー設計を担う。

### AI Agentが働く環境の整備

AI Agentが効率的に作業するためには、人間が暗黙的に得ているプロジェクトのコンテキスト（仕様書、設計、議論など）を明示的に与える必要がある。その方法は以下の3つに大別される。

1. **リポジトリ内の文書（Commit対象）**:
    * `CLAUDE.md`（Claude Code用）や `.amazonq/rules`（Amazon Q用）など、リポジトリ全体で共有されるルールを記述する。
2. **リポジトリ内の文書（Commit対象外）**:
    * `.gitignore` で管理される `.workspace` ディレクトリなどを用意し、タスク固有のメモや進捗、一時的なスクリプトを格納する。
3. **MCP Server**:
    * FigmaやGitHubなど外部ツールの情報を取得するための公式サーバーを活用する。

AAMの重要な役割は、チームや組織単位でMCP Serverを構築・拡充し、各プロジェクトに散らばるルール（`CLAUDE.md`など）を一元管理してガバナンスを効かせることである。

### AI Agentのワークフロー設計

効果的なAAMは、AI Agentの作業を標準化されたワークフローに落とし込む。理想は「カスタムコマンドを決められた順序で実行するだけでタスクが完了する」状態である。著者が提案するワークフローは以下の8ステップから成る。

1. **initialize repository**: リポジトリ全体のルールを定める。
2. **launch task**: タスクの目的やTodoリストを `task.md` に生成する。
3. **onboard**: 関連ファイルを読み込ませ、作業可能な状態にする。
4. **think**: 実装方針を計画させる。
5. **learn**: 依存関係を理解させるため、サンドボックス環境で実験させる。
6. **implement**: コーディングを実行する。
7. **test**: テストを実行する。
8. **retrospect**: タスク完了後に成功・失敗点を振り返り、ナレッジをルールファイルに反映させる。

各ステップは、Claude Codeのカスタムスラッシュコマンドとして登録することで効率化できる。特に重要なのは、エージェント自身にルールを記述させ、シンプルな状態から徐々に改善していくアプローチや、失敗からも学習してルールを更新する `retrospect` のサイクルを回すことである。

### AI Agent Managerとして求められるスキル

AAMの最終的な目標は、AI Agentによる開発の生産性を最大化することである。そのために、将来的に以下のスキルセットが求められる。

* **作業環境の準備**:
  * 並行作業が可能な環境の設計（Dockerなど）。
  * MCP Serverを通じたコンテキスト取得環境の拡充。
  * 従量課金モデルを組み合わせたコスト最適化。
* **ワークフローの設計**:
  * 作業単位（コマンド）とプロセス全体の設計。
  * 複数Agentの成果物やナレッジを統合するマージ戦略の策定。
  * Fine-Tuningによる特化型Agentの構築と性能向上。

AAMのKPIは、**Time per Issue（生産性）**と**Human Review per Pull Request（品質）**の最小化に集約されるだろう。
