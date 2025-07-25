---
title: "AI工学特論: MLOps・継続的評価"
source: "https://speakerdeck.com/asei/aigong-xue-te-lun-mlopsji-sok-de-ping-jia"
author:
  - "[[Asei Sugiyama]]"
published: 2025-07-23
created: 2025-07-25
description: |
  トップエスイーAI工学特論の第7-8回「MLOps・継続的評価」の講義資料の要約です。本資料では、MLOpsの基本概念からその背景、技術・プロセス・文化、さらにLLMOpsやAIセーフティ、AIガバナンスといった最新のトピックまでを包括的に解説します。
tags:
  - "clippings"
  - "MLOps"
  - "LLMOps"
  - "AI Safety"
  - "AI Governance"
  - "Continuous Evaluation"
---

## 全スライド詳解

以下に、発表スライドの全107枚の内容を1枚ずつ詳細に解説します。

### Slide 1: AI工学特論: MLOps・継続的評価

![AI工学特論: MLOps・継続的評価](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_0.jpg)

> **トランスクリプト:**
> AI工学特論: MLOps・継続的評価 Asei Sugiyama

### Slide 2: 自己紹介

![自己紹介](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_1.jpg)

> **トランスクリプト:**
> 自己紹介 杉山 阿聖 (@K_Ryuichirou) Software Engineer @ Citadel AI Google Developer Expert @ Cloud AI MLSE 機械学習オペレーション WG 機械学習図鑑 共著 事例でわかる MLOps 共著

### Slide 3: TOC (目次)

![TOC (目次)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_2.jpg)

> **トランスクリプト:**
> TOC MLOps とは <- MLOps の技術・プロセス・文化 LLMOps MLOps の今後

### Slide 4: MLOps とは

![MLOps とは](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_3.jpg)

> **トランスクリプト:**
> MLOps とは MLOps の登場 MLOps に至るまで TPS DevOps MLOps

### Slide 5: MLOps の登場 (1/2)

![MLOps の登場 (1/2)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_4.jpg)

> **トランスクリプト:**
> MLOps の登場 (1/2) Google の開催したイベン ト Cloud Next 2018 で有名 になった概念 MLOps は "DevOps for ML" として導入されている

### Slide 6: MLOps の登場 (2/2)

![MLOps の登場 (2/2)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_5.jpg)

> **トランスクリプト:**
> MLOps の登場 (2/2) 機械学習パイプラインに よる自動化はトピックの ひとつ 品質や組織論などを含 む、広範な概念

### Slide 7: MLOps に至るまで

![MLOps に至るまで](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_6.jpg)

> **トランスクリプト:**
> MLOps に至るまで MLOps は DevOps (SRE) に源流がある DevOps はリーンやアジャ イルに源流がある それらの源流は TPS (トヨ タ生産方式) アジャイルとDevOpsの品質保証と信頼性 - Test Automation 図2, 図3 <https://kokotatata.hatenablog.com/entry/2020/06/01/163652>

### Slide 8: TPS (トヨタ生産方式)

![TPS (トヨタ生産方式)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_7.jpg)

> **トランスクリプト:**
> TPS (トヨタ生産方式) TPS とは TPS の目的 理想のチーム カイゼン 問題解決

### Slide 9: TPS とは

![TPS とは](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_8.jpg)

> **トランスクリプト:**
> TPS とは ムダの徹底的排除の思想 と、つくり方の合理性を 追い求め、生産全般をそ の思想で貫き、システム 化した生産方式 自働化 ジャスト・イン・タイム トヨタ生産方式 | 経営理念 | 企業情報 | トヨタ自動車株式会社 公式企業サイ ト <https://global.toyota/jp/company/vision-and-philosophy/production-> system/

### Slide 10: TPS の目的

![TPS の目的](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_9.jpg)

> **トランスクリプト:**
> TPS の目的 TPS は効率化と捉えられがち 「誰かの仕事を楽にしたい」 トヨタ春交渉2021 #3　 「トヨタ生産方式」 「カーボンニュートラル」 「SDGs」一人ひとりに 何ができるか｜トヨタイムズ - YouTube <https://youtu.be/ze0hUCMS-aI>

### Slide 11: 理想のチーム

![理想のチーム](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_10.jpg)

> **トランスクリプト:**
> 理想のチーム トヨタ鞍ヶ池記念館 ラジオラマ(4)『G1 型トラ ックの故障修理活動』 昭和１１年(１９３６)４月 春爛漫の昼下がり 職務を超えて全員でお客 様のためにできることを やっている図 FAIRLADY Z fan : トヨタ鞍ヶ池記念館に行きました。 <http://blog.livedoor.jp/fairlady3233/archives/1934986.html>

### Slide 12: カイゼン

![カイゼン](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_11.jpg)

> **トランスクリプト:**
> カイゼン 「もっといいクルマをつ くろうよ」 「1 にユーザー、2 にディ ーラー、3 にメーカー」 売れる車と言わなかった トヨタ企業サイト｜トヨタ自動車75年史｜第3部 第5章 第2節｜第1項 激動す <https://www.toyota.co.jp/jpn/company/history/75years/text/leaping_forward_a>

### Slide 13: 問題解決

![問題解決](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_12.jpg)

> **トランスクリプト:**
> 問題解決 PDCA サイクルを回すため のフレームワーク データの収集と KPI の設 定を行い、対策前後での 比較で効果測定を行う データサイエンスのフレ ームワークに等価 第5回:新作研修「問題解決研修 基礎編 ～8ステップと考え方～」は「風土 改革」 ・ 「人財育成」に直結する！ | 社員・企業研修のトヨタエンタプライズ <https://kensyu.toyota-ep.co.jp/column/4880/>

### Slide 14: 補足: なぜなぜ分析

![補足: なぜなぜ分析](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_13.jpg)

