---
title: "awesome-scalability"
source: "https://binhnguyennus.github.io/awesome-scalability/"
author:
  - "Binh Nguyen"
published:
created: 2025-10-18
description: "大規模システムにおけるスケーラビリティ、信頼性、パフォーマンスのパターンを解説する包括的なリソースコレクション。主要テック企業の実際のアーキテクチャ事例、ベストプラクティス、技術記事、講演資料などを体系的に整理したキュレーション。"
tags:
  - "scalability"
  - "distributed-systems"
  - "architecture"
  - "reliability"
  - "performance"
  - "microservices"
  - "big-data"
  - "machine-learning"
  - "system-design"
---

## 概要

**awesome-scalability** は、スケーラブルで信頼性が高く、高パフォーマンスな大規模システムの構築パターンを解説する、厳選されたリソースコレクションです。主要なテクノロジー企業のエンジニアによる記事や、実証済みのシステムから得られた知見をもとに、数百万から数十億のユーザーを支えるシステムの事例研究を提供しています。

### プロジェクトの目的

このリソースは、以下のような状況に応じた実践的なガイダンスを提供します：

- **システムが遅い場合**: スケーラビリティの問題（単一ユーザーには高速だが、高負荷下では遅い）とパフォーマンスの問題（単一ユーザーでも遅い）を区別し、設計原則を確認し、主要企業での解決事例を学習
- **システムがダウンする場合**: 可用性と安定性の問題に対処
- **システム設計面接の準備**: 実世界のアーキテクチャ図、面接ノート、技術講演を参照
- **チーム構築**: 採用、マネジメント、組織文化、コミュニケーションなどの観点からのスケーリング戦略

## 主要コンテンツカテゴリ

### 1. 基本原則 (Principle)

大規模システム構築の基礎となる設計原則とベストプラクティス：

- **アーキテクチャ設計**: Twelve-Factor App、Clean Architecture、マイクロサービスとモノリス
- **データ管理**: CAP定理、ACID vs BASE、SQLとNoSQLの選択
- **分散システム**: シャーディング、一貫性ハッシュ、結果整合性
- **パフォーマンス**: レイテンシの理解、キャッシング戦略
- **障害対応**: カオスエンジニアリング、自己修復設計
- **スケーラビリティ**: スケールアップ vs スケールアウト、ステートレス設計

主要な参考資料：

- Eric Brewerによる巨大規模サービスからの教訓
- Jeff Deanによる大規模分散システムの設計と教訓
- James Hamiltonによる効率性、信頼性、スケーリング

### 2. スケーラビリティ (Scalability)

システムをスケールするための技術とパターン：

#### マイクロサービスとオーケストレーション

- **主要企業の事例**:
  - Uber: ドメイン指向マイクロサービスアーキテクチャ
  - Netflix: Conductor（マイクロサービスオーケストレーター）
  - Pinterest: Kubernetes Platform構築
  - Spotify: Kubernetes上でのマイクロサービス展開

#### 分散キャッシング

- **実装例**:
  - Netflix: EVCache（分散インメモリキャッシュ）
  - Uber: AresDB（GPU駆動リアルタイム分析エンジン）
  - Instagram: Redisに数億のキーバリューペアを保存
  - Wix: 1億ユーザーへのスケールとキャッシング戦略

#### 分散ロッキングとトレーシング

- Google: Chubby（疎結合分散システム向けロックサービス）
- Twitter: Zipkin（分散システムトレーシング）
- Facebook: Canopy（スケーラブル分散トレーシング＆分析）

#### 分散スケジューリング

- Airbnb: Chronos（cronの代替）
- Uber: Peloton（多様なクラスターワークロード向け統合リソーススケジューラー）
- 主要企業でのAirflow活用事例（Airbnb、Lyft、Robinhoodなど）

#### 分散モニタリングとアラート

- Netflix: Telltale（アプリケーションモニタリング）
- LinkedIn: ThirdEye（モニタリングプラットフォーム）
- Uber: M3（メトリクスとモニタリングプラットフォーム）

#### 分散セキュリティ

- Netflix: Aardvark & Repokid（AWS最小権限の実現）
- Coinbase: クラウドでのビットコイン保管インフラ
- Dropbox: WebAuthn対応によるセキュアなサインイン

#### 分散メッセージング、キューイング、イベントストリーミング

- **Kafka実装**:
  - LinkedIn: 大規模Kafka運用
  - Pinterest: スケールでのKafka運用
  - Uber: Kafkaを使った信頼性の高い再処理とデッドレターキュー
  - Shopify: Kubernetes上でのKafka運用

