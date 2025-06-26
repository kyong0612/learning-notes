---
title: "コードの90%をAIが書く世界で何が待っているのか / What awaits us in a world where 90% of the code is written by AI"
source: "https://speakerdeck.com/rkaga/what-awaits-us-in-a-world-where-90-percent-of-the-code-is-written-by-ai"
author:
  - "r-kagaya"
published: 2025-06-24
created: 2025-06-26
description: |
  「コードの90%をAIが書く世界で何が待っているのか」と題し、AI駆動開発の現状と未来について考察するプレゼンテーション。AIによるコーディングがもたらす開発プロセスの変化、品質保証の新たな課題、そして職種の境界を越えた協働の可能性について論じています。
tags:
  - "clippings"
  - "AI駆動開発"
  - "ソフトウェア開発"
  - "Claude Code"
  - "AIエージェント"
  - "開発プロセス"
  - "Programming"
---

## スライド要約

1. ### © 2024 Loglass Inc. 0 コードの90%をAIが書く世界で 何が待っているのか 2025年6⽉24⽇ 株式会社ログラス r.kagaya

   ![スライド 0](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_0.jpg)

2. ### 1 ⾃⼰紹介 新卒でヤフー株式会社に入社、ID連携システムの開発 2022年に株式会社ログラスに入社 経営管理SaaSの開発、開発生産性向上に取り組んだのち、 生成AI/LLMチームを立ち上げ、複数LLM機能の開発を リード 現在は新規AIプロダクトの立ち上げに従事 株式会社ログラス シニアソフトウェアエンジニア

   ![スライド 1](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_1.jpg)
   r.kagaya(@ry0\_kaga)

3. ### © 2024 Loglass Inc. 2 我々を取り巻く状況

   ![スライド 2](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_2.jpg)

4. ### 3 AI駆動開発 / AIコーディング やっていますか？

   ![スライド 3](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_3.jpg)

5. ### 4 NOと言う人はほぼいなくなった （少なくとも私・ソフトウェア/Web開発の周りでは）

   ![スライド 4](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_4.jpg)

6. ### 5 特筆すべきは進化の速さ

   ![スライド 5](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_5.jpg)

7. ### 6 1ヶ月前まで <https://comemo.nikkei.com/n/n26dc284dcd5a>

   ![スライド 6](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_6.jpg)

8. ### 7 1年間の育休からの異世界転生 <https://x.com/jamgodtree/status/1927682077719498893>

   ![スライド 7](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_7.jpg)

9. ### 8 1年間の育休からの異世界転生 <https://x.com/jamgodtree/status/1927682077719498893>

   ![スライド 8](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_8.jpg)

10. ### 9 今となってはClaude Codeに大移動

    ![スライド 9](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_9.jpg)

11. ### 10 Claude Code開発者の談 <https://www.youtube.com/watch?v=Yf\_1w00qIKc>

    ![スライド 10](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_10.jpg)

12. ### 11 Claude Code開発者の談 <https://www.youtube.com/watch?v=Yf\_1w00qIKc> 「私はもう何ヶ月もユニットテストを書いていない」 「今では手書きコードを書くのが嫌になった。Claudeがあまりにも上手いか ら」 「パンチカードからプロンプトへ」

    ![スライド 11](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_11.jpg)

13. ### 12 Anthropicが考えるClaude Codeの戦略 <https://x.com/shogohayashi/status/1929540790281437480> IDEを使わなくなってる世界すら見据えている Anthropic パンチカードからプロンプトの言葉の通りに、抽 象化の新たな歴史が始まっている

    ![スライド 12](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_12.jpg)

14. ### 13 我々は文字通り歴史の転換点に立っている

    ![スライド 13](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_13.jpg)

15. ### 14 今日のイベントテーマ： AI駆動開発の"今"と"これから"

    ![スライド 14](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_14.jpg)

16. ### 15 "今"と"これから"は地続き 今の実践が、未来への解像度を上げる

    ![スライド 15](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_15.jpg)

17. ### © 2024 Loglass Inc. 16 AI駆動開発の"今"と"これから"

    ![スライド 16](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_16.jpg)

18. ### 17 ログラスで目撃している ソフトウェア開発の変化（抜粋） 一番最初に想起した二つを取り上げる

    ![スライド 17](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_17.jpg)

19. ### 18 1. AIの圧倒的手数による前提の変化 2. 職種を超えたコーディング

    ![スライド 18](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_18.jpg)

20. ### 19 1. AIの圧倒的手数による前提の変化 2. 職種を超えたコーディング

    ![スライド 19](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_19.jpg)