> **トランスクリプト:**
> 補足: なぜなぜ分析 根本原因分析 (なぜなぜ分析) で他 人を変えようとしてはいけない 誰が作業しても楽に正確に作業で きる状態が真因が解消された状態 個人の注意力や能力に頼っている 状態は真因が解決されていない →は論外 <https://x.com/chokyori_tsukin/status/1941637365686210862>

### Slide 15: DevOps

![DevOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_14.jpg)

> **トランスクリプト:**
> DevOps Dev vs Ops (2000 年代) Dev Ops 自動化 継続的改善

### Slide 16: Dev vs Ops (2000 年代)

![Dev vs Ops (2000 年代)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_15.jpg)

> **トランスクリプト:**
> Dev vs Ops (2000 年代) クラウドサービスが生まれ始めた 時代 (Amazon S3 は 2006 年) Dev: 顧客に新しい価値を早く提供 したい、多少不安定になるかもし れないが運用が頑張れば良い Ops: 顧客に安定的に価値を提供し たい、新機能の追加で不安定にな ることは受け入れられない 10+ Deploys Per Day: Dev and Ops Cooperation at Flickr - Slideshare <https://www.slideshare.net/jallspaw/10-deploys-per-day-dev-and-ops-cooperation-at-flickr>

### Slide 17: Dev Ops

![Dev Ops](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_16.jpg)

> **トランスクリプト:**
> Dev Ops Dev vs Ops から Dev & Ops に移行 しようという提案 (2008) 「顧客に価値をすばやく安定的に 提供しよう」という提案 この提案に基づくのが DevOps DevOps: Dev と Ops の協調 10+ Deploys Per Day: Dev and Ops Cooperation at Flickr - Slideshare <https://www.slideshare.net/jallspaw/10-deploys-per-day-dev-and-ops-cooperation-at-flickr>

### Slide 18: 自動化: IaC (Infrastructure as Code)

![自動化: IaC (Infrastructure as Code)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_17.jpg)

> **トランスクリプト:**
> 自動化: IaC (Infrastructure as Code) インフラをコードで管理 アプリケーションだけで はなく、インフラもコー ドと設定ファイルでバー ジョン管理される 自動化が進む結果、ほぼ すべてがコードと設定フ ァイルに Using Recommendations for Infrastructure as Code <https://cloud.google.com/recommender/docs/tutorial-iac>

### Slide 19: 自動化: CI/CD

![自動化: CI/CD](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_18.jpg)

> **トランスクリプト:**
> 自動化: CI/CD CI (Continuous Integration) コードをリポジトリに頻 繁にコミットする手法 CD (Continuous Deployment) 自動化によりサービスを 更新しデプロイする手法 GitHub Actions を使った継続的デプロイについて - GitHub Docs <https://docs.github.com/ja/actions/about-github-actions/about-continuous-> deployment-with-github-actions Google Cloud 上での DevOps と CI / CD について | Google Cloud 公式ブロ グ <https://cloud.google.com/blog/ja/topics/developers-practitioners/devops-> and-cicd-google-cloud-explained?hl=ja

### Slide 20: 継続的な改善

![継続的な改善](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_19.jpg)

> **トランスクリプト:**
> 継続的な改善 フィードバッ クサイクルに よる改善 単一のチーム で開発と運用 を行う Explore Continuous Improvement - Training | Microsoft Learn <https://learn.microsoft.com/en-> us/training/modules/characterize-devops- continous-collaboration-improvement/3-explore- continuous-improvement

### Slide 21: MLOps

![MLOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_20.jpg)

> **トランスクリプト:**
> MLOps 機械学習システムの開発における課題 MLOps CT (継続的学習)

### Slide 22: 機械学習システムの開発における課題

![機械学習システムの開発における課題](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_21.jpg)

> **トランスクリプト:**
> 機械学習システムの開 発における課題 前処理が難しい モデルの更新などの運用 が煩雑 機械学習チームの悲劇 西田 佳史, 遠藤 侑介, 有賀 康顕 著 「n 月刊ラムダノート Vol.1, No.1(2019)」 ラムダノート株式会社 2019年 <https://eiyo21.com/book/9784789554596/>

### Slide 23: 機械学習チームの悲劇

![機械学習チームの悲劇](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_22.jpg)

> **トランスクリプト:**
> 機械学習チームの悲劇 機械学習専門のチームが誕生 機械学習モデルを作成し、PoC で成果を確認 モデルをプロダクトに組み込むためのタスクが作成される モデルをプロダクトに組み込む作業の見積もりが大きくなる 典型的な機能開発のほうが小さな見積もりになり、優先度が上がる プロダクトに組み込まれないため機械学習専門のチームの成果が出 ない 投資対象を見直すことになりチーム解散

### Slide 24: MLOps

![MLOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_23.jpg)

> **トランスクリプト:**
> MLOps 機械学習の成果をスケールさせる ためのさまざまな取り組み そもそも AI は育てるもの (という お題目で PoC を乗り切った方々も 多いはず) AI を育てる活動 (Waymo など)

### Slide 25: CT (継続的な訓練)

![CT (継続的な訓練)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_24.jpg)

> **トランスクリプト:**
> CT (継続的な 訓練) MLOps にお ける継続的な 改善の実装 モデルを継続 的に訓練して 改善 MLOps: Continuous delivery and automation pipelines in machine learning | Cloud Architecture Center | Google Cloud <https://cloud.google.com/architecture/mlops-> continuous-delivery-and-automation-pipelines-in- machine-learning

### Slide 26: 組織における活用: Amazon Flywheel

![組織における活用: Amazon Flywheel](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_25.jpg)

> **トランスクリプト:**
> 組織における活用: Amazon Flywheel Amazon の成長を支える経 営戦略 サービスにおけるリコメ ンドの重要性も同時に示 している 5 Lakh Amazon sellers... and counting | Seller Blog <https://sell.amazon.in/mr/seller-blog/5-lakh-amazon-sellers-and-counting>? mons_sel_locale=mr_IN

