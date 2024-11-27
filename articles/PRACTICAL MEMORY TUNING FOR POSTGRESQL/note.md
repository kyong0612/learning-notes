# PRACTICAL MEMORY TUNING FOR POSTGRESQL

ref: <https://www.postgresql.eu/events/pgconfeu2024/sessions/session/5935/slides/550/Practical%20Memory%20Tuning%20for%20PostgreSQL%20EU%202024%20SPLIT.pdf>
movie: <https://www.youtube.com/watch?v=l24YKjicXhs>

## OOM KillerとSwap

![alt text](<assets/CleanShot 2024-11-27 at 17.24.27@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.24.35@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.24.43@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.24.50@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.24.56@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.25.04@2x.png>)
![alt text](<assets/CleanShot 2024-11-27 at 17.25.12@2x.png>)

```md
PostgreSQLサーバーの運用において、OOM Killer（Out Of Memory Killer）は重要な考慮事項です。

## OOM Killerの基本
OOM Killerは、システムのメモリが枯渇した際にカーネルを保護するためのLinuxカーネルの機能です。メモリ不足が発生すると、以下のようなメッセージが表示されてプロセスが強制終了されます[1]：

`Out of Memory: Killed process 12345 (postgres)`

## 対策方法

**カーネルパラメータの調整**
* `vm.overcommit_memory`の設定[3]：
  * 0: デフォルト設定。ヒューリスティックなメモリオーバーコミット処理を実行
  * 1: 常にオーバーコミット可能
  * 2: オーバーコミット無効（推奨設定）

**プロセス保護の設定**
PostgreSQLプロセスをOOM Killerから保護するには[5]：
1. postmasterプロセスの`oom_score_adj`を-1000に設定
2. 起動スクリプトで以下を実行：
```bash
echo -1000 > /proc/self/oom_score_adj
```md

## Swapの重要性

* Swapはメモリ不足時の緩衝材として機能します[2]
* 特にcgroups環境では、Swapが無効化されているとOOM Killerが予期せず発動する可能性があります[2]
* PostgreSQLのパフォーマンスを最適化するには、適切なSwapサイズの設定が重要です

## メモリ関連パラメータの最適化

PostgreSQLのメモリ関連パラメータも適切に設定する必要があります[5]：

* `shared_buffers`
* `work_mem`
* `maintenance_work_mem`
* `max_connections`

これらのパラメータを環境に応じて適切に調整することで、OOM Killerの発動リスクを低減できます。

Sources
[1] How to Adjust Linux Out-Of-Memory Killer Settings for PostgreSQL <https://www.percona.com/blog/out-of-memory-killer-or-savior/>
[2] Deep PostgreSQL Thoughts: The Linux Assassin | Crunchy Data Blog <https://www.crunchydata.com/blog/deep-postgresql-thoughts-the-linux-assassin>
[3] PostgreSQLサーバーにはOOM Killer対策が必要 - grep Tips * <https://www.greptips.com/posts/277/>
[4] Solving and Avoiding Memory Killer Issues in PostgreSQL <https://postgresqlblog.hashnode.dev/solving-and-avoiding-memory-killer-issues-in-postgresql-a-complete-guide>
[5] Documentation: 17: 18.4. Managing Kernel Resources - PostgreSQL <https://www.postgresql.org/docs/current/kernel-resources.html>
[6] PostgreSQL out of memory: Linux OOM killer - Stack Overflow <https://stackoverflow.com/questions/49183728/postgresql-out-of-memory-linux-oom-killer>

```

## Huge Page

```md

## HugePagesの概要

HugePagesは、PostgreSQLのメモリ管理を最適化するための重要な機能です。通常のLinuxシステムでは4KBのページサイズでメモリを管理しますが、HugePagesは2MBの大きなページサイズを使用します[1][6]。

## 主なメリット

**パフォーマンスの向上**

* TLB（Translation Lookaside Buffer）のヒット率が向上し、CPU負荷が軽減されます[1]
* ページテーブルのサイズが削減され、メモリ使用量が大幅に減少します[1]
* スワップアウトされないため、安定したパフォーマンスを維持できます[1]

**メモリ管理の効率化**

* 大きな連続したメモリチャンクを効率的に管理できます[5]
* shared_buffersの値が大きい場合に特に効果を発揮します[5]

## 設定方法

**1. 必要なHugePages数の見積もり**

```bash
head -1 $PGDATA/postmaster.pid
grep ^VmPeak /proc/<pid>/status
grep ^Hugepagesize /proc/meminfo
```

必要なページ数 = VmPeak値 ÷ Hugepagesize[7]

**2. OSの設定**

```bash
sysctl -w vm.nr_hugepages=<必要なページ数>
```

永続化する場合は/etc/sysctl.confに追加[7]

**3. PostgreSQLの設定**
postgresql.confで以下の3つのモードから選択[3]:

* `try`：HugePagesを試行し、失敗時はデフォルトに戻る
* `on`：HugePagesを強制的に使用
* `off`：HugePagesを使用しない

## 注意点

* Windowsではlarge pageとして実装されており、「メモリ中のロックページ」権限が必要です[3]
* メモリが断片化している場合、HugePagesの確保に失敗する可能性があります[4]
* Aurora PostgreSQLでは、t3.medium、db.t3.large、db.t4g.medium、db.t4g.large以外のインスタンスクラスでデフォルトで有効になっています[2]

Sources
[1] HugePages の効果 - Zenn <https://zenn.dev/furururu02/articles/2b330b62f5aa82>
[2] Amazon Aurora PostgreSQL のパフォーマンスとスケーリング <https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Managing.html>
[3] PostgreSQL ドキュメンテーション: huge_pages パラメータ <https://postgresqlco.nf/doc/ja/param/huge_pages/>
[4] HugePagesの利用 - linux - RCPS <https://www.rcps.jp/doku.php?id=linux%3Ahugepages>
[5] 18.4. カーネルリソースの管理 <https://www.postgresql.jp/docs/13/kernel-resources.html>
[6] Steps to enable HugePages in PostgreSQL - DBsGuru <https://dbsguru.com/steps-to-enable-hugepages-in-postgresql/>
[7] PostgreSQLのHugePagesの設定 <https://zatoima.github.io/postgresql-hugepages-setting.html>

```md


