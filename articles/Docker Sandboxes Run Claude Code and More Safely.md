---
title: "Docker Sandboxes: Run Claude Code and More Safely"
source: "https://www.docker.com/blog/docker-sandboxes-run-claude-code-and-other-coding-agents-unsupervised-but-safely/"
author:
  - "[[Docker]]"
published: 2026-01-30
created: 2026-02-18
description: "Docker Sandboxesの新バージョンがmicroVMベースの分離機能を搭載しmacOS/Windowsで利用可能に。Claude Code、Gemini CLI、Codex CLI、Copilot CLI、Kiroなどのコーディングエージェントを、ホストマシンに影響を与えることなく安全に自律実行できる隔離環境を提供する。"
tags:
  - "clippings"
  - "Docker"
  - "AI-coding-agents"
  - "sandbox"
  - "microVM"
  - "Claude-Code"
  - "security"
  - "DevTools"
---

## 概要

Docker Sandboxesは、コーディングエージェント（Claude Code、Gemini CLI、Codex CLI、Copilot CLI、Kiro）を安全に自律実行するための使い捨て隔離環境である。数か月前の実験プレビューを経て、**microVMベースの分離機能**を搭載した新バージョンがmacOSとWindowsで利用可能になった。

エージェントがパッケージのインストール、設定変更、ファイル削除、Dockerコンテナの実行を行っても、ホストマシンには一切影響しない。

## 解決する課題：コーディングエージェントの安全な実行

コーディングエージェントを無人で実行（常時の許可プロンプトなしで）しつつ、マシンとデータを保護するという実用的な課題に対応する。開発者が直面する既存アプローチの問題点：

| アプローチ | 問題点 |
|---|---|
| **フルVM** | 遅く、手動セットアップが必要、プロジェクト間での再利用が困難 |
| **コンテナ** | エージェントがDocker自体を実行する必要がある場合に対応不可 |
| **OSレベルのサンドボックス** | ワークフローを中断し、プラットフォーム間で一貫性がない |

## Docker Sandboxesの主要機能

### 多層防御・デフォルト分離

- **ハイパーバイザーベースの分離**によりホストリスクを大幅に低減
- プロジェクトのワークスペースのみがサンドボックスにマウントされる
- 各エージェントは**専用のmicroVM内**で実行される

### 本格的な開発環境

- 常時の許可承認なしでワークフローが無人実行可能
- エージェントはシステムパッケージのインストール、サービスの実行、ファイルの変更が可能

### 安全なDocker実行

- ホストのDockerデーモンへのアクセスは一切なし
- コーディングエージェントはmicroVM内部でDockerコンテナのビルド・実行が可能
- **Docker Sandboxesは、ホストシステムから隔離されたままコーディングエージェントがDockerコンテナをビルド・実行できる唯一のサンドボックスソリューション**（Docker社の認識による）

### 1つのサンドボックスで複数エージェント対応

- Claude Code、Copilot CLI、Codex CLI、Gemini CLI、Kiroに対応
- 追加エージェントのサポートを拡大予定

### 高速リセット

- エージェントが暴走した場合、サンドボックスを削除して数秒で新しいものを起動可能

## プレビューからの進化（What's New）

実験プレビューでは、コーディングエージェントに必要なのは許可プロンプトの連続ではなく、明確な分離境界を持つ実行環境であるというコアコンセプトが検証された。

> "Docker Sandboxes have the best DX of any local AI coding sandbox I've tried." — Matt Pocock

### 新機能

1. **エージェント向けセキュアDocker実行** — ホストから隔離されたままDockerコンテナのビルド・実行が可能
2. **ネットワーク分離（許可/拒否リスト）** — コーディングエージェントのネットワークアクセスを制御可能
3. **microVMベースの分離** — 専用microVMによるハードセキュリティ境界の追加

## 今後のロードマップ（What's Next）

- 追加のコーディングエージェントのサポート
- ホストデバイスへのポート公開およびホスト公開サービスへのアクセス
- **MCP Gatewayサポート**
- **Linuxサポート**

## 重要な結論

Docker Sandboxesは、コンテナの分離原則を拡張しつつハード境界を付加したものであり、許可プロンプト、システムリスク、Docker-in-Docker制限といった理由でエージェント利用を控えていた開発者向けに設計されている。開発者のフィードバックに基づいて迅速にイテレーションし、実際の使用状況が今後の方向性を直接形作る方針。

## 参考リンク

- [Docker Sandboxes 製品ページ](https://www.docker.com/products/docker-sandboxes/)
- [Docker Sandboxes ドキュメント](https://docs.docker.com/ai/sandboxes/)
- [初回プレビューのブログ記事](https://www.docker.com/blog/docker-sandboxes-a-new-approach-for-coding-agent-safety/)