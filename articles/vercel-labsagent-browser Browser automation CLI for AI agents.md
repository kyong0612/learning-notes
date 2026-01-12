---
title: "vercel-labs/agent-browser: Browser automation CLI for AI agents"
source: "https://github.com/vercel-labs/agent-browser"
author:
  - "[[ctate]]"
  - "[[vercel-labs]]"
published:
created: 2026-01-12
description: "AIエージェント向けのヘッドレスブラウザ自動化CLIツール。高速なRust CLIとNode.jsフォールバックを備え、Playwrightを使用してブラウザを操作。スナップショット機能でアクセシビリティツリーを取得し、ref参照による確実な要素操作が可能。"
tags:
  - "ai-agents"
  - "browser-automation"
  - "cli"
  - "playwright"
  - "rust"
  - "headless-browser"
  - "typescript"
  - "web-automation"
---

## 概要

**agent-browser** は、AIエージェント向けに設計されたヘッドレスブラウザ自動化CLIツールです。高速なRust製CLIとNode.jsフォールバックを組み合わせ、Playwrightを使用してブラウザを制御します。

### 主な特徴

- **高速なRust CLI**: ネイティブバイナリで高速に動作
- **Node.jsフォールバック**: Rustバイナリが利用できない環境でも動作
- **スナップショット機能**: アクセシビリティツリーをref参照付きで取得
- **AIエージェントに最適化**: `--json`オプションで機械可読な出力
- **セッション管理**: 複数の分離されたブラウザインスタンスを同時実行可能
- **クロスプラットフォーム**: macOS、Linux、Windowsに対応

---

## インストール

### npm（推奨）

```bash
npm install -g agent-browser
agent-browser install  # Chromiumをダウンロード
```

### ソースから

```bash
git clone https://github.com/vercel-labs/agent-browser
cd agent-browser
pnpm install
pnpm build
agent-browser install
```

### Linux依存関係

Linuxでは、システム依存関係をインストール：

```bash
agent-browser install --with-deps
# または手動で: npx playwright install-deps chromium
```

---

## クイックスタート

```bash
agent-browser open example.com
agent-browser snapshot                    # ref付きアクセシビリティツリーを取得
agent-browser click @e2                   # スナップショットのrefでクリック
agent-browser fill @e3 "test@example.com" # refでフィールドに入力
agent-browser get text @e1                # refでテキストを取得
agent-browser screenshot page.png
agent-browser close
```

### 従来のセレクタ（も対応）

```bash
agent-browser click "#submit"
agent-browser fill "#email" "test@example.com"
agent-browser find role button click --name "Submit"
```

---

## コマンド一覧

### コアコマンド

| コマンド | 説明 |
|---------|------|
| `open <url>` | URLに移動（エイリアス: goto, navigate） |
| `click <sel>` | 要素をクリック |
| `dblclick <sel>` | ダブルクリック |
| `focus <sel>` | 要素にフォーカス |
| `type <sel> <text>` | 要素に入力 |
| `fill <sel> <text>` | クリア後に入力 |
| `press <key>` | キーを押す（Enter, Tab, Control+a） |
| `keydown <key>` | キーを押し続ける |
| `keyup <key>` | キーを離す |
| `hover <sel>` | ホバー |
| `select <sel> <val>` | ドロップダウンを選択 |
| `check <sel>` | チェックボックスをオン |
| `uncheck <sel>` | チェックボックスをオフ |
| `scroll <dir> [px]` | スクロール（up/down/left/right） |
| `scrollintoview <sel>` | 要素をビューにスクロール |
| `drag <src> <tgt>` | ドラッグ＆ドロップ |
| `upload <sel> <files>` | ファイルをアップロード |
| `screenshot [path]` | スクリーンショット（--full でフルページ） |
| `pdf <path>` | PDFとして保存 |
| `snapshot` | ref付きアクセシビリティツリー（AIに最適） |
| `eval <js>` | JavaScriptを実行 |
| `close` | ブラウザを閉じる（エイリアス: quit, exit） |

### 情報取得