### Slide 27: How Google does machine learning

![How Google does machine learning](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_26.jpg)

> **トランスクリプト:**
> How Google does machine learning 各フェーズを掘り下げる (How Google Does Machine Learning 日本語版) - Coursera <https://coursera.org/share/faf9215a37a5a12c0e3653225f7020d6>

### Slide 28: 機械学習までのステップ

![機械学習までのステップ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_27.jpg)

> **トランスクリプト:**
> 機械学習までの ステップ 1. 小さく始める 2. 標準化 3. システム化 4. データ分析 5. 機械学習 機械学習とビジネス プロセス (How Google Does Machine Learning 日本語版) - Coursera <https://www.coursera.org/learn/google-machine-learning-> jp/lecture/G8qKf/ji-jie-xue-xi-tobizinesu-purosesu

### Slide 29: Amazon も最初からうまくはいかなかった

![Amazon も最初からうまくはいかなかった](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_28.jpg)

> **トランスクリプト:**
> Amazon も最初からうまくはいかなかった Ron Kohavi, Diane Tang, Ya Xu 著 大杉　直也 訳 「A/Bテスト実践ガイド 真のデータドリブンへ至る信用できる実験とは」 KADOKAWA 2021年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 30: まとめ

![まとめ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_29.jpg)

> **トランスクリプト:**
> まとめ MLOps は機械学習の成果をスケールさせるためのさまざまな取り 組み MLOps は DevOps を ML に拡張したものであり、源流は TPS TPS は仕事を楽にすることが重要であり、データに基づいて PDCA サイクルを回すことでカイゼンを実施している DevOps はすばやい開発とフィードバックによる継続的な改善が重 要であり、そのために CI/CD パイプラインを構築し自動化している MLOps はフィードバックループを継続的な訓練により実現してお り、そのために機械学習パイプラインを構築し自動化している

### Slide 31: TOC

![TOC](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_30.jpg)

> **トランスクリプト:**
> TOC MLOps とは MLOps の技術・プロセス・文化 <- LLMOps MLOps の今後

### Slide 32: MLOps の技術・プロセス・文化

![MLOps の技術・プロセス・文化](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_31.jpg)

> **トランスクリプト:**
> MLOps の技術・プロセス・文化 Your system is your system 事例でわかる MLOps 技術 プロセス 文化 まとめ

### Slide 33: Your System is Your System

![Your System is Your System](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_32.jpg)

> **トランスクリプト:**
> Your System is Your System 機械学習の活用や生じる課題の背景はさまざまに異なる 具体的なベストプラクティスはそのまま自組織には適用できない Google のシニアエンジニア曰く「ベストプラクティスを俺に聞く な、お前のシステムのことはお前のほうがよく知っている」 一般的な原則 + 理解するための事例が重要

### Slide 34: 事例でわかる MLOps 技術・プロセス・文化

![事例でわかる MLOps 技術・プロセス・文化](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_33.jpg)

> **トランスクリプト:**
> 事例でわかる MLOps 技術・プロセス・文化 活用フェーズごとに整理 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 35: 技術

![技術](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_34.jpg)

> **トランスクリプト:**
> 技術 機械学習パイプライン 推論システム 技術選定 実行環境とアクセラレーター モニタリング データの品質管理 コードの品質管理

### Slide 36: 機械学習パイプライン

![機械学習パイプライン](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_35.jpg)

> **トランスクリプト:**
> 機械学習パイプライン Akshay Naresh Modi and Chiu Yuen Koo and Chuan Yu Foo and Clemens Mewald and Denis M. Baylor and Eric Breck and Heng-Tze Cheng and Jarek Wilkiewicz and Levent Koc and Lukasz Lew and Martin A. Zinkevich and Martin Wicke and Mustafa Ispir and Neoklis Polyzotis and Noah Fiedel and Salem Elie Haykal and Steven Whang and Sudip Roy and Sukriti Ramesh and Vihan Jain and Xin Zhang and Zakaria Haque TFX: A TensorFlow-Based Production- Scale Machine Learning Platform, KDD 2017 (2017) <https://research.google/pubs/tfx-a-tensorflow-based-production-scale-machine-learning-platform/>

### Slide 37: 推論システム

![推論システム](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_36.jpg)

> **トランスクリプト:**
> 推論システム 訓練済みの機械学習モデ ルを用いて推論する 訓練時とは異なり、一般 的に高い可用性が必要 バッチ推論が第一選択 リアルタイム推論は技術 的な難易度が高くなる 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 38: 事例. DeNA

![事例. DeNA](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_37.jpg)

> **トランスクリプト:**
> 事例. DeNA バッチ推論 (図 4.3) リアルタイム推論 (図 4.5) 技術的には上のほうが実 現しやすい リアルタイム推論のほう が実現できる価値が高い ことがわかった場合に実 装を選択 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 39: 事例. CAM

![事例. CAM](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_38.jpg)

> **トランスクリプト:**
> 事例. CAM マネージド・ サービスで機 械学習基盤を 構築した例 メンバー 2 名 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわか るMLOps 機械学習の成果をスケールさせる処方 箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 40: 技術選定

![技術選定](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_39.jpg)

> **トランスクリプト:**
> 技術選定 アーキテクチャの選択は 重大な決断 さまざまな観点で検討 GPU などのハードウェア 利用する技術に対する経 験の深さ (組織内・外) 実現すべき価値 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 41: 実行環境とアクセラレーター

![実行環境とアクセラレーター](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_40.jpg)

> **トランスクリプト:**
> 実行環境とアクセラレーター 機械学習モデルによっては 訓練・推論時に GPU などの アクセラレーターが必要 利用すると、スループットや レイテンシーを大きく改善 できる可能性がある 利用のために追加で必要に なるプロセスには注意 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をス ケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 42: 事例. チャットボット

![事例. チャットボット](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_41.jpg)

