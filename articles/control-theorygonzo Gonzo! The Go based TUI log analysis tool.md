---
title: "control-theory/gonzo: Gonzo! The Go based TUI log analysis tool"
source: "https://github.com/control-theory/gonzo"
author:
  - "[[destari]]"
  - "[[vine-mxm]]"
  - "[[rbg]]"
  - "[[jon-spyder]]"
published:
created: 2025-09-02
description: |
  k9sにインスパイアされた、Go製の強力なリアルタイムログ分析TUI。美しいチャート、AIによるインサイト、高度なフィルタリング機能を備え、ターミナルから直接ログストリームを分析できます。
tags:
  - "Go"
  - "TUI"
  - "log-analysis"
  - "terminal"
  - "AI"
  - "OpenTelemetry"
  - "Ollama"
---

## Gonzo: Go製TUIログ分析ツール

[![Gonzo Mascot](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-mascot-smaller.png)](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-mascot-smaller.png)

Gonzoは、k9sにインスパイアされた強力なリアルタイムログ分析ターミナルUIです。ターミナルから直接、美しいチャート、AIによるインサイト、高度なフィルタリングを駆使してログストリームを分析できます。

### 動作デモ

[![Gonzo Walkthrough](https://github.com/control-theory/gonzo/raw/main/docs/gonzo_video_walkthrough.gif)](https://github.com/control-theory/gonzo/raw/main/docs/gonzo_video_walkthrough.gif)

### ダッシュボード

- **メインダッシュボード**:
  [![Gonzo Main Dashboard](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-main.png)](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-main.png)
- **統計情報**:
  [![Gonzo Stats](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-stats.png)](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-stats.png)
- **ヒートマップ**:
  [![Gonzo Heatmap](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-heatmap.png)](https://github.com/control-theory/gonzo/raw/main/docs/gonzo-heatmap.png)

### ✨ 主な特徴

#### 🎯 リアルタイム分析

- **ライブストリーミング**: stdin、ファイル、ネットワークからログをリアルタイムで処理
- **OTLPネイティブサポート**: OpenTelemetryログ形式を標準でサポート
- **書式自動検出**: JSON, logfmt, プレーンテキストを自動で検出
- **重要度追跡**: 色分けされた重要度レベルと分布チャート

#### 📈 インタラクティブなダッシュボード

- **k9s風レイアウト**: 使い慣れた2x2グリッドインターフェース
- **リアルタイムチャート**: 単語頻度、属性、重要度分布、時系列チャート
- **キーボード＋マウス操作**: Vimライクなショートカットとマウスクリック・スクロールをサポート
- **スマートログビューア**: インテリジェントな一時停止/再開機能付きオートスクロール

#### 🔍 高度なフィルタリング

- **正規表現サポート**: 正規表現でログをフィルタリング
- **属性検索**: 特定の属性値でログを検索
- **重要度フィルタリング**: エラーや警告など、特定のログレベルに焦点を当てる

#### 🤖 AIによるインサイト

- **パターン検出**: 繰り返し発生する問題を自動的に特定
- **異常分析**: ログの異常なパターンを発見
- **原因提案**: AIによるデバッグ支援
- **設定可能なモデル**: GPT-4, GPT-3.5, Ollama, LM Studioなど、OpenAI互換APIを持つ任意のモデルを選択可能
- **ローカルAIサポート**: ローカルモデルを使用してオフラインで実行可能

### 🚀 クイックスタート

#### インストール

- **Go**: `go install github.com/control-theory/gonzo/cmd/gonzo@latest`
- **Homebrew**: `brew tap control-theory/gonzo && brew install gonzo`
- **バイナリダウンロード**: [リリースベージ](https://github.com/control-theory/gonzo/releases)からダウンロード
- **Nix**: `nix run github:control-theory/gonzo`

### 📖 使い方

Gonzoはファイルや標準入力からログを読み込むことができます。

```bash
# ファイルからログを読み込む
gonzo -f application.log

# kubectlからログをストリーミング
kubectl logs -f deployment/my-app | gonzo

# AI分析を利用 (APIキーが必要)
export OPENAI_API_KEY=sk-your-key-here
gonzo -f application.log --ai-model="gpt-4"
```

### OTLPネットワークレシーバー

GonzoはgRPCとHTTPを介してOpenTelemetry Protocol (OTLP)で直接ログを受信できます。

```bash
# OTLPレシーバーとしてGonzoを起動
gonzo --otlp-enabled
```

### ⌨️ キーボードショートカット

#### ナビゲーション

| キー | アクション |
|---|---|
| `Tab` / `Shift+Tab` | パネル間の移動 |
| `↑`/`↓` or `k`/`j` | 上下に選択を移動 |
| `Enter` | ログ詳細の表示 / 分析モーダルを開く |
| `ESC` | モーダルを閉じる / キャンセル |

#### アクション

| キー | アクション |
|---|---|
| `Space` | ダッシュボード全体の一時停止/再開 |
| `/` | フィルターモードに入る |
| `s` | ログ内のテキストを検索・ハイライト |
| `f` | フルスクリーンログビューアを開く |
| `i` | AI分析 (詳細ビュー内) |
| `m` | AIモデルの切り替え |
| `?` / `h` | ヘルプの表示 |
| `q` / `Ctrl+C` | 終了 |

### 結論

Gonzoは、開発者がログデータをリアルタイムで効率的に分析・視覚化するための強力なツールです。特に、OpenTelemetryのネイティブサポートやAIを活用したインサイト機能は、複雑なシステムのデバッグや監視において大きな助けとなります。k9sライクな直感的なインターフェースも特徴で、ターミナルベースの作業を好むエンジニアにとって魅力的な選択肢と言えるでしょう。
