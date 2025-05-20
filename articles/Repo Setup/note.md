---
title: "Repo Setup"
source: "https://docs.devin.ai/onboard-devin/repo-setup"
author:
  - "Cognition AI"
published: 2025-04-24
created: 2025-05-20
description: |
  Devinのワークスペースを設定するための包括的ガイド。リポジトリのセットアップ、環境構成、トラブルシューティングなど、Devinを効果的に利用するための重要な手順を解説しています。
tags:
  - "Devin"
  - "リポジトリ設定"
  - "環境構成"
  - "開発環境"
  - "AI開発ツール"
---
# Devinのリポジトリセットアップガイド

Devinは各セッション開始時に仮想マシンのスナップショットを読み込みます。最も効果的に利用するためには、このスナップショットに作業したいリポジトリやコードベースに必要なツール・依存関係をすべて含める必要があります。これにより、Devinは毎回環境設定をする代わりにコード作成に集中できます。

## リポジトリのセットアップ

1. まず、[Settings > Integrations](https://app.devin.ai/settings/integrations)でDevinがリポジトリにアクセスできるようにします
2. [GitHub Integration Guide](https://docs.devin.ai/integrations/gh)を参照してください
3. [Settings > Devin's Workspace](https://app.devin.ai/workspace)に移動し、対象リポジトリをクリック

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/quickstart/workspace-setup.png)

組み込みのVS Codeを使用してDevinの仮想マシンを編集できます。各リポジトリは`~/repos`以下の独自ディレクトリに格納されます。これらのディレクトリは移動・削除しないでください。

セットアップが完了すると、仮想マシンのスナップショットが保存され、今後のセッションはこのスナップショットから開始されます。

![](https://www.youtube.com/watch?v=fgSzneNlpZs)

すべての手順を完了したら「finish」をクリックします。コマンドの検証とスナップショットの保存には数分かかることがあります。

リポジトリに`.gitignore`ファイルの設定を推奨します。

## 設定例

### 異なるリポジトリで自動的に環境を設定する

2025年4月24日以降にサインアップしたチームは、すでに`~/.bashrc`に`custom_cd`セクションが設定されています。以下のように自分のリポジトリ用に更新できます：

```bash
# ~/.bashrc に追加
function custom_cd() {
  builtin cd "$@" || return
  
  if [[ "$PWD" == */repos/node18* ]]; then
    nvm use 18
  elif [[ "$PWD" == */repos/node20* ]]; then
    nvm use 20
  fi
}

alias cd=custom_cd
```

これにより、`node18`リポジトリでは`nvm use 18`、`node20`リポジトリでは`nvm use 20`が自動実行されます。

### 環境変数の設定

`direnv`を使用して環境変数を管理する方法：

```bash
# direnvのインストール
curl -sfL https://direnv.net/install.sh | bash

# ~/.bashrcに追加
eval "$(direnv hook bash)"
```

リポジトリのルートに`.envrc`ファイルを作成：

```bash
# .envrc
export API_KEY=your_api_key
export DEBUG=true
```

`direnv allow`を実行して環境変数を読み込みます。`.envrc`は`.gitignore`に追加することを推奨します。

### システムPATHにディレクトリを追加

```bash
# ~/.bashrcに追加
export PATH="$HOME/bin:$PATH"
```

## ウェブサイトへのログイン

リポジトリセットアップ中にブラウザタブを使用して、Devinに操作させたいウェブサイトにログインできます。セッションクッキーはDevinのワークスペースに保存されます。頻繁にタイムアウトするサイトの場合は、[Secrets](https://docs.devin.ai/product-guides/secrets)ダッシュボードで認証情報を設定することを推奨します。

## トラブルシューティング

### コマンドが検証されない場合

1. 実行可能ファイルのパスを確認（絶対パスを使用するか、システムPATHに追加）
2. 必要なツールと依存関係がインストールされているか確認
3. コマンドが正しいディレクトリで実行されているか確認
4. 正しい言語バージョンを使用しているか確認
5. `~/.bashrc`を適切に変更する

### コマンドが手動実行では動作する場合

新しいターミナルでコマンドを実行してみてください。必要に応じて`bashrc`を編集してください。コマンドは5分後にタイムアウトします。

### Homebrewがパスワードを要求する場合

Linux Homebrewのバグです。代わりに`CI=1 brew install <package>`を実行してください。

### セッションでlint/testコマンドが実行できない

ターミナル出力を確認し、エラーを特定してください。必要に応じてリポジトリセットアップを再度行います。

### git pullステップが動作しない

リポジトリとサブモジュールへのアクセス権を確認してください。権限問題がある場合は[GitHub統合ドキュメント](https://docs.devin.ai/integrations/gh)を参照してください。

## 編集が必要な場合

[Settings > Devin's Workspace](https://app.devin.ai/workspace)で既存のリポジトリを編集したり、新しいリポジトリを追加したりできます。

既存のリポジトリを編集するには、「edit」→「Set up in VSCode」をクリックします。

![Devin](https://mintlify.s3.us-west-1.amazonaws.com/cognitionai/images/edit_setup.png)

Settings > Devin's Workspace > Danger Zoneから「Reset machine setup」オプションを使用して、Devinのマシン状態を完全にリセットすることも可能です。

## 完了

おめでとうございます！Devinのオンボーディングが完了し、一緒に構築を開始できます。[初回セッション](https://docs.devin.ai/get-started/first-run)を開始しましょう。Devinは以下の場合に最も効果を発揮します：

- 進捗確認方法をDevinに伝える
- 大きなタスクを分解する
- 詳細な要件を事前に共有する
- 複数のセッションを並行して実行する

サポートが必要な場合は、[support@cognition.ai](https://docs.devin.ai/onboard-devin/)までメールでお問い合わせください。
