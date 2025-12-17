---
title: "Fugu Request: Health connect API [374386918] - Chromium"
source: "https://issues.chromium.org/issues/374386918"
author:
  - "wh...@gmail.com (Reporter)"
  - "ro...@google.com (Assignee)"
published: 2024-10-19
created: 2025-12-17
description: |
  Chromium Issue Trackerに登録されたFeature Requestで、WebアプリからAndroidのHealth Connect APIへのアクセスを可能にすることを要望している。現在、Webアプリはヘルスデータにアクセスする手段がなく、ユーザー許可の仕組みを追加し、読み書き可能なメトリクスをカスタマイズできるようにすることが提案されている。
tags:
  - "chromium"
  - "fugu"
  - "health-connect-api"
  - "android"
  - "web-api"
  - "feature-request"
---

## 概要

**Issue番号**: 374386918  
**ステータス**: Assigned  
**タイプ**: Feature Request  
**優先度**: P2  
**重要度**: S3  
**対象OS**: Android  
**コンポーネント**: Blink>Sensor  
**ラベル**: proj-fugu  
**投票数**: 8票

## 問題の説明

### 現状の問題

現在、WebアプリケーションからAndroidの**Health Connect API**にアクセスする方法が存在しない。Health Connectは、Androidデバイス上のヘルス＆フィットネスデータ（歩数、心拍数、睡眠データなど）を統合管理するGoogleのAPIである。

### 提案内容

リクエスト者は以下の機能追加を提案している：

1. **Android OS上でユーザーに許可を求めるオプション**の追加
2. ネイティブアプリと同様の**パーミッションプロンプト**の実装
3. ユーザーが**読み取り・書き込み可能なメトリクスをカスタマイズ**できる仕組み

## Fugu Projectについて

このIssueは**proj-fugu**ラベルが付与されている。Project Fuguは、Webプラットフォームの機能ギャップを埋めるためのChromiumのイニシアチブで、ネイティブアプリでのみ利用可能な機能をWebに持ち込むことを目指している。

## 技術的詳細

| 項目 | 値 |
|------|-----|
| カテゴリ | API |
| Chromeチャンネル | 不明 |
| リグレッション | No |
| ビルド番号 | 129.0.0.0 |
| 他ブラウザでの動作 | 不明 |

## 関係者（CC）

- <al...@chromium.org>
- <ch...@chromium.org>
- <ho...@chromium.org>
- <ma...@chromium.org>
- <ra...@intel.com>
- <re...@chromium.org>
- <va...@google.com>
- <wh...@gmail.com>

## ステータス更新

現時点でステータス更新はまだ行われていない（"No update yet"）。

## 関連情報

### Health Connect APIとは

Health Connectは、Androidアプリ間でヘルス＆フィットネスデータを共有するためのプラットフォームである。以下のようなデータタイプをサポートしている：

- アクティビティ（歩数、距離、消費カロリーなど）
- 身体測定（体重、身長、体脂肪率など）
- バイタル（心拍数、血圧、血糖値など）
- 睡眠データ
- 栄養データ

### Web APIとしての実装の意義

WebアプリからHealth Connect APIにアクセスできるようになれば：

- **プログレッシブWebアプリ（PWA）** がヘルスデータを活用できる
- クロスプラットフォームの健康管理サービスの開発が容易になる
- ネイティブアプリとWebアプリの機能格差が縮小される

## 制限事項・考慮点

- 現時点ではAndroid OSのみが対象
- プライバシーとセキュリティに関する慎重な設計が必要
- ユーザーの明示的な同意を得る仕組みが必須
- どのブラウザでもまだ実装されていない状態

## 関連リンク

- [Chromium Issue Tracker - Issue 374386918](https://issues.chromium.org/issues/374386918)
- [Hotlist: Available](https://issues.chromium.org/hotlists/5438642)
- [Blink>Sensor Component Issues](https://issues.chromium.org/issues?q=customfield1222907:%22Blink%3ESensor%22)
