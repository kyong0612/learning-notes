---
title: "The headless browser"
source: "https://lightpanda.io/"
author:
  - "[[Lightpanda]]"
  - "[[Francis Bouvier]]"
  - "[[Pierre Tachoire]]"
  - "[[Katie Brown]]"
published:
created: 2026-04-10
description: "Lightpandaは、AI・自動化のためにゼロから構築されたZig製ヘッドレスブラウザ。Chrome headlessと比較して10倍高速・10倍省メモリ・100ms以下のコールドスタートを実現。CDP互換でPlaywright/Puppeteerとシームレスに連携し、Webスクレイピング・ブラウザ自動化・AIエージェントのためのインフラを提供する。"
tags:
  - "clippings"
  - "headless-browser"
  - "web-automation"
  - "web-scraping"
  - "Zig"
  - "AI-agents"
  - "CDP"
  - "Playwright"
  - "Puppeteer"
  - "open-source"
---

## 概要

Lightpandaは、マシン専用にゼロから設計・構築された初のヘッドレスブラウザエンジンである。既存ブラウザのフォークやパッチではなく、システムプログラミング言語Zigで書かれた完全な新規実装であり、レンダリングのオーバーヘッドを排除したヘッドレス専用アーキテクチャを持つ。Webスクレイピング、ブラウザ自動化、AIエージェントの用途に最適化されており、Chrome headlessと比較して**10倍高速**、**10倍省メモリ**、**100ms以下のコールドスタート**を実現する。

GitHubでは28,000以上のスターを獲得しており、ISAIからのプレシード資金調達を完了。Mistral、Hugging Face、Dustからのエンジェル投資家にも支援されている。

## 主要なトピック

### パフォーマンス特性

- **10倍高速**: Chrome headlessと比較したブラウザ自動化タスクの実行速度
- **10倍省メモリ**: カスタムZig DOMエンジン（zigdom）による大幅なメモリ削減
- **100ms以下のコールドスタート**: 即時起動が可能で、完全に組み込み可能
- **シングルバイナリ**: 単一プロセス・マルチスレッドのデプロイメント

### アーキテクチャ

| コンポーネント | 技術 |
|----------------|------|
| 言語 | Zig（システムプログラミング）+ V8（JavaScript） |
| DOM | zigdom（カスタムZigベースDOM実装、LibDOMを置き換え） |
| ネットワーク | libcurl（HTTP/TLS） |
| プロトコル | Chrome DevTools Protocol（CDP） over WebSocket |
| デプロイ | シングルバイナリ、シングルプロセス、マルチスレッド |

zigdomはLightpandaの中核技術で、従来のLibDOMをZigネイティブの実装に移行することで、メモリ効率と実行速度の大幅な改善を実現している。

### CDP互換性とツール連携

LightpandaはChrome DevTools Protocol（CDP）をネイティブサポートしており、既存のブラウザ自動化ツールとシームレスに連携できる。

**Playwright接続例:**

```javascript
const browser = await chromium.connectOverCDP('ws://localhost:9222');
const page = await browser.newPage();
await page.goto('https://example.com');
```

**Puppeteer接続例（Lightpanda Cloud）:**

```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://cloud.lightpanda.io/ws?token=YOUR_TOKEN',
});
```

### 主要機能

- **JavaScript実行**: V8エンジンによるフルWeb APIサポート
- **リクエストインターセプション**: CDP経由でHTTPリクエストの一時停止・変更・モック・ブロックが可能
- **マルチクライアント**: 単一プロセスで複数の同時CDP接続を処理
- **robots.txtサポート**: 責任あるクローリングのためのオプトイン準拠
- **ネイティブMarkdown出力**: ページコンテンツをMarkdown形式で直接出力
- **ネイティブMCPサーバー**: Model Context Protocolのネイティブサポート
- **Web Bot認証サポート**: 認証が必要なサイトへの自動化対応
- **Stagehandサポート**: AIエージェントフレームワークとの連携

### クラウドサービス

`cloud.lightpanda.io` でマネージドサービスを提供しており、LightpandaバックエンドとChromeバックエンドの両方を利用可能。コンソール（`console.lightpanda.io`）から管理でき、本番環境での利用に対応している。

### オープンソースとインストール

- **GitHub**: [lightpanda-io/browser](https://github.com/lightpanda-io/browser)（28,000+ スター）
- **npm**: `@lightpanda/browser` パッケージとして公開
- ソースからのビルドも可能（Zigツールチェーン使用）
- プロキシ設定にも対応

## 重要な事実・データ

- **パフォーマンス**: Chrome headless比で10倍高速、10倍省メモリ、100ms以下のコールドスタート
- **GitHub Stars**: 28,092以上
- **ブログ記事**: 18本（2025年5月〜2026年4月）
- **ドキュメントページ**: 16ページ
- **実装言語**: Zig + V8（JavaScript）
- **創業チーム**: Francis Bouvier（CEO）、Katie Brown（COO）、Pierre Tachoire（CTO）
- **資金調達**: ISAIからのプレシード完了、Mistral・Hugging Face・Dustのエンジェル投資家が参加
- **プレシード発表**: 2025年6月10日

## 結論・示唆

### プロジェクトのビジョン

Lightpandaは「人間のためではなく、マシンのために作られた最初のブラウザ」というビジョンを掲げている。従来のブラウザはGUIレンダリングを前提に設計されているため、ヘッドレスモードでも不要なオーバーヘッドが残る。Lightpandaはこの問題をアーキテクチャレベルから解決し、AIエージェント時代に最適化されたブラウザインフラを提供する。

### 実践的な示唆

- **AIエージェント開発**: Chrome headlessの代替として、コスト効率とスケーラビリティの大幅な改善が期待できる
- **Webスクレイピング**: メモリ効率の高さから、大規模な並行スクレイピングに適している
- **既存ツールとの互換性**: CDP互換のため、Playwright/Puppeteerのコードをほぼ変更なしで移行可能
- **エッジ・組み込み環境**: シングルバイナリ・低メモリのため、リソース制約のある環境にも適合

## 制限事項・注意点

- プロダクトページ（ホームページ）からの情報であり、独立したベンチマーク検証結果ではない
- パフォーマンス数値（10倍高速等）はLightpanda自身による公表値
- 比較的新しいプロジェクト（2025年5月〜）であり、本番環境での実績はまだ限定的な可能性がある
- WebページのレンダリングやGUI表示は対象外（ヘッドレス専用）

---

*Source: [Lightpanda - The headless browser](https://lightpanda.io/)*
