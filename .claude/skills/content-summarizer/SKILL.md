---
name: content-summarizer
description: |
  gitにcommitしていないmdファイルを検出し、frontmatterのsource URLからコンテンツを取得して要約するスキル。
  Webページ（Firecrawl/WebFetch）とYouTube（文字起こしAPI）の両方に対応。
  要約後はレビューを行い、事実確認と補足情報を追加する。
  使用タイミング: (1) 新しいclippingファイルの要約、(2) 動画・記事のノート作成、(3) 既存ノートへの要約追加
---

# Content Summarizer Skill

Uncommittedなmdファイルのsource URLからコンテンツを取得し、構造化された要約を生成するスキル。

## 概要

このスキルは3つのフェーズでコンテンツを要約する：

| フェーズ | 役割 | 使用ツール |
|----------|------|----------|
| **Content Fetcher** | URLからコンテンツ取得 | YouTube Transcription MCP, Firecrawl, WebFetch |
| **Summarizer** | 構造化要約を生成 | Task (general-purpose) |
| **Reviewer** | 事実確認・補足情報追加 | Task (general-purpose) |

詳細なリファレンス：
- サブエージェントプロンプト: [references/subagents.md](references/subagents.md)
- 要約フォーマット: [references/summary-format.md](references/summary-format.md)

## 実行フロー

```
Phase 1: ファイル検出
    ├─ git status で uncommitted な md ファイルを検出
    └─ frontmatter の source URL を解析
          │
Phase 2: コンテンツ取得
    ├─ YouTube → mcp__youtube-transcription__get_transcript
    └─ Web → mcp__firecrawl__firecrawl_scrape / WebFetch
          │
Phase 3: 要約生成
    ├─ メタデータ抽出・補完
    └─ 構造化された要約を生成
          │
Phase 4: レビュー
    ├─ 事実確認
    └─ 補足情報追加
          │
Phase 5: ユーザー確認・適用
    └─ AskUserQuestion で確認後、ファイル更新
```

## Phase 1: ファイル検出

### 1.1 Uncommitted ファイルの検出

```bash
# 新規追加・変更されたmdファイルを検出
git status --porcelain | grep -E "^(\?\?|M |A )" | grep "\.md$"
```

### 1.2 Frontmatter 解析

対象ファイルから `source` URLを抽出。sourceがない場合はスキップ。

### 1.3 処理対象の判定

複数ファイルがある場合は `AskUserQuestion` で確認：
- 全て処理するか
- 特定のファイルのみ選択するか

## Phase 2: コンテンツ取得

### 2.1 URL タイプ判定

YouTube URLパターン:
- `youtube.com/watch?v=xxx`
- `youtu.be/xxx`
- `youtube.com/embed/xxx`
- `m.youtube.com/watch?v=xxx`

### 2.2 YouTube コンテンツ取得

Task toolでgeneral-purpose subagentを使用:

```
subagent_type: general-purpose
prompt: |
  ## YouTube文字起こし取得
  URL: {source_url}

  mcp__youtube-transcription__get_transcript を使用して以下を取得:
  - タイトル
  - チャンネル名
  - 公開日
  - 文字起こし全文（タイムスタンプ付き）
```

### 2.3 Web コンテンツ取得

```
subagent_type: general-purpose
prompt: |
  ## Webコンテンツ取得
  URL: {source_url}

  mcp__firecrawl__firecrawl_scrape または WebFetch を使用して以下を取得:
  - タイトル
  - 著者
  - 公開日
  - 本文（Markdown形式）
```

### 2.4 エラーハンドリング

取得失敗時は `AskUserQuestion` で確認:
- スキップする
- 手動入力する

## Phase 3: 要約生成

Task toolでgeneral-purpose subagentを使用:

```
subagent_type: general-purpose
prompt: |
  ## コンテンツ要約

  ### メタデータ補完
  - author: 著者名
  - published: 公開日（YYYY-MM-DD）
  - description: 100-200文字の概要
  - tags: 関連タグ（5-10個）

  ### 要約構造
  1. 概要
  2. 主要なトピック（元の構造に沿う）
  3. 重要な事実・データ
  4. 結論・示唆
```

詳細な要約フォーマットは [references/summary-format.md](references/summary-format.md) を参照。

## Phase 4: レビュー

Task toolでgeneral-purpose subagentを使用:

```
subagent_type: general-purpose
prompt: |
  ## 要約レビュー

  ### レビュー観点
  1. 事実確認（数値・データの正確性）
  2. 網羅性（重要ポイントの漏れ）
  3. 補足情報（背景情報、用語説明）
  4. 品質（明瞭さ、一貫性）

  ### 出力
  - 総合評価（問題なし/軽微な修正推奨/要修正）
  - 修正提案（具体的な変更箇所と修正内容）
  - 追加すべき補足情報
```

## Phase 5: ユーザー確認・適用

### 5.1 確認場面

| 場面 | AskUserQuestion |
|------|-----------------|
| 複数ファイル検出 | 全て処理するか、選択するか |
| 既存コンテンツあり | 上書き/追記/スキップ |
| 取得失敗 | スキップ/手動入力 |
| レビュー完了 | 修正/そのまま適用 |

### 5.2 適用処理

1. 生成された要約をプレビュー表示
2. ユーザー確認
3. 承認された場合:
   - frontmatter を更新（Edit tool）
   - 本文を追記/上書き（Edit tool）

## コマンドリファレンス

### Git Status

```bash
# Uncommitted mdファイル一覧
git status --porcelain | grep "\.md$"
```

### YouTube文字起こし

```
mcp__youtube-transcription__get_transcript
  video_identifier: {url}
  include_metadata: true
  include_timestamps: true
  languages: ['ja', 'en']
```

### Webスクレイピング

```
mcp__firecrawl__firecrawl_scrape
  url: {url}
  formats: ["markdown"]
  onlyMainContent: true
```

## エラーハンドリング

| エラー | 対処 |
|-------|------|
| source URL未設定 | スキップ（警告出力） |
| YouTube文字起こし不可 | AskUserQuestionで確認 |
| Webページアクセス不可 | AskUserQuestionで確認 |
| コンテンツ長すぎる | 分割処理または範囲限定 |

## 使用例

### 基本的な使用

```
ユーザー: コンテンツを要約して

Claude:
1. git statusでuncommittedなmdファイルを検出
2. 各ファイルのsource URLを確認
3. AskUserQuestionで処理対象を確認
4. コンテンツ取得 → 要約生成 → レビュー
5. AskUserQuestionで最終確認
6. ファイル更新
```

### 特定ファイルの要約

```
ユーザー: Clippings/article.md を要約して

Claude:
1. 指定ファイルのfrontmatterを解析
2. source URLからコンテンツ取得
3. 要約生成 → レビュー
4. AskUserQuestionで確認
5. ファイル更新
```
