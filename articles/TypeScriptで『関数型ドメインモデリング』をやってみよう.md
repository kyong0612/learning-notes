---
title: "TypeScriptで『関数型ドメインモデリング』をやってみよう"
source: "https://qiita.com/hanaokatomoki/items/cf09dcfb69b1ae0c6e0a"
author:
  - "[[hanaokatomoki]]"
published: 2024-12-20
created: 2025-09-21
description: "LIFULLでの技術負債解消の取り組みから、関数型ドメインモデリングの「型によるドメインモデリング」をTypeScriptで実装する方法を解説。状態遷移を型として表現することで、可読性・保守性を向上させる手法を紹介する。"
tags:
  - "TypeScript"
  - "DDD"
  - "関数型プログラミング"
  - "ドメイン駆動設計"
  - "CleanArchitecture"
  - "clippings"
---

## 概要

この記事は、LIFULL Advent Calendar 2024の21日目として投稿された、TypeScriptで関数型ドメインモデリングを実践する方法について解説した記事です。

LIFULLでは技術負債解消のため、レガシーコンポーネントをClean Architecture（CA）に置き換える取り組みを行っており、この記事では『関数型ドメインモデリング』という書籍で紹介されている「型によるドメインモデリング」のアプローチをTypeScriptで実装する方法を紹介しています。

## 背景と動機

### LIFULLでの取り組み
- レガシーシステムをClean Architectureに移行する技術負債解消プロジェクト
- CAのEntityをドメイン駆動設計（DDD）のドメインモデルで実装
- 『関数型ドメインモデリング』の「型によるドメインモデリング」の応用可能性を調査

### 関数型ドメインモデリングについて
- 関数型言語でドメイン駆動開発を実践する方法を解説した書籍
- 「直和型」「Result型」「関数合成」などの関数型特有の機能を活用
- 型安全で可読性の高いDDD実装を実現
- DDDの解説も充実しており、初学者にも理解しやすい構成

## 実装比較：従来のアプローチ vs 型によるドメインモデリング

### 従来のTypeScript実装
```typescript
export class bukken {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private orderFlg: boolean,
    private orderDate: Date | undefined
  ) {}

  static create(id: number, name: string): bukken {
    if (id != 0 || name == "") {
      throw new Error("Invalid parameter");
    }
    return new bukken(id, name, false, undefined);
  }

  order(): void {
    this.orderFlg = true;
    this.orderDate = new Date();
  }

  cancelOrder(): void {
    this.orderFlg = false;
    this.orderDate = undefined;
  }
}
```

**特徴：**
- 完全コンストラクタパターンを採用
- 状態をフラグで管理
- オブジェクト生成時にvalidationを実行

### 型によるドメインモデリング実装

#### 状態の型定義
```typescript
export type unvalidatedBukken = {
  id: number;
  name: string;
}

export type validatedBukken = {
  id: number;
  name: string;
}

export type validatedOrderdBukken = {
  id: number;
  name: string;
  orderDate: Date;
}
```

#### 状態遷移関数
```typescript
export function validate(data: unvalidatedBukken): validatedBukken {
  if (data.id == 0 || data.name == "") {
    throw new Error("Invalid parameter");
  }
  return { id: data.id, name: data.name };
}

export function order(data: validatedBukken): validatedOrderdBukken {
  return {
    id: data.id,
    name: data.name,
    orderDate: new Date(),
  };
}

export function cancelOrder(data: validatedOrderdBukken): validatedBukken {
  return { id: data.id, name: data.name };
}
```

## 型によるドメインモデリングの利点

### 1. 状態遷移の明確な把握
- **問題**: フラグベースの実装では、状態変更処理が散らばり、状態遷移の流れが不明確
- **解決**: 状態遷移を関数として定義し、シグネチャから遷移が一目瞭然
- **効果**: ソースコードレビューが容易、改修時の調査が効率的

### 2. 型安全による不正状態の防止
- **問題**: フラグとデータの整合性が保たれない可能性（例：未注文なのに注文日が設定される）
- **解決**: 状態ごとに必要なプロパティのみを型で定義
- **効果**: コンパイル時にTypeScriptが型エラーで不整合を検出

**例：**
```typescript
// 型エラーが発生する例
export function cancelOrder(data: validatedOrderdBukken): validatedBukken {
  return {
    id: data.id,
    name: data.name,
    orderDate: Date; // エラー: validatedBukkenにorderDateは存在しない
  };
}
```

### 3. ユニットテストの簡素化
- **従来**: 状態変更の確認テストが必要
- **型アプローチ**: ロジックがシンプルで型検査が動作を保証
- **効果**: テストコード量の削減、認知負荷の軽減

## デメリットと考慮事項

### デメリット
1. **コード量の増加**: 型定義により全体のコード行数が増える
2. **学習コスト**: チームメンバーの慣れが必要

### 実用的な考慮点
- コード量は増えるが、一度に読む必要のあるコードは減る
- 認知負荷は実質的に下がる
- validation用の型表現はTypeScriptではメリットが薄い場合がある
- チーム方針とプロダクト特性を考慮した導入判断が重要

## まとめ

### 型によるドメインモデリングの価値
1. **可読性の向上**: 不変データと明確な型表現
2. **保守性の向上**: 状態遷移の明文化
3. **安全性の向上**: 型検査によるエラー検出とバグ抑止
4. **効率性の向上**: ユニットテストコード量の削減

### 今後の展望
記事では触れられていない『関数型ドメインモデリング』の他の要素：
- 関数型特性を活かしたworkflow実装
- Result型を使ったエラーハンドリング
- 永続化の方法（Repositoryパターンが不要という主張）

### 参考文献
- [関数型ドメインモデリング](https://tatsu-zine.com/books/domain-modeling-made-functional)
- [実践ドメイン駆動設計](https://www.shoeisha.co.jp/book/detail/9784798131610)
- LIFULLの技術ブログシリーズ（Clean Architecture実装事例）
- Domain Modeling Made Functional関連の技術カンファレンス資料
