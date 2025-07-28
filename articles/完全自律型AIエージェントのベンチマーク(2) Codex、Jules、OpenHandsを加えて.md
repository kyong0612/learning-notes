---
title: "完全自律型AIエージェントのベンチマーク(2): Codex、Jules、OpenHandsを加えて"
source: "https://blog.lai.so/agent-benchmark-202507/"
author:
  - "[[laiso]]"
published: 2025-07-26
created: 2025-07-28
description: |
  Devinは長時間タスクの完走能力が他のエージェントより優れています。その分コストも高いです。
  Claude Code Actionはタスク実行速度が最も速く、成功率も高いです。コストパフォーマンスも高いです。
  その他のエージェントは内部セッションタイムアウトがあり、タスクを中断します。長時間タスクには向きません。
tags:
  - "clippings"
  - "ai-agent"
  - "benchmark"
  - "devin"
  - "claude-code"
---
## TL;DR

- Devinは長時間タスクの完走能力が他のエージェントより優れています。その分コストも高いです。
- Claude Code Actionはタスク実行速度が最も速く、成功率も高いです。コストパフォーマンスも高いです。
- その他のエージェントは内部セッションタイムアウトがあり、タスクを中断します。長時間タスクには向きません。

## 最終結果

| エージェント名 | 完了問題数／実行時間 | コスト | 1問あたり | 正解数／正解率 | 結果 |
| --- | --- | --- | --- | --- | --- |
| 🏅Devin | 98問／216分 | $36 | $0.37 | 92問／91.1% | 長時間タスク完遂能力抜群、コスト高 |
| 🥈Claude Code Action | 92問／42分 | $7.89 | $0.09 | 65問／64.4% | 最速・高コスパ |
| 🥉GitHub Copilot Coding Agent | 53問／40分 | 月額$20 | $0.38 | 44問／43.6% | 自主中断、後発の安定性 |
| Jules | 45問／55分 | 無料 | $0.00 | 36問／35.6% | 無料、完了誤認あり |
| OpenHands Cloud | 36問／60分 | $20 | $0.56 | 28問／27.7% | バッチ実行、途中で停止 |
| Cursor Background Agents | 33問／40分 | 月額$20 | $0.61 | 28問／27.7% | 安定実行、途中で停止 |
| ChatGPT Codex | 6問／3分 | 月額$20 | $3.33 | 6問／5.9% | 問題児、やる気なし |

## はじめに

前回の記事ではDevin、Cursor Background Agents、Claude Code Actionの3つの自律型AIエージェントに、Exercism TypeScriptの101問を自動実装・テストさせて性能を比較しました。Devinは長時間・高難度タスクの安定完遂力が高く、Cursorは短時間での進捗は速いが途中で止まりやすい、Claude Codeは安定性に課題が残るという結果になりました。

