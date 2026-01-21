---
title: "GitHub Copilot CLI 現状確認会議"
source: "https://speakerdeck.com/torumakabe/github-copilot-cli-xian-zhuang-que-ren-hui-yi"
author:
  - "[[Toru Makabe]]"
published: 2026-01-19
created: 2026-01-21
description: "GitHub Copilot CLIの2026年1月時点での機能、使い方、カスタマイズ方法を網羅的に解説したプレゼンテーション。3種のエージェント（Local、Local Background、Cloud）の位置づけ、マルチモデル対応、サブエージェント活用、カスタマイズファイルの構成について詳述。"
tags:
  - "clippings"
  - "GitHub-Copilot"
  - "CLI"
  - "AI-Agent"
  - "DevOps"
  - "LLM"
---

## 概要

真壁徹氏（日本マイクロソフト シニアクラウドソリューションアーキテクト）による、2026年1月19日時点でのGitHub Copilot CLIの現状を整理したプレゼンテーション（全34スライド）。GitHub Copilotの急速な機能拡充を背景に、3種のエージェント構成、マルチモデル対応、カスタマイズ機構などを網羅的に解説している。

## コーディングエージェントの多様なニーズ

現代のコーディングエージェントには、以下のような多角的な要件が存在する：

- 対話型 vs 自動化
- ローカル vs クラウド
- GUI vs CLI/TUI
- 個人 vs チーム

## GitHubのビジョン: Agent HQ

GitHubは「単一のエージェント、モデルではソフトウェアライフサイクル全体をカバーできない」という課題認識のもと、複数のエージェントを統合的に管理する「Agent HQ」構想を推進している。

## 3種のエージェント構成

| エージェント | 特徴 | 実行形態 |
|-----------|------|--------|
| **Local Agent Mode** | IDE/エディタプラグイン | 対話型、同期 |
| **Local Background** | CLI（2025年9月リリース） | 対話型・ジョブ型両対応 |
| **Cloud Coding Agent** | GitHub Actions統合 | 非同期、ジョブ型 |

## インストールと前提条件

### サポートOS
- Linux、macOS、Windows

### 前提条件
- GitHub Copilotサブスクリプション
- Windows環境ではPowerShell v6以降

### インストール方法
- npm
- homebrew
- winget
- bashスクリプト

## 2つの動作モード

1. **インタラクティブモード**: `copilot` コマンドで起動
2. **プログラマティックモード**: `copilot -p "<リクエスト>"` で直接実行

## セキュリティ機能

ファイルの編集や実行を行うツールの使用は「**常に確認する**」が既定動作。以下のオプションで制御可能：

- `--allow-tool` / `--deny-tool`
- `--allow-all-paths` / `--allow-all-urls`
- `--yolo` オプション: `--allow-all-tools --allow-all-paths --allow-all-urls` と同等（要注意）

## マルチモデル対応

- 様々なLLMを利用可能
- プレミアムリクエスト消費量はモデルによって異なる
- **サブエージェント機能により、異なるモデルの並列実行が可能**

## カスタマイズ機構

### ファイル構成

```
.github/
├─ copilot-instructions.md（全体適用）
├─ instructions/*.instructions.md（パス別）
├─ prompts/*.prompt.md（定型タスク）
├─ agents/*.agent.md（役割固定）
└─ skills/<skill-name>/SKILL.md（詳細手順）
```

### カスタマイズの使い分け

| 種類 | 用途 |
|-----|-----|
| **Instructions** | 常時適用の簡単なルール |
| **Skills** | 必要時参照の詳しい手順 |
| **Prompts** | 再利用可能な定型プロンプト |

### 標準化の動向

ベンダー・ツール横断での「**AGENTS.md**」標準化が始まっている段階。

## 高度な機能

### フック機構

6種のイベントをフック可能：
- `sessionStart`
- `userPromptSubmitted`
- `preToolUse`
- その他

### メモリー機能

コードベース知識を蓄積・共有する機能。2026年1月時点でプレビュー段階。

### SDK提供

CLI経由でGitHub Copilotを組み込んだアプリケーション開発が可能。対応予定言語：
- TypeScript
- Python
- Go
- .NET

## 参考リソース

### Awesome Copilot

GitHub公式主導のコミュニティリポジトリ。カスタム指示・プロンプト・エージェント定義を用途別にキュレーションしている。

## 注意事項

- スライドは公開時点（2026年1月19日）での情報
- GitHub Copilotの開発ペースが速いため、最新情報の確認が推奨される
- ドキュメントが追い付いていない部分があり、GitHub Issueでの情報確認も有効
