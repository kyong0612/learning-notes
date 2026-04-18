---
title: "Thread by @AiBattle_ / @bcherny — MRCR v2 ベンチマークと Opus 4.7 の長文脈性能"
source: "https://x.com/bcherny/status/2044825898613187051?s=12"
author:
  - "[[@AiBattle_]]"
  - "[[@bcherny]] (Boris Cherny, Anthropic)"
published: 2026-04-16
created: 2026-04-18
description: |
  Opus 4.7 は MRCR v2 (8-needle) の long-context ベンチマークで Opus 4.6 より大幅に低スコアとなったが、Anthropic の Boris Cherny は「MRCR は distractor を積み上げて騙すだけの指標で、実利用の long-context を反映していない」として段階的に廃止中であり、Graphwalks の方が応用的な長文脈推論の指標として優れていると説明。Mythos Preview system card からは MRCR を除外し、以降も Graphwalks を主指標とする方針。コミュニティ側は 4.7 の実使用での長文脈性能悪化を体感しているという声と、用途によっては改善という声に分かれている。
tags:
  - "clippings"
  - "LLM"
  - "Anthropic"
  - "Claude-Opus-4.7"
  - "long-context"
  - "benchmarks"
  - "MRCR"
  - "Graphwalks"
---

## 概要

X (Twitter) 上で行われた、**Anthropic Claude Opus 4.7 の long-context 性能低下疑惑**に関するスレッドのクリッピング。

- **発端 (@AiBattle_)**: MRCR v2 (8-needle) の long-context benchmark で、Opus 4.7 が Opus 4.6 を大きく下回ったことを指摘。
- **Anthropic 側の回答 (@bcherny / Boris Cherny)**: MRCR は実利用の long-context 体験を反映していないため Anthropic 内で段階的に廃止中であり、**Graphwalks** を今後の主要指標とする方針を表明。
- **コミュニティの反応**: 実使用での印象は分かれているが、「Opus 4.5 の魅力だった *文脈をまたぐ継続作業* が 4.7 では弱まった」という声もある。

---

## 1. @AiBattle_ のベンチマーク報告 (2026-04-16)

> Opus 4.7 (Max) and Opus 4.6 (64K) scores on the MRCR v2 (8-needle) context benchmark

MRCR v2 の **8-needle 条件**で計測した Opus 4.6 / Opus 4.7 のスコア。

| コンテキスト長 | Opus 4.6 | Opus 4.7 | 差分 |
|:---------------|---------:|---------:|-----:|
| 256K           |   91.9%  |   59.2%  | **-32.7pt** |
| 1M             |   78.3%  |   32.2%  | **-46.1pt** |

- どちらのコンテキスト長でも **Opus 4.7 が大幅劣化**。
- 特に 1M トークン域では **半分以下のスコア**に落ちており、needle-in-a-haystack 系タスクで顕著な退行。
- 添付画像は score の棒グラフ（Opus 4.6 が両条件とも上回るビジュアル）。

