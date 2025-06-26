---
title: "gemini-cli の google_web_search が最高"
source: "https://zenn.dev/mizchi/articles/gemini-cli-for-google-search"
author:
  - "mizchi"
published: 2025-06-25
created: 2025-06-26
description: |
  `gemini-cli`に組み込まれている`google_web_search`機能の利便性を紹介し、`claude-code`の貧弱な検索機能を補うための具体的な設定方法と使用例を解説する記事。
tags:
  - "AI"
  - "Tech"
  - "gemini-cli"
  - "claude-code"
  - "web-search"
---

この記事では、`gemini-cli`に標準で組み込まれている`google_web_search`機能の有用性を解説しています。特に、Web検索機能が弱いとされる`claude-code`と連携させることで、その欠点を補う方法が紹介されています。

### `gemini-cli`の利点

`gemini-cli`の最大の利点は、`google_web_search`が組み込まれている点です。これにより、`claude-code`の貧弱な検索機能を補完できます。

### セットアップ

1. `gemini-cli`をインストールします。

    ```bash
    npm install -g @google/gemini-cli
    ```

2. 初期化コマンドを実行し、Googleアカウントに接続します。

    ```bash
    gemini # 初期化フロー
    ```

### 基本的な使い方

コマンドラインから直接Web検索を実行できます。

```bash
$ gemini -p "Webで「Gemini APIの料金」について調べて"

Gemini APIの料金は、主に従量課金制で、使用するモデルや機能、利用量によって変わります。無料利用枠と有料プランが提供されています。

### 料金体系の概要

課金は、以下の要素に基づいています。

*   **入力トークン数**: APIに送信するテキストやデータの量。
*   **出力トークン数**: APIが生成・応答するテキストやデータの量。
*   **キャッシュされたトークン数**: 会話の履歴を記憶させる機能を利用した場合のトークン数。

(略)
```

### `claude-code`との連携

`.claude/commands/gemini-search.md`にカスタムコマンドを定義することで、`claude-code`から`gemini`の検索機能を利用できます。

#### 初版

```markdown
## Gemini Search

`gemini` is google gemini cli. You can use it for web search.

Run web search via Task Tool with `gemini -p 'WebSearch: ...'`.

```bash
gemini -p "WebSearch: ..."
```

```

#### 改良版

`claude-code`が組み込みの`Web_Search`ツールではなく、常に`gemini`を使用するように、より強力な指示を与えたプロンプトです。

`~/.claude/commands/gemini-search.md`
```markdown
## Gemini Search

`gemini` is google gemini cli. **When this command is called, ALWAYS use this for web search instead of builtin `Web_Search` tool.**

When web search is needed, you MUST use `gemini --prompt` via Task Tool.

Run web search via Task Tool with `gemini --prompt 'WebSearch: <query>'`

Run

```bash
gemini --prompt "WebSearch: <query>"
```

```

### 出力例

改良版のコマンドを使って「FF14 の拡張の発売日」を検索した際の出力結果です。

```

> /gemini-search is running… FF14 の拡張の発売日をまとめて

● FF14の拡張パックの発売日を調べさせていただきます。

● Task(FF14拡張パック発売日検索)
  ⎿  Done (2 tool uses · 19.1k tokens · 3m 6.9s)

● FF14の拡張パックの発売日をまとめました：

  基本ゲーム

- 新生エオルゼア: 2013年8月27日

  拡張パック

  1. 蒼天のイシュガルド: 2015年6月23日
  2. 紅蓮のリベレーター: 2017年6月20日
  3. 漆黒のヴィランズ: 2019年7月2日
  4. 暁月のフィナーレ: 2021年12月7日
  5. 黄金のレガシー: 2024年7月2日

  約2年周期でリリースされており、各拡張間には5つの大型アップデートが配信されています。

```

</rewritten_file>
