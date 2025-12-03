---
title: "cachix/devenv: Fast, Declarative, Reproducible, and Composable Developer Environments using Nix"
source: "https://github.com/cachix/devenv"
author:
  - "Cachix"
published: 2022-01-01
created: 2025-12-03
description: |
  devenvはNixを活用した高速・宣言的・再現可能・構成可能な開発環境ツール。100ms以下の環境起動、50以上の言語サポート、100,000以上のパッケージ、データベースやキャッシュなどの各種サービス統合を提供し、チーム全体で一貫した開発環境を実現する。
tags:
  - nix
  - developer-tools
  - devenv
  - developer-environment
  - reproducible-builds
---

## 概要

**devenv**は、Nixを使用して高速・宣言的・再現可能・構成可能な開発環境を提供するオープンソースツール。従来の開発環境セットアップの複雑さを解消し、チーム全体で一貫した環境を簡単に共有できる。

- **GitHub**: <https://github.com/cachix/devenv>
- **公式サイト**: <https://devenv.sh>
- **ライセンス**: Apache-2.0
- **最新バージョン**: v1.11.2 (2025年11月27日時点)
- **スター数**: 6,000+
- **コントリビューター**: 239名

---

## 主要な特徴

### 1. 超高速な環境起動（キャッシング機能）

```bash
$ time devenv shell -- exit
• Building shell ...
real    0m4.832s

$ time devenv shell -- exit
• Using cached shell.
real    0m0.047s  # 100ms以下！
```

- **精密なNix評価キャッシング**: 評価中にアクセスされた全ファイルを自動検出
- **スマート無効化**: 追跡されたファイルが変更された時のみキャッシュを自動的に無効化
- **ゼロ設定**: セットアップ不要、デーモンやファイル監視も不要

### 2. シンプルなJSON風言語

`devenv init`を実行すると`devenv.nix`が生成される：

```nix
{ pkgs, lib, config, inputs, ... }:

{
  # 環境変数
  env.GREET = "devenv";

  # パッケージ
  packages = [ pkgs.git ];

  # スクリプト定義
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  # シェル起動時の初期化
  enterShell = ''
    hello
    git --version
  '';

  # テスト定義
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';
}
```

### 3. 50以上のプログラミング言語サポート

各言語に対してLSPサーバー、フォーマッター、リンター、コンパイラなどの一般的なツールを同梱。

**対応言語の例**:

- Python, Rust, Go, JavaScript/TypeScript, Ruby, PHP
- Elixir, Erlang, Haskell, OCaml, Scala
- C, C++, Zig, Nim, Crystal
- その他40以上の言語

```nix
{ pkgs, config, ... }: {
  languages.python = {
    enable = true;
    version = "3.11";
    venv.enable = true;
    uv.enable = true;
  };

  languages.rust = {
    enable = true;
    channel = "nightly";
    targets = [ "wasm32-unknown-unknown" ];
  };
}
```

### 4. 100,000以上のパッケージ

- Linux/macOS対応
- x64/ARM64アーキテクチャ対応
- WSL2での動作サポート

### 5. プロセス管理

`devenv up`で宣言的に定義したプロセスを起動：

```nix
{ pkgs, ... }: {
  packages = [ pkgs.cargo-watch ];

  processes = {
    cargo-watch.exec = "cargo watch -x run";
  };
}
```

