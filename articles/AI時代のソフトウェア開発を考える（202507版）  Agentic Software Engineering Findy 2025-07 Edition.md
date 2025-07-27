---
title: "AI時代のソフトウェア開発を考える（2025/07版） / Agentic Software Engineering Findy 2025-07 Edition"
source: "https://speakerdeck.com/twada/agentic-software-engineering-findy-2025-07-edition"
author:
  - "Takuto Wada"
published: "2025-07-04"
created: 2025-07-27
description: |
  和田卓人氏による、AI時代のソフトウェア開発に関する考察。Vibe CodingからAgentic Codingへの移行、AIとの協業、そして変化する開発プロセスの中でソフトウェアエンジニアリングの基本がいかに重要であり続けるかを解説するプレゼンテーション。
tags:
  - "AI"
  - "ソフトウェア開発"
  - "Agentic-Coding"
  - "ソフトウェアエンジニアリング"
  - "開発生産性"
---

# AI時代のソフトウェア開発を考える（2025/07版）

これは、和田卓人（[@t_wada](https://twitter.com/t_wada)）氏による、AIがソフトウェア開発に与える影響についてのプレゼンテーションの要約です。

## 導入: プログラミングの終わりの始まり？

![Slide 1](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_0.jpg)

本プレゼンテーションは、AI時代のソフトウェア開発の現状と未来について考察します。

![Slide 2](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_1.jpg)

Tim O'Reillyの「我々が知るプログラミングの終わり」という言葉を引用し、変化の潮流を示唆します。

## Vibe Codingの到来と影響

![Slide 3](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_2.jpg)

Andrej Karpathy氏が提唱した「Vibe Coding」の概念を紹介します。

![Slide 4](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_3.jpg)

2025年、AIエージェント、特に「Vibe Coding」の台頭により、プログラミングの表層的な生産性は劇的に向上しました。開発者はAIとの対話を通じて、動作確認のみで開発を進めるスタイルが主流となり、コードレビューを省略することで開発スループットを最大化する状況が生まれています。

![Slide 5](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_4.jpg)

Claude MaxプランによるClaude Codeの定額制への移行は、開発のパラダイムを「一発で良いものを作る」から「試行回数を増やして使い倒す」へと変化させ、「統計的プログラミング（パチンコ）」とも呼べる時代を切り開きました。これにより、自律性の高いAIエージェントによる分業開発が強力になり、コストと工数が削減される一方で、コードの出力量は増大しました。

## AIによる生産性向上の代償

![Slide 6](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_5.jpg)

かつてのプログラマーのジョークが、2025年の現実となりました。

![Slide 7](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_6.jpg)

Vibe Codingに代表されるAIによる開発生産性の向上は、短期間で大規模な開発が可能になった反面、新たな問題を生み出しました。

- **技術的負債**の急速な積み上がりによる開発スループット低下
- レビュー不能なコードの増加
- **Unknown-Unknown**領域の肥大化
- **セキュリティリスク**の増大
- 内部品質への投資の価値判断の変化

![Slide 8](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_7.jpg)

生成AIの登場により、品質を維持するコスト（Cost of Quality）の分岐点が劇的に前倒しされ、数日から1ヶ月程度で品質問題が顕在化するようになりました。

## 問題の本質は変わらない

![Slide 9](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_8.jpg)

「適切に設計されていれば…」という議論は、今も昔も有効です。

![Slide 10](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_9.jpg)

直面している問題（技術的負債、レビュー、ドキュメンテーション）は、実は新しいものではありません。これらはソフトウェアエンジニアリングが常に抱えてきた課題です。AIによって問題が顕在化するスピードが速まっただけであり、プログラミングからソフトウェアエンジニアリングへと移行するタイミングが大幅に早まったと言えます。

## ソフトウェアエンジニアリングと問題解決の本質

![Slide 11](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_10.jpg)

ソフトウェアエンジニアリングと問題解決の本質に立ち返る必要があります。

![Slide 12](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_11.jpg)

「Googleのソフトウェアエンジニアリング」で語られるように、「ソフトウェアエンジニアリングは時間で積分したプログラミング」です。

![Slide 13](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_12.jpg)

これまで大企業の問題だと考えられていた課題（スタイルガイド、コードレビュー、ドキュメンテーション、テスト、リファクタリングなど）が、AI時代ではあらゆる規模の組織で短期間に発生するようになりました。

![Slide 14](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_13.jpg)

**テスト駆動開発（TDD）からの学び:**

- ソフトウェア開発は「正しい答え」と「間違った答え」を探すゲーム
- 設計に終わりはなく、自動テストとリファクタリングで支える
- 実装から設計へのフィードバックループが重要

![Slide 15](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_14.jpg)

**ドメイン駆動設計（DDD）からの学び:**

- ドメインエキスパートとの対話と共通言語（ユビキタス言語）が重要
- コードとモデル、コードとドキュメントは相互にフィードバックし合う（一方通行ではない）

![Slide 16](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_15.jpg)

**リソース効率よりフロー効率:**

- 制約理論に基づき、ボトルネックを解消しないとスループットは向上しない
- レビュー待ちのプルリクエストは「在庫」。コーディングがボトルネックでないなら、いくらコードを生産しても「在庫の山」を築くだけ
- AIエージェントによる分業開発も同様

![Slide 17](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_16.jpg)

**ビルドトラップを避ける:**

- 我々はひたすら新機能実装に熱中しがち
- 중요한 것은 Output（出力）보다 Outcome（成果）や Impact
- Outcomeに繋がらないなら、いくらOutputを増やしても意味がない

## 目指すべきは「AIとソフトウェアエンジニアリングの融合」

![Slide 18](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_17.jpg)

これからの時代に目指すべき方向性を示します。

![Slide 19](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_18.jpg)

**Vibe Coding から Agentic Coding へ**

![Slide 20](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_19.jpg)

開発のスタイルは、AIとの「協業」とAIへの「委譲」という2つのモードに分かれます。

![Slide 21](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_20.jpg)

- **AIと協業 (Traditional):** 人間が主導権を持ち、AIと対話しながら共同で開発を進める。コードを書くスピードは（委譲に比べて）遅いが、コントロールや状況把握の度合いは高い。スケールしにくい。
- **AIに委譲 (Emerging):** 自律するAIたちに任せて分業開発。コードが生成されるスピードは圧倒的に速いが、コントロールや状況把握の度合いが低く、レビューが問題となる。スケールしやすい。

![Slide 22](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_21.jpg)

「協業」と「委譲」を、設計や外部サービス利用など、どの領域でどう使い分けるかが重要になります。

![Slide 23](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_22.jpg)

- **「AIと協業」のパターン:** 壁打ち相手、補完入力、1on1、置き換えが効かない相談相手、リサーチアシスタント、批評的レビュアー、ペアプロ（オークション・コーディング）
- **「AIに委譲」のパターン:** 下請けさん、ファームウェア、コンパイラ

![Slide 24](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_23.jpg)

具体的な「AIと協業」のワークフロー例が示されています。対話による設計から始まり、TDDサイクルを回して、最終的に人間がレビューとマージを行う、という流れです。

## 自動化から自律化へ

![Slide 25](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_24.jpg)

開発のパラダイムは、自動化(Automation)から自律化(Autonomation)へとシフトします。

![Slide 26](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_25.jpg)

- **Agentic Coding**とは**Reconciliation Loop**である。望ましい状態を宣言的に定義し、評価関数を与える。エージェントはその状態に収束するように自律的に動く。
- AIは自律するが、制御・訂正もする。ハードウェア設計としてのソフトウェアエンジニアリングや技術の4点セット（バージョン管理、テスティング、自動化）の重要性がさらに増す。

![Slide 27](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_26.jpg)

求める品質特性を宣言的表現でAIに与えることが重要になります。

## 新たな時代における技術的実践

![Slide 28](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_27.jpg)

ツールやライブラリの作者は、LLM親和性を考慮する時代になりました。power-assertの例では、人間可読なフォーマットとAI可読なフォーマットの両方を出力する試みが紹介されています。

![Slide 29](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_28.jpg)

**自動テストの重要性はより高まる:**

- (2022年) 開発者に自信を与え、ソフトウェアの成長を持続可能にする。
- (2025年) **AI**に**評価基準**を与え、ソフトウェアの成長を持続可能にする。

![Slide 30](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_29.jpg)

**分散的な構成管理:**

- リポジトリに開発に関する全てを入れる。
- ドキュメントはプレーンテキストで、コードの近くに置く。
- 「AIへ委譲」は非同期分業開発。後からの追跡が重要になる。
- Gitによる変更トレーサビリティ確保 (Conventional Commits, Keep a changelog)

![Slide 31](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_30.jpg)

**MTBFからMTTRへ:**

- カオスのサルの時代から逃れられない。
- ソフトウェア開発は再び Unknown-Unknown 領域に挑もうとしている。
- Property-Based Testingやオブザーバビリティの向上で立ち向かう。

![Slide 32](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_31.jpg)

**レビュー負債削減の工夫:**

- 「Tidy First」の知見を活用する。
- 振る舞いの変更(Behavior Change)と構造の変更(Structure Change)を分ける。
- 振る舞いの変更は不可視の変更であり、しっかりレビューする。
- 構造の変更は可視の変更。ソフトウェアエンジニアリングの仕組みでレビューコストを0に近づけたい。

## 現実を見つめ、変化を乗りこなす

![Slide 33](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_32.jpg)

現実から目を逸らさずに、未来を見据えることが大切です。

![Slide 34](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_33.jpg)

- 人間は最初から正しい設計をすることはできない。
- コードを書き始め、そのとき初めて問題を理解することが多い。
- 実装から設計へのフィードバックが必ずある。
- わからないものはレビューもできない。
- システム設計とは、ある時点の合意形成的な設計から、次の時点の合意形成的な設計までの状態遷移、その意思決定の連続である。

![Slide 35](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_34.jpg)

- 「AIは知能の増幅器ではなく**増幅器**」（高岡さん）
- 「高度なAIは自分の写し鏡みたいなもので、AIから引き出せる性能は、自分の能力にそのまま比例する」（mizchiさん）
- **高度なAIは組織の写し鏡**。AIから引き出せる性能は、組織の能力に比例する。
- 腕力は外注できるが、能力は外注できない。個人と組織が共に能力を上げなければならない。

![Slide 36](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_35.jpg)

**能力向上のためにもAIを使う:**

- Outputを出すためだけでなく、自分たちの能力を上げるためにもAIを使う。
- 設計の壁打ち相手、批評的レビュアーとして、新しい言語を学ぶためにもAIを活用する。

![Slide 37](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_36.jpg)

学びにも追い風が吹いています。

![Slide 38](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_37.jpg)

**変化を乗りこなせ**

![Slide 39](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_38.jpg)

「捨てるべきか否か」という問いは、我々を思考停止に陥らせます。

![Slide 40](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_39.jpg)

- 「〜べきか否か」(whether or not)という問いの立て方は間違っている。
- 「比較検討」(compare and contrast)や「AND」で考える。
- 捨てるのではなく「両睨み」で行けば良い。
- 不確実な状況下において選択肢を狭めるのは悪手。

![Slide 41](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_40.jpg)

**アマーラの法則:**
> 我々はテクノロジーの短期的な影響を過大評価し、長期的な影響を過小評価する傾向がある。

![Slide 42](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_41.jpg)

世界は思ったよりはゆっくりと、だが確実に大きく変わります。「捨てなくていい。可能性を調べ、手を動かして評価し、変化を楽しもう」というメッセージで締めくくられています。

## まとめ

![Slide 43](https://files.speakerdeck.com/presentations/8ea3dd02d66343099e2099f5000880c6/slide_42.jpg)

- AIで時が加速したが、問題の本質、根本的課題は同じ。本質から学んだ知見が今こそ重要。
- プログラミングからソフトウェアエンジニアリングへ。Vibe CodingからAgentic Codingへ。
- リソース効率重視の「委譲」と、フロー効率重視の「協業」。状況に応じて適切なモードを選択。
- 望ましい状態を宣言的に定義し、評価関数を与え、AIが自律的に収束する仕組みが自律化には重要。
- AIから引き出せる性能は、個人と組織の能力に比例する。能力向上への投資が不可欠。
- 現実を直視する。最初から正しい設計はできない。わからないものはレビューもできない。この前提で設計プロセスを組み立てる。
- 「捨てる」のではなく「両睨み」。XORではなくAND。選択肢を広げ、可能性を調べて手を動かして評価する。
- 短期的影響を過大評価し、長期的影響を過小評価しがち。世界は思ったよりはゆっくり、だが確実に変わる。

ご清聴ありがとうございました。
