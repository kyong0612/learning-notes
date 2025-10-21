---
title: "Next.jsにおけるディレクトリ構成: デコロケーション vs コロケーション – AichiLog"
source: "https://aichi.blog/nextjs-directory-structure-decolocation-vs-colocation/"
author:
  - "[[愛知郎]]"
published: 2023-10-23
created: 2025-10-21
description: "Next.jsプロジェクトでのディレクトリ構成における「デコロケーション」と「コロケーション」の2つのアプローチを比較。プロジェクトの規模やチームの作業スタイルに応じた最適な選択方法を、具体的なディレクトリ構成例とともに解説します。"
tags:
  - "Next.js"
  - "React"
  - "ディレクトリ構成"
  - "アーキテクチャ"
  - "ベストプラクティス"
---

## 概要

Next.jsプロジェクトでのディレクトリ構成には「デコロケーション」と「コロケーション」の2つのアプローチがあります。それぞれにメリット・デメリットがあり、プロジェクトの規模やチームの作業スタイルによって最適な選択が変わります。

## デコロケーション（Decolocation）

### 概要と特徴

関連するリソース（コンポーネント、スタイル、テスト、APIなど）を**別々のディレクトリに配置**する方法です。特に小規模なプロジェクトや、特定の種類のファイルを一箇所で一元管理したい場合に有用です。

### ディレクトリ構成例

```
src/
├─ features/
│   ├─ FeatureA.tsx           # 機能A
│   ├─ FeatureB.tsx           # 機能B
│   └─ SubComponent.tsx       # サブコンポーネント
│
├─ components/                # 共通コンポーネント
│   ├─ SharedComponent.tsx
│   └─ ...
│
├─ styles/                    # スタイルファイル
│   ├─ FeatureA.styles.ts
│   ├─ SubComponent.styles.ts
│   └─ ...
│
└─ tests/                     # テストファイル
    ├─ FeatureA.test.ts
    ├─ SubComponent.test.ts
    └─ ...
```

### メリット

- **一元管理**: 同じ種類のファイルが一箇所にまとまっているため、一覧性が高く管理が容易
- **小規模プロジェクト向け**: プロジェクトが小規模であれば、この方法で十分に管理が行える

### デメリット

- **関連性が低い**: 関連するファイルが物理的に離れているため、開発時に多くのディレクトリを行き来する必要がある
- **スケーラビリティの問題**: プロジェクトが大きくなると、管理が煩雑になる可能性がある

## コロケーション

### 概要と特徴

関連するリソースを**一箇所にまとめる**方法です。プロジェクトの可読性と保守性が向上し、特に大規模なプロジェクトや複数人での開発において有用です。

### ディレクトリ構成例

```
app/
├─ (root)/                   # ドメインルート用ディレクトリ
│   ├─ page.tsx             # ドメインルートのページ
│   ├─ _components/          # ドメインルート専用のコンポーネント
│   │   └─ Navbar/
│   │       ├─ index.tsx
│   │       ├─ index.module.css
│   │       └─ ...
│   └─ _types/               # ドメインルート専用の型定義
│       └─ types.ts
│
├─ TodoList/                 # Todoリストページ用ディレクトリ
│   ├─ page.tsx
│   ├─ _components/          # Todoリスト専用のコンポーネント
│   │   ├─ TodoItem/
│   │   │   ├─ index.tsx
│   │   │   ├─ index.module.css
│   │   │   └─ ...
│   │   └─ ...
│   └─ _types/
│       └─ types.ts
│
components/                   # 共通コンポーネント用ディレクトリ
├─ Button/
│   ├─ page.tsx
│   ├─ index.module.css
│   └─ ...
```

### メリット

- **可読性**: 関連するファイルが近くにあるため、コードの流れが理解しやすい
- **保守性**: 一箇所にまとまっているため、変更やリファクタリングが容易
- **開発速度**: ファイルの行き来が減少し、開発がスムーズに行える

### デメリット

- **複雑性**: 大規模なプロジェクトで多くの関連ファイルが一箇所に集まると、そのディレクトリ自体が複雑になる可能性がある
- **ファイル探索**: 関連ファイルが多い場合、特定のファイルを見つけるのが少し難しくなるかもしれない

## 選択の指針

### 小規模プロジェクト

**デコロケーション**が適しています。管理がシンプルで、必要なリソースがすぐに見つかります。

### 大規模プロジェクトや複数人での開発

**コロケーション**が有用です。可読性と保守性が高く、開発効率も向上します。

## Todoアプリでの具体例

### デコロケーション版

```
src/
├─ pages/
│   ├─ HomePage.tsx
│   ├─ TodoListPage.tsx
│   └─ AboutPage.tsx
│
├─ components/
│   ├─ Navbar/
│   │   ├─ index.tsx
│   │   ├─ index.module.css
│   │   └─ ...
│   ├─ TodoItem/
│   │   ├─ index.tsx
│   │   ├─ index.module.css
│   │   └─ ...
│   └─ Button/
│       ├─ index.tsx
│       ├─ index.module.css
│       └─ ...
│
├─ styles/
│   ├─ common.module.css
│   └─ ...
│
└─ types/
    ├─ commonTypes.ts
    └─ ...
```

### コロケーション版

```
app/
├─ (root)/
│   ├─ page.tsx
│   ├─ _components/
│   │   └─ Navbar/
│   │       ├─ index.tsx
│   │       ├─ index.module.css
│   │       └─ ...
│   └─ _types/
│       └─ types.ts
│
├─ TodoList/
│   ├─ page.tsx
│   ├─ _components/
│   │   ├─ TodoItem/
│   │   │   ├─ index.tsx
│   │   │   ├─ index.module.css
│   │   │   └─ ...
│   │   └─ ...
│   └─ _types/
│       └─ types.ts
│
├─ About/
│   └─ page.tsx
│
components/
├─ Button/
│   ├─ page.tsx
│   ├─ index.module.css
│   └─ ...
│
types/
└─ globalTypes.ts
```

## まとめ

プロジェクトの規模、チームの作業スタイル、将来のスケーラビリティなどを考慮して、最適なディレクトリ構成を選択することが重要です。一般的には、小規模プロジェクトではデコロケーション、大規模プロジェクトではコロケーションが推奨されます。
