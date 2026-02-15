---
title: "Introducing Markdown for Agents"
source: "https://blog.cloudflare.com/markdown-for-agents/"
author:
  - "[[Celso Martinho]]"
  - "[[Will Allen]]"
published: 2026-02-12
created: 2026-02-15
description: "Webコンテンツの発見方法が従来の検索エンジンからAIエージェントへと変化する中、CloudflareはHTMLページをリアルタイムでMarkdownに変換する「Markdown for Agents」を発表。Accept: text/markdownヘッダーによるコンテンツネゴシエーションで、トークン使用量を最大80%削減し、AIシステムの効率的なコンテンツ取得を可能にする。"
tags:
  - "clippings"
  - "Cloudflare"
  - "AI"
  - "Agents"
  - "Markdown"
  - "Developer Platform"
---

## 概要

Cloudflareは、AIエージェントやクローラーがWebコンテンツを効率的に取得できるよう、HTMLページをリアルタイムでMarkdownに自動変換する新機能「**Markdown for Agents**」を発表した。従来のHTMLベースのWebは人間向けに構築されているが、AIエージェントの台頭により、構造化されたデータ形式での提供が求められている。この機能により、**トークン使用量を最大80%削減**しながら、より正確なコンテンツ取得が可能になる。

---

## なぜMarkdownが重要なのか

- **トークン効率の劇的な向上**: HTMLをそのままAIに渡すことは、「中身の手紙ではなく包装紙を読むために単語ごとに料金を払う」ようなもの
  - Markdownの `## About Us` → 約3トークン
  - HTML の `<h2 class="section-title" id="about">About Us</h2>` → 12〜15トークン
  - さらに `<div>` ラッパー、ナビゲーションバー、scriptタグなど意味のない要素も含まれる
- **実例**: この記事自体が HTML で16,180トークン → Markdown で3,150トークン（**80%削減**）
- **Markdownはエージェント・AIシステムの共通言語（lingua franca）** になりつつある
  - 明示的な構造がAI処理に最適
  - より良い結果とトークン消費の最小化を両立
- **課題**: WebはHTMLで構成されており、ページ容量は年々増加。エージェントにとって非本質的な要素を除去し関連コンテンツを抽出するのは困難
- HTMLからMarkdownへの変換はAIパイプラインの一般的なステップだが、計算の無駄・コスト・処理の複雑さを伴い、コンテンツ制作者の意図と異なる使われ方をする可能性がある

---

## HTMLからMarkdownへの自動変換

Cloudflareのネットワークは、**コンテンツネゴシエーションヘッダー**を使用したリアルタイムのコンテンツ変換をサポートする。

### 仕組み

1. クライアントが `Accept: text/markdown` ヘッダーを含むリクエストを送信
2. Cloudflareがこれを検知し、オリジンからHTMLを取得
3. HTMLをMarkdownに変換してクライアントに提供

### 使用例（curl）

```bash
curl https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/ \
  -H "Accept: text/markdown"
```

### 使用例（Workers TypeScript）

```typescript
const r = await fetch(
  `https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/`,
  {
    headers: {
      Accept: "text/markdown, text/html",
    },
  },
);
const tokenCount = r.headers.get("x-markdown-tokens");
const markdown = await r.text();
```

### レスポンスの特徴

- **Content-Type**: `text/markdown; charset=utf-8`
- **x-markdown-tokens ヘッダー**: 変換後のMarkdownの推定トークン数を含む（コンテキストウィンドウのサイズ計算やチャンキング戦略の決定に活用可能）
- **Vary: accept** ヘッダー: コンテンツネゴシエーションに対応
- Claude Code や OpenCode など、すでに主要なコーディングエージェントがこのAcceptヘッダーを送信している

---

## Content Signals ポリシー

- Cloudflareの「Birthday Week」で発表された **Content Signals** フレームワークと連携
- Markdown for Agents の変換レスポンスには以下のヘッダーが含まれる:
  - `Content-Signal: ai-train=yes, search=yes, ai-input=yes`
  - AI学習、検索結果、AIインプット（エージェント利用含む）への使用を許可するシグナル
- 将来的にはカスタム Content Signal ポリシーの定義オプションを提供予定

---

## Cloudflare Blog & Developer Documentationで試す

- Cloudflareの **Developer Documentation** と **Blog** で本機能を有効化済み
- すべてのAIクローラーやエージェントがMarkdown形式でコンテンツを取得可能

```bash
curl https://blog.cloudflare.com/markdown-for-agents/ \
  -H "Accept: text/markdown"
```

---

## その他のMarkdown変換方法

Cloudflare外部やMarkdown for Agentsが利用不可のコンテンツソースに対して：

1. **Workers AI `AI.toMarkdown()`**: HTMLだけでなく複数のドキュメントタイプに対応、要約機能も提供
2. **Browser Rendering `/markdown` REST API**: 動的ページやアプリケーションを実際のブラウザでレンダリングした後にMarkdown変換が必要な場合に利用

---

## Markdownの利用状況トラッキング

- **Cloudflare Radar** にAIボット・クローラーのトラフィックに対するコンテンツタイプインサイトを追加
  - グローバルな **AI Insights** ページ
  - 個別ボットの情報ページ
- `content_type` ディメンションとフィルターにより、AIエージェント・クローラーに返されるコンテンツタイプの分布を **MIMEタイプカテゴリ** ごとに表示
- 特定のエージェント・クローラー（例: OpenAIの **OAI-Searchbot**）に絞ったMarkdownリクエストも確認可能
- すべてのRadarデータは **パブリックAPI** および **Data Explorer** を通じて無料でアクセス可能

---

## 利用開始方法

1. Cloudflare **ダッシュボード** にログイン
2. アカウント → ゾーンを選択
3. **Quick Actions** で「Markdown for Agents」ボタンをトグルして有効化

### 利用条件

- **Beta版** として提供中（追加コストなし）
- 対象プラン: **Pro**, **Business**, **Enterprise**、および **SSL for SaaS** ユーザー

---

## 重要なポイント

- **80%のトークン削減**: HTMLからMarkdownへの変換で大幅なコスト・効率改善
- **標準的なHTTPヘッダー**: `Accept: text/markdown` による簡潔なインターフェース
- **コンテンツ所有者の意図を尊重**: Content Signalsフレームワークとの統合
- **既存エージェントとの互換性**: Claude Code、OpenCodeなどが既にAcceptヘッダーを送信
- **無料で利用可能**: Pro以上のプランでBeta版として追加コストなし
