---
description: gitにcommitしていないmdファイルのsource URLからコンテンツを取得し、要約を生成する。引数でファイルパスを指定可能。
argument-hint: [file-path (optional)]
---

# Content Summarizer

content-summarizer skillを使用して、uncommittedなmdファイルを要約します。

## 実行内容

1. **ファイル検出**: 引数がある場合はそのファイル、ない場合は`git status`でuncommittedなmdファイルを検出
2. **コンテンツ取得**: frontmatterのsource URLからコンテンツを取得（YouTube/Web対応）
3. **要約生成**: メタデータ補完 + 構造化要約を生成
4. **レビュー**: 事実確認と補足情報を追加
5. **適用**: ユーザー確認後にファイルを更新

## 対象ファイル

$ARGUMENTS

## 現在のGit Status

!`git status --porcelain | grep "\.md$" | head -20`

## 指示

上記の情報を基に、content-summarizer skillに従って以下を実行してください：

### 引数がある場合

指定されたファイル `$ARGUMENTS` のfrontmatterからsource URLを読み取り、コンテンツを取得して要約を生成してください。

### 引数がない場合

uncommittedなmdファイルを検出し、AskUserQuestionツールで処理対象を確認してから要約を実行してください。

### 処理フロー

1. 対象ファイルのfrontmatterを解析し、source URLを取得
2. URLタイプを判定（YouTube: youtube.com/youtu.be パターン）
3. コンテンツ取得:
   - YouTube → mcp__youtube-transcription__get_transcript
   - Web → mcp__firecrawl__firecrawl_scrape または WebFetch
4. Task tool (general-purpose) で要約生成
5. Task tool (general-purpose) でレビュー
6. AskUserQuestionで確認後、Edit toolでファイル更新

### メタデータ補完

以下のfrontmatterフィールドを補完してください：

- author: 著者名（`[[Name]]` 形式）
- published: 公開日（YYYY-MM-DD形式）
- description: 100-200文字の概要
- tags: 関連タグ（5-10個）

### 要約構造

1. 概要（1-2段落）
2. 主要なトピック（元の構造に沿う）
3. 重要な事実・データ
4. 結論・示唆

詳細なフォーマットは @.claude/skills/content-summarizer/references/summary-format.md を参照してください。
