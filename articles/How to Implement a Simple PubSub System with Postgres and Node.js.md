---
title: "How to Implement a Simple Pub/Sub System with Postgres and Node.js"
source: "https://medium.com/@dgebreselasse/how-to-implement-a-simple-pub-sub-system-with-postgres-and-node-js-dfce07ac1d9b"
author:
  - "Dag Gebreselasse"
published: 2024-09-06
created: 2025-08-31
description: |
  A step-by-step guide on setting up a simple publish/subscribe message system using PostgreSQL's LISTEN/NOTIFY feature and Node.js clients. This approach serves as a lightweight alternative to complex messaging brokers like Kafka or RabbitMQ for simpler use cases.
tags:
  - "Postgres"
  - "Node.js"
  - "PubSub"
  - "Message Queue"
  - "Database"
---

この記事では、PostgreSQLの `LISTEN`/`NOTIFY` 機能とNode.jsを利用して、シンプルなPublish/Subscribe（Pub/Sub）メッセージングシステムを実装する方法を解説します。このアプローチは、Apache KafkaやRabbitMQのような複雑なメッセージングシステムを導入するまでもない、より単純なユースケースにおいて軽量な代替手段となります。

### コアコンセプト: Postgres LISTEN/NOTIFY

このシステムの中心となるのは、PostgreSQLに組み込まれている `LISTEN` と `NOTIFY` コマンドです。クライアントは `LISTEN` を使って特定のチャンネルを購読し、そのチャンネルに対して `NOTIFY` コマンドが（オプショナルなペイロードと共に）発行されると、データベースはリッスンしている全てのクライアントに通知を送信します。

実装のフローは以下の通りです。

1. メッセージの送信者が、データベースの特定のテーブルにメッセージを書き込みます。
2. このテーブルへの `INSERT` をトリガーとして、事前に定義された関数が実行されます。
3. 関数は `pg_notify` を使用し、新しいメッセージデータをペイロードとしての特定のチャンネルに送信します。
4. そのチャンネルをリッスンしている購読者クライアントがメッセージを受信します。

*(注: 元記事には「A Simple Pub/Sub System Flow Diagram」という図がありましたが、ここでは省略しています。)*

### データベースのセットアップ

#### 1. スキーマとテーブルの作成

まず、メッセージを保存するための専用のスキーマとテーブルを作成します。

```sql
CREATE SCHEMA queue; -- 'queue' という名前のスキーマを作成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- UUIDを生成するための拡張機能
CREATE TABLE queue.message (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel text,
  data json,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 2. 通知関数とトリガーの作成

`queue.message` テーブルに新しいメッセージが挿入されるたびに通知を送信するためのトリガー関数を作成します。

**関数:**
この関数は、新しく挿入された行を受け取り、それをJSONに変換して `pg_notify` のペイロードとして送信します。チャンネル名は新しい行の `channel` カラムから取得されます。

```sql
CREATE OR REPLACE FUNCTION queue.new_message_notify() RETURNS TRIGGER AS $$
DECLARE
BEGIN
    PERFORM pg_notify(cast(NEW.channel as text), row_to_json(new)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**トリガー:**
このトリガーは、各行が挿入される *前* に `new_message_notify` 関数を実行するように設定されます。

```sql
CREATE TRIGGER new_insert_trigger BEFORE INSERT ON queue.message
    FOR EACH ROW EXECUTE PROCEDURE queue.new_message_notify();
```

### メッセージの送受信

#### メッセージの送信 (Publish)

メッセージを公開するには、`queue.message` テーブルに行を `INSERT` するだけです。トリガーが自動的に通知を処理します。

```sql
INSERT INTO queue.message (channel, data) VALUES ('sports', '{"game": "NFL" }');
```

これにより、`sports` チャンネルにJSONペイロードが送信されます。

*(注: 元記事には挿入された行を示す図がありましたが、ここでは省略しています。)*

#### Node.jsでのメッセージ受信 (Subscribe)

Node.jsクライアントは、`pg` のようなPostgreSQLクライアントライブラリを使用してチャンネルを購読できます。

1. **チャンネルの購読**: クライアントは `LISTEN` コマンドを発行します。

    ```javascript
    client.query(`LISTEN ${'sports'}`, (err, res) => {
        if (err) throw Error(`subscription error: ${err}`);
        console.log(`subscription success: ${res}`)
    });
    ```

2. **通知のハンドリング**: クライアントでイベントリスナーを設定し、受信した通知を処理します。ペイロードには、新しく挿入された行のJSONデータが含まれています。

    ```javascript
    const notifyPromise = new Promise((resolve) => {
        client.on('notification', msg => {
            const newRow = JSON.parse(msg.payload);
            return resolve(newRow);
        });
    });
    ```

### 制限事項

このシンプルなシステムの大きな欠点は、配信保証や受信確認の仕組みがないことです。メッセージ送信時に購読クライアントがオフラインの場合、その通知を恒久的に見逃してしまいます。

考えられる回避策としては、クライアントが定期的に `queue.message` テーブルをポーリングし、最後既知のメッセージタイムスタンプ以降に作成されたメッセージがないか確認することで、見逃したメッセージを取得する方法があります。
