---
title: "使えるデータ基盤を作る技術選定の秘訣 / selecting-the-right-data-technology"
source: "https://speakerdeck.com/pei0804/selecting-the-right-data-technology"
author:
  - "近森 淳平 (@pei0804)"
published:
created: 2025-05-14
description: |
  効果的なデータ基盤構築には、単に「便利そう」という理由だけでなく、「使える」ストーリーが不可欠である。モダンデータスタックのツールを積極的に活用し、失敗を恐れずに素早く試すことがデータ活用成功への鍵となる。データ成熟度には段階があり、「Data-informed」までは技術で達成可能だが、真の「Data-driven」組織に至るには、技術だけでなく人や組織の変革が求められる。
tags:
  - "clippings"
  - "データ基盤"
  - "技術選定"
  - "モダンデータスタック"
  - "DataOps"
  - "データドリブン"
  - "データ活用"
---

## 要約

本資料は、効果的なデータ基盤を構築するための技術選定の秘訣について解説するものです。単に「便利そう」という理由でツールを導入するだけではデータ基盤は活用されず、「使える」ストーリーが重要であると説きます。

### 1. はじめに：データ基盤活用の課題

* 多くの組織で「データ基盤がなかなか活用されない」「ツールを導入したが使われない」という問題が発生しています。
* その原因として、管理者の「便利そう」という視点だけでツールが導入され、利用者の実際の課題を解決していないケースが多いと指摘します。
* 重要なのは、利用者の「本当の痛み」を解決し、「これがないと困る」「これを使うと圧倒的に仕事が変わる」という「使える」ストーリーを提示することです。

### 2. データ基盤の価値と現状

* データ基盤は事業にとって必須条件ではなく「付加価値」と認識されやすい傾向があります。歴史ある事業ではデータ基盤なしでも成功してきたためです。
* データ基盤の真の価値は「日々使われていること」にあり、それはデータ基盤の管理者ではなく、利用者に使われている状態を指します。
* データ基盤が使われる状態を作ることは、人の営みを変えることであり、容易ではありません。明確に「使える」ストーリーが不可欠です。

### 3. 大局を知る：モダンデータスタックの活用

* モダンデータスタックの登場により、データ基盤構築は民主化され、専門知識がなくても構築可能になりました。
* これらのツールは積極的に活用すべきであり、その理由は以下の通りです。
  * **すぐに使える価値**: フルスクラッチ開発に比べ、データアクセスまでの時間を大幅に短縮できます。
  * **集合知へのアクセス**: dbtのようなツールは、業界の知識やベストプラクティスへのアクセスを容易にします。
  * **ツールに合わせる利点**: 洗練されたプラクティスを導入でき、長期的な保守性向上や将来の選択肢確保に繋がります。
* 著者は「ツールが使えるなら、絶対に使った方が良い」と強調します。ロックインのリスクよりも、時間をかけすぎて旬を逃す方が問題であり、「試したい！」という熱がある時にすぐ試せる環境が重要です。
* データ活用は基本的に失敗が多く、たくさん試し、たくさん失敗する中で成功が生まれます。そのため、ツールを活用して試行錯誤のサイクルを速めることが、「使える」ストーリーを増やす最速の方法です。

### 4. ツール選定の勘所

ツール選定は以下のステップで進めます。

1. **解く課題を明確にする**: 誰のどのような課題を解決するのかを明確にします。スプレッドシートの使われ方などがヒントになります。
2. **課題のカテゴリを特定する**: データ取り込み、DWH、変換、可視化・分析、オーケストレーションなど。
3. **まず1つのツールを試す**: SaaSのトライアルやOSSを実際に使ってみることが重要です。
4. **可能であれば3つ試す**: カテゴリ内の共通機能や各ツールの強みを比較検討できます。

導入判断の際には、以下の9つのポイントを確認します。

1. **圧倒的に仕事を変える力があるか**: 「ちょっと便利」程度では不十分。「使わないと損」と実感できる価値が必須。
2. **学習コスト**: 基盤利用者が容易に扱えるか。専門知識が必要なものは基盤チーム限定と考えるべき。
3. **公式ドキュメントの充実度**: 利用者の体験と運用負荷に直結。
4. **サポート体制の良し悪し**: SaaSの場合、トライアルで見極めが重要。
5. **コミュニティの活発度**: 導入後の運用・活用に関する知見が得られる。
6. **課金モデルと組織体制の相性**: 活用が罰則的な費用増につながらないか。
7. **ロードマップへの共感度**: 中長期的な方向性の一致が重要。
8. **セキュリティ体制**: 機密データを扱う場合の必須要件。
9. **撤退シナリオ**: 導入前から検討し、ツールの責任範囲を明確化。

