---
title: "Fullscreen rendering"
source: "https://code.claude.com/docs/en/fullscreen"
author:
  - "[[Anthropic]]"
published:
created: 2026-04-02
description: "Claude Code CLIのフルスクリーンレンダリングモードに関する公式ドキュメント。CLAUDE_CODE_NO_FLICKER=1で有効化でき、ちらつきの除去、長い会話でのメモリ使用量の安定化、マウスサポートを提供する。VS Code統合ターミナルやtmux、iTerm2などで特に効果的。"
tags:
  - "clippings"
  - "Claude Code"
  - "CLI"
  - "Terminal"
  - "Developer Tools"
  - "Anthropic"
---

## 概要

Fullscreen renderingは、Claude Code CLIの代替レンダリングパスであり、ターミナルの**alternate screen buffer**（`vim`や`htop`と同様）にインターフェースを描画する。これにより、ちらつきの除去、長い会話でのメモリ使用量のフラット化、マウスサポートが実現される。現在は**リサーチプレビュー**段階で、Claude Code **v2.1.89以降**が必要。

効果が最も顕著なのは、レンダリングスループットがボトルネックとなるターミナルエミュレータ（VS Code統合ターミナル、tmux、iTerm2など）で、Claudeの作業中にスクロール位置がトップに飛んだり、ツール出力のストリーミング中に画面がフラッシュする問題を解決する。

> 「fullscreen」はClaude Codeがターミナルの描画面を占有する方式を指し、ウィンドウの最大化とは無関係。任意のウィンドウサイズで動作する。

## 主要なトピック

### 有効化方法

環境変数 `CLAUDE_CODE_NO_FLICKER` を設定して起動する：

```bash
CLAUDE_CODE_NO_FLICKER=1 claude
```

すべてのセッションで有効にする場合は、シェルプロファイル（`~/.zshrc` / `~/.bashrc`）にエクスポートを追加：

```bash
export CLAUDE_CODE_NO_FLICKER=1
```

### 変更点

入力ボックスが画面下部に固定され、出力のストリーミング中も動かなくなる。表示中のメッセージのみがレンダーツリーに保持されるため、会話の長さに関係なくメモリが一定。

会話がalternate screen bufferに存在するため、以下の操作方法が変更される：

| 従来 | フルスクリーン | 詳細 |
|------|--------------|------|
| `Cmd+f` / tmux検索 | `Ctrl+o` → `/` で検索、または `Ctrl+o` → `[` でネイティブスクロールバックに書き出し | テキスト検索 |
| ターミナルのクリック＆ドラッグ | アプリ内選択、マウスリリース時に自動コピー | テキスト選択 |
| `Cmd`-クリックでURL | クリックでURL | リンクオープン |

### マウスサポート

フルスクリーンレンダリングではマウスイベントをキャプチャし、Claude Code内で処理する：

- **プロンプト入力のカーソル配置**: 入力中のテキスト内でクリックしてカーソルを移動
- **ツール結果の展開/折りたたみ**: 折りたたまれたツール結果をクリックで展開、再クリックで折りたたみ
- **URL/ファイルパスを開く**: ファイルパスはデフォルトアプリ、URLはブラウザで開く
  - VS Code統合ターミナルなどxterm.jsベースのターミナルでは `Cmd`-クリックを継続使用
- **テキスト選択**: クリック＆ドラッグで選択。ダブルクリックで単語選択、トリプルクリックで行選択
- **マウスホイールスクロール**: 会話内をスクロール

選択テキストはマウスリリース時に自動的にクリップボードにコピーされる。`/config` の **Copy on select** でオフに切替可能。オフの場合は `Ctrl+Shift+c` で手動コピー。

### スクロール操作

| ショートカット | アクション |
|--------------|----------|
| `PgUp` / `PgDn` | 半画面分スクロール |
| `Ctrl+Home` | 会話の先頭にジャンプ |
| `Ctrl+End` | 最新メッセージにジャンプし、自動追従を再開 |
| マウスホイール | 数行ずつスクロール |

MacBookキーボードでは `Fn` + 矢印キーで代替：`Fn+↑` = `PgUp`、`Fn+↓` = `PgDn`、`Fn+←` = `Home`、`Fn+→` = `End`。

上方向にスクロールすると自動追従が一時停止する。`Ctrl+End` またはスクロールで最下部に移動すると再開。

#### ホイールスクロール速度の調整

`CLAUDE_CODE_SCROLL_SPEED` でベーススクロール距離の倍率を設定：

```bash
export CLAUDE_CODE_SCROLL_SPEED=3
```

値は1〜20。`3` は `vim` 等のデフォルトに相当。

### 会話の検索とレビュー（トランスクリプトモード）

