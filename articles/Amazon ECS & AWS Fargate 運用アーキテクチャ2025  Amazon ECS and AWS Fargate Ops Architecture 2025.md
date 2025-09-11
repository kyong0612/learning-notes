---
title: "Amazon ECS & AWS Fargate 運用アーキテクチャ2025 / Amazon ECS and AWS Fargate Ops Architecture 2025"
source: "https://speakerdeck.com/iselegant/amazon-ecs-and-aws-fargate-ops-architecture-2025"
author:
  - "新井 雅也 (iselegant)"
published: 2025-06-25
created: 2025-09-11
description: |
  この資料は、Amazon ECSおよびAWS Fargateの運用に焦点を当て、2025年時点での最新のアップデートを反映したベストなアーキテクチャとプラクティスを紹介します。特にロギング、メトリクス、トレース、デバッグといった非機能要件に関する運用設計の観点から、具体的な課題と解決策を解説しています。
tags:
  - "AWS"
  - "Amazon ECS"
  - "AWS Fargate"
  - "DevOps"
  - "Observability"
  - "Logging"
  - "Metrics"
  - "Tracing"
  - "Debugging"
---

## 全スライド

![Slide 1](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_0.jpg)
**タイトルスライド**: Amazon ECS & AWS Fargateの2025年における運用アーキテクチャについて。Synspective株式会社の新井雅也氏による発表。

![Slide 2](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_1.jpg)
**問題提起**: AWSサービスの機能は拡充されているが、多くのクラウドエンジニアがアーキテクチャ設計や運用面で悩みを抱えている現状を指摘。

![Slide 3](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_2.jpg)
**具体的な悩み**: 新規アーキテクチャの選択肢の多さ、既存アーキテクチャの陳腐化、継続的なアップデートのキャッチアップの難しさなどを挙げる。

![Slide 4](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_3.jpg)
**発表の目的**: 非機能要件、特に「運用」の側面に焦点を当て、最新のアップデートを交えながらECS/Fargateのベストなアーキテクチャとプラクティスを紹介する。

![Slide 5](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_4.jpg)
**自己紹介**: 発表者紹介のセクション。

![Slide 6](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_5.jpg)
**発表者情報**: 新井雅也氏のプロフィール。SynspectiveでPrincipal Cloud Architectとして勤務。好きなAWSサービスはAmazon ECSとAWS Fargate。

![Slide 7](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_6.jpg)
**本題**: ここからがプレゼンテーションの本編。

![Slide 8](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_7.jpg)
**発表内容の再確認**: 運用の側面に焦点を当て、ECS/Fargate中心の最新アーキテクチャとプラクティスを紹介。

![Slide 9](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_8.jpg)
**テーマの深掘り**: なぜ「運用」に焦点を当てるのかを問いかける。

![Slide 10](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_9.jpg)
**運用の重要性**: システムは構築後が本番であり、安定運用は顧客への価値提供の前提条件。障害対応やセキュリティ維持が運用の核であると説明。

![Slide 11](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_10.jpg)
**運用設計の思想**: 運用を「設計」として事前に落とし込むことの重要性を強調。想定外を減らし、トレードオフを理解した上で、クラウドの進化に合わせて運用もアップデートする必要がある。

![Slide 12](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_11.jpg)
**アジェンダ**: 本発表で取り上げる運用設計の観点（ロギング、メトリクス、トレース、デバッグ）を提示。

![Slide 13](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_12.jpg)
**各設計への疑問**: 各運用設計観点について、従来のプラクティスに対する一般的な疑問を投げかける（例：「CloudWatch Logsで良くない？」）。

![Slide 14](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_13.jpg)
**ロギング設計**: ロギング設計のセクション開始。

![Slide 15](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_14.jpg)
**疑問1**: 「普通にAmazon CloudWatch Logsを使えば良くない？」

![Slide 16](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_15.jpg)
**回答**: 小規模なシステムやログ量が少ない場合はCloudWatch Logsで十分であると認める。

![Slide 17](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_16.jpg)
**コストの問題**: ログ出力が増加すると、CloudWatch Logsの取り込みコスト（東京リージョンで$0.76/GB）が問題になる。クラウド破産を防ぐための重要ポイント。

![Slide 18](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_17.jpg)
**解決策**: FireLensを構成し、ログをCloudWatch LogsとAmazon S3に分散させることでコストバランスを図る。

![Slide 19](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_18.jpg)
**FireLensの注意点**: `aws-for-fluent-bit`イメージ内のFluent Bitのバージョンが古く、EOL済み（v1.9.10）。最新版の恩恵（Prometheusメトリクス、OpenTelemetry対応など）を受けられない。

