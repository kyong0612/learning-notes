# Prompt design strategies

ref: <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## はじめに

このページでは、Gemini APIを効果的に活用するための一般的なプロンプト設計戦略を紹介しています。大規模言語モデル（LLM）は、テキストデータから言語のパターンや関係性を学習し、プロンプト（入力テキスト）に基づいて次に続く内容を予測する高度な自動補完ツールのように機能します。

## 1. 明確で具体的な指示を与える

モデルに何をしてほしいかを明確に伝えることは、モデル動作をカスタマイズする効果的な方法です。

### タスクを明確に定義する

実行してほしいタスクを詳細に説明します。以下は文章要約のプロンプト例です：

```
Summarize this text:
Text: A quantum computer exploits quantum mechanical phenomena to perform calculations exponentially 
faster than any modern traditional computer. At very tiny scales, physical matter acts as both 
particles and as waves, and quantum computing uses specialized hardware to leverage this behavior.
The operating principles of quantum devices is beyond the scope of classical physics...
```

### 制約を指定する

プロンプトの読み取りやレスポンス生成に関する制約を指定できます。例えば、要約を2文に制限する場合：

```
Summarize this text in two sentences:
Text: A quantum computer...
```

### レスポンスのフォーマットを定義する

テーブル、箇条書きリスト、エレベーターピッチなど、特定のフォーマットでの回答を要求できます：

```
システムメッセージ:
All questions should be answered comprehensively with details, unless the user requests 
a concise response specifically.

プロンプト:
What is a smart way to make a business that sells DVD's in 2025?
```

## 2. Few-shotの例を含める

プロンプトに例を含めることで、モデルに「正解」の形を示すことができます。**Few-shotプロンプト**（数例を含む）は**Zero-shotプロンプト**（例なし）よりも効果的なことが多いです。

### Zero-shot vs Few-shot

例なしのプロンプト：

```
Please choose the best explanation to the question:
Question: How is snow formed?
Explanation1: Snow is formed when water vapor in the air freezes into ice crystals...
Explanation2: Water vapor freezes into ice crystals forming snow.
Answer:
```

vs 例ありのプロンプト（短い説明を優先する例を含む）：

```
Below are some examples showing a question, explanation, and answer format:
Question: Why is sky blue?
Explanation1: The sky appears blue because of Rayleigh scattering...
Explanation2: Due to Rayleigh scattering effect.
Answer: Explanation2
...
```

### 最適な例の数を見つける

Geminiは少数の例からパターンを学習できますが、最適な例の数は実験して見つける必要があります。**例が多すぎるとオーバーフィッティングの問題が発生する可能性があります**。

### パターンを示すために例を使用する

避けるべきパターン（アンチパターン）ではなく、**従うべきパターンを示す例を使用するほうが効果的**です。

❌ **否定的パターン**:

```
Don't end haikus with a question:
Haiku are fun
A short and simple poem
Don't you enjoy them?
```

✅ **肯定的パターン**:

```
Always end haikus with an assertion:
Haiku are fun
A short and simple poem
A joy to write
```

### 例間で一貫したフォーマットを使用する

すべての例で同じ構造とフォーマットを使用し、XMLタグ、空白、改行、例の区切りに注意します。

## 3. 文脈情報を追加する

問題解決に必要な指示や情報をプロンプトに含めることができます。例えば、ルーターのトラブルシューティング:

```
Answer the question using the text below. Respond with only the text provided.
Question: What should I do to fix my disconnected wifi? The light on my Google Wifi router is yellow and blinking slowly.
Text:
Color: Slowly pulsing yellow
What it means: There is a network error.
What to do:
Check that the Ethernet cable is connected to both your router and your modem and both devices are turned on...
```

## 4. プレフィックスを追加する

プロンプトの内容に語句を追加することで、モデルの理解を助けることができます：

- **入力プレフィックス**: 入力の意味のある部分を示す（例：「英語：」「フランス語：」）
- **出力プレフィックス**: 期待する出力の形式を示す（例：「JSON：」「答え：」）
- **例プレフィックス**: Few-shotプロンプトの例にラベルを付ける

```
Classify the text as one of the following categories.
- large
- small
Text: Rhino
The answer is: large
Text: Mouse
The answer is: small
...
```

## 5. モデルに部分的な入力を完成させる

モデルは高度な自動補完ツールとして機能します。部分的な内容を提供すると、モデルがそれを続ける形で応答を生成します。

