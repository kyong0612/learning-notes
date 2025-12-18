---
title: "From Tagless-Final to Typed-Final: Program Transformations in the Final Style"
source: "https://speakerdeck.com/dcubeio/from-tagless-final-to-typed-final-program-transformations-in-the-final-style"
author:
  - "Kenichi Suzuki (鈴木 健一)"
published: 2019-09-16
created: 2025-12-18
description: |
  tagless-final と typed-final スタイルによる型安全な埋め込みDSL構築手法と、GADTおよびNormalization by Evaluation (NbE) を用いた型を保存するプログラム変換技術についての発表資料。
tags:
  - "functional-programming"
  - "Scala"
  - "DSL"
  - "type-theory"
  - "program-transformation"
---

## 概要

このプレゼンテーションは、型安全な埋め込みDSLを構築する手法である **tagless-final** と、それを発展させた **typed-final** スタイルについて解説している。特に、GADTとNormalization by Evaluation (NbE) を組み合わせることで、型を保存しながらプログラム変換を行う技術に焦点を当てている。

---

## 1. tagless-final とは

### 1.1 基本概念

**tagless-final** は、型安全な埋め込みDSLを構築する手法である。

- **型付けがメタ言語（ホスト言語）のそれに帰着する**
  - 型検査アルゴリズムを実装しなくてよい
- **HOAS（高階抽象構文）が使える**
  - メタ言語によってスコープ安全性が担保される
- **言語コンポーネントの合成をサポート**
- **パーサを作らなくてよい**
- **ホスト言語のエコシステムが使える**

### 1.2 対象言語とメタ言語

| 用語 | 説明 |
|------|------|
| 対象言語 (object language) | 表現したい言語、DSL |
| メタ言語 (meta language) | Scala, OCaml, Haskell等の埋め込み先ホスト言語 |

### 1.3 Symantics

**Symantics** = Syntax + Semantics

- **インターフェース**: 構文(Syntax)と型規則を定義
- **インタプリタ**: 意味論(Semantics)を実装

```scala
trait AddSym {
  type Repr[T]
  def int(n: Int): Repr[Int]
  def add(t1: Repr[Int], t2: Repr[Int]): Repr[Int]
}
```

- `Repr` は **表現型 (representation type)** で、型付け規則を表現
- 高階カインドを使用
- polymorphic lifting は使用しない
- semantics を関数の実装で表す

### 1.4 ユーザプログラム

```scala
class Program[S <: AddSym](val sym: S) {
  import sym._
  val ex1 = add(int(1), int(0))
}
```

インタプリタ（実装）に依存しないユーザプログラムが記述できる。

### 1.5 インタプリタ

```scala
final case class R[A](unR: A) // type Id[A] = A

object interp extends AddSym {
  type Repr[T] = R[T]
  def int(n: Int): R[Int] = R(n)
  def add(t1: R[Int], t2: R[Int]): R[Int] = R(t1.unR + t2.unR)
}

def eval[A](e: R[A]): A = e.unR
```

型が保存される評価関数を持つ。

---

## 2. HOASでλ抽象を扱う

### 2.1 HOAS (Higher-Order Abstract Syntax; 高階抽象構文)

変数束縛をホスト言語のλで表現するテクニック。

**変数を正確に扱う難しさ**:

- 変数名が被らないようにする
- de Bruijn インデックスを使う場合でも、代入操作時のインデックスのシフト計算が必要
- capture-avoiding substitution

```scala
trait LamSym {
  type Repr[T]
  def lam[A, B](f: Repr[A] => Repr[B]): Repr[A => B]
  def app[A, B](e1: Repr[A => B], e2: Repr[A]): Repr[B]
}
```

### 2.2 インタプリタは型合わせゲーム

```scala
def lam[A, B](f: R[A] => R[B]): R[A => B] =
  R((x: A) => f(R(x)).unR)

def app[A, B](e1: R[A => B], e2: R[A]): R[B] =
  R(e1.unR(e2.unR))
```

---

## 3. 言語コンポーネントを合成

```scala
trait AddSym {
  type Repr[T]
  def int(n: Int): Repr[Int]
  def add(e1: Repr[Int], e2: Repr[Int]): Repr[Int]
}

trait SymLam {
  type Repr[T]
  def lam[A, B](f: Repr[A] => Repr[B]): Repr[A => B]
  def app[A, B](e1: Repr[A => B], e2: Repr[A]): Repr[B]
}

trait Sym extends AddSym with SymLam
```

または型パラメータ版:

```scala
trait AddSym[Repr[_]] { ... }
trait SymLam[Repr[_]] { ... }
trait Sym[Repr[_]] extends AddSym[Repr] with SymLam[Repr]
```

---

## 4. typed-final スタイルへの発展

### 4.1 プログラム変換の課題

tagless-final は関数によって言語を構成するため、関数で構成されたプログラムをどのように変換するかが課題となる。

例: 単位元の除去

- `n + 0 = n` (右単位元)
- `0 + m = m` (左単位元)

### 4.2 1つのインターフェースに複数の実装

tagless-final / typed-final は1つのインターフェース (symantics) に対して複数の実装（インタプリタ）を持つことができる。

