---
title: "claude-plugins-official/plugins/ralph-wiggum at main · anthropics/claude-plugins-official"
source: "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-wiggum"
author:
  - "noahzweben"
published:
created: 2025-12-29
description: "Ralph Wiggumプラグインは、Claude Codeで反復的で自己参照的なAI開発ループを実装するプラグイン。Stop hookを使用してClaudeの終了試行をインターセプトし、同じプロンプトを繰り返しフィードバックすることで、タスクが完了するまで自動的に改善を続ける開発手法を提供する。"
tags:
  - "claude-plugins"
  - "ralph-wiggum"
  - "ai-development"
  - "iterative-development"
  - "claude-code"
  - "automation"
---

## Ralph Wiggum Plugin

### 概要

Ralph Wiggumプラグインは、Claude Codeで反復的で自己参照的なAI開発ループを実装するプラグインです。Geoffrey Huntleyによって提唱された「RalphはBashループ」という概念に基づき、AIエージェントにプロンプトファイルを繰り返しフィードすることで、タスクが完了するまで反復的に作業を改善する開発手法を提供します。

## コアコンセプト

### Ralphとは

Ralphは、継続的なAIエージェントループに基づく開発手法です。Geoffrey Huntleyの説明によると、Ralphは「Bashループ」— 単純な `while true` ループで、AIエージェントにプロンプトファイルを繰り返しフィードし、完了するまで反復的に作業を改善するものです。

この手法は、The SimpsonsのRalph Wiggumにちなんで名付けられており、挫折にもかかわらず継続的に反復する哲学を体現しています。

### 動作原理

このプラグインは、**Stop hook**を使用してClaudeの終了試行をインターセプトすることでRalphを実装します：

1. **一度だけ実行**: `/ralph-loop "タスクの説明" --completion-promise "DONE"`
2. **自動的なループ**:
   - Claude Codeがタスクに取り組む
   - 終了を試みる
   - Stop hookが終了をブロック
   - Stop hookが同じプロンプトを再度フィード
   - 完了するまで繰り返す

ループは**現在のセッション内**で発生するため、外部のbashループは不要です。`hooks/stop-hook.sh`のStop hookが、通常のセッション終了をブロックすることで自己参照的なフィードバックループを作成します。

### 自己参照的フィードバックループ

この仕組みにより、以下の特徴を持つ自己参照的フィードバックループが実現されます：

- **プロンプトは反復間で変更されない**: 同じプロンプトが繰り返し使用される
- **Claudeの以前の作業はファイルに永続化される**: 各反復で以前の作業を参照可能
- **各反復で変更されたファイルとgit履歴を確認**: 進捗を追跡できる
- **Claudeはファイル内の過去の作業を読むことで自律的に改善**: 自己学習的な改善プロセス

## クイックスタート

### 基本的な使用例

```bash
/ralph-loop "TODOのREST APIを構築。要件: CRUD操作、入力検証、テスト。完了時に<promise>COMPLETE</promise>を出力。" --completion-promise "COMPLETE" --max-iterations 50
```

Claudeは以下のように動作します：

1. APIを反復的に実装
2. テストを実行して失敗を確認
3. テスト出力に基づいてバグを修正
4. すべての要件が満たされるまで反復
5. 完了時に完了プロミスを出力

## コマンド

### `/ralph-loop`

現在のセッションでRalphループを開始します。

**使用方法:**

```bash
/ralph-loop "<prompt>" --max-iterations <n> --completion-promise "<text>"
```

**オプション:**

- `--max-iterations <n>`: N回の反復後に停止（デフォルト: 無制限）
- `--completion-promise <text>`: 完了を示すフレーズ

### `/cancel-ralph`

アクティブなRalphループをキャンセルします。

**使用方法:**

```bash
/cancel-ralph
```

## プロンプト作成のベストプラクティス

### 1. 明確な完了基準

**❌ 悪い例:** "TODO APIを構築して良いものにする。"

**✅ 良い例:**

```text
TODOのREST APIを構築。完了時:
- すべてのCRUDエンドポイントが動作
- 入力検証が実装されている
- テストがパス（カバレッジ > 80%）
- APIドキュメント付きREADME
- 出力: <promise>COMPLETE</promise>
```

