---
title: "AIエージェントの地上戦 〜開発計画と運用実践 / 2025/04/08  Findy W&Bミートアップ #19"
source: "https://speakerdeck.com/smiyawaki0820/08-findy-w-and-bmitoatupu-number-19"
author:
  - "Shumpei Miyawaki"
published: 2025-04-07
created: 2025-05-23
description: "AlgomaticのShumpei Miyawaki氏によるFindy W&Bミートアップでの登壇資料。AIエージェントの実用的な開発・運用における「地上戦」戦略について、3つの核心的アプローチ（小さな技術課題への丁寧な対応、継続的改善サイクル、高品質ガードレール）を中心に解説。"
tags:
  - "AIエージェント"
  - "LLM"
  - "開発実践"
  - "品質管理"
  - "ガードレール"
  - "MLOps"
  - "プロダクト開発"
---

## 概要

2025年4月8日にFindy W&Bミートアップ #19で発表されたAlgomaticのShumpei Miyawaki氏による講演資料。AIエージェントの業務適用における実践的な開発・運用戦略について、「魅力的品質」ではなく「当たり前品質」に焦点を当てた地に足ついた内容が展開されている。

## 主要メッセージ

発表者が伝えたい3つの核心ポイント：

1. **小さな技術課題に対して一つ一つ丁寧に向き合う**
2. **3つの改善サイクルを継続的に循環させる**
3. **高品質なガードレールをつくる**

## Algomaticの AIエージェント事例

### 実装されているAIエージェント

