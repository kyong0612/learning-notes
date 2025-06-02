---
title: "Claude Maxプラン料金内でClaude Code GitHub Actionsを使うためのガイドまとめ"
source: "https://qiita.com/akira_funakoshi/items/e101a4e3ac9844e7b313"
author:
  - "akira_funakoshi"
published: 2025-05-27
created: 2025-06-02
description: "Claude Maxサブスクリプション料金内でClaude Code GitHub Actionsを活用するための包括的なセットアップガイド。OAuth認証を使用してAPIキーなしでGitHub ActionsでClaudeを利用する方法を詳しく解説。"
tags:
  - "claude"
  - "github-actions"
  - "oauth"
  - "claude-max"
  - "ci-cd"
  - "automation"
---

## 概要

この記事では、Claude Maxサブスクリプション料金内でClaude Code GitHub Actionsを使用するための完全なセットアップガイドを提供します。OAuth認証を活用することで、追加のAPI料金なしでGitHub Actionsワークフロー内でClaudeを利用できる方法を解説しています。

## 📋 必要な前提条件

### 必須要件

- **Claude Maxサブスクリプション**（月額$100または$200）
- **GitHubアカウント**（リポジトリの管理者権限必須）
- **Claude Code**がローカルにインストール済み

### 重要な注意点

- OAuth認証をサポートしているのはフォーク版のリポジトリのみ
- 対象リポジトリは他者からの`@claude`メンションを防ぐためprivateに設定することを推奨

## 🔧 事前準備：必要なリポジトリのフォーク

### フォーク対象リポジトリ

以下の2つのリポジトリを自分のGitHubアカウントにフォークする必要があります：

1. **claude-code-action**
   - URL: <https://github.com/Akira-Papa/claude-code-action>
2. **claude-code-base-action**
   - URL: <https://github.com/Akira-Papa/claude-code-base-action>

### 重要な設定変更

フォーク後、ワークフローファイル内の参照を更新：

```yaml
# 変更前
Akira-Papa/claude-code-base-action@main

# 変更後
あなたのGitHubアカウント名/claude-code-base-action@main
```

## 📝 詳細セットアップ手順

### Step 1: Claude Codeの認証状態確認 🔑

#### ログイン確認プロセス

1. **ターミナルでClaude Codeを起動**

   ```bash
   claude
   ```

2. **ログイン状態を確認**

   ```bash
   /status
   ```

   正常な場合の表示例：

   ```
   Account: Login Method: Claude Max Account (5x)
   ```

3. **未ログインの場合**

   ```bash
   /login
   ```

   を実行してClaude Maxアカウントでログイン

### Step 2: OAuth認証情報の取得 📄

#### 認証トークンの抽出方法

**方法1: 設定ファイルから直接取得**

```bash
cat ~/.claude/.credentials.json
```

**方法2: macのキーチェーンから取得**

- キーチェーンで「claude」を検索
- パスワードをコピーして`access_token`、`refresh_token`、`expires_at`を取得

![認証情報の取得方法](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F435233%2F18728f45-9dd4-4af6-8873-cb96d26a018a.png)

#### 取得すべき認証情報

- `access_token`: Claude APIへのアクセストークン
- `refresh_token`: トークン更新用のリフレッシュトークン
- `expires_at`: トークンの有効期限

### Step 3: GitHub Appのインストール 📱

#### インストール手順

1. **Claude Code内でコマンド実行**

   ```bash
   /install-github-app
   ```

2. **ブラウザでの設定**
   - 対象リポジトリを選択
   - **重要**: APIキーを求められた場合は一時的に設定（後で削除）
   - リポジトリへのアクセスを許可

**代替方法**: 直接ブラウザアクセス

```
https://github.com/apps/claude
```

### Step 4: GitHubシークレットの設定 🔐

#### 設定場所

リポジトリの `Settings > Secrets and variables > Actions`

#### 設定すべきシークレット

| シークレット名 | 値 | 説明 |
|---|---|---|
| `CLAUDE_ACCESS_TOKEN` | `credentials.json`の`access_token` | Claudeアクセストークン |
| `CLAUDE_REFRESH_TOKEN` | `credentials.json`の`refresh_token` | トークン更新用 |
| `CLAUDE_EXPIRES_AT` | `credentials.json`の`expires_at` | トークン有効期限 |

#### ⚠️ 重要なセキュリティ措置

Claude Appのインストール確認後、`ANTHROPIC_API_KEY`が設定されている場合は削除する

