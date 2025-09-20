// 2024-01-01 00:00:02 - リレーションシップの制約とインデックス定義
// このマイグレーションはリレーションシップの制約とインデックスを作成します

// リレーションシッププロパティのインデックス作成
CALL db.index.fulltext.createRelationshipIndex(
  "relationship_created_at",
  ["PURCHASED", "REVIEWED", "VIEWED", "LIKED"],
  ["createdAt"],
  {analyzer: "standard-no-stop-words"}
) YIELD name
WHERE name IS NOT NULL
RETURN name;

// 注意: Neo4j Community Editionではリレーションシップに対する制約を直接サポートしていません
// ただし、期待されるリレーションシップパターンをここにドキュメント化できます:

// 期待されるリレーションシップ:
// (:User)-[:PURCHASED]->(:Product)
// (:User)-[:REVIEWED {rating: int, comment: string}]->(:Product)
// (:User)-[:VIEWED {timestamp: datetime}]->(:Product)
// (:User)-[:LIKED]->(:Product)
// (:Product)-[:BELONGS_TO]->(:Category)
// (:Order)-[:CONTAINS {quantity: int, price: float}]->(:Product)
// (:User)-[:PLACED]->(:Order)
// (:Category)-[:PARENT_OF]->(:Category)

// 一般的なクエリパターン用の複合インデックス作成
CREATE INDEX user_product_interaction IF NOT EXISTS
FOR (u:User) ON (u.id);

CREATE INDEX product_category_mapping IF NOT EXISTS
FOR (p:Product) ON (p.categoryId);

CREATE INDEX order_user_mapping IF NOT EXISTS
FOR (o:Order) ON (o.userId);