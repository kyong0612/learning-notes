# Prompt Engineering Guide

ref: <https://www.promptingguide.ai/jp>

指定されたウェブサイトの内容を確認するため、まずサイトをスクレイピングします。

ウェブサイトからスクレイピングした「LLMの設定」の内容を以下にまとめます：

## LLMの設定

プロンプトを使用してLLMと対話する際、いくつかのパラメータ設定によって異なる結果を得ることができます。主な設定パラメータは以下の通りです：

### Temperature（温度）

- 値が低いほど結果は決定論的になり、最も確率の高い回答が選ばれる
- 値が高いほどランダム性が増し、多様で創造的なアウトプットが可能になる
- 事実に基づくQ&Aには低い値が適切
- 詩の生成などの創造的タスクには高い値が効果的

### Top_p（核サンプリング）

- モデルが応答生成時の決定性をコントロールする手法
- 正確で事実に基づいた回答には低い値が適切
- 多様な回答を求める場合は高い値が適切
- 一般的には、TemperatureとTop_pは両方ではなくどちらか一方を調整することが推奨

### Max Length（最大長）

- モデルが生成するトークン数を管理
- 長すぎる・関連性のない回答を防止し、コストを管理できる

### Stop Sequences（停止シーケンス）

- モデルがトークン生成を停止する文字列を指定
- 回答の長さや構造を制御する方法
- 例：「11」を停止シーケンスに指定すると、10項目以上のリスト生成を防止できる

### Frequency Penalty（頻度ペナルティ）

- トークンが既に回答やプロンプトに出現した回数に比例してペナルティを適用
- 値が高いほど単語の繰り返しが少なくなる
- 頻出トークンに高いペナルティを与え、繰り返しを減らす

### Presence Penalty（存在ペナルティ）

- 繰り返されるトークンに対して同一のペナルティを適用
- 出現回数に関わらず（2回でも10回でも）同じペナルティが課される
- 多様性や創造性を求める場合は高く設定
- 特定フレーズへの集中が許容される場合は低く設定
- 一般的には、Frequency PenaltyとPresence Penaltyは両方ではなくどちらか一方を調整することが推奨

なお、使用するLLMのバージョンによって結果が異なる可能性があります。

## プロンプトの設計に関する一般的なヒント（実例付き）

### 1. 簡単に始める

- プロンプト設計は反復的なプロセスであり、最適な結果を得るには多くの実験が必要
- OpenAIやCohereのようなシンプルなプレイグラウンドから始めるのが良い
- シンプルなプロンプトから始め、徐々に要素や文脈を追加していく
- プロンプトのバージョン管理が重要
- 複雑なタスクはシンプルなサブタスクに分解して徐々に構築する

### 2. 指示の与え方

- 「書く」「分類する」「要約する」「翻訳する」などの明確なコマンドを使用

**実例：**

```
### 指示 ###
以下のテキストをスペイン語に翻訳してください。

Text: "hello!"
```

**出力：**

```
¡Hola!
```

- 指示はプロンプトの最初に配置し、「###」などの明確な区切り記号で指示と文脈を区切る

### 3. 特異性（具体性）を持たせる

- モデルへの指示やタスクについて非常に具体的に説明する
- プロンプトが詳細で具体的であるほど、結果は良くなる
- 例を提供することで特定のフォーマットの出力を得やすくなる

**実例：**

```
以下のテキストから場所の名前を抽出してください。

望ましいフォーマット：
Place: <comma_separated_list_of_places>

入力：「これらの進展は研究者にとって励みになっていますが、まだ多くのことが謎のままです。リスボンのシャンパリマウド・センター・フォー・ジ・アンノウンの神経免疫学者であるヘンリーク・ヴェイガ・フェルナンデスは、「脳と周辺部で見られる効果の間にはしばしばブラックボックスがあります」「治療的な文脈で使用したい場合、実際には作用機序を理解する必要があります。」」
```

**出力：**

```
Place: リスボンのシャンパリマウド・センター・フォー・ジ・アンノウン
```

### 4. 不正確さを避ける

- プロンプトは具体的で直接的であるべき
- 曖昧な表現や不正確な説明を避ける

**不適切な例：**

```
プロンプトエンジニアリングの概念を説明してください。説明は短く、数文で、あまり詳しくしないでください。
```

（どのように文を数え、スタイルを指定するかが明確でない）

**改善された例：**

