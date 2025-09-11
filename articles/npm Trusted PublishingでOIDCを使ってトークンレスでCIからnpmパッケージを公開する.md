---
title: "npm Trusted PublishingでOIDCを使ってトークンレスでCIからnpmパッケージを公開する"
source: "https://efcl.info/2025/09/07/npm-oidc/"
author:
  - "[[azu]]"
published: 2025-09-07
created: 2025-09-11
description: "npm Trusted Publishingが2025年7月31日に一般公開されました。これにより、OpenID Connect (OIDC)を使ってnpmトークンなしでCI/CDからnpmパッケージを公開できるようになりました。"
tags:
  - "npm"
  - "GitHub Actions"
  - "CI/CD"
  - "Security"
  - "OIDC"
---

## 概要

2025年7月31日に一般公開されたnpmの**Trusted Publishing**機能について解説した記事です。この機能により、OpenID Connect (OIDC) を利用して、CI/CD環境から`npm`トークンなしで安全にパッケージを公開できます。

## npm Trusted Publishingとは

npmレジストリとCI/CD環境（GitHub Actionsなど）の間でOIDCベースの信頼関係を確立する仕組みです。

### 従来の問題点

従来の`npm`トークン方式には、以下のようなセキュリティリスクがありました。

- トークンがログなどに露出する可能性
- トークンが漏洩した場合、無効化するまで悪用される
- 手動でのトークンローテーションが必要
- 過剰な権限を持つことが多い

Trusted Publishingは、短時間のみ有効で特定のワークフローに限定された署名付きトークンを使用するため、これらの問題を解決します。

### 対応CI/CD環境

- GitHub Actions
- GitLab CI/CD

---

## 設定方法

設定は2つのステップで行います。

### 1. npmjs.comでTrusted Publisherを設定

npmjs.comのパッケージ設定画面で、CI/CDプロバイダー（GitHub Actionsなど）と以下の情報を設定します。

- **Organization or user** (必須): GitHubのユーザー/組織名
- **Repository** (必須): リポジトリ名
- **Workflow filename** (必須): ワークフローファイル名 (例: `publish.yml`)
- **Environment name** (オプション): GitHub Environmentsを使用する場合

### 2. CI/CDワークフローの設定 (GitHub Actionsの例)

ワークフローファイルに`id-token: write`権限を追加します。これにより、GitHub Actionsがnpmに対して一時的なトークンを発行できるようになります。また、`npm` 11.5.1以降の使用が必須です。

```yaml
name: Publish Package
on:
  push:
    tags:
      - 'v*'

permissions:
  id-token: write  # OIDCに必要
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      # npm 11.5.1以降が必要
      - name: Update npm
        run: npm install -g npm@latest
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - run: npm publish
```

---

## 実際のリリースフロー

単独パッケージとmonorepoでの運用フローが紹介されています。

### 単独パッケージのパターン

リリースフローを以下の2つのワークフローに分割しています。

1. `create-release-pr.yml`: リリースノートを含むPull Requestを自動作成する。
2. `release.yml`: リリースPRがマージされたら、`npm publish`とGitHub Releaseの作成を行う。

この方法により、リリース内容をPRで確認・編集でき、マージをトリガーに安全に公開できます。

#### リリース手順

1. **GitHub Actionsの権限設定**: リポジトリ設定でActionsがPRを作成できるようにする。
2. **ラベル設定**: `Type: Release`ラベルを用意する。
3. **PR作成**: `create-release-pr.yml`を手動実行し、リリースPRを作成する。
    ![create release pr](https://efcl.info/wp-content/uploads/2025/09/07-1757218982.png)
4. **PRレビュー**: 自動生成されたリリースノートを確認・編集する。
    ![release pr](https://efcl.info/wp-content/uploads/2025/09/07-1757219036.png)
5. **マージ**: PRをマージすると`release.yml`が実行される。
6. **完了**: `npm publish`が実行され、PRに結果がコメントされる。
    ![release complete](https://efcl.info/wp-content/uploads/2025/09/07-1757219102.png)

設定を自動化するスクリプトも公開されています。

- [setup script GitHub and Npm Trusted Publish](https://gist.github.com/azu/2864f536002c6e99f9c57a379b093f40)

### Monorepoのパターン

基本的な流れは単独パッケージと同じですが、バージョン更新や公開に`pnpm -r`などmonorepo用のコマンドを使用します。また、OIDCが未設定のパッケージを検出して通知するワークフローを追加するなどの工夫がされています。

![monorepo-check](https://efcl.info/wp-content/uploads/2025/09/07-1757215895.png)

---

## OIDC導入の効果

### 1. セキュリティ向上

- **トークンレス**: `npm`トークンをSecretsに保存する必要がなくなり、漏洩リスクがなくなる。
- **トークンによる公開禁止**: パッケージ設定でMFAを必須にし、トークンでの公開を禁止できる。これにより、メンテナーのアカウントが乗っ取られても、不正なバージョンを公開されにくくなる。
- **Provenance生成**: パッケージがどこでどのようにビルドされたかを証明する来歴情報（Provenance）が自動で生成され、サプライチェーンセキュリティが向上する。

### 2. 運用面の改善

- ブラウザ操作だけでリリース作業が完結する。
- リリースフローが標準化され、属人性が低下する。
- 手動でのトークン管理が不要になる。

---

## 制約事項と課題

### 現在の制約

- セルフホストランナーは未対応。
- 設定できるTrusted Publisherは1パッケージにつき1つ。
- プライベートリポジトリではprovenanceを生成できない。

### 不満点・課題

- `npm`の最新版を手動でインストールする必要がある (`npm i -g npm`)。
- GitHub Actionsの権限がnpmの権限とほぼ同義になるため、ワークフローファイルの改変リスク対策が必要。

---

## 推奨される追加のセキュリティ対策

OIDC化によりセキュリティは向上しますが、ワークフローファイル(`release.yml`)の改変や、正規フローを装った攻撃のリスクは残ります。以下の対策が推奨されています。

### 1. Environment Protection Rule

GitHub ActionsのEnvironment機能で承認ステップを追加し、リリース実行前に手動レビューを必須にする。

![environment protection](https://efcl.info/wp-content/uploads/2025/09/07-1757229112.png)

### 2. CODEOWNERSによるワークフロー保護

`.github/workflows/`ディレクトリの変更に特定のレビュアー（オーナーなど）を必須にすることで、不正なワークフロー改変を防ぐ。

```
# .github/CODEOWNERS
.github/workflows/ @your-username
```

これらの対策により、攻撃コストを大幅に引き上げることができます。

## まとめ

npm Trusted Publishingは、リリースフローの属人性を下げつつ、サプライチェーンセキュリティを向上させる強力な仕組みです。設定はやや複雑ですが、導入することで`npm`トークン管理の煩雑さから解放され、より安全なパッケージ公開が実現できます。
