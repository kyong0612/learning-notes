# Prompt FormattingはLLMの性能にどのように影響するのか？

ref: <http://medical-science-labo.jp/prompt-formatting/>

![](https://medical-science-labo.jp/wp-content/uploads/e9900ff80ec1d07bdafc834906c571aa.png)

AIの進化によって、LLM（大規模言語モデル）は私たちの業務や研究における中心的な役割を担っています。しかし、同じタスクを実行する場合でも、「Promptの書き方」次第でモデルの出力が大きく変わることは、意外と見過ごされがちです。

今回の研究では、Prompt Formatting（プロンプトの形式や構造）がモデルのパフォーマンスにどの程度影響を与えるのかを、科学的に検証したものが発表されていますのでご紹介します。

[https://arxiv.org/abs/2411.10541](https://arxiv.org/abs/2411.10541)

以下では、この研究の結果を詳しく説明し、Prompt設計を探ります。

![](http://medical-science-labo.jp/wp-content/uploads/e9900ff80ec1d07bdafc834906c571aa.png)

**【本記事のもくじ】**

* * *

目次

- [1 Prompt Formattingとは？](https://medical-science-labo.jp/prompt-formatting/#outline_1__1)
  - [1.1 1\. Plain Text](https://medical-science-labo.jp/prompt-formatting/#outline_1__1_1)
  - [1.2 2\. Markdown](https://medical-science-labo.jp/prompt-formatting/#outline_1__1_2)
  - [1.3 3\. JSON](https://medical-science-labo.jp/prompt-formatting/#outline_1__1_3)
  - [1.4 4\. YAML](https://medical-science-labo.jp/prompt-formatting/#outline_1__1_4)
- [2 研究の目的](https://medical-science-labo.jp/prompt-formatting/#outline_1__2)
- [3 研究手法](https://medical-science-labo.jp/prompt-formatting/#outline_1__3)
  - [3.1 1\. 使用したデータセット](https://medical-science-labo.jp/prompt-formatting/#outline_1__3_1)
  - [3.2 2\. フォーマットの統一](https://medical-science-labo.jp/prompt-formatting/#outline_1__3_2)
  - [3.3 3\. モデルの種類](https://medical-science-labo.jp/prompt-formatting/#outline_1__3_3)
- [4 結果と考察](https://medical-science-labo.jp/prompt-formatting/#outline_1__4)
  - [4.1 1\. フォーマットが性能に与える影響（Sensitivity）](https://medical-science-labo.jp/prompt-formatting/#outline_1__4_1)
  - [4.2 2\. 一貫性の向上（Consistency）](https://medical-science-labo.jp/prompt-formatting/#outline_1__4_2)
  - [4.3 3\. フォーマットの転移性（Transferability）](https://medical-science-labo.jp/prompt-formatting/#outline_1__4_3)
- [5 実践的なアドバイス](https://medical-science-labo.jp/prompt-formatting/#outline_1__5)
- [6 結論](https://medical-science-labo.jp/prompt-formatting/#outline_1__6)

### **Prompt Formattingとは？**

Prompt Formattingは、LLMに指示を与える際の「フォーマット」のことを指します。単に入力内容を作成するだけでなく、その形式や構造を工夫することで、モデルの解釈や応答を効果的に制御できます。今回の研究で用いられたフォーマットには以下の4種類があります。

#### **1\. Plain Text**

通常の文章形式です。見た目に特別な構造を持たず、モデルがシンプルなテキストとして解釈します。

#### **2\. Markdown**

見出しや箇条書きといった構造化された書式を用いた形式です。情報が階層的に整理され、モデルが文脈を把握しやすくなる場合があります。

#### **3\. JSON**

データ構造として広く利用されているフォーマットで、キーと値のペアで情報を記述します。具体的で分かりやすい指示を与えるのに適しています。

#### **4\. YAML**

JSONと似たデータ構造フォーマットですが、人間にとって読みやすく設計されています。空白やインデントを多用することで構造を表現します。

このように、同じ指示内容でもフォーマットが異なるだけで、モデルの理解や出力が変わる可能性があります。

* * *

### **研究の目的**

本研究の目的は、異なるPrompt FormattingがLLMの性能にどのような影響を及ぼすのかを体系的に評価することです。特に以下の3点に焦点を当てました：

1. **Sensitivity（感度）：**

モデルの性能がフォーマットによってどの程度変動するのか。

2. **Consistency（一貫性）：**

異なるフォーマットで同じタスクを実行した場合、出力の一貫性はどの程度保たれるのか。

3. **Transferability（転移性）：**

あるモデルで効果的だったフォーマットが、他のモデルでも同様の効果を発揮するのか。

* * *

### **研究手法**

#### **1\. 使用したデータセット**

本研究では、以下のタスクとデータセットを使用しました。

- **自然言語タスク（NL2NL）：**

例として、MMLU（多分野の問題を含むベンチマーク）やNER Finance（金融ドキュメントからのエンティティ抽出）を使用。

- **コード生成タスク（NL2Code）：**

HumanEval（Pythonプログラミング問題）やFIND（関数記述の推論タスク）を利用。

- **コード翻訳タスク（Code2Code）：**

CODEXGLUE（JavaとC#の相互翻訳）、HumanEval-X（JavaからPythonへの翻訳）を用いて、プログラミング言語間の変換能力を評価。

#### **2\. フォーマットの統一**

各フォーマットで与えるタスク内容（指示、例、期待される出力形式）は、意味や文脈が統一されるよう注意深く設計されました。違いは構造や書式だけで、内容の変化はありません。

#### **3\. モデルの種類**

OpenAIのGPTシリーズを中心に、以下のモデルを用いました：

- **GPT-3.5シリーズ：**

GPT-3.5-turbo（4kコンテキストウィンドウ）とGPT-3.5-turbo-16k（16kコンテキストウィンドウ）。

- **GPT-4シリーズ：**

GPT-4-32k（32kコンテキストウィンドウ）とGPT-4-1106-preview（高速化バージョン）。

* * *

### **結果と考察**

#### **1\. フォーマットが性能に与える影響（Sensitivity）**

結果として、モデルの性能がフォーマットによって大きく変化することが確認されました。

- **JSONの優位性：**

コード翻訳タスク（CODEXGLUE）では、JSON形式を使用した場合、Markdown形式に比べて最大40％の性能向上を示しました。

- **Markdownの安定性：**

自然言語タスクではMarkdownが優位で、一部のモデルでは最も高いスコアを記録しました。

一方で、GPT-4はGPT-3.5に比べてフォーマット変更の影響を受けにくく、どの形式でも比較的一貫した結果を提供しました。

#### **2\. 一貫性の向上（Consistency）**

異なるフォーマット間で出力がどの程度一致するかを測定したところ、モデルのサイズが大きいほど一貫性が高いことが分かりました。

- GPT-3.5ではフォーマット間の一致率が16％と低かったのに対し、GPT-4では50％以上の一致率を記録しました。

#### **3\. フォーマットの転移性（Transferability）**

異なるモデル間で最適なフォーマットを共有できるか検証した結果、モデル間の転移性は限定的であることがわかりました。GPT-3.5とGPT-4では、最適なフォーマットが異なる場合が多く、 **モデルに特化したPrompt設計が必要** であることが示唆されました。

* * *

### **実践的なアドバイス**

1. **タスクに最適なフォーマットを選択する：**
   - 自然言語処理タスク：MarkdownまたはPlain Text。
   - コード生成・翻訳タスク：JSONが有効。
2. **モデルに応じた設計を心がける：**

GPT-4はフォーマットの影響が少ないため、設計の自由度が高い一方で、GPT-3.5では特定のフォーマットが大きな効果を発揮することがあります。

3. **一貫性をテストする：**

フォーマットを変えた際に出力がどの程度一貫しているかを確認し、不一致が多い場合はモデルやフォーマットを再考する必要があります。

* * *

### **結論**

本研究から明らかになったのは、Prompt FormattingがLLMの性能を大きく左右するという事実です。特に、モデルやタスクごとに最適なフォーマットを選択することで、性能や一貫性を大幅に向上させることができます。GPT-4のような新しいモデルはフォーマットの影響が少ないものの、それでも最適なフォーマット選択は有益です。

LLMのパフォーマンスを最大化するには、Prompt設計を軽視せず、試行錯誤を繰り返すことが必要です。
