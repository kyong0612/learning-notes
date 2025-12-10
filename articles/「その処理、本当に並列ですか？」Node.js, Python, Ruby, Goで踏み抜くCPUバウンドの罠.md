---
title: "「その処理、本当に並列ですか？」Node.js, Python, Ruby, Goで踏み抜くCPUバウンドの罠"
source: "https://zenn.dev/hacobell_dev/articles/learning-multithreading-in-several-languages"
author:
  - "ほりしょー（h0r15h0）"
published: 2025-12-08
created: 2025-12-10
description: |
  Node.js、Python、Ruby、Goの4つの言語における並行処理モデルの違いを、CPUバウンドなタスクとI/Oバウンドなタスクの観点から実際のコード例を交えて解説。各言語の制約（シングルスレッド、GIL、GVL）とその解決策（Worker Threads、multiprocessing、Ractor、Goroutine）を比較検証する。
tags:
  - Go
  - Node.js
  - Python
  - Ruby
  - 並行処理
  - マルチスレッド
  - GIL
  - Goroutine
---

## はじめに

現代のアプリケーション開発において、マルチコアCPUの性能を最大限に引き出すための並行処理の理解は不可欠。しかし、使用する言語によってそのアプローチや内部的な挙動は大きく異なる。

本記事では、**Node.js, Python, Ruby, Go**の4言語における並行処理モデルが「CPUバウンドなタスク」と「I/Oバウンドなタスク」に対してどのように振る舞うのかを検証する。

> **前提**: マルチコア実行環境を想定。シングルコア環境では並行・並列処理の効果が得られない場合がある。

---

## Node.js: シングルスレッドとノンブロッキングI/O

**検証バージョン**: Node.js v22.17.0

### I/Oバウンドなタスク ⭕

Node.jsはI/Oバウンドなタスクで真価を発揮する。`Promise.all`を使えば、データベースクエリや外部API呼び出しを効率的に並行実行できる。

```javascript
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const main = async () => {
  await Promise.all([
    fetchData("https://api.example.com/data1"),
    fetchData("https://api.example.com/data2"),
  ]);
};
```

→ 2つのAPI呼び出しがほぼ同時に開始され、全体の処理時間は約1回分の待ち時間で済む。

### CPUバウンドなタスク ❌

```javascript
const cpuHeavyTask = async (taskName) => {
  console.log(`${taskName}: 開始`);
  for (let i = 0; i < 5_000_000_000; i++) {}
  console.log(`${taskName}: 終了`);
};

await Promise.all([
  cpuHeavyTask("タスクA"),
  cpuHeavyTask("タスクB"),
]);
```

**結果**:

```
タスクA: 開始
タスクA: 終了 (約1000ms)
タスクB: 開始
タスクB: 終了 (約1000ms)
全処理終了 (約2000ms)  ← 逐次実行になる
```

**原因**: Node.jsはシングルスレッドで動作。`Promise`や`async/await`はI/O待ちのようなノンブロッキング処理でのみ有効。CPUを占有する処理では、`for`ループが完了するまで他の処理に進めない。

### 解決策: Worker Threads

Node.js v10.5.0以降で利用可能。別のOSスレッドでJavaScriptコードを実行できる。

**worker.js**:

```javascript
const { parentPort, workerData } = require('worker_threads');

const cpuHeavyTask = (taskName) => {
  console.log(`${taskName}: 開始`);
  for (let i = 0; i < 5_000_000_000; i++) {}
  console.log(`${taskName}: 終了`);
};

const result = cpuHeavyTask(workerData.taskName);
parentPort.postMessage(result);
```

**main.js**:

```javascript
const { Worker } = require('worker_threads');

const runWorker = (taskName) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: { taskName }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
};

await Promise.all([
  runWorker("タスクA"),
  runWorker("タスクB"),
]);
// → 約1000ms（1タスク分）で完了
```

> ⚠️ Worker Threadsの起動にはオーバーヘッドがある。軽量な処理やI/Oバウンドな処理では逆に遅くなる場合がある。

