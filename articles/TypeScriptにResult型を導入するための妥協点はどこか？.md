---
title: "TypeScriptにResult型を導入するための妥協点はどこか？"
source: "https://zenn.dev/praha/articles/2eb151a891be16"
author:
  - "ゲントク"
published: 2025-10-15
created: 2025-10-21
description: |
  TypeScriptのResult型導入における現実的なアプローチを提案する記事。すべてのエラーをResult型に変換するのは非現実的であり、エラーハンドリングが必要なものとそうでないものを区別し、後者はUnexpectedErrorとしてまとめる手法を解説。Result型の導入コストと恩恵を比較し、適用すべきケースも考察。
tags:
  - "TypeScript"
  - "エラーハンドリング"
  - "Result型"
  - "型安全性"
  - "ベストプラクティス"
---

## 概要

この記事は、TypeScriptにおけるResult型の導入について、現実的な落とし所を提案するものです。すべてのエラー・例外をResult型に変換するのは非現実的であることを認識し、**エラーハンドリングが必要なものとそうでないものを区別し、後者はUnexpectedErrorとしてまとめる**という実用的なアプローチを提示しています。

使用ライブラリ:

- Result型実装: [@praha/byethrow](https://praha-inc.github.io/byethrow/)
- カスタムエラー定義: [@praha/error-factory](https://github.com/praha-inc/error-factory)

## TypeScriptにResult型を導入したくなる理由

### try...catchの問題点

TypeScriptの標準的なエラーハンドリング手法であるtry...catchには以下の課題があります:

1. **型シグネチャに例外の可能性が表れない**: 関数がthrowする可能性があるかどうかが型から分からない
2. **エラーの型が不明瞭**: catchブロックの`error`の型がunknown（設定によってはany）のため、エラーの種類に応じた適切なハンドリングができない
3. **エラーハンドリングの漏れが検出できない**: コンパイル時にエラーハンドリングの網羅性を保証できない
4. **制御フローの不明瞭さ**: try...catchブロックが散在し、コードの可読性が低下する

### Result型の恩恵

Result型を使うことで以下の恩恵が得られます:

- エラーの可能性が型として明示的に表現される
- エラーハンドリングの漏れをコンパイル時に検出できる
- 制御フローが明確になる

## TypeScriptでResult型を使う際の課題

### エコシステムの壁

TypeScriptの標準ライブラリにResult型は含まれず、多くのライブラリやWeb APIは例外をthrowする設計になっています。そのため、Result型を使うには:

1. 自作またはライブラリを利用してResult型を用意する
2. 例外をthrowする可能性がある箇所でtry...catchし、カスタムエラーを定義してResult型に変換する

### 実装例: ポケモンAPI呼び出し

記事では、ポケモンAPIを呼び出す`getPokemon`関数を例に、Result型の導入手順を詳細に解説しています。

#### ステップ1: 基本的な例外のResult型への変換

```typescript
class NetworkError extends ErrorFactory({
  name: 'NetworkError',
  message: 'ネットワークエラーが発生しました',
}) {}

class ParseJsonError extends ErrorFactory({
  name: 'ParseJsonError',
  message: 'JSONのパースに失敗しました',
}) {}

type GetPokemonError = NetworkError | ParseJsonError;

const getPokemon = async (pokemonName: string): Result.ResultAsync<Pokemon, GetPokemonError> => {
  const fetchResult = await fetchPokemon(pokemonName);
  if (Result.isFailure(fetchResult)) {
    return Result.fail(fetchResult.error);
  }

  const parseResult = await parsePokemon(fetchResult.value);
  if (Result.isFailure(parseResult)) {
    return Result.fail(parseResult.error);
  }

  return Result.succeed(parseResult.value);
}
```

#### ステップ2: バリデーションとHTTPステータスチェックの追加

```typescript
class ValidationError extends ErrorFactory({
  name: 'ValidationError',
  message: ({ details }) => `バリデーションエラーが発生しました: ${details}`,
  fields: ErrorFactory.fields<{ details: string }>(),
}) {}

class HttpError extends ErrorFactory({
  name: 'HttpError',
  message: ({ status }) => `HTTPエラーが発生しました: ${status}`,
  fields: ErrorFactory.fields<{ status: number }>(),
}) {}

type GetPokemonError = NetworkError | ParseJsonError | ValidationError | HttpError;
```

### 現実的でない課題

**エラー・例外が発生する可能性のあるコードはアプリケーションのいたるところに存在します。そのすべての箇所でヌケモレなく前述の対応をすることは困難**であり、開発・保守には非現実的なコストがかかります。

## TypeScriptにResult型を導入するための妥協点

### 核心的な問いかけ

**すべてのエラー・例外を個別のResult型に変換する必要はあるのでしょうか。個別のResult型にする意味があるエラー・例外と、そうでないエラー・例外とを区別できないでしょうか。**

この問いに答えることで、コードの可読性を保ちつつResult型の恩恵を享受できるアプローチが見えてきます。

## エラーハンドリングが必要な例外とそうでない例外を区別する

### 基本方針

エラーハンドリングが必要なエラー・例外のみを個別のResult型で扱い、ハンドリングする必要がないエラー・例外はUnexpectedErrorのResult型としてまとめる

### 実装方法

#### 1. カスタムエラーの分類

| カスタムエラー | ハンドリング必要性 | 理由 |
|------------|--------------|------|
| `ValidationError` | 必要 | ユーザーにフィードバックして修正を促す必要がある |
| `HttpError` | 必要 | ステータスコードに応じてユーザーにフィードバックする必要がある |
| `NetworkError` | 不要 | 具体的なエラー内容をユーザーにフィードバックしない |
| `ParseJsonError` | 不要 | 具体的なエラー内容をユーザーにフィードバックしない |

#### 2. UnexpectedErrorの定義

```typescript
class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: '予期しない例外が発生しました'
}) {}
```

#### 3. 改良された実装

```typescript
type GetPokemonError = ValidationError | HttpError | UnexpectedError;

const getPokemon = async (pokemonName: string): Result.ResultAsync<Pokemon, GetPokemonError> => {
  try {
    const validateResult = validatePokemonName(pokemonName)
    if (Result.isFailure(validateResult)) {
      return Result.fail(validateResult.error);
    }

    // ネットワークエラーの場合、UnexpectedError
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    const checkResult = checkHttpStatus(response)
    if (Result.isFailure(checkResult)) {
      return Result.fail(checkResult.error)
    }

    // JSONのパースエラーの場合、UnexpectedError
    const pokemon = await checkResult.value.json();

    return Result.succeed(pokemon);
  } catch(error) {
    return Result.fail(new UnexpectedError({ cause: error }));
  }
}
```

### このアプローチの利点

#### 1. 現実的な開発・保守コスト

呼び出し側でハンドリングしたいかどうかを判断基準にすることで、すべてのエラーを個別に変換する必要がなくなり、現実的なコストでResult型の恩恵を享受できます。

#### 2. クリーンなスタックトレース

`cause`プロパティを使うことで、アプリケーションコードを直接指し示すエラーで元のエラーをラップできます:

```typescript
// エラーが発生した場合
console.error(result.error); // UnexpectedError - アプリケーションコードを指すスタックトレース
console.error(result.error.cause); // 元のエラーの詳細情報
```

これにより、どこでエラーが発生したかが明確になり、デバッグが容易になります。

#### 3. 予期しないエラーの一元的な処理

UnexpectedErrorとしてまとめることで、予期しないエラーを一元的に処理できます:

```typescript
if (result.error instanceof UnexpectedError) {
  // 予期しないエラーはすべてログ収集サービスに送信
  logger.error('Unexpected error occurred', { error: result.error });
  // ユーザーには汎用的なエラーメッセージを表示
  showErrorMessage('エラーが発生しました。時間をおいて再度お試しください。');
}
```

## そもそもResult型が必要かどうかを考える

### Result型導入のコスト

Result型の導入には以下のコストがかかります:

- Result型のライブラリの学習コスト
- カスタムエラークラスの定義・保守コスト
- Result型を扱うためのコード記述の増加
- チームメンバー全員への周知と理解の促進

### Result型が適しているアプリケーション

以下のような特性を持つアプリケーションで恩恵が得られます:

#### 複雑なエラーハンドリングが必要

- ユーザー入力のバリデーション、外部API呼び出し、データベース操作など、多様なエラーケースが存在する
- エラーの種類に応じて異なるハンドリング（リトライ、ユーザーへのフィードバック、ログ記録など）が必要

#### 型安全性が重要

- エラーハンドリングの漏れがビジネスロジックに影響を与える可能性がある
- コンパイル時にエラーハンドリングの網羅性を保証したい

### try...catchで十分なケース

以下のようなシンプルなアプリケーションでは、従来のtry...catchの方がコストパフォーマンスが高い可能性があります:

- エラーハンドリングのパターンがシンプルで、ほとんどのエラーは同じように処理される
- エラーの種類が少なく、個別のハンドリングが必要なケースがほとんどない
- チームの規模が小さく、コードレビューでエラーハンドリングの漏れを十分に防げる

## 重要な結論

**Result型を導入することが目的化してしまい、不要な複雑性を追加してしまわないよう注意が必要です。まずは自分のアプリケーションの特性を分析し、Result型の導入が本当に価値をもたらすのかを慎重に検討することが大切です。**

エラーハンドリングが必要なエラーとそうでないエラーを区別し、UnexpectedErrorとしてまとめるアプローチは、Result型導入の現実的な妥協点として有効な選択肢となります。
