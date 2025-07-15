---
title: "Zod Mini"
source: "https://zod.dev/packages/mini"
author:
  - "Colin McDonnell (colinhacks)"
published:
created: 2025-07-15
description: |
  Zod Miniは、通常のZodとまったく同じ機能を実装していますが、関数的でツリーシェイク可能なAPIを使用しています。これにより、最終的なバンドルから未使用のコードを削除でき、バンドルサイズを大幅に削減できます。
tags:
  - "zod"
  - "typescript"
  - "bundle-size"
  - "tree-shaking"
  - "performance"
---

Zod Miniは、Zod 4で導入された、通常のZodと同じ機能を持ちながら、**関数的でツリーシェイク可能なAPI**を提供するバリアントです。これにより、モダンなバンドラが未使用のコードを効率的に削除（デッドコード除去）できるようになり、アプリケーションのバンドルサイズを大幅に削減できます。

- **インストール**: `npm install zod@^4.0.0`
- **インポート**: `import * as z from "zod/mini";`

## Zod MiniのAPIスタイル

Zod Miniは、メソッドチェーンの代わりに**関数をネスト**させるスタイルを採用しています。

```ts
// 通常のZod
const mySchema = z.string().optional().nullable();

// Zod Mini
const mySchema = z.nullable(z.optional(z.string()));
```

## Tree-shakingによるバンドルサイズ削減

Zod Miniの関数ベースAPIの最大の利点は、Tree-shakingによるバンドルサイズの削減です。メソッドベースのAPIでは難しい未使用コードの除去が、関数ベースでは容易になります。

### バンドルサイズ比較

シンプルなスキーマの場合、Zod Miniは**64%のサイズ削減**を実現します。

```ts
// z.boolean().parse(true)
```

| パッケージ | バンドルサイズ (gzip) |
| :--- | :--- |
| **Zod Mini** | `2.12kb` |
| Zod | `5.91kb` |

オブジェクト型を含む少し複雑なスキーマでも、大幅な削減が見られます。

```ts
const schema = z.object({ a: z.string(), b: z.number(), c: z.boolean() });
schema.parse({ a: "asdf", b: 123, c: true });
```

| パッケージ | バンドルサイズ (gzip) |
| :--- | :--- |
| **Zod Mini** | `4.0kb` |
| Zod | `13.1kb` |

## Zod Miniを使うべきでないケース

開発者体験（DX）や実際のパフォーマンスへの影響を考慮すると、**バンドルサイズに極めて厳しい制約がない限り、通常のZodを使用することが推奨されます**。

### 1. 開発者体験（DX）

Zod MiniのAPIは冗長で、IntelliSenseによる補完が効きにくく、メソッドチェーンのように直感的にスキーマを構築できません。

### 2. バックエンド開発

サーバーサイド（例: Lambda）では、Zodのバンドルサイズ（約17kb）がコールドスタート時間に与える影響は**無視できるほど小さい**（約0.6msの増加）ため、Zod Miniを使うメリットはありません。

| バンドルサイズ | Lambdaコールドスタート時間 |
| :--- | :--- |
| `1kb` | `171ms` |
| `17kb` | `171.6ms` (推計) |
| `128kb` | `176ms` |

### 3. 通信速度

一般的な通信環境では、サーバーとのラウンドトリップタイム（100-200ms）の方が、数KBのファイルダウンロード時間よりも支配的です。低速な3G回線など、特殊な環境をターゲットにしない限り、バンドルサイズの最適化は優先度が低いです。

## ZodMiniTypeの主要メソッド

Zod Miniのスキーマは`z.ZodMiniType`を継承しており、以下のようないくつかの便利なメソッドが利用可能です。

### `.parse()`

通常のZodと同様に、`parse`, `parseAsync`, `safeParse`, `safeParseAsync`が利用できます。

### `.check()`

バリデーションルールは、メソッドチェーンの代わりに`.check()`メソッドに渡して適用します。

```ts
// 通常のZod
z.string()
  .min(5)
  .max(10)
  .trim()

// Zod Mini
z.string().check(
  z.minLength(5),
  z.maxLength(10),
  z.trim()
);
```

`z.minLength`, `z.maxLength`, `z.regex`など、多くのチェックが用意されており、型安全に利用できます。

### `.brand()`

[Branded Types](https://zod.dev/api#branded-types)を使い、特定の型に「ブランド」を付けてより厳密な型定義を作成できます。

```ts
import * as z from "zod/mini"

const USD = z.string().brand("USD");
```

### その他

- `.register()`: スキーマをレジストリに登録します。
- `.clone()`: スキーマを複製します。

## デフォルトロケールなし

バンドルサイズを最小化するため、Zod Miniにはデフォルトのエラーメッセージ（英語ロケール）が含まれていません。そのため、デフォルトのエラーメッセージはすべて`"Invalid input"`になります。

英語のロケールを読み込むには、明示的に設定が必要です。

```ts
import * as z from "zod/mini"

z.config(z.locales.en());
```
