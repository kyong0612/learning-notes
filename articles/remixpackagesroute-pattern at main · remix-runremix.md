---
title: "remix/packages/route-pattern at main · remix-run/remix"
source: "https://github.com/remix-run/remix/tree/main/packages/route-pattern"
author:
  - "[[pcattori]]"
published:
created: 2025-09-14
description: |
  `@remix-run/route-pattern`は、Remixアプリケーションでルートパターンを定義し、型安全なURLを生成するためのパッケージです。これにより、開発者はURLパターンを定義し、それに基づいて型安全なURLを生成できます。
tags:
  - "remix"
  - "routing"
  - "url-generation"
  - "type-safety"
---

`@remix-run/route-pattern`パッケージは、Remixアプリケーションにおけるルートパターンの定義と型安全なURLの生成を支援します。

## 主な機能

### URL生成

`createHrefBuilder`関数を使用して、型安全なURLを生成できます。

```typescript
import { createHrefBuilder } from '@remix-run/route-pattern';

let href = createHrefBuilder();

href('/api/v:version/products/:id.json', {
  version: '2.1',
  id: 'wireless-headphones',
});
// -> /api/v2.1/products/wireless-headphones.json
```

### パターンフォーマット

ルートパターンは、URLの構造を反映した形式で定義されます。

```
'<protocol>://<hostname>[:<port>]/<pathname>?<search>'
```

### パターン機能

変数、ワイルドカード、オプショナル、列挙型などの機能を使用して、柔軟なルートパターンを定義できます。

- **変数**: コロン (`:`) の後にパラメータ名を指定して、動的なURLセグメントをキャプチャします。

    ```typescript
    let pattern = new RoutePattern('users/@:username');
    pattern.match('https://shopify.com/users/@maya');
    // -> { username: 'maya' }
    ```

- **ワイルドカード**: アスタリスク (`*`) を使用して、複数のセグメントにわたる動的なコンテンツをマッチングします。

    ```typescript
    let pattern = new RoutePattern('/*path/v:version');
    let match = pattern.match('https://cdn.shopify.com/assets/themes/dawn/v2');
    // -> { path: 'assets/themes/dawn', version: '2' }
    ```

- **オプショナル**: 括弧 (`()`) で囲むことで、URLセグメントをオプショナルとしてマークします。

    ```typescript
    let pattern = new RoutePattern('api(/v:version)/products');
    pattern.match('https://api.shopify.com/api/products');
    // -> {}
    pattern.match('https://api.shopify.com/api/v2/products');
    // -> { version: '2' }
    ```

- **列挙型**: 中括弧 (`{}`) を使用して、特定の値のみを許可するマッチングを行います。

    ```typescript
    let pattern = new RoutePattern('products/:filename.{jpg,png,gif,webp}');
    pattern.match('https://cdn.shopify.com/products/sneakers.png');
    // -> { filename: 'sneakers' }
    ```
