---
title: "Claude CodeとGitHub Issueを使った全自動開発について"
source: "https://memotty-obsidian.pages.dev/202506151218-claude-code%E3%81%A8github-issue%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E5%85%A8%E8%87%AA%E5%8B%95%E9%96%8B%E7%99%BA%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/#%E5%AE%9F%E8%A1%8C%E6%96%B9%E6%B3%95-1"
author:
  - "memotty"
published: "2025-06-15"
created: 2025-06-16
description: "Claude CodeとGitHub Issueを活用した全自動開発ワークフローの実装方法を詳しく解説。優先度管理、自動ブランチ作成、PR自動生成、実行履歴保存機能を備えた実用的なBashスクリプトを提供し、開発効率の大幅向上を実現する手法について説明する。"
tags:
  - "claude-code"
  - "github-issues"
  - "automation"
  - "bash-script"
  - "development-workflow"
  - "ci-cd"
  - "git-automation"
---

## 概要

本記事では、Claude CodeとGitHub Issueを組み合わせた全自動開発ワークフローの実装方法について詳しく説明します。優先度に基づくIssue自動処理、ブランチ作成、実装、コミット、PR作成までを一連のBashスクリプトで自動化し、開発効率を大幅に向上させる手法を提供します。

### 主な特徴

- **優先度管理**: P0〜P3のラベル階層による自動優先度判定
- **自動ブランチ作成**: Issue番号に基づく専用ブランチの自動生成
- **Claude Code統合**: AI支援による実装の自動化
- **実行履歴保存**: 全セッションの完全なログ記録
- **PR自動生成**: 実装完了後の自動Pull Request作成
- **柔軟なカスタマイズ**: 優先度ラベル、フィルタリング条件の設定可能

### 適用場面

- **出先での緊急対応**: 自動モードによる無人実行
- **開発環境での検証**: 手動確認を含む段階的実行
- **チーム開発**: 統一されたワークフローの実現

## 注意事項

現在多数の方に閲覧されていますが、こちらの記事はまだ試験段階であり、改善の余地はたくさんあると考えています。  
使用する際は十分ご注意ください。  
このコードを使用したことで発生する不利益については、筆者は一切責任を負いません。  
ご了承ください。

## システム要件と事前準備

### 必要なツール

1. **GitHub CLI (gh)**: GitHub APIとの連携に必要
2. **Claude Code**: AIによる実装実行用
3. **jq**: JSON処理用ライブラリ
4. **script**: セッション記録用コマンド（macOS/Linux標準）

### プロジェクト構造の設定

- **docsディレクトリ管理**: Wikiの代わりにdocsディレクトリで文書管理
- **README.md**: プロジェクト概要の明記
- **Issue Template**: `.github/ISSUE_TEMPLATE/`配下でテンプレート作成
- **事前Issue作成**: 以下のような具体的タスクIssueを準備
  - `docs/db-schema.md` から `docs/er.md` を作成
  - ログイン画面作成
  - User一覧作成
  - その他機能実装タスク

### 優先度ラベル設定

GitHub Issue用に以下の優先度ラベルを設定：

- **P0**: 最優先（緊急対応）
- **P1**: 高優先度（重要機能）
- **P2**: 中優先度（通常機能）
- **P3**: 低優先度（改善・追加機能）

## 自動化スクリプト詳細

### 1. 優先度ベース自動実行スクリプト（出先用）

**目的**: リモート環境から緊急対応や無人実行を行うための完全自動化スクリプト

**主要機能**:

1. **智的Issue選択**: P0→P1→P2→P3→ラベルなしの優先順位で最適なIssueを自動選択
2. **番号順ソート**: 同一優先度内では番号の小さいIssueを優先処理
3. **自動実行モード**: `-a`オプションによる完全無人実行
4. **柔軟なフィルタリング**: 追加ラベル指定による絞り込み機能
5. **詳細進捗表示**: 各処理ステップの状況をリアルタイム表示
6. **完全履歴保存**: Claude Codeの実行過程を含む全セッション記録

**処理フロー**:

