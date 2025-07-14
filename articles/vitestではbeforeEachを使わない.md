---
title: "vitestではbeforeEachを使わない"
source: "https://blog.koh.dev/2025-07-11-vitest-beforeeach/"
author:
  - "kohsweb"
published: 2025-07-11
created: 2025-07-14
description: |
  最近DBありのテストを記述していた際に、実はvitestではbeforeEachは必要ないのではないか、という考えに至ったのでその理由と設計についてまとめてみる。
tags:
  - "nodejs"
  - "typescript"
  - "test"
  - "vitest"
---

## はじめに

DBありのテストを記述する際に、`vitest`では`beforeEach`が不要ではないかという考えに至った理由と設計について解説する。

実験用リポジトリ: <https://github.com/koh110/vitest-beforeeach>

## テストで`beforeEach`が欲しくなるシーン

`beforeEach`が必要になる主なケースは以下の2つ。

1. **mockの設定/reset**: テストの移植性を考えると、`beforeAll`か個別のテストで設定すべき。`beforeEach`だと無関係なmockが干渉する可能性がある。
2. **seedsの投入**: 共通のseedデータを投入するために使われるが、テストスコープ外の変数に依存するためコードが綺麗にならない。また、不要なテストでも実行され、DBアクセスが増え、テスト速度が低下する。

### `beforeEach`でのseed投入の問題点

```ts
let seeds = []
beforeEach(async () => {
  seeds = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
  await db.user.createManey({
    data: seeds
  })
})

test('test1', async () => {
  const newUser = await createUser('Charlie')
  const after = await db.user.findMany()

  // ファイルグローバルな変数へのアクセスが良くない
  expect(after.length).toStrictEqual(seeds.legnth + 1)
})
```

## Test Contextの活用

`vitest`の[Test Context](https://vitest.dev/guide/test-context)を拡張することで、これらの問題を解決できる。`test.extend` を使うことで、`beforeEach`の代替となる、より優れた方法を実装できる。

### `test.extend`による改善

`test.extend` を使うと、seedデータをコンテキスト経由で受け取れるようになり、必要なテストでのみseed生成が実行される。

```ts
const test = baseTest.extend<{
  seeds: { id: number; name: string }[]
}>({
  seeds: async ({ task }, use) => {
    const seeds = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
    await db.user.createMany({
      data: seeds
    })
    await use(seeds)
  }
})

test('test1', async ({ seeds }) => {
  const newUser = await createUser('Charlie')
  const after = await db.user.findMany()

  // context経由でアクセスできる
  expect(after.length).toStrictEqual(seeds.legnth + 1)
})

// seedにアクセスしなければcreateManyは実行されない
test('test2', async() => {
  expect(1 + 2).toBe(3)
})
```

この方法の利点は、contextにアクセスしない限りseed生成が実行されないため、無駄なDBアクセスを削減し、テストの実行時間を短縮できることである。

## 余談: DBつきテスト時間短縮の考え方

DBを扱うテストの高速化には**並列実行**が重要。そのために以下の点を意識している。

1. **seedを各テストでユニークにする**: `task.id`を使い、ユニーク制約違反を避ける。

    ```ts
    const test = baseTest.extend<{
      seeds: { id: number; name: string }[]
    }>({
      seeds: async ({ task }, use) => {
        const seeds = [
          { id: 1, name: `${task.id}-Alice` },
          { id: 2, name: `${task.id}-Bob` }
        ]
        // ...
      }
    })
    ```

2. **事前のstateに依存しないテストを書く**: DB全体の状態ではなく、テスト内での相対的な変化を検証する。

    ```ts
    test('test1', async ({ seeds, task }) => {
      // task.idを含むデータの数を数える
      const before = await db.user.count({
        where: { name: { startsWith: task.id } }
      })
      const newUser = await createUser(`${task.id}-Charlie`)
      // 1件追加されたことを確認
      const after = await db.user.count({
        where: { name: { startsWith: task.id } }
      })
      expect(after).toBe(before + 1)
    })
    ```

これにより、テストの並列性を最大限に高め、実行時間を短縮できる。複雑な場合は直列実行もやむを得ないが、基本は並列実行を前提としてテストを設計することが望ましい。
