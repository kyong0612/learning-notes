---
title: "Thread by @tonkotsuboy_com"
source: "https://x.com/tonkotsuboy_com/status/2031199612976115758?s=12"
author:
  - "[[鹿野 壮 (Takeshi Kano)]]"
published: 2026-03-10
created: 2026-03-12
description: "X(Twitter)のタイムラインを直接閲覧せずに、RSSHub・Gemini API・nano-banana CLI・Obsidianを組み合わせた自動情報収集パイプラインの構築事例"
tags:
  - "clippings"
  - "RSSHub"
  - "Gemini API"
  - "Obsidian"
  - "自動化"
  - "情報収集"
---

## 概要

フロントエンドエンジニアの鹿野 壮（[@tonkotsuboy_com](https://x.com/tonkotsuboy_com)）氏が、X(Twitter)を直接閲覧せずに特定アカウントの情報を効率的に追うための自動パイプラインを構築した事例を紹介するスレッド。

### 課題

- Xで特定アカウントの情報を追いたいが、タイムラインを開くとネガティブな投稿が目に入りメンタルが削られる
- ブックマーク機能では情報が流れてしまう

### 解決策：5段階の自動パイプライン

| ステップ | ツール | 役割 |
|---|---|---|
| 🐳 RSS変換 | **RSSHub**（Docker） | Xの特定アカウントのタイムラインをRSSフィードに変換 |
| 🌐 翻訳 | **Gemini API** | 英語ツイートを日本語に自動翻訳 |
| 📰 ハイライト作成 | cron + AI | 毎朝8:00に1日分の好みに合ったツイートハイライトを自動作成 |
| 🖼️ 画像生成 | **nano-banana CLI**（Gemini Flash） | ハイライト用のアイキャッチ画像を自動生成 |
| 📚 保存 | **Obsidian** | 生成されたハイライトをObsidianに自動保存 |

## 使用技術の詳細

### RSSHub

- オープンソースのRSSフィード生成エンジン（5,000以上のグローバルインスタンスが存在）
- Dockerでローカル実行が可能
- X(Twitter)のユーザータイムラインやリストをRSSフィードとして配信
- 環境変数にTwitterの認証トークンを設定して使用

```bash
docker run -d --name rsshub -p 1200:1200 \
  -e TWITTER_AUTH_TOKEN='トークン' \
  -e TWITTER_COOKIE='auth_token=...; ct0=...' \
  diygod/rsshub:latest
```

### nano-banana CLI

- Google Gemini APIを使用したコマンドライン画像生成ツール
- デフォルトモデル: Gemini 3.1 Flash Image（Nano Banana 2）
- テキストから画像生成、画像編集、複数バリエーション生成に対応
- TypeScript版、Go版、Python版の実装あり

### Gemini API

- 英語ツイートの日本語翻訳に使用
- ハイライト記事の選定・要約にも活用されている可能性が高い

## ポイント

- **メンタルヘルスの保護**: SNSの有害コンテンツへの不要な露出を排除
- **情報の永続化**: ブックマークと異なり、Obsidianに構造化して保存されるため流れない
- **完全自動化**: cronによる定時実行で、手動操作なしに毎朝ハイライトが生成される
- **AI活用の実践例**: Gemini APIを翻訳・要約・画像生成の3つの用途で活用

## 添付画像

スレッドには、パイプラインの実行結果と思われる4枚のスクリーンショットが添付されている。

![Image](https://pbs.twimg.com/media/HDAxrxEbcAAzb2Z?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HDAxrrCaMAEG_XE?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HDAxrrNbQAASjNK?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/HDAxryEbsAAW_GJ?format=jpg&name=large)

## 関連リソース

- [RSSHub ドキュメント](https://docs.rsshub.app/)
- [nano-banana CLI (GitHub)](https://github.com/gemini-cli-extensions/nanobanana)
- [鹿野壮 ポートフォリオ](https://kano.codes/)
- 類似事例: [Gemini CLI × Obsidian で構築するニュース収集環境 (Qiita)](https://qiita.com/hajime-f/items/ef2b4d6ad478445eb4d5)