---
title: "macOS 26 Tahoeでシステム全体の遅延やバッテリー消費を引き起こす問題のあるElectronアプリがMacにインストールされているかを簡単に確認できるAppleScriptアプレット「Tahoe Electron Detector」が公開。"
source: "https://applech2.com/archives/20251027-tahoe-electron-detector.html"
author:
  - "[[applech2]]"
  - "[[Craig Hockenberry]]"
  - "[[Tomas Kafka]]"
published: 2025-10-27
created: 2025-11-04
description: "macOS 26 TahoeでプライベートAppKit APIの使用により、WindowServerのGPU負荷とシステム全体の遅延を引き起こす問題のあるElectronアプリを検出するAppleScriptツール「Tahoe Electron Detector」の紹介。The Iconfactory のCraig Hockenberryが開発。"
tags:
  - "clippings"
  - "macOS"
  - "Electron"
  - "パフォーマンス"
  - "GPU"
  - "WindowServer"
  - "バッテリー"
  - "開発ツール"
---

## 概要

macOS 26 Tahoeにおいて、一部のElectronアプリがシステム全体の遅延とバッテリー消費を引き起こす問題に対処するため、The IconfactoryのCraig Hockenberryが「Tahoe Electron Detector」というAppleScriptアプレットを開発し公開しました。このツールは、Tomas Kafkaが作成した元のスクリプトをベースに、Xcodeインストールの要件を削除し、より簡単に使用できるようにしたものです。

## 問題の詳細

### 根本原因

Electronフレームワークが**プライベートAppKit API `_cornerMask`をオーバーライド**していることが問題の根本原因です。このメソッドはWindowServerがアプリケーションウィンドウのシャドウ（影）を計算する際に呼び出されますが、Electronによるオーバーライドがメモ化（memoization）を破壊し、WindowServerにシャドウの繰り返し再計算と再描画を強制させています。

### システムへの影響

- **WindowServerの高負荷**: 過度なシャドウ計算処理により、WindowServerプロセスが高負荷状態になる
- **ウィンドウ操作の遅延**: ウィンドウの移動やスクロールが著しくカクカクになる
- **バッテリー消費の増加**: 継続的な再計算処理によりバッテリーの消耗が加速
- **システム全体の遅延**: GPU使用率自体は低いものの、システム全体のパフォーマンスが低下

## Tahoe Electron Detectorの機能

このAppleScriptアプレットは以下の機能を提供します：

1. **インストール済みアプリのスキャン**: Mac上にインストールされているElectronアプリを自動検出
2. **バージョン確認**: 各アプリが使用しているElectronのバージョンを確認
3. **問題のあるアプリの特定**: 修正が必要なアプリを識別
4. **視覚的なフィードバック**: 結果をチェックマーク（✅）などで分かりやすく表示

### 使用方法

1. **ダウンロード**: [TahoeElectronDetector.zip](https://furbo.org/2025/10/06/tahoe-electron-detector/)からアプレットをダウンロード
2. **実行**: ダウンロードしたアプレットを実行
3. **権限付与**: 他のアプリへのアクセス許可を求められた場合は許可
4. **結果確認**: スキャン結果を確認し、更新が必要なアプリを特定

## 修正状況

### 修正済みのElectronバージョン

Electronチームは2025年10月時点で問題を修正しており、以下のバージョン以降では問題が解決されています：

- **Electron v38.2.0**
- **Electron v37.6.0**
- **Electron v36.9.2**

### 修正済みの主要アプリ（2025年10月時点）

以下のアプリは既に修正版をリリースしています：

- 1Password
- Claude
- Cluely
- Discord
- Docker Desktop
- Figma
- GitHub Desktop
- MongoDB Compass
- Notion
- Obsidian
- Pocket Casts
- Signal
- Slack
- Super Productivity
- Visual Studio Code

### 未修正の主要アプリ

以下のアプリはまだ修正版をリリースしていません：

- Bitwarden
- Cursor
- Dropbox
- Loom
- Logseq
- Postman
- Superhuman
- Windsurf

## 追跡ツール「ShameElectron」

[@normarayr](https://github.com/avarayr)が開発した「[ShameElectron](https://avarayr.github.io/shamelectron/)」というウェブサイトでは、71個のElectronアプリの修正状況を追跡しています。

### 現在の統計（2025年10月時点）

- **修正済み**: 36アプリ
- **未修正**: 33アプリ
- **不明**: 2アプリ

このサイトは12時間ごとに自動更新され、未修正アプリの開発者へのX（Twitter）メンション機能も提供しています。

## 技術的な回避策

根本的な解決はアプリ開発者によるElectronのアップデートを待つ必要がありますが、一時的な回避策として以下の方法があります：

### 環境変数の設定

```bash
CHROME_HEADLESS=1
```

この環境変数を設定することでシャドウ描画を無効化できますが、アプリのウィンドウシャドウが消失するという副作用があります。

### ユーザーができる対処

1. **未更新アプリの確認**: Tahoe Electron DetectorまたはShameElectronで未更新のアプリを確認
2. **バックグラウンド実行の制限**: 未更新のElectronアプリをバックグラウンドで実行しないよう注意
3. **アップデートの監視**: アプリのアップデート情報を定期的にチェック
4. **開発者への報告**: 未修正のアプリについては、開発者に修正をリクエスト

## コミュニティの反応

この問題に対して、開発者コミュニティからは以下のような反応が寄せられています：

- **QAテストの欠落への批判**: プライベートAPIの使用がQAテストで見逃されたことへの懸念
- **警告機能の要望**: プライベートAPI使用時の警告を公開すべきとの意見
- **互換性モードの提案**: macOS側での互換性モード導入を求める声

## 制限事項と注意点

1. **プライベートAPIのリスク**: 非公開APIの使用は将来的に破損するリスクを常に伴う
2. **継続的な監視の必要性**: 新しいmacOSバージョンでも同様の問題が発生する可能性
3. **アプリ開発者の対応待ち**: 最終的な解決はアプリ開発者によるアップデートに依存

## 参考リンク

- [Tahoe Electron Detector (furbo.org)](https://furbo.org/2025/10/06/tahoe-electron-detector/)
- [ShameElectron - 修正状況追跡サイト](https://avarayr.github.io/shamelectron/)
- [Michael Tsai's Blog - 技術的詳細](https://mjtsai.com/blog/2025/09/30/electron-apps-causing-system-wide-lag-on-tahoe/)
- [9to5Mac - 修正ロールアウト情報](https://9to5mac.com/2025/10/11/macos-26-tahoe-electron-gpu-slowdown-bug-fix-rollout/)
- [Electron Issue #48376](https://github.com/electron/electron/issues/48376)
