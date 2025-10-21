---
title: "【結論】TypeScriptの型定義はtypeよりinterfaceを使うべき理由"
source: "https://zenn.dev/bmth/articles/interface-props-extends"
author:
  - "じょうげん (bmth)"
published: 2024-10-20
created: 2025-10-21
description: |
  TypeScriptの型定義でtypeとinterfaceのどちらを使うべきかについて、実際のパフォーマンス問題を例に解説。interfaceは遅延評価を行うためパフォーマンスに優れており、基本的にはinterfaceを使い、Union型などinterfaceで表現できない型のみtypeを使うべきという結論を導く。
tags:
  - "TypeScript"
  - "React"
  - "performance"
  - "interface"
  - "type"
  - "frontend"
---

## はじめに

TypeScriptでコンポーネントのPropsやオブジェクトの型を定義するとき、`type`と`interface`のどちらを使うべきかは開発者の間でよく議論される話題です。この記事では、実際のパフォーマンス問題を例に、**明確な理由をもって「基本的にはinterfaceを使うべき」**という主張を展開します。

## type aliasの魅力と潜む罠

### typeを選びたくなる理由

`type`で定義した型は、VSCodeなどのエディタでホバーすると、最終的に解決された具体的な型情報がインラインで表示されます。この「分かりやすさ」が多くの開発者を魅了します。

**interfaceの型定義:**

```typescript
export interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}
```

→ ホバー時には名前しか表示されない

**type aliasの型定義:**

```typescript
export type IconButtonProps = HTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
};
```

→ ホバー時に宣言内容が表示される

この視覚的な分かりやすさから、筆者も業務では常に`type`を使っていました。しかし、これが後に深刻な問題を引き起こすことになります。

## 実体験：type aliasが引き起こしたパフォーマンス地獄

### 突然の危機

プロダクトの成長に伴い、ある日突然エディタの型チェックが異常に遅くなりました。さらに深刻だったのは、**CI/CDでのtscによる型チェックが1分から30分以上に激増**したことです。

### 問題の特定

- 問題はマージ前の特定のブランチでのみ発生
- 共通フォームコンポーネントを使ったフィールド追加が原因と推測
- バリデーションライブラリのスキーマから型を推論する複雑な構造
- しかし、TanStackなど他の大規模ライブラリでは同様の問題が起きていない

### 解決策の発見

チームで1週間以上あらゆる対策を試した後、藁にもすがる思いで試した仮説が的中しました：

> 「もしかして、`type`が原因なのでは？」

プロジェクト全体の型定義を`type`から`interface`に機械的に一括置換したところ、**エディタの遅延が解消し、ビルド時間が1分に戻りました**。

### 一括置換用の正規表現

記事では、同様の問題に遭遇した方のために、VSCodeで使える正規表現が提供されています：

```
Find: ^(\s*)(?:export\s+|declare\s+)*type\s+([A-Za-z_$][\w$]*(?:<[^>]*>)?)\s*=\s*(.+?)\s*&\s*\{\s*\r?\n([\s\S]*?)^\1\}\s*;?

Replace: $1interface $2 extends $3 {
$4$1}
```

## なぜinterfaceはパフォーマンスに優れるのか？

### type：即時評価（Eager Evaluation）

`type`は**型エイリアス**であり、TypeScriptコンパイラは`type`を見つけると、その場で型を再帰的に解決・展開し、具体的な1つの型にします。

- ホバー時に具体的な型が見える理由
- 交差型（`&`）が重なると計算コストが指数関数的に増大
- 型チェック全体のパフォーマンスを著しく低下させる

### interface：遅延評価（Lazy Evaluation）

`interface`は新しい名前付きのオブジェクト型を**宣言**するものです。コンパイラは`interface`を1つの名前（シンボル）として扱います。

- **型情報が必要になるまで、内部構造の完全な計算を遅延**
- ホバー時に名前しか表示されない理由
- どんなに複雑に継承されても、パフォーマンスへの影響を最小限に抑制
- 大規模なOSSライブラリのほとんどが`interface`を使う理由

### TypeScript公式ドキュメントの見解

> Using interfaces with extends can often be more performant for the compiler than type aliases with intersections

訳：interfaceをextendsで拡張する方が、型エイリアスをintersectionで組み合わせるよりも、コンパイラにとってパフォーマンスが良いことが多い。

出典：[TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

## typeはいつ使うべきか？

**`interface`では表現できない型を定義する場合にのみ、`type`を使うべき**です。

### typeを使うべき具体的なケース

1. **Union型（合併型）**

   ```typescript
   type Status = 'success' | 'error' | 'loading';
   ```

2. **タプル型**

   ```typescript
   type UserTuple = [name: string, age: number];
   ```

3. **Mapped Types（複雑な型操作）**

   ```typescript
   type ReadonlyUser = {
     readonly [K in keyof User]: User[K];
   };
   ```

4. **プリミティブ型の別名**

   ```typescript
   type UserID = string;
   ```

## OSSに学ぶ、interfaceにおける可読性を高める工夫

大規模なOSSライブラリでは、`interface`を使いながらも可読性を高めるために工夫がされています。

### JSDocコメントの活用

Next.jsの型定義では、`interface`に対してJSDocコメントを充実させることで、ホバー時に具体的な説明が表示されるようにしています。また、interface名を具体的かつ説明的に命名することで、コードを読むだけでその役割が理解できるよう工夫されています。

### ユーティリティ型の活用

Honoの型定義では、ユーザーに公開する直前で`Simplify<T>`というユーティリティ型を使い、ホバー時に見やすくしています：

```typescript
type Simplify<T> = { [K in keyof T]: T[K] } & {};
```

この手法は、末端で一度だけの利用かつ、含まれるプロパティの数が少ない場合に有効です。

## 結論：基本はinterface、できないことだけtype

`type`と`interface`はそもそも役割が違うものであり、統一するべきではありません。

### 従うべきシンプルなルール

> **オブジェクトの形状を定義する際は、まず`interface`を使う。`interface`で表現できない型（Union型など）を定義する必要がある場合に限り、`type`を使う。**

この指針に従うことで：

- TypeScriptの強力な型システムの恩恵を受けられる
- アプリケーションのパフォーマンスとスケーラビリティを将来にわたって維持できる

`type`のホバー時の分かりやすさは魅力的ですが、それはプロジェクトを蝕むパフォーマンス問題と引き換えになる可能性があることを忘れてはいけません。

## ディスカッションのハイライト

記事へのコメントでは以下のような議論がありました：

- **小規模プロジェクトの場合**：パフォーマンス問題がなければ、「分かりやすさ」というメリットからtype統一も選択肢になり得る
- **TypeScript Handbookの指針**：「typeの機能が必要になるまではinterfaceを使った方が良い」と明記されており、本記事の主張と一致している
