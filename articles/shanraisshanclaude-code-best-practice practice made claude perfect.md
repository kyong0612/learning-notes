---
title: "shanraisshan/claude-code-best-practice: practice made claude perfect"
source: "https://github.com/shanraisshan/claude-code-best-practice"
author:
  - "shanraisshan (Shan Rais Shan)"
published: 2026-03-30
created: 2026-03-31
description: "Claude Codeのベストプラクティスを体系的にまとめたリポジトリ。Subagents、Commands、Skills、Hooks、MCP Servers、Plugins、Memory、Settingsなどの主要機能の使い方と、87個のTips & Tricks、8つの開発ワークフロー比較、Boris Cherny（Claude Code創設者）らAnthropicチームからの実践的アドバイスを網羅。GitHub Stars 27,000超。"
tags:
  - "claude-code"
  - "best-practice"
  - "ai-coding"
  - "subagents"
  - "skills"
  - "commands"
  - "hooks"
  - "development-workflow"
  - "context-engineering"
---

## 概要

**claude-code-best-practice** は、Claude Codeを最大限に活用するためのベストプラクティス集。「practice makes claude perfect」をモットーに、Claude Codeの全機能（Subagents、Commands、Skills、Hooks、MCP Servers、Plugins、Memory、Settings等）について、公式ドキュメントへのリンク、ベストプラクティスガイド、実装例をテーブル形式で整理している。GitHub Stars 27,000超、2026年3月のGitHub Trendingリポジトリ。

---

## 🧠 CONCEPTS（主要機能一覧）

Claude Codeの中核機能を体系的に整理：

| 機能 | 配置場所 | 概要 |
|------|----------|------|
| **Subagents** | `.claude/agents/.md` | 隔離されたコンテキストで動作する自律的アクター。カスタムツール、権限、モデル、メモリ、永続的なアイデンティティを持つ |
| **Commands** | `.claude/commands/.md` | 既存コンテキストに注入される知識。ワークフローオーケストレーション用のシンプルなプロンプトテンプレート |
| **Skills** | `.claude/skills/<name>/SKILL.md` | 設定可能、プリロード可能、自動発見可能な知識注入。コンテキストフォークとプログレッシブディスクロージャーに対応 |
| **Workflows** | `.claude/commands/` | Command → Agent → Skill パターンによるオーケストレーション |
| **Hooks** | `.claude/hooks/` | エージェントループ外で特定イベント時に実行されるハンドラー（スクリプト、HTTP、プロンプト、エージェント） |
| **MCP Servers** | `.claude/settings.json`, `.mcp.json` | 外部ツール、データベース、APIへのModel Context Protocol接続 |
| **Plugins** | 配布パッケージ | Skills、Subagents、Hooks、MCP Servers、LSP Serversのバンドル |
| **Settings** | `.claude/settings.json` | 階層的設定システム（権限、モデル設定、出力スタイル、サンドボックス等） |
| **Status Line** | `.claude/settings.json` | コンテキスト使用量、モデル、コスト、セッション情報を表示するカスタマイズ可能なステータスバー |
| **Memory** | `CLAUDE.md`, `.claude/rules/` | CLAUDE.mdファイルと`@path`インポートによる永続的コンテキスト |
| **Checkpointing** | 自動（git-based） | ファイル編集の自動追跡。`Esc Esc`または`/rewind`で巻き戻し可能 |

### 🔥 注目の新機能

| 機能 | 概要 |
|------|------|
| **Auto Mode** (beta) | バックグラウンド安全分類器が手動権限プロンプトを置き換え。プロンプトインジェクションやリスクのあるエスカレーションをブロック |
| **Channels** (beta) | Telegram、Discord、WebhookからイベントをプッシュしClaude が自動で反応 |
| **Slack** | チームチャットで@Claudeをメンション、バグ修正やコードレビューのタスク実行 |
| **Code Review** (beta) | マルチエージェントPR分析。バグ、セキュリティ脆弱性、リグレッションを検出 |
| **GitHub Actions** | CI/CDパイプラインでPRレビュー、Issue仕分け、コード生成を自動化 |
| **Chrome** (beta) | Chrome内ブラウザ自動化。Webアプリテスト、コンソールデバッグ、フォーム自動化 |
| **Scheduled Tasks** | `/loop`でローカル定期実行（最大3日間）。`/schedule`でクラウドベースの定期タスク（マシンオフでも実行） |
| **Voice Dictation** (beta) | 20言語対応のプッシュ・トゥ・トーク音声入力 |
| **Agent Teams** (beta) | 複数エージェントが同一コードベースで並列作業、共有タスク調整 |
| **Remote Control** | ローカルセッションを任意デバイス（スマホ、タブレット、ブラウザ）から継続 |
| **Ralph Wiggum Loop** | 長時間自律タスク用の自動開発ループプラグイン |

