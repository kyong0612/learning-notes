---
title: "Apollo MCP Server 1.0 is Generally Available | Apollo GraphQL Blog"
source: "https://www.apollographql.com/blog/apollo-mcp-server-1-0-is-generally-available"
author:
  - Kevin Chu
published: 2025-10-07
created: 2025-10-09
description: "Apollo MCP Server 1.0のGAアナウンス。AIエージェントをGraphQL APIに接続する標準ベースの強力で信頼性の高いツール。GraphQL操作をMCPツールに変換し、LLMが効率的にAPIにアクセスできるようにする。"
tags:
  - MCP
  - Apollo
  - GraphQL
  - AI-Agent
  - Agentic-AI
  - LLM
  - API-Orchestration
  - OpenTelemetry
---

## 概要

2025年10月7日、Apolloは**Apollo MCP Server 1.0**の一般提供（GA）を発表しました。これは、AIエージェントアプリケーションを構築する際の課題である「LLMへの信頼性の高い効率的なAPIアクセス」を解決するツールです。MCP（Model Context Protocol）は、この接続の標準を提供し、Apollo MCP Serverは任意のGraphQL APIをLLMに接続する標準ベースの方法を提供します。

## Apollo MCP Serverの機能

### コア機能

**1. GraphQL操作のMCPツール化**

- 保存したクエリ（例：`GetCustomerOrders`）は即座にMCPツールとして利用可能
- ラッパーコードや手動ツール定義は不要
- GraphOS Studio Explorerでテストした操作がそのままエージェントで実行される

**2. ホットリロード**

- GraphQL操作を変更すると即座にエージェントで利用可能
- 再起動やリビルド不要
- エージェント動作の反復開発に最適なフィードバックループ

**3. インテリジェントなスキーマ探索**

- 事前定義された操作の実行だけでなく、組み込みのイントロスペクション（introspection）およびexecuteツールによる動的なAPI操作
- エージェントが「Customerタイプにどんなフィールドがある？」といった質問に対して構造化された回答を得られる
- より限定的なスコープが必要な場合はこれらのツールを無効化可能

**4. セマンティック検索による効率的な発見**

- スキーマ全体を処理（トークンコストが高い）する代わりに、関連するタイプとフィールドを検索
- 例：在庫データを探す場合、`Product.inventory`、`Warehouse.stockLevels`、`Order.inventorySnapshot`など関連部分のみを返す
- コンテキストウィンドウを効率的に利用

**5. トークンの効率的な使用**

- GraphQLは標準でデータに対して非常に正確で、トークンコストを節約し、コンテキスト汚染によるハルシネーションリスクを軽減
- `introspect`や`search`を使用するエージェントでは、結果の最小化（minification）をサポートしてコンテキストウィンドウの使用を最適化
- 数千のエージェント操作全体で、これらの節約は大きな効果をもたらす

**6. Persisted Queriesによる本番環境の安全性**

- 任意のクエリを許可する代わりに、事前承認された操作セットに制限
- 各クエリに一意のIDを付与し、エージェントはマニフェストからの操作のみを実行可能
- 悪意のあるクエリや高コストなクエリを防ぎながら、ニーズの変化に応じて操作セットを更新する柔軟性を維持

**7. Contractsによるスキーマの範囲制限**

