---
title: "Go Conference 2025: Goで体感するMultipath TCP ― Go 1.24 時代の MPTCP Listener を理解する"
source: "https://speakerdeck.com/takehaya/go-conference-2025-godeti-gan-surumultipath-tcp-go-1-dot-24-shi-dai-no-mptcp-listener-woli-jie-suru"
author:
  - "Takeru Hayasaka"
published: 2025-09-28
created: 2025-09-29
description: |
  Go Conference 2025 Day2で早坂彪流氏が登壇したセッションのスライド。Multipath TCPの基礎からGo 1.24での標準化、Linuxカーネル設定、ロードバランサー対応、活用事例や追加リソースまでを体系的に整理している。
tags:
  - mptcp
  - go
  - networking
  - linux
  - load-balancing
---

## セッション概要

- **登壇者**: 早坂彪流（さくらインターネット／BBSakura Networks、@takemioIO）。社会人5年目でモバイルコア・仮想化基盤の開発運用を担当し、GoやeBPFに強みを持つ。
- **講演目的**: Multipath TCP(MPTCP)の仕組みと利点、Go 1.24でのデフォルトリスナー化の影響、Linux側での活用ノウハウを整理し、アプリ・インフラ双方からの実践知識を共有する。
- **資料構成**: 「MPTCP概説」「Goでのサポート」「Linux運用ノウハウ」「ロードバランサー対応」「他言語・既存アプリへの適用」「付録」の順で展開。各章にはハンドシェイク図、サブフロー構成図、設定コマンド例などが含まれる（主要図版: [slide_1.jpg](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_1.jpg)〜[slide_61.jpg](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_61.jpg)）。

## Multipath TCPの基礎

- **概要図** ([slide_6](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_6.jpg)、[slide_7](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_7.jpg))
  - MPTCPは1つのアプリケーションソケットの裏で複数のTCPコネクション（サブフロー）を束ね、帯域集約・冗長化・シームレスハンドオーバーを実現する拡張。RFC8684 (2020) が現行仕様。
- **利用事例** ([slide_8](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_8.jpg)〜[slide_11](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_11.jpg))
  - AppleはSiri/Apple MusicでMPTCPを活用し、移動中のWi-Fi↔セルラー切替でも音声ストリーム停止時間を短縮。
  - 韓国Korea TelecomはWi-Fiと4G LTEを束ね800Mbps超を実現する商用サービスを提供。
  - 公式サイトの対応アプリ一覧（curl、iperf3、HAProxy、Valkeyなど）と、測定論文によるIPv4/MPTCPv1対応IPが68万（2025年9月）に達した統計を紹介。
- **TCPとの違い** ([slide_13](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_13.jpg))
  - 4タプル単位の単一フローであるTCPと異なり、MPTCPはトークンおよびサブフローIDで複数経路を束ねる。

## サブフロー交渉とアドレス管理

- **ハンドシェイク詳細** ([slide_14](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_14.jpg)〜[slide_21](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_21.jpg))
  - `MP_CAPABLE`オプションで互換性を保ちながら初期サブフローを確立し、鍵交換・トークン生成後に`MP_JOIN`で追加サブフローを接続。HMACにより正当性を検証するシーケンスを図示。
- **アドレス追加手順** ([slide_22](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_22.jpg)〜[slide_25](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_25.jpg))
  - `ADD_ADDR` / `REMOVE_ADDR`で互いの追加経路を通知し、`MP_JOIN`で新サブフローを紐付ける。異なるインタフェース間で冗長経路を確保するプロセスをネットワーク図で解説。
- **Middlebox課題** ([slide_26](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_26.jpg)〜[slide_28](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_28.jpg))
  - FirewallがTCPオプションを削除、NATがアドレスを破棄、L4ロードバランサーがサブフローを別ノードへルーティングするなど、MPTCP非対応の装置ではフォールバックが発生しやすい。ワークアラウンドとして`ADD_ADDR`経由で直接到達可能なIP:Portをクライアントに通知し、初回経路での`MP_JOIN`拒否を推奨。

## Go 1.24におけるMPTCPサポート

- **タイムライン** ([slide_29](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_29.jpg)、[slide_30](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_30.jpg))
  - Go 1.21 (2023) で明示的にDial/Listenを有効化可能に。1.24 (2025)で`GODEBUG=multipathtcp`既定値が2となり、TCP ListenがデフォルトでMPTCP化。1.23のバグは1.24で修正済み。
- **コード例** ([slide_31](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_31.jpg)、[slide_32](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_32.jpg))
  - `net.ListenConfig.SetMultipathTCP(true)`や`net.Dialer.SetMultipathTCP(true)`での制御例、`GODEBUG`フラグ指定方法を提示。
