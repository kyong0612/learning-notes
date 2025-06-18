---
title: "Claude Codeの会話ログをDuckDBで分析して自分の仕事スタイルを改善する方法"
source: "https://www.yasuhisay.info/entry/2025/06/15/162704"
author:
  - "yasuhisa.yoshida (syou6162)"
published: 2025-06-15
created: 2025-06-18
description: "Claude Codeの会話ログ（JSONL形式）をDuckDBで分析し、自分の仕事スタイルを改善する実践的な方法論を解説。データエンジニア視点での統計分析アプローチ、音声入力の課題分析、英語プロンプト学習の効率化など、具体的なSQLクエリとスキーマ情報を交えて詳しく紹介。"
tags:
  - "claude-code"
  - "duckdb"
  - "データ分析"
  - "jsonl"
  - "ログ分析"
  - "音声入力"
  - "ai-tools"
  - "データエンジニアリング"
---

## 3行まとめ

- **Claude Codeの会話ログはJSONL形式で保存**されており、DuckDBを使って日次の利用状況や音声入力の課題などを分析できる
- **英語プロンプトの学習効率化**やエラーパターンの特定など、自分の仕事の仕方を改善するための実践的な活用方法がある
- **JSONLファイルのスキーマ情報**を整理することで、Claude Codeがクエリを書く際の精度が向上する

## はじめに

