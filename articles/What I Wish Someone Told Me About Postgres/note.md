# What I Wish Someone Told Me About Postgres

ref: <https://challahscript.com/what_i_wish_someone_told_me_about_postgres>

Postgresについて知っておきたかったこと

2024年11月11日

私はプロとしてウェブアプリの開発に10年近く取り組んできましたが、その間に多くのシステムやツールの使い方を学ばなければなりませんでした。その中で、公式ドキュメントが最も役に立つことが多いと気づきました。ただし、Postgresだけは例外でした。

これは、公式ドキュメントが優れていないからではありません（実際、素晴らしいです！）。問題は、その膨大な量にあります。現在のバージョン（執筆時点で17）の場合、標準的なUSレターサイズの用紙でPDFとして印刷すると、3,200ページにもなります。初学者が最初から最後まで読むには到底手が届きません。

そこで、私がPostgresデータベースを扱う際に「誰かがこれを先に教えてくれていたらよかったのに」と思ったポイントをまとめてみたいと思います。この情報が、同じような旅を進む次の人にとって少しでも役に立つことを願っています。

なお、ここで挙げた多くのポイントは、他のSQLデータベース管理システム（DBMS）やその他のデータベースにも当てはまるかもしれません。ただ、私は他のDBMSに詳しくないため、どれが該当するか確信はありません。

## データの正規化を行うべき。ただし、良い理由がある場合を除く

データベースの正規化とは、スキーマから重複または冗長なデータを取り除くプロセスのことです。例えば、ユーザーがドキュメントをアップロードできるサイトがあり、他の人がそのドキュメントを閲覧した際にメール通知を受け取ることができるとします。この場合、documents テーブルに user_email カラムを持たせるべきではありません。なぜなら、ユーザーがメールアドレスを変更したい場合、アップロードされたすべてのドキュメントの行を更新しなければならなくなるからです。代わりに、documents の各行が別のテーブル（例えば users）の行を表し、外部キー（例えば user_id）を用いるようにするべきです。

「データベースの正規化」でオンライン検索をすると、「第1正規形」といった情報がたくさん出てくると思います。それらすべてを理解する必要はありませんが、このプロセスをざっくりと知っておくことは有用です。正規化を行うことで、保守しやすいデータベーススキーマを作成できる可能性があります。

### 正規化をしない場合について

冗長なデータ（つまり、スキーマを非正規化する）を持たせる方が合理的な場合もあります。これは通常、特定のデータを毎回計算する必要をなくし、読み取りを高速化するためです。

例えば、パン屋の従業員シフトを管理するアプリケーションがあり、ユーザーがこれまでに働いた時間を確認したいとします。この場合、各シフトの期間を計算し、それらを合計する必要があります。これを効率化するために、働いた時間を定期的に、または変更があるたびに計算して保存しておく方が合理的です。このような非正規化されたデータは、Postgresデータベース内で管理することもできますし、Redisのようなキャッシュレイヤーで管理することもできます。ただし、非正規化されたデータにはほぼ常にコストが伴います。それはデータの一貫性の問題や、書き込み処理が複雑になることなどです。

## Postgres開発者のアドバイスに従うべし

Postgresの公式Wikiには、「これをやってはいけない」というタイトルのリストがあります。このリストには多くの推奨事項が書かれていますが、それらすべてを理解する必要はありません。理解できないことがあれば、おそらくそのミスを犯す可能性も低いでしょう。

特に注目すべきいくつかの提案を挙げます：

1. すべてのテキストストレージには text 型を使用する。
2. すべてのタイムスタンプストレージには timestampz（タイムゾーン付き）型を使用する。
3. テーブル名はスネークケース（snake_case）で命名する。

## SQLの特殊なクセに注意すること

小指を守ろう：SQLはすべて大文字で書く必要はない

ドキュメントやチュートリアルでは、以下のようにSQLがすべて大文字で書かれているのをよく目にします：

```sql
SELECT * FROM my_table WHERE x = 1 AND y > 2 LIMIT 10;
```