### Step 5: ワークフローファイルの作成 📄

#### ファイル作成場所

`.github/workflows/claude.yml`

#### 完全なワークフロー設定

```yaml
name: Claude Code
on:
    issue_comment:
        types: [created]
    pull_request_review_comment:
        types: [created]
    issues:
        types: [opened, assigned]
    pull_request_review:
        types: [submitted]

jobs:
    claude:
        if: |
            (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
            (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
            (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
            (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))

        runs-on: ubuntu-latest

        permissions:
            contents: write
            pull-requests: write
            issues: write
            id-token: write

        steps:
            - name: Checkout repository
              uses: actions/checkout@v4
              with:
                  fetch-depth: 1

            - name: Run Claude Code
              id: claude
              uses: あなたのGitHubアカウント名/claude-code-action@main
              with:
                  use_oauth: 'true'
                  claude_access_token: ${{ secrets.CLAUDE_ACCESS_TOKEN }}
                  claude_refresh_token: ${{ secrets.CLAUDE_REFRESH_TOKEN }}
                  claude_expires_at: ${{ secrets.CLAUDE_EXPIRES_AT }}
```

#### 設定のポイント

- **トリガー条件**: Issue、PR、コメントでの`@claude`メンション
- **権限設定**: コンテンツ編集、PR・Issue操作権限
- **OAuth設定**: `use_oauth: 'true'`でOAuth認証を有効化

### Step 6: ワークフローのデプロイ 🔀

#### デプロイ手順

1. **ブランチ作成**

   ```bash
   git checkout -b add-claude-workflow
   ```

2. **ファイルコミット**

   ```bash
   git add .github/workflows/claude.yml
   git commit -m "Add Claude GitHub Action workflow"
   git push origin add-claude-workflow
   ```

3. **プルリクエスト作成とマージ**
   - PRを作成してmainブランチにマージ
   - GitHub ActionsはデフォルトでmainブランチのワークフローファイルPMを読み込むため必須

### Step 7: 動作確認 ✅

GitHubリポジトリのIssueやPRで`@claude`メンションして正常に動作することを確認

## 🚀 実用的な使用例

### 基本的な活用パターン

#### コード改善の依頼

```
@claude このコードの改善点を教えてください
```

#### エラーハンドリングの追加

```
@claude エラーハンドリングを追加してください
```

#### コードレビューの実施

```
@claude このPRをレビューしてください
```

## 💡 重要なポイントと制限事項

### 成功のための重要事項

1. **フォーク版リポジトリの必須使用**
   - OAuth認証機能はフォーク版でのみ利用可能
   - 公式版では対応していない

2. **セキュリティ設定の適切な管理**
   - GitHub Appインストール時のAPIキー一時設定と削除
   - OAuth設定完了後の`ANTHROPIC_API_KEY`削除

3. **ワークフローの配置要件**
   - mainブランチへのマージが必須
   - デフォルトブランチのワークフローファイルのみ有効

4. **プライバシー保護**
   - リポジトリをprivateに設定して他者からの意図しない`@claude`メンションを防止

### 利用上の制限事項

- Claude Maxサブスクリプションが必要
- リポジトリの管理者権限が必須
- フォーク版のアクションのみサポート

## 📚 参考資料

### 関連リソース

- **技術記事**: [Use Claude Github Actions with Claude Max](https://grll.bearblog.dev/use-claude-github-actions-with-claude-max/)
- **公式リポジトリ**: [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- **ベースアクション**: [grll/claude-code-base-action](https://github.com/grll/claude-code-base-action)

## まとめ

この設定により、追加のAPI料金なしでClaude MaxをGitHub Actionsで活用できるようになります。OAuth認証を活用することで、セキュアかつコスト効率的にAIアシスタント機能をCI/CDパイプラインに統合することが可能です。

Register as a new user and use Qiita more conveniently

1. You get articles that match your needs
2. You can efficiently read back useful information
3. You can use dark theme
[What you can do with signing up](https://help.qiita.com/ja/articles/qiita-login-user)

[Sign up](https://qiita.com/signup?callback_action=login_or_signup&redirect_to=%2Fakira_funakoshi%2Fitems%2Fe101a4e3ac9844e7b313&realm=qiita) [Login](https://qiita.com/login?callback_action=login_or_signup&redirect_to=%2Fakira_funakoshi%2Fitems%2Fe101a4e3ac9844e7b313&realm=qiita)

[27](https://qiita.com/akira_funakoshi/items/e101a4e3ac9844e7b313/likers)

33
