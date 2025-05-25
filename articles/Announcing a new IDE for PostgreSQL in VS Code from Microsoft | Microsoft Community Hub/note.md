---
title: "Announcing a new IDE for PostgreSQL in VS Code from Microsoft | Microsoft Community Hub"
source: "https://techcommunity.microsoft.com/blog/adforpostgresql/announcing-a-new-ide-for-postgresql-in-vs-code-from-microsoft/4414648"
author:
  - "JoshMSFT"
published: 2025-05-19
created: 2025-05-25
description: "MicrosoftがVisual Studio Code向けの新しいPostgreSQL拡張機能のパブリックプレビューを発表。データベース管理と開発ワークフローを統合し、GitHub Copilotの'@pgsql'エージェントによるAIアシスタンス機能を提供。"
tags:
  - "PostgreSQL"
  - "VS Code"
  - "GitHub Copilot"
  - "データベース管理"
  - "AI開発支援"
  - "Azure Database"
  - "Entra ID"
  - "スキーマ可視化"
---

# VS Code用PostgreSQL拡張機能の発表

MicrosoftがVisual Studio Code (VS Code) 向けの新しいPostgreSQL拡張機能のパブリックプレビューを発表しました。この拡張機能は、PostgreSQLデータベース管理と開発ワークフローの簡素化を目的として設計されており、コンテキスト対応IntelliSenseと'@pgsql' GitHub Copilotエージェントによるインテリジェントアシスタンスを通じて、開発者がお気に入りのコードエディターから離れることなくデータベースオブジェクトの管理とクエリの作成を可能にします。

## 開発者の課題への対応

この拡張機能は以下の重要な開発者の課題に対処します：

### 統計に基づく問題認識