- **その他のメッセージングシステム**:
  - Uber: Cherami（非同期タスク転送用メッセージキューシステム）
  - Airbnb: Dynein（分散遅延ジョブキューイングシステム）
  - Netflix: Timestone（優先度キューイングシステム）

#### イベント駆動アーキテクチャ

- **イベントソーシング**:
  - Netflix: ダウンロードのためのイベントソーシングのスケーリング
  - eBay: イベントソーシングの実装
  - Alibaba: ドメイン駆動設計

- **Pub-Sub**:
  - Yahoo: Pulsar（大規模Pub-Subメッセージング）
  - Facebook: Wormhole（Pub-Subシステム）
  - Pinterest: MemQ（クラウドネイティブPub-Subシステム）

#### 分散ロギング

- LinkedIn: 分散システムのロギング
- Pinterest: スケーラブルで信頼性の高いログ取り込み
- Twitter: 高性能レプリケートログサービス
- Facebook: LogDevice（ログ用分散データストア）

#### 分散検索

- Instagram: 検索アーキテクチャ
- Pinterest: ユニバーサル検索システム
- LinkedIn: Galene（検索アーキテクチャ）
- Airbnb: Nebula（検索バックエンド構築用ストレージプラットフォーム）

#### 分散ストレージ

- **オブジェクトストレージ**:
  - Uber: HDFSのスケーリング
  - Dropbox: Magic Pocket（自社構築マルチエクサバイトストレージシステム）
  - LinkedIn: Ambry（分散不変オブジェクトストア）

- **リレーショナルデータベース**:
  - Uber: MySQLのスケーリング
  - Pinterest: MySQLシャーディング
  - Facebook: MySQL RaftとMySQL 5.6から8.0への移行

- **NoSQLデータベース**:
  - Instagram: Cassandraでのメッセージ保存
  - Discord: Cassandraでの数十億メッセージの保存
  - LinkedIn: Venice（分散キーバリューデータベース）
  - eBay: Akutan（分散知識グラフストア）

- **時系列データベース**:
  - Facebook: Beringei（高性能時系列ストレージエンジン）
  - Netflix: Atlas（インメモリ次元時系列データベース）
  - Pinterest: Goku（時系列データベース）

#### CI/CDのスケーリング

- Facebook: 継続的インテグレーションスタック
- Netflix: 分散リポジトリと依存関係を持つCI
- Dropbox: Bazelによる継続的インテグレーションとデプロイメント

### 3. 可用性 (Availability)

システムの可用性を確保するための戦略：

#### レジリエンスエンジニアリング

- LinkedIn: Project Waterbearによるレジリエンスエンジニアリング
- Quora: 災害に対するレジリエンスの確保
- Netflix: クラウドでの障害検出（Diffy）

#### フェイルオーバー

- LinkedIn: 大規模APIサービスのマルチクラスタリング
- GitHub: MySQL高可用性
- Netflix: エッジ認証とトークンに依存しないアイデンティティ伝播

#### ロードバランシング

- Facebook: 13億ユーザーをサポートするロードバランシングインフラ
- Netflix: Eureka、Zuul 2によるロードバランシング
- GitHub: GLBロードバランサー
- Uber: QALM（QoSロード管理フレームワーク）
- Dropbox: トラフィックインフラ（エッジネットワーク）

#### レート制限

- Cloudflare: 数百万のドメインへのスケーリングのためのレート制限
- Stripe: レート制限でのAPIスケーリング
- Yahoo: Cloud Bouncer（分散レート制限）

#### オートスケーリング

- Pinterest: オートスケーリング
- Square: リクエストキューイングに基づくオートスケーリング
- Netflix: Scryer（予測オートスケーリングエンジン）
- Spotify: リクエストキューに基づくPub-Subコンシューマのオートスケーリング

#### 高可用性事例

- LinkedIn: フィード高可用性のためのモニタリング
- Facebook: グローバルイベントのサポート
- Netflix: 高可用性のヒント
- Dropbox: データセンター運用の自動化

### 4. 安定性 (Stability)

システムの安定性を維持するための技術：

#### サーキットブレーカー

- Netflix: 分散システムでの障害許容性（タイムアウト、リトライ、スレッド分離、セマフォ、サーキットブレーカー）
- SoundCloud: レジリエンスの教訓
- Airbnb: 分散決済システムでの二重支払いの回避
- Heroku: サーキットブレーカーによる本番安定性の向上

#### タイムアウト管理

- DoorDash: タイムアウトの強制（信頼性手法）
- eBay: tcp_tw_recycleを有効にしたVIP接続タイムアウト問題のトラブルシューティング

#### その他の安定性パターン

