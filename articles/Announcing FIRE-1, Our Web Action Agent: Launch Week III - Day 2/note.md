# Announcing FIRE-1, Our Web Action Agent: Launch Week III - Day 2

ref: <http://firecrawl.dev/blog/launch-week-iii-day-2-announcing-fire-1>

## FIRE-1発表：Webアクションエージェント (Launch Week III - Day 2)

### 概要

Firecrawlは、Launch Week IIIの2日目に、初のWebアクションエージェントである**FIRE-1**を発表しました。これは、スクレイピング体験を強化するために設計されています。

![Announcing FIRE-1, Our Web Action Agent: Launch Week III - Day 2 image](https://www.firecrawl.dev/launch-week/lw3-d2-1.webp)

### FIRE-1とは？

FIRE-1は、Firecrawlに新たなレベルのインテリジェンスをもたらすAIエージェントです。主な機能は以下の通りです。

* **インテリジェントなナビゲーションとインタラクション:** 複雑なウェブサイト構造のナビゲート、動的コンテンツとのインタラクションなど、従来のスクレイピング手法を超えた包括的なデータ抽出を可能にします。
* **アクションの実行:** ログイン、ボタンクリック、モーダルウィンドウの背後にあるデータにもアクセスできます。単なるスクレイピングではなく、「アクションを実行」して必要なデータを明らかにします。

![FIRE-1 Agent Visualization](https://www.firecrawl.dev/launch-week/lw3-d2-3.webp)

### FIRE-1の有効化方法

Scrape APIリクエストに`agent`オブジェクトを含めることでFIRE-1を有効化できます。

```json
"agent": {
  "model": "FIRE-1",
  "prompt": "Your detailed navigation instructions here."
}
```

**注意:** `prompt`フィールドは必須であり、ウェブページとのインタラクション方法をFIRE-1に正確に指示します。

### 使用例 (Scrapeエンドポイント)

以下の例は、FIRE-1を使用して製品リストをページ分割するものです。

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "url": "https://www.ycombinator.com/companies",
    "formats": ["markdown"],
    "agent": {
      "model": "FIRE-1",
      "prompt": "Search for firecrawl and go to the company page."
    }
  }'
```

このシナリオでは、FIRE-1はインテリジェントに検索フォームに入力し、ウェブサイト内をクリックして目的のページを見つけます。

### 考慮事項

* FIRE-1の使用は、タスクの複雑さやインタラクションの深さに応じて、より多くのクレジットを消費する可能性があります。
* 結果と効率を最適化するために、プロンプトがFIRE-1を明確にガイドするようにしてください。

### 今すぐFIRE-1を始めよう

* **試用:** FIRE-1をスクレイピングおよび抽出ワークフローに統合します。
* **ドキュメント:** [包括的なドキュメント](https://docs.firecrawl.dev/agents/fire-1)で詳細を確認します。
* **サポート:** [Discordコミュニティ](https://discord.gg/S7Enyh9Abh)に参加するか、[help@firecrawl.com](mailto:help@firecrawl.com)にメールします。
* **サインアップ:** [Firecrawlにサインアップ](https://firecrawl.dev/signup)して、今すぐFIRE-1を始めましょう。

### 著者について

[![Eric Ciarla image](https://www.firecrawl.dev/eric-img.jpeg) Eric Ciarla](https://x.com/ericciarla)
FirecrawlのCOOであり、マーケティングを担当。以前はMendable.aiに取り組み、Snapchat、Coinbase、MongoDBなどに売却。FordとFractaでデータサイエンティストとして勤務。VS Code内でコードを学習するためのツールSideGuide（ユーザー数5万人）を共同設立。