```bash
agent-browser get text <sel>          # テキストコンテンツを取得
agent-browser get html <sel>          # innerHTMLを取得
agent-browser get value <sel>         # input値を取得
agent-browser get attr <sel> <attr>   # 属性を取得
agent-browser get title               # ページタイトルを取得
agent-browser get url                 # 現在のURLを取得
agent-browser get count <sel>         # マッチする要素数をカウント
agent-browser get box <sel>           # バウンディングボックスを取得
```

### 状態チェック

```bash
agent-browser is visible <sel>        # 可視かどうか
agent-browser is enabled <sel>        # 有効かどうか
agent-browser is checked <sel>        # チェック済みかどうか
```

### 要素検索（セマンティックロケーター）

```bash
agent-browser find role <role> <action> [value]       # ARIAロールで検索
agent-browser find text <text> <action>               # テキストで検索
agent-browser find label <label> <action> [value]     # ラベルで検索
agent-browser find placeholder <ph> <action> [value]  # プレースホルダーで検索
agent-browser find alt <text> <action>                # alt属性で検索
agent-browser find title <text> <action>              # title属性で検索
agent-browser find testid <id> <action> [value]       # data-testidで検索
agent-browser find first <sel> <action> [value]       # 最初のマッチ
agent-browser find last <sel> <action> [value]        # 最後のマッチ
agent-browser find nth <n> <sel> <action> [value]     # N番目のマッチ
```

**アクション**: `click`, `fill`, `check`, `hover`, `text`

### 待機コマンド

```bash
agent-browser wait <selector>         # 要素が可視になるまで待機
agent-browser wait <ms>               # 指定時間待機（ミリ秒）
agent-browser wait --text "Welcome"   # テキストが表示されるまで待機
agent-browser wait --url "**/dash"    # URLパターンを待機
agent-browser wait --load networkidle # ロード状態を待機
agent-browser wait --fn "window.ready === true"  # JS条件を待機
```

**ロード状態**: `load`, `domcontentloaded`, `networkidle`

### マウス制御

```bash
agent-browser mouse move <x> <y>      # マウスを移動
agent-browser mouse down [button]     # ボタンを押す（left/right/middle）
agent-browser mouse up [button]       # ボタンを離す
agent-browser mouse wheel <dy> [dx]   # スクロールホイール
```

### ブラウザ設定

```bash
agent-browser set viewport <w> <h>    # ビューポートサイズを設定
agent-browser set device <name>       # デバイスをエミュレート（"iPhone 14"）
agent-browser set geo <lat> <lng>     # 位置情報を設定
agent-browser set offline [on|off]    # オフラインモードを切り替え
agent-browser set headers <json>      # HTTPヘッダーを追加
agent-browser set credentials <u> <p> # HTTP基本認証
agent-browser set media [dark|light]  # カラースキームをエミュレート
```

### Cookie & ストレージ

```bash
agent-browser cookies                 # 全Cookieを取得
agent-browser cookies set <name> <val> # Cookieを設定
agent-browser cookies clear           # Cookieをクリア

agent-browser storage local           # 全localStorageを取得
agent-browser storage local <key>     # 特定キーを取得
agent-browser storage local set <k> <v>  # 値を設定
agent-browser storage local clear     # 全てクリア

agent-browser storage session         # sessionStorageも同様
```

### ネットワーク

```bash
agent-browser network route <url>              # リクエストをインターセプト
agent-browser network route <url> --abort      # リクエストをブロック
agent-browser network route <url> --body <json>  # レスポンスをモック
agent-browser network unroute [url]            # ルートを削除
agent-browser network requests                 # 追跡したリクエストを表示
agent-browser network requests --filter api    # リクエストをフィルタ
```

### タブ & ウィンドウ

```bash
agent-browser tab                     # タブ一覧
agent-browser tab new [url]           # 新しいタブ（URLを指定可能）
agent-browser tab <n>                 # タブnに切り替え
agent-browser tab close [n]           # タブを閉じる
agent-browser window new              # 新しいウィンドウ
```

### フレーム