デフォルトで[process-compose](https://github.com/F1bonacc1/process-compose)を使用し、ログ検査やプロセス再起動（Ctrl+R）が可能。

### 6. 多数のサービス統合

PostgreSQL, Redis, MySQL, RabbitMQ, MinIO, Caddy, Elasticsearch, Prometheus等の事前設定済みサービス：

```nix
{ pkgs, ... }: {
  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15;
    initialDatabases = [{ name = "mydb"; }];
    extensions = extensions: [
      extensions.postgis
      extensions.timescaledb
    ];
  };
}
```

**対応サービス一覧**:

- データベース: PostgreSQL, MySQL, MongoDB, CockroachDB, CouchDB, ClickHouse
- キャッシュ: Redis, Memcached
- メッセージング: RabbitMQ, Kafka, NATS
- 検索: Elasticsearch, OpenSearch, Meilisearch, Typesense
- Webサーバー: Nginx, Caddy, Varnish
- その他: Keycloak, Vault, MinIO, Prometheus等

### 7. スクリプトとタスク

```nix
{ pkgs, ... }: {
  scripts.build = {
    exec = "yarn build";
    packages = [ pkgs.yarn ];
  };

  tasks."myapp:build" = {
    exec = "build";
    before = [ "devenv:enterShell" ];
  };

  # git commit時とdevenv testで実行
  git-hooks.hooks = {
    black.enable = true;
    generate-css = {
      enable = true;
      name = "generate-css";
      entry = "build";
    };
  };
}
```

### 8. コンテナ生成

開発環境からコンテナを生成し、ビルド/コピー/実行が可能：

```bash
devenv container build processes
devenv container copy processes
devenv container run processes
```

### 9. モノレポ/ポリレポ対応

```yaml
# devenv.yaml
inputs:
  myorg-devenv:
    url: github:myorg/myorg-devenv
imports:
  - ./frontend
  - ./backend
  - myorg-devenv/shared-service
```

### 10. プロファイル

異なるワークフロー向けに環境の一部を選択的にアクティベート：

```nix
{ pkgs, config, ... }: {
  profiles = {
    backend.module = {
      services.postgres.enable = true;
      services.redis.enable = true;
    };

    frontend.module = {
      languages.javascript.enable = true;
      processes.dev-server.exec = "npm run dev";
    };

    fullstack.extends = [ "backend" "frontend" ];
  };
}
```

```bash
devenv --profile backend shell
devenv --profile fullstack up
```

### 11. シークレット管理（SecretSpec）

宣言的なシークレット管理で`.env`ファイル不要：

```toml
# secretspec.toml
[project]
name = "my-app"

[profiles.default]
KEYCLOAK_ADMIN_PASSWORD = {
  description = "Keycloak admin password",
  required = true,
  as_path = true
}

[profiles.development]
KEYCLOAK_ADMIN_PASSWORD = { default = "admin" }
```

対応プロバイダー: システムKeychain, 1Password, LastPass, dotenv, 環境変数

### 12. アドホック環境

設定ファイルなしで一時的な環境を作成：

```bash
# 即座にPython環境を作成
devenv --option languages.python.enable:bool true \
       --option packages:pkgs "ncdu git ripgrep" \
       shell

# クイックElixir REPL
devenv -O languages.elixir.enable:bool true shell iex
```

---

## CLIコマンド一覧

| コマンド | 説明 |
|---------|------|
| `devenv init` | devenv.yaml, devenv.nix, .gitignore, .envrcを初期化 |
| `devenv shell` | 開発環境をアクティベート |
| `devenv up` | プロセスをフォアグラウンドで起動 |
| `devenv test` | テストを実行 |
| `devenv search <NAME>` | nixpkgsでパッケージとオプションを検索 |
| `devenv update` | devenv.yamlの入力からdevenv.lockを更新 |
| `devenv gc` | 未使用の環境を削除（ガベージコレクション） |
| `devenv container` | コンテナのビルド/コピー/実行 |
| `devenv generate` | AIを使用してdevenv.yamlとdevenv.nixを生成 |
| `devenv repl` | 対話的環境でdevenv設定を検査 |
| `devenv mcp` | AIアシスタント用のModel Context Protocolサーバーを起動 |

---

## インストール方法

### 1. Nixをインストール

```bash
# Linux
sh <(curl -L https://nixos.org/nix/install) --daemon

# macOS（実験的インストーラー推奨）
curl -L https://github.com/NixOS/experimental-nix-installer/releases/download/0.27.0/nix-installer.sh | sh -s -- install

# WSL2
sh <(curl -L https://nixos.org/nix/install) --no-daemon
```

### 2. devenvをインストール

```bash
# 初心者向け
nix-env --install --attr devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable

# Nixプロファイル使用
nix profile install nixpkgs#devenv
```

### 3. 初期セットアップ

```bash
$ devenv init
• Creating .envrc
• Creating devenv.nix
• Creating devenv.yaml
• Creating .gitignore
```

---

## インテグレーション

- **エディタ**: VSCode, PhpStorm/IntelliJ/PyCharm, Zed
- **CI/CD**: GitHub Actions
- **コンテナ**: Codespaces, devcontainer
- **ツール**: direnv（自動シェルアクティベーション）, treefmt, Difftastic, Delta
- **AI**: Claude Code統合

---

## 技術スタック

| 言語 | 割合 |
|-----|------|
| Rust | 54.2% |
| Nix | 42.4% |
| Shell | 3.1% |
| Dockerfile | 0.2% |
| Python | 0.1% |

---

## ロードマップ

devenvは現在、Nix実装を[Tvix](https://tvix.dev/)に移行中。Tvixはより高速な評価と改善されたキャッシングを提供する予定。

---

## リソース

- [公式ドキュメント](https://devenv.sh)
- [Getting Started](https://devenv.sh/getting-started/)
- [オプションリファレンス](https://devenv.sh/reference/options/)
- [例題集](https://github.com/cachix/devenv/tree/main/examples)
- [Discord](https://discord.gg/naMgvexb6q)
- [ブログ](https://devenv.sh/blog/)
