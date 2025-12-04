---
title: "Tvix - A new implementation of Nix"
source: "https://tvix.dev/"
author:
  - TVL (The Virus Lounge)
published:
created: 2025-12-04
description: |
  Tvixは純粋関数型パッケージマネージャーNixの新しい実装プロジェクト。モジュラー設計により、ユースケースに応じて異なるコンポーネントを再利用・置き換え可能。GPLv3ライセンスのオープンソースプロジェクトとしてTVLが開発中。
tags:
  - Nix
  - package-manager
  - Rust
  - functional-programming
  - open-source
  - TVL
---

## 概要

**Tvix**は、純粋関数型パッケージマネージャーである[Nix](https://nixos.org/)の新しい実装プロジェクトです。最大の特徴は**モジュラーアーキテクチャ**を採用していることで、ユースケースに応じて異なるコンポーネントを再利用したり置き換えたりすることができます。

## プロジェクト情報

| 項目 | 詳細 |
|------|------|
| 開発元 | [TVL (The Virus Lounge)](https://tvl.fyi) |
| ライセンス | GPLv3 |
| ソースコード | [TVL monorepo](https://code.tvl.fyi/tree/tvix) |
| GitHub ミラー | [tvlfyi/tvix](https://github.com/tvlfyi/tvix/) |
| 開発者ドキュメント | [docs.tvix.dev](https://docs.tvix.dev) |

## 主要コンポーネント

Tvixは複数のサブプロジェクトで構成されています：

| プロジェクト | 説明 |
|-------------|------|
| `//tvix/cli` | Tvixの予備的なREPL & CLI実装 |
| `//tvix/eval` | **Nixプログラミング言語の実装** |
| `//tvix/nix-compat` | C++ Nixとの互換性のためのRustライブラリ（エンコーディング、ハッシュスキーム、フォーマット対応） |
| `//tvix/serde` | アプリケーション設定にNix言語を使用するためのRustライブラリ |
| `//tvix/simstore` | I/Oなしでストアパスを計算できるstore実装 |

## デモ・ツール

- **[Tvixbolt](https://bolt.tvix.dev)** - 言語評価器をブラウザ上で試すことができるオンラインツール

## 開発リソース

- [コード](https://at.tvl.fyi/?q=%2F%2FREADME.md)
- [コードレビュー](https://cl.tvl.fyi/)
- [CI](https://tvl.fyi/builds)
- [バグトラッカー](https://b.tvl.fyi/)
- [TODOリスト](https://todo.tvl.fyi/)
- [検索](https://atward.tvl.fyi/)

## 関連ブログ記事

TVLのウェブサイトに掲載されたTvix関連の最新ブログ記事：

1. **[Tvix Status - August '24](https://tvl.fyi/blog/tvix-update-august-24)** - 2024年8月の進捗報告
2. **[Tvix Status - February '24](https://tvl.fyi/blog/tvix-update-february-24)** - 2024年2月の進捗報告
3. **[Tvix Status - September '22](https://tvl.fyi/blog/tvix-status-september-22)** - 2022年9月の進捗報告
4. **[Tvix: We are rewriting Nix](https://tvl.fyi/blog/rewriting-nix)** - Nixを書き直す理由と目標

## 重要なポイント

1. **モジュラー設計**: 従来のC++ Nix実装とは異なり、コンポーネントを独立して使用・置換可能
2. **Rust実装**: 互換性ライブラリやツールはRustで実装されている
3. **オープンソース**: GPLv3ライセンスで公開されており、誰でも貢献可能
4. **アクティブな開発**: 2022年から継続的に開発が進められており、定期的にステータスアップデートが公開されている

## 制限事項・注意点

- `//tvix/cli` は「予備的（preliminary）」と明記されており、まだ開発初期段階
- `//tvix/simstore` はストアパスの計算のみ可能で、それ以上の機能は限定的
- 本番環境での使用準備が整っているかは、最新のステータスアップデートを確認する必要がある