- Booking.com: MySQLのクラッシュセーフレプリケーション
- バルクヘッド: 一部での障害の分割と許容
- スロットリング: 安定したペースの維持
- LinkedIn: 大規模モノリシックAPIサービスのマルチクラスタリング
- Riot Games: League of Legendsサーバーでの決定論

### 5. パフォーマンス (Performance)

システムパフォーマンスの最適化手法：

#### OS、ストレージ、DB、ネットワークの最適化

- Instagram: バックグラウンドデータプリフェッチによるパフォーマンス向上
- LinkedIn: Linuxファイルシステムパフォーマンス低下の修正
- eBay: ネットワークI/Oボトルネック解決のための圧縮技術
- Dropbox: 高スループットと低レイテンシのためのWebサーバー最適化
- Netflix: 60秒でのLinuxパフォーマンス分析
- Uber: PythonとCeleryでjemalloc使用によるRAM使用量40%削減

#### ガベージコレクションの調整

- LinkedIn: Javaアプリケーションでのガベージコレクション
- Instagram: Python GCによるリクエストごとのメモリ成長50%削減
- GitHub: Out of Band GC（OOBGC）削除のパフォーマンス影響
- Uber: 大規模サービス向けJVMチューニング

#### 画像、動画、ページロードの最適化

- Facebook: 大規模での360度写真の最適化
- Etsy: 写真インフラでの画像ファイルサイズ削減
- Pinterest: GIFとビデオ再生のパフォーマンス向上
- Netflix: Dynamic Optimizerによる低帯域幅向けビデオストリーム最適化
- YouTube: アダプティブビデオストリーミング

#### Brotli圧縮によるパフォーマンス最適化

- LinkedIn: Brotli圧縮によるサイト速度向上
- Booking.com: Brotliの活用
- Dropbox: 静的コンテンツへのBrotliデプロイ
- Yelp: Brotliによるプログレッシブエンハンスメント
- DoorDash: 圧縮によるRedisの高速化

#### 言語とフレームワークの最適化

- Netflix: Pythonの活用
- Instagram: 大規模でのPython（Strict Modulesなど）
- Etsy: TypeScriptへの移行
- Discord: GoからRustへの切り替え
- Netflix: Java 21仮想スレッド

### 6. インテリジェンス (Intelligence)

ビッグデータと機械学習の大規模実装：

#### ビッグデータプラットフォーム

- **データプラットフォーム**:
  - Uber: ビッグデータプラットフォーム
  - Netflix: データプラットフォーム
  - Airbnb: データインフラストラクチャ
  - LinkedIn: データインフラストラクチャ
  - Pinterest: データ取り込みインフラとアナリティクスアーキテクチャ
  - Spotify: データオーケストレーションサービス

- **アナリティクスパイプライン**:
  - Lyft: Redshiftから Apache HiveとPrestoへのアナリティクスパイプライン
  - PayPal: リアルタイム不正防止のためのMLデータパイプライン
  - LinkedIn: ビッグデータアナリティクスとML技術

- **リアルタイムアナリティクス**:
  - Uber: Apache Pinotを使ったモバイルアプリクラッシュのリアルタイムアナリティクス
  - King: RBEA（リアルタイムアナリティクスプラットフォーム）
  - Uber: AresDB（GPU駆動リアルタイムアナリティクスエンジン）、AthenaX（ストリーミングアナリティクスプラットフォーム）

- **データディスカバリー**:
  - Uber: Databook（メタデータでビッグデータを知識に変換）
  - Lyft: Amundsen（データディスカバリー＆メタデータエンジン）
  - Netflix: Metacat（ビッグデータを発見可能で意味のあるものに）

- **SparkとHadoopのスケーリング**:
  - LinkedIn: 10,000ノードを超えるHadoop YARNクラスターのスケーリング
  - Pinterest: ビッグデータアクセス制御のスケーリング
  - Spotify: ビッグデータ処理（Scioへの道）
  - Uber: Hadoopでのビッグデータ処理

#### 分散機械学習

- **MLプラットフォーム**:
  - Yelp: 機械学習プラットフォーム
  - Etsy: 機械学習プラットフォームの再設計
  - Zalando: 機械学習プラットフォーム
  - Uber: AI/MLインフラのスケーリング

- **レコメンデーションシステム**:
  - Lyft: レコメンデーションシステムと強化学習プラットフォーム
  - Etsy: レコメンデーション提供プラットフォーム構築
  - Spotify: ユーザー予測実行インフラ

- **分散深層学習**:
  - Uber: Horovod（TensorFlow用オープンソース分散深層学習フレームワーク）
  - Facebook: Aromaを使ったコードレコメンデーション
  - Yahoo: TensorFlowOnSpark、CaffeOnSpark

