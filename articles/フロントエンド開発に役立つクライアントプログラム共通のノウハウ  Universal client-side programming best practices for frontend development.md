---
title: "フロントエンド開発に役立つクライアントプログラム共通のノウハウ / Universal client-side programming best practices for frontend development"
source: "https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development"
author:
  - "成瀬 允宣"
published: 2025-09-21
created: 2025-09-22
description: "フロントエンドカンファレンス東京2025における発表資料。GUIクライアント開発のノウハウのうち、フロントエンド開発にも活かせる普遍的なベストプラクティスについて解説されています。"
tags:
  - "clippings"
  - "Frontend"
  - "GUI"
  - "SoftwareDesign"
  - "GameDevelopment"
---

本資料は、nrs（成瀬 允宣）氏による、フロントエンド開発に応用可能なクライアントサイドプログラミングの普遍的なノウハウを解説した発表です。Windowsアプリ開発からゲーム開発（Flash/ActionScript）、各種JavaScriptフレームワークまで、多岐にわたる開発経験から得られた知見がまとめられています。

## イントロダクション (スライド 1-14)

- **発表者**: nrs (成瀬 允宣) 氏、株式会社コドモン CTO。
- **背景**: 発表者の多様なクライアントサイド開発経験を通じて、異なるプラットフォームでも共通する課題や解決策が存在することを示す。

[![スライド 1](https://files.speakerdeck.com/presentations/6800415386f048de8afe6f2fd080343d/slide_0.jpg)](https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development?slide=1)

## ゲーム開発現場の過酷な実態 (スライド 15-52)

ゲーム開発の現場、特にコンシューマゲームやソーシャルゲーム黎明期の過酷な開発スタイルを振り返り、そこから得られた教訓の重要性を強調します。

- **朝令暮改は日常茶飯事**: ディレクターの指示が頻繁に変わり、迅速な仕様変更への対応が求められる。
- **保守性の欠如**: 一度リリースすると更新が困難なコンシューマゲーム開発の文化から、保守性という概念が希薄であった。
- **テスト文化の不在**: 自動テストよりも、見た目の確認を重視したデバッガーによる手動テストが主流だった。

[![スライド 15](https://files.speakerdeck.com/presentations/6800415386f048de8afe6f2fd080343d/slide_14.jpg)](https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development?slide=15)

## 現場経験から得られた教訓 (スライド 53-186)

過酷な現場で培われた、現代のフロントエンド開発にも通じる設計原則やパターンについて詳述します。

- **Single Source of Truth (SSOT)**: データを操作する箇所を一つに限定する原則。データの信頼性を担保し、不整合を防ぐ。これはReactの`props down, events up`にも通じる考え方。
- **使われるコンポーネントの条件**:
    1. **めんどくさくないこと (Progressive Disclosure)**: HTMLの`<button>`のように、最も一般的なユースケース（80%）を簡単（20%の労力）に実現できるべき。
    2. **見つけられること (Discoverability)**: StorybookやPlaygroundなどを開発プロセスに組み込み、コンポーネントの存在をチームが自然に発見できる仕組みが重要。
- **StateMachineの実装**: 複雑な状態遷移を管理し、イベントの優先順位付けや処理の散在を防ぐために有効。
- **Mediatorパターン**: コンポーネント間の密な依存関係を排除し、親コンポーネント等が仲介役となることで、複雑度をO(n^2)からO(n)に低減させる。
- **イベントヘルの回避**: イベントハンドラから無秩序に別のイベントを連鎖させると、デバッグ不能な「イベントヘル」に陥る。イベントのスコープを限定することが重要。
- **グローバル変数の危険性**: `static`やグローバル変数の多用は、状態の追跡を困難にし、コードベースを脆くする。
- **ページ遷移の責務の分離**: 固定的なナビゲーションはコンポーネントに、文脈に依存する遷移はページレベルのコンポーネントに持たせることで見通しを良くする。

[![スライド 56](https://files.speakerdeck.com/presentations/6800415386f048de8afe6f2fd080343d/slide_55.jpg)](https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development?slide=56)

## GUIとデザインパターン (スライド 187-209)

GUIアーキテクチャの変遷（MVC, MVP, MVVM）を振り返り、その中心にあるObserverパターンの重要性を解説します。

- **MV* パターンの本質**: すべてデータ(Model)とUI(View)を分離し、両者の同期を取るためのパターンである。
- **Observerパターンによる柔軟な対応**: 頻繁な仕様変更（朝令暮改）に対して、`IObservable<T>`のような仕組みを用いることで、データの変更を購読しているコンポーネントに自動的に伝搬させ、迅速かつ安全な実装を可能にする。

[![スライド 196](https://files.speakerdeck.com/presentations/6800415386f048de8afe6f2fd080343d/slide_195.jpg)](https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development?slide=196)

## まとめ (スライド 210-214)

- **朝令暮改を朝礼朝改で返す**: 優れた設計は、仕様変更への対応速度を劇的に向上させ、ビジネス要求に素早く応える力となる。
- **普遍的なノウハウの価値**: 特定のフレームワークに依存しないGUI開発の基本原則を学ぶことで、技術の流行り廃りに左右されない、堅牢なアプリケーションを構築する力が身につく。

[![スライド 210](https://files.speakerdeck.com/presentations/6800415386f048de8afe6f2fd080343d/slide_209.jpg)](https://speakerdeck.com/nrslib/universal-client-side-programming-best-practices-for-frontend-development?slide=210)
