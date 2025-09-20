---
title: "Data modeling tools - Getting Started"
source: "https://neo4j.com/docs/getting-started/data-modeling/data-modeling-tools/"
author:
  - "[[Neo4j Graph Data Platform]]"
published: 
created: 2025-09-21
description: "Neo4jにおけるデータモデリングに利用できるno-codeツールの総合ガイド。データインポーター、視覚化プラットフォーム、Cypherワークベンチなどのツールを比較し、グラフデータベース設計に最適なツールを選択するための情報を提供。"
tags:
  - "clippings"
  - "neo4j"
  - "data-modeling"
  - "graph-database"
  - "data-import"
  - "visualization"
  - "cypher"
---

# データモデリングツール

## 概要

Neo4jでのデータモデリングを支援する様々なno-codeツールが利用可能です。これらのツールは、データモデルの設計から実装まで、幅広いフェーズをカバーしています。

## 主要なツール

### 1. Neo4j Data Importer

**特徴：**
- データモデリングとインポートプロセスを統合
- グラフモデルの作成とデータマッピングが可能
- 視覚的なインターフェースでモデル設計

**アクセス方法：**
- Neo4j Auraの**Import**機能経由
- スタンドアロン版：
  - [セキュア接続のみ](https://data-importer.neo4j.io/)
  - [セキュア・非セキュア接続両対応](https://data-importer.graphapp.io/)

**対応フォーマット：**
- インポート：CSV、TSV
- エクスポート：-（なし）

### 2. Arrows.app

**特徴：**
- No-codeの視覚化プラットフォーム
- ホワイトボード感覚でグラフモデル設計
- ドメインモデルの設計に最適

**主な機能：**
- ゼロからのドラフト作成またはJSONファイル・プレーンテキストからのインポート
- コード不要でノード・リレーションシップの作成・修正・削除
- ラベルとプロパティの管理
- Cypher文としてのエクスポートとNeo4jデータベースへの直接ロード

**対応フォーマット：**
- インポート：JSON
- エクスポート：画像、Cypher、JSON、URL、GraphQL

### 3. Cypher Workbench Labs

**特徴：**
- クラウドベースのNeo4j開発支援ツール
- Arrows.appの視覚的機能とData Importerのインポート機能を統合
- 包括的なデータモデル管理

**主な機能：**
- ゼロからのデータモデル作成またはJSONファイルからのインポート
- 既存Neo4jデータベースからのリバースエンジニアリング
- Cypher文によるデータモデル拡張（ノードラベル、リレーションシップタイプ、プロパティ）
- モデル検証（命名規則、制約、データ、一般的な誤り等）
- ビジネスシナリオツールによるユースケースの質問・シナリオ捕捉
- Excel、Google Sheets、プレーンテキストからのデータインポート

**対応フォーマット：**
- インポート：Cypher Workbench JSON、Apoc.meta.schema、Arrows JSON
- エクスポート：JSON

### 4. その他のツール

#### Mermaid
- **特徴：** Markdownベースの汎用データモデリングツール
- **用途：** モデリング戦略の文書化に最適
- **対応フォーマット：** インポート/エクスポート共にMarkdown

#### PlantUML
- **特徴：** プレーンテキストからの図表作成アプリケーション
- **用途：** バージョン管理重視、モデル設計よりも管理向け
- **対応フォーマット：** 
  - インポート：PUML、JSON
  - エクスポート：PNG、SVG、LaTeX、ASCII図表

#### Hackolade
- **特徴：** データモデル・スキーマの設計・文書化・コミュニケーションツール
- **用途：** Neo4j固有のデータモデリング（ノードラベル、リレーションシップタイプ）に特化
- **対応フォーマット：**
  - インポート：Hackolade JSON、YAML、DDL、XSD、Excelテンプレート、クラウドストレージ、Collibra Data Dictionary
  - エクスポート：Cypher、HTML

## ツール比較表

| ツール | 無料 | インポート | エクスポート |
|--------|------|------------|-------------|
| Data Importer | ✓ | .csv, .tsv | - |
| Arrows | ✓ | JSON | 画像、Cypher、JSON、URL、GraphQL |
| Cypher Workbench | ✓ | Cypher Workbench JSON、Apoc.meta.schema、Arrows JSON | JSON |
| PlantUML | ✓ | PUML、JSON | PNG、SVG、LaTeX、ASCII図表 |
| Mermaid | ✓ | MarkDown | MarkDown |
| Hackolade | × | Hackolade JSON、YAML、DDL、XSD等 | Cypher、HTML |

## 選択指針

### 初心者向け
- **Arrows.app**: 直感的なドラッグ&ドロップインターフェース
- **Neo4j Data Importer**: データインポートと同時にモデリング学習

### 高度なモデリング
- **Cypher Workbench**: 包括的な機能とビジネスシナリオ管理
- **Hackolade**: Neo4j特化の高度なモデリング機能

### 文書化・バージョン管理
- **Mermaid**: Markdownベースでの文書化
- **PlantUML**: バージョン管理システムとの統合

## 重要なポイント

1. **目的に応じた選択**: プロトタイピング、本格的な設計、文書化など用途により最適なツールが異なる
2. **データフォーマット対応**: 既存データのフォーマットとツールの対応を確認
3. **チーム協働**: プロジェクトチームの技術レベルと協働方法を考慮
4. **ライセンス**: 無料ツールと有料ツールの機能差を理解して選択
