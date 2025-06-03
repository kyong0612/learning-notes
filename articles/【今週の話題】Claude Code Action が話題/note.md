---
title: "【今週の話題】Claude Code Action が話題"
source: "https://blog.lai.so/claude-code-action/?ref=laiso-newsletter"
author:
  - "laiso"
published: 2025-06-02
created: 2025-06-03
description: |
  2025年5月22日にリリースされたClaude Codeと同時に公開されたGitHub Action「Claude Code Action」について解説。GitHubのプルリクエストやイシュー内で@claudeのメンションによりコードの質問や変更を自動で行うことができる。Claude Code SDKの仕組み、コスト構造、定額プランでの利用について詳しく説明。
tags:
  - "claude-code"
  - "github-actions"
  - "ai-coding"
  - "anthropic"
  - "automation"
  - "sdk"
---

# Claude Code Actionとは

2025年5月22日に正式リリースされたClaude Codeと同時に公開された、GitHubのプルリクエストやイシュー内でコードの質問や変更を自動で行うことができるGitHub Action「Claude Code Action」がにわかに話題になっています。

![Google Trends showing Claude Code search popularity](https://blog.lai.so/content/images/2025/06/image.png)

## 主要な特徴

Claude Code Actionは以下の特徴を持ちます：

- **GitHub統合**: プルリクエストやイシュー内で@claudeのメンションで話しかけることが可能
- **完全自律型**: コーディングエージェントのように振る舞う
- **セルフホスト型**: Anthropics社がインフラを提供するのではなく、ユーザーが各自のリポジトリにGitHub Actionsとして組み込む
- **API連携**: Claude CodeをAPIキーとともに自分のリポジトリに持ち込み、GitHub APIのフックから自動実行

## Claude Code SDKの仕組み

### 技術的基盤

Claude Code Actionが実現できる理由は、Claude Codeが「Claude Code SDK」の上に構築されているからです。現在のSDKは「コマンドラインからの呼び出しに対応」レベルの機能を提供しています。

### 実行オプション

Claude Codeは以下のオプションで自動実行が可能：

- **`-p`オプション**: ユーザーの確認待ちを通さず、タスク完了まで処理を実行
- **`--allowedTools`**: 実行時にあらかじめ許可する権限を指定

### 内部構造

Claude Code Actionは以下の仕組みで動作：

1. GitHub Actions上で`claude-code-base-action`という別のActionへコンテキストを渡す
2. Bun経由のサブプロセスで`claude`コマンドを実行
3. PythonやTypeScript向けのSDKライブラリも開発中

### 対応環境

- **デフォルト**: Ubuntuイメージで実行
- **macOS対応**: macOSイメージでも動作確認済み
- **iOS開発**: Xcodeプロジェクトのビルドなどにも対応

## コスト構造と利用方法

### 料金体系

Claude Code Actionの利用コストは2つの要素から構成：

1. **GitHub Actions**: 利用時間に基づく課金
2. **Claude API**: トークン消費に基づく従量課金（APIキー認証のため）

### 定額プランでの利用

Claude Code Actionは内部的に`claude`コマンドのラッパーとして機能するため、実行時にログイン情報を配置することでClaude Codeの定額プランアカウントの権限で使用することが技術的に可能です。

### 利用規約上の注意点

Anthropic社への問い合わせによると：

- **現状**: 利用は受け入れ可能だが、グレーゾーンに位置する
- **想定用途**: 消費者向けプランは主に個人の対話的な使用を前提として設計
- **リスク**: 不特定多数へのアクセス提供の可能性
- **推奨**: 長期的な維持可能性を考慮し、素直にAPIキー利用を選択することが望ましい

## 主要リンク

- [GitHub Actions - Anthropic](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [GitHub - anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- [Claude Code SDK ドキュメント](https://docs.anthropic.com/en/docs/claude-code/sdk)
- [GitHub - anthropics/claude-code-base-action](https://github.com/anthropics/claude-code-base-action)

## まとめ

Claude Code Actionは、AI駆動のコード開発をGitHubワークフローに統合する革新的なツールです。技術的には非常に興味深い実装ですが、コスト管理と利用規約の遵守に注意を払いながら活用することが重要です。今後のPython/TypeScript SDK開発により、さらなる統合可能性が期待されます。
