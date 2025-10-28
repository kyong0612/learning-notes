---
title: "RustのDockerfile、2025年はこれでいこう"
source: "https://syu-m-5151.hatenablog.com/entry/2025/10/17/070250"
author:
  - "nwiizo"
published: 2025-10-17
created: 2025-10-28
description: "RustのDockerビルドを5-10倍高速化し、イメージサイズを98-99%削減する2025年版の実践的ガイド。cargo-chef、BuildKitキャッシュマウント、distrolessイメージを活用したベストプラクティスと、実際の検証結果を詳しく解説。"
tags:
  - "Rust"
  - "Docker"
  - "DevOps"
  - "コンテナ"
  - "cargo-chef"
  - "BuildKit"
  - "distroless"
  - "マルチステージビルド"
---

## 概要

2025年現在、RustのDockerビルドは「遅い」「イメージが大きい」という課題を完全に克服しました。cargo-chefとBuildKitキャッシュマウントの組み合わせで**ビルド時間を5-10倍短縮**、**イメージサイズを98-99%削減**することが可能です。

実際の検証結果：

- **初回ビルド**: 10分
- **コード変更後の再ビルド**: わずか40秒
- **イメージサイズ**: 2.63GB → 50.3MB（distroless）または 1.71MB（musl+scratch）

## 2025年の重要なアップデート

### Rust 2024 Edition

- Rust 1.85.0でRust 2024 Editionが安定版に
- Docker環境でRust 1.85以降を使用することで新機能が利用可能

### Docker関連の進化

- **Docker Engine v28**: セキュリティ強化、AMD GPUサポート
- **docker init GA**: Rustプロジェクト用のDockerfile自動生成
- **Docker Bake GA**: 複雑なビルド設定の宣言的管理
- **BuildKit 0.25.1**: 新機能追加

## 基本的な考え方

### 必須の3原則

1. **マルチステージビルドは前提条件**
   - メンテナンス性の向上
   - ビルド速度のアップ
   - セキュリティの向上

2. **COPYは最小限に、--mountを活用**
   - マルチステージビルドでの成果物コピー
   - 最終ステージでのアプリケーションバイナリコピー
   - それ以外は `--mount=type=bind` を使用

3. **必ず記述すべきおまじない**

   ```dockerfile
   # syntax=docker/dockerfile:1
   ```

## 2025年の標準Dockerfile

cargo-chef、BuildKitキャッシュマウント、distrolessイメージ、非rootユーザー実行を組み合わせた標準パターン：

```dockerfile
# syntax=docker/dockerfile:1

ARG RUST_VERSION=1.85
ARG APP_NAME=myapp

FROM lukemathwalker/cargo-chef:latest-rust-${RUST_VERSION} AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,target=/app/target,sharing=locked \
    cargo build --release --bin ${APP_NAME} && \
    cp ./target/release/${APP_NAME} /bin/server

FROM gcr.io/distroless/cc-debian12:nonroot AS runtime
COPY --from=builder /bin/server /app/
WORKDIR /app
EXPOSE 8000
ENTRYPOINT ["/app/server"]
```

## ビルド最適化の3つの柱

### 1. cargo-chef

**依存関係のコンパイルとソースコードのコンパイルを完全に分離**するツール。

**動作メカニズム**：

1. `cargo chef prepare`: Cargo.tomlとCargo.lockを解析してrecipe.jsonを作成
2. `cargo chef cook`: 最小限のプロジェクト構造を再構築して依存関係のみをビルド

**パフォーマンス改善**：

- cargo-chefのみで55%の改善
- cargo-chef + sccacheで**79%の改善**（34秒→7秒）
- 商用プロジェクトで10分→2分

**重要**: 同じRustバージョンと作業ディレクトリを全ステージで使用すること

### 2. BuildKitキャッシュマウント

レイヤー無効化を超えて永続化するキャッシュボリュームを提供。

**3つの重要なキャッシュポイント**：

```dockerfile
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,target=/app/target,sharing=locked \
    cargo build --release
```

**パフォーマンスベンチマーク**：

- ベースライン: 90.60秒
- BuildKitキャッシュマウント: **15.63秒（5.8倍高速）**
- cargo-chef: 18.81秒（4.8倍高速）
- 三位一体（chef + BuildKit + sccache）: **7-12秒（7.5-13倍高速）**