> **トランスクリプト:**
> 事例. チャットボット 大規模な訓練・推論環境 低いレイテンシーの実現 短期間での開発 推論に Inferentia を採用 し、規模と低いレイテン シーを実現 それ以外は慣れた技術を 用いて短期間で開発 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 43: モニタリング

![モニタリング](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_42.jpg)

> **トランスクリプト:**
> モニタリング エラーが発生しないまま 振る舞いが異常になるケ ースがある 連絡ミスのような単純な 原因がほとんど 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html> Daniel Papasian and Todd Underwood, How ML Breaks: A Decade of Outages for One Large ML Pipeline, USENIX Association 2020 <https://www.usenix.org/conference/opml20/presentation/papasian>

### Slide 44: データの品質管理

![データの品質管理](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_43.jpg)

> **トランスクリプト:**
> データの品質管理 バイアスはデータの収集 過程においても生じる 与信審査では融資した人 だけを対象としてはダメ アノテーションは高度に 専門的な作業で労力がか かる 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html> Too Good to Be True: Bots and Bad Data From Mechanical Turk - Margaret A. Webb, June P. Tangney, 2022 <https://journals.sagepub.com/doi/10.1177/17456916221120027>

### Slide 45: 事例. GO 株式会社

![事例. GO 株式会社](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_44.jpg)

> **トランスクリプト:**
> 事例. GO 株式会社 DRIVE CHART におけるデータ の品質管理の取り組み エッジデバイスで生じる大量 のデータから、レアなイベン トのデータをピックアップ クラウドへの通信量を抑える 取り組みも 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をスケ ールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 46: コードの品質管理

![コードの品質管理](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_45.jpg)

> **トランスクリプト:**
> コードの品質管理 異なるロールのメンバー が単一のコードベースで 協業するのは困難 ノートブックの利用、環 境構築の再現性、暗黙的 なノウハウで課題が発生 ロールごと別環境もアリ 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html> たった3人で運用するド コモを支える機械学習基盤の作り方 ー Kubernates × Airflow × DataRobot を使ったMLOpsパイプライン ー - ENGINEERING BLOG ドコモ開発者ブログ <https://nttdocomo-developers.jp/entry/202212191200_2>

### Slide 47: プロセス

![プロセス](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_46.jpg)

> **トランスクリプト:**
> プロセス 導入フローとPoC 素早い実験を繰り返す 多様な利害関係者との協業 ビジネスの意思決定に役立つモニタリング

### Slide 48: 導入フローと PoC

![導入フローと PoC](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_47.jpg)

> **トランスクリプト:**
> 導入フローと PoC 機械学習プロジェクトは 不確実性への対応が重要 目標を明確にし、小規模 な取り組みから慎重に規 模を大きくしていく 求められる品質が徐々に 上がることにも注意 Barry W. Boehm, Software Engineering Economics, Prentice Hall, 1981 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 49: 事例. AWS ML Enablement Workshop

![事例. AWS ML Enablement Workshop](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_48.jpg)

> **トランスクリプト:**
> 事例. AWS ML Enablement Workshop データサイエンスの活用 機会を創出するためのワ ークショップ 短期間で成果を確認する ための方法論 GitHub で公開されている GitHub - aws-samples/aws-ml-enablement-workshop: 組織横断的にチーム を組成し、機械学習による成長サイクルを実現する計画を立てるワークショ ップ <https://github.com/aws-samples/aws-ml-enablement-workshop>

### Slide 50: 素早い実験を繰り返す

![素早い実験を繰り返す](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_49.jpg)

> **トランスクリプト:**
> 素早い実験を繰り返す 市場や顧客のニーズは変 わり続ける 常に実験を行い成果の確 認が必要 実験をデザインし、正し く効果測定を行う 実験しやすい環境を整備 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 51: 多様な利害関係者との協業

![多様な利害関係者との協業](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_50.jpg)

> **トランスクリプト:**
> 多様な利害関係者との協業 機械学習システムの利害関係 者は多岐にわたる チーム内だけではなく、経営 層や PdM、法務・知財関係者 などと適切なコミュニケーシ ョンが必要 期待値コントロールの失敗な ど、落とし穴もある 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をスケ ールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 52: ビジネスの意思決定に役立つモニタリング

![ビジネスの意思決定に役立つモニタリング](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_51.jpg)

> **トランスクリプト:**
> ビジネスの意思決定に役立 つモニタリング 一般に、入力されるデー タや期待される出力が時 間とともに変わる モデルの精度の推移の監 視が必要 精度向上が KPI を向上さ せるかの確認も必要 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 53: 事例. コネヒト株式会社

![事例. コネヒト株式会社](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_52.jpg)

> **トランスクリプト:**
> 事例. コネヒト株式会社 ML Test Score を用いて機 械学習システムのアセス メントを行った例 実験環境を整備しダッシ ュボードを作成 2 回評価を行い、改善箇所 の検討と改善効果の可視 化を行っている 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 54: 文化

![文化](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_53.jpg)

> **トランスクリプト:**
> 文化 成果を出しやすい組織と 出しにくい組織がある 成果を出しやすくなる要 因は不明 規模や設立からの期間、 業種は支配的ではない イノベーションへの投 資、学習する文化は重要 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 55: 事例. 日本経済新聞社

![事例. 日本経済新聞社](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_54.jpg)

> **トランスクリプト:**
> 事例. 日本経済新聞社 日経イノベーションラボとい う研究開発部署 作業負荷の軽減や新たな顧客 体験の創出のため 将来的な課題を見据えて、新 技術に関する課題を整理し、 先んじて検証 組織的な LLM 活用を後押し 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をスケ ールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 56: 事例. サントリー

![事例. サントリー](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_55.jpg)

> **トランスクリプト:**
> 事例. サントリー 生成 AI を社内で活用して いる事例 実践により活用のための 知見を得ていった 従来型の機械学習プロジ ェクトも数多く推進 データの品質向上が精度 向上につながった 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果 をスケールさせる処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 57: 事例でわかる MLOps: はじめに