しかし、SQLキーワードの大文字小文字は無視されます。そのため、次のような書き方も同じ意味を持ちます：

```sql
select * from my_table where x = 1 and y > 2 limit 10;
```

または：

```sql
SELECT * from my_table WHERE x = 1 and y > 2 LIMIT 10;
```

この仕様はPostgres特有のものではなく、他のSQLデータベースでも同様です。小指の負担が減るので、この点を活用しましょう。

## NULLは少し特殊な存在

他のプログラミング言語で見られるnullやnilの値に慣れているかもしれませんが、SQLのNULLはそれらとは少し異なります。NULLは、むしろ「未知」という意味に近いです。例えば、NULL = NULLはNULLを返します（なぜなら、一つの未知がもう一つの未知と等しいかどうかはわからないからです！）。これは=だけでなくほとんどの演算子にも当てはまります。一方がNULLである場合、その比較結果は常にNULLになります。

ただし、NULLを扱う際に使用できる特定の演算子がいくつかあります：

操作 説明
x IS NULL xがNULLの場合はtrueを返し、それ以外の場合はfalseを返す。
x IS NOT NULL xがNULLでない場合はtrueを返し、それ以外の場合はfalseを返す。
x IS NOT DISTINCT FROM y x = yと同じ。ただしNULLを通常の値として扱う。
x IS DISTINCT FROM y x != yまたはx <> yと同じ。ただしNULLを通常の値として扱う。

例えば、WHERE句は条件がtrueに評価される場合のみ一致します。このため、以下のようなクエリ：

```sql
SELECT * FROM users WHERE title != 'manager';
```

このクエリは、titleがNULLの行を返しません。なぜなら、NULL != 'manager'はNULLとなるからです。

NULLを扱う便利な関数：COALESCE

COALESCEは複数の引数を受け取り、その中で最初にNULLでない値を返します：

COALESCE(NULL, 5, 10) = 5
COALESCE(2, NULL, 9) = 2
COALESCE(NULL, NULL) IS NULL

このように、COALESCEを使用すると、NULLをうまく処理できる場合があります。

## psqlをより便利に使うためのヒント

### 読みにくい出力を改善する

たくさんのカラムや長い値を持つテーブルに対してクエリを実行すると、結果がほぼ読めない状態になることがあります。これは、ペイジャー（pager）が有効になっていないためです。

ペイジャーとは、テキストを大きなキャンバスにスクロールして表示できる機能です。これが有効でないと、クエリ結果が端末全体に文字を詰め込む形で表示されます。lessは、Unix系システムならどこでも使える便利なペイジャーです。以下のように環境変数を設定して使うことができます：

```bash
# 長い行を折り返さずにスクロールできるようにする
export PAGER='less -S'
```

また、カラム数が多いテーブルに対して表形式での表示が役立たない場合、「拡張モード」に切り替えることができます。これは、\pset expanded（またはショートカットとして\x）をpsqlセッションで実行することで有効になります。これをデフォルト設定にしたい場合は、~/.psqlrcというファイルを作成し、以下の行を追加します：
`\x`

これにより、psqlセッションを開始するたびに拡張モードが自動的に有効になります。

## 曖昧なNULLを明確にする

クエリの結果で値がNULLかどうかを判別するのは非常に重要です。しかし、デフォルト設定ではそれが明確に表示されないことがあります。psqlでは、NULLの代わりに特定の文字列を出力するよう設定できます。たとえば、以下のコマンドを実行して、[NULL]という文字列を出力するように設定できます：

```bash
\pset null '[NULL]'
```

もちろん、任意のUnicode文字列を使用することも可能です。例えば、友人のSteven Harmanは、「👻」を設定に使用しています。

これをデフォルトにしたい場合、~/.psqlrcというファイルを作成し、次の行を追加します：

```bash
\pset null '[NULL]'
```

この設定により、psqlセッションを開始するたびに自動的にこの設定が適用されます。

## オートコンプリート機能を活用する