1. GitHub CLIとClaude Codeの環境確認
2. 優先度順Issue検索・選択
3. 専用ブランチ作成
4. Claude Codeによる自動実装
5. Git操作（コミット・プッシュ）
6. Pull Request自動作成
7. セッション履歴の完全保存

```bash
#!/bin/bash

# 優先度順で最初のissueを処理し、Claude Codeの履歴も保存するスクリプト

# 使用方法: ./process_issue_with_history.sh [オプション]

set -e

# 色付き出力用の関数

print_info() {

    echo -e "\033[0;36m[INFO]\033[0m $1"

}

print_success() {

    echo -e "\033[0;32m[SUCCESS]\033[0m $1"

}

print_error() {

    echo -e "\033[0;31m[ERROR]\033[0m $1"

}

print_warning() {

    echo -e "\033[0;33m[WARNING]\033[0m $1"

}

# ヘルプメッセージ

show_help() {

    echo "使用方法: $0 [オプション]"

    echo ""

    echo "オプション:"

    echo "  -l, --label <label>     特定のラベルでフィルタリング"

    echo "  -a, --auto             確認なしで自動実行"

    echo "  -n, --no-history       履歴を保存しない"

    echo "  -d, --history-dir      履歴保存ディレクトリ（デフォルト: claude_history）"

    echo "  -h, --help             このヘルプを表示"

    echo ""

    echo "優先度ラベル:"

    echo "  P0: 最優先"

    echo "  P1: 高優先度"

    echo "  P2: 中優先度"

    echo "  P3: 低優先度"

    echo "  (ラベルなし): 最低優先度"

}

# デフォルト値

ADDITIONAL_LABEL=""

AUTO_MODE=false

SAVE_HISTORY=true

HISTORY_DIR="claude_history"

# オプション解析

while span> $; do

    case $1 in

        -l|--label)

            ADDITIONAL_LABEL="$2"

            shift 2

            ;;

        -a|--auto)

            AUTO_MODE=true

            shift

            ;;

        -n|--no-history)

            SAVE_HISTORY=false

            shift

            ;;

        -d|--history-dir)

            HISTORY_DIR="$2"

            shift 2

            ;;

        -h|--help)

            show_help

            exit 0

            ;;

        *)

            print_error "不明なオプション: $1"

            show_help

            exit 1

            ;;

    esac

done

# GitHub CLIの存在確認

if ! command -v gh &> /dev/null; then

    print_error "GitHub CLI (gh) がインストールされていません"

    echo "インストール方法: https://cli.github.com/"

    exit 1

fi

# Claude Codeの存在確認

if ! command -v claude &> /dev/null; then

    print_error "Claude Code がインストールされていません"

    exit 1

fi

# リポジトリ内かチェック

if ! git rev-parse --git-dir > /dev/null 2>&1; then

    print_error "Gitリポジトリ内で実行してください"

    exit 1

fi

# jqの存在確認

if ! command -v jq &> /dev/null; then

    print_error "jq がインストールされていません"

    echo "インストール方法: sudo apt-get install jq (Ubuntu) または brew install jq (Mac)"

    exit 1

fi

print_info "優先度順でissueを検索中..."

# 優先度ラベルの配列

PRIORITY_LABELS=("P0" "P1" "P2" "P3" "")

# 最初に見つかったissueを処理

FOUND_ISSUE=""

FOUND_PRIORITY=""

for priority in "${PRIORITY_LABELS[@]}"; do

    # クエリの構築

    QUERY="--state open"

    

    if [ -n "$priority" ]; then

        QUERY="$QUERY --label $priority"

        current_priority="$priority"

    else

        current_priority="ラベルなし"

    fi

    

    if [ -n "$ADDITIONAL_LABEL" ]; then

        QUERY="$QUERY --label $ADDITIONAL_LABEL"

    fi

    

    print_info "優先度 $current_priority のissueを検索中..."

    

    # issueを取得（番号順でソート）

    ISSUES=$(gh issue list $QUERY --json number,title,state,labels --limit 100 | jq 'sort_by(.number)')

    

    # 最初のissueを取得

    if [ -n "$ISSUES" ] && [ "$ISSUES" != "[]" ]; then

        FOUND_ISSUE=$(echo "$ISSUES" | jq -r '.[0]')

        FOUND_PRIORITY="$current_priority"

        break

    fi

done

# issueが見つからなかった場合

if [ -z "$FOUND_ISSUE" ] || [ "$FOUND_ISSUE" = "null" ]; then

    print_warning "処理可能なissueが見つかりませんでした"

    exit 0

fi

# issue情報を抽出

ISSUE_NUMBER=$(echo "$FOUND_ISSUE" | jq -r '.number')

ISSUE_TITLE=$(echo "$FOUND_ISSUE" | jq -r '.title')

print_success "処理するissueが見つかりました"

echo ""

echo "================================"

echo "優先度: $FOUND_PRIORITY"

echo "Issue #$ISSUE_NUMBER: $ISSUE_TITLE"

echo "================================"

# 詳細情報を取得

ISSUE_BODY=$(gh issue view "$ISSUE_NUMBER" --json body -q .body)

echo "$ISSUE_BODY" | head -n 10

if [ $(echo "$ISSUE_BODY" | wc -l) -gt 10 ]; then

    echo "... (以下省略)"

fi

echo "================================"

echo ""

# 自動モードでない場合は確認

if [ "$AUTO_MODE" = false ]; then

    read -p "このissueを処理しますか？ (y/N): " confirm

    if [ "$confirm" != "y" ]; then

        print_info "処理をキャンセルしました"

        exit 0

    fi

fi

# 履歴ディレクトリの準備

if [ "$SAVE_HISTORY" = true ]; then

    mkdir -p "$HISTORY_DIR"

    SESSION_ID="issue_${ISSUE_NUMBER}_$(date +%Y%m%d_%H%M%S)"

    SESSION_DIR="$HISTORY_DIR/$SESSION_ID"

    mkdir -p "$SESSION_DIR"

    

    print_info "セッションID: $SESSION_ID"

    print_info "履歴保存先: $SESSION_DIR"

    

    # Issue情報を保存

    gh issue view "$ISSUE_NUMBER" > "$SESSION_DIR/issue_details.txt" 2>&1

    gh issue view "$ISSUE_NUMBER" --json number,title,body,state,labels > "$SESSION_DIR/issue_data.json"

    

    # メタデータの記録

    cat > "$SESSION_DIR/metadata.json" << EOF

{

  "session_id": "$SESSION_ID",

  "issue_number": $ISSUE_NUMBER,

  "priority": "$FOUND_PRIORITY",

  "start_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",

  "git_branch": "$(git branch --show-current)",

  "git_commit": "$(git rev-parse HEAD)",

  "user": "$(whoami)",

  "hostname": "$(hostname)"

}

EOF

fi

# 現在のブランチを保存

CURRENT_BRANCH=$(git branch --show-current)

# 変更があるかチェック

if ! git diff --quiet || ! git diff --cached --quiet; then

    print_error "コミットされていない変更があります"

    echo "変更をコミットまたはstashしてから再実行してください"

    exit 1

fi

# ブランチ作成

BRANCH_NAME="issue-$ISSUE_NUMBER"

print_info "ブランチ '$BRANCH_NAME' を作成します"

# mainまたはmasterブランチを取得

if git show-ref --verify --quiet refs/heads/main; then

    BASE_BRANCH="main"

elif git show-ref --verify --quiet refs/heads/master; then

    BASE_BRANCH="master"

else

    print_error "mainまたはmasterブランチが見つかりません"

    exit 1

fi

# 最新の状態を取得

print_info "最新の変更を取得中..."

git checkout "$BASE_BRANCH"

git pull origin "$BASE_BRANCH"

# ブランチが既に存在するかチェック

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then

    print_warning "ブランチ '$BRANCH_NAME' は既に存在します"

    if [ "$AUTO_MODE" = false ]; then

        read -p "既存のブランチを使用しますか？ (y/N): " use_existing

        if [ "$use_existing" = "y" ]; then

            git checkout "$BRANCH_NAME"

        else

            exit 1

        fi

    else

        print_info "既存のブランチをスキップします"

        exit 0

    fi

else

    git checkout -b "$BRANCH_NAME"

fi

# 一時ファイルにissue情報を保存

TEMP_FILE=$(mktemp)

cat > "$TEMP_FILE" << EOF

GitHub Issue #$ISSUE_NUMBER

優先度: $FOUND_PRIORITY

タイトル: $ISSUE_TITLE

説明:

$ISSUE_BODY

---

上記のissueの内容に基づいて、必要な機能を実装してください。

実装が完了したら、変更内容の概要を教えてください。

EOF

# 履歴保存時はプロンプトも保存

if [ "$SAVE_HISTORY" = true ]; then

    cp "$TEMP_FILE" "$SESSION_DIR/claude_prompt.txt"

fi

print_info "Claude Codeで実装を開始します..."

echo ""

# Claude Codeで実装（履歴保存の有無で分岐）

if [ "$SAVE_HISTORY" = true ]; then

    # scriptコマンドを使用してセッション全体を記録

    if span> &; then

        # macOS

        script -q "$SESSION_DIR/claude_session.log" bash -c "

            claude < '$TEMP_FILE' 2>&1 | tee '$SESSION_DIR/claude_output.log'

        "

    else

        # Linux

        script -q -c "claude < '$TEMP_FILE' 2>&1 | tee '$SESSION_DIR/claude_output.log'" "$SESSION_DIR/claude_session.log"

    fi

else

    # 履歴を保存しない場合

    claude < "$TEMP_FILE"

fi

# 一時ファイルを削除

rm "$TEMP_FILE"

echo ""

print_info "実装が完了しました"

# 変更の確認

if git diff --quiet; then

    print_info "変更はありません"

    exit 0

fi

# 変更内容を表示

echo ""

print_info "変更内容:"

git status --short

# 履歴保存（実装後の状態）

if [ "$SAVE_HISTORY" = true ]; then

    git diff > "$SESSION_DIR/git_diff.patch"

    git diff --name-only > "$SESSION_DIR/changed_files.txt"

    git status --short > "$SESSION_DIR/git_status.txt"

fi

# 自動モードの場合は自動的にコミット

if [ "$AUTO_MODE" = true ]; then

    commit_confirm="y"

else

    echo ""

    read -p "変更をコミットしますか？ (y/N): " commit_confirm

fi

if [ "$commit_confirm" = "y" ]; then

    git add .

    

    # コミットメッセージの作成

    COMMIT_MESSAGE="feat: implement #$ISSUE_NUMBER - $ISSUE_TITLE

Priority: $FOUND_PRIORITY"

    

    git commit -m "$COMMIT_MESSAGE"

    print_success "コミットが完了しました"

    

    # 履歴にコミット情報を追加

    if [ "$SAVE_HISTORY" = true ]; then

        git rev-parse HEAD > "$SESSION_DIR/commit_hash.txt"

        echo "$COMMIT_MESSAGE" > "$SESSION_DIR/commit_message.txt"

    fi

    

    # PRを作成するか確認

    if [ "$AUTO_MODE" = true ]; then

        pr_confirm="y"

    else

        read -p "Pull Requestを作成しますか？ (y/N): " pr_confirm

    fi

    

    if [ "$pr_confirm" = "y" ]; then

        print_info "ブランチをプッシュ中..."

        git push -u origin "$BRANCH_NAME"

        

        # PR作成

        PR_BODY="Closes #$ISSUE_NUMBER

## 優先度

$FOUND_PRIORITY

## 変更内容

Claude Codeを使用してIssue #$ISSUE_NUMBER を実装しました。

## テスト

- [ ] 機能が正常に動作することを確認

- [ ] 既存のテストが通ることを確認

- [ ] 必要に応じて新しいテストを追加"

        

        PR_URL=$(gh pr create \\ 
            --title "Fix #$ISSUE_NUMBER: $ISSUE_TITLE" \\ 
            --body "$PR_BODY" \

            --base "$BASE_BRANCH" \\ 
            --head "$BRANCH_NAME" \

            --web=false)

        

        print_success "Pull Requestを作成しました"

        

        # 履歴にPR情報を追加

        if [ "$SAVE_HISTORY" = true ]; then

            echo "$PR_URL" > "$SESSION_DIR/pr_url.txt"

        fi

    fi

fi

# 履歴保存の最終処理

if [ "$SAVE_HISTORY" = true ]; then

    # 終了時刻を記録

    END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    jq --arg end_time "$END_TIME" '. + {end_time: $end_time}' "$SESSION_DIR/metadata.json" > "$SESSION_DIR/metadata_tmp.json"

    mv "$SESSION_DIR/metadata_tmp.json" "$SESSION_DIR/metadata.json"

    

    # サマリーレポートの作成

    cat > "$SESSION_DIR/summary.md" << EOF

# Claude Code実装セッション サマリー

## セッション情報

- セッションID: $SESSION_ID

- Issue番号: #$ISSUE_NUMBER

- 優先度: $FOUND_PRIORITY

- タイトル: $ISSUE_TITLE

- 開始時刻: $(jq -r .start_time "$SESSION_DIR/metadata.json")

- 終了時刻: $END_TIME

## 実行結果

- ブランチ: $BRANCH_NAME

- コミット: $([ -f "$SESSION_DIR/commit_hash.txt" ] && cat "$SESSION_DIR/commit_hash.txt" || echo "未コミット")

- PR: $([ -f "$SESSION_DIR/pr_url.txt" ] && cat "$SESSION_DIR/pr_url.txt" || echo "未作成")

## 変更ファイル

$([ -f "$SESSION_DIR/changed_files.txt" ] && cat "$SESSION_DIR/changed_files.txt" | sed 's/^/- /' || echo "なし")

## Claude Codeの出力（抜粋）

\\`\\`\\`

