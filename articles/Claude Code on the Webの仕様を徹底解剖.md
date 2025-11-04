---
title: "Claude Code on the Webの仕様を徹底解剖"
source: "https://zenn.dev/oikon/articles/claude-code-web-sandbox"
author:
  - "Oikon (@oikon48)"
  - "[[Zenn]]"
published: 2025-11-01
created: 2025-11-04
description: "ブラウザ上でClaude Codeを実行できるClau Code on the Webの技術仕様を詳細に解説。Sandbox環境の制限、利用可能な機能、アーキテクチャなど、開発者向けの実践的な情報を提供。"
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "Sandbox"
  - "gVisor"
  - "Anthropic"
---

## 概要

この記事は、ブラウザ上でClaude Codeを実行できる「Claude Code on the Web」の技術仕様を詳細に解説しています。著者のOikonさんは、Sandbox環境の制限を理解したい開発者向けに実践的な情報を提供しています。

**注意:** この情報は2025年11月1日時点の調査結果であり、著者は「すでにSandboxの挙動が変わっているのを確認しています」と警告しています。

## Sandbox環境のスペック

### ハードウェア仕様

- **OS:** Ubuntu 24.04.3 LTS
- **ランタイム:** gVisor (runsc)
- **CPU:** 4コア
- **メモリ:** 8GB上限
- **ディスク:** 9.8GB

### アーキテクチャ

Claude Code on the Webは、Linux環境にGitリポジトリをクローンしてClaude Codeを起動する仕組みです。具体的には：

1. GitHubリポジトリを `/home/user/` にクローン
2. クローンしたディレクトリ内でClaude Codeセッションを開始
3. gVisorを使用した隔離された実行環境で動作

## グローバル設定とHooks

Sandboxには `~/.claude/settings.json` でStop Hooksが設定されており、`stop-hook-git-check.sh` スクリプトが以下の機能を実現しています：

- リポジトリに差分があった場合、commit + pushをClaudeに促す
- セッション終了時に自動的に変更を保存する仕組み

## Claude Codeの起動時オプション

### モデル制限

- **モデル:** Sonnet 4.5に固定
- settings.jsonで別モデルを指定しても変更不可

### 禁止ツール

- **githubコマンド (`gh`):** 明示的に禁止ツールとして設定

## 機能の利用可能性

| 機能 | 状態 | 備考 |
|------|------|------|
| CLAUDE.md | ✓ 使用可能 | プロジェクト固有の設定が可能 |
| Slash Commands | ✗ 使用不可 | カスタムコマンドは実行できない |
| Hooks | ✓ 使用可能 | Stop Hooksなどが設定可能 |
| Subagents | ✓ 使用可能 | エージェント機能は動作する |
| Skills | ✗ 使用不可 | スキル機能は利用できない |
| output-style | ✓ 使用可能 | ただし廃止予定の機能 |

## 重要な制限事項

1. **モデル選択の制限:** Sonnet 4.5以外のモデルは使用できません
2. **GitHub CLIの禁止:** `gh`コマンドによる直接的なGitHub操作は不可
3. **一部機能の非対応:** Slash CommandsとSkillsは現時点で利用不可
4. **仕様変更の可能性:** 記事執筆時点から既に挙動が変わっている可能性あり

## 技術的背景

### gVisorについて

gVisorは、Googleが開発したコンテナランタイムで、Linux kernelの薄い層として動作し、セキュリティを強化した実行環境を提供します。Claude Code on the Webでは、このgVisorを使用することで、安全なSandbox環境を実現しています。

## まとめ

Claude Code on the Webは、ブラウザから直接利用できる便利なサービスですが、ローカル環境と比較していくつかの制限があります。開発者はこれらの制限を理解した上で、適切に活用することが重要です。

## 参考資料

- Anthropic公式ドキュメント
- gVisor公式ドキュメント
