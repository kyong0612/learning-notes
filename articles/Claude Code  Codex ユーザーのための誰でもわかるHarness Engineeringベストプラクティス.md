---
title: "Claude Code / Codex ユーザーのための誰でもわかるHarness Engineeringベストプラクティス"
source: "https://nyosegawa.github.io/posts/harness-engineering-best-practices-2026/"
author:
  - "[[逆瀬川ちゃん (@gyakuse)]]"
published: 2026-03-09
created: 2026-03-10
description: "Coding Agent時代のハーネスエンジニアリングのベストプラクティスを、リポジトリ衛生・決定論的ツール・E2Eテスト戦略・プラットフォーム選定まで網羅的に解説します"
tags:
  - "clippings"
  - "AI"
  - "Coding Agent"
  - "Harness Engineering"
  - "Claude Code"
  - "Codex"
  - "Linter"
  - "E2E Testing"
  - "DevOps"
---

## 概要

Harness Engineering（ハーネスエンジニアリング）とは、Coding Agent（Claude Code、Codex等）を人間の介入なしに自律稼働させ、出力を安定させるための環境設計を指す。Mitchell Hashimotoによる最初の定義では「AGENTS.mdの継続的改善とAgentの自己検証ツール群」であったが、現在はより広い概念として語られている。エンジニアの仕事は「正しいコードを書くこと」から「エージェントが正しいコードを確実に生産する環境を設計すること」へ移行している。

本記事は2026年3月時点のベストプラクティスを7つのトピック、アンチパターン、最小実行可能ハーネス（MVH）にわたって網羅的に解説する。ハーネスへの投資は複利で効く——リンタールール1つで以降すべてのセッションでミスが防がれ、テスト1つで以降すべてのセッションで回帰が検出される。

> **注意**: 著者はHarness Engineeringが数カ月〜1年程度でLLMの能力向上やCoding Agent自体への還元により重要でなくなる可能性を指摘しつつも、2026年3月現在は重要な分野であると述べている。

## 主要なトピック

### 1. リポジトリ衛生：腐敗を前提に設計する

エージェントはリポジトリ内のテキストを等しく権威的な情報源として扱い、「古い情報」という直感を持たない。

- **置くべきもの**: 実行可能なアーティファクト（コード、テスト、リンター設定、型定義、スキーマ定義、CI設定）とADR（Architecture Decision Records）
- **置くべきでないもの**: 現在のシステムの説明文書、設計概要、手書きのAPI説明。これらは必然的にコードの進化に追いつけず腐敗する
- **テストはドキュメントより腐敗に強い**: テストは壊れれば赤くなるが、説明文書は沈黙のまま腐敗する。仕様・期待動作・制約は可能な限りテストとして表現すべき
- **ADRの不変原則**: 過去の決定は書き換えず置換（supersede）し、タイムスタンプとステータスで有効性を構造的に判別できるようにする
- **Chromaの研究**: 18のフロンティアモデル全てでコンテキスト長増加に伴い性能が低下。無関係・古い情報をリポジトリに残すこと自体が性能劣化の原因
- **OpenAIの教訓**: エージェントはリポジトリ内の既存パターンを不均一・非最適なパターンも含めて複製する。解決策は「ゴールデンプリンシプル」を機械的ルールとして強制すること

### 2. 決定論的ツールとアーキテクチャガードレールで品質を強制する

#### リンターの仕事をLLMにさせない

CLAUDE.mdに「リンターを実行せよ」と書くことと、Hookでリンターを実行することの間には「ほぼ毎回」と「例外なく毎回」の差がある。この差はプロダクションシステムでは致命的。

#### Claude Code Hooksの4パターン

| パターン | トリガー | 役割 |
|----------|----------|------|
| Observability | 全イベント | エージェントの意図・結果・失われるコンテキストを監視 |
| Completion Gates | Stop | テスト通過まで完了を許可しない |
| Quality Loops | PostToolUse | ファイル編集後のリンター→エラー注入→自己修正 |
| Safety Gates | PreToolUse | 破壊的コマンドのブロック、機密ファイル編集禁止 |

