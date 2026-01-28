---
title: "Thread by @karpathy"
source: "https://x.com/karpathy/status/2015883857489522876"
author:
  - "[[@karpathy]]"
published: 2026-01-26
created: 2026-01-28
description: "Andrej KarpathyによるLLMコーディング（特にClaude Code）の数週間にわたる使用経験をまとめたスレッド。ワークフローの劇的な変化、エージェントの強みと限界、プログラミングの未来に関する洞察を共有。"
tags:
  - "clippings"
  - "LLM"
  - "AI-coding"
  - "Claude-Code"
  - "software-engineering"
  - "developer-productivity"
---

## 要約

Andrej Karpathy（元Tesla AI責任者、OpenAI共同創設者）が、2025年12月前後にLLMコーディングエージェント（特にClaude Code）を集中的に使用した経験から得た洞察をまとめたスレッド。

---

## 主要ポイント

### 1. コーディングワークフローの劇的な変化

- **2025年11月**: 手動コーディング+オートコンプリート 80% / エージェント 20%
- **2025年12月**: エージェントコーディング 80% / 手動編集・タッチアップ 20%
- 「英語でプログラミングする」時代への移行
- **約20年間のプログラミング経験で最大の変化**が数週間で起きた
- エンジニアの二桁％（10%以上）に同様の変化が起きていると推測されるが、一般認知は一桁％

### 2. IDEとエージェントの現実的な評価

**過度な期待への警告:**
- 「IDEは不要」「エージェント群（swarm）」というハイプは時期尚早
- モデルはまだ間違いを犯す
- **推奨ワークフロー**: 左側にClaude Codeセッション（ghosttyウィンドウ/タブ）、右側にIDEでコード確認＋手動編集

**モデルの典型的な問題点:**
| 問題カテゴリ | 詳細 |
|------------|------|
| 誤った前提 | ユーザーに代わって勝手に仮定を立てて進む |
| コミュニケーション不足 | 混乱を管理しない、確認を求めない、矛盾を指摘しない |
| トレードオフ提示の欠如 | 選択肢やトレードオフを提示しない |
| 過度な追従性 | プッシュバックすべき時にしない（sycophantic） |
| コードの肥大化 | 過度に複雑化、抽象化の膨張、デッドコードの放置 |
| 非効率な実装 | 1000行で実装するが、指摘すると100行に削減可能 |
| 無関係な変更 | タスクと無関係なコメントやコードを変更/削除することがある |

> これらの問題は `CLAUDE.md` での指示にもかかわらず発生する

### 3. エージェントの強み

#### 粘り強さ（Tenacity）
- 人間が諦めるような状況でも疲れず、落胆せず、試行を続ける
- 30分格闘して成功するのを見ると「AGIを感じる」瞬間
- **スタミナ（持久力）が仕事のボトルネック**であり、LLMによりこれが劇的に向上

#### スピードアップと拡張
- 単なる「速度向上」だけでなく、以下の**拡張効果**がある：
  1. 以前はコスト的に見合わなかったものもコーディング可能に
  2. 知識/スキル不足で手が出せなかったコードにもアプローチ可能

#### レバレッジの活用法
> 「何をすべきか」を指示するのではなく、**成功基準を与えて実行させる**

- テストを先に書かせ、それをパスさせる
- Browser MCPと連携してループさせる
- まず正しいナイーブなアルゴリズムを書かせ、その後正確性を保ちながら最適化させる
- **命令的（imperative）から宣言的（declarative）アプローチへ**転換し、エージェントを長くループさせる

### 4. 楽しさ（Fun）

- 退屈な穴埋め作業が減り、**創造的な部分が残る**
- 行き詰まり感が減少、常に前進できる勇気
- **エンジニアの分岐**: 「コーディング自体が好き」vs「ビルディングが好き」で反応が分かれる

### 5. 能力の萎縮（Atrophy）

- 手動でコードを書く能力が徐々に衰えていくことを実感
- **生成（コード記述）と識別（コード読解）は脳内で別の能力**
- 読解はできても記述に苦労する状態になりうる

### 6. 2026年の予測: Slopacolypse（スロパカリプス）

> 2026年は「スロパカリプス」の年になる

- GitHub、Substack、arXiv、X/Instagram、デジタルメディア全般で低品質AI生成コンテンツが氾濫
- AIハイプの「生産性シアター」（見せかけの生産性）が増加
- ただし、実際の改善も並行して存在

---

## 未解決の問い

1. **「10Xエンジニア」はどうなる？** - 平均と最高のエンジニア間の生産性比率が大幅に拡大する可能性
2. **ジェネラリストvsスペシャリスト** - LLMはミクロ（穴埋め）が得意でマクロ（戦略）は苦手。ジェネラリストが有利になる？
3. **LLMコーディングの体験は将来どうなる？** - StarCraft？Factorio？音楽演奏？
4. **デジタル知識労働がボトルネックの社会はどれほどある？**

---

## 結論（TLDR）

> **2025年12月頃、LLMエージェント能力（特にClaudeとCodex）がある種の一貫性の閾値を超え、ソフトウェアエンジニアリングに相転移を引き起こした。**

- 知性（intelligence）の部分が他の要素（ツール統合、知識、新しい組織ワークフロー、プロセス、普及）よりかなり先行している
- **2026年は、業界がこの新しい能力を消化する高エネルギーな年になる**

