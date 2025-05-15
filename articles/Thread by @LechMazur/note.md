---
title: "Lech Mazur氏によるLLMベンチマーク評価スレッド"
source: "https://x.com/LechMazur/status/1920111434630856791"
author:
  - "Lech Mazur"
published: "2025-05-07"
created: "2025-05-15"
description: |
  Lech Mazur氏によるTwitterスレッドのまとめ。Gemini 2.5 Pro Preview (05-06) と Mistral Medium 3 の各種ベンチマーク（NYT Connections、Confabulations、Thematic Generalization、Short Story Creative Writing）におけるパフォーマンス評価について報告しています。
tags:
  - "LLM"
  - "Benchmark"
  - "Gemini"
  - "Mistral"
  - "AI"
---

Lech Mazur氏が2025年5月7日から5月9日にかけて投稿したTwitterスレッドの要約です。主にGoogleのGemini 2.5 Pro Preview (05-06モデル) とMistral AIのMistral Medium 3のパフォーマンスに関する複数のベンチマーク結果が報告されています。

## LLMベンチマーク評価

### 1. Extended NYT Connections Benchmark

* **Gemini 2.5 Pro Preview (05-06)**: 42.5点
  * 比較対象: Gemini 2.5 Pro Exp (03-25) は54.1点。
* **Mistral Medium 3**: 12.9点
* **詳細**: [NYT Connections Benchmark on GitHub](https://github.com/lechmazur/nyt-connections/)
* **関連画像**:
  * ![Gemini Score](https://pbs.twimg.com/media/GqWauNMXoAAuKh8?format=jpg&name=large)
  * ![Mistral Score](https://pbs.twimg.com/media/GqXRed-XgAEHCbJ?format=jpg&name=large)
* **どのようなベンチマークか**:
  ニューヨーク・タイムズのパズルゲーム「Connections」をベースにしたLLM評価ベンチマークです。プレイヤーは提示された16個の単語の中から、共通のテーマを持つ4つの単語からなるグループを4つ見つけ出す必要があります。この拡張版では、651個のパズルが使用され、難易度を上げるために各パズルに意図的に無関係な「トリックワード」が最大4つ追加されています。LLMは1回の試行で解答する必要があり、人間のプレイヤーのように複数回の試行やヒントは与えられません。

### 2. Confabulations (Hallucinations) on Provided Texts Benchmark

* **Gemini 2.5 Pro Preview (05-06)** は、Gemini 2.5 Pro Experimental (03-25) を僅かに上回り、このベンチマークの新しいトップとなりました。
* **Mistral Medium 3** も評価対象に追加されました。
* このベンチマークでは、スコアが低いほど性能が良いことを示します。
* **詳細**: [Confabulations Benchmark on GitHub](https://github.com/lechmazur/confabulations/)
* **関連画像**:
  * ![Confabulations Score](https://pbs.twimg.com/media/GqbowkfWoAAGbgF?format=jpg&name=large)
* **どのようなベンチマークか**:
  LLMが、提供されたテキストに基づいて誤った情報（Confabulationまたはハルシネーション）を生成する頻度を評価するベンチマークです。特にRAG (Retrieval-Augmented Generation) システムにおける信頼性評価に関連します。ベンチマークでは、LLMの学習データに含まれていない最新の記事を文書として提供し、それらの文書には答えが存在しないように意図的に作成された「誤解を招く質問」をします。人間によって、提供されたテキスト内には答えが存在しないことが確認された質問が使用され、スコアが低いほどハルシネーションが少なく、性能が良いと評価されます。ハルシネーション率だけでなく、答えが存在する質問に対する「無回答率」も合わせて評価することで、より総合的な判断を目指しています。

### 3. Thematic Generalization Benchmark

* **Gemini 2.5 Pro Preview (05-06)**: 1.75点
  * 比較対象: Gemini 2.5 Pro Experimental (03-25) は1.74点。
* **Mistral Medium 3**: 2.12点
* このベンチマークでは、スコアが低いほど性能が良いことを示します。
* **詳細**: [Thematic Generalization Benchmark on GitHub](https://github.com/lechmazur/generalization/)
* **関連画像**:
  * ![Thematic Generalization Score](https://pbs.twimg.com/media/GqX37RnXYAAtVCu?format=jpg&name=large)
* **どのようなベンチマークか**:
  LLMが、少数の具体例と反例から特定の「テーマ」（カテゴリやルール）を推測し、その後、紛らわしい選択肢の中からそのテーマに本当に合致する項目を見つけ出す能力（テーマ的一般化能力）を測定するベンチマークです。まず、高品質なLLMにユニークなテーマを生成させ、各テーマに合致する具体例と合致しない反例を作成します。品質チェックを経て選ばれたデータセットを使用し、LLMには3つの具体例と3つの反例を提示した上で、残りの1つの具体例を7つの紛らわしい反例の中から選び出すタスクが与えられます。LLMが正解の例を上位にランク付けするほど、一般化能力が高いと評価され、スコアが低い（平均ランクが低い）ほど高性能となります。

### 4. Short Story Creative Writing Benchmark

* **Gemini 2.5 Pro Preview (05-06)**: 8.09点
  * Gemini 2.5 Pro Experimental (03-25) の8.05点から僅かに改善。
* **Mistral Medium 3**: 7.73点
  * Mistral Large 2 の6.90点を上回る性能。
* **詳細**: [Creative Writing Benchmark on GitHub](https://github.com/lechmazur/writing/)
* **関連画像**:
  * ![Creative Writing Score](https://pbs.twimg.com/media/GqdHL6gXgAAHjsK?format=jpg&name=large)
* **どのようなベンチマークか**:
  LLMが、指定された10個の必須要素（キャラクター、オブジェクト、コアコンセプト、属性、動機、行動、方法、設定、時間枠、トーン）を短いクリエイティブな物語（約400～500語）の中に、自然な形でどれだけうまく組み込めるかをテストするベンチマークです。制約充足（すべての要素を適切に組み込んでいるか）と文学的品質（物語の魅力や一貫性）の両面から評価されます。複数の評価者LLMが、キャラクター設定、プロット、世界観、独創性など16の質問項目に基づいて各物語を採点し、LLMの創造的な文章生成能力を測定します。

---

*注: 元スレッドにはLab4cryptoによる広告ツイートが含まれていましたが、本要約ではLech Mazur氏のベンチマーク報告に焦点を当てています。*
