---
title: "「先週何したっけ？」をゼロに：Obsidian + Claude Codeを業務アシスタントに"
source: "https://www.m3tech.blog/entry/2025/06/29/110000"
author:
  - "池嶋 (@mski_iksm)"
published: 2025-06-29
created: 2025-07-01
description: |
  本記事では、MarkdownエディタObsidianとAI（特にClaude Code）を連携させ、単なるメモツールを超えた「知的業務アシスタント」として活用する方法を解説する。情報の記録、検索、分析、洞察という一連のワークフローを自動化し、情報の蓄積と活用をいかに改善できるか、その具体的な実践方法を紹介する。
tags:
  - "Obsidian"
  - "Claude"
  - "AI"
  - "業務改善"
  - "メモ術"
---

![](https://cdn-ak.f.st-hatena.com/images/fotolife/m/m3tech/20250629/20250629110005.png)

AI・機械学習チームの池嶋 ([@mski\_iksm](https://x.com/mski_iksm))です。 このブログはAI・機械学習チームブログリレー 10日目の記事です。

2025年6月現在、MarkdownエディタのObsidianが注目を集めています。これはLLM（大規模言語モデル）の活用が普及し、ObsidianとAIを組み合わせることで、単なるメモツールを超えた「知的業務アシスタント」として機能するようになった点が要因の1つと言えるでしょう。従来のメモツールが「記録」に留まっていたのに対し、AIとの連携により「記録→検索→分析→洞察」という一連のワークフローが自動化されるようになりました。

この記事では、ObsidianとClaude Codeを組み合わせることで、情報の蓄積と活用がいかに改善しているか、そしてどうそれを実践しているかを紹介します。

## tl;dr

- Obsidianで日々の出来事を記録すれば、後はClaude Codeがいい感じにまとめてくれる
- コマンドラインから簡単にメモが残せるようにしたら、記録習慣が定着してきた

## 実現できるようになったこと

### 過去の情報をすぐに引き出せる

![](https://cdn-ak.f.st-hatena.com/images/fotolife/m/m3tech/20250629/20250629110008.png)

Obsidianに蓄積したメモをClaude Codeに読み込ませることで、過去の相談内容や議論を自然言語で質問できるようになりました。これにより、「先週相談したのなんだっけ？」といった情報の探索コストが大幅に削減され、複数のプロジェクトをまたぐ際のコンテキストスイッチもスムーズに行えるようになります。

### ふりかえりが簡単に

![](https://cdn-ak.f.st-hatena.com/images/fotolife/m/m3tech/20250629/20250629110013.png)

週次での振り返り作業が効率化されました。1週間分のデイリーノートとミーティング記録を基に、特定のプロンプトをClaude Codeに与えることで、振り返りメモが自動生成されます。これにより、月曜日の朝から効率的に一週間をスタートできるだけでなく、期末の360度評価などで同僚の貢献を具体的に振り返る際にも活用が期待できます。

### タスク管理もできる

![](https://cdn-ak.f.st-hatena.com/images/fotolife/m/m3tech/20250629/20250629110016.png)

様々な場面で発生する細かいタスクをObsidianで一元管理します。各ノートに書き散らしたタスクも、クエリ機能を使えば自動的に一つのリストに集約されるため、タスクの抜け漏れを防ぎ、効率的な優先順位付けが可能になります。

## どう実現しているか?

### デイリーノートの作成

1日に発生する全ての情報のハブとして、Obsidianのデイリーノート機能を活用します。テンプレート機能を使って定型フォーマットを毎日作成し、その日のミーティングや作業に関する個別ノートへのリンクを集約することで、一日の活動を一覧できるようにします。

### thinoを活用したこまめな記録

思考の断片や主観的な感想など、正式なメモには残しにくい情報を記録するために、Obsidianのプラグイン`thino`を使用します。タイムスタンプ付きでデイリーノートに記録できるこの機能を、さらに自作のシェル関数 (`th`) でコマンドラインから呼び出せるようにすることで、記録のハードルを下げ、習慣化を促進します。

```sh
# thinoコマンド
function th() {
    VAULT_NAME="Obsidian Vault"
    VAULT_PHYSICAL_PATH="${HOME}/Documents/${VAULT_NAME}"

    DAILY_NOTE_RELATIVE_PATH="デイリーノート/$(date +'%y%m%d').md"
    TEMPLATE_RELATIVE_PATH="テンプレ/dailyメモのテンプレ.md"

    DAILY_NOTE_FULL_PATH="${VAULT_PHYSICAL_PATH}/${DAILY_NOTE_RELATIVE_PATH}"
    TEMPLATE_FULL_PATH="${VAULT_PHYSICAL_PATH}/${TEMPLATE_RELATIVE_PATH}"

    if [ ! -f "$DAILY_NOTE_FULL_PATH" ]; then
        echo "デイリーノートが存在しないため、テンプレートから作成します..."
        cp "$TEMPLATE_FULL_PATH" "$DAILY_NOTE_FULL_PATH"
    fi

    CONTENT="$1"
    FORMATED_CONTENT=$'\n- '`date +'%H:%M'`' '"$CONTENT"
    echo -n $FORMATED_CONTENT >> "$DAILY_NOTE_FULL_PATH"
}
```

### 全ミーティングのメモとgemini要約の保存

Googleドキュメントで取ったミーティングメモと、Google Meetの録画機能とGeminiで自動生成した議事録を、最終的にObsidianに集約します。これにより、情報の網羅性と一元管理を実現しています。

### ObsidianとClaudeをMCP連携し、コマンドエイリアスで高速呼び出し

ObsidianとClaude Codeの連携には、MCPサーバー ([MCP Tools for Obsidian](https://github.com/jacksteamdev/obsidian-mcp-tools)) を使用します。これにより、ClaudeがObsidian内のノートを検索・分析できるようになります。さらに、利便性向上のため、簡単なコマンド (`obs`) でClaudeを呼び出せるようにシェル関数を定義します。

```sh
function obs() {
    claude -p "obsidianで次を調査:「$1」。タイトルだけでなく、本文も含めて探してください。なお、ファイル名にはYYMMDDの形式で日付が含まれています。"
}
```

### todo listの集約

Obsidianのクエリ機能を使って、すべてのノートから未完了のタスク (`- [ ]`) を自動的に抽出し、一つのノートに一覧表示します。

```query
task-todo:""
```

さらに、`進行中 ([/])` や `レビュー中 ([R])` といったカスタムステータスを定義し、より詳細なタスク管理を実現します。

```query
task-todo:"" OR line:("- [R]") OR line:("- [/]")
```

![](https://cdn-ak.f.st-hatena.com/images/fotolife/m/m3tech/20250629/20250629110019.png)

## まとめ

ObsidianとClaudeを組み合わせることで、「情報の散在」を「統合的な知識管理」へと転換できます。特に、コマンドラインからの手軽な記録など、自分に合った方法で記録を習慣化することが重要です。この記事が、情報管理に課題を感じるエンジニアの参考になれば幸いです。
