---
title: "Announcing Genkit Go 1.0 and Enhanced AI-Assisted Development- Google Developers Blog"
source: "https://developers.googleblog.com/en/announcing-genkit-go-10-and-enhanced-ai-assisted-development/?linkId=16710004"
author:
  - "Chris Gill"
  - "Cameron Balahan"
published: 2025-09-09
created: 2025-09-12
description: |
  Googleは、Go言語向けのオープンソースAI開発フレームワーク「Genkit Go 1.0」の初の安定版をリリースしました。これにより、開発者はGoの速度、安全性、信頼性を活かして、AIアプリケーションを本番環境で構築・展開できます。
tags:
  - "Genkit Go"
  - "AI開発"
  - "Go言語"
  - "AI支援開発"
  - "Google Developers"
---

![Genkit-Go-1.0-Blog](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/Genkit-Go-1.0-Blog.original.png)

Googleは、Go言語向けのオープンソースAI開発フレームワーク「Genkit Go 1.0」の初の安定版をリリースしました。これにより、開発者はGoの速度、安全性、信頼性を活かして、AIアプリケーションを本番環境で構築・展開できます。

### 主な特徴

- **型安全なAIフロー**: Goの構造体とJSONスキーマ検証を活用して、型安全なAIフローを定義できます。
- **統一されたモデルインターフェース**: Google AI、Vertex AI、OpenAI、Ollamaなど、複数のモデルプロバイダーをサポートする統一インターフェースを提供します。
- **ツール呼び出し、RAG、マルチモーダル対応**: 外部関数やAPIへのアクセス、検索拡張生成（RAG）、マルチモーダルコンテンツのサポートを容易にします。
- **豊富なローカル開発ツール**: スタンドアロンのCLIバイナリと開発者向けUIを備え、ローカルでの開発を強力にサポートします。
- **AIコーディングアシスタントの統合**: `genkit init:ai-tools`コマンドを使用して、Gemini CLIなどのツールと統合し、AI支援開発ワークフローを強化します。

### 新機能の詳細

- **本番環境対応**: Genkit Go 1.0は、安定性と信頼性を備えた本番環境対応のリリースであり、APIは安定しており、十分にテストされています。
- **型安全なAIフロー**: AIユースケース向けのフローを定義し、観測性、テストの容易さ、展開の簡素化を実現します。
- **統一されたモデルインターフェース**: 複数のAIモデルプロバイダーと統一されたインターフェースで連携し、コンテンツ生成を容易にします。
- **ツール呼び出し**: AIモデルが外部関数やAPIにアクセスすることを容易にします。
- **簡単な展開**: 最小限のセットアップでフローをHTTPエンドポイントとして展開できます。

これらの機能により、開発者はGo言語を使用して、AIを活用したアプリケーションを効率的に構築し、展開することが可能となります。
