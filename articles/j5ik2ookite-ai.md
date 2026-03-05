---
title: "j5ik2o/okite-ai"
source: "https://github.com/j5ik2o/okite-ai"
author:
  - "[[j5ik2o]]"
published: 2026-01-14
created: 2026-03-05
description: "DDD・CQRS/ES・クリーンアーキテクチャなどソフトウェア設計の知見を凝縮した、AIエージェント（Claude Code / Codex CLI / Gemini CLI / Cursor Agent など）向けの再利用可能なskillsとrulesのコレクション"
tags:
  - "clippings"
  - "ai-agent"
  - "ddd"
  - "cqrs"
  - "clean-architecture"
  - "software-design"
---

## 概要

「okite-ai」は、AIエージェント向けの再利用可能な **skills** と **rules** のコレクションである。名前には「AIのための掟（ルール）」と「目を覚ませAI！（能力を最大限に引き出す）」という二重の意味が込められている。

DDD・CQRS/ES・クリーンアーキテクチャなどのソフトウェア設計ベストプラクティスを、Claude Code / Codex CLI / Gemini CLI / Cursor Agent といったAIエージェントが活用できる形で整備したリポジトリ。

- **Stars**: 62 | **License**: MIT | **言語**: Python

---

## なぜ AI 時代でも設計が重要なのか

AIにとって「正しさ」は相対的であり、**基準を与えなければ判断できない**。集約の境界を守ることも、ドメインロジックをコントローラに書くことも、基準がなければどれも等しく「正解」になり得る。

設計の知識をスキルとして与えることは、AIの判断を**グラウンディング**（判断の拠り所を与えること）することに他ならない。

主な判断基準：
- **集約境界・不変条件** — 何を一つの整合性単位として守るべきか
- **コマンドとクエリの分離** — 読み書きをどう構造化すべきか
- **依存方向の制約** — どの層が何に依存してよいか

> これらは教条的に適用するものではなく、プロジェクトの文脈に応じて判断し使い分けるもの。各プロジェクトの文脈に応じてカスタマイズ・最適化して使うことを推奨。

---

## 特徴

- `skills/` / `rules/` を単一ソースで管理し、各CLI向けディレクトリへ**シンボリックリンク**で同期
- `npx skills add` で**個別スキルをインストール**可能
- `scripts/configure.sh` で `.claude` `.codex` `.gemini` `.cursor` `.opencode` を**一括セットアップ**

---

## 使い方

### 方法1: npx skills add（推奨）

必要なスキルだけを個別インストールできる。

```sh
# スキル一覧を表示
npx skills add j5ik2o/okite-ai --list

# 単一スキルをインストール
npx skills add j5ik2o/okite-ai@aggregate-design

# 複数スキルを一括インストール
npx skills add j5ik2o/okite-ai@clean-architecture j5ik2o/okite-ai@error-handling

# 特定バージョン（タグ）を指定
npx skills add https://github.com/j5ik2o/okite-ai/tree/v1.0.0/skills/aggregate-design
```

### 方法2: submodule + configure.sh（一括導入）

```sh
git submodule add git@github.com:j5ik2o/okite-ai.git references/okite-ai
./references/okite-ai/scripts/configure.sh
```

`.okite_ignore` で不要なスキル/ルールを除外可能。

---

## 利用可能なスキル一覧

### DDD / Domain Modeling
| スキル名 | 概要 |
|---|---|
| `aggregate-design` | 集約設計 |
| `aggregate-transaction-boundary` | 集約のトランザクション境界 |
| `cross-aggregate-constraints` | 集約間の制約 |
| `domain-building-blocks` | ドメインビルディングブロック |
| `domain-model-first` | ドメインモデルファースト |
| `domain-model-extractor` | ドメインモデル抽出 |
| `domain-primitives-and-always-valid` | ドメインプリミティブと常時バリデーション |
| `ddd-module-pattern` | DDDモジュールパターン |
| `repository-design` | リポジトリ設計 |
| `repository-placement` | リポジトリ配置 |
| `when-to-wrap-primitives` | プリミティブのラップ判断 |

### CQRS / Event Sourcing
| スキル名 | 概要 |
|---|---|
| `cqrs-aggregate-modeling` | CQRS集約モデリング |
| `cqrs-to-event-sourcing` | CQRSからイベントソーシングへ |
| `cqrs-tradeoffs` | CQRSのトレードオフ |
| `pekko-cqrs-es-implementation` | Pekko CQRS/ES実装 |

### Architecture / Design
| スキル名 | 概要 |
|---|---|
| `clean-architecture` | クリーンアーキテクチャ |
| `error-classification` | エラー分類 |
| `error-handling` | エラーハンドリング |
| `parse-dont-validate` | Parse, Don't Validate |
| `backward-compat-governance` | 後方互換性ガバナンス |

### OOP Principles
| スキル名 | 概要 |
|---|---|
| `tell-dont-ask` | Tell, Don't Ask |
| `law-of-demeter` | デメテルの法則 |
| `first-class-collection` | ファーストクラスコレクション |
| `breach-encapsulation-naming` | カプセル化違反の命名 |
| `intent-based-dedup` | 意図ベースの重複排除 |

### Package / Module
| スキル名 | 概要 |
|---|---|
| `package-design` | パッケージ設計 |
| `refactoring-packages` | パッケージリファクタリング |

### Skills / Rules Operations
| スキル名 | 概要 |
|---|---|
| `creating-rules` | ルール作成 |
| `custom-linter-creator` | カスタムリンター作成 |
| `deepresearch-readme` | DeepResearch README |
| `reviewing-skills` | スキルレビュー |
| `skill-creator` | スキル作成 |
| `migrate-skill-to-agent` | スキルからエージェントへの移行 |

---

## ドキュメント

- ドキュメント索引: [docs/README.md](https://github.com/j5ik2o/okite-ai/blob/main/docs/README.md)
- 共通エージェント設定: [AGENTS.md](https://github.com/j5ik2o/okite-ai/blob/main/AGENTS.md)
- SDDガイド: [.agents/CC-SDD.md](https://github.com/j5ik2o/okite-ai/blob/main/.agents/CC-SDD.md)
- スキル一覧: [docs/skills.md](https://github.com/j5ik2o/okite-ai/blob/main/docs/skills.md)

---

## 重要なポイント

1. **AIエージェントへの設計知識の注入**: AIが自ら設計の良し悪しを判断できない問題を、スキル/ルールとして設計原則を提供することで解決する
2. **マルチエージェント対応**: Claude Code、Codex CLI、Gemini CLI、Cursor Agent、OpenCodeなど主要なAIエージェントをすべてサポート
3. **柔軟な導入方法**: 個別スキルのインストール（npx）と一括導入（submodule）の2種類の方法を提供
4. **カスタマイズ前提**: スキルをそのまま使うのではなく、各プロジェクトの文脈に応じた最適化を推奨
5. **包括的なスキルセット**: DDD、CQRS/ES、クリーンアーキテクチャ、OOP原則、パッケージ設計など30以上のスキルを提供
