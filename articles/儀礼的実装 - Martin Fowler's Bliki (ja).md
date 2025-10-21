---
title: "儀礼的実装 - Martin Fowler's Bliki (ja)"
source: "https://bliki-ja.github.io/CourtesyImplementation"
author:
  - Martin Fowler
published: 2004-08-12
created: 2025-10-21
description: "クラスを作るとき、機能はそのクラスに合うようなものにしますよね。でも、そうした方が自然だから機能を追加する、ということもあるのです。"
tags:
  - "API design"
  - "design patterns"
  - "composite pattern"
  - "object-oriented design"
  - "clippings"
---

## 概要

**儀礼的実装**（Courtesy Implementation）とは、本来そのクラスの役割には必ずしも合致しないが、システム全体のコードをシンプルにするために追加される機能のことです。Martin Fowlerが2004年に提唱したこの概念は、特にコンポジットパターンなどの設計パターンで効果を発揮します。

## コンポジットパターンでの具体例

### 問題のあるコード

箱（Box）の中に別の箱や象（Elephant）が入っている構造で、全部で何頭の象が入っているかを数えたい場合を考えます。

```ruby
class Box < Node
  def num_elephants
    result = 0
    @children.each do |c|
      if c.kind_of? Elephant
        result += 1
      else
        result += c.num_elephants
      end
    end
    return result
  end
end
```

このコードには `kind_of?` による型判定が含まれており、好ましくありません。

### 儀礼的実装による解決

象に「象がいくつ入っているか？」というメソッドを追加します。現実世界では不自然に見えますが、コードはシンプルになります。

```ruby
class Box < Node
  def num_elephants
    result = 0
    @children.each do |c|
      result += c.num_elephants
    end
    return result
  end
end

class Elephant < Node
  def num_elephants
    return 1  # 儀礼的実装
  end
end
```

## 数学的アナロジー

これは数学の「0のべき乗の法則」（x^0 = 1）に似ています。直感的には不自然に見えても、この定義のおかげで数学の法則が一貫してうまく機能します。

## 設計における意義

- **リーフクラスのシンプル化**: コンポジット構造において、リーフクラスが階層ノードとしての役割に忠実かつシンプルな実装を持てる
- **条件分岐の削除**: 型判定などの条件文を避けることができる
- **コードの一貫性**: 全ての要素が同じインターフェースで扱える

## 結論

モデルを構築する際は、「どのように世界を認識したいか」という視点に基づいて設計します。現実世界の正確なモデル化よりも、モデルのシンプルさを優先する場合、儀礼的実装は価値のある手法となります。

---

**関連パターン**: コンポジットパターン、ポリモーフィズム  
**原文**: [Courtesy Implementation - Martin Fowler](https://martinfowler.com/bliki/CourtesyImplementation.html)
