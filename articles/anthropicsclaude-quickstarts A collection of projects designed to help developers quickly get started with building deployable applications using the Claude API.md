---
title: "anthropics/claude-quickstarts: A collection of projects designed to help developers quickly get started with building deployable applications using the Claude API"
source: "https://github.com/anthropics/claude-quickstarts/tree/main"
author:
  - "Anthropic"
published:
created: 2025-11-29
description: |
  Claude APIを使用してデプロイ可能なアプリケーションを構築するための開発者向けクイックスタートプロジェクト集。カスタマーサポートエージェント、金融データアナリスト、コンピュータ使用デモ、自律型コーディングエージェントなど、すぐに構築・カスタマイズできる基盤プロジェクトを提供。
tags:
  - "Claude API"
  - "Anthropic"
  - "AI"
  - "quickstart"
  - "Python"
  - "TypeScript"
  - "customer-support"
  - "financial-analysis"
  - "computer-use"
  - "autonomous-coding"
  - "Agent SDK"
---

## 概要

**Claude Quickstarts** は、Claude APIを使用してアプリケーションを構築する開発者が迅速に始められるよう設計されたプロジェクト集。各クイックスタートは、特定のニーズに合わせて簡単に構築・カスタマイズできる基盤を提供する。

| 項目 | 情報 |
|------|------|
| スター | 10.4k |
| フォーク | 1.9k |
| ライセンス | MIT |
| 主要言語 | Python (43%), TypeScript (39.5%), Jupyter Notebook (10.9%) |

## 始め方

1. リポジトリをクローン
2. 特定のクイックスタートディレクトリに移動
3. 必要な依存関係をインストール
4. Claude APIキーを環境変数として設定
5. アプリケーションを実行

