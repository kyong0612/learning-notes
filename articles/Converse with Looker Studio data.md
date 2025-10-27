---
title: "Converse with Looker Studio data"
source: "https://docs.cloud.google.com/looker/docs/studio/conversational-analytics-looker-studio-data"
author:
  - "Google Cloud"
published: 2025-10-24
created: 2025-10-27
description: "Looker StudioのConversational Analytics機能を使用してデータソースと自然言語で対話し、質問をして洞察を得る方法についてのガイド。BigQueryやLooker ExploreなどのデータソースをAIで分析できるプレビュー機能です。"
tags:
  - "Looker Studio"
  - "Conversational Analytics"
  - "BigQuery"
  - "Gemini"
  - "AI"
  - "Data Visualization"
  - "Google Cloud"
  - "Data Analytics"
---

## 概要

**プレビュー機能**: このドキュメントは、Gemini for Google Cloudを活用したLooker StudioのConversational Analytics機能について説明しています。この機能により、自然言語を使用してデータソースと対話し、質問をして洞察を得ることができます。

**重要な注意事項**:

- この製品は「Pre-GA Offerings Terms」の対象で、現状のまま提供され、サポートが限定される可能性があります
- 初期段階の技術として、Geminiは事実として不正確な出力を生成する可能性があるため、すべての出力を検証することが推奨されています

## Conversational Analyticsへのアクセス方法

Looker StudioからConversational Analyticsにアクセスする方法は以下の3つです：

