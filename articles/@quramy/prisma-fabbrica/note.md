# @quramy/prisma-fabbrica

ref: <https://github.com/Quramy/prisma-fabbrica>

## @quramy/prisma-fabbrica 要約

`@quramy/prisma-fabbrica` は、Prisma ORMのためのモデルファクトリーを生成するライブラリです。テストデータやシードデータの生成を容易にします。

### 1. 導入 (Getting started)

1. **インストール:**

    ```bash
    npm i @quramy/prisma-fabbrica -D
    ```

2. **`schema.prisma` の設定:** `generator` ブロックを追加します。

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    generator fabbrica {
      provider = "prisma-fabbrica"
    }
    ```

3. **生成:**

    ```bash
    npx prisma generate
    ```

    これにより `src/__generated__/fabbrica` (デフォルト) にファクトリー定義用の関数が生成されます。
4. **初期化:** Prisma Clientインスタンスを渡して初期化します。

    ```typescript
    import { PrismaClient } from "@prisma/client";
    import { initialize } from "./__generated__/fabbrica";

    const prisma = new PrismaClient();
    initialize({ prisma });
    ```

### 2. ファクトリーの利用法 (Usage of factories)

1. **ファクトリー定義:** 生成された `define<ModelName>Factory` 関数を使ってファクトリーを定義します。

    ```typescript
    import { defineUserFactory } from "./__generated__/fabbrica";
    const UserFactory = defineUserFactory();
    ```

2. **レコード作成 (`.create`)**: ファクトリーを使ってレコードを作成します。必須のスカラーフィールドは自動的に埋められます（ルール詳細は [`scalar/gen.ts`](https://github.com/Quramy/prisma-fabbrica/blob/main/packages/prisma-fabbrica/src/scalar/gen.ts) を参照）。

    ```typescript
    await UserFactory.create(); // 自動入力で作成
    await UserFactory.create({ name: "Alice" }); // 特定の値を指定
    ```

3. **デフォルト値の上書き:** `defaultData` オプションでデフォルトの生成ルールを上書きできます。

    ```typescript
    const UserFactory = defineUserFactory({
      defaultData: async () => ({
        email: await generateRandomEmailAddress(), // 独自のロジック
      }),
    });
    ```

4. **シーケンス (`seq`):** `.create()` が呼ばれるたびにインクリメントされる連番を利用できます。テストなどで一意な値が必要な場合に便利です。

    ```typescript
    const UserFactory = defineUserFactory({
      defaultData: async ({ seq }) => ({
        id: `user${seq.toString().padStart(3, "0")}`, // user000, user001, ...
      }),
    });
    // resetSequence() でリセット可能
    ```

5. **リスト作成 (`.createList`)**: 複数のレコードを一度に作成します。

    ```typescript
    await UserFactory.createList(3); // 3件作成
    await UserFactory.createList(3, { name: "Bob" }); // 共通の値を指定して3件作成
    await UserFactory.createList([{ id: "user01" }, { id: "user02" }]); // 個別の値を指定して作成
    ```

6. **必須リレーション:** 関連モデルが必要な場合、関連モデルのファクトリーを `defaultData` で指定します。

    ```typescript
    const UserFactory = defineUserFactory();
    const PostFactory = definePostFactory({
      defaultData: {
        author: UserFactory, // Post作成時にUserも自動作成される
      },
    });
    // または connect / create / createOrConnect を手動で指定
    ```

7. **接続ヘルパー (`createForConnect`)**: 既存のレコードに接続するためのデータを生成します。

    ```typescript
    const author = await UserFactory.createForConnect();
    await PostFactory.create({ author: { connect: author } });
    ```

8. **データ構築のみ (`.build`, `.buildList`)**: DBに挿入せず、`create` に渡すためのデータオブジェクトだけを生成します。ネストしたデータ作成などに利用できます。

    ```typescript
    const data = await UserFactory.build();
    await prisma.user.create({ data });

    // 関連データの作成例
    await UserFactory.create({
      posts: {
        create: await PostFactory.buildList(2), // Postのデータだけを生成してUser作成時に渡す
      },
    });
    ```

9. **カスタムスカラー値生成:** `registerScalarFieldValueGenerator` で特定の型（`String`, `Int` など）の自動生成ルールをカスタマイズできます。

    ```typescript
    registerScalarFieldValueGenerator({
      String: ({ modelName, fieldName, seq }) => `${modelName}_${fieldName}_${seq}`,
    });
    ```

10. **トレイト (`traits`)**: 特定の属性の組み合わせを「トレイト」として定義し、 `.use(<traitName>)` で適用できます。状態（例: 退会済みユーザー）などを表現するのに便利です。

    ```typescript
    const UserFactory = defineUserFactory({
      traits: {
        withdrawal: {
          data: { name: "****", status: "WITHDRAWAL" },
        },
      },
    });
    await UserFactory.use("withdrawal").create();
    ```

11. **コールバック (`onAfterBuild`, `onBeforeCreate`, `onAfterCreate`)**: ファクトリー実行の前後に処理を挟むことができます。ファクトリーやトレイト内で定義可能です。

    ```typescript
    const UserFactory = defineUserFactory({
      onAfterCreate: async user => { /* 作成後の処理 */ },
    });
    ```

12. **一時フィールド (`transient fields`)**: スキーマにない一時的なパラメータをファクトリーに渡し、`defaultData` やコールバック内で利用できます。DBには保存されません。

    ```typescript
    const UserFactory = defineUserFactory.withTransientFields({ loginCount: 0 })(
      {
        defaultData: async ({ loginCount }) => { /* loginCount を利用 */ },
        onAfterCreate: async (user, { loginCount }) => { /* loginCount を利用 */ },
      }
    );
    await UserFactory.create({ loginCount: 10 }); // 一時フィールドを指定して作成
    ```

13. **フィールド値の優先順位:**
    1. `.create` / `.build` の引数
    2. 適用されたトレイト (`trait.data`)
    3. ファクトリーの `defaultData`
    4. `registerScalarFieldValueGenerator` による自動生成値（必須スカラー/Enumの場合）

### 3. ジェネレータ設定 (Generator configuration)

`schema.prisma` の `generator fabbrica` ブロックで以下のオプションが設定可能です。

* `output`: 生成ファイルの出力先ディレクトリ (デフォルト: `../src/__generated__/fabbrica`)
* `tsconfig`: 使用する `tsconfig.json` のパス
* `noTranspile`: `true` にすると `.ts` ファイルのみ生成し、 `.js` / `.d.ts` へのトランスパイルをスキップ

### 4. Tips

* **jest-prisma との連携:** `@quramy/jest-prisma` や `@quramy/jest-prisma-node` と連携可能。Jest設定の `setupFilesAfterEnv` に `@quramy/prisma-fabbrica/scripts/jest-prisma` を追加することで、テストトランザクション内でファクトリーが利用できるようになります。
* **TypeScript循環参照エラーの抑制:** ファクトリー間で相互参照が必要な場合、TypeScriptの循環参照エラーが発生することがあります。`FactoryInterface` 型と関数を利用することで回避できます。
* **ファクトリーインターフェースの型:** `UserFactoryInterface<TTransientFields, TTraitName>` のように、一時フィールドやトレイト名を型パラメータで指定できます（将来変更の可能性あり）。

### 5. バージョン互換性

* `@prisma/client >= 5.0.0` の場合: `@quramy/prisma-fabbrica@2.x.x` を使用
* `@prisma/client < 5.0.0` の場合: `@quramy/prisma-fabbrica@1.x.x` を使用

### 6. ライセンス

* MIT
