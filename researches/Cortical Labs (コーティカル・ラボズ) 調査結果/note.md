# Cortical Labs (コーティカル・ラボズ) 調査結果

ref: <https://corticallabs.com/>

## 1. 企業概要

### 基本情報

- **設立**: 2019年、オーストラリア・メルボルンにて設立
- **創業者**: ホン・ウェン・チョン医学博士（Dr. Hon Weng Chong）
- **主要人物**:
  - CEO: ホン・ウェン・チョン医学博士
  - 最高科学責任者（CSO）: ブレット・カガン博士（Dr. Brett Kagan）
- **本社所在地**: オーストラリア・メルボルン
- **企業ステータス**: スタートアップ（非公開企業）

### 資金調達状況

- **総調達額**: 約1,500万米ドル（2023年時点）
- **主要投資家**:
  - Horizons Ventures（主要投資家、2023年の1,000万ドル調達ラウンドをリード）
  - Blackbird Ventures
  - LifeX Ventures
  - Radar Ventures
  - In-Q-Tel（米国CIAのベンチャーアーム）

### ビジョン・ミッション

Cortical Labsは、生物学的知能（Synthetic Biological Intelligence: SBI）を活用した新たなコンピューティングパラダイムを創造することをミッションとしています。人間の神経細胞とシリコンハードウェアを融合させ、従来のAIよりもエネルギー効率が高く、少ないデータで学習できる生物学的コンピュータを開発しています。

## 2. 主要製品・技術

### CL1生物学的コンピュータ

- **概要**: 世界初の商業化された「コードをデプロイ可能な生物学的コンピュータ」
- **価格**: 約35,000米ドル
- **発売予定**: 2025年6月より出荷開始予定
- **特徴**:
  - 人間の神経細胞をシリコンチップ上に培養
  - 閉鎖循環生命維持システムにより神経細胞を最大6ヶ月間生存可能
  - 双方向の刺激・読み取りインターフェース
  - タッチスクリーン搭載でシステム状態やデータの可視化が可能
  - USBや他のポート経由で外部システムと接続可能
  - 消費電力はわずか数ワット
  - 神経細胞はアリとゴキブリの脳の間の規模（数十万個のニューロン）

### Cortical Cloud（コーティカル・クラウド）

- **概要**: 遠隔から生物学的コンピュータにアクセスできるクラウドサービス
- **特徴**:
  - 「Wetware-as-a-Service（WaaS）」モデル
  - 特殊な実験室や設備を持たずに生物学的コンピューティングにアクセス可能
  - Jupyterノートブックなどの一般的なデータサイエンスツールと互換性あり
  - PythonのSDKを通じてカスタムコードをデプロイ可能

### DishBrain（ディッシュブレイン）

- **概要**: Cortical Labsの初期技術実証システム（2022年発表）
- **特徴**:
  - 80万個のマウスおよびヒトニューロンを多電極アレイ上で培養
  - Pongゲームをわずか5分程度で学習可能
  - 目標指向型の学習行動を示す

### biOS（バイオス：Biological Intelligence Operating System）

- **概要**: 神経細胞とコンピュータをつなぐ独自のオペレーティングシステム
- **特徴**:
  - 神経細胞のためのシミュレーション環境を提供
  - 神経細胞に直接情報を送信し、その反応を読み取る
  - 神経細胞の反応がシミュレーション環境に影響を与える双方向インターフェース

## 3. 技術詳細

### 人間神経細胞の由来と培養プロセス

#### 細胞調達方法

- ボランティアから提供された少量の血液サンプルを使用
- 「通常の医療検査と同様の少量の血液」から細胞を作製（Brett Kagan博士による説明）

#### 神経細胞作製プロセス

1. **iPSC技術**: 血液細胞を誘導多能性幹細胞（induced Pluripotent Stem Cells: iPSCs）に初期化
2. **神経分化**:
   - デュアルSMAD阻害（SB431542およびLDN193189など）による神経誘導
   - SHHやFGF8などの因子による大脳皮質特異的パターニング
   - BDNF、GDNFなどの神経栄養因子による成熟化
3. **チップ上での培養**:
   - 分化した神経細胞を栄養豊富な溶液中でシリコンチップ上に配置
   - チップには59の電極が配置され、神経細胞との双方向通信が可能

#### 生命維持システム

- 温度制御
- 適切な酸素化のためのガス混合
- 廃棄物ろ過
- ポンプによる培地循環