---

## 原文

**Andrej Karpathy** @karpathy [2026-01-26](https://x.com/karpathy/status/2015883857489522876)

A few random notes from claude coding quite a bit last few weeks.

Coding workflow. Given the latest lift in LLM coding capability, like many others I rapidly went from about 80% manual+autocomplete coding and 20% agents in November to 80% agent coding and 20% edits+touchups in December. i.e. I really am mostly programming in English now, a bit sheepishly telling the LLM what code to write... in words. It hurts the ego a bit but the power to operate over software in large "code actions" is just too net useful, especially once you adapt to it, configure it, learn to use it, and wrap your head around what it can and cannot do. This is easily the biggest change to my basic coding workflow in ~2 decades of programming and it happened over the course of a few weeks. I'd expect something similar to be happening to well into double digit percent of engineers out there, while the awareness of it in the general population feels well into low single digit percent.

IDEs/agent swarms/fallability. Both the "no need for IDE anymore" hype and the "agent swarm" hype is imo too much for right now. The models definitely still make mistakes and if you have any code you actually care about I would watch them like a hawk, in a nice large IDE on the side. The mistakes have changed a lot - they are not simple syntax errors anymore, they are subtle conceptual errors that a slightly sloppy, hasty junior dev might do. The most common category is that the models make wrong assumptions on your behalf and just run along with them without checking. They also don't manage their confusion, they don't seek clarifications, they don't surface inconsistencies, they don't present tradeoffs, they don't push back when they should, and they are still a little too sycophantic. Things get better in plan mode, but there is some need for a lightweight inline plan mode. They also really like to overcomplicate code and APIs, they bloat abstractions, they don't clean up dead code after themselves, etc. They will implement an inefficient, bloated, brittle construction over 1000 lines of code and it's up to you to be like "umm couldn't you just do this instead?" and they will be like "of course!" and immediately cut it down to 100 lines. They still sometimes change/remove comments and code they don't like or don't sufficiently understand as side effects, even if it is orthogonal to the task at hand. All of this happens despite a few simple attempts to fix it via instructions in CLAUDE . md. Despite all these issues, it is still a net huge improvement and it's very difficult to imagine going back to manual coding. TLDR everyone has their developing flow, my current is a small few CC sessions on the left in ghostty windows/tabs and an IDE on the right for viewing the code + manual edits.

Tenacity. It's so interesting to watch an agent relentlessly work at something. They never get tired, they never get demoralized, they just keep going and trying things where a person would have given up long ago to fight another day. It's a "feel the AGI" moment to watch it struggle with something for a long time just to come out victorious 30 minutes later. You realize that stamina is a core bottleneck to work and that with LLMs in hand it has been dramatically increased.

Speedups. It's not clear how to measure the "speedup" of LLM assistance. Certainly I feel net way faster at what I was going to do, but the main effect is that I do a lot more than I was going to do because 1) I can code up all kinds of things that just wouldn't have been worth coding before and 2) I can approach code that I couldn't work on before because of knowledge/skill issue. So certainly it's speedup, but it's possibly a lot more an expansion.

Leverage. LLMs are exceptionally good at looping until they meet specific goals and this is where most of the "feel the AGI" magic is to be found. Don't tell it what to do, give it success criteria and watch it go. Get it to write tests first and then pass them. Put it in the loop with a browser MCP. Write the naive algorithm that is very likely correct first, then ask it to optimize it while preserving correctness. Change your approach from imperative to declarative to get the agents looping longer and gain leverage.

Fun. I didn't anticipate that with agents programming feels \*more\* fun because a lot of the fill in the blanks drudgery is removed and what remains is the creative part. I also feel less blocked/stuck (which is not fun) and I experience a lot more courage because there's almost always a way to work hand in hand with it to make some positive progress. I have seen the opposite sentiment from other people too; LLM coding will split up engineers based on those who primarily liked coding and those who primarily liked building.

Atrophy. I've already noticed that I am slowly starting to atrophy my ability to write code manually. Generation (writing code) and discrimination (reading code) are different capabilities in the brain. Largely due to all the little mostly syntactic details involved in programming, you can review code just fine even if you struggle to write it.

Slopacolypse. I am bracing for 2026 as the year of the slopacolypse across all of github, substack, arxiv, X/instagram, and generally all digital media. We're also going to see a lot more AI hype productivity theater (is that even possible?), on the side of actual, real improvements.

Questions. A few of the questions on my mind:

\- What happens to the "10X engineer" - the ratio of productivity between the mean and the max engineer? It's quite possible that this grows \*a lot\*.

\- Armed with LLMs, do generalists increasingly outperform specialists? LLMs are a lot better at fill in the blanks (the micro) than grand strategy (the macro).

\- What does LLM coding feel like in the future? Is it like playing StarCraft? Playing Factorio? Playing music?

\- How much of society is bottlenecked by digital knowledge work?

TLDR Where does this leave us? LLM agent capabilities (Claude & Codex especially) have crossed some kind of threshold of coherence around December 2025 and caused a phase shift in software engineering and closely related. The intelligence part suddenly feels quite a bit ahead of all the rest of it - integrations (tools, knowledge), the necessity for new organizational workflows, processes, diffusion more generally. 2026 is going to be a high energy year as the industry metabolizes the new capability.