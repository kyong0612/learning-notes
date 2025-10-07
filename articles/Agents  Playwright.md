---
title: "Agents | Playwright"
source: "https://playwright.dev/docs/test-agents"
author:
published:
created: 2025-10-07
description: "Playwrightには3つのエージェント（planner、generator、healer）が組み込まれており、これらを使用してテストプランの作成、Playwrightテストファイルの生成、失敗したテストの自動修復を行うことができます。これらのエージェントは独立して使用することも、順次使用することも、エージェントループとして連鎖させることもできます。"
tags:
  - "playwright"
  - "testing"
  - "agents"
  - "automation"
  - "ai"
  - "test-generation"
---

## 概要

Playwrightには、3つのPlaywright Agentが標準で付属しています：**🎭 planner**、**🎭 generator**、**🎭 healer**。

これらのエージェントは独立して使用することも、順次使用することも、エージェントループ内で連鎖して使用することもできます。順次使用することで、プロダクトのテストカバレッジを生成できます。

- **🎭 planner**: アプリを探索し、Markdown形式のテストプランを作成
- **🎭 generator**: MarkdownプランをPlaywrightテストファイルに変換
- **🎭 healer**: テストスイートを実行し、失敗したテストを自動修復

### はじめに

`init-agents`コマンドを使用して、Playwright Agentの定義をプロジェクトに追加します。これらの定義は、新しいツールや指示を取り込むため、Playwrightの更新時に再生成する必要があります。

```bash
# VS Code用
npx playwright init-agents --loop=vscode

# Claude Code用
npx playwright init-agents --loop=claude

# OpenCode用
npx playwright init-agents --loop=opencode
```

エージェントが生成されたら、選択したAIツールを使用してこれらのエージェントに指示し、Playwrightテストを構築できます。

## 🎭 Planner（プランナー）

プランナーエージェントはアプリを探索し、1つまたは複数のシナリオやユーザーフローのテストプランを作成します。

### 必要な入力

- プランナーへの明確なリクエスト（例：「ゲストチェックアウトのプランを生成して」）
- アプリとやり取りするために必要な環境をセットアップする`seed test`
- *(オプション)* コンテキスト用のプロダクト要求ドキュメント（PRD）

### プロンプトの書き方

- `seed.spec.ts`をプランナーのコンテキストに含める
- プランナーはこのテストを実行し、グローバルセットアップ、プロジェクト依存関係、必要なフィクスチャとフックを含むすべての初期化を実行
- プランナーはこのseedテストを、生成されるすべてのテストの例としても使用

### seed.spec.tsの例

```typescript
import { test, expect } from './fixtures';

test('seed', async ({ page }) => {
  // このテストは./fixturesのカスタムフィクスチャを使用
});
```

### 生成される出力

- `specs/basic-operations.md`として保存されるMarkdown形式のテストプラン
- プランは人間が読めるが、テスト生成に十分な精度を持つ

### 出力例: specs/basic-operations.md

```markdown
# TodoMVC Application - Basic Operations Test Plan

## Application Overview

TodoMVCアプリケーションは、標準的なtodoアプリケーション機能を示すReactベースのtodoリストマネージャーです。主な機能：

- **タスク管理**: 個々のtodoの追加、編集、完了、削除
- **一括操作**: すべてのtodoを完了/未完了にマーク、完了済みtodoをすべてクリア
- **フィルタリングシステム**: URLルーティングサポート付きのAll、Active、Completed状態でtodoを表示
- **リアルタイムカウンター**: アクティブ（未完了）todo数の表示
- **インタラクティブUI**: ホバー状態、その場編集機能、レスポンシブデザイン
- **状態の永続化**: セッションナビゲーション中の状態維持

## Test Scenarios

### 1. Adding New Todos

**Seed:** `tests/seed.spec.ts`

#### 1.1 Add Valid Todo

**Steps:**
1. "What needs to be done?" 入力フィールドをクリック
2. "Buy groceries" と入力
3. Enterキーを押す

**Expected Results:**
- 未チェックのチェックボックス付きでtodoがリストに表示される
- カウンターに "1 item left" と表示される
- 入力フィールドがクリアされ、次のエントリの準備ができる
- todoリストコントロールが表示される（すべて完了としてマークするチェックボックス）
```