- **評価インタプリタ**: そのまま使いたい
- **変換インタプリタ**: 変換ロジックと評価ロジックを分離したい
- 変換後に評価したい
- 型は保存したい

---

## 5. Normalization by Evaluation (NbE)

### 5.1 基本概念

| 用語 | 説明 |
|------|------|
| **reification** | 意味オブジェクトから項の正規的表現を抽出する操作 |
| **reflection** | 項の正規的表現から意味オブジェクトへの変換（reifyの逆関数） |

### 5.2 変換の流れ

```text
mul(add(int(2), int(0)), int(1))
    ↓ 加法単位元規則
mul(int(2), int(1))
    ↓ 乗法単位元規則
int(2)
    ↓ 解釈
R(2)
```

**変換チェーン**:

```text
R.Repr → AddIdent(R).Repr → MulIdent(AddIdent(R)).Repr
  ↑         ↑                    ↑
 From      To/From              To
```

---

## 6. GADTによる型保存

### 6.1 GADT (Generalized Algebraic Data Types)

表現型をGADTで構成した型にする:

```scala
sealed trait Term[T]
final case class Unknown[A](x: sym.Repr[A]) extends Term[A]
final case class IntLit(e: Int) extends Term[Int]
final case class Add(e1: Term[Int], e2: Term[Int]) extends Term[Int]

type Repr[T] = Term[T]
```

### 6.2 表現型の変換

```scala
trait RR {
  import cats.~>
  type From[_]
  type To[_]
  
  def fwd: From ~> To   // reflection
  def bwd: To ~> From   // reification
  
  def map[A, B](f: From[A] => From[B]): To[A] => To[B] =
    (t: To[A]) => fwd(f(bwd(t)))
    
  def map2[A, B, C](f: (From[A], From[B]) => From[C]): (To[A], To[B]) => To[C] =
    (t1: To[A], t2: To[B]) => fwd(f(bwd(t1), bwd(t2)))
}
```

### 6.3 Reification と Reflection の実装

```scala
class AddIdent[FS <: AddMulSym](val sym: FS) {
  sealed trait Term[T]
  final case class Unknown[A](x: sym.Repr[A]) extends Term[A]
  final case class IntLit(e: Int) extends Term[Int]
  final case class Add(e1: Term[Int], e2: Term[Int]) extends Term[Int]
  
  object AddRR extends RR {
    override type From[T] = sym.Repr[T]
    override type To[T] = Term[T]
    
    def fwd: From ~> To = new (From ~> To) {
      def apply[A](x: sym.Repr[A]): Term[A] = Unknown(x)
    }
    
    def bwd: To ~> From = new (To ~> From) {
      def apply[A](term: Term[A]): sym.Repr[A] = term match {
        case Unknown(x) => x
        case IntLit(n) => sym.int(n)
        case Add(e1, e2) => sym.add(bwd(e1), bwd(e2))
      }
    }
  }
}
```

### 6.4 型を保存した変換

```scala
val addIdentInterp = new GenericTrans(AddRR)(sym) {
  def add(t1: Term[Int], t2: Term[Int]): Term[Int] = (t1, t2) match {
    case (IntLit(0), _) => t2  // 左単位元
    case (_, IntLit(0)) => t1  // 右単位元
    case (_, _) => Add(t1, t2)
  }
}
```

---

## 7. 重要なポイント

### 7.1 モジュール連鎖

それぞれのモジュールはSymanticsを遵守して連鎖する。

### 7.2 コード生成

最終的にコード生成器を与えることもできる。

### 7.3 "Finally, Tagless"

意訳: **最後にタグがなければいいよね**

---

## 8. まとめ

1. **typed-final** はDSLを構築するアプローチ
2. **表現型repr** で対象外の構成子が入り込まないようにする
3. **GADTとNbE的アプローチを併用** することで、型を保存しながらfinal styleでプログラム変換が可能
4. **tagless-final は typed-final になった**

---

## 参考文献

1. Jacques Carette, Oleg Kiselyov, and Chung-chieh Shan. 2009. *Finally tagless, partially evaluated: Tagless staged interpreters for simpler typed languages.* J. Funct. Program. 19, 5 (September 2009), 509-543.
2. Miller, Dale & Nadathur, Gopalan (1987) *A logic programming approach to manipulating formulas and programs.*
3. Pfenning, Frank & Elliott, Conal (1988) *Higher-order abstract syntax.* PLDI 88.
4. Kenichi Suzuki, Oleg Kiselyov, and Yukiyoshi Kameyama. 2016. *Finally, safely-extensible and efficient language-integrated query.* PEPM '16.
5. Per Martin-Löf. 1975. *About models for intuitionistic type theories and the notion of definitional equality.*
6. Olivier Danvy and Andrzej Filinski. 1990. *Abstracting control.*
7. Peter Dybjer and Andrzej Filinski. 2000. *Normalization and partial evaluation.*

---

## 発表者情報

- **鈴木 健一 (Kenichi Suzuki)**
- BizReach, Inc.
- GitHub: [github.com/knih](https://github.com/knih)
- プロジェクト: [QUEL](http://logic.cs.tsukuba.ac.jp/~ken/quel/)
- 専門: プログラム言語論、クエリ、Functional DDD
- 所属プロダクト: [yamory](https://yamory.io)