---

## ⚙️ 開発ワークフロー比較

すべての主要ワークフローは共通のアーキテクチャパターンに収束：**Research → Plan → Execute → Review → Ship**

| 名前 | ★ Stars | 特徴 |
|------|---------|------|
| **Superpowers** | 122k | TDDファースト、Iron Laws、全プランレビュー |
| **Everything Claude Code** | 116k | 直感スコアリング、AgentShield、多言語ルール |
| **Spec Kit** (GitHub公式) | 83k | スペック駆動、constitution、22+ツール |
| **gstack** | 55k | ロールペルソナ、/codex review、並列スプリント |
| **Get Shit Done** | 44k | 200Kコンテキスト刷新、ウェーブ実行、XMLプラン |
| **BMAD-METHOD** | 43k | フルSDLC、エージェントペルソナ、22+プラットフォーム |
| **OpenSpec** | 35k | デルタスペック、ブラウンフィールド、アーティファクトDAG |
| **Compound Engineering** | 12k | 複合学習、マルチプラットフォームCLI、プラグインマーケットプレイス |
| **HumanLayer** | 10k | RPI、コンテキストエンジニアリング、300k+ LOC |

---

## 💡 TIPS AND TRICKS（87個）

### Prompting（3）

- **Claudeに挑戦させる** — 「変更内容について厳しく質問して、テストに合格するまでPRを作らないで」と指示。Claudeにmainとブランチ間のdiffを実施させる
- **平凡な修正の後** — 「今知っていることを全て踏まえて、これを捨ててエレガントな解決策を実装して」
- **バグ修正はClaude任せ** — バグを貼り付けて「fix」と言うだけ。方法をマイクロマネジメントしない

### Planning/Specs（6）

- **常にプランモードから開始する**（Boris推奨）
- **最小限のスペックから始めてClaudeにAskUserQuestionツールでインタビューさせる**。その後、新しいセッションでスペックを実行（Thariq推奨）
- **フェーズ分割されたゲート付きプランを作成**。各フェーズに複数テスト（ユニット、自動化、統合）
- **2つ目のClaudeでプランをスタッフエンジニアとしてレビュー**、またはクロスモデルレビュー
- **詳細なスペックを書いて曖昧さを減らす** — 具体的であればあるほど出力品質が向上
- **PRD＜プロトタイプ** — スペックを書く代わりに20-30バージョン作る。構築コストが低いので多くの試行を

### CLAUDE.md（7）

- **CLAUDE.mdは1ファイルあたり200行以内**を目標に（HumanLayerは60行）
- **ドメイン固有のルールは`<important>`タグで囲む** — ファイルが長くなるとClaudeが無視するのを防止
- **モノレポでは複数のCLAUDE.mdを使用** — 祖先＋子孫ローディング
- **`.claude/rules/`で大きな指示を分割**
- **memory.md、constitution.mdは保証なし**
- **「テストを実行」が初回で動くようにする** — 動かないならCLAUDE.mdにセットアップ/ビルド/テストコマンドが不足
- **settings.jsonでハーネス強制動作を設定**（attribution、permissions、model）— CLAUDE.mdに「NEVER add Co-Authored-By」と書く代わりに`attribution.commit: ""`で決定的に制御

### Agents（4）

- **機能別のサブエージェント**（追加コンテキスト）とスキル（プログレッシブディスクロージャー）を持つ。汎用的なqa/backendエンジニアではなく
- **「use subagents」と言ってコンピュート追加** — タスクをオフロードしてメインコンテキストをクリーンに保つ
- **tmuxでエージェントチーム**とgit worktreesで並列開発
- **テスト時間のコンピュート活用** — 別のコンテキストウィンドウで結果が向上。あるエージェントがバグを起こし、別のエージェント（同モデル）がそれを見つける

### Commands（3）

- **ワークフローにはサブエージェントよりコマンドを使用**
- **毎日何度も行う「インナーループ」ワークフローにスラッシュコマンドを使用** — `.claude/commands/`に配置しgitにチェックイン
- **1日に2回以上やることはスキルかコマンドに** — `/techdebt`、context-dump、analyticsコマンド等を構築

### Skills（9）

