---
title: "NVIDIA、「NemoClaw」発表　OpenClawを1コマンドで導入、安全に実行可能に"
source: "https://www.itmedia.co.jp/news/articles/2603/17/news056.html"
author:
  - "[[ITmedia NEWS]]"
published: 2026-03-17
created: 2026-03-19
description: "米NVIDIAが、年次カンファレンス「GTC 2026」でAIエージェントプラットフォーム「OpenClaw」向けソフトウェアスタック「NemoClaw」を発表した。1コマンドでNemotronモデルとOpenShellランタイムをインストールし、プライバシーとセキュリティを担保したままAIエージェントを常時稼働できる環境を構築できるという。"
tags:
  - "clippings"
  - "NVIDIA"
  - "AI-agent"
  - "OpenClaw"
  - "NemoClaw"
  - "GTC-2026"
  - "security"
  - "edge-AI"
---

## 概要

NVIDIAは2026年3月16日（現地時間）、年次カンファレンス **GTC 2026** の基調講演にて、AIエージェント向けオープンソースプラットフォーム **OpenClaw** に対応するソフトウェアスタック **NVIDIA NemoClaw** を発表した。1つのコマンドでインストールでき、プライバシーとセキュリティの制御機能を備えたAIエージェントを常時稼働させる環境を構築できる。

---

## OpenClawとは

- **作者**: Peter Steinberger（オーストリアの開発者。PSPDFKitの創業者で、Apple・Dropboxなどのクライアントを持つPDFツールキットを開発し€1億の資金調達実績あり）
- **概要**: セルフホスト型のオープンソースAIエージェントプラットフォーム。Mac/Windows/Linux/Android/iOSで動作し、Claude・GPT-4o・Gemini・Mistralなどの大規模言語モデルや、ローカルモデルと接続可能
- **機能**: メッセージングアプリ（WhatsApp、Telegram、Slack、Discord、Signal、iMessage）を通じてタスクを実行。メール管理、カレンダー操作、コードデプロイ、ターミナルコマンド実行、スマートホーム制御など
- **爆発的成長**: GitHub史上最速で成長したオープンソースプロジェクト
  - 2026年1月末: 約9,000スター
  - バイラル化後72時間: 60,000スター
  - 2月初旬: 185,000スター
  - 3月3日: **250,000+スター**（Reactが13年かけて蓄積した243,000スターを約60日で超えた）
  - コントリビューター1,000+名、推定ユーザー30万〜40万人
- **OpenAI参画**: 2026年2月にSteinbergerがOpenAIに参加。OpenClawは独立した501(c)(3)財団に移行し、MITライセンスを維持

### Jensen Huang CEOのコメント

> 「MacとWindowsはパーソナルコンピュータのOSだ。OpenClawはパーソナルAIのOS。これは業界が待ち望んでいた瞬間であり、ソフトウェアの新たなルネッサンスの始まりだ」

> 「世界のすべての企業が今日、OpenClaw戦略を持つ必要がある。これは新しいコンピュータだ。OpenClaw以降、エージェント以降…すべてのSaaS企業がagentic-as-a-serviceの企業になるだろう」

Huang氏はOpenClawの重要性を1990年代のLinuxとHTMLの登場に匹敵するものと位置づけた。

---

## NemoClawの構成と技術

NemoClawは **NVIDIA Agent Toolkit** を使用し、以下のコンポーネントを1つのコマンドでインストールする：

| コンポーネント | 説明 |
|---|---|
| **NVIDIA Nemotron** | NVIDIAのオープンAIモデルファミリー。ローカルで直接実行可能 |
| **NVIDIA OpenShell** | 実行環境（ランタイム）。オープンモデルと隔離されたサンドボックス環境を提供 |

### OpenShellのセキュリティ機能

NemoClawのセキュリティの中核を担うのが **OpenShell** ランタイムで、以下の多層防御を提供する：

- **カーネルレベルのサンドボックス化**: エージェントの実行を隔離された環境で行い、システムへの不正アクセスを防止
- **プライバシールーター**: OpenClawの通信とデータ送信を監視。機密データの不正な送信先への転送を検知・ブロック
- **ポリシーベースのセキュリティ強制**: ネットワーク・プライバシーのガードレールをポリシーに基づいて適用
- **アクセス権限の制御**: エージェントに必要なアクセス権限を付与しつつ、ガードレール内での動作を強制

### ローカル＋クラウドのハイブリッド構成

- **ローカル**: Nemotronなどのオープンモデルをシステム上で直接実行
- **クラウド**: プライバシールーターを経由してフロンティアモデルにアクセス
- ローカルとクラウドを組み合わせることで、エージェントが定義されたプライバシー・セキュリティポリシーの範囲内で新しいスキルを獲得し、タスクを実行する基盤を構築

---

## 対応ハードウェア

NemoClawは以下の専用プラットフォームで動作する（常時稼働エージェントには専用コンピューティングが必要）：

| プラットフォーム | 種類 |
|---|---|
| **GeForce RTX搭載PC/ノートPC** | コンシューマー向け |
| **RTX PRO搭載ワークステーション** | プロフェッショナル向け |
| **NVIDIA DGX Station** | AIスーパーコンピュータ |
| **NVIDIA DGX Spark** | AIスーパーコンピュータ |

NemoClaw自体は**ハードウェア非依存**であり、NVIDIA以外のハードウェアでも動作する。ただし、NVIDIA Inference Microservices（NIM）などのNVIDIA固有技術に最適化されている。

---

## OpenClawのセキュリティ課題とNemoClawの意義

OpenClawは爆発的に普及した一方で、以下のようなセキュリティ上の懸念が指摘されていた：

- **約900個の悪意あるスキル** が発見
- **135,000のインスタンス** が露出
- リモートからデバイスを侵害可能な **セキュリティ脆弱性** が複数報告
- エンタープライズでの安全な展開に対する懸念

NemoClawはOpenShellによる隔離を通じてこれらの問題に対処し、エンタープライズでのOpenClaw導入を促進する狙いがある。

---

## 専門家の見解

**Zahra Timsah**（AI ガバナンスプラットフォーム i-GENTIC AI CEO）：

> 「NVIDIAはいつものようにやっている。彼らは重心を自社のスタックに引き寄せている」

> 「開発者がNemoClawに惹かれるのは、優れているからではなく、NVIDIAハードウェアでより高速で、既にそのエコシステムにいるなら簡単だからだ」

### NemoClawに不足している要素（Timsah氏の指摘）

- **オブザーバビリティ**（可観測性）
- **ポリシー強制**の深い統合
- **ロールバック機能**
- **監査証跡**（audit trails）
- **ガバナンス、一貫性、クロスシステム推論**

> 「本当の問いは『エッジでエージェントを実行できるか？』ではない。『誰も見ていないときに彼らがすることを信頼できるか？』だ」

---

## GTC 2026での体験イベント

GTCの来場者は3月16〜19日の **build-a-claw イベント** に参加可能。NemoClawを使って、プロアクティブで常時稼働するAIアシスタントをカスタマイズ・デプロイする体験ができる。

---

## 関連リンク

- [NVIDIAプレスリリース](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw)
- [NVIDIA NemoClaw公式ページ](https://www.nvidia.com/nemoclaw)
- [GTC 2026 基調講演](https://www.nvidia.com/gtc/keynote/)
- [Computerworld詳細記事](https://www.computerworld.com/article/4146562/nvidia-nemoclaw-promises-to-run-openclaw-agents-securely-2.html)