### 神経ネットワークの学習メカニズム

#### 基本原理

- **予測可能性の原理**: 神経細胞は予測可能な環境を生み出す活動を繰り返す傾向がある
- **フリーエネルギー原理**: カール・フリストン教授の理論に基づく能動的推論アプローチを採用

#### 学習プロセス

1. 神経細胞にシミュレーション環境からの電気信号を入力
2. 正しい反応（例：Pongゲームでボールを打つ）をすると、一定のパターン化された刺激を与える
3. 間違った反応をすると、ランダムな場所と頻度で刺激を与える
4. 時間が経つにつれて、神経細胞はパターン化された刺激を受けるように行動を修正（学習）

### 技術的特性とパフォーマンス

#### エネルギー効率性

- CL1システムは数ワット程度の電力で動作
- CL1ユニット30台のラックでも850-1,000W程度の消費電力
- 従来のAIモデルと比較して桁違いに少ないエネルギー消費

#### 学習速度と効率性

- 強化学習アルゴリズムと比較して少ないサンプル数で学習可能
- Pongゲームをわずか5分程度で学習（従来のAIよりも迅速）
- マウスのニューロンよりも人間のニューロンの方が学習速度が速く、より「探索的」な動きを示す

#### 適応性

- 経験の結果として活動を変化・適応させる能力
- 時間の経過とともに学習率が向上
- 特定のタスクに特化した領域に自己組織化する「機能的可塑性」を示す

## 4. ビジネスモデルと市場戦略

### 収益モデル

1. **直接販売**: CL1ユニットを約35,000米ドルで販売
2. **WaaS（Wetware-as-a-Service）**: クラウドベースでの生物学的コンピューティングへのアクセスを提供
3. **研究・開発パートナーシップ**: 企業や研究機関とのコラボレーション

### 市場ポジショニング

- 生物学的コンピューティング分野における先駆者
- 従来のAIハードウェア企業（MythicやCerebrasなど）とは異なる独自の価値提案
- 同市場で先行者利益を享受できる可能性

### ターゲット市場と応用分野

1. **製薬・医療**:
   - 薬剤開発と臨床試験
   - パーソナライズド医療
   - 早期疾患検出
2. **研究機関**:
   - 神経科学研究
   - 動物実験代替
3. **テクノロジー企業**:
   - ロボティクスと適応制御システム
   - AIと機械学習開発

### パートナーシップと提携

- **モナッシュ大学**: 研究プロジェクトでの協力
- **Organoid Intelligence アライアンス**: ジョンズ・ホプキンス大学が主導
- **bit.bio**: ケンブリッジのバイオテック企業
- **VERSES AI**: アクティブ推論アプローチの開発パートナー

## 5. 研究成果と科学的貢献

### 主要論文と研究成果

1. **"In vitro neurons learn and exhibit sentience when embodied in a simulated game-world"** (2022年、Neuron誌):
   - DishBrainシステムがPongゲームを学習できることを実証
   - 生体外の神経ネットワークが目標指向型行動と学習能力を示すことを証明

2. **"Critical dynamics arise during structured information presentation within embodied in vitro neuronal networks"** (Nature Communications誌):
   - 構造化された情報提示における臨界動態の発生を研究

3. **"The technology, opportunities, and challenges of Synthetic Biological Intelligence"** (Biotechnology Advances誌):
   - 合成生物学的知能の技術、機会、課題について概説

4. **"Biological Neurons vs Deep Reinforcement Learning: Sample efficiency in a simulated game-world"**:
   - 生物学的ニューロンが深層強化学習と比較してサンプル効率が高いことを実証

### 進行中の研究プロジェクト

1. **Minimal Viable Brain (MVB)**:
   - 複雑な情報処理が可能な制御された神経システムの構築

2. **生物学的ニューラルネットワークサーバースタック**:
   - 30台のCL1ユニットをネットワーク化して大規模実験を可能に

## 6. 倫理的・法的・規制面の考慮事項

### 倫理的懸念事項

1. **人間の神経細胞使用に関する懸念**:
   - 幹細胞由来の神経細胞を使用することで初期胚の使用を回避
   - 血液サンプル提供者からの適切な同意確保

2. **意識と感覚に関する問題**:
   - 現在のシステムが意識や感覚を持つ可能性は非常に低い
   - 将来的により複雑なシステムが意識に近い性質を持つ可能性についての継続的検討