- **タスク切り替えの困難**: [2024 StackOverflow Developer Survey](https://survey.stackoverflow.co/2024/)によると、41%の開発者がタスクの切り替えに苦労
- **デバッグ時間の浪費**: [2024 Stripe Developer Coefficient Report](https://stripe.com/files/reports/the-developer-coefficient.pdf)では、開発者がデバッグとトラブルシューティングに最大50%の時間を費やしていることを報告
- **ツールの断片化**: データベース管理とアプリケーション開発を統合するツールの不足

### 解決策の提供

PostgreSQL拡張機能は、Postgresデータベースツールと@pgsql GitHub Copilotエージェントを統合することで統一された開発体験を提供し、Entra ID認証による一元化されたアイデンティティ管理とAzure Database for PostgreSQLとの深い統合により、開発者が断片化したワークフローではなく革新的なアプリケーションの構築に集中できるよう支援します。

## 主要機能の詳細

### 1. スキーマ可視化

- **操作方法**: Object Explorerでデータベースエントリを右クリック → "Visualize Schema"を選択
- **利便性**: 直感的なコンテキストメニューによる簡単な操作

### 2. データベース対応GitHub Copilot

**AI支援機能**:

- VS Code内でPostgreSQLデータベースコンテキストを提供するAIアシスタンス
- PostgreSQLの学習曲線を緩和し、開発者の生産性を向上
- 自然言語による簡素化されたデータベース操作

**利用可能なコマンド**:

- `@pgsql`: データベースのクエリ、スキーマの最適化、SQL操作を簡単に実行
- コンテキストメニュー: "Rewrite Query"、"Explain Query"、"Analyze Query Performance"
- リアルタイムエキスパートレベルのガイダンス

### 3. GitHub Copilot Chatエージェントモード

**機能概要**:

- データベースコンテキスト対応のインテリジェントアシスタント
- 質問応答を超えた多段階タスクの実行能力
- ワークスペースからの追加コンテキスト取り込み
- ユーザー許可を得た自律的なコード記述・デバッグ

**実用例**:

- 自然言語プロンプトによる新規データベース作成
- PostGIS拡張機能の有効化
- サーバー接続の一覧表示と接続処理
- データベース変更前のユーザー許可確認機能

### 4. データベース接続管理

**接続オプション**:

- ローカルおよびクラウドホストPostgreSQLインスタンスへの簡素化された接続管理
- 複数の接続プロファイルと接続文字列解析によるセットアップ支援
- Azure Database for PostgreSQLデプロイメントの直接ブラウジングとフィルタリング

**Azure統合**:

- "Browse Azure"オプションによる既存デプロイメントへの簡単接続
- ローカルDockerデプロイメントへの接続サポート

### 5. Entra IDによるパスワードレス認証

**認証機能の利点**:

- **合理化された認証**: 手動ログインの排除
- **自動トークン更新**: 認証タイムアウトリスクの最小化
- **強化されたセキュリティ**: Entra-IDの安全な認証プロトコル活用
- **時間効率性**: トークン管理の自動化
- **エンタープライズ互換性**: 企業セキュリティ基準への準拠
- **ユーザー一貫性**: 既存Entra-ID認証情報の利用

### 6. データベースエクスプローラー

**管理機能**:

- スキーマ、テーブル、関数などのデータベースオブジェクトの構造化ビュー
- データベースオブジェクトの作成、変更、削除機能
- 直感的なインターフェースによる効率的な管理

### 7. クエリ履歴

**機能詳細**:

- Object Explorer下部でのセッションクエリ履歴へのアクセス
- 以前実行したクエリの迅速な確認と再利用
- 開発効率の向上

### 8. コンテキスト対応IntelliSenseによるクエリ編集

**支援機能**:

- SQLキーワード、テーブル名、関数の自動補完
- シンタックスハイライトと自動フォーマッティング
- クエリ履歴追跡による再利用支援

## 差別化要因と競合優位性

### 他ツールとの違い

1. **生産性向上**: コンテキスト対応IntelliSenseとSQLフォーマッティングによる時間節約とエラー削減
2. **AI統合**: pgsql GitHub Copilot Chatエージェントによるデータベースとワークスペースのコンテキスト認識
3. **迅速な導入**: Connection Managerによる数分での開始
4. **セキュリティ強化**: Entra ID統合による堅牢なアクセス制御
5. **包括的ツールセット**: データベース管理、クエリ実行、インスタンスデプロイのVS Code内統合
6. **クラウド統合**: Azure Database for PostgreSQLとのシームレスな統合

## インストールと設定

### インストール手順

1. VS CodeでExtensions viewを開く
2. Extensions Marketplaceで「PostgreSQL」を検索
3. 青い象アイコンのPreview PostgreSQL拡張機能を選択・インストール

**拡張機能ID**: `ms-ossdata.vscode-pgsql`  
**入手先**: [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql)

### PostgreSQL GitHub Copilot Chatの有効化

**必要な前提条件**:

- GitHub CopilotおよびGitHub Copilot chat拡張機能のインストール
- GitHubアカウントへのログイン
- チャットインターフェースでの「@pgsql」コマンド使用

## フィードバックとサポート体制

### フィードバック収集

- VS Code組み込みフィードバックツールの活用
- コミュニティのニーズに基づく拡張機能の改良
- 開発者コミュニティとの継続的な対話

### ライセンス更新予定

現在のプレビューライセンス言語について、すべてのPostgresユーザーへの公平なアクセス提供を目標として、ライセンスの更新を予定。

## 開始方法と追加リソース

### 推奨行動

- パブリックプレビューの即座の試用
- PostgreSQLデータベースでの改善されたワークフロー体験
- 開発効率と生産性の大幅向上の実感

### 詳細情報とリソース

- **公式ドキュメント**: <https://aka.ms/pg-vscode-docs>
- **更新情報**: 定期的なバージョンアップデートの確認
- **コミュニティ参加**: フィードバック提供と機能要求

### 開発チームへの謝辞

*@pgsql GitHub Copilotでの貢献に対する[Jonathon Frost, Principal PM](https://www.linkedin.com/in/jjfrost)への特別な感謝*

**最終更新**: 2025年5月23日  
**バージョン**: 7.0
w

## まとめ

このPostgreSQL拡張機能は、VS Codeエコシステム内でのデータベース開発体験を根本的に変革するツールです。AI支援、クラウド統合、セキュリティ強化、そして直感的なユーザーインターフェースの組み合わせにより、現代の開発ワークフローに最適化されたソリューションを提供しています。
