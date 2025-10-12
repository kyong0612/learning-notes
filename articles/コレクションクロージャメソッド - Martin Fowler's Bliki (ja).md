---
title: "コレクションクロージャメソッド - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/CollectionClosureMethod"
author:
  - "Martin Fowler"
published: 2015-06-25
created: 2025-10-12
description: |
  Smalltalk、Ruby、Pythonなどのクロージャを持つ言語におけるコレクションとクロージャメソッドの強力な組み合わせについて解説。select、collect、inject、detectなど主要なメソッドの使い方と利点を説明し、クロージャを持たない言語（Java、C#）との比較を行う。
tags:
  - "object collaboration design"
  - "API design"
  - "ruby"
  - "language feature"
  - "collection"
  - "closure"
  - "functional programming"
---

## 概要

この記事では、クロージャを持つ言語（Smalltalk、Ruby、Python等）におけるコレクションクラスの強力なメソッド群について解説しています。Martin Fowlerは、Smalltalkで培われた経験から、クロージャを持たないJavaやC#に移行した際に感じた機能の限定性を指摘し、その後Rubyで再びクロージャベースのコレクションメソッドの恩恵を受けられるようになった経緯を説明しています。

## 主要なコレクションクロージャメソッド

### 1. each（内部イテレータ）

最も基本的なメソッドで、コレクションの各要素に対してブロックを実行します。

```ruby
employees.each do |e|
  e.doSomething
end
```

多くの現代的なプログラム言語の`foreach`ステートメントと同等の機能ですが、これは始まりに過ぎません。

### 2. select / find_all（フィルタリング）

条件に合う要素のみを抽出します。

**従来の書き方:**

```ruby
managers = []
for e in employees
  if e.manager?
    managers << e
  end
end
```

**クロージャメソッドを使った書き方:**

```ruby
managers = employees.select {|e| e.manager?}
```

- Smalltalkでも`select`と呼ばれていた
- Rubyには`find_all`というエイリアスも存在
- 逆の動作をする`reject`メソッド（falseを返す要素のコレクションを返す）も利用可能

### 3. collect / map（変換）

各要素に対してメソッド呼び出しを行い、結果のコレクションを返します。

**従来の書き方:**

```ruby
offices = []
for e in employees
  offices << e.office
end
```

**クロージャメソッドを使った書き方:**

```ruby
offices = employees.collect {|e| e.office}
```

- Smalltalkでは`collect`、Lispでは`map`と呼ばれる
- Rubyでは両方のエイリアスが利用可能

### 4. List Comprehension（リスト内包表現）

Pythonなどの関数型言語で採用されている統合的アプローチ。

```python
managers = [e for e in employees if e.isManager]
offices = [e.office for e in employees]
managersOffices = [e.office for e in employees if e.isManager]
```

**長所**: selectとcollectを簡単に組み合わせられる

**短所**: 扱えるのはselectとcollectのみで、他のブロック機能には対応していない

Rubyでは以下のようにメソッドチェーンで実現可能:

```ruby
managersOffices = employees.select{|e| e.manager?}.map {|m| m.office}
```

### 5. all? / any?（条件チェック）

全要素または一部の要素が条件にマッチするかを確認します。

```ruby
allManagers = employees.all? {|e| e.manager?}
noManagers = ! employees.any? {|e| e.manager?}
```

### 6. partition（分割）

`select`と`reject`を同時に実行し、複数の変数に割り当てます。

```ruby
managers, plebs = employees.partition{|e| e.manager?}
```

### 7. sort / sort_by（ソート）

カスタムの比較ロジックでソートを実行します。

**古いスタイル（ブロック引数2つ）:**

```ruby
sortedEmployees = employees.sort {|a,b| a.lastname <=> b.lastname}
```

`<=>`はスターシップ演算子と呼ばれる比較演算子:

- `a < b`なら`-1`
- `a > b`なら`+1`
- `a == b`なら`0`

**Ruby 1.8以降の新しいスタイル（ブロック引数1つ）:**

```ruby
sortedEmployees = employees.sort_by {|e| e.lastname}
```

### 8. each_with_index

要素の値とインデックスの両方を渡します。

```ruby
employees.each_with_index do |e, index|
  # 要素とインデックスの両方を使用可能
end
```

### 9. find / detect（条件に合う最初の要素を検索）

条件にマッチした最初の要素を返します。

```ruby
volunteer = employees.find {|e| e.steppedForward?}
```

**マッチしない場合の処理:**

- デフォルトでは`nil`を返す
- マッチしなかった場合の処理をラムダで指定可能:

```ruby
volunteer = employees.find(lambda{self.pickVictim}) {|e| e.steppedForward?}
```

**Smalltalkの記法（より読みやすい）:**

```smalltalk
volunteer := employees
               detect: [:each| each hasSteppedForward]
               ifNone: [self pickVictim]
```

Smalltalkのキーワードパラメータにより、複数のブロックでも読みやすくなっています。

### 10. inject（累積処理）

コレクションの累計を出す際に便利で、しばしば理解しにくいと言われるメソッドです。

**従来の書き方（給料の合計）:**

```ruby
total = 0
for e in employees
  total += e.salary
end
```

**injectを使った書き方:**

```ruby
total = employees.inject(0) {|result, e| result + e.salary}
```

`inject`は各要素においてブロックの実行結果を`result`変数に代入し、処理完了後にその値を返します。

## 重要な結論

- **クロージャとコレクションの組み合わせは非常に強力**: これにより簡潔で表現力豊かなコードが書ける
- **クロージャを持たない言語の制限**: Java（当時）やC#などはこれらの恩恵を受けられなかった
- **List Comprehensionの限界**: 統合的アプローチは素晴らしいが、selectとcollectしか扱えず、クロージャメソッドの全機能はカバーできない
- **実践的な推奨事項**: クロージャを持った言語でプログラミングする機会があれば、これらのメソッドを積極的に使うべき

## 参考リンク

- [sumim's smalltalking-tos - コレクションクロージャメソッド](http://d.hatena.ne.jp/sumim/20050803/p1)
- [sumim's smalltalking-tos - Squeak の Smalltalk にあるコレクションブロックメソッド](http://d.hatena.ne.jp/sumim/20050803/p2)