JSONオブジェクトの例：

```
Valid fields are cheeseburger, hamburger, fries, and drink.
Order: Give me a cheeseburger and fries
Output:
```

{
  "cheeseburger": 1,
  "fries": 1
}

```
Order: I want two burgers, a drink, and fries.
Output:
```

レスポンスのフォーマットを誘導する例：

```
Create an outline for an essay about hummingbirds.
I. Introduction
   *
```

## 6. プロンプトを単純なコンポーネントに分解する

複雑なプロンプトを単純なコンポーネントに分解する方法：

### 指示を分解する

多くの指示を一つのプロンプトに入れるのではなく、指示ごとにプロンプトを作成し、ユーザーの入力に基づいて処理するプロンプトを選択します。

### プロンプトをチェーンする

複雑なタスクを複数のシーケンシャルなステップに分け、各ステップをプロンプトにして連鎖させます。前のプロンプトの出力が次のプロンプトの入力になります。

### レスポンスを集約する

並列タスクを分解し、結果を集約して最終的な出力を生成します。

## 7. 異なるパラメータ値を実験する

モデルの応答を制御するパラメータには以下があります：

### 最大出力トークン

生成される応答のトークン数の上限（1トークンは約4文字、100トークンは約20単語）。短い応答には低い値、長い応答には高い値を指定します。

### 温度（Temperature）

トークン選択のランダム性を制御するパラメータ。**低い値（0に近い）はより確定的な応答**に、**高い値はより多様かつ創造的な結果**につながります。温度が0の場合、常に最も確率の高い応答が選択されます。

ほとんどのユースケースでは、**温度0.2から始める**ことをお勧めします。モデルが一般的すぎる応答やフォールバック応答を返す場合は、温度を上げてみてください。

### Top-K

モデルがトークンを選択する方法を変更します。**低い値はよりランダム性の低い応答**に、**高い値はよりランダムな応答**につながります。デフォルト値は40です。

### Top-P

トークン選択の方法を変更します。確率の合計がTop-P値に等しくなるまで、最も確率の高いトークンから選択されます。**低い値はよりランダム性の低い応答**に、**高い値はよりランダムな応答**につながります。デフォルト値は0.95です。

## 8. プロンプト反復戦略

プロンプト設計は反復的なプロセスであり、望ましい応答を一貫して得るまでには数回の反復が必要なことがあります。

### 異なる言い回しを使用する

同じ意味でも異なる言葉や言い回しを試すことで、モデルの応答が変わることがあります：

```
Version 1: How do I bake a pie?
Version 2: Suggest a recipe for a pie.
Version 3: What's a good pie recipe?
```

### 類似のタスクに切り替える

特定のタスクに対して指示がうまく伝わらない場合、同じ結果を達成する類似のタスクに切り替えます。例えば、本のカテゴリを選ぶタスクを多肢選択問題として再構成する：

```
Multiple choice problem: Which of the following options describes the book The Odyssey?
Options:
- thriller
- sci-fi
- mythology
- biography
```

### プロンプト内容の順序を変更する

内容の順序を変えることで応答に影響を与えることがあります：

```
Version 1:
[例][文脈][入力]

Version 2:
[入力][例][文脈]

Version 3:
[例][入力][文脈]
```

## 9. フォールバック応答

フォールバック応答は、プロンプトや応答が安全フィルターを引き起こした場合に返される応答です（例：「私はただの言語モデルなので、それについては助けられません」）。

**フォールバック応答が返された場合は、温度を上げてみることを推奨します**。

## 10. 避けるべきこと

- **事実情報の生成に頼らないこと**
- **数学や論理的問題に対しては注意して使用すること**

## 11. 次のステップ

- プロンプト設計への理解を深めたら、[Google AI Studio](http://aistudio.google.com/)を使用して独自のプロンプトを作成してみましょう
- マルチモーダルプロンプティングについて学ぶには、[メディアファイルでのプロンプティング](https://ai.google.dev/gemini-api/docs/prompting_with_media)を参照してください

## まとめ

効果的なプロンプト設計は、Gemini APIの能力を最大限に引き出すための鍵です。明確な指示、適切な例の使用、文脈情報の追加、パラメータの最適化など、様々な戦略を組み合わせることで、より正確で期待通りの結果を得ることができます。プロンプト設計は反復的なプロセスであり、実験と改善を繰り返すことで最適な結果に近づくことができます。
