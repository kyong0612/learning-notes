---
title: "Aqua Voice - Fast and Accurate Voice Dictation for Mac and Windows"
source: "https://aquavoice.com/"
author:
published:
created: 2026-01-08
description: "Aqua Voiceは、MacとWindows向けの高速・高精度な音声入力（ディクテーション）アプリケーション。独自開発のAI音声認識モデル「Avalon」を搭載し、リアルタイムで音声をクリアなテキストに変換する。AIプロンプトからエッセイ執筆まで、あらゆるアプリケーションで動作し、開発者向けの技術用語認識に特に優れている。Y Combinator W24採択企業。"
tags:
  - voice-to-text
  - dictation
  - speech-recognition
  - productivity
  - developer-tools
  - AI
  - Mac
  - Windows
---

## 概要

Aqua Voiceは、**音声をリアルタイムでテキストに変換する**ディクテーションアプリケーション。150年間続いてきたタイピングから、音声入力への移行を目指している。

> "We've typed for 150 years. It's time to speak."

## 主要な特徴

### パフォーマンス

| 指標           | Aqua Voice    | 従来のキーボード |
| -------------- | ------------- | ---------------- |
| 入力速度       | **230 WPM**   | 40 WPM           |
| 速度倍率       | **5倍高速**   | ベースライン     |
| 精度（AISpeak）| **97.3%**     | -                |

### Avalon AIモデル

Aqua Voiceの核となるのは、独自開発の音声認識モデル「**Avalon**」である。

#### ベンチマーク結果（AISpeak）

| モデル              | AISpeak-10 | AISpeak-50 | AISpeak-500 |
| ------------------- | ---------- | ---------- | ----------- |
| **Avalon**          | **97.4%**  | **97.5%**  | **95.8%**   |
| ElevenLabs Scribe   | 78.8%      | 86.7%      | 87.5%       |
| Whisper Large v3    | 65.1%      | 82.4%      | 84.9%       |
| Voxtral Mini 3B     | 59.5%      | 79.4%      | 82.9%       |
| NVIDIA Canary 1B    | 51.5%      | 71.8%      | 74.1%       |

#### 技術用語の認識精度

Avalonは実際の開発者ワークフロー（CLIセッション、IDEキャプチャ）でトレーニングされており、以下のような技術用語を正確に認識する：

- **正しく認識**: GPT-4o, GPT-4.1, o3, Claude 4, Claude Code, kubectl, PyTorch, zshrc
- **他モデルの誤認識例**:
  - Whisper: "GPT-4o" → "GPT-4.0" / "GPT-400"
  - Whisper: "o3" → "GPT-03"
  - Whisper: "Claude 4" → "Claude for"
  - Parakeet: "Claude 4" → "cloud floor"

### 主な機能

1. **リアルタイムストリーミング**
   - 話しながら即座にテキスト変換
   - 文法修正・フレーズの洗練を自動実行

2. **コンテキスト認識**
   - 画面上の内容を理解（コード構文、日常テキスト）
   - アプリケーションに応じた出力フォーマット調整

3. **カスタム辞書**
   - 固有名詞、ブランド名、技術用語を登録
   - Free: 5件、Pro: 800件まで登録可能

4. **カスタムインストラクション**
   - 文体・トーンのカスタマイズ
   - Slack用の小文字スタイル、ドキュメント用の構造化など

5. **49言語対応**
   - 多言語での高精度認識

6. **プライベート履歴**
   - トランスクリプト履歴へのアクセス
   - サーバーにデータを保存しない設計

## ユースケース

### 1. コーディング & プロンプティング

開発者向けに最適化されており、以下の場面で活用できる：

- AIエージェントへのプロンプト入力
- コードの説明・ドキュメント作成
- Claude Code、Cursor等のAIツールとの連携

**効果**: 週あたり **6時間23分** のコーディング時間節約

### 2. プロダクティビティ

- Slackメッセージの作成
- メール返信
- チーム間コミュニケーション

**効果**:

- 週あたり **4時間56分** のタイピング時間削減
- 平均返信時間 **47秒**

### 3. コンテンツ編集

- プロジェクトブリーフの作成
- 提案書・企画書
- クリエイティブライティング（小説など）

## 料金プラン

### Starter（無料）

- 1,000語/月
- Aqua Engine
- カスタム辞書: 5件

### Pro（$8/月、年払い）

- **無制限**のテキスト変換
- Aqua Engine + **Avalonモデル**
- カスタム辞書: 800件
- カスタムインストラクション

### Team（$12/月/ユーザー、年払い）

- Proの全機能
- 一元化されたチーム請求
- チーム全体の設定管理
- 組織全体でのプライバシーモード強制

### Avalon API

開発者向けAPIも提供：

- **料金**: $0.39/時間（秒単位で課金）
- **特徴**:
  - OpenAI互換エンドポイント
  - ストリーミング・バッチ処理対応
  - 話者ラベル・タイムスタンプ付き
  - 2行のコード変更でWhisperから移行可能

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalon-api-key",
    base_url="https://api.aqua.sh/v1"
)

audio_file = open("speech.mp3", "rb")
transcript = client.audio.transcriptions.create(
    model="avalon-1",
    file=audio_file
)
print(transcript.text)
```

## ユーザーガイドの機能一覧

- **File Tagging**: ファイルのタグ付け
- **Replacements**: 置換ルール設定
- **Languages**: 言語設定
- **History**: 履歴管理
- **Custom Instructions**: カスタム指示
- **Dictionary**: カスタム辞書

## ユーザーの声

- **@renkon40**: "There's no going back. The shock of Aqua Voice turning voice input into a 'weapon.' I can't use Mac's standard voice input anymore."

- **@gkossakowski**: "I find @aquavoice_'s voice dictation excellent for vibe coding. The effectiveness of vibing scales with how much context you can feed into the LLM. You can speak 3–4x more words per minute than you can type, and Aqua nails the low-friction experience voice needs to actually work."

- **@Stammy**: "It's like a faster Superwhisper or Wisprflow but it also has context of your screen/apps so it's even more accurate. perfect for vibe coding"

## 対応プラットフォーム

- **Mac** (Apple Silicon)
- **Windows**

## 関連リンク

- [User Guide](https://aquavoice.com/guide)
- [Avalon API Documentation](https://app.aquavoice.com/api-dashboard?tab=docs)
- [Blog](https://aquavoice.com/blog)
- [Changelog](https://aquavoice.com/changelog)
- [System Status](https://status.withaqua.com/)
- [Twitter/X](https://x.com/aquavoice_)
- [Discord](https://discord.com/invite/aqua-voice)

## 会社情報

- **Y Combinator** W24採択企業
- Contact: <support@withaqua.com>
