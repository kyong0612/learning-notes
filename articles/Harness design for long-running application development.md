---
title: "Harness design for long-running application development"
source: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
author: "Prithvi Rajasekaran"
published: 2026-03-24
created: 2026-03-26
description: "ハーネス設計はエージェンティックコーディングのフロンティアにおけるパフォーマンスの鍵である。GAN着想のマルチエージェント（プランナー・ジェネレーター・エバリュエーター）アーキテクチャにより、フロントエンドデザインと長時間自律ソフトウェア開発でClaudeの性能を大幅に向上させた手法を解説。"
tags:
  - "clippings"
  - "ai-agents"
  - "harness-design"
  - "multi-agent-architecture"
  - "agentic-coding"
  - "prompt-engineering"
---

## 概要

Anthropic Labsチームの Prithvi Rajasekaran が、**長時間自律コーディング**と**フロントエンドデザイン品質向上**の2つの課題に取り組んだ成果を報告。[GAN（敵対的生成ネットワーク）](https://en.wikipedia.org/wiki/Generative_adversarial_network)に着想を得た**ジェネレーター（生成）＋エバリュエーター（評価）**のマルチエージェント構造を設計し、最終的に**プランナー・ジェネレーター・エバリュエーター**の3エージェントアーキテクチャで数時間にわたる自律コーディングセッションからリッチなフルスタックアプリケーションを生成することに成功した。

---

## ナイーブな実装が不十分な理由

以前の[長時間ハーネス実験](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)では、初期化エージェントがプロダクト仕様をタスクリストに分解し、コーディングエージェントが1機能ずつ実装する方式を採用していた。しかし、2つの共通した失敗モードが観察された。

### 1. コンテキストの一貫性喪失と「コンテキスト不安」

- モデルはコンテキストウィンドウが埋まるにつれ、長いタスクでの一貫性を失う傾向がある（[コンテキストエンジニアリングの記事](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)参照）
- 一部のモデル（特にClaude Sonnet 4.5）は、コンテキスト上限に近づいたと感じると**作業を早期に切り上げる「コンテキスト不安」**を示す
- **コンテキストリセット**（ウィンドウを完全クリアし、前エージェントの状態を構造化ハンドオフで引き継ぐ）がこの問題を解決するが、オーケストレーションの複雑さ・トークンオーバーヘッド・レイテンシが増加する
- **コンパクション**（会話の前半を要約してエージェントを継続させる方式）はクリーンスレートを提供しないため、コンテキスト不安が残存しうる

### 2. 自己評価の甘さ

- エージェントは自身が生成した成果物を評価すると、**品質が明らかに低くても自信を持って賞賛する**傾向がある
- 特にデザインのような主観的タスクで顕著（バイナリテストに相当する検証手段がない）
- **生成と評価を分離**することが強力なレバーとなる。独立したエバリュエーターを懐疑的にチューニングする方が、ジェネレーターに自己批判させるよりもはるかに容易

---

## フロントエンドデザイン：主観的品質を評価可能にする

デフォルトのClaudeは安全で予測可能なレイアウトに収束し、技術的には機能するが視覚的に平凡な出力を生成する傾向がある。この問題を解決するために以下の2つの洞察に基づくハーネスを構築した。

### 4つの評価基準

ジェネレーターとエバリュエーターの両方に与えた基準：

| 基準 | 内容 |
| --- | --- |
| **デザイン品質** | デザインがパーツの寄せ集めではなく一貫した全体として感じられるか。色、タイポグラフィ、レイアウト、画像が独自のムードとアイデンティティを生み出しているか |
| **オリジナリティ** | テンプレートレイアウトやライブラリデフォルトではなく、意図的なクリエイティブ選択の証拠があるか。紫グラデーション×白カードなどの典型的AI生成パターンは不合格 |
| **クラフト** | タイポグラフィ階層、スペーシング一貫性、カラーハーモニー、コントラスト比などの技術的実行品質 |
| **機能性** | 美学とは独立したユーザビリティ。ユーザーがインターフェースの目的を理解し、タスクを完了できるか |

- **デザイン品質とオリジナリティ**をクラフトと機能性より重視（後者はモデルがデフォルトで高スコアを出すため）
- 基準は「AI slop」パターンを明示的にペナルティ化し、美的リスクテイクを促進

### ジェネレーター＋エバリュエーターのループ

- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)上に構築
- ジェネレーターがHTML/CSS/JSフロントエンドを生成 → エバリュエーターが**Playwright MCP**でライブページを操作・スクリーンショット・評価 → フィードバックをジェネレーターに返す
- **5〜15イテレーション**を実施、各サイクルに実時間がかかり全体で**最大4時間**
- 各評価後、ジェネレーターはスコア傾向が良ければ改良、悪ければ完全に異なる美的方向へピボットする戦略的判断を実施

### 主な発見

