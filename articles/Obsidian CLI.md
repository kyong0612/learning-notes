---
title: "Obsidian CLI"
source: "https://help.obsidian.md/cli"
author:
  - "[[Obsidian]]"
published: 2025-02-10
created: 2026-02-13
description: "Obsidian CLIは、ターミナルからObsidianを制御するためのコマンドラインインターフェース。スクリプティング、自動化、外部ツールとの統合を可能にし、ファイル操作・プラグイン管理・Sync/Publish連携・開発者ツールなど包括的なコマンド群を提供する。Obsidian 1.12以降（早期アクセス版）で利用可能。"
tags:
  - "clippings"
  - "obsidian"
  - "cli"
  - "automation"
  - "productivity"
  - "developer-tools"
---

## 概要

**Obsidian CLI** は、ターミナルからObsidianを制御するコマンドラインインターフェースである。スクリプティング、自動化、外部ツールとの統合を目的として設計されており、Obsidianで実行可能なすべての操作をコマンドラインから実行できる。開発者ツール（DevTools）へのアクセス、要素の検査、スクリーンショットの取得、プラグインのリロードなども含まれる。

> **注意:** Obsidian CLIは **Obsidian 1.12以降**（現在は早期アクセス版）が必要であり、**Catalystライセンス** が必要。コマンドやシンタックスは早期アクセス期間中に変更される可能性がある。

---

## インストール

1. 最新のObsidianインストーラーバージョン（1.11.7）および最新の早期アクセス版（1.12.x）にアップグレード
2. Obsidianで **設定 → 一般** を開く
3. **Command line interface** を有効化
4. プロンプトに従ってObsidian CLIを登録

> Windowsでは追加で `.com` ファイルの実行が必要（Catalystメンバー向けにDiscordで提供）

---

## はじめに

> **重要:** Obsidian CLIを使用するにはObsidianアプリが起動している必要がある。起動していない場合、最初のコマンド実行時にObsidianが起動する。

Obsidian CLIは **単一コマンド実行** と **ターミナルユーザーインターフェース（TUI）** の両方をサポート。

### 単一コマンドの実行

```bash
obsidian <command>
```

### TUI（ターミナルインターフェース）の使用

```bash
obsidian
```

TUIでは以下の機能が利用可能：
- **オートコンプリート** — コマンドの自動補完
- **コマンド履歴** — 過去のコマンドを呼び出し
- **逆引き検索** — `Ctrl+R` で履歴検索

---

## 使い方

### パラメータとフラグ

- **パラメータ**: `parameter=value` の形式で値を渡す。スペースを含む場合はクォートで囲む
- **フラグ**: ブールスイッチ。含めるとオンになる（例: `silent`, `overwrite`）
- 改行は `\n`、タブは `\t` を使用

### Vaultの指定

- ターミナルの現在のディレクトリがVaultフォルダの場合、そのVaultが使用される
- それ以外は現在アクティブなVaultが使用される
- `vault=<name>` で特定のVaultを指定可能（コマンドの最初のパラメータとして指定）
- TUI内では `vault:open <name>` で切り替え

### ファイルの指定

- `file=<name>` — wikilinksと同じリンク解決方式でファイルを指定（パスや拡張子不要）
- `path=<path>` — Vaultルートからの正確なパスを指定（例: `folder/note.md`）
- いずれも未指定の場合、アクティブファイルがデフォルト

### 出力のコピー

任意のコマンドに `--copy` を追加すると、出力がクリップボードにコピーされる。

---

## コマンド一覧

### 一般コマンド

| コマンド | 説明 |
|---------|------|
| `help` | 利用可能なコマンドの一覧を表示 |
| `version` | Obsidianのバージョンを表示 |
| `reload` | アプリウィンドウをリロード |
| `restart` | アプリを再起動 |

### Bases

| コマンド | 説明 |
|---------|------|
| `bases` | Vault内の全 `.base` ファイルを一覧 |
| `base:views` | 現在のBaseファイルのビューを一覧 |
| `base:create` | 現在のBaseビューに新しいアイテムを作成 |
| `base:query` | Baseをクエリして結果を返す |

### ブックマーク

| コマンド | 説明 |
|---------|------|
| `bookmarks` | ブックマークを一覧 |
| `bookmark` | ブックマークを追加 |

### コマンドパレット

| コマンド | 説明 |
|---------|------|
| `commands` | 利用可能なコマンドIDを一覧 |
| `command` | Obsidianコマンドを実行 |
| `hotkeys` | ホットキーを一覧 |
| `hotkey` | コマンドのホットキーを取得 |

### デイリーノート

| コマンド | 説明 |
|---------|------|
| `daily` | デイリーノートを開く |
| `daily:read` | デイリーノートの内容を読み取り |
| `daily:append` | デイリーノートに内容を追記 |
| `daily:prepend` | デイリーノートの先頭に内容を追加 |

### ファイル履歴

