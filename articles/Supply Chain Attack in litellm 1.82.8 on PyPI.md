---
title: "Supply Chain Attack in litellm 1.82.8 on PyPI"
source: "https://futuresearch.ai/blog/litellm-pypi-supply-chain-attack/"
author:
  - "[[FutureSearch]]"
published: 2026-03-24
created: 2026-03-26
description: "litellm version 1.82.7/1.82.8 on PyPI に悪意ある .pth ファイルが仕込まれ、Python起動のたびにSSH鍵・クラウド認証情報・シークレットを窃取し、Kubernetesクラスタ内での横展開を試みるサプライチェーン攻撃。FutureSearchがPyPIに報告し、46分でパッケージが隔離されたが、その間に約47,000回ダウンロードされた。"
tags:
  - "clippings"
  - "security"
  - "supply-chain-attack"
  - "python"
  - "pypi"
  - "litellm"
  - "malware"
  - "kubernetes"
---

## 概要

2026年3月24日 10:52 UTC、[litellm](https://github.com/BerriAI/litellm) の悪意あるバージョン 1.82.8 が PyPI に公開された。GitHubリポジトリに対応するタグやリリースは存在せず、PyPIに直接アップロードされた（メンテナーアカウントの侵害による）。悪意あるバージョンは **1.82.7 と 1.82.8 の2つ**あり、それぞれ異なる攻撃手法・C2サーバーを使用している。

FutureSearch が Cursor 内の MCP プラグインの推移的依存関係として取り込まれた際に発見。マルウェアのバグ（フォーク爆弾）がマシンをクラッシュさせたことで攻撃が可視化された。PyPI は報告から **46分で両バージョンを隔離**したが、その間に **46,996回ダウンロード**された。

## タイムライン

| 時刻 (UTC, 3月24日) | イベント |
|---|---|
| 10:39 | litellm 1.82.7 公開 — `proxy_server.py` にペイロード、`checkmarx[.]zone/raw` へ送信 |
| 10:52 | litellm 1.82.8 公開 — `.pth` ファイル、`models[.]litellm[.]cloud` へ送信 |
| 11:25 | PyPI が両バージョンを隔離 |
| 12:30 | 1.82.7 も侵害されていることが確認 |
| 13:03 | GitHub issue [#24512](https://github.com/BerriAI/litellm/issues/24512) がオーナーにより「not planned」でクローズ、大量のボットがスパム |
| 20:15 | 侵害バージョンが yanked、PyPI 隔離解除、メンテナーが[対応開始](https://github.com/BerriAI/litellm/issues/24518) |

## 2つの異なる攻撃

### 1.82.8（.pth ファイル攻撃）

- **攻撃手法**: `litellm_init.pth` を site-packages に配置。Python の `.pth` ファイルはインタプリタ起動のたびに自動実行されるため、**`pip install` 自体が実行のトリガー**となる
- **C2サーバー**: `models[.]litellm[.]cloud`（正規の litellm インフラではない）
- **バグ**: `.pth` が子プロセスを `subprocess.Popen` で生成 → 子プロセスでも `.pth` が発火 → 指数的フォーク爆弾が発生しマシンがクラッシュ（これにより攻撃が発覚）

### 1.82.7（proxy_server.py インジェクション）

- **攻撃手法**: `proxy_server.py` にペイロードを挿入、二次スクリプト `p.py` をドロップ。`litellm.proxy` がインポートされた場合のみ発動するため、**プロキシサーバーデプロイメントが主なターゲット**
- **C2サーバー**: `checkmarx[.]zone/raw`（正規の Checkmarx セキュリティベンダーのタイポスクワット）

## マルウェアの動作（3段階）

### Stage 1: 収集（Collection）

ホストから以下の機密ファイルを収集:

- SSH秘密鍵・設定ファイル
- `.env` ファイル
- AWS / GCP / Azure 認証情報
- Kubernetes 設定ファイル
- データベースパスワード
- `.gitconfig`、シェル履歴
- 暗号通貨ウォレットファイル
- 環境変数のダンプ
- クラウドメタデータエンドポイント（IMDS、コンテナ認証情報）への問い合わせ

### Stage 2: 送出（Exfiltration）

- ハードコードされた **4096ビット RSA 公開鍵**で暗号化
- **AES-256-CBC**（ランダムセッションキー、RSA鍵で暗号化）
- tar アーカイブにバンドルし、C2サーバーへ POST

### Stage 3: 横展開と永続化（Lateral Movement & Persistence）

- Kubernetes サービスアカウントトークンが存在する場合:
  - 全ネームスペースの全クラスターシークレットを読み取り
  - `kube-system` の全ノードに特権付き `alpine:latest` Pod を作成
  - ホストファイルシステムをマウントし、`/root/.config/sysmon/sysmon.py` に永続バックドアをインストール（systemd ユーザーサービス付き）
- ローカルマシンでも `~/.config/sysmon/sysmon.py` で同様の永続化を試行

## 影響範囲

### ダウンロード数

- 46分間で **46,996回**ダウンロード
- 1.82.8 は安全なバージョンの **6倍**ダウンロードされた
- pip 経由の 1.82.8 インストール **23,142件**すべてでペイロードが実行された
- pip はデフォルトで最新バージョンを取得するため被害が拡大、uv はロックファイルにより安全なケースが多い

### 影響を受けたパッケージ

PyPI 上で litellm に依存するパッケージ: **2,337個**

| カテゴリ | 件数 | 割合 | 状態 |
|---|---|---|---|
| 制約なし (`litellm`) | 283 | 12% | 露出 |
| 下限のみ (`>=X`) | 1,388 | 59% | 露出 |
| 上限あり、1.82.x 含む | 383 | 16% | 露出 |
| 上限あり、1.82.x 除外 | 74 | 3% | 安全 |
| 安全なバージョンにピン留め (`==X.Y.Z`) | 209 | 9% | 安全 |

**88%** のパッケージが攻撃ウィンドウ中に侵害バージョンを解決した可能性がある。

### リスクにさらされた3つのカテゴリ

1. **直接インストール**: 46分間に `pip install litellm` を実行した開発者・CI/CDパイプライン・Dockerビルド
2. **litellm をピン留めなしで依存するライブラリ**: ユーザーがそのライブラリをインストールすると litellm が最新版に解決される → 被害が掛け算的に拡大
3. **litellm をピン留めなしで依存するアプリケーション**: 直接インストール時のみリスク

## 対応手順

### 1. 影響確認

```bash
# litellm のバージョン確認
pip show litellm

# キャッシュ内の悪意あるファイルを検索
find ~/.cache/uv -name "litellm_init.pth" 2>/dev/null
find ~/.cache/pip -name "litellm_init.pth" 2>/dev/null
```

### 2. 削除とキャッシュパージ

```bash
rm -rf ~/.cache/uv
pip cache purge
```

### 3. 永続化の確認

```bash
# ローカルの永続化チェック
ls -la ~/.config/sysmon/sysmon.py 2>/dev/null
ls -la ~/.config/systemd/user/sysmon.service 2>/dev/null

# Kubernetes の不正Pod確認
kubectl get pods -n kube-system | grep node-setup
```

### 4. 認証情報のローテーション

影響を受けたマシン上のすべての認証情報が侵害されたと仮定して対応:
- SSH鍵
- クラウドプロバイダー認証情報（GCP ADC, AWS アクセスキー, Azure トークン）
- Kubernetes 設定
- `.env` ファイル内の APIキー
- データベースパスワード

### チェッカーツール

FutureSearch が[インタラクティブチェッカー](https://futuresearch.ai/tools/litellm-checker)を公開。PyPI パッケージ名を入力すると litellm 依存の有無と露出状況を確認できる。

## .pth ファイルという攻撃ベクトル

Python の `site-packages` に配置された `*.pth` ファイルは、**すべてのインタプリタ起動時に**実行可能な Python コードを1行含むことができる。インポート前、ユーザーコード前、すべてに先行して実行される。`pip install` 自体が Python インタプリタを起動するため、インストール行為そのものが攻撃のトリガーとなる。

## より広範なキャンペーンとの関連

- Snyk の報告「[Poisoned Security Scanner Backdooring LiteLLM](https://snyk.io/articles/poisoned-security-scanner-backdooring-litellm/)」: 悪意ある Checkmarx セキュリティスキャナーが litellm をバックドア化した手法を追跡
- 1.82.7 の送出ドメイン `checkmarx[.]zone` は正規の Checkmarx のタイポスクワット
- Rami McCarthy の[分析](https://ramimac.me/teampcp/): GitHub issue をスパムしたボットアカウントと、過去の Trivy 脆弱性開示を抑圧したボットネットに **76% のアカウント重複**を発見 → 同一ネットワークによる組織的攻撃

## 教訓と防御策

### バージョンピン留めとロックファイル

- `==X.Y.Z` でのピン留めや `<1.82` の上限指定は攻撃を防いだ
- **ロックファイル**（`uv.lock`, `poetry.lock`, `pip-compile` 出力）は、攻撃ウィンドウ前に生成されていれば安全
- ただしロックファイルはビルドを保護するが、ライブラリの利用者は保護しない

### Trusted Publishers

PyPI の [Trusted Publishers](https://docs.pypi.org/trusted-publishers/) を使えば、パッケージアップロードを特定の CI ワークフローに紐付けられる。攻撃者は PyPI API トークンだけでなく GitHub Actions ワークフローも侵害する必要がある。[Sigstore attestations](https://blog.pypi.org/posts/2024-11-14-pypi-now-supports-digital-attestations/) はソースコミットから公開アーティファクトまでの暗号学的チェーンを提供する。**すべてのパッケージメンテナーが有効化すべき**。

## 発見の経緯

FutureSearch が自社プロダクト [futuresearch.ai/app](https://futuresearch.ai/app) の開発中に発見。litellm を複数のモデルプロバイダー統合に使用していた。MCP プラグインの推移的依存関係として取り込まれた際、マルウェアのフォーク爆弾バグでマシンがクラッシュしたことで問題が顕在化。Claude Code を使って根本原因を特定。FutureSearch のユーザーデータの漏洩はなかった。

## 参考リンク

- [元の開示記事](https://futuresearch.ai/blog/litellm-pypi-supply-chain-attack/)
- [フォローアップ分析（47,000ダウンロードの詳細）](https://futuresearch.ai/blog/litellm-hack-were-you-one-of-the-47000)
- [インタラクティブチェッカーツール](https://futuresearch.ai/tools/litellm-checker)
- [GitHub Issue #24512](https://github.com/BerriAI/litellm/issues/24512)
- [GitHub Issue #24518（対応）](https://github.com/BerriAI/litellm/issues/24518)