---
title: "Thread by @mizchi"
source: "https://x.com/mizchi/status/1953134067626721337"
author:
  - "[[@mizchi]]"
published: 2025-08-07
created: 2025-08-08
description: |
  JavaScript/TypeScript に関する設計上・仕様上の不整合や歴史的負債を、テーマ別に箇条書きで指摘したスレッド。
  非存在値の表現、エラー処理、プロトタイプとシリアライズ、文法の曖昧さ、仕様策定/後方互換の負債など、実務で遭遇する摩擦点を網羅的に挙げている。
tags:
  - "clippings"
  - "JavaScript"
  - "TypeScript"
  - "ECMAScript"
  - "TC39"
  - "エラーハンドリング"
---
## 要約

### 概要

- **主題**: JS/TS の仕様・設計に起因する実務上の痛点を列挙。
- **焦点**: 値の表現・例外設計・プロトタイプ/シリアライズ・文法の曖昧さ・標準化/互換性の負債。
- **トーン**: 問題点の整理（解決策提示ではなく、気づきの共有）。

### 主な論点（テーマ別）

- **型/値の不整合**
  - `undefined` と `null` の二重の非存在表現
  - `undefined` が予約語ではなく代入可能
  - `typeof null === 'object'`
  - `==` の曖昧さ（緩い等価）
  - 未定義メンバアクセスで即時例外にできない

- **エラー処理の不備**
  - `throw` に `Error` 以外を投げられる
  - `Error` 詳細が構造化されず自由記述になりがち
  - `TypeError` の意味領域が広く曖昧

- **オブジェクト/プロトタイプとシリアライズ**
  - `Array` が `Object` を継承する歴史的設計
  - `HTMLCollection` など Array 風だが Array でないコレクション
  - `ArrayLike` / `PromiseLike` といった後付けの互換ハック
  - `prototype` の存在と書き換え禁止にできない点
  - `__proto__`, `__defineGetter__`, `__defineSetter__` の遺産
  - シリアライズを考慮していない `class`
  - `JSON.stringify` と `prototype` の曖昧な関係

- **言語/文法の曖昧さ**
  - 自動セミコロン挿入（ASI）
  - `get val() { ... }` により読み取りアクセスが副作用を持ち得る
  - 正規表現リテラル `/regex/` の存在により `divide` の `/` を決定的にパースしづらい
  - `parse`/`format` が曖昧な `Date`

- **標準化・互換性の負債**
  - WebIDL の言語中立ゆえの API 一貫性の欠如
  - TC39 における動的型/静的型の両立志向が議論を複雑化
  - IE 時代のフォールバックが未だ世界中に残存

### 画像

- スレッド内の添付画像（リストのビジュアル化）

![Image](https://pbs.twimg.com/media/Gxrww-0awAMit-o?format=png&name=large)

### 結論/示唆

- 歴史的経緯と後方互換性維持の結果として、JS/TS には実務での摩擦要因が多層に残存。
- 問題意識を共有することで、設計判断・コード規約・型設計・ランタイムガード導入などの改善に寄与しうる。
