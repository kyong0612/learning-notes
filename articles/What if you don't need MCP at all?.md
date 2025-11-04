---
title: "What if you don't need MCP at all?"
source: "https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/?t=0"
author: "Mario Zechner"
published: "2025-11-02"
created: 2025-11-04
description: "MCPサーバーの代わりに、シンプルなBashスクリプトとコードインタプリタを使用してブラウザ自動化ツールを構築する方法。トークン効率が96%向上し、柔軟性とメンテナンス性を実現。"
tags:
  - "MCP"
  - "ブラウザ自動化"
  - "Puppeteer"
  - "AIエージェント"
  - "トークン最適化"
  - "Bash"
  - "clippings"
---

## 概要

著者Mario Zechnerは、ブラウザ自動化用途において、複雑なMCPサーバー（13,000～18,000トークン消費)の代わりに、シンプルなBashスクリプトとPuppeteerを組み合わせた軽量アプローチ（わずか225トークン）を提案しています。この手法により、トークン効率が大幅に向上し、メンテナンス性と柔軟性も向上します。

## 主要な利点

### トークン効率の劇的な改善
- **提案手法**: 225トークン（READMEのみ）
- **Playwright MCPサーバー**: 13,700トークン
- **Chrome DevTools MCPサーバー**: 18,000トークン
- **削減率**: 約96%のトークン削減を実現

### その他の利点
- スクリプトの修正・追加が容易
- Bashコマンドチェーンによる合成可能性
- 出力形式の柔軟な調整
- エージェントの混乱を防ぐシンプルな構成
- 複合ツールチェーンの実現

## 実装構造

### 4つの基本ツール

すべてのツールはNode.jsスクリプトとして実装され、`agent-tools`ディレクトリで管理されます。

#### 1. Start Tool（ブラウザ起動）
- Chrome/Chromiumの起動
- オプションでユーザープロフィール同期（rsync使用）
- リモートデバッグポート9222で実行
- Puppeteer Coreで接続確認（30回試行、各500ms間隔）

```javascript
// スクリプト名: browser-tools-start.js
// プロフィール同期、デバッグポート設定、接続確認を実装
```

#### 2. Navigate Tool（ナビゲーション）
- 指定URLへの移動
- 現在のタブまたは新規タブで動作
- `domcontentloaded`待機オプション

```javascript
// スクリプト名: browser-tools-nav.js
```

#### 3. Evaluate JavaScript Tool（JavaScript実行）
- ページコンテキストでのJavaScript実行
- `AsyncFunction`コンストラクタでコード実行
- 配列/オブジェクト/スカラー値に対応した出力フォーマット

```javascript
// スクリプト名: browser-tools-eval.js
```

#### 4. Screenshot Tool（スクリーンショット）
- ビューポートのPNG画像化
- 一時ディレクトリに保存
- タイムスタンプ付きファイル名生成

```javascript
// スクリプト名: browser-tools-screenshot.js
```

### 拡張ツール

#### Pick Tool（DOM要素選択）
インタラクティブな要素選択器を提供：
- **シングルクリック**: 単一要素選択
- **Cmd/Ctrl+クリック**: 複数要素選択
- **Enterキー**: 選択完了
- **ESCキー**: キャンセル

抽出される要素情報：
- タグ名
- ID
- クラス
- テキスト内容（200文字制限）
- 親要素パス

#### Cookies Tool（HTTP-only Cookie取得）
JavaScript評価では取得できないHTTP-onlyクッキーへのアクセス機能を提供。

## セットアップ方法

### ディレクトリ構成
```
agent-tools/
├── browser-tools-start.js
├── browser-tools-nav.js
├── browser-tools-eval.js
├── browser-tools-screenshot.js
├── browser-tools-pick.js
├── browser-tools-cookies.js
└── README.md
```

### 設定手順
1. `agent-tools`ディレクトリをPATHに追加
2. スクリプトに実行権限を付与
3. Claude Codeで`/add-dir`コマンドを使用
4. `@README.md`でツールドキュメントを参照

### 名前衝突の回避
完全修飾スクリプト名（例：`browser-tools-start.js`）を使用することで、他のツールとの名前衝突を防ぎます。

## 実用例：Hacker Newsスクレーパー

著者は具体的な使用例として、Hacker Newsのスクレーピングを実演：

1. Pick Toolで対象DOM要素を選択
2. エージェントが自動的にスクレーパーコードを生成
3. 抽出データを構造化して出力

このワークフローにより、非技術者でも直感的にスクレーパーを構築できます。

## MCPサーバーとの比較

### MCPサーバーの課題
- **過剰な機能**: 25以上のツールを提供
- **エージェントの混乱**: 多すぎる選択肢により意思決定が困難に
- **トークン消費**: 毎セッションで大量のREADMEを読み込む必要
- **柔軟性の欠如**: カスタマイズが困難

### 提案手法の優位性
- **シンプル**: 4つの基本ツールのみ
- **効率的**: トークン使用量が96%削減
- **柔軟**: スクリプトの修正・追加が容易
- **合成可能**: Bashコマンドでツールを組み合わせ可能

## 技術的な詳細

### Puppeteer Coreの活用
- 軽量なブラウザ制御ライブラリ
- Chrome DevTools Protocolを直接使用
- リモートデバッグポート経由で接続

### ファイルベースの出力
- 一時ディレクトリを活用
- 複数ツールのチェーン化を実現
- エージェントがファイルパスで結果を参照

## 制限事項と考慮事項

著者は以下の点を明記しています：

1. **保守責任**: ユーザー自身が独自の保守戦略を構築する必要がある
2. **初期設定**: PATH設定やスクリプトの準備が必要
3. **技術要件**: Node.js、Puppeteerの基礎知識が望ましい
4. **適用範囲**: ブラウザ自動化に特化（汎用的なMCPサーバーとは目的が異なる）

## 著者の結論

> "これらのツールを構築することは非常に簡単であり、必要なすべての自由度を提供します"

Mario Zechnerは、構造化されたMCPサーバーよりも、柔軟なBash/コード駆動アプローチを推奨しています。特にブラウザ自動化のような特定用途においては、シンプルさとカスタマイズ性が重要であると主張しています。

## 参考リンク

- [記事元URL](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/?t=0)
- 関連トピック: MCP、Puppeteer、ブラウザ自動化、AIエージェント、トークン最適化
