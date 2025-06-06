# AI Dev 25 | Apoorva Joshi: 学習するエージェントの構築 - AI エージェントのメモリ管理

ref: <https://www.youtube.com/watch?v=30Ofh-Myte4>

こんにちは、私はAuraです。今日はAIエージェントが経験から真に学び、将来私たちと知的に協働するための記憶管理システムの構築についてお話しします。

## 自己紹介

昨年、初めてMongoDBでデベロッパーアドボケイトの役割に就きました。技術コンテンツの作成や実践的なワークショップを通じて、開発者の皆さんがAIアプリケーションを構築するのを支援しています。それ以前は、機械学習とサイバーセキュリティの分野で約6年間働いていました。

## AIエージェントとは

AIエージェントは90年代から存在し、元々は強化学習エージェントとして、環境からのフィードバックに基づいて報酬を最大化するために定義済みの行動から選択するものでした。これによりバックギャモン、チェス、囲碁などのゲームをマスターし、その分野のグランドマスターに勝利することもできました。

LLM（大規模言語モデル）の登場により、AIエージェントの定義は少し変化しました。現代のAIエージェントには主に以下の要素があります：

1. **知覚** - 環境を観察し解釈する能力
2. **行動** - 環境との相互作用方法
3. **記憶** - 過去の経験や知識を維持する方法
4. **フィードバック** - 行動を導く環境やユーザーからの信号
5. **推論** - 問題を独自に推論し、解決策を見つける能力（LLMベースのエージェント特有）

LLMベースのエージェントでは、知覚はユーザーや外部システムからの入力、行動はAPI、データベース、特殊な機械学習モデルなどのツールを通じて行われます。記憶はエージェントの過去の行動や相互作用から形成され、フィードバックはツールやユーザーから得られます。そして最終的にLLMを「脳」として使用し、推論と意思決定を行います。

つまり現代のAIエージェントとは、LLMを使用して問題を推論し、解決計画を作成・実行し、ツールやこれまでの相互作用からのフィードバックを基に計画を改善するシステムです。これはLLMの世界知識と推論能力に「行動する能力」を追加したもので、完全な自律性を持つAGI（汎用人工知能）への道が以前よりも現実的になってきています。

## 人間の記憶とAIエージェントの記憶

AIエージェントが真に私たちの生活をサポートするためには、記憶という重要な要素が必要です。現在のLLMアプリケーションでは、会話履歴という形で一定の記憶機能がありますが、より複雑なタスクを実行するためには、より高度な記憶システムが必要です。

### 人間の記憶の種類

人間の記憶は大きく分けて短期記憶と長期記憶があります：

1. **短期記憶** - 最近の会話や観察（天気情報など）を覚えるのに役立ちます
   - さらに**作業記憶**があり、脳が現在取り組んでいる情報を一時的に保存します

2. **長期記憶** - 長期間にわたる経験からの学習と記憶
   - **意味記憶** - 知識の長期保存（学校で学んだ事実など）
   - **エピソード記憶** - 人生の重要な出来事や経験を記憶
   - **手続き記憶** - タイピングや自転車の乗り方などの方法を学び記憶
   - **感覚記憶** - 感覚刺激からの記憶（コンサートの音、美味しいパンの香りなど）

### AIエージェントの記憶への対応

AIエージェントは人間ではなくソフトウェアですが、人間の記憶に似た形で記憶を実装できます：

1. **短期記憶** - LLMアプリケーションの最近の会話履歴
2. **長期記憶**
   - **意味記憶** - LLMの重みに組み込まれた知識＋外部データベース（顧客サービスエージェントの場合はサポートドキュメント、シミュレーションゲームの場合はキャラクター情報など）
   - **エピソード記憶** - タスク完了のためのアクションシーケンス
   - **手続き記憶** - LLMの重み、エージェントのコード、システムプロンプト
   - **作業記憶** - コンテキストウィンドウ内の現在のタスク情報（ユーザー入力、ツール実行結果、計画・推論の痕跡など）

## メモリ管理のCRUD操作