psqlでは、他の多くのインタラクティブコンソールと同様に、オートコンプリート機能が利用できます。SQLは非常に構造化された言語であるため、この機能は非常に役立ちます。例えば、次のように入力を補完できます：

```sql
-- "SEL"を入力
SEL
-- Tabキーを押す
SELECT
```

これにより、タイピングの手間を減らせます。

## バックスラッシュショートカットを活用する

psqlには、多くの便利なショートカットコマンドがあります。以下にいくつかの例を挙げます：

コマンド 機能説明
\? すべてのショートカットコマンドのリストを表示します。
\d テーブルやシーケンスなどのリストと、それらの所有者を表示します。
\d+ \dと同様ですが、サイズやその他のメタデータも含めて表示します。
\d table_name 指定したテーブルのスキーマ（カラムのリスト、型、NULL許可、デフォルト値）やインデックス、外部キー制約を表示します。
\e デフォルトのエディタ（環境変数$EDITORで設定されたもの）を開き、クエリを編集できます。
\h SQL_KEYWORD 指定したSQLキーワードの構文とドキュメントへのリンクを取得します。

これらはほんの一部に過ぎません。psqlのショートカットは非常に多く、学ぶ価値があります。

## クエリ結果をCSVにエクスポートする

クエリの出力を他の人と共有したい場合、その結果をCSV形式でローカルに保存するのは非常に簡単です。次のように実行します：

```bash
\copy (SELECT * FROM some_table) TO 'my_file.csv' CSV
```

さらに、カラム名を含むヘッダー行を追加したい場合は、次のようにHEADERオプションを付けます：

```bash
\copy (SELECT * FROM some_table) TO 'my_file.csv' CSV HEADER
```

逆に、CSVデータをインポートしてテーブルに挿入する方法もあります。詳しくは公式ドキュメントをご参照ください。

## カラムのショートハンドとエイリアスを利用する

SELECT文では、出力される各カラムにASキーワードを使って任意の名前を付けることができます：

```sql
SELECT vendor, COUNT(*) AS number_of_backpacks FROM backpacks GROUP BY vendor;
```

これにより、出力結果のカラム名がリネームされます。

さらに、GROUP BYやORDER BYでは、出力カラムの位置番号を参照する便利なショートハンドも使えます。以下のように書くことができます：

```sql
SELECT vendor, COUNT(*) AS number_of_backpacks FROM backpacks GROUP BY 1 ORDER BY 2;
```

ただし、このショートハンドは本番環境で使用するクエリには避けるべきです。将来の自分が感謝するでしょう。

## インデックスを追加しても効果がない場合がある（特に設定が不適切な場合）

### インデックスとは何か？

インデックスとは、データの検索を効率化するためのデータ構造です。Postgresでは、テーブルの行を特定のフィールドに基づいて「ショートカット」のように管理します。最も一般的なものはBツリーインデックスで、これは以下のような条件に対応します：
 • 正確な一致条件（例：WHERE a = 3）
 • 範囲条件（例：WHERE a > 5）

ただし、Postgresでは特定のインデックスを明示的に使用するよう指示することはできません。Postgresは、各テーブルの統計情報を使用して、シーケンシャルスキャン（全行を読み込む処理）よりもインデックスの方が速いと判断した場合にのみ、インデックスを使用します。

インデックスがどのように使用されるかを確認するには、SELECT ... FROM ...の前にEXPLAINを追加してクエリ計画を表示します。これにより、Postgresがデータを見つけるためにどのような計画を立てているのか、各タスクにどの程度の作業が必要かを確認できます。

### インデックスが役立たないケース：テーブルに行がほとんどない場合

特にローカル環境で開発を行う際、データベースに数百万行ものデータがあることは少ないでしょう。この場合、Postgresはたった100行を扱うのであれば、インデックスを使用せずシーケンシャルスキャンを行った方が速いと判断するかもしれません。

### 複数カラムをインデックス化する場合、順序が重要

