# Eval-driven development: Build better AI faster

ref: <https://vercel.com/blog/eval-driven-development-build-better-ai-faster>

[Blog](https://vercel.com/blog)/ **[Engineering](https://vercel.com/blog/category/engineering)**

## 著者

[![Avatar for cramforce](https://vercel.com/api/www/avatar?u=cramforce&s=48)](https://twitter.com/cramforce) [![Avatar for alicemoore](https://vercel.com/api/www/avatar?u=alicemoore&s=48)](https://twitter.com/tempoimmaterial) [![Avatar for idopesok](https://vercel.com/api/www/avatar?u=idopesok&s=48)](https://twitter.com/ido_pesok)

VercelのAIネイティブ開発における哲学と技術についての考察。

AIはソフトウェア開発の方法を一変させます。開発者との協働により、より速く、より良い成果を達成できる正のフィードバックループが生み出されます。

しかし、従来のテスト手法は、AIの予測不可能な性質にはうまく対応できません。Vercelでv0を含むAIプロダクトを構築する中で、私たちは新たなアプローチ、すなわち**評価駆動型開発**が必要であると実感しました。

本記事では、評価（evals）の仕組みと、それがAIネイティブ開発に与えるポジティブな影響について詳しく探ります。

---

## [評価：新たなテストパラダイム](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#evals:-the-new-testing-paradigm)

評価（evals）は、AIやその他の確率的システムに対するエンドツーエンドのテストのようなものです。自動チェック、人的判断、そしてAI支援のグレーディングを用いて、定義された基準に照らし出力の品質を評価します。この手法は、固有の変動性を認識し、個々のコードパスではなく全体のパフォーマンスを測定するものです。

![Evals complement your existing test suite.](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F7lPENOkvHbYCroOJvuAvuF%2F8423fce1c899fea9fb0ba6a2f7215ef4%2Feval-timeline-light.png&w=1920&q=75)  
![Evals complement your existing test suite.](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2FPJGrEme3aeFMgNIq54fSc%2F78f863f982d47eb8e39e70d9e5b35f03%2Feval-timeline-dark.png&w=1920&q=75)

評価には主に3種類あります：

- **コードベースのグレーディング：**  
  コードを利用した自動チェックは、客観的な基準と迅速なフィードバックに最適です。たとえば、AIの出力に特定のキーワードが含まれているか、正規表現に一致しているかを確認できます。ただし、すべての評価をコード化することはできません。

- **人的グレーディング：**  
  主観的な評価では、人間の判断を活用することが、品質や創造性の微妙な側面を評価する上で不可欠です。特に、生成されたテキストの明確さ、一貫性、全体的な効果を評価するのに有用です。

- **LLMベースのグレーディング：**  
  別のAIモデルを用いて出力を評価する方法は、複雑な判断に対してスケーラブルです。人的グレーディングほど信頼性は高くないものの、大規模な評価においてはコスト効果が高く効率的です。なお、LLMによる評価はコードベースのグレーディングよりも1.5倍から2倍のコストがかかります。

---

### [決定論的から確率論的へ](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#from-deterministic-to-probabilistic)

では、なぜ評価が必要なのでしょうか？

定義された入力があれば、コードは予測可能な出力を生成します。たとえば、「2+2」は常に「4」となり、開発者はユニットテストや自動テストを用いて品質を保証できます。

一方で、LLMは確率的な振る舞いを示します。ブラックボックスとして動作するため、その応答を予測するのは困難です。これは「2+2」の計算ではなく、むしろ明日の天気予報をするようなものです。

そこで評価の出番です。非決定的な出力を継続的に評価・改善するフレームワークを採用することで、開発者は品質、信頼性、可観測性を損なうことなく、変動するAIシステムを効果的に利用することが可能となります。

---

### [検索エンジンからの教訓](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#lessons-from-search-engines)

このテストから評価へのシフトは、過去20年間にわたってウェブ検索エンジニアが直面してきた課題を反映しています。ウェブの広大さや予測不可能なユーザーの問い合わせに対処する中で、徹底的かつハードコードされたテストが現実的ではないことを早期に認識しました。

検索品質チームは、どんな変更も改善と回帰の両面をもたらす可能性があることを念頭に、評価中心のプロセスに適応しました。従来のテストに比べて速度は遅く、主観的な部分もありますが、複雑で非決定的な環境において検索品質を向上させるには、この評価駆動型アプローチが最も効果的でした。

---

### [評価例：Reactコンポーネントの生成](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#eval-example:-generating-a-react-component)

例を見てみましょう。ユーザーの記述に基づいてReactコンポーネントを生成するAIアシスタントを構築すると仮定します。では、どのように出力を評価すればよいでしょうか？

**システムプロンプト：**  
リスト項目を表示するReactの関数型コンポーネント（アロー関数）を生成してください。コンポーネントは、文字列の配列をpropsとして受け取り、各文字列をリスト項目としてレンダリングする必要があります。リストはTailwind CSSを使用してスタイリングしてください。

**ユーザー：**  
`ItemList`というコンポーネントを作成してください。このコンポーネントは、アイテム名の配列を受け取り、順不同リストで表示します。各アイテムは太字で表示されるべきです。

**期待される出力：**

```js
    import React from "react";

    const ItemList = ({ items }) => (
      <ul className="list-none p-0">
        {items.map((item, index) => (
          <li key={index} className="font-bold">
            {item}
          </li>
        ))}
      </ul>
    );

    export default ItemList;
```

**実際の出力：**

```js
    import React from "react";

    function ItemList(props) {
      return (
        <ul>
          {props.items.map((item) => (
            <li style={{ fontWeight: "bold" }}>{item}</li>
          ))}
        </ul>
      );
    }

    export default ItemList;
```

この例では、AIが生成したコードは機能的であるものの、期待される意見的な出力からいくつかの点で逸脱しています。

- **スタイリング：**  
  期待される出力はTailwind CSSのクラス（`list-none p-0`、`font-bold`）を使用していますが、実際の出力はインラインスタイルを用いています。

- **Keyプロップ：**  
  期待される出力ではリスト項目に対して`key`プロップが正しく付与されていますが、実際の出力では省略されています。

- **コンポーネント定義：**  
  期待される出力はアロー関数コンポーネントを使用していますが、実際の出力は従来の関数コンポーネントを使用しています。

評価は基本的な機能性のみならず、コードの品質、スタイル、さらには任意のベストプラクティスへの準拠も測定します。これらの違いは微妙な場合もありますが、評価はそれらの差異を定量化し、対応する仕組みを提供します。

たとえば、以下の方法でこれらのニュアンスを検出できます：

- **コードベースのグレーディング：**  
  インラインスタイルとTailwindクラスの正規表現によるチェック、または`key`プロップの有無を確認する。

- **人的グレーディング：**  
  ドメインの専門家やエンドユーザーが生成されたコードを確認し、いいね／悪いねで評価し、必要に応じてコメントを提供する。

- **LLMベースのグレーディング：**  
  小規模なモデルを訓練して、生成されたコードと期待される出力を比較する。

最も重要なのは、これらの手法のいずれも、評価対象の各領域に対して明確なスコアを提供することです。これにより、AIが各基準において改善しているのか、あるいは退行しているのかを容易に判断できます。

この分析結果をもとに、モデルのさらなる微調整や改良が行われ、より信頼性の高いAI生成へとつながります。そして、ここに評価の真価が発揮されるのです。

---

## [AIネイティブ・フライホイール](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#the-ai-native-flywheel)

評価は単なる従来のテストの置き換えではありません。高品質なデータ、優れたモデルや戦略、そしてユーザーフィードバックと組み合わせることで、私たちが**AIネイティブ・フライホイール**と呼ぶ新たな開発サイクルの原動力となります。

![AI Native Flywheel Light](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F4Bdcu7otKJ73NfEUhJS1sg%2Fd09a2de2bade88699ae01c7542a361d7%2Fai-native-flywheel-light.png&w=1920&q=75)  
![AI Native Flywheel Dark](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F2SkCwnawY1ostTJE7VSJ3B%2F88d49d28f058d7dc34f070c35063a405%2Fai-native-flywheel-dark.png&w=1920&q=75)

この正のフィードバックループは開発のスピードを加速させ、AIシステムが継続的に改善されることを保証します。これにより、より多くの場面でAIを活用し、プロセス全体をさらに向上させることが可能となります。

### [評価](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#evals)

評価は、AI開発の基盤です。評価は、AIの強みや弱点について重要なフィードバックを提供し、直感に頼るのではなくデータに基づいた意思決定を導き、開発プロセスをガイドします。

しかし、評価を効果的に活用し、その進捗を追跡することはまた別の挑戦です。手法はしばしば場当たり的で、手動レビューや一般的なベンチマークに依存するため、スケールしにくく、ターゲットとする改善に必要な具体性に欠けます。

こうした課題に対して、[Braintrust](https://www.braintrust.dev/) のようなツールを用いれば、LLM評価者、ヒューリスティクス、比較分析に基づいた自動評価を実現でき、プロダクションログやユーザーの相互作用を評価データに組み込む現実のフィードバックループと統合するのに役立ちます。

---

### [データ](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#data)

堅牢な評価は、データのギャップを特定し、データ収集の取り組みを絞り込むためにも重要です。高品質なデータは効果的なAIを支えます―「ゴミを入れればゴミが出る」という原則は今も有効です。[ゴールデンデータ](https://vercel.com/blog/how-to-build-scalable-ai-applications#data-cleansing-and-management)を利用することで、より良い微調整や事後学習の手法が実現し、システム全体のパフォーマンスが向上します。

新たなデータソースを導入する際は、AIが幻覚などの問題を起こさずに効果的に利用できるよう、適切な評価を実施する必要があります。

---

### [モデルと戦略](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#models-and-strategies)

AIの世界は、日々新しいモデルや研究が登場する中で変化しています。評価は、定義した基準に対して様々なモデルや戦略を迅速にテストできるため、この変化に柔軟に対応する手助けとなります。

これにより、最高の精度、パフォーマンス、コスト効果を実現するための最適なモデル、[データ拡張](https://sdk.vercel.ai/docs/guides/rag-chatbot)、および[プロンプトエンジニアリング](https://sdk.vercel.ai/docs/advanced/prompt-engineering)の組み合わせを特定することができます。

また、統一された型安全な抽象レイヤーを備えた[AI SDK](https://sdk.vercel.ai/)（`npm i ai`）を利用すれば、コードの変更を最小限に抑えながら、異なるプロバイダーやモデル間を迅速に切り替えることが可能となり、このプロセスが大いに簡略化されます。

---

### [フィードバック](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#feedback)

多様なフィードバックは、継続的な最適化にとって極めて重要です。実際のユーザーから直接得られる製品内フィードバックは、実環境におけるAIのパフォーマンスを明確に把握する手助けとなります。以下のアプローチを検討してください：

- **明示的フィードバック：**  
  ユーザーがAIの出力に対して直接評価やレビューを行えるようにします。これはシンプルな「いいね／よくないね」や星評価、または詳細なフィードバックフォームなどで実現できます。

- **暗黙のフィードバック：**  
  AIを搭載した機能におけるユーザーの行動を追跡します。たとえば、ユーザーが問い合わせ内容を頻繁に言い換えたり中断したりする場合、AIの理解に問題がある可能性を示唆します。

- **エラー報告：**  
  予期せぬ動作を捕捉・分析するための堅牢なエラー報告システムを実装します。これにより、バグやAIの限界を特定し、対処することが可能となります。

これらのフィードバックを組み合わせることで、ユーザー視点からAIの強みと弱みを包括的に理解できます。そして、そのフィードバックを直接評価に反映することで、継続的な改善サイクルが生まれ、フライホイールが駆動され、AIプロダクトは絶えず進化し続けます。

---

## [Vercelのv0：実践における評価駆動型開発](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#vercel's-v0:-eval-driven-development-in-practice)

私たちの主力AIプロダクトである[v0](https://v0.dev/)は、評価駆動型開発を基盤に構築されています。多角的な評価戦略として、迅速かつ信頼性の高いコードチェック、エンドユーザーおよび内部の人的フィードバック、そして大規模な複雑な判断に対応するLLMベースのグレーディングを組み合わせています。これらすべてのフィードバックが評価へと反映されます。

この仕組みにより、エラーを早期に発見し、反復作業のスピードを上げ、実環境から得られるフィードバックに基づく継続的な改善を推進できます。私たちはほぼ毎日、プロンプトの改善を重ねています。評価は回帰を防止し、RAGコンテンツの更新時に正確なソースのマッチングを保証します。

v0は、テキストからユーザーインターフェースを生成することを可能にします。評価は、コードの機能性、美観、効率性を常に向上させるための手助けとなっています。（デモンストレーションのため、生成速度を加速しています。）

v0は、テキストからユーザーインターフェースを生成する機能を提供します。評価により、コードの機能性、美的側面、効率性が常に向上するよう改善が続けられています。（デモンストレーションのため、生成が加速されています。）

私たちは、拒否や安全性に関する評価を最優先し、100%の合格率を維持するよう努めています。現在すべての評価が合格しているわけではありませんが、継続的な改善のため、新たな失敗するプロンプトを評価セットに追加しています。VueやPythonのサポートといった新機能を追加する際も、併せて評価を実施し、品質を保証します。内部での自社利用（ドッグフーディング）によって、改善すべき領域に関する貴重なフィードバックを得ています。

特にコードベースのグレーディングは効果的です。私たちのコード品質チェックには、以下の項目が含まれます：

- コードブロックの検証
- 正しいインポートの確認
- 複数ファイルの使用確認
- コードコメントと実際のコードのバランス（LLMの怠慢を是正）の検証

自動化されたスクリプトが評価テストスイート全体を実行し、合否率、回帰、改善点を報告します。Braintrustは手動レビューのためにすべてのログを記録し、出力パイプラインに影響を与えるすべてのGitHubプルリクエストには評価結果が含まれます。

これらの評価を維持することは継続的な課題であり、AIシステムの進化に伴ってアップデートが必要となります。私たちは、人的介入を完全に排除することなく、評価スイートの管理をより効率的かつスケーラブルにする方法を模索し続けています。

---

## [AIネイティブ開発の未来](https://vercel.com/blog/eval-driven-development-build-better-ai-faster#the-future-of-ai-native-development)

評価駆動型開発は、堅牢で革新的なAIソフトウェアを構築するための基盤です。これにより、品質や制御、ユーザー中心のデザインを損なうことなく、AIの潜在能力を最大限に活用できます。

継続的なフィードバックループを備えたAIネイティブ・フライホイールは、AIの複雑な側面を乗り越え、迅速な反復と継続的な改善を実現します。このプロセスは、堅牢な評価とUXへの注力と相まって、インテリジェントで価値あるアプリケーションを創出する鍵となります。
