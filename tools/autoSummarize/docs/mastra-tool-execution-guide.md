# Mastra ツール実行ガイド

## 問題の概要

MastraのステップからツールをPLUG呼び出しする際、ToolExecutionContextの不一致により問題が発生しています。

## 問題の原因

1. ツールのexecuteメソッドは完全なToolExecutionContextオブジェクトを期待
2. ステップから呼び出す際、contextプロパティのみを渡していた
3. Mastra GitHub Issue #4255で報告されている既知のバグ

## 修正方法

### 方法1: 暫定的な回避策（現在適用済み）

```typescript
const result = await gitDiffTool.execute({
  context: {
    targetDirectory: targetDirectory
  },
  threadId: undefined,
  resourceId: undefined,
  runtimeContext: {}
} as any);
```

### 方法2: ツールを直接ステップとして使用（推奨）

```typescript
import { createStep } from "@mastra/core";

// ツールを直接ステップに変換
const gitDiffStep = createStep(gitDiffTool);

// ワークフローで使用
const workflow = createWorkflow({...})
  .then(gitDiffStep)
  .then(nextStep);
```

### 方法3: カスタムステップ内でツールの機能を再実装

```typescript
export const gitDiffStep = createStep({
  id: "git-diff-step",
  execute: async ({ inputData }) => {
    // ツールのロジックを直接実装
    const { stdout } = await execAsync(
      `git diff --cached --name-status --diff-filter=A`,
      { cwd: inputData.targetDirectory }
    );
    // ... 処理続行
  }
});
```

## 今後の改善点

1. Mastraの新しいバージョンにアップグレードして、バグ修正を適用
2. ワークフロー設計を見直し、ツールを直接ステップとして使用
3. mastraパラメータの活用方法を調査（executeTool メソッドなど）

## 参考リンク

- [Mastra GitHub Issue #4255](https://github.com/mastra-ai/mastra/issues/4255)
- [Mastra ドキュメント - Using Tools with Workflows](https://mastra.ai/docs/workflows/using-with-agents-and-tools)