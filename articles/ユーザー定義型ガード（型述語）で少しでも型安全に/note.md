# ユーザー定義型ガード（型述語）で少しでも型安全に

ref: <https://qiita.com/axoloto210/items/dbbb5c608d719393c3bd>

## 引数 is 型によるユーザー定義型ガード

- 以下だとコンパイルエラーになる( 'tuna' is of type 'unknown'.ts(18046))

```typescript
type Fish = {
  name: string
  age?: number
}

function isFish(fish: any) {
  if (fish === null) {
    return false
  }
  return (
    typeof fish.name === "string" &&
    (typeof fish.age === "number" || typeof fish.age === undefined)
  )
}

const tuna: unknown = {
  name: "tuna",
  age: 5,
}

if (isFish(tuna)) {
  console.log(tuna.age) //'tuna' is of type 'unknown'.ts(18046)
}

```

> そこで、関数の返り値の型にfish is Fishとつけることで、関数がtrueを返した場合にはコンパイラに引数として渡した変数の型はFish型であると認識させることができます。
> **ここの実装を間違えると誤った型をコンパイラが認識したままの状態になり、型安全性が損なわれるので注意が必要です**

```typescript
type Fish = {
  name: string
  age?: number
}

function isFish(fish: any): fish is Fish {
  if (fish === null) {
    return false
  }
  return (
    typeof fish.name === "string" &&
    (typeof fish.age === "number" || typeof fish.age === undefined)
  )
}

const tuna: unknown = {
  name: "tuna",
  age: 5,
}

if (isFish(tuna)) {     // const tuna: unknown
  console.log(tuna.age) // const tuna: Fish
}


```
