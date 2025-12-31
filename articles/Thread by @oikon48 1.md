---
title: "Thread by @oikon48"
source: "https://x.com/oikon48/status/2005803922167083152?s=12"
author:
  - "[[@oikon48]]"
published: 2025-12-29
created: 2025-12-31
description: "Claude CodeでMCPツールを動的にロードする実験的機能についての検証レポート。ENABLE_TOOL_SEARCH=trueを設定することで、MCPツールが必要時にのみロードされ、コンテキストウィンドウを33%増加させることができる。"
tags:
  - "clippings"
  - "claude-code"
  - "mcp"
  - "context-window"
  - "performance-optimization"
---
**Oikon** @oikon48 2025-12-29

Claude CodeでMCPツールを動的にロードする機能が、βリリースとして使えるというポストを見たので試してみた。

・ENABLE\_TOOL\_SEARCH=true

・ENABLE\_EXPERIMENTAL\_MCP\_CLI=false

上記２つの環境変数を設定すればお試しできる。

実際に試してみると MCPツールのコンテキストが0になり、使う時に動的にロードされることが確認できた(次のポスト)。近いうちにClaude Codeのリリースに入りそう。

Thank you for huge information @sdrzn !

> 2025-12-29
> 
> huge: claude code added an experimental feature that loads mcp tools on-demand, personally giving me 33% more context window each session!
> 
> before, all mcp servers tool definitions were added to the system prompt, so in my case with slack, linear, notion, context7, and chrome it
> 
> ![Image](https://pbs.twimg.com/media/G9YK1_oaYAAJ29K?format=jpg&name=large)

---

**Oikon** @oikon48 [2025-12-30](https://x.com/oikon48/status/2005804684771221659)

実際に動的にMCPサーバーをロードしてみている様子

Context7でccusageについて調べてみてもらったところ、\`MCPSearch\`がまず最初に実行され、Context7を発見して実行している。一度ロードされたcontext7は解放されず、コンテキストウィンドウに残ることも確認した。

https://github.com/anthropics/claude-code/issues/12836#issuecomment-3656762362…

![Image](https://pbs.twimg.com/media/G9YMJ7NaYAM_9fN?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/G9YMijibMAAoDj-?format=jpg&name=large)

---

**Oikon** @oikon48 [2025-12-30](https://x.com/oikon48/status/2005824692918313094)

❌MCPサーバー

⭕️MCPツール

---

**Humberto Prado** @this\_is\_beto [2025-12-30](https://x.com/this_is_beto/status/2005809215290384780)

I really needed it! MCP tools · /mcp (loaded on-demand) great!!

---

**Oikon** @oikon48 [2025-12-30](https://x.com/oikon48/status/2005809641662382470)

This was a great solution! :)

---

**hiromi maeo** @enhanced\_jp [2025-12-30](https://x.com/enhanced_jp/status/2005918317949903302)

これはホント早くリリースしてほしい機能です。

---

**ZOZOTOWN** @zozojp

／

Spotifyまとめ2025 in ZOZOVILLA

今年を彩った楽曲が9種類のTシャツになって登場！

＼

販売は2026/1/13(火) 11:59まで！

スペシャルなアイテムをお見逃しなく♪

---

## 要約

### 概要

Claude Codeに実験的に追加されたMCPツールの動的ロード機能についての検証レポート。この機能により、MCPツールが必要な時にのみオンデマンドでロードされるようになり、コンテキストウィンドウを大幅に節約できることが確認された。

### 設定方法

以下の2つの環境変数を設定することで、この実験的機能を試すことができる：

- `ENABLE_TOOL_SEARCH=true`
- `ENABLE_EXPERIMENTAL_MCP_CLI=false`

### 主な発見

**コンテキストウィンドウの増加**
- 従来はすべてのMCPサーバーのツール定義がシステムプロンプトに追加されていた
- 動的ロードにより、**33%のコンテキストウィンドウを節約**できることが確認された
- Slack、Linear、Notion、Context7、Chromeなど複数のMCPツールを使用している場合に特に効果が大きい

**動作の仕組み**
1. MCPツールのコンテキストが初期状態では0になる
2. 必要な時に`MCPSearch`がまず実行される
3. 該当するMCPツールが発見され、動的にロードされる
4. **一度ロードされたツールはコンテキストウィンドウに残る**（解放されない）

**検証結果**
- Context7を使って`ccusage`について調べる実験を実施
- `MCPSearch`が最初に実行され、Context7を発見してロードする様子が確認された
- ロード後、Context7はコンテキストウィンドウに保持されることも確認

### 今後の展望

この機能は近い将来、Claude Codeの正式リリースに組み込まれる見込み。多くのMCPツールを使用するユーザーにとって、コンテキストウィンドウの効率的な利用が可能になる重要な改善となる。

### 参考情報

- 元の情報提供: @sdrzn
- GitHub Issue: https://github.com/anthropics/claude-code/issues/12836#issuecomment-3656762362