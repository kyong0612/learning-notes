---
title: "AI エージェントのために CLI でブラウザを操作する agent-browser"
source: "https://azukiazusa.dev/blog/agent-browser-for-ai-agents/"
author:
  - "azukiazusa"
published: 2026-01-12
created: 2026-01-13
description: "agent-browser は Vercel が開発した CLI でブラウザを操作するツールであり、AI エージェントにブラウザ操作能力を提供するために設計されています。Playwright MCP と比較してコンテキスト消費を抑えつつブラウザ操作が可能になるツールです。"
tags:
  - "AI"
  - "Playwright"
  - "agent-browser"
  - "CLI"
  - "ブラウザ自動化"
---

## 概要

agent-browser は Vercel が開発した **CLI ベースのブラウザ操作ツール**であり、AI エージェントにブラウザ操作能力を提供するために設計されている。従来の MCP ベースのブラウザ操作ツール（Playwright MCP、ChromeDevTools MCP）と比較して、コンテキストウィンドウの消費を抑えることが可能。

## 背景と課題

AI エージェントにブラウザ操作をさせるための既存ツールには以下の課題がある：

| ツール | 課題 |
|--------|------|
| Playwright MCP | ツール定義がコンテキストを多く消費 |
| ChromeDevTools MCP | 中間操作のコンテキストがすべて AI のコンテキストウィンドウに含まれる |

agent-browser は CLI コマンドを通じてブラウザを操作することで、これらの課題を軽減する。

## インストール方法

### 1. npm でインストール

```bash
npm install -g agent-browser
```

### 2. chromium ブラウザのインストール

agent-browser は内部で Playwright を使用するため、chromium ブラウザが必要。

```bash
agent-browser install
```

## 基本的な使い方

### ナビゲーション

| コマンド | 説明 |
|----------|------|
| `agent-browser open <url>` | 指定した URL を開く |
| `agent-browser back` | 戻る |
| `agent-browser forward` | 進む |
| `agent-browser reload` | リロード |
| `agent-browser close` | ブラウザを閉じる |

### スナップショット（ページ解析）

`snapshot` コマンドはアクセシビリティツリーを取得する。スクリーンショットより効率的にブラウザの状態を把握できる。

```bash
agent-browser snapshot        # フルアクセシビリティツリー
agent-browser snapshot -i     # インタラクティブ要素のみ（推奨）
agent-browser snapshot -c     # コンパクト出力
agent-browser snapshot -d 3   # 深さを3に制限
```

出力例：
```
- document:
  - banner:
    - link "azukiazusa.dev" [ref=e1]:
      - /url: /
    - navigation:
      - list:
        - listitem:
          - link "blog" [ref=e2]
```

### インタラクション（@ref を使用）

```bash
agent-browser click @e1           # クリック
agent-browser dblclick @e1        # ダブルクリック
agent-browser fill @e2 "text"     # クリアしてテキスト入力
agent-browser type @e2 "text"     # クリアせずにテキスト入力
agent-browser press Enter         # キー押下
agent-browser press Control+a     # キーの組み合わせ
agent-browser hover @e1           # ホバー
agent-browser check @e1           # チェックボックスをチェック
agent-browser select @e1 "value"  # ドロップダウン選択
agent-browser scroll down 500     # スクロール
```

### 情報取得

```bash
agent-browser get text @e1        # 要素のテキスト取得
agent-browser get value @e1       # 入力値の取得
agent-browser get title           # ページタイトル取得
agent-browser get url             # 現在の URL 取得
```

### スクリーンショット

```bash
agent-browser screenshot          # 標準出力へ
agent-browser screenshot path.png # ファイル保存
agent-browser screenshot --full   # フルページ
```

### 待機

```bash
agent-browser wait @e1                     # 要素を待つ
agent-browser wait 2000                    # ミリ秒待機
agent-browser wait --text "Success"        # テキストを待つ
agent-browser wait --load networkidle      # ネットワークアイドルを待つ
```

### セマンティックロケーター（ref の代替）

```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
```

## AI エージェントからの利用

### 方法1: ドキュメントファイルで使用方法を教える

`AGENT.md` や `CLAUDE.md` にコマンド一覧と使用例を記載することで、AI エージェントが適切にコマンドを選択できるようになる。

### 方法2: エージェントスキル（Claude Code）

Claude Code の**エージェントスキル**機能を使用すると、コンテキストウィンドウを節約できる。

- `AGENT.md`/`CLAUDE.md`: 常にシステムプロンプトに含まれる
- エージェントスキル: 必要に応じて呼び出される → コンテキスト節約

#### スキルのセットアップ

```bash
mkdir -p .claude/skills/agent-browser
curl -o .claude/skills/agent-browser/SKILL.md \
  https://raw.githubusercontent.com/vercel-labs/agent-browser/main/skills/agent-browser/SKILL.md
```

#### 使用方法

```
/agent-browser タスク/カラムの削除機能を実装してください

- カンバンボードのカラムに削除ボタンを追加
- 削除ボタンをクリックすると確認ダイアログを表示
- 確認ダイアログで「はい」を選択するとカラムを削除
- 削除後、カンバンボードを更新して反映
```

## agent-browser vs Playwright MCP の比較

| 観点 | agent-browser | Playwright MCP |
|------|---------------|----------------|
| アクション後の応答 | `Done` のみ | 新しいページ状態を返却 |
| コンテキスト消費 | 少ない | 多い |
| 要素クリックの安定性 | やや不安定（`click @e8` 形式） | 比較的安定（セレクタ直接指定） |
| 状態把握 | 手動で `snapshot` 呼び出しが必要 | 自動的に返却される |

> **注意**: agent-browser の精度は `SKILL.md` の改善により向上する可能性がある。

## 実用例

### フォーム送信

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# Output: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # 結果確認
```

### 認証状態の保存と再利用

```bash
# ログイン後に状態を保存
agent-browser state save auth.json

# 後のセッションで状態をロード
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

### 並列セッション

```bash
agent-browser --session test1 open site-a.com
agent-browser --session test2 open site-b.com
agent-browser session list
```

## まとめ

1. **agent-browser** は CLI でブラウザを操作するツールで、AI エージェント向けに設計されている
2. **Playwright MCP** と比較して**コンテキスト消費を抑制**できる
3. AI エージェントに使用させるには**ドキュメントやエージェントスキル**を用意する
4. 要素クリックの安定性は Playwright MCP より劣る場合があるが、スキル改善で向上の余地あり

## 参考リンク

- [vercel-labs/agent-browser: Browser automation CLI for AI agents](https://github.com/vercel-labs/agent-browser)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [ChromeDevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