![Slide 20](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_19.jpg)
**回避策**: 最新機能が必要な場合は、自前でFluent Bitのコンテナイメージを管理する必要がある。

![Slide 21](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_20.jpg)
**ロードマップ情報**: 2025年6月にAWSのコンテナロードマップにv4.0対応が追加され、2025年中のアップグレードを目指している。急ぎでなければ待つのも選択肢。

![Slide 22](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_21.jpg)
**ロギング設計のまとめ**: 小規模ならCloudWatch Logsで十分。ログ量が増えたらFireLensとS3でコスト最適化。`aws-for-fluent-bit`のバージョン乖離に注意し、今後のアップデートを注視する。

![Slide 23](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_22.jpg)
**メトリクス設計**: メトリクス設計のセクション開始。

![Slide 24](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_23.jpg)
**疑問2**: 「昔Amazon CloudWatch Container Insightsを有効化したが、他に考慮が必要？」

![Slide 25](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_24.jpg)
**新機能**: 2024年12月に「Container Insights with enhanced observability」が登場。ECSのコンテナワークロードに対し、コンテナレベルでのメトリクス取得が可能になった。

![Slide 26](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_25.jpg)
**メトリクスの違い(1)**: 通常のContainer Insightsで取得できるメトリクスの一覧。

![Slide 27](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_26.jpg)
**メトリクスの違い(2)**: `enhanced observability`で追加取得できる詳細なコンテナレベルのメトリクスの一覧。

![Slide 28](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_27.jpg)
**コスト比較**: `enhanced observability`の方が、取得できるメトリクスが多いにも関わらず、メトリクス単価が割安である。

![Slide 29](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_28.jpg)
**コスト考慮**: Container Insights自体が高コストなサービスであるため、本番環境と開発環境などで有効/無効を使い分けるなどのコストバランスを考慮する余地がある。

![Slide 30](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_29.jpg)
**メトリクス設計のまとめ**: `enhanced observability`の登場でメトリクスが強化された。しかし、サービス自体が高コストなため、環境に応じたコストバランスの考慮が重要。

![Slide 31](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_30.jpg)
**トレース設計**: トレース設計のセクション開始。

![Slide 32](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_31.jpg)
**疑問3**: 「AWSでトレース取得するならAWS X-Rayのサイドカー構成でいいのでは？」

![Slide 33](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_32.jpg)
**従来の構成**: 以前は、アプリケーションでX-Ray SDKを利用し、X-Rayデーモンをサイドカーとして構成するのが一般的だった。

![Slide 34](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_33.jpg)
**推奨される構成**: 現在は、OpenTelemetry準拠の計装を可能にする「AWS Distro for OpenTelemetry (ADOT)」の利用が推奨されている。

![Slide 35](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_34.jpg)
**ADOTの利点**: X-Rayを含む複数のバックエンドにテレメトリを送信可能で、X-Ray SDKよりも多くの言語ランタイム（Swift, Rust, PHPなど）をサポートしている。

![Slide 36](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_35.jpg)
**アーキテクチャの考慮**: Fluent BitやADOTコレクターを常にサイドカーとして構成するのがベストとは限らない。

![Slide 37](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_36.jpg)
**集約構成**: システム規模が大きくなると、コレクターを専用のECSサービスとして集約することで、リソース効率やコストバランスを図ることができる。

![Slide 38](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_37.jpg)
**トレース設計のまとめ**: OpenTelemetry準拠のADOTが推奨される。サードパーティツールへの転送も可能。大規模システムではサイドカーからの切り出し（サービス集約）が有効。

![Slide 39](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_38.jpg)
**デバッグ設計**: デバッグ設計のセクション開始。

![Slide 40](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_39.jpg)
**疑問4**: 「アプリ・NWそれぞれでトラブルが発生したらどうやってデバッグする？」

![Slide 41](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_40.jpg)
**心構え**: 「備えあれば憂いなし」。障害時調査のために、事前の段取りと環境整備を把握しておくことが重要。

![Slide 42](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_41.jpg)
**ユースケース1**: アプリケーションコンテナ環境のデバッグ。

![Slide 43](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_42.jpg)
**解決策1**: `ECS Exec`の活用。コンテナに直接シェルアクセスできる。ただし、利用にはOSパッケージ、IAM権限、ネットワーク設定などの事前準備が必要。

![Slide 44](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_43.jpg)
**ユースケース2**: ネットワークのデバッグ。

![Slide 45](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_44.jpg)
**解決策2**: `VPC Reachability Analyzer`の活用。ECSタスクにアタッチされたENIを指定して、ネットワーク疎通性を分析できる。

