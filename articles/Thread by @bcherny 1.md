---
title: "Thread by @bcherny - Claude Opus 4.6リリースとClaude Codeの新機能"
source: "https://x.com/bcherny/status/2019471487833706769"
author:
  - "[[Boris Cherny]]"
published: 2026-02-05
created: 2026-02-07
description: "Anthropic Claude Codeの開発者Boris Chernyによる、Claude Opus 4.6のリリース告知スレッド。Opus 4.6の特徴（より高いエージェント性能、長時間タスク持続、1Mトークンコンテキスト）、Claude Codeの思考エフォート調整機能、Agent Teams（Agent Swarms）の実験的リリース、使用量に関する推奨事項について言及。"
tags:
  - "clippings"
  - "AI"
  - "LLM"
  - "Claude"
  - "Anthropic"
  - "Claude Code"
  - "Opus 4.6"
  - "Agent Teams"
  - "Agentic Coding"
---

## 概要

AnthropicのClaude Code開発者である**Boris Cherny**（@bcherny）が、2026年2月5日にClaude Opus 4.6のリリースを告知したXスレッド。Opus 4.6の性能向上、Claude Codeの新しいエフォート調整機能、Agent Teams（Agent Swarms）の実験的リリースについて、ユーザーとのQ&A形式で情報を共有している。

## 主要なトピック

### Claude Opus 4.6の特徴

Boris Cherny自身の使用感として、Opus 4.6は以下の点で改善されている：

- **よりエージェンティック**: 自律的なタスク実行能力の向上
- **より知的**: 推論・判断能力の改善
- **長時間稼働**: エージェンティックタスクをより長く持続
- **より慎重で網羅的**: 自身のミスを検出・修正する能力の向上

Anthropic公式発表によると、Opus 4.6はさらに以下を実現：
- **1Mトークンコンテキストウィンドウ**（Opus系モデル初、ベータ版）
- **Terminal-Bench 2.0**でエージェンティックコーディング評価最高スコア
- **Humanity's Last Exam**で全フロンティアモデルをリード
- **GDPval-AA**でGPT-5.2を約144 Eloポイント上回る
- **MRCR v2**（1M・8-needle）で76%のスコア（Sonnet 4.5は18.5%）

### Claude Codeのエフォート調整機能

Claude Codeユーザー向けの新機能として、モデルの思考量を精密に調整可能：

- `/model` コマンドを実行し、左右矢印キーでエフォートレベルを調整
- **低エフォート** = より高速な応答
- **高エフォート** = より長い思考時間、より良い結果
- Boris Cherny個人は**Max effort**で使用していると回答
- 4段階のエフォートレベル: low, medium, high（デフォルト）, max

### Agent Teams（Agent Swarms）

Agent TeamsがClaude Codeで実験的にリリース：

- 複数のエージェントが並列でチームとして協調動作
- 独立した読み取り中心のタスク（コードベースレビューなど）に最適
- **実験的機能**であり、多くのトークンを消費する
- ドキュメント: https://code.claude.com/docs/en/agent-teams
- Shift+Up/Downまたはtmuxでサブエージェントを直接操作可能

### 使用量に関する推奨事項

- Agent Teams使用時は `/extra-usage` の利用を推奨
- $200/月のMaxプランでの使用制限への懸念に対する回答として言及

### モデル自動切り替えに関する明確化

> "Claude Code does not auto-switch models. The model you choose is the model you get"

Claude Codeがモデルを自動的にSonnet 4.5に切り替えるという指摘に対し、Boris Chernyは**Claude Codeはモデルの自動切り替えを行わない**と明確に否定。ユーザーが選択したモデルがそのまま使用される。

## 重要な事実・データ

- **Opus 4.6リリース日**: 2026年2月5日
- **API識別子**: `claude-opus-4-6`
- **価格**: $5/$25（入力/出力、100万トークンあたり）、200kトークン超はプレミアム価格（$10/$37.50）
- **最大出力トークン**: 128kトークン
- **コンテキストウィンドウ**: 1Mトークン（ベータ版）
- **Boris Chernyの役割**: Anthropic Member of Technical Staff、Claude Code開発者
- **Agent Teams**: 実験的機能、大量トークン消費