$([ -f "$SESSION_DIR/claude_output.log" ] && tail -n 20 "$SESSION_DIR/claude_output.log" || echo "ログなし")

\\`\\`\\`

## 詳細ファイル

- 完全なClaude出力: claude_output.log

- セッション記録: claude_session.log

- Git差分: git_diff.patch

- Issue詳細: issue_details.txt

EOF

fi

# 成功時のサマリー

echo ""

echo "================================"

echo "処理完了サマリー"

echo "================================"

echo "優先度: $FOUND_PRIORITY"

echo "Issue: #$ISSUE_NUMBER"

echo "ブランチ: $BRANCH_NAME"

if [ "$SAVE_HISTORY" = true ]; then

    echo "セッションID: $SESSION_ID"

    echo "履歴保存先: $SESSION_DIR"

fi

echo "================================"

print_success "処理が完了しました"
```

**実行方法**:

```bash
chmod +x process_top_priority_issue.sh

# 基本実行（優先度順で最初のIssueを処理）
./process_top_priority_issue.sh

# 特定ラベルでフィルタリング
./process_top_priority_issue.sh -l bug

# 完全自動モード（確認なしで実行）
./process_top_priority_issue.sh -a

# 複数オプション組み合わせ
./process_top_priority_issue.sh -l enhancement -a
```

