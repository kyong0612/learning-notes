# MongoDB キャッチアップガイド（Firestore経験者向け）

MongoDBの最新情報を確認してから、Firestoreとの対比で解説しますね。Firestoreの経験をベースに、MongoDBを解説しますね。

---

## MongoDB キャッチアップガイド（Firestore経験者向け）

### 基本的な世界観の違い

**Firestoreを「Google管理のマンション」とすると、MongoDBは「自由に建てられる一戸建て（または管理付きマンションも選べる）」** です。

| 観点 | Firestore | MongoDB |
|------|-----------|---------|
| 運営形態 | フルマネージドのみ | セルフホスト / Atlas（マネージド）選択可 |
| データ取得 | SDK/APIメソッド呼び出し | クエリ言語（MQL） |
| リアルタイム | ネイティブ対応（onSnapshot） | Change Streams で実現 |
| スケーリング | 自動 | シャーディング（手動設計） |

---

### データモデルの対応表

両方ともドキュメント指向ですが、構造に微妙な違いがあります。

```
Firestore                          MongoDB
─────────────────────────────────────────────────────
Collection                    →    Collection
  └─ Document                 →    Document
      └─ Subcollection        →    埋め込みドキュメント or 別Collection参照
```

**重要な違い：サブコレクション**

Firestoreでは `users/{userId}/posts/{postId}` のように階層的にサブコレクションを作りますが、MongoDBにはサブコレクションという概念がありません。代わりに：

```javascript
// Firestore的な発想
users/abc123/posts/post1

// MongoDBでの2つのアプローチ

// 1. 埋め込み（Embedding）- 小規模データ向け
{
  _id: "abc123",
  name: "kimkiyong",
  posts: [
    { _id: "post1", title: "Hello" },
    { _id: "post2", title: "World" }
  ]
}

// 2. 参照（Reference）- 大規模データ向け
// users collection
{ _id: "abc123", name: "kimkiyong" }

// posts collection
{ _id: "post1", userId: "abc123", title: "Hello" }
```

---

### クエリの対比

**Firestoreの「メソッドチェーン」に対し、MongoDBは「JSON風のクエリ言語」** を使います。

```javascript
// Firestore
const snapshot = await db.collection('users')
  .where('age', '>=', 20)
  .where('city', '==', 'Sapporo')
  .orderBy('age')
  .limit(10)
  .get();

// MongoDB
const users = await db.collection('users')
  .find({ 
    age: { $gte: 20 }, 
    city: 'Sapporo' 
  })
  .sort({ age: 1 })
  .limit(10)
  .toArray();
```

**主要な演算子マッピング**

| Firestore | MongoDB | 意味 |
|-----------|---------|------|
| `==` | `{ field: value }` または `$eq` | 等しい |
| `!=` | `$ne` | 等しくない |
| `<`, `<=`, `>`, `>=` | `$lt`, `$lte`, `$gt`, `$gte` | 比較 |
| `in` | `$in` | 配列内に含まれる |
| `array-contains` | `$elemMatch` または直接指定 | 配列に含む |

---

### リアルタイム更新

Firestoreでは `onSnapshot` が組み込みですが、MongoDBでは **Change Streams** を使います。

```javascript
// Firestore
db.collection('messages').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    console.log(change.type, change.doc.data());
  });
});

// MongoDB（Change Streams）
const changeStream = db.collection('messages').watch();
changeStream.on('change', change => {
  console.log(change.operationType, change.fullDocument);
});
```

Change Streamsはレプリカセット環境が必要です（Atlas使用時は自動的に有効）。

---

### トランザクション

**Firestoreは「runTransaction一択」でしたが、MongoDBは複数パターンがあります。**

```javascript
// Firestore
await db.runTransaction(async (transaction) => {
  const doc = await transaction.get(userRef);
  transaction.update(userRef, { balance: doc.data().balance - 100 });
});

// MongoDB
const session = client.startSession();
try {
  session.startTransaction();
  
  await users.updateOne(
    { _id: userId },
    { $inc: { balance: -100 } },
    { session }
  );
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

MongoDB 8.0では複数ドキュメント・複数コレクションにまたがるACIDトランザクションが安定しています。

---

### セキュリティモデルの違い

**Firestoreは「ルールファイル」、MongoDBは「ロールベースアクセス制御（RBAC）」**

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}

// MongoDBはアプリケーション層またはAtlasのRBACで制御
// クライアントから直接DBアクセスは基本的にしない設計
```

Firestoreはクライアント直接アクセス前提、MongoDBはバックエンドサーバー経由が一般的です。

---

### MongoDB 8.0 の注目機能（2024年10月GA）

最新バージョンで大幅な性能向上があります：

- **読み取り36%高速化**、更新スループット59%向上
- **バルクインサート54%高速化**
- **時系列データの集計が200%以上高速化**
- **Queryable Encryption で範囲クエリ対応**（暗号化したまま `BETWEEN` 的な検索が可能）
- **水平スケーリングがより低コストで高速に**

---

### MongoDB Atlas（マネージドサービス）

Firestoreのようなフルマネージド体験を求めるなら **MongoDB Atlas** が最適です。

| 機能 | Firestore | MongoDB Atlas |
|------|-----------|---------------|
| 自動スケーリング | ○ | ○（5倍高速化 - 2024年改善） |
| バックアップ | Export設定が必要 | 自動日次バックアップ |
| 全文検索 | 別途Algoliaなど | Atlas Search（組み込み） |
| ベクトル検索 | Firebase Extensions | Atlas Vector Search |
| マルチリージョン | ○ | ○ |

---

### 2025年の新機能

- **Community EditionにもFull-text/Vector Search対応**（プレビュー、2025年9月発表）
- **Voyage AI買収**によるRAG（検索拡張生成）の強化
- **MongoDB AMP** - AIを活用したレガシーアプリ移行プラットフォーム

---

### 使い分けの目安

| シナリオ | おすすめ |
|---------|---------|
| モバイルアプリでリアルタイム同期が核心 | Firestore |
| 複雑な集計・分析クエリが多い | MongoDB |
| オフラインファースト | Firestore（組み込み対応） |
| 大量データのバルク処理 | MongoDB |
| Google Cloud中心のインフラ | Firestore |
| マルチクラウド / セルフホスト | MongoDB |

---

何か特定の部分をより深掘りしたい箇所はありますか？例えばAggregation Pipeline（Firestoreにはない強力な集計機能）や、実際の移行パターンなども解説できます。