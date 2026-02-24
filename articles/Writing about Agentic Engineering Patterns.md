---
title: "Writing about Agentic Engineering Patterns"
source: "https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/"
author:
  - "[[Simon Willison]]"
published: 2026-02-23
created: 2026-02-25
description: "Simon Willisonが「Agentic Engineering Patterns」というコーディングエージェント時代のベストプラクティス集を新プロジェクトとして立ち上げた告知記事。Vibe Codingとの対比でAgentic Engineeringを定義し、最初の2チャプター（Red/green TDD、Writing code is cheap now）を公開。ブログの新コンテンツ形態「Guide」の導入についても解説。"
tags:
  - "clippings"
  - "agentic-engineering"
  - "coding-agents"
  - "ai-assisted-programming"
  - "design-patterns"
  - "tdd"
  - "llms"
---

## 概要

Simon Willisonが、コーディングエージェント時代のベストプラクティスを体系的にまとめる新プロジェクト **[Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/)** を立ち上げた告知記事。1994年の「Design Patterns（GoF）」に着想を得た「チャプター形式のパターン集」として、週1〜2本のペースで成長させていく計画。

---

## Agentic Engineering の定義

- **Agentic Engineering** = Claude CodeやOpenAI Codexなどの **コーディングエージェント** を使ったソフトウェア開発。エージェントがコードの生成・実行・テスト・反復を人間のターンごとの指示なしに自律的に行える点が特徴。
- **Vibe Coding** = コードの中身に一切注意を払わないコーディング。非プログラマーがLLMを使うケースに多く関連。
- Agentic Engineeringはその **対極** にあり、プロのソフトウェアエンジニアが既存の専門知識を増幅するためにコーディングエージェントを活用するアプローチ。

---

## プロジェクトの背景と動機

- Willisonは既に [ai-assisted-programming タグ](https://simonwillison.net/tags/ai-assisted-programming/) で345件以上の記事を投稿してきたが、それらは比較的非構造的だった。
- 新たな目標は **「このツール群からどうやって良い結果を得るか」** という問いに一箇所で答えられるリソースを作ること。

---

## 最初の2チャプター

### Chapter 1: Writing code is cheap now（コードを書くコストは今や激安）

コーディングエージェント時代の **最大の課題** は、コードを書くコストが劇的に下がったことへの適応。

- **マクロレベル**: 設計・見積もり・計画に多くの時間を費やしてきたのは、コーディング時間が高価だったから。
- **ミクロレベル**: リファクタリング、ドキュメント作成、テスト追加の判断も、常にコストとの天秤だった。
- エージェントはコードの初期生成コストをほぼゼロに下げるが、**「良いコード」のコストはまだ高い**。

#### 「良いコード」の条件

- 動作すること、バグがないこと
- 正しい問題を解決していること
- テストで保護されていること
- アクセシビリティ・セキュリティ・保守性等の非機能品質
- 適切なレベルのドキュメント
- シンプルで最小限、エラーハンドリングが適切
- 将来の変更を阻害しない設計（ただしYAGNI原則も維持）

#### 新しい習慣の構築

- 「それを作る価値はない」と直感が言ったときでも、非同期エージェントセッションでプロンプトを投げてみるべき。最悪でも10分後にトークンの無駄だったと気づくだけ。
- 並列エージェント実行により、1人のエンジニアが同時に複数の場所で実装・リファクタリング・テスト・ドキュメント作成を行える。

---

### Chapter 2: Red/green TDD（レッド/グリーンTDD）

**「Red/green TDDを使え」** はコーディングエージェントからより良い結果を得るための簡潔かつ強力な指示。

- **テスト駆動開発（TDD）**: まずテストを書き、失敗を確認（Red）、実装してテストを通す（Green）。
- コーディングエージェントのリスク（動かないコード、不要なコード）を両方とも防ぐ。
- 回帰テストスイートが自然に構築され、プロジェクトの成長に伴う既存機能の破壊を防止。
- すべての優れたモデルは「red/green TDD」を、テスト先行開発の完全な手順のショートハンドとして理解する。

#### プロンプト例

> Build a Python function to extract headers from a markdown string. Use red/green TDD.

---

## ブログの新コンテンツ形態: Guide と Chapter

- **Guide** = チャプターの集合。書籍のような構造だが、完全な書籍ではない。
- **Chapter** = 基本的にはブログ記事だが、日付が目立たず、初回公開時点で凍結されず **継続的に更新される** ことを前提とした設計。
- 「エバーグリーン」なコンテンツをブログ上で公開するための解決策として位置づけ。
- 実装コードは [Guide](https://github.com/simonw/simonwillisonblog/blob/b9cd41a0ac4a232b2a6c90ca3fff9ae465263b02/blog/models.py#L262-L280)、[Chapter](https://github.com/simonw/simonwillisonblog/blob/b9cd41a0ac4a232b2a6c90ca3fff9ae465263b02/blog/models.py#L349-L405)、[ChapterChange](https://github.com/simonw/simonwillisonblog/blob/b9cd41a0ac4a232b2a6c90ca3fff9ae465263b02/blog/models.py#L408-L423) の各Djangoモデルおよび [関連ビュー](https://github.com/simonw/simonwillisonblog/blob/b9cd41a0ac4a232b2a6c90ca3fff9ae465263b02/blog/views.py#L775-L923) に公開されている。

---

## LLM生成ではない宣言

Willisonは **AI生成の文章を自分の名前で公開しない** という個人ポリシーを持っており、このプロジェクトでもその方針を貫く。LLMは校正やサンプルコードの作成などの補助タスクに使うが、読者が読む文章はすべて **本人が書いたもの**。

---

## 今後の展望

- 週1〜2チャプターのペースで追加予定。
- カバーすべき内容が多く、終了時期は未定。
- 現在のチャプター構成には「Testing and QA」セクションがあり、「First run the tests」と「Red/green TDD」が含まれる。
