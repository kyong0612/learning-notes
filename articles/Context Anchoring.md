---
title: "Context Anchoring"
source: "https://martinfowler.com/articles/reduce-friction-ai/context-anchoring.html"
author:
  - "Rahul Garg"
published: 2026-03-17
created: 2026-03-19
description: "AIとの会話は一時的であり、セッションが長くなると初期の決定が薄れ、セッション境界を越えて何も残らない。Context Anchoringは、意思決定のコンテキストをliving documentに外部化し、コンテキストウィンドウが保持できないものを永続化することで、一時的な整合性を持続的な共有理解に変える手法である。"
tags:
  - "clippings"
  - "AI-assisted-development"
  - "context-management"
  - "LLM"
  - "software-engineering"
  - "Martin-Fowler"
---

> [!info] Source
> [Context Anchoring - Martin Fowler](https://martinfowler.com/articles/reduce-friction-ai/context-anchoring.html)
>
> この記事はシリーズ「[Patterns for Reducing Friction in AI-Assisted Development](https://martinfowler.com/articles/reduce-friction-ai/)」の一部である。

## 概要

AI コーディングアシスタントとの会話は設計上、一時的（ephemeral）なものである。セッションが長くなると初期の決定は薄れ、セッションを閉じると全てが失われる。開発者が長い会話に固執するのは、長いセッションが生産的だからではなく、**コンテキストが他のどこにも存在しない**からである。

**Context Anchoring** とは、意思決定のコンテキストを **living document（生きたドキュメント）** に外部化し、人間と AI の双方がセッションを越えて参照できる永続的な記録を作る手法である。

### リトマステスト

> **「今この会話を閉じて新しい会話を始めても、不安を感じないか？」**
>
> もし不快感を感じるなら、つまり何か重要なものを失うと感じるなら、コンテキストはそれを保存するために設計されていない媒体の中に閉じ込められている。

---

## なぜコンテキストが劣化するのか（Why Context Erodes）

コンテキストの劣化はランダムではなく、LLM のコンテキスト処理メカニズムに起因する構造的な問題である。

### 有限なコンテキストウィンドウ

- すべてのモデルには有限なコンテキストウィンドウがある（数十万〜100万トークン以上）
- 一見大きいように見えるが、コードスニペット、設計議論、意思決定の根拠、ファイル内容などで**ウィンドウは開発者の予想より速く埋まる**

### 「Lost in the Middle」問題

- Stanford と Berkeley の2023年の研究 ["Lost in the Middle"（Liu et al.）](https://arxiv.org/abs/2307.03172) が実証
- 長いコンテキストの**中間に配置された情報**に対するモデルの性能が、先頭や末尾と比較して著しく低下する
- これは特定のモデルの癖ではなく、**Attention メカニズム自体の特性**である
- 直近のトークンとシステムレベルの指示に不釣り合いな重みが付けられ、中間の情報は縮小する注意の分配を奪い合う

### 推論が決定より先に消える

> **決定そのものよりも、決定の背後にある推論の方が速く劣化する。**

- AI は「PostgreSQL を使用している」ことは覚えていても、**なぜ** PostgreSQL が MongoDB より選ばれたか（JSONB サポートの必要性、チームの運用経験、マルチテナンシー要件）を忘れる
- 結果として AI は決定には従いつつも、その意図に違反する提案を行う微妙で高コストな障害モードが発生する
  - 例：ドキュメントストアに適したスキーマ構造を提案するが、PostgreSQL のリレーショナルな強みとは相容れない

### 自動コンパクション / 要約の限界

- 一部のツールは会話履歴を自動的に圧縮・要約するが、これは**ブラックボックス**である
- 開発者はどの情報がそのまま保存され、何が要約され、何が暗黙に削除されたか確認できない
- **冗長で文脈的な「なぜ」の情報**こそ、自動圧縮で最も脆弱なコンテンツ
- 不透明なプロセスに重要な情報の保存を委ねるのは戦略ではなく、**希望的観測**に過ぎない

---

## 外部メモリ（External Memory）

解決策は、意思決定コンテキストを**外部状態**として扱うことである。会話の外に存在し、決定が行われるたびにキャプチャし、セッションを越えて人間と AI の双方にとっての権威的参照として機能する **living document** を作る。

### Priming Document と Feature Document の違い

| 種類 | 対象レベル | 内容 | 更新頻度 | 役割 |
|------|-----------|------|---------|------|
| **Priming Document** | プロジェクト全体 | 技術スタック、アーキテクチャパターン、命名規則、コード例 | 四半期ごと、または大きなアーキテクチャ変更時 | 「このプロジェクトはこう動く」 |
| **Feature Document** | 個別フィーチャー | 開発中の具体的な決定、制約、却下された案、未解決事項、進捗状態 | セッションごと（急速に進化） | 「この特定の作業の現在地と経緯」 |

両者は**同じコンテキスト戦略の2つのレイヤー**を形成し、新しいセッション開始時に両方をロードする。Priming Document が語彙を、Feature Document が履歴を提供する。

### なぜコードだけでは不十分か

- コードは **結果（outcomes）** を捉えるが、**推論（reasoning）** は捉えない
- BullMQ を直接使用しているコードベースは、`RetryQueue` 抽象化が提案・議論・意図的に却下されたのか、単に最初に生成されたものが疑問視されなかっただけなのかを読者に伝えない
- **却下された代替案、決定を駆動した制約、残された未解決の質問** はすべてコードからは見えない

### ADR（Architecture Decision Records）との関係

- Michael Nygard が2011年に ADR を提唱した背景と同じ問題を解決する
- Feature Document は本質的に**リアルタイムで進化する living ADR**
- ADR を既に使用しているチームにとっては「進行中の ADR」であり、フィーチャーがリリースされた時に重要な決定が正式な ADR に昇格する
- ADR をまだ使用していないチームにとっては、より軽量で反復的な自然なエントリーポイントとなる

### トークン効率

- 50行の Feature Document は、数百〜数千行の実装コードでは全く表現できない意思決定コンテキストを、**ごくわずかなトークンコスト**で運ぶ
- ウィンドウ内のコンテキストが少ないほど、モデルの Attention はより良く保持される

### チーム間の調整

- 複数の開発者が同じフィーチャーで作業する場合、Feature Document は**共有記録**となる
- 開発者 A の設計決定が、独立して開始した開発者 B の AI セッションでも利用可能になる
- ドキュメントがなければ、B の AI は A がすでに却下した抽象化を再提案する可能性がある

---

## 実践での適用例（What This Looks Like in Practice）

通知サービスの開発を例にした実践的なイラストレーション。

### Feature Document の例

```markdown
# Feature: Notification Service v1

## Decisions
| Decision                    | Reason                                  | Rejected Alternative                                |
|-----------------------------+-----------------------------------------+-----------------------------------------------------|
| BullMQ directly, no wrapper | Native retry with backoff is sufficient | RetryQueue abstraction (unnecessary indirection)    |
| Functional services         | Match codebase convention               | Class-based (rejected: convention)                  |
| SendGrid for delivery       | Deliverability + team experience        | SES (cheaper, less reliable), Mailgun (no team exp) |

## Constraints
- Email-only for v1 (no SMS/push)
- All queries include tenantId (multi-tenant)
- Must use existing auth middleware

## Open Questions
- [ ] Rate limiting strategy (awaiting product input)

## State
- [x] Design approved (all 5 levels)
- [x] NotificationHandler + TemplateRenderer implemented
- [ ] DeliveryTracker (next session)
```

### 実践上のポイント

- **30秒でフルアライメント**: 3回目のセッション開始時、45分間の過去の会話を再構築する代わりに、Feature Document を共有するだけで AI が完全に整合した
- **自然な一時停止点で更新**: 設計レベルの完了時、重要な決定時、未解決の質問が解決した時に数行を追記する
- **自分の思考の整理にも有効**: 「なぜ BullMQ をラッパーなしで使うのか」を書き下すことで、自身の推論の弱さに気づくこともあった。ドキュメントは AI のための外部メモリだけでなく、**自分自身の意思決定の明確化を促す強制機能（forcing function）** でもある

---

## キャリブレーション（適用すべき場面）

Context Anchoring はすべての場面で必要というわけではなく、**フィーチャーが複数のセッションにまたがる場合**に特に価値がある。

| シナリオ | Anchoring の必要性 | 理由 |
|---------|-------------------|------|
| 簡単な質問、単一のユーティリティ | **不要** | 会話が短く、劣化は無関係 |
| 単一セッションのフィーチャー（1時間未満） | **軽量** — 再訪の可能性がある場合にキー決定を記録 | 決定と状態の数行で十分 |
| 複数日にまたがるフィーチャー | **必要** — フル Feature Document | 失われたコンテキストのコストは分単位ではなく時間単位 |
| 複数の開発者が関わるフィーチャー | **必要** — 共有ドキュメント | 独立した AI セッション間で決定を調整する |

---

## 結論

これは本質的に、**チャット駆動開発からドキュメント駆動開発への移行**である。

- **会話** は意思決定を行う媒体であり続けるが、**ドキュメント** が記録となる
- 会話は設計上使い捨て — 思考が起こる場所であり、結論が保存される場所ではない
- 人間と AI 間の共有メンタルモデルは一時的である必要はなく、**文書化され、永続的で、共有可能**にできる

### シリーズ全体の進行

このシリーズの先行技法と合わせて、3層の進行を完成させる：

1. **[Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html)** — 静的コンテキスト（セッション開始前にプロジェクトコンテキストを共有）
2. **[Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html)** — 動的アライメント（コード前に設計会話を段階的に構造化）
3. **Context Anchoring** — 永続的な決定（意思決定を外部化し持続させる）

### 最もシンプルなテスト

> セッションを閉じる。新しく始める。もしそれが楽に感じるなら — やり直しのコストが30分の再説明ではなく30秒のドキュメント共有で済むなら — コンテキストはあるべき場所にある。会話の外側の、人間と AI の双方がいつでも読める形式の中に。
