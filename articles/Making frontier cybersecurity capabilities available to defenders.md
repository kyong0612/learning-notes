---
title: "Making frontier cybersecurity capabilities available to defenders"
source: "https://www.anthropic.com/news/claude-code-security"
author:
  - "[[@AnthropicAI]]"
published: 2026-02-20
created: 2026-02-22
description: "Anthropicが Claude Code Security を発表。Claude Codeに組み込まれた新機能で、コードベースのセキュリティ脆弱性を従来のルールベースツールでは見逃されがちな複雑な脆弱性まで検出し、人間のレビュー用にパッチを提案する。EnterpriseおよびTeam顧客向けに限定リサーチプレビューとして提供開始。"
tags:
  - "clippings"
  - "cybersecurity"
  - "Claude Code"
  - "AI security"
  - "vulnerability detection"
  - "static analysis"
  - "open-source"
---

## 概要

Anthropicは **Claude Code Security** を発表した。これはClaude Code（Web版）に組み込まれた新機能で、コードベースのセキュリティ脆弱性をスキャンし、人間のレビュー用にソフトウェアパッチを提案する。従来のツールでは見逃されがちな脆弱性を発見・修正できるようにすることを目的としている。

**Enterprise および Team 顧客**向けに限定リサーチプレビューとして提供開始。**オープンソースリポジトリのメンテナー**には無料の優先アクセスが用意されている。

---

## 背景：セキュリティチームが直面する課題

- ソフトウェアの脆弱性が多すぎる一方、対応する人材が不足している
- 既存の分析ツールは既知のパターンのマッチングに限定されている
- 攻撃者が悪用するような、微妙でコンテキスト依存の脆弱性を見つけるには、高度なスキルを持つ人間の研究者が必要
- AIの進歩により、Claudeが[未知の高深刻度脆弱性を検出](https://red.anthropic.com/2026/zero-days/)できることが実証された

---

## Claude Code Security の仕組み

### 従来の静的解析との違い

| 観点 | 従来の静的解析 | Claude Code Security |
|---|---|---|
| **手法** | ルールベース（既知の脆弱性パターンとのマッチング） | コードを読み解き、人間のセキュリティ研究者のように推論 |
| **検出対象** | 露出したパスワード、古い暗号化などの一般的な問題 | ビジネスロジックの欠陥、破綻したアクセス制御などの複雑な脆弱性 |
| **分析方法** | パターンマッチング | コンポーネント間の相互作用の理解、データフローの追跡 |

### 多段階検証プロセス

1. **脆弱性の検出** — コードを分析し、潜在的な脆弱性を特定
2. **自己検証** — Claudeが自らの発見を証明・反証し、偽陽性をフィルタリング
3. **重大度の評価** — チームが最も重要な修正に集中できるよう重大度レーティングを付与
4. **ダッシュボード表示** — 検証済みの発見がClaude Code Securityダッシュボードに表示
5. **人間による承認** — 開発者がパッチを検査し、承認した場合のみ適用

> **重要**: Claude Code Securityは問題を特定し解決策を提案するが、**適用の最終判断は常に開発者が行う**。各発見には**信頼度レーティング**も付与される。

---

## サイバーセキュリティにおけるClaudeの研究実績

Claude Code Securityは、1年以上にわたるClaudeのサイバーセキュリティ能力の研究に基づいている。

### Frontier Red Teamの活動

- **Capture-the-Flag大会への参加**: [競技CTFイベント](https://red.anthropic.com/2025/ai-for-cyber-defenders/)にClaudeを出場させ、能力をテスト
- **重要インフラ防御**: Pacific Northwest National Laboratoryと提携し、[AIを使用した重要インフラ防御の実験](https://red.anthropic.com/2026/critical-infrastructure-defense/)を実施
- **脆弱性発見の実績向上**: 実コード中の脆弱性を発見・パッチする能力を継続的に改善

### 主要成果

- [Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6)（2026年2月初旬リリース）を使用し、**本番環境のオープンソースコードベースで500件以上の脆弱性**を発見
- これらは**数十年間にわたって検出されなかった**バグであり、長年の専門家レビューでも発見されなかったもの
- 現在、メンテナーとのトリアージおよび**責任ある脆弱性開示**プロセスを進行中
- オープンソースコミュニティとのセキュリティ活動を拡大予定
- Anthropic自身のコードレビューにもClaudeを使用し、自社システムの保護に**極めて有効**と評価

---

## 今後の展望

- **世界中のコードの大部分がAIによってスキャンされる時代**が近い将来到来すると予測
- 攻撃者はAIを使って悪用可能な弱点をこれまで以上に速く発見する
- **防御側が先に動けば**、同じ弱点を見つけてパッチを当て、攻撃リスクを低減できる
- Claude Code Securityは、より安全なコードベースと業界全体のセキュリティベースライン向上に向けた一歩

---

## 利用方法

- **対象**: Enterprise および Team 顧客（限定リサーチプレビュー）
- **オープンソースメンテナー**: 無料の優先アクセスに申込み可能
- **アクセス申請**: [こちらから申込み](https://claude.com/contact-sales/security)
- **詳細情報**: [claude.com/solutions/claude-code-security](http://claude.com/solutions/claude-code-security)
