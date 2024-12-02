# DRY原則の適用範囲について

ref: <https://zenn.dev/chillnn_tech/articles/super-dry-code>

## DRY原則の本質

DRYとは「Don't Repeat Yourself」の略で、Andy HuntとDave Thomasによって提唱されたソフトウェア開発原則です。重要なポイントは、これが「**知識の重複を許さない**」という原則であり、単なる「**コードの重複を許さない**」ということではないという点です[1]。

## 適切な共通化の判断基準

共通化すべきコードは以下の2種類に分類されます：

- 再利用可能な関数として抽象化すべきもの
- 現時点でたまたま共通になっているだけのもの

理想的なDRYの適用では、関数は「**呼び出しのコンテキストによらず、将来にわたって同じ動作が期待されるもの**」であるべきです[1]。

## 過剰なDRYの見分け方

関数が過剰なDRYになっているかどうかは、以下の2つの観点から判断できます[1]：

- 引数としてコンテキスト情報を与えていないか
- 関数だけを見たときに、返り値の説明が不足していないか

## 関数化の2つの目的

関数による分割には以下の2つの異なる目的があります[1]：

- 知識の共通化（DRY原則に基づく）
- 処理の抽象化（単一責任の原則に基づく）

これらの目的を適切に使い分けることで、保守性の高いコードを実現できます。必ずしもDRY原則に従わない処理であっても、可読性向上のために関数化が有効な場合があります[1]。

Sources
[1] super-dry-code <https://zenn.dev/chillnn_tech/articles/super-dry-code>
[2] DRY原則の適用範囲について <https://zenn.dev/chillnn_tech/articles/super-dry-code>
[3] What are the benefits and potential drawbacks of over-applying the ... <https://eitca.org/web-development/eitc-wd-hcf-html-and-css-fundamentals/html-and-css-extending-skills/improving-html-and-css-code/examination-review-improving-html-and-css-code/what-are-the-benefits-and-potential-drawbacks-of-over-applying-the-dry-principle-in-web-development/>
[4] The DRY Principle in Programming: Why It's Not Always the Best ... <https://codeconservatory.com/blog/post/dry/>
[5] Understanding the DRY (Don't Repeat Yourself) Principle - Plutora <https://www.plutora.com/blog/understanding-the-dry-dont-repeat-yourself-principle>
[6] Why DRY is the most over-rated programming principle <https://www.gordoncassie.com/dry-most-over-rated-programming-principle/>
