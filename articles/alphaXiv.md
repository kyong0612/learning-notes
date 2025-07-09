---
title: "The Unbearable Slowness of Being: Why do we live at 10 bits/s?"
source: "https://arxiv.org/abs/2408.10234"
author:
  - "Jieyu Zheng"
  - "Markus Meister"
published: 2024-11-15
created: 2025-07-09
description: |
  This article is about the neural conundrum behind the slowness of human behavior. The information throughput of a human being is about 10 bits/s. In comparison, our sensory systems gather data at ~10^9 bits/s. The stark contrast between these numbers remains unexplained and touches on fundamental aspects of brain function: what neural substrate sets this speed limit on the pace of our existence? Why does the brain need billions of neurons to process 10 bits/s? Why can we only think about one thing at a time? The brain seems to operate in two distinct modes: the "outer" brain handles fast high-dimensional sensory and motor signals, whereas the "inner" brain processes the reduced few bits needed to control behavior. Plausible explanations exist for the large neuron numbers in the outer brain, but not for the inner brain, and we propose new research directions to remedy this.
tags:
  - "neuroscience"
  - "information-theory"
  - "cognition"
  - "sensory-processing"
  - "brain-function"
---

## 要約

### 概要 (In Brief)

ZhengとMeisterは、人間の行動の逆説的な遅さについて論じています。私たちの感覚器は毎秒10^9ビットのデータを収集するのに対し、全体的な情報スループットはわずか毎秒10ビットです。この著しい対照は、脳機能の多くの基本的な側面に触れる未解決の問題です。

### 1. アブストラクト (Abstract)

本稿は、人間の行動の遅さの背景にある神経科学的な難問を扱います。人間の情報スループットは約10ビット/秒ですが、感覚器系のデータ収集能力は約10^9ビット/秒です。この大きな差は未解明のままであり、脳機能の根幹に関わる疑問を提起します。

- 存在のペースを制限する神経基盤は何か？
- なぜ脳は10ビット/秒を処理するために何十億ものニューロンを必要とするのか？
- なぜ私たちは一度に一つのことしか考えられないのか？

脳は2つの異なるモードで動作しているように見えます。「外的脳」は高速で高次元の感覚・運動信号を扱い、「内的脳」は行動制御に必要な少数のビットに削減された情報を処理します。外的脳のニューロン数が多いことにはもっともな説明がありますが、内的脳についてはそうではなく、本稿ではこの問題に取り組むための新たな研究方向性を提案します。

### 2. 導入 (Introduction)

人間の認知（知覚、行動、想像）の情報スループットは約10ビット/秒です。これは、末梢神経系が環境から情報を吸収する能力（ギガビット/秒オーダー）と比べると極めて小さい値です。この約1億倍の差は、脳科学における大きな謎の一つです。このパラドックスは、神経科学の理論から支援技術に至るまで、多くの分野に影響を与えます。

### 3. 人間の行動の情報レート (The information rate of human behavior)

タイピング、スピーチ、ルービックキューブの早解き、記憶競技など、様々な人間の行動を分析した結果、情報処理速度は驚くほど一貫して約10ビット/秒であることが示されています。

**Table 1: 人間の行動の情報レート**

| 行動/活動 | タイムスケール | 情報レート (bits/s) | 参考文献 |
| :--- | :--- | :--- | :--- |
| 2進数の記憶 | 5 min | 4.9 | internationalassociationofmemory_5_2024 |
| 目隠しスピードキュービング | 12.78 sec | 11.8 | guinnessworldrecordslimited_fastest_2023 |
| 選択反応実験 | min | ~5 | hick_rate_1952, hyman_stimulus_1953, klemmer_rate_1969 |
| リスニング理解 (英語) | min - hr | ~13 | williams_guidelines_1998 |
| 物体認識 | 1/2 sec | 30 - 50 | sziklai_studies_1956 |
| 実験室での運動課題の最適パフォーマンス | ~15 sec | 10 - 12 | fitts_information_1954, fitts_information_1964 |
| 読書 (英語) | min | 28 - 45 | rayner_eye_1998 |
| 17言語でのスピーチ | < 1 min | 39 | coupe_different_2019 |
| スピードカード | 12.74 sec | 17.7 | internationalassociationofmemory_speed_2024 |
| StarCraft (e-athlete) | min | 10 | guinnessworldrecordslimited_most_2023 |
| テトリス (Rank S) | min | ~7 | tetrio_tetra_2024 |
| タイピング (英語) | min - hr | 10 | dhakal_observations_2018, shannon_prediction_1951 |

