---
title: "Thread by @wangbin579"
source: "https://x.com/wangbin579/status/1957003045209817121?s=12"
author:
  - "[[@wangbin579]]"
published: 2025-08-17
created: 2025-08-19
description:
tags:
  - "clippings"
---
During an interview, a PostgreSQL expert told me that even in a clean setup (after a VACUUM FULL), you still need to run VACUUM, even if you only do read-only queries. I didn’t get it back then, and even now I still don’t. Can someone explain, or was I just being misled?

# PostgreSQLの「VACUUM FULL後でも、読み取り専用クエリしか実行しなくてもVACUUMが必要」という話について

## **1. VACUUM**と**VACUUM FULL**の違い

- **VACUUM**  
    通常のVACUUMは、不要になった行（削除や更新で「死んだ」行）を物理的に削除し、テーブルの空き領域を再利用できるようにします。また、テーブルの統計情報（ANALYZE）も更新します。
- **VACUUM FULL**  
    テーブル全体をロックし、データを新しいファイルに詰め直して、物理的にサイズを小さくします。不要な行も完全に消えます。

## **2.** なぜ「読み取り専用」でも**VACUUM**が必要なのか？

### **PostgreSQL**の**MVCC**（多版同時実行制御）

PostgreSQLはMVCCという仕組みで、各行に「トランザクションID（XID）」を持っています。  
このXIDは、行が「いつ作られたか」「いつ消されたか」を管理し、どのトランザクションから見えるかを制御します。

### トランザクション**ID**の問題

- トランザクションIDは32bit（約42億）しかありません。
- 新しいトランザクションが発生するたびにXIDが増えます。
- XIDが「ラップアラウンド（巻き戻し）」すると、古い行の可視性判定が壊れ、データベースが壊れる危険があります。

### **VACUUM**の役割

- **VACUUM**は、死んだ行の削除だけでなく、「行の可視性情報（**XID**）」の管理もしています。
- たとえ「読み取り専用」でも、他のテーブルやDBで書き込みがあればXIDは進みます。
- そのため、VACUUMを定期的に実行しないと、XIDラップアラウンド問題が発生します。

## **3.** 具体例

- 例えば、テーブルAは「読み取り専用」でも、他のテーブルBでINSERT/UPDATE/DELETEがあればXIDは進みます。
- テーブルAの行の「可視性情報」が古くなり、VACUUMしないとXIDラップアラウンドでアクセス不能になることがあります。

## **4.** まとめ

- **VACUUM FULL**は物理的なクリーンアップですが、XID管理は「通常のVACUUM」が担っています。
- 読み取り専用でも**VACUUM**は必要です。これはPostgreSQLの仕組み上、避けられません。
- PostgreSQLは自動VACUUM（autovacuum）機能があるので、通常は自動で実行されますが、autovacuumを止めている場合は手動でVACUUMが必要です。

## 参考

- PostgreSQL公式ドキュメント: [VACUUM — PostgreSQL Documentation](https://www.postgresql.org/docs/current/sql-vacuum.html)
- MVCCとXIDラップアラウンドについて: [PostgreSQL MVCC and Transaction ID Wraparound](https://wiki.postgresql.org/wiki/Freezing)

## 結論

「読み取り専用でもVACUUMは必要」というのは正しいです。  
理由は「XIDラップアラウンド防止」のためです。
