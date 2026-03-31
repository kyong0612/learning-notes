---
title: "Let Claude use your computer from the CLI"
source: "https://code.claude.com/docs/en/computer-use"
author:
  - "[[Anthropic]]"
  - "[[Claude Code Docs]]"
published: 2026-03-28
created: 2026-03-31
description: "Claude Code CLIでcomputer useを有効にし、macOS上でアプリの起動・クリック・入力・スクリーンショットをターミナルから直接操作する方法。ネイティブアプリのテスト、ビジュアルバグのデバッグ、GUI専用ツールの自動化をカバーする公式ドキュメント。"
tags:
  - "clippings"
  - "claude-code"
  - "computer-use"
  - "macos"
  - "gui-automation"
  - "cli"
  - "ai-agent"
---

## 概要

Claude Code CLI の **Computer Use** 機能は、macOS上でClaudeがアプリを起動し、クリック・タイピング・スクロール・スクリーンショットなど、GUIを直接操作できるようにする**リサーチプレビュー**機能である。コードの記述からビルド・起動・UIの検証まで、1つの会話の中で完結できる。

> **要件**: macOS / Pro または Max プラン / Claude Code v2.1.85以降 / インタラクティブセッション（`-p` フラグは不可）。Team・Enterpriseプランでは利用不可。

---

## Computer Useでできること

| ユースケース | 具体例 |
|---|---|
| **ネイティブアプリのビルド＆検証** | Swiftでmenu barアプリを書き、コンパイル→起動→全コントロールをクリックして動作確認 |
| **E2E UIテスト** | ローカルのElectronアプリでオンボーディングフローを操作し、各ステップをスクリーンショット。Playwright設定不要 |
| **ビジュアル/レイアウトバグのデバッグ** | ウィンドウリサイズでバグを再現→スクリーンショット→CSSを修正→修正確認まで一貫して実行 |
| **GUI専用ツールの操作** | デザインツール、ハードウェア制御パネル、iOSシミュレータ、CLI/APIのないプロプライエタリアプリ |

---

## ツール選択の優先順位

Claudeはタスクに応じて最も精密なツールを優先する。Computer Useは最も広範だが最も遅いため、最後の手段として使われる：

1. **MCPサーバー** — 対象サービスにMCPがあればそれを使用
2. **Bash** — シェルコマンドで完結する場合
3. **Claude in Chrome** — ブラウザ作業で設定済みの場合
4. **Computer Use** — 上記いずれも使えない場合（ネイティブアプリ、シミュレータ等）

---

## セットアップ手順

### 1. MCP サーバーの有効化

```
/mcp
```

インタラクティブセッションで上記コマンドを実行し、`computer-use` サーバーを選択して **Enable** にする。プロジェクトごとに1回設定すれば永続化される。

### 2. macOS 権限の付与

初回使用時に2つの権限を要求される：

- **Accessibility**: クリック、タイピング、スクロールの許可
- **Screen Recording**: 画面の内容を確認する許可

System Settingsから付与後、Screen Recordingの場合はClaude Codeの再起動が必要な場合がある。

### 3. アプリごとのセッション承認

`computer-use` を有効化しても全アプリに自動でアクセスできるわけではない。セッション中に初めて特定のアプリを操作する際、以下が表示される：

- 操作対象のアプリ名
- 追加の権限リクエスト（クリップボードアクセス等）
- 作業中に非表示にされるアプリ数

承認は**セッション単位**で有効。

#### 高リスクアプリの警告

| 警告 | 対象アプリ |
|---|---|
| **シェルアクセスと同等** | Terminal, iTerm, VS Code, Warp 等のターミナル/IDE |
| **任意のファイルの読み書き可能** | Finder |
| **システム設定の変更可能** | System Settings |

アプリカテゴリごとの制御レベル：
- **ブラウザ・取引プラットフォーム**: 閲覧のみ（view-only）
- **ターミナル・IDE**: クリックのみ（click-only）
- **その他**: フルコントロール

---

## 動作の仕組み