### 2. 手動確認用スクリプト（開発環境用）

**目的**: 開発環境でClaude Codeの実装結果を段階的に確認・検証するためのスクリプト

**特徴**:

- 自動コミットを行わず、実装結果の目視確認が可能
- セッション履歴の完全保存
- 手動でのGit操作推奨
- 詳細なサマリーレポート生成

## カスタマイズ設定

### 優先度ラベルのカスタマイズ

組織の運用に合わせて、スクリプト内の`PRIORITY_LABELS`配列を変更可能：

```bash
# 緊急度ベースの例
PRIORITY_LABELS=("urgent" "high" "medium" "low" "")

# 重要度ベースの例
PRIORITY_LABELS=("critical" "important" "normal" "")

# Scrumベースの例
PRIORITY_LABELS=("must-have" "should-have" "could-have" "")
```

```bash
#!/bin/bash

# Claude Codeの試行履歴を保存しながら実装するスクリプト

# 使用方法: ./implement_with_history.sh <issue番号>

set -e

# 色付き出力用の関数

print_info() {

    echo -e "\033[0;36m[INFO]\033[0m $1"

}

print_success() {

    echo -e "\033[0;32m[SUCCESS]\033[0m $1"

}

print_error() {

    echo -e "\033[0;31m[ERROR]\033[0m $1"

}

# 引数チェック

if [ $# -eq 0 ]; then

    print_error "Issue番号を指定してください"

    echo "使用方法: $0 <issue番号>"

    exit 1

fi

ISSUE_NUMBER=$1

# 履歴ディレクトリの作成

HISTORY_DIR="claude_history"

mkdir -p "$HISTORY_DIR"

# セッション用のディレクトリ作成

SESSION_ID="issue_${ISSUE_NUMBER}_$(date +%Y%m%d_%H%M%S)"

SESSION_DIR="$HISTORY_DIR/$SESSION_ID"

mkdir -p "$SESSION_DIR"

print_info "セッションID: $SESSION_ID"

print_info "履歴保存先: $SESSION_DIR"

# GitHub CLIとClaude Codeの存在確認

if ! command -v gh &> /dev/null; then

    print_error "GitHub CLI (gh) がインストールされていません"

    exit 1

fi

if ! command -v claude &> /dev/null; then

    print_error "Claude Code がインストールされていません"

    exit 1

fi

# Issue情報の取得と保存

print_info "Issue #$ISSUE_NUMBER の情報を取得中..."

gh issue view "$ISSUE_NUMBER" > "$SESSION_DIR/issue_details.txt" 2>&1

# Issue情報を構造化して保存

gh issue view "$ISSUE_NUMBER" --json number,title,body,state,labels > "$SESSION_DIR/issue_data.json"

# メタデータの記録

cat > "$SESSION_DIR/metadata.json" << EOF

{

  "session_id": "$SESSION_ID",

  "issue_number": $ISSUE_NUMBER,

  "start_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",

  "git_branch": "$(git branch --show-current)",

  "git_commit": "$(git rev-parse HEAD)",

  "user": "$(whoami)",

  "hostname": "$(hostname)"

}

EOF

# Claudeへの入力を準備

ISSUE_TITLE=$(gh issue view "$ISSUE_NUMBER" --json title -q .title)

ISSUE_BODY=$(gh issue view "$ISSUE_NUMBER" --json body -q .body)

# Claude用のプロンプトを作成

cat > "$SESSION_DIR/claude_prompt.txt" << EOF

GitHub Issue #$ISSUE_NUMBER

タイトル: $ISSUE_TITLE

説明:

$ISSUE_BODY

---

上記のissueの内容に基づいて、必要な機能を実装してください。

実装が完了したら、変更内容の概要を教えてください。

EOF

print_info "Claude Codeで実装を開始します..."

echo "すべての出力は $SESSION_DIR/claude_output.log に保存されます"

echo ""

# scriptコマンドを使用してClaude Codeのセッション全体を記録

if span> &; then

    # macOS

    script -q "$SESSION_DIR/claude_session.log" bash -c "

        claude < '$SESSION_DIR/claude_prompt.txt' 2>&1 | tee '$SESSION_DIR/claude_output.log'

    "

else

    # Linux

    script -q -c "claude < '$SESSION_DIR/claude_prompt.txt' 2>&1 | tee '$SESSION_DIR/claude_output.log'" "$SESSION_DIR/claude_session.log"

fi

# 実装後の変更を記録

print_info "変更内容を記録中..."

# git diffを保存

git diff > "$SESSION_DIR/git_diff.patch"

git diff --name-only > "$SESSION_DIR/changed_files.txt"

git status --short > "$SESSION_DIR/git_status.txt"

# 終了時刻を記録

END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

jq --arg end_time "$END_TIME" '. + {end_time: $end_time}' "$SESSION_DIR/metadata.json" > "$SESSION_DIR/metadata_tmp.json"

mv "$SESSION_DIR/metadata_tmp.json" "$SESSION_DIR/metadata.json"

# サマリーレポートの作成

cat > "$SESSION_DIR/summary.md" << EOF

# Claude Code実装セッション サマリー

## セッション情報

- セッションID: $SESSION_ID

- Issue番号: #$ISSUE_NUMBER

- タイトル: $ISSUE_TITLE

- 開始時刻: $(date)

- 終了時刻: $(date)

## 変更ファイル

$(cat "$SESSION_DIR/changed_files.txt" | sed 's/^/- /')

## Claude Codeの出力（抜粋）

\\`\\`\\`

