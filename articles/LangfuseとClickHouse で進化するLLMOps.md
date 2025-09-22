---
title: "LangfuseとClickHouse で進化するLLMOps"
source: "https://speakerdeck.com/toyayuto/langfusetoclickhouse-dejin-hua-surullmops"
author:
  - "[[Yuto Toya]]"
published: 2025-09-20
created: 2025-09-22
description: |
  LangfuseとClickHouseを活用してLLMエージェントの開発と評価を効率化するLLMOpsのアプローチについてのプレゼンテーション。トレースデータの可視化、評価の自動化、そして評価エージェントを用いた継続的な改善サイクルについて解説します。
tags:
  - "clippings"
  - "LLMOps"
  - "Langfuse"
  - "ClickHouse"
  - "LLM"
  - "AI-Agent"
  - "Evaluation"
---

## 概要

本プレゼンテーションでは、LangfuseとClickHouseを活用してLLMOpsを進化させるアプローチについて解説されています。特に、LLMエージェントの開発におけるトレーサビリティの確保、評価の自動化、そして評価エージェントを用いた継続的な改善サイクルの構築に焦点を当てています。

## 内容

### 1. タイトル

![slide_0](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_0.jpg)

- **タイトル**: LangfuseとClickHouse で進化するLLMOps
- **発表者**: 遠⽮ 侑⾳（ガオ株式会社）
- **イベント**: ServerlessDays Tokyo 2025/09/20

### 2. 自己紹介

![slide_1](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_1.jpg)
![slide_2](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_2.jpg)

- **遠矢 侑音（Toya Yuto）**
- ガオ株式会社のエンジニア
- Langfuseを活用した生成AIエージェントの開発や運用のサポートに従事

### 3. エージェント改善とトレースの課題

![slide_3](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_3.jpg)
![slide_4](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_4.jpg)

- **エージェント改善の課題**: エージェントの挙動は複雑で、問題の特定や改善が難しい。
- **トレースの必要性**: なぜその挙動になったのかを追跡・理解するためにトレースが不可欠。

### 4. Langfuseによる可視化

![slide_5](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_5.jpg)
![slide_6](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_6.jpg)

- **Langfuseとは**:
  - LLMアプリ開発から運用までをサポートするOSSのLLMOpsプラットフォーム。
  - エージェントの挙動をグラフ形式で可視化。
  - コストとレイテンシの可視化。
  - プロンプト管理機能。
  - `LLM as a Judge` をUIで設定可能。
  - セルフホスト可能。

### 5. LangfuseとClickHouseのインフラ構成

![slide_7](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_7.jpg)
![slide_8](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_8.jpg)

- **インフラ構成**:
  - エージェントのトレースやスコアは**ClickHouse**に格納される。
  - ClickHouse Cloudを利用することでサーバレスでのデプロイも可能。
- **ClickHouseとは**:
  - オープンソースのカラム指向データベース。
  - 高いデータ圧縮率とクエリパフォーマンスを誇る。
  - 高速なため、エージェントによるDBのリアルタイム分析を可能にし、優れたUXとコストパフォーマンスを両立させる。

### 6. LLMエージェントの評価

![slide_9](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_9.jpg)
![slide_10](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_10.jpg)
![slide_11](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_11.jpg)

- **評価の重要性**: エージェントの性能を客観的に測定し、改善サイクルを回すために評価は不可欠。
- **評価の課題**: 評価基準の定義や、評価プロセス自体のコストが課題となる。
- **評価エージェントのメリット**: 評価プロセスを自動化し、継続的なフィードバックループを構築できる。

### 7. 評価エージェントの構築と結果

![slide_12](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_12.jpg)
![slide_13](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_13.jpg)
![slide_14](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_14.jpg)

- **エージェントの役割**: ClickHouseに蓄積されたトレースデータを分析し、改善点をレポートする。
- **利用技術**: Langfuse, ClickHouse, etc.
- **レポート結果**: エージェントが生成したレポートを通じて、疑問点を対話的に深掘りし、分析を行うことが可能になる。

### 8. BIツールとの比較と評価の進化

![slide_15](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_15.jpg)
![slide_16](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_16.jpg)

- **BIツールとの比較**: 対話的な分析が可能である点が、従来のBIツールでの分析と異なる。
- **LLMOpsにおける評価の進化**:
  - このアプローチにより、評価は単なるスコアリングから、具体的な改善アクションに直結する**「意味のある活動」**へと進化する。
  - 継続的な改善サイクルを回すための強力なエンジンとなる。

### 9. 結論

![slide_17](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_17.jpg)
![slide_18](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_18.jpg)
![slide_19](https://files.speakerdeck.com/presentations/6365c17e6fa24addbb60cc0671fadbb2/slide_19.jpg)

- LangfuseとClickHouseを用いた評価エージェントは、LLMOpsにおける継続的改善を強力にサポートする。
- ガオ株式会社ではエンジニアを募集中。

---
ご清聴ありがとうございました。