導入後も、ツールを置くだけでは使われません。社内ドキュメント整備や具体的な課題解決支援といった泥臭いオンボーディング活動が不可欠です。

### 5. CARTA MARKETING FIRMの事例

* CARTA MARKETING FIRM で実際に採用されているツールスタックが Findy Tools のページで公開されています（本資料作成時点で2年ほど大きな変化なし）。
* ツール選定が一巡した後は、「事業をデータエンジニアリングする」フェーズに入っています。

### 6. 事業をデータエンジニアリングする：ツール導入後の真の課題

* ツールが使われ始めても、別の課題（多くの場合、データドリブン経営の実現）が出てきます。これはツール導入だけでは達成できません。
* データ成熟度には以下の4段階があり、ツールで到達しやすいのは「Data-informed」までです。
    1. **Data-exploring**: データ収集はしているが活用できず、意思決定は直感に頼る。
    2. **Data-informed**: データの価値を認識し、分析ツール等への投資が始まる。
    3. **Data-driven**: データが意思決定の中心となり、組織全体で活用が浸透する。
    4. **Data-transformed**: データが組織のDNAとなり、全活動がデータに基づき最適化される。
* 「Data-driven」以上を目指すには、技術だけでなく「人」や「組織」の変革が中心課題となります。
* CARTA MARKETING FIRM では、RevOps（Revenue Operations）の考え方を導入し、部門間の壁を越えて収益最大化を目指し、データを経営資本として活用する取り組みを進めています。

### 7. まとめ

* 「使える」ストーリーを明確にし、モダンデータスタックのツールを積極的に活用することで、「Data-informed」の段階までは比較的早く到達できます。ここまでは技術選定が効果を発揮します。
* しかし、真の「Data-driven」な組織を実現するには、ツール導入だけでは不十分であり、最終的には人や組織の課題に向き合い、技術と組織の両輪で継続的に取り組むことが不可欠です。

## More Decks by pei0804

