---
title: "D4Vinci/Scrapling: 🕷️ An adaptive Web Scraping framework that handles everything from a single request to a full-scale crawl!"
source: "https://github.com/D4Vinci/Scrapling"
author:
  - "[[Karim Shoair (D4Vinci)]]"
published: 2024
created: 2026-03-07
description: "Scraplingは、単一リクエストからフルスケールクロールまで対応する適応型Webスクレイピングフレームワーク。Webサイトの変更を学習して要素を自動再特定し、Cloudflare Turnstileなどのアンチボットシステムをバイパスするフェッチャーを備え、並行・マルチセッションクロールをサポートする。"
tags:
  - "clippings"
  - "web-scraping"
  - "python"
  - "anti-bot-bypass"
  - "crawler"
  - "automation"
---

## 概要

**Scrapling**は、Pythonで構築された適応型Webスクレイピングフレームワーク。単一のHTTPリクエストからフルスケールの並行クロールまで、数行のコードで実現できる。主な特徴は以下の3点：

1. **適応型パーサー** — Webサイトの変更を学習し、要素が移動しても自動的に再特定する
2. **ステルスフェッチャー** — Cloudflare Turnstileなどのアンチボットシステムをバイパス
3. **スパイダーフレームワーク** — 並行クロール、マルチセッション、一時停止/再開をサポート

ライセンス: BSD-3-Clause | Python 3.10以上 | スター数: 25,000+

---

## 主要機能

### 1. スパイダー (フルクロールフレームワーク)

- **Scrapy風API**: `start_urls`、async `parse` コールバック、`Request`/`Response` オブジェクトを使ったスパイダー定義
- **並行クロール**: 同時リクエスト数制限、ドメイン単位のスロットリング、ダウンロード遅延を設定可能
- **マルチセッション**: HTTPリクエストとステルスヘッドレスブラウザを1つのスパイダー内で統合的に使い分け
- **一時停止 & 再開**: チェックポイントベースのクロール永続化。`Ctrl+C` でグレースフルシャットダウンし、再開時は中断箇所から継続
- **ストリーミングモード**: `async for item in spider.stream()` でリアルタイム統計付きの逐次データ取得
- **ブロック検出**: ブロックされたリクエストの自動検出とカスタマイズ可能なリトライロジック
- **組み込みエクスポート**: JSON/JSONLへのエクスポート (`result.items.to_json()` / `result.items.to_jsonl()`)

```python
from scrapling.spiders import Spider, Request, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10

    async def parse(self, response: Response):
        for quote in response.css('.quote'):
            yield {
                "text": quote.css('.text::text').get(),
                "author": quote.css('.author::text').get(),
            }
        next_page = response.css('.next a')
        if next_page:
            yield response.follow(next_page[0].attrib['href'])

result = QuotesSpider().start()
result.items.to_json("quotes.json")
```

### 2. フェッチャー (高度なWebサイト取得)

4種類のフェッチャーを提供し、用途に応じて使い分ける：

| クラス | 用途 | 特徴 |
|---|---|---|
| `Fetcher` / `FetcherSession` | 高速HTTPリクエスト | ブラウザTLSフィンガープリント偽装、HTTP/3対応 |
| `DynamicFetcher` / `DynamicSession` | 動的サイト取得 | Playwright Chromium / Google Chrome によるフルブラウザ自動化 |
| `StealthyFetcher` / `StealthySession` | アンチボットバイパス | フィンガープリントスプーフィング、Cloudflare Turnstile/Interstitial 自動突破 |
| `AsyncFetcher` / Async各種Session | 非同期処理 | 全フェッチャーの完全async対応 |

追加機能：
- **プロキシローテーション**: `ProxyRotator` による循環/カスタムローテーション戦略、リクエスト単位のプロキシオーバーライド
- **ドメインブロック**: ブラウザベースフェッチャーで特定ドメインへのリクエストをブロック
- **セッション管理**: Cookie・状態の永続化

