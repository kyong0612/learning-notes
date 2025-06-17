---
title: "What the Fork is the React Virtual DOM"
source: "https://maggieappleton.com/react-vdom/"
author:
  - "Maggie Appleton"
published: 
created: 2025-06-17
description: "React Virtual DOMの仕組みを視覚的に説明したイラスト付きの学習ノート。DOM、Virtual DOM、Reactアプリケーションが独立したシステムとして相互作用する様子を図解で解説。"
tags:
  - "React"
  - "Virtual DOM"
  - "JavaScript"
  - "Web Development"
  - "Illustrated Notes"
  - "Frontend"
  - "UI Runtime"
---

## 概要

この記事は、React Virtual DOMの概念を視覚的に説明したMaggie Appletonによるイラスト付きの学習ノートです。ReactのVirtual DOMシステムがどのように動作するかを理解しやすい図解で説明しています。

## 重要な免責事項

**注意**: Reactチームはもはや「Virtual DOM」をReactの内部動作を理解するメンタルモデルとして使用していません。

- Dan Abramovが書いた[React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)の詳細説明を参照することが推奨されています
- React公式ドキュメントには[Virtual DOM](https://reactjs.org/docs/faq-internals.html)についてのセクションがありますが、Reactエコシステムを学ぶ上で必須の概念ではありません
- この説明は基本概念（ReactがDOM変更前に何を変更する必要があるかを判断する）の理解には役立ちますが、より詳細な説明は他のソースを参照してください

## Virtual DOMの基本概念

### 1. Reactが高速な理由

![One of the reasons React is so darn fast at updating changes is that it uses a virtual DOM](https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,f_auto,q_auto:good,w_1200/v1592262854/maggieappleton.com/egghead-course-notes/react-vdom/ReactVDom_1_2x.png)

ReactがUI更新で高速性を発揮する理由の一つは、Virtual DOMを使用していることです。

### 2. Reactコードの相互作用

![All the code we write in React only interacts with this virtual DOM](https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,f_auto,q_auto:good,w_1200/v1592262852/maggieappleton.com/egghead-course-notes/react-vdom/ReactVDom_2_2x.png)

私たちがReactで書くすべてのコードは、この Virtual DOM とのみ相互作用します。

### 3. 実際のDOMの変更が遅い理由

![This is helpful because passing the actual DOM lots of changes is slow](https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,f_auto,q_auto:good,w_1200/v1592262852/maggieappleton.com/egghead-course-notes/react-vdom/ReactVDom_3_2x.png)

これは、実際のDOMに多くの変更を渡すのが遅いため有効です。

### 4. 差分アルゴリズム（Diffing）

![React's DOM runs a diffing algorithm](https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,f_auto,q_auto:good,w_1200/v1592262854/maggieappleton.com/egghead-course-notes/react-vdom/ReactVDom_4_2x.png)

ReactのVirtual DOMは差分アルゴリズムを実行します。

## 主要な学習ポイント

1. **システムの独立性**: DOM、Virtual DOM、Reactアプリケーションは、一つの大きなメッシュではなく、互いに対話する独立したシステムです

2. **パフォーマンスの向上**: Virtual DOMを使用することで、実際のDOMへの変更を最小限に抑え、アプリケーションの高速化を実現します

3. **抽象化**: 開発者はVirtual DOMを通じてUIの状態を管理し、実際のDOM操作の複雑さから解放されます

## 関連リソース

記事では以下の関連コンテンツも紹介されています：

- [Building Custom React Hooks](/customhooks)
- [JSX is a Lovechild](/jsx)
- [What the Fork is Babel?](/babel)

## 現在の理解における位置づけ

この説明は、Reactの基本概念を理解する上で有用ですが、現在のReactの内部実装をより正確に理解するには、公式ドキュメントやDan Abramovの詳細な説明を参照することが重要です。Visual DOMの概念は、Reactの動作原理を学ぶ初歩的な段階では有効なメンタルモデルとして機能します。
