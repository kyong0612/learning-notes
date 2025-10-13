---
title: "プロンプトエンジニアリングを終わらせるDSPy"
source: "https://zenn.dev/cybernetics/articles/39fb763aca746c"
author:
  - "HELLO_CYBERNETICS"
published: 2025-10-09
created: 2025-10-13
description: |
  DSPyフレームワークによる自動プロンプト最適化の可能性と実践的な使用例を解説。手動プロンプトエンジニアリングを機械学習問題に置き換え、PyTorchライクなインターフェースで訓練可能にする革新的アプローチを紹介。
tags:
  - "AI"
  - "Python"
  - "LLM"
  - "Agent"
  - "DSPy"
  - "プロンプト最適化"
  - "機械学習"
---

## はじめに

DSPyは、手動プロンプトエンジニアリングを排除できる可能性を持つフレームワークです。PyTorchやChainerに似た使用感を持ち、「人手で頑張ってきたことをパラメータに置き換え、教師データで訓練する」という方針を実現しています。

### ディープラーニングとの類似性

- **ディープラーニング**: 人手での特徴量エンジニアリングを排除し、中間層として学習
- **Prompt Optimization**: 人手でのプロンプトエンジニアリングを排除し、調整可能プロンプトとして学習

プロンプトエンジニアリングは、大規模言語モデルを分析対象とした特徴量エンジニアリングのようなものと見なせます。DSPyは、ディープラーニングのように**プロンプト自体を訓練する**という自然な発想を実現します。

## DSPyの基本概念

DSPyの重要な特徴は、**プロンプトを明示的に書かずに、入出力のシグネチャとやってほしい処理を与えれば出力を得られる**という形式です。

### 機械学習問題としての定式化

最適化問題は以下のように表現されます:

$$\hat{p} = \argmin_{p} \frac{1}{N}\sum_{i=1}^{N} \mathcal{L}\big(f_\theta([p;\,\mathbf{z}_{usr}^{(i)}]),\,x_i\big)$$

埋め込まれた前置きのプロンプト $p$ を適切に決定することで、ユーザーの様々な問いかけに対応できるようになります。この目的関数は必ずしも微分可能でなくてもよく、勾配フリーな最適化手法を使用できます。

## 実践例：ナルト口調変換

記事では、「丁寧語をナルト口調に変換し、余計な一言を追加する」というタスクを通じて、DSPyの実装例を示しています。

### 1. モデルの作成

```python
class NarutoSignature(dspy.Signature):
    polite_sentence = dspy.InputField(desc="です・ます調の落ち着いた一文")
    rationale = dspy.OutputField(desc="ナルトの喋りへ変換する際の推論過程")
    transformed = dspy.OutputField(desc="ナルト口調に変換した文。『でもさ、』以降に余計な一言を必ず添える")

class NarutoStyleChain(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generator = dspy.ChainOfThought(NarutoSignature)

    def forward(self, polite_sentence):
        return self.generator(polite_sentence=polite_sentence)
```

`InputField`は推論時にユーザーが与える項目、`OutputField`はエージェントが出力する項目を定義します。

### 2. 最適化前の出力

```python
polite_sentence = "今日の会議では議論を丁寧にまとめます。"
```

**出力**:

```
生成推論: ナルトは、友達や仲間に対してフレンドリーでカジュアルな言葉遣いをするキャラクターです...
生成出力: 今日の会議では議論を丁寧にまとめるよ。でもさ、みんなの意見もちゃんと聞かないとね！
```

この結果は、ナルトらしくなく、「でもさ」の後の接続も不自然です。

### 3. 教師データの作成

```python
easy_example = dspy.Example(
    polite_sentence="今日の会議では議論を丁寧にまとめます。",
    transformed="オレが今日の会議をビシッとまとめてやるってばよ！でもさ、終わったらラーメン一杯くらい付き合ってくれよな？",
    rationale="敬体をくだけた一人称『オレ』に置き換え、語尾へ『ってばよ』を追加し、『でもさ、』で余計なお願いをぶつけた。"
).with_inputs("polite_sentence")
```

実産業では、「こうなってほしい」という例示が集まっているケースが相応にあるため、これらを活用できます。

### 4. 評価指標の設定

DSPyでは微分可能である必要がないため、LLMに評価させるブラックボックス的な指標も使用できます。

```python
class Assess(dspy.Signature):
    '''口調変換の観点をチェックし、改善ヒントを返す。'''
    assessment_transformed = dspy.InputField(desc="生成されたナルト口調の文")
    assessment_rationale = dspy.InputField(desc="生成時の推論メモ")
    assessment_input = dspy.InputField(desc="元の丁寧語文")
    assessment_question = dspy.InputField(desc="評価観点となる質問")
    assessment_answer = dspy.OutputField(desc="yes / no 判定")
    assessment_feedback = dspy.OutputField(desc="改善のヒント")
```

評価観点には以下が含まれます:

- ナルトの一人称や「ってばよ」などの口調
- 「でもさ、」で始まる余計な一言
- 元の意味の保持
- 推論過程の妥当性

### 5. 最適化（COPRO）

```python
from dspy.teleprompt import COPRO

prompt_optimizer = COPRO(metric=metric, verbose=True)
prompt_tuned = prompt_optimizer.compile(NarutoStyleChain(), trainset=trainset)
```

COPROによる最適化で生成されたプロンプトは比較的シンプルなものでした。

### 6. 最適化（GEPA）

GEPAは最近登場した進化計算系統のアルゴリズムで、評価関数からのスカラー値とフィードバックを元に改善提案を行います。

```python
reflection_lm = dspy.LM('openai/gpt-4o-mini', temperature=1.0, max_tokens=2048)

gepa = dspy.GEPA(
    metric=metric_with_feedback,
    auto='light',
    num_threads=8,
    reflection_minibatch_size=2,
    reflection_lm=reflection_lm
)

gepa_compiled = gepa.compile(NarutoStyleChain(), trainset=trainset, valset=valset)
```

GEPAによって生成されたプロンプトは、COPROよりも遥かに詳細で以下のような指示を含みます:

- 文脈の理解
- ナルトのキャラクター特性（一人称「オレ」、口癖「〜ってばよ」）
- カジュアルな口語表現への変換
- 熱意やフレンドリーさの追加
- フィードバックの反映方法

### 7. 結果の比較

**訓練後（GEPA）**:

```
生成出力: 今日の会議では議論を丁寧にまとめるってばよ！でもさ、みんなの意見も大事だから、しっかり聞くぜ！
```

**訓練前**:

```
生成出力: 今日の会議では議論を丁寧にまとめるよ。でもさ、みんなの意見もちゃんと聞かないとね！
```

GEPAによる最適化で、明らかにナルトらしい発言が生成できるようになりました。

## まとめ

DSPyの可能性が実例を通じて示されました。主なポイント:

1. **PyTorchライクな訓練**: 機械学習フレームワークのように訓練コードを記述可能
2. **高度な抽象化**: 訓練部分が高度に抽象化されており、Kerasに似た使用感
3. **効果的な最適化**: 特にGEPAアルゴリズムで大幅な改善を実現
4. **データの重要性**: 「文章やドキュメントを大量に持っている」データ所有者が優位性を持つ可能性

DSPyは、プロンプトエンジニアリングを機械学習問題に変換することで、より体系的で再現可能なアプローチを提供します。ディープラーニングが特徴量エンジニアリングを自動化したように、DSPyはプロンプトエンジニアリングの自動化に向けた重要な一歩となる可能性を秘めています。
