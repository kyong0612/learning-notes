---
title: "より安全で効率的な Go コードへ： Protocol Buffers Opaque API の導入"
source: "https://speakerdeck.com/shwatanap/yorian-quan-dexiao-lu-de-na-go-kodohe-protocol-buffers-opaque-api-nodao-ru"
author:
  - "[[shoyan]]"
published: 2025-09-16
created: 2025-09-18
description: |
  GoにおけるProtocol BuffersのOpaque API導入について解説した資料。従来のOpen Struct APIの課題を解決し、メモリ最適化や安全性の向上といったメリットをもたらすOpaque APIの概要と、Hybrid APIやopen2opaqueツールを用いた段階的な移行戦略を詳述する。
tags:
  - "clippings"
  - "Go"
  - "Protocol Buffers"
  - "API"
  - "gRPC"
---

## 概要

本資料は、LayerXのshoyan氏による、GoにおけるProtocol Buffersの新しいAPI「Opaque API」の導入に関する発表です。従来のOpen Struct APIが抱える課題を解決し、より安全で効率的なコードを実現するためのOpaque APIのメリットと、既存のコードベースへ段階的に移行するための戦略について解説しています。

![Slide 1](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_0.jpg)
![Slide 2](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_1.jpg)

### アジェンダ

1. **Opaque API とは何か？**
    * Protocol Buffersの基礎
    * 従来のOpen Struct APIの課題
    * Opaque APIのメリット
2. **Opaque API への段階的移行戦略**
    * Hybrid APIによる安全な移行
    * `open2opaque`ツールによる移行の半自動化
    * Build Tagsによる段階的切り替え
3. **まとめ**

![Slide 3](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_2.jpg)

## 1. Opaque API とは？

![Slide 4](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_3.jpg)

### Protocol Buffers (Protobuf) の基礎

* Googleが開発したデータシリアライゼーション形式。
* `.proto`ファイルでスキーマを定義し、各言語のコードを自動生成する。
* LayerXでは、gRPC互換のHTTP APIを構築するためにConnectと組み合わせて利用している。

![Slide 5](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_4.jpg)

### 従来のOpen Struct APIの課題

* `proto3`までのProtobufでは、生成される構造体のフィールドが`public`であり、直接アクセス可能だった。
* これにより、意図しないフィールドの変更や、将来的なProtobufの最適化（フィールドのメモリ表現変更など）による影響を受けやすいという課題があった。

![Slide 6](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_5.jpg)

### Opaque APIのメリット

* Protobufの`edition 2023`から導入された新しいAPI。
* 構造体のフィールドが`private`になり、アクセサメソッド経由でのみ操作する。

![Slide 7](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_6.jpg)

主なメリットは以下の通りです。

1. **メモリ表現の最適化に対応**:
    * PGO（Profile-Guided Optimization）などにより、使用頻度の低いフィールドを別の構造体に移動させるといった最適化が行われても、アクセサメソッドのインターフェースが変わらないため、既存コードへの影響がない。
2. **パフォーマンス向上 (Lazy Decoding)**:
    * 不要なフィールドのデコードを遅延させることで、パフォーマンスが向上する。
3. **省メモリ**:
    * フィールドの有無をポインタではなくビットフィールドで表現するため、メモリ使用量が削減される。
4. **安全性向上**:
    * ポインタによる誤った操作（nil参照など）を削減できる。

![Slide 8](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_7.jpg)
![Slide 9](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_8.jpg)

## 2. Opaque API への段階的移行

![Slide 10](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_9.jpg)

大規模なプロジェクトでは、数百の`.proto`ファイルが存在し、複数のマイクロサービスで共有されているため、一度に全てのAPIを移行するのは現実的ではありません。レビューや品質保証のコスト、チーム間の調整の困難さが伴います。

そこで、`Hybrid API`と`open2opaque`ツールを用いた段階的な移行が推奨されます。

![Slide 11](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_10.jpg)

### 移行手順

移行は以下の3ステップで行います。

1. `open2opaque setup`で**Hybrid API**を有効にする。
2. `open2opaque rewrite`で既存コードを**Builderパターン**に書き換える。
3. `open2opaque setup`で**Opaque API**を有効にする。

![Slide 12](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_11.jpg)
![Slide 13](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_12.jpg)

### Step 1: Hybrid API を有効にする

* `open2opaque setapi -api HYBRID ./...`コマンドを実行します。
* これにより、`.proto`ファイルにオプションが追加されます。
* コード生成時には、**Build Tags** (`//go:build protoopaque`) を利用して、従来の`public`フィールドを持つコードと、新しい`private`フィールドを持つコードの両方が生成されます。
* また、Builderパターンを実現するための構造体（`XXX_builder`）とSetterメソッドが共通で追加され、フィールドがpublicかprivateかを隠蔽します。これにより、後続のステップで段階的な移行が可能になります。

![Slide 14](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_13.jpg)
![Slide 15](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_14.jpg)
![Slide 16](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_15.jpg)
![Slide 17](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_16.jpg)
![Slide 18](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_17.jpg)
![Slide 19](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_18.jpg)

### Step 2: Builder パターンへの書き換え

![Slide 20](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_19.jpg)

* `open2opaque rewrite ./...`コマンドを実行します。
* これにより、構造体を直接初期化していたコードが、Step 1で生成された`XXX_builder`と`Build()`メソッドを使う形式に自動で書き換えられます。
* この段階で、**Build Tags** (`-tags=protoopaque`) を使ってコンパイル対象を切り替えることで、Opaque APIへ移行した場合のテストを安全に行うことができます。
  * `go build ./...`: Open Struct APIでビルド（本番環境）
  * `go build -tags=protoopaque ./...`: Opaque APIでビルド（テスト環境）

![Slide 21](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_20.jpg)
![Slide 22](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_21.jpg)

### Step 3: Opaque API を有効にする

![Slide 23](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_22.jpg)

* `open2opaque setapi -api OPAQUE ./...`コマンドを実行します。
* これにより、従来のOpen Struct API (`xxx.pb.go`) のコードが完全に削除され、Opaque APIのコードに置き換わります。
* これでOpaque APIへの移行は完了です。

![Slide 24](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_23.jpg)

## 3. まとめ

![Slide 25](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_24.jpg)

* **Opaque API**:
  * フィールドを`private`にし、アクセサメソッド経由で操作する。
  * メモリ最適化、Lazy Decodingによるパフォーマンス向上、ポインタ操作の削減による安全性向上といったメリットがある。
* **段階的移行**:
  * `Hybrid API`で両方のコードを生成し、互換性を保ちながら移行を進める。
  * `open2opaque`ツールで書き換えを半自動化する。
  * `Build Tags`により、部分的に移行後の品質を検証しながら安全に進めることができる。

![Slide 26](https://files.speakerdeck.com/presentations/9493ef5fbf6847468547030f48116aec/slide_25.jpg)
