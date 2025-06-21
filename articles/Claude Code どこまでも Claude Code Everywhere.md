---
title: "Claude Code どこまでも/ Claude Code Everywhere"
source: "https://speakerdeck.com/nwiizo/claude-everywhere"
author:
  - "nwiizo"
published: 2025-06-18
created: 2025-06-21
description: |
  本資料は、Claude Codeが開発プロセスに与える影響と、その効果的な活用法について解説したプレゼンテーションです。単なるコード生成ツールではなく「開発パートナー」としてClaude Codeを位置づけ、エンジニアの役割が「実装」から「設計」や「意図の伝達」へとシフトすることを論じます。具体的なTips、環境設定、品質保証のガードレール構築まで、実践的なノウハウが網羅されています。
tags:
  - "clippings"
  - "Claude Code"
  - "AI"
  - "Software Development"
  - "Platform Engineering"
  - "Rust"
---

本稿は、nwiizo氏によるプレゼンテーション「Claude Code どこまでも/ Claude Code Everywhere」の内容を包括的に要約したものです。Claude Codeの登場によってエンジニアリングの現場がどう変わるのか、そしてこの新しいツールをいかにして最大限に活用するかが、具体的な事例と共に解説されています。

## 導入：Claude Codeとの出会い

発表者nwiizo氏は、株式会社スリーシェイクのソフトウェアエンジニア。2025年春にClaude Codeと出会い、当初は「便利なコーディング支援ツール」という認識だったものが、やがて開発のパラダイムを変える存在だと気づきます。

