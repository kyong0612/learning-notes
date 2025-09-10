---
title: "Hackers hijack npm packages with 2 billion weekly downloads in supply chain attack"
source: "https://www.bleepingcomputer.com/news/security/hackers-hijack-npm-packages-with-2-billion-weekly-downloads-in-supply-chain-attack/"
author:
  - "Sergiu Gatlan"
published: 2025-09-09
created: 2025-09-10
description: "A supply chain attack injected malware into popular NPM packages with over 2.6 billion weekly downloads. The compromise occurred after a maintainer's account was hijacked through a phishing attack, leading to the injection of malicious code designed to steal cryptocurrency."
tags:
  - "clippings"
  - "security"
  - "npm"
  - "supply-chain-attack"
  - "malware"
  - "phishing"
---

## 概要

NPMパッケージメンテナーのアカウントがフィッシング攻撃によって乗っ取られ、週に26億回以上ダウンロードされる複数のNPMパッケージにマルウェアが注入されるというサプライチェーン攻撃が発生しました。このマルウェアは、ブラウザベースのインターセプタとして機能し、暗号資産の取引を乗っ取ります。

![NPM](https://www.bleepstatic.com/content/hl-images/2022/07/05/NPM_head_pic.jpg)

## フィッシング攻撃の手口

攻撃者は、正規の`npmjs.com`ドメインを偽装した`npmjs.help`というドメインからフィッシングメールを送信しました。メールでは、アカウントのセキュリティ維持のため二要素認証（2FA）の更新を要求し、応じない場合は2025年9月10日にアカウントが一時的にロックされると脅迫していました。

> "As part of our ongoing commitment to account security, we are requesting that all users update their Two-Factor Authentication (2FA) credentials. ... Please note that accounts with outdated 2FA credentials will be temporarily locked starting September 10, 2025, to prevent unauthorized access."

このメール内のリンクをクリックするとフィッシングサイトに誘導され、入力された認証情報が攻撃者に窃取される仕組みでした。

![Phishing email](https://www.bleepstatic.com/images/news/u/1109292/2025/phishing-email.jpg)
*フィッシングメール ( Nicolas Morel )*

## サプライチェーン攻撃の詳細

### マルウェアの動作

パッケージメンテナーのJosh Junon ([qix](https://www.npmjs.com/~qix))氏のアカウントが乗っ取られた後、攻撃者はパッケージを更新し、悪意のあるコードを`index.js`ファイルに注入しました。

[![Josh Junon skeet](https://www.bleepstatic.com/images/news/u/1109292/2025/Josh_Junon_skeet.png)](https://bsky.app/profile/bad-at-computer.bsky.social/post/3lydmyzpwa22s)

このコードは、ウェブブラウザ上で動作し、以下の暗号資産ウォレットアドレスや取引を監視します。

- Ethereum
- Bitcoin
- Solana
- Tron
- Litecoin
- Bitcoin Cash

ネットワーク応答に暗号資産取引が含まれている場合、宛先アドレスを攻撃者が管理するアドレスに置き換え、署名される前に取引を乗っ取ります。これは、`fetch`や`XMLHttpRequest`、ウォレットAPI（`window.ethereum`, `Solana`など）といったJavaScript関数をフックすることで実現されます。

> "The packages were updated to contain a piece of code that would be executed on the client of a website, which silently intercepts crypto and web3 activity in the browser, manipulates wallet interactions, and rewrites payment destinations so that funds and approvals are redirected to attacker-controlled accounts without any obvious signs to the user."
> — Charlie Eriksen, Aikido Security researcher

### 影響を受けたパッケージ

この攻撃で乗っ取られたパッケージは、合計で週に26億回以上ダウンロードされています。以下は影響を受けた主なパッケージです（ダウンロード数/週）。

- `debug` (357.6m)
- `chalk` (299.99m)
- `supports-color` (287.1m)
- `strip-ansi` (261.17m)
- `ansi-regex` (243.64m)
- `wrap-ansi` (197.99m)
- `color-convert` (193.5m)
- `color-name` (191.71m)
- `ansi-styles` (371.41m)
- その他多数...

### 影響の範囲

ただし、Privy社のPrincipal Security EngineerであるAndrew MacPherson氏によると、実際に影響を受けるためには以下の厳しい条件を満たす必要があり、影響範囲は大幅に限定されるとのことです。

- パッケージが侵害されていた時間帯（ET午前9時〜11時30分頃）に`npm install`が実行された。
- その時間帯に`package-lock.json`が作成された。
- 脆弱なパッケージが直接的または間接的な依存関係に含まれていた。

## 結論

このインシデントは、ウェブブラウザが認証情報の窃取、トラフィックの改ざん、ネットワーク侵害のための広大な攻撃対象領域となっていることを示しています。開発者を標的とした同様のサプライチェーン攻撃は過去数ヶ月にわたって続いており、開発エコシステムのセキュリティ確保が重要な課題となっています。