![Slide 46](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_45.jpg)
**解決策3**: デバッグ用カスタムコンテナ。`tcpdump`などのデバッグツールを含んだコンテナイメージを別途用意し、ECS Execと組み合わせることで柔軟な調査が可能になる。

![Slide 47](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_46.jpg)
**デバッグ設計(生成AI編)**: 生成AIを活用したデバッグ手法の紹介。

![Slide 48](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_47.jpg)
**生成AI活用の背景**: AWSは既に`Amazon ECS MCP Server`や`AWS Documentation MCP Server`など、AIエージェントが利用できるツールを提供している。

![Slide 49](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_48.jpg)
**生成AIの利点**: LLMの事前学習済み知識だけでなく、MCPサーバーを通じて最新の情報源やAPI実行を組み合わせることで、「問題発生→原因調査→特定→修正」のリードタイムを改善できる可能性がある。

![Slide 50](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_49.jpg)
**デモ**: 実際の机上デモを通じて理解を深める。

![Slide 51](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_50.jpg)
**デモのシナリオ**: Amazon ECS上のフロントエンドAppからバックエンドAppに接続できない、というシンプルなデバッグユースケースを想定。

![Slide 52](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_51.jpg)
**デモの環境**: IaC (Terraform) で構築されたAWS環境、LLMはClaude 4 Sonnet、AIアプリとしてCursor、MCPサーバーとしてECS, AWS Docs, Terraformのものを利用。

![Slide 53](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_52.jpg)
**デバッグの流れ1**: AIに問題（フロントからバックに接続不可）を伝える。

![Slide 54](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_53.jpg)
**デバッグの流れ2**: AIがECS MCP Serverを使い、ECSクラスタ、サービス、タスクの情報を収集・分析する。

![Slide 55](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_54.jpg)
**デバッグの流れ3**: AIがネットワーク構成（セキュリティグループなど）の情報を収集・分析する。

![Slide 56](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_55.jpg)
**デバッグの流れ4**: AIが問題の原因を推測し、関連するTerraformコードの箇所を特定する。

![Slide 57](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_56.jpg)
**デバッグの流れ5**: AIがTerraformコードの修正案を提示する。

![Slide 58](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_57.jpg)
**デバッグの流れ6**: 開発者は提示された修正案を確認し、適用する。

![Slide 59](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_58.jpg)
**デモ結果(特定)**: 実際のCursorの出力例。AIがフロントエンドとバックエンドの接続問題を特定する様子。

![Slide 60](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_59.jpg)
**デモ結果(特定内容)**: ECS MCP Serverのトラブルシューティング用ツールを利用し、セキュリティグループの許可ポート番号の不一致が原因であることを特定。

![Slide 61](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_60.jpg)
**デモ結果(修正)**: 問題の修正フェーズのCursor出力例。

![Slide 62](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_61.jpg)
**デモ結果(修正内容)**: バックエンドAppに適用されているセキュリティグループのTerraform定義を特定し、修正用のCommitを作成。問題特定から修正まで約90秒で完了した。

![Slide 63](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_62.jpg)
**MCP Server利用の注意点(1)**: `Amazon ECS MCP Server`はまだ開発・テスト用途。本番利用は非推奨。機密情報へのアクセスを許可しないと、トラブルシューティングツールが制限される。

![Slide 64](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_63.jpg)
**MCP Server利用の注意点(2)**: AIによるクラウド上のリソース直接変更はリスクが高いため、MCP Server側の書き込み操作を無効化するなどのリスク緩和策が推奨される。

![Slide 65](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_64.jpg)
**デバッグ設計のまとめ**: `ECS Exec`や`Reachability Analyzer`といったAWSサービス、デバッグ用カスタムコンテナ、そして生成AIによるトラブルシューティングなど、適材適所でツールを使い分けることが有効。

![Slide 66](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_65.jpg)
**全体のまとめ**: セクション開始。

![Slide 67](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_66.jpg)
**Before**: これまでの運用設計における一般的な疑問点を再掲。

![Slide 68](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_67.jpg)
**After**: 本発表で解説した、最新のアーキテクチャと考慮ポイントのまとめ。ロギングではFirelens、メトリクスではContainer Insightsの使い分け、トレースではADOT、デバッグでは各種ツールの活用が鍵。

![Slide 69](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_68.jpg)
**宣伝**: 2025年末に出版予定の改訂版書籍の案内。本日の発表内容も詳細に解説される予定。

![Slide 70](https://files.speakerdeck.com/presentations/dfb582ab3cf24b7ba7a9542bc26cbb36/slide_69.jpg)
**Thank you!**: 発表の結び。
