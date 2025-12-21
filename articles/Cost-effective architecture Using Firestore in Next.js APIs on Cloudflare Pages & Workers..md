---
title: "Cost-effective architecture: Using Firestore in Next.js APIs on Cloudflare Pages & Workers."
source: "https://dev.to/nabettu/cost-effective-architecture-using-firestore-in-nextjs-apis-on-cloudflare-pages-workers-5hh1"
author:
  - "nabettu (watanabe)"
published: 2025-03-18
created: 2025-12-21
description: |
  VercelでのNext.jsホスティングコスト上昇に対する解決策として、Cloudflare Pages & WorkersでFirebase認証とFirestoreを使用するアーキテクチャを解説。Edge環境でFirebase Admin SDKが使用できない制約を克服するためのライブラリ（next-firebase-auth-edge、firebase-rest-firestore）を紹介。
tags:
  - nextjs
  - cloudflare
  - firebase
  - firestore
  - edge-runtime
  - cost-optimization
---

## 背景と課題

VercelでのNext.jsアプリケーションのホスティングコストが上昇しており、代替ソリューションを求める開発者が増えている。

### 代替案とその課題

| 代替案 | 課題 |
|--------|------|
| 静的サイトSPAへの変換 | 個別OGP画像の設定やAPI管理が困難 |
| Firebase App Hosting / Cloud Run | アクセス増加に伴いコストが高騰 |
| Cloudflare Pages & Workers | Firebase Admin SDKがEdgeランタイムで動作しない |

**根本的な問題**: Firebase Admin SDKはNode.jsの内部ライブラリに依存しており、Cloudflare WorkersやVercel Edge Functionsなどのエッジランタイム環境では利用できない。

---

## 解決策1: Firebase Authentication - next-firebase-auth-edge

エッジ環境でFirebase Authenticationを使用するためのライブラリ。

**リポジトリ**: <https://github.com/awinogrodzki/next-firebase-auth-edge>

### 主な機能

- **最新Next.js機能との互換性**: App Router、Server Componentsをサポート
- **ゼロバンドルサイズ**: すべての処理をサーバーサイドで実行し、クライアントバンドルに追加のJavaScriptコードを含めない
- **最小構成**: カスタムAPIルートやnext.config.jsの変更不要、すべてミドルウェアで管理
- **セキュリティ**: joseライブラリによるJWT検証、ローテーションキーによるCookie署名で暗号攻撃を防止

---

## 解決策2: Firestore - firebase-rest-firestore

著者（nabettu）が開発したEdge環境向けFirestore REST APIクライアント。

**リポジトリ**: <https://github.com/nabettu/firebase-rest-firestore>

### 主な機能

- **Edgeランタイム互換性**: Firebase Admin SDKが使用できない環境で動作
- **包括的なCRUDサポート**: ドキュメントの作成、読み取り、更新、削除をサポート
- **TypeScriptサポート**: 型定義を提供
- **トークンキャッシング**: パフォーマンス向上のためのトークンキャッシュ実装
- **直感的なAPI**: Firebase Admin SDKのデザインを模した使いやすいインターフェース

### 使用例

```typescript
import { createFirestoreClient } from "firebase-rest-firestore";

// クライアント作成
const firestore = createFirestoreClient({
  projectId: "your-project-id",
  privateKey: "your-private-key",
  clientEmail: "your-client-email",
});

// 自動生成IDでドキュメント作成
const gameRef = firestore.collection("games").doc();
await gameRef.set({
  name: "The Legend of Zelda",
  genre: "Action-adventure",
  releaseYear: 1986,
});

// ドキュメント読み取り
const doc = await gameRef.get();
console.log(doc.data());

// ドキュメント更新
await gameRef.update({
  releaseYear: 1987,
});
```

---

## 注意点・制限事項

- **Firestoreのコスト**: 読み取り量が多い場合はFirestoreのコストも上昇する可能性がある
- **キャッシング戦略**: API経由でキャッシング戦略を実装することでコストを軽減可能
- **REST API経由アクセス**: APIを通じたFirestore利用にはREST APIアクセスが必要

---

## 結論

Edge環境でのFirebaseサービスの制限を克服することは、コスト効率とパフォーマンスの両立に不可欠。

**推奨アーキテクチャ**:

- **ホスティング**: Cloudflare Pages & Workers
- **認証**: next-firebase-auth-edge
- **データベース**: firebase-rest-firestore

これにより、大幅なホスティング費用をかけずにFirebaseの包括的なサービス（Authentication、Firestore）を活用できる。