```
高校生に対して、プロンプトエンジニアリングの概念を2〜3文で説明してください。
```

（対象者、文の数、トピックが明確に指定されている）

### 5. するかしないか？（Do vs. Don't）

- 「しないこと」ではなく「すること」を指示する方が効果的

**不適切な例：**

```
以下は、顧客に映画を推薦するエージェントです。興味を尋ねないで、個人情報を尋ねないでください。

顧客：私の興味に基づいて映画をお勧めください。
エージェント：
```

**出力：**

```
はい、あなたの興味に基づいて映画をお勧めできます。アクション、コメディ、ロマンス、それともその他の何か、どのような映画がお好きですか？
```

（禁止事項を守れていない）

**改善された例：**

```
以下は、顧客に映画を推薦するエージェントです。エージェントは、上位のグローバルトレンド映画から映画をお勧めする責任があります。ユーザーの好みを尋ねることを避け、個人情報を尋ねることを避ける必要があります。エージェントがおすすめ映画を持っていない場合は、「申し訳ありませんが、今日お勧めする映画が見つかりませんでした。」と返答する必要があります。

顧客：私の興味に基づいて映画をお勧めください。
エージェント：
```

**出力：**

```
申し訳ありませんが、あなたの興味に関する情報はありません。しかし、ここに今一番トレンディーな映画のリストがあります：[リストの映画]。お好きなものが見つかることを願っています！
```

（何をすべきかを具体的に指示され、期待通りに対応）

これらの実例からわかるように、プロンプトの具体性、指示の明確さ、フォーマットの指定がAIの回答の品質に大きく影響します。何をしないかではなく何をすべきかを伝え、可能な限り具体的に指示することで、より望ましい結果を得ることができます。

## プロンプトの例

## 概要

- 前のセクションでのLLMへのプロンプト提供方法の基本を踏まえ、より具体的なタスク例を紹介
- 例を通じて、プロンプトエンジニアリングの重要な概念を学ぶことができる
- 上手く作成されたプロンプトが様々なタイプのタスクをどのように実行できるかを示している

### 各タスクの詳細な例と要点

#### 1. テキスト要約

- **例1: 抗生物質の説明を求めるプロンプト**

  ```
  抗生物質について説明してください。
  A:
  ```

  - 出力: 抗生物質についての基本的な説明（細菌感染治療、作用機序、投与方法、限界など）
  - "A:"は質問応答フォーマットとして使用され、モデルに情報が必要であることを伝えている

- **例2: 1文での要約指示**

  ```
  抗生物質は、細菌感染を治療するために使用される薬剤の一種です。[...]
  上記を1文で説明してください。
  ```

  - 出力: 「抗生物質は、細菌感染を治療するために使用される薬剤であり、細菌を殺すか再生を防止し、ウイルスには効果がなく、過剰摂取によって抗生物質耐性を引き起こす可能性があります。」
  - 具体的な指示により、要約の形式を制御できることを示している

#### 2. 情報抽出

- **例: 段落からの情報抽出**

  ```
  研究論文の著者貢献声明や謝辞には、筆者が ChatGPT のようなAIテクノロジーを原稿および分析の準備に使用したかどうか、およびどの LLMs を使用したかが明確かつ具体的に記載されている必要があります。[...]
  上記の段落において言及されている大規模言語モデルベースの製品を述べてください。
  ```

  - 出力: 「上記の段落において言及されている大規模言語モデルベースの製品は ChatGPT です。」
  - 単純な指示でも効果的な情報抽出ができることを示している
  - AI製品開発者が既に活用している強力な能力

#### 3. 質問応答

- **例: 構造化されたQ&Aプロンプト**

  ```
  以下の文脈に基づいて質問に答えてください。回答を短く簡潔に保ちます。回答が不明な場合は、「回答不明」と回答してください。
  
  文脈：Teplizumabは、Ortho Pharmaceuticalと呼ばれるニュージャージー州の薬剤会社に由来します。[...]
  
  質問：OKT3はもともとどこから採取されたものですか？
  
  回答：
  ```

  - 出力: 「マウス。」
  - プロンプトの要素（指示、文脈、入力、出力インジケーター）を組み合わせることで改善された結果が得られる
  - 具体的な指示が良い結果をもたらすことを示している

#### 4. テキスト分類

- **例1: 基本的な感情分析指示**

  ```
  テキストをneutral、negative、またはpositiveに分類してください。
  
  テキスト：この食べ物はまずまずでした。
  所感:
  ```

  - 出力: 「Neutral」
  - 基本的な分類タスクは単純な指示で実行可能

