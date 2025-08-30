---
title: "Go で言うところのアレは TypeScript で言うとコレ / Kyoto.なんか #7"
source: "https://speakerdeck.com/susisu/kyoto-dot-nanka-number-7"
author:
  - "[[Susisu]]"
published: 2024-08-23
created: 2025-08-30
description: |
  Goの並行処理の概念（goroutine, context, channel）と、それに対応するTypeScriptの機能（async function, AbortController, AsyncLocalStorage, Streams API）を比較し、解説するスライドです。
tags:
  - "Go"
  - "TypeScript"
  - "Concurrency"
  - "goroutine"
  - "channel"
---

## Go で言うところのアレは TypeScript で言うとコレ

この資料は、Go言語における並行処理の主要な概念が、TypeScriptではどのように表現・実装されるかを比較し、解説するものです。

### 背景: TypeScriptで実現したいこと (スライド 4-9)

- **複数のWorkerの並行処理**: 複数のWorkerを起動し、タスクを並行で処理させたい。mainプロセス終了時には、実行中のタスクが完了するのを待ってから終了させたい。
- **ストリーミング処理**: APIサーバーからのストリームデータを受信し続けながら、クライアントにも転送したい。クライアントとの接続が切れても、サーバー側では処理を継続させたい。

![slide_4](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_4.jpg)
![slide_5](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_5.jpg)
![slide_6](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_6.jpg)
![slide_7](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_7.jpg)
![slide_8](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_8.jpg)

### GoとTypeScriptの概念対応 (スライド 10-12)

Goで慣れ親しんだ以下の概念は、TypeScriptでは次のように対応付けられます。

- **goroutine**: 軽量なスレッド → `async function`
- **context**: キャンセル処理やリクエストスコープの値の伝播 → `AbortController`, `AsyncLocalStorage`
- **channel**: goroutine間のデータ通信 → `Streams API`

![slide_10](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_10.jpg)
![slide_11](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_11.jpg)

### goroutine → `async function` (スライド 13-14)

Goの`go`キーワードによる非同期実行は、TypeScriptの`async function`の即時実行 (`(async () => { ... })();`) で同様の振る舞いを実現できます。

**Go:**

```go
go func() {
    time.Sleep(time.Second)
    fmt.Println("Pong")
}()
fmt.Println("Ping")
```

**TypeScript:**

```typescript
(async function() {
    await setTimeout(1000);
    console.log("Pong");
})();
console.log("Ping");
```

![slide_13](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_13.jpg)

### context → `AbortController` / `AsyncLocalStorage` (スライド 15-19)

- **キャンセル処理**: Goの`context.WithCancel`は、DOM Standardでもある`AbortController`で代替できます。`ac.abort()`を呼ぶことで、関連する非同期処理にキャンセルを通知します。
- **値の伝播**: リクエストスコープの値を引き回す`context.WithValue`のような機能は、単純なオブジェクトの引き回しや、Node.jsの`AsyncLocalStorage`を利用することで実現できます。

**Go (cancel):**

```go
ctx, cancel := context.WithCancel(context.Background())
startWorker(ctx)
// ...
cancel()
```

**TypeScript (cancel):**

```typescript
const ac = new AbortController();
startWorker(ac.signal);
// ...
ac.abort();
```

![slide_15](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_15.jpg)
![slide_18](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_18.jpg)

### channel → `Streams API` (スライド 20-23)

goroutine間のデータ送受信に使う`channel`は、`Streams API`の`TransformStream`などを使うことで同様のパターンを実装できます。データの書き込み側（`writable`）と読み込み側（`readable`）を分離して扱えます。
処理の完了を待つだけなら、`await`を使うのが最もシンプルです。

**Go:**

```go
c := make(chan int)
go func() {
    for n := 0; n < 10; n++ {
        c <- n
    }
    close(c)
}()
for n := range c {
    fmt.Println(n)
}
```

**TypeScript:**

```typescript
const { readable, writable } = new TransformStream<number, number>();
(async function() {
    const writer = writable.getWriter();
    for (let n = 0; n < 10; n++) {
        await writer.write(n);
    }
    await writer.close();
})();
for await (const n of readable) {
    console.log(n);
}
```

![slide_20](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_20.jpg)

### まとめ (スライド 24-25)

- Goの並行処理の考え方は、TypeScriptの標準機能やAPIを組み合わせることで多くが実現可能です。
- ある言語で考えるだけでなく、他の言語のメンタルモデルを応用することで、より柔軟な発想ができるようになります。

![slide_24](https://files.speakerdeck.com/presentations/3724b953da744f43a635d27dffbba12d/slide_24.jpg)