1. **直接アクセス**: [Conversational Analytics](https://lookerstudio.google.com/conversation)に直接移動
2. **ナビゲーションパネル**: Looker Studioのナビゲーションパネルから「Conversational Analytics」を選択
3. **作成メニュー**: Sandboxワークスペース内で、「Create」メニューから「Conversation」を選択

**注意**: データエージェントが作成されている場合は、「Chat with your data」ページの「Data sources」タブから機能にアクセスします。

## 会話の開始

### 新しい会話を作成する手順

1. Conversational Analytics内で「+ Create conversation」をクリック
2. 調査したいデータソースまたは使用したいデータエージェントを選択：
   - **データソース**: 既存のデータソースを選択するか、「Connect to data」で新規作成
   - **データエージェント**: 既存のエージェントを選択するか、「+ Create agent」で新規作成
3. 質問を入力してEnter（またはReturn）キーを押して会話を開始

作成した会話は「Recent」セクションから再度アクセスできます。

## 質問の仕方

### データソースへの質問

**注意**: Conversational AnalyticsはLookerコンテンツのProduction Modeを使用してクエリを実行します。

会話を作成後、「Ask a question」フィールドにデータに関する質問を入力できます。

**質問の特徴**:

- 特定のフォーマットや構文は不要
- 選択したデータソースに関連する内容である必要がある
- Conversational Analyticsが質問を言い換えることがある
  - 例: 「What is the mean of user ages?」→「What is the average user age?」

**文脈の理解**:

- 以前の質問と回答を考慮に入れる
- 結果をさらに絞り込んだり、可視化タイプを変更したりできる
- **制限**: 他の会話の内容は参照できず、現在アクティブな会話のみが対象

#### Lookerデータソースとの対話

Looker Exploreに接続した会話では、以下の機能が利用可能：

**Dataパネルの機能**:

- **View fields**: 新しいブラウザウィンドウでLookerのExploreを表示
- **New conversation**: 現在のLooker Exploreを使用して新しい会話を開始

**Exploreで開く**: クエリ結果をLookerインスタンス内のExploreとして開くには、「Open in Explore」をクリック

#### BigQueryデータとの対話

BigQueryデータソースに接続後、BigQueryデータについて質問できます。

**Dataパネルの機能**:

- **View fields**: 新しいブラウザタブでBigQueryのテーブルを表示
- **New conversation**: 現在のBigQueryデータを使用して新しい会話を開始

### 会話内でのクエリ管理

#### クエリレスポンスを停止

実行中のクエリを停止するには、「Stop response」をクリックします。クエリが停止され、「The query was cancelled.」というメッセージが表示されます。

#### 最新の質問を削除

最新の質問とその回答を削除する手順：

1. 最新の質問にカーソルを合わせ、「Delete message」をクリック
2. 確認ダイアログで「Delete」をクリックして永久削除

## クエリ結果と計算の理解

質問に対する回答には、可視化、データテーブル、その他の詳細が含まれる場合があります。

### 計算方法の確認

回答や可視化がどのように作成されたかを確認するには、クエリ結果内の「How was this calculated?」をクリックします。

表示されるタブ：

1. **Code**: 結果を生成するために実行されたSQLクエリを表示
   - BigQueryに接続している場合、生成されたBigQuery SQLが表示される
   - **Code Interpreter**（Advanced analytics）が有効な場合、追加のPythonコードも表示される

2. **Text**: Conversational Analyticsが回答に至った手順の平文での説明
   - 使用された生のフィールド名
   - 実行された計算
   - 適用されたフィルター
   - ソート順序
   - その他の詳細

### 追加のインサイトを取得

追加のデータインサイトが利用可能な場合、「Insights」ボタンが表示されます。

**Insightsの特徴**:

- クリックすると、クエリに関する追加情報が表示される
- プロンプトによって返されたデータのみを分析（追加のクエリは実行しない）
- フォローアップ質問のアイデア源として有効

**Insightsの例**（プロンプト: "How many users are in each state?"）:

- データ量の多い/少ない地域の一般的な要約
  - 「カリフォルニア、テキサス、オハイオはデータに基づく重要な州です」
  - 「英国や中国の特定地域（安徽省、広東省）で重要な活動が見られます」
  - 「三重、秋田、岩手などの一部の州では存在感が最小限です」
- データセットの変動性の評価
  - 「データは異なる場所での様々な運用規模を示しています」

## 会話の管理

### 会話の名前変更

Conversational Analyticsは最初の質問と回答に基づいて会話タイトルを自動生成します。

**名前を変更する手順**:

1. 会話ページの上部にあるタイトルをクリック
2. 新しい会話名を入力
3. ページの他の場所をクリックするか、Enter（またはReturn）キーを押して保存

### 会話の削除

会話をゴミ箱に移動するには、会話を開いて「Move to trash」をクリックします。

**注意**: ゴミ箱に30日以上残っている会話は自動的に削除されます。

### 会話の復元または完全削除

ゴミ箱から会話を復元または完全削除する手順：

1. Conversational Analytics内の左ナビゲーションパネルで「Trash」を選択
2. 「Trash」セクションで、復元または削除したい会話の名前をクリック
3. 確認ダイアログで以下のいずれかを選択：
   - **Cancel**: 操作をキャンセル
   - **Restore**: 会話を復元（「Recent」セクションからアクセス可能になる）
   - **Delete forever**: 会話を完全削除

### 会話の検索

タイトルで特定の会話を検索する手順：

1. 「Search Conversational Analytics」検索バーに検索クエリを入力
2. 入力するにつれて、タイトルが一致する会話のリストが表示される
3. 検索結果から会話を選択して開く

## 既知の制限事項

### 可視化の制限

Conversational AnalyticsはVega-liteを使用してチャートを生成します。

**完全サポートされるVegaチャートタイプ**:

- 折れ線グラフ（1つ以上のシリーズ）
- エリアチャート
- 棒グラフ（水平、垂直、積み上げ）
- 散布図（1つ以上のグループ）
- 円グラフ

**サポートされているが予期しない動作が発生する可能性のあるタイプ**:

- マップ
- ヒートマップ
- ツールチップ付きチャート

Vegaカタログ外のチャートタイプはサポートされていません。

### データソースの制限

**Lookerデータソースの場合**:

- LookMLの`parameter`パラメータで定義されたフィルター専用の値を設定できない
- 1クエリあたり最大5,000行まで返せる

**BigQueryデータソースの場合**:

- 一度に1つのBigQueryテーブルとのみ対話可能
- 異なるテーブルと対話するには新しい会話を開始する必要がある
- BigQueryの「Flexible Column Names」機能はサポートされていない

**その他の制限**:

- レポート内でフィールド編集が無効になっているデータソースでは正常に動作しない（計算フィールドの作成が妨げられるため）

### 質問の制限

**サポートされる質問タイプ**（単一の可視化で回答可能）:

- 時間経過に伴うメトリクスのトレンド
- ディメンション別のメトリクスの内訳または分布
- 1つ以上のディメンションのユニーク値
- 単一のメトリクス値
- メトリクス別の上位ディメンション値

**現在サポートされていない複雑な可視化が必要な質問**:

- 予測とフォーキャスティング
- 相関や異常検出を含む高度な統計分析

**注意**: Code Interpreterを有効にすると、フォーキャスティングなどのより高度な質問に回答できるようになります。

## サンプル会話

以下は、Conversational Analyticsとの自然な対話の例です。

**ユーザーの質問**: 「Can you plot monthly sales of hot drinks versus smoothies for 2023, and highlight the top selling month for each type of drink?」

**Conversational Analyticsの回答**: 2023年のホットドリンクとスムージーの月次売上を示す折れ線グラフを生成し、両カテゴリーで最も売上が高かった7月をハイライト表示します。

**この例が示すこと**:

- 自然言語の要求を解釈（複数パートの質問に対応）
- 一般的な用語（「sales」「hot drinks」）を使用可能
- 正確なデータベースフィールド名（`Total monthly drink sales`など）の指定不要
- フィルター条件（`type of beverage = hot`など）の定義不要
- 主要な発見の説明と推論の提供
- テキストとチャートを含む回答の生成
- より深い分析を促すフォローアップ質問の提案

## 関連リソース

- **Conversational Analytics overview**: セットアップ要件、既知の制限事項、サポートされる質問タイプなどの情報を含むランディングページ
- **Create and converse with data agents**: データエージェントを使用して、データに固有のコンテキストと指示を提供することで、より正確で文脈に関連した応答を生成
- **Enable advanced analytics with the Code Interpreter**: Code Interpreterは自然言語の質問をPythonコードに変換して実行。標準的なSQLベースのクエリと比較して、より複雑な分析と可視化が可能

## データガバナンスと責任あるAI

**データ使用について**: Gemini for Google Cloudがデータをどのように使用するかについては、専用のドキュメントを参照してください。

**重要な注意**: 初期段階の技術として、Gemini for Google Cloud製品は妥当に見えるが事実として不正確な出力を生成する可能性があります。使用前にすべての出力を検証することが推奨されています。