- **運用上の注意** ([slide_33](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_33.jpg)〜[slide_36](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_36.jpg))
  - デフォルト化は既存コードに変更不要だが、`TCP_MD5SIG`など未対応ソケットオプションを使用するBGP系（GoBGP）やCRIUなどでは`SetMultipathTCP(false)`で明示無効化が必要。カーネル側サポートが整わない限り利用不可。
  - Damien Neil (Go Team)は問題があるサービスのみアプリ側で無効化する方針を推奨。`GODEBUG=multipathtcp=0`や`sysctl net.mptcp.enabled=0`でのフォールバック手段も紹介。

## Linuxでの運用ノウハウ

- **カーネルサポート** ([slide_40](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_40.jpg))
  - Linux v5.6以降がMPTCP v1をサポート。ディストリによって追加機能の有無は異なり、`sysctl -w net.mptcp.enabled=1`で有効化。対応情報は[mptcp.dev](https://www.mptcp.dev/apps.html)に一覧化。
- **パスマネージャとスケジューラ** ([slide_41](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_41.jpg))
  - パスマネージャがサブフロー増減を制御し、スケジューラが各サブフローへの送信比率を決める。eBPFによるスケジューラ拡張事例を紹介。
- **設定コマンド** ([slide_42](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_42.jpg))
  - `ip mptcp limits set`でセッションごとのサブフロー数や受け入れアドレス数を設定。`ip mptcp endpoint add ... subflow`でサブフロー追加、`... signal`で`ADD_ADDR`通知。バックアップモード設定も可能。

## ロードバランサーとの統合

- **基本ワークアラウンド** ([slide_27](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_27.jpg)、[slide_43](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_43.jpg))
  - 初回サブフローはVIP経由でLBへ接続し、サーバーがクライアントに直接到達可能なIPを`ADD_ADDR`で通知。クライアントは通知先にのみ追加サブフローを張ることで、LBによる`MP_JOIN`分散を回避。
- **詳細シナリオ** ([slide_44](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_44.jpg)〜[slide_61](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_61.jpg))
  - `sysctl net.mptcp.allow_join_initial_addr_port=0`で初回経路への`MP_JOIN`禁止、`ip mptcp endpoint add <SERVER_IP> ... signal`で通知経路を制御。LB側は特定ポートを固定的にサーバーへフォワードし、クライアントは通知ポートに対して追加サブフローを確立する構成例を図示。
  - One-arm構成やVIPのみ公開するケースでも、クライアントが直接到達可能なエンドポイントを確保することが鍵であると指摘。

## 他言語・既存アプリへの適用

- **他言語サポート** ([slide_37](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_37.jpg)、[slide_38](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_38.jpg))
  - Linuxでは`socket(AF_INET, SOCK_STREAM, IPPROTO_MPTCP)`でMPTCPソケットを作成可能。C/Elixir/Erlang/Python/Perl/Rust、macOSのNetwork Framework(NWConnection)などでもAPIが提供される。
  - `mptcpize`（LD_PRELOAD）や`mptcpify`（eBPF）を使い、再ビルド不要で既存バイナリをMPTCP対応させる手段を紹介。

## 付録と追加リソース

- **実践用リポジトリ** ([slide_48](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_48.jpg))
  - `mptcp_playground`でGo製サーバー/クライアント、サブフロー制御例、LB対策のハンズオンコードを提供。GitHubで公開。
- **学習リソース** ([slide_49](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_49.jpg))
  - SIGCOMM’20のMPTCPチュートリアル、MPTCP開発者向けドキュメント、FOSDEM 23資料、`mptcp_net-next` Wikiなど、プロトコル仕様や最新開発状況を把握できるリンク集。
- **オプション仕様図鑑** ([slide_50](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_50.jpg)〜[slide_57](https://files.speakerdeck.com/presentations/e0e763b3b9b047e99d138b39a219e7fa/slide_57.jpg))
  - `MP_CAPABLE`、`MP_JOIN`、`ADD_ADDR`、`DSS`など各TCPオプションのフォーマットをビットフィールド図で掲載。RFC8684準拠の値とフラグ意味を整理。

## まとめと重要ポイント

- Go 1.24以降、LinuxカーネルがMPTCP v1をサポートしていれば、標準のTCP Listenが追加コストなくマルチパス化され、クライアントがMPTCPで接続してきた場合は透明に恩恵を受けられる。
- ソケットオプション互換性、Middleboxによる制限、ロードバランサー構成は導入時のリスク要因であり、必要に応じて`SetMultipathTCP(false)`やネットワーク設定のチューニングが不可欠。
- サブフロー機構（`MP_CAPABLE`/`MP_JOIN`/`ADD_ADDR`）とパスマネージャ設定を理解すれば、帯域集約・フェイルオーバー・モビリティ最適化が実現できる。
- 実践的な検証には`mptcp_playground`を活用し、追加資料でRFCや最新のカーネル開発動向を参照することが推奨される。
