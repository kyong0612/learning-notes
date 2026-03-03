---
title: "How Spotify is Making Their Design System AI-Ready"
source: "https://www.intodesignsystems.com/blog/how-spotify-design-system-ai-ready"
author:
  - "[[Sil Bormüller]]"
published: 2026-02-22
created: 2026-03-03
description: "How Spotify is making Encore AI-ready with an MCP server, machine-readable documentation, and layered architecture. Key learnings from Victoria Tholerus (Web Engineer) and Aleksander Djordjevic (Senior Product Designer) at the Into Design Systems Meetup Stockholm."
tags:
  - "clippings"
  - "design-system"
  - "AI"
  - "MCP"
  - "Spotify"
  - "component-architecture"
---

## 概要

SpotifyのデザインシステムEncoreをAI時代に適応させるための戦略。MCPサーバーの構築、機械可読ドキュメント、レイヤード・アーキテクチャの導入により、人間とAIの双方をサポートするデザインシステムへと進化させている。Into Design Systems Meetup Stockholm での Victoria Tholerus（Web Engineer）と Aleksander Djordjevic（Senior Product Designer）の発表に基づく。

---

## 誰も語らない問題：AIがデザインシステムを迂回する

AIの普及により、チームはデザインドキュメントを確認する前にAIエージェントに相談するようになった。これはデザインシステムを完全にバイパスするリスクを生む。

Victoria と Aleksander が提起した問い：

> "AIがチームメイトの代わりになったとき、何が起きるのか？"

**具体的なリスク：**
- デザインシステムの存在意義の喪失
- デザインシステムの採用率低下
- 非準拠のカスタムコード増加
- UIの一貫性の崩壊

> "AIは自分で正解を見つけられない。ユーザーを別の道に導いてしまう。" — Aleksander Djordjevic

対策を講じなければ、開発者はEncore ガイドラインに従わないAI生成ソリューションを使い始め、カスタム実装が増加しデザインシステムの採用率が低下する。

---

## Spotifyの戦略的転換

Spotifyはデザインシステムの目的を再定義した。

**従来:** 人間のためだけに提供  
**新方針:** 人間と機械の両方をサポート

> "人間にとって良いだけでなく、機械にとっても良いシステムになるにはどうすればよいか？"

これにより2つの並行イニシアチブが始動：

1. **機械可読ドキュメント** — MCPを通じてAIエージェントがデザインシステムのルールにアクセス可能にする
2. **コンポーネント・アーキテクチャの再設計** — 硬直的なバンドルから柔軟なレイヤー構造へ移行

---

## MCPサーバーの構築

SpotifyはEncore用のMCPサーバーを構築した。ドキュメントがAIエージェントに直接公開され、CursorなどのツールがSpotifyの標準に準拠したコードをそのまま生成できるようになった。

**テストフレームワークによる品質評価：**
- ビジュアル出力の評価（Spotifyではプロトタイプもコードと同等に重要）
- 類似度スコアの計測
- Lintエラーの検出
- 生成コンポーネントとEncoreコンポーネントの比較

さらに、異なるMCPツール同士を比較し、ユーザーにとって最も価値の高いものを見極めている。

---

## アーキテクチャ設計：3つの主要パターン

### 1. レイヤード・アーキテクチャ
すべてを3つの独立したレイヤーに分離：

| レイヤー | 役割 |
|---|---|
| コンポーネント動作レイヤー | インタラクションロジック |
| コンポーネントスタイルレイヤー | ビジュアル表現 |
| ファウンデーションレイヤー | 基盤となるトークン・ルール |

### 2. ヘッドレスコンポーネント
React ARIA や Base UI などのシステム上に構築。インタラクションロジックはこれらが提供し、Encoreはブランド・アクセシビリティ・一貫性に集中する。

### 3. フリクションの低減
- **人間向け:** イノベーションのスピードで作業可能
- **機械向け:** コンテキストバブルが大幅に縮小。AIは基礎、ボタンのコンテキスト、ヘッドレスシステム（既にトレーニングセットに含まれる）を理解しやすくなる

> "AIにとってのハードルも大幅に取り除いている。" — Aleksander Djordjevic

---

## デザインシステムに応用可能な5つのパターン

| パターン | 内容 |
|---|---|
| **Presence（存在）** | AIが活動する場所にデザインシステムが存在しなければバイパスされる |
| **Structure Over Generation（生成より構造）** | 生成機能よりも制約が一貫性を実現する |
| **Flexible Over Rigid（硬直より柔軟）** | レイヤードアーキテクチャは硬直的なコンポーネントバンドルよりスケールしやすい |
| **Test Real Output（実出力のテスト）** | AI生成コードを自社基準と照合するフレームワークを構築する |
| **Infrastructure Mindset（インフラ思考）** | 人間・機械・開発速度の全てをサポートする必要がある |

---

## 実践のためのチェックリスト

デザインシステムをAI対応にする際に問うべき3つの質問：

- [ ] AI生成出力を自社基準と照合してテストしているか？
- [ ] AIツールがデザイントークンやコンポーネント仕様にアクセスできるか？
- [ ] ドキュメントは人間だけでなく機械向けにも構造化されているか？

**重要な結論：** すべての基盤は**機械可読ドキュメント**にある。その上に他のすべてが構築される。