[![slide_1](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_1.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#1)

## 1. Claude Codeとは何か：開発パートナーへの進化

Claude Codeは、従来のAIアシスタントとは一線を画します。単なる「コード生成器」ではなく、プロジェクト全体を理解し、自律的に実装からデバッグまでこなす「開発パートナー」です。

- **自律性の向上**: 複数ファイルの連携変更、git操作、テスト実行、デバッグ、自己修正まで一貫して処理。
- **ターミナルネイティブ**: エディタの外で動作し、自然な開発フローに統合。
- **役割の変化**: エンジニアは「どう作るか」の実装作業から解放され、「なぜ作るか」「何を解決すべきか」という本質的な問いに集中できるようになります。

[![slide_4](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_4.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#4)
[![slide_5](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_5.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#5)

## 2. なぜClaude Codeが「使えない」と感じるのか

Claude Codeの能力を最大限に引き出せない背景には、人間側の指示の出し方に課題があることが多いです。

1. **抽象度のミスマッチ**: 「いい感じのWebアプリ作って」のような曖昧な指示では、AIは期待通りのものを生成できません。「認証機能付きのタスク管理システムで、優先度による並び替えとフィルタリング機能を実装」のように、具体的な要件を伝える必要があります。
2. **具体化の方向性欠如**: 「ユーザー管理」という抽象的な指示に対し、AIはメール認証、ソーシャルログインなど、数ある選択肢から一つを選びますが、それがこちらの意図と合致するとは限りません。
3. **対話（往復）の欠如**: 一度の指示で完璧を求めず、AIが生成したものを確認し、フィードバックを与えて改善させていく「具体と抽象の往復運動」が不可欠です。

[![slide_7](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_7.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#7)
[![slide_9](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_9.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#9)

## 3. Claude Codeとの効果的な連携とTips

Claude Codeの特性を理解し、効果的に連携するための3つのポイントと、具体的なTipsが紹介されています。

### 基本的な連携方法

- **明示的な指示**: 「バグを直して」ではなく、「`src/auth.rs`でpanic!が発生。`thiserror`でエラー型を定義し、テストも追加して」のように、ファイル名、ライブラリ名、エラー内容を具体的に伝えます。
- **タスク管理**: 複雑なタスクは`TodoWrite`ツールで記録し、進捗を可視化します。
- **コンテキスト制御**: パフォーマンス維持のため、`/clear`コマンドで定期的にコンテキストをクリアします。

### 効率化Tips & トリック

- **権限設定**: `claude --dangerously-skip-permissions`で権限チェックをスキップし、高速化（開発環境のみ推奨）。
- **思考力の制御**: `think`, `think harder`, `ultrathink`といったコマンド（非公式）で、タスクの複雑さに応じてAIの思考リソースを制御します。
- **ショートカットとセッション管理**: `Ctrl+j`でのファイル操作や、`/resume`, `/continue`でのセッション管理を駆使します。

[![slide_14](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_13.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#13)
[![slide_18](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_17.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#17)

## 4. Claude Codeが働きやすい環境を整える

AIの能力を最大限に引き出すには、人間が働きやすい環境を整えるのと同様に、AIが働きやすい環境を整備することが重要です。

1. **プロジェクト設定 (`CLAUDE.md`)**: プロジェクトルートや各ディレクトリに`CLAUDE.md`を配置し、コーディング規約（例: `unwrap()`の禁止）、使用するライブラリ（`thiserror`, `tokio`）、エラーハンドリング方針などを明記します。
2. **ツールチェーンの最適化 (`Makefile`)**: `cargo watch`, `cargo clippy`などをMakefileにまとめ、高速なフィードバックサイクルを構築します。
3. **段階的アプローチ**: 「REST APIを完全実装して」と一括で指示するのではなく、「エラー型定義 → エンドポイント設計 → ロジック実装 → テスト作成」のようにタスクを分割して指示します。
4. **並列開発・品質検証**: `git worktree`で複数の実装アプローチを並行して試したり、パフォーマンス、メンテナンス性など異なる観点で実装させて最も良いものを選択したりします。

[![slide_30](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_29.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#29)
[![slide_32](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_31.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#31)

## 5. 品質を保証するガードレール

Claude Codeの高速開発能力を活かしつつ、技術的負債を防ぐために、自動化されたガードレールを設けることが不可欠です。

1. **自動化されたチェック**: `cargo.toml`や`.cargo/config.toml`でlintルールを厳格化し、品質基準を機械的に担保します。
2. **Git Hooks (`husky`)**: コミット前に`fmt`, `clippy`, `test`を強制的に実行し、品質の低いコードがリポジトリに混入するのを防ぎます。
3. **コンテナでの環境隔離**: `npx @anthropic-ai/claude-code mcp add container-use`などを活用し、Claude Codeの実行環境をコンテナ内に隔離することで、意図しないファイル変更などのリスクからホストシステムを保護します。

[![slide_35](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_34.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#34)
[![slide_37](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_36.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#36)

## 結論：エンジニアリングの新たな地平

Claude Codeは、開発の「速度」を上げることで、開発の「質」をも変革します。

- **量が質に転化**: 1日で10パターンの実装を試し、比較検討することで、最適解を追求できる。
- **価値の源泉の変化**: 重要なのは「早く書く」ことではなく「何度も書き直せる」こと。「実装力」よりも、何を解決すべきかを考える「問題発見力」、全体最適を描く「アーキテクチャ設計力」、AIと協働する「意図の言語化力」といった「構想力」が新たな競争優位性になります。

私たちはエンジニアリングの再定義の瞬間に立っており、実装の奴隷から解放され、思考と創造に集中する時代が到来したと結論づけられています。

[![slide_40](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_39.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#39)
[![slide_42](https://files.speakerdeck.com/presentations/a98a9149370e4a609915000b7660fd60/slide_41.jpg)](https://speakerdeck.com/nwiizo/claude-everywhere#41)

## 参考文献

### 公式ドキュメント

- Claude Code 公式サイト
- Claude Code ドキュメント
- Claude Code Best Practices

### 実践事例・解説記事

- 抽象化をするということ - 具体と抽象の往復を身につける
- How I Use Claude Code
- LLMの制約を味方にする開発術
- Claude Code版Orchestratorで複雑なタスクをステップ実行する
- Agentic Coding Recommendations
- Claude Codeに保守しやすいコードを書いてもらうための事前準備
- Claude Codeによる技術的特異点を見届けろ
