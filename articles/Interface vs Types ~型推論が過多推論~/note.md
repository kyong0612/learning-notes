---
title: "Interface vs Types ~型推論が過多推論~"
source: "https://speakerdeck.com/hirokiomote/interface-vs-types-xing-tui-lun-gaguo-duo-tui-lun"
author:
  - "[[Speaker Deck]]"
  - "Hiroki Omote"
published: 2025-05-26
created: 2025-05-30
description: "tskaigi 2025 LT Day1で発表したスライドです。TypeScriptの型推論におけるtypeとinterfaceの違いを、実際の開発事例を通じて解説。複雑な交差型によって型推論がanyに落ちる問題と、interfaceを使った解決方法を紹介しています。"
tags:
  - "clippings"
  - "TypeScript"
  - "type-inference"
  - "interface"
  - "performance"
  - "design-system"
---

## 概要

tskaigi 2025 LT Day1で発表されたプレゼンテーション。TypeScriptにおける`type`と`interface`の違いを、実際のデザインシステム開発で遭遇した問題を通じて解説している。

## 発表者について

- **発表者**: omote 表 洋樹（Hiroki Omote）
- **役職**: Design Engineer
- **経歴**: Manager → Tech Lead → Freelancer（2012〜2022年）
- **所属**: Scheeme、BUBO
- **趣味**: マラソン、ガンダム

## 問題の発端：デザインシステムのButtonコンポーネント

### 背景
社内のデザインシステムを配信するため、ポリモーフィックなButtonコンポーネントを作成していた際に、`as="button"` Propを実装。

### 発生した問題
- 開発時は正常に型推論が機能していた
- ビルド時に型が`any`に落ちるという予期せぬ事態が発生
- デザインシステムで`any`型を配信することは重大な問題

### 原因分析
1. **複雑な交差型**: Mantineライブラリの型と自前の型を交差型として組み合わせたことで計算量が爆増
2. **TypeScriptの型システムの限界**: 型の深さや複雑さが一定の閾値を超えると、TypeScriptは型推論を放棄し`any`にフォールバック
3. **再帰的な型の問題**: 特に再帰的にネストが展開される型では、無限に近い計算が発生する可能性がある

## 解決策：interfaceへの変更

### 実施した対策
`type`宣言を`interface`に変更しただけで問題が解決。型定義自体は一切変更していない。

### なぜinterfaceで解決できたのか

1. **typeの交差型は型演算の対象**
   - 型レベルで即座に演算・解決される必要がある
   - 複雑さによって`any`に落ちる可能性が高い

2. **interfaceはマージベースで解決**
   - TypeScriptの型解決の負荷が下がる
   - 「拡張」に近い動作で、型計算を遅延させる
   - 結果として`any`に落ちにくい特性を持つ

## typeとinterfaceの比較

| 項目 | type | interface |
|------|------|-----------|
| **条件型** | 使用可能 | 使用不可 |
| **拡張（継承）** | `&`を使って交差型として合成<br>同名のtypeは許可しない | `extends`で継承可能（複数継承も可）<br>同名のinterfaceを自動で統合 |
| **パフォーマンス（型計算）** | 計算量によっては型爆発の可能性 | 遅延評価するので、パフォーマンスが高い |

## 重要な発見

プレゼンテーション中に、Mantineのドキュメントに以下の記載があることを発見：

> "Polymorphic components have performance overhead for tsserver (no impact on runtime performance)"

最初からドキュメントに記載されていた内容を見落としていたという反省も含まれている。

## まとめ

1. **計算量次第ではinterfaceを使う**: 複雑な型定義では`interface`の方が安全
2. **interfaceは遅延評価**: パフォーマンス面で優位性がある
3. **typeとinterfaceは対立構造ではない**: それぞれに適したユースケースがあり、使い分けが重要
4. **ドキュメントを読むことの重要性**: 多くの問題は既にドキュメントに記載されている

## 教訓

「推論のパフォーマンスで困ったらInterfaceを使いましょう」という実践的なアドバイスとともに、TypeScriptの型システムの深い理解と、公式ドキュメントを確認することの重要性を強調している。