3. **動物実験代替としての位置づけ**:
   - 薬剤開発や神経科学研究における動物実験の必要性を減らす可能性
   - 倫理的に優れた選択肢としての提案

### 規制の枠組み

1. **監督と承認**:
   - 場所と用途に応じた「数多くの規制承認」が必要
   - 健康機関、生命倫理委員会、バイオテクノロジー監督機関などの関与

2. **データ保護とプライバシー**:
   - 神経データの機密性に関する考慮事項
   - HIPAA（米国）やGDPR（EU）などの規制の適用可能性

### 安全プロトコル

1. **細胞封じ込めと生命維持**:
   - 自己完結型生命維持システムによる生物学的材料の安全な封じ込め
   - 汚染防止プロトコル

2. **リモートアクセスセキュリティ**:
   - WaaSモデルを通じたシステムへの安全なアクセス確保
   - 生物学的コンピューティングシステムの不正アクセス防止

### Cortical Labsのアプローチ

1. 既存の規制遵守と関連監督機関との協力
2. 動物実験の倫理的に優れた代替技術としてのポジショニング
3. 現行システムに意識や感覚がないことの強調と、技術の進歩に伴う継続的な倫理的検討の必要性の認識
4. 物理的システムの管理を維持しながら、技術を民主化するリモートアクセスの提供

## 7. 市場機会と課題

### 市場機会

1. **医療・創薬分野**:
   - 神経疾患の研究と治療法開発
   - 薬物スクリーニングと毒性試験の改善
   - パーソナライズド医療向け診断技術

2. **代替AI技術**:
   - エネルギー効率の高いコンピューティングソリューション
   - 少ないデータで学習できるシステム
   - パターン認識や不確実な環境での意思決定に優れた技術

3. **研究ツールとしての価値**:
   - 神経科学研究の新たな手法
   - 動物実験を減らす倫理的選択肢

### 課題

1. **技術的課題**:
   - 神経細胞の長期生存性（現在最大6ヶ月）
   - スケーラビリティと再現性の確保
   - 複雑なタスクへの適応

2. **規制と倫理的障壁**:
   - 新興技術に対する明確な規制枠組みの不足
   - 意識と感覚に関する継続的な倫理的問題
   - 国際的な規制の整合性

3. **商業的課題**:
   - 高コスト（35,000米ドル/ユニット）
   - 市場教育の必要性
   - 明確なROI（投資収益率）の証明

## 8. 他の生物学的コンピューティングアプローチとの比較

### 脳オルガノイド研究

- **Cortical Labsのアプローチ**: 2次元平面上の神経細胞アレイをシリコンチップと直接統合
- **脳オルガノイド研究**: 特定の脳領域をモデル化する3次元細胞培養

### エネルギー効率

- Cortical Labsの技術は従来のAIシステムおよび他の生物学的コンピューティングアプローチよりもエネルギー効率が高いとされる

### 学習速度と適応性

- CL1システムは従来のAIチップよりも速く学習・適応すると報告されている

### シリコンハードウェアとの統合

- 有機成分のみに焦点を当てる他のアプローチとは異なり、Cortical Labsの技術は生きた神経細胞とシリコンチップを直接統合

## 9. 将来の展望と開発ロードマップ

### 商業化

- 2025年後半にCL1ユニットを35,000米ドルで一般販売開始予定

### 応用拡大

- 創薬、臨床試験、パーソナライズド医療、早期疾患検出への注力

### 倫理的考慮事項

- 技術の進歩に伴い、人間の脳細胞のコンピューティングでの使用に関する倫理的考慮事項に対応

### 計算能力の拡張

- 複数のCL1ユニットをネットワーク化し、より高度な生物学的ニューラルネットワークを開発

## 10. 結論

Cortical Labsは生物学的コンピューティングという新興分野のパイオニアとして、人間の神経細胞とシリコンハードウェアを融合させた独自の技術を開発しています。DishBrainに始まり、商業版CL1、そしてCortical Cloudへと進化するその技術は、従来のAIシステムが直面するエネルギー効率や学習効率の課題に対する新たなアプローチを提供しています。

医療研究から人工知能、ロボティクスに至るまで、幅広い応用可能性を持つこの技術は、生物学と計算科学の境界を越える革新的な取り組みとして注目されています。倫理的・規制的課題が残るものの、Cortical Labsのビジョンは、生物学的知能を活用した次世代コンピューティングの新たな地平を切り開く可能性を秘めています。