### 4. 神経系の情報容量 (The information capacity of the nervous system)

末梢の感覚器は膨大な情報量を処理できます。例えば、人間の目の錐体細胞は1個あたり約270ビット/秒、網膜全体では約1.6ギガビット/秒の情報を伝達できます。これに対し、行動の出力はわずか10ビット/秒であり、このフィルタリングの度合い（ふるい分け数、Sifting Number）は約10^8にもなります。個々のニューロンでさえ、人間全体と同等かそれ以上の情報伝達能力（~10ビット/秒）を持っています。

### 5. 遅い行動のパラドックス (The paradox of slow behavior)

このパラドックス（末梢の高い情報処理能力と中心の低い処理能力のギャップ）に対する一般的な反論（写真記憶、視覚体験の豊かさ、無意識処理など）は、証拠が弱いか、情報量を計算すると依然として低いレートにしかならないため、説得力に欠けます。

### 6. 「10ビット/秒」が示唆すること (Some implications of “ten bits per second”)

この認知速度の遅さは、神経科学の様々な問題に重要な示唆を与えます。
- **脳の記憶容量**: 人間が一生で獲得する情報量（ゲノム情報を含む）は数ギガバイト程度であり、脳のシナプスが持つ物理的な記憶容量（数十テラバイト）をはるかに下回ります。
- **種の生存戦略**: 人間は、10ビット/秒の処理速度で生存可能な生態的地位に適応したと考えられます。他の生物の認知速度の研究は今後の課題です。
- **ブレイン・コンピュータ・インターフェース (BCI)**: BCIは高帯域幅を目指す必要はなく、人間の認知速度に合わせた数ビット/秒の情報を、頭に穴を開けないインターフェース（音声など）で伝える方が現実的です。イーロン・マスクのニューラリンクに対する期待は、この点を誤解している可能性があります。

### 7. 認知速度の制約要因 (Constraints on the speed of cognition)

認知が遅い理由として、以下の仮説が考えられます。
- **非効率な神経ハードウェア**: ニューロンがノイズが多く非効率であるという考えには説得力がありません。単一ニューロンでも高い情報伝達精度を持ちます。
- **直列処理 vs 並列処理**: 末梢（視覚野など）は並列処理を行うのに対し、中央の認知処理（思考など）は厳密に直列的です。なぜカクテルパーティーで一つの会話しか追えないのか、なぜチェスで複数の手を同時に検討できないのか、という疑問が残ります。
- **進化の歴史**: 脳は元々、単一の目的（餌を探すなど）のために空間を移動する生物の運動制御のために進化しました。この「一度に一つのタスク」という制約が、抽象的な思考にも受け継がれている可能性があります。
- **複雑性のボトルネック**: 感覚情報は、目標や記憶と統合されて意思決定を行う「中央の神経リソース」でボトルネックに遭遇すると考えられていますが、その神経基盤は未特定です。

### 8. 外的脳 vs 内的脳 (Outer brain vs inner brain)

脳は二つのモードで動作していると考えられます。
- **外的脳 (Outer brain)**: 感覚入力と運動出力に密接に関連し、高次元・高情報レートで動作します。
- **内的脳 (Inner brain)**: 行動に必要な数ビットにフィルタリングされた低レートのデータストリームを扱います。

この二つの脳の間のコミュニケーション（巨大な情報量の「ふるい分け」メカニズム）、そしてそれぞれの神経機能の原理（皮質の異なる領域がなぜ根本的に異なる動作をするのか）は、今後の重要な研究課題です。特に、前頭前野のような「内的脳」が、単純な課題だけでなく、現実の生活のように多数の「マイクロタスク」を高速に切り替えながら制御する際の高次元な活動を解明する必要があります。
