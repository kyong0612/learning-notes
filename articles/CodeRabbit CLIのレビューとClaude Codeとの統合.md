---
title: "CodeRabbit CLIのレビューとClaude Codeとの統合"
source: "https://zenn.dev/oikon/articles/coderabbit-cli"
author:
  - "Oikon"
published: 2025-09-20
created: 2025-09-22
description: |
  CodeRabbit CLIは、コードレビューに特化したCLIツールであり、git管理下のプロジェクトでローカルにレビューを実行できます。この記事では、CodeRabbit CLIの概要、単体での利用方法、そしてClaude Codeなどの他社AIツールと統合して、AIエージェントのコンテキストにレビュー結果を直接フィードバックする方法について詳しく解説します。
tags:
  - "CodeRabbit"
  - "CLI"
  - "codereview"
  - "Claude Code"
  - "AI"
---

## CodeRabbitの概要

CodeRabbitは、GitHubのプルリクエスト（PR）上で自動的にレビューを行うAIツールです。AIによるコードレビューに特化しており、開発者のレビュー負荷を軽減します。PR上で `@coderabbitai` を使って対話的にレビューを進めることも可能です。

![CodeRabbit AI commenting on a GitHub pull request](https://res.cloudinary.com/zenn/image/fetch/s--YuuYw--x--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/2e07af176184e4d17f8b1d9f.png%3Fsha%3D0f54369559e28ea5aa65fdf7aeb66336674b0d95)

## CodeRabbit CLI

2025年9月16日にリリースされた、レビュー特化のCLIツールです。GitHub PRレビューの性能をローカルプロジェクトで使用できます。

### 1. インストールと認証

インストールは`curl`コマンドで行い、`source`コマンドでシェルを再起動後、`coderabbit auth login`でブラウザ経由の初回認証を行います。`cr`というエイリアスも利用可能です。

```bash
# インストール
curl -fsSL https://cli.coderabbit.ai/install.sh | sh

# シェルのリスタート
source ~/.zshrc

# 認証
coderabbit auth login
```

### 2. CodeRabbit CLIの利用方法

#### 単体での利用

`git`で管理されており、かつ差分が存在するプロジェクトディレクトリで`coderabbit`または`cr`コマンドを実行します。

1. 起動すると現在のブランチやコード変更がgitから取得されます。
2. `Enter`を押すと解析が開始されます。
3. 解析完了後、問題のあるファイル名とレビュー結果が表示されます。
4. 提案の受け入れ（`a`）、AI修正用プロンプトのコピー（`c`）、拒否（`r`）などの操作が可能です。

![CodeRabbit CLI review results with code comments and suggestions](https://res.cloudinary.com/zenn/image/fetch/s--5lXYLvYn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/1fea2ea33ca3fe7e7525fd86.png%3Fsha%3Dd55817e8e0a1e032a818fa5523b2e3e8acc4580f)

#### 他社CLIツールとの併用

CodeRabbit CLIの主な特徴は、Claude Code, Codex CLI, Gemini CLI, Cursorなど、他のAIツールとの統合です。

![Works with integration logos: Claude, Codex, Gemini, and Cursor](https://res.cloudinary.com/zenn/image/fetch/s--j8hfm3y3--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/a6cce0af3150e77350de7dad.png%3Fsha%3D8d36cbf42e4737bc5ac8a9f75fe881bef0692ff3)

ヘッドレスモードで呼び出すことにより、AIエージェントのコンテキストにレビュー内容を直接反映させることができます。

* `--prompt-only`: AIツール連携向けの簡潔なモード
* `--plain`: CIログなど向けの詳細なモード

**連携ワークフロー:**
![CodeRabbit CLI integration workflow diagram showing code review process](https://res.cloudinary.com/zenn/image/fetch/s--J4-VvkX9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/4ac35162073fd4f99b1f0071.png%3Fsha%3D4c8c06f6ec0e860f4a0730fb372b58b3a0b8d5b6)

例えば、Claude Codeのようなバックグラウンドタスクが利用できるAIツールに対し、以下のようにプロンプトで指示します。

```
〇〇の機能を実装して。coderabbit --prompt-onlyをバックグラウンドタスクで実行してレビューを受けること
```

これにより、実装を進めながら裏でレビューを実行させ、その結果を即座にコードベースに反映させることが可能になります。

![Claude Code running CodeRabbit CLI as a background task](https://res.cloudinary.com/zenn/image/fetch/s--xCTkbvN9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/f5525df4fcb77b538759abf6.png%3Fsha%3D23581affdfcc46926fe4e62d06d28ae1e0c3f430)

### 3. 実際に使用した所感

筆者は主にClaude Codeと連携して利用。以下の4つの方法を試しました。

1. **プロンプト内で直接指示**: 公式推奨の方法。`coderabbit --prompt-only`をプロンプトに含める。辞書登録やプロジェクトメモリへの記載が便利。
2. **カスタムスラッシュコマンド化**: レビュープロセスを再利用可能なコマンドにする。
3. **Subagentに呼び出させる**: あまり上手くいかなかった。Subagentのタスク終了を待ってしまうケースがあった。
4. **レビュー内容をファイルに保存して読み込む**: `cr --plain > ./doc/review.md`のように結果をファイル出力する。原始的だが、レビュータイミングを制御でき、記録を残せるメリットがある。

連携は容易である一方、レビューの終了タイミングが不定なため、AIエージェントの実装と同時に実行させる点には難しさも感じたとのことです。

### 4. レートリミット

CodeRabbit CLIにはレートリミットが存在します。Liteプラン（$12/月）では、頻繁な使用で比較的早く制限に達することがあります。制限は数分から8分程度で解除されます。ある程度実装が進んだ段階で実行することで、レートリミットを避けやすくなります。

![CodeRabbit CLI rate limit exceeded warning screen](https://res.cloudinary.com/zenn/image/fetch/s--sdf40VFO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/57dac22f8a1cedd70aede943.png%3Fsha%3D01d19ab865c9ffa6d0fbae0aaff3c40f37f6add3)

## まとめ

CodeRabbit CLI（ベータ版）の最大の特徴は、他社AIツールと併用し、**AIエージェントにレビュー内容をコンテキストとして直接フィードバックできる点**です。ヘッドレスモードにより、他のツールとの統合が容易になっています。ローカルからリモートまでの開発プロセス全体にレビューを組み込むことを目指しているようです。

![CodeRabbit integration workflow: CLI to CI/CD to Pull Request reviews](https://res.cloudinary.com/zenn/image/fetch/s--WfTq8umd--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_1200/https://storage.googleapis.com/zenn-user-upload/deployed-images/8ef8eac180169a91d138e9f1.png%3Fsha%3De825f87a7de224b8ed6c675dd2c8953576a250fe)
