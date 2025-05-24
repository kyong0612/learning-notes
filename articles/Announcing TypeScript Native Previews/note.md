---
title: "Announcing TypeScript Native Previews"
source: "https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/"
author:
  - "Daniel Rosenwasser"
published: 2025-05-22
created: 2025-05-24
description: |
  TypeScriptの10倍高速なネイティブ版のプレビューがnpmとVS Code拡張として利用可能になりました。Go言語で実装されたこの新バージョンは、大規模プロジェクトでの劇的なパフォーマンス向上を実現し、最終的にTypeScript 7として公開予定です。
tags:
  - typescript
  - performance
  - native-compilation
  - go-language
  - vs-code
  - typescript-7
  - corsa
  - developer-tools
---

# TypeScript Native Previews発表：10倍高速な開発体験

TypeScriptチームは、Go言語でネイティブ実装されたTypeScriptコンパイラとツールセットのプレビュー版を正式に公開しました。この革新的な取り組みにより、多くのプロジェクトで10倍の速度向上を実現しています。

## 概要

2025年3月に発表されたTypeScriptネイティブポートの取り組みが大幅に進展し、今回一般向けプレビューとして利用可能になりました。この新しい実装は：

- **言語**: Go言語で実装
- **パフォーマンス**: 10倍の速度向上を実現
- **並列処理**: 共有メモリ並列処理と並行性を活用
- **プロジェクト名**: "Project Corsa"（内部コードネーム）
- **リリース予定**: 最終的にTypeScript 7として公開

## 利用方法

### npmパッケージ

```sh
npm install -D @typescript/native-preview
```

新しい実行可能ファイル `tsgo` が提供され、従来の `tsc` と同様に使用できます：

```sh
npx tsgo --project ./src/tsconfig.json
```

最終的には `tsgo` は `tsc` にリネームされ、メインの `typescript` パッケージに統合される予定です。

### VS Code拡張

"TypeScript (Native Preview)"拡張をVS Code拡張マーケットプレイスからインストール可能です。

**有効化手順**:

1. コマンドパレットから「TypeScript Native Preview: Enable (Experimental)」を実行
2. 設定UIで「TypeScript > Experimental: Use Tsgo」を有効化
3. JSONで設定: `"typescript.experimental.useTsgo": true`

## 主要な進展

### 型チェック機能の充実

大部分の型チェッカーがポートされ、以下の重要機能が追加されました：

#### JSX対応

- 初期版では不完全だったJSX型チェックが完全に対応
- Sentryプロジェクトでの測定では：
  - **従来版**: 72.81秒
  - **ネイティブ版**: 6.761秒
  - **10倍以上の速度向上**を確認

#### JavaScript + JSDoc対応

- JavaScript ファイルの型チェックをサポート
- JSDocコメントを使用した型解析
- レガシーパターンを排除し、よりモダンなJS スタイルに対応

### エディタ機能・LSPサポート

#### 実装済み機能

- エラー診断
- go-to-definition
- hover機能
- **新規追加**: コード補完機能

#### 開発中機能

- auto-imports
- find-all-references
- rename機能
- signature help

### API設計の進展

- 標準I/Oを通じた API層の基盤を構築
- 言語に依存しないIPC通信をサポート
- JavaScript/TypeScript用クライアントを提供
- 同期通信のためRustで実装された [`libsyncrpc`](https://github.com/microsoft/libsyncrpc) Node.jsモジュールを開発

## 制限事項と既知の違い

### 未実装機能

- `--build` モード（個別プロジェクトビルドは可能）
- `--declaration` emit
- 特定のdownlevel emit targets
- プロジェクト参照機能

### TypeScript 6.0の非推奨機能

- `node`/`node10` モジュール解決（`node16`、`nodenext`、`bundler`を推奨）

### 推奨設定

```json
{
    "compilerOptions": {
        "module": "preserve",
        "moduleResolution": "bundler"
    }
}
```

または

```json
{
    "compilerOptions": {
        "module": "nodenext"
    }
}
```

## 今後の予定

### 短期目標

- 夜間ビルドでの継続的アップデート
- 主要機能の段階的実装
- コミュニティフィードバックの収集

### 長期目標（2025年後半）

- `--build` 機能の完全実装
- 大部分のエディタ機能の提供
- TypeScript 7としての正式リリース

## パフォーマンス比較データ

### Sentryプロジェクトでの測定結果

**TypeScript 5.8（従来版）**:

- ファイル数: 9,306
- 総実行時間: 72.81秒
- 型チェック時間: 63.26秒

**TypeScript Native（Corsa）**:

- ファイル数: 9,292
- 総実行時間: 6.761秒
- 型チェック時間: 5.882秒

**結果**: **10倍以上の性能向上**を確認

## コミュニティとフィードバック

- **Issue報告**: [microsoft/typescript-go](https://github.com/microsoft/typescript-go/issues)
- **リリース頻度**: 夜間ビルド
- **アップデート**: VS Code拡張は自動更新

このプレビュー版により、TypeScriptの開発体験が劇的に向上し、大規模プロジェクトでの生産性が大幅に改善されることが期待されます。積極的な試用とフィードバックが推奨されています。

[

Feedback

](<https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/>)
