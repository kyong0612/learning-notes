---
title: "repomirror/repomirror.md at main · repomirrorhq/repomirror"
source: "https://github.com/repomirrorhq/repomirror/blob/main/repomirror.md"
author:
  - "[[dexhorthy]]"
published:
created: 2025-08-26
description: "GitHubでアカウントを作成して、repomirrorhq/repomirrorの開発に貢献してください。"
tags:
  - "clippings"
---
[github.devで開く](https://github.dev/) [新しいgithub.devタブで開く](https://github.dev/) [codespaceで開く](https://github.com/codespaces/new/repomirrorhq/repomirror/tree/main?resume=1)

今週末のYCエージェントハッカソンで、私たちは自問しました。「コーディングエージェントを使う最も奇妙な方法は何だろう？」と。

私たちの答えは、Claude Codeをヘッドレスで無限ループで実行し、何が起こるか見てみることでした。

結果として起こったことは、1,000以上のコミット、6つの移植されたコードベース、そして私たちが[RepoMirror](https://github.com/repomirrorhq/repomirror)と呼んでいる風変わりな小さなツールができていたことです。

最近、私たちは[Geoff Huntley](https://ghuntley.com/ralph/)が推進する、コーディングエージェントをwhileループで実行するテクニックに出会いました。

```
while :; do cat prompt.md | amp; done
```

私たちのチームメンバーの一人であるSimonは、ReactでAIインターフェースを構築するためのReactライブラリであるassistant-uiの作成者です。彼はVue.jsのサポートを追加するリクエストをたくさん受けており、このアプローチがassistant-uiをVue.jsに移植するために機能するかどうか疑問に思っていました。

基本的に私たちが行ったことは本当に馬鹿げているように聞こえますが、驚くほどうまくいきました - 私たちはループにClaude Codeを使用しました：

```
while :; do cat prompt.md | claude -p --dangerously-skip-permissions; done
```

プロンプトは単純でした：

```
あなたの仕事は、assistant-ui-reactモノレポ（React用）をassistant-ui-vue（Vue用）に移植し、リポジトリを維持することです。

現在のassistant-ui-reactリポジトリとassistant-ui-vueリポジトリの両方にアクセスできます。

すべてのファイル編集後にコミットを作成し、変更をプッシュしてください。

作業のスクラッチパッドとしてassistant-ui-vue/.agent/ディレクトリを使用してください。長期的な計画やtodoリストをそこに保存してください。

元のプロジェクトは主に手動でコードを実行してテストされていました。移植時には、プロジェクトのエンドツーエンドテストと単体テストを作成する必要があります。しかし、実際の移植にほとんどの時間を費やし、テストには時間をかけすぎないようにしてください。良いヒューリスティックは、実際の移植に80％の時間を費やし、テストに20％の時間を費やすことです。
```

私たちはハッカソンに参加していたので、スポンサーのツールに関連することをしたいと考え、RalphがYC支援のウェブエージェントツールである[Browser Use](https://github.com/browser-use/browser-use)をPythonからTypeScriptに移植できるかどうか試してみることにしました。

私たちは単純なプロンプトでループを開始しました：

```
あなたの仕事は、browser-useモノレポ（Python）をbetter-use（Typescript）に移植し、リポジトリを維持することです。

すべてのファイル編集後にコミットを作成し、変更をプッシュしてください。

現在のステータスをbrowser-use-ts/agent/TODO.mdで追跡してください。
```

ループを数回繰り返した後、順調に進んでいるようでした：

[![最初の数コミット](https://github.com/repomirrorhq/repomirror/raw/main/assets/first-commits.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/first-commits.png)

### 何が起こったか

私たちは午前2時過ぎまで働き、Claude Codeループを実行するためにいくつかのVMインスタンス（GCPインスタンス上のtmuxセッション）をセットアップし、数時間睡眠をとるために帰宅しました。

朝に戻ってくると、Browser UseのTypeScriptへの[ほぼ完全に機能する移植](https://github.com/repomirrorhq/better-use)ができていました。

[![Better Use CLI](https://github.com/repomirrorhq/repomirror/raw/main/assets/better-use.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/better-use.png)

これはHacker Newsからトップ3の投稿をスクレイピングしているところです。

better-use.webm<video src="https://private-user-images.githubusercontent.com/3730605/481353021-bdd15e9e-08e4-48a2-a6f9-05a550347c46.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTYyMDg3MDQsIm5iZiI6MTc1NjIwODQwNCwicGF0aCI6Ii8zNzMwNjA1LzQ4MTM1MzAyMS1iZGQxNWU5ZS0wOGU0LTQ4YTItYTZmOS0wNWE1NTAzNDdjNDYud2VibT9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODI2VDExNDAwNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTAxZjc3YzA3MTBlNDVlNTc2YTM0NmZlZTFlYzZkZTAxZDYzMTUwMjkxYjdiMzNlMmI1YWI4ZWEwNzc0MzBlMzYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.J3nnlIDC8RHVgXSHgwT1XHGLzyvzlDnJrnzVFPxwux4" controls="controls"></video>

[YouTubeで見る](https://www.youtube.com/watch?v=fqp8EbYOPk8)

こちらがBrowser Useの創設者[@gregpr07](https://x.com/gregpr07)がコードをチェックしているところです。彼は気に入ってくれたようです。

[![ラップトップを見て微笑むグレゴールとサイモン](https://github.com/repomirrorhq/repomirror/raw/main/assets/gregor.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/gregor.png)

どうせいくつかのループを立ち上げていたので、さらにいくつかのソフトウェアプロジェクトを移植して何が出てくるか見てみることにしました。

Vercel AI SDKはTypeScriptで書かれていますが、Pythonで使えたらどうでしょうか？ええ…[まあまあ動きました](https://github.com/repomirrorhq/ai-sdk-python)。

[![AI SDK FastAPIアダプター](https://github.com/repomirrorhq/repomirror/raw/main/assets/ai-sdk-fastapi.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/ai-sdk-fastapi.png)

AI SDKの深くネストされた型コンストラクタのいくつかに苦労したことがあるなら、まあ、今度はPythonでも苦労できます。

また、いくつかの仕様からコードへのループも試しました - [Convex](https://www.convex.dev/)と[Dedalus](https://dedalus.dev/)をドキュメントのllms-full.txtから再作成しました。こちらが[OpenDedalus](https://github.com/repomirrorhq/open-dedalus)の最初のパスです。

[![open-dedalusのREADMEの画像](https://github.com/repomirrorhq/repomirror/raw/main/assets/open-dedalus.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/open-dedalus.png)

**早期停止**

エージェントを起動したとき、多くの疑問がありました。エージェントはテストを書くのか？無限ループに陥ってランダムな無関係な機能に迷い込むのではないか？

エージェントがテストを書き、元の指示を守り、決してスタックせず、スコープを制御下に保ち、ほとんどの場合、移植を「完了」と宣言したことに、私たちは嬉しく驚きました。

移植を終えた後、ほとんどのエージェントは追加のテストを書くか、agent/TODO.mdを継続的に更新して、どれだけ「完了」したかを明確にすることに落ち着きました。あるインスタンスでは、エージェントは無限ループに陥っていることに気づき、実際に`pkill`を使用して[自身を終了させました](https://www.youtube.com/watch?v=UOLBTRazZpM)。

[![自身のプロセスを停止するエージェント](https://github.com/repomirrorhq/repomirror/raw/main/assets/pkill.png)](https://github.com/repomirrorhq/repomirror/blob/main/assets/pkill.png)

**期待以上の成果**

（LLMでは一般的なことですが）もう一つのクールな創発的振る舞いとして、最初の移植を終えた後、私たちのAI SDK Pythonエージェントは、FlaskやFastAPIの統合（AI SDK JSバージョンには対応するものがない）や、Pydantic、Marshmallow、JSONSchemaなどによるスキーマバリデーターのサポートなどの追加機能を追加し始めました。

**プロンプトはシンプルに**

全体的に、少ない方が豊かであることを見つけました - 単純なプロンプトは複雑なものよりも優れています。足場ではなく、エンジンに集中したいのです。異なるプロジェクトを立ち上げた私たちのチームの異なるメンバーは、指示や順序を試行錯誤しました。[promptsフォルダ](https://github.com/repomirrorhq/repomirror/blob/main/prompts)で実際に使用したプロンプトを見ることができます。

ある時点で、私たちはClaudeの助けを借りてプロンプトを「改善」しようとしました。それは1,500語に膨れ上がりました。エージェントはすぐに遅くなり、賢くなくなりました。103語に戻したところ、元に戻りました。

**これは完璧ではない**

[better-use](https://github.com/repomirrorhq/better-use)と[ai-sdk-python](https://github.com/repomirrorhq/ai-sdk-python)の両方で、ヘッドレスエージェントは常に完璧に動作するコードを提供したわけではありません。私たちは最終的に、プロンプトを段階的に更新したり、Claude Codeと対話的に作業したりして、90%から100%に持っていくことになりました。

そして、Claudeが[物事が100%完璧に実装されていると主張する](https://github.com/repomirrorhq/better-use/blob/master/agent/TODO.md)かもしれませんが、Pythonプロジェクトのbrowser-useデモのいくつかは、まだTypeScriptでは動作しません。

### 数字

このプロジェクトの推論には800ドル弱を費やしました。全体として、エージェントはすべてのソフトウェアプロジェクトで約1100のコミットを行いました。各Sonnetエージェントは、一晩実行するのに約10.50ドルかかります。

これらの多くをブートストラップする過程で、この同期作業のためにソース/ターゲットリポジトリのペアを設定するのに役立つ簡単なツールをまとめました。（そして、ええ、[それもRalphで構築しました](https://github.com/repomirrorhq/repomirror/blob/main/prompt.md)）

```
npx repomirror init \
    --source-dir ./browser-use \
    --target-dir ./browser-use-zig \
    --instructions "browser useをZigに変換する"
```

指示は、「ReactからVueに変換する」や「OpenAPIスペックコード生成を使用してgRPCからRESTに変更する」など、何でもかまいません。

完璧に設計されているわけではなく、少しハッキーです。しかし、物事をまとめるには十分であり、shadcnの「オープンボックス」アプローチに似て設計されており、`init`フェーズの後に自由に変更できるスクリプト/プロンプトを生成します。

initフェーズの後、次のようになります：

```
.repomirror/
   - prompt.md
   - sync.sh
   - ralph.sh
```

プロンプトを確認してテストする準備ができたら、`npx repomirror sync`を実行してループの1回の反復を行い、`npx repomirror sync-forever`を実行してRalphの無限ループを開始できます：

repomirror.webm<video src="https://private-user-images.githubusercontent.com/3730605/481353044-7616825a-064d-4a5b-b1bc-08fc5f816172.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTYyMDg3MDQsIm5iZiI6MTc1NjIwODQwNCwicGF0aCI6Ii8zNzMwNjA1LzQ4MTM1MzA0NC03NjE2ODI1YS0wNjRkLTRhNWItYjFiYy0wOGZjNWY4MTYxNzIud2VibT9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODI2VDExNDAwNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWQyZGIzNmE3ZDE4ZDA0Y2MxNzRhZGM0NTg1ZWZjZTE4MjMwMjgxMGM0NzMwZjY4OGQ3ZjRkMDk4MGY3ZTBlMmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.3a0bOlhQ6vPtog6bZIVws8a-OV83nhvXEs0ryQUgLwA" controls="controls"></video>

[YouTubeで見る](https://www.youtube.com/watch?v=_GxemIzk2lo)

他のリポジトリで遊びたい場合は、[README](https://github.com/repomirrorhq/repomirror?tab=readme-ov-file#projects)にリストされています。[better-use](https://github.com/repomirrorhq/better-use)は現在npmにあります：

```
npx better-use run
```

ai-sdk-pythonにはまだ[1つか2つの問題](https://github.com/repomirrorhq/ai-sdk-python/blob/master/agent/FIX_PLAN.md)があり、PyPIに公開する前に取り組んでいます。

### 結びの言葉

ご想像のとおり、私たちの考えはすべて少し混沌としており、矛盾しているので、まとまりのある結論ではなく、過去約29時間に関するチームの個人的な考察をいくつか残しておきます：

> AGIを少し感じていて、それはほとんどエキサイティングですが、恐ろしくもあります。

> 私の中のミニマリストは、私たちが物事を複雑にしすぎている可能性が高いという確固たる証拠があることに満足しています。

> 私たちが指数関数的な離陸曲線のまさに始まりにいることは明らかです。

チーム全員、[assistant-ui](https://github.com/assistant-ui)の[@yonom](https://x.com/simonfarshid)と[@AVGVSTVS96](https://x.com/AVGVSTVS96)、[HumanLayer](https://humanlayer.dev/)の[@dexhorthy](https://x.com/dexhorthy)、[github.gg](https://github.gg/)の[@Lantos1618](https://x.com/Lantos1618)、そしてインスピレーションを与えてくれた[Geoff](https://x.com/GeoffreyHuntley)に感謝します。

そして、ええ、私たちはチームの写真を撮るのを忘れました

[![Screenshot 2025-08-25 at 9 03 34 AM](https://private-user-images.githubusercontent.com/3730605/481703897-e19c3132-12dd-45b6-b470-f4b5281dd609.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTYyMDg3MDQsIm5iZiI6MTc1NjIwODQwNCwicGF0aCI6Ii8zNzMwNjA1LzQ4MTcwMzg5Ny1lMTljMzEzMi0xMmRkLTQ1YjYtYjQ3MC1mNGI1MjgxZGQ2MDkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgyNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MjZUMTE0MDA0WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OWFiMzdmZTI1NTY4N2NjMTczZDQ2MzYyYmYxYjRlOWI1ZDUyN2RhYTg1NGY3OWVjMDM1YjFhYjRlYzdkMGI5MSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.mr0hbPoy-BZ_1wvtPlv6FLcAMNrEIT_ZyG5RQEaecWU)](https://private-user-images.githubusercontent.com/3730605/481703897-e19c3132-12dd-45b6-b470-f4b5281dd609.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTYyMDg3MDQsIm5iZiI6MTc1NjIwODQwNCwicGF0aCI6Ii8zNzMwNjA1LzQ4MTcwMzg5Ny1lMTljMzEzMi0xMmRkLTQ1YjYtYjQ3MC1mNGI1MjgxZGQ2MDkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgyNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MjZUMTE0MDA0WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OWFiMzdmZTI1NTY4N2NjMTczZDQ2MzYyYmYxYjRlOWI1ZDUyN2RhYTg1NGY3OWVjMDM1YjFhYjRlYzdkMGI5MSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.mr0hbPoy-BZ_1wvtPlv6FLcAMNrEIT_ZyG5RQEaecWU)
