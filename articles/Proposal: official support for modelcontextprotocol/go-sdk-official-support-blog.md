# Model Context Protocol (MCP) の Go 公式 SDK 登場へ！分断されたエコシステムの統一と未来への期待

ソフトウェア開発の世界では、プロトコルやツールの標準化がエコシステムの健全な発展に不可欠です。近年注目を集める Model Context Protocol (MCP) においても、特定の言語、特に Go 言語における公式サポートの不在が課題となっていました。しかし、最近の GitHub 上での活発な議論と Go コア開発チームの動きにより、待望の公式 Go SDK (`modelcontextprotocol/go-sdk`) の登場が現実味を帯びてきました。

本記事では、この公式 Go SDK 提案の背景、現状の課題、コミュニティの期待、そして Go tools team による実装という重要な進展について、GitHub Discussion の内容を基に詳しく解説します。

## 背景: なぜ Go 公式 SDK が必要だったのか？

Model Context Protocol (MCP) は、開発ツールとサーバー間の連携を標準化するためのプロトコルです。C#, Rust, Kotlin など他の言語では公式 SDK が提供され始めていますが、Go 言語においては状況が異なりました。

Go コミュニティでは、複数の開発者によって意欲的に MCP の SDK が開発・公開されてきました。例えば、`mark3labs/mcp-go`, `riza-io/mcp-go`, `MegaGrindStone/go-mcp`, `metoro-io/mcp-golang`, `JeffreyRichter/mcp` など、様々な実装が存在します。

しかし、これらのサードパーティ製 SDK は、それぞれメンテナンス状況や機能、採用率にばらつきがあり、Go エコシステム内での MCP 利用において **分断** が生じていました。開発者はどの SDK を選択すべきか迷い、標準的な実装が存在しないことで、MCP の普及が妨げられる可能性がありました。

## 提案: `modelcontextprotocol/go-sdk` の創設

