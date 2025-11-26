---
title: "QAとSREが統合したQualityチームの挑戦"
source: "https://zenn.dev/luup_developers/articles/sre-gr1m0h-20251125"
author:
  - "gr1m0h"
published: 2025-11-25
created: 2025-11-26
description: |
  Luup社のInfra/SREチームとQAチームが統合し、新たにQualityチームが発足。品質保証とサイト信頼性エンジニアリングを統合的に捉え、開発から運用までの全ライフサイクルで品質と信頼性を担保するアプローチを紹介。Production Readinessの自動チェック、不具合とインシデントの統合管理、CUJを軸とした機能優先度の定義とProgressive Deliveryなど、具体的な取り組みを解説。
tags:
  - "SRE"
  - "QA"
  - "DevOps"
  - "Production Readiness"
  - "インシデント管理"
  - "Progressive Delivery"
  - "CUJ"
  - "Luup"
---

## 概要

2025年7月、Luup社のInfra/SREチームとQAチームが統合し、**Qualityチーム**が発足。従来の組織サイロを超え、品質保証とサイト信頼性エンジニアリングを統合的に捉える挑戦について、SREの視点から説明している。

## 用語定義

| 用語 | 定義 |
|------|------|
| **品質（Quality）** | 機能要件が正しく実装され、ユーザーの期待を満たしている状態 |
| **信頼性（Reliability）** | システムが継続的に安定して動作し、非機能要件を満たしている状態 |
| **Production Readiness** | 本番環境にリリースするために必要な準備が整っている状態 |

---

## Qualityチームとは

### 統合前の状況

- **Infra/SREチーム**: 本番環境の安定稼働や非機能要件を担当
- **QAチーム**: 開発段階の機能要件テストや品質保証を担当

### ミッション

> Qualityチームは、Luupのプロダクト品質の理想的なレベルを主体的に定義し、その担保や継続的な向上にかかる人的・物的リソースや心理的負荷を戦略的に最適化することを目指します。開発初期の構想段階・リリース前の開発段階・運用段階に至るまで、一貫した情報の共有を行うことで、ユニットテスト・アラート設定・モニタリングといったエンジニアリング的アプローチとシステムテストなど探索的アプローチアプローチを統合し、戦略的に実行します。

### ビジョン

> Software部やプロダクト組織に関わるメンバーが、自信を持って迅速に開発でき、また問題の検知の迅速化や不具合やインシデントから学べる体制の構築によって、リリース時にも不安なくリリースできる体制を確立します。

### 現状

- 体制図上の統合に留まり、内部的にはSREチームとQAチームが分かれて活動中
- 将来的には垣根をなくし、品質と信頼性を統合的に担保するチームを目指す
- 著者はQAチームの社内インターンシップを2週間実施（リグレッションテストやテスト設計を経験）

---

## SREの視点から見たQAとSREの統合

### なぜQAとSREを統合するのか

QAとSREの統合は、以下のマトリクスで示される**「品質保証の空白」**を埋める活動：

|  | 機能要件 | 非機能要件 |
|---|:---:|:---:|
| **Dev（開発段階）** | ○（QAが担当） | △ |
| **Prod（運用段階）** | △ | ○（SREが担当） |

**課題**: 開発段階の非機能要件検証や運用段階の機能要件継続検証が不十分だった

**アプローチ**: DevOpsにおける「**Shift-Left**」と「**Shift-Right**」の統合

- **Shift-Left**: 開発初期段階での品質作り込み
- **Shift-Right**: 本番環境での継続的検証

### 統合的品質保証のアプローチ

QA領域とSRE領域のプラクティスを組み合わせ、全ライフサイクルで品質と信頼性を担保：

| 領域 | プラクティス | 説明 |
|------|-------------|------|
| QA | **アジャイルテスティング** | 開発サイクル全体での継続的テスト実行、早期問題発見と修正コスト低減 |
| QA | **ホリスティックテスティング** | 機能要件だけでなくセキュリティ、パフォーマンス、ユーザビリティ、信頼性など包括的にテスト |
| SRE | **Production Readiness** | 本番環境リリースに必要な準備状態（モニタリング、ログ設計、エラーハンドリング等）の定義 |
| SRE | **Release Engineering** | CI/CDによる安全かつ迅速なソフトウェアリリースとデプロイの実現 |

### Qualityチームが目指す3つの活動

1. **Production Readinessと自動チェックによる品質・信頼性担保**
2. **不具合とインシデントの統合管理**
3. **CUJを含む機能優先度とプログレッシブデリバリー**

---

## Qualityチームでの具体的な活動

### 1. Production Readinessと自動チェックによる品質・信頼性担保

#### チェックの自動化

- **チェック**: 定義された基準に対する検証
- **テストやレビュー**: チェックを実現するための具体的な手段

#### CI/CDパイプラインへの統合

- 自動テスト、静的解析、AI支援コードレビューにより定義された基準を満たさない場合は自動検知
- アラート状態（＝品質基準を満たさない状態）を**タスク化**
  - 対応が必要なものとして開発者・PdMが認識可能
  - PdMがビジネス的な優先度を判断
  - 対応しない判断も明示的に記録として残る

#### Production Readiness Checklistの活用

