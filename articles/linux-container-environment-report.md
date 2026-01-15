---
title: "Linux Container Environment Report"
source: "https://gist.github.com/simonw/35732f187edbe4fbd0bf976d013f22c8"
author:
  - "[[simonw]]"
published: 2026-01-12
created: 2026-01-15
description: "Claude AIアシスタントの「Cowork mode」を動かすLinuxコンテナ環境の詳細な技術レポート。Ubuntu 22.04 LTS上でARM64アーキテクチャを使用し、Bubblewrap、seccomp、名前空間分離などの多層セキュリティを実装したサンドボックス環境の構成を解説。"
tags:
  - "clippings"
  - "claude"
  - "container"
  - "sandbox"
  - "linux"
  - "security"
  - "ai-infrastructure"
---

## 概要

このレポートは、Claude AIアシスタントの「Cowork mode」を動かすLinuxコンテナ環境について詳細に記述しています。この環境は、ARM64アーキテクチャ上で動作する軽量かつ高度にサンドボックス化されたUbuntu 22.04 LTS仮想マシンです。

**生成日**: 2026年1月13日  
**セッションID**: brave-loving-maxwell

---

## システム概要

### オペレーティングシステム

| 項目 | 値 |
|------|-----|
| **ディストリビューション** | Ubuntu 22.04.5 LTS (Jammy Jellyfish) |
| **カーネル** | Linux 6.8.0-90-generic (PREEMPT_DYNAMIC) |
| **アーキテクチャ** | aarch64 (ARM64) |
| **ホスト名** | claude |

### ハードウェアリソース

#### CPU機能

ARM64プロセッサには以下の高度な機能が含まれています：

- **ハードウェア暗号化アクセラレーション**: AES、SHA1、SHA2、SHA3、SHA512
- **Atomic Operations**
- **Pointer Authentication**: PACA/PACG
- **Branch Target Identification (BTI)**

---

## サンドボックスアーキテクチャ

### Bubblewrap (bwrap) による分離

コンテナは主要なサンドボックスメカニズムとしてBubblewrapを使用しています。主な分離機能：

| 機能 | 説明 |
|------|------|
| **Network Isolation** | `--unshare-net`で独立したネットワーク名前空間を作成 |
| **PID Isolation** | `--unshare-pid`でプロセス名前空間を分離 |
| **Die-with-parent** | 親プロセス終了時にコンテナも終了 |
| **New Session** | ターミナルハイジャック攻撃を防止 |

### Seccompフィルタリング

環境は厳格なseccomp（Secure Computing Mode）フィルタリングを採用：

- **Seccomp Mode**: 2（フィルターモード）
- **Active Filters**: 2つのseccompフィルターを適用
- **NoNewPrivs**: 有効（権限昇格を防止）
- **Capabilities**: すべてのケイパビリティがドロップ（CapEff = 0）

カスタムBPF（Berkeley Packet Filter）プログラムが以下のパスで実行：
```
/usr/local/lib/node_modules_global/lib/node_modules/@anthropic-ai/sandbox-runtime/vendor/seccomp/arm64/unix-block.bpf
```

---

## ネットワークプロキシアーキテクチャ

すべてのネットワークトラフィックはローカルトンネルを経由してプロキシされます。

`ocat`プロセスがUnixソケットを通じてトラフィックをホストに転送：

| プロトコル | ソケットパス |
|-----------|-------------|
| **HTTP** | `/tmp/claude-http-*.sock` |
| **SOCKS** | `/tmp/claude-socks-*.sock` |

---

## ファイルシステムレイアウト

### セッションディレクトリ構造

BindFSを使用して、制御された権限でホストファイルシステムをマッピング：

| マウントポイント | 説明 |
|-----------------|------|
| `/sessions/brave-loving-maxwell/mnt/.skill` | ホストディスク（927GB利用可能） |
| `/sessions/brave-loving-maxwell/mnt/output` | ユーザーのワークスペースフォルダ |
| `/sessions/brave-loving-maxwell/mnt/upload` | アップロードされたファイル |
| `/sessions/brave-loving-maxwell/mnt/.claude` | 設定ファイル |

---

## インストール済みソフトウェア

### 開発ツール

環境には約**1,201パッケージ**が含まれています。

**注意**: Go、Rust、Dockerはこの環境では利用できません。

### Snapパッケージ

| パッケージ | バージョン |
|-----------|-----------|
| core20 | 2683, 2690 |
| lxd | 36562 |
| snapd | 25585, 25939 |

---

## プロセスアーキテクチャ

### 実行中のプロセス

メインのClaudeプロセスは`claude-opus-4-5-20251101`モデルで動作し、以下のツールにアクセス可能：

- Task
- Bash
- Glob
- Grep
- Read
- Edit
- Write
- その他

### MCP（Model Context Protocol）サーバー

2つのMCPサーバーが設定されています：

1. **Claude in Chrome** - ブラウザ自動化機能
2. **b89c1e3a-f5c6-4dec-9d8a-0b3db0a78353** - Cloudflare統合

---

## ユーザーと権限

### 現在のユーザー

| 項目 | 値 |
|------|-----|
| **ユーザー名** | brave-loving-maxwell |
| **UID/GID** | 1002:1002 |
| **ホームディレクトリ** | /sessions/brave-loving-maxwell |
| **シェル** | /bin/bash |

### 権限モデル

- ユーザーはゼロケイパビリティで実行
- NoNewPrivsフラグで権限昇格を防止
- Seccompフィルターで利用可能なシステムコールを制限
- ネットワークアクセスは制御されたプロキシ経由のみ

---

## セキュリティ分析

### 強み

| セキュリティ機能 | 説明 |
|-----------------|------|
| **多層分離** | 名前空間分離、seccompフィルタリング、ケイパビリティドロップの組み合わせ |
| **ネットワーク制御** | すべてのトラフィックがプロキシ経由で監視可能 |
| **エフェメラルセッション** | ワークスペースフォルダを除き、タスク間でファイルシステムがリセット |
| **ルートアクセスなし** | ユーザーには昇格された権限がない |
| **Die-with-parent** | セッション終了時のクリーンアップを保証 |

---

## 結論

このコンテナ環境は、AI支援コンピューティングのために慎重に設計されたサンドボックスです。機能性（完全な開発ツールチェーン、ファイル操作、ネットワークアクセス）とセキュリティ（多層分離、権限制限、監視可能なネットワーク）のバランスを取っています。

この環境はClaude Codeエージェント向けに特化して最適化されており、コード実行、ファイル作成、Webアクセスに必要なツールを提供しながら、ホストシステムと他のユーザーを保護するための強力な分離境界を維持しています。
