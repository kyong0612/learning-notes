---
title: "Email Routing | アドレス作成とメール転送が簡単に"
source: "https://www.cloudflare.com/ja-jp/developer-platform/products/email-routing/"
author: Cloudflare
published:
created: 2025-12-09
description: "Cloudflare Email Routingは、独自ドメインのカスタムメールアドレスを無料で作成し、既存の受信箱へメッセージを転送するサービス。プライバシーを保護しながら、個人・家族・ビジネス向けに柔軟なメールルーティングを提供する。"
tags:
  - cloudflare
  - email-routing
  - メール転送
  - DNS
  - プライバシー
  - サーバーレス
  - Cloudflare Workers
---

## 概要

Cloudflare Email Routingは、独自ドメインのカスタムメールアドレスを作成し、好みの受信箱へメッセージをルーティングするサービス。**プライマリメールアドレスを露出せずに**運用できる点が特徴。

## Cloudflare Email Routingの主な利点

### 1. プライバシー重視の設計とアンチスパム

- **100%プライベート**: Cloudflareはメール内容を保存せず、アクセスも行わない
- フィッシングを検出し、スパム転送を防止

### 2. 無料で簡単設定

- カスタムアドレスの作成とメッセージ転送が**無料**
- DNSレコードは**自動的に作成**され、偶発的変更から保護

### 3. 詳細な分析機能

- 送受信メール数の把握（転送・破棄を問わず）
- 宛先メールボックスへの配信成功率のインサイト

### 4. プログラム的なメール処理

- **Cloudflare Workers**へルーティング可能
- メール処理のカスタムロジックをプログラムで実装

## 仕組み

Email Routingは**トランスポート層でインテリジェントなルーター**として機能:

- オリジナルヘッダーと本文はそのまま保持
- SMTPエンベロープの処理と変更を行う
- メッセージを最終的な宛先へ**リアルタイムで配信**

## 主要ユースケース

| 対象 | 用途例 |
|------|--------|
| **個人ユーザー** | ニーズごとにアドレスを作成。ニューズレターやビジネスメールとプライベートを分離 |
| **ファミリー** | 家族各人のアドレスや特定目的用アドレス（家計費請求書受信用など）を設定 |
| **ビジネス** | セールスやサポートなど問い合わせタイプ別にメールをルーティング。受信者の制御が容易 |

## 関連リソース

- [Cloudflare Email Routingのご紹介](https://blog.cloudflare.com/introducing-email-routing/) - ブログ記事
- [Cloudflare Email Routingへの移行](https://blog.cloudflare.com/migrating-to-cloudflare-email-routing/) - ブログ記事
- [Email Routingオープンベータ](https://blog.cloudflare.com/email-routing-open-beta/) - ブログ記事
- [開発者ドキュメント](https://developers.cloudflare.com/email-routing/)

## 重要ポイント

1. **完全無料**で利用可能
2. **プライバシー保護**が標準装備（メール内容の保存・アクセスなし）
3. **DNS設定が自動化**されており、技術的な知識がなくても導入しやすい
4. **Cloudflare Workers連携**により、高度なメール処理ロジックの実装が可能
5. フィッシングやスパム対策が組み込まれている

## 料金

**無料**（Cloudflareの開発者プラットフォームの一部として提供）
