---
title: "新時代のフロントエンドツールチェイン Vite+ を試してみた"
source: "https://azukiazusa.dev/blog/try-vite-plus/"
author:
  - "azukiazusa1"
published: 2026-03-13
created: 2026-03-25
description: "Vite+ は VoidZero 社が開発した統合フロントエンドツールチェイン。Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown を1つの CLI（vp）に統合し、開発・テスト・ビルド・リント・フォーマット・Node.js バージョン管理までを一元化する。この記事ではインストールからプロジェクトセットアップ、各機能の実践的な使い方までをハンズオン形式で解説する。"
tags:
  - "clippings"
  - "Vite"
  - "frontend-toolchain"
  - "Rolldown"
  - "Oxlint"
  - "VoidZero"
---

## 背景と課題

近年のフロントエンド開発では、モジュールバンドラー・トランスパイラー・リンター・テストランナーなど多数のツールが必要になり、`.eslintrc`, `.prettierrc`, `jest.config.js`, `tsconfig.json` など設定ファイルが肥大化する問題がある。この複雑さを解消するため、[VoidZero](https://voidzero.dev/) 社が **[Vite+](https://viteplus.dev/)** を開発した。

## Vite+ の概要

Vite+ は以下のツールを **1つのツールチェイン** に統合する：

| ツール | 役割 |
|--------|------|
| **Vite** | 開発サーバー |
| **Vitest** | テストランナー |
| **Oxlint** | 高速リンター |
| **Oxfmt** | 高速フォーマッター |
| **Rolldown** | Rust 製バンドラー |
| **tsdown** | TypeScript ライブラリビルダー |
| **Vite Task** | タスクランナー |

さらに **Node.js のランタイムやパッケージマネージャーも Vite+ が管理**し、プロジェクトごとの環境切り替えを容易にする。

## インストールとプロジェクトセットアップ

### インストール

グローバル CLI ツール `vp` を提供：

```bash
# macOS/Linux
curl -fsSL https://vite.plus | bash
# Windows (PowerShell)
irm https://vite.plus/ps1 | iex
```

インストール時に Node.js バージョン管理を `vp` に委任するか対話形式で選択できる。インストール後 `source ~/.zshrc` でシェルをリロード。

### プロジェクト作成

`vp create` で対話形式のセットアップが可能。3 種類のテンプレートが用意されている：

- **Vite+ Monorepo** — モノレポプロジェクト
- **Vite+ Application** — アプリケーション
- **Vite+ Library** — ライブラリ

![プロジェクトセットアップ画面](https://images.ctfassets.net/in6v9lxmm5c8/22wX9wosPDQYRQy854TyL9/1bed9429c13a0c7f344598aad1fee488/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-13_20.08.55.png?q=50&fm=webp&w=1200)

### 依存関係のインストール

`vp install` はパッケージマネージャーを自動検出して適切なコマンドを実行する。検出優先順位：

1. `package.json` の `packageManager` フィールド
2. `pnpm-workspace.yaml` → `pnpm-lock.yaml` → `yarn.lock` / `.yarnrc.yml` → `package-lock.json` の順
3. どれも見つからない場合は **pnpm にフォールバック**

### 開発サーバー

```bash
vp dev
```

`dev`, `build`, `test`, `lint`, `format` などの一般的なタスクがあらかじめ定義されている。

![Vite+ Application デモページ](https://images.ctfassets.net/in6v9lxmm5c8/33NcsltB9TADguYoyRs7sn/8d3c135e978534a1b57dd4175359d6f9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-13_20.21.18.png?q=50&fm=webp&w=1200)

## Node.js バージョン管理

`vp env` コマンド群でグローバル／プロジェクト単位の Node.js バージョンを管理：

| コマンド | 機能 |
|----------|------|
| `vp env on` / `vp env off` | マネージドモードの有効化/無効化 |
| `vp env pin <version>` | `.node-version` ファイルを作成しバージョン固定 |
| `vp env install` | `.node-version` の指定バージョンをインストール |
| `vp env current` | 現在使用中のバージョンを表示 |

マネージドモードでは `node`, `npm` コマンドが Vite+ の shims 経由で解決され、プロジェクトに適したバージョンが自動使用される。バージョンは `~/.vite-plus/js_runtime/node` にインストールされる。

## フォーマット・リンティング・型チェック

`vp check` で **oxfmt（フォーマット）+ oxlint（リント）+ tsgolint（型チェック）** を一括実行。単一コマンドへの統合により個別実行よりも高速。

設定はすべて `vite.config.ts` に集約：

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: {
      "no-alert": "error",
    },
  },
  fmt: {
    printWidth: 120,
  },
});
```

> **推奨**: `typeCheck: true` を有効にすると `tsgolint` による型チェックもリントの一部として実行される。型チェック用の別コマンドが不要になる。

## テストの実行

`vp test` で Vitest によるテストを実行。

```bash
vp test          # 通常実行（watch モードではない）
vp test watch    # watch モードで実行
```

> **注意**: Vitest 単体と異なり、`vp test` はデフォルトで watch モードで実行**されない**。

設定例：

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    maxWorkers: 4,
  },
});
```

