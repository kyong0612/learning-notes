---
title: "microsoft/poml: Prompt Orchestration Markup Language"
source: "https://github.com/microsoft/poml?tab=readme-ov-file"
author:
  - "Microsoft"
published:
created: 2025-08-13
description: |
  POML (Prompt Orchestration Markup Language) is a novel markup language designed to bring structure, maintainability, and versatility to advanced prompt engineering for Large Language Models (LLMs). It addresses common challenges in prompt development, such as lack of structure, complex data integration, format sensitivity, and inadequate tooling.
tags:
  - "prompt"
  - "markup-language"
  - "vscode-extension"
  - "llm"
  - "poml"
---

# POML: Prompt Orchestration Markup Language

[![Documentation](https://camo.githubusercontent.com/a0a9dc870d6674453dbb2a0e33dc8f1659744c06b0c5ac5d53f97abd807c8018/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646f63732d6d6963726f736f66742e6769746875622e696f2d626c7565)](https://microsoft.github.io/poml/)
[![VSCode Extension](https://camo.githubusercontent.com/0fd6bd213240ecda18ac698f4287db693dd49c40c3a4eda0f5136a7f2ed8926c/68747470733a2f2f696d672e736869656c64732e696f2f76697375616c2d73747564696f2d6d61726b6574706c6163652f762f706f6d6c2d7465616d2e706f6d6c)](https://marketplace.visualstudio.com/items?itemName=poml-team.poml)
[![PyPI](https://camo.githubusercontent.com/fb9ac1d7ae1a3a38413347e7387e88fbc9e51155215471eb7d3b6fd405bcc4cf/68747470733a2f2f696d672e736869656c64732e696f2f707970692f762f706f6d6c)](https://pypi.org/project/poml/)
[![npm (latest)](https://camo.githubusercontent.com/90e66af69e725998ac57f08f83ae4972cd25fcabe66893a31f264a44fa428f88/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f706f6d6c6a73)](https://www.npmjs.com/package/pomljs)
[![Test Status](https://github.com/microsoft/poml/actions/workflows/test.yml/badge.svg)](https://github.com/microsoft/poml/actions/workflows/test.yml)
[![License: MIT](https://camo.githubusercontent.com/6cd0120cc4c5ac11d28b2c60f76033b52db98dac641de3b2644bb054b449d60c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)](https://opensource.org/licenses/MIT)

**POML (Prompt Orchestration Markup Language)** は、大規模言語モデル（LLM）向けの高度なプロンプトエンジニアリングに、構造、保守性、多様性をもたらすために設計された新しいマークアップ言語です。構造の欠如、複雑なデータ統合、フォーマットの感度、不十分なツールといった、プロンプト開発における一般的な課題に対処します。POMLは、プロンプトコンポーネントを体系的に整理し、多様なデータ型をシームレスに統合し、プレゼンテーションのバリエーションを管理する体系的な方法を提供し、開発者がより洗練された信頼性の高いLLMアプリケーションを作成できるようにします。

## デモビデオ

[![The 5-minute guide to POML](https://camo.githubusercontent.com/91c3ae3df86c06d8063c50e7672eda30c45e0eda1faa1dcc404c2271af82b0b6/68747470733a2f2f69332e7974696d672e636f6d2f76692f623957446346734b69786f2f6d617872657364656661756c742e6a7067)](https://youtu.be/b9WDcFsKixo)

## 主な機能

* **構造化されたプロンプティングマークアップ**: `<role>`、`<task>`、`<example>`などのセマンティックコンポーネントを持つHTMLライクな構文を採用し、モジュラーデザインを奨励し、プロンプトの読みやすさ、再利用性、保守性を向上させます。
* **包括的なデータ処理**: テキストファイル、スプレッドシート、画像などの外部データソースをシームレスに埋め込んだり参照したりする、専門のデータコンポーネント（例：`<document>`、`<table>`、`<img>`）を組み込んでおり、カスタマイズ可能なフォーマットオプションを備えています。
* **分離されたプレゼンテーションスタイリング**: コンテンツとプレゼンテーションを分離するCSSライクなスタイリングシステムを特徴としています。これにより、開発者はコアなプロンプトロジックを変更することなく、`<stylesheet>`定義やインライン属性を介してスタイリング（例：冗長性、構文フォーマット）を変更でき、LLMのフォーマット感度を軽減します。
* **統合されたテンプレートエンジン**: 変数（`{{ }}`）、ループ（`for`）、条件分岐（`if`）、変数定義（`<let>`）をサポートする組み込みのテンプレートエンジンを含み、データ駆動型の複雑なプロンプトを動的に生成します。
* **豊富な開発ツールキット**:
  * **IDE拡張機能（Visual Studio Code）**: 構文ハイライト、文脈に応じたオートコンプリート、ホバードキュメント、リアルタイムプレビュー、エラーチェックのためのインライン診断、統合されたインタラクティブテストなど、必須の開発支援を提供します。
  * **ソフトウェア開発キット（SDK）**: Node.js（JavaScript/TypeScript）およびPython向けのSDKを提供し、さまざまなアプリケーションワークフローや人気のLLMフレームワークへのシームレスな統合を実現します。

## クイックスタート

これは非常にシンプルなPOMLの例です。`example.poml`という名前のファイルに保存してください。`photosynthesis_diagram.png`画像ファイルと同じディレクトリにあることを確認してください。

```poml
<poml>
  <role>You are a patient teacher explaining concepts to a 10-year-old.</role>
  <task>Explain the concept of photosynthesis using the provided image as a reference.</task>

  <img src="photosynthesis_diagram.png" alt="Diagram of photosynthesis" />

  <output-format>
    Keep the explanation simple, engaging, and under 100 words.
    Start with "Hey there, future scientist!".
  </output-format>
</poml>
```

この例では、LLMのロールとタスクを定義し、コンテキスト用の画像を含め、望ましい出力形式を指定しています。POMLツールキットを使用すると、プロンプトを柔軟な形式で簡単にレンダリングし、ビジョンLLMでテストできます。

## インストール

### Visual Studio Code 拡張機能

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=poml-team.poml)からインストールします。

[GitHubリリース](https://github.com/microsoft/poml/releases)ページから`.vsix`ファイルをダウンロードし、VS Codeの拡張機能ビューから手動でインストールすることもできます。

POMLツールキットでプロンプトをテストする前に、優先するLLMモデル、APIキー、およびエンドポイントを設定していることを確認してください。これらが設定されていない場合、プロンプトテストは機能しません。

**Visual Studio Codeでの設定方法:**

* 拡張機能の設定を開きます（「設定」を開き、「POML」を検索）。
* POMLセクションで、モデルプロバイダー（例：OpenAI、Azure、Google）、APIキー、およびエンドポイントURLを設定します。
* または、これらの設定を直接`settings.json`ファイルに追加することもできます。

### Node.js (npm経由)

```shell
npm install pomljs
```

### Python (pip経由)

```shell
pip install poml
```

開発またはローカルインストールの場合は、クローンしたリポジトリから`pip install -e .`を使用することがあります。

**ナイトリービルドのインストールに関する詳細は[ドキュメント](https://microsoft.github.io/poml)を参照してください。**

## ドキュメント

POMLの構文、コンポーネント、スタイリング、テンプレート、SDK、およびVS Code拡張機能に関する詳細情報については、[ドキュメント](https://microsoft.github.io/poml)を参照してください。

## さらに詳しく

* **YouTubeのデモビデオを見る:** [POML Introduction & Demo](https://youtu.be/b9WDcFsKixo)
* **研究論文を読む（近日公開）:** POMLの設計、実装、評価についての詳細な理解のために、私たちの論文をご覧ください：[Paper link TBD](/microsoft/poml/blob/main/TBD).

## 貢献

このプロジェクトは貢献と提案を歓迎します。ほとんどの貢献では、貢献者が自身の貢献を使用する権利を当社に許諾することを宣言する貢献者ライセンス契約（CLA）に同意する必要があります。詳細については、<https://cla.opensource.microsoft.com>をご覧ください。

プルリクエストを送信すると、CLAボットが自動的にCLAを提供する必要があるかどうかを判断し、PRを適切に装飾します（例：ステータスチェック、コメント）。ボットが提供する指示に従ってください。これは、当社のCLAを使用するすべてのリポジトリで一度だけ行う必要があります。

このプロジェクトは[Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)を採用しています。詳細については、[Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)を参照するか、追加の質問やコメントがあれば<opencode@microsoft.com>までお問い合わせください。

## 商標

このプロジェクトには、プロジェクト、製品、またはサービスに関する商標またはロゴが含まれている場合があります。Microsoftの商標またはロゴの承認された使用は、[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general)に従う必要があります。このプロジェクトの変更版でのMicrosoftの商標またはロゴの使用は、混乱を招いたり、Microsoftの後援を暗示したりしてはなりません。第三者の商標またはロゴの使用は、それらの第三者の方針に従います。

## Responsible AI

このプロジェクトは、Microsoft Responsible AI Standardに準拠していることが評価および認定されています。チームはリポジトリを継続的に監視および保守し、潜在的な危害を含む重大な問題が発生した場合には対処します。詳細については、[Responsible AI Readme](/microsoft/poml/blob/main/RAI_README)を参照してください。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については、[LICENSE](/microsoft/poml/blob/main/LICENSE)ファイルを参照してください。
