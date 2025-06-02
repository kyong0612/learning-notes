---
title: "Claude Code完全攻略Wiki(隠しコマンド編 - think,拡張機能,思考予算)"
source: "https://zenn.dev/fbbp/articles/7aa9a46518a609"
author:
  - "fbbp"
published: 2025-05-25
created: 2025-06-02
description: |
  Claude 3.7 Sonnetで導入された拡張思考（Extended Thinking）機能と思考予算の仕組みについて解説。Claude Codeで使える隠しコマンドやキーワードを体系的に紹介し、効果的な活用方法を提案する。
tags:
  - "Claude"
  - "AI"
  - "Anthropic"
  - "拡張思考"
  - "思考予算"
  - "Claude Code"
---

## 概要

Claude 3.7 Sonnetで導入された拡張思考（Extended Thinking）機能と、その背後にある思考予算制御メカニズムについての詳細解説。Claude Codeで使用できる隠しキーワードを体系化し、実践的な活用方法を提案する。

## 拡張思考（Extended Thinking）とは

**拡張思考**は、Claudeが複雑な問題に取り組む際の内部的な推論プロセスを可視化する機能。通常のレスポンスの前に、Claudeがどのように考えているかを`thinking`ブロックとして出力する。

### 対応モデル

- Claude 3.7 Sonnet（初期導入）
- Claude 4 Opus, Sonnet

## 思考予算（Thinking Budget）システム

### 基本仕様

- **定義**: `budget_tokens`パラメータで指定する「Claudeが内部推論に使えるトークン数の上限」
- **最小値**: 1,024トークン
- **推奨範囲**: 32,000トークン以上ではバッチ処理が推奨（タイムアウトリスク）
- **特性**: 厳密な制限ではなく「目標値」として機能
- **推奨アプローチ**: タスクの複雑さに応じて段階的に増加

### 料金への影響

- 思考トークンは**出力トークンとして課金**
- Claude 3.7 Sonnet: $15/MTok（100万トークンあたり）
- 思考予算を大きく設定するほどコスト増加の可能性

## Claude Codeの隠しキーワード体系

Claude CodeではAPIの`budget_tokens`パラメータの代わりに、プロンプト内の特定キーワードで思考の深さを制御。

### キーワード分類表

| **最大予算（31,999トークン）** | **中予算（10,000トークン）** | **小予算（4,000トークン）** |
|---|---|---|
| think harder | think about it | think |
| think intensely | think a lot | - |
| think longer | think deeply | - |
| think really hard | think hard | - |
| think super hard | think more | - |
| think very hard | megathink | - |
| ultrathink | - | - |

### 使用例

```bash
# 4,000トークンの思考
claude "Please think about this architecture problem"

# 10,000トークンの思考
claude "Please think deeply about this architecture problem"
claude "Think a lot about the performance implications"

# 31,999トークンの思考（最大）
claude "Please think harder about this complex algorithm"
claude "Ultrathink about the best approach here"
```

## 機能の制限事項と問題点

### 言語の制限

- **問題**: キーワードが全て英語で、日本語の相当表現（「考える」「深く考える」）では拡張思考機能が発動しない
- **回避策**: 日本語プロンプトに英語キーワードを組み込む
  - 例: "○○と○○を元に画面設計書を作成してください。megathink"

### 公式対応

- 著者が公式リポジトリにローカライズ問題のissueを提起済み

## 実践的な活用Tips

### 1. 段階的アプローチ

1. まず`think`で試行
2. 不十分なら`think more`
3. さらに必要なら`think harder`
4. 最高レベルで`ultrathink`

### 2. コスト最適化

- 思考トークンも課金対象のため、必要に応じて使い分け
- 本当に深い思考が必要な場合のみ最大予算キーワードを使用

### 3. タスク別推奨キーワード

- **簡単なバグ修正**: `think`
- **アーキテクチャ設計**: `think deeply`
- **複雑なアルゴリズム最適化**: `ultrathink`

## 著者の実践方法

- 最大効果を求めて最大予算のワードのみ使用
- `ultrathink`を末尾に付与するマクロを活用

## まとめ

拡張思考機能は単なる「考えさせる」機能ではなく、思考予算による計算リソース制御の精密なシステム。Claude Codeは複雑な仕組みを直感的なキーワードで簡素化している。

### 推奨事項

- 次回Claude Code使用時は`ultrathink`を試行
- API利用時は課金額に注意
- Claude Maxプラン（使い放題）での利用が最もコスト効率的

## 参考リンク

- [Anthropic公式ドキュメント - 拡張思考](https://docs.anthropic.com/ja/docs/build-with-claude/extended-thinking)
- [Claude Code チュートリアル](https://docs.anthropic.com/ja/docs/claude-code/tutorials#use-extended-thinking)

134

48

### Discussion

![](https://static.zenn.studio/images/drawing/discussion.png)

記事についてコメントする  

[コミュニティガイドライン](https://zenn.dev/guideline) に則った投稿をしましょう。
