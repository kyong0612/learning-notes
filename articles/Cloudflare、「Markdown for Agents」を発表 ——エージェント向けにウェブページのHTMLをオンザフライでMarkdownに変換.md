---
title: "Cloudflare、「Markdown for Agents」を発表 ——エージェント向けにウェブページのHTMLをオンザフライでMarkdownに変換"
source: "https://gihyo.jp/article/2026/02/cloudflare-markdown-for-agents"
author:
  - "[[gihyo.jp]]"
published: 2026-02-13
created: 2026-02-14
description: "Cloudflareは2026年2月12日、ウェブページのHTMLをエージェント向けにリアルタイムでMarkdownに変換して提供する機能「Markdown for Agents」を発表。AcceptヘッダーにてMarkdownを要求するエージェントに対し、トークン使用量を約80%削減した構造化コンテンツを返却する。Pro/Business/Enterpriseプラン等でベータ提供。"
tags:
  - "clippings"
  - "Cloudflare"
  - "AI"
  - "LLM"
  - "Markdown"
  - "AI Agent"
  - "Web"
---

## 概要

Cloudflareは2026年2月12日、ウェブページをAIエージェント向けにMarkdownへリアルタイム変換して提供する新機能「**Markdown for Agents**」を発表した。Pro/Business/EnterpriseプランおよびSSL for SaaSの顧客に対し、ベータ機能として無償提供される。

エージェントが `Accept: text/markdown` ヘッダーを付与してリクエストを送ると、CloudflareがオリジンのHTMLをオンザフライでMarkdownに変換して返す仕組みである。

## 主要なトピック

### なぜMarkdownなのか

- **HTMLの問題**: ブラウザ向けに設計されているため、ページ内容と直接関係のない要素（ナビゲーション、スクリプト等）が含まれ、エージェントにとって余分な情報が多い
- **Markdownの利点**: 明示的な構造を持たせられるため、AI処理に適している
- **トークン削減効果**: Cloudflareのブログ記事の例で、HTMLの16,180トークンがMarkdownでは3,150トークンとなり、**約80%のトークン使用量削減**を実現

### 従来のHTML→Markdown変換の課題

- AIパイプラインではHTML→Markdown変換が一般的なステップだが、処理が複雑になりがち
- 変換結果がコンテンツ制作者の意図した構造と一致しない可能性がある
- エージェントがソースから直接Markdownを受け取れれば、この変換工程自体を省略できる

### 動作の仕組み

1. クライアントが `Accept` ヘッダーに `text/markdown` を付与してリクエスト送信
2. CloudflareがオリジンサーバーからHTMLを取得
3. 変換可能な場合、オンザフライでMarkdownに変換して返却

すでにClaude CodeやOpenCodeといったコーディングエージェントは、`Accept` ヘッダーでコンテンツタイプを指定してリクエストしている。

#### リクエスト例

```bash
curl https://blog.cloudflare.com/markdown-for-agents/ \
 -H "Accept: text/markdown"
```

#### レスポンスヘッダー

```
HTTP/2 200
content-type: text/markdown; charset=utf-8
vary: accept
x-markdown-tokens: 725
content-signal: ai-train=yes, search=yes, ai-input=yes
```

- **`x-markdown-tokens`**: Markdown文書の推定トークン数を示す
- **`content-signal`**: AIに関する利用用途を示すContent Signalsヘッダー（AIトレーニング、検索、AI入力での使用可否を表示）
- Markdownのフロントマターには `description`、`title`、`image`（OGP画像）のプロパティも付属

### Content Signals

レスポンスに含まれる `content-signal` ヘッダーにより、コンテンツの利用可否が示される。現時点では以下の用途が設定される：

- `ai-train=yes` — AIトレーニングへの使用可
- `search=yes` — 検索での使用可
- `ai-input=yes` — AI入力（エージェント利用含む）での使用可

将来的には、カスタムのContent Signalポリシーを定義するオプションも提供予定。

### 有効化方法

- Cloudflare dashboardから設定可能
- アカウントとゾーンを選択し、Quick Actionsの「Markdown for Agents」ボタンで有効化

### 補完的な変換手段

Cloudflareネットワーク外のコンテンツや、Markdown for Agentsが利用できないサイトに向けて、別手段も提供：

| 手段 | 用途 |
|------|------|
| **Browser Rendering `/markdown` REST API** | 動的ページやアプリケーションを実ブラウザでレンダリングしてからMarkdown変換 |
| **Workers AI `AI.toMarkdown()`** | HTMLだけでなく複数の文書タイプと要約のMarkdown変換 |

### Cloudflare Radarの更新

発表にあわせ、Cloudflare RadarにAIボット/クローラーのトラフィックに関する新たなインサイトが追加された：

- 新たに `content_type` ディメンションとフィルターを追加
- 返されたコンテンツタイプの分布をMIME typeでグループ化表示
- 特定のエージェント/クローラーでMarkdownを返すリクエストに絞り込み可能

## 重要な事実・データ

- **発表日**: 2026年2月12日
- **トークン削減**: HTML（16,180トークン）→ Markdown（3,150トークン）で**約80%削減**
- **対象プラン**: Pro / Business / Enterprise / SSL for SaaS
- **提供形態**: ベータ機能として無償
- **対応エージェント例**: Claude Code、OpenCode
- **参照**: [Cloudflare公式ブログ記事](https://blog.cloudflare.com/markdown-for-agents/)

## 結論・示唆

### 記事の結論

Cloudflareは、ウェブサイトの訪問者として人間だけでなくAIエージェントも考慮すべき段階に来ていると指摘している。Markdown for Agentsは、エージェントに対して効率的かつ構造化されたコンテンツを提供する手段として位置づけられている。

### 実践的な示唆

- **サイト運営者**: Cloudflareを利用しているサイトは、dashboardからMarkdown for Agentsを有効化することで、AIエージェントに対するコンテンツ提供を最適化できる
- **エージェント開発者**: `Accept: text/markdown` ヘッダーを付与してリクエストすることで、対応サイトから直接Markdownを取得でき、変換処理の実装が不要になる
- **コスト最適化**: トークン使用量の約80%削減により、LLM APIのコスト削減に直結する

## 制限事項・注意点

- 現在はベータ機能としての提供
- Content Signalポリシーのカスタマイズは現時点では未対応（将来提供予定）
- Cloudflareネットワーク外のサイトでは直接利用不可（Browser RenderingやWorkers AIでの代替手段あり）
- Windowsでの `curl` コマンド実行時は `curl.exe` を使用する必要がある

---

*Source: [Cloudflare、「Markdown for Agents」を発表 ——エージェント向けにウェブページのHTMLをオンザフライでMarkdownに変換](https://gihyo.jp/article/2026/02/cloudflare-markdown-for-agents)*
