---
title: "kazukinagata/shinkoku: 確定申告自動化 AI エージェントプラグイン — 帳簿管理から e-Tax 入力代行まで"
source: "https://github.com/kazukinagata/shinkoku"
author:
  - "[[kazukinagata]]"
published:
created: 2026-02-25
description: "個人事業主・会社員の所得税・消費税の確定申告を、帳簿の記帳からe-Tax入力代行までエンドツーエンドで自動化するAIエージェントプラグイン。Claude Code Pluginとして動作し、SKILL.mdオープン標準に準拠することで40以上のAIコーディングエージェントに対応する。"
tags:
  - "clippings"
  - "ai-agent"
  - "確定申告"
  - "税務自動化"
  - "claude-code-plugin"
  - "e-tax"
---

## 概要

**shinkoku** は、確定申告を自動化する AI コーディングエージェント向けプラグイン。個人事業主・会社員の所得税・消費税の確定申告を、帳簿の記帳から確定申告書等作成コーナーへの入力代行まで**エンドツーエンド**で支援する。

- **Claude Code Plugin** として動作
- **SKILL.md オープン標準**に準拠した Agent Skills パッケージとして、Claude Code / Cursor / Windsurf / GitHub Copilot / Gemini CLI / Codex / Cline / Roo Code / Antigravity など **40 以上の AI コーディングエージェント**で利用可能

## 想定ユーザーと対応範囲

### Full 対応

| 対象 | 備考 |
|---|---|
| 個人事業主（青色申告・一般用） | メインターゲット。帳簿→決算書→税額計算→作成コーナー入力 |
| 会社員 + 副業（事業所得） | 源泉徴収票 + 事業所得の税額計算→作成コーナー入力 |
| 給与所得のみ（会社員） | 還付申告・医療費控除等→作成コーナー入力 |
| 消費税課税事業者 | 2割特例・簡易課税・本則課税すべて対応 |
| ふるさと納税利用者 | 寄附金 CRUD + 控除計算 + 限度額推定 |
| 住宅ローン控除（初年度） | 控除額計算（添付書類は別途必要） |
| 医療費控除 | 明細集計＋控除額計算 |
| 仮想通貨トレーダー | 雑所得（総合課税）として申告書に自動反映 |

### 非対応

株式投資家（分離課税）、FXトレーダー、不動産所得、退職所得、譲渡所得（不動産売却）、外国税額控除、農業所得・山林所得、白色申告、非居住者。

## インストール方法

### 前提条件

- Python 3.11 以上
- [uv](https://docs.astral.sh/uv/) パッケージマネージャ

### 方法 1: Claude Code プラグイン（フル機能）

```shell
/plugin marketplace add kazukinagata/shinkoku
/plugin install shinkoku@shinkoku
```

### 方法 2: スキルのみインストール（40+ エージェント対応）

```shell
npx skills add kazukinagata/shinkoku
```

特定エージェントにグローバルインストールする場合:

```shell
npx skills add kazukinagata/shinkoku -g -a claude-code -a cursor
```

### CLI のインストール

スキルが内部で `shinkoku` コマンドを呼び出すため、CLIのインストールが必要（通常は `/setup` スキルが自動実行）:

```shell
uv tool install git+https://github.com/kazukinagata/shinkoku
```

## スキル一覧

### メインワークフロー

| スキル | 説明 |
|---|---|
| `/setup` | 初回セットアップ。設定ファイル生成とDB初期化 |
| `/assess` | 確定申告の要否判定（所得税・消費税） |
| `/gather` | 必要書類のチェックリストと取得先の案内 |
| `/journal` | CSV・レシート・請求書・源泉徴収票を取り込み、複式簿記の仕訳を登録 |
| `/settlement` | 減価償却・決算整理仕訳、残高試算表・損益計算書・貸借対照表の生成 |
| `/income-tax` | 所得税額を計算（所得控除・税額控除・復興特別所得税） |
| `/consumption-tax` | 消費税額を計算（2割特例・簡易課税・本則課税） |
| `/submit` | 最終確認チェックリストと提出方法の案内 |
| `/e-tax` | 確定申告書等作成コーナーへの入力代行 |

### 補助スキル

`/tax-advisor`（税務相談）、`/furusato`（ふるさと納税管理）、`/invoice-system`（インボイス制度情報）、`/capabilities`（対応範囲表示）、`/incorporation`（法人成り相談）

### OCR 読取スキル

レシート・源泉徴収票・請求書・控除証明書・支払調書の画像読取に対応（マルチモーダルLLMが必要）。**OCR デュアル検証**機能により、2つのサブエージェントが独立に画像を読み取りクロスチェックを実行できる。

## ブラウザ自動化（e-Tax）

`/e-tax` スキルでは確定申告書等作成コーナーへの入力にブラウザ自動化が必要。3つの方式に対応:

| 方式 | 対象環境 |
|---|---|
| **Claude in Chrome（推奨）** | Windows / macOS のネイティブ Chrome |
| Antigravity Browser Sub-Agent | Windows / macOS / Linux |
| Playwright CLI（β版） | WSL / Linux 等 |

## 使い方

1. **作業ディレクトリの準備**: 任意のディレクトリを作成（リポジトリのcloneは不要）
2. **`/setup`**: 対話形式で初期設定（`shinkoku.config.yaml`生成、`.gitignore`設定、DB初期化）
3. ワークフローに沿ってスキルを実行

### 個人データの保護

`shinkoku.config.yaml`（マイナンバー・住所等）、`shinkoku.db`（帳簿データ）等の個人情報を含むファイルは、gitリポジトリ内で `/setup` を実行すると自動的に `.gitignore` に追加される。

## 技術スタック

- **Python 3.11+** / **SQLite**（WAL モード）
- **Pydantic**（モデル定義・バリデーション）
- **pdfplumber**（PDF 読取）
- **Playwright**（ブラウザ自動化フォールバック）
- Ruff（lint/format）、mypy（型チェック）、pytest（テスト）

## 制限事項・免責

- 令和7年分（2025年課税年度）の税制に基づく
- 生成した申告書・計算結果は**提出前に必ず自身で確認**が必要
- 税法の解釈に不安がある場合は税理士等の専門家への相談を推奨
- 利用によって生じた損害について開発者は責任を負わない

## ライセンス

MIT License