## 結論・示唆

### 実践的な示唆

- **Claude Codeユーザー**: `/model` でエフォートレベルを調整し、タスクの複雑さに応じて最適化する
- **Agent Teams利用時**: `/extra-usage` の有効化を検討する
- **モデル選択**: Claude Codeはモデルを自動切り替えしないため、意図したモデルが使用されている
- **高難度タスク**: Max effortでより良い結果が得られるが、コストとレイテンシのトレードオフあり
- **簡単なタスク**: モデルが過剰に思考する場合は、effortをmediumに下げることをAnthropicが推奨

## 制限事項・注意点

- Agent Teamsは**実験的機能**であり、安定性は保証されていない
- Agent Teamsは**大量のトークンを消費**するため、使用量制限に注意が必要
- 1Mトークンコンテキストは**ベータ版**
- Opus 4.6はデフォルトでより深く思考する傾向があり、簡単なタスクではコスト・レイテンシが増加する可能性がある

---

## 元スレッド

**Boris Cherny** @bcherny 2026-02-05

I've been using Opus 4.6 for a bit -- it is our best model yet. It is more agentic, more intelligent, runs for longer, and is more careful and exhaustive.

For Claude Code users, you can also now more precisely tune how much the model thinks. Run /model and arrow left/right to tune effort (less = faster, more = longer thinking & better results).

Happy coding!

> 2026-02-05
> 
> Introducing Claude Opus 4.6. Our smartest model got an upgrade.
> 
> Opus 4.6 plans more carefully, sustains agentic tasks for longer, operates reliably in massive codebases, and catches its own mistakes.
> 
> It's also our first Opus-class model with 1M token context in beta.

---

**Rishabh Maini** @RishabhMaini15 [2026-02-05](https://x.com/RishabhMaini15/status/2019474982183580108)

why the effort mode? its annoying, it should decide itself.

---

**Boris Cherny** @bcherny [2026-02-05](https://x.com/bcherny/status/2019475897691124107)

I keep mine at Max effort

---

**Rick Radewagen** @rickr7n [2026-02-05](https://x.com/rickr7n/status/2019486858716098706)

i want ultrathink back

---

**Boris Cherny** @bcherny [2026-02-05](https://x.com/bcherny/status/2019534641158615054)

Me tooo

---

**Garrett Kirschbaum** @ibekidkirsch [2026-02-05](https://x.com/ibekidkirsch/status/2019472493095055739)

Does this come with the agent swarm thing everyone has been talking about.

---

**Boris Cherny** @bcherny [2026-02-05](https://x.com/bcherny/status/2019475587719479454)

Yes

> 2026-02-05
> 
> Out now: Teams, aka. Agent Swarms in Claude Code
> 
> Team are experimental, and use a lot of tokens. See the docs for how to enable, and let us know what you think! https://code.claude.com/docs/en/agent-teams…

---

**Roman M - Still Human Robot Boss - e/acc** @BadTechBandit [2026-02-05](https://x.com/BadTechBandit/status/2019473680204472606)

Thank you! Have you done tests on how quickl one will hit usage restrictions on a $200/month max plan versus 4.5 Ultra Think..? 🤔

---

**Boris Cherny** @bcherny [2026-02-05](https://x.com/bcherny/status/2019475825905537314)

When using agent teams, we recommend /extra-usage

---

**Ansh** @anshdixit123 [2026-02-05](https://x.com/anshdixit123/status/2019483984263278782)

Why does claude code switches up model to sonnet 4.5 on it's own?

---

**Boris Cherny** @bcherny [2026-02-05](https://x.com/bcherny/status/2019534780849877033)

Claude Code does not auto-switch models. The model you choose is the model you get

---

*Source: [Thread by @bcherny](https://x.com/bcherny/status/2019471487833706769)*
