---
title: "MCP is Dead; Long Live MCP!"
source: "https://chrlschn.dev/blog/2026/03/mcp-is-dead-long-live-mcp/"
author: "Charles Chen (@chrlschn)"
published: 2026-03-14
created: 2026-03-17
description: "ソーシャルメディアのインフルエンサーがMCPを時代遅れと断じCLIを持ち上げる風潮に対し、MCPが組織・エンタープライズ規模のエージェンティックエンジニアリングにおいて不可欠である理由を論じた記事。CLI vs MCPのトークン節約の議論の欠落するニュアンス、stdio vs streamable HTTPの区別、テレメトリ・認証・動的コンテンツ配信などMCPの組織的優位性を解説する。"
tags:
  - "clippings"
  - "MCP"
  - "CLI"
  - "agentic-engineering"
  - "AI-agents"
  - "enterprise"
---

## Summary（要点）

- **エンタープライズ・組織レベルのユースケースにおいて、MCPは現在も未来も中核的な技術**であり、チームはソーシャルメディアの一時的な流行に惑わされず本質を見極める必要がある。
- 個人のコーディングエージェント利用と組織的な導入は根本的に異なる。組織では**可視性・テレメトリ・セキュリティ・品質管理**が重視される。
- MCPの認証（Auth）の重要性とテレメトリの役割は一般的に誤解されている。
- 多くの人はMCP Toolsしか知らないが、**MCP Prompts**と**MCP Resources**は組織がバイブコーディングからエージェンティックエンジニアリングへ移行する上で重要な仕組みである。
- `stdio`モードのローカルMCPと`streamable HTTP`によるサーバーMCPの区別がされていないことが議論を混乱させている。
- CLIにはトークン節約の利点があるが、カスタムCLIはMCPと同じコンテキスト問題に直面する上、構造化や他の利点を犠牲にする。

---

## 1. インフルエンサー主導のハイプサイクル

わずか6ヶ月前、MCPは業界の注目の的で誰もがMCP関連のプロダクトを競って出荷していた。しかし著者（Motionに勤務）は当初から懐疑的で、「ただのAPIに対してなぜラッパーが必要なのか」と考え、MCPのハイプサイクルをスキップした。

現在、業界の言説は完全に逆転し、**MCPは時代遅れでCLIが正解**という風潮が広がっている。著者はこれをインフルエンサー主導のFOMO（取り残される恐怖）に基づくハイプサイクルだと分析する。

> インフルエンサーたちはコンテンツを生み出し続けて注目を集める必要があり、常に「今の流行」に合わせて方向転換する。Garry TanやAndrew Ngのような有識者でさえ、この傾向から免れていないと著者は指摘する。

CLIがMCPより優れているケースがあることは事実だが、**すべてのケースに当てはまるわけではない**。

---

## 2. CLI vs MCP — トークン節約の議論

### トークン節約は存在するか？

**Yes**。ただし、ソーシャルメディアが煽るほど劇的ではない。3つのモダリティがある：

### 2.1 トレーニングデータセットに含まれるCLIツール

`jq`, `curl`, `git`, `grep`, `psql`, `aws`, `gcloud` などのよく知られたCLIツールは、LLMのトレーニングデータに膨大な使用例が含まれるため、追加のスキーマや指示なしでワンショットで使える。これはMCPの`tools/list`レスポンスで事前宣言が必要なのに比べ大きな節約になる。

**ただし、カスタムCLIツールにはこの利点は当てはまらない。** LLMはカスタムCLIの使い方を知らないため、`AGENTS.md`や`README.md`にツールの説明を記述する必要がある。エージェントがカスタムCLIの選択を誤るたびに説明を追加・更新しなければならず、結局MCPと同じ問題に直面する。

さらに、`curl`であっても、ビスポークなOpenAPIスキーマを理解する必要がある場合、スキーマ全体をコンテキストに読み込む必要があり、**トークン節約の利点は消失する**。

### 2.2 チェーン抽出・変換

CLIのパイプラインで取得→変換→抽出を行い、コンテキストウィンドウに入るデータを削減できる。しかし、これはCLI固有の利点ではなく、**標準ライブラリ（DOM/CSS、JSONPath、XPathなど）でも実現可能**な一般的なアプローチ。

### 2.3 プログレッシブコンテキスト消費

MCPがスキーマ全体を事前宣言するのに対し、CLIは`--help`を段階的にロードできる。しかし実際には：

- Anthropicが100万トークンのコンテキストウィンドウを提供している現在、この議論はどこまで決定的か？
- MCPツールセットを賢く設計すれば、コンテキスト消費は最小限に抑えられる
- エージェントに全スキーマを事前提示した方が正しいツール選択につながる（[Vercelの知見](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)と一致）
- CLIのプログレッシブ発見はターン数が増え、結局同程度のコンテキストを消費する
- 十分に複雑なフローでは、エージェントはツリーの大部分を探索することになる

---

## 3. MCPの二面性 — stdio vs streamable HTTP

### stdio モード

ローカルでエージェントと共にMCPサーバーを実行する形式。多くのケースでは、**シンプルなCLIで代替可能**であり、MCPの恩恵は薄い。著者自身も当初はMotionでMCPをスキップし、REST APIのツールラッパーを直接書いていた。

