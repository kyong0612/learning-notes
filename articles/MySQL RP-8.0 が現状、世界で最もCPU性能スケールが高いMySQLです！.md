---
title: "MySQL RP-8.0 が現状、世界で最もCPU性能スケールが高いMySQLです！"
source: "https://buildup-db.blogspot.com/2025/07/mysql-rp-80-cpumysql.html"
author:
  - "[[Yasufumi Kinoshita]]"
published: 2025-07-24
created: 2025-07-27
description: |
  MySQL RP (Restore Performance) として、個人でMySQLの性能回復を研究している著者による報告。MySQL RP-8.0が、特定のベンチマークにおいて他の主要なMySQLフォークやバージョンを上回り、世界で最も高いCPU性能スケールを達成したことをベンチマーク結果とともに示している。ただし、低並列処理性能にはまだ課題があることも言及している。
tags:
  - "MySQL"
  - "performance"
  - "benchmark"
  - "CPU"
  - "database"
  - "clippings"
---
# MySQL RP-8.0 が現状、世界で最もCPU性能スケールが高いMySQLです

[**MySQL RP (Restore Performance)**](https://github.com/buildup-db/mysql-server-RP) は、著者が個人で進めるMySQLの性能回復を目的とした研究プロジェクトです。成果はGitHubで公開されており、ライセンスはMySQL Community Editionと同様のGPLです。

## プロジェクトの段階

- **第1段階（完了）**: OLTP処理で競合しそうな要素を狙ったSQLでのCPU性能スケールテストを行い、MySQL 8.0の問題点を修正。`RP008`で目立った問題は解決したと判断。
- **第2段階（現在）**: PGOビルドなしでも、シングルスレッド性能でMySQL 5.7のノーマルビルドを超えることを目指す。これにより、「世界で一番CPU性能が高いMySQL」と呼べるようになる。
  - (補足: MySQL 5.7の`PSI_MEMORY`は`performance_schema=OFF`でも非常に重く、性能を不当に下げているため、ビルド時に`-DDISABLE_PSI_MEMORY=ON`オプションを付けて公平性を期している)

## 活動への協力のお願い

この研究活動の持続のため、以下の協力を呼びかけています。

1. **[Patreonでのサポート](https://www.patreon.com/buildup_db)**: 有料会員になると、より詳細な結果説明や中間報告、分析内容が閲覧可能。
2. **採用選考・面接の機会**: この活動は求職活動の一環でもあり、採用関連の実績が活動の持続につながるため。連絡は `buildup.db@gmail.com` まで。
3. **活動の宣伝**: この活動を話題に上げてもらうこと。

## ベンチマーク結果の比較

第1段階完了時点でのベンチマーク結果。TPC-CはすでにMySQL 8.0で十分なスケールが得られており、性能差が出にくいため、より厳しい指標としてDimitri氏の[**BMK-kit**](http://dimitrik.free.fr/blog/posts/mysql-perf-bmk-kit.html)の中から個別要素に負荷をかけるSQLを使用。

### テスト環境

- **CPU**: Xeon(R) CPU E5-2699 v4 (22cores; 44threads), 2ノードNUMA
- **ストレージ**: ramfs (純粋なCPUスケールを見るため)
- **設定**: `innodb_flush_log_at_trx_commit=0` (IO待機を極力排除)

### 比較対象バイナリ

- MySQL 8.4 Community Edition
- MySQL 9.3 Community Edition
- Percona Server 8.4
- MariaDB 11
- 著者ビルド: MySQL-5.7.44, MySQL-8.0.42, **MySQL RP-8.0[RP008]** (ノーマルビルドおよびPGOビルド)

### 1. 主キーランダム検索性能スケール

セカンダリ索引の範囲スキャンで多数の主キーランダム検索を発生させ、純粋な性能を測定。

![主キーランダム検索性能スケール](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhod7qlqUp0G196xNlSmiAv9zZPVkdfcwVturgQaVoG3Uz6geMe0zdRRi1lidp-l8UVTNyqpgmbghjeBKfDaseUsdwAHAL80oodnedrrc_Jq7tVuBIWccz1BAYYt2BrExgSuN33DU1MVqs8pk5sNRJMeBWBBIFjsS2YLTUaLzcMdxL8ysWIbQkPp6EP2TrI/s16000/COMPARE1-RO_SecIDX100-ahiON.png)

### 2. lock_sysの性能スケール

上記クエリに `LOCK IN SHARE MODE` を追加し、競合しないロック処理で `lock_sys` に負荷をかける。

![lock_sysの性能スケール](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvbgSCOyuTvfo_31GswE43eEUO8ol_Popcc_4kCPEipEnLdZhyphenhyphenCxHnhtoHgeXKJlqf_mlQzuLDn8P-uTRDzFWgJhzDW0sEfJpwB6YApxTvzfbcCR0gRg2huPPv3Xi5IB49-PkdBWrZ9AE2e9GjyY4-tYKq8Y43YZXop0KCIBiyxKdRV3yDlCoLxGKHndC8/s16000/COMPARE1-RO_SecIDX100-S_LOCK.png)

### 3. log_sysの性能スケール

1クエリで多数のレコードを更新し、多数のmini-transactionを発生させて `log_sys` に負荷をかける。

![log_sysの性能スケール](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjr1SLoO-H3TJVbj0pQbhDANpnUMlP7a0w7KQKwOk1eH64dFuPs2kWqva_uukggovSEBYbPG0ygBayEQJo-stopkoz6zu3c1Ag12CiA5ByvhxV697On7AhnDoBKK0Evv0Nk-fjVWymQCy74UctKZgYfXQTKgv8xrVl3nvLViUstdGIN82nfNXumu7XeHXIi/s16000/COMPARE1-upd_noidx100-ramfs.png)

### 4. purge_threadsの性能スケール

`innodb_max_purge_lag_delay` を利用し、バックグラウンドのPurge処理性能を測定。

![purge_threadsの性能スケール](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLvSHgH2NcgkURvvYMtHykisVEctRuhAMyH-EAN_Z7Ar8wDQe_rtqJbjX6rCUr_pRaOIcYlABaD7f0h7N7-e2-MoJlObFfpCcS7iz-CMiMyUNkMmXN9_nR6a9QU6DfVF9R8Suj25RuZrUZ1eXo4mMb5sY-psFl1sVF7a6q7L9OdER3-CyKSHPIku1VgdRP/s16000/COMPARE1-upd_idx100-ramfs-purge_threads.png)

## 結論と今後の課題

- **結論**: `lock_sys`と`log_sys`の性能向上は、主キーランダム検索の改善によるもの。主キーランダム検索(1)と`purge_threads`の性能(4)の問題は他のMySQLでは未修正であり、**MySQL RP-8.0が現状、世界で最もCPU性能スケールが高い**と言える。
- **課題**: **低並列処理において**、RP008のノーマルビルドは、真の性能を持つMySQL 5.7にまだ及ばない。これが次の課題。
  - (PGOビルドはバイナリの再現性や維持管理の観点から避けたいと考えている)
- **展望**: この課題を解決できれば、PGOビルドよりも速くなる可能性がある。ここからが活動の本番であり、今後のIO性能改善なども視野に入れている。
