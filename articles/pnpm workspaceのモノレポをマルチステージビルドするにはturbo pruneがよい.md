---
title: "pnpm workspaceのモノレポをマルチステージビルドするにはturbo pruneがよい"
source: "https://zenn.dev/xbit/articles/da5221e30544d1"
author:
  - "Eiryyy"
  - "クロスビットテックブログ"
published: 2025-10-27
created: 2025-12-14
description: "pnpm workspaceのモノレポをDockerでマルチステージビルドする際、pnpm deployの代わりにturbo pruneを使用することで、開発体験を損なわずに効率的なビルドを実現する方法を解説した記事。"
tags:
  - "clippings"
  - "Docker"
  - "TypeScript"
  - "pnpm"
  - "Turborepo"
  - "monorepo"
---

## 概要

pnpm workspaceのモノレポをDockerでマルチステージビルドする際、公式推奨の`pnpm deploy`には開発体験を損なう問題がある。本記事では、Turborepoの`turbo prune`を使用することで、開発体験をキープしたままマルチステージビルドを実現する方法を解説する。

## 課題: `pnpm deploy`の問題点

pnpm workspaceのモノレポをDockerでマルチステージビルドするには、[公式ドキュメント](https://pnpm.io/docker#example-2-build-multiple-docker-images-in-a-monorepo)で`pnpm deploy`が紹介されている。

しかし、`pnpm deploy`を使用するには**`injectWorkspacePackages: true`が必須**となっており、これが開発体験に悪影響を与える。

### `injectWorkspacePackages`の問題

`injectWorkspacePackages: true`を有効にすると、以下の問題が発生する：

| 問題点 | 詳細 |
|--------|------|
| `node_modules`へのコピー | `pnpm install`時にworkspace内のパッケージが`node_modules`にコピーされる |
| コードジャンプの不具合 | VSCodeでのコードジャンプが`node_modules`内に向いてしまう |
| 変更の即時反映ができない | 開発時はパッケージのsrcディレクトリのtsファイルを参照し、編集が即座に反映されて欲しい |

**開発体験を維持するためには、`injectWorkspacePackages: false`を保ったまま、マルチステージビルドを解決する必要がある。**

## 解決策: `turbo prune`

Turborepoの[prune](https://turborepo.com/docs/reference/prune)を使用することで上記の課題を解決できる。

### `turbo prune`の仕組み

- **依存関係にあるファイルを抜き出し、部分的なモノレポを構築**
- `turbo prune`で部分的なモノレポを作成後、`turbo.json`に従って`turbo build`を実行
- これにより`pnpm deploy`を回避できる

### ディレクトリ構造の例

```
.
├── apps
│   ├── app1
│   └── app2
├── packages
│   └── utils
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

### Dockerfileの実装例

```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS base-builder
WORKDIR /app
COPY . .
RUN pnpm install -g turbo

FROM base-builder AS app1-builder
RUN turbo prune app1 --docker

FROM base-builder AS app2-builder
RUN turbo prune app2 --docker

FROM base AS app1-installer
WORKDIR /app
COPY --from=app1-builder /app/out/json/ .
COPY --from=app1-builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=app1-builder /app/out/full/ .
# ルートにtsconfig.jsonがある場合
COPY --from=app1-builder /app/tsconfig.json ./tsconfig.json
# npm scriptsにbuild: turbo build と定義しておくと良い
RUN pnpm build

FROM base AS app2-installer
WORKDIR /app
COPY --from=app2-builder /app/out/json/ .
COPY --from=app2-builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=app2-builder /app/out/full/ .
COPY --from=app2-builder /app/tsconfig.json ./tsconfig.json
RUN pnpm build

FROM base AS app1
WORKDIR /app
COPY --from=app1-installer /app/ .
WORKDIR /app/apps/app1
EXPOSE 8000
CMD ["pnpm", "start"]

FROM base AS app2
WORKDIR /app
COPY --from=app2-installer /app/ .
WORKDIR /app/apps/app2
EXPOSE 8001
CMD ["pnpm", "start"]
```

### ビルドステージの解説

| ステージ | 役割 |
|----------|------|
| `base` | Node.js環境とpnpmのセットアップ |
| `base-builder` | ソースコードをコピーし、turboをインストール |
| `app1-builder` / `app2-builder` | `turbo prune`で各アプリの部分的なモノレポを構築 |
| `app1-installer` / `app2-installer` | 依存関係をインストールしてビルドを実行 |
| `app1` / `app2` | 最終的な実行用イメージ |

### `turbo prune --docker`の出力

`turbo prune`を`--docker`フラグ付きで実行すると、以下の構造で出力される：

- `/app/out/json/` - package.jsonファイル群
- `/app/out/pnpm-lock.yaml` - ロックファイル
- `/app/out/full/` - 完全なソースコード

## 結論

| 項目 | `pnpm deploy` | `turbo prune` |
|------|---------------|---------------|
| `injectWorkspacePackages` | `true`が必須 | 不要 |
| 開発体験 | 悪影響あり | 維持できる |
| VSCodeコードジャンプ | `node_modules`に向く | srcディレクトリを参照 |
| パッケージ変更の反映 | 遅延あり | 即時反映 |

**`injectWorkspacePackages`を無効にして開発体験をキープしたまま、適切なマルチステージビルドが可能になった。pnpm workspaceを使う場合はTurborepoの併用を検討すべきである。**

## 参考リンク

- [pnpm Docker公式ドキュメント](https://pnpm.io/docker#example-2-build-multiple-docker-images-in-a-monorepo)
- [Turborepo prune リファレンス](https://turborepo.com/docs/reference/prune)
- [Turborepo Docker ガイド](https://turborepo.com/docs/guides/tools/docker)
