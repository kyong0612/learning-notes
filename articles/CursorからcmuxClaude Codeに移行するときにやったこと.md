---
title: "Cursorからcmux/Claude Codeに移行するときにやったこと"
source: "https://zenn.dev/d0ne1s/articles/7adbd3a3d54b1d"
author:
  - "[[d0ne1s]]"
published: 2026-03-28
created: 2026-03-30
description: "CursorからcmuxとClaude Codeへ移行する際に行った環境構築・カスタマイズの全手順を共有する記事。Ghosttyの見た目調整、Starship/zshrcによるシェル整備、yazi・grip・git-watchなどのツール導入、cmuxレイアウト自動化スクリプト、CLAUDE.mdやMCPサーバー設定、実行権限・フック・カスタムスキルの構築まで、11ステップにわたる包括的な移行ガイド。"
tags:
  - "clippings"
  - "cmux"
  - "Claude Code"
  - "Cursor"
  - "Ghostty"
  - "Starship"
  - "terminal"
  - "developer-tools"
  - "workflow"
---

## 概要

CursorからcmuxとClaude Codeへ移行する際に、初期設定のままでは使いにくかった部分を約1週間かけて改善した記録。Ghosttyの見た目設定からシェル整備、ファイルツリー・Markdownプレビュー・git差分監視の導入、レイアウト自動化、CLAUDE.mdの作成、MCP連携、実行権限制御、カスタムスキル作成まで、11のステップで「トータルでCursorより使いやすい」状態を実現した。

## 主要なトピック

### 0. cmuxとClaude Codeのインストール

まずcmuxとClaude Codeをインストールし、Claude Codeは課金も行った。

### 1. cmuxの見た目を整える（Ghostty設定）

cmuxは内部的にGhosttyをターミナルエンジンとして使用しているため、Ghosttyの設定ファイルで見た目をカスタマイズした。

- **テーマ**: Kanagawa Wave（ダークテーマ）
- **フォント**: SF Mono（別途brewでインストール）、サイズ13、合字無効
- **カーソル・選択色**: 青系（`#7e9cd8`）と暗い青（`#2d4f67`）
- **分割ペイン**: 暗い区切り線、非フォーカスペインは半透明

```
theme = "Kanagawa Wave"
window-theme = dark
font-family = "SF Mono"
font-size = 13
cursor-color = #7e9cd8
unfocused-split-opacity = 0.7
```

### 2. シェル周りの整備（Starship / .zshrc）

#### Starship

表示項目をディレクトリ、gitブランチ、gitステータス、コマンド実行時間に絞り、不要なモジュール（aws, gcloud, nodejs, ruby, python, golang, php, java, docker_context, terraform, package）は全て無効化した。

```
format = """
$directory\
$git_branch\
$git_status\
$cmd_duration\
$line_break\
$character"""
```

#### .zshrc

以下の3領域をカスタマイズ：

- **コマンド補完とサジェスト**: `zsh-autosuggestions`（履歴ベースの候補をグレー表示）、`zsh-syntax-highlighting`（構文ハイライト）を導入。`Ctrl+F`でサジェスト確定。
- **履歴検索**: `↑`/`↓`キーで入力中のコマンドにマッチする履歴を辿れるように設定。
- **便利関数**:
  - `h`: pecoで履歴検索してそのまま実行
  - `c`: pecoで過去に訪れたディレクトリに移動
  - `rm`: 誤削除防止のため`trash`コマンドに置き換え

### 3. ファイルツリー → yaziを導入

ファイルツリー表示のためにターミナルファイルマネージャ「yazi」を導入。

- 隠しファイルをデフォルト表示（`show_hidden = true`）
- カスタムキーマップ:
  - `F`: fzf検索（git管理下のファイルをfd+fzfで検索）
  - `yp`: ファイルの絶対パスをクリップボードにコピー
  - `gp`: Markdownプレビュー（後述のgripと連携）

### 4. Markdownプレビュー → gripで環境構築

yaziで選択したMarkdownファイルをブラウザプレビューする仕組みを構築。

