---
title: "RSSHub"
source: "https://docs.rsshub.app/"
author:
  - "[[DIYgod]]"
published:
created: 2026-03-13
description: "RSSHubは、RSSフィードを提供していないWebサイトからRSSフィードを生成できるオープンソースのRSSフィードアグリゲーター。5,000以上の分散インスタンスと900人以上のコントリビューターを持つ世界最大のRSSネットワーク。Docker、Vercel、Cloudflare Workersなど多様なデプロイ方法に対応し、フィルタリング、全文取得、ChatGPT要約などの高度な機能を備える。"
tags:
  - "clippings"
  - "RSS"
  - "open-source"
  - "self-hosted"
  - "web-scraping"
  - "feed-aggregator"
  - "Docker"
---

## 概要

RSSHub は「Everything is RSSible」をスローガンに掲げるオープンソースの RSS フィードジェネレーターである。RSS フィードを提供していない Web サイトやサービスからも RSS フィードを自動生成でき、あらゆるコンテンツを RSS で購読可能にすることを目指している。MIT ライセンスで公開されており、GitHub で **42,600+ スター**を獲得している。

世界中に **5,000 以上のインスタンス**が稼働し、**900 人以上のコントリビューター**が活発に開発に参加する、世界最大の RSS ネットワークを形成している。

## 主要なトピック

### 基本的な使い方

RSSHub のフィード生成はルートベースの仕組みで動作する。

1. ドキュメントから対象サービスのルートを確認する（例: Telegram チャンネル → `/telegram/channel/:username`）
2. パラメータを実際の値に置き換える（例: `/telegram/channel/awesomeRSSHub`）
3. インスタンスドメインを先頭に付加する（例: `https://rsshub.app/telegram/channel/awesomeRSSHub`）
4. 生成した URL を任意の RSS リーダーに登録する

### パラメータとフィルタリング

RSSHub は URI クエリパラメータで高度なカスタマイズが可能。

| パラメータ | 機能 |
|-----------|------|
| `filter` / `filterout` | 正規表現によるコンテンツのフィルタリング（タイトル、説明、著者、カテゴリ） |
| `filter_time` | 指定時間範囲内の記事のみ取得（秒単位） |
| `filter_case_sensitive` | フィルタの大文字小文字区別の制御 |
| `limit` | フィード内の記事数を制限 |
| `sorted` | 公開日によるソートの有効/無効化 |
| `mode=fulltext` | 全文出力モード |
| `brief=N` | N文字以内の簡潔な紹介文を生成（N ≥ 100） |
| `chatgpt` | ChatGPT による要約生成（`OPENAI_API_KEY` が必要） |
| `format` | 出力形式の指定（`rss`, `atom`, `json`, `rss3`） |
| `opencc` | 簡体字⇔繁体字の変換 |
| `tgiv` | Telegram Instant View リンクへの変換 |
| `scihub` | Sci-Hub リンクの出力（学術論文ルート向け） |

### 出力フォーマット

以下の4つのフォーマットに対応しており、デフォルトは RSS 2.0。

- **RSS 2.0** — `?format=rss`（デフォルト）
- **Atom** — `?format=atom`
- **JSON Feed** — `?format=json`
- **RSS3** — `?format=rss3`

デバッグ用に `?format=debug.json` や `?format=0.debug.html` も利用可能（`debugInfo=true` 設定時）。

### npm パッケージとしての利用（実験的）

RSSHub は Node.js プロジェクトに npm パッケージとして組み込むことも可能。

```javascript
import * as RSSHub from 'rsshub';

await RSSHub.init({ CACHE_TYPE: null });

RSSHub.request('/youtube/user/JFlaMusic')
  .then((data) => console.log(data))
  .catch((e) => console.log(e));
```

### Radar 機能

Web サイトのアドレスを RSSHub のフィードアドレスに自動マッピングする機能。以下のツールと連携して利用可能。

