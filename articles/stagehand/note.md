---
title: stagehand
source: https://github.com/browserbase/stagehand
author:
published:
created: 2025-04-20
description: |
  Stagehandは、シンプルさと拡張性に焦点を当てたAIによるウェブブラウジング自動化フレームワークです。
tags:
  - AI
  - Web Automation
  - Playwright
  - Browser Automation
  - TypeScript
---

ref: <https://github.com/browserbase/stagehand>

## Stagehand GitHubリポジトリ概要

Stagehandは、シンプルさと拡張性に焦点を当てたAIによるウェブブラウジング自動化フレームワークです。

### 主な目的と利点 (Why Stagehand?)

- **コードと自然言語の選択**: 慣れないページのナビゲーションにはAIを、明確な操作にはコード（Playwright）を使用できます。これにより、開発者は低レベルのコード記述（Selenium, Playwright, Puppeteerなど）と、本番環境では予測不可能な高レベルエージェントとの間のギャップを埋めることができます。
- **アクションのプレビューとキャッシュ**: AIアクションを実行前にプレビューでき、繰り返しのアクションを簡単にキャッシュして時間とトークンを節約できます。
- **Computer Useモデルの統合**: OpenAIやAnthropicの最新のComputer Useモデルを一行のコードでブラウザに統合できます。

### 機能と使用例 (Example)

- **Playwright関数**: `page.goto()` のようなPlaywright関数を直接利用できます。
- **`act()`関数**: 「stagehandリポジトリをクリック」のような自然言語で個別のブラウザ操作を実行します。
- **Computer Useエージェント**: より大きなタスク（例：「最新のPRに移動」）をエージェントに指示できます。
- **`extract()`関数**: ページから構造化データ（例：PRの著者とタイトル）を抽出します。 Zodスキーマを使用して抽出するデータの形式を指定できます。

*(注: リポジトリにはデモGIFが含まれていますが、ここでは表示できません。詳細は元のページを参照してください)*

### ドキュメントと開始方法 (Documentation & Getting Started)

- **ドキュメント**: 詳細な情報は [docs.stagehand.dev](https://docs.stagehand.dev/) で確認できます。
- **開始方法**: `npx create-browser-app` コマンドで簡単にプロジェクトを開始できます。[Quickstart Guide](https://docs.stagehand.dev/get_started/quickstart) も参照してください。
- **ソースからのビルド**: リポジトリをクローンし、`npm install`, `npx playwright install`, `npm run build` を実行することでソースからビルドできます。LLMプロバイダーやBrowserbaseのAPIキーを設定すると、より効果的に利用できます。

### コントリビューション (Contributing)

- コントリビューションは歓迎されていますが、事前にSlackコミュニティで開発者（Anirudh Kamath または Paul Klein）に連絡することが推奨されます。
- 重点項目は、信頼性、速度、コストの順です。
- 詳細は [Contributing Guide](https://docs.stagehand.dev/contributions/contributing) を参照してください。

### 謝辞 (Acknowledgements)

- このプロジェクトは、ウェブ自動化の基盤として [Playwright](https://playwright.dev/) に大きく依存しています。
- [tarsier](https://github.com/reworkd/tarsier), [gemini-zod](https://github.com/jbeoris/gemini-zod), [fuji-web](https://github.com/normal-computing/fuji-web) などのプロジェクトの技術や発見にも影響を受けています。
- 主要な貢献者への謝辞が記載されています。

### ライセンス (License)

- MITライセンスの下で公開されています。

### 技術スタックと言語

- 主にTypeScriptで書かれています。