21. ### 人間側も複数ターミナル・セッションを行き来し、AIにコピペ指示するのがデフォルト 動作 みんなターミナル多重接続しているか、ウィンドウ高速移動してる （tmux、前職で直接サーバーに入ってデプロイしてる時以来触ってる） 20 AIコーディングの特筆すべき点はその手数

    ![スライド 20](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_20.jpg)

22. ### 21 コーディングの速度が上がることで 少しずつ見えてきた様々な変化

    ![スライド 21](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_21.jpg)

23. ### 変化したこと • コードを早く・大量に書けるようになった • リファクタリングやPoCコストも気軽に行えるようになった ◦ 何なら想定する実装パターンを複数実装させても良い。 • 異なる形式・粒度・アクセシビリティをドキュメントに求めるようになった ◦

    ![スライド 22](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_22.jpg)
    Notionへの反応は代表例 • 各職種間の成果物の一貫性・接続性を求めるようになった 22 実施できるアクション回数が桁違い、それ故に生まれる新たなメンタルモデル

24. ### コード行数やPRの中身・状況次第ではあるので、1日でPRが10個作れます！す ごい！が伝えたいわけではない(もっと多い日もある、人もいる） 23 とある日の私のPR提出数 コーディング速度の向上がもたらす、開発スタイル・プロセスの変化は？

    ![スライド 23](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_23.jpg)

25. ### 24 1日で10個PRを出せる生産力はあったとして.. チーム人数が5人いたとしたら、1日でPR50個生まれる • 全部レビューできる？CI実行時間がより重荷に？ • そもそもPR50個分の開発アイテムを準備できる？ • エンジニアは複数プロダクト・プロジェクトを掛け持ちした方が生産力は発揮でき る？

    ![スライド 24](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_24.jpg)
    現在のソフトウェア開発・リリーススタイルでは耐えられない、歪みが生まれることが想像 に容易い

26. ### 25 Anthropic CPOの談 <https://www.youtube.com/watch?v=Yf\_1w00qIKc> ・Claude Codeの95%以上をClaude自身が生成 ・今ではコードレビューもClaudeが行う ・人間は受け入れテストを行う ・1年後には現在のソフトウェア開発・リリース方法は維持できなくなる

    ![スライド 25](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_25.jpg)

27. ### 26 これから求められるのは AI前提での新しいスタイルの構築

    ![スライド 26](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_26.jpg)

28. ### 27 間違った方向に高速に進んでも無意味 使われないプロダクトや技術負債を高速で生むだけ

    ![スライド 27](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_27.jpg)

29. ### 28 スピードが限界突破する世界でどのように品質を担保 するか？

    ![スライド 28](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_28.jpg)

30. ### 29 求められるのは新しい"品質・安全性・堅牢性・保守性"を担保するの仕組み 生まれる疑問 • AIが生成したコード全てをレビューできるのか？必要はあるのか？ • AIならテストコードのカバレッジ100％も容易に目指せる？ • もはやブラックボックステスト前提で動作を検証すべき？ •

    ![スライド 29](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_29.jpg)
    AIが生成するコードの方向性や品質をどう保証・誘導するか？ • AIにとっての読みやすいコードとは？今までのコードは人間のため 10個のAIに同じ機能を開発させ、最もクオリティが高いPRを採用したって良い AIが登場人物に増えることで、何がどう変わるのか、変えられるのか？

31. ### 30 "AIがコード生成の中心となる"世界がやってくる可能 性は高い その時の人間の役割やアプローチは？

    ![スライド 30](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_30.jpg)

32. ### 31 AIのアウトプットを収斂させるゴールと制約と評価（評価関数）をどう与えるか？ 一つはガードレールとしての品質指標・基準 • 型（Types）：型システムによる安全性の担保 • テスト（Tests）：自動テストによる動作保証 • リント（Lints）：コーディング規約の自動チェック •

    ![スライド 31](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_31.jpg)
    ？？？ AI生成であろうと人間が書いたコードであろうと、同じように適用される基準 むしろAIの高速生成能力があるからこそ、ガードレールや評価を基準にAIを誘導する仕 組みがより重要に

33. ### 32 TDD with AI Agents テストをAIへの継続的フィードバック・ガードレールとして活用 • 期待する動作をテストで先に定義し、AIへの仕様として提示 • 自動テストでAIが生成したコードの誤りを即座に検出

    ![スライド 32](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_32.jpg)
    • 包括的なテストスイートで意図しない変更を防止 ◦ （テストコード側を変えて、通過を達成する挙動は制御する必要..） • 回帰テストがセーフティネットとして機能 AIの生成スピードに対応するには、広範囲かつ高速実行可能なテストスイートが不可欠 <https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent>

