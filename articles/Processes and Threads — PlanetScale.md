---
title: "Processes and Threads — PlanetScale"
source: "https://planetscale.com/blog/processes-and-threads"
author:
  - "Ben Dicken"
published: 2025-09-24
created: 2025-09-26
description: "Interactive primer on how modern operating systems use processes and threads for multitasking, illustrated with database-focused examples."
tags:
  - "operating-systems"
  - "processes"
  - "threads"
  - "postgres"
  - "mysql"
---

## CPU and RAM

CPUは数十億のトランジスタを備えたシリコンチップで、基本命令の連続実行により計算を担う。RAMはDRAMチップで構成された短期記憶であり、CPUとマザーボード経由で連携しデータを読み書きする。記事ではCPUパッケージとDDR RAMモジュールの写真を掲載し、両者が相互依存的に動作することを示している。

## Instruction sets

CPUが理解する命令セットにはx86-64やARM64といった複雑な仕様があり、本記事では理解を助けるため簡易的な命令セットを用意してインタラクティブシミュレーションを提示。基本的な算術・分岐・メモリ操作の組み合わせが実用的なプログラムを構築することを説明している。

## Running multiple programs

単一コア環境でもマルチタスクを実現するため、OSはプロセスを切り替えながら実行する。記事のシミュレーションでは偶数と奇数を印字する二つのプロセスを交互にスケジューリングし、タイムスライスと状態保存の手順を視覚化。高速なタイムシェアリングにより人間には同時実行のように見えることを強調する。

## Context Switching

コンテキストスイッチではカーネルモード遷移、レジスタ保存、メモリ管理など多くの処理が伴い、現代CPUでも約5マイクロ秒のオーバーヘッドが生じる。記事は、毎秒数十万回発生しうるスイッチングが億単位の命令を消費するものの、利便性のために受け入れられていると説明する。

## Process States

OSはプロセスをrunning・ready・waiting・killedなどの状態で管理し、時間枠終了やI/O待機で状態遷移が発生する。記事は状態遷移図のインタラクティブ要素を通じて、待機から再度readyに戻る流れや終了条件を具体化している。

## Creating new Processes

プロセス生成には`fork()`で親プロセスを複製し、`execve()`で新しいプログラムを読み込む仕組みがある。記事はPostgresのプロセスごとの接続モデルを例示し、PostMasterと子プロセスの連携を説明。シミュレーションでFORK命令とEXEC命令を導入し、親子プロセスの分岐を可視化している。

## Postgres and MySQL

Postgresは接続ごとに新プロセスを生成するためメモリと管理コストが増える一方、MySQLは単一プロセス内でスレッドを用いて高い同時実行性を確保する。記事は集計処理の例を通じて、プロセス切り替え時間が積み重なることで有効命令数が減少する可能性に言及する。

## Threads

スレッドは同一プロセス空間を共有しながら異なる命令列を実行でき、コンテキストスイッチも約1マイクロ秒と軽量。記事はマルチプロセスとマルチスレッドのビジュアル比較を通じて、RAM状態を共有しつつタスクを分担するMySQLのパターンを紹介。スレッド化によりパフォーマンス優位が得られる場面を示す。

## POSIX threads

Unix系では`pthread_create()`が一般的なスレッド生成APIであり、内部的には`clone()`システムコールを利用する。`CLONE_VM`や`CLONE_FILES`といったフラグの組み合わせによりプロセス生成とスレッド生成を切り替えられる点を解説。記事のシミュレーションではPTCREATE命令で最小値・最大値を並列計算する例を提示する。

## Connection Pooling

接続数の増加はプロセス型・スレッド型双方に負担を与えるため、MySQLやPostgresでは接続プーリングを採用。プーラーが数千のクライアント接続を保持しつつ、DBへの直接接続数を5〜50程度に制限して負荷を平準化する仕組みを説明する。

## Virtual memory

RAMの完全コピーを伴うと仮定したシミュレーションと異なり、実機では仮想記憶により効率的に状態を切り替える。詳細は別稿に譲るとしながらも、さらなる学習リソースとしてWikipediaや教科書を紹介。

## Conclusion

プロセスとスレッドはすべてのソフトウェアが依存する基本抽象であり、用途や性能要件によって使い分ける必要があるとまとめる。記事全体を通じて、写真・アニメーション・インタラクティブデモが理解を補助し、データベース設計やOS構造のトレードオフを明確化している。