$(tail -n 20 "$SESSION_DIR/claude_output.log")

\\`\\`\\`

## 詳細ファイル

- 完全なClaude出力: claude_output.log

- セッション記録: claude_session.log

- Git差分: git_diff.patch

- Issue詳細: issue_details.txt

EOF

print_success "実装が完了しました"

echo ""

echo "================================"

echo "セッションサマリー"

echo "================================"

echo "セッションID: $SESSION_ID"

echo "保存先: $SESSION_DIR"

echo ""

echo "主要ファイル:"

echo "  - claude_output.log: Claude Codeの出力"

echo "  - claude_session.log: 完全なセッション記録"

echo "  - git_diff.patch: 変更内容の差分"

echo "  - summary.md: セッションサマリー"

echo "================================"

# 変更がある場合は表示

if [ -s "$SESSION_DIR/git_diff.patch" ]; then

    echo ""

    print_info "変更されたファイル:"

    cat "$SESSION_DIR/changed_files.txt"

    echo ""

    echo "次のステップ:"

    echo "  1. cat $SESSION_DIR/summary.md      # サマリーを確認"

    echo "  2. git diff                          # 変更内容を確認"

    echo "  3. git add .                         # ステージング"

    echo "  4. git commit -m \"feat: implement #$ISSUE_NUMBER\""

fi
```

