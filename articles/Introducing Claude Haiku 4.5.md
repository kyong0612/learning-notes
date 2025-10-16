---
title: "Introducing Claude Haiku 4.5"
source: "https://www.anthropic.com/news/claude-haiku-4-5"
author:
  - "Anthropic"
published: 2025-10-15
created: 2025-10-16
description: "Anthropicの最新小型モデルClaude Haiku 4.5のリリースを発表。Claude Sonnet 4と同等のコーディング性能を、3分の1のコストと2倍以上の速度で提供。リアルタイムタスクやAIエージェントの並列処理に最適化されたフロンティアレベルの性能を持つモデル。"
tags:
  - "AI"
  - "Claude"
  - "LLM"
  - "coding"
  - "performance"
  - "Anthropic"
---

## 概要

Claude Haiku 4.5は、Anthropicが2025年10月15日にリリースした最新の小型モデルです。5か月前に最先端だったClaude Sonnet 4と同等のコーディング性能を、**3分の1のコスト**と**2倍以上の速度**で実現しています。

## 主要な特徴

### パフォーマンスとコスト効率

- **コスト**: $1/million入力トークン、$5/million出力トークン
- **速度**: Claude Sonnet 4.5の4〜5倍高速
- **性能**: 特定のタスク（Computer Use等）ではClaude Sonnet 4を上回る性能
- SWE-bench Verifiedでフロンティアモデルに匹敵するコーディング性能を実証

![SWE-bench Verifiedでのフロンティアモデル比較チャート](https://www-cdn.anthropic.com/images/4zrzovbb/website/1a27d7a85f953c5a0577dc19b507d6e1b93444d5-1920x1080.png)

### 最適なユースケース

1. **リアルタイム・低レイテンシータスク**
   - チャットアシスタント
   - カスタマーサービスエージェント
   - ペアプログラミング

2. **AIエージェントの並列処理**
   - Claude Sonnet 4.5が複雑な問題を多段階プランに分解
   - 複数のHaiku 4.5がサブタスクを並列で実行

3. **Claude Codeでの活用**
   - マルチエージェントプロジェクト
   - 高速プロトタイピング
   - より応答性の高いコーディング体験

## ベンチマーク結果

![主要ベンチマークでのフロンティアモデル比較表](https://www-cdn.anthropic.com/images/4zrzovbb/website/029af67124b67bdf0b50691a8921b46252c023d2-1920x1625.png)

Claude Haiku 4.5はAnthropicの最もパワフルなモデルの一つとして位置づけられています。

## パートナー企業からの評価

### Augment（Guy Gur-Ari, Co-Founder）
>
> フロンティア並みのコーディング品質と驚異的な速度とコスト効率を両立。Augmentのエージェントコーディング評価では、Sonnet 4.5の90%の性能を達成。

### Warp（Zach Lloyd, Founder & CEO）
>
> エージェントコーディング、特にサブエージェントのオーケストレーションとComputer Useタスクにおいて大きな前進。Warpでの開発が瞬時に感じられる応答性。

### Replit（Jeff Wang, CEO）
>
> 速度とコストを犠牲にせずに品質を提供。高速なフロンティアモデルとして、このクラスのモデルの将来を示している。

### Sourcegraph（Ben Lafferty, Staff Engineer）
>
> 深い推論とリアルタイムの応答性を両立したAIアプリケーションの構築を可能にする。

### Wrike（Andrew Filev, CEO）
>
> わずか6か月前なら最先端だった性能レベルを、Sonnet 4.5の4〜5倍の速度で実現し、まったく新しいユースケースを開拓。

### Bolt（Brad Axen, Tech Lead, AI）
>
> フィードバックループで動作するAIエージェントにとって、速度は新たなフロンティア。知性と高速出力を両立。

### Gamma（Jon Noronha, Co-Founder）
>
> スライドテキスト生成の指示追従において既存モデルを上回る性能（65% vs 44%）。ユニットエコノミクスにとって画期的。

### GitHub（Matthew Isabel, Distinguished Product Manager）
>
> GitHub Copilotに効率的なコード生成を提供。Sonnet 4と同等の品質でより高速。

## 安全性評価

Claude Haiku 4.5は詳細な安全性とアライメント評価を実施：

- **低リスクレベル**: 懸念される行動の発生率が低い
- **前モデルより改善**: Claude Haiku 3.5よりも大幅にアライメントが向上
- **最も安全なモデル**: 自動アライメント評価において、Sonnet 4.5およびOpus 4.1と比較して統計的に有意に低いミスアライメント行動率を示し、Anthropicの最も安全なモデルとなった
- **ASL-2分類**: CBRN（化学・生物・放射性・核）兵器の製造において限定的なリスクのみを示したため、より制限的なASL-3（Sonnet 4.5とOpus 4.1）ではなく、AI Safety Level 2（ASL-2）基準でリリース

詳細は[Claude Haiku 4.5 システムカード](https://www.anthropic.com/claude-haiku-4-5-system-card)を参照。

## 提供状況

### 利用可能なプラットフォーム

- **Claude Code**: 即座に利用可能
- **Claudeアプリ**: すべてのユーザーに提供
- **Claude API**: `claude-haiku-4-5`として利用可能
- **Amazon Bedrock**: 提供中
- **Google Cloud's Vertex AI**: 提供中

### 価格

- 入力: $1 per million tokens
- 出力: $5 per million tokens

Haiku 3.5とSonnet 4の両方に対するドロップイン置換として、最も経済的な価格帯で提供されています。

## Claude製品ラインナップでの位置づけ

- **Claude Sonnet 4.5**: 2週間前にリリースされた最前線モデルで、世界最高のコーディングモデル
- **Claude Haiku 4.5**: フロンティアに近い性能をより高いコスト効率で提供する新しい選択肢
- **ハイブリッド利用**: Sonnet 4.5が複雑な問題を分解し、複数のHaiku 4.5が並列でサブタスクを実行するマルチモデル戦略が可能

## 技術的詳細

完全な技術詳細と評価結果については、以下を参照：

- [システムカード](https://www.anthropic.com/claude-haiku-4-5-system-card)
- [モデルページ](https://www.anthropic.com/claude/haiku)
- [ドキュメント](https://docs.claude.com/en/docs/about-claude/models/overview)

## まとめ

Claude Haiku 4.5は、フロンティアレベルの性能と卓越したコスト効率・速度を両立した画期的なモデルです。リアルタイムタスク、AIエージェントのオーケストレーション、高速開発ワークフローに最適であり、Anthropicの最も安全なモデルとしても評価されています。開発者にとっては、プレミアムモデルの性能を維持しながら、使用制限内でより多くのタスクを実行できる強力な選択肢となります。
