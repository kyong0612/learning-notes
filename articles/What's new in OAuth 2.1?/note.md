---
title: What's new in OAuth 2.1?
source: https://fusionauth.io/blog/whats-new-in-oauth-2-1
author:
  - Dan Moore
published: 2020-04-15
created: 2025-05-20 18:25:30
description: |
  Learn how the updated OAuth specification in the OAuth 2.1 RFC simplifies the protocol by consolidating core features, omitting the implicit grant, and more.
tags:
  - standards
  - oauth
  - oauth2
---

この記事では、OAuth 2.0のリリースから約8年を経て提案されているOAuth 2.1の主な変更点と、それが開発者やOAuth実装者にとって何を意味するのかを解説します。OAuth 2.1は、既存のベストプラクティスや確立された拡張機能を統合し、プロトコルを簡素化することを目的としています。新しい機能を追加するのではなく、セキュリティの向上に焦点を当てています。

## なぜOAuth 2.1なのか？

OAuth 2.0のリリース以来、多くの拡張やセキュリティに関する考慮事項が積み重ねられてきました。OAuth 2.1の主な目的は、これらの現在のベストプラクティスを単一の仕様に集約することです。これにより、開発者は複数のRFCや標準ドキュメントを参照することなく、OAuthを最適に実装・利用する方法を理解できるようになります。特に、[OAuth 2.0 Security Best Current Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14) から多くの詳細が取り入れられています。

## OAuth 2.1はアプリケーション利用者に何を意味するのか？

現時点ではOAuth 2.1はまだドラフト段階であり、最終的なリリース時期は未定です。しかし、リリースされた場合、最も大きな影響はImplicit GrantおよびResource Owner Password Credentials Grantという、削除される予定のグラントタイプへの対応です。これらのグラントを利用しているアプリケーションは、対応を検討する必要があります。

## 何が変わるのか？

OAuth 2.1ドラフトRFCでは、主に以下の6つの大きな変更点が示されています。

1. **認可コードグラント (Authorization Code Grant) とPKCE (Proof Key for Code Exchange)**
    * 認可コードグラントはPKCE ([RFC7636](https://tools.ietf.org/html/rfc7636)) の機能で拡張され、PKCEメカニズムの追加が必須となります。PKCEは、認可コードの傍受攻撃を防ぐために、追加のワンタイムコードをOAuthサーバーに送信する仕組みです。

2. **リダイレクトURIの完全一致比較**
    * リダイレクトURIは、[OAuth 2.0 Security Best Current Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14) のセクション4.1.3に従い、完全な文字列一致で比較されなければなりません。ワイルドカードの使用はセキュリティリスクがあるため許可されません。

3. **Implicit Grantの廃止**
    * Implicit Grant (`response_type=token`) は、セキュリティ上の問題（アクセストークンがURLフラグメントやJavaScriptからアクセス可能な場所に露出する）から、この仕様から除外されます。SPA (Single-Page Application) などでは、代わりに認可コードグラントとPKCEの使用が推奨されます。

4. **Resource Owner Password Credentials Grantの廃止**
    * このグラントは、アプリケーションがユーザーの認証情報を直接扱わなければならないため、OAuthの委任パターンを壊し、セキュリティリスクを高めることから仕様から除外されます。「OAuth 2.0 Security Best Current Practices」では明確に「MUST NOT be used」とされています。

5. **クエリ文字列でのベアラートークンの使用禁止**
    * ベアラートークン（アクセストークン）をURIのクエリ文字列に含めることは禁止されます。URLはログやブラウザ履歴に残りやすく、機密情報であるトークンを安全に渡す方法ではないためです。トークンはHTTPヘッダーまたはPOSTボディで渡すべきです。

6. **リフレッシュトークンの制限**
    * リフレッシュトークンは、送信者制約 (sender-constrained) であるか、ワンタイムユース (one-time use) でなければなりません。これにより、リフレッシュトークンが漏洩した場合のリスクを軽減します。ワンタイムユースの場合、使用後に無効化され、新しいリフレッシュトークンが発行されることがあります。送信者制約の場合は、トークンバインディングや相互TLS認証といった技術でクライアントと暗号的に紐付けられます。

![Application configuration.](/img/blogs/whats-new-in-oauth-2-1/admin-application-configuration.png)
*(画像: FusionAuthにおけるリダイレクトURI設定画面の例)*

## 何が変わらないのか？

OAuth 2.1はOAuth 2.0の基盤の上に構築されており、明示的に省略または変更されていない動作はすべて継承されます。例えば、サーバー間の認証でよく使われるClient Credentials Grantは引き続き利用可能です。

## OAuth 2.1を今すぐ使えるか？

現時点では「OAuth 2.1」として正式にリリースされたものはありません。しかし、セキュリティのベストプラクティスに従うことで、この統合されたドラフトの恩恵を受け、将来のリリースに備えることができます。

FusionAuthは将来を見据えており、これらの変更点の多くをすでにサポートしています。

* 認可コードグラントではPKCEを使用する。
* リダイレクトURIは完全一致で比較する。
* ベアラートークンをクエリ文字列で使用しない（Implicit Grant以外）。
* リフレッシュトークンを制限する（FusionAuthは送信者制約を強制）。

## 今後の方向性

OAuth 2.1の仕様はまだ議論中であり、最終的な内容は変更される可能性があります。また、OAuth 2.0を根本から再考するOAuth3ワーキンググループも存在しますが、そのリリースはOAuth 2.1よりもさらに先になる見込みです。

**関連情報:**

* 元記事: [What's new in OAuth 2.1? - FusionAuth](https://fusionauth.io/blog/whats-new-in-oauth-2-1)
* OAuth 2.1 Draft: [draft-parecki-oauth-v2-1-01](https://tools.ietf.org/html/draft-parecki-oauth-v2-1-01)
* OAuth 2.0 Security Best Current Practices: [draft-ietf-oauth-security-topics-14](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-14)

この記事の画像は元の記事から参照しており、ここでは説明のために画像のキャプションを記載しています。
