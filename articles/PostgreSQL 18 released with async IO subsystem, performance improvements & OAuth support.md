---
title: "PostgreSQL 18 released with async I/O subsystem, performance improvements & OAuth support"
source: "https://alternativeto.net/news/2025/9/postgresql-18-released-with-async-i-o-subsystem-performance-improvements-and-oauth-support/"
author:
  - "Paul"
published: 2025-09-26
created: 2025-09-27
description: |
  AlternativeToによるリリース告知。PostgreSQL 18が非同期I/Oサブシステムやアップグレード改善、スキップスキャン対応インデックス、OAuth 2.0認証など幅広い新機能と性能向上を導入したことを要約する。
tags:
  - "clippings"
  - "postgresql"
  - "database"
  - "async-io"
  - "oauth"
  - "release-notes"
---

![PostgreSQL 18リリース告知ビジュアル](https://d4.alternativeto.net/MyfJPAt_YwidOmGXpriRwXkrHA1zYK4pFJk_3Po6de0/rs:fill:760:380:0/g:ce:0:0/YWJzOi8vZGlzdC9jb250ZW50LzE3NTg4MjU4MDU2MzIucG5n.png)

## 概要

PostgreSQL 18は、非同期I/Oサブシステムと多数の機能改善を備えたオープンソースRDBMSの最新メジャーリリース。新機能は性能向上、アップグレード手続きの効率化、インデックス最適化、開発者向け機能、セキュリティ強化まで幅広くカバーしている。

## コアエンジンと性能改善

- 非同期I/Oサブシステムを新搭載し、シーケンシャルスキャン、ビットマップヒープスキャン、VACUUM処理などで最大3倍の性能向上をベンチマークで確認。
- プロアクティブなVACUUM戦略の導入と、新規データベースでのページチェックサムの標準有効化により、整合性維持と運用性を強化。

## アップグレードと運用性

- メジャーアップグレード後もプランナースタティスティクスを保持でき、`pg_upgrade`の高速化や大規模テーブル・シーケンスを抱える環境でのダウンタイム短縮を実現。
- ロジカルレプリケーションの競合ログ出力が改善され、トラブルシューティングが容易に。

## インデックスとクエリ最適化

- 複合B-treeインデックスに「スキップスキャン」を追加し、先頭列の等価条件が無い場合や`OR`条件を含むクエリでもインデックス利用を可能にすることで、問い合わせ性能の底上げを図る。

## データ管理と開発者向け機能

- 仮想生成列をデフォルト化し、問い合わせ時に値を計算。ストアド生成列についてもロジカルレプリケーションが可能に。
- `INSERT`/`UPDATE`/`DELETE`/`MERGE`の`RETURNING`句で、旧値と新値の両方へアクセスできるようになり、監査やアプリケーションロジックの柔軟性が向上。
- `uuidv7()`によるタイムスタンプ順のUUID生成、テキスト処理の高速化も追加。

## セキュリティと認証

- OAuth 2.0対応の組み込み認証を提供し、外部IDプロバイダーとの連携を容易にする。

## その他の強化点

- 記事ではその他の改善にも触れているが詳細は総括のみ。制限事項や既知の問題についての記載はない。

## 関連リソースと周辺動向

- 公式発表: [PostgreSQL 18 Released!](https://www.postgresql.org/about/news/postgresql-18-released-3142/)
- リリースノート: [PostgreSQL Documentation: Release 18](https://www.postgresql.org/docs/18/release-18.html)
- 他媒体のカバレッジ: Phoronix、InfoWorld、SD Timesが同リリースを紹介。
- 関連ニュースとして、DocumentDBのLinux Foundation移管やFerretDB Cloudローンチ、PostgreSQL 17の過去リリース記事へのリンクが掲載。
