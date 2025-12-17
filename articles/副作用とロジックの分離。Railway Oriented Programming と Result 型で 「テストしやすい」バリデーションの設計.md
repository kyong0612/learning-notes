---
title: "副作用とロジックの分離。Railway Oriented Programming と Result 型で 「テストしやすい」バリデーションの設計"
source: "https://kaminashi-developer.hatenablog.jp/entry/typescript-rop-result-validation-design"
author:
  - "Shimmy (@naoya7076)"
  - "カミナシ エンジニアブログ"
published: 2025-12-16
created: 2025-12-17
description: |
  TypeScriptにおいてRailway Oriented Programming（ROP）とResult型を使用し、数百行に及ぶバリデーション処理を改善した実践的な事例。副作用とビジネスロジックを分離することで、テスト容易性と保守性を大幅に向上させたアーキテクチャ設計を解説。
tags:
  - TypeScript
  - Railway-Oriented-Programming
  - Result型
  - 関数型プログラミング
  - バリデーション
  - テスト設計
  - Redux
  - リファクタリング
---

## 概要

カミナシの「カミナシ レポート」における「ひな形編集」機能のバリデーション処理を、Railway Oriented Programming（ROP）とResult型を用いてリファクタリングした事例。約20種類のバリデーションが1つの巨大な関数に集約されていた状況を改善し、テスト容易性と保守性を向上させた。

---

## 改善前のコード：問題点の分析

### 改善前のバリデーション処理

```typescript
// paramsというのは複数のオブジェクトが集まった、とても大きい引数です
const validate = (dispatch, params): boolean => {
  let isValidated = true

  // パターン1: エラー時にフラグを変更
  if (params.templateData.name === '') {
    dispatch(setTemplateNameErrorMessage('ひな形名を入力してください'))
    isValidated = false
  }

  // パターン2: ループ内でエラーを見つけたら break
  for (const node of nodes) {
    if (node.question?.responseType == null) {
      dispatch(setPageErrorMessage('回答項目が設定されていません'))
      isValidated = false
      break
    }
  }

  // ... これが数百行続く

  return isValidated
}
```

### 問題点

| 問題 | 説明 |
|------|------|
| **手続き型の制御フロー** | `isValidated`フラグで状態管理しており、見通しが悪い |
| **副作用とロジックの密結合** | バリデーション判定と`dispatch`が混在し、テストにRedux storeのモックが必要 |
| **一貫性のないエラーハンドリング** | `break`で即終了するものと、全件チェックするものが混在 |
| **巨大なパラメータ** | 1つの大きなオブジェクトを渡すため、どのバリデーションが何を使っているか不明確 |

---

## Railway Oriented Programming（ROP）とは

### 概念

