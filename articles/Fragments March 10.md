---
title: "Fragments: March 10"
source: "https://martinfowler.com/fragments/2026-03-10.html"
author:
  - "[[Martin Fowler]]"
published: 2026-03-10
created: 2026-03-12
description: "Martin Fowlerによる短いコメント集。企業のデータ違反への罰金の軽さ、SREとAIの関わり方、エージェント時代の「Apprentice Gap」問題、ralph loopの正しい運用、COBOL近代化の本質、LLMの本質を突く比喩、Epsteinネットワークから距離を置いた科学者たちについて。"
tags:
  - "clippings"
  - "AI"
  - "software-development"
  - "SRE"
  - "COBOL-modernization"
  - "tech-ethics"
  - "agentic-development"
---

## 要約

Martin Fowlerの「Fragments」シリーズ（2026年3月10日）。技術・倫理・AI開発に関する7つの短いコメントと引用で構成される。

---

### 1. 企業の法令違反に対する罰金の不十分さ

カリフォルニア州が高校生のデータを販売したテック企業GoFanに**110万ドルの罰金**を科した件について。[Brian Marick](https://mstdn.social/@marick/116173536550791837)の指摘に同意し、罰金額は必ず企業の前年度売上・利益・評価額と比較して報道すべきだと主張。企業の姿勢を「法令違反はコストとしてリスクが低く、差し引きでも利益が出る」から「致命的な打撃になりうる」へ転換させる必要性を訴えている。

### 2. SREとAI — Charity Majorsのスタンス

[Charity Majors](https://charitydotwtf.substack.com/p/my-hypothetical-srecon26-keynote)が2025年のSRECon基調講演で生成AIへの関与を促した後、2026年版ではさらに踏み込み「波に押しつぶされるのを待つのではなく、自ら波に向かって泳ぎ出せ」と提唱。特に**確証バイアスへの抵抗**を呼びかけている：

- **楽観主義者**は、実際の警鐘に目を向けることを強制すべき
- **悲観主義者**は、驚きや喜びを見つける方法を強制的に探すべき

### 3. 「Apprentice Gap」— エージェント時代のジュニア開発者育成

Kief Morrisの記事「[Humans and Agents in Software Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)」に対するLinkedInでの[Renaud Wilsius](https://www.linkedin.com/feed/update/urn:li:activity:7434980139425349632)のコメントが新しい用語を提示。キャリアの早い段階で人間を「on the loop（監視役）」に移行させすぎると、**深い「How」の理解**を持つ人材がいなくなるリスクがある。フライホイールを効果的に管理するには、かつて「in the loop（直接操作）」だった経験から得られる直感が不可欠。CTOの次の課題は「ハーネスエンジニアリング」だけでなく、エージェント時代のジュニア開発者のための**「Experience Engineering」**である。

### 4. Ralph Loopの正しい運用

「ralph loop」の考案者[Geoffrey Huntley自身が指摘](https://ghuntley.com/loop/)：エージェントを放任するのではなく、**ループを観察することが自身の学習と成長につながる**。実践的には、手動プロンプティングか、CTRL+Cで一時停止する自動化でループを運用する。[Thoughtworks Future of Software Development Retreat](https://martinfowler.com/bliki/FutureOfSoftwareDevelopment.html)では**認知的負債（cognitive debt）**が大きな懸念事項となっており、ralphing中のループ観察はエージェントの構築物を理解し、将来の効果的な指示につなげる手段となる。

### 5. COBOL近代化の本質 — 単なるコード変換ではない

Anthropicが[COBOLの近代化におけるAIの活用](https://claude.com/blog/how-ai-helps-break-cost-barrier-cobol-modernization)を発表。Thoughtworksの同僚は[1年以上前から経験を共有](https://martinfowler.com/articles/legacy-modernization-gen-ai.html)しており、AIの価値は認めつつも、[プロセスはLLMにCOBOLを投げるだけでは済まない](https://www.thoughtworks.com/insights/articles/claude-code-cobol-modernization-reality)と指摘：

- AIによるCOBOL→Java直訳は近代化を**構文的な作業**として扱う誤り
- 最良の場合でも、既存の設計制約・技術的負債・時代遅れの設計判断を忠実に再現するだけ
- 近代化の本質は、現在の市場要求・インフラパラダイム・ソフトウェアサプライチェーン・運用モデルにシステムを**整合させること**

### 6. LLMに関する鋭い比喩

[Anders Hoff](https://mas.to/@inconvergent/116193880010747322)（inconvergent）による一言：

> **「LLMがコンパイラであるというのは、スロットマシンがATMであるというのと同じだ」**

### 7. Epsteinネットワークから距離を置いた科学者たち

Jeffrey Epsteinのネットワークには多くの学者が関わっていたが、Fowlerは**距離を置いた人々**とその理由に注目。[Science誌のJeffrey Mervisの記事](https://www.science.org/content/article/why-three-scientists-said-no-epstein)では、Epsteinの誘いを断った3人の科学者のケースを紹介。悪い人物から距離を置くことは、少なくともストレスを大幅に軽減し、人生をより快適にするという教訓。