---
title: "mediar-ai/screenpipe: AI app store powered by 24/7 desktop history.  open source | 100% local | dev friendly | 24/7 screen, mic recording"
source: "https://github.com/mediar-ai/screenpipe"
author:
  - "[[opsysdebug]]"
  - "louis030195"
published:
created: 2025-08-20
description: "AI app store powered by 24/7 desktop history.  open source | 100% local | dev friendly | 24/7 screen, mic recording - mediar-ai/screenpipe"
tags:
  - "clippings"
  - "ai"
  - "machine-learning"
  - "computer-vision"
  - "agents"
  - "llm"
  - "multimodal"
---

## screenpipe: 24/7デスクトップ履歴を活用したAIアプリストア

**screenpipe**は、オープンソースで開発されているAIアプリケーションストアであり、ユーザーのデスクトップアクティビティを24時間365日ローカルに記録・分析し、AIのコンテキストとして活用することを目的としています。

### 主な特徴

- **オープンソース**: 誰でも自由に利用、改変、貢献が可能です。
- **100%ローカル**: すべてのデータはユーザーのデバイス上で処理され、プライバシーが保護されます。
- **開発者フレンドリー**: 開発者は、ユーザーの完全なコンテキストを利用して、デスクトップネイティブのAIアプリを容易に構築、公開、収益化できます。
- **常時記録**: スクリーンとマイクの情報を継続的に記録し、豊富なコンテキストをAIに提供します。

### 仕組み

1. **データ記録**: デスクトップ上のすべてのアクティビティを24時間365日、低負荷（CPU約10%、RAM 4GB）でローカルに記録します。
2. **API化**: 記録されたデータをインデックス化し、APIを通じてアクセス可能にします。
3. **AIアプリ開発**: 開発者はこのAPIを利用して、Next.jsなどのフレームワークを使い、ユーザーのコンテキストに基づいた強力なAIアプリケーションを開発できます。

![Diagram](https://private-user-images.githubusercontent.com/25003283/390886980-da5b8583-550f-4a1f-b211-058e7869bc91.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTU2OTQ4OTQsIm5iZiI6MTc1NTY5NDU5NCwicGF0aCI6Ii8yNTAwMzI4My8zOTA4ODY5ODAtZGE1Yjg1ODMtNTUwZi00YTFmLWIyMTEtMDU4ZTc4NjliYzkxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA4MjAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwODIwVDEyNTYzNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTlkMDk4YTZkZDQ1NzRmNzljMzZjNjUwYjAwNjU1N2QwNzU2Yjc5YTAzZjE1Y2U5Nzk5MDZiYjBmNTJlNzNhOGMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.OGF9yPd6Ztj9ty2Ga1VhF6YiLu_n6wfCZCJzPxTJDXw)

### プロジェクトの目的

AIモデル自体がコモディティ化する中で、その性能は与えられるコンテキストの質に大きく依存します。screenpipeは、「最も価値のあるコンテキストはユーザーのスクリーン上にある」という思想に基づき、AIがユーザーの活動を深く理解し、よりパーソナライズされた支援を提供できる未来を目指しています。

### 利用方法

macOS、Linux、Windowsに対応しており、簡単なコマンドライン操作でインストールできます。

```sh
# macOS, Linux
curl -fsSL get.screenpi.pe/cli | sh

# Windows
iwr get.screenpi.pe/cli.ps1 | iex

# 実行
screenpipe
```

また、公式ウェブサイトからデスクトップアプリケーションもダウンロード可能です。

### プラグイン開発

`pipe` と呼ばれるプラグインシステムを通じて、Next.jsをベースにしたデスクトップアプリを開発し、screenpipeのストアで公開・収益化（サブスクリプションモデル）することが可能です。

```sh
# プラグイン作成
bunx --bun @screenpipe/dev@latest pipe create

# プラグイン登録・公開
cd my-plugin
bunx --bun @screenpipe/dev@latest pipe register --name my-plugin --paid --price 50
bun run build
bunx --bun @screenpipe/dev@latest pipe publish --name my-plugin
```

### コミュニティと貢献

プロジェクトは活発に開発されており、資金調達の成功やGitHubトレンドでの1位獲得など、多くの注目を集めています。貢献は歓迎されており、ドキュメントに従って誰でも参加できます。
