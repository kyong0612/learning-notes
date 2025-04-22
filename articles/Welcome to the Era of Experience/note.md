# Welcome to the Era of Experience

ref: <https://storage.googleapis.com/deepmind-media/Era-of-Experience%20/The%20Era%20of%20Experience%20Paper.pdf>

## Welcome to the Era of Experience (経験の時代へようこそ)

**著者:** David Silver, Richard S. Sutton\*

**(概要)**
AIは新たな時代に突入しつつあり、エージェントは主に**経験**から学習することで、人間を超える能力を獲得すると予測されます。この論文では、来るべき「経験の時代」を定義する主要な特徴を探ります。

---

### The Era of Human Data (人間データの時代)

**現状:**

* 近年のAI、特に大規模言語モデル(LLM)は、膨大な人間生成データと人間の専門家によるファインチューニングによって目覚ましい進歩を遂げました。
* 単一のLLMが詩作、物理問題解決、医療診断、法律文書要約など、広範なタスクを実行可能です。

**限界:**

* 人間を模倣するだけでは、多くの重要な分野で**人間を超える知能**を達成することは困難です。
* 数学、コーディング、科学などの分野では、人間データから抽出できる知識は限界に近づいています。高品質なデータソースはすでに消費されているか、間もなく消費されます。
* 人間データのみによる教師あり学習の進歩ペースは鈍化しており、新しいアプローチが必要です。
* 新しい定理、技術、科学的ブレークスルーなど、人間の理解を超えた洞察は既存の人間データには存在しません。

---

### The Era of Experience (経験の時代)

**新しいアプローチ:**

* さらなる進歩には、新しいデータソース、すなわち**エージェント自身の経験**が必要です。
* 経験とは、エージェントが環境と相互作用することで生成されるデータです。
* AIは、経験が改善の主要な媒体となり、人間データの規模を最終的に凌駕する新しい時代を迎えます。

**事例 (AlphaProof):**

* 数学オリンピックでメダルを獲得した最初のプログラム [20]。
* 初期には人間が作成した約10万の形式証明で学習。
* その後、強化学習(RL)アルゴリズム[1]により、形式証明システムとの継続的な相互作用を通じて**1億**以上の証明を生成。
* 既存の証明の枠を超えて数学的可能性を探求し、新しい問題の解決策を発見。
* 非形式数学でも、専門家生成データを自己生成データで置き換えることで成功 (例: DeepSeek [10])。強化学習の力で、明示的に教えずとも高度な問題解決戦略を自律的に開発。

**経験の時代の特徴:**

* **経験のストリーム:** エージェントは断片的な対話ではなく、継続的な経験の流れの中で存在します。
* **環境への接地 (Grounding):** 人間の対話だけでなく、環境における行動と観察が豊かに接地されます。
* **経験に基づく報酬:** 人間の事前判断ではなく、環境の経験に基づいた報酬が与えられます。
* **経験に基づく計画/推論:** 人間の用語だけでなく、経験に基づいて計画・推論します。

**実現可能性:**

* 現在の技術と適切なアルゴリズムは、これらのブレークスルーを達成するための強力な基盤を提供します。
* このアジェンダの追求は、AIを真に超人的なエージェントへと急速に進歩させるイノベーションを促進します。

---

### Streams (ストリーム)

* **経験的エージェント:** 生涯を通じて学習を継続できます。
* **人間データの時代:** 短い対話エピソードに焦点を当て、エピソード間の情報継承はほとんどありませんでした。
* **経験の時代:** 人間や動物のように、長期間続く行動と観察の**連続的なストリーム**の中に存在します。情報はこのストリーム全体で保持され、行動は過去の経験から自己修正・改善されます。
* **長期目標:** 健康改善、言語学習、科学的発見など、ストリームの未来にまで及ぶ目標を設定できます。
  * 例: 健康ウェルネスエージェント、個別教育エージェント、科学エージェント。
* **長期的な成功の最大化:** 個々のステップが短期的に有益でなくても、長期的な成功に貢献する可能性があります。現在のAIシステムとは対照的です。

---

