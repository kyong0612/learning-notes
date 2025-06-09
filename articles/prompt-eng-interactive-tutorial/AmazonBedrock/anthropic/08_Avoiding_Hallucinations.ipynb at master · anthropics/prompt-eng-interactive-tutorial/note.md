---
title: "Chapter 8: Avoiding Hallucinations"
source: "https://github.com/anthropics/prompt-eng-interactive-tutorial/blob/master/AmazonBedrock/anthropic/08_Avoiding_Hallucinations.ipynb"
author:
  - "anthropics"
published:
created: 2025-06-08
description: |
  このJupyter Notebookは、AIモデルが事実に基づかない情報を生成する「ハルシネーション」を回避するためのプロンプトエンジニアリング技術を解説します。具体的には、モデルに「知らない」と答える選択肢を与えたり、回答前に証拠を引用させたりする手法を、Pythonコードの例を交えて紹介しています。
tags:
  - "Prompt Engineering"
  - "Anthropic Claude"
  - "Hallucination"
  - "AI"
  - "LLM"
---

このJupyter Notebookは、Anthropicによるプロンプトエンジニアリングのインタラクティブチュートリアルの一部であり、AIモデル（特にClaude）が事実に基づかない情報を生成する「ハルシネーション」を回避するためのテクニックについて解説しています。

## 概要

このノートブックは主に3つのセクションで構成されています。

1. **Lesson (レッスン)**: ハルシネーションを減らすための具体的なプロンプティング技術を解説。
2. **Exercises (演習)**: 学んだ技術を実践するための演習問題。
3. **Example Playground (プレイグラウンド)**: レッスン中のプロンプトを自由に試すための環境。

---

## 1. Lesson: ハルシネーションを回避する技術

AIモデルは時にハルシネーションを起こし、事実ではない、あるいは不当な主張をすることがあります。このセクションでは、それを最小限に抑えるための2つの主要なテクニックを紹介します。

### テクニック1: モデルに「知らない」という選択肢を与える

モデルができるだけ役に立とうとして事実でないことを言ってしまうのを防ぐため、プロンプトに「確実に知っている場合のみ答えてください」といった制約を加えることが有効です。

**例: 不確実な質問**

* **悪いプロンプト**:

    ```python
    PROMPT = "Who is the heaviest hippo of all time?"
    ```

    このプロンプトに対し、モデルは架空の答えを生成してしまう可能性があります。

* **良いプロンプト**:

    ```python
    PROMPT = "Who is the heaviest hippo of all time? Only answer if you know the answer with certainty."
    ```

    こうすることで、モデルは知らないことに対して正直に「わからない」と答えるようになります。

### テクニック2: 回答前に証拠を探させる

長い文書から情報を抽出する際、モデルが関連性の低い情報（ディストラクター）に惑わされることがあります。これを防ぐには、回答を生成する前に、まず文書内から関連する引用を抜き出すように指示します。

**例: 長文からの情報抽出**

* **悪いプロンプト**:
    ユーザーの質問と長い文書を渡し、直接回答を求めます。モデルは文書内の似ているが異なる情報に惑わされ、誤った回答をする可能性があります。

* **良いプロンプト (Scratchpadテクニック)**:
    `scratchpad`タグなどを使い、思考プロセスを段階的に踏ませます。
    1. まず、文書から最も関連性の高い引用を抽出する。
    2. 次に、その引用が質問に答えるのに十分か検討する。
    3. 最後に、検討結果に基づいて最終的な回答を生成する。

    ```python
    PROMPT = """<question>What was Matterport's subscriber base on the precise date of May 31, 2020?</question>
    Please read the below document. Then, in <scratchpad> tags, pull the most relevant quote from the document and consider whether it answers the user's question or whether it lacks sufficient detail. Then write a brief numerical answer in <answer> tags.
    
    <document>
    ... (長文のドキュメント) ...
    </document>"""
    ```

    この手法により、モデルは文書に正確な情報がないことを認識し、ハルシネーションを避けることができます。

### ボーナスレッスン: `temperature`の調整

APIの`temperature`パラメータを低く設定する（例: `0.0`）ことでも、回答のランダム性が減り、ハルシネーションを抑制する効果が期待できます。

---

## 2. Exercises: 演習問題

このセクションでは、学んだテクニックを使って具体的なハルシネーションの問題を解決する演習が2つ提供されています。

1. **Beyoncé Hallucination**: Beyoncéの8枚目のスタジオアルバムのリリース年を尋ねる質問に対し、「知らない」と正直に答えさせるようにプロンプトを修正する問題。
2. **Prospectus Hallucination**: 企業のSEC提出書類から特定の期間における加入者の増加量を正確に引用させて回答させる問題。

---

## 3. Example Playground: プレイグラウンド

レッスンで使用されたすべてのプロンプト例が再掲されており、ユーザーが自由にプロンプトを編集して、モデルの応答がどのように変化するかを試すことができるインタラクティブな環境です。
