---
title: "AI幻覚は悪化の一途を辿り今後も続く：o3モデルはなぜ間違いが多いのか？"
source: "https://nazology.kusuguru.co.jp/archives/177278"
author:
  - "川勝康弘"
published: 2025-05-12
created: 2024-07-26
description: |
  OpenAIの最新LLM「o3」と「o4-mini」は推論力が向上したものの、幻覚（ハルシネーション）の発生率が従来モデルより悪化。特にo3は人物課題で幻覚率が約33%とo1の倍増、o4-miniは48%と深刻。一般課題でもo3はo1よりわずかに悪化、o4-miniは極めて不安定。高性能モデルでの幻覚増加の原因は不明で、業界に衝撃を与えている。タスク遂行能力は向上したが信頼性は低下しており、特に正確性が重要な分野での利用には懸念がある。
tags:
  - "AI"
  - "人工知能"
  - "LLM"
  - "OpenAI"
  - "o3"
  - "o4-mini"
  - "幻覚"
  - "ハルシネーション"
  - "clippings"
---

## 巨大化の次は"思考強化"──推論エンジン誕生の舞台裏

[![巨大化の次は"思考強化"──推論エンジン誕生の舞台裏](https://nazology.kusuguru.co.jp/wp-content/uploads/2025/05/9dc47a1e44eba5b92ab8b023a7a1c0c6-900x506.jpg)](https://nazology.kusuguru.co.jp/archives/177278/16%EF%BC%99-2025430%E3%82%88%E3%82%8A-2025-05-12t162715-712)

*巨大化の次は"思考強化"──推論エンジン誕生の舞台裏 / Credit:Canva*

近年、[AI](https://nazology.kusuguru.co.jp/archives/tag/ai "AIについて")研究の焦点は単純にモデルを巨大化することから、「推論力」を高める方向へとシフトしています。

従来のGPT-4系モデルがマルチモーダル（テキスト・音声・画像対応）や高速化を追求してきた一方で、OpenAIのoシリーズは複雑な問題解決や論理的思考、コード生成など「考える力」を強化するために設計された系統です。

なぜ推論力の強化が目指されたのでしょうか？

背景には、大規模言語モデル（LLM）が高度な知識を持ちながらも、複数ステップにわたる推論や論理的整合性を要する場面でミスを犯しがちだったことがあります。

**モデルを大きくすれば精度は上がるものの、ある段階からは「考え方」を工夫しないと得られる成果に頭打ちが見え始めたのです。**

その打開策として生まれたのが、モデル自身により長く深く考えさせるアプローチです。

[![各モデルの立ち位置と特徴のまとめ](https://nazology.kusuguru.co.jp/wp-content/uploads/2025/05/4c88912ee1d33b20680bf31afb5e7b29-900x506.jpg)](https://nazology.kusuguru.co.jp/archives/177278/16%EF%BC%99-2025430%E3%82%88%E3%82%8A-2025-05-12t163841-900)

*各モデルの立ち位置と特徴のまとめ / Credit:[OpenAI o3 and o4-mini System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf)*

o3やo4-miniでは回答を出す前に内部で長い「思考の連鎖 (Chain of Thought)」を巡らせ、あたかも人間が頭の中で段取りを踏むように結論を導き出します。

例えば数学の難問やプログラミングのデバッグといった多面的な分析が必要な課題でも、小さなステップに分解して推論するため、より正確な解答を出せるよう設計されています。

また、この新モデルはあらゆるツールを自律的に活用できる点も画期的です。

インターネットでの情報検索、Pythonスクリプトによるデータ解析、画像生成や画像認識といったツールを、必要に応じて自ら判断して使いこなすことで、複雑なタスクをエンドツーエンドで実行できるのです。

視覚情報についても、単に画像を説明するに留まらず「画像と一緒に考える」ことが可能になりました。

例えばホワイトボードに書かれた数式の写真を与えれば、画像を回転・拡大しながら内容を読み取って推論を進めるといった、人間さながらの問題解決も実現しています。

こうした推論力の強化により、最新モデルはさまざまなベンチマークで従来を上回る成績を収めています。

**o3はプログラミング競技やビジネス分析などの難問で従来モデル（o1）より重大な誤りが減少し、特にプログラミングやコンサルティング、創造的発想の分野で「分析が緻密で新しい仮説を批判的に評価できる」と高く評価されました。**

小型モデルのo4-miniも非常に効率が良く、o1よりプログラミングや数学のベンチマークで高い正解率を示しています。

このように、OpenAIが目指したのは人間のように道具を使いながら深く考え、難問に取り組めるAIです。

その目的は、高度化するユーザーのニーズに応え、より信頼でき有用なAIアシスタントを実現することにありました。

# AI幻覚は悪化の一途を辿り今後も続く：o3モデルはなぜ間違いが多いのか？

## o3モデルは「賢く」でも「間違いが多く」進化した

[![o3モデルは「賢く」でも「間違いが多く」進化した](https://nazology.kusuguru.co.jp/wp-content/uploads/2025/05/2fa3fff1fd6898d324a994d3750ce887-900x506.jpg)](https://nazology.kusuguru.co.jp/archives/177278/16%EF%BC%99-2025430%E3%82%88%E3%82%8A-2025-05-12t161024-488)
*o3モデルは「賢く」でも「間違いが多く」進化した / Credit: [OpenAI o3 and o4-mini System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf)*

OpenAI社の報告書によると、最新の大規模言語モデル「o3」と「o4-mini」の幻覚（ハルシネーション）傾向を評価するテストが実施されました。

テストは以下の2つの課題で行われました。

1. **人物課題**: 有名人や歴史上の人物に関する質問で、知識の正確さと架空情報の生成を評価。
2. **一般課題**: 百科事典的な事実に関する4000問の多肢選択問題で、正答率と幻覚率（誤情報を含む割合）を測定。

[![幻覚率の比較](https://nazology.kusuguru.co.jp/wp-content/uploads/2025/05/ac2e39f7cff89682511de0d596901b1e-900x506.jpg)](https://nazology.kusuguru.co.jp/archives/177278/16%EF%BC%99-2025430%E3%82%88%E3%82%8A-2025-05-12t155855-978)
*幻覚率の比較 / Credit: [OpenAI o3 and o4-mini System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf)*

### テスト結果

* **人物課題**:
  * **o3 (最新大モデル)**: 幻覚率 約33% (旧モデルo1の約16%からほぼ倍増)
  * **o4-mini (最新小モデル)**: 幻覚率 48% (回答のほぼ半数が幻覚)
  * 正答率はo3 (59%) がo1 (47%) よりやや向上。
* **一般課題**:
  * **o3**: 幻覚率 51% (o1の44%よりわずかに悪化)
  * **o4-mini**: 幻覚率 79%、正答率 20% (極めて不安定)
  * 正答率はo3 (49%) とo1 (47%) でほぼ同等。

### 考察と影響

* o4-miniの不振は「小型ゆえの限界」と説明可能。
* しかし、高性能なはずの**o3の幻覚率が先代モデルより悪化した**ことは、研究者にとっても予想外であり、「新しいモデルほど幻覚は減る」という従来の傾向を覆す結果となった。
* OpenAIはこの原因を現時点では特定できておらず、さらなる研究が必要であると認めている。
* 外部機関 (Transluce) の検証でもo3の幻覚傾向は確認されており、架空のプロセスや存在しないURLを生成する例が報告されている。
* 著者自身の経験でも、o3が関連研究の論文名やリンク、雑誌名を生成する際に、もっともらしいが実際には存在しない情報を提示するケースが頻繁に見られた。
* **トレードオフ**: 新モデルはプログラミング、数学、画像解析、マルチステップ推論などのタスク遂行能力は飛躍的に向上したが、事実性・信頼性の面では劣るというトレードオフが生じている。
* **懸念**: この傾向はAIモデルの信頼性に対する不安を掻き立て、特に医療・法務など正確性が重視される分野では、旧世代のo1の方が安全かもしれないという指摘もある。
* **対策**: 従来モデル (GPT-4o) ではWeb検索との組み合わせで高精度が報告されており、外部ツールでの事実確認が幻覚抑制に有効である可能性が期待される。しかし、新モデルではツールを駆使しても事実誤りが減っておらず、今後の課題となっている。