---

## Python: マルチスレッドとGIL (Global Interpreter Lock)

**検証バージョン**: Python 3.13.7

### I/Oバウンドなタスク ⭕

Pythonの`threading`モジュールはI/Oバウンドなタスクで有効。

```python
import threading
import time

def io_heavy_task(task_name, sleep_time):
    time.sleep(sleep_time)  # I/O待ちをシミュレート

t1 = threading.Thread(target=io_heavy_task, args=("タスクA", 1))
t2 = threading.Thread(target=io_heavy_task, args=("タスクB", 1))
t1.start(); t2.start()
t1.join(); t2.join()
# → 約1秒で完了
```

### CPUバウンドなタスク ❌

```python
import threading
import time

def cpu_heavy_task(task_name):
    print(f"{task_name}: 開始")
    for i in range(5_000_000_000):
        pass
    print(f"{task_name}: 終了")

t1 = threading.Thread(target=cpu_heavy_task, args=("タスクA",))
t2 = threading.Thread(target=cpu_heavy_task, args=("タスクB",))
t1.start(); t2.start()
t1.join(); t2.join()
```

**結果**:

```
タスクA: 開始
タスクB: 開始
タスクA: 終了 (2.01s)
タスクB: 終了 (2.02s)
全処理終了 (2.03s)  ← 2タスク分の時間がかかる
```

**原因**: **GIL (Global Interpreter Lock)** が存在。GILは一種の排他制御で、複数のスレッドが同時にPythonオブジェクトにアクセスすることを防ぐ。CPUバウンドなタスクでは、各スレッドがGILを取得・解放を繰り返すため、実質的に1スレッドずつ順番に処理される。

> 📌 **Python 3.14以降**: GILを無効化できる実験的ビルド（free-threaded build）が提供されている。ただし、エコシステム全体が追いついていない可能性があるため、本番環境での採用前には十分な検証が必要。

### 解決策: multiprocessing

別プロセスを起動することで、各プロセスが独立したGILを持ち、並列実行が可能になる。

```python
import multiprocessing
import time

def cpu_heavy_task(task_name):
    print(f"{task_name}: 開始")
    for i in range(5_000_000_000):
        pass
    print(f"{task_name}: 終了")

if __name__ == '__main__':
    with multiprocessing.Pool(processes=2) as pool:
        pool.map(cpu_heavy_task, ["タスクA", "タスクB"])
    # → 約1.10秒（1タスク分）で完了
```

---

## Ruby: マルチスレッドとGVL (Global VM Lock)

**検証バージョン**: Ruby 3.4.7

### I/Oバウンドなタスク ⭕

RubyもPythonと同様、スレッドがI/O待ちに入るとGVLを解放するため、I/Oバウンドな処理ではマルチスレッドが有効。

### CPUバウンドなタスク ❌

```ruby
def cpu_heavy_task(task_name)
  puts "#{task_name}: 開始"
  5_000_000_000.times do |i|
  end
  puts "#{task_name}: 終了"
end

t1 = Thread.new { cpu_heavy_task("タスクA") }
t2 = Thread.new { cpu_heavy_task("タスクB") }
t1.join; t2.join
```

**結果**:

```
タスクA: 開始
タスクB: 開始
タスクA: 終了 (約2.00s)
タスクB: 終了 (約2.01s)
全処理終了 (約2.01s)  ← 2タスク分の時間がかかる
```

**原因**: **GVL (Global VM Lock)** がPythonのGILと同様の役割を果たす。複数のスレッドが同時にRubyのVMでコードを実行することができない。

### 解決策: Ractor

Ruby 3.0以降で導入された並列実行機構。各Ractorが独立したGVLを持つ。

