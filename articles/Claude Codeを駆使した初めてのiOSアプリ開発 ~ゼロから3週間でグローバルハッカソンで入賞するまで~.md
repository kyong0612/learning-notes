---
title: "Claude Codeを駆使した初めてのiOSアプリ開発 ~ゼロから3週間でグローバルハッカソンで入賞するまで~"
source: "https://speakerdeck.com/oikon48/claude-codewoqu-shi-sitachu-metenoiosapurikai-fa-zerokara3zhou-jian-degurobaruhatukasonderu-shang-surumade"
author:
  - "Oikon"
published: 2025-10-17
created: 2025-10-20
description: |
  iOS開発未経験者がClaude Codeを活用して3週間でモバイルアプリを開発し、RevenueCatのグローバルハッカソン「Shipaton」でBest Vibes Award 3位に入賞した事例。Subagent活用、コンテキスト管理、ドキュメント駆動開発など、AIエージェントを効果的に使用する実践的なワークフローを紹介。
tags:
  - Claude Code
  - iOS開発
  - AIコーディング
  - ハッカソン
  - SwiftUI
  - Subagent
  - コンテキスト管理
  - 個人開発
---

## 概要

iOS開発未経験のエンジニアが、Claude Codeを駆使して3週間でモバイルアプリを開発し、RevenueCatのグローバルハッカソン「Shipaton」でBest Vibes Award 3位に入賞した実践事例。Claude Code Meetup Tokyoでの発表資料。