[Claude Code](https://docs.anthropic.com/ja/docs/claude-code/overview)は非常に強力なツールで、筆者はもはやこれなしでコードを書けないほど便利に使っています。データを扱う職種として、自分がどのようなやり取りをClaude Codeと行っているのかを知りたくなり、その会話ログを分析することで自分の仕事の仕方を改善する方法について解説します。

## Claude Codeのログ保存機能とその特徴

### ログの保存形式と場所

Claude Codeはコマンドラインツールとして、ローカルに会話のログを**JSONL（JSON Lines）形式**で保存します。

- **保存場所**: `~/.claude/projects/*/conversations/*.jsonl`
- **形式**: 1行に1つのJSONオブジェクトを記述する形式
- **内容**: ユーザーの発話内容とエージェントの出力内容

### ログ分析の課題

Claude Codeのドキュメントには構造が示されていないため、**どのようなスキーマでJSONLログが出力されるかが明確ではありません**。このため、人間にとってもClaude Codeにとっても分析が困難で、適切なスキーマ情報なしでは分析クエリを間違えることがありました。

## ログ分析の活用例

### 主要な分析対象

1. **プロジェクト別の会話分析**: どのようなプロジェクト、リポジトリでどれくらいの会話をしていたのかを日ごとに分析
2. **音声入力特有の課題の把握**: 音声認識の精度や同音異義語の問題を定量的に評価

### 音声入力の課題と英語プロンプトの活用

筆者は音声入力を通じてClaude Codeとプロンプトを書いていますが、特に日本語では**同音異義語の問題**があるため正しく認識されない場合があります。

**改善のアプローチ**:

- プロンプトで実際によく使う表現を覚えることで、汎用的な英語学習よりも効率的に学習
- **エージェントとのやり取りに特化したプロンプト用の英語**を身につける
- 実際に使った英語表現の分析により、改善点を特定

## DuckDBを用いた分析アプローチ

### なぜDuckDBなのか

Claude Codeとの会話頻度や使用パターンを把握するために統計・集計処理が必要です。

**DuckDBの優位性**:

- jqはレコード単位・フィルタリング向き
- **DuckDBは集計関数やウィンドウ関数を要する統計解析向き**
- 複雑な統計処理に非常に有用

### 実践的な分析SQLクエリ

以下は分析の起点となる包括的なSQLクエリです：

```sql
SELECT 
    sessionId,
    timestamp,
    cwd,
    type as message_type,
    message.role as message_role,
    -- プロジェクト名をcwdパスから抽出
    SPLIT_PART(cwd, '/', -1) as project_name,
    
    -- メッセージコンテンツの抽出
    CASE 
        WHEN json_type(message.content) = 'VARCHAR' THEN 
            message.content::VARCHAR
        WHEN json_extract_string(message.content, '$[0].type') = 'text' THEN
            json_extract_string(message.content, '$[0].text')
        WHEN json_extract_string(message.content, '$[0].type') = 'thinking' THEN
            json_extract_string(message.content, '$[0].thinking')
        WHEN json_extract_string(message.content, '$[0].type') = 'tool_result' THEN
            LEFT(json_extract_string(message.content, '$[0].content'), 500)
        WHEN json_extract_string(message.content, '$[0].type') = 'tool_use' THEN
            CONCAT('Tool: ', json_extract_string(message.content, '$[0].name'), 
                   ' | Input: ', LEFT(json_extract(message.content, '$[0].input')::VARCHAR, 200))
        ELSE 
            'Complex/Unknown content structure'
    END as message_text,
    
    -- トークン使用量情報
    json_extract(message, '$.usage.input_tokens')::INT as input_tokens,
    json_extract(message, '$.usage.output_tokens')::INT as output_tokens,
    
    -- 総トークン数
    (COALESCE(json_extract(message, '$.usage.input_tokens')::INT, 0) + 
     COALESCE(json_extract(message, '$.usage.output_tokens')::INT, 0)) as total_tokens
        
FROM read_json_auto(
    '/Users/yasuhisa.yoshida/.claude/projects/*/*.jsonl',
    format='newline_delimited',
    ignore_errors=true,
    union_by_name=true
)
WHERE type = 'user'
    AND message.content IS NOT NULL
    AND message.content::VARCHAR NOT LIKE '%<command-name>%'
    AND message.content::VARCHAR NOT LIKE '%Caveat:%'
    AND message.content::VARCHAR NOT LIKE '%<local-command-stdout>%'
    AND message.content::VARCHAR NOT LIKE '%[Request interrupted%';
```

## スキーマ情報の重要性とログ分析の活用

### スキーマ理解の重要性

具体的なSQLとスキーマ情報を組み合わせることで、Claude Codeが実際のプロンプトを解釈して分析することが容易になります。

### Claude Code会話ログの詳細スキーマ

筆者がClaude Code自体に分析させて作成した完全なスキーマ定義：

**基本構造**:

- **type**: メッセージの送信者タイプ（user/assistant）
- **sessionId**: セッションの一意識別子
- **timestamp**: ISO 8601形式のタイムスタンプ
- **cwd**: 現在の作業ディレクトリ（プロジェクト識別に使用）
- **message**: 実際のメッセージ内容とメタデータ

**ユーザーメッセージの構造**:

- 73%: ツール実行結果（`tool_result`タイプ）
- 20%: 直接入力文字列
- 3%: 構造化テキスト（`text`タイプ）
- 4%: その他

**アシスタントメッセージの構造**:

- **content**: 常に配列形式
- **stop_reason**: 応答停止理由（tool_use: 84.94%, end_turn: 13.34%）
- **usage**: トークン使用量情報（コスト計算に重要）
- **model**: 使用モデル（claude-sonnet-4-20250514が主要）

## 実践的な改善活用方法

### 典型的なパターンの抽出

- **よく使うプロンプトの特定**: 頻出する表現やパターンを分析
- **エラーパターンの分析**: 失敗した処理の共通点を特定
- **英語プロンプトの改善**: 「この英語はこのように言った方がよい」という振り返り

### 具体的な改善例

1. **プロンプトの効率化**: 実際によく使う表現の学習
2. **エラー傾向の把握**: 繰り返し発生する問題の特定
3. **作業時間の分析**: セッション時間の計算とパフォーマンス分析

## ログの長期保存設定

長期的な分析を行いたい場合は、Claude Codeの設定ファイルで保存期間を延長できます：

**設定方法**:

- ファイル: `~/.claude/settings.json`
- 設定項目: `cleanupPeriodDays`の値を調整
- 推奨値: 3年分（約1095日）

**容量の考慮**:

- 予想容量: 数ギガバイト程度
- 分析価値がディスク容量のコストを上回る

## まとめ

Claude Codeの会話ログ分析は、単なるデータの可視化にとどまらず、**自分の仕事スタイルを客観的に改善する**ための強力なツールです。

**主要な効果**:

1. **定量的な振り返り**: 主観的な判断ではなく、データに基づく改善
2. **効率的な学習**: プロンプト用英語など、実用的なスキル向上
3. **継続的改善**: スキーマ情報とSQLの組み合わせによる精度向上

データエンジニアの視点から、このようなスキーマ情報や具体的な分析SQLを活用し、今後もClaude Codeとの仕事の仕方を改善していく予定です。

---

*参考文献*:

- [Claude Code ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/overview)
- [DuckDBを使ったデータ処理の過去記事](https://www.yasuhisay.info/entry/2024/06/19/095156)