- **特定ユースケース**:
  - Uber: COTA（NLPと機械学習によるカスタマーケア改善）
  - Uber: Manifold（機械学習用モデル非依存ビジュアルデバッグツール）
  - Pinterest: PinText（マルチタスクテキスト埋め込みシステム）、SearchSage
  - Yelp: クリックスルー率予測のための勾配ブースティング木のスケーリング
  - TripAdvisor: 深層学習による写真選択改善、エクスペリエンスのパーソナライズドレコメンデーション

- **コンピュータビジョン**:
  - Mercari: 深層学習による画像分類
  - Hulu: コンテンツベースのビデオ関連性予測
  - Yelp: 不適切な動画コンテンツのモデレーション
  - Airbnb: コンピュータビジョン（アメニティ検出など）

- **自然言語処理**:
  - Medium: タグのマッピング
  - Condé Nast: 自然言語処理とコンテンツ分析

- **機械学習の本番化**:
  - Twitter: ワークフローによるMLの本番化
  - Dropbox: 機械学習による数十億の画像からのテキストインデックス化
  - Instagram: コアモデリング
  - LinkedIn: 偽アカウントの自動検出

### 7. アーキテクチャ (Architecture)

実際の大規模システムアーキテクチャの詳細：

#### テックスタック

- Medium: スタック
- Shopify: eコマーススケールのテックスタック
- Airbnb: サービス構築（4部構成）

#### サービスアーキテクチャ

- **特定サービス**:
  - Twitter: 広告プラットフォームアーキテクチャ
  - Uber: APIゲートウェイアーキテクチャ
  - Tinder: APIゲートウェイ構築方法
  - Slack: 基本アーキテクチャ
  - LinkedIn: バックエンド、リアルタイムプレゼンスプラットフォーム、設定プラットフォーム

- **プラットフォーム**:
  - Riot Games: APIプラットフォーム、チャットサービスアーキテクチャ
  - The New York Times: ゲームプラットフォーム
  - Netflix: Simone（分散シミュレーションサービス）
  - Yelp: Seagull（毎日2000万以上のテスト実行を支援する分散システム）

- **データとフィード**:
  - Pinterest: Following Feed、Interest Feed、Picked For Youのアーキテクチャ
  - Netflix: メディアデータベース
  - Dropbox: 同期エンジン（2部構成）

- **検索と発見**:
  - Box: 検索アーキテクチャ
  - Coupang: 検索ディスカバリーインデックスプラットフォーム
  - DoorDash: 検索エンジン

#### 金融・決済システムアーキテクチャ

- Monzo: バンクバックエンド
- Wealthsimple: スケール向けトレーディングプラットフォーム
- Margo Bank: コアバンキングシステム
- Nubank: アーキテクチャ
- Airbnb: 分散決済システムでの二重支払い回避
- Etsy: 決済のスケーリング（3部構成）
- Paytm: 毎日数百万のデジタルトランザクションの安全な処理

### 8. システム設計面接 (Interview)

システム設計面接の準備リソース：

#### 大規模システム設計

- Jeff Atwood: 私のスケーリングヒーロー
- Jeff Dean: 大規模分散システム構築からのソフトウェアエンジニアリングアドバイス
- スケール向けシステムアーキテクチャ入門
- システム設計面接の解剖学
- システム設計面接前に知っておくべき8つのこと
- トップ10のシステム設計面接質問
- ナッツシェルでの10の一般的な大規模ソフトウェアアーキテクチャパターン
- 45分のシステム設計面接でNetflixを設計しない方法
- API ベストプラクティス: Webhook、廃止、設計

#### 低レベルシステムの説明

- LinuxでのI/O待機時間の正確な意味
- Paxos Made Live: エンジニアリングの視点
- 分散ロッキングの方法
- SQLトランザクション分離レベルの説明

#### 「何が起こるか...そしてどのように」の質問

- Netflix: 再生ボタンを押したときに何が起こるか
- Monzo: P2P決済の仕組み
- GitHub: リクエストがGitHubに到達する方法（トランジットとピアリング）
- Spotify: 音楽のストリーミング方法

### 9. 組織 (Organization)

エンジニアリングチームとプロセスのスケーリング：

#### エンジニアリングレベルと役割

- SoundCloud: エンジニアリングレベル
- Palantir: エンジニアリング役割
- Dropbox: エンジニアリングキャリアフレームワーク

#### チームのスケーリング