![事例でわかる MLOps: はじめに](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_56.jpg)

> **トランスクリプト:**
> 事例でわかる MLOps: はじめに もしあなたが自分の経験に自信がないにもか かわらず機械学習システムに関わらなければ いけなくなったのなら、たとえばシステム開 発に詳しくないのに開発に携わらなければい けないデータサイエンティストであったり、 機械学習に詳しくないソフトウェアエンジニ アであったりするのなら、あなたは本書が想 定する読者の一人です。 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をスケールさせ る処方箋」 講談社 2024 年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 58: まとめ

![まとめ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_57.jpg)

> **トランスクリプト:**
> まとめ 機械学習システムの置かれた状況は組織ごとに大きく異なり、 MLOps のそれぞれの原則を理解して適用する必要がある MLOps の取り組みを技術・プロセス・文化で整理した 技術面はある程度パターンが見えてきたものの、レイテンシーなど の要件で技術的な複雑さが大きく変わる点に注意が必要 プロセスにおいては複雑性に対する取り組みが重要、小さく始めて 徐々に進めること、幅広い利害関係者との協業が必要なことに注意 文化面は無視できないものの、企業の規模や業種は無関係、学習す る文化は大事

### Slide 59: TOC

![TOC](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_58.jpg)

> **トランスクリプト:**
> TOC MLOps とは MLOps の技術・プロセス・文化 LLMOps MLOps の今後 <-

### Slide 60: LLMOps

![LLMOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_59.jpg)

> **トランスクリプト:**
> LLMOps 2 つのLLMOps 市場調査: NEDO AI セーフティ強化に関する研究開発プロジェクト 継続的評価による継続的改善 AI セーフティ AI ガバナンス

### Slide 61: 2 つのLLMOps

![2 つのLLMOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_60.jpg)

> **トランスクリプト:**
> 2 つのLLMOps MLOps に基づく LLMOps 評価を中心とした LLMOps

### Slide 62: MLOps に基づく LLMOps

![MLOps に基づく LLMOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_61.jpg)

> **トランスクリプト:**
> MLOps に基づく LLMOps LLM の出現時に LLMOps というドキュメントが出 現した MLOps のプラクティスを LLM に適用するもの 継続的訓練を前提とした 改善フィードバック LLMOps: What it is and how it works | Google Cloud <https://cloud.google.com/discover/what-is-llmops?hl=en>

### Slide 63: MLOps に基づく LLMOps の問題点

![MLOps に基づく LLMOps の問題点](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_62.jpg)

> **トランスクリプト:**
> MLOps に基づく LLMOps の問題点 LLM を対象とした継続的な訓練の目的は次の2つ i. 継続事前学習によるドメイン知識の獲得 ii. 小規模モデルの訓練 (蒸留) によるコスト・レイテンシーの低減 継続事前学習によるドメイン知識の獲得はまだ研究開発段階 蒸留は有望な手段であるものの、フィードバックに基づく改善とは 目的が異なる 解決したい課題を明確にしないままに MLOps をベースに定義して しまった

### Slide 64: 評価に基づく LLMOps

![評価に基づく LLMOps](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_63.jpg)

> **トランスクリプト:**
> 評価に基づく LLMOps 最近の潮流 不確実性の高い分野に対 する開発のノウハウ集 MLOps というよりは「高 速 DevOps」 How to Solve the #1 Blocker for Getting AI Agents in Production | LangChain Interrupt <https://interrupt.langchain.com/videos/building-reliable-agents-> agent-evaluations

### Slide 65: Eval-Centric AI

![Eval-Centric AI](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_64.jpg)

> **トランスクリプト:**
> Eval-Centric AI

### Slide 66: AI セーフティ強化に関する研究 開発プロジェクト

![AI セーフティ強化に関する研究 開発プロジェクト](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_65.jpg)

> **トランスクリプト:**
> AI セーフティ強化に関する研究 開発プロジェクト Citadel AI で「企業向け実装解 説」としてベストプラクティ ス集・事例集の作成を担当 「デモは簡単にできるものの サービス化や本番化は難しい」 というテーマでヒアリング 似たような課題・対策を行っ ていることが見えてきた

### Slide 67: LLMOps の取り組み

![LLMOps の取り組み](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_66.jpg)

> **トランスクリプト:**
> LLMOps の取り組み 継続的評価による継続的改善 AI セーフティ AI ガバナンス

### Slide 68: 継続的評価による継続的改善

![継続的評価による継続的改善](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_67.jpg)

> **トランスクリプト:**
> 継続的評価による継続的改善 評価は難しい Criteria Drift プロンプトエンジニアリング LLM-as-a-Judge 継続的な評価による継続的な改善 ハッカソン Agent トレース

### Slide 69: 評価は難しい

![評価は難しい](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_68.jpg)

> **トランスクリプト:**
> 評価は難しい システムの正しい振る舞 いを、誰も明確に記述で きない 品質評価の観点を事前に 列挙することは困難で、 出力から事後的に得られ ることが大半 機械学習による言語パフォーマンスの評価 - Speaker Deck <https://speakerdeck.com/langstat/ji-jie-xue-xi-niyoruyan-yu-> pahuomansunoping-jia

### Slide 70: Criteria Drift

![Criteria Drift](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_69.jpg)

> **トランスクリプト:**
> Criteria Drift Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences LLM の出力に対する評価基準 が、評価を進めるにつれてユ ーザー自身によって変化また は洗練されていく [2404.12272] Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences <https://arxiv.org/abs/2404.12272>

### Slide 71: 発想の逆転: 高速プロトタイピング

![発想の逆転: 高速プロトタイピング](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_70.jpg)

> **トランスクリプト:**
> 発想の逆転: 高速プロトタイ ピング 専門家も自分の行ってい ること・やりたいことを 明確にできない 評価を繰り返すことで専 門家の知識を明文化する 手戻りを恐れるのではな くイテレーションを高速に回し、その過程で専門家の暗黙知をプロンプトなどの形で形式知化していくアプローチが有効です。

