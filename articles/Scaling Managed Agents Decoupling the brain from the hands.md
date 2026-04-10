---
title: "Scaling Managed Agents: Decoupling the brain from the hands"
source: "https://www.anthropic.com/engineering/managed-agents"
author:
  - "[[Lance Martin]]"
  - "[[Gabe Cemaj]]"
  - "[[Michael Cohen]]"
published: 2026-04-08
created: 2026-04-10
description: "Anthropicが開発したManaged Agentsの設計思想を解説。エージェントのharness（制御構造）はモデルの進化に伴い前提が陳腐化する問題を抱える。OSがハードウェアを抽象化したように、「脳（brain）」「手（hands）」「セッション」を分離した安定的なインターフェースを設計し、将来の実装変更に耐えうるスケーラブルなエージェント基盤を構築した。"
tags:
  - "clippings"
  - "AI"
  - "Agents"
  - "Anthropic"
  - "Claude"
  - "Architecture"
  - "Infrastructure"
  - "Scalability"
  - "Managed Agents"
---

## 概要

Anthropicのエンジニアリングブログ記事。エージェント用のharness（制御構造）はモデルの能力に関する前提を内包しており、モデルが進化するとその前提が陳腐化する（"go stale"）という根本的な課題を論じている。この問題に対し、Managed Agents——Claude Platform上でホストされる長時間エージェント実行サービス——を設計した。OSがハードウェアをプロセスやファイルといった抽象化で仮想化し、数十年にわたって安定したインターフェースを提供してきたのと同じパターンで、エージェントの構成要素を「**脳（brain）**＝Claude＋harness」「**手（hands）**＝サンドボックス＋ツール」「**セッション**＝イベントログ」に分離し、それぞれを独立して交換・障害回復可能にした。

## 主要なトピック

### Harnessの前提が陳腐化する問題

- Harnessはモデルが**単独ではできないこと**に関する前提をエンコードしている
- 具体例：Claude Sonnet 4.5はコンテキストの上限が近づくと作業を早期に切り上げる「**context anxiety**」を示したため、harnessにコンテキストリセットを追加して対処した
- しかしClaude Opus 4.5ではこの挙動が消失しており、リセット機能は不要な「dead weight」になった
- Harnessは継続的に進化することが予想されるため、**特定の実装に依存しない安定したインターフェース**が必要

### 「ペット」問題：結合されたコンテナの課題

初期設計では、セッション・harnessロジック・サンドボックスを**単一のコンテナ**に配置していた。

- **利点**: ファイル編集がsyscall直接呼び出し、サービス境界の設計が不要
- **問題点**:
  - コンテナが「[ペット](https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/)」化（名前付きで個別管理が必要な存在）
  - コンテナ障害時にセッションが喪失
  - WebSocketイベントストリームだけでは障害箇所の特定が不可能（harness障害、パケットドロップ、コンテナ停止が同じ症状）
  - デバッグにはコンテナ内にシェルを開く必要があるが、ユーザーデータが含まれるため実質的にデバッグ不能
  - 顧客のVPC接続要求に対し、ネットワークピアリングまたは顧客環境でのharness実行が必要

### 脳と手の分離（Decoupling the Brain from the Hands）

解決策として、3つの構成要素を**独立したインターフェース**に分離した：

| 構成要素 | 役割 | インターフェース |
|----------|------|------------------|
| **Brain（脳）** | Claude + harness | ステートレスなループ |
| **Hands（手）** | サンドボックス + ツール | `execute(name, input) → string` |
| **Session** | イベントログ | `emitEvent(id, event)`, `getEvents()` |

#### Harnessのコンテナ外移設

- Harnessがコンテナの外に出て、コンテナを他のツールと同様に `execute(name, input) → string` で呼び出す
- コンテナは**cattle**（交換可能な存在）に変化
- コンテナ障害時：harnessがツールコールエラーとしてキャッチ → Claudeに報告 → Claudeがリトライを判断 → 新コンテナを `provision({resources})` で初期化

#### Harness障害からの回復

- セッションログがharness外部に存在するため、harness内に永続化が必要なデータがない
- 障害時：新harnessを `wake(sessionId)` で起動 → `getSession(id)` でイベントログを取得 → 最後のイベントから再開

#### セキュリティ境界の改善

- **旧設計の脆弱性**: Claudeが生成した未信頼コードと認証情報が同一コンテナ内に存在。プロンプトインジェクションで環境変数を読み取られると、制限のない新セッションを生成可能
- **構造的解決**: トークンをサンドボックスから到達不能にする
  - **Git**: リポジトリのアクセストークンでサンドボックス初期化時にclone → ローカルgit remoteに設定 → エージェントはトークンに触れずに`push`/`pull`可能
  - **MCP（カスタムツール）**: OAuthトークンをセキュアなvaultに保管 → 専用プロキシ経由でMCPツールを呼び出し → プロキシがセッションに紐づくトークンでvaultから認証情報を取得 → harnessは認証情報を一切認識しない

### セッション ≠ Claudeのコンテキストウィンドウ

