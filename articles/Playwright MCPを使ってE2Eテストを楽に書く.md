---
title: "Playwright MCPを使ってE2Eテストを楽に書く"
source: "https://zenn.dev/knowledgework/articles/d859f65a77fc3c"
author:
  - "zi"
published: 2025-09-10
created: 2025-09-11
description: |
  E2Eテストの開発・保守には多くの時間と労力が必要であり、特にロケーターの記述、テストケースの作成、デバッグが手間となる課題がありました。本記事では、Playwright MCPを活用してこれらの課題を解消し、E2Eテストの実装を効率化する取り組みを紹介します。
tags:
  - "AI"
  - "E2Eテスト"
  - "Playwright"
  - "E2E"
  - "Model Context Protocol"
---

ナレッジワークでは、E2Eテストを活用した品質保証に取り組んでいますが、その開発・保守、特に以下の3点に課題がありました。

1. **ロケーターの記述**: 複雑なUI要素の特定と記述に時間がかかる。
2. **テストケースの記述**: ユーザー操作を順序立ててコード化するのに手間がかかる。
3. **テストのデバッグ**: 実行時間が長く、失敗原因の特定と修正に時間を要する。

本記事では、これらの課題をPlaywright MCP（AIエージェントがブラウザ操作を行うためのプロトコル）を活用して解消した取り組みを紹介します。

## 課題

### 1. ロケーターの記述に手間がかかる

E2Eテストでは、操作対象のUI要素（ボタンや入力欄）を特定するためのロケーターを記述する必要があります。開発者ツールを使い、DOM構造やアクセシビリティツリーを確認しながらの作業は、要素が複雑化すると特に時間を要します。

```
// 簡単なボタン
page.getByRole('button', { name: 'ログイン' })

// 複雑な例：モーダル内の特定セクションのテキストエリア
page.getByRole('dialog', { name: 'ユーザー設定' })
    .getByRole('region', { name: 'プロフィール情報' })
    .getByRole('textarea', { name: 'ユーザー名' })
```

### 2. テストケースの記述に手間がかかる

「ログインしてユーザー情報を変更する」といったシンプルなフローでも、`page.fill()`や`page.click()`といった操作を一つ一つコードとして記述する必要があり、手間がかかります。

```typescript
// 「ログインしてユーザー情報を変更する」のテストケース例
test('ログインしてユーザー情報を変更する', async ({ page }) => {
  // ログインページに移動
  await page.goto('https://example.com/login');

  // ユーザー名とパスワード入力
  await page.getByRole('textbox', { name: 'ユーザーID' }).fill('test-user');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('secret');

  // ログインボタンクリック
  await page.getByRole('button', { name: 'ログイン' }).click();
  await expect(page).toHaveURL(/dashboard/);

  // 設定ページに遷移し、プロフィールを編集
  await page.getByRole('link', { name: '設定' }).click();
  await page.getByRole('button', { name: 'プロフィール編集' }).click();

  // モーダル内でユーザー名を変更して保存
  const dlg = page.getByRole('dialog', { name: 'ユーザー設定' });
  await dlg.getByRole('region', { name: 'プロフィール情報' })
           .getByRole('textbox', { name: 'ユーザー名' })
           .fill('新しい名前');
  await dlg.getByRole('button', { name: '保存' }).click();

  // 更新を確認
  await expect(page.getByText('新しい名前')).toBeVisible();
});
```

### 3. テストのデバッグに時間がかかる

E2Eテストは実行自体に時間がかかり、失敗した場合は不適切なロケーターが原因であることが多いです。エラーログから原因を特定し、修正して再実行するサイクルには、一件あたり20〜30分かかることも珍しくありません。

## 解決策

Playwright MCPを活用し、以下の作業をAIに任せることで課題を解消しました。

### 1. ロケーターの記述を任せる

Playwright MCPで実際のプロダクトにアクセスしてAccessibility Snapshotを取得し、それを基にAIにロケーターを抽出させます。Page Object Modelを採用しているため、一度作成すれば再利用が可能です。

**プロンプト例:**

```
https://example.com にPlaywright MCPを使ってアクセスし、Page Object Modelの形で hoge/fuga.ts に実装してください。

- クラス名は Hoge にしてください。
- 各 UI 要素は `getByRole` / `getByLabel` / `getByText` などできる限りアクセシビリティ属性のついたロケーターを利用してください。
```

### 2. テストケースの記述を任せる

作成済みのPage Object Modelを参照させることで、AIが画面構造をある程度推測できるようになります。自然言語で記述したテストケースを基に、AIにコード生成を依頼することで、実装を効率化します。

```typescript
// 自然言語でテストケースを記述
test('ユーザー名を更新できる', async ({ page }) => {
  // TODO: テストケース実装
  // 1. ログインページにアクセスする
  // 2. ユーザーIDとパスワードを入力してログインする
  // ...
})
```

**プロンプト例:**

```
hoge/fuga.spec.ts にかかれているコメントのフローをPage Object Modelを利用しつつ実装してください。
```

### 3. テストのデバッグを任せる

Playwrightはテスト結果をHTMLレポートで出力でき、`npx playwright show-report`で確認できます。このレポートはPlaywright MCPでもアクセス可能です。特にレポート内の「Trace」ビューには、テスト実行時のDOM構造が保持されており、AIはこれを参照して不適切なロケーターを自律的に修正できます。

![Playwright HTML レポートのTrace画面](https://storage.googleapis.com/zenn-user-upload/49d71f38f780-20250909.png)

「テスト実行 → レポート確認 → 修正」のループをAIが回してくれるため、開発者のスイッチングコストが大幅に削減されます。

**プロンプト例:**

```
hoge/fuga.spec.tsのテストを流して、失敗した箇所を修正してください。
テストが失敗した場合、テスト失敗の詳細は http://localhost:9323 に載ってますので、失敗時にplaywright mcpを使ってアクセスして、内容を解析し修正を試みてください。
エラーレポートのTrace ページにより具体的なエラー原因とページのモックがありますので、テストの修正、ロケーターの修正などに利用してください。
```

## 注意点

### コスト面の注意

Playwright MCPはページのスナップショットをコンテキストとして渡すため、トークン消費が激しくなる傾向があります。特にデバッグのループ工程ではトークン消費が増えがちです。Claude Code利用時にはコンテキストの圧縮が頻発し、情報が失われるケースがありました。

## まとめ

Playwright MCPの活用により、E2Eテストの実装を大幅に効率化できました。この方法は、テストケース自体への理解があれば実装可能であるため、E2Eテストの経験が浅いエンジニアやQAエンジニアでも取り組みやすいというメリットがあります。
