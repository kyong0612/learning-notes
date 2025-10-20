---
title: "iPhoneだけでiOSアプリ開発するワークフロー"
source: "https://zenn.dev/oikon/articles/dev-from-mobile"
author:
  - "Oikon"
published: 2025-10-18
created: 2025-10-20
description: |
  iPhone単体でiOSアプリ開発を行うための完全なワークフローを紹介。Claude Code GitHub Actions、Codex Cloud、CodeRabbit、Xcode Cloud、TestFlightを組み合わせて、PRの作成からビルド、配信まで完全自動化する方法を解説。
tags:
  - iOS開発
  - モバイル開発
  - AIツール
  - Claude Code
  - Codex
  - CodeRabbit
  - Xcode Cloud
  - TestFlight
  - CI/CD
  - GitHub Actions
---

## 概要

著者がClaude Code Meetup Tokyoで登壇した際に、iPhone単体でiOSアプリ開発を行うワークフローが反響を呼んだことから、その手法を詳細に解説した記事。モバイルアプリ開発歴1ヶ月未満の著者が、AIツールとクラウドサービスを組み合わせて実現した開発フローを紹介。

## 使用したツール・サービス

### 必須ツール

- **GitHubモバイル版**：PR作成やコードレビューの起点
- **Claude Code GitHub Actions**：GitHub上でClaudeを起動してコード変更を作成
- **Codex Cloud**：OpenAI CodexのCloud機能でPR作成が可能
- **Xcode Cloud**：自動ビルドとCI/CD環境
- **TestFlight**：ビルド済みアプリの配信とテスト

### オプション

- **CodeRabbit**：自動コードレビューAI（著者が最も愛用）

**重要な補足**：Claude Code GitHub ActionsとCodex Cloudは片方だけでも実現可能。著者は複数のAIエージェントに相互フィードバックさせるアプローチを好むため、両方を採用している。

## ワークフロー全体像