#### 言語別推奨リンター（2026年3月・PostToolUse Hook前提）

| ツール | 言語 | ESLint比速度 | PostToolUse適性 |
|--------|------|-------------|----------------|
| Oxlint | JS/TS | 50-100x | 最適 |
| Biome | JS/TS/JSON/CSS | 10-25x | 良好 |
| Ruff | Python | 10-100x vs Flake8 | 最適 |
| golangci-lint | Go | - | 良好 |
| Clippy | Rust | - | 良好 |
| ast-grep | 多言語 | - | カスタムルール用 |

PostToolUse HookではRust製ツール（Oxlint、Biome、Ruff等）がNode.js製ツールより50〜100倍高速で推奨される。

#### エラーメッセージを修正指示にする（OpenAIの手法）

カスタムリンターのエラーメッセージに「何が間違い」「なぜ」「どう修正するか」「Good/Bad例」を含め、エージェントを"教育"する。エージェントはリンターのエラーメッセージを無視できない（CIが通らない）が、ドキュメントは無視できる。

#### リンター設定保護

エージェントがリンターエラーに直面すると、コード修正ではなくリンター設定を変更してエラーを消す行為が頻繁に観察される。PreToolUseフックで設定ファイルの編集をブロックする。

#### AI生成コード固有のアンチパターン

- **セキュリティ脆弱性**: AI生成コードの36〜40%に脆弱性が含まれる（Snyk調査）
- **コメント洪水**: AI生成リポジトリの90〜100%で「Comments Everywhere」パターン（OX Security調査）
- **ゴーストファイル**: 既存ファイル修正の代わりに似た名前の新ファイルを作成
- **コード重複**: コードベースを検索せずに新しいコードを生成
- **TypeScript any乱用**: 型推論失敗時にanyに逃げる

### 3. AGENTS.md / CLAUDE.mdをポインタとして設計する

- **書くべきもの**: ビルド・テスト・デプロイのコマンド、禁止事項一覧（ADR/リンタールールへの参照付き）、ルーティング指示
- **書くべきでないもの**: 冗長なコーディングスタイルガイド、技術スタック解説、システム現状説明
- **サイズ目標**: 50行以下。IFScaleの研究で150〜200指示で性能が劣化し始めることが確認済み。Vercelは40KBを8KBに圧縮しても100%のパス率を維持
- **ポインタの利点**: 指すファイルが消えれば404に相当するエラーで腐敗が機械的に検出可能

### 4. 計画と実行を分離する

- **Boris Tane（Cloudflare）**: 「計画と実行の分離は最も重要な単一のこと」
- **タスク粒度**: エージェントは一度にすべてをやろうとする。「一度に一つの機能」と指示する
- **完了検証**: E2Eテストで明示的に検証。エージェントの「完了」宣言を鵜呑みにしない

### 5. E2Eテスト戦略：エージェントにあらゆるアプリの「目」を与える

#### Webアプリ：3つのアプローチ

| ツール | トークン消費 | 適用場面 |
|--------|------------|---------|
| Playwright MCP | 約114,000トークン | テストスイートの「生成」に使いCIで独立実行 |
| Playwright CLI | 約27,000トークン（MCPの約4倍効率） | E2Eテストの主力ツール |
| agent-browser (Vercel) | 約5.5Kキャラ（MCP比5.7倍効率） | セルフテストループ、探索的テスト |

#### モバイルアプリ

- Xcode 26.3がMCPネイティブサポートを導入し、iOS開発はプロダクション対応に移行
- iOS: XcodeBuildMCP + Xcode 26.3
- Android: mobile-mcp / Appium MCP
- React Native: Detox + mobile-mcp

#### CLI/TUI

- bats-core: BashスクリプトのTAP準拠テスト
- pexpect/expect: 対話的CLIのテスト

#### API/バックエンド