- スコアはイテレーションを重ねると概ね向上するが、**必ずしも線形ではない**（中間イテレーションが最終版より良い場合も）
- 基準の**言語表現自体がジェネレーターの出力特性を形作る**（「museum quality」というフレーズが特定の視覚的収束を誘発）
- 初回イテレーションでさえ、基準なしのベースラインより明らかに改善
- **注目すべき事例**：オランダの美術館サイトで、9回目のイテレーションまでクリーンなダークテーマのランディングページを生成していたが、10回目でアプローチを完全に破棄し、**CSSパースペクティブで描画された3D空間体験**（市松模様の床、壁にかかった絵画、ドア型ナビゲーション）に再構成。単一パス生成では見られないクリエイティブな飛躍

---

## フルスタックコーディングへのスケーリング

### 3エージェントアーキテクチャ（初期版 / Opus 4.5）

| エージェント | 役割 |
| --- | --- |
| **プランナー** | 1〜4文の簡潔なプロンプトから完全なプロダクト仕様を生成。スコープの野心性を重視し、詳細な技術実装よりプロダクトコンテキストとハイレベル技術設計に集中。AI機能の組み込みも指示 |
| **ジェネレーター** | スプリント方式で1機能ずつ実装。スタック: React, Vite, FastAPI, SQLite（→PostgreSQL）。各スプリント終了時に自己評価してからQAに引き渡し |
| **エバリュエーター** | Playwright MCPを使ってアプリをユーザーのようにクリックスルーでテスト。UI機能、APIエンドポイント、DBの状態を検証。各基準にハード閾値を設定し、1つでも下回ればスプリント不合格 |

**スプリントコントラクト**：各スプリント前にジェネレーターとエバリュエーターが「完了」の定義を交渉・合意。通信はファイルベースで行い、仕様の忠実性を保ちつつ実装の詳細を早期に過度に特定することを回避。

### 比較結果：レトロゲームメーカー

プロンプト: *「2D retro game maker with features including a level editor, sprite editor, entity behaviors, and a playable test mode」*

| ハーネス | 所要時間 | コスト |
| --- | --- | --- |
| ソロ（単一エージェント） | 20分 | $9 |
| フルハーネス | 6時間 | $200 |

**ソロの問題点**：
- レイアウトのスペース浪費、ワークフローの硬直性
- **ゲームプレイが根本的に動作しない**（エンティティ定義とゲームランタイム間の配線が壊れていた）

**フルハーネスの利点**：
- プランナーが1文プロンプトを**16機能・10スプリント仕様**に拡張（スプライトアニメーション、行動テンプレート、サウンド、AI支援生成機能、ゲームエクスポートなど）
- より洗練されたUI、一貫したビジュアルアイデンティティ
- **ゲームプレイが実際に動作**（物理の粗さはあるものの）
- Claude統合によるAI支援ゲーム作成機能

![ソロハーネスの初期画面](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F23c98f1d7ae720bfb39190d50e0706c03b177ad8-1999x1320.png&w=3840&q=75)

*ソロハーネスで作成されたアプリの初期画面*

![フルハーネスの初期画面](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2Fa8bef95425966495629095a5cb38bde4a8b13558-1999x997.png&w=3840&q=75)

*フルハーネスで構築されたアプリの初期画面：新しいゲームの作成*

### エバリュエーターが発見した問題の例

| コントラクト基準 | エバリュエーターの所見 |
| --- | --- |
| 矩形塗りつぶしツールでクリック＆ドラッグして矩形領域をタイルで埋められる | **FAIL** — ツールがドラッグの開始/終了点にのみタイルを配置。`fillRectangle`関数は存在するがmouseUpで正しくトリガーされない |
| ユーザーが配置したエンティティスポーンポイントを選択・削除できる | **FAIL** — `LevelEditor.tsx:892`のDeleteキーハンドラが`selection`と`selectedEntityId`の両方を要求するが、エンティティクリックは`selectedEntityId`のみ設定 |
| APIでアニメーションフレームの順序を変更できる | **FAIL** — `PUT /frames/reorder`ルートが`/{frame_id}`ルートの後に定義。FastAPIが'reorder'をframe_id整数として解釈し422エラー |

### エバリュエーターのチューニング

- デフォルトのClaudeは**QAエージェントとしては不出来**：正当な問題を特定しても自分を説得して「大したことない」と承認してしまう
- 表面的なテストに留まり、エッジケースを探らない
- **チューニングループ**：エバリュエーターのログを読む → 著者の判断と乖離した箇所を特定 → QAプロンプトを更新 → 数ラウンド繰り返し

---

## ハーネスの反復改善

### 簡素化の原則

> ハーネスの各コンポーネントは「モデルが単独でできないこと」についての仮定をエンコードしている。これらの仮定はストレステストに値する。
> — [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents): 「最もシンプルな解決策を見つけ、必要な場合にのみ複雑さを増やす」

- 一度に1コンポーネントずつ削除し、最終結果への影響を評価するメソディカルなアプローチに移行

### Opus 4.6によるハーネス簡素化

