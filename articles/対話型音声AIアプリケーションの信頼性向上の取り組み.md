---
title: "対話型音声AIアプリケーションの信頼性向上の取り組み"
source: "https://speakerdeck.com/ivry_presentationmaterials/dui-hua-xing-yin-sheng-aiapurikesiyonnoxin-lai-xing-xiang-shang-noqu-rizu-mi"
author:
  - "株式会社IVRy"
  - "Hiroyuki Moriya"
  - "Ryuichi Watanabe"
published: 2025-07-11
created: 2025-08-13
description: |
  株式会社IVRyが「SRE NEXT 2025」で発表した、対話型音声AIアプリケーションの信頼性向上に関する取り組みについての資料。LLM APIやWebSocketの運用における課題と、SREとしての具体的な解決策（ハルシネーション対策、安定運用、安全なデプロイ、SLI/SLO設計など）を解説しています。
tags:
  - "SRE"
  - "LLM"
  - "AI"
  - "WebSocket"
  - "Observability"
  - "Reliability"
---

本資料は、株式会社IVRyが2025年7月11日に開催された「SRE NEXT 2025」で発表した、対話型音声AIアプリケーションの信頼性向上に関する取り組みをまとめたものです。AIエンジニアの森谷氏とSREの渡部氏が登壇し、LLM APIとWebSocketの運用における具体的な課題と、SREとしての解決策を解説しています。

## 発表の概要

![Slide 1](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_0.jpg)

### アジェンダ

1. **IVRyについて**: 会社とプロダクトの紹介
2. **LLM API**: プロダクト運用における課題と対策
3. **WebSocket**: プロダクト運用における課題と対策
4. **まとめ**: SREとしての学び

![Slide 7](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_6.jpg)

## 1. IVRyについて

株式会社IVRyは、「"Work" is Fun」をミッションに掲げ、クラウド型AI電話SaaS「IVRy（アイブリー）」を運営しています。電話自動応答サービスを主軸に、あらゆる業種・企業規模の顧客に導入されています。

### システムアーキテクチャ

IVRyのシステムは、複数のコンポーネントで構成されており、電話というリアルタイム性が求められるサービスを支えています。

![Slide 11](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_10.jpg)
![Slide 12](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_11.jpg)
![Slide 13](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_12.jpg)

## 2. LLM APIのプロダクト運用

対話型AIアプリケーションにおいて、LLM APIの運用には2つの大きな課題が存在します。

- **Challenge #1: ハルシネーションの抑制**
- **Challenge #2: LLM APIの安定運用**

![Slide 17](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_16.jpg)

### ハルシネーションの抑制

**Problem**: LLMは事実に基づかない情報を生成する（ハルシネーション）ことがあります。

**Solution**:

1. **困難は分割せよ (AI Workflow)**: 1つのタスクを複数のLLMコンポーネントに分割し、各ステップでValidationやエラー分析を行うことで、安定した出力を実現します。
    ![Slide 23](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_22.jpg)
2. **確認を怠らない (自動E2Eテスト)**: コードマージ時に電話の自動E2Eテストを実行し、Datadog LLM Observabilityで監視することで、デプロイ後の品質を担保します。
    ![Slide 29](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_28.jpg)

### LLM APIの安定運用

**Problem**: LLM APIは不安定であり、システム障害はビジネスに大きな影響を与えます。

**Solution**:

1. **完璧を求めない (適切なモデル選定)**: 最新モデルではなく、ユースケースに合った速度・安定性・コストのバランスが取れたモデルを選定します。
    ![Slide 35](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_34.jpg)
2. **システム監視を怠らない (外部通信の監視)**: Datadog Inferred Servicesを活用し、外部API通信のパフォーマンスやエラーを監視します。
    ![Slide 37](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_36.jpg)
3. **最悪の事態に備える (Fallback戦略)**: 複数のLLM APIプロバイダーを利用し、一方に障害が発生した際に他方に切り替えるFallbackシステムを実装します。
    ![Slide 40](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_39.jpg)

## 3. WebSocketのプロダクト運用

### なぜWebSocketを使うのか？

IVRyの対話型AIでは、ユーザーの発話からAIの応答までの遅延がユーザー体験に直結します。WebSocketは低遅延な双方向通信を実現し、HTTPに比べてデータ転送のオーバーヘッドが少ないため、自然な会話体験を提供するために不可欠です。

![Slide 45](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_44.jpg)

### WebSocket運用における課題

- **安全なデプロイの難しさ**
- **音声対話システムのSLI/SLO設計**

### 安全なデプロイ

**Problem**: デプロイ時にGraceful Shutdownを設定しているにもかかわらず、一部の通話がエラーになっていました。

**Solution (横断的分析)**:

- 原因はアプリケーションではなく、ALB -> ECS構成の把握不足でした。
- 1通話の最大時間がECSタスクの停止タイムアウト（最大120秒）を超えていたため、正常な終了ができていませんでした。
- ターゲットグループの登録解除待機時間（`deregistration_delay.timeout_seconds`）を伸ばすことで、通話が強制終了されないように対策しました。
- **学び**: 新しいプロトコルでも、Observabilityを改善し、デバッグのノウハウを蓄積するなど、信頼性を高めるためのアプローチは変わりません。

### 音声対話システムのSLI/SLO

**Problem**:

- ユーザー体験（「ちゃんと会話できたか」）が主観的で定量化しづらい。
- 会話失敗の原因が、インフラ、LLM、音声認識など多岐にわたる。
- Webと異なり、リクエスト単位ではなくセッションベースでの設計が必要。

**Solution (ユーザーに届けたいものを再考する)**:

- ユーザーの「目的達成」を最上位のSLOと設定します。
- エラーを**「システム的Anomaly」**と**「対話的Anomaly」**に分類して考えます。

1. **システム的Anomaly**: インフラ層の失敗（遅延、エラーなど）。従来のSREプラクティスで計測可能。
    ![Slide 67 (System Anomaly)](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_66.jpg)
2. **対話的Anomaly**: ユーザーの主観的な体験に直結する対話の失敗（「話が通じなかった」「変な返事をされた」など）。システム的には成功でもUXは失敗。これをトラッキングすることで、ユーザーの真の「目的達成率」を追跡します。
    ![Slide 70](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_69.jpg)

## まとめ

- **システム特性の理解**: LLMのような不安定な技術に依存しつつも、ユーザー体験を守る設計と運用が重要です。
- **信頼性の分離**: 「システム的Anomaly」と「対話的Anomaly」を切り分けてSLI/SLOを設計することで、複雑なAIアプリケーションの信頼性を多角的に評価できます。
- **SREの普遍性**: 新しい技術スタックであっても、Observabilityを高め、安定性を担保するというSREの基本原則は変わりません。

![Slide 72](https://files.speakerdeck.com/presentations/fa82db8686c84a49b88da1e5955ff943/slide_71.jpg)
