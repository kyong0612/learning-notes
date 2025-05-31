---
title: "Wake up, Remix!"
source: "https://remix.run/blog/wake-up-remix"
author:
  - "Michael Jackson"
  - "Ryan Florence"
published: 2025-05-26
created: 2025-05-30
description: "RemixチームがRemix v3の新しい方向性を発表。React Routerとの統合を経て、Reactに依存しない、よりシンプルでWebプラットフォームに近いフレームワークへの転換を宣言。"
tags:
  - "remix"
  - "web-framework"
  - "react-router"
  - "preact"
  - "web-development"
  - "rsc"
  - "full-stack"
  - "modular-toolkit"
---

![Neon glowing compact disc coming up behind a hill as if it were the rising sun.](https://remix.run/blog-images/headers/wake-up-remix.jpg)

# Wake up, Remix

**著者**: Michael Jackson (Co-Founder), Ryan Florence (Co-Founder)  
**発表日**: 2025年5月26日  
**出典**: [Remix Blog](https://remix.run/blog/wake-up-remix)

---

## 概要

RemixチームがRemix v3の根本的な新方向を発表。React RouterとRemixの統合が完了した今、Remixは従来のReactフレームワークから脱却し、Webプラットフォームに近い、より軽量でシンプルなフレームワークへと進化することを宣言した。

---

## 背景：Remixの「昼寝」から目覚めまで

### React Confでの発表

2024年夏のReact ConfでRemixが「昼寝をする（take a nap）」ことが発表された。

### 統合の理由

- **技術的重複**: Remix v2がReact Routerの薄いラッパーになっていた
- **人工的な分離**: 2つのプロジェクト間に不必要な境界が生まれていた
- **解決策**: バンドラーとサーバーランタイムコードをRemixからReact Router v7に移行

### 統合の成果

- React Router v7「フレームワークモード」への統合完了
- RSC（React Server Components）サポートの限定的追加
- 2024年11月にv7リリース、先週RSCサポートをプレビュー

---

## React Router v7の予想外の成功

### 技術的成果

- **スムーズな段階的採用**: LoaderとActionから直接サーバーコンポーネントを返すパス
- **サーバー専用ルート**: 一流のサポートを提供
- **アーキテクチャの完成度**: Remixが目指していた方向性を実現

### 採用実績と信頼性

- **大規模採用**: Shopify、X.com、GitHub、ChatGPT、Linear、T3Chatなど
- **広範囲な利用**: 約1,100万のGitHubプロジェクト
- **安定性**: 専任チーム、長期的支援、[オープンガバナンスモデル](https://github.com/remix-run/react-router/blob/main/GOVERNANCE.md)

---

## Remix v3：新しい道筋

### 現状認識

- **Webプラットフォームの進歩**: 過去数年間で大きな進展
- **複雑性の増大**: モダンWeb開発が「ツールチェーンのナビゲーション」のように感じられる
- **重い感覚**: 抽象化レイヤーが増加し、開発体験が重くなっている

### ビジョン

Remix v3は単なる新バージョンではなく、**Webフレームワークの再定義**を目指している。

#### 核心的変更

- **React依存の解消**: 重要な依存関係からの脱却
- **Preactフォークの採用**:
  - 成熟した仮想DOMライブラリ
  - Shopify、Googleなどで重用済み
- **フルスタック所有**: 制御できない抽象化レイヤーに依存しない

#### 提供価値

- **モジュラーツールキット**:
  - ファーストクラスのデータベースドライバー
  - 組み込みコンポーネントライブラリ（Reach UIの復活も予告）
  - 個別でも統合でも機能

---

## 6つの開発原則

### 1. モデルファースト開発（Model-First Development）

- **AI時代への対応**: AIが人間-コンピュータ相互作用モデルを根本的に変化
- **LLM最適化**: ソースコード、ドキュメント、ツール、抽象化をLLM向けに最適化
- **製品内AI**: 開発ツールとしてだけでなく、製品内でモデルを使用する抽象化を開発

### 2. Web APIの基盤（Build on Web APIs）

- **統一された抽象化**: スタック全体での抽象化共有によりコンテキストスイッチングを削減
- **JavaScriptエコシステム**: 唯一のフルスタックエコシステムとしてのWeb APIとJavaScript

### 3. 宗教的なランタイム志向（Religiously Runtime）

- **バンドラー/コンパイラー設計の問題**: 静的解析前提の設計は不適切なAPIにつながる
- **ランタイム最優先**: すべてのパッケージは静的解析の期待なしに設計
- **例外**: TypeScriptとJSXの簡単な変換のための`--import`ローダーは許可

### 4. 依存関係の回避（Avoid Dependencies）

- **ロードマップの束縛**: 依存関係は他者のロードマップに縛られることを意味
- **慎重な選択**: 賢明に選択し、完全にラップし、最終的に独自パッケージで置換
- **目標**: ゼロ依存

### 5. 構成可能性の要求（Demand Composition）

- **単一目的・置換可能**: 抽象化は既存プログラムに簡単に追加・削除可能
- **独立性**: すべてのパッケージは他のコンテキストから独立して有用
- **モジュール分割**: 新機能はまず新パッケージとして試行

### 6. 結束力のある配布（Distribute Cohesively）

- **学習の困難さ**: 極度に構成可能なエコシステムは使いにくい
- **単一ツールボックス**: すべてのパッケージを単一パッケージ（remix）として再エクスポート

---

## 今後の展開

### コミュニティとの協力

- [**Remix Jam**](https://remix.run/jam)での進捗共有
- コミュニティとの積極的な対話を呼びかけ

### 開発状況

- プレビューリリースはまだ準備中
- 上記6原則が開発指針として確立

---

## 重要な結論

### パラダイムシフト

この発表は、Remixが**モダンWeb開発の複雑性に対する根本的な挑戦**を表している：

1. **脱React**: 特定のフレームワークへの依存からの解放
2. **Webプラットフォーム回帰**: より直接的でシンプルなWeb開発体験
3. **AI時代への適応**: LLMとの協調を前提とした設計思想
4. **開発者体験の改善**: 「ツールチェーンのナビゲーション」から「Webのための構築」へ

### 技術的意義

- **フルスタック所有**: 外部依存を最小化した完全制御
- **モジュラー設計**: 柔軟性と使いやすさのバランス
- **実績ある技術**: Preactなど、既に実証済みの技術の活用

この発表は、Web開発の未来に対するRemixチームの明確なビジョンと、より軽量で効率的な開発体験への強いコミットメントを示している。
