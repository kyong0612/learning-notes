---
title: "Seer, Sentry's AI Debugger, is Generally Available"
source: "https://blog.sentry.io/seer-sentrys-ai-debugger-is-generally-available/"
author:
  - "Tillman Elser"
published: 2025-06-17
created: 2025-07-03
description: |
  Sentry's new AI agent, Seer, goes beyond simple code generation by leveraging deep issue context from Sentry and your codebase to accurately root cause complex issues and propose merge-ready fixes. It aims to streamline the debugging process, saving developer time and effort.
tags:
  - "Sentry"
  - "AI"
  - "Debugging"
  - "Seer"
  - "Observability"
  - "DevTools"
---

![Seer, Sentry's AI Debugger, is Generally Available](https://images.ctfassets.net/em6l9zw4tzag/4vSGCvQPWDNJR6enAqgiUi/eee50e5657b8bf5e718b102718eb26ba/seer-hero.jpg?w=1430&h=715&fl=progressive&q=50&fm=jpg)

従来のLLMによる修正案とは異なり、Sentryの新しいAIエージェント「**Seer**」は、Sentryが持つすべての問題コンテキスト（スタックトレース、コミット履歴、トレース、スパンなど）とコードベースを活用して、単なる推測ではなく、根本原因を特定し、アプリケーションに特化したマージ可能な修正案を提案します。

AIはデバッグが苦手であると広く認識されていますが、Seerはこの課題を克服するために設計されました。

### Seerが他と違う理由

Seerは、デバッグに必要な深いコンテキストを理解しています。ベータ版（旧称: Autofix）の段階で、Seerは以下の成果を上げています。

* 38,000以上の問題を分析
* 94.5%の精度で根本原因を特定
* 開発者の時間を合計で2年以上節約

![Tweet by Aiden Bai (@aidenybai)](https://images.ctfassets.net/em6l9zw4tzag/4Hs0Hbk1tD7kv2vw4Kpri8/fe22ba7a9e98a7550d50193ba3d1c9bb/image1.png?w=1190&h=688&q=50&fm=png)

## Seerの仕組み

Seerは、Sentryが持つ問題に関するあらゆる情報（スタックトレース、環境情報、スパン、コミット、ログ、プロファイリングデータ）を統合し、エージェント的にアクセスします。単にコンテキストをコピー＆ペーストするのではなく、コード検索のようにリソースとして公開します。

さらに、コードベースに直接アクセスし、以下の操作を実行します。

* ファイルに対するgrepのような検索
* ドキュメントの解析と解釈
* コミット履歴の追跡と分析
* 複数のリポジトリを調査し、潜在的な破壊的変更を事前にキャッチ
* 必要に応じてファイルを直接修正

### 自動修正機能

Seerは修正を提案するだけでなく、自動で修正を実行することも可能です。「Automated Fixes」を有効にすると、Seerは問題の根本原因を特定し、開発者が何もしなくても解決策の草案を作成します。マージは常に開発者の承認が必要です。

![New and Actionable" issues view in Sentry's dashboard](https://images.ctfassets.net/em6l9zw4tzag/44c3IMaz74FMiHr5DpSNNT/95bd13ef479d5f52ce5dad21012edfe2/CleanShot_2025-06-15_at_11.30.25_2x.png?w=2840&h=1006&q=50&fm=png)

## Seerが実際に修正できること

### 単純な問題の高速な解決

型エラー、null参照、キーの欠落など、日常的なバグやパフォーマンスの問題を迅速に解決し、バックログを整理します。エラーがSentryに到達した瞬間にSeerが自動的に実行され、開発者がアラートを確認する頃には修正案が提案されています。

> "もはや開発者1人、PR1つではありません。私はすべての問題に対して並行してSeerを実行しています。修正が的外れでも問題ありません。却下し、より多くのコンテキストを与えて再試行するだけです。イテレーションは安価で、チームの日数を節約しています。"
>
> *-Neil Wang, Engineering Manager at Curai*

![Merged GitHub pull request by Seer](https://images.ctfassets.net/em6l9zw4tzag/6JGiOyNuFvwYlSA9TQjUIY/c204779d9ac506de5473b583d7b0808c/image4.png?w=1999&h=1116&q=50&fm=png)

### 複雑な問題のデバッグ

Seerは、Sentryのテレメトリデータを10時間以上レビューしたペアプログラマーのように振る舞います。スパンやトレースデータを使用して、複雑な分散システム内のリポジトリやプロジェクト間の関係を推測します。

例えば、Curai Healthでは、React Nativeコードベースの微妙なバグを、Seerが数分で根本原因を突き止め、修正案を提示しました。これは開発者であれば丸1日かかっていた作業です。

![Refactor GitHub Issue Creation Code](https://images.ctfassets.net/em6l9zw4tzag/7t1fVXDeO53R1slsoV4RVl/3a3b2e1131f6d7388493440d7ffda13d/image5.png?w=1999&h=1116&q=50&fm=png)

### 分散システムの問題解決

Seerは複数のコードベースにまたがる分散システムでも機能します。あるサンプルアプリでは、Reactフロントエンドで発生した `TypeError` を、ASP.NETバックエンドのAPIレスポンスの変更が原因であると突き止め、適切なサービスに対して修正のプルリクエストをオープンしました。

![Sentry error issue page and Seer panel](https://images.ctfassets.net/em6l9zw4tzag/4deanmSB9TGQMOjxA9zhvL/864dd8103b7f3e7a6fc0ffe4fe76dd5a/image2.png?w=1999&h=1225&q=50&fm=png)

## 開発者の評価

Seerは、OpenAI、Anthropic、Googleなどの最良のフロンティアモデルを柔軟に採用できるように構築されており、常に進化しています。

> "ここ数日、Seerを直接使用していますが、このツールは非常に有望に見えます。根本原因分析は的確で、Sentryがこのような深い洞察を開発者に提供するのは本当に素晴らしい仕事です。"
>
> *-Bharath Manjunath, Sr. Software Engineer at Sky Network TV*

## プライバシー第一

Seerはプライバシーとセキュリティを最優先に構築されています。

* 明示的な同意なしに、ユーザーのデータが生成AIモデルのトレーニングに使用されることはありません（デフォルトでオフ）。
* 入力と応答はプライベートに保たれ、Sentry組織内の承認されたユーザーのみが閲覧できます。

詳細は [AI privacy and security](https://docs.sentry.io/product/ai-in-sentry/ai-privacy-and-security/) ドキュメントで確認できます。

## Seerの試用方法

Seerは、有料プラン（Team, Business, Enterprise）のすべてのSentryユーザーが利用できます。14日間の無料トライアルがあり、追加のセットアップは不要です。

トライアル後、月額20ドルでサブスクリプションに追加でき、これには月額25ドル分のクレジット（修正実行あたり1ドル、スキャンあたり0.003ドル）が含まれます。

フィードバックや機能リクエストは `seer@sentry.io` または [Discord](https://discord.com/invite/ez5KZN7) で受け付けています。
