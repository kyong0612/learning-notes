---
title: "Chrome DevTools MCP で AI エージェントのフロントエンド開発をサポートする"
source: "https://azukiazusa.dev/blog/chrome-devtools-mcp/"
author:
  - "azukiazusa"
published: 2025-09-27
created: 2025-09-28
description: "Chrome DevTools MCP を用いることで、AI エージェントが Puppeteer を通じてブラウザ操作・ログ取得・トレース分析を自動化し、フロントエンド開発のパフォーマンスやアクセシビリティ、エラーデバッグを効率化できる。"
tags:
  - "ai"
  - "mcp"
  - "claude-code"
  - "chrome-devtools"
  - "ai-agent"
---

## 導入

- フロントエンド開発では AI エージェントがブラウザ実行結果を直接取得できず、人手でコンソールログを共有する必要があるという課題を提示。
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) が Puppeteer 連携によりブラウザ操作、ログ取得、トレース収集を自動化し、フィードバックループを高速化すると解説。

![いちごパフェのイラスト](https://images.ctfassets.net/in6v9lxmm5c8/7MWQpUv9F2EyhF3VCjImu0/2cf9b69334dfff29af6fb5bcebd690f0/strawberry_parfait_16885.png?q=50&fm=webp)

## MCP サーバーのセットアップ

- MCP (Model Context Protocol) に対応した AI エージェントであればツールを問わず利用可能で、記事では Claude Code を例示。
- `claude mcp add chrome-devtools npx chrome-devtools-mcp@latest` でサーバー登録し、`/mcp` 実行で利用可能ツール群を確認する手順をスクリーンショット付きで紹介。

![](https://images.ctfassets.net/in6v9lxmm5c8/70HtfGzlOIaxF1yJNlkI22/f3c0fe38c1917eecc0b4bdc8112fedc3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.01.24.png?q=50&fm=webp)

## パフォーマンスの問題の特定

- ローカル開発サーバー (`http://localhost:5174`) を前提に、対象ページを開くプロンプト例を提示し `new_page` ツールでナビゲートする流れを説明。
- `performance_start_trace` で Web Vitals を取得し、LCP 6,566ms・TTFB 6,289ms・CLS 0.00 といった具体値、DocumentLatency/LCPBreakdown/ThirdParties などのインサイト例、ネットワークリクエスト分析の必要性を記録。
- `performance_analyze_insight` と `list_network_requests` でボトルネックを特定し、HTML 344KB・圧縮未適用・第三者スクリプト負荷などの改善策提案を Claude Code の分析ログごと掲載。

![](https://images.ctfassets.net/in6v9lxmm5c8/2KJ76mO73weqhoS8O7b0c8/70f3d66d23eac295d6f9ea8f83889ce5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.08.10.png?q=50&fm=webp)

![](https://images.ctfassets.net/in6v9lxmm5c8/3ZxzujL1WIFHcbgQYfzPXs/8c7f8a2324c1862cf03173077ad8fbe5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.17.46.png?q=50&fm=webp)

## アクセシビリティ上の問題を特定

- `take_snapshot` や `evaluate_script` を組み合わせ、`http://localhost:5173/blog/shorts/7KZCLXbHxoaCfJ92aES3uE/` での属性不足を自動検出する手順を説明。
- プログレスバーの `aria-valuetext` 欠如や検索ボタンの `aria-label` 未設定など、スクリーンリーダー配慮の欠落を AI が指摘する様子と推奨修正を要約。

![](https://images.ctfassets.net/in6v9lxmm5c8/6moEUsy7dLxavZMKd2X3J7/6931c3c43a1446c5e1fdc7b101ba102c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.01.08.png?q=50&fm=webp)

## コンソールのエラーを調査

- `http://localhost:3000/boards/cmbvl4wz80000f2zvno0k1wmd` を対象に、`take_snapshot`→`click`→`list_console_messages` の順で操作し、ダイアログの `aria-describedby` 欠如による warning を自律的に把握するフローを紹介。
- `click` や `fill` などのブラウザ操作ツールを組み合わせることで、修正後の再検証まで AI が担える点を強調。

![](https://images.ctfassets.net/in6v9lxmm5c8/4TsbB4wnUtfUAHzXYFCcHm/d9852d67fc565295070552d77d771300/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.07.38.png?q=50&fm=webp)

![](https://images.ctfassets.net/in6v9lxmm5c8/4DonMmNJS3oqVQ5lfbmyVk/1a445a26942f5f3b859b5aca75aeea1e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.10.26.png?q=50&fm=webp)

## まとめ

- AI エージェント開発で鍵となるフィードバックループを、Chrome DevTools MCP がブラウザ操作・パフォーマンス診断・アクセシビリティチェック・エラー調査まで自動化すると結論づける。
- パフォーマンス改善には本番ビルドでの検証・圧縮有効化・第三者スクリプト最適化などが必要で、開発環境の遅延が結果に影響する制約があると明記。

## 参考

- [AI エージェント用の Chrome DevTools（MCP）  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/chrome-devtools-mcp?hl=ja)
- [ChromeDevTools/chrome-devtools-mcp: Chrome DevTools for coding agents](https://github.com/ChromeDevTools/chrome-devtools-mcp)

## 記事の理解度チェック

- Chrome DevTools MCP を Claude Code に追加する正しいコマンドは `claude mcp add chrome-devtools npx chrome-devtools-mcp@latest` と復習問題で確認。
- 利用可能ツールの例とともに、`list_cookies` のような未サポートツールを識別させるクイズで理解を促す構成。