### 3. sccache（オプション）

個々のコンパイル成果物を細粒度でキャッシュ。

**重要**:

- `CARGO_INCREMENTAL=0`は必須
- 効果は環境によって大きく異なる
- **自環境でのベンチマークが必須**

**キャッシュヒット率**：

- 初回ビルド: 0%
- ソースコード変更のみ: 85-95%
- 依存関係更新時: 60-75%

## イメージサイズの最適化

### ビルドステージ：rust:slim推奨

```dockerfile
FROM rust:1.85-slim-bookworm AS builder
```

**理由**：

- Debian stable（bookworm）ベースでglibcを使用
- 広範な互換性
- マルチスレッドワークロードでの優れたパフォーマンス

**rust:alpineは避ける**：マルチスレッドアプリケーションで最大30倍のパフォーマンス劣化

### 最終ステージ：distroless推奨

```dockerfile
FROM gcr.io/distroless/cc-debian12:nonroot
```

**distrolessの特徴**：

- サイズ: 21-29MB
- glibc、SSL証明書、タイムゾーンデータ、/etc/passwdを含む
- パッケージマネージャー、シェル不要なバイナリを完全排除
- SLSA 2準拠、cosign署名検証が可能
- CVEスキャンで従来イメージより**50-80%少ない脆弱性**
- `:nonroot`タグでUID 65534（nobody）として非rootで実行

### イメージサイズ比較（実測値）

| イメージ構成 | サイズ | 用途 | 特徴 |
|-------------|--------|------|------|
| **scratch + musl（実測）** | **1.71MB** | CLIツール最小化 | 完全静的リンク |
| distroless/static | 2-3MB | 静的リンクバイナリ | 最小限のファイル |
| **distroless/cc-debian12（実測）** | **50.3MB** | **Webアプリ推奨** | glibc |
| debian-slim | 80-120MB | フル互換性 | デバッグツールあり |
| rust:latest（未最適化） | 2.63GB | 開発専用 | ビルドツール込み |

**実測削減率**：

- rust:latest（2.63GB）→ distroless（50.3MB）: **98.1%削減**
- rust:latest（2.63GB）→ musl+scratch（1.71MB）: **99.9%削減**

### 静的リンク vs 動的リンク

**musl静的リンクの特徴**：

- 依存関係ゼロで完全にポータブル
- scratchコンテナで実行可能
- イメージサイズ5-10MB

**欠点**：

- **シングルスレッドで0.9-1.0倍、マルチスレッドで0.03-0.5倍のパフォーマンス**
- 一部依存関係でsegfaultのリスク

**本番環境の推奨**：

- 複雑なアプリケーション（Webサーバー、DB接続）: **glibc + distroless/cc-debian12**
- シンプルなCLIツール: musl + scratchを検討
- パフォーマンスが重要: **必ずglibcを使用**

## マルチアーキテクチャビルド

### cargo-zigbuild：セットアップゼロのクロスコンパイル

Zigツールチェインを使用してセットアップ不要でクロスコンパイル可能。

```dockerfile
FROM --platform=$BUILDPLATFORM rust:${RUST_VERSION}-alpine AS builder
```

**重要**: `--platform=$BUILDPLATFORM`を使うと、ビルド自体はネイティブアーキテクチャで実行できるため、QEMUエミュレーションより圧倒的に速い。

**実測データ**：

- ネイティブビルド: 2-3分
- QEMUエミュレーション: 50分（**16-25倍遅い**）
- cargo-zigbuildクロスコンパイル: 13分

## セキュリティベストプラクティス

### 1. 非rootユーザーで実行

**distroless `:nonroot`タグが最も簡単**：

```dockerfile
FROM gcr.io/distroless/cc-debian12:nonroot
```

自動的にUID 65534（nobody）として実行

### 2. 脆弱性スキャン

**Trivy（推奨）**:

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image myapp:latest
```

**distrolessのセキュリティ優位性**：

- AlpineからChiseled Ubuntuへの移行で30+ CVEが0 CVEに
- distrolessはAlpineより**50-80%少ないCVE**
- 攻撃ベクトル削減
- SLSA 2準拠、cosign署名認証

### 3. シークレット管理

**正しい方法**：

```dockerfile
RUN --mount=type=secret,id=api_token,env=API_TOKEN \
    cargo build --release