34. ### 33 例えばAgentic Coding？AI駆動開発にもEval Drivenなアプローチ？ Agentic Coding • Vibe Codingは対話的・探索的なア プローチ

    ![スライド 33](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_33.jpg)
    • Agentic Codingは、自律的に動く AIエージェントをどのように導くか？ オーケストレートするか？ • "人を増やす"から"Agentを増やす" へのパラダイムシフト Eval Driven Development • AIプロダクト・エージェント開発で求め られるEval（評価） • Evalを中心に、継続的改善のフライホ イールを回し、poke-and-hope（つ ついて祈る）や印象論的な精度判断か ら脱却 • 自社リポジトリでのAIコーディング エージェントのルールや挙動の改善に も転用するべきアイディア？

35. ### 34 例えばAgentic Coding？AI駆動開発にもEval Drivenなアプローチ？ Agentic Coding • Vibe Codingは対話的・探索的なア プローチ

    ![スライド 34](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_34.jpg)
    • Agentic Codingは、自律的に動く AIエージェントをどのように導くか？ オーケストレートするか？ • "人を増やす"から"Agentを増やす" へのパラダイムシフト Eval Driven Development • AIプロダクト・エージェント開発で求め られるEval（評価） • Evalを中心に、継続的改善のフライホ イールを回し、poke-and-hope（つ ついて祈る）や印象論的な精度判断か ら脱却 • 自社リポジトリでのAIコーディング エージェントのルールや挙動の改善に も転用するべきアイディア？ AIを"使う"から"導く"へのシフト AIをどこに導きたいか？ ゴールに近づいてるかをどう図るか？

36. ### 35 Vibe Coding vs. Agentic Coding: Fundamentals and Practical Implications

    ![スライド 35](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_35.jpg)
    of Agentic AI • バイブコーディングとエージェントコー ディングの2つのパラダイムを比較分析 し、それぞれの特徴と適用領域をまと めた論文 • 対話型・人間主導のバイブコーディング • 自律型・AI主導のエージェントコーディ ング <https://arxiv.org/pdf/2505.19443>

37. ### 36 人間がドライバーとして介在しなくても良い、一度設定したら裏でよしなにやってくれる世界 Google: LLMコードマイグレーション • Googleでの大規模で手間のかかる マイグレーション作業を自動化 • 変更箇所の発見とLLMを組み合わせ たアプローチ

    ![スライド 36](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_36.jpg)
    • 74%以上のコード変更をLLMが生成 し、作業時間を50%削減 Meta： TestGen-LLM • Metaの既存の単体テストを自動で改 善するツール • LLMとフィルタリング機構を組み合わ せたアプローチ • 75%のテストがビルド成功、25%が カバレッジ向上、73%が本番採用 <https://arxiv.org/abs/2504.09691> <https://arxiv.org/abs/2402.09171>

38. ### 37 (雑）エンジニアは農家みたいになるのかもしれない 土壌を整え、種を蒔き、環境を管理する、野菜はたくましく自分たちで育つ（解像度低いです、すみません

    ![スライド 37](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_37.jpg)

39. ### 38 1. AIの圧倒的手数による前提の変化 2. 職種を超えたコーディング

    ![スライド 38](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_38.jpg)

40. ### 39 私たちの知る開発の終わり <https://www.oreilly.com/radar/the-end-of-programming-as-we-know-it/>

    ![スライド 39](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_39.jpg)

41. ### 40 There's a lot of chatter in the media that

    ![スライド 40](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_40.jpg)
    software developers will soon lose their jobs to AI. I don't buy it. It is not the end of programming. It is the end of programming as we know it today. 訳）メディアでは、ソフトウェア開発者がすぐにAIに仕事を奪われるという噂 が広まっています。私はこれを信じません。 これはプログラミングの終わりではありません。現在知られている形でのプ ログラミングの終わりなのです。 私たちの知る開発の終わり

42. ### 41 AIに支援され、コーディングという行いが アクセシブルになる過程に我々はいる

    ![スライド 41](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_41.jpg)

43. ### 42 デザイナーもプロダクトマネージャーもPR出せる with AI • 弊社デザイナーが新規プロダクト開発で、Claude Codeで自らフロントエンド開 発に挑戦してる様子

    ![スライド 42](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_42.jpg)

44. ### 43 デザイナーもプロダクトマネージャーもPR出せる with AI • プロダクトマネージャーも

    ![スライド 43](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_43.jpg)

45. ### 44 仕様書からPRを出せる時代 • 仕様書変更やGithub IssueからPRを出すこともできる # specs/user-registration.yaml validation: username: min\_length

    ![スライド 44](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_44.jpg)
    3 # これを変更すると... max\_length: 20 # 自動でコードとテストが更新される email: pattern: "^[a-zA-Z0-9.\_%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

