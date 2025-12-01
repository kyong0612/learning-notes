---
title: "Terraform State をビジュアルで確認できるOSS「terraform-tui」の紹介 | DevelopersIO"
source: "https://dev.classmethod.jp/articles/hands-on-terraform-visual-state-explorer/"
author:
  - "[[とーち]]"
published: 2025-02-07
created: 2025-12-01
description: |
  Terraform Stateをターミナル上でグラフィカルに可視化できるOSSツール「terraform-tui」の紹介記事。State管理の可視化、リソース検索、Plan/Apply実行機能などを実際のハンズオン形式で解説している。
tags:
  - Terraform
  - OSS
  - IaC
  - DevOps
  - CLI
---

## とりあえずまとめ

- **Terraform Stateをグラフィカルに可視化できる**
- **リソースの検索や詳細表示が直感的に可能**
- **Plan/Applyもツール上から実行可能**

## terraform-tuiとは

[terraform-tui](https://github.com/idoavrah/terraform-tui/tree/main) は、Terraform Stateをターミナル上でビジュアルに確認できるOSSツール。「今のState fileの状態を簡単に確認したい」というニーズに応える。

> ⚠️ 本ツールはOSSとして公開されているため、動作の保証や安全性の確認は各自の責任で行う必要がある。

## 主要機能

### 1. State管理の可視化

- Terraform stateツリーの完全な可視化
- リソース状態の詳細表示と簡単なナビゲーション
- ツリー構造での直感的な状態把握

### 2. 検索・操作機能

- stateツリーとリソース定義の検索
- リソースの単一/複数選択
- リソースの削除機能

### 3. Plan/Apply機能

- terraform-tuiからのplan作成と適用
- カラフルな差分表示

### 4. 便利な追加機能

- ワークスペース切り替え
- Terragruntなどのラッパーツールのサポート
- Vimライクなナビゲーション

## インストール方法

### macOS（Homebrew）

```bash
brew install idoavrah/homebrew/tftui
```

### pip

pipを使用したインストールもサポートされている。

## 使い方

### 基本的な起動方法

```bash
cd /path/to/terraform/project && tftui
```

**重要**: Terraformのplan/applyを実行できるディレクトリで実行する必要がある。

> ⚠️ 実行にはAWS認証情報が必要。`aws configure`または環境変数で適切な認証情報を設定すること。

### 操作方法

| キー | 機能 |
|------|------|
| `↑↓` | リソース間を移動 |
| `Enter` | リソースの詳細を表示 |
| `Esc` | 前の画面に戻る |
| `/` | 検索ウィンドウを開く |
| `p` | Planを実行 |
| `a` | Applyを実行 |
| `?` | 操作方法を確認 |
| `q` | 終了 |

※ マウスカーソルでリソースを選択することも可能

### 検索機能

`/`キーで検索ウィンドウを開き、以下のような検索が可能：

- **リソース名での検索**: 例）「role」と入力すると関連リソースに絞り込み
- **パラメータ値での検索**: 例）IPアドレスで検索してもリソースを特定可能

リソースのパラメータ部分も含めて検索できる点が便利。

### Plan/Applyの実行

1. モジュールを選択した状態で`p`を押す
2. variablesファイルを追加で指定するダイアログが表示される
3. 確認後、Planが実行される

### リソース単位での削除

- 個別のリソースを選択してStateから削除可能
- 削除後にPlanを実行すると、削除したリソースが差分として表示される

## 制限事項

### Terragruntとの連携における注意点

terraform-tuiは基本的にTerragruntをサポートしているが、以下のような機能は未対応：

**Terragruntの`dependency`機能による変数の受け渡し**

1. あるtfstateでoutputとして値を出力
2. 別のtfstateでその値をvariablesとして受け取る
3. terragrunt実行時に自動的にvariablesに適切な値が代入される

この連携機能は terraform-tui ではサポートされていない。対処法として、variables定義にdefault値を追加することで実行可能になる。

## まとめ

terraform-tuiは、Terraformのリソースをグラフィカルに確認できるツール。以下のような場面で役立つ：

- State fileの状態を素早く確認したいとき
- リソースの詳細を直感的に把握したいとき
- ターミナル上でPlan/Applyを視覚的に実行したいとき

## 参考リンク

- [terraform-tui GitHub](https://github.com/idoavrah/terraform-tui/tree/main)
- [検証用Terraformコード（Terragrunt使用）](https://github.com/ice1203/terraform-development-terminal)
