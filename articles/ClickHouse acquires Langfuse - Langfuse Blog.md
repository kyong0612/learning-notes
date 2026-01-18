---
title: "ClickHouse acquires Langfuse - Langfuse Blog"
source: "https://langfuse.com/blog/joining-clickhouse"
author: "Max Deichmann, Marc Klingen, Clemens Rawert"
published: 2026-01-16
created: 2026-01-18
description: "ClickHouseがLLMエンジニアリングプラットフォームLangfuseを買収。オープンソースとセルフホスティングは維持され、ClickHouseのリソースによりパフォーマンス・信頼性・エンタープライズ対応が加速する。"
tags:
  - "LLM"
  - "observability"
  - "ClickHouse"
  - "Langfuse"
  - "acquisition"
  - "open-source"
  - "AI-engineering"
---

## 概要

ClickHouseがLangfuseを買収した。Langfuseは、LLMアプリケーションのトレーシング・評価・プロンプト管理を提供するオープンソースのLLMエンジニアリングプラットフォームである。

**ユーザーへの影響**: 現時点での変更はなく、ロードマップ・オープンソース方針・セルフホスティングサポートは継続される。

## 変わらないこと

- **オープンソース・セルフホスティング**: ライセンス変更の予定なし
- **Langfuse Cloud**: 同じ製品・エンドポイント・体験を維持
- **サポート**: 同じチャネル・SLAを維持

## 改善されること

| 領域 | 詳細 |
|------|------|
| **エンジニアリング** | ClickHouseチームとの連携によりパフォーマンス・信頼性が向上 |
| **エンタープライズ対応** | コンプライアンス・セキュリティの強化が加速 |
| **カスタマーサクセス** | ClickHouseの知見を活用したサポート体制の強化 |

## Langfuseの歴史

### 創業の背景
- 2023年初頭のY Combinator参加時に、LLMアプリ開発の課題（デバッグの難しさ、品質の非決定性、反復ループの複雑さ）を経験
- 「導入しやすく、セルフホストしやすく、実際のイテレーションに役立つ」トレーシング・評価プリミティブを構築

### アーキテクチャ進化

| バージョン | データベース | 理由 |
|-----------|-------------|------|
| v1-v2 | PostgreSQL | 迅速な出荷を優先 |
| v3 | ClickHouse | 高スループット取り込み＋高速分析読み取りに対応 |

![Consumption Growth](https://langfuse.com/blog/joining-clickhouse/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FConsumption.450a55cb.png&w=3840&q=75)

![Langfuse v3 Architecture](https://langfuse.com/blog/joining-clickhouse/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fog.6f8514df.png&w=3840&q=75)

## ClickHouseとの既存関係

買収前から両社は密接に連携していた：

- Langfuse CloudはClickHouse Cloudの大規模顧客
- ClickHouse社内でLangfuseを使用してエージェント製品を改善
- セルフホスティング向けにClickHouseベースのドキュメント・テンプレートを共同開発
- Langfuse v2→v3移行を通じて数千チームをClickHouseに紹介
- ベルリン、サンフランシスコ、アムステルダムで共同ミートアップを開催

> **ClickHouseにとってのインセンティブ**: LangfuseがClickHouse上で動作し、顧客とOSS展開を共有しているため、Langfuseを高速・信頼性・スケーラブルに保つ強い動機がある。

## 文化・エンジニアリングの適合性

両社で共有される価値観：
- オープンソースのアイデンティティと管理
- 開発者ファーストの製品感覚
- パフォーマンスと信頼性を製品機能として重視

## 今後のフォーカス

**北極星**: チームが本番データから改善されたプロンプト・評価・製品決定へのループを閉じ、有用で信頼性の高いエージェントを出荷できるよう支援する。

具体的な投資領域：

1. **プロダクションモニタリング・分析**: 実際のエージェントシステム向け（オフライン評価だけでなく）
2. **ワークフロー改善**: トレーシング・ラベリング・実験を横断したイテレーションループの短縮
3. **パフォーマンス・スケール向上**: 大規模セルフホスト・エンタープライズ展開向け
4. **UX・開発者体験の磨き込み**: 複雑化する領域でもシンプルさを維持

公開ロードマップ: [langfuse.com/docs/roadmap](https://langfuse.com/docs/roadmap)

## FAQ

| 質問 | 回答 |
|------|------|
| オープンソースは継続？ | はい。ライセンス変更の予定なし |
| セルフホストは可能？ | はい。ファーストクラスのパスとして維持 |
| Cloud顧客への影響は？ | なし。同じ製品・エンドポイント・契約 |
| サポート先は？ | 変更なし: https://langfuse.com/support |
| チームは継続？ | はい。全員がClickHouseに参加しLangfuse開発を継続。ベルリン・SFで採用中 |

## 関連リンク

- [v3インフラ移行の技術詳細](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)
- [ClickHouse Open Houseでの発表（動画）](https://www.youtube.com/watch?v=NXYQ5odATrM)
- [GitHub Discussion](https://github.com/orgs/langfuse/discussions/11593)
