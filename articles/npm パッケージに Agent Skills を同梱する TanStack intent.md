---
title: "npm パッケージに Agent Skills を同梱する TanStack intent"
source: "https://azukiazusa.dev/blog/tanstack-intent-to-bundle-agent-skills-with-npm-packages/"
author:
  - "[[azukiazusaのテックブログ2]]"
published: 2026-03-15
created: 2026-03-16
description: "ライブラリのメンテナが Agent Skills を生成・検証して npm パッケージに同梱することを支援するツールである `@tanstack/intent` を使用して、ライブラリの使用者側と、メンテナ側の両方の観点から Agent Skills を利用する方法を紹介します。"
tags:
  - "clippings"
  - "TanStack"
  - "Agent Skills"
  - "npm"
  - "AI Coding Agent"
  - "LLM"
  - "DX"
---

## 背景：なぜ Agent Skills が必要か

コーディングエージェントが生成するコードの品質は、LLM の学習データの量と質に大きく依存する。React のような人気ライブラリは訓練データに豊富に含まれるため高品質なコードが生成されやすい一方、**LLM のカットオフ以降に公開された新興ライブラリ**ではエージェントが誤った使い方をするリスクが高い。

この問題への対策として、AGENTS.md（CLAUDE.md）や Agent Skills のようなコンテキストをエージェントに渡す方法が広まっている。Next.js が `node_modules` にドキュメントを同梱したり、React Remotion や Motia がプロジェクト作成時に Agent Skills を同梱するなど、ライブラリ提供者側の取り組みも進んでいる。

### スキル管理の課題

- GitHub 上で公開されたスキルは手動コピペや CLI での反映が必要で、**更新の追跡方法が確立されていない**
- 手動更新は次第に滞り、ライブラリの破壊的変更後にスキルが陳腐化するリスクがある
- エージェントが生成するコードの品質低下がスキル更新忘れに起因していると気づきにくい

## `@tanstack/intent` とは

`@tanstack/intent` は、ライブラリメンテナが Agent Skills を**生成・検証して npm パッケージに同梱する**ことを支援するツール。`npm update` でライブラリのバージョンが更新されればスキルも同時に更新されるため、スキルの陳腐化問題を解決する。

> [!WARNING]
> Agent Skills にはプロンプトインジェクションや任意スクリプト実行などのセキュリティリスクが伴う。第三者からインストールする際はスキルの内容を十分に確認すること。

## ライブラリ使用者側のワークフロー

`@tanstack/intent` でスキルが同梱されたライブラリでは、`node_modules` 内の `skills/` ディレクトリにスキルが含まれる。

### 主要コマンド

| コマンド | 説明 |
|---|---|
| `npx @tanstack/intent@latest list` | インストール済み依存関係から Agent Skills を検出・一覧表示 |
| `npx @tanstack/intent@latest install` | エージェント設定ファイルへのスキルマッピングセットアップ用プロンプトを出力 |
| `npx @tanstack/intent@latest stale` | スキルが最新のソースコードを参照しているか確認 |

### `install` コマンドの動作

`install` コマンドが出力するプロンプトは、以下のタスクをエージェントに指示する：

1. **既存マッピングの確認** — CLAUDE.md、AGENTS.md、`.cursorrules` 等に既存のスキルマッピングブロック（`<!-- intent-skills:start/end -->`）があるか確認
2. **利用可能スキルの発見** — `intent list` を実行してスキル一覧を取得
3. **リポジトリのスキャン** — プロジェクト構造を把握し、3〜5のスキルとタスクのマッピングを提案
4. **マッピングブロックの書き込み** — CLAUDE.md（優先）にスキルマッピングを記録

### 使用例

```bash
npx @tanstack/intent@latest install | claude
```

エージェントがプロジェクト内容に基づいてスキルとタスクのマッピングを提案し、`CLAUDE.md` に以下のような形式で書き込む：

```markdown
<!-- intent-skills:start -->
# Skill mappings — when working in these areas, load the linked skill file into context.
skills:
- task: "localStorage を使った TODO コレクションのセットアップ"
  load: "node_modules/@tanstack/db/skills/db-core/collection-setup/SKILL.md"
- task: "TODO の一覧表示・フィルタリング・検索など、ライブクエリの実装"
  load: "node_modules/@tanstack/db/skills/db-core/live-queries/SKILL.md"
<!-- intent-skills:end -->
```

`node_modules` のスキルを参照するため、**npm パッケージ更新時にスキルも自動的に更新**される。

## ライブラリメンテナ側のワークフロー

### Agent Skills の生成

```bash
npx @tanstack/intent@latest scaffold | claude
```

`scaffold` コマンドが出力するプロンプトは、以下の3ステップでスキルを生成する：

| ステップ | 内容 | 成果物 |
|---|---|---|
| Step 1: Domain Discovery | ライブラリの内容をスキャンしドメインマップを作成 | `domain_map.yaml`, `skill_spec.md` |
| Step 2: Tree Generator | スキルツリーの構造を決定 | `skill_tree.yaml` |
| Step 3: Generate Skills | 個々のスキルファイルを生成 | `SKILL.md` ファイル群 |

各ステップ完了後にメンテナのレビュー・確認を挟む設計。

### スキル生成後の手順

1. `npx @tanstack/intent validate` でスキルの形式を検証
2. `npx @tanstack/intent add-library-bin` で `bin/intent.mjs` シムファイルを生成（ユーザーが `npx intent` で CLI を起動可能に）
3. `npx @tanstack/intent edit-package-json` で `package.json` に `files` フィールドを追加（`skills/` ディレクトリを含める）
4. GitHub ラベルの作成（`skill:<skill-name>`）
5. README に `npx @tanstack/intent@latest install` の案内を追記
6. Agent Skills Registry 登録のため `package.json` の `keywords` に `tanstack-intent` を追加

### Agent Skills の継続的な更新

```bash
npx @tanstack/intent@latest setup-github-actions
```

以下の GitHub Actions ワークフローが生成される：

| ワークフロー | 説明 |
|---|---|
| `check-skills` | 新バージョン公開時に古いスキルを自動検出し、更新用プロンプト付きの PR を自動作成 |
| `notify-intent` | ドキュメント/ソースコード変更時に `tanstack/intent` リポジトリへ Webhook を送信し、整合性チェックをトリガー |
| `validate-skills` | `/skills` ディレクトリ変更のある PR で、スキル形式の正当性を自動チェック |

## まとめ

- **使用者側**: `install` コマンドでスキルマッピングをセットアップ。`npm update` でスキルも自動更新
- **メンテナ側**: `scaffold` コマンドでスキルを生成し、npm パッケージに同梱。GitHub Actions で継続的にスキルの鮮度を維持
- Agent Skills を npm パッケージに同梱することで、**バージョン管理と同期されたスキル更新**という課題を解決
- LLM カットオフ後のライブラリでもエージェントの生成コード品質を改善可能

## 参考

- [Agent Skills Registry | TanStack Intent](https://tanstack.com/intent/registry?tab=packages&sort=downloads&page=0&view=grid)
- [Overview | TanStack Intent Docs](https://tanstack.com/intent/latest/docs/overview)
- [Introducing TanStack Intent: Ship Agent Skills with your npm Packages | TanStack Blog](https://tanstack.com/blog/from-docs-to-agents)
