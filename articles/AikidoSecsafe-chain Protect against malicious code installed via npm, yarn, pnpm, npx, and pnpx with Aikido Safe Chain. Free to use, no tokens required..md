---
title: "AikidoSec/safe-chain: Protect against malicious code installed via npm, yarn, pnpm, npx, and pnpx with Aikido Safe Chain. Free to use, no tokens required."
source: "https://github.com/AikidoSec/safe-chain"
author:
  - "[[AikidoSec]]"
published:
created: 2026-04-01
description: "Aikido Safe Chainは、npm・yarn・pnpm・pip・uvなどのパッケージマネージャ経由でインストールされるマルウェアをリアルタイムでブロックする無料のセキュリティツール。ローカルプロキシサーバーとして動作し、Aikido Intelの脅威情報と照合してパッケージのダウンロード前に悪意のあるコードを検出・遮断する。CI/CDパイプラインにも対応。"
tags:
  - "clippings"
  - "Security"
  - "Supply Chain Attack"
  - "npm"
  - "Python"
  - "Malware Detection"
  - "CI/CD"
  - "DevSecOps"
---

## 概要

**Aikido Safe Chain** は、AikidoSec が開発したオープンソースのサプライチェーンセキュリティツール。npm、yarn、pnpm、bun、pip、uv、poetry など主要なパッケージマネージャ経由でインストールされるパッケージに含まれるマルウェアを、リアルタイムでブロックする。トークン不要・無料で利用可能。

主な特徴：

- **マルウェアブロック**: 開発者のローカル環境とCI/CDパイプラインの両方を保護
- **48時間ルール**: 公開後48時間未満のパッケージを自動的に抑制（設定変更可能）
- **トークンレス**: 認証不要、ビルドデータの外部共有なし
- **幅広いエコシステム対応**: JavaScript（npm/yarn/pnpm/bun）およびPython（pip/uv/poetry/pipx）

## 主要なトピック

### 対応パッケージマネージャ

| エコシステム | パッケージマネージャ |
|---|---|
| **JavaScript/Node.js** | npm, npx, yarn, pnpm, pnpx, bun, bunx |
| **Python** | pip, pip3, uv, poetry, pipx |

### 仕組み：マルウェアブロック

Aikido Safe Chain は**軽量なローカルプロキシサーバー**として動作し、パッケージマネージャのダウンロードリクエストをインターセプトする。

