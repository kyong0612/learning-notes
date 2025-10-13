---
title: "Playwright Agents によるテストの自動生成を試してみた"
source: "https://azukiazusa.dev/blog/playwright-agents/"
author:
  - "azukiazusa1"
published: 2025-10-12
created: 2025-10-13
description: "Playwright v1.56 で導入された Playwright Agents は、Planner、Generator、Healer の 3 つのエージェントで構成されており、アプリケーションコードを解析してテストケースの計画、テストコードの生成、失敗したテストの修正を自動化できます。この記事では、Claude Code から Playwright Agents を呼び出して、シンプルなカンバンアプリのテストコードを自動生成する手順を紹介します。"
tags:
  - "playwright"
  - "claude-code"
  - "MCP"
  - "testing"
  - "automation"
---

## 概要

Playwright v1.56 では、アプリケーションコードを解析してテストコードを自動生成する 3 つのエージェントが導入されました。これらのエージェントは Claude Code などの AI エージェントから呼び出すことができ、テストケースの計画から実装、修正まで自動化できます。この記事では Next.js で作成したカンバンアプリに対して、実際にテストコードを自動生成する手順を紹介しています。

## Playwright Agents の 3 つのエージェント

### 1. Planner

- **役割**: アプリケーションコードを解析し、テストケースの計画を Markdown 形式で生成
- **出力**: `TEST_PLAN.md` ファイルとして詳細なテストシナリオを作成
- **特徴**: プロンプトで指定しなかった詳細な機能も含めて、包括的なテストケースを提案

### 2. Generator

- **役割**: Planner が生成したテストケースの計画をもとに、実際の Playwright テストコードを生成
- **使用ツール**: `playwright-test` MCP の `Setup generator page` ツール
- **出力**: 実行可能な `.spec.ts` ファイル

### 3. Healer

- **役割**: テストを実際に実行し、失敗した場合にテストコードを修正
- **機能**: エラー内容を分析し、適切な修正案を提案・実装
- **特徴**: コンポーネントの HTML 構造やキャッシュの問題など、複数の観点から問題を診断

**重要**: これらのエージェントは順番に実行されることが想定されていますが、それぞれ単体でも利用可能です。

## セットアップ手順

### 1. 初期設定

```bash
npx playwright init-agents --loop=claude
```

このコマンドにより以下のファイルが生成されます：

- `.claude/agents/playwright-test-planner.md`: Planner エージェントの定義
- `.claude/agents/playwright-test-generator.md`: Generator エージェントの定義
- `.claude/agents/playwright-test-healer.md`: Healer エージェントの定義
- `.mcp.json`: playwright-test MCP サーバーの設定
- `tests/seed.spec.ts`: テスト環境設定用の初期ファイル

**注意**: `--loop` オプションは使用している AI エージェントの種類に応じて変更してください。

## 実践: カンバンアプリのテスト自動生成

### ステップ 1: テストシナリオの計画

**プロンプト例**:

```
@agent-playwright-test-planner
カンバンボードアプリの基本的な機能をテストするためのテストケースを計画してください。以下のユーザーストーリーに基づいて、主要な機能を網羅するテストケースをいくつか提案してください。

1. ユーザーはトップページにアクセスして、新しいカンバンボードを作成できる。
2. ユーザーは作成したカンバンボードのページに移動できる。
3. ユーザーはカンバンボード上で新しいタスクを追加できる。
4. ユーザーはタスクをドラッグアンドドロップで別のカラムに移動できる。
```

**生成される成果物**: `TEST_PLAN.md`

**計画内容の例**:

```markdown
# Kanban Board Application - Comprehensive Test Plan

## Test Scenarios

### 1. Board Creation and Management

#### 1.1 Create New Board with Valid Data

**Objective:** Verify that users can successfully create a new board with complete information

**Steps:**
1. Navigate to `http://localhost:3000`
2. Verify the homepage displays with header "Kanban Board"
3. Click the "新規ボード作成" button
4. Type "Project Alpha" in the title field
5. Type description in the description field
6. Click the "作成" button
...
```

**Planner の特徴**:

- プロンプトで指定されていない特殊文字の処理、優先度設定などの詳細なテストケースも自動生成
- アプリケーションコードを解析して、包括的なテストシナリオを作成

### ステップ 2: テストコードの生成

**プロンプト例**:

```
@agent-playwright-test-generator
### 1. Board Creation and Management のテストコードを生成してください。
```

**生成されるコード例**:

```typescript
import { test, expect } from "@playwright/test";
import { resetDatabase, disconnectDatabase } from "./helpers/db-reset";

