---
title: "My 'Grill Me' Skill Went Viral"
source: "https://www.aihero.dev/my-grill-me-skill-has-gone-viral"
author:
  - "[[Matt Pocock]]"
published: 2026-03-23
created: 2026-03-25
description: "AIに自分のアイデアや設計を徹底的に質問させる「Grill Me」スキルの紹介。コーディング計画の要件発見からノンコーディングの意思決定まで、構造化されたAI対話を通じて深い理解に到達するための汎用的なテクニック。"
tags:
  - "AI"
  - "Agent Skills"
  - "Prompt Engineering"
  - "Rubber Ducking"
  - "Developer Productivity"
---

*Matt Pocockが作成した`/grill-me`スキルは、AIにユーザーの計画や設計について徹底的にインタビューさせ、共通理解に到達するための短くも強力なプロンプト技法である。コーディングに限らず、あらゆる意思決定の場面で活用できる汎用ツールとしてバイラルに広まった。*

## スキルの全文

`grill-me`スキルの本体はわずか数行で構成されている：

```markdown
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until
we reach a shared understanding. Walk down each branch of the design
tree resolving dependencies between decisions one by one.

If a question can be answered by exploring the codebase, explore
the codebase instead.

For each question, provide your recommended answer.
```

### 重要な設計ポイント

- **「provide your recommended answer」の追加**：最近追加された一行。AIが明らかに良い回答がある質問をする際、推奨回答を提示するようにした。ユーザーは「yes」と答えるだけで済むため、会話の速度が大幅に向上する。
- **コードベース探索の指示**：質問がコードベースを調べれば答えられる場合は、ユーザーに聞く代わりにAIが自分でコードベースを探索する。

## 動作の仕組み

AIがユーザーに対して次々と質問を投げかけ、**共通理解（shared understanding）**に到達するまで対話を続ける。最終的に、カバーした内容のサマリーを提供する。

### コーディングでの活用

コーディングの初期フェーズで特に強力。すべての要件を対話を通じて発見する必要があるため、この「徹底的な質問」プロセスが機能する。

AI登場以前、開発者はこれを**ラバーダッキング（rubber ducking）**と呼んでいた——アイデアについて話すことで、すべての順列・条件分岐を自ら発見する手法である。`grill-me`はこのプロセスをAI相手に実現する。

### ノンコーディングでの活用

コーディング以外の用途にも適している。著者は次のコース内容の決定や、AIとの興味深い議論の生成にも使用している。ノンコーディング用途では、スキルを若干修正する：

```text
Interview me relentlessly about every aspect of this until
we reach a shared understanding. Walk down each branch of the design
tree resolving dependencies between decisions one by one.
For each question, provide your recommended answer.
```

コーディング版との違いは「this plan」→「this」への変更と、コードベース探索指示の削除のみ。

## 成果と効果

- **セッション時間**：約45分間の対話が典型的
- **得られるもの**：豊富なコンテキスト、ユーザー自身の実際のアイデア、難しい質問への回答が蓄積された会話ログ
- **柔軟な入力**：完全に練り上げたアイデアからでも、漠然とした数文のアイデアからでも開始可能
- **汎用性**：コーディング、事業計画、コンテンツ企画など、あらゆる意思決定シーンで活用できる

## インストール方法

```bash
npx skills@latest add mattpocock/skills/grill-me
```

または[GitHubのskillsリポジトリ](https://github.com/mattpocock/skills)から入手可能。

## 重要なポイント

1. **極めてシンプルな構成**：わずか数行のプロンプトが、強力な対話フレームワークとして機能する
2. **推奨回答の提示**が会話効率を劇的に改善する
3. **ラバーダッキングのAI版**として、要件の発見と意思決定の構造化に最適
4. **コーディング内外を問わない汎用性**が、このスキルの最大の強み