## タスク定義

`vp run` で `package.json` の `scripts` または `vite.config.ts` の `run.tasks` に定義されたタスクを実行。

### `run.tasks` と `scripts` の違い

| | `package.json` scripts | `vite.config.ts` run.tasks |
|---|---|---|
| キャッシュ | デフォルト無効 | **デフォルト有効** |
| 依存関係指定 | 不可 | `dependsOn` で指定可能 |
| 環境変数指定 | 不可 | `env` で指定可能 |

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "./build.sh",
        dependsOn: ["lint"],
        env: ["NODE_ENV"],
      },
      deploy: {
        command: "./deploy.sh",
        dependsOn: ["build"],
        cache: false,
      },
    },
  },
});
```

`vpx` コマンドは `npx` / `pnpx` 相当で、npm パッケージを未インストールのまま実行できる。

## ビルド

### アプリケーションビルド

`vp build` — Vite 8 + Rolldown でプロジェクトをビルド。`vp preview` でローカルプレビュー。

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    outDir: "dist",
  },
});
```

### ライブラリビルド

`vp pack` — tsdown を使用。型定義ファイル生成や CJS/ESM 両形式の出力をサポート。

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: true,
    formats: ["cjs", "esm"],
    sourceMap: true,
  },
});
```

## 既存プロジェクトへの移行

`vp migrate` コマンドで既存 Vite プロジェクトを Vite+ に移行可能。

> **前提条件**: Vite 8 以降 + Vitest 4.1 以降が必要。

## 主要コマンド一覧

| コマンド | 機能 |
|----------|------|
| `vp create` | プロジェクト作成 |
| `vp install` | 依存関係インストール（パッケージマネージャー自動検出） |
| `vp dev` | 開発サーバー起動 |
| `vp build` | アプリケーションビルド |
| `vp pack` | ライブラリビルド（tsdown） |
| `vp test` / `vp test watch` | テスト実行 |
| `vp check` | フォーマット + リント + 型チェック一括実行 |
| `vp preview` | ビルド成果物のプレビュー |
| `vp env pin <ver>` | Node.js バージョン固定 |
| `vp migrate` | 既存 Vite プロジェクトからの移行 |
| `vpx <pkg>` | npx 相当のパッケージ実行 |

## まとめ

- **Vite+** は Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown を統合し、フロントエンド開発の全工程を **1つのツールチェインと `vite.config.ts` 1ファイル** で管理できる
- Node.js のランタイムやパッケージマネージャーも管理し、**プロジェクトごとの環境切り替えが容易**
- `vp` コマンドでセットアップから開発・テスト・ビルドまでの一連の流れを簡単に実行可能
- 既存 Vite プロジェクトからは `vp migrate` で移行できる（Vite 8 + Vitest 4.1 以降が必要）

## 参考

- [Announcing Vite+ Alpha | VoidZero](https://voidzero.dev/posts/announcing-vite-plus-alpha)
- [Vite+ | The Unified Toolchain for the Web](https://viteplus.dev/)
- [voidzero-dev/vite-plus (GitHub)](https://github.com/voidzero-dev/vite-plus)
- [voidzero-dev/vite-task (GitHub)](https://github.com/voidzero-dev/vite-task)