test.describe("Board Creation and Management", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto("/");
  });

  test.afterAll(async () => {
    await disconnectDatabase();
  });

  test("TC-BC-001: タイトルと説明を含む有効なボード作成", async ({ page }) => {
    await page.getByRole("button", { name: "新規ボード作成" }).click();
    await page.getByLabel("タイトル *").fill("プロジェクトA");
    await page.getByLabel("説明").fill("これは最初のカンバンボードです");
    await page.getByRole("button", { name: "作成" }).click();
    
    await expect(page).toHaveURL(/\/boards\/[a-zA-Z0-9-]+/);
    
    await page.goto("/");
    
    await expect(
      page.getByRole("heading", { name: "プロジェクトA" })
    ).toBeVisible();
    
    await expect(
      page.getByText("これは最初のカンバンボードです")
    ).toBeVisible();
  });
});
```

**テスト実行**:

```bash
npx playwright test tests/board-creation-management.spec.ts
```

### ステップ 3: 失敗したテストの修正

初回実行時、いくつかのテストが失敗する可能性があります。

**エラー例**:

```
Error: expect(locator).toBeVisible() failed
Locator: getByRole('heading', { name: 'プロジェクトA' })
Expected: visible
Timeout: 5000ms
```

**プロンプト例**:

```
@agent-playwright-test-healer
TC-BC-001: タイトルと説明を含む有効なボード作成 のテストが失敗するので、修正してください。
```

**Healer が実施した修正例**:

1. **CardTitle コンポーネントの HTML 要素の修正**
   - **問題**: CardTitle が `<div>` でレンダリングされており、`getByRole("heading")` で見つからない
   - **修正**: `<div>` を `<h3>` に変更してセマンティックな HTML に改善

2. **Next.js キャッシュの問題解決**
   - **問題**: ボード作成後にホームページに戻った際、キャッシュされたページが表示される
   - **修正**: `await page.goto("/")` の後に `await page.reload()` を追加してキャッシュをバイパス

## 技術的な詳細

### 対応フレームワーク・ツール

- **バージョン要件**: Playwright v1.56 以降
- **対応 AI エージェント**: VS Code、Claude Code など
- **テスト対象アプリケーション**: Next.js 15、React 19、TypeScript、PostgreSQL を使用したカンバンアプリ

### MCP（Model Context Protocol）の活用

- Claude Code のプロジェクト単位で MCP サーバーを設定
- `playwright-test` MCP サーバーを `.mcp.json` で定義
- SubAgents として各エージェントを定義し、MCP 経由で呼び出し

### ワークフロー

1. **計画フェーズ**: Planner がアプリケーションコードを解析してテストシナリオを作成
2. **生成フェーズ**: Generator が計画をもとに実装可能なテストコードを生成
3. **修復フェーズ**: Healer が実際にテストを実行し、失敗したテストを分析・修正

## 主要なポイント

### 利点

1. **包括的なテストカバレッジ**: アプリケーションコードを解析し、開発者が見落としがちな詳細なテストケースも生成
2. **時間の削減**: テストケースの計画、コード生成、デバッグを自動化
3. **ベストプラクティスの適用**: アクセシビリティを考慮したセマンティックな HTML の修正など、品質向上の提案も含まれる
4. **柔軟な利用方法**: 3 つのエージェントを個別に使用することも、連携させることも可能

### 注意点

1. **明確なユーザーストーリーの重要性**: より具体的なプロンプトを提供することで、適切なテストシナリオが生成される
2. **初回実行での失敗の可能性**: アプリケーションの実装詳細によっては修正が必要になる場合がある
3. **反復的な改善**: Healer による修正を繰り返すことで、テストの精度が向上

## まとめ

Playwright Agents は AI エージェントと連携することで、テストコードの作成プロセスを大幅に効率化します。Planner、Generator、Healer の 3 つのエージェントが協調して動作し、計画から実装、デバッグまでを自動化します。Claude Code の SubAgents 機能と MCP を活用することで、シームレスにテスト自動生成のワークフローを構築できます。

## 参考リンク

- [Agents | Playwright](https://playwright.dev/docs/test-agents)
- [GitHub - azukiazusa1/vibe-kanban-app](https://github.com/azukiazusa1/vibe-kanban-app)
