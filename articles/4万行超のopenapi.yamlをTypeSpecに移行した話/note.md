# 4万行超のopenapi.yamlをTypeSpecに移行した話

ref: <https://zenn.dev/yuta_takahashi/articles/migrate-to-typespec>

---

## 「4万行超のopenapi.yamlをTypeSpecに移行した話」の要約

### 1. 背景：4万行超の `openapi.yaml` の課題

* **開発体験の低下:** 巨大なYAMLファイルの編集は困難で、開発者の負担が大きい。
* **AI Agentのコンテキスト圧迫:** CursorなどのAI Agentがコンテキスト制限により停止したり、余分なトークンを消費したりする問題が発生。

### 2. TypeSpecとは

* Microsoftが開発したAPI記述言語。TypeScriptに似た構文で、APIスキーマを拡張可能かつ分かりやすく定義できる。
* **エミッター:** TypeSpecからOpenAPI3, JSON Schema, Protobufなど様々なスキーマや、各種言語のクライアントコード（プレビュー）を自動生成できる。

### 3. TypeSpec移行を決断した理由

* **スケーラブルなスキーマ定義:** モジュール分割が可能で、大規模なAPI定義も管理しやすい。
* **撤退の容易さ:** 万が一TypeSpecから撤退する場合でも、生成された `openapi.yaml` を直接利用する形に容易に戻せる。
* **TypeSpec 1.0.0-RCリリース:** APIが安定し、破壊的変更のリスクが低下したため。

### 4. 移行プロセス

1. **TypeSpecセットアップ:** `tsp init` コマンドで初期設定。`tspconfig.yaml` でOpenAPI 3.0.0を出力するように設定。
2. **OpenAPIからTypeSpecへのコンバート:** `tsp-openapi3` ツールで既存の `openapi.yaml` を `.tsp` ファイルに変換。
    * **問題1: `unknown` 型への変換:** `type: object` 宣言漏れを修正。
    * **問題2: namespaceとmodel名の衝突:** OpenAPIのスキーマ名をリネームして衝突回避。
    * **問題3: インライン `allOf` での `unknown` 型:** `tsp-openapi3` のコードを修正して対応 (修正パッチあり)。
3. **TypeSpecへの移行:** 手動管理していた `openapi.yaml` をTypeSpecから自動生成したものに置き換え。既存ツールチェーンの設定は変更なし。ただし、OpenAPI Generatorが出力するTypeScriptコードのimport文修正が必要だった。
4. **差分確認と調整:** フロントエンド (`tsc`) とバックエンド (`rspec`) のテストを実行。
    * **`Array<number | null>` 型の調整:** OpenAPI Generatorが期待通り `Array<number | null>` を出力するように、TypeSpec側でユーティリティ型 (`NullableNumericArrayItem`) を定義。さらに、生成された `openapi.yaml` の重複定義を削除するパッチスクリプト (`patch.mjs`) を作成し、ビルドプロセスに組み込んだ。

### 5. 移行後の対応

* **ファイル分割:** モデル (`models`) とルート (`routes`) 定義をディレクトリ分けし、可読性を向上。
* **CIでの差分チェック:** `openapi.yaml` の直接編集を防ぐため、CIでTypeSpecのコンパイル結果と `openapi.yaml` の差分をチェックするフロー (`diff-check` スクリプト) を導入。

### 6. 結論と効果

* **移行期間:** 約2日間で完了。
* **行数削減:** 約4万行の `openapi.yaml` が約2万行のTypeSpecファイル群になり、管理対象のコード量が半減。
* **開発体験向上:** ファイル分割により、スキーマ全体の可読性と開発体験が大幅に向上。
* **AI Agentの活用:** コンテキスト圧迫問題が解消され、AI Agentを効率的に利用可能になった。
* **バージョン管理容易化:** エミッターによりOpenAPIのバージョンアップが容易になった。

**重要な発見・強調点:**

* `tsp-openapi3` コンバーターは有用だが、完全ではなく、いくつかの手動修正やツール自体のパッチ適用が必要になる場合がある。
* OpenAPI Generatorの挙動に合わせたTypeSpecの記述や、生成YAMLの調整が必要になるケースがある（特にNullableな配列など）。
* CIによる差分チェックは、TypeSpecへの移行後、意図しない `openapi.yaml` の変更を防ぐために重要。
* TypeSpecは、大規模なOpenAPI定義の管理に課題を持つチームにとって、開発体験向上とメンテナンス性向上の有力な選択肢となる。

---
