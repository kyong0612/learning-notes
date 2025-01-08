# Refactoring with Codemods to Automate API Changes

ref: <https://martinfowler.com/articles/codemods-api-refactoring.html>

**筆者**: Juntao QIU (ソフトウェアエンジニア、Atlassian)

## 概要

リファクタリングは、コードの理解、保守、拡張を容易にするために行う重要な作業です。しかし、大規模または分散コードベースに対して破壊的なAPI変更を加える場合、手動での変更には限界があります。Codemodを用いることで、AST（抽象構文木）を利用し、大規模なコード変更を正確かつ効率的に自動化できます。

このドキュメントでは、Codemodを活用してAPI変更を管理する方法、具体的な使用例、作成手順、そして大規模に使用する際の注意点を説明します。

---

## 目次

1. 破壊的API変更の課題
2. Codemodとは
3. jscodeshiftを使用したJavaScriptコードベースのリファクタリング
4. 古いFeature Toggleの削除
   - ASTの理解
   - Codemodの作成手順
5. Codemodによるコード品質と保守性の向上

---

## 1. 破壊的API変更の課題

### 背景

ライブラリ開発者は、ユーザーのニーズに応じてAPIを拡張または変更する必要があります。しかし、この変更が大規模に広がると、次のような課題が発生します。

- **変更の影響範囲の特定が困難**: IDEの単純な検索・置換では対処できない場合がある。
- **移行作業の負担**: ユーザーに移行を任せる方法は規模が大きくなると非効率。

### Reactの事例

Reactでは、クラスコンポーネントから関数コンポーネントへの移行がありました。この移行をCodemodが支援し、ユーザーの負担を軽減しました。

---

## 2. Codemodとは

**Codemod（コードモディフィケーション）**とは、コードを新しいAPIや標準に準拠させるための自動スクリプトです。Facebookで初めて開発され、次の手順でコードを変換します。

1. **コードをASTに変換**: コードを木構造に解析。
2. **変換処理を適用**: ASTを操作して変更を加える。
3. **コードに再変換**: ASTを元のコード形式に戻す。

以下に、ASTを用いたCodemodの基本的なフローを示します。

---

## 3. jscodeshiftを使用したJavaScriptコードベースのリファクタリング

`jscodeshift`はFacebookが提供するツールで、AST操作を簡単にします。これを用いることで、API変更やリファクタリングを効率的に実施可能です。

---

## 4. 古いFeature Toggleの削除

### 使用例

以下のコードを対象とし、不要なFeature Toggleを削除します。

#### 変更前

```javascript
const data = featureToggle('feature-new-product-list') ? { name: 'Product' } : undefined;
```

#### 変更後

```javascript
const data = { name: 'Product' };
```

### ASTの理解

AST Explorerを利用し、対象コードのAST構造を視覚化することで、操作対象のノードを特定します。

Codemodの作成手順

以下は、jscodeshiftを使用して実装したCodemodの例です。

```javascript
module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.ConditionalExpression, {
      test: {
        callee: { name: "featureToggle" },
        arguments: [{ value: "feature-new-product-list" }],
      },
    })
    .forEach((path) => {
      j(path).replaceWith(path.node.consequent);
    });

  return root.toSource();
};

```

### テストの記述

Codemodが正しく機能するかをテストするため、defineInlineTestを使用します。

```javascript
const transform = require("../remove-feature-new-product-list");

defineInlineTest(
  transform,
  {},
  `
  const data = featureToggle('feature-new-product-list') ? { name: 'Product' } : undefined;
  `,
  `
  const data = { name: 'Product' };
  `,
  "delete the toggle feature-new-product-list in conditional operator"
);
```

## 5. Codemodによるコード品質と保守性の向上

Codemodは以下のメリットをもたらします。

- 技術的負債の削減: 古い機能や非推奨APIの除去を効率化。
- コーディング標準の強制: 一貫したコーディング規約を自動適用。

定期的にCodemodを使用することで、コードベースを最新の状態に保ちやすくなります。

## 参考リンク

- AST Explorer
- jscodeshift GitHub
- Feature Toggleの記事
