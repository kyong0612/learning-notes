---
title: "OpenAI DevDay 2025 発表まとめ"
source: "https://zenn.dev/schroneko/articles/openai-devday-2025"
author:
  - "ぬこぬこ (schroneko)"
published: 2025-10-07
created: 2025-10-08
description: |
  OpenAI DevDay 2025（サンフランシスコ開催）での主要発表をまとめた記事。ChatGPT Apps SDK、エージェント構築ツールのAgentKit、Codexの正式リリース、Sora 2のAPI対応、GPT-5 Pro APIなどが発表された。
tags:
  - "OpenAI"
  - "DevDay"
  - "Apps SDK"
  - "AgentKit"
  - "Codex"
  - "Sora"
  - "GPT-5"
  - "API"
---

## 概要

2025年10月7日にサンフランシスコで開催されたOpenAI DevDay 2025の主要な発表内容をまとめた記事。サムアルトマンCEOのキーノートと共に、開発者向けの新機能・ツールが多数発表された。

### 主要発表

- **ChatGPT Apps SDK**: ChatGPT上で動作するアプリの開発SDK（MCPベース）
- **AgentKit**: AIエージェントワークフロー構築ツール群
- **Codex正式リリース**: Slack統合やSDK提供
- **GPT-5 Pro API**: Pro版モデルのAPI提供開始
- **Sora 2 API**: 動画生成モデルのAPI対応
- **画像・音声モデルの割引**: gpt-image-1-mini（80%オフ）、gpt-realtime-mini（70%オフ）

## Apps SDK

