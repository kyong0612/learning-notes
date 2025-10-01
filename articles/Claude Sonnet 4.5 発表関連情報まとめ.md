---
title: "Claude Sonnet 4.5 発表関連情報まとめ"
source: "https://zenn.dev/schroneko/articles/claude-sonnet-4-5"
author:
  - "ぬこぬこ"
published: 2025-09-30
created: 2025-10-01
description: |
  Claude Sonnet 4.5 と関連プロダクトの発表・アップデートを網羅的に整理した Zenn 記事の概要。モデル性能、安全性強化、コンテキスト管理機能、SDK の刷新、対応サービス状況を俯瞰できる。
tags:
  - "claude-sonnet"
  - "anthropic"
  - "sdk"
  - "ai-agent"
  - "release-notes"
---

## tl;dr

- Claude Sonnet 4.5 が発表され、コーディングや複雑タスクで業界最高水準の性能と低いミスアライメントを両立。
- Claude Agent SDK（旧 Claude Code SDK）や VS Code 拡張、Chrome 拡張など周辺ツールが一斉に刷新。
- コンテキスト編集機能とメモリツールが Claude API に追加され、長時間タスクに強いエージェント設計が可能に。
- 主要なパートナー企業が Sonnet 4.5 を即日対応、利用状況ダッシュボードも提供開始。
- 追加リソースやボーナスプレビュー、コミュニティ発信も併せて紹介。

## Claude Sonnet 4.5 について

Anthropic が Claude Sonnet 4.5 を公開し、世界最高性能のコーディングモデルとして位置付け。リーズニングやエージェント構築、長時間タスクにも強みを持ち、価格は入力 $3／1M tokens、出力 $15／1M tokens と据え置き。公式ニュースリリースでは、多段ステップの複雑タスクを 30 時間超で遂行可能と説明されている。

### Claude Sonnet 4.5 の性能

SWE-bench Verified で 77.2% を記録し、OSWorld でも 61.4% と最高値を更新。金融・法律・医療・科学技術の専門家評価でも、Opus 4.1 を含む既存モデルを上回る専門知識と推論性能が確認された。公開デモではブラウザ操作やスプレッドシート入力など、直接的なアクション実行能力が示されている。

