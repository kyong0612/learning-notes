---
title: "GitHub Mandates 2FA and Short-Lived Tokens to Strengthen npm Supply Chain Security"
source: "https://thehackernews.com/2025/09/github-mandates-2fa-and-short-lived.html"
author:
  - "Ravie Lakshmanan"
published: 2025-09-23
created: 2025-09-25
description: |
  GitHubは、npmエコシステムを標的とした最近のサプライチェーン攻撃、特にShai-Hulud攻撃を受け、認証と公開オプションを変更する計画を発表しました。これには、FIDOベースの2要素認証（2FA）の義務化や、7日間の有効期限を持つトークンの導入が含まれ、npmのサプライチェーンセキュリティを強化することを目的としています。
tags:
  - "clippings"
  - "GitHub"
  - "NPM"
  - "security"
  - "supply-chain"
  - "2FA"
---

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZQ-xcQ5PKzdd6Juz8x_31GctkkivtZYfhVKlnZ5tFKbTtwJTtmajAEiqsdZZslnaRPS9Vd3LH4mQTo9agSCG6_cEuoUU_7WCvb1e-MmDytS4hQ1x1xur0u-DTQOYAydatYghaAZjPeBttRMTKNJKmJjWtvxfYOE1UvyltBh-K5fRWNwXIsLh-lv7af27Q/s728-rw-e365/github-npm.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZQ-xcQ5PKzdd6Juz8x_31GctkkivtZYfhVKlnZ5tFKbTtwJTtmajAEiqsdZZslnaRPS9Vd3LH4mQTo9agSCG6_cEuoUU_7WCvb1e-MmDytS4hQ1x1xur0u-DTQOYAydatYghaAZjPeBttRMTKNJKmJjWtvxfYOE1UvyltBh-K5fRWNwXIsLh-lv7af27Q/s728-rw-e365/github-npm.jpg)

## 概要

GitHubは、最近のnpmエコシステムを標的とした一連のサプライチェーン攻撃（特に「Shai-Hulud」攻撃）に対応するため、認証および公開オプションを「近い将来」変更すると発表しました。これにより、トークンの不正使用や自己増殖型マルウェアによる脅威に対処します。

## 主要な変更点

GitHubは以下の変更を実施する予定です。

1. **2要素認証（2FA）が必須のローカル公開**:
    * ローカルからのパッケージ公開時に2FAが必須となります。
2. **短命な粒度の細かいトークン**:
    * 発行されるトークンは7日間の有効期限に制限されます。
3. **信頼された公開（Trusted Publishing）**:
    * OpenID Connect（OIDC）を利用し、CI/CDワークフローから直接npmパッケージを安全に公開できるようになります。
    * これにより、npmトークンが不要になり、短命でワークフロー固有の認証情報を使用するため、漏洩や再利用のリスクがなくなります。
    * 信頼された公開を通じて発行されたすべてのパッケージには、そのソースとビルド環境の暗号学的証明が含まれ、サプライチェーンの信頼性が向上します。

## 具体的な移行措置

これらの変更をサポートするために、以下の措置が講じられます。

* レガシーなクラシックトークンの非推奨化。
* 時間ベースのワンタイムパスワード（TOTP）による2FAを非推奨とし、ユーザーをFIDOベースの2FAに移行。
* 公開権限を持つ粒度の細かいトークンの有効期限を短縮。
* デフォルトでトークンによる公開アクセスを禁止し、信頼された公開または2FAが強制されるローカル公開の利用を奨励。
* ローカルでのパッケージ公開時に2FAをバイパスするオプションを削除。
* 信頼された公開の対象プロバイダーを拡大。

## 背景：Shai-Hulud攻撃

この動きは、数百のnpmパッケージに自己増殖型のワームを注入した「Shai-Hulud」というコードネームのサプライチェーン攻撃の1週間後に発表されました。このワームは開発者のマシンから機密情報をスキャンし、攻撃者が管理するサーバーに送信するものでした。

GitHubのXavier René-Corail氏は、「自己増殖と複数の種類のシークレット（npmトークンだけでなく）を盗む能力を組み合わせることで、このワームは無限の攻撃を可能にする可能性があった」と述べています。

## 他のエコシステムでの動向

同様の動きとして、NuGet（.NETパッケージリポジトリ）も信頼された公開のサポートを追加し、Ruby CentralもRubyGems全体のサプライチェーンセキュリティを強化するための新しい措置を発表しています。

## 新たな脅威：fezboxパッケージ

ソフトウェアサプライチェーンセキュリティ企業Socketは、`fezbox`という悪意のあるnpmパッケージを発見しました。このパッケージは、新しいステガノグラフィ技術を用いてブラウザのパスワードを収集する能力を持っていました。

* **手法**: 脅威アクターはQRコード内のペイロードを実行し、ブラウザのWebクッキーからユーザー名とパスワードの認証情報を盗み出します。
* **挙動**: `fezbox`は一般的なヘルパー関数を含むJavaScriptユーティリティを装っていますが、実際にはリモートURLからQRコードを取得し、その中に含まれるJavaScriptペイロードを実行します。このペイロードは`document.cookie`を読み取り、ユーザー名とパスワード情報を抽出して外部サーバーに送信します。

研究者のOlivia Brown氏は、「ほとんどのアプリケーションはもはやリテラルなパスワードをクッキーに保存していないため、このマルウェアがどの程度成功するかは不明です。しかし、さらなる難読化のためにQRコードを使用する手法は、脅威アクターの創造的な工夫を示しています」と指摘しています。
