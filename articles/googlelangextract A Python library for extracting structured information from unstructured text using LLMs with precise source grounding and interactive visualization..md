---
title: "google/langextract: A Python library for extracting structured information from unstructured text using LLMs with precise source grounding and interactive visualization."
source: "https://github.com/google/langextract"
author:
  - "[[aksg87]]"
  - "Akshay Goel (Google LLC)"
published: 2025-11-27
created: 2026-02-11
description: "LangExtractは、LLMを使用して非構造化テキストからユーザー定義の指示に基づいて構造化情報を抽出するPythonライブラリ。抽出結果をソーステキストの正確な位置にマッピングするソースグラウンディング機能と、インタラクティブなHTML可視化機能を備える。Gemini、OpenAI、Ollamaなど複数のLLMプロバイダーに対応。"
tags:
  - "clippings"
  - "python"
  - "llm"
  - "structured-data-extraction"
  - "nlp"
  - "google"
---

## 概要

**LangExtract** は、Google が開発したオープンソースの Python ライブラリで、LLM を活用して非構造化テキスト（臨床ノート、レポートなど）からユーザー定義の指示に基づいた構造化情報を抽出する。抽出されたデータがソーステキストのどこに対応するかを正確にマッピングする**ソースグラウンディング**が最大の特徴。

