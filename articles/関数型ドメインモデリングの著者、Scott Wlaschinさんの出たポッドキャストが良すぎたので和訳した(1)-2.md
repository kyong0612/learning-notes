---
title: "関数型ドメインモデリングの著者、Scott Wlaschinさんの出たポッドキャストが良すぎたので和訳した(1)-2"
source: "https://zenn.dev/jtechjapan_pub/articles/788dea679049cb"
author: "tomohisa"
published: 2025-09-26
created: 2025-10-01
description: "Scott Wlaschinの「Domain Modeling Made Functional」に関するポッドキャスト「Compiled Conversation #8」の和訳記事第2部。ドメイン駆動設計(DDD)の戦略的設計について、関数型プログラミングへの導入、ドメインとサブドメインの概念、境界づけられたコンテキスト、ユビキタス言語などの基本概念を、Scott WlaschinとEd Mannの対談を通じて解説。"
tags:
  - "clippings"
  - "DDD"
  - "F#"
  - "Functional"
  - "モデリング"
  - "Eventstorming"
---

## 📝 要約

本記事は、関数型プログラミングとドメイン駆動設計(DDD)の専門家であるScott Wlaschinが出演したポッドキャスト「Compiled Conversation #8」の和訳第2部です。DDDの戦略的設計の核心概念について、実践的な観点から解説しています。

### 🎯 主要なポイント

#### 1. **コミュニケーションの重要性**

- 開発者は内向的で技術的な課題に没頭しがちだが、プロジェクト成功の鍵は人々との対話
- 「戦略（どこに行きたいか）」と「戦術（どうやってそこに到達するか）」のバランスが重要
- 間違った方向に向かうフェラーリより、正しい方向に向かう自転車の方が速い

#### 2. **ドメインとサブドメインの概念**

- **ドメイン**: 同じ言葉と概念を共有する関連事項のグループ
- **サブドメインの3つの種類**:
  - **コアサブドメイン**: ビジネスの中核的な差別化要因（例：機械メーカーなら機械の設計）
  - **支援サブドメイン**: 重要だが中核ではない（例：出荷、在庫管理）
  - **汎用サブドメイン**: ビジネス固有でない標準機能（例：給与計算、会計）

#### 3. **境界づけられたコンテキスト**

- コンテキスト = 同じ概念・語彙が機能する範囲
- 境界 = システム間の明確なインターフェース
- スコープクリープを防ぎ、プロジェクトの焦点を維持するために必要
- 理想的には問題空間と解決空間が1対1だが、実際には制約により調整が必要

#### 4. **ユビキタス言語（どこでも言語）**

- ビジネス側とのコミュニケーションで使う言葉をコードでもそのまま使用
- 技術的な用語への置き換えを避け、ドメインエキスパートと開発者が同じ言語で対話

### 💡 実践的な洞察

- **過度なエンジニアリングの回避**:
  - 独自データベースの開発など、「面白い技術的課題」がビジネス価値とは限らない
  - コアドメインに集中し、汎用的な問題は外部サービス（SaaS）を活用

- **ビジネスの進化への対応**:
  - Amazon（書籍販売→物流企業）、GM（自動車→ローンビジネス）など、コアビジネスは変化する
  - ソフトウェアは変更可能な設計が重要

- **人的要因の重視**:
  - ほとんどのプロジェクト失敗の原因は技術ではなく、「間違ったものを作ること」
  - ユーザーが本当に必要としているものを聞くことが最優先

### 🎓 開発者への教訓

- アルゴリズム最適化やコーディング競技の技術よりも、ビジネス問題の理解と共感力が重要
- 「状況による（It depends）」という答えを受け入れる柔軟性が必要
- 人類学者のように先入観を排除し、ドメインエキスパートの話を傾聴する姿勢

---

