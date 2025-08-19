---
title: "Cline v3.25: 困難な問題に対応するために構築されたコーディングエージェント - Clineブログ"
source: "https://cline.bot/blog/cline-v3-25"
author:
  - "[[Nick Baumann]]"
published: 2025-08-15
created: 2025-08-19
description: "v3.25では、Clineはスレッドを決して手放しません。"
tags:
  - "clippings"
  - "AI"
  - "Agent"
  - "LLM"
  - "Development"
  - "Cline"
---
![Cline v3.25: 困難な問題に対応するために構築されたコーディングエージェント](https://cline.bot/_next/image?url=https%3A%2F%2Fcline.ghost.io%2Fcontent%2Fimages%2F2025%2F08%2Fu9318423161_An_astronaut_tethered_to_their_ship_during_a_spac_ce15646f-c12c-495b-a94d-cc5a066a66c9_1-1.png&w=2048&q=75)

## Cline v3.25: 困難な問題に対応するために構築されたコーディングエージェント

v3.25では、Clineはスレッドを決して手放しません。

![Nick Baumann](https://cline.bot/_next/image?url=https%3A%2F%2Fcline.ghost.io%2Fcontent%2Fimages%2F2025%2F01%2FProfilePicture.jpg&w=96&q=75)

• [@nickbaumann\_](https://twitter.com/@nickbaumann_)

2025年8月15日

このリリースに非常に興奮しています。多くのユーザーがClineに注目しているのは、単に**複雑な問題**への対応に優れているからです。最先端のモデルに必要なコンテキストを与えれば、結果は自ずと明らかになります。Clineを使えば、開発者はそのポテンシャルを最大限に引き出すことができます。

[v3.25](https://github.com/cline/cline/blob/main/CHANGELOG.md?ref=cline.ghost.io)では、ほとんどのエージェントがつまずくような、最も長く複雑なコーディングタスクにおいて、Clineをさらに有能にするために2つの重要な理由から取り組みました。

1. **LLMはコンテキストサイズが大きくなるにつれてパフォーマンスが低下する。** 研究者はこれを「[lost in the middle](https://ar5iv.labs.arxiv.org/html/2307.03172?ref=cline.ghost.io)」現象と呼んでおり、会話の途中のコンテキストが失われてしまいます。
2. **マルチターンエージェントはこの効果を悪化させる。** 1ターン目でモデルの精度が95%だったとしても、コンテキストが蓄積される2ターン目には92%に低下するかもしれません。10ターン目には70%にまで下がり、20ターン目にはエージェントは本来達成しようとしていたことの**スレッドを見失い**、本質的に幻覚（ハルシネーション）を起こしている状態になります。
![](https://cline.ghost.io/content/images/size/w600/2025/08/image-23.png)

"LLMs Get Lost in Multi-Turn Conversation": <https://arxiv.org/abs/2505.06120>

この複合的な効果は、各ターンでコンテキストの汚染が増えるために発生します：

- モデル自身が生成した説明や仮定
- エラー修正と明確化
- ツールの出力とファイルの内容
- うまく機能しなかった以前の試み

問題はコンテキストウィンドウが満杯になることだけではなく、インタラクションのたびにシグナル対ノイズ比が低下することです。元のタスクは、ますますノイズが多くなるコンテキストの真ん中に埋もれてしまいます。

## 50ターン目を最適化する方法

私たちは、単に大きなコンテキストウィンドウを待つだけではこの問題は解決しないと認識しています。Anthropicは最近、**100万トークン**のコンテキストウィンドウを持つClaude 4 Sonnetをリリースしました。これは素晴らしいことですが、100万トークンの汚染されたコンテキストは依然として汚染されたコンテキストです。劣化曲線は消えず、ただ引き伸ばされるだけです。

そこで私たちは、タスクの複雑さや長さに関係なくClineを軌道に乗せ続けるために、3つの連携するシステムを構築しました。その使い方は次のとおりです：

## 1. ディーププランニングで完璧なコンテキストから始める

<video src="https://cline.ghost.io/content/media/2025/08/deep-planning-graphic-4.mp4" width="3840" height="1204"></video>

0:00 / 1:17 /deep-planning

Clineの`/deep-planning`コマンドをタスクと共に実行すると、4段階のプランニングプロセスが開始されます：

1. Clineは冗長な出力を控え、コードベース全体を調査します。コードベースをgrepし、ファイルを読み、パターンを分析し、依存関係を理解し、プロジェクトのメンタルモデルを構築します。
2. この調査の後でのみ、Clineはあなたと対話し、曖昧さを解消するための**的を絞った質問**をします。
3. 次に、包括的な`implementation_plan.md`を生成し、プロジェクトのルートに保存します。
4. 最後に、Clineは新しいタスクを開始します。このタスクには、キーとなるファイルや`implementation_plan.md`を@で指定した、完璧に計画されたプロンプトが読み込まれ、新しいエージェントが引き継ぐためのコンテキストとして含まれます。

**この時点で、あなたとClineは次のエージェントに引き渡すための完璧な計画を作り上げたことになります。**
<video src="https://cline.ghost.io/content/media/2025/08/deep-planning-thru-2dos-sonnet-4.mp4" width="3200" height="2160"></video>

/deep-planning

これがパフォーマンスを向上させる理由です：Clineが新鮮なコンテキストで実際の T シャツを始めると、そこには完璧で蒸留された計画があります。探索による汚染も、蓄積された仮定もなく、純粋な実装の意図だけです。

計画段階で、避けられない試行錯誤、行き止まり、蓄積された仮定を含むすべての探索と明確化を行い、その後すべてを単一の包括的な計画に蒸留することで、20ターン目でパフォーマンスを低下させるコンテキスト汚染を排除します。実装は洗練された計画だけをコンテキストとして新たに開始され、マルチターンの対話による39%の性能低下（[下記参照](https://arxiv.org/abs/2505.06120?ref=cline.ghost.io)）に悩まされることなく、統合された指示から得られる95%の最適なパフォーマンスを達成します。

![](https://cline.ghost.io/content/images/size/w600/2025/08/image-17.png)

メッセージが複数の会話ターンに分割されると、パフォーマンスは39%低下します（右側参照）： <https://arxiv.org/abs/2505.06120>

*私たちは、Clineがコンテキスト内に**価値の高いトークン**のみを持つようにクリーンな引き渡しを作成することで、**`Act`** モード中のパフォーマンスを向上させます。*

## 2. フォーカスチェーンは永続的な北極星

これで、Clineはタスクを開始するための完璧な計画を手に入れました。しかし、完璧な計画があってもエージェントは逸脱することがあります。そこで登場するのが**フォーカスチェーン**です。v3.25ではデフォルトで有効になっており、Clineはタスクから自動的にToDoリストを生成し、重要なことに、**このリストを定期的にコンテキストに再注入**して読み込み、更新することで忘れられないようにします。

![](https://cline.ghost.io/content/images/size/w600/2025/08/image-19.png)

0:00 / 0:16 Clineは自身のToDoリストを更新し、6ターンごとにコンテキストに再注入されます

これは単なるUI上の工夫ではありません（もちろん、それも素晴らしいですが！）。デフォルトでは6メッセージごとに、Clineは「これが今取り組んでいること。これが完了したこと。これが次の作業」とリマインドされます。これは、蓄積されるコンテキストノイズを切り裂き、Clineをメインスレッドに引き戻す永続的な北極星です。

<video src="https://cline.ghost.io/content/media/2025/08/focus-chain-todos.mp4" width="3200" height="2160"></video>

Clineは自身のToDoリストを更新し、6ターンごとにコンテキストに再注入されます

フォーカスチェーンは作業の進行に合わせて適応します。項目がチェックされ、新しいタスクが出現し、優先順位が変わりますが、中心的なミッションが失われることはありません。コンテキストの劣化によってモデルの注意が散漫になりそうなとき、フォーカスチェーンがそれを軌道に戻します。

> /deep-planningとフォーカスチェーンを構築した理由についての詳細は、[Focus: attention isn't enough](https://cline.bot/blog/focus-attention-isnt-enough?ref=cline.ghost.io)をお読みください。

## 3. オートコンパクトで会話を圧縮・継続

最終的に、完璧な計画と持続的な集中力があっても、コンテキストの限界に達します。コンテキストの限界に近づくと、Clineはこれまでに起こったことすべて（技術的な決定、コードの変更、進捗）の包括的な要約を自動的に作成します。そして、肥大化した会話履歴をこの圧縮された要約に置き換え、中断したところから正確に続行します。

<video src="https://cline.ghost.io/content/media/2025/08/auto-compact.mp4" width="3200" height="2160"></video>

0:00

/ 0:06

**オートコンパクト**を使えば、500万トークンのインタラクションが必要なタスクも、200kのコンテキストウィンドウで完了できます。Claude 4 Sonnetの100万トークンのコンテキストは、ロケット燃料のようになります。それは、より多くの汚染を詰め込めるからではなく、圧縮の間隔を長くすることで、全体を通してより高い忠実度を維持できるからです。

***ディーププランニング、フォーカスチェーン、オートコンパクトの3つを組み合わせることで、複雑な問題を解決できるコーディングエージェントを解き放ちます。***

---

v3.25で行ったその他のアップデートは次のとおりです：

- OpenRouterおよびClineプロバイダーにClaude Sonnet 4の200kコンテキストウィンドウサポートを追加。
- RequestyプロバイダーにカスタムベースURLオプションを追加。
- 進行状況チェックリストの更新における重複した`attempt_completion`コマンドを修正。
- アナウンスメントバナーが閉じられないバグを修正。
- AWS BedrockにGPT-OSSモデルを追加。

ドキュメント！

- [フォーカスチェーン](https://docs.cline.bot/features/focus-chain?ref=cline.ghost.io)
- [オートコンパクト](https://docs.cline.bot/features/auto-compact?ref=cline.ghost.io)
- [/deep-planning](https://docs.cline.bot/features/slash-commands/deep-planning?ref=cline.ghost.io)

最新バージョンのClineをお楽しみください。ご意見をお聞かせください！

-Nick

*Clineに最も困難な問題を任せる準備はできましたか？* [*Clineをダウンロード*](https://cline.bot/?ref=cline.ghost.io) *して、AIエージェントが始めたことを実際に完了できるときに何が起こるかを体験してください。複雑な問題での勝利を、* [*Reddit*](https://www.reddit.com/r/cline/?ref=cline.ghost.io) *や* [*Discord*](https://discord.gg/cline?ref=cline.ghost.io) *で私たちのコミュニティと共有してください。*
