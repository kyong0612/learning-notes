---
title: "lackeyjb/playwright-skill: Claude Code Skill for browser automation with Playwright. Model-invoked - Claude autonomously writes and executes custom automation for testing and validation."
source: "https://github.com/lackeyjb/playwright-skill"
author:
  - "[[lackeyjb]]"
published:
created: 2025-12-24
description: |
  Claude Code用のPlaywrightスキル。Claudeが任意のブラウザ自動化タスクを動的に記述・実行できるようにする。シンプルなページテストから複雑なマルチステップフローまで対応。Claude Code Pluginとしてパッケージ化されており、簡単にインストール・配布可能。Claudeはブラウザ自動化のニーズに基づいて自動的にこのスキルを使用するタイミングを判断し、タスクに必要な最小限の情報のみを読み込む。
tags:
  - "clippings"
  - "playwright"
  - "browser-automation"
  - "claude-code"
  - "claude-skills"
  - "web-testing"
  - "e2e-testing"
  - "automation"
  - "ai-tools"
  - "model-invoked"
---

# Playwright Skill for Claude Code

## 概要

Playwright Skill for Claude Codeは、Claude Code用の汎用ブラウザ自動化スキルです。Claudeが任意のPlaywright自動化を動的に記述・実行できるようにします。シンプルなページテストから複雑なマルチステップフローまで対応可能で、[Claude Code Plugin](https://docs.claude.com/en/docs/claude-code/plugins)としてパッケージ化されており、簡単にインストール・配布できます。

Claudeはブラウザ自動化のニーズに基づいて自動的にこのスキルを使用するタイミングを判断し、タスクに必要な最小限の情報のみを読み込みます。このプロジェクトはClaude Codeを使用して作成されました。

## 主な機能

### 1. 任意の自動化タスクに対応

- Claudeがリクエストに応じてカスタムコードを記述
- 事前に構築されたスクリプトに限定されない柔軟性

### 2. デフォルトでブラウザを可視化

- `headless: false`がデフォルト設定
- 自動化をリアルタイムで確認可能

### 3. モジュール解決エラーの回避

- ユニバーサルエグゼキューター（run.js）が適切なモジュールアクセスを保証

### 4. プログレッシブディスクロージャー

- 簡潔なSKILL.mdと完全なAPIリファレンス
- 必要に応じてのみAPIリファレンスを読み込み

### 5. 安全なクリーンアップ

- レースコンディションを回避するスマートな一時ファイル管理

### 6. 包括的なヘルパー関数

- 一般的なタスク用のオプションのユーティリティ関数

## インストール方法

このリポジトリはClaude Code Pluginとして構造化されており、**プラグイン**（推奨）または**スタンドアロンスキル**としてインストールできます。

### 構造の理解

このリポジトリはネストされた構造を持つプラグインフォーマットを使用しています：

```text
playwright-skill/              # プラグインルート
├── .claude-plugin/           # プラグインメタデータ
└── skills/
    └── playwright-skill/     # 実際のスキル
        └── SKILL.md
```

Claude Codeはスキルが`.claude/skills/`の下のフォルダに直接配置されることを期待するため、手動インストールではネストされたスキルフォルダを抽出する必要があります。

### オプション1: プラグインインストール（推奨）

Claude Codeのプラグインシステム経由でインストール（自動更新とチーム配布に対応）：

```bash
# このリポジトリをマーケットプレイスとして追加
/plugin marketplace add lackeyjb/playwright-skill

# プラグインをインストール
/plugin install playwright-skill@playwright-skill

# スキルディレクトリに移動してセットアップを実行
cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill
npm run setup
```

インストールを確認するには`/help`を実行してスキルが利用可能であることを確認します。

### オプション2: スタンドアロンスキルインストール

プラグインシステムなしでスタンドアロンスキルとしてインストールする場合、スキルフォルダのみを抽出します。

**グローバルインストール（どこでも利用可能）：**

```bash
# 一時的な場所にクローン
git clone https://github.com/lackeyjb/playwright-skill.git /tmp/playwright-skill-temp

# スキルフォルダのみをグローバルスキルディレクトリにコピー
mkdir -p ~/.claude/skills
cp -r /tmp/playwright-skill-temp/skills/playwright-skill ~/.claude/skills/

# スキルに移動してセットアップを実行
cd ~/.claude/skills/playwright-skill
npm run setup

# 一時ファイルをクリーンアップ
rm -rf /tmp/playwright-skill-temp
```

**プロジェクト固有のインストール：**

```bash
# 一時的な場所にクローン
git clone https://github.com/lackeyjb/playwright-skill.git /tmp/playwright-skill-temp

# スキルフォルダのみをプロジェクトにコピー
mkdir -p .claude/skills
cp -r /tmp/playwright-skill-temp/skills/playwright-skill .claude/skills/

# スキルに移動してセットアップを実行
cd .claude/skills/playwright-skill
npm run setup

# 一時ファイルをクリーンアップ
rm -rf /tmp/playwright-skill-temp
```

### オプション3: リリースからダウンロード

1. [GitHub Releases](https://github.com/lackeyjb/playwright-skill/releases)から最新リリースをダウンロードして展開
2. `skills/playwright-skill/`フォルダのみを以下にコピー：
   - グローバル: `~/.claude/skills/playwright-skill`
   - プロジェクト: `/path/to/your/project/.claude/skills/playwright-skill`
3. スキルディレクトリに移動してセットアップを実行：

   ```bash
   cd ~/.claude/skills/playwright-skill  # またはプロジェクトパス
   npm run setup
   ```

### インストールの確認

`/help`を実行してスキルが読み込まれたことを確認し、その後Claudeに「google.comが読み込まれるかテストして」などの簡単なブラウザタスクを依頼します。

## クイックスタート

インストール後、Claudeに任意のブラウザタスクのテストや自動化を依頼するだけです。ClaudeがカスタムPlaywrightコードを記述し、実行し、スクリーンショットとコンソール出力を含む結果を返します。

## 使用例

### 任意のページをテスト

```text
"Test the homepage"
"Check if the contact form works"
"Verify the signup flow"
```

### ビジュアルテスト

```text
"Take screenshots of the dashboard in mobile and desktop"
"Test responsive design across different viewports"
```

### インタラクションテスト

```text
"Fill out the registration form and submit it"
"Click through the main navigation"
"Test the search functionality"
```

### バリデーション

```text
"Check for broken links"
"Verify all images load"
"Test form validation"
```

## 動作の仕組み

1. テストまたは自動化したい内容を説明
2. Claudeがタスク用のカスタムPlaywrightコードを記述
3. ユニバーサルエグゼキューター（run.js）が適切なモジュール解決で実行
4. ブラウザが開き（デフォルトで可視）、自動化が実行される
5. コンソール出力とスクリーンショットを含む結果が表示される

## 設定

デフォルト設定：

- **Headless:** `false`（明示的に要求されない限りブラウザは可視）
- **Slow Motion:** 可視性のため`100ms`
- **Timeout:** `30s`
- **Screenshots:** `/tmp/`に保存

## プロジェクト構造

```text
playwright-skill/
├── .claude-plugin/
│   ├── plugin.json          # 配布用プラグインメタデータ
│   └── marketplace.json     # マーケットプレイス設定
├── skills/
│   └── playwright-skill/    # 実際のスキル（Claudeが発見）
│       ├── SKILL.md         # Claudeが読む内容
│       ├── run.js           # ユニバーサルエグゼキューター（適切なモジュール解決）
│       ├── package.json     # 依存関係とセットアップスクリプト
│       └── lib/
│           └── helpers.js   # オプションのユーティリティ関数
│       └── API_REFERENCE.md # 完全なPlaywright APIリファレンス
├── README.md                # このファイル - ユーザードキュメント
├── CONTRIBUTING.md          # 貢献ガイドライン
└── LICENSE                  # MITライセンス
```

## 高度な使用法

Claudeは必要に応じて自動的に`API_REFERENCE.md`を読み込み、セレクター、ネットワークインターセプション、認証、ビジュアルリグレッションテスト、モバイルエミュレーション、パフォーマンステスト、デバッグに関する包括的なドキュメントを提供します。

## 依存関係

- Node.js
- Playwright（`npm run setup`でインストール）
- Chromium（`npm run setup`でインストール）

## トラブルシューティング

**Playwrightがインストールされていない？**

スキルディレクトリに移動して`npm run setup`を実行してください。

**モジュールが見つからないエラー？**

自動化が`run.js`経由で実行されることを確認してください。これによりモジュール解決が処理されます。

**ブラウザが開かない？**

`headless: false`が設定されていることを確認してください。スキルはヘッドレスモードが要求されない限り、デフォルトで可視ブラウザを使用します。

**すべてのブラウザをインストールする？**

スキルディレクトリから`npm run install-all-browsers`を実行してください。

## スキルとは何か？

[Agent Skills](https://agentskills.io)は、エージェントが発見して使用できる、指示、スクリプト、リソースのフォルダです。これにより、より正確かつ効率的に作業できます。ClaudeにWebページのテストやブラウザインタラクションの自動化を依頼すると、Claudeはこのスキルを発見し、必要な指示を読み込み、カスタムPlaywrightコードを実行し、スクリーンショットとコンソール出力を含む結果を返します。

このPlaywrightスキルは[オープンAgent Skills仕様](https://agentskills.io)を実装しており、エージェントプラットフォーム間で互換性があります。

## 貢献

貢献を歓迎します。リポジトリをフォークし、機能ブランチを作成し、変更を加えてプルリクエストを提出してください。詳細は[CONTRIBUTING.md](https://github.com/lackeyjb/playwright-skill/blob/main/CONTRIBUTING.md)を参照してください。

## 関連リソース

- [Agent Skills Specification](https://agentskills.io) - エージェントスキルのオープン仕様
- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Claude Code Plugins Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Plugin Marketplaces](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [API_REFERENCE.md](https://github.com/lackeyjb/playwright-skill/blob/main/skills/playwright-skill/API_REFERENCE.md) - 完全なPlaywrightドキュメント
- [GitHub Issues](https://github.com/lackeyjb/playwright-skill/issues)

## ライセンス

MITライセンス - 詳細は[LICENSE](https://github.com/lackeyjb/playwright-skill/blob/main/LICENSE)ファイルを参照してください。

## 統計情報

- **スター数:** 988
- **フォーク数:** 46
- **最新リリース:** v4.1.0（2025年12月2日）
- **言語:** JavaScript 100.0%
