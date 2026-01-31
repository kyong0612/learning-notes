---
title: "Claude Code Orchestra: Claude Code × Codex CLI × Gemini CLIの最適解を探る"
source: "https://zenn.dev/mkj/articles/claude-code-orchestra_20260120"
author:
  - "[[Taisei Ozaki]]"
  - "[[松尾研究所]]"
published: 2026-01-30
created: 2026-01-31
description: "Claude Code、Codex CLI、Gemini CLIの3つのCLIエージェントを協調させる「マルチエージェントオーケストレーション」テンプレートを紹介。各ツールの得意分野を活かし、Claude Codeをオーケストレーターとして効率的な開発環境を構築する手法を解説。"
tags:
  - "clippings"
  - "AI"
  - "Claude"
  - "Claude Code"
  - "Codex CLI"
  - "Gemini CLI"
  - "マルチエージェント"
  - "開発ツール"
---

## 概要

本記事は、**Claude Code、Codex CLI、Gemini CLI**の3つのCLIベースAIコーディングアシスタントを協調させる「**マルチエージェントオーケストレーション**」テンプレートを紹介している。松尾研究所のTaisei Ozaki氏（25卒データサイエンティスト）による解説記事。

## 1. なぜ複数のCLIエージェントを協調させるのか

### 各ツールの得意分野と限界

| ツール | 得意なこと | 苦手なこと |
|--------|-----------|-----------|
| **Claude Code** | 高速な実装、コード編集、日常的な開発タスク | 複雑な設計判断、巨大なコンテキスト |
| **Codex CLI** | 深い推論、設計判断、デバッグ分析 | 高速なレスポンス |
| **Gemini CLI** | 巨大なコンテキスト、リサーチ、マルチモーダル | コーディング |

### 単一ツールの限界

- **Claude Codeだけ**: 複雑な設計判断で物足りない、セカンドオピニオンが欲しい
- **Codex CLIだけ**: 日常的な作業には重い、レスポンスが遅い
- **Gemini CLIだけ**: コーディングそのものがやや不安、実装作業には向かない

### 「別タブで開く」運用の問題点

| 問題 | 具体的な症状 |
|------|------------|
| **認知負担が大きい** | 2つのタブを行き来し、それぞれの状態を把握する必要がある |
| **コンテキストが分断される** | Claude CodeはCodexに何を聞いたか知らない、Codexも逆を知らない |
| **情報の橋渡しが手動** | 「Codexがこう言ってた」と自分でコピペして伝える必要がある |
| **判断の一貫性がない** | お互いに相談しない部下2人を雇っているような状態 |

### マルチエージェントオーケストレーションのメリット

**インターフェースはClaude Codeだけ**。ユーザーはClaude Codeとだけ対話し、必要に応じてClaude CodeがCodexやGeminiに相談する。

| 利点 | 具体的な効果 |
|------|------------|
| **認知負担が軽い** | ユーザーはClaude Codeとだけ対話すればよい |
| **コンテキストが統合される** | Claude CodeがCodex/Geminiへの相談内容と結果を把握 |
| **情報の橋渡しが自動** | Claude Codeが必要な情報を適切に伝達・要約 |
| **判断の一貫性がある** | オーケストレーターが全体を統括し、矛盾のない意思決定 |

> 別タブ運用は「お互いに相談しない部下2人を雇っている」状態。本テンプレートは「優秀なリーダー1人が、専門家チームを束ねている」状態。

### 役割分担

| 役割 | エージェント | いつ使うか |
|------|-------------|-----------|
| **オーケストレーター** | Claude Code | 常時：メインの開発作業、他エージェントへの委譲判断 |
| **深い推論** | Codex CLI | 設計判断、デバッグ、トレードオフ分析、コードレビュー |
| **リサーチ** | Gemini CLI | ライブラリ調査、リポジトリ全体分析、マルチモーダル処理 |
| **並列実行** | サブエージェント | 独立した小タスクの並列処理 |

## 2. テンプレートの全体構造

### ディレクトリ構成

```
project/
├── CLAUDE.md                    # プロジェクトのメインドキュメント
├── pyproject.toml               # Pythonプロジェクト設定
│
├── .claude/                     # Claude Code (Orchestrator) の設定
│   ├── settings.json            # 権限設定 + Hooks定義
│   ├── agents/                  # サブエージェント定義
│   │   └── general-purpose.md   # 汎用サブエージェント（Codex/Gemini呼び出し可能）
│   ├── hooks/                   # 自動協調提案フック(Python)
│   │   ├── agent-router.py      # ユーザー入力からエージェント振り分け
│   │   ├── check-codex-before-write.py
│   │   ├── check-codex-after-plan.py
│   │   ├── suggest-gemini-research.py
│   │   ├── post-implementation-review.py
│   │   └── post-test-analysis.py
│   ├── rules/                   # 常時適用ルール（7ファイル）
│   ├── docs/                    # 知識ベース
│   │   ├── DESIGN.md            # 設計ドキュメント（自動更新）
│   │   ├── research/            # Geminiの調査結果
│   │   └── libraries/           # ライブラリドキュメント
│   ├── logs/                    # ログディレクトリ
│   └── skills/                  # スキル定義（13スキル）
│
├── .codex/                      # Codex CLI の設定
│   ├── AGENTS.md
│   └── skills/
│       └── context-loader/      # .claude/のコンテキストを読み込む
│
└── .gemini/                     # Gemini CLI の設定
    ├── GEMINI.md
    ├── settings.json
    └── skills/
        └── context-loader/
```

