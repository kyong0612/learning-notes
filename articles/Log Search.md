---
title: "Log Search"
source: "https://developers.cloudflare.com/log-explorer/log-search/"
author:
  - "[[Cloudflare Docs]]"
published: 2025-12-05
created: 2025-12-10
description: "Log Explorer enables you to store and explore your Cloudflare logs directly within the Cloudflare dashboard or API, giving you visibility into your logs without the need to forward them to third-party services. Logs are stored on Cloudflare's global network using the R2 object storage platform and can be queried via the dashboard or SQL API."
tags:
  - "clippings"
  - "Cloudflare"
  - "Log Explorer"
  - "SQL"
  - "Logging"
  - "R2"
  - "Observability"
---

## 概要

**Log Explorer**は、Cloudflareのログをサードパーティサービスに転送することなく、Cloudflareダッシュボードまたは API 内で直接保存・検索できる機能です。ログはCloudflareのグローバルネットワーク上で**R2オブジェクトストレージ**を使用して保存され、ダッシュボードまたは**SQL API**経由でクエリできます。

## Log Explorerの使用方法

### 基本的な手順

1. Cloudflareダッシュボードで **Log Explorer** > **Log Search** に移動
2. 使用する**データセット**を選択し、**Columns**でフィールドを選択
3. ゾーンスコープのデータセットを選択した場合は、対象ゾーンを選択
4. **Limit**（返す結果の最大数）を入力（例：50）
5. クエリする**期間**を選択（例：過去12時間）
6. **Add filter**を選択してクエリを作成（Field、Operator、Valueを設定）
7. **Custom SQL**でクエリをカスタマイズ可能
8. **Run query**で実行、結果は**Query results**セクションに表示

### SQLクエリの例

#### Ray IDでHTTPリクエストを検索

```sql
SELECT
  clientRequestScheme,
  clientRequestHost,
  clientRequestMethod,
  edgeResponseStatus,
  clientRequestUserAgent
FROM http_requests
WHERE RayID = '806c30a3cec56817'
LIMIT 1
```

#### 特定の期間のCloudflare Accessリクエストを取得

```sql
SELECT
  CreatedAt,
  AppDomain,
  AppUUID,
  Action,
  Allowed,
  Country,
  RayID,
  Email,
  IPAddress,
  UserUID
FROM access_requests
WHERE Date >= '2025-02-06' AND Date <= '2025-02-06' 
  AND CreatedAt >= '2025-02-06T12:28:39Z' 
  AND CreatedAt <= '2025-02-06T12:58:39Z'
```

### ヘッダーとCookieのクエリ

リクエストヘッダー、レスポンスヘッダー、Cookieをクエリするには、まず[Custom fields](/logs/logpush/logpush-job/custom-fields/)を使用してこれらのフィールドのログを有効にする必要があります。APIまたはダッシュボードでカスタムフィールドを設定します（Logpushジョブ自体の変更は不要）。

```sql
SELECT clientip, clientrequesthost, clientrequestmethod, 
       edgeendtimestamp, edgestarttimestamp, rayid, 
       clientcountry, requestheaders
FROM http_requests
WHERE Date >= '2025-07-17'
  AND Date <= '2025-07-17'
  AND edgeendtimestamp >= '2025-07-17T07:54:19Z'
  AND edgeendtimestamp <= '2025-07-18T07:54:19Z'
  AND clientcountry = 'us'
  AND requestheaders."x-test-header" like '%654AM%';
```

### クエリの保存

- **Save query**を選択してクエリを保存（名前と説明を入力）
- **Queries**を選択すると、保存済みおよび最近のクエリがサイドパネルに表示
- 新しいクエリの挿入や既存クエリの削除が可能

## Security Analyticsとの統合

[Security Analytics](/waf/analytics/security-analytics/#logs)ダッシュボードから直接Log Explorerにアクセス可能。Security Analyticsで適用したフィルターは、Log Explorerのクエリに自動的に引き継がれます。

## クエリの最適化

### dateカラムの活用

すべてのテーブルには特別な`date`カラムがあり、スキャンするデータ量を絞り込むことでクエリ応答時間を短縮できます。

- 形式: `YYYY-MM-DD`
- 例: `WHERE date = '2023-10-12'`
- 対応演算子: `<`, `>`, `=`

```sql
SELECT
  clientip, clientrequesthost, clientrequestmethod,
  clientrequesturi, edgeendtimestamp, edgeresponsestatus,
  originresponsestatus, edgestarttimestamp, rayid,
  clientcountry, clientrequestpath, date
FROM http_requests
WHERE date = '2023-10-12' 
LIMIT 500
```

### 追加の最適化のヒント

| 最適化手法 | 説明 |
|-----------|------|
| **時間枠を狭める** | 処理するデータ量を減らし、応答時間を短縮 |
| **ORDER BY/LIMITを省略** | 大規模データセットではこれらの句がクエリを遅くする。広い時間枠から最新N件を取得するより、時間枠を狭める方が効果的 |
| **必要なカラムのみ選択** | `SELECT *`の代わりに特定のカラムを指定。まず`SELECT RayId`で対象を特定し、追加カラムは別クエリで取得する方法も有効。`SELECT COUNT(*)`でデータセット全体を取得せずに該当レコードの有無を確認可能 |

## 重要なポイント

- **サードパーティ不要**: ログをCloudflare内で直接保存・検索可能
- **R2ストレージ**: Cloudflareのグローバルネットワーク上のR2オブジェクトストレージを使用
- **SQL対応**: ダッシュボードとSQL API両方でクエリ可能
- **Security Analytics連携**: フィルターの自動引き継ぎによるシームレスな統合
- **カスタムフィールド**: ヘッダーやCookieのクエリには事前のログ設定が必要
