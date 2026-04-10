---
title: "microsoft/markitdown: Python tool for converting files and office documents to Markdown."
source: "https://github.com/microsoft/markitdown"
author:
  - "[[Microsoft AutoGen Team]]"
published: 2024-11-13
created: 2026-04-10
description: "MarkItDownはMicrosoft AutoGen Teamが開発した軽量なPythonユーティリティで、PDF・Word・Excel・PowerPoint・画像・音声・HTMLなど多様なファイル形式をMarkdownに変換する。LLMや テキスト分析パイプラインでの利用を主目的とし、文書構造（見出し・リスト・テーブル・リンク等）を保持したMarkdown出力を生成する。"
tags:
  - "clippings"
  - "Python"
  - "Markdown"
  - "document-conversion"
  - "Microsoft"
  - "LLM"
  - "open-source"
  - "CLI"
---

## 概要

[MarkItDown](https://github.com/microsoft/markitdown) は、Microsoft AutoGen Teamが開発した軽量なPythonユーティリティで、さまざまなファイル形式をMarkdownに変換するツールである。LLMや関連するテキスト分析パイプラインでの利用を主な目的としており、[textract](https://github.com/deanmalmgren/textract) と類似するが、文書構造（見出し・リスト・テーブル・リンクなど）をMarkdownとして保持することに重点を置いている。

- **PyPIパッケージ名**: `markitdown`（最新版 v0.1.5）
- **ライセンス**: MIT
- **Python要件**: 3.10以上
- **GitHub Stars**: 97,000+
- **月間ダウンロード数**: 約396万回（PyPI）

## 主要なトピック

### 対応ファイル形式

MarkItDownは以下の形式からの変換に対応している：

| カテゴリ | 形式 |
|---------|------|
| ドキュメント | PDF, Word (.docx), PowerPoint (.pptx), EPub |
| スプレッドシート | Excel (.xlsx, .xls) |
| メディア | 画像（EXIFメタデータ + OCR）、音声（EXIFメタデータ + 音声文字起こし） |
| Web | HTML, YouTube URL |
| データ | CSV, JSON, XML |
| その他 | ZIPファイル（中身を反復処理）、Outlookメッセージ |

### なぜMarkdownか

- Markdownはプレーンテキストに極めて近く、最小限のマークアップで文書構造を表現可能
- GPT-4oなどの主流LLMはネイティブにMarkdownを「話す」ことができ、大量のMarkdownテキストで訓練されている
- Markdownの記法はトークン効率が高い

### インストールと使用方法

#### インストール

```bash
pip install 'markitdown[all]'
```

全依存関係を含めずに、特定のファイル形式のみ対応する場合は個別指定が可能：

```bash
pip install 'markitdown[pdf, docx, pptx]'
```

利用可能なオプション依存グループ：`all`, `pptx`, `docx`, `xlsx`, `xls`, `pdf`, `outlook`, `az-doc-intel`, `audio-transcription`, `youtube-transcription`

#### コマンドライン使用

```bash
markitdown path-to-file.pdf > document.md
markitdown path-to-file.pdf -o document.md
cat path-to-file.pdf | markitdown
```

#### Python API

```python
from markitdown import MarkItDown

md = MarkItDown(enable_plugins=False)
result = md.convert("test.xlsx")
print(result.text_content)
```

#### LLMを利用した画像説明

LLMを活用して画像やPowerPointファイルの画像説明を生成可能：

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o", llm_prompt="optional custom prompt")
result = md.convert("example.jpg")
print(result.text_content)
```

#### Docker

```bash
docker build -t markitdown:latest .
docker run --rm -i markitdown:latest < ~/your-file.pdf > output.md
```

### プラグインシステム

MarkItDownはサードパーティプラグインをサポートしている。プラグインはデフォルトで無効。

```bash
markitdown --list-plugins       # インストール済みプラグイン一覧
markitdown --use-plugins file.pdf  # プラグイン有効化して変換
```

GitHubで `#markitdown-plugin` ハッシュタグを検索することで利用可能なプラグインを探せる。

#### markitdown-ocr プラグイン

PDF・DOCX・PPTX・XLSXコンバーターにOCRサポートを追加するプラグイン。LLM Visionを使用して埋め込み画像からテキストを抽出する。新しいMLライブラリやバイナリ依存関係は不要。

```bash
pip install markitdown-ocr
pip install openai
```

```python
from markitdown import MarkItDown
from openai import OpenAI

md = MarkItDown(
    enable_plugins=True,
    llm_client=OpenAI(),
    llm_model="gpt-4o",
)
result = md.convert("document_with_images.pdf")
```

### Azure Document Intelligence連携

Microsoft Document Intelligenceを使用した高精度な変換もサポート：

```bash
markitdown path-to-file.pdf -o document.md -d -e "<document_intelligence_endpoint>"
```

```python
from markitdown import MarkItDown

md = MarkItDown(docintel_endpoint="<document_intelligence_endpoint>")
result = md.convert("test.pdf")
```

### MCP（Model Context Protocol）サーバー

MarkItDownはMCPサーバーも提供しており、Claude DesktopなどのLLMアプリケーションとの統合が可能。詳細は [markitdown-mcp](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp) を参照。

## 重要な事実・データ

- **GitHub Stars**: 97,000超（非常に高い人気）
- **PyPI月間ダウンロード数**: 約396万回
- **最新バージョン**: v0.1.5（2026-02-20リリース）
- **初回リリース**: 2024-11-13（v0.0.1a1）
- **0.0.1 → 0.1.0での破壊的変更**:
  - 依存関係がオプションの機能グループに整理された
  - `convert_stream()` がバイナリファイルライクオブジェクトを要求するように変更
  - `DocumentConverter` クラスインターフェースがファイルパスからストリーム読み取りに変更（一時ファイルが不要に）

## 結論・示唆

### プロジェクトの位置づけ

MarkItDownは、LLMベースのワークフローにおけるドキュメント前処理の標準ツールとしての地位を確立しつつある。97,000超のGitHub Starsと月間約400万のダウンロード数がその採用率の高さを物証している。

### 実践的な示唆

- LLMにドキュメントを入力する際の前処理ツールとして最適
- プラグインシステムにより拡張性が高い
- MCPサーバー対応により、Claude Desktopなどとのシームレスな統合が可能
- Azure Document Intelligenceとの連携で、エンタープライズレベルの高精度変換にも対応

## 制限事項・注意点

- 出力は人間向けの高忠実度なドキュメント変換には最適化されていない（テキスト分析ツールによる消費を意図）
- v0.0.1からv0.1.0への移行時に破壊的変更があり、既存コードの更新が必要な場合がある
- プラグインはデフォルトで無効であり、明示的な有効化が必要
- Python 3.10以上が必須要件

---

*Source: [microsoft/markitdown](https://github.com/microsoft/markitdown)*
