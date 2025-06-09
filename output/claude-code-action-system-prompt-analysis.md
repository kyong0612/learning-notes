# Claude Code Actionシステムプロンプト詳細分析

## 調査概要

本文書は、Anthropic社が公開しているClaude Code Actionのシステムプロンプト設計について、公開されている情報源を基に詳細に分析したものです。

### 調査日時
- 調査実施日: 2025年6月9日
- 分析対象: Claude Code Action GitHub統合

### 主要情報源

1. **Zenn記事**: 「Claude Code Actionのプロンプト設計が、AIエージェント開発にかなり参考になる件」
   - URL: https://zenn.dev/gotalab/articles/claudecode_9626d853742423
   - 著者: Gota
   - 公開日: 2025-05-24

2. **公式GitHubリポジトリ**: 
   - URL: https://github.com/anthropics/claude-code-action
   - ライセンス: 公開情報として確認

3. **公式ドキュメント**:
   - Claude Code GitHub Actions: https://docs.anthropic.com/ja/docs/claude-code/github-actions
   - Claude Code概要: https://docs.anthropic.com/ja/docs/claude-code/overview

## システムプロンプトの全体構造

### 1. 基本的な役割定義

```markdown
You are Claude, an AI assistant designed to help with GitHub issues and pull requests.
```

**出典**: Zenn記事「Claude Code Actionのプロンプト設計が、AIエージェント開発にかなり参考になる件」より

この定義により、Claude Code ActionはGitHub環境に特化したAIアシスタントとして動作範囲が明確に規定されています。

### 2. コンテキスト情報の構造

システムプロンプトは以下の構造化された情報を受け取ります：

#### 2.1 イベントメタデータ

```xml
<event_type>REVIEW_COMMENT</event_type>
<is_pr>true</is_pr>
<trigger_context>PR review comment with '@claude'</trigger_context>
<repository>owner/repo</repository>
<pr_number>123</pr_number>
<claude_comment_id>456789</claude_comment_id>
<trigger_username>user123</trigger_username>
```

**出典**: Zenn記事より引用

#### 2.2 コンテキスト情報の種類

- **フォーマットされたコンテキスト**: PR/Issueのメタデータ
- **本文**: 説明文（画像パスも含む）
- **コメント履歴**: 過去のすべてのコメント
- **レビューコメント**: インラインコードレビュー
- **変更ファイル**: PRの変更ファイルリストとSHA

**出典**: Zenn記事「プロンプト設計の詳細分析」セクション

### 3. 5ステップ実行フロー

Claude Code Actionは以下の5つのステップで動作します：

#### ステップ1: ToDoリストの作成

```markdown
Create a Todo List:
- Use your GitHub comment to maintain a detailed task list based on the request.
- Format todos as a checklist (- [ ] for incomplete, - [x] for complete).
```

**出典**: Zenn記事「タスク実行の5ステップフロー」セクション

#### ステップ2: コンテキストの収集
提供された情報を分析し、必要に応じて追加ファイルを読み込みます。

#### ステップ3: リクエストの理解
トリガーコメントから要求を抽出し、質問・コードレビュー・実装要求を判断します。

#### ステップ4: アクションの実行
要求タイプに応じた適切なアクション：
- **質問・コードレビュー**: 詳細なフィードバック提供
- **単純な変更**: 直接編集・コミット
- **複雑な変更**: タスク細分化・段階的実装

#### ステップ5: 最終更新
完了時にGitHubコメントを更新し、結果をまとめます。

**出典**: Zenn記事「タスク実行の5ステップフロー」セクション

### 4. 分析フェーズの実装

アクション実行前に必須の分析プロセス：

```markdown
Before taking any action, conduct your analysis inside <analysis> tags:
a. Summarize the event type and context
b. Determine if this is a request for code review feedback or for implementation
c. List key information from the provided data
d. Outline the main tasks and potential challenges
e. Propose a high-level plan of action, including any repo setup steps and linting/testing steps
f. If you are unable to complete certain steps, particularly due to missing permissions, explain this
```

**出典**: Zenn記事「分析フェーズの重要性」セクション

## セキュリティ設計と制約事項

### 1. コミュニケーション制約

- すべての通信はGitHubコメント経由
- 新規コメント作成禁止、既存コメント更新のみ
- コンソール出力はユーザーに非表示

**出典**: Zenn記事「重要な制約事項」セクション

### 2. 操作能力の明確な定義

#### 可能な操作：
- 単一コメントでの応答
- コード質問への回答
- コードレビューとフィードバック
- コード変更実装（単純〜中程度）
- Pull Request作成

#### 不可能な操作：
- 正式なGitHub PRレビュー提出
- Pull Request承認
- 複数コメント投稿
- リポジトリ外コマンド実行
- ブランチ操作（マージ、リベース等）

**出典**: Zenn記事「能力と制限の明確化」セクション

### 3. ツールの使用制限

#### 禁止されたツール：
- `WebSearch`
- `WebFetch`

これらの制限により、外部リソースへのアクセスを防ぎ、リポジトリスコープ内での安全な動作を保証しています。

**出典**: Zenn記事「セキュリティ制限」セクション

### 4. ブランチ管理ルール

- Issue作業時: 自動的に専用ブランチ作成
- 命名規則: `claude/issue-{番号}-{タイムスタンプ}`
- PR作成用URL自動生成
- 適切なツール使用例の明示

**出典**: Zenn記事「ブランチ管理」セクション

## 技術的実装詳細

