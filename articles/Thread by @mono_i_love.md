---
title: "パスワードマネージャーのクリックジャッキング脆弱性に関する注意喚起"
source: "https://x.com/mono_i_love/status/1957968191260619035?s=12"
author:
  - "@mono_i_love"
published: 
created: 2024-07-26
description: |
  1Password、Bitwarden、iCloudなどの主要なパスワードマネージャーに影響を及ぼすクリックジャッキング攻撃の脆弱性についての注意喚起。この未修正の脆弱性を悪用したデモサイトで、実際にクレジットカード情報が抜き取られる危険性が示されている。
tags:
  - "セキュリティ"
  - "脆弱性"
  - "パスワードマネージャー"
  - "クリックジャッキング"
---

### 概要

主要なパスワードマネージャー（1Password, Bitwarden, iCloudなど）において、クリックジャッキング攻撃を可能にする未修正の脆弱性が存在することが報告されました。この脆弱性を悪用すると、ユーザーが意図しない操作をさせられ、クレジットカード情報などの機密情報が抜き取られる危険性があります。

### 脆弱性の詳細

この脆弱性は、パスワードマネージャーの自動入力（オートフィル）機能を標的としたクリックジャッキング攻撃です。攻撃者は悪意のあるウェブサイトに透明な偽の入力フォームを重ねることで、ユーザーを騙して見えないフォームに情報を入力させます。ツイートでは、実際にデモサイトでこの攻撃によりクレジットカード情報が抜き取られる様子が示されています。

参考記事：<https://socket.dev/blog/password-manager-clickjacking>

![Image](https://pbs.twimg.com/media/GywXnstbMAAXc4r?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/GywXqotacAUJ1bz?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/GywX1JGacAIJkHK?format=jpg&name=large) ![Image](https://pbs.twimg.com/media/GywX2ZhacAQE6vV?format=jpg&name=large)

### 各パスワードマネージャーの対応状況

ツイートで共有された画像によると、各パスワードマネージャーの脆弱性への対応状況は様々です。特に、1PasswordとLastPassはこの脆弱性に対して完全な対応を予定していないとの指摘がされています。

![Image](https://pbs.twimg.com/media/GywYpa6bwAAsu6o?format=jpg&name=large)

### 推奨される対策

この脆弱性から身を守るための一時的な対策として、パスワードマネージャーの自動入力機能を無効化することが推奨されます。

#### Bitwardenの場合

ブラウザ拡張機能の設定で、以下の項目をオフにします。

> 「設定 ＞ 自動入力 ＞ フォームフィールドに自動入力の候補を表示する」

自動入力を無効にした後は、「Ctrl + Shift + L」のショートカットキーや、右クリックメニューから手動で自動入力を選択する方法でパスワードを安全に入力できます。