### Slide 72: プロンプトエンジニアリング

![プロンプトエンジニアリング](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_71.jpg)

> **トランスクリプト:**
> プロンプトエンジニアリング 入力文章を調整して、言語モ デルを効率的に使おうとする 手法群 指示文を人が見たときにわか りやすくなるよう、明確に記 述することが基本 Gemini の記事が参考になる Gemini から欲しい回答を引き出すプロンプト術｜Gemini - Google の AI <https://note.com/google_gemini/n/n60a9c426694e>

### Slide 73: LLM-as-a-Judge

![LLM-as-a-Judge](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_72.jpg)

> **トランスクリプト:**
> LLM-as-a-Judge プロンプトを用いて LLM に出力の良さを評価させ る手法 新たな評価観点が得られ た場合、その評価観点に 基づく評価方法の手順書 を書くと、その観点に基 づく評価が LLM で可能 LLMによるLLMの評価「LLM-as-a-Judge」入門〜基礎から運用まで徹底解 説 <https://zenn.dev/pharmax/articles/2d07bf0498e212>

### Slide 74: LLM-as-a-Judge のためのプロンプトの例

![LLM-as-a-Judge のためのプロンプトの例](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_73.jpg)

> **トランスクリプト:**
> LLM-as-a-Judge のための プロンプトの例 新 NISA に関する問い合わ せへの回答評価デモ カットオフを考慮し、そ れ以降の制度との差分を 記述 検出したい適切ではない 回答の例を記述

### Slide 75: 継続的な評価による継続的な改善

![継続的な評価による継続的な改善](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_74.jpg)

> **トランスクリプト:**
> 継続的な評価による継続的な改善

### Slide 76: ハッカソン: デジタル庁

![ハッカソン: デジタル庁](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_75.jpg)

> **トランスクリプト:**
> ハッカソン: デジタル庁 ハッカソンは専門家を巻 き込むために有効 ハッカソンにより「5時間 という短い開発時間の中 で、38個のプロトタイプ」 ハッカソンの成果物を OSS として公開 第三弾： 「法令」×「デジタル」ハッカソンを開催しました｜デジタル庁 <https://www.digital.go.jp/news/9fb5ef8e-c631-4974-96d9-0b145304c553> 法令 Deep Research ツール Lawsy を OSS として公開しました｜Tatsuya Shirakawa <https://note.com/tatsuyashirakawa/n/nbda706503902>

### Slide 77: Agent

![Agent](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_76.jpg)

> **トランスクリプト:**
> Agent チューニングにより「1つ のこと(ドメイン)をうまく やる」ものができる 各ドメインを協調させる 取り組みがエージェント Microservices Architecture の再発見 メルカリにおけるデータアナリティクス AI エージェント「Socrates」と ADK 活用事例 <https://speakerdeck.com/na0/merukariniokerudetaanariteikusu-ai-eziento-> socrates-to-adk-huo-yong-shi-li

### Slide 78: トレース

![トレース](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_77.jpg)

> **トランスクリプト:**
> トレース Agent はさまざまなシステムを組 み合わせて使うため、望ましくな い結果が得られたときにその原因 追及が困難 最終結果を生成するまでの途中で 何が起きているのかを記録し、分 析できるようにする LangSmith や Langfuse は Trace 機 能を実装している LangSmithによるLLMアプリケーションのトレーシング入門 <https://zenn.dev/pharmax/articles/61edc477e4de17>

### Slide 79: AI セーフティ

![AI セーフティ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_78.jpg)

> **トランスクリプト:**
> AI セーフティ AI セーフティとは 実践 AI セーフティ リスクと効果を考慮し小さく始める リスクに対策する 独自のデータを定義し評価データを育てる 専門家を開発チームの一員にする 本番環境でテストする

### Slide 80: AI セーフティとは

![AI セーフティとは](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_79.jpg)

> **トランスクリプト:**
> AI セーフティとは 定義自体の議論が進行中 AI 事業者ガイドラインで は「安全性」を定義 AISI UK の Research Agenda では 6 種類のリス クを定義 Research Agenda <https://www.aisi.gov.uk/research-agenda>

### Slide 81: AI セーフティに関する評価観点ガイド

![AI セーフティに関する評価観点ガイド](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_80.jpg)

> **トランスクリプト:**
> AI セーフティに関する評価観点ガイド AIセーフティに関する評価観点ガイドの公開 - AISI Japan <https://aisi.go.jp/output/output_information/240918_2/>

### Slide 82: 実践 AI セーフティ

![実践 AI セーフティ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_81.jpg)

> **トランスクリプト:**
> 実践 AI セーフティ リスクマネジメントの手法を応用 1. ユースケースを列挙 2. ユースケースごとにリスクを分析 3. ユースケースごとに対応 (回避・低減・移転・受容) を決定 4. 安全だと判断できるユースケースに限ってサービスを提供 5. サービスの利用状況をモニタリング

### Slide 83: 補足: ISO 42001

![補足: ISO 42001](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_82.jpg)

> **トランスクリプト:**
> 補足: ISO 42001 国際規格「AIマネジメントシ ステム（ISO/IEC 42001） 」が 発行 (2023年) 既存の情報セキュリティシス テムのマネジメントシステム をAIに拡張 Microsoft (Microsoft 365 Copilot), Google Cloud は認証 を取得 AIマネジメントシステムの国際規格が発行されました （METI/経済産業省） <https://www.meti.go.jp/press/2023/01/20240115001/20240115001.html>

### Slide 84: 事例: PharmaX (YOJO)

![事例: PharmaX (YOJO)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_83.jpg)

