# Subagent プロンプトテンプレート

このスキルでは、Task toolを使用してgeneral-purpose subagentにプロンプトを渡す形式で処理を行う。

## 1. Content Fetcher プロンプト

### YouTube コンテンツ取得

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    ## YouTube文字起こし取得

    ### 対象
    URL: {source_url}
    ファイル: {file_path}

    ### 使用ツール
    mcp__youtube-transcription__get_transcript を使用して文字起こしを取得してください。

    ### 取得オプション
    video_identifier: {source_url}
    include_metadata: true
    include_timestamps: true
    languages: ['ja', 'en']

    ### 出力形式
    以下の情報を抽出して返してください：
    - タイトル
    - チャンネル名
    - 公開日（YYYY-MM-DD形式）
    - 動画の長さ
    - 文字起こし全文（タイムスタンプ付き）

    ### エラー処理
    - 文字起こしが利用不可の場合は、その旨を報告してください
    - 日本語が利用不可の場合は英語で取得してください
```

### Web コンテンツ取得

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    ## Webコンテンツ取得

    ### 対象
    URL: {source_url}
    ファイル: {file_path}

    ### 使用ツール（優先順）
    1. mcp__firecrawl__firecrawl_scrape を優先使用
       - url: {source_url}
       - formats: ["markdown"]
       - onlyMainContent: true

    2. フォールバック: WebFetch を使用
       - url: {source_url}
       - prompt: "記事の本文、著者、公開日を抽出してください"

    ### 出力形式
    以下の情報を抽出して返してください：
    - タイトル
    - 著者（見つかった場合）
    - 公開日（見つかった場合、YYYY-MM-DD形式）
    - 本文（Markdown形式）

    ### エラー処理
    - ページアクセス不可の場合はエラーを報告
    - コンテンツが取得できない場合はその理由を説明
```

---

## 2. Summarizer プロンプト

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    ## コンテンツ要約

    ### 対象ファイル
    {file_path}

    ### 元コンテンツ
    {fetched_content}

    ### 1. メタデータ抽出・補完

    以下の項目を元コンテンツから抽出し、frontmatterに追加する形式で出力してください：

    - **author**: 著者名。見つからない場合は空欄
    - **published**: 公開日（YYYY-MM-DD形式）。見つからない場合は空欄
    - **description**: 100-200文字の概要。見つからない場合は内容から生成
    - **tags**: 関連タグ（5-10個の配列）。見つからない場合は内容から生成

    ### 2. 要約構造

    以下の構造で要約を生成してください：

    #### 概要
    - 1-2段落で全体像を説明

    #### 主要なトピック
    - 元のコンテンツの構造に沿ったセクション
    - 各セクションで重要ポイントを箇条書き

    #### 重要な事実・データ
    - 数値データ、統計
    - 引用可能な主張
    - 技術的な詳細

    #### 結論・示唆
    - 著者の結論
    - 実践的な示唆

    ### 制約
    - 技術的正確さを維持すること
    - 元ソースの制限事項があれば明記すること
    - 推測や解釈は最小限に抑えること
    - 重要な内容を省略しないこと

    ### 出力形式
    以下の形式で出力してください：

    ```yaml
    # frontmatter補完
    author: "著者名"
    published: "YYYY-MM-DD"
    description: "概要文"
    tags:
      - "tag1"
      - "tag2"
    ```

    ```markdown
    # 要約本文
    [要約内容をMarkdown形式で]
    ```
```

### YouTube 専用要約プロンプト

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    ## YouTube動画要約

    ### 対象ファイル
    {file_path}

    ### 動画情報
    タイトル: {title}
    チャンネル: {channel}
    公開日: {published}
    長さ: {duration}

    ### 文字起こし
    {transcript}

    ### 1. メタデータ補完

    - **author**: "[[{channel}]]" 形式
    - **published**: {published}
    - **description**: 動画の概要（100-200文字）
    - **tags**: 関連タグ（5-10個）

    ### 2. 要約構造

    #### 動画概要
    - チャンネル、公開日、長さを含める

    #### タイムスタンプ付き要約
    主要なセクションごとにタイムスタンプ付きで要約：

    ### [MM:SS] セクション名
    - ポイント1
    - ポイント2

    #### キーメッセージ
    動画の主要なメッセージを3-5点

    #### 結論・示唆
    実践的な示唆や行動項目

    ### 出力形式
    frontmatter補完と要約本文を分けて出力してください
```

---

## 3. Reviewer プロンプト

```
Task tool:
  subagent_type: general-purpose
  prompt: |
    ## 要約レビュー

    ### 対象ファイル
    {file_path}

    ### 生成された要約
    {generated_summary}

    ### 元コンテンツ（参照用）
    {original_content}

    ### レビュー観点

    #### 1. 事実確認
    - 数値・データの正確性を確認
    - 引用の正確性を確認
    - 日付・時間の正確性を確認
    - 誤った情報があれば指摘

    #### 2. 網羅性
    - 重要ポイントの漏れがないか確認
    - 元の論理構造が維持されているか確認
    - 省略されるべきでない情報がないか確認

    #### 3. 補足情報
    理解を促進するために以下を追加検討：
    - 関連する背景情報
    - 専門用語の説明
    - 関連リソースへのリンク

    #### 4. 品質
    - 文章の明瞭さ
    - 構造の一貫性
    - 読みやすさ

    ### 出力形式

    #### 総合評価
    - [ ] 問題なし - そのまま適用可能
    - [ ] 軽微な修正推奨 - 小さな改善点あり
    - [ ] 要修正 - 重要な問題あり

    #### 修正提案
    修正が必要な場合、具体的な変更箇所と修正内容を記載：

    | 箇所 | 現在の内容 | 修正案 | 理由 |
    |------|-----------|--------|-----|
    | ... | ... | ... | ... |

    #### 追加すべき補足情報
    - [補足情報1]
    - [補足情報2]

    #### 修正済み要約
    修正が必要な場合は、修正を反映した完全な要約を出力
```

---

## 呼び出し例

### Phase 2: コンテンツ取得

```javascript
// URLタイプ判定
const isYouTube = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(sourceUrl);

if (isYouTube) {
  // YouTube用プロンプトで呼び出し
  Task(subagent_type: "general-purpose", prompt: contentFetcherYouTubePrompt);
} else {
  // Web用プロンプトで呼び出し
  Task(subagent_type: "general-purpose", prompt: contentFetcherWebPrompt);
}
```

### Phase 3: 要約生成

```javascript
// 取得したコンテンツを要約
Task(subagent_type: "general-purpose", prompt: summarizerPrompt);
```

### Phase 4: レビュー

```javascript
// 要約をレビュー
Task(subagent_type: "general-purpose", prompt: reviewerPrompt);
```
