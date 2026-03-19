---
title: "NVIDIA-NeMo/DataDesigner: 🎨 NeMo Data Designer: A general library for generating high-quality synthetic data from scratch or based on seed data."
source: "https://github.com/NVIDIA-NeMo/DataDesigner"
author:
  - "The NeMo Data Designer Team, NVIDIA"
published: 2025-01-24
created: 2026-03-19
description: "NeMo Data Designerは、LLMエンドポイントを活用して統計的多様性・フィールド間相関・自動バリデーションを備えた高品質な合成データセットをゼロから、またはシードデータをベースに生成するNVIDIA製オーケストレーションフレームワーク。"
tags:
  - "clippings"
  - "NVIDIA"
  - "synthetic-data"
  - "LLM"
  - "data-generation"
  - "NeMo"
---

## 概要

**NeMo Data Designer** は、NVIDIAが開発した合成データ生成のためのオーケストレーションフレームワーク。LLMエンドポイント（NVIDIA Build API、OpenAI、OpenRouter、vLLM等）を活用し、統計的多様性、フィールド間の意味のある相関、品質バリデーションを備えた本格的な合成データセットを生成できる。150億トークン以上の生成実績を持つ。

- **ライセンス**: Apache License 2.0
- **対応Python**: 3.10 - 3.13
- **インストール**: `pip install data-designer`

---

## 主な機能

- **多様なデータ生成**: 統計サンプラー、LLM、既存のシードデータセットを組み合わせたデータ生成
- **フィールド間の関係制御**: 依存関係を意識したカラム生成（DAGベースの実行順序解決）
- **品質バリデーション**: Python/SQLリンター、カスタムバリデータ、リモートバリデータによる自動品質検証
- **LLM-as-a-Judge**: LLMを評価者として利用し、生成コンテンツを複数の品質次元でスコアリング
- **プレビューモード**: 全規模生成の前にサンプルを確認し素早くイテレーション
- **バッチ処理と並列化**: 設定可能なバッファサイズと並列リクエスト数による効率的な大規模生成

---

## アーキテクチャ

Data Designerは**クライアントサイドのオーケストレーションフレームワーク**であり、モデル自体はホスティングしない。

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Data Designer               │ HTTP  │     Inference Server(s)         │
│     (オーケストレーション)         │ ────► │     (LLMホスティング)            │
│                                 │       │                                 │
│ • データセットワークフロー管理     │       │ • モデルの実行                   │
│ • カラム依存関係の解決            │       │ • GPU割り当て                    │
│ • バッチ処理と並列化             │       │ • リクエストキューイング          │
│ • リトライとエラーハンドリング     │       │ • トークン生成                   │
│ • データバリデーションと品質管理   │       │ • レート制限（オプション）        │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

### 実行モデル

1. **バッチ分割**: データセットを `buffer_size` レコード単位のバッチに分割
2. **カラム順次処理**: バッチ内で依存関係グラフに従いカラムを1つずつ生成
3. **セル並列処理**: 各カラム内では `max_parallel_requests` まで並列にLLM呼び出し

**同時リクエスト数の計算式**:
```
concurrent_requests = min(buffer_size, max_parallel_requests, remaining_cells_in_column)
```

---

## カラムタイプ（全11種）

### 🎲 サンプラーカラム（Sampler Columns）

数値サンプリングによるデータ生成。LLMより高速で決定論的。

| サンプラータイプ | 用途 |
|---|---|
| Category | カテゴリ値（確率重み付けオプション） |
| Subcategory | 階層的カテゴリデータ |
| Uniform | 一様分布（整数・浮動小数点） |
| Gaussian | 正規分布 |
| Poisson | カウントデータ・イベント頻度 |
| Binomial | 試行回数に対する成功数 |
| Bernoulli | 成功確率を指定した二値結果 |
| Bernoulli Mixture | 複数確率成分による二値結果 |
| Scipy | scipy.stats の全分布にアクセス |
| Datetime | 指定範囲内のタイムスタンプ |
| Timedelta | 時間差 |
| Person | 名前・人口統計属性を持つリアルな合成個人データ |
| UUID | 一意識別子 |

条件付きサンプリングにも対応（例: 国ごとに年齢分布を変化させる）。

### 📝 LLM-Textカラム

自然言語テキストの生成。Jinja2テンプレートで他カラムを参照可能。

- **生成トレース**: `with_trace` で会話履歴の記録が可能
- **推論内容抽出**: `extract_reasoning_content=True` でchain-of-thought推論を別カラムに抽出
- **ツール使用（MCP）**: `tool_alias` を設定しMCP経由で外部ツールを呼び出し可能

### 💻 LLM-Codeカラム

特定プログラミング言語のコード生成。LLM応答からクリーンなコードを自動抽出。

**対応言語**: Bash, C, C++, C#, COBOL, Go, Java, JavaScript, Kotlin, Python, Ruby, Rust, Scala, Swift, TypeScript, SQL各方言（SQLite, PostgreSQL, MySQL, T-SQL, BigQuery, ANSI SQL）

### 🗂️ LLM-Structuredカラム

スキーマ保証付きJSON生成。PydanticモデルまたはJSONスキーマで構造を定義し、LLM出力が必ず準拠するよう保証。

### ⚖️ LLM-Judgeカラム

LLMを評価者として生成コンテンツを複数品質次元でスコアリング。スコアリングルーブリック（関連性、正確性、流暢さ、有用性等）を定義し、各レコードを定量的に評価。

### 🖼️ Imageカラム