```bash
agent-browser frame <sel>             # iframeに切り替え
agent-browser frame main              # メインフレームに戻る
```

### ダイアログ

```bash
agent-browser dialog accept [text]    # 承認（プロンプトテキストを指定可能）
agent-browser dialog dismiss          # 却下
```

### デバッグ

```bash
agent-browser trace start [path]      # トレース記録を開始
agent-browser trace stop [path]       # トレースを停止して保存
agent-browser console                 # コンソールメッセージを表示
agent-browser console --clear         # コンソールをクリア
agent-browser errors                  # ページエラーを表示
agent-browser errors --clear          # エラーをクリア
agent-browser highlight <sel>         # 要素をハイライト
agent-browser state save <path>       # 認証状態を保存
agent-browser state load <path>       # 認証状態を読み込み
```

### ナビゲーション

```bash
agent-browser back                    # 戻る
agent-browser forward                 # 進む
agent-browser reload                  # ページを再読み込み
```

---

## セッション管理

複数の分離されたブラウザインスタンスを実行できます：

```bash
# 異なるセッション
agent-browser --session agent1 open site-a.com
agent-browser --session agent2 open site-b.com

# または環境変数で
AGENT_BROWSER_SESSION=agent1 agent-browser click "#btn"

# アクティブなセッション一覧
agent-browser session list

# 現在のセッションを表示
agent-browser session
```

各セッションには独自の以下が含まれます：
- ブラウザインスタンス
- CookieとStorage
- ナビゲーション履歴
- 認証状態

---

## スナップショットオプション

`snapshot`コマンドは出力サイズを削減するフィルタリングをサポート：

```bash
agent-browser snapshot                    # フルアクセシビリティツリー
agent-browser snapshot -i                 # インタラクティブ要素のみ
agent-browser snapshot -c                 # コンパクト（空の構造要素を削除）
agent-browser snapshot -d 3               # 深さを3レベルに制限
agent-browser snapshot -s "#main"         # CSSセレクタでスコープ指定
agent-browser snapshot -i -c -d 5         # オプションを組み合わせ
```

| オプション | 説明 |
|-----------|------|
| `-i, --interactive` | インタラクティブ要素のみ表示（ボタン、リンク、入力） |
| `-c, --compact` | 空の構造要素を削除 |
| `-d, --depth <n>` | ツリーの深さを制限 |
| `-s, --selector <sel>` | CSSセレクタでスコープ指定 |

---

## セレクタ

### Refs（AIに推奨）

Refsはスナップショットからの確定的な要素選択を提供します：

```bash
# 1. ref付きスナップショットを取得
agent-browser snapshot
# 出力:
# - heading "Example Domain" [ref=e1] [level=1]
# - button "Submit" [ref=e2]
# - textbox "Email" [ref=e3]
# - link "Learn more" [ref=e4]

# 2. refsを使って操作
agent-browser click @e2                   # ボタンをクリック
agent-browser fill @e3 "test@example.com" # テキストボックスに入力
agent-browser get text @e1                # 見出しテキストを取得
agent-browser hover @e4                   # リンクにホバー
```

**Refsを使う理由：**
- **確定的**: refはスナップショットの正確な要素を指す
- **高速**: DOM再クエリが不要
- **AIフレンドリー**: スナップショット＋refワークフローはLLMに最適

### CSSセレクタ

```bash
agent-browser click "#id"
agent-browser click ".class"
agent-browser click "div > button"
```

### テキスト & XPath

```bash
agent-browser click "text=Submit"
agent-browser click "xpath=//button"
```

---

## エージェントモード

機械可読な出力には`--json`を使用：

```bash
agent-browser snapshot --json
# 戻り値: {"success":true,"data":{"snapshot":"...","refs":{"e1":{"role":"heading","name":"Title"},...}}}

agent-browser get text @e1 --json
agent-browser is visible @e2 --json
```

### 最適なAIワークフロー

