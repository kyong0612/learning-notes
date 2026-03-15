---
title: "1M context is now generally available for Opus 4.6 and Sonnet 4.6"
source: "https://claude.com/blog/1m-context-ga"
author:
  - "[[Anthropic]]"
published: 2026-03-13
created: 2026-03-15
description: "Claude Opus 4.6とSonnet 4.6の1Mコンテキストウィンドウが一般提供開始。標準価格がフルウィンドウ全体に適用され、ロングコンテキストのプレミアム料金は不要。メディア制限も1リクエストあたり600画像/PDFページに拡大。"
tags:
  - "clippings"
  - "Claude"
  - "LLM"
  - "context-window"
  - "Anthropic"
  - "AI-platform"
---

## 概要

Claude Opus 4.6およびSonnet 4.6の**1Mトークンコンテキストウィンドウ**がClaude Platformにおいて一般提供（GA）となった。ロングコンテキストに対するプレミアム料金は廃止され、標準価格がフルウィンドウ全体に適用される。

## 価格体系

| モデル | 入力 (per 1M tokens) | 出力 (per 1M tokens) |
|---|---|---|
| **Opus 4.6** | $5 | $25 |
| **Sonnet 4.6** | $3 | $15 |

- **倍率なし**: 900Kトークンのリクエストも9Kトークンのリクエストも、同じトークン単価で課金される。

## GA での主な変更点

- **ベータヘッダー不要**: 200Kトークンを超えるリクエストが自動的に動作する。既にベータヘッダーを送信している場合は無視されるため、コード変更は不要。
- **メディア制限6倍に拡大**: 1リクエストあたり最大**600枚**の画像またはPDFページ（従来は100枚）。Claude Platform、Microsoft Azure Foundry、Google CloudのVertex AIで利用可能。
- **フルレートリミット**: 標準アカウントのスループットがウィンドウ全体に適用される。
- **単一価格**: ロングコンテキストプレミアムは廃止。

## Claude Code での対応

1Mコンテキストが**Claude Code**の**Max、Team、Enterpriseユーザー**向けにOpus 4.6で利用可能に。

- Opus 4.6セッションはフル1Mコンテキストウィンドウを自動的に使用
- **コンパクション（圧縮）の減少**により、会話全体がより多く保持される
- 以前は追加使用量が必要だったが、今後は標準で含まれる

## ロングコンテキストの精度

- Opus 4.6は**MRCR v2で78.3%**を達成 — フロンティアモデルの中で最高スコア
- Opus 4.6とSonnet 4.6の両方が、フル1Mウィンドウ全体で精度を維持
- 各モデル世代でロングコンテキスト検索の精度が向上

これにより、以下のような大規模データを直接ロードして使用可能：
- コードベース全体
- 数千ページの契約書
- 長時間稼働するエージェントのフルトレース（ツール呼び出し、観察、中間推論を含む）

従来必要だったエンジニアリング作業、損失のある要約、コンテキストのクリアは不要になる。

## ユーザーからの声（抜粋）

| 発言者 | 所属 | コメント要旨 |
|---|---|---|
| Anton Biryukov | Software Engineer | Datadog、Braintree、DB、ソースコードの検索で100K+トークンを消費した後のコンパクションでデバッグが堂々巡りに。1Mコンテキストにより一つのウィンドウで検索・集約・修正提案が可能に。 |
| Jon Bell | CPO | 大きなPDF・データセット・画像のロード時にコンパクションが発生し忠実度が低下していた。**コンパクションイベントが15%減少**。エージェントが数時間忘れずに稼働可能に。 |
| Adhyyan Sekhsaria | Founding Engineer (Devin) | 大きなdiffが200Kに収まらずチャンク化が必要だった。1Mコンテキストでフルdiffを投入し、よりシンプルでトークン効率の良いハーネスから高品質なレビューを実現。 |
| Mauricio Wulfovich | ML Engineer | 原告弁護士が400ページの証言録取書の相互参照やケースファイル全体の重要な関連性の抽出が可能に。 |
| Dr. Alex Wissner-Gross | Co-Founder | 数百の論文・証明・コードベースを一回のパスで合成し、基礎/応用物理学研究を劇的に加速。 |
| Bardia Pourvakil | Co-founder and CTO | 100ページの契約書の5回分の交渉を一つのセッションに持ち込み、交渉の全体像を把握可能に。 |
| Mayank Agarwal | Founder & CTO | 本番インシデントの全エンティティ・シグナル・仮説をアラートから修正まで一望でき、コンパクションや妥協が不要に。 |
| Izzy Miller | AI Research Lead | Opusのコンテキストを200Kから500Kに引き上げたところ、エージェントがより効率的に動作し、実際に全体のトークン使用量が減少。 |
| Tarun Amasa | CEO | 複雑なマルチステップの計画においてタスク遵守と細部への注意を維持可能。 |

## 利用可能なプラットフォーム

- **Claude Platform**（ネイティブ）
- **Amazon Bedrock**
- **Google Cloud Vertex AI**
- **Microsoft Foundry**
- Claude Code の Max、Team、Enterprise ユーザーは Opus 4.6 でデフォルトで1Mコンテキストが自動適用

## 関連リンク

- [ドキュメント](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- [料金表](https://platform.claude.com/docs/en/about-claude/pricing)