- **例2: 例示を含む分類指示**

  ```
  テキストをneutral、negative、またはpositiveに分類してください。
  
  テキスト：先日の休暇はまずまずでした。
  所感: neutral
  
  テキスト：この食べ物はまずまずでした。
  所感:
  ```

  - 出力: 「neutral」（小文字表記）
  - プロンプト内に例を提供することで、出力形式を制御できることを示す
  - 「特定性」の重要性を強調している

- **例3: スペルミスを含む指示**

  ```
  テキストをnutral、negative、またはpositiveに分類してください。
  
  テキスト：先日の休暇はまずまずでした。
  所感:
  ```

  - 出力: 「Neutral」（大文字で始まる）
  - プロンプト内のスペルミス（「nutral」）があると、モデルは正しい綴りを推測し大文字表記になる
  - この例は特定性の重要性と注意深いプロンプト設計の必要性を示している

#### 5. 会話

- **例1: 技術的・科学的トーンの会話**

  ```
  以下はAI研究アシスタントとの会話です。アシスタントのトーンは技術的で科学的です。
  
  人: こんにちは、あなたは誰ですか？
  AI: やあ！私はAI研究アシスタントです。今日は何をお手伝いできますか？
  人: ブラックホールの生成について教えてもらえますか？
  AI:
  ```

  - 出力: 技術的で詳細なブラックホールの説明（特異点や時空の概念を含む）
  - 役割プロンプティング（role prompting）の例を示している

- **例2: 小学生向けの会話**

  ```
  以下はAI研究アシスタントとの会話です。アシスタントの回答は小学生でも理解できるようになっています。
  
  人: こんにちは、あなたは誰ですか？
  AI: やあ！私はAI研究アシスタントです。今日は何をお手伝いできますか？
  人: ブラックホールの生成について教えてもらえますか？
  AI:
  ```

  - 出力: 簡素化されたブラックホールの説明
  - 指示によって同じ質問に対する応答のトーンや複雑さが変化することを示している

#### 6. コード生成

- **例1: シンプルなJavaScriptプログラム**

  ```
  /*
  ユーザーに名前を聞いて、「こんにちは」と言ってください。
  */
  ```

  - 出力:

  ```
  let name = prompt("あなたの名前は何ですか？");
  console.log(`こんにちは、${name}さん！`);
  ```

  - 言語指定がなくても適切なコードを生成できる

- **例2: データベースクエリ生成**

  ```
  """
  テーブル名 departments、カラム=[DepartmentId、DepartmentName]
  テーブル名 students、カラム=[DepartmentId、StudentId、StudentName]
  コンピュータサイエンス学科のすべての学生のためのMySQLクエリを作成してください。
  """
  ```

  - 出力:

  ```
  SELECT StudentId、StudentName
  FROM students
  WHERE DepartmentId IN (SELECT DepartmentId FROM departments WHERE DepartmentName = 'Computer Science');
  ```

  - データベーススキーマに関する情報から適切なSQLクエリを生成
  - 特定のドメイン（データベース）知識を活用したコード生成の例

#### 7. 推論

- **例1: 基本的な算術計算**

  ```
  9,000 * 9,000は何ですか？
  ```

  - 出力: 「81,000,000」
  - 簡単な算術計算は問題なく処理できる

- **例2: 奇数合計の問題（最初の試み）**

  ```
  このグループの奇数の数値を合計すると偶数になります: 15, 32, 5, 13, 82, 7, 1。
  
  A:
  ```

  - 出力: 「いいえ、このグループの奇数の数値を合計すると奇数になります: 119。」
  - この回答は誤り（正しい計算をしているが、問題の意図を把握できていない）

- **例3: 改善された奇数合計の問題**

  ```
  このグループの奇数の数値を合計すると偶数になります: 15, 32, 5, 13, 82, 7, 1。
  
  問題をステップごとに解決してください。まず、奇数の数値を特定し、それらを合計して結果が奇数か偶数かを示してください。
  ```

  - 出力:

  ```
  奇数: 15, 5, 13, 7, 1
  合計: 41
  41は奇数です。
  ```

  - 「ステップごとに解決」という指示を追加することで精度が向上
  - 複雑な推論タスクでは高度なプロンプト技術が必要であることを示している

### 主要な洞察