- [Apollo Contracts](https://www.apollographql.com/docs/graphos/platform/schema-management/delivery/contracts/overview)を使用して、異なるエージェント用に異なるスキーマビューを作成
- 例：カスタマーサポートエージェントには顧客データと注文情報を表示、内部価格マージンは非表示
- 分析エージェントには集約データへのアクセスを許可、個人識別情報（PII）は非公開
- 同じ基盤のGraphQL API、異なる境界付きコンテキスト

### 運用機能

**1. OAuthによるセキュリティ**

- [MCP仕様](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)を実装し、他のスタックと同じIDプロバイダーで認証
- JWT検証、オーディエンス制限、動的クライアント登録、スコープ強制をサポート
- 詳細は[認証に関するブログ記事](https://www.apollographql.com/blog/introducing-authorization-for-apollo-mcp-server)を参照

**2. 柔軟なトランスポートオプション**

- ローカル開発では、MCP Inspectorなどのツールでstdioトランスポートを使用
- 本番環境では、ロードバランサー背後のリモートMCPサーバー向けにストリーム可能なHTTPに切り替え
- 同じ設定が環境変数のオーバーライドで異なる環境で動作

**3. YAML設定と環境変数**

- YAMLで設定を定義し、異なるデプロイメント用に環境変数でオーバーライド
- 標準的なDevOpsプラクティス、サプライズなし

**4. ヘルスモニタリング**

- 設定可能なしきい値を持つLivenessおよびReadinessプローブ
- Kubernetes、ロードバランサー、モニタリングシステムと統合
- MCPサーバーが正常でエージェントリクエストを処理できる状態かを把握

### 1.0の新機能

**1. OpenTelemetry統合による可観測性**

- AIエージェントは予測不可能な使用パターンと複雑なリクエストフローを生成
- OpenTelemetry統合により、信頼性の高いサービス運用に必要な可視性を提供
- 監視できる内容：
  - **エージェント動作**：最も頻繁に使用されるツールと操作
  - **パフォーマンス**：ツール実行全体の応答時間とボトルネック
  - **信頼性**：エラー率とリクエスト成功パターン
  - **分散リクエストフロー**：エージェントリクエストからApollo Routerおよびサブグラフまでの完全なトレース、自動トレースコンテキスト伝播
- メトリクス、トレース、イベントを任意のOTLP互換コレクターにエクスポート、既存の可観測性スタックとシームレスに統合

**2. CORSサポート**

- ブラウザベースのエージェントが可能に
- 完全にブラウザで実行されるエージェントインターフェースの構築、または既存のWebアプリへのAI機能の統合
- 許可されたオリジンの設定、認証情報の適切な処理、セキュリティの維持

**3. 本番環境対応**

- バージョン1.0は、Apollo MCP Serverが安定して本番環境で使用可能であることを示す
- [GitHub](https://github.com/apollographql/apollo-mcp-server)、[Apollo Community](https://community.apollographql.com/c/mcp-server/41)、および標準的なApolloチャネルでサポート継続

## エージェントにとってのGraphQLの利点

**1. 関連データの単一リクエスト取得**

- RESTベースのエージェントは顧客注文の詳細を収集するのに5回のAPI呼び出しが必要な場合がある
- GraphQLでは1回のクエリで必要なものを正確に取得
- 低レイテンシ、少ないトークン、シンプルなエージェントロジック

**2. 自己文書化スキーマ**

- GraphQLスキーマには説明、型、リレーションシップが含まれる
- エージェントは`customerId`フィールドが存在することだけでなく、それがCustomerオブジェクトを参照するID型であることを理解
- このセマンティックな理解により、エージェントはどの操作を使用するかについてより良い決定を下せる

**3. 型安全性によるエラー防止**

- 強い型付けにより、エージェントは各操作が期待する入力と返されるデータを正確に把握
- APIが予期しないnullや異なるデータ型を返す際のランタイムサプライズがなくなる

**4. 宣言的なリレーションシップ処理**

- これがエージェントにとってGraphQLが本当に輝く部分
- 複数のAPI呼び出しを調整するコードを書く代わりに、クエリでリレーションシップを宣言的に表現
- エージェントは必要なものを伝え、GraphQLが効率的に取得する方法を解決

この調整レイヤーがないと何が起こるか：考えられるすべてのAPI呼び出しシーケンスのカスタムコードを書く（脆弱で時間がかかる）か、LLMにREST APIをチェーン化する方法を考えさせる（予測不可能でエラーが発生しやすい）。GraphQLは原則的な中間地点を提供します。リレーションシップはスキーマで定義され、トラバーサルは予測可能に行われます。

確かに、GraphQLスキーマの構築には初期投資が必要です。Apollo Connectorsのようなツールでこれを簡単にすることに取り組んでいます。しかし、一度スキーマを持てば、それは信頼性の高いエージェント操作の基盤となります。新しいユースケースごとに調整コードを書く必要はありません。LLMが正しくAPI呼び出しをシーケンス化することを期待する必要もありません。

## 今後の展望

Apollo MCP Server 1.0は現在GraphQL APIを提供していますが、より広い機会が見えています。AIエージェントを任意のAPIやデータソース（REST、gRPC、データベース）に接続でき、Apolloが調整を処理できたらどうでしょうか？このビジョンは、GraphQLだけでなく、すべてのAI-アプリケーション間の相互作用のための宣言的調整プラットフォームになることを目指しています。

[Apollo Connectors](https://www.apollographql.com/graphos/apollo-connectors)でこれをすでに探求しており、REST APIを変更せずにGraphQLに取り込むことができます。基本要素が揃い始めています：スキーマフェデレーション、コントラクトベースの境界、そして現在のMCP統合。各要素が、GraphQLだけでなく、AIエージェントがアクセスする必要があるスタック全体のための普遍的な調整レイヤーに近づけています。

## 開始方法

AIエージェントをGraphQL APIに接続する準備はできましたか？[Apollo MCP Server 1.0](https://www.apollographql.com/docs/apollo-mcp-server)は本日利用可能です。インストールして、スーパーグラフに接続し、宣言的調整がAIアプリケーションをどのように変革するかを確認してください。

フィードバックや興味深いユースケースがありますか？[GitHub](https://github.com/apollographql/apollo-mcp-server)でissueを作成するか、[コミュニティ](https://community.apollographql.com/tag/mcp)で経験を共有してください。皆さんの意見が直接ロードマップを形作ります。
