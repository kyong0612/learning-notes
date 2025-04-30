# Proposal: official support for modelcontextprotocol/go-sdk

ref: <https://github.com/orgs/modelcontextprotocol/discussions/224>

---

## GitHub Discussion: Proposal: official support for `modelcontextprotocol/go-sdk` #224 の要約

### 1. 提案の背景と目的

* **現状:** Model Context Protocol (MCP) の Go 言語用 SDK は、複数のサードパーティ製ライブラリ (例: `mark3labs/mcp-go`, `riza-io/mcp-go`, `MegaGrindStone/go-mcp`, `metoro-io/mcp-golang`, `JeffreyRichter/mcp/tree/main/mcpdemo`) が存在し、エコシステムが分断されている。これらのライブラリはメンテナンス状況や採用率にばらつきがある。
* **課題:** C#, Rust, Kotlin 用の公式 SDK が登場する中で、Go 言語にも公式サポートされた SDK が必要である。エコシステムの統一と、Go 言語での MCP の普及促進が求められている。
* **提案:** `modelcontextprotocol` GitHub オーガニゼーション配下に、公式の Go SDK (`modelcontextprotocol/go-sdk`) を作成する。
  * これにより、Go モジュール (`go get github.com/modelcontextprotocol/go-sdk`) として利用可能な、コミュニティによって維持される標準 SDK を確立する。
  * 提案者 ([@jpmcb](https://github.com/jpmcb)) は、メンテナーまたは Go エバンジェリストとして貢献する意向を示している。

### 2. 既存 SDK の状況と検討

* **`mark3labs/mcp-go`:** 最も更新されており、スター数も多い。これをフォークするか、開発者 ([@mark3labs](https://github.com/mark3labs)) に寄贈を依頼することを検討。
  * 多くのユーザーが利用しており、(+1 や支持のコメント多数)。
  * ただし、タグでのスキーマ宣言がコードを複雑にし、保守性を損なう可能性があるという意見もある ([@hl540](https://github.com/hl540))。
  * 開発者 ([@mark3labs](https://github.com/mark3labs)) は一時的に不在 (休暇中) との情報あり ([@ibakshay](https://github.com/ibakshay))。
* **`riza-io/mcp-go`:** 開発者 ([@kyleconroy](https://github.com/kyleconroy)) は、公式 SDK ができれば自身のライブラリをアーカイブする意向。
* **`MegaGrindStone/go-mcp`:** 開発者 ([@MegaGrindStone](https://github.com/MegaGrindStone)) も同様に、公式 SDK ができれば自身のライブラリをアーカイブする意向。
* **`metoro-io/mcp-golang`:** JSON-RPC の RequestId 実装にバグ (仕様では string/null も許容されるが int64 のみ対応) があり、開発の活発さも `mark3labs/mcp-go` に劣るという指摘 ([@pavelanni](https://github.com/pavelanni))。ただし、MIT ライセンスであるため、フォークして公式 SDK のベースにする可能性も議論されている ([@ttys3](https://github.com/ttys3))。
* **`JeffreyRichter/mcp/tree/main/mcpdemo`:** 開発者 ([@JeffreyRichter](https://github.com/JeffreyRichter)) も自身の SDK (goroutine セーフ、メソッドキャンセル、RPC バッチ、メッセージ検証、同期/非同期モデルサポート、多くの MCP メソッドのデフォルト実装提供) を公式化の取り組みに貢献する意向。

### 3. Go Tools Team による MCP 実装の登場

* **事実:** Go のコア開発チーム (Go tools team) が、`golang/tools` リポジトリ内で MCP プロトコルの実装を開始したことが判明 ([@zchee](https://github.com/zchee))。
  * リポジトリ: `https://github.com/golang/tools/tree/master/internal/mcp`
  * 依存: `https://github.com/golang/tools/tree/master/internal/jsonrpc2_v2`
  * 初期段階だが、アーキテクチャ、パフォーマンス、セキュリティ、コード可読性の観点から高い技術レベルが期待される。
* **課題:** この実装は `internal` ディレクトリ内にあり、外部から直接インポートできない。
* **提案 ([@zchee](https://github.com/zchee)):** Russ Cox が `9fans/go-lsp-internal` で行ったように、`internal` パッケージ (`mcp`, `jsonrpc_v2`) をコピーする専用リポジトリを作成し、自動更新する方式を提案。

### 4. コミュニティの反応と貢献意欲

* 提案 ([@jpmcb](https://github.com/jpmcb)) に対して、非常に多くの開発者 (+1 コメント多数) が賛同し、公式 SDK の実現とメンテナンスへの貢献意欲を示している。
  * [@ChrisJBurns](https://github.com/ChrisJBurns), [@gramidt](https://github.com/gramidt), [@rvoh-emccaleb](https://github.com/rvoh-emccaleb), [@guilt](https://github.com/guilt), [@nickemma](https://github.com/nickemma), [@edricgalentino](https://github.com/edricgalentino), [@dblooman](https://github.com/dblooman), [@wfernandes](https://github.com/wfernandes), [@elviskahoro](https://github.com/elviskahoro), [@joobisb](https://github.com/joobisb), [@pgmstream](https://github.com/pgmstream), [@baiyutang](https://github.com/baiyutang), [@GhostScientist](https://github.com/GhostScientist), [@manusa](https://github.com/manusa), [@baditaflorin](https://github.com/baditaflorin), [@NameHaibinZhang](https://github.com/NameHaibinZhang), [@zhengkunwang223](https://github.com/zhengkunwang223), [@CrazyHZM](https://github.com/CrazyHZM), [@ankit-arora](https://github.com/ankit-arora), [@groot-guo](https://github.com/groot-guo), [@amren1254](https://github.com/amren1254), [@SerkanSipahi](https://github.com/SerkanSipahi), [@Mehdi-Bl](https://github.com/Mehdi-Bl), [@songhobby](https://github.com/songhobby) など。
* SDK の機能として認証サポートを望む声もある ([@gatuin](https://github.com/gatuin))。
* Streamable HTTP transport のサポートを期待する声もある ([@alok87](https://github.com/alok87))。

### 5. 今後の進捗と公式見解

* `modelcontextprotocol` オーガニゼーションの Collaborator ([@olaservo](https://github.com/olaservo), [@ansaba](https://github.com/ansaba)) がコメント。
  * 公式 Go SDK の計画は進行中であり、詳細は固まり次第アナウンスされる見込み。
  * Go tools team による実装 (`golang.org/x/tools/internal/mcp`) が進行中であることを示唆し、Streamable HTTP transport サポートについても言及 ([@ansaba](https://github.com/ansaba))。
* 開発者コミュニティからは、リポジトリの作成や具体的な開始時期に関する問い合わせが続いている ([@edoger](https://github.com/edoger), [@davidli2010](https://github.com/davidli2010), [@alok87](https://github.com/alok87))。

### 6. 重要な結論・発見

* Go 言語における MCP エコシステムは分断されており、公式 SDK の必要性が広く認識されている。
* 既存のサードパーティ SDK 開発者も公式 SDK への移行・貢献に前向きである。
* Go のコア開発チームが `golang/tools` 内で MCP SDK のプロトタイプ開発に着手しており、これが将来の公式 SDK の基盤となる可能性が高い。
* 公式 SDK のリリース時期や具体的な計画は未定だが、`modelcontextprotocol` オーガニゼーション側で準備が進められている。

### 7. 制限事項

* 現時点では、公式 Go SDK のリポジトリはまだ存在しない。
* Go tools team による実装は `internal` パッケージであり、直接利用はできない。
* 公式 SDK の具体的なリリース時期や仕様は未定。

---

**注記:** 上記要約は、2025年4月28日時点までの GitHub Discussion の内容に基づいています。画像、チャート、図表などの視覚的要素は元の Discussion ページには存在しませんでした。技術的な正確性を維持し、主要な論点を網羅するように努めました。
