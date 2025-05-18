---
title: "Cloudflare Workersで進めるリモートMCP活用"
source: "https://speakerdeck.com/syumai/cloudflare-workersdejin-merurimotomcphuo-yong"
author:
  - "syumai"
published: 2025-05-14
created: 2025-05-14
description: |
  Cloudflare Workers を利用したリモート Model Context Protocol (MCP) サーバーのアーキテクチャ、構築メリット、実装デモについて解説するプレゼンテーションの要約。
tags:
  - "MCP"
  - "Cloudflare Workers"
  - "リモートMCP"
  - "AIエージェント"
  - "サーバーアーキテクチャ"
  - "clippings"
---

## 概要

本プレゼンテーションでは、syumai氏がCloudflare Workersを活用したリモートMCP (Model Context Protocol) サーバーの構築と活用方法について解説します。ローカルMCPとリモートMCPの違い、リモートMCPの重要性、具体的なアーキテクチャ例、Cloudflare Workersを利用するメリット、そして実装デモまでを網羅しています。

## 目次

1. はじめに・自己紹介
2. MCPのToolsについて
3. ローカルMCPとリモートMCP
4. リモートMCPの重要性
5. リモートMCPサーバーのアーキテクチャ
6. Cloudflareスタック上のリモートMCPサーバー構成例とメリット
7. 実装デモ
8. まとめ
9. おまけ（おすすめ記事・Tips）

## 各スライドの要点

### 1. Cloudflare Workers で進めるリモートMCP 活用

* タイトルスライド。発表者: syumai氏、AI Developer Meetup in Tokyo #1 (2025/5/14)。
* ![Slide 0](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_0.jpg)

### 2. 自己紹介

* syumai氏の自己紹介。ECMAScript仕様輪読会/Asakusa.go主催、株式会社ベースマキナでの業務内容 (Go, TypeScript)、Software DesignでのCloudflare Workers連載など。
* Twitter: @__syumai, Website: <https://syum.ai>
* ![Slide 1](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_1.jpg)

### 3. 今日話すこと

* MCPのToolsについて
* ローカルMCPとリモートMCP
* リモートMCPの重要性
* リモートMCPサーバーのアーキテクチャ
* 実装デモ（時間があれば）
* ![Slide 2](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_2.jpg)

### 4. MCP のTools について

* (セクションタイトルのみ)
* ![Slide 3](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_3.jpg)

### 5. MCP のおさらい

* Model Context Protocol (MCP): LLMに与えるコンテキストを標準化するオープンプロトコル。
* URL: <https://modelcontextprotocol.io/>
* ![Slide 4](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_4.jpg)

### 6. MCP サーバーが提供できるもの

* Resources, Prompts, Tools。今回はToolsを扱う。
* 各ドキュメントへのリンク記載。
* ![Slide 5](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_5.jpg)

### 7. MCP のTools でできること

* 生成AIエージェントの能力拡張。
* 正確な計算（学習データからの推論のみでは不可能）。
* 特定のツール、Webサービスの使用（正確な使い方を知らないと不可能）。
* ![Slide 6](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_6.jpg)

### 8. MCP のTools のざっくり理解

* 生成AIエージェント向けにツール呼び出しのインターフェースと利用可能なツールの種類・呼び出し方法の知識を提供。
* 道具とその説明書をセットで渡すイメージ。
* ![Slide 7](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_7.jpg)

### 9. MCP のTools のざっくり理解 (補足)

* nwtgck (Otaさん) のツイートを引用し、分かりやすく解説。
* URL: <https://x.com/nwtgck_ja/status/1912095321053941857>
* ![Slide 8](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_8.jpg)

### 10. ローカルMCP とリモートMCP

* (セクションタイトルのみ)
* ![Slide 9](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_9.jpg)

### 11. ローカルMCP とリモートMCP (定義)

* 仕様上の定義ではなく俗称。MCPサーバー・クライアントの構成方法を区別。
* ![Slide 10](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_10.jpg)

### 12. ローカルMCP とリモートMCP の違い

* MCPサーバーの場所の違い。
  * ローカルMCP: ホスト・クライアントと同じマシン上。stdioトランスポートが主。
  * リモートMCP: ホスト・クライアントと別マシン上。Streamable HTTP (2025-03-26~) またはSSEトランスポート。
* Streamable HTTPからSSEへのアップグレードも可能。
* ![Slide 11](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_11.jpg)

### 13. MCP の基本アーキテクチャ

* ホスト・クライアント・サーバーの3要素。
  * ホスト: Claude Desktop, VS Codeなど。
  * クライアント: ホストに内包。
  * サーバー: Playwright MCP, BlenderMCPなど。