--- 
このPDFはPostgreSQLのメモリチューニングに関する実践的なガイドで、以下の主要なポイントについて解説しています。

## メモリの概要
PostgreSQLのメモリは主に以下の要素で構成されています:
- オペレーティングシステム用メモリ
- shared_buffersメモリ
- PostgreSQLプロセス用メモリ
- ページキャッシュ[1]

## 重要なメモリパラメータ

**shared_buffers**
- データベースの共有メモリバッファ
- ホストメモリの25%程度が推奨される
- 大きすぎると逆効果になる可能性がある[1]

**work_mem**
- クエリ実行時のソートやハッシュ操作に使用
- クエリの複雑さに応じて適切なサイズを設定する必要がある
- 大きすぎるとメモリ不足の原因となる[1]

**maintenance_work_mem**
- VACUUM、CREATE INDEX等のメンテナンス操作に使用
- PostgreSQL 17以降では最適化され、より少ないメモリ消費で効率的な処理が可能[1]

## HugePagesの活用
- ページテーブルのサイズを削減
- パフォーマンスを向上させる
- 特に大規模なshared_buffersを使用する場合に効果的[1]

## メモリ管理の注意点
- OOM(Out of Memory)キラーによるプロセス終了を防ぐ
- スワップの適切な設定
- ワーキングセットサイズの把握と最適化[1]

このガイドは、PostgreSQLのパフォーマンスを最適化するための実践的なメモリチューニング手法を詳細に説明しています。

Sources
[1] Practical-Memory-Tuning-for-PostgreSQL-EU-2024-SPLIT.pdf https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/3052086/da6bdc19-9733-49b7-9160-f2883b0e3c93/Practical-Memory-Tuning-for-PostgreSQL-EU-2024-SPLIT.pdf


--- この書き起こしに基づき、「Grant McAlisterによるPostgreSQLの実践的メモリチューニング」について以下の要点を日本語で解説します。

---
---

### **1. 発表の概要**
Grant McAlister（Amazonのシニアプリンシパルエンジニア）は、PostgreSQLのメモリ使用について、特に性能を向上させるための実践的な調整方法を紹介しました。この講演は、PostgreSQLの内部動作に深く踏み込むというより、一般的なセットアップでのメモリ管理の重要性と具体的な改善策を示すことを目的としています。

---

### **2. メモリ管理が重要な理由**
- 適切に調整されていない場合、メモリ不足やスワッピングが発生し、データベースの性能が大幅に低下します。
- 例として、チューニングされていない場合にスループットが最大11倍低下するケースが示されました。

---

### **3. スワップ（Swap）について**
- **スワップの利点:** メモリが不足した際に、スワップ領域を使用することでプロセスが即座に終了するのを防ぎ、システムに余裕を与える。
- **スワップの問題点:** 頻繁にスワップイン・スワップアウトを繰り返す「スラッシング」が発生すると、性能が大幅に低下。
- 適切なスワップサイズの目安としては、物理メモリの2～4GB程度が推奨される。

---

### **4. メモリ使用の構造**
- PostgreSQLのメモリは以下のように使われる:
  - **OS:** 一部のRAMを使用。
  - **共有バッファ（Shared Buffers）:** データベースキャッシュとして使用。デフォルトではRAMの25%が設定されることが多い。
  - **ページキャッシュ（Page Cache）:** ディスクI/Oを高速化するため、OSがファイルキャッシュとして使用。
  - **プロセスごとのメモリ:** 各プロセスが独自のメモリを消費。

---

### **5. チューニングの具体例**
#### **共有バッファの設定**
- 小さすぎるとI/O負荷が増加し、大きすぎるとページテーブルエントリの管理が複雑化。
- 適切なバランスを見つけることが重要。

#### **ワークメモリ（Work Memory）の設定**
- クエリが大量のメモリを必要とする場合、ワークメモリを調整することでディスクI/Oを減らせる。
- ただし、過度に高く設定するとメモリ不足に陥る可能性がある。

#### **メンテナンス作業用メモリ（Maintenance Work Memory）**
- VACUUMやインデックス再構築に使用される。
- 設定が低いと処理に複数のパスが必要となり、時間がかかる。
- 設定が高すぎると、他のプロセスへの影響が懸念される。

---

### **6. パフォーマンスの最適化**
- **PG Buffer Cacheの活用:** データキャッシュの状態を確認し、最適化ポイントを特定。
- **巨大ページ（Huge Pages）の利用:** メモリ管理を効率化し、大規模システムの性能を向上。

---

### **7. 注意点**
- メモリ不足が発生すると、OOM（Out of Memory）キラーにより重要なプロセスが停止するリスクがある。
- 設定を変更する際は、全体のシステムリソースに対する影響を考慮する必要がある。

---

### **まとめ**
Grant McAlisterの講演では、PostgreSQLのメモリチューニングにおける現実的なアプローチを提供し、安定性とパフォーマンスを向上させるための具体的な方法が示されました。特に、共有バッファ、スワップ、ワークメモリの設定を適切に調整することが重要であると強調されました。
