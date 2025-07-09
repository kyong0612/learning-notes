---
title: "モダンなフロントエンドにおけるテストについて ［Modern Featured Test］"
source: "https://gihyo.jp/article/2025/06/ride-modern-frontend-09#gh17S4zmML"
author:
  - "nus3"
published: 2025-07-08
created: 2025-07-09
description: |
  モダンなWebフロントエンド開発におけるテストのツールや手法は多様化しています。本記事では、Jest、Vitest、Deno/Bunなどのテストフレームワークの比較から、UIコンポーネントを対象とした`jsdom`利用のテスト、Vitest Browser ModeやStorybookを活用したブラウザ環境でのテストまで、具体的な導入方法や特徴を解説します。
tags:
  - "frontend"
  - "test"
  - "jest"
  - "vitest"
  - "storybook"
  - "react"
  - "typescript"
---

## TL;DR

この記事では、モダンなフロントエンド開発におけるテストの進化と現状について解説します。React、TypeScript、ES Modulesなどの普及に伴い、テストのツールや手法も大きく変化しました。特にUIコンポーネントのテスト手法が充実し、プロジェクトの状況に応じた柔軟な選択が可能になっています。

- **テストフレームワーク**:
  - **Jest**: 長い実績を持つが、TypeScriptのトランスパイルには`babel-jest`、`ts-jest`、`@swc/jest`などが必要。`@swc/jest`が最も高速。
  - **Vitest**: Viteネイティブで設定が容易。ESMファーストでTypeScriptを標準サポートし、採用が増加。
  - **Deno/Bun**: ランタイムにテスト機能が組み込まれており、設定不要でTypeScriptのテストが可能。
- **UIコンポーネントテスト**:
  - **Node.js環境**: `jsdom`や`happy-dom`を使い、ブラウザをエミュレートして高速にテストを実行。ただし、`z-index`のような実際のレンダリングに関わる問題は検出できない。
  - **ブラウザ環境**: Vitestの**Browser Mode**やStorybookを使い、実際のブラウザでテストを実行。より信頼性が高いが、実行速度は遅くなる。
    - **Vitest Browser Mode**: PlaywrightやWebdriverIOと連携し、実際のブラウザでテストを実行。
    - **Storybook**: `play`関数でユーザー操作を定義し、視覚的に確認しながらテスト可能。`@storybook/test-runner`や`@storybook/addon-vitest`で自動テストも実現。

結論として、テストの選択肢が増えたことで、各プロジェクトに最適な手法を選びやすくなりました。本記事がその選択の一助となることを目指します。

---

## 本連載について

はじめまして！ サイボウズ フロントエンドエキスパートチームのnus3です。

本連載では、Webフロントエンドに関してもう一歩踏み込んだ知識について、サイボウズフロントエンドエキスパートチームのメンバーによって不定期で解説記事を掲載しています。

本記事では、モダンフロントエンドにおけるテストについて、その種類や導入方法などを紹介します。

> [!NOTE]
> 紹介するライブラリやツールについては執筆時点（2025年5月15日）の情報を元にしており、以降のバージョンアップにより、本記事で紹介した内容が変更されている可能性があります。

## モダンフロントエンドでのテスト

ここ数年のWebフロントエンドでは次のように、さまざまな変化がありました。

- ReactやVue.jsといった宣言的UIを採用したライブラリの普及
- TypeScript中心としたエコシステムの発展
- ES Modulesの採用の広がり
- ViteやSWC、RspackやTurbopackなどの新しいビルドツールの登場

この変化に合わせて、Webフロントエンドを対象にしたテストのツールや手法も増えてきました。

特にUIコンポーネントを対象にしたツールや手法が増えた点が大きく変わった点です。これは、宣言的UIライブラリの普及でコンポーネントベース開発が主流になったことが要因です。

また、Vitestのようにビルドツールと同じ条件でテストを実行できるフレームワークや、DenoやBunのようにテスト機能を内蔵するランタイムが登場し、テスト導入のハードルは下がりました。

本記事では、これらの変化を踏まえ、以下のテストを取り上げます。

- 主なテストフレームワークでのテスト例
- UIコンポーネントを対象にしたテスト

## 主なテストフレームワークでのテスト例

TypeScriptで書かれたコードは、JavaScriptにトランスパイルされてから実行されます。これはテストでも同様です。

簡単な加算関数を例に、各フレームワークの特徴を確認します。

### Jest

