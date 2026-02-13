---
title: "Thread by @ck_novasphere"
source: "https://x.com/ck_novasphere/status/2020814404758225256"
author:
  - "[[@ck_novasphere]]"
  - "[[@kai_brokering]]"
  - "[[@medmuspg]]"
published: 2026-02-09
created: 2026-02-13
description: "音声入力アプリ「Typeless」のリバースエンジニアリングにより発覚した深刻なプライバシーリスクと、同業VoiceOS創業者Kai Brokeringによる業界視点の見解。オンデバイス処理 vs クラウド処理のトレードオフ、企業の透明性の重要性について議論されたスレッド。"
tags:
  - "clippings"
  - "privacy"
  - "security"
  - "voice-input"
  - "Typeless"
  - "VoiceOS"
  - "reverse-engineering"
  - "on-device-vs-cloud"
---

> [!note] リダイレクト
> 元の@ck_novasphereの投稿URLは、@kai_brokeringの投稿（https://x.com/kai_brokering/status/2021778854399050123）にリダイレクトされます。以下の要約は、リダイレクト先の@kai_brokeringの投稿および引用元の@medmuspgのスレッドに基づいています。

## 概要

音声入力アプリ「Typeless」に対し、@medmuspg（げれげれ）がmacOS上でリバースエンジニアリングを実施し、「On-device history」「Zero data retention」を謳いながら実際には全音声データをAWSクラウドに送信していること、さらにキーボード入力・画面テキスト・URL等を広範に収集可能な技術基盤を持つことを暴露した。この注意喚起に対し、同業の音声入力ツール「VoiceOS」の創業者Kai Brokering（@kai_brokering）が、業界の視点からオンデバイス処理とクラウド処理のトレードオフ、VoiceOSのセキュリティ対策、透明性の重要性について見解を共有した。

## 主要なトピック

### @medmuspgによるTypelessの技術分析

#### 確認された事実

1. **音声処理は100%クラウド**
   - アプリ内にWhisper等のSTTモデルは存在しない
   - 音声はOpusで圧縮後、WebSocket（`wss://api.typeless.com/ws/rt_voice_flow`）経由でAWS us-east-2（米国オハイオ）のサーバーにリアルタイム送信
   - `api.typeless.com` → `565501648.us-east-2.elb.amazonaws.com`
   - 公式ポリシーにも「processed in real time on our cloud servers」と記載されているが、マーケティングの「On-device」表現は履歴保存に限定されておりミスリーディング

2. **音声以外にも広範なデータを収集**
   - 閲覧中のWebサイトの完全URL（Gmail、Google Docs等も記録）
   - フォーカス中のアプリ名、ウィンドウタイトル
   - 画面上のテキスト（アクセシビリティAPIで再帰的に収集する`collectVisibleTexts`関数）
   - クリップボードの読み書き（パスワードマネージャのTransientTypeも処理可能）
   - CGEventTapによるシステムレベルのキーボード入力監視
   - ブラウザのDOM要素情報（Safari, Chrome, Edge, Firefox, Brave対応）
   - テキスト編集内容（TrackEditTextService → sendTrackResultToServer）

3. **ローカルDBに個人情報が平文保存**
   - `typeless.db`に音声認識結果テキスト、閲覧URL、アプリ情報が平文で保存
   - 「Zero data retention」を謳いながらローカルには全データが残存
   - 音声ファイル（.ogg）も削除されずに残存

4. **過剰な権限要求**
   - マイクに加え、画面録画、カメラ、Bluetooth、アクセシビリティの権限を要求
   - スクリーンショット機能も内蔵

5. **会社の透明性がほぼゼロ**
   - 利用規約・プライバシーポリシーに法人名の記載なし
   - 所在地は「サンフランシスコ郡、CA」（利用規約の管轄地のみ）
   - WHOISは非公開（GoDaddy + Cloudflare）
   - SOC2、ISO27001等のセキュリティ監査の記載なし
   - 連絡先は hello@typeless.com のみ

#### 技術的な根拠（再現可能なコマンド）

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

