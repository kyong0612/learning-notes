---
title: Prismaの型処理を100倍ほど改善できるかもしれない知識
source: https://zenn.dev/toyb0x/articles/b43251f6ce65fb
author:
  - toyb0x
published: 2025-06-29
created: 2025-07-01
description: |
  多くの開発者が見落としがちなPrismaの特定の使い方が、TypeScriptコンパイラやIDEなどの開発環境に重大なパフォーマンス問題を引き起こす可能性について解説し、その具体的な解決策と実プロジェクトでの適用例を紹介する記事。
tags:
  - TypeScript
  - performance
  - Prisma
  - DevOps
  - tsc
---

本記事は、Prismaの型定義の扱い方によってTypeScriptのコンパイルパフォーマンスが著しく悪化する問題を取り上げ、その原因と解決策を具体的な検証データと共に解説します。特に、Prisma Clientを拡張する際の型指定方法が、大規模プロジェクトにおいてIDEの応答性やビルド時間に深刻な影響を与えることを明らかにします。

### 問題の核心：PrismaClientの不適切な型利用

自作のOSS `TS-Bench` を用いたパフォーマンス測定中、Prisma関連のコードが原因でIDEが著しく重くなる現象を発見。`tsc --noEmit --diagnostics` でデバッグした結果、Prisma Clientの拡張方法に問題があることが判明しました。

### パフォーマンス検証

問題を明確化するため、30階層にネストしたPrismaスキーマ（`Tree1` から `Tree30`）を構築し、TypeScriptに高負荷な型推論を強制する環境で、4つのアプローチを比較検証しました。

```prisma
model Tree1 {
  id        Int      @id @default(autoincrement())
  // ... 基本フィールド
  Tree2     Tree2[]
}

model Tree2 {
  id        Int      @id @default(autoincrement())
  // ... 基本フィールド
  childTree Tree1    @relation(fields: [childId], references: [id])
  Tree3     Tree3?   @relation(fields: [tree3Id], references: [id])
}

// Tree3からTree30まで同様の構造...
```

### 4つのアプローチの比較結果

検証結果は以下の通りです。

| アプローチ | Types | Instantiations | Time | Type数改善率 | 時間短縮率 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heavy (直接的なPrismaClient使用)** | 269,668 | 2,773,122 | 1.84s | - (基準) | - (基準) |
| **Interface (最小限のインターフェース)** | 3,004 | 19,098 | 0.45s | 96%削減 | 75%短縮 |
| **Typeof (typeof演算子活用)** | 648 | 972 | 0.43s | 99.8%削減 | 77%短縮 |
| **Simple (拡張なし)** | 644 | 972 | 0.41s | 99.8%削減 | 78%短縮 |

`Heavy`アプローチでは型のインスタンス化が約277万回発生したのに対し、`Typeof`アプローチではわずか972回に抑えられ、**99.96%という劇的な改善**が見られました。

### パフォーマンス差の原因

* **Heavy アプローチの問題点**:
  * 関数の引数として`PrismaClient`型を直接指定すると、TypeScriptコンパイラが全てのモデル間のリレーション（`Tree1` → `Tree2` → ... → `Tree30`）を再帰的に解決しようとします。
  * これにより型の複雑性が指数関数的に増大し、膨大な数の型インスタンス化が発生します。

* **Interface / Typeof アプローチの効果**:
  * 処理に必要最小限の型情報のみを参照するように型スコープを限定します。
  * `typeof`演算子やインターフェースによって型の境界が明確になり、不要な型解析を回避できるため、コンパイラの負荷が大幅に削減されます。

### 実プロジェクトでの推奨パターン

パフォーマンス問題を避けるための具体的な実装パターンは以下の通りです。

#### ❌ 避けるべきパターン

```typescript
import { PrismaClient } from "@prisma/client";

const extendPrisma = (prisma: PrismaClient) => {
  // PrismaClient全体を型として扱うため、大量の型推論が発生
  return prisma.$extends({
    // 拡張処理
  });
};
```

#### ✅ 推奨パターン1: Interface活用

```typescript
import { PrismaClient } from "@prisma/client";

// 必要なメソッドのみを持つインターフェースを定義
export interface IPrismaClient {
  $extends: PrismaClient['$extends']
}

const extendPrisma = <T extends IPrismaClient>(prisma: T): T => {
  return prisma.$extends({
    // 拡張処理
  });
};
```

#### ✅ 推奨パターン2: Typeof活用

```typescript
import { PrismaClient } from "@prisma/client";

const basePrisma = new PrismaClient();

// インスタンスから型を推論させる
const extendPrisma = (prisma: typeof basePrisma) => {
  return prisma.$extends({
    // 拡張処理
  });
};
```

### 改善による効果

この最適化により、以下の効果が期待できます。

* **IDEの応答速度向上**: VSCodeなどでの型チェックやオートコンプリートが高速化します。
* **ホットリロード時間短縮**: 開発時の再コンパイル時間が削減されます。
* **CI/CDパイプライン高速化**: 型チェック処理が短縮されます。
* **開発者体験の向上**: ストレスのない快適な開発環境を実現します。

### まとめ

Prismaを使用するプロジェクトでは、クライアントを拡張する際の型指定方法が開発体験に大きな影響を及ぼします。`typeof`演算子や最小限のインターフェースを活用して型スコープを適切に限定することで、TypeScriptのパフォーマンスを劇的に改善できます。

筆者はこの問題を早期発見・対処するためのOSS [**TS-Bench**](https://github.com/ToyB0x/ts-bench) を開発しており、パフォーマンス劣化の警告や対策案の提案を行う機能も実装予定です。

![TS-Benchの紹介画像1](https://storage.googleapis.com/zenn-user-upload/297287ebf637-20250629.png)
![TS-Benchの紹介画像2](https://storage.googleapis.com/zenn-user-upload/b77ac1298486-20250629.png)
![TS-Benchの紹介画像3](https://storage.googleapis.com/zenn-user-upload/f3944d1f36a6-20250629.png)
![TS-Benchの紹介画像4](https://storage.googleapis.com/zenn-user-upload/cb9f0257f2b4-20250629.png)

> **免責事項**: 本記事の結果は特定環境下での検証に基づくものであり、実際の適用にあたっては各環境での検証が推奨されます。また、本記事はLLMと手書きを併用して作成されました。
