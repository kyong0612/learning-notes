---
title: "バクラクのモノレポにおける AI Coding のための環境整備と {Roo,Claude} Code活用事例 / AI Coding in Bakuraku's Monorepo: Environment Setup & Case Studies with {Roo, Claude} Code"
source: "https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code"
author:
  - "[[upamune / Yu SERIZAWA]]"
published: 2025-06-12
created: 2025-07-25
description: "AI Coding Meetup #2 Cline/RooCode/Claude Codeの活用事例 https://layerx.connpass.com/event/355449/ での登壇資料です。"
tags:
  - "clippings"
  - "AI-Coding"
  - "Monorepo"
  - "Roo-Code"
  - "Claude-Code"
  - "LayerX"
---

AI Coding Meetup #2 Cline/RooCode/Claude Codeの活用事例 ([https://layerx.connpass.com/event/355449/](https://layerx.connpass.com/event/355449/)) での登壇資料です。

## 概要

本資料では、株式会社LayerXのバクラク事業部における、モノレポ環境でのAI Coding Agent（特にRoo CodeとClaude Code）の活用事例について解説します。環境整備の課題と解決策、AIに依存しないコンテキスト整備の重要性、そして具体的な活用Tipsが紹介されています。

---

## プレゼンテーション要約

### イントロダクション (スライド 1-3)

[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_0.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#1)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_1.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#2)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_2.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#3)

* **発表者**: upamune (うぱ) / Yu SERIZAWA 氏 (LayerX バクラク事業部 Software Engineer)
* **内容**: AI Coding Agentを利用する上での実践的な課題、環境整備、そしてRoo CodeとClaude Codeの活用事例を紹介。

### 1. AI Codingのための環境整備 (スライド 4-25)

モノレポ環境特有の課題と、それらに対する具体的な解決策を提示します。

**前提: バクラクはモノレポ開発** (スライド 5)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_4.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#5)

* `bakuraku-backend` と `bakuraku-webapps` の2つの主要なモノレポで開発。

**課題と解決策** (スライド 6-25)

1. **開発者・チームによるルールの違い** (スライド 7-13)
    [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_6.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#7)
    * **課題**: チームごとに規約や技術スタックが異なり、共通ルールが邪魔になることがある。不要なルールはコンテキストウィンドウを圧迫する。
    * **解決策**:
        * `.clinerules/` や `.roo/rules/` を `.gitignore` で管理対象外とし、ルール定義は「Rules Bank」として別管理。
        * 自作ツール `airule` を用いて、必要なルールをプレビューしながら選択的に適用。
        [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_12.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#13)

2. **リポジトリルート以外での作業** (スライド 14-16)
    [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_13.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#14)
    * **課題**: サブディレクトリでIDEを開くと、ルートのルールファイルが読み込まれない。
    * **解決策**: 自作ツール `airulesync` を使い、設定ファイルに基づいてルールを各ディレクトリに同期。
    [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_15.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#16)

3. **コンテキストが大きくなりがち** (スライド 18-25)
    [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_17.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#18)
    * **課題**: `bakuraku-backend` は約420万行、2万ファイルに及び、コンテキストウィンドウがすぐに埋まってしまう。
    * **現状の評価**:
        * **Gemini 2.5 Pro**: コンテキストウィンドウは大きいが、内容が増えると性能が低下する傾向。
        * **Roo Code (Intelligent Context Condensing / Codebase Indexing)**: まだ明確な効果は実感できていない。
        * **Claude Code**: `ripgrep` を活用した検索が非常に強力で、RAG（Retrieval-Augmented Generation）なしでも適切なファイルにたどり着ける。
        [![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_24.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#25)

### 2. AI Coding Agentに依存しないコンテキスト整備 (スライド 26-29)

[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_25.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#26)

* **重要性**: 整備されたコンテキストは、使用するAIツールが変わっても価値を持ち続ける永続的な資産となる。
* **具体例**:
  * **ADR / Design Doc**: NotionからMarkdownへ自動変換し、「なぜその設計か」をAIに提供。
  * **DBスキーマ**: `k1low/tbls` を利用してドキュメントを自動生成。
  * **社内ライブラリ**: `docs/libraries` 配下に使い方やベストプラクティスをドキュメント化。

### 3. Roo Code / Claude Codeでの活用事例 (スライド 30-45)

[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_29.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#30)

**共通Tips**

* **AI用の作業ディレクトリ**: `.gitignore` に追加した一時的なディレクトリ（`plan.md` 等の置き場）を用意する。(スライド 32)
* **実装計画**: 複雑な実装では、まずAIに計画を立てさせる（Plan/Architectモード）。(スライド 33)
* **プレイブック化**: 定型的な実装手順をドキュメント化し、AIと人間の両方に活用する。(スライド 34-35)
* **`git worktree`の活用**: 複数のブランチで並行してAIセッションを実行し、開発効率を向上させる。(スライド 36-37)

**Roo Code** (スライド 38-43)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_37.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#38)

* **特徴**: Clineのフォークだが独自に進化。カスタムモード、Orchestratorモード、高速な開発スピードが魅力。
* **カスタムモード活用例**: `ADR/Design Doc Writer`、`Figma UI/Playwright UX Reviewer`など、特定の役割に特化したモードを定義。
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_42.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#43)

**Claude Code (w/ Opus 4)** (スライド 44-45)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_43.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#44)

* **特徴**: 事前のルール整備が少なくても、非常に高い精度で動作する。曖昧な指示でも期待以上の結果を出すことが多い。

### 4. 新たな課題とまとめ (スライド 46-48)

[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_45.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#46)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_47.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#48)

* **新たな課題**: Claude Codeの導入により開発が加速し、結果としてコードレビューの量が増大している。
* **まとめ**:
  * AI Coding Agent導入の障壁自体もAIで解決可能。
  * 整備されたコンテキストはツールを超えて活きる資産となる。
  * Roo CodeはOrchestratorモードが強力、Claude Codeはルール整備の手間を大幅に削減する。
  * まずは実際に試してみることが重要。

---
[おしまい](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#50)
[![](https://files.speakerdeck.com/presentations/5ba17eb4629b45aeb2b194dddb0bd373/slide_49.jpg)](https://speakerdeck.com/upamune/ai-coding-in-bakurakus-monorepo-environment-setup-and-case-studies-with-roo-claude-code#50)
