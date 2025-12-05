---
title: "Claude CodeとNano Banana Proで議事録から提案書スライドを自動生成してみた | DevelopersIO"
source: "https://dev.classmethod.jp/articles/claude-code-nano-banana-pro-proposal-slide-generation/"
author:
  - "[[とーち]]"
published: 2025-12-03
created: 2025-12-05
description: |
  Claude CodeのカスタムスラッシュコマンドとAgent Skill機能を活用し、Nano Banana Pro（Gemini 3 Pro Image）のAPIを連携させることで、MTG議事録から編集可能なMarp形式の提案書スライドを自動生成するワークフローを解説。Mermaid記法を画像生成プロンプトに直接渡すことで品質を安定させる手法が最大の発見。
tags:
  - "clippings"
  - "Anthropic"
  - "Claude-Code"
  - "Gemini"
  - "AI駆動開発"
  - "Marp"
  - "Vertex-AI"
  - "自動化"
---

## 概要

本記事は「AI駆動開発 Advent Calendar 2025」3日目の記事で、Claude CodeとNano Banana Pro（Gemini 3 Pro Image）を組み合わせて、**MTG議事録から提案書スライドを自動生成**する仕組みを紹介している。

## 背景：NotebookLMのスライド生成の課題

### NotebookLMでのスライド作成

- Nano Banana ProはNotebookLMに組み込まれており、「スライド作成」ボタンで高品質なスライドを簡単に作成可能
- AWSアップデートのサマリメモからスライドを即座に生成できる

![NotebookLMで生成されたスライドの例](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/WVr4NaVapFf3.png)

### 方法1の問題点：Marp形式テキストをNotebookLMに渡す

- NotebookLMにMarp形式のテキストを与え、その内容に沿ったスライド作成を依頼
- **問題**: 2025/12/3時点では期待通りの結果が得られない
  - マークダウン書式（`#`や`##`）を文字列としてそのまま描画
  - 44ページ指定でも20ページしか生成されない

![うまくいかなかった例](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/9XqbL2vXIx6p.png)

### 方法1のもう一つの欠点

- 生成に約10分かかる
- 一発出しのため部分修正が困難
- 修正すると他の良かった部分が改悪される可能性

## 解決策：Claude Code + Nano Banana Pro API

### コンセプト

従来の方法で作成した**Marp形式のマークダウン**に、**Nano Banana Proで生成した画像を追加**する

### 全体構成

1. **入力**: MTG議事録
2. **Claude Code**: Marp形式スライドを生成
3. **Agent Skill（gemini-image）**: Vertex AI経由でNano Banana Pro APIを呼び出し、画像を生成
4. **出力**: 画像付きの完成した提案書スライド

## 実装詳細

### ファイル構成

```
marp-proposal-creation/
├── commands
│   └── marp-tech-proposal.md       # カスタムスラッシュコマンド
├── rules
│   ├── image-prompt-guidelines.md  # 画像生成プロンプト指針
│   └── proposal-structure-rules.md # 提案書構成ルール
└── templates
    ├── sample-slide.md             # Marpテーマサンプル
    └── tech-proposal-slide.md      # 技術提案書テンプレート
```

### カスタムスラッシュコマンドの構成

**background_information**: ミッションと成功基準を定義

**実行ステップ**:

- **ステップ0**: ルールとテンプレートの読み込み
- **ステップ1**: 入力ファイルの読み込みと分析
  - 顧客名、課題、要件、制約、決定事項を抽出
  - 不明な点があればユーザーに確認
- **ステップ2**: 可変セクションの設計
- **ステップ3**: Marp形式スライド生成
  - **重要**: `content-image-right`クラスのスライドには必ず図を入れる
  - 図の記述は**Mermaidコードブロック**を原則とする
  - Mermaidで表現困難な場合のみIMAGEコメント使用
- **ステップ4**: 画像生成と置換（Skill呼び出し）

### 💡 最大の発見：Mermaid記法をプロンプトに直接渡す

スケジュール図の画像生成で品質が安定しなかった問題を、**Mermaid記法をそのままプロンプトに含める**ことで解決。

**プロンプト例**:

```
以下のMermaidガントチャートコードをビジネス向けスケジュール表の画像にしてください。

gantt
    title Project Schedule
    dateFormat YYYY-MM
    section Requirements & Design
    Requirements Definition  :a1, 2030-03, 1M
    Basic Design            :a2, 2030-04, 1M
    section Infrastructure
    AWS Environment Setup   :b1, 2030-04, 2M
...

要件:
- ヘッダーに月名を表示
- タスクは色分けされた水平バー
- セクション名は左側に太字表示
- クリーンなビジネステーブルスタイル、白背景
```

### Agent Skill（gemini-image）

**SKILL.md**: ツールの説明書

- プロンプトの内容・品質は呼び出し側が責任を持つ
- スタイルオプション: `diagram`, `icon`, `illustration`, `photo`

**gemini_image.py**: Vertex AI経由でGemini APIを呼び出すスクリプト

```python
# Vertex AI APIエンドポイントを使用
client = genai.Client(
    vertexai=True,
    project=project,
    location=location
)

# Nano Banana Proで画像生成
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",  # Nano Banana Pro
    contents=full_prompt,
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"]
    )
)
```

### ルールファイル

**proposal-structure-rules.md**:

- **可変セクション**: 表紙、はじめに、ご提案内容、スケジュールなど（自由に変更可）
- **固定セクション**: `## その他`以降は変更禁止
- classmethodテーマ特有のMarp記法（`_class`指定、ページネーション制御など）

**image-prompt-guidelines.md**:

- Mermaidコードを直接プロンプトに含める方式を推奨
- 対応する図の種類: `gantt`, `flowchart`, `graph TD`, `sequenceDiagram`

## 生成結果

カスタムスラッシュコマンド一発で、以下のような高品質な提案書が生成される：

![生成された提案書1](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/mYdSHzGBVetC.png)
![生成された提案書2](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/KVIeFVD9ETup.png)
![生成された提案書3](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/uUnPR0yUIQdi.png)
![生成された提案書4](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/m0aiYQuvbuC6.png)
![生成された提案書5](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/0kcMtOSJtkQa.png)
![生成された提案書6](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/iTIHhiG9pEjv.png)
![生成された提案書7](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/Hd92BU2EzSUB.png)
![生成された提案書8](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/gyxuJ0djiGcl.png)
![生成された提案書9](https://devio2024-2-media.developers.io/upload/6J1Kx9HsuVLaf9qI3wWU3k/2025-12-03/LPJaMMR3slIF.png)

## まとめ

### ポイント

| 課題 | 解決策 |
|------|--------|
| NotebookLMのスライド生成は修正が大変 | Marp形式マークダウンで編集容易性を確保 |
| 生成に時間がかかり部分修正不可 | 必要な箇所だけNano Banana Proで画像生成 |
| 画像生成の品質が不安定 | **Mermaid記法をプロンプトに直接渡す** |

### 今後の展望

- 技術登壇資料やドキュメント作成など、様々な場面で応用可能
- Nano Banana Proの画像生成能力は日々進化中

## 参考リンク

- [クラスメソッドMarpテーマ](https://dev.classmethod.jp/articles/classmethod-marp-theme/)
- [cc-sdd（カスタムスラッシュコマンド参考）](https://github.com/gotalab/cc-sdd/tree/main)
- [Google Workspace Nano Banana Pro発表](https://workspaceupdates.googleblog.com/2025/11/workspace-nano-banana-pro.html)
- [Vertex AI Gemini API移行ガイド](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/migrate/migrate-google-ai?hl=ja)