- **`context: fork`でスキルを隔離されたサブエージェントで実行** — メインコンテキストには最終結果のみ表示
- **モノレポではサブフォルダ内のスキルを使用**
- **スキルはファイルではなくフォルダ** — `references/`、`scripts/`、`examples/`サブディレクトリでプログレッシブディスクロージャー
- **すべてのスキルにGotchasセクションを構築** — 最も価値の高いコンテンツ。時間とともにClaudeの失敗ポイントを追加
- **スキルのdescriptionフィールドは要約ではなくトリガー** — モデル向けに書く（「いつ起動すべき？」）
- **スキルでは当たり前のことを書かない** — Claudeのデフォルト動作から外れる部分に集中
- **スキルでClaudeを型にはめない** — 目標と制約を与え、命令的なステップバイステップ指示は避ける
- **スキルにスクリプトとライブラリを含める** — Claudeがボイラープレートを再構築するのではなく合成できるように
- **SKILL.mdに `` !`command` `` を埋め込む** — 動的シェル出力をプロンプトに注入

### Hooks（5）

- **スキル内のオンデマンドフック** — `/careful`で破壊的コマンドをブロック、`/freeze`でディレクトリ外の編集をブロック
- **PreToolUseフックでスキル使用量を測定** — 人気スキルやトリガー不足スキルの発見
- **PostToolUseフックでコード自動フォーマット** — Claudeが生成したコードの残り10%をフックが処理しCIエラーを防止
- **権限リクエストをOpusにルーティングするフック** — 攻撃をスキャンし安全なものを自動承認
- **Stopフックで作業終了時にClaudeに続行を促す**、または作業の検証を促す

### Workflows（7）

- **エージェントのダムゾーンを避ける** — コンテキスト50%で手動`/compact`。タスク切り替え時は`/clear`でリセット
- **小さなタスクではバニラClaude Codeがワークフローより優れている**
- **`/model`でモデルと推論を選択**。プランモードにOpus、コードにSonnetの使い分け
- **常にthinking modeをtrue**、Output StyleをExplanatory（★ Insight boxes付き詳細出力）に設定
- **ultrathinkキーワードでハイエフォート推論を発動**
- **`/rename`で重要なセッションにラベル付け**（例: `[TODO - refactor task]`）、`/resume`で後で再開
- **`Esc Esc`や`/rewind`でClaudeが脱線した際に巻き戻す** — 同じコンテキストで修正しようとしない

### Workflows Advanced（6）

- **ASCIIダイアグラムを多用してアーキテクチャ理解**
- **`/loop`でローカル定期監視**（最大3日）、**`/schedule`でクラウドベースの定期タスク**
- **Ralph Wiggumプラグインで長時間自律タスク**
- **`/permissions`でワイルドカード構文を使用**（`Bash(npm run *)`、`Edit(/docs/**)`）— `dangerously-skip-permissions`は使わない
- **`/sandbox`で権限プロンプトを84%削減**（ファイル・ネットワーク分離）
- **製品検証スキルに投資**（signup-flow-driver、checkout-verifier）— 完璧にするために1週間かける価値あり

### Git / PR（5）

- **PRは小さく焦点を絞る** — Boris: p50で118行（1日で141 PR、45K行変更）。1機能1PR。レビューと巻き戻しが容易
- **常にsquash merge** — クリーンなリニア履歴、1機能1コミット、`git revert`と`git bisect`が容易
- **頻繁にコミット** — 最低1時間に1回、タスク完了時に即コミット
- **同僚のPRに@claudeをタグ付け** — 繰り返しのレビューフィードバックから自動的にlintルールを生成
- **`/code-review`でマルチエージェントPR分析** — マージ前にバグ、セキュリティ脆弱性、リグレッションを検出

### Debugging（7）

- **行き詰まったらスクリーンショットを撮ってClaudeに共有**する習慣
- **MCP（Claude in Chrome、Playwright、Chrome DevTools）でClaudeにコンソールログを自動確認させる**
- **ログを見たいターミナルをバックグラウンドタスクとして実行させる**
- **`/doctor`でインストール、認証、設定の問題を診断**
- **コンパクション中のエラーは`/model`で1Mトークンモデルを選択後`/compact`で解決**
- **クロスモデルでQA** — 例：Codexでプランと実装レビュー
- **エージェント検索（glob + grep）がRAGに勝る** — Claude CodeチームはベクターDBを試して放棄。コードの同期ずれと権限の複雑さが原因

### Utilities（5）

