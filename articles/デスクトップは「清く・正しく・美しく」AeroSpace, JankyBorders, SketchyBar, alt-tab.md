---
title: "デスクトップは「清く・正しく・美しく」AeroSpace, JankyBorders, SketchyBar, alt-tab"
source: "https://zenn.dev/mozumasu/articles/mozumasu-window-costomization"
author:
  - mozumasu
published: 2024-12-11
created: 2026-01-11
description: |
  MacOSのデスクトップ環境をカスタマイズし、効率的で美しいワークスペースを構築するための実践ガイド。AeroSpace（タイル型ウィンドウマネージャー）、JankyBorders（アクティブウィンドウ枠表示）、SketchyBar（カスタムメニューバー）、alt-tab（ウィンドウ切り替えプレビュー）の4つのツールを組み合わせて、キーボード操作で完結する理想のデスクトップを実現する方法を解説。
tags:
  - macOS
  - window-manager
  - AeroSpace
  - JankyBorders
  - SketchyBar
  - alt-tab
  - dotfiles
  - productivity
---

## 概要

この記事は「ミライトデザイン Advent Calendar 2024」11日目の記事。著者はVimConf2024参加者のデスクトップに刺激を受け、MacOSのデスクトップカスタマイズに取り組んだ。

## デスクトップの理想形

著者が追求する「清く・正しく・美しく」の定義：

- **清く**: ウィンドウが整理されている
- **正しく**: 思考とウィンドウの挙動がシンクロしている
- **美しく**: 視界に入れたら心が踊るデザインになっている

### 実現したい機能

- アニメーション無しのワークスペース切り替え
- ウィンドウの自動調整
- キーボードで完結する操作
- 美しいメニューバー
- 判別しやすいアクティブウィンドウ
- 設定のコード管理
- ウィンドウ切り替え時のプレビュー表示

---

## ウィンドウマネージャーの選定

### ウィンドウマネージャーの種類

| 種類 | 特徴 |
|------|------|
| **スタック型 (SWM)** | MacやWindowsの標準。ウィンドウを重ねて表示 |
| **タイル型 (TWM)** | ウィンドウを画面全体にタイル状に配置し、重ならないように自動リサイズ |

### 選定基準

1. 全ての操作をキーボードで完結
2. 脳のリソースを消費しすぎない
3. 設定ファイルをコード管理できる
4. MacのSIPを無効にしないで使用可能
5. 外部ディスプレイ接続時も安定
6. Macで使える

### Linux向けウィンドウマネージャー

| ツール | 説明 |
|--------|------|
| **i3** ⭐️9.6k | X11ベースのタイル型WM |
| **Sway** ⭐️14.8k | Wayland上で動作、i3互換 |
| **Xmonad** ⭐️3.4k | Haskellで設定記述 |
| **Hyprland** ⭐️22.1k | Wayland、多機能でカスタマイズ性高い |

### Mac向けウィンドウマネージャー

**フロート型:**
| ツール | 説明 |
|--------|------|
| **Magnet** | 有料 ($4.99) |
| **Rectangle** ⭐️26.1k | 無料、Macユーザーに人気 |
| **Raycast** | ランチャー兼用 |
| **Loop** ⭐️7.1k | 少ないキーバインドで多レイアウト対応、ウィンドウ境界線機能あり |

**タイル型:**
| ツール | 説明 |
|--------|------|
| **Amethyst** ⭐️14.9k | XmonadのMac版、YAML設定 |
| **yabai** | i3ライク、SIP無効化が必要 |
| **AeroSpace** ⭐️8.7k | 独自ワークスペース、切り替えアニメーションなし、コード管理可能 |

**選定結果**: AeroSpace を採用

---

## AeroSpace

### メリット

- Macのワークスペースとは別のAeroSpace独自ワークスペースを使用
- ワークスペース切り替え時のアニメーションがない
- タイル型WMなので自動的にウィンドウサイズを調整
- キーボードで操作完結
- 設定ファイルでコード管理可能
- 透けているターミナルの後ろに他のウィンドウが表示されない
- `alt + 特定の文字` で特定アプリへ素早く移動
- タスクごとにワークスペースを割り当て可能

### インストール

```bash
brew install --cask nikitabobko/tap/aerospace
```

### 設定ファイルの場所

- `~/.aerospace.toml`
- `${XDG_CONFIG_HOME}/aerospace/aerospace.toml`
- デフォルト: `~/.config/aerospace/aerospace.toml`

### 主要なキーバインド