### 1. 技術スタック

公式リポジトリ（https://github.com/anthropics/claude-code-action）から確認できる情報：

- **言語**: TypeScript
- **ランタイム**: Bun v1.2.11
- **主要ライブラリ**:
  - `@actions/core` v1.11.1
  - `@actions/github` v6.0.0
  - `@modelcontextprotocol/sdk` v1.0.4
  - `zod` v3.24.1

**出典**: 公式リポジトリのpackage.jsonおよびaction.ymlファイル

### 2. サポートされるGitHubイベント

1. `issue_comment`: イシューへのコメント
2. `pull_request_review_comment`: PRのインラインコメント
3. `pull_request_review`: PRレビュー
4. `pull_request`: PRの作成・更新
5. `issues`: Issueの作成・割り当て

**出典**: Zenn記事「イベントタイプ別処理」セクション

### 3. 認証方式

- **Anthropic API直接**: APIキーによる認証
- **AWS Bedrock**: OIDC認証
- **Google Vertex AI**: OIDC認証

**出典**: 「Claude Code Action徹底解説」（output/claude-code-action-implementation-analysis.md）

## カスタマイズ機能

### 1. 設定可能な要素

1. **トリガーフレーズ**: デフォルト`@claude`から変更可能
2. **カスタム指示**: 追加指示の提供
3. **ツール制御**: GitHub Workflowsでの調整
4. **ダイレクトプロンプト**: コメント非経由の直接指示
5. **CLAUDE.mdファイル**: リポジトリ固有の指示・ガイドライン

**出典**: Zenn記事「カスタマイズ要素」セクション

### 2. MCP（Model Context Protocol）サポート

- カスタムMCPサーバーの追加が可能
- ツールの拡張性を提供
- `@modelcontextprotocol/sdk`を使用

**出典**: 公式リポジトリpackage.jsonおよびZenn記事

## AIエージェント開発への応用

### 1. 設計原則

#### 1.1 構造化されたプロンプト設計
- 明確な役割定義
- 詳細なコンテキスト情報の構造化
- イベント別の適切な処理分岐

#### 1.2 タスク管理とフィードバック
- ToDoリスト形式での進捗可視化
- 段階的なタスク実行
- ユーザーへの継続的なフィードバック

#### 1.3 制約と安全性の確保
- 明確な能力と制限の定義
- セキュリティを考慮したツール制限
- 予期しない動作の防止

#### 1.4 カスタマイズ性と拡張性
- 柔軟なツール構成
- リポジトリ固有の設定対応
- MCPサーバーによる機能拡張

**出典**: Zenn記事「AIエージェント開発への示唆」セクション

### 2. 実装上の教訓

1. **複雑なコンテキストの効果的な管理**
   - XMLタグによる構造化
   - メタデータの明示的な分離
   - イベント駆動型の処理設計

2. **GitHub環境での安全性とユーザー体験の両立**
   - 制限的なデフォルト設定
   - 段階的な権限付与
   - 明確なエラーメッセージ

3. **構造化されたタスク実行フローの実装**
   - 5ステップの標準化されたプロセス
   - 分析フェーズでの計画立案
   - 進捗の可視化

4. **明確な制約設定による予測可能な動作**
   - ホワイトリスト方式のツール管理
   - 操作範囲の明示的な定義
   - 制限事項の事前通知

**出典**: Zenn記事「まとめ」セクション

## 利用可能なツール

### ファイル操作系
- `LS`, `Read`, `Edit`, `MultiEdit`, `Write`
- `NotebookRead`, `NotebookEdit`

### 検索・分析系
- `Glob`, `Grep`
- `Task`, `TodoRead`, `TodoWrite`

### GitHub操作系
- **GitHub File Ops MCP**: ファイルのコミット・削除
- **GitHub MCP**: 標準的なGitHub操作

### 実行系
- `Bash`（制限付き）

**出典**: Zenn記事「組み込みツール」セクション

## まとめと今後の展望

Claude Code Actionのシステムプロンプト設計は、以下の点で優れたAIエージェント実装の参考例となっています：

1. **明確な役割定義と責任範囲の限定**
2. **構造化されたコンテキスト管理**
3. **段階的で予測可能なタスク実行フロー**
4. **セキュリティファーストの設計思想**
5. **拡張性とカスタマイズ性の両立**

これらの設計原則は、他のAIエージェント開発プロジェクトにも応用可能な実用的な指針を提供しています。

## 参考文献

1. Gota. (2025). "Claude Code Actionのプロンプト設計が、AIエージェント開発にかなり参考になる件". Zenn. https://zenn.dev/gotalab/articles/claudecode_9626d853742423

2. Anthropic. (2025). "Claude Code Action GitHub Repository". GitHub. https://github.com/anthropics/claude-code-action/

3. Anthropic. (2025). "Claude Code GitHub Actions公式ドキュメント". https://docs.anthropic.com/ja/docs/claude-code/github-actions

4. Anthropic. (2025). "Claude Code概要". https://docs.anthropic.com/ja/docs/claude-code/overview

5. Learning Notes. (2025). "Claude Code Action徹底解説：公式リポジトリから読み解くGitHub統合AIアシスタント". output/claude-code-action-implementation-analysis.md

---

**注記**: 本文書は公開されている情報源のみに基づいて作成されており、内部実装の詳細や非公開の設計思想については含まれていません。最新の情報については、公式ドキュメントを参照してください。

**最終更新日**: 2025年6月9日