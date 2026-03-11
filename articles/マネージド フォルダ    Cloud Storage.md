---
title: "マネージド フォルダ  |  Cloud Storage"
source: "https://docs.cloud.google.com/storage/docs/managed-folders?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published:
created: 2026-03-11
description: "Cloud Storage のマネージド フォルダの概要。IAM ロールを付与できるフォルダにより、バケット内の特定のオブジェクト グループに対するきめ細かいアクセス制御を実現する。"
tags:
  - "clippings"
  - "Google Cloud"
  - "Cloud Storage"
  - "IAM"
  - "アクセス制御"
  - "マネージドフォルダ"
---

## 概要

マネージド フォルダは、Cloud Storage において **IAM ロールを直接付与できるフォルダ**。バケット内の特定のオブジェクト グループに対して、きめ細かいアクセス制御を行うことができる。フラットな名前空間で動作する「シミュレートされたフォルダ」とは異なり、Cloud Storage 内のリソースとして実体を持つ。

## マネージド フォルダに対する IAM

- マネージド フォルダに IAM ポリシーを適用すると、**フォルダのパスを接頭辞に持つすべてのオブジェクト**にアクセス権が適用される
  - 例: `example-managed-folder/` に `roles/storage.objectViewer` を付与 → `example-managed-folder/dog.png` や `example-managed-folder/cat.jpeg` などを閲覧可能
- マネージド フォルダをネストした場合、IAM ポリシーによる権限は**ネストされたフォルダにも適用**される
- **前提条件**: 均一なバケットレベルのアクセス（Uniform bucket-level access）が有効なバケットでのみ作成可能

### 関連リソース

- [マネージド フォルダの作成と管理](https://docs.cloud.google.com/storage/docs/creating-managing-managed-folders?hl=ja)
- [マネージド フォルダに対するアクセス制御](https://docs.cloud.google.com/storage/docs/access-control/using-iam-for-managed-folders?hl=ja)
- [JSON API ManagedFolder リファレンス](https://docs.cloud.google.com/storage/docs/json_api/v1/managedFolder?hl=ja)

## 命名規則

| 要件 | 詳細 |
|---|---|
| 文字セット | 有効な Unicode 文字（UTF-8 で 1〜1,024 バイト） |
| 末尾 | `/` で終わる必要がある |
| ネスト上限 | `/` は最大 15 個まで（= 最大 15 レベルのネスト） |
| 禁止文字 | 改行・ラインフィード文字 |
| 禁止パターン | `.well-known/acme-challenge/` で始まる名前、`.` や `..` 単体 |

### 非推奨の文字

- **XML 制御文字**（#x7F〜#x84、#x86〜#x9F）: XML リスト表示で問題が発生する
- **`[`、`]`、`*`、`?`**: gcloud CLI がワイルドカードとして解釈するため操作が困難になる。`*` と `?` は Windows ファイル名でも無効
- **機密情報・PII**: フォルダ名はオブジェクト URL やリスト表示で広範囲に可視化されるため避けるべき

## 考慮事項

- **シミュレートされたフォルダの代替として作成可能**: オブジェクトの接頭辞に基づいた名前でマネージド フォルダを作成でき、IAM ポリシーはその接頭辞を持つすべてのオブジェクトに適用される
- **親フォルダなしで子フォルダを作成可能**: `my-folder-A/` を作成せずに `my-folder-A/my-folder-B/` を直接作成できる
- **空でないフォルダの削除**: デフォルトでは不可。JSON API の `allowNonEmpty` パラメータで回避可能
- **フォルダ削除時の注意**: 同じパスにマネージド フォルダが存在するフォルダの削除リクエストが失敗すると、`storage.managedFolders.get` や `storage.managedFolders.list` 権限がなくても、マネージド フォルダ名がエラーメッセージや Cloud Audit Logs に表示される

## 重要なポイント

1. **きめ細かいアクセス制御**: バケット全体ではなく、特定のオブジェクトグループ単位で IAM を適用できる
2. **均一なバケットレベルのアクセスが必須**: ACL ベースのバケットでは利用不可
3. **最大 15 レベルのネスト**: 深い階層構造にも対応
4. **IAM ポリシーの継承**: ネストされたフォルダにも親のポリシーが適用される
