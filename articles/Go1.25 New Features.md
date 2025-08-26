---
title: "Go1.25 New Features"
source: "https://zenn.dev/koya_iwamura/articles/ea2cf191cdcb2a"
author:
  - "Koya IWAMURA"
published: 2025-08-23
created: 2025-08-26
description: |
  Go1.25が8月13日にリリースされ、リリースノートやブログが公開されています。この記事では前回のGo1.24 New Featuresに引き続き、Go1.25の新機能の中から気になった機能を紹介していきます。
tags:
  - "Go"
  - "golang"
---
Go1.25が8月13日にリリースされ、[リリースノート](https://go.dev/doc/go1.25) や [ブログ](https://go.dev/blog/go1.25) が公開されています。この記事では前回の [Go1.24 New Features](https://zenn.dev/koya_iwamura/articles/ca9ab62ff760c2) に引き続き、Go1.25の新機能の中から気になった機能を紹介していきます。

<https://go.dev/doc/go1.25>

## spec

Go1.25では既存のGoのコードに影響を与える [言語仕様](https://go.dev/ref/spec) の変更はありません。ただし、core typeの概念が削除され、専用の文章に置き換えられました。
詳細については、公式ブログをご参照ください。
<https://go.dev/blog/coretypes>
<https://go.dev/issue/70128>

## tools

### go command

`go build -asan` オプションは、プログラム終了時にデフォルトでメモリリークを検出するようになりました。
これは、Cによって割り当てられたメモリが解放されず、CまたはGoによって割り当てられた他のメモリから参照されていない場合にエラーを出します。
このエラーは、 `ASAN_OPTIONS=detect_leaks=0` を設定することで無効にできます。
<https://github.com/golang/go/issues/67833>

---

事前にビルドされたツールが一部 [リリース](https://go.dev/dl/) に含まれなくなります。コンパイラやリンカなどのコアツールチェーンのバイナリは引き続き含まれますが、ビルドやテスト、フォーマットで頻繁に呼び出されないツールは含まれません。

削除対象となるツールは `addr2line` 、 `buildid` 、 `nm` 、 `objdump` 、 `pprof` 、 `test2json` 、 `trace` などです。これらのツールのソースコードは引き続きGOROOTに含まれるため、初回実行時に自動的にビルドされ、キャッシュされます。既存のワークフローに影響を与えることなく、配布パッケージのサイズを大幅に縮小することが可能になります。
参考としてgo1.x.linux-amd64.tar.gzのサイズは [1.24.0](https://go.dev/dl/#go1.24.0) が75MBなのに対し、 [1.25.0](https://go.dev/dl/#go1.25.0) が57MBと削減されています。
<https://go.dev/issue/71867>
<https://github.com/golang/go/blob/go1.25.0/src/cmd/dist/build.go#L1396-L1406>

---

新しい `go.mod` の `ignore` [ディレクティブ](https://go.dev/ref/mod#go-mod-file-ignore) を使用して、 `go` コマンドが無視するディレクトリを指定できます。指定したディレクトリとそのサブディレクトリ内のファイルは、 `all` や`./...`などのパターンにマッチするとき無視されますが、モジュールのzipファイルには引き続き含まれます。

この機能は、多言語プロジェクトにおいて特に有用です。例えば、 `node_modules` やBazelが生成する `bazel-*` ディレクトリなど、大量のファイルを含むディレクトリがある場合、 `go build ./...`や `go test ./...`の実行時間を大幅に短縮できます。また、 `gopls` のCPU使用率も改善されます。

**使用例**

```go
// go.mod
module example.com/myproject

go 1.25

ignore node_modules
ignore bazel-*
ignore .build
```

<https://go.dev/issue/42965>

---

新しい `go doc -http` オプションは、要求されたオブジェクトのドキュメントを表示するドキュメントサーバーを起動し、ブラウザでドキュメントを表示します。
<https://go.dev/issue/68106>

---

新しい `go version -m -json` オプションは、指定されたGoのバイナリファイルに埋め込まれたビルド情報（ `runtime/debug.BuildInfo` ）をJSON形式で出力します。

```go
type BuildInfo struct {
    GoVersion string        // Goのバージョン（例: "go1.25.0"）
    Path      string        // メインモジュールのパス
    Main      Module        // メインモジュールの情報
    Deps      []*Module     // 依存関係のスライス
    Settings  []BuildSetting // ビルド設定（CGOの状態、アーキテクチャなど）
}
```

<https://go.dev/issue/69712>

---

`go` コマンドは、 `<meta name="go-import" content="root-path vcs repo-url subdir">` 構文を使用して [モジュールパスを解決](https://go.dev/ref/mod#vcs-find) する際に、リポジトリのサブディレクトリをモジュールルートのパスとして使用できるようになりました。これにより、 `root-path` がバージョン管理システム `vcs` を持つ `repo-url` の `subdir` に対応することを示します。
特に単一のリポジトリ内で複数のGoモジュールを管理し、それぞれに異なるカスタムインポートパスを割り当てることが可能になるため、マイクロサービスアーキテクチャやモノレポ構成において有用です。

**`meta go-import` の設定方法**

`meta go-import` タグは、カスタムインポートパスを設定するためのHTMLのmetaタグで、Webサーバーのレスポンスの `<head>` セクションに記載します。

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="go-import" content="example.com/mymodule git https://github.com/user/mymodule">
</head>
<body>
    <p>Go to <a href="https://github.com/user/mymodule">GitHub repository</a></p>
</body>
</html>
```

**動作**

1. ユーザーが `go get example.com/mymodule` を実行
2. Goコマンドが `https://example.com/mymodule?go-get=1` にHTTPリクエストを送信
3. サーバーがmetaタグを含むHTMLを返却
4. Goコマンドがmetaタグの情報を使って実際のリポジトリからコードを取得

<https://go.dev/issue/34055>

---

新しい `work` パッケージパターンは、work（以前はmainと呼ばれていた）モジュール内のすべてのパッケージにマッチします。

**使用例**

```shell
# workモジュール内のすべてのパッケージをビルド
go build work

# workモジュール内のすべてのパッケージをテスト
go test work

# workモジュール内のすべてのパッケージをベット
go vet work
```

**モジュールモードとワークスペースモードでの挙動の違い**

- **モジュールモード**
  - `work` は現在のモジュール内のすべてのパッケージを対象とする
  - `go.mod` ファイルで定義されたメインモジュールのパッケージのみ
- **ワークスペースモード**
  - `work` はワークスペース内のすべてのモジュールのパッケージを対象とする
  - `go.work` ファイルで定義された複数モジュールのパッケージすべて

<https://go.dev/issue/71294>

---

goコマンドが `go.mod` または `go.work` ファイルの `go` ディレクティブを更新する際、コマンドの現在のバージョンを指定するtoolchainディレクティブを追加しなくなりました。
<https://go.dev/issue/65847>

### vet

`go vet` コマンドに新しいアナライザが含まれます。

[waitgroup](https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/waitgroup): [`sync.WaitGroup.Add`](https://go.dev/pkg/sync#WaitGroup.Add) を不適切に使用している場合に検出されます。

**問題のあるコード**

```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    go func() {
        wg.Add(1)        // NG: goroutine内でAdd()
        defer wg.Done()
        // 処理
    }()
}
wg.Wait() // すべてのgoroutineが開始される前に完了する可能性
```

**正しいコード**

```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)           // OK: goroutine開始前にAdd()
    go func() {
        defer wg.Done()
        // 処理
    }()
}
wg.Wait() // 確実にすべてのgoroutineを待機
```

<https://go.dev/issue/18022>

[hostport](https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/hostport): `fmt.Sprintf("%s:%d", host, port)` の形式で [`net.Dial`](https://go.dev/pkg/net#Dial) 用アドレスを構築している場合に、 [`net.JoinHostPort`](https://go.dev/pkg/net#JoinHostPort) を代わりに提案します。これは前者がIPv6アドレスを扱う際に、省略記法により意図しない表記をしてしまう可能性があるためです。

```go
// 問題のあるコード
addr := fmt.Sprintf("%s:%d", host, port)

// 正しいコード
addr := net.JoinHostPort(host, strconv.Itoa(port))
```

<https://go.dev/issue/28308>

## runtime

`GOMAXPROCS` のデフォルト動作が変更されました。Goの以前のバージョンでは、 `GOMAXPROCS` は起動時に利用可能な論理CPU数（ [`runtime.NumCPU`](https://go.dev/pkg/runtime#NumCPU) ）がデフォルトで設定されていました。Go1.25では2つの変更点が追加されています。

1. Linuxでは、ランタイムはプロセスを含む [cgroupのCPU帯域幅制限](https://docs.kernel.org/scheduler/sched-bwc.html) を考慮します。CPU帯域幅制限によるCPU数が論理CPU数より低い場合、 `GOMAXPROCS` はより低い値に設定されます。Kubernetesなどのコンテナランタイムシステムでは、cgroupのCPU帯域幅制限は一般的に「CPU limit」オプションに対応します。「CPU requests」オプションは考慮しません。
2. すべてのOSで、論理CPU数やcgroupのCPU帯域幅制限が変更された場合、ランタイムは定期的に `GOMAXPROCS` を更新します。

これらの動作は両方とも、 `GOMAXPROCS` 環境変数または [`runtime.GOMAXPROCS`](https://go.dev/pkg/runtime#GOMAXPROCS) によって手動で `GOMAXPROCS` が設定されている場合、自動的に無効になります。 [GODEBUGの設定](https://go.dev/doc/godebug) `containermaxprocs=0` と `updatemaxprocs=0` でそれぞれ明示的に無効にすることもできます。

更新されたcgroup制限の読み取りをサポートするため、ランタイムはプロセスの存続期間中、cgroupファイル用にキャッシュされたファイルディスクリプタを保持します。

詳しくは公式ブログをご参照ください。
<https://go.dev/blog/container-aware-gomaxprocs>

<https://go.dev/issue/73193>

---

既存のガベージコレクタの一部を置き換える新しいガベージコレクタが実験的に利用できるようになりました。このガベージコレクタの設計は、より良い局所性とCPUスケーラビリティを通じて小さなオブジェクトのマーキングとスキャンの性能を向上させます。ベンチマーク結果は様々ですが、ガベージコレクションを頻繁に実行する実際的なプログラムでは、ガベージコレクションのオーバーヘッドが10〜40%程度削減される見込みです。

新しいガベージコレクタは、ビルド時に `GOEXPERIMENT=greenteagc` を設定して有効化できます。

ちなみに新しいガベージコレクタはGreen Teaと呼ばれていて、命名の由来はメインで実装した [Austin Clements](https://github.com/aclements) 氏が、日本滞在中に毎日抹茶を飲みながらアルゴリズム開発の進捗を多く生めたからだそうです。
<https://changelog.com/gotime/333#transcript-39>

上記のGo Timeやプロポーザルでも言及されていますが、SIMDの活用などまだまだ改善する余地があるとのことで、今後さらにパフォーマンスの改善が期待できそうです。

<https://go.dev/issue/73581>

---

[ランタイムの実行トレース](https://go.dev/pkg/runtime/trace) は長い間、アプリケーションの低レベル動作を理解し、デバッグするための強力で負荷の高い手段を提供してきました。しかしながら、実行トレースを継続的にファイルに書き込むコストとそのサイズのため、一般的に稀にしか発生しないイベントのデバッグでは実用的ではありませんでした。

新しい [`runtime/trace.FlightRecorder`](https://go.dev/pkg/runtime/trace#FlightRecorder) は、トレースをメモリ内のリングバッファに継続的に記録することで、ランタイムの実行トレースをキャプチャする軽量な手段を提供します。重要なイベントが発生した際、プログラムは [`FlightRecorder.WriteTo`](https://go.dev/pkg/runtime/trace#FlightRecorder.WriteTo) を呼び出し、過去数秒間のトレースをファイルに書き込むことができます。

[`FlightRecorder`](https://go.dev/pkg/runtime/trace#FlightRecorder) によってキャプチャされる時間の長さとデータ量は、 [`FlightRecorderConfig`](https://go.dev/pkg/runtime/trace#FlightRecorderConfig) 内で設定できます。

**使用例**

```go
// フライトレコーダーの設定と開始
recorder := trace.NewFlightRecorder(
    trace.FlightRecorderConfig{
        MinAge: 5 * time.Second, // 過去5秒間のトレースを保持
        MaxBytes: 0,             // 0の場合サイズ上限なしで保持
    },
)
recorder.Start()
defer recorder.Stop()

// 問題検出時にトレースを保存
file, _ := os.Create("trace.out")
recorder.WriteTo(file)
```

<https://go.dev/issue/63185>

---

panicをrecover後に再びpanicが発生し、recoverしないままプログラムが終了する場合に出力されるメッセージは、出力する値が同じであれば繰り返し表示されなくなりました。

Go1.25以前は以下のように出力していました。

```
    panic: PANIC [recovered]
      panic: PANIC
```

Go1.25からは以下のようにされます。

```
    panic: PANIC [recovered, repanicked]
```

出力する値が異なれば従来通りのメッセージが出力されます。

```
    panic: PANIC1 [recovered]
      panic: PANIC2
```

<https://go.dev/issue/71517>

---

匿名仮想メモリ領域（VMA: Virtual Memory Area）名のカーネルサポート（ `CONFIG_ANON_VMA_NAME` ）があるLinuxでは、Goランタイムは匿名メモリマッピングにその目的に関する情報を付加するようになります。例えば、ヒープメモリに対して `[anon: Go: heap]` のような具合です。これは [GODEBUGの設定](https://go.dev/doc/godebug) `decoratemappings=0` で無効にできます。

**匿名VMAとは**

- **匿名メモリ**: 特定のファイルに結び付いていないメモリ領域（プログラムが動的に割り当てるメモリ）
- **VMA**: Linuxカーネルがメモリ領域を管理する単位

**before/after**

- **before**: `/proc/[pid]/maps` で表示される際、用途が不明で「\[anon\]」とのみ表示
- **after**: 「 `[anon: Go: heap]` 」「 `[anon: Go: stack]` 」などのコンテキストに即した情報を付与

<https://go.dev/issue/71546>

## compiler

Go1.25で、Go 1.21で混入したバグが修正されました。このバグはnilポインタチェックを不正に遅延させる可能性がありました。以下のように（不正に）正常に実行されていたプログラムは、今後（正しく）nilポインタ例外でパニックします。

```go
package main

import "os"

func main() {
    f, err := os.Open("nonExistentFile")
    name := f.Name()
    if err != nil {
        return
    }
    println(name)
}
```

このプログラムは、エラーをチェックする前に `os.Open` の結果を使用しているため正しくありません。 `err` がnon-nilの場合 `f` の結果はnilであり、その場合 `f.Name()` は内部で `f.name` とnilのフィールドを参照しているのでパニックすべきです。しかし、Go 1.21から1.24では、コンパイラはnilチェックをエラーチェック *後* まで不正に遅延させ、プログラムが正常に実行されていました。これはGoの仕様に違反しています。Go1.25では正常に実行されません。（ちなみに `f.Name()` が呼ばれた時点でpanicはしないのは仕様通りです）

<https://go.dev/issue/72860>

※リリースノートのサンプルコードだと分かりずらいので補足
以下のコードをGo1.25以前で実行した場合、panicにならずに③を出力してプログラムが正常終了します。そしてGo1.25以前のバージョンのまま②or④のコメントアウトを外して実行すると、①でpanicとなります。Go1.25以降で実行した場合は②or④のコメントアウトを外さずとも①でpanicするようになります。

```go
package main

import (
 "fmt"
)

func main() {
 m := map[string]*struct {
  field int
 }{}
 t, ok := m[""]

 valid := t.field > 0 // ①

 // fmt.Printf("got: %v\n", t) // ②

 if !ok || !valid {
  fmt.Printf("got: %v\n", t) // ③
 }

 // fmt.Printf("valid: %v\n", valid) // ④
}
```

<https://go.dev/issue/72860>

---

Go1.25のコンパイラとリンカは、 [DWARFバージョン5](https://dwarfstd.org/dwarf5std.html) を使用してデバッグ情報を生成するようになりました。新しいDWARFバージョンは、Goバイナリのデバッグ情報に必要なメモリを削減し、特に大きなGoバイナリに対してリンク時間を短縮します。

**デバッガへの影響**

- **起動の高速化**: デバッグ情報のサイズ削減により、起動時間が短縮される可能性
- **メモリ使用量の削減**: デバッガがロードするデバッグ情報が少なくなるため、メモリ効率が向上

<https://go.dev/issue/26379>

---

コンパイラは、より多くの状況でスライスのバッキングストア（スライスを構成するarray, len, capといった情報）をスタックに割り当てることができるようになり、性能が向上しました。この変更は、不適切に [unsafe.Pointer](https://go.dev/pkg/unsafe#Pointer) を使用した場合、影響する可能性があります。例として [issue73199](https://go.dev/issue/73199) を参照してください。これらの問題を追跡するために、 [bisectツール](https://pkg.go.dev/golang.org/x/tools/cmd/bisect) を `-compile=variablemake` フラグと組み合わせて使用して、問題の原因となる割り当てを見つけることができます。このような新しいスタック割り当ては `-gcflags=all=-d=variablemakehash=n` を使用してオフにすることもできます。

## linker

リンカは `-funcalign=N` コマンドラインオプションを受け入れるようになりました。これは関数エントリのアライメントを指定します。
デフォルト値はプラットフォーム依存であり、このリリースでは変更されていません。

## new packages

### testing/synctest

[`testing/synctest`](https://go.dev/pkg/testing/synctest) パッケージは、並行処理を行うコードのテストをサポートします。

[`Test`](https://go.dev/pkg/testing/synctest#Test) 関数は、隔離されたスコープである「バブル」内でテスト関数を実行します。バブル内では、時間は仮想化されます。 [`time`](https://go.dev/pkg/time) パッケージの処理は疑似クロックで動作し、バブル内のすべてのgoroutineがブロックされている場合、クロックは瞬時に進みます。

[`Wait`](https://go.dev/pkg/testing/synctest#Wait) 関数は、現在のバブル内のすべてのgoroutineがブロックされるまで待ちます。

<https://go.dev/issue/67434>
<https://go.dev/issue/73567>

### encoding/json/v2

Go1.25では、ビルド時に環境変数 `GOEXPERIMENT=jsonv2` を有効にすることで、JSONの新しい実装を使用できます。

有効にした場合、2つの新しいパッケージが利用可能になります。

- [`encoding/json/v2`](https://go.dev/pkg/encoding/json/v2) パッケージは、 `encoding/json` パッケージの代替です
  - **より良い性能**: Marshal/Unmarshal処理の大幅な高速化
  - **メモリ効率**: ガベージコレクションの負荷を軽減する設計
  - **ストリーミングサポート**: 大きなJSONデータのストリーム処理
  - **型安全性の向上**: より厳密な型チェックとエラーハンドリング
  - **カスタマイゼーション**: フィールドの命名規則やフォーマットの細かい制御
  - **互換性の改善**: 様々なJSONバリアントとの相互運用性
  - **エラー情報の詳細化**: デバッグしやすいエラーメッセージ
- [`encoding/json/jsontext`](https://go.dev/pkg/encoding/json/jsontext) パッケージは、JSON構文の低レベル処理を提供します
  - ストリーミングJSON読み取り・書き込みAPIを提供
  - トークンレベルでのJSON解析と生成が可能
  - メモリ効率的なJSON処理を実現
  - カスタムJSONフォーマットの実装をサポート
  - 既存の `encoding/json` パッケージの基盤として機能

さらに、jsonv2が有効な場合、

- [`encoding/json`](https://go.dev/pkg/encoding/json) パッケージは内部でencoding/json/v2を使用します。MarshallingとUnmarshallingの動作は影響を受けませんが、パッケージ関数によって返されるエラーのテキストが変更される可能性があります
- [`encoding/json/v2`](https://go.dev/pkg/encoding/json/v2) パッケージには、MarshallerとUnmarshallerを実装する際に使用できる多くの [オプション](https://pkg.go.dev/encoding/json/v2#Options) や [struct tag](https://pkg.go.dev/encoding/json/v2#hdr-JSON_Representation_of_Go_structs) が追加されます

v2では多くのシナリオでv1よりも大幅に優れた性能を発揮します。基本的に、Marshalの性能は同等であり、Unmarshalはv2で大幅な高速化を見込めます。より詳細な分析については、 [github.com/go-json-experiment/jsonbench](https://github.com/go-json-experiment/jsonbench) リポジトリを参照してください。

詳細については [プロポーザル](https://go.dev/issue/71497) や [パッケージのコメント](https://pkg.go.dev/encoding/json/v2#section-documentation) をご参照ください。

v1からv2へのマイグレーションについては [Migrating to v2](https://pkg.go.dev/encoding/json#hdr-Migrating_to_v2) を参照してください。

## minor changes to packages

### archive/tar

[`Writer.AddFS`](https://go.dev/pkg/archive/tar#Writer.AddFS) メソッドは、 [`io/fs.ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) を実装する `fs.FS` でシンボリックリンクをサポートするようになりました。

### encoding/asn1

[`Unmarshal`](https://go.dev/pkg/encoding/asn1#Unmarshal) と [`UnmarshalWithParams`](https://go.dev/pkg/encoding/asn1#UnmarshalWithParams) は、ASN.1タイプのT61StringとBMPStringをより一貫して解析するようになりました。これにより、以前受け入れられていた一部の不正な形式のエンコードが拒否される可能性があります。

### crypto

[`MessageSigner`](https://go.dev/pkg/crypto#MessageSigner) は、署名するメッセージを自分でハッシュ化できる新しい署名インターフェースです。新しい関数 [`SignMessage`](https://go.dev/pkg/crypto#SignMessage) も導入され、 [`Signer`](https://go.dev/pkg/crypto#Signer) インターフェースを [`MessageSigner`](https://go.dev/pkg/crypto#MessageSigner) にアップグレードしようと試み、成功した場合は [`MessageSigner.SignMessage`](https://go.dev/pkg/crypto#MessageSigner.SignMessage) メソッドを使用し、そうでなければ [`Signer.Sign`](https://go.dev/pkg/crypto#Signer.Sign) を使用します。これは、 [`Signer`](https://go.dev/pkg/crypto#Signer) と [`MessageSigner`](https://go.dev/pkg/crypto#MessageSigner) の両方をサポートしたいコードで使用できます。

---

プログラム開始後に [GODEBUG設定](https://go.dev/doc/godebug) の `fips140` を変更しても何も起きなくなりました。以前は許可されていないと文書化されており、変更された場合にパニックを引き起こす可能性がありました。

---

SHA-1、SHA-256、SHA-512は、AVX2命令が利用できない場合、amd64でより遅くなりました。2015年以降に製造されたほとんどすべてのプロセッサはAVX2をサポートしています。

### crypto/ecdsa

新しい [`ParseRawPrivateKey`](https://go.dev/pkg/crypto/ecdsa#ParseRawPrivateKey) 、 [`ParseUncompressedPublicKey`](https://go.dev/pkg/crypto/ecdsa#ParseUncompressedPublicKey) 、 [`PrivateKey.Bytes`](https://go.dev/pkg/crypto/ecdsa#PrivateKey.Bytes) 、 [`PublicKey.Bytes`](https://go.dev/pkg/crypto/ecdsa#PublicKey.Bytes) 関数とメソッドは、低レベルのエンコーディングを実装し、 [`crypto/elliptic`](https://go.dev/pkg/crypto/elliptic) や [`math/big`](https://go.dev/pkg/math/big) 関数とメソッドを駆使しなくてよくなりました。

#### 従来の実装との比較

従来、ECDSAキーの生のバイト形式との変換には、楕円曲線の数学的操作や大きな整数の処理が必要でした。

```go
// Go1.24以前の方法 - 複雑で間違いやすい
func privateKeyToBytes(priv *ecdsa.PrivateKey) []byte {
    // math/bigを使用した手動でのバイト変換
    return priv.D.Bytes()
}

func publicKeyToBytes(pub *ecdsa.PublicKey) []byte {
    // crypto/ellipticの関数を使用した座標の手動結合
    x := pub.X.Bytes()
    y := pub.Y.Bytes()
    // 非圧縮形式のエンコーディングを手動で構築
    uncompressed := make([]byte, 1+len(x)+len(y))
    uncompressed[0] = 0x04 // 非圧縮フラグ
    copy(uncompressed[1:], x)
    copy(uncompressed[1+len(x):], y)
    return uncompressed
}
```

```go
// Go1.25の新しい方法 - 簡潔で安全
func privateKeyToBytes(priv *ecdsa.PrivateKey) []byte {
    return priv.Bytes() // 直接的なメソッド呼び出し
}

func publicKeyToBytes(pub *ecdsa.PublicKey) []byte {
    return pub.Bytes() // 自動的な非圧縮形式エンコーディング
}

// 逆変換も同様に簡潔
func bytesToKeys(privBytes, pubBytes []byte) (*ecdsa.PrivateKey, *ecdsa.PublicKey, error) {
    priv, err := ecdsa.ParseRawPrivateKey(privBytes)
    if err != nil {
        return nil, nil, err
    }
    
    pub, err := ecdsa.ParseUncompressedPublicKey(pubBytes)
    if err != nil {
        return nil, nil, err
    }
    
    return priv, pub, nil
}
```

この変更により、開発者は楕円曲線暗号の数学的詳細を理解することなく、ECDSAキーの生のバイト表現を安全かつ効率的に処理できるようになります。

---

FIPS 140-3モードが有効な場合、署名は4倍高速になり、非FIPSモードの性能と一致します。

### crypto/ed25519

FIPS 140-3モードが有効な場合、署名は4倍高速になり、非FIPSモードの性能と一致します。

### crypto/elliptic

[`Curve`](https://go.dev/pkg/crypto/elliptic#Curve) インターフェースの実装の一部で文書化されていない `Inverse` と `CombinedMult` メソッドが実装されていましたが削除されました。

### crypto/rsa

[`PublicKey`](https://go.dev/pkg/crypto/rsa#PublicKey) は、modulus値が秘匿されているとは言えなくなりました。 [`VerifyPKCS1v15`](https://go.dev/pkg/crypto/rsa#VerifyPKCS1v15) と [`VerifyPSS`](https://go.dev/pkg/crypto/rsa#VerifyPSS) は、すべての入力が公開されリークする可能性があることをすでに警告しており、他の公開値からmodulusを復元できる数学的攻撃が存在します。

---

鍵生成は3倍高速になりました。

### crypto/sha1

SHA-NI命令が利用可能な場合、amd64でハッシュ化が2倍高速になりました。

### crypto/sha3

新しい [`SHA3.Clone`](https://go.dev/pkg/crypto/sha3#SHA3.Clone) メソッドは [`hash.Cloner`](https://go.dev/pkg/hash#Cloner) を実装します。

---

Apple M系プロセッサでハッシュ化が2倍高速になりました。

### crypto/tls

新しい [`ConnectionState.CurveID`](https://go.dev/pkg/crypto/tls#ConnectionState.CurveID) フィールドは、接続を確立するために使用された鍵交換メカニズムを公開します。

---

新しい [`Config.GetEncryptedClientHelloKeys`](https://go.dev/pkg/crypto/tls#Config.GetEncryptedClientHelloKeys) コールバックは、クライアントがEncrypted Client Hello拡張を送信する際にサーバーが使用する [`EncryptedClientHelloKey`](https://go.dev/pkg/crypto/tls#EncryptedClientHelloKey) を設定するために使用できます。

---

[RFC 9155](https://www.rfc-editor.org/rfc/rfc9155.html) に従い、SHA-1署名アルゴリズムはTLS 1.2ハンドシェイクで許可されなくなりました。
これらは [GODEBUGの設定](https://go.dev/doc/godebug) の `tlssha1=1` で再び有効化できます。

---

[FIPS 140-3モード](https://go.dev/doc/security/fips140) が有効な場合、TLS 1.2でExtended Master Secretが必要になり、Ed25519とX25519MLKEM768が許可されるようになりました。

---

TLSサーバーは、クライアントの最も優先されるプロトコルバージョンでなくても、最高のサポートされるプロトコルバージョンを優先するようになりました。

---

TLSクライアントとサーバーの両方が、仕様に従うことと仕様外の動作を拒否することにおいて、より厳格になりました。準拠するピアとの接続は影響を受けないはずです。

### crypto/x509

[`CreateCertificate`](https://go.dev/pkg/crypto/x509#CreateCertificate) 、 [`CreateCertificateRequest`](https://go.dev/pkg/crypto/x509#CreateCertificateRequest) 、 [`CreateRevocationList`](https://go.dev/pkg/crypto/x509#CreateRevocationList) は、 [`crypto.Signer`](https://go.dev/pkg/crypto#Signer) だけでなく [`crypto.MessageSigner`](https://go.dev/pkg/crypto#MessageSigner) 署名インターフェースも受け入れることができるようになりました。これにより、これらの関数は、呼び出し元によってではなく署名操作の一部としてハッシュが行われる「ワンショット」署名インターフェースを実装する型を使用することができます。

---

[`CreateCertificate`](https://go.dev/pkg/crypto/x509#CreateCertificate) は、 `SubjectKeyId` が不足している場合、切り詰められたSHA-256を使用してそれを設定するようになりました。
[GODEBUGの設定](https://go.dev/doc/godebug) の `x509sha256skid=0` でSHA-1に戻します。

---

[`ParseCertificate`](https://go.dev/pkg/crypto/x509#ParseCertificate) は、負のpathLenConstraintを含むBasicConstraints拡張を含む証明書を拒否するようになりました。

---

[`ParseCertificate`](https://go.dev/pkg/crypto/x509#ParseCertificate) は、ASN.1 T61StringとBMPString型でエンコードされた文字列をより一貫して処理するようになりました。これにより、以前受け入れられていた一部の不正な形式のエンコーディングが拒否される可能性があります。

### debug/elf

[`debug/elf`](https://go.dev/pkg/debug/elf) パッケージはRISC-V ELF解析用の2つの新しい定数を追加します。

- [`PT_RISCV_ATTRIBUTES`](https://go.dev/pkg/debug/elf#PT_RISCV_ATTRIBUTES)
- [`SHT_RISCV_ATTRIBUTES`](https://go.dev/pkg/debug/elf#SHT_RISCV_ATTRIBUTES)

### go/ast

[`FilterPackage`](https://go.dev/pkg/ast#FilterPackage) 、 [`PackageExports`](https://go.dev/pkg/ast#PackageExports) 、 [`MergePackageFiles`](https://go.dev/pkg/ast#MergePackageFiles) 関数、および [`MergeMode`](https://go.dev/pkg/go/ast#MergeMode) 型とその定数は、長期間非推奨の [`Object`](https://go.dev/pkg/ast#Object) と [`Package`](https://go.dev/pkg/ast#Package) 機構でのみ使用されているため、すべて非推奨となります。

---

新しい [`PreorderStack`](https://go.dev/pkg/go/ast#PreorderStack) 関数は、 [`Inspect`](https://go.dev/pkg/go/ast#Inspect) と同様に構文木を巡回し、サブツリーへの降下を制御しますが、便宜上、ノードの各ポイント以下のスタックも提供します。

### go/parser

[`ParseDir`](https://go.dev/pkg/go/parser#ParseDir) 関数は非推奨になります。

### go/token

新しい [`FileSet.AddExistingFiles`](https://go.dev/pkg/go/token#FileSet.AddExistingFiles) メソッドは、既存の [`File`](https://go.dev/pkg/go/token#File) を [`FileSet`](https://go.dev/pkg/go/token#FileSet) に追加することを可能にし、または任意の [`File`](https://go.dev/pkg/go/token#File) セットに対して [`FileSet`](https://go.dev/pkg/go/token#FileSet) を構築することを可能にし、長時間実行されるアプリケーションで単一のグローバル [`FileSet`](https://go.dev/pkg/go/token#FileSet) に関連する問題を軽減します。

### go/types

[`Var`](https://go.dev/pkg/go/types#Var) は、変数を以下のいずれかとして分類する [`Var.Kind`](https://go.dev/pkg/go/types#Var.Kind) メソッドを持つようになりました：パッケージレベル変数、レシーバ変数、引数、戻り値、ローカル変数、または構造体フィールド。

新しい [`LookupSelection`](https://go.dev/pkg/go/types#LookupSelection) 関数は、既存の [`LookupFieldOrMethod`](https://go.dev/pkg/go/types#LookupFieldOrMethod) 関数と同様に、指定された名前とレシーバ型のフィールドまたはメソッドを検索しますが、結果を [`Selection`](https://go.dev/pkg/go/types#Selection) の形式で返します。

### hash

新しい [`XOF`](https://go.dev/pkg/hash#XOF) インターフェースは、 [SHAKE](https://go.dev/pkg/crypto/sha3#SHAKE) などの任意または無制限の出力長を持つハッシュ関数である「拡張可能出力関数」によって実装できます。

新しい [`Cloner`](https://go.dev/pkg/hash#Cloner) インターフェースを実装するハッシュは、その状態のコピーを返すことができます。すべての [`Hash`](https://go.dev/pkg/hash#Hash) の実装は現在 [`Cloner`](https://go.dev/pkg/hash#Cloner) を実装しています。

### hash/maphash

新しい [`Hash.Clone`](https://go.dev/pkg/hash/maphash#Hash.Clone) メソッドは [`hash.Cloner`](https://go.dev/pkg/hash#Cloner) を実装します。

### io/fs

新しい [`ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) インターフェースは、ファイルシステム内のシンボリックリンクを読み取る能力を提供します。

### log/slog

[`GroupAttrs`](https://go.dev/pkg/log/slog#GroupAttrs) は [`Attr`](https://go.dev/pkg/log/slog#Attr) 値のスライスからグループ [`Attr`](https://go.dev/pkg/log/slog#Attr) を作成します。

[`Record`](https://go.dev/pkg/log/slog#Record) は、ソース位置を返すか、利用できない場合はnilを返す [`Source`](https://go.dev/pkg/log/slog#Record.Source) メソッドを持つようになりました。

### mime/multipart

新しいヘルパー関数 [`FileContentDisposition`](https://go.dev/pkg/mime/multipart#FileContentDisposition) は、マルチパートContent-Dispositionヘッダーフィールドを構築します。

### net

[`LookupMX`](https://go.dev/pkg/net#LookupMX) と [`Resolver.LookupMX`](https://go.dev/pkg/net#Resolver.LookupMX) は、有効なIPアドレスのように見えるDNS名と有効なドメイン名を返すようになりました。

**具体的な変更内容**

Go1.24以前では、MXレコードの値として `192.168.1.100` のようなIPアドレスが返された場合、RFC 5321の厳密な要求に従ってこれらの値は破棄されていました。しかし、実際の運用環境では、一部のネームサーバーや設定でMXレコードにIPアドレスが設定されることがあります。

**返される値の例**

```go
// Go1.25での動作例
mx, err := net.LookupMX("example.com")
if err != nil {
    log.Fatal(err)
}

for _, record := range mx {
    fmt.Printf("Priority: %d, Host: %s\n", record.Pref, record.Host)
}

// 出力例（Go1.25では以下の両方が返される可能性）
// Priority: 10, Host: mail.example.com       // 従来通りの有効なドメイン名
// Priority: 20, Host: 203.0.113.50          // 新たに許可されるIPアドレス形式
```

この変更により、RFC要求よりも実用性を重視し、実際のインフラで動作しているメールシステムとの互換性が向上します。

---

WindowsでLookupMXは、 [`ListenMulticastUDP`](https://go.dev/pkg/net#ListenMulticastUDP) がIPv6アドレスをサポートするようになりました。

---

Windowsでは、 [`os.File`](https://go.dev/pkg/os#File) とネットワーク接続間の変換が可能になりました。具体的には、 [`FileConn`](https://go.dev/pkg/net#FileConn) 、 [`FilePacketConn`](https://go.dev/pkg/net#FilePacketConn) 、 [`FileListener`](https://go.dev/pkg/net#FileListener) 関数が実装され、開いているファイルに対応するネットワーク接続またはリスナーを返します。
同様に、 [`TCPConn`](https://go.dev/pkg/net#TCPConn.File) 、 [`UDPConn`](https://go.dev/pkg/net#UDPConn.File) 、 [`UnixConn`](https://go.dev/pkg/net#UnixConn.File) 、 [`IPConn`](https://go.dev/pkg/net#IPConn.File) 、 [`TCPListener`](https://go.dev/pkg/net#TCPListener.File) 、 [`UnixListener`](https://go.dev/pkg/net#UnixListener.File) の `File` メソッドが実装され、ネットワーク接続の基礎となる [`os.File`](https://go.dev/pkg/os#File) を返します。

### net/http

新しい [`CrossOriginProtection`](https://go.dev/pkg/net/http#CrossOriginProtection) は、安全でないクロスオリジンブラウザのリクエストを拒否することにより、 [Cross-Site Request Forgery（CSRF）](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF) に対する保護を実装します。
これは [モダンブラウザのFetchメタデータ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) を使用し、トークンやクッキーを必要とせず、オリジンベースとパターンベースのバイパスをサポートします。

**使用例**

```go
package main

import (
 "fmt"
 "net/http"
)

func main() {
 // 基本的なCSRF保護
 // APIエンドポイントを保護
 protection := http.CrossOriginProtection{}
 http.Handle("/api/", protection.Wrap(http.HandlerFunc(apiHandler)))
 
 // 管理者エンドポイントを保護
 // 特定のオリジンを許可する設定
 protectionWithAllowlist := http.CrossOriginProtection{
  AllowedOrigins: []string{
   "https://trusted-app.example.com",
   "https://*.internal.company.com", // パターンベース
  },
 }
 http.Handle("/admin/", protectionWithAllowlist.Wrap(http.HandlerFunc(adminHandler)))
 
 // 開発環境用の設定（localhostを許可）
 devProtection := http.CrossOriginProtection{
  AllowedOrigins: []string{
   "http://localhost:*", // 任意のlocalhostポートを許可
  },
 }
 http.Handle("/dev-api/", devProtection.Wrap(http.HandlerFunc(devHandler)))
 
 http.ListenAndServe(":8080", nil)
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
 fmt.Fprintf(w, "Secure API endpoint accessed safely")
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
 fmt.Fprintf(w, "Admin function executed")
}

func devHandler(w http.ResponseWriter, r *http.Request) {
 fmt.Fprintf(w, "Development API")
}
```

**動作の仕組み**

1. **自動判定**: ブラウザが送信する `Sec-Fetch-Site` ヘッダーを確認

- `same-origin`: 同一オリジンからのリクエスト → **許可**
- `cross-site`: クロスサイトリクエスト → **検証または拒否**
- `none`: 直接アクセス（ブックマークなど） → **許可**

2. **設定不要**: 従来のCSRFトークンやクッキーの設定が不要
3. **柔軟な制御**: 必要に応じて特定のオリジンを許可リストに追加可能

この機能により、モダンなブラウザでのCSRF攻撃を簡単かつ効果的に防ぐことができます。

### os

Windowsでは、 [`NewFile`](https://go.dev/pkg/os#NewFile) が非同期I/O用に開かれたハンドルをサポートするようになりました（つまり、 [`syscall.CreateFile`](https://go.dev/pkg/syscall#CreateFile) 呼び出しで [`syscall.FILE_FLAG_OVERLAPPED`](https://go.dev/pkg/syscall#FILE_FLAG_OVERLAPPED) が指定されている）。
これらのハンドルはGoランタイムのI/O完了ポートに関連付けられ、結果として得られる [`File`](https://go.dev/pkg/os#File) に以下の利点を提供します。

- I/Oメソッド（ [`File.Read`](https://go.dev/pkg/os#File.Read) 、 [`File.Write`](https://go.dev/pkg/os#File.Write) 、 [`File.ReadAt`](https://go.dev/pkg/os#File.ReadAt) 、 [`File.WriteAt`](https://go.dev/pkg/os#File.WriteAt) ）がOSスレッドをブロックしません。
- デッドラインメソッド（ [`File.SetDeadline`](https://go.dev/pkg/os#File.SetDeadline) 、 [`File.SetReadDeadline`](https://go.dev/pkg/os#File.SetReadDeadline) 、 [`File.SetWriteDeadline`](https://go.dev/pkg/os#File.SetWriteDeadline) ）がサポートされます。

この機能強化は、Windowsで名前付きパイプを介して通信するアプリケーションに特に有益です。

ハンドルは一度に1つの完了ポートにのみ関連付けることができることに注意してください。
[`NewFile`](https://go.dev/pkg/os#NewFile) に提供されたハンドルがすでに完了ポートに関連付けられている場合、返される [`File`](https://go.dev/pkg/os#File) は同期I/Oモードにダウングレードされます。
この場合、I/OメソッドはOSスレッドをブロックし、デッドラインメソッドは効果がありません。

---

[`DirFS`](https://go.dev/pkg/os#DirFS) と [`Root.FS`](https://go.dev/pkg/os#Root.FS) によって返される `fs.FS` は、新しい [`io/fs.ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) インターフェースを実装します。
[`CopyFS`](https://go.dev/pkg/os#CopyFS) は、 [`io/fs.ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) を実装する `fs.FS` をコピーする際にシンボリックリンクをサポートします。

---

[`Root`](https://go.dev/pkg/os#Root) 型は以下の追加メソッドをサポートします。

- [`Root.Chmod`](https://go.dev/pkg/os#Root.Chmod)
- [`Root.Chown`](https://go.dev/pkg/os#Root.Chown)
- [`Root.Chtimes`](https://go.dev/pkg/os#Root.Chtimes)
- [`Root.Lchown`](https://go.dev/pkg/os#Root.Lchown)
- [`Root.Link`](https://go.dev/pkg/os#Root.Link)
- [`Root.MkdirAll`](https://go.dev/pkg/os#Root.MkdirAll)
- [`Root.ReadFile`](https://go.dev/pkg/os#Root.ReadFile)
- [`Root.Readlink`](https://go.dev/pkg/os#Root.Readlink)
- [`Root.RemoveAll`](https://go.dev/pkg/os#Root.RemoveAll)
- [`Root.Rename`](https://go.dev/pkg/os#Root.Rename)
- [`Root.Symlink`](https://go.dev/pkg/os#Root.Symlink)
- [`Root.WriteFile`](https://go.dev/pkg/os#Root.WriteFile)

<https://go.dev/issue/73126>

### reflect

新しい [`TypeAssert`](https://go.dev/pkg/reflect#TypeAssert) 関数は、 [`Value`](https://go.dev/pkg/reflect#Value) を指定された型のGoの値に直接変換することを許容します。これは [`Value.Interface`](https://go.dev/pkg/reflect#Value.Interface) の結果に型アサーションを使用するのと似ていますが、不要なメモリ割り当てを避けます。

### regexp/syntax

`\p{name}` と `\P{name}` 文字クラス構文（Unicode文字クラスエスケープ）は、Any、ASCII、Assigned、Cn、LC、および `\p{Letter}` （ `\pL` 用）などのUnicodeカテゴリエイリアスの名前を受け入れるようになりました。
[Unicode TR18](https://unicode.org/reports/tr18/) に従い、スペース、アンダースコア、ハイフンを無視して、大文字小文字を区別しない名前検索も使用するようになりました。

<https://github.com/golang/go/issues/70781>
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape>

### runtime

[`AddCleanup`](https://go.dev/pkg/runtime#AddCleanup) によってスケジュールされたクリーンアップ関数は、並行・並列に実行されるようになり、 [`unique`](https://go.dev/pkg/unique) パッケージのように過度にしようする場合でも効率的に実行可能になりました。個々のクリーンアップ処理が長時間実行またはブロックされて、クリーンアップキューのブロックが発生するのを避けるために、その処理は新しいgoroutineに移されるようになるはずです。

---

新しい `GODEBUG=checkfinalizers=1` 設定は、 [GCガイド](https://go.dev/doc/gc-guide#Finalizers_cleanups_and_weak_pointers) で説明されているようなファイナライザーとクリーンアップの一般的な問題を検出するのに役立ちます。
このモードでは、ランタイムは各ガベージコレクションサイクルで診断を行い、長時間実行される問題のあるファイナライザーやクリーンアップを特定するのに役立つよう、ファイナライザーとクリーンアップキューの長さをstderrに定期的に出力します。
詳細については、 [GODEBUGドキュメント](https://pkg.go.dev/runtime#hdr-Environment_Variables) を参照してください。

---

新しい [`SetDefaultGOMAXPROCS`](https://go.dev/pkg/runtime#SetDefaultGOMAXPROCS) 関数は、 `GOMAXPROCS` が設定されていない場合のデフォルト値を設定します。

### runtime/pprof

ランタイム内部のロックの競合に関するmutexプロファイルは、遅延を引き起こしたクリティカルセクションの終了を正しく指すようになりました。これは `sync.Mutex` の競合に対するプロファイルの動作と一致します。

### sync

新しい [`WaitGroup.Go`](https://go.dev/pkg/sync#WaitGroup.Go) メソッドは、複数のgoroutineを作成してそれらの終了を待つ一般的なパターンをより便利にします。

**Go1.24以前の従来の方法**

```go
func processItems(items []string) {
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)           // 手動でカウンタを増加
        go func(item string) {
            defer wg.Done() // 手動でカウンタを減少
            process(item)
        }(item)
    }
    
    wg.Wait()
}
```

**Go1.25の新しい方法**

```go
func processItems(items []string) {
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Go(func() { // Add(1), Done()が自動的に呼ばれる
            process(item)
        })
    }
    
    wg.Wait()
}
```

### testing

新しいメソッド [`T.Attr`](https://go.dev/pkg/testing#T.Attr) 、 [`B.Attr`](https://go.dev/pkg/testing#B.Attr) 、 [`F.Attr`](https://go.dev/pkg/testing#F.Attr) は、テストログに属性を出力します。属性は、テストに関連付けられた任意のkey-valueです。

例えば、 `TestF` という名前のテストで、 `t.Attr("key", "value")` の出力は以下のようになります。

```
=== ATTR  TestF key value
```

`-json` フラグを使用すると、属性は新しい「attr」アクションとして出力されます。

---

[`T`](https://go.dev/pkg/testing#T) 、 [`B`](https://go.dev/pkg/testing#B) 、 [`F`](https://go.dev/pkg/testing#F) の新しい [`Output`](https://go.dev/pkg/testing#T.Output) メソッドは、 [`TB.Log`](https://go.dev/pkg/testing#TB.Log) と同様にテストの出力に書き込める [`io.Writer`](https://go.dev/pkg/io#Writer) を提供します。
`TB.Log` と同様に、出力はインデントされますが、ファイル名と行番号は含まれません。
<https://go.dev/issue/59928>

---

[`AllocsPerRun`](https://go.dev/pkg/testing#AllocsPerRun) 関数は、並列テストが実行されている場合にパニックするようになりました。
[`AllocsPerRun`](https://go.dev/pkg/testing#AllocsPerRun) の結果は、他のテストが実行されている場合、本質的に不安定です。
新しいパニック動作は、このようなバグを検知するのに役立ちます。
<https://go.dev/issue/70464>

### testing/fstest

[`MapFS`](https://go.dev/pkg/testing/fstest#MapFS) は [`io/fs.ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) インターフェースを実装します。
[`TestFS`](https://go.dev/pkg/testing/fstest#TestFS) は、 [`io/fs.ReadLinkFS`](https://go.dev/pkg/io/fs#ReadLinkFS) インターフェースを実装している場合、Lstatの値を見るようになります。
[`TestFS`](https://go.dev/pkg/testing/fstest#TestFS) は、無限に再帰することを避けるためにシンボリックリンクを追跡しなくなりました。

### unicode

新しい [`CategoryAliases`](https://go.dev/pkg/unicode#CategoryAliases) マップは、「L」に対する「Letter」などのカテゴリエイリアス名への変換手段を提供します。

新しいカテゴリ [`Cn`](https://go.dev/pkg/unicode#Cn) と [`LC`](https://go.dev/pkg/unicode#LC) は、それぞれ未割り当てのコードポイントと大文字小文字のある文字を定義します。
これらは常にUnicodeによって定義されていましたが、Go1.25以前では誤って省略されていました。
[`C`](https://go.dev/pkg/unicode#C) カテゴリは現在 [`Cn`](https://go.dev/pkg/unicode#Cn) を含むため、すべての未割り当てのコードポイントが追加されています。

<https://github.com/golang/go/issues/70780>
<https://developer.mozilla.org/en-US/docs/Glossary/Code_point>

### unique

[`unique`](https://go.dev/pkg/unique) パッケージは、インターン化された値をより積極的に、効率的に、並列に回収するようになりました。その結果、 [`Make`](https://go.dev/pkg/unique#Make) 関数を使用するアプリケーションは、ユニークな値が多数インターン化された場合に、メモリ使用量の急激な増加が起きにくくなりました。

[`Handle`](https://go.dev/pkg/unique#Handle) を含む [`Make`](https://go.dev/pkg/unique#Make) 関数に渡された値は、ガベージコレクションでの回収時に、値の階層の深さに比例したサイクル数を要していました。Go1.25からは、未使用になると、1回のサイクルですぐに回収されます。

## ports

### Darwin

Go1.24のリリースノートに [書かれていた](https://go.dev/doc/go1.24#darwin) 通り、Go1.25はmacOS 12 Monterey以降をサポート対象とします。
<https://go.dev/issue/69839>

### Windows

Go1.25は、 [不具合のある](https://go.dev/doc/go1.24#windows) 32ビットwindows/armポート（ `GOOS=windows` `GOARCH=arm` ）を含む最後のリリースです。Go1.26で削除される予定です。
<https://go.dev/issue/71671>

### Loong64

linux/loong64ポートは、race detector、 [`runtime.SetCgoTraceback`](https://go.dev/pkg/runtime#SetCgoTraceback) を使用したCコードからのトレースバック情報の収集、および内部リンクモードでのcgoプログラムのリンクをサポートするようになりました。

### RISC-V

linux/riscv64ポートで `plugin` ビルドモードをサポートするようになりました。
[https://go-review.googlesource.com/c/go/+/420114](https://go-review.googlesource.com/c/go/%2B/420114)

---

`GORISCV64` 環境変数に新しい値 `rva23u64` を設定することで、 [RVA23U64プロファイル](https://github.com/riscv/riscv-profiles/blob/main/src/rva23-profile.adoc#rva23u64-profile) の命令セットを利用できるようになります。
<https://go.dev/issue/61476>

</rewritten_file>
