# 自動記事要約システム仕様書

## 概要

`/Users/kimkiyong/Dev/learning-notes/articles`ディレクトリ内で新規に追加されたMarkdownファイルを自動的に検出し、各ファイルに対して要約処理を実行するシステム。

## 機能要件

### 1. ファイル検出機能

- git diffを使用して新規追加されたMarkdownファイルを検出
- 対象ディレクトリ: `/Users/kimkiyong/Dev/learning-notes/articles`
- 検出対象: 新規追加された`.md`ファイルのみ

### 2. 要約処理機能

- 検出されたファイルに対して`/Users/kimkiyong/Dev/learning-notes/tools/autoSummarize/docs/prompts/summarize-prompt.md`のプロンプトを実行
- 要約内容:
  - メタデータの抽出・補完（author, published, description, tags）
  - コンテンツの構造化された要約

### 3. 承認フロー

- 詳細な要約の実行前にユーザー承認ステップを挿入
- ユーザーが要約内容を確認・承認後に処理を継続

### 4. ツール選択機能

- Markdownファイルのソースに応じて適切なツールを使用
- 対応ツール:
  - `https://github.com/kyong0612/youtube-mcp`: YouTube動画の場合
  - fetchツール: 一般的なWebページの場合
  - その他適切なツール

## 技術要件

### 使用技術

- **Mastra Workflow**: ワークフロー管理
- **Claude Code CLI**: AI処理の実行
- **Zod**: スキーマ定義・バリデーション
- **TypeScript**: 型安全性の確保

### 処理フロー

1. git diffコマンドで新規ファイルを検出
2. 各ファイルのソースURLを解析
3. 適切なツールを選択
4. 要約プロンプトを実行
5. ユーザー承認を取得
6. 承認後、詳細な要約を生成
7. 元のMarkdownファイルを更新

## 制約事項

- Claude Codeサブスクリプションが必要
- Mastra WorkflowのAPI仕様に準拠
- ファイル更新は元のMarkdownファイルを直接編集

## 入出力仕様

### 入力

- git diffによる新規ファイルリスト
- 各Markdownファイルの内容とメタデータ

### 出力

- 更新されたMarkdownファイル（メタデータと要約を含む）
- 処理ログ
