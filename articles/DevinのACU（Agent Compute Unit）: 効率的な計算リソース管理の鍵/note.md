# DevinのACU（Agent Compute Unit）: 効率的な計算リソース管理の鍵

ref: <https://note.com/son_jon/n/n548e9f205feb>

## DevinのACU（Agent Compute Unit）要約

### 概要

Devinは、自律型AIエンジニアリングツールであり、計算リソース管理のために**ACU（Agent Compute Unit）**という単位を使用しています。この記事では、ACUの仕組み、利用方法、管理について解説します。

### 1. ACUの基本概念

* **定義:** Devinがタスク（仮想マシン時間、モデル推論、ネットワーク帯域幅など）を完了するために使用するコンピューティングリソースの**正規化された測定単位**。
* **提供量:** Teamプラン（月額500ドル）で **250 ACU** が含まれる。
* **消費:** タスクの規模や複雑さ、プロンプトの質、扱うコードベースのサイズ、セッション実行時間などに応じて消費される。

### 2. ACUの価格とコスト

* **Teamプラン:** 月額$500で250 ACUが含まれる（$2.00/ACU）。超過分は従量課金。
* **Coreプラン:** 従量課金（$2.25/ACU）。最低$20からの利用。
* **コスト効率:** ACUは消費リソースを定量化する単位であり、時間単位の直接換算は公式には示されていません。タスクによって消費量は変動します。
* **1 ACUで可能な作業例 (公式ドキュメントより):**
  * 古いコミットから機能を復活させ、デザインを修正する。
  * 検索機能でバグを調査・修正し、CIをパスさせる。
  * 簡単な個人用ウェブサイトを作成する。
  * **(注意)** これらはあくまで目安であり、実際のACU消費量はタスクの具体的な複雑さ、コードベースの状況、プロンプトの質など多くの要因によって変動します。

### 3. ACUの消費と管理

* **消費要因:**
  * タスクの複雑性
  * プロンプトの質・具体性
  * 扱うコードベースやファイルのサイズ
  * セッション実行時間
* **効率的な管理:**
  * タスクの優先順位付け。
  * プロンプトの具体性を高める。
  * （注記: 元記事にあった「並行タスク数の調整」は公式情報には直接的な記載なし）

### 4. ACUの更新と追加購入

* **更新:** Teamプランでは毎月250 ACUが付与される。
* **追加購入:** Core/TeamプランともにAuto-recharge（自動リチャージ）設定により、オンデマンドでACUを追加購入・消費可能。
* **有効期間:** Auto-rechargeされたACUは、アカウントが有効な限り利用可能と考えられる（要公式ドキュメント確認）。

### 5. ACU使用状況の確認

* **確認方法:** Devinプラットフォーム上で確認可能（具体的なセクション名は要公式ドキュメント確認）。
* **確認項目:** 消費済みACU数、残りACU数など（要公式ドキュメント確認）。
* **目的:** リソース使用効率の最適化。

### 6. まとめ: 効率的なACU活用のコツ

* **重要タスクを優先:** リソースを集中させる。
* **プロンプトを明確に:** 具体的な指示で効率を高める。
* **使用状況を定期的に確認:** 消費量を把握し、タスクを調整する。
* **追加購入を活用:** プロジェクト規模に応じてリソースを調整する。

### 参考文献

* [https://zenn.dev/yama_1998/articles/515cfe30b712e4](https://zenn.dev/yama_1998/articles/515cfe30b712e4) (注: 1ACU=15分との記載あり。非公式情報の可能性)
* [https://qiita.com/panda_ebarou/items/ba64bb7f0cad524d7734](https://qiita.com/panda_ebarou/items/ba64bb7f0cad524d7734)
* [https://note.com/daichi_mu/n/n6e7a283ed6b8](https://note.com/daichi_mu/n/n6e7a283ed6b8) (注: 1ACU=15分との記載あり。非公式情報の可能性)
* [https://x.com/ai_system_dev/status/1866614141932408867](https://x.com/ai_system_dev/status/1866614141932408867)
* [https://wa2.ai/ai-it-tools/72](https://wa2.ai/ai-it-tools/72)
* [https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html) (AWSのドキュメントであり、直接関連性は低い)
* [https://x.com/akira_papa_IT/status/1866541257054622163](https://x.com/akira_papa_IT/status/1866541257054622163)
* [https://x.com/minve3](https://x.com/minve3)
* [https://devin.ai/pricing](https://devin.ai/pricing) (**公式価格情報**)
* [https://docs.devin.ai/billing](https://docs.devin.ai/billing) (**公式ドキュメント - 課金詳細**)

**注記:** 元記事には画像が含まれていますが、この要約ではテキスト情報のみを抽出しています。視覚的要素（見出し画像、プロフィール画像など）は省略しています。ACUと時間の直接的な換算（例: 1ACU=15分）は公式情報では確認できませんでした。参考文献には注意が必要です。
