---
title: "Memory Allocation in Go"
source: "https://nghiant3223.github.io/2025/06/03/memory_allocation_in_go.html"
author:
  - "nghiant3223@gmail.com"
published: 2025-06-03
created: 2025-09-25
description: |
  Goのメモリ割り当ては、アプリケーションのパフォーマンス、スケーラビリティ、応答性に直接影響を与える重要な要素です。この記事では、Goのメモリアロケータを詳細に解説し、そのコアコンポーネント、様々なサイズの割り当てを処理する仕組み、ヒープオブジェクトと並行してスタックがどのように管理されるかを探ります。
tags:
  - Go
  - memory-allocation
  - garbage-collection
  - runtime
  - performance
---

この記事は、Go 1.24を基準に、Linux on ARMアーキテクチャ上でのメモリ割り当てについて解説したものです。

## 導入

Goのメモリ割り当ては、ランタイムの心臓部であり、アプリケーションのパフォーマンスに直結します。Goは`new(T)`や`make`といったシンプルなAPIで複雑さを抽象化していますが、その内部動作を理解することは、効率性を達成する方法や潜在的なボトルネックを特定する上で非常に有益です。

## Goから見た仮想メモリ

Goのランタイムは、OSの標準的な仮想メモリレイアウトに従いますが、ヒープオブジェクトやゴルーチンスタックのメモリ割り当てには、伝統的なヒープセグメントではなく、メモリマップドセグメントを多用します。

### ArenaとPage

Goはメモリマップドセグメントを階層的に管理します。

* **Arena**: 64MBの固定サイズ領域。最も大きな管理単位。
* **Page**: Arenaをさらに分割した8KBの固定サイズ単位。OSのページ（通常4KB）とは異なる。

| ![](/assets/2025-06-03-memory_allocation_in_go/go_memory_pages.png) |
| :---: |
| Memory pages in Go runtime |

### SpanとSize Class

* **Span**: 1つ以上の連続したページからなるメモリ単位。同じサイズのオブジェクトを複数格納することで、メモリの断片化を最小限に抑える*segregated fit*戦略を採用しています。
* **Size Class**: オブジェクトサイズを68のクラスに分類します。小さなオブジェクトの割り当てリクエストは、次のサイズクラスに切り上げられます。これにより、管理が簡素化されますが、若干の内部断片化（メモリの無駄）が発生します。

| ![](/assets/2025-06-03-memory_allocation_in_go/span_with_size_class.png) |
| :---: |
| Two spans with different size classes |

### Span Class

パフォーマンス向上のため、Goのガベージコレクタ（GC）は、ポインタを含まないオブジェクトのスキャンをスキップします。これを実現するために、Spanは以下の2つのクラスに分類されます。

* **scan**: ポインタを含むオブジェクトを格納するSpan。
* **noscan**: ポインタを含まないオブジェクトを格納するSpan。

これにより、合計136のSpan Classが存在します。

### Span Set

同じSpan Classに属する`mspan`（Spanのメタデータを保持する構造体）は、`span set`というデータ構造で管理されます。これはスレッドセーフであり、複数のゴルーチンから並行してアクセス可能です。

### Heap BitsとMalloc Header

GCがオブジェクト内のポインタを効率的に識別するためのメタデータです。

* **Heap Bits**: 512バイト未満のオブジェクト用。Spanの最後に配置されるビットマップで、各ワードがポインタか否かを示します。
* **Malloc Header**: 512バイト以上のオブジェクト用。各オブジェクトの先頭に8バイトのヘッダを付け、型情報へのポインタを格納します。

## ヒープ管理

Goは、グローバルな`mheap`オブジェクトを通じて、メモリマップドセグメント上に独自のヒープを構築します。

### Spanの割り当て: `mheap.alloc`

高並行下での性能劣化を避けるため、現在のGoメモリアロケータはスケーラブルな設計になっています。

* **空きページの追跡**: Radix Tree構造のサマリーを用いて、広大な仮想アドレス空間から連続した空きページを効率的に検索します。
* **ヒープの拡張**: 空きページがない場合、`mmap`システムコールでヒープを拡張します。物理メモリはデマンドページングにより、実際に書き込みが発生した際に割り当てられます。
* **ページキャッシュ**: 各プロセッサ（`P`）はローカルな`pageCache`を持ち、グローバルなロック競合を回避して高速な割り当てを実現します。

