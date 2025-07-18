---
title: "Goroutine はなぜ軽量スレッドと称されるのか"
source: "https://www.ren510.dev/blog/goroutine-concurrency"
author:
  - "[[ごとれん]]"
published: 2022-07-17
created: 2025-07-18
updated: 2025-07-18
description: "Go を書いたことがある人なら、Goroutine というワードを耳にしたことがあるかと思います。Goroutine とは、Go で並行処理を実現するための軽量なスレッドのことです。Goroutine は一般的なカーネルスレッドと比較して、非常に軽量かつ効率的なスケジューリングが可能です。今回のブログでは、Go ランタイムの仕組みを覗き Goroutine が '軽量スレッド' と呼ばれる理由についてまとめてみたいと思います。"
category: "技術記事"
topics:
  - "Go Runtime"
  - "並行処理"
  - "並列処理"
  - "軽量スレッド"
  - "コンテキストスイッチ"
  - "C10K問題"
  - "システムプログラミング"
tags:
  - "clippings"
  - "Go"
  - "Golang"
  - "Goroutine"
  - "Concurrency"
  - "並行処理"
  - "マルチスレッド"
  - "パフォーマンス"
  - "システムアーキテクチャ"
language: "ja"
---
- ![profile](https://www.ren510.dev/_next/image?url=%2Fstatic%2Fimages%2Fprofile.png&w=96&q=75)
	ごとれん
	[@ren510dev](https://x.com/ren510dev)

## 目次

- [目次](https://www.ren510.dev/blog/#%E7%9B%AE%E6%AC%A1)
- [はじめに](https://www.ren510.dev/blog/#%E3%81%AF%E3%81%98%E3%82%81%E3%81%AB)
- [「並行」と「並列」は違う](https://www.ren510.dev/blog/#%E4%B8%A6%E8%A1%8C%E3%81%A8%E4%B8%A6%E5%88%97%E3%81%AF%E9%81%95%E3%81%86)
- [時間軸](https://www.ren510.dev/blog/#%E6%99%82%E9%96%93%E8%BB%B8)
- [構成と実行](https://www.ren510.dev/blog/#%E6%A7%8B%E6%88%90%E3%81%A8%E5%AE%9F%E8%A1%8C)
- [リソースの割り当てと切り替え](https://www.ren510.dev/blog/#%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AE%E5%89%B2%E3%82%8A%E5%BD%93%E3%81%A6%E3%81%A8%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88)
- [プロセス](https://www.ren510.dev/blog/#%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9)
- [スレッド](https://www.ren510.dev/blog/#%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89)
- [コンテキストスイッチ](https://www.ren510.dev/blog/#%E3%82%B3%E3%83%B3%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81)
- [処理方式](https://www.ren510.dev/blog/#%E5%87%A6%E7%90%86%E6%96%B9%E5%BC%8F)
- [Iterative Server](https://www.ren510.dev/blog/#iterative-server)
- [Concurrent Server](https://www.ren510.dev/blog/#concurrent-server)
- [マルチスレッド](https://www.ren510.dev/blog/#%E3%83%9E%E3%83%AB%E3%83%81%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89)
- [Goroutine](https://www.ren510.dev/blog/#goroutine)
- [概要](https://www.ren510.dev/blog/#%E6%A6%82%E8%A6%81)
- [特徴](https://www.ren510.dev/blog/#%E7%89%B9%E5%BE%B4)
- [Goroutine の位置付け](https://www.ren510.dev/blog/#goroutine-%E3%81%AE%E4%BD%8D%E7%BD%AE%E4%BB%98%E3%81%91)
- [Go ランタイムは "ミニ OS"](https://www.ren510.dev/blog/#go-%E3%83%A9%E3%83%B3%E3%82%BF%E3%82%A4%E3%83%A0%E3%81%AF-%E3%83%9F%E3%83%8B-os)
- [Goroutine の適切な数](https://www.ren510.dev/blog/#goroutine-%E3%81%AE%E9%81%A9%E5%88%87%E3%81%AA%E6%95%B0)
- [runtime/proc.go](https://www.ren510.dev/blog/#runtimeprocgo)
- [まとめ](https://www.ren510.dev/blog/#%E3%81%BE%E3%81%A8%E3%82%81)
- [参考・引用](https://www.ren510.dev/blog/#%E5%8F%82%E8%80%83%E5%BC%95%E7%94%A8)

[![overview.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719041554/blog/goroutine-concurrency/overview.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719041554/blog/goroutine-concurrency/overview.png)

## はじめに

Go を書いたことがある人なら、Goroutine というワードを耳にしたことがあるかと思います。 Goroutine とは、Go で並行処理を実現するための軽量なスレッドのことです。 Goroutine は一般的なカーネルスレッドと比較して、非常に軽量かつ効率的なスケジューリングが可能です。

今回のブログでは、Go ランタイムの仕組みを覗き Goroutine が "軽量スレッド" と呼ばれる理由についてまとめてみたいと思います。

## 「並行」と「並列」は違う

前提としてコンピュータの世界における「並行」と「並列」は違う、という点について述べておきたいと思います。

**並行（Concurrency）** と **並列（Parallelism）** はコンピューティングにおける概念で、どちらも複数のタスクを同時に処理することを指していますが、具体的なアプローチと動作は異なります。

両者は異なる概念であり、一緒にされるべきではありません。

**並行処理** は、複数のタスクを同時進行のように実行する処理形態で、タスクは交互に実行されます。 他方の **並列処理** は、実際に複数のタスクが物理的に同時に実行される処理形態で、複数の CPU コアやプロセッサを利用します。

Goroutine は並行処理（Concurrency）を実現する 仕組みになります。

| 特徴 | 並行処理（Concurrency） | 並列処理（Parallelism） |
| --- | --- | --- |
| 実行方法例 | 一つの CPU がタスクリストを迅速に切り替える | 複数の CPU コアが同時に異なるタスクを実行 |
| 目的 | 複数のタスクを同時進行して見せる | 複数のタスクを同時に実行する |
| リソース | 単一リソースを共有 | 複数のリソースを使用 |
| 適用例 | マルチタスキング、I/O 待ちの最適化 | 科学計算、ビッグデータ解析 |

## 時間軸

- 並行処理：ある時間の **『範囲』** において、複数のタスクを扱うこと
- 並列処理：ある時間の **『点』** において、複数のタスクを扱うこと

[![timeline-perspective.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195079/blog/goroutine-concurrency/timeline-perspective.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195079/blog/goroutine-concurrency/timeline-perspective.png)

[書籍：Linux System Programming, 2nd Edition Chap.7](https://www.oreilly.com/library/view/linux-system-programming/9781449341527/) でも "時間" という観点での違いが言及されています。

> Concurrency is the ability of two or more threads to execute in overlapping time periods.  
> Parallelism is the ability to execute two or more threads simultaneously.

> 並行処理は、複数個のスレッドを共通の期間内で実行する能力のことです。  
> 並列処理は、複数個のスレッドを同時に実行する能力のことです。

## 構成と実行

- 並行処理：複数の処理を独立に実行できる **構成** のこと
- 並列処理：複数の処理を同時に **実行** すること

[![structure-and-execution-perspective.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195282/blog/goroutine-concurrency/structure-and-execution-perspective.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195282/blog/goroutine-concurrency/structure-and-execution-perspective.png)

Go 公式ブログの [The Go Blog - Concurrency is not parallelism](https://go.dev/blog/waza-talk) の記事の中でも、並行と並列は異なる概念であることが述べられています。

> In programming, concurrency is the composition of independently executing processes, while parallelism is the simultaneous execution of (possibly related) computations. Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once.

> プログラミングにおいて、並列処理は（関連する可能性のある）処理を同時に実行することであるのに対し、並行処理はプロセスをそれぞれ独立に実行できるような構成のことを指します。 並行処理は一度に多くのことを「扱う」ことであり、並列処理は一度に多くのことを「行う」ことです。

## リソースの割り当てと切り替え

## プロセス

プロセスとは、OS とユーザインターフェースにおける処理実行の基本単位のことです。

例えば、UNIX 系なら、 `ps` コマンドや `top` コマンドで現在実行されているプロセスを確認することができます。

通常、プロセス間のメモリ空間は分離されています。 プログラムは、プロセスを介して OS にリソースを要求することで、空きがある場合にメモリを追加取得することができます。 いわゆる、 `malloc` というやつです。

```c
// int型 4byte 分のメモリを動的に割り当てる

int *p = (int *)malloc(4 * sizeof(int));

// メモリの解放

free(p);
```

`malloc` は OS のメモリ管理サブシステムに対して、ユーザ空間からシステムコール（OS に対するリソース要求）をかけてヒープメモリを確保・開放します。

> ヒープメモリ
> 
> - プログラムが実行時に動的にメモリを割り当てるための領域で、OS から提供される
> - 任意のサイズで追加や解放ができる柔軟性がある

## スレッド

スレッドとは、プロセスのコンテキスト内で実行されるひとまとまりの命令のことです。

特定のプロセス内のスレッドは `ps` コマンドに PID（プロセスの ID）を渡して確認することができます。

```shell
$ ps -eLf | grep [PID]
```

単一プロセス内で動作するスレッドはメモリ空間、処理に必要なリソースを共有します。 スレッドはプログラムを実行する際のコンテキスト情報が最小で済むため、コンテキストスイッチはプロセスの切り替えと比較して速くなります。

スレッドは、プログラム内のコードにより管理することが可能な **ユーザレベルスレッド（ULT：User-Lebel Thread）** と、OS カーネルが管理する **カーネルレベルスレッド（KLT：Kernel-Level Thread）** が存在し、いずれも CPU コアに対してマッピングされます。

ユーザスレッドは、1990 年代、Java の初期バージョン（特に Java 1.1 以前）において、JVM（Java Virtual Machine）のスレッド管理に採用されました。 当初の開発担当チームが Green Team（米 Sun Microsystems, Inc. の Java 開発チーム）であったことから、ユーザスレッドは、 [グリーンスレッド（Green Thread）](https://en.wikipedia.org/wiki/Green_thread) と呼ばれることもあります。 [参考](https://web.archive.org/web/20080530073139/http://java.sun.com/features/1998/05/birthday.html)

ちなみに、 [Sun Microsystems, Inc.](https://en.wikipedia.org/wiki/Sun_Microsystems) は現在の Oracle, Inc. にあたります。

## コンテキストスイッチ

コンテキストスイッチとは、CPU が現在実行しているプロセスやスレッドを一時停止し、他のプロセスやスレッドに切り替えて実行を再開することです。

[![contextswitch.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719119831/blog/goroutine-concurrency/contextswitch.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719119831/blog/goroutine-concurrency/contextswitch.png)

例えるなら、プロセスの切り替えは、数学と近代史の勉強を交互に行うようなもので、スレッド間の切り替えは、数学において特定の分野を切り替えるようなものです。 異なる科目・分野を交互に勉強する際に発生する、切り替えの労力がコンテキストスイッチにあたります。

## 処理方式

Goroutine の前に、最も単純なクライアントとサーバ間のやり取りを例に挙げ、Iterative Server と Concurrent Server の 2 つの処理方式を紹介します。

## Iterative Server

[![iterative-server.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094092/blog/goroutine-concurrency/iterative-server.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094092/blog/goroutine-concurrency/iterative-server.png)

Iterative Server（反復サーバ）とは、サーバプログラムがクライアントからのリクエストを一度に一つずつ処理する方式のことを指します。 この方式では、サーバは一つのリクエストを完全に処理し終えるまで次のリクエストを受け付けないため、各リクエストは順次（シーケンシャルに）処理されます。

[![socket-api.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094600/blog/goroutine-concurrency/socket-api.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094600/blog/goroutine-concurrency/socket-api.png)

Iterative Server は各クライアントからのリクエストが小さく、サーバの処理が限られるアプリケーションでは効率的に機能します。

一方で、一つのクライアントの処理に負荷がかかりすぎると、他のすべてのクライアントが接続するまでに掛かる時間が許容限度を超えるため、同時に複数のリクエストを裁く局面でボトルネックが発生します。

## Concurrent Server

[![concurrent-server.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094096/blog/goroutine-concurrency/concurrent-server.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094096/blog/goroutine-concurrency/concurrent-server.png)

Concurrent Server（同時実行サーバ）は、複数のクライアントからのリクエストを同時に受け付けて処理するサーバを指します。 複数の処理を "タスク" という単位で並行実行することで、サーバ全体のスループットを向上させることが可能です。

近年の OS（UNIX 系、Windows 等）では、Iterative Server の課題を解決するための方法が用意されており、マルチタスク OS と呼ばれます。 マルチタスク OS は、プロセスやスレッドを利用することで一つのクライアントの処理を、独立して動作するサーバのコピーを使用して同時に処理します。

一般に、現在のプロセス（親プロセス）をコピーして新しいプロセス（子プロセス）を作成することを [fork](https://man7.org/linux/man-pages/man2/fork.2.html) と言います。

マルチタスクでは、 OS が複数のタスク（プログラムやプロセス）を同時に実行するように **見せかけて** 実行 します。 つまり、実際には一つの CPU が高速にタスクを切り替え、あたかも複数のタスクを同時に実行しているかのように見せかけているのです。

[![process-fork.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094689/blog/goroutine-concurrency/process-fork.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094689/blog/goroutine-concurrency/process-fork.png)

Concurrent Server は複数のプロセス（fork した子プロセス）を使用することで並行処理を実現し、多数のクライアントからの接続を効率的に捌くことが可能です。

一方で、プロセスの切り替えに伴うコンテキストスイッチは、オーバーヘッドとなるためパフォーマンスが極端に劣化する可能性があります。

## マルチスレッド

マルチスレッドとは、 一つのプロセスを複数のスレッドに分けて処理する ことで、処理速度の向上を実現する並行処理方式です。

各プロセスは最低一つのスレッドを保持しており、複数のプロセスを使用するプログラムを実行した場合は、複数のスレッドを使用します。 複数のプロセスに存在するスレッドを切り替える場合、メモリ空間の切り替えが必要となるため、コンテキストスイッチが発生し、処理に掛かる時間が増加します。 さらに、一つのプロセスは一つのアドレス空間でもあるため、プロセスを生成するためには、新たなアドレス空間を確保する必要があり、メモリ消費量が増大します。

一方で、スレッドの生成は、現在のプロセスのアドレス空間を使用するため、システムへの負荷が小さくなります。 プロセスの切り替えにはアドレス空間の切り替えが伴いますが、単一プロセス上で動作するスレッドの場合、アドレス空間の切り替えは発生しません。 従って、スレッドの切り替えに要する時間は、プロセスの切り替えに要する時間に比べて短くなります。

通常、シングルコアの場合、CPU は一度に一つの処理しか実行できないため、マルチスレッドを実装した場合でも、シングルスレッドに比べて処理時間が長くなることがあります。

[![multithread-processing.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094786/blog/goroutine-concurrency/multithread-processing.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719094786/blog/goroutine-concurrency/multithread-processing.png)

こちらは、シングルコア CPU とマルチコア CPU におけるマルチスレッドの処理時間の比較を示しています。

マルチスレッドは、実行コアが複数存在する場合において、スレッドを用いることで多数の処理を並行して進められるため、結果として処理速度が速くなります。

現代の CPU のほとんどはマルチコアを実装しており、複数のコアで一度に並行処理を実現することが可能です。 プロセスの作成は OS によって行われ、メモリ、スタック、ファイルディスクリプタ等を割り当てることで特定の処理を実行します。

一方で、接続されるクライアント毎にプロセスを割り当てる場合、親プロセスのすべての状態をコピー（fork）する必要があるため、オーバーヘッドが高くなるという問題があります。

これに対し、スレッドは同一プロセスの中で複数のタスクを処理できるため、計算コストを削減することが可能です。 また、新しく生成されたスレッドは親スレッドと同じアドレス空間を共有するため、親プロセスの状態をコピーする必要はありません。

[![process-thread-creation.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719124100/blog/goroutine-concurrency/process-thread-creation.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719124100/blog/goroutine-concurrency/process-thread-creation.png)

カーネルスケジューラ（OS のスレッドスケジューラ）は、一つのプロセス上で動作するプログラムにおいて、各スレッドを順番に短時間ずつ処理を再開していきます。 その際、順番やタイムスライスはスレッド毎に設定されている優先度によって決定され、ランキューと呼ばれるリストに入っている実行予定のスレッドに対して、公平に処理が回るようにスケジューリングされます。

> タイムスライス
> 
> - スレッドが一回に実行する実行時間

[![kernel-scheduler-1.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719122091/blog/goroutine-concurrency/kernel-scheduler-1.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719122091/blog/goroutine-concurrency/kernel-scheduler-1.png)

[![kernel-scheduler-2.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195468/blog/goroutine-concurrency/kernel-scheduler-2.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719195468/blog/goroutine-concurrency/kernel-scheduler-2.png)

スレッドを使用したマルチスレッド処理は効率的ですが、スレッド自体の生産、破棄の際に、OS に対して都度、システムコールを行う必要があります。 さらに、スレッド間のコンテキストスイッチはプログラムカウンタやメモリ参照場所の切り替えが必要となるためオーバーヘッドとなります。

[![contextswitch-overhead.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719123074/blog/goroutine-concurrency/contextswitch-overhead.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719123074/blog/goroutine-concurrency/contextswitch-overhead.png)

近年では、増加し続けるクライアントに対して、マルチスレッドによる並行処理が必要となりますが、カーネルスレッドは、生成するほどオーバーヘッドも増大するため処理負荷が高くなります。

当然、サーバ側の物理的なリソースを増やせば対処できるでしょうが、本質的な解決にはなっておらず、OS の内部処理に絡む厄介な問題として浮き彫りになっています。 いわゆる [C10K 問題](http://www.kegel.com/c10k.html) がその代表的な例として挙げられます。

[Dan Kegel - The C10K problem](http://www.kegel.com/c10k.html)

> C10K 問題
> 
> - 「Concurrently handling 10,000 connections（同時に 10,000 の接続を処理する）」の略
> - 1999 年に Dan Kegel によって提唱された（かなり前）
> - 高トラフィックのネットワークサーバ、特に 10,000 以上のクライアント接続を同時に扱う際に発生するサーバのパフォーマンス問題

> C10K 問題の背景
> 
> - リソース使用量
> 	- 各接続に対して独立したスレッドやプロセスを割り当てる従来のモデルでは、膨大なメモリと CPU リソースが消費される
> - スレッド / プロセスのオーバーヘッド
> 	- 多数のスレッドやプロセスの生成にはオーバーヘッドが伴い、スケジューリングやコンテキストスイッチの頻度が増加する
> - スケーラビリティの限界
> 	- ネットワークソケットや入出力操作の非効率的な管理が、システムのスケーラビリティに制約をかける

平たく言えば、従来のスレッドを用いた並列な処理技術は、限界を迎えているということです。

では、Goroutine は従来のマルチスレッド処理とどう違うのでしょうか？

## Goroutine

## 概要

Goroutine とは、Go ランタイムの最も基本的な構成単位です。 つまり、 Go ランタイムは複数の Goroutine から成り立っている と言えます。

Go のユーザは `go` というディレクティブを用いて、メソッドを呼び出すことによって、その関数コンテキストをメインプロセスと並行実行させることができます。 このことから、Goroutine は 並行処理の基本単位 としても扱われます。

↓ こんな書き方

```
package main

import (

    "fmt"

    "time"

)

func say(s string) {

    for i := 0; i < 5; i++ {

        time.Sleep(100 * time.Millisecond)

        fmt.Println(s)

    }

}

func main() {

    go say("world")

    say("hello")

}
```

## 特徴

Go の開発者の一人である Rob Pike 氏による定義 と [How Goroutines Work](https://blog.nindalf.com/posts/how-goroutines-work/) に詳しい記述があります。

要約すると Goroutine には以下の特徴があるとされています。

- **カーネルスレッドではなくユーザスレッド**
- **メモリ使用量がカーネルスレッドに対して 500 分の 1**
- **コンテキストスイッチに要する時間はカーネルスレッドより短い**
- **生成と破棄にかかる時間はカーネルスレッドより短い**
- **Goroutine は一つのカーネルスレッドに対して複数配置され、必要に応じて動的に利用するカーネルスレッドを増やす**

Goroutine のデフォルトのスタックサイズは 2KB 程で、一般的なスレッド（約 1MB）と比較して 500 分の 1 程度しかありません。

ホストマシンのスタックサイズは `$ ulimit -s` で確認できます。

> スタックメモリ
> 
> - コンパイラや OS が割り当て、アプリケーション側では自由に操作できない領域
> - 関数呼び出し時の情報保存、ローカル環境変数（const で定義したもの）の管理、関数の戻りアドレスの保存に使用される

> Go におけるスタックの扱い
> 
> - エスケープ解析によってポインタのスコープを特定し、ライフタイムが明確なオブジェクトはスタック領域を使用する
> - Go のスタック領域は数キロバイト（2KB）から始まり、必要に応じて動的に拡張される
> - Goroutine 毎に独立したスタック領域を持つ

Q：Goroutine はなぜここまで軽量なのでしょうか。  
  

## Goroutine の位置付け

A：Goroutine はスレッドよりもさらに下に位置するから。

まず、Go が実行されると、Main Goroutine と呼ばれる Goroutine が最低一つ起動します。

Main Goroutine は [runtime](https://pkg.go.dev/runtime) パッケージの `proc.go` の中で書かれています。（ `proc.go` 自体は 7000 行弱）

- [golang/go/src/runtime/proc.go](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/proc.go#L134-L135)

```
//go:linkname main_main main.main

func main_main()
```

ここに、 `func main()` で定義したメインソースが渡されて、Main Goroutine が起動します。

Main Goroutine は、プロセスが開始する際に自動的に生成、起動され、ランタイムの文脈ではメインプロセスに相当します。 生成された Goroutine 間の処理に優先度はなく、排他制御を実装しない限り、すべての Goroutine は非同期で実行 されます。

よく、 **M（Machine thread）, G（Goroutine）, P（Processor）** という記号で説明されていますが、簡単に図に起こすと Goroutine の位置付けは以下のようになります。

[![thread-and-goroutine.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719056581/blog/goroutine-concurrency/thread-and-goroutine.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719056581/blog/goroutine-concurrency/thread-and-goroutine.png)

ポイントは、 スレッドの場合は、CPU コアに対してマッピングされ、OS によって管理されるが、Goroutine は OS のスレッドに対してマッピングされ、Go ランタイムによって管理される ということです。 Go ランタイムおよび Goroutine はユーザ空間プロセスとして実行されるため、カーネルスレッドではなくユーザスレッドということになります。

Goroutine は通常のカーネルスレッドの ID と異なり、指定しない限りどのスレッドにマッピングされるかは決まっていません。 Go ランタイムが決定します。

Go ランタイムは生成された Goroutine に対して以下の責務を持ちます。

- **カーネルから割り当てられたメモリを分割し、必要に応じて割り当てる**
- **ガベージコレクタを動かす**
- **Goroutine のスケジューリングを行う**

カーネルに詳しい人ならこの挙動にピンとくるかもしれませんが、OS のスケジューラがやっていることに近い機能を Go ランタイム自体が行なっています。

まさに、 [こちら](https://ascii.jp/elem/000/001/480/1480872/) にある通り、 Go ランタイムは "ミニ OS" です。

> 「Go のランタイムはミニ OS」 Go 言語のランタイムは、goroutine をスレッドとみなせば、OS と同じ構造であると考えることができます。

## Go ランタイムは "ミニ OS"

Go の [runtime](https://pkg.go.dev/runtime) パッケージを元に、図に起こすと以下のようになるかと思います。

[pkg.go.dev/runtime](https://pkg.go.dev/runtime)

[![goruntime.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719056575/blog/goroutine-concurrency/goruntime.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719056575/blog/goroutine-concurrency/goruntime.png)

Go ランタイムの内部は、主にマシンスレッド、Goroutine、Go ランタイムスケジューラから構成されています。

ここで、マシンスレッドはカーネルにおける物理 CPU コア（論理スレッド）に対応します。 Goroutine はプロセスに相当し、Go ランタイムスケジューラは、OS が提供するスレッドスケジューラと同等の機能を提供します。

Go ランタイムスケジューラは、 **全ての Goroutine のリスト、マシンスレッド（カーネルスレッド）、アイドル状態のリソース（スケジューリングのコンテキスト）** を管理しています。 後者 2 つは連結リストで管理されています。

- [runtime/runtime2.go#g](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/runtime2.go#L422-L532)

```
// G: Goroutine そのもの

type g struct {

    //（一部抜粋）

    stack        stack         // 該当の G をプリエンプトしていいかのフラグをここに立てる

    m            *m            // 該当の G を実行している M

    sched        gobuf         // G に割り当てられたユーザースタック

    atomicstatus atomic.Uint32 // running, waiting といった G の状態

    preempt      bool          // 該当の G をプリエンプトしていいかのフラグをここに立てる

    waiting      *sudog        // 該当の G を元に作られた sudog の連結リスト

}
```

- [runtime/runtime2.go#m](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/runtime2.go#L552-L647)

```
// M: Go ランタイムの文脈においてカーネルのマシンスレッドを示す

type m struct {

    //（一部抜粋）

    g0        *g       // スケジューラを実行する特殊なルーチン G0

    curg      *g       // 該当の M で現在実行している G（current running goroutine）

    p         puintptr // 該当の M に紐付いている P（nil ならその M は今は何も実行していない）

    oldp      puintptr // 以前どこの P に紐付いているのかをここに保持（システムコールからの復帰に使う）

    schedlink muintptr // M の連結リストを作るためのリンク

    mOS                // 該当の M に紐付いている OS のスレッド

}
```

- [runtime/runtime2.go#p](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/runtime2.go#L649-L773)

```
// P: Go の実行に必要なリソースを表す概念

type p struct {

    //（一部抜粋）

    status uint32   // syscall 待ち等の状態を記録

    link   puintptr // P の連結リストを作るためのリンク

    m      muintptr // 該当の P に紐付いている M（nil ならこの P はアイドル状態）

    // P 毎に存在する G のローカルキュー（連結リスト）

    runqhead uint32

    runqtail uint32

    runq     [256]guintptr

    preempt  bool // 該当の P をプリエンプトしていいかのフラグをここに立てる

}
```

現代のカーネルは CPU ***M*** 個のコアに対し、同時に ***N*** 個の複数の処理が可能な ***M:N*** スケジューラを実装しています。 いわゆる、ハイブリッドスレッディングというやつです。

Go ランタイムスケジューラも同様に、 ***N*** 個のカーネルスレッドに、 ***M*** 個のユーザスレッドを対応させたものにスケジューリングされるため、複数の CPU コアを扱うことが可能であり、 ***M:N*** スケジューラを実現しています。

Go ランタイムは [sysmon](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/proc.go#L6031-L6176) と呼ばれる特殊なマシンスレッドが、プログラムの実行においてボトルネックとなる処理を常に監視しています。 その際、sysmon はスケジューラによって実行が止められることがないよう、sysmon が稼働しているマシンスレッドは、特定の OS スケジューラとは別で実行されます。

Go ランタイムスケジューラはランキュー等のスレッドが行う作業を束ね、マシンスレッド毎にタスクとして Goroutine のリストを保持します。 各スケジューラはマシンスレッドを保持しており、実行可能な Goroutine をグローバルキューから取り出して、ローカルキューに保持します。 タスクは Goroutine が実行される際、ローカルキューから Go ランタイムスケジューラによって取り出され、マシンスレッド上で実行されます。

また、 [G0](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/proc.go#L150-L152) （ジーゼロ）はマシンスレッドに割り当てて実行する Goroutine とは別に割り当てた、特別な Goroutine で、実行中の Goroutine が待ち状態、もしくはブロック状態になると起動します。 さらに、Go ランタイムスケジューラを動かすことの他に、Goroutine によって割り当てられたスタックの増減処理や、ガベージコレクタを独自に実行します。

> ガベージコレクタ（Garbage Collector）
> 
> - プログラムが動的に確保したメモリ領域のうち、断片化したメモリ領域や不要になったメモリ領域を自動的に解放する機能

Go ランタイムは常に一つの Goroutine を実行させることはなく、適度に実行する Goroutine を取り替えることにより、プログラム実行の効率化を図ります。 実行中の Goroutine を一旦中断する処理は、 [プリエンプション（Preemption）](https://go.dev/src/runtime/preempt.go) と呼ばれ、sysmon がボトルネックとなっている Goroutine を見つけると実行されます。

ここで、実行のボトルネックになっている Goroutine とは、CPU を長時間占有している Goroutine や、システムコール待ち状態の Goroutine を指します。

以上より、Go は内部で Go ランタイムスケジューラを動作させることにより、OS が提供するスレッドスケジューラとは分離して管理され、異なる Goroutine を実行する際もカーネルスレッドの切り替えを伴わない仕組みを持ちます。 つまり、マシンスレッド上で実行されている Goroutine が Go ランタイムスケジューラによって切り替えられたとしても、OS はコンテキストスイッチを認識しないということです。

その結果、Goroutine の切り替えは、スレッドの切り替えのように、プログラムカウンタやメモリ参照場所の切り替え処理が発生しません。 また、Goroutine は生成と破棄に関する操作が非常に低コストであるため、生成、破棄のたびに OS にシステムコールを行うスレッドに比べると、実行時間が極めて短縮されており、軽量に動作することが可能なのです。

## Goroutine の適切な数

Goroutine は `go` ディレクティブによって容易に生成することができ、スレッドと比較して、非常に軽量かつ効率的なスケジューリングが可能です。

一般に、数百から数百万の Goroutine を単一のプロセス内で生成できるとされていますが、当然上限があります。

例えば、以下のようなコードは短時間に非常に多くの Goroutine が生成されるため、リソース（CPU、メモリ）を大量に消費し、最悪の場合クラッシュや著しいパフォーマンス低下を引き起こす可能性のある危険なコードです。

```
// 無限 for ループの中で Goroutine を呼び出す

package main

import (

    "fmt"

    "time"

)

func doWork(id int) {

    // ここに実際の処理が入る

    fmt.Printf("Goroutine %d finished work\n", id)

}

func main() {

    i := 0

    for {

        go doWork(i)

        i++

    }

}
```

Goroutine を増やすと、処理を割り当てるための Resource（P）が増えることになります。 しかし、P はマシンスレッドに紐付くため、当然、M も増加することになります。 M が増加するということは、CPU は複数のカーネルスレッドに跨って、コンテキストスイッチを実行する必要があります。

本来、Goroutine はカーネルスレッドによるコンテキストスイッチを減らすことで軽量化を実現していたのにこれでは本末転倒です。 そのため、一般に、 Goroutine の数（ `GOMAXPROCS` ）は CPU 数程度（論理スレッド数分）が良い とされています。

```
cpus := runtime.NumCPU() // CPU の論理スレッド数を取得

for i := 0; i < cpus; i++ { // CPU の論理スレッド数分のワーカースレッドを起動

    go doWork1()

    go doWork2()

}
```

[ムーアの法則](http://www.gotw.ca/publications/concurrency-ddj.htm) によれば、集積回路の密集度は年々向上しており、CPU のコア数も増加傾向にあります。

> 集積回路上のトランジスタ数が約 18 ヶ月毎に倍増する。  
> 同じサイズのチップで利用できる計算能力が抜本的に増大し、コンピュータの性能と電力効率が向上する。

[![moore-law.png](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719151392/blog/goroutine-concurrency/moore-law.png)](https://res.cloudinary.com/ren510dev/image/upload/f_auto/v1719151392/blog/goroutine-concurrency/moore-law.png)

Goroutine はマルチコアプロセッサの能力を最大限に活用するための手段として機能し、ハードウェアアーキテクチャの進化に対して効果的に利用することが可能です。

[イベントループなしでのハイパフォーマンス – C10K 問題への Go の回答](https://postd.cc/performance-without-the-event-loop/)

## runtime/proc.go

`proc.go` の `func main()` を軽くコードリードしてみた 🐹

- [golang/go/src/runtime/proc.go](https://github.com/golang/go/blob/44f18706661db8b865719d15a5cfa0515d1a4fca/src/runtime/proc.go)
ソースコードを展開

```
// Main Goroutine の起動

func main() {

    mp := getg().m // 現在のゴルーチンの M（ランタイムスレッド）を取得

    // m0->g0 のレースコンテキストはメインゴルーチンの親としてのみ使用

    mp.g0.racectx = 0

    // 最大スタックサイズを設定

    // - 64bit OS な 1GB

    // - 32bit OS なら 250MB

    // オーバーフローメッセージを分かりやすくするため、10進法を使用

    if goarch.PtrSize == 8 {

        maxstacksize = 1000000000

    } else {

        maxstacksize = 250000000

    }

    // スタックサイズの上限を設定（ランタイムによるランダムクラッシュを防ぐ）

    maxstackceiling = 2 * maxstacksize

    // newproc が新しい Ms を開始できるようにする

    mainStarted = true

    // システムモニター（sysmon）が有効であれば新しい M を生成

    if haveSysmon {

        systemstack(func() {

            newm(sysmon, nil, -1)

        })

    }

    // 初期化中はメインゴルーチンをメイン OS スレッドにロック

    lockOSThread()

    // 現在のスレッドが m0 でなければエラーを投げる

    if mp != &m0 {

        throw("runtime.main not on m0")

    }

    // ランタイムの初期化時間を記録

    runtimeInitTime = nanotime()

    if runtimeInitTime == 0 {

        throw("nanotime returning zero")

    }

    // 初期化トレースが有効な場合、それを開始

    if debug.inittrace != 0 {

        inittrace.id = getg().goid

        inittrace.active = true

    }

    // ランタイムの初期化タスクを実行

    doInit(runtime_inittasks)

    // 初期化中に runtime.Goexit が呼ばれた場合のために、defer でスレッドのアンロックを設定

    needUnlock := true

    defer func() {

        if needUnlock {

            unlockOSThread()

        }

    }()

    // ここで GC を有効化

    gcenable()

    // 初期化完了を通知するためのチャネルを作成

    main_init_done = make(chan bool)

    // CGo の初期化とエラーチェック

    if iscgo {

        if _cgo_pthread_key_created == nil {

            throw("_cgo_pthread_key_created missing")

        }

        if _cgo_thread_start == nil {

            throw("_cgo_thread_start missing")

        }

        if GOOS != "windows" {

            if _cgo_setenv == nil {

                throw("_cgo_setenv missing")

            }

            if _cgo_unsetenv == nil {

                throw("_cgo_unsetenv missing")

            }

        }

        if _cgo_notify_runtime_init_done == nil {

            throw("_cgo_notify_runtime_init_done missing")

        }

        // crosscall2 を指す C 関数ポインタ変数を設定

        if set_crosscall2 == nil {

            throw("set_crosscall2 missing")

        }

        set_crosscall2()

        // テンプレートスレッドを開始

        startTemplateThread()

        cgocall(_cgo_notify_runtime_init_done, nil)

    }

    // 依存モジュールの初期化タスクを実行

    for m := &firstmoduledata; m != nil; m = m.next {

        doInit(m.inittasks)

    }

    // メインの初期化が完了したので初期化トレースを無効化

    inittrace.active = false

    // 初期化が完了したことを通知

    close(main_init_done)

    // スレッドのロックを解除

    needUnlock = false

    unlockOSThread()

    // ビルドモードが「archive」または「library」の場合、メイン関数を実行せずに終了

    if isarchive || islibrary {

        return

    }

    // メインパッケージの main 関数を取得して実行

    fn := main_main // ここで、func main() として定義したものを呼び出す

    fn()

    // レースデータが有効な場合、終了フックを実行してレースを終了

    if raceenabled {

        runExitHooks(0)

        racefini()

    }

    // メイン関数が戻った後に他のゴルーチンがパニックしている場合、その処理が完了するまで待機

    if runningPanicDefers.Load() != 0 {

        for c := 0; c < 1000; c++ {

            if runningPanicDefers.Load() == 0 {

                break

            }

            Gosched()

        }

    }

    if panicking.Load() != 0 {

        gopark(nil, nil, waitReasonPanicWait, traceBlockForever, 1)

    }

    // 終了フックを実行

    runExitHooks(0)

    // プログラムを正常終了

    exit(0)

    for {

        // クリティカルなエラーが発生した場合のフェールセーフとして無限ループを実行しておく

        var x *int32

        *x = 0

    }

}
```

  
  

## まとめ

今回のブログでは、Goroutine が "軽量スレッド" と呼ばれる理由についてまとめました。

元来、プロセスに対して複数のスレッドを使用したマルチスレッドプログラミングが主流でしたが、増え続けるクライアントに対して、カーネルスレッドをベースとしたマルチスレッド処理モデルは OS の内部処理に起因する課題から限界を迎えていました。 一般的なスレッドの場合は、CPU コアに対してマッピングされ、OS によって管理されるため、スレッドの切り替えに伴うコンテキストスイッチによってオーバーヘッドが発生します。

一方で、Goroutine はカーネルスレッドに対してマッピングされ Go ランタイムによって管理されます。 Goroutine の切り替えは、OS から見ればスレッド内部の処理に留まるため、オーバーヘッドが極めて小さくなります。 また、Goroutine のスタックサイズは 2KB 程度しかありません。

Goroutine は、Go ランタイムが提供する ***M:N*** スケジューラを利用することで、単一プロセス内で数百から数百万程度生成が可能とされています。

以上のような処理モデルを備えていることから、Goroutine は "軽量スレッド" と称されています。

**Go は賢い！** これに尽きます。

## 参考・引用

- [O'Reilly - Concurrency in Go](https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/)
- [Concurrent Servers/Iterative server](https://www.brainkart.com/article/Concurrent-Servers-Iterative-server_9106/)
- [Write an echo program with client and iterative server using TCP](https://networkprogrammingnotes.blogspot.com/p/write-echo-program-with-client-and.html)
- [Write an echo program with client and concurrent server using TCP](https://networkprogrammingnotes.blogspot.com/p/write-echo-program-with-client-and_21.html)
- [Linux Kernel Documents Fork - Process Scheduler Implementation](https://osdn.net/projects/linux-kernel-docs/wiki/1.6%E3%80%80%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%A9%E3%81%AE%E5%AE%9F%E8%A3%85)
- [並行処理と並列処理](https://zenn.dev/hsaki/books/golang-concurrency/viewer/term)
- [Goroutine の並行処理によって並列処理を実現する](https://medium.com/sprocket-inc/goroutine-concurrent-and-parallel-programming-669eaae55e73)
- [Golang のポイントまとめ](https://zenn.dev/panyoriokome/scraps/5228710d81ac97)
- [並行処理を支える Go ランタイム](https://zenn.dev/hsaki/books/golang-concurrency/viewer/gointernal)
- [Goroutine 原理](https://yousec995.github.io/2021/07/25/Goroutine%E5%8E%9F%E7%90%86/)
- [Go のワークスティーリング型スケジューラ](https://postd.cc/scheduler/)
- [Why Discord is switching from Go to Rust](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)
- [Goroutine を支える技術](https://note.crohaco.net/2019/golang-goroutine/)
- [Go 言語と並列処理](https://ascii.jp/elem/000/001/480/1480872/)
- [github.com/golang/go/src/runtime](https://github.com/golang/go/tree/master/src/runtime)