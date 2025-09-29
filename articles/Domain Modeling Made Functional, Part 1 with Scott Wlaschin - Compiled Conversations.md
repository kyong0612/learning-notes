---
title: "Domain Modeling Made Functional, Part 1 with Scott Wlaschin - Compiled Conversations"
source: "https://compiledconversations.com/8/"
author:
  - "Edd Mann"
published: 2025-09-17
created: 2025-09-29
description: |
  Scott Wlaschin をゲストに迎え、ドメイン駆動設計と関数型プログラミングがどのように協調するかを掘り下げる。エピソード前半では、DDD を単なる技法ではなくコミュニケーション中心の実践として捉え、戦略と戦術の違い、サブドメインの分類、境界づけ、共通言語の重要性を整理する。
tags:
  - "domain-driven-design"
  - "functional-programming"
  - "software-architecture"
  - "team-communication"
  - "fsharp"
---

![Compiled Conversations cover art](https://compiledconversations.com/album-art.jpg)

## エピソード概要

- Scott Wlaschin を迎えた 81 分のポッドキャスト。DDD を「技術的メソッド」ではなく「共通理解の構築」と捉える視点を提示し、なぜコミュニケーションがソフトウェアの成功に不可欠かを議論する。
- 収録日は 2025-09-17。Part 2 では関数型プログラミングと DDD の実装技法を扱うことが予告されている。

## Scott の背景と学び

- Smalltalk 時代からのキャリアと、関数型プログラミングに傾倒するまでの経緯を紹介。DDD と関数型の親和性を強調。
- スキンケア企業での経験では、ドメイン専門家との継続的な対話が最も価値の高い成果を生んだと振り返る。

## DDD の戦略と戦術

- 戦略 DDD と戦術 DDD の違いを整理し、多くのチームが戦術面（エンティティ、リポジトリなど）に偏りがちである問題を指摘。
- ドメイン/サブドメインは既にビジネス内部に存在しており、分類（コア、サポート、ジェネリック）によって投資配分を誤らないことが重要。

## 境界と共通言語

- 境界づけられたコンテキストにより、コード構造とチーム体制の両面で整合した責務分担が可能になる。
- 共通言語（Ubiquitous Language）をチーム全体に広げることで「ガーベジイン・ガーベジアウト」を防ぎ、入力品質を高める。
- 共有されたメンタルモデルが欠如すると、同じ言葉でも異なる理解が生まれ、バグや誤コミュニケーションを招く。

## 発見・分析テクニック

- Event Storming や Domain Storytelling のようなワークショップ手法が、要件探索と関係者間の知識共有を加速すると解説。
- データベース駆動・クラス駆動の先入観から離れ、ビジネスイベントやユーザーニーズからモデルを構築するアプローチを推奨。

## 組織設計と制約

- Conway の法則および逆 Conway マニューバを取り上げ、組織構造とソフトウェア設計が相互に影響し合う現象を説明。
- Dan North の "Accelerating Agile" や Chesterton's Fence に触れ、既存プロセスの背景を理解した上で改善策を検討すべきと強調。

## 主要リンク

- Scott の個人サイト、SNS アカウント、著書『Domain Modeling Made Functional』に加え、EventStorming、Domain Storytelling、Conway's Law、Accelerating Agile への参照リンクが提供されている。

## 重要な示唆

- ソフトウェアの失敗は技術要因よりもコミュニケーション不足によるものが多いと指摘し、ドメイン専門家との対話が最優先であると結論づける。
- 入力の質を高め、共通言語を育てることが、堅牢なドメインモデルと成功するプロダクトの基盤になると締めくくる。