### 設計のポイント

1. **知識ベースの一元管理**: `.claude/docs/`に設計ドキュメント、リサーチ結果、ライブラリ情報を集約
2. **Hooksによる自動協調提案**: 6つのPythonスクリプトが自動的に適切なエージェントへの協調を提案
3. **3つのCLIエージェントの協調**: Claude Code（オーケストレーター）、Codex CLI（深い推論）、Gemini CLI（リサーチ）
4. **自動記憶**: 設計決定やライブラリの制約を自動的に記録
5. **サブエージェントパターン**: コンテキスト保護のためTask toolを活用

## 3. 参考にしたリソース

### Anthropic公式: Claude Code Best Practices

| 公式ベストプラクティス | 本テンプレートでの適用 |
|---------------------|---------------------|
| CLAUDE.mdによる文脈提供 | プロジェクト固有の情報をCLAUDE.mdに集約 |
| Explore-Plan-Code-Commitワークフロー | `/plan`, `/tdd`, `/startproject`スキルで実現 |
| マルチClaude並列実行 | Codex/Geminiをバックグラウンドで並列実行 |
| Course Correction | Hooksによる自動的な軌道修正提案 |

### Everything Claude Code

Affaan Mustafa氏が公開しているClaude Codeの設定コレクション。2025年9月のAnthropic×Forum Venturesハッカソン（NYC）優勝者の設定。

| Everything Claude Code | 本テンプレートでの適用 |
|-----------------------|---------------------|
| Hooksによる自動化 | 6つのHooksでエージェント協調を自動提案 |
| Skillsによるワークフロー定義 | `/startproject`, `/codex-system`, `/gemini-system`等 |
| Rulesによる常時適用ルール | `coding-principles`, `security`, `testing`等 |
| Agentsによるサブエージェント | Codex/Geminiを外部エージェントとして活用 |

### MCPベースアプローチとの比較

本テンプレートはMCPではなく**Skillsベース**のアプローチを採用。

| 観点 | MCPベース | Skillsベース（本テンプレート） |
|------|----------|---------------------------|
| **安定性** | 不安定との報告あり | 直接CLIを呼び出すため安定 |
| **協調のタイミング** | ユーザーが明示的に呼び出す必要 | **Hooksが自動的に提案** |
| **ワークフロー** | 単発のツール呼び出し | **複合フェーズを定義可能** |
| **コンテキスト共有** | 各MCPは独立 | **context-loaderで3CLI間で知識共有** |
| **出力制御** | そのままメインコンテキストに流入 | **サブエージェントで要約してから返却** |

## 4. Hooksによる自動協調提案

6つのPythonスクリプトがユーザーの入力やツール使用を監視し、適切なエージェントへの協調を自動的に提案。

| Hook | トリガー | 提案内容 |
|------|---------|---------|
| **agent-router** | ユーザー入力時 | 入力内容から適切なエージェントを判定 |
| **check-codex-before-write** | ファイル編集前 | 複雑な変更前にCodex相談を提案 |
| **check-codex-after-plan** | Task完了後 | 計画作成後にCodexレビューを提案 |
| **suggest-gemini-research** | WebSearch/WebFetch前 | Web検索の代わりにGeminiリサーチを提案 |
| **post-implementation-review** | ファイル編集後 | 大きな実装後にCodexレビューを提案 |
| **post-test-analysis** | Bash実行後 | テスト失敗時にCodex分析を提案 |

### agent-routerの振り分けトリガー

**Codexへ**: 設計、アーキテクチャ、デバッグ、比較分析、レビュー、リファクタ

**Geminiへ**: リサーチ、調査、マルチモーダル（pdf、動画、音声）、ドキュメント調査

## 5. Codex CLI との連携

Codex CLI（gpt-5.2-codex）は**深い推論が必要なタスク**を担当。

### いつCodexに相談するか

**MUST（必ず相談）:**
- 設計判断の前（どう構造化すべき？どのアプローチが良い？）
- 複雑な実装の前（新機能設計、3+ファイルへの変更、API設計）
- デバッグ時（原因が明確でない、最初の修正が失敗した）
- 計画時（複数ステップのタスク、トレードオフの評価）

**相談不要:**
- 単純なファイル編集（タイポ修正、小さな変更）
- 標準的な操作（git commit, テスト実行, lint）

> **Quick Rule**: 「うーん、これどうしよう？」と思ったら → Codexに相談

### 言語プロトコル

1. Codexへは**英語**で質問（推論精度が向上）
2. 英語で回答を受け取る
3. ユーザーには**日本語**で報告

## 6. Gemini CLI との連携

Gemini CLI（gemini-3-pro-preview）は**リサーチと大規模コンテキスト処理**を担当。

