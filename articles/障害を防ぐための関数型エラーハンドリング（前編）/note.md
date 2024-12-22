# 障害を防ぐための関数型エラーハンドリング（前編）

ref: <https://zenn.dev/loglass/articles/c19b79f17418f1>

## 関数型エラーハンドリングを用いたTypeScriptによる障害抑制

ソフトウェア開発において、エラーハンドリングは避けて通れない課題です。本記事では、PDF「障害を防ぐための関数型エラーハンドリング（前編）」に基づき、以下のポイントをTypeScriptを用いて解説します。

 1. 従来のtry-catchの課題
 • 制御フローが中断される。
 • 合成可能性が低い。
 • 冗長な定型コードが増える。
 • エラーの曖昧さ。
 • 非同期処理との相性の悪さ。
 1. 関数型エラーハンドリングの利点
 • エラーを値として扱い、型安全性を確保。
 • エラーの局所化と伝搬を制御。
 • テスト容易性の向上。
 • 再現性の高いエラー処理設計。
 • 明示的なエラーモデリングによる障害抑制。

これらの概念をTypeScriptでどのように実現するかを、実装例を交えて説明します。

## 1. Result型でのエラーハンドリング

Result型は、処理の成功と失敗を型で明示的に区別し、エラーを例外としてではなく値として扱います。

TypeScriptでの実装

```typescript
type Result<T> = Success<T> | Failure;

class Success<T> {
  constructor(public value: T) {}
}

class Failure {
  constructor(public error: Error) {}
}
```

利点
 • 成功と失敗を明確に区別。
 • エラー処理が予測可能で一貫性がある。

使用例

```typescript
function performTask(): Result<number> {
  try {
    const value = Math.random();
    if (value > 0.5) {
      return new Success(value);
    } else {
      throw new Error("Task failed");
    }
  } catch (error) {
    return new Failure(error as Error);
  }
}
```

## 2. Either型を用いた高度なエラーモデリング

Either型は、成功（Right）とエラー（Left）の2つの可能性を持ちます。特に、ビジネスロジックでのエラーを明示的にモデリングする際に有用です。

TypeScriptでの実装

```typescript
type Either<L, R> = Left<L> | Right<R>;

class Left<L> {
  constructor(public value: L) {}
}

class Right<R> {
  constructor(public value: R) {}
}
```

利点
 • エラーを型でモデル化し、発生しうるエラーを型システムで表現。
 • 型安全なコード設計が可能。

使用例

```typescript
class BusinessError {
  constructor(public message: string) {}
}

class InsufficientFundsError extends BusinessError {}
class InvalidInputError extends BusinessError {}

function purchaseProduct(
  userId: string,
  productId: string,
  amount: number
): Either<BusinessError, string> {
  if (amount <= 0) {
    return new Left(new InvalidInputError("Invalid purchase amount"));
  }
  if (userId === "guest") {
    return new Left(new InsufficientFundsError("Insufficient funds"));
  }
  return new Right("Purchase completed successfully");
}

const result = purchaseProduct("guest", "prod123", 5);

if (result instanceof Right) {
  console.log(result.value);
} else {
  console.error("Error:", result.value.message);
}
```

## 3. Clean Architectureとの融合

エラー処理を「インフラ層」と「ユースケース層」に分離し、Result型やEither型を適切に使い分けることで、コードのモジュール性と保守性を向上させます。

アプローチ
 • インフラ層ではResult型を利用し、失敗と成功の結果を明示的に返却。
 • ユースケース層ではEither型を用い、ビジネスロジック内でのエラーを型でモデル化。

サンプルコード

インフラ層でエラーを処理し、ユースケース層で再利用する例です。

```typescript
// Infrastructure Layer
function fetchProduct(productId: string): Result<{ name: string; price: number }> {
  if (productId !== "validId") {
    return new Failure(new Error("Product not found"));
  }
  return new Success({ name: "Example Product", price: 100 });
}

// UseCase Layer
function processPurchase(
  productId: string,
  amount: number
): Either<BusinessError, string> {
  const productResult = fetchProduct(productId);
  if (productResult instanceof Failure) {
    return new Left(new BusinessError(productResult.error.message));
  }

  const product = productResult.value;
  if (amount > product.price) {
    return new Left(new InsufficientFundsError("Insufficient funds"));
  }

  return new Right(`Purchase successful: ${product.name}`);
}

const purchaseResult = processPurchase("invalidId", 50);

if (purchaseResult instanceof Right) {
  console.log(purchaseResult.value);
} else {
  console.error("Error:", purchaseResult.value.message);
}
```

## 結論

関数型エラーハンドリングをTypeScriptで適用することで、以下の利点が得られます：

 1. エラーの型安全性 - 型を通じてエラーを明示的に扱える。
 2. 障害抑制 - システム全体への障害伝搬を防止。
 3. 保守性の向上 - エラーハンドリングの一貫性が保たれる。

これにより、システムの信頼性が向上し、運用中の障害対応も迅速化できます。 ￼
