---
title: "Blitz（前編）：自由度と即時更新性を担保したAggregation"
source: "https://tech.plaid.co.jp/blits_pre_aggregation"
author:
  - "[[Naoki Shibayama]]"
published: 2023-05-18
created: 2026-01-21
description: "PLAIDが開発した分析モジュール「Blitz」の設計思想を解説。大規模ストリーミングデータに対して、スキーマレス・低レイテンシ・即時更新性を両立するPre/Post-Aggregationアーキテクチャの概念と、ストレージ・計算コストをO(T)からO(D)に最適化する手法を紹介。"
tags:
  - "clippings"
  - "stream-processing"
  - "aggregation"
  - "real-time-analytics"
  - "data-architecture"
  - "KARTE"
  - "Blitz"
  - "performance"
  - "analytics"
---

## 概要

PLAIDが9年以上にわたり開発してきた分析モジュール「Blitz」の設計思想を解説する記事の前編。大規模ストリーミングデータに対するAggregation/Filteringを、高い自由度と即時更新性を維持しながら実現するPre/Post-Aggregationアーキテクチャの概念を紹介している。

## Blitzの要求仕様

Blitzはパーソナライゼーションに特化したモジュールで、スキーマが固定されないJSON形式のイベントストリームを処理し、ユーザー単位でのフィルタリングを高速に実行する。

### 性能要件

| 要件 | 説明 |
|------|------|
| **スケーラビリティ** | High Trafficなユーザー数・イベント数に対応、時間経過で性能・ストレージコストが劣化しない |
| **低レイテンシ** | 数百ms以内にレスポンス |
| **新鮮性** | 計算にラグが発生しない（数秒前のイベントも考慮、現在は強整合性） |
| **スキーマレス** | 固定スキーマ不要、多様なデータ型（Nest/Array含む）に対応 |
| **即時更新性** | ルール変更が数分でデプロイ、過去データを遡って考慮 |
| **自由度** | 多種多様なタイムウィンドウ・演算子に対応 |

### 既存アーキテクチャとの比較

| アーキテクチャ | スケーラビリティ | 低レイテンシ | 新鮮性 | スキーマレス | 即時更新性 | 自由度 |
|---------------|-----------------|-------------|--------|-------------|-----------|--------|
| Embed（事前組み込み） | ◉ | ◉ | ◉ | x | ◉ | x |
| Batch Processing（MapReduce等） | ◉ | x | x | ◉ | - | ◉ |
| Stream Processing（Beam等） | - | ◉ | ◉ | ◉ | x | ◉ |
| Lambda Architecture | ◉ | ▲ | ◉ | ◉ | x | ◉ |
| **Blitz** | ◉ | ◉ | ◉ | ◉ | ◉ | ▲ |

Blitzは**SQLほどの自由度は持たせない代わりに、他の要件を満たす**設計となっている。

## コアコンセプト：ストレージ&計算コストの最適化

### 従来のアプローチの問題

通常、ルール変更後に過去データを含めて再計算するには時系列データのスキャンが必要：

```
Space Complexity ∝ Time Complexity = O(T)
```

ストレージと計算コストが**経過時間（T）に比例**して増加する。

### Blitzのアプローチ

```
Space Complexity ∝ Time Complexity = O(D)
```

時系列データを**イベントスキーマのフィールド数（D）ごとの最小単位統計値の集合**に圧縮し、後続処理での自由度を減らさない形で保持。これにより：

- ストレージコスト：O(T) → O(D)
- 計算コスト：O(T) → O(D)

**初期は統計量用の空間を過大に確保するが、時間経過と共に効率的になる**設計。

## Pre-Aggregation処理

### 設計原則

- **Tree構造で分解可能な処理のみ許可**（MapReduceのReduce処理と同様）
- 処理の分散性を維持
- 統計値同士の**Rollup**が可能（例：7日分の日次データ → 週次データを生成）

### データフロー

1. イベントストリームを受信
2. フィールドごとに最小単位の統計値に圧縮
3. CAS操作でEventと各Timewindowの統計値を読み出し・結合・上書き（Swap）
4. 消費済みEventや古いSlotは順次破棄

### 複雑性を伴う部分（本記事では詳細省略）

- Rollupの計画方法
- 競合排除の仕組み

## アーキテクチャ上の位置づけ

Lambda Architectureや一部のOLAPに近い考え方を、**Stream処理向けに実装**したもの。Aggregation処理を**事前処理（Pre-Aggregation）と事後処理（Post-Aggregation）**の2つに分解している。

## 制限事項

- SQLほどの完全な自由度は提供しない（自由度を制限することで他の要件を満たす）
- 初期段階ではストレージを過大に消費する（時間経過で改善）

## 関連リンク

- [後編：リアルタイムユーザー解析エンジンを実現する技術（強整合な解析）](https://tech.plaid.co.jp/blitz_realtime_analytics_architecture) - High Traffic対応、Hot Spot回避、強整合性維持などの実装詳細
