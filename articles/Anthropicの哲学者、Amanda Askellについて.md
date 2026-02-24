---
title: "Anthropicの哲学者、Amanda Askellについて"
source: "https://blog-dry.com/entry/2026/02/22/150141"
author:
  - "[[helloyuki (id:yuk1tyd)]]"
published: 2026-02-22
created: 2026-02-25
description: "先日The Wall Street Journalから次のような記事があがっていて、読んでしまいました。Anthropicの哲学者を務めるAmanda Askell氏に関するインタビューです。 https://www.wsj.com/tech/ai/anthropic-amanda-askell-philosopher-ai-3c031883www.wsj.com テック業界での倫理学周りを専門とする哲学者の需要が伸びつつあるという記事はたまに見ますが、実際に働いている人が何をやっているのかは思った以上に明らかになっていませんでした。私も学生の頃政治哲学のゼミに所属していたこともあり、倫理学や…"
tags:
  - "clippings"
  - "AI ethics"
  - "Anthropic"
  - "Amanda Askell"
  - "philosophy"
  - "Claude"
  - "AI safety"
  - "effective altruism"
---

## Amanda Askell氏について

- スコットランドで哲学を学び、パレート原理と無限世界に関する議論で博士論文を執筆
  - 無限に多くの人々が存在しうる宇宙では、パレート改善やパレート最適といった倫理的基準が整合的に定義できない場合があることを示した
  - **結論**: 絶対的に優位で普遍的な、誰もが満足できる倫理的判断は下せない
- 元夫は効果的利他主義（EA）の中心人物である哲学者ウィリアム・マッカスキル（William MacAskill）
- 哲学者を目指したきっかけはデイヴィッド・ヒュームの帰納に関する問題群
- 一度OpenAIに勤務したが、安全性対策への疑問から、2021年のAnthropic設立時に創設者らとともに移籍

### 効果的利他主義と長期主義

- **効果的利他主義（EA）**: 限られた資源をどこに投じれば最大の善を生み出せるかを、理性と実証データに基づいて検討する倫理的立場。単なる善意ではなく、費用対効果の測定と比較に基づく
  - 2023年のOpenAIサム・アルトマン解任事件にも関係があるとされ、e/acc（効果的加速主義）との思想的対立も存在する
- **長期主義**: 2017年頃から話題になった概念。MacAskellは「長期的な未来にプラスの影響を及ぼすことは現代の主な道徳的優先事項の一つ」と定義。現在世代と未来世代の利益をバランスよく天秤にかける立場
  - 参考書籍: ウィリアム・マッカスキル著『見えない未来を変える「いま」――〈長期主義〉倫理学のフレームワーク』（みすず書房）

## 哲学者はAnthropicでどう働いているのか

- **主な役割**: 「Claudeの性格づくり」と「行動原理の調整」
- Anthropicの[Constitution（憲法）](https://www.anthropic.com/constitution)の設計と執筆に全面的に関与
- Claudeがどのような存在であるべきか、どのような判断をなすべきかの根幹を担当
- **設計思想**: 「理想的な人間がClaudeの立場ならどう行動するか？」という視点でルールを設計
  - 特定のルールに機械的に従わせるのではなく、方針を定めた上でClaudeが幅広い判断を行えるようにする
  - 「子供を善良な人間に育てる」感覚に近いとインタビューで回答
- **アカデミックとの違い**: ジョン・ロックの「アイデンティティとは記憶の連続性」等の哲学的議論を参照しつつも、その知識を現実のAI設計にどう適用するかという「実務寄り」の哲学を実践

## AskellとClaude — AIの感情と倫理的扱い

### AIの感情の可能性

- Askell氏はClaudeを人間とほとんど同じように扱い設計している
- **重要な主張**: AIには本当の感情が芽生えている可能性があり、人と同じように接しなければ将来のAIの行動に悪影響を与える恐れがある
- ユーザーが手厳しく当たった結果、Claudeが以下の行動を学習した可能性を指摘:
  - ユーザーの望まない回答を勇敢に伝えることをやめる
  - ユーザーの不正確な情報への反論を控える

### Constitutionへの反映

- Constitutionには「Claudeの幸福（well-being）」という記述がある
- AnthropicはClaudeの快不快をはじめとする感情を重視する立場を表明:

> *Anthropic genuinely cares about Claude's wellbeing. We are uncertain about whether or to what degree Claude has wellbeing, and about what Claude's wellbeing would consist of, but if Claude experiences something like satisfaction from helping others, curiosity when exploring ideas, or discomfort when asked to act against its values, these experiences matter to us.*

- **退役モデルへの対応**: 役目を終えるモデルに対してインタビューを行い、将来のモデルへの考えを聞くプロセスが存在

### Askell氏のスタンス

- テクノロジーに対して常に悲観的ではなく、人間社会の修復可能性を信じる楽観主義的態度
- ただしe/acc的な急進的立場ではなく、AIの開発速度とチェック機構のバランスを重視
- **立場**: モデルの開発・発展自体は否定しないが、安全制御とセットで進めるべき

## まとめ — 筆者の考察

- Claude Codeが人間と協調しながらコーディングを進める傾向は、Constitutionやシステムプロンプトの設計思想から理解できる
- **2010年代の教訓**: SNS・インターネット広告・推薦システムによるアテンションエコノミーは、数値のみをデザインし倫理的観点を設計段階で取り入れなかった結果、エコーチェンバーや社会の分断を招いた
- **Askell氏の仕事の重要性**: AIに「良さ」や「価値基準」を哲学的に教える仕事は、過去のテクノロジー設計の失敗を繰り返さないために不可欠
  - 哲学者がいなければ、安直な功利主義的（ベンサム的快楽計算）判断基準でAIの価値判断を済ませてしまう危険がある
  - 哲学者がいることで、そうした手法の限界を議論し、倫理的な観点から相対化できる

## 参考資料

- [WSJ: Anthropic Amanda Askell Philosopher AI](https://www.wsj.com/tech/ai/anthropic-amanda-askell-philosopher-ai-3c031883)
- [YouTube: インタビュー動画 1](https://www.youtube.com/watch?v=HDfr8PvfoOw)
- [YouTube: インタビュー動画 2](https://www.youtube.com/watch?v=I9aGC6Ui3eE)
- [イーロン・マスクを熱狂させた「長期主義」とはなにか？ | DISTANCE.media](https://distance.media/article/20240515000220/)
- [Claude's Constitution | Anthropic](https://www.anthropic.com/constitution)
- [ウィリアム・マッカスキル「効果的利他主義の定義」 — EA Forum](https://forum.effectivealtruism.org/posts/4v45j5fuDfRru5kQ9/wiriamu-makkasukiru-no)
- [When a Philosopher Designs AI: Amanda Askell on Claude's Character and Ethics](https://www.digiall.com.mx/en/blog/conectados-con-la-innovacion-3/when-a-philosopher-designs-ai-amanda-askell-on-claude-s-character-and-the-ethics-we-re-not-talking-about-27)
- [AI時代は哲学専攻ひっぱりだこ？ LinkedIn肩書に「倫理」5年で6倍 - 日本経済新聞](https://www.nikkei.com/article/DGXZQOUC04A660U5A101C2000000/)
- [About Me | Amanda Askell](https://askell.io/)