- **iTerm/Ghostty/tmuxターミナルをIDEの代わりに使用**（Boris推奨）
- **Wispr Flowで音声プロンプティング**（10x生産性）
- **claude-code-hooksでClaudeフィードバック**
- **ステータスラインでコンテキスト認識と高速コンパクティング**
- **settings.jsonのPlans Directory、Spinner Verbsなどの機能を探索**

### Daily（4）

- **Claude Codeを毎日更新**し、changelogを読んで1日を始める
- **r/ClaudeAI、r/ClaudeCodeをフォロー**
- **Boris、Thariq、Cat、Lydia、Noah等のAnthropicチームメンバーをフォロー**
- **Jesse、Affaan、Garry、Dex等のコミュニティメンバーをフォロー**

---

## ☠️ Claude Codeが置き換えたスタートアップ/ビジネス

| Claude Code機能 | 置き換えたサービス |
|-----------------|-------------------|
| Code Review | Greptile, CodeRabbit, Devin Review, OpenDiff, Cursor BugBot |
| Voice Dictation | Wispr Flow, SuperWhisper |
| Remote Control | OpenClaw |
| Cowork | OpenAI Operator, AgentShadow |
| Tasks | Beads |
| Plan Mode | Agent OS |
| Skills / Plugins | YC AI wrapperスタートアップ群 |

---

## 💰 Billion-Dollar Questions（未解決の重要な問い）

### Memory & Instructions（4問）

1. CLAUDE.mdに何を入れ、何を入れないべきか？
2. CLAUDE.mdがあれば、別のconstitution.mdやrules.mdは本当に必要か？
3. CLAUDE.mdの更新頻度は？古くなったことをどう判断する？
4. ALL CAPSでMUSTと書いてもClaudeが無視するのはなぜ？

### Agents, Skills & Workflows（6問）

1. Command vs Agent vs Skill — いつバニラClaude Codeの方が良いか？
2. モデル改善に伴い、エージェント・コマンド・ワークフローの更新頻度は？
3. サブエージェントに詳細なペルソナを与えると品質は向上するか？
4. Claude Code組み込みプランモードを使うべきか、独自のプランニングコマンド/エージェントを構築すべきか？
5. 個人スキルとコミュニティスキルが競合した場合どちらが優先？
6. 既存コードベースをスペック化し、コードを削除し、AIがスペックから同じコードを再生成することは可能か？

### Specs & Documentation（3問）

1. リポジトリの全機能にスペック（markdownファイル）を持つべきか？
2. 新機能実装でスペックが陳腐化しない更新頻度は？
3. 新機能実装時の他機能スペックへの波及効果をどう扱うか？

---

## Boris Cherny（Claude Code創設者）+ チームのリソース

### 主要記事・ツイート

- **15 Hidden & Under-Utilized Features in Claude Code** (2026/03/30)
- **Squash Merging & PR Size Distribution** (2026/03/25)
- **Lessons from Building Claude Code: How We Use Skills** (Thariq, 2026/03/17)
- **12 ways how people are customizing their claudes** (2026/02/12)
- **10 tips for using Claude Code from the team** (2026/02/01)
- **13 tips from my surprisingly vanilla setup** (2026/01/03)

### 動画・ポッドキャスト

- **Building Claude Code with Boris Cherny** (The Pragmatic Engineer, 2026/03/04)
- **Head of Claude Code: What happens after coding is solved** (Lenny's Podcast, 2026/02/19)
- **Inside Claude Code With Its Creator Boris Cherny** (Y Combinator, 2026/02/17)

---

## 重要な結論と発見

1. **「Research → Plan → Execute → Review → Ship」パターンが全ワークフローの基盤** — どのフレームワークを使うかではなく、このサイクルの規律が重要
2. **バニラClaude Codeの方が小タスクには優秀** — ワークフローのオーバーヘッドは大タスク向け
3. **コンテキストエンジニアリングが鍵** — CLAUDE.md 200行以内、`/compact`のタイミング管理、サブエージェントによるコンテキスト分離
4. **スキルはフォルダ構造で段階的開示** — ファイル1枚でなく、references/scripts/examples/を活用
5. **エージェント検索（glob + grep）がRAGに勝る** — ベクターDBはコードベースで実用的でないとClaude Codeチームが結論
6. **PRサイズp50=118行、squash merge必須** — Boris自身の1日141PR・45K行の実績に基づく実践値
7. **サンドボックスで権限プロンプトを84%削減** — 開発フロー改善の最大効果施策の一つ