![](https://storage.googleapis.com/zenn-user-upload/61fce0feda1e-20250930.webp)

[デモ動画](https://www.youtube.com/watch?v=oXfVkbb7MCg)ではブラウザを通じた操作シーケンスを確認可能。

![](https://storage.googleapis.com/zenn-user-upload/9b91b06a2abc-20250930.webp)

複数のベンチマーク図表で、リーズニング・数学・各種タスクにおける性能向上が示された。

![](https://storage.googleapis.com/zenn-user-upload/af9437f24b83-20250930.webp)

![](https://storage.googleapis.com/zenn-user-upload/b0a2d753251b-20250930.webp)

![](https://storage.googleapis.com/zenn-user-upload/be162f9bc6d2-20250930.webp)

![](https://storage.googleapis.com/zenn-user-upload/81a195d25e2a-20250930.webp)

### ミスアライメントを軽減したモデル

安全性訓練により、過剰な従順さや虚偽回答、プロンプトインジェクションへの脆弱性を抑制。AI セーフティレベル 3（ASL-3）で公開され、CBRN（化学・生物・放射性・核）に関する入出力をフィルタする分類器を搭載。誤検知による対話中断に備え、Claude Sonnet 4 への切り替え機能を用意し、継続的に誤検知低減へ取り組むと明言している。

![](https://storage.googleapis.com/zenn-user-upload/3f24d1f5a109-20250930.webp)

### Claude Agent SDK

半年以上改善を続けた Claude Code を汎用エージェント構築ツールとして位置付け直し、名称を Claude Agent SDK に変更。メモリ管理や権限システム、サブエージェント機能などを強化し、コーディング以外のタスクへの適用を想定する。

### Bonus research preview

Max プラン契約者向けのリサーチプレビュー「Imagine with Claude」を期間限定公開。Claude がリアルタイムでソフトウェアを生成する様子を体験できるが、利用期間は 5 日間に限定されている。

### 補足

Claude Sonnet 4.5 は Sonnet 4 の完全上位互換であり、移行が推奨されている。

## AI エージェント向けの適切なコンテキストエンジニアリング

Anthropic のコンテキストエンジニアリング解説では、プロンプト設計に加えてコンテキスト（システム指示、ツール、外部データ、履歴など）を最適化する必要性を強調。情報過多による性能低下を「context rot」と定義し、必要最低限のトークンセットを厳選する戦略を提案している。例示やツールは冗長性を避け、実行時はファイルパスなどの軽量情報を保持し、必要時に動的取得する Just-in-time アプローチが推奨される。

![](https://storage.googleapis.com/zenn-user-upload/01c38e91ffad-20250930.png)

コンテキスト圧縮、構造化メモ、サブエージェントなどを組み合わせて、長時間タスクの制約を回避する方法も紹介された。

## Claude Agent SDK を使ってエージェントを構築

Claude Agent SDK の事例紹介では、コンピュータ操作機能を活用した財務管理、個人アシスタント、カスタマーサポート、ディープリサーチなどのエージェント実装を提案。エージェントループは「コンテキスト収集→アクション実行→検証→繰り返し」で構成され、検索・サブエージェント・メモリによる情報収集、ツール・bash・コード生成による行動、ルール定義や LLM による評価で検証するフレームが示された。

![](https://storage.googleapis.com/zenn-user-upload/b8b673386223-20250930.png)

反復後は失敗ケース分析や必要ツールの有無を確認し、実利用に沿ったテストセット整備を推奨している。

## Claude Agent SDK へのマイグレーション

名称変更に伴う移行ガイドでは、既存の `@anthropic-ai/claude-code`／`claude-code-sdk` パッケージをアンインストールし、新しい `@anthropic-ai/claude-agent-sdk`／`claude-agent-sdk` を導入する手順を提示。

![](https://storage.googleapis.com/zenn-user-upload/27bc08335e1e-20250930.png)

TypeScript／Python 双方でインポートの書き換えが必要であり、SDK 経由では `CLAUDE.md` や `settings.json`、スラッシュコマンドを自動参照しないため、利用する場合は `settingSources` を明示することが求められる。

## Claude Code をより自律的に

ニュース記事では、VS Code 拡張のネイティブ統合、ターミナルインターフェース 2.0、チェックポイント機能、`/usage` コマンド、思考モード切り替え、履歴検索などのアップデートを解説。デフォルトモデルは Sonnet 4.5 に更新された。

[紹介動画](https://www.youtube.com/watch?v=IpFG_K-1xog)で UI 変更を確認可能。

![](https://storage.googleapis.com/zenn-user-upload/148f2e447b40-20250930.webp)

チェックポイント機能は Claude の編集時のみ適用され、ユーザー編集や bash コマンドには適用されないため、バージョン管理との併用が推奨される。

![](https://storage.googleapis.com/zenn-user-upload/adee0b0f53c3-20250930.png)

## Claude Developer Platform におけるコンテキスト管理

Claude API にコンテキスト編集機能とメモリツールが追加され、トークン上限を意識せず長時間タスクを扱えるようになった。

### 実業務ではコンテキストウインドウのような制約は存在しない

コンテキスト編集機能は、上限に近づくと古いツール結果を自動削除し、トークン管理を自動化する。

![](https://storage.googleapis.com/zenn-user-upload/09a4d105bb19-20250930.png)

メモリツールは専用ディレクトリにファイルとして情報を保存し、後続セッションでも参照可能。クライアント側で保存先や永続化方法を制御できる。

YouTube のデモでは、メモリとコンテキスト編集を併用してボードゲーム「カタン」をプレイし、ナレッジベースを維持しながら古い情報を整理する様子が紹介された。

コンテキスト編集とメモリツールの併用で複雑タスクの成功率が 39% 向上し、単独でも 29% 向上。トークン消費も最大 84% 削減できる。

## Claude Sonnet 4.5 のメモリ＆コンテキスト管理

GitHub公開の Jupyter Notebook では、メモリツール（`memory_20250818`）とコンテキスト編集機能（`clear_tool_uses_20250919`）の実装例を提示。メモリは `/memories` ディレクトリに保存され、クライアント側で制御。ツール結果の古い項目を自動削除しながら会話を維持する方法が説明されている。

## Claude for Chrome 拡張機能

Max プラン契約者向けの Chrome 拡張がウェイトリスト登録者全員に解放。設定手順や使用感は別記事で詳述されており、ウェイトリスト登録ページも案内されている。

## Claude Code for VS Code （VS Code 拡張機能）

VS Code 用の Claude Code 拡張が v2.0.0 にアップデートし、ネイティブ統合を実現。

## Claude の利用状況が設定から見られるように

Claude アプリと Claude Code の利用状況をリアルタイムに確認できるダッシュボードが公開され、`https://claude.ai/settings/usage` でカレントセッションと週間リミットなどを表示可能。Claude Code 側でも `/usage` コマンドが追加された。

![](https://storage.googleapis.com/zenn-user-upload/a1896597078d-20250930.png)

![](https://storage.googleapis.com/zenn-user-upload/c0b85691cd0f-20250930.png)

## Claude Code 2.0.0 のアップデート内容

GitHub コミットでの主な更新点は以下の通り。

- VS Code ネイティブ拡張への刷新。
- ターミナル UI の刷新と `/rewind`／`/usage` コマンド追加。
- 思考モード切替のタブ固定化、`Ctrl+R` による履歴検索。
- Claude Config コマンドの拡充とエラー修正。
- Claude Agent SDK の名称変更・`--agents` フラグによるサブエージェント追加。

## 各社の Claude Sonnet 4.5 対応状況

Cursor、Windsurf、OpenRouter、Cline、Vercel、AWS Bedrock、Google Cloud Vertex AI、Devin、Genspark、Databricks、GitHub Copilot、Perplexity AI、GitLab Duo など主要サービスが Sonnet 4.5 をサポートしたと発表。

## おまけ 1

マスコットキャラクター「Claw'd」を紹介。Claude Artifacts で生成された SVG ベースのキャラクターで、読み方は「クロード」と推測される。

## おまけ 2

筆者が Claude のシステムプロンプトをリークした例を共有。詳細は X の投稿で確認可能。