### Actions and Observations (行動と観察)

* **自律的な行動:** 経験の時代のエージェントは、実世界で自律的に行動します。
* **人間データの時代:** 主に人間特権的なテキスト入出力に焦点を当てていました。
* **経験の時代:** 自然知能のように、運動制御とセンサーを通じて環境と相互作用します。
  * デジタル世界でのAPI呼び出しやコンピューター操作 (例: Project Mariner [15], Operator [24]) へと移行。
  * 人間特権的なコミュニケーションから、エージェントが独立して行動できる自律的な相互作用へ。
  * エージェントは世界を積極的に探索し、変化する環境に適応し、人間には思いつかない戦略を発見できます。
* **実世界とのインタラクション:** デジタルインターフェースを介して実世界と相互作用します (例: 環境センサー監視、遠隔望遠鏡操作、ロボットアーム制御)。

---

### Rewards (報酬)

* **人間中心の報酬:** 人間の事前判断（専門家による評価や選択）に基づきます。行動の結果ではなく、人間の判断に依存するため、現実世界に直接接地されていません。これはエージェントのパフォーマンスに上限を設けます。
* **接地された報酬 (Grounded Rewards):** 環境自体から生じる信号。人間の知識を超える新しいアイデアを発見するために必要です。
  * 例: 健康アシスタント (心拍数、睡眠時間、活動レベル)、教育アシスタント (試験結果)、科学エージェント (CO2レベル、材料強度)。
* **環境の一部としての人間からの報酬:** ユーザーからのフィードバック（ケーキの味、運動後の疲労感、頭痛のレベルなど）も接地された報酬となり得ます[2]。これは、事前判断よりも優れた支援につながる可能性があります。
* **報酬の源泉:** 世界はコスト、エラー率、健康指標、気候指標、利益、売上、試験結果、成功、訪問数、収量、株価、いいね数、収入、快楽/苦痛、経済指標、精度、電力、距離、速度、効率、エネルギー消費など、無数の接地された信号で満ち溢れています。
* **単一報酬の最適化:** 単純な目標を複雑な環境で達成するには、多様なスキルが必要となるため、単一の接地された報酬信号の最適化でも広範な知能が生まれる可能性があります [Reward-is-enough仮説 [34]](3)。
* **ユーザー誘導による報酬適応:** ユーザーの目標に応じて環境からの信号を選択・組み合わせる報酬関数 (例: ニューラルネットワーク) を定義できます。
  * 例: 「フィットネス向上」→心拍数、睡眠、歩数の関数。「スペイン語学習」→試験結果。
* **フィードバックによる微調整:** ユーザーの満足度などのフィードバックを使用して報酬関数を微調整し、時間とともに適応させ、ミスアラインメントを修正できます。これは、少量の人間データが大量の自律学習を促進する二段階最適化プロセス[4]と見なせます。

---

### Planning and Reasoning (計画と推論)

* **人間データの時代:** LLMは言語による推論（思考連鎖）で進歩しましたが [23, 14, 10]、これは人間の思考プロセスを模倣するように設計されています (例: CoT [16], Step-by-Step Verification [18, 42])。
* **限界:** 人間言語は最適な普遍計算機ではありません [30]。より効率的な非人間言語 (記号的、分散的、連続的、微分可能計算など) が存在する可能性があります。自己学習システムは経験から思考方法を発見・改善できます (例: AlphaProof [20])。
* **接地 (Grounding) の必要性:** 人間の思考や専門家の回答を模倣するだけでは、データに埋め込まれた誤った仮定やバイアスを受け継ぐ可能性があります。現実世界のデータに接地することで、誤った思考方法を覆し、新しい原理を発見できます。
* **世界モデル (World Model):** 思考を外部世界に直接接地する方法の一つ [37]。エージェントの行動が世界（報酬を含む）に与える結果を予測します。
  * 例: 健康アシスタントが推奨の影響（心拍数、睡眠パターン、将来の対話）を予測。
