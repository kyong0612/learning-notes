---
title: "Fumadocs"
source: "https://fumadocs.dev/"
author:
  - "Fuma Nama"
published:
created: 2025-11-27
description: "Fumadocsは、React.jsベースのドキュメントフレームワーク。高いカスタマイズ性と美しいUIを提供し、Next.js、React Router、Tanstack Startなど複数のReactフレームワークで動作する。MarkdownとMDXをネイティブサポートし、OpenAPI統合、検索機能、国際化対応などの機能を備える。"
tags:
  - "React.js"
  - "documentation"
  - "framework"
  - "MDX"
  - "Next.js"
  - "open-source"
---

## 概要

**Fumadocs**（フーマドックス）は、開発者向けに設計されたReact.jsドキュメントフレームワーク。Fuma Namaによって開発され、高速で柔軟性があり、Reactフレームワークにシームレスに統合できる。

### 主な特徴

- **フレームワーク非依存**: Next.js、Tanstack Start、React Router、Wakuを公式サポート
- **高いカスタマイズ性**: 設定ファイルではなくコードで制御可能
- **美しいデフォルトテーマ**: shadcn/uiにインスパイアされたUI
- **MarkdownとMDXのネイティブサポート**: 非開発者、開発者、AIエージェントに対応

---

## アーキテクチャ

Fumadocsは**Content → Core → UI**の3層構造で、高いコンポーザビリティを実現:

| パッケージ | 説明 |
|-----------|------|
| `fumadocs-mdx` | ReactフレームワークでMDXをエレガントに使用 |
| `fumadocs-core` | ドキュメント構築とコンテンツ処理のヘッドレスライブラリ |
| `fumadocs-ui` | ドキュメント用UIライブラリ |
| `fumadocs-openapi` | OpenAPIドキュメントのレンダリング拡張 |
| `fumadocs-obsidian` | Obsidianスタイルのマークダウン処理拡張 |

---

## 設計哲学

### 1. 少ない抽象化

設定ファイルに頼らず、コードを書いてアプリの動作を完全にカスタマイズ可能。

### 2. シームレスな統合

Reactフレームワークと緊密に統合。Next.jsの場合、App Routerの機能（静的サイト生成など）をそのまま活用可能。

### 3. コンポーザブルUI

shadcn/uiにインスパイアされた**Fumadocs CLI**により、UIの一部を「フォーク」してカスタマイズ可能。

### 4. サーバーファースト

React Server Componentを活用し、コンテンツを動的かつインタラクティブに。データベースやCMSからリアルタイムでデータを取得可能。

### 5. ミニマル

メンテナンス性を重視し、基本機能の品質に集中。

---

## コンテンツ作成機能

### Markdown機能

- 画像のサポート
- シンタックスハイライト（Shiki使用）
- コードブロックのグループ化
- コールアウト
- カード
- カスタム見出しアンカー
- 自動目次生成

### MDX拡張機能

- JavaScript + JSX構文
- カスタムコンポーネント
- コンテンツのインクルード/埋め込み
- TypeScript Twoslash（コードブロックに型情報を表示）
- Shiki記法
- remark/rehypeプラグインによる拡張

### 自動化ツール

- **auto-type-table**: TypeScriptコンパイラを使った型ドキュメント自動生成
- **OpenAPI playground**: API文書化用プレイグラウンド
- Python、TypeScript、Obsidian向けの自動化サポート

---

## 検索機能

以下の検索エンジンとの統合をサポート:

- **Orama Search**
- **Algolia Search**

---

## クイックスタート

```bash
pnpm create fumadocs-app
```

対話形式で以下を選択:

- **Reactフレームワーク**: Next.js、Tanstack Start、React Router、Waku
- **コンテンツソース**: Fumadocs MDX

初期化後、`content/docs/index.mdx`を作成:

```mdx
---
title: Hello World
---

## Yo what's up
```

開発サーバーを起動:

```bash
npm run dev
```

`http://localhost:3000/docs`でドキュメントを確認可能。

---

## コンテンツソース統合

様々なコンテンツソースと統合可能:

- **Fumadocs MDX**（公式）
- **BaseHub CMS**
- **Sanity**
- **Payload CMS**
- **Content Collections**
- カスタムCMS

---

## 著名な採用事例・推薦

| 推薦者 | 役職 | コメント |
|--------|------|----------|
| **shadcn** | Shadcn UI 作成者 | 「必要なブロックを組み合わせられるヘッドレスドキュメント」 |
| **Anthony Shew** | Vercel Turbo DX | 「App Routerに美しく統合される」 |
| **Aiden Bai** | Million.js 作成者 | 「最高のNext.jsドキュメントフレームワーク」 |
| **David Blass** | Arktype 作成者 | 「Arktypeのドキュメントをこれほど良く作れた」 |

Unkey、Vercel、Oramaなどのスタートアップで採用。

---

## その他の機能

- **バージョニング**: 複数バージョンのドキュメント管理
- **国際化 (i18n)**: 多言語対応
- **静的ビルド**: 静的サイトとしてエクスポート可能
- **テーマ**: ライト/ダークモード対応

---

## 使用すべきケース

### ドキュメントサイト

- **オーサリング体験**に重点
- 美しいテーマと自動化ツール
- コードベースのイテレーションとドキュメントの同期

### ブログサイト

- シンタックスハイライト
- ドキュメント検索
- デフォルトテーマ（Fumadocs UI）

---

## リソース

- **GitHub**: [fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs)
- **ドキュメント**: <https://fumadocs.dev/docs/ui>
- **ショーケース**: <https://fumadocs.dev/showcase>
- **スポンサー**: <https://fumadocs.dev/sponsors>
- **ライセンス**: オープンソース（100%コミュニティ駆動）