- **GitHub**: [google/langextract](https://github.com/google/langextract)
- **ライセンス**: Apache 2.0
- **DOI**: [10.5281/zenodo.17015089](https://doi.org/10.5281/zenodo.17015089)
- **PyPI**: `pip install langextract`

---

## 主要な特徴（Why LangExtract?）

| 特徴 | 説明 |
|---|---|
| **正確なソースグラウンディング** | 全ての抽出結果をソーステキスト内の正確な位置にマッピングし、ハイライト表示で追跡・検証を可能にする |
| **信頼性の高い構造化出力** | Few-shot例に基づく一貫した出力スキーマを強制。Gemini等の制御生成機能を活用し堅牢な構造化結果を保証 |
| **長文ドキュメント最適化** | テキストチャンキング、並列処理、複数パスによる最適化戦略で「大規模文書からの情報抽出」課題を克服 |
| **インタラクティブ可視化** | 自己完結型のインタラクティブHTMLファイルを生成し、数千の抽出エンティティを元のコンテキスト内で視覚的にレビュー可能 |
| **柔軟なLLMサポート** | Google Geminiファミリー（クラウド）からOllama経由のローカルOSSモデルまで対応 |
| **ドメイン適応性** | 数例のサンプルだけで任意ドメインの抽出タスクを定義可能。モデルのファインチューニング不要 |
| **LLMの世界知識活用** | プロンプトの文言やFew-shot例を通じてLLMの内蔵知識をどの程度活用するか制御可能 |

---

## クイックスタート

### 1. 抽出タスクの定義

プロンプトで抽出ルールを定義し、高品質な例でモデルの挙動をガイドする。

```python
import langextract as lx
import textwrap

# プロンプトと抽出ルールの定義
prompt = textwrap.dedent("""\
 Extract characters, emotions, and relationships in order of appearance.
 Use exact text for extractions. Do not paraphrase or overlap entities.
 Provide meaningful attributes for each entity to add context.""")

# モデルを導くための高品質な例
examples = [
 lx.data.ExampleData(
   text="ROMEO. But soft! What light through yonder window breaks? ...",
   extractions=[
     lx.data.Extraction(
       extraction_class="character",
       extraction_text="ROMEO",
       attributes={"emotional_state": "wonder"}
     ),
     lx.data.Extraction(
       extraction_class="emotion",
       extraction_text="But soft!",
       attributes={"feeling": "gentle awe"}
     ),
     lx.data.Extraction(
       extraction_class="relationship",
       extraction_text="Juliet is the sun",
       attributes={"type": "metaphor"}
     ),
   ]
 )
]
```

> **重要**: `extraction_text` は例の `text` からの原文引用（パラフレーズ不可）を出現順に並べる。パターンに沿わない場合は `Prompt alignment` 警告が発生する。

### 2. 抽出の実行

```python
input_text = "Lady Juliet gazed longingly at the stars, her heart aching for Romeo"

result = lx.extract(
 text_or_documents=input_text,
 prompt_description=prompt,
 examples=examples,
 model_id="gemini-2.5-flash",
)
```

**推奨モデル**:
- `gemini-2.5-flash` — 速度・コスト・品質のバランスに優れたデフォルト推奨
- `gemini-2.5-pro` — より深い推論が必要な複雑タスク向け

### 3. 結果の可視化

抽出結果を `.jsonl` ファイルに保存し、インタラクティブなHTML可視化を生成。

```python
# JSONL保存
lx.io.save_annotated_documents([result], output_name="extraction_results.jsonl", output_dir=".")

# HTML可視化の生成
html_content = lx.visualize("extraction_results.jsonl")
with open("visualization.html", "w") as f:
 if hasattr(html_content, 'data'):
   f.write(html_content.data)  # Jupyter/Colab用
 else:
   f.write(html_content)
```

![Romeo and Juliet Basic Visualization](https://raw.githubusercontent.com/google/langextract/main/docs/_static/romeo_juliet_basic.gif)

---

## 長文ドキュメントのスケーリング

URLから直接ドキュメントを処理可能。並列処理と複数パスで大規模テキストにも対応。

```python
result = lx.extract(
 text_or_documents="https://www.gutenberg.org/files/1513/1513-0.txt",
 prompt_description=prompt,
 examples=examples,
 model_id="gemini-2.5-flash",
 extraction_passes=3,    # 複数パスでリコール向上
 max_workers=20,         # 並列処理で高速化
 max_char_buffer=1000    # 小さいコンテキストで精度向上
)
```

*ロミオとジュリエット*全文（147,843文字）からの抽出例では、数百のエンティティを高精度で抽出。

### Vertex AI バッチ処理

大規模タスクのコスト削減に Vertex AI Batch API を利用可能:

```python
language_model_params={"vertexai": True, "batch": {"enabled": True}}
```

---

## インストール

| 方法 | コマンド |
|---|---|
| **PyPI** | `pip install langextract` |
| **ソースから** | `git clone https://github.com/google/langextract.git && pip install -e .` |
| **開発用** | `pip install -e ".[dev]"` |
| **テスト用** | `pip install -e ".[test]"` |
| **Docker** | `docker build -t langextract . && docker run --rm -e LANGEXTRACT_API_KEY="key" langextract python script.py` |

---

## APIキーの設定

クラウドモデル（Gemini, OpenAI）使用時に必要。ローカルモデル（Ollama）は不要。

**APIキーの取得先**:
- [AI Studio](https://aistudio.google.com/app/apikey) — Geminiモデル
- [Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview) — エンタープライズ用
- [OpenAI Platform](https://platform.openai.com/api-keys) — OpenAIモデル

**設定方法（推奨: `.env` ファイル）**:

```bash
LANGEXTRACT_API_KEY=your-api-key-here
```

Vertex AI（サービスアカウント）経由の認証にも対応:

```python
language_model_params={
 "vertexai": True,
 "project": "your-project-id",
 "location": "global"
}
```

---

## 対応LLMプロバイダー

### Google Gemini（デフォルト）

`model_id="gemini-2.5-flash"` で利用。制御生成による構造化出力を完全サポート。

### OpenAI

```bash
pip install langextract[openai]
```

```python
result = lx.extract(
 ...,
 model_id="gpt-4o",
 api_key=os.environ.get('OPENAI_API_KEY'),
 fence_output=True,
 use_schema_constraints=False  # OpenAI向けスキーマ制約は未実装
)
```

### Ollama（ローカルLLM）

APIキー不要でローカル推論が可能。

```python
result = lx.extract(
 ...,
 model_id="gemma2:2b",
 model_url="http://localhost:11434",
 fence_output=False,
 use_schema_constraints=False
)
```

セットアップ: [ollama.com](https://ollama.com/) → `ollama pull gemma2:2b` → `ollama serve`

### カスタムプロバイダー

軽量プラグインシステムで独自LLMプロバイダーを追加可能:
- `@registry.register(...)` でプロバイダーを登録
- 別パッケージとして配布可能
- 優先度ベースの解決でビルトインプロバイダーを上書き・拡張

---

## 活用例

### ロミオとジュリエット全文抽出

Project Gutenbergの全文（147,843文字）から並列処理・複数パスでエンティティを抽出するデモ。
→ [詳細例](https://github.com/google/langextract/blob/main/docs/examples/longer_text_example.md)

### 薬剤情報の抽出

臨床テキストから薬剤名、用量、投与経路などの構造化医療情報を抽出。基本的なエンティティ認識と関係抽出の両方を実演。
→ [詳細例](https://github.com/google/langextract/blob/main/docs/examples/medication_examples.md)

> **注意**: 医療目的での使用を意図したものではない。

### 放射線レポート構造化: RadExtract

HuggingFace Spaces上のライブデモ。放射線レポートを自動構造化する。
→ [RadExtractデモ](https://huggingface.co/spaces/google/radextract)

---

## 制限事項・注意点

- **Googleの公式サポート製品ではない**
- OpenAIモデル使用時は `fence_output=True` と `use_schema_constraints=False` が必要（スキーマ制約未実装）
- Geminiモデルにはライフサイクルがあり、定期的に廃止日を確認する必要がある
- LLMの世界知識に基づく推論の精度はモデル、タスクの複雑さ、プロンプトの明確さに依存
- 健康関連アプリケーションでの使用は [Health AI Developer Foundations Terms of Use](https://developers.google.com/health-ai-developer-foundations/terms) に従う必要がある
- 大規模・本番利用にはTier 2 Geminiクオータの取得を推奨（スループット向上・レート制限回避）
