---
title: "ターミナルを使う人は、とりあえず「mise」を入れておく時代。　　・・・を夢見て。"
source: "https://zenn.dev/dress_code/articles/a99ff13634bbe6"
author:
  - "ぽんこつエンジニア"
published: 2025-06-27
created: 2025-06-30
description: |
  miseは「dev tools, env vars, task runner」と説明されるRust製のCLIツールです。この記事では、特に便利なタスクランナー、パッケージ管理、環境変数管理の機能を紹介し、ターミナル作業の生産性を向上させる方法を解説します。
tags:
  - "mise"
  - "CLI"
  - "Rust"
  - "Node.js"
  - "生産性向上"
---
## 「mise」ってすごい使いやすいんですよ

**miseとは** GitHubリポジトリの説明書きに **「dev tools, env vars, task runner」** と書かれているrust製のcliツールです。

この記事ではmiseヘビーユーザーの私が推したい生産性の上がる機能を紹介するので、miseを初めて知った人も、知ってるけど使ってないって人も、ぜひ一読してみてください。

ちなみに最近話題になりやすいAIツールのcliパッケージなどもmiseで管理できたりします。

- [GitHub - jdx/mise](https://github.com/jdx/mise)
- [mise-en-place.dev](https://mise.jdx.dev/)

## 推したい機能はこれです

### ① タスクランナー（私が推したい機能No.1）

miseで最も便利な機能としてタスクランナーが紹介されています。これは `mise.toml` によく使うスクリプトをタスクとして定義し、 `mise run` コマンドで簡単に実行できる機能です。

**便利なところ**

- `mise run` を実行すると、定義済みのタスクが説明付きで一覧表示され、カーソルキーで選択して実行できます。これにより、コマンドを記憶する手間が省けます。
- ![mise run](https://storage.googleapis.com/zenn-user-upload/33ab26bdc1d9-20250626.gif)
  *mise runコマンドでタスクを実行する*
- 設定ファイルに `confirm = "確認メッセージ"` を追加することで、実行前に確認プロンプトを挟むことができ、危険なタスクの安全性を高められます。
- ![](https://storage.googleapis.com/zenn-user-upload/ed384f535be2-20250626.gif)
  *危険なタスクは実行前に確認できる*

**設定ファイルの例 (`~/.config/mise/config.toml`)**

```toml
[tasks.random-member]
description = "メンバーをランダムに選ぶ"
run = "shuf -n 1 -e Alice Bob Charlie Dave"

[tasks.aws-sso-login]
alias = "al"
description = "SSOでログインして、現在のセッションに認証情報を設定する"
run = "aws sso login"

[tasks.gh-list-deploy]
description = "デプロイの実行履歴を表示する"
run = """
gh run list \
    --repo firstcontributions/first-contributions \
    --limit 10
"""

[tasks.dangerous-task]
confirm = "全部消えます。本当に実行するんですか？"
description = "危ないやつ。"
run = "rm -rf /*"
```

### ② パッケージ管理（私が推したい機能No.2）

`nodenv`, `pyenv`, `asdf` などのツールと同様の機能を持ち、`.node-version` ファイルも解釈してくれるため、既存の環境からスムーズに移行できます。`mise.toml` でランタイムやパッケージを管理します。

**便利なところ**

- Node.jsのパッケージやPythonのパッケージなどを一元管理できます。`gemini-cli` や `claude-code` といったツールも`mise`でインストール・管理可能です。
- これにより、`npm install -g` や `pip install` でグローバル環境が汚染されるのを防ぎます。

**使用例**

```bash
# Node.jsのインストール
$ mise use -g node@24

# npmパッケージのインストール
$ mise use -g npm:@google/gemini-cli
$ mise use -g npm:@anthropic-ai/claude-code
```

**設定ファイルの例**

```toml
[tools]
node = "24"
"npm:@anthropic-ai/claude-code" = "latest"
"npm:@google/gemini-cli" = "latest"
```

### ③ 環境変数管理

`dotenv` や `direnv` のように、`mise.toml` が存在するディレクトリ配下で自動的に環境変数を読み込む機能です。

**設定ファイルの例**

```toml
[env]
AWS_REGION = "ap-northeast-1"
NODE_AUTH_TOKEN = "gho_abcdefghijklmnopqrstuvwxyz1234567890"
_.file = "./.env" # .envファイルも読み込める
```

## 簡単すぎるインストール方法

以下のコマンドで簡単にインストールできます。

```bash
curl https://mise.run | sh
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
mise version
```

`apt`, `yum`, `brew` など、他のパッケージマネージャーでのインストール方法も提供されています。

`mise.toml` は、グローバル設定 (`~/.config/mise/config.toml`) とローカル設定 (`./mise.toml`) の両方で利用でき、プロジェクトごとに設定を共有することも可能です。

## おわり

著者は `mise` を利用して、AWS関連のスクリプトやポートフォワーディング、curlコマンドなどをタスクランナーで管理しており、その利便性を強調しています。パッケージ管理も `mise` に寄せることで、`mise list` コマンド一つでインストール済みのツールを確認できる点を評価しています。

![mise list](https://storage.googleapis.com/zenn-user-upload/2024729f0e30-20250626.png)
*mise listコマンドでパッケージの一覧を見れる*