![ワークフロー図](https://res.cloudinary.com/zenn/image/fetch/s--tMCDzHdK--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/3877549b6a895ccbf4344145.png%3Fsha%3Deab728ad3382b3d94404b8c5a5af117884a71f88)

開発フローは5つのステップで構成：

1. **Create PR**（プルリクの作成）
2. **Review feedback**（レビュー）
3. **Provide fix**（変更）
4. **Build**（ビルド）
5. **Distribute**（配信）

## Step 1. Create PR - プルリクエストの作成

### 方法1：Claude Code GitHub Actions

**初期設定**：

- Claude Codeで`install-github-app`を実行してGitHubと連携

**使用方法**：

1. GitHub上でIssueを作成
2. Descriptionに変更計画を記載
3. `@claude`をメンションして変更を依頼
4. Claudeが自動でブランチ作成
5. タスク完了後、ボタン一つでPR作成

![Claude GitHub Actions](https://res.cloudinary.com/zenn/image/fetch/s--zeMh3Pp7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/cd4ac8941dec9d5a727af1f4.png%3Fsha%3Dada4b2a86fb570c3677ec9e9b64b85e5297563fa)

### 方法2：Codex Cloud

**初期設定**：

- Web版でGitHub連携を設定
- Codexにリポジトリへの権限を付与

**使用方法**：

1. ChatGPTモバイルアプリからCodex Cloudを起動
2. サンドボックス化されたクラウドコンテナでタスク実行
3. 一つのタスクに対して最大4つの並列変更が可能
4. そのうちの一つをGitHub PRとして作成

![Codex Cloud](https://res.cloudinary.com/zenn/image/fetch/s--27xKvovK--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/d817b22842f1d8eb980a0857.png%3Fsha%3D7d3b1bd7ffb2aa7a89f21b837b6e7dc1bf2c0d2e)

**著者の評価**：

- **実装品質**：Codex Cloudの方が良いことが多い
- **操作性**：Claude Code GitHub Actionsは`@`メンションで簡単にやり取り可能

## Step 2. Review feedback - コードレビュー

### レビューツールの選択

3つのAIツールすべてが自動レビュー機能を提供：

- CodeRabbit
- Claude Code
- Codex

**推奨アプローチ**：

- **ファーストレビュー**：CodeRabbitに一任（最も使いやすい）
- Claude CodeとCodexは初期設定で自動レビューを有効化可能

![CodeRabbit](https://res.cloudinary.com/zenn/image/fetch/s--PA6XLlQE--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/0a4bcc63d045eac36ea90356.png%3Fsha%3D40127b71e55addb3aeb9930b746177e2efdd00f1)

**重要な注意点**：3つのAIエージェント全てを同時にレビューに使うと、大量のレビュー結果でPRが混乱するため推奨しない。

## Step 3. Provide fix - 修正の提供

**ワークフロー**：

1. CodeRabbitのレビュー結果を人間が確認
2. レビュー漏れがあれば`@claude`や`@codex`で追加レビューを依頼
3. 妥当な修正内容を判断
4. `@claude`または`@codex`に修正を依頼

**注意点**：ClaudeやCodexは別の変更用Branchを切って変更を作成する

![Codex Fix](https://res.cloudinary.com/zenn/image/fetch/s--B7AyuCQ4--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/ea73cb778638634919b36dd4.png%3Fsha%3D2186aca6fe0413b898a06445c474bce6c1ac932d)

このようにPR内でAIとやり取りしながら、変更内容をブラッシュアップしていく。

## Step 4. Build - 自動ビルド

### モバイル開発の課題

モバイル端末での開発における最大のネック：**変更が正しいか手元で確認することが難しい**

### Xcode Cloudによる解決

**機能**：

- PRの変更に対してワークフローを設定
- 自動ビルドの実行が可能

**設定方法**：

- App Store ConnectのUI上でワークフロー設定
- PRに関連する開始条件（トリガー）を設定

![Xcode Cloud](https://res.cloudinary.com/zenn/image/fetch/s--VoaLcYYH--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/37dd3ff92a87a1436fb73b1b.png%3Fsha%3De07f9d61f410aefbc1d0949bc986702a90849ad2)

**利用可能なトリガー**：

- ブランチの変更
- プルリクエストの変更
- タグの変更
- 手動開始

![App Store Connect](https://res.cloudinary.com/zenn/image/fetch/s--El1XzUkw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/b1aeb7cebe881d463ba3bc5d.png%3Fsha%3D58a7c71f2125f1cab5b6737dfc15aa94446aec35)

**メリット**：

- PR上の変更だけで自動ビルドを実行
- AIツールが作成した変更の正確性を確認可能
- ビルド失敗時はログをPRに貼り付けてフィードバック可能

## Step 5. Distribute - TestFlightによる配信

### 自動配信の設定

Xcode Cloudのワークフロー設定で、**ビルド成功後に自動的にTestFlightへアップロード**するように設定可能。これによりビルドから実機確認のためのアプリ配信まで完全自動化。

![TestFlight](https://res.cloudinary.com/zenn/image/fetch/s--tqskj7hc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/db85938f01d922dd47f7731a.png%3Fsha%3D86ab41b1714ae0dd1eb66687c953965fe27e0010)

### TestFlightでの確認手順

1. iPhoneでTestFlightアプリを開く（AppStoreからダウンロード可能）
2. 新しいビルドが利用可能になっている
3. インストールして動作確認

### フィードバックサイクル

**意図しない変更があった場合**：

- スクリーンショットを撮影
- PR上にフィードバック
- ClaudeやCodexが適切な修正を作成

このサイクルを繰り返すことで、**外出中でもiPhoneから開発が可能**。

**推奨事項**：念の為、ローカルにPullして最終確認してからマージすることを推奨。

### コスト面の考慮

**Xcode Cloudの無料枠**：

- 1ヶ月あたり25時間分が無料
- 個人レベル + 適切なビルドトリガー設定で十分対応可能

![Free Plan](https://res.cloudinary.com/zenn/image/fetch/s--QN0eFkac--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/63f89df5f88406d6fad53475.png%3Fsha%3Db78624325710b02a03ed66ca4fa06b2873624976)

## まとめ

**本記事で紹介したワークフロー**：

1. **Create PR**（Claude Code / Codex）
2. **Review feedback**（CodeRabbit / Claude Code / Codex）
3. **Provide fix**（@claude / @codex）
4. **Build**（Xcode Cloud）
5. **Distribute**（TestFlight）

**実現できること**：

- iPhoneだけで軽微な開発・修正作業が可能
- PRの作成からビルド、配信まで完全自動化

**制限事項**：

- 大きい変更は人間でのレビューが困難
- Claude・CodexのRemote実装力に限界あり
- タスクのサイズを適切に調整することが重要

**キーポイント**：GitHubとTestFlightの配信を組み合わせることで、iPhone単体での開発フローが実現可能。

## 参考文献

- [Claude Code GitHub Actions公式ドキュメント](https://docs.claude.com/ja/docs/claude-code/github-actions)
- [Codex Cloud](https://chatgpt.com/codex)
- [CodeRabbit](https://www.coderabbit.ai/)
- [Xcode Cloud公式サイト](https://developer.apple.com/jp/xcode-cloud/)
- [Xcode Cloud設定参考記事](https://future-architect.github.io/articles/20250609a/)
- [TestFlight設定参考記事](https://qiita.com/spc_knakano/items/b7dff01cdb4b111eae04)
