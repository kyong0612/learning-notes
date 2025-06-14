---
title: Cloud Run can't connect to MySQL after Google Cloud SQL Maintenance
source: https://www.googlecloudcommunity.com/gc/Databases/Cloud-Run-can-t-connect-to-MySQL-after-Google-Cloud-SQL/m-p/899944
author:
  - KalleDelorean
  - mcbsalceda
  - zlucas
published: 2025-04-22
created: 2025-06-14 16:47:46
description: |
  Cloud RunアプリケーションがGoogle Cloud SQL メンテナンス後にMySQLサーバーに接続できなくなる問題について。
  MySQL 8.4特有の問題で、メンテナンス後にユーザーが「デッド」状態になり、手動接続により「復活」させる必要がある。
tags:
  - Cloud Run
  - Cloud SQL
  - MySQL 8.4
  - Google Cloud Platform
  - Database Connectivity
---

# Cloud Run can't connect to MySQL after Google Cloud SQL Maintenance

## 問題の概要

Google Cloud SQL でメンテナンスが実行された後、Cloud Run アプリケーション（WordPress と Laravel）が MySQL サーバーに接続できなくなる問題が発生。

## 環境構成

- **アプリケーション**: 2つの別々のPHPアプリケーション（WordPress、Laravel）
- **ホスティング**: Cloud Run
- **データベース**: Cloud SQL MySQL
- **認証**: 標準的なMySQL認証（IAMユーザーではない）

## 発生した問題

### 症状

- Google Cloud SQL メンテナンス後にアプリケーションが接続不可能になる
- コード、環境変数に一切変更なし
- Laravel アプリのログで「access denied」エラーが発生
- Cloud SQL MySQL エラーログで以下のエラーが記録される：

```
INFO 2025-04-22T07:01:45.444819Z 2025-04-22T07:01:45.444524Z 686 [Note] [MY-010926] [Server] Access denied for user 'redacteduser'@'cloudsqlproxy~34.34.30.5' (using password: YES)
```

### 奇妙な回復方法

以下の方法で接続が「復活」する：

1. **GCPコンソールのCloud SQL Studio**で同じ認証情報を使用して接続
2. **ローカルマシンから**接続スクリプトを実行
3. **Cloud Runの新しいリビジョンをデプロイ** （コード/環境変数の変更なし）

重要な点：**他の場所から接続するだけで、Cloud Runアプリケーションが再び動作するようになる**

## 根本原因の解明

### MySQL 8.4特有の問題

この問題はMySQL 8.4でのみ発生することが判明：

#### 問題の動作パターン

1. **新しいMySQLユーザー作成時**: Cloud SQL Proxy経由で接続できない（「デッド」状態）
2. **ユーザーの復活**: Cloud SQL Studio等で接続すると「復活」し、Cloud Run等から接続可能になる
3. **FLUSH PRIVILEGES実行**: 全ユーザーが「デッド」状態になる
4. **GCPメンテナンス**: FLUSH PRIVILEGESと同等の効果

### 重要な警告

**MySQL 8.4を使用するGCPプロジェクトは「時限爆弾」状態**

- メンテナンス時に必ず問題が発生
- 手動介入なしではアプリケーションが復旧しない
- 現在の推奨事項：**MySQL 8.4の使用を避ける**

## 対策と提案

### 短期的な対策

1. **メンテナンス後の手動復旧**:
   - Cloud SQL Studioでデータベースに接続
   - または、ローカルマシンから接続スクリプトを実行

2. **MySQL 8.4の使用回避**:
   - 新規プロジェクトでは他のバージョンを選択
   - 既存プロジェクトの移行を検討

### 長期的な解決策

- Google Cloud側での根本的な修正が必要
- MySQL 8.4オプションの一時的な非表示を提案
- 企業レベルでのGoogle サポート契約による問題報告の検討

## コミュニティでの確認

複数のユーザーが同様の問題を報告：

- zlucasユーザーも同一の問題を経験
- 新しいパスワード作成後も、手動ログインが必要
- パスワード変更だけでは解決しない

## トラブルシューティングリソース

- [Cloud SQL troubleshooting guide](https://cloud.google.com/sql/docs/mysql/debugging-connectivity)
- [関連スレッド](https://www.googlecloudcommunity.com/gc/Databases/Cloud-SQL-DB-access-denied-unless-also-logged-in-to-Cloud-SQL/m-p/862515)

## 結論

この問題はGoogle Cloud MySQL 8.4の既知の問題であり、ユーザー側では根本的な解決ができない。現在のところ、MySQL 8.4の使用を避けることが最も確実な対策である。
