---
title: "2026元日、Playwright MCPに触れて気づいた、LLM時代のブラウザ自動化の新しいパラダイム"
source: "https://zenn.dev/nossa/articles/8d90efd840934f"
author:
  - "のさ"
published: 2026-01-01
created: 2026-01-03
description: "Playwright MCPを通じてブラウザ自動化の新しいパラダイムを探る。DOM+セレクタからアクセシビリティツリーへの転換、そしてLLM時代における「Webページの最適な表現方法」としてのARIA Snapshotの重要性について。"
tags:
  - "clippings"
  - "Playwright"
  - "MCP"
  - "AI"
  - "ブラウザ自動化"
  - "アクセシビリティ"
---

## はじめに

年末年始でPlaywright MCPを触り直している。きっかけは、MCPがLinux Foundation傘下のAgentic AI Foundationに移管されたというニュースだった。GitHub Starsは23,000を超え、2024年11月のMCP発表からわずか1年。最初は「また新しいツールか」程度に思っていたが、触っているうちに、これまで経験してきたブラウザ自動化とは何か違うと感じ始めた。

その違和感を整理した結果、自分なりに言語化できたのが**「Webページの表現方法」の変化**という視点である。

## PlaywrightとPlaywright MCPは別物である

最初に混乱したポイントを共有する。

**Playwright**と**Playwright MCP**は、関連はあるものの根本的に異なるものだ。「PlaywrightのMCP対応版」くらいに思っていたが、それは誤解だった。

| 項目 | Playwright | Playwright MCP |
|------|------------|----------------|
| 本質 | ブラウザ自動化フレームワーク | MCPサーバー実装 |
| 利用者 | 人間(開発者) | LLM/AIエージェント |
| 入力 | コード(TypeScript/Python等) | 自然言語 → 構造化コマンド |
| ページの表現 | DOM/セレクタ | ARIA Snapshot(アクセシビリティツリーのYAML表現) |

Playwrightは開発者がコードを書いてブラウザを操作するためのフレームワーク。一方、Playwright MCPは、LLMがブラウザを操作するための「翻訳レイヤー」である。Playwrightの能力を借りているが、目的も設計思想も異なる。

## ブラウザ自動化における「表現」の変遷

自分のブラウザ自動化歴を振り返ると、Selenium → Puppeteer → Playwright と渡り歩いてきた。今になって気づくのは、「Webページをどう表現するか」という問いへの答えが変わり続けてきた、ということだ。

### 第1世代: DOM + セレクタ(Selenium時代)

最初に触ったのはSeleniumだった。WebDriverプロトコルでブラウザを制御し、ページは**DOMツリー + CSSセレクタ/XPath**で表現していた。

```python
# 当時よく書いていたコード
element = driver.find_element(By.CSS_SELECTOR, "#login-button")
element.click()
```

HTMLの構造を理解していれば要素を特定できる。直感的ではあったが、現実には...

- クラス名が変わるとテストが壊れる
- 「このボタンはこのセレクタで取れる」という暗黙知が必要
- HTTPベースの通信が遅い(リクエスト/レスポンスの往復)

テストが不安定で、「ローカルでは動くのにCIで落ちる」に何度も遭遇した。

### 第2世代: CDP + 直接制御(Puppeteer/Playwright時代)

2017年にPuppeteer、2020年にPlaywrightが登場して、状況が変わった。Chrome DevTools Protocol(CDP)を使うことで、WebSocketによる双方向通信が可能になり、パフォーマンスと安定性が大幅に向上した。

```javascript
// Playwrightの自動待機
await page.click('button'); // visible, enabled, 遮蔽なしを自動確認
```

待機処理を自分で書かなくてよくなったのは、実務上かなり大きな改善だった。

ページの表現方法自体はDOMベースのままだったが、Playwrightは**ロールベースのセレクタ**を導入した。

```javascript
await page.getByRole('button', { name: 'Submit' }).click();
```

「この要素のHTMLはこう」ではなく「この要素の意味はこう」という発想。この転換が、後のPlaywright MCPに直接つながっていた。

### 第3世代: アクセシビリティツリー(Playwright MCP)