#### 核心的な問題

**CGEventTap（キーボード監視）+ アクセシビリティAPI（画面テキスト収集）+ クリップボードアクセス**の3つの組み合わせは、技術的にキーロガーと同等の能力を持つ。これを運営法人が不明なサービスに許可していることが最大のリスク。

### @kai_brokering（VoiceOS創業者）の見解

#### オンデバイス処理 vs クラウド処理のトレードオフ

- **完全ローカルモデル**：最大限のプライバシーを提供するが、精度と機能を犠牲にする
- **クラウドホスト型モデル**：はるかに高性能だが、データがデバイスを離れる必要がある
- Appleのような**プライバシー重視企業**でさえ、Apple Intelligenceにはサーバーを使用している
- 現時点のオンデバイスモデルは、品質を犠牲にせずに最高の体験を提供するほど強力ではない

#### VoiceOSのアプローチ

- Appleと同様の原則に従い、**一部はローカル処理、大部分はプライベートクラウド**で処理
- **エンタープライズグレードのインフラ**とSOC 2レベルのセキュリティ
- **Private Mode**：音声・文字起こし・使用データをサーバーに保存しないオプション（一部の高度な機能は制限される）
- Trust Center: [trust.voiceos.com](https://trust.voiceos.com)

#### コンテキスト利用の正当性

- 多くの音声ツールはアクティブなアプリやテキストフィールドなどのコンテキスト情報を活用
- ビジネスメールと友人へのメッセージでは書式や文字起こしの品質要件が異なり、コンテキストが品質向上に寄与

### 日本のユーザーからのフィードバック

- **セキュアなクラウドサービスへの接続自体**には大きな懸念はない
- Typelessの問題は**会社名などの基本情報が不透明**なこと
- **企業の透明性**がユーザーの信頼獲得に不可欠

## 重要な事実・データ

- **@medmuspgの投稿**: 100万Views、3,891 Likes、1,900 Reposts、2,370 Bookmarks（2026年2月10日）
- **@kai_brokeringの投稿**: 77,900 Views、262 Likes、73 Reposts、126 Bookmarks（2026年2月12日最終編集）
- **分析対象**: Typeless v0.9.3（macOS版）
- **通信先**: AWS us-east-2（米国オハイオリージョン）
- **VoiceOS**: Y Combinator支援、100以上の言語対応、Pro $12/月

## 結論・示唆

### 著者らの結論

1. **品質とプライバシーのトレードオフは不可避**: 現在の技術では完全ローカル処理と最高品質のAI処理を両立することは困難
2. **透明性が最大の差別化要因**: クラウド処理自体より企業の透明性（法人情報、データ取扱い方針の明示）がユーザーの信頼獲得に不可欠
3. **Typelessの問題の本質**: クラウド処理を行うこと自体ではなく、マーケティングと実態の乖離、法人情報の不透明性、キーロガー同等の技術基盤を未知の運営者に委ねているリスク

### 代替手段

- **Whisper.cpp / MLX Whisper**: OSS、完全ローカル、無料
- **macOS標準の音声入力**: Apple Silicon上でオンデバイス処理
- **Superwhisper**: Whisperベース、Mac向け（要検証）
- **VoiceOS**: ハイブリッドアーキテクチャ、SOC 2レベルセキュリティ、Private Mode対応

## 制限事項・注意点

- @ck_novasphereの元投稿はリダイレクトされるため、元投稿に追加のコメントや文脈があった可能性がある
- @medmuspgの分析はTypeless v0.9.3（macOS版）に基づいており、他のバージョンやプラットフォームでは異なる可能性がある
- @kai_brokeringはVoiceOSの創業者であり、競合製品の立場から見解を述べている点に留意が必要

---

*Source: [Thread by @ck_novasphere](https://x.com/ck_novasphere/status/2020814404758225256) → Redirects to [@kai_brokering](https://x.com/kai_brokering/status/2021778854399050123) quoting [@medmuspg](https://x.com/medmuspg/status/2021198792524169650)*
