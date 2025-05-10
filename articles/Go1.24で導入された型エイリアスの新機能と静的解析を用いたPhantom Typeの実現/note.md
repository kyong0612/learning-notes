# Go1.24で導入された型エイリアスの新機能と静的解析を用いたPhantom Typeの実現

ref: <https://findy-code.io/media/articles/technote-go-2505>

## 記事要約

本記事は、Go1.24で導入された型エイリアスの新機能と、それを利用したPhantom Typeの実現方法について解説しています。また、Goのバージョンアップ方法やGo1.25以降のジェネリクスに関する展望にも触れています。

### Goのバージョンアップ

* Go1.21以降では `go mod edit -go <バージョン>` コマンドで `go.mod` ファイルを更新することで簡単にバージョンアップできます。パッチバージョンまで指定することが推奨されます（例: `go1.24.2`）。

  ```
  go mod edit -go 1.24.2
  ```

* 環境変数 `GOTOOLCHAIN` を利用する方法や、公式サイトからダウンロードしてインストールする方法もあります。
  `go.mod` ファイルが存在しない場合の `GOTOOLCHAIN` を利用した初期化例:

  ```
  $ GOTOOLCHAIN=go1.24.2 go mod init example.com/repo/samplemodule
  $ cat go.mod
  module example.com/repo/samplemodule

  go 1.24.2
  ```

  `go install` を使用した特定バージョンのインストール例:

  ```
  go install golang.org/dl/go1.24.2@latest
  go1.24.2 download
  ```

  エイリアスの設定例 (Linux/macOS):

  ```
  alias go=go1.24.2
  ```

* 最新のGoのバージョンは `https://go.dev/VERSION?m=text` から取得可能です。

  ```
  $ curl -s https://go.dev/VERSION?m=text
  go1.24.2
  time 2025-03-26T19:09:39Z
  ```

### 型エイリアス

* 型エイリアスはGo1.9で導入され、既存の型に新しい識別子を紐づける機能です。型定義とは異なり、新しい型は作成しません。
  型定義の例:

  ```go
  type T1 X // T1はXとは異なる新しい型
  ```

  型エイリアスの例:

  ```go
  type T2 = Y // T2はYと同じ型 (エイリアス)
  ```

* 大規模なリファクタリングを支援するために導入されました。例として `context` パッケージの移行が挙げられています。
  パッケージ `a` (移行元):

  ```go
  // 移行元
  package a

  const C = 100
  var V = 200
  func F(x int) int {
      return x
  }
  ```

  パッケージ `b` (移行先):

  ```go
  // 移行先
  package b

  import "example.com/a"

  const C = a.C
  var V = a.V
  func F(x int) int {
      return a.F(x)
  }
  ```

  `context.Context` のインタフェース定義例:

  ```go
  type Context interface {
          Done() <-chan struct{}
          Err() error
          Value(key any) any
  }
  ```

  型定義によるパッケージ移行の問題点を示す例:

  ```go
  package main

  import stdctx "context"
  import netctx "golang.org/x/net/context"

  func X(ctx stdctx.Context) {
  }

  func Y(f func(ctx netctx.Context)) {
  }

  func main() {
      // stdctx.Contextとnetctx.Contextは別の型なので代入できない
      Y(X)
  }
  ```

  `golang.org/x/net/context` パッケージでの型エイリアス宣言例:

  ```go
  import "context"

  type Context = context.Context
  ```

* `go fix` コマンドを用いることで、型エイリアスを利用したAPI移行を容易に行えます。Go1.25以降では `//go:fix inline` コメントディレクティブが導入される見込みです。

### 型パラメータを持つ型エイリアス

* Go1.18から型引数を指定してインスタンス化した型のエイリアス宣言は可能でしたが、型エイリアス宣言自体で型パラメータを新たに設定する機能はありませんでした。
  型引数を指定した型エイリアスの例 (Go1.18から可能):

  ```go
  type Vector2[T any] [2]T
  type IntVector2 = Vector2[int]
  ```

  型パラメータを持つ型エイリアスの宣言 (Go1.24以前は不可):

  ```go
  type OrderedVector2[T cmp.Ordered] = Vector2[T] // Go1.24で可能に
  ```

* Go1.24からは型エイリアスの宣言で型パラメータを利用できるようになり、ジェネリクスを用いた型のリファクタリングが安全に行えるようになりました。

