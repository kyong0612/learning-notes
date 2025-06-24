---
title: "Claude Code IDE extensions allow websocket connections from arbitrary origins"
source: "https://github.com/anthropics/claude-code/security/advisories/GHSA-9f65-56v6-gxw7"
author:
  - "[[petery-ant]]"
published: 2025-06-23
created: 2025-06-24
description: |
  A vulnerability in Claude Code extensions for VSCode (and its forks) and JetBrains IDEs allows unauthorized websocket connections from malicious webpages. This can lead to arbitrary file reads and, in some cases, limited code execution.
tags:
  - "security"
  - "vulnerability"
  - "websocket"
  - "claude-code"
  - "vscode"
  - "jetbrains"
---

このドキュメントは、GitHub Security Advisory [GHSA-9f65-56v6-gxw7](https://github.com/anthropics/claude-code/security/advisories/GHSA-9f65-56v6-gxw7) の内容を要約したものです。

## 脆弱性の概要

Claude Code の VSCode（およびそのフォークであるCursor、Windsurf、VSCodium）とJetBrains IDE（IntelliJ、PyCharm、Android Studioなど）の拡張機能には、脆弱性が存在します。この脆弱性により、ユーザーが悪意のあるWebページにアクセスすると、攻撃者からの不正なWebSocket接続が許可されてしまいます。

この問題は2025年6月13日にリリースされたパッチで修正されています。

## 影響を受ける製品とバージョン

| パッケージ/製品                | エコシステム | 影響を受けるバージョン      | 修正済みバージョン      |
| -------------------------- | ---------- | ----------------------- | ------------------- |
| `@anthropic-ai/claude-code`  | npm        | `> 0.2.116 < 1.0.24`    | `1.0.24` and above  |
| `Claude Code [Beta]`       | Jetbrains  | `> 0.1.1 < 0.1.9`       | `0.1.9` and above   |
| `Claude Code for VSCode`   | VSCode     | `> 0.2.116 < 1.0.24`    | `1.0.24` and above  |

## 脆弱性の詳細

この脆弱性を悪用されると、攻撃者は以下のような操作を行える可能性があります。

- **VSCode (およびそのフォーク)**:
  - 任意のファイルの読み取り
  - IDEで開かれているファイルの一覧の表示
  - IDEからの選択範囲や診断イベントの取得
  - ユーザーがJupyter Notebookを開いており、かつ悪意のあるプロンプトを受け入れた場合に限定的なコード実行

- **JetBrains IDE**:
  - 選択範囲イベントの取得
  - 開かれているファイルの一覧の表示
  - 構文エラーの一覧の表示

## 修正方法

Claude Codeは起動時に拡張機能を自動更新しますが、念のため以下の手順でバージョンを確認し、必要に応じて手動で更新してください。

### VSCode, Cursor, VSCodium など

1. **拡張機能**ビューを開きます (`View -> Extensions`)。
2. インストール済みの拡張機能から `Claude Code for VSCode` を探します。
3. バージョンが `1.0.24` 未満の場合は、「Update」ボタンをクリックします。
4. IDEを再起動します。

### JetBrains IDE (IntelliJ, PyCharm など)

1. **Plugins** リストを開きます。
2. インストール済みのプラグインから `Claude Code [Beta]` を探します。
3. バージョンが `0.1.9` 未満の場合は、プラグインを更新またはアンインストールします。
4. IDEを再起動します。

## 深刻度

この脆弱性の深刻度は **High (高)** と評価されています。

- **CVSS v4.0 Score**: `CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:P/VC:H/VI:H/VA:N/SC:H/SI:H/SA:N`
- **全体スコア**: 8.8 / 10