- **grip**: GitHub風のMarkdownレンダリングツール
- **シェルスクリプト**: gripを起動し、cmuxの同一ペインの別タブでブラウザを開く
  - ホットリロード対応（ファイル変更を監視して自動更新）
  - `pkill`でプロセスの重複防止
- **CSS**: `~/.grip/settings.py`でGitHub Markdown Dark CSSを適用し、幅を100%に調整
- yaziの`--orphan`オプションでバックグラウンド実行し、yaziをブロックしない

```bash
#!/bin/bash
file="$1"
port=6419
pkill -f "grip .* $port" 2>/dev/null
grip "$file" "$port" >/dev/null 2>&1 &
sleep 1
surf=$(cmux identify | jq -r '.caller.surface_ref')
cmux browser "$surf" tab new "http://127.0.0.1:$port/"
```

### 5. 変更検知 → git-watchコマンド

gitの変更状態をリアルタイムで監視・表示するスクリプト`git-watch`を作成。

- `git status -sb`と`git diff --stat`を5秒間隔で表示
- **MD5ハッシュで変更検知**し、差分がある時だけ画面を更新（チラつき防止）
- **サブリポジトリ対応**: 直下のサブディレクトリで「dirty」なもの（ファイル変更あり / main・master以外のブランチ / unpushedコミット）だけ表示

### 6. レイアウト自動化 → cmux-setupスクリプト

cmuxの4ペインレイアウトを自動構築するスクリプトを作成。

```
┌──────────┬─────────────────────┐
│          │   shell (小さめ)     │
│   yazi   ├─────────────────────┤
│          │                     │
├──────────┤    Claude Code      │
│ git diff │      (メイン)        │
└──────────┴─────────────────────┘
```

- **左上**: yazi（ファイルマネージャー）+ Markdownプレビュー
- **左下**: git-watch（リアルタイムdiff表示）
- **右上**: シェル（コマンド実行用、小さめ）
- **右下**: Claude Code（メイン作業エリア）

`cmux-setup`一発で全ペインが立ち上がる。

### 7. diff GUIビューア → DiffViewerを自作

