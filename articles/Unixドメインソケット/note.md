# Unixドメインソケット

ref: <https://ascii.jp/elem/000/001/415/1415088/>

## 基本概念

Unixドメインソケットは、同一コンピュータ内のプロセス間通信を実現する仕組みです[1]。以下の特徴があります：

- POSIX系OS（LinuxやmacOSなど）で利用可能
- コンピュータ内部での高速な通信が可能
- ファイルシステム上のパスを使って通信相手を特定

## 通信方式

**ストリーム型**と**データグラム型**の2種類の通信方式をサポートしています[1]：

- ストリーム型：TCPのような信頼性の高い双方向通信
- データグラム型：UDPのようなメッセージ単位の通信

## 仕組みと特徴

**ソケットファイル**

- 通信用の特殊なファイルとして作成される[1]
- ファイルパスを通信の識別子として使用
- パーミッションによるアクセス制御が可能

**高速性の理由**

- 外部ネットワークインターフェースを介さない
- カーネル内部で完結する通信を実現
- ウェブサーバとデータベース間などの通信で性能向上が期待できる[1]

## 実装例

**サーバ側の基本実装**

```go
listener, err := net.Listen("unix", "socketfile")
defer listener.Close()
conn, err := listener.Accept()
```

**クライアント側の基本実装**

```go
conn, err := net.Dial("unix", "socketfile")
```

## 注意点

- WindowsではUnixドメインソケットの代わりに「名前付きパイプ」を使用[1]
- サーバ側で`Close()`を呼ばないとソケットファイルが残り続ける
- Go言語では正しくクローズするとソケットファイルは自動的に削除される[1]

このように、Unixドメインソケットは同一マシン上のプロセス間通信において、高速で信頼性の高い通信手段を提供します。

Sources
[1]  <https://ascii.jp/elem/000/001/415/1415088/>
[2] Unixドメインソケット (1/2) <https://ascii.jp/elem/000/001/415/1415088/>

---

## サーバー側（Golang）の実装

**基本的なHTTPサーバー**

```go
package main

import (
    "net"
    "net/http"
    "os"
)

const socketPath = "/tmp/app.sock"

func main() {
    // ソケットファイルが存在する場合は削除
    os.Remove(socketPath)
    
    // Unixドメインソケットでリスナーを作成
    listener, err := net.Listen("unix", socketPath)
    if err != nil {
        panic(err)
    }
    defer listener.Close()

    // HTTPハンドラーの設定
    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello from Go server!"))
    })

    // サーバーの起動
    http.Serve(listener, mux)
}
```

## クライアント側（Node.js）の実装

**ソケット通信クライアント**

```javascript
const net = require('net');

const SOCKET_PATH = '/tmp/app.sock';

// クライアントの作成
const client = net.createConnection(SOCKET_PATH);

// 接続イベントのハンドリング
client.on('connect', () => {
    console.log('Connected to server');
    
    // HTTPリクエストの送信
    client.write('GET / HTTP/1.1\r\n\r\n');
});

// データ受信のハンドリング
client.on('data', (data) => {
    console.log('Received:', data.toString());
});

// エラーハンドリング
client.on('error', (err) => {
    console.error('Error:', err.message);
});

// 接続終了のハンドリング
client.on('end', () => {
    console.log('Disconnected from server');
});
```

## 注意点

**セキュリティ設定**

- ソケットファイルのパーミッションを適切に設定
- 不要になったソケットファイルは確実に削除

**エラーハンドリング**

- サーバー側での適切なシグナルハンドリング
- クライアント側での再接続ロジックの実装

**クリーンアップ処理**

```go
// Goサーバーでのクリーンアップ
c := make(chan os.Signal, 1)
signal.Notify(c, os.Interrupt, syscall.SIGTERM)
go func() {
    <-c
    os.Remove(socketPath)
    os.Exit(0)
}()
```

このように、異なる言語間でもUnixドメインソケットを使用することで効率的な通信が実現できます。

Sources
[1] Understanding Unix Domain Sockets in Golang - DEV Community <https://dev.to/douglasmakey/understanding-unix-domain-sockets-in-golang-32n8>
[2] unix domain socketをGoで実装する <https://zenn.dev/ymktmk/scraps/1b7b543559e87a>
[3] Example of Interprocess communication in Node.js through a UNIX ... <https://gist.github.com/Xaekai/e1f711cb0ad865deafc11185641c632a>
[4] Node.jsでもUNIXドメインソケットを使いたい - Qiita <https://qiita.com/walk8243/items/49ce3fc24500038f126f>
[5] Example of Interprocess communication in Node.js ... - GitHub Gist <https://gist.github.com/wongpiwat/2cd34f9c316e0c379a076222436835c1>
