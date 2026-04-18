---
title: "kawasima/evolutionary-naming: Claude Code skill for evolutionary naming — improve names step-by-step through 3 phases (audit + improve modes)"
source: "https://github.com/kawasima/evolutionary-naming"
author:
  - "[[kawasima]]"
published: 2026-04-15
created: 2026-04-18
description: "命名は一発で完璧にするものではなく、段階的に進化させるプロセスであるという思想に基づくClaude Code用スキル。Arlo Belsheeの『Naming as a Process』を元に、3フェーズ・7ステップの命名改善プロセスをaudit-modeとimprove-modeの2モードで提供する。"
tags:
  - "clippings"
  - "claude-code"
  - "claude-skill"
  - "naming"
  - "refactoring"
  - "code-quality"
  - "arlo-belshee"
---

## 概要

`kawasima/evolutionary-naming` は、コードの命名を段階的に改善するための Claude Code スキル。「最初から完璧な名前を付けようとする」のではなく、「安全・漸進的・可逆」な方法で命名を進化させるという思想に立っている。

理論的な土台は Arlo Belshee の [Naming as a Process](https://arlobelshee.com/tag/naming-is-a-process)（CC BY 3.0, 更新版は [digdeeproots.com](https://www.digdeeproots.com/articles/naming-process/)）。この7ステップ / 3フェーズのモデルを Claude Code のスキル形式（`SKILL.md` + サブ Markdown）に落とし込み、各フェーズ境界に安全ゲート（ユーザー承認）を設けているのが特徴。

ライセンスは CC BY 4.0。GitHub トピックは `claude-code`, `claude-skill`, `code-quality`, `naming`, `refactoring`。

## 主要なトピック

### 3フェーズ / 7ステップモデル

| フェーズ | ステップ | 性質 |
|---|---|---|
| **Phase 1: Insight → Name** | Missing → Nonsense → Honest → Honest and Complete | 汎用的。純粋な改名のみで構造変更なし。連続して歩ける安全領域。 |
| **Phase 2: Name → Structure** | Honest and Complete → Does the Right Thing | コードベース固有。構造リファクタリングを伴う。**ユーザー許可が必要**。 |
| **Phase 3: Combine for Design** | Does the Right Thing → Intent → Domain Abstraction | 呼び出し側・ドメイン文脈を読む必要あり。**ユーザー許可が必要**。 |

> 「多くの命名改善は Phase 1 で止めるのが正解」— ユーザーのストーリーに合わせた深さまでだけ進める、という節度を設計に組み込んでいる。

### 2つの動作モード

- **audit-mode**: 提供されたコードを網羅的にスキャンし、すべての識別子を「現在どのステップにいるか」で分類してフェーズ別の表にまとめる。**改名は行わない**（レビュー特化）。
- **improve-mode**: 特定の識別子1つに対するインタラクティブな改善。Phase 1 は連続的に進め、Phase 2 と Phase 3 の境界で一旦停止しユーザーの同意を取る。

曖昧な要求（大きなコード塊があるが特定ターゲットが明示されていない等）の場合は、どちらのモードを使うかをユーザーに尋ねる仕様。

### モード判定シグナル（主なトリガー）

| ユーザーの発話例 | モード |
|---|---|
| 「このコードの命名で改善余地ある?」「命名レビュー」「naming audit」「全部教えて」 | **audit-mode** |
| 「`d` を改善して」「DocumentManager をリファクタリング」「this method's name is unclear」 | **improve-mode** |
| audit 後の「X だけ直して」 | **improve-mode**（ターゲット = X） |

### improve-mode の「止める深さ」ガイド

| ユーザー文脈 | 停止ステップ |
|---|---|
| 「急いでる」「bug fix」「とりあえず」 | Honest（Phase 1 中盤） |
| 「改善して」等の一般的リネーム | Honest and Complete（Phase 1 終盤） |
| 「リファクタリング」 | Does the Right Thing（Phase 2） |
| 「設計から見直したい」「ドメイン的に整理」 | Intent または Domain Abstraction（Phase 3） |

### 7ステップの診断基準

| 現在の名前が示すシグナル | ステップ |
|---|---|
| 概念はコード中に存在するが名前が付いていない（長いメソッド/クラスに埋め込まれている） | Missing |
| 名前が誤解を招く or 何も伝えない（`process`, `handle`, `data`, `manager`, `s`, `d`, `r`） | Nonsense 候補 |
| 1つの真実は伝えているが全てではない（`doSomethingToDatabase`） | Honest |
| すべてを列挙しているが非常に長い（`parseXmlAndStoreAndCacheAndNotify`） | Honest and Complete |
| 各部品が単一責任を持つが名前は機構を説明している | Does the Right Thing |
| 目的は表現されているが共有語彙を形成していない | Intent |
| 名前群が Value Object を伴ってドメイン語彙を形成している | Domain Abstraction |

### ステップ遷移の具体的メカニクス

#### Missing/Misleading → Nonsense（applesauce）

- 長いメソッド・クラス・パラメータ列・式から「まとまる塊」を発見し、Extract Method / Introduce Variable / Introduce Parameter Object で取り出す。
- 名前は **`applesauce`** （明らかにナンセンス）。誤解を招く既存名（`PageLoad`, `DataManager`, `-Manager`, `-Handler`, `process()`）は直接 `applesauce` に改名してよい。
- **即コミット**。次のステップとバッチにしない。
- スコープ内に `applesauce` は1つだけ。新しく必要になったら、まず現在の `applesauce` を Honest に昇格させる。
- 例外: 文脈から意味が自明な単一の無名変数（例: `d`）は、applesauce をスキップして直接 Honest に進んでよい。

#### Nonsense → Honest

- メソッド/クラスの本文を読み、システムコンポーネント（`database`, `screen`, `network`）、戻り値の出所、繰り返し変数を探す。
- 1つの真実を選び、具体的に命名する。
- 不確実性を明示するマーカーを使う: 不確かな部分には `probably_` 接頭辞、未把握の残余挙動には `_AndStuff` 接尾辞。
- **コミット**。

```
// BAD: 汎用的すぎる
applesauce() → handleFlightInfo()

// GOOD: 具体的で、不確実性に正直
applesauce() → probably_doSomethingEvilToTheDatabase_AndStuff()
```

#### Honest → Honest and Complete

- 「既知の拡張」と「未知の縮小」を反復する：
  - **拡張**: 名前に含まれていない挙動/作用を1つ見つけて追加する。
  - **縮小**: `_AndStuff` 部分が「やっていないこと」を1つ特定して接尾辞をより具体化する。
- 目標は `probably_` の除去（テストで裏付け）と `_AndStuff` の除去（全データ作用を追跡）。
- 名前だけメールで送れば相手がコードをほぼ再構築できる、を合格ライン。
- このフェーズでは**長い名前は正義**。命名規則の長さ制限は一旦忘れる。追加ごとにコミット。

```
probably_doSomethingEvilToTheDatabase_AndStuff()
→ parseXmlAndStoreFlightToDatabaseAndLocalCacheAndBeginBackgroundProcessing()
```

#### Honest and Complete → Does the Right Thing（Phase 2）

- **名前だけを見る**。本文も呼び出し側も見ない。
- 名前の中で他と無関係な部分、または封じ込めたい関心事を見つける。
- 構造リファクタリング（Extract Method, Split Class, Introduce Parameter Object）でその責務を切り出す。
- 完全な名前を複数ピースに分配し、各ピースは Honest and Complete な名前を保つ。

```
parseXmlAndStoreFlightToDatabaseAndLocalCacheAndBeginBackgroundProcessing()
→ parseXml() + storeFlightToDatabaseAndLocalCache() + beginBackgroundProcessing()
```

> 「それが何であるか」ではなく「それが何をするか」で名付ける — これが分割の原動力。

#### Does the Right Thing → Intent（Phase 3）

- **呼び出し側と使用文脈を見る**（本文は見ない）。
- その役割がより大きなオーケストレーションの中でどう位置付けられるかを理解する。
- 「何をするか」から「なぜ存在するか」（目的）への改名。

```
storeFlightToDatabaseAndLocalCache() → beginTrackingFlight()
```

> **危険**: 呼ばれるタイミングで命名する（`onPageLoad` 等）のは Intent ではなく Nonsense への退行。

#### Intent → Domain Abstraction（Phase 3）

- 共通点を持つメソッド/クラス群を観察し、**primitive obsession** パターンを探す。
- **欠けている抽象のシグナル**:
  - パラメータが束になってメソッドを渡り歩いている
  - フィールドが常に一緒に使われる
  - 似た名前の接頭辞/接尾辞（`flightId`, `flightCode`, `flightStatus`）
  - `-er`（動作であってオブジェクトでない）、`-Manager`, `-Util` で終わる名前
  - `firstName: String, lastName: String, ssn: String` のように、概念であるべきものがプリミティブで散在
- Introduce Parameter Object → クラスへの昇格 → 関連メソッドの移動、という流れで Value Object / Whole Value を抽出し、ドメイン言語で命名する。

## 重要な事実・データ

- **構成ファイル**（`skills/evolutionary-naming/` 配下）:
  - `SKILL.md` — ルーター兼概要
  - `reference.md` — 共有の診断基準・遷移メカニクス・アンチパターン、`applesauce`/`probably_`/`AndStuff` ガイダンス
  - `audit-mode.md` — 網羅スキャンのワークフローと表形式の出力テンプレート
  - `improve-mode.md` — 単一ターゲットの対話ワークフローと一時停止プロトコル
- **ライセンス**: CC BY 4.0（元の Arlo Belshee 資料は CC BY 3.0）
- **インストール方法**:
  - マーケットプレイス経由（推奨）:
    ```
    /plugin marketplace add kawasima/evolutionary-naming
    /plugin install evolutionary-naming@kawasima-skills
    ```
  - [skills.sh](https://skills.sh/) 経由:
    ```bash
    npx skills add kawasima/evolutionary-naming
    ```
  - 手動（単一ユーザー）:
    ```bash
    git clone https://github.com/kawasima/evolutionary-naming.git
    cp -r evolutionary-naming/skills/evolutionary-naming ~/.claude/skills/
    ```
  - Claude Code は `~/.claude/skills/` 以下を自動検出するため設定不要。
- **allowed-tools**: `Read`, `Grep`, `Glob` — スキル自体は読み取り系のみ（改名の実行は呼び出し側の Claude Code に委ねる）。

## 普遍的なレッドフラグ（やりがちな失敗）

| やろうとしていること | 何が問題か |
|---|---|
| `process()` を一気に `importFlightData()` にリネーム | Missing から Intent へジャンプしている。Honest and Complete を経由せよ |
| 5個以上のリネームを1バッチで提案 | 各リネームは独立した洞察。1つずつコミット |
| 本文を全部読まずにクラスを命名 | 読んでいないものについて Honest にはなれない |
| `probably_` / `_AndStuff` が「プロ意識に欠ける」と感じてスキップ | 誤解を招く「プロっぽい」名前の方がバグを生む。正直な不確実性を選べ |
| Honest and Complete 段階で短い名前にする | この段階では長い名前が正しい。短縮は Intent 段階で |
| 「既に意味がある」という理由で applesauce をスキップ | `-Manager`, `-Handler`, `process()` は何も有用なことを言っていない。誤解を招くだけ |
| 呼ばれるタイミングで命名する（`onInit`, `preLoad`） | 「何をするか」「なぜ存在するか」で命名せよ |
| 変数を型と同じ名前にする（`GridSquare gridSquare`） | このインスタンスを他と区別するもので命名せよ |
| Intent 段階で CS 用語（`Transformer`, `Processor`, `Handler`）を使う | ビジネスが理解するドメイン用語を使え |

## 結論・示唆

### スキルの本質的な主張

1. **命名はプロセスである** — 一発で完璧を目指すのではなく、7ステップを経て進化させる。
2. **各ステップ後に必ずコミット** — 各改名は厳密にコードを良くする。コミットで利得をロックインし、次が失敗しても直前の良い状態に戻れる。バッチコミットにするとこの保証が失われる。命名プロセスそのものがコミット履歴になるべき。
3. **安全ゲートとしてのフェーズ境界** — Phase 1 は純粋な改名で安全なので連続して歩ける。Phase 2（構造変更）と Phase 3（ドメイン設計）は影響が大きいのでユーザーの許可が必要。
4. **深さはストーリーに合わせる** — 「同僚がいずれ続きをやれるよう、名前を未完成のままにしておく」ことは欠点ではなく設計。

### 実践的な示唆

- **Claude Code ユーザー向け**: 命名レビューと具体的改名を同じスキル内で使い分けられるため、レビュー → 対象選定 → 段階的改善、という自然なフローが取れる。
- **人間のレビュアー向け**: 「7ステップのうち今どこか」という共通語彙を持てば、レビューコメントが「この名前ダメ」ではなく「まだ Nonsense 段階なので、まず applesauce を経由して Honest へ」といった構造的な指摘に変わる。
- **レガシーコード改善向け**: `-Manager`/`-Util` サフィックスや1文字変数、`process`/`handle`/`do` 動詞、primitive obsession、god method を検出する audit-mode は、リファクタリングのホットスポット発見ツールとして有用。

### 背景・関連情報（補足）

- 本スキルは Arlo Belshee の連載 [Naming as a Process](https://arlobelshee.com/tag/naming-is-a-process) を土台にしている（更新版: [Dig Deep Roots の Naming Process](https://www.digdeeproots.com/articles/naming-process/)）。evolutionary-naming 固有の貢献は、この思想を Claude Code のスキル形式に適合させ、audit/improve の2モードとフェーズ境界セーフティゲートを追加したこと。
- 関連する参考文献（README 内で言及）:
  - Martin Fowler の Refactoring カタログ（Extract Method, Rename, Introduce Parameter Object など）
  - Eric Evans の Domain-Driven Design（Whole Value, Ubiquitous Language）
- 類似の考え方: TDD の "Red → Green → Refactor" のように、名前にも「まず嘘をつかない仮の名前（applesauce/probably_）を置いて、段階的に真実に近づける」という漸進プロセスを適用している。

## 制限事項・注意点

- スキルの `allowed-tools` は `Read, Grep, Glob` に限定されているため、スキル自身はファイルを書き換えない。改名の実行は呼び出し元 Claude Code セッションの責務。
- Phase 2・Phase 3 は「コードベース固有」で、呼び出し側や構造情報を要求するため、小さなスニペットだけを渡された状況では実行できない（または精度が落ちる）。
- 日本語・英語のトリガーフレーズが併記されているが、あいまいな要求では明示的にモードを尋ねる設計になっている点に注意。
- 元の Arlo Belshee の方法論は CC BY 3.0、本スキルは CC BY 4.0。派生物として利用する場合は両方のクレジット表記が望ましい。

---

*Source: [kawasima/evolutionary-naming](https://github.com/kawasima/evolutionary-naming)*
