---
title: "ノートブックの作成と管理（API）  |  NotebookLM Enterprise"
source: "https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks?hl=ja"
author:
  - "[[Google Cloud Documentation]]"
published:
created: 2026-02-26
description: "NotebookLM Enterprise APIを使用して、ノートブックの作成・取得・一覧表示・一括削除・共有をプログラムで実行する方法を解説するGoogle Cloud公式ドキュメント。REST APIのエンドポイント、リクエスト/レスポンス形式、マルチリージョン対応、IAMロールによる共有権限管理を網羅する。"
tags:
  - "clippings"
  - "NotebookLM"
  - "Google Cloud"
  - "API"
  - "REST"
  - "Enterprise"
  - "Gemini"
---

## 概要

NotebookLM Enterprise は、ドキュメントから分析情報と要約を生成するための Google Cloud のツールである。本ドキュメントでは、以下のノートブック管理タスクを **プログラムで実行するための REST API** について解説している。

- ノートブックの作成
- ノートブックの取得
- 最近閲覧したノートブックの一覧表示
- ノートブックの一括削除
- ノートブックの共有

すべての API エンドポイントは `discoveryengine.googleapis.com` の `v1alpha` バージョンを使用する。

## 主要なトピック

### 共通パラメータ：マルチリージョン対応

すべてのAPIリクエストで `ENDPOINT_LOCATION` を指定する必要がある。

| 値 | 対象リージョン |
|-----|----------------|
| `global-` | グローバルロケーション |
| `eu-` | EU マルチリージョン |
| `us-` | 米国マルチリージョン |

エンドポイントURL形式：
```
https://ENDPOINT_LOCATION-discoveryengine.googleapis.com/v1alpha/projects/PROJECT_NUMBER/locations/LOCATION/notebooks
```

### 1. ノートブックの作成（notebooks.create）

- **メソッド**: `POST`
- **リクエストボディ**: `title`（UTF-8 エンコード文字列）

```bash
curl -X POST \
  -H "Authorization:Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  "https://ENDPOINT_LOCATION-discoveryengine.googleapis.com/v1alpha/projects/PROJECT_NUMBER/locations/LOCATION/notebooks" \
  -d '{ "title": "NOTEBOOK_TITLE" }'
```

**レスポンス例**:
```json
{
  "title": "NOTEBOOK_TITLE",
  "notebookId": "NOTEBOOK_ID",
  "emoji": "",
  "metadata": {
    "userRole": "PROJECT_ROLE_OWNER",
    "isShared": false,
    "isShareable": true
  },
  "name": "projects/PROJECT_NUMBER/locations/LOCATION/notebooks/NOTEBOOK_ID"
}
```

**重要なフィールド**:
- **`notebookId`**: ノートブックの一意のID。共有・取得など他の操作に必要
- **`name`**: 完全なリソース名（`projects/PROJECT_NUMBER/locations/LOCATION/notebooks/NOTEBOOK_ID`）

### 2. ノートブックの取得（notebooks.get）

- **メソッド**: `GET`
- **パス**: `.../notebooks/NOTEBOOK_ID`

ソースを追加済みのノートブックを取得すると、追加されたすべてのソースの詳細が返される。CMEKを構成している場合は、CMEK関連情報も含まれる。

### 3. 最近閲覧したノートブックの一覧（notebooks.listRecentlyViewed）

- **メソッド**: `GET`
- **パス**: `.../notebooks:listRecentlyViewed`
- **デフォルト**: 最新 **500件** のノートブックを返す
- **ページネーション**: `pageSize` クエリパラメータで制御可能

### 4. ノートブックの一括削除（notebooks.batchDelete）

- **メソッド**: `POST`
- **リクエストボディ**: `names` 配列に削除対象の完全リソース名を指定

```json
{
  "names": [
    "projects/PROJECT_NUMBER/locations/LOCATION/notebooks/NOTEBOOK_ID_1",
    "projects/PROJECT_NUMBER/locations/LOCATION/notebooks/NOTEBOOK_ID_2"
  ]
}
```

成功時は空の JSON オブジェクトを返す。

### 5. ノートブックの共有（notebooks.share）

- **メソッド**: `POST`
- **前提条件**: 共有相手に **Cloud NotebookLM User** IAMロールが付与されている必要がある
- **リクエストボディ**: `accountAndRoles` 配列にメールアドレスとロールを指定

**利用可能なロール**:

| ロール | 説明 |
|--------|------|
| `PROJECT_ROLE_NOT_SHARED` | アクセス権なし |
| `PROJECT_ROLE_READER` | 読み取り権限 |
| `PROJECT_ROLE_WRITER` | 書き込み権限 |
| `PROJECT_ROLE_OWNER` | 所有者権限 |

## 重要な事実・データ

- **APIバージョン**: `v1alpha`（アルファ版）
- **認証方式**: `gcloud auth print-access-token` による Bearer トークン認証
- **一覧表示のデフォルト件数**: 最大500件
- **マルチリージョン対応**: グローバル / EU / 米国の3リージョン
- **ノートブックURL形式**:
  - Google ID: `https://notebooklm.cloud.google.com/LOCATION/notebook/NOTEBOOK_ID?project=PROJECT_NUMBER`
  - サードパーティID: `https://notebooklm.cloud.google/LOCATION/notebook/NOTEBOOK_ID?project=PROJECT_NUMBER`

## 結論・示唆

### 実践的な示唆

- NotebookLM Enterprise の管理をプログラムで自動化するための REST API が提供されている
- ノートブックの作成後、返される `notebookId` を保持しておくことが、後続の操作（共有・取得・削除）に必要
- 共有機能を利用するには、事前にIAMロールの設定が必要
- API は `v1alpha` であり、今後変更される可能性がある

## 制限事項・注意点

- **APIバージョンがアルファ版**（`v1alpha`）であり、仕様変更の可能性がある
- 共有相手には事前に **Cloud NotebookLM User** ロールの付与が必要
- `listRecentlyViewed` は最大500件までの取得に限定される
- 本ドキュメントではソースの追加方法は別ページ（[ソースの追加](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebook-sources?hl=ja)）で解説されている

---

*Source: [ノートブックの作成と管理（API） | NotebookLM Enterprise](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks?hl=ja)*
