---
title: "Thread by @yoshi8__"
source: "https://x.com/yoshi8__/status/1938417368126148914?s=12"
author:
  - "[[@yoshi8__]]"
published: 2025-06-27
created: 2025-06-28
description: |
  吉波拓夢氏（@yoshi8__）による、Claude Codeを効果的に活用するための10のヒントをまとめたXのスレッド。
tags:
  - "clippings"
  - "ClaudeCode"
  - "AI-Agent"
  - "TDD"
  - "Workflow"
  - "Linting"
---
**吉波拓夢 『Mastraで学ぶAIエージェント開発』** [@yoshi8__](https://x.com/yoshi8__) [2025-06-27](https://x.com/yoshi8__/status/1938417368126148914/history)

Claude Codeの上手な使い方はこちら👇

### Claude Codeを効果的に使う10のヒント

1. **Plan modeへの切り替え**: `Shift + Tab` でPlan modeに切り替える。
2. **複数インスタンスの利用**: VSCode (Cursor) でClaude Codeを複数立ち上げる。
3. **ローカル環境の活用**: Dockerでローカル環境を立ち上げる。
4. **ルール設定 (`CLAUDE.md`)**: `CLAUDE.md`に「人名+手法」でルールを記述する。
5. **TDD + RGRC**: TDD (テスト駆動開発) とRGRC (Red, Green, Refactor, Commit) のサイクルで進める。
6. **ブラウザテストの自動化**: Playwright MCPを登録してブラウザテストを自動操作できるようにする。
7. **リンター/フォーマッターの導入 (eslint, prettier)**: `eslint`や`prettier`を入れてコード生成ごとに実行する。
8. **高速リンターの導入 (oxlint, biome)**: `oxlint`や`biome`を入れてコード生成ごとに実行する (7との選択)。
9. **pre-commitフックの設定**: `husky`でpre-commitを設定する。
10. **GitHub Issue連携**: `gh issue create`でGitHubにイシューを管理する。

---

#### 補足

**ふぁど｜なんでもやるCTO** [@fadysan_rh](https://x.com/fadysan_rh/status/1938431261837865261)

> prittierとbiomeどちらも回すんですかー？

**吉波拓夢 『Mastraで学ぶAIエージェント開発』** [@yoshi8__](https://x.com/yoshi8__/status/1938431393199268064)

> これは片方で良いです〜好みによるので２つ書いときました