### メモリの作成

AIエージェントがメモリを作成するための材料：

1. LLMの計画・推論の痕跡
2. ツール実行の結果
3. ユーザーとの会話
4. 環境からのフィードバック

ただし、これらの材料はそのままでは効率的ではありません。エージェントは作業メモリから具体的な洞察を抽出し、長期記憶として保存する必要があります。例えば：

- シミュレーションゲームでは、キャラクターの特性や関係性
- コンピュータ使用エージェントでは、成功または失敗したアクションシーケンス
- コード生成では、エラーとその解決策

メモリを作成するタイミングも重要です：

1. 新しい入力を受け取るたび
2. コンテキストウィンドウがいっぱいになりそうなとき
3. 会話の終了時
4. 定期的なスケジュール

### メモリの保存

メモリは外部データベースに保存する必要があります。将来的にはLLMが自己調整（ファインチューニング）できるようになるかもしれませんが、現時点では外部保存メカニズムが必要です。

メモリを保存する際の考慮点：

- 時間的側面：作成日時や最終更新日時のタイムスタンプを含める
- エンティティや手続き記憶（システムプロンプトなど）は、単一の信頼できるソースを維持

### メモリの取得

長期記憶を取得するタイミング：

1. シミュレーションゲームでは、各アクションの前に過去の行動に基づいて次の行動を判断
2. コンピュータ使用では、初期計画段階で過去のアクションシーケンスを参照
3. コード生成では、エラー発生時に過去の解決策を検索

記憶の検索技術：

1. **完全一致検索** - 明確な条件に基づく情報検索（例：会話中のキャラクター名で検索）
2. **ベクトル検索** - 意図と意味に基づく情報検索（類似のタスクシーケンスを検索）
3. **ハイブリッド検索** - キーワードとベクトルの両方のアプローチを組み合わせる
4. **再スコアリング・再ランキング** - 最新性や重要度などの基準を含めた検索結果の再評価

### メモリの更新

エージェントが新しい情報を学ぶにつれて、一部のメモリは修正または更新が必要になります。
最も簡単な方法は、取得、作成、更新の操作を組み合わせることです：

1. メモリ作成のタイミングで関連メモリを取得
2. 必要に応じて新しい情報で更新
3. 外部ストレージに保存

例えば、コード生成エージェントのシステムプロンプトがあり、ユーザーが「関数にはドキュメント文字列も含めてください」と指示した場合、エージェントはこの新しい情報を使ってメモリを作成し、既存のメモリと統合して更新します。

### メモリの削除

すべてのメモリを永久に保存することは実用的ではありません：

1. エンタープライズグレードのストレージは冗長性、バックアップ、高速アクセスなどでコストがかかる
2. 長期間使用されていないデータを保存するのは無駄
3. 検索性能の観点からも、不要なメモリを段階的に廃止することで検索スペースを管理可能に

メモリ削除のアプローチ：

1. 使用パターンを監視し、一定期間使用されていないデータを安価なアーカイブストレージに移動
2. 使用状況にかかわらず保持期間を設定し、定期的に最も古い未使用メモリを削除

## 主要な教訓

1. メモリはアプリケーションによって異なる形で現れる（シミュレーション、コンピュータ使用、コード生成など）
2. すべてのメモリが保存、取得、更新の観点で同等ではない
3. すべてのメモリを最初から保存することは実用的でなく無駄である
4. 長期記憶管理はAGIの重要なコンポーネント

## 質疑応答

Q: ログとメモリの違いは何ですか？
A: 使用ケースが少し異なります。RAGアプリケーションを構築する場合はすべてのデータを保存することが理にかなっていますが、エージェントのメモリとしてデータを保存する場合は、そのレベルの詳細は必要ありません。

Q: 長期記憶は幻覚（ハルシネーション）を減らすのに役立ちますか？
A: ユースケースによっては役立ちます。例えばエラーを記録するコード生成では、幻覚を減らし信頼性を高めることができます。ただし、長期記憶を正確に調和させなければ、逆に幻覚を引き起こす可能性もあります。