### なぜGeminiにリサーチを委譲するのか

Claude CodeでWebFetchを多用すると：
- コンテキストが急速に消費される
- 応答が遅くなる
- 本来の実装作業に使えるコンテキストが減少

**Gemini CLI（1Mトークン）に委譲**することで、大量のドキュメントを処理し、要約だけをClaude Codeに返却。

### Gemini vs Codex の使い分け

| タスク | Gemini | Codex |
|--------|--------|-------|
| リポジトリ全体理解 | ✓ | |
| ライブラリ調査 | ✓ | |
| マルチモーダル（pdf/動画/音声） | ✓ | |
| 最新ドキュメント検索 | ✓ | |
| 設計判断 | | ✓ |
| デバッグ | | ✓ |
| コード実装 | | ✓ |

> **使い分けの指針**: 「調べる」ならGemini、「考える」ならCodex

## 7. /startproject ワークフロー

3つのエージェントが協調してプロジェクトを開始する6フェーズのワークフロー。

```
Phase 1: Gemini CLI (Research) [Background]
→ リポジトリ分析・ライブラリ調査
→ Output: .claude/docs/research/{feature}.md

Phase 2: Claude Code (Requirements)
→ ユーザーから要件ヒアリング（目的、スコープ、制約、成功基準）
→ 実装計画のドラフト作成

Phase 3: Codex CLI (Design Review) [Background]
→ Geminiのリサーチ + Claudeの計画を読み込み
→ 計画の深いレビュー・リスク分析・実装順序の提案

Phase 4: Claude Code (Task Creation)
→ 全入力を統合
→ タスクリスト作成 (TodoWrite)
→ ユーザー確認

Phase 5: Claude Code (Documentation)
→ CLAUDE.md にプロジェクトコンテキストを追記
→ .claude/docs/DESIGN.md に設計決定を記録

Phase 6: Multi-Session Review (Quality Assurance)
→ 新しいClaudeセッションで客観的なコードレビュー
→ またはCodexに実装後レビューを委託
→ 実装バイアスを排除した品質保証
```

## 8. /checkpointing スキル

長時間の開発セッションでのコンテキスト喪失や作業パターンの記録を解決。

| モード | コマンド | 用途 |
|--------|---------|------|
| **Session History** | `/checkpointing` | Codex/Geminiの相談ログをエージェント設定ファイルに追記 |
| **Full Checkpoint** | `/checkpointing --full` | gitコミット、ファイル変更、CLI相談を完全保存 |
| **Skill Analysis** | `/checkpointing --full --analyze` | 作業パターンを分析し、再利用可能なスキル候補を抽出 |

## 9. Rules（常時適用ルール）

| ルール | 内容 |
|--------|------|
| **language** | 思考は英語、ユーザーへの応答は日本語 |
| **codex-delegation** | Codexへの相談ルール |
| **gemini-delegation** | Geminiへの委譲ルール |
| **coding-principles** | シンプルさ、単一責任、早期リターン、型ヒント |
| **dev-environment** | uv、ruff、ty、marimo の使用方法 |
| **security** | 機密情報管理、入力検証、SQLi/XSS防止 |
| **testing** | TDD、AAA パターン、カバレッジ80% |

## 10. 導入方法

### Prerequisites

```bash
# Claude Code
npm install -g @anthropic-ai/claude-code
claude login

# Codex CLI
npm install -g @openai/codex
codex login

# Gemini CLI
npm install -g @google/gemini-cli
gemini login
```

### 既存プロジェクトへの適用

```bash
git clone --depth 1 https://github.com/DeL-TaiseiOzaki/claude-code-orchestra.git .starter \
&& cp -r .starter/.claude .starter/.codex .starter/.gemini .starter/CLAUDE.md . \
&& rm -rf .starter
```

## まとめ

### ポイント

1. **3エージェントの役割分担**: Claude Code（オーケストレーター）、Codex（深い推論）、Gemini（リサーチ）
2. **Hooksによる自動協調提案**: 6つのフックがエージェント協調を自動的に提案
3. **`/startproject`ワークフロー**: 6フェーズ（調査→計画→レビュー→実行→記録→品質保証）
4. **サブエージェントパターン**: コンテキストを保護しながら重い処理を外部CLIに委譲
5. **`/checkpointing`スキル**: セッション永続化と作業パターンからのスキル抽出
6. **マルチセッションレビュー**: 実装バイアスを排除した客観的な品質保証
7. **知識ベースの一元管理**: `.claude/docs/`に設計、リサーチ結果、ライブラリ情報を集約

## 参考リンク

### 公式リソース
- [Claude Code 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [OpenAI Codex CLI](https://github.com/openai/codex)
- [Google Gemini CLI](https://github.com/google/gemini-cli)

### テンプレート・設定集
- [claude-code-orchestra](https://github.com/DeL-TaiseiOzaki/claude-code-orchestra) - 本記事で紹介したテンプレート
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) - Anthropicハッカソン優勝者の設定集
- [Everything Claude Code 解説記事](https://zenn.dev/tmasuyama1114/articles/everything-claude-code-concepts) - 日本語での詳細解説
