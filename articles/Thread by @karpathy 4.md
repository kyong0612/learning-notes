---
title: "Thread by @karpathy"
source: "https://x.com/karpathy/status/2039805659525644595?s=12"
author:
  - "[[@karpathy]]"
published: 2026-04-02
created: 2026-04-04
description: "Andrej Karpathyが提唱するLLMを活用した個人ナレッジベース構築手法。ソースドキュメントをraw/ディレクトリに集約し、LLMがMarkdownベースのwikiに自動コンパイル。Obsidianをフロントエンドとして使用し、Q&A・レポート生成・データリンティングまでLLM主導で運用するワークフローを解説。"
tags:
  - "clippings"
  - "LLM"
  - "knowledge-management"
  - "Obsidian"
  - "personal-knowledge-base"
  - "AI-workflow"
---
**Andrej Karpathy** @karpathy [2026-04-02](https://x.com/karpathy/status/2039805659525644595)

LLM Knowledge Bases

Something I'm finding very useful recently: using LLMs to build personal knowledge bases for various topics of research interest. In this way, a large fraction of my recent token throughput is going less into manipulating code, and more into manipulating knowledge (stored as markdown and images). The latest LLMs are quite good at it. So:

Data ingest:

I index source documents (articles, papers, repos, datasets, images, etc.) into a raw/ directory, then I use an LLM to incrementally "compile" a wiki, which is just a collection of .md files in a directory structure. The wiki includes summaries of all the data in raw/, backlinks, and then it categorizes data into concepts, writes articles for them, and links them all. To convert web articles into .md files I like to use the Obsidian Web Clipper extension, and then I also use a hotkey to download all the related images to local so that my LLM can easily reference them.

IDE:

I use Obsidian as the IDE "frontend" where I can view the raw data, the the compiled wiki, and the derived visualizations. Important to note that the LLM writes and maintains all of the data of the wiki, I rarely touch it directly. I've played with a few Obsidian plugins to render and view data in other ways (e.g. Marp for slides).

Q&A:

Where things get interesting is that once your wiki is big enough (e.g. mine on some recent research is ~100 articles and ~400K words), you can ask your LLM agent all kinds of complex questions against the wiki, and it will go off, research the answers, etc. I thought I had to reach for fancy RAG, but the LLM has been pretty good about auto-maintaining index files and brief summaries of all the documents and it reads all the important related data fairly easily at this ~small scale.

Output:

Instead of getting answers in text/terminal, I like to have it render markdown files for me, or slide shows (Marp format), or matplotlib images, all of which I then view again in Obsidian. You can imagine many other visual output formats depending on the query. Often, I end up "filing" the outputs back into the wiki to enhance it for further queries. So my own explorations and queries always "add up" in the knowledge base.

Linting:

I've run some LLM "health checks" over the wiki to e.g. find inconsistent data, impute missing data (with web searchers), find interesting connections for new article candidates, etc., to incrementally clean up the wiki and enhance its overall data integrity. The LLMs are quite good at suggesting further questions to ask and look into.

Extra tools:

I find myself developing additional tools to process the data, e.g. I vibe coded a small and naive search engine over the wiki, which I both use directly (in a web ui), but more often I want to hand it off to an LLM via CLI as a tool for larger queries.

Further explorations:

As the repo grows, the natural desire is to also think about synthetic data generation + finetuning to have your LLM "know" the data in its weights instead of just context windows.

TLDR: raw data from a given number of sources is collected, then compiled by an LLM into a .md wiki, then operated on by various CLIs by the LLM to do Q&A and to incrementally enhance the wiki, and all of it viewable in Obsidian. You rarely ever write or edit the wiki manually, it's the domain of the LLM. I think there is room here for an incredible new product instead of a hacky collection of scripts.

---

**Andrej Karpathy** @karpathy [2026-04-02](https://x.com/karpathy/status/2039808711452246261)

Oh and in the natural extrapolation, you could imagine that every question to a frontier grade LLM spawns a team of LLMs to automate the whole thing: iteratively construct an entire ephemeral wiki, lint it, loop a few times, then write a full report. Way beyond a \`.decode()\`.

---

**Goss Gowtham 𝕏** @Goss\_Gowtham [2026-04-02](https://x.com/Goss_Gowtham/status/2039830480829456596)

Can you make a video of how you work with md files, agentic IDEs?

Your earlier explanations of using LLMs were really helpful.

---

**Andrej Karpathy** @karpathy [2026-04-02](https://x.com/karpathy/status/2039832291464417746)

I was just thinking the same thing

---

**jiahao** @\_\_endif [2026-04-02](https://x.com/__endif/status/2039810651120705569)

you are like Linus to Linux now, the meta vibe coder, I wonder how many projects will be created overnight because of your tweet

---

**Andrej Karpathy** @karpathy [2026-04-02](https://x.com/karpathy/status/2039816150062948769)

Haha I vibe code products with twitter :D

---

## 要約

### 概要

Andrej Karpathyが、LLMを使って個人的なナレッジベース（知識基盤）を構築・運用するワークフローを提案したスレッド。従来のコード操作中心のLLM活用から、**知識の操作・管理**へとユースケースが拡大していることを示している。全体のアーキテクチャは「ソースデータ収集 → LLMによるwikiコンパイル → Obsidianでの閲覧 → LLMによるQ&A・拡張」というパイプラインで構成される。

### ワークフローの詳細

#### 1. データ取り込み（Data Ingest）

- 論文、記事、リポジトリ、データセット、画像などのソースドキュメントを `raw/` ディレクトリにインデックス化
- LLMがこれらのデータを**インクリメンタルに「コンパイル」**し、Markdownファイルのwikiを生成
- wikiには以下が含まれる：
  - 全データの要約
  - バックリンク
  - コンセプトのカテゴリ分類
  - 各コンセプトの記事と相互リンク
- Web記事のMarkdown変換には **Obsidian Web Clipper拡張機能**を使用
- ホットキーで関連画像をローカルにダウンロードし、LLMが参照可能にする

#### 2. IDE / フロントエンド

- **Obsidian**をIDE的なフロントエンドとして使用
- 生データ、コンパイル済みwiki、派生ビジュアライゼーションの閲覧に利用
- **重要なポイント**：wikiの全データはLLMが書き・メンテナンスするものであり、人間が直接編集することは稀
- **Marpプラグイン**等でスライド形式のデータ表示も可能

#### 3. Q&A（質疑応答）

- wikiが十分な規模に達すると（例：約100記事、約40万語）、LLMエージェントに複雑な質問を投げかけることが可能
- **RAG（Retrieval-Augmented Generation）は不要**と判断 — LLMがインデックスファイルと簡潔な要約を自動管理し、この規模では関連データを容易に読み取れる
- LLMがwiki内を自律的にリサーチして回答を生成

#### 4. 出力（Output）

- テキスト/ターミナルでの回答ではなく、以下の形式でレンダリング：
  - **Markdownファイル**
  - **スライドショー**（Marp形式）
  - **matplotlibの画像**
- すべてObsidian上で閲覧可能
- 出力結果を**wikiにフィードバック**して知識基盤を強化 → 探索・クエリの結果が蓄積される仕組み

#### 5. リンティング（Linting）

- LLMによるwikiの「ヘルスチェック」を実行：
  - 矛盾するデータの検出
  - 欠損データの補完（Web検索を活用）
  - 新しい記事候補となる興味深い接続の発見
- wiki全体のデータ整合性をインクリメンタルに改善
- LLMが**さらに調査すべき質問を提案**する能力に優れる

#### 6. 追加ツール（Extra Tools）

- データ処理用の追加ツールを開発（例：wiki上のナイーブな検索エンジン）
- Web UIで直接使用するほか、**CLIツールとしてLLMに提供**し、大規模クエリに活用

#### 7. 今後の展望（Further Explorations）

- リポジトリが成長するにつれ、**合成データ生成 + ファインチューニング**への自然な欲求が生まれる
- コンテキストウィンドウだけでなく、LLMの**重み自体にデータを知識として埋め込む**方向性

### フォローアップ：エフェメラルwikiの構想

Karpathyは追加ツイートで、この手法の自然な発展形として以下を示唆：
- フロンティアLLMへの質問ごとに**LLMチームが自動的にスポーン**
- 一時的（エフェメラル）なwikiを反復的に構築・リンティング・ループ処理
- 最終的にフルレポートを出力
- 「単なる `.decode()` をはるかに超える」処理

### TLDR（まとめ）

```
ソースデータ収集 → LLMによるwikiコンパイル → CLIツールでQ&A → wikiのインクリメンタル強化
                                    ↕
                           Obsidianで全体を閲覧
```

- wikiは手動で編集せず、**LLMのドメイン**として運用
- 現状は「ハックなスクリプトの集合」だが、**革新的な新プロダクトの余地がある**と述べている

### 主要な知見

1. **LLMの活用がコード操作から知識操作にシフト**している
2. **小規模（~40万語）ではRAGは不要** — LLMの自動インデックス管理で十分
3. **人間はwikiを直接編集しない** — LLMが全データの作成・メンテナンスを担当
4. **出力のフィードバックループ**により、探索結果が累積的にナレッジベースを強化
5. 将来的には**ファインチューニングによる知識の内在化**が視野に入る
6. 質問→LLMチームによるエフェメラルwiki構築→レポート出力という**自律的リサーチパイプライン**の可能性