**登壇者**: Oikon ([@oikon48](https://x.com/oikon48))  
**イベント**: [Claude Code Meetup Tokyo](https://aiau.connpass.com/event/369265/)  
**閲覧数**: 4.7k views

---

## 発表者プロフィール

- **名前**: Oikon
- **職業**: Software Engineer
- **趣味**: 個人開発、AIツール研究
- **Claude Code歴**: 2025年3月〜
- **特徴**: AIツールのアップデートを頻繁に検証

### 開発経験

- ❌ モバイルアプリ開発経験なし
- ❌ Swift、Kotlin、Flutter、ReactNative未経験
- ❌ Xcode未使用（「Macの初期設定時に最初に削除するもの」と認識）

---

## グローバルハッカソン「Shipaton」について

### イベント概要

- **主催**: RevenueCat
- **賞金総額**: $350,000以上
- **2025年の規模**:
  - 登録者数: 55,457人
  - プロジェクト数: 812件
- **参加条件**: 8月1日〜9月30日にRevenueCat SDKを使ったアプリをストアに公開

### 入賞結果

**Best Vibes Award 3位入賞 🎊**

短期間（3週間）でのAI駆動開発が評価された。

---

## 開発戦略

### 初期の決定事項

1. **プラットフォーム**: iOSのみに絞る
   - 理由: 未経験のリリース作業をマルチプラットフォームで行うのは困難

2. **技術選択**: SwiftUI
   - 理由: AIツールのDesign to Code機能で、ネイティブ言語の方が再現性が高い

3. **データ管理**: ユーザーデータを集めず、基本的にローカルで完結
   - 理由: ユーザーデータ・外部サービス利用は審査が厳しくなる

4. **メインツール**: Claude Code

---

## Claude Codeを使いこなすための核心思想

### 「Claude is Horse, Claude Code is Harness」

Claude（モデル）を馬に、Claude Code（ツール）を手綱に例えた哲学。適切に手綱を握ることで、強力な能力を引き出せる。

---

## 開発環境とセットアップ

### なぜXcodeではなくVSCode？

1. **学習時間の制約**: Xcodeの学習時間がなかった
2. **CLIツールの活用**: `xcrun`、`xcodebuild`が使用可能
3. **IDE連携の恩恵**: Claude CodeのIDE連携機能を活用
   - `mcp__ide__getDiagnostics`: コードの静的解析や診断情報を取得可能
   - 代替: Serenaやlsmcpでも可能

---

## 学習戦略

### `/output-style`でLearning Modeを活用

- タスクごとにInsightを提供
- `TODO(human)`で実装箇所の演習題材を生成
- **重要な原則**: 何をやっているかザックリでも理解できないと、適切な指示を出せない
- コードを可能な限り理解する努力が必要

---

## コンテキスト管理の実践

### 気をつけたこと

1. **CLAUDE.mdの見直し**: 冗長になりがちなので定期的に見直す（Local・Global共に）
2. **情報のドキュメント化**: 必要に応じて挿入
3. **不要なコンテキストの排除**: `/clear`（`/compact`より推奨）
4. **MCPサーバーの選別**: 不要なMCPサーバーは使わない
5. **Subagentsの積極活用**

### コンテキスト占有率の確認

`/context`コマンドで定期的にコンテキスト占有率を確認することを推奨。

---

## 実装ドキュメントの活用

### AWS KiroのSDD作法を参考

実装計画の✅チェックボックス付ドキュメントを作成。

### メリット

1. **実装計画の可視化**: 全体像を理解できる
2. **タスク粒度の調整**: 適切なサイズに分割可能
3. **引き継ぎの容易さ**: 他のAIエージェント（Subagent含む）に引き継げる
4. **Lost in the Middle対策**: 適宜参照することで文脈の迷子を防ぐ
5. **レビュー効率化**: AIエージェントが実装のコンテキストを理解できる

**結論**: ドキュメント化の一手間を入れるだけで、その後の実装が楽になる。

---

## Subagentの重要性

### Subagent（`/agent`）のメリット

- Mainのコンテキスト汚染を防ぐ

### Subagent活用のコツ

1. **参照ドキュメントの用意**
2. **適切なタスク粒度**: 大き過ぎないようにする
3. **明確な役割の定義**: DescriptionとツールでSubagentを限定

### Subagentの役割細分化

#### 1. Implementor

- **目的**: 実装専用
- **理由**: コンテキストウィンドウの観点から実装に集中

#### 2. Validator

- **目的**: 変更の検証
- **特徴**: READ onlyのため、Conflictが発生しない
- **運用**: 複数のSubagentsを積極的に使用するスラッシュコマンドを作成

#### 3. Architect

- **目的**: 全体設計の俯瞰
- **機能**: Architect Subagentを呼び出してフィードバック
- **権限**: READ only

**重要**: Claude CodeにおいてSubagentの活用は非常に重要。

---

## ビルド・テストのフィードバックループ

### 実装方針

XcodeのUIではなく、Claude Codeにスクリプトを実行させる。

### メリット

- Claude Codeのコンテキスト内にログが残る
- 実装からビルド完了までの作業を割り込みなく実行可能
- 単体テストもClaude Codeのワークフロー内で実行

### 作成した主なスクリプト

- ビルド
- テスト
- シミュレータ
- 実機インストール

**目標**: できるだけAIだけでフィードバックループを完結させる。人間は全体の理解とワークフローを整えることに専念。

---

## レビュープロセス

### マルチモデルレビュー

AIモデルによってコードレビュー内容が異なるため、複数のAIモデルでレビューを実施。

### ワークフロー

1. 複数のAIモデルでそれぞれレビュー
2. 各レビュー結果をドキュメントで出力
3. 1つのドキュメントに複数のレビューをまとめる
4. 妥当な変更だけを蒸留する

**目的**: 多様な視点から品質を向上させる。

---

## スマホ単体での開発

### 背景

限られた時間の中で本業や私用もあったため、スマホ単体で開発できるように工夫。

### 実現方法

- **GitHub**と**TestFlight**の配信を使用
- スマホだけで軽微な開発・修正作業が可能

---

## 開発の成果指標

### ccusage（Claude Codeの使用統計）

発表資料にccusageの統計が含まれている（具体的な数値は資料を参照）。

---

## まとめ

### 核心メッセージ

1. **「Claude is Horse, Claude Code is Harness」**
   - 適切に手綱を握ることで、Claude Codeの強力な能力を引き出せる

2. **Claude Codeの可能性**
   - ゼロから3週間でiOSアプリをリリースできるくらい強力なツール

3. **ツール選択の本質**
   - 今後も「どのAIツールがいいか」の論争は起きる
   - **重要なのは**: 自分の手に馴染むAIツールを使うことで、自分の能力を拡張すること

### フォロー

X: [@oikon48](https://x.com/oikon48)

---

## 参考文献

1. [How a Read-Only Sub-Agent Saved My Context Window (And Fixed My WordPress Theme)](https://dev.to/cassidoo/how-a-read-only-sub-agent-saved-my-context-window-and-fixed-my-wordpress-theme-4mco)
2. [Context windows - Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)
3. [How we built our multi-agent research system](https://www.anthropic.com/research/building-effective-agents)
4. [Claude Codeのセットアップとモバイルアプリの環境構築](https://zenn.dev/oikon/articles/claude-code-mobile-setup)
5. [Claude Codeを使ってAIにブログ記事執筆を任せてみた](https://zenn.dev/oikon/articles/claude-code-blog-writing)

---

## 重要な発見と洞察

### Claude Code活用の本質

- **技術的熟練度より重要**: AIエージェントを適切にコントロールするスキル
- **コンテキスト管理が鍵**: 不要な情報を排除し、必要な情報を適切に配置
- **ドキュメント駆動**: 実装前の計画文書化が、後続の開発効率を大幅に向上
- **Subagentの戦略的活用**: 役割を細分化することで、コンテキストの肥大化を防ぎ、効率的な開発を実現

### 未経験領域への挑戦

iOS開発未経験でも、Claude Codeと適切なワークフローにより、3週間でプロダクトレベルのアプリ開発とハッカソン入賞を達成できることを実証。

### 今後の開発スタイル

AIツールの性能向上により、「どの言語・フレームワークを知っているか」より「AIエージェントをいかに効果的に活用できるか」が重要になる時代の到来を示唆。