46. ### 45 デザイナーもプロダクトマネージャーもPR出せる、仕様書からPRを出せる時代 今目撃してるのは「エンジニアが中心にコードを書く世界が変わりつつある」こと エンジニア（もちろんその他の職種の方も）に問われているのは 「職種の境界が曖昧になった世界での新しい協働の形」

    ![スライド 45](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_45.jpg)

47. ### 46 例えば • デザイナーがFigmaでデザインを作って、Figmaを元にフロントエンドコードを生 成した方が良い？ • そもそもデザイナーが実はフロントエンドのUI開発はできる？ • 仕様書からある程度の精度でコードが生成できるなら、プロダクトマネージャーに 限らず、ドキュメントをまず書くことがより重要に？

    ![スライド 46](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_46.jpg)
    • コードからドキュメントの自動生成もできそうだぞ？ デザイナーもプロダクトマネージャーもPR出せる、仕様書からPRも出せる時代に、どのよ うな開発プロセスを描くのか？

48. ### 47 コーディングではボトルネックではなくなる ではボトルネックは何処に？ （みたいな事を考え続ける必要があるのだと思う）

    ![スライド 47](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_47.jpg)

49. ### © 2024 Loglass Inc. 48 まとめ

    ![スライド 48](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_48.jpg)

50. ### 49 オライリー「AI Value Creators」から・意訳 ・多くの企業は既存プロセスの中にAIをどう使う？とアドオンする発想 ・真にやるべきはAI前提で組み直した後に、残りどうする？を考えること ・多くの組織は「AIを後から乗せる」という考え方から抜け出せていない <https://www.oreilly.com/library/view/ai-value-creators/9781> 098168339/

    ![スライド 49](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_49.jpg)

51. ### 50 数年後のAIネイティブな開発とは • 大枠は既存フローのまま、エンジニアだけがコードをwith AIで生成する前提のプ ロセスのことを、数年後にAIネイティブな開発と呼んでいる気はしない • 100xにはおそらくならない、あくまで10x程度（それでもすごいが） • 真に目指すべきはこのレベルではないか

    ![スライド 50](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_50.jpg)
    ◦ "Claude Codeの95%以上をClaude自身が生成" ◦ "今ではコードレビューもClaudeが行う"

52. ### 51 "AI前提でプロダクト開発を組み直せたか？" と問われると、ログラスもまだNO AI時代の最先端プロダクト開発の探求と実践を目指し てる最中

    ![スライド 51](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_51.jpg)

53. ### 52 TDD, AI agents and coding with Kent Beck <https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent>

    ![スライド 52](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_52.jpg)
    So I I'm spending 6 8 10 hours a day, sometimes more programming. In 50 years of programming, this is by far the most fun I've ever had. I 訳）だから僕は1日に6時間から10時間、時にはそれ以上かけてプログラミン グをしている。プログラミングを始めて50年になるけど、今が一番楽しいよ。

54. ### 53 TDD, AI agents and coding with Kent Beck <https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent>

    ![スライド 53](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_53.jpg)
    So I I'm spending 6 8 10 hours a day, sometimes more programming. In 50 years of programming, this is by far the most fun I've ever had. I 訳）だから僕は1日に6時間から10時間、時にはそれ以上かけてプログラミン グをしている。プログラミングを始めて50年になるけど、今が一番楽しいよ。 せっかくの大トレンド 逃れることも難しい せっかくなので楽しんでいきたい

55. ### • AIコーディングにより様々な前提が変わることは確実 ◦ e.g. AIが生成したコードの全てを人力レビューなどはどこかで無理がでる • 方向性を間違えば、どんなに速くても無意味。品質なき速度は技術的負債を生むだ け • ボトルネックは移動し続ける。コーディングはボトルネックではなくなった

    ![スライド 54](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_54.jpg)
    ◦ では何処に？（みたいな事を考える必要） • "今"のキャッチアップに全力を注ぐ、見えてきた歪みは、"これから""を見据える貴 重な気づき • "世界は落下しているので、重力に逆らってはいけない。先に下に落ちよう" 54 まとめ

56. ### 55

    ![スライド 55](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_55.jpg)

57. ### 56 Human-AI collaboration AIとの協働、Human-AI collaboration Human-AI collaborationとは、人間の知性とAI技術の戦略的パートナーシップであり、両者の長所を最 大限に引き出すことである。これは、人間と機械の能力をシームレスに統合し、両者が互いの強みを補い合う 共生関係を意味する

    ![スライド 56](https://files.speakerdeck.com/presentations/2d064ae570914bec8eb1201dd293a0dd/slide_56.jpg)