1. **プロンプト設計の重要性**:
   - 指示、文脈、入力、出力インジケーターを組み合わせることでより良い結果が得られる
   - 特定性が高いほど、期待通りの出力が得られやすい

2. **例示の効果**:
   - プロンプト内に例を含めることで、出力の形式や内容を制御できる
   - 正しい動作を示す例は特に効果的

3. **役割設定の有効性**:
   - LLMの振る舞い、トーン、専門レベルを役割設定で制御できる
   - カスタマーサービスチャットボットなどの会話システムに特に有用

4. **複雑なタスクへの対応**:
   - 「ステップごとに解決」などの指示で推論タスクの精度を向上できる
   - 難しいタスクでは複数の例や詳細な指示が必要になる場合がある

5. **コード生成の可能性**:
   - LLMはコメントやスキーマ情報から複雑なコードを生成できる
   - 言語指定なしでも文脈から適切なプログラミング言語を判断できる

## Zero-Shotプロンプティング

大量のデータでトレーニングされ、指示に従うように調整されたLLMは、ゼロショットでタスクを実行することができます。前のセクションでいくつかのゼロショットの例を試しました。以下は、使用した例の1つです。

**プロンプト：**

```
テキストを中立、否定的、または肯定的に分類してください。

テキスト: 休暇はまずまずでした。
所感:
```

**出力：**

```
中立
```

上記のプロンプトでは、モデルに任意の例を提供していないことに注意してください。これがゼロショットの機能です。

