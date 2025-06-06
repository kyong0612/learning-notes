---
title: Rules
source: https://docs.cursor.com/context/rules
author:
published:
created: 2025-04-16
description: |
  Cursorのルール機能は、エージェントやCmd-K AIに対してシステムレベルのガイダンスを提供する方法です。これはコンテキスト、設定、ワークフローを永続的にエンコードする手段として機能します。
tags:
  - Cursor
  - AI
  - LLM
  - Rules
  - Context
  - Prompt Engineering
---

# Rules

ref: <https://docs.cursor.com/context/rules>

## 概要

Cursorのルール機能は、エージェントやCmd-K AIに対してシステムレベルのガイダンスを提供する方法です。これはコンテキスト、設定、ワークフローを永続的にエンコードする手段として機能します。

## ルールの種類

Cursorでは3種類のルールがサポートされています：

1. **プロジェクトルール**
   - `.cursor/rules`ディレクトリに保存
   - バージョン管理され、コードベースに限定される

2. **ユーザールール**
   - Cursor環境全体に適用されるグローバルなルール
   - 設定で定義され、常に適用される

3. **.cursorrules（レガシー）**
   - 引き続きサポートされていますが、非推奨
   - プロジェクトルールへの移行が推奨

## ルールの仕組み

大規模言語モデルは完了間でメモリを保持しません。ルールはプロンプトレベルで永続的で再利用可能なコンテキストを提供することでこの問題を解決します。

ルールが適用されると、その内容がモデルコンテキストの先頭に含まれます。これによりAIはコード生成、編集の解釈、ワークフローの支援などで一貫したガイダンスを得られます。

![ルールがチャットコンテキストに適用されている様子](https://mintlify.s3.us-west-1.amazonaws.com/cursor/images/context/rules/rules-applied.png)

ルールは[チャット](https://docs.cursor.com/chat/overview)と[Cmd K](https://docs.cursor.com/cmdk/overview)の両方に適用されます。

## プロジェクトルール

プロジェクトルールは`.cursor/rules`に存在し、各ルールはファイルとして保存されバージョン管理されます。これらはパスパターンによってスコープ設定でき、手動で呼び出したり、関連性に基づいて含めたりできます。

プロジェクトルールの用途：

- コードベースに関するドメイン固有の知識のエンコード
- プロジェクト固有のワークフローやテンプレートの自動化
- スタイルやアーキテクチャの決定の標準化

### ルール構造

各ルールファイルは**MDC**（`.mdc`）形式で書かれ、以下のタイプがサポートされています：

| ルールタイプ | 説明 |
| --- | --- |
| `Always` | 常にモデルコンテキストに含まれる |
| `Auto Attached` | globパターンに一致するファイルが参照されるとき含まれる |
| `Agent Requested` | AIが利用可能で、AIが含めるかどうかを決定。説明が必要 |
| `Manual` | `@ruleName`を使って明示的に言及されたときのみ含まれる |

![CursorのルールエディターUI](https://mintlify.s3.us-west-1.amazonaws.com/cursor/images/context/rules/mdc-editor.png)

#### MDCルールの例

```
---
description: RPC Service boilerplate
globs:
alwaysApply: false
---

- Use our internal RPC pattern when defining services
- Always use snake_case for service names.

@service-template.ts
```

`@service-template.ts`のような参照ファイルは、ルールがトリガーされたとき追加のコンテキストとして含まれます。

Cursor内から`Cmd + Shift + P` > "New Cursor Rule"を使用して、ルールを素早く作成できます。

### ルールの作成

`New Cursor Rule`コマンドを使用するか、`Cursor Settings > Rules`に移動してルールを作成できます。これにより`.cursor/rules`ディレクトリに新しいルールファイルが作成されます。設定からすべてのルールとそのステータスのリストも確認できます。

![簡潔なルールと長いルールの比較](https://mintlify.s3.us-west-1.amazonaws.com/cursor/images/context/rules/rule-settings.png)

## ベストプラクティス

良いルールは焦点が絞られ、実行可能で、適切なスコープを持ちます：

- ルールは簡潔に。500行未満が良い目標
- 大きな概念は複数の構成可能なルールに分割する
- 役立つ場合は具体的な例や参照ファイルを提供する
- 曖昧なガイダンスを避ける。明確な内部ドキュメントを書くような方法でルールを書く
- チャットでプロンプトを繰り返すことに気づいたら、ルールを再利用する

## 例

### ドメイン固有のガイダンス

- フロントエンドコンポーネントのスタイリングやアニメーションの標準
- APIエンドポイントの検証標準

### ボイラープレートとテンプレート

- Expressサービスのテンプレート
- Reactコンポーネントのテンプレート

### ワークフロー自動化

- アプリ分析ワークフローの自動化
- ドキュメント生成の支援

### Cursorコードベースからの例

Cursorが内部で使用するルール：

- CursorでのTailwindの使用
- Cursorに新しい設定を追加する方法

## ユーザールール

ユーザールールは**Cursor Settings > Rules**で定義されます。

すべてのプロジェクトに適用され、常にモデルコンテキストに含まれます。

ユーザールールの用途：

- 応答言語やトーンの設定
- 個人的なスタイル設定の追加

**例：**

```
Please reply in a concise style. Avoid unnecessary repetition or filler language.
```

ユーザールールはMDCをサポートせず、プレーンテキストのみです。

## チームルール

現在、プロジェクト間でルールを共有するための組み込み方法はありません。

チームプロジェクト間で参照できる共有MDC形式のルールをサポートする予定です。それまでは：

- 共有ルールを専用リポジトリに保存
- 各プロジェクトの`.cursor/rules`ディレクトリにコピーまたはシンボリックリンクを作成

## `.cursorrules`（レガシー）

プロジェクトのルートにある`.cursorrules`ファイルは引き続きサポートされていますが、非推奨となります。より多くの制御、柔軟性、可視性を得るためにプロジェクトルール形式への移行が推奨されます。

## FAQ

**ルールが適用されない理由は？**
ルールタイプを確認してください。`Agent Requested`の場合、説明が定義されていることを確認してください。`Auto Attached`の場合、ファイルパターンが参照ファイルと一致することを確認してください。

**ルールは他のルールやファイルを参照できますか？**
はい。`@filename.ts`を使用してファイルをルールのコンテキストに含めることができます。

**チャットからルールを作成できますか？**
はい。AIに「これをルールに変換して」または「このプロンプトから再利用可能なルールを作成して」と依頼できます。

**ルールはCursor Tabやその他のAI機能に影響しますか？**
いいえ。ルールはエージェントとCmd-K AIモデルにのみ提供されます。
