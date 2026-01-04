---
title: "Thread by @shinojapan"
source: "https://x.com/shinojapan/status/2007254196077375970"
author:
  - "Takaya Shinozuka / 令和トラベルCEO (@shinojapan)"
  - "Boris (Claude Code開発者・原著者)"
published: 2026-01-03
created: 2026-01-04
description: "Claude Code開発者Boris氏による、Claude Codeの実践的な使い方の紹介。並列実行、Opus 4.5の活用、CLAUDE.mdによるチーム共有、サブエージェント、フック、MCPサーバーの活用法など。"
tags:
  - "clippings"
  - "Claude Code"
  - "AIエージェント"
  - "開発ワークフロー"
  - "プロンプトエンジニアリング"
---

## 概要

Claude Code開発者であるBoris氏が自身のClaude Codeの使い方を紹介。令和トラベルCEOの篠塚孝哉氏（@shinojapan）が和訳して共有したスレッド。

## Boris氏のセットアップの特徴

Boris氏のセットアップは「驚くほどバニラ（標準的）」。Claude Codeはデフォルトで素晴らしく動作するため、あまりカスタマイズしていない。Claude Codeの使い方に「唯一の正解」はなく、ユーザーが好きなように使えるよう意図的に設計されている。

## 実践的なTips

### 1. 並列実行

- ターミナルで**5つのClaude**を並行して実行
- タブに1〜5の番号を振り、システム通知で入力待ちを把握
- Web版（claude.ai/code）でも**5〜10個のClaude**を実行
- `&`でセッションをWebに引き継ぎ、`--teleport`で環境を行き来

### 2. モデル選択

- **Opus 4.5 with thinking**をすべての作業に使用
- Sonnetより大規模で遅いが、細かい指示が少なくて済む
- ツール利用能力も高く、結果的に小さいモデルより速く完了

### 3. CLAUDE.mdによるチーム共有

- リポジトリ用に1つのCLAUDE.mdファイルをチームで共有
- Gitで管理し、週に何度も更新
- Claudeが間違った処理をしたら、すぐにCLAUDE.mdに追記して学習させる

### 4. コードレビューでの活用

- PRで`@claude`をタグ付けし、CLAUDE.mdにルールを追記させる
- Claude Code GitHub Action（`/install-github-action`）を使用
- Dan Shipper氏の「**Compounding Engineering（複利エンジニアリング）**」の実践

### 5. サブエージェントの活用

- `code-simplifier`: 作業完了後のコード整理
- `verify-app`: エンドツーエンドテストの詳細な手順
- スラッシュコマンドと同様に、頻繁なワークフローを自動化

### 6. PostToolUseフック

- コードをフォーマットするフックを使用
- Claudeは通常綺麗なコードを生成するが、最後の10%を調整
- CIでのフォーマットエラーを防止

### 7. 権限設定

- `--dangerously-skip-permissions`は使用しない
- `/permissions`コマンドで安全なbashコマンドを事前に許可
- 設定は`.claude/settings.json`に保存してチーム共有

### 8. MCPサーバー活用

- Slack検索・投稿
- BigQueryでの分析クエリ実行（bq CLI）
- Sentryからエラーログ取得
- 設定は`.mcp.json`で共有

### 9. 長時間タスクの対処

- (a) バックグラウンドエージェントで検証
- (b) エージェントのStopフックを使用
- (c) ralph-wiggumプラグイン（Geoffrey Huntley氏のアイデア）

#### Stopフックの詳細

**Stopフックとは**: Claudeが「完了した」と判断して停止しようとしたタイミングで自動実行されるフック機構。`"decision": "block"` を返すと停止を阻止し、作業を継続させる。

**問題**: Claudeは数分で自然に停止する傾向がある

**解決**: Stopフックで停止を阻止し、「短いバースト」を「中断のないマラソン」に変換