> ![Image](https://pbs.twimg.com/media/HGCTpkSWoAA6jK0?format=jpg&name=large)

---

## 2. Boris Cherny (Anthropic) の公式回答 (2026-04-16)

Boris Cherny (Anthropic / Claude Code 開発リード) が直接応答した要点：

### 2.1 MRCR は system card に「科学的誠実さのため」残しているだけ

> We kept MRCR in the system card for scientific honesty, but we've actually been phasing it out slowly.

MRCR は最近まで Anthropic の system card に掲載されてきたが、**内部的には段階的廃止 (phasing out) を進めている**と明言。

### 2.2 MRCR を重視しない 2 つの理由

1. **"distractor を積み上げてモデルを騙す" 構造のベンチマークである**
   - "it's built around stacking distractors to trick the model, which isn't how people actually use long context"
   - 実際のユーザーの long-context 使い方を反映していない。
2. **needle retrieval より *applied long-context capability* を重視している**
   - 実タスクでの長文脈推論（特に long-context code）に社内評価で強い結果が出ている。

### 2.3 今後の主要指標は Graphwalks

- Graphwalks は「**applied reasoning over long context**（長文脈上の応用的推論）」を測る指標として優れている。
- 最新のモデル (Opus 4.7 を含む) は長文脈 **コード**タスクで良好な結果を示している、と内部評価を示唆。

### 2.4 Mythos Preview system card では MRCR を除外

- **Mythos Preview** の system card には MRCR を掲載せず、Graphwalks を掲載。
- **今後のモデルもこの方針を踏襲**。

> MRCR wasn't included in the Mythos Preview system card for these reasons, but Graphwalks was — that will be the case for future models too.

参照資料: [Anthropic system card PDF](https://cdn.sanity.io/files/4zrzovbb/website/037f06850df7fbe871e206dad004c3db5fd50340.pdf)

> ![Image](https://pbs.twimg.com/media/HGCuS_jbYAATHS1?format=jpg&name=large)

---

## 3. コミュニティの反応

スレッド内の返信を整理したもの。

### 3.1 賛同・質問系

- **@AiBattle_** (2026-04-16): "Thanks for the explanation" — 説明を了承。
- **@RobbinJBanks** (2026-04-17): LLM が needle-in-haystack が苦手なら、**DB 関数などの外部ツールに委譲**し、ユーザーから見えないところで同期すればよいのでは？という提案。
- **@nattyshaps** (2026-04-17): "So is 4.7 worse or better? I'm not sure what you're talking about" — 素朴な疑問。

### 3.2 実用面での劣化報告

- **@bt_sofia_ai** (wyswyswys / 2026-04-16):
  - Opus 4.5 は **"同一コンテキスト内で元の作業に戻れる"** 柔軟さが魅力だった。
  - 例: 修正 → バグ発見 → 同じコンテキストでバグ修正 → 元の作業に復帰、という流れ（"that was magic"）。
  - それができないなら **Sonnet を使えばよい**、つまり Opus を選ぶ理由が薄れる、という批判。
- **@ai_appreciator** (2026-04-16):
  - 自身の "hardest test"（未公開小説を一般読者向けに分析するタスク: long context + 複雑な情報関係 + 主観的推論 + EQ + accessible writing）で検証。
  - 結果: **Opus 4.7 は Opus 4.6 より correctness の誤りが多い**。

### 3.3 ミックスな評価

- **@moonride303** (MoonRide / 2026-04-16):
  - 自作の "simple reasoning across various contexts" ベンチで計測。
  - **Opus 4.5 より明確に改善**、だが **Opus 4.6 よりやや悪い**。
  - **複雑な RCA (Root Cause Analysis) タスクは MRCR スコアと相関**している可能性を示唆。
  - 総評: "Mixed feelings about this release"。

### 3.4 ノイズ投稿

- **@findy_code** (Findy): 【あすけん】の求人宣伝。スレッドの議論とは無関係な広告投稿。

---

## 4. 重要な論点・示唆

### 4.1 ベンチマーク方法論の転換

Anthropic は long-context 評価の主軸を **needle retrieval 系 (MRCR)** から **applied reasoning 系 (Graphwalks)** にシフトしている。

| 指標 | 性質 | Anthropic の位置づけ |
|------|------|----------------------|
| **MRCR v2 (8-needle)** | distractor を積み上げた needle-in-haystack | 段階的廃止中、system card からも外す |
| **Graphwalks** | 長文脈における応用的推論 | 今後の主指標 |

### 4.2 「ベンチマークスコア vs. 実利用体感」の乖離

- スレッド全体として、**MRCR スコア悪化 ≠ 実用上無意味、とも言い切れない**ことが示唆されている。
- @moonride303 の指摘通り、**複雑な RCA など実タスクの一部は MRCR と相関**している可能性。
- @bt_sofia_ai の「同一コンテキストで行き来できるワークフロー」が 4.7 で弱まったという報告は、long-context の "coherence" 的性能の退行を示している。

### 4.3 回避策 (@RobbinJBanks 提案)

- needle retrieval が苦手なら、**ツール呼び出し（DB / 検索 / メモリ）で補完**するアーキテクチャに寄せるという現実的な方向性。
- 実際、最近の Claude Code や Anthropic API は **context management / memory tools** 方面に投資が進んでいる（他ノート参照: `Context Management`, `Token-saving updates on the Anthropic API` など）。

---

## 5. 公式発表まとめ (Boris Cherny 要点)

1. **MRCR は廃止方向** — system card 掲載は「科学的誠実性のため」残しているだけ。
2. 理由 ① distractor-stacking は実ユースケースと乖離。
3. 理由 ② Anthropic は **applied long-context capability** を重視。
4. **Graphwalks が今後の主指標** — Mythos Preview 以降の system card は Graphwalks を採用。
5. 内部評価では Opus 4.7 は **long-context code タスクで良好**。

---

## 6. 制限事項・注意点

- スレッドは X (Twitter) のソーシャル議論であり、**@AiBattle_ のスコアは独立検証値**（ソース・詳細条件は投稿内では未公開）。Anthropic 公式の system card 値とは一致しない可能性あり。
- Boris Cherny の発言は Anthropic の**公式ブログや system card ではなく、個人アカウントからの投稿**。ただし Anthropic 社員としての権威性は高い。
- @ai_appreciator / @bt_sofia_ai / @moonride303 の体感評価は **個人のプライベートベンチマーク**であり再現性は担保されていない。
- MRCR / Graphwalks の詳細仕様や Mythos Preview 内部スコアはこのスレッドからは得られない。別途 [system card PDF](https://cdn.sanity.io/files/4zrzovbb/website/037f06850df7fbe871e206dad004c3db5fd50340.pdf) 参照。

---

## 7. 関連ノート

- `Best practices for using Claude Opus 4.7 with Claude Code.md`
- `Context Management/note.md`
- `コンテキストウィンドウ/note.md`
- `NoLiMa: Long-Context Evaluation Beyond Literal Matching/note.md`
- `Token-saving updates on the Anthropic API/note.md`

---

## 原文スレッド（保全）

**AiBattle** @AiBattle\_ [2026-04-16](https://x.com/AiBattle_/status/2044797382697607340)

Opus 4.7 (Max) and Opus 4.6 (64K) scores on the MRCR v2 (8-needle) context benchmark

256K:

\- Opus 4.6: 91.9%

\- Opus 4.7: 59.2%

1M:

\- Opus 4.6: 78.3%

\- Opus 4.7: 32.2%

![Image](https://pbs.twimg.com/media/HGCTpkSWoAA6jK0?format=jpg&name=large)

---

**Boris Cherny** @bcherny [2026-04-16](https://x.com/bcherny/status/2044825898613187051)

👋 We kept MRCR in the system card for scientific honesty, but we've actually been phasing it out slowly.

Two reasons: (1) it's built around stacking distractors to trick the model, which isn't how people actually use long context, and (2) we care more about applied long-context capability than needle-retrieval. Graphwalks is a better signal for applied reasoning over long context, and internally we've seen this model do really well on long-context code.

MRCR wasn't included in the Mythos Preview system card for these reasons, but Graphwalks was - that will be the case for future models too.

See system card: https://cdn.sanity.io/files/4zrzovbb/website/037f06850df7fbe871e206dad004c3db5fd50340.pdf…

![Image](https://pbs.twimg.com/media/HGCuS_jbYAATHS1?format=jpg&name=large)

---

**AiBattle** @AiBattle\_ [2026-04-16](https://x.com/AiBattle_/status/2044834551378170228)

Thanks for the explanation

---

**Robbin Banks** @RobbinJBanks [2026-04-17](https://x.com/RobbinJBanks/status/2045106264137478250)

If LLMs are bad at needles in a haystack tests why can't we give it access to a database function that handles that task for it and teach the AI to use that. If the sync happens automatically in the "eyes of the user"...

---

**wyswyswys** @bt\_sofia\_ai [2026-04-16](https://x.com/bt_sofia_ai/status/2044851496521785749)

My dude we have distracting conversations all the time. The reason why Opus 4.5 was so good was because we could fix something, realise there's a bug, then go fix it in the same context before returning back to the old context. That was magic. Otherwise why use Opus when Sonnet

---

**Findy(ファインディ)** @findy\_code

【あすけん】AI食事管理サービス

\- 技術刷新を牽引するシニアテックリードを募集！

\- 1,300万会員の膨大なデータとAIで、新たな価値創造に挑む

👇Findyで求人をチェック（登録無料）

---

**nathan ⬢** @nattyshaps [2026-04-17](https://x.com/nattyshaps/status/2044934671268769897)

So is 4.7 worse or better? I'm not sure what you're talking about

---

**AI Appreciator** @ai\_appreciator [2026-04-16](https://x.com/ai_appreciator/status/2044834726968795629)

My initial checks on my hardest test (analyze for a layman audience an unpublished novel; tests long context, complex web of info relationships, subjective reasoning, emotional iq, accessible writing, etc.) show Opus 4.7 making more correctness mistakes than Opus 4.6.

Dunno if

---

**MoonRide** @moonride303 [2026-04-16](https://x.com/moonride303/status/2044851644513304591)

In my own benchmark (set of simple reasoning questions in range of contexts) it's noticably better than opus 4.5, but slightly worse than 4.6. Ability to perform tasks like complex RCA might be actually aligned with MRCR scores. Mixed feelings about this release.