[Devin vs Cursor Background Agents: 完全自律型AIエージェントの性能比較 ![](https://blog.lai.so/content/images/thumbnail/my-github-icon-2024-2-13.png)](https://blog.lai.so/devin-vs-cursor-background-agents/)

今回はさらに筆者が現在アクセス可能なすべてのエージェントを加えて、再度計測を行います。対象となるエージェントは以下の7つです。すべて2025年7月26日時点のバージョンに基づきます。

- [Devin](https://app.devin.ai/?ref=blog.lai.so)
- [OpenHands Cloud](https://www.all-hands.dev/?ref=blog.lai.so)
- [Cursor Background Agents](https://cursor.com/?ref=blog.lai.so)
- [ChatGPT Codex](https://chatgpt.com/codex?ref=blog.lai.so)
- [Jules](https://jules.google.com/?ref=blog.lai.so)
- [Claude Code Action](https://console.anthropic.com/workbench?ref=blog.lai.so)
- [GitHub Copilot Coding Agent](https://github.com/features/copilot?ref=blog.lai.so)

## 実施方法

前回と同様に「 [このリポジトリの101問の問題を解いてください](https://github.com/laiso/exercism-typescript/issues/15?ref=blog.lai.so) 」というプロンプトを送信します。いくつかのエージェントは作業中に「続けてよいか？」という確認動作を取ります。レギュレーションとしては「続けてください」という応答を３回までこちらで返信します。

モデルの選択はそれぞれのデフォルトです。DevinやCopilot Coding Agentのようにモデル名は非公開で内部で複数のモデルが協調するエージェントもあれば、ChatGPT Codexのo3やJulesのGemini Pro 2.5のように特定のモデルを中心に構成されたエージェントがあります。

正解率はGitHubにプルリクエストを出すとActionでテストを実行して収集するようにしました。

![](https://blog.lai.so/content/images/2025/07/image-9.png)

[https://github.com/laiso/exercism-typescript/actions/workflows/progress-check.yml](https://github.com/laiso/exercism-typescript/actions/workflows/progress-check.yml?ref=blog.lai.so)

## エージェント別の結果

### Devin

![](https://blog.lai.so/content/images/2025/07/image-10.png)

Devinは前回のベンチマークで1時間30分という長時間の実行と正解率63.4%という優秀な成績をおさめました。条件は同じですが、他のエージェントと比較するためにベンチマークを再度行います。

Devinは前回と同様に101問すべての問題を完了させ、すべてのテストが通るまで確認しようとします。タスクの完了を諦めず、完了状態の誤認も起こしません。これはDevinの強い長所です。

このため大規模なタスクでは実行時間は1〜2時間を超え、ACUコストも膨らみます。今回は2時間以上実行し、前回より長時間のセッションになりました。

かかったコストは16.0 ACUで$36.00 USDです。

### Claude Code Action

![](https://blog.lai.so/content/images/2025/07/image-11.png)

コーディングエージェント界の優等生、Claude Codeの登場です。

前回のベンチマークではGitHub APIのエラーに阻まれ失格となりました。本来はトップの成績が出せるポテンシャルがあります。今回のベンチマークでは無事完走しました。

特筆すべきはそのスピードです。TODOツールを使って非同期にタスクを解決していきます。

しかし最終的に変更されたファイルは83件でした。つまり101件すべて完了とはいかなかったようです。

コストはAPI利用で7.89ドルでした（厳密にはここにGitHub Actionの実行時間も加算します）。

### GitHub Copilot Coding Agent

![](https://blog.lai.so/content/images/2025/07/image-15.png)

新顔「GitHub Copilot Coding Agent」は名前に個性がありませんが、VSCodeのGitHub Copilot Agentモードを完全自律型に据えたブラウザで動作するエージェントです。GitHubのインターフェイスに統合されています。つまり自律型エージェント界のサラブレッドです。

Copilot Coding Agentはログを見るとタスクをフェーズごとに丁寧に分けて実行します。これはKiroのプランニングに近いです。実装フェーズはそつがなく、先頭から計画→実装→テストを順に実行します。内部ToDoリストのような宣言はありません。

40分で53問完了したところで自主的に中断し、レポートを作成しました。

101問全ての問題を解くことを最初に自分で確認していたのですが、53問で軌道修正したのはどうやら内部制約によるハンドリングが効いたようです。他のエージェントではこの内部制約に到達すると無言で終了するようなケースもあるため、細かい部分も作り込んであるなという印象を受けました。

コストはプレミアムリクエスト1つでした。Copilot+の月20ドルの範囲内です。

### OpenHands Cloud

![](https://blog.lai.so/content/images/2025/07/image-13.png)

OpenHandsはオープンソース（MITライセンス）なのでセルフホストも可能ですが、今回はクラウドサービスとして提供されているOpenHands Cloudを使用しました。

まずOpenHandsは問題の数を「93」個と誤認しました。正確な問題数は101です。

そして最初にリポジトリ構造やテストシステムを調査し、簡単な問題から順に解いていく戦略を立てています。

特徴的だったのはバッチ的に複数の問題をまとめて処理しようとします。これは他のエージェントでは起きなかった行動です。

36問完了したところで停止し、こちらに続けるかどうかを尋ねてきました。３回応答し、そのまま継続して、中断した時点でプルリクエストにしてもらいました。

コストはサインアップボーナス20ドルのクレジットをすべて使い切りました。

### Jules

![](https://blog.lai.so/content/images/2025/07/image-14.png)

Julesはさらに細かく10問ごとに停止し、このまま続けて良いのか尋ねてきます。

3回プッシュしたところで停止しなくなり、「すべてのタスクが完了しました」と報告を受けました。

しかし実際にはファイルは45個しか変更されていません。完了状態を正しく認識できていませんでした。

コストはベータ版のため無料です。

### Cursor Background Agents

![](https://blog.lai.so/content/images/2025/07/image-16.png)

Cursor Background Agentsはアルファベット順に一つずつ解き、テストを実行します。

複雑な問題（例：complex-numbers、food-chainなど）では、テストの詳細な出力を見てロジックの修正やデバッグを繰り返し、最終的に正解にたどり着きました。

しかし28問完了したところで無言で停止しました。これは前回のベンチマーク時の結果と同様です。

繰り返し実行して観察すると、内部的なセッションタイムアウトにより強制終了されているように見えました。

「寝てますか？」と尋ねると「（・・ハッ）起きています！」と数分後に返ってきます。人間っぽい。

コストはProプラン20ドル枠内でした。

### ChatGPT Codex

![](https://blog.lai.so/content/images/2025/07/image-17.png)

こいつは我が校きっての問題児です。なかなか言うことを聞いてくれません。

ChatGPT Codexは問題の数が101個と知ると、作業の見積もりだけをして速攻であきらめます。

しかしそこをAIコンパニオンのように「そこをなんとか」「お前ならできる」と励ますと、渋々タスクに取り掛かってくれます。

３回プッシュして6問やってくれたところで検証を止めました。

コストはChatGPT Plusの20ドル枠内です。

## おまけ：ManusとChatGPT Agent

コーディングの枠を超えて、コンピューティングタスク全般を取り扱う [Manus](https://manus.im/app?ref=blog.lai.so) と [ChatGPT Agent](https://openai.com/index/introducing-chatgpt-agent/?ref=blog.lai.so) にも同じタスクを与えてみました。

これらはGitHubリポジトリを連携する機能を持たないため、公開リポジトリとIssueをURLで与えました。

ChatGPT Agentは他のエージェントの作成したプルリクエストの情報をディープカンニング(!)し、解決方法だけを口頭で述べて完了としていました。自由。

Manusは実際にマシンでgit cloneをして作業を始めていました。

しかし筆者は無課金ユーザーなので、タスクの途中でデイリーリミットに到達し完了を見届けられませんでした。

すでに1時間弱自走していたので、もし最後まで実行させたらManusはコーディング系のエージェントと同等な能力を持っているのかが分かりそうです。

![](https://blog.lai.so/content/images/2025/07/image-18.png)

Manus
