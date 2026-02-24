---
title: "AppleがmacOS 12 Montereyでpingコマンドの代わりに導入したnetworkQualityを利用しネットワーク回線速度を測定できるアプリ「Speediness」が通信速度のリアルタイム表示に対応。"
source: "https://applech2.com/archives/20260209-speediness-networkquality-gui-support-speed-while.html"
author:
  - "[[applech2]]"
published: 2026-02-09
created: 2026-02-24
description: "AppleがmacOS 12 Montereyで導入したnetworkQualityコマンドのGUIフロントエンド「Speediness」がv2.0にアップデートし、テスト中の通信速度をリアルタイムでMbps表示する機能に対応。元Googleエンジニアの Sindre Sorhus氏が開発する無料アプリで、RPMやpingの測定結果も表示可能。"
tags:
  - "clippings"
  - "macOS"
  - "Apple"
  - "networkQuality"
  - "Speediness"
  - "ネットワーク"
  - "ユーティリティ"
---

## 概要

AppleがmacOS 12 Montereyで従来のpingコマンドに代わる手段として導入した`networkQuality`コマンドを、GUIで利用できるMacアプリ「Speediness」がバージョン2.0にアップデートされた。新バージョンでは、テスト中のネットワーク通信速度（Mbps）をリアルタイムで表示し、その後networkQualityのRPMとpingのmsで結果を表示する機能が追加されている。

## 主要なトピック

### networkQualityコマンドの背景

- AppleはWWDC21（2021年6月）にて、1980年代に開発されたpingコマンドは**実際のネットワーク状態を知ることが難しい**と指摘
- 代替として、ネットワークの応答速度を「**bps**（ビット毎秒）」と「**RPM**（1分間のラウンドトリップ数）」で評価する`networkQuality`コマンドをmacOS 12 Monterey / iOS 15に実装
- RPMという新しい測定基準は、ミリ秒単位の表示が多くの人にとって抽象的すぎるために作られた
- macOS 13.2 Venturaでは`networkQuality -c`によるJSON出力にも対応し、継続的にアップデートされている

### Speediness v2.0の新機能

- 開発者は**Sindre Sorhus**氏（元Googleエンジニア、現在はオープンソースに貢献）
- アプリを起動すると`networkQuality`コマンドを使い**自動的にネットワーク速度を計測**
- v2.0で追加された主な機能：
  - **テスト中の通信速度（Mbps）をリアルタイム表示**
  - テスト完了後に**RPM**と**ping（ms）**の結果を表示
  - **History機能**で過去の計測結果を確認可能

### システム要件の変更

- v2.0でシステム要件が**macOS 15 Sequoia**から**macOS 26 Tahoe以上**に変更
- 旧バージョンはSorhus氏の公式サイトで引き続き公開されている

## 重要な事実・データ

- **networkQualityの導入時期**: WWDC21（2021年6月）、macOS 12 Monterey / iOS 15
- **RPM（Rounds Per Minute）**: Appleが提案する新しいネットワーク応答性の測定基準
- **JSON出力対応**: macOS 13.2 Ventura（`networkQuality -c`コマンド）
- **Speediness v2.0**: 無料、Mac App Storeで公開
- **システム要件**: macOS 26 Tahoe以上（旧バージョンはmacOS 15 Sequoiaで利用可能）

## 結論・示唆

### 実践的な示唆

- Macのネットワーク速度を手軽に測定したい場合、Speedinessは無料で使えるシンプルなGUIツール
- ターミナルでの`networkQuality`コマンドを直接使うこともできるが、GUIで結果を視覚的に確認したいユーザーにはSpeedinessが適している
- macOS 26 Tahoe未満のユーザーは旧バージョンを公式サイトから入手可能

## 関連リンク

- [Speediness — Mac App Store](https://apps.apple.com/us/app/speediness/id1596706466?mt=12)
- [Speediness — Sindre Sorhus](https://sindresorhus.com/speediness)
- [networkQualityコマンドについて（AAPL Ch.）](https://applech2.com/archives/netwok-speed-test-networkquality-command-in-macos-monterey.html)
- [macOS 13.2 VenturaでのJSON出力対応（AAPL Ch.）](https://applech2.com/archives/20230124-macos-13-2-ventura-networkquality-support-json-output.html)

---

*Source: [AppleがmacOS 12 Montereyでpingコマンドの代わりに導入したnetworkQualityを利用しネットワーク回線速度を測定できるアプリ「Speediness」が通信速度のリアルタイム表示に対応。](https://applech2.com/archives/20260209-speediness-networkquality-gui-support-speed-while.html)*
