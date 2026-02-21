---
title: "Fragments: February 18"
source: "https://martinfowler.com/fragments/2026-02-18.html"
author:
  - "[[Martin Fowler]]"
published: 2026-02-18
created: 2026-02-21
description: "Martin FowlerがThoughtworks Future of Software Development Retreatでの議論を中心に、AIがソフトウェア開発に与える影響について多角的な考察をまとめたフラグメント集。監督的エンジニアリング、TDDとAIの関係、コード健全性、セキュリティ、専門スキルの変化などを論じている。"
tags:
  - "clippings"
  - "ai"
  - "software-development"
  - "tdd"
  - "thoughtworks"
  - "agile"
---

## 概要

Martin Fowlerが2026年2月18日に公開したフラグメント集。[Thoughtworks Future of Software Development Retreat](https://martinfowler.com/bliki/FutureOfSoftwareDevelopment.html)での議論を軸に、AI時代のソフトウェア開発における課題・機会・不確実性について、複数の視点から短い考察をまとめている。

---

## Thoughtworks Future of Software Development Retreat

### イベント概要と動画

Rachel LaycockとMartin Fowlerが、イベント後の[短い動画](https://www.youtube.com/watch?v=VHkuVlwYhNk)で「このイベントはAgile Manifestoのような新しいマニフェストを作るためのものか」という質問に答えている。回答は端的に「No」。

### 17ページの詳細サマリー

Thoughtworksのメンバーが[イベントの詳細サマリーPDF](https://www.thoughtworks.com/content/dam/thoughtworks/documents/report/tw_future%20_of_software_development_retreat_%20key_takeaways.pdf)（17ページ）をまとめている。議論は以下の8つの主要テーマに分類される：

- **"Where does the rigor go?"** — 厳密性の行方
- **"The middle loop: a new category of work"** — 新たな作業カテゴリとしてのミドルループ
- **"Technical foundations: languages, semantics and operating systems"** — 技術的基盤
- **"The human side: roles, skills and experience"** — 人間側：役割・スキル・経験

**主要な発見：** 人間だけのソフトウェア開発のために構築されたプラクティス・ツール・組織構造が、AI支援の作業の重みで予測可能な方法で壊れつつある。代替は形成されつつあるが、まだ成熟していない。

**業界全体で議論すべきアイデア：**
- **監督的エンジニアリングのミドルループ（Supervisory Engineering Middle Loop）**
- **リスク階層化（Risk Tiering）** を新しいコアエンジニアリングの規律として
- **TDDが最も強力なプロンプトエンジニアリングの形態** である
- **エージェント体験（Agent Experience）** としての開発者体験への投資の再フレーミング

### Annie Vellaの所感

Annie Vellaは[自身のブログ](https://annievella.com/posts/finding-comfort-in-the-uncertainty/)でイベントの感想を投稿。業界の最も鋭い頭脳たちが集まったにもかかわらず、**誰もすべてを理解しているわけではなかった**。確実性よりも不確実性が多い状況だが、「どのような質問をすべきかについての共通理解」を得たことが最も価値のある成果かもしれないと述べている。

### Rachel Laycockのインタビュー（The New Stack）

Rachel Laycockは[The New Stack](https://thenewstack.io/ai-velocity-debt-accelerator/)でのインタビューで以下を指摘：

> AIは大きな破壊者と呼ばれるが、実際には**すでにあるものを加速させるアクセラレーター**にすぎない。

- 2025年のDORAレポートは、AIの主要な役割を**増幅器（Amplifier）**と位置づけている
- AIはコード記述の速度に影響を与えるが、**コード記述はそもそもボトルネックではなかった**
- 従来のソフトウェアデリバリーのベストプラクティスが整っていない場合、この**速度倍増器は負債加速器**になる

---

## AIとソフトウェア開発の論点

### 専門スキルの変化

LLMは専門スキルを侵食しつつある。フロントエンドやバックエンドの専門開発者の需要は減少し、LLMを駆使するスキルがプラットフォーム利用の詳細知識より重要になる可能性がある。

**未解決の問い：**
- [Expert Generalists](https://martinfowler.com/articles/expert-generalist.html)の役割が認識されるようになるか？
- LLMがサイロを排除するのではなく、サイロの周りにコードを書くことになるのか？
- LLMが多くのサイロのコードを取り込んで境界を超えた作業を理解できるようになるか？

### トークンコストの不確実性

LLMは補助金がなくなった後も人間より安いのか？現時点ではトークンの真のコストはほとんど見えておらず、数年後のコストも不明。トークンが非常に安くなる可能性も、慎重に使う必要があるほど高くなる可能性もある。

### 仕様書とウォーターフォール回帰の懸念

仕様書の台頭により[ウォーターフォール型開発](https://martinfowler.com/bliki/WaterfallProcess.html)に戻るリスクはあるか？Fowlerの見解は、**LLMは小さな機能スライスを素早く構築・リリースする価値を変えない**。むしろLLMはそのサイクルの頻度を上げ、各リリースでより多くのことを行うことを約束するものである。

### セキュリティ

- セキュリティのセッションは参加者が少なかった
- ある大企業の従業員は、AIテクノロジーに対して**意図的にリーディングエッジの1/4遅れを保っている**と発言
- セキュリティは退屈なため、人々は自然に「まず動かす→信頼性を高める→安全にする」の順で行動する
- **プラットフォーム思考が不可欠** — プラットフォームチームが高速かつ安全なパス（「弾丸列車」）を作る必要がある
- AIベンダーは安全性を十分に真剣に取り組んでいるのか？他のエンジニアリング分野のように安全マージンを設計に組み込んでいるのか？

### Open Spaceフォーマット

Fowlerはイベントのメタ的な側面を高く評価。Open Space形式が幅広くかつ深い議論を促進した。参加者からは「深く敬意あるダイアログ」への感謝や、「ここにいる間、女性であることを意識する必要がなく、参加者の一人でいられた」という声があった。

---

## 外部の声

### Stephen O'Grady — ソフトウェア業界の「包囲」

Stephen O'Gradyは、多くの専門家がAIによって[包囲されている](https://redmonk.com/sogrady/2026/02/10/besieged/)と感じていると分析。一方で：

- AIツールはソフトウェア開発への障壁を劇的に下げる**強力なアクセラレーター**
- Grady BoochですらClaudeの能力に「gobsmacked（度肝を抜かれた）」と発言
- Boochの開発者へのアドバイス：**「落ち着いて」「深呼吸して」**
- AIは自動織機、蒸気機関、原子炉と同じく**もう消えることはない**。その利益を最大化しつつコストを軽減する方法を決めるだけ

### Adam Tornhill — コード健全性とAIエージェント開発

Adam Tornhillの研究「**Code for Machines, Not Just Humans**」の知見：

- 「AI親和性」を、AI生成のリファクタリングが振る舞いを保持し保守性を改善する確率と定義
- 6つの異なるLLMを使って5,000の実プログラムをリファクタリングする大規模研究
- **健全なコードベースでLLMは一貫してより良いパフォーマンス**を発揮
- 健全性の低いコードでは**欠陥リスクが30%高い**
- この研究の健全性が低いコードは、多くのレガシーコードほど酷くはなかった
- レガシーコードでのAIエラー率は？パターンから見て**関係はほぼ確実に非線形**

### TDDとLLMの価値

LLMコーディングエージェントのヘビーユーザーからの声：

> 「TDD（[テスト駆動開発](https://martinfowler.com/bliki/TestDrivenDevelopment.html)）の提唱に感謝します。TDDはLLMを効果的に使うために不可欠でした」

Fowlerは確証バイアスを懸念しつつも、LLM利用の最前線にいる人々から、明確なテストとTDDサイクルの価値について繰り返し聞いていると述べている。TDDはLLMを効果的に駆動するための重要なツールである。

---

## 重要な結論

1. **AIは既存の能力を増幅する** — 優れたプラクティスがなければ、AIは技術的負債も加速させる
2. **TDDがAI時代のソフトウェア開発で最も強力なツールの一つ** — プロンプトエンジニアリングの最強形態
3. **コードの健全性がAI活用の成否を分ける** — 健全なコードベースでLLMのパフォーマンスが大幅に向上
4. **不確実性が支配的** — 業界の最先端でも誰も答えを持っておらず、共通の問いを定義することが最大の成果
5. **セキュリティとプラットフォーム思考の重要性** — AI活用の安全なパスをプラットフォームチームが整備する必要がある