このような状況を打破すべく、[@jpmcb](https://github.com/jpmcb) 氏によって `modelcontextprotocol` GitHub オーガニゼーション配下に公式の Go SDK (`modelcontextprotocol/go-sdk`) を作成する提案がなされました (ref: [GitHub Discussion #224](https://github.com/orgs/modelcontextprotocol/discussions/224))。

この提案の目的は明確です。

1. **エコシステムの統一:** `go get github.com/modelcontextprotocol/go-sdk` で利用可能な、単一の標準 SDK を提供する。
2. **コミュニティによる維持:** 活発なコミュニティによってメンテナンスされ、信頼性と継続性を確保する。
3. **MCP の普及促進:** Go 言語における MCP の導入と活用を容易にする。

## 既存 SDK の動向とコミュニティの反応

この提案は、Go コミュニティから非常に好意的に受け止められました。

* **既存 SDK 開発者の協力:** `riza-io/mcp-go` の [@kyleconroy](https://github.com/kyleconroy) 氏や `MegaGrindStone/go-mcp` の [@MegaGrindStone](https://github.com/MegaGrindStone) 氏など、既存の SDK 開発者からは、公式 SDK が完成すれば自身のライブラリをアーカイブし、公式 SDK へ貢献したいとの意向が示されました。
* **`mark3labs/mcp-go` への注目:** 最も更新頻度が高く、スター数も多い `mark3labs/mcp-go` をフォークまたは寄贈してもらう案も検討されました。一方で、実装の詳細（タグベースのスキーマ宣言）に対する懸念の声も上がりました。
* **`metoro-io/mcp-golang` の議論:** バグの指摘もありましたが、MIT ライセンスであることから、フォークして公式 SDK のベースにする可能性も議論されました。
* **`JeffreyRichter/mcp` の貢献意欲:** 開発者の [@JeffreyRichter](https://github.com/JeffreyRichter) 氏も、自身の高機能な SDK (goroutine セーフ、キャンセル対応、バッチ処理など) を公式化の取り組みに役立てたいと表明しました。
* **圧倒的な支持:** 数多くの開発者 (記事末尾の注釈参照) が +1 やコメントで賛同を示し、公式 SDK の実現とメンテナンスへの貢献意欲を表明しています。認証サポート ([@gatuin](https://github.com/gatuin)) や Streamable HTTP transport ([@alok87](https://github.com/alok87)) といった具体的な機能要望も寄せられました。

## 重要発見: Go Tools Team による MCP 実装

議論が進む中で、[@zchee](https://github.com/zchee) 氏によって驚くべき事実が明らかにされました。Go のコア開発チーム (Go tools team) が、`golang/tools` リポジトリ内で MCP プロトコルの実装を開始していたのです。

* リポジトリ: `https://github.com/golang/tools/tree/master/internal/mcp`
* 依存: `https://github.com/golang/tools/tree/master/internal/jsonrpc2_v2`

これは非常に重要な進展です。Go のコアチームによる実装は、アーキテクチャ、パフォーマンス、セキュリティ、コード品質の面で高いレベルが期待でき、将来の**公式 SDK の基盤となる可能性が極めて高い**と考えられます。

ただし、現状この実装は `internal` パッケージ内に存在するため、外部のリポジトリから直接インポートして利用することはできません。この点については、`internal` パッケージをコピーして自動更新する専用リポジトリを作成するアプローチなどが提案されています ([@zchee](https://github.com/zchee))。

## 今後の展望と公式見解

`modelcontextprotocol` オーガニゼーションの Collaborator ([@olaservo](https://github.com/olaservo), [@ansaba](https://github.com/ansaba)) も議論に参加し、公式 Go SDK の計画が進行中であることを認めました。詳細はまだ固まっていませんが、Go tools team による実装 (`golang.org/x/tools/internal/mcp`) が進行中であることを示唆し、コミュニティから要望のあった Streamable HTTP transport のサポートについても言及しています ([@ansaba](https://github.com/ansaba))。

開発者コミュニティからは、具体的なリポジトリの作成やリリース時期に関する問い合わせが続いており、公式 SDK への高い期待がうかがえます。

## まとめ: Go における MCP の未来

Go 言語における Model Context Protocol (MCP) のエコシステムは、公式 SDK の登場によって大きな転換点を迎えようとしています。分断されていた状況は解消され、Go tools team による高品質な実装を基盤とした、信頼性の高い標準 SDK が提供される見込みです。

まだ公式リポジトリの作成や具体的なリリース時期は発表されていませんが、`modelcontextprotocol` オーガニゼーションと Go コアチーム、そして活発な開発者コミュニティの協力により、Go 言語での MCP 活用がより一層加速することは間違いないでしょう。今後の公式アナウンスに注目が集まります。

---

**注釈: GitHub Discussion #224 で公式 SDK への賛同・貢献意欲を示した主な開発者 (一部抜粋、順不同):**
[@ChrisJBurns](https://github.com/ChrisJBurns), [@gramidt](https://github.com/gramidt), [@rvoh-emccaleb](https://github.com/rvoh-emccaleb), [@guilt](https://github.com/guilt), [@nickemma](https://github.com/nickemma), [@edricgalentino](https://github.com/edricgalentino), [@dblooman](https://github.com/dblooman), [@wfernandes](https://github.com/wfernandes), [@elviskahoro](https://github.com/elviskahoro), [@joobisb](https://github.com/joobisb), [@pgmstream](https://github.com/pgmstream), [@baiyutang](https://github.com/baiyutang), [@GhostScientist](https://github.com/GhostScientist), [@manusa](https://github.com/manusa), [@baditaflorin](https://github.com/baditaflorin), [@NameHaibinZhang](https://github.com/NameHaibinZhang), [@zhengkunwang223](https://github.com/zhengkunwang223), [@CrazyHZM](https://github.com/CrazyHZM), [@ankit-arora](https://github.com/ankit-arora), [@groot-guo](https://github.com/groot-guo), [@amren1254](https://github.com/amren1254), [@SerkanSipahi](https://github.com/SerkanSipahi), [@Mehdi-Bl](https://github.com/Mehdi-Bl), [@songhobby](https://github.com/songhobby), [@edoger](https://github.com/edoger), [@davidli2010](https://github.com/davidli2010), [@alok87](https://github.com/alok87) 他多数。
