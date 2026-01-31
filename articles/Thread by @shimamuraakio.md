---
title: "Thread by @shimamuraakio"
source: "https://x.com/shimamuraakio/status/1969673675478876236?s=12"
author:
  - "[[@shimamuraakio]]"
published: 2025-09-21
created: 2026-01-31
description: "macOS 26 Tahoeで発生する入力ラグ問題の原因と解決策。新しい入力アシスト機能（NSAutoFillHeuristicController）の不具合により、キーボードやコントローラーの入力回数に応じてシステム負荷が増加する問題への対処法を解説。"
tags:
  - "clippings"
  - "macOS"
  - "macOS-Tahoe"
  - "トラブルシューティング"
  - "パフォーマンス"
  - "ターミナル"
---

## 概要

macOS 26 Tahoeで「時間経過と共にラグが発生する」問題についての報告と解決策。新しい入力アシスト機能の不具合が原因で、システムパフォーマンスが徐々に低下する。

## 問題の詳細

### 症状

- 使用時間が経過するにつれて、システム全体のラグが発生
- ゲームなど入力頻度の高いアプリケーションで特に顕著
- ウェブブラウザやその他のアプリでも発生

### 原因

**NSAutoFillHeuristicController**（新しい入力アシスト機能）の不具合：

- キーボードやコントローラー等の入力回数に基づいて不要な関数が蓄積
- 入力のたびにシステム負荷が増加していく
- アプリ単位で問題が蓄積される

> 簡単にいうと「ボタンを押すごとに段々重くなっていく」

## 解決策

### 一時的な解決策

アプリを再起動する（問題が発生するのはアプリ単位のため）

### 恒久的な解決策

ターミナル.appで以下のコマンドを実行し、この機能を無効にする：

```bash
defaults write -g NSAutoFillHeuristicControllerEnabled -bool FALSE
```

元に戻す場合は以下を実行（上記の無効設定を削除）：

```bash
defaults delete -g NSAutoFillHeuristicControllerEnabled
```

## 備考

- 将来的にAppleのアップデートで修正される可能性が高い
- それまでの暫定対策として活用可能