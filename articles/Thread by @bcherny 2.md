---
title: "Thread by @bcherny — Claude Code 10 Tips from the Creator"
source: "https://x.com/bcherny/status/2017742741636321619?s=12"
author:
  - "Boris Cherny (@bcherny)"
published: 2026-01-31
created: 2026-02-28
description: "Claude Codeの生みの親であるBoris Cherny（Anthropic Head of Claude Code）が、Claude Codeチーム内部で実際に使われている10のTipsを共有したスレッド。並列ワークツリー、プランモード、CLAUDE.md、カスタムスキル、MCP連携によるバグ修正、プロンプティング技法、ターミナル設定、サブエージェント、データ分析、学習活用まで包括的に網羅。8.5M viewsを獲得したバイラルスレッド。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI coding"
  - "productivity"
  - "Anthropic"
  - "git worktrees"
  - "CLAUDE.md"
  - "MCP"
  - "subagents"
  - "prompting"
---

## 概要

Boris ChernyはClaude Codeの開発者であり、Anthropicで Head of Claude Code を務めている。2024年9月にサイドプロジェクトとしてClaude Codeを作成し、現在では年間ランレート10億ドルの製品に成長した。2026年1月31日にXで公開されたこのスレッドは、8.5M views、49K likes、6.4K repostsを獲得した。

> "I'm Boris and I created Claude Code. There is no one right way to use Claude Code -- everyone's setup is different. You should experiment to see what works for you!"

---

## Tip 1: 並列で作業する（Do More in Parallel）

**チーム内で最も重要な生産性向上のTip。**

- **3〜5個のgit worktreeを同時に起動**し、それぞれで独立したClaudeセッションを並列実行する
- Boris本人は複数のgit checkoutを使用するが、チームの大半はworktreeを好む
- @amorrisscodeがClaude DesktopアプリにネイティブのWorktreeサポートを実装した理由もこれ
- Worktreeに名前をつけてシェルエイリアス（`za`, `zb`, `zc`）を設定し、1キーストロークで切り替える人もいる
- 専用の「analysis」worktreeをログ読み取りやBigQuery専用にしている人もいる

```bash
# worktreeを作成
$ git worktree add .claude/worktrees/my-worktree origin/main

# worktreeに移動してClaudeを起動
$ cd .claude/worktrees/my-worktree && claude
```

**Borisの個人セットアップ**: ターミナルで5つの並列セッション（タブ1〜5に番号付け）+ claude.ai/code で5〜10のWebセッション、さらにiPhoneのClaudeアプリからもセッションを開始。

