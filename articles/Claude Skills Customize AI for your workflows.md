---
title: "Claude Skills: Customize AI for your workflows"
source: "https://www.anthropic.com/news/skills"
author:
  - "Anthropic"
published: 2025-10-16
created: 2025-10-17
description: "Anthropicが発表した新機能「Agent Skills」の紹介。Claudeに特定のタスクを実行させるための、再利用可能で組み合わせ可能なカスタマイズツール。指示、スクリプト、リソースを含むフォルダとして提供され、Claude.ai、API、Claude Codeの全製品で利用可能。"
tags:
  - "Claude"
  - "AI"
  - "Agent"
  - "Skills"
  - "API"
  - "Anthropic"
  - "automation"
  - "productivity"
---

## 概要

2025年10月16日、AnthropicはClaudeの新機能「Agent Skills」（一般に「Skills」と呼ばれる）を発表しました。Skillsは、Claudeが特定のタスクをより効果的に実行できるようにするための、指示、スクリプト、リソースを含むフォルダです。

## Agent Skillsとは

**Agent Skills**は、Claudeに専門的なタスクを教えるためのカスタマイズ可能なツールです。必要に応じてClaudeがロードし、Excelでの作業や組織のブランドガイドラインに従うなどの特化したタスクを改善します。

Claudeは、タスクに関連する場合にのみスキルにアクセスします。使用時には、必要最小限の情報とファイルのみをロードし、高速性と専門性を両立させます。

## Skillsの主要な特徴

### 1. **組み合わせ可能（Composable）**

- 複数のスキルを重ねて使用可能
- Claudeが自動的に必要なスキルを識別し、調整

### 2. **ポータブル（Portable）**

- すべてのClaude製品で同じ形式を使用
- 一度作成すれば、Claude apps、Claude Code、APIで利用可能

### 3. **効率的（Efficient）**

- 必要な時に必要なものだけをロード
- パフォーマンスを維持しながら専門知識にアクセス

### 4. **強力（Powerful）**

- 実行可能なコードを含めることが可能
- トークン生成よりも信頼性の高い従来のプログラミングが必要なタスクに対応

Skillsは、専門知識をパッケージ化し、Claudeを特定の分野のスペシャリストにするカスタムオンボーディング資料として機能します。

## 各製品での利用方法

### **Claude Apps（Claude.ai）**

**対象ユーザー**: Pro、Max、Team、Enterpriseユーザー

**機能**:

- ドキュメント作成などの一般的なタスク用のスキルを提供
- カスタマイズ可能なサンプルスキル
- 独自のカスタムスキル作成機能

**使用方法**:

- Claudeがタスクに基づいて関連するスキルを自動的に呼び出す
- 手動選択は不要
- Claudeの思考チェーンの中でスキルの使用を確認可能

**スキルの作成**:

- 「skill-creator」スキルがインタラクティブなガイダンスを提供
- Claudeがワークフローについて質問し、フォルダ構造を生成
- SKILL.mdファイをフォーマットし、必要なリソースをバンドル
- 手動でのファイル編集は不要

**有効化**:

- 設定（Settings）からSkillsを有効化
- TeamおよびEnterpriseユーザーの場合、管理者が組織全体で有効化する必要あり

### **Claude Developer Platform（API）**

**機能**:

- Messages APIリクエストにAgent Skillsを追加可能
- 新しい`/v1/skills`エンドポイントでカスタムスキルのバージョニングと管理をプログラマティックに制御
- [Code Execution Tool](https://docs.claude.com/en/docs/agents-and-tools/tool-use/code-execution-tool)ベータ版が必要（スキルの実行に必要なセキュアな環境を提供）

**Anthropic提供のスキル**:

- Excel スプレッドシート（数式付き）の読み取りと生成
- PowerPointプレゼンテーションの作成
- Wordドキュメントの作成
- 入力可能なPDFの作成

**カスタムスキルの作成**:

- 開発者は特定のユースケースに対応するカスタムスキルを作成可能
- Claude Consoleでスキルバージョンの作成、表示、アップグレードが簡単に可能

### **Claude Code**

**機能**:

- チームの専門知識とワークフローでClaude Codeを拡張
- anthropics/skillsマーケットプレイスからプラグイン経由でスキルをインストール
- Claudeが関連する場合に自動的にロード
- バージョン管理を通じてチームとスキルを共有可能

**手動インストール**:

- `~/.claude/skills`にスキルを追加することで手動インストールも可能
- Claude Agent SDKがカスタムエージェント構築用に同じAgent Skillsサポートを提供

## 企業からの評価

### **Box**（Yashodha Bhavnani、Head of AI）
>
> "Skillsは、Claudeに Box コンテンツとの連携方法を教えます。ユーザーは保存されたファイルをPowerPointプレゼンテーション、Excelスプレッドシート、組織の基準に従ったWordドキュメントに変換でき、何時間もの作業を節約できます。"

### **Notion**（MJ Felix、Product Manager）
>
> "Skillsにより、ClaudeはNotionとシームレスに連携し、ユーザーを質問から行動へより迅速に導きます。複雑なタスクでのプロンプト調整が減り、より予測可能な結果が得られます。"

### **Canva**（Anwar Haneef、GM & Head of Ecosystem）
>
> "CanvaはSkillsを活用してエージェントをカスタマイズし、できることを拡張する計画です。これにより、Canvaをエージェントワークフローにより深く統合する新しい方法が開かれ、チームが独自のコンテキストをキャプチャし、素晴らしい高品質のデザインを簡単に作成できるようになります。"

### **Rakuten**（Yusuke Kaji、General Manager AI）
>
> "Skillsは、管理会計と財務のワークフローを効率化します。Claudeは複数のスプレッドシートを処理し、重大な異常を検出し、手順に従ってレポートを生成します。以前は1日かかっていたことが、今では1時間で達成できます。"

## スタート方法

各製品のドキュメントとリソース:

- **Claude apps**: [ユーザーガイド](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills) & [ヘルプセンター](https://support.claude.com/en/articles/12512176-what-are-skills)
- **API開発者**: [ドキュメント](https://docs.claude.com/en/api/skills-guide)
- **Claude Code**: [ドキュメント](https://docs.claude.com/en/docs/claude-code/skills)
- **カスタマイズ可能なサンプルスキル**: [GitHubリポジトリ](https://github.com/anthropics/skills)

## 今後の展開

Anthropicは以下の機能を開発中です:

- **簡素化されたスキル作成ワークフロー**
- **エンタープライズ全体への展開機能**: 組織がチーム全体にスキルを配布しやすくする

## 重要な注意事項

この機能により、Claudeはコードを実行できるようになります。強力な機能ですが、使用するスキルには注意が必要です。データの安全性を保つため、信頼できるソースからのスキルのみを使用してください。

詳細については、[こちら](https://support.claude.com/en/articles/12512180-using-skills-in-claude#h_2746475e70)をご覧ください。

## 技術的詳細

Agent Skillsの設計パターン、アーキテクチャ、開発のベストプラクティスに関する技術的な詳細については、Anthropicの[エンジニアリングブログ](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)を参照してください。