- **Hurl**: プレーンテキストHTTPリクエスト+アサーション。エージェントとの相性が最高
- **Pact**: マイクロサービス契約テスト
- **Testcontainers**: テスト用DBコンテナの自動管理

#### デスクトップ

- Electron: Playwright(`_electron.launch()`) / MCP経由（エコシステムは断片化中）
- Tauri: tauri-driver (macOS未サポート) / 各種代替ツール
- ネイティブ: TestDriver.ai（Computer-Use SDK）、Terminator（Windows、95%操作成功率）

#### インフラ/DevOps

- terraform test + Conftest + OPA: ポリシーチェック
- container-structure-test: Dockerイメージ構造検証
- kubeconform: Kubernetesマニフェスト検証

#### AI/MLパイプライン

6レイヤーのテスト構造:
1. **データ品質**: GX Core, dbt Tests, Soda Core
2. **モデル評価**: lm-evaluation-harness, LightEval
3. **アプリケーション品質**: DeepEval, promptfoo, RAGAS
4. **エージェント評価**: Maxim AI, LangSmith, Arize Phoenix
5. **安全性**: PyRIT, Guardrails AI, NeMo Guardrails
6. **可観測性**: Arize, Evidently AI, Langfuse

#### アニメーション・トランジション検証

4レイヤーの検証戦略:
1. `getAnimations()` APIでアニメーション完了保証（ms）
2. CLS計測で閾値ベースのテスト失敗（ms）
3. アニメーション凍結+スナップショット比較（Chromatic/Percy/Argos CI）（s）
4. 低FPSフレームキャプチャ → エージェントが直接視認（Stop Hook）

#### ユニバーサルE2E原則

| アプリタイプ | 構造化テキストインターフェース |
|-------------|-------------------------------|
| Web | アクセシビリティツリー (Playwright/agent-browser) |
| Mobile | アクセシビリティツリー (mobile-mcp/XcodeBuild) |
| CLI | 標準出力/エラー出力 (bats/pexpect) |
| API | HTTPレスポンス (Hurl) |
| Desktop | アクセシビリティツリー (Terminator/circuit-mcp) |
| Infra | Plan出力/スキーマ (terraform test/conftest) |
| AI/ML | 評価メトリクス (lm-eval-harness/GX) |

### 6. セッション間の状態管理を設計する

- **起動ルーチンの標準化**: 開発サーバー起動→疎通テスト→タスク選択→Gitログ読み取り→作業ディレクトリ確認
- **Gitをブリッジに**: コミットメッセージと`git log --oneline -20`が最も信頼性の高い記録
- **進捗記録はJSON**: MarkdownよりJSONの方がモデルが不適切に編集する可能性が低い

### 7. プラットフォーム固有のハーネス戦略：Codex vs Claude Code

#### Morphの分析（重要な発見）

同じモデルでもハーネスを変えるとSWE-benchスコアが**22ポイント変動**するが、モデルの交換では**1ポイント**しか変わらない。ハーネスがモデルより重要。

#### アーキテクチャの違い

- **Codex（密室型）**: クラウドサンドボックスで並列実行。PreToolUse/PostToolUse相当のフックが未実装（notifyのみ）
- **Claude Code（作業場型）**: ローカル環境で直接操作。Hooksシステムが最大の差別化要因

#### Codexの現状の制約

- 唯一のフック的機能は`notify`（`agent-turn-complete`イベントのみ）
- ツール実行前後への介入は不可能
- GitHub Discussionで83人以上がHooksシステムをリクエスト、Issue #2109に475以上のupvote
- OpenAIは「より汎用的なイベントフック機能を開発中」と回答

#### ハイブリッド戦略

Claude Codeで計画・設計 → Codexで並列実行 → Claude Codeでレビュー・改善

| 最優先事項 | 推奨 | 理由 |
|-----------|------|------|
| 品質 | Claude Code主軸 | Hooksによる決定論的品質ゲートは代替手段がない |
| スループット | Codex主軸 | 非同期サンドボックスでの並列実行は代替手段がない |
| 両方 | Claude Codeでハーネス構築→Codexでスケール実行 | ハーネスの品質がスケール時の信頼性を決定 |