> APIキーは [console.anthropic.com](https://console.anthropic.com) で無料で取得可能

---

## 利用可能なクイックスタート

### 1. Customer Support Agent

Claudeを活用したAIカスタマーサポートシステム。Amazon Bedrock Knowledge Basesによる知識検索機能を備える。

#### 主要機能

- 🤖 **AIチャット**: Anthropic Claudeモデルによる会話
- 🔍 **Amazon Bedrock統合**: コンテキストに応じた知識検索
- 💭 **リアルタイム思考表示**: デバッグ情報の表示
- 📚 **ナレッジベースソース可視化**: 情報源の表示
- 😊 **ユーザームード検出**: 適切なエージェントへのリダイレクト
- 🎨 **カスタマイズ可能なUI**: shadcn/uiコンポーネント

#### 技術スタック

- Next.js
- shadcn/ui
- Amazon Bedrock (RAG)

#### 設定

```bash
# .env.local
ANTHROPIC_API_KEY=your_anthropic_api_key
BAWS_ACCESS_KEY_ID=your_aws_access_key
BAWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

> AWS環境変数の先頭に'B'を付けるのは、AWS AmplifyがAWSで始まるキーを許可しないため

#### モデル切り替え

```typescript
const models: Model[] = [
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
];
```

#### デプロイ

AWS Amplifyでのデプロイをサポート。サービスロールに`AmazonBedrockFullAccess`ポリシーをアタッチする必要あり。

---

### 2. Financial Data Analyst

Claudeの機能とインタラクティブなデータ可視化を組み合わせ、チャットを通じて金融データを分析するNext.jsアプリケーション。

#### Financial Data Analyst の主要機能

- 📊 **インテリジェントデータ分析**: Claude 3 Haiku & Claude 3.5 Sonnet使用
- 📁 **マルチフォーマットファイルアップロード**:
  - テキスト/コードファイル (.txt, .md, .html, .py, .csv など)
  - PDFドキュメント（テキスト抽出可能なもの）
  - 画像
- 📈 **インタラクティブデータ可視化**:
  - 折れ線グラフ（時系列データ・トレンド）
  - 棒グラフ（単一指標比較）
  - マルチバーチャート（複数指標比較）
  - エリアチャート（時間経過による数量）
  - 積み上げエリアチャート（構成要素の内訳）
  - 円グラフ（分布分析）

#### Financial Data Analyst の技術スタック

**フロントエンド:**

- Next.js 14
- React
- TailwindCSS
- Shadcn/ui
- Recharts
- PDF.js

**バックエンド:**

- Next.js API Routes
- Edge Runtime
- Anthropic SDK

#### 活用例

1. **データ抽出・分析**: 金融ドキュメントのアップロード、重要指標の抽出、トレンドとパターンの分析
2. **可視化作成**: データに基づくチャート生成、カスタマイズ、複数指標の比較
3. **インタラクティブ分析**: データに関する質問、特定の可視化リクエスト、詳細説明の取得

#### その他の活用シナリオ

- 環境データ分析（気候変動トレンド、汚染レベル）
- スポーツパフォーマンス追跡
- ソーシャルメディア分析
- 教育進捗追跡
- 健康・フィットネスモニタリング
- **画像内容分析**: 画像内の要素を円グラフで可視化可能

---

### 3. Computer Use Demo

Claudeがデスクトップコンピュータを制御するための環境とツールを提供するデモ。

> ⚠️ **注意**: Computer useはベータ機能。インターネットとの対話時には特有のリスクが伴う。

#### 最新情報

**対応モデル:**

- Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) - デフォルト
- Claude Sonnet 4 (claude-sonnet-4-20250514)
- Claude Opus 4 (claude-opus-4-20250514)
- Claude Haiku 4.5 (claude-haiku-4-5-20251001)

#### セキュリティ上の推奨事項

1. 最小限の権限を持つ専用の仮想マシンまたはコンテナを使用
2. アカウントログイン情報などの機密データへのアクセスを避ける
3. 許可リストに基づいてインターネットアクセスを制限
4. 重要な意思決定や同意が必要なタスクは人間の確認を求める

#### サポートプロバイダー

- **Claude API**: Anthropic直接
- **Amazon Bedrock**: AWS統合
- **Vertex AI**: Google Cloud統合

#### クイックスタート (Claude API)

```bash
export ANTHROPIC_API_KEY=%your_api_key%
docker run \
    -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```

#### アクセスポイント

| インターフェース | URL |
|------------------|-----|
| 統合インターフェース | `http://localhost:8080` |
| Streamlitのみ | `http://localhost:8501` |
| デスクトップビューのみ | `http://localhost:6080/vnc.html` |
| VNC直接接続 | `vnc://localhost:5900` |

#### 画面サイズの推奨

- **推奨解像度**: XGA (1024x768)
- 高解像度の場合: XGAにスケールダウンし、座標を元の解像度に比例マッピング
- 低解像度の場合: 1024x768になるまで黒いパディングを追加

---

### 4. Autonomous Coding Agent

Claude Agent SDKを使用した自律型コーディングエージェントのデモ。複数セッションにわたって完全なアプリケーションを構築可能。

#### 2エージェントパターン

1. **Initializer Agent (セッション1)**:
   - `app_spec.txt`を読み込み
   - 200個のテストケースを含む`feature_list.json`を作成
   - プロジェクト構造のセットアップ
   - gitの初期化

2. **Coding Agent (セッション2以降)**:
   - 前回のセッションから継続
   - 機能を1つずつ実装
   - `feature_list.json`に完了マークを付与

#### 前提条件

```bash
# Claude Code CLIのインストール
npm install -g @anthropic-ai/claude-code

# Python依存関係のインストール
pip install -r requirements.txt

# APIキー設定
export ANTHROPIC_API_KEY='your-api-key-here'
```

#### クイックスタート

```bash
# 基本実行
python autonomous_agent_demo.py --project-dir ./my_project

# イテレーション制限付きテスト
python autonomous_agent_demo.py --project-dir ./my_project --max-iterations 3
```

#### 実行時間の目安

- **初期化セッション**: 数分（200テストケース生成）
- **コーディングセッション**: 各5-15分
- **全機能完了**: 複数セッションで数時間

> 💡 より早いデモには、`prompts/initializer_prompt.md`の機能数を20-50に減らすことを推奨

#### セキュリティモデル（多層防御）

1. **OSレベルサンドボックス**: 隔離環境でBashコマンド実行
2. **ファイルシステム制限**: プロジェクトディレクトリのみに制限
3. **Bashホワイトリスト**:
   - ファイル検査: `ls`, `cat`, `head`, `tail`, `wc`, `grep`
   - Node.js: `npm`, `node`
   - バージョン管理: `git`
   - プロセス管理: `ps`, `lsof`, `sleep`, `pkill`

#### コマンドラインオプション

| オプション | 説明 | デフォルト |
|------------|------|------------|
| `--project-dir` | プロジェクトディレクトリ | `./autonomous_demo_project` |
| `--max-iterations` | 最大イテレーション数 | 無制限 |
| `--model` | 使用するClaudeモデル | `claude-sonnet-4-5-20250929` |

---

## 関連リソース

- 📚 [Claude API Documentation](https://docs.claude.com) - 公式ドキュメント
- 📖 [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks) - 一般的なタスクのコードスニペットとガイド
- 🎓 [Claude API Fundamentals Course](https://github.com/anthropics/courses/tree/master/anthropic_api_fundamentals) - APIの基礎コース

## コミュニティとサポート

- 💬 [Anthropic Discord](https://www.anthropic.com/discord) - コミュニティディスカッション
- 📋 [Anthropic Support](https://support.anthropic.com) - サポートドキュメント

## 重要な注意点

- Customer Support AgentとFinancial Data Analystはプロトタイプとして提供され、本番環境での使用は想定されていない
- Computer Useはベータ機能であり、特有のリスクが伴う
- 全プロジェクトはMITライセンスで提供
