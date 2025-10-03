---
title: "全プロセスが一秒止まる不具合、原因はLinuxカーネルにあり？"
source: "https://zenn.dev/turing_motors/articles/a460fe08b54253"
author:
  - "sakamoto"
published: 2025-09-30
created: 2025-10-03
description: |
  自動運転用のデータ収集システムでごくまれに発生していた全プロセス停止の要因を、LinuxカーネルのkswapdとZone DMA回収に伴うロック保持時間に特定し、再現実験とチューニングで解消した事例の概要。
tags:
  - カーネル
  - 不具合解析
  - tech
  - Linux
  - 自動運転
---

## はじめに

完全自動運転を目指すチューリング社が、組み込みLinuxベースの自動運転システムとデータ収集システム開発中に遭遇した「全プロセスが約1秒停止する」不具合の概要を解説し、調査と対策の流れを整理する。

### チューリングの自動運転システムとは？

カメラ主体のエンドツーエンド方式で、カメラ制御・モデル推論・車両制御など複数プロセスがPublisher/Subscriber型IPCで連携する並列構成。

![チューリングの自動運転システムのコアコンポーネント概念図](https://storage.googleapis.com/zenn-user-upload/d72520a4297f-20250926.png)

### チューリングのデータ収集システムとは？

専用データ収集車両で映像・Lidar・システムメトリクスを記録し、学習用データベースに格納する。こちらもLinux上の複数プロセスがIPCで協調動作。

![データ収集車](https://storage.googleapis.com/zenn-user-upload/c7e53ebbab49-20250926.png)

## 不具合の発見と調査

### 不具合の発見と初期解析

品質チェックで動画フレーム欠落を稀に検出。MLOpsチームと過去データを解析した結果、**約20時間のデータ収集につき1回の頻度でシステム初期から発生**していたと判明。

### 新たなる事実の発見

ストレージ遅延やCPU負荷などの仮説を検証したが決め手なし。ただしログ解析で、発生時には**約1秒間IPC全体が寸断される**ことを突き止め、単なるI/O要因ではなくカーネル起因の可能性を強く示唆。

![プロセス間通信が途絶した瞬間を示すグラフ](https://storage.googleapis.com/zenn-user-upload/313b57b4c1a9-20250926.png)

### 再現

運用環境と同等構成の机上機を整備し、長時間データ収集を継続。約8時間稼働で現象の再現を確認し、カーネルレベルの観測体制を整える足場を得た。

![机上再現機](https://storage.googleapis.com/zenn-user-upload/ecf018e23955-20250926.png)

### 条件の絞り込み

ソフト・ハード構成を1要素ずつ変更しつつ計50回超の試行で検証。**LidarをEthernet接続した状態で数時間連続稼働させることが不具合発生の必須条件**と特定。

![不具合再現実験記録](https://storage.googleapis.com/zenn-user-upload/44dfd9d517bf-20250926.png)

## 原因の解明

### 原因調査

trace-cmdとkernelSharkによるトレース解析、およびカーネルへのカスタムログ挿入で挙動を追跡。**不具合直前には必ずkswapdが動作**しており、メモリ管理が鍵であると判断。

![kernelSharkで可視化した結果](https://storage.googleapis.com/zenn-user-upload/dec1d57a467d-20250926.png)

### kswapdが動作するとCPUの動作が止まる理由

60GBのZone Normalと2GBのZone DMAを持つメモリ構成下で、kswapdが回収リストをスキャンする際にZone DMAページへ到達できずZone Normalを長時間走査。これによりkswapdが取得するロック保持時間が過度に延び、**全プロセスがロック待ちで停止**する状況を引き起こしていた。

![問題発生時の回収リスト](https://storage.googleapis.com/zenn-user-upload/e55ff26b5af3-20250926.png)

## 対策と今後の課題

### 対策

`/proc/sys/vm/lowmem_reserve_ratio` を `30 30 30 0` に設定し、ユーザープロセスがZone DMAを事実上利用しないよう調整。Zone Normalが十分大きい構成を活かし、kswapdの長時間スキャンを抑止して現象を解消。

```
echo "30 30 30 0" > /proc/sys/vm/lowmem_reserve_ratio
```

### 残された課題

今回の設定変更は対症療法に近く、**Lidar接続時にZone DMAが枯渇しやすかった根本メカニズムは未解明**。メモリ要求パターンやドライバ挙動の追加解析を継続し、後続記事でカーネル内部の詳細を公開予定。

## まとめ

全プロセス停止の根因は、Zone DMA回収時にkswapdが長時間ロックを保持するメモリ管理の振る舞いだった。再現環境の構築と多面的な調査が原因特定に寄与し、カーネルパラメータの調整で現象を抑止。**メモリ管理のチューニングが自動運転システムの安定性に直結する**ことを学び、今後も詳細解説と追加検証を進める。
