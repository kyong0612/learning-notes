---
title: "Claude Code の CLAUDE.mdは設定した方がいい"
source: "https://syu-m-5151.hatenablog.com/entry/2025/06/06/190847"
author:
  - "syu-m-5151 (nwiizo)"
published: 2025-06-06
created: 2025-06-11
description: |
  Claude Codeを1週間使用して開発スタイルが完全に変わった体験談。CLAUDE.mdという設定ファイルを活用することで、AIとの協業において「助手席からの開発」を実現した方法を詳細に解説。探索・計画・実装・コミットのワークフロー、TDD、ツール活用テクニックまで、実践的なClaude Code活用法を紹介。
tags:
  - "claude-code"
  - "ai-development"
  - "development-workflow"
  - "claude-md"
  - "test-driven-development"
  - "ai-coding"
  - "productivity"
---

# Claude Code の CLAUDE.mdは設定した方がいい

## はじめに - 開発スタイルの劇的な変化

Claude Codeを使い始めて1週間で、著者の開発スタイルは完全に変わった。3ヶ月前に書いた「生成AIといっしょ: 動作するきれいなコードを生成AIとつくる」という記事では、まだ人間が「運転席」、AIが「副操縦士」という認識だったが、実際は異なっていた。

### AIの特性と従来の開発スタイルのミスマッチ

著者は根っからの「とりあえずコード書いてみよう」タイプで、設計書や計画は後回しにするスタイルだった。しかし、AIは指示に対して忠実すぎるため、曖昧な指示では意図しない方向に突き進んでしまう問題があった。

**CLAUDE.md**という設定ファイルがこの問題を解決した。プロジェクトの文脈、コーディング規約、よく使うコマンドをAIが理解できる形で記述しておくことで、「助手席からの開発」が現実のものとなった。

## CLAUDE.mdとは何か

### 3つの配置パターン

1. **プロジェクトメモリ** (`./CLAUDE.md`)
   - プロジェクトルートに配置
   - Git管理してチーム全体で共有
   - アーキテクチャ、技術スタック、開発フローを記載

2. **ユーザーメモリ** (`~/.claude/CLAUDE.md`)
   - ホームディレクトリに配置
   - 個人的な設定で全プロジェクトに適用
   - 個人のコーディングスタイルや好みを記載

3. **プロジェクトメモリ・ローカル** (`./CLAUDE.local.md`)
   - 現在非推奨、インポート機能の使用を推奨

### ファイル探索の仕組み

Claude Codeは現在のディレクトリから上位に向かって再帰的に探索し、見つかったCLAUDE.mdをすべて読み込む。サブディレクトリ内のCLAUDE.mdも、そのディレクトリのファイルを扱う時に自動参照される。

## 探索・計画・コード・コミットのワークフロー

Anthropicが推奨するワークフローは以下の4段階：

### ステップ1: 探索（関連ファイルの読み込み）

現状把握が最重要。変更対象のコードの使用場所、依存関係を理解する。

**重要なテクニック：**

```
@src/services/UserService.ts を読んで、まだコードは書かないで
```

「まだコードは書かないで」という制約により、AIが勝手に実装を始めることを防ぐ。

### ステップ2: 計画（think モードの活用）

Claude Codeの「思考モード」を活用：

- `think` - 基本的な分析
- `think hard` - より複雑な問題の検討
- `think harder` - システム全体への影響評価

計画は必ず文書化し、後で「なぜこの設計にしたか」を説明できるようにする。

### ステップ3: 実装（検証を含む）

段階的な実装を心がける：

1. 基本機能から開始
2. 各段階でのテスト実行
3. エラーハンドリングの強化
4. 問題発見時の軌道修正

### ステップ4: コミットとPR作成

- 論理的な単位でのコミット分割
- Conventional Commitsに従ったコミットメッセージ
- 詳細なPR説明の作成
- ドキュメントの更新

## テスト駆動開発（TDD）ワークフローの深掘り

### 現実的なTDD使用率

著者のTDD使用率は10%程度（おそらく5%）と正直に告白。理由は「作りながら考える」タイプの開発スタイルのため。

### AIがTDDを必要とする理由

AIは「親切すぎる」ため、テストがないと過剰な機能実装をしてしまう。テストがあることで明確なゴールが設定され、AIは迷わずに適切な実装を行える。

### TDD適用場面

1. **APIインターフェースが確定している時**
   - OpenAPI仕様書がある場合

2. **既存機能のリファクタリング**
   - 動作を変えずに内部構造を改善

3. **バグ修正**
   - 同じバグを二度と発生させないため

### TDDの4ステップ

1. **テストファースト** - 網羅的なテストケース作成
2. **RED** - 失敗の確認と分析
3. **GREEN** - 最小限の実装（AIの「親切心」を制約）
4. **REFACTOR** - テスト通過後のコード改善

## 便利なショートカットとツール

### @ ファイル選択の効果的な使い方

```
@src/services/UserService.ts のcreateUserメソッドを改善して
@src/services/UserService.ts と @src/models/User.ts を見て、データフローを説明して
@**/*Service.ts すべてのサービスファイルで共通のパターンを見つけて
```

