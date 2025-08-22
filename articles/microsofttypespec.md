---
title: "microsoft/typespec"
source: "https://github.com/microsoft/typespec"
author:
  - "microsoft"
published:
created: 2025-08-22
description: |
  TypeSpec is a language for defining cloud service APIs and shapes. It is highly extensible and can describe API shapes common among REST, OpenAPI, gRPC, and other protocols, serving as a single source of truth for generating various assets like API descriptions, code, and documentation.
tags:
  - "typespec"
  - "openapi3"
  - "json-schema"
  - "protobuf"
  - "api"
---

## TypeSpec: クラウドサービスAPI定義言語

[公式ドキュメント](https://typespec.io/) | [オンラインで試す](https://aka.ms/trytypespec) | [スタートガイド](https://typespec.io/docs) | [言語概要](https://typespec.io/docs/language-basics/overview)

TypeSpecは、クラウドサービスのAPIとデータ形状（シェイプ）を定義するための言語です。REST, OpenAPI, gRPCなど、様々なプロトコルで共通して使われるAPIの形状を記述できる、拡張性の高いプリミティブを備えています。

TypeSpecの定義を信頼できる唯一の情報源（Single Source of Truth）として利用することで、多様なAPI記述フォーマット、クライアント/サービスコード、ドキュメントなどのアセットを効率的に生成できます。

### 主な特徴

* **再利用可能なパターン**: APIのあらゆる側面に関するパターンを再利用可能な形で作成し、ライブラリとしてパッケージ化できます。これにより、API設計者はベストプラクティスに沿った開発を容易に行うための「ガードレール」を設けることができます。
* **品質維持のフレームワーク**: TypeSpecには、アンチパターンを検出するための豊富なリンターフレームワークや、意図したパターンに従った出力を保証するエミッターフレームワークが備わっています。

### インストール

TypeSpecコンパイラはnpm経由でグローバルにインストールします。

```bash
npm install -g @typespec/compiler
```

#### 開発ツール

Visual Studio CodeとVisual Studio向けの拡張機能も提供されています。

* **VS Code拡張機能**:

    ```bash
    tsp code install
    ```

* **Visual Studio拡張機能**:

    ```bash
    tsp vs install
    ```

### 基本的な使用法: OpenAPI 3.0の生成例

`@typespec/http`, `@typespec/rest`, `@typespec/openapi3`ライブラリを使用して、基本的なRESTサービスを定義し、OpenAPI 3.0ドキュメントを生成する例です。

1. **プロジェクトの初期化**:
    次のコマンドを実行し、「Generic REST API」を選択します。

    ```bash
    tsp init
    ```

2. **APIの定義**:
    `main.tsp`に以下の内容を記述します。

    ```typescript
    import "@typespec/http";
    import "@typespec/rest";
    import "@typespec/openapi3";

    using Http;
    using Rest;

    /** This is a pet store service. */
    @service(#{ title: "Pet Store Service" })
    @server("https://example.com", "The service endpoint")
    namespace PetStore;

    @route("/pets")
    interface Pets {
      list(): Pet[];
    }

    model Pet {
      @minLength(100)
      name: string;

      @minValue(0)
      @maxValue(100)
      age: int32;

      kind: "dog" | "cat" | "fish";
    }
    ```

3. **依存関係のインストール**:

    ```bash
    tsp install
    ```

4. **OpenAPI 3.0へのコンパイル**:

    ```bash
    tsp compile main.tsp --emit @typespec/openapi3
    ```

    コンパイル後、`./tsp-output/openapi.json` にOpenAPIドキュメントが出力されます。

### 主要なパッケージ

TypeSpecはコア機能とライブラリ、ツール群から構成されています。

| パッケージ名                               | 説明                                     |
| ------------------------------------------ | ---------------------------------------- |
| `@typespec/compiler`                       | TypeSpecのコアコンパイラ                   |
| `@typespec/http`                           | HTTPプロトコル向けのライブラリ           |
| `@typespec/rest`                           | RESTful API向けのライブラリ              |
| `@typespec/openapi3`                       | OpenAPI 3.0を生成するためのライブラリ    |
| `@typespec/versioning`                     | APIのバージョニングを扱うためのライブラリ |
| `@typespec/prettier-plugin-typespec`       | Prettier用のフォーマッタプラグイン         |
| `typespec-vscode` / `typespec-vs`          | エディタ・IDE向けの拡張機能              |