| 操作 | キーバインド |
|------|-------------|
| ウィンドウフォーカス移動 | `alt + h/j/k/l` |
| ウィンドウ移動 | `alt + shift + h/j/k/l` |
| タイルレイアウト | `alt + /` |
| アコーディオンレイアウト | `alt + ,` |
| ウィンドウ縮小 | `alt + shift + -` |
| ウィンドウ拡大 | `alt + shift + =` |
| ワークスペース切替 | `alt + [1-9]` |
| ウィンドウをワークスペースへ移動 | `alt + shift + [1-9]` |
| 前のワークスペース | `alt + tab` |
| 次のワークスペース | `alt + shift + tab` |
| 設定リロード | `alt + shift + ; → Esc` |

### アプリのapp-id取得

```bash
aerospace list-apps
```

### 起動/停止コマンド

```bash
# 起動
aerospace enable on
# 停止
aerospace enable off
```

### Mission Controlの問題解決

AeroSpace使用時にMission Controlで各ウィンドウが小さくなる問題:

**設定 > デスクトップとDock > Mission Control > ウィンドウをアプリケーションごとにグループ化** を有効にする

またはコマンドで:
```bash
defaults write com.apple.dock expose-group-apps -bool true && killall Dock
```

---

## JankyBorders

アクティブウィンドウに枠をつけて、どのウィンドウがアクティブか判別しやすくする。

### インストール

```bash
brew tap FelixKratz/formulae
brew install borders
```

### AeroSpaceとの連携設定

`aerospace.toml` に追加:
```toml
after-startup-command = [
    'exec-and-forget borders active_color=0xffe1e3e4 inactive_color=0xff494d64 width=5.0'
]
```

### 設定ファイル

`~/.config/borders/bordersrc` で外観をカスタマイズ可能。

### 再起動

```bash
brew services restart borders
```

---

## SketchyBar

Macのメニューバーをカスタマイズ。

### 準備: デフォルトMenu barを隠す

**設定 > コントロールセンター > メニューバーを自動的に表示/非表示** を「常に」に設定

### インストール

```bash
brew tap FelixKratz/formulae
brew install sketchybar
```

### 設定例のコピー

```bash
mkdir -p ~/.config/sketchybar/plugins
cp $(brew --prefix)/share/sketchybar/examples/sketchybarrc ~/.config/sketchybar/
cp -r $(brew --prefix)/share/sketchybar/examples/plugins/ ~/.config/sketchybar/plugins/
chmod +x ~/.config/sketchybar/plugins/*
```

### 起動

```bash
brew services start sketchybar
```

### 外部モニターでMenu barが隠れる問題

`aerospace.toml` でモニターごとにギャップを調整:

```toml
[gaps]
outer.top = [
    { monitor.'built-in' = 10 },
    { monitor.'LG ULTRAGEAR' = 45 }
]
```

モニター名の確認:
```bash
aerospace list-monitors
```

### おすすめdotfiles

SoichiroYamaneさんの設定が参考になる（記事内でリンクあり）。

### AeroSpaceとの同時起動

```toml
after-startup-command = [
    'exec-and-forget borders',
    'exec-and-forget sketchybar'
]
```

---

## alt-tab

MacOSのウィンドウ切り替えにWindows風のプレビュー表示を追加。

### お気に入りポイント

- 現在のスペースにあるウィンドウのみ表示
- 同じアプリの別ウィンドウも両方表示
- 開いているウィンドウがないアプリは非表示

### 制限事項

AeroSpaceの現在いるワークスペース以外で起動しているアプリもalt-tabで表示されてしまう（技術的に統合が難しい）。

**対策**: たまにしか開かないウィンドウをMacの別ワークスペースに分ける

### インストール

```bash
brew install --cask alt-tab
```

### おすすめ設定

「スペースからウィンドウを表示する」を「現在のワークスペース」に設定し、案件ごとにMacのワークスペースで分けて使用。

---

## 余談

### ワークスペース切り替えアニメーション

完全にはオフにできない。フェードアニメーションは残る。

**スライドアニメーション無効化**: 設定 > アクセシビリティ > ディスプレイ > 視差効果を減らす をオン

### スリープ時のウィンドウ集合問題

外部ディスプレイにウィンドウを置いてスリープすると、Macの画面にウィンドウが集合してしまう。
→ AeroSpaceをオンにしていれば防げる。

---

## 参考リンク

- [AeroSpace公式ドキュメント](https://nikitabobko.github.io/AeroSpace/)
- [SketchyBar Setup](https://felixkratz.github.io/SketchyBar/setup)
- [alt-tab — Homebrew Formulae](https://formulae.brew.sh/cask/alt-tab)
- [UnixPorn](https://www.reddit.com/r/unixporn/) - デスクトップカスタマイズのインスピレーション

---

## 終わりに

VimConf2024の参加者のデスクトップがカッコ良すぎて、ウィンドウカスタマイズに取り組んだ。タスク間のスイッチコストが減り、作業効率が向上した。
