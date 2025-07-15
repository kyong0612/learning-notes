---
title: "MCPサーバで始めたアラート整理の実験的取り組み"
source: "https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi"
author:
  - "Erika Takada"
published: 2025-07-11
created: 2025-07-15
description: |
  SRE NEXT 2025での登壇資料。SREの現場でAIを過度に信頼せず、「ちょい使い」するという現実的なアプローチを提案。特に、MCPサーバを利用してアラート情報を整理・要約し、インシデント対応の初動を支援する実験的な取り組みについて解説しています。
tags:
  - "clippings"
  - "SRE"
  - "AI"
  - "LLM"
  - "アラート管理"
  - "インシデント対応"
  - "MCPサーバ"
---

本資料は、株式会社モニクルのSREであるErika Takada氏による、SREの現場でAIを現実的に活用する「ちょい使い」アプローチに関する発表をまとめたものです。特に、MCPサーバを利用してアラート対応の初動を効率化する実験的な取り組みが紹介されています。

### 導入：AI活用の現実的なアプローチ「ちょい使い」

[![slide_0](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_0.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#1)

AI導入に対して、「何かすごいことをしなければならない」というプレッシャーを感じがちですが、実際には「ちょっと助けてくれる」だけでも現場は大きく改善されると提唱。疲弊しないバランスでAIを活用する「ちょい使い」のコンセプトが紹介されました。

[![slide_2](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_2.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#3)

### アラート対応の課題

現場では、アラートが発生した際に以下のような課題に直面します。

* アラート内容が不明確（「これ何？」）
* 影響範囲の特定が困難
* SEV（インシデントレベル）の判断が難しい
* 致命的ではないが気になるアラートを調査する時間がない

[![slide_4](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_4.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#5)

### MCPサーバを用いた実験的取り組み

この課題に対し、アラートの内容を理解しやすくするための「整理」をAIに任せるアプローチが試されました。

#### 目的とアプローチ

アラート対応を全てAIに任せるのは、技術的・コスト的・組織的な制約から非現実的です。そこで、LLMを用いて以下の「ちょい使い」を目指しました。

* 原因候補の提示
* ログのざっくりとした要約
* 判断材料の補助

[![slide_5](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_5.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#6)

#### なぜMCPサーバか？

「原因候補だけ出してほしい」「ログをざっくりまとめてほしい」といったニーズにMCPサーバが合致しており、半日程度で実装できる手軽さから、小規模に始めるのに最適でした。

[![slide_7](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_7.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#8)

#### 構成

意識せずに使える仕組みとして、以下のワークフローを構築しました。

1. **Slackにアラート通知**
2. **n8nが起動**
3. **Sentryと自前のMCPサーバ（ログ取得用）で情報収集**
4. **LLMが情報を要約し、SEVを判定**
5. **結果をSlackに自動返信**

[![slide_9](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_9.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#10)

### 評価と今後の課題

#### 良かった点

* **試行錯誤のしやすさ**: シンプルな構成のため、改善サイクルを回しやすい。
* **アラートの信頼性向上**: ログとイベント情報を組み合わせることで文脈が補足される。
* **判断のハードル低下**: SEV判断の補助があることで、心理的な負担が軽減される。

#### 課題

* **改善サイクルの確立**: LLMの回答の正しさを評価し、フィードバックする仕組みが必要。
* **ドメイン知識の注入**: プロダクト固有の前提知識や業務背景をLLMにどう伝えるかが今後の課題。

[![slide_11](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_11.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#12)

### 結論

AIは「ちょっと助けてくれる」だけでも現場に大きな価値をもたらします。特に「ちょい使い」は **「早い・軽量・柔軟」** であり、試行錯誤を通じて現場に合った活用法を見つけやすいアプローチです。今回のアラート整理では、MCPサーバの存在がその鍵となりました。

現場に合った「ちょい使い」できるところから、小さく始めることが重要であると締めくくられました。

[![slide_13](https://files.speakerdeck.com/presentations/76ce39c9e7ec41c589b1b1d09729f960/slide_13.jpg)](https://speakerdeck.com/beaverjr/mcpsabadeshi-metaaratozheng-li-noshi-yan-de-qu-rizu-mi#14)