```

```bash
docker build --secret id=api_token,env=API_TOKEN .
```

### 4. イメージバージョンのピン留め

```dockerfile
# ✅ 推奨
FROM rust:1.85-slim-bookworm

# ❌ 避けるべき
FROM rust:latest
```

## ユースケース別Dockerfile

### Webアプリケーション（Axum / Actix-web）

上記の「標準Dockerfile」パターンをそのまま使用

### CLIツール（完全静的リンク）

musl + scratchでの最小サイズ実装

### ワークスペース（モノレポ）対応

`--build-arg SERVICE_NAME`で異なるサービスを同じDockerfileから生成

## 実践的な検証結果

実際のAxum Webアプリケーション（依存関係82個）での比較：

| 項目 | Naive (未最適化) | Baseline (distroless) | Ultra-minimal (musl) |
|------|------------------|----------------------|----------------------|
| **イメージサイズ** | **2.63GB** | **50.3MB** | **1.71MB** |
| **削減率** | - (100%) | **98.1%削減** | **99.9%削減** |
| **ビルド時間** | 30秒 | 38秒 | 46秒 |
| **マルチステージ** | ❌ なし | ✅ あり (4段階) | ✅ あり (2段階) |
| **セキュリティ** | ❌ 低 | ✅ 高 | ⚠️ 中 |

**パフォーマンスベンチマーク**：

- 商用プロジェクト（14,000行、500依存関係）: 10分 → **2分（5倍高速化）**
- 大規模ワークスペース（400 crate、1500依存関係）: 約65分 → **約2分（30倍以上の改善）**

## よくある問題と解決策

### OpenSSLリンクエラー

**解決策1: vendored OpenSSL（最も簡単）**

```toml
[dependencies]
openssl = { version = "0.10", features = ["vendored"] }
```

**解決策2: rustls（Rust-native TLS）**

```toml
[dependencies]
reqwest = { version = "0.11", features = ["rustls-tls"], default-features = false }
```

### .dockerignoreの重要性

`.dockerignore`がないと、`target/`ディレクトリ（数GB）がビルドコンテキストに含まれる：

```
# .dockerignore
target/
.git/
.env
*.log
```

**効果**: ビルドコンテキストのサイズを数GBから数MBに削減

### イメージサイズ肥大化

**プロファイル設定での最適化**：

```toml
[profile.release]
strip = true
lto = true
codegen-units = 1
```

## 2025年の新ツール活用

### docker init - プロジェクトの素早い立ち上げ

```bash
docker init
```

Rustを選択すると自動生成：

- Dockerfile
- compose.yaml
- .dockerignore
- README.Docker.md

### Docker Bake - 複雑なビルドの管理

**docker-bake.hcl**での宣言的なビルド設定管理：

```hcl
target "app" {
  platforms = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=registry,ref=myapp:cache"]
  cache-to = ["type=registry,ref=myapp:cache,mode=max"]
}
```

## 2025年のゴールデンルール

1. **`# syntax=docker/dockerfile:1`を必ず記述** - 最新のDockerfile構文を自動利用
2. **cargo-chefで依存関係を分離** - **5-10倍のビルド高速化**を実現
3. **BuildKitキャッシュマウントを活用** - レイヤーを超える**永続的なキャッシュ**
4. **distroless/cc-debian12:nonrootを使用** - **50MB、非root、高セキュリティ**
5. **rust:slim-bookwormでビルド** - **Alpineは避ける**（マルチスレッド性能問題）
6. **`RUN --mount=type=bind`でソースコードをマウント** - COPYの最小化
7. **マルチステージビルドは必須** - 2025年の前提条件
8. **非rootユーザーで実行** - セキュリティの基本原則
9. **TrivyまたはGrypeでスキャン** - 継続的なセキュリティ検証
10. **イメージバージョンをピン留め** - **`:latest`は避ける**

## まとめ

大半の本番ワークロードには、**glibc + distroless/cc-debian12 + cargo-chefの組み合わせが最適解**です。この構成により実現できるもの：

- **50MBの小サイズ**
- **2分の高速ビルド**
- **フルパフォーマンス**
- **優れたセキュリティプロファイル**

2025年のRust Dockerは、従来の課題を**完全に克服**しました。**高速、小サイズ、セキュア、マルチアーキテクチャ対応**の成熟した技術スタックとなっています。
