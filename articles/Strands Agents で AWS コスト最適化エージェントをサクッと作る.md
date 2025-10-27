---
title: "Strands Agents で AWS コスト最適化エージェントをサクッと作る"
source: "https://tech.layerx.co.jp/entry/2025/10/03/180000"
author:
  - "uehara (yuu2634)"
published: 2025-10-03
created: 2025-10-27
description: |
  LayerX AI Agent ブログリレーの一環として、Strands Agents を用いた AWS コスト最適化エージェントの実装を紹介。オープンソース SDK である Strands Agents を活用し、わずか90行程度のコードで実用的なコスト分析・最適化提案エージェントを構築した事例を解説。システムプロンプトの設計、ツール選択、実装時の工夫点などを実例とともに紹介。
tags:
  - "AI Agent"
  - "Strands Agents"
  - "AWS"
  - "コスト最適化"
  - "Claude"
  - "SRE"
  - "LayerX"
  - "機械学習"
---

## 概要

LayerX SREグループの uehara 氏による、Strands Agents を使った AWS コスト最適化エージェントの開発事例。AI エージェント祭で実装したこのプロジェクトは、最小限のコード量で実用的なコスト分析・最適化提案機能を実現した好例となっている。

## Strands Agents とは

### 基本情報

- 2025年5月に AWS から公開されたオープンソースの AI エージェント SDK
- AI エージェントを効率的に構築・実装するために設計されたフレームワーク
- 対応プロバイダ: Amazon Bedrock、Anthropic、Ollama など

### 特徴

- 複雑なコーディング不要で AI エージェント開発が可能
- 初心者でも取り組みやすい設計
- AI エージェント開発の入門に最適

## AWS コスト最適化エージェントの実装

### 実装規模

- システムプロンプトや入出力処理を含めて約90行で実装完了
- LLM 呼び出しのコア実装はさらに簡潔

### コア実装コード

```python
from strands import Agent
from strands_tools import use_aws, current_time, calculator
from strands_tools.tavily import tavily_search
from strands.models import BedrockModel

model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    temperature=0.3,
    region_name="us-west-2"
)
agent = Agent(
    model=model,
    tools=[
        use_aws,
        current_time,
        tavily_search,
    ],
    system_prompt=SYSTEM_PROMPT,
)
response = agent(user_input)
```

### エージェントの動作フロー

1. ユーザーからの質問受付（例: 「今月のコスト感をまとめて」）
2. 現在日時の確認と AWS ツールによるコスト調査
3. コスト上位10サービスとその他サマリの生成
4. 詳細分析が必要なサービスの問い合わせ
5. Web 検索を活用した具体的なコスト最適化案の提示

### 実行例の成果物

検証用アカウントでの実行では、S3 コスト削減の問い合わせに対して以下を提案:

- S3 データ転送コスト削減のための CloudFront 活用
- ストレージコスト最適化のためのライフサイクルポリシー設定
- 実際の AWS 利用状況を踏まえた具体的な提案

## システムプロンプトと利用ツール

### 使用モデル

Claude 3.7 Sonnet

### システムプロンプトの内容

エージェントの役割定義:

- 利用可能なツールを使用した正確な情報提供
- 利用料の高いサービスのハイライト
- サービス名とコストのシンプルな出力(説明不要)
- 掘り下げるサービスの選択をユーザーに確認
- Service 単位や UsageType 単位での見やすい整理
- コスト削減案提示時の tavily_search() 活用
- マークダウン形式での出力(太字・表・絵文字は使用しない)

### 利用ツール

#### 1. use_aws()

- AWS の各種 API をコール可能
- 用途: 料金情報の取得、各サービスの利用状況取得

#### 2. tavily_search()

- AI エージェント向けに最適化された Web 検索ツール
- 用途: コスト削減提案のためのアイデア検索

#### 3. current_time()

- 現在日時の取得
- 用途: 現在月の正確な把握

全てのツールは Strands Agents が提供する標準ツール（[strands-agents/tools](https://github.com/strands-agents/tools)）。

## 工夫した点

### 1. 初期プロンプトの事前入力

問題点: 起動直後に何を入力すべきか迷う可能性  
解決策: デフォルトで「今月のコスト感をまとめて」を設定  
効果: エージェントの機能を理解しやすくなる

### 2. 回答テキストのフォーマット指定

目的: 読みやすさと将来の拡張性  
実装: 太字や絵文字による過剰な装飾を制限  
効果:

- ターミナル上での可読性向上
- 将来の Web UI への組み込みが容易
- Plain text (markdown) での統一的な出力

### 3. current_time() の活用

課題: LLM は現在日時を正確に把握できない特性がある  
対策: ツールから現在日時を取得する旨をシステムプロンプトに明記  
結果: 「それっぽい」日付での補完を回避し、正確な日時情報に基づく回答を実現

## まとめと展望

### Strands Agents の利点

- ツールを個別開発せずに済む標準ツールの充実
- 簡単な実装で AI エージェント開発が可能
- AI エージェント開発の第一歩として最適

### LayerX SRE グループのミッション

- 新プロダクトと顧客規模拡大の中での AWS コスト適切コントロール
- プロダクトの信頼性とコスト効率の両立
- AI エージェントを組み込んだ新プロダクト・機能の継続的な開発

### 技術的意義

この事例は、適切なフレームワーク選択とツール活用により、最小限の実装コストで実用的な AI エージェントを構築できることを実証している。特に、既存の AWS 環境とシームレスに統合し、実際のビジネス課題(コスト最適化)に直接貢献できる点が特徴的である。
