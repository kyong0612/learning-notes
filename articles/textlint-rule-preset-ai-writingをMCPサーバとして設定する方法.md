---
title: "textlint-rule-preset-ai-writingをMCPサーバとして設定する方法"
source: "https://zenn.dev/karaage0703/articles/e68ee90ca00b0d"
author:
  - "からあげ"
published: 2025-07-07
created: 2025-07-09
description: |
  AI生成文章の典型的なパターンを検出するtextlint-rule-preset-ai-writingをMCPサーバとして設定する手順です。
tags:
  - "textlint"
  - "Model Context Protocol"
  - "idea"
---

AIが生成した文章の典型的なパターンを検出するtextlintルールセット `textlint-rule-preset-ai-writing` をMCP（Model Context Protocol）サーバとして設定する手順を解説します。macOSとClaude Code環境を例にしていますが、他の環境でも応用可能です。

## `textlint-rule-preset-ai-writing` の単体設定

まず、MCPサーバとして設定する前に、単体で動作確認を行います。

### 1. パッケージのインストール

`npm` を使用して、textlintとルールセットをインストールします。

```sh
npm install textlint textlint-rule-preset-ai-writing
```

### 2. textlint設定ファイルの作成

プロジェクトのルートに `.textlintrc.json` ファイルを作成し、以下の内容を記述します。

```json
{
  "rules": {
    "textlint-rule-preset-ai-writing": true
  }
}
```

技術文書向けのルールセット `textlint-rule-preset-ja-technical-writing` も追加することで、より高度なチェックが可能です。

### 3. 単体動作確認

AIが生成したような文章を含む `test_ai_document.md` を作成し、以下のコマンドでtextlintを実行します。

```sh
npx textlint test_ai_document.md
```

AI特有の表現が検出されれば、動作確認は完了です。

```
✖ 5 problems (3 errors, 0 warnings, 2 infos)
```

## `textlint-rule-preset-ai-writing` MCPサーバの設定

### 1. JSONファイル設定

各種AIコーディングツール（Cline/Cursor/Claude Desktopなど）のMCP設定ファイルに、以下の設定を追加します。

```json
{
  "mcpServers": {
    "textlint": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "textlint",
        "--mcp"
      ]
    }
  }
}
```

Claude Codeの場合は、以下のコマンドで簡単に追加できます。

```sh
claude mcp add textlint -s project -- npx textlint --mcp
```

設定後は、MCPホストを再起動して設定を反映させます。

### 2. MCPサーバの動作確認

Claude Codeで、textlintを実行したいファイルに対して以下のようなプロンプトを送信します。

> test\_ai\_document.mdをtextlintで修正してください

MCPサーバが正しく設定されていれば、AIが自動で文章を修正します。

![](https://storage.googleapis.com/zenn-user-upload/d143d24cd21c-20250707.png)

## まとめ

本記事では、`textlint-rule-preset-ai-writing` のセットアップからMCPサーバとしての設定、使用方法までを解説しました。

筆者は、AIが生成したコードのREADMEなど、AI臭さが気になるドキュメントの修正にこの仕組みが有効だと述べています。ただし、textlintによる修正は表層的なものであり、「やっておくと良いかな？」程度の位置づけであるとも付け加えています。

## 参考リンク

- [VS Codeでtextlint serverを動かして文章校正する](https://zenn.dev/hibara428/articles/a4235e23f04110)
