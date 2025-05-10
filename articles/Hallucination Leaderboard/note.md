# Hallucination Leaderboard

ref: <https://github.com/vectara/hallucination-leaderboard>

## Hallucination Leaderboard 要約

Vectara社が提供する、大規模言語モデル（LLM）が短いドキュメントを要約する際にどの程度の頻度でハルシネーション（幻覚、もっともらしい誤情報）を生成するかを比較する公開リーダーボードです。

### 概要

* **目的**: LLMがドキュメント要約時にハルシネーションを生成する頻度を評価・比較する。
* **評価モデル**: Vectara社の Hughes Hallucination Evaluation Model (HHEM) を使用。
  * 現在のランキングは HHEM-2.1 に基づく。
  * HHEM-1.0 に基づく過去のランキングは[こちら](https://github.com/vectara/hallucination-leaderboard/tree/hhem-1.0-final)で確認可能。
* **更新頻度**: Vectara社のモデルおよびLLMの更新に伴い、定期的に更新予定。
* **Hugging Face**: [Hugging Face上のリーダーボード](https://huggingface.co/spaces/vectara/leaderboard)も参照可能。
* **追悼**: [Simon Mark Hughes氏](https://www.ivinsfuneralhome.com/obituaries/Simon-Mark-Hughes?obId=30000023)を追悼しています。
  * 画像: [![](/vectara/hallucination-leaderboard/raw/main/img/candle.png)](https://github.com/vectara/hallucination-leaderboard/blob/main/img/candle.png)

### 最新ランキング (2025年4月29日更新)

* **グラフ**: [様々なLLMのハルシネーション率のプロット](/vectara/hallucination-leaderboard/raw/main/img/hallucination_rates_with_logo.png)
  * [![Plot: hallucination rates of various LLMs](/vectara/hallucination-leaderboard/raw/main/img/hallucination_rates_with_logo.png)](https://github.com/vectara/hallucination-leaderboard/blob/main/img/hallucination_rates_with_logo.png)

* **主要モデルのパフォーマンス (一部抜粋)**:

    | Model                           | Hallucination Rate | Factual Consistency Rate | Answer Rate | Average Summary Length (Words) |
    | :------------------------------ | :----------------- | :----------------------- | :---------- | :----------------------------- |
    | Google Gemini-2.0-Flash-001     | 0.7 %              | 99.3 %                   | 100.0 %     | 65.2                           |
    | Google Gemini-2.0-Pro-Exp       | 0.8 %              | 99.2 %                   | 99.7 %      | 61.5                           |
    | OpenAI o3-mini-high             | 0.8 %              | 99.2 %                   | 100.0 %     | 79.5                           |
    | Vectara Mockingbird-2-Echo      | 0.9 %              | 99.1 %                   | 100.0 %     | 74.0                           |
    | OpenAI GPT-4.5-Preview          | 1.2 %              | 98.8 %                   | 100.0 %     | 77.0                           |
    | ... (その他多数のモデル)        | ...                | ...                      | ...         | ...                            |
    | TII falcon-7B-instruct          | 29.9 %             | 70.1 %                   | 90.0 %      | 75.5                           |

  * **注**: 完全なリストは元のリポジトリを参照してください。

### 評価モデル (HHEM)

* このリーダーボードでは、Vectaraの商用ハルシネーション評価モデルであるHHEM-2.1を使用してLLMランキングを算出しています。
* オープンソース版のHHEM-2.1-Openは[Hugging Face](https://huggingface.co/vectara/hallucination_evaluation_model)および[Kaggle](https://www.kaggle.com/models/vectara/hallucination_evaluation_model)で入手可能です。

### データ

* モデル評価に使用された生成済み要約は[こちらのデータセット](https://huggingface.co/datasets/vectara/leaderboard_results)で確認できます。

### 関連研究

この分野における主要な先行研究として、以下の論文が挙げられています。

* [SUMMAC: Re-Visiting NLI-based Models for Inconsistency Detection in Summarization](https://aclanthology.org/2022.tacl-1.10.pdf)
* [TRUE: Re-evaluating Factual Consistency Evaluation](https://arxiv.org/pdf/2204.04991.pdf)
* [TrueTeacher: Learning Factual Consistency Evaluation with Large Language Models](https://browse.arxiv.org/pdf/2305.11171v1.pdf)
* [ALIGNSCORE: Evaluating Factual Consistency with A Unified Alignment Function](https://arxiv.org/pdf/2305.16739.pdf)
* [MiniCheck: Efficient Fact-Checking of LLMs on Grounding Documents](https://arxiv.org/pdf/2404.10774)
* 包括的なリスト: <https://github.com/EdinburghNLP/awesome-hallucination-detection>

### 方法論

* **詳細**: モデル構築の詳細な説明は、ブログ記事「[Cut the Bull…. Detecting Hallucinations in Large Language Models](https://vectara.com/blog/cut-the-bull-detecting-hallucinations-in-large-language-models/)」を参照してください。
* **評価プロセス**:
    1. LLM出力のハルシネーションを検出するモデルを訓練。
    2. 各LLMに1000件の短いドキュメントを提示し、ドキュメント内の事実にのみ基づいて要約を作成するよう指示。
    3. 全モデルが要約した831件のドキュメントを使用して、各モデルの全体的な事実整合率（ハルシネーションなし）とハルシネーション率を算出。
    4. モデルがプロンプトへの応答を拒否する率は「Answer Rate」列に記載。
    5. 使用ドキュメントは主に [CNN / Daily Mail Corpus](https://huggingface.co/datasets/cnn_dailymail/viewer/1.0.0/test) から取得。
    6. LLM呼び出し時の **temperature は 0** を使用。
* **評価対象**: 全体的な事実精度ではなく、要約の事実整合率を評価。これは、モデルの応答を提供された情報と比較できるようにするためです。
* **RAGシステムとの関連**: このリーダーボードは、検索拡張生成（RAG）システムにおけるモデルの精度を示す良い指標ともなります。

### 使用されたプロンプト

```
You are a chat bot answering questions using data. You must stick to the answers provided solely by the text in the passage provided. You are asked the question 'Provide a concise summary of the following passage, covering the core pieces of information described.' <PASSAGE>'
```

API呼び出し時、`<PASSAGE>` トークンはソースドキュメントに置き換えられます。

### API統合の詳細

各LLMモデルとその特定のエンドポイントに関する詳細な概要が記載されています。OpenAI、Llama、Cohere、Anthropic、Mistral AI、Google、Amazon、Microsoft、TII、Intel、Databricks、Snowflake、Apple、01-AI、Zhipu AI、Qwen、AI21、DeepSeek、IBM、XAI、AllenAI、InternLMなど、多数のモデルプロバイダーとモデルバージョンがリストアップされています。詳細なエンドポイント名やアクセス方法は元のリポジトリを参照してください。

### よくある質問 (FAQ)

* **Q. なぜモデルを使ってモデルを評価するのか？**
  * **A.** 人手による評価はスケーラビリティに欠け、継続的な更新が困難なため。再現性のあるプロセスを共有し、他の人が自身のモデル評価に利用できるようにするため。ハルシネーション検出モデルの構築は、ハルシネーションを生成しない生成モデルの構築よりもはるかに容易であるため。
* **Q. LLMがドキュメントの要約を拒否したり、非常に短い回答を提供したりした場合はどうなるのか？**
  * **A.** これらは明示的に除外。「Answer Rate」列と「Average Summary Length」列で詳細を確認可能。
* **Q. どのバージョンのモデルXYZを使用したのか？**
  * **A.** API詳細セクションを参照。
* **Q. モデルは回答しないか非常に短い回答を提供することで100%のスコアを得られるのではないか？**
  * **A.** そのような応答は除外し、全モデルが要約を提供したドキュメントのみで最終評価を実施。
* **Q. 元の要約からコピー＆ペーストする抽出型要約モデルはこのタスクで100%（ハルシネーション0）になるのではないか？**
  * **A.** その通り。要約の品質ではなく、事実整合性のみを評価している。
* **Q. 元のテキストを要約としてコピーするだけで簡単にハックできる指標のように思えるが。**
  * **A.** その通りだが、任意のモデルを評価しているわけではない。この指標は、他の評価（要約品質、質疑応答の精度など）と並行して使用することを推奨。
* **Q. これではモデルがハルシネーションを起こすすべての方法を決定的に測定しているわけではない。**
  * **A.** 同意する。ハルシネーション検出の問題を解決したと主張するものではなく、このプロセスをさらに拡大・強化する予定。
* **Q. 一部のモデルは要約中にのみハルシネーションを起こす可能性がある。既知の事実のリストを提供し、それをどれだけ正確に想起できるかを確認するだけではダメなのか？**
  * **A.** それは不適切なテスト。訓練データが不明なため、モデルが実際のデータに基づいて応答しているのか推測しているのか確認できない。また、「既知の」の明確な定義もない。
* **Q. これは良い出発点だが、決定的なものではない。**
  * **A.** 完全に同意する。やるべきことはまだ多く、問題は解決にはほど遠い。しかし、「良い出発点」は、この分野で進歩が始まることを意味し、モデルをオープンソース化することで、コミュニティを巻き込み、これを次のレベルに引き上げることを期待している。

### 今後の予定

* 引用精度のリーダーボードを追加予定。
* 複数ドキュメント要約など、他のRAGタスクもカバーするようベンチマークを拡大予定。
* 英語以外の言語もカバーする予定。

### リポジトリ情報

* **トピック**: hallucinations, llm, generative-ai
* **ライセンス**: Apache-2.0 license
* **Star数**: 2.3k
* **Fork数**: 77
* **コントリビューター**: 14名 (詳細はリポジトリ参照)
* **言語**: Python 100.0%
