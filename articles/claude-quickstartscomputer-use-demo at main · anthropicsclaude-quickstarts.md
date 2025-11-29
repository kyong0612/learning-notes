---
title: "Anthropic Computer Use Demo"
source: "https://github.com/anthropics/claude-quickstarts/tree/main/computer-use-demo"
author:
  - "[[Anthropic]]"
published:
created: 2025-11-29
description: "ClaudeのComputer Use機能を使い始めるためのリファレンス実装。Dockerコンテナ、エージェントループ、Anthropic定義のツール、Streamlit UIを含む。Claude 4モデル（Claude Sonnet 4.5、Opus 4、Haiku 4.5など）に対応。"
tags:
  - "Claude"
  - "Computer-Use"
  - "AI"
  - "Anthropic"
  - "Docker"
  - "Python"
  - "Streamlit"
  - "AWS-Bedrock"
  - "Google-Vertex"
  - "Agent"
---

## 概要

このリポジトリは、Claudeの**Computer Use（コンピュータ使用）**機能を使い始めるためのリファレンス実装を提供します。

### 主な構成要素

- **Dockerコンテナ**: 必要なすべての依存関係を含むビルドファイル
- **エージェントループ**: Claude API、Bedrock、またはVertexを使用してClaude 3.5 Sonnet、Claude 3.7 Sonnet、Claude Sonnet 4、Claude Opus 4、Claude Haiku 4.5モデルにアクセス
- **Anthropic定義のコンピュータ使用ツール**
- **Streamlitアプリ**: エージェントループと対話するためのUI

---

## ⚠️ 重要な注意事項・セキュリティリスク

> **Computer Useはベータ機能です。** 標準的なAPI機能やチャットインターフェースとは異なる固有のリスクがあります。特にインターネットとの対話時にリスクが高まります。

### リスク軽減のための推奨事項

1. **専用の仮想マシンまたはコンテナを使用** - 最小限の権限で実行し、直接的なシステム攻撃や事故を防止
2. **機密データへのアクセスを避ける** - アカウントログイン情報などを与えない（情報漏洩防止）
3. **インターネットアクセスを許可リストに制限** - 悪意のあるコンテンツへの露出を減らす
4. **重要な決定は人間が確認** - 実世界に影響を与える決定、Cookie承認、金融取引、利用規約への同意など

### プロンプトインジェクションのリスク

Claudeは、ユーザーの指示と矛盾する場合でも、コンテンツ内に見つかったコマンドに従うことがあります。ウェブページの指示や画像内の指示が、ユーザー指示を上書きしたり、Claudeにミスをさせる可能性があります。

---

## 🚀 クイックスタート

### 対応モデル（2025年最新）

| モデル | モデルID |
|--------|----------|
| **Claude Sonnet 4.5**（デフォルト） | `claude-sonnet-4-5-20250929` |
| Claude Sonnet 4 | `claude-sonnet-4-20250514` |
| Claude Opus 4 | `claude-opus-4-20250514` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` |

> **更新情報**: 新しい `str_replace_based_edit_tool` が以前の `str_replace_editor` ツールを置き換えました。`undo_edit` コマンドは最新バージョンで削除されました。

### Claude API での実行

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

> **TIP**: APIキーは [Claude Console](https://console.anthropic.com/) で取得できます。

### AWS Bedrock での実行

#### オプション1: ホストのAWS認証ファイルを使用（推奨）

```bash
export AWS_PROFILE=<your_aws_profile>
docker run \
    -e API_PROVIDER=bedrock \
    -e AWS_PROFILE=$AWS_PROFILE \
    -e AWS_REGION=us-west-2 \
    -v $HOME/.aws:/home/computeruse/.aws \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```

#### オプション2: アクセスキーとシークレットを使用

```bash
export AWS_ACCESS_KEY_ID=%your_aws_access_key%
export AWS_SECRET_ACCESS_KEY=%your_aws_secret_access_key%
export AWS_SESSION_TOKEN=%your_aws_session_token%
docker run \
    -e API_PROVIDER=bedrock \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN \
    -e AWS_REGION=us-west-2 \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```

### Google Vertex での実行

```bash
docker build . -t computer-use-demo
gcloud auth application-default login
export VERTEX_REGION=%your_vertex_region%
export VERTEX_PROJECT_ID=%your_vertex_project_id%
docker run \
    -e API_PROVIDER=vertex \
    -e CLOUD_ML_REGION=$VERTEX_REGION \
    -e ANTHROPIC_VERTEX_PROJECT_ID=$VERTEX_PROJECT_ID \
    -v $HOME/.config/gcloud/application_default_credentials.json:/home/computeruse/.config/gcloud/application_default_credentials.json \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it computer-use-demo
