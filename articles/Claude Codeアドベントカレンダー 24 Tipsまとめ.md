---
title: "Claude Codeアドベントカレンダー: 24 Tipsまとめ"
source: "https://zenn.dev/oikon/articles/cc-advent-calendar#%E3%80%90day12%E3%80%91-rm--rf-%E3%81%AE%E6%82%B2%E5%8A%87%E3%82%92%E9%98%B2%E3%81%90"
author:
  - "Oikon"
published: 2025-12-26
created: 2025-12-28
description: |
  Claude Codeアドベントカレンダーで12/1~12/24に24個のTipsをXで共有した記事。Opus 4.5移行ガイド、statusline、on the Web連携、Thinkingキーワード、AGENTS.md対応、Hooks、Skills、Subagents、並列実行など、Claude Codeの実践的な使い方を網羅的に紹介。各Tipsには詳細な説明と補足情報が含まれており、Claude Codeをより効果的に活用するための実践的な知識が得られる。
tags:
  - "claude-code"
  - "anthropic"
  - "ai"
  - "tips"
  - "advent-calendar"
  - "clippings"
---

# Claude Codeアドベントカレンダー: 24 Tipsまとめ

## 背景

AnthropicがXでアドベントカレンダーを実施しているのを見て、Claude Codeについても12月1日〜12月24日まで24個のTipsをXで共有した。ハッシュタグ [#claude_code_advent_calendar](https://x.com/hashtag/claude_code_advent_calendar) でポストを確認できる。

## Day1 ~ Day24 のTipsまとめ

### 【Day1】 Opus 4.5 移行ガイド

Anthropicの公式リポジトリに、古いClaudeモデルをOpus 4.5へ移行するためのSkillsが存在する。Opus 4.5は以前のモデルと挙動が異なるため、以下の観点での修正指示が含まれている：

- ツールの過剰な呼び出し
- オーバーエンジニアリング防止
- コード探索不足
- フロントエンドデザインの質
- "think" キーワードへの過剰反応

Opus 4.5はツールの利用に積極的になったため、ツールを呼ばなくても良いケースでも呼び出してコンテキストが埋まることがある。動きをしっかり見ることが重要。

**参考**: [claude-opus-4-5-migration](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration)

### 【Day2】 Claude Code statusline

`/statusline <表示したい内容>` でチャット欄下に使用量などを表示できる。使用しているモデルやGitブランチなどを表示可能。

おすすめ設定として、`ccusage` のstatuslineがある：

```json
{
  "statusLine": {
    "type": "command",
    "command": "bun x ccusage statusline"
  }
}
```

### 【Day3】 `&` でon the Webに送る

Claude Code CLIでプロンプトに `&` を先頭に付けると、タスクをClaude Code on the Webに送ることができる。on the Webは「CLIから開く」ボタンでローカルに転送可能。ローカルのモデルがon the Webでも使われる。

Claude Code 2.0.45から追加された機能。ローカルとリモートのタスクが繋げられるようになった。

### 【Day4】 Thinking キーワード

Claude CodeのThinking（拡張思考）は、内部推論を挟み複雑なタスクが可能になる。Tabで有効化できる。

**重要**: 現在は `ultrathink` のみ有効。`think`、`think hard`、`考えて`、`よく考えて` などの以前のキーワードは無効になっている。

Claude Code 2.0.0でThinking modeをトグルで有効にできるようになった際に、`think`や`think hard`は効かなくなった。公式ドキュメントは12月13日に更新された。

### 【Day5】 Claude Code の AGENTS.md 対応

Claude CodeはAGENTS.mdを公式サポートしていないが、回避策が存在する。CLAUDE.mdの中で `@AGENTS.md` をImportすることでメモリファイル参照してくれるようになる。Importされたかは `/memory` コマンドで確認可能。

他の方法として、`ln -s AGENTS.md CLAUDE.md` でシンボリックリンクを設定する回避策もある。

**参考**: [GitHub Issue #6235](https://github.com/anthropics/claude-code/issues/6235)

### 【Day6】 Claude Code on the Web のSetup

CC on the Webには `CLAUDE_CODE_REMOTE` という環境変数が用意されており、リモート環境か判定できる。これとSessionStart Hooksを利用することで、リモート環境限定のSetupが可能。

`session-start-hook` がリモートのon the Web環境にはグローバル設定で用意されているため、これを利用することでリモート環境限定で起動するHooksの作成を簡単にお願いできる。

### 【Day7】 MCPツールのコンテキスト

Claude Codeでは `/context` コマンドで、コンテキストウィンドウ内のプロンプトやツールの占有量が確認可能。

特に注意するべきはMCPツールであり、ものによっては8%〜30%近く占有する物もある（200kと仮定）。必要最小限のMCPツールを使用することが望ましい。

MCPツールはツール説明（Description）をAIエージェントに読み込ませるため、存在しているだけでコンテキストを占領する。特にブラウザ操作系のMCPツールは大量のコンテキストを食い潰しがち。

### 【Day8】 Claude Skillsを作る Skill Creator

Claude Skillsは専門的なタスクを実行する能力を動的にロードできる機能。Codex CLIにもSkillsが最近追加されて注目を集めている。

公式の「Skillsを作るSkills（skill-creator）」で簡単に試すことが可能：

```bash
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
```

Claude Codeを再起動したら「〇〇のSkillsを作って」と依頼することでskill-creator skillsを発動可能。

skill-creatorは10月から存在している。必ずしもベストプラクティスに従っている訳ではないので、ブラッシュアップは必要。

### 【Day9】 Claude Skills + Subagents

SkillsとSubagentsの使い分けは、「知識やワークフローの提供」と「専門タスクの実行」の観点で考えると良い。相互に補完し合う関係にあり、連携することも可能。

SubagentsにはYAMLフロントマターで `skills` を定義可能。フルスタック用のSubagentsに、特定の2つのSkillsを定義できる。ここで定義されたSkillsは、Subagents起動時に自動的にコンテキストにロードされる。

### 【Day10】 Project ルール `.claude/rules/`

Claude CodeはCLAUDE.mdの他に、rulesを設定可能。`.claude/rules/` にMarkdownでプロジェクトルールを記載する。トピック別のプロジェクト指示が管理しやすい（コードスタイル、テスト規約、セキュリティなど）。

YAMLフロントマターで特定のファイルのみに適用されるルールを定義可能：

```yaml
---
paths: src/api/**/*.ts
---
```

Globパターンマッチングで動的にrulesがコンテキストにロードされる仕様と推察される。

v2.0.64にProjectルールがサポートされた。

### 【Day11】 CLAUDE.mdのロード

Claude Codeのプロジェクト CLAUDE.mdは以下の2箇所に定義でき、起動時にロードされる：

- `./CLAUDE.md`
- `./.claude/CLAUDE.md`

ネストされたディレクトリにも定義でき、これらは起動時にロードされず、ディレクトリ内を操作する際に読み込まれる。

v2.0.64から `./.claude/rules` のプロジェクトルールをサポートするようになった。大規模プロジェクトの際にrulesが推奨されているが、rulesはCLAUDE.mdよりも柔軟に適用条件を限定できるため、現在はネストされたCLAUDE.mdとrulesを、プロジェクトに応じて選択することができる。

### 【Day12】 `rm -rf` の悲劇を防ぐ

AIエージェントが `rm -rf` を実行してディレクトリを消したなどの悲劇が定期的に話題に上がる。

回避する方法として、settings.jsonに `permissions.deny` の設定をする。ここで `rm` やDB操作のコマンド権限を否定することで、Claude Codeが誤って消してはいけないファイルやディレクトリを削除する悲劇をある程度回避できる。

`permissions.ask` でClaudeが確認を取ってから実行する柔軟な設定もできるので、こちらで `rm` を実行する時だけ確認することもできる。`--dangerously-skip-permissions` オプションがついていても、permissions設定が優先される。

### 【Day13】 Sandbox で`rm -rf`を予防

Claude Codeは `/sandbox` コマンドで、ファイルシステムとネットワークのアクセスを制限できる。アクセスできるディレクトリやネットワークは permissions でコントロール可能。

Sandbox外ではEditやReadだけでなく、Bashの `rm` コマンドなども実行できないため、変更を作業ディレクトリと許可されたディレクトリに限定できる。

Sandbox設定と【Day12】の permissions 設定を組み合わせることで、AIエージェントによるファイル操作の事故が起きにくい開発環境を整えることが期待できる。

他にもHooksなどでコマンド実行前に止めることも可能。いくつかの防御策を講じることで、ガードレールをより強固にできる。

### 【Day14】 Claude Hooks でフィルタリング

Claude CodeのHooksを活用すれば、AIエージェントに渡す情報のフィルタリングが可能。UserPromptSubmit や PreToolUse を使うのが効果的。

例えば、APIキーがプロンプトやファイルに含まれているケースでは、AIエージェントに読み込まれるまでにHooksでブロックすることが可能。センシティブ情報のフィルタリングの使い方ができる。

UserPromptSubmitはプロンプトのAppendなどにも使えるので、Hooksは奥深い。

### 【Day15】 Claude Hooks でフォーマット

Claude CodeのHooksは、イベントにフックしてスクリプトを実行することができ、Claude Codeに決定的な動作を可能にする。代表的な使い方だと、Linter や Formatter をHooksで起動する。

例として、Claude Codeの PostToolUse Hooks でファイル編集後に自動で prettier を実行するサンプルがある。HooksのメリットはClaudeのコンテキスト外で処理を確定的に行えるので、ぜひ使ってみて欲しい。

### 【Day16】 Ctrl + G でエディタ編集

Claude Codeでは `Ctrl + G` で、外部エディタを開いて編集ができる。プロンプトだけでなくPlanモードの編集も可能。

外部エディタは環境変数 `VISUAL` で決まる（`EDITOR` もチェックし、両方存在する場合 `VISUAL` が優先される）：

```bash
export VISUAL="vim"
export VISUAL="emacs"
export VISUAL="code --wait"
export VISUAL="cursor --wait"
```

### 【Day17】 Planモード

Claude Codeは `Shift + Tab` でPlanモードに切り替えることが可能。Claudeの作成した計画書は【Day16】で紹介した `Ctrl + G` で編集可能。

Planモードのドキュメントは、`~/.claude/plans/` に保存されるようになっており、詳細を確認できる。ただし現在はPlanドキュメントを任意のパスに生成することはできない。

Planモードは度々変更がある。v2.0.34あたりから最近ドキュメントとして保存されるようになったのは大きな変更。

**参考**: [GitHub Issue #12619](https://github.com/anthropics/claude-code/issues/12619)

### 【Day18】 Claude in Chrome でGIF作成

Claude CodeとChromeデスクトップを連携する機能がv2.0.72から追加された。`/chrome` コマンドで設定可能。

Claude in ChromeにはGIF作成機能がある。これはWebブラウザの操作をレコーディングして、一部始終をGIFに出力することができる。この機能でWebアプリの簡単な操作ガイドを作ることも可能。

Chrome DevTools MCPと役割がかぶる点も多いが、ユーザープロファイルを使用してChromeの操作をしやすくなった点が大きい。

### 【Day19】 Agent Skillsベストプラクティス

Agent Skillsがオープンスタンダードになった。Claude以外のCursorやGitHub CopilotでSkillsを利用できる。

Agent Skillsを作る際には、Claude Skillsベストプラクティスが参考になる：

- SKILL.mdは500行以下
- 例は具体的に
- ファイル参照は深さ1階層まで
- 段階的開示を適切に設定
- 明確なステップのワークフロー
- スクリプトの活用
- Windows-styleのパスは使わない
- 重要な操作の検証確認とフィードバックループ
- 最低でも3つの評価がある
- 複数のモデルでテストされている

これら以外にも命名規則やアンチパターンが公開されており、参考になる点が非常に多い。まずは【Day8】のSkill Creatorを使用してAgent Skillsを作成してみて、そこからブラッシュアップするのが良い。

**参考**: [Agent Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

### 【Day20】 Auto-compact Bufferサイズ

Claude CodeはAuto-compactを有効にした時、会話を自動圧縮をするためのバッファ（Auto-compact Buffer）が存在する。

このAuto-compact Bufferは、環境変数 `CLAUDE_CODE_MAX_OUTPUT_TOKENS` で変動する。デフォルトは32kであり、200kのコンテキストウィンドウの22.5%を占有する。モデル概要をみると64kが最大値だが、その場合コンテキストウィンドウの40%近くがバッファで占有されることを理解するべきである。

Haiku、Sonnet、Opusのモデルによるバッファの差は見られなかった。

`CLAUDE_CODE_MAX_OUTPUT_TOKENS` を何も考えず設定している方も見直したほうがいい。

### 【Day21】 非同期 Subagents

Claude CodeのSubagentsは、非同期（バックグラウンド）でタスクを実行できる。非同期タスクが終了した際には、メインエージェントに通知される。非同期で並列作業を実施できるため、以下のような使い方が可能：

- 並列コードベース探索
- コードレビューの実行
- 検索タスクの並列実行

非同期でSubagentsを実行できる機能はv2.0.60で追加された。以前として関連するタスクについて複数のSubagentsを同時並行で流すと、Subagentsのタスク終了を待つケースがあるが、前よりも使いやすくなった印象。

2026年にはSwarming（組織実行）に取り掛かるという話をAnthropicのエンジニアからも聞いているので、並列実行系は試しておいて損はない。

### 【Day22】 Claude Code Action + Agent Skills

Claude Code Actionは、GitHubでUbuntuマシンにリポジトリをCloneして、そこでClaude Codeを動かす。この際リポジトリ内にSkillsがあれば、もちろんGitHub Actions上でSkillsを使用することできる。

必要な設定は：

- GitHub Actionsで使用するSkillsを `.claude/skills/` に用意する
- `claude_args: --allowed-tools` に "Skill" を追加する

`/install-github-app` コマンドを使えば `CLAUDE_CODE_OAUTH_TOKEN` のシークレットは自動で登録されるので、それを使ってGitHub ActionsのワークフローにClaude Code Actionを組み込むと良い。

GitHub Actionsの料金改定が予定されており、GitHubホストの場合は値下げされるためますます使いやすくなる。

### 【Day23】 Claude Codeの並列実行

Claude Codeは自律的にタスクをこなせるため、並列実行を積極的に使っていきたい。並列実行には主に2つのアプローチがある：

1. **同じブランチで並列実行（Subagents）**: Claude Codeの複数のSubagentsを並列実行するケースで、Read権限のみのコードレビューや、コンポーネントの境界面がはっきりしているタスクなどを割り振る例が挙げられる。最近ではSkillsで明示的にSubagentsを呼び出す手法も注目されており、簡単に試せる割に適用範囲が広い。

2. **別のブランチで並列実行（git worktree）**: git worktreeを用いて複数のエージェントを並列実行させるケース。タスクの分割だけでなく実装のコンペなどにも応用できる。tmuxを用いればClaude Codeから別のWorker paneのClaude Codeに指示を出すことも可能。

Anthropicは今後Claudeの組織実行（Swarming）の拡張も検討していると話しているため、並列実行に慣れておくと良い。

### 【Day24】 Claude Code Ecosystem

Claude Codeのエコシステムを再確認する。2025年2月24日から、たった10ヶ月でこのエコシステムが出来ているのは尋常ではない。

Claude Code CLIから始まりSDKが登場。IDE拡張機能にVSCode ForkやJetBrainsなどがサポートされ裾野が広がった。GitHub Actionsも初期から活躍している。

Sandbox機能が整ったことでClaude Code on the Webがリリースされると、モバイルアプリ・デスクトップ・SlackでClaude Code on the Webにタスクを投げられる環境になった。

Chrome拡張も単体機能としてAIブラウザ的な使い方がされていたが、最近のアップデートでClaude CodeからMCPツールで、Chromeを直接操作できる機能がリリースされた。

今後さらに加速し、Claude Codeのエコシステムは拡大するだろう。

## まとめ

Claude Codeのアドベントカレンダーを実施して、Xで24日間Tipsを共有した。3月ごろからずっとClaude Codeを追っていたこともあり、ネタ出しには困らなかったが、ある程度の情報のクオリティを担保するのに少し苦心した。

今回の企画で、自分の中のClaude Codeの知識の確認と新規の検証ができたのでよかった。

## 参考文献

- [claude-opus-4-5-migration](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration)
- [GitHub Issue #6235](https://github.com/anthropics/claude-code/issues/6235)
- [Claude Code on the Web Documentation](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Sub-agents Documentation](https://code.claude.com/docs/en/sub-agents#file-format)
- [Reddit Discussion on rm -rf](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/)
- [GitHub Issue #12619](https://github.com/anthropics/claude-code/issues/12619)
- [Agent Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [GitHub Actions Pricing Update](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/)
