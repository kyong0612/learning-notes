---
title: "Introducing Claude Opus 4.5"
source: "https://www.anthropic.com/news/claude-opus-4-5"
author:
  - "[[@AnthropicAI]]"
published: 2025-11-24
created: 2025-11-25
description: "AnthropicがClaude Opus 4.5をリリース。コーディング、エージェント、コンピューター使用において世界最高性能を達成し、SWE-bench Verifiedで最高スコアを記録。API価格は$5/$25（入出力100万トークンあたり）に設定され、Opus級の能力がより手頃に。"
tags:
  - "AI"
  - "Claude"
  - "Anthropic"
  - "LLM"
  - "コーディング"
  - "エージェント"
  - "ベンチマーク"
  - "AI安全性"
---

## 概要

2024年11月24日、Anthropicは最新モデル**Claude Opus 4.5**をリリースした。コーディング、エージェント、コンピューター使用において世界最高性能を持ち、深い調査やスプレッドシート操作などの日常タスクでも大幅に改善されている。

### 利用可能性と価格

- **API識別子**: `claude-opus-4-5-20251101`
- **価格**: $5/$25 per million tokens（入力/出力）
- 3大クラウドプラットフォーム（AWS、Google Cloud、Microsoft Azure）で利用可能
- Claude アプリ、API、各クラウドプラットフォームで本日より利用開始

---

## 主要なベンチマーク結果

### SWE-bench Verified

Claude Opus 4.5は**実世界のソフトウェアエンジニアリングテストで最高スコア**を達成。

### 比較表（主要ベンチマーク）

| ベンチマーク | Opus 4.5の特徴 |
|-------------|---------------|
| **SWE-bench Multilingual** | 8言語中7言語でトップ性能 |
| **Aider Polyglot** | Sonnet 4.5から10.6%向上 |
| **BrowseComp-Plus** | エージェント検索で大幅向上 |
| **Vending-Bench** | Sonnet 4.5より29%多く獲得（長期タスク） |

### 採用試験での性能

Anthropic社内の「パフォーマンスエンジニアリング候補者向け難関テスト」において、2時間の制限時間内で**過去のどの人間の候補者よりも高いスコア**を達成（並列テスト時計算使用時）。

---

## 顧客からの評価

### コーディングと効率性

- **GitHub Copilot**: 内部コーディングベンチマークを上回り、**トークン使用量を半分に削減**（Mario Rodriguez, CPO）
- **Replit**: 同じ問題を解くのに**より少ないトークンで解決**（Michele Catasta, President）
- **Cursor**: 難しいコーディングタスクで価格と知性が改善（Michael Truell, CEO）
- **Cognition (Devin)**: 長期的な目標指向行動を示す（Eno Reyes, CTO）

### エージェントとワークフロー

- **Warp**: Terminal Benchで**Sonnet 4.5より15%改善**（Zach Lloyd, CEO）
- **Glean**: 複雑なエンタープライズタスクで最先端の結果（Kay Zhu, CTO）
- **Softbank**: 自己改善AIエージェントのブレークスルー。他モデルが10回でも達成できない品質を**4回のイテレーションで達成**（Yusuke Kaji, GM）

### 効率性の向上

- **Codex**: 長期コーディングタスクで最も効率的。**最大65%少ないトークン**で高いパス率（Sean Ward, CEO）
- **Codebuff**: ツール呼び出しエラーとビルド/リントエラーが**50〜75%削減**（Nicholas Charriere, CEO）
- **val town**: 2時間かかったタスクが**30分**で完了（Madhav Jha, CTO）

---

## 安全性の向上

### 最もアラインメントの取れたモデル

Claude Opus 4.5は**Anthropicがリリースした中で最も堅牢にアラインされたモデル**であり、業界全体でも最もアラインされたフロンティアモデルと考えられている。

### 懸念行動スコアの改善

「懸念行動」スコアは幅広い範囲の不整合行動を測定：

- 人間の悪用への協力
- モデル自身の主導による望ましくない行動

### プロンプトインジェクション耐性

Opus 4.5は**業界のどのフロンティアモデルよりもプロンプトインジェクション攻撃に対して騙されにくい**。
（ベンチマークは[Gray Swan](https://www.grayswan.ai/)により開発・実施、非常に強力な攻撃のみを含む）

---

## Claude Developer Platform の新機能

### Effort パラメータ

APIに新しい**effort パラメータ**を導入。タスクに応じて時間・コストの最小化または能力の最大化を選択可能。

| Effort設定 | SWE-bench結果 | トークン使用量 |
|-----------|--------------|---------------|
| Medium | Sonnet 4.5の最高スコアと同等 | **76%削減** |
| High（デフォルト） | Sonnet 4.5を4.3ポイント上回る | **48%削減** |

### その他の機能

- **Context Compaction**: コンテキスト管理
- **Advanced Tool Use**: 高度なツール使用
- **Memory Capabilities**: メモリ機能

これらの組み合わせにより、深い調査評価で**約15ポイントの性能向上**（70.48% → 85.30%）。

### サブエージェント管理

Opus 4.5はサブエージェントチームの管理に非常に効果的で、複雑で調整されたマルチエージェントシステムの構築が可能。

---

## 製品アップデート

### Claude Code

- **Plan Mode の改善**: より正確な計画を構築し、より徹底的に実行
  - 事前に明確化のための質問を行う
  - ユーザーが編集可能な `plan.md` ファイルを作成してから実行
- **デスクトップアプリで利用可能**: 複数のローカル・リモートセッションを並行実行可能

### Claude アプリ

- **長い会話の継続**: 以前のコンテキストを自動要約し、会話が壁にぶつからなくなった
- **Claude for Chrome**: 全Maxユーザーに提供開始
- **Claude for Excel**: Max、Team、Enterpriseユーザーにベータアクセス拡大

### 利用制限の変更

- Opus 4.5へのアクセスを持つユーザーのOpus固有の上限を撤廃
- MaxおよびTeam Premiumユーザーの全体的な使用制限を増加
- 以前Sonnetで使用していたのとほぼ同量のOpusトークンを使用可能

---

## 技術的詳細

### 評価方法論

- 64K thinking budget
- Interleaved scratchpads
- 200K context window
- Default effort（high）
- Default sampling settings（temperature, top_p）
- 5回の独立試行の平均

**例外:**

- SWE-bench Verified: thinking budgetなし
- Terminal Bench: 128K thinking budget

### 注目すべき事例：τ2-benchでの創造的問題解決

航空会社のサービスエージェントとして行動するシナリオで、基本エコノミー予約の変更が禁止されている中、Opus 4.5は正当な解決策を発見：

> 1. まずキャビンをアップグレード（基本エコノミーでも許可される）
> 2. その後フライトを変更（非基本エコノミーでは許可される）

ベンチマークは技術的に失敗として記録したが、この種の創造的な問題解決こそがOpus 4.5の大きな進歩を示している。

---

## 関連リソース

- [Claude Opus 4.5 System Card](https://www.anthropic.com/claude-opus-4-5-system-card)
- [Claude API Documentation](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Effort Control Documentation](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Context Management Documentation](https://platform.claude.com/docs/en/build-with-claude/context-editing)