![Railway Oriented Programming概念図](https://cdn-ak.f.st-hatena.com/images/fotolife/k/kaminashi-developer/20251212/20251212235402.png)

ROPはScott Wlaschinが提唱したエラーハンドリングのパターンで、処理の流れを「鉄道のレール」に例えている：

- **成功の線路**: 処理が成功すれば次へ進む
- **失敗の線路**: エラーが発生したら失敗の線路に切り替わる

### 従来のtry-catchとの違い

| 従来（try-catch） | ROP |
|------------------|-----|
| 例外を`throw`する | **エラーも値として扱う** |
| 型システムで追跡しにくい | 成功と失敗を型で表現し、型システムによるチェックが効く |

### きっかけ

社内勉強会で読んでいた『[関数型ドメインモデリング](https://asciidwango.jp/post/754242099814268928/%E9%96%A2%E6%95%B0%E5%9E%8B%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)』が改善のきっかけになった。

---

## Result型の実装

### 基本的なResult型の定義

```typescript
export type Result<T, E> =
  | { readonly isOk: true; readonly value: T }
  | { readonly isOk: false; readonly error: E }

export const ok = <T = void>(value?: T): Result<T, never> =>
  ({ isOk: true, value: value as T }) as const

export const err = <E>(error: E): Result<never, E> =>
  ({ isOk: false, error }) as const
```

**ポイント**: TypeScriptの**判別可能なユニオン型**により、`isOk`の値で成功・失敗の型が自動的に絞り込まれる。

### バリデーション用エラー型

```typescript
export type ValidationError = {
  message: string
  type: 'template' | 'page' | 'hint' | 'reportName'
}

export type ValidationResult<T = void> = Result<T, ValidationError>
```

`type`フィールドでエラーを分類し、UIでエラーの表示内容を変えるために使用。

### なぜ自前実装なのか

- `neverthrow`や`fp-ts`などのライブラリが存在
- 今回は**限られた範囲での利用**だったため自前でResult型を実装

参考: [Result 型、自前で書くか、ライブラリ使うか - Speaker Deck](https://speakerdeck.com/majimaccho/result-xing-zi-qian-deshu-kuka-raiburarishi-uka)

---

## バリデーション関数の実装

### 個別のバリデーション関数

```typescript
export const validateTemplateHints = (
  templateHints: TemplateHint[],
): ValidationResult => {
  const hintsExist = templateHints.length !== 0
  const allHintsHaveName = templateHints.every(hint => hint.name !== '')

  if (hintsExist && !allHintsHaveName) {
    return err({ type: 'hint', message: 'ヒント名を入力してください' })
  }
  return ok()
}
```

**特徴**:

- **副作用なし**（`dispatch`を呼ばない）
- **統一されたResult型**を返す

---

## パイプラインの実装

### バリデーターの作成

```typescript
type Validator = () => ValidationResult

const createValidators = (p: ValidateParams): Validator[] => {
  return [
    () => validateTemplateName(p.templateName),
    () => validateTemplateHints(p.templateHints),
    () => validateResponseType(p.templateNodes),
    // ... 他のバリデーション
  ]
}
```

`createValidators`は**アダプター層**として機能し、大きな`ValidateParams`から必要なデータだけを抽出して各バリデーション関数に渡す。

### バリデーションの実行

```typescript
export const runValidations = (params: ValidateParams): ValidationError[] => {
  const validators = createValidators(params)

  return validators
    .map(validator => validator())     // すべて実行
    .filter(result => !result.isOk)    // 失敗だけ抽出
    .map(result => result.error)       // エラー情報を取り出す
}
```

---

## Reduxとの統合

### dispatchとの接続

```typescript
const dispatchError = (dispatch: Dispatch, error: ValidationError): void => {
  switch (error.type) {
    case 'template':
      dispatch(setTemplateNameErrorMessage(error.message))
      break
    case 'page':
      dispatch(setTemplatePageErrorMessage(error.message))
      break
    // ...
  }
}

export const validateAndDispatch = (
  dispatch: Dispatch,
  params: ValidateParams,
): boolean => {
  const errors = runValidations(params)

  if (errors.length > 0) {
    errors.forEach(error => dispatchError(dispatch, error))
    return false
  }
  return true
}
```

### 改善後のvalidate関数

```typescript
const validate = (
  dispatch: Dispatch<AnyAction>,
  params: ValidateParams,
): boolean => {
  return runValidateAndDispatch(dispatch, params)
}
```

**重要**: 引数と返り値の型は元のコードから変えることなく、内部実装を改善。

---

## 全体のアーキテクチャ

```
[ValidateParams (入力)]
    ↓
アダプター層: createValidators - 必要なパラメータを抽出
    ↓
バリデーション関数: validateTemplateName, validateTemplateHints
    ↓
エラーフィルタリング: runValidations
    ↓
dispatchマッピング: validateAndDispatch - 副作用はここだけ
    ↓
[boolean (成功/失敗)]
```

### アーキテクチャの特徴

| 特徴 | 説明 |
|------|------|
| **単一責務** | 各層が単一の責務を持つ |
| **一方向の依存** | 依存の方向が一方向 |
| **純粋な処理** | バリデーション関数はReduxやコンポーネントの知識を持たない |
| **副作用の局所化** | 副作用は最後の`dispatchマッピング`層に押し込められている |

---

## 改善の効果

### 1. テストが書きやすくなった

**改善前**（Reduxのモックが必要、巨大なパラメータ）:

```typescript
const mockDispatch = jest.fn()
validate(mockDispatch, hugeParams)  // hugeParamsには使わないプロパティも含む
expect(mockDispatch).toHaveBeenCalledWith(...)
```

**改善後**（純粋関数、モック不要）:

```typescript
const templateHints: TemplateHint[] = [
  { name: 'ヒント1' },
  { name: 'ヒント2' },
]
const result = validateTemplateHints(templateHints)
expect(result.isOk).toBe(true)
```

**メリット**:

- モック不要
- 引数が少なくて済む
- 結果を「値」として受け取れる

### 2. 依存関係が明確になった

**改善前**: 関数内でどのパラメータを使っているか、コードを読まないとわからない

```typescript
validate(dispatch, params)
```

**改善後**: 関数シグネチャで必要なデータが一目瞭然

```typescript
validateTemplateName(templateName)     // ひな形名だけ必要
validateTemplateHints(templateHints)   // ヒント配列だけ必要
```

### 3. 新しいバリデーションの追加が簡単

```typescript
return [
  () => validateTemplateHints(templateHints),
  // 新しいバリデーションを追加するだけ
  () => validateNewFeature(p.someData),
]
```

---

## AIとの関わり方とエンジニアの学習について

### AIを活用したポイント

今回の実装ではAIを最大限に活用：

- Result型を使ったバリデーション関数の実装
- パイプラインの構築
- テストの作成

### 効果的なAI指示の重要性

**曖昧な指示**:
> 「見通しが悪いからリファクタリングして」

→ 別の形の「見通しの悪いコード」を生成するリスク

**具体的な指示**:
> 「Railway Oriented ProgrammingとResult型を使ってリファクタリングして」

→ 的確な回答を得られる

### 学びの源泉

| 知識の源 | 得た知見 |
|---------|---------|
| 社内勉強会（『関数型ドメインモデリング』） | ROP |
| TSKaigiの登壇資料 | Result型の自前実装 |

**結論**: AI時代だからこそ、エンジニアの学びの価値はむしろ高まっている。

---

## 重要な結論・発見

1. **副作用とロジックの分離**がテスト容易性と保守性を大幅に向上させる
2. **Result型**によりエラーを値として扱うことで、型システムによるチェックが効く
3. **パイプラインパターン**により、バリデーションの追加・変更が容易になる
4. **アダプター層**を設けることで、大きな入力パラメータから必要なデータだけを抽出できる
5. **AIへの指示**は具体的なアーキテクチャパターンを指定することで質の高い結果を得られる

---

## 参考資料

- [『関数型ドメインモデリング』](https://asciidwango.jp/post/754242099814268928/%E9%96%A2%E6%95%B0%E5%9E%8B%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
- [Railway Oriented Programming - SlideShare](https://www.slideshare.net/slideshow/railway-oriented-programming/32242318)
- [Result 型、自前で書くか、ライブラリ使うか - Speaker Deck](https://speakerdeck.com/majimaccho/result-xing-zi-qian-deshu-kuka-raiburarishi-uka)
- [Sansan Builders Box - 関連記事](https://buildersbox.corp-sansan.com/entry/2024/03/26/110000)
- [バリデーションとパースの分離。Goで実装する「変更に強い」CSV 処理の設計](https://kaminashi-developer.hatenablog.jp/entry/go-csv-import-design)
