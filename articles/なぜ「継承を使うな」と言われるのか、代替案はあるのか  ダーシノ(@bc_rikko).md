---
title: "なぜ「継承を使うな」と言われるのか、代替案はあるのか | ダーシノ(@bc_rikko)"
source: "https://bcrikko.github.io/til/posts/2025-07-01/oop-inheritance/"
author:
  - "[[ダーシノ(@bc_rikko)]]"
published: 2025-07-01
created: 2025-07-02
description: "オブジェクト指向プログラミング（Object-Oriented Programming）を学ぶと、以下の3つを特徴だと説明される。カプセル化（隠蔽）多態性（ポリモーフィズム）継承.しかし、インターネットでは「継承を使うな」と言われることが多い。 なぜなのか、その理由を考えてみる。"
tags:
  - "Programming"
  - "OOP"
  - "継承"
  - "設計原則"
---
## なぜ「継承を使うな」と言われるのか、代替案はあるのか

オブジェクト指向プログラミング（Object-Oriented Programming）を学ぶと、以下の3つが特徴だと説明される。

- カプセル化（隠蔽）
- 多態性（ポリモーフィズム）
- 継承

しかし、 **インターネットでは「継承を使うな」と言われることが多い。** なぜなのか、その理由を考えてみる。

## TL;DR

- **「継承が悪い」というより「継承の使い方が悪い」**
 	- 「継承を使うな」の背景には抽象化の失敗がある
 	- 行き過ぎた継承によりコードの複雑性が増す
- 現在は継承よりも扱いやすい手法がある

## 継承とは

簡単に説明すると **親の特徴を受け継いだ子をつくること。** 親は基底クラス/スーパークラス、子は派生クラス/サブクラスと呼ばれる。（※呼び方はプログラミング言語によって若干異なるが意味は同じ）