`Ctrl+o` でトランスクリプトモードに入ると、`less` スタイルのナビゲーションと検索が利用可能：

| キー | アクション |
|------|----------|
| `/` | 検索を開く。`Enter` で確定、`Esc` でキャンセルしスクロール位置を復元 |
| `n` / `N` | 次/前のマッチにジャンプ |
| `j` / `k` or `↑` / `↓` | 1行スクロール |
| `g` / `G` or `Home` / `End` | 先頭/末尾にジャンプ |
| `Ctrl+u` / `Ctrl+d` | 半ページスクロール |
| `Ctrl+b` / `Ctrl+f` or `Space` / `b` | 1ページスクロール |
| `Esc`, `q`, `Ctrl+o` | トランスクリプトモードを終了 |

ネイティブスクロールバックへの書き出し：

- **`[`**: 会話全体をターミナルのネイティブスクロールバックバッファに書き込む。`Cmd+f` やtmuxコピーモードで検索可能になる
- **`v`**: 会話を一時ファイルに書き出し、`$VISUAL` または `$EDITOR` で開く

### tmuxでの使用

フルスクリーンレンダリングはtmux内で動作するが、2つの注意点がある：

1. **マウスモードが必要**: `~/.tmux.conf` に以下を追加：
   ```bash
   set -g mouse on
   ```
   マウスモードがオフの場合、ホイールイベントがtmuxに送られる。キーボードスクロール（`PgUp`/`PgDn`）は影響なし。

2. **iTerm2のtmux統合モード非対応**: `tmux -CC` で起動するモードではalternate screen bufferとマウストラッキングが正しく動作しない。通常のtmux（`-CC` なし）は問題なし。

### ネイティブテキスト選択の維持

マウスキャプチャが問題になる場合（SSH越し、tmux内など）、`CLAUDE_CODE_DISABLE_MOUSE=1` でマウスキャプチャをオフにしつつ、ちらつき防止とフラットメモリは維持できる：

```bash
CLAUDE_CODE_NO_FLICKER=1 CLAUDE_CODE_DISABLE_MOUSE=1 claude
```

マウスキャプチャ無効時は、キーボードスクロールとネイティブ選択が使用可能。クリックによるカーソル配置、ツール出力展開、URLクリック、ホイールスクロールは失われる。

## 重要な事実・データ

- **必要バージョン**: Claude Code v2.1.89以降
- **環境変数**: `CLAUDE_CODE_NO_FLICKER=1`（有効化）、`CLAUDE_CODE_DISABLE_MOUSE=1`（マウスキャプチャ無効）、`CLAUDE_CODE_SCROLL_SPEED=N`（スクロール速度、1〜20）
- **メモリ**: 表示中のメッセージのみレンダーツリーに保持され、会話の長さに依存しない定常メモリ使用量
- **対応ターミナル**: VS Code統合ターミナル、tmux、iTerm2、Ghostty、WezTerm、kittyなど
- **kittyキーボードプロトコル対応ターミナル**: kitty、WezTerm、Ghostty、iTerm2では `Cmd+c` でのコピーも動作

## 結論・示唆

### 実践的な示唆

- VS Code統合ターミナルやtmuxでClaude Codeを使用していて、画面のちらつきやスクロールジャンプに悩んでいる場合は、`CLAUDE_CODE_NO_FLICKER=1` を試す価値がある
- 長い会話でメモリ使用量が増加する問題がある場合にも有効
- SSHやtmux環境でマウスキャプチャが問題になる場合は `CLAUDE_CODE_DISABLE_MOUSE=1` と組み合わせて使用
- キーバインドは[Keybindings設定](https://code.claude.com/en/keybindings)でカスタマイズ可能

## 制限事項・注意点

- **リサーチプレビュー段階**: 一般的なターミナルエミュレータでテスト済みだが、一般的でないターミナルや特殊な構成ではレンダリング上の問題が発生する可能性がある
- **iTerm2 tmux統合モード非対応**: `tmux -CC` セッションでは使用不可
- **マウスキャプチャの制約**: ネイティブのコピーオンセレクト、tmuxコピーモード、Kittyヒントなどが使用不可になる（`CLAUDE_CODE_DISABLE_MOUSE=1` で回避可能）
- **クリップボードパス**: tmux内ではtmuxペーストバッファに書き込み、SSH越しではOSC 52エスケープシーケンスにフォールバック（一部ターミナルではデフォルトでブロック）
- **iTerm2でのマウスホイール**: Settings → Profiles → Terminal → **Enable mouse reporting** をオンにする必要がある場合がある
- 問題が発生した場合は `/feedback` コマンドまたは [GitHubリポジトリ](https://github.com/anthropics/claude-code/issues) で報告

---

*Source: [Fullscreen rendering](https://code.claude.com/docs/en/fullscreen)*
