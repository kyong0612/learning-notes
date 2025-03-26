# OpenHands MicroAgents

ref: <https://github.com/All-Hands-AI/OpenHands/tree/main/microagents>

MicroAgentsは、特定の分野の知識やタスク固有のワークフローによってOpenHandsを強化する専用のプロンプトです。開発者にエキスパートガイダンスを提供し、一般的なタスクを自動化し、プロジェクト間で一貫した実践を確保します。

## MicroAgentsの種類

### 1. 知識エージェント（Knowledge Agents）

- 場所：`microagents/knowledge/`
- 会話の中のキーワードによってトリガーされる専門知識
- 特徴：
  - キーワードベースのトリガー（「github」「git」など特定の単語で活性化）
  - コンテキスト認識（ファイルタイプや内容に基づいて関連アドバイスを提供）
  - 複数プロジェクトで再利用可能
  - バージョン管理をサポート
- 実装例：
  - `github.md` - GitHubとGit操作の専門知識（APIトークン使用法、PR作成ベストプラクティスなど）
  - `docker.md` - Dockerコンテナ関連の専門知識
  - `kubernetes.md` - Kubernetes関連の専門知識
  - `security.md` - セキュリティベストプラクティス
  - `npm.md` - NPMパッケージ管理の専門知識
  - `swift-linux.md` - Linux上のSwiftプログラミング

### 2. リポジトリエージェント（Repository Agents）

- 場所：各リポジトリの`.openhands/microagents/repo.md`
- リポジトリ固有の知識とガイドラインを提供
- 特徴：
  - プロジェクト固有の指示を含む
  - チーム規約と実践を強制
  - リポジトリで作業する際に自動的に読み込まれる
  - プロジェクトと一緒に更新される
- 実装例：
  - OpenHandsリポジトリ自体の例：
    - バックエンド（Python）とフロントエンド（React）の設定方法
    - テスト実行手順（`poetry run pytest`の使用方法など）
    - コードをプッシュする前のlintエラーチェック方法
    - リポジトリ構造の説明

### 3. タスクエージェント（Task Agents）

- 場所：`microagents/tasks/`
- 一般的な開発タスクをガイドするインタラクティブなワークフロー
- 特徴：
  - ユーザー入力を受け付ける
  - 事前定義されたステップに従う
  - コンテキストに適応
  - 一貫した結果を提供
- 実装例：
  - `update_pr_description.md` - プルリクエスト説明の更新ワークフロー
  - `address_pr_comments.md` - PRコメントへの対応ワークフロー
  - `get_test_to_pass.md` - 失敗しているテストの修正ワークフロー
  - `update_test_for_new_implementation.md` - 新実装のためのテスト更新

## MicroAgentsの構造と設計

### 共通形式

- すべてのmicroagentsはYAMLフロントマターを持つMarkdownファイルで実装
- 基本構造：

  ```
  ---
  name: エージェント名
  type: knowledge/task/repo
  version: バージョン番号
  agent: 使用するAIエージェントタイプ
  triggers: [トリガーキーワード]（knowledgeタイプの場合）
  inputs: [必要な入力]（taskタイプの場合）
  ---
  
  エージェントの指示内容
  ```

### 知識エージェントの例（github.md）

```
---
name: github
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
- github
- git
---

You have access to an environment variable, `GITHUB_TOKEN`, which allows you to interact with
the GitHub API.

You can use `curl` with the `GITHUB_TOKEN` to interact with GitHub's API.
ALWAYS use the GitHub API for operations instead of a web browser.
...
```

### タスクエージェントの例（update_pr_description.md）

```
---
name: update_pr_description
type: task
version: 1.0.0
author: openhands
agent: CodeActAgent
inputs:
  - name: PR_URL
    description: "URL of the pull request"
    type: string
    required: true
    validation:
      pattern: "^https://github.com/.+/.+/pull/[0-9]+$"
...
---

Please check the branch "{{ BRANCH_NAME }}" and look at the diff against the main branch...
```

## 読み込み順序とシステム統合

1. リポジトリ固有の指示が最初に読み込まれる（`.openhands/microagents/repo.md`）
2. 会話のキーワードに基づいて関連する知識エージェントが読み込まれる
3. ユーザーが選択した場合にタスクエージェントが有効化される

## 貢献ガイドライン

### 知識エージェントのベストプラクティス

- 明確なトリガーキーワードを選択
- 一つの専門分野に焦点を当てる
- 実践的な例を含める
- 関連するファイルパターンを使用
- 知識は一般的で再利用可能に保つ

### タスクエージェントのベストプラクティス

- ワークフローを明確なステップに分割
- ユーザー入力を検証（バリデーション）
- 役立つデフォルト値を提供
- 使用例を含める
- ステップを様々な状況に適応可能にする

### リポジトリエージェントのベストプラクティス

- 明確なセットアップ指示を文書化
- リポジトリ構造の詳細を含める
- テストとビルド手順を詳細に指定
- 環境要件を明確にリスト化
- チーム実践を最新の状態に保つ

これらのMicroAgentsを使用することで、OpenHandsは様々なプログラミング言語、フレームワーク、ツールに関する専門知識を提供し、一般的な開発タスクを自動化し、プロジェクト全体で一貫したベストプラクティスを確保することができます。
