---
title: "Thread by @zarazhangrui"
source: "https://x.com/zarazhangrui/status/2020992712825241801"
author:
  - "[[@zarazhangrui]]"
published: 2026-02-09
created: 2026-02-13
description: "Claude Codeでカスタムスラッシュコマンド「/handover」を作成し、セッション終了時にHANDOVER.mdを自動生成することで、セッション間のコンテキスト喪失を防ぎ、意思決定や教訓を次のセッションに引き継ぐ手法の紹介。"
tags:
  - "clippings"
  - "Claude Code"
  - "LLM"
  - "AI Coding"
  - "Context Management"
  - "Productivity"
---

## 概要

Zara Zhang氏（@zarazhangrui）が、Claude Codeにおけるセッション間のコンテキスト引き継ぎ問題を解決するカスタムスラッシュコマンド `/handover` を紹介した投稿。コンテキストウィンドウが埋まりセッションを終了する際に、**HANDOVER.md** という引き継ぎドキュメントを自動生成させることで、次のセッションのClaudeが完全なコンテキストを持って作業を継続できるようにする手法。

## 主要なトピック

### `/handover` コマンドの仕組み

- Claude Codeのセッション終了時（例：コンテキストウィンドウが埋まった時）にコマンドを実行
- Claudeが **HANDOVER.md** ドキュメントを自動生成する
- 次のセッションで新しいClaudeがこのドキュメントを読み込み、フルコンテキストで作業を再開できる

### HANDOVER.md に含まれる内容

- セッション中に行った作業内容の要約
- 下した意思決定とその理由
- 遭遇した落とし穴（pitfalls）
- 得られた教訓（lessons learned）

### 解決する問題

- **LLMの「記憶喪失」（amnesia）の防止**: セッションが切り替わるたびに失われるコンテキストを永続化する
- **組織的知識（institutional knowledge）の保存**: セッションを跨いで蓄積される知見を文書として残す

![Image](https://pbs.twimg.com/media/HAwBvUIaIAA1pMi?format=jpg&name=large)

## 重要な事実・データ

- **LLMの性能劣化**: 研究によると、LLMはコンテキストウィンドウの約20%が埋まった時点から性能が劣化し始め、自身の出力にアンカリングしてエラーを繰り返す傾向がある
- **Handover/Handoffパターン**: この手法はClaude Codeコミュニティで広く採用されており、類似のアプローチとして `/handoff-prompt-to`、`/wipe`、`/compact` などのコマンドが存在する

## 結論・示唆

### 著者の結論

カスタムスラッシュコマンドによるセッション引き継ぎは、LLMを使った開発における「記憶喪失」問題のシンプルかつ効果的な解決策である。

### 実践的な示唆

- **探索と実行の分離**: 一つのセッションで探索・計画を行い、クリーンなプロンプトを生成して新しいセッションで実行するのが最適なワークフロー
- **CLAUDE.md との併用**: セッション横断の永続的なプロジェクトコンテキストとして `CLAUDE.md` を活用し、エージェントのミスや学びを蓄積する
- **`.claude/commands/` への配置**: カスタムコマンドはプロジェクトの `.claude/commands/` ディレクトリに配置することで、チーム全体で共有可能

## 関連リソース

- [Claude Code Field Guide by TheSylvester](https://gist.github.com/TheSylvester/29c9f9defad320e6d51f971274f9bf71) - Handover/Handoffパターンの詳細なガイド
- [Claude Code /wipe command](https://gist.github.com/GGPrompts/62bbf077596dc47d9f424276575007a1) - `/wipe` コマンドの実装例

---

*Source: [Thread by @zarazhangrui](https://x.com/zarazhangrui/status/2020992712825241801)*