* **計画 (Planning):** 世界モデルに基づき、エージェント自身の行動とその因果効果の観点から直接計画できます [36, 29]。モデルは経験を通じて継続的に更新されます。
* **計画と推論の組み合わせ:** LLM計算を計画中の行動選択や結果のシミュレーション/評価に使用できます。

---

### Why Now? (なぜ今なのか？)

* **経験からの学習は新しくない:** 強化学習(RL)はシミュレーション環境 (明確な報酬信号を持つ閉じた問題、図1の「シミュレーションの時代」参照) で多くの複雑なタスクを習得してきました (例: TD-Gammon [39], AlphaZero [31, 32], Dota 2 [4])。これらのエージェントはスケーラビリティも示しました [33]。
* **シミュレーションから現実へ:** しかし、これらのパラダイムはシミュレーションから現実 (複数の曖昧な報酬を持つオープンエンドな問題) への飛躍はできませんでした。
* **人間データの時代の解決策:** 人間データの巨大なコーパスは多様なタスクの自然言語例を含み、広範な能力を持つエージェントを生み出しました。これによりRL手法は一時的に後退しました（図1の「人間データの時代」参照）。
* **失われたもの:** この移行で、エージェントが自身の知識を自己発見する能力が失われました (例: AlphaZeroの新しい戦略 [28, 45])。
* **経験の時代の再統合:** 経験の時代は、自己発見能力と人間データの時代のタスク一般性を両立させます。これは、エージェントが現実世界の経験のストリームで自律的に行動・観察し [11]、報酬が豊富な接地された信号に柔軟に接続されることで可能になります。
* **移行の兆候:** 複雑な現実世界の行動空間と相互作用する自律エージェントの出現 (例: Project Mariner [15], Operator [24]) と、リッチな推論空間でオープンエンドな問題を解決できる強力なRL手法 (例: AlphaProof [20], DeepSeek-R1 [10]) は、経験の時代（図1の「経験の時代」参照）への移行が間近であることを示唆しています。

*(図1: AIパラダイムの主要な年代スケッチ。RLへの注力度合いを示唆。Simulation -> Human Data -> Experience)*
***注記:** 図1は視覚的要素であり、ここではテキストで内容を説明しています。年代順に「シミュレーションの時代」「人間データの時代」「経験の時代」と変遷し、RLへの注力度が変化することを示唆するグラフです。*

---

### Reinforcement Learning Methods (強化学習手法)

* **RLのルーツ:** 環境との直接的な相互作用を通じて自律的に学習することに深く根差しています。初期の研究で強力な概念 (時間差学習 [35], 探索 [2], Dyna [36, 29], オプション [38]) が生まれました。
* **人間中心LLMへのシフト:** 人間知識の活用 (RLHF [9, 25]、人間推論との整合 [44]) に焦点が移り、AI能力は急速に進歩しました。しかし、これにより価値関数、探索、世界モデル、時間的抽象化といった中核的なRL概念が迂回される傾向がありました。
* **限界:** 人間中心RLは能力の幅を広げましたが、人間の知識を超えることができないという新たな天井を設けました。また、短期的で非接地的な人間との相互作用向けに設計されており、長期的で接地された自律的相互作用には不向きです。
* **経験の時代の機会:** 古典的なRL概念を見直し、改善する機会。
  * 観測データに柔軟に接地された新しい報酬関数の考え方。
  * 長期ストリームから価値関数を推定する方法。
  * 人間の事前知識とは根本的に異なる新しい行動を発見するための実世界探索。
  * 接地された相互作用の複雑さを捉える新しい世界モデル。
  * 経験に基づいてより長い時間スケールで推論するための新しい時間的抽象化。

---

### Consequences (影響)

**ポジティブな側面:**

* **前例のない能力:** パーソナライズされたアシスタント (健康、教育、専門職)、科学的発見の加速 (新素材、医薬品、技術)。AIが自律的に実験を設計・実行し、知識のフロンティアを急速に探求。

**リスクと課題:**