- **ユーザと作業空間を共有するAIエージェント**: フィールドセールスにおける面談環境で商談ステータスを管理
- **業務代行AIエージェント（インサイドセールス）**: [apodori.ai](https://apodori.ai/) - 企業リストから自動でアポイント獲得
- **業務代行AIエージェント（ダイレクト採用）**: [ai-recruiter.jp](https://ai-recruiter.jp/) - カレンダー開放のみで面談機会を創出
- **Vertical エージェント型AI**: 管理部業務のプロアクティブ実行（出勤管理、勤怠管理、新メンバー紹介、NDA締結ドラフト作成等）

## AIエージェントの定義と課題

### AIエージェントの多様な解釈

- エージェンティックUX、Copilot、チャットボット、LLMエージェント、マルチエージェント等、多様な解釈が存在
- 学術的定義：環境内に存在し、環境を知覚し、環境に作用するシステム（Russell+'95）
- 「AIエージェント」vs「エージェント型AI」の概念的区別

### 業務適用における3つの主要課題

1. **回答品質の文脈依存性**: LLMが解くタスクの多くが一対多の関係で、適切な文脈が必要
2. **タスクの複雑性**: ステップ数増加による失敗率の劇的上昇（例：2%/ステップ → 10ステップで18%、100ステップで87%）
3. **社会的影響への対応**: ハルシネーション、安全性、プライバシー、倫理的課題への説明責任

## 地上戦戦略の核心

### 複合的システムとしての認識

AIエージェントは以下の要素を含む複合的で複雑なシステム：

- **Profile/プロンプト**: 役割定義、文脈情報、専門家思考の落とし込み
- **Memory/RAG**: 情報取得、データ管理、バージョン管理、チャンク分割
- **Tool Calling/Action**: ツール使用法、類似ツール区別、エラーハンドリング
- **Routing/Reflection**: タスク構成、自己修正、分岐処理
- **Evaluation**: 評価基準、軌跡評価、コスト管理、リスク防御

### 業務代行実現の条件

**プロセスの俊敏性・モデルの頑健性・データの完全性・システム品質**のバランスと適切な顧客期待値設定が必要。

## 長期開発ロードマップ

### アシスタントフェーズからの段階的アプローチ

1. **ドメインエキスパートのAI活用検証**を先行
2. **事業性確認後**にAIエージェント開発着手
3. **自動運転レベル**を参考にした段階的代行レベル設定
4. **リクルタAI**の事例：技術検証→開発Ph.01→Ph.02→Ph.03の段階的進行

### リクルタAIの開発軌跡

- 初期段階では開発と手作業運用の並行
- 人の介入余地を段階的に削減
- 完全自動化だけでなく「遊び」を残すことの重要性

## 3つの改善サイクル

### Inner Loop: ドメインエキスパートとの協働

**プロンプト開発の実践的アプローチ：**

- **具体的で伝わりやすい表現**を優先（テクニックは二の次）
- **Jinja2等のテンプレートエンジン**でプロンプトとドメイン知識を分離
- **ペアリングセッション**によるフィードバックループ構築

**コンテキスト曖昧性の解消：**

- タスク定義 > 手順 > 談話構成 > 記法 > few-shot の優先順位
- LLMの言語運用能力への過度な依存回避

### Middle Loop: 動作・精度・リスク検証

**評価の現実的課題：**

- 定量評価の限界：「精度98%」でも事業化に直結しない事例
- 評価指標の問題：コールドスタート、データシフト、価値提供との乖離
- 短期的には定量評価より**安全な動作・可観測性・制御可能性**を優先

**アジャイルな性能評価計画：**

- 開発初期は安全性保証に注力
- 運用と共に定量的性能値を明確化する仕組み構築

### Outer Loop: 本番デプロイとメンテナンス

- 回帰テストとカナリアリリース
- 継続的監視とプロダクトメンテナンス
- KPI測定とフィードフォワード

## 高品質ガードレール戦略

### 多層・多重防御アーキテクチャ

**Layered Protection Model（Ayyamperumal+'24）：**

- **Input rails**: 個人情報・敵対的入力チェック
- **Dialog rails**: 対話流れの制御
- **Retrieval rails**: 事実性・関連文書確認
- **Output rails**: 個人情報漏洩・毒性リスクチェック
- **Execution rails**: ツール実行時の安全性確保

### ガードレール実装の実践

**監視と対応体制：**

- ファネル毎の通過率追跡
- メトリクスフィルタによるアラート設定
- フェイルセーフによる全作業停止機能
- 事前対応方針策定

**評価手法の組み合わせ：**

- 単語表層チェック（正規表現、編集距離等）
- 出力形式検証（Pydantic validation等）
- LLM-as-a-Judge（バイアス問題に注意）
- メタモルフィックテスティング

### LLM-as-a-Judge の注意点

**バイアス問題（Zheng+'23）：**

- 位置バイアス、自己選好バイアス、具体性バイアス、冗長性バイアス
- 第三者ライブラリと現場業務要求のギャップ
- 汎用的有用性 vs 業務特化有用性の違い

**対策アプローチ：**

- LLMへの過度依存回避
- 導出過程の明確な定義とオンボーディング
- 動作検証を伴うバグ修正による頑健性向上

## セキュリティとリスク対策

### OpenAI Moderation API活用

無料で利用可能な基本的リスク対策として以下カテゴリをチェック：

- harassment（嫌がらせ）、hate（憎悪）、illicit（違法行為）
- self-harm（自傷行為）、sexual（性的コンテンツ）、violence（暴力）

### 日本語安全性データセット

- **LLM-jp-toxicity-dataset**: 日本語有害文書データセット
- **JSocialFact**: 偽誤情報QAデータセット
- **JBBQ_data**: 日本語社会的バイアスQAデータセット
- **JTruthfulQA**: 真実性ベンチマーク
- **AnswerCarefully**: 日本語LLM安全性向上データセット

### レッドチーミング

**DeepTeam等によるレッドチーミング手法：**

- 攻撃者視点でのセキュリティ評価
- Jailbreak、Prompt Injectionシミュレーション
- 脆弱性の事前発見と対策

## 品質管理フレームワーク

### 機械学習品質マネジメント

**AISL1対応の運用時品質管理：**

- プライバシーと両立するシステム品質監視
- オンライン学習での品質確保と更新中止機能
- オフライン追加学習での3段階データ品質管理

### 責任あるAI開発（Microsoft準拠）

**6つの原則：**

1. **公平性**: バイアス除去、同等サービス品質保証
2. **信頼性・安全性**: 失敗最小化、定期評価
3. **説明責任**: 影響評価、リスク軽減プロセス
4. **透明性**: 動作原理説明、過剰依存回避
5. **プライバシー・セキュリティ**: 個人情報保護、脅威対策
6. **包括性**: アクセシビリティ、公平なユーザ体験

## 継続的改善の重要性

### なぜ改善サイクルを回し続けるのか

- **品質評価基準**は運用開始後に明確化される
- **顧客コンセプト**は時間と共に変化
- **要件許容範囲**への段階的収束が必要
- 継続的な評価・改善サイクルによる正解への近接

## 結論

AIエージェントの業務代行実現には、魅力的な機能追加よりも「当たり前品質」の地道な積み上げが重要。小さな技術課題への丁寧な対応、3層の改善サイクル継続、高品質ガードレール構築により、安全で信頼性の高いAIエージェントシステムを実現できる。

現場のドメインエキスパートとの密接な協働、段階的な自動化レベル向上、包括的なリスク管理体制が、長期的な業務代行成功の鍵となる。
