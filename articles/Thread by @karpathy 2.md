---
title: "Thread by @karpathy"
source: "https://x.com/karpathy/status/2026731645169185220?s=12"
author:
  - "[[@karpathy]]"
published: 2026-02-26
created: 2026-02-27
description: "Andrej Karpathyが、2025年12月以降AIコーディングエージェントが実用レベルに達し、プログラミングが根本的に変わったと主張。英語でタスクを指示しエージェントを管理する「agentic engineering」という新しい開発スタイルを提唱した。"
tags:
  - "clippings"
  - "AI"
  - "agentic-engineering"
  - "coding-agents"
  - "software-development"
  - "LLM"
---

## 概要

OpenAI共同創設者でありTesla Autopilotの立ち上げエンジニアである **Andrej Karpathy** が、2026年2月26日にXで投稿したスレッド。2025年12月を境にAIコーディングエージェントが実用的になり、プログラミングという行為そのものが根本的に変貌したと論じている。1年前に自身が生み出した「vibe coding」の概念を進化させ、**「agentic engineering（エージェンティック・エンジニアリング）」** という新たな用語を提唱した。

---

## 1. 12月を境にした劇的な変化

- AIによるプログラミングの変化は漸進的なものではなく、**2025年12月に不連続な飛躍**があった
- それ以前はコーディングエージェントは「基本的に機能しなかった」が、12月以降は「基本的に機能する」ようになった
- モデルの品質・長期的な一貫性・粘り強さが大幅に向上し、大規模で長期のタスクをこなせるようになった
- これは従来のプログラミングワークフローに対して**極めて破壊的（disruptive）**である

> 背景: Karpathyは2026年1月時点で、わずか数週間のうちに手動コーディング80%/AI 20%から、**AI 80%/手動20%**へと完全に逆転したと報告している。「約20年のプログラミング歴で最大のワークフロー変化」と述べた。

---

## 2. 具体的な事例：自宅カメラの映像分析ダッシュボード

週末に自宅カメラのローカルビデオ分析ダッシュボードを構築した際の手順：

1. DGX SparkのローカルIPとユーザー名/パスワードを提供
2. **エージェントへの指示内容（すべて英語の自然言語）：**
   - SSHキーの設定
   - vLLMのセットアップ
   - Qwen3-VLのダウンロードとベンチマーク
   - 動画推論用サーバーエンドポイントの構築
   - 基本的なWeb UIダッシュボードの作成
   - すべてのテスト実行
   - systemdによるサービス設定
   - メモリノートの記録とMarkdownレポートの作成

**結果:** エージェントは約30分間自律的に動作し、複数の問題に遭遇しながらもオンラインで解決策を調べ、一つずつ解決し、コード作成・テスト・デバッグ・サービス設定をすべて完了した。Karpathyは一切手を加えなかった。

> **3ヶ月前なら週末プロジェクトだったものが、今では30分放置するだけで完了する。**

---

## 3. プログラミングの本質的変容

- コンピュータの発明以来続いてきた「エディタにコードを手入力する」時代は**終わった**
- 新しいスタイル：
  - AIエージェントを起動する
  - **英語で**タスクを与える
  - 複数のエージェントの作業を**並列に管理・レビュー**する
- **最大の成果**は、抽象化のレイヤーを上昇し続けること
  - 適切なツール・メモリ・指示を持つ長期実行オーケストレーターの構築
  - 複数の並列Codeインスタンスを生産的に管理する
- トップレベルの「agentic engineering」で達成可能なレバレッジは現在非常に高い

---

## 4. 現時点の限界と注意点

| 必要なもの | 説明 |
|---|---|
| **ハイレベルな方向性** | 全体の設計や目標の設定は人間が行う |
| **判断力** | エージェントの出力の良し悪しを見極める |
| **テイスト（審美眼）** | コードの品質やUXの水準を決める |
| **監督** | エージェントの作業を継続的にモニタリング |
| **反復とヒント** | 適宜修正指示やアイデアを提供する |

- **得意なシナリオ**: タスクが明確に定義され、機能の検証・テストが可能な場合
- **重要なスキル**: タスクを適切に分解し、エージェントに任せる部分と人間が補助する部分を見極める直感を養うこと
- LLMは微妙な概念的エラーを犯すことがある（誤った前提、過度な複雑化、トレードオフの提示不足など）

---

## 5. 結論

> **これはソフトウェアにおける「平常運転」の時代ではない。**

Karpathyの主張の核心は、AIコーディングエージェントの能力が臨界点を超え、ソフトウェア開発の本質が変わりつつあるということである。エンジニアの役割は「コードを書く人」から「AIエージェントを指揮・管理するオーケストレーター」へと移行しており、この変化に対応できるかどうかが今後の生産性を大きく左右する。

---

## 関連する文脈

- **Vibe Coding → Agentic Engineering**: Karpathyは2025年2月に「vibe coding」という用語を生み出し（Collins辞典の2025年Word of the Year）、1年後にその進化形として「agentic engineering」を提唱。「エージェントの活用によるレバレッジを確保しつつ、ソフトウェア品質に妥協しない」アプローチと定義している。
- **業界への影響**: AI コーディングツール市場は急拡大中（Cursor $29.3B、Lovable $6.6B、Replit ~$9B の評価額）
- **開発者コミュニティの反応**: 効率化を歓迎する声と、コードを書く職人としてのアイデンティティが揺らぐことへの不安が混在している

---

## 原文

**Andrej Karpathy** @karpathy [2026-02-25](https://x.com/karpathy/status/2026731645169185220)

It is hard to communicate how much programming has changed due to AI in the last 2 months: not gradually and over time in the "progress as usual" way, but specifically this last December. There are a number of asterisks but imo coding agents basically didn't work before December and basically work since - the models have significantly higher quality, long-term coherence and tenacity and they can power through large and long tasks, well past enough that it is extremely disruptive to the default programming workflow.

Just to give an example, over the weekend I was building a local video analysis dashboard for the cameras of my home so I wrote: "Here is the local IP and username/password of my DGX Spark. Log in, set up ssh keys, set up vLLM, download and bench Qwen3-VL, set up a server endpoint to inference videos, a basic web ui dashboard, test everything, set it up with systemd, record memory notes for yourself and write up a markdown report for me". The agent went off for ~30 minutes, ran into multiple issues, researched solutions online, resolved them one by one, wrote the code, tested it, debugged it, set up the services, and came back with the report and it was just done. I didn't touch anything. All of this could easily have been a weekend project just 3 months ago but today it's something you kick off and forget about for 30 minutes.

As a result, programming is becoming unrecognizable. You're not typing computer code into an editor like the way things were since computers were invented, that era is over. You're spinning up AI agents, giving them tasks \*in English\* and managing and reviewing their work in parallel. The biggest prize is in figuring out how you can keep ascending the layers of abstraction to set up long-running orchestrator Claws with all of the right tools, memory and instructions that productively manage multiple parallel Code instances for you. The leverage achievable via top tier "agentic engineering" feels very high right now.

It's not perfect, it needs high-level direction, judgement, taste, oversight, iteration and hints and ideas. It works a lot better in some scenarios than others (e.g. especially for tasks that are well-specified and where you can verify/test functionality). The key is to build intuition to decompose the task just right to hand off the parts that work and help out around the edges. But imo, this is nowhere near "business as usual" time in software.