よく例に挙げられるのが [生物の分類](https://ja.wikipedia.org/wiki/%E7%94%9F%E7%89%A9%E3%81%AE%E5%88%86%E9%A1%9E) である。

```plaintext
[ざっくりとした生物の分類]

  動物

   └ 脊椎動物

      └ 哺乳類

         ├ 食肉目

         |  ├ ネコ科

         |  └ イヌ科

         └ 霊長目

            └ ヒト科
```

我々ホモ・サピエンスはヒト科なので、脊椎動物、哺乳類、霊長目、ヒト科の特徴を受け継いでいる。このように特徴を受け継ぐことをプログラミング的に実現したのが「継承」である。

## 間違った抽象化と継承

### 飛べない鳥問題

「継承を使うな」という話題がでると、よく例に上げられるのが [「飛べない鳥問題」](https://ja.wikipedia.org/wiki/%E9%A3%9B%E3%81%B9%E3%81%AA%E3%81%84%E9%B3%A5) である。以下のサンプルコードではハトやカラスが鳥クラスを継承している。

```ts
/**

 * 鳥クラス

 */

class Bird {

  fly() {

    console.log('I can fly.')

  }

}

function letFly(bird: Bird) {

  bird.fly()

}

/* ハト */

class Pigeon extends Bird {}

letFly(pigeon) // I can fly.

/* カラス */

class Crow extends Bird {}

letFly(crow) // I can fly.
```

しかし、新たにペンギンやキーウィなどの「飛べない鳥」が登場するとどうだろうか。

```ts
/* ペンギン */

class Penguin extends Bird {}

// Penguinは飛べないのにBirdを継承しているから飛べる？！

letFly(penguin)

/* キーウィ */

class Kiwi extends Bird {}

// Kiwiは飛べないのにBirdを継承しているから飛べる？！

letFly(kiwi)
```

このように **抽象化を間違えることで矛盾した設計になってしまう。**

### 振る舞いを表現するインターフェース

では、「飛べる」を表現するにはどうすればよいか。 **「飛べる」のような振る舞いはインターフェースを使って実装する。**

```ts
/**

 * 「飛べる」という振る舞い

 * ※プリフィックスに\`I-\`をつけているのは筆者が元C#erだから

 */

interface IFlyable {

  fly(): void

}

class Pigeon implements IFlyable {

  fly() {

    console.log('I can fly.')

  }

}

class Penguin {

  // ペンギンは飛べないのでIFlyableを実装しない

}
```

またインターフェースを実装することで、ポリモーフィズムも実現できる。

```ts
function letFly(flyable: IFlyable) {

  flyable.fly()

}

const pigeon = new Pigeon()

letFly(pigeon) // I can fly.

const penguin = new Penguin()

letFly(penguin) // Error: Property 'fly' is missing in type 'Penguin' but required in type 'IFlyable'.
```

### 継承とインターフェース

ここまで読んできたら継承を使わず、インターフェースだけを使えばよいのではと考えると思う。多くのケースではインターフェースで十分だ。

ただし、「鳥」という抽象概念が必要なこともある。たとえば「卵を産む」「羽毛を持つ」という振る舞いや属性を表現したい場合だ。このような場合は、継承とインターフェースを組み合わせて使うことで、より正確な設計ができる。

```ts
/* 鳥類 */

class Bird {

  layEgg() {

    console.log('I can lay an egg.')

  }

  hasFeather() {

    return true

  }

}

/* 飛べる */

interface IFlyable {

  fly(): void

}

/* ハト */

class Pigeon extends Bird implements IFlyable {

  fly() {

    console.log('I can fly.')

  }

}

/* ペンギン */

class Penguin extends Bird {

  // ペンギンは飛べないのでIFlyableを実装しない

}
```

## 「継承」の負の側面は？

間違った抽象化をした継承での問題点がわかったと思う。次は、継承の負の側面をさらに深堀りする。

### 多重継承によるコードの複雑化

継承を使うことで、派生クラスから基底クラスのメソッドやプロパティにアクセスできる。 **処理を共通化できる便利さの反面、多層化が進むにつれ、クラスの役割がわかりづらくなる。**

ここでは、RPGゲームの設計を題材にして説明してみる。

Characterクラスをベースに、プレイヤー、モンスター、NPC（村人）を実装している。

```ts
/** キャラクターの基底クラス */

abstract class Character {

  name: string

  hp: number

  atk: number

  def: number

  /** targetに対して攻撃する */

  abstract attack(target: Character): void

  /** 倒されたときにアイテムをドロップする */

  abstract dropItem(): Item

  protected calcDamage(target: Character): number {

    // よくあるRPGのダメージ計算

    return (this.atk * 2) * (100 / (100 + target.def))

  }

}

/** プレイヤー */

class Player extends Character {

  attack(target: Character) {

    console.log(\`${this.name}の会心の一撃\`)

    console.log(\`${target.name}に${this.calcDamage(target)}のダメージを与えた\`)

  }

  dropItem() {

    throw new Error('プレイヤーを倒してもアイテムはドロップしない')

  }

}

/** モンスター */

class Monster extends Character {

  #item: Item

  attack(target: Character) {

    console.log(\`${this.name}の痛恨の一撃\`)

    console.log(\`${target.name}に${this.calcDamage(target)}のダメージを与えた\`)

  }

  dropItem() {

    return this.#item

  }

}

/** ボスモンスター */

class Boss extends Monster { 

  ...

}

/** 村人 */

class NPC extends Character {

  attack(target: Character) {

    throw new Error('村人に戦闘能力はない')

  }

  dropItem() {

    throw new Error('村人を倒してもアイテムはドロップしない')

  }

}
```

ここでの問題点は2つある。

1. 不要な処理を継承してしまう
 - プレイヤーやNPCを倒すとアイテムがドロップする
 - 戦闘能力を保持しないNPCが攻撃できる
2. クラスの役割が曖昧になる
 - Characterクラスが「攻撃可能なキャラクター」を指すのか、「アイテムをドロップするキャラクター」を指すのか曖昧になっている

### 祖先クラスへの高い依存度

**継承の階層が深くなると、祖先クラスに強い結びつきが発生する。**

先述のRPGゲームの例をもとに説明すると、Characterクラスに変更が入ると、プレイヤー、モンスター、NPCなどすべてのキャラクターに影響を及ぼしてしまう。

たとえばモンスターにだけ「仲間を呼ぶ」機能を追加しようとすると、ボスモンスターにも継承されてしまう。

## 継承以外の選択肢

GoやRustなど比較的新しいプログラミング言語では、（現時点では）継承という機能を持っていない。それは、 **継承よりも扱いやすい手法があるからだ。**

### インターフェース

「飛べない鳥問題」で説明した内容だ。こと振る舞いに関してはインターフェースを使うほうが適している。

たとえば、2つのオブジェクト同士を比較したい場合は `IEquatable` 、日付や金額のオブジェクトを比較したい場合は `IFormatter` などである。

```ts
interface IEquatable<T> {

  equals(other: T): boolean

}

interface IFormatter {

  format(): string

}

class BookID implements IEquatable<BookID> {

  val: string

  equals(other: BookID): boolean {

    return this.val === other.val

  }

}

class Price implements IFormatter {

  #val: number

  #formatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" })

  format(): string {

    return this.#formatter.format(this.#val)

  }

}
```

※ `-able` や `-er/-or` など言語や命名規則にはさまざまな流派がある。

### コンポジション

責務や振る舞いに着目し、機能ごとにクラスを分けて必要に応じて組み合わせることで、処理内容を入れ替えたり、より柔軟な設計が可能になる。

GoFデザインパターンのStrategy Patternが代表的な例である。

```ts
interface AttackStrategy {

  attack(attacker: Character, target: Character): void

}

class Character {

  name: string

  hp: number

  atk: number

  def: number

  attackStrategy: AttackStrategy

  attack(target: Character) {

    this.attackStrategy.attack(this, target)

  }

}

class PlayerAttackStrategy implements AttackStrategy {

  attack(attacker: Character, target: Character) {

    const damage = this.calcDamage(attacker, target)

    console.log(\`${attacker.name}の会心の一撃\`)

    console.log(\`${target.name}に${damage}のダメージを与えた\`)

  }

  private calcDamage(attacker: Character, target: Character): number {

    return (attacker.atk * 2) * (100 / (100 + target.def))

  }

}

class MonsterAttackStrategy implements AttackStrategy {

  attack(attacker: Character, target: Character) {

    const damage = this.calcDamage(attacker, target)

    console.log(\`${attacker.name}の通常攻撃\`)

    console.log(\`${target.name}に${damage}のダメージを与えた\`)

  }

  private calcDamage(attacker: Character, target: Character): number {

    return (attacker.atk * 1.8) * (100 / (100 + target.def))

  }

}

const player = new Character(

  name: 'プレイヤー',

  hp: 100,

  atk: 50,

  def: 30,

  attackStrategy: new PlayerAttackStrategy(),

)

const monster = new Character(

  name: 'スライム',

  hp: 80,

  atk: 40,

  def: 20,

  attackStrategy: new MonsterAttackStrategy(),

)

player.attack(monster)

monster.attack(player)
```

## まとめ

「生物の分類」のような学問として確立されたものは、先人たちが正しく抽象化してくれているため、継承を使っても問題は発生しない。しかし、 **アプリケーション開発は未知のモノや比較的新しい概念を扱うことが多く、ベテランエンジニアでも正しく抽象化することは難しい。**

こういった背景を全部ひっくるめて「継承を使うな」と言っているのであろう。正確には **「（正しく抽象化できないなら）継承を使うな」** というべきかもしれない。

ただし、 **注意が必要なのはinterfaceやコンポジションなどを最初から使おうとするとYAGNIに陥りやすい。** 複雑なデザインパターンを適用しても使わない、または効果が薄いこともあるので、 **シンプルな設計からはじめ必要なときに必要なだけリファクタリングしていくほうが良い。**

## 参考サイト

- [飛べない鳥問題 - kawasima](https://scrapbox.io/kawasima/%E9%A3%9B%E3%81%B9%E3%81%AA%E3%81%84%E9%B3%A5%E5%95%8F%E9%A1%8C)
- [49\. GoFデザインパターンとDI + リファクタリング (後編) w/ twada | fukabori.fm](https://fukabori.fm/episode/49)
