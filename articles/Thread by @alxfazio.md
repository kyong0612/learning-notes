---
title: "Skills を使ったサブエージェントのオーケストレーション"
source: "https://x.com/alxfazio/status/2002755351121133695"
author:
  - "alex fazio (@alxfazio)"
published: 2025-12-21
created: 2025-12-23
description: |
  複雑なワークフローにおいて、Skillsを使用してサブエージェントをオーケストレーションする手法について解説。各サブエージェントが独自のコンテキストを持つことでコンテキストの最適化が可能になる。ドキュメント化されていない`{skill}/agents/`フォルダ構造についても言及。
tags:
  - AI
  - Agent
  - Skills
  - Orchestration
  - Claude Code
  - Cursor
---

## 概要

alex fazio氏が、複雑なワークフローにおいてSkillsを使用してサブエージェントをオーケストレーションする手法を共有。コンテキストの最適化という観点から非常に効果的なアプローチであることを実体験に基づいて報告している。

## 主要ポイント

### Skillsによるサブエージェントのオーケストレーション

- **コンテキストの最適化**: 各サブエージェントは独自のコンテキストを持つため、コンテキストウィンドウを効率的に使用できる
- **動作確認済み**: 実際にテストして非常にうまく機能することを確認

### セッションコンテキストの節約テクニック

- Skill全体をサブエージェントでラップして呼び出すことで、さらにセッションコンテキストを節約可能
- **注意点**: この方法は内部で何が起きているかの可視性が低下する可能性がある（未テスト）

### 未ドキュメント化された機能

- **`{skill}/agents/` フォルダ**: Skill内にサブエージェントをパッケージ化できる
- この構造はどこにもドキュメント化されていないが、問題なく動作する

## アーキテクチャ図

投稿に添付された画像では、以下のようなオーケストレーターパターンが示されている：

### ORCHESTRATOR（メインSkill）の役割

1. セッションディレクトリの作成
2. TodoWrite状態の管理
3. サブエージェント間のコンテキスト受け渡し
4. レポートの収集と検証

### 5フェーズのサブエージェントパイプライン

```text
Phase 1 Agent
  └─ Returns: report_path + architecture_summary
        ↓
Phase 2 Agent  
  └─ Returns: report_path + structure_summary
        ↓
Phase 3 Agent
  └─ Returns: report_path + alignment_summary
        ↓
Phase 4 Agent
  └─ Returns: report_path + verification_summary (with revised_action_items)
        ↓
Phase 5 Agent
  └─ Returns: report_path + plan_summary
```

### データフローの特徴

- 各フェーズは `spawn + {inputs + 前フェーズの出力}` という形式で呼び出される
- 前のフェーズの結果を次のフェーズに渡すことで、段階的にコンテキストを構築
- 例: Phase 4 は `inputs + phase2_report_path + phase3_report_path + phase3_summary` を受け取る

## 実装のポイント

1. **コンテキスト分離**: 各サブエージェントが独立したコンテキストを持つことで、長いコンテキストによる性能低下を防ぐ
2. **段階的な情報伝達**: 必要な情報のみを次のフェーズに渡すことで効率化
3. **レポートベースの連携**: 各フェーズはレポートパスと要約を返すことで、柔軟な情報共有が可能

## エンゲージメント

- 40件の返信
- 112件のリポスト
- 1,095件のいいね
- 1,293件のブックマーク
- 152,000+回の閲覧

この投稿は、AIエージェント開発コミュニティで大きな反響を呼んでいる。
