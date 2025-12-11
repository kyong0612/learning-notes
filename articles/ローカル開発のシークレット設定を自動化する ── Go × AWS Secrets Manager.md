---
title: "ローカル開発のシークレット設定を自動化する ── Go × AWS Secrets Manager"
source: "https://zenn.dev/layerx/articles/762ecd4494694f"
author:
  - "[[うぱ | upamune]]"
  - "[[LayerX]]"
published: 2025-12-09
created: 2025-12-11
description: "AWS Secrets Manager と Go の struct tags を組み合わせて、ローカル開発時のシークレット設定を自動化する仕組みを紹介。手動でのシークレット設定の手間をなくし、開発体験を向上させる方法を解説。"
tags:
  - "clippings"
  - "AWS"
  - "Go"
  - "Security"
  - "SecretsManager"
  - "ローカル開発"
  - "開発体験"
---

## 概要

この記事は、LayerX Tech Advent Calendar 2025 の9日目の記事で、ローカル開発環境におけるシークレット（APIキーなど）の設定を AWS Secrets Manager と Go の struct tags を使って自動化する方法を紹介している。

## 背景・課題

### ローカル開発でのシークレット管理の問題点

ローカル開発でシークレットを扱う従来の方法とその課題：

| 方法 | 課題 |
|------|------|
| **1Passwordからコピペ** | 新メンバーへの説明が必要、ドキュメント更新が必要、シークレット更新時に再コピペが必要 |
| **1Password CLI の inject** | 起動するたびにTouchIDを求められる、再injectのタイミングが不明瞭 |

普段は使わないが必要なときに動かしたいサービス（Slack通知やメール送信など）は、いざ動かそうとするとシークレット設定が面倒という問題も存在。

## 解決策：AWS Secrets Manager + Go struct tags による自動シークレット注入

### 4つのポイント

1. **Go の struct tags で宣言的にシークレットを指定**
2. **環境変数が未設定の場合のみ自動取得**（既存の設定を上書きしない）
3. **ローカル環境でのみ動作**（本番環境では何もしない）
4. **シークレットはメモリ上にのみ保持**（ファイルには書き出さない）

> **設計思想**: 既存の開発フローを変えずに自動的に便利になること

### 実装方法

#### 1. シークレットを宣言的に取得する

設定の struct に `localsecret` タグを追加：

```go
type Config struct {
    DatabaseURL    string `envconfig:"DATABASE_URL"`
    SendGridAPIKey string `envconfig:"SENDGRID_API_KEY" localsecret:"my-service-sendgrid-api-key-local"`
}
```

アプリケーション初期化時に `InjectLocalSecret` を呼び出す：

```go
var config Config
// 1. envconfig を利用して Config 構造体の値を埋める
envconfig.Process("", &config)
// 2. localsecret タグが設定されていて空文字のシークレットだけAWS Secret Managerから注入する
InjectLocalSecret("my-service", &config)
```

#### 2. 動作の流れ

1. `InjectLocalSecret` は struct のフィールドを走査し、`localsecret` タグを探す
2. タグが見つかったら、そのフィールドが空かどうかをチェック
3. 空の場合のみ、AWS Secrets Manager から値を取得して設定
4. 既に値が設定されている場合はスキップ（環境変数の設定を優先）

#### 3. エラーハンドリング

開発体験の向上が目的のため、**エラーが発生してもアプリケーションの起動をブロックしない**：

- AWS の認証情報がない場合 → 警告ログを出力してスキップ
- シークレットが見つからない場合 → 警告ログを出力してスキップ

起動時のログ例：

```
[localsecret] [my-service] info: injected local secret for SENDGRID_API_KEY (secret: my-service-sendgrid-api-key-local) from AWS Secrets Manager
```

### シークレットの登録方法

#### 1. AWS Secrets Manager にシークレットを登録

社内向けCLIを作成し、インタラクティブに設定可能に：

- [junegunn/fzf](https://github.com/junegunn/fzf) でサービスを選択
- サフィックスを入力するだけで命名規約に沿った Secret ID が自動生成
- 間違った名前が設定されることを防止

![AWS Secrets Manager CLI操作画面](https://i.gyazo.com/84500b7a12a87eff849428ae8f114077.png)

#### 2. struct に localsecret タグを追加

```go
SendGridAPIKey string `envconfig:"SENDGRID_API_KEY" localsecret:"my-service-sendgrid-api-key-local"`
```

### 既存シークレットの localsecret 対応

Claude Code の **Custom Slash Command** を活用：

`/localsecret-register` コマンドを実行すると：

1. どのサービス・どの設定フィールドを対応させたいか聞いてくる
2. リポジトリ内を検索して、該当する struct とフィールドを特定
3. 登録用CLIを利用して、AWS Secrets Manager への登録手順を案内
4. 登録後に生成された Secret ID を元に、struct フィールドに `localsecret` タグを追加

## 導入効果

- 「シークレットは1Passwordから〜」という説明が不要に
- 新メンバーのオンボーディングがスムーズに
- 久しぶりに使うサービスでもシークレット設定不要
- シークレット更新時も自動で反映
- 一度誰かが AWS Secrets Manager に登録すれば、全員が恩恵を受けられる

## 使用ライブラリ・ツール

- [kelseyhightower/envconfig](https://github.com/kelseyhightower/envconfig) - 環境変数からの設定読み込み
- [junegunn/fzf](https://github.com/junegunn/fzf) - インタラクティブなファジーファインダー
- [charmbracelet/huh](https://github.com/charmbracelet/huh) - インタラクティブなフォームライブラリ
- Claude Code - 実装と Custom Slash Command の活用

## まとめ

シークレット管理は地味だが開発体験に直結する部分。Go で実装されているが、同じ考え方は他の言語やフレームワークでも応用可能。ローカル環境での開発を便利かつセキュアにする仕組み。
