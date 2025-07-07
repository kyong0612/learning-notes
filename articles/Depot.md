---
title: "Depot"
source: "https://depot.dev/"
author: []
published:
created: 2025-07-07
description: |
  Accelerate your Docker image builds and GitHub Actions workflows. Easily integrate with your existing CI provider and dev workflows to save hours of build time.
tags:
  - "Docker"
  - "CI/CD"
  - "GitHub Actions"
  - "Build Optimization"
  - "Cloud-native"
---

# Depot: Build faster. Waste less time

Depotは、DockerイメージのビルドとGitHub Actionsのワークフローを高速化するためのプラットフォームです。既存のCIプロバイダーや開発ワークフローと簡単に統合でき、ビルド時間を大幅に削減します。

[Start a free trial](/sign-up) | [Talk to a human](https://cal.com/john-depot/30min) | [Developer Docs](/docs)

![App Screenshot](/images/app-screenshot.webp)

## The Depot Platform

高度なソフトウェア、強力なコンピューティング、そしてグローバルに分散されたキャッシュを組み合わせてビルドを高速化します。

### Remote container builds

`docker build`を`depot build`に置き換えるだけで、IntelおよびArmイメージのネイティブサポートと自動レイヤーキャッシュを利用できます。

- `docker build .`

+ `depot build .`

```
--tag depot/app:latest
--target app
--file docker/Dockerfile
--build-arg COMMIT=6fc3900f
--platform linux/arm64,linux/amd64
--progress plain
--ssh default
--push
```

詳細は[こちら](/products/container-builds)

### GitHub Actions runners

AWSでホストされ、GitHubホストランナーと比較して30%高速なCPU、10倍高速なネットワークとキャッシュスループットを、半分のコストで提供します。

詳細は[こちら](/products/github-actions)

### Depot Cache

Bazel, Go, Gradle, Turborepo, sccache, Pantsなどのための分散リモートキャッシュを提供。CIプロバイダーを問わず、チーム全体でキャッシュを共有できます。

```
export SCCACHE_WEBDAV_ENDPOINT=https://cache.depot.dev
export SCCACHE_WEBDAV_TOKEN=<token>
export RUSTC_WRAPPER=sccache
$ cargo build --release
```

詳細は[こちら](/products/cache)

### Build API for Platforms

顧客向けのコンテナイメージを、安全で分離された環境でプログラムを通じてビルドするためのAPI（gRPC, Connect, HTTP/JSON）を提供します。

詳細は[こちら](/docs/container-builds/reference/api-overview)

## Live Benchmarks: Unrivaled Performance

先週だけで59,120時間以上のビルド時間を節約しました。

| Repository          | Speed Increase | With Depot | Without Depot |
| ------------------- | -------------- | ---------- | ------------- |
| PostHog/posthog     | 46x faster     | 2m 46s     | 126m 15s      |
| mastodon/mastodon   | 14x faster     | 2m 50s     | 39m 27s       |
| grpc/grpc           | 5.9x faster    | 4m 2s      | 23m 58s       |
| apache/kafka        | 1.7x faster    | 7m 10s     | 11m 57s       |
| Netflix/dispatch    | 1.6x faster    | 2m 49s     | 4m 34s        |
| zed-industries/zed  | 1.4x faster    | 24m 17s    | 33m 28s       |

## Integrations

Depotは、既存のCIプロバイダーからInfrastructure-as-Code、コンピューティングプラットフォームまで、お気に入りのツールやサービスと連携して使用できます。

[Browse the directory](/integrations)

## Customer Testimonials

多くの開発者から、ビルド時間が10倍以上高速化したとの声が寄せられています。

- **jack (@jackw_xyz):** "insane 16s build and push thanks to caching"
- **nacho (@ignacioaal):** "got my build & push from 30 mins to 4 and it will be about 12 seconds when cached"
- **Dan Loewenherz (@dwlz):** "our Docker image build times have literally been cut in half"
- **Matthieu Napoli (@matthieunapoli):** "10 to 20 times faster builds!"

---

[Depot Website](/) | [Pricing](/pricing) | [Documentation](/docs) | [About](/about) | [Blog](/blog)
