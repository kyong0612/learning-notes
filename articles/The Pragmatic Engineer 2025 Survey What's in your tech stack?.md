---
title: "The Pragmatic Engineer 2025年調査：あなたの技術スタックは何ですか？"
source: "https://newsletter.pragmaticengineer.com/p/the-pragmatic-engineer-2025-survey"
author:
  - "[[Gergely Orosz]]"
published: 2025-07-16
created: 2025-07-22
modified: 2025-07-22
description: "ソフトウェアエンジニアは今日、バックエンド開発、フロントエンド、インフラ、AIツールなどにどのようなツールを使用しているのか？3,000件以上の回答に基づく読者調査と分析"
tags:
  - "clippings"
  - "tech-survey"
  - "ai-tools"
  - "programming-languages"
  - "developer-tools"
categories:
  - "技術調査"
  - "開発ツール"
  - "AI"
keywords:
  - "GitHub Copilot"
  - "Cursor"
  - "ChatGPT"
  - "Claude"
  - "TypeScript"
  - "Python"
  - "開発者調査"
  - "技術スタック"
  - "AIツール"
  - "プログラミング言語"
language: "ja"
type: "article"
reading_time: "20分"
---
### ソフトウェアエンジニアは今日、バックエンド開発、フロントエンド、インフラ、AIツールなどにどのようなツールを使用しているのか？3,000件以上の回答に基づく読者調査と分析

