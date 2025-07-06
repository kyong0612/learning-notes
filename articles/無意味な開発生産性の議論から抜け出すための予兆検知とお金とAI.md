---
title: "無意味な開発生産性の議論から抜け出すための予兆検知とお金とAI"
source: "https://speakerdeck.com/i35_267/wu-yi-wei-nakai-fa-sheng-chan-xing-noyi-lun-karaba-kechu-sutamenoyu-zhao-jian-zhi-toojin-toai"
author:
  - "[[Masato Ishigaki / 石垣雅人]]"
published: 2025-07-03
created: 2025-07-06
description: |
  開発生産性の議論における課題を指摘し、感覚に頼らない生産性低下の予兆検知手法を提案。さらに、AIの登場による開発プロセスの変化、投資対効果の考え方までを包括的に解説する資料。
tags:
  - "開発生産性"
  - "AI"
  - "予兆検知"
  - "技術負債"
  - "ソフトウェア開発"
  - "組織論"
---

本資料は、開発生産性に関する不毛な議論を避け、データに基づいたアプローチで課題を解決するための具体的な手法を提案するものです。特に、生産性低下の「予兆検知」、AIの活用による開発プロセスの変革、そしてそれに伴う投資対効果の考え方に焦点を当てています。

## プレゼンテーションの要点

### 1. 無意味な開発生産性の議論と、それがもたらす重圧

![slide_06.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_6.jpg)
![slide_07.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_7.jpg)
![slide_08.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_8.jpg)

開発生産性の議論は、しばしば以下のような問題に直面します。

- **突然の改善要求**: 「開発が遅い」といった抽象的な指摘から、具体的な改善を即座に求められるプレッシャー。
- **不十分な要件定義**: 「とにかく早く」という重圧の中で開発が進み、仕様変更や手戻りが多発する。
- **小手先の指標への固執**: すぐに計測できる数値を目標にしてしまい、本質的でない改善（ハック）に陥る（グッドハートの法則）。
- **説明責任の困難さ**: 技術負債の返済やリファクタリングなど、効果がすぐに見えにくい活動の重要性を「コスト」ではなく「未来への投資」として説明することの難しさ。
- **プロセスの後工程へのしわ寄せ**: 要求定義や設計といった上流工程の問題が、開発やQAといった下流工程で「遅れ」として顕在化しやすい。

### 2. 感覚に頼らない「開発生産性低下」の予兆検知

![slide_10.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_10.jpg)
![slide_11.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_11.jpg)

ソフトウェアの変更容易性が時間と共に低下し、生産性が下がる構造を理解し、「抑制」「解消」そして「予兆検知」の観点からアプローチすることが重要です。感覚ではなく、以下の4つの定量的・定性的な指標で予兆を検知します。

1. **計画見積もりと実績値の差分（ブラックボックステスト）**:
    ![slide_13.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_13.jpg)
    ![slide_15.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_15.jpg)
    - 企画、設計、開発の各フェーズでの見積もりと実績の乖離を監視します。特に、計画と実績のズレが大きい場合、何らかの問題（スコープクリープ、技術的困難など）が発生している兆候と捉えられます。

2. **障害件数と再発防止策の完了件数**:
    ![slide_16.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_16.jpg)
    - 発生した障害の件数だけでなく、その再発防止策が完了しているかを追跡します。未完了のタスクが蓄積すると、将来の新規開発リソースを圧迫する要因となります。ポストモーテム分析と組み合わせ、障害が特定のプロセスや担当者に集中していないかを確認します。

3. **投資している開発区分の可視化**:
    ![slide_17.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_17.jpg)
    - 開発工数を「新規機能開発」「運用・保守」「リファクタリング」などの区分で分類し、どの領域にどれだけ投資しているかを可視化します。運用コストの増大は、生産性低下のサインです。

4. **エンゲージメントスコアの低下**:
    ![slide_18.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_18.jpg)
    - モチベーションサーベイなどを通じて、チームのエンゲージメントの変化を監視します。モチベーションの低下は、生産性に直結する重要な先行指標です。

これらの指標に対して、組織として許容できる閾値（SLO）を設定し、それを超えた場合にアラートを出す仕組みを構築することが推奨されます。

### 3. AIによって開発生産性はどう変わったか

![slide_21.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_21.jpg)
![slide_24.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_24.jpg)

AIエージェントの登場により、開発のパラダイムは大きく変化しています。

- **働き方の変容**: 従来は人間の物理的な時間と成果物が同期していましたが、AIの活用により非同期で成果物が生成されるようになります。人間の役割は、コーディングのような「作業」から、AIに対する的確な「問い」と、生成された成果物に対する「判断」へとシフトします。
- **AIは「拡張」**: GitHub CEOの言葉を借りれば、AIはエンジニアを置き換えるのではなく「拡張」する存在です。AIが生成したコードを迅速にレビューし修正する能力は必須であり、大規模システムの設計能力といったエンジニアリングの基礎力は依然として重要です。
- **生産性の二極化**: AIの活用により品質を伴った生産量は爆発的に増加しますが、それはAIを巧みに活用できる組織に限られます。結果として、活用できる組織とそうでない組織の間で、生産性の差はかつてないほど鮮明になります。
- **AI-BPR (Business Process Re-engineering) の必要性**:
    ![slide_25.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_25.jpg)
    ![slide_27.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_27.jpg)
  - 既存のプロセスを部分的にAIに置き換えるのではなく、AIの存在を前提として、ビジネスプロセス全体をゼロベースで再構築（リエンジニアリング）することが本質的な効果を生みます。
  - これにより、エンジニアだけでなく、企画、設計、QAなど、すべての職種がリードタイム短縮の当事者となり、全員で開発生産性について考える文化が醸成されます。
    ![slide_32.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_32.jpg)

### 4. AIへの投資と人への投資によるお金の変化

![slide_34.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_34.jpg)

スケーリングの源泉が「人」から「人とAI」へと変化することで、企業の投資戦略も変わります。

- **コスト構造の変化**: 従来の人材関連費（給与、福利厚生費など）に加え、AIツールのライセンス料といった販管費の割合が増加します。
    ![slide_35.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_35.jpg)
- **AIの投資対効果（ROI）の測定**:
    ![slide_38.jpg](https://files.speakerdeck.com/presentations/1a2bf35b2d3d406a94658c0fbdd01f2a/slide_38.jpg)
  - AI導入の効果を「感覚的に早くなった」で終わらせず、データで示すことが重要です。しかし、単純な時間削減だけでは測れない「協働」による効果の定量化は容易ではありません。
  - 筆者は、単一の指標ではなく、多元的な評価でROIを捉えるアプローチを提案しています。
    - **スピードと品質の両立**: 生産量が増えても、品質が低下しては意味がありません。
    - **バリューストリーム全体での評価**: 一部分の最適化ではなく、エンドツーエンドでの改善（リードタイム、デプロイ頻度、変更障害率など）を評価します。
    - **生産活動の変化傾向**: ノイズを除いた理想的なメンバーのPR数推移（AI活用前後）や、SPACEフレームワークのような定性評価を組み合わせ、人材関連費とAIへの投資を比較しながら、組織全体の投資判断を行うことを目指しています。
