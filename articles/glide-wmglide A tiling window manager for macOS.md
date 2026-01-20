---
title: "glide-wm/glide: A tiling window manager for macOS"
source: "https://github.com/glide-wm/glide"
author:
  - "[[tmandry]]"
  - "[[y3owk1n]]"
  - "[[arieluy]]"
  - "[[intergrav]]"
published: 2026-01-16
created: 2026-01-20
description: "Glideは、i3、Sway、Hyprlandからインスピレーションを受けたmacOS向けタイリングウィンドウマネージャー。Mission ControlのSpacesと統合し、キーボード操作を重視しながらトラックパッドも強化。Rustで構築された信頼性の高いアーキテクチャを採用。"
tags:
  - "clippings"
  - "macos"
  - "window-manager"
  - "tiling"
  - "rust"
  - "productivity"
---

## 概要

**Glide**は、macOS向けのタイリングウィンドウマネージャーです。i3、Sway、Hyprlandなどのウィンドウマネージャーからインスピレーションを受けて開発されました。

- **GitHub Stars**: 381
- **Forks**: 5
- **最新バージョン**: v0.2.6 (2026年1月16日)
- **開発言語**: Rust (98.8%)
- **ライセンス**: Apache-2.0, MIT (デュアルライセンス)
- **公式サイト**: [glidewm.org](https://glidewm.org/)

---

## 主な特徴

### 1. Spacesとの統合
Mission Controlと連携し、通常通りSpaces間を移動しながら段階的に導入可能。既存のワークフローを壊すことなく採用できます。

### 2. キーボード重視、トラックパッド強化
タイリングウィンドウマネージャーの応答性をmacOSに持ち込みます。以下の機能をサポート：
- インタラクティブなリサイズ
- Mouse-follows-focus（マウスがフォーカスに追従）
- Focus-follows-mouse（マウスにフォーカスが追従）

### 3. 環境適応
外部モニター接続時と持ち運び時で、レイアウトをカスタマイズ可能。

### 4. 信頼性の高いアーキテクチャ
macOS向けウィンドウマネージャー開発の長年の経験に基づいて構築。

### 5. アニメーション対応
ウィンドウ操作時のアニメーションをサポート。

---

## クイックスタート

### Homebrewでのインストール

```bash
brew install glide
glide launch
```

初回起動時には、アクセシビリティ権限の有効化が必要です。

### 基本操作

| キーバインド | 動作 |
|------------|------|
| `Alt+Z` | 現在のスペースの管理を開始/停止（※ウィンドウがリサイズされます） |
| `Alt+Shift+E` | Glideを終了 |

### 設定のカスタマイズ

設定ファイル `~/.glide.toml` を編集し、以下のコマンドで適用：

```bash
glide config update
```

変更を保存時に自動適用するには：

```bash
glide config update --watch
```

デフォルトのキーバインドは [glide.default.toml](https://github.com/glide-wm/glide/blob/main/glide.default.toml) を参照。

---

## 状態の保存と復元

Glideの更新や再起動が必要な場合：

1. `Alt+Shift+E`（save_and_exit）で終了
2. 再起動時に `--restore` フラグを使用：

```bash
glide launch --restore
```

**注意**: マシン再起動後は復元できません。

---

## ログイン時の自動起動

サービスとしてインストール：

```bash
glide service install
```

---

## 手動インストール

1. [最新リリース](https://github.com/glide-wm/glide/releases/latest)からディスクイメージをダウンロード
2. ApplicationsフォルダにGlideをドラッグ
3. CLIをインストール（推奨）：

```bash
sudo ln -s /Applications/Glide.app/Contents/MacOS/glide /usr/local/bin
```

---

## ソースからのビルド

1. [Rust](https://rustup.rs)をインストール
2. 最新のXcodeコマンドラインツールをインストール
3. ビルド実行：

```bash
git clone https://github.com/glide-wm/glide
cd glide
cargo run --release
```

初回ビルド時は、ターミナルアプリケーションにアクセシビリティ権限を付与する必要があります。

---

## 謝辞

Glideは多くの先人の業績の上に構築されています：

- **[Yabai](https://github.com/asmvik/yabai)**: macOS向けウィンドウマネージャーの技術情報
- **[objc2](https://github.com/madsmtm/objc2)**: RustでのmacOS開発を可能にするクレート
- **[tracing](https://github.com/tokio-rs/tracing)**: 複雑な非同期フローのためのツリー構造ロギング

---

## コントリビューター

| GitHub | 名前 |
|--------|------|
| [@tmandry](https://github.com/tmandry) | Tyler Mandry |
| [@y3owk1n](https://github.com/y3owk1n) | Kyle Wong |
| [@arieluy](https://github.com/arieluy) | Ariel Uy |
| [@intergrav](https://github.com/intergrav) | devin |

---

## 関連リンク

- [GitHub リポジトリ](https://github.com/glide-wm/glide)
- [公式サイト](https://glidewm.org/)
- [CONTRIBUTING.md](https://github.com/glide-wm/glide/blob/main/CONTRIBUTING.md)