### マシンワイドロック

Computer Useはマシン全体のロックを取得する。別のClaude Codeセッションが既にロックを保持している場合、新しいセッションは失敗する。

### アプリの非表示

作業中、承認されたアプリ以外は非表示になる。ターミナルウィンドウは表示されたまま残り、スクリーンショットからは除外される（Claudeが自身の出力を見ることはない）。作業完了後、非表示アプリは自動的に復元される。

### 即座に停止

- **`Esc` キー**: どこからでも即座にアクション中断
- **`Ctrl+C`**: ターミナルから中断

いずれの場合もロック解放→アプリ復元→制御返却が行われる。

---

## セーフティとトラストバウンダリ

サンドボックス化されたBashツールとは異なり、Computer Useは**実際のデスクトップ**で動作する。ビルトインの安全機構：

| 安全機構 | 説明 |
|---|---|
| **アプリ単位の承認** | セッション中に承認したアプリのみ操作可能 |
| **Sentinel警告** | シェル・ファイルシステム・システム設定へのアクセス権を持つアプリは事前に警告 |
| **ターミナル非表示** | スクリーンショットからターミナルを除外し、プロンプトインジェクションを防止 |
| **グローバルEscキー** | どこからでも即座に中断可能。キー入力は消費されるため、プロンプトインジェクションによるダイアログ操作を防止 |
| **ロックファイル** | 1セッションのみが同時にマシンを制御可能 |

---

## ワークフロー例

### ネイティブビルドの検証

```
Build the MenuBarStats target, launch it, open the preferences window,
and verify the interval slider updates the label. Screenshot the
preferences window when you're done.
```

→ Claudeが `xcodebuild` 実行→アプリ起動→UI操作→結果報告

### レイアウトバグの再現

```
The settings modal clips its footer on narrow windows. Resize the app
window down until you can reproduce it, screenshot the clipped state,
then check the CSS for the modal container.
```

→ ウィンドウリサイズ→不具合キャプチャ→スタイルシート確認

### iOSシミュレータのテスト

```
Open the iOS Simulator, launch the app, tap through the onboarding
screens, and tell me if any screen takes more than a second to load.
```

→ シミュレータをマウス操作と同様に制御

---

## CLI と Desktop の違い

| 機能 | Desktop | CLI |
|---|---|---|
| 有効化 | Settings > Desktop app > General のトグル | `/mcp` で `computer-use` を有効化 |
| 拒否アプリリスト | Settingsで設定可能 | 未実装 |
| 自動復元トグル | オプション | 常にオン |
| Dispatch連携 | Dispatch生成セッションでcomputer use可能 | 対象外 |

---

## トラブルシューティング

| 問題 | 対処法 |
|---|---|
| **"Computer use is in use by another session"** | 別セッションのタスクを完了するか終了する。クラッシュした場合はプロセス終了でロック自動解放 |
| **macOS権限プロンプトが繰り返し表示** | Claude Codeを完全に終了して再起動。System Settings > Privacy & Security > Screen Recording でターミナルが有効か確認 |
| **`/mcp` に `computer-use` が表示されない** | macOSであること / v2.1.85以降 / Pro/Maxプラン / claude.ai認証 / インタラクティブセッション — すべて確認 |

> **注意**: サードパーティプロバイダー（Amazon Bedrock, Google Cloud Vertex AI, Microsoft Foundry）経由のアクセスでは利用不可。別途claude.aiアカウントが必要。

---

## 関連リンク

- [Computer use in Desktop](https://code.claude.com/en/desktop#let-claude-use-your-computer) — GUIの設定画面版
- [Claude in Chrome](https://code.claude.com/en/chrome) — ブラウザ自動化
- [MCP](https://code.claude.com/en/mcp) — 構造化ツール/API連携
- [Sandboxing](https://code.claude.com/en/sandboxing) — Bashツールのサンドボックス
- [Computer use safety guide](https://support.claude.com/en/articles/14128542) — 安全なcomputer useのベストプラクティス