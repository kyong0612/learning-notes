---
title: "agent-browserがRustネイティブになった今、playwright-cliとどちらを選ぶべきか"
source: "https://suntory-n-water.com/blog/agent-browser-vs-playwright-cli-revisit"
author:
  - "[[sui]]"
published: 2026-04-05
created: 2026-04-07
description: "agent-browserがRustネイティブになった今、playwright-cliと改めて比較しました。-i -cオプションでトークン差が約6%まで縮まり、前回の「40%差」は実質解消。ネットワーク監視・diff機能も含めた現時点の選択基準を整理します。"
tags:
  - "clippings"
  - "agent-browser"
  - "playwright-cli"
  - "browser-automation"
  - "AI-agent"
  - "Rust"
  - "token-optimization"
---

## 要約

Vercel の **agent-browser** (v0.21.4) が Rust ネイティブにリライトされたことを受け、Microsoft の **playwright-cli** (v0.1.5) と改めて比較検証した記事。前回の検証で約40%あったトークン消費量の差が、`-c`（compact）オプションの追加により**約6%まで縮小**し、機能面でも agent-browser が優位に立ったことを示している。

---

### 背景

- 2026年1月、Vercel の agent-browser と Microsoft の Playwright CLI がほぼ同時にリリースされた
- 著者は前回の記事で playwright-cli が約40%トークン節約できると検証したが、UXと速度の観点から agent-browser を選択していた
- その後 agent-browser が Playwright の Node.js ラッパから **Rust ネイティブ** に変更されたため、再検証を実施

### Rust化による変更点

#### アーキテクチャの変化
- **Rust化以前**: 内部で Playwright を呼び出し、Node.js ランタイムに依存
- **Rust化以後**: Playwright への依存を排除し、Chrome (Chromium) を**直接制御**する構造に変更
- 日常操作（`open`、`snapshot`、`click`、`eval`）の使用感はほぼ変わらず、機能の後退は見当たらない

#### 新機能: ネットワーク監視の強化

```bash
agent-browser network requests [--clear] [--filter <pattern>]
agent-browser network har start [path]
agent-browser network har stop
```

- `--filter` で画像やフォントを除外し API 通信だけを絞り込み可能
- **HAR ファイル** [^1] への書き出しに対応

#### 新機能: diff 機能

```bash
agent-browser diff snapshot            # 現在と前回のスナップショットを比較
agent-browser diff url <url1> <url2>   # 2ページの比較
```

- デプロイ前後のスナップショット差分確認や、2ページの比較に有用

#### Chromium カスタム設定

```bash
--executable-path <path>   # カスタム Chrome/Chromium バイナリの指定
--args <args>              # ブラウザ起動引数の指定（カンマ区切り）
--cdp <port>               # CDP [^2] 経由での接続
```

- 環境変数（`AGENT_BROWSER_EXECUTABLE_PATH`、`AGENT_BROWSER_ARGS`）でも設定可能
- Rust化による自由度の低下はなし

### トークン消費量の比較

前回と同条件（Yahoo! JAPAN 最新ニュース1件取得）で計測。

| ツール | 前回 | 今回 | 差分 |
| --- | --- | --- | --- |
| playwright-cli | 24.7K / 15% | 26.3K / 16% | +1.6K |
| agent-browser -i | 34.4K / 21% | 33.5K / 21% | -0.9K |
| **agent-browser -i -c** | — | **28.0K / 18%** | — |

> パーセンテージはコンテキストウィンドウ使用率

**重要な発見:**
- Rust化自体のトークン影響は軽微（34.4K → 33.5K）
- **`-c` オプション** の追加で 28.0K まで削減、playwright-cli との差が **約39% → 約6%** に縮小
- playwright-cli 側の 1.6K 増加は Yahoo! JAPAN のページ構成変化によるもの
- 処理速度は agent-browser のほうがコマンドレスポンスが速い

### 機能比較表

| 観点 | playwright-cli | agent-browser |
| --- | --- | --- |
| トークン消費量 | ○ 26.3K | ○ 28.0K (`-i -c`) / △ 33.5K (`-i`) |
| 使用感・UX | △ | ◎ Rust化後も良好 |
| ネットワーク監視 | △ フィルタなし | ◎ `--filter` 付き + HAR対応 |
| Chromium自由度 | ○ Playwright資産 | ○ `--executable-path` / `--args` 対応 |
| Playwright APIコード実行 | ◎ `run-code` コマンドあり | なし |
| ブラウザコンテキストでのJS実行 | ◎ `eval` | ◎ `eval` |
| diff・ビジュアル比較 | なし | ◎ スナップショット・スクリーンショット・URL比較 |
| iOS Simulator対応 | なし | ◎ `-p ios` で対応 |

**補足:**
- `eval` は両ツールともブラウザのページコンテキストで JS を実行するコマンド
- playwright-cli の `run-code` は Playwright SDK のコード（`page.on('request', ...)` など）をそのまま実行する固有機能。カスタムイベントリスナを仕込むような高レベル API が必要な場合に有効
- ネットワーク監視は playwright-cli でも `run-code` 経由で可能だが、agent-browser のように1コマンドでは完結しない
- スクレイピングや画面操作の大半は `eval` の範囲で完結する

### 結論

- **`-c` オプション** により agent-browser のトークン消費は 28.0K まで削減され、playwright-cli（26.3K）との差は**約6%**に縮小。前回の「約40%差」は実質解消
- ネットワーク監視（`--filter` + HAR）と diff 機能の強化により、**機能面でも agent-browser が優位**
- **playwright-cli を選ぶ理由は `run-code` による Playwright API 直接実行が必要な場合に限定**される
- Chromium のカスタム設定は `--executable-path` と `--args` で引き続き対応可能、互換性面での不安はなし

### 検証環境

- agent-browser = 0.21.4
- playwright-cli = 0.1.5

### 参考

- [GitHub - vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
- [GitHub - microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)
- [playwright-cli と agent-browser のトークン消費量を比較する記事（前回）](https://suntory-n-water.com/blog/playwright-cli-vs-agent-browser-token-comparison/)
- [agent-browserをPlaywright MCPと比較検証してみた](https://suntory-n-water.com/blog/i-tried-using-agent-browser)

[^1]: HTTP Archive の略。ブラウザがやりとりしたHTTPリクエスト/レスポンスを記録したJSONファイル。デバッグやパフォーマンス分析に使われる。
[^2]: Chrome DevTools Protocol の略。Chromeの開発者ツールが使う通信プロトコルで、外部ツールからブラウザを制御するために使用される。