## 🎭 Generator（ジェネレーター）

ジェネレーターエージェントは、Markdownプランを使用して実行可能なPlaywrightテストを生成します。シナリオを実行しながら、セレクターとアサーションをライブで検証します。Playwrightは生成ヒントをサポートし、効率的な構造的・動作的検証のためのアサーションカタログを提供します。

### 必要な入力データ

- `specs/`からのMarkdownプラン

### プロンプトの指定方法

- `basic-operations.md`をジェネレーターのコンテキストに含める
- これによりジェネレーターはテストプランをどこから取得するかを認識

### 生成結果

- `tests/`配下のテストスイート
- 生成されたテストには初期エラーが含まれる場合があり、healerエージェントによって自動的に修復可能

### 出力例: tests/add-valid-todo.spec.ts

```typescript
// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Adding New Todos', () => {
  test('Add Valid Todo', async ({ page }) => {
    // 1. "What needs to be done?" 入力フィールドをクリック
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    await todoInput.click();

    // 2. "Buy groceries" と入力
    await todoInput.fill('Buy groceries');

    // 3. Enterキーを押す
    await todoInput.press('Enter');

    // 期待される結果:
    // - 未チェックのチェックボックス付きでtodoがリストに表示される
    await expect(page.getByText('Buy groceries')).toBeVisible();
    const todoCheckbox = page.getByRole('checkbox', { name: 'Toggle Todo' });
    await expect(todoCheckbox).toBeVisible();
    await expect(todoCheckbox).not.toBeChecked();

    // - カウンターに "1 item left" と表示される
    await expect(page.getByText('1 item left')).toBeVisible();

    // - 入力フィールドがクリアされ、次のエントリの準備ができる
    await expect(todoInput).toHaveValue('');
    await expect(todoInput).toBeFocused();

    // - todoリストコントロールが表示される（すべて完了としてマークするチェックボックス）
    await expect(page.getByRole('checkbox', { name: '❯Mark all as complete' })).toBeVisible();
  });
});
```

## 🎭 Healer（ヒーラー）

テストが失敗した場合、healerエージェントは：

- 失敗したステップを再実行
- 現在のUIを検査して同等の要素やフローを特定
- パッチを提案（例：ロケーターの更新、wait調整、データ修正）
- テストが成功するまで、またはガードレールがループを停止するまで再実行

### 必要な情報

- 失敗したテスト名

### 修復結果

- 成功したテスト、またはhealerが機能が壊れていると判断した場合はスキップされたテスト

## アーティファクトと規約

静的なエージェント定義と生成されたファイルは、シンプルで監査可能な構造に従います：

```text
repo/
  .github/                    # エージェント定義
  specs/                      # 人間が読めるテストプラン
    basic-operations.md
  tests/                      # 生成されたPlaywrightテスト
    seed.spec.ts              # 環境用のseedテスト
    tests/create/add-valid-todo.spec.ts
  playwright.config.ts
```

### エージェント定義

内部的には、エージェント定義は指示とMCPツールの集合です。これらはPlaywrightによって提供され、Playwrightの更新時に再生成する必要があります。

**Claude Code用のサブエージェントの例:**

```bash
npx playwright init-agents --loop=vscode
```

### `specs/`内のSpec

Specは、シナリオを人間が読める形式で説明する構造化されたプランです。ステップ、期待される結果、データが含まれます。Specはゼロから開始することも、seedテストを拡張することもできます。

### `tests/`内のテスト

生成されたPlaywrightテストで、可能な限りspecと1対1で対応しています。

### Seedテスト `seed.spec.ts`

Seedテストは、実行をブートストラップするためにすぐに使用できる`page`コンテキストを提供します。

## 重要なポイント

- **柔軟な使用**: 3つのエージェントは独立して使用することも、順次実行することも可能
- **自動化されたワークフロー**: テストプランの作成からテスト生成、エラー修復まで自動化
- **AIツール統合**: VS Code、Claude Code、OpenCodeなど、様々なAIツールと統合可能
- **監査可能な構造**: すべてのアーティファクトが明確な規約に従って整理される
- **人間とAIの協調**: Markdown形式のプランにより、人間による確認と編集が容易