![Image](https://pbs.twimg.com/media/HABmmP6bwAAWgUM?format=jpg&name=large)

参考: [Claude Code Common Workflows - Parallel Sessions](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees)

---

## Tip 2: 複雑なタスクはプランモードから始める（Start in Plan Mode）

> "Pour your energy into the plan so Claude can 1-shot the implementation."

- **Shift+Tab** でプランモードに切り替え（読み取り専用の探索モード）
- 計画に注力することで、Claudeが実装を一発で完了できる確率が大幅に上がる

### チームの使い方

1. **二段階レビュー方式**: 1つ目のClaudeで計画を書かせ、2つ目のClaudeにスタッフエンジニアとしてレビューさせる
2. **即座にプランモードへ戻る**: 実装中に何かおかしくなった瞬間にプランモードに切り替えて再計画する。無理にpushし続けない
3. **検証にもプランモードを使う**: ビルドだけでなく、検証ステップにもプランモードを明示的に指示する

![Image](https://pbs.twimg.com/media/HABm-MtbEAAMlsS?format=png&name=large)

---

## Tip 3: CLAUDE.mdに投資する（Invest in Your CLAUDE.md）

> "After every correction, end with: 'Update your CLAUDE.md so you don't make that mistake again.' Claude is eerily good at writing rules for itself."

- CLAUDE.mdはセッション開始時に読み込まれる永続メモリファイル
- 修正のたびに「CLAUDE.mdを更新して、同じミスを繰り返さないようにして」と指示する
- **Claudeは自分自身のためのルールを書くのが驚くほど上手い**
- 時間をかけて容赦なく編集する。古いルールの削除、重複の統合、表現の精緻化

### メモリファイルの優先順位階層

| 優先度 | ファイル場所 | スコープ |
|--------|-------------|----------|
| 1（最高） | Managed Policy | エンタープライズ全体 |
| 2 | `./CLAUDE.md` | プロジェクトルート（gitで共有） |
| 3 | `.claude/rules/*.md` | プロジェクト固有ルール |
| 4 | `~/.claude/CLAUDE.md` | ユーザー全体（全プロジェクト） |
| 5 | `./CLAUDE.local.md` | ローカル設定（gitignore） |
| 6 | `~/.claude/projects/*/memory/` | 自動メモリ（Claude自身が書く） |

### ベストプラクティス

- ビルドコマンド、スタイルガイド、アーキテクチャ決定を含める
- gitにチェックインしてチーム全体で共有する
- PRの際に `@.claude` をタグ付けして学びを統合する
- 1人のエンジニアは、Claudeにタスク/プロジェクトごとのnotesディレクトリを管理させ、PRの度に更新。CLAUDE.mdからそれを参照している

![Image](https://pbs.twimg.com/media/HABoHn9bQAAE-S1?format=png&name=large)

---

## Tip 4: カスタムスキルを作成してgitにコミットする（Create Custom Skills）

- スキル（旧スラッシュコマンド）はドメイン固有のワークフローでClaude Codeを拡張する
- **1日に1回以上行うことは、スキルまたはコマンドに変換する**

### チームの活用例

- `/techdebt` スラッシュコマンドを作り、毎セッション終了時に重複コードを検出・削除
- 7日分のSlack、GDrive、Asana、GitHubを1つのコンテキストダンプに同期するコマンド
- dbtモデルの作成・コードレビュー・devでのテスト変更を行うanalytics-engineer型エージェント

### スキルの保存場所

| 場所 | スコープ | 用途 |
|------|----------|------|
| `~/.claude/skills/*/SKILL.md` | 個人（全プロジェクト） | 個人のワークフロー自動化 |
| `.claude/skills/*/SKILL.md` | プロジェクト（git共有） | チーム全体の規約とワークフロー |
| `.claude/commands/*.md` | プロジェクト（レガシー） | 後方互換性あり |

参考: [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills#extend-claude-with-skills)

---

## Tip 5: Claudeにバグを自律的に修正させる（Let Claude Fix Bugs）

- **Slack MCP**を有効化し、Slackのバグスレッドを貼り付けて「fix」と言うだけ。コンテキストスイッチングゼロ
- 「Go fix the failing CI tests.」— 方法をマイクロマネジメントしない。**成果ベースのプロンプティング**
- **Dockerログ**をClaudeに向けて分散システムのトラブルシューティング — 驚くほど有能

### バグ修正ワークフロー

| 方法 | プロンプト例 | 特徴 |
|------|-------------|------|
| Slack MCP | バグスレッドURLを貼って「fix」 | コンテキストスイッチングゼロ |
| CI Tests | 「Go fix the failing CI tests」 | 成果ベース |
| Docker Logs | コンテナログを指定して診断 | 直接ログ分析 |

![Image](https://pbs.twimg.com/media/HABy6cObEAQ4Rep?format=png&name=large)

---

## Tip 6: プロンプティングをレベルアップする（Level Up Your Prompting）

### a. Claudeにレビュアーとして挑戦させる

- 「**Grill me on these changes and don't make a PR until I pass your test.**」— Claudeをコードレビュアーにする
- 「**Prove to me this works**」— mainとフィーチャーブランチの動作差分を比較させる

### b. 中途半端な修正後のイテレーション

- 「**Knowing everything you know now, scrap this and implement the elegant solution**」— 蓄積した文脈を活かして最初からやり直させる

### c. 詳細な仕様を書いて曖昧さを減らす

- 仕事を渡す前に具体的に書くほど、出力品質が上がる

### 検証が最も重要なTip

> "Give Claude a way to verify its work. If Claude has that feedback loop, it will 2–3x the quality of the final result."

Chrome拡張を使ってClaudeにUI変更をブラウザ上で直接検証させる。

| パターン | プロンプト例 | 使用場面 |
|----------|-------------|----------|
| Challenge | "Grill me on these changes" | PR提出前 |
| Verify | "Prove to me this works" | 実装後 |
| Diff | "Diff behavior between main and this branch" | 機能検証 |
| Outcome-based | "Fix the failing CI tests" | バグ修正 |
| Autonomous | "Go fix this Slack thread" | MCP駆動ワークフロー |

---

## Tip 7: ターミナル・環境設定（Terminal & Environment Setup）

### Ghosttyの推奨

チームの多くが [Ghostty](https://ghostty.org/)（Mitchell Hashimoto作のターミナルエミュレータ）を使用。理由:
- **同期レンダリング**
- **24ビットカラーサポート**
- **適切なUnicodeサポート**
- macOSでのMetalレンダリングによる500 FPS

### `/statusline` でステータスバーをカスタマイズ

並列セッション管理のために、コンテキスト使用量と現在のgitブランチを常時表示。

### その他の環境Tips

- **PostToolUseフック**: Claudeがコードを書いた後に自動フォーマット（例: `bun run format || true`）
- **安全なコマンドの事前許可**: `/permissions` でbuild、lint、testなどを個別承認不要にする
- **音声入力**: macOSで `fn` を2回押して音声入力を有効化。タイプの3倍速で話せ、プロンプトがはるかに詳細になる

参考: [Claude Code Terminal Config](https://code.claude.com/docs/en/terminal-config)

---

## Tip 8: サブエージェントを使う（Use Subagents）

### 3つの活用法

| 方法 | 説明 |
|------|------|
| **a. "use subagents"を付加** | リクエストに追加するだけで、Claudeが問題に対してより多くの計算リソースを投入 |
| **b. タスクをオフロード** | 個別タスクをサブエージェントに送り、メインエージェントのコンテキストウィンドウをクリーンに保つ |
| **c. フックで権限リクエストをルーティング** | Opus 4.5にPermissionRequestフックを通じて権限を承認させ、安全なものを自動承認 |

### ビルトインサブエージェントタイプ

| タイプ | モデル | ツール | 用途 |
|--------|--------|--------|------|
| Explore | Haiku（高速） | 読み取り専用 | クイックなコードベース検索 |
| Plan | 継承 | 読み取り専用 | リサーチと計画 |
| General-purpose | 継承 | 全ツール | 複雑なマルチステップタスク |

- **Ctrl+B** でサブエージェントをバックグラウンド実行
- **Ctrl+O** でサブエージェントビューを展開して進捗確認
- `.claude/agents/` にカスタムサブエージェントを定義可能（YAML frontmatterでモデル、ツール、MCPアクセス、メモリ永続性を指定）

参考: [Claude Code Hooks - PermissionRequest](https://code.claude.com/docs/en/hooks#permissionrequest)

---

## Tip 9: データ・分析にClaudeを使う（Use Claude for Data & Analytics）

- チームのコードベースにBigQueryスキルがチェックインされており、全員がClaude Code内で直接分析クエリに使用
- **Boris本人は6ヶ月以上SQLを書いていない**
- CLI、MCP、またはAPIを持つ任意のデータベースで同じパターンが使える（BigQuery、PostgreSQL、MySQLなど）

```
Use the "bq" CLI to pull Claude Code usage metrics for the last 7 days and summarize trends.
```

---

## Tip 10: Claudeで学習する（Learning with Claude）

- `/config` で **"Explanatory"** または **"Learning"** 出力スタイルを有効化し、変更の「なぜ」を説明させる
- **ビジュアルHTMLプレゼンテーション**を生成させて、不慣れなコードを説明させる（驚くほど良いスライドを作る）
- **ASCIIダイアグラム**で新しいプロトコルやコードベースの理解を助ける
- **間隔反復学習スキル**を構築: 自分が理解を説明 → Claudeがフォローアップ質問 → ギャップを埋めて結果を保存

---

## コミュニティからのボーナスTips

### Chrome MCP による Web 検証
Garrett Kirschbaumが共有。Claude Codeと Chrome MCP を組み合わせてWebで変更を検証することが「huge unlock」だったとのこと。Borisも「game changer」と同意。

### セッションの自動評価（スコアリング）
Bob Shethの提案。各Claudeセッションをスコアベースの基準で自動評価する仕組み。コード正確性、初回試行の精度、プロジェクト規約への準拠などの次元で評価し、学びを蓄積する。

### 大規模コードベースでの重複防止
Sterling Crispinの問題提起に対するBorisの解決策:
- CIで `claude -p` (パイプモード) を使って重複コードを自動検出
- 新コードを書く前に、計画段階でClaudeにコードベースを探索させ再利用可能な関数を見つけさせる

```bash
# CIでコード重複をチェック
claude -p "Review the PR diff for code duplication. Check if any new code 
duplicates existing functions in the codebase. Report findings."
```

---

## 重要な結論

1. **並列化が最大の生産性向上策** — Worktree + 複数Claudeセッションで処理能力を倍増
2. **計画に投資する** — プランモードで十分に計画し、実装を一発で完了させる
3. **CLAUDE.mdは生きたドキュメント** — Claudeに自分自身のルールを書かせ、継続的に改善する
4. **成果ベースのプロンプティング** — 方法ではなく結果を指示する
5. **検証のフィードバックループ** — Claudeに自分の仕事を検証する手段を与えると、品質が2〜3倍向上する
