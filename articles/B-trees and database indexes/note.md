# B-trees and database indexes

ref: <https://planetscale.com/blog/btrees-and-database-indexes>

この記事は、B-treeとB+treeについて、そしてそれらがデータベース、特にMySQLのInnoDB engineでどのように使用されているかを詳しく解説しています。以下に主要なポイントをまとめます:

## B-treeの基本

1. B-treeはデータベース管理システムで広く使用されている重要なデータ構造です[1]。

2. B-treeはキーと値のペアを木構造で格納し、効率的な検索を可能にします[1]。

3. B-treeのノードには複数のキー/値ペアが格納され、子ノードへのポインタを持ちます[1]。

## B+treeの特徴

1. B+treeはB-treeの変種で、データベースのインデックスに適しています[1]。

2. B+treeでは、キー/値ペアはリーフノードにのみ格納され、内部ノードはキーと子ノードへのポインタのみを持ちます[1]。
![alt text](<assets/CleanShot 2024-09-23 at 15.23.09@2x.png>)
3. MySQLのB+treeインデックスでは、各レベルのノードが双方向リンクリストとしても機能します[1]。

## MySQLでのB+treeの使用

1. MySQLのInnoDBエンジンは、テーブルデータ全体をB+treeで格納します。プライマリキーがツリーのキーとして使用されます[1]。

2. セカンダリインデックスも別のB+treeとして構築されます[1]。

3. B+treeのノードサイズはデフォルトで16KBで、ディスクのブロックサイズに合わせて最適化されています[1]。

## プライマリキーの選択

1. プライマリキーの選択はB+treeの構造に大きな影響を与え、パフォーマンスに直結します[1]。

2. 自動増分する整数をプライマリキーとして使用すると、挿入操作が効率的になり、ツリーの深さを抑えられます[1]。

3. UUIDをプライマリキーとして使用すると、ランダムな挿入が発生し、パフォーマンスが低下する可能性があります[1]。

4. キーのサイズも重要で、小さいキー（例：BIGINT）を使用すると、より多くのキーをノードに格納でき、ツリーを浅く保てます[1]。

## パフォーマンスの考慮事項

1. B+treeの深さを浅く保つことで、検索性能が向上します[1]。

2. InnoDBはバッファプールを使用して、頻繁にアクセスされるページをメモリにキャッシュし、ディスクI/Oを減らします[1]。

3. シーケンシャルなプライマリキーを使用すると、データの順序付けや範囲クエリの効率が向上します[1]。

この記事は、データベース設計者やエンジニアがインデックスとプライマリキーの選択を最適化する際の重要な考慮事項を提供しています。