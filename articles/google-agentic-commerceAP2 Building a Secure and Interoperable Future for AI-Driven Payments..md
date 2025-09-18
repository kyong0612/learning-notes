---
title: "google-agentic-commerce/AP2: Building a Secure and Interoperable Future for AI-Driven Payments."
source: "https://github.com/google-agentic-commerce/AP2"
author:
  - "holtskinner"
  - "mdoeseckle"
  - "zeroasterisk"
published: 2025-09-16
created: 2025-09-18
description: |
  このリポジトリには、AI駆動の決済のための安全で相互運用可能な未来を構築することを目的とした、エージェント決済プロトコル（AP2）のコードサンプルとデモが含まれています。
tags:
  - "payments"
  - "agents"
  - "a2a"
  - "generative-ai"
  - "gen-ai"
  - "agentic-ai"
  - "AI"
---

# エージェント決済プロトコル (AP2)

[![Apache License](https://camo.githubusercontent.com/5ce2e21e84680df1ab24807babebc3417d27d66e0826a350eb04ab57f4c8f3e5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4170616368655f322e302d626c75652e737667)](https://github.com/google-agentic-commerce/AP2/blob/main/LICENSE)
[![Ask DeepWiki](https://camo.githubusercontent.com/e7d4bb1a32530e373bb53fbe8eea825440ad27c7531d8f144d561acdd20c093a/68747470733a2f2f6465657077696b692e636f6d2f62616467652e737667)](https://deepwiki.com/google-agentic-commerce/AP2)

[![Agent Payments Protocol Graphic](https://github.com/google-agentic-commerce/AP2/raw/main/docs/assets/ap2_graphic.png)](https://github.com/google-agentic-commerce/AP2/blob/main/docs/assets/ap2_graphic.png)

このリポジトリには、エージェント決済プロトコルのコードサンプルとデモが含まれています。

## AP2紹介ビデオ

[![A2A Intro Video](https://camo.githubusercontent.com/d362b97bffb46dc68dfe3d393de6a62579d59e1566ccfca002cbf1f5d530e0cb/68747470733a2f2f696d672e796f75747562652e636f6d2f76692f794c5470336963326a35632f687164656661756c742e6a7067)](https://goo.gle/ap2-video)

## サンプルについて

これらのサンプルでは、[Agent Development Kit (ADK)](https://google.github.io/adk-docs/) と Gemini 2.5 Flash を使用しています。

エージェント決済プロトコルは、これらのいずれの使用も必須ではありません。サンプルではこれらを使用していますが、エージェントを構築するために好みのツールを自由に使用できます。

## リポジトリのナビゲーション

**`samples`** ディレクトリには、エージェント決済プロトコルの主要なコンポーネントを実証するための一連のキュレーションされたシナリオが含まれています。

シナリオは [`samples/android/scenarios`](https://github.com/google-agentic-commerce/AP2/blob/main/samples/android/scenarios) と [`samples/python/scenarios`](https://github.com/google-agentic-commerce/AP2/blob/main/samples/python/scenarios) ディレクトリにあります。

各シナリオには以下が含まれています：

* シナリオを説明し、実行手順を記載した `README.md` ファイル。
* シナリオをローカルで実行するプロセスを簡素化する `run.sh` スクリプト。

このデモンストレーションでは、さまざまなエージェントとサーバーが登場し、ほとんどのソースコードは [`samples/python/src`](https://github.com/google-agentic-commerce/AP2/blob/main/samples/python/src) にあります。ショッピングアシスタントとしてAndroidアプリを使用するシナリオのソースコードは [`samples/android`](https://github.com/google-agentic-commerce/AP2/blob/main/samples/android) にあります。

## クイックスタート

### 前提条件

* Python 3.10以上

### セットアップ

[Google AI Studio](http://aistudio.google.com/apikey) からGoogle APIキーを取得していることを確認してください。次に、`GOOGLE_API_KEY` 変数を2つの方法のいずれかで宣言します。

1. 環境変数として宣言する：

    ```
    export GOOGLE_API_KEY=your_key
    ```

2. リポジトリのルートにある `.env` ファイルに記述する：

    ```
    echo "GOOGLE_API_KEY=your_key" > .env
    ```

### シナリオの実行方法

特定のシナリオを実行するには、その `README.md` の指示に従ってください。通常は次のパターンになります：

1. リポジトリのルートに移動する。

    ```
    cd AP2
    ```

2. 実行スクリプトを実行して依存関係をインストールし、エージェントを起動する。

    ```
    bash samples/python/scenarios/your-scenario-name/run.sh
    ```

3. ショッピングエージェントのURLにアクセスして対話を開始する。

### AP2 Typesパッケージのインストール

プロトコルのコアオブジェクトは `src/ap2/types` ディレクトリで定義されています。PyPIパッケージは後日公開される予定です。それまでは、次のコマンドを使用してtypesパッケージを直接インストールできます：

```
uv pip install git+https://github.com/google-agentic-commerce/AP2.git@main
```
