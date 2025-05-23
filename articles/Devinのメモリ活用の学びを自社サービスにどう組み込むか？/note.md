# Devinのメモリ活用の学びを自社サービスにどう組み込むか？

ref: <https://zenn.dev/deskrex/articles/51f2500f3633bd>

冨田到氏（Deskrex.ai社代表取締役）による「AI駆動開発勉強会臨時回【Devin Meetup Japan #1】」での発表内容をまとめた記事の要点を以下に詳細にまとめます。

## 1. AIエージェントのメモリの種類

AIエージェントのメモリシステムは人間の記憶構造を模倣し、3つの主要タイプに分類されます：

- **意味記憶（Semantic Memory）**：
  - 事実や概念に関する知識を格納
  - 例：プログラミング言語の文法、API仕様、アーキテクチャパターン
  - 特徴：コンテキストから独立した普遍的な知識、再利用性が高い

- **エピソード記憶（Episodic Memory）**：
  - 特定の経験や出来事に関する記録
  - 例：過去の問題解決履歴、特定プロジェクトでの経験
  - 特徴：文脈依存の具体的記憶、時間的順序性を持つ、感情や価値判断を含む

- **手続き記憶（Procedural Memory）**：
  - 特定のタスクを実行するための手順や方法
  - 例：デバッグプロセス、リファクタリング手法
  - 特徴：方法論的知識、反復によって改善・効率化される、暗黙知を含む

これらのメモリタイプは独立して機能するのではなく、相互作用しながら問題解決を行います。

## 2. 最新ツールにおけるメモリシステム比較

主要なAIツールのメモリシステムを比較しています：

| プロダクト | メモリシステム | 特徴 |
|------------|----------------|------|
| Cline | Memory Bank | 複数のメモリファイルによる階層的文脈管理<br>シンプルで柔軟なファイルベース設計<br>Plan/Actモードによる戦略と実装の分離 |
| Devin | Knowledge | エンジニア入力の知識を自動活用する仕組み<br>トリガーを用いた文脈の自動呼び出し<br>エージェンティックなRAG |
| Windsurf | Cascade Memory | ワーキング、短期、長期の3層メモリ構造<br>自動生成とユーザー定義の二重管理<br>グローバルとワークスペースのルール設定 |

## 3. Devinのメモリシステム詳細分析

Devinのメモリシステムは「**ナレッジシステム**」と「**プレイブック**」という2つの柱で構成されています：

### ナレッジシステム

- プロジェクトに関する重要情報を効率的に格納・検索するシステム
- シーン（使用コンテキスト）に基づいた知識の整理
- トリガーによる適切なナレッジの呼び出し
  - 例：`when working in repo {レポジトリ名}`
  - 例：`When designing React hooks in {レポジトリ名}`
  - 例：`When encountering TypeScript errors in {レポジトリ名}`
- 複数ナレッジの統合的活用による包括的な問題解決
- コンパクトな知識表現（約512文字程度）による検索精度の向上

### プレイブック機能

- 繰り返し作業の効率化のためのテンプレート的機能
- 標準的な開発フローや定型的なタスクの自動化
- 再利用可能なコードスニペットやドキュメントテンプレートの管理

### Devinのナレッジ形成のTips

- ナレッジから自動で優先度を判断する
- トリガーの分割は小さい方が良い
- レポジトリに紐づけて効率的に取得する
- ヒエラルキーはないので重複は削除する

## 4. Devinの実践的な応用例

### ペアプログラミング的な活用

- Cursorエディタでの設計と同期
- レポジトリ共有によるコミットごとのフィードバック実施
- 言語化しきれていない見通しの難しいタスクも対話的アプローチで解決
- プロジェクト特有知識の学習（エラーハンドリングなど特定パターンの明示的教示）
- 「私のコードから学べることを列挙して学習してください」という共同学習アプローチ

### Playbookの活用

- DevinのAPIを利用したタスクの自動分割
- 大規模タスクを独立した小タスクに自動分解
- 依存関係の明確化（タスク間の依存関係を自動分析し、実行順序や並列化可能性を判断）

### ACU（Agent Compute Unit）の経営的観点からの計測

- 1 ACU = 約15分の稼働時間相当
- 標準プラン：月額500ドルで250 ACU（約62.5時間）、時給換算約8ドル（約1,200円/時間）
- 3〜5ACUで1PRを処理するのが効率的

## 5. メモリ設計の最適化戦略