**実行方法**:

```bash
chmod +x implement_with_history.sh

# 基本使用方法（Issue番号指定）
./implement_with_history.sh <issue番号>

# 例：Issue #123の実装
./implement_with_history.sh 123
```

## セッション記録とログ管理

### 自動保存される情報

両スクリプトは以下の情報を`claude_history/`ディレクトリに自動保存：

1. **セッションメタデータ** (`metadata.json`)
   - セッションID、Issue番号、開始/終了時刻
   - Gitブランチ、コミットハッシュ
   - 実行ユーザー、ホスト名

2. **Issue詳細情報** (`issue_data.json`, `issue_details.txt`)
   - Issue本文、タイトル、ラベル
   - 構造化されたJSON形式での保存

3. **Claude Code実装記録**
   - `claude_output.log`: Claude Codeの標準出力
   - `claude_session.log`: 完全なセッション記録
   - `claude_prompt.txt`: 送信されたプロンプト

4. **Git変更記録**
   - `git_diff.patch`: 実装による変更差分
   - `changed_files.txt`: 変更ファイル一覧
   - `git_status.txt`: Git状態スナップショット

5. **サマリーレポート** (`summary.md`)
   - セッション全体の要約
   - 主要な実行結果
   - 次のステップの推奨事項

### 履歴の活用方法

