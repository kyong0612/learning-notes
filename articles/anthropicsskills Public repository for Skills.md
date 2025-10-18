---
title: "anthropics/skills: Public repository for Skills"
source: "https://github.com/anthropics/skills"
author:
  - "Anthropic"
published:
created: 2025-10-18
description: "Anthropicが公開するClaudeのSkillsの公式リポジトリ。クリエイティブ、開発、エンタープライズなど多様なタスクに特化したスキルの例題集と、Claude内部で使用されるドキュメント処理スキル（docx/pdf/pptx/xlsx）を提供。Apache 2.0ライセンスのオープンソース。"
tags:
  - "AI"
  - "Claude"
  - "skills"
  - "agent-skills"
  - "anthropic"
  - "open-source"
---

## Skillsとは

**Skills**は、Claudeが特定のタスクで性能を向上させるために動的に読み込む、指示・スクリプト・リソースのフォルダです。スキルはClaudeに特定のタスクを再現可能な方法で実行する方法を教え、企業のブランドガイドラインに従ったドキュメント作成、組織固有のワークフローを使ったデータ分析、個人タスクの自動化などを可能にします。

## リポジトリの概要

- **⭐️ Stars**: 3.2k
- **🔀 Forks**: 224
- **📝 License**: Apache 2.0（ドキュメントスキルはソース利用可能だがオープンソースではない）
- **💬 コミュニケーション**: Issues（9件）、Pull Requests（5件）、Discussions

このリポジトリには、Claudeのスキルシステムの可能性を示す例題スキルが含まれています。クリエイティブアプリケーション（アート、音楽、デザイン）から技術的タスク（Webアプリテスト、MCPサーバー生成）、エンタープライズワークフロー（コミュニケーション、ブランディング等）まで幅広い例が提供されています。

### 重要な免責事項

これらのスキルは**デモンストレーションおよび教育目的でのみ提供**されています。Claude内で利用可能な機能の一部かもしれませんが、実際にClaudeから得られる実装や動作は、これらの例と異なる場合があります。重要なタスクに使用する前に、必ず自身の環境で十分にテストしてください。

## スキルの構成

各スキルは独立したディレクトリに格納され、Claudeが使用する指示とメタデータを含む`SKILL.md`ファイルを持っています。

### 基本的なスキル構造

```markdown
---
name: my-skill-name
description: このスキルが何をするか、いつ使用するかの明確な説明
---

# スキル名

[Claudeがこのスキルがアクティブなときに従う指示をここに追加]

## 使用例
- 使用例 1
- 使用例 2

## ガイドライン
- ガイドライン 1
- ガイドライン 2
```

frontmatterには2つの必須フィールドがあります：

- `name`: スキルの一意の識別子（小文字、スペースはハイフン）
- `description`: スキルの機能と使用タイミングの完全な説明

## 提供されているスキルの例

### 🎨 クリエイティブ & デザイン

- **algorithmic-art**: p5.jsを使用した生成アート作成（シード付きランダム性、フローフィールド、パーティクルシステム）
- **canvas-design**: デザイン哲学を用いた美しいビジュアルアート（.png/.pdf形式）の設計
- **slack-gif-creator**: Slackのサイズ制約に最適化されたアニメーションGIFの作成

### 💻 開発 & 技術

- **artifacts-builder**: React、Tailwind CSS、shadcn/uiコンポーネントを使用した複雑なclaude.ai HTMLアーティファクトの構築
- **mcp-builder**: 外部APIとサービスを統合する高品質MCPサーバーの作成ガイド
- **webapp-testing**: Playwrightを使用したローカルWebアプリケーションのUI検証とデバッグ

### 🏢 エンタープライズ & コミュニケーション

- **brand-guidelines**: Anthropicの公式ブランドカラーとタイポグラフィをアーティファクトに適用
- **internal-comms**: ステータスレポート、ニュースレター、FAQなどの社内コミュニケーションの執筆
- **theme-factory**: 10種類のプリセットプロフェッショナルテーマでアーティファクトをスタイリング、またはカスタムテーマをその場で生成

### 🔧 メタスキル

- **skill-creator**: Claudeの機能を拡張する効果的なスキル作成ガイド
- **template-skill**: 新しいスキルの出発点として使用する基本テンプレート

## ドキュメントスキル（document-skills/）

`document-skills/`サブディレクトリには、Anthropicが開発した、Claudeが様々なドキュメントファイル形式を作成できるようにするスキルが含まれています。これらは、複雑なファイル形式やバイナリデータを扱うための高度なパターンを示しています：

### 📄 提供されるドキュメント形式

- **docx**: Word文書の作成、編集、分析（変更履歴、コメント、書式保持、テキスト抽出のサポート）
- **pdf**: 包括的なPDF操作ツールキット（テキストとテーブルの抽出、新規PDF作成、文書の結合・分割、フォーム処理）
- **pptx**: PowerPointプレゼンテーションの作成、編集、分析（レイアウト、テンプレート、チャート、自動スライド生成のサポート）
- **xlsx**: Excelスプレッドシートの作成、編集、分析（数式、書式設定、データ分析、視覚化のサポート）

**重要な免責事項**: これらのドキュメントスキルは特定時点のスナップショットであり、積極的にメンテナンスや更新はされていません。これらのスキルのバージョンはClaudeに事前に含まれています。主に、バイナリファイル形式やドキュメント構造を扱うより複雑なスキルをAnthropicがどのように開発しているかを示す参考例として提供されています。

## 使用方法

### Claude Code

Claude Codeでこのリポジトリをプラグインマーケットプレイスとして登録できます：

```bash
/plugin marketplace add anthropics/skills
```

プラグインインストール後、スキルに言及するだけで使用できます。例：「pdf skillを使ってpath/to/some-file.pdfからフォームフィールドを抽出して」

### Claude.ai

これらの例題スキルはすべて、claude.aiの有料プランですでに利用可能です。使用するには、[Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude#h_a4222fa77b)の指示に従ってください。

### Claude API

Anthropicの事前構築スキルの使用や、カスタムスキルのアップロードは、Claude API経由でも可能です。詳細は[Skills API Quickstart](https://docs.claude.com/en/api/skills-guide#creating-a-skill)を参照してください。

## パートナースキル

スキルは、Claudeに特定のソフトウェアの使い方を教える優れた方法です。パートナーからの素晴らしい例題スキルとして：

- **Notion**: [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0)

## 参考リンク

- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Equipping agents for the real world with Agent Skills](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## 技術仕様

リポジトリの言語構成：

- Python: 87.9%
- JavaScript: 7.1%
- HTML: 3.2%
- Shell: 1.8%
