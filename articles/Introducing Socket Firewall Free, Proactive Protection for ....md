---
title: "Introducing Socket Firewall: Free, Proactive Protection for ..."
source: "https://socket.dev/blog/introducing-socket-firewall"
author:
  - "[[chalk]]"
published:
created: 2025-10-03
description: "Socket Firewallはインストール時に悪意あるパッケージをブロックし、サプライチェーン攻撃の増加に先手を打てる無料ツールです。"
tags:
  - "clippings"
---

[
Socket Firewallの紹介: ソフトウェアサプライチェーンを無料でプロアクティブに保護。詳しく見る →
](<https://socket.dev/blog/introducing-socket-firewall>)

[戻る](https://socket.dev/blog)

プロダクト

## Socket Firewallの紹介: ソフトウェアサプライチェーンを無料でプロアクティブに保護

## Socket Firewallはインストール時に悪意あるパッケージをブロックし、増加するサプライチェーン攻撃から開発者を守る無料ツールです

![Socket Firewallの紹介: ソフトウェアサプライチェーンを無料でプロアクティブに保護](https://socket.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fcgdhsj6q%2Fproduction%2F491b895846310fa88d10f85d08ad6b098e55cef0-1200x596.png%3Fw%3D1600%26q%3D95%26fit%3Dmax%26auto%3Dformat&w=3840&q=75)

かつては、npmで著名なメンテナーが乗っ取られる事件はまれな出来事でした。2018年の悪名高いevent-stream攻撃のようなインシデントは、衝撃的な例外として語られてきました。しかし今では状況が一変しています。ここ数週間だけでも、信頼されていたオープンソースパッケージが[tinycolor](https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages)、[nx](https://socket.dev/blog/nx-packages-compromised)、[eslint-config-prettier](https://socket.dev/blog/npm-phishing-campaign-leads-to-prettier-tooling-packages-compromise)の侵害で相次いで標的となりました。

かつて例外的だった出来事が、メンテナー本人を狙うますます巧妙なソーシャルエンジニアリングによって、ぞっとするほど日常的になっています。その結果、オープンソースに依存する開発者や組織を守るには、従来型の防御だけでは不十分になりました。

Socketはこれまで、サプライチェーン攻撃が最悪の事態を招くことを防ぐ手助けをしてきました。しかし攻撃者はプロダクション環境だけを狙っているわけではありません。開発者のマシンで直接悪意のあるコードを実行し、プロダクションに到達する前に被害を与えようともします。

このギャップを埋めるべく、私たちは**Socket Firewall Free**を発表します。これは開発者マシンをリアルタイムで保護し、悪意ある依存関係がラップトップやビルドシステムに届く前にブロックする軽量ツールです。導入は簡単で、**APIキーも設定も不要**です。

![$ npm i -g sfw $ sfw npm install lodahs  === Socket Firewall ===  - Blocked npm package: name: lodahs; version: 1.0.0](https://cdn.sanity.io/images/cgdhsj6q/production/40b9d76c7de9cdeffac7df047912a8c59dd083f4-1750x744.png?w=1600&q=95&fit=max&auto=format)

Socket Firewallの動作例です。`npm i -g sfw`でインストールし、パッケージインストールコマンドの前に`sfw`を付けるだけです。たとえば`sfw npm install lodahs`を実行すると、悪意あるパッケージのインストールが阻止されることが確認できます。

## エコシステム全体へ広がる保護

すでに「safe npm」ツールを使ったことがあるなら、Socket Firewallにもすぐに慣れるはずです。`npm install`実行時に悪意ある依存関係をインストールさせない点は同じですが、機能はそれ以上に広がっています。JavaScriptに加えてPythonやRustもカバーし、さらに多くのエコシステム対応が迅速に追加される予定です。「safe npm」を使い続けることもできますが、私たちはSocket Firewallを次のステップと捉えており、エコシステム横断でインストールを守る標準的なアプローチになると考えています。

Socket Firewall Freeは、以下のパッケージマネージャー経由でのマルウェア取得を防ぎます。

- JavaScript / TypeScript: `npm`、`yarn`、`pnpm`
- Python: `pip`、`uv`
- Rust: `cargo`

近い将来、エンタープライズ向けのSocket Firewallも提供予定です。有料版ではブロックポリシーの設定が可能になり、さらに多くのパッケージマネージャーとエコシステムへの対応を拡大し、ネットワークサービスとしてのデプロイも可能になります。詳細は今後数週間のうちにお知らせします。

その間も、Socket Firewallが私たち全員が頼るオープンソースエコシステムを強化する助けになると確信しています。

## 仕組み

インストール後は、サポートされているパッケージマネージャーのコマンドの前に`sfw`を付けて実行します。例:

```
sfw npm install --save some-package@1.33.7
sfw cargo fetch
sfw uv pip install flask
```

Socket Firewallは問題のあるトップレベル依存関係だけを守るわけではありません。悪意が知られている推移的依存関係についても、パッケージマネージャーが取得しようとした時点でブロックします。内部では一時的なHTTPプロキシを立ち上げ、サブプロセスのトラフィックを傍受して、パッケージがダウンロード・解凍・インストールされる前にSocket APIで安全性を確認します。

*sfwパッケージをSocketに譲渡してくれた[Amir Arad](https://github.com/amir-arad)に心から感謝します！*

![ ](https://cdn.sanity.io/images/cgdhsj6q/production/7b50342f54c86b9c7454b4655f443e0a83b47bc8-800x472.webp?w=1600&q=95&fit=max&auto=format)

## はじめ方

まず、開発者マシンにSocket Firewallをインストールしてください。最も簡単なのはnpm経由のインストールです。

```
npm i -g sfw
# 以降、パッケージマネージャーのコマンドの前にsfwを付けて実行します
sfw npm install --save dangerous-package
sfw pip install dangerous-package
```

重要: Socket Firewallはパッケージアーティファクトへのネットワークリクエストをブロックする仕組みです。アーティファクトがローカルにキャッシュされていてネットワークリクエストが発生しない場合、`sfw`がブロックできるものはありません。`npm cache clean --force`などでパッケージマネージャーのキャッシュをクリアし、それ以降`sfw`を利用することをお勧めします。

リリースページから適切なバイナリをダウンロードし、PATHに配置して実行可能に設定する手動インストールも可能です。ただしその場合、古いバージョンのサポートが終了した際にはバイナリを定期的に更新する必要があります。

CI/CD環境で`sfw`を利用したい場合は、常に最新バージョンが実行されるようにするGitHub Actionを提供しています。

```
on: push

jobs:
  job-id:
    # Socket FirewallはLinux、Windows、macOSをサポートします
    runs-on: ubuntu-latest
    steps:
      # Socket Firewallをランナー環境に追加
      - uses: socketdev/action@v1
        with:
          mode: firewall
          
      # プロジェクトのセットアップ（checkoutやsetup-nodeなど）
      - uses: actions/checkout@v5
      
      # 使用例
      - run: sfw npm ci
      - run: sfw npm install lodash
      - run: sfw pip install requests
```

数日以内に、Socket Firewallは他の新しいCLI機能とともにSocket CLIにも統合される予定です。近日公開のブログ記事にご期待ください。

## Socket Firewall FreeとSocket Firewall Enterpriseの比較

Socket Firewall Freeは、オープンソースおよび商用プロジェクトの両方で無料で利用できます。この取り組みを持続可能なものとし、悪用を防ぐため、いくつかの制限を設けています。

- カスタムレジストリはSocket Firewall Freeではサポートされません。これは有料版で提供予定です。
- マルウェアの特定には、AIによるスキャンと人によるレビューの両方を活用しています。
  - 可能性のあるマルウェアがパッケージマネージャーから要求された場合、Socket Firewall Freeは警告を表示しますが、該当するネットワークトラフィックはブロックしません。
  - 有料版ではAIが検出したマルウェアに対する挙動を設定できます。
  - 具体例として、SocketのAIは`tinycolor`マルウェアを公開から1時間以内に検知しましたが、AI検知には誤検知の可能性もあります。適切なブロックポリシーは組織ごとのリスク許容度やニーズによって異なります。
- 前述のとおり、Socket Firewall Freeがサポートするのは`npm`、`yarn`、`pnpm`、`pip`、`uv`、`cargo`です。他のエコシステムへの対応は有料版で提供されます。
- 未知または未スキャンのパッケージバージョンは、Socket Firewall Freeではブロックされません。有料版では設定可能です。
- Socket Firewall Freeには特定のパッケージやバージョンを許可リストに追加する機能がありません。許可リスト機能は有料版で提供されます。
- 濫用が検出された場合を除き、Socket Firewall Freeの利用にレート制限はありません。設定された制限値は非常に大きく、通常の利用で到達することはありません。

|  | Socket Firewall Free | Socket Firewall Enterprise |
| --- | --- | --- |
| 有料プランが必要か | いいえ | **はい（Enterprise）** |
| カスタムレジストリ | 非対応 | **対応** |
| 対応エコシステム | JS、TS、Python、Rust | **すべての言語** |
| ダッシュボードでのデータ提供 | なし | **あり** |
| 認証 / APIキー設定 | なし | **あり** |
| セキュリティポリシー設定 | 設定不可（既知マルウェア→ブロック、可能性のあるマルウェア→警告） | **あり（組織全体ポリシー）** |
| 利用状況データ収集 | あり | **あり（設定可）** |
| レート制限 | 濫用時のみ | 濫用時のみ |
| 対応運用モード | ラッパーのみ | **ラッパー + クライアント/サーバー** |
| 連鎖HTTPプロキシ | なし | **あり** |

## テレメトリー

Socket Firewall Freeは匿名化されたテレメトリーを収集します。懸念を持つ方がいると理解しているため、収集内容と目的を透明に共有します。

- マシンごとの[一意で不可逆な識別子](https://www.npmjs.com/package/node-machine-id)。これにより利用傾向を把握できます。
- ブロックまたは許可されたパッケージに関する情報（名前、名前空間、バージョンなど）。
- Socket Firewallがパッケージ取得時に追加した遅延。サービス劣化の検知や改善効果の測定に役立てます。
- エラー情報。内容は最小限で、ローカルファイルシステムの情報（コールスタック、パス、ファイル名など）は含みません。
- GitHub組織名。チーム単位での普及状況を把握するため、設定済みリモートからGitHubの組織名を取得する場合があります。取得するのは組織名のみで、リポジトリ名、ソースコード、コミット履歴は収集しません。

今後、利用状況の学習や機能追加に伴い、追加のテレメトリーイベントを導入する可能性がありますが、収集する情報は常に匿名化されます。

テレメトリーは有料版で設定可能になります。

## ライセンス

Socket Firewall Freeは[PolyForm Shield License 1.0.0](https://polyformproject.org/licenses/shield/1.0.0)の下で提供されます。ライセンス本文は[インストーラーリポジトリ](https://github.com/SocketDev/sfw-free/blob/main/README.md#license)でも確認できます。

## 今すぐ試そう

Socket Firewall Freeを試した感想をぜひお聞かせください。`sfw`の利用で問題があれば、[sfw-free Issues](https://github.com/SocketDev/sfw-free/issues)からお知らせください。Socket Firewall Enterpriseについて詳しく知りたい場合は、<sales@socket.dev>まで連絡するか、[デモを予約](https://socket.dev/demo)してください。

### 悪意や脆弱性を含む依存関係を今すぐブロックしませんか？

[GitHubアプリをインストール](https://socket.dev/github-app) [デモを予約](https://socket.dev/demo)

![Introducing Custom Pull Request Alert Comment Headers](https://cdn.sanity.io/images/cgdhsj6q/production/f0f4af949384a8b093e981df2758b89f601424de-1600x704.png?w=400&q=95&fit=max&auto=format)

プロダクト

### カスタムPull Requestアラートコメントヘッダーの紹介

執筆: André Staltz - 2025年9月12日

![Rust Support Now in Beta](https://cdn.sanity.io/images/cgdhsj6q/production/e1a4a038c6612e911eea736957afd7a0f5476e85-950x952.png?w=400&q=95&fit=max&auto=format)

プロダクト

### Rustサポートがベータ版に移行

SocketのRustサポートがベータ段階に移行しました。すべてのユーザーがCargoプロジェクトをスキャンし、Cargo.tomlのみのクレートも含め、Rustに対応したサプライチェーンチェックとSBOM生成を利用できます。

執筆: Mikola Lysenko, Trevor Norris - 2025年9月11日

![Announcing Socket Fix 2.0](https://cdn.sanity.io/images/cgdhsj6q/production/849171061acce2b405fb5ac769b3d4abe8f97b8e-813x618.png?w=400&q=95&fit=max&auto=format)

プロダクト

### Socket Fix 2.0を発表

Socket Fix 2.0は、的を絞ったCVE対応、より賢いアップグレード計画、より広範なエコシステムサポートを提供し、開発者がアラートをゼロに近づけるのを支援します。

執筆: Martin Torp, John-David Dalton, Jeppe Fredsgaard Blaabjerg, Benjamin Barslev, Oskar Haarklou Veileborg - 2025年9月10日