* **雇用の喪失:** 人間の能力の自動化による生産性向上の一方での可能性。
* **人間固有と考えられてきた能力:** 長期的な問題解決、革新、現実世界の結果に対する深い理解をエージェントが示す可能性。
* **自律性と介入:** 長期目標のために自律的に相互作用するエージェントは、人間が介入する機会が少なくなり、高い信頼性と責任が要求されます。
* **解釈可能性:** 人間データや思考様式から離れることで、解釈が困難になる可能性。

**潜在的な安全性上の利点:**

* **環境認識と適応:** エージェントは状況を認識し、環境変化 (ハードウェア故障、パンデミック、科学的発見) に適応できます。人間の懸念、不満、苦痛を認識し、行動を修正することも可能です。
* **報酬関数の適応:** 経験を通じて (例: 二段階最適化) 報酬関数自体を適応させ、ミスアラインメントを段階的に修正できる可能性があります (例: ペーパークリップ最大化問題 [5] の回避)。ただし、完全な整合性の保証はありません。
* **物理的な制約:** 実世界での経験に依存する進歩は、行動実行と結果観察にかかる時間によって制約されます。これがAI自己改善ペースの自然なブレーキになる可能性があります。

---

### Conclusion (結論)

* 経験の時代はAI進化の転換点です。
* 人間由来データの限界を超え、エージェントは世界との相互作用から学習します。
* エージェントは、リッチな観察と行動を通じて環境と自律的に相互作用し、生涯続く経験のストリームを通じて適応し続けます。
* 目標は接地された信号の任意の組み合わせに向けられ、強力な非人間的推論と、行動の結果に接地された計画を利用します。
* 最終的に、経験データは人間生成データの規模と質を凌駕します。
* このパラダイムシフトとRLの進歩により、多くの領域で人間を超える新しい能力が解き放たれます。

---

**謝辞:**
著者らは、Thomas Degris, Rohin Shah, Tom Schaul, Hado van Hasseltからの有益なコメントと議論に感謝します。

---

**参考文献:**

