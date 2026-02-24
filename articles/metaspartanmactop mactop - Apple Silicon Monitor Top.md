---
title: "metaspartan/mactop: mactop - Apple Silicon Monitor Top"
source: "https://github.com/metaspartan/mactop"
author:
  - "Carsen Klock"
published:
created: 2026-02-25
description: "mactop は Apple Silicon チップ向けのターミナルベースのリアルタイム監視ツール。sudo 不要で CPU/GPU 使用率、消費電力、温度、メモリ、ネットワーク、Thunderbolt 帯域などを表示する Go 製 CLI。"
tags:
  - "apple-silicon"
  - "monitoring"
  - "terminal"
  - "macos"
  - "go"
  - "cli"
  - "clippings"
---

## 概要

**mactop** は、Carsen Klock が開発した Apple Silicon チップ専用のターミナルベースのシステム監視ツール。Unix の `top` コマンドに着想を得て、CPU・GPU 使用率、消費電力、温度、メモリ使用量などのリアルタイムメトリクスをターミナル UI で表示する。Go 言語と CGO で実装されている。

- **リポジトリ**: https://github.com/metaspartan/mactop
- **ライセンス**: MIT License
- **対応環境**: Apple Silicon (ARM64) / macOS Monterey 12.3+

---

## 主な特徴

### sudo 不要のネイティブ API 活用

mactop は以下の Apple ネイティブ API を使用しており、**sudo 権限なし**で動作する:

| API | 用途 |
|-----|------|
| **Apple SMC** | SoC 温度センサー、システム消費電力 (PSTR) |
| **IOReport API** | CPU, GPU, ANE, DRAM の消費電力 |
| **IOKit** | `pmgr` デバイスからの GPU 周波数テーブル |
| **IOHIDEventSystemClient** | SoC 温度センサー（フォールバック） |
| **NSProcessInfo.thermalState** | システムサーマルステート |
| **Mach Kernel API (`host_processor_info`)** | CPU メトリクス（E/P コア）(CGO 経由) |

### 監視できるメトリクス

- **CPU**: 使用率、E コア / P コア別の詳細メトリクス
- **GPU**: 使用率、周波数 (MHz)、プロセスごとの GPU 使用率（実験的）
- **電力**: CPU / GPU / ANE / DRAM / システム全体の消費ワット数
- **温度**: CPU / GPU 温度、サーマルステート（Normal / Fair / Serious / Critical）
- **メモリ**: 使用量、スワップ情報
- **ネットワーク**: アップロード / ダウンロード速度
- **Thunderbolt**: 帯域幅モニタリング、デバイスツリー表示、RDMA over Thunderbolt 5 検出
- **ディスク I/O**: 読み書き速度
- **ボリューム**: Mac HD + マウント済み外部ボリューム

---

## UI とカスタマイズ

### レイアウトとテーマ

- **17 種類のレイアウト** — `l` キーでサイクル切り替え
- **カスタムカラー** — green, red, blue, skyblue, magenta, yellow, gold, silver 等多数、`c` キーでサイクル
- **背景色変更** — `b` キーでサイクル
- **カスタム Hex カラー** — CLI フラグで `--foreground "#9580FF"` `--bg "#22212C"` のように指定可能
- **テーマファイル** — `~/.mactop/theme.json` でコンポーネントごとの色を個別設定可能（CPU, GPU, Memory, ANE, Network, Power, Thunderbolt, ProcessList 等）
- **優先順位**: CLI フラグ > theme.json > 保存済み設定
- **ライト/ダークモード自動検出** — ターミナル背景やシステムテーマに応じて自動調整
- **設定の永続化** — レイアウトとテーマの選択は再起動後も保持

### Party Mode

`p` キーでランダムに色がサイクルする Party Mode を切り替え可能。

---

## プロセス管理

- **プロセスリスト** — htop 形式（VIRT は GB 単位、CPU はコア数で正規化）
- **プロセスキル** — `F9` キーで選択中のプロセスをキル（安全確認あり）
- **プロセスフィルター** — `/` で名前検索・フィルタリング（Esc でクリア）
- **ナビゲーション** — Vim ライクな操作（`g` 先頭、`G` 末尾、`j`/`k` スクロール、矢印キー対応）
- **ソート** — `Enter` / `Space` で選択カラムによるソート
- **フリーズ** — `f` でプロセスリストの更新を一時停止/再開

---

## ヘッドレスモードとスクリプト連携

TUI なしで stdout にメトリクスを出力するヘッドレスモードを備えており、スクリプトやログ収集に活用できる。

```shell
# 1回実行して終了
mactop --headless --count 1

# 連続実行 + JSON 整形
mactop --headless --pretty

# 出力フォーマット変更 (json, yaml, xml, csv, toon)
mactop --headless --format yaml
```

出力には SoC メトリクス、メモリ、ネットワーク/ディスク I/O、コアごとの使用率、システム情報、Thunderbolt 情報、RDMA ステータスなどが含まれる。

---

## Prometheus メトリクス

オプションでローカル Prometheus メトリクスサーバーを起動可能（デフォルトは無効）:

```shell
mactop -p 2112
```

---

## インストール

### Homebrew（推奨）

```shell
brew install mactop
mactop
```

### ソースからビルド

Go がインストールされている環境で:

```shell
git clone https://github.com/metaspartan/mactop.git
cd mactop
go build
./mactop
```

---

## CLI フラグ一覧

| フラグ | 説明 |
|--------|------|
| `--headless` | ヘッドレスモード（TUI なし、stdout 出力） |
| `--format` | 出力フォーマット（json, yaml, xml, csv, toon） |
| `--count` | ヘッドレスモードのサンプル数（0 = 無限） |
| `--pretty` | JSON 整形出力 |
| `--interval` / `-i` | 更新間隔 (ms)。デフォルト 1000 |
| `--foreground` | UI 前景色（名前または Hex） |
| `--bg` / `--background` | UI 背景色（名前または Hex） |
| `--prometheus` / `-p` | Prometheus サーバーのポート指定・有効化 |
| `--unit-network` | ネットワーク単位（auto, byte, kb, mb, gb） |
| `--unit-disk` | ディスク単位（auto, byte, kb, mb, gb） |
| `--unit-temp` | 温度単位（celsius, fahrenheit） |
| `--menubar` | macOS メニューバーステータスアイテムとして動作 |
| `--test` / `-t` | IOReport 電力メトリクスのテスト |
| `--version` / `-v` | バージョン表示 |
| `--help` / `-h` | ヘルプ表示 |

---

## 対応チップ

M1 / M1 Pro / M1 Max / M1 Ultra / M2 / M2 Pro / M2 Max / M2 Ultra / M3 / M3 Pro / M3 Max / M3 Ultra / M4 / M4 Pro / M4 Max / M5 の動作が確認済み。

---

## 注意事項

- Apple 公式サポートのツールではなく、as-is で提供されている
- 使用は自己責任
- [asitop](https://github.com/tlkh/asitop) にインスピレーションを受けて開発された
- UI フレームワークは [gotui](https://github.com/metaspartan/gotui) を使用
