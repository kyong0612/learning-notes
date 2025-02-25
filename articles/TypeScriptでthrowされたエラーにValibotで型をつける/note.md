# TypeScriptでthrowされたエラーにValibotで型をつける

ref: <https://zenn.dev/anatoo/articles/a708b00171f758>

TypeScriptには、かならず `unknown` な型が割り当てられる値があります。それはthrowされた値です。

```typescript code-line
try {
  doSomething();
} catch (error) {
  // ここではerrorはunknown型になる
}

```

JavaScriptでは Errorオブジェクトに限らずどのような値でもthrowすることができるので、catchで捉えた値には必然的に `unknown` 型が割り当てられます。

勿論、下のコードのようにinstanceofを使ってnarrowing(絞り込み)をすることはできるのですが、Errorに限らず細かくエラーハンドリングしたい時に少し困りますよね。

```typescript code-line
try { ... } catch (error) {
  if (error instanceof Error) {
    // Error型がつく
  }
}

```

そこで一つの選択肢としてオススメしたいのは、 [Valibot](https://valibot.dev/) を使った型の割り付けです。Valibotは、ユーザーから入力された値や外部のAPIから帰ってきた値の検証などによく使いますが、ここではthrowされた値を検証して型をつけるのに使います。 [zod](https://github.com/colinhacks/zod) でも同じことができますが、筆者はvalibotの方が好きなのでこの記事ではvalibotを使います。

まずvalibotで型として割り当てたい値のスキーマを記述します。

```typescript code-line
import * as v from 'valibot';

const MyErrorSchema = v.object({
  status: v.number(),
});

```

そして、 `catch` 節の `v.is(MyErrorSchema, error))` で検証することによって静的な型がつくようになります。

```typescript code-line
try {
  doSomething();
} catch (error) {
  if (v.is(MyErrorSchema, error)) {
    // { status: number } の型が推論される
    console.error("ERROR: ", error.status);
  } else {
    // 判断つかないエラーは再度throwするなりなんなりする
    throw error;
  }
}

```

これを用いることで `unknown` なエラーをそのまま扱うのではなく厳格に型をつけてコードが書けるようになりました。

`catch` でエラーハンドリングするとき `unknown` な値を扱わないといけないので微妙に嫌なんだよなあという地味なストレスがこの方法で解消できますので選択肢の一つとして検討してみてください。そんじゃーね！
