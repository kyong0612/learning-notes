# constアサーション「as const」 (const assertion)

ref: <https://typescriptbook.jp/reference/values-types-variables/const-assertion>

## 基本概念

`const assertion`は、オブジェクトリテラルの末尾に`as const`を付けることで、そのオブジェクトのすべてのプロパティを`readonly`かつリテラルタイプとして扱う機能です[1]。

```typescript
const pikachu = {
    name: "pikachu",
    no: 25,
    genre: "mouse pokémon",
    height: 0.4,
    weight: 6.0
} as const;
```

## readonly vs const assertion

**主な違いは以下の2点です：**

### プロパティの指定方法

- `readonly`は個別のプロパティに対して適用できる
- `const assertion`はオブジェクト全体に適用され、すべてのプロパティが対象となる[1]

### ネストされたオブジェクトの扱い

- `readonly`は直接のプロパティのみを読み取り専用にする
- `const assertion`は再帰的にすべてのネストされたプロパティも読み取り専用にする[1]

## 実践的な例

以下のような複雑なオブジェクト構造でその違いが顕著になります：

```typescript
const america = {
    name: "North American Continent",
    canada: {
        name: "Republic of Canada",
        capitalCity: "Ottawa"
    },
    us: {
        name: "United States of America",
        capitalCity: "Washington, D.C."
    }
} as const;
```

このケースでは、`as const`を使用することで：

- トップレベルのプロパティ
- ネストされたオブジェクトのプロパティ
すべてが読み取り専用となり、値の変更が不可能になります[1]。

Sources
[1] const-assertion <https://typescriptbook.jp/reference/values-types-variables/const-assertion>
[2] constアサーション「as const」 (const assertion) | TypeScript入門『サバイバルTypeScript』 <https://typescriptbook.jp/reference/values-types-variables/const-assertion>