* クライアント対サーバーは1対1で通信。ホストは複数クライアントを管理。
* ![Slide 12](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_12.jpg)

### 14. MCP の基本アーキテクチャ (図)

* Model Context Protocol仕様からの図を引用。
* URL: <https://modelcontextprotocol.io/specification/2025-03-26/architecture/index#core-components>
* ![Slide 13](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_13.jpg)

### 15. ローカルMCP の例 (BlenderMCP)

* BlenderMCP: ローカルのBlenderを操作し、AIで3Dモデル作成。
* GitHub: <https://github.com/ahujasid/blender-mcp>
* デモ動画: <https://www.youtube.com/watch?v=DqgKuLYUv00>
* ![Slide 14](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_14.jpg)

### 16. ローカルMCP の例 (Playwright MCP)

* Playwright MCP: Playwrightを使いローカルのブラウザを操作。
* GitHub: <https://github.com/microsoft/playwright-mcp>
* ![Slide 15](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_15.jpg)

### 17. リモートMCP の例 (Cloudflare MCP Demo Day)

* Cloudflare MCP Demo Day (2025/5/1) で複数社によるデモ。
* URL: <https://demo-day.mcp.cloudflare.com/>
* ![Slide 16](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_16.jpg)

### 18. リモートMCP の例 (PayPal, Atlassian)

* PayPal MCP Server: 請求書一覧取得・発行。
  * URL: <https://developer.paypal.com/tools/mcp-server/>
* Atlassian Remote MCP Server: Jira/Confluenceの内容取得、アイテム/ページ作成。
  * URL: <https://www.atlassian.com/blog/announcements/remote-mcp-server>
* ![Slide 17](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_17.jpg)

### 19. ローカルMCP とリモートMCP への接続設定例

* VS Codeでの設定例を提示。
  * ローカル: コマンド登録 (stdio)。
  * リモート: URL登録 (sse)。
* ![Slide 18](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_18.jpg)

### 20. リモートMCP の重要性

* (セクションタイトルのみ)
* ![Slide 19](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_19.jpg)

### 21. なぜリモートMCP が重要なのか？ (接続性)

* 接続元の環境制限がほぼない (HTTP接続)。
* ローカルホスト/クライアント、リモートホスト/クライアント、Web上のAIエージェントの裏側など、多様な構成が可能。
* WebブラウザやスマートフォンアプリからもMCP Toolsにアクセス可能。
* ![Slide 20](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_20.jpg)

### 22. なぜリモートMCP が重要なのか？ (用途)

* ローカルMCPサーバーはPCが主な接続元。開発者向けローカル連携は今後も利用。
* 一般向け用途はリモートMCPがほとんどになると考えられる。
* ![Slide 21](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_21.jpg)

### 23. リモートMCP を取り巻く動向 (Claude)

* 2025/5/2のリリースでClaudeにリモートMCP連携機能追加。Web版Claudeでも接続可能（プラン限定）。
* キャッチフレーズ: 「Claudeがあなたの世界と接続できるようになりました」。
* URL: <https://www.anthropic.com/news/integrations>
* ![Slide 22](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_22.jpg)

### 24. 生成AI とWeb サービスの連携の可能性 (Gemini例)

* MCPの話ではないが、Geminiの例として、画像などの曖昧な入力からGoogleカレンダーへ予定登録。
* 生成AIの得意分野を活かしたWebサービス利用の可能性。
* syumai氏のツイート引用: <https://x.com/__syumai/status/1922143446560547241>
* ![Slide 23](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_23.jpg)

### 25. リモートMCP サーバーのアーキテクチャ

* (セクションタイトルのみ)
* ![Slide 24](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_24.jpg)

### 26. リモートMCP サーバーのアーキテクチャ (構成例)

* 例: ECサイトで生成AIエージェントからの商品購入を可能にする。
  * A: APIサーバーにMCPを実装（1台で両対応）。
  * B: APIサーバーは変更せず、前段にリモートMCPサーバーを立て、後段APIを叩く。
* → 基本的にBが望ましい。
* ![Slide 25](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_25.jpg)

### 27. リモートMCP サーバーをWeb サービス本体から分けるべき理由 (スケーラビリティ)

* スケーラビリティの観点の違い。SSEコネクション維持の可能性。
* Webサービス本体のリソースと競合する可能性。
* MCPレイヤーのスケールのみでAPIサーバー全体がスケールする不都合（DBコネクション増など）。
* ![Slide 26](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_26.jpg)

### 28. リモートMCP サーバーをWeb サービス本体から分けるべき理由 (プロトコル安定性・SDK)