そして2025年、Playwright MCPが本格的に普及した。ここでページの表現方法が決定的に変わる。

**スクリーンショットでも、DOMでもなく、アクセシビリティツリー**である。Playwright MCPでは、これを「ARIA Snapshot」と呼ばれるYAML形式で表現する。

```yaml
# Playwright MCPがLLMに渡すページ表現(ARIA Snapshot)
- banner:
  - heading "ログイン" [level=1]
  - textbox "メールアドレス"
  - textbox "パスワード" [type=password]
  - button "ログイン"
  - link "パスワードを忘れた方"
```

これはPlaywrightの`locator.ariaSnapshot()`が出力するYAML形式の構造化データだ。スクリーンリーダーが「見る」ページの姿を、LLMが解釈しやすい形式で表現したものと言える。

## なぜアクセシビリティツリーなのか

### スクリーンショットベースの限界

2024年頃、多くのAIブラウザ自動化ツールはスクリーンショットベースだった。ページを画像として取得し、Vision Model(GPT-4V等)で解析して要素を特定する方式である。

この方式には以下の問題があった:

1. **曖昧性**: 「このボタンっぽいものをクリック」という推測が入る
2. **コスト**: Vision Modelは高価で遅い
3. **非決定性**: 同じ画面でも毎回異なる解釈をする可能性がある

### アクセシビリティツリーの優位性

アクセシビリティツリー(Accessibility Tree)は、ブラウザが支援技術(スクリーンリーダー等)のために生成する**構造化データ**である。W3CのAOM(Accessibility Object Model)仕様でアクセス方法が標準化されつつあり、Playwrightはこれを`ariaSnapshot()`メソッドでYAML形式に出力する。

これをLLMに渡すと:

1. **決定論的**: 同じページなら同じ構造が返る
2. **軽量**: テキストデータなのでトークン効率が良い(70-80%削減という報告も)
3. **意味的**: role、name、stateが明示されているので解釈の余地がない

つまり、「LLMにとってのWebページの最適表現」を見つけた、ということなのだと理解している。

### 2つのアプローチの比較

| 観点 | スクリーンショット | アクセシビリティツリー |
|------|-------------------|---------------------|
| 表現形式 | 画像 | YAML構造化テキスト |
| 決定性 | 低い(Vision Modelの揺れ) | 高い(同じページ→同じ構造) |
| トークン効率 | 非効率 | 効率的(70-80%削減) |
| 処理速度 | 遅い | 速い |
| コスト | 高い(Vision API) | 低い(テキスト処理) |

## MCPという標準化の意味

### N×M問題の解決

2024年11月、AnthropicがMCPを発表した背景には「N×M問題」があった。N個のAIアプリケーションとM個のツール/データソースを接続しようとすると、N×M個のカスタムコネクタが必要になる。

MCPは、Language Server Protocol(LSP)の発想を借りて、この問題を解決しようとしている。LSPがエディタと言語サーバーの間を標準化したように、MCPはLLMと外部ツールの間を標準化する。

### 2025年の急速な普及

MCPの普及速度には驚いた。Anthropic、OpenAI、Google、Microsoftが同じ標準を支持するのは珍しいことだ。

## Playwright MCPの具体的な仕組み

### 提供されるツール群

Playwright MCPは、以下のようなツールをLLMに公開する:

- `browser_navigate` - URLへの遷移
- `browser_click` - 要素のクリック
- `browser_type` - テキスト入力
- `browser_snapshot` - ページのARIA Snapshot取得
- `browser_screenshot` - スクリーンショット取得(記録用)
- `browser_evaluate` - JavaScript実行

重要なのは、`browser_snapshot`がデフォルトの「ページを見る」手段で、`browser_screenshot`はあくまで補助的な位置づけだということ。公式ドキュメントにも「browser_snapshot is preferred over screenshots for performing actions」と明記されている。

### refパラメータによる要素指定

LLMがページを操作する際、ARIA Snapshotに含まれる`ref`(参照ID)を使う。この二重構造は、デバッグ時に「LLMが何を意図していたか」がわかりやすい。

## 従来のPlaywrightとの使い分け

実務的な観点での使い分け:

### Playwright MCPが向いているケース

- **探索的テスト**: 「このサイトを一通り触って問題を見つけて」
- **新機能の検証**: フローが確定していない段階での動作確認
- **バグ再現**: 「この手順で再現して」という自然言語指示
- **プロトタイピング**: テストコードを書く前の挙動確認

### 従来のPlaywrightが向いているケース

- **回帰テスト**: 確定したフローを繰り返し実行
- **CI/CDパイプライン**: 高速・低コストな自動実行
- **大規模テストスイート**: 数百〜数千のテストケース
- **厳密なアサーション**: 「この要素のテキストが正確にこれ」

両者は排他的ではなく、補完的である。Playwright MCPで探索し、安定したフローはPlaywrightのテストコードに落とし込む。

## 触ってみて感じていること

### ブラウザの「見え方」が変わった

Playwright MCPを使っていると、ブラウザを見る視点が変わる。以前は「このボタンのセレクタは何だろう」と考えていたが、今は「このページのアクセシビリティ構造はどうなっているか」を意識するようになった。

結果として、アクセシビリティへの関心が高まった。適切なrole、aria-label、見出し構造...これらがLLMにとっての「ページの見え方」を決めるからだ。AIのためにアクセシビリティを改善すると、人間(支援技術を使うユーザー)のためにもなる、という構図は興味深い。

### 「コードを書かない」の意味

Playwright MCPは「コードを書かずにブラウザ操作」と紹介されることがあるが、これは半分正しく半分誤解を招く。

確かに、テストスクリプトを一から書く必要はない。しかし、出力されるコードのレビュー、セレクタ戦略の理解、Playwrightの動作原理の把握...これらは依然として必要だ。「コードを書かない」ではなく「コードを書く前の探索が高速化する」が実態に近い。

### 使っていて気になる点

- **出力の一貫性**: 同じ指示でも若干異なる操作になることがある
- **複雑なシナリオ**: 複数タブ、認証フロー、動的UIなどでの挙動が不安定な場面もある
- **トークンコスト**: 大きなページではスナップショットが肥大化する

コミュニティでは改善が進んでおり、Fast Playwright MCPのようなトークン最適化版も登場している。

## 2026年以降を見据えて

### WebDriver BiDiとの関係

W3Cでは、WebDriver BiDi(Bidirectional)の標準化が進んでいる。WebDriverの相互運用性とCDPの双方向性を兼ね備えた次世代プロトコルである。

Playwright MCPは現在CDPを内部で使っているが、WebDriver BiDiが普及すれば、よりクロスブラウザな実装が可能になる。ブラウザ自動化の基盤レイヤーが標準化され、その上にMCPレイヤーが乗る...という構造が見えてくる。

### AIエージェントの普及

MCPがLinux Foundationに移管されたことで、AIエージェントの相互運用性が本格的に議論されるフェーズに入った。Playwright MCPは、その中でも成熟度の高いMCPサーバー実装の一つである。

Webブラウザは依然として最も普遍的なUIだ。AIエージェントが実世界のタスクをこなすとき、ブラウザ操作は避けて通れない。Playwright MCPが提示した「ARIA Snapshotによるページ表現」は、その基盤になる可能性がある。

## おわりに

Playwright MCPに触れて気づいたのは、これが単なる「便利なツール」ではないということだ。

**「Webページをどう表現するか」という問いへの新しい答え**のひとつである。DOM + セレクタから、アクセシビリティツリー(ARIA Snapshot)へ。人間向けの表現から、LLM向けの表現へ。

Selenium → Puppeteer/Playwrightの変化と同じくらい、もしかするとそれ以上に大きな転換点かもしれない。

まだ理解しきれていない部分も多く、ツール自体も進化の途上にある。しかし、方向性としてはこちらに向かっていくのだろうという感触は持てるようになった。

## 参考リンク

- [microsoft/playwright-mcp - GitHub](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)
- [Playwright Documentation](https://playwright.dev/)
- [Playwright ARIA Snapshots](https://playwright.dev/docs/aria-snapshots)
- [Accessibility Object Model (AOM) Explainer](https://wicg.github.io/aom/explainer.html)