テキストプロンプトからの画像生成。拡散モデル（DALL·E、Stable Diffusion、Imagen）と自己回帰モデル（Gemini、GPT image）の両方に対応。`multi_modal_context` で画像→画像のワークフローも可能。

### 🧬 Embeddingカラム

テキストコンテンツのベクトル埋め込み生成。類似検索、クラスタリング、意味分析に活用。

### 🧩 Expressionカラム

Jinja2テンプレートによるシンプルな変換処理（文字列結合、算術計算、条件分岐等）。LLMオーバーヘッドなし。

### 🔍 Validationカラム

生成コンテンツのルールベース検証。構造化されたpass/fail結果を返す。

- **Pythonコードバリデータ**: Ruffリンターによる検証（スコア0-10）
- **SQLコードバリデータ**: SQLFluffによる方言対応のSQL検証
- **ローカルCallableバリデータ**: カスタムPython関数による柔軟な検証
- **リモートバリデータ**: HTTPエンドポイントによるvalidation-as-a-service

### 🌱 Seed Datasetカラム

既存の実データからブートストラップ。シードデータで一部のスキーマを提供し（実際の商品名やカテゴリ等）、生成カラムでボリュームとバリエーションを追加。

### 🔧 Customカラム

`@custom_column_generator` デコレータによるカスタム生成ロジック。`full_column`（DataFrame全体）と `cell_by_cell`（1行ずつ並列化）の2戦略。

---

## Person Sampling（人物データ生成）

### Faker ベース

Fakerライブラリによるランダムな個人情報生成。高速だが人口統計的正確性はない。プロトタイピングやテスト用途向き。

### Nemotron-Personas データセット

NVIDIA GPU Cloud (NGC) のキュレーション済みデータセットによる**人口統計的に正確な**人物データ生成。

**対応ロケール**: en_US, en_IN, en_SG, hi_Deva_IN, hi_Latn_IN, ja_JP, pt_BR

**生成可能なフィールド**:
- 基本情報: 名前、性別、生年月日、住所、電話番号、メールアドレス等
- 社会情報: 婚姻状況、教育レベル、学位分野、職業
- Synthetic Personas有効時: Big Five性格特性（スコア付き）、スキル・趣味、キャリア目標、文化的背景、コンテキスト別ペルソナ（職業・金融・医療・スポーツ・芸術等）

---

## パフォーマンスチューニング

### 主要パラメータ

| パラメータ | デフォルト | 説明 |
|---|---|---|
| `buffer_size` | 1000 | バッチあたりのレコード数 |
| `max_parallel_requests` | 4 | モデルごとの同時LLM APIコール数 |
| `non_inference_max_parallel_workers` | 4 | 非LLM操作のスレッドプールサイズ |
| `max_conversation_restarts` | 5 | 会話全体のリスタート回数 |
| `max_conversation_correction_steps` | 0 | 会話内での修正ステップ数 |
| `shutdown_error_rate` | 0.5 | エラー率がこの値を超えるとシャットダウン |

**最適化のヒント**:
- セルフホストvLLMサーバーは `max_parallel_requests` を256〜1024まで上げられる場合がある
- ベンチマークアプローチ: 100レコードで値を増やしながら生成時間を測定し、改善が止まる点を見つける

---

## クイックスタート

### インストール

```bash
pip install data-designer
```

### APIキー設定

```bash
export NVIDIA_API_KEY="your-api-key-here"    # NVIDIA Build API（推奨）
export OPENAI_API_KEY="your-openai-api-key"   # OpenAI
export OPENROUTER_API_KEY="your-openrouter-key" # OpenRouter
```

### 基本的な使用例

```python
import data_designer.config as dd
from data_designer.interface import DataDesigner

data_designer = DataDesigner()
config_builder = dd.DataDesignerConfigBuilder()

# カテゴリサンプラーの追加
config_builder.add_column(
    dd.SamplerColumnConfig(
        name="product_category",
        sampler_type=dd.SamplerType.CATEGORY,
        params=dd.CategorySamplerParams(
            values=["Electronics", "Clothing", "Home & Kitchen", "Books"],
        ),
    )
)

# LLMによるレビュー生成
config_builder.add_column(
    dd.LLMTextColumnConfig(
        name="review",
        model_alias="nvidia-text",
        prompt="Write a brief product review for a {{ product_category }} item.",
    )
)

# プレビュー
preview = data_designer.preview(config_builder=config_builder)
preview.display_sample_record()
```

### CLI設定

```bash
data-designer config providers  # モデルプロバイダー設定
data-designer config models     # モデル設定
data-designer config list       # 現在の設定表示
```

---

## テレメトリ

Data Designerはライブラリ改善のためにテレメトリを収集する。収集対象は**使用モデル名・入力トークン数・出力トークン数のみ**。ユーザーやデバイス情報は収集されない。

無効化: `NEMO_TELEMETRY_ENABLED=false`

---

## 制限事項・注意点

- Data Designer自体はモデルをホスティングしない（LLMエンドポイントの準備が必要）
- レート制限やGPUスケーリングはインフラ側で管理する必要がある
- リモートバリデータは現時点で認証なしのAPIコールのみ対応
- LLM-Structuredカラムの複雑なスキーマ適合はモデル能力に依存
- Nemotron-Personasデータセットの利用にはNGCからのダウンロードが必要

---

## 引用

```bibtex
@misc{nemo-data-designer,
  author = {The NeMo Data Designer Team, NVIDIA},
  title = {NeMo Data Designer: A framework for generating synthetic data from scratch or based on your own seed data},
  howpublished = {\url{https://github.com/NVIDIA-NeMo/DataDesigner}},
  year = {2025},
  note = {GitHub Repository},
}
```