Postgresは複数カラムのインデックス（マルチカラムインデックス）をサポートしています。例えば、次のようにaとbのカラムにインデックスを作成した場合：

```sql
CREATE INDEX CONCURRENTLY ON tbl (a, b);
```

以下のようなクエリは、2つの別々のインデックスを作成するよりも高速に処理されます：

```sql
SELECT * FROM tbl WHERE a = 1 AND b = 2;
```

これは1つのBツリーだけをトラバースするため、検索クエリの制約を効率的に組み合わせることができるからです。

ただし、次のようなクエリについてはどうでしょうか？

```sql
SELECT * FROM tbl WHERE b = 5;
```

この場合、上記のインデックスが役立つ可能性はありますが、最適ではありません。このインデックスはまずaの値を基準にし、その後にbをキーとするため、すべてのaの値を調べてからbを探す必要があります。そのため、bだけのインデックスを別途作成した方が速い場合もあります。クエリで必要なカラムの組み合わせ次第では、インデックスを(a, b)とbの両方作成する方が効率的です。

## 接頭辞検索を行う場合はtext_pattern_opsを使用する

階層的なディレクトリ構造をデータベースに保存する場合（各行にその行の祖先IDのリストを保存する方法など）、ある行の子ディレクトリをすべて取得する必要があることがあります。この場合、次のような接頭辞検索を行う必要があります：

```sql
SELECT * FROM directories WHERE path LIKE '/1/2/3/%';
```

これを高速化するために、directoriesテーブルのpathカラムにインデックスを追加します：

```sql
CREATE INDEX CONCURRENTLY ON directories (path);
```

しかし、これだけではインデックスが使用されない可能性があります。通常のインデックス（上記のCREATE INDEXで暗黙的に作成されるデフォルトのBツリーインデックス）は、値の順序に依存するためです。このような文字単位のソートを行う場合は、インデックスを定義する際に別の「演算子クラス」を指定する必要があります：

```sql
CREATE INDEX CONCURRENTLY ON directories (path text_pattern_ops);
```

## 長時間保持されるロックがアプリケーションを停止させる可能性がある（ACCESS SHAREでも）

### ロックとは何か？

「ロック」や「ミューテックス（mutex、相互排他）」は、危険な操作を同時に行わないようにする仕組みです。この概念は多くの場所で見られますが、Postgresのようなデータベースでは特に重要です。データベースのエンティティ（行、テーブル、ビューなど）の更新は、完全に成功するか完全に失敗する必要があります。同時に複数のクライアントやプロセスが操作を実行しようとすると、操作が一部だけ成功するリスクがあります。そのため、操作を行う際には「ロック」を取得する必要があります。

### Postgresにおけるロックの仕組み

Postgresには、テーブルに対するさまざまなレベルのロックがあり、それぞれ制約の厳しさが異なります。以下はその一部を、制約の弱い順に示したものです：

ロックモード 使用されるステートメント例
![alt text](<assets/CleanShot 2025-01-06 at 22.36.47@2x.png>)

以下は、ロックの競合を示した表です（Xは競合することを意味します）：
![alt text](<assets/CleanShot 2025-01-06 at 22.36.59@2x.png>)

要求されたロックモード 既存のロックモード
![alt text](<assets/CleanShot 2025-01-06 at 22.37.05@2x.png>)

### ロックが問題を引き起こすケース

たとえば、次のようなシナリオを考えます：

 1. クライアント1がテーブルを更新しています。この操作にはACCESS EXCLUSIVEロックが必要です。
 2. クライアント2が同じテーブルでSELECTクエリを実行しようとします。ACCESS SHAREロックが必要ですが、クライアント1のロックが解除されるまで待機します。
 3. その間、他のクライアントもすべて待機することになります。

![alt text](<assets/CleanShot 2025-01-06 at 22.40.13@2x.png>)

このように、長時間のロックはアプリケーション全体を停止させる可能性があります。

### トランザクションの長時間保持も問題を引き起こす

トランザクションとは何か？

