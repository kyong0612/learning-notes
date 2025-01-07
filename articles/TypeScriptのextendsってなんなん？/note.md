# TypeScriptのextendsってなんなん？

ref: <https://zenn.dev/nbr41to/articles/7d2e7c4e31c54c>

1. Genericsの基礎

TypeScriptでGenericsは、受け取った型を柔軟に再利用可能な形で利用する仕組みを提供します。

例: シンプルなGenericsの使用方法

```ts
function identity<T>(arg: T): T {
    return arg;
}

const result1 = identity<string>("Hello");
const result2 = identity<number>(42);

console.log(result1); // Hello
console.log(result2); // 42
```

2. 型の継承（interfaceを用いた拡張）

extendsを使うと、既存の型を継承して新しい型を定義できます。

例: interfaceを用いた型の拡張

```ts
interface User {
    name: string;
}

interface Admin extends User {
    isMaster: boolean;
}

const admin: Admin = {
    name: "Alice",
    isMaster: true,
};

console.log(admin);
```

3. Genericsの型制約

Genericsで型引数に制約を追加して、特定のプロパティや型を持つことを保証できます。

例: Genericsの型制約を用いた関数

```ts
interface User {
    name: string;
    age: number;
}

function getUserName<T extends User>(user: T): string {
    return user.name;
}

const user = { name: "Bob", age: 30 };
console.log(getUserName(user)); // Bob
```

4. 条件型 (Conditional Type)

extendsを用いて条件型を定義すると、条件に基づいて型を分岐できます。

例: 条件型の使用

```ts
type IsString<T> = T extends string ? "Yes" : "No";

type Result1 = IsString<string>;  // "Yes"
type Result2 = IsString<number>;  // "No"

console.log<Result1>(); // Yes
console.log<Result2>(); // No
```

5. 条件型でのinferの使用

inferを用いて型情報を抽出することが可能です。

例: inferを使った型推論

```ts
type ExtractKey<T> = T extends { key: infer U } ? U : never;

type Example1 = ExtractKey<{ key: string }>; // string
type Example2 = ExtractKey<{ key: number }>; // number
type Example3 = ExtractKey<{ otherKey: boolean }>; // never

console.log<Example1>(); // string
console.log<Example2>(); // number
console.log<Example3>(); // never
```
