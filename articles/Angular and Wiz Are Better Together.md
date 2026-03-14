---
title: "Angular and Wiz Are Better Together"
source: "https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a"
author:
  - "[[Jatin Ramanathan]]"
  - "[[Minko Gechev]]"
published: 2024-03-29
created: 2026-03-14
description: "GoogleのWebフレームワークであるAngularとWizの統合計画を発表。Wizのパフォーマンス最適化技術とAngularの開発者体験を融合し、SSR・部分ハイドレーション・Signalsなどの機能を段階的に統合していく方針を解説。"
tags:
  - "clippings"
  - "Angular"
  - "Wiz"
  - "Web Performance"
  - "SSR"
  - "JavaScript"
  - "TypeScript"
  - "Google"
---

## 概要

GoogleにはAngularとWizという2つのWebフレームワークが存在する。Angularは高いインタラクティブ性を持つアプリケーション向け、Wizはパフォーマンスが重要なアプリケーション向けに設計されてきた。近年、両者のユースケースが重なり始めたことを受け、AngularチームとWizチームはそれぞれの強みを融合する長期計画を発表した。最終的にはWizの機能をAngularにオープンソースとして段階的に統合していく方針である。

## 主要なトピック

### Angular と Wiz の位置づけ

- **Angular**: 高いインタラクティブ性を持つアプリ向け。開発者体験と複雑なUIの迅速な構築を優先。Google内で数千のエンジニア・アプリが使用。例: [Gemini](https://gemini.google.com/)、Google Analytics
- **Wiz**: パフォーマンスが重要なアプリ向け。Google内部フレームワーク。例: [Google Search](https://google.com/)、[Google Photos](https://photos.google.com/)、[Google Payments](https://payments.google.com/)、YouTube

### Wiz とは何か

Wizは低速ネットワークや低スペックデバイスのユーザーに対応するため、以下のアプローチを取る：

- **SSRファースト**: すべてのコンポーネント（インタラクティブなものを含む）を高度に最適化されたストリーミングソリューションでサーバーサイドレンダリング
- **最小限のJavaScript**: 初期レンダリングのクリティカルパスからほとんどのJavaScriptを排除。実際にページ上にレンダリングされたインタラクティブコンポーネントに必要なコードのみを読み込む
- **イベントリプレイ**: 小さなインラインライブラリがルートでユーザーイベントをリッスンし、クライアントサイドでイベントをドロップしないようにリプレイする

このアプローチはエンドユーザーに最高のパフォーマンスを提供する一方、開発者にとっての複雑さが増すというトレードオフがある。

### 要件の融合（Blending Requirements）

近年、パフォーマンス重視のアプリとインタラクティブ重視のアプリの境界が曖昧になっている：

- パフォーマンス重視のアプリ → ユーザーエンゲージメントのためにより多くの機能を高速に提供する必要性
- インタラクティブ重視のアプリ → より多くのJavaScriptを配信するようになっている

### すでに実現されている成果

#### Angular → Wiz 方向の貢献

- **Angular Signals**: WizがAngularのSignalsライブラリを採用。**YouTubeのUI**を駆動し、数十億のデバイスで稼働中。従来の「開発者が手動でメモ化する」アプローチから脱却し、きめ細かなUI更新を実現。実証可能なパフォーマンス改善を達成。

#### Wiz → Angular 方向の貢献

- **Deferrable Views（`@defer`）**: Wizのきめ細かなコード読み込みに着想を得た機能
- **部分ハイドレーション（Partial Hydration）**: Wizのイベント委譲ライブラリに着想を得た探索的機能

### 今後の方向性

- **長期目標**: 今後数年をかけて、段階的かつ責任ある形でAngularとWizを統合
- **戦略**: Wizの機能をAngularを通じてオープンソース化。オープンな開発モデルに従い、コミュニティがロードマップに影響を与え、計画を立てられるようにする
- **プロセス**: 公開RFCプロセスを使用してコミュニティからのフィードバックを収集
- **SSRの重要性**: GoogleはSSRがWebプラットフォームにとって重要であると確信しており、正しく実装されたSSRはエンドユーザー体験にプラスの影響を与えると述べている

## 重要な事実・データ

- **JavaScript増加率**: 過去6年間でデスクトップで**37%以上**、モバイルで**36%以上**のJavaScript増加（[HTTPArchive](https://httparchive.org/reports/state-of-javascript?lens=top1m&start=2018_06_01&end=latest&view=list) トップ100万サイト調査）
- **Angular Signals on YouTube**: YouTubeのUIでAngular Signalsが採用され、数十億デバイスで稼働
- **Google Search & Gmail**: Angular Signalsの導入により、世界最大規模のサイトでのパフォーマンス改善が期待されている

## 結論・示唆

### 著者の結論

AngularとWizの統合は、開発者体験とパフォーマンスの両立を目指すものであり、開発者はもはやどちらかを選ぶ必要がなくなる。SSRはWebプラットフォームにとって重要であり、Google SearchやYouTubeを支えるキーライブラリを使ってコミュニティと共にイノベーションを進めたいという意向が示された。

### 実践的な示唆

- Angular開発者は`@defer`（Deferrable Views）や部分ハイドレーションなどの新機能を活用することで、Wiz由来のパフォーマンス最適化の恩恵を受けられる
- Angular Signalsは単なるAngularの機能ではなく、YouTube等の大規模プロダクションで実証済みの技術である
- 今後のAngularアップデートにはWiz由来の機能が段階的に含まれるため、Angular公式のRFCプロセスに注目すべき

## 制限事項・注意点

- 統合は「数年」かけて段階的に行われるため、すぐに完全な統合は実現しない
- Wizはオープンソースではなく、機能はAngularを通じて段階的に公開される形式
- SSRファーストのアプローチは高インタラクティブなアプリケーションでは開発の複雑さが増すトレードオフがある

---

*Source: [Angular and Wiz Are Better Together](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)*