トランザクションは、一連のデータベース操作を「すべて成功する」か「すべて失敗する」のいずれかにするための仕組みです（これを「アトミック性」といいます）。トランザクションはBEGINで開始し、COMMITで終了して他のクライアントに変更内容を公開します。

例えば、銀行の口座間での資金移動では、片方の口座から金額を減らし、もう片方の口座に加算する操作を行います。この途中でエラーが発生した場合、全体をキャンセルする必要があります。これを可能にするのがトランザクションです。

トランザクションが引き起こす問題

トランザクションのロックは、COMMITされるまで保持されます。そのため、次のような状況が問題を引き起こす可能性があります：

 1. クライアント1がトランザクションを開始し、UPDATE操作を実行します。
 2. しかし、クライアント1がその後の操作を放置したまま席を外してしまいます。
 3. クライアント2が同じデータに対してDELETE操作を実行しようとしますが、クライアント1のトランザクションが終了するまで待機する必要があります。

このような状況が頻繁に発生すると、データベース全体のパフォーマンスに悪影響を及ぼします。

## JSONBは強力だが注意が必要なツール

Postgresには非常に強力な機能があります。それは、クエリ可能で効率的にシリアライズされたJSONデータを行内に格納できるJSONB型です。これにより、Postgresはドキュメント指向のデータベース（例：MongoDB）の利点を持ちながら、新たなサービスを構築したり、異なるデータストア間の調整を行う必要がなくなります。

しかし、この機能を不適切に使用すると、いくつかの欠点が生じることがあります。

### JSONBは通常のカラムよりも遅い場合がある

JSONBは非常に柔軟ですが、PostgresはJSONBカラムの統計情報を追跡しません。このため、通常のカラムを使った場合と比べて、同等のクエリが大幅に遅くなることがあります。ある[ブログ記事](https://www.heap.io/blog/when-to-avoid-jsonb-in-a-postgresql-schema)では、JSONBを使用することで2000倍遅くなった例が示されています。

### JSONBは通常のテーブルスキーマほど自己記述的ではない

JSONBカラムには基本的に何でも格納できるため、その柔軟性は大きな強みです。しかし、それゆえに構造が保証されません。通常のテーブルでは、スキーマを参照することでクエリの結果がどのようになるかを理解できますが、JSONBではそれができません。

例えば：
 • キーがcamelCaseで書かれているか？それともsnake_caseか？
 • 状態はtrue/falseのブール値で記録されるのか？それともyes/maybe/noのような列挙型で記録されるのか？

これらはJSONBでは事前に分かりません。通常のPostgresデータとは異なり、JSONBには静的型が存在しないためです。

### JSONB型は扱いがやや複雑

次の例を考えてみましょう。backpacksというテーブルにJSONB型のdataカラムがあり、その中にbrandというフィールドが含まれているとします。90年代風の美学が好きなので、JanSport製のバックパックを探したいとします。そのために次のクエリを記述します：

```sql
-- 注意: このクエリは動作しません！
SELECT * FROM backpacks WHERE data['brand'] = 'JanSport';
```

すると次のエラーが返されます：

```bash
ERROR: invalid input syntax for type json
LINE 1: SELECT * FROM backpacks WHERE data['brand'] = 'JanSport';
                                                    ^
DETAIL: Token "JanSport" is invalid.
```

Postgresは比較の右辺がJSONとして正しい形式になることを期待しています。そのため、次のように書く必要があります：

```sql
SELECT *FROM backpacks WHERE data['brand'] = '"JanSport"';
-- または型変換を明示的に行う場合
SELECT* FROM backpacks WHERE data['brand'] = '"JanSport"'::jsonb;
-- さらに簡潔な方法
SELECT * FROM backpacks WHERE data->>'brand' = 'JanSport';
```

最後のクエリのように->>演算子を使うことで、JSONB型を通常のテキスト型に変換できます。

## まとめ

この記事では、Postgresを使い始める際に知っておくと役立つポイントをいくつか紹介しました。私自身が学びながら経験した問題点や気づきが、他の人の役に立つことを願っています。