### Streamable HTTP モード — ゲームチェンジャー

サーバーサイドで集中管理されるMCP over streamable HTTPは、組織・エンタープライズの採用において決定的に重要。以下の利点がある：

#### 3.1 リッチなバックエンド機能

集中管理サーバーにはPostgresインスタンス（[Apache AGE](https://github.com/apache/age)によるCypherグラフクエリなど）を含む高度なバックエンド機能を実装できる。配布はHTTPエンドポイントと認証トークンの設定のみ。

#### 3.2 エフェメラルエージェントランタイム

GitHub Actionsなどのエフェメラルな実行環境でも、複雑なバックエンドを必要とするツールをインストール不要で利用可能。**ステートレスな一時的環境における状態管理をサーバーに委譲**できる。

#### 3.3 認証とセキュリティ

CLIで`curl`などを使う場合、各開発者がAPIキーに直接アクセスする必要がある。MCPサーバーに集約すれば：

- OAuthで開発者を認証
- APIキーとシークレットをサーバー側で管理
- シークレットの漏洩リスクを制御・監査可能
- **チーム離脱時はOAuthトークンを失効させるだけ**で済む

#### 3.4 テレメトリと可観測性

集中型MCPサーバーにより、以下の問いに答えられる：

- どのツールが効果的か？
- どのエージェントランタイムが使われているか？
- どのツールが低価値か？
- ツールの失敗パターンは？

**OpenTelemetryトレースとメトリクスの発行**により、標準的なオフザシェルフツールで収集・分析可能。CLIでも実現可能だが、各CLIツールに個別にテレメトリ基盤を組み込む必要があり、サーバー集中型よりはるかに困難。

#### 3.5 標準化された最新コンテンツの即時配信

分散型ツール（パッケージ配布）はバージョン互換性の問題を抱える。MCPは[サブスクリプションと通知](https://modelcontextprotocol.io/specification/2025-11-25/architecture#clients)機能を持ち、サーバーからクライアントに更新を通知できる。

さらに、あまり知られていない**MCP Prompts**と**MCP Resources**の活用：

| 概念 | 対応するもの |
|---|---|
| MCP Resources | サーバー配信の `/docs`（ドキュメント） |
| MCP Prompts | サーバー配信の `SKILL.md`（スキル定義） |

**組織的な利点：**

1. **組織横断のナレッジ** — セキュリティベストプラクティス、テレメトリ規約、マイクロサービス間のドキュメントなどを全リポジトリで共有。チームがサービスをリリースするたびにスキルを動的に提供可能。
2. **自動的で一貫した更新** — リポジトリ内の`*.md`ファイルと異なり、サーバー配信のプロンプト・リソースは常に最新。サードパーティのドキュメントもサーバー経由でプロキシ可能。
3. **動的コンテンツ** — 静的テキストではなく、コンテキストに応じた動的生成が可能（価格データ、システムステータスの注入など）。

これらの機能はClaude Code、Codex、VS Code Copilot、GitHub Agents、OpenCodeなど**すべてのエージェントフロントエンドで一貫して利用可能**。

---

## 4. 結論

著者の核心的主張：

1. **個人のバイブコーダーにとっては**、MCPの重要性は低く、CLIや直接的なAPI呼び出しで十分な場合が多い。
2. **組織・エンタープライズにとっては**、MCPはバイブコーディングからエージェンティックエンジニアリングへの移行に不可欠。テレメトリ、セキュリティ管理、自動コンテンツ同期、スキーマベースの標準化アプローチ、可観測性において優位。
3. [Amazonの最近の事例](https://arstechnica.com/ai/2026/03/after-outages-amazon-to-make-senior-engineers-sign-off-on-ai-assisted-changes/)（AWS部門でAI支援変更にシニアエンジニアの承認を義務化）が示すように、AIエージェントが生成したソフトウェアを**運用・保守する現実**が到来しつつある。
4. Garry TanやAndrew Ngの個人的な均質環境での成功例は、**多様なスキル・経験レベルを持つチーム**には直接適用できない。
5. 信頼性が高く保守可能なソフトウェアを出荷するには、**一貫性・セキュリティ・高品質・正確性を保証するエンジニアリング規律**が必要であり、MCPはそのための適切なツールである。

> **"Long live MCP!"**（MCP万歳！）

---

## References

- [Model Context Protocol - Prompts](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts)
- [Model Context Protocol - Resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources)
- [Model Context Protocol - Subscriptions & Notifications](https://modelcontextprotocol.io/specification/2025-11-25/architecture#clients)
- [Apache AGE (Graph Extension for PostgreSQL)](https://github.com/apache/age)
- [Vercel: AGENTS.md Outperforms Skills in Agent Evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- [Amazon: Senior Engineers to Sign Off on AI-Assisted Changes](https://arstechnica.com/ai/2026/03/after-outages-amazon-to-make-senior-engineers-sign-off-on-ai-assisted-changes/)
- [Hackernews Discussion](https://news.ycombinator.com/item?id=47380270)
