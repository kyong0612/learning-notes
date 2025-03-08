# smallpond ... distributed DuckDB?

ref: <https://dataengineeringcentral.substack.com/p/smallpond-distributed-duckdb>

AIのハイプに関しては、私はほとんど無視するようにしています。絶え間なく登場する新しいモデルやその他の大騒ぎは、ほとんど意味がありません。落ち着くまで待つ方が良いのです。

また、私が信条としている言葉は「あなたは私の上司ではない」です。しかし、誰かがこのトピックをレビューするよう依頼してきたので、今回は珍しく、私にとって「とても苦痛」ではありますが、親切に応じることにします。

とはいえ、私はプロとしても[個人的にもLLMのファインチューニングを行い](https://dataengineeringcentral.substack.com/p/llms-part-2-fine-tuning-openllama)、RAGを構築したりと、十分な時間を費やしてきました。もはや魅力は失われ、魔法ではなくなりました。それは単に90%がデータエンジニアリングであり、データセットの準備などの作業です。

> AIを扱う時間の大部分は、単にデータセットの構築やDevOpsのようなこと、例えばワークフローやトレーニング用クラスターのセットアップなどに費やされることがわかりました。

これが今日のトピックに繋がります。「データセットの構築と処理」が作業の大部分を占めるため、読者からのリクエストに基づいて、[deepseek-aiの新しいデータ処理ツール](https://github.com/deepseek-ai/smallpond)を見てみようと思いました。これはDuckDBの上に構築されています。

いつものように、我々がするのはロケット科学ではなく、単に棒を持って**[smallpond](https://dataengineeringcentral.substack.com/p/llms-part-2-fine-tuning-openllama)**の目を突っついてみることです。

## smallpond - [DuckDB](https://duckdb.org/)と[3FS](https://github.com/deepseek-ai/3FS)を基盤とした軽量データ処理フレームワーク

では、どこから始めましょうか。とにかく取り掛かりましょう。

[smallpond](https://github.com/deepseek-ai/smallpond)が[DuckDB](https://dataengineeringcentral.substack.com/p/should-you-use-duckdb-or-polars?utm_source=publication-search)と3FSの上に構築されていることと、データ処理ツールであること以外に、何か意味のあることを付け加えられるでしょうか？

- 「[DuckDB](https://dataengineeringcentral.substack.com/p/should-you-use-duckdb-or-polars?utm_source=publication-search)を活用した**高性能**データ処理」
- 「PBスケールのデータセットを処理できる**スケーラビリティ**」

出発点として、[deepseek-ai](https://github.com/deepseek-ai/smallpond)がさらに別の「高性能でスケーラブルな」データ処理フレームワークを構築する必要があったことは興味深いですが、驚くことではありません。**なぜでしょうか？**

人々はSparkに飽きて、他の選択肢を求めています。今では[Polars](https://dataengineeringcentral.substack.com/p/replace-databricks-spark-jobs-using?utm_source=publication-search)や[Daft](https://dataengineeringcentral.substack.com/p/daft-vs-spark-databricks-for-delta?utm_source=publication-search)など、[Rust](https://dataengineeringcentral.substack.com/p/when-to-rust-for-data-engineering?utm_source=publication-search)で構築されたオプションがあります。さらに[DuckDB](https://dataengineeringcentral.substack.com/p/duckdb-inside-postgres?utm_source=publication-search)自体もありますが、[deepseek-ai](https://www.deepseek.com/)のケース、そして恐らく多くの他のケースでの重要なニーズは**スケーラビリティ**だと思います。

> そして、**スケーラビリティ**とは単一ノードでの高速処理だけでなく、通常はSparkでしか扱えないような巨大なデータセットを処理できることを意味します。

## ここでいくつかの幻想を打ち砕きましょう

コードを書いてテストを始める前に、いくつかの過剰な期待に冷水を浴びせておきましょう。[deepseek-ai](https://www.deepseek.com/)とその[smallpond](https://github.com/deepseek-ai/smallpond)に関する熱狂的な話題がありますが、何が起きているのか理解するために少し冷静になりましょう。

smallpondの世界には2種類のユーザーがいるでしょう：

- 小規模データセットを扱う一般的なデータエンジニアリングユーザー（**ユーザーの90%**）
- TB以上のデータセットでsmallpondを使用しようとする上級ユーザー（**ユーザーの10%**）

真実は、[smallpond](https://github.com/deepseek-ai/smallpond)は大規模処理向けに作られたものであり、人々が[duckdb](https://dataengineeringcentral.substack.com/p/duckdb-delta-lake)やSparkの代わりにそれを使い始める可能性は低いということです。

また、素人の私には、[deepseek-ai](https://github.com/deepseek-ai/smallpond/blob/main/docs/source/getstarted.rst)が驚くべき新しい分散処理を発明しているようには見えません。分散処理には[Ray](https://docs.ray.io/en/latest/cluster/getting-started.html)を使用しています。

「高レベルAPIは現在、バックエンドとしてRayを使用しており、データフローグラフの動的な構築と実行をサポートしています。」- [ドキュメント](https://github.com/deepseek-ai/smallpond/blob/main/docs/source/api.rst)

> 私は最近、[huggingfaceのtransformers](https://huggingface.co/docs/transformers/en/index) LLMのファインチューニングを分散させるために[Ray](https://docs.ray.io/en/latest/cluster/getting-started.html)を使用しました。それは良いツールであり、[smallpond](https://github.com/deepseek-ai/smallpond)がその車輪を再発明しなかったのは理解できます。

[smallpond](https://github.com/deepseek-ai/smallpond/blob/main/docs/source/getstarted.rst)について学び始めたいので（何かを十分に学ぶには時間と使用経験が必要だということは承知しています）、2つのアプローチを試してみます：

- S3にある小さなCSVファイルをローカルで使用
  - _ツールを学ぶだけ_
- Rayクラスターとsmallpondを活用してみる
  - _どれだけ難しいか、どれだけ壊れるかを確認するだけ_

> _私が自問し、あなたも自問すべき質問の一つは、なぜsmallpondを普通のDuckDBの代わりに使うべきなのかということです。_ **答えはおそらく「使うべきではない」ですが、smallpondはDuckDBを使った革新的なツールの開発に繋がるでしょう。**

## ラップトップ上のsmallpond

いつものように、[これをGitHubにアップロードします](https://github.com/danielbeach/try-smallpond/tree/main)のでコピー＆ペーストにご利用ください（まだ[uvを使い始めていない](https://dataengineeringcentral.substack.com/p/replace-pythons-pip-with-uv)なら、いったい何が問題なのでしょうか？）

> 見てください、必要なのはこれだけです。おばあちゃんでもたぶん理解できるでしょう。

```
uv init try-smallpond
cd try-smallpond
uv add duckdb smallpond
```

smallpondは表面上では非常に...限られているように見えます。多くの機能はありません。しかしそれは良いことです。まず、ドキュメントは最悪で、[githubの半分出来上がったようなもの](https://github.com/deepseek-ai/smallpond/blob/main/docs/source/getstarted.rst#id1)を除けば、ほとんど存在しません。

でも心配しないでください。私はRustを書くことに慣れています。つまり、コードがドキュメントなのです。

```
import smallpond

sp = smallpond.init()
```

さて、次は何でしょう？

これはデータ変換ツールなので、私が持つ主な2つの疑問は...

- **どのような種類のデータを読み込めるのか、どうやって読み込むのか？**
- **どうやって変換を適用するのか？**

これらの質問への明確な回答はGitHubのREADMEにはありません。そこで基本的に[smallpondのコードで "read_" を含むものを検索して](https://github.com/search?q=repo%3Adeepseek-ai%2Fsmallpond%20read_&type=code)、どんな読み込み機能をサポートしているか調べました。それによると2つのオプションがあるようです：

- [read_parquet](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/dataframe.py#L48)
- [read_csv](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/dataframe.py#L38)
- [read_json](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/dataframe.py#L64)

> （また、コードの一部を読むと、[smallpondは読み込みにarrowを使用している](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/io/arrow.py)ようです。これは、smallpondがメモリ内処理にのみDuckDBを使用し、IOにはarrowを使用しているのでしょうか？）

参考までに、[書き込みオプションはDataFrameのwrite_parquetだけしか見つけられませんでした。](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/dataframe.py#L616)

私の言うことは半信半疑で聞いてください。学校のお迎え車列に座りながらコードを読んで、smallpondが何をできるのか解読しようとしているだけです。彼らは単に私たちに教えるという良いアイデアを持っていなかったようです。

データの読み込み方法はわかりましたが、変換はどうでしょうか？GitHubの変換に関する記述は...「データを変換するためにPython関数やSQL式を適用する」だけです。ただし、そのSQLの使い方は示されていません。

> [DataFrameコードをさらに調べると、SQLまたはPython式でフィルタリングできるようです](https://github.com/deepseek-ai/smallpond/blob/ed112db42af4d006a80861d1305a1c22cabdd359/smallpond/dataframe.py#L423)。つまりSQLかラムダ式を書くことができますが、みんなどちらを選ぶか想像できますよね？

では次のようなことができます：

- **filter**

```
df = df.filter('a > 1')
```

- **map**

```
df = df.map('a + b as c')
```

- **flatmap**

```
df = df.flat_map('unnest(array[a, b]) as c')
```

- **partial_sql**（入力DataFrameの各パーティションでSQL実行）

```
c = sp.partial_sql("select * from {0} join {1} on a.id = b.id", a, b)
```

繰り返しますが、私が見落としているものがあるかもしれません。私はただ理解しようとしている一人の人間です。これらは私が見つけられたすべてです。コードを拡張して、S3のCSVデータを読み込んでみましょう。S3 URIをどう扱うか気になります。

```
# hello.py
import smallpond

def main():
    sp = smallpond.init()
    df = sp.read_csv("s3://confessions-of-a-data-guy/harddrivedata/2024-07-01.csv")
    print(df)

if __name__ == "__main__":
    main()
```

```
uv run -- hello.py
```

なんということでしょう。

```
Traceback (most recent call last):
  File "/Users/danielbeach/code/try-smallpond/hello.py", line 12, in <module>
    main()
  File "/Users/danielbeach/code/try-smallpond/hello.py", line 7, in main
    df = sp.read_csv("s3://confessions-of-a-data-guy/harddrivedata/2024-07-01.csv")
TypeError: read_csv() missing 1 required positional argument: 'schema'
```

> 正直、そんなことをする時間はありません。そのCSVファイルのスキーマを書く労力は払いたくありません。**期待外れです**。_データセットをparquetに変換して先に進むことにします。_

この行を更新して再実行しました：

```
df = sp.read_parquet("s3://confessions-of-a-data-guy/harddrivedata/sample.parquet")
```

> うまくいきませんでしたが、エラーはありませんでした。簡単なSQLフィルターを試して、結果をCSVファイルに書き出してみましょう。

この時点で気づいたのは、当然ながらsmallpondは遅延評価を行い、**書き込みのような明らかなことが起こるまで実行をトリガーしない**ということです。

```
import smallpond

def main():
    sp = smallpond.init()

    df = sp.read_parquet("s3://confessions-of-a-data-guy/harddrivedata/sample.parquet")
    failures = df.filter("failure = 1")
    failures.write_parquet("hobbits.parquet")

if __name__ == "__main__":
    main()
```

今度はエラーが発生しました：

```
  File "pyarrow/error.pxi", line 91, in pyarrow.lib.check_status
    raise convert_status(status)
FileNotFoundError: [Errno 2] Failed to open local file '/Users/danielbeach/code/try-smallpond/s3://confessions-of-a-data-guy/harddrivedata/sample.parquet'. Detail: [errno 2] No such file or directory
```

> smallpondは生のS3 URIを解釈できないようです。[3FS](https://github.com/deepseek-ai/3FS)を使用したり、なんとかしてS3をsmallpondで動作させる研究をする時間も意欲もありません。ローカルファイルに切り替えることにします。

今回はparquetファイルをローカルに置いたところ、うまく動作しました。下に**hobbits.parquet**が正常に作成されているのが見えます。

parquetファイルを読み込めるでしょうか？

```
>>> import pandas as pd
>>> df = pd.read_parquet('hobbits.parquet')
>>> print(df)
         date   serial_number                 model  capacity_bytes  ...  smart_254_normalized smart_254_raw  smart_255_normalized  smart_255_raw
0  2024-07-01  PL1331LAGXN3AH  HGST HDS5C4040ALE630   4000787030016  ...                   NaN           NaN                   NaN            NaN

[1 rows x 197 columns]
```

これは良い兆候です。何かが動作するようになりました。

> _ちなみに、smallpondコードを実行すると、Ray Cluster UIが提供されます。_

Pythonフィルター（ラムダ式）も試してみました：

```
failures = df.filter(lambda r: r['failure'] == 1)
```

問題なく動作しました。

## これ以上見る必要はないと思います

> 変に聞こえるかもしれませんが、smallpondで単純なgroupByを実行する方法がわかりませんでした。DuckDBベースなのに奇妙ですね？？この古い犬は新しい芸を覚えられないのかもしれませんが、DataFrame APIのコードを読んでも、各行に適用されるメソッドしか見つけられませんでした。

**これは作成されたAIのコンテキストでは理にかなっています。データセットを取り込み、大規模に変換を適用し、書き出すためのものです。すべての兆候から見て、これは分析ツールではありません。**

繰り返しますが、「ベレア人」のように自分で調べてください。私は完全に間違っているかもしれません。

## 高レベルの考察

smallpondについてどう思うか？データコミュニティへのさらなる素晴らしい追加であり、今日可能なことの限界を押し広げていると思います。

DuckDBをベースにしており、JVMではないという事実は、Sparkをビッグデータの唯一の本当の選択肢として脱却しようとしているデータチームにとって、さらなる勝利です。その時代は限られており、smallpondはその証拠です。遅かれ早かれすべてが変わるでしょう。

私には初期段階に見えます。[最近見た新興Apache Project](https://dataengineeringcentral.substack.com/p/lord-have-mercy-apache-xtable)を思い出させます。以下の分野でまだ多くの作業が必要です：

- _ドキュメント_
- _機能拡張（読み込み/書き込み/変換）_
- _使いやすさの向上_
- _クラウド統合（S3など）の第一級サポート_