```ruby
def cpu_heavy_task(task_name)
  puts "#{task_name}: 開始"
  5_000_000_000.times do |i|
  end
  puts "#{task_name}: 終了"
end

r1 = Ractor.new { cpu_heavy_task("タスクA") }
r2 = Ractor.new { cpu_heavy_task("タスクB") }
r1.take; r2.take
# → 約1.02秒（1タスク分）で完了
```

---

## Go: 軽量スレッドGoroutine

**検証バージョン**: Go 1.24.6

### I/Oバウンドなタスク ⭕

Goroutineを使えば、複数のHTTPリクエストを効率的に並行実行できる。

```go
func fetchData(url string, wg *sync.WaitGroup) {
    defer wg.Done()
    resp, _ := http.Get(url)
    defer resp.Body.Close()
    io.ReadAll(resp.Body)
}

var wg sync.WaitGroup
urls := []string{"url1", "url2", "url3"}
wg.Add(len(urls))
for _, url := range urls {
    go fetchData(url, &wg)
}
wg.Wait()
```

### CPUバウンドなタスク ⭕

```go
func cpuHeavyTask(taskName string, wg *sync.WaitGroup) {
    defer wg.Done()
    fmt.Printf("%s: 開始\n", taskName)
    for i := 0; i < 10_000_000_000; i++ {}
    fmt.Printf("%s: 終了\n", taskName)
}

var wg sync.WaitGroup
wg.Add(2)
go cpuHeavyTask("タスクA", &wg)
go cpuHeavyTask("タスクB", &wg)
wg.Wait()
```

**結果**:

```
タスクB: 開始
タスクA: 開始
タスクA: 終了 (約1.01s)
タスクB: 終了 (約1.02s)
全処理終了 (約1.03s)  ← 1タスク分の時間で完了！
```

**理由**: GoにはGIL/GVLのようなグローバルなロックが存在しない。Goのランタイムは、Goroutineを複数のOSスレッド（異なるCPUコア）に柔軟に割り当てて実行する。

> 📌 `GOMAXPROCS()`の設定によっては並列にならない場合がある。Go 1.5以降ではデフォルトで利用可能なCPUコア数が設定される。

---

## まとめ: 各言語の並行処理モデル比較表

| 言語 | 並行処理モデル | I/Oバウンド | CPUバウンド | 制約・特徴 |
|------|--------------|-------------|-------------|-----------|
| **Node.js** | シングルスレッド + ノンブロッキングI/O | ⭕ 効率的に並行実行 | ❌ 逐次実行になる | メインスレッドをブロックすると他の処理も停止 |
| **Python** | マルチスレッド + GIL | ⭕ 並行実行可能 | ❌ GILにより逐次実行 | GILが1スレッドずつの実行を強制 ※3.14以降はfree-threaded buildで改善 |
| **Ruby** | マルチスレッド + GVL | ⭕ 並行実行可能 | ❌ GVLにより逐次実行 | GVLが1スレッドずつの実行を強制 |
| **Go** | 軽量スレッド Goroutine | ⭕ 効率的に並行実行 | ⭕ 並列実行 | マルチコアを活用可能、GIL/GVLなし |

### 各言語のCPUバウンド解決策

| 言語 | 解決策 | 仕組み |
|------|--------|--------|
| Node.js | Worker Threads | 別のOSスレッドでJavaScriptを実行 |
| Python | multiprocessing | 別プロセスを起動（独立したGIL） |
| Ruby | Ractor | 独立したGVLを持つ並列実行機構 |
| Go | Goroutine（標準機能） | ランタイムが複数OSスレッドに分配 |

---

## 重要な結論

1. **言語選択の重要性**: どの言語が優れているかではなく、**どのタスクに、どの言語が適しているか**を理解することが重要
2. **I/Oバウンド**: 4言語すべてで効率的な並行処理が可能
3. **CPUバウンド**: Goのみがネイティブで並列実行をサポート。他の言語では追加の機構（Worker Threads, multiprocessing, Ractor）が必要
4. **オーバーヘッドへの注意**: 軽量な処理では並列化のオーバーヘッドにより逆に遅くなる場合がある
