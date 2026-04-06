import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { fileParserStep } from '../steps/file-parser-step.js';
import { toolSelectorStep } from '../steps/tool-selector-step.js';
import { updateFileStep } from '../steps/update-file-step.js';
import { gitDiffTool } from '../tools/git-diff-tool.js';

// ツールを直接ステップとして使用する改善されたワークフロー
// この方法により、ToolExecutionContextの問題を回避できます

// ツールをステップに変換
const gitDiffToolStep = createStep(gitDiffTool);

// データ変換用のカスタムステップ
const prepareGitDiffInput = createStep({
  id: 'prepare-git-diff-input',
  description: 'GitDiffツールの入力データを準備',
  inputSchema: z.object({
    targetDirectory: z.string(),
  }),
  outputSchema: z.object({
    targetDirectory: z.string(),
  }),
  execute: async ({ inputData }) => {
    return {
      targetDirectory: inputData.targetDirectory || '/Users/kimkiyong/Dev/learning-notes/articles',
    };
  },
});

// 要約ツール用の条件分岐ステップ
const summaryRouter = createStep({
  id: 'summary-router',
  description: 'ファイルのツールタイプに応じて適切な要約ツールを選択',
  inputSchema: z.object({
    filesWithTool: z.array(
      z.object({
        path: z.string(),
        filename: z.string(),
        sourceUrl: z.string().optional(),
        content: z.string(),
        tool: z.enum(['youtube-mcp', 'web-fetch', 'default']),
      }),
    ),
  }),
  outputSchema: z.object({
    summaries: z.array(
      z.object({
        path: z.string(),
        filename: z.string(),
        summary: z.string(),
        metadata: z.object({
          author: z.string().optional(),
          published: z.string().optional(),
          description: z.string(),
          tags: z.array(z.string()),
        }),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    const summaries = [];

    for (const file of inputData.filesWithTool) {
      // ツールタイプに応じて処理を分岐
      // 注: 実際の実装では、各ツールを個別のステップとして定義し、
      // 条件分岐を使用してワークフローを構築することが推奨されます

      // ここでは簡略化のため、基本的な処理のみを示します
      summaries.push({
        path: file.path,
        filename: file.filename,
        summary: '要約処理が必要です',
        metadata: {
          description: '自動生成された要約',
          tags: ['未処理'],
        },
      });
    }

    return { summaries };
  },
});

// 改善されたワークフロー定義
export const autoSummarizeWorkflowImproved = createWorkflow({
  id: 'auto-summarize-workflow-improved',
  description: '新規追加されたMarkdownファイルを自動要約（改善版）',
  inputSchema: z.object({
    targetDirectory: z.string().describe('監視対象のディレクトリパス'),
  }),
  outputSchema: z.object({
    processedFiles: z
      .array(
        z.object({
          filename: z.string(),
          status: z.enum(['success', 'failed', 'skipped']),
          message: z.string().optional(),
        }),
      )
      .describe('処理結果のリスト'),
  }),
})
  .then(prepareGitDiffInput)
  .then(gitDiffToolStep) // ツールを直接ステップとして使用
  .then(fileParserStep)
  .then(toolSelectorStep)
  .then(summaryRouter) // 要約処理のルーティング
  .then(updateFileStep);

// ワークフローをコミット
autoSummarizeWorkflowImproved.commit();
