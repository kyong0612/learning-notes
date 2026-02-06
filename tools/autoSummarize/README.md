# 自動記事要約システム

Mastra Workflowを使用して、新規追加されたMarkdownファイルを自動的に検出し、要約を生成するシステムです。

## 機能

- 🔍 Git diffで新規Markdownファイルを自動検出
- 🤖 Claude Code CLIを使用した高品質な要約生成
- 🌐 ソースに応じた最適なツール選択（YouTube、Webページ対応）
- ✅ ユーザー承認機能付き（要約内容の確認・編集可能）
- 💾 自動バックアップ機能

## セットアップ

### 前提条件

- Node.js 20.9.0以上
- Claude Code CLI（インストール済み）
- Git

### インストール

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な設定を追加
```

### 環境変数

```env
# 監視対象ディレクトリ
TARGET_DIRECTORY=/Users/kimkiyong/Dev/learning-notes/articles

# プロンプトファイルのパス
PROMPT_PATH=/Users/kimkiyong/Dev/learning-notes/tools/autoSummarize/docs/prompts/summarize-prompt.md

# その他の設定
MAX_CONCURRENT_FILES=5
RETRY_ATTEMPTS=3
RETRY_DELAY=1000
```

## 使用方法

### 手動実行

```bash
# ワークフローを手動実行
pnpm run:workflow
```

### Mastra Playgroundで実行

```bash
# Mastra開発サーバーを起動
pnpm dev

# ブラウザで http://localhost:3000 にアクセス
```

## アーキテクチャ

### ワークフローの流れ

1. **Git Diff Step**: 新規追加されたMarkdownファイルを検出
2. **File Parser Step**: ファイルのソースURLとメタデータを解析
3. **Tool Selector Step**: ソースに応じて適切なツールを選択
4. **Summary Step**: Claude Codeで要約を生成（ユーザー承認付き）
5. **Update File Step**: 承認された要約でファイルを更新

### ディレクトリ構造

```
src/
├── mastra/
│   ├── config/           # 設定ファイル
│   ├── tools/            # 各種ツールの実装
│   ├── steps/            # ワークフローステップ
│   ├── workflows/        # ワークフロー定義
│   └── index.ts          # Mastraインスタンス
└── run-workflow.ts       # 手動実行スクリプト
```

## 開発

### コード品質チェック

```bash
# Lintチェック
pnpm lint

# Lintエラーの自動修正
pnpm lint:fix

# 型チェック
pnpm typecheck

# フォーマット
pnpm format
```

### ログとデバッグ

システムは詳細なログを出力します。ログレベルは`src/mastra/index.ts`で設定可能です。

## トラブルシューティング

### Claude Code CLIが見つからない

Claude Code CLIがインストールされていることを確認してください。

```bash
# Claude Codeのバージョン確認
claude --version
```

### Git diffが機能しない

対象ディレクトリがGitリポジトリであることを確認してください。

### 要約が生成されない

- プロンプトファイルが正しいパスに存在することを確認
- Claude Code CLIが正常に動作することを確認
- ログでエラーメッセージを確認

### ツール実行エラー（ToolExecutionContext）

Mastraの現在のバージョンでは、ステップ内からツールを呼び出す際にコンテキストの問題が発生する場合があります。この問題は以下の方法で解決できます：

1. **暫定的な回避策**（現在実装済み）

   ```typescript
   const result = await tool.execute({
     context: { /* データ */ },
     threadId: undefined,
     resourceId: undefined,
     runtimeContext: {}
   } as any);
   ```

2. **推奨される解決策**
   - ツールを直接ステップとして使用する
   - `auto-summarize-workflow-improved.ts`を参照

詳細は`docs/mastra-tool-execution-guide.md`を参照してください。

## 今後の拡張予定

- [ ] 定期実行機能（cron/scheduler）
- [ ] YouTube MCP実装の完成
- [ ] 複数ディレクトリ対応
- [ ] カスタムプロンプト対応
- [ ] Web UIの実装

## ライセンス

ISC