> **トランスクリプト:**
> 事例: PharmaX (YOJO) LINE でユーザーが OTC 薬 を購入できるオンライン 薬局 問い合わせをルールと LLM で分類 ワークフローで安全に対 応できるユースケースのみ を対応 AIエージェントの継続的改善のためオブザーバビリティ <https://speakerdeck.com/pharma_x_tech/aiezientonoji-sok-de-gai-shan-> notameobuzababiritei

### Slide 85: リスクと効果を考慮し小さく始める

![リスクと効果を考慮し小さく始める](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_84.jpg)

> **トランスクリプト:**
> リスクと効果を考慮し小さく始める ユースケースを安全性と効果の2軸で分類 安全性: サービス提供、人にフォールバック、対応不可 効果: システム化が進んでいない、人の経験や勘に頼ってい る、などで判断 安全かつ効果の高いユースケースを特定し推進する ユースケースを特定し、ホワイトリスト形式で安全なユースケース のみサービス提供

### Slide 86: リスクに対策する

![リスクに対策する](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_85.jpg)

> **トランスクリプト:**
> リスクに対策する エンドユーザー向けではなく、社内の専門家向けにサービス提供 出力結果を直接提供することを禁止し、一度人手で編集して提供 第三者に社内情報が漏洩しないように、オプトアウト リスクを特定して徹底的に検証し、小規模にリリース セキュリティや監査に堪え、安全に使える環境を用意して展開 全面的には利用を禁止し、小規模にパイロットとして導入しテスト ガイドラインやチェックリストを用意し、安全な利用方法を推進

### Slide 87: 独自のデータを定義し評価 データを育てる

![独自のデータを定義し評価 データを育てる](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_86.jpg)

> **トランスクリプト:**
> 独自のデータを定義し評価 データを育てる 「自分の業務」というベ ンチマークはない 生成 AI に対するユニット テストのように扱う 専門家によるレビュー結 果を評価データに追加す る AIエージェントの継続的改善のためオブザーバビリティ <https://speakerdeck.com/pharma_x_tech/aiezientonoji-sok-de-gai-shan-> notameobuzababiritei

### Slide 88: 事例: ダイキン工業

![事例: ダイキン工業](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_87.jpg)

> **トランスクリプト:**
> 事例: ダイキン工業 独自のマルチモーダルデ ータセットを構築 インターネット上には存 在しないデータを用い て、自社の業務知識を持 つモデルを作成 ダイキンがサービス支援AIを内製、活用進めた4度の「偶然の出会い」 | 日 経クロステック（xTECH） <https://xtech.nikkei.com/atcl/nxt/column/18/00001/10313/>

### Slide 89: 専門家を開発チームの一員 にする

![専門家を開発チームの一員 にする](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_88.jpg)

> **トランスクリプト:**
> 専門家を開発チームの一員 にする 専門家によるレビューや 議論の結果をプロンプト に反映 専門家もいきなりは自分 のノウハウを言語化でき ないので、イテレーショ ンを回して徐々に言語化 AIエージェントの地上戦 〜開発計画と運用実践 / 2025/04/08 Findy ランチ セッション #19 - Speaker Deck <https://speakerdeck.com/smiyawaki0820/08-findy-w-and-> bmitoatupu-number-19

### Slide 90: 本番環境でテストする

![本番環境でテストする](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_89.jpg)

> **トランスクリプト:**
> 本番環境でテストする どうしても「やってみな いとわからない」 限定的にリリースして想 定外の事象が発生しない か確認する モニタリングでリスクと 効果を確認 ペアーズにおける評価ドリブンな AI Agent 開発のご紹介 <https://speakerdeck.com/fukubaka0825/heasuniokeruping-jia-torihunna-ai-> agent-kai-fa-nokoshao-jie

### Slide 91: AI ガバナンス

![AI ガバナンス](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_90.jpg)

> **トランスクリプト:**
> AI ガバナンス AI ガバナンスとは 典型的な AI ガバナンスの取り組み AI ガバナンスを推進するうえでの課題 提供価値の最大化 学習する組織

### Slide 92: AI ガバナンス

![AI ガバナンス](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_91.jpg)

> **トランスクリプト:**
> AI ガバナンス リスク管理 + 提供価値の最大化 アジャイルガバナンス: 組織として 学習し続けることを求める A/Bテストを通じた提供価値の改 善を組織として行えるようにする ことは、AIガバナンスの一部 AI事業者ガイドライン（METI/経済産業省） <https://www.meti.go.jp/shingikai/mono_info_service/ai_shakai_jisso/20240419_report.html>

### Slide 93: 参考: AI 事業者ガイドラインにおけるAIガバナンス

![参考: AI 事業者ガイドラインにおけるAIガバナンス](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_92.jpg)

> **トランスクリプト:**
> 参考: AI 事業者ガイドラインにおけるAIガバナンス AI の利活用によって生じるリスクをステークホルダーにとって受 容可能な水準で管理しつつ、そこからもたらされる正のインパク ト（便益）を最大化することを目的とする、ステークホルダーに よる技術的、組織的、及び社会的システムの設計並びに運用。 リスクマネジメントに関するISO 標準 (ISO 31000:2018)でもアジャ イルの考え方を取り入れている AI事業者ガイドライン（METI/経済産業省）<https://www.meti.go.jp/shingikai/mono_info_service/ai_shakai_jisso/20240419_report.html>

### Slide 94: 責任あるAIへの取組み (LINEヤフー)

![責任あるAIへの取組み (LINEヤフー)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_93.jpg)

> **トランスクリプト:**
> 責任あるAIへの取組み (LINEヤフー)

### Slide 95: AI ガバナンスを推進するうえでの課題

![AI ガバナンスを推進するうえでの課題](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_94.jpg)

> **トランスクリプト:**
> AI ガバナンスを推進するうえでの課題 組織的な学習に課題 AI は変化が激しいので、AI ガバナンスの専門チームは全方位に目を 配って変化への追随を頑張ってやっている 状況の変化に合わせてルールやガイドラインを改定するものの、社 内の全チームがそれを読んでくれるわけではないし、守ってくれる わけではない リスク評価を行う専門組織は「状況に合わせて対応を変えるのでア ジャイルにやっている」と主張する