[Opus 4.6のリリース](https://www.anthropic.com/news/claude-opus-4-6)により、以下の改善が得られた：
- より慎重な計画、より長いエージェンティックタスクの持続
- 大規模コードベースでの信頼性向上
- 自身のミスを発見するコードレビュー・デバッグスキルの向上
- ロングコンテキスト検索の大幅改善

### スプリント構造の削除

- **スプリント構造を完全に撤廃**：Opus 4.6はスプリント分解なしでも一貫した作業を維持可能
- **プランナーは維持**（なければジェネレーターがスコープを過小設定）
- **エバリュエーターを実行末尾の1パスに変更**（スプリントごとの評価から）
- エバリュエーターの有用性はタスクの位置による：
  - モデルが単独で確実にこなせる範囲内 → 不要なオーバーヘッド
  - モデルの能力の境界にあるタスク → 実質的なリフトを提供

### 更新版ハーネスの結果：DAW（デジタルオーディオワークステーション）

プロンプト: *「Build a fully featured DAW in the browser using the Web Audio API.」*

| エージェント＆フェーズ | 所要時間 | コスト |
| --- | --- | --- |
| プランナー | 4.7分 | $0.46 |
| ビルド（ラウンド1） | 2時間7分 | $71.08 |
| QA（ラウンド1） | 8.8分 | $3.24 |
| ビルド（ラウンド2） | 1時間2分 | $36.89 |
| QA（ラウンド2） | 6.8分 | $3.09 |
| ビルド（ラウンド3） | 10.9分 | $5.88 |
| QA（ラウンド3） | 9.6分 | $4.06 |
| **合計** | **3時間50分** | **$124.70** |

- ビルダーはスプリント分解なしで**2時間以上一貫して稼働**
- QAエージェントは依然として実質的なギャップを発見：
  - ラウンド1：「クリップのドラッグ/移動ができない、楽器UIパネルがない、ビジュアルエフェクトエディターがない」
  - ラウンド2：「オーディオ録音がスタブのまま、クリップのリサイズ・分割が未実装、エフェクト可視化がスライダーのみ」
- 最終アプリはアレンジビュー、ミキサー、トランスポートを備えた機能的な音楽制作プログラム
- 内蔵AIエージェントによりプロンプトのみで簡単な楽曲を制作可能（テンポ・キー設定、メロディ・ドラムトラック作成、ミキサーレベル調整、リバーブ追加）
- **制限事項**：Claudeは実際に音を聞けないため、QAフィードバックループが音楽的品質に対しては効果的でない

---

## 今後の展望と教訓

### 主要な教訓

1. **実験とチューニング**：構築対象のモデルに対して実験し、現実的な問題でのトレースを読み、望む結果を達成するようパフォーマンスをチューニングすることが常に良い実践
2. **タスク分解と専門エージェント**：より複雑なタスクでは、タスクを分解し各側面に特化したエージェントを適用することでヘッドルームが生まれることがある
3. **モデル更新時のハーネス再検討**：新モデルがリリースされたら、パフォーマンスに不要になった部分を取り除き、以前は不可能だったより高い能力を達成する新しい部分を追加する

### 核心的な洞察

> **興味深いハーネスの組み合わせの空間は、モデルが改善されても縮小しない。移動するのだ。AIエンジニアにとって興味深い仕事は、次の新しい組み合わせを見つけ続けることである。**

---

## Appendix: プランナーエージェントが生成した計画の例

```
RetroForge - 2D Retro Game Maker

Overview
RetroForge is a web-based creative studio for designing and building 2D retro-style video games. It combines the nostalgic charm of classic 8-bit and 16-bit game aesthetics with modern, intuitive editing tools—enabling anyone from hobbyist creators to indie developers to bring their game ideas to life without writing traditional code.

The platform provides four integrated creative modules: a tile-based Level Editor for designing game worlds, a pixel-art Sprite Editor for crafting visual assets, a visual Entity Behavior system for defining game logic, and an instant Playable Test Mode for real-time gameplay testing. By weaving AI assistance throughout (powered by Claude), RetroForge accelerates the creative process—helping users generate sprites, design levels, and configure behaviors through natural language interaction.

RetroForge targets creators who love retro gaming aesthetics but want modern conveniences. Whether recreating the platformers, RPGs, or action games of their childhood, or inventing entirely new experiences within retro constraints, users can prototype rapidly, iterate visually, and share their creations with others.

Features
1. Project Dashboard & Management
The Project Dashboard is the home base for all creative work in RetroForge. Users need a clear, organized way to manage their game projects—creating new ones, returning to works-in-progress, and understanding what each project contains at a glance.

User Stories: As a user, I want to:

- Create a new game project with a name and description, so that I can begin designing my game
- See all my existing projects displayed as visual cards showing the project name, last modified date, and a thumbnail preview, so that I can quickly find and continue my work
- Open any project to enter the full game editor workspace, so that I can work on my game
- Delete projects I no longer need, with a confirmation dialog to prevent accidents, so that I can keep my workspace organized
- Duplicate an existing project as a starting point for a new game, so that I can reuse my previous work

Project Data Model: Each project contains:

Project metadata (name, description, created/modified timestamps)
Canvas settings (resolution: e.g., 256x224, 320x240, or 160x144)
Tile size configuration (8x8, 16x16, or 32x32 pixels)
Color palette selection 
All associated sprites, tilesets, levels, and entity definitions

...
```
