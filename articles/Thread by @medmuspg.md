---
title: "Thread by @medmuspg"
source: "https://x.com/medmuspg/status/2021198792524169650?s=12"
author:
  - "[[@medmuspg]]"
published: 2026-02-10
created: 2026-02-13
description: "音声入力アプリ「Typeless」のリバースエンジニアリングにより、On-device処理を謳いながら実際には全音声をAWSクラウドに送信し、さらにキーボード入力・画面テキスト・URL・クリップボード等を広範に収集する深刻なプライバシーリスクが発覚した技術的検証レポート。"
tags:
  - "clippings"
  - "privacy"
  - "security"
  - "reverse-engineering"
  - "macOS"
  - "voice-input"
---

## 要約

音声入力アプリ **Typeless** (macOS) をリバースエンジニアリングした結果、公式が謳う「On-device history」「Zero data retention」とは裏腹に、**深刻なプライバシーリスク**が複数確認されたという注意喚起スレッド。

---

### 結論

Typelessは「On-device」「Zero data retention」をマーケティングで強調しているが、実態は以下の通り：

- **全ての音声データはAWS（米国オハイオ、us-east-2）のサーバーに送信**されて処理されている
- ローカルの音声認識モデル（Whisper等）は**一切含まれていない**
- 音声以外にも**広範な個人データを収集**する技術基盤を保有

---

### 調査方法

macOS上で **Typeless v0.9.3** に対し、以下の4つの手法で調査を実施：

| 手法 | 対象 |
|------|------|
| バイナリ解析 | アプリ本体・ネイティブライブラリ |
| ネットワーク通信調査 | API通信先・プロトコル |
| ローカルDB解析 | SQLiteデータベース |
| 文字列解析 | ネイティブライブラリ内の関数名・文字列 |

---

### 確認された5つの事実

#### 1. 音声処理は100%クラウド

- アプリ内にWhisper等のSTTモデルは**存在しない**
- 音声はOpusで圧縮後、WebSocket（`wss://api.typeless.com/ws/rt_voice_flow`）経由でAWSにリアルタイム送信
- 送信先: `api.typeless.com` → `prod-typeless-lb-565501648.us-east-2.elb.amazonaws.com`
- 公式ポリシーにも「processed in real time on our cloud servers」と記載はあるが、マーケティングの「On-device」表現は**履歴保存に限定**されており、**ミスリーディング**

#### 2. 音声以外にも広範なデータを収集

ローカルSQLiteとネイティブライブラリの解析から、以下のデータ収集を確認：

| 収集データ | 詳細 |
|-----------|------|
| **WebサイトURL** | Gmail、Google Docs等の完全URLも記録 |
| **アプリ情報** | フォーカス中のアプリ名・ウィンドウタイトル |
| **画面上テキスト** | アクセシビリティAPIの`collectVisibleTexts`関数で再帰的に収集 |
| **クリップボード** | 読み書き両方（パスワードマネージャのTransientTypeも処理可能） |
| **キーボード入力** | `CGEventTap`によるシステムレベル監視 |
| **ブラウザDOM** | Safari, Chrome, Edge, Firefox, Brave対応 |
| **編集テキスト** | `TrackEditTextService` → `sendTrackResultToServer`でサーバー送信 |

#### 3. ローカルDBに個人情報が平文保存

- `typeless.db`に音声認識結果テキスト、閲覧URL、アプリ情報が**平文**で保存
- 「Zero data retention」を謳いながら、ローカルには**全て残存**
- 音声ファイル（`.ogg`）も**削除されず残存**

#### 4. 過剰な権限要求

音声入力ツールでありながら、以下の権限を要求：

- マイク
- **画面録画**
- **カメラ**
- **Bluetooth**
- **アクセシビリティ**
- スクリーンショット機能も内蔵

#### 5. 会社の透明性がほぼゼロ

| 項目 | 状況 |
|------|------|
| 法人名 | 利用規約・プライバシーポリシーに**記載なし** |
| 所在地 | 「サンフランシスコ郡、CA」（管轄地の記載のみ） |
| WHOIS | 非公開（GoDaddy + Cloudflare） |
| セキュリティ監査 | SOC2、ISO27001等の**記載なし** |
| 連絡先 | `hello@typeless.com` のみ |

---

### 技術的な根拠（再現可能なコマンド）

以下のコマンドで誰でも検証可能：

```bash
# ネットワーク通信先
nslookup api.typeless.com

# app.asar内のAPI URL
strings /Applications/Typeless.app/Contents/Resources/app.asar | grep "api.typeless.com"

# WebSocket通信プロトコル
strings /Applications/Typeless.app/Contents/Resources/app.asar | grep "rt_voice_flow"

# キーボード監視のネイティブライブラリ
strings /Applications/Typeless.app/Contents/Resources/lib/keyboard-helper/build/libKeyboardHelper.dylib | grep -i "key pressed"

# 画面テキスト収集
strings /Applications/Typeless.app/Contents/Resources/lib/context-helper/build/libContextHelper.dylib | grep -i "collectVisibleTexts"

# ローカルDBの中身
sqlite3 ~/Library/Application\ Support/Typeless/typeless.db ".schema history"
```

---

### 核心的なリスク

> **CGEventTap（キーボード監視）+ アクセシビリティAPI（画面テキスト収集）+ クリップボードアクセス**
> この3つの組み合わせは、技術的に**キーロガーと同等の能力**を持つ。

- コンテキスト取得自体は音声入力精度向上のために合理的な設計
- しかし**クラウドに送信する場合、運営の信頼性とセキュリティ体制が不可欠**
- **法人名すら公開していない会社**にその信頼を置けるかは各自で判断が必要

---

### 代替手段

完全ローカルで動作する音声入力ツール：

| ツール | 特徴 |
|--------|------|
| **Whisper.cpp / MLX Whisper** | OSS、完全ローカル、無料 |
| **macOS標準の音声入力** | Apple Silicon上でオンデバイス処理 |
| **Superwhisper** | Whisperベース、Mac向け（ただし要検証） |

---

### 結論・推奨事項

- Typelessの音声認識は**100%クラウド処理**（ローカルモデルなし）
- 音声以外にも**画面テキスト・URL・キーボード入力を収集可能な技術基盤**を保有
- 運営法人が**不透明**（法人名・所在地の公開なし）
- **セキュリティ監査の証拠なし**
- 利用中の方は**リスクを認識した上で判断**すること
- 最低限、**Little Snitch等でネットワーク通信を監視**することを推奨