1. パッケージマネージャのコマンド実行時、全ダウンロードがローカルプロキシを経由
2. **[Aikido Intel](https://intel.aikido.dev/?tab=malware)**（オープンソース脅威インテリジェンス）にリアルタイムで照合
3. マルウェアが検出された場合、**ダウンロード前に遮断**（ディープ依存関係も含む）

### 仕組み：最小パッケージ年齢（Minimum Package Age）

新しく公開されたパッケージにはまだ検出されていない脅威が含まれるリスクが高いため、デフォルトで**48時間未満のパッケージを抑制**する。

- **npm系**: パッケージメタデータから新しすぎるバージョンを除外 + キャッシュされた新規リリースリストによるダイレクトリクエストのブロック
- **Python系**: キャッシュされた新規リリースリストによるダイレクトリクエストのブロック

設定方法（優先度順）：

1. **CLIフラグ**: `--safe-chain-minimum-package-age-hours=48`
2. **環境変数**: `SAFE_CHAIN_MINIMUM_PACKAGE_AGE_HOURS=48`
3. **設定ファイル**: `~/.safe-chain/config.json` で `minimumPackageAgeHours` を指定

信頼済みパッケージの除外も可能（`@scope/*` でスコープ全体を除外）。

### シェル統合

シェルエイリアスを設定し、既存のパッケージマネージャコマンドを透過的にラップする。

対応シェル：**Bash**, **Zsh**, **Fish**, **PowerShell**, **PowerShell Core**

### インストール

ワンラインインストーラーで導入可能。

**Unix/Linux/macOS:**

```shell
curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh
```

**Windows (PowerShell):**

```powershell
iex (iwr "https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.ps1" -UseBasicParsing)
```

インストール後は**ターミナルの再起動が必須**（シェルエイリアスのロードのため）。

検証コマンド：

```shell
npm safe-chain-verify
# 出力: "OK: Safe-chain works!"
```

テスト用マルウェアパッケージ：

```shell
npm install safe-chain-test       # JavaScript
pip3 install safe-chain-pi-test   # Python
```

### CI/CD統合

`--ci` フラグを使用すると、シェルエイリアスの代わりにPATH上の実行可能なshimを設定し、CI/CD環境に最適化される。

```shell
curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh -s -- --ci
```

対応CI/CDプラットフォーム：

- **GitHub Actions**
- **Azure Pipelines**
- **CircleCI**
- **Jenkins**
- **Bitbucket Pipelines**
- **GitLab Pipelines**

**GitHub Actions の例:**

```yaml
- name: Install safe-chain
  run: curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh -s -- --ci

- name: Install dependencies
  run: npm ci
```

### 設定オプション

| 設定項目 | CLIフラグ | 環境変数 | 設定ファイル |
|---|---|---|---|
| ログレベル | `--safe-chain-logging=silent\|normal\|verbose` | `SAFE_CHAIN_LOGGING` | — |
| 最小パッケージ年齢 | `--safe-chain-minimum-package-age-hours=N` | `SAFE_CHAIN_MINIMUM_PACKAGE_AGE_HOURS` | `minimumPackageAgeHours` |
| 年齢チェック除外 | — | `SAFE_CHAIN_MINIMUM_PACKAGE_AGE_EXCLUSIONS` | `minimumPackageAgeExclusions` |
| カスタムレジストリ | — | `SAFE_CHAIN_NPM_CUSTOM_REGISTRIES` / `SAFE_CHAIN_PIP_CUSTOM_REGISTRIES` | `customRegistries` |

カスタムレジストリ設定により、プライベートレジストリからのパッケージもスキャン可能。

## 重要な事実・データ

- **GitHub Stars**: 967（2026年4月時点）
- **デフォルト最小パッケージ年齢**: 48時間
- **対応パッケージマネージャ数**: 13種類（npm, npx, yarn, pnpm, pnpx, bun, bunx, pip, pip3, uv, poetry, pipx + python -m pip）
- **脅威インテリジェンスソース**: [Aikido Intel](https://intel.aikido.dev/?tab=malware)（オープンソース）
- **費用**: 無料、トークン不要、ビルドデータの外部共有なし

## 結論・示唆

### ツールの位置づけ

Aikido Safe Chain は、ソフトウェアサプライチェーン攻撃に対する**開発者ファーストの防御レイヤー**として設計されている。既存のワークフローに透過的に統合されるため、開発体験を損なわずにセキュリティを強化できる。

### 実践的な示唆

- npmやpipなどのパッケージマネージャを日常的に使用する開発者は、ワンラインインストーラーで即座に保護を追加できる
- CI/CDパイプラインへの統合は各主要プラットフォーム向けの設定例が用意されており、導入障壁が低い
- 48時間ルールにより、新規パッケージ公開直後のゼロデイ的サプライチェーン攻撃を軽減できる
- カスタムレジストリ対応により、企業のプライベートレジストリ環境でも利用可能

## 制限事項・注意点

- インストール後に**ターミナルの再起動が必須**（シェルエイリアスの適用のため）
- Python系の最小パッケージ年齢チェックは、npm系と比較して一部の強制モード（メタデータフローでのバージョン抑制）に対応していない
- 48時間ルールにより、公開直後のパッケージが必要な場合は除外設定が必要
- 脅威検出は Aikido Intel のデータベースに依存するため、未知のマルウェアに対する保護には限界がある

---

*Source: [AikidoSec/safe-chain](https://github.com/AikidoSec/safe-chain)*
