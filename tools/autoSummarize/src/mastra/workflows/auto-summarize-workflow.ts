import { createWorkflow } from '@mastra/core';
import { z } from 'zod';
import { fileParserStep } from '../steps/file-parser-step.js';
import { gitDiffStep } from '../steps/git-diff-step.js';
import { summaryStep } from '../steps/summary-step.js';
import { toolSelectorStep } from '../steps/tool-selector-step.js';
import { updateFileStep } from '../steps/update-file-step.js';

// ワークフローを定義
const autoSummarizeWorkflow = createWorkflow({
  id: 'autoSummarizeWorkflow',
  description: '新規追加されたMarkdownファイルを自動要約',
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
  .then(gitDiffStep)
  .then(fileParserStep)
  .then(toolSelectorStep)
  .then(summaryStep)
  .then(updateFileStep);

// ワークフローをコミット
autoSummarizeWorkflow.commit();

export { autoSummarizeWorkflow };
