---
title: "12 Agentic Harness Patterns from Claude Code"
source: "https://generativeprogrammer.com/p/12-agentic-harness-patterns-from"
author:
  - "[[Bilgin Ibryam]]"
published: 2025-04-05
created: 2026-04-07
description: "Claude Codeのリークされたソースコードから抽出された、本番環境のコーディングエージェントを構築するための12の再利用可能な設計パターン。メモリ管理、ワークフロー制御、ツール権限、自動化の4カテゴリに分類される。"
tags:
  - "clippings"
  - "agentic-design-patterns"
  - "claude-code"
  - "LLM"
  - "agent-architecture"
  - "prompt-engineering"
---

## 概要

Claude Codeのソースコードリークから発見された、エージェントアプリケーション構築のための **12の再利用可能な設計パターン** を体系化した記事。著者の Bilgin Ibryam は [Kubernetes Patterns](https://k8spatterns.com/) や [Prompt Patterns](https://promptpatterns.dev/) の著者でもあり、リークされたハーネスコードにパターンを見出し、4つのカテゴリに整理した。

![](https://substackcdn.com/image/fetch/$s_!-QCT!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1dba753c-9631-416d-bfe5-d4b10472dc7f_3780x2520.png)

**4つのカテゴリ:**
1. **Memory & Context**（メモリとコンテキスト）— 5パターン
2. **Workflow & Orchestration**（ワークフローとオーケストレーション）— 3パターン
3. **Tools & Permissions**（ツールと権限）— 3パターン
4. **Automation**（自動化）— 1パターン

---

## 1. Memory & Context（メモリとコンテキスト）

静的なルールファイルから始まり、ディレクトリごとのスコープ設定、メモリの階層化、バックグラウンドでの整理、コンテキストウィンドウが埋まった際の圧縮まで、段階的に進化する5つのパターン。

### Pattern 1: Persistent Instruction File（永続的指示ファイル）

| 項目 | 内容 |
|------|------|
| **問題** | エージェントのセッションが毎回白紙の状態で開始し、ユーザーが同じ慣習やルールを繰り返し伝える必要がある |
| **解決策** | リポジトリに同梱される永続的なプロジェクトレベル設定ファイルを導入し、セッション開始時に自動的に読み込む |
| **内容** | ビルドコマンド、テストコマンド、アーキテクチャルール、命名規則、コーディング標準 |
| **適用場面** | 複数セッションにまたがるコードベースでの作業 |
| **トレードオフ** | メンテナンス負荷。プロジェクトの進化に合わせてファイルを最新に保つ必要があり、古い指示ファイルは害になりうる |

![](https://substackcdn.com/image/fetch/$s_!-gcZ!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F32a08a61-8c35-4611-ad80-2bd3e1d21987_1454x1158.png)

### Pattern 2: Scoped Context Assembly（スコープ付きコンテキスト組み立て）

| 項目 | 内容 |
|------|------|
| **問題** | 単一の指示ファイルはコードベースが大きくなると巨大なblobになるか、一般的すぎて役に立たなくなる |
| **解決策** | 組織、ユーザー、プロジェクトルート、親ディレクトリ、子ディレクトリなど複数スコープから動的に指示を読み込む |
| **特徴** | インポート構文で大きな指示セットを重複なく分割可能 |
| **適用場面** | モノレポ、多言語プロジェクト、ディレクトリごとに異なる規約を持つコードベース |
| **トレードオフ** | 発見可能性の低下。複数ファイルに分散した指示の全体像が把握しにくく、スコープ間の競合がある場合に予期しない挙動が発生しうる |

![](https://substackcdn.com/image/fetch/$s_!F9b0!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7614b409-ebef-4c5b-9475-1aeb8776d6e2_1454x918.png)

### Pattern 3: Tiered Memory（階層型メモリ）

| 項目 | 内容 |
|------|------|
| **問題** | すべてのメモリを同じ方法で記憶すると、トークンを浪費し、サイズ制限に達し、有用な情報がノイズに埋もれる |
| **解決策** | 3層のメモリ設計 |
| **層構成** | ① **コンパクトインデックス**（200行上限）— 常にコンテキストに存在 ② **トピック別ファイル** — タスクに一致した時にオンデマンドで読み込み ③ **完全セッション記録** — ディスクに保存、必要時のみ検索 |
| **適用場面** | 複数セッションで設定や決定事項、ワークフロー状態を保持する必要がある場合 |
| **トレードオフ** | 情報の配置先の判断、層間の昇格・降格、インデックスと基盤ファイルの同期維持に複雑さが加わる |

![](https://substackcdn.com/image/fetch/$s_!ltad!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb4ce989d-a8e7-4602-a33b-65bfd1c3be8f_1454x867.png)

### Pattern 4: Dream Consolidation（夢の統合）

| 項目 | 内容 |
|------|------|
| **問題** | 階層型メモリでも時間とともにメモリが劣化する。重複が蓄積、古い事実が新しい事実と矛盾、インデックスが肥大化 |
| **解決策** | アイドル時にバックグラウンドプロセスがメモリを定期的にレビュー・重複排除・整理（エージェント状態のガベージコレクション） |
| **実装詳細** | リークコードに["autoDream"モード](https://x.com/troyhua/status/2039052328070734102)が発見された。**8フェーズのメモリ管理**と**5種類のコンテキスト圧縮**が確認されている |
| **適用場面** | 多数のセッションでメモリが蓄積し、ユーザーによる手動管理に頼れない場合 |
| **トレードオフ** | 統合プロセス自体がトークンを消費し、ミスをする可能性がある。過度な削除は必要な情報を失う恐れ |

![](https://substackcdn.com/image/fetch/$s_!jo-X!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F02855a6a-252f-42d9-be62-a9ac1c361e26_1454x521.png)

### Pattern 5: Progressive Context Compaction（段階的コンテキスト圧縮）

| 項目 | 内容 |
|------|------|
| **問題** | 長いエージェントセッションはコンテキストウィンドウの上限に達し、最初のコンテキストを完全に失うか動作停止する |
| **解決策** | 会話の新旧に応じた複数段階の圧縮を適用 |
| **4つの圧縮レイヤー** | ① `HISTORY_SNIP` ② `Microcompact` ③ `CONTEXT_COLLAPSE` ④ `Autocompact` — 段階的に圧縮が強くなる |
| **圧縮戦略** | 最近のターン → 完全な詳細を保持、古いターン → 軽い要約、非常に古いターン → 積極的に折りたたみ |
| **適用場面** | セッションが定期的に20〜30ターンを超える場合 |
| **トレードオフ** | 非可逆圧縮。要約のたびに詳細が失われ、圧縮済みのセグメントの情報が後で必要になった場合、忘れたことを認めずにハルシネーションする可能性がある |

![](https://substackcdn.com/image/fetch/$s_!YZn3!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8fb2508c-b784-42ab-aac6-3926416eccf1_1454x534.png)

---

## 2. Workflow & Orchestration（ワークフローとオーケストレーション）

共通テーマは **分離**: 読み取りと書き込みの分離、調査コンテキストと編集コンテキストの分離、逐次作業と並列作業の分離。ほとんどのエージェントのデフォルト動作はすべてを混在させるが、タスクが大きくなるにつれてこの混在は品質を低下させる。

### Pattern 6: Explore-Plan-Act Loop（探索→計画→実行ループ）

| 項目 | 内容 |
|------|------|
| **問題** | エージェントがいきなりファイル編集に入ると、不完全な理解に基づいた変更を行い、誤ったファイルへの編集や依存関係の見落としが発生 |
| **解決策** | ワークフローを書き込み権限が段階的に増加する3つのフェーズに分離 |
| **3フェーズ** | ① **Explore**（探索）— 読み取り・検索・マッピングのみ ② **Plan**（計画）— ユーザーとアプローチを議論 ③ **Act**（実行）— フルツールアクセスが可能 |
| **適用場面** | 不慣れなコードベースへの変更、複数ファイルにまたがる非自明な変更 |
| **トレードオフ** | 速度。探索と計画の強制はアウトプットまでのターン数を増やし、単純なタスクには遅く感じる |

![](https://substackcdn.com/image/fetch/$s_!n6iF!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1ad9fd49-cec4-4db7-b75d-98b0786ddb39_1454x457.png)

### Pattern 7: Context-Isolated Subagents（コンテキスト分離されたサブエージェント）

| 項目 | 内容 |
|------|------|
| **問題** | 長いセッションでコンテキストウィンドウに調査結果、計画議論、コード編集、テスト出力、エラーログすべてが蓄積し、汚染される |
| **解決策** | 独自のコンテキストウィンドウ、システムプロンプト、制限されたツールアクセスを持つ別々のエージェントを実行 |
| **特徴** | 調査エージェント → コード編集不可、計画エージェント → コマンド実行不可。各サブエージェントは自分のタスクに必要なものだけを参照 |
| **適用場面** | 長時間のマルチフェーズセッション、異なるコンテキストニーズを持つタスク |
| **トレードオフ** | 調整オーバーヘッド。メインエージェントが各サブエージェントに何を渡すか判断する必要があり、引き継ぎ時に重要なニュアンスが失われる可能性 |

![](https://substackcdn.com/image/fetch/$s_!tv-_!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcf70b367-ad8b-43c0-866f-c9dce9ceabc1_1454x545.png)

### Pattern 8: Fork-Join Parallelism（フォーク-ジョイン並列処理）

| 項目 | 内容 |
|------|------|
| **問題** | 独立した単位に分割できる大きなタスクが、エージェントが同時に1つしか処理できないため逐次実行される |
| **解決策** | 複数のサブエージェントを並列に生成し、各々が独立したgit worktreeで作業。結果は全ブランチ完了時にマージ |
| **コスト効率** | 親のキャッシュされたコンテキストが各フォークで再利用されるため、並列分岐はトークンコストとしてほぼ無料 |
| **適用場面** | 相互に依存しない独立した単位に分解可能なタスク |
| **トレードオフ** | マージの複雑さ。並列ブランチが重複するファイルに触れた場合、逐次作業よりも解決が困難なコンフリクトが発生する可能性 |

![](https://substackcdn.com/image/fetch/$s_!Pf2k!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5c6a16c7-6856-4c66-9658-a7040811edc9_1454x790.png)

---

## 3. Tools & Permissions（ツールと権限）

メモリパターンがエージェントの「知識」、ワークフローパターンが「作業方法」に関するものなら、これらのパターンは **「許可されること」** に関するもの。リークコードは現在のほとんどのエージェントフレームワークをはるかに超えるツール設計と権限の粒度を示していた。

### Pattern 9: Progressive Tool Expansion（段階的ツール拡張）

| 項目 | 内容 |
|------|------|
| **問題** | すべてのツールに一度にアクセスを与えると選択問題が発生。60個のツールが見える状態では、モデルの選択精度が低下 |
| **解決策** | 小さなデフォルトセット（Claude Codeでは20未満）で開始し、追加ツールをオンデマンドで活性化 |
| **デフォルトツール** | Read, Edit, Write, Bash, Grep, Glob など。MCPツール、リモートツール、カスタムスキルは必要時のみ |
| **適用場面** | 多くのツールにアクセスできるが、大半のタスクは数個しか必要としない場合 |
| **トレードオフ** | 拡張ロジックの複雑さ。いつツールを活性化するかの判断が必要で、遅すぎる活性化はターンを浪費する |

![](https://substackcdn.com/image/fetch/$s_!E3HP!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1970e01d-4e61-45b2-bc97-c1e072874b44_1454x455.png)

### Pattern 10: Command Risk Classification（コマンドリスク分類）

| 項目 | 内容 |
|------|------|
| **問題** | エージェントが任意のシェルコマンドを無検査で実行するのは危険だが、すべてのコマンドをユーザーに承認させると疲労が生じ、全て「はい」をクリックしてしまう |
| **解決策** | 決定論的な事前パーシングとツールごとの権限ゲートを実行前に適用 |
| **実装** | 各ツールに **allow/ask/deny** ルールとパターンマッチングを設定。シェルコマンドは動詞・フラグ・ターゲットを解析してリスクを評価する分類レイヤーを通過 |
| **特徴** | [auto-mode classifier](https://x.com/S0nne123/status/2038979121267495277) が低リスクアクションを自動承認、危険なものには安全分類器を維持 |
| **適用場面** | シェルコマンド実行や外部システムとのやり取りが可能なエージェント |
| **トレードオフ** | 硬直性。決定論的分類器はすべての安全/危険なコマンドを予測できず、ルールには継続的なチューニングが必要 |

![](https://substackcdn.com/image/fetch/$s_!XutZ!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2733371f-3598-4020-a3f9-9d2f83c4bb3d_1454x622.png)

### Pattern 11: Single-Purpose Tool Design（単一目的ツール設計）

| 項目 | 内容 |
|------|------|
| **問題** | 汎用シェル（cat, sed, grep, find）経由のファイル操作は、レビュー・権限設定・モデルの正しい使用が困難。ファイルを編集するsedコマンドと破壊するsedコマンドは構造的に同一に見える |
| **解決策** | 汎用シェルを各操作用の専用ツールに置き換える：FileReadTool, FileEditTool, GrepTool, GlobTool |
| **特徴** | 各ツールが型付き入力、制約されたスコープ、独自の権限ルールを持つ。「検証済み入力と明確な境界を持つ事前定義ツール」（Raschka） |
| **適用場面** | 一般的なファイル操作や検索操作を頻繁に行うエージェント |
| **トレードオフ** | 柔軟性。専用ツールはすべてのエッジケースをカバーできないため、フォールバックとして汎用シェルが依然として必要 |

![](https://substackcdn.com/image/fetch/$s_!SV84!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Faba2d390-5198-4fad-9471-faf0fef9c549_1454x529.png)

---

## 4. Automation（自動化）

最後のパターンは他のすべてのカテゴリを横断する。メモリ、ワークフロー、ツールのいずれにも等しく当てはまる問題に対処する：**モデルは毎回実行すべき手続き的なステップを確実には記憶できない**。

### Pattern 12: Deterministic Lifecycle Hooks（決定論的ライフサイクルフック）

| 項目 | 内容 |
|------|------|
| **問題** | フォーマッター実行、コマンド検証、作業ディレクトリ変更時の設定再読み込みなど、毎回例外なく実行すべきアクションがある。プロンプト指示でモデルに記憶させるのは不安定 |
| **解決策** | エージェントライフサイクルの特定ポイントで、プロンプトの外部で自動的にシェルコマンドやアクションを実行 |
| **実装** | リークコードには **25以上のフックポイント** が含まれていた：`PreToolUse`, `PostToolUse`, `SessionStart`, `CwdChanged` など |
| **原則** | 毎回発生しなければならないものは指示ではなくフックに属する |
| **適用場面** | スキップしてはならない不変の動作がある場合 |
| **トレードオフ** | デバッグの困難さ。フックで問題が発生した場合、会話の外で実行されるためプロンプトレベルの指示よりも診断が難しい |

![](https://substackcdn.com/image/fetch/$s_!7yZs!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd29d38c6-392b-44c9-8686-bf7728947ea5_1454x680.png)

---

## 重要な結論・発見

1. **これらのパターンは一時的なトリックや製品固有の機能ではない**。エージェントハーネス設計の礎石（cornerstone）である
2. **メモリ階層化、コンテキスト圧縮、権限ゲート、ライフサイクルフック** は、モデルやツールが進化しても関連し続けるアーキテクチャ上の意思決定である
3. Claude Codeリークは、**数十万人の開発者が使用する本番エージェント** においてこれらのパターンがどう実装されているかを見る稀な機会を提供した
4. パターンは **段階的に構成** されている — 単純な静的ファイルから始まり、スコープ付き動的読み込み、階層型メモリ、バックグラウンド整理、段階的圧縮へと進化する
5. ほとんどのエージェントのデフォルト動作は **すべてを混在させる** が、タスクが大きくなるにつれて品質が低下するため、**読み取りと書き込み、調査と編集、逐次と並列** の明確な分離が必要

## パターン一覧（クイックリファレンス）

| # | パターン名 | カテゴリ | 核心 |
|---|-----------|---------|------|
| 1 | Persistent Instruction File | Memory & Context | プロジェクトルールをリポジトリに同梱 |
| 2 | Scoped Context Assembly | Memory & Context | ディレクトリスコープで動的に指示を読み込み |
| 3 | Tiered Memory | Memory & Context | 3層メモリ（インデックス/トピック別/完全記録） |
| 4 | Dream Consolidation | Memory & Context | アイドル時にメモリを自動整理 |
| 5 | Progressive Context Compaction | Memory & Context | 会話の古さに応じた段階的圧縮 |
| 6 | Explore-Plan-Act Loop | Workflow & Orchestration | 読み取り→計画→実行の3フェーズ分離 |
| 7 | Context-Isolated Subagents | Workflow & Orchestration | 独自コンテキストを持つ分離されたサブエージェント |
| 8 | Fork-Join Parallelism | Workflow & Orchestration | 独立タスクをgit worktreeで並列実行 |
| 9 | Progressive Tool Expansion | Tools & Permissions | 小さなデフォルトセットからオンデマンド拡張 |
| 10 | Command Risk Classification | Tools & Permissions | allow/ask/denyルールでリスクを分類 |
| 11 | Single-Purpose Tool Design | Tools & Permissions | 汎用シェルの代わりに専用ツールを提供 |
| 12 | Deterministic Lifecycle Hooks | Automation | プロンプト外で不変動作を自動実行 |
