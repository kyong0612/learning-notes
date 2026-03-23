---
title: "Thread by @trq212 — Lessons from Building Claude Code"
source: "https://x.com/trq212/status/2035372716820218141?s=12"
author:
  - Thariq Shihipar
published: 2026-03-21
created: 2026-03-23
description: |
  Anthropic Claude Codeチームの Thariq Shihipar による技術記事まとめスレッド。Skills、エージェントツール設計、プロンプトキャッシング、プレイグラウンド、ファイルシステムの活用など、AIエージェント構築における実践的な教訓を網羅している。
tags:
  - Claude Code
  - AI Agent
  - Skills
  - Prompt Caching
  - Agent Tool Design
  - Anthropic
---

# Thread by @trq212 — Lessons from Building Claude Code

ref: <https://x.com/trq212/status/2035372716820218141>

---

## 概要

**Thariq Shihipar** ([@trq212](https://x.com/trq212)) は Anthropic の Claude Code チームのエンジニア（元YC W20、MIT Media Lab）。このスレッドは、彼が執筆したAIエージェント構築に関する技術記事をまとめたピン留めスレッドである。Claude blogにも掲載予定とのこと。

以下の5つの記事が紹介されている：

| # | タイトル | 公開日 | テーマ |
|---|---------|--------|--------|
| 1 | Lessons from Building Claude Code: How We Use Skills | 2026-03-17 | Skillsの設計・活用パターン |
| 2 | Lessons from Building Claude Code: Seeing like an Agent | 2026-02-27 | エージェントツール設計 |
| 3 | Lessons from Building Claude Code: Prompt Caching Is Everything | 2026-02-19 | プロンプトキャッシングの最適化 |
| 4 | Playgrounds | 2026-01-29 | ビジュアルな反復的アイデア開発 |
| 5 | Your Agent should use a File System | 2025-09-22 | ファイルシステムによる状態管理 |

---

## 1. Skills は全てのエージェントが基盤とする抽象化 (2026-03-17)

![Article cover image](https://pbs.twimg.com/media/HDl2jn9a0AAZkyz?format=jpg&name=large)

### Skillsとは何か

- Skillsは「単なるMarkdownファイル」ではなく、**スクリプト、アセット、データ等を含むフォルダ**である
- エージェントが発見、探索、操作できる拡張ポイント
- Anthropic社内で数百のSkillsが実際に活用されている
- Claude Codeで最も利用されている拡張ポイントの一つ

### Skillsの9つのカテゴリ

1. **Library & API Reference** — 内部ライブラリの使い方、ゴッチャ（落とし穴）、コードスニペット
2. **Product Verification** — Playwright、tmux等を使ったテスト・検証（動画記録やアサーションを含む）
3. **Data Fetching & Analysis** — データ・モニタリングスタックへの接続
4. **Business Process & Team Automation** — 繰り返しワークフローの自動化（standup投稿、チケット作成等）
5. **Code Scaffolding & Templates** — フレームワークのボイラープレート生成
6. **Code Quality & Review** — コード品質の強制、レビュー（adversarial-review等）
7. **CI/CD & Deployment** — PR監視、デプロイ、cherry-pick等
8. **Runbooks** — 症状からの調査・レポート生成
9. **Infrastructure Operations** — メンテナンス・運用手順（ガードレール付き）

### Skill作成のベストプラクティス

- **Don't State the Obvious** — Claudeが既に知っていることを繰り返さない。通常の思考パターンから外れた情報に焦点を当てる
- **Gotchasセクションを作る** — Claudeが遭遇するよくある失敗パターンを文書化する（最も価値の高いコンテンツ）
- **ファイルシステムとProgressive Disclosureを活用** — 参照ファイル、スクリプト、テンプレート等をフォルダに配置
- **Claudeを制限しすぎない** — 必要な情報は提供するが、状況に応じた柔軟性を持たせる
- **セットアップを考慮する** — config.jsonに設定情報を保存するパターン
- **descriptionフィールドはモデル向け** — スキル発動の判断基準として使われる
- **メモリとデータ保存** — ログファイルやSQLiteでスキル内にメモリを持たせる
- **スクリプトとコード生成** — Claudeにスクリプトを与え、合成・構成に専念させる
- **On Demand Hooks** — セッション中にのみ有効化されるフック（`/careful`で危険なコマンドをブロック等）

### Skillsの配布

- **リポジトリにチェックイン** — `.claude/skills`配下に配置（小規模チーム向け）
- **プラグインマーケットプレイス** — 大規模チーム向け。有機的にトラクションを得たSkillsをマーケットプレイスに移行

---

## 2. エージェント構築は科学よりもアート (2026-02-27)

![Article cover image](https://pbs.twimg.com/media/HCLxeR3acAAf2R9?format=jpg&name=large)

### 核心的テーゼ

> エージェントハーネス構築で最も難しいのは、**アクションスペース（行動空間）の設計**であり、モデルやプロンプトそのものではない。

### 数学問題のアナロジー

ツール設計を数学問題に例えている：
- **紙** — 最低限だが手動計算に制限される
- **電卓** — より良いが高度な機能の操作知識が必要
- **コンピュータ** — 最も強力だがコード記述能力が必要

→ エージェントの**能力に適したツール**を与える必要がある。その能力を知るには「出力を読み、実験し、エージェントのように見る」こと。

### AskUserQuestion ツールの進化（3回の試行）

1. **ExitPlanToolにパラメータ追加** → プランと質問の同時要求でClaudeが混乱
2. **出力フォーマットの変更** → Markdownでの構造化出力が不安定
3. **専用のAskUserQuestionツール作成** → Claudeが確実に呼び出し、構造化された質問を表示 ✅

**教訓：** 最も優れた設計のツールでも、Claudeがその呼び出し方を理解できなければ機能しない。

### TodoWriteからTask Toolへの進化

- 初期：**TodoWrite** — モデルをトラック上に保つためのTo-doリスト + 5ターンごとのリマインダー
- 課題：リマインダーがあるとClaudeがリストに固執し、修正を避ける傾向
- 進化：**Task Tool** — サブエージェント間の通信・依存関係管理・共有アップデートを可能に
- **教訓：** モデルの能力向上に伴い、かつて必要だったツールが制約になることがある

### 検索インターフェースの設計

- 初期：RAGベクトルデータベース → セットアップが煩雑で環境依存が高い
- 改善：**Grepツール** → Claudeが自らコンテキストを検索・構築
- 進化：**Progressive Disclosure** → Skillファイルが他のファイルを参照し、再帰的にコンテキストを発見
- Claude Code Guideサブエージェント → ドキュメント検索専門のサブエージェントで、ツールを追加せずにアクションスペースを拡張

---

## 3. プロンプトキャッシングが全て (2026-02-19)

![Article cover image](https://pbs.twimg.com/media/HBixJgAbsAAM61V?format=jpg&name=large)

Thariq自身が「最もアルファ（価値ある洞察）の高い投稿」と評する記事。エージェントをゼロから構築する人に特に関連がある。

### 基本原則

> Claude Codeチームは**プロンプトキャッシングを中心にハーネス全体を構築**している。キャッシュヒット率にアラートを設定し、低下すれば**SEV（重大インシデント）を宣言**する。

### コスト影響

- キャッシングなし：長いコーディングセッションで$50-100
- キャッシュヒット率90%：同じセッションで約$19

### システムプロンプトのレイアウト（キャッシュ最適化順序）

1. **静的システムプロンプト & ツール** — グローバルにキャッシュ
2. **Claude.MD** — プロジェクト内でキャッシュ
3. **セッションコンテキスト** — セッション内でキャッシュ
4. **会話メッセージ** — 最後に配置

### 主要な教訓

| 原則 | 詳細 |
|------|------|
| **システムメッセージで更新** | システムプロンプトを変更せず、次のターンでシステムメッセージとして送信 |
| **モデルを途中で変更しない** | キャッシュはモデル固有。100kトークンの会話後にHaikuに切り替えるとキャッシュ再構築が必要 |
| **ツールを途中で追加/削除しない** | ツールはキャッシュプレフィックスの一部 |
| **Plan Modeの設計** | ツールセットを変更せず、EnterPlanMode/ExitPlanModeをツールとして提供 |
| **Tool Search** | ツール削除の代わりに`defer_loading`で軽量スタブを送信 |
| **Compaction（コンパクション）** | 親会話と同一のシステムプロンプト・ツール定義を使用し、キャッシュプレフィックスを再利用 |

---

## 4. プレイグラウンドはアイデアを視覚的に反復する最良の方法 (2026-01-29)

![Article cover image](https://pbs.twimg.com/media/G_2-teGbUAMtRec?format=jpg&name=large)

プレイグラウンド（視覚的なプロトタイピング環境）を活用してアイデアを素早く反復・検証するアプローチについての投稿。Claude Codeでの仕様ベースアプローチ — 最小限のスペックから始め、AskUserQuestionToolで40以上の質問を生成してインタビューを行い、洗練されたスペックを新しいセッションで実行する手法と関連。

---

## 5. エージェントはファイルシステムを使うべき (2025-09-22)

![Image](https://pbs.twimg.com/media/G1exUvtboAAENax?format=jpg&name=large)

### 核心的主張

> "This is a hill I will die on." — 全てのエージェントはファイルシステムを使える。

### なぜファイルシステムか

- **コンテキストウィンドウの限界** — コードベース全体をコンテキストに収めるのではなく、「見つけ方を知る」ことが重要
- **状態の表現** — エージェントがコンテキストに読み込み、作業を検証できるエレガントな方法
- **複数パスの問題解決** — データをファイルに書き込み、grepで検索することで複数回アプローチ可能

### 具体例（オープンソースEメールエージェント）

- 大量のメールをコンテキストに投入する代わりに、ファイルに書き込みgrepで検索
- メモリ：過去の会話をMarkdown/JSONファイルとして検索
- Reactアーティファクト：コーディングエラーを減らすためのファイルベース出力

### ファイルシステムの利点

- 無制限のストレージ容量
- セッション間の永続性
- grepによる検索可能性
- 人間が読めるJSON/Markdown形式
- Gitで追跡可能な監査証跡
- 複数エージェントの協調が可能

### 注意点

- サンドボックス内での実行を推奨
- パーミッション管理が重要
- Claude Code SDKのパーミッション設定を活用

---

## 重要な結論

1. **Skillsはエージェントの最も柔軟な拡張ポイント**であり、フォルダ構造・スクリプト・Progressive Disclosureを活用することで真価を発揮する
2. **ツール設計はアートである** — モデルの能力を観察し、実験し、継続的に反復する必要がある
3. **プロンプトキャッシングは長期稼働エージェントの経済性を決定する**最重要要素であり、プレフィックスマッチングの制約を中心に全体設計を行うべき
4. **ファイルシステムはエージェントの状態管理・コンテキスト構築の基盤**であり、コンテキストウィンドウに全てを詰め込むアプローチより優れている
5. **Progressive Disclosure**は、ツールを追加せずにエージェントの能力を拡張する鍵となるパターンである