// 2024-01-01 00:00:01 - クエリパフォーマンス向上のためのインデックス作成
// このマイグレーションは頻繁にクエリされるプロパティのインデックスを作成します

// ユーザーインデックス
CREATE INDEX user_created_at IF NOT EXISTS
FOR (u:User) ON (u.createdAt);

CREATE INDEX user_status IF NOT EXISTS
FOR (u:User) ON (u.status);

CREATE INDEX user_full_name IF NOT EXISTS
FOR (u:User) ON (u.firstName, u.lastName);

// 商品インデックス
CREATE INDEX product_name IF NOT EXISTS
FOR (p:Product) ON (p.name);

CREATE INDEX product_price IF NOT EXISTS
FOR (p:Product) ON (p.price);

CREATE INDEX product_status IF NOT EXISTS
FOR (p:Product) ON (p.status);

CREATE INDEX product_created_at IF NOT EXISTS
FOR (p:Product) ON (p.createdAt);

// 注文インデックス
CREATE INDEX order_status IF NOT EXISTS
FOR (o:Order) ON (o.status);

CREATE INDEX order_created_at IF NOT EXISTS
FOR (o:Order) ON (o.createdAt);

CREATE INDEX order_total IF NOT EXISTS
FOR (o:Order) ON (o.totalAmount);

// カテゴリインデックス
CREATE INDEX category_name IF NOT EXISTS
FOR (c:Category) ON (c.name);

CREATE INDEX category_parent IF NOT EXISTS
FOR (c:Category) ON (c.parentId);

// 全文検索インデックス
CREATE FULLTEXT INDEX product_search IF NOT EXISTS
FOR (p:Product) ON EACH [p.name, p.description];

CREATE FULLTEXT INDEX user_search IF NOT EXISTS
FOR (u:User) ON EACH [u.firstName, u.lastName, u.email];