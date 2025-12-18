---
title: "Pricing changes for GitHub Actions"
source: "https://resources.github.com/actions/2026-pricing-changes-for-github-actions/"
author:
  - "[[GitHub]]"
published: 2025-12-15
created: 2025-12-18
description: |
  GitHub Actionsの価格改定発表。セルフホステッドランナーへの課金変更は延期され、
  ホステッドランナーの価格は2026年1月1日から最大39%引き下げ。新たに$0.002/分の
  クラウドプラットフォーム料金を導入し、セルフホステッドランナー向け投資も強化。
tags:
  - "GitHub Actions"
  - "CI/CD"
  - "Pricing"
  - "Platform"
  - "Self-hosted runners"
  - "DevOps"
---

## TL;DR（重要な更新）

> **延期発表**: セルフホステッドGitHub Actionsへの課金変更は延期され、アプローチの再評価が行われる。
> **継続される変更**: ホステッドランナーの価格は2026年1月1日から最大39%引き下げ。

GitHubはユーザーからのフィードバックを受け、セルフホステッドランナーへの課金について再検討することを決定。[フィードバック収集のためのディスカッション](https://github.com/orgs/community/discussions/182186)も開設された。

---

## 背景

### GitHub Actionsの成長と課題

- **2018年**: GitHub Actionsリリース
- **2024年初頭**: 1日約2,300万ジョブを処理するも、既存アーキテクチャでは成長曲線をサポートできない状態に
- **現在**: コアバックエンドサービスを再構築し、1日7,100万ジョブを処理（3倍以上に拡大）
- 個々のエンタープライズは以前の7倍のジョブ/分を開始可能に

### 価格改定の理由

従来、セルフホステッドランナーのユーザーはGitHub Actionsのインフラとサービスの多くを無償で利用していた。これらのサービス維持・進化のコストは、GitHubホステッドランナーの価格で補填されていた。今回の改定で、**使用量と提供価値に沿った価格設定**に移行。

---

## 主な変更点

### 1. GitHubホステッドランナーの価格引き下げ

| 項目 | 詳細 |
|------|------|
| **価格削減率** | 最大39%引き下げ |
| **適用日** | 2026年1月1日 |
| **削減の仕組み** | 全ランナーサイズで約40%の価格削減 + 新規$0.002/分のプラットフォーム料金（ホステッドランナーには既に含まれる） |
| **影響** | 大きいランナーほど相対的な削減幅が大きい |

**無料のまま維持されるもの:**

- パブリックリポジトリでの標準GitHubホステッド/セルフホステッドランナー使用
- GitHub Enterprise Serverの価格に影響なし

### 2. GitHub Actionsクラウドプラットフォーム料金の導入

| 項目 | 詳細 |
|------|------|
| **料金** | $0.002/分 |
| **対象** | 全てのActionsワークフロー（ホステッド・セルフホステッド両方） |
| **セルフホステッド適用日** | 2026年3月1日 |
| **除外** | パブリックリポジトリ、GitHub Enterprise Server |

### 3. セルフホステッド体験への投資強化

今後12ヶ月間で以下の機能を提供予定：

#### GitHub Scale Set Client

- Kubernetesの複雑さなしにカスタムオートスケーリングソリューションを構築できる軽量Go SDK
- コンテナ、VM、クラウドインスタンス、ベアメタルなど既存インフラとシームレスに統合
- [ロードマップ](https://github.com/github/roadmap/issues/1192)

#### Multi-label support

- GitHubホステッド大規模ランナーとセルフホステッドランナー（ARC、Scale Set Client含む）向けにマルチラベル機能を再導入
- [ロードマップ](https://github.com/github/roadmap/issues/1195)

#### Actions Runner Controller 0.14.0

- Helmチャートの改善、ロギング強化、メトリクス更新
- レガシーARCの非推奨化と明確な移行パスを提供
- [ロードマップ](https://github.com/github/roadmap/issues/1194)

#### Actions Data Stream

- ワークフロー・ジョブイベントデータのリアルタイムフィード
- 監視・分析システムへの統合でコンプライアンスと運用インサイトを提供
- [ロードマップ](https://github.com/github/roadmap/issues/1193)

---

## 影響を受けるユーザー

### 全体への影響

| カテゴリ | 割合 | 影響 |
|---------|------|------|
| 影響なし | 96% | 請求額に変更なし |
| 価格減少 | 約3.4% | Actions請求額が減少 |
| 価格増加 | 約0.6% | 中央値で約$13増加 |

### 個人開発者への影響

- Free/Proプランユーザーの**0.09%のみ**が価格増加
- 増加の中央値は**月額$2未満**
- 約2.8%のユーザーは月額コスト減少

### 影響を受けるジョブ実行シナリオ

- プライベートリポジトリで標準GitHubホステッド/セルフホステッドランナーを使用するジョブ
- 大規模GitHubホステッドランナーで実行されるジョブ

---

## 重要な日程

| 日付 | 変更内容 |
|------|----------|
| **2026年1月1日** | GitHubホステッドランナーの価格引き下げ適用 |
| **2026年3月1日** | セルフホステッドランナーへの新料金適用（延期により再検討中） |

---

## FAQ（主要な質問と回答）

### 自分のハードウェアを使用しているのに課金されるのはなぜ？

従来、セルフホステッドランナー顧客はGitHub Actionsのインフラを無償で利用していた。今回の改定で使用量と価値に沿った価格設定に移行するが、**セルフホステッドへの課金は延期**されアプローチを再評価中。

### 無料使用枠はどうなる？

2026年3月1日以降、セルフホステッドランナーも無料使用枠に含まれ、Linux/Windows/macOS標準ランナーと同様に消費される予定（延期により変更の可能性あり）。

### GitHub Enterprise Serverへの影響は？

この価格変更は**GitHub Enterprise Serverには影響しない**。

### Azureを通じた請求は可能？

はい、有効なAzureサブスクリプションIDがGitHub Enterprise/Organizationに関連付けられていれば可能。

---

## コスト見積もりツール

- [Actions価格計算機](https://github.com/pricing/calculator#actions) - 将来のコスト見積もり
- [詳細使用レポート](https://docs.github.com/billing/how-tos/products/view-productlicense-use) - 現在・過去の使用状況確認
- [コスト計算Pythonスクリプト](https://docs.github.com/billing/tutorials/estimate-actions-costs) - 使用レポートから予想コストを計算

---

## 参考リンク

- [GitHub Actions runner pricing documentation](https://docs.github.com/billing/reference/actions-runner-pricing)
- [GitHub public roadmap](https://github.com/orgs/github/projects/4247)
- [フィードバック用ディスカッション](https://github.com/orgs/community/discussions/182186)
- [SHR to GHR migration guide](http://docs.github.com/actions/tutorials/migrate-to-github-runners)

---

## 結論

今回の価格改定は、CI/CDの高速化・信頼性向上を目指したもの。セルフホステッドランナーへの課金はユーザーフィードバックを受けて延期されたが、**ホステッドランナーの最大39%価格引き下げは2026年1月1日に実施予定**。GitHubはActions基盤への継続投資を通じて、エンタープライズから個人開発者まで幅広いニーズに対応していく方針。