| ```flowchart LR  style O fill:#d6e8d5 style G fill:#a7c7e7 style P rx:20,ry:20  0((Start)) --> A A{N < 16} --> |No|B[Acquire lock] B --> C[Find free pages at hint address] subgraph P[**Find pages**] C --> D{Free pages found?} D --> |No|F[Find free pages by walking summary radix tree] end D --> |Yes|E[Release lock] F --> N{Free pages found?} N --> |Yes|E N --> |No|O[Grow the heap] O --> E E --> G[Set up a span] A --> |Yes|H{Is P's page cache empty?} H --> |Yes|I[Acquire lock] I --> J[Allocate a new page cache for P] J --> K[Release lock] K --> L[Find free pages in the page cache] H --> |No|L L --> M{Free pages found?} M --> |Yes|G M --> |No|B G --> 1(((End)))``` |
| :---: |
| Logic for finding free pages for span allocation |

### 中央スパンマネージャ: `mcentral`

`mheap`と各`P`の`mcache`を繋ぐ中間層です。Span Classごとに1つ存在し、空きオブジェクトのない`full`なSpanと、空きのある`partial`なSpanを管理します。GCによるスイープ状態も追跡します。

### プロセッサのメモリアロケータ: `mcache`

各プロセッサ`P`は、ゴルーチンの実行コンテキストとして機能し、独自のメモリアロケータ`mcache`を保持します。これにより、ロックフリーで高速な小オブジェクトの割り当てが可能になります。

| ![](/assets/2025-06-03-memory_allocation_in_go/memory_allocator_recap.png) |
| :---: |
| Recap of memory allocator in Go |

## ヒープ割り当て

`mallocgc`関数がヒープ割り当ての中心的な役割を担い、オブジェクトのサイズとポインタの有無に応じて、3つのカテゴリに分けて処理します。

* **Tiny Objects ( < 16 bytes)**: `mcache`上で非常に効率的に割り当てられます。複数のTiny Objectが1つの16バイトスロットに詰め込まれることもあります。
* **Small Objects (16 bytes - 32 KB)**: ポインタの有無（`scan`/`noscan`）で処理が分岐します。`mcache`から割り当てられ、必要に応じて`mcentral`から新しいSpanを取得します。
* **Large Objects ( > 32 KB)**: `mcache`や`mcentral`を介さず、直接`mheap`から割り当てられます。

## スタック管理

ゴルーチンのスタックもSpan内に割り当てられます。

* **スタックの割り当て (`stackalloc`)**: 通常は`mcache`のスタックキャッシュから、競合時や特殊な状況ではグローバルなスタックプールから割り当てられます。
* **スタックの成長 (`morestack`)**: Goは**Contiguous Stack**方式を採用しています。スタックが不足すると、2倍の大きさの新しいスタックを確保し、古いスタックの内容をコピーします。これにより、「ホットスプリット」問題が解消されました。
* **スタックの再利用 (`stackfree`)**: ゴルーチンが終了すると、そのスタックはキャッシュまたはプールに返却され、再利用されます。

## スタックかヒープか？

Goでは、変数がスタックに配置されるかヒープに配置されるかは、`var`や`new`といったキーワードではなく、コンパイル時の**エスケープ解析（Escape Analysis）**によって決定されます。関数外から参照される可能性のある変数は、安全のためにヒープに"エスケープ"します。これにより、ダングリングポインタのような問題を未然に防ぎます。

```
// $ go build -gcflags="-m" main.go
// ./main.go:6:2: moved to heap: user
// ./main.go:12:10: make([]User, 100) does not escape
```

## ケーススタディ

1. **スライスの基底配列の再利用**: `slice[:0]`のようにスライスをリセットすることで、新たなヒープ割り当てを避け、パフォーマンスを向上させることができます。
2. **複数の変数をstructにまとめる**: 関連する複数の変数を1つのstructにまとめることで、ヒープ割り当ての回数を1回に減らし、オーバーヘッドを削減できます。
3. **`sync.Pool`によるオブジェクトの再利用**: `fmt`パッケージのように、同じ型のオブジェクトが頻繁に生成・破棄される場合、`sync.Pool`を使ってオブジェクトをキャッシュし再利用することで、GCの負荷を大幅に軽減できます。

## 結論

Goのメモリアロケータは、`mheap`、`mcentral`、`mcache`の階層的な戦略により、高並行アプリケーションで高い効率を実現するように設計されています。開発者は通常これらの詳細を意識する必要はありませんが、内部構造を理解することで、よりパフォーマンスの高いコードを書くための知見が得られます。