### シーン設計の重要性

- 使用コンテキストに基づく分類（機能別、ユーザータイプ別、タスク特性別）
- 適切な粒度での情報管理（マクロ、メゾ、マイクロの3段階）
- アクセス効率を考慮した設計（トリガーの明確性、階層性、ユーザー状態の考慮）

### メモリの抽象化

- 必要最小限の情報保持（本質的概念の優先、代表的ユースケース、転用可能知識）
- 効率的な検索のための最適化（キーワードの戦略的配置、関連概念のグループ化）
- 不要なメモリの適切な廃棄（鮮度による管理、使用頻度の測定、競合情報の解決）

### 職業別スキルマップに基づくAIメモリ構築

- エンジニアスキルマップモデル（技術スキル層、プロセススキル層、対人スキル層、メタ認知スキル層）
- デザイナー向けメモリモデル（デザイン理論層、ツール技術層、ユーザー理解層、コラボレーション層）
- マーケター向けメモリモデル（戦略思考層、チャネル専門層、分析能力層、クリエイティブ層）

### メタ認知的アプローチの導入

- 自己評価メカニズム（回答品質の自己評価、知識ギャップの認識、継続的学習プロセス）
- 状況適応型思考（ユーザー状態の推論、先回り思考、複数視点の考慮）

## 6. 自社サービスにメモリをどう組み込むか

### 入出力設計とメモリの連携

- シーンベースのメモリ活性化（コンテキスト認識入力処理、意図認識メカニズム）
- 多層的なメモリアクセス戦略（段階的アクセス、予測的メモリロード、動的最適化）
- インタラクションモデルの高度化（会話の文脈維持、マルチモーダル記憶の統合活用）

### 自律的思考と意思決定プロセス

- 職業別スキルマップに基づく思考モデルの実装
- メタ認知的アプローチの実装（自己評価、知識の境界認識、多視点思考）
- 内部状態と意思決定プロセスの透明化（思考過程の可視化、不確実性の明示）

### 長期記憶と継続的学習の実装

- 継続的学習と知識更新メカニズム（ユーザーインタラクションからの学習、知識の鮮度管理）
- 記憶の文脈化と関連性強化（連想記憶ネットワークの構築、時間的文脈の保持）

### 実装上の考慮点

- 段階的実装のロードマップ（基本応答能力→拡張記憶と学習能力→完全自律的思考）
- メモリ自体が競争優位になる可能性はあるが、必須の機能要件かは未知数
- ミニマムにユーザー価値をテストする必要性

## 7. AIエージェントのメモリの今後の論点

### 強化学習との棲み分け

- エッジケースの抽象的な記憶（強化学習では獲得困難な「失敗パターン」の暗黙知保存）
- ユーザーごとの最適化（認知バイアス補正、作業スタイルの癖を反映したショートカット）
- ハイブリッドアプローチの可能性（強化学習の一般パターン＋メモリシステムの例外処理）

### MVPとしてのメモリ

- 出力精度と導入コストのバランス（効果予測と失敗リスクの許容度評価）
- 途中からAIエージェントにする難しさ（事後的なメモリ統合の課題、ユーザー体験の一貫性）

### メモリを競争優位性（Moat）とするための戦略

- 協調的メモリエコシステム（集合知の形成、役割別エージェントのメモリ連携）
- 説明可能性と透明性の確保（記憶活用の可視化、記憶編集の制御権、記憶の継承と移行）

### AIメモリの進化と将来展望

- メモリの専門化と多様化（創造的連想記憶、批判的評価記憶、社会的関係性記憶）
- 集団的記憶インフラの出現（業界共通知識ベース、エージェント間経験共有）

![Devinの包括的ナレッジアクセスの仕組み](https://storage.googleapis.com/zenn-user-upload/534386b1d2ed-20250326.png)

![メモリ設計の最適化戦略](https://storage.googleapis.com/zenn-user-upload/d17bcb2a5829-20250326.png)

![自社サービスにメモリを組み込む方法](https://storage.googleapis.com/zenn-user-upload/e2620b43bb31-20250326.png)

この記事は、AIエージェントのメモリシステムが単なる技術的要素ではなく、エージェントの自律性と問題解決能力を支える基盤であり、将来的な競争優位性の源泉になる可能性を示唆しています。DevinのようなAIエージェントから学んだメモリ設計の知見を自社のAIサービス開発に活かす実践的なアプローチが詳細に解説されています。