[Jest](https://jestjs.io/)は多くのライブラリに対応したテストフレームワークです。長く運用され、多くのプロジェクトで利用されています。

![Jestのnpm trendsのStats](https://gihyo.jp/assets/images/article/2025/06/ride-modern-frontend-09/jest.png)

JestでTypeScriptをテストするには、`transform`オプションでトランスパイラを指定する必要があります。

- **Babel**: `@babel/preset-typescript`と`babel-jest`を使い、Babelの設定に従ってトランスパイルします。型チェックは行われません。
- **ts-jest**: テスト実行時に型チェックも行います。
- **@swc/jest**: Rust製のSWCを使い高速にトランスパイルします。型チェックは行いません。

手元での実行時間比較では、`@swc/jest`が最も高速でした。

| トランスフォーマー | 実行時間 |
| --- | --- |
| Babel | 8.966 秒 |
| `ts-jest` | 7.055 秒 |
| `@swc/jest` | 1.239 秒 |

### Vitest

[Vitest](https://github.com/vitest-dev/vitest)はViteネイティブなテストフレームワークで、Viteの設定をテストでそのまま使えます。Jest互換のAPI、ES Modulesファースト、TypeScript/JSXのサポートなど、後発ならではの利点が多く、採用が増えています。

Vite自体がTypeScriptのトランスパイルをサポートしているため、特別な設定は不要です。

#### Rstest

[Rstest](https://github.com/web-infra-dev/rstest)は、Rust製バンドラであるRspackをベースとした開発中のテストフレームワークです。今後の動向が注目されます。

### DenoとBun

[Deno](https://deno.com/)と[Bun](https://bun.sh/)は、テストランナーを内蔵しており、設定不要でTypeScriptのテストを実行できます。

## UIコンポーネントを対象にしたテスト

ReactやVue.jsの普及に伴い、UIコンポーネントを対象にしたテストが重要になりました。Reactのフォームコンポーネントを例に見ていきましょう。

### Node.js環境でUIコンポーネントをテストする

JestやVitestと`jsdom`や`happy-dom`を組み合わせることで、Node.js環境でブラウザのDOMをエミュレートし、UIコンポーネントのテストが可能です。

Vitestでは`environment`オプションで`jsdom`を指定するだけで利用できます。`@testing-library/react`と組み合わせることで、コンポーネントの描画やユーザー操作のシミュレーションが容易になります。

ただし、`jsdom`はあくまでエミュレーションであり、要素の重なり（`z-index`）など、実際のブラウザのレンダリングを完全には再現できません。そのため、`jsdom`ではパスするテストが実際のブラウザでは失敗する可能性があります。

### ブラウザ環境でUIコンポーネントをテストする

実際のブラウザでテストを実行することで、より信頼性の高いテストが可能です。

#### Vitest Browser Mode

Vitestでは実験的な機能として[Browser Mode](https://vitest.dev/guide/browser/)を提供しています。PlaywrightかWebdriverIOと連携し、実際のブラウザ上でテストを実行します。

![VitestのBrowser Modeを使うことで、実際のブラウザ上でコンポーネントのテストが実行される](https://gihyo.jp/assets/images/article/2025/06/ride-modern-frontend-09/vitest-browser-mode.png)

Test Projects機能を使えば、Node.js環境とブラウザ環境のテストを一つの設定ファイルで管理できます。

### Storybook

[Storybook](https://storybook.js.org/)はUIコンポーネントの開発ツールですが、テスト機能も提供しています。

![Storybook上にフォームコンポーネントが描画される](https://gihyo.jp/assets/images/article/2025/06/ride-modern-frontend-09/storybook.png)

#### `play`関数を使ったStorybook上でのテスト

`play`関数を使うと、ユーザーの一連の操作を定義し、Storybook上で視覚的に確認できます。これにより、UIコンポーネントの状態変化をステップごとに追跡できます。

![Storybook上に追加されたInteractionパネルが表示される](https://gihyo.jp/assets/images/article/2025/06/ride-modern-frontend-09/interaction-addon.png)

#### `@storybook/test-runner`を使ったテスト

`@storybook/test-runner`は、`play`関数で定義したテストをJestとPlaywrightを使って実行するテストランナーです。

#### `@storybook/addon-vitest`を使ったテスト

`@storybook/addon-vitest`は、`play`関数で定義したテストをVitestのBrowser Modeで実行します。`@storybook/test-runner`と異なり、事前にStorybookを起動する必要がありません。

#### そのほか

このほかにも、[WebdriverIO](https://webdriver.io/docs/component-testing/)、[Playwright](https://playwright.dev/docs/test-components)、[Cypress](https://docs.cypress.io/app/component-testing/get-started)などがUIコンポーネントのブラウザテスト機能を提供しています。

## 最後に

Webフロントエンドの変化に伴い、テストの選択肢も増えました。これにより、プロダクトやプロジェクトに最適なテスト手法を選べるようになっています。本記事がその一助となれば幸いです。

## リポジトリ

本記事で紹介した内容は次のリポジトリにまとめています。

- <https://github.com/nus3/modern-frontend-test>
