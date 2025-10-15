---
title: "RoleInterface - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/RoleInterface"
author:
  - Martin Fowler
  - bliki-ja (翻訳)
published: 2006-12-22
created: 2025-10-15
description: |
  ソフトウェアのインタフェース設計における2つのアプローチ、ロールインタフェースとヘッダインタフェースを解説。ロールインタフェースはクライアントとサプライヤ間の特定のやり取りを考慮して定義され、より明確なコミュニケーションと柔軟な実装を可能にする。PERTプロジェクト計画の例を用いて、それぞれのアプローチの利点と欠点を説明している。
tags:
  - API design
  - interface design
  - object-oriented design
  - software architecture
  - design patterns
---

## 概要

ソフトウェアの構成要素としてのインタフェースには、**ロールインタフェース**と**ヘッダインタフェース**という2つの種類がある。

### ロールインタフェース vs ヘッダインタフェース

- **ロールインタフェース**: サプライヤとクライアント間の特定のやり取りを考慮して定義される。サプライヤコンポーネントは通常、複数のロールインタフェースを実装する
- **ヘッダインタフェース**: サプライヤコンポーネントがただ1つのインタフェースを持つ。すべてのパブリックメソッドを含む

## 実例: PERTプロジェクト計画

### 問題設定

PERTを使ったプロジェクト計画では、以下のような構造を持つ:

- プロジェクトを複数のアクティビティに分解
- アクティビティを非循環有向グラフに配置し、依存関係を示す
- 各アクティビティには所要時間があり、そこから以下を算出:
  - 最早開始時間 (earliestStart)
  - 最早終了時間 (earliestFinish)
  - 最遅開始時間 (latestStart)
  - 最遅終了時間 (latestFinish)

### ヘッダインタフェースのアプローチ

```java
public interface Activity {
  MfDate earliestStart();
  MfDate earliestFinish();
  MfDate latestFinish();
  MfDate latestStart();
}

class ActivityImpl {
  List<Activity> predecessors() ...
  List<Activity> successors() ...
}
```

すべてのメソッドを含む1つのインタフェースを定義。

### ロールインタフェースのアプローチ

```java
public interface Successor {
  MfDate latestStart();
}

public interface Predecessor {
  MfDate earliestFinish();
}

class Activity {
  List<Predecessor> predecessors() ...
  List<Successor> successors() ...
}
```

実際に使用されるメソッドのみを持つ2つのインタフェースを作成。協調関係における役割(ロール)を明示的に表現。

## ロールインタフェースの利点

1. **明確なコミュニケーション**: アクティビティとsuccessorsという実際の協調関係が明確に表現される
2. **必要最小限の実装**: 実際に必要なメソッドのみを実装すればよい
3. **柔軟な代替実装**: 後で代替が必要となる場合に、必要なメソッドだけを実装すればよい

## ロールインタフェースの欠点

1. **作成の手間**: それぞれの協調関係を考慮する必要があるため、作成に時間がかかる
2. **クライアント依存**: クライアントが「誰が、どのように、サービスを使うか」を気にする必要がある

## 著者の推奨

Martin Fowlerはロールインタフェースを好み、できるだけ使用することを推奨している。理由は以下の通り:

- インタフェースは代替性が本当に必要なときのみ使うべき
- インタフェースが必要な場合、クライアントが何を必要としているかを真剣に考えるべき

## Webサービスにおける考察

リモート環境では興味深い「ねじれ」が発生する:

- リモートサービスから返されるドキュメントには、求めたもの以上のデータを含んでもよい
- 必要な型チェックは、必要なデータ(例: 最早終了日)が存在するかどうかのみ
- それ以外のデータは無視できる
- この考えは**Consumer Driven Contracts**(クライアント駆動契約)の考えと一致する

## 歴史的背景と関連概念

- **Trygve Reenskaug**: ロール分析に基づいたクラス設計の方法論を著述
- **Robert Martin**: 「インターフェイス分離の原則(Interface Segregation Principle)」として同様の概念を提唱
- ロールインタフェースはこの原則に沿っているが、ヘッダインタフェースはそうではない

## まとめ

ロールインタフェースは手間がかかるものの、より明確で柔軟なインタフェース設計を可能にする。クライアントとサプライヤの協調関係を明示的に表現し、必要最小限の実装で代替可能性を実現できる。オブジェクト指向設計において、インタフェースの分離は重要な設計原則である。