- **デバッグ**: 実装エラー時の原因特定
- **学習**: Claude Codeの実装パターン分析
- **監査**: 自動化実行の透明性確保
- **改善**: ワークフローの継続的改善

## 運用上の推奨事項

### セキュリティ考慮事項

- GitHub Personal Access Tokenの適切な管理
- 機密情報を含むIssueでの使用時の注意
- 実行ログの適切な保管・削除ポリシー

### 運用効率の向上

- Issue Template標準化による品質向上
- 定期的な優先度ラベル見直し
- チーム内でのワークフロー統一
- 自動化スクリプトの定期的な改善

### トラブルシューティング

- GitHub CLI認証エラー時の対処
- Claude Code実行失敗時の復旧手順
- 履歴ファイルの容量管理
- 並行実行時の競合回避策

## まとめ

本記事で紹介したClaude CodeとGitHub Issueを活用した全自動開発ワークフローは、以下の価値を提供します：

- **開発効率の大幅向上**: 手動作業の削減と一貫したワークフロー
- **品質の維持**: 段階的確認プロセスと完全な履歴記録
- **運用の透明性**: 全プロセスの可視化と監査可能性
- **チーム協調**: 標準化されたプロセスによる共同作業の改善

実際の導入時は、組織の開発文化やセキュリティポリシーに合わせたカスタマイズを行い、段階的に適用することを推奨します。

---