```

---

## 🖥️ デモアプリへのアクセス

コンテナ実行後、以下のURLでアクセス可能：

| URL | 説明 |
|-----|------|
| `http://localhost:8080` | **統合インターフェース**（推奨）- エージェントチャット + デスクトップビュー |
| `http://localhost:8501` | Streamlitインターフェースのみ |
| `http://localhost:6080/vnc.html` | デスクトップビューのみ |
| `vnc://localhost:5900` | VNCクライアント用直接接続 |

> **設定の永続化**: コンテナは `~/.anthropic/` にAPIキーやカスタムシステムプロンプトなどの設定を保存します。このディレクトリをマウントすることで、コンテナ再起動間で設定を維持できます。

---

## 📐 画面サイズ設定

環境変数 `WIDTH` と `HEIGHT` で画面サイズを設定できます：

```bash
docker run \
    -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -e WIDTH=1920 \
    -e HEIGHT=1080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```

### 推奨解像度

**XGA解像度（1024x768）の使用を推奨**

| 状況 | 対応方法 |
|------|----------|
| 高解像度の場合 | 画像をXGAにスケールダウンし、座標を元の解像度に比例的にマッピング |
| 低解像度/モバイルデバイス | 1024x768に達するまで表示領域の周囲に黒いパディングを追加 |

> **警告**: XGA/WXGA以上の解像度でスクリーンショットを送信することは推奨されません。APIの画像リサイズに依存すると、モデル精度が低下し、パフォーマンスが遅くなります。

---

## 🛠️ 開発

```bash
./setup.sh  # venv設定、開発依存関係インストール、pre-commitフック設定
docker build . -t computer-use-demo:local  # Dockerイメージを手動ビルド（オプション）
export ANTHROPIC_API_KEY=%your_api_key%
docker run \
    -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
    -v $(pwd)/computer_use_demo:/home/computeruse/computer_use_demo/ \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it computer-use-demo:local
```

> **開発時の便利機能**: 上記のコマンドでリポジトリをDockerイメージ内にマウントし、ホストからファイルを編集可能。Streamlitは自動リロード設定済み。

---

## 📁 リポジトリ構造

```
computer-use-demo/
├── computer_use_demo/    # Pythonモジュール（エージェントループ、ツール定義）
├── image/                # Dockerイメージ関連
├── tests/                # テストコード
├── Dockerfile            # Dockerビルドファイル
├── setup.sh              # セットアップスクリプト
├── pyproject.toml        # Pythonプロジェクト設定
├── ruff.toml             # Ruff（リンター）設定
├── dev-requirements.txt  # 開発用依存関係
├── CONTRIBUTING.md       # コントリビューションガイド
└── LICENSE               # ライセンス
```

---

## 📝 制限事項

1. **ベータ機能**: APIは変更される可能性があります。[APIリリースノート](https://docs.claude.com/en/release-notes/api)を参照してください。
2. **コンポーネントの分離が弱い**: エージェントループは制御されるコンテナ内で実行され、一度に1セッションのみ使用可能。セッション間でリスタートまたはリセットが必要な場合があります。
3. **プロンプトインジェクション**: Claudeはウェブページや画像内の指示に従うことがあり、ユーザー指示と矛盾する可能性があります。

---

## 🔗 関連リンク

- [フィードバックフォーム](https://forms.gle/BT1hpBrqDPDUrCqo7) - モデルレスポンス、API、ドキュメントの品質についてのフィードバック
- [Claude Console](https://console.anthropic.com/) - APIキー取得
- [APIリリースノート](https://docs.claude.com/en/release-notes/api) - 最新情報
- [画像リサイズドキュメント](https://docs.claude.com/en/docs/build-with-claude/vision#evaluate-image-size) - Vision機能の詳細
