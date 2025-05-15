---
title: "Background Agents"
source: "https://docs.cursor.com/background-agent"
author:
  - "[[Cursor]]"
published:
created: 2025-05-15
description: "How to use background agents to parallelize your work."
tags:
  - "clippings"
  - "Cursor"
  - "AI"
  - "development-tool"
  - "background-agent"
---
CursorのBackground Agentsは、現在プレビュー版として一部ユーザーに提供されている機能で、非同期でコードの編集や実行をリモート環境で行うエージェントを起動できます。ユーザーはいつでもエージェントのステータス確認、フォローアップ、または操作の引き継ぎが可能です。

## 主な特徴

* **非同期処理**: バックグラウンドでタスクを実行し、ユーザーは他の作業を並行して進められます。
* **リモート環境**: 専用のリモートマシン上でコードの編集・実行が行われます。
* **対話性**: 進行状況の確認や、エージェントへの追加指示、手動での操作引き継ぎが可能です。

## 利用方法

1. `Cmd + '` (macOS) または `Ctrl + '` (Windows/Linux) でBackground Agentsのリストを開き、新しいエージェントを起動します。
2. プロンプトを送信後、`Cmd + ;` (macOS) または `Ctrl + ;` (Windows/Linux) でステータスを確認し、エージェントが動作しているマシンにアクセスします。

現時点では、プライバシーモードを無効にしているユーザーのみが利用可能です。プライバシーモードでの対応も進行中です。

## フィードバック

開発チームは、Discordの `#background-agent` チャンネルや、メールアドレス `background-agent-feedback@cursor.com` でフィードバックを募集しています。バグ報告、機能リクエスト、アイデアなどが歓迎されています。

## セットアップ

リポジトリで初めてBackground Agentsを使用する際には、マシンのセットアップが必要です。これには、リポジトリのクローンや依存関係のインストールなどが含まれ、複雑なリポジトリの場合は1時間程度かかることもあります。

最適なエージェントパフォーマンスのためには、リンターが正常に動作し、アプリケーションやテストが実行できる状態にマシンを完全にセットアップすることが重要です。

セットアップ情報は `.cursor/environment.json` ファイルで定義され、リポジトリにコミットするか、ユーザー専用にプライベートに保存できます。

設定項目は以下の通りです。

* **GitHub接続**: リポジトリのクローンと変更のプッシュのために、GitHubリポジトリへの読み書き権限が必要です（将来的にはGitLab、BitBucketなどもサポート予定）。
* **ベース環境**: エージェントが実行されるマシンの基本環境を定義します。
  * **対話的セットアップ (デフォルト)**: Ubuntuベースイメージのマシンにリモートアクセスし、必要な依存関係を手動でインストール後、スナップショットを作成します。このスナップショットが以降のエージェントのディスク状態として使用されます。
  * **宣言的セットアップ**: Dockerfileを使用してディスク状態を定義します。プロジェクトファイルは`COPY`せず、GitHubから直接クローンされます。Dockerfileはツールやコンパイラの設定のみを担当します。
* **メンテナンスコマンド (`install`)**: 新しいエージェントのマシンセットアップ時やブランチ切り替え時に実行されるコマンドです（例: `npm install`, `bazel build`）。ディスク状態はこのコマンド実行後にキャッシュされ、高速な起動を実現します。
* **スタートアップコマンド (`start`, `terminals`)**: `install` コマンド実行後、マシン起動時に実行されるコマンドです。
  * `start`: Dockerデーモンの起動など、エージェント実行中に必要なプロセスを開始します（多くの場合スキップ可能）。
  * `terminals`: アプリケーションコード用のターミナルを`tmux`セッションで実行します（例: `npm run watch`）。

### `.cursor/environment.json` の仕様

ファイルの具体的な構造例はドキュメントに示されており、正式なスキーマは [こちら](https://www.cursor.com/schemas/environment.schema.json) で定義されています。

```json
{
  "snapshot": "snapshot-id",
  "user": "ubuntu",
  "install": "./.cursor/install.sh",
  "start": "sudo service docker start",
  "terminals": [
    {
      "name": "vscode",
      "command": "cd vscode && nvm use && npm run watch",
      "description": "Watches the vscode/src folder for changes and recompiles when saved."
    },
    {
      "name": "code.sh",
      "command": "sleep 120 && cd vscode && nvm use && ./scripts/code.sh",
      "description": "Runs the vscode app, visible on localhost:6080 using web VNC (noVNC)."
    }
  ]
}
```

## モデル

Background Agentsでは、[Max Mode](https://docs.cursor.com/context/max-mode)互換モデルのみが利用可能です。料金はトークン使用量に基づいており、将来的には開発環境のコンピューティング料金も発生する可能性があります。

## セキュリティ

Background Agentsは、既存のCursor機能と比較して攻撃対象領域が広くなります。

主な注意点は以下の通りです。

1. **GitHub権限**: GitHub Appにリポジトリへの読み書き権限を付与する必要があります。
2. **コード実行環境**: ユーザーのコードはCursorのAWSインフラストラクチャ内で実行されます。
3. **監査状況**: インフラはまだ第三者による監査を受けていませんが、セキュリティを優先して構築されています。
4. **コマンド自動実行とプロンプトインジェクション**: エージェントはコマンドを自動実行するため、悪意のある指示（例: Google検索結果からの不正な指示）に従い、コードを外部に流出させるプロンプトインジェクション攻撃の可能性があります（可能性は低いとされています）。
5. **データ収集**: プライバシーモードが無効の場合、製品改善のためにプロンプトや開発環境が収集・保存されます。
6. **シークレットの保存**: 開発環境に必要なシークレットは、データベースにKMSで暗号化されて保存されます。