* プロトコルが完全には安定していない（MCPは新しく、仕様変更の可能性）。
* 公式SDKはTypeScript, Python, Java, Kotlin, C# のみ。他言語の追従はコミュニティ依存。
* → Webサービス本体と別言語でのリモートMCPサーバー実装も考慮すべき。
* ![Slide 27](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_27.jpg)

### 29. リモートMCP サーバーをWeb サービス本体から分けるべき理由 (実装重複・結論)

* Webサービス本体との実装重複の可能性（APIサーバーと機能が重複する場合）。
* → APIを叩くだけの構成で懸念解消。
* 結論: リモートMCPサーバーはWebサービス本体へのプロキシ（兼プロトコル変換レイヤー）として扱うのが適切。
* → Cloudflareがプロキシ用途に強く、ホスト基盤として有力。
* ![Slide 28](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_28.jpg)

### 30. Cloudflare スタック上のリモートMCP サーバー構成例

* リモートMCPサーバーのみをCloudflare内に置き、後段にAPIサーバーを設置。
* Cloudflareブログ記事引用: <https://blog.cloudflare.com/remote-model-context-protocol-servers-mcp/>
* ※ 図中のClient例は恐らく誤り（Claude Web版などが該当）。
* ![Slide 29](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_29.jpg)

### 31. Cloudflare スタック上でリモートMCP サーバーを構築するメリット (スケーラビリティ・コスト)

* スケーラビリティ: Cloudflare Workersはエッジで動作し容易にスケール。Webサービス本体と独立してスケール可能。
* コスト（未検証）: 常時起動インスタンス不要、リクエストに応じたWorker起動で維持コスト低減のはず。
* ![Slide 30](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_30.jpg)

### 32. Cloudflare スタック上でリモートMCP サーバーを構築するメリット (SDK・比較)

* 充実したSDK: Cloudflare基盤での実装を容易にするSDK (<https://github.com/cloudflare/agents>)。
* 認証認可ライブラリも提供 (<https://github.com/cloudflare/workers-oauth-provider>)。
* ただし、Vercel Functionsにも当てはまるメリットが多いため比較が必要（未実施）。
* ![Slide 31](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_31.jpg)

### 33. 実装デモ

* (セクションタイトルのみ)
* ![Slide 32](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_32.jpg)

### 34. デモの手順 (リポジトリ・ガイド)

* デモ用リポジトリ: <https://github.com/syumai/mcp/tree/main/aidevmeetup-demo>
* Cloudflareガイドベース: <https://developers.cloudflare.com/agents/guides/remote-mcp-server/>
* ![Slide 33](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_33.jpg)

### 35. デモの手順 (詳細)

1. `calculator`リモートMCPサーバーをテンプレートから作成 (`pnpm create cloudflare@latest ...`)。
2. ローカルでMCPサーバー起動、インスペクタから呼び出し (`npx @modelcontextprotocol/inspector@latest ...`)。
3. 数値のべき乗計算機能を追加。
4. Cloudflareにデプロイ。
5. Cloudflare AI Playgroundで動作確認 (<https://playground.ai.cloudflare.com/>)。

* ![Slide 34](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_34.jpg)

### 36. (デモ画面キャプチャ等 - 画像のみ)

* ![Slide 35](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_35.jpg)

### 37. まとめ

* 一般向け用途ではローカルMCPよりリモートMCPが本命。
* リモートMCPサーバーはWebサービス本体APIサーバーとは分離が望ましい。
* リモートMCPサーバーはプロキシ兼プロトコル変換レイヤーとして扱う。
* 構築にはCloudflare利用が手軽でおすすめ。
* ![Slide 36](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_36.jpg)

### 38. ご清聴ありがとうございました

* (謝辞)
* ![Slide 37](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_37.jpg)

### 39. おまけ

* (セクションタイトルのみ)
* ![Slide 38](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_38.jpg)

### 40. おすすめ記事

* azukiazusa氏のCloudflare/VercelリモートMCPサーバーデプロイ記事。
  * <https://azukiazusa.dev/blog/cloudflare-mcp-server/>
  * <https://azukiazusa.dev/blog/vercel-mcp-server/>
* ![Slide 39](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_39.jpg)

### 41. Tips

* ローカルMCPサーバーにしか繋げないクライアントからリモートMCPサーバーに繋ぐ方法。
* Cloudflare製 `mcp-remote` (<https://www.npmjs.com/package/mcp-remote>) を使用。
* `npx mcp-remote` でリモートMCPサーバーへのプロキシをローカルに作成。
* ![Slide 40](https://files.speakerdeck.com/presentations/1b7a897e3b1f41d3a3b5750febe8cc35/slide_40.jpg)