[

事業をデータエンジニアリングする / data-engineering-for-business

](<https://speakerdeck.com/pei0804/data-engineering-for-business> "事業をデータエンジニアリングする / data-engineering-for-business")

[pei0804](https://speakerdeck.com/pei0804)

9

1.1k

[

進化を加速させる データ基盤CI/CDの実践 / accelerating-data-platform-ci-cd

](<https://speakerdeck.com/pei0804/accelerating-data-platform-ci-cd> "進化を加速させる データ基盤CI/CDの実践 / accelerating-data-platform-ci-cd")

[pei0804](https://speakerdeck.com/pei0804)

1

630

[

RevOpsへ至る道 データ活用による事業革新への挑戦 / path-to-revops

](<https://speakerdeck.com/pei0804/path-to-revops> "RevOpsへ至る道 データ活用による事業革新への挑戦 / path-to-revops")

[pei0804](https://speakerdeck.com/pei0804)

5

1.1k

[

ビジネスに必要な全てを担い、 自分の専門性を見つけ出す フルサイクル開発者のあり方@技育祭 秋 / how-find-own-speciality-in-full-cycle

](<https://speakerdeck.com/pei0804/how-find-own-speciality-in-full-cycle> "ビジネスに必要な全てを担い、 自分の専門性を見つけ出す フルサイクル開発者のあり方@技育祭 秋 / how-find-own-speciality-in-full-cycle")

[pei0804](https://speakerdeck.com/pei0804)

7

1.2k

[

データドリブン経営への転換 / transforming-to-data-driven

](<https://speakerdeck.com/pei0804/transforming-to-data-driven> "データドリブン経営への転換 / transforming-to-data-driven")

[pei0804](https://speakerdeck.com/pei0804)

10

3.6k

[

DataOps実現への道筋 持続可能な運用体制の構築 / journey-to-dataops

](<https://speakerdeck.com/pei0804/journey-to-dataops> "DataOps実現への道筋 持続可能な運用体制の構築 / journey-to-dataops")

[pei0804](https://speakerdeck.com/pei0804)

8

1.7k

[

中央集権体制からDataOpsへの転換 / centralized-to-dataops-transformation

](<https://speakerdeck.com/pei0804/centralized-to-dataops-transformation> "中央集権体制からDataOpsへの転換 / centralized-to-dataops-transformation")

[pei0804](https://speakerdeck.com/pei0804)

10

4.7k

[

2024年に描く青写真(データアーキテクチャ) / strongest-data-architecture-discussion-2024

](<https://speakerdeck.com/pei0804/strongest-data-architecture-discussion-2024> "2024年に描く青写真(データアーキテクチャ) / strongest-data-architecture-discussion-2024")

[pei0804](https://speakerdeck.com/pei0804)

2

3.8k

[

アドテクのビッグデータを制するSnowflakeの力 / data-cloud-world-tour-tokyo-2023

](<https://speakerdeck.com/pei0804/data-cloud-world-tour-tokyo-2023> "アドテクのビッグデータを制するSnowflakeの力 / data-cloud-world-tour-tokyo-2023")

[pei0804](https://speakerdeck.com/pei0804)

6

2k

## Other Decks in Technology

[

DynamoDB のデータを QuickSight で可視化する際につまづいたこと/stumbling-blocks-when-visualising-dynamodb-with-quicksight

](<https://speakerdeck.com/emiki/stumbling-blocks-when-visualising-dynamodb-with-quicksight-50108786-eb16-4fdf-a15e-c09c9d7c80f1> "DynamoDB のデータを QuickSight で可視化する際につまづいたこと/stumbling-blocks-when-visualising-dynamodb-with-quicksight")

[emiki](https://speakerdeck.com/emiki)

0

140

[

Part1　GitHubってなんだろう？その１

](<https://speakerdeck.com/tomokusaba/part1-githubtutenandarou-sono1> "Part1　GitHubってなんだろう？その１")

[tomokusaba](https://speakerdeck.com/tomokusaba)

3

710

[

AIと共同執筆してより質の高い記事を書こう

](<https://speakerdeck.com/riyaamemiya/aitogong-tong-zhi-bi-siteyorizhi-nogao-iji-shi-woshu-kou> "AIと共同執筆してより質の高い記事を書こう")

[riyaamemiya](https://speakerdeck.com/riyaamemiya)

1

120

[

地味にいろいろあった！ 2025春のAmazon Bedrockアップデートおさらい

](<https://speakerdeck.com/minorun365/di-wei-niiroiroatuta-2025chun-noamazon-bedrockatupudetoosarai> "地味にいろいろあった！ 2025春のAmazon Bedrockアップデートおさらい")

[minorun365](https://speakerdeck.com/minorun365)

[PRO](https://speakerdeck.com/pro)

2

570

[

2025-04-14 Data & Analytics 井戸端会議 Multi tenant log platform with Iceberg

](<https://speakerdeck.com/kamijin_fanta/2025-04-14-data-and-analytics-jing-hu-du-an-hui-yi-multi-tenant-log-platform-with-iceberg> "2025-04-14 Data & Analytics 井戸端会議 Multi tenant log platform with Iceberg")

[kamijin\_fanta](https://speakerdeck.com/kamijin_fanta)

1

180

[

Computer Use〜OpenAIとAnthropicの比較と将来の展望〜

](<https://speakerdeck.com/pharma_x_tech/computer-use-openaitoanthropicnobi-jiao-tojiang-lai-nozhan-wang> "Computer Use〜OpenAIとAnthropicの比較と将来の展望〜")

[pharma\_x\_tech](https://speakerdeck.com/pharma_x_tech)

6

1k

[

2025年8月から始まるAWS Lambda INITフェーズ課金/AWS Lambda INIT phase billing changes

](<https://speakerdeck.com/quiver/aws-lambda-init-phase-billing-changes> "2025年8月から始まるAWS Lambda INITフェーズ課金/AWS Lambda INIT phase billing changes")

[quiver](https://speakerdeck.com/quiver)

1

880

[

Pythonデータ分析実践試験 出題傾向や学習のポイントとテクニカルハイライト

](<https://speakerdeck.com/terapyon/pythondetafen-xi-shi-jian-shi-yan-chu-ti-qing-xiang-yaxue-xi-nopointototekunikaruhairaito> "Pythonデータ分析実践試験 出題傾向や学習のポイントとテクニカルハイライト")

[terapyon](https://speakerdeck.com/terapyon)

1

130

[

AI駆動で進化する開発プロセス ～クラスメソッドでの実践と成功事例～ / aidd-in-classmethod

](<https://speakerdeck.com/tomoki10/aidd-in-classmethod> "AI駆動で進化する開発プロセス ～クラスメソッドでの実践と成功事例～ / aidd-in-classmethod")

[tomoki10](https://speakerdeck.com/tomoki10)

1

990

[

グループ ポリシー再確認 (2)

](<https://speakerdeck.com/murachiakira/gurupu-porisizai-que-ren-2> "グループ ポリシー再確認 (2)")

[murachiakira](https://speakerdeck.com/murachiakira)

0

230

[

AI-in-the-Enterprise｜OpenAIが公開した「AI導入7つの教訓」——ChatGPTで変わる企業の未来とは？

](<https://speakerdeck.com/customercloud/ai-in-the-enterprise-openaigagong-kai-sita-aidao-ru-7tunojiao-xun-chatgptdebian-waruqi-ye-nowei-lai-toha> "AI-in-the-Enterprise｜OpenAIが公開した「AI導入7つの教訓」——ChatGPTで変わる企業の未来とは？")

[customercloud](https://speakerdeck.com/customercloud)

[PRO](https://speakerdeck.com/pro)

0

160

[

Simplify! 10 ways to reduce complexity in software development

](<https://speakerdeck.com/ufried/simplify-10-ways-to-reduce-complexity-in-software-development> "Simplify! 10 ways to reduce complexity in software development")

[ufried](https://speakerdeck.com/ufried)

2

240

## Featured

[

Art, The Web, and Tiny UX

](<https://speakerdeck.com/lynnandtonic/art-the-web-and-tiny-ux> "Art, The Web, and Tiny UX")

[lynnandtonic](https://speakerdeck.com/lynnandtonic)

298

20k

[

XXLCSS - How to scale CSS and keep your sanity

](<https://speakerdeck.com/sugarenia/xxlcss-how-to-scale-css-and-keep-your-sanity> "XXLCSS - How to scale CSS and keep your sanity")

[sugarenia](https://speakerdeck.com/sugarenia)

248

1.3M

[

It's Worth the Effort

](<https://speakerdeck.com/3n/its-worth-the-effort> "It's Worth the Effort")

[3n](https://speakerdeck.com/3n)

184

28k

[

The Psychology of Web Performance \[Beyond Tellerrand 2023\]

](<https://speakerdeck.com/tammyeverts/the-psychology-of-web-performance-beyond-tellerrand-2023> "The Psychology of Web Performance [Beyond Tellerrand 2023]")

[tammyeverts](https://speakerdeck.com/tammyeverts)

47

2.7k

[

StorybookのUI Testing Handbookを読んだ

](<https://speakerdeck.com/zakiyama/ui-testing-handbook-by-storybook> "StorybookのUI Testing Handbookを読んだ")

[zakiyama](https://speakerdeck.com/zakiyama)

30

5.7k

[

Gamification - CAS2011

](<https://speakerdeck.com/davidbonilla/gamification-cas2011> "Gamification - CAS2011")

[davidbonilla](https://speakerdeck.com/davidbonilla)

81

5.3k

[

Building Flexible Design Systems

](<https://speakerdeck.com/yeseniaperezcruz/building-flexible-design-systems> "Building Flexible Design Systems")

[yeseniaperezcruz](https://speakerdeck.com/yeseniaperezcruz)

329

39k

[

For a Future-Friendly Web

](<https://speakerdeck.com/brad_frost/for-a-future-friendly-web> "For a Future-Friendly Web")

[brad\_frost](https://speakerdeck.com/brad_frost)

177

9.7k

[

The World Runs on Bad Software

](<https://speakerdeck.com/bkeepers/the-world-runs-on-bad-software> "The World Runs on Bad Software")

[bkeepers](https://speakerdeck.com/bkeepers)

[PRO](https://speakerdeck.com/pro)

68

11k

[

Building a Modern Day  E-commerce SEO Strategy

](<https://speakerdeck.com/aleyda/building-a-modern-day-e-commerce-seo-strategy> "Building a Modern Day  E-commerce SEO Strategy")

[aleyda](https://speakerdeck.com/aleyda)

40

7.2k

[

How STYLIGHT went responsive

](<https://speakerdeck.com/nonsquared/how-stylight-went-responsive> "How STYLIGHT went responsive")

[nonsquared](https://speakerdeck.com/nonsquared)

100

5.5k

## Transcript

1. ### 使えるデータ基盤を作る 技術選定の秘訣 【技術選定を突き詰める】Online Conferenc e 2025 近森 淳平（チカモリ　ジュンペイ） @pei0804

2. ### データ界隈、 どんどん新しい技術（ツール）出てくる

3. ### その中から、本当に必要だったものを 見つけ出す考えを共有します

4. ### 「データ基盤がなかなか活用されない。 どうしたらいいいですか？」

5. ### 「ツール導入したんですが、使われません。 どうしたらいいですか？」

6. ### この質問、本当に何回も聞きました

7. ### 話を聞いていると、 「便利そう」で導入している。 これは失敗する

8. ### よくありがちな罠として、 管理者視点で便利そうは流行らない

9. ### 課題を解決してないツール導入 ①モダンなBI入れました！ みんな使ってね！！ ③また、スプシでやってる！！ BI使ってよ！！ 　②このグラフ、データないのか スプシでやろ・・・ 管理者 利用者

10. ### 高度な技術を導入するだけでは、 ラストワンマイルを解決している 表計算ソフトに負ける

11. ### 本当の痛みを解決すれば、人は動く ①このレポート、数時間かけてると 思いますが、3秒で出来ます。 管理者 利用者 ②それは、すごすぎ！！！ どうやってやるの教えて！！ ③こういうツールがありまして・・・ ④これはすごい！ これから、これでやろ

12. ### 実際にデータを使って価値を出す人たちが 欲しいものを技術選定をしよう

13. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

14. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

15. ### 自己紹介 ぺい @pei0804 近森淳平(チカモリ　ジュンペイ) VP of Data @ CARTA MARKETING

 FIRM / CARTA HOLDINGS 2024, 2025 Snowﬂake Data Superheroes

16. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

17. ### 今回の技術選定の対象である データ基盤の価値とは何か

18. ### 事業にとってデータ基盤は何か

19. ### 1日止まると、どれくらい困る？ 翌日に復旧していれば問題ない？

20. ### 実はデータ基盤がなくても、 事業は継続できたりしませんか？ （悪いことではない）

21. ### データ基盤は事業の必須条件ではなく付加価値 データ基盤は事業の必須条件ではなく付加価値なケースが多いです。 特に歴史ある事業は、データ基盤がない、手軽ではない時代から データ基盤なしでも成功を収めてきました。 そのためデータ基盤はなくても事業が回る存在と認識されやすいのです。 実際に収益を生む業務システムと比較すると、 「本当に必要なのか？」という疑念を持たれやすい性質があります

22. ### 事業に不可欠な存在へと変えるには、 戦略的な活用が必須となります

23. ### 場当たり的に取り組むだけでは、 「本当に必要なのか？」と疑問視されやすい。 それがデータ基盤。 ここを出発点に、技術選定を考えていきます

24. ### では、どのような状態であれば データ基盤に価値があるのでしょうか？

25. ### 日々使われていること。 これが何よりも重要です

26. ### もちろんデータ基盤管理者ではなく、 データ基盤の利用者にです

27. ### 「データ基盤がなかなか活用されない。 どうしたらいいいですか？」

28. ### これまで事業に存在していなかったものを 新たに活用してもらうことは 容易ではありません

29. ### データ基盤が使われている状態を作るとは、 人の営みを変えるということ

30. ### 「便利そう」だと弱い。 明確に「使える」ストーリーが必要

31. ### 「使える」ストーリーを作れる技術を 選定し導入する

32. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

33. ### 技術選定をする前に、大局を知る

34. ### データ基盤を取り巻く環境

35. ### モダンデータスタックの登場により、 データ基盤構築の民主化が進み 専門知識がなくても構築可能に

36. ### <https://notion.castordoc.com/modern-data-stack-guide>

37. ### 今日の技術選定の対象は、 このツールたちです。 もはや、これらを使わない手はない

38. ### 多くの技術問題は、ツールで解決できる

39. ### 以前は数ヶ月かかっていたことが、 現在では1日で完了する

40. ### ツールが使えるなら、 絶対に使った方が良い

41. ### なぜツールを使った方がいいか

42. ### すぐに使えることは価値 1からフルスクラッチで作った仕組みで取り込んだデータも、 ツールを使って取り込んだデータも、得られる結果に違いはないです。 異なるのはデータにアクセスできるまでの時間です。 データ使いたい人にとっては、早く使える方が良いのです。 データ閲覧に時間がかかるようでは、誰も使わなくなってしまいます

43. ### ツールを通して、集合知へアクセスできる ツールという共通言語を通じて集合知にアクセスできます。 例えば、dbtを使うことで、これまでデータウェアハウスごとに 分断されていた知識が集合知とになっています。 逆にフルスクラッチでデータパイプラインを作ると、 独自事情が多くなり、集合知へのアクセスが難しくなります

44. ### ツールに合わせる利点 一定の評価を得ているツールには、 洗練されたプラクティスが備わっています。 ツールに業務を合わせることで、より良い管理手法を採用できます。 このアプローチは業界の集合知を活用する戦略的選択であり、 長期的な保守性向上と将来の選択肢確保につながります。 反対に事業の特殊要件にこだわりすぎると、 カスタマイズ機能に縛られてベンダーロックインのリスクがあります

45. ### 再掲 ツールが使えるなら、 絶対に使った方が良い

46. ### ロックイン怖くない？

47. ### 時間をかけすぎて、 旬が過ぎる方が怖い

48. ### 「試したい！」熱がある時に、 すぐ試せる方がいい

49. ### なぜか？

50. ### 高度な技術や優秀な人材を集めただけでは、 データ活用の成功確率は必ずしも上がりません

51. ### 基本的に失敗する。 本当に

52. ### たくさん失敗して、たまに成功する。 それがデータ活用

53. ### なら、たくさん試して、 たくさん失敗した方が良い

54. ### 試す前の段階で大変だったら、 絶対にうまくいかない

55. ### ツールに乗っかれるとこは乗っかって、 さっさと試せるようにする

56. ### たくさん試せされると、 「使える」ストーリーは自ずと増える

57. ### これが「使える」ストーリーを作る 最速の方法

58. ### 再掲 ツールが使えるなら、 絶対に使った方が良い

59. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

60. ### <https://notion.castordoc.com/modern-data-stack-guide>

61. ### ツール選定は、どこから始めるか

62. ### 解く課題を明確にする ツール選定を始める前にやるべきは、解決すべき課題の明確化です。 課題がないところにツールを導入しても使われないです。 誰のどのような課題を解決するのか、 これをはっきりさせることが大切です

63. ### 課題がどこにあるか分からない？ 身の回りの人たちのスプレッドシート（以下スプシ）を見れば、 データに関する課題、ニーズは可視化されています。 • ビジネス上重要だけど、スプシしか置き場のないデータ。 • サイロ発生している箇所を、繋げるガムテープスプシ。 いきなりAI活用とかしなくても、身近なところにニーズはあります

64. ### 課題のカテゴリを特定する 課題がどのカテゴリのものかを特定しましょう。 • データ取り込み • データウェアハウス • データ変換 • データ可視化・分析

 • オーケストレーション • データガバナンス • データオブザーバビリティ • etc…

65. ### カテゴリを絞り込んでも、 たくさん候補がある

66. ### まず、1つのツールを一旦試す ツールの多くは簡単に試すことができます。 SaaSなら一般的にトライアル期間が用意されていますし、 OSSであればすぐに試すことが可能です。 具体的な課題解決方法が見えなくても、 長時間の調査よりもまず実際に試してみる方が効果的です。 実際に使うことで課題がより明確になり、 必要な機能も見えてくることが少なくありません

67. ### 同じカテゴリで、3つ試す 可能であれば、同一カテゴリのツールを3つ試すことをお勧めします。 3つほど検証すると、カテゴリ内の共通の機能と 各ツール固有の強みが見えてきます。 それぞれの特色を自組織の課題と照らし合わせることで、 より適切な選択ができ、失敗を避けられます

68. ### 導入判断する前に見るポイント 1. 圧倒的に仕事を変える力があるか 2. 学習コスト 3. 公式ドキュメントの充実度 4. サポート体制の良し悪し 5

 コミュニティの活発度 6. 課金モデルと組織体制の相性 7. ロードマップへの共感度 8. セキュリティ体制 9. 撤退シナリオ

69. ### 圧倒的に仕事を変える力があるか ツール選定で最重要なのは、圧倒的に仕事を変えられるかどうかです。 「ちょっと便利」程度のツールは、導入・運用コストが便利を上回り、 組織の生産性を低下させます。 特に多くの利用者を想定する場合、前の方法が馬鹿らしくなるほどの 圧倒的な価値提供が不可欠です。 価値あるツールとは、「使わないと損」と実感できるものです。 この基準を満たさないツールは、導入しない方がマシです

70. ### 学習コスト すごく高機能だが、学習コストが高いツールを、 基盤利用者に学習してもらうことは非現実的。 「勉強すれば分かる」が通用するのは、 基盤チームだけが利用するケースに限ると捉えた方が良い。 基盤チームだけが使うものなら、Simpleな小回りが効くもの。 基盤利用者がメインで使うものなら、Eazyに扱えるもの

71. ### 公式ドキュメントの充実度 公式ドキュメントの充実度は、 基盤利用者の体験と運用負荷に直結します。 ドキュメントが基盤チームの代わりに説明をできる状態に なっていれば、サポート負荷は大幅に軽減されます。 逆にドキュメントが不十分だと、 基盤利用者からの問い合わせが増え、業務負担が増大します

72. ### サポート体制の良し悪し SaaSを使う場合、これは絶対に確認すべきポイント。 事前のトライアルでコミュニケーションを重ねて見極めます。 個人的には「分かってる」と感じる回数が重要な判断材料になります。 トライアル中に感じた違和感は、導入後も同様に発生しますので、 無視せずに考慮すべきです。 周りに先行ユーザーがいれば、 サポートの質について聞いておくことも有益です

73. ### コミュニティの活発度 コミュニティは公式サポートとは質的に異なる価値を提供します。 具体的には、導入後の運用・活用の話は、 コミュニティだからこそカバーされる領域です。 私はSnowﬂakeのSnowVillageに参加しています。 ここには多様な業界や役割のメンバーが集まっています。 自組織だけで気づかなかった視点や創造的な解決策に 出会える貴重な機会となっています。 <https://usergroups.snowﬂake.com/snowvillage/>

74. ### 課金モデルと組織体制の相性 SaaSなら、料金体系が業務や組織構造と合致するかを確認しましょう。 例えば、課金に影響する変数が利用者数の場合、 現在と潜在的な利用者も見積もりに含めることが重要です。 ツールの活用が進んでいくと高くてやってられないとかだと、 活用レベルにアッパーができてしまうからです。 活用が罰則的な費用増加につながらないのが理想的です

75. ### ロードマップへの共感度 将来的な方向性と自組織の戦略的ニーズの一致度を評価します。 短期間の一致よりも、中長期的な方向性の合致が重要です。 また、ロードマップがどのように決定されているか、 過去のロードマップと現在の達成度を確認することも有効です。 現状のみで評価しすぎると、 翌年には不要なツールになってしまう可能性があります

76. ### セキュリティ体制 SaaSで機密データを扱う場合、重要な観点です。 SOCやISMSなどのセキュリティ認証があれば理想的です。 認証取得がない場合は、社内基準への適合性も確認が必要になります。 セキュリティ要件は選定の足切りとして使いやすい要素です。 選定が難しい場合は、セキュリティ要件から決めるのがおすすめです

77. ### 撤退シナリオ ツールからの撤退については、導入前から考えておくべきです。 特にデータ基盤利用者が主に使用するツールは、 様々な業務と紐づいて切替えの負担が大きいため、 どうすれば撤退可能になるかは検討すべきです。 撤退が現実的でない場合は、将来性、解決課題の重要性。 SaaSの場合は収益性などを、総合的に評価しましょう

78. ### 撤退可能な責任範囲を定義する 撤退可能にする過程で、ツールの責任範囲が自然と明確にできます。 広範囲な業務を任せすぎると撤退が困難になります。 「このツールにはここを任せる」「ここは任せない」線引きが重要です。 ツールの役割と責任範囲を明確にすることで、 過度な依存を避け、事業の独立性を保ちます。 この適切な責任境界設定こそが、 将来の技術選択の自由度を確保する重要な戦略になります

79. ### いい感じのツール見つけたら、 あとはいい感じに・・・

80. ### ならない

81. ### 導入してからが本番

82. ### 「XXXっていうサービス導入しました！」

83. ### 数カ月後、誰も利用してない

84. ### ツールを置くだけでは、誰も使わない

85. ### オンボーディングしよう

86. ### ツールのオンボーディング 利用を想定していた人たちは、恐らくすぐに使ってくれるでしょう。 潜在的な利用者はこちらからアプローチが必須になります。 • 社内向けのドキュメントの整備（必要に応じて） • 具体の課題を解決する支援 これは泥臭くやってくしかない部分なので頑張りましょう

87. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

88. ### CARTA MARKETING FIRMの ツール選定

89. ### <https://findy-tools.io/companies/cartamarketingfirm/145/36>

90. ### <https://findy-tools.io/companies/cartamarketingfirm/145/36>

91. ### 2年くらい大きく変化がない

92. ### じゃあ、何してるの？

93. ### <https://findy-tools.io/companies/cartamarketingfirm/145/36>

94. ### 事業をデータエンジニアリングしている

95. ### アジェンダ • 自己紹介 • データ基盤の価値 • 大局を知る • ツール選定の勘所 •

 CARTA MARKETING FIRMのツール選定 • 事業をデータエンジニアリングする

96. ### ツールを使われ始めても、 別の課題が出てくる

97. ### <https://www.getdbt.com/resources/reports/state-of-analytics-engineering-2024>

98. ### <https://www.getdbt.com/resources/reports/state-of-analytics-engineering-2024>

99. ### <https://speakerdeck.com/pei0804/data-engineering-for-business?slide=44>

100. ### データ基盤を事業に活用したいという取り組みは、 多くの場合「データドリブン経営」を目指す動きです。 しかし、この実現はツール導入だけでは達成できない課題です。 データドリブン経営は理念として語るのは容易ですが、 実現にはツールだけでは解けない課題解決が必要となります。 ツール導入はあくまでも第一歩に過ぎず、組織文化の変革や人材育成、 データリテラシーの向上など、より広範な取り組みを必要とします ツール導入後の真の課題

101. ### <https://www.heap.io/blog/the-four-stages-of-data-maturity>

102. ### <https://www.heap.io/blog/the-four-stages-of-data-maturity> す ご い 高 い 壁

103. ### データ成熟度の4段階 • Data-exploring ◦ データ収集はしているが活用できておらず、意思決定は直感に頼る段階。 • Data-informed ◦ データの価値を認識し始め、分析ツールやデータスタックへの投資が始まる段階。 •

 Data-driven ◦ データが意思決定の中心となり、組織全体でデータ活用が浸透する段階。 • Data-transformed ◦ データが組織のDNAとなり、すべての活動がデータに基づいて最適化される段階。

104. ### データ成熟度の4段階 • Data-exploring ◦ データ収集はしているが活用できておらず、意思決定は直感に頼る段階。 • Data-informed ◦ データの価値を認識し始め、分析ツールやデータスタックへの投資が始まる段階。 •

 Data-driven ◦ データが意思決定の中心となり、組織全体でデータ活用が浸透する段階。 • Data-transformed ◦ データが組織のDNAとなり、すべての活動がデータに基づいて最適化される段階。 ツールの力でいけるのはここまで

105. ### データ成熟度の4段階 • Data-exploring ◦ データ収集はしているが活用できておらず、意思決定は直感に頼る段階。 • Data-informed ◦ データの価値を認識し始め、分析ツールやデータスタックへの投資が始まる段階。 •

 Data-driven ◦ データが意思決定の中心となり、組織全体でデータ活用が浸透する段階。 • Data-transformed ◦ データが組織のDNAとなり、すべての活動がデータに基づいて最適化される段階。 ここからは人や組織が重要

106. ### Data-drivenへの壁：技術から人へのシフト Data-informedまではエンジニアのマンパワーとツールの力で達成可能ですが、 Data-drivenへの移行は全く異なる性質の課題です。 この段階では技術より「人」が中心課題となり、 組織文化や意思決定プロセス、個々の行動様式を変える必要があります。 最新のデータ基盤を導入しても組織の行動が 変わらなければ真のData-drivenは実現しません。 ここからの道のりは、技術的課題から組織変革へと本質が変わるのです

107. ### 実際にData-drivenへ 向かうためにやっていること

108. ### RevOpsの導入 RevOpsの考え方を経営に導入し、 部門間の壁を越えて収益最大化を 目指しています。 短期的な課題解決と 長期的なビジョンを両立させながら、 データを経営資本として活用することを 目標にデータ活用を推進中。 <https://speakerdeck.com/pei0804/path-to-revops>

109. ### 最後は人や組織の課題に向きあう

110. ### <https://speakerdeck.com/pei0804/data-engineering-for-business>

111. ### まとめ

112. ### Data-informedまでさっさと行こう。 そこには技術選定が効く

113. ### まとめ データ基盤は事業にとって必須ではないことが多いです。 なので、使われるだけでも簡単な道のりではないです。 また真に価値あるデータ基盤を構築するには、 最終的には組織設計まで視野に入れる必要があります。 ツールの力を借りれば、「Data-informed」の段階には 比較的早く到達できますが、真の「Data-driven」組織を目指すには、 技術と組織の両輪で「人」と向き合う継続的な取り組みが不可欠です

114. ### データ成熟度の4段階 • Data-exploring ◦ データ収集はしているが活用できておらず、意思決定は直感に頼る段階。 • Data-informed ◦ データの価値を認識し始め、分析ツールやデータスタックへの投資が始まる段階。 •

 Data-driven ◦ データが意思決定の中心となり、組織全体でデータ活用が浸透する段階。 • Data-transformed ◦ データが組織のDNAとなり、すべての活動がデータに基づいて最適化される段階。 これが実現できてる世界見たくないですか？

115. ### 【PR】We're hiring 【アナリティクスエンジニア】データ活用の可能性を引き出し、新たな価値創造に挑戦 <https://hrmos.co/pages/cartaholdings/jobs/cmf-e04> 【データエンジニア】データの源泉から価値創造までエンジニアリングする <https://hrmos.co/pages/cartaholdings/jobs/cmf-e05> 【リード機械学習エンジニア】低レイテンシーな機械学習システムでデータ駆動の意思決定を推進 <https://hrmos.co/pages/cartaholdings/jobs/cmf-e03> 【データサイエンティスト】20の事業を生成AIで支援するデータサイエンティスト <https://hrmos.co/pages/cartaholdings/jobs/carta-e08>

 【データエンジニア】運用型テレビCMサービスを支えるデータ分析基盤の構築・運用！ https://hrmos.co/pages/cartaholdings/jobs/telecy-e15
