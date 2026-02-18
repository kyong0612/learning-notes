---
title: "MixSeek Quant Insight - アルゴ量産から特徴量設計までをカバーするコンペ型AIエージェント"
source: "https://zenn.dev/gamella/articles/a624a7eb2c78f7"
author:
  - "[[gamella]]"
published: 2026-02-07
created: 2026-02-18
description: "MixSeekのコンペ型アーキテクチャを活用し、複数AIエージェントチームを競わせることでアルゴリズム量産・特徴量設計・リスクシグナル生成を自動化する、金融時系列分析向けオープンソース拡張パッケージの解説記事。"
tags:
  - "clippings"
  - "Python"
  - "AIエージェント"
  - "クオンツ"
  - "時系列分析"
  - "LLM"
  - "金融"
  - "アルゴリズムトレーディング"
---

## 概要

MixSeek Quant Insightは、汎用AIエージェントフレームワーク[MixSeek](https://github.com/mixseek/mixseek-core)のコンペ型アーキテクチャを活かし、金融時系列の分析に特化した拡張パッケージである。複数のAIエージェントチームを並列に競わせることで、将来リターンを予測するシグナル計算ロジックの探索・生成を自律的に行う。著者はJPX東証予測コンペや三井物産コモディティ予測コンペの問題設計を担当した経験を持ち、そのノウハウを本パッケージに反映している。

- GitHub: [mixseek/mixseek-quant-insight](https://github.com/mixseek/mixseek-quant-insight)

## 主要なトピック

### MixSeekの基盤技術

- **コンペ型アーキテクチャ**: Kaggleのデータ分析コンペのモデルを模倣した設計
- 複数のAIエージェントチームが並列に動作し、共通タスクに対して回答を提出
- 評価モジュールによるスコアリングとリーダーボードへのランキング掲載
- 評価結果に基づくフィードバックにより、他チームと競いながら回答を洗練

### MixSeek Quant Insightでできること

1. **任意の時系列データの分析**: J-Quants API データ、センチメントスコア、オルタナティブデータなど自由な入力に対応
2. **シグナル計算ロジックの量産**: 多数のチームを並列に競わせ、リーダーボードに大量のシグナルと評価値を蓄積
3. **実運用への転用**: すべてのシグナル計算ロジックは所定フォーマットのPython関数として提出されるため、最新データを入力すれば同一ロジックでシグナル出力が可能

提出関数のインターフェース:

```python
def generate_signal(ohlcv: pl.DataFrame, additional_data: dict[str, pl.DataFrame]) -> pl.DataFrame:
    # 返り値のDataFrameはdatetime, symbol, signal列を含む
    ...
```

### アーキテクチャ詳細

#### メンバーエージェントの拡張

- チームに所属するメンバーエージェントを柔軟にカスタム実装可能
- ローカル環境のデータソースにアクセスできるPythonコード実行エージェントを構築
- `member.toml`でモデル、システムプロンプト、プラグイン、アクセスデータ、構造化出力を設定

#### 評価指標の拡張（リーク防止の仕組み）

KaggleのTimeseries APIにインスパイアされた評価方式を採用:

1. データを**学習期間**と**評価期間**に事前分割し、エージェントは学習データのみにアクセス
2. 分析完了後、シグナル計算ロジックをPython関数文字列として提出
3. 評価モジュールが提出関数と評価期間データでバックテストを実行しスコア算出

この仕組みにより、エージェントが評価データを直接参照することなく、実運用時に再現可能なロジックかどうかを適切に判定できる。

#### 評価式: 順位相関シャープレシオ

評価手順:
1. 提出されたシグナル計算関数を、時点tにおける最新データを入力として実行
2. 関数出力と時点tにおける将来リターンとの**ユニバース内の順位相関**を計算
3. 上記を評価期間全体にわたってクロスセクショナルに繰り返す
4. 順位相関の系列に対し**シャープレシオ（平均 / 標準偏差）**を算出

MixSeekの`Evaluator`コンポーネントの`Metric`クラスとして分離実装されており、`evaluator.toml`で指定する設計。

### 使い方・カスタマイズ

#### 基本的な実行

```bash
mixseek exec "株価リターンを予測する面白いシグナル関数を生成してください" \
    --config $MIXSEEK_WORKSPACE/configs/orchestrator.toml
```

#### データソースの構築

```bash
quant-insight data fetch-jquants --plan free --universe prime  # J-Quants APIからデータ取得
quant-insight data build-returns                                # リターン（目的変数）をビルド
quant-insight data split                                        # 学習/評価期間に分割
```

#### カスタマイズ可能な項目

| 項目 | 設定ファイル | 内容 |
|------|-------------|------|
| チーム数・構成 | `orchestrator.toml` | 複数チームの追加・入れ替え |
| メンバー構成 | `team.toml` | メンバーの追加・変更 |
| モデル・プロンプト | `team.toml` / `member.toml` | リーダー・メンバーごとのモデル・temperature・system_instruction |
| データソース追加 | `competition.toml` + データ配置 | parquet/csv形式で任意データを登録 |
| 評価指標 | `evaluator.toml` | `BaseMetric`を継承した独自メトリック |

#### 対応モデル例

- `google-gla:gemini-2.5-flash` / `google-gla:gemini-3-flash-preview`（Gemini）
- `openai:gpt-5.2`（GPT）
- `anthropic:claude-sonnet-4-5`（Claude）
- `grok:grok-4-1-fast-reasoning`（Grok）

## 重要な事実・データ

- **Kaggleコンペ実績**: 著者はJPX東証予測コンペ、三井物産コモディティ予測チャレンジの問題設計を担当
- **評価方式**: Kaggle Timeseries APIにインスパイアされたリーク防止機構を採用
- **評価関数**: 順位相関シャープレシオ — 著者はこれをシグナル性能計測で最も汎用的な評価関数と位置づけ
- **マルチモデル対応**: Gemini、GPT、Claude、Grokなど主要LLMプロバイダに対応
- **オープンソース**: GitHubで公開済み

## 結論・示唆

### 著者の結論

MixSeek Quant Insightにより、AIエージェントチームが自律的に競い合いながらアルファ（超過収益の源泉となるシグナル）を探索する仕組みが実現できる。コンペ型アーキテクチャの強みは、多様なアプローチを並列に試行・評価し、リーダーボードを通じて定量的に優劣を判断できる点にある。

### 実践的な示唆

- コンペ型アーキテクチャは、AIエージェントによるシグナル探索の品質向上に有効
- リーク防止の仕組み（学習/評価データの分離 + 関数提出方式）は、実運用可能なロジック生成において不可欠
- 評価指標・エージェント構成・データソースの柔軟なカスタマイズにより、多様な金融時系列分析に応用可能
- マケデコハッカソン（[connpass](https://mkdeco.connpass.com/event/384016/)）での発表も募集中

## 関連リソース

- [MixSeek Core](https://github.com/mixseek/mixseek-core)
- [MixSeek Quant Insight](https://github.com/mixseek/mixseek-quant-insight)
- [JPX東証予測コンペ（Kaggle）](https://www.kaggle.com/c/jpx-tokyo-stock-exchange-prediction)
- [三井物産コモディティ予測チャレンジ（Kaggle）](https://www.kaggle.com/competitions/mitsui-commodity-prediction-challenge)
- [マケデコハッカソン（connpass）](https://mkdeco.connpass.com/event/384016/)

---

*Source: [MixSeek Quant Insight - アルゴ量産から特徴量設計までをカバーするコンペ型AIエージェント](https://zenn.dev/gamella/articles/a624a7eb2c78f7)*
