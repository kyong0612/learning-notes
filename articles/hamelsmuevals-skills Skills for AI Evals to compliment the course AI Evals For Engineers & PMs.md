---
title: "hamelsmu/evals-skills: Skills for AI Evals to compliment the course: AI Evals For Engineers & PMs"
source: "https://github.com/hamelsmu/evals-skills"
author:
  - "[[Hamel Husain]]"
published: 2026-03-01
created: 2026-03-05
description: "AIコーディングエージェントがLLM評価（Evals）パイプラインを構築・改善するためのスキルセット。50社以上の支援経験と「AI Evals for Engineers & PMs」コースに基づき、評価における一般的なミスを防ぐガイダンスを提供する。"
tags:
  - "clippings"
  - "AI-Evals"
  - "LLM"
  - "Claude-Code"
  - "AI-Coding-Agents"
  - "Evaluation"
---

## 概要

**evals-skills** は、AIコーディングエージェント（Claude Code等）がLLM評価（Evals）を構築する際にガイドするスキル集である。著者の Hamel Husain が50社以上の企業を支援し、[AI Evals for Engineers & PMs](https://maven.com/parlance-labs/evals?promoCode=evals-info-url) コースで教えてきた経験から、**評価パイプラインにおける一般的なミス**を防ぐことを目的としている。

リポジトリは2026年3月1日に公開され、短期間で546スター・59フォークを獲得している（MITライセンス）。

## 初心者向けガイド

Evalsが初めての場合は、`eval-audit` スキルから始めることが推奨されている。以下のようにエージェントに指示する:

> evals-skills プラグインをインストールし、eval パイプラインに対して `/evals-skills:eval-audit` を実行。各診断領域を並列のサブエージェントで調査し、結果を1つのレポートに統合する。

このauditは完全な解決策ではないが、よく見られる問題を検出し、修正のために他のスキルを推奨する。

## インストール方法

### Claude Code

```bash
# プラグインリポジトリの登録
/plugin marketplace add hamelsmu/evals-skills

# プラグインのインストール
/plugin install evals-skills@hamelsmu-evals-skills

# アップグレード
/plugin update evals-skills@hamelsmu-evals-skills
```

インストール後、Claude Code を再起動すると `/evals-skills:<スキル名>` で利用可能になる。

### npx Skills CLI

```bash
# 全スキルのインストール
npx skills add https://github.com/hamelsmu/evals-skills

# 特定スキルのみインストール
npx skills add https://github.com/hamelsmu/evals-skills --skill eval-audit

# アップデート確認・適用
npx skills check
npx skills update
```

## 利用可能なスキル一覧

| スキル | 機能 |
|--------|------|
| **eval-audit** | 評価パイプラインを監査し、優先度付きで問題を検出する |
| **error-analysis** | トレースの読み取りと障害分類をユーザーにガイドする |
| **generate-synthetic-data** | 次元ベースのタプル生成で多様な合成テスト入力を作成する |
| **write-judge-prompt** | 主観的品質基準に対するLLM-as-Judge評価器を設計する |
| **validate-evaluator** | データ分割・TPR/TNR・バイアス補正を用いて、LLMジャッジを人間のラベルに対して校正する |
| **evaluate-rag** | RAGパイプラインにおける検索と生成の品質を評価する |
| **build-review-interface** | 人間によるトレースレビューのためのカスタムアノテーションインターフェースを構築する |

## スキル作成ガイドライン（meta-skill）

リポジトリには、カスタムスキルを作成するための **meta-skill**（ガイドライン）が含まれている。主要な原則は以下の通り:

### スキルの読者
スキルはコーディングエージェント向けの指示書。エージェントは賢く一般知識を持っているため、**ドメイン固有の指示**のみを記述する。

### 記述原則

- **指示を書く、知恵を書かない**: 「なぜ」ではなく「何をするか」を明確に。例えば「ROUGE、BERTScore、コサイン類似度を主要評価指標として使わない」のように直接的に指示する。
- **一般知識を削る**: エージェントが既に知っていること（JSONとは何か、Pythonのimport方法等）は記述しない。
- **ビルドタスクに限定する**: 「週次レビューセッションをスケジュールする」等の組織的アドバイスは含めない。
- **良いデフォルトから始める**: 最もシンプルで正しいアプローチを最初に提示する。
- **具体的に書く**: 曖昧な指示（「明確なpass/fail基準を書け」）ではなく、具体例を示す。
- **警告は指示またはアンチパターンに変換する**: 段落での説明ではなく、1行のアンチパターンリストにする。

### スキルの構造

```yaml
---
name: skill-name
description: >
  スキルの目的。[トリガー条件]で使用。[除外条件]では使用しない。
---
```

ファイルは500行以内に収める。超える場合は参照資料を1階層深いファイルに分割する。

## 追加リソース（questions.md）

Evalsの基礎を学ぶための無料リソースも提供されている:

### 読み物

- **[LLM Evals FAQ](https://hamel.dev/blog/posts/evals-faq/)** — エラー分析、評価器設計、アノテーションツール構築の実践的Q&A
- **[Creating an LLM Judge That Drives Business Results](https://hamel.dev/blog/posts/llm-judge/)** — ドメインエキスパートとの「critique shadowing」によるLLMベース評価器の構築。バイナリpass/fail判定、few-shotプロンプト設計、反復的校正
- **[A Field Guide to Improving AI Products](https://hamel.dev/blog/posts/field-guide/)** — 成功するAIチームと苦戦するチームを分ける6つのプラクティス
- **[Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/index.html)** — ユニットテスト、人間/モデルベース評価、A/Bテストの3レベルの評価フレームワーク
- **[Who Validates the Validators?](https://arxiv.org/abs/2404.12272)**（Shreya Shankar et al.）— 評価器を書く前にエラー分析が必要な理由

### 動画

- **[Intro to AI Evals with Lenny Rachitsky](https://youtu.be/BsWxPI9UM4c)** — 手動エラー分析から障害モード分類、ターゲット評価器構築への継続的改善ループの解説

## 重要なポイント

1. **これらのスキルは出発点**: プロジェクト横断で一般化できるミスのみをカバーしている。自社のスタック・ドメイン・データに基づいたカスタムスキルの方がより効果的。
2. **スキルがカバーしない領域**: プロダクション監視、CI/CD統合、データ分析等はコースで網羅されている。
3. **評価のアプローチ**: バイナリpass/fail（Likertスケールではなく）、コードベースのチェック優先（LLMジャッジの前に）、エラー分析を評価器構築の前に行う、という方針が一貫している。
