---
title: "✌️ About | ro"
source: "https://ro.samber.dev/docs/about"
author:
  - Samuel Berthe
published: 2025-10-24
created: 2025-10-27
description: |
  roは、GoのためのReactive Programmingライブラリ。ReactiveXパターンに触発され、Observableストリームを使った宣言的で合成可能なAPIをGoエコシステムに提供します。イベント駆動アプリケーション、非同期処理、データストリームの変換に最適化されたライブラリです。
tags:
  - Go
  - Reactive-Programming
  - Observable
  - ReactiveX
  - Event-Driven
  - Stream-Processing
  - async
  - library
---

## 概要

**ro**は、GoのためのReactive Programmingライブラリで、ReactiveXパターンに触発された`Observable`ストリームをGoエコシステムにもたらします。宣言的で合成可能なAPIを使ってデータストリームを扱うことができます。

`samber/ro`は、イベント版の`samber/lo`と言えます。

Reactive Programmingは、イベントをストリームとして扱い、それを観察、変換、合成できるようにするプログラミングパラダイムです。この考え方により、複雑なイベント駆動システムがより管理しやすく、保守しやすくなります。

## Reactive Programmingとは

### パラダイムシフト

Reactive Programmingは、イベント駆動アプリケーションと変更の伝播に焦点を当てたプログラミングパラダイムです。以下を可能にします：

- **非同期イベント**を自然で一貫した方法で処理
- データストリームを**宣言的に変換・合成**
- **バックプレッシャー**とリソース使用を効率的に管理
- **レスポンシブ**で回復力のあるアプリケーションを構築

## roを使う理由

### 1. イベント駆動ロジックの簡素化

複雑なコールバックチェーンを、クリーンで宣言的なストリーム操作に置き換えます：

```go
// ネストされたコールバックの代わりに
observable := ro.Pipe[int, string](
    ro.Just(0, 1, 2, 3, 4, 5),
    ro.Filter(func(x int) bool {
        return x%2 == 0
    }),
    ro.Map(func(x int) string {
        return fmt.Sprintf("even-%d", x)
    }),
)

subscription := observable.Subscribe(
    ro.NewObserver(
        func(v string) { ... },  // 値の受信時
        func(err error) { ... }, // エラー時
        func() { ... },          // 完了時
    ),
)
```

### 2. 強力なオペレーター

`ro`は、ストリーム操作のための豊富な[オペレーター](/docs/core/operators)を提供：

```go
// 複数のストリームを結合
combined := ro.Merge(stream1, stream2)

// エラーを優雅に処理
observable := ro.Pipe[string, string](
    combined,
    ro.Catch(func(err error) ro.Observable[string] {
        return ro.Just("fallback-value")
    }),
    ro.DelayEach(100 * time.Millisecond),
)

subscription := observable.Subscribe(
    ro.NewObserver(
        func(v string) { ... },  // 値の受信時
        func(err error) { ... }, // エラー時
        func() { ... },          // 完了時
    ),
)
```

### 3. リソース管理

**自動クリーンアップ**

自動クリーンアップとバックプレッシャー処理により、リソースリークを防ぎます。適切なリソース管理パターンについては[Subscription](/docs/core/subscription)を参照してください。

```go
// ストリームが完了したら自動的にキャンセル
observable := ro.Pipe[int64, int64](
    ro.Interval(1 * time.Second),
    ro.Take(10),
)

subscription := observable.Subscribe(
    ro.NewObserver(
        func(v int64) { ... },  // 値の受信時
        func(err error) { ... }, // エラー時
        func() { ... },          // 完了時
    ),
)
```

## 設計原則

### Go慣用的なAPI

ReactiveXや`rxjs`に触発されながらも、`ro`はGoの規約を採用：

- コンテキストを意識した操作
- 複数の戻り値によるエラー処理
- ゴルーチンセーフな設計
- 可能な限りホットパスでのゼロアロケーションと限定的なロック

### 型安全性

**コンパイル時の安全性**

強力な型付けにより、ランタイムエラーを防ぎ、より良いツールサポートを実現：

```go
// コンパイル時の型チェック
obs := ro.Just(1, 2, 3)             // Observable[int]
subscription := ro.Map(mapper)(obs) // mapperはfunc(int) Tでなければならない
```

`ro.Pipe`は`any`パラメータを受け取りますが、複数の型安全なバリアントが利用可能：

```go
obs := ro.Pipe3(
    ro.Range(0, 42),
    ro.Filter(func(x int64) bool {
        return x%2 == 0
    }),
    ro.Map(func(x int64) string {
        return fmt.Sprintf("even-%d", x)
    }),
    ro.Take[string](10),
)
```

### パフォーマンス重視

**パフォーマンス優先の設計**

高スループットシナリオ向けに設計：

- 最小限のアロケーション
- 効率的なバックプレッシャー伝播
- オペレーターフュージョンの機会
- ランタイムリフレクションゼロ
- 限定的なロック

## なぜこの名前なのか

`$o`と命名したかったのですが、Goはパッケージ名に特殊文字を使う準備ができていないようです😁。`ro`は`rx`に似た*短い名前*で、他のGoパッケージで使われていません。

## roをいつ使うか

`ro`は以下のシナリオで優れたパフォーマンスを発揮します：

- **リアルタイムデータ処理**（WebSocketイベント、センサーデータ）
- **ユーザーインターフェイスイベント**（クリック、キーストローク、フォーム入力）
- **APIレスポンス処理**（リトライ、タイムアウト、キャッシング付き）
- 変換、集計、エンリッチメントを伴う**データ処理**
- **イベント駆動**パターン

他のGoライブラリとの[比較](/docs/comparison/lo-vs-ro)も参照してください。

## まとめ

`ro`は、Reactive Programmingの優雅さと力をGoにもたらしながら、言語のコアとなる強み（シンプルさとパフォーマンス）を維持しています。イベント駆動アプリケーション、非同期処理、データストリーム変換を扱う際の強力なツールです。
