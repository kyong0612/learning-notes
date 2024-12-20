# Go Protobuf: The new Opaque API

ref: <https://go.dev/blog/protobuf-opaque>

**Protocol Buffers (Protobuf)**は、Googleが開発した言語中立のデータ交換フォーマットです（詳細はprotobuf.dev参照）。

背景: 既存の「Open Struct API」
これまでのAPI（現在「Open Struct API」と呼ばれる）は、生成された構造体型が直接アクセス可能でした。例えば、次のような.proto定義を使います：

edition = "2023";  // proto2/proto3の後継
package log;

message LogEntry {
  string backend_server = 1;
  uint32 request_size = 2;
  string ip_address = 3;
}

これをプロトコルコンパイラprotocでコード生成すると、以下のような.pb.goファイルが得られます：

package logpb

type LogEntry struct {
  BackendServer *string
  RequestSize*uint32
  IPAddress     *string
}

func (l *LogEntry) GetBackendServer() string { … }
func (l*LogEntry) GetRequestSize() uint32   { … }
func (l *LogEntry) GetIPAddress() string     { … }

このコードを使用してproto.Marshalでlogpb.LogEntryメッセージをエンコードできます。

新しい「Opaque API」
Opaque APIは、生成コードAPIをメモリ表現から切り離すために作成されました。従来のAPIでは構造体が直接アクセス可能だったため、メモリの制約が存在していました。

新しいAPIでは、フィールドを隠し、以下のようにアクセサメソッドを介して操作します：

type LogEntry struct {
  xxx_hidden_BackendServer *string // 非公開フィールド
}

func (l *LogEntry) GetBackendServer() string { … }
func (l*LogEntry) SetBackendServer(string)  { … }
func (l *LogEntry) ClearBackendServer()      { … }

Opaque APIの利点

 1. メモリ効率の向上: ポインタの使用をビットフィールドに置き換え、メモリ使用量を削減。
 2. 遅延デコード: 初めてフィールドにアクセスする際にデコードを行い、パフォーマンスを向上。
 3. ポインタ関連バグの削減: ポインタを使用しないことで、比較や共有のミスを防止。
 4. リフレクションの安全性: フィールドを隠すことで、Goのreflectパッケージを誤用することを防ぎ、正しいProtobufリフレクションを利用。
 5. 理想的なメモリレイアウト: 頻度の低いフィールドを別の構造体に分離するなど、将来の最適化を容易に。

移行について
既存のOpen Struct APIは今後も削除されませんが、Opaque APIを利用することで性能改善や将来の最適化の恩恵を受けることができます。
新しい開発にはOpaque APIの使用を推奨します。既存プロジェクトの移行は次の手順で行えます：

 1. Hybrid APIを有効化
 2. open2opaqueツールでコードを変換
 3. Opaque APIに切り替え

詳細な移行ガイドは公式ドキュメントを参照してください。

## Hybrid API

Hybrid APIは、Opaque APIへの移行を容易にするために設計されています。このAPIは、既存のコードをそのまま動作させる一方で、新しいアクセサメソッドを追加して、Opaque APIへの移行を可能にします。

Hybrid APIを使用する場合、protobufコンパイラは2つのレベルのAPIを持つコードを生成します：
 • .pb.go: Hybrid APIが使用される通常のファイル
 • _protoopaque.pb.go: 完全にOpaque APIを使用したバージョン

これにより、protoopaqueビルドタグを指定してコンパイルすることで、Opaque APIを利用するコードを選択できます。

## Lazy Decoding（遅延デコード）の有効化

Opaque APIに移行すると、Lazy Decodingが利用可能になります。この機能は、プロトコルメッセージを最初にアクセスした時点でデコードすることで、不要なフィールドのデコードを省略し、パフォーマンスを向上させます。

Lazy Decodingを有効化する手順：

 1. .protoファイルで、メッセージ型フィールドに[lazy = true]アノテーションを追加。
 2. 遅延デコードを無効化したい場合、protolazyパッケージでオプトアウト設定を適用。

遅延デコードにより、ログ解析パイプラインなどの特定のワークロードでは、最大87%のアロケーション削減を達成することができます。

Opaque APIへの移行のステップ
移行は次のように進めることができます：

 1. Hybrid APIを有効化
既存のコードに影響を与えず、Opaque APIへの移行準備を整える。
 2. open2opaqueツールを使用
自動化されたツールを使ってコードを変換。フィールドアクセスをアクセサメソッドに書き換える。
 3. Opaque APIに切り替え
最終的に、完全にOpaque APIを使用するようにプロジェクトを更新。

Google社では、過去数年間でこのプロセスを実施し、ほぼ全ての.protoファイルとGoコードをOpaque APIに移行しています。

プロジェクト間の互換性のための推奨事項
 • 異なるチーム間や企業間で共有されるプロジェクトでは、Hybrid APIを使用することを推奨します。
 • Hybrid APIを使用することで、古いAPIを利用するコードベースにも影響を与えず、新しいAPIへの移行を可能にします。

## 次のステップ

新しいOpaque APIを試す際、問題が発生した場合は、Go Protobufの問題トラッカーに報告してください。

公式ドキュメントや参照情報はprotobuf.devに掲載されています。
