---
title: "Go 1.25におけるコンテナ対応GOMAXPROCSのデフォルト有効化について (@func25氏のスレッド)"
source: "https://x.com/func25/status/1957755212946632814?s=12"
author:
  - "[[@func25]]"
published: 2025-08-19
created: 2025-08-21
description: |
  Go 1.25からLinuxシステムにおいて、コンテナを意識したGOMAXPROCSがデフォルトで有効になります。この記事では、その変更に関する重要なポイントを解説します。
tags:
  - "Go"
  - "GOMAXPROCS"
  - "container"
  - "performance"
  - "clippings"
---

## Go 1.25におけるコンテナ対応GOMAXPROCS

Go 1.25からLinuxシステムにおいて、コンテナを意識した`GOMAXPROCS`がデフォルトで有効になります。

> GOMAXPROCSの問題点については、こちらの記事を参照してください: <https://victoriametrics.com/blog/kubernetes-cpu-go-gomaxprocs/>

この変更について知っておくべき重要な点は以下の通りです。

### 1. 機能が有効になる条件

* この機能は、Goプログラムが**cgroupでCPU制限が設定された**コンテナ内で実行されている場合にのみ有効になります。
* コンテナを使用していない場合や、コンテナにCPU制限が設定されていない場合、ランタイムはcgroupのCPU制限を検出できず、従来通り利用可能な全てのCPUコアを数えるデフォルトの動作に戻ります。

### 2. GOMAXPROCSの動的な更新

* Goランタイムは起動時に一度だけ`GOMAXPROCS`を設定するわけではありません。
* `sysmon`と呼ばれる特別なゴルーチンがバックグラウンドで動作し、定期的にコンテナのCPU制限の変更をチェックし、`GOMAXPROCS`を更新します。
* ただし、`GOMAXPROCS`を**明示的に環境変数などで設定した場合、この自動更新は完全に停止します**。

### 3. GOMAXPROCSの計算式

* 計算式: `GOMAXPROCS = min(affinity_count, max(2, ceil(quota/period)))`
* `GOMAXPROCS`の**最小値は常に2**です（`affinity_count`が2未満の場合を除く）。
* コンテナのCPU制限が少数であっても、**次の整数に切り上げられます**。
  * 例: CPU制限を0.5コアに設定しても`GOMAXPROCS=2`になります。
  * 例: 2.3コアに設定すると`GOMAXPROCS=3`になります。
  * 例: 4コアのマシンで8コアに設定すると`GOMAXPROCS=4`になります。

#### CPUアフィニティとCPUリミットの違い

* **CPUアフィニティ**: 「特定のコア（例: 2, 4, 6, 8番）でのみ実行できる」という指定。
* **CPUリミット**: 「CPU時間をこれだけ使用できる（例: 2.5コア分の処理時間）」という指定。
* ほとんどの通常ケースでは、アフィニティカウントはノード上の総CPUコア数と等しくなります。

![Image](https://pbs.twimg.com/media/GytREXBbsAAFG14?format=jpg&name=large)

---

### 関連情報

* Uberからも同様の機能を持つパッケージが公開されています。