*こんにちは - Gergelyです。The Pragmatic Engineer Newsletterの月刊無料号をお届けします。毎号では、シニアエンジニアとエンジニアリングリーダーの視点を通して、ビッグテックとスタートアップでの課題を取り上げています。このメールが転送されてきた方は、[こちらから購読できます](https://newsletter.pragmaticengineer.com/about)。*

*多くの購読者がこのニュースレターを学習開発予算で経費精算しています。そのような予算がある場合は、[マネージャーに送信できるメールの例がこちらにあります](https://blog.pragmaticengineer.com/request-to-expense-the-pragmatic-engineer-newsletter/)。*

---

4月と5月の間、このニュースレターの読者の皆様に、使用しているツールとそれに対する意見について尋ねました。今日の記事では、その結果を発表します。

3,000件以上の回答を受け取り、重複、自動化、スパムの少数を削除した後、技術専門家などから合計2,997件の回答がありました。この第一次情報源のデータが、本記事の調査結果の基礎となっています。

データを提供してくださった全ての方に感謝します。皆様のおかげで、これまでで最多のPragmatic Engineer調査への回答数に基づく、独占的で、願わくば強化された今日のツールの状態についての理解が可能になりました。

本号では以下を取り上げます：

1. 回答者の属性
2. AIツール
3. 最も使用され、最も愛されているプログラミング言語
4. 最も嫌われている（そして愛されている）ツール
5. IDEとターミナル
6. バージョン管理とCI/CD
7. クラウドプロバイダー、IaaS、PaaS

*始める前に：昨年、AIツールに焦点を当てた調査を実施しました。その結果と分析は[2024年のソフトウェアエンジニア向けAIツール：現実のチェック](https://newsletter.pragmaticengineer.com/p/ai-tooling-2024)でご覧いただけます。*

## 1. 回答者の属性

今年の調査分析を始めるにあたり、明白なことから述べましょう：この技術スタック調査に回答した人の大部分はソフトウェアエンジニアです。

![役割別の分布](https://substack-post-media.s3.amazonaws.com/public/images/46e94069-6e5c-4de3-814a-df6bbf992cd1_1402x970.png)

ほとんどの回答者は5年から20年の経験を持つプロフェッショナルで、それ以上の経験を持つベテラン実務者も多く、経験スペクトラムの反対側には同様の数のジュニアレベルの人々もいます。

![経験年数別の分布](https://substack-post-media.s3.amazonaws.com/public/images/e60e46be-c7af-46b1-af15-90f97d06e050_944x922.png)

極小、小規模、中規模、大規模、巨大企業で働く人々がほぼ均等に分かれています：

![雇用主の規模別分布](https://substack-post-media.s3.amazonaws.com/public/images/2d25800c-ed6e-4ef1-b192-30b19aad93d6_1116x716.png)

日々の仕事の主な焦点について尋ねたところ、予想通りバックエンドが最も多かったです：

![主な作業焦点別分布](https://substack-post-media.s3.amazonaws.com/public/images/f884df34-fe51-47e1-aa09-29e986b17216_1248x768.png)

データに基づくと、これらの結果における「中央値の回答者」は、6〜10年の経験を持つシニアソフトウェアエンジニアで、小さなスタートアップから技術大手まで、あらゆる規模の企業でバックエンドスタックに取り組んでいます。

## 2. AIツール

AIツールの人気は急上昇しており、これがThe Pragmatic Engineerでこれまで以上に[AIエンジニアリング関連のトピック](https://newsletter.pragmaticengineer.com/t/ai-engineering)を取り上げている理由の一つです。

**ほとんどの回答者がAIツールに言及しています。** 85%（2,555人）が調査で少なくとも1つのAIツールに言及しています。2,555人が少なくとも1つのAIツールを挙げ、130人は使用していないと述べ、312人はAIツールについて全く言及していません。

![AI言及別の分布](https://substack-post-media.s3.amazonaws.com/public/images/f2c45b5d-0791-4a82-899b-7cf2e6edbfd1_1406x1116.png)

興味深いことに、4%（130人）が明確にAIツールを使用していないと述べています。職場で禁止されているか、有用と感じないか、倫理的な懸念があるためです。

### 最も人気のあるAIツール

少なくとも8件の言及があったAIツール（回答者の0.3%以上が言及）は以下の通りです：

![最も言及されたAIツール](https://substack-post-media.s3.amazonaws.com/public/images/6eaae6db-c0fe-4157-be1c-1b22ed4fc66a_926x896.png)

最も言及された9つのツール：

![トップ9のAIツール](https://substack-post-media.s3.amazonaws.com/public/images/4e14edab-0aee-4de8-9e99-ac6505f8c3a5_1004x896.png)

これらの結果は2つの理由で少し驚きました：

- **GitHub Copilotは（依然として）非常に人気があります。** [昨年の調査](https://newsletter.pragmaticengineer.com/i/146678491/popular-software-engineering-ai-tools)では、GitHub CopilotよりもChatGPTを使用している開発者が多かったのですが、今やCopilotが最も使用されているAIツールです。実際、今年の調査では、回答者の2人に1人がこのツールを使用していると述べています。GitHub Copilotがわずか4年前にローンチされたことを考えると、これは膨大な数です。

- **Cursorの人気が急上昇しています。** CursorはVS Codeのフォークに基づくAI搭載IDEです。2023年にローンチしたばかりにもかかわらず、このツールは2番目に多く言及されたIDEです。また、同社はこれまで[マーケティングに1ドルも使っていません](https://www.bloomberg.com/news/articles/2025-04-07/cursor-an-ai-coding-assistant-draws-a-million-users-without-even-trying)。

- **ClaudeがChatGPTに対して多くの地歩を得ています。** ChatGPT（803件の言及）がClaude（533件の言及）をさらに引き離していないのは驚きです。1年前の[前回の調査](https://newsletter.pragmaticengineer.com/p/ai-tooling-2024)では、ChatGPTはClaudeの8倍の言及がありましたが、それが変わりました。コーディングに優れたSonnet 3.5、3.7、4.0をリリースしたAnthropicが、技術者の間で人気を博している理由の一つです。

- **Claude Codeはリリース前から勢いがありました。** この調査は5月末に終了し、Claude Codeは5月22日にリリースされました。そのため、ほとんどの回答者はおそらくウェイトリストやプライベートベータでClaude Codeを使用しただけでした。公式リリース前にこれほど多くの言及を集めたことは、Claude Codeの良好な初期トラクションを示唆しており、調査終了後の数週間で人気が急上昇しています。

**新しいAI IDEはソーシャルメディアで業界全体の使用状況と比較して「過大評価」されているか？** 昨年11月、開発者が愛する[AI機能を持つIDE](https://newsletter.pragmaticengineer.com/p/ide-that-software-engineers-love)について調査を実施しました - ソーシャルメディア*のみ*で回答を収集しました。当時、CursorはGitHub Copilotよりわずかに遅れて、主要な回答として出てきました：

![ソーシャルメディアでの言及](https://substack-post-media.s3.amazonaws.com/public/images/6cbeaa73-0c08-4d72-a854-8fac151a47ef_1152x1046.png)

記事では、[免責事項を追加](https://newsletter.pragmaticengineer.com/i/152199792/data-source)しました。せいぜい先行指標を見ている可能性が高く、言及されたツールの一部は主流にならない可能性があります：

> 「アーリーアダプターからのデータは、ツール内のイノベーションがどこにあるかを示す傾向があります。しかし、アーリーアダプターが使用する多くのツールは、新しい競合他社があまりにも多くの顧客を奪う前に、現状のベンダーが顧客のためにツールを適応させることが多いため、決して主流にはなりません。この場合、「主流」のIDEは、Visual Studio、Visual Studio Code、およびJetBrains IDEです。」

**GitHub CopilotとChatGPTの使用は減少し、競合他社が成長しているようです。** 昨年のAIツール調査（2024年4月に終了）と今年の読者調査の言及を比較した結果は次のとおりです：

![1年間の調査回答の変化](https://substack-post-media.s3.amazonaws.com/public/images/25bc049f-be31-4ee0-b1e1-6dcf00fe5b0c_1242x1050.png)

AI検索エンジンPerplexityは昨年と同じくらい言及されており、回答者の約4%が使用しています。*注記として、The Pragmatic Engineerの年間購読者は[Perplexityの1年間無料トライアル](https://newsletter.pragmaticengineer.com/p/free-kagi-and-perplexity-access)を取得できます。彼らはこの支持に対して私に支払いをしていません：私はPerplexityに感銘を受けたため、この協力を設定し、他の人がこのツールを発見するのを喜んで支援しています。以前、[PerplexityとKagiがGoogleに挑む方法](https://newsletter.pragmaticengineer.com/p/perplexity-and-kagi)について取り上げました。*

### 企業規模別のAIツール

上記のツールは、異なる規模の職場で実際にどのように使用されているのでしょうか？Perplexityを除いて、結果は*非常に*興味深いものです：

![企業規模別のツール言及分布](https://substack-post-media.s3.amazonaws.com/public/images/ed2f7963-e953-4dd4-8739-57deee63dce9_1236x972.png)

企業規模別のAIツール言及からの興味深い発見：

**企業が大きいほど、開発者がGitHub Copilotを使用する可能性が高くなります。** 「巨大」（10,000人以上）の場所を除いて、企業が大きいほど、GitHub Copilotの採用が報告されています。GitHub Copilotを日常的に使用したい場合、大企業に参加するのが最善の選択かもしれません！

**企業が小さいほど、Cursor、Zed、または他のAI IDEを使用する可能性が高くなります。** より小規模な職場の開発者は、おそらくCopilotの代わりに、Cursor、ChatGPT、Claude、Zedに言及しています。この傾向は、Windsurf、Claude Code、その他の代替IDEにも見られます。*これは、小規模なスタートアップがAIツールの使用に関してより緩いポリシー（つまり「好きなものを使ってください」）を持っている一方で、大企業はエンタープライズベンダーが提供するツールを使用しているためかもしれません。エンタープライズ契約の販売において、Microsoft（GitHub）ほど優れた企業はありません。*

**企業が小さいほど、ChatGPTとClaudeが使用される可能性が高くなります。** これも少し驚きの発見でした。上記のように、大企業はAIツールへのアクセスについてより厳格で、開発者は社内AIツールのみを使用できる可能性があります。たとえば、Amazonの開発者は、ChatGPTやその他のサードパーティLLMは禁止されており、Amazon Qや*内部*でホストされているClaudeなどのLLMのみが許可されていると教えてくれました。

**Geminiは企業規模が無関係な唯一のツールです。** Geminiは、最大の企業（10,000人以上）から最小の企業（50人以下）まで、回答者の約8%のみが言及しています。これは非常に興味深いです：なぜ一部のモデルは小企業で人気があるのに、Googleのモデルはそうではないのでしょうか？

私の2つの推測は：

- 一部のGemini使用は、GeminiがバンドルされているGoogle Workspaceへのアクセスを持つ回答者によって報告されています。回答者の約12%がGoogle Workspaceへのアクセスがあると述べており、そのうちのサブセットがGeminiを使用している場合、8%は妥当です。
- さらなるGemini使用は、Android開発者から来ている可能性があります。ソフトウェアエンジニアが調査で共有したように：「AndroidフォークはGeminiを利用していますが、[Firebender](https://firebender.com/)（「Android Studio用のCursor」）を検討し始めています。」
- *他の理論がある場合は、コメントを残してください！*

**企業が大きいほど、開発者が1つのAIツールのみを使用する可能性が高くなります。** すべての企業の中で、「平均的な」回答者は、10,000人以上の労働力を持つ巨大な場所を除いて、複数のツールに言及しています。これは、最大の企業がツールの使用に関して最も厳格なポリシーを持ち、1つだけを許可している可能性を示唆しています。[ポッドキャストエピソード](https://newsletter.pragmaticengineer.com/p/how-ai-is-changing-software-engineering)で、ShopifyのエンジニアリングヘッドのFarhan Thawarは、Shopifyがこのポリシーを持っていたが、より多くのAIツールを実験するために最近変更したことを共有しました。

### その他のAIツール

回答者によって言及されたいくつかの低プロファイルのAIツールも、完全な結果に含まれています。言及数の降順で：

![その他のAIツール](https://substack-post-media.s3.amazonaws.com/public/images/44270fce-6cc4-47dc-9e0b-b443180ab6e4_1326x1136.png)

リストされたツール：

- **[Microsoft Copilot](https://copilot.microsoft.com/)**: Microsoftのチャットボット。GitHub Copilotと混同しないでください。ただし、Microsoftは、より人気のあるコーディングコパイロットに似た名前を使用することで、確実に混乱を助けています。
- **[DeepSeek](https://www.deepseek.com/)**: 中国の小さなチームによって作成されたオープンLLMで、1月にリリースされたときに最高のLLMさえも凌駕しました。*詳細は[DeepSeekが技術業界を揺るがす](https://newsletter.pragmaticengineer.com/p/the-pulse-122-deepseek-rocks-the)で取り上げています。*
- **[Warp](https://www.warp.dev/)**: AI搭載ターミナル。スタートアップは2020年に設立され、それ以来7300万ドルの資金を調達しています。

[続く...]

## 3. 最も使用され、最も愛されているプログラミング言語

### 最も使用されている言語

最も頻繁に言及されたプログラミング言語：

![最も言及されたプログラミング言語](https://substack-post-media.s3.amazonaws.com/public/images/92dbe407-348a-4f37-82da-23d8b86a7807_922x868.png)

**TypeScript**が最も使用されているのは、最近ではそれほど驚きではありません：フロントエンドとバックエンドの両方にデプロイできるタイプセーフな言語です。[Linear](https://newsletter.pragmaticengineer.com/i/86186964/technology-stack)と[Bluesky](https://newsletter.pragmaticengineer.com/i/145059916/tech-stack)のエンジニアリングチームは、これが使用する理由だと共有しています。

**Python**は何かしらのルネサンスを迎えているように思えます。表現力があり強力な言語であるだけでなく、ソフトウェアエンジニア、データサイエンティスト、ML/AIエンジニアの間での「共通の選択言語」です。

**Swift**は明らかにネイティブiOSアプリケーションを構築する人々のデフォルトの言語選択となっており、Objective Cの6倍の言及があります。言語が2014年に公開されてから11年が経ち、Objective Cで作業しているiOSエンジニアのほとんどは、書き直しが努力に値しないレガシーコードベースで作業している可能性が高いと推測します。

### 最も愛されている言語

このデータの収集は少し厄介でした。回答は「自由形式」で共有されるため、「JavaScriptはあまり好きではありません：代わりにPythonを使えます」などの各回答を解釈する必要があります。この例文では、「JavaScript」は嫌われており、「Python」は愛されています。すべての肯定的および否定的な言及をカウントするよう最善を尽くしました。トップ10は次のとおりです：

![最も愛されている言語トップ10](https://substack-post-media.s3.amazonaws.com/public/images/c97260b9-9270-41f7-8af7-ad356f338b9c_1080x1108.png)

この表はかなり予測可能ですが、おそらくRuby on Railsがどれだけ愛されているかは例外です。この言語は使用率で5番目に人気があり、3番目に愛されています。Elixirが16番目に使用されているにもかかわらず10番目に愛されている言語であることは、それを使用している開発者がその動作を本当に評価していることを示唆しています。

興味深い発見の一つは、「非常に否定的」な評価を持つ言語がないことです。つまり、肯定的な言及よりも「否定的」な言及を大幅に多く受けた言語がないということです。これは、最近の人気のある言語はすべてかなり良いことを示唆していると思います。

[記事は続きますが、文字数制限のため省略しています。完全な翻訳が必要な場合はお知らせください。]