```bash
# 1. ナビゲートしてスナップショットを取得
agent-browser open example.com
agent-browser snapshot -i --json   # AIがツリーとrefsを解析

# 2. AIがスナップショットからターゲットrefsを特定
# 3. refsを使ってアクションを実行
agent-browser click @e2
agent-browser fill @e3 "input text"

# 4. ページが変わったら新しいスナップショットを取得
agent-browser snapshot -i --json
```

---

## アーキテクチャ

agent-browserはクライアント-デーモンアーキテクチャを使用：

1. **Rust CLI**（高速なネイティブバイナリ）- コマンドを解析し、デーモンと通信
2. **Node.jsデーモン** - Playwrightブラウザインスタンスを管理
3. **フォールバック** - ネイティブバイナリが利用できない場合、Node.jsを直接使用

デーモンは最初のコマンドで自動的に起動し、コマンド間で永続化されるため、後続の操作が高速になります。

**ブラウザエンジン**: デフォルトでChromiumを使用。デーモンはPlaywrightプロトコルを介してFirefoxとWebKitもサポート。

---

## 対応プラットフォーム

| プラットフォーム | バイナリ | フォールバック |
|----------------|---------|--------------|
| macOS ARM64 | Native Rust | Node.js |
| macOS x64 | Native Rust | Node.js |
| Linux ARM64 | Native Rust | Node.js |
| Linux x64 | Native Rust | Node.js |
| Windows x64 | Native Rust | Node.js |

---

## AIエージェントでの使用

### エージェントに直接伝える

最もシンプルなアプローチ - エージェントに使用を伝えるだけ：

```
agent-browserを使ってログインフローをテストしてください。
利用可能なコマンドは agent-browser --help で確認できます。
```

`--help`の出力は包括的で、ほとんどのエージェントはそこから理解できます。

### AGENTS.md / CLAUDE.md

より一貫した結果のために、プロジェクトまたはグローバルの指示ファイルに追加：

```markdown
## ブラウザ自動化

Web自動化には`agent-browser`を使用。全コマンドは`agent-browser --help`で確認。

コアワークフロー:
1. `agent-browser open <url>` - ページに移動
2. `agent-browser snapshot -i` - インタラクティブ要素をref付きで取得（@e1, @e2）
3. `agent-browser click @e1` / `fill @e2 "text"` - refsを使って操作
4. ページ変更後は再スナップショット
```

### Claude Code Skill

Claude Codeの場合、[skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)がより豊富なコンテキストを提供：

```bash
cp -r node_modules/agent-browser/skills/agent-browser .claude/skills/
```

または直接ダウンロード：

```bash
mkdir -p .claude/skills/agent-browser
curl -o .claude/skills/agent-browser/SKILL.md \
  https://raw.githubusercontent.com/vercel-labs/agent-browser/main/skills/agent-browser/SKILL.md
```

---

## グローバルオプション

| オプション | 説明 |
|-----------|------|
| `--session <name>` | 分離されたセッションを使用（またはAGENT_BROWSER_SESSION環境変数） |
| `--json` | JSON出力（エージェント用） |
| `--full, -f` | フルページスクリーンショット |
| `--name, -n` | ロケーター名フィルタ |
| `--exact` | 完全一致 |
| `--headed` | ブラウザウィンドウを表示（ヘッドレスではない） |
| `--debug` | デバッグ出力 |

---

## リポジトリ情報

- **言語構成**: TypeScript 64.4%, Rust 31.7%, JavaScript 2.8%, Shell 1.1%
- **ライセンス**: Apache-2.0
- **スター数**: 980
- **フォーク数**: 40

---

## 重要な結論

1. **AIエージェントに最適化**: スナップショット機能とref参照システムにより、AIエージェントが確実にページ要素を操作できる
2. **高性能**: Rust CLIによる高速な起動と、デーモンアーキテクチャによる永続的なブラウザセッション
3. **クロスプラットフォーム**: 主要なOS全てで動作し、Node.jsフォールバックにより幅広い環境に対応
4. **豊富なコマンド**: Web自動化に必要なほぼ全ての操作をカバー
5. **セッション管理**: 複数の分離されたブラウザインスタンスを同時実行可能で、マルチエージェントシナリオに対応
