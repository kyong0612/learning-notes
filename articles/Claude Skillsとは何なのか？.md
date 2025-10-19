---
title: "Claude Skillsとは何なのか？"
source: "https://blog.lai.so/claude-skills/"
author:
  - "laiso"
published: 2025-10-18
created: 2025-10-19
description: "AnthropicがClaudeの新機能Claude Skills（Agent Skills）を発表。Markdownファイルとスクリプトで構成される「スキルフォルダ」を通じて、モデルに特定の機能や知識を拡張できる仕組み。MCPのコンテキスト肥大化問題に対処し、Progressive Disclosure（必要なときに必要な情報だけをロード）の特性を持つ。"
tags:
  - "Claude"
  - "AI"
  - "Agent Skills"
  - "MCP"
  - "Code Execution"
  - "Anthropic"
  - "プロンプトエンジニアリング"
---

## Claude Skillsの概要

AnthropicがClaudeの新機能として**Claude Skills**（Agent Skills）を発表しました。これは、Markdownファイルとスクリプトで構成される「スキルフォルダ」を通じて、モデルに特定の機能や知識を拡張できる仕組みです。

### 技術的基盤

Claude Skillsは、2024年8月にアップデートされたClaudeのコード実行環境インフラ「Code execution tool」を活用しています。それまではPythonコードによるグラフ生成やデータ分析に限定されていましたが、このアップデートでBashコマンドをサンドボックス環境で自由に実行できるようになりました。

### スキルの構造

- **エントリーポイント**: `SKILL.md`ファイル
- **メタ情報**: YAMLフロントマター形式で名前、説明などを宣言
- **実行方法**: Claudeは会話開始時に登録されたスキル一覧をリストアップし、ユーザーのコンテキストに一致したスキルを呼び出す

## MCPのコンテキスト肥大化問題への対応

### MCPの課題

Claude SkillsはMCPサーバーへのツール登録と似ていますが、レイヤーが異なります：

- **MCP**: 関数単位の登録。ツールのパラメータ定義をすべてコンテキストに含める必要がある
- **Claude Skills**: プロジェクト単位（ディレクトリ）。モデルがコード実行環境内で自律的にプログラムを実行

### コンテキスト肥大化の問題点

MCPの仕様では、登録されたMCPサーバーが返すツールのパラメータ定義をすべてモデルのコンテキストに含める必要があります。これにより：

1. **初期読み込み**: ツール件数 × パラメータ数のスキーマ情報がコンテキストを圧迫
2. **ツール連鎖**: ツールAの結果をツールBの入力に使う場合、通過する情報すべてをコンテキストに保持
3. **品質劣化**: 多くのMCPサーバーを活用するユーザーほどコンテキストウィンドウが狭くなり、タスクの品質が低下

Yuta Takahashiさんの調査では、Claude Codeの利用時に使用頻度の低いMCPツールが大量の定義を常時コンテキストに載せていることが判明しています。

### Progressive Disclosureによる解決

AnthropicはClaude Skillsの特性として**Progressive Disclosure**（必要なときに必要な情報だけをロードする）を強調しています：

1. **第一レベル**: エージェント起動時に、すべてのスキルの**名前と説明のみ**をシステムプロンプトに事前ロード
2. **第二レベル**: Claudeがタスクに対してスキルが関連性があると判断した場合のみ、`SKILL.md`の全内容をコンテキストにロード

この徹底ぶりは以下の制限に表れています：

- `SKILL.md`: 500行以下
- `description`: 1024文字まで

## 自作Skillsの作成方法

### 基本的なアプローチ

Anthropicは「[skill-creator](https://github.com/anthropics/skills/tree/main/skill-creator)」というSkillsを作るスキルを提供していますが、より実用的なアプローチは：

1. [anthropics/skillsリポジトリ](https://github.com/anthropics/skills)をエージェントに提供
2. 「既存コードを参考に新スキル○○を作成して」とバイブコーディング

最小構成として、`SKILL.md`にYAMLフロントマターを追加するだけで動作します。既存プロジェクトの`README.md`を`SKILL.md`にリネームしてフロントマターを追加するだけでも機能します。

### 外部モジュールの活用

ZIPファイルは8MBまでしかアップロードできないため、外部モジュールの活用が推奨されます：

- **Python**: `requirements.txt`を含める（例: `slack-gif-creator`）
- **JavaScript**: `package.json`を含める（例: `webapp-testing`でPlaywright連携）

### 制限事項

- Code execution toolのサンドボックスは一部サービスからアクセスがブロックされる
- BunやChromiumバイナリのインストールは失敗する可能性がある
- ただし、**Claude Code**に登録して使う場合は、ローカルでBashツールとして実行されるため、このサンドボックス制限は適用されない

## Claude Skillsの今後の展望

### シンプルな仕組み

Claude Skillsは「スキル名 + ディレクトリ + プロンプト」を事前登録し、モデルにコード実行で活用させるシンプルな仕組みです。内部的には**Code execution tool**という単一のツールにすべての自律実行を委譲しています。

### システム要件と普及可能性

- **要件**: skillsディレクトリを読み込み、コードを自律実行できる環境（サンドボックス）
- **他プラットフォーム**: ChatGPTにも[Code Interpreter](https://platform.openai.com/docs/guides/tools-code-interpreter)という相当機能があり、技術的には対応可能
- **MCPとの棲み分け**: Claude SkillsはMCPが持つ既存の認証済みリソースアクセスなどのユースケースは満たせないため、置き換わることはない

### 本線の予測

主な用途は**Claudeのチャット機能の拡張とスクリプト配布のポータビリティ向上**と予測されます：

- Claude Skillsに登録したコードはモバイルアプリのチャットからも使用可能
- ZIPファイルで配布可能
- Claude Codeからも読み込める（おまけ的位置づけ）

### Claude Codeとの関係

Claude SkillsをClaude Codeから使う仕組みは、特定のSkill登録ディレクトリに誘導するだけで、既存のClaude Code機能で賄われます。これは`CLAUDE.md`に「PDFを生成するときはこのディレクトリにあるスクリプトを使ってください」と書くのと大差ありません。

また、「MCPではなくコマンドラインツールの使い方をMarkdownに書いてBashツールで自動化する」というTIPSの延長線上にあります。

## まとめ

Claude Skillsは、MCPのコンテキスト肥大化問題に対する実用的なソリューションとして登場しました。Progressive Disclosureの原則に基づき、必要な情報のみを段階的にロードすることで、効率的なエージェント実行を実現しています。シンプルな仕組みながら、Claudeのチャット機能拡張とスクリプト配布の両面で有用性を持つ、実用的なアプローチと言えます。