- Twitter: エンジニアリングチームのスケーリング
- LinkedIn: チーム間での意思決定のスケーリング
- GOJEK: データサイエンスチームのスケーリング
- Zalando: アジャイルのスケーリング
- Intercom: プロダクトチームのスケーリングからの教訓
- Instagram: Datagramチームのスケーリング
- Shopify: デザインチームのスケーリング
- Wish: アナリティクスチーム構築（4部構成）

#### 開発プロセスと文化

- Vinted: エンジニアリングへのアプローチ
- Indeed: メトリクスを使った開発プロセス改善（と人のコーチング）
- Etsy: RACI（責任、説明責任、相談、情報提供）
- Zalando: リーダーシップの4つの柱（共感、インスピレーション、信頼、正直さ）
- Shopify: ペアプログラミング
- Asana: 分散責任
- Zalando: エンジニアのローテーション
- Pinterest: 実験アイデアレビュー
- Spotify: テックマイグレーション

#### コードレビュー

- Google: コードレビュー
- Palantir: コードレビューのベストプラクティス
- LINE: 効果的なコードレビュー
- Medium: コードレビュー
- LinkedIn: コードレビューによる集合的コード所有権のスケーリング
- Disney: より良いコードレビューの秘訣

### 10. 講演 (Talk)

主要エンジニアによる技術講演：

#### 分散システムとインフラ

- Tim Berglund（Confluent）: 1レッスンでの分散システム
- Jeff Barber & Shie Erlich（Facebook）: リアルタイムインフラの構築
- Marc Alvidrez（Google）: 信頼性の高いソーシャルインフラの構築
- Tammy Butow（Dropbox）: サイト信頼性エンジニアリング
- Melissa Binde（Google）: プラネットスケールインフラの実現方法
- Josh Evans（Netflix）: マイクロサービスガイド
- Jeff Dean（Google）: 大規模オンラインサービスでの高速応答時間の実現

#### スケーリング事例

- Simon Eskildsen（Shopify）: 80K RPSの有名人セールに対応するアーキテクチャ
- Bobby Johnson（Facebook）: スケールの教訓
- Alex Hoang & Nima Khoshini（GIPHY）: 3億ユーザーへのGIF配信
- Kevin Modzelewski（Dropbox）: Dropboxのスケーリング
- Lisa Guo（Instagram）: インフラのスケーリング
- Yao Yue（Twitter）: インフラのスケーリング
- Marty Weiner（Pinterest）: Pinterestのスケーリング
- Bing Wei（Slack）: バックエンドのスケーリング
- Matt Ranney（Uber）: バックエンドのスケーリング
- Eric Pickup（MindGeek）: 1日2億ビューへのスケーリング

#### 専門トピック

- Haiyong Wang（Alibaba）: 高性能パケット処理プラットフォーム
- Bill Jia（Facebook）: パフォーマンスでのスケーリング
- Sachin Kulkarni（Facebook）: 10億ユーザーへのライブビデオのスケーリング
- Dave Temkin（Netflix）: グローバルCDNのスケーリング
- Patrick Shuff（Facebook）: 13億ユーザーをサポートするロードバランシングインフラのスケーリング

## 重要な設計パターンとベストプラクティス

### システムが遅い場合

1. スケーラビリティ問題（単一ユーザーには高速だが高負荷下で遅い）とパフォーマンス問題（単一ユーザーでも遅い）を区別
2. 設計原則を確認し、主要企業でのスケーラビリティとパフォーマンス問題の解決方法を学習
3. データと機械学習を扱う場合はIntelligenceセクションを参照

### システムがダウンする場合

- 可用性と安定性の問題に対処
- "たとえすべてを失っても、冷静さを保てば再構築できる" - Thuan Pham（元Uber CTO）
- 落ち着いて可用性と安定性の事項に留意

### システム設計面接の準備

- 面接ノートと完成図付きの実世界アーキテクチャを参照
- ホワイトボードでシステムを設計する前に包括的な視点を得る
- 技術大手のエンジニアによる講演をチェックし、システムの構築、スケーリング、最適化方法を学習

### ドリームチームの構築

- チームスケーリングの目標はチームサイズの成長ではなく、チームのアウトプットと価値の増加
- 採用、マネジメント、組織、文化、コミュニケーションの様々な側面でテック企業がどのようにその目標を達成しているかを発見

## プロジェクトについて

このプロジェクトは、Binh Nguyenによって維持管理されており、GitHubで公開されています。コミュニティからの貢献が歓迎されており、リンクが古くなったり不適切な場合はプルリクエストの提出が推奨されています。

知識は力であり、共有された知識は力の倍増です。実際のバトルテストを経たシステムから得られた知見を学ぶことで、より効果的な大規模システムの設計と構築が可能になります。
