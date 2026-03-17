---
title: "What is agentic engineering? - Agentic Engineering Patterns"
source: "https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/"
author:
  - "[[Simon Willison]]"
published: 2026-03-15
created: 2026-03-17
description: "コーディングエージェントを活用したソフトウェア開発の実践手法「Agentic Engineering」を定義し、エージェントの仕組み、人間の役割、バイブコーディングとの違いを解説するガイドの導入章。"
tags:
  - "clippings"
  - "coding-agents"
  - "agentic-engineering"
  - "LLMs"
  - "generative-ai"
---

## What is agentic engineering?（エージェンティック・エンジニアリングとは？）

Simon Willisonは **agentic engineering（エージェンティック・エンジニアリング）** を、**コーディングエージェントの支援を受けてソフトウェアを開発する実践** と定義している。

### コーディングエージェントとは

コーディングエージェントとは、**コードの記述と実行の両方ができるエージェント**のこと。代表的な例：

- [Claude Code](https://code.claude.com/)
- [OpenAI Codex](https://openai.com/codex/)
- [Gemini CLI](https://geminicli.com/)

### エージェントの定義

「エージェント」という用語の明確な定義は、[1990年代から](https://simonwillison.net/2024/Oct/12/michael-wooldridge/)AI研究者を悩ませてきた課題だが、LLM（GPT-5、Gemini、Claudeなど）の文脈では以下の定義を採用している：

> **エージェントとは、目標を達成するためにツールをループで実行するもの**

具体的には：
1. ソフトウェアがユーザーのプロンプトとツール定義をLLMに渡す
2. LLMが要求したツールを呼び出す
3. ツールの結果をLLMにフィードバックする

コーディングエージェントの場合、ツールには**コードを実行するもの**が含まれる。ユーザーが目標を定義し、エージェントがその目標が達成されるまでコードの生成と実行をループする。

### コード実行の重要性

**コード実行こそがエージェンティック・エンジニアリングを可能にする決定的な能力**である。コードを直接実行する能力がなければ、LLMの出力は限定的な価値しかない。コード実行により、エージェントは**実証的に動作するソフトウェア**に向けてイテレーションを開始できる。

---

## Agentic Engineering における人間の役割

コードを書けるソフトウェアが存在する今、人間に残された仕事は何か？

**答え：非常に多くのことがある。**

コードを書くことはソフトウェアエンジニアの唯一の活動ではなかった。本質は常に **どのコードを書くべきかを見極めること** にあった。あらゆるソフトウェア問題には、それぞれトレードオフを持つ数十の潜在的な解決策がある。エンジニアの仕事は、自身の固有の状況と要件に最適なものを見つけ出すことである。

コーディングエージェントから優れた成果を得ることは、それ自体が深いテーマであり、特にこの分野が驚異的な速度で進化し続けている現在においてはなおさらである。

### 人間が行うべきこと

- コーディングエージェントに**問題を解決するために必要なツール**を提供する
- 問題を**適切な詳細レベルで指定**する
- 結果を**検証しイテレーション**して、堅牢で信頼性の高い方法で問題に対処していることを確認する

### 重要な知見

> **LLMは過去の間違いから学習しないが、コーディングエージェントは学習できる** — ただし、学んだことに基づいて**指示やツールハーネスを意図的に更新**した場合に限る。

効果的に使用すれば、コーディングエージェントは取り組むプロジェクトにおいてより野心的になることを助け、**より多くの、より高品質なコード**を生産し、**よりインパクトのある問題**を解決できるようになる。

---

## バイブコーディング（Vibe Coding）との違い

「バイブコーディング」は2025年2月に[Andrej Karpathy](https://twitter.com/karpathy/status/1886192184808149383)が作った用語で、「コードの存在すら忘れながら」LLMにコードを書かせることを意味する。Claude Codeの最初のリリースのわずか3週間前だった。

一部の人はLLMがコードを生成する場合すべてをバイブコーディングと呼ぶが、**Simon Willisonはそれは間違い**だと主張する。バイブコーディングは元の定義（**レビューされていない、プロトタイプ品質のLLM生成コード**）で使う方が有用であり、本番品質まで引き上げたコードと区別する必要がある。

---

## このガイドについて

「Agentic Engineering Patterns」ガイドは進行中のプロジェクトであり、以下の目標を持つ：

- ツールの進歩によって**陳腐化しにくいパターン**を特定・記述する
- 新しいテクニックが出現するたびに**章を追加**する
- 既存の章も理解の深化に合わせて**継続的に更新**する

### ガイドの構成

| カテゴリ | 章 |
|---|---|
| **Principles** | Anti-patterns / AI should help us produce better code / Hoard things you know how to do / Writing code is cheap now / What is agentic engineering? |
| **Working with coding agents** | How coding agents work |
| **Testing and QA** | Agentic manual testing / First run the tests / Red/green TDD |
| **Understanding code** | Interactive explanations / Linear walkthroughs |
| **Annotated prompts** | GIF optimization tool using WebAssembly and Gifsicle |
| **Appendix** | Prompts I use |