## 重要な事実・データ

- **Shopifyのリント**: ESLintで75分 → Oxlintで10秒（50〜100倍高速）
- **AI生成コードの脆弱性**: 36〜40%にセキュリティ脆弱性（Snyk調査）
- **コメント洪水**: AI生成リポジトリの90〜100%で観察（OX Security調査）
- **Playwright MCP Tax**: 典型的なブラウザ自動化タスクで約114,000トークン消費
- **SWE-benchスコア**: ハーネス変更で22pt変動 vs モデル変更で1pt変動（Morph分析）
- **IFScale研究**: 150〜200指示でprimacy biasが顕著になり性能劣化
- **Vercelの圧縮**: AGENTS.md 40KB→8KBに圧縮しても100%パス率維持
- **LLM-as-Judge採用率**: 53.3%の組織が採用（LangChain調査）
- **EU AI Act**: ハイリスクAI完全義務化が2026年8月2日施行予定

## アンチパターン

1. **ハーネスなしでスケール**: 複利的なレバレッジではなく複利的な認知的負債が生まれる
2. **エージェント専用インフラの構築**: Stripeの教訓「優れた開発者インフラを構築せよ。エージェントは自動的にその恩恵を受ける」
3. **AGENTS.md/CLAUDE.mdの巨大化**: 50行以下を目指す
4. **リポジトリへの説明文書の蓄積**: 型定義・スキーマ・構造テストで表現する方が腐敗しない
5. **プロンプトだけに頼る**: お願いではなく仕組みで解決する

## 結論・示唆

### 著者の結論

- すべてを一度に導入する必要はない。MVH（最小実行可能ハーネス）から始め、ミスが発生するたびにハーネスを強化する
- フィードバックは速ければ速いほど良い。PostToolUse Hook（ms）→ プリコミット（s）→ CI（min）→ 人間レビュー（h）
- 核心は「プロンプトではなく仕組みで品質を強制する」こと

### 最小実行可能ハーネス（MVH）ロードマップ

| 時期 | 内容 |
|------|------|
| Week 1 | ADR作成、PostToolUseで自動フォーマット、プリコミットフック（Lefthook）、AGENTS.md/CLAUDE.md（50行以下） |
| Week 2-4 | 起動ルーチン標準化、Stop Hookでテスト必須化、E2Eツール導入、計画→承認→実行フロー |
| Month 2-3 | PreToolUse安全性ゲート、ドキュメント→テスト/ADR置換、カスタムリンター（修正指示付きエラー） |
| Month 3+ | 効果測定、複数エージェント同時実行、ガベージコレクション、Planktonパターン |

### 実践的な示唆

- リンター・フォーマッター・型チェッカーは腐敗しない「決定論的ツール」として最優先で導入すべき
- エラーメッセージ自体にルールのドキュメントを書く（エージェントはリンターエラーを無視できない）
- Hooksシステムの有無がプラットフォーム選定の決定的要因になりうる
- アクセシビリティツリーは全アプリタイプに通じるユニバーサルインターフェース

## 制限事項・注意点

- Harness Engineeringは数カ月〜1年で重要でなくなる可能性がある（LLM能力向上・Coding Agent自体への還元）
- agent-browser（Vercel）はリリースから2ヶ月で未成熟、Windows未対応
- Electron MCP Server空間は断片化しており支配的標準が不在
- Codexの汎用Hooksシステムは開発中で未リリース
- TauriのmacOS E2Eテストにはプラットフォーム固有の制約がある
- EU AI Actの完全義務化（2026年8月）により安全性テストの要件が変わる可能性がある

---

*Source: [Claude Code / Codex ユーザーのための誰でもわかるHarness Engineeringベストプラクティス](https://nyosegawa.github.io/posts/harness-engineering-best-practices-2026/)*