指示のチューニングは、ゼロショット学習の改善を示しています [Wei et al. (2022)](https://arxiv.org/pdf/2109.01652.pdf)。指示の説明に従って説明されたデータセットでモデルを微調整することが、指示のチューニングの本質です。さらに、[RLHF](https://arxiv.org/abs/1706.03741)（人間のフィードバックからの強化学習）が指示のチューニングの拡大に採用されており、モデルが人間の好みにより適合するように調整されています。この最近の開発により、ChatGPTのようなモデルが強化されています。これらのアプローチと方法については、次のセクションで説明します。

ゼロショットが機能しない場合は、プロンプトにデモンストレーションや例を提供することをお勧めし、フューショットプロンプティングに移行します。次のセクションでは、フューショットプロンプティングをデモンストレーションします。

## Chain-of-Thoughtプロンプティング

### Chain-of-Thought (CoT) プロンプティング

Chain-of-thought (CoT)プロンプティングは、Wei et al. (2022)によって紹介された手法で、中間的な推論ステップを通じて複雑な推論能力を可能にします。few-shot promptingと組み合わせることで、推論が必要なより複雑なタスクでより良い結果を得ることができます。

例：

```
このグループの奇数を合計すると偶数になります。: 4、8、9、15、12、2、1。
A: 奇数を全て加えると(9, 15, 1)25になります。答えはFalseです。

このグループの奇数を合計すると偶数になります。: 17、10、19、4、8、12、24。
A: 奇数を全て加えると(17, 19)36になります。答えはTrueです。

このグループの奇数を合計すると偶数になります。: 16、11、14、4、8、13、24。
A: 奇数を全て加えると(11, 13)24になります。答えはTrueです。

このグループの奇数を合計すると偶数になります。: 17、9、10、12、13、4、2。
A: 奇数を全て加えると(17, 9, 13)39になります。答えはFalseです。

このグループの奇数を合計すると偶数になります。: 15、32、5、13、82、7、1。
A:
```

出力:

```
奇数を全て加えると(15, 5, 13, 7, 1)41になります。答えはFalseです。
```

興味深いことに、より少ない例（1つだけ）でもこのタスクは解決できます。著者たちはこれが十分に大きな言語モデルで生じる新興能力であると主張しています。

### Zero-shot COT Prompting

Zero-shot CoT（Kojima et al. 2022）は、元のプロンプトに「ステップバイステップで考えてみましょう」という文言を追加するだけの手法です。例えば：

プロンプト:

```
私は市場に行って10個のリンゴを買いました。隣人に2つ、修理工に2つ渡しました。それから5つのリンゴを買って1つ食べました。残りは何個ですか？
```

出力:

```
11個のリンゴ
```

（これは誤った答えです）

「ステップバイステップで考えてみましょう」と追加した場合:

```
私は市場に行って10個のリンゴを買いました。隣人に2つ、修理工に2つ渡しました。それから5つのリンゴを買って1つ食べました。残りは何個ですか？

ステップバイステップで考えてみましょう。
```

出力:

```
最初に、10個のリンゴから始めました。
隣人と修理工に合わせて、リンゴを2つずつ渡し、残りは6個になりました。
次に、5つのリンゴを買い、11個になりました。
最後に、1つのリンゴを食べたため、残りは10個になります。
```

この単純なプロンプト追加が効果的なのは驚くべきことで、特に例をあまり用意できない場合に有用です。

## Self-Consistency（自己整合性）の解説

### 基本概念

Self-Consistency（自己整合性）は、Wang氏らによって2022年に提唱された高度なプロンプトエンジニアリング技術です。この手法は、Chain-of-Thought（CoT、思考の連鎖）プロンプティングの拡張として位置づけられます。

### 主な特徴と仕組み

1. **目的**: 連想思考プロンプティングで使用される単純な貪欲復号化（greedy decoding）を改善すること
2. **方法**:
   - Few-shot CoT（少数例示による思考の連鎖）を通じて複数の多様な推論パスを生成
   - それらの生成結果から最も整合的な回答を選択（多数決など）
3. **効果**: 算術的推論や常識的推論を必要とするタスクでのパフォーマンス向上

### 実践例での解説

問題例：「私が6歳のとき、妹は私の半分の年齢でした。今、私は70歳です。私の妹は何歳ですか？」

#### 通常の方法

単純なプロンプトでは「35歳」という誤った回答が得られる場合があります。

#### Self-Consistencyの適用方法

1. Few-shotエグザンプラー（類似した問題と解答例）を含むプロンプトを使用
2. 同じ問題に対して複数の異なる推論過程を生成:
   - 出力1: 「私が6歳のとき妹は3歳。今私は70歳なので妹は70-3=67歳」
   - 出力2: 「語り手が6歳のとき妹は3歳。語り手が70歳の今、妹は70-3=67歳」
   - 出力3: 「私が6歳のとき妹は3歳。今私は70歳なので妹は70/2=35歳」
3. 最終的な回答決定:
   - 多数決や他の集約方法で最も整合的な回答を選択
   - この例では67歳が2回出現しているため、これが最終回答となる

### 実装上の重要ポイント

- 複数の推論パスを生成することで、単一のパスに頼るよりも信頼性の高い回答が得られる
- 特に算術問題や論理的推論を要する問題で効果的
- 最終的な回答選択には、単純な多数決以外にも様々な集約方法が考えられる

Self-Consistencyは、言語モデルの推論能力を引き出すための効果的な手法であり、特に複雑な問題解決のシナリオで有用です。

## 知識生成プロンプティング

### 概要

知識生成プロンプティング（Knowledge Generation Prompting）は、LLMがより正確な予測を行うために、回答の前にまず関連知識を生成させる手法です。この技術はLiu et al.（2022）によって提案され、特に常識的理解や推論を必要とするタスクにおいて有効です。

### 問題点の例示

単純なプロンプトでは誤った回答が得られることがあります：

**プロンプト例**:

```
ゴルフの一部は、他の人よりも高いポイント総数を得ようとすることです。「はい」か「いいえ」か？
```

**誤った出力**:

```
はい。
```

この誤りは、モデルの世界知識の限界を示しています。

### 知識生成プロンプティングの実装方法

#### ステップ1: 知識の生成

まず、関連する知識をモデルに生成させます。

**プロンプト例**:

```
入力：ゴルフの一部は、他の人よりも高いポイント総数を得ようとすることです。
知識：
```

**生成された知識1**:

```
ゴルフの目的は、できるだけ少ない打数で一連のホールをプレイすることです。通常、ゴルフのラウンドは18ホールで構成されます。1回のホールは、標準のゴルフコースに1回プレイされます。各打数は1ポイントとしてカウントされ、総打数がゲームの勝者を決定するために使用されます。
```

**生成された知識2**:

```
ゴルフは、競技者（またはゴルファー）が多種多様なクラブを使用して、できるだけ少ない打数でコースの一連のホールにボールを打ち込む精密なクラブ＆ボールスポーツです。目標は、各ホールでの総打数を合計した最低スコアでコースを完走することです。最低スコアを出したプレイヤーがゲームに勝ちます。
```

#### ステップ2: 知識を統合して回答を生成

生成された知識を組み込んだプロンプトで質問に回答させます。

**プロンプト例1**:

```
質問：ゴルフの一部は、他の人よりも高いポイント総数を得ようとすることです。「はい」か「いいえ」？

知識：ゴルフの目的は、できるだけ少ない打数で一連のホールをプレイすることです。通常、ゴルフのラウンドは18ホールで構成されます。1回のホールは、標準のゴルフコースに1回プレイされます。各打数は1ポイントとしてカウントされ、総打数がゲームの勝者を決定するために使用されます。

説明と回答：
```

**回答1（自信が非常に高い）**:

```
いいえ、ゴルフの目的は他の人よりも高いポイント総数を得ることではありません。むしろ、目的はできるだけ少ない打数で一連のホールをプレイすることです。総打数がゲームの勝者を決定するために使用されますが、ポイントの総数ではありません。
```

**プロンプト例2**:

```
質問：ゴルフの一部は、他の人よりも高い得点を取ることです。「はい」か「いいえ」か？

知識：ゴルフは、競技者（またはゴルファー）が多種多様なクラブを使用して、できるだけ少ない打数でコースの一連のホールにボールを打ち込む精密なクラブアンドボールのスポーツです。目標は、各ホールで打たれた総打数を合計して計算される最低スコアでコースを完了することです。最低スコアを出したプレイヤーが勝利します。

説明と回答：
```

**回答2（自信はかなり低い）**:

```
はい、ゴルフの一部は、他の人よりも高い得点を取ることです。各プレイヤーは、各ホールで打たれた総打数を合計して計算される最低スコアでコースを完了しようとします。最低スコアを出したプレイヤーが勝利します。
```

### 興味深い観察

この例では、同じ質問に対して異なる「知識」を提供することで、モデルは異なる自信度で異なる回答を出しています。1つ目の回答では高い自信を持って「いいえ」と回答し、2つ目では低い自信で「はい」と回答しています。

### 応用

この手法は、LLMが世界の知識を必要とするタスクでの精度向上に役立ちます。実際の応用では、より詳細なプロセスや考慮点があるため、詳細は元論文を参照することが推奨されています。

### 参考文献

- Liu et al. 2022: <https://arxiv.org/pdf/2110.08387.pdf>

この技術は自己整合性（Self-Consistency）やPrompt Chainingなど他のプロンプティング技術と組み合わせて使用することもできます。

## Prompt Chaining

### 基本概念

- プロンプトチェイニングとは、複雑なタスクを複数のサブタスクに分割し、それぞれに対してプロンプトを出す手法
- 各サブタスクの回答を次のプロンプトの入力として利用する連鎖的なプロセス
- LLMが一度に扱うには複雑すぎる詳細なプロンプトに対処するのに有効

### 主なメリット

- LLMの信頼性と性能を向上させる
- アプリケーションの透明性を高める
- より良い制御性と信頼性を実現
- モデルの応答に関する問題を簡単にデバッグできる
- 各段階のパフォーマンスを分析して改善可能
- 会話アシスタント構築時のパーソナライズとユーザーエクスペリエンス向上に役立つ

### 使用例：ドキュメントQAのためのプロンプトチェイニング

1. 第1段階（プロンプト1）：
   - 目的：質問に基づいてドキュメントから関連する引用を抽出する
   - 出力形式：`<quotes></quotes>`タグで囲まれた引用のリスト
   - プロンプト例：

   ```
   あなたは親切なアシスタントです。
   あなたの仕事は、文書で与えられた質問に答えるのを助けることです。最初のステップは、####で区切られた文書から質問に関連する引用を抽出することです。
   引用のリストは<quotes></quotes>を使って出力してください。関連する引用が見つからなかった場合は「関連する引用は見つかりませんでした。]と返信してください。
   ####
   {{document}}
   ####
   ```

2. 第2段階（プロンプト2）：
   - 目的：抽出された引用と元のドキュメントを使って質問に答える
   - 入力：プロンプト1で抽出された引用リストと元のドキュメント
   - プロンプト例：

   ```
   ある文書から抽出された関連する引用（<quotes></quotes>で区切られています）と元の文書（###で区切られています）が与えられたら、質問に対する答えを作成してください。
   回答は正確で、友好的な口調で、役に立つように聞こえるようにしてください。
   
   ####
   {{document}}
   ####
   
   <quotes>
   - Chain-of-thought (CoT) prompting[27]
   - Generated knowledge prompting[37]
   ...（他の引用）
   </quotes>
   ```

### 実際の応用例

- 出力例では、プロンプトエンジニアリングに関するWikipediaの記事から、さまざまなプロンプト技法（Chain-of-thought、Generated knowledge promptingなど）が抽出され、それらを整理して回答が作成された
- 実用例として、回答から引用番号（例：[27]）を削除するための追加プロンプトを設計することも可能

### 補足情報

- この手法はClaudeなどの長いコンテキストを扱うLLMでも使用可能
- OpenAIの`gpt-4-1106-preview`モデルなど、広範なコンテキストを扱えるモデルでの使用が推奨されている
- Anthropicの公式ドキュメントにも類似した例が掲載されている

このように、プロンプトチェイニングは複雑なタスクを段階的に処理することで、より正確で制御された結果を得るための効果的な手法です。

## Tree of Thoughts (ToT)

### 概要

「Tree of Thoughts (ToT)」は、Yao et el. (2023)とLong (2023)によって提案された先進的なプロンプト工学のフレームワークです。このアプローチは、複雑な課題に対して、探索や戦略的な先読みが必要な場合に、従来の単純なプロンプト技術の限界を超えるために開発されました。

### ToTの主要な特徴

- **思考の木の活用**: 問題解決への中間ステップとなる一貫した言語の連続を表す思考の木を保持します
- **自己評価能力**: 言語モデルが熟考プロセスを通じて中間思考の達成度を自己評価できます
- **探索アルゴリズムとの連携**: 思考の生成と評価能力を、幅優先探索(BFS)や深さ優先探索(DFS)などと組み合わせます
- **先読みとバックトラッキング**: 思考の系統的な探索を可能にし、より効果的な問題解決を実現します

### ToTのフレームワーク図

![ToTフレームワーク](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FTOT.3b13bc5e.png&w=3840&q=75)

*画像出典: Yao et el. (2023)*

### 実装例: 24ゲーム

24ゲームは数学的な推論タスクとして使用され、以下のようにToTが適用されます:

- 思考を3つのステップに分解し、各ステップで中間式を生成
- 各ステップで最も優れた5つの候補を保持
- LMは各思考候補を24に到達するための「確実/おそらく/不可能」として評価
- 先読みで正しい部分解を促進し、「大きすぎる/小さすぎる」という常識に基づいた不可能な部分解を排除
- 各思考について値を3回サンプリング

### 24ゲームでのToT実行プロセス

![24ゲームでのToT実行プロセス](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FTOT2.9eb8f0f9.png&w=1920&q=75)

*画像出典: Yao et el. (2023)*

### 性能比較

ToTは他のプロンプト手法と比較して大幅に優れた性能を示しています:

![性能比較](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FTOT3.bf83699e.png&w=1920&q=75)

*画像出典: Yao et el. (2023)*

### 異なるアプローチの比較

#### Yao et al. (2023) vs Long (2023)

両方のアプローチは高レベルでは類似していますが、以下の違いがあります:

- **Yao et al.**: DFS/BFS/ビームサーチといった一般的な探索アルゴリズムを使用
- **Long**: 「ToTコントローラー」という強化学習で訓練されたモデルを使って木探索戦略を制御
- 強化学習ベースのアプローチは新しいデータセットやセルフプレイから学習し、進化できる可能性があります

#### Hulbertの簡略化アプローチ

Hulbert (2023)は、ToTフレームワークの主要な概念を単一プロンプトで実現する「Tree-of-Thought Prompting」を提案しました。例えば:

```
この質問について、3人の異なる専門家が回答していると想像してください。
すべての専門家は、自分の思考の1つのステップを書き留め、
それをグループと共有します。
その後、すべての専門家は次のステップに進みます。以後同様です。
もし専門家の中に、いかなる時点で誤りに気づいた場合は、退場します。
質問は...
```

### 実装コード

コードは以下のリポジトリで入手可能です:

- [princeton-nlp/tree-of-thought-llm](https://github.com/princeton-nlp/tree-of-thought-llm)
- [jieyilong/tree-of-thought-puzzle-solver](https://github.com/jieyilong/tree-of-thought-puzzle-solver)

この革新的なフレームワークは、複雑な問題解決、特に探索や戦略的な先読みが必要なタスクにおいて、言語モデルの能力を大幅に向上させる可能性を秘めています。

## 検索により強化された生成 (RAG)

### 1. RAGの概要と定義

RAG（Retrieval Augmented Generation）は、Meta AIの研究者によって考案された手法です。これは情報検索コンポーネントとテキスト生成モデルを組み合わせたアプローチで、知識集約型のタスクに対処するために開発されました。

汎用の言語モデルは感情分析や名前付きエンティティ認識などの一般的なタスクには適していますが、より複雑で知識を必要とするタスクでは外部の知識ソースが必要になります。RAGはこの課題に対応し、生成される回答の事実との整合性を向上させ、信頼性を高め、「幻覚(hallucination)」（LLMが事実と異なる情報を自信を持って生成する問題）を軽減します。

### 2. RAGの特徴と利点

- **効率的な知識更新**: モデル全体の再トレーニングを必要とせず、ファインチューニングが可能
- **時間的適応性**: 事実が時間とともに変化する状況にも適応できる
- **最新情報へのアクセス**: LLMのパラメトリック知識は静的である一方、RAGは検索ベースの生成により最新情報を活用
- **信頼性の向上**: 外部ソースからの事実に基づいた情報を提供することで、生成内容の信頼性が向上

### 3. RAGの動作プロセス

RAGは以下のようなプロセスで動作します：

1. 入力（質問や指示）を受け取る
2. ソース（例：Wikipedia）から関連する文書を検索
3. 検索された文書を元の入力プロンプトと連結
4. 連結されたコンテキストをテキスト生成器に供給
5. 最終的な出力（回答）を生成

![RAG](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frag.c6528d99.png&w=1920&q=75)

*画像出典: Lewis ら (2021)*

### 4. RAGの実装例とパフォーマンス

Lewis ら（2021）は、RAGのための汎用的なファインチューニングのレシピを提案しました：

- 事前に訓練された seq2seq モデルをパラメトリックメモリとして使用
- Wikipediaの密なベクトルインデックスをノンパラメトリックメモリとして使用（ニューラル事前訓練された retriever でアクセス）

RAGは以下のベンチマークで優れたパフォーマンスを示しています：

- Natural Questions
- WebQuestions
- CuratedTrec

また、MS-MARCOやJeopardyの問題では、より事実に基づいた、具体的で多様な回答を生成し、FEVERの事実検証の結果も向上させました。

### 5. 最近の動向

近年、retrieverアプローチはより一般的になり、ChatGPTのような大規模言語モデル（LLM）と組み合わせることで、能力と事実との整合性を向上させています。

LangChainのドキュメントには、ソースを使って質問に答えるためのretrieverとLLMの簡単な使用例が掲載されています。

## 自動推論とツール使用（ART）の要点

ARTは「Automatic Reasoning and Tool-use」の略で、LLM（大規模言語モデル）を活用するための強力なプロンプト技術です。この技術はParanjape氏ら（2023年）によって提案されました。

### 主要概念

- ARTはCoT（Chain-of-Thought）プロンプティングとツール使用を組み合わせた手法です
- 従来の手法では、タスク固有のデモンストレーションを手作業で作成し、モデル生成とツール使用を慎重に組み合わせる必要がありました
- ARTは既存のLLMを変更せずに（frozen状態で）、中間的な推論ステップをプログラムとして自動生成するフレームワークを提供します

### ARTの動作プロセス

1. 新しいタスクが与えられると、タスクライブラリから複数ステップの推論とツール使用のデモンストレーションを選択
2. テスト時には、外部ツールが呼び出されるたびに生成を一時停止し、ツールの出力を統合してから生成を再開
3. モデルはデモンストレーションから学習し、新しいタスクを分解してゼロショット方式で適切な場所でツールを使用
4. 人間が推論ステップの誤りを修正したり、タスクとツールのライブラリを更新するだけで拡張可能

![ART](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FART.3b30f615.png&w=1200&q=75)

*画像出典: [Paranjape et al., (2023)](https://arxiv.org/abs/2303.09014)*

### パフォーマンスと評価

- ARTは、BigBenchとMMLUベンチマークの未見のタスクにおいて、従来の少数ショットプロンプティングや自動CoTよりも大幅に性能を改善
- 人間のフィードバックを取り入れた場合、手作業で作成されたCoTプロンプトのパフォーマンスを上回る結果を示しています

以下は、BigBenchとMMLUタスクにおけるARTのパフォーマンスを示す表です：

![ART2](https://www.promptingguide.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FART2.9fb2b217.png&w=1920&q=75)

*画像出典: [Paranjape et al., (2023)](https://arxiv.org/abs/2303.09014)*