今後数年間で、この技術がより成熟し、AIや計算神経科学の広範な領域でその独自の位置を確立していくことが期待されます。

## 11. 参考資料・出典

### 公式サイト

1. Cortical Labs公式ウェブサイト: <https://corticallabs.com>
2. CL1製品ページ: <https://corticallabs.com/cl1.html>
3. Cortical Cloud: <https://corticallabs.com/cloud.html>
4. 研究成果ページ: <https://corticallabs.com/research.html>
5. 企業情報: <https://corticallabs.com/company.html>

### 研究論文・学術情報

6. "In vitro neurons learn and exhibit sentience when embodied in a simulated game-world" (Neuron誌): <https://pubmed.ncbi.nlm.nih.gov/36228614/>
7. bioRxiv論文: <https://www.biorxiv.org/content/10.1101/2021.12.02.471005v2>
8. "Organoid intelligence (OI): the new frontier in biocomputing and intelligence-in-a-dish": <https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full>

### ニュース・記事

9. New Atlas "World's first 'Synthetic Biological Intelligence' runs on living human neurons": <https://newatlas.com/brain/cortical-bioengineered-intelligence/>
10. データセンターダイナミクス "Australian startup Cortical Labs unveils 'world's first' commercial biological computer": <https://www.datacenterdynamics.com/en/news/australian-startup-cortical-labs-unveils-worlds-first-commercial-biological-computer/>
11. Tom's Hardware "World's first 'body in a box' biological computer uses human brain cells": <https://www.tomshardware.com/tech-industry/worlds-first-body-in-a-box-biological-computer-uses-human-brain-cells-with-silicon-based-computing>
12. BioPharma Trend "Cortical Labs Launches $35K Biological Computer Built on Human Brain Cells": <https://www.biopharmatrend.com/post/1156-cortical-labs-introduces-biological-computer-built-on-human-brain-cells/>
13. TechRadar "A breakthrough in computing: Cortical Labs' CL1 is the first living biocomputer": <https://www.techradar.com/pro/a-breakthrough-in-computing-cortical-labs-cl1-is-the-first-living-biocomputer-and-costs-almost-the-same-as-apples-best-failure>
14. YourStory "CL1: The First Biological Computer Powered by Human Brain Cells": <https://yourstory.com/2025/03/cl1-biological-computer>
15. UCL News "Human brain cells in a dish learn to play Pong": <https://www.ucl.ac.uk/news/2022/oct/human-brain-cells-dish-learn-play-pong>
16. Genetic Engineering & Biotechnology News "Human Brain Cells in a Dish Learn to Play 'Pong'": <https://www.genengnews.com/topics/artificial-intelligence/human-brain-cells-in-a-dish-learn-to-play-pong/>
17. ABC News "Melbourne start-up launches 'biological computer' made of human brain cells": <https://www.abc.net.au/news/science/2025-03-05/cortical-labs-neuron-brain-chip/104996484>

### 企業・投資情報

18. Oxford Global "Cortical Labs Secures $10M to Revolutionise AI with Biological Neurons": <https://oxfordglobal.com/discovery-development/resources/cortical-labs-secures-10m-to-revolutionise-ai-with-biological-neurons>
19. VERSES AI パートナーシップ発表: <https://www.verses.ai/news/verses-ai-announces-cortical-labs-biological-computing-company-as-second-beta-partner>
20. CB Insights プロフィール: <https://www.cbinsights.com/company/cortical-labs>

### 研究・技術資料

21. iPSC由来神経細胞に関する研究: <https://pmc.ncbi.nlm.nih.gov/articles/PMC8758945/>
22. 神経細胞分化プロトコル: <https://www.frontiersin.org/journals/cell-and-developmental-biology/articles/10.3389/fcell.2022.1023340/full>
23. 生物学的神経ネットワークの倫理的考察: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10602981/>
24. 神経オルガノイドの法的・倫理的視点: <https://law.stanford.edu/2023/07/27/a-legal-and-ethical-perspective-on-human-consciousness-and-human-brain-organoids/>
25. Micro.org記事 "DishBrain: Are pong-playing neurons the future of AI?": <https://micro.org.au/big-impact/dishbrain-are-pong-playing-neurons-the-future-of-ai/>
