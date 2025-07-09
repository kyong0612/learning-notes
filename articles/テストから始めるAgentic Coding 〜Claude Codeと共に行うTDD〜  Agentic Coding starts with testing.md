---
title: "テストから始めるAgentic Coding 〜Claude Codeと共に行うTDD〜 / Agentic Coding starts with testing"
source: "https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing"
author:
  - "[[r-kagaya]]"
published: 2025-07-08
created: 2025-07-09
description: |
  2025/07/08(火)に開催されたClaude Code Meetup Japan #1の登壇資料です。本資料では、AIコーディング時代におけるテストの重要性、特にClaude Codeを用いたテスト駆動開発（TDD）の実践方法について解説しています。
tags:
  - "clippings"
  - "AI"
  - "Agentic Coding"
  - "TDD"
  - "Claude Code"
  - "Programming"
---

## 概要

本資料は、AIがコーディングの大部分を担う時代におけるテスト駆動開発（TDD）の重要性と実践方法について論じています。特に、Claude CodeのようなAIコーディングエージェントを活用し、テストを「AIへの指示書」「ガードレール」「評価関数」として機能させるアプローチを提案しています。

---

## 目次

1. **はじめに**
    * [自己紹介と本日のテーマ](#1-自己紹介と本日のテーマ)
2. **AIコーディングを取り巻く状況**
    * [開発環境の急激な変化](#2-開発環境の急激な変化)
    * [Claude Codeへの移行と開発者の見解](#3-claude-codeへの移行と開発者の見解)
3. **AI時代におけるテストの役割**
    * [変わらないテストの価値](#4-変わらないテストの価値)
    * [AIを導くガードレールとしてのテスト](#5-aiを導くガードレールとしてのテスト)
    * [テストはAIと共有可能な「認識の装置」](#6-テストはaiと共有可能な認識の装置)
    * [Kent Beck氏の思想：「テストはカリキュラム」](#7-kent-beck氏の思想テストはカリキュラム)
4. **Claude Codeを用いたTDDの実践**
    * [TDDの本質とAIへの応用](#8-tddの本質とaiへの応用)
    * [カスタムコマンドによるTDDサイクルの実践](#9-カスタムコマンドによるtddサイクルの実践)
    * [Swarm IntelligenceとPerfect Commit](#10-swarm-intelligenceとperfect-commit)
5. **今後の展望と試行錯誤**
    * [テストの高速化と砂時計型テスト戦略](#11-テストの高速化と砂時計型テスト戦略)
    * [評価関数としてのテストとReconciliation Loop](#12-評価関数としてのテストとreconciliation-loop)
6. **まとめ**

---

### 1. 自己紹介と本日のテーマ

発表者r.kagaya氏の自己紹介と、本日の発表が主に「テスト」を主題とし、Claude Codeを用いたTDDに焦点を当てる旨が説明されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_1.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#1)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_2.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#2)

### 2. 開発環境の急激な変化

近年の開発環境、特にAIコーディングツールの進化の速さが、育休からの復帰者が「異世界転生」と感じるほどのインパクトを持っていることが示されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_4.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#4)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_5.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#5)

### 3. Claude Codeへの移行と開発者の見解

多くの開発者がClaude Codeへ移行している現状と、その開発者自身が「もはやユニットテストを書いていない」「手書きコードが嫌になった」と語るほど、AIのコーディング能力が高いことが紹介されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_7.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#7)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_9.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#9)

### 4. 変わらないテストの価値

AIコーディングの時代においても、テストの価値は変わらず、むしろ増大していると述べられています。ただし、その捉え方や向き合い方は変化していく必要があります。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_12.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#12)

### 5. AIを導くガードレールとしてのテスト

AIエージェントは非常に高機能ですが、時として予測不可能な振る舞いをします。このAIを適切に制御し、協働するための「ガードレール」として、型システム(Types)、自動テスト(Tests)、リンター(Lints)が重要であると指摘されています。これらはAIの出力を収束させるための「ゴール」「制約」「評価関数」として機能します。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_14.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#14)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_17.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#17)

### 6. テストはAIと共有可能な「認識の装置」

包括的なテストカバレッジがあれば、AIが生成したコードのリスクを低減できます。テストによって動作が保証されていれば、多少違和感のあるコードでも受け入れ可能になり、リファクタリングも安心して任せられます。テストは、仕様を形式化し、AIと人間が共通認識を持つための重要な装置となります。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_18.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#18)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_21.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#21)

### 7. Kent Beck氏の思想：「テストはカリキュラム」

「開発者の役割は、コードを書く人から、良いコードとは何かをAIに教える人へと変わる。テストがそのカリキュラムなのだ」というKent Beck氏の言葉を引用し、テストがAIを教育するための教材として機能するという思想が紹介されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_24.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#24)

### 8. TDDの本質とAIへの応用

t-wada氏の言葉を借り、TDDを「不確実性の中に少しずつ確実性を持たせていく陣取り合戦」と表現。TDDは仕様や設計を明確化していくプロセスであり、その過程で生まれるテストがAIを導く道しるべとなります。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_28.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#28)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_29.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#29)

### 9. カスタムコマンドによるTDDサイクルの実践

Claude CodeでTDDを実践する具体的な方法として、BDD（ビヘイビア駆動開発）とRGBC（Red-Green-Blue-Commit）サイクルを模したカスタムコマンドを定義し、開発プロセスを自動化する試みが紹介されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_31.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#31)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_32.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#32)

### 10. Swarm IntelligenceとPerfect Commit

* **Swarm Intelligence**: 同じテストに対して複数の実装をAIに試させ、その中から最適なものを選択するという贅沢なアプローチ。
* **Perfect Commit**: Simon Willison氏が提唱する、実装コード・テスト・ドキュメントを一つのコミットにまとめる手法。AIの活用により、この理想的なコミットを低コストで実現可能になります。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_33.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#33)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_34.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#34)

### 11. テストの高速化と砂時計型テスト戦略

AIとの効率的な協働のためには、テストの高速化が不可欠です。Kent Beck氏はテストスイートを300ミリ秒で実行している例を挙げ、即時フィードバックの重要性を説いています。また、従来のテストピラミッドではなく、UnitテストとE2Eテストを手厚くする「砂時計型」のテスト戦略をAIの力で目指す試みが語られます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_37.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#37)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_38.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#38)

### 12. 評価関数としてのテストとReconciliation Loop

Googleの「AlphaEvolve」プロジェクトを例に、今後のAI開発では「良い状態」を定義する評価式が重要になると指摘。ソフトウェア開発における評価関数として、テストが機能する可能性が示唆されます。
AIによる開発を、宣言された理想状態と現在の状態の差分をなくすように調整し続ける「Reconciliation Loop」として捉え、その理想状態を定義するためにBDDや形式手法の活用が期待されます。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_44.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#44)
[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_46.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#46)

### まとめ

* テストはAIへの指示書、フィードバック、そして評価関数として機能する。
* AIを活用してテスト/TDDを実践するために、カスタムコマンドやPerfect Commitなどのアプローチが有効。
* 今後は、Hooksや形式手法の活用にも期待が寄せられる。

[![](https://files.speakerdeck.com/presentations/c0dbc0cbe08141858c151e5030e4a88e/slide_49.jpg)](https://speakerdeck.com/rkaga/agentic-coding-starts-with-testing#49)
