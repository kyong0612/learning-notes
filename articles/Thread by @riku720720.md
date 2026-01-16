---
title: "Claude CodeでSupabaseテーブル作成時のRLS設定に関する注意点"
source: "https://x.com/riku720720/status/2011670270432723042"
author:
  - "[[Rikuo (@riku720720)]]"
published: 2026-01-15
created: 2026-01-16
description: |
  Claude CodeでSupabaseのテーブルを作成させる際、高確率で問題のあるRLS（Row Level Security）設定が生成される問題について警告。適切な設定方法を選択しないとパフォーマンスが大幅に低下する可能性がある。
tags:
  - "clippings"
  - "Claude Code"
  - "Supabase"
  - "RLS"
  - "Row Level Security"
  - "パフォーマンス最適化"
  - "AI開発"
---

## 概要

Claude CodeでSupabaseのデータベーステーブルを作成させると、生成されるRLS（Row Level Security）設定に問題があるケースが高確率で発生することについての警告ツイート。

## 主要なポイント

### 問題点

- **Claude CodeのRLS設定問題**: Claude CodeにSupabaseのテーブルを作成させると、高確率で不適切なRLS（Row Level Security）設定を出力する
- **パフォーマンスへの影響**: 不適切なRLS設定を使用すると、データベースのパフォーマンスが著しく低下する

### 解決策

- ツイートでは「右の画像の方にしないとパフォーマンスめっちゃ落ちる」と述べており、適切なRLS設定と不適切な設定を比較した画像が添付されている
- Claude Codeが生成するRLS設定をそのまま使用せず、パフォーマンスを考慮した設定に修正する必要がある

## 重要な結論

AI（Claude Code）が生成するデータベース設定、特にセキュリティ関連の設定（RLS）については、そのまま使用するのではなく、パフォーマンスへの影響を考慮した検証・修正が必要である。

## 補足情報

- **RLS（Row Level Security）とは**: PostgreSQLのセキュリティ機能で、テーブル内の行単位でアクセス制御を行う仕組み。Supabaseでは認証済みユーザーのデータアクセスを制御するために広く使用される
- **パフォーマンス問題の典型例**: 
  - サブクエリを多用したポリシー
  - インデックスを活用できないクエリパターン
  - `auth.uid()`の呼び出しを効率的に行えていない設計

## 関連トピック

- Supabaseのセキュリティベストプラクティス
- Claude Codeの出力品質管理
- AIが生成するコードのレビュー重要性
