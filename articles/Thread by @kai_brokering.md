---
title: "Thread by @kai_brokering"
source: "https://x.com/kai_brokering/status/2021778854399050123"
author:
  - "[[@kai_brokering]]"
  - "Kai Brokering"
published: 2026-02-10
created: 2026-02-13
description: "VoiceOS創業者のKai Brokeringが、音声入力アプリTypelessのプライバシー問題を受けて、オンデバイス処理とクラウド処理のトレードオフ、VoiceOSのセキュリティ対策（SOC 2レベル、Private Mode）、および透明性の重要性について述べたスレッド。日本のユーザーからのフィードバックも含む。"
tags:
  - "clippings"
  - "voice-input"
  - "privacy"
  - "VoiceOS"
  - "Typeless"
  - "on-device-vs-cloud"
  - "security"
  - "transparency"
---

## 要約

### 背景

音声入力アプリ「Typeless」に対して、@medmuspg（げれげれ）がリバースエンジニアリングを行い、深刻なプライバシーリスクを発見したとする注意喚起スレッドが話題となった。Typelessは「On-device history」「Zero data retention」を謳っているが、実際にはクラウドへのデータ送信が行われているとの指摘があった。このスレッドに対し、同業の音声入力ツール「[VoiceOS](https://voiceos.com)」の創業者であるKai Brokeringが、業界の視点から見解を共有した（77.9K Views、262 Likes、73 Reposts）。

### Kai Brokeringの主な主張

#### 1. オンデバイス処理 vs クラウド処理のトレードオフ

- **完全ローカルモデル**：最大限のプライバシーを提供するが、精度と機能を犠牲にする
- **クラウドホスト型モデル**：はるかに高性能だが、データがデバイスを離れる必要がある
- Appleのような**プライバシー重視企業**でさえ、Apple Intelligenceにはサーバーを使用している
- 現時点のオンデバイスモデルは、品質やパフォーマンスを犠牲にせずに最高の体験を提供するほど強力ではない

#### 2. VoiceOSのアプローチ

- Appleと同様の原則に従い、**一部はローカル処理、大部分はプライベートクラウド**で処理
- より高品質な結果を提供するためのハイブリッドアーキテクチャを採用

#### 3. コンテキスト利用の説明

- 多くの音声ツールはアクティブなアプリやテキストフィールドなどの**コンテキスト情報**を活用する
- ビジネスメールと友人へのメッセージでは書式や文字起こしの品質要件が異なるため、コンテキストが品質向上に寄与する

#### 4. VoiceOSのセキュリティ対策

| 項目 | 内容 |
|------|------|
| インフラ | エンタープライズグレード |
| セキュリティ認証 | SOC 2レベル |
| Private Mode | 音声・文字起こし・使用データをサーバーに保存しない |
| 制限事項 | Private Modeでは一部の高度な機能が制限される（ChatGPTのプライベートチャットと同様） |
| Trust Center | [trust.voiceos.com](https://trust.voiceos.com) |

### 日本のユーザーからのフィードバック

#### 濱本隆太（@Ryurku_ore）の見解
- 日本のユーザーは**セキュアなクラウドサービスへの接続自体**には大きな懸念を持っていない
- Typelessの問題は、**会社名などの基本情報が明示されていないこと**による不透明感

#### TBO（@tbo_Eedge）の見解
- クラウドへのデータ送信は理解できる
- **運営会社がウェブサイトから不明瞭**なことが最も不安を感じる点
- VoiceOSのユーザーであり、製品を高く評価

#### Kai Brokeringの応答
- **透明性が非常に重要**であることに同意
- ウェブサイトをさらに分かりやすくすることを約束
- ユーザーフィードバックを積極的に求める姿勢

### 重要な結論

1. **品質とプライバシーのトレードオフは不可避**：現在の技術では、完全ローカル処理と最高品質のAI処理を両立することは困難
2. **透明性が最大の差別化要因**：日本市場において、クラウド処理自体より**企業の透明性**（会社情報、データ取扱い方針の明示）がユーザーの信頼獲得に不可欠
3. **ハイブリッドアプローチが現実的**：Apple同様、プライバシーを重視しつつクラウドの処理能力を活用するモデルが業界標準になりつつある

### VoiceOSについて

- **創業者**: Kai Brokering
- **バッカー**: Y Combinator
- **製品**: 音声をプロフェッショナルなテキストに変換するAI音声入力ツール
- **対応言語**: 100以上
- **対応アプリ**: Gmail, Slack, Notion, VS Code, Cursor, ChatGPT, Claudeなど
- **価格**: 無料プラン（週100回）/ Pro $12/月（年額払い）/ Enterprise（カスタム）

---

## 元のスレッド

**Kai Brokering** @kai\_brokering 2026-02-10

Founder of VoiceOS here. Thought I'd share our perspective since we're in a similar space.

Just to be clear, I have no affiliation with the Typeless team and haven't used their product, so I won't comment on their specific implementation.

There's always a trade-off between fully on-device and cloud models. Fully local models offer maximum privacy, but they typically sacrifice accuracy and capability. Cloud-hosted models are significantly more powerful, but they require data to leave the device.

Even privacy-first companies like Apple use servers for Apple Intelligence. Today's on-device models simply aren't powerful enough to deliver the best experience without sacrificing quality or performance.

VoiceOS follows a similar principle as Apple.

Some processing happens locally, but most intelligence runs on our private cloud infrastructure so we can provide higher quality results.

I don't know the specifics of Typeless' implementation, but many voice tools use context like the active app or text field. Writing a business email is very different from texting a friend and that context can improve formatting and transcription quality.

If someone prefers fully local tools, that's completely valid. Just know that today there's usually a quality trade-off.

VoiceOS is built with enterprise-grade infrastructure and SOC 2 level security. Private Mode stores no audio, transcripts, or usage data on our servers. It does limit certain advanced features, similar to using private chat in ChatGPT.

We care a lot about transparency and would love feedback. What would make you feel comfortable using VoiceOS?

https://trust.voiceos.com

> 2026-02-10
> 
> 【注意喚起】音声入力アプリ「Typeless」をリバースエンジニアリングした結果、かなり深刻なプライバシーリスクが見つかったので共有します。
> 
> ■ 結論から
> 
> Typelessは「On-device history」「Zero data

---

**濱本隆太@TIMEWELL｜AIエージェント起業家** @Ryurku\_ore [2026-02-12](https://x.com/Ryurku_ore/status/2021812882577797178)

I believe Japanese users do not have significant concerns about connecting to secure cloud services in general. The main issue with Typeless is the lack of clear disclosure—such as the company name and other key details—which creates a strong sense of opacity and leads to

---

**Kai Brokering** @kai\_brokering [2026-02-12](https://x.com/kai_brokering/status/2021820595814773083)

Thanks for the detailed response. This is super helpful!

---

**TBO** @tbo\_Eedge [2026-02-12](https://x.com/tbo_Eedge/status/2021804089508819144)

I basically understand sending data to the cloud, but in the case of Typeless, the fact that the operating company isn't clear from the website is what makes me the most anxious.

By the way, I'm using your product! It's freaking awesome!

---

**Kai Brokering** @kai\_brokering [2026-02-12](https://x.com/kai_brokering/status/2021804501381132592)

yeah I think transparency is super important. I'll make our website even more clear.

And thanks for trying out VoiceOS!

---

**ユート | 30代でサイドFIREを達成** @yutoblog4970 [2026-02-12](https://x.com/yutoblog4970/status/2021853750344954217)

@grok 要点要約。日本語で出力して。

---

**Andrey** @Andrey\_\_HQ [2026-02-12](https://x.com/Andrey__HQ/status/2021802087722717499)

goated founder goated response goated security levels