[ジェイテックジャパンブログ](https://zenn.dev/p/jtechjapan_pub) [Publicationへの投稿](https://zenn.dev/faq#what-is-publication)

10

8[idea](https://zenn.dev/tech-or-idea)

## Domain Modeling Made Functional Part 1 with Scott Wlaschin

最近聞いたポッドキャスト、 Compiled Conversation #8 がドメイン駆動設計の入門としてすごくよかったので、英語で文字起こしして、和訳をしました。参加者のお二人に和訳をブログに載せる許可をいただきました。LLMによる機械翻訳ベースなので、細かな表現が意訳されていたり、また文字起こしの間違いにより一部おかしな内容になっているかもしれません。ぜひ英語でわかる方は本編を英語で聞かれることをお勧めしますが、日本語の和訳だけでもニュアンスが十分伝わるので、よろしければご覧ください。

(1)-1はこちら

(1)-3 はこちら

(2)-1 はこちら

(2)-2 はこちら

(2)-3 はこちら

podcastのリンクはこちらです。

## 関数型プログラミングへの導入

### Scott Wlaschin

英語はこちら

Yeah, and developers don't like, I mean, that's the thing most a lot of developers are introverts. They don't really want to talk to other people. I'm a huge introvert myself. So yeah, talking to other people is if I can just start writing. And it's also like, why am I talking to someone? I just want to start writing code in all this talking is preventing me from getting going on this project. But I think with my experience, and I used to feel the same way, and now with a bit of experience, it's like actually, it's the talking to people is actually way more important than diving in and writing code without knowing what you're doing.

ええ、そして開発者は好まないのです。つまり、多くの開発者は内向的だということです。彼らは本当に他の人と話したがりません。私自身も非常な内向的です。だから、他の人と話すことは、もし私がただ書き始めることができるなら。そしてまた、なぜ誰かと話すのか？私はただコードを書き始めたいのに、この話し合いがすべて、このプロジェクトを始めることを妨げています。しかし私の経験では、私も同じように感じていましたが、少し経験を積んだ今では、実際には、人々と話すことは、何をしているか知らずにコードを書き始めるよりもはるかに重要だということです。

---

### Scott Wlaschin

英語はこちら

I mean, if you've just, I mean, the guy to remember it's a strategy is where do you want to go? And tactics is how do you get there? And if you focus on the tactics without the strategy and on the how do you get there, you could be going in the wrong direction. And the, I mean, the analogy I'd always like to say is, you know, which is faster, you know, a bicycle or a Ferrari. And the answer is, well, if the Ferrari is going in the wrong direction, a bicycle will get you there faster. You're going the right direction. The bicycle is still faster in the wrong direction in the foray, so.

つまり、もしあなたが、覚えておくべき要点は、戦略とはどこに行きたいかということで、戦術はどうやってそこに到達するかということです。そして、戦略なしに戦術に、つまりどうやってそこに到達するかに焦点を当てると、間違った方向に進んでしまう可能性があります。私がいつも好んで言う例え話は、自転車とフェラーリのどちらが速いかということです。答えは、まあ、フェラーリが間違った方向に向かっているなら、自転車の方が早く目的地に着くでしょう。正しい方向に向かっているなら。間違った方向に向かっているフェラーリよりも自転車の方がまだ速いのです。

---

### Scott Wlaschin

英語はこちら

You know, really knowing where you want to go is actually more important than the method of.

本当にどこに行きたいかを知ることが、実際には手段よりも重要なのです。

---

### Ed Mann

英語はこちら

Transport, I love that analogy. I really do. And I think as you say, it's not coming from a place in ivory tower. And if it is coming from a place of being burnt so many times, I know I personally, there's been projects where I've really loved the tech behind it. It's been absolutely amazing. But it didn't solve the problem that the user wanted, right? And that's where you learn and you go, do you know what I really want? I want code that actually gets used. I want to solve real problems. I don't want it to be I implemented all these amazing things.

交通手段の。その例え話が大好きです。本当にそうです。そしてあなたが言うように、これは象牙の塔からのものではありません。そして、これは何度も失敗を経験した場所から来ているのです。私個人的に知っているのは、その背後にある技術を本当に愛したプロジェクトがありました。それは絶対に素晴らしかった。しかし、ユーザーが望んでいた問題は解決しませんでした。そこで学習し、「本当に欲しいものを知っていますか？」と考えます。実際に使われるコードが欲しいのです。本当の問題を解決したいのです。これらすべての素晴らしいものを実装したということではありたくないのです。

---

### Ed Mann

英語はこちら

Design patterns and I use these languages.

デザインパターンとこれらの言語を使ったということではなく。

---

### Ed Mann

英語はこちら

Firstly, the user doesn't care, that's right at all. They want to solve the problem, and secondly, it will never get used what you've just done. This is all around the idea of making optimising the amount of time you know, the time that you're spending trying to solve something to actually solve a problem.

第一に、ユーザーはそれについて全く気にしません、その通りです。彼らは問題を解決したいのです。そして第二に、あなたがやったことは決して使われることはないでしょう。これはすべて、何かを解決しようと費やす時間、実際に問題を解決するための時間を最適化するというアイデアに関するものです。

---

### Scott Wlaschin

英語はこちら

That is really there, absolutely. Yeah, absolutely. And if you do the right, I mean, again, in my experience, most projects fail because you build the wrong thing. Most products do not fail because you're using the wrong programming language or because even if you don't even not having enough testing.

それは本当にそこにあります、絶対にです。ええ、絶対に。そして正しいことをすれば、私の経験では、ほとんどのプロジェクトは間違ったものを構築するために失敗します。ほとんどの製品は、間違ったプログラミング言語を使っているから、または十分なテストがないからといって失敗するわけではありません。

---

### Scott Wlaschin

英語はこちら

Or something like, yeah, you get bugs if you don't test, but the whole project failing is not normally caused by bugs. It's caused by you build something and nobody wants it because you didn't listen to what they wanted, you know, and that's in my experience. And that that the solution to that is not better technology. It's not rewriting everything in Rust. That's not going to solve your problem. But the problem is you're not listening to what people.

など、ええ、テストしなければバグが出ますが、プロジェクト全体の失敗は通常バグによって引き起こされるわけではありません。それは、あなたが何かを構築したが、彼らが望んでいることを聞かなかったために誰も欲しがらないということによって引き起こされます。それが私の経験です。そして、その解決策はより良い技術ではありません。すべてをRustで書き直すことではありません。それはあなたの問題を解決しません。問題は、あなたが人々が望んでいることを聞いていないことです。

---

## ドメインとサブドメインの概念

### Ed Mann

英語はこちら

Want, yeah, 100%. And so moving on from there though, I think it'll be maybe good for the audience to unpick some of these things we hear about in Domain Driven.

望んでいること、ええ、100%です。そこから先に進んで、ドメイン駆動設計で聞くこれらのことをほぐすことは、視聴者にとって良いかもしれません。

---

### Ed Mann

英語はこちら

Design, we've kind of touched upon a couple of things there with the strategic and the tactical, but the first thing would be like what is?

設計で、戦略的なものと戦術的なものでいくつかのことに触れましたが、最初のことは何かということです。

---

### Scott Wlaschin

英語はこちら

A domain, right? So it's just a group of things which are related. It's a very fuzzy term, but I think as a programmer you know it when you see it. So a good example is programming is different from testing. So those are two different domains. And even within programming, Python programmers, Python programme is a different domain or different sub domain from, you know, C programming or Prologue.

ドメインですね？それは関連するもののグループです。非常に曖昧な用語ですが、プログラマーとして見ればわかると思います。良い例は、プログラミングはテストとは異なるということです。だからそれらは二つの異なるドメインです。そしてプログラミング内でさえ、Pythonプログラマー、Pythonプログラミングは、CプログラミングやPrologとは異なるドメインまたは異なるサブドメインです。

---

### Scott Wlaschin

英語はこちら

Or whatever. So what makes them different is you can tell by the language they use. So programmers will have a certain set of jargon they use. And if you're a non programmer, you won't necessarily know what that jargon means. And then even within a particular subdomain, a particular community, you know, Python programmes might have certain words that they use that C programmers don't know what they mean. So basically if people are using the same words and the same concepts, that is my definition of what a domain is. And that's typically what you want to model because if the people.

など何でも。だから彼らを異なったものにしているのは、彼らが使用している言語によって分かることです。プログラマーは使用する特定の専門用語のセットを持っています。そして、あなたがプログラマーでなければ、その専門用語が何を意味するか必ずしも知らないでしょう。そして特定のサブドメイン内、特定のコミュニティ内でさえ、Pythonプログラマーは、Cプログラマーが何を意味するか知らない特定の言葉を使うかもしれません。だから基本的に、人々が同じ言葉と同じ概念を使っているなら、それが私のドメインの定義です。そして、それが通常あなたがモデル化したいものです。なぜなら、人々が...

---

### Scott Wlaschin

英語はこちら

Who are doing the same thing with the same words and same content. That's probably the same piece of code or the same group, you know, the same subsystem in your application. And if you have two different domains and they've got completely different words and completely different vocabulary, then they probably shouldn't be in the same piece of code because the chances are they're going to change independently at different rates. And you can't really have one piece of code that can capture everything or, you know, across all these different domains. So focus on one thing at a time. And the night is just a way of creating, you know, we have to create boundaries.

同じ言葉と同じ内容で同じことをしている人々。それはおそらく同じコード片または同じグループ、あなたのアプリケーションの同じサブシステムです。そして、二つの異なるドメインがあり、それらが完全に異なる言葉と完全に異なる語彙を持っているなら、それらはおそらく同じコード片にあるべきではありません。なぜなら、それらは異なる速度で独立して変更される可能性があるからです。そして、すべてを捕捉できる、またはこれらすべての異なるドメインにわたって捕捉できる一つのコード片を本当に持つことはできません。だから一度に一つのことに集中します。そしてドメインは境界を作成する方法です。私たちは境界を作成しなければなりません。

---

### Scott Wlaschin

英語はこちら

Coat why we can't just generally create a massive monolithic piece of coat that does handle everything. So we we have to take boundaries somewhere. And so the question is where do you put the boundaries? And in domain resign you put the boundaries around these domains and then you make break it down in smaller into subdomains based on how complicated things.

すべてを処理する巨大なモノリシックなコード片を一般的に作成できない理由です。だから、どこかに境界を作らなければなりません。そして、質問は境界をどこに置くかということです。ドメイン駆動設計では、これらのドメインの周りに境界を置き、物事がどれだけ複雑かに基づいて、より小さなサブドメインに分解します。

---

### Ed Mann

英語はこちら

Yeah. So you mentioned their subdomains. So what is the difference? You have your domain and then inside of that then you will then break it down into these different subdomains.

ええ。それでサブドメインについて言及されました。では違いは何ですか？ドメインがあって、その中で異なるサブドメインに分解するということですか。

---

### Scott Wlaschin

英語はこちら

Yeah, it just depends. I mean, you could, like I say, with programming, you know, you might have Python people versus Rust people, you know, is it important to keep them separate? It depends how big the project is. If there's a really big project, you might, you might break it out into smaller pieces. You know, the classic answer is it depends, like the most annoying answer. So I will say, you know, you can tell always a senior, a senior programmer.

ええ、それは状況によります。つまり、プログラミングで言うように、Pythonの人対Rustの人がいるかもしれません。彼らを分けて置くことが重要でしょうか？それはプロジェクトがどれだけ大きいかによります。本当に大きなプロジェクトなら、より小さなピースに分解するかもしれません。古典的な答えは「状況による」で、最も迷惑な答えです。だから言うのですが、シニアプログラマーはいつも分かります。

---

### Scott Wlaschin

英語はこちら

They always say it depends. If they don't say it depends that they're not senior enough. So I'm just going to say it depends. But you start off by doing the big things, the very obvious domains, like in a typical business, for example, you have a billing department, you have a shipping fulfilment department, you have an ordering sales department. These are very obvious domains. And you know, even in outside of computers, they're obviously separate people. They have their own words. They sit in the same office together, they're managed, except they have different managers, you know, in the org chart.

彼らはいつも「状況による」と言います。「状況による」と言わなければ、十分にシニアではありません。だから私は「状況による」と言うつもりです。しかし、大きなこと、非常に明白なドメインから始めます。典型的なビジネスでは、例えば、請求部門があり、出荷・フルフィルメント部門があり、注文・営業部門があります。これらは非常に明白なドメインです。そして、コンピュータの外でも、彼らは明らかに別々の人々です。彼らは自分たちの言葉を持っています。彼らは同じオフィスに一緒に座っていますが、管理され、組織図では異なるマネージャーを持っています。

---

### Scott Wlaschin

英語はこちら

In a different operation, so they would be very obviously separate domains that you'd work on. So you can looking at an org chart is a great way to tell what the domains are or looking who people talk to in a business. Who do they e-mail most? That's a good way of telling you whether they're in the same using the same words.

異なる業務において、だからそれらは作業する非常に明らかに別々のドメインになるでしょう。組織図を見ることは、ドメインが何かを知る素晴らしい方法であり、ビジネスで人々が誰と話すかを見ることです。彼らが最もメールするのは誰ですか？それは彼らが同じ言葉を使っているかどうかを教えてくれる良い方法です。

---

### Ed Mann

英語はこちら

And the same concepts. Yeah, absolutely. And I think it's something interesting you mentioned then the terminology and the way you talk about that is really that these subdomains, these domains are already there. We're merely trying to, and I've used this knowledge before, it's like in a magnifying glass, we're trying to zoom in.

そして同じ概念。ええ、絶対に。そして興味深いことに、あなたが言及した用語とそれについて話す方法は、実際にこれらのサブドメイン、これらのドメインは既にそこにあるということです。私たちは単に、そして私は以前この知識を使ったことがありますが、拡大鏡のように、ズームインしようとしています。

---

### Ed Mann

英語はこちら

Or as you say, A tag. I kind of like to think because of the way that subdomains there, it's a linear thing. It's not like they're hierarchical in nature, but we're trying to tag areas of the business around the subdomains. And you know, there's like cohesive units of work here that they all relate and stuff. And it doesn't mean that you have to tag everything because it will go zoom, you know, micro level into it, zoom in on these things. It's about how useful.

またはあなたが言うように、タグです。サブドメインがそこにある方法のために、それは線形なものだと考えるのが好きです。それらが本質的に階層的であるというわけではありませんが、サブドメインの周りにビジネスの領域をタグ付けしようとしています。そして、ここにはすべてが関連する凝集性のある作業単位があります。すべてをタグ付けしなければならないという意味ではありません。なぜなら、それはマイクロレベルまでズームイン、これらのものにズームインしてしまうからです。どれだけ有用かということです。

---

### Scott Wlaschin

英語はこちら

They are exactly, exactly it is exactly. At some point being too fine grained is not useful, but being too, you know too.

それらはまさに、まさにその通りです。ある時点で、細かすぎることは有用ではありませんが、あまりにも...

---

### Scott Wlaschin

英語はこちら

Coarse grained is also not useful. So there's some sort of thing where it feels good. And I think it depends, unfortunately, it depends. And also as the project evolves, those boundaries might change slightly, just like in the real world, boundaries change between different departments in a business. But a lot of these, a lot of in most businesses, I mean, if you didn't have computers, as you say, those boundaries will still be there. If you imagine, I always like to say, what was I, what would I do if I just had a paper and pencil and I didn't have a computer? How would I, how would the business?

粗すぎるのも有用ではありません。だから、良い感じがするところがあります。そして、残念ながら状況によると思います。そして、プロジェクトが進化するにつれて、これらの境界は少し変わるかもしれません。現実の世界で、ビジネスの異なる部門間の境界が変わるのと同じように。しかし、これらの多く、ほとんどのビジネスでの多くは、コンピュータがなかったとしても、あなたが言うように、これらの境界はまだそこにあるでしょう。想像してみると、私はいつも言うのが好きですが、もし紙と鉛筆だけがあってコンピュータがなかったら、私は何をするでしょうか？どのように、ビジネスはどのように？

---

### Scott Wlaschin

英語はこちら

Well, the business was run by, you know, sending lots of bits of paper back and forth, which is how it used to work. But, you know, who do they send a bit of paper to? Who's on the same team and who's on different teams? So a lot of this stuff is, yeah, computers don't make that much difference to the.

まあ、ビジネスは、たくさんの紙片を前後に送ることによって運営されていました。それが以前の動作方法でした。しかし、彼らは紙片を誰に送るのでしょうか？誰が同じチームにいて、誰が異なるチームにいるのでしょうか？だから、これらの多くは、ええ、コンピュータはそんなに違いをもたらしません。

---

### Ed Mann

英語はこちら

Way you organise things, I don't think, Yeah, I think that's an interesting thing you say there, because these things you're saying with domain subdomains, they're already there in all businesses. It's purely a yeah, obviously we're saying IT and modelling around software and I think that gets into solution space. But you really can use these things and I've done thought experiments.

物事を整理する方法、私は思いません。ええ、あなたがそこで言っていることは興味深いことだと思います。なぜなら、ドメインサブドメインであなたが言っているこれらのことは、すべてのビジネスに既に存在しているからです。それは純粋に、明らかに私たちはITとソフトウェア周りのモデリングについて話していて、それは解決空間に入ると思います。しかし、あなたは本当にこれらのことを使うことができ、私は思考実験をしました。

---

### Ed Mann

英語はこちら

Head where you do that take this to a business that has nothing to do with tech and you can clearly see yeah, here's their domain so this is under business you know the actual area of business that they're trying to do and this is how they breaking up their subdomains and then from there the subdomains there are different types of subdomains there's three of them that you mentioned in the book would you mind maybe for the audience is.

これを技術と何の関係もないビジネスに持っていくと、明らかに見えます。ええ、これが彼らのドメインです。だからこれはビジネスの下で、彼らがやろうとしているビジネスの実際の領域で、これが彼らがサブドメインを分解する方法です。そして、そこからサブドメインには異なるタイプのサブドメインがあります。本で言及された3つがありますが、視聴者のために説明していただけませんか。

---

## Core (コアサブドメイン)・Supporting(支援サブドメイン)・Generic(汎用サブドメイン)などのサブドメインの概念

### Scott Wlaschin

英語はこちら

Going through them and explaining at the different types there, right? So core is what the core business is. So if you're selling, you know, if you're selling machinery, you know, building and designing the machinery is your core business now.

それらを通して、そこにある異なるタイプを説明しますね？コアは、コアビジネスが何であるかです。だから、もしあなたが機械を販売している場合、機械の構築と設計があなたのコアビジネスです。

---

### Scott Wlaschin

英語はこちら

Crossing things might be shipping the machinery and you know, taking deliveries and having inventory and stuff. It's very important to running the business, but that's not what you really, really do. And then finally, something like generic is something that it's not particular to your business, for example, payroll, accounting, you know, having a bank account and stuff. All businesses need that and it's nothing special to your business for about that. And so one of the reasons you want to make that distinction is that the core business is what you really, really care about so that.

支援的なことは機械の出荷や、配達の受け取り、在庫管理などかもしれません。それはビジネスを運営するために非常に重要ですが、あなたが本当に、本当にしていることではありません。そして最後に、汎用的なものは、あなたのビジネスに特有でないもので、例えば給与計算、会計、銀行口座を持つことなどです。すべてのビジネスがそれを必要としており、それはあなたのビジネスにとって特別なことではありません。そして、その区別をしたい理由の一つは、コアビジネスはあなたが本当に、本当に気にかけているものだからです。

---

### Scott Wlaschin

英語はこちら

Especially if you want an advantage, that's what you should be modelling, something which is generic like payroll, you should just outsource that. There's no point building your own payroll system or your own accounting system. You know, you're just wasting your time if you focus on that. And then supporting stuff may or may not be that important. It depends. So typically if you're a small business, you would outsource that too. You might outsource your shipping to FedEx or DHL or whatever.

特に優位性が欲しいなら、それがあなたがモデル化すべきものです。給与計算のような汎用的なものは、アウトソーシングすべきです。独自の給与システムや会計システムを構築する意味はありません。それに焦点を当てるなら、時間を無駄にしているだけです。そして支援的なものは重要かもしれないし、そうでないかもしれません。状況によります。だから通常、小さなビジネスなら、それもアウトソーシングするでしょう。出荷をFedExやDHLなどにアウトソーシングするかもしれません。

---

### Scott Wlaschin

英語はこちら

But you know, it's interesting, someone like Amazon, they pretty much really.

しかし、興味深いことに、Amazonのような企業は、本当に...

---

### Scott Wlaschin

英語はこちら

Realise they start off selling books, but they pretty much realise that they actually had to own their own warehouses as well in order to get, you know, next, you know, fast delivery and control all that stuff. They actually Amazon is more like a logistics something now than a shop. I mean the logistics is just it's actually a key part of and same thing with you know something like FedEx end up buying their own aeroplanes to manage if they're if they're doing that. So sometimes your core business will actually change based on what's really, really important to you general.

書籍の販売から始めましたが、高速配送を実現し、すべてをコントロールするために、実際に自分たちの倉庫を所有する必要があることに気づきました。実際にAmazonは今では店舗というよりも物流企業のようなものです。物流は実際に重要な部分で、FedExのような企業が管理のために自分たちの飛行機を購入するのと同じことです。だから、時々あなたのコアビジネスは、あなたにとって本当に、本当に重要なものに基づいて実際に変わります。

---

### Scott Wlaschin

英語はこちら

Famously GM makes more money from their loans than they do from selling, not actually building the cars. It's not their core businesses like high interest loans as they're called business.

有名なところでは、GM (General Motors)は自動車の製造・販売よりもローンから多くのお金を稼ぐようになりました。彼らのコアビジネスは高金利ローンビジネスのようなものです。

---

### Ed Mann

英語はこちら

That's insane. That's actually and again, what you're saying there, I'm putting it back to what you said about the paper and pen light analogy. Now that has software like this all makes sense. Like as you say, in a paper pen business where I'm doing solving all my problems using that I will still have what is my core sub domain? What, what you know what, what am I? What's my business differentiator? Is someone going to come along and just take that? You know what, what do?

それは驚きです。実際に、そして再び、あなたがそこで言っていることを、紙とペンの軽いアナロジーについてあなたが言ったことに戻しています。今、このようなソフトウェアがあることですべてが意味をなします。あなたが言うように、紙とペンのビジネスで、それを使ってすべての問題を解決している場合、私のコアサブドメインは何でしょうか？何が、私は何ですか？私のビジネス差別化要因は何ですか？誰かがやってきてそれを奪ってしまうのでしょうか？

---

### Ed Mann

英語はこちら

You know, as you say, like what am I actually doing that's different from my competitor? And then you've got supporting and engineering and you say with generic, it's like I just want doing invoice in parallel. It's a very complex thing, but it's not going to set me apart. Like no ones going to go. I'm going to use your insert my core domain here because you've got such amazing payroll systems internally. It doesn't change, it doesn't affect it.

あなたが言うように、私が競合他社と異なって実際に行っていることは何でしょうか？そして支援的なものと汎用的なものがあり、汎用的なものについてあなたが言うように、私は並行して請求書を処理したいだけです。それは非常に複雑なことですが、私を際立たせることはありません。誰も「あなたの内部に素晴らしい給与システムがあるから、あなたの（ここにコアドメインを挿入）を使います」とは言わないでしょう。それは変わらず、影響しません。

---

### Scott Wlaschin

英語はこちら

Right I mean, I know it's interesting, you know, the growth of SAS systems means that a lot of things can now be outsourced that used to be have to be done in house. So I mean you can you can actually, you know, including having your your hardware, you know, I mean a lot of software companies don't actually own you used to have it used to own your own server room and all this stuff. You know, you can just do everything in the cloud, you can outsource almost everything you do. So it's quite possible to have a successful business and just be a couple of people now and just focus on the core domain. So that's essentially.

興味深いことに、SaaSシステムの成長により、以前は社内で行わなければならなかった多くのことが今では外注できるようになりました。つまり、ハードウェアを含めて、多くのソフトウェア企業は実際には、以前は自分のサーバールームやそのすべてを所有していましたが、今では所有していません。クラウドですべてを行うことができ、あなたがすることのほぼすべてを外注できます。だから、成功するビジネスを持ち、数人だけで、コアドメインに集中することが十分に可能です。それが本質的に。

---

### Ed Mann

英語はこちら

That is incredibly good and that that game goes we kind of align. This is like it's gone from in a supporting where the infrastructure was something you have to do annoyingly, you have to do it from your core and what you're about to do is make that a generic problem. Now you've been able to push that off because it's a complex thing. It's a thing that they've solved and similar with like Amazon. Your reason why you gonna use something like Lambda or something is because they have dealt with the idea of multi AZ resilience all that. I don't want to do that I.

それは信じられないほど良く、そのゲームは私たちが整合性を取れるものです。これは、インフラストラクチャが迷惑にもやらなければならないことであった支援的なものから、あなたのコアから行わなければならず、あなたがしようとしていることはそれを汎用的な問題にすることです。今では、それは複雑なものであり、彼らが解決したものであるため、それを押し出すことができました。Amazonと同様に。Lambdaのような何かを使う理由は、彼らがマルチAZの回復力のアイデアをすべて扱ったからです。私はそれをしたくありません。

---

### Scott Wlaschin

英語はこちら

Want to do with the core. I want to do with my problem exactly. You've offshored it exactly. So I mean, yeah, my core thing, my core thing is, is the core.

コアに関わりたい。まさに私の問題に関わりたいのです。まさにそれをオフショア化しました。だから、ええ、私のコアなもの、私のコアなものは、コアです。

---

### Scott Wlaschin

英語はこちら

If I'm writing a software, if I'm selling software, the core thing is what is the piece of software I'm writing? The fact that how I host it, whether I host it in my own on premise or I host it on the cloud, that's a supporting.

もし私がソフトウェアを書いている、ソフトウェアを販売しているなら、コアなことは私が書いているソフトウェアの部分は何かということです。それをどのようにホストするか、自分のオンプレミスでホストするか、クラウドでホストするかという事実は、支援的なものです。

---

### Ed Mann

英語はこちら

Domain right there, whichever makes us, I'm sorry, as I say for us as developers, and this is where the important part and the thing I love about this is this stops it with the over engineering where really when we talk about core subdomains or core domain, this is what we should be putting all our effort into because that's the thing that actually makes it when we start goal plating, supporting a domain, sub domain concepts and stuff, that's where the problem is.

まさにそこがドメインです。私たちにとって、申し訳ありません、開発者として言うのですが、これが重要な部分で、私がこれについて愛していることは、これがオーバーエンジニアリングを止めることです。本当にコアサブドメインやコアドメインについて話すとき、これが私たちがすべての努力を注ぐべきものです。なぜなら、それが実際にそれを作るものだからです。私たちが金メッキを始めるとき、ドメイン、サブドメインの概念などを支援すること、そこに問題があります。

---

### Ed Mann

英語はこちら

And this is where it this again, it feels like it's common sense, but I mean, I know I've, you know, gone through it. We're trying to understand this. You've come in from the wrong way. You know, where I've looked at the tactical first on this and being, you know, heavily confused. But why are we overcomplicating these things to be and then reversing it to go, which the strategic design that is the most important thing and it is common sense and it's just a great way. The thing that's nice about it is and the way we should really think about this release. I, I feel about it is that it's just giving us names. This domain room design thing, if you want to call it, it's just giving us names for things that we really.

そしてこれは再び、常識のように感じられますが、私は経験したことがあります。これを理解しようとしています。間違った方法から入ったのです。戦術的なものを最初に見て、非常に混乱していました。しかし、なぜこれらのことを複雑にしてしまい、それを逆転させて、戦略的設計が最も重要なことであり、それは常識であり、素晴らしい方法だと言うのでしょうか。それについて良いことは、このリリースについて本当に考えるべき方法です。私が感じているのは、それは私たちに名前を与えてくれることです。このドメイン駆動設計というもの、そう呼びたければですが、それは私たちが本当に...していることに名前を与えているだけです。

---

### Ed Mann

英語はこちら

Doing just in resolving these problems in the business context.

ビジネスコンテキストでこれらの問題を解決するために行っていることです。

---

### Scott Wlaschin

英語はこちら

Well, it's very easy. I think developers, what we think is a fun problem is not necessarily what the business thinks is important. So a fun problem would be, you know, designing a UI framework or a new database model or something. It's like, that's a lot of fun. You could spend a lot of time doing that. But yeah, that's the weight. From a business point of view, that's just a waste of money.

まあ、とても簡単です。開発者が考える楽しい問題は、必ずしもビジネスが重要だと考えることではないと思います。楽しい問題は、UIフレームワークや新しいデータベースモデルの設計などでしょう。それはとても楽しいです。それに多くの時間を費やすことができます。しかし、それは重荷です。ビジネスの観点からは、それはお金の無駄です。

---

### Ed Mann

英語はこちら

Yeah, And start thinking, is this a supporting problem that I'm doing here? Like is this actually going to make a difference, you know, and and that's that's.

ええ、そして考え始めます。これは私がここでやっている支援的な問題でしょうか？これは実際に違いを生むのでしょうか？それが...

---

### Scott Wlaschin

英語はこちら

So true, Yeah. I mean, I can give you a personal example. I I was in a startup a long time ago and we patented our own database. We wrote a database. And at the time it was interesting, but you know, nowadays you're not going to write your own database. You'd be stupid to write your own database unless you really, really, really needed it for some reason. But why would anyone do that today? That's.

とても真実です、ええ。個人的な例を挙げることができます。私は昔スタートアップにいて、独自のデータベースを特許取得しました。データベースを書きました。当時はそれは興味深かったのですが、今日では自分のデータベースを書くことはないでしょう。本当に、本当に、本当に何らかの理由で必要でない限り、自分のデータベースを書くのは愚かでしょう。しかし、なぜ今日誰かがそんなことをするのでしょうか？それは...

---

### Ed Mann

英語はこちら

Crazy, but that's so true. I mean, but as you say, if you feel.

クレイジーですが、とても真実です。つまり、しかしあなたが言うように、もし感じるなら。

---

### Ed Mann

英語はこちら

This is where it goes into the core. If you feel like that's a differentiator, if you've got something on that database, imagine the way you have architected this database or done something with it. Great, okay, that's a selling thing. But if you're doing this just to do a simple CRUD app, right, probably over engineered this just a little bit and that's when it's like you've spent too much time and you're.

これがコアに入るところです。それが差別化要因だと感じるなら、そのデータベースに何かがあるなら、このデータベースをアーキテクチャした方法や何かを行った方法を想像してください。素晴らしい、オーケー、それは売りになることです。しかし、単純なCRUDアプリを作るためだけにこれをやっているなら、おそらく少しオーバーエンジニアリングしすぎで、それはあまりにも多くの時間を費やしたということです。

---

### Scott Wlaschin

英語はこちら

Supporting right here, absolutely. So it's very easy to do. And that's what I guess why again the whole these DDD concepts, they just give you a nudge. It's like, Are you sure? Is this really what you want to be doing? So I don't know any.

まさにここで支援的なことです、絶対に。だからとても簡単にできます。そしてそれが、再びこれらすべてのDDDの概念が、あなたに少し後押しをしてくれる理由だと思います。「本当に確かですか？これは本当にあなたがやりたいことですか？」と。だから私は分かりません。

---

### Ed Mann

英語はこちら

I know we all like it. We all like the cool shiny thing. Let's not, you know, let of course we do and that's fine. And I always go and this is where it goes into sport. I go, does this sound like am I, is this scratching my hobby itch? Like is this feeling like too much of A hobby project where I'm like, oh, this is really cool, like let's build my own language. Well, that's.

私たちはみんなそれが好きです。みんな格好良くて光っているものが好きです。もちろんそうです、それは構いません。そして私はいつも行き、これがスポーツに入るところです。私は「これは私の趣味の痒いところを掻いているように聞こえるか？」と考えます。「これはあまりにも趣味プロジェクトのように感じられて、『ああ、これは本当にクールだ、自分の言語を作ろう』と思っているか？」と。まあ、それは...

---

### Scott Wlaschin

英語はこちら

A hobby project that's not a business thing, that is a classic thing. And I mean there was a standard thing and people still do, is they start writing their own little DSL to help this little problem and they end up supporting the DSL for this.

それはビジネスのことではない趣味プロジェクトで、それは古典的なことです。そして標準的なことがあり、人々は今でもやっていますが、この小さな問題を助けるために独自の小さなDSLを書き始め、結局このDSLをサポートすることになってしまいます。

---

### Ed Mann

英語はこちら

Do you know what, like let's play this out, maybe that supporting thing and this is the same with Slack and maybe that the supporting thing that you built turns out to be a core thing in your business pivots. And I think something you mentioned there where this thing is fluid, DDD domain businesses are fluid, they change. So do then that a sub domain, the names, the tags that we put on these subdomains are being core, strategic or generic. And also what fields of business we're in. I mean the GM One is really interesting.

どう思いますか、これを展開してみましょう。その支援的なものは、Slackと同じで、あなたが構築した支援的なものがビジネスピボットでコアなものになるかもしれません。そして、あなたがそこで言及したことで、これが流動的だということ、DDDドメインビジネスは流動的で、変化します。だから、サブドメイン、これらのサブドメインに付ける名前、タグも、コア、戦略的、または汎用的になります。そしてまた、私たちがいるビジネス分野も。GMの例は本当に興味深いです。

---

### Scott Wlaschin

英語はこちら

That you mentioned there yeah. Yeah, it is yeah. Do things do change I mean, that's the other thing I.

あなたがそこで言及したことです、ええ。ええ、そうです。物事は変化します。それが私の...もう一つのことです。

---

### Scott Wlaschin

英語はこちら

Think about domain of design is the whole thing about the strategy. Where are you going? Well, sometimes the way you're going is changed. And so yeah, the idea of treating softwares is static thing that is immutable once you create it. I think designing software So that can be changed and knowing that it will change anything with people. People are always the big problem in software. It's almost never a technical thing. It's always a people problem and people change their minds and people want different things and you know, things evolve over time.

ドメイン駆動設計について考えることは、戦略についてのすべてです。どこに向かっているのでしょうか？まあ、時々あなたが向かっている道が変わることがあります。そしてそうです、ソフトウェアを一度作成すると不変の静的なものとして扱うアイデア。私は、変更できるソフトウェアを設計し、人々と共に何でも変化することを知ることだと思います。人々は常にソフトウェアの大きな問題です。それはほとんど技術的なことではありません。常に人の問題であり、人々は心を変え、人々は異なることを望み、物事は時間とともに進化します。

---

### Ed Mann

英語はこちら

Yeah, that's so true. And then unfortunately.

ええ、それはとても真実です。そして残念ながら。

---

### Ed Mann

英語はこちら

Developers, we're introverted and talking to people is the hard part. And this is probably why we then go off and, and again, you know, our happy place is something like Leet code where we're solving these small little problems and we're doing it, you know, hey, look at this crazy trick that I've done that has 0 Value to the business.

開発者は内向的で、人と話すことが難しい部分です。そしてこれがおそらく私たちが去って行く理由で、再び、私たちのハッピープレイスは、これらの小さな小さな問題を解決するLeetCodeのようなもので、私たちはそれをやっています。ちょっと、この狂ったトリックを見て、と言いますが、私がしたことはビジネスには全く価値を生み出さないというわけです。

---

### Scott Wlaschin

英語はこちら

Exactly exactly that's I mean that's one of the reasons why people who are good at when someone says they're good at coding as they mean they're good at you know coding competitions and something to me that doesn't mean anything in terms of are they going to be adding value Now I am talking about.

まさにその通りです。つまり、それが理由の一つで、誰かがコーディングが得意だと言うときに得意な人々は、コーディング競技が得意だということを意味し、私にとってそれは価値を追加するかという点で何も意味しません。今私が話しているのは。

---

### Scott Wlaschin

英語はこちら

To be clear, I should be talking about the context of what's useful in I'm talking about business applications. Now, if you're doing super high algorithm stuff, maybe you know, someone who's really good at algorithms, might be the perfect, who knows all the algorithms off the heart, they may be very good. But I'm typically talking about, you know, just general business domains, which is what the vast majority of programmers are employed.

明確にすると、私はビジネスアプリケーションについて話している中で、何が有用かのコンテキストについて話すべきです。今、もしあなたが超高度なアルゴリズムをやっているなら、アルゴリズムが本当に得意な人、すべてのアルゴリズムを心から知っている人が完璧かもしれず、彼らはとても良いかもしれません。しかし、私は通常、一般的なビジネスドメインについて話しています。それがプログラマーの大多数が雇われている分野です。

---

### Ed Mann

英語はこちら

Doing not everything is solving. And I say like let's talk about open AI and building up the next, you know, models and stuff. Like as you say, we've pretty much got, yeah, quite, quite rudimentary.

すべてが解決しているわけではありません。そして私は、OpenAIについて話し、次の、モデルなどを構築することについて言います。あなたが言うように、私たちはかなり、かなり基本的なものを持っています。

---

### Ed Mann

英語はこちら

Systems, but they're not, I mean, I'd say to see, I just said simple there and they're not like the people are the thing and the process. And that's what makes it interesting and hard at the same time. It's just as you say, it's not a computationally intensive, here's a new database, here's a new way of architecting a new algorithm, new sorting algorithm that I've just found. And yeah, yeah, it's a different problem.

システムですが、それらは、つまり、私はシンプルだと言いましたが、人々が物事であり、プロセスであるようなものではありません。そしてそれが同時に興味深く困難にしていることです。あなたが言うように、それは計算集約的ではなく、「新しいデータベースです、新しいアーキテクチャの方法です、私が見つけた新しいアルゴリズム、新しいソートアルゴリズムです」ということではありません。そして、ええ、ええ、それは異なる問題です。

---

### Scott Wlaschin

英語はこちら

There's actually a quote I like, I can't remember what it is exactly, but he's saying that computer science people look down on COBOL. This is written in the 1970s because it's like.

実際に私が好きな引用があります。正確には覚えていませんが、コンピュータサイエンスの人々がCOBOLを見下しているということです。これは1970年代に書かれたものです。なぜなら...

---

### Scott Wlaschin

英語はこちら

Like, you know, it's a very, you know, it's not a very sophisticated thing. And he points out that, you know, a payroll programme, things like anything where there's humans involved, payroll is incredibly complicated algorithm. I mean, a tax law and all this stuff is incredibly complicated. You know, from a technical point of view, it's just a bunch of lookup tables with, you know, but it doesn't mean it's any less complicated when you're writing and when there's money involved, you know, so there's a good example of a very, very complicated domain, which is not particularly algorithmic. You don't have to be a super duper math genius to do that stuff.

とても洗練されたものではないように。そして彼が指摘するのは、給与計算プログラム、人間が関わるあらゆるもので、給与計算は信じられないほど複雑なアルゴリズムだということです。つまり、税法やこれらすべては信じられないほど複雑です。技術的な観点からは、それは単なる参照テーブルの束ですが、書いているときやお金が絡むときに、それが複雑でないという意味ではありません。だから、これは特にアルゴリズム的ではない非常に、非常に複雑なドメインの良い例です。そのようなことをするために超優秀な数学の天才である必要はありません。

---

### Scott Wlaschin

英語はこちら

But you do need to understand and kind of get rid of your ego and try to understand what other you know.

しかし、理解し、エゴを取り除き、他の人が知っていることを理解しようとする必要があります。

---

### Ed Mann

英語はこちら

The experts are talking. I would say you have to do something harder. You have to be a good communication.

専門家が話していることです。私はもっと難しいことをしなければならないと言うでしょう。良いコミュニケーションを取らなければなりません。

---

### Ed Mann

英語はこちら

You have to do all of these other things that are so, so important, not only in well with the job, but also in life. These are the bits that really make the difference, that make a successful product.

仕事だけでなく、人生においてもとても、とても重要なこれらすべての他のことをしなければなりません。これらが本当に違いを生み、成功した製品を作る部分です。

---

### Scott Wlaschin

英語はこちら

That make a successful business right exactly I mean that's is lunch out empathy learn to listen rather than talk is a very good skill to know as a programmer I.

成功したビジネスを作ることです。まさにその通りです。つまり、それは共感し、話すよりも聞くことを学ぶことで、プログラマーとして知るべき非常に良いスキルです。

---

### Ed Mann

英語はこちら

Think, yeah, I mean something you mentioned in the book is.

思います、ええ、つまり本で言及されたことの一つは。

---

### Ed Mann

英語はこちら

Pretend you're an anthropologist and like avoiding those preconceived notions and resisting, you know, imposing your own mental model on the domain. I think that's something where we as developers, we see patterns and then we start to just skip to that because that sometimes work well. We jump to conclusions a lot, yes, and we don't listen And as you say in the book, it's like it's.

人類学者のふりをして、先入観を避け、ドメインに自分のメンタルモデルを押し付けることに抵抗することです。私たちが開発者として、パターンを見て、それがうまく機能することがあるため、そこにスキップし始めることがあると思います。私たちは多くの結論に飛びつきます、ええ、そして聞かないのです。そして本で言うように、それは...

---

### Scott Wlaschin

英語はこちら

All about listening, it is, yeah. This is the number one skill I would recommend many programmers who are kind of arrogant. I mean, they're technically very good, but they don't listen.

すべて聞くことについてです、そうです。これは、少し傲慢な多くのプログラマーに推奨するナンバーワンのスキルです。つまり、彼らは技術的には非常に優秀ですが、聞かないのです。

---

### Scott Wlaschin

英語はこちら

To me, in the long run, that's sort of not.

私にとって、長期的には、それは...ではありません。

---

## 境界づけられたコンテキストの概念

### Ed Mann

英語はこちら

A good thing, I mean, we could argue in with the AI, it's like how much do you need to technically this is the thing, it's the talking and all this. I won't set you off on that just yet. I know that before you were saying so I'll definitely leave that to the end. So just moving on swiftly from that. So we have the domain and subdomain and then in domain design, then we have the bounded context. So I'm just wondering what is the.

良いことではありません。つまり、AIについて議論できますが、技術的にどれだけ必要かということです。それは話すことやすべてです。まだそれについて始めるつもりはありません。以前にあなたが言っていたことを知っているので、それは最後に残しておきます。だから、それから素早く進んでいきます。ドメインとサブドメインがあり、そしてドメイン設計において、境界づけられたコンテキストがあります。だから、それは何かと思っています。

---

### Scott Wlaschin

英語はこちら

Bounded context, right? So about a context is a context with a boundary. So what are those two different words? And this is a bit of jargon again.

境界づけられたコンテキストですね？境界づけられたコンテキストは境界を持つコンテキストです。では、これら二つの異なる単語は何でしょうか？そしてこれは再び少し専門用語です。

---

### Scott Wlaschin

英語はこちら

Not sure the DDD people have this job, but a context is basically a bunch of concepts or a bunch of vocabulary that work together. So you know, when you say you take this word out of context or you take this situation out of context. So the context is the same thing that I was talking about earlier. You're using the same words, the same concepts, the same model, and then it's bounded because you can't cover everything in your code. And this is one of the problems. This is one of the differences between code and the real world. In the real world, you.

DDDの人々がこの仕事を持っているかどうかはわかりませんが、コンテキストは基本的に一緒に動く概念の束または語彙の束です。だから、この言葉を文脈から外すとか、この状況を文脈から外すと言うときのように。だから、コンテキストは私が以前話していたのと同じことです。同じ言葉、同じ概念、同じモデルを使っていて、そしてあなたのコードですべてをカバーできないため、それは境界づけられています。これが問題の一つです。これがコードと現実世界の違いの一つです。現実世界では、あなたは...

---

### Scott Wlaschin

英語はこちら

Know your own area and also know a little bit about everyone elses area. But in software we have to have a pretty rigid boundary between. We don't want different subsystems kind of reached inside and talking to other things. We like to have strict interfaces between areas. So create deliberately saying we're going to have a strict interface between this thing and this thing and you're not allowed to reach inside and talk to the other thing. You have to go through the API, you have to go through the interface. That's good design. And so again, deciding where those boundaries are is an important part of the.

自分の領域を知り、他のみんなの領域についても少し知っています。しかし、ソフトウェアでは、かなり厳格な境界を持つ必要があります。異なるサブシステムが内側に手を伸ばして他のものと話すことを望みません。領域間に厳密なインターフェースを持つことを好みます。だから、この物とこの物の間に厳密なインターフェースを持つことを意図的に作成し、内側に手を伸ばして他の物と話すことは許可されません。APIを通して、インターフェースを通さなければなりません。それが良い設計です。そして再び、これらの境界がどこにあるかを決定することは...の重要な部分です。

---

### Scott Wlaschin

英語はこちら

The early design process and if you don't have any boundaries at all, you get a big ball of mud, which is always a bad thing. And so the boundaries also help with scope creep because let's say I'm doing, I don't know, an accounting system and they say, well, by the way, can you add payroll or can you add something where it does something else? It's like that is not in the boundary. That's a different subsystem. It's a different thing. It's not in this boundary, it's not in scope. And if you want to start another project for that, that's fine. But I've seen projects go.

初期設計プロセスの、そして境界が全くないと、ビッグボールオブマッド（大きな泥の玉）になり、それは常に悪いことです。そして境界はスコープクリープも助けます。なぜなら、私が会計システムをやっているとして、彼らが「ちなみに、給与計算を追加できますか、または他の何かをする何かを追加できますか？」と言うとします。それは境界内にありません。それは異なるサブシステムです。それは異なるものです。この境界内にありません、スコープ内にありません。そのために別のプロジェクトを開始したいなら、それは良いです。しかし、プロジェクトが進むのを見ました。

---

### Scott Wlaschin

英語はこちら

Because the boundaries keep expanding, you know, and that's another cause of failed projects as they just get bigger and bigger and bigger and there's no boundaries. So you've got to have boundaries just like in real life, you know, you can't just let people walk all over you. So it's good for me from a software architecture point of view to have boundaries, but it's also good from.

境界が拡大し続けるからです、そしてそれはプロジェクトが失敗するもう一つの原因です。どんどん大きくなり、境界がありません。だから、現実生活と同じように境界を持たなければなりません。人々にあなたを踏みつけさせることはできません。だから、ソフトウェアアーキテクチャの観点から境界を持つことは良いことですが、...からも良いことです。

---

### Ed Mann

英語はこちら

A project management point of view to have boundaries. Yeah, that's so true. And I think that goes from the problem space to the solution space. I think when we were talking here, I think we start getting more into more into a place where developers start to feel more at home because you start solving things and something in.

プロジェクト管理の観点から境界を持つこと。ええ、それはとても真実です。そしてそれは問題空間から解決空間に進むと思います。ここで話しているとき、開発者がより家にいるように感じ始める場所にもっと入っていくと思います。なぜなら、物事を解決し始めるからです。

---

### Ed Mann

英語はこちら

You say, you know, not everything is a crisp, you know, beautiful boundary. The real world is messy and that's the problem space, the problems you're trying to solve. And as you say, as people, we can context switch so quickly. We've got such an amazing ability to be able to quickly change and go from that problem into this one and touch upon that a little bit and then go back here in the solution space and code. It's not as easy. And that's where we're trying to solve the and draw these boundaries that are. Then we'll talk about the communication patterns, things that we have to communicate between now and as developers, this is what we love, we love.

あなたが言うように、すべてがはっきりとした美しい境界であるわけではありません。現実世界は混沌としており、それが問題空間、あなたが解決しようとしている問題です。そしてあなたが言うように、人として、私たちは非常に素早くコンテキストスイッチできます。素早く変更して、その問題からこの問題に行き、それを少し触れて、それからここに戻るという驚くべき能力があります。解決空間とコードでは、それは簡単ではありません。そして、そこで私たちは解決し、これらの境界を引こうとしています。それから、コミュニケーションパターンについて話します。今の間にコミュニケーションしなければならないことで、開発者として、これが私たちが愛すること、私たちは愛します。

---

### Ed Mann

英語はこちら

To design solution models around that.

それを中心に解決モデルを設計することを。

---

### Scott Wlaschin

英語はこちら

Exactly. The smaller things get, the more bounded things to get, it does make our life easier because so we're just going to work in this bit. But I mean, one of the differences I make in the book is the difference between the problem space and the solution space. Because also the solution space is constrained by what you actually can work with. So if, for example, if you already have a mainframe, if you're doing some sort of accounting thing, you already have a mainframe that you have to work with. I mean, that's a constraint on your solution. So, you know, you can't just do whatever.

その通りです。物事が小さくなるほど、境界づけられるものになるほど、私たちの生活が楽になります。なぜなら、この部分だけで作業するからです。しかし、本で私が作る違いの一つは、問題空間と解決空間の違いです。なぜなら、解決空間も実際に作業できるものによって制約されるからです。例えば、すでにメインフレームがある場合、何らかの会計のことをやっている場合、作業しなければならないメインフレームが既にあります。つまり、それはあなたの解決策への制約です。だから、何でもできるというわけではありません。

---

### Scott Wlaschin

英語はこちら

Like and, and a lot of times when you're actually doing, when you're writing a system, you have to work with other systems that aren't necessarily the best designed systems. And so, you know, there's also this kind of, this is where the engineering side of software these which is working with constraints and knowing how to get the best results given the constraints you have. That's where sometimes you do have to adjust the ideal design to work with what you actually have you.

そして多くの場合、実際にシステムを書いているとき、必ずしも最高に設計されたシステムではない他のシステムと作業しなければなりません。そして、これはソフトウェアのエンジニアリング側面で、制約と共に作業し、持っている制約の中で最良の結果を得る方法を知ることです。そこで時々、理想的な設計を実際に持っているものと作業するために調整しなければなりません。

---

### Ed Mann

英語はこちら

Know yeah, and again, this is all about communicating this and being able to document this. This is why.

知っている、ええ、そして再び、これはすべてこれをコミュニケーションし、これを文書化できることについてです。これが理由です。

---

### Ed Mann

英語はこちら

Have things such as subdomains and valid context and these drawing these lines around is so we can clearly see from there. And I think something that I've seen in the past and something that I've been a kind of victor or kind of done in the past is the idea that there's, you know, you have your subdomain, your problem space, and then you have a one to one relationship with the bounded place solution. It's like, hey, here's a problem, here's the solution. And that's something that obviously isn't quite it doesn't it obviously can sometimes be correct, but it's not always.

サブドメインや境界づけられたコンテキストのようなものがあり、これらの線を引くことで、そこから明確に見ることができます。そして、私が過去に見たことで、過去に私が犠牲者だったか、やったことの一つは、サブドメイン、問題空間があり、そして境界づけられたコンテキスト解決策との1対1の関係があるという考えです。「はい、これが問題です、これが解決策です」という感じです。そして、それは明らかに完全ではない、明らかに時々正しいことがありますが、いつもそうではありません。

---

### Scott Wlaschin

英語はこちら

Correct. It's definitely. It's not always correct. So again, it's the usual. It depends, just like.

正しいです。確実に。いつも正しいわけではありません。だから再び、いつものことです。状況によります。

---

### Scott Wlaschin

英語はこちら

In ideal worlds, the solution to build would model the real worlds exactly and it would be 1 to one, as you say, 1 to one relationship. But when it, you know, when you actually come down to it, that's not always true. So again, knowing what constraints you have to lose and you know what constraints that well, what things you have to adjust, what things you have to lose, what compromises you have to make, That's part of the art of doing a good design and doing a good architecture and so on. Again, there's no, there's no, I think a lot of people.

理想的な世界では、構築する解決策は現実世界を正確にモデル化し、あなたが言うように1対1、1対1の関係になるでしょう。しかし、実際にそれに取り組むとき、それはいつも真実ではありません。だから再び、失わなければならない制約を知り、どの制約がどうか、調整しなければならないもの、失わなければならないもの、しなければならない妥協を知ること。それが良い設計と良いアーキテクチャを行う芸術の一部です。再び、ない、ない、多くの人々が思うことです。

---

### Scott Wlaschin

英語はこちら

One of the reasons developers don't like this is there's no clear cut answers as well. I mean with an algorithm I can say this algorithm is faster than this algorithm and it's like.

開発者がこれを好まない理由の一つは、明確な答えもないことです。つまり、アルゴリズムでは、このアルゴリズムはこのアルゴリズムより速いと言えます。

---

### Ed Mann

英語はこちら

You know the big O notation.

ビッグO記法を知っています。

---

### Scott Wlaschin

英語はこちら

This is it or I've got, you know, it's normally very clear when you get down to the low level code that this is a better solution, this other. But when it comes to things like architecture and when it comes, you know, and there's compromises and there's a lot of, well, it depends kind of talking. There's no definitive right answer. And I think that also makes people uneasy when people like clear answers and definitive.

これです、または、低レベルコードに降りると、これがより良い解決策であることは通常非常に明確です。しかし、アーキテクチャのようなものになると、妥協があり、「まあ、状況による」という話がたくさんあります。決定的な正しい答えはありません。そして、人々が明確な答えと決定的なものを好むとき、それも人々を不安にさせると思います。

---

### Scott Wlaschin

英語はこちら

Answer. So again, there's a lot of just a lot of experience. You just need experience and practise and caution. I'd say in terms of doing design, just don't try and be too ambitious because often that causes problems as well.

答え。だから再び、多くの経験があります。経験と実践と注意が必要です。設計を行う点で言うなら、あまりに野心的になろうとしないでください。それもしばしば問題を引き起こすからです。

---

### Ed Mann

英語はこちら

Yeah, and no, things will change. And I mean, we always do this in code and you can obviously there's again, it depends to it because how much do you preempt? It's like, well, this could change. It's like we're going to become this amazing stuff. We have to, as you say, we have to build our own database. We're going to be that popular as a startup. It's going to be that no, probably at the start, we're not going to. So let's not try and do that. Let's not.

ええ、そして、物事は変わります。つまり、私たちはコードでいつもこれを行い、明らかに再び状況によります。どれだけ先取りするかということです。「まあ、これは変わるかもしれない。私たちはこの素晴らしいものになるつもりだ。独自のデータベースを構築しなければならない。スタートアップとしてそんなに人気になるつもりだ。」しかし、おそらく最初は、そうならないでしょう。だから、それをしようとしないでください。

---

### Ed Mann

英語はこちら

Find, you know, design or play our way around with that to actually do these things. There is obvious debate, but yeah, things change over time and you have to kind of deal with.

実際にこれらのことを行うために、設計したり、それで遊んだりする方法を見つけます。明らかな議論がありますが、ええ、時間とともに物事は変化し、対処しなければなりません。

---

### Scott Wlaschin

英語はこちら

That. Yeah, exactly.

それに。ええ、その通りです。

---

## ユビキタス言語の概念

### Ed Mann

英語はこちら

And so from there and we've talked about the bounded context there and we have spoken about this, but I think it be good maybe to put a more concrete kind of focus on it.

そしてそこから、境界づけられたコンテキストについて話し、これについて話しましたが、もっと具体的な焦点を当てるのが良いかもしれません。

---

### Ed Mann

英語はこちら

Is the ubiquitous language, right? So the ubiquitous language, this is a bit of jargon again, which I'm not really happy with. I'd rather just call it the everywhere language or the common language. Well, ubiquitous is a bit, you know, it's a long, it's a long.

ユビキタス言語ですね？ユビキタス言語、これは再び少し専門用語で、私は本当に満足していません。どこでも言語や共通言語と呼ぶ方が良いでしょう。まあ、ユビキタスは少し、長い、長いです。

---

### Ed Mann

英語はこちら

It sounds fancy. It's like bounded context.

派手に聞こえます。境界づけられたコンテキストのように。

---

### Scott Wlaschin

英語はこちら

Exactly, I just call everywhere language or the common language is the everywhere language that you use everywhere. So not it's the language you use when you're talking to normal people, but it's also the language you use in the code. It's everywhere. So that's all it is, is that if you have a particular word that you use when you're communicating something, you use that same word in the code and you use that same language everywhere again, sometimes you see the developers will talk to a subject matter expert or domain expert and they will use certain words, but.

その通りです。私はどこでも言語または共通言語と呼びます。これはあなたがどこでも使うどこでも言語です。普通の人々と話すときに使う言語だけでなく、コードでも使う言語です。どこでもです。だから、それがすべてです。何かをコミュニケーションするときに使う特定の言葉があれば、コードでも同じ言葉を使い、どこでも同じ言語を使います。時々、開発者が主題専門家やドメインエキスパートと話し、特定の言葉を使いますが。

---

### Scott Wlaschin

英語はこちら

When it comes to writing the code, they will not use that word. They'll write, they'll call it, you know, something completely different because that's more of a techie word. Again, the goal of domain design is about communication. So you use the everywhere language everywhere in the code as well as just talking in casual conversation.

コードを書くときになると、その言葉を使いません。彼らは書く、呼ぶ、全く異なる何かを、それがより技術的な言葉だからです。再び、ドメイン駆動設計の目標はコミュニケーションについてです。だから、カジュアルな会話で話すだけでなく、コードでもどこでも言語をどこでも使います。

---

### Ed Mann

英語はこちら

Again, it seems like common sense, but it's not. And we've all been Privy to this is the thing. It's like when we look at it like this, it's like, yeah, we're solving this problem together. We probably should all talk about this thing together. And the solution that I'm building should.

再び、それは常識のように思えますが、そうではありません。そして私たち全員がこれに関わってきました。このように見ると、「ええ、私たちは一緒にこの問題を解決している。おそらく私たち全員でこのことについて一緒に話すべきです。そして私が構築している解決策は...すべきです。

---

### Ed Mann

英語はこちら

Have the same language that the problem is. We should all talk about the same thing if it makes complete sense, but it is hard to.

問題と同じ言語を持つべきです。完全に意味をなすなら、私たち全員が同じことについて話すべきですが、それは困難です。

---

### Scott Wlaschin

英語はこちら

It's very hard to turn off your techie brain and focus on the non techie side of things. It's definitely a certain way of thinking.

技術者の脳をオフにして、非技術的な側面に焦点を当てることは非常に困難です。確実に特定の考え方です。

---

### Ed Mann

英語はこちら

Yeah. But it's such a valuable thing to be able to do and to kind of harness. And again, it only happens with experience of using this and applying these things and stuff. And you can start today like in the problem that you're doing like it is just about you don't have to be like, right, we're doing DDD now.

ええ。しかし、それができること、活用できることはとても価値のあることです。そして再び、これを使い、これらのことを適用する経験によってのみ起こります。そして今日から始めることができます。あなたがやっている問題で、「よし、今からDDDをやる」という必要はありません。

---

### Ed Mann

英語はこちら

I that's another thing I have a pet peeve is like, I don't like saying we're doing DD now. It's like, well, no, this is just, I was helping to solve the problem. Like that's what we're doing exactly. So happens we're applying some of these things that DDD has obviously put a name to exactly.

私のもう一つのペットピーブは、「今からDDDをやっている」と言うのが嫌いなことです。「まあ、違います、これは単に問題を解決するのを助けているだけです。それがまさに私たちがやっていることです」と。たまたま、DDDが明らかに名前を付けたこれらのことのいくつかを適用しているだけです。

---

### Scott Wlaschin

英語はこちら

Yeah, it's a bit like agile. It gets used, it gets misused, and all of a sudden you can't. Just so you know, originally agile just meant being agile and not and just not being.

ええ、それはアジャイルのようなものです。使われ、誤用され、突然できなくなります。知っておいてほしいのは、元々アジャイルは単にアジャイル（機敏）であることを意味し、...でないことを意味していました。

---

### Scott Wlaschin

英語はこちら

Following a strict super process, but now you have the agile process and you have to follow the agile process, otherwise you'll.

厳格な超プロセスに従うことでしたが、今ではアジャイルプロセスがあり、アジャイルプロセスに従わなければなりません。そうでなければ...

---

### Scott Wlaschin

英語はこちら

Bad person. It's like that's just as bad, you know? These things get turned into rigid, formulaic ways of doing things, which literally defeats the whole purpose of how you're supposed to do them in the.

悪い人になります。それも同じくらい悪いことです。これらのことは、物事を行う厳格で公式的な方法に変わり、それは文字通り、それらを行うべき方法の全体的な目的を台無しにします。

---

### Ed Mann

英語はこちら

1st place, yeah. And life, life is not rigid like this is the thing again, when you say rigidity there and all this, we're trying to impose our technic brain on this. We've literally now just tried, you know, this is how we like things. So in the in the book you mentioned garbage in garbage out. Would you mind explaining that rule?

最初の場所で、ええ。そして人生、人生はこのように厳格ではありません。これは再びそのことで、あなたがそこで厳格さやこのすべてについて言うとき、私たちは技術的な脳をこれに押し付けようとしています。私たちは文字通り今試しました、これが私たちが物事を好む方法です。だから本でガベージイン・ガベージアウトについて言及されました。そのルールを説明していただけませんか？

---

(1)-3 はこちら

10

8
