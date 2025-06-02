---
title: "GitHub Copilot Spacesのご紹介：コードとコンテキストを操作する新しい方法"
source: "https://github.blog/jp/2025-05-30-introducing-copilot-spaces-a-new-way-to-work-with-code-and-context/"
author:
  - "tomokota"
published: 2025-05-30
created: 2025-06-02
description: "GitHub Copilot Spacesの早期プレビュー版を発表。プロジェクトのコンテキストを一元化し、コード、ドキュメント、仕様を統合することで、GitHub Copilotがよりスマートで関連性の高い応答を提供。チーム全体で専門知識を共有できる新機能。"
tags:
  - "GitHub Copilot"
  - "AI"
  - "開発ツール"
  - "チーム協調"
  - "コンテキスト管理"
  - "早期プレビュー"
---
# GitHub Copilot Spacesの概要

![GitHub Copilot Spacesのヒーロー画像](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/CopilotSpacesHeroImage.png?fit=1022%2C537)

GitHub Copilot Spacesは、エンジニアリングチームが抱える知識の断片化問題を解決する新機能です。重要なコンテキストがコード、ドキュメント、チームメンバーの知識に散在している現状を改善し、プロジェクトのコンテキストを一元化することで、GitHub Copilotがより的確で関連性の高い応答を提供できるようにします。

## 主要機能

### 👩‍💻 特定分野の専門家としてのCopilot

**コンテキストベースの知識構築**

- 特定のコード、ドキュメント、メモを基にCopilotの知識を構築
- システムの動作原理、設計思想、ベストプラクティスの理解が向上
- カスタム指示の追加により、スペース固有の回答調整が可能

![旅行アプリのスペース例](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/b3f2487f-6d0f-41cc-ac7a-350459e9.png?w=300&resize=300%2C194)

### ⚖️ チーム全体での専門知識共有

**組織レベルでの知識共有**

- 組織内でのスペース作成・共有が可能
- チームメンバーが専門外の知識にアクセス可能
- 開発効率の向上と学習時間の短縮を実現

### ⏲️ 自動更新による最新状態の維持

**リアルタイム同期**

- GitHubリポジトリから直接コンテキストを追加
- ファイルやリポジトリの変更時に自動更新
- コピー＆ペースト不要の効率的な管理

![リポジトリからのコンテキスト追加](https://github.blog/jp/wp-content/uploads/sites/2/2025/05/93f38909-6610-40a1-b2fe-19be2923.png?w=300&resize=300%2C194)

## 利用開始方法と料金体系

### アクセス方法

- **URL**: [github.com/copilot/spaces](http://github.com/copilot/spaces)
- **段階**: 早期プレビュー版
- **フィードバック**: [公式ディスカッション](https://github.com/orgs/community/discussions/160840)またはインラインフィードバック

### 利用要件

- **プラットフォーム**: github.com で利用可能
- **Enterprise/Business**: 組織管理者による[GitHub Copilotプレビュー機能](https://docs.github.com/ja/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization)のオプトイン必須

### 料金体系（2025年6月4日より）

**有料プラン（Pro、Pro+、Business、Enterprise）**

- プレミアムモデル使用時：1プレミアムリクエストを消費
- ベースモデル使用時：消費なし
- GitHub Copilot Chatと同一の課金モデル

**無料プラン（Copilot Free）**

- 月間50回のチャット制限にカウント
- 需要集中時にはレート制限適用の可能性

## 技術仕様とドキュメント

**詳細情報**

- [公式ドキュメント](https://docs.github.com/ja/copilot/using-github-copilot/copilot-spaces/about-organizing-and-sharing-context-with-copilot-spaces)
- [英語版Changelog](https://github.blog/changelog/2025-05-29-introducing-copilot-spaces-a-new-way-to-work-with-code-and-context/)

**関連タグ**: AI, GitHub Copilot, Release

## 関連機能

### GitHub Copilot エージェント機能

タスクやIssueをGitHub Copilotに直接割り当て、GitHub Actionsを通じてバックグラウンドで実行し、プルリクエストとして結果を提出する新機能も提供されています。

### OpenAI GPT-4.1統合

GitHub Copilot Chat、Edits、エージェントモードの新しいデフォルトモデルとしてOpenAI GPT-4.1が採用されており、より高精度な応答が期待できます。