**リリース情報**: [公式発表](https://openai.com/index/introducing-apps-in-chatgpt/)

ChatGPT内で動作するアプリケーション機能。8億人を超えるChatGPTユーザーに直接リーチできる開発者向けプラットフォーム。

### 主な特徴

- **MCPベースのSDK**: Model Context Protocol（MCP）に基づいて開発
- **収益化対応予定**: Agentic Commerce Protocolを用いた収益化を予定
- **対象ユーザー**: Free、Go、Plus、Proプラン（将来的にBusiness、Enterprise、Eduプランにも対応予定）
- **地域制限**: EU除く、ログイン済みアカウントで利用可能

### 初期パートナー企業

- Booking.com
- Canva
- Coursera
- Figma
- Expedia
- Spotify
- Zillow

### 提供時期

- **現在**: プレビュー版公開中
- **年末**: アプリ審査・受付開始予定、収益化の詳細発表

### 開発者リソース

- [Apps SDK公式ドキュメント](https://developers.openai.com/apps-sdk): デザインガイドライン、開発ガイド、デプロイ方法、プライバシー、トラブルシューティングを提供

## AgentKit

**概要**: エージェンティックワークフローの構築、デプロイ、最適化のための包括的ツールセット

### 4つの主要コンポーネント

1. **ChatKit**: チャットUIをカスタマイズして埋め込むツール
   - [ChatKit Studio](https://chatkit.studio)
   - [ChatKit実例](https://chatkit.world)

2. **Agent Builder**: WYSIWYGのワークフローエディター
   - [Agent Builder](https://platform.openai.com/agent-builder)
   - [編集画面](https://platform.openai.com/agent-builder/edit)
   - [公式ドキュメント](https://platform.openai.com/docs/guides/agents/agent-builder)

3. **Guardrails**: 安全性のための入出力フィルタリング機能

4. **Evals**: データセット、スコアリング、プロンプト最適化のための評価機能

## Codex正式リリース

**リリース情報**: [公式発表](https://openai.com/index/codex-now-generally-available)

プレビュー期間を経て、Codexが正式にリリース。以下の3つの新機能を追加。

### 新機能

1. **Slack統合**
   - チャンネルやスレッドから直接タスクを開始可能
   - チーム内でのタスク管理を効率化

2. **Codex SDK**
   - GPT-5-Codexを用いたAIエージェントをワークフローやアプリに組み込み可能
   - [公式ドキュメント](https://developers.openai.com/codex/sdk)

3. **管理ツール**
   - モニタリング、ダッシュボードなどの統合管理機能

### インストール・使用方法

**npmでインストール**:

```bash
npm install @openai/codex-sdk
```

**CLIコマンド例**:

```bash
codex exec "未完了のTODOをすべて特定し、各TODOに対して .plans/ ディレクトリ内に詳細な実装計画を記載したMarkdownファイルを作成してください。"
```

### 課金開始

- **開始日**: 2025年10月20日より使用量がカウント開始

## GPT-5 Pro API

**提供開始**: ChatGPT Pro プラン（月額30,000円）限定だったGPT-5 ProがAPI経由で利用可能に

### 料金体系

- **入力**: 100万トークンあたり $15
- **出力**: 100万トークンあたり $120

### モデル仕様

- **Context Window**: 400,000トークン
- **最大出力トークン**: 272,000トークン
- **対応API**: Responses APIのみ

[公式ドキュメント](https://platform.openai.com/docs/models/gpt-5-pro)

## GPT-5の高速化

**Priority Processing**: GPT-5へのAPIリクエストを40%高速化する新機能

### 使用方法

`service_tier` パラメータを `"priority"` に設定

### 適用シーン

- **推奨**: 定常的にトラフィックをさばく必要がある場合
- **非推奨**: データ処理や評価などの不規則なトラフィック

[公式ドキュメント](https://platform.openai.com/docs/guides/priority-processing)

## Sora 2のAPI対応

**重要発表**: 動画生成モデルSora 2とSora 2 ProがAPI経由で利用可能に

### 提供モデル

1. **sora-2**: 高速な動画生成、実験・プロトタイピング向け
2. **sora-2-pro**: ハイクオリティ、本番環境向け

### API仕様

**基本エンドポイント**:

- `POST /videos`: ジョブ開始
- `GET /videos/{video_id}`: ステータスポーリング
- `GET /videos/{video_id}/content`: 動画（MP4）ダウンロード
- `GET /videos`: ライブラリ管理
- `DELETE /videos/{video_id}`: 削除

**通知方法**: ステータスポーリングまたはWebhook

### パラメータ

- **model**: モデル名（sora-2 / sora-2-pro）
- **size**: 動画サイズ
  - sora-2: 1280x720 / 720x1280
  - sora-2-pro: 1280x720 / 720x1280 / 1024x1792 / 1792x1024
- **seconds**: 動画の長さ（4 / 8 / 12秒、デフォルトは4秒）
- **input_reference**: 画像を初期フレームとして指定可能
- **remix_video_id**: 既存動画の部分的修正

### 制限事項

- 18歳未満向けコンテンツのみ対応
- 版権キャラクターや実在する人物の生成は不可

### プロンプティングガイド

[Sora 2プロンプティングガイド](https://cookbook.openai.com/examples/sora/sora2_prompting_guide)の主要なポイント:

- プロンプトは具体的に記述しつつ、創造性の余地も残す
- 同じプロンプトでも毎回異なる結果が生成されるため、繰り返し生成を試す
- 短い動画ほど指示への追従性が高い
- スタイル指定はプロンプトの先頭に配置

[公式ドキュメント](https://platform.openai.com/docs/guides/video-generation)

## 画像・音声モデルの割引

軽量かつ高性能なモデルを大幅割引で提供:

- **gpt-image-1-mini**: 80%オフ（フルサイズモデルと同等の性能）
- **gpt-realtime-mini**: 70%オフ

## 評価フライホイール

OpenAIクックブックに新しいガイドが追加: [Building Resilient Prompts Using an Evaluation Flywheel](https://cookbook.openai.com/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

### レジリエンスとは

あらゆる入力に対して質の高いレスポンスを返す能力

### 評価フライホイールの3段階

1. **分析段階**
   - オープンコーディングで失敗事例にラベル付け
   - アクシャルコーディングで分類

2. **測定段階**
   - 自動スコアリングの仕組み（グレーダー）を構築
   - 性能を定量評価

3. **改善段階**
   - プロンプト最適化ツールでプロンプトを改良

### プロセスの特徴

反復的なプロセスを通じてプロンプトの品質を継続的に向上させる

## 参考リンク

- [サムアルトマンCEOのキーノート](https://www.youtube.com/watch?v=hS1YqcewH0c)
- [Apps SDK紹介動画](https://x.com/OpenAIDevs/status/1975261988751351868)
- [AgentKit紹介](https://x.com/OpenAIDevs/status/1975269388195631492)
- [ChatKit動画デモ](https://www.youtube.com/watch?v=44eFf-tRiSg)

---

**注記**: この記事はDevDay開催中に執筆されており、追加情報が随時更新される可能性があります。