| プラットフォーム | ツール |
|----------------|--------|
| ブラウザ拡張 | [RSSHub Radar](https://github.com/DIYgod/RSSHub-Radar) |
| iOS | [RSSBud](https://github.com/Cay-Zhang/RSSBud) |
| Android | [RSSAid](https://github.com/LeetaoGoooo/RSSAid) |
| RSS リーダー | [Folo](https://github.com/RSSNext/Folo) |
| Dify プラグイン | [RSSHub Dify Plugin](https://github.com/stvlynn/RSSHub-Dify-Plugin) |

## デプロイ方法

RSSHub は多様なデプロイ方法をサポートしている。

### Docker Compose（推奨）

```bash
wget https://raw.githubusercontent.com/DIYgod/RSSHub/master/docker-compose.yml
docker-compose up -d
```

ポート `1200` でアクセス可能。[watchtower](https://github.com/containrrr/watchtower) による自動更新にも対応。

### Docker イメージ

| レジストリ | イメージ |
|-----------|---------|
| Docker Hub | `diygod/rsshub` |
| GitHub Container Registry | `ghcr.io/diygod/rsshub` |

| タグ | 説明 | Puppeteer 対応 |
|-----|------|---------------|
| `latest` | 最新版 | No |
| `chromium-bundled` | Chromium同梱版 | Yes |
| `{YYYY-MM-DD}` | 日付指定リリース | No |
| `chromium-bundled-{YYYY-MM-DD}` | Chromium同梱日付指定版 | Yes |

対応アーキテクチャ: `linux/amd64`, `linux/arm64`

### その他のデプロイ先

| 方法 | 特徴 |
|------|------|
| **手動デプロイ** | Node.js + pnpm で直接起動 |
| **Kubernetes (Helm)** | HA モード、オートスケーリング対応 |
| **Ansible** | Ubuntu 20.04 向け、Redis + browserless + Caddy 2 同梱 |
| **Vercel** | ワンクリックデプロイ対応 |
| **Zeabur** | マーケットプレースからデプロイ |
| **Heroku** | 自動デプロイ対応 |
| **Cloudflare Workers** | Workers Paid プラン必須（3MB制限のため） |
| **Fly.io** | Upstash Redis キャッシュ統合対応 |
| **Railway** | 自動更新含む |
| **Google App Engine** | Flexible / Standard 環境対応 |
| **Sealos** | Redis キャッシュ統合、自動更新 |
| **PikaPods** | 月額 $1〜、$5 の無料クレジット付き |

## 重要な事実・データ

- **GitHub スター数**: 42,600+
- **稼働インスタンス数**: 5,000 以上（世界最大の RSS ネットワーク）
- **コントリビューター数**: 900 人以上
- **ライセンス**: MIT
- **作者**: [DIYgod](https://diygod.cc/)
- **対応アーキテクチャ**: `linux/amd64`, `linux/arm64`（`linux/arm/v7` は 2025-04-22 以降サポート終了）
- **公式インスタンス**: [rsshub.app](https://rsshub.app/)
- **公開パブリックインスタンス**: 17 以上（米国、欧州、アジア各地に分散）

## 結論・示唆

### プロジェクトの価値

RSSHub は、現代の Web において失われつつある RSS の可能性を復活させるプロジェクトである。SNS やニュースサイトなど、RSS を提供しないサービスからもフィードを生成できるため、情報収集の自由度を大幅に高められる。

### 実践的な示唆

- **個人利用**: 公式インスタンス `rsshub.app` やパブリックインスタンスを利用すればすぐに始められる
- **セルフホスト**: Docker Compose で数分でデプロイ可能。プライバシーと安定性を重視する場合に推奨
- **開発者向け**: npm パッケージとしてアプリに組み込んだり、新しいルートをコントリビュートできる
- **ブラウザ連携**: RSSHub Radar 拡張機能を入れることで、閲覧中のサイトの RSS フィードを自動検出できる

## 制限事項・注意点

- **Cloudflare Workers**: Workers Paid プランが必須（Free プランの 3MB 制限では不足）
- **Puppeteer**: Chromium 同梱版イメージ (`chromium-bundled`) を使用しないと Puppeteer 対応ルートが動作しない。リソース消費が増加する
- **`linux/arm/v7`**: 2025-04-22 以降サポート終了
- **ChatGPT 要約機能**: `OPENAI_API_KEY` の設定が必要で、トークンを消費する
- **フィルタリング**: 正規表現エンジン `re2` を使用しており、Node.js の `RegExp` と一部挙動が異なる場合がある
- **マルチメディア処理**: `image_hotlink_template` 等は実験的 API であり、`ALLOW_USER_HOTLINK_TEMPLATE=true` の設定が必要
- **Play with Docker**: テスト用途で最大4時間のみ利用可能

---

*Source: [RSSHub Documentation](https://docs.rsshub.app/)*
