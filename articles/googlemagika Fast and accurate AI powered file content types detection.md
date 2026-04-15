---
title: "google/magika: Fast and accurate AI powered file content types detection"
source: "https://github.com/google/magika"
author:
  - "[[Elie Bursztein]]"
  - "[[Yanick Fratantonio]]"
published: 2024-02-15
created: 2026-04-15
description: "GoogleによるAIを活用したファイルコンテンツタイプ検出ツール。深層学習モデル（約1MB）を用い、200以上のファイル形式を約99%の精度でミリ秒単位に識別する。Gmail、Drive、Safe Browsingなどで週に数千億ファイル規模で運用されている。"
tags:
  - "clippings"
  - "AI"
  - "Deep Learning"
  - "File Detection"
  - "Security"
  - "Google"
  - "Python"
  - "Rust"
  - "Open Source"
---

## 概要

[Magika](https://github.com/google/magika) は、Googleが開発したAIベースのファイルタイプ検出ツールである。従来の `libmagic` / `file` コマンドが50年以上にわたり手作業のヒューリスティクスとルールに依存していたのに対し、Magika は深層学習モデルを用いることで、特にテキスト形式やプログラミング言語のファイルにおいて大幅な精度向上を実現した。

モデルは約1MBと軽量で、CPU上でも1ファイルあたり約5msで推論が完了する。約1億サンプル・200以上のコンテンツタイプで訓練・評価され、テストセットで平均約99%の精度を達成している。

Google内部では Gmail、Google Drive、Safe Browsing のファイルを適切なセキュリティ・コンテンツポリシースキャナにルーティングするために大規模運用されており、週あたり数千億ファイルを処理している。また、[VirusTotal](https://www.virustotal.com/) や [abuse.ch](https://bazaar.abuse.ch/) にも統合されている。

## 主要なトピック

### なぜファイルタイプ検出は難しいのか

- 各ファイル形式は異なる構造を持つ（あるいは構造がまったくない）
- テキスト形式やプログラミング言語は非常に類似した構文を持ち、区別が困難
- `libmagic` などの既存ツールは手作業のヒューリスティクスに依存しており、時間がかかりエラーも起こりやすい
- セキュリティ用途では、攻撃者が検出を欺くために敵対的に加工されたペイロードを使うため、信頼性のある検出が特に困難

### 技術的アーキテクチャ

- **モデル**: [Keras](https://keras.io/) で設計・訓練されたカスタム深層学習モデル（約1MB）
- **推論エンジン**: [ONNX Runtime](https://onnx.ai/) を使用し、CPUでもミリ秒単位の推論を実現
- **入力**: ファイル全体ではなく、限定的なサブセットのみを使用（ファイルサイズに依存しないほぼ一定の推論時間）
- **信頼度制御**: コンテンツタイプごとに事前調整された閾値システムにより、予測を「信頼」するか、「Generic text document」「Unknown binary data」などの汎用ラベルを返すかを判断
- **予測モード**: `high-confidence`、`medium-confidence`、`best-guess` の3段階でエラー許容度を制御可能

### ハイライト

- **マルチ言語対応**: Rust製CLI、Python API、JavaScript/TypeScript（npm）、GoLang（WIP）のバインディングを提供
- **大規模データセット**: 約1億ファイル、200以上のコンテンツタイプ（バイナリ・テキスト双方）で訓練・評価
- **高精度**: テストセットで平均約99%の精度・再現率を達成。既存ツールを約20%上回る
- **高速推論**: モデルロード後、1ファイルあたり約5ms（CPU上）
- **バッチ処理**: 数千ファイルの同時処理が可能。`-r` オプションでディレクトリの再帰スキャンにも対応
- **全主要OS対応**: Windows、macOS、Linux をサポート

### インストール方法

| 方法 | コマンド |
|------|---------|
| pip（Python） | `pip install magika` |
| pipx（CLI） | `pipx install magika` |
| brew（macOS / Linux） | `brew install magika` |
| installer script | `curl -LsSf https://securityresearch.google/magika/install.sh \| sh` |
| Cargo（Rust） | `cargo install --locked magika-cli` |
| npm（JavaScript） | `npm install magika` |

### 使用例

**CLI**:

```shell
# ディレクトリを再帰的にスキャン
magika -r tests_data/basic/*

# JSON形式で出力
magika ./tests_data/basic/python/code.py --json

# 標準入力から読み込み
cat file.ini | magika -
```

**Python API**:

```python
from magika import Magika
m = Magika()
res = m.identify_bytes(b'function log(msg) {console.log(msg);}')
print(res.output.label)  # => "javascript"
```

```python
from magika import Magika
m = Magika()
res = m.identify_path('./tests_data/basic/ini/doc.ini')
print(res.output.label)  # => "ini"
```

### Google内部での運用実績

- **対象サービス**: Gmail、Google Drive、Safe Browsing
- **処理規模**: 週あたり数千億ファイル
- **効果**: 従来のルールベースシステムと比較して、ファイルタイプ識別精度が **50%向上**
- **追加スキャン**: 特殊な悪意あるAIドキュメントスキャナで **11%多くのファイル** をスキャン可能に
- **未識別ファイル**: **3%まで削減**

### 外部統合

- **VirusTotal**: Code Insight（Googleの生成AIによる悪意あるコード分析）のプリフィルターとして Magika を統合
- **abuse.ch**: マルウェアサンプルのファイルタイプ識別に使用

## 重要な事実・データ

- **モデルサイズ**: 約1MB
- **対応コンテンツタイプ**: 200以上（バイナリ・テキスト双方）
- **訓練データ**: 約1億サンプル
- **テストセット精度**: 平均約99%（精度・再現率）
- **推論速度**: 約5ms/ファイル（CPU上、モデルロード後）
- **既存ツール比較**: 100万ファイルベンチマークで他ツールを約20%上回る
- **Google内部の処理量**: 週あたり数千億ファイル
- **精度向上**: 従来システム比50%の識別精度向上
- **研究論文**: IEEE/ACM International Conference on Software Engineering (ICSE) 2025 に掲載

## 結論・示唆

### プロジェクトの意義

Magika は、50年以上にわたり手作業のヒューリスティクスに依存してきたファイルタイプ検出の課題を、深層学習で解決するアプローチを示した。特にテキスト形式のファイル検出において大きな精度向上を達成しており、セキュリティ用途での信頼性を大幅に向上させている。

### 実践的な示唆

- セキュリティスキャナのパイプラインにおいて、ファイルタイプの前処理フィルターとして活用可能
- 軽量なモデル（約1MB）とCPUでの高速推論により、エッジデバイスやリソース制約のある環境でも展開可能
- Python / Rust / JavaScript / Go のマルチ言語バインディングにより、既存システムへの統合が容易
- `high-confidence` / `medium-confidence` / `best-guess` の予測モードにより、ユースケースに応じたエラー許容度の制御が可能

## 制限事項・注意点

- **非公式Googleプロジェクト**: Googleの公式プロジェクトではなく、Googleによるサポートや品質保証はない
- **GoLangバインディング**: WIP（作業中）の状態
- **JavaScript/TypeScriptパッケージ**: 実験的（experimental）な位置づけ
- **ライセンス**: Apache 2.0

---

*Source: [google/magika: Fast and accurate AI powered file content types detection](https://github.com/google/magika)*