### Slide 96: 提供価値の最大化

![提供価値の最大化](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_95.jpg)

> **トランスクリプト:**
> 提供価値の最大化 AI ガバナンス: リスク管理 + 提供価値の最大化 + 組織的な学習 AI ガバナンスは「リスク管理を行う面倒くさいもの」となってしま うのがバッドパターン AI ガバナンスの専門部署は AI の活用方法に組織内でもっとも詳し い部署なので、活用方法に関する情報提供を行うのが望ましい 各業務の専門家に寄り添った対応が必要

### Slide 97: 学習する組織

![学習する組織](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_96.jpg)

> **トランスクリプト:**
> 学習する組織 AI ガバナンスがうまくいっている 組織ではチームトポロジーにおけ る「イネイブリングチーム」と似 た振る舞いをしている リスクに対する感度を高める組織 文化も重要 マシュー・スケルトン, マニュエル・パイス 著 原田　騎郎, 永瀬　美穂, 吉羽　龍太郎 訳 「チームトポロジー」日本能率協会マネジメントセンター 2021年

### Slide 98: まとめ

![まとめ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_97.jpg)

> **トランスクリプト:**
> まとめ LLM の活用においては Eval-Centric (評価中心) な方法論が必要 専門家も自分の知識を明文化できないという前提に立って、継続的 な評価を通じた高速プロトタイピングを継続的に行う AI セーフティにおいては、ユースケースごとのリスク評価とリスク 対策が鍵、次々に新たなユースケースが現れるので継続的なモニタ リングも必要 AI ガバナンスにおいてはリスクマネジメントだけではなく、提供価 値の最大化を行ったうえで、学習する組織の構築が必要、このため に現場に寄り添った対応が望ましい

### Slide 99: TOC

![TOC](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_98.jpg)

> **トランスクリプト:**
> TOC MLOps とは MLOps の技術・プロセス・文化 LLMOps MLOps の今後 <-

### Slide 100: MLOps として取り組むべき課題

![MLOps として取り組むべき課題](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_99.jpg)

> **トランスクリプト:**
> MLOps として取り組むべき課題 機械学習・AI の分野は進歩が早いため最新の状況への追従が必要 次の 4 つは早急に対応が必要 1. 教育 2. マルチモーダル 3. 法制度・標準への対応 4. 研究者・開発者・利用者の交流

### Slide 101: 教育

![教育](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_100.jpg)

> **トランスクリプト:**
> 教育 MLOps は複雑化した結果、新規に 取り組むには難しくなりすぎた すでにあるプロダクトや OSS の存 在を知らず、再開発を行う事例が 出てきた 書籍やコミュニティが役立つこと を期待 杉山 阿聖, 太田 満久, 久井 裕貴 編著 「事例でわかるMLOps 機械学習の成果をスケールさせ る処方箋」 講談社 2024年 <https://www.kspub.co.jp/book/detail/5369562.html>

### Slide 102: マルチモーダル (1/2)

![マルチモーダル (1/2)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_101.jpg)

> **トランスクリプト:**
> マルチモーダル (1/2) マニュアルにあり がちな画像＋文章 の活用はニーズが 高い 画像と文章の組み 合わせにより危険 になる場合がある 研究が進行中 Multimodal Situational Safety <https://mssbench.github.io/>

### Slide 103: マルチモーダル (2/2)

![マルチモーダル (2/2)](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_102.jpg)

> **トランスクリプト:**
> マルチモーダル (2/2) ビジュアライズさ れたドキュメント は利用が難しい 評価用のデータセ ットの構築など、 研究が進行中 GitHub - mizuumi/JDocQA <https://github.com/mizuumi/JDocQA>

### Slide 104: 法制度・標準への対応

![法制度・標準への対応](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_103.jpg)

> **トランスクリプト:**
> 法制度・標準への対応 2024 年 8 月に AI Act が EU で交付 「ブリュッセル効果」の大きさは 不明確 AISI (UK) の Research Agenda では AI セキュリティに注力 AI が社会のインフラとなった場合 の対応が検討されている？ Research Agenda <https://www.aisi.gov.uk/research-agenda>

### Slide 105: AI Security

![AI Security](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_104.jpg)

> **トランスクリプト:**
> AI Security AI は Slack や AWS のよう にインフラになっていく 攻撃のためのツールに も、攻撃対象にもなる AI Security について検討す ることは社会的に必要 OpenAI「中国やロシアが当社AI使い世論工作」 　日本も標的に - 日本経済新 聞 <https://www.nikkei.com/article/DGXZQOGN30EMF0Q4A530C2000000/>

### Slide 106: 研究者・開発者・利用者の交流

![研究者・開発者・利用者の交流](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_105.jpg)

> **トランスクリプト:**
> 研究者・開発者・利用者の交流 イラストを中心として、開発者とエンドユーザーの間には深刻な断 絶が発生しており、解消する見込みがない 新聞社や報道機関との断絶もすさまじい 「AI セーフティ強化に関する研究開発」プロジェクトで、公的機関 や大企業の研究者に開発現場の課題や取り組みを伝えつつある AI ガバナンスにおいてはアジャイルガバナンスが重要なものの、AI ガバナンスの専門家とアジャイルの専門家の交流はまったくされて いない

### Slide 107: まとめ

![まとめ](https://files.speakerdeck.com/presentations/7fcdc077c8a84606abe278f3f84a0d57/slide_106.jpg)

> **トランスクリプト:**
> まとめ MLOps は機械学習の成果をスケールさせるためのさまざまな取り 組み MLOps ではフィードバックループによる継続的な改善が最重要 LLMOps では評価を中心とした継続的な改善により、高速に改善サ イクルを回すことで提供したい価値を発見する AI セーフティ、AI ガバナンスのベストプラクティスにお