- 長時間タスクはコンテキストウィンドウを超過する → compaction（要約）、メモリツール（ファイル書き出し）、context trimming（古いツール結果やthinkingブロックの削除）で対処
- しかし**不可逆な取捨選択**は失敗リスクを伴う（将来のターンがどのトークンを必要とするか予測困難）
- 先行研究（[arXiv:2512.24601](https://arxiv.org/pdf/2512.24601)）：コンテキストをREPL内のオブジェクトとして保存し、LLMがコードを書いてフィルタ・スライスする手法

#### Managed Agentsでのアプローチ

- **セッションログ**がコンテキストウィンドウ外の永続的なコンテキストオブジェクトとして機能
- `getEvents()` インターフェースで任意の位置スライスを取得可能：
  - 最後に読んだ位置からの続き
  - 特定時点の数イベント前からの巻き戻し
  - 特定アクション前のコンテキスト再読み込み
- 取得したイベントはharnessで変換可能（プロンプトキャッシュヒット率の最適化、コンテキストエンジニアリング等）
- **関心の分離**: セッションは「回復可能なコンテキスト保存」を、harnessは「任意のコンテキスト管理」を担当

### Many Brains, Many Hands（多数の脳、多数の手）

#### Many Brains

- **VPC接続問題の解決**: Harnessがコンテナ内にないため、顧客リソースがどこにあってもアクセス可能
- **パフォーマンス向上**: 
  - 旧設計：各brainごとにコンテナが必要 → コンテナプロビジョニング完了まで推論不可 → サンドボックスを使わないセッションでもrepo clone、プロセス起動、イベント取得を待つ必要
  - 新設計：コンテナは必要時のみtool callでプロビジョニング → 推論はオーケストレーション層がセッションログからイベントを取得した時点で開始可能
  - **TTFT（Time to First Token）の改善**:
    - **p50: 約60%短縮**
    - **p95: 90%以上短縮**
  - 多数のbrainへのスケーリング＝多数のステートレスharnessの起動

#### Many Hands

- 各brainを**多数のhands**に接続する機能
- Claudeは複数の実行環境について推理し、どこに作業を送るか判断する必要がある（単一シェルより認知的に高度なタスク）
- 初期に単一コンテナとしたのは以前のモデルでは不可能だったため → 知能の向上に伴い、単一コンテナが制約になった
- 各handは `execute(name, input) → string` インターフェース → カスタムツール、MCPサーバー、Anthropic独自ツールのいずれにも対応
- harnessはサンドボックスがコンテナか、スマートフォンか、ポケモンエミュレータかを知らない
- brain間でhandを受け渡し可能

## 重要な事実・データ

- **TTFT改善**: p50で約60%短縮、p95で90%以上短縮
- **設計の着想元**: OSの抽象化（`read()` コマンドは1970年代のディスクパックでも最新のSSDでも同じインターフェース）
- **参照されたコンセプト**: Rich Suttonの「[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)」——手作りの仮定はスケーリングに負ける
- **Pets vs Cattle**: Cloudscalingが提唱したインフラ設計パターン
- **セッションインターフェース**: `emitEvent(id, event)`、`getEvents()`、`wake(sessionId)`、`getSession(id)`
- **サンドボックスインターフェース**: `execute(name, input) → string`、`provision({resources})`
- **コンテキスト管理の先行研究**: arXiv:2512.24601（コンテキストをREPLオブジェクトとして保存しプログラム的にアクセス）

## 結論・示唆

### 著者の結論

Managed Agentsは「まだ考えられていないプログラム」のためのシステムを設計するという古典的な計算機科学の課題に取り組んでいる。OSがハードウェアを十分に一般的な抽象化で仮想化し数十年間持続したように、Managed Agentsは将来のharness・サンドボックス・その他のコンポーネントに対応できるよう設計された**メタharness**である。

特定のharnessについて意見を持たず（unopinionated）、代わりに多様なharnessを許容する汎用インターフェースを提供する。例えばClaude Codeは優れたharnessとして広く利用されており、タスク固有のharnessも狭いドメインで卓越するが、Managed Agentsはこれらのいずれにも対応できる。

### 実践的な示唆

- **インターフェースに対する意見、実装に対しては中立**: Claudeが状態操作（セッション）と計算実行（サンドボックス）の能力を必要とすることは確実だが、脳や手の数・配置については前提を置かない
- **Harnessのリファクタリングはモデル進化と連動**: 新モデルがリリースされるたびに、harnessの前提を見直す必要がある
- **セキュリティは構造で担保**: トークンのスコープ制限（前提がモデルの賢さに負ける可能性あり）ではなく、構造的にサンドボックスからトークンに到達不能にすることが重要
- **コンテキスト管理の分離**: 永続保存（セッション）と動的管理（harness）を分離することで、将来のモデルに必要なコンテキストエンジニアリングの変化に対応可能

## 関連リンク

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Managed Agents ドキュメント](https://platform.claude.com/docs/en/managed-agents/overview)
- [The Bitter Lesson (Rich Sutton)](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
- [arXiv:2512.24601 - Context as Object](https://arxiv.org/pdf/2512.24601)

---

*Source: [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)*
