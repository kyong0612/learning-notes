---
title: "pamburus/hl: A fast and powerful log viewer and processor that converts JSON logs or logfmt logs into a clear human-readable format."
source: "https://github.com/pamburus/hl"
author:
  - "pamburus"
published:
created: 2026-01-04
description: "Rustで構築された高性能なログビューア・プロセッサ。JSON・logfmt形式のログを人間が読みやすい形式に変換し、高度なフィルタリング、ソート、ライブフォロー機能を提供"
tags:
  - "clippings"
  - "rust"
  - "logging"
  - "cli-tool"
  - "log-viewer"
  - "performance"
---

## 概要

**hl**は、Rustで構築された高性能なログビューア・プロセッサです。JSON形式およびlogfmt形式のログを人間が読みやすい出力に変換します。2.4kのスターを獲得しており、MITライセンスで公開されています。

## 主な機能

### コアフィーチャー

- **自動ページャー統合**: デフォルトで`less`などのページャーと連携
- **ログストリーミングモード**: `-P`フラグでストリーミング処理
- **フィールドベースのフィルタリング**: 階層的なキーサポート
- **レベルフィルタリング**: `-l`オプションでログレベルによるフィルタリング
- **タイムスタンプ範囲フィルタリング**:
  - RFC-3339形式のサポート
  - 相対オフセット（例: `-3h`, `-14d`）
  - ショートカット（例: "today"）
- **フィールド表示制御**: 特定のカラムの表示/非表示
- **高速ソート**: 自動インデックス作成（初期スキャン速度 約2 GiB/s）
- **ライブフォローモード**: `-F`フラグで複数ソースからのタイムスタンプソート更新
- **複雑なクエリサポート**: AND/OR論理条件

### パフォーマンス

2.3 GiBのログファイルに対するパフォーマンス比較で、humanlog、hlogf、fblogなどの類似ツールと比較して大幅な速度優位性を実証しています。

## インストール方法

### macOS

```bash
brew install hl
```

### Linux

- x86_64/ARM64バイナリが利用可能
- Arch Linuxリポジトリからインストール可能

### Windows

```bash
scoop install hl
```

### NixOS

- Flakeサポート利用可能

### 全プラットフォーム（Cargo）

```bash
cargo install hl
```

## サポート形式

- **JSON logs**: JSON形式のログファイル
- **logfmt logs**: logfmt形式のログファイル
- **圧縮ファイル**: bzip2、gzip、xz、zstd形式に対応

## 高度な機能

### 非JSON prefix処理

`--allow-prefix`オプションで、JSON以外のプレフィックスを持つログにも対応

### タイムゾーン設定

- デフォルト: UTC
- カスタマイズ可能

### 設定とテーマ

- 設定ファイルのサポート
- カスタムテーマの適用

### クエリ機能

- フィールド存在演算子
- ワイルドカードマッチング

## 使用例

### 基本的な使用方法

```bash
# ログファイルを表示
hl logfile.json

# ストリーミングモード
hl -P logfile.json

# ライブフォローモード
hl -F logfile.json
```

### フィルタリング

```bash
# ログレベルでフィルタリング
hl -l error logfile.json

# タイムスタンプ範囲でフィルタリング
hl --since -3h logfile.json
hl --since today logfile.json
```

## 技術的特徴

- **言語**: Rust
- **ライセンス**: MIT
- **GitHub**: pamburus/hl
- **スター数**: 2.4k
- **フォーク数**: 52

## まとめ

hlは、大量のログファイルを高速かつ効率的に処理する必要がある開発者やSREエンジニアにとって非常に有用なツールです。Rustによる高性能な実装、豊富なフィルタリングオプション、複数の圧縮形式への対応により、既存のログビューアツールと比較して優れた選択肢となっています。