| コマンド | 説明 |
|---------|------|
| `diff` | ローカルのファイルリカバリとSyncからバージョンを比較 |
| `history` | ファイルリカバリからバージョンを一覧 |
| `history:list` | ローカル履歴のある全ファイルを一覧 |
| `history:read` | ローカル履歴のバージョンを読み取り |
| `history:restore` | ローカル履歴のバージョンを復元 |
| `history:open` | ファイルリカバリを開く |

### ファイルとフォルダ

| コマンド | 説明 |
|---------|------|
| `file` | ファイル情報を表示（デフォルト: アクティブファイル） |
| `files` | Vault内のファイルを一覧 |
| `folder` | フォルダ情報を表示 |
| `folders` | Vault内のフォルダを一覧 |
| `open` | ファイルを開く |
| `create` | ファイルを作成または上書き |
| `read` | ファイルの内容を読み取り |
| `append` | ファイルに内容を追記 |
| `prepend` | フロントマターの後に内容を挿入 |
| `move` | ファイルを移動またはリネーム |
| `delete` | ファイルを削除（デフォルトはゴミ箱へ） |

### リンク

| コマンド | 説明 |
|---------|------|
| `backlinks` | バックリンクを一覧 |
| `links` | アウトゴーイングリンクを一覧 |
| `unresolved` | 未解決リンクを一覧 |
| `orphans` | 被リンクのないファイルを一覧 |
| `deadends` | 発リンクのないファイルを一覧 |

### アウトライン

| コマンド | 説明 |
|---------|------|
| `outline` | 現在のファイルの見出しを表示 |

### プラグイン

| コマンド | 説明 |
|---------|------|
| `plugins` | インストール済みプラグインを一覧 |
| `plugins:enabled` | 有効なプラグインを一覧 |
| `plugins:restrict` | 制限モードの切り替え/確認 |
| `plugin` | プラグイン情報を取得 |
| `plugin:enable` | プラグインを有効化 |
| `plugin:disable` | プラグインを無効化 |
| `plugin:install` | コミュニティプラグインをインストール |
| `plugin:uninstall` | コミュニティプラグインをアンインストール |
| `plugin:reload` | プラグインをリロード（開発者向け） |

### プロパティ

| コマンド | 説明 |
|---------|------|
| `aliases` | エイリアスを一覧 |
| `properties` | プロパティを一覧 |
| `property:set` | プロパティを設定 |
| `property:remove` | プロパティを削除 |
| `property:read` | プロパティ値を読み取り |

### Publish

| コマンド | 説明 |
|---------|------|
| `publish:site` | Publishサイト情報を表示 |
| `publish:list` | 公開済みファイルを一覧 |
| `publish:status` | 公開の変更を一覧 |
| `publish:add` | ファイルを公開 |
| `publish:remove` | ファイルの公開を取り消し |
| `publish:open` | 公開サイトでファイルを開く |

### ランダムノート

| コマンド | 説明 |
|---------|------|
| `random` | ランダムなノートを開く |
| `random:read` | ランダムなノートを読み取り（パス付き） |

### 検索

| コマンド | 説明 |
|---------|------|
| `search` | Vault内のテキストを検索 |
| `search:open` | 検索ビューを開く |

### Sync

| コマンド | 説明 |
|---------|------|
| `sync` | Syncの一時停止/再開 |
| `sync:status` | Syncのステータスと使用状況を表示 |
| `sync:history` | ファイルのSync履歴を一覧 |
| `sync:read` | Syncバージョンを読み取り |
| `sync:restore` | Syncバージョンを復元 |
| `sync:open` | Sync履歴を開く |
| `sync:deleted` | Syncで削除されたファイルを一覧 |

### タグ

| コマンド | 説明 |
|---------|------|
| `tags` | タグを一覧 |
| `tag` | タグ情報を取得 |

### タスク

| コマンド | 説明 |
|---------|------|
| `tasks` | タスクを一覧 |
| `task` | タスクの表示・更新 |

### テンプレート

| コマンド | 説明 |
|---------|------|
| `templates` | テンプレートを一覧 |
| `template:read` | テンプレートの内容を読み取り |
| `template:insert` | アクティブファイルにテンプレートを挿入 |

> **注意:** `resolve` オプションで `{{date}}`、`{{time}}`、`{{title}}` 変数を処理可能。`create path=<path> template=<name>` でテンプレート付きファイル作成も可能。

### テーマとスニペット

| コマンド | 説明 |
|---------|------|
| `themes` | インストール済みテーマを一覧 |
| `theme` | アクティブテーマの表示/情報取得 |
| `theme:set` | アクティブテーマを設定 |
| `theme:install` | コミュニティテーマをインストール |
| `theme:uninstall` | テーマをアンインストール |
| `snippets` | インストール済みCSSスニペットを一覧 |
| `snippets:enabled` | 有効なCSSスニペットを一覧 |
| `snippet:enable` | CSSスニペットを有効化 |
| `snippet:disable` | CSSスニペットを無効化 |