**設定例** (`.claude/settings.json`):

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are evaluating whether Claude should stop working. Context: $ARGUMENTS\n\nAnalyze if:\n1. All user-requested tasks are complete\n2. Any errors need to be addressed\n3. Follow-up work is needed\n\nRespond with JSON: {\"decision\": \"approve\" or \"block\", \"reason\": \"explanation\"}",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**重要な注意点**:

- **無限ループ防止**: `stop_hook_active` が `true` の場合は停止を許可する
- **トークンコスト**: 50反復で$50-100+の可能性
- **推奨方法**: `/ralph-wiggum:ralph-loop` プラグインを使用（安全機構付き）

```bash
/ralph-wiggum:ralph-loop "大規模リファクタリング" \
  --max-iterations 50 \
  --completion-promise "All tests pass"
```

## 最も重要なこと

> **「Claudeに自分の仕事を検証させる手段を与えること」**

フィードバックループがあれば、最終結果の品質は**2〜3倍**になる。

### 検証の例

- Claude Chrome拡張機能でブラウザを開きUIをテスト
- bashコマンドの実行
- テストスイートの実行
- ブラウザやスマホシミュレータでのアプリテスト

**検証環境を盤石にすることへの投資が重要。**
**Takaya Shinozuka / 令和トラベルCEO** @shinojapan 2026-01-02

とてつもなくシンプルなClaude Code開発者によるCCの使い方、勉強になるので和訳・保存🔖

\---

私はBorisです。Claude Codeを開発しました。 多くの人からClaude Codeをどう使っているか聞かれるので、私のセットアップを少し紹介したいと思います。

私の環境は驚くほど「バニラ（標準的）」かもしれません！Claude Codeはデフォルトの状態でも素晴らしい動きをするので、個人的にはあまりカスタマイズしていません。Claude Codeの使い方に「唯一の正解」はありません。ユーザーが好きなように使い、カスタマイズし、ハックできるように意図的に設計しています。Claude Codeチームのメンバーも、それぞれ全く異なる使い方をしています。

それでは、紹介します。

1/ 私はターミナルで5つのClaudeを並行して実行しています。タブに1〜5の番号を振り、システム通知（iTerm2の機能など）を使って、どのClaudeが入力を求めているかを把握できるようにしています。

2/ ローカルのClaudeと並行して、Web版（<http://claude.ai/code）でも5〜10個のClaudeを実行しています。ターミナルでコーディングしながら、ローカルのセッションをWebに引き継いだり（&を使用）、Chromeで手動でセッションを開始したり、時には> --teleport コマンドを使って環境を行き来したりします。

3/ すべての作業に「Opus 4.5 with thinking（思考機能付きOpus 4.5）」を使用しています。これは私がこれまでに使った中で最高のコーディングモデルです。Sonnetよりも大規模で動作は遅いですが、細かい指示（ステアリング）が少なくて済み、ツール利用の能力も高いため、結果的には小さいモデルを使うよりもほぼ常に速く作業が終わります。

4/ 私たちのチームでは、Claude Codeリポジトリ用に1つの <http://CLAUDE.md> ファイルを共有しています。これをGitで管理し、チーム全体で週に何度も更新しています。Claudeが何か間違った処理をしたときは、すぐに <http://CLAUDE.md> に追記して、次は同じ間違いをしないように教えます。

5/ コードレビューの際、同僚のPR（プルリクエスト）上で @claude をタグ付けし、そのPRの一部として <http://CLAUDE.md> にルールを追記させることがよくあります。これにはClaude CodeのGithub Action（/install-github-action）を使用しています。これはDan Shipper氏が提唱する「Compounding Engineering（複利エンジニアリング）」の私たち版の実践です。

8/ 私はいくつかの「サブエージェント」を定期的に使用しています。例えば、Claudeの作業完了後にコードを整理する code-simplifier や、Claude Codeをエンドツーエンドでテストするための詳細な手順を持つ verify-app などです。スラッシュコマンドと同様に、サブエージェントは私が最も頻繁に行うワークフローを自動化するものだと考えています。

9/ Claudeのコードをフォーマットするために PostToolUse フックを使用しています。Claudeは通常そのままでも綺麗にフォーマットされたコードを生成しますが、このフックが最後の10%を調整し、後でCI（継続的インテグレーション）でのフォーマットエラーが発生するのを防いでくれます。

10/ 私は --dangerously-skip-permissions（権限確認のスキップ）は使いません。代わりに /permissions コマンドを使って、自分の環境で安全だとわかっている一般的なbashコマンドを事前に許可し、不要な許可プロンプトが出ないようにしています。これらの設定のほとんどは .claude/settings.json に保存され、チーム内で共有されています。

11/ Claude Codeは私の代わりにあらゆるツールを使ってくれます。MCPサーバー経由でSlackの検索や投稿を行ったり、bq CLIを使ってBigQueryで分析クエリを実行したり、Sentryからエラーログを取得したりします。Slack MCPの設定は .mcp.json に保存して共有しています。

12/ 非常に時間のかかるタスクの場合、以下のいずれかを行います： (a) タスク完了時にバックグラウンドエージェントで検証を行うようClaudeに指示する (b) エージェントのStopフックを使ってそれをより決定論的に行う (c) ralph-wiggumプラグイン（元々はGeoffrey Huntley氏のアイデア）を使用する

13/ 最後のヒント：おそらくClaude Codeから最高の結果を得るために最も重要なことは、\*\*「Claudeに自分の仕事を検証させる手段を与えること」\*\*です。フィードバックループがあれば、最終結果の品質は2〜3倍になります。

Claudeは、私が <http://claude.ai/code> に加えるすべての変更を、Claude Chrome拡張機能を使ってテストしています。ブラウザを開き、UIをテストし、コードが正しく動作しUXが良いと感じられるまで修正を繰り返します。

検証の方法はドメインごとに異なります。単にbashコマンドを実行するだけのこともあれば、テストスイートの実行、あるいはブラウザやスマホシミュレータでのアプリテストなど様々です。この検証環境を盤石にすることには、ぜひ投資してください。

> 2026-01-02
>
> I'm Boris and I created Claude Code. Lots of people have asked how I use Claude Code, so I wanted to show off my setup a bit.
>
> My setup might be surprisingly vanilla! Claude Code works great out of the box, so I personally don't customize it much. There is no one correct way to

---

**Himanshu Kumar** @codewithimanshu [2026-01-03](https://x.com/codewithimanshu/status/2007379177675346220)

Review default settings; avoid excessive customization for optimal performance consistently.