git-watchだけではdiffの全体像が掴みにくいため、GUIでdiffを確認できる[DiffViewer](https://github.com/nyshk97/diff-viewer)を自作。

- 設定ファイルにリポジトリを登録
- `Cmd+Ctrl+D`で一覧からdiffを確認
- ランチャーモードで開くため、cmuxを全画面表示していてもウィンドウ移動が不要

### 8. CLAUDE.mdの作成

グローバルな指示書`~/.claude/CLAUDE.md`を作成し、全プロジェクト共通のルールを定義。

- **Brew パッケージ管理**: `brew install`を直接実行せず、必ずBrewfile経由
- **設定ファイル管理**: 実体は`~/Library/CloudStorage/Dropbox/dotfiles/`に配置し、symlinkで本来の場所に配置
- **Claude Code MCP サーバー管理**: `setup-claude-mcp.sh`でMCPサーバー定義を管理

### 9. MCPサーバーの設定

Cursorで使っていたMCP連携をClaude Codeにも追加。

- **Sentry**: エラー監視・イシュー検索をClaude Codeから直接操作
- **Jira (Atlassian)**: チケット管理・Confluenceページの参照・編集
- セットアップスクリプトで管理し、新しいマシンでも再現可能

```bash
claude mcp add --transport http --scope user sentry https://mcp.sentry.dev/mcp
claude mcp add --transport http --scope user jira https://mcp.atlassian.com/v1/mcp
```

### 10. 実行権限の制御

Claude Codeの実行権限を3段階で定義：

| 区分 | 内容 |
|------|------|
| **Allow** | 日常的に使うコマンド（git, gh, npm, rails, docker, terraform, make, ls, find, grep, cat, mkdir, cp, mv, touch）を自動許可 |
| **Deny** | 機密ファイル（.env, ~/.aws/credentials, ~/.ssh/*, master.key, *.pem）は絶対に読み書きさせない |
| **Ask** | 破壊的操作（git reset --hard, git push --force, git branch -D, curl -X/-d, sudo, rm, terraform apply/destroy）は都度確認 |

#### フック（Hooks）

2つのフックを作成：

1. **PreToolUse: check-git-tracked.sh** — ファイル編集時にgit管理対象かを検証。git-ignoredやuntrackedなファイルの意図せぬ編集を防止。git追跡対象なら許可なく自由に編集させる。
2. **PostToolUse: log-bash-commands.sh** — 実行された全bashコマンドをログに記録。後から`review_permissions`スキルで許可設定を更新するために使用。

### 11. カスタムスキル（Skills）の作成

繰り返し使うワークフローを8つのスキルとして定義（`~/.claude/skills/<name>/SKILL.md`に配置）：

| スキル名 | 概要 |
|---------|------|
| **commit** | `<type>: <message>`形式でgitコミット。pre-commitフック失敗時はamendせず新規コミット |
| **create_branch** | プロジェクトの命名規則を自動検出してブランチ作成。チケットURL/番号の自動抽出対応 |
| **create_pull_request** | Summary / Changes / Test Planセクション付きPR作成。ベースブランチの自動検出 |
| **define** | 対話的に要件定義を行い`requirements.md`を生成。概念→技術の段階的探索 |
| **dotfiles_manage** | 設定ファイルをdotfiles管理に追加。symlink作成と`setup-dotfiles.sh`の自動更新 |
| **review_permissions** | セッション中のbashコマンドログを分析し、`settings.json`の許可リスト更新を提案 |
| **create_general_skill** | 再利用可能なスキルを`~/.claude/skills/`に作成するメタスキル |
| **add_repo_to_diffviewer** | gitリポジトリをDiffViewerの設定に追加。重複チェック付き |

`review_permissions`スキルは前述の`log-bash-commands.sh`フックと連携し、セッション中に許可を求められたコマンドをまとめて見直してsettings.jsonに反映する仕組み。

## 重要な事実・データ

- **使用モデル**: `claude-opus-4-6`をsettings.jsonで指定
- **移行期間**: 約1週間のちょこちょこ改善
- **ツールスタック**: cmux + Ghostty + yazi + grip + git-watch + DiffViewer + Starship
- **MCP連携**: Sentry（エラー監視）、Jira/Confluence（チケット・ドキュメント管理）
- **カスタムスキル数**: 8つ
- **フック数**: 2つ（PreToolUse, PostToolUse）
- **設定ファイル管理**: Dropbox経由でsymlink管理し、マシン間で再現可能

## 結論・示唆

### 著者の結論

これだけ設定すると、cmuxとCursorの併用からcmuxに一本化できそうな状態になった。「トータルで見てCursorの時より使いやすい」という状態に到達。まだまだ改善の余地はあるとのこと。

### 実践的な示唆

- cmux/Claude Codeへの移行は、初期設定のままでは使いにくいが、シェル環境・ツール・設定を整えることで十分実用的になる
- **設定のポータビリティ**が重要：Brewfile、dotfiles管理（Dropbox+symlink）、MCPセットアップスクリプトで新しいマシンでも再現可能にする
- **セキュリティ設計**: Allow/Deny/Askの3段階権限とフックで、安全性を確保しながら利便性を高められる
- **スキルの活用**: 繰り返しのワークフローをスキル化することで、AIとの協業効率が向上する
- **レイアウト自動化**: cmux-setupスクリプトにより、毎回のセットアップ作業を排除

## 関連リソース

- [cmux](https://zenn.dev/topics/cmux) — Claude Code用のターミナルマルチプレクサ
- [Ghostty](https://zenn.dev/topics/ghostty) — cmuxが内部で使用するターミナルエンジン
- [yazi](https://yazi-rs.github.io/) — ターミナルファイルマネージャー
- [grip](https://github.com/joeyespo/grip) — GitHub風Markdownプレビューツール
- [DiffViewer](https://github.com/nyshk97/diff-viewer) — 著者が自作したGUI diffビューア
- [Starship](https://starship.rs/) — クロスシェルプロンプト
- [SF Mono](https://developer.apple.com/jp/fonts/) — Apple製のモノスペースフォント

---

*Source: [Cursorからcmux/Claude Codeに移行するときにやったこと](https://zenn.dev/d0ne1s/articles/7adbd3a3d54b1d)*