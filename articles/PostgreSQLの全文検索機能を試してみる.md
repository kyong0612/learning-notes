---
title: "PostgreSQLの全文検索機能を試してみる"
source: "https://future-architect.github.io/articles/20250829a/"
author:
  - "澁川喜規"
published: 2025-08-29
created: 2025-08-30
description: |
  夏の自由研究2025ブログ連載の4日目です。PrismaとPostgreSQLに標準で全文検索機能が用意されていることを知り、試してみました。一般的にPostgreSQLの全文検索ではPGroongaやElasticsearchが使われることが多いですが、標準機能で運用コストを下げられる可能性があります。
tags:
  - "PostgreSQL"
  - "Go"
  - "全文検索"
  - "Prisma"
  - "kagome"
---

![PostgreSQLの全文検索](/images/2025/20250829a/top.png)

## 概要

PrismaやPostgreSQLに標準で全文検索機能が搭載されていることを知り、その実用性を検証した記事です。一般的には、PostgreSQLでの全文検索にはPGroongaやElasticsearchなどが利用されますが、標準機能で代替できれば運用コストを大幅に削減できる可能性があります。本記事では、特に日本語の全文検索に焦点を当て、Go言語を用いた前処理を組み合わせることで、標準機能を活用する方法を解説しています。

## PostgreSQLの全文検索機能

PostgreSQLの全文検索は、`LIKE`検索のように`@@`という専用の演算子を使用します。検索対象のフィールドは`to_tsvector()`関数で、検索クエリは`to_tsquery()`関数で前処理するのが特徴です。

```sql
SELECT title
FROM pgweb
WHERE to_tsvector(title || ' ' || body) @@ to_tsquery('create & table')
ORDER BY last_mod_date DESC
LIMIT 10;
```

テーブルには`tsvector`型のカラムをあらかじめ用意しておくこともできます。

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_text TEXT NOT NULL,
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(processed_text, ''))
    ) STORED
);
```

### 日本語対応の課題

PostgreSQLの全文検索機能は、標準では英語のようにスペースで単語が区切られている言語を前提としています。そのため、日本語のように単語が連続している文章にはそのまま適用できません。かつては`textsearch_ja`という日本語対応モジュールが存在しましたが、現在はメンテナンスされていません。

この課題を解決するため、データベースにテキストを投入する前に、外部のプログラムで日本語をスペース区切りの単語に分割（分かち書き）する前処理を行うアプローチを試みます。

## Goによる日本語の前処理

日本語の分かち書きには、Go言語のライブラリとして定評のある`github.com/ikawaha/kagome/v2`を利用します。`kagome`はテキストを形態素解析し、品詞情報を付与してくれるため、これを利用して不要な助詞、助動詞などを除外し、動詞を原形に戻すことで、検索精度を高めることができます。

例えば、「シグナルを送信した」というテキストは以下のように解析されます。

```
シグナル        名詞,一般,*,*,*,*,シグナル,シグナル,シグナル
を      助詞,格助詞,一般,*,*,*,を,ヲ,ヲ
送信    名詞,サ変接続,*,*,*,*,送信,ソウシン,ソーシン
し      動詞,自立,*,*,サ変・スル,連用形,する,シ,シ
た      助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
```

この中から名詞や動詞の原形のみを抽出し、スペース区切りでデータベースに格納することで、`to_tsvector`が正しく処理できるようになります。

## 実装と検証

検証用のソースコードは[github.com/shibukawa/pgtfs](https://github.com/shibukawa/pgtfs)で公開されています。このCLIツールは、指定されたディレクトリのテキストファイルを読み込み、`kagome`で前処理を行った上でPostgreSQLに投入し、検索機能を提供します。

例えば、以下のような`golang.md`というファイルがあるとします。

```markdown
# Goプログラミング言語

Goは、Googleが開発したプログラミング言語です。

## 特徴
- シンプルな文法
- 高速なコンパイル
- 優れた並行処理機能
- ガベージコレクション

## 活用分野
Goは以下の分野で広く使用されています：
- Webサービス開発
- クラウドインフラストラクチャ
- コマンドラインツール
- マイクロサービス

ゴルーチンとチャネルを使った並行プログラミングが魅力的です。
```

このテキストを「Web開発」という、文中には存在しない単語（「Webサービス開発」は存在する）で検索すると、分かち書きによって「Web」と「開発」がそれぞれインデックス化されているため、正しくヒットします。

```sh
$ ./pgtfs search "Web開発"
Searching for: "Web開発"
Found 1 articles:

=== Result 1 (Rank: 0.0989) ===
Title: golang
File: articles/golang.md
```

## より使いやすい検索にするために

今回の実装は最低限のものであり、さらに検索精度を向上させるためには、以下のような改善が考えられます。

* **高度なフィルタリング**: ElasticsearchのKuromojiプラグインのように、漢数字を算用数字に変換するなど、より高度なテキスト正規化を行う。
* **類義語辞書の活用**: PostgreSQLは類義語辞書をサポートしているため、これを整備することで表記揺れに対応しやすくなる。
* **ベクトル検索の実装**: 将来的には、類似文書検索を実現するためにベクトル検索を導入することも考えられる。

## まとめ

簡単な前処理を外部で行うことで、PostgreSQLの標準機能だけでも日本語の全文検索が実現可能であることがわかりました。これにより、Elasticsearchなどの外部検索エンジンを導入することなく、低コストで全文検索機能をシステムに組み込むことができます。また、このアプローチはGo言語に限らず、分かち書きライブラリが存在する他の多くのプログラミング言語でも応用可能です。

PostgreSQLはPub/Sub機能なども備えており、今後ますます多機能化していくことで、単体で多くの要件を満たせるようになる可能性を秘めています。