- 機能・非機能要件を定義するための内部的な指針
- 開発者には直接意識させず、Qualityチーム内で品質基準を整理する目的で使用
- **目標**: 自動化によって自然と品質基準を満たせる仕組みを作る

#### Shift-Leftの取り組み

- PRD（Product Requirements Document）やADR（Architecture Decision Record）に対する自動レビュー
- Production Readiness Checklistの観点を持ったAIによるレビュー
- 設計段階から品質・信頼性の観点を組み込み、コーディング前の段階で問題を発見

#### 現在の取り組み

- 本番環境と開発環境の差異をなくす活動に着手
- Cloud Run Functionsの最小インスタンス数を本番環境に合わせる（コスト考慮で特定時間帯のみ）
- 今後: 流量的な差異をなくす、自動テストの実施

---

### 2. 不具合とインシデントの統合管理

#### これまでの課題

- 不具合とインシデントの定義が曖昧
- それぞれのライフサイクルがバラバラで認知負荷が高い
- 分析が別々に行われ、品質の低いWeakポイントを組織横断的に把握できなかった

#### 用語の定義

| 用語 | 定義 |
|------|------|
| **不具合** | 開発環境で発生したもの |
| **インシデント** | サービス提供に支障がある、またはUXを著しく下げる問題・トラブル。何らかの対応が求められるもの（N=1でもユーザーに影響が出ているものを含む） |

![不具合とインシデントの関係](https://res.cloudinary.com/zenn/image/fetch/s--iVJ64LPc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/300d117b3a5b04e50ca61ded.png%3Fsha%3D411ff0059cad4be0ebb3d81548568d6f3d2d28ad)

#### ライフサイクルの定義

![不具合のライフサイクル](https://res.cloudinary.com/zenn/image/fetch/s--FaFmgGI_--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/7a32af4e40d0d8b204955399.png%3Fsha%3Db2223b0b92c89b22f93479d18732ae257437dcbd)

![インシデントのライフサイクル](https://res.cloudinary.com/zenn/image/fetch/s--bcTzztc5--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/00dcae0a57e39b8ca278990c.png%3Fsha%3Da9a3337b7df9f369e15b8692ac72fbf0f3dff7f8)

#### インシデントの重篤度判定基準

| 重篤度 | 基準 |
|--------|------|
| **High/Critical** | CUJ関連のインシデント |
| **Low** | hotfix不要な軽微なインシデント |
| **Info** | 個別事象もしくは影響がないもの |

#### 検知経路

1. システムアラート
2. 問い合わせ
3. 開発環境でのテスト

#### 今後の計画

- 不具合（GitHub Issue）とインシデント（Waroom）のデータをBigQueryに送信
- 社内BIツールで統合的に分析（ビジネスKPIなど他のデータと組み合わせ可能）
- 品質の低い箇所を俯瞰的に把握し、対応優先度決定のインプットとして活用

---

### 3. CUJを含む機能優先度とプログレッシブデリバリー

#### CUJ（Critical User Journey）とは

- ユーザーがサービスを利用する際の一連の行動や体験の流れ
- 例（LUUP）: アプリを開く → 車両を借りる → 目的地まで移動 → 返却
- ユーザーがサービスの価値を享受するために必須の機能群

#### 機能優先度に基づく品質保証アプローチ

| 機能の重要度 | テストアプローチ |
|-------------|-----------------|
| CUJ | 最も厳密なテスト |
| 最重要な機能 | 自動化された回帰テスト |
| 重要な機能 | 定期的な手動テスト |

#### Progressive Delivery

段階的にユーザーに機能を展開するアプローチ：

- カナリアリリース
- ブルーグリーンデプロイメント
- フィーチャーフラグ

**メリット**:

- 問題発生時の影響範囲を限定
- 問題の切り分けが容易でMTTR短縮
- ロールバックが容易でリスク最小化

#### ErrorBudgetとの関係

- ErrorBudget: サービスの信頼性と機能開発のバランスをとるための指標
- 失敗を許容する範囲を定量的に示す
- 100%の信頼性を追求するのではなく、ビジネス価値とのバランスを取る
- Progressive DeliveryによりErrorBudgetへの影響を最小化 → より積極的に新機能開発にチャレンジ可能

---

## 重要な結論・発見

1. **品質と信頼性は連続的な概念** - 開発から運用までのすべての段階で統合的に担保することが重要

2. **Shift-LeftとShift-Rightの統合** - 従来の組織サイロを超えた品質保証を実現

3. **自動化による品質担保** - 開発者がProduction Readiness Checklistを意識しなくても、自然と品質基準を満たすサービスを作れる仕組みの構築

4. **統合管理による組織学習** - 不具合とインシデントを一元管理し、両者から学びを得る

5. **CUJを軸とした効率的な品質保証** - 限られたリソースで最大の品質を実現するための優先度付け

---

## 参考文献

1. Kim, G., Humble, J., Debois, P., & Willis, J. (2016). *The DevOps Handbook*
2. Crispin, L., & Gregory, J. (2009). *Agile Testing: A Practical Guide for Testers and Agile Teams*
3. [Holistic Testing](https://janetgregory.ca/testing-from-a-holistic-point-of-view/)
4. [SRE Book - Production Readiness](https://sre.google/sre-book/evolving-sre-engagement-model/)
5. [SRE Book - Release Engineering](https://sre.google/sre-book/release-engineering/)
