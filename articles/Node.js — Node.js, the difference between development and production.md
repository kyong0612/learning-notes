---
title: "Node.js — Node.js, the difference between development and production"
source: "https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production"
author:
  - "flaviocopes"
  - "mylesborins"
  - "fhemberger"
  - "LaRuaNa"
  - "ahmadawais"
  - "RenanTKN"
published:
created: 2025-06-28
description: |
  Explains the role of the NODE_ENV environment variable in Node.js applications, why it should always be set to 'production' in production, and why using it to create different application behaviors across environments is considered an antipattern.
tags:
  - "Node.js"
  - "development"
  - "production"
  - "environment-variables"
  - "best-practices"
---

## Node.jsにおける開発環境と本番環境の違い

Node.js自体には、開発環境と本番環境の間に本質的な違いはありません。つまり、Node.jsを本番環境用に設定するための特別なフラグや構成は存在しません。

しかし、エコシステム内の多くのライブラリ（npmレジストリ上のパッケージなど）は、`NODE_ENV`という環境変数を参照して動作を切り替えます。この変数が設定されていない場合、デフォルトで`development`（開発モード）として扱われることが一般的です。

そのため、本番環境でNode.jsアプリケーションを実行する際は、常に `NODE_ENV=production` を設定することが強く推奨されます。これにより、ライブラリが本番向けに最適化され、パフォーマンスの向上や不要なデバッグログの抑制などが期待できます。

アプリケーションの設定方法として、[The Twelve-Factor App](https://12factor.net/) の方法論に従うことが広く推奨されています。

## なぜ `NODE_ENV` の利用がアンチパターンとされるのか？

`NODE_ENV` は広く使われていますが、その使い方によってはアンチパターンと見なされることがあります。特に、`production` 以外の値（例: `development`, `staging`）に基づいてアプリケーションのロジックを分岐させることが問題視されます。

### 環境の定義

通常、ソフトウェア開発には以下の4つの環境が存在します。

1. **Development (開発)**: 開発者がコードを構築する環境。
2. **Testing (テスト)**: 機能が正しく動作するかを検証する環境。
3. **Staging (ステージング)**: 本番環境とほぼ同じ構成で、リリース前の最終確認を行う環境。
4. **Production (本番)**: 実際のユーザーが利用する環境。

### `NODE_ENV` の問題点

問題の核心は、開発者が**最適化**（例: ログ出力の抑制）と**ソフトウェアの振る舞い**（例: 特定機能の有効/無効）を、`NODE_ENV` という単一の変数で制御しようとすることにあります。

これにより、以下のようなコードが生まれがちです。

```javascript
if (process.env.NODE_ENV === 'development') {
  // 開発環境でのみ実行する処理
}

if (process.env.NODE_ENV === 'production') {
  // 本番環境でのみ実行する処理
}

if (['production', 'staging'].includes(process.env.NODE_ENV)) {
  // 本番とステージング環境で実行する処理
}
```

このアプローチは一見無害に見えますが、ステージング環境と本番環境でアプリケーションの動作に差異を生じさせ、信頼性の高いテストを不可能にします。例えば、ある機能が `NODE_ENV=development` では正常に動作しても、`NODE_ENV=production` では失敗する可能性があります。

このため、`NODE_ENV` を `production` 以外の値に設定してアプリケーションのロジックを制御することは**アンチパターン**とされています。変数の目的は、あくまで「本番モードであるか否か」をライブラリに伝えることに限定すべきです。
