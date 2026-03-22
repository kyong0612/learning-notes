---
title: "Thread by @affaanmustafa"
source: "https://x.com/affaanmustafa/status/2027727596608479430?s=12"
author:
  - "Affaan Mustafa (@affaanmustafa)"
published: 2026-01-17
created: 2026-03-22
description: "Claude Code のエージェントハーネスを最大限に活用するための包括的なリポジトリ「Everything Claude Code」と3つのガイド（Shorthand / Longform / Security）を紹介するスレッド。10ヶ月以上の実戦経験に基づくスキル、フック、サブエージェント、MCP、プラグインの設定・最適化手法をまとめている。"
tags:
  - "clippings"
  - "claude-code"
  - "ai-agent"
  - "developer-tools"
  - "productivity"
  - "configuration"
---

## 概要

Affaan Mustafa（[@affaanmustafa](https://x.com/affaanmustafa)）による X スレッド。Claude Code を中心としたAIエージェントハーネスのパフォーマンス最適化システム **[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)** リポジトリと、付随する3つのガイドを紹介している。

著者は Claude Code の実験的ロールアウト期（2025年2月）から10ヶ月以上にわたり毎日使用し、Anthropic x Forum Ventures ハッカソンで優勝した経験を持つ。

### リポジトリ統計

- ⭐ 95,600+ stars
- 🍴 12,500+ forks
- 👥 110+ contributors
- 主要言語: JavaScript (88.5%)
- ライセンス: MIT
- 最新リリース: v1.9.0（2026年3月時点）

---

## ガイド 1: Shorthand Guide — セットアップ・基礎・哲学

> ![Shorthand Guide カバー画像](https://pbs.twimg.com/media/HCPvgOmbEAQ19x8?format=jpg&name=large)

実戦で検証済みの設定マニュアル。Claude Code を単なるチャットボットではなく、高度に設定可能なAI開発環境として捉え、モジュール式コンポーネントを戦略的に管理する手法を解説する。

### Skills と Commands

- **Skills**（`~/.claude/skills/`）: 特定のスコープやワークフローに限定されたルール。`/refactor-clean`、`/tdd`、`/e2e`、`/test-coverage` などのワークフローをショートカットとして実行可能。
- **Commands**（`~/.claude/commands/`）: スラッシュコマンドで実行するスキル。Skills とは保存場所が異なる。
- スキル同士をチェーンして単一プロンプトで連続実行できる。
- 例: コードマップを自動更新するスキルで、Claude がコンテキスト消費なしにコードベースを高速ナビゲート可能。

### Hooks（トリガーベース自動化）

| Hook タイプ | 発火タイミング |
|---|---|
| `PreToolUse` | ツール実行前（バリデーション、リマインダー） |
| `PostToolUse` | ツール実行後（フォーマット、フィードバックループ） |
| `UserPromptSubmit` | メッセージ送信時 |
| `Stop` | Claude の応答完了時 |
| `PreCompact` | コンテキスト圧縮前 |
| `Notification` | 権限リクエスト時 |

`hookify` プラグインで JSON を手書きせず会話形式でフック作成が可能。

### Subagents（サブエージェント）

- メインの Claude（オーケストレーター）がタスクを委任するプロセス。
- バックグラウンド / フォアグラウンドで実行可能。
- スキルのサブセットを実行可能なサブエージェントにタスクを委任し、自律的に動作させられる。
- ツール、MCP、権限をサブエージェントごとに個別設定してスコープを制限。

### Rules と Memory

- `.rules` フォルダに `.md` ファイルとしてベストプラクティスを格納。
- 2つのアプローチ:
  - **Single CLAUDE.md**: 全ルールを1ファイルに集約
  - **Rules folder**: 関心事ごとにモジュール化

### MCP（Model Context Protocol）

- Claude と外部サービスを直接接続するプロトコル。
- 例: Supabase MCP で SQL を直接実行、ブラウザ自動制御など。

### ⚠️ コンテキストウィンドウ管理（最重要）

- **200k のコンテキストウィンドウもツール過多で実質 70k に縮小する。**
- 推奨: 20〜30 MCP を設定し、有効化は **10 以下 / アクティブツール 80 以下** に抑える。
- プロジェクトごとに不要な MCP を無効化。

### Plugins

- Skills + MCP + Hooks をバンドルしたパッケージ。
- LSP プラグイン: エディタ外で Claude Code を使う際にリアルタイム型チェック、定義ジャンプ、補完を提供。

### キーボードショートカット

| ショートカット | 機能 |
|---|---|
| `Ctrl+U` | 行全体を削除 |
| `!` | Bash コマンドプレフィックス |
| `@` | ファイル検索 |
| `/` | スラッシュコマンド開始 |
| `Shift+Enter` | 複数行入力 |
| `Tab` | 思考表示の切替 |
| `Esc Esc` | Claude を中断 / コードを復元 |

### 並列ワークフロー

- **`/fork`**: 会話をフォークし、重複しないタスクを並列実行。
- **Git Worktrees**: 競合なしに複数の Claude を並列動作。
- **tmux**: 長時間コマンドのログ監視。
- **mgrep**: ripgrep/grep の上位互換。ローカル検索とWeb検索の両方に対応。

### エディタ連携

- **Zed（著者推奨）**: Rust 製で軽量高速。Agent Panel 統合でリアルタイムファイル変更追跡。`Ctrl+G` で Claude が作業中のファイルを即座に開ける。
- **VSCode / Cursor**: ターミナル形式または拡張機能として利用可能。`\ide` で LSP 連携。

### 著者の実際の設定

- プラグイン: 同時に有効化するのは 4〜5 個
- MCP: 14 個設定済み、プロジェクトごとに 5〜6 個のみ有効化
- カスタムステータスライン: ユーザー、ディレクトリ、git ブランチ、コンテキスト残量 %、モデル、時刻、TODO数を表示

---

## ガイド 2: Longform Guide — トークン最適化・メモリ永続化・評価・並列化

> ![Longform Guide カバー画像](https://pbs.twimg.com/media/G_JOZdgX0AAoln-?format=jpg&name=large)

5つの柱に基づくエリートレベルの生産性フレームワーク。

### 1. メモリ永続化

メモリは「設計するもの」であり、暗黙に期待してはならない。

- `.tmp` セッションファイルとライフサイクルフック（`PreCompact`、`SessionStart`、`SessionEnd`）を活用。
- **Continuous Learning スキル**: セッション終了時に自動的に知識を抽出し、将来の使用に備える。
- メモリファイルは **最大200行** に制限（超過分は読み込まれない）。
- 日次ログとキュレーション済みメインファイルに分割して肥大化を防止。

### 2. トークン最適化

トークンコストは最重要の制約。

- **モデル選択**: メインワークは Sonnet、反復タスクは Haiku（Sonnet の 1/3 コスト）、複雑なアーキテクチャは Opus。
- **コンテキスト管理**: 複雑なマルチファイルタスクではコンテキストウィンドウの **最後の20%を使わない**。
- **戦略的圧縮**: 自動圧縮に任せず、論理的な区切りで手動コンパクト。
- `mgrep` の使用、リーンでモジュラーなコードベースの維持で読み取りコストを削減。

### 3. 検証とEvals（評価）

検証は省略不可。

- **チェックポイントベース評価**: 線形タスク向け。
- **継続的評価**: 探索的作業向け。
- フックを通じてワークフローに検証を統合。エージェントの出力を評価し、過程は問わない。

### 4. 並列化

最小限かつ目的を持った並列化。

- **カスケードパターン**: 明確なフローで実行。
- **Git Worktrees**: 競合防止。
- **フォーク会話**: メインコーディングと直交する調査に使用。
- **Two-Instance Kickoff パターン**: 一方がプロジェクト構造をスキャフォールド、他方がリサーチ。

### 5. 再利用可能パターンへの投資

一度作った効率的なワークフローを Skills / Hooks / Commands として永続化し、プロジェクト横断で再利用する。

---

## ガイド 3: Security Guide — 攻撃ベクトル・サンドボックス・AgentShield

### 権限モデル（3階層）

| レベル | 対象 |
|---|---|
| Auto-allowed | ファイル読み取り、ディレクトリ一覧、コード検索 |
| Ask first（デフォルト） | ファイル編集、Bashコマンド、ファイル作成 |
| Always blocked | 拒否リスト内のコマンド |

`.claude/settings.json` で glob パターンを用いた allow/deny リストで設定。deny リストが優先。

### サンドボックスアーキテクチャ

- OS カーネルレベルでの強制:
  - **macOS**: Seatbelt
  - **Linux/WSL2**: bubblewrap
- ファイルシステム: 書き込みはカレントディレクトリとサブディレクトリに制限。
- ネットワーク: プロキシサーバー経由でトラフィックをルーティング。新規ドメインは権限プロンプトが発生。

### 既知の制限事項

2026年の研究で3段階のサンドボックスバイパスが特定されている:

1. **文字列ベースの拒否リスト回避**: パスエイリアシング（例: `/proc/self/root/usr/bin/npx`）
2. **名前空間分離の自己無効化**
3. **カーネル強制のバイパス**: 動的リンカー呼び出し

最も危険な攻撃は許可された権限内で動作するため、入力分類・エグレス監視・状態分離などの追加防御層が必要。

### AgentShield

著者が開発したセキュリティスキャナー。Claude Code 設定の脆弱性を監査する。

- 5カテゴリにわたる **102ルール**
- 検出対象: ハードコードされたシークレット、権限ミスコンフィグ、インジェクションリスク
- 実行: `npx ecc-agentshield scan`

---

## スレッドへの反応

- **Amir Alnadi (@amiralnadi)**: 「開発者専用かと聞こうとしたが、もうそういう区別はないと思い出した。非技術者と自分を分けるのはダサい。」
- **Daniel (@DanielGPT2022)**: 非開発者向けのワークフロー最も包括的なリポジトリとの併用を推奨。

---

## 重要な結論

1. **設定は「ファインチューニング」であり「アーキテクチャ」ではない** — 過度に複雑化しない。
2. **コンテキストウィンドウは最も貴重なリソース** — 未使用の MCP / プラグインは無効化する。
3. **並列実行を活用** — `/fork` と Git Worktrees で効率化。
4. **反復作業を自動化** — Hooks でフォーマット、リンティング、リマインダーを処理。
5. **サブエージェントのスコープを制限** — ツールを限定することで集中的な実行が可能。
6. **セキュリティは多層防御** — サンドボックスだけでは不十分。AgentShield 等の追加レイヤーを導入する。

---

## 参考リンク

- [Everything Claude Code リポジトリ](https://github.com/affaan-m/everything-claude-code)
- [Shorthand Guide 記事](https://www.xarticle.news/article/the-shorthand-guide-to-everything-claude-code--0a37e1)
- [Longform Guide 記事](https://www.xarticle.news/article/tech-data/the-longform-guide-to-everything-claude-code)
- [AgentShield (npm)](https://www.npmjs.com/package/ecc-agentshield)