### 通知設定

長時間タスクの完了通知設定により、作業効率が向上。

### # ルール追加の戦略的活用

一時的なルールの追加：

```
#このプロジェクトではzodでバリデーション。yupは使わない
#エラーメッセージは必ず日本語で記述
```

**ルールの優先順位：**

1. セッション中の`#`コマンド（最優先）
2. プロジェクトのCLAUDE.md
3. ユーザーのCLAUDE.md

## スクリーンショットとビジュアル確認

### CleanShot X の活用

標準スクリーンショットツールより優れた機能：

- 撮影後の注釈追加（矢印、テキスト、モザイク）
- スクロールキャプチャ
- GIF録画
- クラウドアップロードとURL共有

### Claude Codeとの連携

1. CleanShot Xでスクリーンショット撮影
2. 問題箇所に注釈追加
3. Claude Codeにドラッグ&ドロップ

画像による視覚的な指示により、AIの理解度が格段に向上する。

## セッション管理とコンテキストの継続性

### 継続的な開発フロー

```bash
# 前回セッションの続きから開始
$ claude --continue

# 特定セッションを選択
$ claude --resume
```

### プロンプト履歴の編集

```
[Esc][Esc] → 前のプロンプトを編集 → Enter
```

### 日課としての作業管理

1日の終わりに：

```
今日の作業内容を要約して、明日やるべきことをリストアップして
```

## 実践的なCLAUDE.md設定例

### プロジェクト概要の工夫

```markdown
# 🔄 CLAUDE.md - cctx Project Documentation

## 📋 Project Overview
**cctx** (Claude Context) is a fast, secure, and intuitive command-line tool 
for managing multiple Claude Code `settings.json` configurations. 
Built with Rust for maximum performance and reliability.
```

絵文字使用の理由：人間（著者）が見た時の分かりやすさ向上

### AIへの具体的な指示

```markdown
## 📚 Notes for AI Assistants

When working on this codebase:

1. **Always run `cargo clippy` and fix warnings** before suggesting code
2. **Test your changes** - don't assume code works
3. **Preserve existing behavior** unless explicitly asked to change it
```

重要な原則：**「予測可能性は賢さに勝る」**

### 開発ガイドライン

チェックリスト形式での記載により、AIもチェックしながら作業を行う。

## プロンプト改善のテクニック

### 強調レベルの3段階使い分け

1. **NEVER（絶対禁止）**
   - パスワードのハードコーディング禁止など

2. **YOU MUST（必須事項）**
   - 公開APIのドキュメント記載必須など

3. **IMPORTANT（重要事項）**
   - パフォーマンス影響の考慮など

## 高度な活用法

### カスタムスラッシュコマンド

GitHub Issue対応の自動化例：

```markdown
Please analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:
1. Use `gh issue view` to get the issue details
2. Understand the problem described in the issue
...
```

### Git Worktreeとの組み合わせ

複数タスクの同時進行：

```bash
# 機能開発用worktree
$ git worktree add ../project-feature-auth feature/auth

# バグ修正用worktree  
$ git worktree add ../project-bugfix-api bugfix/api-error
```

各worktreeで独立したClaude Codeセッションを実行し、コンテキストの混在を防ぐ。

### CI/CDへの統合

GitHub Actionsでの自動レビュー例：

```yaml
- name: Claude Code Review
  run: |
    claude -p "このPRの変更をレビューして、以下の観点で問題を指摘：
    - セキュリティ脆弱性
    - パフォーマンス問題
    - コーディング規約違反"
```

## まとめ - 3ヶ月前の理論から現実へ

### 助手席での開発の実現

**役割分担：**

- **人間の役割：** 目的地決定（何を作るか）、ルート提案（アーキテクチャ）、危険察知（セキュリティ、パフォーマンス）
- **Claudeの役割：** 実際の運転（コーディング）、交通ルール遵守（言語仕様、ベストプラクティス）、効率的ルート選択（アルゴリズム、最適化）

### レッドボックスとの遭遇

理解困難なコードが生成された場合の対処法：

```markdown
## 理解困難なコードへの対処
- IMPORTANT: 複雑な型定義には必ず使用例とコメントを追加
- YOU MUST: 生成したコードの動作原理を説明できること
```

### バイブスコーディングの実践

曖昧な指示でもAIが文脈を読んで適切に解釈：

- 「なんか認証周りがイケてない気がする。もっとスマートにして」
- 「パフォーマンスがビミョーだから、なんとかして」

これがCLAUDE.mdの威力であり、プロジェクトの文脈理解による適切な解釈が可能になる。

### 効果的なCLAUDE.md作成のコツ

1. **明確なプロジェクト概要** - AIも人間も理解できるように
2. **具体的なワークフロー** - 探索→計画→実装→コミット
3. **実用的なコマンド集** - よく使うものを網羅
4. **AIへの明示的な指示** - NEVER、YOU MUST、IMPORTANTを使い分ける

**結論：** CLAUDE.mdは単なる設定ファイルではなく、AIとの共通言語である。これにより、つまらない部分をAIに任せ、楽しい部分に集中できるようになった。コードを書く楽しさは失われておらず、むしろ向上している。
