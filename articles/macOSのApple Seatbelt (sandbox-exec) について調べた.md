---
title: "macOSのApple Seatbelt (sandbox-exec) について調べた"
source: "https://blog.syum.ai/entry/2025/04/27/232946"
author:
  - "[[syumai (id:f_syumai)]]"
published: 2025-04-27
created: 2025-07-07
description: |
  OpenAIのCodex CLIで利用されているmacOSのサンドボックス機能「Apple Seatbelt (`sandbox-exec`)」についての調査記事。この機能は既に非推奨であるものの、その仕組みや使い方、権限デバッグの難しさについて解説。また、`sandbox-exec`をより簡単に扱うために著者がGoで開発したラッパーツール「sbx」についても紹介している。
tags:
  - "macOS"
  - "sandbox"
  - "security"
  - "Go"
---

## はじめに

OpenAIのコーディングエージェント「Codex CLI」が、macOS上でコマンドを`Apple Seatbelt (sandbox-exec)`という機構でサンドボックス化していることをきっかけに、この技術について調査。本稿では、Apple Seatbeltの概要と、それを簡易に利用するために開発したGo製ラッパーツール`sbx`について紹介する。

## Apple Seatbeltとは？

- macOSに組み込まれた`sandbox-exec`コマンドを利用し、ファイル読み書きやネットワークアクセスなどのシステムコールをOSレベルで制限するサンドボックス機能。
- しかし、Apple Seatbeltは**既に非推奨**であり、現在は`App Sandbox`の利用が推奨されている。
- ポリシーを記述するためのSBPL (Sandbox Profile Language) の仕様は**公式には公開されておらず**、有志によるリバースエンジニアリングされたドキュメントが存在するのみ。
- 非推奨ではあるが、ChromiumやBazelといった主要なツールで現在も利用されており、当面は存続する可能性が高い。

## `sandbox-exec`の使い方

`sandbox-exec`は、プロファイルを用いてコマンドの動作を制限する。

- **プロファイルの指定方法**:
  - `-f <ファイルパス>`: プロファイルファイルを指定
  - `-n <プロファイル名>`: `no-internet`など事前定義されたプロファイルを指定（これも非推奨）
  - `-p <プロファイル文字列>`: プロファイル内容を直接文字列で指定
- **プロファイルの書式 (SBPL)**:
  - `(deny default)`でデフォルトですべての操作を拒否し、`allow`で許可する操作を明示的に指定するのが基本的な使い方。
  - `/System/Library/Sandbox/Profiles/system.sb`をインポートすることで、多くのコマンドで必要となる無害な共通ルール（`/dev/null`へのアクセス許可など）を利用できる。

## 権限のデバッグ

- かつては、プロファイルに`(trace "ファイル名")`と記述することで、コマンド実行時に不足している権限をファイルに出力する機能があった。
- しかし、このトレース機能はmacOS High Sierra (2017年頃) 以降、**動作しなくなっている**ため、必要な権限の特定は手動で行う必要がある。

## `sbx`の紹介

著者が開発した`sandbox-exec`のラッパーツール。`sandbox-exec`の複雑なプロファイル記述を、より直感的なフラグ形式で指定できる。

- **GitHub**: [syumai/sbx](https://github.com/syumai/sbx)
- **特徴**:
  - Denoの権限モデルに似たフラグ (`--allow-network`, `--allow-file-read`など) を用いて、許可する操作を指定できる。
  - これらのフラグから動的にSBPLプロファイルを生成し、`sandbox-exec`に渡して実行する。
- **インストール**:

    ```bash
    go install github.com/syumai/sbx/cmd/sbx@latest
    ```

    または、GitHubのReleasesページからバイナリをダウンロード。
- **使用例**:

    ```bash
    # カレントディレクトリの読み取りを許可してlsを実行
    sbx --allow-file-read='.' ls -l .

    # localhost:8080へのネットワークアクセスを許可してcurlを実行
    sbx --allow-network='localhost:8080' curl http://localhost:8080
    ```

- **ユースケース**:
    信頼できないMCPサーバーを実行する際など、セキュリティを確保したい場面での活用が期待される。
