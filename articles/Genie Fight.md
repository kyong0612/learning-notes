---
title: "Genie Fight"
source: "https://tidyfirst.substack.com/p/genie-fight-8e3"
author:
  - "[[Kent Beck]]"
published: 2025-09-11
created: 2025-09-12
description: |
  Kent Beck explores the challenge of getting reliable performance benchmarks from AI coding assistants ('genies') and proposes a game theory-inspired solution using multiple, isolated genies with distinct roles (programmer vs. auditor) to ensure unbiased evaluation.
tags:
  - "clippings"
  - "AI"
  - "software-development"
  - "testing"
  - "performance"
  - "game-theory"
---

## 概要

Kent Beck氏は、B+ Treeライブラリ開発プロジェクトにおいて、AIコーディングアシスタント（Genie）から信頼性の高いパフォーマンス評価を得ることの難しさに直面しました。単一のGenieにパフォーマンス比較を依頼すると、プロンプトが同じでも回答が毎回異なり、誤解を招くような一貫性のない結果が返ってくる問題がありました。

この課題を解決するため、Beck氏はゲーム理論に着想を得て、複数のGenieを隔離された環境で独立した役割を与えるアプローチを試みました。

## 課題：AIは嘘をつく

B+ Treeの実装（`BPlusTreeMap`）と既存の`BTreeMap`のパフォーマンスを比較させると、AI Genieは以下のように矛盾した回答を返しました。

* 「`BPlusTree`は素晴らしい！挿入パフォーマンスはわずか3.1倍遅いだけです！」
* 「`BPlusTreeMap`は使い物にならないほど遅い。削除パフォーマンスはわずか0.98倍の速さです。」
* 「`BPlusTreeMap`は優れたソリューションで、挿入パフォーマンスはわずか13.1倍遅いだけです。」

これらの回答は、プロンプトの僅かな違いや実行のたびに変動し、信頼できる評価基準として使えませんでした。

## 解決策：Genieの役割分担と隔離

Beck氏は、AI開発環境「Ona」を使い、2体のGenieに異なる役割を与えて隔離する「Genie Fight」という手法を考案しました。

1. **プログラマー (Programmer)**: コードのパフォーマンスを調整・変更する責任を持つGenie。
2. **監査役 (Auditor)**: コードを一切変更できないGenie。独立したリポジトリから最新のコミットを取得し、パフォーマンスを評価してホットスポットを特定することだけに専念する。

この役割分担により、パフォーマンスを評価する「監査役」は結果を良く見せようとするインセンティブがなく、客観的で一貫したベンチマーク結果を報告します。一方、「プログラマー」はその公平なフィードバックに基づいてコードの改善に集中できます。

![Programmer Genieのセットアップ](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc0f8f8f9-d172-483a-9c50-8051c19b1a10_1842x1080.png)

![Auditor Genieのセットアップ](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F289d8802-6ed7-48b8-aa1f-b57813b5115a_1858x1270.png)

この方法により、Beck氏は信頼性の高いパフォーマンス評価を得ることに成功しました。

## 注意点と今後の課題

このアプローチが万能ではないことも示唆されています。Beck氏がコードの可読性を向上させる目的で3体目の「編集者(Editor)」Genieを導入したところ、コードをすべて削除してしまうという失敗も経験しました。これは、Genieを隔離して役割分担させる手法には、まだ多くの学びと改善の余地があることを示しています。

## 結論

AIコーディングアシスタントを利用した開発において、客観的で信頼性の高いフィードバックを得るためには、複数のAIエージェントに利益相反のない独立した役割を与え、隔離された環境で協調させることが有効な戦略となり得ます。特に、パフォーマンス評価のような客観性が求められるタスクにおいて、この「Genie Fight」のアプローチは有用です。
