import fs from 'node:fs/promises';
import { createStep } from '@mastra/core';
import { z } from 'zod';

export const fileParserStep = createStep({
  id: 'file-parser-step',
  description: 'MarkdownファイルのソースURLを解析',
  inputSchema: z.object({
    newFiles: z
      .array(
        z.object({
          path: z.string(),
          filename: z.string(),
        }),
      )
      .describe('新規Markdownファイルのリスト'),
  }),
  outputSchema: z.object({
    filesWithSource: z
      .array(
        z.object({
          path: z.string(),
          filename: z.string(),
          sourceUrl: z.string().optional(),
          content: z.string(),
        }),
      )
      .describe('ソースURL付きのファイル情報'),
  }),
  execute: async ({ inputData }) => {
    console.log(`Parsing ${inputData.newFiles.length} Markdown files`);

    const filesWithSource = await Promise.all(
      inputData.newFiles.map(async (file) => {
        try {
          // ファイルの内容を読み込む
          const content = await fs.readFile(file.path, 'utf-8');

          // ソースURLを抽出（最初の行に "source: URL" の形式で記載されていると仮定）
          const sourceMatch = content.match(/^source:\s*(.+)$/m);
          const sourceUrl = sourceMatch ? sourceMatch[1].trim() : undefined;

          // メタデータセクションを解析
          const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const metadata: Record<string, string> = {};

          if (metadataMatch) {
            const metadataSection = metadataMatch[1];
            const lines = metadataSection.split('\n');

            for (const line of lines) {
              const [key, ...valueParts] = line.split(':');
              if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value;
              }
            }
          }

          return {
            path: file.path,
            filename: file.filename,
            sourceUrl: sourceUrl || metadata.source,
            content,
          };
        } catch (error) {
          console.log(`Warning: Error parsing file ${file.path}:`, error);

          // エラー時はファイル情報のみ返す
          return {
            path: file.path,
            filename: file.filename,
            sourceUrl: undefined,
            content: '',
          };
        }
      }),
    );

    return {
      filesWithSource,
    };
  },
});
