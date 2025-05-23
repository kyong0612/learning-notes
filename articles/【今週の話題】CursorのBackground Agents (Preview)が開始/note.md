---
title: "【今週の話題】CursorのBackground Agents (Preview)が開始"
source: "https://blog.lai.so/cursor-background-agent/?ref=laiso-newsletter"
author:
  - "laiso"
published: 2025-05-20
created: 2025-05-23
description: |
  CursorのBackground Agents（Preview）機能の詳細解説。リモートUbuntu VM上で動作するコーディングエージェントで、
  GitHubリポジトリと連携し、並列開発作業を可能にする。Cursor版Devinとも呼べる革新的な機能。
tags:
  - "cursor"
  - "ai-coding"
  - "background-agents"
  - "development-tools"
  - "remote-vm"
  - "github-integration"
---

# CursorのBackground Agents (Preview)が開始

## 概要

この機能は、Cursor社がホストするリモートの仮想マシン（Ubuntu VM）上で動作するコーディングエージェントです。Cursor版Devinといえます。

![Background Agent概要図](https://blog.lai.so/content/images/thumbnail/background-agent.png)

Background Agentsが編集するコードは、実行時にGitHubからクローンしたものです。そのため、ローカルのソースコードを編集しても、Background Agents側には一切反映されません。Cursorの親ウィンドウ内に、リモート専用のCursor子ウィンドウが開き、これを複数同時に立ち上げることができます。

![CursorのBackground Agents画面構成](https://blog.lai.so/content/images/2025/05/CleanShot-2025-05-20-at-19.04.17@2x.png)

*青枠がCursorの親Windowで赤枠のみがBackground Agents*

## 利用方法

### 必要な前提条件

1. **Cursorのバージョン**: 0.50以上にアップデート
2. **Beta設定**: Background Agentを有効化
3. **プライバシーモード**: 無効化が必須
   - Background AgentではVM上でソースコードをチェックアウトして開発を行うため
4. **GitHubリポジトリ**: ワークスペースがGitHubのリポジトリである必要
5. **GitHub連携**: GitHubアカウントをCursorに接続し、リポジトリアクセス許可

### セットアップの注意点

- 条件を満たしても、機能が有効化されるまで時間がかかる場合あり
- 筆者の環境では実際に利用可能になるまで1日ほど必要
- VM上で行ったコード編集の結果をGitHub上のブランチにプッシュし、プルリクエストを作成可能

![新しいエージェント生成](https://blog.lai.so/content/images/2025/05/image-3.png)

**新しいエージェントを生成**: `Cmd + '` (または `Ctrl + '`)

## VM環境の詳細

### システム仕様

- **OS**: Ubuntu 25.04（x86_64）
- **インフラ**: AWS EC2 US-west-1リージョン
- **インスタンスタイプ**: r7i.4xlarge
- **カーネル**: Linux cursor 6.8.0-1024-aws

### プリインストールされた開発環境

**標準インストール済み**:

- LLVMとClangツールチェイン
- OpenJDK
- Perl
- Python
- Go
- Node.js（NVM経由）
- XvfbとXデスクトップ環境

**デフォルトで含まれていない**:

- Ruby
- Rust
- PHP

※ 必要に応じて自分でセットアップが可能

### 特殊機能

- **デスクトップアプリサポート**: [Xデスクトップアプリ(xclock)の起動に成功](https://x.com/laiso/status/1924779059286049010?ref=blog.lai.so)
- **Androidエミュレータ**: 起動してデバッグ可能な可能性
- **cursor-server**: vscode-server改めcursor-serverが起動し、ローカルのCursorから接続してクラウドIDEとして使用

### 技術的な差別化

DevinやGitHub Copilotがブラウザ上で実行するのに対し、Cursorはアプリ内に閉じ込めている点が特徴的です。

## AI モデルと料金

### 対応モデル

- **対応**: Max系のみ
- **推奨**: o3モデル（Cursorの説明による）
- **特徴**: ロングコンテキスト処理をサーバー連携で拡張
- **用途**: 長時間タスクに向いている

### 料金体系

- **現在**: モデル呼び出しトークン量に応じた課金
- **将来予想**: 正式リリース時にはDevinのようなCPU時間料金も含まれる可能性
- **コンピュートコスト**: 相当なコストが発生していると推定

## セットアップ方法

### 環境設定ファイル

設定情報は `.cursor/environment.json` ファイルに保存して再利用可能です。

### プロビジョニング方法

**方法1: 手動セットアップ**

- シェルにログインして手動でコマンド実行
- 環境を整えてスナップショットを作成
- その時点での環境を使い回し

**方法2: Dockerfile活用**

- DockerfileをRunbookとして使用
- VM環境を自動構築
- 実際のコンテナビルドではなく、実行手順を流用
- ベースイメージは `public.ecr.aws` にホスト

### environment.jsonの主要項目

- **install**: VMごとの初期化スクリプト
- **start**: マシン起動後に実行するプログラム
- **terminals**: バックグラウンドでtmuxセッションとして起動するプロセス（watch系コマンドなど）

![environment.json設定例](https://blog.lai.so/content/images/2025/05/image-4.png)

### 参考資料

詳細な環境仕様については、[コマンド実行結果のGist](https://gist.github.com/laiso/4d802d0a936427780486c63f67e52826?ref=blog.lai.so)および[公式ドキュメント](https://docs.cursor.com/background-agent?ref=blog.lai.so#the-environment-json-spec)を参照してください。

## 制限事項

- **OS制限**: Linux（Ubuntu）環境のみ対応
- **非対応開発**: WindowsアプリやiOSアプリ開発など、Linux以外のOSを前提とした開発
- **プライバシーモード**: 現在は無効化が必須
- **待機時間**: 機能有効化まで時間がかかる場合あり
