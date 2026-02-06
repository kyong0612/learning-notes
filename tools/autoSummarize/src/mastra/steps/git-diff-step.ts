import { createStep } from '@mastra/core';
import { z } from 'zod';
import { gitDiffTool } from '../tools/git-diff-tool.js';

export const gitDiffStep = createStep({
  id: 'git-diff-step',
  description: '新規追加されたMarkdownファイルを検出',
  inputSchema: z.object({
    targetDirectory: z.string().describe('検出対象のディレクトリパス'),
  }),
  outputSchema: z.object({
    newFiles: z
      .array(
        z.object({
          path: z.string().describe('ファイルの絶対パス'),
          filename: z.string().describe('ファイル名'),
        }),
      )
      .describe('新規追加されたMarkdownファイルのリスト'),
  }),
  execute: async ({ inputData }) => {
    const targetDirectory =
      inputData.targetDirectory || '/Users/kimkiyong/Dev/learning-notes/articles';
    console.log(`Detecting new Markdown files in: ${targetDirectory}`);

    try {
      // GitDiffツールを使用して新規ファイルを検出
      const result = await gitDiffTool.execute({
        context: {
          targetDirectory: targetDirectory,
        },
      } as any);

      console.log(`Found ${result.newFiles.length} new Markdown files`);

      return {
        newFiles: result.newFiles,
      };
    } catch (error) {
      console.log('Warning: Error in GitDiffStep:', error);

      // エラー時は空の配列を返す
      return {
        newFiles: [],
      };
    }
  },
});
