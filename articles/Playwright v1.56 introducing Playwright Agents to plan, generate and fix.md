---
title: "Playwright v1.56: introducing Playwright Agents to plan, generate and fix"
source: "https://www.youtube.com/watch?v=_AifxZGxwuk"
author:
  - "Playwright"
  - "[[@griffadev]]"
published: 2025-10-06
created: 2025-10-07
description: |
  Playwright v1.56で導入されたPlaywright Agentsの包括的なガイド。3つのAIエージェント（Planner、Generator、Healer）を使用して、テストプランの自動生成、Playwrightテストの作成、失敗したテストのデバッグと修正を実現。エンドツーエンドテストのAI駆動型ワークフロー構築の完全なチュートリアル。
tags:
  - "playwright"
  - "testing"
  - "ai-agents"
  - "mcp"
  - "test-automation"
  - "e2e-testing"
  - "clippings"
---

## 概要

Playwright v1.56では、MCP（Model Context Protocol）の進化の次のステップとして**Playwright Agents**が導入されました。これらのAIエージェントは、テスト計画の自動生成からテストの実装、失敗したテストのデバッグまで、エンドツーエンドのテスト自動化を実現します。

### 主な機能

- ✅ **テストプランの自動生成** - Planner Agentが包括的なテスト計画を作成
- ✅ **テストコードの自動生成** - Generator Agentがテスト計画に基づいて実際のPlaywrightテストを作成
- ✅ **失敗テストの自動修正** - Healer Agentがデバッグと修正を実行

## セットアップ

### 必要な準備

1. **Playwrightを最新バージョンに更新**

```bash
npm install -D @playwright/test@latest
```

2. **Playwright Agentsを初期化**

```bash
# VS Codeの場合
npx playwright init-agents --loop=vscode

# Claudeの場合
npx playwright init-agents --loop=claude

# OpenCodeの場合
npx playwright init-agents --loop=opencode
```

### シードファイル（Seed File）

エージェントの初期化時に**シードファイル**が生成されます。このファイルは：

- テストの初期状態を設定するために使用
- フィクスチャやセットアップテストを含めることが可能
- エージェントによってテストにコピーされる
- 空白のままでも問題ないが、共通の設定がある場合は有用

**例：映画アプリのシードファイル**

```typescript
import { listTest } from './helpers';

test.use({
  page: listPageFixture
});
```

このシードファイルでは、映画リストページを作成するフィクスチャをインポートし、テストの開始点として設定しています。

## 3つのPlaywright Agents

### 1. Playwright Planner Agent

**役割：** テスト計画の自動生成

#### 動作フロー

1. 対象のWebサイトにナビゲート
2. ログイン処理を実行
3. 機能を探索・分析
4. 包括的なテスト計画を生成

#### 実行例

```
映画リストの管理機能のテスト計画を生成し、
specs フォルダに movies-list-plan として保存してください
```

**結果：** 多数のテストシナリオを含む詳細なテスト計画が生成されます。

### 2. Playwright Generator Agent

**役割：** テスト計画に基づいた実際のテストコードの生成

#### 動作フロー

1. 生成されたテスト計画を読み込み
2. Webサイトをナビゲート
3. 各シナリオを実行・検証
4. ログを確認
5. テストファイルを生成

#### 実行例

```
テスト計画の「映画リストへの追加」セクションから
テストを生成してください
```

**結果：**

- 複数のテストファイルが生成される
- シードファイルのフィクスチャが正しく利用される
- すぐに実行可能なテストコード

### 3. Playwright Healer Agent

**役割：** 失敗したテストのデバッグと修正

#### 動作フロー

1. デバッグモードでテストを実行
2. コンソールログを確認
3. ネットワークレスポンスを分析
4. 問題の原因を特定
5. テストコードを修正

#### 実行例のケーススタディ

**問題：** "Inception"という映画を検索するテストがタイムアウト

**エラー：** `locator click target page context or browser has been closed`

**Healer Agentの分析：**

- APIレスポンスを確認
- "Inception"がAPI結果に存在しないことを発見
- APIは正常に動作していることを確認
- 実際に存在する映画（"Inside Out 2"）に置き換え

**修正内容：**

```diff
- await page.getByText('Inception').click();
+ await page.getByText('Inside').click();
+ await expect(page.getByText('Inside Out 2')).toBeVisible();
```

**結果：** テストが正常に通過

## ワークフロー全体

### ステップバイステップガイド

1. **シードファイルの準備**
   - 必要なフィクスチャとセットアップを定義
   - 初期テストを実行して動作確認

2. **テスト計画の生成**
   - Planner Agentを使用
   - シードファイルをコンテキストに含める
   - 対象機能のテスト計画を生成

3. **テストの生成**
   - Generator Agentを使用
   - 新しいチャットで開始（クリーンなコンテキスト）
   - テスト計画をコンテキストに追加
   - 特定のセクションのテストを生成

4. **テストの実行と検証**
   - 生成されたテストを実行
   - 成功・失敗を確認

5. **テストの修正（必要に応じて）**
   - Healer Agentを使用
   - 失敗したテストの自動デバッグ
   - 修正内容の確認と再実行

6. **変更のコミット**
   - すべてのテストが通過したら変更をコミット
   - 必要に応じて追加のテストを生成

## 重要なポイント

### コンテキスト管理

- **シードファイル：** エージェントがアクセスできるようにファイルを開いておく
- **テスト計画：** Generator Agentのコンテキストに追加する
- **新しいチャット：** 各エージェントで新しいチャットを開始することでクリーンなコンテキストを保つ

### ストレージステート

- ログイン状態を保存することで、セットアップテストを毎回実行する必要がなくなる
- テストの実行速度が向上

### 段階的なアプローチ

- テスト計画全体を一度に生成するのではなく、セクションごとに段階的に進める
- 各段階で変更をコミットし、進捗を追跡

## 技術的な利点

1. **効率化：** テスト作成時間の大幅な削減
2. **品質向上：** AIによる包括的なシナリオカバレッジ
3. **自動デバッグ：** 失敗原因の自動特定と修正
4. **学習効果：** 生成されたテストから実装パターンを学べる
5. **一貫性：** シードファイルによるテスト間の一貫した設定

## ドキュメント

詳細な情報は公式ドキュメントを参照してください：
<https://playwright.dev/docs/test-agents>

## まとめ

Playwright Agentsは、エンドツーエンドテストの自動化における革新的なアプローチです。3つのエージェント（Planner、Generator、Healer）を組み合わせることで、テスト計画からデバッグまでの完全なAI駆動型ワークフローを実現し、開発者の生産性を大幅に向上させます。

---

**ビデオの章立て**

- 0:00 - Playwright Agentsの紹介
- 0:52 - シードファイルでのセットアップ
- 2:15 - Planner Agent – テストプランの生成
- 3:11 - Generator Agent – テストファイルの作成
- 4:16 - Healer Agent – 失敗したテストの修正
- 4:39 - すべての実行と確認
