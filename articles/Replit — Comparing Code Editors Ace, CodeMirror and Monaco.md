---
title: "Replit — Comparing Code Editors: Ace, CodeMirror and Monaco"
source: "https://blog.replit.com/code-editors"
author:
  - "[[Faris Masad]]"
published: 2021-12-13
created: 2026-01-27
description: "ReplitがAce、Monaco、CodeMirror 6という3つのブラウザベースコードエディタを本番環境で使用した経験に基づく詳細な比較記事。各エディタの安定性、拡張性、パフォーマンス、モバイル対応などを評価し、最終的にCodeMirror 6への移行理由を解説。"
tags:
  - "code-editor"
  - "web-development"
  - "ace"
  - "monaco"
  - "codemirror"
  - "replit"
  - "ide"
---

## 概要

Replitのエンジニア Faris Masad が、約10年にわたるReplitでのコードエディタ運用経験を基に、**Ace**、**Monaco**、**CodeMirror 6** の3つのブラウザベースコードエディタを詳細に比較した記事。最終的にCodeMirror 6への移行を決定した背景と理由を解説している。

---

## Replitにおけるコードエディタの歴史

### Phase 1: Ace（2011年〜2017年）

![OG Replit UI](https://cdn.sanity.io/images/bj34pdbp/migration/95fa6a2cc105d6582e4277514252a93c3e468816-2144x1296.png?w=3840&q=100&fit=max&auto=format)
*初期のReplit UI*

- **2011年頃**: 初期のReplitはコードエディタがなく、純粋なREPLインターフェースだった
- **Ace採用**: Cloud9がリリースした高機能・高性能なWebコードエディタとして採用
- **課題**: Amazon によるCloud9買収後、オープンソースプロジェクトの優先度が下がり、メンテナーが1人だけに。APIも時代遅れに感じられるようになった

### Phase 2: Monaco（2017年〜）

![Monaco Editor](https://cdn.sanity.io/images/bj34pdbp/migration/3874b4c94e9dd1cd3ad24ae25e2626951a84c689-918x592.png?w=3840&q=100&fit=max&auto=format)
*Monaco Editor（設定なしの標準状態）*

**移行の動機:**
- VSCodeを支えるエディタとして、最新機能やアップデートを期待
- モダンで洗練されたUI
- HTML/CSS/JavaScriptの優れたIntelliSense
- LSP対応のAPIが充実

**直面した問題:**

1. **言語モード不足**: VSCodeにある言語モードの多くがNode.js/Electron依存で、ブラウザで動作しなかった
   - Replitチームが Scala, Julia, Scheme, Clojure などを追加
   - Aceの言語モードを利用するアダプタを作成

2. **ビルドツールとの相性が悪い**:
   - Webエコシステムとの統合が困難
   - Webpack DLLとして事前コンパイルが必要
   - Next.jsへの移行時に問題が悪化
   - **バンドルサイズが約5MB（非圧縮）** と巨大

3. **モバイル対応が困難**:
   - モバイルでの動作が非常に悪い
   - VSCodeコードベースが複雑すぎて改修困難
   - 結局 **デスクトップ用Monaco + モバイル用Ace** の2エディタ体制に
   - 新機能を両方に移植する必要があり、技術的負債が蓄積

### Phase 3: CodeMirror 6（2018年〜現在）

![CodeMirror on Replit mobile](https://cdn.sanity.io/images/bj34pdbp/migration/57948de0672be7b8b7b3bedfd186cbfa4b09534e-409x823.png?w=3840&q=100&fit=max&auto=format)
*ReplitモバイルでのCodeMirror*

**CodeMirror 6への移行理由:**

- **2018年**: Marijn Haverbekeが CodeMirror 6 のリライトを発表
- **主な目的**: タッチデバイスのサポート（ネイティブブラウザのテキスト編集 `contentEditable` を活用）
- **ProseMirrorに触発されたAPI設計**: モジュラー、プラガブル、関数型
- Replitは開発スポンサーとなり、個人的にも資金提供

**移行結果:**
- モバイルユーザーの**リテンション率が70%向上**
- 拡張性により将来の機能追加が容易に

---

## エディタ比較（Head-to-Head）

各項目を1〜3のスコアで評価（3が最高）

### 安定性（Stability）

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 3 | 10年以上の実績。破壊的変更なし。非常に安定 |
| **Monaco** | 2 | 編集体験は安定。ただしAPIに微妙な変更があり、まだv1.0.0未リリース |
| **CodeMirror 6** | 1 | ベータ版。バグはあるがMarijnが迅速に対応。APIは安定化の方向 |

### 初期設定での体験（Out of the box experience）

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 2 | 多機能・多言語対応。UIがやや古い |
| **Monaco** | 3 | 洗練されたUI。HTML/CSS/JSの優れたIntelliSense |
| **CodeMirror 6** | 2 | 設定が必要（モジュラー設計のトレードオフ）。`basic-setup`パッケージあり |

### モジュラリティ・バンドル・フットプリント

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 2 | スリムでモジュラー。遅延読み込み可能。ただし独自モジュールシステム |
| **Monaco** | 1 | **約5MBの巨大バンドル**。遅延読み込み困難。ビルドシステムに特別な設定が必要 |
| **CodeMirror 6** | 3 | モダンな技術で構築。ES6モジュールで直接インポート可能。遅延読み込みが容易 |

### 拡張性と高度な機能

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 2 | 多くの設定オプション。APIはやや古いが堅実。コードベースが読みやすく、モンキーパッチも容易 |
| **Monaco** | 2 | 多くの設定オプションがあるが、拡張ポイントが限定的。コードベースが複雑でモンキーパッチが困難 |
| **CodeMirror 6** | 3 | **拡張性を設計原則として構築**。コア自体が拡張可能なテキストエリア。シンタックスハイライトや行番号も拡張として実装 |

### コミュニティとドキュメント

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 2 | 豊富なエコシステム。全言語対応。APIドキュメントは十分だが最高ではない |
| **Monaco** | 2 | 2018年頃に盛り上がったが減速。公式ガイドがなく、入門が困難 |
| **CodeMirror 6** | 3 | コミュニティに活気。優れたドキュメントと例。拡張機能のソースが参考資料になる |

### パフォーマンス

| エディタ | スコア | 評価 |
|---------|--------|------|
| **Ace** | 3 | ブラウザ・マシンが非力だった時代に構築され、非常に高速 |
| **Monaco** | 2 | 最適化されているが重い。低スペックマシンで問題が発生 |
| **CodeMirror 6** | 3 | 非常に高速。パフォーマンスに注力した設計 |

### モバイル対応

| エディタ | 評価 |
|---------|------|
| **Ace** | まあまあ使える程度 |
| **Monaco** | **モバイルでは使用不可** |
| **CodeMirror 6** | **モバイル対応の最良選択**。WebViewコンポーネントとしてネイティブアプリにも適用可能 |

---

## 総合評価まとめ

| カテゴリ | Ace | Monaco | CodeMirror 6 |
|---------|-----|--------|--------------|
| 安定性 | 3 | 2 | 1 |
| 初期体験 | 2 | 3 | 2 |
| バンドル | 2 | 1 | 3 |
| 拡張性 | 2 | 2 | 3 |
| コミュニティ | 2 | 2 | 3 |
| パフォーマンス | 3 | 2 | 3 |
| **合計** | **14** | **12** | **15** |

---

## 重要な結論

1. **CodeMirror 6 が総合的に最も優れている**: 特にモジュラリティ、拡張性、モバイル対応で他を圧倒

2. **Monaco の限界**: VSCodeのコードベースとの結合が強すぎ、Web向けとしては扱いにくい。バンドルサイズの大きさも問題

3. **Ace は依然として有効**: 安定性とパフォーマンスは優秀。レガシープロジェクトには適している

4. **モバイル対応が必要なら CodeMirror 6 一択**: 他のエディタはモバイルで実用に耐えない

5. **Replitの成果**: CodeMirror 6 への移行で、モバイルユーザーのリテンション率が **70% 向上**

---

## Replitのオープンソース貢献予定

- Vim Mode
- Emacs Mode
- LSP client
- Indentation Markers
- Color Picker for CSS
- 各種言語パーサー

---

## 関連情報

- [Ace Editor](https://ace.c9.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [CodeMirror 6](https://codemirror.net/6/)
- [CodeMirror 6 設計ドキュメント](https://codemirror.net/6/design.html)
