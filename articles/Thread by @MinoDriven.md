---
title: "DMMブースで展示したCQRSのアーキテクチャ図と解説"
source: "https://x.com/MinoDriven/status/1994316729221018101"
author:
  - "ミノ駆動 (@MinoDriven)"
published: 2025-11-28
created: 2025-11-30
description: |
  アーキテクチャConference2025のDMMブースで展示されたCQRS（Command Query Responsibility Segregation）のアーキテクチャ図と各レイヤーの詳細解説。更新系と参照系でモデルを分離するアーキテクチャパターンの実践的な実装方法を示している。
tags:
  - "CQRS"
  - "アーキテクチャ"
  - "DDD"
  - "ドメイン駆動設計"
  - "DMM"
  - "ソフトウェア設計"
---

## 概要

**ミノ駆動** @MinoDriven [2025-11-28](https://x.com/MinoDriven/status/1994316729221018101)

> こちら、弊社DMMブース＠ アーキテクチャConference2025で展示したCQRSのアーキテクチャ図と解説です。
>
> DMMプラットフォームの各サービスの一部ではCQRSを採用したり、CQRSへ改善を進めたりしています。
>
> ご参考にどうぞ。

---

## CQRSとは

**CQRS（Command Query Responsibility Segregation）** とは、**更新と参照とでモデルを分離するアーキテクチャ**。

本アーキテクチャは、CQRSの実現形態のひとつ（イベントソーシングを用いてより厳密に分離する形態もある）。

### なぜ分離が必要か

- 更新と参照では、**取り扱うデータの粒度**や、**データに求める要件が異なる**
- ひとつのモデルを更新と参照両方の用途で実装すると：
  - どのコードが更新または参照用なのか見分けが難しくなる
  - 保守や変更が困難になる
- 更新用には**ドメインオブジェクト**、参照用には**DTO**とすることで用途が明確になり、コードも簡明となる

---

## アーキテクチャ図

![CQRSアーキテクチャ図](https://pbs.twimg.com/media/G606mAaa0AEda4Q?format=jpg&name=large)

上図は更新系と参照系で見やすくするために2つに分けているだけであり、**実際の構造は一体化したひとつのアーキテクチャ**である。

### 更新系（Command側）

```
外部サービス     DB
    ↑           ↑
Infrastructure layer
├── ExternalGateway
└── Repository
    ↑
Presentation layer
└── Handler
    ↓
Use Case layer
├── 更新系UseCase
└── «interface» ExternalGateway
    ↓
Domain layer
├── Aggregate
│   ├── Entity
│   └── ValueObject
└── «interface» Repository
```

### 参照系（Query側）

```
外部サービス     DB
    ↑           ↑
Infrastructure layer
├── ExternalGateway
└── QueryService
    ↑
Presentation layer
└── Handler
    ↓
Use Case layer
├── 参照系UseCase
├── «interface» ExternalGateway
└── «interface» QueryService
    ↓
DTO
```

---

## レイヤー解説

![CQRSレイヤー解説](https://pbs.twimg.com/media/G606rXsaIAAvhGn?format=jpg&name=large)

### Presentation layer（黄色）

**クライアントとの入出力を担う層**

#### Handler (Controller)

- クライアントとの入出力、つまり**リクエストを受け取ってレスポンスを返すことだけに責任を持つ**
- それ以外の処理は、他の層のオブジェクトに委譲する
- 基本的に**UseCaseを呼び出すだけ**

---

### Domain layer（赤色）

**業務活動を表現するデータの正確な作成や更新について絶対的な責任を持つ層**

この設計実装に不備があると壊れたデータや矛盾したデータが作られてしまい、バグになる。データやロジックに欠損なく、正確な状態を維持できることを**ドメインモデルの完全性**と呼ぶ。完全性を維持するようにドメインオブジェクトを設計する。

#### Value Object

- **値を表現するドメインオブジェクト**
- 値に関する制約や振る舞いをカプセル化する
- **IDを持たず、属性によって同じかどうかを識別する**
- 例：注文数、価格、商品重量、電話番号

#### Entity

- **IDで識別が必要なドメインオブジェクト**
- Value Objectと同様に必要な制約や振る舞いをカプセル化する
- 例：注文明細、社員

#### Aggregate

- **ドメインオブジェクト同士（ValueObjectやEntity）の整合性を維持する最小構成単位**
- ライフサイクルをともにするオブジェクトをカプセル化する
- 例：注文、クーポン、商品審査

#### Repository interface

- Repositoryとは**リストや配列をエミュレート（模倣）する設計パターン**
- 専らDBを用いてエミュレートする
- Aggregateのリストとして設計する
- リストなので、リストと同様のexistsやcountメソッドなどを定義して良い
- **テスタビリティ向上のためinterfaceとして定義する**

---

### Infrastructure layer（緑色）

**DBや外部クラウドサービスなどの、外界とのやり取りや制御を担う技術層**

#### Repository

- Repository interfaceを実装したオブジェクト
- **Aggregate内のデータを永続化するためのロジック**をSQLやDAO（Data Access Object）で実装する

#### QueryService

- QueryService interfaceを実装したオブジェクト
- **DBからデータ取得し、DTOに詰め込んで返す**

#### ExternalGateway

- ExternalGateway interfaceを実装したオブジェクト
- **メール送信やSlackメッセージの送信、AWSといった各種クラウドサービスの呼び出し制御**を実装する

---

### Use Case layer（オレンジ色）

**ユースケースを実行する層**

各UseCaseは**UMLユースケースと1:1の作り**になり、ユースケースのシナリオを実行する。

#### 更新系 UseCase

- UseCaseには更新系と参照系がある
- **POSTやPATCHリクエストで実行**するのが更新系
- データの作成や更新が伴う
- **Aggregateを呼び出してデータ作成・更新**し、**Repositoryでデータを永続化**する
- 必要に応じてExternalGatewayをコールする
- 例：注文ユースケース、注文キャンセルユースケース、クーポン発行ユースケース

#### 参照系 UseCase

- **GETリクエストで実行**するのが参照系
- レスポンスとして返すための**データ参照が目的**
- **QueryServiceを介してDBからデータを参照**し、返す
- 例：注文一覧取得ユースケース、ブログ記事集取得ユースケース

#### QueryService interface

- 取り扱うデータの粒度や制約は更新系と参照系で異なる
- 更新と参照を無理にひとまとめにすると混乱を招きやすい
- **DBデータ参照だけに特化**したのが本オブジェクト
- テスタビリティ向上のためinterfaceとして定義する

#### DTO (Data Transfer Object)

- QueryServiceが返すオブジェクト（**Read Model**）
- **データ参照専用**であり、レスポンスとして返すデータを詰め込む
- 更新用のドメインオブジェクトとは違いデータの正確性や更新の責任を持たないため、**ドメインオブジェクトのような制約を持たない**

#### ExternalGateway interface

- メールサービスや決済サービス、各種クラウドサービスといった外部サービスの呼び出しや制御をカプセル化するためのオブジェクト
- テスタビリティ向上のためinterfaceとして定義する

---

## 重要なポイント

1. **モデルの分離**: 更新用（ドメインオブジェクト）と参照用（DTO）でモデルを分離
2. **Interface活用**: Repository, QueryService, ExternalGatewayはinterfaceとして定義しテスタビリティを向上
3. **レイヤー責務の明確化**: 各レイヤーが持つ責務を明確に分離
4. **Domain layerの完全性**: データの正確性を維持するためのドメインオブジェクト設計

---

## エンゲージメント

- 37 リポスト
- 270 いいね
- 162 ブックマーク
- 16,200+ 閲覧
