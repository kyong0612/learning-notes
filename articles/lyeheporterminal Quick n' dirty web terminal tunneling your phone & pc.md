---
title: "lyehe/porterminal: Quick n' dirty web terminal tunneling your phone & pc"
source: "https://github.com/lyehe/porterminal"
author:
  - "[[lyehe]]"
published: 2026-01-13
created: 2026-01-13
description: |
  スマートフォンやPCからターミナルにリモートアクセスできるウェブターミナルトンネリングツール。Cloudflareトンネルを使用し、QRコードをスキャンするだけで、SSHやポートフォワーディングなしにどこからでもターミナルにアクセス可能。モバイル最適化されたタッチ操作、マルチタブセッション、クロスプラットフォーム対応が特徴。
tags:
  - terminal
  - remote-access
  - cloudflare-tunnel
  - python
  - web-terminal
  - mobile
  - qr-code
  - ssh-alternative
---

## 概要

**Porterminal** は、「ベッドでコーディングしたい」というシンプルな動機から生まれたウェブターミナルツール。従来のngrok、Cloudflare Quick Tunnel、Termius、Claude Code webなどの代替ツールの欠点を解消し、**1コマンドでQRコードをスキャンするだけでターミナルにアクセス**できる。

![Porterminal Banner](https://github.com/lyehe/porterminal/raw/master/assets/banner.jpg)

### 基本的な使い方

```bash
# 1. コマンド実行
uvx ptn

# 2. QRコードをスキャン

# 3. スマホからターミナルにアクセス
```

![Porterminal Demo](https://github.com/lyehe/porterminal/raw/master/assets/demo.gif)

---

## 開発動機（Why）

作者が既存ツールに感じた問題点：

| ツール | 問題点 |
|--------|--------|
| **ngrok** | 登録が必要、無料プランが使いにくい |
| **Cloudflare Quick Tunnel** | スマホから直接使いにくい |
| **Termius** | ポートフォワーディング、ファイアウォール設定、鍵管理など複雑 |
| **Claude Code web** | ローカルハードウェアや環境にアクセスできない |
| **Happy** | 肥大化しており、アップデートが遅い |

**解決策**: **コマンド実行 → QRスキャン → 入力開始** というシンプルなワークフロー。

---

## 機能（Features）

### 1. ワンコマンドで即座にアクセス
- SSH不要、ポートフォワーディング不要、設定ファイル不要
- Cloudflareトンネル + QRコード

### 2. モバイル最適化
- タッチ最適化されたUI
- 慣性スクロール
- ピンチズーム
- スワイプジェスチャー
- 修飾キー（Ctrl、Alt）対応

### 3. フルターミナルアプリ対応
- vim、htop、less、tmuxが正しく動作
- alt-screenバッファの適切な処理

### 4. 永続的マルチタブセッション
- 切断後もセッションが維持される
- ブラウザを閉じても、ネットワークを切り替えても、別デバイスから再接続可能
- シェルと実行中プロセスがそのまま残る
- 複数デバイスから同時に同じセッションを表示可能

### 5. クロスプラットフォーム
- **Windows**: PowerShell、CMD、WSL
- **Linux/macOS**: Bash、Zsh、Fish、Nushell、`$SHELL`経由の任意のシェル
- シェルの自動検出

---

## インストール

### パッケージマネージャー

| 方法 | インストール | アップデート |
|------|-------------|--------------|
| **uvx** (インストール不要) | `uvx ptn` | `uvx --refresh ptn` |
| **uv tool** | `uv tool install ptn` | `uv tool upgrade ptn` |
| **pipx** | `pipx install ptn` | `pipx upgrade ptn` |
| **pip** | `pip install ptn` | `pip install -U ptn` |

### ワンラインインストール（uv + ptn）

| OS | コマンド |
|----|----------|
| **Windows** | `powershell -ExecutionPolicy ByPass -c "irm https://raw.githubusercontent.com/lyehe/porterminal/master/install.ps1 \| iex"` |
| **macOS/Linux** | `curl -LsSf https://raw.githubusercontent.com/lyehe/porterminal/master/install.sh \| sh` |

### 要件
- Python 3.12以上
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)（未インストールの場合は自動インストール）

---

## 使用方法

```bash
ptn                    # 現在のディレクトリで開始
ptn ~/projects/myapp   # 指定フォルダで開始
```

### コマンドラインオプション

| フラグ | 説明 |
|--------|------|
| `-n`, `--no-tunnel` | ローカルネットワークのみ（Cloudflareトンネルなし） |
| `-b`, `--background` | バックグラウンドで実行し、すぐにリターン |
| `-p`, `--password` | このセッションにパスワードを設定 |
| `-dp`, `--default-password` | 設定でパスワード要求のオン/オフを切り替え |
| `-v`, `--verbose` | 詳細な起動ログを表示 |
| `-i`, `--init` | `.ptn/ptn.yaml`設定ファイルを作成（プロジェクトスクリプトを自動検出） |
| `-u`, `--update` | 最新バージョンにアップデート |
| `-c`, `--check-update` | 新しいバージョンが利用可能か確認 |
| `-V`, `--version` | バージョン表示 |

---

## モバイルジェスチャー

| ジェスチャー | アクション |
|--------------|----------|
| **タップ** | ターミナルにフォーカス、選択解除 |
| **長押し** | テキスト選択開始 |
| **ダブルタップ** | 単語選択 |
| **左右スワイプ** | 矢印キー（← →） |
| **スクロール** | 慣性スクロール（物理演算付き） |
| **ピンチ** | テキストズーム（10-24px） |

### 修飾キー（Ctrl、Alt、Shift）
- **1回タップ**: スティッキーモード（1回のキーストロークのみ有効）
- **ダブルタップ**: ロックモード（解除するまで有効）

---

## 設定（Configuration）

### 設定ファイルの作成

```bash
ptn -i
# Created: .ptn/ptn.yaml
# Discovered 3 project script(s): build, dev, test
```

`package.json`、`pyproject.toml`、`Makefile`からプロジェクトスクリプトを自動検出してボタンとして追加。

### 設定例（ptn.yaml）

```yaml
# ターミナル設定
terminal:
  default_shell: nu              # デフォルトシェルID
  shells:                        # カスタムシェル定義
    - id: nu
      name: Nushell
      command: nu
      args: []

# カスタムボタン（ツールバーに表示）
# row: 1 = デフォルト行、2+ = 追加行
buttons:
  - label: "claude"
    send:
      - "claude"
      - 100        # 遅延（ミリ秒）
      - "\r"
  - label: "build"
    send: "npm run build\r"
    row: 2         # 2行目のボタン

# アップデートチェック設定
update:
  notify_on_startup: true   # 起動時にアップデート通知を表示
  check_interval: 86400     # チェック間隔（秒、デフォルト: 24時間）

# セキュリティ設定
security:
  require_password: true    # 起動時に常にパスワードを要求
  max_auth_attempts: 5      # 切断前の最大失敗試行回数
```

### 設定ファイルの検索順序
1. `$PORTERMINAL_CONFIG_PATH`
2. `./ptn.yaml`
3. `./.ptn/ptn.yaml`
4. `~/.ptn/ptn.yaml`

---

## セキュリティ

画面が他人に見られる可能性がある場合はパスワードを使用：

```bash
ptn -p                 # このセッションにパスワードを設定
ptn -dp                # デフォルトでパスワードを有効化（トグル）
```

**重要**: パスワードはセッションごと（ディスクには保存されない）

---

## トラブルシューティング

### 接続に失敗する場合
Cloudflareトンネルが接続をブロックすることがある。サーバーを再起動（`Ctrl+C`、その後`ptn`）して新しいトンネルURLを取得。

### シェルが検出されない場合
`$SHELL`環境変数を設定するか、`ptn.yaml`でシェルを設定。

---

## 技術情報

| 項目 | 詳細 |
|------|------|
| **言語構成** | Python 62.8%、TypeScript 30.0%、CSS 4.1%、HTML 2.4% |
| **ライセンス** | AGPL-3.0 |
| **最新バージョン** | v0.4.1（2026年1月13日） |
| **PyPI** | [ptn](https://pypi.org/project/ptn/) |
| **Stars** | 253 |
| **Contributors** | 4 |

---

## コントリビュート

```bash
git clone https://github.com/lyehe/porterminal
cd porterminal
uv sync
uv run ptn
```

Issues・PRを歓迎。
