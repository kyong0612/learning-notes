---
title: "Go 1.25 interactive tour"
source: "https://antonz.org/go-1-25/#reflective-type-assertion"
author:
  - "[[Anton Zhiyanov]]"
published: 2025-06-26
created: 2025-07-01
description: |
  Go 1.25 is scheduled for release in August, so it's a good time to explore what's new. This article provides an interactive version of the release notes with lots of examples showing what has changed and what the new behavior is.
tags:
  - "Go"
  - "Go1.25"
  - "release-notes"
  - "programming"
  - "clippings"
---

Go 1.25は8月にリリース予定であり、新機能を探る良い機会です。公式の[リリースノート](https://tip.golang.org/doc/go1.25)は非常に簡潔なため、何が変更され、新しい動作がどのようなものかを示す多くの例を含むインタラクティブなバージョンを用意しました。

> この記事は、The Go Authorsによる公式リリースノートに基づいており、BSD-3-Clauseライセンスの下でライセンスされています。これは網羅的なリストではありません。完全なリストについては、公式リリースノートを参照してください。

説明されている機能の提案（𝗣）とコミット（𝗖𝗟）へのリンクを提供します。動機や実装の詳細については、そちらをご確認ください。

簡潔にするため、エラーハンドリングはしばしば省略されています。本番環境では行わないでください ツ

## テスト用の合成時間 (Synthetic time for testing)

新しい `synctest` パッケージにより、偽のクロックを使用してテストを実行できます。これにより、`time.After` のような時間ベースの関数に依存するタイムアウトのシナリオを、実際に待つことなく即座にテストできます。

```go
func TestReadTimeout(t *testing.T) {
    synctest.Test(t, func(t *testing.T) {
        ch := make(chan int)
        _, err := Read(ch)
        if err == nil {
            t.Fatal("expected timeout error, got nil")
        }
    })
}
```

この機能は、バブル内のすべてのゴルーチンがブロックされると時間を進めることで機能します。

𝗣 [67434](https://go.dev/issue/67434), [73567](https://go.dev/issue/73567) • 𝗖𝗟 [629735](https://go.dev/cl/629735), [629856](https://go.dev/cl/629856), [671961](https://go.dev/cl/671961)

## JSON v2

`encoding/json/v2` はメジャーアップデートであり、多くの破壊的変更が含まれています。最も印象的な機能の1つは、カスタムマーシャラーです。`MarshalToFunc` と `UnmarshalFromFunc` を使用して、カスタム型を作成せずに特定の型のマーシャリング方法を定義できます。

```go
// Marshals boolean values to ✓ or ✗.
boolMarshaler := json.MarshalToFunc(
    func(enc *jsontext.Encoder, val bool) error {
        if val {
            return enc.WriteToken(jsontext.String("✓"))
        }
        return enc.WriteToken(jsontext.String("✗"))
    },
)

// Combine and use marshalers
vals := []any{true, "off", "hello"}
marshalers := json.JoinMarshalers(boolMarshaler, /*...*/)
data, _ := json.Marshal(vals, json.WithMarshalers(marshalers))
fmt.Println(string(data)) // ["✓","✗","hello"]
```

𝗣 [63397](https://go.dev/issue/63397), [71497](https://go.dev/issue/71497)

## コンテナ対応の GOMAXPROCS (Container-aware GOMAXPROCS)

Goランタイムは、cgroupsによって設定されたCPUクォータを尊重するようになりました。`GOMAXPROCS` のデフォルト値は、ホストの論理CPU数またはcgroupのCPU制限のいずれか低い方に設定されます。

```bash
# Before 1.25
$ docker run --cpus=4 golang:1.24-alpine go run /app/nproc.go
NumCPU: 8
GOMAXPROCS: 8

# Go 1.25
$ docker run --cpus=4 golang:1.25rc1-alpine go run /app/nproc.go
NumCPU: 8
GOMAXPROCS: 4
```

新しい `runtime.SetDefaultGOMAXPROCS` 関数により、手動設定を元に戻し、ランタイムのデフォルト値に戻すことができます。

𝗣 [73193](https://go.dev/issue/73193) • 𝗖𝗟 [668638](https://go.dev/cl/668638), [670497](https://go.dev/cl/670497), [672277](https://go.dev/cl/672277), [677037](https://go.dev/cl/677037)

## Green Tea ガベージコレクタ

Green Teaは、多数の小さなオブジェクトを作成し、多くのCPUコアを持つ最新のコンピュータで実行されるプログラム向けに最適化された、実験的な新しいガベージコレクタです。個々のオブジェクトではなく、より大きな連続したメモリブロック（スパン）をスキャンすることで、GCのオーバーヘッドを10〜40%削減することが期待されています。

ビルド時に `GOEXPERIMENT=greenteagc` を設定することで有効にできます。

𝗣 [73581](https://go.dev/issue/73581)

## CSRF保護 (CSRF protection)

新しい `http.CrossOriginProtection` 型は、安全でないクロスオリジンのブラウザリクエストを拒否することで、クロスサイトリクエストフォージェリ（CSRF）攻撃に対する保護を実装します。`Sec-Fetch-Site` ヘッダーや `Origin` と `Host` ヘッダーの比較によってクロスオリジンリクエストを検出します。

```go
antiCSRF := http.NewCrossOriginProtection()
antiCSRF.AddTrustedOrigin("https://example.com")
srv := http.Server{
    Addr:    ":8080",
    Handler: antiCSRF.Handler(mux),
}
```

𝗣 [73626](https://go.dev/issue/73626) • 𝗖𝗟 [674936](https://go.dev/cl/674936), [680396](https://go.dev/cl/680396)

## WaitGroup.Go

新しい `WaitGroup.Go` メソッドは、待機グループのカウンタを自動的にインクリメントし、ゴルーチンで関数を実行し、完了時にカウンタをデクリメントします。これにより、`Add()` と `Done()` の手動呼び出しが不要になります。

```go
var wg sync.WaitGroup
wg.Go(func() { fmt.Println("go is awesome") })
wg.Go(func() { fmt.Println("cats are cute") })
wg.Wait()
```

𝗣 [63796](https://go.dev/issue/63796) • 𝗖𝗟 [662635](https://go.dev/cl/662635)

## フライトレコーディング (Flight recording)

新しい `trace.FlightRecorder` 型は、実行トレースの移動ウィンドウを追跡し、常に最新のトレースデータを保持します。これにより、予期しないイベントが発生した場合でも、その直前のプログラムの動作を記録・分析できます。

```go
rec := trace.NewFlightRecorder(cfg)
rec.Start()
defer rec.Stop()
// ... application code ...
// On important event, save snapshot
file, _ := os.Create("/tmp/trace.out")
rec.WriteTo(file)
```

𝗣 [63185](https://go.dev/issue/63185) • 𝗖𝗟 [673116](https://go.dev/cl/673116)

## その他のos.Rootメソッド (More Root methods)

`os.Root` 型に、`os` パッケージの既存の関数と同様の多くの新しいメソッド（`Chmod`, `Chown`, `MkdirAll`, `RemoveAll`, `WriteFile` など）が追加され、特定のディレクトリツリー内でのファイル操作がより安全かつ簡単になりました。

𝗣 [49580](https://go.dev/issue/49580), [67002](https://go.dev/issue/67002), [73126](https://go.dev/issue/73126)

## リフレクションによる型アサーション (Reflective type assertion)

新しいジェネリック関数 `reflect.TypeAssert` を使用して、`reflect.Value` を特定の型に変換できます。これは、`Value.Interface()` と型アサーションを組み合わせるよりも慣用的で、不要なメモリ割り当てを回避します。

```go
// Before
person, _ := aliceVal.Interface().(Person)
// After
person, _ := reflect.TypeAssert[Person](aliceVal)
```

𝗣 [62121](https://go.dev/issue/62121) • 𝗖𝗟 [648056](https://go.dev/cl/648056)

## テスト属性など (Test attributes and friends)

* `T.Attr`: テストにキーと値のペアで追加情報（イシューへのリンクなど）を付加できます。
* `T.Output`: テストが使用する出力ストリーム（`io.Writer`）にアクセスでき、アプリケーションのログをテストログにリダイレクトするのに役立ちます。
* `testing.AllocsPerRun`: 並列テスト中に呼び出されるとパニックを起こすようになり、不安定な結果を防ぎます。

𝗣 [43936](https://go.dev/issue/43936), [59928](https://go.dev/issue/59928), [70464](https://go.dev/issue/70464)

## ログ記録のためのグループ化された属性 (Grouped attributes for logging)

新しい `slog.GroupAttrs` 関数は、`[]slog.Attr` のスライスからグループを作成できるため、属性を事前に収集してからログに記録するのが簡単になります。

```go
attrs := []slog.Attr{
    slog.Int("value", 1000),
    slog.String("currency", "USD"),
}
logger.Info("deposit", slog.GroupAttrs("amount", attrs...))
```

𝗣 [66365](https://go.dev/issue/66365) • 𝗖𝗟 [672915](https://go.dev/cl/672915)

## ハッシュクローナ (Hash cloner)

新しい `hash.Cloner` インターフェースは、現在の状態のコピーを返すことができるハッシュ関数を定義します。標準ライブラリのすべての `hash.Hash` 実装がこのインターフェースを実装しました。

```go
h1 := sha3.New256()
h1.Write([]byte("hello"))

clone, _ := h1.Clone()
h2 := clone.(*sha3.SHA3) // h2 has the same state as h1
```

𝗣 [69521](https://go.dev/issue/69521) • 𝗖𝗟 [675197](https://go.dev/cl/675197)

## 最終的な考察

Go 1.25は、並行コードのテストサポートを確定させ、大規模な実験的JSONパッケージを導入し、新しいGOMAXPROCS設計とガベージコレクタでランタイムを改善しました。また、フライトレコーダー、最新のCSRF保護、待望のWaitGroupショートカットなど、いくつかの改良も加えられています。全体として、素晴らしいリリースです！