### 3. 適応型スクレイピング & AI統合

- **スマート要素トラッキング**: Webサイト変更後も類似性アルゴリズムで要素を再特定
- **柔軟なセレクション**: CSS、XPath、フィルタベース検索、テキスト検索、正規表現など多彩な選択方法
- **類似要素検出**: 見つけた要素に類似した要素を自動的に検出
- **MCPサーバー**: AI支援Webスクレイピング用のビルトインMCPサーバー。Scraplingがターゲットコンテンツを事前抽出してAI(Claude/Cursor等)に渡すことで、トークン使用量削減とコスト最適化を実現

### 4. パフォーマンス

- **高速パーサー**: 最適化されたパフォーマンスで、ほとんどのPythonスクレイピングライブラリを上回る
- **メモリ効率**: 最適化データ構造と遅延読み込みで最小メモリフットプリント
- **高速JSONシリアライゼーション**: 標準ライブラリの10倍速
- **テストカバレッジ92%**、完全な型ヒントカバレッジ

---

## パフォーマンスベンチマーク

### テキスト抽出速度 (5000ネスト要素)

| # | ライブラリ | 時間 (ms) | Scrapling比 |
|---|---|---|---|
| 1 | **Scrapling** | **2.02** | **1.0x** |
| 2 | Parsel/Scrapy | 2.04 | 1.01x |
| 3 | Raw Lxml | 2.54 | 1.257x |
| 4 | PyQuery | 24.17 | ~12x |
| 5 | Selectolax | 82.63 | ~41x |
| 6 | MechanicalSoup | 1549.71 | ~767x |
| 7 | BS4 with Lxml | 1584.31 | ~784x |
| 8 | BS4 with html5lib | 3391.91 | ~1679x |

### 要素類似性 & テキスト検索

| ライブラリ | 時間 (ms) | Scrapling比 |
|---|---|---|
| **Scrapling** | **2.39** | **1.0x** |
| AutoScraper | 12.45 | 5.209x |

> すべてのベンチマークは100回以上の実行の平均値。

---

## インストール

```bash
# パーサーのみ（最小インストール）
pip install scrapling

# フェッチャー付き
pip install "scrapling[fetchers]"
scrapling install  # ブラウザとシステム依存関係をダウンロード

# MCPサーバー機能
pip install "scrapling[ai]"

# シェル機能（対話型シェル & extractコマンド）
pip install "scrapling[shell]"

# 全機能
pip install "scrapling[all]"
```

### Docker

```bash
docker pull pyd4vinci/scrapling
# または
docker pull ghcr.io/d4vinci/scrapling:latest
```

---

## CLI & 対話型シェル

- `scrapling shell` — 対話型Webスクレイピングシェル（IPython統合、curlリクエスト変換、ブラウザプレビュー）
- `scrapling extract` — コーディング不要でWebページの内容を抽出（`.txt`, `.md`, `.html` 形式で出力）

```bash
scrapling extract get 'https://example.com' content.md
scrapling extract stealthy-fetch 'https://example.com' data.html --css-selector '#content' --solve-cloudflare
```

---

## 開発者向けの特徴

- **BeautifulSoup/Scrapy互換API**: `find_all`, `css`, `xpath` など馴染みのあるインターフェース
- **リッチなDOMナビゲーション**: parent, sibling, child のトラバーサル、`find_similar()`, `below_elements()` など
- **自動セレクタ生成**: 任意の要素に対して堅牢なCSS/XPathセレクタを自動生成
- **完全な型ヒント**: PyRight・MyPyによる自動スキャン、優れたIDE補完

---

## 注意事項

このライブラリは教育・研究目的のみで提供されている。使用者はローカルおよび国際的なデータスクレイピングおよびプライバシーに関する法律を遵守する責任がある。Webサイトの利用規約と `robots.txt` を常に尊重すること。
