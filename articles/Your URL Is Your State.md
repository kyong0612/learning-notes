---
title: "Your URL Is Your State"
source: "https://alfy.blog/2025/10/31/your-url-is-your-state.html"
author: "Ahmad Alfy"
published: 2025-10-31
created: 2025-11-04
description: "A deep dive into how thoughtful URL design can enhance usability, shareability, and performance. Learn what state belongs in URLs, common pitfalls to avoid, and practical patterns for modern web apps."
tags:
  - "web-development"
  - "frontend"
  - "url-design"
  - "state-management"
  - "ux"
---

## 概要

この記事は、URLを単なるウェブアドレスではなく、**アプリケーション状態管理の優雅なツール**として活用することの重要性を論じています。著者Ahmad Alfyは、PrismJSの構文ハイライター設定をURLに含める実装を例に、データベース、クッキー、localStorageなしで状態を保存・共有できる設計の価値を示しています。

## 主要なセクション

### URLの本質的価値

URLが提供する4つの核心的な価値：

- **共有可能性**: リンクを送信するだけで同一のビューを他のユーザーと共有できる
- **ブックマーク機能**: 特定の瞬間や設定を保存できる
- **ブラウザ履歴**: 戻るボタンが適切に機能する
- **ディープリンキング**: アプリケーションの特定の状態に直接遷移できる

### URL構造の活用方法

#### 1. パスセグメント

階層的なリソースを表現：

```text
/users/123/posts
```

#### 2. クエリパラメータ

UI設定やページング処理に最適：

```text
?theme=dark&lang=en
?page=2&limit=20
```

#### 3. アンカーフラグメント

GitHubのコードハイライトのような特定の位置を指定：

```text
#L20-L35
```

### 実装パターン

**配列表記**:

```text
?tags[]=frontend&tags[]=react
```

**ブール値フラグ**:

```text
?debug=true
?mobile（パラメータの存在自体がtrue）
```

### URL状態に適した情報と非適切な情報

#### 推奨される情報

- 検索フィルタ
- ページング情報
- 表示モード（リスト/グリッド）
- 日付範囲
- アクティブなタブ
- 機能フラグ

#### 非推奨の情報

- パスワード
- 未保存のフォーム入力
- 機密情報
- 一時的なUI状態（ホバー、フォーカスなど）

### JavaScript実装のベストプラクティス

#### デフォルト値の処理

デフォルト値はURLに含めず、コード側で処理する方針を推奨。URLを簡潔に保ち、意味のある状態変更のみを反映させる。

#### デバウンス処理

検索のような高頻度更新では、`replaceState`を使用して履歴汚染を防ぐ：

- **pushState**: 区別される操作用（フィルタ変更、ページネーション）
- **replaceState**: 洗練された更新用（入力中の検索）

### 実世界の事例

- **GitHub**: `#L108-L136`で行番号範囲をハイライト
- **Google Maps**: 座標とズームレベルをURL符号化
- **Figma**: キャンバス位置、ズーム、選択要素をURL内に保存
- **Eコマース**: フィルタと価格範囲の永続化

### 避けるべきアンチパターン

1. **メモリのみの状態管理**: ページ更新で状態が失われる
2. **URLへの機密データ埋め込み**: サーバーログに記録される危険性
3. **不透明なパラメータ命名**: 保守性が低下する
4. **複雑なデータをBase64エンコード**: URLの本来の目的を逸脱する

## 重要な結論

「PrismJSのURLは対話を記録する」という表現で、URLの本質的価値を総括しています。Redux等の高度な状態管理ツールも有用ですが、**シンプルで共有可能なURL設計の価値は過小評価されている**と著者は主張します。

URLSearchParams APIとHistory APIを適切に活用することで、データベースやクッキーに頼らず、ユーザーエクスペリエンスを向上させる状態管理が実現できます。

## 技術的なポイント

- URLSearchParams APIを活用した標準的な実装
- popstateイベントでブラウザ履歴に対応
- pushStateとreplaceStateの使い分け
- デバウンス処理による履歴管理の最適化

この記事は、フロントエンド開発者がURL設計を見直し、より使いやすく、共有可能で、パフォーマンスの高いWebアプリケーションを構築するための実践的なガイドとなっています。
