---
title: "Lesson 213 - Governing Architectural Constraints"
source: "https://www.youtube.com/watch?v=Sm2bldzz0H4"
author:
  - "Mark Richards"
published: 
created: 2025-11-27
description: "ADL（Architecture Definition Language）とArchitecture as Codeの概念を組み合わせて、アーキテクチャ制約をガバナンス（統治）する方法を解説。レイヤードアーキテクチャを例に、GenAIを活用してADLから実行可能なテストコードを生成し、制約を自動的に検証する手法を紹介。"
tags:
  - "software-architecture"
  - "architecture-as-code"
  - "ADL"
  - "architectural-constraints"
  - "layered-architecture"
  - "ArchUnit"
---

## 概要

このレッスンでは、**アーキテクチャ制約（Architectural Constraints）** をどのようにガバナンス（統治・管理）するかを解説しています。Mark Richardsは、以下の2つの概念を組み合わせた実践的なアプローチを紹介します：

- **Lesson 194**: Architecture as Code（ソースコードを通じてアーキテクチャを記述・統治する概念）
- **Lesson 210**: ADL（Architecture Definition Language）- アーキテクチャを記述するための疑似コード言語

## アーキテクチャ制約とは

アーキテクチャ制約とは、アーキテクチャがビジネスニーズや関心事を満たすことを保証するために、アーキテクトが行う決定事項のことです。

## ケーススタディ：ビジネス要件

### 要件

1. **非常にタイトな時間枠と予算**で新製品を開発
2. **データ構造の頻繁な変更**が予想される
3. データベース変更時に**迅速に対応**する必要がある

### アーキテクチャスタイルの選定

「Fundamentals of Software Architecture」の**スター評価チャート**を活用：

| 評価基準 | 説明 |
|---------|------|
| ⭐ 1〜5 | 品質特性の評価（5が最良） |
| 💲 1〜5 | コスト（1が安価、5が高価） |

**主な関心事**：

- **コスト** - 予算制約
- **シンプルさ** - 時間制約

**候補となるアーキテクチャ**：

- レイヤードアーキテクチャ ✅
- モジュラーモノリス ✅
- マイクロカーネル ✅
- サービスベース（コストは良いが、シンプルさに欠ける）

### 決定：レイヤードアーキテクチャ

**選定理由**：頻繁なデータベース構造変更への対応

- **技術的パーティショニング（Technical Partitioning）** により、データベースロジックを分離可能
- **関心の分離**が明確 → 変更制御が容易
- 正しく実装すれば、スキーマ変更時に**永続化層のみ**を修正すればよい

> 💡 **「レイヤードアーキテクチャは死んでいない」** - 適切なユースケースでは依然として有効

## 適用すべき制約

成功のために必要な2つの制約：

| 制約 | 説明 |
|-----|------|
| **制約1** | Presentation、Business、Servicesの各層はデータベースに直接アクセスしてはならない |
| **制約2** | すべてのデータベースロジックはPersistence層に配置しなければならない |

## ADL（Architecture Definition Language）によるガバナンス

### ADLとADRの違い

| ADR（Architecture Decision Record） | ADL（Architecture Definition Language） |
|-------------------------------------|----------------------------------------|
| アーキテクチャスタイルと制約の**正当性を記録** | アーキテクチャを**記述**し**統治**する |

### ADLファイルの例

```
// システム定義
system sysops_squad as sysops

// レイヤー（ドメイン）定義
domain presentation_layer as presentation
domain business_layer as business  
domain services_layer as services
domain persistence_layer as persistence

// 制約の定義
assert persistence_layer is the only layer that contains database logic
```

## GenAIによる実行可能コードの生成

ADLをGenAIに入力することで、各言語/フレームワーク用のテストコードを自動生成できます：

### 対応ツール

| 言語/プラットフォーム | ツール |
|---------------------|-------|
| Java | ArchUnit |
| TypeScript/JavaScript | ts-arch |
| .NET | NetTest / ArchUnit.NET |
| Python | pytest-arch |
| Go | go-arch |

### 生成されたコード例（Java - ArchUnit）

```java
// persistence パッケージ外のクラスは、
// Connection、Statement、PreparedStatement、ResultSet に依存してはならない
noClasses()
    .that().resideOutsideOfPackage("..persistence..")
    .should().dependOnClassesThat()
    .areAssignableTo(Connection.class, Statement.class, 
                     PreparedStatement.class, ResultSet.class);
```

### 生成されたコード例（.NET - ArchUnit.NET）

```csharp
// persistence 名前空間外の型は、
// IDbConnection、IDbCommand、IDataReader、IDbDataAdapter に依存してはならない
Types()
    .That().ResideOutsideOfNamespace("..persistence..")
    .ShouldNot().DependOn()
    .Types(typeof(IDbConnection), typeof(IDbCommand), 
           typeof(IDataReader), typeof(IDbDataAdapter));
```

> 🤖 **注目点**: GenAIは「データベースロジック」という抽象的な表現から、具体的なクラス（Connection、Statement等）を適切に推論できた

## 重要な発見

1. **ADLは制約の記述と統治の両方を実現** - 単一のADLレコードで複数の制約をカバー
2. **GenAIの活用** - 疑似コードから実行可能なテストコードを自動生成
3. **継続的なガバナンス** - テストとして実行することで、制約違反を自動検出

## 関連レッスンの組み合わせ

```
Lesson 194（Architecture as Code）
        +
Lesson 210（ADL）
        +
Lesson 213（Governing Constraints）
        ↓
アーキテクチャの記述 + 統治 + 整合性の保証
```

## 参考リソース

- [Lesson 194: Architecture as Code](https://www.developertoarchitect.com/lessons/lesson194.html)
- [Lesson 210: Architecture Definition Language](https://www.developertoarchitect.com/lessons/lesson210.html)
- [Fundamentals of Software Architecture 2nd Edition](https://bit.ly/4ioDTPA)
- [Software Architecture: The Hard Parts](https://amzn.to/3BjMMF2)
- [Head First Software Architecture](https://amzn.to/3VNFI0o)
