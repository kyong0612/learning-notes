---
title: "Oxfmt Beta"
source: "https://oxc.rs/blog/2026-02-24-oxfmt-beta"
author:
  - "[[Boshen]]"
  - "[[Dunqing]]"
  - "[[Yuji Sugiura]]"
published: 2026-02-24
created: 2026-02-25
description: "Rust製のPrettier互換コードフォーマッター Oxfmt がベータリリース。Prettierの30倍以上、Biomeの3倍以上高速で、JS/TS/JSON/CSS/HTML/Markdownなど幅広いファイル形式に対応。Tailwind CSSクラスソートやimportソートも内蔵。"
tags:
  - "clippings"
  - "javascript"
  - "rust"
  - "formatter"
  - "oxc"
  - "prettier"
  - "developer-tools"
---

## 概要

**Oxfmt** は、Rust で構築された Prettier 互換のコードフォーマッターで、JavaScript エコシステム向けに設計されている。ベータリリースが 2026年2月24日に発表された。

**パフォーマンス**: キャッシュなしの初回実行で **Prettier の 30倍以上**、**Biome の 3倍以上** 高速。[ベンチマーク結果](https://github.com/oxc-project/bench-formatter)が公開されている。

2025年12月のアルファリリース以降、追加ファイル形式のサポート、埋め込み言語のフォーマット、importソート、Tailwind CSS統合、多数の安定性・互換性改善が行われた。

**採用プロジェクト**: [vuejs/core](https://github.com/vuejs/core)、[vercel/turborepo](https://github.com/vercel/turborepo)、[huggingface/huggingface.js](https://github.com/huggingface/huggingface.js)、[getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript) など多数。

## Getting Started

```sh
pnpm add -D oxfmt
```

`package.json` にスクリプトを追加:

```json
{
  "scripts": {
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check"
  }
}
```

### Prettier からの移行

ワンコマンドで移行可能:

```sh
pnpm add -D oxfmt && pnpm oxfmt --migrate prettier && pnpm oxfmt
```

AI コーディングアシスタント向けの移行プロンプトも提供されており、CI ワークフロー、lint-staged、エディタ設定、CONTRIBUTING.md/AGENTS.md の更新まで含む手順が示されている。

## アルファ以降の主な新機能

### 100% Prettier 互換性

Prettier の JavaScript / TypeScript conformance テストに **100% 合格**。残りのわずかなフォーマット差異は Prettier チームと協力して解消中。Prettier からの移行時にコードが同一にフォーマットされることを保証する。

### 対応ファイル形式

JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Angular, Vue, CSS, SCSS, Less, Markdown, MDX, GraphQL, Ember, Handlebars — **単一のフォーマッターでプロジェクト全体をカバー可能**。

### Tailwind CSS 統合

JS/TS および非 JS/TS ファイルの両方で Tailwind CSS クラスの自動ソートに対応。`prettier-plugin-tailwindcss` プラグインが不要になった（機能が内蔵）。

### Import ソート

ビルトインの import ソートが利用可能。設定オプション:

- `customGroups` — カスタムグルーピングルール
- `groups` — カスタムソート順グループ
- `newlinesBetween` — import グループ間の空行制御
- `sortSideEffects` — 副作用 import のソート
- `ignoreCase` — 大文字小文字を無視

### package.json ソート

`package.json` フィールドの自動ソートがデフォルトで有効。

### 埋め込み言語フォーマット

テンプレートリテラル内のコードをフォーマット:

- Angular `@Component` の template と styles
- CSS-in-JS（styled-components 系構文、`styled-jsx`、CSS prop）

### Node.js API

プログラマティック API が利用可能:

```ts
import { format, type FormatOptions } from "oxfmt";

const input = `let a=42;`;
const options: FormatOptions = { semi: false };
const { code } = await format("a.js", input, options);
console.log(code); // "let a = 42"
```

### CLI の変更点

- Glob パターン展開: `oxfmt './packages/**/*.{js,jsx}'`
- `--stdin-filepath` — stdin 入力のファイルパス指定
- `--migrate biome` — Biome 設定からの移行
- `--migrate prettier` — Prettier 設定からの移行
- `--init` — 新しい設定ファイルのブートストラップ

### 設定の変更点

- `.editorconfig` の `insert_final_newline` サポート
- `insertFinalNewline` — 末尾改行の制御
- `overrides` — 特定のファイルパターンに異なるオプションを適用

### エディタサポート

VS Code, Cursor, Zed, IntelliJ IDEA, WebStorm, Neovim、および LSP 対応の任意のエディタで動作。

## ロードマップ

安定版リリースに向けた今後の改善:

- パフォーマンス最適化
- 安定性向上
- xxx-in-js フォーマットの改善
- Prettier プラグインサポート

## 所感

Oxfmt は Prettier のドロップイン代替として実用段階に達しており、特に大規模プロジェクトでのフォーマット速度が大幅に改善される。Tailwind CSS クラスソートや import ソートが内蔵されているため、追加プラグインの管理も不要になる点が魅力的。Prettier の conformance テスト 100% 合格は移行の心理的ハードルを大きく下げる。
