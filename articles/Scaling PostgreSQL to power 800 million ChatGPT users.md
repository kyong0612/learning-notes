---
title: "Scaling PostgreSQL to power 800 million ChatGPT users"
source: "https://openai.com/index/scaling-postgresql/"
author:
  - "[[Bohan Zhang]]"
published: 2026-01-22
created: 2026-01-25
description: "An inside look at how OpenAI scaled PostgreSQL to millions of queries per second using replicas, caching, rate limiting, and workload isolation."
tags:
  - "clippings"
  - "PostgreSQL"
  - "database-scaling"
  - "OpenAI"
  - "ChatGPT"
  - "infrastructure"
  - "high-availability"
  - "performance-optimization"
---

## 概要

OpenAIは、**8億人のChatGPTユーザー**を支えるためにPostgreSQLをどのようにスケーリングしたかを公開した。過去1年間でPostgreSQLの負荷は**10倍以上**増加したが、単一プライマリインスタンスと約50のリードレプリカという構成で、**数百万QPS（クエリ/秒）** を処理している。

### 主な成果
- **数百万QPS**のリード処理能力
- **p99レイテンシ**：2桁ミリ秒台
- **可用性**：99.999%（ファイブナイン）
- 過去12ヶ月で**SEV-0インシデントは1件のみ**（ChatGPT ImageGenのローンチ時）

---

## 初期設計の課題

ChatGPTのローンチ後、トラフィックは前例のない速度で成長。以下のパターンでSEV（重大インシデント）が発生：

1. **キャッシュ層の障害**によるキャッシュミスの急増
2. **高コストなマルチテーブルJOIN**によるCPU飽和
3. **新機能ローンチ**による書き込みストーム

![負荷時の悪循環](https://images.ctfassets.net/kftzwdyauwt9/5dECJjynPkxFF2XABuh3bt/3b5562e1f879fd0afd2deffe9cf1e142/OAI_The_Vicious_Cycle_Under_Load__Light_Desktop_.svg?w=3840&q=90)

### PostgreSQLのMVCCの課題

PostgreSQLのMVCC（マルチバージョン並行制御）実装により、書き込み負荷の高いワークロードでは効率が低下：

- **書き込み増幅**：1つのフィールド更新でも行全体がコピーされる
- **読み取り増幅**：最新のタプルを取得するために複数バージョンをスキャン
- **テーブル/インデックスの肥大化**
- **複雑なautovacuumチューニング**

参考：[The Part of PostgreSQL We Hate the Most](https://www.cs.cmu.edu/~pavlo/blog/2023/04/the-part-of-postgresql-we-hate-the-most.html)（PostgreSQL Wikipediaにも引用）

---

## スケーリングの最適化戦略

### 1. プライマリへの負荷削減

| 対策 | 詳細 |
|------|------|
| **読み取りのオフロード** | 可能な限りリードレプリカへ |
| **書き込みワークロードの移行** | シャード可能なワークロードをAzure CosmosDBへ |
| **アプリケーション最適化** | 冗長な書き込みの修正、遅延書き込みの導入 |
| **バックフィルのレート制限** | 書き込み圧力を防止 |

### 2. クエリ最適化

- **12テーブルJOIN**など高コストクエリがSEVの原因に
- **ORM生成SQLの精査**が重要
- 複雑なJOINロジックはアプリケーション層へ移動
- `idle_in_transaction_session_timeout`の設定でアイドルクエリを防止

### 3. 単一障害点の軽減

- **HAモード**：ホットスタンバイを常時同期
- 重要なリクエストの読み取りをレプリカへオフロード
- プライマリ障害時も読み取りは継続可能（SEV-0回避）
- 各リージョンに複数レプリカを配置

### 4. ワークロード分離

「ノイジーネイバー」問題への対策：

- リクエストを**低優先度/高優先度**に分割
- 専用インスタンスへルーティング
- 製品・サービス間でも同様の戦略を適用

### 5. コネクションプーリング

![PgBouncerアーキテクチャ](https://images.ctfassets.net/kftzwdyauwt9/kttDE3EiZ6roTjpbUpqxX/dd9ceee15663caa6e37a83bedc8626f5/OAI_PgBouncer_as_PostgreSQL_Proxy__Light_Desktop_.svg?w=3840&q=90)

- **PgBouncer**をプロキシ層として導入
- statement/transactionプーリングモードで接続を効率的に再利用
- 接続時間：**50ms → 5ms**に短縮
- プロキシ、クライアント、レプリカを同一リージョンに配置

### 6. キャッシング戦略

キャッシュミスストームへの対策：

- **キャッシュロック/リース機構**の実装
- 同一キーへの複数リクエストで1つだけがDBにアクセス
- 他のリクエストはキャッシュ更新を待機
- 冗長なDBアクセスを大幅に削減

### 7. リードレプリカのスケーリング

![カスケードレプリケーション](https://images.ctfassets.net/kftzwdyauwt9/T9UJV7cX2uI7qSOQwuv0h/daf02e23cb5d013d9afce95691ec7ec8/PostgreSQL_Cascading_Replication__Light_Desktop_.svg?w=3840&q=90)

- 現在：約50のリードレプリカを複数リージョンに配置
- 課題：プライマリがすべてのレプリカにWALをストリーミング
- 解決策：**カスケードレプリケーション**（Azure PostgreSQLチームと共同でテスト中）
  - 中間レプリカがWALを下流にリレー
  - 100以上のレプリカへスケール可能

### 8. レート制限

複数層でのレート制限を実装：
- アプリケーション層
- コネクションプーラー
- プロキシ
- クエリ層

ORM層で特定のクエリダイジェストをブロックする機能も追加。

### 9. スキーマ管理

| ルール | 詳細 |
|--------|------|
| **許可される変更** | 軽量な変更（テーブルリライトを伴わない列追加/削除） |
| **タイムアウト** | スキーマ変更は5秒以内 |
| **インデックス** | CONCURRENTLY での作成/削除のみ |
| **新テーブル禁止** | 新機能はCosmosDBなど代替システムへ |
| **バックフィル** | 厳格なレート制限（1週間以上かかることも） |

---

## 結果と今後の展望

### 達成した成果

| 指標 | 値 |
|------|---|
| **QPS** | 数百万 |
| **リードレプリカ数** | 約50（複数リージョン） |
| **レプリケーションラグ** | ほぼゼロ |
| **p99レイテンシ** | 2桁ミリ秒台 |
| **可用性** | 99.999% |
| **過去12ヶ月のSEV-0** | 1件（ImageGenローンチ時、1週間で1億人以上の新規ユーザー） |

### 今後の取り組み

1. **残りの書き込み負荷ワークロードの移行**継続
2. **カスケードレプリケーション**の本番導入
3. **シャードPostgreSQL**または分散システムの検討

---

## 謝辞

記事著者：Bohan Zhang（Technical Staff）

貢献者：Jon Lee, Sicheng Liu, Chaomin Yu, Chenglong Hao、およびPostgreSQLスケーリングチーム全体。Azure PostgreSQLチームとのパートナーシップにも感謝。
