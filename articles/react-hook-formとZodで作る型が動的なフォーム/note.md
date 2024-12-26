# react-hook-formとZodで作る型が動的なフォーム

ref: <https://tech.buysell-technologies.com/entry/2023/04/03/000000>

## 概要

APIから取得したデータに基づいて、フォームの構造を動的に生成する方法を紹介。React Hook Form (RHF) と Zod を活用して、柔軟かつ型安全なフォームを実現します。

## 対象読者

- React Hook Form × Zodでのフォーム実装経験があるエンジニア
- 動的なフォーム構築に興味があるエンジニア

## 動的フォームの構築方法

### 通常のZod Schemaが使用できない理由

- RHFでは、フィールドのキー（key）と値（value）が固定されている必要がある。
- 動的フォームでは、APIから提供されるデータに応じてキーと値が動的に決まるため、通常の固定的なSchema定義が適用できない。

例:

```typescript
const formSchema = z.object({
  username: z.string(),
  age: z.number(),
});
```

### 解決策: Discriminated Unionの活用

- Zodの discriminatedUnion 機能を利用して、動的にSchemaを切り替える。

例:

```typescript
const fieldsetSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('TEXT'), payload: z.string() }),
  z.object({ type: z.literal('NUMBER'), payload: z.number().nullable() }),
  z.object({ type: z.literal('SELECT'), payload: z.string() }),
  z.object({ type: z.literal('SINGLE_CHECKBOX'), payload: z.boolean() }),
]);

const formSchema = z.record(fieldsetSchema);
```

## 作成した動的フォームの要件

- APIから以下のようなデータを取得し、動的にマッピングする。

```typescript
const API_MOCKDATA = [
  { id: 1, type: 'TEXT', payload: { name: 'username', label: 'ユーザー名' } },
  { id: 2, type: 'NUMBER', payload: { name: 'age', label: '年齢' } },
  { id: 3, type: 'SELECT', payload: { name: 'country', label: '国籍', options: [...] } },
];
```

- このデータに基づいて、フォームを動的に生成。

## 実装の詳細

### Schema定義

RHFとZodを連携させるためのSchemaを定義。

```typescript
const formSchema = z.record(fieldsetSchema);
export const resolver = zodResolver(formSchema);
```

Formコンポーネント

- APIから取得したデータを整形し、初期値を設定。
- 各フィールドはFieldsetFactoryで動的にレンダリング。

例:

```typescript
export const Form = () => {
  const initialValue = API_MOCKDATA.reduce((acc, cur) => {
    acc[cur.payload.name] = { type: cur.type, payload: null };
    return acc;
  }, {});

  const methods = useForm({
    resolver,
    defaultValues: initialValue,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {API_MOCKDATA.map((props) => (
          <FieldsetFactory key={props.id} {...props} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};
```

FieldsetFactoryコンポーネント

type に基づいて適切なフィールドを生成。

```typescript
export const FieldsetFactory = ({ type, payload }) => {
  switch (type) {
    case 'TEXT':
      return <TextField {...payload} />;
    case 'NUMBER':
      return <NumberField {...payload} />;
    default:
      return null;
  }
};
```

各フィールドの定義

例: NumberField

```typescript
export const NumberField = ({ name, label }) => {
  const { field } = useController({ name });
  return (
    <fieldset>
      <legend>{label}</legend>
      <input type="number" {...field} />
    </fieldset>
  );
};
```

## 実装過程での課題と解決策

 1. Controlled Formによるパフォーマンス問題

- Controlled Formは必須だが、再レンダリングの負荷が高い。
- 解決策: 再レンダリングを最小限に抑えるため、useWatch や useFormContext を活用。

 2. Union型の特定

- 動的に型を特定するために、Extract を活用。

```typescript
export type FormSchema<
  T extends InputSchema[string]['type'] = InputSchema[string]['type'],
  U extends InputSchema[string] = InputSchema[string]
> = Record<string, Extract<U, { type: T }>>;
```

## まとめ

- React Hook FormとZodを活用することで、APIデータに基づく動的フォームを構築可能。
- Discriminated UnionとZodの組み合わせにより、柔軟性と型安全性を両立。
- 本手法は、Google Formsのような複雑なフォームにも応用可能。
