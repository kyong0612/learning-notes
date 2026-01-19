---
title: "onikan27/claude-code-monitor: Real-time CLI dashboard for monitoring multiple Claude Code sessions. File-based state management with terminal focus switching support (iTerm2, Terminal.app, Ghostty). macOS only."
source: "https://github.com/onikan27/claude-code-monitor"
author:
  - "[[onikan27]]"
published: 2026-01-19
created: 2026-01-19
description: "複数のClaude Codeセッションをリアルタイムで監視できるCLIダッシュボードツール。ファイルベースの状態管理とターミナルフォーカス切り替え機能（iTerm2、Terminal.app、Ghostty対応）を搭載。macOS専用。"
tags:
  - "clippings"
  - "claude-code"
  - "cli-tool"
  - "macos"
  - "terminal"
  - "monitoring"
  - "typescript"
---

## 概要

**Claude Code Monitor CLI** は、複数のClaude Codeセッションをターミナルからリアルタイムで監視できるCLIツール。ファイルベースのセッション状態管理を採用しており、APIサーバーが不要（サーバーレス）。

![Claude Code Monitor Demo](https://raw.githubusercontent.com/onikan27/claude-code-monitor/main/docs/ccm-demo.gif)

---

## 主な特徴

| 特徴 | 説明 |
|------|------|
| 🔌 **サーバーレス** | ファイルベースのセッション状態管理（APIサーバー不要） |
| 🔄 **リアルタイム更新** | ファイル変更を検知して自動更新 |
| 🎯 **タブフォーカス** | 選択したセッションのターミナルタブに即座に切り替え |
| 🎨 **シンプルUI** | ステータスとディレクトリのみ表示 |
| ⚡ **簡単セットアップ** | `ccm` コマンド1つで自動セットアップと起動 |

---

## システム要件

- **macOS** のみ（フォーカス機能がAppleScriptに依存）
- **Node.js** >= 18.0.0
- **Claude Code** がインストールされていること

---

## インストール方法

### グローバルインストール（推奨）

```bash
npm install -g claude-code-monitor
```

### npxで実行（インストール不要）

```bash
npx claude-code-monitor
```

> **注意**: npxでは毎回 `npx claude-code-monitor` と入力が必要（`ccm` ショートカットはグローバルインストール時のみ利用可能）。フック設定が必要で継続使用を想定しているため、グローバルインストールを推奨。

---

## クイックスタート

```bash
ccm
```

初回実行時は自動的にフックをセットアップし、モニターを起動する。

---

## コマンド一覧

| コマンド | エイリアス | 説明 |
|----------|-----------|------|
| `ccm` | - | モニターTUIを起動（未設定なら自動セットアップ） |
| `ccm watch` | `ccm w` | モニターTUIを起動 |
| `ccm setup` | - | Claude Codeフックを設定 |
| `ccm list` | `ccm ls` | セッション一覧を表示 |
| `ccm clear` | - | 全セッションをクリア |
| `ccm --version` | `ccm -V` | バージョン表示 |
| `ccm --help` | `ccm -h` | ヘルプ表示 |

---

## キーバインド（watchモード）

| キー | アクション |
|------|-----------|
| ↑ / k | 上に移動 |
| ↓ / j | 下に移動 |
| Enter / f | 選択したセッションにフォーカス |
| 1-9 | 番号でクイック選択＆フォーカス |
| c | 全セッションをクリア |
| q / Esc | 終了 |

---

## ステータスアイコン

| アイコン | ステータス | 説明 |
|----------|-----------|------|
| ● | Running | Claude Codeが処理中 |
| ◐ | Waiting | ユーザー入力待ち（権限確認など） |
| ✓ | Done | セッション終了 |

---

## 対応ターミナル

| ターミナル | フォーカス対応 | 備考 |
|-----------|---------------|------|
| iTerm2 | ✅ フル対応 | TTYベースのウィンドウ/タブ指定 |
| Terminal.app | ✅ フル対応 | TTYベースのウィンドウ/タブ指定 |
| Ghostty | ⚠️ 限定対応 | アプリのアクティブ化のみ（特定ウィンドウ/タブの指定不可） |

> **注意**: Alacritty、kitty、Warpなど他のターミナルでも監視機能は使えるが、フォーカス機能は非対応。

---

## データストレージ

セッションデータは `~/.claude-monitor/sessions.json` に保存される。

### 保存される情報

| フィールド | 説明 |
|-----------|------|
| session_id | Claude Codeセッション識別子 |
| cwd | 作業ディレクトリパス |
| tty | ターミナルデバイスパス（例: /dev/ttys001） |
| status | セッションステータス（running/waiting_input/stopped） |
| updated_at | 最終更新タイムスタンプ |

- データは30分間の非アクティブ後、またはターミナルセッション終了時に自動削除される

---

## プログラムからの利用

ライブラリとしても利用可能：

```typescript
import { getSessions, getStatusDisplay } from 'claude-code-monitor';

const sessions = getSessions();
for (const session of sessions) {
  const { symbol, label } = getStatusDisplay(session.status);
  console.log(`${symbol} ${label}: ${session.cwd}`);
}
```

---

## トラブルシューティング

### セッションが表示されない場合

1. `ccm setup` を実行してフック設定を確認
2. `~/.claude/settings.json` にフック設定が含まれているか確認
3. Claude Codeを再起動

```bash
# 設定確認
cat ~/.claude/settings.json | grep ccm
```

### フォーカスが動作しない場合

1. macOSを使用しているか確認
2. iTerm2、Terminal.app、またはGhosttyを使用しているか確認
3. システム環境設定 > プライバシーとセキュリティ > アクセシビリティの権限を確認

### セッションデータのリセット

```bash
ccm clear
# または
rm ~/.claude-monitor/sessions.json
```

---

## セキュリティ

- `~/.claude/settings.json` を変更してフックを登録
- フォーカス機能はAppleScriptでターミナルアプリを制御
- 全データはローカル保存、ネットワーク通信なし

---

## 技術スタック

- **言語**: TypeScript 93.0%、JavaScript 7.0%
- **ライセンス**: MIT
- **リポジトリ統計**: 57スター、7フォーク、3コントリビューター

---

## 注意事項

これは非公式のコミュニティツールであり、Anthropicとの提携・推奨・関連はない。「Claude」および「Claude Code」はAnthropicの商標。
