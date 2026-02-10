---
title: "Go1.26リリース連載：newプリミティブの拡張"
source: "https://future-architect.github.io/articles/20260202a/"
author:
  - "[[辻大志郎]]"
published: 2026-02-02
created: 2026-02-10
description: "Go1.26で導入されるnew()組み込み関数の拡張について解説。従来はゼロ値のポインタしか生成できなかったnew()が、式（リテラル・変数・関数呼び出し等）を引数に取れるようになり、任意の値を持つポインタを1行で生成可能に。構造体のオプショナルフィールド初期化やヘルパー関数不要化など実用的なユースケースを紹介。"
tags:
  - "clippings"
  - "Go"
  - "Go1.26"
  - "言語仕様"
  - "ポインタ"
  - "new"
---

## はじめに

フューチャーアーキテクト製造エネルギー事業部の辻大志郎氏による、[Go1.26ブログ連載](https://future-architect.github.io/articles/20260127a/)の5本目の記事。Go1.26における言語仕様のアップデートから、`new` プリミティブの拡張を紹介している。

## Go1.25までの `new` の挙動

Go1.25までの `new()` は以下の特徴を持っていた：

- 引数に**型**を指定し、その型の**ゼロ値**で初期化したポインタを返す関数
- 特定の値（例：`10` や `"hoge"`）を持つポインタを1行で作ることができなかった

```go
// ゼロ値のポインタは作れる
ptr := new(int) // *int で値は 0

// 特定の値のポインタを作るには2行必要
v := 10
ptr := &v
```

### 従来の回避策

1. **スライスリテラルのトリック**（1行で書くテクニック）：
   ```go
   v := &[]int{10}[0]
   ```

2. **ジェネリクスヘルパー関数**（Go1.18以降のプラクティス）：
   ```go
   func ToPtr[T any](v T) *T {
       return &v
   }
   ```

このニーズは **2014年頃** から存在しており、[#9097 proposal](https://github.com/golang/go/issues/9097) として提案されていた。

## Go1.26の `new` アップデートサマリ

> The built-in new function, which creates a new variable, now allows its operand to be an expression, specifying the initial value of the variable.

組み込み関数 `new()` が引数に**型あるいは式**を指定でき、変数の初期値を定義できるようになった。式にはリテラル（`10`）、変数（`v`）、関数呼び出し（`f()`）、演算（`a+b`）などが含まれる。

### ユースケース1：構造体のオプショナル項目の初期化を簡潔に実装

構造体のオプショナルなフィールドで、値がない状態を `nil` で表現するケース：

```go
type Person struct {
    Name string `json:"name"`
    Age  *int   `json:"age"` // 不明な場合は nil
}
```

Go1.26では**関数の戻り値のポインタ**を `new()` で直接生成できる：

```go
func personJSON(name string, born time.Time) ([]byte, error) {
    return json.Marshal(Person{
        Name: name,
        Age:  new(yearsSince(born)), // 関数を new に渡せる!
    })
}
```

### ユースケース2：値リテラルからポインタ型へ直接変換

従来 [AWS SDK for Go v2](https://github.com/aws/aws-sdk-go-v2/blob/v1.41.1/aws/to_ptr.go) の `aws.Int()` のようなヘルパー関数が必要だったケースが不要に：

```go
type User struct {
    Name string `json:"name"`
    Age  *int   `json:"age"`
}

func main() {
    u := User{
        Name: "Taro",
        Age:  new(20), // リテラルから直接ポインタ生成
    }
}
```

**`*int64` が欲しい場合** は `new(int64(20))` のように型変換と組み合わせて記述可能。任意の型のポインタを柔軟に生成できる。

## 検討されたが採用されなかった代替案

[#45624 spec: expression to create pointer to simple types](https://github.com/golang/go/issues/45624) で議論された代替案の一覧：

### 1. `new(Type, Value)` 形式

```go
p1 := new(int, 3)
p2 := new(rune, 10)
```

- **支持点**: `make(Type, size)` との整合性がある。型推論が明確（`new(3)` と `new(int64, 3)` の区別が可能）
- **懸念点**: 冗長。`3` が `int` であることは自明なのに `new(int, 3)` と書くのは冗長。`new(time.Duration, time.Second)` のようにパッケージ型が長い場合に特に顕著
- **亜種**: `new[Type](Value)` のジェネリクス風構文も提案されたが、既存の `make()` との一貫性がなくなるため却下

### 2. `&Type(Value)` 形式

```go
p1 := &int(3)
p2 := &rune(10)
```

- **懸念点**: `&` が既存の変数のアドレス取得と、新しいメモリ割り当て+アドレス返却で異なる意味を持つことになり、一貫性がなくなる

### 3. `ref()` 関数などのヘルパー関数導入

```go
ref(123)       // *int
ref("hello")   // *string
```

- **懸念点**: `ref` 等の命名は既存コードと衝突の可能性がある。新しい命名を導入するよりは、既存の `new` の拡張が適切と判断された

## まとめ

- Go1.26で `new()` が拡張され、式を引数として受け取りポインタを生成できるようになった
- **実用的なメリット**: 構造体のオプショナルフィールドの初期化が簡潔に、ヘルパー関数（`ToPtr`、`aws.Int()` 等）が不要に
- 2014年から存在していたニーズに対して、`new` の既存概念を拡張するという**シンプルで美しいアップデート**
- 代替案（`new(Type, Value)`、`&Type(Value)`、`ref()` 等）が検討されたが、既存の `new` 拡張がもっともシンプルで適切と判断された