### ユニークノート

| コマンド | 説明 |
|---------|------|
| `unique` | ユニークノートを作成 |

### Vault

| コマンド | 説明 |
|---------|------|
| `vault` | Vault情報を表示 |
| `vaults` | 既知のVaultを一覧（デスクトップのみ） |
| `vault:open` | 別のVaultに切り替え（TUIのみ） |

### Webビューア

| コマンド | 説明 |
|---------|------|
| `web` | WebビューアでURLを開く |

### ワードカウント

| コマンド | 説明 |
|---------|------|
| `wordcount` | 単語数と文字数をカウント |

### ワークスペース

| コマンド | 説明 |
|---------|------|
| `workspace` | ワークスペースツリーを表示 |
| `workspaces` | 保存済みワークスペースを一覧 |
| `workspace:save` | 現在のレイアウトをワークスペースとして保存 |
| `workspace:load` | 保存済みワークスペースを読み込み |
| `workspace:delete` | 保存済みワークスペースを削除 |
| `tabs` | 開いているタブを一覧 |
| `tab:open` | 新しいタブを開く |
| `recents` | 最近開いたファイルを一覧 |

---

## 開発者コマンド

コミュニティプラグインやテーマの開発を支援するコマンド群。**エージェンティックコーディングツール** による自動テスト・デバッグにも対応。

| コマンド | 説明 |
|---------|------|
| `devtools` | Electron DevToolsの切り替え |
| `dev:debug` | Chrome DevTools Protocolデバッガーのアタッチ/デタッチ |
| `dev:cdp` | Chrome DevTools Protocolコマンドの実行 |
| `dev:errors` | キャプチャしたJavaScriptエラーの表示 |
| `dev:screenshot` | スクリーンショットの取得（base64 PNG） |
| `dev:console` | キャプチャしたコンソールメッセージの表示 |
| `dev:css` | ソース位置付きCSSインスペクション |
| `dev:dom` | DOM要素のクエリ |
| `dev:mobile` | モバイルエミュレーションの切り替え |
| `eval` | JavaScriptの実行と結果の返却 |

---

## キーボードショートカット（TUI）

TUI内で使用可能なショートカットカテゴリ：
- **ナビゲーション** — カーソル移動
- **編集** — テキスト編集操作
- **オートコンプリート** — 補完機能の制御
- **履歴** — コマンド履歴のナビゲーション（`Ctrl+R` で逆引き検索）

---

## トラブルシューティング

### 共通

- 最新のObsidianインストーラーバージョン（1.11.7）と最新の早期アクセス版（1.12）を使用していることを確認
- CLI登録後、PATHの変更を反映させるためにターミナルを再起動
- Obsidianが起動している必要がある（CLIは起動中のObsidianインスタンスに接続する）

### Windows

- ターミナルリダイレクター（`Obsidian.com` ファイル）が必要（ObsidianはGUIアプリとして動作するため、stdin/stdoutの適切な接続が必要）
- `Obsidian.com` ファイルはObsidian公式DiscordのCatalystメンバー向けチャンネルからダウンロード
- `Obsidian.exe` と同じフォルダに配置（`C:\Users\<Username>\AppData\Local\Programs\obsidian\` など）

### macOS

- CLI登録により `~/.zprofile` にObsidianバイナリディレクトリがPATHに追加される
- **別のシェルを使用する場合:**
  - **Bash:** `~/.bash_profile` に `export PATH="$PATH:/Applications/Obsidian.app/Contents/MacOS"` を追加
  - **Fish:** `fish_add_path /Applications/Obsidian.app/Contents/MacOS` を実行

### Linux

- CLI登録により `/usr/local/bin/obsidian` にシンボリックリンクが作成される（sudo必要）
- **AppImage:** シンボリックリンクは `.AppImage` ファイルを指す。sudoが失敗した場合は `~/.local/bin/obsidian` に作成される
- **Snap:** insider `.asar` が検出されない場合、`XDG_CONFIG_HOME` をSnap設定パスに設定する必要あり
- **Flatpak:** 自動設定を試みるが、手動でのシンボリックリンク作成が必要な場合あり

---

## 主な特徴と発見

1. **包括的なカバレッジ**: Obsidianのほぼすべての機能（ファイル操作、プラグイン管理、Sync、Publish、検索、タグ、タスクなど）をCLIから操作可能
2. **エージェンティック対応**: 開発者コマンドにより、AIコーディングツールによる自動テスト・デバッグが可能
3. **TUIサポート**: オートコンプリートやコマンド履歴を備えたインタラクティブなターミナルUIを提供
4. **早期アクセス段階**: 現時点ではCatalystライセンスが必要で、コマンドや構文は変更される可能性がある
5. **クロスプラットフォーム**: Windows、macOS、Linux（AppImage/Snap/Flatpak含む）に対応