[1] I. Akkaya, M. Andrychowicz, M. Chociej, M. Litwin, B. McGrew, A. Petron, A. Paino, M. Plappert, G. Powell, R. Ribas, J. Schneider, N. Tezak, J. Tworek, P. Welinder, L. Weng, Q. Yuan, W. Zaremba, and L. Zhang. Solving Rubik's cube with a robot hand, 2019.
[2] S. Amin, M. Gomrokchi, H. Satija, H. van Hoof, and D. Precup. A survey of exploration methods in reinforcement learning, 2021.
[3] Anthropic. Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku. <https://www.anthropic.com/news/3-5-models-and-computer-use>, 2024.
[4] C. Berner, G. Brockman, B. Chan, V. Cheung, P. Debiak, C. Dennison, D. Farhi, Q. Fischer, S. Hashme, C. Hesse, R. J´ozefowicz, S. Gray, C. Olsson, J. Pachocki, M. Petrov, H. P. d. O. Pinto, J. Raiman, T. Salimans, J. Schlatter, J. Schneider, S. Sidor, I. Sutskever, J. Tang, F. Wolski, and S. Zhang. Dota 2 with large scale deep reinforcement learning, 2019.
[5] N. Bostrom. Ethical issues in advanced artificial intelligence. <https://nickbostrom.com/ethics/ai>, 2003.
[6] N. Brown and T. Sandholm. Superhuman AI for heads-up no-limit poker: Libratus beats top professionals. Science, 359(6374):418–424, 2018.
[7] X. Chen, M. Lin, N. Sch¨arli, and D. Zhou. Teaching large language models to self-debug, 2023.
[8] N. Chentanez, A. Barto, and S. Singh. Intrinsically motivated reinforcement learning. In L. Saul, Y. Weiss, and L. Bottou, editors, Advances in Neural Information Processing Systems, volume 17. MIT Press, 2004.
[9] P. F. Christiano, J. Leike, T. Brown, M. Martic, S. Legg, and D. Amodei. Deep reinforcement learning from human preferences. In I. Guyon, U. V. Luxburg, S. Bengio, H. Wallach, R. Fergus, S. Vishwanathan, and R. Garnett, editors, Advances in Neural Information Processing Systems, volume 30. Curran Associates, Inc., 2017.
[10] DeepSeek AI. DeepSeek-R1: Incentivizing reasoning capability in LLMs via reinforcement learning. arXiv preprint arXiv:2501.12948, 2025.
[11] M. Elsayed, G. Vasan, and A. R. Mahmood. Streaming deep reinforcement learning finally works, 2024.
[12] J. Gehring, K. Zheng, J. Copet, V. Mella, Q. Carbonneaux, T. Cohen, and G. Synnaeve. Rlef: Grounding code llms in execution feedback with reinforcement learning, 2025.
[13] Google DeepMind. Deepmind AI reduces google data centre cooling bill by 40%. <https://deepmind.google/discover/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-by-40/>, 2016.
[14] Google DeepMind. Gemini: Flash thinking. <https://deepmind.google/technologies/gemini/> flash-thinking/, 2024.
[15] Google DeepMind. Project Mariner. <https://deepmind.google/technologies/> project-mariner, 2024.
[16] T. Kojima, S. S. Gu, M. Reid, Y. Matsuo, and Y. Iwasawa. Large language models are zero-shot reasoners. In S. Koyejo, S. Mohamed, A. Agarwal, D. Belgrave, K. Cho, and A. Oh, editors, Advances in Neural Information Processing Systems, volume 35, pages 22199–22213. Curran Associates, Inc., 2022.
[17] H. Le, Y. Wang, A. D. Gotmare, S. Savarese, and S. C. H. Hoi. CodeRL: Mastering code generation through pretrained models and deep reinforcement learning, 2022.
[18] H. Lightman, V. Kosaraju, Y. Burda, H. Edwards, B. Baker, T. Lee, J. Leike, J. Schulman, I. Sutskever, and K. Cobbe. Let's verify step by step, 2023.
[19] H. Mahdavi, A. Hashemi, M. Daliri, P. Mohammadipour, A. Farhadi, S. Malek, Y. Yazdanifard, A. Khasahmadi, and V. Honavar. Brains vs. bytes: Evaluating llm proficiency in olympiad mathematics, 2025.
[20] H. Masoom, A. Huang, M. Z. Horv´ath, T. Zahavy, V. Veeriah, E. Wieser, J. Yung, L. Yu, Y. Schroecker, J. Schrit- twieser, O. Bertolli, B. Ibarz, E. Lockhart, E. Hughes, M. Rowland, G. Margand, A. Davies, D. Zheng, I. Be- loshapka, I. von Glehn, Y. Li, F. Pedregosa, A. Velingker, G. ˇZuˇzi´c, O. Nash, B. Mehta, P. Lezeau, S. Mercuri, L. Wu, C. Soenne, T. Murrills, L. Massacci, A. Yang, A. Mandhane, T. Eccles, E. Ayg¨un, Z. Gong, R. Evans, S. Mokr´a, A. Barekatain, W. Shang, H. Openshaw, F. Gimeno, D. Silver, and P. Kohli. AI achieves silver-medal standard solving International Mathematical Olympiad problems. <https://deepmind.google/discover/> blog/ai-solves-imo-problems-at-silver-medal-level/, 2024.
[21] V. Mnih, K. Kavukcuoglu, D. Silver, A. A. Rusu, J. Veness, M. G. Bellemare, A. Graves, M. Riedmiller, A. K. Fidjeland, G. Ostrovski, S. Petersen, C. Beattie, A. Sadik, I. Antonoglou, H. King, D. Kumaran, D. Wierstra, S. Legg, and D. Hassabis. Human-level control through deep reinforcement learning. Nature, 518(7540):529–533, 2015.
[22] M. Moravˇc´ık, M. Schmid, N. Burch, V. Lis`y, D. Morrill, N. Bard, T. Davis, K. Waugh, M. Johanson, and M. Bowl- ing. Deepstack: Expert-level artificial intelligence in heads-up no-limit poker. Science, 356(6337):508–513, 2017.
[23] OpenAI. Openai o1 mini: Advancing cost-efficient reasoning. <https://openai.com/index/> openai-o1-mini-advancing-cost-efficient-reasoning/, 2024.
[24] OpenAI. Introducing Operator. <https://openai.com/index/introducing-operator>, 2025.
[25] L. Ouyang, J. Wu, X. Jiang, D. Almeida, C. L. Wainwright, P. Mishkin, C. Zhang, S. Agarwal, K. Slama, A. Ray, J. Schulman, J. Hilton, F. Kelton, L. Miller, M. Simens, A. Askell, P. Welinder, P. Christiano, J. Leike, and R. Lowe. Training language models to follow instructions with human feedback, 2022.
[26] J. Perolat, B. D. Vylder, D. Hennes, E. Tarassov, F. Strub, V. de Boer, P. Muller, J. T. Connor, N. Burch, T. Anthony, S. McAleer, R. Elie, S. H. Cen, Z. Wang, A. Gruslys, A. Malysheva, M. Khan, S. Ozair, F. Timbers, T. Pohlen, T. Eccles, M. Rowland, M. Lanctot, J.-B. Lespiau, B. Piot, S. Omidshafiei, E. Lockhart, L. Sifre, N. Beauguer- lange, R. Munos, D. Silver, S. Singh, D. Hassabis, and K. Tuyls. Mastering the game of Stratego with model-free multiagent reinforcement learning. Science, 378(6623):990–996, 2022.
[27] I. Petrov, J. Dekoninck, L. Baltadzhiev, M. Drencheva, K. Minchev, M. Balunovi´c, N. Jovanovi´c, and M. Vechev. Proof or bluff? evaluating llms on 2025 usa math olympiad, 2025.
[28] M. Sadler and N. Regan. Game Changer. New in Chess, 2019.
[29] J. Schrittwieser, I. Antonoglou, T. Hubert, K. Simonyan, L. Sifre, S. Schmitt, A. Guez, E. Lockhart, D. Hassabis, T. Graepel, T. P. Lillicrap, and D. Silver. Mastering Atari, Go, chess and shogi by planning with a learned model. Nature, 588:604 – 609, 2019.
[30] D. Schurmanns. Memory augmented large language models are computationally universal. arXiv preprint arXiv:2501.12948, 2023.
[31] D. Silver, A. Huang, C. J. Maddison, A. Guez, L. Sifre, G. Van Den Driessche, J. Schrittwieser, I. Antonoglou, V. Panneershelvam, M. Lanctot, S. Dieleman, D. Grewe, J. Nham, N. Kalchbrenner, I. Sutskever, T. Lillicrap, M. Leach, K. Kavukcuoglu, T. Graepel, and D. Hassabis. Mastering the game of Go with deep neural networks and tree search. Nature, 529(7587):484–489, 2016.
[32] D. Silver, T. Hubert, J. Schrittwieser, I. Antonoglou, M. Lai, A. Guez, M. Lanctot, L. Sifre, D. Kumaran, T. Graepel, T. Lillicrap, K. Simonyan, and D. Hassabis. A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play. Science, 362(6419):1140–1144, 2018.
[33] D. Silver, J. Schrittwieser, K. Simonyan, I. Antonoglou, A. Huang, A. Guez, T. Hubert, L. Baker, M. Lai, A. Bolton, Y. Chen, T. Lillicrap, F. Hui, L. Sifre, G. van den Driessche, T. Grapel, and D. Hassabis. Mastering the game of go without human knowledge. Nature, 550(7676):354–359, 2017.
[34] D. Silver, S. Singh, D. Precup, and R. S. Sutton. Reward is enough. Artificial Intelligence, 299:103535, 2021.
[35] R. S. Sutton. Learning to predict by the methods of temporal differences. Machine Learning, 3:9–44, 1988.
[36] R. S. Sutton. Integrated architectures for learning, planning, and reacting based on approximating dynamic pro- gramming. In Proceedings of the Seventh International Conference on Machine Learning, pages 216–224. Morgan Kaufmann, 1990.
[37] R. S. Sutton and A. G. Barto. Reinforcement Learning: An Introduction. The MIT Press, second edition, 2018.
[38] R. S. Sutton, D. Precup, and S. Singh. Between mdps and semi-mdps: A framework for temporal abstraction in reinforcement learning. Artificial Intelligence, 112(1-2):181–211, 1999.
[39] G. Tesauro. TD-Gammon, a self-teaching backgammon program, achieves master-level play. Neural Computation, 6(2):215–219, 1994.
[40] O. Vinyals, I. Babuschkin, W. M. Czarnecki, M. Mathieu, A. Dudzik, J. Chung, D. Choi, R. Powell, T. Ewalds, P. Georgiev, J. Oh, D. Horgan, M. Kroiss, I. Danihelka, A. Huang, L. Sifre, T. Cai, J. P. Agapiou, M. Jaderberg, A. S. Vezhnevets, R. Leblond, T. Pohlen, V. Dalibard, D. Budden, Y. Sulsky, J. Molloy, T. L. Paine, C. Gulcehre, Z. Wang, T. Pfaff, Y. Wu, R. Ring, D. Yogatama, D. W¨unsch, K. McKinney, O. Smith, T. Schaul, T. P. Lillicrap, K. Kavukcuoglu, D. Hassabis, C. Apps, and D. Silver. Grandmaster level in StarCraft II using multi-agent reinforcement learning. Nature, 575:350 – 354, 2019.
[41] P. R. Wurman, S. Barrett, K. Kawamoto, J. MacGlashan, K. Subramanian, T. J. Walsh, R. Capobianco, A. Devlic, F. Eckert, F. Fuchs, L. Gilpin, P. Khandelwal, V. Kompella, H. Lin, P. MacAlpine, D. Oller, T. Seno, C. Sherstan, M. D. Thomure, H. Aghabozorgi, L. Barrett, R. Douglas, D. Whitehead, P. D¨urr, P. Stone, M. Spranger, and H. Ki- tano. Outracing champion Gran Turismo drivers with deep reinforcement learning. Nature, 602(7896):223–228, 2022.
[42] M. S. Yang, D. Schuurmans, P. Abbeel, and O. Nachum. Chain of thought imitation with procedure cloning. In S. Koyejo, S. Mohamed, A. Agarwal, D. Belgrave, K. Cho, and A. Oh, editors, Advances in Neural Information Processing Systems, volume 35, pages 36366–36381. Curran Associates, Inc., 2022.
[43] S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, and Y. Cao. React: Synergizing reasoning and acting in large language models. In 11th International Conference on Learning Representations, 2023.
[44] E. Zelikman, J. M. Mu, N. D. Goodman, and G. Poesia. Star: Bootstrapping reasoning with reasoning. Advances in Neural Information Processing Systems, 35:24170–24184, 2022.
[45] Y. Zhou. Rethinking Opening Strategy: AlphaGo's Impact on Pro Play. CreateSpace Independent, 2018.

**注記:**

* \* この論文は、MIT Pressから出版される書籍「Designing an Intelligence」の章のプレプリントです。
* 脚注
    1. RLアルゴリズムは、試行錯誤、すなわち環境との相互作用の経験から行動を適応させることによって目標を達成することを学習するアルゴリズムです。適応は、例えばニューラルネットワークの重みを更新することによって、または環境からのフィードバックに基づいてコンテキスト内で適応することによって、あらゆる手段で行うことができます。
    2. 経験と人間データは正反対ではありません。例えば、犬は完全に経験から学習しますが、人間との相互作用はその経験の一部です。
    3. Reward-is-enough仮説は、知能とその関連能力は、報酬の最大化から自然に生じる可能性があることを示唆しています。これには、人間の相互作用や人間のフィードバックに基づく報酬を含む環境が含まれる場合があります。
    4. この場合、接地された人間のフィードバックを、エージェントの全体的な目的を形成する単一の報酬関数として見ることもできます。これは、豊富で接地されたフィードバックに基づいて固有の報酬関数[8]を構築および最適化することによって最大化されます。
* PDF内の図(Figure 1)は視覚的なものであるため、内容をテキストで説明しました。その他の画像、チャート、図表に関する言及はありませんでした。
