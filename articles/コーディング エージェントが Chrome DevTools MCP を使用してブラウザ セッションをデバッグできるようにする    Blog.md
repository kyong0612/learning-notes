---
title: "コーディング エージェントが Chrome DevTools MCP を使用してブラウザ セッションをデバッグできるようにする  |  Blog"
source: "https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session?hl=ja"
author:
  - "[[Sebastian Benz]]"
  - "[[Alex Rudenko]]"
published: 2025-12-11
created: 2026-03-16
description: "Chrome DevTools MCP サーバーに autoConnect 機能が追加され、コーディングエージェントがアクティブなブラウザセッションに直接接続してデバッグできるようになった。手動デバッグとAI支援デバッグのシームレスな切り替えや、サインイン済みセッションの再利用が可能になる。"
tags:
  - "clippings"
  - "Chrome DevTools"
  - "MCP"
  - "AI coding agent"
  - "remote debugging"
---

## 概要

Chrome DevTools MCP サーバーに、多くのユーザーから要望されていた機能が追加された。コーディングエージェントが**アクティブなブラウザセッションに直接接続**できるようになる `--autoConnect` オプションである。

この機能強化により、以下の2つが可能になる：

1. **アクティブなデバッグセッションへのアクセス**: DevTools UI のアクティブなデバッグセッションにコーディングエージェントがアクセスできる。例えば、Network パネルで失敗したネットワークリクエストを発見した場合、そのリクエストを選択してコーディングエージェントに調査を依頼できる。Elements パネルで選択した要素についても同様に機能する。手動デバッグとAI支援デバッグのシームレスな移行が可能になる。
2. **既存ブラウザセッションの再利用**: サインインが必要なページの問題修正をエージェントに依頼する場合、現在のブラウジングセッションに直接アクセスできるため、追加のサインインが不要になる。

## 接続方式

auto connection 機能は既存の接続方式に加えて追加されたものであり、従来の方式も引き続き利用可能：

- 一時プロファイルで複数の Chrome インスタンスを分離して実行
- リモートデバッグポートを持つ実行中の Chrome インスタンスに接続
- Chrome DevTools MCP サーバー専用のユーザープロファイルで Chrome を実行（現在のデフォルト）

## 仕組み

Chrome M144（現在 Beta）に追加された新機能で、Chrome DevTools MCP サーバーがリモートデバッグ接続をリクエストできるようになった。この新しいフローは[既存の Chrome リモートデバッグ機能](https://developer.chrome.com/docs/devtools/remote-debugging/local-server)の上に構築されている。

### セキュリティ対策

- デフォルトではリモートデバッグ接続は**無効**になっている
- 開発者が `chrome://inspect#remote-debugging` で明示的に有効化する必要がある
- MCP サーバーがリモートデバッグセッションをリクエストするたびに、Chrome が**ダイアログを表示しユーザーの許可を求める**
- デバッグセッションがアクティブな間は「Chrome is being controlled by automated test software」バナーが上部に表示される

## セットアップ手順

### Step 1: Chrome でリモートデバッグを有効化

Chrome（>=144）で以下を実行：

1. `chrome://inspect/#remote-debugging` に移動してリモートデバッグを有効化する
2. ダイアログ UI に従い、受信デバッグ接続の許可/不許可を設定する

### Step 2: Chrome DevTools MCP サーバーの設定

`--autoConnect` コマンドライン引数を使用して MCP サーバーを設定する。

gemini-cli 向けの設定例：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--autoConnect",
        "--channel=beta"
      ]
    }
  }
}
```

> **注意**: Chrome M144 が stable チャネルに到達するまでは `--channel=beta` の指定が必要。

### Step 3: セットアップのテスト

gemini-cli を開いて以下のプロンプトを実行：

```
Check the performance of https://developers.chrome.com
```

Chrome DevTools MCP サーバーが実行中の Chrome インスタンスへの接続を試み、ユーザー許可のダイアログが表示される。「Allow」をクリックすると、MCP サーバーが developers.chrome.com を開きパフォーマンストレースを取得する。

> **注意**: `autoConnect` オプションはユーザーが Chrome を起動している必要がある。

## デバッグセッションの引き渡し

ライブ Chrome インスタンスへの接続が可能になったことで、自動化と手動操作のどちらかを選ぶ必要がなくなった：

- **Elements パネル**: 問題のある要素を選択し、コーディングエージェントに調査・修正を依頼
- **Network パネル**: ネットワークリクエストを選択し、コーディングエージェントに調査を依頼

## 今後の展望

現時点ではまだ最初のステップであり、今後 Chrome DevTools MCP Server を通じてより多くのパネルデータをコーディングエージェントに段階的に公開していく予定。

## 参考リンク

- [GitHub リポジトリ（README）](https://github.com/ChromeDevTools/chrome-devtools-mcp/?tab=readme-ov-file#chrome-devtools-mcp)
- [Chrome リモートデバッグドキュメント](https://developer.chrome.com/docs/devtools/remote-debugging/local-server)