### 2. 段階的な目標

**❌ 悪い例:** "完全なeコマースプラットフォームを作成する。"

**✅ 良い例:**

```text
フェーズ1: ユーザー認証（JWT、テスト）
フェーズ2: 商品カタログ（リスト/検索、テスト）
フェーズ3: ショッピングカート（追加/削除、テスト）
すべてのフェーズが完了したら <promise>COMPLETE</promise> を出力。
```

### 3. 自己修正

**❌ 悪い例:** "機能Xのコードを書く。"

**✅ 良い例:**

```text
TDDに従って機能Xを実装:
1. 失敗するテストを書く
2. 機能を実装
3. テストを実行
4. 失敗があればデバッグして修正
5. 必要に応じてリファクタリング
6. すべてがグリーンになるまで繰り返す
7. 出力: <promise>COMPLETE</promise>
```

### 4. エスケープハッチ

常に `--max-iterations` を安全網として使用し、不可能なタスクでの無限ループを防ぎます：

```bash
# 推奨: 常に合理的な反復制限を設定
/ralph-loop "機能Xを実装してみる" --max-iterations 20

# プロンプトに、行き詰まった場合の対処を含める:
# "15回の反復後、完了していない場合:
# - 進捗を妨げているものを文書化
# - 試みたことをリストアップ
# - 代替アプローチを提案"
```

**注意**: `--completion-promise` は完全一致の文字列マッチングを使用するため、複数の完了条件（"SUCCESS" vs "BLOCKED"など）には使用できません。常に `--max-iterations` を主要な安全メカニズムとして依存してください。

## 哲学

Ralphは以下の重要な原則を体現しています：

### 1. 反復 > 完璧

最初から完璧を目指さない。ループに作業を改善させる。

### 2. 失敗はデータ

「決定的に悪い」とは、失敗が予測可能で情報的であることを意味します。それらを使用してプロンプトを調整します。

### 3. オペレーターのスキルが重要

成功は良いモデルを持つことだけでなく、良いプロンプトを書くことにも依存します。

### 4. 継続性が勝利する

成功するまで試し続ける。ループが自動的にリトライロジックを処理します。

## Ralphを使用すべき場面

### 適している場面

- 明確な成功基準を持つ明確に定義されたタスク
- 反復と改善を必要とするタスク（例: テストをパスさせる）
- 立ち去ることができるグリーンフィールドプロジェクト
- 自動検証（テスト、リンター）を持つタスク

### 適していない場面

- 人間の判断や設計決定を必要とするタスク
- ワンショット操作
- 不明確な成功基準を持つタスク
- 本番環境のデバッグ（代わりにターゲットを絞ったデバッグを使用）

## 実世界での結果

- Y Combinatorハッカソンのテストで、一晩で6つのリポジトリを正常に生成
- 1件の$50k契約を$297のAPIコストで完了
- このアプローチを使用して3ヶ月で完全なプログラミング言語（"cursed"）を作成

## 詳細情報

- **元の手法**: <https://ghuntley.com/ralph/>
- **Ralph Orchestrator**: <https://github.com/mikeyobrien/ralph-orchestrator>

## ヘルプ

詳細なコマンドリファレンスと例については、Claude Codeで `/help` を実行してください。

## 技術的な詳細

### ディレクトリ構造

プラグインは以下のディレクトリ構造を持ちます：

- `.claude-plugin/`: プラグイン設定ファイル
- `commands/`: カスタムコマンドの実装
- `hooks/`: Stop hookを含むフック実装
- `scripts/`: 補助スクリプト
- `README.md`: ドキュメント

### 最新のコミット情報

- **最新コミット**: 19a119f (Dec 13, 2025)
- **コミッター**: noahzweben
- **コミットメッセージ**: "Update plugins library to include authors (#6)"

### リポジトリ情報

- **リポジトリ**: anthropics/claude-plugins-official
- **スター数**: 976
- **フォーク数**: 96
- **Issues**: 22
- **Pull requests**: 28