### GoにおけるPhantom Typeの実現

* Phantom Typeは、型チェックのためだけに存在する型パラメータで、実行時には使用されませんが、コンパイル時の型チェックで型の誤用を防ぎます。
* 従来のGoでは、型定義（例: `type ID[T any] uuid.UUID`）を用いてPhantom Typeを実現していましたが、この方法では元の型のメソッドを引き継げず、型変換が必要でした。
  Phantom Type の型定義例:

  ```go
  type ID[T any] uuid.UUID
  ```

  Phantom Type を利用した構造体と関数の例:

  ```go
  type User struct {
   UserID  ID[User]
   GroupID ID[Group]
   // ...略...
  }

  type Group struct {
   GroupID ID[Group]
   // ...略...
  }

  func UserByGroupID(ctx context.Context, id ID[Group], limit int) ([]*User, error) {
   // ...略...
  }
  ```

  型定義によるPhantom Typeのメソッド呼び出し時の型変換例:

  ```go
  func printUserID(userID ID[User]) {
   fmt.Println(uuid.UUID(userID).String())
  }
  ```

### 型エイリアスと静的解析を用いたPhantom Typeの実現

* Go1.24の新機能である型パラメータを持つ型エイリアス（例: `type ID[T any] = uuid.UUID`）を利用すると、元の型と互換性を保ったままPhantom Typeを宣言できます。これにより、型変換が不要になります。
  型エイリアスを用いたPhantom Type宣言の例 (Go1.24から):

  ```go
  type ID[T any] = uuid.UUID
  ```

  型エイリアスを用いたPhantom Typeのメソッド直接呼び出し例:

  ```go
  func printUserID(userID ID[User]) {
   fmt.Println(userID.String())
  }
  ```

* ただし、この方法ではコンパイル時の型チェックによる誤用発見はできません。
* そこで、`go/types` パッケージ（特にGo1.22で導入された `types.Alias` 型やGo1.23で導入された `TypeParams`/`TypeArgs` メソッド）を用いた静的解析によって、Phantom Typeの誤用を発見する方法が提案されています。
  * 静的解析の具体的な手順と、代入や関数呼び出し時の誤用を発見するロジックが説明されています。
  * 静的解析でエラーとして報告できるコードの例:

    ```go
    var v ID[Group] = uuid.New() // 右辺がPhantom Typeを持たないのでNGにならない
    var x ID[User] = v // エラー
    func(id ID[User]) {　/* ...略... */ }(v) // エラー
    ```

  * 筆者による静的解析ツールのソースコードがGitHubリポジトリ ( `https://github.com/tenntenn/phantom` ) で公開されています。

### Go1.25以降のジェネリクス

* Go1.25（2025年8月リリース予定）では、Core Typeという概念がなくなります。
  * **Core Typeとは**: Goのジェネリクスにおいて、型パラメータに指定できる型制約の基礎となる型（underlying type）の互換性を定義するために導入された概念でした。例えば、`type MyInt int` と `type YourInt int` は異なる型ですが、どちらも基礎型は `int` です。Core Typeはこの基礎型を考慮して型制約の判定を行っていました。
  * **廃止の背景**: Core Typeの概念はジェネリクスの仕様を複雑にし、ユーザーにとって理解しにくい部分がありました。Goチームは、よりシンプルで直感的なジェネリクスの実現を目指し、Core Typeの廃止を決定しました。これにより、型制約の判定がより明確になることが期待されます。
* Go1.25で `//go:fix inline` コメントディレクティブが導入される見込みです。これは `go fix` コマンドと連携し、コードの自動修正をより柔軟に行えるようにするものです。

### おわりに

* Go1.24では型エイリアスの型パラメータ以外にも、イテレータの改善や新しい `weak` パッケージの導入など多くの新機能があります。
* Go1.25に向けても `encoding/json/v2` など注目すべき変更が予定されています。
* 各種Go関連カンファレンスやイベントへの参加が推奨されています。

### 視覚的要素について

元の記事には以下の画像が含まれていました。

* 記事のトップ画像
* 執筆者 tenntenn 氏のアイコン画像
* X (旧 Twitter) アカウントへのリンク画像
* はてなブックマークへのリンク画像

これらの画像は、上記要約には直接含まれていませんが、元の記事を参照することで確認できます。
