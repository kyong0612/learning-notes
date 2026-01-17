---
title: "publint/publint: Lint packaging errors"
source: "https://github.com/publint/publint"
author:
  - "[[bluwy]]"
published: 2022-06-06
created: 2026-01-17
description: "npmパッケージのpackage.json設定エラーを検出するリンティングツール。異なる環境間での互換性を確保し、パッケージの公開前に問題を発見するのに役立つ。"
tags:
  - "npm"
  - "packaging"
  - "lint"
  - "JavaScript"
  - "developer-tools"
---

## 概要

**publint**は、npmパッケージのpackaging（パッケージング）エラーを検出するためのリンティングツールです。パッケージが異なる環境（Node.js、ブラウザ、バンドラーなど）で正しく動作することを確認し、公開前に潜在的な問題を発見するのに役立ちます。

## 主な機能

- **パッケージングエラーの検出**: `package.json`の設定ミスや、exports/mainフィールドの問題を検出
- **環境間互換性の確保**: 異なるランタイム環境での互換性問題を事前に発見
- **CLI & API**: コマンドラインツールとしても、プログラマティックAPIとしても利用可能
- **オンラインツール**: [publint.dev](https://publint.dev)でブラウザから直接パッケージをチェック可能

## 使用方法

### 基本的なコマンド

```bash
# ライブラリプロジェクトをlint
$ npx publint

# 特定のパスを指定してlint
$ npx publint ./packages/my-library
```

### オンラインで試す

[publint.dev](https://publint.dev)にアクセスして、npmパッケージ名を入力するだけでチェックできます。

## プロジェクト情報

| 項目 | 内容 |
|------|------|
| ライセンス | MIT |
| Stars | 1.2k |
| Forks | 33 |
| 利用プロジェクト数 | 9,900+ |
| 最新バージョン | v0.3.16 (2025年12月10日) |
| 主な言語 | JavaScript (79.4%), Svelte (17.8%), Vue (2.2%) |

## メインコントリビューター

- [@bluwy](https://github.com/bluwy) - プロジェクトの作者・メンテナー

## 検出される問題の例

publintは以下のような問題を検出します：

- `exports`フィールドの設定ミス
- `main`、`module`、`types`フィールドの不整合
- 存在しないファイルへの参照
- 条件付きexportsの問題
- ESM/CJSの互換性問題

## 関連リンク

- [公式サイト](https://publint.dev)
- [ドキュメント](https://publint.dev/docs/)
- [GitHub リポジトリ](https://github.com/publint/publint)
- [CONTRIBUTING.md](https://github.com/publint/publint/blob/master/CONTRIBUTING.md)
