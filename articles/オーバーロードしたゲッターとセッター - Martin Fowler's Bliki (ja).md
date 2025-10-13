---
title: "オーバーロードしたゲッターとセッター - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/OverloadedGetterSetter"
author:
  - "Martin Fowler"
  - "ooharak (翻訳者)"
published: 2011-08-02
created: 2025-10-13
description: "JavaScriptやSmalltalkで見られる、getterとsetterに同じ関数名を使う習慣について、Martin Fowlerが批判的に考察した記事。データ取得と設定は根本的に異なる操作であるため、名前を明確に区別すべきであると主張。C#やRubyのプロパティ構文を理想的な実装例として紹介している。"
tags:
  - "API design"
  - "JavaScript"
  - "Smalltalk"
  - "getter/setter"
  - "コーディング規約"
  - "bad things"
---

## 概要

JavaScriptのjQueryなどで採用されている、getterとsetterに同じ関数名を使う習慣（例：`$("#banner").height()` で取得、`$("#banner").height(100)` で設定）について、Martin Fowlerが問題点を指摘した記事です。この規約はSmalltalkに由来するものですが、JavaScriptにおいては特に問題があると論じています。

## 主要な論点

### 1. データ取得とデータ設定は本質的に異なる操作

- **データを取得する行為と設定する行為は根本的に異なる**ため、名前も明確に異なるべき
- getterとsetterの区別が曖昧だと、コードの意図が不明確になる
- これは[UniformAccessPrinciple](/UniformAccessPrinciple)（統一アクセス原則）に従いつつも、実装方法は問わない

### 2. JavaScriptにおける特有の問題

**Smalltalkとの違い**：

- Smalltalkは引数の数に基づくオーバーロードが可能（`height` と `height: 100` は異なる名前として扱われる）
- JavaScriptは言語機構としてオーバーロードをサポートしないため、getterとsetterが単一のメソッドとして現れる

**曖昧さの問題**：

- `$("#banner").css('height')` のような記述を見ると、一見setterのように見える
- 実際にはこれはgetterであり、setterとして使うには `css('height', 100)` とする必要がある
- この区別はAPIの知識がなければわからない

**FlagArgumentの問題**：

- 追加の引数の有無で動作が変わるのは、[FlagArgument](/FlagArgument)と同様の「悪しき事(Bad Thing)」

### 3. 各言語における実装アプローチ

**評価の高い方法（C#とRuby）**：

```
banner.height      // getter
banner.height = 100  // setter
```

- 代入演算子（=）を使うことで、値を変更していることを明確に示せる
- getterで=を使うことはないため、曖昧さが生じない
- **著者が最も推奨するアプローチ**

**Javaの方法**：

```
getHeight()
setHeight(100)
```

- 明示的だが冗長で「醜い」とFowlerは評価

**著者推奨のJavaScript向けアプローチ**：

```
banner.height()        // getter（裸の値）
banner.setHeight(100)  // setter（明確なプリフィクス）
```

- JavaScriptがプロパティ構文をサポートしない場合の次善策
- getterには裸の値を使い、setterには明確なプリフィクスをつける

### 4. 言語規約への従属

**実用的な判断**：

- 理想的なアプローチがあっても、使用言語の規約には従わざるを得ない
- Smalltalkを書く場合は依然として `height: 100` を使用する（規約との整合性のため）
- JavaScriptの場合、特に強力な規約が確立されていないため、jQueryの方式を避ける選択肢がある

## 重要な結論

1. **明確性の原則**：getterとsetterは異なる名前を持つべきである
2. **言語サポート**：理想的な実装は言語がプロパティ構文をサポートするか否かに依存する
3. **実用主義**：確立された規約がある場合はそれに従うべきだが、JavaScriptのように規約が弱い場合は、より明確な方法を選択できる
4. **FlagArgument回避**：引数の有無で動作が変わる設計は避けるべき

## 技術的詳細

- 記事で言及される「オーバーロード」は厳密にはSmalltalkではオーバーロードではない（`height` と `height:` はコロンのため別の名前）
- [UniformAccessPrinciple](/UniformAccessPrinciple)（Meyerの統一アクセス原則）への言及
- [FlagArgument](/FlagArgument)パターンとの関連性

## 制限事項

- この記事は2011年の観点であり、現代のJavaScriptはES6以降のgetterとsetterプロパティをサポートしている
- 各言語やフレームワークのコミュニティには既存の規約があり、それを無視することは現実的でない場合がある
